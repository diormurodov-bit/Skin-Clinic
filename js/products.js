document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const state = {
    category: params.get('category') || '',
    min: Math.max(0, Math.min(99, Number(params.get('minPrice') || 0))),
    max: Math.max(1, Math.min(100, Number(params.get('maxPrice') || 100))),
  };
  const grid = document.getElementById('grid');
  const title = document.getElementById('catalog-title');
  const catsBox = document.getElementById('filter-cats');
  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const fill = document.getElementById('range-fill');
  const labelMin = document.getElementById('label-min');
  const labelMax = document.getElementById('label-max');
  const resetBtn = document.getElementById('reset-filter');
  const rangeBox = document.getElementById('range');
  const priceToggle = document.getElementById('price-toggle');
  let categories = [...FALLBACK_CATEGORIES];

  function drawRange() {
    const a = Number(minInput.value);
    const b = Number(maxInput.value);
    minInput.style.zIndex = a > 50 ? '5' : '3';
    maxInput.style.zIndex = '4';
    fill.style.left = `calc(${a}% + ${10 - a * 0.2}px)`;
    fill.style.right = `calc(${100 - b}% + ${10 - (100 - b) * 0.2}px)`;
    labelMin.textContent = '$' + a;
    labelMax.textContent = '$' + b;
    resetBtn.hidden = !state.category && a === 0 && b === 100;
  }

  minInput.value = state.min;
  maxInput.value = Math.max(state.max, state.min + 1);

  minInput.addEventListener('input', () => {
    if (Number(minInput.value) >= Number(maxInput.value)) minInput.value = Number(maxInput.value) - 1;
    drawRange();
  });
  maxInput.addEventListener('input', () => {
    if (Number(maxInput.value) <= Number(minInput.value)) maxInput.value = Number(minInput.value) + 1;
    drawRange();
  });

  priceToggle.addEventListener('click', () => {
    const open = priceToggle.getAttribute('aria-expanded') === 'true';
    priceToggle.setAttribute('aria-expanded', String(!open));
    rangeBox.classList.toggle('is-collapsed', open);
  });

  function resolveCategory() {
    if (!state.category) return;
    const m = categories.find((c) => c._id === state.category || c.title.toLowerCase() === state.category.toLowerCase());
    if (m) state.category = m._id;
  }

  function drawCategories() {
    catsBox.replaceChildren(...categories.map((c) => {
      const isActive = state.category === c._id;
      const iconWrap = h('span', { class: 'filters__cat-icon' },
        h('img', { src: 'assets/icons/chevron.svg', alt: '', class: 'filters__chevron-right' }),
      );
      return h('button', {
        type: 'button',
        class: 'filters__cat' + (isActive ? ' is-active' : ''),
        onclick: () => { state.category = isActive ? '' : c._id; drawCategories(); drawRange(); },
      }, h('span', {}, c.title), iconWrap);
    }));
  }

  function updateTitle() {
    const cat = categories.find((c) => c._id === state.category);
    title.textContent = cat ? cat.title : 'All products';
  }

  function filterLocalProducts() {
    return FALLBACK_PRODUCTS.filter((p) => {
      if (state.category && p.categoryId !== state.category) return false;
      if (p.price < state.min || p.price > state.max) return false;
      return true;
    });
  }

  async function load() {
    const q = { limit: 50 };
    if (state.category) q.category = state.category;
    if (state.min > 0) q.minPrice = state.min;
    if (state.max < 100) q.maxPrice = state.max;
    try {
      const data = await api.products(q);
      const products = data.products || [];
      grid.replaceChildren(...(products.length ? products.map(productCard) : [h('p', { class: 'catalog__empty' }, 'No products match these filters')]));
    } catch {
      const fallback = filterLocalProducts();
      grid.replaceChildren(...(fallback.length ? fallback.map(productCard) : [h('p', { class: 'catalog__empty' }, 'No products match these filters')]));
    }
  }

  document.getElementById('apply-filter').addEventListener('click', () => {
    state.min = Number(minInput.value);
    state.max = Number(maxInput.value);
    const cat = categories.find((c) => c._id === state.category);
    const q = new URLSearchParams();
    if (cat) q.set('category', cat.title);
    if (state.min > 0) q.set('minPrice', state.min);
    if (state.max < 100) q.set('maxPrice', state.max);
    history.replaceState(null, '', 'products.html' + (q.toString() ? '?' + q : ''));
    updateTitle();
    load();
  });

  resetBtn.addEventListener('click', () => {
    state.category = '';
    state.min = 0;
    state.max = 100;
    minInput.value = 0;
    maxInput.value = 100;
    history.replaceState(null, '', 'products.html');
    drawCategories();
    drawRange();
    updateTitle();
    load();
  });

  getCategories().then((list) => {
    categories = list && list.length ? list : FALLBACK_CATEGORIES;
    resolveCategory();
    drawCategories();
    updateTitle();
    drawRange();
    load();
  });
});
