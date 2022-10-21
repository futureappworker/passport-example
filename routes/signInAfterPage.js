const express = require('express');

const router = express.Router();

const { needLoggedInMiddleware } = require('../middleware');

router.get('/dashboard', needLoggedInMiddleware, (req, res) => {
  res.render('dashboard', {
    appName: process.env.APP_NAME,
    title: 'Dashboard',
    user: req.user,
  });
});

module.exports = router;
