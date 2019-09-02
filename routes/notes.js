const express = require('express');
const router = express.Router();
const noteController = require('../controllers/notes');
var jwt = require('jsonwebtoken');

router.get('/', noteController.getAll);
router.post('/', validateUser, noteController.create);
router.get('/:noteId', noteController.getById);
router.put('/:noteId', validateUser, noteController.updateById);
router.delete('/:noteId', validateUser, noteController.deleteById);

//
function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('jwtSecretKey'), (err, decoded) => {
        if (err) {
            res.status(401).json({ status: "error", message: 'Unauthorized', data: null });
        } else {
            req.body.userId = decoded.id;
            next();
        }
    });
}

module.exports = router;
