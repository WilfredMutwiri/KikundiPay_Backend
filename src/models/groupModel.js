const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const groupSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    members:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
        }
    ],
    code:{
        type:String,
        required:true,
        unique:true,
        uppercase:true,
        trim:true,
    },
    admin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});

const Group=mongoose.model('Group',groupSchema);
module.exports=Group;