const jwt = require('../jwt');
const md5 = require('md5');
const UserModel = require('../../models/User');


function login(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
        UserModel.findOne({
            $or: [
                {
                    username: username,
                    password: md5(password)
                },
                {
                    email: username,
                    password: md5(password)
                }
            ]
        })
            .then(data => {
                res.data = data;
                const token = jwt.genToken({
                    _id: data._id
                });
                res.status(200).json({
                    success: true,
                    data: {
                        token: token,
                        time_expiried: jwt.TIME_EXPIRIED
                    }
                });
            })
            .catch(err => {
                res.status(400).json({
                    success: false,
                    logs: 'Invalid username or password'
                })
            });
    } else {
        res.status(400).json({
            success: false
        })
    }
}


module.exports = login;