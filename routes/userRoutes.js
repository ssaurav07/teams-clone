const express = require('express');
const router = express.Router();
const User = require('../models/user');

// ------------------Get and send name of the user by her ID--------------------- //

router.post("/user/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  
  if(user) res.send({name: user.name});
  else res.send({name: "User"});
});

module.exports = router;