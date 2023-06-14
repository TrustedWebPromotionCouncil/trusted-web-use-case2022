const Tokens = {
  ABI: {
    erc20: [
      {
        constant: true,
        inputs: [],
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_from',
            type: 'address',
          },
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      {
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      {
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'owner',
            type: 'address',
          },
          {
            indexed: true,
            name: 'spender',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Approval',
        type: 'event',
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            name: 'from',
            type: 'address',
          },
          {
            indexed: true,
            name: 'to',
            type: 'address',
          },
          {
            indexed: false,
            name: 'value',
            type: 'uint256',
          },
        ],
        name: 'Transfer',
        type: 'event',
      },
    ],
  },
  balance: async () => {
    let minABI = [
      {
        constant: true,
        inputs: [{ name: '_owner', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        type: 'function',
      },
      {
        constant: true,
        inputs: [],
        name: 'decimals',
        outputs: [{ name: '', type: 'uint8' }],
        type: 'function',
      },
    ];
    const token = '0xe64d0bccc9fe91a3594e993aec969723f32ccaec';
    const wallet = await _.store.get('me.eth.id');

    const web3 = new Web3('https://chain.woollet.io:443');
    let contract = new web3.eth.Contract(minABI, token);
    const balance = await contract.methods.balanceOf(wallet).call();
    return balance / 1000000000000000000;
  },
};

export class Point {
  web3 = null;
  token = null;
  provider = 'https://chain.woollet.io:443';
  woollet = '0x5Ae176ba758D52EcB265185ca52E6ea41f58105F';
  me = null;
  contract = '0xe64d0bccc9fe91a3594e993aec969723f32ccaec';
  dec = 10 ** 18;

  constructor(i) {
    this.me = i;
  }

  init() {
    if (this.web3 == null || this.token == null) {
      this.web3 = new Web3(this.provider);
      this.token = new this.web3.eth.Contract(Tokens.ABI.erc20, this.contract, {
        from: this.me,
      });
    }
  }

  async balance() {
    return await this.balanceOf(this.me);
  }

  async balanceBase(i) {
    return this.web3.eth.getBalance(i) / this.dec;
  }

  async balanceOf(i) {
    this.init();
    const r = await this.token.methods.balanceOf(i).call();
    return r / this.dec;
  }

  async transfer(to, amt) {
    this.init();
    const nonce = await this.web3.eth.getTransactionCount(this.me);
    console.log(nonce);
    const k = await _.store.get('me.eth.key');
    let pk = new ethereumjs.Buffer.Buffer(k.substring(2, 66), 'hex');

    await this.web3.eth.getAccounts(function (oo) {
      for (const i in oo) {
        this.web3.eth.getBalance(i).then(function (r) {
          console.log(i, r);
        });
      }
    });

    const raw = {
      nonce: this.web3.utils.numberToHex(nonce),
      gasPrice: this.web3.utils.numberToHex(1000),
      gasLimit: this.web3.utils.numberToHex(21000),
      to: to,
      value: amt,
      data: '',
      chainId: 2048,
    };
    const tx = new ethereumjs.Tx(raw, { chain: 2048 });
    tx.sign(pk);
    const data = tx.serialize();
    await this.web3.eth
      .sendSignedTransaction('0x' + data.toString('hex'))
      .on('receipt', console.log);
  }

  async transferTo(to, amt) {
    const a = amt * this.dec;
    console.log(a);
    const amount = this.web3.utils.toHex(a);
    console.log(amount);
    const data = this.token.methods.transfer(to, amount).encodeABI();

    const k = localStorage.getItem('eth_key');

    const tx = {
      gas: this.web3.utils.toHex(100000),
      from: this.me,
      to: this.contract,
      data: data,
      chain: 2048,
      chainId: 2048,
      hardfork: 'petersburg',
      value: '0x00',
    };

    return this.web3.eth.accounts.signTransaction(tx, k, (e, stx) => {
      if (e) {
        return console.log(e);
      } else {
        console.log('SIGNED: ', stx);
        return this.web3.eth.sendSignedTransaction(
          stx.rawTransaction,
          (err, res) => {
            if (err) {
              console.log(err);
              const ee = err.toString().split('ERC20');
              alert('ERC20 ' + ee[1]);
            } else {
              console.log('SENT: ', res);
              setTimeout(function () {
                // $.mobile.go('#profile');
              }, 1000);
            }
          }
        );
      }
    });
  }
}

// class NumberPad {
//   pad = null;
//   amt = null;

//   constructor(p, a) {
//     this.pad = $(p);
//     this.amt = $(a);
//     var self = this;
//     this.pad.find('button').each(function () {
//       const me = $(this);
//       me.data('n', me.html());
//       me.data('pad', self);
//       me.click(self.click);
//     });
//   }

//   ac() {
//     pad.amt.html('0.00');
//   }

//   click() {
//     const me = $(this);
//     let n = me.data('n');
//     const pad = me.data('pad');
//     if (n == 'AC') return pad.ac();
//     if (pad.amt.html().length > 10) return;

//     let v = pad.amt.html();
//     n /= 100;
//     if (me.hasClass('c00')) v *= 100;
//     else v *= 10;
//     pad.amt.html((n + v).toFixed(2));
//   }
// }

// const pad = new NumberPad('table.calc', 'span.amt');
