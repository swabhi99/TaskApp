const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const config = require('config')

const auth = require('../middleware/auth')
const User = require('../models/User') 

const sendMail = require('../email/sendMail')

if (typeof localStorage === "undefined" || localStorage === null) {
    const LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }
   


//home

router.get('/home',(req,res)=>{
    res.render('home')
})


//Register user (get request)
// public

router.get('/register',(req,res)=>{
    res.render('register')
})

//login user (get request)
// public

router.get('/login',(req,res)=>{
    res.render('login')
})



// Register users (Post request)
// Public

router.post('/register',[
    check('name','enter name').not().isEmpty(),
    check('email','valid email required').isEmail(),
    check('password','password is too short').isLength({min:4})
],async(req,res)=>{
    let errors = validationResult(req)

    if(!errors.isEmpty()){
        errors = errors.array()
        return res.render('register', {
            errors: errors
          })
    }
  
    try {

        const {email,name,password} = req.body

        let user = await User.findOne({email})
      
        if(user){
         return  res.render('register',{
             msg:'email already taken'
         })
        }
        
       
         user = new User({email,name,password})
      
         const salt = await bcrypt.genSalt(8)
      
         const hash = await bcrypt.hash(password,salt)
      
          user.password = hash
      
          await user.save()

   

          const payload = {
            user:{
                id:user.id
            }
        }
    
        jwt.sign(payload,
            config.get('jwtsecret'),
            (err,token) => {
                if(err) throw err
               const x= localStorage.setItem('x-auth-token',token)
                res.redirect('notes')
            }
            )
        
    } catch (error) {
        console.log(error.message)
    }


}),

// Login user (post)
// Public

router.post('/login',[
    check('email','enter valid email').isEmail(),
    check('password','password required').exists()

],async(req,res)=>{
    
    const errors = validationResult(req)

    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()})
    }
    try{

    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.render('login',{msg:'invalid email or password'})
    }
    
  const isMatch =  await bcrypt.compare(password,user.password)
 

     if(!isMatch){
         return res.render('login',{msg:'invalid email or password'})
     }
    
     const payload = {
        user:{
            id:user.id
        }
    }

    jwt.sign(payload,
        config.get('jwtsecret'),
        (err,token) => {
            if(err) throw err
            localStorage.setItem('x-auth-token',token)
            res.redirect('notes')
        }
        )
    
    }catch(e){
        res.status(404).send(e.message)
    }
})


//test route

router.get('/test',async(req,res)=>{
    const user = await User.find()
    res.render('home')
})


//Forget Password (public)

router.get('/forgotpassword',(req,res)=>{
    res.render('forgotpassword')
})

router.post('/reset',async(req,res)=>{
    try{
        const email = req.body.email
        const user = await User.findOne({email})
        console.log(user)
        if(!user){
          return  res.render('forgotpassword',{
                msg:'email invalid'
            })
        }

       

      const buff =   crypto.randomBytes(20)

      const token = buff.toString('hex')

      console.log(token)

       user.resetPasswordToken = token

       user.resetPasswordDate = Date.now() + 3600000

       await user.save()


       console.log(user)
    
        sendMail(email,`http://${req.headers.host}/forgot/${token}`)

        res.render('login',{
            msg:'email send with further instructions'
        })

    }catch(e){
        console.log(e.message)
    }
   

})


router.get('/forgot/:token',(req,res)=>{
  res.render('forgot', {token: req.params.token})
})

router.post('/forgot/:token',async(req,res)=>{
    const token = req.params.token
    const user = await User.findOne({resetPasswordToken:token})
     console.log(user)
    if(!user){
        res.render('forgotpassword',{
            msg:'link expired try again'
        })
    }

    if(req.body.password === req.body.password2){
        const salt = await bcrypt.genSalt(8)
      
        const hash = await bcrypt.hash(req.body.password,salt)
    
      const user= await User.findOneAndUpdate({resetPasswordToken:token},{password:hash},{
            returnOriginal:false,
            useFindAndModify:false
        })

        user.forgotPasswordToken = null,
        user.forgotPasswordDate = null

        console.log(user)
        await user.save()

  res.redirect('/notes')

        console.log(user)
    }else{
        res.render('forgot',{msg:'password do not match'})
    }

  })


  router.post('/logout',auth,(req,res)=>{
      console.log(req.user.token)
      localStorage.setItem('x-auth-token','')
      res.redirect('/home')
  })

module.exports = router


