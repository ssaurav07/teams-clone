const router            = require("express").Router();
const Message           = require("../models/message");
const Conversation      = require("../models/meetConversation");
const User              = require("../models/user");

// -------------------------Create new message--------------------------------------- //

router.post("/messages/:conversationId/:senderId/:text", async (req, res) => {
  const newMessage = new Message({
    conversationId: req.params.conversationId,
    sender: req.params.senderId,
    text: req.params.text
  });


  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

// -------------------Fetch all messages of a conversation---------------------------- //

router.get("/messages/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });

    let names = {}

    let conversation = await Conversation.findOne({
      roomId: req.params.conversationId
    })

    let members = conversation.members;

    for (member of members) {
      const user = await User.findOne({
        _id: member
      })
      names[member] = user.name;
    }

    res.status(200).json({ messages: messages, names: names });

  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;