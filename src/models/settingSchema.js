const mongoose=require('mongoose')
const settingSchema=new mongoose.Schema({
    AdCoinsValue:{
        type:Number,  
    },
    GoogleAdID:{
        type:String, 
    },
     AppVersion:{
        type:String,
      
    }
}
,{
    versionKey: false
} )
const settingsData=new mongoose.model("SettingsTable",settingSchema)
module.exports=settingsData

