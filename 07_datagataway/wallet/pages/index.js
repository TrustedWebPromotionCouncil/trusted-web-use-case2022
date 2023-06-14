import { useEffect, useState } from 'react';
import Link from 'next/link';
import SigninWalletBtn from '@components/SigninWalletBtn';
import CreateWalletBtn from '@components/CreateWalletBtn';
import { Woollet } from '@data/woollet';


export default function Home() {
  // User info states

  const [ form, setForm ] = useState({
    email: '',
    pwd: '',
    name: '',
    card: '',
    trusted: 0
  })

  const [ is_sign_in, setIsSignIn ] = useState(true)
  const handleForm = e => {
    setForm({...form, [e.target.name]: e.target.value})
  }

  // System status
  useEffect(() => {
    const connected = () => {
      try {
        const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522')
        woollet.System.status().then((r) => {
//          console.log(r);
        });
      } catch (e) {
        console.log(e);
      }
    };
    connected();
  }, []);


  const actionCreate = e => {
    setIsSignIn(!is_sign_in)
  }
  // // Socket
  // useEffect(() => {
  //   const socket = io('http://ui.woollet.io', {
  //     path: '/comm/socket.io/',
  //     transports: ['socketio', 'flashsocket', 'websocket', 'polling'],
  //   });

  //   socket.on('ready', (r) => {
  //     console.log('Socket ready', r);
  //   });

  //   socket.emit('connects', 'Woollet');
  // }, []);

  return (
    <>
      <div className='mobile'>
        <div
          id='new'
          className='page justify-content-center'
          style={{
            height: '100vh',
            zIndex: '1000000',
            // backgroundColor: '#D1F7F5',
          }}
        >
          <br />
          <br />
          <br />
          <br />
          <picture>
            <img
              src='/images/woollet-logo-dark.png'
              alt='woollet-logo'
              style={{ display: 'block', width: '60%', marginLeft: '20%' }}
            />
          </picture>
          <div
            className='row text-center'
            style={{
              position: 'fixed',
              bottom: '0',
              width: '100%',
              margin: 'auto',
            }}
          >
            <div className='form mb-5 ps-5 pe-5'>
              <div className='mb-3'>
                <span>
                  <strong style={{ color: 'black' }}>Personal account</strong>
                  <div>Sign-in</div>
                </span>
              </div>
              <div className='mb-3'>
                <input
                  name="email"
                  className='form-control'
                  placeholder='Email'
                  value={form.email}
                  onChange={handleForm}
                  required
                />
              </div>
              <div className='mb-3'>
                <input
                  name="pwd"
                  type="password"
                  className='form-control'
                  placeholder='Password'
                  value={form.pwd}
                  onChange={handleForm}
                  required
                />
              </div>

              <div className={is_sign_in ? 'mb-3 d-none':'mb-3'}>
                <input
                  name="name"
                  className='form-control'
                  placeholder='Name'
                  value={form.name}
                  onChange={handleForm}
                />
              </div>
              <div className={is_sign_in ? 'mb-3 d-none':'mb-3'}>
                <input
                  name="card"
                  className='form-control'
                  placeholder='Physical Card ID'
                  value={form.card}
                  onChange={handleForm}
                />
              </div>
              <div className='mb-3 text-end'>
                <Link
                  href='#'
                  style={{ textDecoration: 'none', color: 'black' }}
                  onClick={actionCreate}
                >
                  <b>{is_sign_in ? 'Create new Wallet':'Sign into existing Wallet'}</b>
                </Link>
              </div>
              <div className='mb-3 text-end'>
                <input
                  type='file'
                  title='load a backup file to import account'
                  className='form-control text-white d-none'
                  style={{ textDecoration: 'none' }}
                  href={form.trusted}
                  onChange={handleForm}
                />
              </div>              
            </div>
            <h5 style={{ color: 'black' }}>
              <b>All your data in one</b>
            </h5>
            <div>
              <h6 style={{ color: 'black' }}>
                Carry digital versions of your driver&quot;s license, medical
                history, and other useful documentation
              </h6>
            </div>
            <div className={!is_sign_in ? 'mb-3 d-none':'mb-3'}>
              <SigninWalletBtn
                email={form.email}
                pwd={form.pwd}
                trusted={form.trusted}
                route='/home'
              />
            </div>
            <div className={is_sign_in ? 'mb-5 d-none':'mb-5'}>
              <CreateWalletBtn
                email={form.email}
                pwd={form.pwd}
                name={form.name}
                trusted={form.trusted}
                card={form.card}
                route='/home'
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
