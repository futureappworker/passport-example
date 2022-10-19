const express = require('express');

const router = express.Router();

const { needLoggedInMiddleware } = require('../middleware');

router.get('/dashboard', needLoggedInMiddleware, (req, res) => {
  res.render('dashboard', {
    title: 'Dashboard',
    user: req.user,
  });
});

module.exports = router;
