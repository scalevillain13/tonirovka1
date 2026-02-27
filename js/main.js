'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Scroll: add .scrolled class to header ──────────────────────────────────
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile burger menu ─────────────────────────────────────────────────────
  const burger    = document.getElementById('burger');
  const mobileNav = document.getElementById('mobileNav');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      burger.classList.toggle('active', isOpen);
      burger.setAttribute('aria-expanded', String(isOpen));
      mobileNav.setAttribute('aria-hidden', String(!isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on mobile nav link click
    mobileNav.querySelectorAll('.mobile-nav__link, .btn').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        mobileNav.classList.contains('open') &&
        !mobileNav.contains(e.target) &&
        !burger.contains(e.target)
      ) {
        mobileNav.classList.remove('open');
        burger.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  // ── Smooth scroll for ALL anchor links ────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  // ── Active nav link on scroll ─────────────────────────────────────────────
  const sections = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__link, .mobile-nav__link');

  const highlightNav = () => {
    const scrollY = window.scrollY + (header ? header.offsetHeight : 0) + 40;
    let currentId = '';
    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        currentId = section.id;
      }
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.style.color = href === `#${currentId}` ? 'var(--color-primary)' : '';
    });
  };
  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

});
