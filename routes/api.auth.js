const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../database/init');

// POST /api/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Username dan password wajib diisi'
    });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Terjadi kesalahan pada server'
      });
    }

    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Username atau password tidak ditemukan'
      });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        status: 'error',
        message: 'Username atau password salah'
      });
    }

    // Set session
    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role
    };

    return res.json({
      status: 'success',
      message: 'Login berhasil',
      data: {
        username: user.username,
        role: user.role
      }
    });
  });
});

// POST /api/logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal melakukan logout'
      });
    }
    res.clearCookie('connect.sid');
    return res.json({
      status: 'success',
      message: 'Logout berhasil'
    });
  });
});

module.exports = router;
