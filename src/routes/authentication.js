const express = require("express");
const router = express.Router();

const passport = require("passport");
const { isLoggedIn } = require('../lib/auth');


router.get('/signUp', (req, res) => {
    res.render('auth/registro')
});

router.post('/signUp', passport.authenticate('local.signUp', {
    successRedirect: '/perfil',
    failureRedirect: '/signUp',
    failureFlash: true
}));

//inicio de sesion
router.get('/signIn', (req, res) => {
    res.render('auth/iniciosesion')
});

router.post('/signIn', (req, res, next) => {
    passport.authenticate('local.signIn',{ 
        successRedirect: '/home',
        failureRedirect: '/signIn',
        failureFlash: true
    })(req, res, next);
});

router.get('/perfil', isLoggedIn, (req, res) => {
    res.render('home/perfil')
});

router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/home');
    });
});

module.exports = router;