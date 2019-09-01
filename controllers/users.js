const userModel = require('../models/users');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

module.exports = {
  create: (req, res, next) => {
    userModel.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "ok",
          data: null
        });
      }
    });
  }, authenticate: (req, res, next) => {
    userModel.findOne({
      email: req.body.email
    }, (err, userInfo) => {
      if (err) {
        console.log('--------------1');
        next(err);
      } else {
        console.log('--------------2');
        if (bcrypt.compareSync(req.body.password, userInfo.password)) {
          const token = jwt.sign(
            { id: userInfo._id },
            req.app.get('jwtSecretKey'),
            { expiresIn: '1h' }
          );
          delete(userInfo.password);
          res.json({
            status:"success",
            message: "ok",
            data:{
              user: {
                name: userInfo.name,
                email: userInfo.email
              },
              token:token
            }
          });
        } else {
          res.json({
            status:"error",
            message: "not-ok",
            data:null
          });
        }
      }
    });
  }
}
