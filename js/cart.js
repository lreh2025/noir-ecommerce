/* ============================================================
   cart.js — Shopping cart module
   
   Responsibilities:
   - Maintains cart state (array of { product, quantity })
   - Persists to localStorage so cart survives page refresh
   - Provides public API: addItem, removeItem, updateQty, clear
   - Renders cart sidebar UI
   - Calculates subtotals and totals
   ============================================================ */


/* ── State ──────────────────────────────────────────────── */

// Cart item shape: { id: string, name: string, price: number,
//                    quantity: number, symbol: string }
let cartItems = [];

// Load persisted cart from localStorage on startup
(function loadCart() {
  try {
    const saved = localStorage.getItem('noir_cart');
    if (saved) cartItems = JSON.parse(saved);
  } catch (e) {
    cartItems = []; // gracefully handle corrupted data
  }
})();


/* ── Persistence ────────────────────────────────────────── */

/**
 * Save cart state to localStorage.
 * Called after every cart mutation.
 */
function persistCart() {
  try {
    localStorage.setItem('noir_cart', JSON.stringify(cartItems));
  } catch (e) {
    // localStorage may be unavailable in private browsing — fail silently
    console.warn('Cart could not be persisted:', e);
  }
}


/* ── Public API ─────────────────────────────────────────── */

/**
 * Add a product to the cart, or increase its quantity if already present.
 * @param {Object} product  - Product object from PRODUCTS array
 * @param {number} quantity - Amount to add (default 1)
 */
function cartAdd(product, quantity = 1) {
  const existing = cartItems.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cartItems.push({
      id:       product.id,
      name:     product.name,
      price:    product.price,
      quantity: quantity,
      symbol:   product.symbol,
    });
  }

  persistCart();
  cartRender();
  updateCartCount();
  showToast(`${product.name} added to cart`);

  // Pulse the cart count badge
  const badge = document.getElementById('cart-count');
  badge.classList.remove('pulse');
  void badge.offsetWidth; // force reflow to restart animation
  badge.classList.add('pulse');
}

/**
 * Remove an item from the cart entirely.
 * @param {string} id - Product ID
 */
function cartRemove(id) {
  cartItems = cartItems.filter(item => item.id !== id);
  persistCart();
  cartRender();
  updateCartCount();
}

/**
 * Update the quantity of a cart item.
 * Removes the item if quantity drops to 0 or below.
 * @param {string} id    - Product ID
 * @param {number} delta - Change in quantity (+1 or -1)
 */
function cartUpdateQty(id, delta) {
  const item = cartItems.find(item => item.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cartRemove(id);
  } else {
    persistCart();
    cartRender();
    updateCartCount();
  }
}

/**
 * Empty the cart completely.
 */
function cartClear() {
  cartItems = [];
  persistCart();
  cartRender();
  updateCartCount();
}

/**
 * Calculate the cart subtotal (before shipping/tax).
 * @returns {number}
 */
function cartSubtotal() {
  return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

/**
 * Get the total number of items in the cart (sum of all quantities).
 * @returns {number}
 */
function cartTotalItems() {
  return cartItems.reduce((sum, item) => sum + item.quantity, 0);
}


/* ── UI Rendering ───────────────────────────────────────── */

/**
 * Re-render the entire cart sidebar UI.
 * Called after every state change.
 */
function cartRender() {
  const listEl   = document.getElementById('cart-items');
  const emptyEl  = document.getElementById('cart-empty');
  const footerEl = document.getElementById('cart-footer');
  const subtotal = document.getElementById('cart-subtotal-amount');

  const isEmpty = cartItems.length === 0;

  // Toggle empty state vs item list + footer
  emptyEl.style.display  = isEmpty ? 'flex' : 'none';
  footerEl.hidden         = isEmpty;
  listEl.style.display    = isEmpty ? 'none' : 'flex';

  if (isEmpty) return;

  // Render each cart item row
  listEl.innerHTML = cartItems.map(item => `
    <li class="cart-item" role="listitem">

      <!-- Product thumbnail (CSS art) -->
      <div class="cart-item-thumb" aria-hidden="true">${item.symbol}</div>

      <!-- Name + price -->
      <div class="cart-item-info">
        <span class="cart-item-name">${item.name}</span>
        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <!-- Quantity controls + remove -->
      <div style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
        <div class="cart-qty">
          <button class="cart-qty-btn"
            onclick="cartUpdateQty('${item.id}', -1)"
            aria-label="Decrease ${item.name} quantity">−</button>
          <span class="cart-qty-num" aria-label="Quantity: ${item.quantity}">${item.quantity}</span>
          <button class="cart-qty-btn"
            onclick="cartUpdateQty('${item.id}', 1)"
            aria-label="Increase ${item.name} quantity">+</button>
        </div>
        <button class="cart-remove"
          onclick="cartRemove('${item.id}')"
          aria-label="Remove ${item.name} from cart">Remove</button>
      </div>

    </li>
  `).join('');

  // Update subtotal display
  subtotal.textContent = `$${cartSubtotal().toFixed(2)}`;
}

/**
 * Update the cart count badge in the header.
 */
function updateCartCount() {
  const count = cartTotalItems();
  const el = document.getElementById('cart-count');
  el.textContent = count;
  el.setAttribute('aria-label', `${count} items in cart`);
}


/* ── Initialise on load ─────────────────────────────────── */
// Run an initial render so persisted cart shows correctly
document.addEventListener('DOMContentLoaded', () => {
  cartRender();
  updateCartCount();
});
