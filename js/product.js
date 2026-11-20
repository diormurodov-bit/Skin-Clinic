document.addEventListener('DOMContentLoaded', async () => {
  const id = new URLSearchParams(location.search).get('id') || FACE_TONER_ID;
  const msg = document.getElementById('pdp-msg');
  const addBtn = document.getElementById('add-to-cart');
  const qtyValue = document.getElementById('qty-value');
  const minus = document.getElementById('qty-minus');
  const plus = document.getElementById('qty-plus');
  const modal = document.getElementById('comment-modal');
  const form = document.getElementById('comment-form');
  const formError = document.getElementById('comment-error');
  const hint = document.getElementById('comment-hint');
  const counter = document.getElementById('comment-counter');
  let qty = 1;
  let isInBag = false;
  let isBusy = false;

  function drawQty() {
    qtyValue.textContent = qty;
    minus.disabled = qty <= 1;
    plus.disabled = qty >= 20;
  }

  function renderAddButton() {
    addBtn.disabled = isBusy;
    if (isInBag) {
      addBtn.classList.add('is-in-bag');
      addBtn.replaceChildren(
        h('img', { src: 'assets/icons/in-bag.svg', alt: '', width: '20', height: '20' }),
        h('span', {}, 'In your bag'),
      );
    } else {
      addBtn.classList.remove('is-in-bag');
      addBtn.textContent = isBusy ? 'Adding…' : 'Add to cart';
    }
  }

  function showNotice(text) {
    if (!text) {
      msg.hidden = true;
      msg.textContent = '';
      return;
    }
    msg.hidden = false;
    msg.className = 'pdp__msg';
    msg.textContent = text;
  }

  minus.addEventListener('click', () => { if (qty > 1) { qty--; drawQty(); } });
  plus.addEventListener('click', () => { if (qty < 20) { qty++; drawQty(); } });
  drawQty();
  renderAddButton();

  function drawReviews(product) {
    const comments = [...(product.comments || [])].sort((a, b) => new Date(b.at) - new Date(a.at));
    document.getElementById('reviews-count').textContent = '(' + comments.length + ')';
    const box = document.getElementById('reviews');
    if (!comments.length) {
      box.replaceChildren(h('p', { class: 'status-line' }, 'No reviews yet. Be the first to comment.'));
      return;
    }
    const ownIds = JSON.parse(localStorage.getItem('own-comment-ids') || '[]');
    const currentUser = auth.user;
    box.replaceChildren(...comments.map((c) => {
      const card = h('article', { class: 'review' },
        h('h3', { class: 'review__name' }, h('span', {}, c.author), h('img', { src: 'assets/icons/check.svg', alt: 'Verified' })),
        h('p', { class: 'review__text' }, c.text),
        h('span', { class: 'review__date' }, 'Posted on ' + formatDate(c.at)),
      );
      const isOwn = ownIds.includes(c._id) || (currentUser && (currentUser.name + ' ' + currentUser.surname).trim() === c.author);
      if (isOwn) {
        card.append(h('button', {
          type: 'button',
          class: 'review__delete',
          onclick: async () => {
            try {
              await api.deleteComment(id, c._id);
              const updatedIds = JSON.parse(localStorage.getItem('own-comment-ids') || '[]').filter((i) => i !== c._id);
              localStorage.setItem('own-comment-ids', JSON.stringify(updatedIds));
              load();
            } catch (err) {
              showNotice(err.message || 'Failed to delete comment');
            }
          },
        }, 'Delete'));
      }
      return card;
    }));
  }

  function renderProduct(product) {
    document.title = product.title + ' — Skin—Clinic';
    document.getElementById('pdp-img').replaceChildren(productImage(product));
    document.getElementById('pdp-title').textContent = product.title;
    document.getElementById('pdp-price').textContent = formatPrice(product.price);
    drawReviews(product);
  }

  const localFallback = FALLBACK_PRODUCTS.find((p) => p._id === id) || FALLBACK_PRODUCTS[0];
  renderProduct(localFallback);

  async function load() {
    try {
      const res = await api.product(id);
      if (res && res.product) renderProduct(res.product);
    } catch {}
  }

  await load();

  if (auth.isLoggedIn) {
    api.cart().then((cart) => {
      if (cart && Array.isArray(cart.items) && cart.items.some((item) => item.productId === id)) {
        isInBag = true;
        renderAddButton();
      }
    }).catch(() => {});
  }

  addBtn.addEventListener('click', async () => {
    if (isInBag) {
      location.href = 'bag.html';
      return;
    }
    if (!auth.isLoggedIn) return goToLogin();
    isBusy = true;
    showNotice('');
    renderAddButton();
    try {
      const cart = await api.addToCart(id, qty);
      setBagCount(cart);
      isInBag = true;
    } catch (e) {
      showNotice(e.message || 'Could not add to bag');
    } finally {
      isBusy = false;
      renderAddButton();
    }
  });

  document.getElementById('write-review').addEventListener('click', () => {
    if (!auth.isLoggedIn) return goToLogin();
    formError.textContent = '';
    form.reset();
    counter.textContent = '0/300';
    hint.textContent = 'Enter at least 2 characters';
    modal.hidden = false;
    form.text.focus();
  });

  form.text.addEventListener('input', () => {
    const len = form.text.value.length;
    counter.textContent = len + '/300';
    hint.textContent = form.text.value.trim().length < 2 ? 'Enter at least 2 characters' : 'Ready to send';
  });

  modal.addEventListener('click', (e) => { if (e.target === modal) modal.hidden = true; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.hidden = true; });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = form.text.value.trim();
    if (text.length < 2) { formError.textContent = 'Comment must be at least 2 characters'; return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    try {
      const res = await api.addComment(id, text);
      if (res && res.comment && res.comment._id) {
        const own = JSON.parse(localStorage.getItem('own-comment-ids') || '[]');
        localStorage.setItem('own-comment-ids', JSON.stringify([...own, res.comment._id]));
      }
      modal.hidden = true;
      showThanks('You left new comment');
      await load();
    } catch (err) {
      formError.textContent = err.message;
    } finally {
      btn.disabled = false;
    }
  });
});
