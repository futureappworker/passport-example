const express = require('express');
const passport = require('passport');

const router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  res.send({
    status: true,
    data: {
      user: req.user,
    },
  });
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  res.send({
    status: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = router;
