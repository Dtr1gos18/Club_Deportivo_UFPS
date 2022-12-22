const express = require("express");
const morgan = require("morgan");
const hbs = require("express-handlebars");
const path = require("path");
const flash = require("connect-flash");
const session = require("express-session");
const mySqlStore = require("express-mysql-session")(session);
const passport = require("passport");
const multer = require("multer");
const { PORT } = require ("./config.js");

const {database} = require('./keys');

// initializations
const app = express();
require("./lib/passport");

// settings
app.set('views', path.join(__dirname, 'views'));
app.engine('.handlebars', hbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    exname: '.handlebars',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.handlebars');

// middlewares
app.use(session({   
    secret: 'cluddeportivosession',
    resave: false,
    saveUninitialized: false,
    store: new mySqlStore(database)
}));
app.use(morgan("dev"));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const almacenar = multer.diskStorage({
    destination: path.join(__dirname, 'public/img/imgNoticias'),
    filename: (req, file, cb) => {
        cb(null, new Date().getTime() + path.extname(file.originalname));
    }
});
app.use(multer({storage: almacenar}).single('img'));

app.use(passport.initialize());
app.use(passport.session());


//global variables
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

// routes
app.use(require("./routes/index"));
app.use(require("./routes/authentication"));
app.use('/noticias', require("./routes/noticias"));
app.use('/calendario', require("./routes/eventos"));

// public
app.use(express.static(__dirname + '/public'))

// starting the server
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});

