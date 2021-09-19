const Flash=require('../utils/Flash')
const Post=require('../models/Posts')
const moment = require('moment')
const Profile=require('../models/Profile')

function genDate(days){
    let date=moment().subtract(days,'days')
    return date.toDate()
}
function generateFilterObject(filter){ 
    let filterObj={}
    let order=1

    switch(filter){
        case 'week':{
            filterObj={
                createdAt:{
                    $gt:genDate(7) 
                }
            }
            order=-1 
            break
        }
        case 'month':{
            filterObj={
                createdAt:{
                    $gt:genDate(30)
                }
            }
            order=-1
            break
        }
        case 'all':{
            order=-1
            break
        }
    }
    return{
        filterObj,
        order
    }
}
exports.explorerGetController=async(req,res,next)=>{

    let filter=req.query.filter || 'latest'
    let currentPage=parseInt(req.query.page) || 1  
    let itemPerPage=1 
    let {order,filterObj}=generateFilterObject(filter.toLowerCase()) 
    try{
        let posts= await Post.find(filterObj)
            .populate('author','username') 
            .sort(order===1?'-createdAt':'createdAt')
            .skip((itemPerPage*currentPage)-itemPerPage)
            .limit(itemPerPage)
        let totalPost=await Post.countDocuments()
        let totalPage=totalPost/itemPerPage

        let bookmarks=[]
        if(req.user){  
            let profile=await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks=profile.bookmarks
            }
        }
        res.render('pages/explorer/explorer',{
            title:'Explore All Posts',
            filter,
            flashMessage:Flash.getMessage(req),
            posts,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks
        })
    }catch(e){
        next(e)
    }
}

exports.singlePostGetController=async(req,res,next)=>{
    let {postId}=req.params //url theke postId destructure kore niyechi
    try{
        let post=await Post.findById(postId) //post take khuje ber korbo id dara
            .populate('author','username profilePics')
            .populate({
                path:'comments',
                populate:{ //post theke comment k populate korechi. comments k abaro populate korechi
                    path:'user',
                    select:'username profilePics'//duiti data k amra destructure korchi
                }
            })
            .populate({ //ebar replies niye kaj korbo.replies kew amader ber kore niye ashte hobe.
                path:'comments',
                populate:{
                    path:'replies.user', //replies er moddhe user k populate korte chassi.replies kintu collection na tai replies populate hobe na.collection sara kono kisu populate hobe na.
                    select:'username profilePics' //username profilePics ai duita data amra populate korte chassi
                }
            })//evabe amra post take ber kore niye ashbo tahole somosto data amra post er provide korte parbo
        if(!post){
            let error=new Error('404 Page Not Found')
            error.status=404
            throw error
        }
	
	//amra singlePage.ejs er moddhe bookmark er ekta option bole diyechilam
        let bookmarks=[]
        if(req.user){
            let profile=await Profile.findOne({user:req.user._id})
            if(profile){
                bookmarks=profile.bookmarks //amra profile k find kore profile theke bookmarks k ber kore niye ashlam 
            }
        }
        res.render('pages/explorer/singlePageView',{
            title:post.title,
            flashMessage:Flash.getMessage(req),
            post,
            bookmarks
        })
    }catch(e){
        next(e)
    }
}



