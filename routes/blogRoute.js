const express = require('express');
const blogRoute = express();
const blogController = require('../controllers/blogController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
blogRoute.use(express.json());


blogRoute.post('/add-blog',blogController.addBlog)
blogRoute.get('/view-blog',blogController.findBlog)

module.exports = blogRoute;