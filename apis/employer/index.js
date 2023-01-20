const router = require('express').Router();



let User = require('../../models/User')
let Job = require('../../models/Job')
let Job_application = require('../../models/Job_application')
const bcrypt = require("bcryptjs")
const { ObjectId } = require('mongodb');

const saltRounds = 10; 

router.post('/post_job',(req,res)=>{
    let employer_id = req.body.employer_id
    let job_title = req.body.job_title
    let job_description = req.body.job_description
    let job_requirements = req.body.job_requirements
    let job_tags = req.body.job_tags


    let new_job  = new Job({
        employer_id:employer_id,
        job_title:job_title,
        job_description:job_description,
        job_requirements:job_requirements,
        job_tags:job_tags
    })
    new_job.save()
    return res.send({
        'msg':"Job created successfully"
    })
})

router.get("/get_applicant_details_by_id",(req,res)=>{
    let applicant_id = req.query.applicant_id
    User.findById(applicant_id)
    .then(user=>{
        return res.send({
            "user":user
        })
    })
})

router.post('/update_job',async(req,res)=>{
    let job_id = req.body.job_id
    let job_title = req.body.job_title
    let job_tags = req.body.job_tags
    let job_description = req.body.job_description
    let job_requirements = req.body.job_requirements

    let filter = {_id:job_id}
    let updateDoc = {
        job_title: job_title,
        job_description: job_description,
        job_requirements: job_requirements,
        job_tags: job_tags
    }

    await Job.updateMany(filter, updateDoc)
    return res.send({
        "msg":"Job Updated Successfully"
    })
})


router.get('/delete_job',(req,res)=>{
    let job_id = req.query.job_id
  
    Job.findByIdAndDelete(job_id)
    .then(resp=>{
        return res.send({
            "msg":"Job Deleted Successfully"
        })
    })
    .catch(err=>{
        console.log(err);
        return res.send({
            "msg":"Failed to Delete"
        })
    })
    
   
})

router.get("/get_all_posted_jobs_by_employer_id",(req,res)=>{
    let employer_id = req.query.employer_id

    Job.aggregate([
        {$match:{employer_id:ObjectId(employer_id)}},
       
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
        return res.send({
            "jobs":jobs
        })
    })
})

router.get('/get_applications',(req,res)=>{
    let employer_id = req.query.employer_id
    Job_application.find({employer_id:employer_id})
    .then(applications=>{
        return res.send({
            "applications":applications
        })
    })
})


router.get('/get_applications_by_job_id',(req,res)=>{
    let job_id = req.query.job_id
    console.log(ObjectId(job_id))
    Job_application.aggregate([
        {$match:{job_id:ObjectId(job_id)}},
        {
           
            $lookup:{
                from:"users",
                localField:"student_id",
                foreignField:"_id",
                as:"student"
            }
        },
        {
           
            $lookup:{
                from:"jobs",
                localField:"job_id",
                foreignField:"_id",
                as:"job"
            }
        }
])
.then(applications=>{
    console.log(applications)
    return res.send({
        "applications": applications
    })
})
})

router.post('/change_application_status',async(req,res)=>{
    let is_rejected = req.body.is_rejected
    let is_accepted = req.body.is_accepted
    let application_id = req.body.application_id

    let filter = {_id:application_id}
    let updateDoc = {
        is_rejected:is_rejected,
        is_accepted:is_accepted
    }


    await Job_application.updateMany(filter, updateDoc)
    
    if(is_accepted == 1) {
        return res.send({
            "msg":"Application accepted"
        })
    }else{
        return res.send({
            "msg":"Application rejected"
        })
    }



})

router.post("/update_employer_profile",async(req,res)=>{
    let employer_id = req.body.employer_id
    let filter = {_id:employer_id}

    let email = req.body.email
    let name = req.body.name
    let password = req.body.password
    let domain = req.body.domain
    let address = req.body.address
    
     User.findById(employer_id)
     .then(async(employer)=>{
       
   
    
    if(password){
        bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
            let updateDoc =await {
                "employer.name":name,
                email:email,
                password:hash,
                "employer.domain":domain,
                "employer.address":address,
               
            }
            if(email == employer.email){
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
            "employer.name":name,
                email:email,
               
                "employer.domain":domain,
                "employer.address":address,
           
        }

        if(email == employer.email){
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
    

   

   
})

return res.send({
    "msg":"Updated Successfully"
   })
})


router.get("/view_application_details_by_id",(req,res)=>{
    let application_id = req.query.application_id

    Job_application.aggregate([
        {$match:{_id:ObjectId(application_id)}},
        {
           
            $lookup:{
                from:"users",
                localField:"student_id",
                foreignField:"_id",
                as:"student"
            }
        }
])
.then(application=>{
        return res.send({
            "application":application
        })
    })
})


router.get("/get_job_by_id",(req,res)=>{
    let job_id = req.query.job_id

    Job.findById(job_id)
    .then(job=>{
        return res.send({
            "job":job
        })
    })
})

module.exports = router