const mongoose=require('mongoose');
const Schema=mongoose.Schema

let userschema = new Schema({
    
    name:String,
    email:String,
    Mobile:String,
    password:String
});

module.exports=mongoose.model('UserRegister',userschema);