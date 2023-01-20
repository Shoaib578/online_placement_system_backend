const router = require('express').Router();
const User = require('../../models/User')




const bcrypt = require("bcryptjs")

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
 let cv = req.files.cv
 let degree = req.body.degree

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
 "student.student_cv":cv.name,
  "student.last_degree":degree
 })

 new_user.save()

 if(req.files.cv){
  save_cv(req.files.cv)
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



router.post('/login',(req,res)=>{
  
 console.log("Hello world")
  User.findOne({email:req.body.email})
  .then(user=>{
   if(user != null){
    bcrypt.compare(req.body.password, user.password, function(error, response) {
      console.log(response)
     if(response == true){
       res.send({
         "user":user,
         "msg":"logged in Succesfully"
       })
     }else{
       res.send({
         "msg":"Incorrect email or password"
       })
     }
  });
   }else{
     res.send({
       "msg":"Incorrect email or password"
     })
   }
  });
    
})




router.post('/signup',(req,res)=>{
  
let role = req.body.role
  

bcrypt.hash(req.body.password,saltRounds,async(err,hash)=>{
  console.log(hash)


  let user_details =await {
    "email":req.body.email,
    "password":hash,
    "is_student":role == "student"?1:0,
    "is_employer":role == "employer"?1:0,
    "is_admin":0,
  }
 


  User.findOne({email:user_details.email})
  .then(user=>{
    if(user == null){

      if(role == "student"){
        signup_student(req,res,user_details)
      }else{
        signup_employer(req,res,user_details)
    
      }

    }else{
      return res.send({
        
        "msg":"User already exists"
      })
    }
  })
  
 

  })
  

  
    
})



router.route('/profile').get((req,res)=>{
    const user_id = req.query.user_id
    User.findById(user_id)
      .then(user=>{
        console.log(user)
       res.send({
         "user":user
       })
      })
    
})


module.exports = router;