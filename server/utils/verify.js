const jwt = require('jsonwebtoken');

const verify = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                res.status(403).json('Invalid authentication.');
                return;
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json('Unauthorized user.');
        return;
    }
};

module.exports = verify;
