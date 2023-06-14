
import { useEffect, useState} from 'react'
import { TableData, DataTables } from '@/components/tables'
import { Woollet, Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Row, Col, Link, Loading } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';

import useTranslation from 'next-translate/useTranslation';


export default function Page() {

    const { t, lang } = useTranslation('common');

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')
    const [ hideLoading, setHideLoading ] = useState(false)
    const [ tt, setTable ] = useState({title: '', name: '', time: 0})

//    1810028456264

    useEffect(()=>{
      
      Next.Carbon.Supplychain.list()
      .then((r)=>{

        const tt = new DataTables('relationship')
        tt.title = 'Partner List'
        tt.time = r.time

        tt.col('did', 'Wallet ID', 'small', null, function(td, o, rd, r, c){
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
        tt.col('name', 'Name')
        tt.col('auth', 'Authorization', 'small', (o)=>{
          return o.join(',')
        });
        tt.col('title', 'Category')
        tt.col('created', 'Created', 'small', (o)=>{
          return Time.now(o)
        });
        tt.data(r.data)
        tt.render()
        tt.on('draw', ()=>{
          setHideLoading(true)
        })
        setTable(tt)

      });

    }, []);


  return (
    <>
      <TableData title={tt.title} name={tt.name} time={tt.time} hideLoading={hideLoading} />
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}
