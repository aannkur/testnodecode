const express = require('express')
const Router = express.Router()
const passwordreset = require('../validation.js/forget')
const passwordnew = require('../validation.js/newpassword')
const UserModal = require('../Modal/UserLogin')
const Token = require('../Modal/token')
var crypto = require("crypto");
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SendEmail = require('../utility/forgot')
const Objectid = mongoose.Types.ObjectId;
var jwt = require('jsonwebtoken');

Router.post('/resetpassword', async (req, res) => {

    const { email } = req.body
    const validate = passwordreset({ email })
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            console.log(err)
        }
        const token = buffer.toString("hex")
        if (!validate.isValid) {
            return res.status(400).json({
                message: "Please enter your Email",
                errors: validate.error,
                status: false,
            });
        } else {
            UserModal.findOne({ email: email }).exec((error, user) => {
                if (error) {
                    return res.status(422).json({
                        message: "Connection Failed",
                        errors: error,
                        status: false,
                    })
                } else {
                    user.save().then(async (result) => {
                        res.status(201).json({
                            message: "Mail sent. Check your email",
                            user: result,
                            status: 201
                        })

                        let emailObj = {
                            userid: user._id,
                            token: user.token,
                            email: email,
                        }

                        let sendLoginCredentials = SendEmail.sendMail(emailObj)


                    }).catch((err) => {
                        res.status(500).json({
                            massage: "Connection Failed",
                            err: err,
                            status: 500
                        })
                    })

                }
            })
        }
    })
})


Router.post('/newpassword/:token', (req, res) => {
    const { newpassword } = req.body

    const validate = passwordnew({ newpassword })
    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        UserModal.findOne({ _id: req.params.token }).exec((error, user) => {
            if (error) {
                return res.status(422).json({
                    message: "to get Token Error",
                    errors: error,
                    status: false,
                })
            } else if (!user) {
                return res.status(422).json({
                    message: "Token are not found",
                    errors: error,
                    status: false,
                })
            } else {
                let hashedPassword = bcrypt.hashSync(newpassword, 8)
                user.password = hashedPassword
                user.save().then((result) => {
                    res.json(
                        {
                            message: "Password changed",
                            result: result
                        }
                    )
                })

            }
        })
    }

})


Router.put("/ChangePassword", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            messag: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { oldpassword, newpassword } = req.body

    UserModal.findOne({ _id: userid }).exec((error, user) => {
        console.log("userid", userid)
        if (error) {
            return res.status(422).json({
                message: "Something wrong. Contact Support",
                errors: error,
                status: false,
            })
        } else {
            if (user) {
                bcrypt.compare(oldpassword, user.password, (error, match) => {
                    // console.log("oldpassword", oldpassword)
                    // console.log("user.password", user.password)
                    if (error || !match) {
                        return res.status(400).json({
                            message: "Incorrect Old Password",
                            status: false,
                        })

                    } else {
                        if (match) {
                            let hashedPassword = bcrypt.hashSync(newpassword, 8)
                            user.password = hashedPassword
                            user.save().then((results) => {
                                res.status(201).json({
                                    message: "Password has been reset successfully",
                                    status: 201,
                                    results: results
                                })
                            }).catch((err) => {
                                res.status(500).json({
                                    massage: "Something wrong. Contact Support",
                                    err: err,
                                    status: 500
                                })
                            })
                        }
                    }
                })
            }
        }
    })

})





module.exports = Router