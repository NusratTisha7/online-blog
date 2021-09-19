//Search Controller er moddhe amader pagination niye kaj korte hobe. search Controller er moddhe amra ekta terms pabo querystring akare. jodio search er jonno ekta input field ase jekhane ekta form ase tarporerw amra postRoute niye kaj korsi na gerRoute niye kaj korsi. amader getRoute e query string akakre search er term ta ashbe se term take amader ber kore nite hobe ebong ber kore niye amra somosto search ta korbo,pagination niye kaj korbo 
const Post = require("../models/Posts")
const Flash=require('../utils/Flash')
exports.searchResultGetController=async(req,res,next)=>{
    let term=req.query.term //term take amra ber kore ani.query parameter akakre term ta ase
    let currentPage=parseInt(req.query.page) || 1
    let itemPerPage=10

    try{
        let posts=await Post.find(
            {$text:{$search:term}} //amra ekta obj provide korbo $text.$text er ortho hosse amra text search korte chassi. arekta obj provide korbo $search and finally search term ta provide kore dite hobe 
        )
        .skip((itemPerPage*currentPage)-itemPerPage)
        .limit(itemPerPage)

        let totalPost=await Post.countDocuments({
            $text:{
                $search:term
            }
        })
        let totalPage=totalPost/itemPerPage

        res.render('pages/explorer/search',{
            title:`Result for=${term}`,
            flashMessage:Flash.getMessage(req),
            searchTerm:term,
            itemPerPage,
            currentPage,
            totalPage,
            posts
        })

    }catch(e){
        next(e)
    }
}