
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
      title: 'Credential Wallet',
      cols: [
        {key: 'key', label: 'ID'},
        {key: 'name', label: 'Document'},
        {key: 'role', label: 'Role'},
        {key: 'points', label: 'Points'},
        {key: 'created', label: 'Created'},
        {key: 'updated', label: 'Updated'},
        {key: 'connection', label: 'Connection'},
      ],
      time: '2023',
      items: [],
      loading: true,
    });


    useEffect(()=>{

      Next.Data.schema().then(t=>{

        const project = 'carbon'

        const name_data = [];
        const desc_data = [];

        t.Data.map(o => {
          name_data.push(project+'-'+o.name)
          desc_data.push(o.desc)
        })

        Next.Data.list()
        .then((r)=>{
  
          const list_data = [];

          for (const c of r) {
              for (const x of name_data) {
                console.log(c, c.cred_def_id)
                if (c.cred_def_id.match(x)) list_data.push(c)
              }
            }
    
          const w = new Woollet(data.title)
            w.data = list_data;
            w.cols = data.cols;
            w.path = w.data;
            w.extract_array((i)=>{
                return ([
                    i.referent,
                    i.attrs['doc:name'],
                    i.attrs['doc:type'],
                    i.attrs['name'],
                    Time.now(i.attrs['date:issued']),
                    Time.now(i.attrs['data:expired']),
                    i.attrs['name'],
                ]);
            })
            setData( w.output() );
        });
      })
      
    }, []);


  return (
    <>
      <TableGeneric name={data.title} title={data.title} cols={data.cols} items={data.items} time={data.time} render={render}  loading={data.loading}/>
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
