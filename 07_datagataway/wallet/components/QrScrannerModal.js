import React from 'react';
import { withRouter, NextRouter } from 'next/router';
import $ from 'jquery';

// icon
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode } from '@fortawesome/free-solid-svg-icons';

// qr
import Html5QrcodePlugin from './qr/Html5QrcodePlugin';
import { Html5QrcodeSupportedFormats } from 'html5-qrcode';

const formatsToSupport = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.UPC_EAN_EXTENSION,
];

// API
import { Woollet } from '@data/woollet';

// // Socket
// import { io } from 'socket.io-client';

// const socket = io('https://ui.woollet.io', {
//   path: '/comm/socket.io/',
//   transports: ['socketio', 'flashsocket', 'websocket', 'polling'],
// });

// socket.on('ready', (r) => {
//   console.log('Socket ready', r);
// });

// socket.on('notification', (r) => {
//   console.log(r);
// });

// socket.on('proof-request', (r) => {
//   r = JSON.parse(r);
//   console.log(r);
// });

// socket.on('envelope-request', (r) => {
//   console.log(`Data Envelope Request Received`);
//   r = JSON.parse(r);
//   console.log(r);
// });

// socket.on('proof-done', (r) => {
//   console.log(r);
// });

// socket.emit('connects', 'Woollet');

let captured = '';

const handleStop = () => {
  try {
    Html5QrcodePlugin.stop()
      .then((res) => {
        Html5QrcodePlugin.clear();
      })
      .catch((err) => {
        console.log(err.message);
      });
  } catch (err) {
    console.log(err);
  }
};

class QrScrannerModal extends React.Component {

  constructor(props) {

    super(props);
    this.state = {
      decodedResults: [],
      value: '',
      router: NextRouter,
    };
    // This binding is necessary to make `this` work in the callback.
    this.onNewScanResult = this.onNewScanResult.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  onSubmit(event) {
    console.log('A inv was submitted: ' + this.state.value);

    const req = JSON.parse(this.state.value);

    const q = btoa(JSON.stringify(req));

    (async () => {
      console.log(q)
      const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522');
      await woollet.Conn.receive(q).then((r) => {
        console.log(r);
      });

    })();

    event.preventDefault();
  }

  render() {
    return (
      <>
        <button
          type='button'
          data-toggle='modal'
          data-target='#exampleModalCenter'
          className='btn-scan'
          style={{marginTop:'34px'}}
        >
          <FontAwesomeIcon
            icon={faQrcode}
            style={{
              height: '1.5em',
              padding: '1px',
              color: 'black',
            }}
          />
        </button>

        <div
          className='modal fade'
          id='exampleModalCenter'
          tabIndex='-2'
          role='dialog'
          aria-labelledby='exampleModalCenterTitle'
          aria-hidden='true'
        >
          <div className='modal-dialog modal-dialog-centered' role='document'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h2 className='modal-title' style={{ color: 'black' }}>
                  QR コードスキャナー
                </h2>
                <button
                  type='button'
                  className='close border-0 bg-transparent'
                  data-dismiss='modal'
                  aria-label='Close'
                >
                  <span aria-hidden='true'>&times;</span>
                </button>
              </div>
              <div className='modal-body'>
                <Html5QrcodePlugin
                  fps={10}
                  qrbox={250}
                  disableFlip={false}
                  qrCodeSuccessCallback={this.onNewScanResult}
                  formatsToSupport={formatsToSupport}
                />

                {/* <ResultContainerPlugin results={this.state.decodedResults} /> */}
              </div>
              {/* <div className='modal-footer justify-content-center'>
                <button type='button' className='btn btn-primary '>
                  Enter code manually
                </button>
              </div> */}

              {/* <form className='d-grid' onSubmit={this.onSubmit}>
                <textarea onChange={this.handleChange}></textarea>
                <button className='btn'>SEND</button>
              </form> */}
            </div>
          </div>
        </div>
      </>
    );
  }

  onNewScanResult(decodedText, decodedResult) {
    console.log('App [result]', decodedResult);

    if (captured == decodedText) {
      return;
    }
    captured = decodedText;

    handleStop();

    setTimeout(() => {
      $('button.close').trigger('click');
    }, 800);
    //    alert('Scanning Succeed !');

    const req = JSON.parse(decodedText);
    console.log(req);

    const q = btoa(JSON.stringify(req));
    (async () => {

      const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522');
      console.log(q)
      woollet.Conn.receive(q).then(r => {
        console.log(r);
        setTimeout(() => {
          this.props.router.reload();
        }, 60000);

      });

    })();

    let decodedResults = this.state.decodedResults;
    decodedResults.push(decodedResult);
    this.setState((state, props) => {
      state.decodedResults.push(decodedResult);
      return state;
    });
  }
}

export default withRouter(QrScrannerModal);
