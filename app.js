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
  // ... (keeping all products data as is)
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
  // ... (keeping all dom selectors as is)
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

const validators = {
  required: (value) => value.trim().length > 0,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
  phone: (value) => /^[6-9]\d{9}$/.test(value.replace(/[^\d]/g, '')), // India 10-digit
  pincode: (value) => /^\d{6}$/.test(value.replace(/[^\d]/g, '')),
  passwordStrength: (value) => value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value),
};

function getFieldError(fieldId, value) {
  if (!validators.required(value)) return 'This field is required.';
  if (fieldId.includes('email') && !validators.email(value)) return 'Enter a valid email.';
  if (fieldId.includes('phone') && !validators.phone(value)) return 'Enter valid 10-digit phone.';
  if (fieldId.includes('pincode') && !validators.pincode(value)) return 'Enter 6-digit pincode.';
  if (fieldId.includes('password') && !validators.passwordStrength(value)) return 'Password: 8+ chars, uppercase, lowercase, number.';
  return '';
}

function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;
  let isValid = true;
  form.querySelectorAll('input, textarea, select').forEach(field => {
    const errorContainer = field.parentNode.querySelector('.error-msg');
    const error = getFieldError(field.id, field.value);
    if (error) {
      field.classList.add('error');
      if (errorContainer) {
        errorContainer.textContent = error;
        errorContainer.classList.remove('hidden');
      }
      isValid = false;
    } else {
      field.classList.remove('error');
      if (errorContainer) errorContainer.classList.add('hidden');
    }
  });
  return isValid;
}

function setupValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', (e) => {
    if (!validateForm(formId)) {
      e.preventDefault();
      setNotice('Please fix errors before submitting.', 'warn');
    }
  });
  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('input', () => validateForm(formId));
  });
}

// Theme utils
function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = 'dark';
  if (saved === 'light' || (!saved && !prefersDark)) theme = 'light';
  document.body.dataset.theme = theme;
  updateThemeToggle();
}

function toggleTheme() {
  const current = document.body.dataset.theme || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.dataset.theme = next;
  localStorage.setItem('theme', next);
  updateThemeToggle();
}

function updateThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.textContent = document.body.dataset.theme === 'dark' ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', document.body.dataset.theme === 'dark' ? 'Switch to light' : 'Switch to dark');
  }
}

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', initTheme);

function bindThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) toggle.addEventListener('click', toggleTheme);
}

// All other functions remain the same (createSupabaseClient, toUsd, etc.)
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

// ... (all other functions unchanged until bindEvents)

function bindEvents() {
  if (dom.searchInput) dom.searchInput.addEventListener("input", renderCatalog);
  ['auth-form', 'profile-form', 'order-form', 'support-form', 'email-form', 'password-form', 'delete-account-form'].forEach(setupValidation);
  bindThemeToggle();
  if (dom.accountShortcut && dom.accountShortcut.tagName === "BUTTON") {
    dom.accountShortcut.addEventListener("click", () => {
      const target = document.querySelector("#account-hub");
      if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
  // ... (rest of bindEvents unchanged)
}

function init() {
  initTheme();
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
