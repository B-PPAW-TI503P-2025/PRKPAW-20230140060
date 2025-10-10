const express = require('express');
const app = express();
const port = 5000; // Port 5000 digunakan sesuai panduan praktikum

// Buat satu endpoint GET di root ('/')
app.get('/', (req, res) => {
  // Mengembalikan pesan 'Hello from Server!' dalam format JSON
  res.json({ message: 'Hello from Server!' }); 
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});