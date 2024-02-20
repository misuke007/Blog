const {io} = require('../app')


exports.ensureAuthenticated = (req ,res , next)=>{

    if(req.isAuthenticated()){
        next()
    }else{
        req.flash('error',`Connectez-vous d'abord`)
        return res.redirect('/user/login')
    }
}







