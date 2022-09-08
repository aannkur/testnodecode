const express = require('express')
const Router = express.Router()
const Gigs = require('../Modal/Gigs')
const multer = require("multer")
const Validationcreategigs = require('../validation.js/validationforcreategigs')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})
const upload = multer({ storage: storage })

// Router.post('/gigs',upload.single("image"),(req,res) => {
//     const {heading,about,country,intrests,channels,minimum_followers, age_group, gender, pay_per_post,commission} = req.body
//     console.log(req.body)
// })

Router.post('/create',upload.single("image"), (req, res) => {
    console.log("body===",req.body)
    const { heading, about, country, channels, minimum_followers, age_group, gender, pay_per_post, commission,interests } = req.body

    // console.log("body", heading, about, country, channels, minimum_followers, age_group, gender, pay_per_post, commission, interests )

    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }

    const validate = Validationcreategigs({ heading, about, country, pay_per_post, commission })

    if (!validate.isValid) {
        return res.status(400).json({
            message: "Please enter the required fields.",
            errors: validate.error,
            status: false,
        });
    } else {

        const Gigscreate = new Gigs({
            user: userid,
            heading: heading,
            about: about,
            country: country,
            interests:interests,
            channels: channels,
            minimum_followers: minimum_followers,
            age_group: age_group,
            gender: gender,
            pay_post: pay_per_post,
            commission: commission
        })
        Gigscreate.save().then((result) => {
            res.status(200).json({
                message: "Created Gigs for the Brand",
                result: result,
                status: 200,
            })
        }).catch((error) => {
            console.log("==error",error)
            res.json({
                error: error,
                status: 501,
            })
        })
    }
})



Router.get('/getgigs', (req, res) => {
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
    Gigs.find().populate('user',{ Business_Name: 1, image: 1, coverimage: 1}).then((result) => {
        res.status(200).json({
            message: "Get Brand Gigs",
            result: result,
            status: 200,
        })
    }).catch((err) => {
        res.json({
            error: err,
            status: 401,
        })
    })



})


module.exports = Router