
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Text, Link, Dropdown, Avatar, Image } from "@nextui-org/react";
import { Next } from "@/data/did"

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
} from "@fortawesome/free-solid-svg-icons";

function HeaderMenu(e) {
    switch(e) {
        case 'wallet':
            window.location.href = '/system/wallet/list'
            break;
        default:
            alert(e);
        }
}

function HeaderNotification(e) {
    if (e!='n.a.') alert(e);
}

export default function Header() {

    const [stateUser, setUserState] = useState(true)
    const [online, setOnline] = useState(true)

    const [user, setUser] = useState({name:'', avatar:''})

    useEffect(()=>{

        setTimeout(()=>{ setUserState(false)}, 0)
        setUser({
            name: sessionStorage.getItem('name'),
            avatar: sessionStorage.getItem('avatar'),
        })

        const connected = () => {
                try {
                    Next.System.status()
                    .then((r)=>{
                        // just sample checking, need valid state for confirmation.
    //                    setOnline(r && r.label && r.version > '1');
                        if (document.querySelector('#top-signal')) {
                            document.querySelector('#top-signal').style.color = (r && r.label && r.version > '1') ? '#00FF00':'#444444';
                        }
                    })
                } catch (e) {
                    document.querySelector('#top-signal').style.color = '#444444';
                }
            setTimeout(connected, 60000)
        }
        connected();    
    }, []);


    return (
        <>
            <div className="w-100" style={{
                position: 'fixed',
                width: 100+'%',
                top: 0,
                zIndex: 100,
            }}>
                <nav aria-label="top-menu" className="navbar navbar-expand mb-1 bg-white" style={{
                    height: '50px',
                    borderBottom: "3px inset #EEEEEE",
                    padding: 0,
                }}>
                    <div className="container-fluid" style={{
                        paddingLeft: '20px',
                    }}>
                        <div style={{
                            width: '20%',
                            minWidth: '180px',
                        }}>
                            <Link href="/">
                                <Image alt="Woollet" css={{ width: '70%', }} src="/images/logo/woollet-logo-dark.png" />
                            </Link>
                        </div>
                        <div className="d-flex flex-grow-1 title-function text-dark p-1 ps-4"><b>Woollet core administration system</b></div>
                    </div>


                </nav>
            </div>
        </>
    )
}