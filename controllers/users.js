const model = require('../models/users');
const randomize = require('randomatic');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');
const utils = require('../utils');

module.exports = {
  create: (req, res, next) => {
    model.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
			registrationChallenge: randomize('aA0', 32),
			registrationConfirmed: false,
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      utils.sendRegistrationChallenge(result.email, result.registrationChallenge);
      res.json({
        message: 'success',
        lastInsertId: result._id,
      });
    });
  },
	
	registrationChallenge: (req, res, next) => {
		model.findOneAndUpdate({
			registrationChallenge: req.query.code
		}, {
			registrationConfirmed: true,
		}, (err) => {
      if (err) {
        return next(err);
      }
      res.json({
        message: 'success',
        data: null
      });
		})
	},

	authenticate: (req, res, next) => {
    model.findOne({
      email: req.body.email
    }, (err, item) => {
      if (err) {
        return next(err);
      }
      if (bcrypt.compareSync(req.body.password, item.password)) {
        const token = jwt.sign(
          { id: item._id },
          req.app.get('jwtSecretKey'),
          { expiresIn: '1h' }
        );
        delete(item.password);
        res.json({
          message: 'success',
          data:{
            user: {
							id: item.id,
              name: item.name,
              email: item.email
            },
            token:token
          }
        });
      } else {
        res.json({
          message: 'error',
          data:null
        });
      }
    });
  }
}
