const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    generatedOrderId: { type: String, required: true },
    customerName: { type: String, required: true },
    email: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    orderItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'OrderItem' }],
    paymentMode: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    orderStatus: { type: String, enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Pending' },
    deliveryDetails: {
        address: { type: String },
        state: { type: String },
        city: { type: String },
        postalCode: { type: String },
    },
    paymentIntent: { type: String, required: true },
    clientSecret: { type: String, required: true },
},
    { timestamps: true },
    { versionKey: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;