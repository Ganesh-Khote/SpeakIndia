const mongoose=require('mongoose');
const Schema=mongoose.Schema

let reviewschema = new Schema({
    
    name:String,
    review:String,
   
});

module.exports=mongoose.model('review',reviewschema);