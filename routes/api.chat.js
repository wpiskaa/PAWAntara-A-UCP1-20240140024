const express = require('express');
const router = express.Router();
const db = require('../database/init');

// POST /api/chat
router.post('/chat', (req, res) => {
  const { question } = req.body;

  if (!question || typeof question !== 'string' || question.trim() === '') {
    return res.status(400).json({
      status: 'error',
      message: 'Pertanyaan tidak boleh kosong'
    });
  }

  const query = question.toLowerCase().trim();

  // Keyword matching logic
  if (query.includes('jam') || query.includes('buka') || query.includes('tutup') || query.includes('operasional')) {
    return res.json({
      status: 'success',
      data: {
        reply: 'Toko Sembako Ariesta buka setiap hari Senin - Minggu dari jam 07.00 WIB sampai 20.00 WIB. Silakan mampir atau pesan secara online!'
      }
    });
  }

  if (query.includes('ongkir') || query.includes('antar') || query.includes('kirim') || query.includes('kurir') || query.includes('delivery')) {
    return res.json({
      status: 'success',
      data: {
        reply: 'Kami melayani pengantaran langsung ke rumah untuk area sekitar toko! Gratis ongkir untuk pemesanan minimal Rp 100.000 (jarak max 3km).'
      }
    });
  }

  if (query.includes('bayar') || query.includes('pembayaran') || query.includes('qris') || query.includes('transfer') || query.includes('cod') || query.includes('tunai')) {
    return res.json({
      status: 'success',
      data: {
        reply: 'Toko Ariesta menerima pembayaran Tunai/COD saat barang sampai, Transfer Bank (BCA/Mandiri), dan Scan QRIS untuk semua e-wallet!'
      }
    });
  }

  if (query.includes('lokasi') || query.includes('alamat') || query.includes('dimana') || query.includes('toko')) {
    return res.json({
      status: 'success',
      data: {
        reply: 'Toko Sembako Ariesta berlokasi di Jl. Sembako Raya No. 12, Umbulharjo, Yogyakarta. Sangat strategis dan mudah ditemukan di Google Maps!'
      }
    });
  }

  if (query.includes('halo') || query.includes('hai') || query.includes('pagi') || query.includes('siang') || query.includes('malam') || query.includes('assalamualaikum')) {
    return res.json({
      status: 'success',
      data: {
        reply: 'Halo! Selamat datang di Toko Sembako Ariesta. Saya Asisten AI Toko Ariesta. Ada yang bisa saya bantu terkait stok, harga sembako, atau info pengiriman?'
      }
    });
  }

  if (query.includes('diskon') || query.includes('promo') || query.includes('grosir') || query.includes('murah')) {
    return res.json({
      status: 'success',
      data: {
        reply: 'Kami selalu menyediakan harga grosir bersaing! Dapatkan potongan khusus untuk pembelian beras karungan atau minyak goreng kartonan.'
      }
    });
  }

  // Check database for product-related query
  db.all('SELECT name, price, stock, unit FROM products', [], (err, products) => {
    if (!err && products && products.length > 0) {
      const matched = products.filter(p => query.includes(p.name.toLowerCase()) || query.split(' ').some(w => w.length > 3 && p.name.toLowerCase().includes(w)));

      if (matched.length > 0) {
        const itemInfo = matched.map(p => `• ${p.name}: Rp ${p.price.toLocaleString('id-ID')} / ${p.unit} (Stok: ${p.stock})`).join('\n');
        return res.json({
          status: 'success',
          data: {
            reply: `Berikut informasi stok & harga produk yang Anda tanyakan:\n${itemInfo}\n\nAda produk lain yang ingin Anda tanyakan?`
          }
        });
      }
    }

    // Default reply if no keyword matched
    return res.json({
      status: 'success',
      data: {
        reply: 'Terima kasih atas pertanyaannya! Untuk info lebih detail mengenai ketersediaan item khusus, Anda bisa mengecek halaman katalog Produk kami atau menghubungi Ibu Aries via WhatsApp.'
      }
    });
  });
});

module.exports = router;
