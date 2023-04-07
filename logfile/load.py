import datetime
import json
import time
import requests


service_name = 'ts-train-service'

now = datetime.datetime.now()

date_stamp = str(int(time.mktime(now.timetuple())))
data_microsecond = str("%06d"%now.microsecond)
date_stamp = date_stamp+data_microsecond

#Pass 5 mins time to timestamp(Nanosecond)
before_time = now - datetime.timedelta(minutes = 5)
pass_stamp = str(int(time.mktime(before_time.timetuple())))
pass_stamp_microsecond = str("%06d"%before_time.microsecond)
pass_stamp += pass_stamp_microsecond

print("Starting obtain the microservice data")
# Sending the API request and get the microservice trace
url = f'http://192.168.3.203:5000/api/traces?end={date_stamp}&limit=20&lookback=5m&maxDuration&minDuration&service={service_name}&start={pass_stamp}'
response = requests.get(url)

#getting JSON format data
data = json.loads(response.text)

#load the JSON format to a file
with open('data.json', 'w') as f:
    json.dump(data, f, indent=4)
print('Data has been saved.....')
