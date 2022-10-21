const express = require('express');

const { authenticateMiddleware } = require('../middleware');

const {
  updateName,
} = require('../tools/users');

const router = express.Router();

router.post('/api/users/:id/updateName', authenticateMiddleware, async (req, res) => {
  /*
    #swagger.summary = "Update user's name"

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

module.exports = router;
