document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('info-root');
  if (!root) return;

  const ALIASES = {
    'about-us': 'about',
    'contact-us': 'contact',
    'start-a-return': 'start-return',
    'returns': 'return-policy',
    'shipping': 'shipping-policy',
    'faq': 'faqs',
  };

  const NAV_SECTIONS = [
    { id: 'faqs', label: 'FAQs', group: 'Support' },
    { id: 'shipping-policy', label: 'Shipping Policy', group: 'Support' },
    { id: 'return-policy', label: 'Return Policy', group: 'Support' },
    { id: 'start-return', label: 'Start a Return', group: 'Support' },
    { id: 'about', label: 'About Us', group: 'Company' },
    { id: 'journal', label: 'The Ritual & Journal', group: 'Company' },
    { id: 'contact', label: 'Contact Us', group: 'Company' },
    { id: 'terms', label: 'Terms of Service', group: 'Legal' },
    { id: 'privacy', label: 'Privacy Policy', group: 'Legal' },
    { id: 'cookies', label: 'Cookies Settings', group: 'Legal' },
  ];

  const INFO_PAGES = {
    faqs: {
      id: 'faqs',
      eyebrow: 'Client Support',
      title: 'Frequently Asked Questions',
      lead: 'Everything you need to know about Skin—Clinic botanical formulations, dermatological safety, and nationwide delivery across Uzbekistan.',
      badge: '8 Articles',
      blocks: [
        {
          heading: 'Are Skin—Clinic products suitable for sensitive and allergy-prone skin?',
          text: 'Yes, absolutely. All cleansers, toners, creams, serums, and lotions are dermatologist-tested, hypoallergenic, and formulated without synthetic perfumes, harsh sulfates, parabens, or drying alcohols. Every formulation is clinically balanced to respect the skin’s natural pH (5.2–5.5) and fortify the delicate protective lipid mantle.',
        },
        {
          heading: 'Where are Skin—Clinic formulations developed and manufactured?',
          text: 'Our formulas are developed in partnership with leading European cosmetic laboratories and manufactured under strict ISO 22716 / Cosmetics GMP (Good Manufacturing Practice) standards. We source pharmaceutical-grade bio-actives alongside cold-pressed botanical extracts to guarantee purity and batch-to-batch consistency.',
        },
        {
          heading: 'What is the shelf life (PAO) of Skin—Clinic products?',
          text: 'Unopened products remain completely fresh for 36 months from the manufacture date printed on the bottom of each glass container. Once unsealed, the Period After Opening (PAO) is 12 months. Because our products are housed in protective amber glass, sensitive botanical antioxidants and peptides remain shielded from photodegradation.',
        },
        {
          heading: 'How fast is delivery within Tashkent and across regions?',
          text: 'Within Tashkent, Standard Delivery is free and arrives within 24 to 48 hours. Express Same-Day Delivery in Tashkent is delivered by our private courier within 4 to 6 hours for $5. For all other regions (Samarkand, Bukhara, Andijan, Namangan, Fergana, Navoi, Urgench, Nukus), orders arrive within 2–3 business days via our verified courier network.',
        },
        {
          heading: 'Can I combine active serums with the Ceramide Barrier Cream?',
          text: 'Yes. Our Ceramide Barrier Cream is specifically engineered as a universal physiological moisturizer. It works synergistically with retinol, vitamin C, AHA/BHA exfoliants, and niacinamide serums by soothing the stratum corneum and preventing trans-epidermal water loss (TEWL).',
        },
        {
          heading: 'What payment methods do you accept at checkout?',
          text: 'We offer flexible payment options tailored for our clients: Cash on Delivery upon parcel handover, Bank Cards (Visa, Mastercard, Uzcard, Humo), and instant mobile payments via Click and Payme. All online card transactions are protected with 256-bit bank-grade SSL encryption.',
        },
        {
          heading: 'Can I modify or cancel my order after it has been placed?',
          text: 'If you need to adjust your delivery address, add an item, or cancel your order, please contact our Client Care team within 1 hour of placing the order via phone (+998 71 200 00 00) or Telegram (@skinclinic_support). If the courier has not yet departed our fulfillment center, we will update your order immediately.',
        },
        {
          heading: 'How should I store botanical skincare products in warm weather?',
          text: 'Store your products in a cool, dry place away from direct sunlight, ideally between 15°C and 25°C (59°F–77°F). In peak summer temperatures, you may store our Face Toner and hydrating serums in the refrigerator for an extra soothing, de-puffing sensory experience upon morning application.',
        },
      ],
    },
    'shipping-policy': {
      id: 'shipping-policy',
      eyebrow: 'Orders & Fulfillment',
      title: 'Shipping & Delivery Policy',
      lead: 'Reliable nationwide fulfillment across Tashkent, Samarkand, Bukhara, the Fergana Valley, and all regions of Uzbekistan.',
      badge: 'Free Nationwide Shipping',
      blocks: [
        {
          heading: '1. Standard Courier Delivery (Nationwide)',
          text: 'We provide complimentary Standard Delivery on all orders regardless of cart total. Within Tashkent, deliveries are fulfilled within 24–48 hours. For all regions across Uzbekistan, delivery is completed within 2–3 business days directly to your residential or office address.',
        },
        {
          heading: '2. Express Same-Day Courier (Tashkent)',
          text: 'Need your skincare essentials immediately? Orders placed in Tashkent before 16:00 can be delivered the very same day within 4–6 hours for a nominal flat fee of $5. Our courier coordinates directly with you prior to departure.',
        },
        {
          heading: '3. Boutique Pickup Locations',
          text: 'Prefer to collect your parcel in person? Choose free pickup at any of our flagship boutiques: Tashkent Central (Amir Timur Ave 45, daily 10:00–21:00), Samarkand Plaza (Registan St 12, daily 10:00–20:00), or Bukhara Old City (Bahauddin Naqshband 88, daily 10:00–19:30). Your order is prepared within 2 hours.',
        },
        {
          heading: '4. Courier Protocol & Delivery Coordination',
          text: 'On the delivery day, you will receive an SMS notification confirming the courier assignment. The courier calls 30 minutes before arrival to confirm your presence. Contactless doorstep handover is gladly accommodated upon request in your checkout delivery notes.',
        },
        {
          heading: '5. Temperature-Controlled & Shockproof Packaging',
          text: 'Cosmetic formulas are sensitive to thermal extremes. Every Skin—Clinic parcel is packed in multi-layered, shock-absorbing recyclable cartons with thermal insulation inserts to protect bio-actives during seasonal heatwaves or winter chills.',
        },
      ],
    },
    'return-policy': {
      id: 'return-policy',
      eyebrow: 'Client Guarantee',
      title: 'Return & Exchange Policy',
      lead: 'We stand unconditionally behind the dermatological purity and safety of every Skin—Clinic formulation.',
      badge: '14-Day Guarantee',
      blocks: [
        {
          heading: '1. 14-Day Return Guarantee',
          text: 'In accordance with consumer rights legislation, unopened and unused products in their original protective carton with intact tamper-evident security seals may be returned within 14 calendar days of delivery for a full refund.',
        },
        {
          heading: '2. Damaged or Leaking Items in Transit',
          text: 'If your glass bottle or dispenser arrived damaged, leaking, or cracked during courier transit, you do NOT need to return the broken glass. Simply submit a quick photo and description via our "Start a Return" portal below. We dispatch an immediate replacement free of charge or issue a 100% refund within 24 hours.',
        },
        {
          heading: '3. Allergic Reaction Protocol',
          text: 'While our products undergo rigorous dermatological patch testing, individual sensitivities can occur. If you experience an unexpected adverse reaction, discontinue use immediately and reach out to our team at care@skin-clinic.uz. Our in-house skincare specialist will guide you through return and replacement options.',
        },
        {
          heading: '4. Refund Timeline & Methods',
          text: 'Approved refunds are credited directly back to the original payment method. For bank card payments (Visa, Mastercard, Uzcard, Humo), funds typically reflect in your account within 2 to 3 business days depending on your issuing bank.',
        },
      ],
    },
    'start-return': {
      id: 'start-return',
      eyebrow: 'Client Support Portal',
      title: 'Start a Return or Damaged Item Claim',
      lead: 'Upload a clear photo of your damaged item or packaging and provide a brief description. Our client care team will resolve your request within 24 hours.',
      badge: 'Instant Claim Form',
      isReturnForm: true,
    },
    about: {
      id: 'about',
      eyebrow: 'Our Heritage & Philosophy',
      title: 'About Skin—Clinic',
      lead: 'Clean, botanical skincare essentials powered by physiological lipids, Swiss bio-actives, and clinical minimalism for radiant, resilient skin.',
      badge: '03 / О НАС',
      blocks: [
        {
          heading: '01 / КОЛЛЕКЦИЯ. Наука и липидный барьер',
          text: 'The skin barrier is the body’s first defense against environmental stress, urban pollution, and oxidative aging. Skin—Clinic was founded by dermatologists who recognized that overcomplicated skincare routines with harsh foaming agents and synthetic fragrances frequently compromise this vital lipid shield. Every formula in our collection is centered on barrier restoration, utilizing ceramide precursors, biomimetic squalane, and multi-molecular hyaluronic complexes.',
        },
        {
          heading: '02 / ЧИСТЫЕ ФОРМУЛЫ. Без компромиссов',
          text: 'We operate under a strict "clean clinical" standard. We eliminate silicones, parabens, phthalates, artificial colorants, synthetic fragrance compounds, and drying alcohols. What remains is a potent synergy of cold-pressed botanical oils (meadowfoam, jojoba, sweet almond) and evidence-based clinical actives that deliver visible results without sensitization.',
        },
        {
          heading: '03 / О НАС. Дерматологический минимализм',
          text: 'We believe skincare should be intuitive, restorative, and grounded in dermatology. Rather than demanding a complex ten-step routine, Skin—Clinic crafts multipurpose essentials that harmonize with your skin’s natural circadian renewal cycle — hydrating deeply during the day and repairing the lipid barrier overnight.',
        },
        {
          heading: '04 / УСТОЙЧИВОСТЬ. Забота об экологии',
          text: 'True wellness honors both the skin and the planet. Our serums and creams are housed in 100% recyclable dark amber glass flacons that protect active ingredients from photodegradation while minimizing plastic waste. All secondary cartons are made from FSC-certified unbleached paperboard printed with soy-based inks.',
        },
      ],
    },
    journal: {
      id: 'journal',
      eyebrow: 'Skincare Guide & Ritual',
      title: 'The Daily Care Ritual & Journal',
      lead: 'Master the art of barrier restoration. Explore daily layering rituals, seasonal adaptations, and dermatological insights curated by Skin—Clinic specialists.',
      badge: '02 / РИТУАЛ УХОДА',
      blocks: [
        {
          heading: 'Шаг 01 / Бережное очищение (Cleansing)',
          text: 'A healthy routine begins with barrier-sparing cleansing. Avoid harsh high-pH foaming soaps that strip essential sebum. Apply our mild lipid-cushioned cleanser with lukewarm water, gently massaging in upward circular motions for 45–60 seconds to dissolve pollution and sebum without tightness.',
        },
        {
          heading: 'Шаг 02 / Тонизирование и баланс (Face Toner)',
          text: 'Immediately following cleansing — while the skin is still slightly damp — press 3–4 drops of Face Toner into your face and neck. Containing low-molecular hyaluronic acid and balancing botanical extracts, this step re-establishes optimal pH and primes the stratum corneum for maximum serum absorption.',
        },
        {
          heading: 'Шаг 03 / Концентрированная сыворотка (Targeted Serum)',
          text: 'Dispense 1 full pipette of active serum onto fingertips and press gently into areas prone to dryness, fine lines, or uneven texture. Whether formulated with soothing niacinamide, multi-peptides, or vitamin C, allow 60 seconds for complete cellular uptake before sealing.',
        },
        {
          heading: 'Шаг 04 / Липидная защита (Ceramide Cream & Lotion)',
          text: 'Seal hydration with our Ceramide Barrier Cream for the face or Almond Silk Lotion for the body. The rich physiological lipid matrix (Ceramides NP, AP, EOP) creates a breathable, non-comedogenic moisture shield that locks in active nutrients for up to 24 hours.',
        },
        {
          heading: 'Сезонный уход: Адаптация к климату Узбекистана',
          text: 'Central Asia experiences dry, continental winters and intense sunny summers. In winter months, boost nourishment with an extra layer of cream before bedtime to prevent indoor heating dehydration. In summer, pair your morning toner with lightweight serum and broad-spectrum SPF 50+ protection.',
        },
      ],
    },
    contact: {
      id: 'contact',
      eyebrow: 'Get in Touch',
      title: 'Contact Skin—Clinic',
      lead: 'Our skincare consultants and client care specialists are available daily from 09:00 to 21:00 to assist with product guidance, order inquiries, and personal routine consultations.',
      badge: 'Direct Client Care',
      blocks: [
        {
          heading: 'Client Care & Order Hotline',
          text: 'Telephone: +998 71 200 00 00 (Daily 09:00 – 21:00 UZT)\nTelegram Concierge: @skinclinic_support\nClient Inquiries: care@skin-clinic.uz\nOrder Status: orders@skin-clinic.uz',
        },
        {
          heading: 'Official Social Media',
          text: 'Instagram: @skinclinicuz (https://www.instagram.com/skinclinicuz/)\nFacebook: Skin—Clinic Uzbekistan\nYouTube: Skin—Clinic Official Channel',
        },
        {
          heading: 'Flagship Boutiques & Studios',
          text: '• Tashkent Flagship: Amir Timur Avenue 45, Tashkent (Daily 10:00 – 21:00)\n• Samarkand Boutique: Registan Street 12, Samarkand (Daily 10:00 – 20:00)\n• Bukhara Studio: Bahauddin Naqshband Street 88, Bukhara (Daily 10:00 – 19:30)',
        },
        {
          heading: 'Press, Partnerships & Dermatological Inquiries',
          text: 'For press kits, editorial features, wholesale distribution, or dermatologist collaboration inquiries, please contact partner@skin-clinic.uz.',
        },
      ],
    },
    terms: {
      id: 'terms',
      eyebrow: 'Legal Agreement',
      title: 'Terms of Service',
      lead: 'General terms and conditions governing purchases, pricing, orders, and usage of the Skin—Clinic digital storefront.',
      badge: 'Updated 2025',
      blocks: [
        {
          heading: '1. General Provisions & Acceptance',
          text: 'By accessing or placing an order through Skin—Clinic, you agree to be bound by these Terms of Service. All contracts for the purchase of products are concluded in accordance with the Civil Code and consumer protection legislation of the Republic of Uzbekistan.',
        },
        {
          heading: '2. Pricing & Currency',
          text: 'All prices on the storefront are denominated in USD and calculated at the official central bank exchange rate for local card transactions (Uzcard / Humo / Click / Payme). Prices include applicable sales taxes. Skin—Clinic reserves the right to correct typographical pricing errors prior to order dispatch.',
        },
        {
          heading: '3. Order Placement & Contract Formation',
          text: 'An order constitutes an offer to purchase. A binding contract is formed once your order is confirmed via our automated order system and assigned a unique order reference number. In the event of product stock unavailability, our team will promptly notify you and offer an immediate refund or replacement.',
        },
      ],
    },
    privacy: {
      id: 'privacy',
      eyebrow: 'Data Protection',
      title: 'Privacy Policy',
      lead: 'Skin—Clinic is committed to safeguarding your personal data, delivery addresses, and account credentials with uncompromising confidentiality.',
      badge: 'SSL 256-Bit Encrypted',
      blocks: [
        {
          heading: '1. Information We Collect',
          text: 'We collect personal information necessary to fulfill orders and provide bespoke client service: name, telephone number, email address, and physical delivery address. We do not store or process raw bank card numbers; all payments are handled by certified payment gateways.',
        },
        {
          heading: '2. Use of Personal Information',
          text: 'Your details are strictly utilized to confirm orders, coordinate courier deliveries, provide transactional SMS notifications, and facilitate returns. We never sell, lease, or distribute your phone number or email address to marketing third parties.',
        },
        {
          heading: '3. Account Security & Deletion Rights',
          text: 'All accounts and session tokens are protected by cryptographic industry standards. You have the right at any time to request an extract of your personal data or request permanent deletion of your profile and purchase history by emailing care@skin-clinic.uz.',
        },
      ],
    },
    cookies: {
      id: 'cookies',
      eyebrow: 'Browser Preferences',
      title: 'Cookies & Storage Policy',
      lead: 'Understanding how Skin—Clinic utilizes essential browser storage to synchronize your shopping bag, user session, and preferred settings.',
      badge: 'Zero Tracking Cookies',
      blocks: [
        {
          heading: '1. Essential Local Storage',
          text: 'Skin—Clinic utilizes browser local storage and essential session cookies strictly to keep your signed-in state active and retain items in your shopping bag as you browse between the home page, catalog, and checkout. These essential storage keys are strictly functional and do not track you across other websites.',
        },
        {
          heading: '2. Managing Browser Storage',
          text: 'You may clear local storage or cookies at any time through your browser settings. Please note that clearing essential storage will require you to log back into your profile and may reset your current shopping bag items.',
        },
      ],
    },
  };

  function resolveSectionKey(rawKey) {
    if (!rawKey) return 'faqs';
    const clean = rawKey.toLowerCase().trim();
    if (INFO_PAGES[clean]) return clean;
    if (ALIASES[clean]) return ALIASES[clean];
    return 'faqs';
  }

  function renderNav(activeKey) {
    const navWrap = h('nav', { class: 'info-nav-bar', 'aria-label': 'Support navigation' });
    const groups = ['Support', 'Company', 'Legal'];

    groups.forEach((groupName) => {
      const groupEl = h('div', { class: 'info-nav-group' },
        h('span', { class: 'info-nav-group-label' }, groupName),
        h('div', { class: 'info-nav-pills' },
          ...NAV_SECTIONS.filter((s) => s.group === groupName).map((s) => {
            const btn = h('button', {
              type: 'button',
              class: 'info-nav-pill' + (s.id === activeKey ? ' is-active' : ''),
              'aria-current': s.id === activeKey ? 'page' : 'false',
            }, s.label);
            btn.addEventListener('click', () => {
              if (s.id !== activeKey) {
                history.pushState(null, '', '?section=' + encodeURIComponent(s.id));
                loadSection(s.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            });
            return btn;
          })
        )
      );
      navWrap.append(groupEl);
    });

    return navWrap;
  }

  let photoPreview = '';
  let photoName = '';
  let damageDesc = '';

  function renderReturnFormUI(page) {
    const content = h('div', { class: 'info-content-wrap' });

    function renderForm(submitted = false) {
      content.innerHTML = '';
      if (submitted) {
        content.innerHTML = `
          <div class="return-success-box">
            <div class="return-success-badge">✓ Submitted</div>
            <h2>Return Request Received</h2>
            <p>Thank you. Your photo and damage report have been forwarded to our Client Care Concierge. We will contact you at your account email / phone within 24 hours with an immediate replacement or full refund confirmation.</p>
            ${photoPreview ? `<img src="${photoPreview}" alt="Damaged product preview" class="return-preview-img">` : ''}
            <div class="return-desc-echo">
              <strong>Your description:</strong>
              <p id="return-desc-echo"></p>
            </div>
            <button type="button" class="btn-pill btn-pill--black" id="return-another" style="max-width:240px;margin-top:12px;">Submit Another Claim</button>
          </div>
        `;
        const echo = document.getElementById('return-desc-echo');
        if (echo) echo.textContent = damageDesc;
        const another = document.getElementById('return-another');
        if (another) {
          another.addEventListener('click', () => {
            photoPreview = '';
            photoName = '';
            damageDesc = '';
            renderForm(false);
          });
        }
        return;
      }

      content.innerHTML = `
        <form class="return-form" id="return-form">
          <div class="return-field">
            <label for="return-photo-input">Upload Photo of Damaged Product or Packaging *</label>
            <div id="return-photo-area"></div>
            <input id="return-photo-input" type="file" accept="image/*" class="sr-only">
          </div>
          <div class="return-field">
            <label for="return-desc-input">Describe What Happened *</label>
            <textarea id="return-desc-input" required placeholder="Please describe the damage, e.g. glass flacon cracked in transit, leaking pump dispenser, missing security seal..."></textarea>
          </div>
          <div class="return-field">
            <label for="return-order-input">Order Reference Number (Optional)</label>
            <input id="return-order-input" type="text" placeholder="e.g. #7A9F12BC" style="height:48px;border:1px solid #d1d5db;border-radius:10px;padding:0 14px;font-size:15px;">
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
              <img src="${photoPreview}" alt="Damaged item preview" class="return-preview-img">
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
              <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span>Click to select or drag photo here</span>
              <small>PNG, JPG, WEBP (Max 10 MB)</small>
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
        renderForm(true);
      });
    }

    renderForm(false);
    return content;
  }

  function loadSection(sectionKey) {
    const validKey = resolveSectionKey(sectionKey);
    const page = INFO_PAGES[validKey] || INFO_PAGES.faqs;
    document.title = page.title + ' — Skin—Clinic';

    root.innerHTML = '';

    const backLink = h('a', { class: 'checkout-back-link', href: 'index.html' }, '← Back to Home');
    const headBlock = h('div', { class: 'info-head-block' },
      h('div', { class: 'info-head-meta' },
        h('span', { class: 'info-eyebrow' }, page.eyebrow),
        page.badge ? h('span', { class: 'info-badge-tag' }, page.badge) : null,
      ),
      h('h1', {}, page.title),
      h('p', { class: 'info-lead' }, page.lead),
    );

    const nav = renderNav(validKey);

    root.append(backLink, nav, headBlock);

    if (page.isReturnForm) {
      root.append(renderReturnFormUI(page));
    } else {
      const blocksWrap = h('div', { class: 'info-blocks' },
        ...page.blocks.map((b) => {
          const card = h('article', { class: 'info-card' },
            h('h2', {}, b.heading),
            h('p', {}, b.text),
          );
          return card;
        })
      );
      root.append(blocksWrap);
    }
  }

  const initialKey = new URLSearchParams(location.search).get('section') ||
                     new URLSearchParams(location.search).get('page') ||
                     'faqs';
  loadSection(initialKey);

  window.addEventListener('popstate', () => {
    const popKey = new URLSearchParams(location.search).get('section') || 'faqs';
    loadSection(popKey);
  });
});
