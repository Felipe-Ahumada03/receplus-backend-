const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Registro real
router.post('/register', authController.register);

// Login real
router.post('/login', authController.login);

module.exports = router;
