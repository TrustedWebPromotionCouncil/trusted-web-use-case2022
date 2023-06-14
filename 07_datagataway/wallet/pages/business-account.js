import Link from 'next/link';
import CreateWalletBtn from '../components/CreateWalletBtn';

export default function businessAccount() {
  return (
    <div
      id='business'
      className='page justify-content-center bg-darkindigo'
      style={{ height: '100vh', zIndex: '1000000', backgroundColor: '#131d54' }}
    >
      <br />
      <br />
      <br />
      <br />
      <picture>
        <img
          src='/images/woollet.png'
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
              <strong style={{ color: 'white' }}>Business account</strong>
            </span>
          </div>
          <div className='mb-3'>
            <input
              className='form-control'
              id='b-name'
              placeholder='User name'
            />
          </div>
          <div className='mb-3'>
            <input
              className='form-control'
              id='b-title'
              placeholder='Title, e.g. CEO, Artist'
            />
          </div>
          <div className='mb-3'>
            <input
              className='form-control'
              id='b-card'
              placeholder='Company name'
            />
          </div>
          <div className='mb-3 text-white text-end'>
            <Link href='/' style={{ textDecoration: 'none', color: 'white' }}>
              <b> Open personal account </b>
            </Link>
          </div>
        </div>
        <h3 style={{ color: 'white' }}>
          <b>All your data in one</b>
        </h3>
        <div>
          <span style={{ color: 'white' }}>
            Carry digital versions of your driver&quot;s license, medical
            history, and other useful documentation
          </span>
        </div>
        <div className='mt-5'>
          <CreateWalletBtn />
        </div>
      </div>
    </div>
  );
}
