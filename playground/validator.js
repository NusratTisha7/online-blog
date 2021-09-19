const router = require('express').Router()
const { check, validationResult } = require('express-validator')
const Flash=require('../utils/Flash') 

router.get('/validator', (req, res, next) => {
    console.log(Flash.getMessage(req))//jodi kono flash message thake tahole sei flash message ta provide korbe
    res.render('playground/signup', { title: 'Validator Playground' })
})

router.post('/validator',
    [
        check('username')
            .not()
            .isEmpty()
            .withMessage('Username can not be empty')
            .isLength({ max: 15 })
            .withMessage('Username can not be greater than 15 character').trim(),
        check('email')
            .isEmail()
            .withMessage('Please Provide A Valid Email').normalizeEmail(),
        check('password').custom(value=>{
            if(value.length < 5){
                throw new Error('Password Must be greater than 5 character')
            }
            return true
        }),
        check('confirmPassword').custom((value,{req})=>{ 
            if(value !==req.body.password){
                throw new Error('Password Does Not Match')
            }
            return true
        })
    ],
    (req, res, next) => {
        let errors = validationResult(req)
        
        if(!errors.isEmpty()){
            req.flash('fail','There is Some Error')
        }else{
            req.flash('success','There is No Error')
        }

        res.redirect('/playground/validator')
    
    })

module.exports = router
