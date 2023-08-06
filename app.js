/*|*******************************************************

                MC03: LAB RESERVATION SYSTEM
                 CCAPDEV - S13 | AY22-23 T3

    Created By:
        1 - Sebastien Michael V. Dela Cruz
        2 - Wilhelm Vincent S. Pangilinan
        3 - Dominic Marcus Herceve
                        
*********************************************************/
// - dotenv
const dotenv = require('dotenv');
dotenv.config();

// - Express
const express = require('express');
const app = express();
const port = process.env.PORT;

// - Mongoose
const mongoose = require('mongoose/');
const db_url = process.env.MONGODB_URI;

// - Modules
const router = require('./source/controller/router.js');
const session = require('./source/utility/session.js');
const database = require('./source/utility/database.js');

async function startServer() {
    app.set('view engine', 'ejs');          // embedded javascript (EJS) as view engine
    app.set('views', './source/views');     // directory for the views folder
    app.use(express.static('public'));      // looks at 'public' folder for static files
    app.use(express.json());                // parse request body as json

    await database.connect( mongoose, db_url );     // connect or create the database 
    await database.importData();                    // import data from utility/data.json

    app.use(session);       // session management
    app.use(router);        // assign routes
    app.listen(port, () => { console.log(`Server is running at port ${port}`); });
}

startServer();