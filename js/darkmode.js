(function () {
  var KEY = 'mendelsim-theme';
  var html = document.documentElement;
  var mq = window.matchMedia('(prefers-color-scheme: dark)');

  function effectiveTheme() {
    var saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return mq.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    var btn = document.getElementById('darkToggle');
    if (btn) {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';
    }
  }

  function toggle() {
    var next = effectiveTheme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(KEY, next);
    applyTheme(next);
  }

  // Apply immediately to avoid flash
  applyTheme(effectiveTheme());

  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(effectiveTheme());
    var btn = document.getElementById('darkToggle');
    if (btn) btn.addEventListener('click', toggle);
  });

  // Follow system changes when no manual preference is saved
  mq.addEventListener('change', function (e) {
    if (!localStorage.getItem(KEY)) applyTheme(e.matches ? 'dark' : 'light');
  });
})();
