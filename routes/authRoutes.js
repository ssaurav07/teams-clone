const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { isLoggedIn } = require('../middleWares/isLoggedIn');

// -------------------------Render register page--------------------------------------- //

router.get('/register', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('authPages/signup');
  }
  else {
    req.flash('error', "Please logout first to signup for a new account.");
    res.redirect('/explore');
  }
})

// -------------------------Register a new user--------------------------------------- //

router.post('/register', async (req, res, next) => {
  try {
    const { email, name, username, password } = req.body;
    const user = new User({ email, name, username });
    const registeredUser = await User.register(user, password);

    // Logging in once signed up
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', "Welcome to MS Teams! You're all set to rock!");
      res.redirect('/explore');
    });
  }
  catch (err) {
    console.log(err);
    if(err.message.indexOf("11000") != -1){
      req.flash('error', "Email id already exists!");
      res.redirect('/register');
    }
    else{
    req.flash('error', err.message);
    res.redirect('/register');
    }
  }
})

// -------------------------Render login page--------------------------------------- //

router.get('/login', (req, res) => {
  if (!req.isAuthenticated()) {
    res.render('authPages/signin');
  }
  else {
    req.flash('error', "You are already logged in!");
    res.redirect('/explore');
  }
})

// -----------------------------Login a user--------------------------------------- //

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', "Logged in successfully!");
  let redirectUrl = req.session.returnTo || '/explore';
  delete req.session.returnTo;
  res.redirect(redirectUrl);

})

// -------------------------Logout a user--------------------------------------- //

router.get('/logout', (req, res) => {
  req.flash('error', "Logged out successfully!");
  req.logout();
  res.redirect('/');
})

// -------------------------google authentication request------------------------- //

router.get('/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] }));



// ---------------------Callback Function for Google Authentication------------------ //

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');  // Successful authentication, redirect to home.
  });


module.exports = router;