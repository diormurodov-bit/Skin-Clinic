document.addEventListener('DOMContentLoaded', async () => {
  const root = document.getElementById('checkout-root');
  if (!auth.isLoggedIn) {
    location.href = 'login.html?next=checkout.html';
    return;
  }

  function formatVideoTime(sec) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ':' + String(s).padStart(2, '0');
  }

  function openVideoPlayerModal() {
    let isMuted = false;
    let speed = 1;
    let speedOpen = false;
    const speeds = [0.5, 1, 1.25, 1.5, 2];

    const player = h('video', {
      class: 'video-modal-player',
      src: 'assets/video/presentation.mp4',
      autoplay: true,
      playsinline: true,
      controlslist: 'nodownload noplaybackrate',
      disablepictureinpicture: 'true',
    });
    player.controls = false;
    player.addEventListener('contextmenu', (e) => e.preventDefault());

    const shield = h('div', { class: 'video-player-shield' });
    shield.addEventListener('contextmenu', (e) => e.preventDefault());

    const playBtn = h('button', { type: 'button', class: 'video-ctrl-btn', 'aria-label': 'Pause' });
    const timeLabel = h('span', { class: 'video-time' }, '0:00 / 0:00');
    const seek = h('input', { type: 'range', class: 'video-seek', min: '0', max: '100', step: '0.1', value: '0', 'aria-label': 'Seek video' });
    const muteBtn = h('button', { type: 'button', class: 'video-ctrl-btn', 'aria-label': 'Mute sound', title: 'Sound' });
    const speedBtn = h('button', { type: 'button', class: 'video-ctrl-btn video-speed-btn', 'aria-label': 'Playback speed', title: 'Speed' });
    const speedMenu = h('div', { class: 'video-speed-menu', hidden: true });
    const fsBtn = h('button', { type: 'button', class: 'video-ctrl-btn', 'aria-label': 'Fullscreen', title: 'Fullscreen' });
    fsBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';

    function setSpeedOpen(next) {
      speedOpen = next;
      speedMenu.hidden = !speedOpen;
      speedBtn.setAttribute('aria-expanded', String(speedOpen));
    }

    function syncPlayIcon() {
      playBtn.innerHTML = player.paused
        ? '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><polygon points="7,4 20,12 7,20"/></svg>'
        : '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>';
      playBtn.setAttribute('aria-label', player.paused ? 'Play' : 'Pause');
    }

    function syncMuteIcon() {
      muteBtn.innerHTML = isMuted
        ? '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg>'
        : '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" stroke="none"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>';
      muteBtn.setAttribute('aria-label', isMuted ? 'Unmute sound' : 'Mute sound');
    }

    function syncSpeedBtn() {
      speedBtn.innerHTML = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg><span>' + speed + '×</span>';
      speedMenu.replaceChildren(...speeds.map((s) => h('button', {
        type: 'button',
        class: speed === s ? 'is-active' : '',
        onclick: (e) => {
          e.stopPropagation();
          speed = s;
          player.playbackRate = s;
          setSpeedOpen(false);
          syncSpeedBtn();
        },
      }, s + '×')));
    }

    function togglePlay() {
      if (player.paused) player.play().catch(() => {});
      else player.pause();
      syncPlayIcon();
    }

    shield.addEventListener('click', () => {
      if (speedOpen) setSpeedOpen(false);
      else togglePlay();
    });
    playBtn.addEventListener('click', togglePlay);
    muteBtn.addEventListener('click', () => { isMuted = !isMuted; player.muted = isMuted; syncMuteIcon(); });
    speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setSpeedOpen(!speedOpen);
    });
    seek.addEventListener('input', () => { player.currentTime = Number(seek.value); });

    player.addEventListener('loadedmetadata', () => {
      seek.max = String(player.duration || 100);
      timeLabel.textContent = formatVideoTime(player.currentTime) + ' / ' + formatVideoTime(player.duration);
    });
    player.addEventListener('timeupdate', () => {
      seek.value = String(player.currentTime);
      timeLabel.textContent = formatVideoTime(player.currentTime) + ' / ' + formatVideoTime(player.duration);
    });
    player.addEventListener('play', syncPlayIcon);
    player.addEventListener('pause', syncPlayIcon);
    player.addEventListener('ended', syncPlayIcon);

    const closeBtn = h('button', { type: 'button', class: 'video-modal-close', 'aria-label': 'Close video player' });
    closeBtn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

    const speedWrap = h('div', { class: 'video-speed-wrap' }, speedBtn, speedMenu);
    speedWrap.addEventListener('click', (e) => e.stopPropagation());

    const controlsBar = h('div', { class: 'video-controls-bar' },
      playBtn,
      timeLabel,
      seek,
      muteBtn,
      speedWrap,
      fsBtn,
    );
    controlsBar.addEventListener('contextmenu', (e) => e.preventDefault());

    const modalBox = h('div', { class: 'video-modal' },
      closeBtn,
      h('div', { class: 'video-player-stage' }, player, shield),
      controlsBar,
    );
    modalBox.addEventListener('contextmenu', (e) => e.preventDefault());
    modalBox.addEventListener('click', (e) => {
      e.stopPropagation();
      if (speedOpen) setSpeedOpen(false);
    });

    const layer = h('div', { class: 'modal video-modal-layer', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Skin—Clinic Website Presentation Video' }, modalBox);

    function closePlayer() {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      layer.remove();
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        if (speedOpen) setSpeedOpen(false);
        else closePlayer();
      }
    }

    closeBtn.addEventListener('click', closePlayer);
    layer.addEventListener('click', (e) => { if (e.target === layer) closePlayer(); });
    fsBtn.addEventListener('click', () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      else if (modalBox.requestFullscreen) modalBox.requestFullscreen().catch(() => {});
    });

    syncPlayIcon();
    syncMuteIcon();
    syncSpeedBtn();
    setSpeedOpen(false);
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    document.body.append(layer);
    if (modalBox.requestFullscreen && !document.fullscreenElement) {
      modalBox.requestFullscreen().catch(() => {});
    }
  }

  function createPresentationCard() {
    const preview = h('video', {
      src: 'assets/video/presentation.mp4#t=2',
      preload: 'metadata',
      muted: true,
      loop: true,
      playsinline: true,
      controlslist: 'nodownload noplaybackrate',
      disablepictureinpicture: 'true',
      'aria-hidden': 'true',
    });
    preview.muted = true;
    preview.controls = false;
    preview.addEventListener('contextmenu', (e) => e.preventDefault());

    const startMini = () => { preview.muted = true; preview.play().catch(() => {}); };
    const stopMini = () => { preview.pause(); };

    const btn = h('button', {
      type: 'button',
      class: 'apple-video-card apple-video-card--checkout',
      'aria-label': 'Watch Skin—Clinic presentation video',
    },
      h('div', { class: 'apple-video-media' }, preview),
      h('div', { class: 'apple-video-body' },
        h('h3', {}, 'Skin—Clinic Presentation'),
        h('p', {}, 'Hover to preview silently or click to watch in full screen with sound and speed controls.'),
      ),
    );
    btn.addEventListener('click', () => { stopMini(); openVideoPlayerModal(); });
    btn.addEventListener('mouseenter', startMini);
    btn.addEventListener('mouseleave', stopMini);
    btn.addEventListener('touchstart', startMini, { passive: true });
    btn.addEventListener('touchcancel', stopMini);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());
    return h('div', { class: 'checkout-video-wrap' }, btn);
  }

  const pickupPoints = [
    { id: 'pickup-1', name: 'Skin Clinic Flagship — Tashkent Central', address: 'Amir Timur Avenue 45, Tashkent', hours: 'Daily 10:00 – 21:00', city: 'Tashkent' },
    { id: 'pickup-2', name: 'Skin Clinic Boutique — Samarkand Plaza', address: 'Registan Street 12, Samarkand', hours: 'Daily 10:00 – 20:00', city: 'Samarkand' },
    { id: 'pickup-3', name: 'Skin Clinic Point — Bukhara Old City', address: 'Naqshbandi Street 8, Bukhara', hours: 'Daily 09:30 – 19:30', city: 'Bukhara' },
  ];

  const [cart, meRes] = await Promise.all([
    api.cart().catch(() => ({ items: [], total: 0 })),
    api.me().catch(() => ({ user: auth.user })),
    ensureProductImages(),
  ]);
  const user = (meRes && meRes.user) || auth.user || null;
  if (user) { auth.setUser(user); syncAccountLabels(); }
  setBagCount(cart);

  if (!cart.items.length) {
    root.innerHTML = `
      <div class="empty-bag-wrap" style="margin:60px auto;text-align:center;">
        <h1>Your bag is empty</h1>
        <p style="color:#777;margin:16px 0 24px;">Add items to your bag before checking out.</p>
        <a href="products.html" class="btn-pill btn-pill--black" style="max-width:240px;margin:0 auto;">Browse Products</a>
      </div>`;
    const videoWrap = createPresentationCard();
    videoWrap.style.maxWidth = '360px';
    videoWrap.style.margin = '24px auto 0';
    root.append(videoWrap);
    return;
  }

  let deliveryType = 'home';
  let selectedPickup = pickupPoints[0].name;
  let deliveryMethod = 'standard';
  let paymentMethod = 'cash';
  let formError = '';

  let recipientName = user ? (user.name + ' ' + user.surname).trim() : '';
  let recipientPhone = user && user.phone ? '+' + String(user.phone).replace(/^\+/, '') : '+998';
  let recipientEmail = (user && user.email) || '';
  let city = 'Tashkent';
  let address = '';
  let notes = '';

  function saveInputState() {
    const n = document.getElementById('co-name');
    const p = document.getElementById('co-phone');
    const em = document.getElementById('co-email');
    const c = document.getElementById('co-city');
    const a = document.getElementById('co-address');
    const no = document.getElementById('co-notes');
    if (n) recipientName = n.value;
    if (p) recipientPhone = p.value;
    if (em) recipientEmail = em.value;
    if (c) city = c.value;
    if (a) address = a.value;
    if (no) notes = no.value;
  }

  function isCheckoutReady() {
    const phoneDigits = recipientPhone.replace(/\D/g, '');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail.trim());
    const addrOk = deliveryType === 'pickup'
      ? Boolean(selectedPickup)
      : Boolean(city) && address.trim().length >= 3;
    return (
      recipientName.trim().length > 0 &&
      phoneDigits.length >= 9 &&
      emailOk &&
      addrOk &&
      Boolean(deliveryMethod) &&
      Boolean(paymentMethod)
    );
  }

  function syncSubmitButton() {
    const submitBtn = document.getElementById('co-submit');
    const hintEl = document.getElementById('co-hint');
    const ready = isCheckoutReady();
    if (submitBtn) submitBtn.disabled = !ready;
    if (hintEl) hintEl.hidden = ready;
  }

  function renderForm() {
    const shippingFee = deliveryMethod === 'express' ? 5 : 0;
    const grandTotal = cart.total + shippingFee;
    const activePickup = pickupPoints.find((p) => p.name === selectedPickup) || pickupPoints[0];

    root.innerHTML = `
      <div class="checkout-header">
        <a href="bag.html" class="checkout-back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          <span>Back to Bag</span>
        </a>
        <div class="checkout-header-row">
          <h1>Checkout</h1>
          <span class="checkout-secure-badge">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Secure 256-Bit Checkout</span>
          </span>
        </div>
      </div>
      <div id="checkout-error">${formError ? `<div class="checkout-error">${formError}</div>` : ''}</div>
      <form id="checkout-form" class="checkout-grid" novalidate>
        <div class="checkout-main">
          <section class="checkout-card">
            <div class="checkout-card-head">
              <span class="checkout-step-badge">1</span>
              <h2>Contact &amp; Delivery Address</h2>
            </div>
            <div class="map-pickup-tabs">
              <button type="button" class="map-pickup-tab ${deliveryType === 'home' ? 'active' : ''}" data-dtype="home">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                <span>Courier Delivery</span>
              </button>
              <button type="button" class="map-pickup-tab ${deliveryType === 'pickup' ? 'active' : ''}" data-dtype="pickup">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>Pickup Boutique</span>
              </button>
            </div>
            <div class="checkout-fields">
              <div class="checkout-field-row">
                <label>
                  <span>Recipient Name <b class="req">*</b></span>
                  <input id="co-name" required type="text" placeholder="Alex Adams" autocomplete="name">
                </label>
                <label>
                  <span>Phone Number <b class="req">*</b></span>
                  <input id="co-phone" required type="tel" placeholder="+998 90 123 45 67" autocomplete="tel">
                </label>
              </div>
              <div class="checkout-field-row">
                <label>
                  <span>Email Address <b class="req">*</b></span>
                  <input id="co-email" required type="email" placeholder="you@example.com" autocomplete="email">
                </label>
                ${deliveryType === 'home' ? `
                  <label>
                    <span>City / Region <b class="req">*</b></span>
                    <select id="co-city">
                      <option value="Tashkent" ${city === 'Tashkent' ? 'selected' : ''}>Tashkent</option>
                      <option value="Samarkand" ${city === 'Samarkand' ? 'selected' : ''}>Samarkand</option>
                      <option value="Bukhara" ${city === 'Bukhara' ? 'selected' : ''}>Bukhara</option>
                      <option value="Andijan" ${city === 'Andijan' ? 'selected' : ''}>Andijan</option>
                      <option value="Namangan" ${city === 'Namangan' ? 'selected' : ''}>Namangan</option>
                      <option value="Fergana" ${city === 'Fergana' ? 'selected' : ''}>Fergana</option>
                    </select>
                  </label>
                ` : ''}
              </div>
              ${deliveryType === 'home' ? `
                <label>
                  <span>Delivery Address (Street, Building, Apt) <b class="req">*</b></span>
                  <input id="co-address" required type="text" placeholder="e.g. Navoi street, Building 14, Apt 25">
                </label>
                <div class="map-preview-container" id="co-courier-map" ${address.trim() ? '' : 'hidden'}>
                  <div class="map-preview-label">
                    <span class="map-dot"></span>
                    <b>Location:</b> <span id="co-map-addr-text"></span>
                  </div>
                  <iframe title="Delivery location map" width="100%" height="150" style="border:0;display:block" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=69.15,41.25,69.35,41.35&layer=mapnik&marker=41.311081,69.240562"></iframe>
                </div>
              ` : `
                <div>
                  <span class="pickup-heading-label">Select Skin—Clinic boutique for pickup:</span>
                  <div class="pickup-list-stack">
                    ${pickupPoints.map((p) => `
                      <button type="button" class="pickup-point-card ${selectedPickup === p.name ? 'selected' : ''}" data-pickup="${p.name}">
                        <div class="pickup-card-indicator">
                          <span class="pickup-radio-dot"></span>
                        </div>
                        <div class="pickup-card-content">
                          <div class="pickup-card-top">
                            <strong>${p.name}</strong>
                            ${selectedPickup === p.name ? '<span class="pickup-selected-badge">✓ Selected</span>' : ''}
                          </div>
                          <div class="pickup-card-addr">${p.address}</div>
                          <div class="pickup-card-hours">${p.hours}</div>
                        </div>
                      </button>
                    `).join('')}
                  </div>
                  <div class="map-preview-container">
                    <div class="map-preview-label">
                      <span class="map-dot"></span>
                      <b>Pickup point map:</b> ${selectedPickup}
                    </div>
                    <iframe title="Pickup location map" width="100%" height="150" style="border:0;display:block" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=69.20,41.28,69.32,41.34&layer=mapnik&marker=41.311081,69.240562"></iframe>
                  </div>
                </div>
              `}
              <label>
                <span>Delivery Notes (Optional)</span>
                <input id="co-notes" type="text" placeholder="e.g. Door code #123, call when arriving">
              </label>
            </div>
          </section>

          <section class="checkout-card">
            <div class="checkout-card-head">
              <span class="checkout-step-badge">2</span>
              <h2>Delivery Speed</h2>
            </div>
            <div class="checkout-options">
              <label class="checkout-option ${deliveryMethod === 'standard' ? 'active' : ''}">
                <input type="radio" name="deliveryMethod" value="standard" ${deliveryMethod === 'standard' ? 'checked' : ''}>
                <div class="checkout-option-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                </div>
                <div class="checkout-option-info">
                  <span class="checkout-option-title">Standard Courier Delivery (2–3 business days)</span>
                  <span class="checkout-option-sub">Free direct delivery across Uzbekistan</span>
                </div>
                <span class="checkout-option-free-tag">Free</span>
              </label>
              <label class="checkout-option ${deliveryMethod === 'express' ? 'active' : ''}">
                <input type="radio" name="deliveryMethod" value="express" ${deliveryMethod === 'express' ? 'checked' : ''}>
                <div class="checkout-option-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                </div>
                <div class="checkout-option-info">
                  <span class="checkout-option-title">Express Delivery (Same day in Tashkent)</span>
                  <span class="checkout-option-sub">Guaranteed delivery within 4–6 hours</span>
                </div>
                <b class="checkout-option-price">$5</b>
              </label>
            </div>
          </section>

          <section class="checkout-card">
            <div class="checkout-card-head">
              <span class="checkout-step-badge">3</span>
              <h2>Payment Method</h2>
            </div>
            <div class="checkout-options">
              <label class="checkout-option ${paymentMethod === 'cash' ? 'active' : ''}">
                <input type="radio" name="paymentMethod" value="cash" ${paymentMethod === 'cash' ? 'checked' : ''}>
                <div class="checkout-option-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/></svg>
                </div>
                <div class="checkout-option-info">
                  <span class="checkout-option-title">Cash on Delivery</span>
                  <span class="checkout-option-sub">Pay in cash or terminal upon receiving parcel</span>
                </div>
              </label>
              <label class="checkout-option ${paymentMethod === 'card' ? 'active' : ''}">
                <input type="radio" name="paymentMethod" value="card" ${paymentMethod === 'card' ? 'checked' : ''}>
                <div class="checkout-option-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                </div>
                <div class="checkout-option-info">
                  <span class="checkout-option-title">Bank Card (Online)</span>
                  <span class="checkout-option-sub">Visa, Mastercard, Uzcard, Humo</span>
                </div>
              </label>
              <label class="checkout-option ${paymentMethod === 'payme' ? 'active' : ''}">
                <input type="radio" name="paymentMethod" value="payme" ${paymentMethod === 'payme' ? 'checked' : ''}>
                <div class="checkout-option-icon" aria-hidden="true">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                </div>
                <div class="checkout-option-info">
                  <span class="checkout-option-title">Click / Payme</span>
                  <span class="checkout-option-sub">Instant payment through digital wallet</span>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside class="checkout-sidebar" id="checkout-sidebar">
          <div class="checkout-card summary-card">
            <div class="checkout-card-head">
              <h2>Order Summary</h2>
            </div>
            <div class="checkout-items-preview" id="co-items"></div>
            <div class="checkout-totals">
              <div class="checkout-total-row">
                <span>Subtotal (${cart.items.reduce((acc, i) => acc + (i.qty || 1), 0)} items)</span>
                <span>${formatPrice(cart.total)}</span>
              </div>
              <div class="checkout-total-row">
                <span>Shipping</span>
                <span>${shippingFee === 0 ? '<span class="free-shipping-badge">Free</span>' : '$5'}</span>
              </div>
              <div class="checkout-divider"></div>
              <div class="checkout-total-row final">
                <span>Total</span>
                <b>${formatPrice(grandTotal)}</b>
              </div>
            </div>
            <button type="submit" class="btn-pill btn-pill--black checkout-submit-btn" id="co-submit" ${isCheckoutReady() ? '' : 'disabled'}>
              Place Order — ${formatPrice(grandTotal)}
            </button>
            <p class="checkout-hint" id="co-hint" ${isCheckoutReady() ? 'hidden' : ''}>
              Please complete all required fields above to place your order.
            </p>
          </div>
        </aside>
      </form>`;

    const nEl = document.getElementById('co-name');
    const pEl = document.getElementById('co-phone');
    const eEl = document.getElementById('co-email');
    const cEl = document.getElementById('co-city');
    const aEl = document.getElementById('co-address');
    const noEl = document.getElementById('co-notes');
    if (nEl) nEl.value = recipientName;
    if (pEl) pEl.value = recipientPhone;
    if (eEl) eEl.value = recipientEmail;
    if (aEl) aEl.value = address;
    if (noEl) noEl.value = notes;

    const mapAddrText = document.getElementById('co-map-addr-text');
    const courierMap = document.getElementById('co-courier-map');
    function syncMapLabel() {
      if (!courierMap || !mapAddrText) return;
      const trimmed = address.trim();
      courierMap.hidden = !trimmed;
      if (trimmed) mapAddrText.textContent = city + ', ' + trimmed;
    }
    syncMapLabel();

    const itemsBox = document.getElementById('co-items');
    itemsBox.replaceChildren(...cart.items.map((item) =>
      h('div', { class: 'checkout-item-preview' },
        productImage({ _id: item.productId, title: item.title }),
        h('div', { class: 'checkout-item-meta' },
          h('span', { class: 'checkout-item-title' }, item.title),
          h('span', { class: 'checkout-item-qty' }, 'Qty: ' + item.qty),
        ),
        h('span', { class: 'checkout-item-sum' }, formatPrice(item.sum || item.price * item.qty)),
      )
    ));
    document.getElementById('checkout-sidebar').append(createPresentationCard());

    [nEl, pEl, eEl, aEl, noEl].forEach((input) => {
      if (!input) return;
      input.addEventListener('input', () => {
        saveInputState();
        syncMapLabel();
        syncSubmitButton();
      });
    });
    if (cEl) {
      cEl.addEventListener('change', () => {
        saveInputState();
        syncMapLabel();
        syncSubmitButton();
      });
    }

    root.querySelectorAll('[data-dtype]').forEach((btn) => {
      btn.addEventListener('click', () => {
        saveInputState();
        deliveryType = btn.dataset.dtype;
        formError = '';
        renderForm();
      });
    });

    root.querySelectorAll('[data-pickup]').forEach((card) => {
      card.addEventListener('click', () => {
        saveInputState();
        selectedPickup = card.dataset.pickup;
        const matched = pickupPoints.find((p) => p.name === selectedPickup);
        if (matched) { address = matched.address; city = matched.city; }
        formError = '';
        renderForm();
      });
    });

    root.querySelectorAll('input[name="deliveryMethod"]').forEach((r) => {
      r.addEventListener('change', () => { saveInputState(); deliveryMethod = r.value; renderForm(); });
    });

    root.querySelectorAll('input[name="paymentMethod"]').forEach((r) => {
      r.addEventListener('change', () => { saveInputState(); paymentMethod = r.value; renderForm(); });
    });

    document.getElementById('checkout-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      saveInputState();
      if (!isCheckoutReady()) {
        formError = 'Please complete all required contact, address, and payment fields.';
        document.getElementById('checkout-error').innerHTML = `<div class="checkout-error">${formError}</div>`;
        syncSubmitButton();
        return;
      }
      const submitBtn = document.getElementById('co-submit');
      const errBox = document.getElementById('checkout-error');
      const chosenCity = deliveryType === 'pickup' ? activePickup.city : city;
      const chosenAddr = deliveryType === 'pickup' ? activePickup.address : address.trim();

      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Processing order…'; }
      errBox.innerHTML = '';

      try {
        const res = await api.createOrder();
        const orderId = (res && res.order && res.order._id) ? res.order._id : Math.random().toString(36).slice(2, 10);
        setBagCount({ items: [], total: 0 });
        root.innerHTML = `
          <div class="order-success-card">
            <div class="order-success-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <h1>Order Confirmed!</h1>
            <p class="order-success-lead">Thank you for your order, <b>${recipientName || 'Guest'}</b>!</p>
            <div class="order-receipt">
              <div class="order-receipt-row"><span>Order number:</span><b>#${orderId.slice(-8).toUpperCase()}</b></div>
              <div class="order-receipt-row"><span>Delivery to:</span><b>${chosenCity}, ${chosenAddr}</b></div>
              <div class="order-receipt-row"><span>Delivery type:</span><b>${deliveryMethod === 'express' ? 'Express (Same Day)' : 'Standard (2–3 Days)'}</b></div>
              <div class="order-receipt-row"><span>Payment method:</span><b>${paymentMethod === 'cash' ? 'Cash upon delivery' : paymentMethod === 'card' ? 'Bank Card' : 'Payme / Click'}</b></div>
              <div class="order-receipt-row total"><span>Total amount:</span><b>${formatPrice(grandTotal)}</b></div>
            </div>
            <div class="order-success-actions">
              <a href="profile.html" class="btn-pill btn-pill--black" style="display:flex;">Go to My Profile</a>
              <a href="products.html" class="btn-outline-pill">Continue Shopping</a>
            </div>
          </div>`;
      } catch (err) {
        formError = err.message || 'Failed to place order. Please try again.';
        errBox.innerHTML = `<div class="checkout-error">${formError}</div>`;
        if (submitBtn) {
          submitBtn.disabled = !isCheckoutReady();
          submitBtn.textContent = 'Place Order — ' + formatPrice(grandTotal);
        }
      }
    });
  }

  renderForm();
});
