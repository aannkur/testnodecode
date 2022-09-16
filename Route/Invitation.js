const express = require('express')
const Router = express.Router()
const Invitation = require('../Modal/invitation')
const Gigs = require('../Modal/Gigs')

const Userlogin = require('../Modal/UserLogin')

// const Gigs = require('../Modal/Gigs')


Router.post('/Invitation/', async (req, res) => {
    const {userfrom, gigid, invitationStatus } = req.body
    // const gigid = req.params.id
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

    Invitation.find({ userto: userid,userfrom:userfrom, gigs: gigid }).exec((error, result) => {
        console.log(result)
        if (error) {
            return res.status(400).json({
                message: "to execution Error",
                error: error,
                status: 400,
            })
        } else if (result.length > 0) {
            return res.status(200).json({
                message: "you have already send invitation",
                status: 200
            })

        } else {
            const invitationuser = new Invitation({
                userto: userid,
                userfrom: userfrom,
                gigs: gigid,
                invitationStatus: invitationStatus
            })

            invitationuser.save().then((result) => {
                res.status(200).json({
                    message: "Send Invitation ",
                    result: result,
                    status: 200
                })
            }).catch((error) => {
                console.log("==error", error)
                res.json({
                    error: error,
                    status: 501,
                })
            })
        }

    })



})


Router.get('/getinvitationUser', (req, res) => {
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
    Invitation.find({ userto: userid,invitationStatus:'Pending' }).populate('userto').populate('userfrom').populate('gigs').then((result) => {
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


Router.put("/statusinvitation/:id", (req, res) => {
    const invitatinid = (req.params.id).trim()
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(401).json({
            message: "Id is requried for Authentication",
            status: 400,
        })
    }
    const { invitationStatus} = req.body

        const data = {
            invitationStatus:invitationStatus
        }
        Invitation.findOneAndUpdate({ _id:invitatinid}, { $set: data }, { new: true }).then((result) => {
            res.status(200).json({
                message: "change Invitation",
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

Router.get('/SuggestionInfluencers/:id',async(req,res) => {
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
    const currentGigs = await Gigs.findById(req.params.id);
    Userlogin.aggregate(
        [{ $match: {$and :[{ intrested: { $in: [...currentGigs.interests] } },{userselection:'Influencer'} ]} },
        {
            $lookup: {
                from: "Gigs",
                localField: "intrested",
                foreignField: "interests",
                as: "invite_user",
            },
            $lookup: {
                from: "Gigs",
                localField: "_id",
                foreignField: "user",
                as: "userInfo",
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