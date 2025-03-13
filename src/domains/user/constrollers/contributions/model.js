const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const contributionSchema=new Schema({
    amount:{
        type:Number,
        required:true
    },  
    date:{
        type:String,
        required:true,
    },  
    message:{
        type:String,
        required:true
    },      
});

const Contribution=mongoose.model('Contribution',contributionSchema);
module.exports=Contribution;
