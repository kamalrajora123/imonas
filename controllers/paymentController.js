const paymentModel = require('../modules/paymentModel');
const cartModel = require('../modules/cartModel');
const orderid=require('order-id')("key");
const Order = require('../modules/orderModel');
const OrderItem = require('../modules/orderItemModel');
const stripe = require('stripe')('sk_test_51Q51C9FGVuv3Ll7rRqCzKcd82GryoxEm5m5o7oITz1e83aJKqmIePuCe8wzxMaEL64Y7XQ65v3igLPuCqiHa4tJW00Fsslgr5M');

module.exports.paymentOrder = async (req, res) => {

    try {
        const { _id } = req.userInfo;

        const { totalAmount } = req.body;

        if (!totalAmount) {
            res.status(200).send({
                success: false,
                message: "Please provide Total amount of Product."
            });

            return;
        }

        const paymentIntents = await stripe.paymentIntents.create({
            amount: totalAmount, // Amount in cents
            currency: 'INR',
        });
        const clientSecret = paymentIntents.client_secret
        const paymentIntent = paymentIntents.id

        const makePayment = paymentModel({
            clientSecret: clientSecret,
            paymentIntent: paymentIntent,
            paymentStatus: "pending",
            userId: _id,
            totalAmount: totalAmount
        });

        const savedOrder = await makePayment.save();

        res.json({ clientSecret: paymentIntents.client_secret });
        // res.status(200).send({
        //     success: true,
        //     message: "Order added successfully",
        //     data: savedOrder,
        // });
    } catch (error) {
        console.error("Error in paymentOrder function:", error);
        res.status(400).send({
            success: false,
            message: "Error in paymentOrder function",
            error,
        });
    }
};

module.exports.updatePaymentStatus = async (req, res) => {

    try {
        const { name, email, _id } = req.userInfo;
        const { paymentIntent, clientSecret, paymentStatus, totalAmount, paymentMode, orderItems, deliveryDetails } = req.body;

        // console.log("req.body" , req.body);
        // return false
        

        if (!paymentIntent) {
            res.status(200).send({
                success: false,
                message: "please Provide payment intent."
            });
            return;
        }

        const findPayment = await paymentModel.findOne({ paymentIntent })

        if (findPayment) {

            const updatePaymentStatus = await paymentModel.updateOne({ paymentIntent }, { $set: { paymentStatus: paymentStatus, updatedAt: new Date() } })

            const findUpdatedPayment = await paymentModel.findOne({ paymentIntent: paymentIntent });

            const findcart = await cartModel.find({ userId: findPayment.userId });

            // console.log(findcart);
            const id = orderid.generate();

            const orderItemIds = [];
            for (const cur of orderItems) {
                const createOrderItem = new OrderItem({
                    orderId: cur._id,
                    productId: cur.productsId._id,
                    quantity: cur.quantity,
                    price: cur.productsId.price * cur.quantity,
                    productName: cur.productsId.product_name,
                });
                const savedOrderItem = await createOrderItem.save();
                orderItemIds.push(savedOrderItem._id);
            }

            const createOrder = new Order({
                generatedOrderId: id,
                orderItems: orderItemIds,
                customerName: name,
                email: email,
                totalAmount: totalAmount,
                paymentMode: paymentMode,
                userId: _id,
                deliveryDetails: deliveryDetails,
                paymentIntent: paymentIntent,
                clientSecret: clientSecret
            });

            const savedOrder = await createOrder.save();
            res.status(200).send({
                success: true,
                message: "Order added successfully",
                data: savedOrder._id,
            });
        } else {
            res.status(404).send({
                success: false,
                message: "Order Not Found."
            });
        }
    } catch (error) {
        console.error("Error in updatePaymentStatus function:", error);
        res.status(400).send({
            success: false,
            message: "Error in updatePaymentStatus function",
            error,
        });
    }
};