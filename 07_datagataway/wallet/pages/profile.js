
import Image from 'next/image';
import Nav from '@components/Nav';
import Menu from '@components/Menu';
import { Woollet } from '@data/woollet';
import { useState, useEffect } from 'react';
import Router from 'next/router';

export default function Profile() {

  const [ cover, setCover ] = useState(true);

  useEffect(() => {
    if (Woollet.unsigned()) {
      Router.push('/')
    } else {
      const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522');
      woollet.User.profile().then(r=>{
        if (r && r.status==0 && r.data) {
          setProfile(r.data)
          setWalletId(woollet.did)
          setExpiry(woollet.expiry)
          woollet.Eth.balance().then(p=>{
            setPoints(p.data.balance)
          });


          woollet.Nft.browser().then(r=>{
            console.log('NFT', r);
          })

        }
      });
      setCover(false);
    }
  }, []);

  // user info
  const [ profile, setProfile ] = useState({
    eth_id: '',
    name: '',
    avatar: '',
    email: '',
    card: '',
    created: 0,
  })
  const [ peid, setPeid ] = useState('')
  const [ result, setResult ] = useState('')
  const [ wallet_id, setWalletId ] = useState('')
  const [ expiry, setExpiry ] = useState()
  const [ test_did, setTestDid ] = useState('')
  const [ points, setPoints ] = useState(0)

  const handleTestDid = e => {
    console.log(e.target.value)
    setTestDid(e.target.value)
  }

  const handlePeid = e => {
    setPeid(e.target.value)
  }

  const actionTest = e => {
    if (test_did) {
      const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522')
      woollet.Proof.test(test_did).then(r=>{
        console.log(r);
        setPeid(r.data['presentation_exchange_id']);
      })
    }
  }

  const actionResult = e => {
    if (peid) {
      const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522')
      woollet.Proof.result(peid).then(r=>{
        setResult(JSON.stringify(r.data.o, null, 4))
      })
    }
  }

  // eth
  const faucetToken = async (e) => {
    const woollet = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522')
    woollet.Eth.faucet().then(r=>{
      console.log(r)
      woollet.Eth.balance().then(p=>setPoints);
    })
  };

  const returnToken = async (e) => {
  };


  return (
    <div hidden={cover}>
      <Nav title='Profile' />
      <div
        id='profile'
        className='page justify-content-center'
        style={{ width: '100%', overflowX: 'hidden' }}
      >
        <div className='body'>
          <div className='card'>
            <div className='card-header m-0 pt-2 pb-2'>
              <div className='row p-0'>
                <div className='col-2 pt-3'>
                  <span className='m-avatar'>
                    <Image
                      src='/images/user.jpg'
                      alt='avatar'
                      height={50}
                      width={50}
                    />
                  </span>
                </div>
                <div className='col-7 pt-4'>
                  <p
                    className='p-0 fw-bold'
                    style={{
                      border: '0',
                      fontSize: '120%',
                    }}
                    id='f-name'
                  >
                    {profile.name}
                  </p>
                  <p
                    className='p-0 fw-bold'
                    style={{
                      border: '0',
                      fontSize: '80%',
                    }}
                    id='f-title'
                  >
                    {profile.email}
                  </p>
                </div>
                <div className='col-3 text-center'>
                  <label className='' style={{ fontSize: '90%' }}>
                    Points
                  </label>
                  <p
                    className='mt-0'
                    id='f-points'
                    style={{
                      border: '0',
                      fontSize: '120%',
                    }}
                  >
                    {points}
                  </p>
                </div>
              </div>
            </div>
            <div className='card-body'>
              <div className='row p-0'>
                <div className='col-md-12'>
                  <div
                    id='form'
                    className='form mb-5 p-2'
                    style={{ fontSize: '80%' }}
                  >
                    <div>
                      <div className='text-end'>
                        <span
                          id='f-role'
                          className='liliac'
                          style={{ fontWeight: 'bold', fontSize: '120%' }}
                        ></span>{' '}
                        <i id='f-role-icon' className='liliac'></i>
                      </div>
                      <div className='mb-2'>
                        <label htmlFor='idx' className='form-label'>
                          Member ID
                        </label>
                        <input
                          id='f-idx'
                          className='form-control form-control-sm'
                          readOnly
                          value={wallet_id}
                        />
                      </div>
                      <div className='mb-2'>
                        <label htmlFor='idy' className='form-label'>
                          Wallet ID
                        </label>
                        <input
                          id='f-idy'
                          className='form-control form-control-sm small'
                          style={{fontSize: '95%'}}
                          readOnly
                          value={profile.eth_id}
                        />
                      </div>
                      <div className='mb-2'>
                        <label htmlFor='card' className='form-label'>
                          Membership Card
                        </label>
                        <input
                          className='form-control'
                          style={{ fontSize: '70%' }}
                          id='f-card'
                          disabled
                          readOnly
                          placeholder={profile.card}
                        />
                      </div>

                      <div className='row mb-2'>
                        <div className='col-6'>
                          <label htmlFor='time' className='form-label'>
                            Date Joined
                          </label>
                          <input
                            className='form-control'
                            style={{ fontSize: '70%' }}
                            id='f-issued'
                            disabled
                            readOnly
                            placeholder={new Date(profile.created*1000)}
                          />
                        </div>
                        <div className='col-6'>
                          <label htmlFor='time' className='form-label'>
                            Date Expiry
                          </label>
                          <input
                            className='form-control'
                            style={{ fontSize: '70%' }}
                            id='f-expiry'
                            disabled
                            readOnly
                            placeholder={new Date(expiry*1000)}
                          />
                        </div>
                      </div>
                      <div className='mb-2 text-end mt-4'>
                        {/* <button className="btn btn-primary btn-import ms-2">Import</button> */}

                        <button className='btn btn-primary btn-reconnect ms-2'>
                          Reconnect
                        </button>
                        <button className='btn btn-primary btn-export ms-2'>
                          Export
                        </button>
                        <br />
                        <span className='text-sm' style={{ fontSize: '70%' }}>
                          * To Import, pick the backup file on new browser or
                          after Close Account
                        </span>
                        <br />

                        <button
                          className='btn btn-primary btn-update ms-2'
                          disabled
                        >
                          Update
                        </button>
                        <button className='btn btn-primary btn-edit ms-2'>
                          Edit
                        </button>
                      </div>
                      <div className='mb-2 text-end mt-3'>
                        <button
                          className='btn btn-primary btn-faucet ms-2'
                          onClick={faucetToken}
                        >
                          Faucet
                        </button>
                        <button
                          className='btn btn-primary btn-return ms-2'
                          onClick={returnToken}
                        >
                          Return Token
                        </button>
                      </div>

                      <div className='mb-2 mt-5 text-end'>
                        <button className='btn btn-danger form-control btn-drop ms-2'>
                          Close account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card mb-5 pb-5">
            <div className="card-header">Test Verifier</div>
            <div className="card-body text-end">
              <div className="row">
                <input className="w-100 mb-3" onChange={handleTestDid} placeholder="Wallet ID to verify" />
                <button className="btn btn-primary" onClick={actionTest}>Request</button>
                <span>PEID: </span><span>{peid}</span>
              </div>
              <div className="row">
              <input className="w-100 mb-3" onChange={handlePeid} placeholder="Paste PEID here" />
                <button className="btn btn-primary" onClick={actionResult}>Check result</button>
                <pre className="small normal">{result}</pre>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <Menu />
    </div>
  );
}
