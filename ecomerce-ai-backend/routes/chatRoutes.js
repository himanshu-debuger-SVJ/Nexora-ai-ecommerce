const express = require('express');
const router = express.Router();
const { chatWithBot } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

router.post('/', protect, chatWithBot);

module.exports = router;