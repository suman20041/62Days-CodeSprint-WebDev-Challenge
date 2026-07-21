import {Router} from 'express'; import Habit from '../models/Habit.js'; import User from '../models/User.js'; import Challenge from '../models/Challenge.js'; import {auth} from '../middleware/auth.js'; import {computeStreak,localDateString,weeklyHeat} from '../utils/streak.js';
const r=Router(); r.use(auth);
r.get('/',async(req,res)=>{
  const user=await User.findById(req.user.id); const habits=await Habit.find({user:req.user.id});
  res.json(habits.map(h=>{const dates=h.checkins.map(c=>c.date); return {...h.toObject(), streak:computeStreak(dates,user.timezone), heatmap:weeklyHeat(dates)}}));
});
r.post('/',async(req,res)=>res.status(201).json(await Habit.create({user:req.user.id,title:req.body.title,color:req.body.color||'#3dd68c',reminderHour:req.body.reminderHour??9})));
r.post('/:id/checkin',async(req,res)=>{
  const user=await User.findById(req.user.id); const habit=await Habit.findOne({_id:req.params.id,user:req.user.id});
  if(!habit)return res.status(404).json({message:'Not found'});
  const date=localDateString(user.timezone); if(habit.checkins.some(c=>c.date===date))return res.json(habit);
  habit.checkins.push({date}); await habit.save(); res.json(habit);
});
r.post('/friends/add',async(req,res)=>{
  const friend=await User.findOne({email:req.body.email}); if(!friend)return res.status(404).json({message:'User not found'});
  const me=await User.findById(req.user.id); if(!me.friends.includes(friend._id)){me.friends.push(friend._id); await me.save()}
  res.json({ok:true});
});
r.post('/challenges',async(req,res)=>{
  const to=await User.findOne({email:req.body.email}); if(!to)return res.status(404).json({message:'Friend not found'});
  const ch=await Challenge.create({from:req.user.id,to:to._id,habitTitle:req.body.habitTitle,days:req.body.days||7});
  res.status(201).json(ch);
});
r.get('/challenges/mine',async(req,res)=>res.json(await Challenge.find({$or:[{from:req.user.id},{to:req.user.id}]}).populate('from to','name email')));
r.get('/leaderboard',async(req,res)=>{
  const users=await User.find().limit(50); const board=[];
  for(const u of users){ const habits=await Habit.find({user:u._id}); let score=0; for(const h of habits){ score+=computeStreak(h.checkins.map(c=>c.date),u.timezone);} board.push({name:u.name,email:u.email,consistency:score}); }
  board.sort((a,b)=>b.consistency-a.consistency); res.json(board.slice(0,10));
});
export default r;