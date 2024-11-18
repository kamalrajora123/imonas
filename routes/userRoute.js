const express = require('express');
const userRoute = express();
const userControllerFile = require('../controllers/userController.js');
const auth = require('../middlewares/auth.js');
const helper = require('../utils/helper');

userRoute.use(express.json());

userRoute.post('/user/login', userControllerFile.userlogin);

userRoute.post('/user/registration', helper.uploadImage.single("image"), userControllerFile.userRegistration);

userRoute.get('/user/getAllUsers', userControllerFile.findUsers);

userRoute.post('/user/update-user', auth, helper.uploadImage.single("image"), userControllerFile.updateUser);

userRoute.get('/user/delete-user', userControllerFile.deleteUser);

userRoute.get('/change-status', userControllerFile.changeStatus);

userRoute.get('/change-features', userControllerFile.updateFeatures);

userRoute.get('/user/authorized-user', auth,userControllerFile.findWho);


module.exports = userRoute;