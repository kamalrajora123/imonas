const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    productName: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
},
    { timestamps: true },
    { versionKey: true });

const OrderItem = mongoose.model('OrderItem', orderItemSchema);
module.exports = OrderItem;