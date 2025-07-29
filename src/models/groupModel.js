const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const groupSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    members:{
        type:Array,
        required:true
    },
    shortname:{
        type:String,
        required:true,
        unique:true
    }
});

const Group=mongoose.model('Group',groupSchema);
module.exports=Group;