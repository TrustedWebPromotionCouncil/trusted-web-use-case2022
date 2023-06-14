
import { TableGeneric } from '@/components/tables'
import { CheckField, SelectOpr } from '@/components/verify'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { Container, Row, Col, Text, Loading, Input, Button, Dropdown, Checkbox, Navbar } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import useTranslation from 'next-translate/useTranslation';
import React from 'react'


export default function Page() {
    
    const { t, lang } = useTranslation('common');

    const [ files, setFiles ] = useState()

    const [ frequency, setFrequency ] = useState([
        {key: 'hourly', name: 'Hourly'},
        {key: 'hour4', name: 'Every 4 hours'},
        {key: 'hour6', name: 'Every 6 hours'},
        {key: 'hour12', name: 'Every 12 hours'},
        {key: 'daily', name: 'Daily'},
        {key: 'weekly', name: 'Weekly'},
        {key: 'monthly', name: 'Monthly'},
    ])

    const [ fields, setFields ] = useState({})
    const [ loading, setLoading ] = useState(false)
    const [ jstr, setJstr ] = useState('')
    const [ fs, setFs ] = useState([])
    const [ fa, setFa ] = useState([])    
    const [ fn, setFn ] = useState('')
    const [ cn, setCn ] = useState('')
    const [ cd, setCd ] = useState('')
    const [ ff, setFf ] = useState('')
    const [ fd, setFd ] = useState('')
    const [ ver, setVer ] = useState('1.0.1')
    const [ json, setJson ] = useState({})
    const [ disCreate, setCreate ] = useState(true)
    const [ objs, setObjs ] = useState({})

    useEffect(()=>{
      
        Next.DataList.get({code:'carbon-data-source-files'}).then(r=>{
            // creating first draft on new system.
            if (Object.keys(r.data).length==0) {
                Next.DataList.set({
                    code: '',
                    name: 'carbon-data-source-files',
                    desc: 'Carbon Tracing Data Sources',
                    list: '',
                    data: {power: 'id'},
                }).then(rs=>{ console.log(rs) })
                window.location = window.location.href;
            }
            setObjs(r.data.data)
            renderTable(r.data.data)
      });

    }, []);

    const renderTable = (o) => {
        setFields({})
        const a = [];
        for ( const i of Object.keys(o)) {
            a.push({key: i, name: i, fields: o[i].split(',') })
        }
        setFiles(a)

        for (const i of a) {
            fields[i.key] = i.fields
        }
        setFields(fields)
    }

    const actionReset = e => {
        setCn('')
        setCd('')
        setJson({})
        setFf('')
        setFa([])
        setFs([])
        setFn('')
        setJstr('')
        setVer('1.0.1')
        setLoading(false)
    }

    const actionCreate = e => {

        if (!cn || !ff) {
            return alert('Please fill in Credential Name and choose a Frequency')
        }

        setLoading(true)

        const form = {
            code: '',
            name: 'carbon-data-'+cn+'-'+ver+'-'+ff,
            ver: ver,
            type: 'data-1',
            logo: 'https://a.woollet.io/images/woollet-logo.png',
            bg: '#FFFFFF',
            desc: cd,
            dataset: json,
            freq: ff,
        }

        Next.Envelope.set(form).then(r=>{
            actionReset(null)
        })

    }

    const actionFiles = e => {
        setFn(e)
        const a = []
        console.log(fields)
        for (const i of fields[e]) {
            a.push({ key: i, name: i })
        }
        setFs(a)
        setFa([])
    }

    const actionFreq = e => setFf(e);
    const actionVer = e => setVer(e.target.value);
    const actionName = e => setCn(e.target.value);
    const actionDesc = e => setCd(e.target.value);

    const actionFields = e => {
        setFa(e)
        const j = json;
        j[fn] = e
        setJson(j)
        if (json!={}) setCreate(false)
        setJstr(JSON.stringify(j, null, 4))
    }

    
    return (
        <>
            <Navbar variant="" className="mb-5">
                <Navbar.Content variant="highlight-rounded" gap={5}>
                    <Navbar.Link isActive href="envelopes">List</Navbar.Link>
                    <Navbar.Link isActive href="envelope">Envelope</Navbar.Link>
                    <Navbar.Link isActive href="sources">Sources</Navbar.Link>
                </Navbar.Content>
            </Navbar>      

            <Container fluid>
                <Row>
                    <Col className='mb-5'>
                        <Text h3>Data Envelop Management</Text>
                    </Col>
                </Row>
                <Row>
                    <Col className="pe-5">
                            <Row>
                                <Text h5>Source Files</Text>
                            </Row>
                            <Row>
                                <Dropdown>
                                    <Dropdown.Button css={{width:'100%'}} flat>Select a source file</Dropdown.Button>
                                    <Dropdown.Menu aria-label="Select category" items={files} onAction={actionFiles}>
                                    {(item) => (
                                        <Dropdown.Item aria-label={item.key} key={item.key}>
                                            {item.name}
                                        </Dropdown.Item>
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row>
                                <Input id="file" label="file" css={{width:'100%'}} readOnly placeholder="select a file above" value={fn}></Input>
                            </Row>
                    </Col>
                    <Col className="pe-5">
                            <Row>
                                <Text h5>Fields</Text>
                            </Row>
                            <Row>
                                <Checkbox.Group aria-label="field-group" defaultValue={[]} value={fa} onChange={actionFields}>
                                    {fs.map((o, i)=>{
                                       return(
                                        <Checkbox key={o.key} aria-label={o.key} size="xs" value={o.key}>{o.name}</Checkbox>
                                       )
                                    })}
                                </Checkbox.Group>
                            </Row>
                    
                    </Col>
                    <Col>
                        <Row className='mb-5'>
                            <Input css={{width:'100%'}} label="Credential" placeholder="Data credential name" onChange={actionName} value={cn} />
                        </Row>
                        <Row className='mb-5'>
                            <Input css={{width:'100%'}} label="Description" placeholder="Language specific description" onChange={actionDesc} value={cd} />
                        </Row>                        
                        <Row className='mb-5'>
                            <Input css={{width:'100%'}} label="Version" onChange={actionVer} value={ver} />
                        </Row>
                        <Row>
                            <Text h5>Package Frquency</Text>
                        </Row>
                        <Row>
                            <Dropdown>
                                <Dropdown.Button css={{width:'100%'}} flat>Select package frequency</Dropdown.Button>
                                <Dropdown.Menu aria-label="Select frequency" items={frequency} onAction={actionFreq}>
                                {(item) => (
                                    <Dropdown.Item aria-label={item.key} key={item.key}>
                                        {item.name}
                                    </Dropdown.Item>
                                )}
                                </Dropdown.Menu>
                            </Dropdown>                            
                        </Row>
                        <Row className='mb-5'>
                                <Input css={{width:'100%'}} label="frequency" readOnly placeholder="select a frequency above" value={ff}></Input>
                        </Row>
                        <Row>
                            <Text aria-label="t1" h5>Dataset</Text>
                        </Row>
                        <Row>
                            <pre style={{fontSize: '90%'}}>
                                {jstr}
                            </pre>
                        </Row>                    
                    </Col>
                </Row>
                <Row className="pt-5" justify='center' hidden={!loading}>
                    <Text>Processing credential schema</Text>
                    <Loading />
                </Row>

                <Row className="pt-5" hidden={loading}>
                    <Col justify="center">
                        <Button aria-label="Create" onPress={actionCreate} disabled={disCreate} css={{width:'90%'}}>Create</Button>
                    </Col>
                    <Col justify="center">
                        <Button aria-label="Reset" onPress={actionReset} css={{width:'90%'}}>Reset</Button>
                    </Col>
                </Row>

                <Row>

                </Row>
            </Container>
        </>
    )
}

