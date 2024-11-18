const express = require('express');
const galleryRoute = express();
const galleryController = require('../controllers/galleryController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
galleryRoute.use(express.json());

galleryRoute.post('/add-gallery',helper.uploadImage.single('galleryImage'),galleryController.addGallery)
galleryRoute.get('/view-gallery',galleryController.findGallery)

module.exports = galleryRoute;

