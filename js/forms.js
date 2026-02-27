'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // ── Phone mask ─────────────────────────────────────────────────────────────
  const PHONE_INPUTS = document.querySelectorAll('input[type="tel"]');

  function applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');

      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (val.startsWith('7')) val = val.slice(1);

      let masked = '+7 ';
      if (val.length > 0) masked += '(' + val.substring(0, 3);
      if (val.length >= 3) masked += ') ' + val.substring(3, 6);
      if (val.length >= 6) masked += '-' + val.substring(6, 8);
      if (val.length >= 8) masked += '-' + val.substring(8, 10);

      e.target.value = masked;
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && input.value.length <= 4) {
        input.value = '';
      }
    });

    input.addEventListener('focus', () => {
      if (!input.value) input.value = '+7 ';
    });

    input.addEventListener('blur', () => {
      if (input.value === '+7 ') input.value = '';
    });
  }

  PHONE_INPUTS.forEach(applyPhoneMask);

  // ── Generic form validation helper ────────────────────────────────────────
  function validateField(input) {
    const group = input.closest('.form-group');
    if (!group) return true;

    let valid = true;
    const val = input.value.trim();

    if (input.required || input.dataset.required) {
      valid = val.length > 0;
    }

    if (input.type === 'tel' && val.length > 0) {
      valid = val.replace(/\D/g, '').length >= 11;
    }

    group.classList.toggle('has-error', !valid);
    return valid;
  }

  // ── Attach blur validation to all form inputs ──────────────────────────────
  document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.form-group')?.classList.contains('has-error')) {
        validateField(input);
      }
    });
  });

  // ── Photo calc phone ───────────────────────────────────────────────────────
  const photoPhone = document.getElementById('photoPhone');
  if (photoPhone) applyPhoneMask(photoPhone);

  // ── File upload label update ───────────────────────────────────────────────
  const photoFileInput = document.getElementById('photoFile');
  if (photoFileInput) {
    photoFileInput.addEventListener('change', () => {
      const file = photoFileInput.files?.[0];
      const label = photoFileInput.closest('.file-upload')?.querySelector('.file-upload__label');
      if (file && label) {
        label.textContent = file.name;
      }
    });
  }

  // ── Generic submit buttons (non-calculator) ────────────────────────────────
  document.querySelectorAll('button[type="button"].btn--primary').forEach(btn => {
    if (btn.id === 'calcNext') return; // handled by calculator.js

    btn.addEventListener('click', () => {
      const form = btn.closest('[class*="form"], section');
      if (!form) return;

      const inputs = form.querySelectorAll('input[type="text"], input[type="tel"]');
      let allValid = true;
      inputs.forEach(inp => {
        if (!validateField(inp)) allValid = false;
      });

      const consent = form.querySelector('input[type="checkbox"]');
      if (consent && !consent.checked) {
        consent.closest('.form-checkbox-row')?.style.setProperty('color', '#ef4444');
        allValid = false;
        setTimeout(() => {
          consent.closest('.form-checkbox-row')?.style.removeProperty('color');
        }, 2000);
      }

      if (!allValid) return;

      // Simulate successful submission
      const originalText = btn.textContent;
      btn.textContent = 'Отправляем...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ Отправлено!';
        btn.style.background = 'var(--color-success)';
        btn.style.borderColor = 'var(--color-success)';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          btn.style.borderColor = '';
        }, 3000);
      }, 900);
    });
  });

  // ── "Вызвать замерщика" button ────────────────────────────────────────────
  document.querySelectorAll('.specialist__card .btn--primary').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = document.getElementById('contacts');
      if (target) {
        const headerH = document.getElementById('header')?.offsetHeight ?? 72;
        window.scrollTo({ top: target.offsetTop - headerH - 16, behavior: 'smooth' });
      }
    });
  });

});
