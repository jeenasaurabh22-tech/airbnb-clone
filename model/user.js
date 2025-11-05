const mongoose=require('mongoose');

const UserSchema=new mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    UserType:{type:String,enum:['guest','host'],default:'guest'},
    favourites:[{type:mongoose.Schema.Types.ObjectId,ref:'Home'}]
});

module.exports=mongoose.model('User',UserSchema);