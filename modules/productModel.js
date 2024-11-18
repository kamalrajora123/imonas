const mongoose = require('mongoose');

const productModel = mongoose.Schema(

    {
        product_name: {
            type: String,
            required: [true, "Please Enter Product's Name "],
            trim: true,
        },
        image: {
            type:String,
            // required: true
        },
        price: {
            type: String,
            required: true,
        },
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        rating: {
            type: String,
            default: "",
            min: 0,
            max: 5,
            trim: true
        },
        details: {
            type: String,
            required: true,
            min: 20,
            max: 200
        }
    },
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model('products', productModel);