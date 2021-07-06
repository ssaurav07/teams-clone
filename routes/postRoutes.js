const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination : function(req, file , cb){
        cb(null,'./uploads/');
    },
    filename : function(req, file, cb){
        cb(null , Date.now()+ file.originalname);
    }

})
const upload = multer({storage: storage});

const post = require('../models/post');
const {isLoggedIn} = require('../middleWares/isLoggedIn');
let flag=true;

router.use((req,res,next)=>{
    res.locals.flag=flag;
    next();
  })

// -------------------------Show feeds------------------------------------- //

router.get('/feed', isLoggedIn ,(req, res)=>{
      post.find({},(err,posts)=>{
        if(err){
          console.log(err);
        }
        else{
          res.render("feedPages/feed", {posts : posts});
        }
      });    
  })
  
// -------------------------Create new POST--------------------------------------- //

router.post('/feed', isLoggedIn , upload.single('posts[image]') ,(req, res)=>{
      
    req.body.posts.description = req.sanitize(req.body.posts.description);
    if(req.file) req.body.posts.image = req.file.path;
    
    post.create(req.body.posts , (err,response)=>{
          if(err){
              console.log(err);
          }
          else{
              res.redirect("/feed");
          }
    })
})

// -------------------------Render new post page--------------------------------------- //
  
  router.get('/feed/new', isLoggedIn ,(req, res)=>{
    res.render('feedPages/newPost');
  })
  
// -------------------------Show particular post--------------------------------------- //

  router.get("/post/show/:id" , isLoggedIn , (req,res)=>{
      post.findById(req.params.id , (err , show)=>{
          if(err){
              console.log(err)
          }
          else{
          res.render("feedPages/show" , {post : show });
          }
      });
  });

// -------------------------Edit particular post--------------------------------------- //

  let imgString="";
  
  router.get("/post/edit/:id", isLoggedIn , (req,res)=>{
      post.findById(req.params.id , (err,post)=>{
          if(err){
              console.log(err);
          }
          else{
              console.log(post.image);
              imgString = post.image;
              res.render("feedPages/edit" , {post : post});
          }
      });
  });

// -------------------------Update particular post--------------------------------------- //
  
  router.put("/post/:id", isLoggedIn , upload.single('posts[image]') , (req,res)=>{
    req.body.posts.description = req.sanitize(req.body.posts.description);
    
    if(req.file) req.body.posts.image = req.file.path;
    else req.body.posts.image = imgString;

      post.findByIdAndUpdate(req.params.id , req.body.posts ,(err , post)=>{
          if(err){
              res.redirect("/post");
          }
          else{
              res.redirect("/post/show/"+req.params.id);
          }
      })	
  });

// -------------------------Delete particular post--------------------------------------- //
  
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