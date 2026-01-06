const jwt = require("jsonwebtoken");
// Pastikan string ini SAMA PERSIS dengan yang ada di authController.js
const JWT_SECRET = 'INI_ADALAH_KUNCI_RAHASIA_ANDA_YANG_SANGAT_AMAN'; 

exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // --- LOGGING UTAMA (Cek Terminal setelah klik Check-In) ---
  console.log("------------------------------------------------");
  console.log("1. Cek Token Masuk:", token ? "Ada Token" : "Token Kosong");
  
  if (!token) {
    return res.status(401).json({ message: "Token tidak ada!" });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      console.log("2. Status Verify: GAGAL ❌");
      console.log("   Penyebab Error:", err.message); // <--- INI KUNCINYA
      console.log("------------------------------------------------");
      return res.status(403).json({ message: "Token tidak valid: " + err.message });
    }
    
    console.log("2. Status Verify: SUKSES ✅");
    console.log("   User:", userPayload.nama);
    console.log("------------------------------------------------");
    
    req.user = userPayload;
    next();
  });
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Bukan Admin!" });
  }
};