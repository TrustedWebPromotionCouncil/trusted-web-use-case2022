
import { Env } from "@/env"


export const Time = {
  now: (i)=>{
      if (i-0>0 && i<1049332188000) i*=1000;
      const n = i ? (new Date(i)):(new Date());
      return n.getFullYear()+'-'+(n.getMonth()-0+1).toString().padStart(2, '0')+'-'+n.getDate().toString().padStart(2, '0')+' '+n.getHours().toString().padStart(2, '0')+':'+n.getMinutes().toString().padStart(2, '0')+':'+n.getSeconds().toString().padStart(2, '0');
  },
  timestamp: ()=>{
      return (new Date()).getTime()
  },

};


export class Woollet {

  ai = Env.AI
  ui = Env.UI

  a = path => this.ai + '/' + path
  u = path => this.ui + '/' + path

  debug = false
  did = null
  token = null
  expiry = null
  signed = false

  constructor() {
    this.token = sessionStorage.getItem('token')
    this.signed = sessionStorage.getItem("token") !== null
    if (this.signed) {
      this.init()
    }
  }

  static unsigned = () => sessionStorage.getItem("token") === null

  async fetch (u, o, rv, m) {
      let r = await fetch(u, {
        method: m ? m : 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'Authorization': this.token,
        },
        body: o ? JSON.stringify(o) : null,
      }).catch(e=>{
        console.log(e)
      });
      r = await r.json();
      if (r && 'detail' in r && r.detail == 'Could not validate credentials') {
        window.location = '/';
        return null;
      }
      return this.resp(r, rv)
  
  }

  resp (r, rv) {
    if (typeof(r) == 'string')
      try { r = JSON.parse(r) } catch (e) { }
    if (typeof(r.data) == 'string')
      try { r.data = JSON.parse(r.data) } catch (e) { }
    if (rv) {
      r.data = r.data[rv];
    }
    return r;
  }

  init = () => {
    let j = sessionStorage.getItem('token')
    if (j) {
      j = j.split('.');
      this.did = JSON.parse(atob(j[1])).sub
      this.expiry = JSON.parse(atob(j[1])).exp
      this.signed = j !== null
    }    
  }

  set_token (t) {
    this.token =  'Bearer '+t;
    sessionStorage.setItem('token', this.token);
  }

  User = {
    profile:  o => this.fetch(this.u('users/profile'), o),
    signin:   async (u, p) => {
      let r = await fetch(this.u('token'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:  new URLSearchParams({username:u, password:p}).toString(),
      });
      r = this.resp(await r.json());
      if ('access_token' in r) {
        this.set_token(r.access_token)
        this.init()
      }
      return r;
    },
    signup:   async (e, p, n, c, o) => {
      let r = await this.fetch(this.u('signup'), {email:e, pwd:p, name:n, card:c, role:o})
      if ('access_token' in r) {
        this.set_token(r.access_token)
        this.init()
      }
      return r;
    },
    signoff:  async () => {
      sessionStorage.removeItem('token');
      this.token = null;
      this.expiry = null;
    }
  }

  System = {
    status:   o => this.fetch(this.u('server/status')),
    config:   o => this.fetch(this.u('server/config')),
    signin:   o => this.fetch(this.u('token')),
  }

  Wallet = {
    creds:    o => this.fetch(this.u('wallet/list'), o, 'results'),
    issues:   o => this.fetch(this.u('wallet/issues'), o, ''),
    proofs:   o => this.fetch(this.u('wallet/proofs'), o, 'results'),
    cred:     o => this.fetch(this.u('wallet/cred'), o, ''),
    issue:    o => this.fetch(this.u('wallet/issue'), o, ''),
    proof:    o => this.fetch(this.u('wallet/proof'), {id: o}, ''),
  }

  Data = {
    share:    (i, a, p, s) => this.fetch(this.u('proof/present'), {peid: i, attrs: a, preds: p, attested: s}, ''),
    revoke:   o => this.fetch(this.u('proof/revoke'), {id: o}, ''),
    drop:     o => this.fetch(this.u('proof/drop'), {id: o}, ''),
  }

  Proof = {
    test:     o => this.fetch(this.a('proof/woollet'), {did: o}, ''),      
    result:   o => this.fetch(this.a('proof/result'), {peid: o}, ''),
  }

  Conn = {
    list:     o => this.fetch(this.u('conn/lists'), o, 'results'),
    receive:  o => this.fetch(this.u('conn/receive'), { inv: o, wallet: Woollet.User.did() }),
    get:      o => this.fetch(this.u('conn/gets'), o),
  }

  Nft = {
    browser:  o => this.fetch(this.u('nft/browser')),
    transfer: (i, a) => this.fetch(this.u('nft/transfer'), {nft_id: i, addr: a}),
    mint:     o => this.fetch(this.u('nft/mint')),
  }

  Eth = {
    balance:  i => this.fetch(this.u('eth/token/balance')),
    faucet:   i => this.fetch(this.u('eth/token/faucet')),
    transfer: i => this.fetch(this.u('eth/token/transfer')),
    return:   i => {
      const point = new Point(i);
      point.init();
      point.transferTo(point.woollet, 3).then(function (r) {
        point.balance().then(function (r) {
          console.log(point.me, r);
        });
      });
    },
  }

}
