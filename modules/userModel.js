const mongoose = require('mongoose');

const userModelField = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            min: 3,
            max: 20
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        password: {
            type: String,
            required: true,
            min:3,
            max:10
        },
        mobile: {
            type: String,
            required: true
        },
        gender:{
            type: String,
            
            required:true,
        },


        country: {
            type: String,
            required: true,
            min: 3,
            max: 20
        },
        state: {
            type: String,
            required: true,
            min: 3,
            max: 20
        },
        city: {
            type: String,
            required: true,
            min: 3,
            max: 20
        },
        address: {
            type: String,
            required: true,
            min: 3,
            max: 80
        },
        status: {
            type: String,
            enum: ["Y", "N"],
            default: "N"
        },
        role: {
            type: String,
            enum: ["user", "admin", "vendor"],
            default: "user"
        }
    },
    { timestamps: true },
    { versionKey: false }
);

module.exports = mongoose.model('users', userModelField);