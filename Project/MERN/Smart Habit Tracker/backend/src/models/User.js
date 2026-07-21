import mongoose from 'mongoose';
const schema=new mongoose.Schema({name:String,email:{type:String,unique:true},password:String,timezone:{type:String,default:'UTC'},friends:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]},{timestamps:true});
export default mongoose.model('User',schema);