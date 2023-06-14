import { useEffect, useState} from 'react'
import { TableData, DataTables } from '@/components/tables'
import { Time } from '@/data/woollet'
import { Next } from '@/data/did'
import { useModal, Row, Col, Loading } from "@nextui-org/react";
import { ModalOk } from '@/components/modal';
import useTranslation from 'next-translate/useTranslation';


export default function Page() {

    const { setVisible, bindings } = useModal();
    const [ modal_body, setModalData ] = useState('No data')
    const [ modal_title, setModalTitle ] = useState('Connection Info')

    const [ hide, setHide ] = useState(false)

    const [ issues, setIssues ] = useState({
      title: 'Transactions - Issuance',
      name: 'issuance',
      cols: [
        {key: 'key', label: 'Issuance ID'},
        {key: 'state', label: 'State'},
        {key: 'updated', label: 'Updated'},
        {key: 'name', label: 'Definition'},
        {key: 'desc', label: 'Connection'},
        {key: 'created', label: 'Created'},
      ],
      time: '',
      items: [],
    });

    const [ issues2, setIssues2 ] = useState({
      title: 'Transactions - Issuance V2',
      name: 'issuancev2',
      cols: [
        {key: 'key', label: 'Issuance ID'},
        {key: 'state', label: 'State'},
        {key: 'updated', label: 'Updated'},
        {key: 'name', label: 'Definition'},
        {key: 'desc', label: 'Connection'},
        {key: 'created', label: 'Created'},
      ],
      time: '',
      items: [],
    });

    const [ verifier, setVerifier ] = useState({
        title: 'Transactions - Verifier',
        name: 'verify',
        cols: [
          {key: 'key', label: 'Verifier ID'},
          {key: 'state', label: 'State'},
          {key: 'verified', label: 'Verified'},
          {key: 'updated', label: 'Updated'},
          {key: 'name', label: 'Definition'},
          {key: 'desc', label: 'Connection'},
          {key: 'created', label: 'Created'},
        ],
        time: '',
        items: [],
      });

    useEffect(()=>{
      

      const v1 = []
      const v2 = []

      Next.Issuance.logs()
      .then((r)=>{


        for (const i of r.data) {
          if (i.version == 2) {
            v2.push(i)
          } else {
            v1.push(i)
          }
        }

        console.log(v2)

        const t1 = new DataTable('#table-'+issues.name, {
          pageLength: 10,
          destroy: true,
          data: v1,
          columns: [
            {
              data: 'credential_exchange_id',
              title: 'Credential Exchange ID',
              sClass: 'small',
              createdCell : ( td, o, rowData, row, col ) => {
                var b = $( '<button class="btn btn-secondary btn-sm w-100">'+o+'</button>' ).on('click', () => {
                  setModalTitle('Data')
                  setModalData(<Loading />)
                  setVisible(true)
                  Next.Issuance.get({id: o})
                  .then(r=>{
                    setModalData(JSON.stringify(r, null, 4))
                  })
                  
                } );
                $( td ).html( b );
              }
            },
            {
              data: 'state',
              title: 'State',
              sClass: 'small',
              render: (o, t, row, meta ) => {
                return o;
              }
            },
            {
              data: 'created_at',
              title: 'Created',
              sClass: 'small',
              render: o => Time.now(o),
            },
            {
              data: 'credential_definition_id',
              title: 'Cred Def',
              sClass: 'small',
            },
          ]
        })
  
        t1.one('draw', () => {
          setHide(true)
        });


        const t2 = new DataTable('#table-'+issues2.name, {
          pageLength: 10,
          destroy: true,
          data: v2,
          columns: [
            {
              data: 'credential_exchange_id',
              title: 'Credential Exchange ID',
              sClass: 'small',
              createdCell : ( td, o, rowData, row, col ) => {
                var b = $( '<button class="btn btn-secondary btn-sm w-100">'+o+'</button>' ).on('click', () => {
                  setModalTitle('Data')
                  setModalData(<Loading />)
                  setVisible(true)
                  Next.Issuance.getv2({id: o})
                  .then(r=>{
                    setModalData(JSON.stringify(r.data, null, 4))
                  })
                  
                } );
                $( td ).html( b );
              }
            },
            {
              data: 'state',
              title: 'State',
              sClass: 'small',
              render: (o, t, row, meta ) => {
                return o;
              }
            },
            {
              data: 'created_at',
              title: 'Created',
              sClass: 'small',
//              render: o => Time.now(o),
            },
            {
              data: 'data',
              title: 'Cred Def',
              sClass: 'small',
              render: o => {
                if (o && o.by_format) {
                  return o.by_format.cred_proposal.indy.cred_def_id;
                } else {
                  return 'nil'
                }
              },
            },
          ]
        })
  
        t2.one('draw', () => {
          setHide(true)
        });

      });

      Next.Verify.logs()
      .then((r)=>{
        const table = new DataTable('#table-'+verifier.name, {
          pageLength: 10,
          destroy: true,
          data: r.data,
          columns: [
            {
              data: 'presentation_exchange_id',
              title: 'Presentation Exchange ID',
              sClass: 'small',
              createdCell : ( td, o, rowData, row, col ) => {
                var b = $( '<button class="btn btn-secondary btn-sm w-100">'+o+'</button>' ).on('click', () => {
                  setModalTitle('Data')
                  setModalData(<Loading />)
                  setVisible(true)
                  Next.Verify.get({did: o})
                  .then(r=>{
                    setModalData(JSON.stringify(r.data, null, 4))
                  })
                  
                } );
                $( td ).html( b );
              }
            },
            {
              data: 'state',
              title: 'State',
              sClass: 'small',
              render: (o, t, row, meta ) => {
                return o;
              }
            },
            {
              data: 'verified',
              title: 'Verified',
              sClass: 'small',
              render: (o, t, row, meta ) => {
                return o;
              }
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

      Next.System.network().then(r=>{
//        console.log(r)
      })


    }, []);


  return (
    <>

      <TableData title={issues2.title} name={issues2.name} time={issues2.time} hideLoading={hide} />
      <br/>

      <TableData title={issues.title} name={issues.name} time={issues.time} hideLoading={hide} />
      <br/>

      <TableData title={verifier.title} name={verifier.name} time={verifier.time} hideLoading={hide} />
      <br/>


      {/*
      <TableGeneric name={issues2.title} title={issues2.title} cols={issues2.cols} items={issues2.items} time={issues2.time} render={render_issue2} />
      <TableGeneric name={issues.title} title={issues.title} cols={issues.cols} items={issues.items} time={issues.time} render={render_issue} />
      <TableGeneric name={verifier.title} title={verifier.title} cols={verifier.cols} items={verifier.items} time={verifier.time} render={render_verify} />
      */}
      <ModalOk title={modal_title} body={modal_body} bindings={bindings} close={()=>setVisible(false)} />
    </>
  )
}