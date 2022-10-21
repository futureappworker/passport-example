const express = require('express');

const { authenticateMiddleware } = require('../middleware');

const {
  updateName,
} = require('../tools/users');

const router = express.Router();

router.post('/:id/updateName', authenticateMiddleware, async (req, res) => {
  const paramsId = parseInt(req.params.id, 10);
  const { name } = req.body;

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
    message: 'Update success.',
  });
});

module.exports = router;
