const mysql = require("mysql");
const {promisify} = require('util');

const {database} = require('./keys');


const pool = mysql.createPool(database);

pool.getConnection((err, conn) => {
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('DATABASE CONNECTION WAS CLOSED');
        }
        if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DATABASE HAS TO MANY CONNECTIONS');
        }
        if(err.code === 'ECONNREFUSED'){
            console.log('DATABASE CONNEECTION WAS REFUSED');
        }
    }
    if(conn) conn.release();
    console.log('DB IS CONNECTED');
    return;
});

//convertimos a promesas lo que antes eran callbacks
pool.query = promisify(pool.query);

module.exports = pool;