const contactModel = require('../modules/contactModel')
const userModel = require('../modules/userModel')
const helper = require('../utils/helper');


module.exports.contactControl = async (req, res) => {
    try {
        const name = req.body.name
        const { email, mobile, reason } = req.body;
        // console.log(req.body);
        // return false;
        

        const saveContact = new contactModel({
            name: name,
            email: email,
            mobile: mobile,
            reason: reason
        });
        const saveData = await saveContact.save();
        const sendMailResponse = helper.sendEmail(email, 'Contact regarding', 'Thank you for contact us',
            `<p>Thank You <b> ${name} </b> for contact with us.</p> <p>We will respond to you soon.</p>`)
        res.status(200).send({ success: true, message: "Thank you for contact us.", data: saveContact });

    } catch (error) {
        console.log("Error in contactUs function", error);
    };
};