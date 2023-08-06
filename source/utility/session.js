const session = require('express-session');

module.exports = session({
    secret: 'insecure-key-replace-in-MC03', 
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
});