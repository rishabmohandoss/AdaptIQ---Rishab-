/**
 * AdaptIQ — Training Platform Shell (platform.js)
 * Owns: the sidebar nav + section switching for the "Training Platform" screen.
 * Feature-specific logic (Application Tracker CRUD, etc.) lives in its own
 * module (tracker.js) and reacts to platform:section-changed on the Bus.
 */

window.AdaptIQ_Platform = (() => {
  'use strict';

  const state = { wired: false, activeSection: 'applications' };

  function showSection(name) {
    state.activeSection = name;
    document.querySelectorAll('.platform-section').forEach(el => {
      el.classList.toggle('active', el.id === `section-${name}`);
    });
    document.querySelectorAll('.platform-nav-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.section === name);
    });
    if (name === 'applications') window.AdaptIQ_Tracker?.init();
  }

  function init() {
    wireOnce();
    showSection(state.activeSection);
  }

  function wireOnce() {
    if (state.wired) return;
    state.wired = true;

    document.querySelectorAll('.platform-nav-item').forEach(btn => {
      btn.addEventListener('click', () => showSection(btn.dataset.section));
    });

    document.getElementById('platform-back-btn')?.addEventListener('click', () => {
      window.AdaptIQ_UI.showScreen('profile');
    });
  }

  return { init, showSection };
})();
