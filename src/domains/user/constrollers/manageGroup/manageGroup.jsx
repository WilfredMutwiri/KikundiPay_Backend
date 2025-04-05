const Group=require('./model.jsx');

const addGroup=async(req,res)=>{
    let {name,members,shortname}=req.body;
    if(!name &&!members && !shortname){
        return res.status(400).json({message:"Kindly fill all fields"});
    }

    try {
        const groupExists=await Group.findOne({shortname});
        if(groupExists){
            return res.status(400).json({message:"Group already exists"});
        }

        const newGroup=new Group({
            name,
            members,
            shortname
        })

        const createdGroup=await newGroup.save();
        return res.status(200).json({
            message:"Group created successfully",
            group:newGroup
        });

    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

const getGroups=async(req,res)=>{
    try {
        const groups=await Group.find();
        if(groups.length===0){
            return res.status(200).json({message:"No groups found!"})
        }
        return res.status(200).json({groups})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

const getSingleGroup=async(req,res)=>{
    let {id}=req.params;

    try {
        const singleGroup=await Group.findById(id);
        if(!singleGroup){
            return res.status(400).json({message:"Group not found!"})
        }
        return res.status(200).json({singleGroup})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

const deleteGroup=async(req,res)=>{
    let {id}=req.params;
    try {
        const response=await Group.findByIdAndDelete(id);
        if(!response){
            return res.status(400).json({message:"Group not found!"})
        }
        return res.status(200).json({message:"Group deleted successfully!"})
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}

module.exports={
    addGroup,
    getGroups,
    getSingleGroup,
    deleteGroup
}