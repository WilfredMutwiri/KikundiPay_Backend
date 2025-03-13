const Contribution = require('./model');

const addContribution=async(req,res)=>{
    let {amount,date,message}=req.body;
    if(!(amount && date && message)){
        return res.status(400).json({message: 'All fields are required'});
    }
    try {
        const newContribution=new Contribution({
            amount,
            date,
            message
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

module.exports={
    addContribution
};