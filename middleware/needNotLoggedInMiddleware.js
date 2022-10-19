const { getDecodedToken } = require('../tools/auth');

const needNotLoggedInMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      getDecodedToken({ token });
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
