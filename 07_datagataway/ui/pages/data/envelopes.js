
import { useEffect, useState} from 'react'
import { TableData } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Row, Col, Link, Loading, Button, Navbar } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';

const tag = 'carbon';


export default function Page() {

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')

/*
    const render = (item, k, n) => {
      const val = item[k];
      switch (k) {
        case "key":
          return (
            <Row align="center">
              <Col css={{ d: "flex" }}>
                <a onClick={async function(){
                    setModalTitle('Envelope details')
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
                </a>
              </Col>
            </Row>
          );        
        default:
          return val;
      }
    };
*/



    const [ data, setData ] = useState({
      title: 'Data Envelope List',
      name: 'envelop',
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


    const [ hide, setHide ] = useState(false)

    /*
    useEffect(()=>{
      
      Next.Envelope.list()
      .then((r)=>{
        const w = new Woollet(data.title)
          w.data = r;
          w.cols = data.cols;
          w.path = w.data;
          w.extract_array((i)=>{
              if (i.status!=0) return null;
              if (!(i.project==tag)) return null;
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
    */

    useEffect(()=>{

    Next.Envelope.list()
    .then((r)=>{

      const table = new DataTable('#table-'+data.name, {
        pageLength: 50,
        destroy: true,
        data: r,
        columns: [
          {
            data: 'code',
            title: 'Envelope ID',
            sClass: 'small',
            createdCell : ( td, o, rowData, row, col ) => {
              var b = $( '<button class="btn btn-secondary btn-sm w-100">'+o+'</button>' ).on('click', () => {
                setModalTitle('Data')
                setModalData(<Loading />)
                setVisible(true)
                Next.Envelope.get({id: o})
                .then(r=>{
                  r.data['created'] = Time.now(r.data.created['$date']),
                  r.data['updated'] = Time.now(r.data.updated['$date']),
                  setModalData(JSON.stringify(r.data, null, 4))
                })
              } );
              $( td ).html( b );
            }
          },
          {
            data: 'name',
            title: 'Name',
            sClass: 'small',
            render: (o, t, row, meta ) => {
              return o;
            }
          },
          {
            data: 'desc',
            title: 'Description',
            sClass: 'small',
          },
          {
            data: 'created',
            title: 'Created',
            sClass: 'small',
            render: o => Time.now(o), 
          },
        ]
      })

      table.one('draw', () => {
        setHide(true)
      });

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

      <TableData title={data.title} name={data.name} time={data.time} hideLoading={hide} />

      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />

    </>
  )
}
