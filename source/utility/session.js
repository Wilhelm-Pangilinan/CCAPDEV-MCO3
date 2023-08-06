const session = require('express-session');

function validateCookies( req, res, next ) {
    const { cookies } = req;
    if( 'session_id' in cookies ) {
        if( cookies.session_id === '123457') {
            next();
        } else {
            res.status(403).send( { message: "User not authenticated"} );
        } 
    } else {
        res.status(403).send( { message: "User not authenticated"} );
    }
}

module.exports = session({
    secret: 'spicy', 
    cookie: { 
        maxAge: 3 * 7 * 24 * 60 * 60 * 1000 
    },
    resave: false,
    saveUninitialized: true,
});