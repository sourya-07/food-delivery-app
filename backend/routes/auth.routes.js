const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requiredAuth } = require('../utils/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', requiredAuth, authController.me);

module.exports = router;


