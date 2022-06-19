const express = require('express')
const router = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const USERS = require('../models/database')

// Declaring custom middleware

router.get('/', (req, res, next)=>{
    if(!req.session.user_login){
        res.redirect('/login')
    }else{
        res.redirect('/home')
    }
})

router.get('/home', (req, res, next)=>{
    if(req.session.user_login){
        USERS.find({email:req.session.user_email}).exec((err, doc)=>{
            const fullname = doc[0].fname+" "+doc[0].lname
            res.render('home', {fullname:fullname})
        })
    }else{
        res.redirect('/')
    }
})


router.get('/register', (req, res, next)=>{
    res.render('register')
})

router.get('/login', (req, res, next)=>{
    res.render('login')
})

router.get('/logout', (req, res, next)=>{
    req.session.destroy(err=>{
        res.redirect('/')
    })
})

module.exports = router