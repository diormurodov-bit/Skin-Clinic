document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('info-root');
  if (!root) return;

  const INFO_PAGES = {
    faqs: {
      eyebrow: 'Support',
      title: 'Frequently Asked Questions',
      lead: 'Everything you need to know about Skin—Clinic botanical formulations, shipping across Uzbekistan, and skincare routines.',
      blocks: [
        {
          heading: 'Are Skin—Clinic products suitable for sensitive skin?',
          text: 'Yes. All cleansers, toners, creams, serums, and lotions are dermatologist-tested, free from harsh sulfates, and balanced for daily barrier protection.',
        },
        {
          heading: 'How fast is delivery?',
          text: 'Standard courier delivery arrives within 2–3 business days and is completely free. Express same-day delivery in Tashkent is available for $5.',
        },
        {
          heading: 'How can I track my order?',
          text: 'Sign in to your account and open My Profile or reach our client care team at care@skin-clinic.uz with your order reference number.',
        },
      ],
    },
    'return-policy': {
      eyebrow: 'Support',
      title: 'Return Policy',
      lead: 'We stand behind every Skin—Clinic formulation. Unopened items and damaged arrivals are covered by our 14-day return guarantee.',
      blocks: [
        {
          heading: '14-Day Return Window',
          text: 'Unopened, unused products in original packaging may be returned within 14 days of delivery for a full refund to your original payment method.',
        },
        {
          heading: 'Damaged or Defective Items',
          text: 'If your order arrived damaged or leaking, submit a quick photo and description via Start a Return — we replace or refund damaged items immediately.',
        },
      ],
    },
    'shipping-policy': {
      eyebrow: 'Support',
      title: 'Shipping Policy',
      lead: 'Reliable nationwide fulfillment across Tashkent, Samarkand, Bukhara, Andijan, Namangan, and Fergana.',
      blocks: [
        {
          heading: 'Processing Time',
          text: 'Orders confirmed before 17:00 are packed and dispatched the same day from our temperature-controlled studio.',
        },
        {
          heading: 'Delivery Methods & Rates',
          text: 'Standard Delivery (2–3 business days) is free on all orders. Express Same-Day Delivery in Tashkent arrives within 4–6 hours for $5.',
        },
        {
          heading: 'Pickup Points',
          text: 'Collect your order in person at our flagship locations in Tashkent Central, Samarkand Plaza, or Bukhara Old City.',
        },
      ],
    },
    'start-return': {
      eyebrow: 'Support',
      title: 'Start a Return',
      lead: 'Upload a clear photo of the damaged product and describe what happened so our team can resolve it right away.',
      isReturnForm: true,
    },
    about: {
      eyebrow: 'Company',
      title: 'About Us',
      lead: 'Skin—Clinic crafts clean, botanical skincare essentials powered by science-backed active ingredients for healthy, radiant skin.',
      blocks: [
        {
          heading: 'Our Philosophy',
          text: 'Every formula pairs soothing botanical extracts with clinical-grade actives to strengthen the skin barrier without unnecessary fillers.',
        },
        {
          heading: 'Responsible Formulation',
          text: 'Cruelty-free testing, recyclable packaging, and small-batch quality checks ensure every bottle reaches you at peak potency.',
        },
      ],
    },
    journal: {
      eyebrow: 'Company',
      title: 'Skin—Clinic Journal',
      lead: 'Explore daily barrier-care rituals, toning routines, and seasonal hydration guides curated by Skin—Clinic specialists.',
      blocks: [
        {
          heading: 'Layering Toners & Serums',
          text: 'Apply hydrating Face Toner on damp skin immediately after cleansing to boost absorption of niacinamide and hyaluronic serums.',
        },
        {
          heading: 'Cold-Weather Barrier Repair',
          text: 'Seal morning moisture with a ceramide-rich cream and soothe body skin after showering with Shea Velvet or Almond Silk Lotion.',
        },
      ],
    },
    contact: {
      eyebrow: 'Company',
      title: 'Contact Us',
      lead: 'Our skincare specialists and client care team are available daily from 09:00 to 21:00.',
      blocks: [
        {
          heading: 'Client Care Desk',
          text: 'Email: care@skin-clinic.uz  •  Phone: +998 71 200 00 00',
        },
        {
          heading: 'Flagship Address',
          text: 'Amir Timur Avenue 45, Tashkent, Uzbekistan (Daily 10:00 – 21:00).',
        },
      ],
    },
    terms: {
      eyebrow: 'Legal',
      title: 'Terms of Service',
      lead: 'Standard terms governing purchases, pricing, and use of the Skin—Clinic online storefront.',
      blocks: [
        {
          heading: 'Orders & Pricing',
          text: 'All prices are displayed in USD. Orders are confirmed upon checkout completion and availability verification.',
        },
      ],
    },
    privacy: {
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      lead: 'How Skin—Clinic protects your account details, contact number, and delivery address.',
      blocks: [
        {
          heading: 'Data Usage',
          text: 'Your contact and delivery details are used strictly to process orders, provide customer support, and manage your profile.',
        },
      ],
    },
    cookies: {
      eyebrow: 'Legal',
      title: 'Cookies Settings',
      lead: 'Manage essential browser storage used by Skin—Clinic.',
      blocks: [
        {
          heading: 'Essential Session Storage',
          text: 'Skin—Clinic uses essential local storage only to keep your signed-in session and shopping bag synchronized across pages.',
        },
      ],
    },
  };

  const section = new URLSearchParams(location.search).get('section') || 'faqs';
  const page = INFO_PAGES[section] || INFO_PAGES.faqs;
  document.title = page.title + ' — Skin—Clinic';

  if (!page.isReturnForm) {
    root.innerHTML = `
      <a class="checkout-back-link" href="index.html">← Back to Home</a>
      <span class="info-eyebrow">${page.eyebrow}</span>
      <h1>${page.title}</h1>
      <p class="info-lead">${page.lead}</p>
      <div class="info-blocks">
        ${page.blocks.map((b) => `
          <article class="info-card">
            <h2>${b.heading}</h2>
            <p>${b.text}</p>
          </article>
        `).join('')}
      </div>
    `;
    return;
  }

  let photoPreview = '';
  let photoName = '';
  let damageDesc = '';

  function renderReturnForm(submitted = false) {
    if (submitted) {
      root.innerHTML = `
        <a class="checkout-back-link" href="index.html">← Back to Home</a>
        <span class="info-eyebrow">${page.eyebrow}</span>
        <h1>${page.title}</h1>
        <p class="info-lead">${page.lead}</p>
        <div class="return-success-box">
          <h2>Return Request Submitted</h2>
          <p>We received your photo and description of the damaged product. Our team will contact you shortly.</p>
          ${photoPreview ? `<img src="${photoPreview}" alt="Damaged product preview" class="return-preview-img">` : ''}
          <p class="return-desc-echo" id="return-desc-echo"></p>
          <button type="button" class="btn-pill btn-pill--black" id="return-another" style="max-width:220px;">Submit Another Return</button>
        </div>
      `;
      document.getElementById('return-desc-echo').textContent = damageDesc;
      document.getElementById('return-another').addEventListener('click', () => {
        photoPreview = '';
        photoName = '';
        damageDesc = '';
        renderReturnForm(false);
      });
      return;
    }

    root.innerHTML = `
      <a class="checkout-back-link" href="index.html">← Back to Home</a>
      <span class="info-eyebrow">${page.eyebrow}</span>
      <h1>${page.title}</h1>
      <p class="info-lead">${page.lead}</p>
      <form class="return-form" id="return-form">
        <div class="return-field">
          <label for="return-photo-input">Photo of damaged product *</label>
          <div id="return-photo-area"></div>
          <input id="return-photo-input" type="file" accept="image/*" class="sr-only">
        </div>
        <div class="return-field">
          <label for="return-desc-input">Describe the damage *</label>
          <textarea id="return-desc-input" required placeholder="Describe what happened to the product or packaging..."></textarea>
        </div>
        <button type="submit" class="btn-pill btn-pill--black" id="return-submit" disabled>Send Return Request</button>
      </form>
    `;

    const photoArea = document.getElementById('return-photo-area');
    const photoInput = document.getElementById('return-photo-input');
    const descInput = document.getElementById('return-desc-input');
    const submitBtn = document.getElementById('return-submit');
    descInput.value = damageDesc;

    function syncSubmit() {
      submitBtn.disabled = !photoPreview || !damageDesc.trim();
    }

    function drawPhotoArea() {
      if (photoPreview) {
        photoArea.innerHTML = `
          <div class="return-photo-preview-card">
            <img src="${photoPreview}" alt="Damaged item" class="return-preview-img">
            <div class="return-photo-meta">
              <span id="return-file-label"></span>
              <button type="button" id="remove-photo-btn">Remove photo</button>
            </div>
          </div>
        `;
        document.getElementById('return-file-label').textContent = photoName || 'Uploaded photo';
        document.getElementById('remove-photo-btn').addEventListener('click', () => {
          photoPreview = '';
          photoName = '';
          photoInput.value = '';
          drawPhotoArea();
          syncSubmit();
        });
      } else {
        photoArea.innerHTML = `
          <label for="return-photo-input" class="return-upload-zone">
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
            <span>Click to upload photo of damaged product</span>
            <small>PNG, JPG, WEBP</small>
          </label>
        `;
      }
    }

    drawPhotoArea();
    syncSubmit();

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      photoName = file.name;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          photoPreview = reader.result;
          drawPhotoArea();
          syncSubmit();
        }
      };
      reader.readAsDataURL(file);
    });

    descInput.addEventListener('input', () => {
      damageDesc = descInput.value;
      syncSubmit();
    });

    document.getElementById('return-form').addEventListener('submit', (e) => {
      e.preventDefault();
      if (!photoPreview || !damageDesc.trim()) return;
      renderReturnForm(true);
    });
  }

  renderReturnForm(false);
});
