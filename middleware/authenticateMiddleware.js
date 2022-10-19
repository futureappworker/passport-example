const { getDecodedToken } = require('../tools/auth');
const { User } = require('../db');

const authenticateMiddleware = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      const decodedToken = getDecodedToken({ token });
      const user = await User.findOneById({ id: decodedToken.id });
      req.user = user;
    }
  } catch (err) {
    // if (err.name === 'TokenExpiredError') {
    //   return res.status(401).json({
    //     message: 'Sign in expired, please sign in again.',
    //   });
    // }
    // if (err.name === 'JsonWebTokenError') {
    //   return res.status(401).json({
    //     message: err.message,
    //   });
    // }
    res.clearCookie('token');
    return res.status(401).json({
      message: err.message,
    });
  }
  next();
};

module.exports = authenticateMiddleware;
