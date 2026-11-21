/* =========================================================
   Roots & Fire — site behavior
   ---------------------------------------------------------
   ALL EXTERNAL LINKS LIVE HERE. Replace the pending values
   with the real ones (they are in Lady's PDF menu) and
   every button on the page updates automatically.
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

// Set to true to show a yellow dot on every element whose data is still pending (useful for internal reviews).
const SHOW_PENDING_MARKERS = false;

/* ---------- Links ---------- */
const toastEl = document.querySelector("[data-toast]");
let toastTimer;
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.add("is-on");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove("is-on"), 2800);
}

const LABELS = {
  whatsapp: "WhatsApp number",
  phone: "phone number",
  menuPdf: "PDF menu",
  uberEats: "Uber Eats link",
  doorDash: "DoorDash link",
};

function buildHref(kind, el) {
  const value = SITE[kind];
  if (!value) return "";
  if (kind === "whatsapp") {
    const msg = el.dataset.waMsg ? `?text=${encodeURIComponent(el.dataset.waMsg)}` : "";
    return `https://wa.me/${value.replace(/\D/g, "")}${msg}`;
  }
  if (kind === "phone") return `tel:${value.replace(/[^\d+]/g, "")}`;
  return value;
}

document.querySelectorAll("[data-link]").forEach((el) => {
  const kind = el.dataset.link;
  const href = buildHref(kind, el);
  if (href) {
    el.setAttribute("href", href);
    if (kind === "whatsapp" || kind === "menuPdf") {
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    }
  } else {
    el.setAttribute("href", "#");
    el.removeAttribute("target");
    el.addEventListener("click", (e) => {
      e.preventDefault();
      toast(`Preview: ${LABELS[kind] || "link"} pending confirmation.`);
    });
  }
});

/* ---------- Pending markers ---------- */
if (SHOW_PENDING_MARKERS) document.body.classList.add("show-pending");
const previewToggle = document.querySelector("[data-preview-toggle]");
if (previewToggle) {
  previewToggle.addEventListener("click", () => {
    const on = document.body.classList.toggle("show-pending");
    previewToggle.textContent = on ? "Hide markers" : "Show markers";
  });
}

/* ---------- Header + mobile nav ---------- */
const header = document.querySelector("[data-header]");
const nav = document.getElementById("main-nav");
const navToggle = document.querySelector("[data-nav-toggle]");
const orderBar = document.querySelector(".order-bar");
const hero = document.querySelector(".hero");

function onScroll() {
  const y = window.scrollY;
  header?.classList.toggle("is-scrolled", y > 8);
  if (orderBar && hero) {
    const heroBottom = hero.offsetTop + hero.offsetHeight - 120;
    orderBar.classList.toggle("is-visible", y > heroBottom);
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

function closeNav() {
  nav?.classList.remove("is-open");
  navToggle?.setAttribute("aria-expanded", "false");
}
navToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeNav));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

/* ---------- Menu filters ---------- */
const chips = document.querySelectorAll("[data-filter]");
const dishes = document.querySelectorAll(".menu-grid .dish");
chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => {
      const active = c === chip;
      c.classList.toggle("is-active", active);
      c.setAttribute("aria-selected", String(active));
    });
    dishes.forEach((d) => {
      const cat = d.dataset.cat;
      d.hidden = !(f === "all" || cat === f || cat === "all");
    });
  });
});

/* ---------- Reveal on scroll ---------- */
const revealTargets = document.querySelectorAll(".section-head, .dish, .service, .story__media, .story__copy, .plan, .visit__info, .visit__map");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  revealTargets.forEach((el) => el.classList.add("reveal"));
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
  revealTargets.forEach((el) => io.observe(el));
}

/* ---------- Footer year ---------- */
const yearEl = document.querySelector("[data-year]");
if (yearEl) yearEl.textContent = new Date().getFullYear();
