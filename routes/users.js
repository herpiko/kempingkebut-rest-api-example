const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');

// ROute untuk users

// Registrasi
router.post('/register', controller.create);
// Konfirmasi kode
router.get('/challenge', controller.registrationChallenge);
// Login
router.post('/authenticate', controller.authenticate);

module.exports = router;
