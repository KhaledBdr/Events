const {check} = require('express-validator')
const { User } = require('../models/User.model')

module.exports=  {
    imageValidation : 
    check('image').custom((value , {req})=>{
        if(value == undefined){
            return true
        }else if(req.file.mimetype.split('/')[0] !== 'image'){
            throw new Error('Not image')
        }  
        
        else{
            return true
            }
    }),
    emailValidation :  
        check('email').notEmpty().withMessage(`Email can't be empty`).isEmail().withMessage(`Invalid Email`),
    
    emailExistsCustomValidation : 
    check('email').custom(async(value , {req})=>{
        const user = await User.findOne({email : value})
        if(user){
            throw new Error('Email already exists')}
        return true
    }),
    wrongPassword : 
    check('password').custom(async(value , {req})=>{
        const user = await User.findOne({email : req.body.email})
        if(user){
           const result = user.validPassword(value , user)
           if(result){
               return true
           }else{
               throw new Error('Wrong Password')
           }
        }
        return true
    }),

    notFoundEmail:
    check('email').custom(async(value , {req})=>{
        const password = req.body.password
        const user = await User.findOne({email : value})
        if(user==null){
            throw new Error('Email not founded')}
        return true
    }),
    
    passwordValidation:
        check('password').notEmpty().withMessage(`Password can't be empty`).isLength({min:8}).withMessage('invalid password, it must be at least 8 characters'),
    nameValidation: 
        check('userName').notEmpty().withMessage('You must Enter Your Name').isLength({min:5}).withMessage(`your name can't be little than 5 charaters`).not().isNumeric().withMessage(`Your name can't be a number`),
    re_passwordValidation:
        check('re_password').notEmpty().withMessage(`Repeat your Password Please`).custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  }),
    newPasswordValidation:
        check('newPassword').notEmpty().withMessage(`You must Enter new Password`).isLength({min:8}).withMessage('invalid password, it must be at least 8 characters'),
    confirmNewPasswordValidation:
        check('confirmPassword').notEmpty().withMessage(`Repeat your Password Please`).custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Password confirmation does not match password');
    }
    return true;
  })
}

