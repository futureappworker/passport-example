const express = require('express')
const router = express.Router()
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
  scope: [ 'email', 'profile' ],
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  res.send({
    status: true,
    data: {
      user: req.user
    }
  })
})

module.exports = router
