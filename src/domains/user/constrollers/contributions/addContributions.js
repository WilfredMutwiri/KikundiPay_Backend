const Contribution = require('./model');

const addContribution=async(req,res)=>{
    let {amount,date,message,username}=req.body;
    if(!(amount && date && message && username)){
        return res.status(400).json({message: 'All fields are required'});
    }
    // date rejex
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    // message rejex

    ;    const mpesaRegex =/([A-Z0-9]{10}) Confirmed\. Ksh([\d,]+\.\d{2}) sent to ([\w\s]+)\s+(\d{10}) on (\d{1,2}\/\d{1,2}\/\d{2}) at (\d{1,2}:\d{2} (AM|PM))/;
    ;

    if(!dateRegex.test(date)){
        return res.status(400).json({message:"Invalid date format. Use dd/mm/yyyy"})
    }

    if(!mpesaRegex.test(message)){
        return res.status(400).json({message:"Invalid M-Pesa Message"})
    }
    try {
        const newContribution=new Contribution({
            amount,
            date,
            message,
            username
        });
        const createdContribution=await newContribution.save();
        return res.status(201).json({
            message: 'Contribution added successfully',
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

    const {username}=req.params;

    if(!username){
        return res.status(400).json({message:"Invalid username"});
    }

    try {
        const contributions=await Contribution.find({username});
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