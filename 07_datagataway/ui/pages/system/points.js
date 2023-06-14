
import { TableKeyValue } from '@/components/tables';
import { Woollet } from '@/data/woollet'
import { Did } from '@/data/did'
import { useState, useEffect } from 'react'
import { Container, Row, Col, Text, Loading, Spacer } from "@nextui-org/react";



export default function Page() {
    
    const [items, setItems] = useState([])
    const [time, setTime] = useState((new Date()).toString())
    const [title, setTitle] = useState('Points')
    const [isLoading, setLoading] = useState(true)

    useEffect(()=>{
        Did.Crypto.meta2()
            .then((r)=>{
                r.data.meta_data.name = 'Carbon Credit'
                r.data.meta_data.symbol = 'CO2C'
                r.data.meta_data.base = 'ASTR'
                return Woollet.key_values(r.data.meta_data)
            })
            .then((r)=>{
                setItems(r);
                setLoading(false)
            })
    }, [])

    if (isLoading) return (
        <Container className="pt-5">
            <Row>
                <Col span={12}>
                    <center>
                        <Text>Loading Points information</Text>
                    </center>
                    <Spacer />
                    <center>
                        <Loading />
                    </center>
                </Col>
            </Row>
        </Container>
    )

    return (
        <TableKeyValue name={title} items={items} time={time} />
    )
}

//Page.getInitialProps = async (x) => {
    
//    const w = new Woollet('Points')
//    w.is_not_standard_woollet_obj = true;
//    w.data = await Did.Crypto.meta()
//    w.path = w.data.data
//    w.extract_key_values()
//
//    return { data: w.output() }
//    return { oo: await WoolletPost('cryptos/meta') }
//}
