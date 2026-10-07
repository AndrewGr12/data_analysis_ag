/** Navigation + UI interactions + contact form (Web3Forms). */
const pageLinks = document.querySelectorAll("[data-page-link]");
const pages = document.querySelectorAll("[data-page]");
const navLinks = document.querySelectorAll(".nav-link");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const year = document.querySelector("#year");

function getPageFromHash() {
  const hash = window.location.hash.slice(1);
  return ["home", "about", "services", "contact"].includes(hash) ? hash : "home";
}
function showPage(pageId) {
  pages.forEach((page) => page.classList.toggle("active", page.dataset.page === pageId));
  navLinks.forEach((link) => link.classList.toggle("active", link.dataset.pageLink === pageId));
  closeMobileMenu();
  document.querySelectorAll(".reveal").forEach((el) => el.classList.remove("visible"));
  window.scrollTo({ top: 0, behavior: "smooth" });
  observeRevealElements();
}
function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
}
function closeMobileMenu() {
  if (!navMenu || !navToggle) return;
  navMenu.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}
function observeRevealElements() {
  const revealElements = document.querySelectorAll(".page.active .reveal:not(.visible)");
  if (!("IntersectionObserver" in window)) {
    revealElements.forEach((el) => el.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
  revealElements.forEach((el) => observer.observe(el));
}
function initSite() {
  if (year) year.textContent = new Date().getFullYear();
  pageLinks.forEach((link) => link.addEventListener("click", (event) => {
    event.preventDefault();
    const targetPage = link.dataset.pageLink;
    if (!targetPage) return;
    window.history.pushState({}, "", `#${targetPage}`);
    showPage(targetPage);
  }));
  if (navToggle && navMenu) navToggle.addEventListener("click", toggleMobileMenu);
  window.addEventListener("resize", () => { if (window.innerWidth >= 768) closeMobileMenu(); });
  window.addEventListener("popstate", () => showPage(getPageFromHash()));
  if (contactForm && formNote) contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    if (submitButton) submitButton.disabled = true;
    formNote.textContent = "Sending your message…";
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: new FormData(contactForm),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error("Message submission failed");
      formNote.textContent = "Message sent. Thank you — I’ll be in touch soon.";
      contactForm.reset();
    } catch {
      formNote.textContent = "Your message could not be sent. Please try again or email me directly.";
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
  showPage(getPageFromHash());
}
document.addEventListener("DOMContentLoaded", initSite);
