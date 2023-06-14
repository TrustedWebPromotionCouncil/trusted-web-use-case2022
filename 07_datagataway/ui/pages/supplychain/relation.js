
import { TableData, DataTables } from '@/components/tables'
import { ModalOk } from '@/components/modal';
import { CheckField, SelectOpr } from '@/components/verify'
import { Woollet, Time } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { Container, Row, Col, Text, Input, Button, Dropdown, Checkbox, Navbar, useModal, Loading } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import React from 'react'

import useTranslation from 'next-translate/useTranslation';


export default function Page() {

    const { t, lang } = useTranslation('common');
    
    const [ files, setFiles ] = useState([])
    const [ selected, setSelected] = useState([])
    const [ orig, setOrig ] = useState([])
    const [ updated, setUpdated ] = useState(false)

    const [ dids, setDids ] = useState([])
    const [ staffs, setStaffs ] = useState([])

    const [ did, setDid ] = useState('')
    const [ client, setClient ] = useState('')
    const [ type, setType ] = useState('')
    const [ group, setGroup ] = useState('')
    const [ contact, setContact ] = useState('')

    const [ partner, setPartner ] = useState({})


    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')
    const [ hideLoading, setHideLoading ] = useState(false)
    const [ hideNewStaff, setHideNewStaff ] = useState(true)

    const [ tt, setTable ] = useState({title: '', name: '', time: 0})

    const [ staff, setStaff ] = useState({
        did: '',
        org: '',
        name: '',
        email: '',
        secret: '',
    })


    const actionDid = e => {
        setDid(e);
        Next.Carbon.Supplychain.get({did: e})
        .then(r=>{
            console.log(r.data)
            setSelected(r.data.auth)
            setOrig(r.data.auth.sort())
            setClient(r.data.name)
            setContact(r.data.email)
            setStaffs(r.data.staffs)
            setPartner(r.data)

            setStaff(
                {...staff, ['org'] : r.data.did}
            )

            tt.render()
        })
    }

    const actionIssue = e => {
        if (!did || !updated) return;
        const action = [];
        const current = [];

        for (const i of orig) {
            if (!selected.includes(i)) {
                current.push(i);
                action.push('-')
            }
        }

        for (const i of selected) {
            if (!orig.includes(i)) {
                current.push(i);
                action.push('+');
            }            
        }

        Next.Carbon.Supplychain.auth({
            did: did,
            acl: current,
            action: action
        }).then(r=>{
            if (r.status == 0) {
                setOrig(selected)
            }
        })
    }

    const actionReset = e => {
        actionDid(did)
        actionFiles(selected)
    }

    const actionFiles = e => {
        setSelected(e)
        if (did) {
            setUpdated(JSON.stringify(orig) !== JSON.stringify(e.sort()))
        }
    }

    const actionNewStaff = e => {
        setHideNewStaff(false)   
    }

    const actionPostNewStaff = o => {
        console.log(staff)
        staff.did = staff.wallet;
        Next.Carbon.Supplychain.staff(staff).then(r=>{
            console.log(r)
            setHideNewStaff(true);
            staff.did = ''
            staff.email = ''
            staff.secret = ''
        })
    }

    const handleForm = e => {
        console.log(e.target.name, e.target.value)
        setStaff({...staff, [e.target.name]: e.target.value})
    }

    useEffect(()=>{

        Next.Carbon.Supplychain.list()
        .then((r)=>{
            const o = []
            for (const i of r.data) {
                o.push({key: i.did, name: i.name})
            }
            setDids(o)
        });

        Next.Envelope.list()
        .then(r=>{
            const o = [];
            const f = {};
            for (const i of r) {
                const fs = Object.keys(i.dataset);
                o.push({key: i.name, name: i.desc, dataset: i.dataset, fs:fs})
            }
            setFiles(o)
        });

        listStaffs()


      }, []);


    const [ nav, setNav ] = useState('profile')

    const actionNav = (e) => {
        setNav(e.target.id)
        switch (e.target.id) {
            case 'staffs':
                listStaffs();
                break;
        }

    }

    const showTab = e => {
        return e != nav
    }

    const listStaffs = e => {
        const ttt = new DataTables('staffs')
        ttt.title = 'Staffs'
        ttt.data(staffs)
        ttt.col('did', 'Wallet ID', 'small', null, function(td, o, rd, r, c){
            const b = $( '<button class="btn btn-secondary btn-sm w-100">'+o+'</button>' ).on('click', () => {
                setModalTitle('Staff Detail')
                setModalData(<Loading />)
                setVisible(true)
                Next.Carbon.Supplychain.get({did: o})
                .then(r=>{
                    setModalData(JSON.stringify(r.data, null, 4))
                })
            } );
            $( td ).html( b );
        })
        ttt.col('name', 'Name')
        ttt.col('title', 'Category')
        ttt.col('email', 'Contact', 'small', o=>{
            if (o) { return o }
            return ''
        })
        ttt.col('created', 'Created', 'small', (o)=>{
            return Time.now(o)
        });
        ttt.render();
        ttt.on('draw', ()=>{
            setHideLoading(true)
        })
        setTable(ttt)
    }

    return (
        <>
            <Row>
                <Col className='mt-2 mb-2 ps-3'>
                    <Text h3>Relationship Management</Text>
                </Col>
            </Row>

            <Row className="mb-4">
                <Navbar>
                    <Col span={5}>
                    <Navbar.Content variant="highlight-rounded" gap={3}>
                        <Navbar.Link href="#" onClick={actionNav} id="profile" isActive={nav=='profile'}>Profile</Navbar.Link>
                        <Navbar.Link href="#" onClick={actionNav} id="acl"     isActive={nav=='acl'}>ACL</Navbar.Link>
                        <Navbar.Link href="#" onClick={actionNav} id="staffs"  isActive={nav=='staffs'}>Staffs</Navbar.Link>
                        <Navbar.Link href="#" onClick={actionNav} id="perms"   isActive={nav=='perms'}>Our Permissions</Navbar.Link>
                    </Navbar.Content>
                    </Col>
                    <Col span={3}>
                        <Text b>{client}</Text>
                    </Col>
                    <Col span={2}>
                        <Dropdown>
                        <Dropdown.Button flat>Select client</Dropdown.Button>
                        <Dropdown.Menu aria-label="Select Wallet ID"  css={{width:'100%'}} items={dids} onAction={actionDid}>
                        {(item) => (
                            <Dropdown.Item aria-label={item.key} key={item.key}>
                                {item.name}
                            </Dropdown.Item>
                        )}
                        </Dropdown.Menu>
                        </Dropdown>
                    </Col>
                </Navbar>
            </Row>

            <Container id="tab-profile" className="tabs mt-5" hidden={showTab('profile')} fluid>
                <Row className='mt-2'>
                    <Col span={4} className='mb-5'>
                        <Text h3>Partner Profile</Text>
                    </Col>
                    <Col offset={5} span={1} className="ps-5">
                    </Col>
                </Row>
                <Row>
                    <Col span={6} className="pe-2">
                        <Text h5>Name</Text>
                    </Col>
                    <Col span={4} className="pe-2">
                        <Text h5>Administrator</Text>
                    </Col>
                    <Col span={2} className="pe-2">
                        <Text h5>Partner Type</Text>
                    </Col>
                </Row>
                <Row className="pt-2">
                    <Col span={6} className="pe-2">
                        <Input aria-label="client" css={{width:'100%', fontWeight: 'bold'}} readOnly placeholder="Client name" value={client}></Input>
                    </Col>
                    <Col span={4} className="pe-2">
                        <Input aria-label="administrator" css={{width:'100%'}}  readOnly placeholder="Contact method" value={partner.email}></Input>
                    </Col>
                    <Col span={2} className="pe-2">
                        <Input aria-label="client-type" css={{width:'100%'}} readOnly placeholder="Type" value={partner.title}></Input>
                    </Col>
                </Row>
                <Row className="pt-5">
                    <Col span={6} className="pe-2">
                        <Text h5>Wallet ID</Text>
                    </Col>
                    <Col span={6} className="pe-2">
                        <Text h5>Parent / Up-stream</Text>
                    </Col>
                </Row>
                <Row className="pt-2">
                    <Col span={6} className="pe-2">
                        <Input aria-label="user-did" css={{width:'100%'}} readOnly placeholder="" value={partner.did}></Input>
                    </Col>
                    <Col span={6} className="pe-2">
                        <Input aria-label="user-group" css={{width:'100%'}} readOnly placeholder="" value={partner.company}></Input>
                    </Col>
                </Row>

                <Row className="pt-5">
                    <Col span={6} className="pe-2">
                        <Text h5>DID</Text>
                    </Col>
                    <Col span={6} className="pe-2">
                        <Text h5>Connection ID</Text>
                    </Col>
                </Row>
                <Row className="pt-2">
                    <Col span={6} className="pe-2">
                        <Input aria-label="public-did" css={{width:'100%'}} readOnly placeholder="" value={partner.card}></Input>
                    </Col>
                    <Col span={6} className="pe-2">
                        <Input aria-label="con-id" css={{width:'100%'}} readOnly placeholder="" value={partner.con_id}></Input>
                    </Col>
                </Row>

                <Row className="pt-5">
                    <Col span={12} className="pe-2">
                        <Text h5>Public Key</Text>
                    </Col>
                </Row>
                <Row className="pt-2">
                    <Col span={12} className="pe-2">
                        <pre>{partner.rsa_pub}</pre>
                    </Col>
                </Row>                

            </Container>
            <Container id="tab-acl" className="tabs mt-5" hidden={showTab('acl')} fluid>

                <Row>
                    <Col className='mb-5'>
                        <Text h3>Data Credential Types</Text>
                    </Col>
                </Row>

                <Row>
                    <Col>
                    <Checkbox.Group defaultValue={[]} onChange={actionFiles} value={selected} >
                        {files.map((o, i)=>{
                            return (
                                <Row className="pt-3">
                                    <Container>

                                        <Row>
                                            <Checkbox aria-label={o.key} size="sm" value={o.key}><b>{o.name}</b></Checkbox>
                                        </Row>
                                        {o.fs.length>0 &&
                                            <Row className="pt-3">
                                                <Col offset={2} span={2} className="bg-secondary ps-1">
                                                    <Text aria-label={o.key+'-tag'} b size="$xs" color="white">Tag</Text>
                                                </Col>                                                
                                                <Col span={5} className="bg-secondary">
                                                    <Text aria-label={o.key+'-type'} b size="$xs" color="white">Data Type</Text>
                                                </Col>
                                                <Col span={3} className="bg-secondary">
                                                    <Text aria-label={o.key+'-fx'} b size="$xs" color='white'>Formula</Text>
                                                </Col>
                                                <Col span={1} className="bg-secondary">
                                                    <Text aria-label={o.key+'-unit'} b size="$xs" color='white'>Unit</Text>
                                                </Col>
                                            </Row>                                  
                                        }
                                        {o.fs.map((x,y)=>{
                                            return (
                                                <Row>
                                                <Col offset={2} span={2} className="ps-1">
                                                    <Text aria-label={o.key+'-t-tag'} b size="$sm">{x}</Text>
                                                </Col>
                                                <Col span={5}>
                                                    <Text aria-label={o.key+'-t-type'} b size="$sm">{o.dataset[x]['_name']}</Text>
                                                </Col>
                                                <Col span={3}>
                                                    <Text aria-label={o.key+'-t-fx'} size="$sm">{o.dataset[x]['_fx']}</Text>
                                                </Col>
                                                <Col span={1}>
                                                    <Text aria-label={o.key+'-t-unit'} size="$sm">{o.dataset[x]['_unit']}</Text>
                                                </Col>

                                                </Row>
                                            )
                                        })}
                                    </Container>
                                </Row>
                            )
                        })}
                    </Checkbox.Group>
                    </Col>
                </Row>

                <Row className="pt-5">
                    <Col justify="center">
                        <Button onPress={actionIssue} disabled={!updated} css={{width:'90%'}}>Issue</Button>
                    </Col>
                    <Col justify="center">
                        <Button onPress={actionReset} css={{width:'90%'}}>Reset</Button>
                    </Col>
                </Row>

            </Container>
            <Container id="tab-staffs" className="tabs mt-5" hidden={showTab('staffs')} fluid>

                <Container hidden={hideNewStaff} css={{background: 'white', borderRadius: '5px'}}>

                    <Row>
                        <Col className=''>
                            <Text h3>New Staff</Text>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Container>

                            <Row className="mt-3">
                                <Text b>{t('Staff Wallet ID')}</Text>
                            </Row>
                            <Row>
                                <Input name="wallet" required area-label="wallet" fullWidth css={{borderRadius: 32, height: 32}} value={staff.did} onChange={handleForm}></Input>
                            </Row>
                            </Container>
                        </Col>
                        <Col>
                            <Container>

                            <Row className="mt-3">
                                <Text b>{t('Organization ID')}</Text>
                            </Row>
                            <Row>
                                <Input name="org" required area-label="org" fullWidth readOnly css={{borderRadius: 32, height: 32}} value={staff.org} onChange={handleForm}></Input>
                            </Row>
                            </Container>
                        </Col>                       

                    </Row>
                    <Row>
                        <Col>
                            <Container>
                                <Row className="mt-3">
                                    <Text b>{t('Email')}</Text>
                                </Row>
                                <Row>
                                    <Input name="email" required area-label="email" type="email" fullWidth css={{borderRadius: 32, height: 32}} value={staff.email} onChange={handleForm}></Input>
                                </Row>
                            </Container>
                        </Col>
                        <Col>
                            <Container>
                                <Row className="mt-3">
                                    <Text b>{t('Password')}</Text>
                                </Row>
                                <Row>
                                    <Input name="secret" required area-label="secret" fullWidth css={{borderRadius: 32, height: 32}} value={staff.secret} onChange={handleForm}></Input>
                                </Row>                                
                            </Container>
                        </Col>
                    </Row>


                    <Row className="pt-5">
                        <Col justify="center">
                            <Button onPress={actionPostNewStaff} css={{width:'90%'}}>Save</Button>
                        </Col>
                        <Col justify="center">
                            <Button onPress={actionReset} css={{width:'90%'}}>Reset</Button>
                        </Col>
                    </Row>                    

                </Container>

                <Row className='mt-5'>
                    <Col span={4} className='mb-5'>
                        <Text h3>Staff List</Text>
                    </Col>
                    <Col offset={5} span={1} className="ps-5">
                        <Button fullWidth onPress={actionNewStaff}>New Staff</Button>
                    </Col>
                </Row>
                <Row>
                    <TableData title={''} name={tt.name} time={tt.time} hideLoading={hideLoading} />
                    <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
                </Row>

            </Container>
            <Container id="tab-perms" className="tabs" hidden={showTab('perms')} fluid>
                <Row>
                    <Col className='mb-5'>
                        <Text h3>Permission Received</Text>
                    </Col>
                </Row>

            </Container>

        </>
    )
}

