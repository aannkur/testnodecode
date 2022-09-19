var mongoose = require('mongoose');


const Gigs = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref:'UserLogin'
        },
       
        heading:{
            type:String,
        },
        about:{
            type:String
        },
        country:{
            type:String
        },
        interests:{
            type:Array,
            default:[]
        },
        channels:{
            type:Array,
            default:[]
        },
        minimum_followers:{
            type:String
        },
        age_group:{
            type:String
        },
        gender:{
            type:String
        },

        pay_post:{
            type:String
        },
        commission:{
            type:String,  
        },
        status: {
            type: String,
            enum : ['Open','In-Process','Close'],
            default: 'Open'
        },
            interestPepole: [{ type: mongoose.Types.ObjectId, ref: 'UserLogin' }],
        
        

    }, { timestamps: true }
)




module.exports = mongoose.model('Gigs', Gigs);

