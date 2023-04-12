import datetime
import json
import time
import requests
import csv
import pandas as pd
import microservice_list as ms
import schedule
import time


def job():
    #Calulating the TimeStamp
    now = datetime.datetime.now()

    #Current TimeStamp
    date_stamp = str(int(time.mktime(now.timetuple())))
    data_microsecond = str("%06d"%now.microsecond)
    date_stamp = date_stamp+data_microsecond

    #last 5 mins TimeStamp
    before_time = now - datetime.timedelta(minutes = 5)
    pass_stamp = str(int(time.mktime(before_time.timetuple())))
    pass_stamp_microsecond = str("%06d"%before_time.microsecond)
    pass_stamp += pass_stamp_microsecond

    print("Starting obtain the microservice data")

    #Processing Data from JSON fromat
    with open('logging.csv', mode= 'w', newline='') as file:
        writer = csv.writer(file) #ready to write
        writer.writerow(['TraceID', 'StartTime','OperationName','Source','Target'])#logging file header

        for service_name in ms.list:
            print(service_name)
            # Sending the API request and get the microservice trace
            url = f'http://192.168.3.203:5000/api/traces?end={date_stamp}&limit=20&lookback=5m&maxDuration&minDuration&service={service_name}&start={pass_stamp}'
            response = requests.get(url)
            #getting JSON format data
            data = json.loads(response.text)

            for trace in data['data']:
                process_service = trace['processes']
                for span in trace['spans']:
                    operationName = span['operationName']
                    if operationName == 'GET' or operationName == 'POST': # only get the data since operation name is GET or POST
                        traceID = span['traceID']
                        startTime = span['startTime']
                        processID = span['processID']
                        urlName = next((tag['value'] for tag in span['tags'] if tag['key'] == 'http.url'), 'Unknown') #get  target node
                        target = urlName.split("//")[1].split("/")[0].split(":")[0] # url sting to node name
                        source = process_service[processID]['serviceName'] #get the source node name
                        writer.writerow([traceID, startTime,operationName,source,target]) #write all element to a CSV file
                    else:
                        continue
                    
    print('Data has been saved.....')
    print('Processing CSV file Sorted......')
    df = pd.read_csv('logging.csv')
    df = df.sort_values(['TraceID','StartTime'], ascending=True) # sort data
    df.to_csv('logging.csv', index=False) 


schedule.every(10).seconds.do(job)

while True:
    schedule.run_pending()
    time.sleep(10)