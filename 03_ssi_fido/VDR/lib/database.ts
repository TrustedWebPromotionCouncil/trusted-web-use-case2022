import mysql from 'mysql';
/**
 *  mysql -u root -p
 *  create database VDR;
 *  use VDR;
 *  create table dids (did varchar(50));
 *  create table publicKey (jwk JSON DEFAULT NULL, kid varchar(60), keyString varchar(1000));
 * 
 */



const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'password',
  database: 'VDR'
});

export default db;