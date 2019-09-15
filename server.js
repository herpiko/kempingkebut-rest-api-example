// Panggil modul
const express = require('express'); 
const mongoose = require('mongoose');
const logger = require('morgan');
const bodyParser = require('body-parser');
const app = express();app.use(logger('dev'));

// Panggil berkas konfigurasi dan route
const config = require('./config');
const users = require('./routes/users');
const posts = require('./routes/posts');

// Inisiasi koneksi mongodb
mongoose.connect(config.mongoDbUrl, {
  useNewUrlParser: true,
  useFindAndModify: false,
});
// Jika ada error koneksi, errornya akan dicetak
mongoose.connection.on('error',
  console.error.bind(console, 'MongoDB connection error:')
);

// Pakai body parser untuk membongkar payload ke objek yang mudah dibaca
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Setel kunci rahasia jwt
app.set('jwtSecretKey', 'kunciRahasia');

// Setel mode logging
app.use(logger('dev'));

// Allow CORS, agar aplikasi yang domainnya tidak sama dengan API dapat mengakses API ini.
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, authorization, x-access-token');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

// Yang menangani halaman utama/root/index
app.get('/', (req, res) => {
 res.json({"message" : "Hello world!"});
});

// Pasang router users
app.use('/users', users);

// Pasang routers posts
app.use('/posts', posts);

// Tangani halaman yang tidak ditemukan
app.use((req, res, next) => {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Tangani error lainnya
app.use((err, req, res, next) => {
  console.log(err);
  if(err.status === 404) {
    res.status(404).json({message: "Not found"});
  } else {
    res.status(500).json({message: "Server error"});
  }
});

// Nyalakan aplikasi, akan hidup di port 3000
app.listen(3000, () => {
  console.log('Node server listening on port 3000');
});

// Ekspor aplikasi agar dapat dikonsumsi oleh program unit testing
module.exports = app;
