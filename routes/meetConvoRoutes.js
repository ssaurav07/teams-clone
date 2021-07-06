const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const Conversation = require("../models/meetConvo");

// ----------------------------Show meet conversations------------------------------------ //

router.get('/meet-conversations',(req, res) => {
    res.render('chatPages/meetChats');
})


// ----------------------------Create new meet conversation------------------------------- //

router.post("/meet-conversations", async (req, res) => {
  
      const newConversation = new Conversation({
        roomId : `${uuidV4()}`,
        name : req.params.roomName,
        members : [req.body.creatorId]
      });
    
      try {
        const savedConversation = await newConversation.save();
        res.redirect("/meet-conversations");
      } catch (err) {
        res.status(500).json(err);
      }
});


// ----------------------------Join Conversation----------------------------------------- //

router.get('/join-meet-conversations/:conversationId' , async (req, res) => {

  const conversation = await Conversation.find({
    roomId : req.params.conversationId
  })

  if(!conversation.length){
    req.flash('error',"No such meet conversation exist! Try creating one!");
    res.redirect('/meet-conversations')
  }
  else{
    const convo = {
      roomName : conversation[0].name,
      participantCount : conversation[0].members.length
    }
    console.log(convo)
    res.render('chatPages/joinMeetConvo', {convo:convo});
  }
})

router.post('/join-meet-conversations/:conversationId' , async (req, res ,done) => {
  try {
    const conversation = await Conversation.find({
      roomId: req.params.conversationId
    });
      if(!conversation.length){
        req.flash('error',"No such meet conversation exist! Try creating one!");
        res.redirect('/meet-conversations')
      }
      else{
        
        const foundConvo = await Conversation.find({
          roomId: req.params.conversationId,
          members: { $in: [req.body.userId] },
        })

        
        if(foundConvo.length){        
          req.flash('success',"You've already joined the meet-conversations!");
          res.redirect('/meet-conversations')
        }
        else{
          
          await Conversation.update(
            { roomId: req.params.conversationId }, 
            { $addToSet: { members: req.body.userId } }
          );
          req.flash('success',"You're successfully added to the meet-conversations!");
          res.redirect('/meet-conversations')
        }

      }
    
    } catch (err) {
      console.log('Error')
      res.status(500).json(err);
    }
});


// ----------------------------Fetch user meet conversations------------------------------------ //

router.get("/meet-conversations/:userId", async (req, res) => {
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