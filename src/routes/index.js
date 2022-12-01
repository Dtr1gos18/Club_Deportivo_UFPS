const express = require("express");
const router = express.Router();

const dbpool = require('../database');

router.get('/home', (req, res) => {
    res.render('home/principal');
});

module.exports = router;