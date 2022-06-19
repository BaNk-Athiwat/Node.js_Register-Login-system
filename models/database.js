// ใช้งาน mongoose
const mongoose = require('mongoose')

// เชื่อมต่อกับ mangoDB
const dburl = 'mongodb://localhost:27017/usersDB'
mongoose.connect(dburl,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

// ออกแบบ schema
let usersSchema = mongoose.Schema({
    fname:String,
    lname:String,
    nname:String,
    password:String,
    email:String,
    tel:Number,
    gender:String
})

// สร้าง model
let USERS = mongoose.model("users",usersSchema)

// ส่งออก model
module.exports = USERS

// ออกแบบฟังก์ชันสำหรับบันทึกข้อมูล
module.exports.saveUser = function(model, doc){
    model.save(doc)
}