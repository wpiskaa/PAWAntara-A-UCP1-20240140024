const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const initialProducts = require('../data/products');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'sembako.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Table users
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'admin'
    )
  `);

  // Table products
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      price INTEGER NOT NULL,
      stock INTEGER NOT NULL,
      unit TEXT NOT NULL,
      description TEXT,
      image TEXT
    )
  `);

  // Seed Admin user if empty
  db.get("SELECT COUNT(*) AS count FROM users", (err, row) => {
    if (!err && row.count === 0) {
      const salt = bcrypt.genSaltSync(10);
      const hashedPassword = bcrypt.hashSync('admin123', salt);
      const stmt = db.prepare("INSERT INTO users (username, password, role) VALUES (?, ?, ?)");
      stmt.run('admin', hashedPassword, 'admin');
      stmt.finalize();
      console.log('✅ Admin user created: admin / admin123');
    }
  });

  // Seed Products if empty
  db.get("SELECT COUNT(*) AS count FROM products", (err, row) => {
    if (!err && row.count === 0) {
      const stmt = db.prepare(`
        INSERT INTO products (id, name, category, price, stock, unit, description, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      initialProducts.forEach(p => {
        stmt.run(p.id, p.name, p.category, p.price, p.stock, p.unit, p.description, p.image);
      });
      stmt.finalize();
      console.log('✅ Initial products seeded successfully');
    }
  });
});

module.exports = db;
