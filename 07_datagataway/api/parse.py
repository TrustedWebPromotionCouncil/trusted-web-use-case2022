import json


#t1 = 'data/id=6/data/type=voltage/val'
t1 = 'data/id=6/data/type=voltage/val'
t2 = 'data/id=11/data/type=amperage/val'

ooo = {"id": "1", "time": 1676386891.6939633, "data": [{"id": "4", "data": [{"type": "tempreture", "val": "18.8", "unit": "C"}, {"type": "humidity", "val": "15.5", "unit": "%"}]}, {"id": "2", "data": [{"type": "tempreture", "val": "9.0", "unit": "C"}, {"type": "humidity", "val": "27.7", "unit": "%"}]}, {"id": "3", "data": [{"type": "tempreture", "val": "20.0", "unit": "C"}, {"type": "humidity", "val": "14.9", "unit": "%"}]}, {"id": "1", "data": [{"type": "brightness", "val": "0", "unit": "Lux"}]}, {"id": 5, "data": [{"type": "voltage", "val": "104.95", "unit": "V"}]}, {"id": 6, "data": [{"type": "voltage", "val": "105.25", "unit": "V"}]}, {"id": 7, "data": [{"type": "amperage", "val": "0.0", "unit": "A"}]}, {"id": 8, "data": [{"type": "amperage", "val": "0.0", "unit": "A"}]}, {"id": 9, "data": [{"type": "amperage", "val": "3.32", "unit": "A"}]}, {"id": 10, "data": [{"type": "amperage", "val": "0.83", "unit": "A"}]}, {"id": 11, "data": [{"type": "amperage", "val": "0.75", "unit": "A"}]}, {"id": 12, "data": [{"type": "voltage", "val": "230.7", "unit": "V"}]}, {"id": 13, "data": [{"type": "tempreture", "val": "20", "unit": "C"}]}, {"id": 14, "data": [{"type": "capacity", "val": "18", "unit": "%"}]}, {"id": 15, "data": [{"type": "amperage", "val": "-1.6", "unit": "A"}]}, {"id": 16, "data": [{"type": "powerunit", "val": "-369", "unit": "W"}]}, {"id": 17, "data": [{"type": "tempreture", "val": "32", "unit": "C"}]}, {"id": 18, "data": [{"type": "voltage", "val": "0.0", "unit": "V"}]}, {"id": 19, "data": [{"type": "amperage", "val": "0.0", "unit": "A"}]}, {"id": 20, "data": [{"type": "powerunit", "val": "0", "unit": "W"}]}, {"id": 21, "data": [{"type": "voltage", "val": "100.9", "unit": "V"}]}, {"id": 22, "data": [{"type": "amperage", "val": "1.2", "unit": "A"}]}, {"id": 23, "data": [{"type": "supplyunit", "val": "48", "unit": "VA"}]}, {"id": 24, "data": [{"type": "powerunit", "val": "132", "unit": "W"}]}, {"id": 25, "data": [{"type": "voltage", "val": "100.9", "unit": "V"}]}, {"id": 26, "data": [{"type": "amperage", "val": "3.4", "unit": "A"}]}, {"id": 27, "data": [{"type": "supplyunit", "val": "284", "unit": "VA"}]}, {"id": 28, "data": [{"type": "powerunit", "val": "360", "unit": "W"}]}, {"id": 29, "data": [{"type": "frequency", "val": "60.0", "unit": "Hz"}]}]}

def get_value(tag, oo):
    r = oo
    for o in tag.split('/'):
        o = o.strip()
        if '=' in o:
            x, y = o.split('=')
            r = dict_in_list(r, x, y)
        elif o in r:
            r = r[o]
        else:
            r = r
    return r

def dict_in_list(oo, n, v):
    for i in oo:
        if str(i[n])==v:
            return i
    return oo



print(get_value(t1, ooo))
print(get_value(t2, ooo))


#record = dict_in_list(ooo['data'], 'id', 28)
#print(record)
