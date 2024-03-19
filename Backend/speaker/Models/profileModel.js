const mongoose=require('mongoose');
const Schema=mongoose.Schema

let profileschema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "SpeakerRegister", required: true, unique: true },
    firstname:String,
    lastname:String,
    email:String
    // speakType:String,
    // expertize:String,
    // address:String,
    // summary:String,
    //  about:String,
 
    // image:String
});

module.exports=mongoose.model('profile',profileschema);