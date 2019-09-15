const model = require('../models/posts');
const utils = require('../utils');

module.exports = {
  create: (req, res, next) => {
    req.body.userId = req.user.id
    if (!utils.validate(model, req, res)) return;

    model.create({
      title: req.body.title,
      content: req.body.content,
      userId: req.body.userId
    }, (err, result) => {
      if (err) {
        return next(err);
      }
      res.json({
        message: 'success',
        lastInsertId: result._id,
        data: null
      });
    });
  },

  getById: (req, res, next) => {
    if (!req.params.id) {
      return res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
    }
    model.findById(req.params.id, (err, item) => {
      if (err) {
        next(err);
      }
      if (!item) {
        return res.status(404).json({
          message: 'not-found',
        });
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
    });
  },

  getAll: (req, res, next) => {
    let opts = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
    }
    model.paginate({}, opts, (err, result) => {
      if (err) {
        return next(err);
      }
      let resp = {
        ...opts
      }
      resp.data = [];
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
      res.json(resp);
    });
  },

  updateById: (req, res, next) => {
    if (!req.params.id) {
      return res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
    }

    req.body.userId = req.user.id
    if (!utils.validate(model, req, res)) return;

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
      if (!item) {
        return res.status(403).json({
          message: 'forbidden',
        });
      }
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

  deleteById: (req, res, next) => {
    if (!req.params.id) {
      return res.status(400).json({
        message: 'validation-error',
        data: invalids,
      });
    }
    model.findOneAndRemove({
      _id: req.params.id,
      userId: req.user.id,
    }, (err, item) => {
      if (err) {
        return next(err);
      }
      if (!item) {
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
