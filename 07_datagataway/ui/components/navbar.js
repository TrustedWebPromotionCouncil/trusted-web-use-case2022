
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Collapse, Container, Row, Col, Text, Table, Link, Badge, Card } from '@nextui-org/react';
import { Dropdown } from "@nextui-org/react";
import {
    faUser,
    faUsers,
    faUserCheck,
    faMoneyBill,
    faMoneyBillTransfer,
    faDatabase,
    faChartLine,
    faChartPie,
    faLink,
    faWallet,
    faHistory,
    faQrcode,
    faList,
    faServer,
    faMessage,
    faBell,
    faEdit,
    faLanguage,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import useTranslation from 'next-translate/useTranslation';


export default function NavbarLeft() {

    const { t, lang } = useTranslation('common');
    const router = useRouter();


    const [ user, setUser ] = useState({name:'', avatar:'', type:'', version:''})
//    const [ m, setM ] = useState(router.query["menu"])
    const [ menu, setMenu ] = useState('')
    const [ route, setRoute ] = useState(router.route.split('/')[1])


    useEffect(()=>{
        setUser({
            name: sessionStorage.getItem('name'),
            type: sessionStorage.getItem('type'),
            avatar: sessionStorage.getItem('avatar'),
            version: sessionStorage.getItem('version'),
        })
//        setMenu( m ? '?menu='+m: '')
    }, [])

    function NavSwitchLang(e) {
        const pp = window.location.pathname.split('/');
        if (pp[1].length!=2) {
            window.location = '/'+e+window.location.pathname;
        } else if (['en', 'jp'].includes(pp[1])) {
            pp[1] = e
            window.location.href = pp.join('/');
        } else if (!['en', 'jp'].includes(pp[1])) {
            pp[1] = e
            window.location.href = pp.join('/');
        }
//        alert(e);
    }

/*
    const ICONS = {
        'faUser': faUser,
        'faUsers': faUsers,
        'faMoneyBill': faMoneyBill,
        'faDatabase': faDatabase,
        'faChartLine': faChartLine,
        'faChartPie': faChartPie,
        'faWallet': faWallet,
        'faHistory': faHistory,
        'faLink': faLink,
        'faList': faList,
        'faBell': faBell,
        'faEdit': faEdit,
        'faQrcode': faQrcode,
        'faServer': faServer,
        'faMessage': faMessage,
        'faUserCheck': faUserCheck,
        'faMoneyBillTransfer': faMoneyBillTransfer,
    }
*/
    return (
        <Container className="ms-0 ps-0" css={{position:'fixed', maxHeight:'75%', width: '230px'}}>
            <Container className="ps-0 pb-2">
                <Card css={{backgroundColor: '$accents2'}}>
                    <center><Text><b>{user.type}</b> : 0.96</Text></center>
                </Card>
            </Container>
            <Container className="p-0">

            <Row key="co2-member" className="p-2 ps-0">
                <Col css={{paddingLeft:0, paddingTop: 10, fontSize: '90%', fontWeight: 'bold', borderRadius: '10px'}}>
                    <a style={{fontSize: '110%', color: 'black'}}>Member Admin</a>
                </Col>
            </Row>
                <Row key="co2-member-list" className="pb-1">
                    <Col css={{paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/member/list' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/member/list"} style={{color: '#131d54', paddingLeft: 0}}>List</a>
                    </Col>
                </Row>
                <Row key="co2-member-conn" className="pb-1">
                    <Col css={{paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/member/conn' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/member/conn"} style={{color: '#131d54', paddingLeft: 0}}>Connections</a>
                    </Col>
                </Row>

            <Row key="co2-supplychain" className="p-2 ps-0">
                <Col style={{paddingLeft:0, paddingTop: 10, fontSize: '90%', fontWeight: 'bold', borderRadius: '10px'}}>
                    <a style={{fontSize: '110%', color: 'black'}}>Supply Chain</a>
                </Col>
            </Row>
                <Row key="co2-supplychain-relation" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/supplychain/relation' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/supplychain/relation"} className="ps-0" style={{color: '#131d54'}}>Relationship</a>
                    </Col>
                </Row>
                <Row key="co2-supplychain-list" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/supplychain/list' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/supplychain/list"} className="ps-0" style={{color: '#131d54'}}>List</a>
                    </Col>
                </Row>
                <Row key="co2-supplychain-signup" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/supplychain/signup' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/supplychain/signup"} className="ps-0" style={{color: '#131d54'}}>Sign-up</a>
                    </Col>
                </Row>
            <Row key="co2-data" className="p-2 ps-0">
                <Col css={{paddingTop: 10, fontSize: '90%', fontWeight: 'bold',borderRadius: '10px'}}>
                    <a className="text-black" css={{fontSize: '110%'}}>Data</a>
                </Col>
            </Row>
                <Row key="co2-data-list" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/data/list' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/data/list"} className="ps-0" style={{color: '#131d54'}}>List</a>
                    </Col>
                </Row>
                <Row key="co2-data-type" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/data/type' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/data/type"} className="ps-0" style={{color: '#131d54'}}>Type</a>
                    </Col>
                </Row>
                <Row key="co2-data-request" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/data/request' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/data/request"} className="ps-0" style={{color: '#131d54'}}>Request</a>
                    </Col>
                </Row>
                <Row key="co2-data-viewer" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/data/viewer' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/data/viewer"} className="ps-0" style={{color: '#131d54'}}>Viewer</a>
                    </Col>
                </Row>
            <Row key="co2-system" className="p-2 ps-0">
                <Col css={{paddingTop: 10, fontSize: '90%', fontWeight: 'bold', borderRadius: '10px'}}>
                    <a className="text-black" style={{fontSize: '110%'}}>System</a>
                </Col>
            </Row>
                <Row key="co2-system-dashboard" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/dashboard' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/dashboard"} className="ps-0" style={{color: '#131d54'}}>Dashboard</a>
                    </Col>
                </Row>
                <Row key="co2-system-points" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/points' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/points"} className="ps-0" style={{color: '#131d54'}}>Points</a>
                    </Col>
                </Row>

                <Row key="co2-system-profile" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/profile' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/profile"} className="ps-0" style={{color: '#131d54'}}>Profile</a>
                    </Col>
                </Row>
                <Row key="co2-system-config" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/configs' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/configs"} className="ps-0" style={{color: '#131d54'}}>Configurations</a>
                    </Col>
                </Row>
                <Row key="co2-system-schema" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/schema' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/schema"} className="ps-0" style={{color: '#131d54'}}>Schema</a>
                    </Col>
                </Row>
                <Row key="co2-system-envelopes" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/envelopes' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/data/envelopes"} className="ps-0" style={{color: '#131d54'}}>Envelopes</a>
                    </Col>
                </Row>
                <Row key="co2-system-wallet" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/wallet' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/wallet"} className="ps-0" style={{color: '#131d54'}}>Wallet</a>
                    </Col>
                </Row>                
                <Row key="co2-system-signin" className="pb-1">
                    <Col css={{ paddingLeft:10, paddingBottom:0, fontSize: '90%', borderRadius: '10px', backgroundColor: (window.location.pathname == '/'+lang+'/system/envelopes' ? '$accents5': 'white')}}>
                        <a href={'/'+lang+"/system/signin"} className="ps-0" style={{color: '#131d54'}}>Sign-in</a>
                    </Col>
                </Row>

            </Container>


        <Container className="ps-0" css={{ position: 'fixed', bottom: 0, paddingBottom: '30px', }} gap={2}>
            <Row className="pb-3">
                <Dropdown id="nav-lang">
                    <Dropdown.Button className="bg-white text-dark" solid="solid">
                        <FontAwesomeIcon className="text-dark" icon={faLanguage} /> &nbsp;&nbsp;Language
                    </Dropdown.Button>
                    <Dropdown.Menu id="menu-notify" aria-label="listLang" onAction={NavSwitchLang}>
                    <Dropdown.Item aria-label={'x'+Math.random()} key="en">English</Dropdown.Item>
                    <Dropdown.Item aria-label={'x'+Math.random()} key="jp">Japanese</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </Row>
            <Row className="pb-2">
                <Text small>Copyright © 2019-2023</Text>
            </Row>
            <Row className="pb-3">
                <Text small>DataGateway Pte. Ltd.</Text>
            </Row>
        </Container>
        </Container>

    )
}