const nodemailer = require('nodemailer')
require('dotenv').config()

module.exports = async (mail,body) => {
    let transporter = nodemailer.createTransport({
        service:'gmail',
        
        auth: {
          user: process.env.email, // generated ethereal user
          pass: process.env.password// generated ethereal password
        }
      });

      try {
        await transporter.sendMail({
            from: process.env.email, // sender address
            to: mail, // list of receivers
            subject: "Reset password", // Subject line
            text: body// plain text body// html body
          });


          
      } catch (error) {
          console.log(error)
      }

     
}