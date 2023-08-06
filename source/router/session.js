const session = require('express-session');

module.exports = session({
    secret: 'insecure-key-replace-in-MC03', 
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } 
});