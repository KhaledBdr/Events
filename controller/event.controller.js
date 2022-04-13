const eventActions = require('../models/eventActions')
const {validationResult} = require('express-validator')
const Event = require('../models/Event.model')
const {todayDate , tomorrow , todayRecords} = require('../config/todayRecords')


//View Events according to the Status {all , today , expired}
module.exports.viewAllEvents = async(req , res)=>{
// get Page number from fronEnd
    let UserpageNo = parseInt(req.params.pageNo)
    pageNo = UserpageNo-1;
// get number of records 
    const NORecords = await Event.countDocuments({userId : req.user.id})

// assign the query for the Database     
    let query = {
        skip : pageNo*5,
        limit : 5
    }

    if(pageNo >=  Math.ceil(NORecords/5)){
        pageNo = (Math.ceil(NORecords/5))-1
        UserpageNo = pageNo+1
        query.skip = pageNo*5;
    }
    
// View Events according to the Status {all}
    let result =await eventActions.viewAllEvents(req.user._id , query , 'all')
// get num of Today Records
    const todayrec = await todayRecords(req.user._id)
// Send Response to The End User
    res.render('events/index' , {
        events : result,
        title:'Home Page',
        active : 'home',
        alert : '',
        num : todayrec,
        NORecords : NORecords,
        pageNo : UserpageNo
    })
}

// Get One Event in the Show Page with ID
module.exports.viewOneEvent = async(req , res)=>{
// get the event from DataBase
    const result = await eventActions.viewOneEvent(req.params.id)

// get num of Today Records
    const todayrec =await todayRecords(req.user._id)
    res.render('events/show' , {
        title:'Home Page',
        active : 'home',
        event : result,
        num : todayrec
    })
}
module.exports.deleteEvent = async(req,res)=>{
// delete Event
   const result = await eventActions.deleteEvent(req.params.id)
   //the response is sent from js file with axios in customJs.js
}

//get Create New Event Page
module.exports.getCreateEventPage = async(req , res)=>{

// get num of Today Records
    const todayrec =await todayRecords(req.user._id)

// render the Creation Page
    res.render('events/create' ,{
        title :'Create Event',
        active: 'create',
        errors : [],
        num : todayrec
    })
}

// Post New Event
module.exports.createEvent = async(req , res)=>{
// get num of Today Records
    const todayrec =await todayRecords(req.user._id)
    const data = req.body

// check the inputs Validation 
   const errors = validationResult(req);

// if the input contain Errors
    if (!errors.isEmpty()) {

// render creation Page again with the errors
        res.render('events/create' ,{
        title :'Create Event',
        active: 'create',
        errors : errors.array(),
        num : todayrec
        })
    }
// if the inputs are valid
    if(errors.isEmpty()){
        const result = await eventActions.createEvent(data)
// redirect to events page
        res.redirect('/events/1')
    }}

//get Edit Page
module.exports.getEditEventPage = async(req , res)=>{
    const id = req.params.id
// get Event Details to dispaly in the Edit Page to edit
    const event = await eventActions.getEditEventDetails(id)
// formate Date in the formate mm/dd/yyyy
    date = getFormattedDate(event.date)
// get num of Today Records
    const todayrec =await todayRecords(req.user._id)
// render Edition Page
    res.render('events/edit' ,{
        title :'Edit Event',
        active: '',
        event : event,
        date:date,
        errors : [],
        num : todayrec
    })
}

//post Edit Page
module.exports.editTheEvent = async(req , res)=>{
    const data = req.body

// get the inputs Validation 
   const errors = validationResult(req);
// get number of Today Records
    const todayrec =await todayRecords(req.user._id)

// check the inputs Validation 
    if (!errors.isEmpty()) {
        res.render('events/edit' ,{
        title :'Edit Event',
        active: 'create',
        event :data ,
        date : data.date,
        errors : errors.array(),
        num : todayrec
        })
    }
    if(errors.isEmpty()){
    await eventActions.deleteEvent(req.params.id)
    const result = await eventActions.createEvent(data)
    res.redirect('/events')

}
}
//Today Events

module.exports.getTodayEvents = async(req , res)=>{
    let UserpageNo = parseInt(req.params.pageNo)
    pageNo = UserpageNo-1;
    const todayrec =await todayRecords(req.user._id)

    let query = {
        skip : pageNo*5,
        limit : 5
    }
    if(pageNo >=  Math.ceil(todayrec/5)){
        pageNo = (Math.ceil(todayrec/5))-1
        UserpageNo = pageNo+1
        query.skip = pageNo*5;
    }
    
    let result =await eventActions.viewAllEvents(req.user._id , query , 'today')
    res.render('events/index' , {
        events : result,
        title:'Today Events',
        active : 'today',
        num : todayrec,
        alert : '',
        NORecords : todayrec,
        pageNo : UserpageNo
    })
}

// endedEvents
module.exports.getendedEvents = async(req , res)=>{
     let UserpageNo = parseInt(req.params.pageNo)
    pageNo = UserpageNo-1;
    const todayrec =await todayRecords(req.user._id)

    const NORecords = await Event.countDocuments({userId : req.user.id , date : {$lt: todayDate} })
    let query = {
        skip : pageNo*5,
        limit : 5
    }
    if(pageNo >=  Math.ceil(NORecords/5)){
        pageNo = (Math.ceil(NORecords/5))-1
        UserpageNo = pageNo+1
        query.skip = pageNo*5;
    }
    
    let result =await eventActions.viewAllEvents(req.user._id , query , 'expired')
    res.render('events/index' , {
        events : result,
        title:'Expired Events',
        active : 'endedEvents',
        alert : '',
        num : todayrec,
        NORecords : NORecords,
        pageNo : UserpageNo
    })
}

// change date format
function getFormattedDate(date) {
  var year = date.getFullYear();

  var month = (1 + date.getMonth()).toString();
  month = month.length > 1 ? month : '0' + month;

  var day = date.getDate().toString();
  day = day.length > 1 ? day : '0' + day;
  
  return year + '-' + month + '-' + day   ;
}