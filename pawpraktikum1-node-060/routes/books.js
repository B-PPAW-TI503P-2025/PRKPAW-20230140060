// routes/books.js
const express = require('express');
const router = express.Router();

// Gunakan array sebagai penyimpanan data sementara (sesuai tugas) [cite: 248]
let books = [
    {id: 1, title: 'Book 1', author: 'Author 1'},
    {id: 2, title: 'Book 2', author: 'Author 2'}
];

// --- FUNGSI VALIDASI ---
const validateBook = (title, author) => {
    // Implementasi validasi input (Tugas 2.1) [cite: 249]
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
        return 'Title must be a string of at least 3 characters.';
    }
    if (!author || typeof author !== 'string' || author.trim().length < 3) {
        return 'Author must be a string of at least 3 characters.';
    }
    return null; // Validasi sukses
};

// --- ROUTE HANDLERS (CRUD) ---

// 1. READ ALL (GET /api/books)
router.get('/', (req, res) => {
    res.json(books); // Mengembalikan semua buku [cite: 211]
});

// 2. READ BY ID (GET /api/books/:id)
router.get('/:id', (req, res) => {
    // Cari buku berdasarkan ID (req.params.id) [cite: 214]
    const book = books.find(b => b.id === parseInt(req.params.id));
    if (!book) return res.status(404).json({ message: 'Book not found' }); // Error handling
    res.json(book);
});

// 3. CREATE (POST /api/books)
router.post('/', (req, res) => {
    const { title, author } = req.body;
    
    // Validasi input [cite: 249]
    const validationError = validateBook(title, author);
    if (validationError) {
        return res.status(400).json({ message: validationError }); // 400 Bad Request
    }

    const book = {
        id: books.length + 1,
        title,
        author
    };
    books.push(book);
    res.status(201).json(book); // 201 Created [cite: 229]
});

// 4. UPDATE (PUT /api/books/:id)
router.put('/:id', (req, res) => {
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));
    if (bookIndex === -1) return res.status(404).json({ message: 'Book not found' });

    const { title, author } = req.body;
    
    // Validasi input [cite: 249]
    const validationError = validateBook(title, author);
    if (validationError) {
        return res.status(400).json({ message: validationError }); 
    }

    // Lakukan pembaruan
    books[bookIndex].title = title;
    books[bookIndex].author = author;
    
    res.json(books[bookIndex]);
});

// 5. DELETE (DELETE /api/books/:id)
router.delete('/:id', (req, res) => {
    const initialLength = books.length;
    // Filter array untuk menghapus buku dengan ID yang cocok
    books = books.filter(b => b.id !== parseInt(req.params.id));

    // Cek apakah ada buku yang terhapus
    if (books.length === initialLength) {
        return res.status(404).json({ message: 'Book not found' });
    }
    
    res.status(204).send(); // 204 No Content (Sukses hapus)
});

module.exports = router;