var mongoose = require('mongoose');


const Notification = mongoose.Schema(
    {
        userinterested: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'UserLogin'
        },
        gigsuser: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'UserLogin'
        },
        gigs: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Gigs'
        },
        reason: {
            type: String,
            enum : ['Interested','Accept','Reject'],
            default: ''
        },
    }, { timestamps: true }
)




module.exports = mongoose.model('Notification', Notification);

