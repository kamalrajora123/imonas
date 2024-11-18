const blogFindModel = require('../modules/blogModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');



module.exports.addBlog= async (req, res) => {
    try {
        const { blogName, status ,blogUrl} = req.body;
    //   console.log(blogName);
    //   return
      
        // let blogUrl;
        // if (req.file) {
        //     blogUrl = req.file.filename;
        // } else {
        //     blogUrl = null;
        // }

        // if (req.userInfo.role != "admin") {
        //     res.status(404).send({ success: false, message: "You are not authenticted here." })
        //     if (req.file) {
        //         fs.unlinkSync(req.file.path);
        //     }
        //     return false;
        // }

        if (!blogName) {
            res.status(200).send({ success: false, message: "Please enter the name." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!blogUrl) {
            res.status(200).send({ success: false, message: "Please enter the blogUrl." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        const blogFind = {};
        if (blogName) {
            blogFind.blogName = new RegExp(blogName, "i")
        }

        const existBlog = await blogFindModel.findOne(blogFind);
        if (!existBlog) {
            const blogObj = blogFindModel({
                blogName:blogName.toUpperCase(),
                blogUrl:blogUrl,
                status:status
            });

            const saveSliderData = await blogObj.save();
            res.status(200).send({ success: true, message: blogName + " Saved Successfully" });
            return false;
        } else {
            res.status(404).send({ success: false, message: "This blog is already Exist." });
            return false;
        }
    } catch (error) {
        res.status(404).send({ success: false, error: error.message });
        console.log("Error from add gallery function ", error);
    }
};

module.exports.findBlog = async (req, res) => {

    try {
        const { _id,blogName,status } = req.query;

        let blogFind = {};

        if (_id) {
            blogFind._id = _id;
        }
        if (blogName) {
            blogFind.blogName = new RegExp(blogName, "i");
        }
        if (status) {
            blogFind.status = status;
          }
         
        // categoryFind.status = "Y";

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let existblog= await blogFindModel.find(blogFind, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate({ path: "categoryId", select: "name" })
            // .limit(limit)
            // .skip(skip)
            .sort({ _id: -1 });


        if (existblog.length > 0) {
            const modifiedArray = existblog.map((element, index) => {
                if (element.blogName) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.blogUrl}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded blogs : ", data: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from findBlogs function ", error);
    }
};