# Website & REST API "Toko Sembako Ariesta" dengan Fitur Tanya AI

Proyek UCP 1 Pemrograman Aplikasi Web (PAW) — Aplikasi web full-stack berbasis Node.js, Express.js, EJS, Tailwind CSS (CDN), SQLite Database, Express-Session, dan REST API lengkap dengan simulasi fitur Tanya AI.

---

## 👤 Informasi Mahasiswa

- **Nama**: wpiskaa
- **NIM**: 20240140024
- **Kelas**: PAW Antara - Kelas A
- **Dosen Pengampu**: Ir. Asroni, S.T., M.Eng.
- **Asisten Dosen**: Rizki Ramadan, Reza Azhari

---

## 📝 Deskripsi Singkat Proyek

Toko Sembako Ariesta adalah aplikasi web toko sembako milik Ibu Aries yang menyediakan ketersediaan stok & harga real-time beras, minyak goreng, gula, telur, dan kebutuhan pokok rumah tangga lainnya.

Proyek ini dilengkapi dengan:
1. **Frontend Server-Rendered (EJS + Tailwind CSS)**: Halaman Beranda, Katalog Produk dengan filter pencarian server-side, Detail Produk dinamis, Halaman Tanya AI interaktif, Login, dan Dashboard Admin.
2. **REST API Full CRUD**: Pengelolaan data produk sembako (GET, POST, PUT, DELETE) dengan proteksi middleware autentikasi session-based.
3. **Fitur Tanya AI (Simulasi Backend Dummy)**: Endpoint REST API `/api/chat` yang memproses pertanyaan seputar stok, harga, jam operasional, ongkir pengiriman, dan metode pembayaran melalui pencocokan kata kunci (keyword matching).
4. **Persistensi Data SQLite**: Data tersimpan persisten dalam database file SQLite (`data/sembako.db`).

---

## 🔑 Kredensial Login Admin / Kasir

Gunakan kredensial berikut untuk menguji akses ke Dashboard Admin dan API terproteksi:

- **URL Login**: `http://localhost:3000/login`
- **Username**: `admin`
- **Password**: `admin123` *(Di-hash menggunakan bcrypt di database)*

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

1. **Clone / Buka Repository**
   Pastikan Anda berada di direktori proyek `PAWAntara-A-UCP1-20220140020`.

2. **Install Dependencies**
   Jalankan perintah berikut di terminal:
   ```bash
   npm install
   ```

3. **Jalankan Server Development (via Nodemon)**
   Jalankan server dalam mode dev:
   ```bash
   npm run dev
   ```

4. **Akses Aplikasi**
   Buka peramban (browser) dan navigasikan ke:
   - **Beranda**: `http://localhost:3000`
   - **Katalog Produk**: `http://localhost:3000/produk`
   - **Tanya AI**: `http://localhost:3000/tanya-ai`
   - **Login Admin**: `http://localhost:3000/login`
   - **Dashboard Admin**: `http://localhost:3000/admin/dashboard` (setelah login)

---

## 🌐 Kontrak REST API

| Method | Endpoint | Deskripsi | Akses | Contoh Response (JSON) |
|---|---|---|---|---|
| `POST` | `/api/login` | Login admin/kasir dengan username & password | Publik | `{ "status": "success", "message": "Login berhasil" }` |
| `POST` | `/api/logout` | Logout, menghapus sesi login | Login | `{ "status": "success", "message": "Logout berhasil" }` |
| `GET` | `/api/products` | Ambil seluruh data produk sembako | Publik | `{ "status": "success", "data": [ { "id": 1, "name": "Beras 5kg", "price": 72000, "stock": 25 } ] }` |
| `GET` | `/api/products/:id` | Ambil satu produk berdasarkan ID | Publik | `{ "status": "success", "data": { "id": 1, "name": "Beras 5kg", "price": 72000, "stock": 25 } }` |
| `POST` | `/api/products` | Tambah produk baru | Login | `{ "status": "success", "message": "Produk ditambahkan", "data": { "id": 7, "name": "Minyak Goreng 2L", "price": 35000, "stock": 15 } }` |
| `PUT` | `/api/products/:id` | Update produk (harga/stok) berdasarkan ID | Login | `{ "status": "success", "message": "Produk diperbarui", "data": { "id": 1, "name": "Beras 5kg", "price": 75000, "stock": 20 } }` |
| `DELETE` | `/api/products/:id` | Hapus produk berdasarkan ID | Login | `{ "status": "success", "message": "Produk dihapus" }` |
| `POST` | `/api/chat` | Kirim pertanyaan, terima balasan AI dummy dari backend | Publik | `{ "status": "success", "data": { "reply": "Toko kami buka setiap hari jam 07.00 - 20.00!" } }` |

*Catatan: Endpoint terproteksi (`POST`, `PUT`, `DELETE` produk) yang diakses tanpa login akan menolak request dengan HTTP status `401 Unauthorized`: `{ "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" }`.*

---

## 🎨 Penjelasan Tampilan Interface (UI)

1. **Beranda (`/`)**:
   Tampilan hero section modern berlatar gelap (dark mode) dengan aksen warna emerald & teal, badge indikator UMKM, grid preview produk unggulan, ringkasan keunggulan layanan, serta call-to-action ke katalog dan Tanya AI.
2. **Katalog Produk (`/produk`)**:
   Layout responsive grid berisi kartu produk sembako (product cards) yang menampilkan foto, nama, kategori, harga per satuan, dan status stok. Dilengkapi dengan form pencarian (search bar) dan dropdown filter kategori sembako yang diproses secara server-side via query string (`?search=` / `?kategori=`).
3. **Detail Produk (`/produk/:id`)**:
   Halaman detail produk dinamis yang menyajikan foto produk resolusi tinggi, rincian harga per unit, status ketersediaan stok, deskripsi lengkap, serta tombol pemesanan langsung via WhatsApp ke Ibu Aries. Jika ID tidak valid/tidak ditemukan, halaman ini mengalihkan ke tampilan 404 yang ramah.
4. **Tanya AI (`/tanya-ai`)**:
   Antarmuka chat interaktif dengan gelembung pesan (chat bubbles) untuk pertanyaan pelanggan dan jawaban otomatis bot AI backend, tombol saran cepat (quick suggestions), indikator animasi mengetik, dan pengiriman pesan via Fetch API tanpa reload halaman.
5. **Form Login Admin (`/login`)**:
   Antarmuka login aman dengan validasi form berbasis JavaScript di frontend sebelum dikirimkan ke endpoint `/api/login`. Menyediakan pemberitahuan error jika kredensial salah dan mengarahkan otomatis ke dashboard saat login berhasil.
6. **Dashboard Admin (`/admin/dashboard`)**:
   Panel manajemen terproteksi khusus Ibu Aries/kasir yang menampilkan tabel data sembako lengkap, tombol tambah produk baru (dengan modal dialog form), tombol edit harga & stok, serta tombol hapus produk yang terintegrasi penuh ke REST API via Fetch API.
