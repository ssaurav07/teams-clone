const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const Conversation = require("../models/meetConversation");
const {isLoggedIn} = require('../middleWares/isLoggedIn');

// -------------------------Create a meeting room ID--------------------------------------- //

router.get('/room', isLoggedIn , (req, res) => {
    res.redirect(`/room/${uuidV4()}`)
})
  
// ----------------------------Enter a meeting room --------------------------------------- //

router.get('/room/:roomId', isLoggedIn , async (req, res) => {

    const conversation = await Conversation.findOne({
        roomId : req.params.roomId
    })

    var userId =  req.user._id.toString();

    if(conversation){
      
        if(conversation.members.find((item)=>{
            if(item == req.user._id) return true;
        })){
            res.render('roomPages/room', { roomId: req.params.roomId });
        }else{

            await Conversation.update(
                { roomId: req.params.roomId },
                { $addToSet: { members: userId } }
              );               
            
            res.render('roomPages/room', { roomId: req.params.roomId });
              
        }
    }
    else{
        req.flash('error',"No such room exists!");
        res.redirect('/explore');
    }
})

module.exports = router;