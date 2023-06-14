
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
import mongoengine as mongo


router = APIRouter(
    prefix="/schema",
    tags=["Carbon Schema"],
    # dependencies=[Depends(get_current_active_user)]
)


@router.post("/list", response_model=StdResp)
def carbon_schema_list() -> StdResp:
    r = StdResp()
    env = Schemas('carbon')
    e = env.list()
    r.data = e
    return r


class modelDefId(BaseModel):
    def_id: str


@router.post("/get", response_model=StdResp)
def carbon_schema_get(o:modelDefId, full:bool=False) -> StdResp:
    r = StdResp()
    schema = Schemas('carbon')
    e = schema.get(o.def_id, full)
    r.data = e.data
    return r


DefaultSchema = {

    'Membership': [
        'Membership-4.5.3',
    ],
    'Org': {
        'name': 'org',
        'desc': 'Supplychain partners or company in group',
        'fields': ['name', 'desc', 'cat', 'email', 'meta', 'owner', 'key', ],
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
}


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
