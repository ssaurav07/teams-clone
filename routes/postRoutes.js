const express = require('express');
const router = express.Router();
const post = require('../models/post');
const {isLoggedIn} = require('../middleWare');
let flag=true;

router.use((req,res,next)=>{
    res.locals.flag=flag;
    next();
  })

router.get('/feed', isLoggedIn ,(req, res)=>{
      post.find({},(err,posts)=>{
        if(err){
          console.log(err);
        }
        else{
          res.render("feed", {posts : posts});
        }
      });    
  })
  
  router.post('/feed', isLoggedIn ,(req, res)=>{
    req.body.posts.description = req.sanitize(req.body.posts.description);
    post.create(req.body.posts , (err,response)=>{
          if(err){
              console.log(err);
          }
          else{
              res.redirect("/feed");
          }
      })
  })
  
  router.get('/feed/new', isLoggedIn ,(req, res)=>{
    res.render('newPost');
  })
  
  router.get("/post/show/:id" , isLoggedIn , (req,res)=>{
      post.findById(req.params.id , (err , show)=>{
          if(err){
              console.log(err)
          }
          else{
          res.render("show" , {post : show });
          }
      });
  });
  
  router.get("/post/edit/:id", isLoggedIn , (req,res)=>{
      post.findById(req.params.id , (err,post)=>{
          if(err){
              console.log(err);
          }
          else{
              res.render("edit" , {post : post});
          }
      });
  });
  
  router.put("/post/:id", isLoggedIn , (req,res)=>{
    req.body.posts.description = req.sanitize(req.body.posts.description);
      post.findByIdAndUpdate(req.params.id , req.body.posts ,(err , post)=>{
          if(err){
              res.redirect("/post");
          }
          else{
              res.redirect("/post/show/"+req.params.id);
          }
      })	
  });
  
  router.delete("/post/:id" , isLoggedIn, (req,res)=>{
      post.findByIdAndRemove(req.params.id , (err,post)=>{
          if(err){
              res.redirect("/feed");
          }
          else{
              res.redirect("/feed");
          }
      })
  });


  module.exports = router;