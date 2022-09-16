const express = require('express')
const Router = express.Router()
const Userlogin = require('../Modal/UserLogin')
const Gigs = require('../Modal/Gigs')


Router.get('/Suggestiongigs',async(req,res) => {
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
    const currentUser = await Userlogin.findById(userid);
    Gigs.aggregate(
        [{ $match: { interests: { $in: [...currentUser.intrested] } } },
        {
            $lookup: {
                from: "userlogins",
                localField: "interests",
                foreignField: "intrested",
                as: "intrested",
            },
        }], (error, resulte) => {
            if (error) {
                return res.status(400).json({
                    message: "execute error",
                    error: error,
                    status: 400,
                })
            } else {
                return res.status(200).json({
                    message: "to get Data",
                    result: resulte,
                    status: 200,
                })
            }
        })


})




module.exports = Router