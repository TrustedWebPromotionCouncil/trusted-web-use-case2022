
import { useEffect, useState} from 'react'
import { TableData, DataTables } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Loading, Navbar } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';


export default function Page() {

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')
    const [ hideLoading, setHideLoading ] = useState(false)
    const [t, setTable ] = useState({title: '', name: '', time: 0})

    useEffect(()=>{
      
      Next.Carbon.Supplychain.list()
      .then((r)=>{

        const t = new DataTables('relationship')
        t.title = 'Relationship management'
        t.time = r.time

        t.col('did', 'Wallet ID', 'small', null, function(td, o, rd, r, c){
          var b = $( '<button class="btn btn-secondary btn-sm w-100">'+o+'</button>' ).on('click', () => {
            setModalTitle('Data')
            setModalData(<Loading />)
            setVisible(true)
            Next.Carbon.Supplychain.get({did: o})
            .then(r=>{
              setModalData(JSON.stringify(r.data, null, 4))
            })
            
          } );
          $( td ).html( b );
        })
        t.col('name', 'Name')
        t.col('auth', 'Authorization', 'small', (o)=>{
          return o.join(',')
        });
        t.col('title', 'Catgory')
        t.col('created', 'Created', 'small', (o)=>{
          return Time.now(o)
        });
        t.data(r.data)
        t.render()
        t.on('draw', ()=>{
          setHideLoading(true)
        })
        setTable(t)

      });

    }, []);


  return (
    <>
      <Navbar variant="" className="mb-5">
          <Navbar.Content variant="highlight-rounded" gap={5}>
              <Navbar.Link isActive href="relation">Data Types</Navbar.Link>
              <Navbar.Link isActive href="staffs">Staffs</Navbar.Link>
              <Navbar.Link isActive href="perms">Our Permissions</Navbar.Link>
          </Navbar.Content>
      </Navbar>

      <TableData title={t.title} name={t.name} time={t.time} hideLoading={hideLoading} />
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
