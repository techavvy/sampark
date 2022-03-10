//IMPORTING MODULES
require('dotenv').config();
require('./config/db');
const express = require('express');
const path = require('path')
const fs = require('fs');
const app = express();
const PORT = process.env.PORT;
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const http = require('http')
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);

// SOCKET.IO 
io.on('connection', (socket) => {
  console.log('New User Connected...')
})

// LOAD USER MODEL
const User = require('./models/User');

// LOAD MESSAGE MODEL
const Message = require('./models/Message');

// UTIL
const { isObject } = require('util');

// PASSPORT CONFIG FILE IMPORT
require('./config/passport')(passport);

// INITIALIZING APP ENGINE
app.set('view engine', 'ejs');

// EXPRESS BODYPARSER
app.use(express.urlencoded({extended : true}));
app.use(express.json());

// CONNECT-FLASH
app.use(flash());

// STATIC FOLDER
app.use(express.static(path.join(__dirname, '/public')));

// EXPRESS SESSIONS
app.use(session({
    secret : 'savyTechnologies1515',
    resave : true,
    saveUninitialized : true,
    cookie: {
      secure: false,
      maxAge: 3600000 //1 hour
  }
}))

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());

// GLOBAL VARIABLES
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });

// ROUTES
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/articles', require('./routes/articles'));

// LISTENING APP
server.listen(proccess.env.PORT || 5500 , console.log(`SERVER AT ${PORT}`));
