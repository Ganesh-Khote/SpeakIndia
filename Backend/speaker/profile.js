const express=require("express");
const router=express();
// const addproperty=require('../models/Add_Property')
const profile=require('./Models/profileModel');

// router.post('/profile',(req,res)=>{
//     const Profile=new profile({
//         // name:req.body.name,
//         speakType:req.body.speakType,
//         expertize:req.body.expertize,
//         address:req.body.address,
//         summary:req.body.summary,
//         about:req.body.about,
//         image:req.body.image
//     })
//     Profile.save().then((result)=>{
//         res.status(201).json(result);
//     }).catch((error)=> console.log(error));
// });

router.post('/profile', async (req, res) => {
    try {
      const { userId, firstName, lastName, email } = req.body;
  
      // Create a new profile
      const newProfile = new profile({ userId, firstName, lastName, email });
      await newProfile.save();
  
      res.status(201).json({ message: 'Profile created successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });

router.get('/profile',(req,res)=>{
    profile.find().then((result)=>{
        res.status(201).json(result);
    }).catch((error)=>console.log(error));
});

router.put('/:Id',(req,res)=>{
    profile.findOneAndUpdate({_id:req.params.Id});
    const Profile=new profile({
        speakType:req.body.speakType,
        expertize:req.body.expertize,
        address:req.body.address,
        summary:req.body.summary,
        about:req.body.about,
        image:req.body.image
      
        })
        Profile.save().then((result)=>{
            res.status(201).json(result);
        }).catch((error)=> console.log(error));
    });

    router.delete('/:Id',(req,res)=>{
        profile.findOneAndDelete({_id:req.params.Id})
        .then((result)=>{
            res.status(201).json(result)
        }).catch((error)=>res.json(error));
    });










module.exports=router;