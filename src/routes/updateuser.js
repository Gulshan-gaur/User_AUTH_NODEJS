import User from '../model/model';


export const update = async(req,res)=>{
    const {name} = req.body;
    const user = await User.findOne({name});
    try{
        if(!user){
        res.send('user not founnd')
    }
    const updated = user.save({
        name : req.body.name,
        Game : req.body.Game
    })
    if(!updated){
        res.send("data is  not updated")
    }
    res.send('user updated');
    }catch(error){

    }
}