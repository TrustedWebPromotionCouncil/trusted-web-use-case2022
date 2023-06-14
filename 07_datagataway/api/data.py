
import urllib3
import json

from time import time
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

from auth import get_current_active_user
from conf import Conf
from acapy import Acapy
from did import VC, Schemas, Envelopes

from models import StdResp, DCSchema, Workflow
from datastore import IPFS, Envelop, Envelope, Wallet


router = APIRouter(
    prefix="/data",
    tags=["Carbon Data"],
    # dependencies=[Depends(get_current_active_user)]
)


import mongoengine as mongo

class DataPostLog_Carbon(mongo.Document):
    wallet = mongo.StringField(required=True)
    user = mongo.StringField(required=True)
    dataset = mongo.StringField(required=True)
    data = mongo.DictField(required=True)
    data_time = mongo.IntField()
    created = mongo.IntField()
    updated = mongo.IntField()
    status = mongo.IntField(required=True, default=0)


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


class DataPostSchema(BaseModel):
    did: str = ""
    data: str = ""
    obj: dict = {}
    name: str = ""


def data_write(output, o):
    
    min = 99999999999999999999
    max = 0

    t = o['time']
    site = o['id']

    for sensor in o['data']:
        ss = {}
        for x in sensor['data']:
            ss[x['type']] = { 'value': x['val'], 'unit': x['unit'] }

        DataCarbon(
            client = 'matsumoto',
            time = t,
            site = site,
            sensor = sensor['id'] if type(sensor['id'])==str else str(sensor['id']),
            data = ss,
            month = o['month'],
            date = o['date'],
            hour = o['hour'],
            times = o['times'],
        ).save()

        if o['times'] < min:
            min = o['times']
        if o['times'] > max:
            max = o['times']

    return min,max


@router.post("/post", response_model=StdResp)
async def carbon_datapost(data: DataPostSchema, req: Request):
    ''' Accept raw data from Carbon Tracing Units, and process according to available Data Envelopes
        in order maintain accuraty & simplify packaging process, we will limit the generation
        of data envelop to single data source per envelope
    '''

    r = StdResp()
    now = time()
    current = datetime.utcnow()
    did = Conf.get('org:did')

    try:

        envelops = Envelope.objects(project='carbon')
        o = {}
        if data.data:
#            o = jsonable_encoder(data.data)
            o = json.loads(data.data)

        elif data.obj:
            o = data.obj

        # saving full set for debugging
        hash = IPFS.hashonly(str(o))
        ipfs = IPFS.objects(hash=hash)
        key = 'reserved-private-key'
        if not ipfs:
            ipfs = IPFS(
                hash = hash,
                data = str(o),
                created = now,
                updated = now,
            )
            ipfs.save()

        Envelope_matched = []
        Matched = 0

        print('\n\nLooking up from data Envelopes')
        for e in envelops:
            if e.status != 0:
                continue

            dataset = e.dataset

            for s in dataset:

                if True:
                    print('FOUND, we have ', dataset[s])

                    wallet = None
                    w = Wallet.objects(did=data.did)
                    if w:
                        wallet = w.first()

                    output = {
                        'dataset': e.name,
                        'def_id': e.def_id,
                        'data': o,
                        'hash': hash,
                        'key': key,
                        'time': now,
#                        'timestamp': now,
                    }

                    log = DataPostLog_Carbon(
                        wallet = did,
                        user = wallet.name if w else 'unknown',
                        dataset = e.name,
                        data = output,
                        created = now,
                        updated = now,
                        status = 0,
                    )
                    log.save()

                    min, max = 99999999999999999999, 0
                    
                    if type(o) is list:
                        for i in o:
                            n, x = data_write(output, i)
                            min = n if n<min else min
                            max = x if x>max else max
                    else:
                        min, max = data_write(output, o)


                    del output['data']

                    print('Issuing: ', output)

                    name = 'Carbon Data Credential'
                    action = 'carbon-data-credential-issue-auto'
                    msg = 'Carbon tracing device data credential auto issue'

                    vc = VC(req)
                    vc.attrs(
                        {
                            'meta': json.dumps(output),
                            'data': 'ipfs',
                            'hash': hash,
                            'key': key,
                            'time:from': str(min),
                            'time:to': str(max),
                        },
                        client='carbon-data'
                    )
                    r = vc.OfferV2(
                        e.def_id,
                        name,
                        action,
                        msg,
                        did=did,
                    )

                    print('Carbon ACTION V2 - Carbon Data Credential Direct Offer')

#                    Envelope_matched.append({'data': name, 'inv': 'v2', 'ceid': r.data['cred_ex_id'] })
                    Envelope_matched.append({'data': name, 'inv': 'v2' })

                    Matched += 1

        r.data = { 'Datasets': Envelope_matched, 'Count': Matched }
        return r

    except Exception as e:
        r.error(1, 'The following Error occurred: '+str(e))
        return r


class IPFShash(BaseModel):
    hash: str


@router.post("/ipfs/private/download", response_model=StdResp)
def carbon_ipfs_get(hash:IPFShash, req: Request):
    ''' Retrieve File '''

    r = StdResp()
    try:

        hash = hash.hash
        file = IPFS.objects(hash=hash)
        if file:
            r.data = { 'data': file.first().data }
            return r
        else:
            r.error(2, 'Invalid hash')
            return r

#        file = ipfs.download(hash)
#        return file
    except Exception as e:
        return {"status": 1,"response": 'The following Error occurred: '+str(e)} 


@router.post("/schemas", response_model=StdResp)
def carbon_data_schemas() -> StdResp:

    r = StdResp()
    env = Envelopes('carbon', 'matsumoto')
    e = env.list()
    r.data = e
    return r
    

DefaultSchema = Conf.get('carbon-schema', create=True, default={

    'Membership': [
        'Membership-4.5.3',
    ],
    'Org': {
        'name': 'org',
        'desc': 'Supplychain partners or company in group',
        'fields': ['wallet', 'name', 'desc', 'cat', 'email', 'meta', 'owner', 'key', ],
        'type': 'id',
        'ver': '1.0.5',
        'bg': '#FFFFFF',
        'logo': 'https://u.woollet.io/images/woollet-logo.png',
    },
    'DataAuth': {
        'name': 'data-type',
        'desc': 'Data type authorization',
        'fields': ['wallet', 'name', 'data', 'meta'],
        'type': 'auth',
        'ver': '1.0.5',
        'bg': '#FFFFFF',
        'logo': 'https://u.woollet.io/images/woollet-logo.png',
    },
    'Staff': {
        'name': 'staff',
        'desc': 'Supplychain authorizations',
        'fields': ['wallet', 'name', 'email', 'secret', 'meta', 'role', 'cat'],
        'type': 'id',
        'ver': '1.0.5',
        'bg': '#FFFFFF',
        'logo': 'https://u.woollet.io/images/woollet-logo.png',
    },
    'Data': [
        {
            'name': 'stationary-combustion',
            'desc': 'Stationary Combustion',
            'type': 'data-1',
            'ver': '1.0.2',
            'bg': '#FFFFFF',
            'logo': 'https://u.woollet.io/images/woollet-logo.png',
            'dataset': {
                'co2-emit': {
                    '_name': 'CO2 Emission',
                    '_fx': '{a} * {v} * {PERIOD} * 0.44444',
                    '_unit': 'gCO2',
                    'a': 'data/id=11/data/type=amperage/val',
                    'v': 'data/id=6/data/type=voltage/val',
                },
                'power-consumed': {
                    '_name': 'Power consumption',
                    '_fx': '{a} * {v} * {PERIOD}',
                    '_unit': 'kWh',
                    'a': 'data/id=11/data/type=amperage/val',
                    'v': 'data/id=6/data/type=voltage/val',
                },
            },
        },
        {
            'name': 'mobile-combustion',
            'desc': 'Mobile Comustion',
            'type': 'data-1',
            'ver': '1.0.2',
            'bg': '#FFFFFF',
            'logo': 'https://u.woollet.io/images/woollet-logo.png',
            'dataset': {},
        },
        {
            'name': 'hfc-pfc-emission',
            'desc': 'HFC & PFC Emission',
            'type': 'data-1',
            'ver': '1.0.1',
            'bg': '#FFFFFF',
            'logo': 'https://u.woollet.io/images/woollet-logo.png',
            'dataset': {},
        },
        {
            'name': 'electricity-purchase',
            'desc': 'Electricity Purchase',
            'type': 'data-1',
            'ver': '1.0.1',
            'bg': '#FFFFFF',
            'logo': 'https://u.woollet.io/images/woollet-logo.png',
            'dataset': {
                'co2-emit': {
                    '_name': 'CO2 Emission',
                    '_fx': '{a} * {v} * {PERIOD} * 0.44444',
                    '_unit': 'gCO2',
                    'a': 'data/id=11/data/type=amperage/val',
                    'v': 'data/id=6/data/type=voltage/val',
                },
                'power-consumed': {
                    '_name': 'Power consumption',
                    '_fx': '{a} * {v} * {PERIOD}',
                    '_unit': 'kWh',
                    'a': 'data/id=11/data/type=amperage/val',
                    'v': 'data/id=6/data/type=voltage/val',
                },
            },
        },
        {
            'name': 'energy-indirect',
            'desc': 'Energy Indirect GHG Emission',
            'type': 'data-1',
            'ver': '1.0.1',
            'bg': '#FFFFFF',
            'logo': 'https://u.woollet.io/images/woollet-logo.png',
            'dataset': {},
        },
        {
            'name': 'paper-waste',
            'desc': 'Paper Waste Disposed at Landfills',
            'type': 'data-1',
            'ver': '1.0.1',
            'bg': '#FFFFFF',
            'logo': 'https://u.woollet.io/images/woollet-logo.png',
            'dataset': {},
            },
    ],
})

@router.post('/schema', response_model=StdResp)
def carbon_schema_default() -> StdResp:
    r = StdResp()
    r.data = Conf.get('carbon-schema')
    return r


@router.post("/init", response_model=StdResp)
def carbon_data_init() -> StdResp:

    project = 'carbon'
    client = 'matsumoto'
    data = [ x['name'] for x in DefaultSchema['Data'] ]

    r = StdResp()
    env = Envelopes(project, client)
    e = env.list()

    for i in DefaultSchema['Data']:
        have = False
        for j in e:
            have = have or (i['name'] in j and project in j)
        if not have:
            re = env.new(
                i['name'],
                i['desc'],
                i['dataset'],
                type = i['type'],
                ver = i['ver'],
                bg = i['bg'],
                logo = i['logo'],
            )
            print(re, flush=True)

    schema = Schemas(project)
    list = schema.list()

    for i in ('Org', 'DataAuth', 'Staff',):
        o = DefaultSchema[i]
        have = False
        for j in list:
            have = have or (o['name'] in j and project in j)

        if not have:
            sr = schema.new(
                o['name'],
                o['desc'],
                o['fields'],
                o['type'],
                o['ver'],
                o['bg'],
                o['logo'],
            )
            print('Create '+o['name'], sr)

    r.data = e
    return r
