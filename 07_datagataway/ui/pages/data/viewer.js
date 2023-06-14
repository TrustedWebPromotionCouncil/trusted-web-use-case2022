
import { TableGeneric } from '@/components/tables'
import { CheckField, SelectOpr } from '@/components/verify'
import { Woollet } from '@/data/woollet'
import { Did, Next } from '@/data/did'
import { Container, Row, Col, Text, Link, Image, Input, Button, Select, Dropdown, Table, Card, Textarea, Checkbox, Spacer, normalWeights } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import React from 'react'
import useTranslation from 'next-translate/useTranslation';
import Chart from 'chart.js/auto';

import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function Page() {

    const TEST = null;

    const { t, lang } = useTranslation('common');

    const [ files, setFiles ] = useState([
        { key: 't_gait_records', name: 't_gait_records', fields: ['id', 'gait_id', 'm_user_id', 'start_date', 'finish_date'] }, 
        { key: 't_gait_chunk_logs', name: 't_gait_chunk_logs', fields: ['id', 'gait_id', 'activity_type'] },
        { key: 't_healthcare', name: 't_healthcare', fields: ['id', 'm_user_id', 'date', 'step_count', 'walking_speed', 'walking_distance', 'walking_time'] },
        { key: 't_questions',   name: 't_questions', fields: ['id', 'm_user_id', 'time_meridian'] },
    ])

    useEffect(()=>{
        const o = sessionStorage.getItem('org.id');
        const n = sessionStorage.getItem('user.name');
        if (!TEST) {
            if (!o || !n) {
//                window.location = '/'+lang+'/carbon/system/signin'
                return;
            }
        }
    }, [])

    const [ fields, setFields ] = useState({})

    for (const i of files) fields[i.key] = i.fields

    const [ list, setList ] = useState([]);
    const [ data, setData ] = useState([]);
    const [ tabkey, setKey ] = useState('visual');
    const [ tabhide, setTabHide ] = useState(false);
    
    const [ output, setOutput ] = useState('');
    const [ outResp, setOutResp ] = useState('');
    const [ outReq, setOutReq ] = useState('');

    const [request, setRequest ] = useState({});

    const [ canvases, setCanvases ] = useState(null);

    useEffect(()=>{
        setCanvases( document.getElementById('canvases') );
    }, []);

    let chart0;
    let ctx0;



    const avgs = (arr, step) => {
        // input array of 880 values

        const chunkSize = Math.ceil(arr.length / step);

        // initialize an empty result array
        const result = [];

        // iterate over each chunk
        for (let i = 0; i < arr.length; i += chunkSize) {
            // calculate the sum and average of the chunk
            const chunk = arr.slice(i, i + chunkSize);
            const sum = chunk.reduce((a, b) => a + b, 0);
            const average = sum / chunk.length;
            // add the average value to the result array
            result.push(average);
        }
        return result
    }


    const draw_carbon = async () => {

        const r = await Next.Data.sensors({
            date_from: 1678201231, 
            date_to: 1678285172,
            client: 'matsumoto',
        });

        let steps = 0;
        let w1 = [];
        let w2 = [];
        let w3 = [];
        let w4 = [];

        let e1 = [];
        let e2 = [];
        let e3 = [];
        let e4 = [];

        let le1 = 0.000000;
        let le2 = 0.000000;
        let le3 = 0.000000;
        let le4 = 0.000000;
        let lt = 1678201231000;

        let label = [];
        let c = 0;

        const tco2 =  0.000449 * 1000; // tCO2 / kWh -> gCO2

        const labels = Object.keys(r.data);
        labels.sort()

        for (const i of labels) {
//            c++
//            if (c>steps) {
                label.push((new Date(i-0)).toLocaleTimeString());
//                c = 0;
//            }

            const ri = r.data[i];

            const duration = (i-lt) / 1000 / 3600;

            lt = i;

            const kwh1 = (ri.w1/1000) * duration;
            const kwh2 = (ri.w2/1000) * duration;
            const kwh3 = (ri.w3/1000) * duration;
            const kwh4 = (ri.w4/1000) * duration;

            w1.push(kwh1) // kWh
            w2.push(kwh2) // kWh
            w3.push(kwh3) // kWh
            w4.push(kwh4) // kWh

            const ce1 = kwh1 -0 * tco2;
            le1 = ce1+le1;
            e1.push( le1 )

            const ce2 = kwh2 * tco2;
            le2 = ce2+le2
            e2.push( le2 )

            const ce3 = (kwh3-0) * (tco2-0);
            le3 = ce3+le3
            e3.push( le3 )

            const ce4 = kwh4 * tco2;
            le4 = ce4 + le4
            e4.push( le4 )

        }

        console.log(e2, e3)

//        w1 = avgs (w1, steps)
//        w2 = avgs (w2, steps)
//        w3 = avgs (w3, steps)
//        w4 = avgs (w4, steps)


        drawCarbon(w3, e3, label, 'Client Devices')
        drawCarbon(w2, e2, label, 'Management Devices')
        drawCarbon(w1, e1, label, 'Back up Power Supply')
        drawCarbon(w4, e4, label, 'Others')


        setOutReq(JSON.stringify({
            'reqeuster': 'Woollet Network',
            'target': 'Matsumoto Data Center',
            'purpose': 'Power supply in data center',
            'date-from': '2023-03-08',
            'date-to': '',
            'data-type': 'Electricity bill'
        }, null, 4))

        setOutResp(JSON.stringify(r.data, null, 4))


    }

    const drawCarbon = async (w, e, l, title) => {


        const Chart_data = {
            labels: l,
            datasets: [
                {
                    label: title + ' (kWh)',
                    data: w,
                    yAxisID: 'y',
                },
                {
                    label: 'CO2 Emission (gCO2)',
                    data: e,
                    yAxisID: 'e',
                },
            ]
        };
        const div = document.createElement('div')
        div.style.cssText = "width: 650px; float: left; margin-left: 20px; margin-right: 20px;";
        const Ctx = document.createElement('canvas')
        Ctx.id = 'canvas-'+Math.random();
        div.appendChild(Ctx)
        canvases.appendChild(div)
        const Charts = new Chart(Ctx, {
            type: 'line',
            data: Chart_data,
            options: {
                bezierCurve : true,
                tension: 0.4,
                radius: 4,
                responsive: true,
                scales: {
                    y: { beginAtZero: false, position: 'left' },
                    e: { beginAtZero: false, position: 'right' },
                },
                plugins: {
                    title: {
                        display: false,
                        text: 'CO2 Emission gCO2',
                    }
                }                       
            }
        });
    }


    const actionData = async function (e) {

        await draw_carbon()
        return;

        const peid = e.target.dataset.key;
        const file = request[peid]
        let out = [];

        setOutResp('')
        canvases.innerHTML = '';
        setOutReq(JSON.stringify(file.request, null, 4))
        setTabHide(true)
        setKey('request')
        
//        file.request.def_id = "FqN2G7aGFDfmB6VpR3vyne:3:CL:1394:orphe-data-t_condition_orphe_test-1.0.1-hour12-hour12";
//        "FqN2G7aGFDfmB6VpR3vyne:3:CL:1384:orphe-data-t_pain_orphe_test-1.0.1-hour12-hour12";


        let envelope = await Next.Envelop.get({id: file.request.def_id});
        if (envelope.status != 0) return console.log('ERROR Envelope')
        envelope = envelope.data;

        file.request.name = envelope.desc;


        const setData = o => {
            try { o = JSON.parse(o) } catch (e) { o = [] }
            const table = Object.keys(envelope.dataset)[0];
            const data_out = Array.isArray(o) ? o: [o];
            const data_array = [];
            for (const a of data_out) {

                switch (table) {
                    case 't_gait_chunk_logs':
                        if ('t_gait_chunk_logs' in a) {
                            data_array.push(a[table])
                        }
                        break;
                    case 't_healthcare':
                        if ('t_healthcare' in a) {
                            data_array.push(a[table])
                        }

                        break;
                    case 't_pain':
                    case 't_condition':
                        if ('t_pain' in a) {
                            data_array.push(a['t_pain'])
                        } else if ('t_condition' in a) {
                            data_array.push(a['t_condition'])
                        }
                        break;
                }
            }
            return data_array;
        };


        const prepare_gait_data = (fs, o) => {
            const data = {
                    labels: [],
            };
            for (const f of fs) {
                data[f] = [];
            }
            let level = o.length>2 ? 1:0;
            const dig_data = (oo) => {
                for (const i of oo) {
                    if (level < 2 && 'children' in i) {
                        level++;
                        dig_data(i.children)
                        level--;
                        continue;
                    }

                    data.labels.push(i.start_date)
                    for (const f of fs) {
                        data[f].push(i[f]);
                    }
                }
            }

            dig_data(o)
            return data;
        }

        const prepare_healthcare_data = (fs, o) => {
            const data = {
                    labels: [],
            };
            for (const f of fs) {
                data[f] = [];
            }
            const dig_data = (o, data) => {
                for (const i of o) {
                    if ('children' in i) {
                        dig_data(i.children, data)
                        continue;
                    }
                    data.labels.push(i.date)
                    for (const f of fs) {
                        data[f].push(i[f]);
                    }
                }
            }
            dig_data(o, data)
            return data;
        }

        const prepare_condition_data = (o) => {
            const data = {
                    rating: [],
                    labels: [],
            };
            const dig_data = (o, data) => {
                for (const i of o) {
                    if (i && 'rating' in i) {
                        if ('children' in i) {
                            dig_data(i.children, data)
                            continue;
                        }
                        data['rating'].push(i.rating)
                        data['labels'].push(i.date);        
                    }
                }
            }
            dig_data(o, data)
            return data;
        }

        const prepare_pain_data = (o) => {
            const data = {
                    left: [],
                    right: [],
                    label_left: [],
                    label_right: [],
            };
            const dig_data = (o, data) => {
                for (const i of o) {
                    if (i && 'position' in i) {
                        if ('children' in i) {
                            dig_data(i.children, data)
                            continue;                           
                        }
                        if (i.position==1) {
                            data['right'].push(i.pain_level)
                            data['label_right'].push(i.date);
                        } else {
                            data['left'].push(i.pain_level)
                            data['label_left'].push(i.date);
                        }                    
    
                    }
                }
            }
            dig_data(o, data)
            return data;
        }

        const draw = (data, f, l) => {

            const Chart_data = {
                labels: data[l],
                datasets: [{
                    label: f,
                    data: data[f],
                }]
            };
            const div = document.createElement('div')
            div.style.cssText = "width: 400px; float: left; margin-left: 20px; margin-right: 20px;";

            const Ctx = document.createElement('canvas')
            Ctx.id = 'canvas-'+f;
            div.appendChild(Ctx)
            canvases.appendChild(div)

            const Charts = new Chart(Ctx, {
                type: 'line',
                data: Chart_data,
                options: {
                    bezierCurve : true,
                    tension: 0.4,
                    radius: 4,
                    responsive: true,
                    scales: {
                        y: { beginAtZero: true },
                    },
                    plugins: {
                        title: {
                            display: false,
                            text: f,
                        }
                    }                       
                }
            });
        }



        const setChart = o => {

            const data = {};

            if (file.request.def_id.match(/t_gait/)) {
                const gait_fields = [
                    'stride_average',
                    'stride_variance',
                    'stride_min',
                    'stride_max',
                    'step_speed_average',
                    'step_speed_variance',
                    'step_speed_min',
                    'step_speed_max',
                ];
                data['gait'] = prepare_gait_data(gait_fields, o);
                for (const f of gait_fields) {
                    draw(data['gait'], f, 'labels');
                }
            } else if (file.request.def_id.match(/t_healthcare/)) {
                const gait_fields = [
                    'step_count',
                    'walking_speed',
                    'walking_step_length',
                    'stair_ascent_speed',
                    'stair_descent_speed',
                    'walking_double_support_percentage',
                    'stwalking_asymmetry_percentageep_speed_min',
                    'walking_steadiness',
                ];
                data['gait'] = prepare_healthcare_data(gait_fields, o);
                for (const f of gait_fields) {
                    draw(data['gait'], f, 'labels');
                }
            } else if (file.request.def_id.match(/t_condition/) || file.request.def_id.match(/t_pain/)) {

                data['pain'] = prepare_pain_data(o);
                draw(data['pain'], 'left', 'label_left');
                draw(data['pain'], 'right', 'label_right');

                data['condition'] = prepare_condition_data(o);
                draw(data['condition'], 'rating', 'labels');

            }

        };

        setTimeout(()=>{
            setTabHide(false)
        }, 800);

        if (file.response) {

            if (!file.hash) return;
/*
            if (Array.isArray(file.hash) && file.hash.length==1) {
                file.hash = file.hash[0]
            }
*/
            setKey('response')

//            ["Qmd8230e78ff16b8f1d623afdc7b44c3b1", "Qme02c661578fa721ddca007f91b1497a8", "Qm005badf529addd623996ee6b6a1142c9", "Qm1b5100ef815f8020e36700b495fe873a"]
//            file.hash = ['Qmd8230e78ff16b8f1d623afdc7b44c3b1', 'Qme02c661578fa721ddca007f91b1497a8', 'Qm005badf529addd623996ee6b6a1142c9', 'Qm1b5100ef815f8020e36700b495fe873a'];
//                file.hash = ["Qmd8230e78ff16b8f1d623afdc7b44c3b1", "Qme02c661578fa721ddca007f91b1497a8", "Qm005badf529addd623996ee6b6a1142c9", "Qm1b5100ef815f8020e36700b495fe873a"];

            if (Array.isArray(file.hash)) {
                (async ()=>{

                    let os = [];

                    let r = await Next.IPFS.fetch({hash: file.hash[0]});

                    try { r = JSON.parse(r.data.data)} catch (e) {}
                    const type = Object.keys(r)[0];
                    const id = r[type].m_user_id;
                    const oo = await Next.Logs.ipfs();
                    const ooo = [];
                    for (const i of oo.data) {
                        if (i.data.match(id)) {
                            if ( type == 't_gait_chunk_logs' || type == 't_healthcare') {
                                if (i.data.match(type)) {
                                    try {
                                        ooo.push(JSON.parse(i.data)[type])
                                    } catch (e) {}
                                }
                            } else if (['t_pain','t_condition'].includes(type)) {
                                if (i.data.match('t_pain')) {
                                    ooo.push(JSON.parse(i.data)['t_pain'])
                                } else if (i.data.match('t_condition')) {
                                    ooo.push(JSON.parse(i.data)['t_condition'])
                                }
                            }
                        }
                    }

                    let oooo = [];
                    
                    if (ooo.length>0) {
                        oooo = ooo.sort( (p1, p2) => (p1.date > p2.date) ? 1 : (p1.date < p2.date) ? -1 : 0 );
                    } else {
                        for (const hash of file.hash) {
                            const r = await Next.IPFS.fetch({hash: hash});
                            if (r.status==0) {
                                out = setData(r.data.data)
                                os = os.concat(out)
                            }
                        }    
                        oooo = os.sort( (p1, p2) => (p1.date > p2.date) ? 1 : (p1.date < p2.date) ? -1 : 0 );
                    }

                    setOutResp(JSON.stringify(oooo, null, 4))
                    setChart(oooo);
                    setKey('visual')

                })();
            } else {
                Next.IPFS.fetch({hash: file.hash}).then(r=>{
                    if (r.status==0) {
                        out = setData(r.data.data)
                         setOutResp(JSON.stringify(out, null, 4))
                         setChart(out);
                         setKey('visual')
                    } else {
                        setOutResp(JSON.stringify(r, null, 4))    
                    }
                })    
            }
        }
    }

    useEffect(()=>{
      
        const pid = sessionStorage.getItem('org.id');

        Next.Data.list()
        .then(r=>{
            setList(r)
            const filtered = [];
            r.map(o=>{

//                if (pid != o.requests.owner) return;

                const accept = ['orphe-data-request', 'orphe-data-precise-targeting']
                const peid = o.peid;
                if (accept.includes(o.action)) {
                    const resp = o.o ? o.o : 'waiting...';
                    const req = o.requests;
                    delete req.fields;

                    request[peid] = { request: req, response: resp, hash: '' }

                    if (o.o && o.o.self_attested_attrs && Object.keys(o.o.self_attested_attrs).length>0) {

                        const k = Object.keys(o.o.self_attested_attrs)[0];
                        try {
                            const data = JSON.parse(o.o.self_attested_attrs[k]);
                            const ro = data.filter(r=>r.hash).map(ele=>ele.hash);
//                            console.log(ro)
                            request[peid] = { request: req, response: resp, hash: ro }
    
                        } catch (e) {

                            if (o.o.revealed_attr_groups.hash) {
                                const hash = o.o.revealed_attr_groups.hash + '';
                                request[peid] = { request: req, response: resp, hash: hash }
                            } else {
                                const ro = []
                                for (const i in o.o.revealed_attr_groups) {
                                    const g = o.o.revealed_attr_groups[i];
                                    if (g.hash) {
                                        ro.push(g.hash)
                                    }
                                }
                                if (ro.length>0) {
                                    request[peid] = { request: req, response: resp, hash: ro }
                                }
                            }
    

                        }

                    } else if (o.o && o.o.revealed_attr_groups) {
                        if (o.o.revealed_attr_groups.hash) {
                            const hash = o.o.revealed_attr_groups.hash + '';
                            request[peid] = { request: req, response: resp, hash: hash }
                        } else {
                            const ro = []
                            for (const i in o.o.revealed_attr_groups) {
                                const g = o.o.revealed_attr_groups[i];
                                if (g.hash) {
                                    ro.push(g.hash)
                                }
                            }
                            if (ro.length>0) {
                                request[peid] = { request: req, response: resp, hash: ro }
                            }
                        }
                    }
                    filtered.push(o)
                } else {
                    return null;
                }
            });

            /*
            const setData = o => {
                Next.Data.sensors().then(r=>{

                    console.log(r)
                })
            }
    */
    

            setData([{
                peid: "7dfa1682-8f59-427f-aeb0-8d8d366a684b",
                name: 'Matsumoto',
                comment: 'Power supply in data center for 2023-03-08'
            }])
//            draw_carbon()
//            console.log(filtered)
        });
  
    }, []);
    

    return (
        <>
            <Container>
                <Row className='mb-5'>
                    <Col>
                        <Text h3>{t('Data Viewer')}</Text>
                        <Text h6 i>{t("reading availale dataset from partner's wallet")}</Text>
                    </Col>
                </Row>
                <Row className='mt-5'>
                    <Text h5>{t('Data Received from user sharing')}</Text>
                </Row>

                <Row className='mt-1'>
                    <Col css={{maxHeight: '300px', overflow: 'auto',}}>
                        <Table
                            fullWidth
                            bordered
                            shadow
                            striped
                            aria-label="Data query record"
                            title="Data Received from user sharing"
                            css={{
                                width:"100%",
                                maxWidth: "100%",
                                minWidth: "70%",
                                fontSize: '90%',
                                }}
                            >
                            <Table.Header>
                            <Table.Column key='id'>ID</Table.Column>
                            <Table.Column key='name'>Name</Table.Column>
                            <Table.Column key='comment'>Comment</Table.Column>
                            </Table.Header>
                            <Table.Body items={data}>
                            {(o)=>(
                                <Table.Row aria-label={'r-'+Math.random()} key={'r-'+Math.random()}>
                                    <Table.Cell><Button aria-label={'b-'+o.peid} size="xs" className="secondary" css={{width:'100%'}} data-key={o.peid} onClick={actionData}>{o.peid}</Button></Table.Cell>
                                    <Table.Cell>{o.name}</Table.Cell>
                                    <Table.Cell>{o.comment}</Table.Cell>
                                </Table.Row>
                            )}
                            </Table.Body>
                        </Table>
                    </Col>
                </Row>

                <Row className='mt-5'>
                    <Col>
                        <Tabs
                            defaultActiveKey={tabkey}
                            activeKey={tabkey}
                            onSelect={(k) => setKey(k)}                            
                            id="data-query"
                            className="mb-3"
                            justify
                            >
                            <Tab hidden={tabhide} eventKey="visual" title="Visualization">
                                <div style={{width:'100%', minHeight:'600px', border: '1px solid silver'}}>
                                    <div id="canvases" style={{margin: 'auto', width: '100%', textAlign: 'center'}}></div>
                                    <div style={{float:'none', clear:'both', height:'1px'}}></div>
                                </div>                                
                            </Tab>
                            <Tab hidden={tabhide} eventKey="response" title="Response">
                                <div style={{width:'100%', minHeight:'600px', border: '1px solid silver'}}>
                                    <pre>{outResp}</pre>
                                </div>
                            </Tab>
                            <Tab hidden={tabhide} eventKey="request" title="Request Body">
                                <div style={{width:'100%', minHeight:'600px', border: '1px solid silver'}}>
                                    <pre>{outReq}</pre>
                                </div>
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    )
}



