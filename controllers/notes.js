const noteModel = require('../models/notes');

module.exports = {
  getById: (req, res, next) => {
    noteModel.findById(req.params.noteId, (err, noteInfo)=> {
      if (err) {
        next(err);
      } else {
        res.json({
          status: "success",
          message: "ok",
          data: {
            notes: noteInfo
          }
        });
      }
    });
  },
  getAll: (req, res, next) => {
    let notesList = [];
    noteModel.find({}, (err, notes) => {
      if (err) {
        next(err);
      } else {
        for (let note of notes) {
          notesList.push({
            id: note._id,
            name: note.name,
            released_on: note.released_on
          });
        }
        res.json({
          status: "success",
          message: "ok",
          data: {
            notes: notesList
          }
        });

      }
    });
  },
  updateById: (req, res, next) => {
    noteModel.findByIdAndUpdate(req.params.noteId, {
      name: req.body.name
    }, (err, noteInfo) => {
      if (err)
        next(err);
      else {
        res.json({
          status: "success",
          message: "ok",
          data: null
        });
      }
    });
  },
  deleteById: (req, res, next) => {
    noteModel.findByIdAndRemove(req.params.noteId, (err, noteInfo) => {
      if (err)
        next(err);
      else {
        res.json({
          status: "success",
          message: "ok",
          data: null
        });
      }
    });
  },
  create: (req, res, next) => {
    noteModel.create({
      name: req.body.name,
      content: req.body.content,
      userId: req.body.userId,
    }, (err, result) => {
      if (err)
        next(err);
      else
        res.json({
          status: "success",
          message: "ok",
          data: null
        });

    });
  },
}
