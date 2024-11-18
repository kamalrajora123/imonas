const cartModelFile = require('../modules/cartModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');

module.exports.addToCart = async (req, res) => {
    try {
        let user = req.userInfo._id;
        const { productsId, symbol } = req.body;

        if (!productsId) {
            res.status(200).send({ success: false, message: "Please provide product's details" });
            return
        }
        if (!symbol) {
            res.status(200).send({ success: false, message: "Please provide add or remove quantity value." });
            return
        }
        if (!(symbol == "+") && !(symbol == "-")) {
            res.status(200).send({ success: false, message: "Please provide valid add(+) or remove(-)." });
            return
        }

        const cart = await cartModelFile.findOne({ userId: new ObjectId(user), productsId: new ObjectId(productsId) });

        if (cart && symbol == '+') {

            const updateQuantity = await cartModelFile.updateOne({ userId: new ObjectId(user), productsId: new ObjectId(productsId) }, { $set: { quantity: cart.quantity + 1, updatedAt: new Date() } })

            const cartData = await cartModelFile.find({ userId: new ObjectId(user), productsId: new ObjectId(productsId) }, { createdAt: 0, updatedAt: 0, __v: 0 })

            res.status(200).send({ success: true, message: "Cart updated successfully", cartData: cartData });
            return;
        }
        else if (cart && symbol == '-') {

            if (cart.quantity == 1) {

                await cartModelFile.deleteOne({ userId: new ObjectId(user), productsId: new ObjectId(productsId) })
                res.status(200).send({ success: true, message: "Cart removed successfully" });
                return;

            } else {
                const updateQuantity = await cartModelFile.updateOne({ userId: new ObjectId(user), productsId: new ObjectId(productsId) }, { $set: { quantity: cart.quantity - 1, updatedAt: new Date() } })

                const cartData = await cartModelFile.find({ userId: new ObjectId(user), productsId: new ObjectId(productsId) }, { createdAt: 0, updatedAt: 0, __v: 0 })

                res.status(200).send({ success: true, message: "Cart updated successfully", cartData: cartData });
                return;
            }
        }
        else {
            if (symbol == '+') {

                const cartedData = cartModelFile({
                    productsId,
                    userId: user
                })
                const saveCartData = await cartedData.save();
                const cartData = await cartModelFile.findOne({ _id: saveCartData._id }, { createdAt: 0, updatedAt: 0 })
                // .populate({ path: "userId", select: { "_id": 1, "name": 1, "email": 1, "mobile": 1, "image": 1 } })
                // .populate({ path: "productId", select: { "_id": 1, 'product_name': 1, 'price': 1, 'image': 1, 'details': 1 } })
                // .sort({quantity : -1});

                res.status(200).send({ success: true, message: "Added to cart", addedCart: cartData });
                return
            }
            else {
                res.status(200).send({ success: true, message: "Please provide valid symbol." });
                return
            }

        }

    } catch (error) {
        res.status(404).send({ success: false, message: "404 Server Error " + error.message });
        console.log("404 Server Error in addToCart function :", error);
        return
    }
};

module.exports.getCart = async (req, res) => {
    try {

        const user = req.userInfo._id

        let data = await cartModelFile.find({ userId: user })
          .populate({ path: "userId", select: { "_id": 1, "name": 1, "email": 1, "mobile": 1, "image": 1 } })
            .populate({ path: "productsId", select: { "_id": 1, 'product_name': 1, 'price': 1, 'image': 1, 'details': 1 } });
        // console.log(productsArray.length);
        if (data) {
            res.status(201).send({
                success: true,
                message: `here is the cart list which you searched now.`,
                data: data,
            });
            return true;
        } else {
            res.status(200).send({ success: false, message: `No Carts founded.` });
            return true;
        }
    } catch (error) {
        console.log("Error From function", error.message);
        res.status(404).send({ success: false, message: error.message });
        return error.message;
    }
};


module.exports.getCartCount = async (req, res) => {
    try {
        let user = req.userInfo._id;
       
        if (!user) {
            res.status(200).send({ success: false, message: "you are not authorized." });
            return
        }

        const cartItems = await cartModelFile.find({ userId: new ObjectId(user) });
        const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        res.status(200).send({ success: true, message: "cart Data", data: totalCount });
        return
    } catch (error) {
        res.status(404).send({ success: false, message: "404 Server Error " + error.message });
        console.log("404 Server Error :", error);
        return
    }
}