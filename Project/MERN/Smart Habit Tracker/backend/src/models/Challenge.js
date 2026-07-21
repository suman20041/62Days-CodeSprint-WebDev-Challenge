import mongoose from 'mongoose';
export default mongoose.model('Challenge', new mongoose.Schema({
  from:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  to:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  habitTitle:String, days:{type:Number,default:7}, status:{type:String,default:'pending'}
},{timestamps:true}));