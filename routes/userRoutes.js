const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const {isLoggedIn} = require('../middleWares/isLoggedIn');

// -------------------------Render register page--------------------------------------- //

router.get('/register', (req, res) => {
  if(!req.isAuthenticated()){
    res.render('authPages/signup');
  }
  else{
    req.flash('error',"Please logout first to signup for a new account.");
    res.redirect('/explore');
  }
})

// -------------------------Register a new user--------------------------------------- //

router.post('/register', async (req, res , next) => {
  try{
    const {email,name,username,password} = req.body;
  const user = new User({email,name,username});
  const registeredUser = await User.register(user,password);
  
  // Logging in once signed up
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

// -------------------------Render login page--------------------------------------- //

router.get('/login', (req, res) => {
  if(!req.isAuthenticated()){
    res.render('authPages/signin');
  }
  else{
    req.flash('error',"Good Morning! You are already logged in!");
    res.redirect('/explore');
  }
})

// -----------------------------Login a user--------------------------------------- //

router.post('/login', passport.authenticate('local' , {failureFlash: true , failureRedirect:'/login'}),(req, res) => {
  req.flash('success',"Logged in successfully!");
  res.redirect('/explore')
})

// -------------------------Logout a user--------------------------------------- //

router.get('/logout', (req, res)=>{
  req.flash('error',"Logged out successfully!");
  req.logout();
  res.redirect('/');
})

// ------------------Get and send name of the user by her ID--------------------- //

router.get("/user/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  console.log(user)
  if(user) res.send({name: user.name});
  else res.send({name: "User"});
});

module.exports = router;