const express = require('express')
const { body, validationResult } = require('express-validator')
const router = express.Router()
const path = require('path')
const bcrypt = require('bcrypt')
const USERS = require('../models/database')

// Declaring custom middleware

router.post('/register', [
    body('fname', "กรุณากรอกชื่อจริง").trim().not().isEmpty(),
    body('lname', "กรุณากรอกนามสกุล").trim().not().isEmpty(),
    body('password', "กรุณากรอกรหัสผ่านอย่างน้อย 8 ตัวอักษร").trim().isLength({min:1}),
    body('confirm', "กรุณายืนยันรหัสผ่าน").trim().not().isEmpty(),
    body('tel', "กรุณากรอกเบอร์โทรศัพท์").trim().isLength({min:1}),
    body('email', "กรุณากรอกอีเมล").trim().not().isEmpty()],
    (req, res, next)=>{
        const {fname, lname, nname, email, password, confirm, tel} = req.body
        const validator_result = validationResult(req)
        let errors = validator_result.errors
        if(validator_result.isEmpty()){
            USERS.findOne({email:email}).exec((err, doc)=>{
                if(doc == null){
                    if(password === confirm){
                        bcrypt.hash(password, 10).then(hash_pass=>{
                            console.log("มาละจ้าาาาาาา")
                            let user_data = new USERS({
                                fname : fname,
                                lname : lname,
                                nname : nname,
                                email : email,
                                password : hash_pass,
                                tel : tel
                            })
                            USERS.saveUser(user_data, err=>{
                                if(err) console.log(err)
                                res.redirect('/')
                            })
                            
                        })
                    }else{
                        res.render('register', {msg_passErr:"กรุณายืนยันรหัสผ่านให้ตรงกัน"})
                    }
                }else{
                    console.log("มีอีเมลนี้ในระบบแล้ว")
                    res.render('register', {email_exist:"มีอีเมลนี้ในระบบแล้วจ้า"})
                }
            })
        }else{
            res.render('register', {errors:errors})
        }
})


router.post('/login',
    (req, res, next)=>{
        const {email, password} = req.body
        const validator_result = validationResult(req)
        let errors = validator_result.errors
        if(validator_result.isEmpty()){
            USERS.find({email:email}).exec((err, doc)=>{
                if(doc.length > 0){
                    bcrypt.compare(password, doc[0].password).then(compare_result=>{
                        if(compare_result === true){
                            req.session.user_email = email
                            req.session.user_pass = password
                            req.session.user_login = true
                            req.session.cookie.maxAge = 10000
                            res.redirect('/home')
                        }else{
                            res.render('login', {msg_passErr:"อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่1"})
                        }
                    })
                }else{
                    res.render('login', {msg_passErr:"อีเมล หรือ รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่2"})
                }
            })
        }else{
            res.render('login', {errors:errors})
        }
})

module.exports = router