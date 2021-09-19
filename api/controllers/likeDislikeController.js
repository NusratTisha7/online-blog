const Post=require('../../models/Posts')

exports.likesGetController=async(req,res,next)=>{
    let {postId}=req.params //apiRoute.js er likes,dislikes route e amra postId diyechilam
    
    let liked=null //kono post liked obosthay ase kina ta check korar jonno ai variable ta.initial stage e null niyechi

    if(!req.user){
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }
    let userId=req.user._id
    try{
        let post= await Post.findById(postId) //prothome amra je post ta niye kaj korte chassi take ber kore anbo
        //check korte hobe je ai user ta ai post k previously dislikes koreche kina.jodi kore thake tahole ta remove korte hobe.Posts model er moddhe jeye dekhbo likes and dislikes just ekta array.jar moddhe User er id ta thakse.user jodi aghe likes kore thake tahole tar id ta likes id er moddhe thakbe,dislikes korle tar id ta dislikes er moddhe thakbe
        if(post.dislikes.includes(userId)){ //check korte hobe ai post er dislikes er je array ta ase tar moddhe user ase kina.jehetu array tai includes method ta use korechi
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{'dislikes':userId}}
            )
        }
        if(post.likes.includes(userId)){ //kono user like button e click korle first e check korbo se aghe dislike koresilo kina.dislike kore thakle dislike uthiye dibo.then check korbo user aghe like korese kina.aghe like kore abar jodi like button e click kore tahole dislike hoye jabe.ar aghe theke dislike,like na kore thakle like i hobe
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{'likes':userId}}
            )
            liked=false
        }else{
            await Post.findOneAndUpdate(
                {_id:postId},
                {$push:{'likes':userId}}
            )
            liked=true
        }
        let updatedPost=await Post.findById(postId)
        res.status(200).json({
            liked,
            totalLikes:updatedPost.likes.length, //likes array tar length dekhlei bujha jabe total koto like ase
            totalDislikes:updatedPost.dislikes.length
        })
    }catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occured'
        })
    }

}

exports.dislikesGetController=async(req,res,next)=>{
    let {postId}=req.params 
    let disliked=null 

    if(!req.user){
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }
    let userId=req.user._id
    try{
        let post= await Post.findById(postId) 
        if(post.likes.includes(userId)){ 
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{'likes':userId}}
            )
        }
        if(post.dislikes.includes(userId)){
            await Post.findOneAndUpdate(
                {_id:postId},
                {$pull:{'dislikes':userId}}
            )
            disliked=false
        }else{
            await Post.findOneAndUpdate(
                {_id:postId},
                {$push:{'dislikes':userId}}
            )
            disliked=true
        }
        let updatedPost=await Post.findById(postId)
        res.status(200).json({
            disliked,
            totalLikes:updatedPost.likes.length, 
            totalDislikes:updatedPost.dislikes.length
        })
    }catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occured'
        })
    }

}



