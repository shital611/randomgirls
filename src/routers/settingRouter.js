const express=require("express")
const router=express.Router()
const settingSchema=require("../models/settingSchema")
const userSchema=require("../models/userSchema")


//Settings API
router.get('/GetSettingData',function (req, res){
    res.render('setting')
})
router.post('/GetSettings', async(req, res) =>{
    var data = new settingSchema();
    data.AdCoinsValue = req.body.AdCoinsValue;
    data.GoogleAdID = req.body.GoogleAdID;
    data.AppVersion = req.body.AppVersion;
    var save = await data.save();
    if (save){
        res.send('Data inserted successfully' );
        
    }
    else
        console.log('Error during record insertion : ' + err);
});

router.get('/GetAllSettings', async (req, res) => {
    settingSchema.find((err, data2) => {
        if (!err) {
            res.render('index2', {
                list2: data2
            });
        }else {
            console.log('Error in retrieving url list :' + err);
        }
    })

})

// GetSetting
router.get('/GetSettings',async (req,res)=>{
    try{
     const getUsers=await settingSchema.find({})
     res.status(201).send(getUsers)
    }catch(e){
         res.status(400).send(e)
    }
    
 })

//EarnCoins
router.put('/EarnCoins/:UserID', async (req, res) => {
    try {
        const getCoinValue = await settingSchema.find({}, { _id: false, AdCoinsValue: true })
        if (getCoinValue) {
            userSchema.find(({ UserID: req.params.UserID }), { _id: false, Coins: true }, (err, docs) => {
                var object1 = getCoinValue
                console.log(object1)
                //convert
                var result = {};
                for (var i = 0; i < object1.length; i++) {
                    result = object1[i].AdCoinsValue;
                }
                var object2 = docs
                //convert
                var result1 = {};
                for (var i = 0; i < object2.length; i++) {
                    result1 = object2[i].Coins;
                }
                const coins = parseInt(result) + parseInt(result1);
                userSchema.updateOne(({ UserID: req.params.UserID }), { Coins: coins }, (err, docs) => {
                    if (err) {
                        console.log('Error' + err);
                    }
                    else {
                        res.status(200).json(docs)
                    }
                });
            })
        }
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports=router