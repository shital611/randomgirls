const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const client = require('./db/conn.js')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const Admin = require('./models/adminSchema')
const poolSchema = require('./models/urlSchema')
const usersData = require('./models/users')
const participantsData = require('./models/participants')

let dir = './uploads';
let multer = require('multer')
let fs = require('fs');
dotenv.config();
client();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(express.static('./assets/videos'));
app.use(bodyparser.json());
const PORT = process.env.PORT || 3000
const static_path = path.join(__dirname, '../public')
const template_path = path.join(__dirname, '../templates/views')
const partials_path = path.join(__dirname, '../templates/partials')
app.use(express.static(static_path))
app.set('view engine', 'hbs')
app.set('views', template_path)
hbs.registerPartials(partials_path)
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
const { fail } = require('assert')

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));

let upload = multer({
    storage: multer.diskStorage({
  
      destination: (req, file, callback) => {
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        callback(null, './uploads');
      },
      filename: (req, file, callback) => { callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); }
  
    }),
  
    fileFilter: (req, file, callback) => {
      let ext = path.extname(file.originalname)
      if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
        return callback(/*res.end('Only images are allowed')*/ null, false)
      }
      callback(null, true)
    }
  });
  
app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/logout', (req, res) => {
    res.redirect('/login')
})
app.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const adminemail = await Admin.findOne({ email: email })

        if (adminemail.password === password) {
            req.session.user = req.body.email;

            res.render('index', { user: req.session.user })

        }
        else {
            res.send("Invalid login details")
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})



app.get('/addpool', async (req, res) => {
    res.render('add')
})

app.post('/addpool', upload.any(), function (req, res) {
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

  



app.get('/getpool', async (req, res) => {
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
app.get('/updatepool/:id', async (req, res) => {
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


app.get('/deletepool/:id', async (req, res) => {
    var uid = req.params.id
    poolSchema.findByIdAndRemove(uid, (err, doc) => {
        if (!err) {
            res.redirect('/getpool');
        }
        else { console.log('Error in video delete :' + err); }
    });
});


app.get('/GetAllPools', async (req, res) => {
    poolSchema.find().then((result) => {
        res.json(result)


    }).catch((err) => {
        console.log(err)
    })
})


app.get('/adduser', async (req, res) => {
    res.render('adduser')
})

app.post('/adduser', upload.single('Profile_Pic'), function (req, res) {
    //fileSave();
    // console.log(req.file);
    var data = new usersData();
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

app.get('/getuser', async (req, res) => {
    usersData.find((err, data1) => {
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


app.get('/updateuser/:id', async (req, res) => {
    usersData.findById({ _id: req.params.id }, req.body, { new: true }, (err, docs) => {
        console.log(docs)
        if (err) {
            console.log('Cant retrieve data and edit');
        }
        else {
            res.render('edit', { urldata: docs });
        }
    })
});



app.post('/updateuser/:id', async (req, res) => {
    console.log(req.body)
    poolSchema.findByIdAndUpdate({ _id: req.params.id }, req.body, (err, docs) => {
        if (err) {
            console.log('Error');
        }
        else {
            res.redirect('/getuser');
        }
    });
});


app.get('/deleteuser/:id', async (req, res) => {
    var uid = req.params.id
    usersData.findByIdAndRemove(uid, (err, doc) => {
        if (!err) {
            res.redirect('/getuser');
        }
        else { console.log('Error in video delete :' + err); }
    });
});


app.get('/GetAlluser', async (req, res) => {
    poolSchema.find().then((result) => {
        res.json(result)


    }).catch((err) => {
        console.log(err)
    })
})

//---------------------------------------------------------------------------------------------------------------------------------------//

//get pool detail
app.get('/GetPoolDetail', async (req, res) => {
    try {
        const getUsers = await poolSchema.find({}).sort({ "PoolID": 1 })
        res.status(201).send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})

//GetParticularPoolDetail
app.get('/GetParticularPoolDetail/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getUsers = await poolSchema.findById(_id)
        res.send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})


//-------------------------------------------------------------UserDetail--------------------------------------------------------------------
//get user detail
app.get('/GetUserDetail', async (req, res) => {
    try {
        const getUsers = await usersData.find({}).sort({ "UserID": 1 })
        res.status(201).send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})


//get user detail by id
app.post("/PostUserDetail",async(req,res)=>{
    try{
        const addingUsers=new usersData(req.body)
        console.log(req.body)
        const savedUserData=await addingUsers.save()
        //res.send("data stored")
        res.send(savedUserData)
    }catch(e){
        res.send(e)
    }
})


app.get('/GetUserDetail/:id',async (req,res)=>{
    try{
    const _id=req.params.id
    const getUsers=await usersData.findById(_id)
    res.send(getUsers)
    }catch(e){
         res.status(400).send(e)
    }
    
 })

app.patch('/GetUserDetail/:id',async (req,res)=>{
    try{
    const _id=req.params.id
    const getUsers=await usersData.findByIdAndUpdate(_id,req.body,{
        new:true
    })
    res.send(getUsers)
    }catch(e){
         res.status(500).send(e)
    }
    
 })

app.get('/GetUserDetail/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getUsers = await usersData.findById(_id)
        res.send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})


app.delete('/GetUserDetail/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const getUsers = await usersData.findById(_id)
        res.send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }

})


//-------------------------------------------------------------------------------------------------//

app.get('/Getparticipants', async (req, res) => {
    try {
        const getUsers = await participantsData.find({}).sort()
        res.status(201).send(getUsers)
    } catch (e) {
        res.status(400).send(e)
    }
})


app.get('/Getparticipants/:id', async (req, res) => {
    try {
        const _id = req.params.id
        const p = new participantsData()
        p.p_id = req.body.participantID
        // const _id=req.params.id
        const Getparticipants = await participantsData.findById(_id)
        // const Getparticipants=await participantsData.findById(p_id)
        res.send(Getparticipants)
    } catch (e) {
        res.status(400).send(e)
    }
})




app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})


 app.post('/RegisterUser',upload.any() ,function(req, res) {
   
    var data = new usersData();
    data.Password=req.body.Password
    data.otp=Math.floor(100000 + Math.random() * 900000)
    data.Name = req.body.Name;
    // data.ProfilePic =req.files[3] && req.files[3].filename ? req.files[3].filename : '';
    // data.ProfilePic=req.file.filename
    data.PhoneNo = req.body.PhoneNo;
    data.Address = req.body.Address;
    var save = data.save();
    if (save){
     res.send(data)
    }
    else
        console.log('Error during record insertion : ' + err);
});


//ParticipateInPool
app.post('/ParticipateInPool', async (req, res) => {
    const data = new participantsData({
        participantid: req.body.participantid,
        userid: req.body.userid,
        poolid: req.body.poolid,
    })
    try {   
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})









