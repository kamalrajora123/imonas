const mongoose = require("mongoose");
const subcategoryModel = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Provide Us the Name."],
        minLength: 3,
        maxLength: 20,
    }, image: {
        type: String,
        require: true
    }, status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y",
    }
},
    { timestamps: true });

module.exports = mongoose.model("subcategory",subcategoryModel);