const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const User = require('../models/User');


router.post('/', (req, res, next) => {
    console.log(req.body)
    // res.status(200).json({
    //     message: 'inside post /api/signUp'
    // })
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            console.log("user",user) 
            if (user.length >= 1) {
                //Mail Exists
                return res.status(409).json({
                    message: 'User already Exists'
                });
            } else {
                //Generate new User
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            error: err
                        })
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            firstName: req.body.firstName,
                            lastName: req.body.lastName,
                            email: req.body.email,
                            password: hash
                        })
                        user.save()
                            .then(result => {
                                console.log("result",result);
                                res.status(201).json({
                                    message: 'User Created'
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
            res.status(422).json({
                error: err
            })
        })
})

module.exports = router