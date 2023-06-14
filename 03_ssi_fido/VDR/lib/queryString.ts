import {Jwk } from "./jwk";

/**
 *  input: did: String
 * 
 *  output: query: String
 */

export function createDidQuery(did: String){
    const sql = `insert into dids VALUES ('${did}')`;
    return sql;
}


/**
 *  input: jwk, kid
 * 
 *  output: query
 */
export function createKeyQuery(jwk: {[field: string]: any}, kid: String){
    const sql = `insert into publicKey VALUES ('${JSON.stringify(jwk)}', '${kid}', '---')`;
    return sql;
}

/**
 *  input: kid
 * 
 *  output: query
 */
export function retrieveKeyQuery(kid: String){
    const sql = `select * from publicKey where kid='${kid}'`;
    return sql;
}