

import { Container, Row, Col } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Head from 'next/head'
import Footer from './footer'

import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./header-no-menu'), { ssr: false })

export default function LayoutNoMenu({ children, title }) {

    const [ hidden, setHidden ] = useState(true);

    useEffect(()=>{
        sessionStorage.setItem('uid', '40387f8b-6f28-4e9c-bc4f-9e9d8289b0ba')
        sessionStorage.setItem('name', 'John')
        sessionStorage.setItem('title', 'CEO')
        sessionStorage.setItem('avatar', 'https://i.pravatar.cc/150?u=a042581f4e29026704d')
        sessionStorage.setItem('type', 'core')
        sessionStorage.setItem('version', '1.2.1')
        sessionStorage.setItem('expiry', 15)
        setTimeout(()=>setHidden(false)
        , 100);
    }, [])

    return (
        <>
            <Head>
                <meta charset="utf-8" />
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests" />
                <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta http-equiv="Cache-Control" content="no-store" />
                <meta http-equiv="Pragma" content="no-cache" />
                <meta http-equiv="Expires" content="0" />                
                <title>{'Woollet' + (title ? ' | ' + title : '')}</title>
            </Head>
            <header>
                <Header />
            </header>
            <main style={{ height: '100vh' }}>
                <Container alignContent="left" css={{ paddingTop: "80px !important"}}>
                    <Row gap={2}>
                        <Col id="content" hidden={hidden} size={12} css={{ position: 'relative', maxWidth: '98%' }}>
                            { children }
                        </Col>
                    </Row>
                </Container>
            </main>
            <footer>
                <Footer />
            </footer>
        </>
    )
}