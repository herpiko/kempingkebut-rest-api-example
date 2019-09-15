const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Skema
const schema = new Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  tags: {
    type: Array,
  },
  userId: {
    type: String,
    trim: true,
    required: true
  },
  createdAt: {
    type: Date,
    trim: true,
    required: false
  },
  modifiedAt: {
    type: Date,
    trim: true,
    required: false
  }
});

// Plugin yang membantu paginasi
schema.plugin(paginate);

// Setel waktu modifikasi
schema.pre('save', function(next) {
  this.modifiedAt = new Date();
  next();
});

schema.virtual('id').get(function(){
    return this._id.toHexString();
});

module.exports = mongoose.model('Post', schema)
