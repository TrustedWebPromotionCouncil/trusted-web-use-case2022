
import { io } from 'socket.io-client'
import { Env } from '@env'


export class WoolletSocket {
  
  host = Env.UI;
  path = '/comm/socket.io/';
  debug = true;
  channels = {};

  constructor() {
    this.socket = io(this.host, {
      path: this.path,
      transports: ['socketio', 'flashsocket', 'websocket', 'polling'],
    });
    this.channel('core', this.core);
    this.channel('messaging', this.messaging);
  }

  on(c, fx) {
    if (typeof fx == 'function' && c) {
      this.Events[c] = fx;
    }
  }

  channel(c, fx) {
    if (typeof fx == 'function') {
      this.channels[c] = fx;
    }
  }

  Events = {
    connect: () => {
      console.log('Socket connected (default event) ' + this.socket.id);
    },
    disconnect: () => {
      console.log('Socket disconnected');
    },
    connect_error: (e) => {
      console.log('Socket connect error', e);
    },
    error: () => {
      console.log('Socket error');
    },
    reconnect: () => {
      console.log('Socket reconnected');
    },
    reconnect_attempt: () => {
      console.log('Socket reconnect attempt');
    },
    reconnect_error: () => {
      console.log('Socket reconnect error');
    },
    reconnect_failed: () => {
      console.log('Socket reconnect failed');
    },
    ping: () => {
      console.log('Socket ping');
    },
  };

  register(n, fx) {
    if (n && typeof fx == 'function') {
      if (!(n in this.Events)) {
        this.Events[n] = fx;
      }
    }
  }

  keepalive() {
    this.socket.send('alive');
  }

  core(i) {
    console.log('CORE', i);
  }

  messaging(i) {
    console.log(i);
    if (i.status == 'success') {
      Dialog.notify(
        'Message received',
        'Time: ' +
          i.data.message.sent_time +
          '<br>From: ' +
          i.data.message.connection_id +
          '<br><br>' +
          i.data.message.content
      );
    } else if (i.status == 'error') {
      console.error(i.message, i);
    }
  }

  any(n, ...args) {
    if (n in this.Events) {
      if (typeof this.Events[n] == 'function') {
        this.Events[n](...args);
      }
    }
  }

  async listen(i) {
    if (this.debug) localStorage.debug = 'socket.io-client:socket';
    for (const c in this.channels) {
      this.socket.on(c, this.channels[c]);
    }
    this.socket.onAny(this.any.bind(this));
    console.log('LISTEN', this.channels);
  }

  async emit(t, m) {
    this.socket.emit(t, m);
  }
}
