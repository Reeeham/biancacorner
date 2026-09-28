/* ============================================================
   BIANCA CORNER — Storefront Application
   Vanilla JS SPA · localStorage persistence · AR/EN + RTL
   ============================================================ */
'use strict';

/* ================= STATE & UTILITIES ================= */

const DB = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem('bc_' + k)); return v === null || v === undefined ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('bc_' + k, JSON.stringify(v)); } catch (e) {} }
};

let lang      = DB.get('lang', 'ar');
let cart      = DB.get('cart', []);
let wishlist  = DB.get('wish', []);
let user      = DB.get('user', null);
let users     = DB.get('users', []);
let orders    = DB.get('orders', []);
let recent    = DB.get('recent', []);
let coupon    = DB.get('coupon', null);
let edits     = DB.get('edits', {});
let deleted   = DB.get('deleted', []);
let custom    = DB.get('custom', []);
let reviewsDb = DB.get('reviews', {});
let newsSubs  = DB.get('news', []);
let adminOk   = DB.get('adminOk', false);

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const t   = k  => (STR[lang] && STR[lang][k]) || STR.en[k] || k;
const tt  = (k, o) => { let s = t(k); Object.keys(o || {}).forEach(x => s = s.replace('{' + x + '}', o[x])); return s; };
const pick = o => (o && (o[lang] || o.en)) || '';
const fmt = n => new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', { maximumFractionDigits: 0 }).format(Math.round(n)) + ' ' + t('egp');
const qs  = (s, el) => (el || document).querySelector(s);
const qsa = (s, el) => Array.from((el || document).querySelectorAll(s));
const go  = h => { location.hash = h; };
const todayStr = () => new Date().toISOString();

function products() {
  const apply = p => Object.assign({}, p, edits[p.id] || {});
  return PRODUCTS.filter(p => !deleted.includes(p.id)).map(apply)
    .concat(custom.filter(p => !deleted.includes(p.id)).map(apply));
}
function findProduct(idOrSlug) { return products().find(p => p.id === idOrSlug || p.slug === idOrSlug); }
function catOf(p) { return CATEGORIES.find(c => c.slug === p.cat); }
function govOf(id) { return GOVERNORATES.find(g => g.id === id); }
function saveAll() {
  DB.set('lang', lang); DB.set('cart', cart); DB.set('wish', wishlist); DB.set('user', user);
  DB.set('users', users); DB.set('orders', orders); DB.set('recent', recent); DB.set('coupon', coupon);
  DB.set('edits', edits); DB.set('deleted', deleted); DB.set('custom', custom); DB.set('reviews', reviewsDb);
  DB.set('news', newsSubs); DB.set('adminOk', adminOk);
}
function discPct(p) { return p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0; }
function stockOf(p) { return Math.max(0, p.stock | 0); }

function toast(msg, isErr) {
  const root = qs('#toast-root');
  const el = document.createElement('div');
  el.className = 'toast' + (isErr ? ' err' : '');
  el.innerHTML = (isErr ? ICON.close : ICON.check) + '<span>' + esc(msg) + '</span>';
  root.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; setTimeout(() => el.remove(), 320); }, 2600);
}

/* ================= ICONS ================= */

const I = (p, fill) => '<svg viewBox="0 0 24 24" width="20" height="20" ' + (fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"') + '>' + p + '</svg>';
const ICON = {
  search:  I('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
  user:    I('<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>'),
  heart:   I('<path d="M12 20.5C6.5 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.2.9 4.3 2.4 1.1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-3.5 7.2-9 11.2z"/>'),
  heartF:  I('<path d="M12 20.5C6.5 16.5 3 13.3 3 9.3 3 6.4 5.2 4.5 7.7 4.5c1.7 0 3.2.9 4.3 2.4 1.1-1.5 2.6-2.4 4.3-2.4 2.5 0 4.7 1.9 4.7 4.8 0 4-3.5 7.2-9 11.2z" fill="currentColor" stroke="none"/>'),
  bag:     I('<path d="M6 8h12l-1.2 12.2a1 1 0 01-1 .8H8.2a1 1 0 01-1-.8L6 8z"/><path d="M9 10V6a3 3 0 016 0v4"/>'),
  menu:    I('<path d="M4 7h16M4 12h16M4 17h16"/>'),
  close:   I('<path d="M6 6l12 12M18 6L6 18"/>'),
  check:   I('<path d="M4 12.5l5 5L20 6.5"/>'),
  chevD:   I('<path d="M6 9l6 6 6-6"/>'),
  truck:   I('<path d="M1.5 7h12v10h-12z"/><path d="M13.5 10h4.2l3 3.4V17h-7.2"/><circle cx="6" cy="18.5" r="1.7"/><circle cx="17" cy="18.5" r="1.7"/>'),
  shield:  I('<path d="M12 2.5l8 3v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10v-6z"/><path d="M8.5 12l2.4 2.4 4.6-4.8"/>'),
  refresh: I('<path d="M21 12a9 9 0 11-2.6-6.3"/><path d="M21 3v6h-6"/>'),
  chat:    I('<path d="M21 11.5a8.5 8.5 0 01-8.5 8.5c-1.5 0-3-.4-4.2-1L3 20l1-5.3A8.5 8.5 0 1121 11.5z"/>'),
  cash:    I('<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M5.5 9.5h.01M18.5 14.5h.01"/>'),
  card:    I('<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>'),
  wallet:  I('<path d="M19 7H5a2 2 0 01-2-2 2 2 0 012-2h13v4"/><path d="M3 5v13a2 2 0 002 2h15a1 1 0 001-1V8a1 1 0 00-1-1"/><circle cx="16.5" cy="13.5" r="1"/>'),
  ruler:   I('<path d="M3 17l14-14 4 4L7 21z"/><path d="M8 16l1.5-1.5M11 13l1.5-1.5M14 10l1.5-1.5"/>'),
  mail:    I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'),
  phone:   I('<path d="M5 3h4l2 5-2.5 1.5a12 12 0 005.5 5.5L15.5 13l5 2v4a2 2 0 01-2 2A17 17 0 013 5a2 2 0 012-2z"/>'),
  pin:     I('<path d="M12 21s-7-6.1-7-11a7 7 0 0114 0c0 4.9-7 11-7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
  clock:   I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
  plus:    I('<path d="M12 5v14M5 12h14"/>'),
  minus:   I('<path d="M5 12h14"/>'),
  trash:   I('<path d="M4 7h16M9 7V4h6v3M6.5 7l.8 13h9.4l.8-13"/>'),
  box:     I('<path d="M3.5 8l8.5-4 8.5 4v8l-8.5 4-8.5-4z"/><path d="M3.5 8l8.5 4 8.5-4M12 12v8"/>'),
  edit:    I('<path d="M14 6l4 4L8 20H4v-4z"/><path d="M12 8l4 4"/>'),
  eye:     I('<path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>'),
  whatsapp: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2-1.42.25-.7.25-1.29.18-1.42-.08-.12-.28-.2-.58-.35M12.05 21.79h-.01a9.78 9.78 0 01-5-1.37l-.35-.21-3.72.98 1-3.63-.24-.37a9.77 9.77 0 01-1.5-5.22c0-5.4 4.4-9.8 9.82-9.8a9.75 9.75 0 019.8 9.81c0 5.4-4.4 9.8-9.79 9.8M20.4 3.6A11.76 11.76 0 0012.05 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.94L.06 24l6.3-1.65a11.9 11.9 0 005.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.48-8.4"/></svg>',
  instagram: I('<rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.4"/><circle cx="17.4" cy="6.6" r=".9" fill="currentColor" stroke="none"/>'),
  facebook: '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M13.5 21.5v-7.2h2.4l.4-2.9h-2.8V9.6c0-.85.28-1.4 1.65-1.4h1.35V5.6c-.65-.06-1.3-.1-1.95-.1-2 0-3.4 1.25-3.4 3.5v2.4H8.8v2.9h2.3v7.2z"/></svg>',
  star: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.4L12 17.4l-5.8 3 1.1-6.4L2.6 9.4l6.5-.9z"/></svg>'
};

function stars(rating) {
  let s = '';
  for (let i = 1; i <= 5; i++) s += '<span style="opacity:' + (i <= Math.round(rating) ? 1 : .28) + '">' + ICON.star + '</span>';
  return '<span class="stars">' + s + '</span>';
}

/* ================= PRODUCT ART (illustrated placeholders) ================= */

const SILH = {
  dresses: [
    'M108 78 Q150 60 192 78 L205 122 Q216 150 200 168 L222 330 Q150 358 78 330 L100 168 Q84 150 95 122 Z',
    'M150 78 L150 195',
    'M95 122 Q150 150 205 122'
  ],
  tshirts: [
    'M92 92 L122 70 Q150 88 178 70 L208 92 L236 142 L200 162 L194 132 L194 308 L106 308 L106 132 L100 162 L64 142 Z',
    'M122 70 Q150 92 178 70'
  ],
  jeans: [
    'M104 78 L196 78 L208 345 L162 345 L151 158 L140 345 L94 345 Z',
    'M104 102 L196 102',
    'M138 78 L146 100 L154 78'
  ],
  jackets: [
    'M96 92 L132 70 L150 88 L168 70 L204 92 L234 152 L202 168 L196 138 L196 312 L104 312 L104 138 L98 168 L66 152 Z',
    'M132 70 L150 118 L168 70',
    'M150 118 L150 312',
    'M118 200 L118 230 M182 200 L182 230'
  ]
};

function artSVG(colors, cat, seed) {
  seed = seed || 0;
  const c1 = colors[0], c2 = colors[1];
  const gid = 'g' + Math.random().toString(36).slice(2, 8);
  const paths = (SILH[cat] || SILH.dresses).map(d =>
    '<path d="' + d + '" fill="none" stroke="#161616" stroke-opacity=".5" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'
  ).join('');
  const arcs = [
    '<circle cx="' + (70 + seed * 30) + '" cy="' + (340 - seed * 20) + '" r="90" fill="none" stroke="#ffffff" stroke-opacity=".35" stroke-width="1.4"/>',
    '<circle cx="' + (240 - seed * 20) + '" cy="' + (60 + seed * 30) + '" r="60" fill="#ffffff" fill-opacity=".12"/>'
  ].join('');
  return '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" class="p-art">' +
    '<defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' +
    '<stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/>' +
    '</linearGradient></defs>' +
    '<rect width="300" height="400" fill="url(#' + gid + ')"/>' + arcs +
    '<g transform="translate(' + (seed * 6) + ',' + (seed * 4) + ')">' + paths + '</g>' +
    '<text x="150" y="382" text-anchor="middle" font-family="Jost,sans-serif" font-size="10" letter-spacing="4" fill="#161616" fill-opacity=".45">BIANCA CORNER</text>' +
    '</svg>';
}

function heroArt() {
  return '<svg viewBox="0 0 600 640" preserveAspectRatio="xMidYMid slice">' +
    '<circle cx="480" cy="120" r="150" fill="#f6f3ec" fill-opacity=".18"/>' +
    '<circle cx="90" cy="520" r="200" fill="none" stroke="#f6f3ec" stroke-opacity=".3" stroke-width="1.5"/>' +
    '<circle cx="120" cy="160" r="4" fill="#161616" opacity=".5"/>' +
    '<circle cx="170" cy="140" r="3" fill="#161616" opacity=".35"/>' +
    '<g transform="translate(150,90) scale(1.55)">' +
    SILH.dresses.map(d => '<path d="' + d + '" fill="none" stroke="#161616" stroke-opacity=".75" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"/>').join('') +
    '</g>' +
    '<path d="M60 470 Q300 380 540 440" fill="none" stroke="#161616" stroke-width="2" stroke-opacity=".55"/>' +
    '</svg>';
}

/* ================= LAYOUT ================= */

function logoHTML() {
  return '<a href="#/" class="logo" aria-label="Bianca Corner">' +
    '<span class="logo-text"><span class="logo-name">Bianca</span><span class="logo-sub">CORNER</span></span></a>';
}

function waLink(text) {
  return 'https://wa.me/' + STORE.whatsapp + (text ? '?text=' + encodeURIComponent(text) : '');
}

function layout(content, activeNav) {
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const waMsg = lang === 'ar' ? 'مرحبًا بيانكا كورنر، أحتاج مساعدة' : 'Hi Bianca Corner, I need help';
  return '' +
  '<div class="announce">' + esc(t('announce')) + '</div>' +
  '<header class="site-header"><div class="container">' +
    '<div class="header-inner">' +
      '<button class="burger" id="burger" aria-label="menu">' + ICON.menu + '</button>' +
      logoHTML() +
      '<nav class="main-nav">' +
        navLink('#/', t('nav_home'), activeNav === 'home') +
        navLink('#/shop', t('nav_shop'), activeNav === 'shop') +
        CATEGORIES.map(c => navLink('#/category/' + c.slug, pick(c.name), activeNav === c.slug)).join('') +
        navLink('#/about', t('nav_about'), activeNav === 'about') +
        navLink('#/contact', t('nav_contact'), activeNav === 'contact') +
      '</nav>' +
      '<div class="header-actions">' +
        '<button class="lang-toggle" id="langBtn">' + t('lang_btn') + '</button>' +
        '<button class="icon-btn" id="searchBtn" aria-label="search">' + ICON.search + '</button>' +
        '<a class="icon-btn" href="#/' + (user ? 'account' : 'auth') + '" aria-label="account">' + ICON.user + '</a>' +
        '<a class="icon-btn" href="#/wishlist" aria-label="wishlist">' + ICON.heart +
          (wishlist.length ? '<span class="badge-dot">' + wishlist.length + '</span>' : '') + '</a>' +
        '<a class="icon-btn" href="#/cart" aria-label="cart">' + ICON.bag +
          (cartCount ? '<span class="badge-dot">' + cartCount + '</span>' : '') + '</a>' +
      '</div>' +
    '</div>' +
    '<div class="search-bar hidden" id="searchBar"><div class="search-box">' +
      '<input id="searchInput" placeholder="' + esc(t('search_placeholder')) + '" autocomplete="off">' +
      '<button class="btn btn-primary btn-sm" id="searchGo" aria-label="search">' + ICON.search + '</button>' +
    '</div></div>' +
  '</div></header>' +

  '<div class="drawer-overlay" id="drawerOv"></div>' +
  '<aside class="drawer" id="drawer">' +
    '<div class="drawer-head"><b>' + esc(t('menu')) + '</b><button id="drawerClose" class="icon-btn">' + ICON.close + '</button></div>' +
    '<a href="#/">' + esc(t('nav_home')) + '</a>' +
    '<a href="#/shop">' + esc(t('nav_shop')) + '</a>' +
    CATEGORIES.map(c => '<a href="#/category/' + c.slug + '">' + esc(pick(c.name)) + '</a>').join('') +
    '<a href="#/wishlist">' + esc(t('wishlist')) + '</a>' +
    '<a href="#/track">' + esc(t('track_order')) + '</a>' +
    '<a href="#/account">' + esc(t('account')) + '</a>' +
    '<a href="#/about">' + esc(t('nav_about')) + '</a>' +
    '<a href="#/contact">' + esc(t('nav_contact')) + '</a>' +
    '<a href="#/faq">' + esc(t('f_faq')) + '</a>' +
  '</aside>' +

  '<main id="page">' + content + '</main>' +

  '<a class="wa-float" href="' + waLink(waMsg) + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICON.whatsapp + '</a>' +

  '<footer class="site-footer"><div class="container">' +
    '<div class="footer-grid">' +
      '<div><div class="f-logo">Bianca<span>CORNER</span></div>' +
        '<p class="f-about">' + esc(t('footer_about')) + '</p>' +
        '<div class="f-social">' +
          '<a href="' + STORE.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">' + ICON.instagram + '</a>' +
          '<a href="' + STORE.facebook + '" target="_blank" rel="noopener" aria-label="Facebook">' + ICON.facebook + '</a>' +
          '<a href="' + waLink() + '" target="_blank" rel="noopener" aria-label="WhatsApp">' + ICON.whatsapp + '</a>' +
        '</div></div>' +
      '<div class="f-col"><h4>' + esc(t('footer_shop')) + '</h4>' +
        '<a href="#/shop">' + esc(t('nav_shop')) + '</a>' +
        CATEGORIES.map(c => '<a href="#/category/' + c.slug + '">' + esc(pick(c.name)) + '</a>').join('') +
        '<a href="#/wishlist">' + esc(t('f_wishlist')) + '</a>' +
        '<a href="#/account">' + esc(t('f_account')) + '</a></div>' +
      '<div class="f-col"><h4>' + esc(t('footer_help')) + '</h4>' +
        '<a href="#/shipping">' + esc(t('f_shipping')) + '</a>' +
        '<a href="#/returns">' + esc(t('f_returns')) + '</a>' +
        '<a href="#/faq">' + esc(t('f_faq')) + '</a>' +
        '<a href="#/track">' + esc(t('f_track')) + '</a>' +
        '<a href="#/privacy">' + esc(t('f_privacy')) + '</a>' +
        '<a href="#/terms">' + esc(t('f_terms')) + '</a></div>' +
      '<div class="f-col"><h4>' + esc(t('footer_contact')) + '</h4>' +
        '<ul class="f-contact">' +
          '<li>' + ICON.phone + '<a href="tel:' + STORE.whatsapp + '" dir="ltr">' + esc(STORE.phoneDisplay) + '</a></li>' +
          '<li>' + ICON.whatsapp + '<a href="' + waLink() + '" target="_blank" rel="noopener">WhatsApp</a></li>' +
          '<li>' + ICON.mail + '<a href="mailto:' + STORE.email + '">' + esc(STORE.email) + '</a></li>' +
          '<li>' + ICON.pin + '<span>' + (lang === 'ar' ? 'القاهرة، مصر — شحن لكل المحافظات' : 'Cairo, Egypt — nationwide shipping') + '</span></li>' +
        '</ul>' +
        '<h4 style="margin-top:1.4rem">' + esc(t('payment_title')) + '</h4>' +
        '<div class="f-pay"><span>' + esc(t('payment_cod')) + '</span><span>' + esc(t('payment_soon')) + '</span></div>' +
      '</div>' +
    '</div>' +
    '<div class="footer-bottom">' +
      '<span>© ' + new Date().getFullYear() + ' Bianca Corner — ' + esc(t('rights')) + '</span>' +
      '<span><a href="#/admin">' + esc(t('admin_t')) + '</a></span>' +
    '</div>' +
  '</div></footer>';
}
function navLink(href, label, active) { return '<a href="' + href + '"' + (active ? ' class="active"' : '') + '>' + esc(label) + '</a>'; }

function bindChrome() {
  const burger = qs('#burger'), drawer = qs('#drawer'), ov = qs('#drawerOv');
  if (burger) burger.onclick = () => { drawer.classList.add('open'); ov.classList.add('open'); };
  const closeD = () => { drawer.classList.remove('open'); ov.classList.remove('open'); };
  if (qs('#drawerClose')) qs('#drawerClose').onclick = closeD;
  if (ov) ov.onclick = closeD;
  qsa('.drawer a').forEach(a => a.addEventListener('click', closeD));

  qs('#langBtn').onclick = () => {
    lang = lang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    saveAll(); render();
  };
  qs('#searchBtn').onclick = () => {
    const bar = qs('#searchBar'); bar.classList.toggle('hidden');
    if (!bar.classList.contains('hidden')) qs('#searchInput').focus();
  };
  const doSearch = () => { const q = qs('#searchInput').value.trim(); if (q) go('/search?q=' + encodeURIComponent(q)); };
  qs('#searchGo').onclick = doSearch;
  qs('#searchInput').addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });
}

/* ================= PRODUCT CARD ================= */

function badgeHTML(p) {
  const out = [];
  if (p.badges.includes('sale') && discPct(p) > 0) out.push('<span class="p-badge sale">-' + discPct(p) + '%</span>');
  if (p.badges.includes('new')) out.push('<span class="p-badge new">' + t('new_badge') + '</span>');
  if (p.badges.includes('bestseller')) out.push('<span class="p-badge">' + t('bestseller_badge') + '</span>');
  if (p.badges.includes('limited') || (stockOf(p) > 0 && stockOf(p) <= 6)) out.push('<span class="p-badge limited">' + t('limited_badge') + '</span>');
  return out.slice(0, 2).join('');
}

function productCard(p) {
  const wished = wishlist.includes(p.id);
  const out = stockOf(p) <= 0;
  return '<div class="p-card" data-id="' + p.id + '">' +
    '<a class="p-media" href="#/product/' + p.id + '">' + artSVG(p.art, p.cat) +
      '<div class="p-badges">' + badgeHTML(p) + '</div></a>' +
    '<div class="p-actions">' +
      '<button class="btn btn-primary act-cart" data-id="' + p.id + '"' + (out ? ' disabled' : '') + '>' + esc(out ? t('out_stock') : t('add_to_cart')) + '</button>' +
      '<button class="btn btn-outline act-qv" data-id="' + p.id + '" style="background:var(--paper)">' + esc(t('quick_view')) + '</button>' +
      '<button class="p-wish act-wish' + (wished ? ' active' : '') + '" data-id="' + p.id + '">' + (wished ? ICON.heartF : ICON.heart) + '</button>' +
    '</div>' +
    '<div class="p-info">' +
      '<span class="p-cat">' + esc(pick(catOf(p).name)) + '</span>' +
      '<a class="p-name" href="#/product/' + p.id + '">' + esc(pick(p.name)) + '</a>' +
      '<div class="p-rating">' + stars(p.rating) + ' <span>(' + p.reviewsCount + ')</span></div>' +
      '<div class="p-price"><span class="price">' + fmt(p.price) + '</span>' +
        (p.oldPrice ? '<span class="price-old">' + fmt(p.oldPrice) + '</span><span class="price-off">-' + discPct(p) + '%</span>' : '') +
      '</div>' +
      '<div class="p-dots">' + p.colors.slice(0, 5).map(c => '<span class="p-dot" title="' + esc(pick(COLORS[c])) + '" style="background:' + COLORS[c].hex + '"></span>').join('') + '</div>' +
    '</div></div>';
}

function bindProductCards(root) {
  qsa('.act-cart', root).forEach(b => b.onclick = e => {
    e.preventDefault();
    const p = findProduct(b.dataset.id);
    if (!p || stockOf(p) <= 0) return;
    openQuickView(p, true);
  });
  qsa('.act-qv', root).forEach(b => b.onclick = e => { e.preventDefault(); openQuickView(findProduct(b.dataset.id)); });
  qsa('.act-wish', root).forEach(b => b.onclick = e => {
    e.preventDefault();
    toggleWish(b.dataset.id);
    b.classList.toggle('active', wishlist.includes(b.dataset.id));
    b.innerHTML = wishlist.includes(b.dataset.id) ? ICON.heartF : ICON.heart;
    updateHeaderBadges();
  });
}

function toggleWish(id) {
  if (wishlist.includes(id)) { wishlist = wishlist.filter(x => x !== id); toast(t('removed_wish')); }
  else { wishlist.push(id); toast(t('added_wish')); }
  saveAll();
}
function updateHeaderBadges() {
  const n = qs('a[href="#/cart"] .badge-dot'), w = qs('a[href="#/wishlist"] .badge-dot');
  const cc = cart.reduce((s, i) => s + i.qty, 0);
  if (n) n.textContent = cc; else if (cc) qs('a[href="#/cart"]').insertAdjacentHTML('beforeend', '<span class="badge-dot">' + cc + '</span>');
  if (w) { if (wishlist.length) w.textContent = wishlist.length; else w.remove(); }
  else if (wishlist.length) qs('a[href="#/wishlist"]').insertAdjacentHTML('beforeend', '<span class="badge-dot">' + wishlist.length + '</span>');
}

/* ================= CART LOGIC ================= */

function addToCart(id, size, color, qty) {
  const key = cart.findIndex(i => i.id === id && i.size === size && i.color === color);
  if (key > -1) cart[key].qty = Math.min(10, cart[key].qty + qty);
  else cart.push({ id, size, color, qty });
  saveAll(); toast(t('added_cart')); updateHeaderBadges();
}
function cartLines() {
  return cart.map(i => ({ ...i, p: findProduct(i.id) })).filter(i => i.p);
}
function cartTotals(govId) {
  const lines = cartLines();
  const subtotal = lines.reduce((s, l) => s + l.p.price * l.qty, 0);
  let discount = 0, shipFree = subtotal >= STORE.freeShippingOver;
  if (coupon && COUPONS[coupon]) {
    const c = COUPONS[coupon];
    if (subtotal >= c.min) {
      if (c.type === 'percent') discount = subtotal * c.value / 100;
      else if (c.type === 'fixed') discount = Math.min(c.value, subtotal);
      else if (c.type === 'ship') shipFree = true;
    }
  }
  const gov = govId ? govOf(govId) : null;
  const shipFee = lines.length === 0 ? 0 : (shipFree ? 0 : (gov ? gov.fee : 70));
  return { lines, subtotal, discount, shipFee, shipFree, total: subtotal - discount + shipFee, gov };
}

/* ================= MODAL ================= */

function openModal(html, wide) {
  const root = qs('#modal-root');
  root.innerHTML = '<div class="modal-overlay open"><div class="modal" style="max-width:' + (wide ? '900px' : '780px') + '">' +
    '<button class="modal-close" id="mClose">' + ICON.close + '</button>' + html + '</div></div>';
  const close = () => { qs('.modal-overlay').classList.remove('open'); setTimeout(() => root.innerHTML = '', 260); };
  qs('#mClose').onclick = close;
  qs('.modal-overlay').addEventListener('click', e => { if (e.target.classList.contains('modal-overlay')) close(); });
  return close;
}

function openQuickView(p, focusSize) {
  if (!p) return;
  let size = p.sizes.length === 1 ? p.sizes[0] : null;
  let color = p.colors.length === 1 ? p.colors[0] : null;
  const html = '<div class="qv-grid">' +
    '<div class="qv-img">' + artSVG(p.art, p.cat) + '</div>' +
    '<div>' +
      '<span class="p-cat">' + esc(pick(catOf(p).name)) + '</span>' +
      '<h2 style="font-size:1.35rem;margin:.3rem 0 .6rem">' + esc(pick(p.name)) + '</h2>' +
      '<div class="p-rating">' + stars(p.rating) + '<span>(' + p.reviewsCount + ')</span></div>' +
      '<div class="pd-price"><span class="price">' + fmt(p.price) + '</span>' +
        (p.oldPrice ? '<span class="price-old">' + fmt(p.oldPrice) + '</span>' : '') + '</div>' +
      '<div class="opt-label">' + esc(t('select_color')) + '</div>' +
      '<div class="swatches">' + p.colors.map(c =>
        '<button class="swatch' + (color === c ? ' active' : '') + '" data-c="' + c + '" title="' + esc(pick(COLORS[c])) + '" style="background:' + COLORS[c].hex + '"></button>').join('') + '</div>' +
      '<div class="opt-err" id="qvCErr"></div>' +
      '<div class="opt-label">' + esc(t('select_size')) + '</div>' +
      '<div class="size-row">' + p.sizes.map(s => '<button class="size-chip' + (size === s ? ' active' : '') + '" data-s="' + s + '">' + s + '</button>').join('') + '</div>' +
      '<div class="opt-err" id="qvSErr"></div>' +
      '<div style="display:flex;gap:.6rem;margin-top:1rem">' +
        '<button class="btn btn-primary btn-block" id="qvAdd"' + (stockOf(p) <= 0 ? ' disabled' : '') + '>' + esc(t('add_to_cart')) + '</button>' +
        '<a class="btn btn-outline" href="#/product/' + p.id + '">' + (lang === 'ar' ? 'التفاصيل' : 'Details') + '</a>' +
      '</div></div></div>';
  const close = openModal(html);
  const mv = qs('.modal');
  qsa('.swatch', mv).forEach(b => b.onclick = () => { color = b.dataset.c; qsa('.swatch', mv).forEach(x => x.classList.toggle('active', x === b)); qs('#qvCErr').textContent = ''; });
  qsa('.size-chip', mv).forEach(b => b.onclick = () => { size = b.dataset.s; qsa('.size-chip', mv).forEach(x => x.classList.toggle('active', x === b)); qs('#qvSErr').textContent = ''; });
  qs('#qvAdd').onclick = () => {
    if (!color) { qs('#qvCErr').textContent = t('err_color'); return; }
    if (!size) { qs('#qvSErr').textContent = t('err_size'); return; }
    addToCart(p.id, size, color, 1); close();
  };
}

function openSizeGuide(cat) {
  const chart = cat === 'jeans' ? SIZE_CHART.jeans : SIZE_CHART.clothes;
  const html = '<div style="padding:0 1.8rem 1.8rem"><h2 style="margin-bottom:1rem">' + esc(t('size_guide')) + '</h2>' +
    '<table class="size-table"><tr>' + pick(chart.head).map(h => '<th>' + esc(h) + '</th>').join('') + '</tr>' +
    chart.rows.map(r => '<tr>' + r.map(c => '<td>' + c + '</td>').join('') + '</tr>').join('') + '</table>' +
    '<p class="muted" style="font-size:.85rem">' + (lang === 'ar'
      ? 'إذا كنتِ بين مقاسين، ننصح باختيار المقاس الأكبر. لأي استفسار راسلينا على واتساب.'
      : 'Between sizes? We recommend sizing up. Questions? Message us on WhatsApp.') + '</p></div>';
  openModal(html);
}

/* ================= PAGES ================= */

function pageHead(title, sub, crumbs) {
  return '<div class="page-head"><div class="container">' +
    '<div class="crumbs"><a href="#/">' + esc(t('nav_home')) + '</a> ' + (crumbs || []).map(c => '<span>/</span> ' + c).join(' ') + '</div>' +
    '<h1>' + esc(title) + '</h1>' + (sub ? '<p class="sub">' + esc(sub) + '</p>' : '') +
    '</div></div>';
}

/* ---------- HOME ---------- */
function pageHome() {
  const all = products();
  const best = all.filter(p => p.badges.includes('bestseller')).slice(0, 4);
  const fresh = all.filter(p => p.badges.includes('new')).slice(0, 4);

  let html = '<section class="hero">' +
    '<div class="hero-copy">' +
      '<span class="kicker">' + esc(t('hero_kicker')) + '</span>' +
      '<h1>' + esc(t('hero_title')) + '</h1>' +
      '<p>' + esc(t('hero_sub')) + '</p>' +
      '<div class="hero-ctas"><a class="btn btn-primary btn-lg" href="#/shop">' + esc(t('hero_cta')) + '</a>' +
      '<a class="btn btn-outline btn-lg" href="#/shop?sort=new">' + esc(t('hero_cta2')) + '</a></div>' +
    '</div>' +
    '<div class="hero-art">' + heroArt() +
      '<div class="hero-tag"><b>' + (lang === 'ar' ? 'تشكيلة الموسم الجديدة' : 'New Season Edit') + '</b>' +
      '<span>' + (lang === 'ar' ? 'فساتين · جينز · جاكيتات' : 'Dresses · Denim · Jackets') + '</span></div>' +
    '</div></section>';

  html += '<section class="section"><div class="container">' +
    '<div class="sec-head"><div><h2>' + esc(t('featured_cats')) + '</h2><p class="sub">' + esc(t('featured_cats_sub')) + '</p></div></div>' +
    '<div class="cat-grid">' + CATEGORIES.map(c =>
      '<a class="cat-card" href="#/category/' + c.slug + '"><div class="cat-art">' + artSVG(c.art, c.slug) + '</div>' +
      '<div class="cat-label"><b>' + esc(pick(c.name)) + '</b><span>' + esc(pick(c.tagline)) + '</span></div></a>').join('') +
    '</div></div></section>';

  html += '<section class="section alt"><div class="container">' +
    '<div class="sec-head"><div><h2>' + esc(t('bestsellers')) + '</h2><p class="sub">' + esc(t('bestsellers_sub')) + '</p></div>' +
    '<a class="view-all" href="#/shop?sort=popular">' + esc(t('view_all')) + '</a></div>' +
    '<div class="prod-grid">' + best.map(productCard).join('') + '</div></div></section>';

  html += '<section class="section"><div class="container">' +
    '<div class="offer-band"><div>' +
      '<span class="kicker">' + esc(t('offer_kicker')) + '</span>' +
      '<h2>' + esc(t('offer_title')) + '</h2><p>' + esc(t('offer_sub')) + '</p>' +
      '<button class="coupon-chip" id="copyCoupon">BIANCA10 <span style="opacity:.6">⧉</span></button>' +
    '</div><a class="btn btn-gold btn-lg" href="#/shop">' + esc(t('offer_cta')) + '</a></div>' +
  '</div></section>';

  html += '<section class="section" style="padding-top:0"><div class="container">' +
    '<div class="sec-head"><div><h2>' + esc(t('new_arrivals')) + '</h2><p class="sub">' + esc(t('new_arrivals_sub')) + '</p></div>' +
    '<a class="view-all" href="#/shop?sort=new">' + esc(t('view_all')) + '</a></div>' +
    '<div class="prod-grid">' + fresh.map(productCard).join('') + '</div></div></section>';

  html += '<section class="section alt" style="padding-top:0"><div class="container"><div class="section">' +
    '<div class="promo"><div class="promo-copy"><h2>' + esc(t('promo_title')) + '</h2><p>' + esc(t('promo_sub')) + '</p>' +
    '<a class="btn btn-primary" href="#/shop">' + esc(t('hero_cta')) + '</a></div></div>' +
    '</div></div></section>';

  const whyIco = [ICON.cash, ICON.truck, ICON.refresh, ICON.chat];
  html += '<section class="section"><div class="container">' +
    '<div class="sec-head"><div><h2>' + esc(t('why_title')) + '</h2></div></div>' +
    '<div class="why-grid">' + [1, 2, 3, 4].map(i =>
      '<div class="why-card"><div class="why-ico">' + whyIco[i - 1] + '</div>' +
      '<h3>' + esc(t('why' + i + '_t')) + '</h3><p>' + esc(t('why' + i + '_d')) + '</p></div>').join('') +
    '</div></div></section>';

  html += '<section class="section alt"><div class="container">' +
    '<div class="sec-head"><div><h2>' + esc(t('testimonials_t')) + '</h2><p class="sub">' + esc(t('testimonials_sub')) + '</p></div></div>' +
    '<div class="testi-grid">' + TESTIMONIALS.map(tm =>
      '<div class="testi">' + stars(tm.rating) + '<p class="quote">"' + esc(tm.text) + '"</p>' +
      '<div class="who"><b>' + esc(tm.name) + '</b>' + esc(tm.city) + '</div></div>').join('') +
    '</div></div></section>';

  html += '<section class="section"><div class="container text-center">' +
    '<h2>' + esc(t('insta_t')) + '</h2><p class="muted">' + esc(t('insta_sub')) + '</p>' +
    '<div class="insta-grid">' + all.slice(0, 6).map((p, i) =>
      '<a class="insta-cell" href="' + STORE.instagram + '" target="_blank" rel="noopener">' + artSVG(p.art, p.cat, i % 3) + '</a>').join('') + '</div>' +
    '<a class="btn btn-outline mt-1" href="' + STORE.instagram + '" target="_blank" rel="noopener">' + esc(t('insta_cta')) + ' @biancacorner42</a>' +
    '</div></section>';

  html += '<section class="section alt"><div class="container"><div class="newsletter">' +
    '<h2>' + esc(t('news_t')) + '</h2><p>' + esc(t('news_sub')) + '</p>' +
    '<form class="news-form" id="newsForm"><input type="email" id="newsEmail" placeholder="' + esc(t('news_placeholder')) + '">' +
    '<button class="btn btn-primary" type="submit">' + esc(t('news_btn')) + '</button></form>' +
    '</div></div></section>';

  render(layout(html, 'home'), 'Bianca Corner — ' + t('nav_home'));
  bindProductCards(qs('#page'));
  qs('#copyCoupon').onclick = () => { navigator.clipboard && navigator.clipboard.writeText('BIANCA10'); toast(t('copied') + ': BIANCA10'); };
  qs('#newsForm').onsubmit = e => {
    e.preventDefault();
    const v = qs('#newsEmail').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { toast(t('news_err'), true); return; }
    if (!newsSubs.includes(v)) newsSubs.push(v); saveAll();
    qs('#newsEmail').value = ''; toast(t('news_ok'));
  };
}

/* ---------- SHOP / CATEGORY / SEARCH ---------- */

let shopState = { cat: null, q: '', sort: 'new', sizes: [], colors: [], cats: [], maxPrice: 0, minPrice: 0, inStock: false };

function applyFilters() {
  let list = products();
  if (shopState.cat) list = list.filter(p => p.cat === shopState.cat);
  if (shopState.cats.length) list = list.filter(p => shopState.cats.includes(p.cat));
  if (shopState.q) {
    const q = shopState.q.toLowerCase();
    list = list.filter(p => (p.name.ar + ' ' + p.name.en + ' ' + pick(catOf(p).name) + ' ' + pick(p.desc)).toLowerCase().includes(q));
  }
  if (shopState.sizes.length) list = list.filter(p => p.sizes.some(s => shopState.sizes.includes(s)));
  if (shopState.colors.length) list = list.filter(p => p.colors.some(c => shopState.colors.includes(c)));
  if (shopState.minPrice) list = list.filter(p => p.price >= shopState.minPrice);
  if (shopState.maxPrice) list = list.filter(p => p.price <= shopState.maxPrice);
  if (shopState.inStock) list = list.filter(p => stockOf(p) > 0);
  switch (shopState.sort) {
    case 'price_low':  list.sort((a, b) => a.price - b.price); break;
    case 'price_high': list.sort((a, b) => b.price - a.price); break;
    case 'popular':    list.sort((a, b) => b.reviewsCount - a.reviewsCount); break;
    case 'discount':   list.sort((a, b) => discPct(b) - discPct(a)); break;
    default:           list.sort((a, b) => (b.badges.includes('new') ? 1 : 0) - (a.badges.includes('new') ? 1 : 0));
  }
  return list;
}

function allSizes() {
  const s = new Set(); products().forEach(p => p.sizes.forEach(x => s.add(x)));
  const letter = ['XS','S','M','L','XL','XXL'].filter(x => s.has(x));
  const num = Array.from(s).filter(x => /^\d+$/.test(x)).sort((a, b) => a - b);
  return letter.concat(num);
}
function allColors() {
  const s = new Set(); products().forEach(p => p.colors.forEach(c => s.add(c))); return Array.from(s);
}

function pageShop(catSlug, q, sort) {
  shopState = { cat: catSlug || null, q: q || '', sort: sort || 'new', sizes: [], colors: [], cats: [], minPrice: 0, maxPrice: 0, inStock: false };
  renderShop();
}
function renderShop() {
  const cat = shopState.cat ? CATEGORIES.find(c => c.slug === shopState.cat) : null;
  const list = applyFilters();
  const title = shopState.q ? t('search_results') + ' "' + shopState.q + '"' : (cat ? pick(cat.name) : t('shop_title'));
  const sub = cat ? pick(cat.desc) : (shopState.q ? list.length + ' ' + t('results') : (lang === 'ar' ? 'كل قطع التشكيلة في مكان واحد' : 'The whole collection in one place'));

  const sortOpts = [['new', t('sort_new')], ['popular', t('sort_popular')], ['price_low', t('sort_price_low')], ['price_high', t('sort_price_high')], ['discount', t('sort_discount')]];

  const filtersHTML = '<div class="filters" id="filters">' +
    (!shopState.cat ? '<h3>' + esc(t('f_category')) + '</h3>' + CATEGORIES.map(c =>
      '<label class="f-opt"><input type="checkbox" class="f-cat" value="' + c.slug + '"' + (shopState.cats.includes(c.slug) ? ' checked' : '') + '> ' + esc(pick(c.name)) + '</label>').join('') : '') +
    '<h3>' + esc(t('f_size')) + '</h3>' + allSizes().map(s =>
      '<label class="f-opt"><input type="checkbox" class="f-size" value="' + s + '"' + (shopState.sizes.includes(s) ? ' checked' : '') + '> ' + s + '</label>').join('') +
    '<h3>' + esc(t('f_color')) + '</h3><div style="display:grid;grid-template-columns:1fr 1fr;gap:0 .5rem">' + allColors().map(c =>
      '<label class="f-opt"><input type="checkbox" class="f-color" value="' + c + '"' + (shopState.colors.includes(c) ? ' checked' : '') + '><span class="swatch" style="background:' + COLORS[c].hex + '"></span>' + esc(pick(COLORS[c])) + '</label>').join('') + '</div>' +
    '<h3>' + esc(t('f_price')) + '</h3><div class="price-range">' +
      '<input type="number" id="fMin" placeholder="' + esc(t('price_from')) + '" value="' + (shopState.minPrice || '') + '">' +
      '<input type="number" id="fMax" placeholder="' + esc(t('price_to')) + '" value="' + (shopState.maxPrice || '') + '"></div>' +
    '<h3>' + esc(t('f_avail')) + '</h3><label class="f-opt"><input type="checkbox" id="fStock"' + (shopState.inStock ? ' checked' : '') + '> ' + esc(t('in_stock_f')) + '</label>' +
    '<div style="display:flex;gap:.5rem;margin-top:1.2rem"><button class="btn btn-primary btn-sm btn-block" id="fApply">' + esc(t('apply')) + '</button>' +
    '<button class="btn btn-ghost btn-sm" id="fClear">' + esc(t('clear')) + '</button></div></div>';

  const gridHTML = list.length
    ? '<div class="prod-grid" style="grid-template-columns:repeat(3,1fr)">' + list.map(productCard).join('') + '</div>'
    : '<div class="empty-state"><div class="big">◇</div><h3>' + esc(t('empty_title')) + '</h3><p>' + esc(t('empty_sub')) + '</p>' +
      '<a class="btn btn-primary" href="#/shop">' + esc(t('nav_shop')) + '</a></div>';

  const html = pageHead(title, sub, cat ? ['<a href="#/shop">' + esc(t('nav_shop')) + '</a>', esc(pick(cat.name))] : (shopState.q ? [] : [esc(t('nav_shop'))])) +
    '<div class="container"><div class="shop-layout">' + filtersHTML +
    '<div><div class="shop-toolbar">' +
      '<span class="count">' + list.length + ' ' + esc(t('results')) + '</span>' +
      '<div class="toolbar-right"><button class="btn btn-outline btn-sm filter-toggle" id="fToggle">' + esc(t('filter')) + '</button>' +
      '<select class="sort-sel" id="sortSel">' + sortOpts.map(o => '<option value="' + o[0] + '"' + (shopState.sort === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>').join('') + '</select></div>' +
    '</div>' + gridHTML + '</div></div></div>';

  render(layout(html, cat ? cat.slug : 'shop'), title);
  bindShopEvents();
}
function bindShopEvents() {
  const readFilters = () => {
    shopState.cats = qsa('.f-cat:checked').map(x => x.value);
    shopState.sizes = qsa('.f-size:checked').map(x => x.value);
    shopState.colors = qsa('.f-color:checked').map(x => x.value);
    shopState.minPrice = parseFloat(qs('#fMin').value) || 0;
    shopState.maxPrice = parseFloat(qs('#fMax').value) || 0;
    shopState.inStock = qs('#fStock').checked;
  };
  qs('#fApply').onclick = () => { readFilters(); renderShop(); };
  qs('#fClear').onclick = () => { const keep = shopState.cat; const q = shopState.q; pageShop(keep, q); };
  qs('#sortSel').onchange = e => { shopState.sort = e.target.value; renderShop(); };
  const ft = qs('#fToggle'); if (ft) ft.onclick = () => qs('#filters').classList.toggle('open');
  qsa('.f-size, .f-color, .f-cat').forEach(c => c.onchange = () => { readFilters(); renderShop(); });
  bindProductCards(qs('#page'));
}

/* ---------- PRODUCT DETAILS ---------- */
const REVIEW_POOL = [
  { name: 'رنا', rating: 5, ar: 'الخامة ممتازة والمقاس مظبوط على جدول المقاسات بالظبط. التوصيل وصل بسرعة.', en: 'Excellent fabric and the size matches the chart exactly. Fast delivery too.' },
  { name: 'دينا', rating: 5, ar: 'اللون في الحقيقة أحلى من الصور. تغليف شيك وخدمة عملاء محترمة.', en: 'The color is even nicer in person. Chic packaging and courteous service.' },
  { name: 'هبة', rating: 4, ar: 'جودة كويسة جدًا على السعر. التوصيل اتأخر يوم بس المنتج يستاهل.', en: 'Very good quality for the price. Delivery ran a day late but worth it.' },
  { name: 'منى', rating: 5, ar: 'ثاني مرة أطلب من بيانكا كورنر — القصّة مريحة والخياطة نضيفة.', en: 'Second time ordering from Bianca Corner — comfortable cut and clean stitching.' }
];
function productReviews(p) {
  const seed = p.id.charCodeAt(1) % REVIEW_POOL.length;
  const seeded = [REVIEW_POOL[seed], REVIEW_POOL[(seed + 2) % REVIEW_POOL.length]];
  const userReviews = (reviewsDb[p.id] || []).map(r => ({ name: r.name, rating: r.rating, ar: r.text, en: r.text }));
  return userReviews.concat(seeded);
}

function pageProduct(id) {
  const p = findProduct(id);
  if (!p) { go('/shop'); return; }
  recent = [p.id].concat(recent.filter(x => x !== p.id)).slice(0, 8); saveAll();

  const cat = catOf(p);
  const revs = productReviews(p);
  const related = products().filter(x => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  const recentList = products().filter(x => recent.includes(x.id) && x.id !== p.id).slice(0, 4);
  const gov = 'cairo';
  const g = govOf(gov);
  const stock = stockOf(p);

  let selSize = null, selColor = null, qty = 1, tab = 'desc';

  const stockLine = stock <= 0
    ? '<div class="stock-line out">● ' + esc(t('out_stock')) + '</div>'
    : stock <= 6
      ? '<div class="stock-line low">● ' + tt('low_stock', { n: stock }) + '</div>'
      : '<div class="stock-line ok">● ' + esc(t('in_stock')) + '</div>';

  const html = pageHead('', '', ['<a href="#/shop">' + esc(t('nav_shop')) + '</a>', '<a href="#/category/' + cat.slug + '">' + esc(pick(cat.name)) + '</a>', esc(pick(p.name))]) +
  '<div class="container"><div class="pd-layout">' +
    '<div class="pd-gallery">' +
      '<div class="pd-main-img" id="pdImg">' + artSVG(p.art, p.cat, 0) + '</div>' +
      '<div class="pd-thumbs">' + [0, 1, 2].map(i =>
        '<button class="pd-thumb' + (i === 0 ? ' active' : '') + '" data-i="' + i + '">' + artSVG(p.art, p.cat, i) + '</button>').join('') + '</div>' +
    '</div>' +
    '<div class="pd-info">' +
      '<div class="p-badges" style="position:static;flex-direction:row">' + badgeHTML(p) + '</div>' +
      '<h1>' + esc(pick(p.name)) + '</h1>' +
      '<div class="pd-meta">' + stars(p.rating) + '<span>' + p.rating + ' · ' + tt('based_on', { n: p.reviewsCount + (reviewsDb[p.id] || []).length }) + '</span>' +
        '<span>SKU: ' + esc(p.sku) + '</span></div>' +
      '<div class="pd-price"><span class="price">' + fmt(p.price) + '</span>' +
        (p.oldPrice ? '<span class="price-old">' + fmt(p.oldPrice) + '</span><span class="price-off">-' + discPct(p) + '%</span>' : '') + '</div>' +
      '<p class="pd-desc">' + esc(pick(p.desc)) + '</p>' +

      '<div class="opt-label">' + esc(t('select_color')) + ' <span id="colorName" class="muted" style="font-weight:400"></span></div>' +
      '<div class="swatches" id="pdColors">' + p.colors.map(c =>
        '<button class="swatch" data-c="' + c + '" title="' + esc(pick(COLORS[c])) + '" style="background:' + COLORS[c].hex + '"></button>').join('') + '</div>' +
      '<div class="opt-err" id="colorErr"></div>' +

      '<div class="opt-label">' + esc(t('select_size')) + ' <span class="guide-link" id="sizeGuide">' + esc(t('size_guide')) + '</span></div>' +
      '<div class="size-row" id="pdSizes">' + p.sizes.map(s => '<button class="size-chip" data-s="' + s + '">' + s + '</button>').join('') + '</div>' +
      '<div class="opt-err" id="sizeErr"></div>' +

      stockLine +

      '<div class="qty-row"><div class="qty-box"><button id="qMinus">−</button><input id="qInput" value="1" inputmode="numeric"><button id="qPlus">+</button></div></div>' +

      '<div class="pd-ctas">' +
        '<button class="btn btn-primary btn-lg" id="pdAdd"' + (stock <= 0 ? ' disabled' : '') + '>' + esc(t('add_to_cart')) + '</button>' +
        '<button class="btn btn-gold btn-lg" id="pdBuy"' + (stock <= 0 ? ' disabled' : '') + '>' + esc(t('buy_now')) + '</button>' +
        '<button class="p-wish-lg' + (wishlist.includes(p.id) ? ' active' : '') + '" id="pdWish">' + (wishlist.includes(p.id) ? ICON.heartF : ICON.heart) + '</button>' +
      '</div>' +
      '<a class="btn btn-ghost" style="margin-top:.6rem;padding-inline-start:0" href="' + waLink(waOrderMsg(p)) + '" target="_blank" rel="noopener">' + ICON.whatsapp + ' ' + esc(t('order_whatsapp')) + '</a>' +

      '<ul class="trust-row">' +
        '<li>' + ICON.truck + '<span>' + esc(t('delivery_est')) + ': <b>' + esc(g.days) + '</b> ' + (lang === 'ar' ? 'أيام عمل' : 'business days') + ' — ' + esc(t('delivery_to')) + ' ' + esc(pick(g)) + '</span></li>' +
        '<li>' + ICON.cash + '<span>' + esc(t('payment_cod')) + ' · ' + esc(t('free_ship')) + ' ' + (lang === 'ar' ? 'فوق' : 'over') + ' ' + fmt(STORE.freeShippingOver) + '</span></li>' +
        '<li>' + ICON.refresh + '<span>' + esc(t('returns_line')) + '</span></li>' +
      '</ul>' +

      '<div class="pd-tabs"><div class="tab-head">' +
        '<button data-tab="desc" class="active">' + esc(t('desc_t')) + '</button>' +
        '<button data-tab="details">' + esc(t('details_t')) + '</button>' +
        '<button data-tab="care">' + esc(t('care_t')) + '</button>' +
        '<button data-tab="reviews">' + esc(t('reviews_t')) + ' (' + (p.reviewsCount + (reviewsDb[p.id] || []).length) + ')</button>' +
      '</div>' +
      '<div class="tab-pane" id="tabPane"></div></div>' +
    '</div></div>';

  let extra = '';
  if (related.length) extra += '<section class="section"><div class="container"><div class="sec-head"><h2>' + esc(t('related')) + '</h2></div><div class="prod-grid">' + related.map(productCard).join('') + '</div></div></section>';
  if (recentList.length) extra += '<section class="section" style="padding-top:0"><div class="container"><div class="sec-head"><h2>' + esc(t('recently')) + '</h2></div><div class="prod-grid">' + recentList.map(productCard).join('') + '</div></div></section>';

  const ld = {
    '@context': 'https://schema.org', '@type': 'Product', name: p.name.en, description: p.desc.en, sku: p.sku,
    offers: { '@type': 'Offer', priceCurrency: 'EGP', price: p.price, availability: stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }
  };

  render(layout(html + extra, cat.slug), pick(p.name));
  injectLD(ld);

  const renderTab = () => {
    const pane = qs('#tabPane');
    if (tab === 'desc') pane.innerHTML = esc(pick(p.desc));
    else if (tab === 'details') pane.innerHTML = esc(pick(p.material)) + '<br><span class="muted">SKU: ' + esc(p.sku) + ' · ' + esc(pick(cat.name)) + '</span>';
    else if (tab === 'care') pane.innerHTML = esc(pick(p.care));
    else {
      pane.innerHTML = revs.map(r =>
        '<div class="review-item"><div class="r-head"><b>' + esc(r.name) + '</b>' + stars(r.rating) + '</div>' +
        '<p>' + esc(r[lang] || r.ar) + '</p></div>').join('') +
        '<div class="review-form"><h3 style="margin-bottom:1rem">' + esc(t('write_review')) + '</h3>' +
        '<div class="f-field"><label>' + esc(t('review_rating')) + '</label><div class="size-row">' +
          [5, 4, 3, 2, 1].map(n => '<button class="size-chip rev-star" data-r="' + n + '">' + n + ' ★</button>').join('') + '</div></div>' +
        '<div class="f-field"><label>' + esc(t('review_name')) + '</label><input id="revName"></div>' +
        '<div class="f-field"><label>' + esc(t('review_text')) + '</label><textarea id="revText" rows="3"></textarea></div>' +
        '<button class="btn btn-primary" id="revSubmit">' + esc(t('review_submit')) + '</button></div>';
      let rr = 5;
      qsa('.rev-star', pane).forEach(b => b.onclick = () => { rr = +b.dataset.r; qsa('.rev-star', pane).forEach(x => x.classList.toggle('active', x === b)); });
      qsa('.rev-star', pane)[0].classList.add('active');
      qs('#revSubmit').onclick = () => {
        const n = qs('#revName').value.trim(), x = qs('#revText').value.trim();
        if (!n || !x) { toast(t('field_required'), true); return; }
        if (!reviewsDb[p.id]) reviewsDb[p.id] = [];
        reviewsDb[p.id].push({ name: n, rating: rr, text: x, date: todayStr() });
        saveAll(); toast(t('review_ok')); pageProduct(p.id);
      };
    }
  };
  renderTab();
  qsa('.tab-head button').forEach(b => b.onclick = () => {
    tab = b.dataset.tab;
    qsa('.tab-head button').forEach(x => x.classList.toggle('active', x === b));
    renderTab();
  });

  qsa('.pd-thumb').forEach(b => b.onclick = () => {
    qsa('.pd-thumb').forEach(x => x.classList.toggle('active', x === b));
    qs('#pdImg').innerHTML = artSVG(p.art, p.cat, +b.dataset.i);
  });
  qsa('#pdColors .swatch').forEach(b => b.onclick = () => {
    selColor = b.dataset.c;
    qsa('#pdColors .swatch').forEach(x => x.classList.toggle('active', x === b));
    qs('#colorName').textContent = pick(COLORS[selColor]);
    qs('#colorErr').textContent = '';
  });
  qsa('#pdSizes .size-chip').forEach(b => b.onclick = () => {
    selSize = b.dataset.s;
    qsa('#pdSizes .size-chip').forEach(x => x.classList.toggle('active', x === b));
    qs('#sizeErr').textContent = '';
  });
  qs('#sizeGuide').onclick = () => openSizeGuide(p.cat);
  qs('#qMinus').onclick = () => { qty = Math.max(1, qty - 1); qs('#qInput').value = qty; };
  qs('#qPlus').onclick = () => { qty = Math.min(10, qty + 1); qs('#qInput').value = qty; };
  qs('#qInput').onchange = e => { qty = Math.min(10, Math.max(1, parseInt(e.target.value) || 1)); e.target.value = qty; };

  const validate = () => {
    let ok = true;
    if (!selColor) { qs('#colorErr').textContent = t('err_color'); ok = false; }
    if (!selSize) { qs('#sizeErr').textContent = t('err_size'); ok = false; }
    return ok;
  };
  qs('#pdAdd').onclick = () => { if (validate()) addToCart(p.id, selSize, selColor, qty); };
  qs('#pdBuy').onclick = () => { if (validate()) { addToCart(p.id, selSize, selColor, qty); go('/checkout'); } };
  qs('#pdWish').onclick = e => {
    toggleWish(p.id);
    const on = wishlist.includes(p.id);
    e.currentTarget.classList.toggle('active', on);
    e.currentTarget.innerHTML = on ? ICON.heartF : ICON.heart;
    updateHeaderBadges();
  };
  bindProductCards(qs('#page'));
}

function waOrderMsg(p) {
  return lang === 'ar'
    ? 'مرحبًا، أريد طلب: ' + p.name.ar + ' — ' + fmt(p.price) + ' (' + p.sku + ')'
    : 'Hi, I\'d like to order: ' + p.name.en + ' — ' + fmt(p.price) + ' (' + p.sku + ')';
}

function injectLD(obj) {
  qsa('script[data-bc-ld]').forEach(s => s.remove());
  const s = document.createElement('script');
  s.type = 'application/ld+json'; s.setAttribute('data-bc-ld', '1');
  s.textContent = JSON.stringify(obj);
  document.head.appendChild(s);
}

/* ---------- CART ---------- */
function pageCart() {
  const tot = cartTotals(null);
  if (!tot.lines.length) {
    render(layout(pageHead(t('cart_title')) +
      '<div class="container"><div class="empty-state"><div class="big">◌</div><h3>' + esc(t('cart_empty')) + '</h3><p>' + esc(t('cart_empty_sub')) + '</p>' +
      '<a class="btn btn-primary" href="#/shop">' + esc(t('continue_shopping')) + '</a></div></div>', 'cart'), t('cart_title'));
    return;
  }

  const items = tot.lines.map((l, idx) =>
    '<div class="cart-item">' +
      '<a class="ci-img" href="#/product/' + l.p.id + '">' + artSVG(l.p.art, l.p.cat) + '</a>' +
      '<div><a class="ci-name" href="#/product/' + l.p.id + '">' + esc(pick(l.p.name)) + '</a>' +
        '<div class="ci-opts">' + esc(t('size_l')) + ': ' + esc(l.size) + ' · ' + esc(t('color_l')) + ': ' + esc(pick(COLORS[l.color])) + '</div>' +
        '<div class="ci-controls"><div class="qty-box"><button data-a="-" data-i="' + idx + '">−</button><input value="' + l.qty + '" data-q="' + idx + '" inputmode="numeric"><button data-a="+" data-i="' + idx + '">+</button></div>' +
        '<span class="muted" style="font-size:.82rem">' + fmt(l.p.price) + '</span></div></div>' +
      '<div class="ci-right"><b>' + fmt(l.p.price * l.qty) + '</b><button class="ci-remove" data-r="' + idx + '">' + esc(t('remove')) + '</button></div>' +
    '</div>').join('');

  const need = STORE.freeShippingOver - tot.subtotal;
  const shipHint = tot.shipFree
    ? '<div class="ship-hint">✓ ' + esc(t('free_ship_done')) + '</div>'
    : '<div class="ship-hint">' + tt('free_ship_hint', { n: fmt(need) }) + '</div>';

  const html = pageHead(t('cart_title')) +
    '<div class="container"><div class="cart-layout">' +
      '<div>' + items +
        '<a class="btn btn-ghost mt-1" href="#/shop">← ' + esc(t('continue_shopping')) + '</a></div>' +
      '<div class="summary-card"><h3>' + esc(t('order_summary')) + '</h3>' +
        shipHint +
        '<div class="coupon-row"><input id="couponIn" placeholder="' + esc(t('coupon_ph')) + '" value="' + esc(coupon || '') + '">' +
        '<button class="btn btn-outline btn-sm" id="couponBtn">' + esc(t('apply_coupon')) + '</button></div>' +
        '<div class="coupon-msg" id="couponMsg"></div>' +
        '<div class="sum-row"><span>' + esc(t('subtotal')) + '</span><span>' + fmt(tot.subtotal) + '</span></div>' +
        (tot.discount ? '<div class="sum-row"><span>' + esc(t('discount')) + '</span><span>−' + fmt(tot.discount) + '</span></div>' : '') +
        '<div class="sum-row"><span>' + esc(t('shipping')) + '</span><span>' + (tot.shipFree ? '<b class="free">' + esc(t('free_ship')) + '</b>' : (lang === 'ar' ? 'يُحدد حسب المحافظة' : 'by governorate')) + '</span></div>' +
        '<div class="sum-row total"><span>' + esc(t('total')) + '</span><span>' + fmt(tot.subtotal - tot.discount) + '+</span></div>' +
        '<button class="btn btn-primary btn-block btn-lg mt-1" id="goCheckout">' + esc(t('proceed')) + '</button>' +
        '<a class="btn btn-block mt-1" style="background:#25d366;color:#fff" href="' + waLink(cartWaMsg(tot)) + '" target="_blank" rel="noopener">' + ICON.whatsapp + ' ' + esc(t('order_whatsapp_cta')) + '</a>' +
      '</div></div></div>';

  render(layout(html, 'cart'), t('cart_title'));

  qsa('[data-a]').forEach(b => b.onclick = () => {
    const i = +b.dataset.i;
    cart[i].qty = Math.min(10, Math.max(1, cart[i].qty + (b.dataset.a === '+' ? 1 : -1)));
    saveAll(); pageCart();
  });
  qsa('[data-q]').forEach(inp => inp.onchange = () => {
    const i = +inp.dataset.q;
    cart[i].qty = Math.min(10, Math.max(1, parseInt(inp.value) || 1));
    saveAll(); pageCart();
  });
  qsa('[data-r]').forEach(b => b.onclick = () => { cart.splice(+b.dataset.r, 1); saveAll(); pageCart(); });
  qs('#couponBtn').onclick = () => {
    const code = qs('#couponIn').value.trim().toUpperCase();
    const msg = qs('#couponMsg');
    if (!code) { coupon = null; saveAll(); pageCart(); return; }
    const c = COUPONS[code];
    if (!c) { msg.className = 'coupon-msg err'; msg.textContent = t('coupon_bad'); return; }
    if (tot.subtotal < c.min) { msg.className = 'coupon-msg err'; msg.textContent = tt('coupon_min', { n: fmt(c.min) }); return; }
    coupon = code; saveAll(); pageCart();
  };
  if (coupon && COUPONS[coupon]) { const m = qs('#couponMsg'); m.className = 'coupon-msg ok'; m.textContent = tt('coupon_ok', { code: coupon }); }
  qs('#goCheckout').onclick = () => go('/checkout');
}

function cartWaMsg(tot) {
  const lines = tot.lines.map(l => '• ' + pick(l.p.name) + ' — ' + l.size + '/' + pick(COLORS[l.color]) + ' ×' + l.qty + ' — ' + fmt(l.p.price * l.qty)).join('\n');
  const head = lang === 'ar' ? 'مرحبًا بيانكا كورنر، أريد إتمام هذا الطلب:' : 'Hi Bianca Corner, I\'d like to place this order:';
  return head + '\n' + lines + '\n' + t('subtotal') + ': ' + fmt(tot.subtotal - tot.discount);
}

/* ---------- CHECKOUT ---------- */
function pageCheckout() {
  const tot0 = cartTotals(null);
  if (!tot0.lines.length) { go('/cart'); return; }

  const govOpts = '<option value="">' + esc(t('governorate')) + '…</option>' +
    GOVERNORATES.map(g => '<option value="' + g.id + '">' + esc(pick(g)) + ' — ' + fmt(g.fee) + '</option>').join('');

  const html = pageHead(t('checkout_title')) +
    '<div class="container"><form id="coForm" novalidate><div class="checkout-layout">' +
      '<div>' +
        '<div class="form-card"><h3><span class="step-num">1</span> ' + esc(t('contact_info')) + '</h3>' +
          '<div class="f-row">' +
            '<div class="f-field"><label>' + esc(t('full_name')) + ' *</label><input id="cName" value="' + esc(user ? user.name : '') + '"><span class="f-err"></span></div>' +
            '<div class="f-field"><label>' + esc(t('email_addr')) + ' *</label><input id="cEmail" type="email" dir="ltr" value="' + esc(user ? user.email : '') + '"><span class="f-err"></span></div>' +
          '</div>' +
          '<div class="f-row">' +
            '<div class="f-field"><label>' + esc(t('phone')) + ' *</label><input id="cPhone" inputmode="tel" dir="ltr" placeholder="01xxxxxxxxx"><span class="f-err"></span></div>' +
            '<div class="f-field"><label>' + esc(t('whatsapp_num')) + ' *</label><input id="cWa" inputmode="tel" dir="ltr" placeholder="01xxxxxxxxx"><span class="f-err"></span></div>' +
          '</div>' +
          '<label class="check-row"><input type="checkbox" id="sameWa" checked> ' + esc(t('same_phone')) + '</label>' +
        '</div>' +

        '<div class="form-card"><h3><span class="step-num">2</span> ' + esc(t('shipping_info')) + '</h3>' +
          '<div class="f-row">' +
            '<div class="f-field"><label>' + esc(t('governorate')) + ' *</label><select id="cGov">' + govOpts + '</select><span class="f-err"></span></div>' +
            '<div class="f-field"><label>' + esc(t('city')) + ' *</label><input id="cCity"><span class="f-err"></span></div>' +
          '</div>' +
          '<div class="f-field"><label>' + esc(t('address')) + ' *</label><input id="cAddr" placeholder="' + esc(t('address_ph')) + '"><span class="f-err"></span></div>' +
          '<div class="f-field"><label>' + esc(t('notes')) + '</label><textarea id="cNotes" rows="2"></textarea><span class="f-err"></span></div>' +
        '</div>' +

        '<div class="form-card"><h3><span class="step-num">3</span> ' + esc(t('payment_method')) + '</h3>' +
          '<label class="pay-opt active"><input type="radio" name="pay" value="cod" checked><span class="pay-ico">' + ICON.cash + '</span><span><b>' + esc(t('cod')) + '</b><small>' + esc(t('cod_desc')) + '</small></span></label>' +
          '<label class="pay-opt disabled"><input type="radio" disabled><span class="pay-ico">' + ICON.card + '</span><span><b>' + esc(t('card_soon')) + '</b></span></label>' +
          '<label class="pay-opt disabled"><input type="radio" disabled><span class="pay-ico">' + ICON.wallet + '</span><span><b>' + esc(t('wallet_soon')) + '</b></span></label>' +
        '</div>' +
      '</div>' +

      '<div class="summary-card"><h3>' + esc(t('order_summary')) + '</h3>' +
        tot0.lines.map(l =>
          '<div class="mini-item"><span class="m-img">' + artSVG(l.p.art, l.p.cat) + '<span class="m-qty">' + l.qty + '</span></span>' +
          '<span class="m-name">' + esc(pick(l.p.name)) + '<small>' + esc(l.size) + ' / ' + esc(pick(COLORS[l.color])) + '</small></span>' +
          '<span class="m-price">' + fmt(l.p.price * l.qty) + '</span></div>').join('') +
        '<div id="sumRows"></div>' +
        '<div id="estLine" class="muted" style="font-size:.82rem;margin:.5rem 0"></div>' +
        '<button type="submit" class="btn btn-gold btn-block btn-lg" id="placeOrder">' + esc(t('place_order')) + '</button>' +
      '</div>' +
    '</div></form></div>';

  render(layout(html, ''), t('checkout_title'));

  const paintTotals = () => {
    const tot = cartTotals(qs('#cGov').value);
    qs('#sumRows').innerHTML =
      '<div class="sum-row"><span>' + esc(t('subtotal')) + '</span><span>' + fmt(tot.subtotal) + '</span></div>' +
      (tot.discount ? '<div class="sum-row"><span>' + esc(t('discount')) + (coupon ? ' (' + esc(coupon) + ')' : '') + '</span><span>−' + fmt(tot.discount) + '</span></div>' : '') +
      '<div class="sum-row"><span>' + esc(t('shipping')) + '</span><span>' + (tot.shipFree ? '<b class="free">' + esc(t('free_ship')) + '</b>' : fmt(tot.shipFee)) + '</span></div>' +
      '<div class="sum-row total"><span>' + esc(t('total')) + '</span><span>' + fmt(tot.total) + '</span></div>';
    qs('#estLine').textContent = tot.gov ? tt('est_delivery', { d: tot.gov.days }) : '';
  };
  paintTotals();
  qs('#cGov').onchange = paintTotals;
  qs('#sameWa').onchange = e => { if (e.target.checked) qs('#cWa').value = qs('#cPhone').value; };
  qs('#cPhone').oninput = e => { if (qs('#sameWa').checked) qs('#cWa').value = e.target.value; };

  const setErr = (id, msg) => {
    const el = qs('#' + id); const f = el.closest('.f-field');
    f.classList.toggle('invalid', !!msg);
    f.querySelector('.f-err').textContent = msg || '';
    return !msg;
  };

  qs('#coForm').onsubmit = e => {
    e.preventDefault();
    const v = id => qs('#' + id).value.trim();
    let ok = true;
    ok = setErr('cName', v('cName').length >= 3 ? '' : t('field_required')) && ok;
    ok = setErr('cEmail', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('cEmail')) ? '' : t('email_invalid')) && ok;
    ok = setErr('cPhone', /^01[0125]\d{8}$/.test(v('cPhone')) ? '' : t('phone_invalid')) && ok;
    ok = setErr('cWa', /^01[0125]\d{8}$/.test(v('cWa')) ? '' : t('phone_invalid')) && ok;
    ok = setErr('cGov', v('cGov') ? '' : t('field_required')) && ok;
    ok = setErr('cCity', v('cCity') ? '' : t('field_required')) && ok;
    ok = setErr('cAddr', v('cAddr').length >= 8 ? '' : t('field_required')) && ok;
    if (!ok) { qs('.f-field.invalid input, .f-field.invalid select').focus(); return; }

    const btn = qs('#placeOrder'); btn.disabled = true; btn.textContent = t('loading');

    const tot = cartTotals(v('cGov'));
    const num = 'BC-' + String(1000 + orders.length + Math.floor(Math.random() * 90));
    const order = {
      num, date: todayStr(), status: 'pending', payment: 'cod',
      items: tot.lines.map(l => ({ id: l.p.id, name: pick(l.p.name), sku: l.p.sku, size: l.size, color: pick(COLORS[l.color]), qty: l.qty, price: l.p.price })),
      subtotal: tot.subtotal, discount: tot.discount, shipping: tot.shipFee, total: tot.total,
      coupon: coupon || null,
      customer: { name: v('cName'), email: v('cEmail'), phone: v('cPhone'), wa: v('cWa'), gov: v('cGov'), city: v('cCity'), address: v('cAddr'), notes: v('cNotes') }
    };
    orders.unshift(order);
    tot.lines.forEach(l => {
      const cur = findProduct(l.p.id);
      if (cur) edits[cur.id] = Object.assign({}, edits[cur.id], { stock: Math.max(0, stockOf(cur) - l.qty) });
    });
    cart = []; coupon = null; saveAll();
    go('/confirm?o=' + num);
  };
}

/* ---------- CONFIRMATION ---------- */
function pageConfirm(num) {
  const o = orders.find(x => x.num === num);
  if (!o) { go('/'); return; }
  const g = govOf(o.customer.gov);
  const html = '<div class="container"><div class="confirm-box">' +
    '<div class="confirm-ico">' + ICON.check + '</div>' +
    '<h1 style="font-size:1.9rem">' + esc(t('confirm_title')) + '</h1>' +
    '<p class="muted mt-1">' + tt('confirm_sub', { name: esc(o.customer.name.split(' ')[0]) }) + '</p>' +
    '<div class="order-num-chip" id="ordNum">' + esc(o.num) + '</div>' +
    '<p class="muted" style="font-size:.85rem">' + esc(t('keep_num')) + '</p>' +
    '<div class="form-card" style="text-align:start;margin-top:1.6rem">' +
      '<div class="sum-row"><span>' + esc(t('subtotal')) + '</span><span>' + fmt(o.subtotal) + '</span></div>' +
      (o.discount ? '<div class="sum-row"><span>' + esc(t('discount')) + '</span><span>−' + fmt(o.discount) + '</span></div>' : '') +
      '<div class="sum-row"><span>' + esc(t('shipping')) + ' (' + esc(g ? pick(g) : '') + ')</span><span>' + (o.shipping ? fmt(o.shipping) : t('free_ship')) + '</span></div>' +
      '<div class="sum-row total"><span>' + esc(t('total')) + '</span><span>' + fmt(o.total) + '</span></div>' +
      '<div class="sum-row"><span>' + esc(t('payment_method')) + '</span><span>' + esc(t('cod')) + '</span></div>' +
      '<div class="sum-row"><span>' + esc(t('delivery_est')) + '</span><span>' + esc(g ? g.days : '2-5') + ' ' + (lang === 'ar' ? 'أيام عمل' : 'business days') + '</span></div>' +
    '</div>' +
    '<div class="confirm-actions">' +
      '<a class="btn btn-primary" href="#/track">' + esc(t('track_order')) + '</a>' +
      '<a class="btn btn-outline" href="#/">' + esc(t('back_home')) + '</a>' +
    '</div></div></div>';
  render(layout(html, ''), t('confirm_title'));
}

/* ---------- TRACK ---------- */
const STATUS_FLOW = ['pending', 'confirmed', 'shipped', 'out', 'delivered'];
function pageTrack() {
  const html = pageHead(t('track_title'), t('track_sub')) +
    '<div class="container"><div class="track-wrap"><div class="form-card">' +
      '<div class="f-row">' +
        '<div class="f-field"><label>' + esc(t('track_num')) + '</label><input id="tNum" placeholder="' + esc(t('track_ph')) + '" dir="ltr"></div>' +
        '<div class="f-field"><label>' + esc(t('phone')) + '</label><input id="tPhone" dir="ltr" inputmode="tel" placeholder="01xxxxxxxxx"></div>' +
      '</div>' +
      '<button class="btn btn-primary" id="tGo">' + esc(t('track_btn')) + '</button>' +
      '<div class="f-err" id="tErr" style="margin-top:.6rem"></div>' +
    '</div><div id="tResult"></div></div></div>';
  render(layout(html, ''), t('track_title'));

  qs('#tGo').onclick = () => {
    const num = qs('#tNum').value.trim().toUpperCase(), ph = qs('#tPhone').value.trim();
    const o = orders.find(x => x.num.toUpperCase() === num && (x.customer.phone === ph || x.customer.wa === ph));
    if (!o) { qs('#tErr').textContent = t('track_notfound'); qs('#tResult').innerHTML = ''; return; }
    qs('#tErr').textContent = '';
    const idx = STATUS_FLOW.indexOf(o.status);
    const cancelled = o.status === 'cancelled';
    qs('#tResult').innerHTML = '<div class="order-card"><div class="o-head"><span class="o-num">' + esc(o.num) + '</span>' +
      '<span class="status-pill ' + o.status + '">' + esc(t('st_' + o.status)) + '</span></div>' +
      '<p class="muted" style="font-size:.85rem">' + new Date(o.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') + ' · ' + o.items.length + ' ' + t('results') + ' · ' + fmt(o.total) + '</p></div>' +
      (cancelled ? '' : '<div class="timeline">' + STATUS_FLOW.map((s, i) =>
        '<div class="tl-step ' + (i < idx ? 'done' : i === idx ? 'current' : '') + '"><b>' + esc(t('st_' + s)) + '</b></div>').join('') + '</div>');
  };
}

/* ---------- AUTH ---------- */
function pageAuth() {
  if (user) { go('/account'); return; }
  let mode = 'login';
  const paint = () => {
    const html = pageHead(mode === 'login' ? t('login_t') : t('register_t')) +
      '<div class="container"><div class="auth-wrap">' +
        '<div class="auth-tabs"><button id="tabL" class="' + (mode === 'login' ? 'active' : '') + '">' + esc(t('login_t')) + '</button>' +
        '<button id="tabR" class="' + (mode === 'register' ? 'active' : '') + '">' + esc(t('register_t')) + '</button></div>' +
        '<div class="form-card">' +
          (mode === 'register' ? '<div class="f-field"><label>' + esc(t('full_name')) + '</label><input id="aName"><span class="f-err"></span></div>' : '') +
          '<div class="f-field"><label>' + esc(t('email_addr')) + '</label><input id="aEmail" type="email" dir="ltr"><span class="f-err"></span></div>' +
          '<div class="f-field"><label>' + esc(t('password')) + '</label><input id="aPass" type="password" dir="ltr"><span class="f-err"></span></div>' +
          (mode === 'register' ? '<div class="f-field"><label>' + esc(t('confirm_pass')) + '</label><input id="aPass2" type="password" dir="ltr"><span class="f-err"></span></div>' : '') +
          '<div class="f-err" id="aErr"></div>' +
          '<button class="btn btn-primary btn-block btn-lg" id="aGo">' + esc(mode === 'login' ? t('login_btn') : t('register_btn')) + '</button>' +
        '</div>' +
        '<p class="auth-note">' + (lang === 'ar' ? 'حسابكِ يحفظ طلباتكِ وعناوينكِ لتسوق أسرع.' : 'Your account saves orders & addresses for faster checkout.') + '</p>' +
      '</div></div>';
    render(layout(html, ''), mode === 'login' ? t('login_t') : t('register_t'));
    qs('#tabL').onclick = () => { mode = 'login'; paint(); };
    qs('#tabR').onclick = () => { mode = 'register'; paint(); };
    qs('#aGo').onclick = () => {
      const email = qs('#aEmail').value.trim().toLowerCase(), pass = qs('#aPass').value;
      qs('#aErr').textContent = '';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { qs('#aErr').textContent = t('email_invalid'); return; }
      if (pass.length < 6) { qs('#aErr').textContent = t('pass_short'); return; }
      if (mode === 'register') {
        const name = qs('#aName').value.trim();
        if (name.length < 3) { qs('#aErr').textContent = t('field_required'); return; }
        if (qs('#aPass2').value !== pass) { qs('#aErr').textContent = t('pass_mismatch'); return; }
        if (users.find(u => u.email === email)) { qs('#aErr').textContent = t('email_taken'); return; }
        user = { name, email, pass, since: todayStr(), phone: '', address: '', city: '', gov: '' };
        users.push(user); saveAll(); go('/account');
      } else {
        const u = users.find(x => x.email === email && x.pass === pass);
        if (!u) { qs('#aErr').textContent = t('auth_err'); return; }
        user = u; saveAll(); go('/account');
      }
    };
  };
  paint();
}

/* ---------- ACCOUNT ---------- */
let accTab = 'orders';
function pageAccount() {
  if (!user) { go('/auth'); return; }
  const myOrders = orders.filter(o => o.customer.email.toLowerCase() === user.email.toLowerCase());

  const nav = '<div class="acc-nav">' +
    '<button data-t="orders" class="' + (accTab === 'orders' ? 'active' : '') + '">' + esc(t('acc_orders')) + '</button>' +
    '<button data-t="info" class="' + (accTab === 'info' ? 'active' : '') + '">' + esc(t('acc_info')) + '</button>' +
    '<button data-t="wish" class="' + (accTab === 'wish' ? 'active' : '') + '">' + esc(t('f_wishlist')) + '</button>' +
    '<button id="accLogout">' + esc(t('logout')) + '</button></div>';

  let body = '';
  if (accTab === 'orders') {
    body = myOrders.length ? myOrders.map(o =>
      '<div class="order-card"><div class="o-head"><span class="o-num">' + esc(o.num) + '</span>' +
      '<span class="status-pill ' + o.status + '">' + esc(t('st_' + o.status)) + '</span></div>' +
      '<p class="muted" style="font-size:.85rem;margin-bottom:.5rem">' + new Date(o.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') + '</p>' +
      o.items.map(i => '<div style="font-size:.88rem;padding:.15rem 0">' + esc(i.name) + ' — ' + esc(i.size) + ' ×' + i.qty + '</div>').join('') +
      '<div class="sum-row total" style="border-top:1px solid var(--line);margin-top:.6rem"><span>' + esc(t('total')) + '</span><span>' + fmt(o.total) + '</span></div></div>').join('')
      : '<div class="empty-state"><h3>' + esc(t('no_orders')) + '</h3><a class="btn btn-primary" href="#/shop">' + esc(t('nav_shop')) + '</a></div>';
  } else if (accTab === 'info') {
    body = '<div class="form-card"><h3>' + esc(t('acc_info')) + '</h3>' +
      '<div class="f-row"><div class="f-field"><label>' + esc(t('full_name')) + '</label><input id="uName" value="' + esc(user.name) + '"></div>' +
      '<div class="f-field"><label>' + esc(t('email_addr')) + '</label><input value="' + esc(user.email) + '" disabled></div></div>' +
      '<div class="f-row"><div class="f-field"><label>' + esc(t('phone')) + '</label><input id="uPhone" dir="ltr" value="' + esc(user.phone || '') + '"></div>' +
      '<div class="f-field"><label>' + esc(t('governorate')) + '</label><select id="uGov"><option value="">—</option>' +
        GOVERNORATES.map(g => '<option value="' + g.id + '"' + (user.gov === g.id ? ' selected' : '') + '>' + esc(pick(g)) + '</option>').join('') + '</select></div></div>' +
      '<div class="f-field"><label>' + esc(t('address')) + '</label><input id="uAddr" value="' + esc(user.address || '') + '"></div>' +
      '<button class="btn btn-primary" id="uSave">' + esc(t('save')) + '</button>' +
      '<p class="muted mt-1" style="font-size:.82rem">' + esc(t('member_since')) + ' ' + new Date(user.since).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') + '</p></div>';
  } else {
    const items = products().filter(p => wishlist.includes(p.id));
    body = items.length ? '<div class="prod-grid" style="grid-template-columns:repeat(3,1fr)">' + items.map(productCard).join('') + '</div>'
      : '<div class="empty-state"><h3>' + esc(t('wish_empty')) + '</h3><p>' + esc(t('wish_empty_sub')) + '</p></div>';
  }

  render(layout(pageHead(t('acc_title'), user.name) + '<div class="container"><div class="acc-layout">' + nav + '<div id="accBody">' + body + '</div></div></div>', ''), t('acc_title'));
  qsa('.acc-nav [data-t]').forEach(b => b.onclick = () => { accTab = b.dataset.t; pageAccount(); });
  qs('#accLogout').onclick = () => { user = null; saveAll(); go('/'); };
  if (qs('#uSave')) qs('#uSave').onclick = () => {
    user.name = qs('#uName').value.trim() || user.name;
    user.phone = qs('#uPhone').value.trim();
    user.gov = qs('#uGov').value; user.address = qs('#uAddr').value.trim();
    const i = users.findIndex(u => u.email === user.email); if (i > -1) users[i] = user;
    saveAll(); toast(t('saved'));
  };
  bindProductCards(qs('#page'));
}

/* ---------- WISHLIST ---------- */
function pageWishlist() {
  const items = products().filter(p => wishlist.includes(p.id));
  const html = pageHead(t('wish_title')) + '<div class="container">' +
    (items.length ? '<div class="prod-grid">' + items.map(productCard).join('') + '</div>'
      : '<div class="empty-state"><div class="big">♡</div><h3>' + esc(t('wish_empty')) + '</h3><p>' + esc(t('wish_empty_sub')) + '</p>' +
        '<a class="btn btn-primary" href="#/shop">' + esc(t('nav_shop')) + '</a></div>') + '</div>';
  render(layout(html, ''), t('wish_title'));
  bindProductCards(qs('#page'));
}

/* ---------- STATIC PAGES ---------- */
function pageAbout() {
  const ar = lang === 'ar';
  const html = pageHead(t('about_t')) + '<div class="container"><div class="prose">' +
    (ar ?
      '<p><b>بيانكا كورنر</b> بدأت من فكرة بسيطة: إن الأناقة الحقيقية مش رفاهية. إحنا متجر أزياء نسائية مصري بنختار كل قطعة بعناية — من الفستان اللي هتلبسيه في مناسبة مهمة، للتيشيرت اللي هيعيش معاكِ سنين.</p>' +
      '<h2>فلسفتنا</h2><p>نؤمن إن الستايل الكويس بيبدأ من القطع الأساسية المظبوطة: خامة محترمة، قصّة مدروسة، وسعر عادل. عشان كده بنشتغل مع مورّدين بنثق فيهم، وبنراجع كل قطعة قبل ما توصل للموقع.</p>' +
      '<h2>ليه بيانكا كورنر؟</h2><ul><li>تشكيلة مختارة مش عشوائية — كل قطعة ليها سبب.</li><li>أسعار واضحة بالجنيه المصري من غير مفاجآت عند الدفع.</li><li>دفع عند الاستلام وشحن لكل محافظات مصر.</li><li>استبدال مقاس مجاني أول مرة، و١٤ يوم استرجاع.</li><li>خدمة عملاء على واتساب بترد بجد.</li></ul>' +
      '<h2>وعدنا</h2><p>لو وصلكِ منتج مش زي الوصف، هنصلحها — بدون تعقيد. ثقتكِ هي رأس مالنا الحقيقي.</p>'
    :
      '<p><b>Bianca Corner</b> started with a simple idea: real elegance isn\'t a luxury. We\'re an Egyptian women\'s fashion store that hand-picks every piece — from the dress you\'ll wear to that big occasion, to the tee that will live with you for years.</p>' +
      '<h2>Our philosophy</h2><p>Good style starts with well-made essentials: honest fabric, a considered cut, and a fair price. That\'s why we work with suppliers we trust and inspect every piece before it reaches the site.</p>' +
      '<h2>Why Bianca Corner?</h2><ul><li>A curated, not random, selection — every piece earns its place.</li><li>Clear EGP pricing with no surprises at checkout.</li><li>Cash on delivery and shipping to all governorates.</li><li>Free first size exchange and 14-day returns.</li><li>A WhatsApp support team that actually replies.</li></ul>' +
      '<h2>Our promise</h2><p>If an item arrives unlike its description, we\'ll make it right — no hassle. Your trust is our real capital.</p>'
    ) +
    '<div style="margin:2rem 0"><a class="btn btn-primary" href="#/shop">' + esc(t('hero_cta')) + '</a></div>' +
    '</div></div>';
  render(layout(html, 'about'), t('about_t'));
}

function pageContact() {
  const html = pageHead(t('contact_t')) + '<div class="container"><div class="grid-2">' +
    '<div><div class="form-card"><h3>' + esc(t('contact_t')) + '</h3>' +
      '<div class="f-field"><label>' + esc(t('contact_name')) + '</label><input id="ctName"><span class="f-err" id="ctNameE"></span></div>' +
      '<div class="f-field"><label>' + esc(t('email_addr')) + '</label><input id="ctEmail" type="email" dir="ltr"><span class="f-err" id="ctEmailE"></span></div>' +
      '<div class="f-field"><label>' + esc(t('contact_msg')) + '</label><textarea id="ctMsg" rows="5" placeholder="' + esc(t('msg_ph')) + '"></textarea><span class="f-err" id="ctMsgE"></span></div>' +
      '<input type="text" id="ctHp" style="position:absolute;left:-9999px" tabindex="-1" autocomplete="off">' +
      '<button class="btn btn-primary" id="ctSend">' + esc(t('send')) + '</button></div></div>' +
    '<div><div class="form-card"><h3>' + esc(t('footer_contact')) + '</h3><ul class="f-contact" style="color:var(--ink-soft)">' +
      '<li>' + ICON.phone + '<a href="tel:' + STORE.whatsapp + '" dir="ltr">' + esc(STORE.phoneDisplay) + '</a></li>' +
      '<li>' + ICON.whatsapp + '<a href="' + waLink() + '" target="_blank" rel="noopener">' + esc(STORE.phoneDisplay) + '</a></li>' +
      '<li>' + ICON.mail + '<a href="mailto:' + STORE.email + '">' + esc(STORE.email) + '</a></li>' +
      '<li>' + ICON.instagram + '<a href="' + STORE.instagram + '" target="_blank" rel="noopener">@biancacorner42</a></li>' +
      '<li>' + ICON.facebook + '<a href="' + STORE.facebook + '" target="_blank" rel="noopener">Facebook Group</a></li>' +
      '<li>' + ICON.clock + '<span>' + (lang === 'ar' ? 'يوميًا ١٠ صباحًا — ١٠ مساءً' : 'Daily 10am — 10pm') + '</span></li>' +
    '</ul></div></div></div></div>';
  render(layout(html, 'contact'), t('contact_t'));
  qs('#ctSend').onclick = () => {
    let ok = true;
    qs('#ctNameE').textContent = qs('#ctName').value.trim().length >= 2 ? '' : (ok = false, t('field_required'));
    qs('#ctEmailE').textContent = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(qs('#ctEmail').value.trim()) ? '' : (ok = false, t('email_invalid'));
    qs('#ctMsgE').textContent = qs('#ctMsg').value.trim().length >= 10 ? '' : (ok = false, t('field_required'));
    if (!ok) return;
    if (qs('#ctHp').value) { toast(t('contact_ok')); return; } // honeypot
    toast(t('contact_ok'));
    qs('#ctName').value = qs('#ctEmail').value = qs('#ctMsg').value = '';
  };
}

function pagePolicy(kind) {
  const ar = lang === 'ar';
  const T = {
    shipping: {
      title: ar ? 'سياسة الشحن والتوصيل' : 'Shipping & Delivery Policy',
      body: ar ?
        '<h2>مناطق التوصيل</h2><p>نوصّل لجميع محافظات مصر الـ٢٧. رسم الشحن والمدة التقديرية يظهران في صفحة إتمام الطلب قبل التأكيد، حسب محافظتكِ.</p>' +
        '<h2>رسوم الشحن والمدة</h2><table><tr><th>المنطقة</th><th>الرسوم</th><th>المدة التقديرية</th></tr>' +
        '<tr><td>القاهرة والجيزة</td><td>٦٠ ج.م</td><td>١–٢ يوم عمل</td></tr>' +
        '<tr><td>الإسكندرية والقليوبية</td><td>٦٥ ج.م</td><td>٢–٣ أيام عمل</td></tr>' +
        '<tr><td>محافظات الدلتا وقناة السويس</td><td>٧٠–٧٥ ج.م</td><td>٢–٤ أيام عمل</td></tr>' +
        '<tr><td>الصعيد</td><td>٨٠–٩٠ ج.م</td><td>٣–٦ أيام عمل</td></tr>' +
        '<tr><td>سيناء والوادي الجديد والبحر الأحمر ومطروح</td><td>٩٠–٩٥ ج.م</td><td>٤–٧ أيام عمل</td></tr></table>' +
        '<p><b>الشحن مجاني</b> لكل الطلبات فوق ٣٠٠٠ ج.م.</p>' +
        '<h2>تتبع الطلب</h2><p>بعد تأكيد طلبكِ يمكنكِ متابعة حالته من صفحة «تتبع الطلب» برقم الطلب ورقم الهاتف.</p>' +
        '<h2>ملاحظات مهمة</h2><ul><li>المدد تقديرية وقد تتأثر بالظروف اللوجستية أو الأعياد الرسمية.</li><li>يرجى التأكد من صحة رقم الهاتف والعنوان — المندوب سيتواصل قبل التسليم.</li><li>عند تعذر التوصيل بعد محاولتين يُعاد الطلب للمخزن ويمكن إعادة جدولته.</li></ul>'
      :
        '<h2>Delivery areas</h2><p>We deliver to all 27 Egyptian governorates. The fee and estimated time appear at checkout before you confirm, based on your governorate.</p>' +
        '<h2>Fees & timelines</h2><table><tr><th>Region</th><th>Fee</th><th>Estimate</th></tr>' +
        '<tr><td>Cairo & Giza</td><td>EGP 60</td><td>1–2 business days</td></tr>' +
        '<tr><td>Alexandria & Qalyubia</td><td>EGP 65</td><td>2–3 business days</td></tr>' +
        '<tr><td>Delta & Suez Canal</td><td>EGP 70–75</td><td>2–4 business days</td></tr>' +
        '<tr><td>Upper Egypt</td><td>EGP 80–90</td><td>3–6 business days</td></tr>' +
        '<tr><td>Sinai, New Valley, Red Sea & Matrouh</td><td>EGP 90–95</td><td>4–7 business days</td></tr></table>' +
        '<p><b>Free shipping</b> on all orders over EGP 3,000.</p>' +
        '<h2>Tracking</h2><p>After confirmation, track your order on the Track Order page with your order number and phone.</p>' +
        '<h2>Notes</h2><ul><li>Timelines are estimates and may shift with logistics or public holidays.</li><li>Please ensure your phone and address are correct — the courier will call before delivery.</li><li>After two failed delivery attempts the order returns to our warehouse and can be rescheduled.</li></ul>'
    },
    returns: {
      title: ar ? 'سياسة الاستبدال والإرجاع' : 'Returns & Exchange Policy',
      body: ar ?
        '<h2>فترة الاستبدال والإرجاع</h2><p>لديكِ <b>١٤ يومًا</b> من تاريخ الاستلام لطلب استبدال أو إرجاع.</p>' +
        '<h2>الشروط</h2><ul><li>القطعة بحالتها الأصلية: غير مستخدمة، غير مغسولة، وبجميع بطاقاتها.</li><li>فستان السهرة والقطع المخفّضة بأكثر من ٣٠٪: استبدال فقط، لا يُقبل الإرجاع.</li><li>لأسباب صحية لا يُقبل إرجاع القطع الداخلية إن وجدت.</li></ul>' +
        '<h2>استبدال المقاس</h2><p>أول استبدال مقاس <b>مجاني</b> — نرسل المندوب بالمقاس الجديد ونستلم القديم في نفس الزيارة. الاستبدالات التالية برسوم شحن رمزية.</p>' +
        '<h2>كيف تطلبين استبدالًا أو إرجاعًا؟</h2><ul><li>راسلينا على واتساب برقم الطلب والسبب.</li><li>سنحدد موعد استلام خلال ٢–٤ أيام عمل.</li><li>بعد فحص القطعة نحوّل المبلغ لمحفظتكِ أو نرجعه نقدًا مع المندوب خلال ٥–٧ أيام عمل.</li></ul>' +
        '<h2>منتج معيب أو غير مطابق؟</h2><p>لو وصلكِ منتج فيه عيب أو مختلف عن الوصف، نتحمل كامل رسوم الشحن ونستبدله أو نسترده — أبلغينا خلال ٤٨ ساعة من الاستلام بصورة للعيب.</p>'
      :
        '<h2>Return window</h2><p>You have <b>14 days</b> from delivery to request an exchange or return.</p>' +
        '<h2>Conditions</h2><ul><li>Item in original condition: unworn, unwashed, with all tags attached.</li><li>Evening dresses and items discounted over 30%: exchange only, not refundable.</li><li>For hygiene reasons, intimates (if any) are not returnable.</li></ul>' +
        '<h2>Size exchange</h2><p>Your first size exchange is <b>free</b> — the courier delivers the new size and collects the old one in a single visit. Further exchanges carry a nominal shipping fee.</p>' +
        '<h2>How to request</h2><ul><li>Message us on WhatsApp with your order number and reason.</li><li>We\'ll schedule a pickup within 2–4 business days.</li><li>After inspection, refunds are issued to your wallet or returned in cash within 5–7 business days.</li></ul>' +
        '<h2>Defective or wrong item?</h2><p>If an item arrives defective or not as described, we cover all shipping and exchange or refund it — report it within 48 hours with a photo of the issue.</p>'
    },
    privacy: {
      title: ar ? 'سياسة الخصوصية' : 'Privacy Policy',
      body: ar ?
        '<h2>البيانات التي نجمعها</h2><p>عند الطلب نجمع: الاسم، الهاتف، الواتساب، البريد الإلكتروني، والعنوان — فقط لغرض تنفيذ طلبكِ والتواصل بشأنه.</p>' +
        '<h2>كيف نستخدمها</h2><ul><li>تجهيز وشحن الطلبات والتواصل معكِ بخصوصها.</li><li>إرسال العروض فقط إذا اشتركتِ في النشرة البريدية (ويمكنكِ الإلغاء في أي وقت).</li><li>تحسين تجربة التسوق على الموقع.</li></ul>' +
        '<h2>مشاركة البيانات</h2><p>لا نبيع بياناتكِ ولا نشاركها مع طرف ثالث للتسويق. نشارك عنوانكِ وهاتفكِ فقط مع شركة الشحن لإتمام التوصيل.</p>' +
        '<h2>الأمان</h2><p>بيانات الحساب محفوظة بشكل آمن، ولا نخزن أي بيانات بطاقات دفع — الدفع حاليًا عند الاستلام فقط.</p>' +
        '<h2>حقوقكِ</h2><p>يمكنكِ في أي وقت طلب تعديل أو حذف بياناتكِ بالتواصل معنا عبر البريد أو واتساب.</p>'
      :
        '<h2>Data we collect</h2><p>When ordering we collect: name, phone, WhatsApp, email and address — solely to fulfil your order and communicate about it.</p>' +
        '<h2>How we use it</h2><ul><li>Preparing, shipping and communicating about orders.</li><li>Sending offers only if you subscribe to the newsletter (unsubscribe anytime).</li><li>Improving the shopping experience.</li></ul>' +
        '<h2>Sharing</h2><p>We never sell your data or share it for third-party marketing. Your address and phone go only to the shipping carrier for delivery.</p>' +
        '<h2>Security</h2><p>Account data is stored securely, and we store no card details — payment is currently cash on delivery only.</p>' +
        '<h2>Your rights</h2><p>You may request to update or delete your data anytime via email or WhatsApp.</p>'
    },
    terms: {
      title: ar ? 'الشروط والأحكام' : 'Terms & Conditions',
      body: ar ?
        '<h2>الطلبات والأسعار</h2><p>كل الأسعار بالجنيه المصري وتشمل ضريبة القيمة المضافة حيثما انطبقت. نحتفظ بحق تعديل الأسعار قبل الشراء؛ السعر المعتمد هو الظاهر وقت تأكيد الطلب.</p>' +
        '<h2>تأكيد الطلب</h2><p>الطلب يُعتبر مؤكدًا بعد التواصل معكِ على واتساب أو الهاتف. الطلبات التي يتعذر تأكيدها خلال ٤٨ ساعة تُلغى تلقائيًا.</p>' +
        '<h2>الدفع</h2><p>الدفع الحالي نقدًا عند الاستلام. عند إضافة وسائل دفع إلكترونية ستُعلن على الموقع رسميًا.</p>' +
        '<h2>التوفر</h2><p>نحدّث المخزون باستمرار، لكن في حالات نادرة قد ينفد منتج بعد الطلب — سنبلغكِ فورًا ونعرض بديلًا أو استردادًا كاملًا.</p>' +
        '<h2>الصور والمحتوى</h2><p>نسعى لدقة تمثيل الألوان، وقد تختلف قليلًا بحسب شاشة جهازكِ. جميع محتويات الموقع ملك لبيانكا كورنر ولا يجوز إعادة استخدامها دون إذن.</p>' +
        '<h2>القانون المطبق</h2><p>تخضع هذه الشروط لقوانين جمهورية مصر العربية ولحماية المستهلك وفق القانون ١٨١ لسنة ٢٠١٨.</p>'
      :
        '<h2>Orders & pricing</h2><p>All prices are in Egyptian Pounds and include VAT where applicable. We may adjust prices before purchase; the binding price is the one shown at order confirmation.</p>' +
        '<h2>Order confirmation</h2><p>An order is confirmed once we reach you on WhatsApp or phone. Orders unconfirmed within 48 hours are cancelled automatically.</p>' +
        '<h2>Payment</h2><p>Payment is currently cash on delivery. Any electronic payment methods will be announced on the site once active.</p>' +
        '<h2>Availability</h2><p>We keep stock updated, but in rare cases an item may sell out after ordering — we\'ll notify you immediately and offer an alternative or full refund.</p>' +
        '<h2>Imagery & content</h2><p>We strive for color accuracy, though shades may vary slightly by screen. All site content is property of Bianca Corner and may not be reused without permission.</p>' +
        '<h2>Governing law</h2><p>These terms are governed by the laws of the Arab Republic of Egypt, including Consumer Protection Law 181 of 2018.</p>'
    }
  };
  const pg = T[kind];
  render(layout(pageHead(pg.title) + '<div class="container"><div class="prose">' + pg.body + '</div></div>', ''), pg.title);
}

function pageFAQ() {
  const html = pageHead(t('f_faq')) + '<div class="container"><div class="prose" style="max-width:820px">' +
    FAQS.map((f, i) => '<div class="faq-item" id="faq' + i + '">' +
      '<button class="faq-q" data-f="' + i + '">' + esc(pick(f.q)) + '<span class="fx">+</span></button>' +
      '<div class="faq-a"><p>' + esc(pick(f.a)) + '</p></div></div>').join('') +
    '</div></div>';
  render(layout(html, ''), t('f_faq'));
  qsa('.faq-q').forEach(b => b.onclick = () => {
    const item = qs('#faq' + b.dataset.f);
    const open = item.classList.toggle('open');
    const a = item.querySelector('.faq-a');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0';
  });
}

/* ---------- ADMIN ---------- */
let adminTab = 'stats';
function pageAdmin() {
  if (!adminOk) {
    render(layout(pageHead(t('admin_t')) + '<div class="container"><div class="admin-login"><div class="form-card">' +
      '<div class="f-field"><label>' + esc(t('admin_pass')) + '</label><input type="password" id="adPass" dir="ltr"><span class="f-err" id="adErr"></span></div>' +
      '<button class="btn btn-primary btn-block" id="adGo">' + esc(t('enter')) + '</button></div></div></div>', ''), t('admin_t'));
    qs('#adGo').onclick = () => {
      if (qs('#adPass').value === STORE.adminPassword) { adminOk = true; saveAll(); pageAdmin(); }
      else qs('#adErr').textContent = t('auth_err');
    };
    return;
  }

  const all = products();
  const revenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);
  const tabs = '<div class="admin-tabs">' +
    ['stats', 'products', 'orders', 'coupons'].map(x =>
      '<button class="' + (adminTab === x ? 'active' : '') + '" data-at="' + x + '">' +
      ({ stats: lang === 'ar' ? 'نظرة عامة' : 'Overview', products: lang === 'ar' ? 'المنتجات' : 'Products', orders: lang === 'ar' ? 'الطلبات' : 'Orders', coupons: lang === 'ar' ? 'الكوبونات' : 'Coupons' })[x] +
      '</button>').join('') +
    '<button id="adOut" style="margin-inline-start:auto">' + esc(t('logout')) + '</button></div>';

  let body = '';
  if (adminTab === 'stats') {
    body = '<div class="admin-stats">' +
      '<div class="stat-card"><b>' + orders.length + '</b><span>' + (lang === 'ar' ? 'إجمالي الطلبات' : 'Total orders') + '</span></div>' +
      '<div class="stat-card"><b>' + fmt(revenue) + '</b><span>' + (lang === 'ar' ? 'إجمالي المبيعات' : 'Revenue') + '</span></div>' +
      '<div class="stat-card"><b>' + all.length + '</b><span>' + (lang === 'ar' ? 'المنتجات' : 'Products') + '</span></div>' +
      '<div class="stat-card"><b>' + all.filter(p => stockOf(p) <= 6).length + '</b><span>' + (lang === 'ar' ? 'مخزون منخفض' : 'Low stock') + '</span></div></div>' +
      '<h3 style="margin-bottom:.8rem">' + (lang === 'ar' ? 'أحدث الطلبات' : 'Latest orders') + '</h3>' +
      '<table class="admin-table"><tr><th>#</th><th>' + (lang === 'ar' ? 'العميل' : 'Customer') + '</th><th>' + esc(t('total')) + '</th><th>' + (lang === 'ar' ? 'الحالة' : 'Status') + '</th></tr>' +
      orders.slice(0, 5).map(o => '<tr><td>' + esc(o.num) + '</td><td>' + esc(o.customer.name) + '</td><td>' + fmt(o.total) + '</td><td><span class="status-pill ' + o.status + '">' + esc(t('st_' + o.status)) + '</span></td></tr>').join('') + '</table>' +
      (orders.length === 0 ? '<p class="muted mt-1">' + (lang === 'ar' ? 'لا توجد طلبات بعد.' : 'No orders yet.') + '</p>' : '');
  } else if (adminTab === 'products') {
    body = '<button class="btn btn-primary btn-sm" id="pNew" style="margin-bottom:1rem">+ ' + (lang === 'ar' ? 'منتج جديد' : 'New product') + '</button>' +
      '<div id="pFormWrap"></div>' +
      '<div style="overflow-x:auto"><table class="admin-table"><tr><th>SKU</th><th>' + (lang === 'ar' ? 'الاسم' : 'Name') + '</th><th>' + (lang === 'ar' ? 'الفئة' : 'Category') + '</th><th>' + (lang === 'ar' ? 'السعر' : 'Price') + '</th><th>' + (lang === 'ar' ? 'المخزون' : 'Stock') + '</th><th></th></tr>' +
      all.map(p => '<tr><td>' + esc(p.sku) + '</td><td>' + esc(p.name.ar) + '</td><td>' + esc(pick(catOf(p).name)) + '</td>' +
        '<td><input type="number" class="ad-price" data-id="' + p.id + '" value="' + p.price + '" style="width:90px;padding:.3rem;border:1px solid var(--line);border-radius:3px"></td>' +
        '<td><input type="number" class="ad-stock" data-id="' + p.id + '" value="' + stockOf(p) + '" style="width:70px;padding:.3rem;border:1px solid var(--line);border-radius:3px"></td>' +
        '<td><button class="btn btn-outline ad-del" data-id="' + p.id + '">' + ICON.trash + '</button></td></tr>').join('') + '</table></div>' +
      '<button class="btn btn-primary mt-1" id="adSaveP">' + esc(t('save')) + '</button>';
  } else if (adminTab === 'orders') {
    body = orders.length ?
      '<div style="overflow-x:auto"><table class="admin-table"><tr><th>#</th><th>' + (lang === 'ar' ? 'التاريخ' : 'Date') + '</th><th>' + (lang === 'ar' ? 'العميل' : 'Customer') + '</th><th>' + (lang === 'ar' ? 'الهاتف' : 'Phone') + '</th><th>' + (lang === 'ar' ? 'المحافظة' : 'Gov.') + '</th><th>' + esc(t('total')) + '</th><th>' + (lang === 'ar' ? 'الحالة' : 'Status') + '</th><th></th></tr>' +
      orders.map((o, i) => '<tr><td>' + esc(o.num) + '</td><td>' + new Date(o.date).toLocaleDateString('en-GB') + '</td>' +
        '<td>' + esc(o.customer.name) + '<br><small class="muted">' + esc(o.customer.city) + '</small></td>' +
        '<td dir="ltr">' + esc(o.customer.phone) + '</td><td>' + esc(govOf(o.customer.gov) ? pick(govOf(o.customer.gov)) : '') + '</td>' +
        '<td>' + fmt(o.total) + '</td>' +
        '<td><select class="ad-status" data-i="' + i + '">' + STATUS_FLOW.concat(['cancelled']).map(s => '<option value="' + s + '"' + (o.status === s ? ' selected' : '') + '>' + esc(t('st_' + s)) + '</option>').join('') + '</select></td>' +
        '<td><button class="btn btn-outline ad-view" data-i="' + i + '">' + ICON.eye + '</button></td></tr>').join('') + '</table></div>' +
      '<button class="btn btn-outline mt-1" id="adCsv">' + (lang === 'ar' ? 'تصدير CSV' : 'Export CSV') + '</button>'
      : '<div class="empty-state"><h3>' + esc(t('no_orders')) + '</h3></div>';
  } else {
    body = '<table class="admin-table"><tr><th>' + (lang === 'ar' ? 'الكود' : 'Code') + '</th><th>' + (lang === 'ar' ? 'القيمة' : 'Value') + '</th><th>' + (lang === 'ar' ? 'الحد الأدنى' : 'Min order') + '</th><th></th></tr>' +
      Object.keys(COUPONS).map(k => '<tr><td><b>' + k + '</b></td><td>' + pick(COUPONS[k].desc) + '</td><td>' + fmt(COUPONS[k].min) + '</td></tr>').join('') + '</table>' +
      '<p class="muted mt-1" style="font-size:.85rem">' + (lang === 'ar' ? 'لتعديل الكوبونات عدّلي ملف data.js — قسم COUPONS.' : 'Edit coupons in data.js — the COUPONS section.') + '</p>';
  }

  render(layout(pageHead(t('admin_t')) + '<div class="container">' + tabs + body + '</div>', ''), t('admin_t'));

  qsa('[data-at]').forEach(b => b.onclick = () => { adminTab = b.dataset.at; pageAdmin(); });
  qs('#adOut').onclick = () => { adminOk = false; saveAll(); pageAdmin(); };

  if (adminTab === 'products') {
    qs('#adSaveP').onclick = () => {
      qsa('.ad-price').forEach(i => {
        const id = i.dataset.id, v = +i.value;
        const base = PRODUCTS.find(x => x.id === id) || custom.find(x => x.id === id);
        if (v !== base.price) edits[id] = Object.assign({}, edits[id], { price: v });
      });
      qsa('.ad-stock').forEach(i => {
        const id = i.dataset.id, v = +i.value;
        edits[id] = Object.assign({}, edits[id], { stock: v });
      });
      saveAll(); toast(t('saved')); pageAdmin();
    };
    qsa('.ad-del').forEach(b => b.onclick = () => {
      const id = b.dataset.id;
      if (custom.find(x => x.id === id)) custom = custom.filter(x => x.id !== id);
      else deleted.push(id);
      saveAll(); pageAdmin();
    });
    qs('#pNew').onclick = () => {
      qs('#pFormWrap').innerHTML = '<div class="form-card"><h3>' + (lang === 'ar' ? 'منتج جديد' : 'New product') + '</h3><div class="admin-form-grid">' +
        '<div class="f-field"><label>' + (lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)') + '</label><input id="npAr"></div>' +
        '<div class="f-field"><label>' + (lang === 'ar' ? 'الاسم (إنجليزي)' : 'Name (EN)') + '</label><input id="npEn" dir="ltr"></div>' +
        '<div class="f-field"><label>' + (lang === 'ar' ? 'الفئة' : 'Category') + '</label><select id="npCat">' + CATEGORIES.map(c => '<option value="' + c.slug + '">' + pick(c.name) + '</option>').join('') + '</select></div>' +
        '<div class="f-field"><label>' + (lang === 'ar' ? 'السعر (ج.م)' : 'Price (EGP)') + '</label><input id="npPrice" type="number"></div>' +
        '<div class="f-field"><label>' + (lang === 'ar' ? 'المقاسات (افصلي بفاصلة)' : 'Sizes (comma-sep)') + '</label><input id="npSizes" value="S,M,L,XL" dir="ltr"></div>' +
        '<div class="f-field"><label>' + (lang === 'ar' ? 'المخزون' : 'Stock') + '</label><input id="npStock" type="number" value="10"></div>' +
        '<div class="f-field full"><label>' + (lang === 'ar' ? 'الوصف (عربي)' : 'Description (AR)') + '</label><textarea id="npDesc" rows="2"></textarea></div>' +
        '</div><button class="btn btn-primary" id="npSave">' + esc(t('save')) + '</button></div>';
      qs('#npSave').onclick = () => {
        const ar2 = qs('#npAr').value.trim(), en = qs('#npEn').value.trim(), price = +qs('#npPrice').value;
        if (!ar2 || !price) { toast(t('field_required'), true); return; }
        custom.push({
          id: 'c' + Date.now().toString(36), slug: 'custom-' + Date.now().toString(36),
          cat: qs('#npCat').value, name: { ar: ar2, en: en || ar2 },
          price, oldPrice: null, colors: ['black', 'white'],
          sizes: qs('#npSizes').value.split(',').map(s => s.trim()).filter(Boolean),
          stock: +qs('#npStock').value || 0, badges: ['new'], rating: 4.5, reviewsCount: 0,
          sku: 'BC-CU-' + String(custom.length + 1).padStart(3, '0'),
          art: ['#e8e2d6', '#a89578'],
          desc: { ar: qs('#npDesc').value.trim() || ar2, en: qs('#npDesc').value.trim() || en || ar2 },
          material: { ar: '—', en: '—' }, care: { ar: '—', en: '—' }
        });
        saveAll(); toast(t('saved')); pageAdmin();
      };
    };
  }
  if (adminTab === 'orders') {
    qsa('.ad-status').forEach(s => s.onchange = () => { orders[+s.dataset.i].status = s.value; saveAll(); toast(t('saved')); });
    qsa('.ad-view').forEach(b => b.onclick = () => {
      const o = orders[+b.dataset.i];
      openModal('<div style="padding:0 1.8rem 1.8rem"><h2 style="margin-bottom:.8rem">' + esc(o.num) + '</h2>' +
        '<p class="muted" style="margin-bottom:1rem">' + esc(o.customer.name) + ' · ' + esc(o.customer.phone) + ' · ' + esc(o.customer.address) + ', ' + esc(o.customer.city) + '</p>' +
        o.items.map(i => '<div style="display:flex;justify-content:space-between;padding:.4rem 0;border-bottom:1px solid var(--line);font-size:.9rem"><span>' + esc(i.name) + ' — ' + esc(i.size) + ' ×' + i.qty + '</span><span>' + fmt(i.price * i.qty) + '</span></div>').join('') +
        '<div class="sum-row total"><span>' + esc(t('total')) + '</span><span>' + fmt(o.total) + '</span></div>' +
        (o.customer.notes ? '<p class="muted mt-1">' + esc(o.customer.notes) + '</p>' : '') + '</div>');
    });
    const csv = qs('#adCsv');
    if (csv) csv.onclick = () => {
      const rows = [['num', 'date', 'name', 'phone', 'gov', 'city', 'total', 'status']].concat(
        orders.map(o => [o.num, o.date, o.customer.name, o.customer.phone, o.customer.gov, o.customer.city, o.total, o.status]));
      const blob = new Blob(['\ufeff' + rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'orders.csv'; a.click();
    };
  }
}

/* ================= ROUTER & BOOT ================= */

let lastPath = '';
function render(html, title) {
  qs('#app').innerHTML = html;
  document.title = (title ? title + ' | ' : '') + 'Bianca Corner — ' + (lang === 'ar' ? 'بيانكا كورنر' : 'Women\'s Fashion Egypt');
  bindChrome();
}

function route() {
  const h = location.hash.replace(/^#\/?/, '');
  const [path, qstr] = h.split('?');
  const q = new URLSearchParams(qstr || '');
  const seg = path.split('/').filter(Boolean);
  if (path !== lastPath) window.scrollTo(0, 0);
  lastPath = path;

  switch (seg[0] || '') {
    case '':          pageHome(); break;
    case 'shop':      pageShop(null, '', q.get('sort')); break;
    case 'category':  pageShop(seg[1], ''); break;
    case 'search':    pageShop(null, q.get('q') || ''); break;
    case 'product':   pageProduct(seg[1]); break;
    case 'cart':      pageCart(); break;
    case 'checkout':  pageCheckout(); break;
    case 'confirm':   pageConfirm(q.get('o')); break;
    case 'auth':      pageAuth(); break;
    case 'account':   pageAccount(); break;
    case 'wishlist':  pageWishlist(); break;
    case 'track':     pageTrack(); break;
    case 'about':     pageAbout(); break;
    case 'contact':   pageContact(); break;
    case 'shipping':  pagePolicy('shipping'); break;
    case 'returns':   pagePolicy('returns'); break;
    case 'privacy':   pagePolicy('privacy'); break;
    case 'terms':     pagePolicy('terms'); break;
    case 'faq':       pageFAQ(); break;
    case 'admin':     pageAdmin(); break;
    default:          pageShop(null, ''); break;
  }
}

document.documentElement.lang = lang;
document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
window.addEventListener('hashchange', route);
route();
