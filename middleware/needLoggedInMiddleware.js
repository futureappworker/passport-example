const { getDecodedToken } = require('../tools/auth');
const { getToken } = require('../tools/auth');
const { User } = require('../db');

const needLoggedInMiddleware = async (req, res, next) => {
  const { token: reqToken } = req.cookies;
  try {
    if (reqToken) {
      const decodedToken = getDecodedToken({ token: reqToken });
      req.user = await User.findOneById({ id: decodedToken.id });
      if (!req.user) {
        throw new Error('User not found, please sign in again.');
      }
      // get new token
      const newToken = await getToken({ id: decodedToken.id });
      // set cookie new token
      res.cookie('token', newToken);
      next();
      return;
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('token');
      res.redirect('/sign-in?alert-message=Sign in expired, please sign in again.');
      return;
    }
    // if (err.name === 'JsonWebTokenError') {
    //   res.clearCookie('token');
    //   res.redirect('/sign-in?tip-message=JsonWebTokenError');
    //   return;
    // }
    if (err.message) {
      res.clearCookie('token');
      res.redirect(`/sign-in?alert-message=${err.message}`);
      return;
    }
  }
  res.clearCookie('token');
  res.redirect('/sign-in?alert-message=Please sign in.');
};

module.exports = needLoggedInMiddleware;
