

const express=require("express");
const mongoose=require("mongoose");

const bodyparser=require('body-parser');
const cors=require('cors');

const app=express();
app.use(bodyparser.json());
app.use(cors());


 const path=require ('path');
 app.use(express.static('uploads'));


mongoose.connect("mongodb://127.0.0.1/SpeakIndia")
.then(()=>{
    console.log("DB Connected");
})


const SpeakerRegister=require('./speaker/RegisterLogin');
app.use("/api",SpeakerRegister);

const UserRegister=require('./user/RegisterLogin');
app.use("/api",UserRegister);

const profile=require('./speaker/profile');
app.use("/api",profile);


app.listen(3000,console.log("server is created on ports 3000"));