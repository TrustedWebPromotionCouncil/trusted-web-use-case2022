import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
            <meta charset='utf-8' />
            <meta name='theme-color' content='#131d54' />
            <meta http-equiv='X-UA-Compatible' content='IE=edge' />
            <meta
                http-equiv='Content-Security-Policy'
                content='upgrade-insecure-requests'
                />
            <meta
                http-equiv='Cache-Control'
                content='no-cache, no-store, must-revalidate'
                />
            <meta http-equiv='Cache-Control' content='no-store' />
            <meta http-equiv='Pragma' content='no-cache' />
            <meta http-equiv='Expires' content='0' />
            <meta name="description" content="Woollet Universal Wallet" />
            <title>Woollet Universal Wallet</title>
            <link rel='icon' href='/favicon.ico' sizes='32x32' />

            <Script
                strategy="beforeInteractive"
                src='https://code.jquery.com/jquery-3.6.1.min.js'
                crossOrigin='anonymous'
                />
                <Script
                strategy="beforeInteractive"
                src='https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js'
                crossOrigin='anonymous'
                />
            <Script
                strategy="beforeInteractive"
                src='https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js'
                crossOrigin='anonymous'
                />
            <Script
                src='https://cdnjs.cloudflare.com/ajax/libs/web3/1.7.1-rc.0/web3.min.js'
                />
            <Script
                src='https://cdn.jsdelivr.net/gh/ethereumjs/browser-builds/dist/ethereumjs-tx/ethereumjs-tx-1.3.3.min.js'
                />
            <Script
                src='https://unpkg.com/dexie/dist/dexie.js'
                />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}