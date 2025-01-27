import express from 'express';
import mongoose from'mongoose';
//import bcryptjs from 'bcryptjs';
//import jwt from 'jsonwebtoken';
import cookieparser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import authroutes from './routes/authroutes.js';


const app=express();

app.use(express.json());
app.use(cookieparser());
app.use(cors({
    origin: 'http://localhost:5173', // Adjust based on your frontend URL
    credentials: true, // Allow cookies to be sent
  }));
app.use('/api/auth', authroutes);

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser: true, useUnifiedTopology: true}).then(()=>console.log('connected to db')).catch((err)=>console.log('not connected to db',err));


app.listen(5000, () => console.log('Server running on port 5000'));




