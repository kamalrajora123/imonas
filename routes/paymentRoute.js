const express = require("express");
const { paymentOrder , updatePaymentStatus} = require("../controllers/paymentController");
const paymentRoute = express();
const auth = require('../middlewares/auth')

paymentRoute.post('/create-payment-intent', auth, paymentOrder);

paymentRoute.post('/update-payment-status', auth, updatePaymentStatus);

module.exports = paymentRoute;