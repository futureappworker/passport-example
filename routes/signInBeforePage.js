const express = require('express');

const router = express.Router();

const { needNotLoggedInMiddleware } = require('../middleware');

router.get('/sign-in', needNotLoggedInMiddleware, (req, res) => {
  res.render('signIn', {
    appName: process.env.APP_NAME,
    title: 'Sign In',
  });
});

router.get('/sign-up', needNotLoggedInMiddleware, (req, res) => {
  res.render('signUp', {
    appName: process.env.APP_NAME,
    title: 'Sign Up',
  });
});

module.exports = router;
