// Landing CTAs enter the interview preparation flow.
for (const id of ['nav-signin-btn', 'hero-signin-btn', 'final-signin-btn']) {
  document.getElementById(id)?.addEventListener('click', () => { location.href = '/interview'; });
}
fetch('/api/me', { credentials: 'same-origin' }).then(r => {
  if (r.ok) location.replace('/interview');
}).catch(() => {});
