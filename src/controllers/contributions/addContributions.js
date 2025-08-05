const Contribution = require('../../models/contributionsModel');

const addContribution=async(req,res)=>{
    let {amount,member,type}=req.body;
    
    type=type.trim().toUpperCase()

    if(!(amount && member && type)){
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const newContribution=new Contribution({
            amount,
            member,
            type
        });

        const createdContribution=await newContribution.save();
        return res.status(201).json({
            message: 'Contribution made successfully',
            success:true,
            contribution: createdContribution
        });

    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

// get contributions
const getContributions=async(req,res)=>{
    try {
        const contributions=await Contribution.find();
        return res.status(200).json({contributions});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

// get user contributions
const getUserContributions=async(req,res)=>{

    const {id}=req.params;

    if(!id){
        return res.status(400).json({message:"Invalid user id"});
    }

    try {
        const contributions=await Contribution.find({member:id}).sort({createdAt:-1});
        return res.status(200).json({contributions});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};


module.exports={
    addContribution,
    getContributions,
    getUserContributions
};