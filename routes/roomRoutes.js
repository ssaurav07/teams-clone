const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const {isLoggedIn} = require('../middleWares/isLoggedIn');

// -------------------------Create a meeting room ID--------------------------------------- //

router.get('/room', isLoggedIn , (req, res) => {
    res.redirect(`/room/${uuidV4()}`)
})
  
// ----------------------------Enter a meeting room --------------------------------------- //

router.get('/room/:roomId', isLoggedIn , (req, res) => {
    console.log(req.params.roomId)
    res.render('roomPages/room', { roomId: req.params.roomId })
})

module.exports = router;