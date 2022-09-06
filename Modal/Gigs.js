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
            type:Array
        },
        channels:{
            type:Array
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
            type:Number  
        }
        

    }, { timestamps: true }
)




module.exports = mongoose.model('Gigs', Gigs);

