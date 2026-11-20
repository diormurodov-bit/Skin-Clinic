// Bag: GET/PATCH/DELETE /cart -> checkout.html
document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('bag-list');
  const subtotal = document.getElementById('sum-subtotal');
  const total = document.getElementById('sum-total');
  const checkout = document.getElementById('checkout');
  const msg = document.getElementById('bag-msg');
  let busy = false;
  let currentItems = [];

  function setMsg(text) {
    if (msg) msg.textContent = text || '';
  }

  function draw(cart) {
    const items = cart ? cart.items : [];
    currentItems = items;
    setBagCount(cart);
    document.body.classList.toggle('page-bag--empty', items.length === 0);
    const t = cart && items.length ? formatPrice(cart.total) : '0';
    total.textContent = t;
    if (subtotal) subtotal.textContent = t;

    if (!items.length) {
      list.replaceChildren(h('div', { class: 'bag-empty' }, 'No products in your bag'));
      return;
    }

    list.replaceChildren(...items.map((item) => {
      const minus = h('button', {
        type: 'button',
        'aria-label': 'Decrease',
        disabled: item.qty <= 1,
        onclick: () => update(() => api.setQty(item.productId, item.qty - 1)),
      }, h('img', { src: 'assets/icons/minus.svg', alt: '' }));

      const plus = h('button', {
        type: 'button',
        'aria-label': 'Increase',
        disabled: item.qty >= 20,
        onclick: () => update(() => api.setQty(item.productId, item.qty + 1)),
      }, h('img', { src: 'assets/icons/plus.svg', alt: '' }));

      const href = 'product.html?id=' + encodeURIComponent(item.productId);
      return h('div', { class: 'bag-item' },
        h('a', { class: 'bag-item__img', href }, productImage({ _id: item.productId, title: item.title, image: item.image })),
        h('div', { class: 'bag-item__body t-base' },
          h('a', { class: 'bag-item__title', href }, item.title),
          h('p', { class: 'bag-item__price' }, formatPrice(item.price)),
          h('button', {
            class: 'bag-item__remove',
            type: 'button',
            'aria-label': 'Remove',
            onclick: () => update(() => api.removeFromCart(item.productId)),
          }, h('img', { src: 'assets/icons/trash.svg', alt: '' })),
          h('div', { class: 'qty' }, minus, h('span', { class: 'qty__value' }, item.qty), plus),
        ),
      );
    }));
  }

  async function update(action) {
    if (busy) return;
    busy = true;
    setMsg('');
    list.classList.add('loading');
    try {
      draw(await action());
    } catch (e) {
      if (e.status === 401) return goToLogin();
      setMsg(e.message || 'Could not update your bag');
    }
    list.classList.remove('loading');
    busy = false;
  }

  checkout.addEventListener('click', () => {
    if (!auth.isLoggedIn) return goToLogin();
    if (busy) return;
    if (!currentItems.length) {
      setMsg('Your bag is empty');
      return;
    }
    location.href = 'checkout.html';
  });

  if (!auth.isLoggedIn) {
    draw(null);
    return;
  }

  try {
    const [cart] = await Promise.all([api.cart(), ensureProductImages()]);
    draw(cart);
  } catch (e) {
    if (e.status === 401) {
      draw(null);
      return;
    }
    list.replaceChildren(statusText(e.message));
  }
});
