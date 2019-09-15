const config = {
  // Konfigursi URL basis data Mongo
  mongoDbUrl: 'mongodb://localhost/note_api',

  // Kunci API layanan Sendgrid
  // Layanan ini digunakan untuk mengirim pesan surel yang berisi
  // kode konfirmasi pendaftaran
  sendgridAPIKey: 'SEND_GRID_API_KEY',
}

module.exports = config;
