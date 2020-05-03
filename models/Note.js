const mongoose = require('mongoose')

const NoteSchema =  mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
  note:{
      type:String,
      required:true
  },
  date:{
      type:Date,
      default:Date.now
  }
})

module.exports = mongoose.model('note',NoteSchema)