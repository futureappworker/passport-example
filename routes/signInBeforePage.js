const express = require('express');

const router = express.Router();

const { needNotLoggedInMiddleware } = require('../middleware');

router.get('/sign-in', needNotLoggedInMiddleware, (req, res) => {
  res.render('signIn', {
    title: 'Sign In',
  });
});

router.get('/sign-up', needNotLoggedInMiddleware, (req, res) => {
  res.render('signUp', {
    title: 'Sign Up',
  });
});

module.exports = router;
