const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordDate : {
         type:Date
    },
    date:{
        type:Date,
        default:Date.now
    }
})

module.exports = mongoose.model('user',UserSchema)