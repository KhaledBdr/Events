const express = require('express')
const router = express.Router()
const eventController = require('../controller/event.controller')
const {titleValidation , descriptionValidation , locationValidation , dateValidation} = require('../validator/events.validator')
const {isAuth} = require('../middlewares/auth')



//delete event
router.delete('/event/delete/:id', isAuth , eventController.deleteEvent)
//get creation page
router.get('/create', isAuth , eventController.getCreateEventPage)
//create event
router.post('/create', isAuth,titleValidation , descriptionValidation , locationValidation , dateValidation
,eventController.createEvent)
//get Edit Page
router.get('/event/edit/:id', isAuth , eventController.getEditEventPage)
//post Edit Page
router.post('/event/edit/:id', isAuth ,titleValidation , descriptionValidation , locationValidation , dateValidation
,eventController.editTheEvent)
// specific event
router.get('/event/:id', isAuth , eventController.viewOneEvent)
//todayEvents
router.get('/Today/:pageNo' , isAuth , eventController.getTodayEvents)
router.get('/Today' , isAuth,(req , res)=>{
    res.redirect('/Today/1')
})
//endedEvents
router.get('/endedEvents/:pageNo' , isAuth , eventController.getendedEvents)
router.get('/endedEvents' , isAuth,(req , res)=>{
    res.redirect('/endedEvents/1')
})
// all events with pagination
router.get('/:pageNo' , isAuth ,eventController.viewAllEvents)
router.get('/' , isAuth,(req , res)=>{
    res.redirect('/events/1')
})
module.exports = router