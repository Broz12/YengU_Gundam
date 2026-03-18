const exchange = {
  inrPerUsd: 92.33,
  source: "Wise",
  sourcedDate: "March 12, 2026",
};

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
];

const filters = ["all", "custom", "wings", "premium", "led", "classic"];

const catalogNode = document.querySelector("#catalog");
const filtersNode = document.querySelector("#filters");
const searchInput = document.querySelector("#search-input");
const productModal = document.querySelector("#product-modal");
const modalClose = document.querySelector("#modal-close");
const modalImage = document.querySelector("#modal-image");
const modalCode = document.querySelector("#modal-code");
const modalTitle = document.querySelector("#modal-title");
const modalSubtitle = document.querySelector("#modal-subtitle");
const modalPrice = document.querySelector("#modal-price");
const modalFeatures = document.querySelector("#modal-features");
const modalCopyButton = document.querySelector("#modal-copy");

let activeFilter = "all";
let selectedProduct = null;

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

function toUsd(inrPrice) {
  return inrPrice / exchange.inrPerUsd;
}

function getInquiryText(product) {
  return [
    `Interested in ${product.title} (${product.code})`,
    `Price: ${inrFormatter.format(product.inrPrice)} | ${usdFormatter.format(toUsd(product.inrPrice))}`,
    "Availability: 1 piece",
    "Please share shipping details and payment steps.",
  ].join("\n");
}

async function copyInquiry(product) {
  const text = getInquiryText(product);
  try {
    await navigator.clipboard.writeText(text);
  } catch (_error) {
    window.prompt("Copy the inquiry text below:", text);
  }
}

function matchesSearch(product, query) {
  if (!query) return true;
  const haystack = [
    product.title,
    product.subtitle,
    ...product.tags,
    ...product.features,
  ]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function matchesFilter(product, filter) {
  if (filter === "all") return true;
  return product.tags.includes(filter);
}

function buildCard(product) {
  const article = document.createElement("article");
  article.className = "catalog-card reveal";

  article.innerHTML = `
    <figure class="card-media">
      <img src="${product.image}" alt="${product.title}" loading="lazy" decoding="async" />
      <div class="card-tags">
        ${product.tags
          .slice(0, 3)
          .map((tag) => `<span class="card-tag">${tag.replace("-", " ")}</span>`)
          .join("")}
      </div>
    </figure>
    <div class="card-body">
      <div class="card-header">
        <div>
          <p class="section-kicker">Collector Listing</p>
          <h3>${product.title}</h3>
        </div>
        <span class="code-pill">${product.code}</span>
      </div>
      <p>${product.subtitle}</p>
      <ul class="feature-list">
        ${product.features.slice(0, 3).map((item) => `<li>${item}</li>`).join("")}
      </ul>
      <div class="price-panel">
        <div class="price-row">
          <span>INR</span>
          <strong>${inrFormatter.format(product.inrPrice)}</strong>
        </div>
        <div class="price-row">
          <span>USD</span>
          <strong>${usdFormatter.format(toUsd(product.inrPrice))}</strong>
        </div>
        <p class="price-caption"><strong>Only 1 piece available.</strong> Copy the inquiry to claim it fast.</p>
      </div>
      <div class="card-actions">
        <button class="action-button" data-action="details">View details</button>
        <button class="action-button" data-action="copy">Copy inquiry</button>
      </div>
    </div>
  `;

  const [detailsButton, copyButton] = article.querySelectorAll(".action-button");

  detailsButton.addEventListener("click", () => openModal(product));
  copyButton.addEventListener("click", () => copyInquiry(product));

  return article;
}

function renderFilters() {
  filtersNode.innerHTML = "";

  filters.forEach((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-pill${filter === activeFilter ? " is-active" : ""}`;
    button.textContent = filter;
    button.addEventListener("click", () => {
      activeFilter = filter;
      renderFilters();
      renderCatalog();
    });
    filtersNode.appendChild(button);
  });
}

function renderCatalog() {
  const query = searchInput.value.trim();
  const visibleProducts = products.filter(
    (product) => matchesFilter(product, activeFilter) && matchesSearch(product, query),
  );

  catalogNode.innerHTML = "";

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
    catalogNode.appendChild(emptyState);
    return;
  }

  visibleProducts.forEach((product, index) => {
    const card = buildCard(product);
    card.style.transitionDelay = `${Math.min(index * 45, 240)}ms`;
    catalogNode.appendChild(card);
  });

  observeReveal();
}

function openModal(product) {
  selectedProduct = product;
  modalImage.src = product.image;
  modalImage.alt = product.title;
  modalCode.textContent = product.code;
  modalTitle.textContent = product.title;
  modalSubtitle.textContent = product.subtitle;
  modalPrice.innerHTML = `
    <div class="price-row">
      <span>INR</span>
      <strong>${inrFormatter.format(product.inrPrice)}</strong>
    </div>
    <div class="price-row">
      <span>USD</span>
      <strong>${usdFormatter.format(toUsd(product.inrPrice))}</strong>
    </div>
  `;
  modalFeatures.innerHTML = product.features.map((item) => `<li>${item}</li>`).join("");
  productModal.showModal();
}

function closeModal() {
  productModal.close();
  selectedProduct = null;
}

function observeReveal() {
  const nodes = document.querySelectorAll(".reveal");
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

function renderStats() {
  document.querySelector("#stat-count").textContent = String(products.length);
  document.querySelector("#stat-range").textContent = `${inrFormatter.format(
    Math.min(...products.map((product) => product.inrPrice)),
  )} to ${inrFormatter.format(Math.max(...products.map((product) => product.inrPrice)))}`;

  const rateLine = `1 USD approx. ${inrFormatter.format(exchange.inrPerUsd)} from ${exchange.source} (${exchange.sourcedDate})`;
  document.querySelector("#exchange-rate-copy").textContent = rateLine;
  document.querySelector(
    "#exchange-footnote",
  ).textContent = `USD values are estimated from a recent ${exchange.source} mid-market INR to USD reference surfaced for ${exchange.sourcedDate}. The site keeps your pasted INR prices as the source of truth and calculates USD with 2-decimal formatting for readability.`;
}

searchInput.addEventListener("input", renderCatalog);
modalClose.addEventListener("click", closeModal);
productModal.addEventListener("click", (event) => {
  const bounds = productModal.getBoundingClientRect();
  const clickedOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;

  if (clickedOutside) closeModal();
});

modalCopyButton.addEventListener("click", () => {
  if (selectedProduct) copyInquiry(selectedProduct);
});

renderStats();
renderFilters();
renderCatalog();
observeReveal();
