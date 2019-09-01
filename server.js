const express = require('express'); 
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();app.use(logger('dev'));
const users = require('./routes/users');
//
const notes = require('./routes/notes');

const mongoose = require('./config/database');
app.use(bodyParser.urlencoded({extended: false}));
app.set('jwtSecretKey', 'kunciRahasia');

mongoose.connection.on('error',
  console.error.bind(console, 'MongoDB connection error:')
);

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Allow CORS
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization, x-access-token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', (req, res) => {
 res.json({"message" : "Hello world!"});
});

app.use('/users', users);

//
app.use('/notes', notes);

app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  if(err.status === 404) {
    res.status(404).json({message: "Not found"});
  } else {
    res.status(500).json({message: "Server error"});
  }
});

app.listen(3000, () => {
  console.log('Node server listening on port 3000');
});

module.exports = app;
