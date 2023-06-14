
import { TableGeneric } from '@/components/tables'
import { CheckField, SelectOpr } from '@/components/verify'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { Container, Row, Col, Text, Link, Image, Canvas, Input, Button, Dropdown, Table, Card, Textarea, Checkbox, Spacer } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import React from 'react'
import { useQRCode } from 'next-qrcode';
import useTranslation from 'next-translate/useTranslation';


export default function Page() {

    const { t, lang } = useTranslation('common');

    const [ files, setFiles ] = useState([ ])
    const [ fs, setFs ] = useState([])

    const [ conns, setConns ] = useState([])
    const [ did, setDid ] = useState('')
    const [ cn, setCn ] = useState('')
    const [ form, setForm ] = useState({
        pid: '',
        user: '',
        type: [],
        date_from: '',
        date_to: '',
        purpose: '',
    })
    const [ org, setOrg ] = useState({
        id: '',
        name: '',
        user: '',
        auth: [],
    })
    const { Canvas } = useQRCode();
    const [ qrcode_text, setQRCode ] = useState('orphe')
    const [ qrcode_hidden, setHidden ] = useState(true)

    const [ auth, setAuth ] = useState([])

    useEffect(()=>{

        const o = sessionStorage.getItem('org.did');
        const n = sessionStorage.getItem('user.name');
        if (!o || !n) {
            window.location = '/'+lang+'/system/signin'
            return;
        }

        const a = (sessionStorage.getItem('org.auth')).split(',');
        setAuth(a)

        Next.Conn.list()
        .then(r=>{
            setConns(r.data);
        });

        Next.Envelope.list()
        .then(r=>{
            const e = [];
            const f = {};
            console.log(a)
            for (const i of r) {

                if (a.includes(i.name)) {
                    const fs = Object.keys(i.dataset);
                    console.log(i.name)
                    e.push({key: i.name, name: i.desc, dataset: i.dataset, fs:fs})    
                }
            }
            setFiles(e)
        });

        setForm({
            pid: o,
            user: n,
            type: [],
            date_from: '',
            date_to: '',
            purpose: '',    
        })        

    }, []);

    const actionFields = e => {
    }
    
    const actionReset = e => {}

    const actionUseQR = e => {
        const act = 'RequestDataSingle';
        const msg = 'Connect to user for data reqeust';
        Next.Conn.invite({name: 'Request', action: act, msg: msg}).then(inv=>{
            const src = atob(inv.hash);
            const j = JSON.parse(src);
            j['action'] = act;
            j['msg'] = msg;
            setQRCode( JSON.stringify(j) );
            setHidden( false );
            console.log(j)
        })        
    }

    const actionQrcode = e => {
 
    };

    const actionRequest = e => {
        window.location.href = '/jp/data/viewer'
    }


    const actionConn = e => {
        setCn(e)
    }

    return (
        <>

            <Container className="pb-4" gap={1} fluid>
                <Row gap={1}>
                    <Col gap={1}>
                        <Container gap={1}>
                            <Row gap={1} className="mb-4">
                                <Col>
                                    <Image width="10%" src="/images/logo/woollet-logo.png"/>
                                </Col>
                            </Row>
                            <Row>
                                <Col className='mb-5 text-center'>
                                <Text h3>Supply Chain Data Sharing Form</Text>
                                <Text h6>Request from related supply chain company</Text>
                                </Col>
                            </Row>

                            <Row>
                                <Text b>Company ID (Auto)</Text>
                            </Row>
                            <Row className="pb-5">
                                <Input id="cid" css={{width:'100%'}} readOnly value={did}></Input>
                            </Row>

                            <Row>
                                <Text b>Data Type</Text>
                            </Row>
                            <Row className="pt-3 pb-4 ps-5">
                                <Checkbox.Group defaultValue={[]} onChange={actionFields}>
                                    {files.map((o, i)=>{
                                       return(
                                        <Checkbox aria-label={o.key} size="xs" value={o.key}>{o.name}</Checkbox>
                                       )
                                    })}
                                </Checkbox.Group>
                            </Row>

                            <Row>
                                <Text b>Date Range</Text>
                            </Row>
                            <Row className="pb-2">
                                <Input id="date_from" css={{width:'100%'}}  placeholder="from"></Input>
                            </Row>

                            <Row justify='center'>
                                <Text b>to</Text>
                            </Row>
                            <Row className="pt-2 pb-3">
                                <Input id="date_to" css={{width:'100%'}}  placeholder="to"></Input>
                            </Row>

                            <Row>
                                <Text b>Purpose</Text>
                            </Row>
                            <Row className="pb-3">
                                <Textarea id="purpose" css={{width:'100%'}}  placeholder=""></Textarea>
                            </Row>

                            <Row>
                                <Text h5>Device ID</Text>
                            </Row>
                            <Row>
                                <Dropdown>
                                    <Dropdown.Button css={{width:'100%'}} flat>Select from related device id</Dropdown.Button>
                                    <Dropdown.Menu css={{ $$dropdownMenuWidth: "800px" }} aria-label="Select from active connections" items={conns} onAction={actionConn}>
                                            <Dropdown.Item aria-label={'i-'+Math.random()} key={'matsumoto_data_center'}>
                                               Matsumoto Data Center
                                            </Dropdown.Item>
                                            <Dropdown.Item aria-label={'i-'+Math.random()} key={'fast_pace_courier'}>
                                               Fast Pace Courier
                                            </Dropdown.Item>
                                            <Dropdown.Item aria-label={'i-'+Math.random()} key={'vietnan_factory'}>
                                               Vietnan Factory
                                            </Dropdown.Item>

                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row>
                                <Input id="conn" css={{width:'100%'}} readOnly placeholder="Input device id manually" value={cn}></Input>
                            </Row>

{/*
                            <Row justify='center' className="mt-3 mb-3">
                                <Text>or</Text>
                            </Row>
                            <Row className="pb-3">
                                <Col justify="center">
                                    <Button onPress={actionUseQR} css={{width:'100%'}}>Use QRCode to connect to a user wallet</Button>
                                </Col>
                                <Col justify="center" hidden>
                                    <Button onPress={actionReset} css={{width:'100%'}}>Reset</Button>
                                </Col>
                            </Row>                             
                            <Row justify='center'>
                                <Container className='p-3' justify='center' hidden={qrcode_hidden} css={{ width: 330, background: '$accents2'}}>
                                    <Canvas
                                        text={qrcode_text}
                                        options={{
                                            level: 'Q',
                                            margin: 10,
                                            scale: 4,
                                            width: 300,
                                            color: { dark: '#111111FF', light: '#FFFFFFFF', },
                                        }}
                                    />
                                </Container>
                            </Row>
                           
                            <Row className="pb-5">
                                <Text i size={12}>* Using QRCode will start process when mobile phone scan the code</Text>
                            </Row>
     */}


                            <Row className="pb-3 mt-5">
                                <Col justify="center">
                                    <Button onPress={actionRequest} css={{width:'96%'}}>Submit Request</Button>
                                </Col>
                                <Col justify="center">
                                    <Button onPress={actionReset} css={{width:'96%'}}>Reset</Button>
                                </Col>
                            </Row>   

                        </Container>
                    </Col>
                    <Col>
                        <Image src="/images/carbon/co2.jpg" height={600} />
                    </Col>
                </Row>
            </Container>
        </>
    )
}



