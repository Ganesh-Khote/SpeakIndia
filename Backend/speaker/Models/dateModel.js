const mongoose=require('mongoose');
const Schema=mongoose.Schema

let bookingschema = new Schema({
    
    date:{type:String ,required:true},
    yMobile:String
  
});



module.exports=mongoose.model('bookings',bookingschema);