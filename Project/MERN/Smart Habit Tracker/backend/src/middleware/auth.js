import jwt from 'jsonwebtoken';
export function auth(req,res,next){const h=req.headers.authorization||'';const t=h.startsWith('Bearer ')?h.slice(7):null;if(!t)return res.status(401).json({message:'Unauthorized'});try{req.user=jwt.verify(t,process.env.JWT_SECRET||'dev-secret');next()}catch{return res.status(401).json({message:'Invalid token'})}}
export function requireRole(...roles){return(req,res,next)=>{if(!roles.includes(req.user?.role))return res.status(403).json({message:'Forbidden'});next()}}
