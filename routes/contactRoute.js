const express = require('express');
const contactRoute = express();
const contactController = require('../controllers/contactController');
contactRoute.use(express.json());

contactRoute.post('/add-contact', contactController.contactControl);

module.exports  = contactRoute