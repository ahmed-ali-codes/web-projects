/**
 * cart.js - Production-Level Professional Cart System
 * Handles: Persistence, State Management, UI Updates, and Calculations
 */

const CART_KEY = 'coffies_cart';
const TAX_RATE = 0.08; // 8% Tax
const SHIPPING_FEE = 5.00;
const FREE_SHIPPING_THRESHOLD = 40.00;

class CartManager {
  constructor() {
    this.cart = this.loadCart();
    this.listeners = [];
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(CART_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Cart Load Error:', e);
      return [];
    }
  }

  saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.cart));
    this.notify();
  }

  // --- Core Actions ---

  addToCart(product, button = null) {
    const existing = this.cart.find(item => item.name === product.name);
    
    if (existing) {
      existing.qty += 1;
    } else {
      this.cart.push({
        ...product,
        price: parseFloat(product.price),
        qty: 1,
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    this.showFeedback(product.name, button);
  }

  updateQuantity(name, delta) {
    const index = this.cart.findIndex(item => item.name === name);
    if (index === -1) return;

    this.cart[index].qty += delta;

    if (this.cart[index].qty <= 0) {
      this.removeItem(name);
    } else {
      this.saveCart();
    }
  }

  removeItem(name) {
    this.cart = this.cart.filter(item => item.name !== name);
    this.saveCart();
    window.showToast?.('🗑 Item removed from cart');
  }

  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // --- Calculations ---

  getTotals() {
    const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const tax = subtotal * TAX_RATE;
    const shipping = (subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0) ? 0 : SHIPPING_FEE;
    const total = subtotal + tax + shipping;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      count: this.cart.reduce((sum, item) => sum + item.qty, 0)
    };
  }

  // --- UI Handling ---

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.cart, this.getTotals());
  }

  notify() {
    const totals = this.getTotals();
    this.listeners.forEach(cb => cb(this.cart, totals));
    this.updateGlobalUI(totals);
  }

  updateGlobalUI(totals) {
    const badge = document.getElementById('cartBadge');
    if (badge) {
      badge.textContent = totals.count;
      badge.classList.toggle('show', totals.count > 0);
    }
  }

  showFeedback(name, btn) {
    window.showToast?.(`☕ ${name} added to cart!`);
    if (btn) {
      const originalText = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = '✓';
      btn.style.backgroundColor = '#4caf50';
      btn.style.color = '#ffffff';
      
      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = originalText;
        btn.style.backgroundColor = '';
      }, 1500);
    }
  }
}

// Initialize Global Cart Instance
window.cartManager = new CartManager();

/**
 * UI Renderer for Cart Drawer
 */
function renderCartUI(cart, totals) {
  const itemsEl = document.getElementById('cartItems');
  const footerEl = document.getElementById('cartFooter');
  const emptyEl = document.getElementById('cartEmpty');
  
  if (!itemsEl) return;

  // Handle Empty State
  if (cart.length === 0) {
    if (emptyEl) emptyEl.style.display = 'block';
    if (footerEl) footerEl.style.display = 'none';
    itemsEl.innerHTML = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (footerEl) footerEl.style.display = 'block';

  // Render Items
  itemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img class="cart-item-img" src="${item.img}" alt="${item.name}"/>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-origin">${item.origin}</div>
        <div class="cart-item-price">$${(item.price * item.qty).toFixed(2)}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="cartManager.updateQuantity('${item.name}', -1)">−</button>
          <span class="qty-num">${item.qty}</span>
          <button class="qty-btn" onclick="cartManager.updateQuantity('${item.name}', 1)">+</button>
        </div>
      </div>
      <button class="cart-item-remove" onclick="cartManager.removeItem('${item.name}')">🗑</button>
    </div>
  `).join('');

  // Update Summary
  const subEl = document.getElementById('cartSubtotal');
  const shipEl = document.getElementById('cartShipping');
  const totalEl = document.getElementById('cartTotal');
  const progressEl = document.getElementById('cartProgress');

  if (subEl) subEl.textContent = `$${totals.subtotal}`;
  if (shipEl) {
    shipEl.textContent = totals.shipping === "0.00" ? 'FREE' : `$${totals.shipping}`;
    shipEl.style.color = totals.shipping === "0.00" ? '#4caf50' : 'inherit';
  }
  if (totalEl) totalEl.textContent = `$${totals.total}`;

  // Shipping Progress Message
  if (progressEl) {
    const remaining = FREE_SHIPPING_THRESHOLD - parseFloat(totals.subtotal);
    if (remaining > 0) {
      progressEl.innerHTML = `Add <strong>$${remaining.toFixed(2)}</strong> more for <strong>FREE shipping!</strong>`;
      progressEl.style.display = 'block';
    } else {
      progressEl.innerHTML = '🎉 You qualify for <strong>FREE shipping!</strong>';
      progressEl.style.display = 'block';
    }
  }
}

// Setup Global Helpers for HTML onclick events
window.addToCart = (n, o, p, i, b) => cartManager.addToCart({name:n, origin:o, price:p, img:i}, b);
window.openCart = () => {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('cartOverlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
};
window.closeCart = () => {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.body.style.overflow = '';
};

// Global Toast System
let _toastTimer;
window.showToast = (msg) => {
  const t = document.getElementById('toast');
  const m = document.getElementById('toastMsg');
  if (!t || !m) return;
  m.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
};

// Subscribe to changes on load
document.addEventListener('DOMContentLoaded', () => {
  cartManager.subscribe(renderCartUI);
});