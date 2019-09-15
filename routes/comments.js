const express = require('express');
const router = express.Router();
const controller = require('../controllers/comments');
const middleware = require('../middleware');

// Route untuk comments
router.get('/', controller.getAll);
router.get('/:id', controller.getById);

// Route comments yang terlindungi otentikasi, ada middleware authentication
router.post('/', middleware.authentication, controller.create);
router.put('/:id', middleware.authentication, controller.updateById);
router.delete('/:id', middleware.authentication, controller.deleteById);

module.exports = router;
