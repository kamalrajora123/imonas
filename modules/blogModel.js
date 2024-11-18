const mongoose = require("mongoose");
const blogSchema = mongoose.Schema({
    
    blogName: {
        type: String,
        required: [true, "Please Provide Us the Name."],
        minLength: 3,
        maxLength: 20,
    }, blogUrl: {
        type: String,
        require: true
    }, status: {
        type: String,
        enum: ["Y", "N"],
        default: "Y",
    }
},
    { timestamps: true });

module.exports = mongoose.model("blog", blogSchema);