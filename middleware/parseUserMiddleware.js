const { getDecodedToken } = require('../tools/auth');
const { getToken } = require('../tools/auth');
const { User } = require('../db');

const parseUserMiddleware = async (req, res, next) => {
  const { token: reqToken } = req.cookies;
  try {
    if (reqToken) {
      const decodedToken = getDecodedToken({ token: reqToken });
      // get new token
      const newToken = getToken({ id: decodedToken.id });
      // set cookie new token
      res.cookie('token', newToken);
      req.user = await User.findOneById({ id: decodedToken.id });
      next();
      return;
    }
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      res.clearCookie('token');
      next();
      return;
    }
    if (err.name === 'JsonWebTokenError') {
      res.clearCookie('token');
      next();
      return;
    }
  }
  next();
};

module.exports = parseUserMiddleware;
