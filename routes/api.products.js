const express = require('express');
const router = express.Router();
const db = require('../database/init');
const { requireAuth } = require('../middlewares/auth');

// GET /api/products - Read-only public
router.get('/products', (req, res) => {
  const { category, search } = req.query;
  let sql = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (category) {
    sql += ' AND category = ?';
    params.push(category);
  }

  if (search) {
    sql += ' AND (name LIKE ? OR description LIKE ?)';
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ' ORDER BY id ASC';

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data produk'
      });
    }
    return res.json({
      status: 'success',
      data: rows
    });
  });
});

// GET /api/products/:id - Read-only public single product
router.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID produk tidak valid'
    });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal mengambil data produk'
      });
    }

    if (!row) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    return res.json({
      status: 'success',
      data: row
    });
  });
});

// POST /api/products - Protected (Login required)
router.post('/products', requireAuth, (req, res) => {
  const { name, category, price, stock, unit, description, image } = req.body;

  if (!name || !category || price === undefined || stock === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'Nama, kategori, harga, dan stok wajib diisi'
    });
  }

  const numPrice = parseInt(price, 10);
  const numStock = parseInt(stock, 10);
  const prodUnit = unit || 'Pcs';
  const prodDesc = description || '';
  const prodImage = image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80';

  const sql = `
    INSERT INTO products (name, category, price, stock, unit, description, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [name, category, numPrice, numStock, prodUnit, prodDesc, prodImage], function (err) {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menambahkan produk baru'
      });
    }

    db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (getErr, newProduct) => {
      return res.status(201).json({
        status: 'success',
        message: 'Produk ditambahkan',
        data: newProduct
      });
    });
  });
});

// PUT /api/products/:id - Protected (Login required)
router.put('/products/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID produk tidak valid'
    });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, existing) => {
    if (err || !existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    const name = req.body.name || existing.name;
    const category = req.body.category || existing.category;
    const price = req.body.price !== undefined ? parseInt(req.body.price, 10) : existing.price;
    const stock = req.body.stock !== undefined ? parseInt(req.body.stock, 10) : existing.stock;
    const unit = req.body.unit || existing.unit;
    const description = req.body.description !== undefined ? req.body.description : existing.description;
    const image = req.body.image || existing.image;

    const sql = `
      UPDATE products
      SET name = ?, category = ?, price = ?, stock = ?, unit = ?, description = ?, image = ?
      WHERE id = ?
    `;

    db.run(sql, [name, category, price, stock, unit, description, image, id], (updateErr) => {
      if (updateErr) {
        return res.status(500).json({
          status: 'error',
          message: 'Gagal memperbarui produk'
        });
      }

      db.get('SELECT * FROM products WHERE id = ?', [id], (fetchErr, updatedProduct) => {
        return res.json({
          status: 'success',
          message: 'Produk diperbarui',
          data: updatedProduct
        });
      });
    });
  });
});

// DELETE /api/products/:id - Protected (Login required)
router.delete('/products/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID produk tidak valid'
    });
  }

  db.get('SELECT * FROM products WHERE id = ?', [id], (err, existing) => {
    if (err || !existing) {
      return res.status(404).json({
        status: 'error',
        message: 'Produk tidak ditemukan'
      });
    }

    db.run('DELETE FROM products WHERE id = ?', [id], (deleteErr) => {
      if (deleteErr) {
        return res.status(500).json({
          status: 'error',
          message: 'Gagal menghapus produk'
        });
      }

      return res.json({
        status: 'success',
        message: 'Produk dihapus'
      });
    });
  });
});

module.exports = router;
