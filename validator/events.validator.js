const {check} = require('express-validator')

module.exports=  {
    titleValidation: check('title').notEmpty().withMessage('Please Enter the Event Title').isLength({min:3}).withMessage('Title Must Be at least 3 characters'),
    descriptionValidation:  check('description').isLength({min:1}).withMessage('Description can\'t be empty'),
    locationValidation: check('location').isLength({min:3}).withMessage('Location can\'t be empty'),
    dateValidation: check('date').notEmpty().withMessage('You must specify the date of the event').isDate(),
}
