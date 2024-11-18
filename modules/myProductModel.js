const mongoose = require('mongoose');

const myProductModel = mongoose.Schema(

    {
        myProduct_Name: {
            type: String,
            required: [true, "Please Enter Product's Name "],
            trim: true,
        },
        product_price: {
            type: String,
            required: true,
        },
        product_categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "category",
            required: true
        },
        product_SubCategoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subcategory",
            required: true
        },
        product_image: {
            type: String,
            // required: true
        },
        rating: {
            type: String,
            default: "",
            min: 0,
            max: 5,
            trim: true
        },
        count: {
            type: String,
            default: "",
            required: true
        },
        isSpecial: {
            type: String,
            enum: ["Y", "N"],
            default: "N"
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        },
        status: {
            type: String,
            enum: ["Y", "N"],
            default: "N"
        },
        discription: {
            type: String,
            required: true,
           
        }

    },
    { timestamps: true },
    { versionKey: false }

)

module.exports = mongoose.model('myProduct', myProductModel)