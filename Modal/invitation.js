var mongoose = require('mongoose');


const invitation = mongoose.Schema(
    {
        userto: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'UserLogin'
        },
        userfrom: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'UserLogin'
        },
        gigs: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Gigs'
        },
        invitationStatus: {
            type: String,
            enum : ['Pending','Accept','Reject','Not-Send'],
            default: 'Not-Send'
        },
    }, { timestamps: true }
)




module.exports = mongoose.model('invitation', invitation);

