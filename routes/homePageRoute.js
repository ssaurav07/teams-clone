const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if(req.isAuthenticated()){
      res.redirect('/explore');
      return;
    }
    res.render('homePage/home')
  })

  module.exports = router;