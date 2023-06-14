
import Link from 'next/link'
import { useEffect, useState } from 'react';
import { Container } from '@nextui-org/react';
import { Time } from '@/data/woollet'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmarksLines } from "@fortawesome/free-solid-svg-icons";

export default function FourOhFour() {

    const [path, setPath] = useState('')
    const [time, setTime] = useState('')
    const [hidden, setHidden] = useState(true)
    
    useEffect(()=>{
        setPath(window.location.pathname)
        setTime(Time.now())
        setTimeout(()=>{
            setHidden(false);
        }, 100);
    }, [])

    return (
        <Container hidden={hidden}>
            <h2 className="mt-5 mb-5">
                <FontAwesomeIcon style={{ width:'2em', marginLeft: '-13px' }} icon={ faXmarksLines } />
                404 - Oops, we're lost!
            </h2>
            <div className="row">
                <div className="col-1">URL:</div>
                <div className="col-11">{path}</div>
            </div>
            <div className="row">
                <div className="col-1">Time:</div>
                <div className="col-11">{time}</div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <Link href="/" className="pt-5 text-primary">
                        Go back home
                    </Link>
                </div>
            </div>
        </Container>
    )
}