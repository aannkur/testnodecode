
const express = require('express')
const Router = express.Router()
const Userlogin = require('../Modal/UserLogin')
const { OAuth2Client } = require('google-auth-library')
var jwt = require('jsonwebtoken');


const Client = new OAuth2Client("53424393985-pa30ia2qb4ecu1ci62dk6fg8bbksalgn.apps.googleusercontent.com")

Router.post("/loginwithGoogle", function (req, res) {
    const { tokenId } = req.body
    Client.verifyIdToken({ idToken: tokenId, audience: "53424393985-pa30ia2qb4ecu1ci62dk6fg8bbksalgn.apps.googleusercontent.com" }).then((response) => {
        const { email, email_verified, name, sub, picture } = response.payload
        console.log(response.payload)
        // var token = jwt.sign({ email: 'email' }, 'secrate');
       
        if (email_verified) {
            Userlogin.findOne({ email: email }).exec((error, user) => {
                if (error) {
                    return res.status(201).json({
                        message: "Connection Failed",
                        errors: error,
                        status: false,
                    })
                } else {
                    if (user) {
                        res.status(201).json({
                            message: "Welcome to Creator Trendi",
                            result: user,
                            status: true,
                        })
                    } else {
                        const newUser = new Userlogin({
                            username: name,
                            firstName: name,
                            email: email,
                            image: picture
                        })

                        const token = jwt.sign({ email }, 'secret key',
                            {
                                expiresIn: "2h",
                            }
                        );
                        newUser.token = token;
                        newUser.save().then((results) => {
                            res.status(201).json({
                                message: "Your account is registered successfully.",
                                status: true,
                                result: results
                            })
                        }).catch((err) => {
                            res.status(400).json({
                                massage: "server error",
                                err: err
                            })
                        })

                    }
                }
            })
        }
    })
})

module.exports = Router