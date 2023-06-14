
import urllib3
import json
import asyncio

from time import time, sleep
from uuid import uuid4
from datetime import datetime
from base64 import b64encode, b64decode

from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel
import mongoengine as mongo

from auth import get_current_active_user, OAEP
from conf import Conf
from acapy import Acapy
from did import VC, DID


from models import StdResp, DCSchema, Workflow
from datastore import IPFS, Envelop, Wallet, MessageQueue

from Crypto.Cipher import PKCS1_OAEP
from Crypto.PublicKey import RSA


router = APIRouter(
    prefix="/wallet",
    tags=["Data Wallet"],
    # dependencies=[Depends(get_current_active_user)]
)

class DataCarbon(mongo.Document):
    time = mongo.IntField()
    client = mongo.StringField()
    site = mongo.StringField()
    sensor = mongo.StringField()
    month = mongo.IntField()
    date = mongo.IntField()
    hour = mongo.IntField()
    times = mongo.IntField()
    period_x = mongo.IntField()
    period_y = mongo.IntField()
    data = mongo.DictField()



class DataWalker(object):

    oo = None
    tag = ''

    def __init__(self, o):
        self.oo = o

    def parse(self, tag):
        r = self.oo
        for o in tag.split('/'):
            o = o.strip()
            if '=' in o:
                x, y = o.split('=')
                r = self.dict_in_list(r, x, y)
            elif o in r:
                r = r[o]
            else:
                r = r
        return r

    def dict_in_list(self, oo, n, v):
        for i in oo:
            if str(i[n])==v:
                return i
        return oo



@router.post('/get', response_model=StdResp)
async def carbon_wallet_get(req: Request):
    r = StdResp()
    return r



@router.post('/list', response_model=StdResp)
async def carbon_wallet_list(req: Request):

    r = StdResp()

    did = Conf.get('org:did')
    wall = Conf.get('org:wallet')
    key = wall['public_key']

    content = Acapy.msgbody('cred_list')

    oaep = OAEP(key)
    enc = oaep.encrypt(json.dumps(content))

    if not did:
        r.error(1 ,'Invalid organization')
        return r

    queue = MessageQueue(**content)
    queue.save()

    did = DID(did=did)
    c = did.message(enc);

    for i in range(10):
        queue.reload()
        if queue.r:
            break
        await asyncio.sleep(3)

    r.data = json.loads(queue.r)
    queue.delete()

    return r


class SensorModel(BaseModel):
    date_from: int
    date_to: int
    client: str
    site: int = 1
    sensor: int = 0


@router.post("/get_sensor", response_model=StdResp)
def carbon_sensor_get(data:SensorModel, req: Request):
    ''' Retrieve Sensor '''

    r = StdResp()

    ro = {}

    s = DataCarbon.objects(client='matsumoto', time__gte=data.date_from, time__lte=data.date_to)
    if s:
       for sensor in s:
            if sensor['sensor'] in ['5', '7', '6', '11', '12', '9', '18', '10']:
                tt = sensor['time'] * 1000

                if tt not in ro:
                    ro[tt] = {}

                if sensor['sensor'] == '5':
                    ro[tt]['v1'] = sensor['data']['voltage']['value']
                elif sensor['sensor'] == '6':
                    ro[tt]['v2'] = sensor['data']['voltage']['value']
                elif sensor['sensor'] == '12':
                    ro[tt]['v3'] = sensor['data']['voltage']['value']
                elif sensor['sensor'] == '18':
                    ro[tt]['v4'] = sensor['data']['voltage']['value']

                elif sensor['sensor'] == '7':
                    ro[tt]['a1'] = sensor['data']['amperage']['value']
                elif sensor['sensor'] == '11':
                    ro[tt]['a2'] = sensor['data']['amperage']['value']
                elif sensor['sensor'] == '9':
                    ro[tt]['a3'] = sensor['data']['amperage']['value']
                elif sensor['sensor'] == '10':
                    ro[tt]['a4'] = sensor['data']['amperage']['value']

                if 'v1' in ro[tt] and 'a1' in ro[tt]:
                    ro[tt]['w1'] = float(ro[tt]['v1']) * float(ro[tt]['a1'])
                if 'v2' in ro[tt] and 'a2' in ro[tt]:
                    ro[tt]['w2'] = float(ro[tt]['v2']) * float(ro[tt]['a2'])
                if 'v3' in ro[tt] and 'a3' in ro[tt]:
                    ro[tt]['w3'] = float(ro[tt]['v3']) * float(ro[tt]['a3'])
                if 'v4' in ro[tt] and 'a4' in ro[tt]:
                    ro[tt]['w4'] = float(ro[tt]['v4']) * float(ro[tt]['a4'])

    r.data = ro

    return r
