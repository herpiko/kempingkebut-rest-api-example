// Panggil modul
const randomize = require('randomatic');
const bcrypt = require('bcrypt'); 
const jwt = require('jsonwebtoken');

// Panggil model dan utilitas
const model = require('../models/users');
const utils = require('../utils');

module.exports = {

  // Registrasi
  create: (req, res, next) => {
    model.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
			registrationChallenge: randomize('aA0', 32), // Siapkan string acak untuk kode konfirmasi
			registrationConfirmed: false, // false, sebagai status belum dikonfirmasi
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      // Kirim email konfirmasi
      utils.sendRegistrationChallenge(result.email, result.registrationChallenge);

      // Kembalikan ok ke client
      res.json({
        message: 'success',
        lastInsertId: result._id,
      });
    });
  },

  // Konfirmasi kode registrasi
	registrationChallenge: (req, res, next) => {

    // Cari dan perbarui berdasarkan registrationChallenge
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

  // Login
	authenticate: (req, res, next) => {

    // Cari berdasarkan email
    model.findOne({
      email: req.body.email
    }, (err, item) => {
      if (err) {
        return next(err);
      }

      // Bandingkan hash sandi
      if (bcrypt.compareSync(req.body.password, item.password)) {

        // Buat kunci jwt (token)
        const token = jwt.sign(
          { id: item._id },
          req.app.get('jwtSecretKey'),
          { expiresIn: '1h' }
        );
        delete(item.password);

        // Berikan token dan data diri ke klien
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

        // Kembalikan status code 401 unauthorized jika sandi salah
      	return res.status(401).json({
      	  message: 'unauthorized',
      	  data: invalids,
      	});
      }
    });
  }
}
