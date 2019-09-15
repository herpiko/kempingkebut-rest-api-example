const express = require('express');
const router = express.Router();
const controller = require('../controllers/comments');
const middleware = require('../middleware');

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', middleware.authentication, controller.create);
router.put('/:id', middleware.authentication, controller.updateById);
router.delete('/:id', middleware.authentication, controller.deleteById);

module.exports = router;
