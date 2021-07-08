const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../middleWares/isLoggedIn');

router.get('/explore', isLoggedIn , (req, res) => {
    res.render('userHomePage/explore')
    })

module.exports = router;