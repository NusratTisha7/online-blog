const { validationResult } = require('express-validator')
const Flash = require('../utils/Flash')
const User = require('../models/User')
const Profile = require('../models/Profile')
const Comment = require('../models/Comment')

const errorFormatter = require('../utils/validationErrorFormatter')

exports.dashboardGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne(
            { user: req.user._id }
        ).populate({
            path:'posts',
            select:'title thumbnail'
        }).populate({
            path:'bookmarks',
            select:'title thumbnail'
        })
        if (profile) {
            return res.render('pages/dashboard/dashboard', {
                title: 'My Dashboard',
                flashMessage: Flash.getMessage(req),
                posts:profile.posts.reverse().slice(0,3), //recently 3tar beshi post dekhabe na
                bookmarks:profile.bookmarks.reverse().slice(0,3)
            })
        }
        res.redirect('/dashboard/create-profile')
    } catch (e) {
        next(e)
    }
    res.render('pages/dashboard/dashboard', { title: 'My dashboard', flashMessage: Flash.getMessage(req) })
}

exports.createProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id })
        if (profile) {
            return res.redirect('/dashboard/edit-profile')
        }
        res.render('pages/dashboard/create-profile', { title: 'Create Your Profile', flashMessage: Flash.getMessage(req), error: {} })
    } catch (e) {
        next(e)
    }
}

exports.createProfilePostController = async (req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter)
    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', { title: 'Create Your Profile', flashMessage: Flash.getMessage(req), error: errors.mapped() })
    }
    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter
    } = req.body 

    try { 
        let profile = new Profile({
            user: req.user._id, 
            name,
            title,
            bio,
            profilePics: req.user.profilePics,
            links: { 
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || ''
            },
            posts: [], 
            bookmarks: []
        }) 

        let createdProfile = await profile.save() 
        await User.findOneAndUpdate(
            { _id: req.user._id },
            { $set: { profile: createdProfile._id } } 
        ) 

        req.flash('success', 'Profile Created Successfully')
        res.redirect('/dashboard')
    } catch (e) {
        next(e)
    }
}

exports.editProfileGetController = async (req, res, next) => {
    try {
        let profile = await Profile.findOne({ user: req.user._id }) //profile khuje ber korar cesta korbe
        if (!profile) {
            return res.redirect('/dashboard/create-profile')
        }

        res.render('pages/dashboard/edit-profile', { title: 'Edit Your Profile', flashMessage: Flash.getMessage(req), error: {}, profile })

    } catch (e) {
        next(e)
    }
}

exports.editProfilePostController = async(req, res, next) => {
    let errors = validationResult(req).formatWith(errorFormatter)
    let {
        name,
        title,
        bio,
        website,
        facebook,
        twitter
    } = req.body
    if (!errors.isEmpty()) {
        return res.render('pages/dashboard/create-profile', {
            title: 'Create Your Profile',
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            profile: {//profile obj er vitore ektu aghe user jei data ghula provide koreche sei data ghulai thakbe
                name,
                title,
                bio,
                links:{
                    website,
                    facebook,
                    twitter
                }
            }
        })
    }
    try{ //try catch block er vitore amra ekta obj create korbo amader profile obj er moton kore
        let profile = {
            name,
            title,
            bio,
            links: { 
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || ''
            }
        } //ai data ghulokei amra update korbo

        let updatedProfile=await Profile.findOneAndUpdate(
            {user:req.user._id}, //1st argument hisebe kar maddhome update korbo ta bole dibo
            {$set:profile},
            {new:true} //orthat notun kore pawa data take se return korbe
        )
        req.flash('success', 'Profile Updated Successfully')
        
        //notun updated profile er data soho amra amader page take render korbo
        res.render('pages/dashboard/edit-profile', { title: 'Edit Your Profile', flashMessage: Flash.getMessage(req), error: {}, profile:updatedProfile })

    }catch(e){
        next(e)
    }
}


exports.bookmarksGetController=async(req,res,next)=>{
    try{
        //prothome amader chinta korte hobe bookmarks ase kothay.bookmark profile er vitore arary akare ase.ai array take amader niye ashte hobe sekhane just post er id ghula ase kintu sudhu id thakle hobe na amader populate kore hbe,populate kore title,thumbnail eghula jinis amader ante hobe
        let profile=await Profile.findOne({user:req.user._id}) //jehetu ai page sudhu matro login user rai dekhte parbe tai req er sathe obossoi user ta royeche
        .populate({
            path:'bookmarks', //er aghe jehetu repllies er vitor theke author k ber korte parsilam easily karon amra .author bole dite parsilam kintu ekhane amra dot kake bolbo.In that case amra bolbo path:'bookmarks'.kintu bookmarks to kono model na je take amra populate korte parbo tar vitor theke data ghula niye ashte parbo,sekhetre amader kon model ase sei model er property ta bole dite pari.In that case amamder model hosse Post.ebong select bole dite pari kake kake selet korte chassi select:'title thumbnail
            model:'Post',
            select:'title thumbnail'
        })  
        //res.json(profile) //amra check korte pari ki ki populate koresi
        res.render('pages/dashboard/bookmarks',{
            title:'My Bookmarks',
            flashMessage: Flash.getMessage(req),
            posts:profile.bookmarks //finally amader post take provide korte hobe.post ta ase profile er vitore. so,posts:profile.bookmarks

        })

    }catch(e){
        next(e)
    }
}

exports.commentsGetController=async(req,res,next)=>{
    try{
        //amder post ghuloke prothome khujte hobe. ebong ai post ghulo theke ba amader comment collection theke je comment ghulo ai post er sathe related hobe ba ai post ghulor vitore thakbe sei ghulo k sudhu matro se show korbe. amader profile theke post ghulok ber kore ante hobe prothome 
        let profile=await Profile.findOne({user:req.user._id}) //amader kase user ase tai user er maddhome profile take findOne korbo
        let comments=await Comment.find({post:{$in:profile.posts}}) //amra post id dara comment k find korbo.kintu ekhane to ekta post er id na onek ghulo post id ase.amader onek ghulo post id niye kaj korte hobe ai id ghular moddhe jekono ekta id er sathe jodi comment mile jay tahole se cmment take niye ashbe erokm situation e amader in operator niye kaj korte hobe. $in:ebong finally kon array er upor vitti kore in operator ta kaj korbe seta bole dite hobe.seta muloto amamder profile er moddhe thaka post array ta. 
            .populate({ //amra jokhn query korbo tokhn comment amader k ki dibe?ekta userid dibe,post dibe,ekta body dibe ar replies dibe jar vitore kisu body thakbe.actually amader ai comments take properly populate korte hobe.amader jante hobe je amra kon post niye kaj korsi ba ai comment ta kon post e hoyeche.amder title ta jana dorkar amra user k show korte chassi tanahole admin theke amra bujhobo kivabe je ai comment ta kon post e hoyeche.tai amader title ta dorkar 
                path:'post',
                select:'title'
            }) 
            .populate({ //ebar amra populate korbo user k
                path:'user',
                select:'username profilePics'
            }) 
            .populate({
                path:'replies.user',
                select:'username profilePics'
            }) 
            //res.json(comments) //etoghulo populate korar pore amader comment array ta kemon dekhte hosse ta dekhar jonno
            res.render('pages/dashboard/comments',{
                title:'My Recent Comments',
                flashMessage: Flash.getMessage(req),
                comments

            })
    }catch(e){
        next(e)
    }
}

