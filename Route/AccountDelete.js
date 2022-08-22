const express = require('express')
const Router = express.Router()
const Userlogin = require('../Modal/UserLogin')


Router.delete('/deleteaccount/:id', (req, res) => {
    const userdeleteID = req.params['id']
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }

    Userlogin.findOneAndDelete({ _id: userdeleteID }).then((result) => {
        res.status(201).json({
            message: "User removed.",
            // result: result,
            status: 201,
        })
    }).catch((err) => {
        res.status(400).json({
            message: "Connection Failed",
            status: 400,
        })
    })

})


module.exports = Router