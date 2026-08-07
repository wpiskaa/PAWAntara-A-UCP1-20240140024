const express = require('express');
const router = express.Router();
const db = require('../database/init');
const { requireAuth, redirectIfAuth } = require('../middlewares/auth');

// GET / - Beranda
router.get('/', (req, res) => {
  db.all('SELECT * FROM products ORDER BY id DESC LIMIT 4', [], (err, featuredProducts) => {
    if (err) {
      console.error(err);
      featuredProducts = [];
    }
    res.render('index', {
      title: 'Beranda - Toko Sembako Ariesta',
      page: 'home',
      featuredProducts,
      user: req.session.user || null
    });
  });
});

// GET /produk - Katalog Produk dengan Filter Search & Kategori (Server-side)
router.get('/produk', (req, res) => {
  const { search, kategori } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  if (kategori) {
    sql += ' AND category = ?';
    params.push(kategori);
  }

  sql += ' ORDER BY id ASC';

  db.all(sql, params, (err, products) => {
    if (err) {
      console.error(err);
      products = [];
    }

    // Get all categories for filter options
    db.all('SELECT DISTINCT category FROM products', [], (catErr, categoriesRows) => {
      const categories = categoriesRows ? categoriesRows.map(r => r.category) : [];
      res.render('produk', {
        title: 'Katalog Produk - Toko Sembako Ariesta',
        page: 'produk',
        products,
        categories,
        searchQuery: search || '',
        selectedCategory: kategori || '',
        user: req.session.user || null
      });
    });
  });
});

// GET /produk/:id - Detail 1 Produk Dinamis
router.get('/produk/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  if (isNaN(productId)) {
    return res.status(404).render('404', {
      title: 'Produk Tidak Ditemukan - Toko Sembako Ariesta',
      page: 'produk',
      message: 'ID produk harus berupa angka yang valid.',
      user: req.session.user || null
    });
  }

  db.get('SELECT * FROM products WHERE id = ?', [productId], (err, product) => {
    if (err || !product) {
      return res.status(404).render('404', {
        title: 'Produk Tidak Ditemukan - Toko Sembako Ariesta',
        page: 'produk',
        message: `Produk dengan ID #${productId} tidak ditemukan dalam katalog kami.`,
        user: req.session.user || null
      });
    }

    res.render('detail', {
      title: `${product.name} - Detail Produk Ariesta`,
      page: 'produk',
      product,
      user: req.session.user || null
    });
  });
});

// GET /tanya-ai - Interactive AI Chat Interface
router.get('/tanya-ai', (req, res) => {
  res.render('tanya-ai', {
    title: 'Tanya AI - Toko Sembako Ariesta',
    page: 'tanya-ai',
    user: req.session.user || null
  });
});

// GET /login - Form Login Admin/Kasir
router.get('/login', redirectIfAuth, (req, res) => {
  res.render('login', {
    title: 'Login Admin - Toko Sembako Ariesta',
    page: 'login',
    error: req.query.error || null,
    user: null
  });
});

// GET /admin/dashboard - Management Dashboard (Protected)
router.get('/admin/dashboard', requireAuth, (req, res) => {
  db.all('SELECT * FROM products ORDER BY id ASC', [], (err, products) => {
    if (err) {
      console.error(err);
      products = [];
    }

    db.all('SELECT DISTINCT category FROM products', [], (catErr, catRows) => {
      const categories = catRows ? catRows.map(c => c.category) : [];
      res.render('admin', {
        title: 'Dashboard Admin - Toko Sembako Ariesta',
        page: 'admin',
        products,
        categories,
        user: req.session.user
      });
    });
  });
});

module.exports = router;
