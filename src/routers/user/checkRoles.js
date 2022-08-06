const jwt = require('../jwt');
const UserModel = require('../../models/User');


const checkAdmin = (req, res, next) => {
    if (res.data.role >= 2)
        next();
    else
        res.status(400).json({
            success: false,
            logs: 'NOT PERMISSION'
        });
}

const checkWriter = (req, res, next) => {
    if (res.data.role >= 1)
        next();
    else
        res.status(400).json({
            success: false,
            logs: 'NOT PERMISSION'
        });
}


module.exports = {
    checkAdmin, 
    checkWriter
}