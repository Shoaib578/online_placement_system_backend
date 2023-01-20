const router = require('express').Router();



let User = require('../../models/User')
let Job = require('../../models/Job')
let Job_application = require('../../models/Job_application')
const bcrypt = require("bcryptjs")
const { ObjectId } = require('mongodb');

const saltRounds = 10; 



function save_cv(cv){
    cv.mv('public/uploads/'+cv.name,function(err){
      if(err){
          res.send(err)
      }
    })
  }
  
  
  
  function signup_student(req,res,user_details){
   let name = req.body.name
   let about_me = req.body.about_me
   let education = req.body.education
   let student_cv = req.files.student_cv
   let last_degree = req.body.last_degree
  
   let new_user = new User({
   email:user_details.email,
   password:user_details.password,
   is_admin:user_details.is_admin,
   is_student:user_details.is_student,
   is_employer:user_details.is_employer,
  
   //student
  
   "student.name":name,
   "student.about_me":about_me,
   "student.education":education,
   "student.student_cv":student_cv.name,
    "student.last_degree":last_degree
   })
  
   new_user.save()
  
   if(req.files){
    save_cv(student_cv)
   }
  
   return res.send({
    
    "msg": "Signup successfully"
   })
  }
  
  
  function signup_employer(req,res,user_details){
  
    let name = req.body.name
    let domain = req.body.domain
    let address = req.body.address
    let new_user = new User({
      email:user_details.email,
      password:user_details.password,
      is_admin:user_details.is_admin,
      is_student:user_details.is_student,
      is_employer:user_details.is_employer,
     
      //employer
     
      "employer.name":name,
      "employer.domain":domain,
      "employer.address":address,
     
      })
     
     
      new_user.save()
     
      return res.send({
       
       "msg": "Signup successfully"
      })
  }


  function signup_admin(req,res,user_details){
    let new_user = new User({
        email:user_details.email,
        password:user_details.password,
        is_admin:user_details.is_admin,
        is_student:user_details.is_student,
        is_employer:user_details.is_employer
    })
    new_user.save()
    return res.send({
        "msg":"Signup successfully"
    })
  }
  

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
        },
        {
            $lookup:{
                from:"users",
                localField:"employer_id",
                foreignField:"_id",
                as:"owner"
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
router.get('/get_job_id',(req,res)=>{
    let job_id = req.query.job_id
  
    Job.findById(job_id)
    .then(job=>{
        return res.send({
            "job":job
        })
    })
    .catch(err=>{
        console.log(err);
        return res.send({
            "job":""
        })
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

router.get('/get_applications_by_job_id',(req,res)=>{
    let job_id = req.query.job_id

    Job_application.findById({job_id:job_id}).then(applications=>{
        res.send({
            "applications": applications
        })
    })
})


router.get("/get_all_students",(req,res)=>{
User.find({is_student:1})
.then(students=>{
    res.send({
        "students": students
    })
})
})


router.get("/get_student_details_by_id",(req,res)=>{
    let student_id = req.query.student_id
    console.log(student_id)
    User.findById(student_id)
    .then(student=>{
        res.send({
            "student": student
        })
    })
})

router.get("/delete_user",(req,res)=>{
    let user_id = req.query.user_id
    User.findByIdAndDelete(user_id)
    .then(msg=>{
        return res.send({
            "msg":"Delete Successfully"
        })
    })
})

router.post("/update_student",async(req,res)=>{
    let user_id = req.body.user_id
    let email = req.body.email
    let name = req.body.name
    let education = req.body.education
    let last_degree = req.body.last_degree


    let about_me = req.body.about_me

    let password = req.body.password
   

    let filter= {_id:user_id}

    
    if(password){
        bcrypt.hash(password,saltRounds,async(err,hash)=>{
            let updateDoc = ""
            if(req.files){
                let student_cv = req.files.student_cv

                save_cv(student_cv)
                 updateDoc = await {
                    "student.name":name,
                    "student.about_me":about_me,
                    "student.education":education,
                    "student.student_cv":student_cv.name,
                    "student.last_degree":last_degree,
                    email:email,
                    password:hash,
                  
                }
    
            }else{
                 updateDoc = await {
                    "student.name":name,
                    "student.about_me":about_me,
                    "student.education":education,
    
                    "student.last_degree":last_degree,
    
                    email:email,
                    password:hash,
                   
                }
    
            }
           
            await User.updateMany(filter,updateDoc)
        })
    }else{
        let updateDoc = ""
        if(req.files){
            let student_cv = req.files.student_cv

            save_cv(student_cv) 
             updateDoc =  {
                "student.name":name,
                "student.about_me":about_me,
                "student.education":education,
                "student.student_cv":student_cv.name,
    
                "student.last_degree":last_degree,
    
                email:email,
                
              
        }
        }else{
             updateDoc =  {
                "student.name":name,
                "student.about_me":about_me,
                "student.education":education,
                "student.last_degree":last_degree,
                email:email,
                
           
            }
        }
       

        await User.updateMany(filter,updateDoc)
    }

    return res.send({
        "msg":"updated successfully"
    })
    
})


router.post("/add_user",(req,res)=>{
     
let role = req.body.role
  

bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
  console.log(hash)


  let user_details =await {
    "email":req.body.email,
    "password":hash,
    "is_student":role == "student"?1:0,
    "is_employer":role == "employer"?1:0,
    "is_admin":role == "admin"?1:0,
  }
 


  User.findOne({email:user_details.email})
  .then(user=>{
    if(user == null){

      if(role == "student"){
        signup_student(req,res,user_details)
      }else if(role == "employer"){
        signup_employer(req,res,user_details)
    
      }else if(role == "admin"){
        signup_admin(req,res,user_details)
      }

    }else{
      return res.send({
        
        "msg":"User already exists"
      })
    }
  })
  
 

  })
  
})


router.post("/update_employer",async(req,res)=>{
    let user_id = req.body.user_id
    let email = req.body.email
    let name = req.body.name
    let domain = req.body.domain
    let address = req.body.address

    let password = req.body.password
   

    let filter= {_id:user_id}

    
    if(password){
        bcrypt.hash(password,saltRounds,async(err,hash)=>{
            let updateDoc = ""
            
                 updateDoc = await {
                    "employer.name":name,
                    "employer.address":address,
                    "employer.domain":domain,
                    email:email,
                    password:hash,
                   
                }
    
           
           
            await User.updateMany(filter,updateDoc)
        })
    }else{
        
      
             let updateDoc =  {
                "employer.name":name,
                "employer.address":address,
                "employer.domain":domain,
                email:email,
                
           
            }
       
       

        await User.updateMany(filter,updateDoc)
    }

    return res.send({
        "msg":"updated successfully"
    })
})

router.get("/get_all_employers",(req,res)=>{
    User.find({is_employer:1})
    .then(employers=>{
        res.send({
            "employers": employers
        })
    })
})

router.get("/get_user_by_id",(req,res)=>{
    let user_id = req.query.user_id
    console.log(user_id)

    User.findById(user_id)
    .then(user=>{
        return res.send({
            "user":user
        })
    })
})


router.get("/get_all_applications",(req,res)=>{
    Job_application.aggregate([
        {
            $lookup:{
                from:"users",
                localField:"student_id",
                foreignField:"_id",
                as:"user"
            }
        },{
            $lookup:{
                from:"jobs",
                localField:"job_id",
                foreignField:"_id",
                as:"job"
            }
        }
    ])
    .then(applications=>{
        return res.send({
            "applications":applications
        })
    })
})


router.get("/delete_application",(req,res)=>{
    let application_id = req.query.application_id
    Job_application.findByIdAndDelete(application_id)
    .then(msg=>{
        return res.send({
            "msg":"Deleted Successfully"
        })
    })
})


router.get('/get_application_by_id',(req,res)=>{
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


router.post("/update_admin_profile",(req,res)=>{
    let admin_id = req.body.admin_id
    let filter={_id:admin_id}

    User.findOne({email:req.body.email})
    .then(user=>{
        if(user == null){
            bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
                let updateDoc =await {
                    email: req.body.email,
                    password:hash
                }
        
               await User.updateMany(filter,updateDoc)
            })
        }else{
            return res.send({
                "msg":"Email Already Exist"
            })
        }
        
    
    })
   
    return res.send({
        "msg":"Updated successfully"
    })
    
})
module.exports = router