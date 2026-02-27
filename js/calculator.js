'use strict';

document.addEventListener('DOMContentLoaded', () => {

  const TOTAL_STEPS = 4;
  let currentStep  = 1;

  const fillBar   = document.getElementById('calcFill');
  const backBtn   = document.getElementById('calcBack');
  const nextBtn   = document.getElementById('calcNext');
  const stepLabels = document.querySelectorAll('.calc-step-label');
  const hintTitle  = document.getElementById('calcHintTitle');
  const hintText   = document.getElementById('calcHintText');

  const HINT_CONTENT = {
    1: { title: 'Для расчёта нужно выбрать параметры', text: 'Выберите цель тонировки, объект и тип полотна. На последнем шаге укажите контакты.' },
    2: { title: 'Выберите объект', text: 'Укажите, где планируете оклеивать: в жилом помещении, офисе или на фасаде.' },
    3: { title: 'Выберите тип полотна', text: 'Атермальная — для солнцезащиты, зеркальная — приватность, матовая — декор, броеплёнка — защита.' },
    4: { title: 'Для расчёта необходимо указать свои данные', text: 'Заполните форму, и мы свяжемся с вами в течение 30 минут с ориентировочной стоимостью.' }
  };

  // ── Helpers ────────────────────────────────────────────────────────────────
  function getStepEl(n) {
    return document.getElementById(`calcStep${n}`);
  }

  function setProgress(step) {
    const pct = Math.round((step / TOTAL_STEPS) * 100);
    if (fillBar) fillBar.style.width = `${pct}%`;

    stepLabels.forEach(label => {
      const n = parseInt(label.dataset.step, 10);
      label.classList.remove('active', 'done');
      if (n === step)  label.classList.add('active');
      if (n < step)    label.classList.add('done');
    });

    if (hintTitle && hintText && HINT_CONTENT[step]) {
      hintTitle.textContent = HINT_CONTENT[step].title;
      hintText.textContent = HINT_CONTENT[step].text;
    }
  }

  function showStep(n) {
    for (let i = 1; i <= TOTAL_STEPS; i++) {
      const el = getStepEl(i);
      if (el) el.classList.toggle('active', i === n);
    }
    currentStep = n;
    setProgress(n);

    if (backBtn) backBtn.style.visibility = n === 1 ? 'hidden' : 'visible';
    if (nextBtn) {
      nextBtn.textContent = n === TOTAL_STEPS ? 'Отправить заявку' : 'Далее';
    }

    const panel = document.querySelector('.calculator__panel');
    if (panel) {
      const rect = panel.getBoundingClientRect();
      if (rect.top < 80) {
        const headerH = document.getElementById('header')?.offsetHeight ?? 72;
        window.scrollTo({ top: window.scrollY + rect.top - headerH - 16, behavior: 'smooth' });
      }
    }
  }

  // ── Validate current step ──────────────────────────────────────────────────
  function validateStep(n) {
    if (n === 1) return !!document.querySelector('input[name="purpose"]:checked');
    if (n === 2) return !!document.querySelector('input[name="object"]:checked');
    if (n === 3) return !!document.querySelector('input[name="film"]:checked');
    if (n === 4) {
      const surname = document.getElementById('calcSurname')?.value.trim();
      const phone   = document.getElementById('calcPhone')?.value.trim();
      const consent = document.getElementById('calcConsent')?.checked;
      return !!(surname && phone.length >= 10 && consent);
    }
    return true;
  }

  // ── Auto-advance on radio select (steps 1, 2, 3) ────────────────────────────
  document.querySelectorAll('input[name="purpose"], input[name="object"], input[name="film"]')
    .forEach(radio => {
      radio.addEventListener('change', () => {
        setTimeout(() => {
          if (validateStep(currentStep)) {
            showStep(currentStep + 1);
          }
        }, 280);
      });
    });

  // ── Next button ────────────────────────────────────────────────────────────
  nextBtn?.addEventListener('click', () => {
    if (!validateStep(currentStep)) {
      shakePanel();
      showValidationHint(currentStep);
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      showStep(currentStep + 1);
    } else {
      submitCalc();
    }
  });

  // ── Back button ────────────────────────────────────────────────────────────
  backBtn?.addEventListener('click', () => {
    if (currentStep > 1) showStep(currentStep - 1);
  });

  // ── Submit ─────────────────────────────────────────────────────────────────
  function submitCalc() {
    const data = {
      purpose:  document.querySelector('input[name="purpose"]:checked')?.value,
      object:   document.querySelector('input[name="object"]:checked')?.value,
      film:     document.querySelector('input[name="film"]:checked')?.value,
      surname:  document.getElementById('calcSurname')?.value.trim(),
      phone:    document.getElementById('calcPhone')?.value.trim(),
      comment:  document.getElementById('calcComment')?.value.trim(),
    };
    console.log('Calculator submission:', data);

    const panel = document.querySelector('.calculator__panel');
    if (panel) {
      panel.innerHTML = `
        <div style="padding:3rem 2rem; text-align:center;">
          <div style="font-size:3rem; margin-bottom:1rem;">✅</div>
          <h3 style="font-size:1.5rem; font-weight:800; color:var(--color-text); margin-bottom:0.5rem;">Заявка отправлена!</h3>
          <p style="color:var(--color-text-secondary);">Мы свяжемся с вами в течение 30 минут для уточнения деталей.</p>
        </div>
      `;
    }
  }

  // ── Shake animation on invalid ─────────────────────────────────────────────
  function shakePanel() {
    const panel = document.querySelector('.calculator__panel');
    if (!panel) return;
    panel.style.animation = 'none';
    panel.offsetHeight;
    panel.style.animation = 'shake 0.4s ease';
  }

  // ── Validation hint ────────────────────────────────────────────────────────
  function showValidationHint(step) {
    const stepEl = getStepEl(step);
    if (!stepEl) return;
    let hint = stepEl.querySelector('.calc-hint');
    if (!hint) {
      hint = document.createElement('p');
      hint.className = 'calc-hint';
      hint.style.cssText = 'color:#ef4444; font-size:0.8125rem; margin-top:0.5rem; font-weight:600;';
      const navEl = document.querySelector('.calc-nav');
      if (navEl) navEl.before(hint);
    }
    const messages = {
      1: 'Выберите цель тонировки',
      2: 'Выберите объект для тонировки',
      3: 'Выберите тип полотна',
      4: 'Заполните фамилию, телефон и дайте согласие',
    };
    hint.textContent = messages[step] || 'Заполните поле';
    setTimeout(() => hint?.remove(), 3000);
  }

  // ── Shake keyframes ─────────────────────────────────────────────────────────
  if (!document.getElementById('calcShakeStyle')) {
    const style = document.createElement('style');
    style.id = 'calcShakeStyle';
    style.textContent = `
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        20%       { transform: translateX(-6px); }
        40%       { transform: translateX(6px); }
        60%       { transform: translateX(-4px); }
        80%       { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }

  showStep(1);

});
