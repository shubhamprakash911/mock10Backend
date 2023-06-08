const express= require("express");
const { userModel } = require("../model/user.model");
const bcrypt = require("bcrypt");
const { sendMail } = require("../nodeMailer");
const userRouter= express.Router();
const jwt = require("jsonwebtoken")






//signup router
userRouter.post("/register", async(req,res)=>{
    let {email,password} = req.body;

    try {
        const user = await userModel.find({email})
        if(user.length>0){
            res.status(200).send({
                message:`Already register with this email ${email} \n Please login`,
                status:true
            })
        }else{
             req.body.password = await bcrypt.hash(password,6);
             let newuser=await new userModel(req.body).save();
             console.log(newuser)
             sendMail("ChatApp: Registeration Email",`Please click on this link to verify your email address  <a href="http://localhost:8000/user/verify/${newuser._id}">Click Here to verify email</a>`,newuser.email)
             res.send({message:"a verification email send to your email  accountm, please verify it"})
        }

    } catch (error) {
        console.log(error)
        res.status(400).send({error})    
    }
})

//user login
userRouter.post("/login",async (req,res)=>{
    let {email, password} = req.body;
    try {
        let user = await userModel.find({email})
        if(user.length==0){
            res.send({message:"please register first"})
        }else{
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (result) {
                    jwt.sign({ userId: user[0]._id }, process.env.secretKey, (err, token) => {
                        if (token) {
                            res.status(200).send({ message: "Login successful", token});
                        } else {
                            res.status(400).send({ message: " jwt error"});
                        }
                    });
                } else {
                    res.status(200).send({ message: "Wrong credentials" });
                }
            })
        }
    } catch (error) {
        console.log(error)
        res.status(400).send({error})   
    }
})


// email verification
userRouter.get("/verify/:id", async (req,res)=>{
    try {
        let user = await userModel.findByIdAndUpdate({ _id: req.params.id }, {verified:true})
        res.redirect(`http://127.0.0.1:5500/emailVerify.html`)
    } catch (error) {
        console.log(error)
        res.status(400).send({error})  
    }
})




// get all users
userRouter.get("/",async (req,res)=>{
    try {
        const user = await userModel.find();
        res.status(200).send({user})
    } catch (error) {
        console.log(error)
        res.status(400).send({error})
    }
})

module.exports={userRouter}