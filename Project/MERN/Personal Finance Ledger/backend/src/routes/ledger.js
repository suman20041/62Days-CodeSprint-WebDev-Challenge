import {Router} from 'express'; import mongoose from 'mongoose'; import Account from '../models/Account.js'; import Category from '../models/Category.js'; import Txn from '../models/Transaction.js'; import Bill from '../models/Bill.js'; import {auth} from '../middleware/auth.js';
const r=Router(); r.use(auth);
r.get('/accounts', async(req,res)=>res.json(await Account.find({user:req.user.id})));
r.post('/accounts', async(req,res)=>res.status(201).json(await Account.create({user:req.user.id, name:req.body.name, type:req.body.type||'asset'})));
r.get('/categories', async(req,res)=>res.json(await Category.find({user:req.user.id})));
r.post('/categories', async(req,res)=>res.status(201).json(await Category.create({user:req.user.id, name:req.body.name})));
r.get('/txns', async(req,res)=>res.json(await Txn.find({user:req.user.id}).sort({date:-1}).limit(100)));
r.post('/txns', async(req,res)=>{
  const lines=req.body.lines||[]; const debits=lines.reduce((s,l)=>s+Number(l.debit||0),0); const credits=lines.reduce((s,l)=>s+Number(l.credit||0),0);
  if(Math.abs(debits-credits)>0.001) return res.status(400).json({message:'Entry must balance (debits === credits)'});
  const session=await mongoose.startSession(); session.startTransaction();
  try{
    const [txn]=await Txn.create([{user:req.user.id, memo:req.body.memo, category:req.body.category, lines, date:req.body.date||new Date()}],{session});
    for(const line of lines){
      const delta=Number(line.debit||0)-Number(line.credit||0);
      await Account.findOneAndUpdate({_id:line.account,user:req.user.id},{$inc:{balance:delta}},{session});
    }
    await session.commitTransaction(); res.status(201).json(txn);
  }catch(e){ await session.abortTransaction(); res.status(400).json({message:e.message}); }
  finally{ session.endSession(); }
});
r.put('/txns/:id', async(req,res)=>{
  const existing=await Txn.findOne({_id:req.params.id,user:req.user.id});
  if(!existing) return res.status(404).json({message:'Not found'});
  if(req.body.version && req.body.version!==existing.version) return res.status(409).json({message:'Conflict — reload and retry', server:existing});
  existing.memo=req.body.memo??existing.memo; existing.version+=1; await existing.save(); res.json(existing);
});
r.get('/bills', async(req,res)=>res.json(await Bill.find({user:req.user.id})));
r.post('/bills', async(req,res)=>res.status(201).json(await Bill.create({user:req.user.id, ...req.body, nextDue:req.body.nextDue||new Date()})));
r.get('/summary', async(req,res)=>{
  const accounts=await Account.find({user:req.user.id});
  const byCat=await Txn.aggregate([{$match:{user:new mongoose.Types.ObjectId(req.user.id)}},{$group:{_id:'$category', total:{$sum:{$sum:'$lines.debit'}}}}]);
  res.json({accounts, byCategory:byCat});
});
r.get('/export.csv', async(req,res)=>{
  const txns=await Txn.find({user:req.user.id});
  const rows=['date,memo,category,debit,credit'];
  for(const t of txns){ for(const l of t.lines){ rows.push(`${t.date.toISOString()},"${t.memo||''}","${t.category||''}",${l.debit},${l.credit}`); } }
  res.setHeader('Content-Type','text/csv'); res.send(rows.join('\n'));
});
r.post('/import.csv', async(req,res)=>{
  const text=req.body.csv||''; const lines=text.trim().split(/\r?\n/).slice(1);
  res.json({imported:lines.length, note:'Educational stub — map rows to balanced entries in UI before posting'});
});
export default r;