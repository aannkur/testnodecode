const express = require('express')
const Router = express.Router()
const MessageModel = require("../Modal/conversationmessage")
const mongoose = require('mongoose')

const multer = require("multer")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './postImage/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage })

Router.post("/message",upload.single("image"),(req, res) => {
    const { conversationId, text } = req.body
    const userid = req.headers['userid']
    if (!userid) {
        return res.status(400).json({
            message: "User Id Required on Header",
            status: 400,
        })
    }
    if(req.file) {
        const NewMessage = new MessageModel({
            userId: new mongoose.Types.ObjectId(),
            conversationId: conversationId,
            sender: userid,
            image: req.file.path
        })
        console.log("file")
        NewMessage.save().then((results) => {
            res.status(201).json({
                message: "New Message Add",
                success: true,
                results: results,
                status: 201
            })
        }).catch(err => {
            res.status(500).json({
                message: " server error",
                success: false,
                error: err
            })
        })
    } else {
        const NewMessage = new MessageModel({
            userId: new mongoose.Types.ObjectId(),
            conversationId: conversationId,
            sender: userid,
            text: text
        })
        console.log("text")
        NewMessage.save().then((results) => {
            res.status(201).json({
                message: "New Message Add",
                success: true,
                results: results,
                status: 201
            })
        }).catch(err => {
            res.status(500).json({
                message: " server error",
                success: false,
                error: err
            })
        })
    }
})

Router.get("/get-message", (req, res) => {
    const allconversation = MessageModel.find()
    allconversation.then(results => {
        if (results) {
            res.status(200).json({
                message: "All the data for message",
                success: true,
                results: results
            })
        }
    })
})

Router.get("/getmessageuser/:conversationId", (req, res) => {
    // const { conversationId } = req.body
    const conversationId = req.params.conversationId

    const userid = req.headers['userid']

    if (!userid) {
        res.status(422).json({
            message: "UserID Requried for get data"
        })
    }
    console.log(conversationId)
    const onemesReq = MessageModel.find({ conversationId: conversationId }).then((results) => {
        res.status(200).json({
            message: "Requirment Found",
            results: results,
            success: true,
        })
    }).catch(err => {
        res.status(500).json({
            message: "Server Error",
            error: err.message,
            success: false
        })
    })
})



module.exports = Router