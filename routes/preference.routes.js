const express = require('express');
const router = express.Router();
const preferenceController = require('../controllers/preference.controller');

router.post('/save', preferenceController.savePreferences);

module.exports = router;
