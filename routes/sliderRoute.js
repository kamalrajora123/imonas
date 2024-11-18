const express = require('express');
const sliderRoute = express();
const sliderControllerFile = require('../controllers/sliderController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
sliderRoute.use(express.json());

sliderRoute.post('/slider/add-slider',  helper.uploadImage.single('image'), sliderControllerFile.addSlider);
sliderRoute.get('/slider/slider-list',sliderControllerFile.findSlider);
sliderRoute.get('/slider/change-status',sliderControllerFile.changeStatus);

module.exports = sliderRoute;

