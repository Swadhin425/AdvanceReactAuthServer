const mongoose=require('mongoose');
const bcrypt=require('bcrypt');

const Schema=mongoose.Schema;

//define a model
const userSchema= new Schema({
    email:{
        type:String,
        unique:true
    },
    password:String
})


userSchema.pre('save',function(next){
    console.log("pre middleware")
   const user=this;
    bcrypt.genSalt(10,function(err,salt){
        if(err)  {return next(err)}
        bcrypt.hash(user.password,salt,function(err,hash){
            if(err)  {return next(err)}
            user.password=hash;
            next()
        })
    })
   
})

userSchema.methods.comparePassword=function(password,callback){
    bcrypt.compare(password,this.password,function(err,isMatched){
        if(err)  {return callback(err)}

        callback(null,isMatched)
    })
}

//create the model class

const ModelClass=mongoose.model('user',userSchema);

//export the model
module.exports=ModelClass;
