
import { TableGeneric } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Did, Next } from '@/data/did'

import { useState, useEffect } from 'react'
import { useModal, Row, Col, Link, Loading } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';


export default function Page() {

  const [ modal_body, setModalBody ] = useState('No data')
  const [ modal_title, setModalTitle ] = useState('Schema')
  const { setVisible, bindings } = useModal();

  const [ data, setData ] = useState({
    title: 'Valid Connection List',
    cols: [
      {key: 'key', label: 'ID'},
      {key: 'state', label: 'State'},
      {key: 'rfc23', label: 'Rfc23'},
      {key: 'role', label: 'Role'},
      {key: 'label', label: 'Label'},
      {key: 'created', label: 'Created'},
      {key: 'updated', label: 'Updated'},
    ],
    time: '',
    items: [],
  });


  useEffect(()=>{
      
      Next.Conn.list()
      .then((r)=>{

        const w = new Woollet(data.title)
          w.data = r;
          w.cols = data.cols;
          w.path = w.data.data
          w.extract_array((i)=>{
              if (i.state!='active') return null;
              return ([
                  i.connection_id,
                  i.state,
                  i.rfc23_state,
                  i.their_role,
                  i.their_label,
                  Time.now(i.created_at),
                  Time.now(i.updated_at),
              ]);
          })

          setData( w.output() );

      });

  }, []);

  const render = (item, k, n) => {
    const val = item[k];
    switch (k) {
      case "key":
        return (
          <Row align="center">
            <Col css={{ d: "flex" }}>
              <Link onClick={async function(){
                  setModalTitle('Connection Info')
                  setModalBody(<Loading />)
                    setVisible(true)
                    Next.Conn.get({id: val})
                    .then(r=>{
                      setModalBody(JSON.stringify(r.data, null, 4))
                    });
                }}
              >
                {val}
              </Link>
            </Col>
          </Row>
        );        

      default:
        return val;
    }
  };


  return (
    <>
      <TableGeneric name={data.title} cols={data.cols} items={data.items} time={data.time} title={data.title} render={render} />
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
