const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const {isLoggedIn} = require('../middleWares/middleWare');

router.get('/register', (req, res) => {
  if(!req.isAuthenticated()){
    res.render('signup');
  }
  else{
    req.flash('error',"Please logout first to signup for a new account.");
    res.redirect('/explore');
  }
})

router.post('/register', async (req, res , next) => {
  try{
    const {email,name,username,password} = req.body;
  const user = new User({email,name,username});
  const registeredUser = await User.register(user,password);
  
  req.login(registeredUser , err =>{
      if(err) return next(err);
      req.flash('success',"Welcome to MS Teams! You're all set to rock!");
      res.redirect('/explore');
  });
  }
  catch(err) {
    req.flash('error',err.message);
    res.redirect('/register');
  }
})

router.get('/login', (req, res) => {
  if(!req.isAuthenticated()){
    res.render('signin');
  }
  else{
    req.flash('error',"Good Morning! You are already logged in!");
    res.redirect('/explore');
  }
})

router.post('/login', passport.authenticate('local' , {failureFlash: true , failureRedirect:'/login'}),(req, res) => {
  req.flash('success',"Logged in successfully!");
  res.redirect('/explore')
})

router.get('/logout', (req, res)=>{
  req.flash('error',"Logged out successfully!");
  req.logout();
  res.redirect('/');
})

module.exports = router;