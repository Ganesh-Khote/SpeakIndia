const mongoose=require('mongoose');
const Schema=mongoose.Schema

let speakerschema = new Schema({
   
    name:String,
    email:String,
    Mobile:String,
    password:String,
    speakType:String,
    Expertize:String,
    address:String,
    summary:String,
    about:{type:String},

    Booking:[{type:Schema.Types.ObjectId,ref:'bookings'}],
    image:String
   
},{
    timestamps:true
});



    module.exports=mongoose.model('SpeakerRegister',speakerschema);
    