const express = require('express')
const ejs = require('ejs')
const app = express()
const express_layouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const axios = require('axios')
const passport = require('passport')
const MongoStore = require('connect-mongo')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//connect to db
require('./config/database')

app.use(flash())
app.use(session({
    secret : 'lorem secret random key',
    resave : false,
    saveUninitialized : false,
    store : MongoStore.create({
        mongoUrl: require('./config/database').DB_URL
    }),
    cookie:{
        secure : false,
        httpOnly : false,
        // maxAge : 60000*15
    }
}))

 require('./config/passport-setup')(passport)

//passport
app.use(passport.initialize());
app.use(passport.session());



app.set('view engine' , 'ejs')
app.use(express_layouts)
app.set('views' , 'views')
app.use(express.static('public'))
app.use(express.static('node_modules'))
app.use(express.static('images'))
const deleteIMG = require('./config/delete_unusedImage')


    // deleting un used images
    deleteIMG()

const eventRoute = require('./routes/event.route')
const userRoute = require('./routes/user.route')
const { notAuth } = require('./middlewares/auth')

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
    res.locals.user = req.user
    next();
});

app.use('/users' ,userRoute )
app.use('/events' ,eventRoute )
app.use('/' , notAuth, (req , res)=>{
    res.render('users/login',{
                errors: [],
                title: 'Login',
                active : 'login'
         })
})




const PORT =process.env.PORT || 3000
app.listen(PORT , console.log(`running on port ${PORT}`))