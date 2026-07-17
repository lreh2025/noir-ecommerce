/* ============================================================
   app.js — Main application controller

   Responsibilities:
   - View routing (hero → shop → detail → about)
   - Product grid rendering with filtering and sorting
   - Product detail page population
   - Cart sidebar open/close
   - Multi-step checkout with validation
   - Toast notifications
   - Accordion component
   ============================================================ */


/* ════════════════════════════════════════════════════════════
   1. STATE
   ════════════════════════════════════════════════════════════ */

let currentFilter = 'all';   // active filter category
let currentSort   = 'default'; // active sort key
let currentSearch = '';      // active search query
let currentProduct = null;   // product shown in detail view
let cartOpen      = false;   // cart sidebar state
let checkoutStep  = 1;       // current checkout step (1-4)
let toastTimer    = null;    // reference to hide-toast timeout


/* ════════════════════════════════════════════════════════════
   2. VIEW ROUTING
   ════════════════════════════════════════════════════════════ */

/**
 * Switch between the app's main views.
 * Views: 'hero' | 'shop' | 'detail' | 'about'
 * @param {string} view
 */
function showView(view) {
  // Hide all views first
  document.getElementById('hero-section').style.display  = 'none';
  document.getElementById('shop-view').style.display     = 'none';
  document.getElementById('detail-view').hidden           = true;
  document.getElementById('about-view').hidden            = true;

  // Show the requested view
  switch (view) {
    case 'hero':
      document.getElementById('hero-section').style.display = 'flex';
      break;
    case 'shop':
      document.getElementById('shop-view').style.display = 'block';
      renderProducts(); // re-render with current filter/sort
      break;
    case 'detail':
      document.getElementById('detail-view').hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
    case 'about':
      document.getElementById('about-view').hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      break;
  }

  // Close cart sidebar if open
  if (cartOpen) toggleCart();
}

/**
 * Scroll past the hero section to the shop grid.
 * Used by the hero CTA button.
 */
function scrollToProducts() {
  showView('shop');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


/* ════════════════════════════════════════════════════════════
   3. PRODUCT GRID
   ════════════════════════════════════════════════════════════ */

/**
 * Apply current filter and sort, then inject product cards into the grid.
 */
function renderProducts() {
  // 1. Filter by category
  let list = currentFilter === 'all'
    ? [...PRODUCTS]
    : PRODUCTS.filter(p => p.category === currentFilter);

  // 1b. Filter by search query (name or description match)
  if (currentSearch) {
    list = list.filter(p =>
      p.name.toLowerCase().includes(currentSearch) ||
      p.description.toLowerCase().includes(currentSearch)
    );
  }

  // 2. Sort
  switch (currentSort) {
    case 'price-asc':
      list.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      list.sort((a, b) => b.price - a.price);
      break;
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name));
      break;
    // 'default' — preserve original array order
  }

  // 3. Update count label
  document.getElementById('product-count').textContent =
    `Showing ${list.length} item${list.length === 1 ? '' : 's'}`;

  // 4. Render cards
  const grid = document.getElementById('product-grid');
  grid.innerHTML = list.map(product => buildProductCard(product)).join('');
}

/**
 * Build the HTML string for a single product card.
 * @param {Object} product
 * @returns {string} HTML
 */
function buildProductCard(product) {
  return `
    <article class="product-card"
      role="listitem"
      onclick="openProductDetail('${product.id}')"
      aria-label="${product.name}, $${product.price}">

      <!-- Image area with CSS art placeholder -->
      <div class="card-image" data-symbol="${product.symbol}" role="img" aria-label="Product image for ${product.name}">

        <!-- Category badge -->
        <span class="card-badge">${product.category}</span>

        <!-- Quick-add button — stops click propagating to card to avoid
             opening the detail view when quick-adding -->
        <button
          class="card-quick-add"
          onclick="event.stopPropagation(); cartAdd(getProduct('${product.id}'), 1)"
          aria-label="Quick add ${product.name} to cart">
          + Add to cart
        </button>

      </div>

      <!-- Card text body -->
      <div class="card-body">
        <h2 class="card-name">${product.name}</h2>
        <p class="card-desc">${truncate(product.description, 80)}</p>
        <p class="card-price">$${product.price.toFixed(2)}</p>
      </div>

    </article>
  `;
}

/**
 * Look up a product by ID from the PRODUCTS array.
 * @param {string} id
 * @returns {Object|undefined}
 */
function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/**
 * Truncate a string to maxLen characters with an ellipsis.
 * @param {string} str
 * @param {number} maxLen
 * @returns {string}
 */
function truncate(str, maxLen) {
  return str.length > maxLen ? str.slice(0, maxLen).trimEnd() + '…' : str;
}


/* ════════════════════════════════════════════════════════════
   4. FILTERING & SORTING
   ════════════════════════════════════════════════════════════ */

/**
 * Set the active filter category and re-render the grid.
 * @param {string} category - 'all' | 'lighting' | 'furniture' | 'objects' | 'textiles'
 * @param {HTMLElement} btn - The clicked button (for active class management)
 */
function filterProducts(category, btn) {
  currentFilter = category;

  // Update active button styles
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  renderProducts();
}

/**
 * Set the active sort and re-render.
 * @param {string} sortKey - 'default' | 'price-asc' | 'price-desc' | 'name-asc'
 */
function sortProducts(sortKey) {
  currentSort = sortKey;
  renderProducts();
}


/* ════════════════════════════════════════════════════════════
   5. PRODUCT DETAIL PAGE
   ════════════════════════════════════════════════════════════ */

/**
 * Navigate to the detail view and populate it with the given product.
 * @param {string} productId
 */
function openProductDetail(productId) {
  const product = getProduct(productId);
  if (!product) return;

  currentProduct = product;

  // Populate detail fields
  document.getElementById('detail-category').textContent   = product.category;
  document.getElementById('detail-title').textContent      = product.name;
  document.getElementById('detail-price').textContent      = `$${product.price.toFixed(2)}`;
  document.getElementById('detail-description').textContent = product.description;
  document.getElementById('detail-materials').innerHTML    = product.materials;

  // Set the large image placeholder symbol
  document.getElementById('detail-image').textContent      = product.symbol;
  document.getElementById('detail-image-label').textContent = `${product.name} — ${product.category}`;

  // Reset quantity to 1
  document.getElementById('qty-input').value = 1;

  // Reset all accordions to closed
  document.querySelectorAll('.accordion-trigger').forEach(btn => {
    btn.setAttribute('aria-expanded', 'false');
    btn.querySelector('.accordion-icon').textContent = '+';
    const body = btn.nextElementSibling;
    if (body) body.hidden = true;
  });

  showView('detail');
}

/**
 * Add the currently-viewed product to the cart.
 * Reads the quantity from the qty input.
 */
function addCurrentToCart() {
  if (!currentProduct) return;

  const qty = parseInt(document.getElementById('qty-input').value, 10);
  const safeQty = isNaN(qty) || qty < 1 ? 1 : qty;

  cartAdd(currentProduct, safeQty);

  // Brief visual feedback on the button
  const btn = document.getElementById('add-to-cart-btn');
  const originalText = btn.textContent;
  btn.textContent = '✓ Added!';
  btn.style.background = 'var(--c-success)';
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
  }, 1200);
}

/**
 * Adjust the quantity input on the detail page.
 * @param {number} delta - +1 or -1
 */
function adjustQty(delta) {
  const input = document.getElementById('qty-input');
  const current = parseInt(input.value, 10) || 1;
  const next = Math.max(1, current + delta);
  input.value = next;
}


/* ════════════════════════════════════════════════════════════
   6. CART SIDEBAR
   ════════════════════════════════════════════════════════════ */

/**
 * Toggle the cart sidebar open/closed.
 */
function toggleCart() {
  cartOpen = !cartOpen;

  const sidebar  = document.getElementById('cart-sidebar');
  const overlay  = document.getElementById('cart-overlay');

  sidebar.classList.toggle('open', cartOpen);
  overlay.classList.toggle('visible', cartOpen);

  // Update accessibility attributes
  sidebar.setAttribute('aria-hidden', String(!cartOpen));

  // Prevent body scroll when cart is open
  document.body.style.overflow = cartOpen ? 'hidden' : '';
}


/* ════════════════════════════════════════════════════════════
   7. CHECKOUT FLOW
   ════════════════════════════════════════════════════════════ */

/**
 * Open the checkout modal and populate the order summary.
 */
function startCheckout() {
  // Close cart first
  if (cartOpen) toggleCart();

  // Reset to step 1
  checkoutStep = 1;
  updateCheckoutStepUI();

  // Populate order summary (used in step 3)
  populateOrderSummary();

  // Show modal
  const overlay = document.getElementById('checkout-overlay');
  overlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

/**
 * Close the checkout modal.
 */
function closeCheckout() {
  const overlay = document.getElementById('checkout-overlay');
  overlay.hidden = true;
  document.body.style.overflow = '';
}

/**
 * Advance to the next checkout step after validation.
 * @param {number} targetStep
 */
function nextStep(targetStep) {
  // Validate the current step's required fields
  if (!validateCheckoutStep(checkoutStep)) return;

  checkoutStep = targetStep;

  // Re-populate order summary when reaching payment step
  if (targetStep === 3) populateOrderSummary();

  updateCheckoutStepUI();
}

/**
 * Go back to a previous step.
 * @param {number} targetStep
 */
function prevStep(targetStep) {
  checkoutStep = targetStep;
  updateCheckoutStepUI();
}

/**
 * Show/hide the correct step panel and update the step indicator.
 */
function updateCheckoutStepUI() {
  // Show/hide step panels
  for (let i = 1; i <= 4; i++) {
    const panel = document.getElementById(`step-${i}`);
    if (panel) panel.hidden = (i !== checkoutStep);
  }

  // Update step indicator classes
  const steps = document.querySelectorAll('.checkout-steps .step');
  steps.forEach(el => {
    const stepNum = parseInt(el.dataset.step, 10);
    el.classList.remove('active', 'done');
    if (stepNum === checkoutStep) el.classList.add('active');
    if (stepNum < checkoutStep)  el.classList.add('done');
  });
}

/**
 * Validate required fields for the given step.
 * Adds .error class to invalid inputs and shows a toast.
 * @param {number} step
 * @returns {boolean} isValid
 */
function validateCheckoutStep(step) {
  const requiredIds = {
    1: ['email', 'first-name', 'last-name'],
    2: ['address', 'city', 'zip'],
    3: [], // payment fields are demo-only; skip validation
  };

  const ids = requiredIds[step] || [];
  let valid = true;

  ids.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;

    // Remove previous error state
    input.classList.remove('error');

    if (!input.value.trim()) {
      input.classList.add('error');
      valid = false;
    }

    // Extra: basic email format check
    if (id === 'email' && input.value.trim()) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(input.value.trim())) {
        input.classList.add('error');
        valid = false;
      }
    }
  });

  if (!valid) showToast('Please fill in all required fields');
  return valid;
}

/**
 * Fill the order summary panel in step 3.
 */
function populateOrderSummary() {
  const container = document.getElementById('checkout-order-summary');
  if (!container) return;

  const shippingCost = getSelectedShipping();
  const subtotal     = cartSubtotal();
  const total        = subtotal + shippingCost;

  const itemsHtml = cartItems.map(item => `
    <div class="order-summary-item">
      <span>${item.name} × ${item.quantity}</span>
      <span>$${(item.price * item.quantity).toFixed(2)}</span>
    </div>
  `).join('');

  container.innerHTML = `
    ${itemsHtml}
    <div class="order-summary-item">
      <span>Shipping</span>
      <span>${shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
    </div>
    <div class="order-summary-total">
      <span>Total</span>
      <span>$${total.toFixed(2)}</span>
    </div>
  `;
}

/**
 * Get the shipping cost based on the selected radio button.
 * @returns {number}
 */
function getSelectedShipping() {
  const selected = document.querySelector('input[name="shipping"]:checked');
  return selected && selected.value === 'express' ? 12 : 0;
}

/**
 * Simulate placing the order.
 * In a real app this would POST to a backend or payment API.
 */
function placeOrder() {
  // Generate a fake order number
  const orderNum = 'NOIR-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  document.getElementById('order-number').textContent = orderNum;

  // Advance to confirmation step
  checkoutStep = 4;
  updateCheckoutStepUI();
}

/**
 * Reset cart after successful order.
 */
function resetCart() {
  cartClear();
  closeCheckout();
  showToast('Thank you for your order!');
}


/* ════════════════════════════════════════════════════════════
   8. ACCORDION COMPONENT
   ════════════════════════════════════════════════════════════ */

/**
 * Toggle an accordion section open or closed.
 * @param {HTMLElement} triggerBtn - The clicked button
 */
function toggleAccordion(triggerBtn) {
  const expanded = triggerBtn.getAttribute('aria-expanded') === 'true';
  const body     = triggerBtn.nextElementSibling;
  const icon     = triggerBtn.querySelector('.accordion-icon');

  triggerBtn.setAttribute('aria-expanded', String(!expanded));
  body.hidden = expanded;
  icon.textContent = expanded ? '+' : '−';
}


/* ════════════════════════════════════════════════════════════
   9. TOAST NOTIFICATIONS
   ════════════════════════════════════════════════════════════ */

/**
 * Show a toast message for 2.5 seconds.
 * @param {string} message
 */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('visible');

  // Clear any existing hide timer
  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 2500);
}


/* ════════════════════════════════════════════════════════════
   10. PAYMENT INPUT FORMATTING
   ════════════════════════════════════════════════════════════ */

/**
 * Format card number input with spaces every 4 digits.
 * e.g. "1234567890123456" → "1234 5678 9012 3456"
 */
function formatCardNumber(input) {
  let value = input.value.replace(/\D/g, '').slice(0, 16);
  input.value = value.replace(/(.{4})/g, '$1 ').trim();
}

/**
 * Format card expiry input as MM / YY.
 */
function formatExpiry(input) {
  let value = input.value.replace(/\D/g, '').slice(0, 4);
  if (value.length >= 3) {
    input.value = value.slice(0, 2) + ' / ' + value.slice(2);
  } else {
    input.value = value;
  }
}


/* ════════════════════════════════════════════════════════════
   11. KEYBOARD & ACCESSIBILITY
   ════════════════════════════════════════════════════════════ */

document.addEventListener('keydown', (e) => {
  // Close cart on Escape
  if (e.key === 'Escape' && cartOpen) toggleCart();

  // Close checkout modal on Escape
  const checkoutOverlay = document.getElementById('checkout-overlay');
  if (e.key === 'Escape' && !checkoutOverlay.hidden) closeCheckout();
});


/* ════════════════════════════════════════════════════════════
   12. PAYMENT INPUT EVENT LISTENERS
   ════════════════════════════════════════════════════════════ */

// Attach formatting handlers after DOM ready (inputs may not exist yet)
document.addEventListener('DOMContentLoaded', () => {
  const cardNum    = document.getElementById('card-number');
  const cardExpiry = document.getElementById('card-expiry');

  if (cardNum)    cardNum.addEventListener('input',    () => formatCardNumber(cardNum));
  if (cardExpiry) cardExpiry.addEventListener('input', () => formatExpiry(cardExpiry));
});


/* ════════════════════════════════════════════════════════════
   13. INITIALISATION
   ════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Render products on initial load
  renderProducts();

  // Hero section is visible by default (controlled by CSS display)
  // Shop view is also rendered but hero overlays it visually on first load
  // (Both share the same scroll container; hero is full-height)
});

/**
 * Set the active search query and re-render the grid.
 * @param {string} query
 */
function searchProducts(query) {
  currentSearch = query.trim().toLowerCase();
  renderProducts();
}
