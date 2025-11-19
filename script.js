/* -----------------------------
   PRODUCTS DATA
   (id: {name, price (number), img, desc})
------------------------------*/
const products = {
  1: { name: "Produk 1", price: 50000, img: "img/produk1.jpg", desc: "Deskripsi lengkap produk 1." },
  2: { name: "Produk 2", price: 70000, img: "img/produk2.jpg", desc: "Deskripsi lengkap produk 2." },
  3: { name: "Produk 3", price: 90000, img: "img/produk3.jpg", desc: "Deskripsi lengkap produk 3." },
  4: { name: "Produk 4", price: 120000, img: "img/produk4.jpg", desc: "Deskripsi lengkap produk 4." },
  5: { name: "Produk 5", price: 150000, img: "img/produk5.jpg", desc: "Deskripsi lengkap produk 5." },
  6: { name: "Produk 6", price: 200000, img: "img/produk6.jpg", desc: "Deskripsi lengkap produk 6." },
  7: { name: "Produk 7", price: 45000, img: "img/produk7.jpg", desc: "Deskripsi lengkap produk 7." },
  8: { name: "Produk 8", price: 85000, img: "img/produk8.jpg", desc: "Deskripsi lengkap produk 8." },
  9: { name: "Produk 9", price: 110000, img: "img/produk9.jpg", desc: "Deskripsi lengkap produk 9." },
 10: { name: "Produk 10", price: 60000, img: "img/produk10.jpg", desc: "Deskripsi lengkap produk 10." },
 11: { name: "Produk 11", price: 95000, img: "img/produk11.jpg", desc: "Deskripsi lengkap produk 11." },
 12: { name: "Produk 12", price: 130000, img: "img/produk12.jpg", desc: "Deskripsi lengkap produk 12." }
};

/* -----------------------------
   HELPERS
------------------------------*/
function formatRupiah(val) {
  if (val === undefined || val === null) return 'Rp 0';
  return 'Rp ' + Number(val).toLocaleString('id-ID');
}

/* -----------------------------
   CART (localStorage)
------------------------------*/
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart by product id
function addToCart(id) {
  const p = products[id];
  if (!p) return;
  cart.push({ id: id, name: p.name, price: p.price, img: p.img });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// function used by index buttons (wrapper)
function addToCartFromPage(id) {
  addToCart(id);
  // feedback singkat
  flashMessage('Produk ditambahkan ke keranjang');
}

// update cart count and sidebar render
function updateCartUI() {
  document.getElementById('cartCount')?.innerText = cart.length;
  renderCartSidebar();
}

// render items inside sidebar
function renderCartSidebar() {
  const container = document.getElementById('cartContent');
  if (!container) return;
  if (cart.length === 0) {
    container.innerHTML = '<p class="text-muted">Keranjang kosong.</p>';
    document.getElementById('cartTotal').innerText = formatRupiah(0);
    return;
  }

  let total = 0;
  let html = '';
  cart.forEach((it, idx) => {
    total += Number(it.price);
    html += `
      <div class="d-flex mb-3 align-items-center">
        <img src="${it.img}" style="width:64px;height:64px;object-fit:cover;border-radius:6px" alt="">
        <div class="ms-2 flex-grow-1">
          <div class="fw-bold">${it.name}</div>
          <div class="text-muted">${formatRupiah(it.price)}</div>
        </div>
        <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${idx})">Hapus</button>
      </div>
    `;
  });

  container.innerHTML = html;
  document.getElementById('cartTotal').innerText = formatRupiah(total);
}

// remove item by index
function removeFromCart(i) {
  cart.splice(i,1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// clear cart
function clearCart(){
  if (!confirm('Kosongkan keranjang?')) return;
  cart = [];
  localStorage.removeItem('cart');
  updateCartUI();
}

/* -----------------------------
   UI: sidebar open/close
------------------------------*/
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
document.getElementById('openCartBtn')?.addEventListener('click', () => {
  openCart();
});
document.getElementById('closeCartBtn')?.addEventListener('click', () => {
  closeCart();
});
document.getElementById('clearCartBtn')?.addEventListener('click', () => {
  clearCart();
});
cartOverlay?.addEventListener('click', closeCart);

function openCart(){
  cartSidebar?.classList.add('open');
  cartOverlay?.classList.add('show');
  renderCartSidebar();
}
function closeCart(){
  cartSidebar?.classList.remove('open');
  cartOverlay?.classList.remove('show');
}

/* -----------------------------
   SEARCH (navbar + top)
------------------------------*/
function attachSearch(inputId){
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener('input', function(){
    const q = this.value.trim().toLowerCase();
    document.querySelectorAll('.product').forEach(el => {
      const name = (el.dataset.name || '').toLowerCase();
      el.style.display = name.includes(q) ? 'block' : 'none';
    });
  });
}
attachSearch('navSearch');
attachSearch('topSearch');

/* -----------------------------
   Dark mode toggle (simple)
------------------------------*/
document.getElementById('darkModeBtn')?.addEventListener('click', function(){
  const html = document.documentElement;
  html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
  this.textContent = html.dataset.theme === 'dark' ? 'Light' : 'Dark';
});

/* -----------------------------
   Small helper: flash message
------------------------------*/
function flashMessage(msg){
  const el = document.createElement('div');
  el.className = 'toast-message';
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(()=> el.classList.add('show'), 10);
  setTimeout(()=> { el.classList.remove('show'); setTimeout(()=> el.remove(),300); }, 1800);
}

/* -----------------------------
   INITIALIZE UI ON LOAD
------------------------------*/
(function init(){
  cart = JSON.parse(localStorage.getItem('cart')) || [];
  updateCartUI();

  // If on detail page, render there too (handled in detail.html script)
})();
