// Landing CTAs enter the backend-authenticated career workspace.
for (const id of ['nav-signin-btn', 'hero-signin-btn', 'final-signin-btn']) {
  document.getElementById(id)?.addEventListener('click', () => { location.href = '/career.html'; });
}
fetch('/api/me', { credentials: 'same-origin' }).then(r => {
  if (r.ok) location.replace('/career.html');
}).catch(() => {});
