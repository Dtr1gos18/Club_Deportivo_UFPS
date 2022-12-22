const express = require("express");
const router = express.Router();
const passport = require("passport");
const helpers = require('../lib/helpers');
const pool = require('../database');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

//registro de usuario
router.get('/signUp', isNotLoggedIn, (req, res) => {
    res.render('auth/registro')
});

router.post('/signUp', isNotLoggedIn, passport.authenticate('local.signUp', {
    successRedirect: '/perfil',
    failureRedirect: '/signUp',
    failureFlash: true
}));

//inicio de sesion
router.get('/signIn', isNotLoggedIn, (req, res) => {
    res.render('auth/iniciosesion')
});

router.post('/signIn', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signIn',{ 
        successRedirect: '/',
        failureRedirect: '/signIn',
        failureFlash: true
    })(req, res, next);
});

//editar perfil
router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('home/perfil')
});

router.post('/perfil', isLoggedIn, passport.authenticate('local.editProfile', {
    successRedirect: '/perfil',
    failureRedirect: '/',
    failureFlash: true
}));

//cerrar sesion
router.get('/logout', isLoggedIn, function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;