const {body}=require('express-validator')
const validator=require('validator')

const linkValidator=value=>{ //custom er vitore validator function pabo ekta. sei validator function er moddhe value pawa jabe.  
    if(value){ //jodi value thake tahole value ta validator er link kina ta check korbe
        if(!validator.isURL(value)){ //url k amader value dara check korbo
            throw new Error('Please Provide Valid URL') //jodi false return kore tahole ai message show korbe
        }
    }
    return true //custom validator use korar somoy seta jodi promise return na kore tahole return value likhte hobe
}
//amra custom vabe korar karone eta sudhu matro tokhoni run korbe jokhn amader input field e kisu ekta thake.

module.exports=[
    //sothik vabe validation korte chaile amader Profile Model er reference ta dorkar hobe. Profile er vitore User ase jeta amader dite hobe na. karon login user sara to ai khane ashte parbe na.so, user request er sathe thakbe
    body('name')
        .not().isEmpty().withMessage('Name Can Not be Empty')
        .isLength({max:50}).withMessage('Name Can Not Be More Than 50 Chars')
        .trim()
        ,
    body('title')
        .not().isEmpty().withMessage('Title Can Not be Empty')
        .isLength({max:100}).withMessage('Title Can Not Be More Than 100 Chars')
        .trim()
    ,
    body('bio')
        .not().isEmpty().withMessage('Bio Can Not be Empty')
        .isLength({max:500}).withMessage('Bio Can Not Be More Than 500 Chars')
        .trim()
    ,
    body('website')
        .custom(linkValidator)
    ,
    body('facebook')
        .custom(linkValidator)
    ,
    body('twitter')
        .custom(linkValidator)
    ,
    body('github')
        .custom(linkValidator)
    ,
]


