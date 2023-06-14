
import { useEffect, useState} from 'react'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Row, Col, Link, Loading, Button, Input, Navbar, Table } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
import { set } from 'nprogress';

export default function Page() {

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')
    const [ files, setFiles ] = useState([])
    const [ objs, setObjs ] = useState({})
    const [ newfile, setNewFile ] = useState('')
    
    const render = (item, k, n) => {
      const val = item[k];
      switch (k) {
        case "keys":
          return (
            <Row align="center">
              <Col css={{ d: "flex" }}>
                <Link onPress={async function(){
                    setModalTitle('Envelope details')
                    setModalData(<Loading />)
                    setVisible(true)
                    Next.Envelope.get({id: item[k]})
                    .then(r=>{
                      r.data['created'] = Time.now(r.data.created['$date']),
                      r.data['updated'] = Time.now(r.data.updated['$date']),
                      setModalData(JSON.stringify(r.data, null, 4))
                    })
                  }}
                >
                  {val}
                </Link>
              </Col>
            </Row>
          );
          break;
        case "actions":
            return (
                <Row>
                    <Button
                        className="me-2"
                        aria-label={'btn-0-'+item.key}
                        auto
                        color='success'
                        icon={<FontAwesomeIcon icon={ faCheck } />}
                        onClick={e=>{
                            Next.DataList.set({
                                name: 'carbon-data-source-files',
                                list: '',
                                data: objs,
                            }).then(rs=>{ console.log('SAVED', rs) })
                        }}
                        />
                    <Button
                        aria-label={'btn-1-'+item.key}
                        auto
                        color='dark'
                        icon={<FontAwesomeIcon icon={ faTrash } />}
                        onClick={e=>{
                            delete objs[item.key]
                            renderTable(objs)
                            Next.DataList.set({
                                name: 'carbon-data-source-files',
                                list: '',
                                data: objs,
                            }).then(rs=>{ console.log('SAVED', rs) })
                        }}
                        />
                </Row>
            )
        default:
          return val;
      }
    };

    const handleObjs = e => {
        objs[e.target.ariaLabel] = e.target.value;
    }

    const handleNewInput = e => {
        setNewFile(e.target.value)
    }

    const handleNew = e => {
        objs[newfile] = 'id'
        setObjs({...objs, [newfile]: 'id'})
        renderTable(objs)
    }

    const renderTable = (o) => {
        const a = [];
        for ( const i of Object.keys(o)) {
            a.push({key: i, name: i, fields: objs[i] })
        }
        setFiles(a)
    }

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

  return (
    
<>
        <Navbar variant="" className="mb-5">
            <Navbar.Content variant="highlight-rounded" gap={5}>
                <Navbar.Link isActive href="envelopes">List</Navbar.Link>
                <Navbar.Link isActive href="envelope">Envelope</Navbar.Link>
                <Navbar.Link isActive href="sources">Sources</Navbar.Link>
            </Navbar.Content>
        </Navbar>     

        <Table
            striped
            aria-label='source editor'
            css={{
                maxWidth: "100%",
                minWidth: "70%",
                fontSize: '90%',
                }}>
            <Table.Header columns={3}>
                <Table.Column width={200} key='key'>File</Table.Column>
                <Table.Column key='fields'>Fields</Table.Column>
                <Table.Column width={80} key='actions'></Table.Column>
            </Table.Header>
            <Table.Body items={files}>
                {f => (
                    <Table.Row aria-label={'a-'+f.key} key={f.key}>
                        <Table.Cell key={'cell-'+Math.random()}>{render(f, 'key', f.key)}</Table.Cell>
                        <Table.Cell key={'f-'+f.key}><Input aria-label={f.key} fullWidth
                                                    onChange={handleObjs}
                                                    value={objs[f.key]} /></Table.Cell>
                        <Table.Cell>{render(f, 'actions', f.key)}</Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
            {{files}.length > 20 &&
                <Table.Pagination
                    shadow
                    noMargin
                    align="center"
                    rowsPerPage={20}
                    onPageChange={page => console.log({ page })}
                />
            }
        </Table>

        <Row className="mt-5 mb-5">
            <Col width={300} className="pe-3">
                <Input aria-label="Add new field" placeholder="new file name" fullWidth onChange={handleNewInput} value={newfile}/>
            </Col>
            <Col>
                <Button auto onClick={handleNew}>+</Button>
            </Col>

        </Row>

        <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
