const jwt = require('jsonwebtoken')

require('dotenv').config()

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }

module.exports = function(req,res,next){

//  const token = req.header('x-auth-token')

const token = localStorage.getItem('x-auth-token')

 if(!token){
     res.render('home',{msg:"Please login or register first"

     })
 }

  try {
      const decoded = jwt.verify(token,process.env.jwtsecret)
       req.user=decoded.user
       console.log(decoded)
       next()
  } catch (error) {
      res.status(401).json({
          msg:'token invalid'
      })
  }
    
}