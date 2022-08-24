const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    UserID:{
        type:Number,
        //required:true,
        // unique:true
    },
    Name:{
        type:String,
        // required:true,
        trim:true
    },
    ProfilePic:{
        type:String,
        
        trim:true
    },
    PhoneNo:{
        type:Number,
      
    },
    Address:{
        type:String,
        // required:true,
        trim:true
    },
    Coins:{
        type:Number,
        
    },
    OTP:{
        type:Number
        
    },
    CreatedDate:{
        type:Date
     },
     Password:{
        type:String
     }

}
,{
    versionKey: false
})


const usersData=new mongoose.model("Users",userSchema)
module.exports=usersData