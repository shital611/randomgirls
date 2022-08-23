var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// connection configurations
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loot-le-buddy',
    ssl_disabled:True
});
// connect to database
dbConn.connect();
// if(conn)
// console.log("database connected")
// Retrieve all users
app.get('/users', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
// Retrieve user with id
app.get('/user/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }
    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});
//register user
const multer = require('multer')
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage }).single('ProfilePic');
app.post('/RegisterUser', upload, function (req, res) {
    (Math.floor(100000 + Math.random() * 900000))
    const user = {
        UserID: req.body.UserID,
        Name: req.body.Name,
        Password: req.body.Password,
        ProfilePic: req.file.filename,
        PhoneNo: req.body.PhoneNo,
        Address: req.body.Address,
        Coins: req.body.Coins,
        OTP: (Math.floor(100000 + Math.random() * 900000)),
        CreatedDate: req.body.CreatedDate
    }
    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide user' });
    }
    dbConn.query("INSERT INTO users SET ? ", user, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});
//getparticularpooldetail
app.get('/usersdata/:poolid', function (req, res) {
    let poolid = req.params.poolid;
    dbConn.query('SELECT usersdata.UserId, usersdata.name,participants.poolid FROM usersdata INNER JOIN participants ON participants.userid=usersdata.UserId where participants.poolid=?', poolid, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
//adcoins
app.get('/adcoins/:UserId', function (req, res) {
    let UserId = req.params.UserId;
    // let query = 'SELECT usersdata.name, SUM(usersdata.coins + settings.adcoinsvalue) coins From usersdata, settings '
    dbConn.query(`UPDATE usersdata,settings SET coins = (SELECT SUM(usersdata.coins + settings.adcoinsvalue) coins) where usersdata.UserId=?`, UserId, function (error, results, fields) {
    // dbConn.query('UPDATE usersdata SET coins = sum(usersdata.coins + 10) where usersdata.UserId=?', UserId, function (error, results, fields) {
    // dbConn.query('UPDATE usersdata SET coins = (select SUM(usersdata.coins + settings.adcoinsvalue) where usersdata.UserId=?)', UserId, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});
module.exports = app;