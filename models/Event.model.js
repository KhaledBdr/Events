const mongoose = require('mongoose')
const EventSchema = new mongoose.Schema({
    userId:{
        type: String,
        required : true
    },
    title:{
        type : String,
        required : true
    },
    description: {
        type : String,
        required : true
    },
    location: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        required : true
    },
    created_at:{
        type: Date,
        default: Date.now()
    }
})

let Event = mongoose.model( 'Event',EventSchema, 'events')

module.exports = Event