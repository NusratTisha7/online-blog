const cheerio=require('cheerio')//html theke text pawar jonno cheerio niye kaj korte hoy
const moment=require('moment')

module.exports=()=>{
    return (req,res,next)=>{ 
        res.locals.user=req.user  
        res.locals.isLoggedIn=req.session.isLoggedIn || false
        res.locals.truncate=html=>{
            let node=cheerio.load(html) //cheerio.load() function tar vitore html provide kore dibo jeta ekta node toiri korbe
            let text=node.text() //amra text takew ber kore nilam

            text=text.replace(/(\r\n|\n|\r)/gm,'') //text theke kisu kisu bisoy amader replace korte hobe rejex er sahajje

            if(text.length<=100) return text

            return text.substr(0,100)+'...' //jodi text er length 100 er beshi hoy tahole 100 word porjonto show korbe
        } 
        res.locals.moment=time=>moment(time).fromNow() //eta muloto ekta function jeta argument akare time nibe ebong moment(time).fromNow() return korbe
        next()
    }
}
