const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const student = {
    name:{
      type:String,
      required:false
    },
    about_me:{
        type:String,
        required:false
        
                
    },
    education:{
        type:String,
        required:false
       
    },
    last_degree:{
        type:String,
        required:false
    },
    student_cv:{
        type:String,
        required:false
    }
    
   
    
  }
  
  
  const employer = {
    name:{type:String, required:false},
    domain:{type:String, required:false},
    address:{type:String, required:false},
    
  
  }

  const userSchema = new Schema({
    student,
    employer,
    email: {
      type: String,
      required: true,
     
     
     
    },
    password:{
      type:String,
      required:true,
      
    },
    
   is_admin:{
    type:Number,
    required:true
   },
   is_student:{
    type:Number,
    required:true
   },
   is_employer:{
    type:Number,
    required:true
   },
  
  }, {
    timestamps: true,
  });
  
  const User = mongoose.model('User', userSchema);
  
  module.exports = User;