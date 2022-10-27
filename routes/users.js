const express = require('express');
const _ = require('lodash');

const { authenticateMiddleware } = require('../middleware');

const {
  updateName,
  getUserListAndPageInfo,
  sendEmailVerificationForEmail,
  confirmEmail,
  resetPassword,
} = require('../tools/users');

const router = express.Router();

router.get('/api/users', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = 'Get user list'

    #swagger.description = 'Get user list'

    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Example: Bearer xxxxxx',
      required: 'true',
      schema: {
        Authorization: 'Bearer ',
      },
    }

    #swagger.parameters['page'] = {
      in: 'query',
      description: 'page, default 1',
      schema: {
        page: 1,
      },
    }

    #swagger.parameters['perPage'] = {
      in: 'query',
      description: 'perPage, default 10',
      schema: {
        perPage: 10
      },
    }

    #swagger.responses[200] = {
      description: 'Get user list successfully.
        \n LastSession and signUpAt the number of milliseconds.',
      schema: {
        message: 'Get user list successfully.',
        users: [{
          id: 1,
          numberOfLogon: 1,
          lastSession: 1666491318365,
          signUpAt: 1666491318365,
        }],
        dataTotal: 3,
        page: 1,
        perPage: 10,
      },
    }
  */

  if (!req.user) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  let { page, perPage } = req.query;
  if (page === undefined) {
    page = 1;
  }
  if (perPage === undefined) {
    perPage = 10;
  }

  page = parseInt(page, 10);
  perPage = parseInt(perPage, 10);

  if (_.isNaN(page) || _.isNaN(perPage)) {
    return res.status(400).json({
      message: 'Bad Request.',
    });
  }

  if (page <= 0 || perPage <= -1) {
    return res.status(400).json({
      message: 'Bad Request.',
    });
  }

  const {
    users,
    dataTotal,
  } = await getUserListAndPageInfo({
    offset: perPage * (page - 1),
    limit: perPage,
  });

  res.status(200).json({
    message: 'Get user list successfully.',
    users,
    dataTotal,
    page,
    perPage,
  });
});

router.post('/api/users/:id/updateName', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = 'Update user's name'

    #swagger.description = 'Update name, only your own name can be updated'

    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Example: Bearer xxxxxx',
      required: 'true',
      schema: {
        Authorization: 'Bearer ',
      },
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Body',
      required: true,
      schema: {
        name: 'Jack',
      },
    }

    #swagger.responses[200] = {
      description: 'Update name successfully.',
      schema: {
        message: 'Update name suceesfully.',
        userId: 1,
      },
    }
  */

  const paramsId = parseInt(req.params.id, 10);
  const { name } = req.body;

  if (!req.user) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  if (paramsId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  await updateName({
    id: req.user.id,
    name,
  });

  res.status(200).json({
    message: 'Update name suceesfully.',
    userId: req.user.id,
  });
});

router.post('/api/users/:id/resetPassword', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = 'Reset password'

    #swagger.description = 'Reset password, only your own password can be reseted'

    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Example: Bearer xxxxxx',
      required: 'true',
      schema: {
        Authorization: 'Bearer ',
      },
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Body',
      required: true,
      schema: {
        oldPassword: 'qwerQWER1@',
        newPassword: 'qwerQWER1@aaa',
      },
    }

    #swagger.responses[200] = {
      description: 'Reset password successfully.',
      schema: {
        message: 'Reset password suceesfully.',
        userId: 1,
      },
    }
  */

  const paramsId = parseInt(req.params.id, 10);
  const { oldPassword, newPassword } = req.body;

  if (!req.user) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  if (paramsId !== req.user.id) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  try {
    await resetPassword({
      id: req.user.id,
      oldPassword,
      newPassword,
    });
  } catch (err) {
    const { message } = err;
    return res.status(400).json({
      message: message || 'Bad Request.',
    });
  }

  res.status(200).json({
    message: 'Reset password successfully.',
    userId: req.user.id,
  });
});

router.post('/api/users/sendEmailVerificationForEmail', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = 'Send email verification for email.'

    #swagger.description = 'Send email verification for email.'

    #swagger.parameters['Authorization'] = {
      in: 'header',
      description: 'Example: Bearer xxxxxx',
      required: 'true',
      schema: {
        Authorization: 'Bearer ',
      },
    }

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Body',
      required: true,
      schema: {
        email: 'aaa@gmail.com',
      },
    }

    #swagger.responses[200] = {
      description: 'Send email verification successfully.',
      schema: {
        message: 'Send email verification suceesfully.',
        email: 'aaa@gmail.com',
      },
    }
  */

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      message: 'Email is required.',
    });
  }

  if (!req.user) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  try {
    await sendEmailVerificationForEmail({
      userId: req.user.id,
      email,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(200).json({
    message: 'Send email verification suceesfully.',
    email,
  });
});

router.post('/api/users/confirmEmail', async (req, res) => {
  /*
    #swagger.summary = 'Confirm email.'

    #swagger.description = 'Confirm email.'

    #swagger.parameters['body'] = {
      in: 'body',
      description: 'Body',
      required: true,
      schema: {
        token: 'xxxxx',
      },
    }

    #swagger.responses[200] = {
      description: 'User has been already verified.',
      schema: {
        message: 'User has been already verified.',
      },
    }
  */

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: 'Bad Request.',
    });
  }

  try {
    await confirmEmail({
      token,
    });
  } catch (err) {
    return res.status(400).json({
      message: err.message,
    });
  }

  res.status(200).json({
    message: 'User has been already verified.',
  });
});

module.exports = router;
