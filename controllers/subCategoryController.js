const  subcategoryModel=  require('../modules/subCategoryModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');


module.exports.addSubCategory = async (req, res) => {
    try {
        const { name, status } = req.body;
      
        let image;
        if (req.file) {
            image = req.file.fieldname;
        } else {
            image = null;
        }

        // if (req.userInfo.role != "admin") {
        //     res.status(404).send({ success: false, message: "You are not authenticted here." })
        //     if (req.file) {
        //         fs.unlinkSync(req.file.path);
        //     }
        //     return false;
        // }

        
        if (!name) {
            res.status(200).send({ success: false, message: "Please enter the name." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        const subCategoryFind = {};
        if (name) {
            subCategoryFind.name = new RegExp(name, "i")
        }

        const existSubCategory = await subcategoryModel.findOne(subCategoryFind);
        if (!existSubCategory) {
            const subCategoryObj = subcategoryModel({
                name: name.toUpperCase(),
                image: image,
                status: status
            });

            const saveSliderData = await subCategoryObj.save();
            res.status(200).send({ success: true, message: name + " Saved Successfully" });
            return false;
        } else {
            res.status(404).send({ success: false, message: "This slider is already Exist." });
            return false;
        }
    } catch (error) {
        return res.status(404).send({ success: false, error: error.message });
        console.log("Error from add slider function ", error);
    }
};

module.exports.findSubCategory = async (req, res) => {

    try {
        const { _id, name, status,} = req.query;

        let subCatFind = {};

        if (_id) {
            subCatFind._id = _id;
        }
        if (name) {
            subCatFind.name = new RegExp(name, "i");
        }
        if (status) {
            subCatFind.status = status;
        }

        // if (isFeature) {
        //     subCatFind.isFeature= isFeature
        // }
        // subCatFind.status = "Y";

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let existSubCategory = await subcategoryModel.find(subCatFind, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate({ path: "categoryId", select: "name" })
            // .limit(limit)
            // .skip(skip)
            .sort({ _id: -1 });

        let usersCount = await subcategoryModel.find().count();

        if (existSubCategory.length > 0) {
            const modifiedArray = existSubCategory.map((element, index) => {
                if (element.image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded subCategory image : ", data: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from findSubCategory function ", error);
    }
};


