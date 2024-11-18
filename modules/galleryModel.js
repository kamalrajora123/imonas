const mongoose = require("mongoose");
const gallerySchema = mongoose.Schema({
    
    galleryName: {
        type: String,
        required: [true, "Please Provide Us the Name."],
        minLength: 3,
        maxLength: 20,
    }, galleryImage: {
        type: String,
        require: true
    }, status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y",
    }
},
    { timestamps: true });

module.exports = mongoose.model("gallery", gallerySchema);