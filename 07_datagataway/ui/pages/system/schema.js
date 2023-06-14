
import { TableGeneric } from '@/components/tables'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did';
import { Card, Button, Text, Dropdown, Checkbox, Input, Row, Col, Link, Collapse, useModal, Textarea } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCertificate } from "@fortawesome/free-solid-svg-icons";

import { Loading } from "@nextui-org/react";
import { useState, useEffect, useMemo } from 'react'
import { ModalOk } from '@/components/modal';
import { CheckField } from '@/components/verify';
import { NextFetchEvent } from 'next/server';


export default function Page({ data }) {

  const defaultForm = {
    attrs: [],
    type: 'id',
    name: '',
    ver: '1.0.1',
    tag: '',
    logo: 'https://a.woollet.io/images/woollet-logo.png',
    desc: '',
    bg: '#FFFFFF',
    schema_only: false,
  };

  const [ isLoading, setLoading ] = useState(false)
  const [ modal_body, setData ] = useState('No data')
  const [ modal_title, setTitle ] = useState('Schema')
  const { setVisible, bindings } = useModal();
  const [ expanded, expands ] = useState(false);

  const [ a_schema, setASchema] = useState([])
  const [ a_defs, setADefs] = useState([])

  const [ disable_create, setCreate ] = useState(false)
  const [ form, setForm ] = useState(defaultForm)
  const [ attrs, setAttrStr ] = useState('')

  const Types = [
    { key: 'id', value: 'Identity' },
    { key: 'auth', value: 'Authorization' },
    { key: 'attr', value: 'Common Attribute' },
    { key: 'alpha', value: 'Alpha Credential' },
    { key: 'data-0', value: 'Data Envelop - self attested' },
    { key: 'data-1', value: 'Data Envelop' },
    { key: 'data-2', value: 'Data Container' },
  ]

  const [ type_key, setTypeKey ] = useState('id');
  const [ type_label, setTypeLabel ] = useState('Identity')

  const setSelected = e => {
    const r = Types.find(({key}) => key === e)
    setTypeLabel(r.value)
    setTypeKey(r.key)
    setForm({...form, ['type']: r.key})
  }

  const setAttrs = e => {
    setAttrStr(e.target.value.trim())
//    const a = e.target.value.trim().split("\n")
//    setForm({...form, ['attrs']: a})
//    console.log(form.attrs)
//    console.log(attrs)
  }

  const tag = 'carbon-';

  const cold = [
    {key: 'key', label: 'Credential Definition ID'},
    {key: 'drop', label: 'Drop'},
    {key: 'default', label: 'Set Default'},
    {key: 'clone-def', label: 'Clone'},
  ];

  const cols = [
    {key: 'key', label: 'Schema ID'},
    {key: 'drop', label: 'Drop'},
    {key: 'clone-schema', label: 'Clone'},
  ];

  useEffect(()=>{

    /*
    Next.Schema.list().then(r=>{
      const a = [];
      for (const i of r.data) {
        if (!i.match(/(Membership|carbon\-)/)) continue;
        a.push({key:i, drop:i.replace(':', '_'), 'clone-schema':i})
      }
      setASchema(a)
    })
  */

    Next.Def.list().then(r=>{
      const a = [];
      for (const i of r.data) {
        a.push({key: i, drop: i.replace(':', '_'), default: i, 'clone-def':i})
      }
      setADefs(a)
    })

  }, [])

  const render0 = (item, k, n) => {
    const val = item[k];
    switch (k) {
      case "key":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Link onPress={async function(){
                  setData(<Loading />)
                  setVisible(true)
//                      let u = '/api/def/get'
                  console.log(n)
                  const o = {def_id: item[k]}
                    setTitle('Credential Schema')
                    Next.Def.get(o).then(r=>{
                      setData(JSON.stringify(r.data, null, 4))

                      const d = r.data.credential_definition;
                      const c = Object.keys(d.value.primary.r);
                      
                      setForm({ ...form, ['tag']: d.tag, ['attrs']: c.join('\n') });

                    })
                }
              }
              >
                {val}
              </Link>
            </Col>
          </Row>
        );        
      case "drop":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Link onClick={() => console.log("Delete item", item.key)}>
              <FontAwesomeIcon icon={faTrash} />
              </Link>
            </Col>
          </Row>
        );
      case "clone-def":
        return (
          <Row justify="center" align="center">
            <Col css={{ d: "flex" }}>
              <Link onPress={async e =>{
              const r = await Next.Def.get({id: val})
              console.log(r);
            }}>
              <FontAwesomeIcon icon={faTrash} />
              </Link>
            </Col>
          </Row>
        );
      case "default":
          return (
            <Link onPress={() => console.log("Set ", item.key, " as default")}>
              <FontAwesomeIcon icon={faCertificate} />
            </Link>
          );
      default:
        return val;
    }
};

  const render1 = (item, k, n) => {
      const val = item[k];
      switch (k) {
        case "key":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex" }}>
                <Link onPress={async function(){
                    setData(<Loading />)
                    setVisible(true)
                    console.log(n)
                    const o = {id: item[k]}
                    setTitle('Schema')
                    Next.Schema.get(o).then(r=>{
                      setData(JSON.stringify(r.data, null, 4))

                      let fs = [];
                      console.log(r)
                      r.data.schema.attrNames.map((i)=>{
                        if (['master_secret'].includes(i)) return;
                        if (i.match('^(org\:|doc\:|date\:)')) return;
                        fs.push(i)
                      })
                      setForm({ ...form, ['tag']: r.data.schema.name, ['version']:  r.data.schema.version, ['attrs']: fs.join('\n') });
                    })
                  }
                }
                >
                  {val}
                </Link>
              </Col>
            </Row>
          );        
        case "drop":
          return (
            <Row justify="center" align="center">
              <Col css={{ d: "flex" }}>
                <Link onClick={() => console.log("Delete item", item.key)}>
                <FontAwesomeIcon icon={faTrash} />
                </Link>
              </Col>
            </Row>
          );
          case "clone-schema":
            return (
              <Row justify="center" align="center">
                <Col css={{ d: "flex" }}>
                  <Link onPress={async e =>{
                    const r = await Next.Schema.get({id: val})
                    console.log(r);
                  }}>
                  <FontAwesomeIcon icon={faTrash} />
                  </Link>
                </Col>
              </Row>
            );
        case "default":
            return (
              <Link onPress={() => console.log("Set ", item.key, " as default")}>
                <FontAwesomeIcon icon={faCertificate} />
              </Link>
            );
        default:
          return val;
      }
  };


  const actionCreate = e => {
    const a = [];
    for (let i of attrs.split("\n")) {
      if (i.trim()) {
        a.push(i.trim())
      }
    }
    setForm({...form, ['attrs']: a})
    form.attrs = a;
    console.log('PUBLISHING', form)
    Next.Schema.publish(form).then(r=>{
      console.log(r)
    })
  }

  const actionReset = e => {
    console.log('Resetting form', e)
    setForm(defaultForm)
  }

  setTimeout(()=>{ expands(true) }, 100)


  return (
    <>
    <Collapse.Group>
        <Collapse title="Credential Definition" expanded={expanded} className="p-2">
            <TableGeneric name={'the definition of a document, based on a "schema", and is specific to an issuer.'} cols={cold} items={a_defs} render={render0} />
        </Collapse>
        <Collapse title="Schema" className="p-2">
            <TableGeneric name={'the base layer of a document definition, can be shared among the whole network.'} cols={cols} items={a_schema} render={render1} />
        </Collapse>
        <Collapse title="New Document (Credential Definition)" className="p-2">
          <form>
          <Row>
            <Col span="7">
              <Row>

                <Text>Type</Text>
                </Row>
              <Row className='mb-2'>

              <Dropdown>
                  <Dropdown.Button flat className='w-100'>{type_label}</Dropdown.Button>
                  <Dropdown.Menu
                    aria-label="Credential Type"
                    color="secondary"
                    disallowEmptySelection
                    selectionMode="single"
                    onAction={(setSelected)}
                  >
                    {Types.map(t => (
                      <Dropdown.Item key={t.key}>{t.value}</Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                </Row>
              <Row>

                <Input label="Name" onChange={e=>{ setForm({...form, ['name']:e.target.value})}} fullWidth value={form.name} placeholder="document name" />

              </Row>
              <Row>
              </Row>
              <Row justify="flex-end">
                  <Checkbox size="xs" selected={form.schema_only}>Create schema ONLY</Checkbox>
              </Row>
              <Row>
                  <Input label="Description" fullWidth onChange={e=>{ setForm({...form, ['desc']:e.target.value})}} value={form.desc} placeholder="description" />
              </Row>
              <Row>
                  <Input label="Logo" onChange={e=>{ setForm({...form, ['logo']:e.target.value})}} fullWidth value={form.logo} />
              </Row>
              <Row>
                  <Input label="Background" onChange={e=>{ setForm({...form, ['bg']:e.target.value})}} fullWidth value={form.bg} />
              </Row>
              <Row>
                <Col>
                  <Input label="Version" onChange={e=>{ setForm({...form, ['ver']:e.target.value})}} fullWidth value={form.ver} />
                </Col>
              </Row>
              <Row>
                <Col>
                  <Input label="Tag" onChange={e=>{ setForm({...form, ['tag']:e.target.value})}} fullWidth value={form.tag} />
                </Col>
              </Row>

            </Col>
            <Col span="1">
            </Col>
            <Col span="5">
              <Row>
                <Textarea label="Fields" minRows={20} onChange={setAttrs} value={ attrs } placeholder="enter field names here, each on a new line."></Textarea>
              </Row>
            </Col>
          </Row>
          <Row className="mt-5">
            <Col span="6" justify="center">
              <Button size="md" disabled={disable_create} onPress={actionCreate} color="neutral" css={{color: 'white', backgroundColor: '#26292B'}}>Create</Button>
            </Col>
            <Col span="6" justify="center">
              <Button size="md" onPress={actionReset} color="gray" css={{color: 'black', backgroundColor: 'dark'}}>Reset</Button>
            </Col>
          </Row>
          </form>
        </Collapse>
    </Collapse.Group>
    <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )

}

/*
Page.getInitialProps = async (x) => {
  const w0 = new Woollet('Definitions')
  w0.data = await Did.Schema.Defs.list()
  w0.cols = [
    {key: 'key', label: 'Credential Definition ID'},
    {key: 'drop', label: 'Drop'},
    {key: 'default', label: 'Set Default'},
    {key: 'clone-def', label: 'Clone'},
  ];
  w0.path = w0.data.data
  w0.extract_array((i)=>{
      return ([
        i,
        i.replace(':', '_'),
        i,
        i,
      ]);        
  })

  const w1 = new Woollet('Schemas')
  w1.data = await Did.Schema.list()
  w1.cols = [
    {key: 'key', label: 'Schema ID'},
    {key: 'drop', label: 'Drop'},
    {key: 'clone-schema', label: 'Clone'},
  ];
  w1.path = w1.data.data
  w1.extract_array((i)=>{
      return ([
        i,
        i.replace(':', '_'),
        i,
      ]);        
  })

  console.log('DEFS')
  console.log(w0.output())

  return { data: {defs: w0.output(), schema: w1.output()} }
//  return { oo: { defs: await WoolletPost('schema/def/list'), schema: await WoolletPost('schema/list') } }
}
*/