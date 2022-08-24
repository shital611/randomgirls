const mongoose=require('mongoose')
const winnerHistorySchema=new mongoose.Schema({
    // ID:{
    //     type:Number,
    //     // required:true,
    //     // unique:true
    // },
    PoolID:{
        type:Number,
        // required:true,
        unique:true
    },
    Winner1UserID:{
        type:Number,
        // required:true,
        unique:true
    },
    Winner2UserID:{
        type:Number,
        // required:true,
        unique:true
    },
    Winner3UserID:{
        type:Number,
        // required:true,
        unique:true
    } 
}
,{
    versionKey: false
})

const winnerHistoryData=new mongoose.model("Winner",winnerHistorySchema)
module.exports=winnerHistoryData