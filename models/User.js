const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')
const env=require('dotenv')

const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Please provide name'],
        minlength:3,
        maxlength:30,
    },
    email:{
        type:String,
        required:[true,'Please provide email'],
        match:[/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"please provide valid email"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"please provide password"],
        minlength:6,
    },
})

UserSchema.pre('save', async function(next){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
    next()
})
UserSchema.methods.createJWT=function(){
    return jwt.sign({userId:this._id,name:this.name},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_LIFETIME,
    })
}
UserSchema.methods.comparePassword=async function (passwordstr) {
    const match=await bcrypt.compare(passwordstr,this.password)
    return match
}
module.exports=mongoose.model('User',UserSchema)