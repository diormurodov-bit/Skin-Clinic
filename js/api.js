const API_BASE = 'https://api.wepro.uz/sandbox-shop';
const TOKEN_KEY = 'sc_token';
const USER_KEY = 'sc_user';

const auth = {
  get token() {
    try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  get user() {
    try {
      const raw = localStorage.getItem(USER_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },
  set(token, user) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch {}
  },
  setUser(user) {
    try {
      if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
      else localStorage.removeItem(USER_KEY);
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } catch {}
  },
  get isLoggedIn() {
    return Boolean(this.token);
  },
};

async function request(path, { method = 'GET', body, private: isPrivate = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (isPrivate) {
    if (!auth.token) throw new Error('Please log in');
    headers.Authorization = 'Bearer ' + auth.token;
  }
  const res = await fetch(API_BASE + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && isPrivate) auth.clear();
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

function query(params) {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') q.set(k, v);
  });
  const s = q.toString();
  return s ? '?' + s : '';
}

function unwrapCart(data) {
  const cart = data && data.cart ? data.cart : data;
  return { items: (cart && cart.items) || [], total: (cart && cart.total) || 0 };
}

const api = {
  register: (data) => request('/register', { method: 'POST', body: data }),
  login: (email, password) => request('/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/logout', { method: 'POST', private: true }),
  me: () => request('/me', { private: true }),
  products: (params = {}) => request('/products' + query(params)),
  newest: (limit) => request('/products/newest' + query({ limit })),
  bestsellers: (limit) => request('/products/bestsellers' + query({ limit })),
  product: (id) => request('/products/' + encodeURIComponent(id)),
  categories: () => request('/categories'),
  cart: () => request('/cart', { private: true }).then(unwrapCart),
  addToCart: (productId, qty = 1) => request('/cart', { method: 'POST', body: { productId, qty }, private: true }).then(unwrapCart),
  setQty: (productId, qty) => request('/cart/' + encodeURIComponent(productId), { method: 'PATCH', body: { qty }, private: true }).then(unwrapCart),
  removeFromCart: (productId) => request('/cart/' + encodeURIComponent(productId), { method: 'DELETE', private: true }).then(unwrapCart),
  createOrder: () => request('/orders', { method: 'POST', private: true }),
  addComment: (productId, text) => request('/products/' + encodeURIComponent(productId) + '/comments', { method: 'POST', body: { text }, private: true }),
  deleteComment: (productId, commentId) => request('/products/' + encodeURIComponent(productId) + '/comments/' + encodeURIComponent(commentId), { method: 'DELETE', private: true }),
};
