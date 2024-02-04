const express=require('express');
const app=express();
const mongoose=require('mongoose');
const cors=require('cors');
require('dotenv').config();
const userRoute=require('./routes/userRoute.js');
const adminRoute=require('./routes/adminRoute.js');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/UserManagement')
.then(()=>{
    console.log("MongoDB Connected ...!");
})
.catch(error => handleError(error)); 

app.use('/uploads',express.static('uploads'));

app.use("/user",userRoute);
app.use("/admin",adminRoute);

const port=process.env.PORT||4000;

app.listen(port,()=>{
    console.log(`Server running on port : ${port}`);
})