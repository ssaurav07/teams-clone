const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetConversationSchema = new Schema(
  {
    roomId: {
      type: String
    },
    name: {
      type: String,
      default: `Teams Meeting ${Date.now()}`
    },
    members: {
      type: Array,
    },
    isPersonal: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const meetConversations = mongoose.model("meetConversations", meetConversationSchema);
module.exports = meetConversations;