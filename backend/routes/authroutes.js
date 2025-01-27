import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import users from '../models/user.js';
import bcryptjs from 'bcryptjs';
import cookieParser from 'cookie-parser';

//app.use(cookieParser());

const router= express.Router();

router.post('/register', async(req,res) =>{
    const {name,email,password}= req.body;
    try{
      const user= await users.create({name,email,password});
      res.status(201).json({message:"user registered"});
    }
    catch(err){
     res.status(500).json({error: err.message})
    }
 
})

router.post('/login', async(req,res)=>{
    const {email,password}= req.body;
    const user= await users.findOne({email});
    if(!user || !(await user.matchPassword(password))){
        return res.status(400).json({error: "invalid email or password"});

    }

    const token=jwt.sign({id: user._id, name: user.name}, process.env.secret,{expiresIn:'1h'});
    res.cookie('token', token, { httpOnly: true }); // Use secure: true in production
    res.status(200).json({message: 'login successful'});
});


router.post('/logout', (req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:'logged out'});

});

router.get('/user', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.secret);
    res.status(200).json({ username: decoded.name });
  } catch (err) {
    console.error("Token verification error:", err.message); // Debugging log
    res.status(401).json({ error: "Token verification failed", details: err.message });
  }
});


export default router;

