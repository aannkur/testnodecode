const express = require('express')
const Router = express.Router()
const Notification = require('../Modal/Notification')


Router.get('/getUserNotification', (req, res) => {
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
    Notification.find({ gigsuser: userid }).populate('userinterested').populate('gigs').then((result) => {
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

