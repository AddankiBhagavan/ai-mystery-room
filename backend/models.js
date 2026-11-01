import mongoose from 'mongoose';
const {Schema}=mongoose;
const Suspect=new Schema({name:{type:String,required:true},age:Number,occupation:String,relationship:String,motive:String,description:String,alibi:String},{_id:true});
const Evidence=new Schema({title:String,type:String,summary:String,content:String,collectedAt:String,relatedSuspects:[String]},{_id:true});
const mysterySchema=new Schema({schemaVersion:{type:Number,default:1},title:String,scenario:String,summary:String,crimeType:String,difficulty:String,location:{name:String,description:String},incidentAt:String,victim:{name:String,age:Number,description:String},suspects:[Suspect],evidence:[Evidence],timeline:[{time:String,event:String}],solution:{culpritId:String,motive:String,reconstruction:String,explanation:String,supportingEvidence:[String],redHerrings:[String]},status:{type:String,default:'ready'}},{timestamps:true});
const sessionSchema=new Schema({mystery:{type:Schema.Types.ObjectId,ref:'Mystery',required:true},reviewedEvidence:[String],accusedSuspect:String,completed:{type:Boolean,default:false},correct:Boolean,expiresAt:{type:Date,default:()=>new Date(Date.now()+30*24*60*60*1000),index:{expires:0}}},{timestamps:true});
export const Mystery=mongoose.models.Mystery||mongoose.model('Mystery',mysterySchema);
export const GameSession=mongoose.models.GameSession||mongoose.model('GameSession',sessionSchema);
