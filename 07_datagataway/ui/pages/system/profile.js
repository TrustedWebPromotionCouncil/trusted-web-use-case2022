
import { TableKeyValue } from '@/components/tables'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { useState, useEffect } from 'react'
import { useModal, Row, Col, Tooltip, Loading } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';

export default function Page() {

  const [ modal_body, setModalBody ] = useState('No data')
  const [ modal_title, setModalTitle ] = useState('Schema')
  const { setVisible, bindings } = useModal();

  const [ data, setData ] = useState({
    title: 'Organization Profile',
    cols: [ ],
    time: '',
    items: [],
  });

  useEffect(()=>{
      
      Next.System.profile()
      .then((r)=>{
        const w = new Woollet(data.title)
          w.data = r;
          w.cols = data.cols;
          w.path = w.data.data
          w.exclude('ledger.genesis_transactions')
          w.extract_key_values()          
          setData( w.output() );
      });

  }, []);

    return (
      <>
      <TableKeyValue name={data.title} items={data.items} time={data.time} title={data.title} />
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
      </>
    )
}
/*
Page.getInitialProps = async (x) => {
    const w = new Woollet('Configuration Information')
    w.data = await Did.System.config();
    w.exclude('ledger.genesis_transactions')
    w.path = w.data.data
    w.extract_key_values()
    return { data: w.output() }
}
*/