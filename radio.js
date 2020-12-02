const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const radio = express();


radio.set('views', path.join(__dirname, 'views'));

radio.use(bodyParser.json());
radio.use(bodyParser.urlencoded({ extended: true }));
radio.use(cookieParser());

radio.use(session({ //konfiguracja sesji
    secret: 'radio_form',
    resave: false,
    saveUninitialized: true,
    cookie: {}
}));

radio.use('/', routes);
module.exports = radio;
