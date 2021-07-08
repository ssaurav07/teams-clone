const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    sentAt: {
      type: Date,
      default : Date.now()
    }
  },
  
);

const messages = mongoose.model("message", MessageSchema);
module.exports = messages;