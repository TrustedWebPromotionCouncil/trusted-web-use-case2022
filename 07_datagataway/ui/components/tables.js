

import { Card, Table, Text, Row, Col, Tooltip, Loading } from '@nextui-org/react';
import {  } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useState from '@nextui-org/react';
import { Time } from '@/data/woollet';


export function o2a(o) {
    let r = [];
    for (const i in o) {
        r.push({key: i, value: o[i]})
    }
    return r;
}


export function TableKeyValue ({ name, items, time, render }) {
    const max = 20;
    return (
        <>
        <Card>
            <Card.Body>
                <Row>
                    <Col><Text h4 >{name}</Text></Col>
                    <Col css={{textAlign: 'right'}}><Text h6 i>{time}</Text></Col>
                </Row>
                <Table
                    compact
                    striped
                    sticked
                    aria-label={name} 
                    css={{
                        minWidth: "100%",
                        minWidth: "70%",
                        fontSize: '90%',
                        }}>
                <Table.Header>
                    <Table.Column width={300}>Key</Table.Column>
                    <Table.Column>Value</Table.Column>
                </Table.Header>
                <Table.Body items={items}>
                    {(item) => {
                        return (
                            <Table.Row key={item.key}>
                            <Table.Cell aria-label={item.key}>
                                <b>{item.key}</b>
                            </Table.Cell>
                            <Table.Cell>
                                { render ? render(item, item.value, name) : item.value }
                            </Table.Cell>
                            </Table.Row>
                        )
                    }}
                </Table.Body>
                {items.length > {max} &&
                <Table.Pagination
                shadow
                noMargin
                align="center"
                rowsPerPage={max}
                onPageChange={(page) => console.log({ page })}
                />

                }
            </Table>
            </Card.Body>
        </Card>
        </>
    )    
}



export class DataTables {

    name = '';
    _length = 10;
    _data = [];
    _cols = [];
    _dt = null;
    callback = {
      'draw': null
    }

    constructor (n) {
        this.name = n;
        this._cols = [];
    }

    on(e, fx) {
      if (typeof(fx)=='function') {
        this.callback[e] = fx
      }
    }

    col(id, title, cls='small', render=null, create=null) {
        const o = {data: id, title: title, sClass: cls, render:null, create:null}
        if (render) {
            o.render = render;
        } else if (create) {
            o.createdCell = create;
        }
        this._cols.push(o)
    }

    data(o) {
        this._data = o;
    }

    render() {
        this._dt = new DataTable('#table-'+this.name, {
            pageLength: this._length,
            destroy: true,
            data: this._data,
            columns: this._cols,
            drawCallback: ()=>{
              setTimeout(()=>{ this.callback.draw() }, 500)
            }
          }); 
    }

}


export function TableData({title, name, time=Time.now(), hideLoading=false}) {

    return(
        <Card>
            <Card.Body>
                <Row>
                    <Col span={8}>
                    {title.length>20 ?
                    (
                        <Text>{title}</Text>

                    ) : title.length>0 ? (
                        <Text h4 >{title}</Text>
                    ):(
                        ""
                    )}
                    </Col>
                    <Col span={4} css={{textAlign: 'right'}}><Text h6 i>{time}</Text></Col>
                </Row>        
                <table id={'table-'+name} className="table table-striped display compact stripe w-100"></table>
                <Row hidden={hideLoading} justify="center" className="mt-5">
                    Loading data ... <Loading/>
                </Row>
            </Card.Body>
        </Card>
    )
}


export function TableGeneric({ name, items, time, cols, render, loading=true }) {

    let hideLoading = false

    const max = 20;
    let err = '';
    let loaded = false;

    if (!Array.isArray(items)) {
        err = items;
        try { err = JSON.stringify(err, null, 4)} catch (e) { }
        const nil = {}
        for (const i of cols) {
            nil[i.key] = ''
        }
        nil.key = 'Invalid data: ' + err;        
        items = [nil];
        hideLoading = true;
    }

    if (items.length < 1) {
        const nil = {}
        for (const i of cols) {
            nil[i.key] = ''
        }
        nil.key = 'No data'
        items = [nil];
        if (loaded || !loading) {
            hideLoading = true;
        } else {
            loaded = true;
        }
    } else {
        hideLoading = true;
    }

    return(

        <Card>
            <Card.Body>
                <Row>
                    {name.length>20 ?
                    (
                        <Col span={8}><Text>{name}</Text></Col>

                    ) : name.length>0 ? (
                        <Col span={8}><Text h4 >{name}</Text></Col>                
                    ):(
                        ''
                    )}
                    <Col span={4} css={{textAlign: 'right'}}><Text h6 i>{time}</Text></Col>
                </Row>          
                <Table
                    striped
                    aria-label={name}
                    css={{
                        maxWidth: "100%",
                        minWidth: "70%",
                        fontSize: '90%',
                        }}>
                    <Table.Header columns={cols}>
                    {(col) => (
                        <Table.Column id={'col-'+col.key} key={col.key}>{col.label}</Table.Column>
                    )}
                    </Table.Header>
                    <Table.Body items={items}>
                    {(item) => (
                        <Table.Row className="trow" key={item.key}>
                        {(k) => { return (
                            <Table.Cell key={'cell-'+item.key+'-'+k}>
                            { render ? render(item, k, name) : item[k] }
                            </Table.Cell>
                        )}}
                        </Table.Row>
                    )}
                    </Table.Body>
                    {{items}.length > {max} &&
                        <Table.Pagination
                            shadow
                            noMargin
                            align="center"
                            rowsPerPage={max}
                            onPageChange={(page) => console.log({ page })}
                        />
                    }
                </Table>
                <Row hidden={hideLoading} justify="center" className="mt-5">
                    Loading data ... <Loading/>
                </Row>

            </Card.Body>
        </Card>
    )    
}


