const { getDecodedToken } = require('../tools/auth');
const { getToken } = require('../tools/auth');
const { User } = require('../db');

const parseUserMiddleware = async (req, res, next) => {
  const { token: reqToken } = req.cookies;
  try {
    if (reqToken) {
      const decodedToken = getDecodedToken({ token: reqToken });
      req.user = await User.findOneById({ id: decodedToken.id });
      if (!req.user) {
        res.clearCookie('token');
        next();
        return;
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
