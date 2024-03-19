const bcrypt=require('bcrypt');
const userschema=require('../speaker/Models/userRegisterModel');
const crypto=require('crypto');
const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const router=express();



router.post('/registeruser',async (req,res)=>{
    const mobileExit=await userschema.findOne({Mobile:req.body.Mobile})
    if(mobileExit) return res.status(400).send("Mobile Already Exit");

const Salt= await bcrypt.genSaltSync(10);
const hashedpassword=await bcrypt.hash(req.body.password,Salt);

    const user=new userschema({
        name:req.body.name,
        email:req.body.email,
        Mobile:req.body.Mobile,
        password:hashedpassword,
    });
    user.save().then((result)=>{
        res.status(201).json(result);
    }).catch((error)=>console.log(error));
})

router.post('/loginuser', async (req, res) => {
    try {
      const user = await userschema.findOne({ Mobile: req.body.Mobile });
  
      if (!user) return res.status(400).send("Mobile is not exist");
  
      const validPass = await bcrypt.compare(req.body.password, user.password);
  
      if (!validPass) return res.status(400).send("Invalid password");
  
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET="abc123", { expiresIn: '1h' });
  
      res.header("auth-token", token).send({ token: token });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  });
module.exports=router;