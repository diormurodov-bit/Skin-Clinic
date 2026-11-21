document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isLoggedIn) { goToLogin(); return; }
  document.getElementById('logout').addEventListener('click', async () => {
    try { await api.logout(); } catch {}
    auth.clear();
    location.href = 'login.html';
  });

  function draw(user) {
    if (!user) return;
    document.getElementById('p-name').textContent = (user.name + ' ' + user.surname).trim();
    document.getElementById('p-phone').textContent = '+' + String(user.phone || '').replace(/^\+/, '');
    document.getElementById('p-email').textContent = user.email || '';
  }

  function drawOrders(orders) {
    const box = document.getElementById('p-orders');
    if (!box) return;
    if (!orders || !orders.length) {
      box.innerHTML = `
        <div class="profile-orders-empty">
          <p>You haven't placed any orders yet.</p>
          <a href="products.html" class="btn-pill btn-pill--black" style="max-width:200px;margin-top:14px;display:inline-flex;">Browse Catalog</a>
        </div>
      `;
      return;
    }

    box.innerHTML = '';
    orders.forEach((ord) => {
      const dateStr = ord.createdAt ? new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Recent';
      const orderCard = h('article', { class: 'profile-order-card' },
        h('div', { class: 'profile-order-head' },
          h('div', {},
            h('span', { class: 'profile-order-num' }, '#' + (ord._id ? ord._id.slice(-8).toUpperCase() : 'ORDER')),
            h('span', { class: 'profile-order-date' }, ' • ' + dateStr),
          ),
          h('span', { class: 'profile-order-total' }, formatPrice(ord.total || 0)),
        ),
        h('div', { class: 'profile-order-items' },
          ...(ord.items || []).map((it) =>
            h('div', { class: 'profile-order-item' },
              productImage({ _id: it.productId, title: it.title }),
              h('div', { class: 'profile-order-meta' },
                h('span', { class: 'profile-order-title' }, it.title),
                h('span', { class: 'profile-order-qty' }, 'Qty: ' + (it.qty || 1)),
              ),
              h('span', { class: 'profile-order-sum' }, formatPrice(it.sum || (it.price * (it.qty || 1)))),
            )
          )
        )
      );
      box.append(orderCard);
    });
  }

  if (auth.user) draw(auth.user);
  await ensureProductImages();

  try {
    const { user } = await api.me();
    auth.setUser(user);
    syncAccountLabels();
    draw(user);
  } catch {
    if (!auth.user) goToLogin();
  }

  try {
    const res = await api.orders();
    drawOrders(res && res.orders ? res.orders : []);
  } catch (e) {
    const box = document.getElementById('p-orders');
    if (box) {
      box.innerHTML = '<p class="profile-orders-empty">Could not load orders history.</p>';
    }
  }
});
