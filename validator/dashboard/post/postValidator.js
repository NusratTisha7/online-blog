const {body}=require('express-validator')
const cheerio=require('cheerio')

module.exports=[
    body('title')
        .not().isEmpty().withMessage('Title Can Not Be Empty')
        .isLength({max:100}).withMessage('Title Can Not Be Greater Than 100 Chars')
        .trim()
    ,
    body('body')
        .not().isEmpty().withMessage('Body Can Not Be empty')
        //length check korte hobe tar jonno cheerio use korte hobe
        .custom(value=>{
            let node=cheerio.load(value)
            let text=node.text()

            if(text.length>5000){
                throw new Error('Body can Not Be Greater Than 5000 Chars')
            }

            return true
        })
]