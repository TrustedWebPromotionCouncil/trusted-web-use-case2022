import { Suspense } from 'react';
import { AppProps } from 'next/app';
import { RecoilRoot } from 'recoil';
import { ErrorBoundary } from 'react-error-boundary';

import '@/styles/globals.css';
import ErrorFallback from '@/components/ErrorFallback';
import Head from 'next/head';

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <RecoilRoot>
      <ErrorBoundary FallbackComponent={ErrorFallback} onError={console.error}>
        <div>
          <Head>
            <title>Trusted Web Subsidy</title>
            <meta name="description" content="Trusted Web Subsidy" />
            <link rel="icon" href="/favicon.ico" />
          </Head>

          <Suspense fallback={<div>Loading...</div>}>
            <Component {...pageProps} />
          </Suspense>
          {/* <main className="pl-2 pt-2">
            <Suspense fallback={<div>Loading...</div>}>
              <Component {...pageProps} />
            </Suspense>
          </main> */}
        </div>
      </ErrorBoundary>
    </RecoilRoot>
  );
};

export default MyApp;
