const {Schema,model} =require('mongoose')

const userSchema =new Schema({
    username:{
        type:String,
        trim:true,
        maxlength:15,
        required:true,
    },
    email:{
        type:String,
        trim:true,
        required:true,
    },
    password:{
        type:String,
        required:true
    },
    profile:{ 
        type:Schema.Types.ObjectId, 
        ref:'Profile'  
    },
    profilePics:{ //profilePics take amra profile er vitorew rakhte partam. kintu amra user er moddhe rakhbo jeno amader ref ta pete sohoj hoy. jekhanei user ase sekhanei user er ekta profilePics er amader dorkar hoy. jodi user theke profile er vitore jeye tarpore profilePics ta ante hoy tahole amader query ta besi kora laghe,populate kora laghe.but jodi ekta ref user er vitor rekhe dey ai kaj ghula kora laghbe na.
        type:String,
        default:'/uploads/default.png'
    }
},{
    timestamps:true 
})

const User=model('User',userSchema)
module.exports=User;