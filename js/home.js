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

  best.replaceChildren(...Array.from({ length: 4 }, () => skeletonCard()));
  renderCategories(FALLBACK_CATEGORIES);
  featured.replaceChildren(...Array.from({ length: 4 }, () => skeletonCard()));

  api.bestsellers(4).then((d) => {
    const list = (d && d.products && d.products.length) ? d.products.slice(0, 4) : FALLBACK_PRODUCTS.slice(0, 4);
    best.replaceChildren(...list.map(productCard));
  }).catch(() => {
    best.replaceChildren(...FALLBACK_PRODUCTS.slice(0, 4).map(productCard));
  });

  getCategories().then((list) => {
    renderCategories(list);
  });

  const featuredFallback = Array.from({ length: 12 }, (_, i) => FALLBACK_PRODUCTS[i % 4]);
  api.newest(12).then((d) => {
    const list = (d && d.products && d.products.length) ? d.products.slice(0, 12) : featuredFallback;
    featured.replaceChildren(...list.map(productCard));
  }).catch(() => {
    featured.replaceChildren(...featuredFallback.map(productCard));
  });
});
