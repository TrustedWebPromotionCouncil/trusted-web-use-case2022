import { useEffect, useState } from 'react';
import Menu from '@components/Menu';
import Nav from '@components/Nav';
import { Woollet } from '@data/woollet';
import Router from 'next/router';


export default function transactions() {

  const [ cover, setCover ] = useState(true);
  const [ proof, setProof ] = useState([]);
  const [ conn, setConn ] = useState([]);

  useEffect(() => {
    if (Woollet.unsigned()) {
      Router.push('/');
    } else {
      const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522');
      woollet.Wallet.proofs().then(r=>{
        setProof(r.data)
      })
      woollet.Conn.list().then(r=>{
        setConn(r.data)
      })
      setCover(false);
    }
  }, []);


  const setTab = e => {
    switch (e.target.name) {
      case 'all':
        $('.card.tab').show()
        $('button').removeClass('active')
        $('button[name=all]').addClass('active')
        break;
      case 'conn':
        $('.card.tab').hide()
        $('.card.tab.conn').fadeIn()
        $('button').removeClass('active')
        $('button[name=conn]').addClass('active')
        break;
      case 'proof':
        $('.card.tab').hide()
        $('.card.tab.proof').fadeIn()
        $('button').removeClass('active')
        $('button[name=proof]').addClass('active')
        break;

    }
  }

  return (
    <div hidden={cover}>
      <Nav title='Transactions' />
      <div id='trans' className='page justify-content-center'>
        <div className='nav p-1'>
          <button name="all" onClick={setTab} className='btn btn-sm badge rounded-pill bg-secondary m-1'>
            All
          </button>
          <button name="proof" onClick={setTab} className='btn btn-sm badge active rounded-pill bg-secondary m-1'>
            Proof Request
          </button>
          <button name="conn" onClick={setTab} className='btn btn-sm badge rounded-pill bg-secondary m-1'>
            Connections
          </button>
        </div>
      </div>

      <div className="card tab conn mt-5" style={{display:'none'}}>
        <div className="card-header">
          Connections
        </div>
        <div className="card-body">
          <table width="100%" className='small table table-striped'>
          <thead>
          <tr>
            <th>Connection ID</th>
            <th>Label</th>
            <th>State</th>
          </tr>
          </thead>
          <tbody>
          {(conn.map(i=>(
            <tr key={i.connection_id}>
              <td><small><small>{i.connection_id}</small></small></td>
              <td><small>{i.their_label}</small></td>
              <td><small>{i.state}</small><br/><small>{i.rfc23_state}</small></td>
            </tr>
          )))}
          </tbody>
        </table>
        </div>
      </div>


      <div className="card tab proof mt-5">
        <div className="card-header">
          Proof Requests
        </div>
        <div className="card-body">
          <table width="100%" className='small table table-striped'>
          <thead>
          <tr>
            <th>Proof Request ID</th>
            <th>Description</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          {(proof.map(i=>(
            <tr key={i.presentation_exchange_id}>
              <td><small><small>{i.presentation_exchange_id}</small></small></td>
              <td><small>{i.presentation_request.name}</small><br/><small>{i.presentation_request_dict.comment}</small></td>
            </tr>
          )))}
          </tbody>
        </table>
        </div>
      </div>


        
      <Menu />
    </div>
  );
}
