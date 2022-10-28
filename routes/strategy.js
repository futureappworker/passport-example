const express = require('express');
const passport = require('passport');

const { User } = require('../db');

const {
  getToken,
  handleFacebookAuth,
  handleGoogleAuth,
} = require('../tools/auth');

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
}));

router.get(process.env.GOOGLE_CALLBACK_PATHNAME, passport.authenticate('google', { session: false }), async (req, res) => {
  const providerId = req.user.id;
  const name = req.user.displayName;
  const email = req.user.emails[0].value;
  let user;

  try {
    user = await handleGoogleAuth({
      providerId,
      name,
      email,
    });
  } catch (err) {
    res.redirect(`/sign-in?alert-message=${err.message}`);
    return;
  }

  const token = await getToken({ id: user.id });
  res.cookie('token', token);

  await User.addNumberOfLogon({ id: user.id });

  res.redirect('/dashboard');
});

router.get('/auth/facebook', passport.authenticate('facebook'));

router.get(process.env.FACEBOOK_CALLBACK_PATHNAME, passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['email'], session: false }), async (req, res) => {
  const providerId = req.user.id;
  const name = req.user.displayName;
  const email = req.user.email || '';
  let user;

  try {
    user = await handleFacebookAuth({
      providerId,
      name,
      email,
    });
  } catch (err) {
    res.redirect('/sign-in');
    return;
  }

  const token = await getToken({ id: user.id });
  res.cookie('token', token);

  await User.addNumberOfLogon({ id: user.id });

  res.redirect('/dashboard');
});

module.exports = router;
