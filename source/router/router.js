// - Modules
const express = require('express');

// - Routes
const router = express.Router();
const loginRouter = require('./login-router.js');    
const dashboardRouter = require('./dashboard-router.js');    
const profileRouter = require('./profile-router.js');    
const laboratoryRouter = require('./laboratory-router.js');    
const reservationRouter = require('./reservation-router.js');    
const technicianRouter = require('./technician-router.js');    

router.get('/', (req, res) => {
    res.render('login');
});

router.use(loginRouter);
router.use(dashboardRouter);
router.use(profileRouter);
router.use(laboratoryRouter);
router.use(reservationRouter);
router.use(technicianRouter);
module.exports = router;