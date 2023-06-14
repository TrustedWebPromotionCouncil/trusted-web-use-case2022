
import { io } from 'socket.io-client'
import React from 'react'
import { useState, useEffect } from 'react'
import { Next, Did } from '@/data/did'
import { Container, Row, Col, Text, Input, Button } from '@nextui-org/react'
import { useQRCode } from 'next-qrcode';
import { setConfig } from 'next/config'
import useTranslation from 'next-translate/useTranslation';
import { Env } from "@/env"

export default function Page() {

    const { t, lang } = useTranslation('common');

    const { Canvas } = useQRCode();
    const [ uid, setUid ] = useState('')
    const [ pwd, setPwd ] = useState('')
    const [ qrcode_text, setQRCode ] = useState('carbon')
    const [ qrcode_hidden, setHidden ] = useState(true)
    const [ socket, setSocket ] = useState(io(Env.AI, {path: '/comm/socket.io/', transports : ['socketio', 'websocket', 'flashsocket', 'polling' ] }))

    useEffect(()=>{

        if (sessionStorage.getItem('user.name')) {
            window.location.href = '/'+lang+'/data/viewer'
            return;
        }
        socket.on('workflow', (r)=>{
            console.log('Workflow response', r);
        });
        socket.on('carbon-partner-signin', r=>{
            console.log('Sign-in successful', r);
        });
        setSocket(socket)
    }, []);

    const checkState = (k) => {
        Next.Conn.state({id: k}).then(r=>{
            console.log(r)
            if (r.data.state==2 && r.data.org) {
                sessionStorage.setItem('user.name', r.data.user.name)
                sessionStorage.setItem('org.name', r.data.org.name)
                sessionStorage.setItem('org.id', r.data.org.meta)
                sessionStorage.setItem('org.cat', r.data.org.cat)
                console.log('WELCOME ', r.data.org);
                window.location.href = '/'+lang+'/data/viewer'
            } else {
                setTimeout(()=>checkState(k), 10000)
            }
        })
    }

    const setForm = e => {
        const v = e.target.value;
        switch (e.target.name) {
            case 'uid':
                setUid(v);
                break;
            case 'pwd':
                setPwd(v);
                break;
        }
    }

    const actionSignin = e => {
        const o = 'username='+uid+'&password='+pwd
        Next.System.signin(o).then(r => {
            if (r.staff && r.org) {
                sessionStorage.setItem('token', r.access_token)
                sessionStorage.setItem('org.did', r.org.did)
                sessionStorage.setItem('org.auth', r.org.auth)
                sessionStorage.setItem('org.name', r.org.name)
                sessionStorage.setItem('user.did', r.staff.did)
                sessionStorage.setItem('user.name', r.staff.name)
                sessionStorage.setItem('user.company', r.staff.company)
                setTimeout(()=>{
                    window.location = '/' + lang + '/data/request';
                }, 1000);
            }
        })
    }


    useEffect(()=>{

        let key = ''

        const name = 'Carbon Tracing Woollet Sign-in';
        const action = 'carbon-partner-signin';
        const msg = 'Woollet Administrator Sign-in';
        const data = { def_id: 'UQERkGnrUuJBMfaAW6hNPs:3:CL:1134:Membership-4.5.3' }

        Next.Conn.invite({name: name, action: action, msg: msg, data:data}).then(inv=>{
            const src = atob(inv.hash);
            const j = JSON.parse(src);
            j['action'] = action;
            j['msg'] = msg;
            setHidden( false );
            setQRCode( JSON.stringify(j) );
            key = inv.data.invitation.recipientKeys[0]
//            setTimeout(()=>checkState(key), 10000)
            socket.emit('workflow', JSON.stringify({key: key, channel: action}));
        })
    }, []);

    return (
        <>

        <Container className="pb-4" gap={1} fluid>

            <Row className="mt-5" justify='center'>
            <Text h4 b>{t('Woollet Staff Sign-in')}</Text>
            </Row>
            <Row justify='center'>
                <Text b>{t('Scan QRCode with Wallet')}</Text>
            </Row>

            <Row className="mt-5" hidden={qrcode_hidden} justify='center'>
                <Container className='p-3' justify='center' css={{width: 'auto', background: '$accents2'}}>
                    <Canvas
                        text={qrcode_text}
                        options={{
                            level: 'Q',
                            margin: 10,
                            scale: 4,
                            width: 400,
                            color: { dark: '#111111FF', light: '#FFFFFFFF', },
                        }}
                    />
                </Container>
            </Row>

            <Row className="mt-5">
                <Col offset={4} span={4}>
                    <Input label='Email' name="uid" fullWidth onChange={setForm}></Input>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col offset={4} span={4}>
                    <Input label="Password" name="pwd" fullWidth onChange={setForm}></Input>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col offset={4} span={4}>
                    <Button className="w-100" onPress={actionSignin}>Sign-in</Button>
                </Col>
            </Row>
            <Row className="mt-4">
                <Col offset={7} span={2} justify="center">
                    <a href="/forget">Forget password</a>
                </Col>
            </Row>

        </Container>
        </>
    )
}

/*
Page.getLayout = function getLayout(page) {
    return (
        <LayoutNoMenu>{page}</LayoutNoMenu>
    )
}
*/
