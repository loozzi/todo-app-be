const UserModel = require('../../models/User');
const md5 = require('md5');


function register(req, res, next) {
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    if (username && password && email) {
        UserModel.findOne({
            $or: [
                {
                    username: username
                },
                {
                    email: email
                }
            ]
        })
            .then(data => {
                if (!data) {
                    UserModel.create({
                        username: username,
                        password: md5(password),
                        email: email
                    });
                    res.status(200).json({
                        success: true,
                        logs: 'OK!'
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        logs: 'Username/Email is already'
                    });
                }
                res.json(data);
            })
            .catch(next);
    }
}

module.exports = register;