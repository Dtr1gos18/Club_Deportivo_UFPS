const express = require("express");
const router = express.Router();

const dbpool = require('../database');

//ruta para listar en la pagina principal
router.get('/', async(req, res) => {
    const noticias = await dbpool.query('SELECT n.id as id, n.titulo as titulo, n.img as img,  n.fecha as fecha, d.nombre as nombreequipo from noticias n join deportes d on(n.tipodeporte = d.id)  order by n.id desc limit 4');
    const eventos = await dbpool.query('SELECT e.id as id, e.nombre as nombre, e.lugar as lugar,  date_format(e.fecha, "%W %d de %M del %Y %r") as fecha, d.nombre as nombreequipo from eventos e join deportes d on(e.tipoevento = d.id)  order by e.fecha desc limit 3');
    res.render('home/principal', {noticias , eventos});
});

module.exports = router;