const express = require('express');
const _ = require('lodash');

const { authenticateMiddleware } = require('../middleware');

const {
  getUserStatistics,
} = require('../tools/site');

const router = express.Router();

router.get('/api/site/getUserStatistics', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = 'Get user statistics'

    #swagger.description = 'Get user statistics. if user login use email, need verified user email.'

    #swagger.parameters['authorization'] = {
      in: 'header',
      description: 'Example: Bearer xxxxxx',
      required: 'true',
      schema: {
        Authorization: 'Bearer ',
      },
    }

    #swagger.parameters['todayStart'] = {
      in: 'query',
      description: 'Number of milliseconds, today startOf timestamp',
      schema: {
        todayStart: 1666368000000,
      },
    }

    #swagger.responses[200] = {
      description: 'Get user statistics successfully.',
      schema: {
        message: 'Get user statistics successfully.',
        userStatistics: {
          userTotal: 3,
          todayActiveUserTotal: 1,
          lastSevenDayActiveUserAverage: 0,
        },
      },
    }
  */

  if (!req.user) {
    return res.status(403).json({
      message: 'Forbidden.',
    });
  }

  if (req.user.provider.providerType === 'email' && !req.user.profile.isEmailVerified) {
    return res.status(403).json({
      message: 'You have not verified your email.',
    });
  }

  let todayStart;
  if (!_.isNaN(parseInt(req.query.todayStart, 10))) {
    todayStart = parseInt(req.query.todayStart, 10);
  }

  const userStatistics = await getUserStatistics({ todayStart });

  res.status(200).json({
    message: 'Get user statistics successfully.',
    userStatistics,
  });
});

module.exports = router;
