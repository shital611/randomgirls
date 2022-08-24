const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const client = require('./db/conn.js')
const dotenv = require('dotenv')
const bodyparser = require('body-parser')
const poolrouter = require("./routers/poolRouter")
const userRouter=require("./routers/userRouter")
const participantRouter=require("./routers/participantRouter")
const settingRouter=require("./routers/settingRouter")
const winnerRouter=require("./routers/winnerRouter")
const adminRouter=require("./routers/adminRouter")
dotenv.config();
client();
app.use(bodyparser.urlencoded({
    extended: true
}));

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
app.use(poolrouter)
app.use(userRouter)
app.use(participantRouter)
app.use(settingRouter)
app.use(winnerRouter)
app.use(adminRouter)    
app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`)
})