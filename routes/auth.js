const express = require('express');
const bcrypt = require('bcrypt');

const { User } = require('../db');

const { authenticateMiddleware } = require('../middleware');

const {
  checkIsEmailUsed,
  validatePassword,
  createUserByEmail,
  findUserByEmail,
  getToken,
} = require('../tools/auth');

const router = express.Router();

router.post('/api/auth/login', async (req, res, next) => {
  /*
    #swagger.summary = 'Login'

    #swagger.description = 'Login'

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Body',
      required: true,
      schema: {
        email: 'aaa@gmail.com',
        password: 'qwerQWER1@',
      },
    }

    #swagger.responses[200] = {
      description: 'Login successfully',
      schema: {
        message: 'Sign in suceesfully.',
        userId: 1,
        token: 'xxxxxx',
      },
    }
  */

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

    const token = await getToken({ id: user.id });
    res.cookie('token', token);

    await User.addNumberOfLogon({ id: user.id });

    return res.status(200).json({
      message: 'Sign in suceesfully.',
      userId: user.id,
      token,
    });
  } catch (err) {
    const error = new Error();
    next(error);
  }
});

router.post('/api/auth/register', async (req, res, next) => {
  /*
    #swagger.summary = 'Register'

    #swagger.description = 'Register'

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Body',
      required: true,
      schema: {
        email: 'ccc@gmail.com',
        password: 'qwerQWER1@',
      },
    }

    #swagger.responses[200] = {
      description: 'Register successfully',
      schema: {
        message: 'Register suceesfully.',
        userId: 1,
        token: 'xxxxxx',
      },
    },
  */

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

    const token = await getToken({ id: user.id });
    res.cookie('token', token);

    await User.addNumberOfLogon({ id: user.id });

    return res.status(200).json({
      message: 'Register successfully',
      userId: user.id,
      token,
    });
  } catch (err) {
    const error = new Error('Sign up error.');
    error.status = 500;
    next(error);
  }
});

router.post('/api/auth/refreshToken', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = 'Refresh token'

    #swagger.description = 'Refresh token'

    #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'Example: Bearer xxxxxx',
      required: 'true',
      schema: {
        Authorization: 'Bearer ',
      },
    }

    #swagger.responses[200] = {
      description: 'Refresh token successfully',
      schema: {
        message: 'Refresh token suceesfully.',
        userId: 1,
        token: 'xxxxxx',
      },
    }
  */

  const token = await getToken({ id: req.user.id });
  res.cookie('token', token);

  res.status(200).json({
    message: 'Refresh token suceesfully.',
    userId: req.user.id,
    token,
  });
});

router.post('/api/auth/logout', (req, res) => {
  /*
    #swagger.summary = 'Logout'

    #swagger.description = 'Logout, clear cookie token, and redirect /sign-in'
  */
  res.clearCookie('token');
  res.redirect('/sign-in');
});

module.exports = router;
