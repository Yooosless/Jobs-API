const User=require('../models/User')
const {StatusCodes}=require('http-status-codes')
const {BadRequestError, UnauthenticatedError}=require('../errors')


const register= async (req,res)=>{
    
    const ListofUsers= await User.create({...req.body})
    const token=ListofUsers.createJWT()
    res.status(StatusCodes.CREATED).json({Registered:{name:ListofUsers.name},token})
}

const login= async(req,res)=>{

    const{email,password}=req.body
    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    const user=await User.findOne({email})
    if(!user){
        throw new UnauthenticatedError('Username doesnt exist')
    }
    const checkPassword=await user.comparePassword(password)
    if(!checkPassword){
        throw new UnauthenticatedError('Wrong password')
    }
    const token=user.createJWT()
    res.status(StatusCodes.OK).json({UserExists:{name:user.name},token})
}

module.exports={
    register,login,
}