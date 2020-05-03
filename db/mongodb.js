const mongoose = require('mongoose')

require('dotenv').config()


const connect = async()=>{

    try {
        await mongoose.connect(
           process.env.mongoURI,
             { useNewUrlParser: true , useUnifiedTopology: true}
            )

            console.log('database connected')
    
    } catch (error) {
        console.log(error.message)
    }

}

module.exports = connect