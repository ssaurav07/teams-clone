const express           = require('express');
const router            = express.Router();
const { v4: uuidV4 }    = require('uuid');
const Conversation      = require("../models/meetConversation");
const User              = require('../models/user');
const { isLoggedIn }    = require('../middleWares/isLoggedIn');
let inFeedRoute         =false;

router.use((req,res,next)=>{
    res.locals.inFeedRoute=inFeedRoute;
    next();
  })


// ----------------------------Show meet conversations------------------------------------ //

router.get('/meet-conversations', isLoggedIn, (req, res) => {
  res.render('chatPages/meetChats');
})

// -------------------------Show personal conversations--------------------------------------- //

router.get('/conversations', isLoggedIn ,(req, res) => {
  res.render('chatPages/personalChats');
})

// ------------------Create new Teams conversation and meet(if demanded)------------------ //

router.post("/meet-conversations", isLoggedIn, async (req, res) => {

  const newConversation = new Conversation({
    roomId: `${uuidV4()}`,
    name: req.body.roomName,
    members: [req.body.creatorId]
  });

  try {
    const savedConversation = await newConversation.save();

    if (req.body.isMeet === "true") {
      res.redirect(`/room/${newConversation.roomId}`);
    }
    else {
      res.redirect("/meet-conversations");
    }

  } catch (err) {
    res.status(500).json(err);
  }
});


// ----------------------------Render Join Teams Conversation Page ----------------------------------------- //

router.get('/join-meet-conversations/:conversationId', isLoggedIn, async (req, res) => {

  const conversation = await Conversation.find({
    roomId: req.params.conversationId
  })

  if (!conversation.length) {
    req.flash('error', "No such meet conversation exist! Try creating one!");
    res.redirect('/meet-conversations')
  }
  else {
    const convo = {
      roomName: conversation[0].name,
      participantCount: conversation[0].members.length
    }
    
    res.render('chatPages/joinMeetChat', { convo: convo });
  }
})

// ----------------------------------- Adds to the Teams conversation-------------------------------------- //

router.post('/join-meet-conversations/:conversationId', isLoggedIn, async (req, res, done) => {
  try {
    const conversation = await Conversation.find({
      roomId: req.params.conversationId
    });
    if (!conversation.length) {
      req.flash('error', "No such meet conversation exist! Try creating one!");
      res.redirect('/meet-conversations')
    }
    else {

      const foundConvo = await Conversation.find({
        roomId: req.params.conversationId,
        members: { $in: [req.user._id] }
      })


      if (foundConvo.length) {
        req.flash('success', "You've already joined the meet-conversations!");
        res.redirect('/meet-conversations')
      }
      else {

        await Conversation.update(
          { roomId: req.params.conversationId },
          { $addToSet: { members: req.body.userId } }
        );
        req.flash('success', "You're successfully added to the meet-conversations!");
        res.redirect('/meet-conversations')
      }

    }

  } catch (err) {
    console.log('Error')
    res.status(500).json(err);
  }
});


// ----------------------------------- Adds to the personal conversation-------------------------------------- //

router.get('/join-personal-conversations/:friendId/:userId', isLoggedIn, async (req, res, done) => {
  try {
    const friend = await User.findById(req.params.friendId);

    if (!friend) {
      return res.send({ status: false, message: "invalid friend" });
    }

    const conversation = await Conversation.find({
      members: { "$size": 2, "$all": [req.params.userId, req.params.friendId] },
      isPersonal: true
    });

    if (conversation.length) {
      return res.send({ status: false, message: "existss!" });
    }

    const newConversation = new Conversation({
      roomId: `${uuidV4()}`,
      name: `${req.params.userId}+${req.params.friendId}`,
      members: [req.params.userId, req.params.friendId],
      isPersonal: true
    });

    const savedConversation = await newConversation.save();
    res.send({ status: true, message: newConversation.roomId })
  } catch (err) {
    console.log('Error', err)
    res.status(500).json(err);
  }
});


// ----------------------------Fetch user's meet conversations------------------------------------ //

router.get("/meet-conversations/:userId", isLoggedIn, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      isPersonal: { $ne: true }
    });

    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ----------------------------Fetch user's Personal conversations------------------------------------ //

router.get("/personal-conversations/:userId", isLoggedIn, async (req, res) => {
  try {
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
      isPersonal: true
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});





module.exports = router;