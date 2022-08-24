const express=require("express")
const router=express.Router()
const poolSchema=require("../models/poolSchema")
const participantSchema=require("../models/participants")
const upload=require("../helpers/image_helper")
router.use(express.static('./uploads')) 
router.use('/GetParticularPoolDetails',express.static('./uploads'));
router.get('/addpool', async (req, res) => {
    res.render('add')
})

router.post('/addpool', upload.any(), function (req, res) {
    //fileSave();
    // console.log(req.file);
    var data = new poolSchema();

    data.PoolID = req.body.PoolID;
    data.PoolName = req.body.PoolName;
    // data.url_desc = req.body.url_desc;
    data.Hemper1 =req.files[0] && req.files[0].filename ? req.files[0].filename : '';
        
    // data.Hemper1 = req.file.filename;
    data.Hemper1Worth = req.body.Hemper1Worth;
    data.Hemper2=req.files[1] && req.files[1].filename ? req.files[1].filename : '';
    // data.Hemper2 = req.file.filename;
    data.Hemper2Worth = req.body.Hemper2Worth;
    data.Hemper3= req.files[2] && req.files[2].filename ? req.files[2].filename : '';
    // data.Hemper3 = req.file.filename;
    data.Hemper3Worth = req.body.Hemper3Worth;
    data.CoinsNeededToParticipate = req.body.CoinsNeededToParticipate;
    data.PoolStartDate = req.body.PoolStartDate;
    data.PoolEndDate = req.body.PoolEndDate;
    var save = data.save();

    if (save)
        res.redirect('/getpool');
    else
        console.log('Error during record insertion : ' + err);
}); 

router.get('/getpool', async (req, res) => {
    poolSchema.find((err, data) => {
        if (!err) {
            res.render('index', {
                list: data
            });
        }
        else {
            console.log('Error in retrieving url list :' + err);
        }
    })


})
router.get('/updatepool/:id', async (req, res) => {
    poolSchema.findById({ _id: req.params.id }, req.body, { new: true }, (err, docs) => {
        console.log(docs)
        if (err) {
            console.log('Cant retrieve data and edit');
        }
        else {
            res.render('edit', { urldata: docs });
        }
    })
});

router.get('/deletepool/:id', async (req, res) => {
    var uid = req.params.id
    poolSchema.findByIdAndRemove(uid, (err, doc) => {
        if (!err) {
            res.redirect('/getpool');
        }
        else { console.log('Error in video delete :' + err); }
    });
});

// GetAllPools
router.get('/GetAllPools', async (req, res) => {
    try {
        const getUsers = await poolSchema.find({}).sort({ "PoolID": 1 })
        res.status(201).send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})
//Admin GetParticularPoolDetail
router.get('/GetParticularPoolDetails/:poolid', function(req,res){
    participantSchema.aggregate([
       
        { $lookup:
            {
              from: 'users',
              localField: 'UserID',
              foreignField: 'UserID',
              as: 'UserDetails'
            }
          }
        ,{ $match : { poolid : Number(req.params.poolid) } },
        
        {
            $project: {
                _id:0,
                Name: { $arrayElemAt:["$UserDetails.Name",0],},
                ProfilePic: { $arrayElemAt:["$UserDetails.ProfilePic",0],}
             }
        }
        ] ).then((result) => {
            if(result=='')
            {
                res.send("No user registered with this pool")
            }
            else{
            res.render('index3', {
                list3: result
            });
        }
        }
          )
          .catch((error) => {
            console.log(error);
          });
})

//GetParticularPoolDetail
router.get('/GetParticularPoolDetail/:poolid', function(req,res){
    participantSchema.aggregate([
       
        { $lookup:
            {
              from: 'users',
              localField: 'UserID',
              foreignField: 'UserID',
              as: 'UserDetails'
            }
          }
        ,{ $match : { poolid : Number(req.params.poolid) } },
        
        {
            $project: {
                _id:0,
                Name: { $arrayElemAt:["$UserDetails.Name",0],},
                ProfilePic: { $arrayElemAt:["$UserDetails.ProfilePic",0],}
             }
        }
        ] ).then((result) => {
            if(result == ''){
                res.send("No user registered with this pool")
            }else{ 
                res.send(result)
            }
          })
          .catch((error) => {
            console.log(error);
          });
})

module.exports=router