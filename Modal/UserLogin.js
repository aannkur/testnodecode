var mongoose = require('mongoose');


const UserLogin = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId
        },
       
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            require: true,
            trim: true,
        },
        onboarding: {
            type:Boolean,
            default:false
        },
        token:{
            type:String
        },
        firstName:{
            type:String
        },
        lastName:{
            type:String
        },
        gender:{
            type:String
        },
        dob:{
            type:Date
        },
        city:{
            type:String
        },
        country:{
            type:String
        },
        state:{
            type:String
        },
        about:{
            type:String
        },
        image : {
            type:String,
            default:'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
         coverimage : {
            type:String,
            default:'https://images.coinbase.com/avatar?h=6167e77e937b6a1ad6721fgMjjtXk0n439ENDSUWEmi1y6LBSIkjKnEfHFTy%0Ak5Mo&s=128'
        },
        customerType:{
            type:String,
            default:''
        },
        intrested:{
            type:Array,
            default:[]
        },
        userselection:{
            type:String
        },
        price:{
            type:String
        },
        profile_complate:{
            type:String
        }
        

    }, { timestamps: true }
)




module.exports = mongoose.model('UserLogin', UserLogin);

