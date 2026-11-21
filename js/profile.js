document.addEventListener('DOMContentLoaded', async () => {
  if (!auth.isLoggedIn) { goToLogin(); return; }
  document.getElementById('logout').addEventListener('click', async () => {
    try { await api.logout(); } catch {}
    auth.clear();
    location.href = 'login.html';
  });

  function draw(user) {
    if (!user) return;
    document.getElementById('p-name').textContent = (user.name + ' ' + user.surname).trim();
    document.getElementById('p-phone').textContent = '+' + String(user.phone || '').replace(/^\+/, '');
    document.getElementById('p-email').textContent = user.email || '';
  }

  if (auth.user) draw(auth.user);

  try {
    const { user } = await api.me();
    auth.setUser(user);
    syncAccountLabels();
    draw(user);
  } catch {
    if (!auth.user) goToLogin();
  }
});
