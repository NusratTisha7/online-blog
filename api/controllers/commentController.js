const Post = require('../../models/Posts')
const Comment = require('../../models/Comment')

exports.commentPostController = async(req, res, next) => {
    let { postId } = req.params 
    let { body } = req.body //bodyr moddhei comment likhbe user

    if (!req.user) { //check korbo je user ta comment korte chasse se authenticated obosthay ase kina
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }

    let comment = new Comment({
        post: postId,
        user: req.user._id, //kon user amader post e comment koreche.Comment model er moddhe amra ref User bole diyechilam.ref deya thakle amra easily populate korte parbo
        body, //amra chaile filter korte pari.jate aje baje comment korte na pare
        replies: [] 
    }) //comment er document toiri korlam

    try {
        let createdComment = await comment.save()  
        await Post.findOneAndUpdate(
            { _id: postId },
            { $push: { 'comments': createdComment._id } }  
        ) 

	//comment toiri hoar pore user er kase kisu data return korte hobe.data holo commentJSON
        let commentJSON = await Comment.findById(createdComment._id).populate({ //amra commentId dara comment ta find korlam ebong comment kari user k populate korlam
            path: 'user', //prottekta comment er sathe ekjon user(upore comment document toirir somoy user niyesilam) theke oi user k populate koresi
            select: 'profilePics username' //amra ki ki select korte chassi user theke ta bole dibo
        }) //mane je user comment korse tar profilePics o userName ber kore anbe karon ai duita jinish amader dorkar porbe
        
        return res.status(201).json(commentJSON) 
    } 
    catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occured'
        })
    }
}

exports.replyCommentPostController=async(req,res,next)=>{
    let {commentId}=req.params
    let {body}=req.body

    if (!req.user) {
        return res.status(403).json({
            error: 'Your are not an authenticated user'
        })
    }

    let reply={
        body,
        user:req.user._id
    }//reply er document toiri hoye gelo eta ar kothaw save hobe na.Comment models e replies name ekta array ase. sei array er moddhe obj ta push kore dite hobe.
    try{
        await Comment.findOneAndUpdate( 
            {_id:commentId},
            {$push:{'replies':reply}}
        ) //reply toiri kora sesh ebong comment array er moddhe save kora complete.ekhn ai reply obj tai amader provide korte hobe user k.amr ajokhn reply ta fron end e dekhane je reply ta korse tar profilepics taw dekhabo

        res.status(201).json({
            ...reply,
            profilePics:req.user.profilePics //amra user er sathe profilePics take embed koresilam tanahole prottekta jaygay populate er por populate korte hoto
        })
    }catch (e) {
        console.log(e)
        return res.status(500).json({
            error: 'Server Error Occured'
        })
    }
}