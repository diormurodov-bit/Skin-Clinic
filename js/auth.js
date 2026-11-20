document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(location.search);
  const next = params.get('next');
  const target = next && !/^https?:|\/\//.test(next) ? next : 'profile.html';
  if (auth.isLoggedIn && auth.user) {
    location.replace('profile.html');
    return;
  }
  const error = document.getElementById('form-error');
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    if (next) document.getElementById('to-register').href = 'register.html?next=' + encodeURIComponent(next);
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.textContent = '';
      const btn = loginForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Please wait…'; }
      try {
        const res = await api.login(loginForm.email.value.trim().toLowerCase(), loginForm.password.value);
        if (!res || !res.token) throw new Error('Invalid response from server');
        auth.set(res.token, res.user);
        location.href = target;
      } catch (err) {
        error.textContent = err.message || 'Authentication failed';
        if (btn) { btn.disabled = false; btn.textContent = 'Log In'; }
      }
    });
  }
  const regForm = document.getElementById('register-form');
  if (regForm) {
    if (next) document.getElementById('to-login').href = 'login.html?next=' + encodeURIComponent(next);
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      error.textContent = '';
      const phone = regForm.phone.value.replace(/\D/g, '');
      if (phone.length < 9 || phone.length > 15) { error.textContent = 'Phone must contain 9 to 15 digits'; return; }
      if (regForm.password.value !== regForm.password2.value) { error.textContent = 'Passwords do not match'; return; }
      const btn = regForm.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = 'Please wait…'; }
      try {
        const res = await api.register({
          name: regForm.name.value.trim(),
          surname: regForm.surname.value.trim(),
          email: regForm.email.value.trim().toLowerCase(),
          phone,
          password: regForm.password.value,
        });
        if (!res || !res.token) throw new Error('Invalid response from server');
        auth.set(res.token, res.user);
        location.href = target;
      } catch (err) {
        error.textContent = err.message || 'Authentication failed';
        if (btn) { btn.disabled = false; btn.textContent = 'Register'; }
      }
    });
  }
});
