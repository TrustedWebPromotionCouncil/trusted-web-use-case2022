
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

    const [ partner, setPartner ] = useState({
      title: 'Partner Organizations',
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

    const [ member, setMemmber ] = useState({
      title: 'Members',
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


        console.log(t)

        const project = 'carbon'

        const name_member = [];
        const desc_member = [];

        const name_partner = [];
        const desc_partner = [];

        const name_data = [];
        const desc_data = [];

        name_partner.push(project+'-'+t.Org.name)
        desc_partner.push(t.Org.desc)

        name_partner.push(project+'-'+t.DataAuth.name)
        desc_partner.push(t.DataAuth.desc)


        t.Data.map(o => {
          name_data.push(project+'-'+o.name)
          desc_data.push(o.desc)
        })

        name_member.push(project+'-'+t.Staff.name)
        desc_member.push(t.Staff.desc)

        t.Membership.map(o => {
          name_member.push(o)
          desc_member.push(o)
        })

        Next.Data.list()
        .then((r)=>{
  
          const list_data = [];
          const list_partner = [];
          const list_member = [];

          for (const c of r) {
              for (const x of name_data) {
                if (c.cred_def_id.match(x)) list_data.push(c)
              }
              for (const x of name_partner) {
                if (c.cred_def_id.match(x)) list_partner.push(c)
              }
              for (const x of name_member) {
                if (c.cred_def_id.match(x)) list_member.push(c)
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

            const w1 = new Woollet(partner.title)
            w1.data = list_partner;
            w1.cols = partner.cols;
            w1.path = w1.data;
  
            w1.extract_array((i)=>{
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
            setPartner( w1.output() );

            const w2 = new Woollet(member.title)
            w2.data = list_member;
            w2.cols = member.cols;
            w2.path = w2.data;
  
            w2.extract_array((i)=>{
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
            setMemmber( w2.output() );

        });


      })
      
    }, []);


  return (
    <>
      <TableGeneric name={member.title} title={member.title} cols={member.cols} items={member.items} time={member.time} render={render} loading={member.loading} />
      <TableGeneric name={partner.title} title={partner.title} cols={partner.cols} items={partner.items} time={partner.time} render={render}  loading={partner.loading}/>
      <TableGeneric name={data.title} title={data.title} cols={data.cols} items={data.items} time={data.time} render={render}  loading={data.loading}/>
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
