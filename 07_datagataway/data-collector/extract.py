
import json
import mongoengine as mongo



data = {}

with open('20230308.json') as f:
    s = f.readall()
    data = json.loads(s)

print(data)

