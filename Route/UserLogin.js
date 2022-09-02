const express = require('express')
const Router = express.Router()
const registerValidate = require('../validation.js/register')
const validationLogin = require('../validation.js/login')
const multer = require("multer")
const ModalResiter = require('../Modal/UserLogin')
const bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken');
const config = require('../config.json')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })


Router.post('/register', (req, res) => {

    const { username, email, password } = req.body

    const validate = registerValidate({ username, email, password })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "Please enter the required fields.",
            errors: validate.error,
            status: false,
        });
    } else {
        let hashedPassword = bcrypt.hashSync(req.body.password.trim(), 8)

        ModalResiter.findOne({ email: email.toLowerCase() }).exec((error, user) => {
            if (error) {
                return res.status(400).json({
                    message: "Connection Failed",
                    errors: error,
                    status: false,
                })
            } else {
                if (user) {
                    return res.status(400).json({
                        message: "This email is already registered. Please login with this email to continue.",

                        status: false,
                    })

                } else {

                    ModalResiter.findOne({ username: username }).exec((error, user) => {
                        if (error) {
                            return res.status(400).json({
                                message: "Connection Failed",
                                errors: error,
                                status: false,
                            })
                        } else {
                            if (user) {
                                return res.status(400).json({
                                    message: "Username already taken. Please enter a different username.",
                                    user: user,
                                    status: false,
                                })

                            } else {
                                const singup = new ModalResiter({
                                    username: username,
                                    email: email.toLowerCase().trim(),
                                    password: hashedPassword
                                })
                                const token = jwt.sign({ email }, 'secret key', { expiresIn: 1000 }
                                );

                                // save user token
                                singup.token = token;
                                singup.save().then((results) => {
                                    res.status(201).json({
                                        message: "Your account is registered successfully.",
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

                            }
                        }
                    })

                }
            }
        })

    }
})


Router.post('/login', (req, res) => {


    const { email, password } = req.body
    const validate = validationLogin({ email, password })

    if (!validate.isValid) {
        return res.status(422).json({
            message: "Please enter the required fields.",
            errors: validate.error,
            status: false,
        });
    } else {
        ModalResiter.findOne({ email: email.toLowerCase().trim() }).collation(
            { locale: 'en', strength: 2 }
        ).exec((error, user) => {
            if (error) {
                return res.status(422).json({
                    message: "Connection Failed",
                    errors: error,
                    status: 401,
                })
            }
            if (!user) {
                {
                    return res.status(401).json({
                        message: "User does not exist. Please check the email you have enter or go to signup page to register with this email.",
                        user: user,
                        status: 401,
                    })
                }

            }
            bcrypt.compare(password.trim(), user.password, (error, match) => {

                const token = jwt.sign({ email }, 'secret key', {
                    expiresIn: "2h",
                })
                if (error) {
                    return res.status(401).json({
                        message: "Incorrect Password.",
                        status: 401

                    })

                } else {
                    if (match) {
                        res.status(201).json({
                            message: "Credentials Verified.",
                            status: true,
                            result: user
                        })

                    } else {
                        res.status(401).json({
                            message: "Incorrect Password.",
                            status: 401
                        })

                    }
                }
            })

        })

    }
})


Router.put("/updateProfile", upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { firstName, lastName, gender, dob, about, city, intrested, state, country } = req.body
    console.log(req.body)

    if (!req.file) {
        const data = {
            firstName: firstName,
            lastName: lastName,
            gender: gender,
            dob: dob,
            about: about,
            city: city,
            intrested: intrested,
            country: country,
            state: state,
            onboarding: true

        }
        ModalResiter.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
            res.status(200).json({
                message: "Profile Updated",
                result: result,
                status: 200,
            })
        }).catch((err) => {
            res.json({
                error: err,
                status: 501,
            })
        })
    } else {
        const data = {

            firstName: firstName,
            lastName: lastName,
            gender: gender,
            dob: dob,
            about: about,
            city: city,
            image: req.file.path,
            intrested: intrested,
            country: country,
            state: state,
            onboarding: true
        }
        ModalResiter.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
            res.status(200).json({
                message: "Profile Updated with image",
                result: result,
                status: 200,
            })
        }).catch((err) => {
            res.json({
                error: err,
                status: 501,
            })
        })
    }
    // }
})



Router.get('/userInfo', (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    if (userid === "null") {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    ModalResiter.findById({ _id: userid }).then((result) => {
        res.status(200).json({
            message: "Get User Profile",
            result: result,
            status: 200,
        })
    }).catch((err) => {
        res.json({
            error: err,
            status: 501,
        })
    })



})

Router.patch("/update", (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { userselection, price } = req.body

    // if (!req.file) {
    const data = {
        userselection: userselection,
        price: price,



    }
    ModalResiter.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: "Add new details",
            result: result,
            status: 200,
        })
    }).catch((error) => {
        res.json({
            error: error,
            status: 400,
        })
    })
    // } 
})



Router.patch("/updatecoverphotos", upload.single("coverimage"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    // if (!req.file) {
    const data = {

        coverimage: req.file.path,

    }
    ModalResiter.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: "Add new details",
            result: result,
            status: 200,
        })
    }).catch((error) => {
        res.json({
            error: error,
            status: 400,
        })
    })
    // } 
})

Router.patch("/photos", upload.single("image"), (req, res) => {
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    // if (!req.file) {
    const data = {

        image: req.file.path,

    }
    ModalResiter.findOneAndUpdate({ _id: userid }, { $set: data }, { new: true }).then((result) => {
        res.status(200).json({
            message: "Add new details",
            result: result,
            status: 200,
        })
    }).catch((error) => {
        res.json({
            error: error,
            status: 400,
        })
    })
    // } 
})


module.exports = Router