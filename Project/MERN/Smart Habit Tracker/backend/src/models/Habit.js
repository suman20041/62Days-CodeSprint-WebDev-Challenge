import mongoose from 'mongoose';
const checkin=new mongoose.Schema({date:String,at:{type:Date,default:Date.now}});
const schema=new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  title:String, color:String,
  reminderHour:{type:Number,default:9},
  checkins:[checkin],
},{timestamps:true});
export default mongoose.model('Habit',schema);