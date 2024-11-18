const sliderModelFile = require('../modules/sliderModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');


module.exports.addSlider = async (req, res) => {
    try {
        const { name, status } = req.body;
    //   console.log(req.file);
    //   return
      
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
        const sliderFind = {};
        if (name) {
            sliderFind.name = new RegExp(name, "i")
        }

        const existSlider = await sliderModelFile.findOne(sliderFind);
        if (!existSlider) {
            const sliderObj = sliderModelFile({
                name: name.toUpperCase(),
                image: image,
                status: status
            });

            const saveSliderData = await sliderObj.save();
            res.status(200).send({ success: true, message: name + " Saved Successfully" });
            return false;
        } else {
            res.status(404).send({ success: false, message: "This slider is already Exist." });
            return false;
        }
    } catch (error) {
        res.status(404).send({ success: false, error: error.message });
        console.log("Error from add slider function ", error);
    }
};

module.exports.findSlider = async (req, res) => {

    try {
        const { _id, name, status} = req.query;

        let sliderFind = {};

        if (_id) {
            sliderFind._id = _id;
        }
        if (name) {
            sliderFind.name = new RegExp(name, "i");
        }
        if (status) {
            sliderFind.status = status;
          }
        
      
        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let existSlider = await sliderModelFile.find(sliderFind, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate({ path: "categoryId", select: "name" })
            // .limit(limit)
            // .skip(skip)
            .sort({ _id: -1 });


        if (existSlider.length > 0) {
            const modifiedArray = existSlider.map((element, index) => {
                if (element.image) {
                    return {
                        ...element.toObject(),
                        image:`${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded slider list : ", data: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from findSlider function ", error);
    }
};

module.exports.changeStatus = async (req, res) => {

    try {
        const { _id } = req.query;

        if (!_id) {
            res.status(401).send({ success: false, message: "Please Provide _id." })
            return false;
        }

        const findSlider = await sliderModelFile.findOne({ _id: new ObjectId(_id) });

        if (findSlider) {
            let updateStatus = (foundedUser.status == 'Y') ? "N" : "Y";
            await sliderModelFile.updateOne({ _id: new ObjectId(_id) }, { $set: { status: updateStatus, updatedAt: new Date() } });
            res.status(200).send({ success: true, message: "Status has been update Successfully" });
        } else {

            res.status(404).send({ success: false, message: "Invalid product id" });
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from Change Status ", error);
    }
};
