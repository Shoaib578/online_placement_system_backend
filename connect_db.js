const mongoose = require('mongoose')
mongoose.set('strictQuery', false);
 function connect (){
    const uri = 'mongodb+srv://Shoaib:placement123@onlineplacementsystem.hjevnju.mongodb.net/?retryWrites=true&w=majority'
    try{
         mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true })
        const connection = mongoose.connection;
        connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
        })
    }catch(e){
        console.log(e)
    }
}

module.exports = connect