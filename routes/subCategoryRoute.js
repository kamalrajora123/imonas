const express = require('express');
const subCategoryRoute = express();
const subCategoryControllerFile = require('../controllers/subCategoryController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
subCategoryRoute.use(express.json());

subCategoryRoute.post('/create-subcategory',helper.uploadImage.single('image'),subCategoryControllerFile.addSubCategory)

subCategoryRoute.get('/get-subcategory',subCategoryControllerFile.findSubCategory )

module.exports = subCategoryRoute;



