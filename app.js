// - Modules
const express = require('express');
const router = require('./source/router/router.js');
const session = require('./source/router/session.js');

// - MongoDB
const mongoose = require('mongoose/');
const db_url = "mongodb://127.0.0.1/lab-system-db"
const importData = require('./source/models/data/import-data.js');

// - Express application setup
const app = express();
const urlencoded = express.urlencoded({ extended: true });
const port = process.env.SERVER_PORT ?? 3000;

async function startServer() {
    app.set('view engine', 'ejs');          // embedded javascript (EJS) as view engine
    app.set('views', './source/views');     // directory for the views folder
    app.use(express.static('public'));      // looks at 'public' folder for static files

    // - Connect to the database
    await mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("Database connected!");

        // - Import data 
        importData(mongoose).then(() => {
            console.log( "Data import successful!" );
        }).catch((error) => {
            console.error( "Data import failed:", error );
        });
    }).catch((error) => {
        console.log( "Database failed to connect." );
    });

    app.use(session);       // session management
    app.use(router);        // assign routes
    app.listen(port, () => { console.log(`Server is running at port ${port}`); });
}

startServer();