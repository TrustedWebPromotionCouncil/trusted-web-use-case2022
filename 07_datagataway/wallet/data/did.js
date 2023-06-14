// const crypto = require('crypto');
import { Env } from "@env";


// Socket
import { io } from 'socket.io-client';

const socket = io(Env.UI, {
  path: '/comm/socket.io/',
  transports: ['socketio', 'flashsocket', 'websocket', 'polling'],
});

// Token
import { Point } from './token';

// db
import { Dexie } from 'dexie';


export const db = new Dexie('Woollet');
db.version(2).stores({
  config: 'id',
  wallet: 'id',
  connections: 'id',
  transactions: '++id',
  proof_requests: 'id',
});


export const Woollet = {

  ai: Env.AI,
  ui: Env.UI,

  fetch: async (u, o, fx, m) => {
    const token = sessionStorage.getItem('token')
    let r = await fetch(u, {
      method: m ? m : 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: o ? JSON.stringify(o) : '',
    });
    r = await r.json();
    try {
      JSON.parse(r);
    } catch (e) {}
    return r;
  },

  unsigned: () => {
    return sessionStorage.getItem("token") === null
  },

  core: async (t, u, o, fx) => {
    fx = fx
      ? fx
      : function (r) {
          console.log('ADMIN Call', r);
        };
    o = o ? o : {};
    if (t == 'POST') {
      $.post(WoolletAPI.server + u, o, fx);
    } else {
      $.get(WoolletAPI.server + u, o, fx);
    }
  },
  Txn: {
    list: async () => await Woollet.fetch('/api/txn/list'),
  },
  Conn: {
    list: async () => await Woollet.fetch('/api/conn/list'),
    get: async (o) => await Woollet.fetch('/api/conn/get', o),
  },
  User: {
    list: async () => await Woollet.fetch('/api/users/list'),
    profile: async () => await Woollet.fetch('/api/users/profile'),
    personal_init: async () => await Woollet.fetch('/api/users/personal_init'),
    signin: async o => await Woollet.fetch('/api/users/signin', o),
    signup: async o => await Woollet.fetch('/api/users/signup', o),
    did: () => {
      let j = sessionStorage.getItem('token')
      if (j) {
        console.log(j)
        j = j.split('.');
        return JSON.parse(atob(j[1])).sub
      }
    },
    token: () => {
      return sessionStorage.getItem('token')
    },
    expiry: () => {
      let j = sessionStorage.getItem('token')
      if (j) {
        j = j.split('.');
        return JSON.parse(atob(j[1])).exp
      }
    },
  },
  Issuance: {
    list: async () => await Woollet.fetch('/api/issuance/list'),
    get: async (o) => await Woollet.fetch('/api/issuance/get', o),
  },
  Wallet: {
    creds: async () => await Woollet.fetch('/api/wallet/creds'),
    issues: async () => await Woollet.fetch('/api/wallet/issues'),
    proofs: async () => await Woollet.fetch('/api/wallet/proofs'),
    cred: async o => await Woollet.fetch('/api/wallet/cred', o),
    issue: async o => await Woollet.fetch('/api/wallet/issue', o),
    proof: async o => await Woollet.fetch('/api/wallet/proof', o),
  },
  Data: {
    share: async (i, a, p, s) => {
      const o = {
        peid: i,
        attrs: a,
        preds: p,
        attested: s,
      };
      const r = await Woollet.fetch('/api/proof/share', o);
      return r;
    },
    revoke: async (o) => await WoolletAPI.post('/api/proof/revoke', o),
  },
  System: {
    status: async () => await Woollet.fetch('/api/system/status'),
    config: async () => await Woollet.fetch('/api/system/config'),
  },
  Proof: {
    list: async () => await Woollet.fetch('/api/proof/list'),
    test: async o => await Woollet.fetch('/api/proof/test', o),
    result: async o => await Woollet.fetch('/api/proof/result', o),
  },
  NFT: {
    list: async () => await Woollet.fetch('/api/nft/list', o),
    send: async o => await Woollet.fetch('/api/nft/send', o),
    mint: async () => await Woollet.fetch('/api/nft/mint', o),
  },
  Points: {
    faucet: async (o) => await Woollet.fetch('/api/core/points/faucet', o),
    balance: async (o) => await Woollet.fetch('/api/core/poins/balance'),
    return: async () => {
      const eid = await db.config.get('eth_id');
      const point = new Point(eid.value);
      point.init();
      point.transferTo(point.woollet, 3).then(function (r) {
        point.balance().then(function (r) {
          console.log(point.me, r);
        });
      });
    },
  }
};

export const WoolletAPI = {
//  agent: process.env.WOOLLET_API,
  ai: Env.AI, //'https://ai.woollet.io',
  ui: Env.UI, //'https://ui.woollet.io',
  static: Env.UI,
  server: Env.AI,
  hdr: '234-234234-222-112-3434130343-432434234',

  check_token_expired: async () => {
    const vc = await db.config.get('vc');
    const token_expiry = await db.config.get('token_expiry');

    if (!vc) {
      return true;
    }
    const exp = 900000;
    const expired = Date.now() - token_expiry.value;
    // console.log('EXPIRED?', expired, exp);
    if (expired > exp) {
      const r = await WoolletAPI.renew_token();

      // update db
      await db.config.bulkPut([
        { id: 'token', value: r.data.token },
        { id: 'token_expiry', value: Date.now() },
      ]);
      return false;
    }
    return false;
  },

  admin: async (t, u, o, fx) => {
    fx = fx
      ? fx
      : function (r) {
          console.log('ADMIN Call', r);
        };
    o = o ? o : {};
    if (t == 'POST') {
      $.post(WoolletAPI.server + u, o, fx);
    } else {
      $.get(WoolletAPI.server + u, o, fx);
    }
  },

  call: async (t, u, o, fx) => {
    const did = await db.config.get('wallet_id');
    const token = await db.config.get('token');

    const header = {
      Authorization:
        'Bearer ' +
        ((await WoolletAPI.check_token_expired())
          ? WoolletAPI.hdr
          : token.value),
    };
    if (did) {
      header['X-W-ID'] = did.value;
    }
//    console.log('CALL', u);
//    console.log('HEADER', header);
    if (o) console.log('data', o);
    return await $.ajax({
      url: WoolletAPI.static + u + '?_=' + Math.random(),
      type: t ? t : 'GET',
      data: o,
      dataType: 'json',
      contentType: 'application/json',
      headers: header,
      error: (e) => {
        if (typeof ex == 'function') {
          ex(e);
          return;
        }
        console.error(e);
      },
    });
  },

  post: async (u, o) => {
    return await WoolletAPI.call('POST', u, o);
  },

  get: async (u, o) => {
    return await WoolletAPI.call('GET', u, o);
  },

  post_static: async (u, o, fx) => {
    const rs = await fetch(this.static + u, {
      method: 'POST',
      data: JSON.stringify(o),
    });
    let r = await rs.json();
    if ('data' in r) {
      try {
        r.data = JSON.parse(r.data);
      } catch (e) {}
    }
    return r;
  },

  post_server: async (u, o, fx) => {
    const rs = await fetch(WoolletAPI.server + u, {
      method: 'POST',
      data: JSON.stringify(o),
    });
    let r = await rs.json();
    if ('data' in r) {
      try {
        r.data = JSON.parse(r.data);
      } catch (e) {}
    }
    return r;
  },

  renew_token: async () => {
    const did = await db.config.get('wallet_id');
    const key = await db.config.get('vc_key');

    return await $.ajax({
      url: WoolletAPI.static + '/users/token?_=' + Math.random(),
      type: 'POST',
      data: JSON.stringify({ wid: did.value, key: key.value }),
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + WoolletAPI.hdr,
        'X-W-ID': did.value,
      },
      error: function (e) {
        console.error(e);
      },
    });
  },

  delete: async (u, o) => {
    return await WoolletAPI.call('DELETE', u, o);
  },

  qrcode: async () => {},

  disconnect: async () => {},

  Credex: {
    list: async () => {
      const r = await WoolletAPI.post('/issuance/credential/ex/list');
      return r;
    },
  },

  Proof: {
    list: async () => {
      const r = await WoolletAPI.post('/verify/proof/list');
      return r;
    },
    get: async (i) => {
      const r = await WoolletAPI.post('/verify/get', JSON.stringify({ id: i }));
      return r;
    },
    request: async () => {},
    reward: async (s) => {
      const did = await db.config.get('wallet_id');

      const r = await WoolletAPI.post(
        '/proofex/request',
        JSON.stringify({ inv: s, wallet: did.value })
      );
      return r;
    },
    send: async (i, a, p, s) => {
      const o = {
        peid: i,
        attrs: a,
        preds: p,
        attested: s,
      };
      const r = await WoolletAPI.post(
        '/credential/proof/send',
        JSON.stringify(o)
      );
      return r;
    },
  },

  Cred: {
    list: async () => {
      const r = await WoolletAPI.post('/issuance/list');
      return r;
    },

    get: async (i) => {
      const r = await WoolletAPI.post(
        '/issuance/get',
        JSON.stringify({ id: i })
      );
      return r;
    },

    propose: async (c, f) => {
      const r = await WoolletAPI.post(
        '/issuance/proposal',
        JSON.stringify({ cobj: c, fields: f })
      );
      return r;
    },
  },

  Issuance: {
    list: async () => {
      const r = await WoolletAPI.post_server('/issuance/credex/list');
      r.data = r.data.results;
      return r;
    },
  },

  Conn: {
    connects: async (n) => {
      const did = await db.config.get('wallet_id');

      const r = await WoolletAPI.post(
        '/conn/woollet',
        JSON.stringify({ did: did.value, name: n })
      );

      // db
      await db.connections.bulkPut([
        { id: 'conn', value: r.data },
        { id: 'con_id', value: r.data.conection_id },
        { id: 'conn_key', value: r.data.invitation_key },
        { id: 'conn_time', value: r.data.updated_at },
      ]);
    },

    list: async () => {
      const r = await WoolletAPI.post('/conn/list');
      r.data = r.data.results;
      return r;
    },

    get: async (i) => {
      const r = await WoolletAPI.post(
        '/credential/conn/get',
        JSON.stringify({ id: i })
      );
      return r;
    },

    drop: async () => {},

    invite: async (n, a, m, o) => {
      const r = await WoolletAPI.post(
        '/conn/invite',
        JSON.stringify({ name: n, action: a, msg: m, data: o ? o : {} })
      );
      return r;
    },

    receive: async (s) => {
      const did = await db.config.get('wallet_id');
      const r = await WoolletAPI.post(
        '/conn/receive',
        JSON.stringify({ inv: s, wallet: did.value })
      );
      return r;
    },

    get_meta: async (id) => {
      const cid = localStorage.getItem('cid');

      const r = await WoolletAPI.get('/conn/meta', {
        con_id: id ? id : cid,
      });
      return r;
    },

    set_meta: async (id, o) => {
      const cid = localStorage.getItem('cid');

      const s = { data: { metadata: o } };
      const r = await WoolletAPI.post(
        '/conn/meta',
        JSON.stringify({ con_id: id ? id : cid, data: s })
      );
      return r;
    },

    ping: async (id) => {
      const cid = localStorage.getItem('cid');

      const i = id ? id : cid;
      const r = await WoolletAPI.post('/conn/ping/' + i);
      console.log(r);
    },

    message: async (id, msg) => {
      const cid = localStorage.getItem('cid');

      const i = id ? id : cid;
      const r = await WoolletAPI.post(
        '/conn/message',
        JSON.stringify({ con_id: i, msg: msg })
      );
      console.log(r);
    },
  },

  Verify: {
    list: async () => {
      const r = await WoolletAPI.post('/verify/list');
      r.data = r.data.results;
      return r;
    },
  },

  Schema: {
    list: async () => {
      const r = await WoolletAPI.post('/schema/list');
      r.data = r.data.schema_ids;
      return r;
    },
    Defs: {
      list: async () => {
        const r = await WoolletAPI.post('/schema/def/list');
        r.data = r.data.credential_definition_ids;
        return r;
      },

      get_list: (o) => {
        const r = [];
        for (const i in o.data.credential_definition.value.primary.r) {
          if (i == 'master_secret' || i.match(/^(org:|doc:)/i)) continue;
          r.push({ key: i, field: i, status: 0 });
        }
        return r;
      },
    },
  },

  System: {
    config: async () => {
      const r = await WoolletAPI.post('/server/config');
      r.data = r.data.config;
      return r;
    },

    status: async () => {
      const r = await WoolletAPI.post('/server/status');
      r.data = r.data;
      return r;
    },
  },

  Wallet: {
    token: async (o) => {
      const did = await db.config.get('wallet_id');
      const key = await db.config.get('vc_key');

      if (!o) {
        o = { wid: did.value, key: key.value };
      }
      o = JSON.stringify(o);
      const r = await WoolletAPI.post('/users/token', o);
      return r;
    },

    update: async () => {},
  },

  User: {
    prepare: async () => {
      await WoolletAPI.User.new_wallet();
      const did = await db.config.get('wallet_id');
      console.log('your wallet ID is', did.value);
      await WoolletAPI.User.new_coin_wallet();
      //  await WoolletAPI.User.cred_confirmation();
      await WoolletAPI.User.register_wallet(did.value);
    },

    new_wallet: async () => {
      const r = await WoolletAPI.call('POST', '/users/new');

      //db
      await db.config.bulkPut([
        { id: 'vc', value: r.data },
        { id: 'wallet_id', value: r.data.wallet_id },
        { id: 'vc_key', value: r.key },
        { id: 'wallet_name', value: r.data.settings['wallet.name'] },
        { id: 'avatar', value: r.data.settings['image_url'] },
        { id: 'token', value: r.data.token },
        { id: 'token_expiry', value: Date.now() },
        { id: 'created_at', value: r.data.created_at },
      ]);

      console.log('New VC wallet created', r);
      return r;
    },

    new_coin_wallet: async () => {
      const eth = await db.config.get('eth');

      if (!eth) {
        await WoolletAPI.eth.new();
        console.log('NEW coin wallet created');
      }
    },

    register_wallet: async (did) => {
      socket.on('register', async function (r) {
        // db
        await db.config.bulkPut([
          { id: 'cred', value: r },
          { id: 'ssid', value: r.referent },
          { id: 'def', value: r.cred_def_id },
          { id: 'card', value: r.attrs.card },
          { id: 'name', value: r.attrs.name },
          { id: 'role', value: r.attrs.role },
          { id: 'ssid_issued', value: r.attrs['date:issued'] },
          { id: 'ssid_expiry', value: r.attrs['date:expiry'] },
        ]);

        console.log('NEW SSID is received', r);
      });

      await socket.on('notification', (r) => {
        console.log(r);

        const def = r.credential_definition_id;
        const schema_id = r.schema_id;
        const name = r.raw_credential.values.name.raw;
        const title = r.raw_credential.values.title.raw;

        alert(
          'Create Crediential' +
            '\n' +
            'name: ' +
            name +
            '\n' +
            'title: ' +
            title +
            '\n' +
            'Def: ' +
            def +
            '\n' +
            'Schema ID: ' +
            schema_id
        );
      });

      await socket.emit('register', did);
    },

    list: async () => {
      const r = await WoolletAPI.post('/users/list');
      return r;
    },

    add: async (o) => {
      const r = await WoolletAPI.post('/users/add', JSON.stringify(o));
      return r;
    },

    create: async (r) => {
      const s = r.data.invitation_url.split('=')[1];
      console.log('REQUEST responded', r, s);
      if (!s) {
        console.log('REQUEST failed');
        return false;
      }
      const rq = await WoolletAPI.Conn.receive(s);
      console.log('SCANNED invitation', rq);

      // db
      await db.connections.bulkPut([
        { id: 'conn', value: rq.data },
        { id: 'con_id', value: rq.data.connection_id },
        { id: 'conn_key', value: rq.data.invitation_key },
        { id: 'conn_time', value: rq.data.updated_at },
      ]);
    },

    init_personal: async (email, pwd, name, card, trusted) => {
      await WoolletAPI.User.prepare();

      //db
      /*
      await db.config.bulkPut([
        { id: 'name', value: name },
        { id: 'title', value: title },
        { id: 'card', value: cardID },
        { id: 'avatar', value: photo },
      ]);
      */

      const did = await db.config.get('wallet_id');
      const eid = await db.config.get('eth_id');

      let q = '?_=' + crypto.randomUUID();

      q += '?&name=' + btoa(name);
      q += '&title=' + btoa(title);
      q += '&card=' + btoa(card);
      q += '&idx=' + btoa(did.value);
      q += '&idy=' + btoa(eid.value);

      console.log(q);

      console.log('REQUEST PERSONAL -> Admin Controller');
      WoolletAPI.admin(
        'GET',
        '/signup' + q,
        {},
        WoolletAPI.User.create
      );


      console.log('REQUEST personal sent');
    },

    init_business: async (name, title, cardID) => {
      await WoolletAPI.User.prepare();

      // db
      await db.config.bulkPut([
        { id: 'business_name', value: name },
        { id: 'business_title', value: title },
        { id: 'business_card', value: cardID },
      ]);

      const did = await db.config.get('wallet_id');
      const eid = await db.config.get('eth_id');

      let q = '?_=' + crypto.randomUUID();
      q += '&name=' + btoa(name);
      q += '&title=' + btoa(title);
      q += '&card=' + btoa(cardID);
      q += '&idx=' + btoa(did.value);
      q += '&idy=' + btoa(eid.value);

      console.log('REQUEST BUSINESS -> Admin Controller');
      WoolletAPI.admin(
        'GET',
        '/users/request/business' + q,
        {},
        WoolletAPI.User.create
      );
      console.log('REQUEST business sent');
    },

    token: async () => {
      const token = await db.config.get('token');
      const token_expiry = await db.config.get('token_expiry');

      if (!token || !token_expiry || Date.now() - token_expiry.value > 900000) {
        const r = await WoolletAPI.Wallet.token();

        // db
        await db.config.bulkPut([
          { id: 'token', value: r.data.token },
          { id: 'token_expiry', value: Date.now() },
        ]);

        return r;
      } else {
        console.log('Wallet active');
      }
    },
  },

  Orphe: {
    register: async (appID, key) => {
      const r = await WoolletAPI.call('POST', '/auth/register', {
        app_id: appID,
        nonce: key,
      });
      return r;
    },
    restore: async (sessionKey, appId, walletId) => {
      const chunks = (str, size) => {
        if (str == null) return [];
        str = String(str);
        size = ~~size;
        return size > 0
          ? str.match(new RegExp('.{1,' + size + '}', 'g'))
          : [str];
      };

      const DATA = {
        app_id: appId,
        session_key: sessionKey,
        wallet_id: walletId,
        nonce: 'x' + Math.random(),
      };

      const key_array = chunks(DATA.session_key, 64);
      let key = key_array.join('\n');
      key = '-----BEGIN PUBLIC KEY-----\n' + key + '\n-----END PUBLIC KEY-----';
      console.log('\n\nRe-formatted public key:\n\n', key);
      let encrypted = crypto.publicEncrypt(key, Buffer.from(DATA.app_id));
      // Use Base64 encoded encrypted data to before fetching API
      let encrypted_app_id = encrypted.toString('base64').trim();
      console.log(
        '\n\nORPHE_app_id encoded with session_key & base64 hash:\n\n',
        encrypted_app_id
      );
      DATA.app_id = encrypted_app_id;
      // const TEST_RENEW_STR = JSON.stringify(DATA);
      console.log(
        'Final calling parameters\n\n',
        JSON.stringify(DATA, null, 4)
      );

      const r = await WoolletAPI.call('POST', '/auth/restore', DATA);
      return r;
    },
  },

  eth: {
    new: async () => {
      const web3 = new Web3('https://evm.shibuya.astar.network:443');
      const wallet = web3.eth.accounts.create(
        Math.random() + 'x' + Math.random()
      );
      console.log('NEW coin wallet created', wallet);

      // db
      await db.config.bulkPut([
        {
          id: 'eth',
          value: { address: wallet.address, privateKey: wallet.privateKey },
        },
        { id: 'eth_id', value: wallet.address },
        { id: 'eth_key', value: wallet.privateKey },
      ]);
    },
  },

  Point: {
    faucet: async () => {
      const eid = await db.config.get('eth_id');

      WoolletAPI.admin(
        'GET',
        '/cryptos/faucet?_=' + crypto.randomUUID() + '&target=' + eid.value,
        {},
        (r) => {
          console.log(r);
        }
      );
    },
    return: async () => {
      const eid = await db.config.get('eth_id');

      const point = new Point(eid.value);
      point.init();
      point.transferTo(point.woollet, 3).then(function (r) {
        point.balance().then(function (r) {
          console.log(point.me, r);
        });
      });
    },
  },

  Member: {},

  Payment: {
    transactions: async () => {
      const r = await WoolletAPI.post('cryptos/transaction/list');
      return r;
    },
  },

  Ipfs: {},

  Datastore: {},

  Crypto: {
    meta: async () => {
      const r = await WoolletAPI.post('/cryptos/meta');
      return r;
    },

    meta2: async () => {
      const r = await WoolletAPI.post_static('/cryptos/meta');
      return r;
    },
  },
};
