

import { Container, Row, Col } from "@nextui-org/react";
import { useState, useEffect } from "react";
import Head from 'next/head'
import Footer from './footer'

import dynamic from 'next/dynamic'
const Header = dynamic(() => import('./header'), { ssr: false })
const NavbarLeft = dynamic(() => import('./navbar'), { ssr: false })

import useTranslation from 'next-translate/useTranslation';


export default function Layout({ children, title }) {
    
    const { t, lang } = useTranslation('common');

    useEffect(()=>{
        const pp = window.location.pathname.split('/');
        if (pp[1]=='api') {
            return;
        } else if (pp[1].length!=2) {
            window.location = '/'+lang+window.location.pathname;
        } else if (!['en', 'jp'].includes(pp[1])) {
            window.location = '/'+lang+window.location.pathname;
        }
    }, []);

    const NoSsr = ({ children }) => <>{children}</>
    const [ hidden, setHidden ] = useState(true);

    useEffect(()=>{

        if (sessionStorage.getItem('user.name')) {
            sessionStorage.setItem('uid', '40387f8b-6f28-4e9c-bc4f-9e9d8289b0ba')
            sessionStorage.setItem('name', sessionStorage.getItem('user.name'))
            sessionStorage.setItem('title', 'CEO')
            sessionStorage.setItem('avatar', 'https://i.pravatar.cc/150?u=a042581f4e29026704d')
            sessionStorage.setItem('type', 'core')
            sessionStorage.setItem('version', '1.2.1')
            sessionStorage.setItem('expiry', 15)

        } else {

            sessionStorage.setItem('uid', '40387f8b-6f28-4e9c-bc4f-9e9d8289b0ba')
            sessionStorage.setItem('name', '')
            sessionStorage.setItem('title', 'CEO')
            sessionStorage.setItem('avatar', 'https://i.pravatar.cc/150?u=a042581f4e29026704d')
            sessionStorage.setItem('type', 'core')
            sessionStorage.setItem('version', '1.2.1')
            sessionStorage.setItem('expiry', 15)
    
        }
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
                        <Col size={2} css={{minWidth: '230px', maxWidth: '230px', position: 'fixed', left: 0 }}>
                                <NavbarLeft />
                        </Col>
                        <Col id="content" hidden={hidden} size={10} css={{ position: 'relative', maxWidth: '85%', left: '180px' }}>
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