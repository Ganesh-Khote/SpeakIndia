
const User=require('./Models/RegisterModel');
const bookings=require('./Models/dateModel');
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
const bcrypt=require('bcrypt');

const crypto=require('crypto');
const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const multer = require('multer');
const {BSON,EJSON,ObjectId}=require('bson');
// const Types=require ('mongoose').Types;
const router=express();


// const storage = multer.memoryStorage(); 
// const upload = multer({ storage: storage });
const objectId = require('mongoose').Types.ObjectId;

// router.use("/uploads", express.static(path.join("Backend/uploads")))
//multer 

const directory = './uploads/images/';
// const uploadsPath = path.join(directory, 'Backend', 'uploads','images'); 

const storage = multer.diskStorage({
    destination: (req ,file , cb) => {
        cb(null , directory)
    },
    filename: (req , file ,cb) => {
        const filename = file.originalname.toLowerCase().split(' ').join('-')
        cb(null , filename)
    }
})
var upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpg' ||
        file.mimetype == 'image/jpeg'
      ) {
        cb(null, true)
      } else {
        cb(null, false)
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
      }
    },
  })

//my correct code*******
router.post('/registerspeaker',upload.single('image') ,async (req,res)=>{
    let mobilExit= await User.findOne({Mobile:req.body.Mobile});
    if(mobilExit) return res.status(400).send("Mobile Already Exit");

const Salt= bcrypt.genSaltSync(10);
const hashedpassword= await bcrypt.hash(req.body.password,Salt)
const url = req.protocol + '://'+ req.get('host');
const user = new User({
      name:req.body.name,
      email:req.body.email,
      Mobile:req.body.Mobile,
      password:hashedpassword,
      speakType:req.body.speakType,
      Expertize:req.body.Expertize,
      address:req.body.address,
      summary:req.body.summary,
      about:req.body.about,
      image: url+ '/images/'+ req.file.filename
      
  })

user.save().then((result)=>{
  res.status(201).json(result);
}).catch((error)=>console.log(error));
})


// review
const review=require ('./Models/review');
router.post('/review', (req,res)=>{



const user = new review({
    name:req.body.name,
    review:req.body.review,
 
    
})

user.save().then((result)=>{
res.status(201).json(result);
}).catch((error)=>console.log(error));
})

router.get('/review', (req, res) => {
  review.find()
      .then((docs) => {
          res.status(200).json(docs);
      })
      .catch((error) => {
          console.error(error);
          res.status(500).json({ error: 'Internal Server Error' });
      });
});





  


router.post('/bookspeaker',async(req,res)=>{
  let dateExit= await bookings.findOne({date:req.body.date});
  if(dateExit) return res.status(400).send("Date Already Booked");

  const {givenemail}=req.body
  //  console.log(_id)
  var books= await bookings.create({
    
    date:req.body.date,
    yMobile:req.body.yMobile
  })
  
  let ObjId = new mongoose.Types.ObjectId(books.id);
  // console.log(ObjId);
  
  const newDoc = await User.updateOne(
   {
    email:givenemail,
    },
   {$push:{
    Booking:ObjId
    },
  },
    {upsert:false,new:true}
  )
  res.send({ message : "added successfully", bookingUpdatedDoc : newDoc});
  
  })
  



// router.get('/registerspeaker' ,(req, res) => {
//   User.find((err , docs) => {
//     if(err){
//       res.send(err)
//   }else{
//       res.send(docs)
//   }
//   })
// })  
router.get('/registerspeaker', (req, res) => {
    User.find()
        .then((docs) => {
            res.status(200).json(docs);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// router.get('/:id' ,(req , res) => {
// if(!objectId.isValid(req.params.id)){
//   res.send(`no record find with id ${req.params.id}`)
// }else{
//   User.findById(req.params.id , (err ,docs) => {
//     if(err){
//       res.send(err)
//   }else{
//       res.send(docs)
//   }
//   })
// }
// })

router.get('/:id', async (req, res) => {
  if (!objectId.isValid(req.params.id)) {
    return res.status(400).send(`Invalid ObjectId: ${req.params.id}`);
  }

  try {
    const user = await User.findById(req.params.id).populate({path:'Booking',Model:'bookings'}).exec();

    if (!user) {
      return res.status(404).send(`No record found with id ${req.params.id}`);
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


// router.delete('/:id' ,(req , res) => {
//   if(!objectId.isValid(req.params.id)){
//     res.send(`no record find with id ${req.params.id}`)
//   }else{
//     User.findByIdAndDelete(req.params.id , (err ,docs) => {
//       if(err){
//         res.send(err)
//     }else{
//         res.send(docs)
//     }
//     })
//   }
//   })

router.delete('/:id', async (req, res) => {
  try {
    if (!objectId.isValid(req.params.id)) {
      res.send(`no record found with id ${req.params.id}`);
      return;
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id).exec();

    if (!deletedUser) {
      res.send(`no record found with id ${req.params.id}`);
    } else {
      res.send(deletedUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});







router.put('/update/:id', upload.single('image'), async (req, res) => {
  try {
    const user = {
      name: req.body.name,
      email: req.body.email,
      Mobile: req.body.Mobile,
      speakType: req.body.speakType,
      Expertize: req.body.Expertize,
      address: req.body.address,
      summary: req.body.summary,
      about: req.body.about,
      // image: url + '/images/' + req.file.filename
    };

    const updatedUser = await User.findByIdAndUpdate(req.params.id, user, { new: true });

    res.send(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});






router.post('/loginspeaker', async (req, res) => {
    try {
      const user = await User.findOne({ Mobile: req.body.Mobile });
  
      if (!user) return res.status(400).send("Mobile is not exist");
  
      const validPass = await bcrypt.compare(req.body.password, user.password);
  
      if (!validPass) return res.status(400).send("Invalid password");
  
      const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET="abc123", { expiresIn: '1h' });
  
      res.header("auth-token", token).send({ token: token });
    } catch (error) {
      res.error('Error during login:', error);
      res.status(500).send('Internal Server Error');
    }
  });

//   const storage = multer.diskStorage({
//     destination: (req, File, cb) => {
//       cb(null, 'uploads/');
//     },
//     filename: (req, File, cb) => {
//       cb(null, Date.now() + '-' + File.originalname);
//     },
//   });
  
  
//   const upload = multer({ storage: storage });

//   router.put('/:_registerid' , upload.single('File'),(req, res) => {
//     try {
//         const itemId = req.params._registerid;
//         const updatedData = req.body;
//           // File:req.body.File
//           if (req.File) {
            
//             updatedData.profileImage = req.File.filename;
//           }
            
            
        
        
//          Registerschema.findByIdAndUpdate(itemId, updatedData);
        
//         res.status(204).json(updatedData); 
//     } catch (error) {
//         res.status(500).json({ error: 'Internal server error' });  
//     }
// });

// Replace these values with your actual email service credentials
// const emailConfig = {
//   service: 'gmail',
//   auth: {
//     user: 'speakindia96k@gmail.com',
//     pass: 'Speak@123',
//   },
// };

// const transporter = nodemailer.createTransport(emailConfig);

const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'clarissa.goldner63@ethereal.email',
      pass: 'peCmMWJuhaEccmCPcf'
  }
});

router.post('/send-otp', (req, res) => {
  // Generate a random 6-digit OTP
  const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });

  // Replace this with the user's email
  // const toEmail = 'khoteganesh222@gmail.com';
  const {givenemail}=req.body;
  // const toemail=email
const verificationLink='http://localhost:4200/booked';
  const mailOptions = {
    from: 'clarissa.goldner63@ethereal.email',
    to: givenemail,
    subject: 'OTP for Verification',
    text: `Your OTP for verification is: ${otp}`,
    html: `<p>Hello,</p><p>Please click the following link to verify your email:</p><p><a href="${verificationLink}">Click Here</a></p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }
    

    const user = {
      email: givenemail,
      // otp: otp,
    };

    return res.status(200).json({ message: 'OTP sent successfully', user });
  });
});

module.exports=router;
