const myProductModel = require('../modules/myProductModel');
const { ObjectId } = require('mongodb');
const path = require('path');
const fs = require('fs');
const helper = require('../utils/helper');
const { log } = require('console');

module.exports.addMyProducts = async (req, res) => {
    try {


        // let addedBy = req.userInfo._id;
        let WhoAddThis = '66d17e868368e620fc8a7aab'

        // console.log(req.body);

        const { myProduct_Name, count, discription, product_price, rating, product_categoryId, isSpecial, product_SubCategoryId } = req.body;



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

        if (!myProduct_Name) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `Please enter product_name's Name.` });
            return false;
        }

        if (!product_categoryId) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `Please enter the category like [Fiction , Biography, Scientific fact, Mystery, Fantasy, Historical, Religious...........    etc.].` });
            return false;
        }
        if (!product_SubCategoryId) {
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
        if (!product_price) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `Please enter the price of ${myProduct_Name}.` });
            return false;
        }
        if (!discription) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            } res.status(200).send({ success: false, message: `Please write the more details about ${myProduct_Name}.` });
            return false;
        }

        let isExist = await myProductModel.findOne({ myProduct_Name });

        if (!isExist) {

            const setProductData = myProductModel(
                {
                    myProduct_Name: await helper.capitalizeName(myProduct_Name),
                    product_price,
                    product_image: avtar,
                    rating,
                    product_SubCategoryId,
                    isSpecial,
                    discription,
                    count,
                    product_categoryId,
                    addedBy: WhoAddThis
                }
            );
            const saveProductData = await setProductData.save();
            // console.log(saveProductData);

            res.status(201).send({ success: true, message: `hurre! the ${myProduct_Name} is added successfully. And the Details are here`, product: saveProductData });
            return false;

        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: `This product is already added in our products.` });
            return false;
        }

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(404).send({ success: false, message: error });
        // console.log("Error From Product Controller", error);
    }

}

module.exports.getMyProduct = async (req, res) => {

    try {

        const { myProduct_Name, _id, count, discription, product_price, rating, product_categoryId, author, isSpecial, product_SubCategoryId } = req.query;

        if (_id) {
            let productsArray = await myProductModel.find({ _id }, { createdAt: 0, updatedAt: 0, __v: 0 })
                .populate({ path: "product_categoryId", select: " _id , category , status" })
                .populate({ path: "product_SubCategoryId", select: " name" });
            // .populate({ path: "addedBy", select: "_id , name " })

            const modifiedArray = productsArray.map((element, index) => {
                if (element.product_image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.product_image}`
                    };
                } else {
                    return element;
                }
            });
            res.status(201).send({ success: true, message: `here is the products list which you searched now.`, product: modifiedArray });
            return true;
        }

        let queryObject = {};

        if (myProduct_Name) {
            queryObject.myProduct_Name = new RegExp(myProduct_Name, "i")
        }
        if (product_categoryId) {
            queryObject.product_categoryId = product_categoryId
        }
        if (product_price) {
            queryObject.product_price = new RegExp(product_price, "i")
        }
        if (rating) {
            queryObject.rating = new RegExp(rating, "i")
        }
        if (author) {
            queryObject.author = new RegExp(author, "i");
        }
        if (product_SubCategoryId) {
            queryObject.product_SubCategoryId = product_SubCategoryId
        }
        if (count) {
            queryObject.count = count
        }
        if (discription) {
            queryObject.discription = new RegExp(discription, "i");
        }
        // let limit = process.env.PAGE_LIMIT;
        // let page = req.query.page || 1;
        // let skip = (page - 1) * limit;

        let productsArray = await myProductModel.find(queryObject, { createdAt: 0, updatedAt: 0, __v: 0 })
            .sort({ createdAt: -1 })
            // .populate("categoryId" )
            .populate({ path: "product_categoryId", select: " _id , category , status" })
            // .populate({ path: "addedBy", select: "_id , name " })
            .populate({ path: "product_SubCategoryId", select: "name" });

        // .limit(limit)
        // .skip(skip)
        // .sort({ _id: -1 });

        let productsCount = await myProductModel.find().count();
        // console.log(productsArray.length);
        // console.log(productsArray);
        if (productsArray.length > 0) {

            const modifiedArray = productsArray.map((element, index) => {
                if (element.product_image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.product_image}`
                    };
                } else {
                    return element;
                }
            });

            // console.log(productsArray);
            // return false;

            res.status(201).send({ success: true, message: `here is the products list which you searched now.`, product: modifiedArray });
            return true;

        } else {
            res.status(200).send({ success: false, message: `No products founded.` });
            return true;
        }

    } catch (error) {
        console.log("Error From function", error.message);
        res.status(404).send({ success: false, message: error.message });
        return error.message;
    }

};

module.exports.deleteMyProduct = async (req, res) => {

    try {
        const { _id } = req.query;
        // console.log(req.query);
        // return



        if (!_id) {
            res.status(200).send({ success: false, message: 'Please provide _id for Identification.' });
            return;
        }
        const findMyProduct = await myProductModel.findOne({ _id: new ObjectId(_id) });
        if (findMyProduct) {

            const deleteProduct = await myProductModel.deleteOne({ _id: new ObjectId(_id) });
            res.status(200).send({ success: true, message: "product Data has been deleted Successfully", data: deleteProduct });
        }
        else {
            res.status(404).send({ success: false, message: 'User not found' });
        }

        // if (role) {
        //     const deletedUser = await MyProductModel.deleteMany({ role: role });
        //     res.status(200).send({ success: true, message: "Data has been update Successfully", data: deletedUser });
        // }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from deleteProduct function ", error);
        return;
    }
};

module.exports.updateMyProduct = async (req, res) => {

    try {
        const { _id, myProduct_Name, discription, category, product_price, product_categoryId, rating, product_SubCategoryId, image, status, isFeature, count, isSpecial } = req.body;

        // console.log("req.body",req.body);

        // return false



        // if (req.userInfo.role != "admin") {
        //     if (req.file) {
        //         fs.unlinkSync(req.file.path);
        //     }
        //     res.status(404).send({ success: false, message: "You are not authenticted here." })
        //     return false;
        // }

        if (!_id) {
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            res.status(200).send({ success: false, message: "Please Provide _id." })
            return false;
        }

        const findMyProduct = await myProductModel.findOne({ _id: new ObjectId(_id) });
        // console.log(findProduct);

        let product_image;

        if (req.file) {
            // filepath = path.join(__dirname, "../public/uploads/") + findProduct.image;
            // fs.unlinkSync(filepath)
            product_image = req.file.filename;
        } else {
            product_image = findMyProduct.image;
        }

        if (findMyProduct) {
            const updatedProduct = await myProductModel.updateOne({ _id: new ObjectId(_id) }, { $set: { myProduct_Name, discription, category, product_price, product_categoryId, image: product_image, product_SubCategoryId, status, isFeature, rating, count, isSpecial, updatedAt: new Date() } });
            const findMyProduct = await myProductModel.findOne({ _id: new ObjectId(_id) });

            res.status(200).send({ success: true, message: "Data has been update Successfully", data: findMyProduct });
            // console.log("findMyProduct",findMyProduct);

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

module.exports.changeMyStatus = async (req, res) => {
    try {
        const { _id, } = req.query;
        if (!_id) {
            res.status(404).send({ success: false, message: 'provide _id.' })
        }
        const FindProduct = await myProductModel.findOne({ _id: new ObjectId(_id) });
        if (FindProduct) {
            let updateStatus = (FindProduct.status == 'Y') ? 'N' : 'Y';
            const updatedProduct = await myProductModel.updateOne({ _id: new ObjectId(_id) }, { $set: { status: updateStatus, updatedAt: new Date() } });
            res.status(200).send({ success: true, message: 'MyProduct status been update successfully' })
        } else {
            res.status(400).send({ success: false, message: 'Status not update please try again' })
        }

    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
        console.log('error frm updateproduct function', error);

    }
}

module.exports.IsSpecial = async (req, res) => {

    try {
        const { _id, } = req.query;

        if (!_id) {
            res.status(404).send({ success: false, message: 'provide _id.' })
        }
        const FindMyProduct = await myProductModel.findOne({ _id: new ObjectId(_id) });
        if (FindMyProduct) {
            let UpdateIsSpecial = (FindMyProduct.isSpecial == 'Y') ? 'N' : 'Y';
            const updatedProduct = await myProductModel.updateOne({ _id: new ObjectId(_id) }, { $set: { isSpecial: UpdateIsSpecial, updatedAt: new Date() } });
            res.status(200).send({ success: true, message: 'IsSpecial has been update successfully' })
        } else {
            res.status(400).send({ success: false, message: 'IsSpecial not update please try again' })
        }
    } catch (error) {
        res.status(400).send({ success: false, message: error.message });
        console.log('error frm spesial function', error);

    }
}