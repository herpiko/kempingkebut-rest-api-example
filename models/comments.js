const mongoose = require('mongoose');
const paginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

const schema = new Schema({
  body: {
    type: String,
    trim: true,
    required: true,
  },
  postId: {
    type: String,
    trim: true,
    required: true
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

schema.plugin(paginate);

schema.pre('save', function(next) {
  this.modifiedAt = new Date();
  next();
});

schema.virtual('id').get(function(){
    return this._id.toHexString();
});

module.exports = mongoose.model('Comment', schema)
