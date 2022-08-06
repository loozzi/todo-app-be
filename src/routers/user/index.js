const express = require('express');
const md5 = require('md5');
const UserModel = require('../../models/User');
const jwt = require('../jwt');
const router = express.Router();


const login = require('./login');
const regiser = require('./register');
const checkLogin = require('./checkLogin');
const checkRoles = require('./checkRoles');

router.get('/', checkLogin, (req, res, next) => {
    res.status(200).json({
        success: true,
        data: res.data
    });
});

router.get('/:action', checkLogin, checkRoles.checkAdmin, (req, res, next) => {
    if (req.params.action == 'all') {
        UserModel.find({})
            .then(data => {
                res.status(200).json({
                    success: true,
                    data: data
                });
            })
        .catch(next)
    } else {
        UserModel.findById(req.params.action)
            .then(data => {
                res.status(200).json({
                    success: true,
                    data: data
                });
            })
        .catch(next)
    }
});


router.post('/', (req, res, next) => {
    if (req.query.action == 'login') {
        login(req, res, next);
    } else if (req.query.action == 'register')
        regiser(req, res, next);
    else
        res.status(400).json({
            success: false,
            logs: "NOT METHOD"
        });
});


router.put('/:_id', checkLogin, checkRoles.checkAdmin, (req, res, next) => {
    if (req.params._id == 'change_password') {
        const oldPassword = req.body.oldPassword;
        const newPassword = req.body.newpassword;
        if (oldPassword && newPassword) {
            UserModel.findOneAndUpdate({
                _id: res.data._id,
                password: md5(oldPassword)
            }, {
                password: md5(newPassword)
            })
                .then(data => {
                    if (data)
                        res.status(200).json({
                            success: true
                        });
                    else 
                        res.status(400).json({
                            success: false,
                            logs: 'Invalid old password'
                        })
                })
                .catch(next);
        }
    } else {
        UserModel.findByIdAndUpdate(req.params._id, {
            role: req.body.role
        })
            .then(data => {
                res.status(200).json({
                    success: true
                });
            })
            .catch(next);
    }
})


router.delete('/:_id', checkLogin, checkRoles.checkAdmin, (req, res, next) => {
    try {
        UserModel.findByIdAndRemove(req.params._id)
            .then(data => {
                res.status(200).json({
                    success: true
                });
            })
            .catch(next);
    } catch (error) {
        next(error);
    }
});

module.exports = router;