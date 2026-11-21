const FACE_TONER_ID = '6a971c79c3bac5823ed81a2b';

const FALLBACK_CATEGORIES = [
  {
    _id: '6a971bd8c3bac5823ed810c7',
    title: 'Creams',
    image: 'https://media.allure.com/photos/5db3549efcba1d0009083cf6/16:9/w_2560%2Cc_limit/applying-moisturizer-lede.jpg',
    productsCount: 11,
  },
  {
    _id: '6a971bf7c3bac5823ed810e8',
    title: 'Serums',
    image: 'https://img.magnific.com/free-photo/close-up-hands-holding-serum_23-2149182118.jpg',
    productsCount: 11,
  },
  {
    _id: '6a971c4fc3bac5823ed81612',
    title: 'Lotion',
    image: 'https://www.greenpeople.dk/cdn/shop/articles/bodylotion.jpg?crop=center&height=490&v=1614873593&width=817',
    productsCount: 10,
  },
];

const FALLBACK_PRODUCTS = [
  {
    _id: FACE_TONER_ID,
    title: 'Face Toner',
    price: 12,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGq4RHVODzFTf8fc8I7c5rtvLZTKLQTrNj4YMyl5oT82G5IAynldCNHv0&s=10',
    categoryId: '6a971bd8c3bac5823ed810c7',
    ordersCount: 62,
    commentsCount: 1,
  },
  {
    _id: '6a971cc3c3bac5823ed81a91',
    title: 'Dove',
    price: 15,
    image: 'https://westerncosmetics.com/cdn/shop/files/dove-fragrance-free-body-wash-ultra-sensitive-kenya-95109.jpg?v=1750798706&width=1214',
    categoryId: '6a971c4fc3bac5823ed81612',
    ordersCount: 117,
    commentsCount: 12,
  },
  {
    _id: '6a97a45ec3bac5823ed885d9',
    title: 'Lavender Calm Body Lotion',
    price: 16.9,
    image: 'https://www.instacart.com/assets/domains/product-image/file/large_403c9aeb-8e05-4dd1-b156-2fcd3b68c90d.png',
    categoryId: '6a971c4fc3bac5823ed81612',
    ordersCount: 83,
    commentsCount: 11,
  },
  {
    _id: '6a97a436c3bac5823ed88572',
    title: 'CocoBloom Nourishing Lotion',
    price: 18.5,
    image: 'https://www.bathandbloom.com/wp-content/uploads/2024/01/IG-Virgin-Coconut-Body-Lotion-Shower-Cream.jpg',
    categoryId: '6a971c4fc3bac5823ed81612',
    ordersCount: 49,
    commentsCount: 0,
  },
];

const PRODUCT_IMAGE_MAP = {};
FALLBACK_PRODUCTS.forEach((p) => {
  if (p._id && p.image) PRODUCT_IMAGE_MAP[p._id] = p.image;
});

let imagesPromise = null;
function ensureProductImages() {
  if (!imagesPromise) {
    imagesPromise = api.products({ limit: 100 })
      .then((d) => {
        if (d && Array.isArray(d.products)) {
          d.products.forEach((p) => {
            if (p._id && p.image) PRODUCT_IMAGE_MAP[p._id] = p.image;
          });
        }
        return PRODUCT_IMAGE_MAP;
      })
      .catch(() => PRODUCT_IMAGE_MAP);
  }
  return imagesPromise;
}

function productImageUrl(p) {
  const id = p && (p._id || p.productId);
  if (p && p.image) {
    if (id) PRODUCT_IMAGE_MAP[id] = p.image;
    return p.image;
  }
  if (id && PRODUCT_IMAGE_MAP[id]) return PRODUCT_IMAGE_MAP[id];
  const matched = FALLBACK_PRODUCTS.find((item) => item._id === id);
  return matched ? matched.image : FALLBACK_PRODUCTS[0].image;
}

function h(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (v === undefined || v === null || v === false) return;
    if (k === 'class') node.className = v;
    else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
    else node.setAttribute(k, v === true ? '' : v);
  });
  children.flat().forEach((c) => {
    if (c === null || c === undefined || c === false) return;
    node.append(c instanceof Node ? c : document.createTextNode(String(c)));
  });
  return node;
}

function formatPrice(value) {
  const n = Number(value) || 0;
  return '$' + (Number.isInteger(n) ? String(n) : n.toFixed(2));
}

function formatDate(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function productImage(p) {
  return h('img', { src: productImageUrl(p), alt: p.title || '', loading: 'lazy' });
}

function skeletonCard() {
  return h('div', { class: 'card skeleton-card' },
    h('div', { class: 'skeleton skeleton-img' }),
    h('div', { class: 'card__info' },
      h('span', { class: 'skeleton skeleton-title' }),
      h('span', { class: 'skeleton skeleton-price' }),
    ),
  );
}

function productCard(p) {
  return h('a', { class: 'card', href: 'product.html?id=' + encodeURIComponent(p._id || p.productId) },
    h('div', { class: 'card__img' }, productImage(p)),
    h('div', { class: 'card__info t-base' },
      h('span', { class: 'card__title' }, p.title),
      h('span', { class: 'card__price' }, formatPrice(p.price)),
    ),
  );
}

function goToLogin() {
  const back = location.pathname.split('/').pop() + location.search;
  location.href = 'login.html?next=' + encodeURIComponent(back);
}

function syncAccountLabels() {
  const label = auth.isLoggedIn && auth.user && auth.user.name ? auth.user.name : 'Account';
  document.querySelectorAll('[data-account-label]').forEach((el) => { el.textContent = label; });
  document.querySelectorAll('[data-profile-label]').forEach((el) => {
    el.textContent = auth.user && auth.user.name ? 'My Profile (' + auth.user.name + ')' : 'My Profile';
  });
}

function renderHeader() {
  const slot = document.getElementById('header');
  if (!slot) return;
  const currentPage = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const accountHref = auth.isLoggedIn ? 'profile.html' : 'login.html';
  const accountText = auth.isLoggedIn && auth.user && auth.user.name ? auth.user.name : 'Account';

  let open = false;
  const backdrop = h('div', { class: 'mobile-nav-backdrop', 'aria-hidden': 'true' });

  const chevron = () => h('img', { src: 'assets/icons/chevron.svg', alt: '', class: 'mobile-nav-chevron' });

  const accountLinks = auth.isLoggedIn
    ? [
        h('a', { href: 'profile.html', class: 'mobile-menu-link' + (currentPage === 'profile.html' ? ' is-active' : '') },
          h('span', { class: 'mobile-menu-title', 'data-profile-label': '' }, auth.user && auth.user.name ? 'My Profile (' + auth.user.name + ')' : 'My Profile'),
          chevron(),
        ),
        (() => {
          const logoutIcon = h('span', { class: 'mobile-menu-arrow' });
          logoutIcon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
          return h('button', {
            type: 'button',
            class: 'mobile-menu-link mobile-menu-logout',
            onclick: async () => {
              setOpen(false);
              try { await api.logout(); } catch {}
              auth.clear();
              location.href = 'login.html';
            },
          }, h('span', { class: 'mobile-menu-title' }, 'Log out'), logoutIcon);
        })(),
      ]
    : [
        h('a', { href: 'login.html', class: 'mobile-menu-link' + (currentPage === 'login.html' ? ' is-active' : '') },
          h('span', { class: 'mobile-menu-title' }, 'Log In'),
          chevron(),
        ),
        h('a', { href: 'register.html', class: 'mobile-menu-link' + (currentPage === 'register.html' ? ' is-active' : '') },
          h('span', { class: 'mobile-menu-title' }, 'Register'),
          chevron(),
        ),
      ];

  const mobileNav = h('nav', { class: 'mobile-nav t-base', 'aria-label': 'Mobile navigation', 'aria-hidden': 'true' },
    h('div', { class: 'mobile-menu-section' },
      h('a', { href: 'index.html', class: 'mobile-menu-link' + (currentPage === 'index.html' || currentPage === '' ? ' is-active' : '') },
        h('span', { class: 'mobile-menu-title' }, 'Home'),
        chevron(),
      ),
      h('a', { href: 'products.html', class: 'mobile-menu-link' + (currentPage === 'products.html' ? ' is-active' : '') },
        h('span', { class: 'mobile-menu-title' }, 'All Products'),
        chevron(),
      ),
    ),
    h('div', { class: 'mobile-menu-divider' }),
    h('div', { class: 'mobile-menu-section' },
      h('a', { href: 'bag.html', class: 'mobile-menu-link' + (currentPage === 'bag.html' ? ' is-active' : '') },
        h('span', { class: 'mobile-menu-title' }, 'Bag'),
        h('div', { class: 'mobile-menu-right' },
          h('span', { class: 'mobile-badge', 'data-bag-badge': '', hidden: true }, '0'),
          chevron(),
        ),
      ),
      ...accountLinks,
    ),
  );

  const menuBtn = h('button', { type: 'button', class: 'header__menu', 'aria-label': 'Open navigation', 'aria-expanded': 'false' });
  menuBtn.innerHTML =
    '<svg class="menu-svg menu-svg--open" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>' +
    '<svg class="menu-svg menu-svg--close" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="#000000" stroke-width="2" stroke-linecap="round" aria-hidden="true" style="display:none"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
  const openSvg = menuBtn.querySelector('.menu-svg--open');
  const closeSvg = menuBtn.querySelector('.menu-svg--close');

  function setOpen(next) {
    open = next;
    menuBtn.classList.toggle('is-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    openSvg.style.display = open ? 'none' : 'block';
    closeSvg.style.display = open ? 'block' : 'none';
    mobileNav.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    mobileNav.setAttribute('aria-hidden', String(!open));
    backdrop.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }

  menuBtn.addEventListener('click', () => setOpen(!open));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && open) setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860 && open) setOpen(false); });

  slot.replaceWith(h('div', { class: 'header-shell' },
    h('header', { class: 'header' },
      h('div', { class: 'header__inner t-base' },
        h('nav', { class: 'header__nav' },
          h('a', { href: 'index.html' }, 'Home'),
          h('a', { href: 'products.html' }, 'Products'),
        ),
        menuBtn,
        h('a', { class: 'header__logo', href: 'index.html', 'aria-label': 'WEPRO home' },
          h('img', { src: 'assets/img/logo.webp', alt: 'WEPRO' }),
        ),
        h('div', { class: 'header__nav' },
          h('a', { class: 'header__account', href: accountHref, 'data-account-label': '' }, accountText),
          h('a', { class: 'header__bag', href: 'bag.html', 'data-bag-count': '' }, 'Bag (0)'),
        ),
        h('a', { class: 'header__account header__m', href: accountHref, 'data-account-label': '' }, accountText),
        h('a', { class: 'header__bag header__m', href: 'bag.html', 'data-bag-count': '' }, 'Bag (0)'),
      ),
    ),
    backdrop,
    mobileNav,
  ));
}

function setBagCount(cart) {
  const count = cart && Array.isArray(cart.items) ? cart.items.length : 0;
  document.querySelectorAll('[data-bag-count]').forEach((n) => { n.textContent = 'Bag (' + count + ')'; });
  document.querySelectorAll('[data-bag-badge]').forEach((b) => {
    b.textContent = String(count);
    b.hidden = count <= 0;
  });
}

let categoriesPromise = null;
function getCategories() {
  if (!categoriesPromise) {
    categoriesPromise = api.categories()
      .then((d) => (d && d.categories && d.categories.length ? d.categories : FALLBACK_CATEGORIES))
      .catch(() => FALLBACK_CATEGORIES);
  }
  return categoriesPromise;
}

function renderFooter() {
  const slot = document.getElementById('footer');
  if (!slot) return;
  const infoLink = (text, section) => h('a', { href: 'info.html?section=' + encodeURIComponent(section) }, text);
  const catLinks = [
    ['Creams', 'Creams'],
    ['Serums', 'Serums'],
    ['Lotions', 'Lotion'],
  ].map(([label, query]) => h('a', { href: 'products.html?category=' + encodeURIComponent(query) }, label));

  slot.replaceWith(h('footer', { class: 'footer t-base' },
    h('div', { class: 'footer__top' },
      h('div', { class: 'footer__col footer__col--logo' },
        h('div', { class: 'footer__logo' }, h('img', { src: 'assets/icons/footer-logo.svg', alt: 'Skin—Clinic' })),
        h('div', { class: 'footer__social' },
          h('a', { href: 'https://www.instagram.com/skinclinicuz/', target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Instagram' }, h('img', { src: 'assets/icons/instagram.svg', alt: 'Instagram' })),
          h('a', { href: 'https://www.facebook.com/profile.php?id=61582733457866', target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'Facebook' }, h('img', { src: 'assets/icons/facebook.svg', alt: 'Facebook' })),
          h('a', { href: 'https://www.youtube.com/channel/UC4Iqqq1HIL3eQwEZO6SNmzg', target: '_blank', rel: 'noopener noreferrer', 'aria-label': 'YouTube' }, h('img', { src: 'assets/icons/youtube.svg', alt: 'YouTube' })),
        ),
      ),
      h('div', { class: 'footer__col footer__col--products' },
        h('p', { class: 'footer__title t-sub' }, 'Products'),
        h('div', { class: 'footer__links' }, catLinks, h('a', { href: 'products.html' }, 'Shop all')),
      ),
      h('div', { class: 'footer__col footer__col--support' },
        h('p', { class: 'footer__title t-sub' }, 'Support'),
        h('div', { class: 'footer__links' },
          infoLink('FAQs', 'faqs'),
          infoLink('Return policy', 'return-policy'),
          infoLink('Shipping policy', 'shipping-policy'),
          infoLink('Start a return', 'start-return'),
        ),
      ),
      h('div', { class: 'footer__col footer__col--company' },
        h('p', { class: 'footer__title t-sub' }, 'Company'),
        h('div', { class: 'footer__links' },
          infoLink('About us', 'about'),
          infoLink('Journal', 'journal'),
          infoLink('Contact us', 'contact'),
        ),
      ),
    ),
    h('div', { class: 'footer__divider' }),
    h('div', { class: 'footer__bottom' },
      h('span', {}, '© 2025 Skin—Clinic'),
      h('div', { class: 'footer__legal' },
        infoLink('Terms of service', 'terms'),
        infoLink('Privacy policy', 'privacy'),
        infoLink('Cookies settings', 'cookies'),
      ),
    ),
  ));
}

function showThanks(subtitle, onClose) {
  function close() {
    document.removeEventListener('keydown', onKey);
    modal.remove();
    if (onClose) onClose();
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
  }
  const modal = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true' },
    h('div', { class: 'modal__card modal__card--thanks' },
      h('h2', { class: 'thanks__title' }, 'Thank you!'),
      h('p', { class: 'thanks__sub' }, subtitle),
      h('button', { type: 'button', class: 'thanks__btn', onclick: close }, 'Okay'),
    ),
  );
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  document.addEventListener('keydown', onKey);
  document.body.append(modal);
}

document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  renderFooter();
  if (!auth.isLoggedIn) {
    setBagCount(null);
    return;
  }
  if (!auth.user) {
    api.me().then((d) => {
      if (d && d.user) {
        auth.setUser(d.user);
        syncAccountLabels();
      }
    }).catch(() => {});
  }
  try {
    setBagCount(await api.cart());
  } catch {
    setBagCount(null);
  }
});
