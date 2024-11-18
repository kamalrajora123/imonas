const categoryModelFile = require('../modules/categoryModel');
const { ObjectId } = require("mongodb");
const helper = require('../utils/helper');
const path = require('path');
const fs = require('fs');


module.exports.addCategories = async (req, res) => {
    try {
        const { category, status } = req.body;

        let image;
        if (req.file) {
            image = req.file.filename;
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

        if (!category) {
            res.status(200).send({ success: false, message: "Please enter the product's category." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        const catFind = {};
        if (category) {
            catFind.category = new RegExp(category, "i")
        }

        const existCategory = await categoryModelFile.findOne(catFind);
        if (!existCategory) {
            const makeCategoryDoc = categoryModelFile({
                category: category.toUpperCase(),
                image: image,
                status: status
            });

            const saveCategory = await makeCategoryDoc.save();
            res.status(200).send({ success: true, message: category + " Saved Successfully" });
            return false;
        } else {
            res.status(404).send({ success: false, message: "This category is already Exist." });
            return false;
        }
    } catch (error) {
        res.status(404).send({ success: false, error: error.message });
        console.log("Error from addCategories function ", error);
    }
};

module.exports.findCategories = async (req, res) => {

    try {
        const { _id, category, status,isFeature} = req.query;

        let categoryFind = {};

        if (_id) {
            categoryFind._id = _id;
        }
        if (category) {
            categoryFind.category = new RegExp(category, "i");
        }
        if (status) {
            categoryFind.status = status;
          }
          if (isFeature) {
            categoryFind.isFeature = isFeature;
          }
      
        // categoryFind.status = "Y";

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        let existCategory = await categoryModelFile.find(categoryFind, { createdAt: 0, updatedAt: 0, __v: 0 })
            // .populate({ path: "categoryId", select: "name" })
            // .limit(limit)
            // .skip(skip)
            .sort({ createdAt: -1 })


        if (existCategory.length > 0) {
            const modifiedArray = existCategory.map((element, index) => {
                if (element.image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded Categories : ", data: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from findCategories function ", error);
    }
};

module.exports.deleteCategories = async (req, res) => {

    try {
        const { _id } = req.body;

        if (req.userInfo.role != "admin") {
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            return false;
        }

        if (!_id) {
            res.status(200).send({ success: false, message: "Please Provide _id." })
            return false;
        }
        const findCategory = await categoryModelFile.findOne({ _id: new ObjectId(_id) });


        if (findCategory) {

            const deleteCategory = await categoryModelFile.deleteOne({ _id: new ObjectId(_id) });
            if (deleteCategory) {
                filepath = path.join(__dirname, "../public/uploads/") + findCategory.image;
                fs.unlinkSync(filepath);
            }
            res.status(200).send({ success: true, message: "Data has been deleted Successfully", data: deleteUser });
        } else {
            res.status(200).send({ success: true, message: 'Can not found', });
            return false;
        }
    } catch (error) {
        console.log("Error from  deleteCategory function : ", error);
    }
};

module.exports.updateCategories = async (req, res) => {

    try {
        const { category, status, isFeature, _id } = req.body;


        if (req.userInfo.role != "admin") {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            res.status(404).send({ success: false, message: "You are not authenticted here." })
            return false;
        }

        if (!_id) {
            res.status(200).send({ success: false, message: "Please Provide Id." })
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            return false;
        }


        const findCategory = await categoryModelFile.findOne({ _id: new ObjectId(_id) });
        if (findCategory) {
            let categoryImage;

            if (req.file) {

                
                // Generate a new filename for the uploaded file
                const uniqueFilename = await helper.generateUniqueFilename(req.file.originalname);

                // Define file path and save the file with the new unique filename
                const uploadPath = path.join(__dirname, "../public/uploads/");
                const filePath = path.join(uploadPath, uniqueFilename);

                fs.renameSync(req.file.path, filePath); // Move file to the new path

                // If there's an existing image, delete it
                if (findCategory.image) {
                    const oldFilePath = path.join(uploadPath, findCategory.image);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }

                categoryImage = uniqueFilename;
            } else {
                categoryImage = findCategory.image;
            }

            // Update the category document in the database
            const updateCategory = await categoryModelFile.updateOne(
                { _id: new ObjectId(_id) },
                {
                    $set: {
                        category: category.toUpperCase(),
                        status,
                        isFeature,
                        image: categoryImage,
                        updatedAt: new Date()
                    }
                }
            );

            res.status(200).json({ success: true, message: 'Category updated successfully' });

        } else {
            return res.status(404).send({ success: false, message: 'Invalid Category Id' });
        }


    } catch (error) {
        return res.status(404).send({ success: false, message: error.message });
        console.log("Error from deleteCategories function : ", error);
    }
};