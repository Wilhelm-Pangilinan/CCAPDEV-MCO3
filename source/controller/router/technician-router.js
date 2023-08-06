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
    res.render('technician');
});

module.exports = technicianRouter;