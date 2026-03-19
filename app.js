const exchange = {
  inrPerUsd: 92.33,
  source: "Wise",
  sourcedDate: "March 12, 2026",
};

const customizationFeeInr = 1000;
const discountThresholdInr = 8000;
const highDiscountRate = 0.15;
const lowDiscountRate = 0.1;
const defaultDeliveryLeadDays = 3;

function pickConfigValue(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }

  return "";
}

function normalizePublicConfig() {
  const rootConfig = {
    ...(window.YENGU_CONFIG || {}),
    ...(window.yenguConfig || {}),
    ...(window.__YENGU_CONFIG__ || {}),
  };

  return {
    supabaseUrl: pickConfigValue(
      rootConfig.supabaseUrl,
      rootConfig.supabaseURL,
      rootConfig.SUPABASE_URL,
      window.YENGU_SUPABASE_URL,
      window.SUPABASE_URL,
    ),
    supabaseAnonKey: pickConfigValue(
      rootConfig.supabaseAnonKey,
      rootConfig.supabasePublishableKey,
      rootConfig.supabaseKey,
      rootConfig.supabaseAnonPublicKey,
      rootConfig.SUPABASE_ANON_KEY,
      rootConfig.SUPABASE_PUBLISHABLE_KEY,
      rootConfig.SUPABASE_KEY,
      window.YENGU_SUPABASE_ANON_KEY,
      window.YENGU_SUPABASE_PUBLISHABLE_KEY,
      window.SUPABASE_ANON_KEY,
      window.SUPABASE_PUBLISHABLE_KEY,
    ),
    razorpayKeyId: pickConfigValue(
      rootConfig.razorpayKeyId,
      rootConfig.razorpayKey,
      rootConfig.RAZORPAY_KEY_ID,
      window.YENGU_RAZORPAY_KEY_ID,
      window.RAZORPAY_KEY_ID,
    ),
    supportEmail: pickConfigValue(
      rootConfig.supportEmail,
      rootConfig.SUPPORT_EMAIL,
      window.YENGU_SUPPORT_EMAIL,
    ),
    supportWhatsapp: pickConfigValue(
      rootConfig.supportWhatsapp,
      rootConfig.supportWhatsApp,
      rootConfig.SUPPORT_WHATSAPP,
      window.YENGU_SUPPORT_WHATSAPP,
    ),
  };
}

const publicConfig = normalizePublicConfig();

const products = [
  {
    code: "GH-01",
    title: "Custom Gundam 00 Raiser",
    subtitle: "Metallic blue custom with LED chest glow and a purple ring base.",
    image: "./gundam1.avif",
    inrPrice: 5999,
    tags: ["custom", "led", "featured"],
    features: [
      "One-of-a-kind metallic blue finish with a premium custom paint pass.",
      "LED-lit chest core and illuminated GN Sword for a shelf-commanding display.",
      "Mounted on a glowing ring base in a dynamic attack pose.",
    ],
  },
  {
    code: "GH-02",
    title: "Strike Freedom Gundam",
    subtitle: "Wing of Light display with a wide, dramatic collector silhouette.",
    image: "./gundam2.avif",
    inrPrice: 11999,
    tags: ["wings", "premium", "display"],
    features: [
      "Large translucent wing effects give the build strong shelf presence.",
      "Fully assembled display piece with striking blue and gold accents.",
      "Built for collectors who want a centerpiece rather than a boxed kit.",
    ],
  },
  {
    code: "GH-03",
    title: "Destiny Gundam Infinite Wings",
    subtitle: "Pink and violet wing effects with a clean floating stance.",
    image: "./gundam3.avif",
    inrPrice: 11999,
    tags: ["wings", "premium", "seed"],
    features: [
      "Expansive wing effect parts give the figure a huge vertical spread.",
      "Studio-style presentation keeps the focus on the silhouette and color pop.",
      "Strong pick for Destiny Gundam and SEED Destiny fans.",
    ],
  },
  {
    code: "GH-04",
    title: "Freedom Gundam Aerial Assault",
    subtitle: "Mid-action pose with motion energy and airborne aggression.",
    image: "./gundam4.avif",
    inrPrice: 6999,
    tags: ["action", "freedom", "display"],
    features: [
      "Fast, attack-forward pose gives the card a cinematic energy.",
      "Blue-heavy palette and weapon spread keep the build visually sharp.",
      "Great option for fans who want movement and shelf presence together.",
    ],
  },
  {
    code: "GH-05",
    title: "Wing Zero EW Pure Angel",
    subtitle: "A monochrome white custom framed against manga-style artwork.",
    image: "./Gundam5.avif",
    inrPrice: 12999,
    tags: ["custom", "monochrome", "wings"],
    features: [
      "All-white custom interpretation with feathery wing detail and dramatic contrast.",
      "Custom manga-panel backdrop turns the piece into a ready-made display scene.",
      "Ideal for collectors who want something artistic and unmistakably different.",
    ],
  },
  {
    code: "GH-06",
    title: "Sazabi Red Comet",
    subtitle: "Crimson armor, heavy presence, and collector-grade detail density.",
    image: "./gundam6.avif",
    inrPrice: 7999,
    tags: ["premium", "uc", "iconic"],
    features: [
      "Deep red finish and dense markings give the mobile suit a serious collector look.",
      "Heavy frame proportions create a powerful shelf silhouette from every angle.",
      "A strong pick for Char fans and UC-focused displays.",
    ],
  },
  {
    code: "GH-07",
    title: "Unicorn Gundam Blue Luminous",
    subtitle: "Large display with blue psychoframe energy and a custom base.",
    image: "./gundam7.avif",
    inrPrice: 7999,
    tags: ["led", "premium", "unicorn"],
    features: [
      "Blue-lit frame styling makes this build look dramatic even in a darker room.",
      "Backpack extensions and custom base push it into centerpiece territory.",
      "Best suited for collectors who want a large and highly visible display piece.",
    ],
  },
  {
    code: "GH-08",
    title: "Wing Zero EW Celestial Feather",
    subtitle: "Classic angel-wing silhouette in a clean, forward-charging pose.",
    image: "./gundam8.avif",
    inrPrice: 5999,
    tags: ["classic", "wings", "wing"],
    features: [
      "A faithful Wing Zero EW stance that reads instantly from across the room.",
      "Feathered wings and strong contrast keep the profile elegant and dynamic.",
      "A clean fit for Gundam Wing shelves and anime-focused collections.",
    ],
  },
  {
    code: "GH-09",
    title: "Unicorn Gundam Crimson Frame",
    subtitle: "Destroy Mode build with clean panel lining and red inner frame detail.",
    image: "./gundam9.avif",
    inrPrice: 6999,
    tags: ["unicorn", "clean-build", "display"],
    features: [
      "Red psychoframe detailing gives the suit its signature Destroy Mode contrast.",
      "Sharp assembly and restrained presentation make it feel display-ready and polished.",
      "An easy recommendation for collectors who prefer clean, non-effect-heavy builds.",
    ],
  },
  {
    code: "GH-10",
    title: "Golden Phoenix Variant",
    subtitle: "Brilliant gold armor build with a premium metallic presence.",
    image: "./gundam10.avif",
    inrPrice: 7999,
    tags: ["gold", "premium", "collector"],
    features: [
      "Reflective gold finish catches ambient light and gives the suit instant impact.",
      "Tall rear binders add height and make the figure read like a premium display model.",
      "Built for collectors who want a bold colorway at the center of the shelf.",
    ],
  },
  {
    code: "GH-11",
    title: "Custom Gundam Mk-II Titans Dark",
    subtitle: "Dark blue and grey military styling with a grounded display pose.",
    image: "./gundam11.avif",
    inrPrice: 5999,
    tags: ["custom", "titans", "military"],
    features: [
      "Custom dark palette gives the build a hard-edged, military showroom feel.",
      "Beam effect accents sharpen the pose without overwhelming the figure.",
      "Strong option for collectors who prefer realistic tones over brighter hero colors.",
    ],
  },
  {
    code: "GH-12",
    title: "Astray Ring Diorama Custom",
    subtitle: "Red-white display build paired with a ring halo and scenic base.",
    image: "./gundam12.avif",
    inrPrice: 7999,
    tags: ["custom", "diorama", "samurai"],
    features: [
      "Scenic diorama base turns the build into a ready-to-photograph display piece.",
      "Red-white armor and oversized weapon mount create a high-drama presentation.",
      "A strong fit for collectors who want something more theatrical than a standard stand.",
    ],
  },
  {
    code: "GH-13",
    title: "Aqua Lancer Custom",
    subtitle: "White and cyan custom with translucent energy wings and a spear loadout.",
    image: "./Gundam13.avif",
    inrPrice: 13999,
    tags: ["custom", "premium", "energy-effects"],
    features: [
      "Cyan translucent effects give the suit a sharp, futuristic silhouette.",
      "Long lance weapon and swept effect parts make the pose feel aggressive and elegant.",
      "Designed for buyers who want a high-flair, high-contrast custom build.",
    ],
  },
  {
    code: "GH-14",
    title: "White Monochrome Assault Build",
    subtitle: "A clean white custom with emerald accents and an intense multi-weapon shape.",
    image: "./Gundam15.avif",
    inrPrice: 13999,
    tags: ["custom", "monochrome", "premium"],
    features: [
      "Near-monochrome finish creates a sleek, gallery-style presentation.",
      "Emerald accent points add just enough color to keep the design electric.",
      "A strong option for collectors who want a futuristic custom rather than a stock look.",
    ],
  },
  {
    code: "GH-15",
    title: "Apocalypse Wing Custom",
    subtitle: "Wide-spread binders, green effect accents, and a dense premium silhouette.",
    image: "./gundam16.avif",
    inrPrice: 13999,
    tags: ["custom", "premium", "wings"],
    features: [
      "Large binder arrangement gives this build one of the broadest profiles in the set.",
      "Green-tipped effect accents break up the white-blue frame with sharp contrast.",
      "Built for collectors who want maximum visual density and a modern custom finish.",
    ],
  },
  {
    code: "GH-16",
    title: "Azure Seraph Custom",
    subtitle: "Blue-white winged assault build with effect parts and a dramatic attack stance.",
    image: "./gundam17.avif",
    inrPrice: 15999,
    tags: ["custom", "wings", "featured"],
    features: [
      "Blue energy accents and layered wings give the suit a premium centerpiece feel.",
      "Strong forward pose makes it work especially well for a hero image or storefront feature.",
      "A top-end pick in the drop for buyers who want the flashiest visual impact.",
    ],
  },
].sort((left, right) => left.inrPrice - right.inrPrice || left.code.localeCompare(right.code));

const filters = ["all", "custom", "wings", "premium", "led", "classic"];
const productMap = new Map(products.map((product) => [product.code, product]));
const featuredProducts = products.filter((product) => product.tags.includes("featured")).length
  ? products.filter((product) => product.tags.includes("featured"))
  : products.slice(0, 6);
const pageType = document.body?.dataset?.page || "home";

const state = {
  activeFilter: "all",
  selectedProduct: null,
  orderProduct: null,
  session: null,
  profile: null,
  authMode: "signin",
  pendingOrderProduct: null,
  commerceReady: false,
};

const dom = {
  appNotice: document.querySelector("#app-notice"),
  statCount: document.querySelector("#stat-count"),
  authStat: document.querySelector("#auth-stat"),
  commerceHeadline: document.querySelector("#commerce-headline"),
  commerceCopy: document.querySelector("#commerce-copy"),
  authStatusPill: document.querySelector("#auth-status-pill"),
  setupStatusPill: document.querySelector("#setup-status-pill"),
  setupBanner: document.querySelector("#setup-banner"),
  setupBannerHeadline: document.querySelector("#setup-banner-headline"),
  setupBannerCopy: document.querySelector("#setup-banner-copy"),
  spotlightTrack: document.querySelector("#spotlight-track"),
  filters: document.querySelector("#filters"),
  catalog: document.querySelector("#catalog"),
  searchInput: document.querySelector("#search-input"),
  accountShortcut: document.querySelector("#account-shortcut"),
  openAuth: document.querySelector("#open-auth"),
  openAuthInline: document.querySelector("#open-auth-inline"),
  signOutButton: document.querySelector("#sign-out-button"),
  accountHeadline: document.querySelector("#account-headline"),
  accountName: document.querySelector("#account-name"),
  accountSummaryCopy: document.querySelector("#account-summary-copy"),
  accountStatusPill: document.querySelector("#account-status-pill"),
  profileForm: document.querySelector("#profile-form"),
  saveProfileButton: document.querySelector("#save-profile-button"),
  emailForm: document.querySelector("#email-form"),
  accountEmailCurrent: document.querySelector("#account-email-current"),
  updateEmailButton: document.querySelector("#update-email-button"),
  passwordForm: document.querySelector("#password-form"),
  updatePasswordButton: document.querySelector("#update-password-button"),
  deleteAccountForm: document.querySelector("#delete-account-form"),
  deleteAccountButton: document.querySelector("#delete-account-button"),
  securityHelper: document.querySelector("#security-helper"),
  dangerHelper: document.querySelector("#danger-helper"),
  refreshOrders: document.querySelector("#refresh-orders"),
  orderHistoryList: document.querySelector("#order-history-list"),
  supportEmail: document.querySelector("#support-email"),
  supportWhatsapp: document.querySelector("#support-whatsapp"),
  supportForm: document.querySelector("#support-form"),
  productModal: document.querySelector("#product-modal"),
  modalClose: document.querySelector("#modal-close"),
  modalImage: document.querySelector("#modal-image"),
  modalCode: document.querySelector("#modal-code"),
  modalTitle: document.querySelector("#modal-title"),
  modalSubtitle: document.querySelector("#modal-subtitle"),
  modalPrice: document.querySelector("#modal-price"),
  modalFeatures: document.querySelector("#modal-features"),
  modalOrder: document.querySelector("#modal-order"),
  modalCopy: document.querySelector("#modal-copy"),
  authDialog: document.querySelector("#auth-dialog"),
  authClose: document.querySelector("#auth-close"),
  authTabs: document.querySelector("#auth-tabs"),
  authForm: document.querySelector("#auth-form"),
  authSubmit: document.querySelector("#auth-submit"),
  authHelper: document.querySelector("#auth-helper"),
  orderDialog: document.querySelector("#order-dialog"),
  orderClose: document.querySelector("#order-close"),
  orderForm: document.querySelector("#order-form"),
  orderHeading: document.querySelector("#order-heading"),
  orderProductTitle: document.querySelector("#order-product-title"),
  orderProductCopy: document.querySelector("#order-product-copy"),
  orderProductCode: document.querySelector("#order-product-code"),
  orderBasePrice: document.querySelector("#order-base-price"),
  customizationCheckbox: document.querySelector("#order-customization"),
  customizationNotesShell: document.querySelector("#customization-notes-shell"),
  syncProfileButton: document.querySelector("#sync-profile-button"),
  checkoutButton: document.querySelector("#checkout-button"),
  summaryOriginalPrice: document.querySelector("#summary-original-price"),
  summaryDiscountPrice: document.querySelector("#summary-discount-price"),
  summaryBasePrice: document.querySelector("#summary-base-price"),
  summaryCustomizationPrice: document.querySelector("#summary-customization-price"),
  summaryTotalPrice: document.querySelector("#summary-total-price"),
};

const inrFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const supabaseClient = createSupabaseClient();

function createSupabaseClient() {
  if (!window.supabase || !publicConfig.supabaseUrl || !publicConfig.supabaseAnonKey) {
    return null;
  }

  state.commerceReady = true;
  return window.supabase.createClient(
    publicConfig.supabaseUrl,
    publicConfig.supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    },
  );
}

function toUsd(inrPrice) {
  return inrPrice / exchange.inrPerUsd;
}

function getDiscountRate(inrPrice) {
  return inrPrice >= discountThresholdInr ? highDiscountRate : lowDiscountRate;
}

function getDiscountAmount(inrPrice) {
  return Math.round(inrPrice * getDiscountRate(inrPrice));
}

function getDiscountLabel(rate) {
  return `${Math.round(rate * 100)}% off`;
}

function getPriceBreakdown(product, customizationRequested = false) {
  if (!product) {
    const customizationCharge = customizationRequested ? customizationFeeInr : 0;

    return {
      originalBase: 0,
      discountRate: 0,
      discountLabel: "0% off",
      discountAmount: 0,
      discountedBase: 0,
      customizationCharge,
      finalTotal: customizationCharge,
    };
  }

  const originalBase = product?.inrPrice || 0;
  const discountRate = getDiscountRate(originalBase);
  const discountAmount = getDiscountAmount(originalBase);
  const discountedBase = originalBase - discountAmount;
  const customizationCharge = customizationRequested ? customizationFeeInr : 0;
  const finalTotal = discountedBase + customizationCharge;

  return {
    originalBase,
    discountRate,
    discountLabel: getDiscountLabel(discountRate),
    discountAmount,
    discountedBase,
    customizationCharge,
    finalTotal,
  };
}

function getPrimaryTagLabel(product) {
  return (product.tags[0] || "custom").replaceAll("-", " ");
}

function navigateToAccountPage() {
  window.location.href = "./auth.html";
}

function formatDateForInput(daysAhead = defaultDeliveryLeadDays) {
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  return date.toISOString().split("T")[0];
}

function humanDate(value) {
  if (!value) return "Not scheduled";
  return dateFormatter.format(new Date(`${value}T00:00:00`));
}

function getSupabaseSetupIssues() {
  const issues = [];

  if (!window.supabase) issues.push("Supabase browser client did not load.");
  if (!publicConfig.supabaseUrl) {
    issues.push("Add Supabase URL as supabaseUrl or SUPABASE_URL in supabase-config.js.");
  }
  if (!publicConfig.supabaseAnonKey) {
    issues.push(
      "Add Supabase publishable key as supabaseAnonKey, supabasePublishableKey, supabaseKey, or SUPABASE_PUBLISHABLE_KEY in supabase-config.js.",
    );
  }

  return issues;
}

function getCheckoutSetupIssues() {
  const issues = [];

  if (!publicConfig.razorpayKeyId) issues.push("Add your Razorpay key id in supabase-config.js.");
  if (!window.Razorpay) issues.push("Razorpay checkout script did not load.");

  return issues;
}

function getSetupIssues() {
  return [...getSupabaseSetupIssues(), ...getCheckoutSetupIssues()];
}

function getFeatureUnavailableNotice(featureLabel, issues) {
  if (!issues.length) return `${featureLabel} is unavailable right now.`;
  return `${featureLabel} is unavailable. ${issues[0]}`;
}

function setHidden(node, hidden) {
  if (!node) return;
  node.classList.toggle("hidden", hidden);
}

function setContactLink(node, href, label, fallback) {
  if (!node) return;
  node.textContent = "";

  if (!href || !label) {
    node.textContent = fallback;
    return;
  }

  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  link.className = "inline-link";

  if (href.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noreferrer";
  }

  node.appendChild(link);
}

function setNotice(message, tone = "info") {
  if (!dom.appNotice) return;
  dom.appNotice.textContent = message;
  dom.appNotice.className = `app-notice ${tone}`;
  window.clearTimeout(setNotice.timeoutId);
  setNotice.timeoutId = window.setTimeout(() => {
    dom.appNotice.className = "app-notice hidden";
  }, 5200);
}

function setButtonBusy(button, busy, busyLabel, idleLabel) {
  if (!button) return;
  if (!button.dataset.originalLabel) button.dataset.originalLabel = button.textContent;
  if (!busy && typeof idleLabel === "string" && idleLabel.trim()) {
    button.dataset.originalLabel = idleLabel;
  }
  button.disabled = busy;
  button.textContent = busy ? busyLabel : button.dataset.originalLabel;
}

function normaliseError(error) {
  if (!error) return "Something went wrong.";
  if (typeof error === "string") return error;
  return error.message || "Something went wrong.";
}

function getInquiryText(product) {
  const breakdown = getPriceBreakdown(
    product,
    product === state.orderProduct && dom.customizationCheckbox.checked,
  );
  const customizationLine =
    product === state.orderProduct && dom.customizationCheckbox.checked
      ? `Customization selected: ${inrFormatter.format(customizationFeeInr)}`
      : "Customization selected: No";

  return [
    `Interested in ${product.title} (${product.code})`,
    `Original price: ${inrFormatter.format(breakdown.originalBase)}`,
    `Discounted price: ${inrFormatter.format(breakdown.discountedBase)} (${breakdown.discountLabel}) | ${usdFormatter.format(toUsd(breakdown.discountedBase))}`,
    customizationLine,
    "Please share payment and shipping steps.",
  ].join("\n");
}

async function copyInquiry(product) {
  const text = getInquiryText(product);
  try {
    await navigator.clipboard.writeText(text);
    setNotice("Inquiry text copied.", "success");
  } catch (_error) {
    window.prompt("Copy the inquiry text below:", text);
  }
}

function matchesSearch(product, query) {
  if (!query) return true;
  const haystack = [product.title, product.subtitle, ...product.tags, ...product.features]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function matchesFilter(product, filter) {
  if (filter === "all") return true;
  return product.tags.includes(filter);
}

function buildSpotlightCard(product) {
  const breakdown = getPriceBreakdown(product);
  const article = document.createElement("article");
  article.className = "spotlight-card";
  article.innerHTML = `
    <button class="spotlight-visual" data-action="details" type="button" aria-label="Open details for ${product.title}">
      <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async" />
      <div class="spotlight-overlay"></div>
      <div class="spotlight-badges">
        <span class="media-badge media-badge-sale">${breakdown.discountLabel}</span>
        <span class="media-badge">${product.code}</span>
      </div>
    </button>
    <div class="spotlight-copy">
      <p class="section-kicker">${getPrimaryTagLabel(product)}</p>
      <h3>${product.title}</h3>
      <p>${product.subtitle}</p>
      <div class="spotlight-footer">
        <div class="spotlight-price">
          <span>${inrFormatter.format(breakdown.discountedBase)}</span>
          <small>${usdFormatter.format(toUsd(breakdown.discountedBase))}</small>
        </div>
        <div class="card-actions">
          <button class="action-button" data-action="details" type="button">Details</button>
          <button class="primary-button" data-action="order" type="button">Order</button>
        </div>
      </div>
    </div>
  `;

  article.querySelectorAll('[data-action="details"]').forEach((node) => {
    node.addEventListener("click", () => openProductModal(product));
  });
  article.querySelector('[data-action="order"]').addEventListener("click", () => openOrderFlow(product));

  return article;
}

function renderSpotlight() {
  if (!dom.spotlightTrack) return;
  dom.spotlightTrack.innerHTML = "";

  featuredProducts.forEach((product) => {
    dom.spotlightTrack.appendChild(buildSpotlightCard(product));
  });
}

function buildCard(product) {
  const article = document.createElement("article");
  article.className = "catalog-card reveal";
  const breakdown = getPriceBreakdown(product);

  article.innerHTML = `
    <button class="card-visual" data-action="details" type="button" aria-label="Open details for ${product.title}">
      <figure class="card-media">
        <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async" />
        <div class="media-badges">
          <span class="media-badge media-badge-sale">${breakdown.discountLabel}</span>
          <span class="media-badge">1 of 1</span>
        </div>
        <div class="card-tags">
          ${product.tags
            .slice(0, 2)
            .map((tag) => `<span class="card-tag">${tag.replace("-", " ")}</span>`)
            .join("")}
        </div>
      </figure>
    </button>
    <div class="card-body">
      <div class="card-header">
        <div>
          <p class="section-kicker">${getPrimaryTagLabel(product)}</p>
          <h3>${product.title}</h3>
        </div>
        <span class="code-pill">${product.code}</span>
      </div>
      <p class="card-subtitle">${product.subtitle}</p>
      <div class="price-panel price-panel-compact">
        <div class="price-row">
          <span>From</span>
          <strong>${inrFormatter.format(breakdown.discountedBase)}</strong>
        </div>
        <div class="price-row">
          <span>Was</span>
          <strong class="price-strike">${inrFormatter.format(breakdown.originalBase)}</strong>
        </div>
        <div class="price-row">
          <span>USD</span>
          <strong>${usdFormatter.format(toUsd(breakdown.discountedBase))}</strong>
        </div>
      </div>
      <div class="card-footer">
        <div class="card-meta-line">
          <span>${breakdown.discountLabel}</span>
          <span>Custom +${inrFormatter.format(customizationFeeInr)}</span>
        </div>
        <div class="card-actions">
          <button class="action-button" data-action="details" type="button">View details</button>
          <button class="primary-button" data-action="order" type="button">Order now</button>
        </div>
      </div>
    </div>
  `;

  const detailsButtons = article.querySelectorAll('[data-action="details"]');
  const orderButton = article.querySelector('[data-action="order"]');

  detailsButtons.forEach((node) => {
    node.addEventListener("click", () => openProductModal(product));
  });
  orderButton.addEventListener("click", () => openOrderFlow(product));

  return article;
}

function renderFilters() {
  if (!dom.filters) return;
  dom.filters.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-pill${filter === state.activeFilter ? " is-active" : ""}`;
    button.textContent = filter;
    button.addEventListener("click", () => {
      state.activeFilter = filter;
      renderFilters();
      renderCatalog();
    });
    dom.filters.appendChild(button);
  });
}

function renderCatalog() {
  if (!dom.catalog || !dom.searchInput) return;
  const query = dom.searchInput.value.trim();
  const visibleProducts = products.filter(
    (product) => matchesFilter(product, state.activeFilter) && matchesSearch(product, query),
  );

  dom.catalog.innerHTML = "";

  if (!visibleProducts.length) {
    const emptyState = document.createElement("article");
    emptyState.className = "catalog-card";
    emptyState.innerHTML = `
      <div class="card-body">
        <p class="section-kicker">No results</p>
        <h3>Nothing matches that search yet.</h3>
        <p>Try a broader keyword like "custom", "wing", "unicorn", or switch the active filter.</p>
      </div>
    `;
    dom.catalog.appendChild(emptyState);
    return;
  }

  visibleProducts.forEach((product, index) => {
    const card = buildCard(product);
    card.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    dom.catalog.appendChild(card);
  });

  observeReveal();
}

function renderStats() {
  if (!dom.statCount) return;
  dom.statCount.textContent = String(products.length);
}

function renderSetupState() {
  if (pageType === "home") return;

  if (
    !dom.commerceHeadline ||
    !dom.commerceCopy ||
    !dom.setupStatusPill ||
    !dom.setupBannerCopy ||
    !dom.setupBannerHeadline
  ) {
    return;
  }

  const supabaseIssues = getSupabaseSetupIssues();
  const checkoutIssues = getCheckoutSetupIssues();
  const supabaseReady = supabaseIssues.length === 0;
  const configured = supabaseReady && checkoutIssues.length === 0;

  setHidden(dom.setupBanner, configured);

  if (configured) {
    dom.commerceHeadline.textContent = "Secure commerce is configured";
    dom.commerceCopy.textContent =
      "Supabase auth, saved profiles, order history, and Razorpay checkout can now work together.";
    dom.setupStatusPill.textContent = "Setup complete";
    dom.setupStatusPill.className = "status-pill status-pill-success";
    dom.setupBannerCopy.textContent =
      "Supabase and Razorpay are connected. Keep your service role key and Razorpay secret only inside Edge Function environment variables.";
    return;
  }

  if (supabaseReady) {
    dom.commerceHeadline.textContent = "Supabase is connected";
    dom.commerceCopy.textContent =
      "Account login, saved profiles, support tickets, and order history are ready. Finish Razorpay to enable live checkout.";
    dom.setupStatusPill.textContent = "Payments pending";
    dom.setupStatusPill.className = "status-pill status-pill-soft";
    dom.setupBannerHeadline.textContent = "Razorpay is the last step before live checkout.";
    dom.setupBannerCopy.innerHTML = [
      "<span>Supabase auth and data storage are already connected. Add the remaining Razorpay details below to enable payments.</span>",
      ...checkoutIssues.map((issue) => `<span>${issue}</span>`),
    ].join("<br />");
    return;
  }

  dom.commerceHeadline.textContent = "Supabase config needed";
  dom.commerceCopy.textContent =
    "Add the public Supabase values first to enable account login, saved profiles, support tickets, and order history.";
  dom.setupStatusPill.textContent = "Supabase pending";
  dom.setupStatusPill.className = "status-pill status-pill-soft";
  dom.setupBannerHeadline.textContent = "Connect Supabase first, then finish Razorpay.";
  dom.setupBannerCopy.innerHTML = [
    "<span>Start by wiring Supabase. Checkout can be enabled after auth and data storage are working.</span>",
    ...supabaseIssues.map((issue) => `<span>${issue}</span>`),
    ...checkoutIssues.map((issue) => `<span>${issue}</span>`),
  ].join("<br />");
}

function updateSupportChannels() {
  if (dom.supportEmail) {
    setContactLink(
      dom.supportEmail,
      publicConfig.supportEmail ? `mailto:${publicConfig.supportEmail}` : "",
      publicConfig.supportEmail,
      "Add your support email in supabase-config.js.",
    );
  }
  if (dom.supportWhatsapp) {
    const whatsappDigits = publicConfig.supportWhatsapp.replace(/[^\d]/g, "");
    setContactLink(
      dom.supportWhatsapp,
      whatsappDigits ? `https://wa.me/${whatsappDigits}` : "",
      publicConfig.supportWhatsapp,
      "Add your WhatsApp number in supabase-config.js.",
    );
  }
}

function getOrderReceiptNumber(order) {
  const receiptValue = order.order_receipts;

  if (Array.isArray(receiptValue)) {
    const receiptRow = receiptValue[0];
    return receiptRow?.receipt_number || null;
  }

  return receiptValue?.receipt_number || null;
}

function getProfileSeed() {
  const user = state.session?.user;
  const meta = user?.user_metadata || {};

  return {
    full_name: state.profile?.full_name || meta.full_name || "",
    phone: state.profile?.phone || meta.phone || "",
    email: state.profile?.email || user?.email || "",
    line1: state.profile?.line1 || meta.line1 || "",
    line2: state.profile?.line2 || meta.line2 || "",
    city: state.profile?.city || meta.city || "",
    state: state.profile?.state || meta.state || "",
    pincode: state.profile?.pincode || meta.pincode || "",
  };
}

function populateProfileForm() {
  if (
    !state.session ||
    !document.querySelector("#profile-full-name") ||
    !document.querySelector("#profile-phone") ||
    !document.querySelector("#profile-email")
  ) {
    return;
  }
  const seed = getProfileSeed();
  document.querySelector("#profile-full-name").value = seed.full_name;
  document.querySelector("#profile-phone").value = seed.phone;
  document.querySelector("#profile-email").value = seed.email;
  document.querySelector("#profile-line1").value = seed.line1;
  document.querySelector("#profile-line2").value = seed.line2;
  document.querySelector("#profile-city").value = seed.city;
  document.querySelector("#profile-state").value = seed.state;
  document.querySelector("#profile-pincode").value = seed.pincode;
}

function populateSecurityForms() {
  if (!dom.accountEmailCurrent) return;
  dom.accountEmailCurrent.value = state.session?.user?.email || "";
}

function populateOrderFormFromProfile() {
  if (
    !document.querySelector("#order-full-name") ||
    !document.querySelector("#order-phone") ||
    !document.querySelector("#order-email")
  ) {
    return;
  }

  const seed = getProfileSeed();
  document.querySelector("#order-full-name").value = seed.full_name;
  document.querySelector("#order-phone").value = seed.phone;
  document.querySelector("#order-email").value = seed.email;
  document.querySelector("#order-line1").value = seed.line1;
  document.querySelector("#order-line2").value = seed.line2;
  document.querySelector("#order-city").value = seed.city;
  document.querySelector("#order-state").value = seed.state;
  document.querySelector("#order-pincode").value = seed.pincode;
}

function renderAccountHub() {
  if (dom.accountShortcut) {
    dom.accountShortcut.textContent = state.session ? "My account" : "Account";
  }

  if (pageType === "home") {
    return;
  }

  if (dom.authStat) {
    dom.authStat.textContent = state.session
      ? pageType === "home"
        ? "Signed in"
        : getProfileSeed().full_name || state.session.user.email || "Signed in"
      : "Guest mode";
  }

  if (dom.authStatusPill) {
    dom.authStatusPill.textContent = state.session
      ? pageType === "home"
        ? "Account ready"
        : "Signed in"
      : "Guest";
    dom.authStatusPill.className = state.session
      ? "status-pill status-pill-success"
      : "status-pill";
  }

  if (dom.openAuth && pageType === "auth") {
    dom.openAuth.textContent = state.session ? "Manage login" : "Sign in / Create account";
  }

  if (!dom.accountName || !dom.accountSummaryCopy || !dom.accountStatusPill) {
    return;
  }

  if (!state.session) {
    dom.accountStatusPill.textContent = "Not signed in";
    dom.accountStatusPill.className = "status-pill";
    dom.accountName.textContent = "Guest customer";
    dom.accountSummaryCopy.textContent =
      "Sign in to unlock checkout, order history, support tickets, and saved address details.";
    if (dom.accountHeadline) dom.accountHeadline.textContent = "Login to unlock your saved account.";
    if (dom.openAuthInline) dom.openAuthInline.textContent = "Sign in / Create account";
    setHidden(dom.profileForm, true);
    setHidden(dom.emailForm, true);
    setHidden(dom.passwordForm, true);
    setHidden(dom.deleteAccountForm, true);
    if (dom.securityHelper) {
      dom.securityHelper.textContent = "Sign in to change your email address and password.";
    }
    if (dom.dangerHelper) {
      dom.dangerHelper.textContent = "Sign in before deleting your account. This removes your profile and account access.";
    }
    setHidden(dom.signOutButton, true);
    return;
  }

  const seed = getProfileSeed();
  dom.accountStatusPill.textContent = "Ready to order";
  dom.accountStatusPill.className = "status-pill status-pill-success";
  dom.accountName.textContent = seed.full_name || state.session.user.email;
  dom.accountSummaryCopy.textContent =
    "Your account details are saved and can prefill checkout, order history, and support requests.";
  if (dom.accountHeadline) dom.accountHeadline.textContent = "Your saved account details.";
  if (dom.openAuthInline) dom.openAuthInline.textContent = "Manage login";
  setHidden(dom.profileForm, false);
  setHidden(dom.emailForm, false);
  setHidden(dom.passwordForm, false);
  setHidden(dom.deleteAccountForm, false);
  if (dom.securityHelper) {
    dom.securityHelper.textContent = "Update your login email and password from this page.";
  }
  if (dom.dangerHelper) {
    dom.dangerHelper.textContent = "Delete your account only if you want to remove access completely.";
  }
  setHidden(dom.signOutButton, false);
  populateProfileForm();
  populateSecurityForms();
}

async function loadProfile() {
  if (!supabaseClient || !state.session) {
    state.profile = null;
    renderAccountHub();
    return;
  }

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", state.session.user.id)
    .maybeSingle();

  if (error) {
    setNotice(normaliseError(error), "warn");
  }

  state.profile = data || null;
  renderAccountHub();
  await loadOrderHistory();
}

async function upsertProfile(profilePayload) {
  if (!supabaseClient || !state.session) return;

  const payload = {
    id: state.session.user.id,
    email: state.session.user.email,
    ...profilePayload,
  };

  const { data, error } = await supabaseClient
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) throw error;
  state.profile = data;
  renderAccountHub();
}

function getProfileFormPayload() {
  return {
    full_name: document.querySelector("#profile-full-name").value.trim(),
    phone: document.querySelector("#profile-phone").value.trim(),
    line1: document.querySelector("#profile-line1").value.trim(),
    line2: document.querySelector("#profile-line2").value.trim(),
    city: document.querySelector("#profile-city").value.trim(),
    state: document.querySelector("#profile-state").value.trim(),
    pincode: document.querySelector("#profile-pincode").value.trim(),
  };
}

function setAuthMode(mode) {
  if (!dom.authTabs || !dom.authSubmit || !dom.authHelper) return;
  state.authMode = mode;
  dom.authTabs.querySelectorAll(".segmented-button").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.mode === mode);
  });

  document.querySelectorAll(".auth-signup-only").forEach((node) => {
    setHidden(node, mode !== "signup");
  });

  dom.authSubmit.textContent = mode === "signup" ? "Create account" : "Sign in";
  dom.authHelper.textContent =
    mode === "signup"
      ? "Create a secure account with shipping details so checkout is faster."
      : "Use your account to unlock checkout and order history.";
}

function openAuthDialog() {
  if (!dom.authDialog || typeof dom.authDialog.showModal !== "function") {
    navigateToAccountPage();
    return;
  }
  dom.authDialog.showModal();
}

function closeAuthDialog() {
  if (!dom.authDialog || typeof dom.authDialog.close !== "function") return;
  dom.authDialog.close();
}

function openProductModal(product) {
  if (
    !dom.productModal ||
    !dom.modalImage ||
    !dom.modalCode ||
    !dom.modalTitle ||
    !dom.modalSubtitle ||
    !dom.modalPrice ||
    !dom.modalFeatures
  ) {
    return;
  }
  state.selectedProduct = product;
  const breakdown = getPriceBreakdown(product);
  dom.modalImage.src = product.image;
  dom.modalImage.alt = product.title;
  dom.modalCode.textContent = product.code;
  dom.modalTitle.textContent = product.title;
  dom.modalSubtitle.textContent = product.subtitle;
  dom.modalPrice.innerHTML = `
    <div class="price-row">
      <span>Original</span>
      <strong class="price-strike">${inrFormatter.format(breakdown.originalBase)}</strong>
    </div>
    <div class="price-row">
      <span>Discount</span>
      <strong class="price-discount">${breakdown.discountLabel} (${inrFormatter.format(
        breakdown.discountAmount,
      )})</strong>
    </div>
    <div class="price-row price-row-emphasis">
      <span>Sale price</span>
      <strong>${inrFormatter.format(breakdown.discountedBase)}</strong>
    </div>
    <div class="price-row">
      <span>USD</span>
      <strong>${usdFormatter.format(toUsd(breakdown.discountedBase))}</strong>
    </div>
    <div class="price-row">
      <span>Customization</span>
      <strong>${inrFormatter.format(customizationFeeInr)}</strong>
    </div>
  `;
  dom.modalFeatures.innerHTML = product.features.map((item) => `<li>${item}</li>`).join("");
  dom.productModal.showModal();
}

function closeProductModal() {
  if (!dom.productModal || typeof dom.productModal.close !== "function") return;
  dom.productModal.close();
  state.selectedProduct = null;
}

function setOrderDialogProduct(product) {
  if (
    !dom.orderHeading ||
    !dom.orderProductTitle ||
    !dom.orderProductCopy ||
    !dom.orderProductCode ||
    !dom.orderBasePrice
  ) {
    return;
  }
  state.orderProduct = product;
  const breakdown = getPriceBreakdown(product);
  dom.orderHeading.textContent = `Complete your ${product.title} order.`;
  dom.orderProductTitle.textContent = product.title;
  dom.orderProductCopy.textContent = `${product.subtitle} ${breakdown.discountLabel} is applied automatically before customization.`;
  dom.orderProductCode.textContent = product.code;
  dom.orderBasePrice.textContent = inrFormatter.format(breakdown.discountedBase);
  if (!document.querySelector("#order-delivery-date").value) {
    document.querySelector("#order-delivery-date").value = formatDateForInput();
  }
  populateOrderFormFromProfile();
  updateOrderSummary();
}

function openOrderFlow(product) {
  if (!state.session) {
    state.pendingOrderProduct = product;
    setNotice("Please sign in or create an account before ordering.", "warn");
    openAuthDialog();
    return;
  }

  if (!dom.orderDialog || typeof dom.orderDialog.showModal !== "function") {
    navigateToAccountPage();
    return;
  }

  setOrderDialogProduct(product);
  dom.orderDialog.showModal();
}

function closeOrderDialog() {
  if (!dom.orderDialog || !dom.orderForm || typeof dom.orderDialog.close !== "function") return;
  dom.orderDialog.close();
  state.orderProduct = null;
  dom.orderForm.reset();
  document.querySelector("#order-delivery-date").value = formatDateForInput();
  setHidden(dom.customizationNotesShell, true);
  updateOrderSummary();
}

function updateOrderSummary() {
  if (
    !dom.customizationCheckbox ||
    !dom.summaryOriginalPrice ||
    !dom.summaryDiscountPrice ||
    !dom.summaryBasePrice ||
    !dom.summaryCustomizationPrice ||
    !dom.summaryTotalPrice
  ) {
    return;
  }

  const breakdown = getPriceBreakdown(state.orderProduct, dom.customizationCheckbox.checked);

  setHidden(dom.customizationNotesShell, !dom.customizationCheckbox.checked);
  dom.summaryOriginalPrice.textContent = inrFormatter.format(breakdown.originalBase);
  dom.summaryDiscountPrice.textContent = `-${inrFormatter.format(breakdown.discountAmount)} (${breakdown.discountLabel})`;
  dom.summaryBasePrice.textContent = inrFormatter.format(breakdown.discountedBase);
  dom.summaryCustomizationPrice.textContent = inrFormatter.format(breakdown.customizationCharge);
  dom.summaryTotalPrice.textContent = inrFormatter.format(breakdown.finalTotal);
}

function getOrderPayload() {
  if (!state.orderProduct) throw new Error("Choose a product before checking out.");

  return {
    productCode: state.orderProduct.code,
    productTitle: state.orderProduct.title,
    deliveryDate: document.querySelector("#order-delivery-date").value,
    fullName: document.querySelector("#order-full-name").value.trim(),
    email: document.querySelector("#order-email").value.trim(),
    phone: document.querySelector("#order-phone").value.trim(),
    line1: document.querySelector("#order-line1").value.trim(),
    line2: document.querySelector("#order-line2").value.trim(),
    city: document.querySelector("#order-city").value.trim(),
    state: document.querySelector("#order-state").value.trim(),
    pincode: document.querySelector("#order-pincode").value.trim(),
    notes: document.querySelector("#order-notes").value.trim(),
    customizationRequested: dom.customizationCheckbox.checked,
    customizationNotes: document.querySelector("#order-customization-notes").value.trim(),
  };
}

function buildRazorpayOptions(orderResponse, payload) {
  return {
    key: publicConfig.razorpayKeyId,
    amount: orderResponse.amountPaise,
    currency: orderResponse.currency,
    name: "Yengu",
    description: payload.productTitle,
    order_id: orderResponse.razorpayOrderId,
    prefill: {
      name: payload.fullName,
      email: payload.email,
      contact: payload.phone,
    },
    notes: {
      product_code: payload.productCode,
      delivery_date: payload.deliveryDate,
      customization: payload.customizationRequested ? "yes" : "no",
    },
    theme: {
      color: "#69d4ff",
    },
    handler: async (response) => {
      try {
        setButtonBusy(dom.checkoutButton, true, "Verifying payment...");
        const { data, error } = await supabaseClient.functions.invoke("verify-razorpay-payment", {
          body: {
            checkoutOrderId: orderResponse.checkoutOrderId,
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
          },
        });

        if (error) throw error;

        await loadOrderHistory();
        closeOrderDialog();
        setNotice(
          `Payment confirmed for ${data.productTitle || payload.productTitle}. Receipt ${data.receiptNumber || "generated"} was recorded.`,
          "success",
        );
      } catch (error) {
        setNotice(normaliseError(error), "error");
      } finally {
        setButtonBusy(
          dom.checkoutButton,
          false,
          "Proceed to secure checkout",
          "Proceed to secure checkout",
        );
      }
    },
    modal: {
      ondismiss: () => {
        setNotice("Checkout closed before payment confirmation.", "warn");
      },
    },
  };
}

async function loadOrderHistory() {
  if (!dom.orderHistoryList) return;
  if (!supabaseClient || !state.session) {
    dom.orderHistoryList.innerHTML = `
      <article class="empty-panel">
        <strong>No orders yet</strong>
        <p>Sign in and place an order to start building a secure order history timeline.</p>
      </article>
    `;
    return;
  }

  let { data, error } = await supabaseClient
    .from("orders")
    .select("*, order_receipts(receipt_number)")
    .order("created_at", { ascending: false })
    .limit(8);

  if (error && error.message?.includes("order_receipts")) {
    ({ data, error } = await supabaseClient
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(8));
  }

  if (error) {
    setNotice(normaliseError(error), "warn");
    return;
  }

  if (!data.length) {
    dom.orderHistoryList.innerHTML = `
      <article class="empty-panel">
        <strong>No orders yet</strong>
        <p>Your paid and pending orders will show up here after checkout starts.</p>
      </article>
    `;
    return;
  }

  dom.orderHistoryList.innerHTML = data
    .map((order) => {
      const receiptNumber = getOrderReceiptNumber(order);

      return `
        <article class="history-item">
          <div class="history-item-head">
            <div>
              <strong>${order.product_title}</strong>
              <p>${order.product_code}</p>
            </div>
            <span class="status-pill ${
              order.order_status === "paid" ? "status-pill-success" : "status-pill-soft"
            }">${order.order_status.replaceAll("_", " ")}</span>
          </div>
          <div class="history-meta">
            <span>Total: ${inrFormatter.format(order.total_price_inr)}</span>
            <span>Delivery: ${humanDate(order.delivery_date)}</span>
            <span>Receipt: ${receiptNumber || "Pending"}</span>
          </div>
          <div class="history-meta">
            <span>Saved: ${inrFormatter.format(order.discount_amount_inr || 0)}</span>
            <span>Customization: ${order.customization_requested ? "Yes" : "No"}</span>
            <span>Placed: ${humanDate(order.created_at?.slice(0, 10))}</span>
          </div>
        </article>
      `;
    })
    .join("");
}

async function initAuth() {
  if (!supabaseClient) {
    renderAccountHub();
    return;
  }

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  state.session = session;
  renderAccountHub();

  if (session) {
    await loadProfile();
  }

  supabaseClient.auth.onAuthStateChange(async (_event, sessionValue) => {
    state.session = sessionValue;
    renderAccountHub();

    if (sessionValue) {
      await loadProfile();
      if (state.pendingOrderProduct) {
        const pendingProduct = state.pendingOrderProduct;
        state.pendingOrderProduct = null;
        closeAuthDialog();
        openOrderFlow(pendingProduct);
      }
    } else {
      state.profile = null;
      await loadOrderHistory();
    }
  });
}

async function handleProfileSubmit(event) {
  event.preventDefault();

  if (!state.session || !supabaseClient) {
    setNotice("Sign in first to save account details.", "warn");
    return;
  }

  try {
    setButtonBusy(dom.saveProfileButton, true, "Saving...");
    await upsertProfile(getProfileFormPayload());
    setNotice("Account details saved.", "success");
  } catch (error) {
    setNotice(normaliseError(error), "error");
  } finally {
    setButtonBusy(dom.saveProfileButton, false, "Save account details", "Save account details");
  }
}

async function handleAuthSubmit(event) {
  event.preventDefault();

  if (!supabaseClient) {
    setNotice(getFeatureUnavailableNotice("Sign in", getSupabaseSetupIssues()), "warn");
    return;
  }

  const email = document.querySelector("#auth-email").value.trim();
  const password = document.querySelector("#auth-password").value;

  try {
    setButtonBusy(dom.authSubmit, true, state.authMode === "signup" ? "Creating..." : "Signing in...");

    if (state.authMode === "signin") {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) throw error;
      closeAuthDialog();
      setNotice("Signed in successfully.", "success");
      return;
    }

    const metadata = {
      full_name: document.querySelector("#auth-full-name").value.trim(),
      phone: document.querySelector("#auth-phone").value.trim(),
      line1: document.querySelector("#auth-line1").value.trim(),
      line2: document.querySelector("#auth-line2").value.trim(),
      city: document.querySelector("#auth-city").value.trim(),
      state: document.querySelector("#auth-state").value.trim(),
      pincode: document.querySelector("#auth-pincode").value.trim(),
    };

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;

    if (data.session) {
      closeAuthDialog();
      setNotice("Account created and signed in.", "success");
      return;
    }

    setNotice("Account created. Check your email for the confirmation link, then sign in.", "success");
  } catch (error) {
    setNotice(normaliseError(error), "error");
  } finally {
    setButtonBusy(
      dom.authSubmit,
      false,
      state.authMode === "signup" ? "Creating..." : "Signing in...",
      state.authMode === "signup" ? "Create account" : "Sign in",
    );
  }
}

async function handleOrderSubmit(event) {
  event.preventDefault();

  if (!state.session) {
    openAuthDialog();
    setNotice("Please sign in before ordering.", "warn");
    return;
  }

  if (!supabaseClient || getSetupIssues().length) {
    setNotice(
      getFeatureUnavailableNotice("Checkout", [
        ...getSupabaseSetupIssues(),
        ...getCheckoutSetupIssues(),
      ]),
      "warn",
    );
    return;
  }

  if (!window.Razorpay) {
    setNotice("Razorpay checkout failed to load.", "error");
    return;
  }

  try {
    const payload = getOrderPayload();

    await upsertProfile({
      full_name: payload.fullName,
      phone: payload.phone,
      line1: payload.line1,
      line2: payload.line2,
      city: payload.city,
      state: payload.state,
      pincode: payload.pincode,
    });

    setButtonBusy(dom.checkoutButton, true, "Creating order...");

    const { data, error } = await supabaseClient.functions.invoke("create-razorpay-order", {
      body: payload,
    });

    if (error) throw error;

    const razorpay = new window.Razorpay(buildRazorpayOptions(data, payload));
    razorpay.open();
  } catch (error) {
    setNotice(normaliseError(error), "error");
  } finally {
    setButtonBusy(
      dom.checkoutButton,
      false,
      "Proceed to secure checkout",
      "Proceed to secure checkout",
    );
  }
}

async function handleSupportSubmit(event) {
  event.preventDefault();

  if (!state.session) {
    openAuthDialog();
    setNotice("Sign in before sending a support request.", "warn");
    return;
  }

  if (!supabaseClient) {
    setNotice(getFeatureUnavailableNotice("Support requests", getSupabaseSetupIssues()), "warn");
    return;
  }

  try {
    const payload = {
      user_id: state.session.user.id,
      email: state.session.user.email,
      subject: document.querySelector("#support-subject").value.trim(),
      order_reference: document.querySelector("#support-order-reference").value.trim(),
      message: document.querySelector("#support-message").value.trim(),
    };

    const { error } = await supabaseClient.from("support_requests").insert(payload);

    if (error) throw error;

    dom.supportForm.reset();
    setNotice("Support request sent.", "success");
  } catch (error) {
    setNotice(normaliseError(error), "error");
  }
}

async function handleEmailSubmit(event) {
  event.preventDefault();

  if (!state.session || !supabaseClient) {
    setNotice("Sign in first to change your email.", "warn");
    return;
  }

  const nextEmail = document.querySelector("#account-email-next").value.trim();
  if (!nextEmail) {
    setNotice("Enter a new email address.", "warn");
    return;
  }

  try {
    setButtonBusy(dom.updateEmailButton, true, "Updating...");
    const { error } = await supabaseClient.auth.updateUser({ email: nextEmail });
    if (error) throw error;

    document.querySelector("#account-email-next").value = "";
    setNotice("Email update requested. Check your inbox if confirmation is required.", "success");
  } catch (error) {
    setNotice(normaliseError(error), "error");
  } finally {
    setButtonBusy(dom.updateEmailButton, false, "Update email", "Update email");
  }
}

async function handlePasswordSubmit(event) {
  event.preventDefault();

  if (!state.session || !supabaseClient) {
    setNotice("Sign in first to change your password.", "warn");
    return;
  }

  const nextPassword = document.querySelector("#account-new-password").value;
  const confirmPassword = document.querySelector("#account-confirm-password").value;

  if (nextPassword.length < 6) {
    setNotice("Password must be at least 6 characters.", "warn");
    return;
  }

  if (nextPassword !== confirmPassword) {
    setNotice("Password confirmation does not match.", "warn");
    return;
  }

  try {
    setButtonBusy(dom.updatePasswordButton, true, "Updating...");
    const { error } = await supabaseClient.auth.updateUser({ password: nextPassword });
    if (error) throw error;

    dom.passwordForm.reset();
    setNotice("Password changed successfully.", "success");
  } catch (error) {
    setNotice(normaliseError(error), "error");
  } finally {
    setButtonBusy(dom.updatePasswordButton, false, "Change password", "Change password");
  }
}

async function handleDeleteAccountSubmit(event) {
  event.preventDefault();

  if (!state.session || !supabaseClient) {
    setNotice("Sign in first to delete your account.", "warn");
    return;
  }

  const confirmation = document.querySelector("#delete-account-confirmation").value.trim();
  if (confirmation !== "DELETE") {
    setNotice('Type "DELETE" exactly to confirm account deletion.', "warn");
    return;
  }

  try {
    setButtonBusy(dom.deleteAccountButton, true, "Deleting...");
    const { data, error } = await supabaseClient.functions.invoke("delete-account", {
      body: {
        confirmation,
      },
    });

    if (error) throw error;
    if (!data?.success) {
      throw new Error("Account deletion failed.");
    }

    await supabaseClient.auth.signOut();
    window.location.href = "./index.html";
  } catch (error) {
    const message = normaliseError(error);
    if (message.includes("404")) {
      setNotice("Account deletion is not available yet on the live backend.", "warn");
      return;
    }
    setNotice(message, "error");
  } finally {
    setButtonBusy(dom.deleteAccountButton, false, "Delete account", "Delete account");
  }
}

function observeReveal() {
  const nodes = document.querySelectorAll(".reveal");
  if (!nodes.length) return;
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  nodes.forEach((node) => {
    if (!node.classList.contains("is-visible")) observer.observe(node);
  });
}

function bindDialogBackdropClose(dialog, closeHandler) {
  if (!dialog) return;
  dialog.addEventListener("click", (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outside) closeHandler();
  });
}

function bindEvents() {
  if (dom.searchInput) dom.searchInput.addEventListener("input", renderCatalog);
  if (dom.accountShortcut && dom.accountShortcut.tagName === "BUTTON") {
    dom.accountShortcut.addEventListener("click", () => {
      const target = document.querySelector("#account-hub");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  if (dom.openAuth) dom.openAuth.addEventListener("click", openAuthDialog);
  if (dom.openAuthInline) dom.openAuthInline.addEventListener("click", openAuthDialog);
  if (dom.signOutButton) dom.signOutButton.addEventListener("click", async () => {
    if (!supabaseClient) return;
    await supabaseClient.auth.signOut();
    setNotice("Signed out.", "success");
  });
  if (dom.profileForm) dom.profileForm.addEventListener("submit", handleProfileSubmit);
  if (dom.emailForm) dom.emailForm.addEventListener("submit", handleEmailSubmit);
  if (dom.passwordForm) dom.passwordForm.addEventListener("submit", handlePasswordSubmit);
  if (dom.deleteAccountForm) dom.deleteAccountForm.addEventListener("submit", handleDeleteAccountSubmit);
  if (dom.refreshOrders) dom.refreshOrders.addEventListener("click", loadOrderHistory);
  if (dom.supportForm) dom.supportForm.addEventListener("submit", handleSupportSubmit);

  if (dom.modalClose) dom.modalClose.addEventListener("click", closeProductModal);
  if (dom.modalOrder) dom.modalOrder.addEventListener("click", () => {
    if (state.selectedProduct) {
      closeProductModal();
      openOrderFlow(state.selectedProduct);
    }
  });
  if (dom.modalCopy) dom.modalCopy.addEventListener("click", () => {
    if (state.selectedProduct) copyInquiry(state.selectedProduct);
  });

  if (dom.authClose) dom.authClose.addEventListener("click", closeAuthDialog);
  if (dom.authTabs) {
    dom.authTabs.querySelectorAll(".segmented-button").forEach((button) => {
      button.addEventListener("click", () => setAuthMode(button.dataset.mode));
    });
  }
  if (dom.authForm) dom.authForm.addEventListener("submit", handleAuthSubmit);

  if (dom.orderClose) dom.orderClose.addEventListener("click", closeOrderDialog);
  if (dom.orderForm) dom.orderForm.addEventListener("submit", handleOrderSubmit);
  if (dom.customizationCheckbox) dom.customizationCheckbox.addEventListener("change", updateOrderSummary);
  if (dom.syncProfileButton) dom.syncProfileButton.addEventListener("click", () => {
    populateOrderFormFromProfile();
    updateOrderSummary();
    setNotice("Saved account details loaded into the order form.", "success");
  });

  bindDialogBackdropClose(dom.productModal, closeProductModal);
  bindDialogBackdropClose(dom.authDialog, closeAuthDialog);
  bindDialogBackdropClose(dom.orderDialog, closeOrderDialog);
}

function setOrderDefaults() {
  const deliveryDateField = document.querySelector("#order-delivery-date");
  if (!deliveryDateField) return;
  deliveryDateField.min = formatDateForInput(1);
  deliveryDateField.value = formatDateForInput();
}

function init() {
  renderStats();
  renderSpotlight();
  renderFilters();
  renderCatalog();
  renderSetupState();
  updateSupportChannels();
  setAuthMode("signin");
  setOrderDefaults();
  updateOrderSummary();
  bindEvents();
  observeReveal();
  initAuth();
}

init();
