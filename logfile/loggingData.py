from flask import Flask, jsonify
import datetime
import json
import time
import requests
import microservice_list as ms
import schedule
from flask_cors import CORS #pip install -U flask-cors

ipaddr = input("Enter the IP address& Port: ")
options = input("Tracing 5m or ALL: ")
app = Flask(__name__)
CORS(app)

@app.route('/logging', methods=['GET','POST'])
def get_logging_data():
    # data = {"nodes": [], "links": []}
    data = job()
    return jsonify(data)

def job():
    # Calculating the TimeStamp
    now = datetime.datetime.now()

    # Current TimeStamp
    date_stamp = str(int(time.mktime(now.timetuple())))
    data_microsecond = str("%06d" % now.microsecond)
    date_stamp = date_stamp + data_microsecond

    # last 5 mins TimeStamp
    before_time = now - datetime.timedelta(minutes=5)
    pass_stamp = str(int(time.mktime(before_time.timetuple())))
    pass_stamp_microsecond = str("%06d" % before_time.microsecond)
    pass_stamp += pass_stamp_microsecond

    print("Starting obtain the microservice data")

    output_data = {"nodes": [], "links": []}
    unique_source_target_pairs = set()
    unique_nodes = set()

    for service_name in ms.list:
        print(service_name)
        # Sending the API request and get the microservice trace
        if(options == "5m"):
            url = f'http://192.168.3.203:5000/api/traces?end={date_stamp}&limit=20&lookback=5m&maxDuration&minDuration&service={service_name}&start={pass_stamp}'
        else:
            url = f'http://{ipaddr}/api/traces?service={service_name}'
            
        response = requests.get(url)
        # getting JSON format data
        data = json.loads(response.text)

        for trace in data['data']:
            process_service = trace['processes']
            for span in trace['spans']:
                operationName = span['operationName']
                if operationName == 'GET' or operationName == 'POST':  # only get the data since operation name is GET or POST
                    traceID = span['traceID']
                    startTime = span['startTime']
                    processID = span['processID']
                    urlName = next((tag['value'] for tag in span['tags'] if tag['key'] == 'http.url'), 'Unknown')  # get target node
                    target = urlName.split("//")[1].split("/")[0].split(":")[0]  # url string to node name
                    source = process_service[processID]['serviceName']  # get the source node name

                    pair_key = (source, target)

                    if pair_key in unique_source_target_pairs:
                        for link in output_data["links"]:
                            if link["source"] == source and link["target"] == target:
                                link["frequence"] = link["frequence"] + 1

                    if pair_key not in unique_source_target_pairs:
                        unique_source_target_pairs.add(pair_key)
                        output_data["links"].append({"source": source, "target": target, "frequence": 0})

                        if source not in unique_nodes:
                            output_data["nodes"].append({"id": source, "TraceID": traceID, "StartTime": startTime, "color": "#19A7CE", "textcolor" : "Black"})
                            unique_nodes.add(source)

                        if target not in unique_nodes:
                            output_data["nodes"].append({"id": target, "TraceID": traceID, "StartTime": startTime, "color": "#19A7CE", "textcolor" : "Black"})
                            unique_nodes.add(target)

                else:
                    continue

    print('Data has been saved.....')

    # with open("logging.json", "w") as json_file:
    #     json.dump(output_data, json_file, indent=2)
    print("JSON file has been saved.")

    return output_data


@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()