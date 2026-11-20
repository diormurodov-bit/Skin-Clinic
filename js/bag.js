document.addEventListener('DOMContentLoaded', async () => {
  const list = document.getElementById('bag-list');
  const total = document.getElementById('sum-total');
  const checkout = document.getElementById('checkout');

  function draw(cart) {
    const items = cart ? cart.items : [];
    setBagCount(cart);
    total.textContent = items.length ? formatPrice(cart.total) : '0';
    checkout.disabled = !items.length;
    if (!items.length) {
      if (!auth.isLoggedIn) {
        list.replaceChildren(
          h('div', { class: 'empty-bag-wrap' },
            h('div', { class: 'bag-empty' }, 'Please log in to view and manage your bag'),
            h('a', { href: 'login.html?next=bag.html', class: 'btn-pill btn-pill--black', style: 'max-width:240px;margin-top:16px;' }, 'Log In'),
          )
        );
      } else {
        list.replaceChildren(h('div', { class: 'bag-empty' }, 'No products in your bag'));
      }
      return;
    }
    list.replaceChildren(...items.map((item) => {
      const href = 'product.html?id=' + encodeURIComponent(item.productId);
      return h('div', { class: 'bag-item' },
        h('a', { class: 'bag-item__img', href }, productImage({ _id: item.productId, title: item.title })),
        h('div', { class: 'bag-item__body t-base' },
          h('a', { href }, item.title),
          h('span', {}, formatPrice(item.price)),
          h('button', {
            type: 'button',
            class: 'bag-item__remove',
            'aria-label': 'Remove',
            onclick: async () => {
              try {
                draw(await api.removeFromCart(item.productId));
              } catch {}
            },
          },
            h('img', { src: 'assets/icons/trash.svg', alt: 'Remove' }),
          ),
        ),
        h('div', { class: 'qty' },
          h('button', {
            type: 'button',
            'aria-label': 'Decrease quantity',
            disabled: item.qty <= 1,
            onclick: async () => {
              try {
                draw(await api.setQty(item.productId, item.qty - 1));
              } catch {}
            },
          }, h('img', { src: 'assets/icons/minus.svg', alt: '−' })),
          h('span', {}, item.qty),
          h('button', {
            type: 'button',
            'aria-label': 'Increase quantity',
            disabled: item.qty >= 20,
            onclick: async () => {
              try {
                draw(await api.setQty(item.productId, item.qty + 1));
              } catch {}
            },
          }, h('img', { src: 'assets/icons/plus.svg', alt: '+' })),
        ),
      );
    }));
  }

  checkout.addEventListener('click', () => {
    if (!auth.isLoggedIn) return goToLogin();
    location.href = 'checkout.html';
  });

  if (!auth.isLoggedIn) return draw(null);
  try {
    const [cart] = await Promise.all([api.cart(), ensureProductImages()]);
    draw(cart);
  } catch {
    draw(null);
  }
});
