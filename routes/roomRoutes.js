const express = require('express');
const router = express.Router();
const { v4: uuidV4 } = require('uuid');
const {isLoggedIn} = require('../middleWare');

router.get('/room', isLoggedIn , (req, res) => {
    res.redirect(`/${uuidV4()}`)
})
  
router.get('/:room', isLoggedIn , (req, res) => {
    res.render('room', { roomId: req.params.room })
})

module.exports = router;