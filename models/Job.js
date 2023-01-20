const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const jobSchema = new Schema({
    employer_id:{
        type:Schema.ObjectId,
    },
    job_title: {
      type: String,
      required: true,
     
     
     
    },
    job_description:{
      type:String,
      required:true,
      
    },
    
    job_requirements:{
        type:String,
        required:true,
        
    },
    job_tags:{
        type:Array,
       
        
      },
  
  }, {
    timestamps: true,
  });


const Job = mongoose.model('Job', jobSchema);
  
module.exports = Job;