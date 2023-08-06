// - Modules
const express = require('express');

// - Models
const Laboratory = require('../../models/Laboratory');

// - Express
const laboratoryRouter = express.Router();
const urlencoded = express.urlencoded;
laboratoryRouter.use( urlencoded({extended:true}) );

// - GET route for rendering the laboratory page
laboratoryRouter.get('/laboratory', async (req, res) => {

    // - Redirect to login page if the student is not found in the session
    if( !req.session.authorized ) {
        return res.status(401).redirect('/login'); 
    }

    try {
        // - Retrieve all laboratory documents
        const laboratoriesData = await Laboratory.find({});
        res.render( 'laboratory', { laboratories: laboratoriesData });

    } catch( error ) {
        console.error( "Error retrieving the laboratory documents:", error );
    }
});

module.exports = laboratoryRouter;