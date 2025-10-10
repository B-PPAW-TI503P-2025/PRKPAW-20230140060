import React, { useState } from 'react';

function App() {
  // 1. Definisikan state untuk menyimpan input nama
  const [name, setName] = useState(''); 

  const handleNameChange = (event) => {
    // 2. Perbarui state setiap kali input berubah
    setName(event.target.value); 
  };

  return (
    <div>
      {/* Menampilkan pesan sesuai tugas */}
      <h1>Hello, {name || '[nama]'}!</h1> 

      <p>Masukkan nama Anda:</p>
      <input
        type="text"
        value={name}
        onChange={handleNameChange} // Hubungkan fungsi dengan input
        placeholder="Ketik nama di sini"
      />
    </div>
  );
}

export default App;