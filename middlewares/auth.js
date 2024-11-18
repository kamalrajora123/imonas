const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        
        let getToken;

        getToken = req.query.token || req.body.token;

        if (req.cookies) {
            getToken = req.cookies.token;
        }

        if (req.headers.authorization) {
            getToken = req.headers.authorization.replace('Bearer ', '');
        }

        if (!getToken) {
            res.status(401).send({ success: false, message: 'Authentication required : Token not available.' });
            return;
        }

        const decodeToken = jwt.verify(getToken, process.env.SECRET_KEY);
        req.userInfo = decodeToken.data;
        next();

    } catch (error) {
        res.status(404).send({ success: false, message: error.message })
        console.log('Error:', error);
    }
}

module.exports = auth;