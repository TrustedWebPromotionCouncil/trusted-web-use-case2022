export default function Splash() {
  return (
    <div
      id='splash'
      className='page flex justify-content-center bg-darkindigo'
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        margin: '0',
        zIndex: '1000000',
      }}
    >
      <div className='splash'>
        <picture>
          <img
            src='/images/woollet.png'
            alt='logo'
            style={{ width: '92%', marginLeft: '4%', marginTop: '40vh' }}
          />
        </picture>
      </div>
    </div>
  );
}
