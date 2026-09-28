// Test harness — run under jsc: stubs DOM, loads app, exercises routes
function makeEl() {
  const el = {
    children: [], style: {}, dataset: {},
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false } },
    _html: '',
    set innerHTML(v) { this._html = v; },
    get innerHTML() { return this._html; },
    addEventListener() {}, removeEventListener() {},
    appendChild() {}, insertAdjacentHTML() {}, remove() {}, focus() {}, click() {},
    querySelector() { return makeEl(); },
    querySelectorAll() { return []; },
    closest() { return makeEl(); },
    setAttribute() {}, getAttribute() { return null; },
    value: '', checked: false, textContent: '', className: '', scrollHeight: 100,
    disabled: false
  };
  return el;
}

var document = {
  _els: {},
  querySelector(s) { if (!this._els[s]) this._els[s] = makeEl(); return this._els[s]; },
  querySelectorAll() { return []; },
  createElement() { return makeEl(); },
  documentElement: makeEl(),
  head: makeEl(),
  title: ''
};
var window = { addEventListener() {}, scrollTo() {} };
var location = { hash: '' };
var localStorage = { _s: {}, getItem(k) { return this._s[k] || null; }, setItem(k, v) { this._s[k] = v; }, removeItem(k) { delete this._s[k]; } };
var navigator = {};
var URLSearchParams = function (s) {
  const m = {};
  if (s) s.split('&').forEach(kv => { const p = kv.split('='); m[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || ''); });
  this.get = k => (k in m ? m[k] : null);
};
var URL2 = { createObjectURL() { return ''; } };
var Blob = function () {};
var URL = URL2;
var setTimeoutOrig = setTimeout;

load('assets/js/data.js');
load('assets/js/i18n.js');
load('assets/js/app.js');

print('--- app.js loaded, initial route ran ---');
print('products: ' + products().length);
print('fmt test: ' + fmt(1234));

const routes = ['', '/shop', '/category/dresses', '/category/jeans', '/search?q=فستان', '/product/d01', '/product/j03', '/cart', '/about', '/contact', '/shipping', '/returns', '/privacy', '/terms', '/faq', '/track', '/auth', '/account', '/wishlist', '/admin'];
let fails = 0;
routes.forEach(r => {
  try { location.hash = '#'; lastPath = ''; location.hash = '#' + r; route(); print('OK   ' + (r || '/')); }
  catch (e) { fails++; print('FAIL ' + (r || '/') + ' :: ' + e); }
});

// simulate add to cart + checkout submit
try {
  cart = [];
  addToCart('d01', 'M', 'black', 2);
  addToCart('t01', 'S', 'white', 1);
  print('cart lines: ' + cartLines().length + ' subtotal: ' + cartTotals().subtotal);

  // coupon
  coupon = 'BIANCA10';
  const tot = cartTotals('cairo');
  print('with coupon: disc=' + tot.discount + ' ship=' + tot.shipFee + ' total=' + tot.total);

  pageCheckout();
  const els = s => document.querySelector(s);
  els('#cName').value = 'Test User';
  els('#cEmail').value = 'test@x.com';
  els('#cPhone').value = '01012345678';
  els('#cWa').value = '01012345678';
  els('#cGov').value = 'cairo';
  els('#cCity').value = 'Nasr City';
  els('#cAddr').value = '12 Test Street, Apt 3';
  els('#coForm').onsubmit({ preventDefault() {} });
  print('orders after submit: ' + orders.length + (orders[0] ? ' num=' + orders[0].num + ' total=' + orders[0].total : ''));
  if (orders[0]) { pageConfirm(orders[0].num); print('confirm page OK'); }
  location.hash = '#/track'; route();
  els('#tNum').value = orders[0].num; els('#tPhone').value = '01012345678';
  els('#tGo').onclick();
  print('track OK');
} catch (e) { print('CHECKOUT FAIL :: ' + e + '\n' + e.stack); }

// language flip
try { lang = 'en'; route(); print('EN home OK'); lang = 'ar'; } catch (e) { print('EN FAIL: ' + e); }

print('=== ' + fails + ' route failures ===');
