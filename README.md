# Bianca Corner — متجر أزياء نسائية / Women's Fashion Store

**Live:** https://reeeham.github.io/biancacorner/ · **Repo:** https://github.com/Reeeham/biancacorner

A complete, self-contained e-commerce storefront for **Bianca Corner** — an Egyptian
women's fashion brand. Pure HTML/CSS/JS (no build step, no dependencies, no backend
required). Cart, wishlist, orders and admin data persist in the browser's
`localStorage`.

## Run it

Open `index.html` directly in a browser, or serve the folder:

```bash
cd biancacorner
python3 -m http.server 8080
# → http://localhost:8080
```

Deploy by uploading the folder to any static host (Netlify, Vercel, GitHub Pages,
cPanel `public_html`, …). No server-side code is needed.

## Design direction

The logo (black serif "Bianca" + letterspaced "CORNER" on ivory) drove a
**luxury-minimal** identity:

- **Palette** — ivory canvas `#F6F3EC`, ink `#161616`, bronze-gold accent `#A9885A`,
  blush `#E9D9CF`. Understated and feminine, matching "Bianca" (Italian for white).
- **Typography** — Playfair Display + Amiri for display headings (EN/AR),
  Jost + Tajawal for body text.
- **Imagery** — elegant illustrated SVG placeholders (gradient + garment line-art).
  Replace with real photography before launch (see below).
- **Arabic-first** — the store defaults to Egyptian Arabic with full RTL layout;
  an EN/عربي toggle in the header switches language and direction instantly.

## Pages

| Route | Page |
|---|---|
| `#/` | Home (announcement, hero, categories, best sellers, offer, promo, why-us, testimonials, Instagram, newsletter) |
| `#/shop` | All products + filters & sorting |
| `#/category/dresses` `tshirts` `jeans` `jackets` | Category pages |
| `#/product/:id` | Product details (gallery, size/color, size guide, reviews, related, recently viewed) |
| `#/cart` | Cart with coupons & free-shipping progress |
| `#/checkout` | Checkout — name, phone, WhatsApp, governorate, address, COD |
| `#/confirm` | Order confirmation |
| `#/auth` | Login / Register |
| `#/account` | Account: orders, profile, wishlist |
| `#/wishlist` | Wishlist |
| `#/track` | Order tracking (order no. + phone) |
| `#/about`, `#/contact` | About / Contact (validated form + honeypot) |
| `#/shipping`, `#/returns`, `#/privacy`, `#/terms`, `#/faq` | Policy & FAQ pages |
| `#/admin` | Admin panel (password in `data.js` → `STORE.adminPassword`) |

## Features

- 21 realistic sample products across 4 categories, bilingual names/descriptions
- Filters: category, size, color, price range, stock · Sort: newest, price, popularity, discount
- Coupons: `BIANCA10` (−10% over EGP 500), `WELCOME50`, `FREESHIP`
- 27 Egyptian governorates with per-region delivery fees & ETAs; free shipping ≥ EGP 3,000
- Cash on Delivery checkout (card/wallet shown as "coming soon" — not faked)
- WhatsApp: floating button, order-via-WhatsApp on product & cart (pre-filled cart text)
- Wishlist, recently viewed, quick view, size guide, customer reviews
- Customer accounts (local), order history & live status
- Order tracking page with status timeline
- Admin: dashboard stats, product price/stock editing, add/delete products, order status, CSV export
- SEO: semantic headings, meta tags, JSON-LD (store + per-product), descriptive alt text
- Egyptian phone validation (`01xxxxxxxxx`), full form validation, duplicate-submit guard

## Editing guide

All editable content lives in **`assets/js/data.js`** — no code knowledge needed:

| What | Where |
|---|---|
| WhatsApp / email / socials / free-shipping threshold / admin password | `STORE` object (top of `data.js`) |
| Products (name, price, old price, colors, sizes, stock, badges, description, care) | `PRODUCTS` array |
| Categories | `CATEGORIES` array |
| Governorates & delivery fees | `GOVERNORATES` array |
| Coupons | `COUPONS` object |
| Testimonials | `TESTIMONIALS` array |
| FAQ entries | `FAQS` array |
| UI wording (AR/EN) | `assets/js/i18n.js` |
| Colors, fonts, spacing | `assets/css/style.css` (`:root` variables) |
| Policies / About text | `pagePolicy()` / `pageAbout()` in `assets/js/app.js` |

**Product images** are generated placeholders. To use real photos: add an `img`
field to a product (e.g. `img: 'assets/img/products/d01.jpg'`) and update
`artSVG()` usage in `app.js` — or ask your developer to wire it in. Keep the
`art` colors for graceful fallback.

## ⚠️ Replace before launch

- `STORE.whatsapp` / `STORE.phoneDisplay` — currently `+20 100 000 0000` placeholder
- `STORE.email` — currently `hello@biancacorner.com`
- `STORE.adminPassword` — currently `bianca2024`
- All product photography (illustrated placeholders are in use)
- Sample product catalog, testimonials and reviews → real data
- Physical business address in footer/contact (currently "Cairo, Egypt")

## Launch checklist

- [ ] Real WhatsApp number + email set in `STORE`
- [ ] Admin password changed
- [ ] Real product photos & final catalog uploaded
- [ ] Policies reviewed by owner (delivery fees, return window)
- [ ] Test a full COD order end-to-end on mobile
- [ ] Test AR (RTL) and EN layouts
- [ ] Orders/CSV export verified in `#/admin`
- [ ] Optional: connect a real backend (Firebase/Supabase/Shopify) for shared
      inventory — the current build stores data per-browser
- [ ] Optional: add real payment gateway (Paymob/Fawry/Kashier) before enabling
      the card/wallet options in checkout
