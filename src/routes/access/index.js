const express = require('express');
const router = express.Router();

// signup
router.post('/signup', (req, res, next) => {
  return res.status(200).json({
    message: 'Hello World',
  });
});

module.exports = router;
