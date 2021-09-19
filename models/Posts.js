const {Schema,model}=require('mongoose')

const Comment=require('./Comment')

const postSchema=new Schema({
    title:{
        type:String,
        trim:true,
        required:true,
        maxlength:100
    },
    body:{
        type:String,
        required:true,
        maxlength:5000
    },
    author:{ 
        type:Schema.Types.ObjectId, 
        ref:'User',
        required:true 
    },
    tags:{
        type:[String],
        required:true 
    },
    thumbnail:String,
    readTime:String,
    likes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }], 
    dislikes:[{
        type:Schema.Types.ObjectId,
        ref:'User'
    }],
    comments:[
        {
            type:Schema.Types.ObjectId, 
            ref:'Comment',
        }
    ]
},{timestamps:true})

postSchema.index({ //index namer function k call korbo ebong configaration bole dibo
    title:'text', 
    body:'text',
    tags:'text' //title,body,tags theke search korte chassi. text diyechi ja text search korar jonno amamder khub help korbe
},{ //priority set kore dite pari
    weights:{
        title:5,
        tags:5,
        body:2 //kar priority koto ta bole dilam
    }
})

const Post=model('Post',postSchema)

module.exports=Post


