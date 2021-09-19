const {Schema,model}=require('mongoose')

const commentSchema=new Schema({
    post:{
        type:Schema.Types.ObjectId,
        ref:'Post',
        required:true
    },
    user:{ //user sara post kora jabe na
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    body:{
        type:String,
        trim:true,
        required:true
    },
    replies:[ //replies ekta array jar moddhe onek obj royeche
        {
            body:{
                type:String,
                required:true
            },
            user:{ //kon user reply ta koreche
                type:Schema.Types.ObjectId,
                ref:'User', 
                required:true //login user sara kewi reply korte na pare
            },
            createAt:{
                type:Date,
                default:new Date() //jokhn data ta create hobe jokhn je date ta thakbe sei date tai default vabe set hoye jabe
            }
        }
    ]

},{timestamps:true})

const Comment=model('Comment',commentSchema)

module.exports=Comment