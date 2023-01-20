const mongoose = require('mongoose');

const Schema = mongoose.Schema;



const jobapplicationSchema = new Schema({
    job_id:{
        type:Schema.ObjectId,
    },

    employer_id:{
      type:Schema.ObjectId,
    },

    student_id:{
        type:Schema.ObjectId,
    },
    message: {
      type: String,
      required: true,
     
     
     
    },
   
    is_accepted:{
        type:Number,
        
        
      },

    is_rejected:{
        type:Number,
        
        
      },
  
  }, {
    timestamps: true,
  });


const Job_application = mongoose.model('Job_application', jobapplicationSchema);
  
module.exports = Job_application;