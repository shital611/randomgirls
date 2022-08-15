const mongoose=require('mongoose')
const participantsSchema=new mongoose.Schema({
    ParticipantID:{
        type:Number,
        required:true,
        unique:true
    },

    PoolID:{
        type:Number,
        required:true,
     
    },
    
    UserID:{
        type:Number,
        required:true,
        //unique:true
    }
}
,{
    versionKey: false
} )
const participantsData=new mongoose.model("Participants",participantsSchema)
module.exports=participantsData