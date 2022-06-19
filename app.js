const express = require('express')
const getRouter = require('./routes/getRouter')
const postRouter = require('./routes/postRouter')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session({
    secret:"usersession",
    resave:false,
    saveUninitialized:false
}))
app.use('/', getRouter)
app.use('/', postRouter)
app.use(cookieParser())


app.listen((8080), ()=>{
    console.log("START SERVER 8080...")
})