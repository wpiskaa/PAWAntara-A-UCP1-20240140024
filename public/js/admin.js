document.addEventListener('DOMContentLoaded', () => {
  // Modal Elements
  const modal = document.getElementById('product-modal');
  const modalTitle = document.getElementById('modal-title');
  const productForm = document.getElementById('product-form');
  const cancelBtn = document.getElementById('cancel-modal-btn');
  const addProductBtn = document.getElementById('add-product-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Input Fields
  const prodIdInput = document.getElementById('prod-id');
  const nameInput = document.getElementById('prod-name');
  const categoryInput = document.getElementById('prod-category');
  const priceInput = document.getElementById('prod-price');
  const stockInput = document.getElementById('prod-stock');
  const unitInput = document.getElementById('prod-unit');
  const imageInput = document.getElementById('prod-image');
  const descInput = document.getElementById('prod-desc');

  // Logout Handler
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      if (!confirm('Apakah Anda yakin ingin keluar dari dashboard admin?')) return;

      try {
        const response = await fetch('/api/logout', { method: 'POST' });
        const resData = await response.json();
        if (response.ok && resData.status === 'success') {
          window.location.href = '/login?message=Anda telah berhasil logout';
        } else {
          alert(resData.message || 'Gagal logout.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan jaringan.');
      }
    });
  }

  // Open Modal Add
  if (addProductBtn) {
    addProductBtn.addEventListener('click', () => {
      productForm.reset();
      prodIdInput.value = '';
      modalTitle.innerText = 'Tambah Produk Sembako Baru';
      openModal();
    });
  }

  // Close Modal
  if (cancelBtn) {
    cancelBtn.addEventListener('click', closeModal);
  }

  function openModal() {
    if (modal) modal.classList.remove('hidden');
  }

  function closeModal() {
    if (modal) modal.classList.add('hidden');
  }

  // Handle Form Submit (Add or Edit)
  if (productForm) {
    productForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const id = prodIdInput.value;
      const payload = {
        name: nameInput.value.trim(),
        category: categoryInput.value.trim(),
        price: parseInt(priceInput.value, 10),
        stock: parseInt(stockInput.value, 10),
        unit: unitInput.value.trim() || 'Pcs',
        image: imageInput.value.trim() || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=600&q=80',
        description: descInput.value.trim()
      };

      if (!payload.name || !payload.category || isNaN(payload.price) || isNaN(payload.stock)) {
        alert('Mohon isi nama, kategori, harga, dan stok dengan benar!');
        return;
      }

      const isEdit = Boolean(id);
      const url = isEdit ? `/api/products/${id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      try {
        const response = await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          closeModal();
          alert(result.message || 'Berhasil menyimpan produk!');
          window.location.reload(); // Reload to reflect fresh DB changes
        } else {
          alert(result.message || 'Gagal menyimpan produk.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan koneksi jaringan.');
      }
    });
  }

  // Edit Product Event Delegation
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;
      const category = btn.dataset.category;
      const price = btn.dataset.price;
      const stock = btn.dataset.stock;
      const unit = btn.dataset.unit;
      const image = btn.dataset.image;
      const description = btn.dataset.description;

      prodIdInput.value = id;
      nameInput.value = name;
      categoryInput.value = category;
      priceInput.value = price;
      stockInput.value = stock;
      unitInput.value = unit;
      imageInput.value = image;
      descInput.value = description;

      modalTitle.innerText = `Edit Produk #${id} - ${name}`;
      openModal();
    });
  });

  // Delete Product Event Delegation
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id;
      const name = btn.dataset.name;

      if (!confirm(`Apakah Anda yakin ingin menghapus produk "${name}" (ID #${id})?`)) return;

      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          alert(`Produk "${name}" berhasil dihapus.`);
          const row = document.getElementById(`prod-row-${id}`);
          if (row) row.remove();
        } else {
          alert(result.message || 'Gagal menghapus produk.');
        }
      } catch (err) {
        console.error(err);
        alert('Terjadi kesalahan koneksi server.');
      }
    });
  });
});
