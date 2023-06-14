import express from 'express'
import db from './lib/database';
import { createDidQuery, createKeyQuery, retrieveKeyQuery } from './lib/queryString';
import { Jwk } from "./lib/jwk";

const app: express.Express = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//CORS
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Access-Control-Allow-Headers", "*");
    next();
})

app.listen(8000, () => {
    console.log("Start on port 8000.")
})


/**
 *  input: jwkSet: String
 * 
 *  output: resultJson: Json
 */

app.post('/create_did', async (req, res) => {

    // count dids
    const sqlCount = "select * from dids";

    db.getConnection(function(err, connection){
        connection.query(sqlCount, function(err, result, fields){
            if (err) throw err;
            // create did
            const did: string = `did:example:${result.length+1}`;
            connection.query(createDidQuery(did), 
                function(_err, _result, _fields){
                    if (_err) throw _err;
                    console.log(_result);});
            
                    var keys = new Array();
    
                    // register did into db (複数の鍵) jwk did, kid
                    for (let i=0; i<req.body.keys.length; i++){
                        var key = req.body.keys[i];
                        key["kid"] = `${did}#${i+1}`;
                        connection.query(createKeyQuery(key, `${did}#${i+1}`), 
                            function(err, result, fields){
                            if (err) throw err;
                            console.log(result);
                        });
                        keys.push(key);
                    }
                    
                    return res.json({
                        "id": did,
                        "keys": keys
                    });
    
        });
        connection.release();
    })
})

/**
 *  input: kid: String
 * 
 *  output: resultJson: Json
 */
app.post('/retrieve_key', async (req, res) => {
    // key取得
    const sql = retrieveKeyQuery(req.body.kid);
    db.getConnection(function(err, connection){
        connection.query(sql, function(err, result, fields){
            if (err) throw err;
            if (result.length === 0){
                return res.json({});
            }
            return res.json(JSON.parse(result[0].jwk));
        });
        connection.release();
    })
    
})

