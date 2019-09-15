var jwt = require('jsonwebtoken');

// Midle ware ini mengautentikasi request yang masuk. Route yang dipasangi middleware ini harus melewati login terlebih dahulu
const authentication = (req, res, next) => {

  // Verifikasi token
  jwt.verify(req.headers['x-access-token'], req.app.get('jwtSecretKey'), (err, decoded) => {
    if (err) {
      // Kembalikan 401 jika tidak terverifikasi
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
