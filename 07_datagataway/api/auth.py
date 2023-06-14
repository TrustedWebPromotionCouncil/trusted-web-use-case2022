
import json
import urllib
import asyncio

from time import time
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from fastapi.security import  OAuth2PasswordRequestForm
from pydantic import BaseModel

from auth import get_current_active_user, authenticate_user
from conf import Conf, IntTime
from acapy import Acapy
from did import VC, DID, Schemas

from models import StdResp, DCSchema, Workflow
from datastore import IPFS, Envelop, Wallet
import mongoengine as mongo


router = APIRouter(
    prefix="/auth",
    tags=["Carbon Auth"],
)


def timemark(s):
    if type(s) is not str:
        s = str(s)
    print(datetime.now(), 'CARBON: ' + s)


class modelRegister(BaseModel):
    name: str = ''
    type: str = '1'
    admin: str = ''
    email: str = ''
    unit: str = 'carbon'
    desc: str = ''
    logo: str | None = 'https://u.woollet.io/images/woollet-logo.png'
    secret: str = str(uuid4().hex)


@router.post("/register", response_model=StdResp)
async def carbon_register(data: modelRegister, req: Request):
    '''
        Organization registration
        Company wallet creation
    '''
    r = StdResp()

    timemark('ACCOUNT INIT / VALIDATION')
    timemark(data.__dict__)

    if not data.type or not data.name or not data.admin or not data.email:
        r.error(11 ,'Invalid request')
        return r

    did = Conf.get('org:did')

    if did:
        r.error(12, 'Invalid ID')
        return r

    node = DID()
    secret = uuid4().hex
    w = node.wallet(secret=secret)
    print('WALLET', w)

    if w.status != 0:
        r.error(21, w.response)
        return r

    wallet = w.data
    wallet['public_key'] = w.key
    did = wallet['wallet_id']

    Conf.set('org:did', did)
    Conf.set('org:secret', secret)
    Conf.set('org:wallet', wallet)
    Conf.set('org', {
        'name': data.name,
        'type': data.type,
        'contact': data.admin,
        'email': data.email,
        'unit': data.unit,
        'desc': data.desc,
        'logo': data.logo
    })

    c = node.connects(data.name)
    print('CONNECTS', c)
    
    if c.status != 0:
        r.error(20+c.status, c.response)
        return r

    ec = node.auto(c.hash)
    print('AUTO', ec)

    wo = Wallet.objects(did=did)
    if wo:
        wo.update_one(set__rsa_pub=w.key)

    # generate organization ssid == partner id

    sc = Schemas('carbon')
    schema = sc.get('carbon-org')

    node = DID(did=did)

    for i in range(10):
        s = await node.conn()
        if s['rfc23_state'] == 'completed':
            vc = VC()
            vc.attrs({
                'name': data.name,
                'desc': data.desc,
                'cat': data.type,
                'email': data.email,
                'meta': data.admin,
                'owner': did,
                'key': secret,
                },
                client='carbon-partner'
            )
            ro = vc.OfferV2(
                schema.data['def_id'],
                'Carbon Tracing Organization',
                'carbon-org-credential-issue-auto',
                'Carbon organization credential auto issue',
                did=did,
            )
            r.data['offer'] = ro.data
            break;

        else:
            await asyncio.sleep(3)

    return r

class modelDid(BaseModel):
    did: str


@router.post('/connect', response_model=StdResp)
async def carbon_connect(data:modelDid):

    node = DID()
    c = node.connects('master', did=data.did)
    print(c)
    r = node.auto(c.hash)
    print(r)
    return r


@router.post("/update", response_model=StdResp)
async def carbon_update(data: modelRegister, req: Request):

    did = Conf.get('org:did')
    org = Conf.get('org')

    if data.name and data.name!='string':
        Conf.set('org:name', data.name)
    if data.type and data.type!='string':
        Conf.set('org:type', data.type)
    if data.admin and data.admin!='string':
        Conf.set('org:admin', data.admin)
    if data.email and data.email!='string':
        Conf.set('org:email', data.email)
    if data.unit and data.unit!='string':
        Conf.set('org:unit', data.unit)
    if data.desc and data.desc!='string':
        Conf.set('org:desc', data.desc)
    if data.logo and data.logo!='string':
        Conf.set('org:logo', data.logo)


@router.post("/profile", response_model=StdResp)
async def carbon_profile(req: Request):
    ''' Organization profile '''
    r = StdResp()

    a = Acapy()
    ra = a.get_did()
    pd = ra.data
    endpoint = a.get_endpoint(ra.data.split(':')[2])

    org = Conf.get('org')
    org['public_did'] = pd
    org['wallet'] = Conf.get('org:did')

    org['endpoint'] = endpoint.data['endpoint']
    org['public_key'] = Conf.get('org:wallet')['public_key']
    org['time'] = IntTime()
    r.data = org
    return r


@router.post("/public", response_model=StdResp)
async def carbon_public_key(did: str, req: Request):
    ''' Organization public key '''
    r = StdResp()
    try:
        w = Wallet.objects(did=did)
        if w:
            wallet = w.first()
            r.data = {
                'wallet': did,
                'public_key': wallet.rsa_pub,
                'time': IntTime(),
            }
        else:
            r.error(12, 'Invalid wallet')
    except Exception as e:
        r.error(11, 'Invalid wallet '+str(e))
    return r


class Token(BaseModel):
    access_token: str
    token_type: str


@router.post("/signin", response_model=Token)
async def login_for_access_token(o: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(o.username, o.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.code}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


