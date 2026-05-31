# NOIR — E-Commerce Portfolio Project

A production-quality e-commerce front-end built with **vanilla HTML, CSS, and JavaScript** — zero frameworks, zero dependencies.

Live demo: *(deploy to GitHub Pages or Netlify)*

---

## Features

| Feature | Details |
|---|---|
| **Product listing** | 12 products across 4 categories with category filtering and 4 sort options |
| **Product detail page** | Full description, quantity selector, materials accordion, image area |
| **Quick-add to cart** | Add products directly from the grid without visiting detail page |
| **Cart sidebar** | Slide-in cart with quantity controls, remove items, live subtotal |
| **Cart persistence** | Cart survives page refresh via `localStorage` |
| **Multi-step checkout** | 3 steps: Contact → Shipping → Payment with form validation |
| **Order confirmation** | Fake order number, reset flow |
| **Responsive design** | Works on mobile, tablet, and desktop |
| **Accessibility** | ARIA labels, keyboard navigation, focus management, live regions |
| **Animations** | Staggered card reveals, slide-in cart, toast notifications |

---

## Project Structure

```
ecommerce/
├── index.html          # All HTML views (SPA-style with JS routing)
├── css/
│   └── style.css       # All styles — custom properties, components, responsive
├── js/
│   ├── products.js     # Product data array (load first)
│   ├── cart.js         # Cart state management + localStorage persistence
│   └── app.js          # Main controller: routing, rendering, checkout, UI
└── README.md
```

---

## Getting Started

No build step required. Just open `index.html` in a browser.

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/noir-ecommerce.git
cd noir-ecommerce

# Open directly (macOS)
open index.html

# Or serve locally (recommended for development)
npx serve .
# then visit http://localhost:3000
```

---

## Deploying to GitHub Pages

1. Push to a GitHub repository
2. Go to **Settings → Pages**
3. Set source to **Deploy from a branch → main → / (root)**
4. Visit `https://YOUR_USERNAME.github.io/noir-ecommerce`

Or drag the folder into [Netlify Drop](https://app.netlify.com/drop) for an instant URL.

---

## Architecture Decisions

**Why vanilla JS?**
This project intentionally uses no frameworks to demonstrate core JavaScript fundamentals — DOM manipulation, event handling, state management, and browser APIs — which is what entry-level roles actually test.

**SPA-style routing without a router library**
Views are hidden/shown with CSS (`display: none` / `hidden` attribute). The `showView()` function in `app.js` manages transitions. No URL changes, no history API — keeping it simple and demonstrable.

**Separation of concerns**
Three JS files with clear responsibilities:
- `products.js` — pure data (no DOM access)
- `cart.js` — cart state + cart UI only
- `app.js` — everything else (routing, product UI, checkout, utility functions)

**CSS custom properties as a design system**
All colors, spacing, and typography defined in `:root` on `style.css`. Changing the look requires editing ~20 lines.

---

## What I Would Add Next

- [ ] Search / text filter
- [ ] Wishlist with localStorage persistence
- [ ] Product image carousel (multiple views per product)
- [ ] Real payment integration (Stripe.js)
- [ ] Backend API (Node/Express) for order storage
- [ ] Unit tests for cart logic (Jest)
- [ ] Colour/variant selector per product

---

## Tech Stack

- HTML5 (semantic elements, ARIA)
- CSS3 (custom properties, grid, flexbox, animations)
- Vanilla JavaScript (ES6+, localStorage)
- Google Fonts (Cormorant Garamond + DM Mono)

**No build tools. No bundlers. No node_modules.**

---

*Built as a portfolio project demonstrating front-end fundamentals.*
