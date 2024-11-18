const express = require('express');
const cartRoute = express();
const cartControllerFile = require('../controllers/cartController');
const auth = require('../middlewares/auth');
const helper = require('../utils/helper');
cartRoute.use(express.json());


cartRoute.post('/add-to-cart', auth, cartControllerFile.addToCart);
cartRoute.get('/get-my-cart',auth ,cartControllerFile.getCart);
cartRoute.get('/cart/cart-items-count',auth ,cartControllerFile.getCartCount);
module.exports = cartRoute;