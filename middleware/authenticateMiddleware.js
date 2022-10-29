const { getDecodedToken } = require('../tools/auth');
const { User } = require('../db');

const getHeaderToken = ({ authHeader = '' } = {}) => {
  if (!authHeader) {
    return '';
  }
  const [prefixString, token] = authHeader.split(' ');
  if (prefixString !== 'Bearer') {
    return '';
  }
  return token;
};

const authenticateMiddleware = async (req, res, next) => {
  const headerToken = getHeaderToken({
    authHeader: req.headers.Authorization || req.headers.authorization,
  });

  try {
    const resultToken = req.cookies.token || headerToken;
    if (!resultToken) {
      throw new Error('Need cookie token or header Authorization token.');
    }
    if (resultToken) {
      const decodedToken = getDecodedToken({ token: resultToken });
      const user = await User.findOneById({ id: decodedToken.id });
      if (!user) {
        throw new Error('User not found, please sign in again.');
      }
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
