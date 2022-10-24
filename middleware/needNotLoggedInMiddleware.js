const { getDecodedToken } = require('../tools/auth');
const { User } = require('../db');

const needNotLoggedInMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      const decodedToken = getDecodedToken({ token });
      req.user = await User.findOneById({ id: decodedToken.id });
      if (!req.user) {
        throw new Error('User not found, please sign in again.');
      }
      res.redirect('/dashboard');
      return;
    }
  } catch (err) {
    // if (err.name === 'TokenExpiredError') {
    //   res.clearCookie('token');
    //   next();
    //   return;
    // }
    // if (err.name === 'JsonWebTokenError') {
    //   res.clearCookie('token');
    //   next();
    //   return;
    // }
    res.clearCookie('token');
  }
  next();
};

module.exports = needNotLoggedInMiddleware;
