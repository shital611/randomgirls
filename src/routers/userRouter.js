const express=require("express")
const router=express.Router()
const userSchema=require("../models/userSchema")
const upload=require("../helpers/image_helper")
router.get('/adduser', async (req, res) => {
    res.render('adduser')
})

router.post('/adduser', upload.single('Profile_Pic'), function (req, res) {
    var data = new userSchema();
    data.UserID = req.body.UserID;
    data.Name = req.body.Name;
    data.ProfilePic = req.file.filename;
    data.Hemper1Worth = req.body.Hemper1Worth;
    data.PhoneNo = req.body.PhoneNo;
    data.Address = req.body.Address;
    data.Coins = req.body.Coins;
    data.OTP = req.body.OTP;
    data.CreatedDate = req.body.CreatedDate;
    var save = data.save();
    if (save)
        res.redirect('/getuser');
    else
        console.log('Error during record insertion : ' + err);
});

router.get('/getuser', async (req, res) => {
    userSchema.find((err, data1) => {
        if (!err) {
            res.render('index1', {
                list1: data1
            });
        }
        else {
            console.log('Error in retrieving url list :' + err);
        }
    })
})

router.get('/deleteuser/:id', async (req, res) => {
    var uid = req.params.id
    userSchema.findByIdAndRemove(uid, (err, doc) => {
        if (!err) {
            res.redirect('/getuser');
        }
        else { console.log('Error in video delete :' + err); }
    });
});


router.get('/GetAlluser', async (req, res) => {
    userSchema.find().then((result) => {
        res.json(result)


    }).catch((err) => {
        console.log(err)
    })
})


//get user detail
router.get('/GetUserDetail', async (req, res) => {
    try {
        const getUsers = await userSchema.find({}).sort({ "UserID": 1 })
        res.status(201).send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})


//get user detail by id
router.post("/PostUserDetail",async(req,res)=>{
    try{
        const addingUsers=new userSchema(req.body)
        console.log(req.body)
        const savedUserData=await addingUsers.save()
        //res.send("data stored")
        res.send(savedUserData)
    }catch(e){
        res.send(e)
    }
})


router.get('/GetUserDetail/:id',async (req,res)=>{
    try{
    const _id=req.params.id
    const getUsers=await userSchema.findById(_id)
    res.send(getUsers)
    }catch(e){
         res.status(400).send(e)
    }
    
 })

 router.patch('/GetUserDetail/:id',async (req,res)=>{
    try{
    const _id=req.params.id
    const getUsers=await userSchema.findByIdAndUpdate(_id,req.body,{
        new:true
    })
    res.send(getUsers)
    }catch(e){
         res.status(500).send(e)
    }
    
 })

router.delete('/GetUserDetail/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getUsers = await userSchema.findById(_id)
        res.send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})


//register user

router.post('/RegisterUser', upload.single('ProfilePic'), async (req, res) => {
    const file = req.file.filename
    const data = new userSchema({
       UserID: req.body.UserID,
       Name: req.body.Name,
       ProfilePic: file,
       PhoneNo: req.body.PhoneNo,
       Address: req.body.Address,
       Coins: req.body.Coins,
       OTP: (Math.floor(100000 + Math.random() * 900000)),
       CreatedDate: req.body.CreatedDate,
       Password:req.body.Password
   })
   try {
       const dataToSave = await data.save();
       res.status(200).json(dataToSave)
       // res.status(200).json(dataToSave.UserID +"," + dataToSave.OTP)
    }
   catch (error) {
       res.status(400).json({ message: error.message })
   }
});


router.put('/UpdateUser/:UserID',upload.single('ProfilePic'), async (req, res) => {
    const file = req.file.filename
    const data = {
        Name: req.body.Name,
        ProfilePic: file,
        Address: req.body.Address,
        Password:req.body.Password
    }  
    try {
        const dataToSave = await userSchema.updateOne({ UserID: req.params.UserID }, {
            $set: data
        })
        console.log(dataToSave)
        res.status(200).json("record updated!")
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
});

router.get('/getuser', async (req, res) => {
    userSchema.find((err, data1) => {
        if (!err) {
            res.render('index1', {
                list1: data1
            });
        }
        else {
            console.log('Error in retrieving url list :' + err);
        }
    })
})


// UserLogin
router.get('/UserLogin', async (req, res) => {
    try {
        const UserID = req.body.UserID
        const Password = req.body.Password
        const verifyUser = await userSchema.findOne({ UserID, Password })
        if (verifyUser)
            res.send(verifyUser)
        else
            res.send("Invalid login details")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

// VerifyOTP
router.get('/VerifyOTP', async (req, res) => {
    try {
        const UserID = req.body.UserID
        const OTP = req.body.OTP
        const VerifyOTP = await userSchema.findOne({ UserID, OTP })
        if (VerifyOTP)
        res.send("OTP verified successfully")
        else
            res.send("Invalid details")
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports=router
