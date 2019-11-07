import User from '../model/model';
export const finduser = async(req,res)=>{
    const {email} = req.body;
    const finduser =  await User.findOne({email});
    try{
        if(!finduser){
        res.send({message:"user not found"})
    }
    res.json({success: true,email:finduser.email});
}catch(error){
    res.send({error:error.message});
}
}