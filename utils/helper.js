const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(
            null,
            path.join(__dirname, "../public/uploads"),
            function (error, success) {
                if (error) {
                    res.status(404).send({ success: false, message: error.message })
                    return false;
                };
            }
        );
    },
    filename: (req, file, cb) => {
        let name;
        let ext = path.extname(file.originalname);
        // if (req.body.name) {
        //     name = req.body.name.replace(/\s+/g, "_") + "_" + Date.now() + ext
        // } else if (req.body.product_name) {
        //     name = req.body.product_name.replace(/\s+/g, "_") + "_"+ ext
        // }else if (req.body.category) {
        //     name = req.body.category.replace(/\s+/g, "_") + "_"+ ext
        // } else {
            name = Date.now() + ext;
        // }

        cb(null, name, function (error1, success1) {
            if (error1) {
                res.status(404).send({ success: false, message: error1.message })
                return false;
            };
        });
    },
});
const uploadImage = multer(
    {
    storage: storage, limits: { fileSize: 1000000 },
}
);

const generateToken = async (data) => {
    try {

        const generateToken = jwt.sign({ data }, process.env.SECRET_KEY, {
            expiresIn: "72h", // expires in 72 hours
        });
        return generateToken;

    } catch (error) {
        console.log('Error in generate token :', error.message);
    }
}

const decodeToken = async (token) => {
    try {

        const decodeToken = jwt.verify(token, process.env.secretKey);        
        return decodeToken;
    } catch (error) {
        console.log(error.message);
        return error.message;
    }
}

const capitalizeName = (name) => {
    const words = name.split(" ");
    const capitalizedWords = words.map((word) => {
        const firstLetter = word.charAt(0).toUpperCase();
        const remainingLetters = word.slice(1).toLowerCase();
        return firstLetter + remainingLetters;
    });
    return capitalizedWords.join(" ");
};

const sendEmail = async (toEmail, subject, html) => {
    try {

        const SMTP = {
            host: "smtp.gmail.com",
            port: 465,
            secure: true, // Use `true` for port 465, `false` for all other ports
            auth: {
                user: "therahul0722@gmail.com",
                pass: "ccdm xlhb luel revz",
            },
        }

        const transporter = nodemailer.createTransport(SMTP);

        const mailOptions = {
            from: '"👻 easy TO shop 👻" <rahul@easy.email>',
            to: toEmail,
            subject: subject,
            text: "text from the tes?",
            html: html,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });
    } catch (error) {
        console.log(error.message);
        return false;
    }
};

const generateUniqueFilename = async (originalname) => {
    const ext = path.extname(originalname); // Get file extension
    const baseName = path.basename(originalname, ext); // Get file base name without extension
    const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, ''); // Format current datetime
    return `${baseName}_${timestamp}${ext}`; // Create new filename
};

module.exports = { generateToken, decodeToken, capitalizeName, sendEmail,generateUniqueFilename,uploadImage };