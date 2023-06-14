
import { TableGeneric } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'

import { useState, useEffect } from 'react'
import { useModal, Text, Collapse, Row, Col, Tooltip, Loading } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';

export default function Page() {

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalBody ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Exchange Info')

    const [ expanded, setExpand ] = useState(false)

    const [ data, setData ] = useState({
        title: 'Exchange List',
        cols: [
            {key: 'key', label: 'Exchange ID'},
            {key: 'def', label: 'Credential Definition'},
            {key: 'state', label: 'State'},
            {key: 'comment', label: 'Comment'},
            {key: 'role', label: 'Role'},
            {key: 'created', label: 'Created'},
            {key: 'updated', label: 'Updated'},
        ],
        time: '',
        items: [],
      });
    
    
      useEffect(()=>{
          
          Next.Issuance.list()
          .then((r)=>{
            const w = new Woollet(data.title)
              w.data = r;
              w.cols = data.cols;
              w.path = w.data.data
              w.extract_array((i)=>{
                console.log(i)
                  return ([
                    i.credential_exchange_id,
                    i.credential_definition_id,
                    i.state,
                    i.credential_proposal_dict['comment'],
                    i.role,
                    Time.now(i.created_at),
                    Time.now(i.updated_at),
                  ]);
              })
              setData( w.output() );
              setExpand(true);
    
          });
    
      }, []);


    const render = (item, k, n) => {
        const val = item[k];
        switch (k) {
          case "key":
            return (
              <Row align="center">
                <Col css={{ d: "flex" }}>
                  <Tooltip
                    content={"click to show details"}
                    color="primary"
                    onClick={async function(){
                        setModalBody(<Loading />)
                        setModalTitle('Exchange Info')
                        setVisible(true)
                        Next.Issuance.get({id: item[k]})
                        .then((r)=>{
                            console.log(r)
                            setModalBody(JSON.stringify(r.data, null, 4))                      
                        })
                    }}
                  >
                    {val}
                  </Tooltip>
                </Col>
              </Row>
            );        
    
          default:
            return val;
        }
    };

    return (
        <>
        <Collapse.Group>
            <Collapse  title="Credential Issuance" expanded={expanded}>
                <TableGeneric name={data.title} cols={data.cols} items={data.items} time={data.time} render={render} />
            </Collapse>
            <Collapse title="Issue Credential">
                <Text>
                Issue credential form
                </Text>
            </Collapse>
        </Collapse.Group>
        <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
        </>
    )
}
/*
Page.getInitialProps = async (x) => {
    const w = new Woollet('List')
    w.data = await Did.Issuance.list()
    w.cols = [
        {key: 'key', label: 'Credential Definition'},
        {key: 'state', label: 'State'},
        {key: 'comment', label: 'Comment'},
        {key: 'label', label: 'Label'},
        {key: 'created', label: 'Created'},
        {key: 'updated', label: 'Updated'},
    ];
    w.path = w.data.data
    w.extract_array((i)=>{
        return ([
            i.credential_definition_id,
            i.state,
            i.credential_proposal_dict['comment'],
            i.label,
            i.created_at,
            i.updated_at,
        ]);
    })
    return { data: w.output() }
}
*/