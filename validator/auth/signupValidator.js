const {body}=require('express-validator')
const User=require('../../models/User')

module.exports=[
    body('username')
        .isLength({min:2, max:15}).withMessage('Username Must Be Between 2 to 15 Chars')
        .custom(async username=>{
            let user=await User.findOne({username})
            if(user){
                return Promise.reject('Username Already Used')
            }
        }).trim(),
    body('email')
        .isEmail().withMessage('Please provide a valid email')
        .custom(async email=>{
            let user=await User.findOne({email})
            if(user){
                return Promise.reject('Email Already Used')
            }
        }).normalizeEmail(),
    body('password')
        .isLength({min:5}).withMessage('Your Password Must Be Greater than 5 character'),
    body('confirmPassword')
        .custom((confirmPassword,{req})=>{
            if(confirmPassword!==req.body.password){
                throw new Error('Password Does Not Match')
            }
            return true
        })
]




