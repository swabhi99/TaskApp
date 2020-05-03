const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const auth = require('../middleware/auth')

const Note = require('../models/Note')

//Add task(private)
//post request

router.post('/notes',[
  check('note','note is required').not().isEmpty()
],auth,async(req,res)=>{
   let errors = validationResult(req)
   if(!errors.isEmpty()){
     errors=errors.array()
     return res.render('notes',{errors:errors})
   }
  try{
    const {note}= req.body
    const newtask = new Note({note ,user:req.user.id})
   await newtask.save()
   res.render('notes')
  }catch(e){
    console.log(e.message)
  }
   
})

//Get task (private)
//get req

router.get('/notes',auth,async(req,res)=>{
 let notes = await Note.find({user:req.user.id})
  if(notes.length === 0){
    return res.render('notes',{
      msg:'no notes found'
    })
  }

  res.render('notes',{
    notes:notes
  })
})

module.exports = router