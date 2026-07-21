import mongoose from 'mongoose';
const line=new mongoose.Schema({account:{type:mongoose.Schema.Types.ObjectId,ref:'Account'}, debit:{type:Number,default:0}, credit:{type:Number,default:0}});
export default mongoose.model('Txn', new mongoose.Schema({
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  memo:String, category:String, date:{type:Date,default:Date.now},
  lines:[line], version:{type:Number,default:1}
},{timestamps:true}));