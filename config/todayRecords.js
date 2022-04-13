const Event = require("../models/Event.model");

// Today Date with Time
let todayDate = new Date(Date.now());

//Today Date without Time
let todayD = new Date(`${todayDate.getMonth()+1}/${todayDate.getDate()}/${todayDate.getFullYear()}`)

//Tomorrow Date without Time
let tomorrow = new Date(`${todayDate.getMonth()+1}/${todayDate.getDate() + 1}/${todayDate.getFullYear()}`)

// get number of today Events
module.exports.todayRecords =  async(id)=>{
    return await Event.countDocuments({userId : id ,
         date : {$gt: todayD , $lt: tomorrow } })
}

// Export today Date
module.exports.tomorrow = this.tomorrow
// Export Tomorrow Date
module.exports.todayDate = this.todayDate