import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head>
          <meta name="description" content="Woollet core system" />
          <link rel="icon" href="/favicon.ico" />        
      </Head>
      <body>
        <Main />
        <NextScript />
        <Script strategy="beforeInteractive"  src="https://code.jquery.com/jquery-3.5.1.js"></Script>
        <Script strategy="beforeInteractive"  src="https://cdn.datatables.net/1.13.2/js/jquery.dataTables.min.js"></Script>
        <Script strategy="beforeInteractive"  src="https://cdn.datatables.net/1.13.2/js/dataTables.bootstrap5.min.js"></Script>
        <Script>$.fn.dataTable.ext.errMode = 'none';</Script>
      </body>
    </Html>
  )
}