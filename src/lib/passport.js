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
    try {
        newUser.password = await helpers.encryPassword(password);
        const result = await pool.query('INSERT INTO users SET ?', [newUser]);
        newUser.id = result.insertId;
        return done(null, newUser);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return done(null, false, req.flash('message','El email ya existe'));
        }
    }
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

//editar perfil
passport.use('local.editProfile', new stratieLocal({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const {id} = req.user;
    const { name, lastName } = req.body;
    const newUser = {
        name,
        lastName,
        email,
        password
    };
    try {
        newUser.password = await helpers.encryPassword(password);
        const result = await pool.query('UPDATE users SET ? WHERE id = ?', [newUser, id]);
        newUser.id = result.insertId;
        return done(null, newUser);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return done(null, false, req.flash('message','El email ya existe'));
        }
    }
}));

module.exports = passport;