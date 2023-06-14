
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Link, Dropdown, Avatar, Image } from "@nextui-org/react";
import { Next } from "@/data/did"
import useTranslation from 'next-translate/useTranslation';

import {
    faSignOut,
    faIdCard,
    faWallet,
    faComments,
    faQrcode,
    faLockOpen,
    faExclamationCircle,
    faBrush,
    faBell,
    faSignal,
    faUser,
} from "@fortawesome/free-solid-svg-icons";

function HeaderMenu(e) {
    switch(e) {
        case 'wallet':
//            window.location.href = '/orphe/data/viewer'
            break;
        case 'signout':
                sessionStorage.removeItem('token')
                sessionStorage.removeItem('org.did')
                sessionStorage.removeItem('org.name')
                sessionStorage.removeItem('org.auth')
                sessionStorage.removeItem('user.did')
                sessionStorage.removeItem('user.name')
                sessionStorage.removeItem('user.company')
                window.location.href = '/system/signin'
            break;
        default:
            alert(e);
        }
}

function HeaderNotification(e) {
    if (e!='n.a.') alert(e);
}

export default function Header() {

    const { t } = useTranslation('common');

    const [online, setOnline] = useState(true)
    const [color, setColor] = useState('#444444')

    const [user, setUser] = useState({name:'', avatar:''})

    useEffect(()=>{

        let org_name = sessionStorage.getItem('org.name');
        let user_name = sessionStorage.getItem('user.name');

        if (!org_name) org_name = '';
        if (!user_name) user_name = 'Administrator';

        setUser({
            name: org_name + ' ' + user_name,
            avatar: sessionStorage.getItem('avatar'),
        })

        const connected = () => {
                try {
                    Next.System.status()
                    .then((r)=>{
                        setOnline(r && r.label && r.version > '0.3');
                        if (online) {
                            setColor('#00FF00');
                        } else {
                            setColor('#444444');
                        }
                    })
                } catch (e) {
                    setColor('#444444');
                }
            setTimeout(connected, 900000)
        }
        setTimeout(connected, 1000)
    }, []);


    return (
        <>
            <div className="w-100" style={{
                position: 'fixed',
                width: 100+'%',
                top: 0,
                zIndex: 1000,
            }}>
                <nav aria-label="top-menu" className="navbar navbar-expand mb-1 bg-white" style={{
                    height: '60px',
                    borderBottom: "3px inset #EEEEEE",
                    padding: 0,
                    zIndex: 1001,
                }}>
                    <div className="container-fluid" style={{
                        paddingLeft: '20px',
                    }}>
                        <div style={{
                            width: '20%',
                            minWidth: '180px',
                        }}>
                            <a href="/" className="p-2">
                                <img alt="Woollet" width="16%" src="/images/logo/carbon.png" />
                            </a>
                        </div>
                        <div className="d-flex flex-grow-1 title-function text-dark p-1 ps-4"><b>{t('navTitle')}</b></div>
                    </div>

                    <Dropdown aria-label="top-notify">
                        <Dropdown.Button className="bg-white text-dark" id="top-button-notify" aria-label="top-button-notify" solid="solid">
                            <FontAwesomeIcon className="text-dark" icon={faBell} />
                        </Dropdown.Button>
                        <Dropdown.Menu id="menu-notify" aria-label="listNotify" onAction={HeaderNotification}>
                            <Dropdown.Item
                                key="n.a."
                                >No notification</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown aria-label="top-menu-profile">
                        <Dropdown.Button className="bg-white text-dark" id="top-button-profile" aria-label="top-button-profile" solid="solid">
                            <Text b className="me-2" size="sm">{user.name}</Text><FontAwesomeIcon icon={faUser} />
                        </Dropdown.Button>
                        <Dropdown.Menu id="menu-profile" aria-label="listTopMenu" onAction={HeaderMenu}>
                            <Dropdown.Item
                                key="wallet"
                                icon={ <FontAwesomeIcon icon={faWallet} /> }
                                ><Link href='/system/wallet/list'>My Wallet</Link></Dropdown.Item>
                            <Dropdown.Item
                                key="profile"
                                icon={ <FontAwesomeIcon icon={faIdCard} /> }
                                >Profile</Dropdown.Item>
                            <Dropdown.Item
                                key="messenger"
                                icon={ <FontAwesomeIcon icon={faComments} /> }
                                >Messenger</Dropdown.Item>
                            <Dropdown.Item
                                key="scanner"
                                icon={ <FontAwesomeIcon icon={faQrcode} /> }
                                >Scanner</Dropdown.Item>
                            <Dropdown.Item
                                key="Login"
                                icon={ <FontAwesomeIcon icon={faLockOpen} /> }
                                >login</Dropdown.Item>
                            <Dropdown.Item
                                withDivider
                                key="purge"
                                icon={ <FontAwesomeIcon icon={faExclamationCircle} /> }
                                color="error"
                                >Purge all notifications</Dropdown.Item>
                            <Dropdown.Item
                                key="clear"
                                icon={ <FontAwesomeIcon icon={faBrush} /> }
                                color="error"
                                >Clear session</Dropdown.Item>
                            <Dropdown.Item
                                withDivider
                                key="signout"
                                icon={ <FontAwesomeIcon icon={faSignOut} /> }
                                >Signout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                        <FontAwesomeIcon aria-label="TopbarSignal" style={{color: color}} className="me-4" icon={faSignal} />
                </nav>
            </div>
        </>
    )
}