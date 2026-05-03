/* main.js */

/**
 * Navigation + UI interactions + contact form (Web3Forms)
 */

const pageLinks = document.querySelectorAll("[data-page-link]");
const pages = document.querySelectorAll("[data-page]");
const navLinks = document.querySelectorAll(".nav-link");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const year = document.querySelector("#year");

/**
 * Get page from URL hash
 */
function getPageFromHash() {
  const hash = window.location.hash.replace("#", "");
  const allowedPages = ["home", "about", "services", "contact"];
  return allowedPages.includes(hash) ? hash : "home";
}

/**
 * Show active page
 */
function showPage(pageId) {
  pages.forEach((page) => {
    page.classList.toggle("active", page.dataset.page === pageId);
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === pageId);
  });

  closeMobileMenu();

  document.querySelectorAll(".reveal").forEach((el) => {
    el.classList.remove("visible");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });

  observeRevealElements();
}

/**
 * Mobile menu toggle
 */
function toggleMobileMenu() {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.classList.toggle("open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation menu" : "Open navigation menu"
  );
}

/**
 * Close mobile menu
 */
function closeMobileMenu() {
  navMenu.classList.remove("open");
  navToggle.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation menu");
}

/**
 * Reveal animations
 */
function observeRevealElements() {
  const revealElements = document.querySelectorAll(".page.active .reveal");

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((el) => observer.observe(el));
}

/**
 * INIT
 */
function initSite() {
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Navigation clicks
  pageLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const targetPage = link.dataset.pageLink;
      window.history.pushState({}, "", `#${targetPage}`);
      showPage(targetPage);
    });
  });

  // Mobile menu
  navToggle.addEventListener("click", toggleMobileMenu);

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      closeMobileMenu();
    }
  });

  window.addEventListener("popstate", () => {
    showPage(getPageFromHash());
  });

  /**
   * Web3Forms submit handler (ONLY ONE — correct version)
   */
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    formNote.textContent = "Sending message...";

    const formData = new FormData(contactForm);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        formNote.textContent =
          "✅ Message sent! We will connect soon!";
        contactForm.reset();
      } else {
        formNote.textContent =
          "❌ Something went wrong. Please try again.";
      }
    } catch (err) {
      formNote.textContent =
        "❌ Network error. Please try again.";
    }
  });

  // Initial page load
  showPage(getPageFromHash());
}

document.addEventListener("DOMContentLoaded", initSite);