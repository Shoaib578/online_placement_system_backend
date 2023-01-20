const router = require('express').Router();



let User = require('../../models/User')
let Job = require('../../models/Job')
let Job_application = require('../../models/Job_application')
const { ObjectId } = require('mongodb');


const bcrypt = require("bcryptjs")

const saltRounds = 10; 

router.get('/get_all_jobs',(req,res)=>{
    console.log("Get all jobs")
    Job.aggregate([
        {
            $lookup:{
                from:"job_applications",
                localField:"_id",
                foreignField:"job_id",
                as:"applications"
            }
        }
    ])
    .then(jobs=>{
        console.log(jobs)
        return res.send({
            "msg":"success",
            "jobs":jobs
        })
    })
    .catch((err)=>{
        console.log(err)

        return res.send({
            "msg":"failed to get",
            "jobs":[]
        })
    })
   
})


router.get('/get_job_by_id',(req,res)=>{
    let job_id = req.query.job_id
    let student_id = req.query.student_id
    Job.findById(job_id)
    .then(job=>{
        Job_application.find({$and:[{job_id:job_id},{student_id:student_id}]})
        .then(application=>{
        console.log(application)
        return res.send({
            "msg":"success",
            "job":job,
            "is_applied":application.length
        })
    })

    })
    .catch((err)=>{
        console.log(err)
        return res.send({
            "msg":"failed to get",
            "data":[]
        })
    })
   
})


router.post("/apply_for_job",(req,res)=>{
    let student_id = req.body.student_id
    let job_id = req.body.job_id
    let message = req.body.message


    Job.findById(job_id)
    .then(job=>{
        let new_application = new Job_application({
            student_id:student_id,
            job_id:job_id,
            message:message,
            employer_id:job.employer_id,
            is_accepted:0,
            is_rejected:0

        })
        new_application.save()
        .then(()=>{
            return res.send({
               
                "msg":"Successfully applied"
            })
        })
        .catch(err=>{
            console.log(err)
            return res.send({
                
                "msg":"Failed to apply"
            })
        })
    })
    .catch(err=>{
        console.log(err)
        return res.send({
            
            "msg":"Failed to apply"
        })
    })
   

    
})


router.get('/withdraw_application',(req,res)=>{
    let application_id = req.query.application_id

    Job_application.findByIdAndDelete(application_id)
    .then(resp=>{
        return res.send({
            "msg":"successfully deleted",
            
        })
    })
    .catch(err=>{
        console.log(err)
        return res.send({
            "msg":"failed to deleted",
            
        })
    })
})


router.get('/get_all_job_applications_for_student',(req,res)=>{
    let student_id = req.query.student_id
    Job_application.aggregate([
        {$match:{student_id:ObjectId(student_id)}},

        {
            
            $lookup:{
                from:"jobs",
                localField:"job_id",
                foreignField:"_id",
                as:"job"
            }
        }
    ])
    .then(data=>{
       
        return res.send({
            "msg":"success",
            "applications":data
        })
    })
    .catch(err=>{
        console.log(err)
        return res.send({
            "msg":"failed",
            "data":[]
        })
    })
})

router.get("/view_job_application",(req,res)=>{
let application_id = req.query.application_id
Job_application.findById(application_id)
.then(application_data=>{
    Job.findById(application_data.job_id)
    .then(job_data=>{
        User.findById(application_data.student_id)
        .then(student_data=>{
            return res.send({
                "msg":"success",
                "application_data":application_data,
                "job_data":job_data,
                "student_data":student_data
            })
        })
        
    })
   
})
.catch(err=>{
    console.log(err)
    return res.send({
        "msg":"failed",
        "application_data":[],
        "job_data":[],
        "student_data":[]
    })
})
})



router.post("/update_student_profile",async(req,res)=>{
    let student_id = req.body.student_id
   
    
    let filter = {_id:student_id}
    
    

  

    let name = req.body.name
    let email = req.body.email
    let password = req.body.password
    let about_me = req.body.about_me
    let education = req.body.education
    let degree = req.body.degree
    
    
    User.findById(student_id).then(async(student)=>{


    if(req.files){
        let student_cv = req.files.student_cv

        student_cv.mv('public/uploads/'+student_cv.name,function(err){
            if(err){
                res.send(err)
            }
          })
        if(password){
            bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
                let updateDoc =await {
                    "student.name":name,
                    email:email,
                    password:hash,
                    "student.about_me":about_me,
                    "student.education":education,
                    "student.last_degree":degree,
                    "student.student_cv":student_cv.name
                }
                if(email == student.email){
                    await  User.updateMany(filter,updateDoc)
                  
                }else{
                    User.findOne({email:email})
                    .then(async(result)=>{
                        if(result != null){
                            return res.send({
                                "msg":"email already exists"
                            })
                        }else{
                            await  User.updateMany(filter,updateDoc)
            
                           
                        }
                    })
                }
             })
        }else{
            let updateDoc = {
                "student.name":name,
                email:email,
                "student.about":about_me,
                "student.education":education,
                "student.last_degree":degree,
                "student.student_cv":student_cv.name

            }

            if(email == student.email){
                await  User.updateMany(filter,updateDoc)
              
            }else{
                User.findOne({email:email})
                .then(async(result)=>{
                    if(result != null){
                        return res.send({
                            "msg":"email already exists"
                        })
                    }else{
                        await  User.updateMany(filter,updateDoc)
        
                       
                    }
                })
            }


          }
          
    }else{
        if(password){
            bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
                let updateDoc =await {
                    "student.name":name,
                    email:email,
                    password:hash,
                    "student.about_me":about_me,
                    "student.education":education,
                    "student.last_degree":degree,
                }
                if(email == student.email){
                    await  User.updateMany(filter,updateDoc)
                  
                }else{
                    User.findOne({email:email})
                    .then(async(result)=>{
                        if(result != null){
                            return res.send({
                                "msg":"email already exists"
                            })
                        }else{
                            await  User.updateMany(filter,updateDoc)
            
                           
                        }
                    })
                }
             })
        }else{
            let updateDoc = {
                "student.name":name,
                email:email,
               
                "student.about_me":about_me,
                "student.education":education,
                "student.last_degree":degree,
               
            }

            if(email == student.email){
                await  User.updateMany(filter,updateDoc)
              
            }else{
                User.findOne({email:email})
                .then(async(result)=>{
                    if(result != null){
                        return res.send({
                            "msg":"email already exists"
                        })
                    }else{
                        await  User.updateMany(filter,updateDoc)
        
                       
                    }
                })
            }


          }
    }
})
return res.send({
        "msg":"Updated Successfully",
        
})

  
})
module.exports = router