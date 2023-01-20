const User = require('../../models/User')
const bcrypt = require("bcryptjs")

const saltRounds = 10; 

function create_admin(){
User.findOne({is_admin:1})
.then(user=>{

    if(user == null){
        bcrypt.hash("admin",saltRounds,async(err,hash)=>{
            let new_user=await User.create({
                email:"theadmin@gmai.com",
                password:hash,
                is_admin:1,
                is_student:0,
                is_employer:0
    
            })
            new_user.save()

        })
        console.log("Admin Created")
        
    }else{
        console.log("Admin Already Exists")
    }
})
}

module.exports = create_admin;