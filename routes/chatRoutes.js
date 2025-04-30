const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, getAllChats } = require('../controllers/chatController');
const { auth } = require('../middlewares/auth');

router.get('/', auth(), getAllChats);

router.post('/send', auth(), sendMessage);

router.get('/:userId', auth(), getMessages);

module.exports = router;
