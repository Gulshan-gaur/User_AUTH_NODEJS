const bcrypt = require('bcrypt-nodejs');
import User from '../model/model';
const neo4j =  require('neo4j-driver').v1;
const driver =  neo4j.driver('bolt://10.118.114.135:7687',neo4j.auth.basic('neo4j','gul20Gul'))
const session =  driver.session();           
export const createuser = async (req, res) => {
    const {name,email,Game,password} = req.body;
    const hashedPass = bcrypt.hashSync(password)
    const newuser = new User({name,email,Game,password:hashedPass});
    const user = await User.findOne({email:req.body.email});
    if(user){
        return res.status(400).send('user already exists');
        //res.redirect(406,'/login');
    }else{   
        try {
            const result = session.run('match (n:sposync{name :{game}}) return n',
            {game:user.Game});
            const singleRecord = result.records[0];
            if(singleRecord){
                const node = singleRecord.get(0);
                const create =  session.run('match (n:sposync{name :{game}}) create (p:sposync{name:{name},email:{email}})-[r:GAME]->(n) return n,r,p',
                {name:newuser.name,email:newuser.email,game:node})
            }
            else{
                const create =  session.run('create (n:sposync{name:{name},email:{email}})-[r:GAME]->(p:sposync{name:{name1}})',
                {name:name,email:email,name1:Game})  
            }
            result.then(result => {
                session.close();
            });
            return res.status(200).json({User: await newuser.save() ,message:"user registered"});
            
         }catch (e){
            return res.status(400).json({error:true,message:e.message});
        }
    }    
};