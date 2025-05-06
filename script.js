const productListEl = document.getElementById('product-list');
const orderListEl = document.getElementById('order-list');
const checkoutBtn = document.getElementById('checkout-btn');

let products = [];
let orders = [];

// Fungsi untuk memuat menu dari file JSON
async function loadMenu() {
  try {
    const response = await fetch('menu.json');
    products = await response.json();
    displayProducts();
  } catch (error) {
    productListEl.innerHTML = '<p>Gagal memuat menu.</p>';
    console.error('Error loading menu:', error);
  }
}

// Fungsi menampilkan produk di halaman
function displayProducts() {
  productListEl.innerHTML = '';
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image || 'placeholder.jpg'}" alt="${product.nama}" />
      <h3>${product.nama}</h3>
      <p class="description">${product.deskripsi}</p>
      <div class="price">Rp ${product.harga.toLocaleString('id-ID')}</div>
      <button onclick="addToOrder(${product.id})">Tambah Pesanan</button>
    `;
    productListEl.appendChild(card);
  });
}

// Fungsi tambah produk ke daftar pesanan
function addToOrder(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  const existingOrder = orders.find(o => o.id === productId);
  if (existingOrder) {
    existingOrder.quantity += 1;
  } else {
    orders.push({
      id: product.id,
      nama: product.nama,
      harga: product.harga,
      quantity: 1
    });
  }
  renderOrderList();
}

// Fungsi render daftar pesanan
function renderOrderList() {
  orderListEl.innerHTML = '';
  if (orders.length === 0) {
    orderListEl.innerHTML = '<p>Belum ada pesanan.</p>';
    checkoutBtn.disabled = true;
    return;
  }

  orders.forEach(order => {
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    orderItem.innerHTML = `
      <span>${order.nama}</span>
      <span class="quantity">x${order.quantity}</span>
    `;
    orderListEl.appendChild(orderItem);
  });

  checkoutBtn.disabled = false;
}

// Fungsi handle checkout
checkoutBtn.addEventListener('click', () => {
  if (orders.length === 0) return;
  let total = orders.reduce((sum, order) => sum + order.harga * order.quantity, 0);
  alert(`Terima kasih telah memesan! Total pembayaran: Rp ${total.toLocaleString('id-ID')}`);
  orders = [];
  renderOrderList();
});

// Load menu saat halaman selesai dimuat
window.addEventListener('DOMContentLoaded', loadMenu);
