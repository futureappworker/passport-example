const express = require('express');

const { User } = require('../db');

const router = express.Router();

const { parseUserMiddleware } = require('../middleware');

router.get('/', parseUserMiddleware, (req, res) => {
  res.render('home', {
    appName: process.env.APP_NAME,
    title: 'Home',
    user: req.user,
  });
});

router.get('/profile/:id', parseUserMiddleware, async (req, res) => {
  const paramsId = parseInt(req.params.id, 10);
  const loginUser = req.user;
  const loginUserId = req.user && req.user.id;
  if (loginUserId === paramsId) {
    res.render('profile', {
      appName: process.env.APP_NAME,
      title: 'Profile',
      user: loginUser,
      profileUser: loginUser,
      isSelf: true,
    });
    return;
  }
  const profileUser = await User.findOneById({ id: paramsId });
  res.render('profile', {
    appName: process.env.APP_NAME,
    title: 'Profile',
    user: loginUser,
    profileUser,
    isSelf: false,
  });
});

module.exports = router;
