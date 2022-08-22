const express = require('express')
const Router = express.Router()
const passwordreset = require('../validation.js/forget')
const passwordnew = require('../validation.js/newpassword')
const UserModal = require('../Modal/UserLogin')
const Token = require('../Modal/token')
var crypto = require("crypto");
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Objectid = mongoose.Types.ObjectId;
var jwt = require('jsonwebtoken');

Router.post('/resetpassword', async(req, res) => {
    const { email } = req.body
    const validate = passwordreset({ email })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        UserModal.findOne({ email: email }).exec(async(error, user) => {
            if (error) {
                return res.status(422).json({
                    message: "Email Verification failed",
                    errors: error,
                    status: false,
                })
            } else {
                 Token.findOne({ userId: user._id }).exec((error,usertoken) => {
                    if(error ) {
                        return res.status(422).json({
                            message: "Token get failed",
                            errors: error,
                            status: false,
                        })
                    }else {
                        if(usertoken){
                            return res.status(422).json({
                                message: "User already send link",
                                errors: error,
                                status: false,
                            })

                        }else {
const tokenget = jwt.sign({ email: 'email' }, "hdjhjfdhjk", { expiresIn: '5min' })
                // user.token = token
                // user.expireToken = Date.now() + 3600000
                          const  token = new Token({
                                        userId: user._id,
                                        token: tokenget,
                                    })
                                    token.save().then((results) => {
                                        res.status(201).json({
                                            message: "Forget Password Link Send",
                                            status: true,
                                            result: results
                                        })
                                    }).catch((err) => {
                                        res.status(500).json({
                                            massage: "server error",
                                            err: err,
                                            status: false
                                        })
                                    })
                                    // token.save().then((res) => {
                                    //     res.status(201).json({
                                    //         message: "Forget Password Link Send",
                                    //         status: 201,
                                    //         result: result
                                    //     })
                                    // }).catch((err) => {
                                    //     res.status(400).json({
                                    //         massage: "server error",
                                    //         err: err
                                           
                                    //     })
                
                                    // })
                        }
                    }

                })
            }
        })
    }


})


Router.post('/newpassword/:token/:userid', (req, res) => {
    const { newpassword } = req.body

    const validate = passwordnew({ newpassword })
    if (!validate.isValid) {
        return res.status(400).json({
            message: "validation Errors",
            errors: validate.error,
            status: false,
        });
    } else {
        UserModal.findOne({ _id: req.params.userid }).exec((error, user) => {
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
                const token = Token.findOne({ userId: user._id, token: req.params.token }).exec((error,tokenget) => {
                    if(error) {
                        return res.status(400).json({
                                    message: "Invalid link",
                                    errors: error,
                                    
                                })
                    }else {
                        if(!tokenget){
                            return res.status(400).json({
                                        message: "Invalid link or expired",
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
                    }
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