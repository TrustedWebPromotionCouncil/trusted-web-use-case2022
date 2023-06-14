import React from 'react';

export default function Loading() {
  return (
    <>
      <div
        id='creating'
        className='page flex justify-content-center bg-white'
        style={{ display: 'none', height: '100%', zIndex: '1000000' }}
      >
        <div
          className='spinner-border text-primary mb-5'
          style={{ marginLeft: '47%', marginTop: '80%' }}
          role='status'
        >
          <span className='sr-only'>Loading...</span>
        </div>
        <div className='mt-3 text-center'>
          <b>Creating wallet, please wait...</b>
        </div>
      </div>
      <div
        id='success'
        className='page flex justify-content-center bg-white text-center'
        style={{ display: 'none', height: '100%', zIndex: '1000000' }}
      >
        <div style={{ marginTop: ' 80%' }}></div>
        <i
          className='fa fa-check-circle dodgerBlue'
          style={{ fontSize: '400%' }}
        ></i>
        <br />
        <br />
        <div className='mt-3 text-center'>
          <b>Wallet successfully created</b>
        </div>
      </div>
    </>
  );
}
