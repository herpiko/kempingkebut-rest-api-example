const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notes');

router.get('/', noteController.getAll);
router.post('/', noteController.create);
router.get('/:noteId', noteController.getById);
router.put('/:noteId', noteController.updateById);
router.delete('/:noteId', noteController.deleteById);

module.exports = router;
