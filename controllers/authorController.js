//ebar amra author k khuje ber korar cesta korbo
const Flash = require('../utils/Flash')
const User=require('../models/User')

exports.authorProfileGetController=async(req,res,next)=>{
    //at first id take destructure korbo
    let userId=req.params.userId //ai userId dara user k khuje ber korar cesta korbo
    //jehetu async tai try catch er moddhe rakhbo
    try{
        let author=await User.findById(userId) //userId dara find korlam
        //user er profile k populate korlam.ekhn ai profiler vitorew aro kisu populate kora dorkar hote pare.profiler er vitor theke post er array take populate korte hobe
        .populate({
            path:'profile',
            populate:{
                path:'posts'
            }
        })
        res.render('pages/explorer/author',{
            title:'Author Page',
            flashMessage: Flash.getMessage(req),
            author
        })
        console.log(author)
    }catch(e){
        next(e)
    }
    
}