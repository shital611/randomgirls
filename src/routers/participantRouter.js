const express=require("express")
const router=express.Router()
const participantSchema=require("../models/participants")
router.get('/Getparticipants', async (req, res) => {
    try {
        const getUsers = await participantSchema.find({}).sort()
        res.status(201).send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/Getparticipants/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const p = new participantSchema()
        p.p_id = req.body.participantID
        const Getparticipants = await participantSchema.findById(_id)
        res.send(Getparticipants)
    } catch (e) {
        res.status(400).send(e)
    }
})

// ParticipateInPool
router.post('/ParticipateInPool',  async(req, res)=> {
    //fileSave();
    // console.log(req.file);
    var data = new participantSchema();
    data.ParticipantID= req.body.ParticipantID
    data.UserID= req.body.UserID
    data.PoolID =  req.body.PoolID
  
    var save = await data.save();
    console.log(save)

    if (save)
        res.send(save);
    else
        console.log('Error during record insertion : ' + err);
}); 

module.exports=router