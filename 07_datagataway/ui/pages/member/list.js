
import { useEffect, useState} from 'react'
import { TableGeneric } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Row, Col, Link, Loading } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';


export default function Page() {

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')

    const render = (item, k, n) => {
      const val = item[k];
      switch (k) {
        case "key":
          return (
            <Row align="center">
              <Col css={{ d: "flex" }}>
                <Link onClick={async function(){
                    setModalTitle('Verifying Woollet DID')
                    setModalData(<Loading />)
                    setVisible(true)
                    Next.Verify.woollet({did: item[k]})
                    .then(r=>{
                      setModalData(JSON.stringify(r.data, null, 4))
                    })
                  }}
                >
                  {val}
                </Link>
              </Col>
            </Row>
          );        
        case "connection":
          return (
            <Row align="center">
              <Col css={{ d: "flex" }}>
                <Link onClick={async function(){
                    setModalTitle('Connection Info')
                    setModalData(<Loading />)
                    setVisible(true)
                    Next.Conn.get({id: val})
                    .then(r=>{
                      setModalData(JSON.stringify(r.data, null, 4))
                    })
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

    const [ data, setData ] = useState({
      title: 'Member list',
      cols: [
        {key: 'key', label: 'DID'},
        {key: 'name', label: 'Name'},
        {key: 'role', label: 'Role'},
        {key: 'points', label: 'Points'},
        {key: 'created', label: 'Created'},
        {key: 'updated', label: 'Updated'},
        {key: 'connection', label: 'Connection'},
      ],
      time: '',
      items: [],
    });

    useEffect(()=>{
      
      Next.User.list()
      .then((r)=>{

        const w = new Woollet(data.title)
          w.data = r;
          w.cols = data.cols;
          w.path = w.data.data
          w.extract_array((i)=>{
              return ([
                  i.did,
                  i.name,
                  i.role,
                  i.points,
                  Time.now(i.created),
                  Time.now(i.updated),
                  i.con_id,
              ]);
          })

          setData( w.output() );


      });

    }, []);


  return (
    <>
      <TableGeneric name={data.title} title={data.title} cols={data.cols} items={data.items} time={data.time} render={render} />
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
/*
Page.getInitialProps = async (x) => {
  const w = new Woollet('Member List')
  w.data = await Did.User.list();
  w.cols = [
    {key: 'key', label: 'DID'},
    {key: 'name', label: 'Name'},
    {key: 'role', label: 'Role'},
    {key: 'points', label: 'Points'},
    {key: 'created', label: 'Created'},
    {key: 'updated', label: 'Updated'},
    {key: 'connection', label: 'Connection'},
  ];
  w.path = w.data.data
  w.extract_array((i)=>{
      return ([
          i.did,
          i.name,
          i.role,
          i.points,
          Time.now(i.created),
          Time.now(i.updated),
          i.con_id,
      ]);
  })
  return { data: w.output() }
}
*/