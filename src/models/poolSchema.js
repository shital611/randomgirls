const mongoose=require('mongoose')
const urlSchema=new mongoose.Schema({
    PoolID:{
        type:Number,
        required:true,
        unique:true
    },
    PoolName:{
        type:String,
        //required:true,
        trim:true
    },
    Hemper1:{
        
        type: String,
        unique : false
    },
   
    Hemper1Worth:{
        type:Number,
       // required:true,
     },
     Hemper2:{
        type:String,
        unique : false
     },
   
    Hemper2Worth:{
        type:Number,
        //required:true,
     },
     Hemper3:{
        type:String,
        unique : false
    },
   
    Hemper3Worth:{
        type:Number,
        //required:true,
     },
    
    CoinsNeededToParticipate:{
        type:Number,
        //required:true,
    },
    PoolStartDate:{
        type:Date
    },
    PoolEndDate:{
        type:Date
    }
}
,{
    versionKey: false
}
)
const url_schema = new mongoose.model('pool', urlSchema);

module.exports = url_schema
