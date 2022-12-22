const passport = require('passport');
const stratieLocal = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

//registro de usuario
passport.use('local.signUp', new stratieLocal({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const { name, lastName } = req.body;
    const newUser = {
        name,
        lastName,
        email,
        password
    };
    newUser.password = await helpers.encryPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);
});

//Inicio de sesion
passport.use('local.signIn', new stratieLocal({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const result = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (result.length > 0) {
        const user = result[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success','Bienvenido ' + user.name));
        } else {
            done(null, false, req.flash('message','Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message','El email no existe'));
    }
}));


module.exports = passport;