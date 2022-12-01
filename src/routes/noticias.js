const express = require("express");
const router = express.Router();

const dbpool = require('../database');

router.get('/noticias', (req, res) => {
    res.render('home/noticias')
});

module.exports = router;