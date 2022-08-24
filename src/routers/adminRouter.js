const express=require("express")
const router=express.Router()
const adminSchema=require("../models/adminSchema")

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/logout', (req, res) => {
    res.redirect('/login')
})
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const adminemail = await adminSchema.findOne({ email: email })

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

module.exports=router