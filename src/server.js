const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const connectDatabase = require('./db/conn.js')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const Admin = require('./models/adminSchema')
const urlSchema = require('./models/urlSchema')

const fs = require('fs');
const multer = require('multer');

const upload_file = require('./helpers/image_helper.js')


dotenv.config();
connectDatabase();
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

app.use(session({
    secret: uuidv4(), //  '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
    resave: false,
    saveUninitialized: true
}));


// app.get('/',(req,res) => {
//     // res.redirect('/login')

//     res.send(req.file.filename)
// })


// app.get('/register',(req,res) => {
//     const data = new Admin({
//         // email : "admin@admin.com",
//         // password : "123456"
//         email : "user@admin.com",
//         password : "456789"
//     })

//     data.save().then((result) => {
//         res.send(result)
//     }).catch((err) => {
//         console.log(err)
//     })
// })

// app.get('/getalllink', async (req, res) => {
//     Admin.find().then((result) => {
//         res.send(result)
//     }).catch((err) => {
//         console.log(err)
//     })
// })

app.get('/login',(req,res) => {
        res.render('login')
})

app.post('/login',async(req,res) => {
    try {
    const email = req.body.email
    const password = req.body.password
    
    const adminemail = await Admin.findOne({email:email})
    
    if(adminemail.password === password){
        req.session.user = req.body.email;
        // if(req.session.user){
        //     // console.log(req.session.user)        
        // }else{
        //     res.send("Unauthorize User")
        // }
        res.render('index', {user : req.session.user})    
        // res.status(201).redirect('/getvideos')
        // res.end("Login Successful")
    }
    else{
        res.send("Invalid login details")
    }
    } catch (error) {
        res.status(400).send(error.message)
   }
})

app.get('/addvideo',(req,res) => {
    res.render('add')
})

app.post('/addvideo',upload_file.single('video'), async(req,res) => {

    try {
        console.log(req.file)
        var url = new urlSchema()
        url.sr_no = req.body.sr_no
        url.url_title = req.body.url_title
        url.url_desc = req.body.url_desc
        url.video_file = req.file.filename;
        
        console.log(url)
        await url.save((err,data) => {
            if(!err)
            {
                // res.render('index', {
                //     list: data
                // });

                res.redirect('/getvideos')
            }
            else
                console.log(err)
        })
        
        } catch (error) {
            res.status(400).send(error.message)
       }
})


app.post('/addvideo',upload_file.single('video'),function (req,res){
    //fileSave();
    // console.log(req.file);
    var data = new urlSchema();
 
    data.sr_no = req.body.sr_no;
    data.url_link = req.body.url_link;
    data.url_desc = req.body.url_desc;
   data.video_file = req.file.filename;
    // data.video_file = req.file.files;
    var save = data.save();
       
    if (save)
       res.redirect('/');
    else
    console.log('Error during record insertion : ' + err);  
   });
   


// Dsiplay Data 
app.get('/getvideos', (req,res) => {

    // if(req.session.user){
    //     res.render('index', {user : req.session.user})

        
    // }else{
    //     res.send("Unauthorize User")
    // }

    urlSchema.find((err, data) => {
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


// To show select data on update element on edit.hbs page
 app.get('/updatevideo/:id', (req, res) => {
    urlSchema.findById({_id:req.params.id},req.body, { new: true },(err,docs)=>{
        console.log(docs)
       if(err)
       {
           console.log('Cant retrieve data and edit');
       }
       else
       {
           res.render('edit',{urldata:docs});
       }
    })
 });
  
 // Now Update Data here using ID
app.post('/updatevideo/:id',(req,res)=>{
    console.log(req.body)
      urlSchema.findByIdAndUpdate({_id:req.params.id},req.body,(err,docs)=>{
          if(err)
          {
              console.log('Error');
          }  
          else
          {  
              res.redirect('/getvideos');
          }
      });
});

// Delete data
app.get('/deletevideo/:id', async (req, res) => {
    var uid = req.params.id
    urlSchema.findByIdAndRemove(uid, (err, doc) => {
        if (!err) {
            res.redirect('/getvideos');
        }
        else { console.log('Error in video delete :' + err); }
    });
});


/*app.post('/addlink', async (req, res) => {
    const data = new urlSchema({
        sr_no : 1,
        url_link : "https://youtu.be/jcOKU9f86XE",
        url_desc: "software testing"
    })

    const data = new urlSchema()
    data.sr_no = req.body.sr_no
    data.url_link = req.body.url_link
    data.url_desc = req.body.url_desc


    data.save().then((result) => {
        res.send(result)
    }).catch((err) => {
        console.log(err)
    })
})*/


// api to get all videos
app.get('/getallvideos', async (req, res) => {
    urlSchema.find().then((result) => {
        res.json(result)


    }).catch((err) => {
        console.log(err)
    })
})


app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`)
})