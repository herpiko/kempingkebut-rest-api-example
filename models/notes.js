const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NoteSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  userId: {
    type: String,
    trim: true,
    required: true
  },
  lastModified: {
    type: Date,
    trim: true,
    required: false
  }
});

NoteSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

module.exports = mongoose.model('Note', NoteSchema)
