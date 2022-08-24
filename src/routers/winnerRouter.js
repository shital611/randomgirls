const express=require("express")
const router=express.Router()
const winnerSchema=require("../models/winnerHistory")

// getallwinners
router.get('/GetAllWinners',async (req,res)=>{
    try{
     const getallwinners = await winnerSchema.find({})
     res.status(201).send(getallwinners)
    }catch(e){
         res.status(400).send(e)
    }
 })

// GetPoolWinner
router.get('/GetPoolWinner/:PoolID', async(req, res) => {
    winnerSchema.find(({PoolID:req.params.PoolID}), (err,docs)=>{
        res.send(docs)
    })
 });

//  // make winner
router.post('/MakeWinner',  async(req, res)=> {
    //fileSave();
    // console.log(req.file);
    var data = new winnerSchema();
    data.PoolID= req.body.PoolID,
    data.Winner1UserID= req.body.Winner1UserID,
    data.Winner2UserID= req.body.Winner2UserID,
    data.Winner3UserID= req.body.Winner3UserID
    var save = await data.save();
    if (save)
        res.send(save);
    else
        console.log('Error during record insertion : ' + err);
}); 


 module.exports=router