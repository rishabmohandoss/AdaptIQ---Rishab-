// Landing CTAs enter the interview preparation flow.
for (const id of ['nav-signin-btn', 'hero-signin-btn', 'final-signin-btn']) {
  document.getElementById(id)?.addEventListener('click', () => { location.href = '/interview'; });
}
// Returning visitors stay on home until they explicitly choose to practice.
