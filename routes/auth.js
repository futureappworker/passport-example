const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { User } = require('../db');

const { authenticateMiddleware } = require('../middleware');

const {
  checkIsEmailUsed,
  validatePassword,
  createUserByEmail,
  findUserByEmail,
  getToken,
  handleFacebookAuth,
  handleGoogleAuth,
} = require('../tools/auth');

const router = express.Router();

router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail({ email });
    if (!user) {
      return res.status(400).json({
        message: 'There was a problem with your sign in.',
      });
    }

    const isSamePassword = bcrypt.compareSync(password, user.hashedPassword);
    if (!isSamePassword) {
      return res.status(400).json({
        message: 'There was a problem with your sign in.',
      });
    }

    const token = getToken({ id: user.id });
    res.cookie('token', token);

    await User.addNumberOfLogon({ id: user.id });

    return res.status(200).json({
      message: 'Sign in suceesfully.',
    });
  } catch (err) {
    const error = new Error();
    next(error);
  }
});

router.post('/register', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isEmailUsed = await checkIsEmailUsed({ email });
    if (isEmailUsed) {
      return res.status(400).json({
        message: 'Email already registered.',
      });
    }
  } catch (err) {
    const error = new Error();
    next(error);
  }

  const { isValidate } = validatePassword({ password });
  if (!isValidate) {
    return res.status(400).json({
      message: 'There was a problem with your sign up.',
    });
  }

  try {
    const user = await createUserByEmail({ email, password });

    const token = getToken({ id: user.id });
    res.cookie('token', token);

    await User.addNumberOfLogon({ id: user.id });

    return res.status(200).json({
      message: 'Registered.',
    });
  } catch (err) {
    const error = new Error('Sign up error.');
    error.status = 500;
    next(error);
  }
});

router.get('/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
}));

router.get('/google/callback', passport.authenticate('google', { session: false }), async (req, res) => {
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

  const token = getToken({ id: user.id });
  res.cookie('token', token);

  await User.addNumberOfLogon({ id: user.id });

  res.redirect('/dashboard');
});

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', { authType: 'reauthenticate', scope: ['email'], session: false }), async (req, res) => {
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

  const token = getToken({ id: user.id });
  res.cookie('token', token);

  await User.addNumberOfLogon({ id: user.id });

  res.redirect('/dashboard');
});

router.post('/refreshToken', authenticateMiddleware, (req, res) => {
  const token = getToken({ id: req.user.id });
  res.cookie('token', token);

  res.status(200).json({
    token,
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/sign-in');
});

module.exports = router;
