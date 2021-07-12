const express   = require('express');
const router    = express.Router();
const User      = require('../models/user');

// ------------------Get and send name of the user by her ID--------------------- //

router.post("/user/:userId", async (req, res) => {
  const user = await User.findById(req.params.userId);
  
  if(user) res.send({name: user.name});
  else res.send({name: "User"});
});

router.get("/user/:username", async (req, res) => {
  const user = await User.findOne({
    username: req.params.username
  })
    
  if(user) res.send({id: user._id , name: user.name});
  else res.send({id: "00"});
});

module.exports = router;