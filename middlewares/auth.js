module.exports.isAuth = (req , res , next)=>{
    if(req.user){
        next()
    }else{
        return res.redirect('/users/login')
    }
}

module.exports.notAuth = (req , res , next)=>{
    if(req.user){
        res.redirect('/events');
    }else{
        next()
    }
}

module.exports.isAdmin = (req , res , next)=>{
    if (req.user.isAdmin) {
        next()
    } else {
        res.redirect('/events');        
    }
}

module.exports.isSuperAdmin = (req , res , next)=>{
    if (req.user.isSuperAdmin) {
        next()
    } else {
        res.redirect('/events');        
    }
}

module.exports.isSameUser = (req , res , next)=>{
    if(req.user.id == req.params.id){
        next()
    }else{
        console.log(`wrong Id, Someone Trying to hack ${req.params.id}`);
        res.redirect('/users/profile')
    }
}