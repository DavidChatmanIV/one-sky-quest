import requests
from bs4 import BeautifulSoup

url =
response = requests.get(url)

soup = BeautifulSoup(response.text, 'html.parser')

airports = []


with open('airports.json', 'w') as f:
    import json
    json.dump(airports, f, indent=4)