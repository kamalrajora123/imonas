const mongoose = require("mongoose");

const cartModel = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users"
    },
    productsId: 
      {
        type: mongoose.Schema.Types.ObjectId,
         ref:"products"
     
      },
      quantity:{
        type:Number,
        default:1,
        trim:"true",
        required:true
      },
    
  },
  { timestamps: true },
  { versionKey: false }
);

module.exports = mongoose.model("Cart", cartModel);