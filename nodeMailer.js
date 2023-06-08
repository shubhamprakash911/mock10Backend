const nodemailer = require("nodemailer");

const sendMail = async (subject, body, userEmail) => {

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.nodemailerEmail,
            pass: process.env.nodemailerPass
        }
    });

    await transporter.sendMail({
        from: '<chatApp@gmail.com>',
        to: userEmail,
        subject: subject,
        html: body,
    },(err,info)=>{
        if(err){
            console.log(err)
        }else{
            console.log(info.response)
        }
    });

};

module.exports = { sendMail };