
import { TableGeneric } from '@/components/tables'
import { CheckField, SelectOpr } from '@/components/verify'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { Container, Row, Col, Text, Link, Image, Input, Button, Select, Dropdown, Table, Card, Textarea, Checkbox, Spacer } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import React from 'react'


export default function Page() {
    
    const [ files, setFiles ] = useState([
        { key: 'combustion-stationary', name: 'Stationary Combustion', fields: [ ] }, 
        { key: 'combustion-mobile', name: 'Mobile Combustion', fields: [ ] },
        { key: 'hfc-pfc', name: 'HFC and PFC Emissions', fields: [ ] },
        { key: 'power-electricity-purchase', name: 'Electricity Purchase', fields: [ ] },
        { key: 'indirect-ghg', name: 'Energy Indirect GHG Emissions ', fields: [ ] },
        { key: 'paper-waste-disposed',   name: 'Paper Waste Disposed at Landfills', fields: [ ] },
    ])

    const [ fields, setFields ] = useState({})
    for (const i of files) fields[i.key] = i.fields
    
    const [ fs, setFs ] = useState([])
    const [ fn, setFn ] = useState('')
    const [ fd, setFd ] = useState('')
    const [ json, setJson ] = useState({})
    const [ disCreate, setCreate ] = useState(true)

    const actionReset = e => {}
    const actionCreate = e => {}

    const actionFiles = e => {
        setFn(e)
        const a = []
        for (const i of fields[e]) {
            a.push({ key: i, name: i })
        }
        setFs(a)
    }

    const actionFields = e => {
        const j = json;
        j[fn] = e
        setJson(j)
        if (json!={}) setCreate(false)
    }

    return (
        <>
            <Container fluid>
                <Row>
                    <Col className='mb-5'>
                        <Text h3>Data types management</Text>
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
                                    <Dropdown.Menu  css={{ $$dropdownMenuWidth: "800px" }} aria-label="Select category" items={files} onAction={actionFiles}>
                                    {(item) => (
                                        <Dropdown.Item aria-label={item.key} key={item.key}>
                                            {item.name}
                                        </Dropdown.Item>
                                    )}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Row>
                            <Row>
                                <Input id="file" css={{width:'100%'}} readOnly placeholder="select a file above" value={fn}></Input>
                            </Row>
                    </Col>
                    <Col className="pe-5">
                            <Row>
                                <Text h5>Fields</Text>
                            </Row>
                            <Row>
                                <Checkbox.Group defaultValue={[]} onChange={actionFields}>
                                    {fs.map((o, i)=>{
                                       return(
                                        <Checkbox aria-label={o.key} size="xs" value={o.key}>{o.name}</Checkbox>
                                       )
                                    })}
                                </Checkbox.Group>
                            </Row>
                    
                    </Col>
                    <Col>
                        <Row>
                            <Text h5>Data Credential</Text>
                        </Row>
                        <Row>
                            <Input css={{width:'100%'}} placeholder="Data credential name" />
                        </Row>
                        <Row>
                            <pre style={{fontSize: '90%'}}>
                                {JSON.stringify(json, null, 4)}
                            </pre>
                        </Row>                    
                    </Col>
                </Row>
                <Row className="pt-5">
                    <Col justify="center">
                        <Button onPress={actionCreate} disabled={disCreate} css={{width:'90%'}}>Create</Button>
                    </Col>
                    <Col justify="center">
                        <Button onPress={actionReset} css={{width:'90%'}}>Reset</Button>
                    </Col>
                </Row>

                <Row>

                </Row>
            </Container>
        </>
    )
}

