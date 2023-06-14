
import { Env } from "@/env"


export const Next = {
    fetch: async function (u, o, fx, m) {
        let r = await fetch(u, {
            method: m ? m : 'POST',
            headers: {'Accept': 'application/json','Content-Type': 'application/json'},
            body: o ? JSON.stringify(o) : '',
        })
        r = await r.json();
        try { JSON.parse(r) } catch (e) { }
        return r
    },
    IPFS: {
        fetch: async o => await Next.fetch('/api/ipfs/fetch', o)
    },
    Schema: {
        list: async () => await Next.fetch('/api/schema/list'),
        get: async o => await Next.fetch('/api/schema/get', o),
        publish: async o => await Next.fetch('/api/schema/publish', o),
    },
    Def: {
        list: async () => await Next.fetch('/api/def/list'),
        get: async o => await Next.fetch('/api/def/get', o),
        publish: async o => await Next.fetch('/api/def/publish', o),
    },
    Txn: {
        list: async () => await Next.fetch('/api/txn/list'),
    },
    Conn: {
        logs: async () => await Next.fetch('/api/conn/logs'),
        list: async () => await Next.fetch('/api/conn/list'),
        get: async o => await Next.fetch('/api/conn/get', o),
        invite: async o => await Next.fetch('/api/conn/invite', o),
        state: async o => await Next.fetch('/api/conn/state', o),
    },
    User: {
        list: async () => await Next.fetch('/api/users/list'),
    },
    Issuance: {
        logs: async () => await Next.fetch('/api/issue/logs'),
        list: async () => await Next.fetch('/api/issue/list'),
        listv2: async () => await Next.fetch('/api/issue/listv2'),
        get: async o => await Next.fetch('/api/issue/get', o),
        getv2: async o => await Next.fetch('/api/issue/getv2', o),
    },
    Wallet: {
        list: async () => await Next.fetch('/api/wallet/list'),
        get: async o => await Next.fetch('/api/wallet/get', o),
    },    
    Verify: {
        logs: async () => await Next.fetch('/api/verify/logs'),
        list: async () => await Next.fetch('/api/verify/list'),
        get: async o => await Next.fetch('/api/verify/get', o),
        free: async o => await Next.fetch('/api/verify/free', o),
        woollet: async o => await Next.fetch('/api/verify/woollet', o),
    },
    System: {
        profile: async () => await Next.fetch('/api/system/profile'),
        signin: async o => await Next.fetch('/api/system/signin', o),
        status: async () => await Next.fetch('/api/system/status'),
        config: async () => await Next.fetch('/api/system/config'),
        network: async () => await Next.fetch('/api/system/network'),
    },
    DataList: {
        list: async () => await Next.fetch('/api/datalist/list'),
        get: async o => await Next.fetch('/api/datalist/get', o),
        set: async o => await Next.fetch('/api/datalist/set', o),
    },
    Envelope: {
        list: async () => await Next.fetch('/api/envelope/list'),
        get: async o => await Next.fetch('/api/envelope/get', o),
        new: async o => await Next.fetch('/api/envelope/new', o),
        set: async o => await Next.fetch('/api/envelope/set', o),
    },
    Logs: {
        posts: async () => await Next.fetch('/api/logs/posts'),
        tasks: async () => await Next.fetch('/api/logs/tasks'),
        ipfs: async () => await Next.fetch('/api/logs/ipfs'),
        ipfss: async (o) => {
            let r = await fetch(
                Did.static + '/orphe/logs/ipfs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: o ? JSON.stringify(o) : {},
                })
            r = await r.json()
            try { r = JSON.parse(r) } catch (e) { }
            try { r.data = JSON.parse(r.data.logs) } catch (e) { }
            return r;
        },
    },     
    Data: {
        schema: async () => await Next.fetch('/api/data/schema'),
        list: async () => await Next.fetch('/api/data/list'),
        get: async o => await Next.fetch('/api/data/get', o),
        set: async o => await Next.fetch('/api/data/set', o),
        sensors: async o => await Next.fetch('/api/data/sensors', o)
    },
    Carbon: {
        Supplychain: {
            list: async () => await Next.fetch('/api/supplychain/list'),
            auth: async o => await Next.fetch('/api/supplychain/auth', o),
            get: async o => await Next.fetch('/api/supplychain/get', o),
            new: async o => await Next.fetch('/api/supplychain/new', o),
            staff: async o => await Next.fetch('/api/supplychain/staff', o),
            add: async o => await Next.fetch('/api/supplychain/add', o),
        },
    },
    Orphe: {


    },
    CO2: {

    },
    Lbee: {

    },
}

export const Did = {

//    agent: process.env.WOOLLET_API,
    static: Env.AI, //process.env.WOOLLET_ADMIN, // 'https://ai.woollet.io',
//    static: 'https://ai.woollet.io', //process.env.WOOLLET_ADMIN, // 'https://ai.woollet.io',
    post: async function (u, o, fx) {
        const rs = await fetch(this.agent + u, {method: 'POST', data: JSON.stringify(o)});

        let r = '{}'
        try {
            r = await rs.json();
        } catch (e) { }

        try { r = JSON.parse(r) } catch (e) { }

        if ('data' in r) {
            try { r.data = JSON.parse(r.data) } catch (e) { }
        } else {
            try { r = JSON.parse(r) } catch (e) { }
        }
        return r
    },
    get: async function (u, o, fx) {
        const rs = await fetch(this.agent + u, {method: 'GET'});
        let r = await rs.json();
        if (data in r) {
            try { r.data = JSON.parse(r.data) } catch (e) { }
        }
        return r;
    },
    post_static: async function (u, o, fx) {
        const rs = await fetch(this.static + u, {method: 'POST', data: JSON.stringify(o)});
        let r = await rs.json();
        if ('data' in r) {
            try { r.data = JSON.parse(r.data) } catch (e) { }
        }
        return r;
    },    
    Cred: {
        list: async () => {
            await console.log(this);
        },
        get: () => {

        }
    },

    Conn: {
        list: async () => {
            const r = await Did.post('/conn/list')
            r.data = r.data.results;
            return r;
        },
        get: () => {

        },
        drop: () => {

        },
        invite: () => {

        },
        receive: () => {

        },
        message: () => {

        },
        ping: () => {

        },

    },

    Issuance: {
        list: async () => {
            const r = await Did.post('/issuance/credex/list')
            r.data = r.data.results;
            return r;
        },
        get: () => {

        },
        issue: () => {

        },
    },

    Verify: {
        list: async () => {
            const r = await Did.post('/verify/list')
            r.data = r.data.results;
            return r;
        }
    },

    Schema: {
        list: async () => {
            const r = await Did.post('/schema/list')
            r.data = r.data.schema_ids;
            return r;
        },
        Defs: {
            list: async () => {
                const r = await Did.post('/schema/def/list')
                console.log(r)
                r.data = r.data.credential_definition_ids;
                return r;    
            },
            get_list: (o) => {
                const r = [];
                for (const i in o.data.credential_definition.value.primary.r) {
                    if (i=='master_secret' || i.match(/^(org:|doc:)/i)) continue;
                    r.push({key: i, field: i, status: 0})
                }
                return r;
            }
        },
    },

    System: {
        config: async () => {
            const r = await Did.post('/server/config')
            r.data = r.data.config;
            return r;
        },
        status: async () => {
            const r = await Did.post('/server/status')
            r.data = r.data;
            return r;
        },
    },

    User: {
        list: async () => {
            const r = await Did.post('/users/list')
            return r;
        }
    },

    Point: {

    },

    Member: {

    },

    Payment: {
        transactions: async () => {
            const r = await Did.post('cryptos/transaction/list')
            return r;            
                        
        }

    },

    Ipfs: {

    },

    Datastore: {

    },

    Crypto: {
        meta: async () => {
            const r = await Did.post('/cryptos/meta')
            return r;
        },
        meta2: async () => {
            
            let r = await Did.post_static('/cryptos/meta')
            try { r.data.meta_data = JSON.parse(r.data.meta_data) } catch(e) { }
            return r;
        }        
    },




}