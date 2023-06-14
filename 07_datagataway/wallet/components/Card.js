import { useState, useEffect } from 'react';
//import { useTranslation } from 'next-i18next';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { Woollet } from '@data/woollet';
import Router from 'next/router';

/*
const strnow = (i) => {
  if (i - 0 > 0 && i < 1049332188000) i *= 1000;
  const n = i ? new Date(i) : new Date();
  return (
    n.getFullYear() +
    '-' +
    (n.getMonth() - 0 + 1).toString().padStart(2, '0') +
    '-' +
    n.getDate().toString().padStart(2, '0') +
    ' ' +
    n.getHours().toString().padStart(2, '0') +
    ':' +
    n.getMinutes().toString().padStart(2, '0') +
    ':' +
    n.getSeconds().toString().padStart(2, '0')
  );
};
*/
/*
  const tt = (t) => {
    const translate = {
      'orphe-data-t_healthcare_orphe_test-1.0.1-hour12': 'ヘルスケアデータ',
      'orphe-data-t_gait_chunk_logs_orphe_test-1.0.1-hour12': '歩行解析データ',
      'orphe-data-t_condition_orphe_test-1.0.1-hour12': '体調データ',
      'orphe-data-t_pain_orphe_test-1.0.1-hour12': '膝の痛みデータ',
      'FqN2G7aGFDfmB6VpR3vyne:3:CL:1402:orphe-data-t_healthcare_orphe_test-1.0.1-hour12-hour12':
        'ヘルスケアデータ',
      'FqN2G7aGFDfmB6VpR3vyne:3:CL:1408:orphe-data-t_gait_chunk_logs_orphe_test-1.0.1-hour12-hour12':
        '歩行解析データ',
      'FqN2G7aGFDfmB6VpR3vyne:3:CL:1394:orphe-data-t_condition_orphe_test-1.0.1-hour12-hour12':
        '体調データ',
      'FqN2G7aGFDfmB6VpR3vyne:3:CL:1384:orphe-data-t_pain_orphe_test-1.0.1-hour12-hour12':
        '膝の痛みデータ',
    };
    if (t in translate) return translate[t];
    return t;
  };
*/

export default function Cards({ cardList }) {
  
//  const { t, lang } = useTranslation('common');
  const [ cover, setCover ] = useState(true);
  const [ woollet, setWoollet ] = useState(null)

  useEffect(() => {
    const w = new Woollet('e3c9bc168a3e4f9d49a262ef064fe522')
    setWoollet(w)
    if (Woollet.unsigned()) {
      Router.push('/')
    } else {
      w.Wallet.creds().then(r => {
        setCredList(r.data)
      });
    }
  }, []);

  const [ credentials, setCredList ] = useState([]);
  const [ credDict, setCredDict ] = useState({});
  const [ proofs, setProofs ] = useState({});
  const [ proofRequest, setProofRequest ] = useState([]);

  const [ involved, setInvolved ] = useState({});
  const [ summary, setSummary ] = useState({});


  let credId = [];
  let credData = [];
  let proof_requests = [];
  let proof_index = {};
  let requests = [];

  let creds = [];
  const sum = {};
  const inv = {};

  const loadCredentials = async () => {
    const cs = credentials.reduce((a, v) => ({ ...a, [v.referent]: v }), {});
    for (const c in cs) {
      cs[c].fields = Object.keys(cs[c].attrs);
      cs[c].cat = cs[c].attrs['doc:type'];
      inv[c] = [];
    }
    setCredDict(cs);
    const cl = Object.keys(cs).length;
    console.log('CREDENTIALS', cl, cs, credId, credData);
  };

  const loadProofRequests = async () => {
    proof_requests = await woollet.Wallet.proofs();
    if (!proof_requests || !proof_requests.data)
      return;
    proof_requests = proof_requests.data;
    for (const pr of proof_requests) {
      if (pr.state != 'request_received') continue;
      let req = await woollet.Wallet.proof(pr.presentation_exchange_id);
      if (!req || !req.data) continue;
      req = req.data;
      requests.push(req);
      proof_index[req.presentation_exchange_id] = req;
    }
    console.log('EFFECTIVE REQUESTS', requests);
  };

  const subsetOf = (parentArray, subsetArray) => {
    return subsetArray.every((el) => {
      return parentArray.includes(el);
    });
  };

  const matchDef = (d) => {
    let r = [];
    for (const c in credentials) {
      if (credentials[c].cred_def_id == d) r.push(credentials[c].referent);
    }
    return r;
  };

  const get_cred = i => {
    for (const c of credentials) {
      if (c.referent == i) return c
    }
    return null;
  }

  const matchFields = (a, f) => {
    let r = [];
    for (const c of a) {
      const cred = get_cred(c)
      console.log(c, cred)
      if (subsetOf(cred.fields, f)) r.push(c);
    }
    return r;
  };

  const matchPred = (a, p) => {
    const r = [];
    for (const c of a) {
      r.push(c);
    }
    return r;
  };

  const checkProof = async () => {
    Woollet.debug = false;

    await loadCredentials();

    await loadProofRequests();

    for (const request of requests) {
      const peid = request.presentation_exchange_id;
      const attrs = request.presentation_request.requested_attributes;
      const pred = request.presentation_request.requested_predicates;

      let attr_match = true;
      let requested = [];

      for (const group in attrs) {
        const cred_def = attrs[group].restrictions[0].cred_def_id;
        const fields = attrs[group].names;
        creds = matchDef(cred_def);

        if (creds.length > 0) {
          creds = matchFields(creds, fields);
          if (creds.length > 0) {
            creds = matchPred(creds, pred); // matchPred is empty, need to fill in checker.
            if (creds.length > 0) {
              requested.push({
                group: group,
                fields: fields,
                creds: creds,
              });
            } else {
              attr_match = false;
            }
          } else {
            attr_match = false;
          }
        } else {
          attr_match = false;
        }
      }

      if (attr_match) {
        // pack all validated peid into summary, index involved for easy look up.
        sum[peid] = requested;
        for (const i in requested) {
          for (const j of requested[i].creds) {
            if (!(j in inv)) inv[j] = [];
            inv[j].push(proof_index[peid]);
          }
        }
      }
    }
    setInvolved(inv);
    setSummary(sum);
    //    console.log(summary);
  };

  useEffect(() => {

    if (credentials.length==0) return;
    checkProof();
  }, [credentials]);

  const handleCats = (e) => {
    $('button.cats').removeClass('active');
    switch (e.target.dataset.type) {
      case 'data-1':
        $('.card-cred').hide();
        $('.card-cred.data-1').fadeIn();
        break;
      case 'id':
        $('.card-cred').hide();
        $('.card-cred.id').fadeIn();
        break;
    }
  };

  const handleAccept = async (peid) => {
    const attrs = {};
    for (const i of summary[peid]) {
      attrs[i.group] = {
        cred_id: i.creds[0],
        revealed: true,
      };
    }

    console.log('REVEAL',  JSON.stringify(attrs, null ,4))
   
    const r = await woollet.Data.share(peid, attrs, {}, {peid: peid});
    console.log('Present Credential', r);
    setTimeout(() => {
      Router.reload();
    }, 2000);
  };

  const handleReject = async (pp) => {
    const i = pp.peid;
    alert('Drop ' + i);
  };

  return (
    <>
      <div
        className='pt-0 m-2 ms-4 me-4 btn-group btn-group-sm d-flex justify-content-end'
        role='group'
        aria-label='Small button'
      >
        <button
          id='c-id'
          type='button'
          onClick={handleCats}
          className='cats btn btn-outline-secondary active'
          data-type='id'
          style={{ zIndex: '0' }}
        >
          Identity
        </button>
        <button
          id='c-data-1'
          type='button'
          onClick={handleCats}
          className='cats btn btn-outline-secondary'
          data-type='data-1'
        >
          Data
        </button>
      </div>
      {credentials ? (
        credentials.map((info) => (
          <div
            key={'card-'+info.referent}
            className={'card-cred ' + info.attrs['doc:type']}
            style={{
              display: info.attrs['doc:type'] == 'id' ? 'block' : 'none',
            }}
          >
            <div
              className='card'
              style={{
                margin: '10px 20px',
                borderRadius: '10px',
                height: 'auto',
              }}
            >
              <div
                className='card-header'
                style={{
                  backgroundColor: [info.attrs['doc:bg']],
                  height: '110px',
                }}
              >
                <button
                  className='btn btn-link d-flex w-100'
                  data-toggle='collapse'
                  data-target={'#' + info.referent}
                  aria-expanded='true'
                  aria-controls={info.referent}
                  style={{
                    textDecoration: 'none',
                  }}
                >
                  {/*Proof Notification */}
                  <div
                    className='position-absolute top-0 end-0'
                    style={
                      involved[info.referent] &&
                      involved[info.referent].length > 0
                        ? {}
                        : { display: 'none' }
                    }
                  >
                    <svg height='50' width='50' className='blinking'>
                      <circle cx='25' cy='25' r='5' fill='#be4141' />
                    </svg>
                  </div>

                  <picture style={{ width: '50px' }}>
                    <img
                      alt='com'
                      src={info.attrs['org:logo']}
                      style={{ width: '50px', alignSelf: 'center' }}
                    />
                  </picture>

                  <div
                    style={{
                      display: 'inline',
                      marginLeft: '20px',
                      color: 'black',
                      textAlign: 'left',
                    }}
                  >
                    <div className="mb-1 fw-bold">
                        {info.attrs['org:name']}
                    </div>
                    <div className="small">
                      <small>{info.attrs['doc:desc']}</small>
                    </div>
                    {info.attrs['doc:type'].match('data-') && (
                      <p style={{ fontSize: '.7rem' }}>
                        {info.cred_def_id}
                        <br />
                        <small>
                          <b style={{ color: '#131d54' }}></b>
                          {info.attrs['date:issued']}
                        </small>
                      </p>
                    )}
                  </div>
                </button>
              </div>

              <div
                id={info.referent}
                className='collapse'
                data-parent='#accordion'
              >
                <div className='card-body'>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div className='container'>
                      <h6>Name: {info.attrs.name}</h6>

                      {info.attrs.cat ? (
                        <p
                          style={{
                            color: '#a85c57',
                            fontStyle: 'italic',
                            fontWeight: '700',
                          }}
                        >
                          Cat: {info.attrs.cat}
                        </p>
                      ) : (
                        <p
                          style={{
                            color: '#a85c57',
                            fontStyle: 'italic',
                            fontWeight: '700',
                          }}
                        >
                          Card: {info.attrs.card}
                        </p>
                      )}
                      <div style={{ display: 'grid' }}>
                        <small>
                          <b>Title:</b> {info.attrs.title}
                        </small>
                        <small>
                          <b>Role:</b> {info.attrs.role}
                        </small>
                        <small>
                          <b>Email: </b> {info.attrs.email}
                        </small>
                      </div>
                    </div>
                    <div className='d-flex'>
                      <FontAwesomeIcon
                        icon={faUser}
                        style={{
                          height: '20px',
                          padding: '4px',
                          color: '#bf85ff',
                        }}
                      />
                      <span>{info.attrs['org:unit']}</span>
                    </div>
                  </div>
                  <div className='container mt-2'>
                    {info.attrs.idx && (
                      <>
                        <small style={{ textAlign: 'center', margin: '0' }}>
                          <b style={{ color: '#131d54' }}>idx: </b>
                          <i> {info.attrs.idx}</i>
                        </small>
                        <br />
                        <small className='text-center '>
                          <b style={{ color: '#131d54' }}>idy: </b>
                          {info.attrs.idy}
                        </small>
                        <br />
                      </>
                    )}

                    <small style={{ textAlign: 'center', margin: '0' }}>
                      <b style={{ color: '#131d54' }}>Referent: </b>
                      <i> {info.referent}</i>
                    </small>

                    <br />

                    <small className='text-center '>
                      <b style={{ color: '#131d54' }}>Cred Def: </b>
                      {info.cred_def_id}
                    </small>
                    <br />
                    {/*
                    <small className='text-center '>
                      <b style={{ color: '#131d54' }}>Rev ID: </b>
                      {info.rev_reg_id}
                    </small>
                    <br />
*/}

                    <small className='text-center '>
                      <b style={{ color: '#131d54' }}>Schema ID: </b>
                      {info.schema_id}
                    </small>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '10%',
                      marginLeft: '3%',
                      marginRight: '3%',
                    }}
                  >
                    <small>
                      <b style={{ color: '#131d54' }}>Auth: </b>
                      {info.attrs['org:name']}
                    </small>

                    <small>
                      <b style={{ color: '#131d54' }}>Issued: </b>
                      {info.attrs['date:issued'].slice(0, 10)}
                    </small>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginLeft: '3%',
                      marginRight: '3%',
                    }}
                  >
                    <small>
                      <b style={{ color: '#131d54' }}>Desc: </b>
                      {info.attrs['org:desc']}
                    </small>

                    <small>
                      <b style={{ color: '#131d54' }}>Expiry: </b>
                      {info.attrs['date:expiry'].slice(0, 10)}
                    </small>
                  </div>
                </div>
                {/* Proofs by involvement */}
                {involved[info.referent] &&
                  involved[info.referent].length > 0 &&
                  involved[info.referent].map((inv) => (
                    <div key={'i-'+inv.presentation_exchange_id+'-'+info.referent}>
                      <div
                        className='m-2 ps-4 pe-4'
                        style={{
                          border: '1px solid gray',
                          borderRadius: '10px',
                        }}
                      >
                        <div className='p-2'>
                          <div className="row mt-2 mb-4">
                            <div className="col-5 bold">
                              {inv.presentation_request_dict.comment}
                            </div>
                            <div className="col-7 bold text-end">
                              {inv.presentation_request.name}
                            </div>
                          </div>
                          <div className="row small mb-2">
                            <div className="col-5">
                              <b>State: </b> {inv.state}
                            </div>
                            <div className="col-7 text-end">
                              {inv.created_at}
                            </div>
                          </div>

                          <div className="row small mb-2">
                            <div className="col-4 bold">
                              Proof ID:
                            </div>
                            <div className="col-8 text-end">
                              {inv.presentation_exchange_id}
                            </div>
                          </div>

                          <div className="row small mb-2">
                            <div className="col-4 bold">
                              Cred ID:
                            </div>
                            <div className="col-8 text-end">
                            {info.referent}
                            </div>
                          </div>

                          <div className="row small mb-2">
                            <div className="col-4 bold">
                              Connection ID:
                            </div>
                            <div className="col-8 text-end">
                            {inv.connection_id}
                            </div>
                          </div>

                        </div>
                        <div className='p-2'>
                          {summary[inv.presentation_exchange_id] &&
                            summary[inv.presentation_exchange_id].map((g) => (
                              <div key={'p-'+inv.presentation_exchange_id+'-'+info.referent}>
                                <div className="row small mb-2">
                                  <div className="col-4 bold">
                                    Field Group ID:
                                  </div>
                                  <div className="col-8 text-end small">
                                  <small>{g.group}:{g.creds}</small>
                                  </div>
                                </div>
                                <div className="row small mb-2">
                                  <div className="col-4 bold">
                                    Fields:
                                  </div>
                                  <div className="col-8 text-end">
                                    {g.fields &&
                                    g.fields.map((f) => (
                                      <div key={g.group + '-' + f}>
                                        <input
                                          type='checkbox'
                                          id={g.group + '-' + f}
                                          name={g.group + '-' + f}
                                          checked
                                          readOnly
                                          style={{fontSize: '120%', fontWeight: 'bold'}}
                                        />
                                        <label className="bold" style={{fontSize:'110%'}} htmlFor={g.group + '-' + f}>{f}</label>
                                      </div>
                                    ))}                                    
                                  </div>

                                </div>

                                
                              </div>
                            ))}
                        </div>
                        <div className="row mb-3">
                          <div className="col-6">
                            <button
                              className='btn btn-success m-1 btn form-control'
                              onClick={() =>
                                handleAccept(inv.presentation_exchange_id)
                              }
                            >
                              Accept
                            </button>
                          </div>
                          <div className="col-6">
                            <button
                              className='btn btn-danger m-1 btn form-control'
                              onClick={() =>
                                handleReject(inv.presentation_exchange_id)
                              }
                            >
                              Reject
                            </button>
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </>
  );
}
