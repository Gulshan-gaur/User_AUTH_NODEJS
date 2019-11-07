import {Router} from 'express';
//const  multer =  require('multer');
const path = require('path');
const fs = require('fs');
const neo4j =  require('neo4j-driver').v1;
import * as usercontroller from './controller';
//const upload = multer({dest: __dirname + '/uploads/images'});
const uploads = require('./image');
const Resize = require('./reshape');
//import * as update from './updateuser';
import * as find from './finduser';
const bcrypt = require('bcrypt-nodejs');
import User from '../model/model';
import Image from '../model/image';
import Friend from  '../model/friend';
const driver =  neo4j.driver('bolt://10.118.114.135:7687',neo4j.auth.basic('neo4j','gul20Gul'))
const session =  driver.session();
//import { Resize } from './reshape';
//const passport = require('passport');
const jwt = require('jsonwebtoken');
const routes = new Router();
const target  =  path.join(__dirname,'/uploads/images')
module.exports = function(passport){
routes.post('/signup',usercontroller.createuser);
routes.post('/login',async (req, res) => {
    const {email,password} = req.body;
    const user = await User.findOne({email : email});
   try{ 
       if(!user){
        res.status(400).send("user not found");
    }
    else{
        if(bcrypt.compareSync(password,user.password)){
            const body = { _id: user._id};
            const token = jwt.sign({user:body},'sposync',{ expiresIn: 10000000000000 }); 
           res.json({sucess: true,token : token});
        }
        else{
            res.status(400).send("password do not match");
        }
        }
        }catch(e){
    return res.json({error:true,message:e.message});
}
})
routes.post('/images/profile',passport.authenticate('jwt',{session:false}),

      uploads.upload.array('images'),async (req,res,err) => {
         const user_id = req.user._id
         const user =  await User.findOne({_id:user_id})
         //console.log(user.name) 
         const imagepath = path.join(__dirname + '/uploads/images');
         const fileupload= new Resize(imagepath);
         if(!req.files){
             res.status(400).json("file should be upload ")
         }
         const images = []
         for (const file in req.files){
           
            const filename = await fileupload.save(req.files[file].buffer);
    
            
            
            images.push(filename);
            
        }
    
        try{ 
           
                 const result =  session.run('match (n:sposync{name:{name}}) create (n)-[r:POST]->(p:sposync{name:{image}}) return n,r,p', {name:user.name,image:images});
                    result.then(result => {
                    session.close()
                    const singleRecord = result.records[0];
                    const node = singleRecord.get(0);
                    const post = singleRecord.get(1);
                    const image =  singleRecord.get(2);
                        
                    res.sendFile(path.join(__dirname + '/uploads/images',image.properties.name[0]),{name:node.properties.name})
                      
                    });                 
    }catch(err){
        return res.status(400).json({error:true,message:err.message});
    }
})
       
         
       
routes.get('/profile',passport.authenticate('jwt',{session:false}), async (req,res,err) => {
    //res.send(req.user.profile)
   res.json({
        name : req.user.name,
        Game: req.user.Game,
        message : 'You made it to the secure route'
      })
    }
);
routes.post('/friendchecker',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const user_id =  req.user._id;
    const user =  await User.findOne({_id:user_id});
    const username =  req.body.name;
    const result =  session.run('match (n:sposync{name:{name}})-[r:FOLLOW]-(p:sposync{name:{friend}}) return n,r,p',
    {name:user.name,friend:username})
    try{
        result.then(result => {
            session.close()
            const singleRecord = result.records[0];
        if(singleRecord){
            const node = singleRecord.get(0);
            const node2 =  singleRecord.get(1);
            const node3 =  singleRecord.get(2)
            const body =  node.properties.name;
            const relation = node2.type;
            const body1 =  node3.properties.name;
            
            res.status(200).json({name: body,friend:body1,relation: relation}); 
           
       }
       else{
           res.json("FOLLOW")
       }
        })
    }catch(e){
        return res.json({error:true,message:e.message});
    }
    
})
routes.post('/friend',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const user_id =  req.user._id;
    const user =  await User.findOne({_id:user_id});
    console.log(user.name)
    const username =  req.body.name;
    const result =  session.run('match (n:sposync{name:{name}}),(p:sposync{name:{friend}}) create(n)-[r:FOLLOW]->(p) return n,r,p',
    {name:user.name,friend:username})
    try{
        result.then(result => {
            session.close()
            const singleRecord = result.records[0];
        if(singleRecord){
            const node = singleRecord.get(0);
            const node2 =  singleRecord.get(1);
            const node3 =  singleRecord.get(2)
            const body =  node.properties.name;
            const relation = node2.type; 
           
            const body1 =  node3.properties.name;
            res.status(200).json({name: body,friend:body1,rela: relation}); 
           
       }
       else{
           res.json("u can follow")
       }
        })
    }catch(e){
        return res.json({error:true,message:e.message});
    }
    
})
routes.post('/friendlist',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const user_id =  req.user._id;
    const user =  await User.findOne({_id:user_id});
    //console.log(user.name)
    const result =  session.run('match (n:sposync{name:{name}})-[r:FOLLOW]-(p) return r,p limit 24',
    {name:user.name})
    try{
        result.then(result => {
            session.close()
            const singleRecord = result.records[0];
            //console.log(singleRecord)
        if(singleRecord){
            const node = singleRecord.get(0);
            const node2 =  singleRecord.get(1);
            const body =  node2.properties.name;
            const relation = node.type; 
            
res.status(200).json({friend:body,rela: relation}); 
           
       }
       else{
           res.send("u can follow")
       }
        })
    }catch(e){
        return res.json({error:true,message:e.message});
    }
    
})


routes.post('/search',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const username =  req.body.name;
    const result  =  session.run('match (n:sposync{name:{name}}) return n limit 20',
        {name:username});    
try{
        result.then(result => {
            session.close()
            const singleRecord = result.records[0];
            
            if(singleRecord){
            const node = singleRecord.get(0);
            const body =  node.properties.name;
            res.json({name: body}); 
            }
            else{
                res.status(400).json("user not found");
            }
        });
    }catch(e){
        return res.json({error:true,message:e.message});
    }
        
})

routes.post('/userprofile',passport.authenticate('jwt',{session:false}),async (req,res)=>{
    const username =  req.body.name;
    const result  =  session.run('match (n:sposync{name:{name}})-[r:GAME]->(p) return n,p',
        {name:username});

        try{
            result.then(result => {
                session.close()
                const singleRecord = result.records[0];
                if(singleRecord){
                const node = singleRecord.get(0);
                const node2 =  singleRecord.get(1)
                const body =  node.properties.name;
                const body1 =  node2.properties.name;
                res.status(200).json({name: body,game:body1}); 
                }
                else{
                    res.status(400).json("user not found");
                }
            });
        }catch(e){
            return res.json({error:true,message:e.message});
        }
                

})
routes.put('/update',passport.authenticate('jwt',{session:false}),async (req,res)=>{
   const doc =  await User.findByIdAndUpdate({_id:req.user._id},
       {$set:
        {name:req.body.name,
        Game: req.body.Game}},{useFindAndModify: false} )
        //console.log(doc)
    if(!doc){
        res.send("user not found")
    }
    res.json({
        message: "user update"
    })    
});

routes.put('/friend',passport.authenticate('jwt',{session:false}), async (req,res,err) => {
    const userA_id =  req.user._id;

    const userBname =  req.body.name
    const userB_Id =  await User.findOne({name:userBname})

        const userA =  await Friend.findOneAndUpdate(
            { requester: userA_id, recipient: userB_Id._id},
            { $set: { status: 1 }},
            { upsert: true, new: true }
        )
        if(userA===null){
            return null
        }
        else{res.status(200).json({message:'friend'})}
});
    
   return routes;
      }