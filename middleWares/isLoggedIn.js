
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error' , "Hey! Did you just forget to login?")
        return res.redirect('/login');
    }
    next();
}