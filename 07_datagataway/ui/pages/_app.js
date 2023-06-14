

import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import '../styles/buttons.bootstrap5.min.css'
import '../styles/dataTables.bootstrap5.min.css'
//import { io } from 'socket.io-client'

import "@fortawesome/fontawesome-svg-core/styles.css"
import { config } from "@fortawesome/fontawesome-svg-core"

config.autoAddCss = false

//import App from 'next/app'
import { createTheme, NextUIProvider } from "@nextui-org/react"

const WoolletTheme = createTheme({
  type: 'light',
  theme: {
    colors: {
      background: '#FFFFFF',
      text: '#444444',
    },
  }
})

import Layout from '@/components/layout'

export default function App({ Component, pageProps }) {

  const getLayout = Component.getLayout ||
  function (page) {
    return (
      <> 
        <NextUIProvider theme={WoolletTheme}>
          <Layout>{page}</Layout>
        </NextUIProvider>
      </>
    )
  };

  return getLayout(<Component {...pageProps} />)
  
}

