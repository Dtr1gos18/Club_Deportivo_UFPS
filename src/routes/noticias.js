const express = require("express");
const router = express.Router();
const path = require('path');
const dbpool = require('../database');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dccazq0sr',
    api_key: '286454994531565',
    api_secret: 'rqxiNLmvxnBtObSBdu1xKqrmIYc'
});
const fs = require('fs-extra');
const { isLoggedIn } = require('../lib/auth');

//ruta para mostrar el form de agregar noticias
router.get('/agregar', isLoggedIn,async(req, res) => {
    const deporte = await dbpool.query('SELECT * FROM deportes') 
    res.render('noticias/agregar',  {deporte});
});

//ruta para guardar los nuevos deportes
router.post('/agregarDeporte', async(req, res) => {
    const { nombre } = req.body;
    const newDeporte = {
        nombre
    };
    await dbpool.query('INSERT INTO deportes set ?', [newDeporte]);
    req.flash('success', 'Deporte agregado correctamente');
    res.redirect('/noticias/agregar');
});

//ruta para guardar las nuevas noticias
router.post('/agregar', async(req, res) => {
    const { titulo, descripcion, tipodeporte, fecha } = req.body;
    const resultado = await cloudinary.v2.uploader.upload(req.file.path);
    const newImgNoticia = {
        titulo,
        descripcion,
        img: resultado.url, 
        tipodeporte,
        fecha
    };
    await dbpool.query('INSERT INTO noticias set ?', [newImgNoticia]);
    fs.unlink(req.file.path);
    req.flash('success', 'Noticia agregada correctamente');
    res.redirect('/noticias');
});

//ruta para listar las noticias
router.get('/', async(req, res) => {
    const noticias = await dbpool.query('SELECT n.id as id, n.titulo as titulo, n.img as img,  n.fecha as fecha, d.nombre as nombreequipo from noticias n join deportes d on(n.tipodeporte = d.id)  order by n.id desc'); 
    res.render('noticias/listar', {noticias});
});

//ruta para mostrar el form de editar noticias
router.get('/mostrar/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const deporte = await dbpool.query('SELECT * FROM deportes')
    const noticia = await dbpool.query('SELECT * FROM noticias WHERE id = ?', [id]);
    console.log(noticia[0]);
    res.render('noticias/editar', {noticia: noticia[0], deporte});
});

//ruta para actualizar las noticias
router.post('/editar/:id', async(req, res) => {
    const { id } = req.params;
    const resultado = await cloudinary.v2.uploader.upload(req.file.path);
    const { titulo, descripcion, tipodeporte, fecha } = req.body;
    const newImgNoticia = {
        titulo,
        descripcion,
        img: resultado.url,
        tipodeporte,
        fecha
    };
    await dbpool.query('UPDATE noticias set ? WHERE id = ?', [newImgNoticia, id]);
    fs.unlink(req.file.path);
    req.flash('success', 'Noticia actualizada correctamente');
    res.redirect('/noticias');
});

//ruta para eliminar las noticias
router.get('/eliminar/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    await dbpool.query('DELETE FROM noticias WHERE id = ?', [id]);
    req.flash('success', 'Noticia eliminada correctamente');
    res.redirect('/noticias'); 
});

//mostar noticia completa
router.get('/mostrarNoticia/:id', async(req, res) => {
    const { id } = req.params;
    const noticia = await dbpool.query('SELECT n.id as id, n.titulo as titulo, n.img as img, n.descripcion as descripcion, n.fecha as fecha, d.nombre as nombreequipo from noticias n join deportes d on(n.tipodeporte = d.id) WHERE n.id = ?', [id]);
    res.render('noticias/noticiaCompleta', {noticia: noticia[0]});
});


module.exports = router;