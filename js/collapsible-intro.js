// Collapsible .law-box — state persisted in localStorage per page
(function () {
  const KEY = 'lawbox-collapsed:' + location.pathname;

  function init() {
    const box = document.querySelector('.law-box');
    if (!box) return;

    const title = box.querySelector('.law-title');
    if (!title) return;

    // Build toggle button inside the title
    const btn = document.createElement('button');
    btn.className = 'law-box-toggle';
    btn.setAttribute('aria-label', 'Plegar/desplegar');
    btn.innerHTML = '▲';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'space-between';
    title.style.cursor = 'pointer';
    title.appendChild(btn);

    // Wrap body content in a collapsible div
    const body = document.createElement('div');
    body.className = 'law-box-body';
    while (box.children.length > 1) {
      body.appendChild(box.children[1]);
    }
    box.appendChild(body);

    // Restore saved state (default: expanded)
    const collapsed = localStorage.getItem(KEY) === '1';
    if (collapsed) setCollapsed(true, false);

    title.addEventListener('click', () => {
      const isNowCollapsed = !box.classList.contains('law-box--collapsed');
      setCollapsed(isNowCollapsed, true);
    });

    function setCollapsed(collapse, save) {
      box.classList.toggle('law-box--collapsed', collapse);
      box.style.paddingTop    = collapse ? '0.5rem' : '';
      box.style.paddingBottom = collapse ? '0.5rem' : '';
      btn.innerHTML = collapse ? '▼' : '▲';
      btn.setAttribute('aria-expanded', String(!collapse));
      if (save) localStorage.setItem(KEY, collapse ? '1' : '0');
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
