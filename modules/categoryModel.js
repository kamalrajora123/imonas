const mongoose = require('mongoose');

const categoryModel = mongoose.Schema({

    category: {
        type: String,
        required: [true, "Please Provide Us the Category Name."],
        trim: true
    },
    image: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y"
    },
    isFeature: {
        type: String,
        enum: ["Y", "N"],
        default: "N"
    }
},
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model('category', categoryModel);