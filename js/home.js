document.addEventListener('DOMContentLoaded', () => {
  const best = document.getElementById('bestsellers');
  const cats = document.getElementById('categories');
  const featured = document.getElementById('featured');

  function renderCategories(list) {
    cats.replaceChildren(...(list || FALLBACK_CATEGORIES).slice(0, 3).map((cat) =>
      h('a', { class: 'category', href: 'products.html?category=' + encodeURIComponent(cat.title) },
        h('img', { src: cat.image || FALLBACK_CATEGORIES[0].image, alt: cat.title }),
        h('span', { class: 'btn-glass t-base' }, cat.title),
      )
    ));
  }

  best.replaceChildren(...FALLBACK_PRODUCTS.slice(0, 4).map(productCard));
  renderCategories(FALLBACK_CATEGORIES);
  const featuredFallback = Array.from({ length: 12 }, (_, i) => FALLBACK_PRODUCTS[i % 4]);
  featured.replaceChildren(...featuredFallback.map(productCard));

  api.bestsellers(4).then((d) => {
    if (d && d.products && d.products.length) {
      best.replaceChildren(...d.products.slice(0, 4).map(productCard));
    }
  }).catch(() => {});

  getCategories().then((list) => {
    renderCategories(list);
  });

  api.newest(12).then((d) => {
    if (d && d.products && d.products.length) {
      featured.replaceChildren(...d.products.slice(0, 12).map(productCard));
    }
  }).catch(() => {});
});
