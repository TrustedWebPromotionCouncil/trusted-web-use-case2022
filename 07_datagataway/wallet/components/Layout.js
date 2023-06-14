import Head from 'next/head';
import Script from 'next/script';

export default function Layout({ children }) {
  return (
    <>
    <Head>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
    </Head>

      {/*
      <Script type='text/javascript' src='/jquery.min.js' />
      <Script src='https://unpkg.com/dexie/dist/dexie.js' />
      */}
      {/* <Script type='text/javascript' src='/bootstrap.min.js' /> */}
      {/* <Script
        src='https://code.jquery.com/jquery-3.2.1.slim.min.js'
        integrity='sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN'
        crossOrigin='anonymous'
      /> */}
      {/*
      <Script
        src='https://code.jquery.com/jquery-3.6.1.min.js'
        integrity='sha256-o88AwQnZB+VDvE9tvIXrMQaPlFFSUTR+nldQm1LuPXQ='
        crossOrigin='anonymous'
      />
      <Script
        src='https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js'
        integrity='sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q'
        crossOrigin='anonymous'
      />
      <Script
        src='https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js'
        integrity='sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl'
        crossOrigin='anonymous'
      />
      <Script
        type='text/javascript'
        src='https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.1-rc.0/web3.min.js'
      />
      <Script
        type='text/javascript'
        src='https://cdn.jsdelivr.net/gh/ethereumjs/browser-builds/dist/ethereumjs-tx/ethereumjs-tx-1.3.3.min.js'
      />
      */}

      {children}
    </>
  );
}
