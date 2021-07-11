const express = require('express');
const router = express.Router();

// ------------------------ Shows error page --------------------------------- //

router.get('*', (req, res) => {
    res.render("errorPage/error")
})

module.exports = router;