const express = require("express");
const myProductRoute = express();
myProductRoute.use(express.json());
const myProductController= require('../controllers/myProductController');
const { uploadImage } = require('../utils/helper');
const auth = require("../middlewares/auth");

myProductRoute.post('/add/my-products',uploadImage.single('product_image'),myProductController.addMyProducts);

myProductRoute.get('/get/my-products',myProductController.getMyProduct);

myProductRoute.get('/delete/my-products',auth,myProductController.deleteMyProduct );

myProductRoute.post('/update/my-products', uploadImage.single('product_image'), myProductController.updateMyProduct );

myProductRoute.get('/change/status/my-products',myProductController.changeMyStatus  );

myProductRoute.get('/isSpecial/my-products',myProductController.IsSpecial  );
module.exports=myProductRoute;