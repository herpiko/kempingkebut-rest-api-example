const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const Schema = mongoose.Schema;

// Skema
const schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  password: {
    type: String,
    trim: true,
    required: true
  },
  registrationChallenge: {
    type: String,
    trim: true,
    required: true
  },
  registrationConfirmed: {
    type: Boolean,
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

// Setel waktu modifikasi dan hash sandi
schema.pre('save', function(next) {
  this.modifiedAt = new Date();
  this.password = bcrypt.hashSync(this.password, saltRounds);
  next();
});

schema.virtual('id').get(function(){
    return this._id.toHexString();
});

module.exports = mongoose.model('User', schema);
