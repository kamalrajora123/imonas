const express = require("express");
const productRoute = express();
productRoute.use(express.json());
const productControleFile = require('../controllers/productController');
const { uploadImage } = require('../utils/helper');
const auth = require("../middlewares/auth");

productRoute.post('/products/add-products', uploadImage.single('image'), productControleFile.addProducts);

productRoute.get('/products/find-products', productControleFile.getProduct);

productRoute.post('/products/delete-products', auth,uploadImage.single('image'), productControleFile.deleteProduct);

productRoute.post('/products/update-products', auth, uploadImage.single('book_image'), productControleFile.updateProduct);

productRoute.get('/product-list-by-categoryId', productControleFile.getProductByCategory);
module.exports = productRoute;