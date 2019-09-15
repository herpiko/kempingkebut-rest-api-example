var jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
  jwt.verify(req.headers['x-access-token'], req.app.get('jwtSecretKey'), (err, decoded) => {
    if (err) {
      res.status(401)
      .json({
        status: "error",
        message: 'Unauthorized',
        data: null,
      });
    } else {
      req.user = { id: decoded.id }
      next();
    }
  });
}

module.exports = {
  authentication: authentication,
}
