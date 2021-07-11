const express = require('express');
const router = express.Router();
const Conversation = require("../models/personalConversation");
const {isLoggedIn}        = require('../middleWares/isLoggedIn');
let inFeedRoute=false;

router.use((req,res,next)=>{
    res.locals.inFeedRoute=inFeedRoute;
    next();
  })

// -------------------------Show conversations--------------------------------------- //

router.get('/conversations', isLoggedIn ,(req, res) => {
    res.render('chatPages/personalChats');
})


// -------------------------Create new conversation--------------------------------------- //

router.post("/conversations", isLoggedIn , async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// -------------------------Fetch conversations of a user--------------------------------------- //

router.get("/conversations/:userId", isLoggedIn , async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json(err);
    }
});


module.exports = router;