const express = require('express')
const router = express.Router()
const passport = require('passport')
const {check , validationResult} = require('express-validator')
const {nameValidation , re_passwordValidation,emailValidation , passwordValidation , imageValidation, emailExistsCustomValidation , notFoundEmail, newPasswordValidation, confirmNewPasswordValidation, wrongPassword} = require('../validator/user.validator')
const noneMul = require('multer')().none

const userController = require('../controller/user.controller')
const { isAuth, notAuth, isAdmin, isSameUser, isSuperAdmin } = require('../middlewares/auth')
const { upload } = require('../middlewares/multer')
const { Admin } = require('mongodb')

// login
router.get('/login' , notAuth , userController.getLogin)

router.post('/login' , notAuth , emailValidation , notFoundEmail , passwordValidation , wrongPassword ,userController.postLogin , 
passport.authenticate('local-login' , {
  failureFlash : true,
  successRedirect : '/events/1',
  failureRedirect : '/users/login'
}))


// register
router.get('/register', notAuth ,   userController.getRegisteration)

router.post('/register' ,upload.single('image'),  notAuth,nameValidation,imageValidation,re_passwordValidation,emailValidation,passwordValidation,emailExistsCustomValidation,
   userController.postRegisteration ,  passport.authenticate('local-signup', {
      failureRedirect: '/users/register', 
      failureFlash: true , }));


router.get('/profile', isAuth , userController.getProfile)
router.get('/profile/edit' , isAuth  , userController.getEditProfile)
router.post('/profile/edit' ,upload.single('image') , isAuth ,nameValidation , imageValidation, passwordValidation , userController.postEditProfile)
router.get('/logout' , isAuth , userController.logout)
router.get('/allusers' ,isAuth , isAdmin ,(req , res)=>{
  res.redirect('/users/allUsers/1')
})
router.get('/allusers/:pageNo' ,isAuth , isAdmin ,userController.getAllUsers)
router.get('/deleteUser/:id' , isAuth , isAdmin , userController.deleteUser)
router.get('/changePassword' , isAuth  , userController.getChangePassword)
router.post('/changePassword', isAuth ,passwordValidation ,newPasswordValidation , confirmNewPasswordValidation, userController.postChangePassword)
router.get('/makeAdmin/:id' , isAuth ,isAdmin ,isSuperAdmin , userController.makeAdmin)
router.get('/removeAdmin/:id' ,isAuth , isAdmin , isSuperAdmin , userController.removeAdmin )
module.exports = router