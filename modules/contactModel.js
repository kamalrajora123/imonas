const mongoose = require('mongoose');

const contactModelField = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
        },
        reason: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["Y", "N"],
            default: "Y",
        },
    },
    { timestamps: true },
    { versionKey: false }
);
module.exports = mongoose.model('contacts', contactModelField);