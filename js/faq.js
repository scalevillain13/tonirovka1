'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const faqList = document.getElementById('faqList');
  if (!faqList) return;

  const items = faqList.querySelectorAll('.faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-item__trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all others (accordion behaviour)
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-item__trigger')?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      item.classList.toggle('open', !isOpen);
      trigger.setAttribute('aria-expanded', String(!isOpen));
    });
  });

});
