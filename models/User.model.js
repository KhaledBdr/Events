const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema =new mongoose.Schema({
    name : {
        required : true,
        type: String
    },
    email : {
        required : true,
        type: String
    },
    password : {
        required : true,
        type : String
    },
    image : {
        type : String,
        default : 'default.jpg'
    },
    joinDate : {
        type : Date,
        default :  Date.now()
    },
    isAdmin : {
        type : Boolean,
        default : false
    },
    isSuperAdmin : {
        type : Boolean,
        default : false
    }
})

userSchema.statics.hashPassword = async(password)=>{
    return bcrypt.hashSync(password , bcrypt.genSaltSync(10) , null)
}

userSchema.methods.validPassword = (password , user)=>{
    return bcrypt.compareSync(password , user.password)
}

module.exports.User = mongoose.model('users' , userSchema)