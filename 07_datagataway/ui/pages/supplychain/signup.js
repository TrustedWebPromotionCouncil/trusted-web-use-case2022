
import { TableGeneric } from '@/components/tables'
import { CheckField, SelectOpr } from '@/components/verify'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { Container, Row, Col, Text, Link, Input, Button, Dropdown, Image, Table, Card, Textarea, Checkbox, Spacer } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import React from 'react'
import { useQRCode } from 'next-qrcode';
import useTranslation from 'next-translate/useTranslation';


export default function Page() {

    const { t, lang } = useTranslation('common');
    const [ cats, setCats ] = useState([
        {key: 'group', name: 'Organization Group'},
        {key: 'supplier', name: 'Supplier'},
        {key: 'service', name: 'Service Provider'},
        {key: 'outsource', name: 'Outsourced Service'},
    ])
    const [ cat, setCat ] = useState('')
    const actionCats = e => {
        if (e) {
            setForm({...form, ['cat']: e})
        }
    }
    const { SVG } = useQRCode();
    const { Canvas } = useQRCode();
    const [ qrcode_text, setQRCode ] = useState('orphe')
    const [ qrcode_hidden, setHidden ] = useState(true)
    const [ form_hidden, setFormHidden ] = useState(true)
    const [ hash, setHash ] = useState('')

    const [ i1, setI1 ] = useState(('...'))
    const [ i2, setI2 ] = useState(('...'))
    const [ i3, setI3 ] = useState(('...'))

    const states = (x) => {
        switch(x) {
            case 0:
                return (<b>...</b>);
            case 1:
                return (<b style={{color:'#00FF00'}}>OK</b>);
            case 2:
                return (<b style={{color:'#FF0000'}}>Error</b>);
        }
    }

    const [ submit, setSubmit ] = useState(false)

    const defaultForm = {
        name: '',
        desc: '',
        cat: '',
        did: '',
        wallet: '',
        contact: '',
        email: '',
        secret: '',
    };
    const [ form, setForm ] = useState(defaultForm)

    const handleForm = e => {
        const n = e.target.name;
        const v = e.target.value;
        setForm({...form, [e.target.name]: v})
    }

    const actionCreate = e => {
        setSubmit(true)
    }

    const actionReset = e => {
        setForm(defaultForm);
        setHidden(true);
    }

    useEffect(()=>{
        /*
        Next.DataList.get({code:'orphe_partner_categories'}).then(r=>{
            const a = []
            for (const i of r.data.list.split(',')) {
                a.push({key: i, name: i})
            }
            setCats(a)
        })
        */
    }, []);

    useEffect(()=>{

        if (!submit) return

        setFormHidden( false );

/*
            "name": "string",
            "desc": "string",
            "cat": "string",
            "email": "string",
            "meta": "string",
            "key": "string",
            "did": "string"
    const defaultForm = {
        name: '',
        desc: '',
        cat: '',
        did: '',
        wallet: '',
        contact: '',
        email: '',
        secret: '',
    };
*/

        setTimeout(()=>{setI1(states(1))}, 1000)

        Next.Carbon.Supplychain.new({
            name: form.name,
            desc: form.desc,
            cat: form.cat,
            email: form.email,
            meta: form.did,
            key: 'org-public-key',
            did: form.wallet,
        }).then(r=>{
            if (r.status==0) {

                setI2(states(1))

                Next.Carbon.Supplychain.staff({
                    org: form.wallet,
                    name: form.contact,
                    email: form.email,
                    secret: form.secret,
                }).then(s=>{
                    if (s.status==0) {
                        setI3(states(1))
                        console.log(s)

//                        setFormHidden( true );
//
//                        const src = atob(s.hash);
//                        const j = JSON.parse(src);
//                        setQRCode( JSON.stringify(j) );

//                        setHidden( false );
                    } else {
                        setI3(states(2))

                    }
                    setForm(defaultForm);

                })

            } else {
                setI1(states(2))
                setForm(defaultForm);

            }
        })

    }, [submit]);

//    (async () => {
        
/*

        _.socket.emit('register', j['recipientKeys'][0]);
        
        const k = JSON.stringify(j);
        $('#hash').val(k);
        const qrcode = new QRCode("qrcode", {
            text: k,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.Q
        });
        
        $('#qrcode').find('img').click(function () {
            $('#hash').copy();
        });
  */  
//    })();



    return (
        <>

            <Container className="pt-5 pb-4" gap={1} fluid>
                <Row gap={1}>
                    <Col gap={1}>
                        <Container gap={1}>
                            <Row>
                                <Col className='mb-5 text-center'>
                                    <Text h3>{t('Create Partner Account')}</Text>
                                </Col>
                            </Row>
                            <Row>
                                <Text>{t('createAccountDesc')}</Text>
                            </Row>

                            <Row className="mt-4">
                                <Text b>{t('Partner name')}</Text>
                            </Row>
                            <Row>
                                <Input name="name" area-label="name" required fullWidth css={{borderRadius: 32, height: 32}} onChange={handleForm} placeholder="" value={form.name}></Input>
                            </Row>

                            <Row className="mt-4">
                                <Text b>{t('Description')}</Text>
                            </Row>
                            <Row>
                                <Input name="desc" area-label="desc" required fullWidth css={{borderRadius: 32, height: 32}} onChange={handleForm} value={form.desc}></Input>
                            </Row>                            

                            <Row className="mb-5 mt-3">
                                <Text className="me-3">{t('createAccountInvite')}</Text>
                                <Link href="/supplychain/download">{t('Get one')}</Link>
                            </Row>
                            <Row className="mb-2">
                                <Text b>{t('Category')}</Text>
                            </Row>
                            <Row>
                                <Col>
                                    <Input area-label="cat" name="cat" fullWidth css={{borderRadius: 32, height: 32}} value={form.cat} />
                                </Col>
                                <Col>
                                    <Dropdown>
                                        <Dropdown.Button css={{width:'100%'}} flat>{t('Select a category')}</Dropdown.Button>
                                        <Dropdown.Menu aria-label={t('Select category')} items={cats} onAction={actionCats}>
                                        {(item) => (
                                            <Dropdown.Item key={item.key}>
                                                {item.name}
                                            </Dropdown.Item>
                                        )}
                                        </Dropdown.Menu>
                                    </Dropdown>                                
                                </Col>
                            </Row>
    
                            <Row className="mt-4">
                                <Text b>{t('Organization')}</Text>
                            </Row>
                            <Row>
                                <Col>
                                    <Input className="pe-2" area-label="did" name="did" fullWidth css={{borderRadius: 32, height: 32}} onChange={handleForm} placeholder="Public DID" value={form.did}></Input>
                                </Col>
                                <Col>
                                    <Input className="ps-2" area-label="wallet" name="wallet" fullWidth css={{borderRadius: 32, height: 32}} onChange={handleForm} placeholder="Wallet ID" value={form.wallet}></Input>
                                </Col>
                            </Row>

                            <Row className="mt-5">
                                <Text b>{t('Administrator Contact')}</Text>
                            </Row>


                            <Row className="mt-3 d-none">
                                <Text b>{t('Contact')}</Text>
                            </Row>
                            <Row className="d-none">
                                <Input name="user" required area-label="user" type="text" fullWidth css={{borderRadius: 32, height: 32}} value={form.user} onChange={handleForm} placeholder=""></Input>
                            </Row>

                            <Row className="mt-3">
                                <Text b>{t('Email')}</Text>
                            </Row>
                            <Row>
                                <Input name="email" required area-label="email" type="email" fullWidth css={{borderRadius: 32, height: 32}} value={form.email} onChange={handleForm} placeholder=""></Input>
                            </Row>

                            <Row className="mt-3">
                                <Text b>{t('Password')}</Text>
                            </Row>
                            <Row>
                                <Input name="secret" required area-label="secret" type="text" fullWidth css={{borderRadius: 32, height: 32}} value={form.secret} onChange={handleForm} placeholder=""></Input>
                            </Row>


                            <Row className="mt-5">
                                <Button onPress={actionCreate} style={{borderRadius: 32, height:34, width: '100%', fontSize: '110%', paddingLeft: 10}} placeholder="Name">{t('Create')}</Button>
                            </Row>

                        </Container>
                    </Col>
                    <Col>
                        <Row hidden={!qrcode_hidden} className="mt-5 pt-5">
                            <Col>
                                <img src="/images/carbon/co2.jpg" height={300} />
                            </Col>
                        </Row>


                        <Row className="pt-5" hidden={form_hidden}>
                            <Container>
                                <Row className='pt-5 pb-2'>
                                    <Col span={10}><Text b size={14}>Registering Organization</Text></Col>
                                    <Col offset={1} span={1}>{i1}</Col>                                
                                </Row>
                                <Row className='ps-2'>
                                    <Col span={2}><Text size={13}>DID</Text></Col>
                                    <Col>{form.did}</Col>
                                </Row>
                                <Row className='ps-2'>
                                    <Col span={2}><Text size={13}>Wallet</Text></Col>
                                    <Col>{form.wallet}</Col>
                                </Row>

                                <Row className='pt-5 pb-2'>
                                    <Col span={10}><Text b size={14}>Create Relationship Record</Text></Col>
                                    <Col offset={1} span={1}>{i2}</Col>
                                </Row>
                                <Row className='ps-2'>
                                    
                                </Row>
                                <Row className='pt-5 pb-2'>
                                    <Col span={10}><Text b size={14}>Connecting to Partner</Text></Col>
                                    <Col offset={1} span={1}>{i3}</Col>
                                </Row>
                                <Row className='ps-2'>
                                    
                                </Row>
                            </Container>
                        </Row>


                        <Row hidden={qrcode_hidden} className="mt-5 pt-5 mb-2">
                                <Text b>Scan QRCode with Wallet</Text>
                        </Row>
                        <Row hidden={qrcode_hidden} justify='center'>
                            <Container className='p-3' justify='center' css={{background: '$accents2'}}>
                                <Canvas
                                    text={qrcode_text}
                                    options={{
                                        level: 'Q',
                                        margin: 10,
                                        scale: 4,
                                        width: 300,
                                        color: { dark: '#000000FF', light: '#FFFFFFFF', },
                                    }}
                                />
                            </Container>
                            <Text>{hash}</Text>
                        </Row>
                        <Row hidden={qrcode_hidden} className="mt-5">
                            <Button onPress={actionReset} style={{borderRadius: 32, height:34, width: '100%', fontSize: '110%', paddingLeft: 10}} placeholder="Name">Reset</Button>
                        </Row>

                    </Col>
                </Row>
            </Container>
        </>
    )
}



