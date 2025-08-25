const Contribution = require('../../models/contributionsModel');

const addContribution=async(req,res)=>{
    let {amount,member,type,group}=req.body;
    
    type=type.trim().toUpperCase()

    if(!(amount && member && type && group)){
        return res.status(400).json({message: 'All fields are required'});
    }

    try {
        const newContribution=new Contribution({
            amount,
            member,
            type,
            group
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

// getGroupContributions
const getGroupContributions=async(req,res)=>{
  let {groupId}=req.params;
  try{
    const groupContributions=await Contribution.find({group:groupId})
    .populate("member")
    .populate("group");

    const totalAmount = groupContributions.reduce((sum, item) => sum + item.amount, 0);

    return res.status(200).json({
      message:"Group contributions fetched successfully!",
      success:true,
      contributions:groupContributions,
      totalContributions:totalAmount
    });
  }catch(error){
    return res.status(500).json({
      message:error.message
    })
  }
}

// get user contributions
const getUserContributions=async(req,res)=>{

    const {id}=req.params;

    if(!id){
        return res.status(400).json({message:"Invalid user id"});
    }

    try {
        const contributions=await Contribution.find({member:id}).sort({createdAt:-1});
        return res.status(200).json({
            message: "User contributions fetched successfully",
            success: true,
            contributions,
            totalAmount :contributions.reduce((sum,item)=>sum+item.amount,0)
        });
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};



// get user contributions by month
const getUserContributionsByMonth = async (req, res) => {
  const { userId, month, year } = req.params;

  const monthInt = parseInt(month, 10);
  const yearInt = parseInt(year, 10);

  if (monthInt < 1 || monthInt > 12 || yearInt < 2000) {
    return res.status(400).json({
      message: "Invalid month or year",
      success: false,
    });
  }

  try {
    const contributions = await Contribution.find({
      member: userId,
      createdAt: {
        $gte: new Date(yearInt, monthInt - 1, 1),
        $lt: new Date(yearInt, monthInt, 1),
      },
    }).populate("member");

    const totalAmount = contributions.reduce((sum,item)=>sum+item.amount,0);
    
    return res.status(200).json({
      message: "Contributions for the specified month fetched successfully!",
      totalContributions:contributions.length,
      totalAmount,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};


module.exports={
    addContribution,
    getContributions,
    getUserContributions,
    getUserContributionsByMonth,
    getGroupContributions
};