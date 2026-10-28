"use strict";
const portfolio = window.PORTFOLIO_DATA || { contacts: {}, projects: {} };
function webLink(value) {
  if (typeof value !== "string" || !/^https:\/\/[^\s]+$/i.test(value)) return "";
  try {
    const url = new URL(value);
    return url.hostname.includes(".") ? url.href : "";
  } catch {
    return "";
  }
}
let contactCount = 0;
document.querySelectorAll("[data-contact]").forEach(link => {
  const kind = link.dataset.contact;
  const value = String(portfolio.contacts?.[kind] || "").trim();
  const href = kind === "email"
    ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "mailto:" + value : "")
    : webLink(value);
  link.hidden = !href;
  if (!href) return;
  link.href = href;
  const label = kind === "email" ? value : new URL(href).pathname.split("/").filter(Boolean).join("/");
  link.querySelector(".contact-value").textContent = kind === "telegram" ? "@" + label : label;
  contactCount += 1;
});
if (!contactCount) document.querySelector("#contact-note").textContent = "Контакты появятся здесь чуть позже.";
document.querySelectorAll("[data-project-link]").forEach(link => {
  const href = webLink(portfolio.projects?.[link.dataset.projectLink] || "");
  link.hidden = !href;
  if (href) link.href = href;
});
document.querySelector("#year").textContent = String(new Date().getFullYear());

// Подсветка текущего раздела в закреплённом меню.
const navLinks = [...document.querySelectorAll('.nav a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href')));
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(() => {
    const visible = sections.filter(section => section && section.getBoundingClientRect().top <= innerHeight * 0.35);
    const current = visible[visible.length - 1];
    navLinks.forEach(link => {
      if (current && link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-15% 0px -50% 0px', threshold: 0 });
  sections.filter(Boolean).forEach(section => sectionObserver.observe(section));
}
