
import urllib
import json

from time import time
from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter, Depends, Request
from fastapi.encoders import jsonable_encoder
from fastapi.security import  OAuth2PasswordRequestForm
from pydantic import BaseModel

from auth import get_current_active_user
from conf import Conf
from acapy import Acapy
from did import VC, DID, Schemas

from models import StdResp, DCSchema, Workflow
from datastore import IPFS, Envelop, Wallet, Organization
import mongoengine as mongo


router = APIRouter(
    prefix="/supplychain",
    tags=["30 Supplychain"],
    # dependencies=[Depends(get_current_active_user)]
)


def timemark(s):
    if type(s) is not str:
        s = str(s)
    print(datetime.now(), 'CARBON: ' + s)


class modelPartner(BaseModel):
    name: str
    desc: str
    cat: str
    email: str
    meta: str
    key: str
    did: str | None


class modelStaff(BaseModel):
    did: str | None = None
    org: str
    name: str
    email: str
    secret: str


@router.post('/signup', response_model=StdResp)
async def carbon_partner_signin_invite(o:modelPartner):
    ''' 3010 '''

    r = StdResp()

    sc = Schemas('carbon')
    def_id = sc.get_def_id('carbon-org')

    attrs = {
        'name': o.name,
        'desc': o.desc,
        'cat': o.cat,
        'email': o.email,
        'meta': o.meta,
        'owner': o.did,
        'key': o.key,
    }

    wallet_update = {
        'role':  'org-partner',
        'email': o.email,
        'name': o.name,
        'company': [o.did],
        'title': o.cat,
        'card': o.meta,
        'key': o.key,
        'auth': [],
    }

    if o.did is None:
        ''' Generate QRCode Invitation '''
        node = DID()
        r = node.invite(
            'qrcode',
            'carbon-partner-signup',
            'qrcode-issue',
            'Carbon Tracing System Partner Sign-up',
            {
                'def_id': def_id,
                'attrs': attrs,
                'wallet-update': wallet_update
            }
        )

    else:
        '''  Direct Offer '''
        vc = VC()
        vc.attrs( attrs, client='carbon-partner' )
        r = vc.OfferV2(
            def_id,
            'carbon-partner-signup',
            'issue-carbon-partner',
            'Carbon Tracing System Partner Sign-up',
            did = o.did,
        )
#        if r.status == 0:
        Wallet.updates(o.did, wallet_update)
            
    return r


class modelAuths(BaseModel):
    did: str
    acl: list
    action: list


@router.post('/auth', response_model=StdResp)
async def carbon_partner_auth(o: modelAuths):
    ''' 3011 '''
    r = StdResp()
    if len(o.acl) != len(o.action):
        r.error(301101, m)
    w = Wallet.objects(did=o.did)
    if w:
        wallet = w.first()
        auths = wallet.auth
        changed = 0
        print(o.acl)
        for i, x in enumerate(o.acl):
            print(i)
            if o.action[i] == '-':
                if o.acl[i] in auths:
                    auths.remove(o.acl[i])
                    #TODO: Issue Auth Credential to target wallet
                    print('REMOVED', o.acl[i])
                    changed += 1

            elif o.action[i] == '+':
                print('CHECK', o.acl[i])
                if o.acl[i] not in auths:
                    auths.append(o.acl[i])
                    #TODO: Revoke Auth Credential of the target wallet
                    print('ADDED', o.acl[i])
                    changed += 1
        if changed>0:
            w.update_one(set__auth=auths)
    else:
        r.error(301102)
    return r


@router.post("/signin", response_model=StdResp)
async def carbon_partner_signin():
    ''' 3012 '''
    r = StdResp()
    sc = Schemas('carbon')
    def_id = sc.get_def_id('carbon-org')
    node = DID()
    r = node.invite(
        'qrcode',
        'carbon-partner-signin',
        'qrcode-proof-request',
        'Carbon Tracing System Partner Sign-in',
        {
            'reveal': [
                {
                    'tag': 'a1',
                    'attrs': ['wallet', 'name'],
                    'def_id': def_id,
                }
            ]
        }
    )
    return r


@router.post('/staff', response_model=StdResp)
async def carbon_partner_register_staff(o:modelStaff):
    ''' 3020 Generate QRCode Invitation for Organization staff'''
    r = StdResp()
    sc = Schemas('carbon')
    def_id = sc.get_def_id('carbon-staff')

    wallet_update = {
        'role':  'org-staff',
        'email': o.email,
        'company': [o.org],
        'secret': o.secret,
    }

    attrs = {
        'wallet': o.org,
        'name': o.name,
        'email': o.email,
        'secret': o.secret,
        'role': 'org-staff',
        'meta': 'admin',
        'cat': 'auto',
    }

    w = None
    wallet = None

    if o.did:
        w = Wallet.objects(did=o.did)
        if w:
            wallet = w.first()


    if o.did and w:

        vc = VC()
        vc.attrs( attrs, client='carbon-staff' )
        r = vc.OfferV2(
            def_id,
            'carbon-staff',
            'qrocde-issue',
            'Carbon Tracing System Parter Staff Registration',
            con_id=wallet.con_id,
        )

        print(type(wallet.company), wallet.company, flush=True)

        if type(wallet.company) is str:
            s = wallet.company
            s = []
            if len(s)>0:
                s = [wallet.company]

            w.update_one(
                set__company=s,
            )

        w.update_one(
            set__role='org-staff',
            add_to_set__company=o.org,
            set__email=o.email,
            set__secret=o.secret,
        )

    else:
    
        node = DID()
        r = node.invite(
            'qrcode',
            'carbon-staff',
            'qrcode-issue',
            'Carbon Tracing System Parter Staff Registration',
            {
                'def_id': def_id,
                'attrs': attrs,
                'wallet-update': wallet_update
            }
        )




    return r


tag = 'org-partner'


@router.post('/list', response_model=StdResp)
def carbon_partner_list(order:str='-created'):
    ''' 3030 Carbon Tracing Partner List'''
    r = StdResp()
    try:
        partners =  Wallet.objects(role='org-partner').order_by(order).exclude('id')
        j = partners.to_json()
        r.data = json.loads(j)
    except Exception as e:
        r.error(303001, 'Error: '+str(e))
    return r


class modelDid(BaseModel):
    did: str


@router.post('/get', response_model=StdResp)
def carbon_partner_get(o: modelDid, order:str='-created'):
    ''' 3031 Carbon Tracing Partner Get'''
    r = StdResp()
    try:
        partners =  Wallet.objects(did=o.did).order_by(order).exclude('id')
        if partners:
            p = partners.first()
            r.data = json.loads( p.to_json() )
        
        ss =  Wallet.objects(company=o.did).order_by(order).exclude('id')
        if ss:
            j = ss.to_json()
            r.data['staffs'] = json.loads(j)
        #    r.data = json.loads(j)


    except Exception as e:
        r.error(303101, 'Error: '+str(e))
    return r
