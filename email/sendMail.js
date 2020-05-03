const nodemailer = require('nodemailer')
const config = require('config')

module.exports = async (mail,body) => {
    let transporter = nodemailer.createTransport({
        service:'gmail',
        
        auth: {
          user: config.get('email'), // generated ethereal user
          pass: config.get('password')// generated ethereal password
        }
      });

      try {
        await transporter.sendMail({
            from: config.get('email'), // sender address
            to: mail, // list of receivers
            subject: "Reset password", // Subject line
            text: body// plain text body// html body
          });


          
      } catch (error) {
          console.log(error)
      }

     
}