const UserModel = require('../../models/User');
const jwt = require('../jwt');

function checkLogin (req, res, next) {
    const token = req.cookies.token;
    try {
        const dataToken = jwt.decodeToken(token);
        UserModel.findById(dataToken._id)
            .then(data => {
                if (data) {
                    res.data = data;
                    next();
                } else 
                    res.status(400).json({
                    success: false,
                    logs: 'TOKEN EXPIRIED'
                });
            })
            .catch(error => {
                res.status(400).json({
                    success: false,
                    logs: 'TOKEN EXPIRIED'
                });
            });
    } catch (error) {
        res.status(400).json({
            success: false,
            logs: 'ERROR'
        });
    }
}


module.exports = checkLogin;