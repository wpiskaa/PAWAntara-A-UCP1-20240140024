const express = require('express');
const path = require('path');
const session = require('express-session');
const logger = require('./middlewares/logger');

// Import Routes
const viewRoutes = require('./routes/views.routes');
const apiAuthRoutes = require('./routes/api.auth');
const apiProductsRoutes = require('./routes/api.products');
const apiChatRoutes = require('./routes/api.chat');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session Middleware
app.use(session({
  secret: 'toko-sembako-ariesta-super-secret-key-2026',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: false // set to true if using HTTPS
  }
}));

// Custom Logger Middleware
app.use(logger);

// Mount View Routes
app.use('/', viewRoutes);

// Mount REST API Routes
app.use('/api', apiAuthRoutes);
app.use('/api', apiProductsRoutes);
app.use('/api', apiChatRoutes);

// Handle 404 for unmatched routes
app.use((req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      status: 'error',
      message: 'Endpoint API tidak ditemukan'
    });
  }
  res.status(404).render('404', {
    title: 'Halaman Tidak Ditemukan - Toko Sembako Ariesta',
    page: '404',
    message: 'Halaman yang Anda akses tidak tersedia.',
    user: req.session.user || null
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛒 Server Toko Sembako Ariesta Berhasil Dijalankan!`);
  console.log(`🌐 URL Utama: http://localhost:${PORT}`);
  console.log(`📦 Katalog Produk: http://localhost:${PORT}/produk`);
  console.log(`🤖 Tanya AI: http://localhost:${PORT}/tanya-ai`);
  console.log(`🔐 Admin Login: http://localhost:${PORT}/login`);
  console.log(`=======================================================`);
});
