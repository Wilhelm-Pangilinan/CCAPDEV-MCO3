// - Modules
const express = require('express');

// - Routes
const router = express.Router();
const login = require('./router/login-router.js');    
const dashboard = require('./router/dashboard-router.js');    
const profile = require('./router/profile-router.js');    
const laboratory = require('./router/laboratory-router.js');    
const reservation = require('./router/reservation-router.js');    
const technician = require('./router/technician-router.js');    

router.get('/', (req, res) => {
    res.render('login');
});

router.use(login);
router.use(dashboard);
router.use(profile);
router.use(laboratory);
router.use(reservation);
router.use(technician);

module.exports = router;