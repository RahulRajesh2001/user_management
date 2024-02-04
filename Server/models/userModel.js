const mongoose=require('mongoose');
const userSchema = new mongoose.Schema({ 
    name: { 
        type: String, 
        require: true
    }, 
    email: { 
        type: String, 
        require: true,
        unique:true
    }, 
    password: { 
        type: String, 
        require: true
    }, 
    profile:{
        type:String,
        require:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}) 
  
const User = new mongoose.model("User", userSchema)
module.exports=User;