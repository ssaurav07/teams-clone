
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){

        req.session.returnTo = req.originalUrl;  //To store the target Url and redirect to it, once logged in

        req.flash('error' , "You must be logged in first!")
        return res.redirect('/login');
    }
    next();
}