const express = require('express');
const router = express.Router();
const passport = require('passport');



router.get('/auth/google',
  passport.authenticate('google', { scope: ['email' , 'profile'] }));



  // ---------------------Callback Function for Google Authentication------------------ //

router.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');  // Successful authentication, redirect home.
});


module.exports = router;