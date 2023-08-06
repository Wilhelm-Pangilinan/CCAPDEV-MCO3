// - Modules
const express = require('express');
const technicianRouter = express.Router();

// - Models
const Student = require('../../models/Student');
const Laboratory = require('../../models/Laboratory');
const Reservation = require('../../models/Reservation');
const Technician = require('../../models/Technician');

// - Express
const urlencoded = express.urlencoded;
technicianRouter.use( urlencoded({extended:true}) );

technicianRouter.get('/technician', async (req, res) => {
    try {
        // - Redirect to login page if the technician is not found in the session
        if( !req.session.authorized ) {
            return res.status(401).redirect('/login'); 
        } else if( !req.session.technician ) {
            return res.status(401).redirect('/login'); 
        }        

        res.render('technician');
    } catch( error ) {
        console.log( error );
        res.status(500).render('login');
    }
});

module.exports = technicianRouter;