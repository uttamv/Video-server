const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const User = require('../models/User');

router.post('/', (req, res, next) => {
    console.log("api called", req.body)

    User.find({email: req.body.email})
    .exec()
    .then(user => {
        console.log("api called 2", req.body)
        if(user.length <1){
            console.log("api called 6", req.body)
            // no user found
            return res.status(401).json({
                message: "Auth failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) =>{
            console.log("api called bcrt", req.body)
            if(err){
                console.log("api called 4", req.body)
                return res.status(401).json({
                    message: 'Auth failed'
                })
            }
            if(result){
                console.log("api called 3", req.body)
                // token here
                return res.status(200).json({
                    message: 'Auth successfull'
                })
            }
            res.status(401).json({
                message: 'Auth Failed'
            })
        })
    })
    .catch(er => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })

})

module.exports =  router