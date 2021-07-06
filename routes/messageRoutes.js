const router = require("express").Router();
const Message = require("../models/message");

// -------------------------Create new message--------------------------------------- //

router.post("/messages/:conversationId/:senderId/:text", async (req, res) => {
  const newMessage = new Message({
    conversationId: req.params.conversationId,
    sender : req.params.senderId,
    text : req.params.text
  });

  console.log(newMessage);

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
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;