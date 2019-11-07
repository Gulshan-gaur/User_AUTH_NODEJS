/*import passport from 'passport';*/


const passportJWT = require("passport-jwt");
const localStrategy = require('passport-local').Strategy;
const  JWTStrategy   = passportJWT.Strategy;
const  ExtractJwt = passportJWT.ExtractJwt;
const jwt = require('jsonwebtoken');
import  bcrypt from 'bcrypt-nodejs';
import User from '../model/model';
import { Verify } from 'crypto';


module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
   
      done(null, user);
  });     
 
 
  
  passport.use('local',new localStrategy({
    usernameField : 'email',
    passwordField : 'password',  
    //passReqToCallback : true
    },
    async (email,password,done)  =>{

      try{
         const user = await User.findOne({email : email});
         if(!user){
               done(null,false,{message: "Invalid EmailID"})
            }
         else{
                let valid =  bcrypt.compareSync(password,user.password)
                
            if(valid){
                  return done(null,user);
              }
            else{
                  return done(null,false/*,req.flash('login message',"password incoreect")*/);
                }
          }
        }catch(e){
            //return res.status(400).json({error:true,message : e.message});
            console.log(e.message)
            return e
          }
          }
          ));
      
          const  jwtOptions = {}
          jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
          jwtOptions.secretOrKey = 'sposync';
          passport.use('jwt',new JWTStrategy(jwtOptions,
         async (token, done) =>{
          
          try {
            //console.log(token)
          const user =  await User.findById(token.user._id);
    //Pass the user details to the next middleware
          if(!user){
             done(null,false);
          }
           return  done(null,user);
          } catch (error) {
            done(error);
          }
          })
          );    


  }
  