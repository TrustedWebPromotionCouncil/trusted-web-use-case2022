
import { CardWarning, CardMessage } from '@/components/cards';
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

    root = ''
    path = ''
    url = ''
	  cols = [
        {key: 'key', label: 'Key'},
        {key: 'value', label: 'Value'},
    ];
    _exclude = []
    _include = '*'
    data = {}
    r = {}
    _title = '';
    e = 0.0;

	  is_not_standard_woollet_obj = false;

    constructor(t){
		this._title = t;
        this.root = process.env.WOOLLET_API + '/'
    }

    title(t) {
        this._title = t;
    }

    include(o) {
        if (!o) this._include = [];
        else if (Array.isArray(o)) this._include = o;
        else if (typeof(o) == 'string') this._include.push(o);
    }

    exclude(o) {
      if (!o) this._exclude = [];
      else if (Array.isArray(o)) this._exclude = o;
      else if (typeof(o) == 'string') this._exclude.push(o);
      return this;
    }

    error() {
        // should return null if data has no problem
        if (!this.data) {
          this.e = 0.2
        } else if (this.data.status) {
          this.e = 0.3
        } else if (!this.is_not_standard_woollet_obj && !this.data.data) {
          this.e = 1.0
        } else {
          return null;
        }
    }

    async get() {
      try {
        const res = await fetch(this.root + this.url);
        this.data = await res.json();
      } catch (e) {
        this.e = 0.1
      }
    }

    async post() {
        try {
          const res = await fetch(this.root + this.url, {method: 'POST'});
          this.data = await res.json();
        } catch (e) {
          this.e = 0.1
        }
    }

    extract_key_values() {
        this.error()
        if (this.e > 0.0) {
          return null;
        }
        try {
          const data = this.path;
          let r = [];
          for (const i of Object.keys(data)) {
            if (this._exclude.includes(i)) continue;
            if (this._include=='*' || this._include.includes(i)) {
      				r.push({key: i, value: data[i]})
            }
          }
    		  this.r = r;
        } catch (e) {
			this.e = e;
        }
    }

	  static key_values(o) {
        try {
          let r = [];
          for (const i of Object.keys(o)) {
    				r.push({key: i, value: o[i]})
          }
		  return r;
        } catch (e) {
			return e;
        }
    }

    resp(r) {
		this.r = 
      this.r = {
        items: r,
        time: this.data.time,
        title: this._title,
      }
    }

    output() {
      if (this.e > 0 && this.e!=1.0) {
        return {
          title: this._title,		
          error: this.e,
        }
      } else {
        if (!this.data) {
          return {
            cols: this.cols,
            title: this._title,		
            items: this.r,
            time: '',
            hidden: false,
            loading: false,
          }	
  
        } else {
          return {
            cols: this.cols,
            title: this._title,		
            items: this.r,
            time: this.data.time,
            hidden: false,
            loading: false,
          }	
  
        }
      }
    }

    extract_array(fx) {
        const e = this.error()
        if (e) {
          this.e = e;
          return null;
        }
        try {
    			const data = this.path;
          let r = [];
          for (const i of data) {
              const ri = fx(i);
              if (Array.isArray(ri)) {
                const o = {key: ri[0]}
                for (let c=1; c<ri.length; c++) {
                  
                  o[this.cols[c].key] = ri[c]
                }
                r.push(o)
              } else if (typeof(ri)=='object') {
                r.push(ri)
              }
          }
          this.r = r;
        } catch (e) {
			this.e = e;
        }
    }

}
