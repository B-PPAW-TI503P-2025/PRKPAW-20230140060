const { User } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); 

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_negara'; 


exports.register = async (req, res) => {
  try {
    const { nama, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email sudah terdaftar." });
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
      role: role || 'mahasiswa' 
    });

    res.status(201).json({
      message: "Registrasi berhasil",
      data: {
        id: newUser.id,
        nama: newUser.nama,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal registrasi", error: error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

   
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    // 2. Cek Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

   
    const token = jwt.sign(
      { 
        id: user.id,     
        email: user.email, 
        role: user.role   
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' } 
    );

    res.status(200).json({
      message: "Login berhasil",
      token: token, 
      user: {
        id: user.id,
        nama: user.nama,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Gagal login", error: error.message });
  }
};