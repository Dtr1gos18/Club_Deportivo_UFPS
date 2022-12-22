const express = require("express");
const router = express.Router();
const dbpool = require('../database');
const fs = require('fs-extra');
const { isLoggedIn } = require('../lib/auth');

//ruta para mostrar el form de agregar eventos
router.get('/agregar', isLoggedIn,async(req, res) => {
    const deporte = await dbpool.query('SELECT * FROM deportes') 
    res.render('calendario/agregar',  {deporte});
});

//ruta para guardar los nuevos tipos
router.post('/agregarDeporte', async(req, res) => {
    const { nombre } = req.body;
    const newDeporte = {
        nombre
    };
    await dbpool.query('INSERT INTO deportes set ?', [newDeporte]);
    req.flash('success', 'Tipo agregado correctamente');
    res.redirect('/calendario/agregar');
});

//ruta para guardar los nuevos eventos
router.post('/agregar', async(req, res) => {
    const { nombre, lugar, descripcion, tipoevento, fecha } = req.body;
    const newEvento = {
        nombre,
        lugar,
        descripcion,
        tipoevento,
        fecha
    };
    await dbpool.query('INSERT INTO eventos set ?', [newEvento]);
    req.flash('success', 'Evento agregado correctamente');
    res.redirect('/calendario');
});

//ruta para listar los eventos
router.get('/', async(req, res) => {
    const eventos = await dbpool.query('SELECT e.id as id, e.nombre as nombre, e.lugar as lugar,  date_format(e.fecha, "%W %d de %M del %Y %r") as fecha, d.nombre as nombreequipo from eventos e join deportes d on(e.tipoevento = d.id)  order by e.fecha desc'); 
    res.render('calendario/listar', {eventos});
});

//ruta para mostrar el form de editar eventos
router.get('/mostrar/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    const deporte = await dbpool.query('SELECT * FROM deportes')
    const evento = await dbpool.query('SELECT * FROM eventos WHERE id = ?', [id]);
    res.render('calendario/editar', {evento: evento[0], deporte});
});

//ruta para actualizar los eventos
router.post('/editar/:id', async(req, res) => {
    const { id } = req.params;
    const { nombre, lugar, descripcion, tipoevento, fecha } = req.body;
    const newEvento = {
        nombre,
        lugar,
        descripcion,
        tipoevento,
        fecha
    };
    await dbpool.query('UPDATE eventos set ? WHERE id = ?', [newEvento, id]);
    req.flash('success', 'Evento actualizado correctamente');
    res.redirect('/calendario');
});

//ruta para eliminar las noticias
router.get('/eliminar/:id', isLoggedIn, async(req, res) => {
    const { id } = req.params;
    await dbpool.query('DELETE FROM eventos WHERE id = ?', [id]);
    req.flash('success', 'Evento eliminado correctamente');
    res.redirect('/calendario'); 
});

module.exports = router;