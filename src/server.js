const express = require('express')
const ejs = require('ejs')
const db = require('./db/mongodb')
const path = require('path')

const app = express()
var bodyParser = require('body-parser')

const viewsPath = path.join(__dirname,'/views')
 
const port = process.env.PORT || 3000
 

app.use(bodyParser.urlencoded({ extended: false }))
 

app.use(bodyParser.json())
 

db()


app.use(express.static(path.join(__dirname,'public')))
app.use(express.static('public'))
app.set('view engine','ejs')
app.set('views',viewsPath)


app.use('',require('./routes/userRoutes'))
app.use('',require('./routes/notesRoutes'))

app.listen(port,()=>{
    console.log(`server is on port' ${port}`)
})