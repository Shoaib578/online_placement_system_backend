const express = require('express')
const app = express()
const path = require('path')


const cors = require('cors');
const connect_db = require('./connect_db')
const create_admin = require('./apis/admin/create_admin')
const upload = require('express-fileupload')
app.use(express.static("public"));
app.use(upload())
app.use(cors());
app.use(express.json());
connect_db()
create_admin()

const student = require('./apis/student')
app.use('/apis/student',student)

const employer = require('./apis/employer')
app.use('/apis/employer',employer)

const admin = require('./apis/admin')
app.use('/apis/admin',admin)

const auth = require('./apis/auth')
app.use('/apis/auth',auth)


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});