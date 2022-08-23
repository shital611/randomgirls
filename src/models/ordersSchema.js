const mongoose=require('mongoose')
const OrdersSchema=new mongoose.Schema({
    Product_ID:{
        type:Number,
        required:true,
        unique:true
    },

    Status:{
        type:String,
        required:true,
     
    }
    
   
}
,{
    versionKey: false
} )
const OrdersData=new mongoose.model("Orders",OrdersSchema)
module.exports=OrdersData  