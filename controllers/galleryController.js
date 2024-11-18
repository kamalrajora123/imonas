const galleryModelFile = require('../modules/galleryModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');


module.exports.addGallery = async (req, res) => {
    try {
        const { galleryName, status } = req.body;
    //   console.log(req.file);
    //   return
      
        let reqQalleryImage;
        if (req.file) {
            reqQalleryImage = req.file.filename;
        } else {
            reqQalleryImage = null;
        }

        // if (req.userInfo.role != "admin") {
        //     res.status(404).send({ success: false, message: "You are not authenticted here." })
        //     if (req.file) {
        //         fs.unlinkSync(req.file.path);
        //     }
        //     return false;
        // }

        if (!galleryName) {
            res.status(200).send({ success: false, message: "Please enter the name." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        const galleryFind = {};
        if (galleryName) {
            galleryFind.galleryName = new RegExp(galleryName, "i")
        }

        const existGallery = await galleryModelFile.findOne(galleryFind);
        if (!existGallery) {
            const galleryObj = galleryModelFile({
                galleryName: galleryName.toUpperCase(),
                galleryImage: reqQalleryImage,
                status: status
            });

            const saveSliderData = await galleryObj.save();
            res.status(200).send({ success: true, message: galleryName + " Saved Successfully" });
            return false;
        } else {
            res.status(404).send({ success: false, message: "This gallery is already Exist." });
            return false;
        }
    } catch (error) {
        res.status(404).send({ success: false, error: error.message });
        console.log("Error from add gallery function ", error);
    }
};

module.exports.findGallery = async (req, res) => {

    try {
        const { _id,galleryName,status } = req.query;

        let galleryFind = {};

        if (_id) {
            galleryFind._id = _id;
        }
        if (galleryName) {
            galleryFind.galleryName = new RegExp(galleryName, "i");
        }
        if (status) {
            galleryFind.status = status;
          }
         
        // categoryFind.status = "Y";

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let existGallery = await galleryModelFile.find(galleryFind, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate({ path: "categoryId", select: "name" })
            // .limit(limit)
            // .skip(skip)
            .sort({ _id: -1 });


        if (existGallery.length > 0) {
            const modifiedArray = existGallery.map((element, index) => {
                if (element.galleryImage) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.galleryImage}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded galleries : ", data: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from findGallery function ", error);
    }
};
