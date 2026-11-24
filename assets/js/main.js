/* =========================================================
   Roots & Fire — site behavior
   ---------------------------------------------------------
   ALL EXTERNAL LINKS LIVE HERE. Replace the pending values
   with the real ones (they are in Lady's PDF menu) and every
   button on the page updates automatically.
   ========================================================= */
const SITE = {
  // PENDING: direct store links from the PDF menu. Until then we send people to a platform search.
  uberEats: "https://www.ubereats.com/search?q=Roots%20and%20Fire%20Brooklyn",
  doorDash: "https://www.doordash.com/search/store/Roots%20and%20Fire/",

  // PENDING: WhatsApp number in international format, digits only (e.g. "13475550123").
  whatsapp: "",

  // PENDING: phone number for "Call us" (e.g. "+13475550123").
  phone: "",

  // PENDING: upload the PDF menu to /assets/ and set the path (e.g. "assets/menu-roots-and-fire.pdf").
  menuPdf: "",
};

document.documentElement.classList.add("js");

const I18N = window.RF_I18N || { es: {}, ui: { en: {}, es: {} } };
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lang = "en";
const t = (key) => (I18N.ui[lang] && I18N.ui[lang][key]) ?? I18N.ui.en[key] ?? "";

/* ---------- Toast ---------- */
const toastEl = document.querySelector("[data-toast]");
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 3000);
}

/* ---------- External links (Uber Eats, DoorDash, WhatsApp, phone, PDF) ---------- */
function waUrl(message) {
  if (!SITE.whatsapp) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${SITE.whatsapp.replace(/\D/g, "")}${text}`;
}

function buildHref(kind, el) {
  const value = SITE[kind];
  if (!value) return "";
  if (kind === "whatsapp") return waUrl(el.dataset.waKey ? t(el.dataset.waKey) : "");
  if (kind === "phone") return `tel:${value.replace(/[^\d+]/g, "")}`;
  return value;
}

function updateLinks() {
  document.querySelectorAll("[data-link]").forEach((el) => {
    const href = buildHref(el.dataset.link, el);
    if (href) {
      el.setAttribute("href", href);
      if (el.dataset.link !== "phone") {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener");
      }
      el.removeAttribute("data-pending");
    } else {
      el.setAttribute("href", "#");
      el.removeAttribute("target");
      el.setAttribute("data-pending", "");
    }
  });
}

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-link][data-pending]");
  if (!el) return;
  e.preventDefault();
  const label = (t("labels") || {})[el.dataset.link] || "link";
  toast(t("pending").replace("{label}", label));
});

/* ---------- Language (EN in the HTML, ES from i18n.js) ---------- */
const textEls = [...document.querySelectorAll("[data-i18n]")].map((el) => ({ el, key: el.dataset.i18n, en: el.innerHTML }));
const attrEls = [...document.querySelectorAll("[data-i18n-attr]")].flatMap((el) =>
  el.dataset.i18nAttr.split("|").map((pair) => {
    const [attr, key] = pair.split(":");
    return { el, attr, key, en: el.getAttribute(attr) ?? "" };
  })
);
const metaDesc = document.querySelector('meta[name="description"]');
const pageKey = document.body.dataset.page || "home";

// Internal page links (menu.html, about.html#chefs…) carry ?lang=es so the language survives navigation.
function localizeLinks() {
  document.querySelectorAll("a[href]").forEach((a) => {
    const base = a.dataset.hrefBase ?? a.getAttribute("href");
    if (!/^[\w-]+\.html(#.*)?$/.test(base)) return;
    a.dataset.hrefBase = base;
    if (lang !== "es") { a.setAttribute("href", base); return; }
    const [path, hash] = base.split("#");
    a.setAttribute("href", `${path}?lang=es${hash ? `#${hash}` : ""}`);
  });
}

function applyLang(next) {
  lang = next === "es" ? "es" : "en";
  const dict = lang === "es" ? I18N.es : {};
  textEls.forEach(({ el, key, en }) => { el.innerHTML = dict[key] ?? en; });
  attrEls.forEach(({ el, attr, key, en }) => { el.setAttribute(attr, dict[key] ?? en); });
  document.documentElement.lang = lang;
  const [title, description] = (t("pages") || {})[pageKey] || [];
  if (title) document.title = title;
  if (metaDesc && description) metaDesc.setAttribute("content", description);
  document.querySelectorAll("[data-lang]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  updateLinks();
  localizeLinks();
  try { localStorage.setItem("rf-lang", lang); } catch (_) { /* storage unavailable */ }
}

document.querySelectorAll("[data-lang]").forEach((b) => b.addEventListener("click", () => {
  applyLang(b.dataset.lang);
  const url = new URL(window.location.href);
  if (lang === "es") url.searchParams.set("lang", "es"); else url.searchParams.delete("lang");
  history.replaceState(null, "", url);
}));

let initial = new URLSearchParams(window.location.search).get("lang");
if (!initial) { try { initial = localStorage.getItem("rf-lang"); } catch (_) { initial = null; } }
applyLang(initial || "en");

/* ---------- Header, mobile nav, order menu ---------- */
const header = document.querySelector("[data-header]");
const hero = document.querySelector(".hero, .page-hero");
const orderBar = document.querySelector(".order-bar");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 40);
  if (orderBar && hero) orderBar.classList.toggle("is-visible", y > hero.offsetHeight - 160);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
function setNav(open) {
  if (!mobileNav || !navToggle) return;
  mobileNav.hidden = !open;
  navToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("no-scroll", open);
}
navToggle?.addEventListener("click", () => setNav(mobileNav.hidden));
mobileNav?.querySelectorAll("nav a").forEach((a) => a.addEventListener("click", () => setNav(false)));

const orderToggle = document.querySelector("[data-order-toggle]");
const orderPanel = document.querySelector("[data-order-panel]");
function setOrder(open) {
  if (!orderPanel || !orderToggle) return;
  orderPanel.hidden = !open;
  orderToggle.setAttribute("aria-expanded", String(open));
}
orderToggle?.addEventListener("click", (e) => { e.stopPropagation(); setOrder(orderPanel.hidden); });
document.addEventListener("click", (e) => { if (orderPanel && !orderPanel.hidden && !e.target.closest("[data-order-menu]")) setOrder(false); });
orderPanel?.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOrder(false)));
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  setNav(false);
  setOrder(false);
});
window.addEventListener("resize", () => { if (window.innerWidth > 1100) setNav(false); });

/* ---------- Hero slideshow ---------- */
const slides = [...document.querySelectorAll("[data-slide]")];
const dots = [...document.querySelectorAll("[data-dot]")];
const pauseSlideshow = document.querySelector("[data-slideshow-pause]");
let slideshowPaused = reduceMotion;
let slideshowHovered = false;
let current = 0;
let timer;

function showSlide(i) {
  current = (i + slides.length) % slides.length;
  slides.forEach((s, n) => {
    s.classList.toggle("is-active", n === current);
    s.setAttribute("aria-hidden", String(n !== current));
  });
  dots.forEach((d, n) => {
    d.classList.toggle("is-active", n === current);
    d.setAttribute("aria-current", n === current ? "true" : "false");
  });
  // Load the next slide's photo ahead of time.
  const next = slides[(current + 1) % slides.length]?.querySelector("img");
  if (next) next.loading = "eager";
}
function startAutoplay() {
  clearInterval(timer);
  if (slideshowPaused || slideshowHovered || document.hidden || hero?.contains(document.activeElement) || slides.length < 2) return;
  timer = setInterval(() => showSlide(current + 1), 6500);
}
if (slides.length) {
  pauseSlideshow?.setAttribute("aria-pressed", String(slideshowPaused));
  pauseSlideshow?.addEventListener("click", () => {
    slideshowPaused = !slideshowPaused;
    pauseSlideshow.setAttribute("aria-pressed", String(slideshowPaused));
    startAutoplay();
  });
  hero?.addEventListener("mouseenter", () => { slideshowHovered = true; clearInterval(timer); });
  hero?.addEventListener("mouseleave", () => { slideshowHovered = false; startAutoplay(); });
  hero?.addEventListener("focusin", () => clearInterval(timer));
  hero?.addEventListener("focusout", () => setTimeout(startAutoplay, 0));
  dots.forEach((d) => d.addEventListener("click", () => { showSlide(Number(d.dataset.dot)); startAutoplay(); }));
  document.addEventListener("visibilitychange", () => { if (document.hidden) clearInterval(timer); else startAutoplay(); });
  showSlide(0);
  startAutoplay();
}

/* ---------- Stats count-up ---------- */
const counters = document.querySelectorAll("[data-count]");
function countUp(el) {
  const target = Number(el.dataset.count);
  const suffix = el.dataset.suffix || "";
  if (reduceMotion) { el.textContent = `${target}${suffix}`; return; }
  const start = performance.now();
  const duration = 1600;
  const tick = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${p === 1 ? suffix : ""}`;
    if (p < 1) requestAnimationFrame(tick);
  };
  el.textContent = "0";
  requestAnimationFrame(tick);
}
if ("IntersectionObserver" in window) {
  const statsIO = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll("[data-count]").forEach(countUp);
      statsIO.unobserve(entry.target);
    });
  }, { threshold: 0.4 });
  document.querySelectorAll("[data-stats]").forEach((s) => statsIO.observe(s));
}

/* ---------- Event enquiry form → WhatsApp ---------- */
const form = document.querySelector("[data-enquiry]");
form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const errorEl = form.querySelector("[data-form-error]");
  const required = ["name", "date", "guests"];
  let ok = true;
  required.forEach((name) => {
    const input = form.elements[name];
    const bad = !input.value.trim();
    input.closest(".field")?.classList.toggle("is-invalid", bad);
    if (bad) ok = false;
  });
  if (errorEl) errorEl.hidden = ok;
  if (!ok) { form.querySelector(".is-invalid input")?.focus(); return; }

  const f = t("waFields");
  const val = (name) => {
    const el = form.elements[name];
    if (el.tagName === "SELECT") return el.options[el.selectedIndex].text;
    return el.value.trim();
  };
  const lines = [t("waEvent")];
  ["name", "phone", "email", "date", "guests", "type", "service"].forEach((k) => {
    const v = val(k);
    if (v) lines.push(`${f[k]}: ${v}`);
  });
  const msg = val("message");
  if (msg) lines.push(`${f.message}: ${msg}`);

  const url = waUrl(lines.join("\n"));
  if (url) window.open(url, "_blank", "noopener");
  else toast(t("pending").replace("{label}", t("labels").whatsapp));
});
form?.addEventListener("input", (e) => {
  const field = e.target.closest(".field");
  if (field?.classList.contains("is-invalid") && e.target.value.trim()) field.classList.remove("is-invalid");
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add("is-in"));
}

/* ---------- Footer year ---------- */
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = new Date().getFullYear();
