const fs = require('fs')
const User = require('../models/User')
const Profile = require('../models/Profile')
const e = require('express')

exports.uploadProfilePics = async (req, res, next) => {
    if (req.file) {
        try {
            let oldProfilePics=req.user.profilePics
            let profile = await Profile.findOne({ user: req.user._id })
            let profilePics = `/uploads/${req.file.filename}`
            if (profile) {
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics } }
                )
            }
            await User.findOneAndUpdate(
                { _id: req.user._id },
                { $set: { profilePics } }
            )
            if(oldProfilePics!=='/uploads/default.png'){
                fs.unlink(`public${oldProfilePics}`,err=>{
                    if(err) console.log(err)
                })
            }
            res.status(500).json({
                profilePics
            })

        } catch (e) {
            res.status(500).json({
                profilePics: req.user.profilePics
            })
        }
    } else {
        res.status(500).json({
            profilePics: req.user.profilePics
        })
    }
}

exports.removeProfilePics =  (req, res, next) => {
    try {
        let defaultProfile = '/uploads/default.png'
        let currentProfilePics = req.user.profilePics

        fs.unlink(`public${currentProfilePics}`, async(err) => {
            let profile = await Profile.findOne({ user: req.user._id })
            if (profile) { 
                await Profile.findOneAndUpdate(
                    { user: req.user._id },
                    { $set: { profilePics: defaultProfile } } 
                )
            }
            await User.findOneAndUpdate( 
                { _id: req.user._id },
                { $set: { profilePics: defaultProfile } }
            )
        })
        res.status(200).json({
            profilePics: defaultProfile
        })
    } catch (e) {
        console.log(e) 
        res.status(500).json({
            message: 'Can not Remove Profile Pics'
        })
    }
}

exports.postImageUploadController=(req,res,next)=>{
    if(req.file){ //check korbo req er sathe kono file ase kina. jodi thake tahole ekta json return korbo
        return res.status(200).json({
            imgUrl:`/uploads/${req.file.filename}` //front end e(tinymce.js) object toiri korar somoy bolechilam amader return ashbe data.imgUrl. tai ekhane property diyechi imageUrl. req.file.filename dara file name ta ki ta amra provide kore dibo
        })
    }
    //jodi kono file pawa na jay
    return res.status(500).json({
        message:'Server Error'
    })
}



