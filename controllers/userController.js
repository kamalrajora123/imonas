const { ObjectId } = require("mongodb");
const bcrypt = require('bcrypt');
const path = require("path");
const fs = require("fs");
const userModelFile = require('../modules/userModel');
const helperFile = require('../utils/helper');
const { log } = require("console");

module.exports.userlogin = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email) {
            res.status(404).send({ success: false, message: 'Please Enter Email' });
            return false;
        }
        if (!password) {
            res.status(404).send({ success: false, message: 'Please Enter Password' });
            return false;
        }

        //Validation of email :>

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        if (!validateEmail(email)) {
            res.status(404).send({ success: false, message: 'Please Enter Valid Email.' });
        }

        let isExist = await userModelFile.findOne({ email });

        if (isExist) {


            // compare admin master password 
            let isPasswordMatch;
            if (!isPasswordMatch) {
                // compare own password 
                isPasswordMatch = await bcrypt.compare(password, isExist.password);
            }

            if (isPasswordMatch) {
                let createdToken = await helperFile.generateToken(isExist);
                res.cookie("token", createdToken, { httpOnly: true })
                    .status(200).send({ success: true, message: 'Logged in successfully.', createdToken, isExist });

            } else {
                res.status(404).send({ success: false, message: 'Password is not matched' });
            }

        } else {
            res.status(404).send({ success: false, message: 'Invalid Email' });
        }
    } catch (error) {
        res.status(404).send({ succes: false, message: error.message });
        console.log("Error from loginUser function : ", error);
    }
};
module.exports.userRegistration = async (req, res) => {

    try {

        const { name, mobile, email, password, address, country, state, city, gender, role } = req.body;
        const hashedPassword = await bcrypt.hashSync(password, 10);

        let image;


        if (!name) {
            res.status(404).send({ success: false, message: " Please enter your Name. " });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!city) {
            res.status(404).send({ success: false, message: "Please enter your city. " });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!gender) {
            res.status(404).send({ success: false, message: "Please enter your gender." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }

        if (!address) {
            res.status(404).send({ success: false, message: " Please enter your address." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!country) {
            res.status(404).send({ success: false, message: " Please enter your country." });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!state) {
            res.status(404).send({ success: false, message: " Please enter your state. " });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!mobile) {
            res.status(404).send({ success: false, message: ` ${name} Please enter your Mobile number.` });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!email) {
            res.status(404).send({ success: false, message: `${name} Please enter your E - mail i'd.` });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!password) {
            res.status(404).send({ success: false, message: ` ${name} Please enter your Password of your E - mail.` });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }


        // Validation of email :>

        const validateEmail = (email) => {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        };

        if (!validateEmail(email)) {
            res.status(404).send({ success: false, message: 'Please Enter Valid Email.' });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        }
        if (!(mobile.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) && !(mobile.match(/0{5,}/)))) {
            res.status(404).send({ success: false, message: 'Please Enter Valid Mobile number.' });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return false;
        };


        let isExist = await userModelFile.findOne({ email });

        if (!isExist) {

            let setUserData = userModelFile(
                {
                    name: await helperFile.capitalizeName(name),
                    email: email,
                    mobile: mobile,
                    country: country,
                    state: state,
                    city: city,
                    gender: gender,
                    password: hashedPassword,
                    role: role,
                    image: image,
                    address: address
                }
            );
            const saveUserData = await setUserData.save();
            console.log(saveUserData);


            const html = `<html>
              <head>
                <title>study_labs</title>
                <style>
                body{
                    background-color:"#26b5ff";
                    color:"black";
                }
                </style>
              </head>
              <body>
                <center><h1>Thank You for Registeration !</h1></center>
                <br><br>
                <h3>Your Provided Credentials :-) </h3>
                <h3>Email : ${email}</h3> 
                <h3>Password : ${password}XXXXXX</h3>
              </body>
            </html>`;

            const sendmail = await helperFile.sendEmail(email, 'Thank you for register with us.', html);

            res.status(200).send({ success: true, message: `Hello ${name} you are registered successfully.`, savedDocument: saveUserData });

        } else {
            res.status(404).send({ success: false, message: ` ${email} is are already Ragistered as ${isExist.name}.` });
            if (req.file) {
                fs.unlinkSync(req.file.path);
            };
        }

    } catch (error) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        res.status(404).send({ success: false, message: " error.message " });
        console.log("Error from userRegistration function ", error);
        return false;
    }
};
module.exports.findUsers = async (req, res) => {
    try {
        const { name, _id, email, mobile, role } = req.query;


        let collectionFind = {};

        if (name) {
            collectionFind.name = { $regex: name, $options: 'i' };
        }
        if (email) {
            collectionFind.email = { $regex: email, $options: 'si' };
        }
        if (mobile) {
            collectionFind.mobile = { $regex: mobile, $options: 'si' };
        }
        if (_id) {
            collectionFind._id = { $regex: _id, $options: 'i' };
        }
        if (role) {
            collectionFind.role = { $regex: role, $options: 'i' };
            // collectionFind.role =new RegExp(name,"i");
            // collectionFind.role =new RegExp(name);
        }

        let limit = process.env.PAGE_LIMIT;
        let page = req.query.page || 1;
        let skip = (page - 1) * limit;

        const founedUsers = await userModelFile.find(collectionFind)
            .limit(limit)
            .skip(skip);

        let usersCount = await userModelFile.find().count();

        if (founedUsers.length > 0) {
            const modifiedArray = founedUsers.map((element, index) => {
                if (element.image) {
                    return {
                        ...element.toObject(),
                        image: `${process.env.SERVER_LOCALHOST}:${process.env.SERVER_PORT}/uploads/${element.image}`,
                    };
                } else {
                    return element;
                }
            })
            res.status(200).send({ success: true, message: "hey! Here Is Your Founded Users : ", totalUsers: usersCount, users: modifiedArray });
            return false;
        } else {
            console.log("else");
            res.status(404).send({ success: false, message: "OOPS!!! No Data Available." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message })
        console.log("Error from findAllUsers : ", error);
    }
};
module.exports.updateUser = async (req, res) => {

    try {
        const { _id, name, email, mobile, role } = req.body;

        if (req.userInfo.role != 'admin') {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            res.status(200).send({ success: false, message: 'You are not authorised at this location.' });
            return false;
        }

        if (!_id) {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            res.status(200).send({ success: false, message: `Please provide the _id firstly.` });
            return false;
        }

        const findUser = await userModelFile.findOne({ _id: new ObjectId(_id) });

        if (findUser) {
            var userImage;
            if (req.file) {
                filepath = path.join(__dirname, "../public/uploads/") + findUser.image;
                fs.unlinkSync(filepath);
                userImage = req.file.filename;
            } else {
                userImage = findUser.image;
            }
            const update = await userModelFile.updateOne({ _id: new ObjectId(_id) }, { $set: { name: await helperFile.capitalizeName(name), email, mobile, role, image: userImage, updatedAt: new Date() } });
            const updatedUser = await userModelFile.findOne({ _id: new ObjectId(_id) });

            res.status(200).send({ success: true, message: `${name} your details updated Successfully`, data: updatedUser });
        } else {
            if (req.file) {
                fs.unlinkSync(req.file.path)
            }
            res.status(404).send({ success: false, message: `User not found.` });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from updateUser function ", error);
    }


};
module.exports.deleteUser = async (req, res) => {

    try {
        const { _id, role } = req.query;

        // if (req.userInfo.role != 'admin') {
        //     res.status(200).send({ success: false, message: 'You are not authorised at this location.' });
        //     return;
        // }

        if (!_id) {
            res.status(200).send({ success: false, message: 'Please provide _id for Identification.' });
            return;
        }
        const findUser = await userModelFile.findOne({ _id: new ObjectId(_id) });
        if (findUser) {

            const deleteUser = await userModelFile.deleteOne({ _id: new ObjectId(_id) });
            // if (deleteUser) {
            //     filepath = path.join(__dirname, "../public/uploads/") + findUser.image;
            //     fs.unlinkSync(filepath);
            // }
            res.status(200).send({ success: true, message: "Data has been deleted Successfully", data: deleteUser });
        }
        else {
            res.status(404).send({ success: false, message: 'User not found' });
        }

        // if (role) {
        //     const deletedUser = await userModelFile.deleteMany({ role: role });
        //     res.status(200).send({ success: true, message: "Data has been update Successfully", data: deletedUser });
        // }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from deleteUser function ", error);
        return;
    }
};
module.exports.changeStatus = async (req, res) => {

    try {
        const { _id } = req.query;

        if (!_id) {
            res.status(401).send({ success: false, message: "Please Provide _id." })
            return false;
        }

        const foundedUser = await userModelFile.findOne({ _id: new ObjectId(_id) });

        if (foundedUser) {
            let updateStatus = (foundedUser.status == 'Y') ? "N" : "Y";
            await userModelFile.updateOne({ _id: new ObjectId(_id) }, { $set: { status: updateStatus, updatedAt: new Date() } });
            res.status(200).send({ success: true, message: "Status has been update Successfully" });
        } else {

            res.status(404).send({ success: false, message: "Invalid product id" });
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from Change Status ", error);
    }
};
module.exports.updateFeatures = async (req, res) => {

    try {
        const { _id } = req.query;

        if (!_id) {
            res.status(401).send({ success: false, message: "Please Provide _id." })
            return false;
        }

        const foundedUser = await userModelFile.findOne({ _id: new ObjectId(_id) });

        if (foundedUser) {
            let updateStatus = (foundedUser.isFeatures == 'Y') ? "N" : "Y";
            await userModelFile.updateOne({ _id: new ObjectId(_id) }, { $set: { status: updateStatus, updatedAt: new Date() } });
            res.status(200).send({ success: true, message: "Status has been update Successfully" });
        } else {

            res.status(404).send({ success: false, message: "Invalid product id" });
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message });
        console.log("Error from Change Status ", error);
    }
};

module.exports.findWho = async (req, res) => {
    try {
        let user = req.userInfo._id;
        
        const founedUser = await userModelFile.findOne({_id:user})

        if (founedUser) {
            res.status(200).send({ success: true, user:founedUser});
            return false;
        } else {
            res.status(404).send({ success: false, message: "You are not currunt user please register yourself." });
            return false;
        }

    } catch (error) {
        res.status(404).send({ success: false, message: error.message })
        console.log("Error from foundWho : ", error);
    }
};

