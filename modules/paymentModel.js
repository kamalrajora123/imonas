const mongoose = require('mongoose');

const paymentOrder = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paymentIntent: {
        type: String,
        required: true
    },
    clientSecret: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        default: 'pending'
    },
},
    { timestamps: true },
    { versionKey: true }
);

module.exports = mongoose.model('payment', paymentOrder);
