const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/note_api';
const mongoDBTest = 'mongodb://localhost/note_api_test';

if (process.env.NODE_ENV === 'test') {
  mongoose.connect(mongoDBTest);
} else {
  mongoose.connect(mongoDB);
}

module.exports = mongoose;
