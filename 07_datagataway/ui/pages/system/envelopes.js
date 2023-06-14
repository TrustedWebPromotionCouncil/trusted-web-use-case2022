
import { useEffect, useState} from 'react'
import { TableGeneric } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Row, Col, Link, Loading, Button, Navbar } from "@nextui-org/react";
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
                <Link onPress={async function(){
                    setModalTitle('Envelop details')
                    setModalData(<Loading />)
                    setVisible(true)
                    console.log(k, item[k])
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
        default:
          return val;
      }
    };

    const [ data, setData ] = useState({
      title: 'Data Envelop List',
      cols: [
        {key: 'key', label: 'Envelop ID'},
        {key: 'name', label: 'Name'},
        {key: 'desc', label: 'desc'},
        {key: 'freq', label: 'Freq'},
        {key: 'created', label: 'Created'},
        {key: 'updated', label: 'Updated'},
      ],
      time: '',
      items: [],
    });

    useEffect(()=>{
      
      Next.Envelope.list()
      .then((r)=>{

        const w = new Woollet(data.title)
          w.data = r.data;
          w.cols = data.cols;
          w.path = w.data;

          w.extract_array((i)=>{
            console.log(i)
              if (i.status!=0) return null;
              if (!(i.owner=='carbon')) return null;
              return ([
                  i.code,
                  i.name,
                  i.desc,
                  i.freq,
                  Time.now(i.created['$date']),
                  Time.now(i.updated['$date']),
              ]);
          })

          setData( w.output() );


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
      <TableGeneric name={data.title} title={data.title} cols={data.cols} items={data.items} time={data.time} render={render} />
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
