import {Router} from 'express'; import bcrypt from 'bcryptjs'; import jwt from 'jsonwebtoken'; import User from '../models/User.js';
const r=Router();
r.post('/register',async(req,res)=>{const {name,email,password}=req.body; if(await User.findOne({email}))return res.status(400).json({message:'Email used'});
const user=await User.create({name,email,password:await bcrypt.hash(password,10)});
res.json({token:jwt.sign({id:user._id,email},process.env.JWT_SECRET||'dev-secret',{expiresIn:'7d'})});});
r.post('/login',async(req,res)=>{const user=await User.findOne({email:req.body.email});
if(!user||!(await bcrypt.compare(req.body.password||'',user.password)))return res.status(400).json({message:'Invalid'});
res.json({token:jwt.sign({id:user._id,email:user.email},process.env.JWT_SECRET||'dev-secret',{expiresIn:'7d'})});});
export default r;