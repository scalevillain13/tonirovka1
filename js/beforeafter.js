'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const container = document.getElementById('beforeAfter');
  if (!container) return;

  const beforeEl = container.querySelector('.beforeafter__before');
  const handle   = container.querySelector('.beforeafter__handle');
  if (!beforeEl || !handle) return;

  let isDragging = false;
  let position   = 50; // percent

  function setPosition(pct) {
    position = Math.min(100, Math.max(0, pct));
    beforeEl.style.clipPath = `inset(0 ${100 - position}% 0 0)`;
    handle.style.left = `${position}%`;
  }

  function getPercent(clientX) {
    const rect = container.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  }

  // Mouse events
  handle.addEventListener('mousedown', (e) => {
    isDragging = true;
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(getPercent(e.clientX));
  });

  document.addEventListener('mouseup', () => { isDragging = false; });

  // Touch events
  handle.addEventListener('touchstart', (e) => {
    isDragging = true;
    e.preventDefault();
  }, { passive: false });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setPosition(getPercent(touch.clientX));
  }, { passive: true });

  document.addEventListener('touchend', () => { isDragging = false; });

  // Also allow clicking anywhere on the container to jump position
  container.addEventListener('click', (e) => {
    if (!isDragging) setPosition(getPercent(e.clientX));
  });

  // Init at 50%
  setPosition(50);

});
