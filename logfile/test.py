import requests
import logging

logging.basicConfig(filename='train-ticket.log', level=logging.DEBUG)
service_name = 'ts-user-service'
url = f'http://192.168.3.203:5000/api/traces?service={service_name}'
response = requests.get(url)
logging.debug(response.content.decode())