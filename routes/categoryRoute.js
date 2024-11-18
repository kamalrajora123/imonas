const express = require('express');
const categoryRoute = express();
const categoryControleFile = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
const { uploadImage } = require('../utils/helper');
categoryRoute.use(express.json());

categoryRoute.post('/category/add-category', helper.uploadImage.single("image"), categoryControleFile.addCategories);

categoryRoute.get('/category/find-category', categoryControleFile.findCategories);

categoryRoute.post('/category/delete-category', auth,uploadImage.single("image"), categoryControleFile.deleteCategories);

categoryRoute.post('/category/update-category', auth, helper.uploadImage.single("image"), categoryControleFile.updateCategories);

module.exports = categoryRoute;