// Muat model
const model = require('../models/posts');
// Muat utilitas
const utils = require('../utils');

module.exports = {

  // Buat post baru
  create: (req, res, next) => {
    // Pasangkan id dari user (req.user.id berasal dari middleware) ke body
    req.body.userId = req.user.id

    // Jalankan fungsi validasi (lihat utils.js)
    if (!utils.validate(model, req, res)) return;

    // Buat post baru dengan model mongoose
    model.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      // Kembalikan lastInsertId, yaitu id dari data yang baru saja dibuat
      res.json({
        message: 'success',
        lastInsertId: result._id,
        data: null
      });
    });
  },

  // Ambil post berdasarkan id
  getById: (req, res, next) => {

    // Jika parameter id tidak tercantum di URL yang dipanggil, 
    // kembalikan status code 400 (bad request error)
    if (!req.params.id) {
      return res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
    }

    // cari post berdasarkan id
    model.findById(req.params.id, (err, item) => {
      if (err) {
        next(err);
      }

      // Jika tidak ditemukan, kembalikan status code 404 not found
      if (!item) {
        return res.status(404).json({
          message: 'not-found',
        });
      }

      // Jika ditemukan, berikan datanya
      res.json({
        message: 'success',
        data: {
          id: item.id,
          title: item.title,
          content: item.content,
          userId: item.userId,

          createdAt: item.createdAt,
          modifiedAt: item.modifiedAt,
        },
      });
    });
  },

  // Ambil semua post, difilter berdasarkan paginasi
  getAll: (req, res, next) => {

    // Setel nilai bawaan untuk paginasi
    let opts = {
      page: parseInt(req.query.page, 10) || 1, // halaman ke...
      limit: parseInt(req.query.limit, 10) || 10, // jumlah item per halaman
    }

    // Ambil post berdasarkan paginasi
    model.paginate({}, opts, (err, result) => {
      if (err) {
        return next(err);
      }

      // Salin variabel opts ke resp
      let resp = {
        ...opts
      }

      // buat penampung data
      resp.data = [];

      // Iterasi hasil query database, masukkan ke resp.data
      for (let item of result.docs) {
        resp.data.push({
          id: item.id,
          title: item.title,
          content: item.content,
          userId: item.userId,

          createdAt: item.createdAt,
          modifiedAt: item.modifiedAt,
        });
      }
      resp.message = 'success';

      // Kembalikan data ke klien
      res.json(resp);
    });
  },


  // Perbarui post
  updateById: (req, res, next) => {
    
    // Jika parameter id tidak tercantum di URL yang dipanggil, 
    // kembalikan status code 400 (bad request error)
    if (!req.params.id) {
      return res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
    }

    // Pasangkan id dari user (req.user.id berasal dari middleware) ke body
    req.body.userId = req.user.id

    // Jalankan fungsi validasi (lihat utils.js)
    if (!utils.validate(model, req, res)) return;

    // Perbarui post dengan data dari payload (body)
    model.findOneAndUpdate({
      _id: req.params.id,
      userId: req.user.id,
    }, {
      title: req.body.title,
      content: req.body.content,
    }, (err, item) => {
      if (err) {
        return next(err);
      }

      // Jika data tidak ditemukan, kembalikan status code 403 forbidden
      if (!item) {
        return res.status(403).json({
          message: 'forbidden',
        });
      }

      // Jika data ada dan terupdate, kembalikan hasil updatenya ke client
      model.findById(req.params.id, (err, item) => {
        if (err) {
          return next(err);
        }
        res.json({
          message: 'success',
          data: {
            id: item.id,
            title: item.title,
            content: item.content,
            userId: item.userId,

            createdAt: item.createdAt,
            modifiedAt: item.modifiedAt,
          },
        });
      })
    });
  },

  // Hapus post
  deleteById: (req, res, next) => {

    // Jika parameter id tidak tercantum di URL yang dipanggil, 
    // kembalikan status code 400 (bad request error)
    if (!req.params.id) {
      return res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
    }

    // Hapus post
    model.findOneAndRemove({
      _id: req.params.id,
      userId: req.user.id,
    }, (err, item) => {
      if (err) {
        return next(err);
      }
      if (!item) {
        // Jika data tidak ditemukan, kembalikan status code 403
        return res.status(403).json({
          message: 'forbidden',
        });
      }
      res.json({
        message: 'success',
        data: null
      });
    });
  },
}
