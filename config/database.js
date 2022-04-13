const mongoose = require('mongoose')

// DataBase URL
const DB_URL = 'mongodb://localhost:27017/eventsProject'
module.exports.DB_URL = DB_URL

// Connect To DB
mongoose.connect( DB_URL , (err)=>{
    err?console.log(err.message) : console.log(`connected successfully to ${mongoose.connection.db.databaseName} Database`)
})
