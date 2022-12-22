// este archivo sirve para almacenar palabras claves para usar en el servicio, numero puerto, conexion base de datos, contraseña, direccion donde se encuantra la base de datos, etc.
const {
    DB_DATABASE,
    DB_HOST,
    DB_PASSWORD,
    DB_PORT,
    DB_USER,
} = require ("./config");

module.exports = {
    database:{
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
        port: DB_PORT
    }
}