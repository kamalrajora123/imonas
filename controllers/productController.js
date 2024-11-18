const productModel = require('../modules/productModel');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const helper = require('../utils/helper');
const { log } = require('console');

module.exports.addProducts = async (req, res) => {

    try {


        // let addedBy = req.userInfo._id;
        let WhoAddThis = '66d7f1a3712d83af9dda9d2c'

        const { product_name, details, price, rating, categoryId } = req.body;
        let avtar;
        if (req.file) {
            avtar = req.file.filename;
        } else {
            avtar = null;
        }

        // if (req.userInfo.role != "admin") {
        //     if (req.file) {
        //         fs.unlinkSync(req.file.path);
        //     }
        //     res.status(404).send({ success: false, message: "You are not authenticted here." })
        //     return false;
        // }

        if (!product_name) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `Please enter product_name's Name.` });
            return false;
        }

        if (!categoryId) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `Please enter the category like [Fiction , Biography, Scientific fact, Mystery, Fantasy, Historical, Religious...........    etc.].` });
            return false;
        }
        // if (!addedBy) {
        //     if (req.file) {
        //         fs.unlinkSync(req.file.path);
        //     }
        //     res.status(200).send({ success: false, message: `Please enter the who added this product.` });
        //     return false;
        // }
        if (!price) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `Please enter the price of ${product_name} book.` });
            return false;
        }
        if (!details) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            } res.status(200).send({ success: false, message: `Please write the more details about ${product_name} book.` });
            return false;
        }

        let isExist = await productModel.findOne({ product_name });

        if (!isExist) {

            const setProductData = productModel(
                {
                    product_name: await helper.capitalizeName(product_name),
                    price,
                    image: avtar,
                    rating,
                    details,
                    categoryId,
                    addedBy: WhoAddThis
                }
            );
            const saveProductData = await setProductData.save();
            console.log(saveProductData);

            res.status(201).send({ success: true, message: `hurre! the ${product_name} book is added successfully. And the Details are here`, product: saveProductData });
            return false;

        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `This book is already added in our products.` });
            return false;
        }

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(404).send({ success: false, message: error });
        console.log("Error From Product Controller", error);
    }

};
module.exports.deleteProduct = async (req, res) => {

    try {
        const { _id } = req.body;

        if (req.userInfo.role != "admin") {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            return false;
        }

        if (!_id) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: "Please Provide _id." })
            return false;
        }

        if (_id) {
            const deleteUser = await productModel.deleteOne({ _id: new ObjectId(_id) });
            res.status(200).send({ success: true, message: "Data has been deleted Successfully", data: deleteUser });
        } else {
            res.status(200).send({ success: true, message: 'Can not found', });
            return false;
        }
    } catch (error) {
        res.status(404).send({ success: false, message: error });
        console.log("Error from  deleteProduct function : ", error);
    }
};

module.exports.updateProduct = async (req, res) => {

    try {
        const { _id, product_name, details, category, price, currency, rating, author } = req.body;

        if (req.userInfo.role != "admin") {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            return false;
        }

        if (!_id) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: "Please Provide _id." })
            return false;
        }

        const findProduct = await productModel.findOne({ _id: new ObjectId(_id) });

        let productImage;
        if (req.file) {
            filepath = path.join(__dirname, "../public/uploads/") + findProduct.image;
            fs.unlinkSync(filepath)
            productImage = req.file.filename;
        } else {
            productImage = findProduct.image;
        }

        if (findProduct) {
            const updatedProduct = await productModel.updateOne({ _id: new ObjectId(_id) }, { $set: { product_name, details, category, price, currency, image: productImage, author, rating, updatedAt: new Date() } });
            const findProduct = await productModel.findOne({ _id: new ObjectId(_id) });

            res.status(200).send({ success: true, message: "Data has been update Successfully", data: findProduct });
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(404).send({ success: false, message: "Invalid product id" });
        }

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from updateProduct function ", error);
    }
};

module.exports.getProduct = async (req, res) => {
    try {
        const { product_name, category, price, image, rating, author, _id } =
            req.query;

        let queryObject = {};

        if (_id) {
            let productsArray = await productModel
                .findOne({ _id }, { createdAt: 0, updatedAt: 0, __v: 0 })
                // .populate("categoryId" )
                .populate({ path: "categoryId", select: " _id , category , status" })
                .populate({ path: "addedBy", select: "_id , name " });

            if (productsArray) {
                let modifiedobj = {
                    ...productsArray.toObject(),
                    image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${productsArray.image}`,
                };

                res
                    .status(201)
                    .send({
                        success: true,
                        message: " Product get successfully.",
                        product: modifiedobj,
                    });
                return true;
            } else {
                res
                    .status(200)
                    .send({ success: false, message: "Invalid Product id." });
                return true;
            }
        }

        if (product_name) {
            queryObject.product_name = new RegExp(product_name, "i");
        }
        if (category) {
            queryObject.category = new RegExp(category, "i");
        }
        if (price) {
            queryObject.price = new RegExp(price, "i");
        }
        if (rating) {
            queryObject.rating = new RegExp(rating, "i");
        }
        if (author) {
            queryObject.author = new RegExp(author, "i");
        }

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let productsArray = await productModel
            .find(queryObject, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate("categoryId" )
            .populate({ path: "categoryId", select: " _id , category , status" })
            .populate({ path: "addedBy", select: "_id , name " })
            .limit(limit)
            .skip(skip)
            .sort({ _id: -1 });

        let productsCount = await productModel.find().count();
        // console.log(productsArray.length);
        if (productsArray.length > 0) {
            const modifiedArray = productsArray.map((element, index) => {
                if (element.image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`,
                    };
                } else {
                    return element;
                }
            });

            // console.log(productsArray);
            // return false;

            res
                .status(201)
                .send({
                    success: true,
                    message: "here is the products list which you searched now.",
                    totalProducts: productsCount,
                    product: modifiedArray,
                });
            return false;
        } else {
            res.status(200).send({ success: false, message: "No products founded." });
            return false;
        }
    } catch (error) {
        console.log("Error From function", error.message);
        res.status(404).send({ success: false, message: "error.message" });
    }
};

module.exports.getProductByCategory = async (req, res) => {
    try {
        //   let SITE_URL = `${process.env.HOST}${process.env.PORT}`
        let viewData = await productModel.find({ categoryId: req.query.categoryId })
        //   console.log(req.query);
        //   return
        if (viewData.length > 0) {
            viewData = viewData.map((element, index) => {
                if (element.image) {
                    let obj = {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`
                    }
                    return obj;
                } else {
                    return element
                }
            })
            return res.json({
                status: 200,
                message: "productlist_sucessfully",
                success: true,
                data: viewData
            })
        } else {
            throw "..."
        }

    } catch (error) {
        return res.json({
            status: 400,
            message: error.message || "Bad request",
            success: false
        })
    }
}