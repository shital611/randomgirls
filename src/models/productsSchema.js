const mongoose=require('mongoose')
const ProductsSchema=new mongoose.Schema({
   

    Name:{
        type:String,
        required:true,
     
    }
    
   
}
,{
    versionKey: false
} )
const ProductsData=new mongoose.model("Products",ProductsSchema)
module.exports=ProductsData  