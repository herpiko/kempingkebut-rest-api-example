const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

router.post('/register', controller.create);
router.get('/challenge', controller.registrationChallenge);
router.post('/authenticate', controller.authenticate);

module.exports = router;
