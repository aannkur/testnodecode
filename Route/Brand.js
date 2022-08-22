const express = require('express')
const Router = express.Router()
const ModalResiter = require('../Modal/UserLogin')


Router.get('/Brand', (req, res) => {
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
    ModalResiter.find({ $and: [{userselection:'Brand'},  {about: {$nin:[null,""]}} ] }).then((result) => {
        res.status(200).json({
            message: "Get User Profile",
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