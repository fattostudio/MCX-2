(function () {
  const STORAGE_KEY = 'showModalities';
  const LABELS = { focus: 'Focus Mode', breeze: 'Breeze', user: 'User-Directed' };
  const COLORS = { focus: '#7c3aed', breeze: '#14b8a6', user: '#6b7280' };

  // Inject styles
  const css = `
    #modality-toggle-root{
      position:fixed; bottom:16px; right:16px; z-index:9999;
      font-family:'HubSpot Sans', system-ui, sans-serif;
      display:flex; flex-direction:column; gap:8px;
      align-items:flex-end; pointer-events:none;
    }
    #modality-toggle-legend{
      display:none; background:#1f1f1f; color:#fff;
      padding:8px 10px; border-radius:8px; font-size:11px;
      line-height:1.5; box-shadow:0 4px 14px rgba(0,0,0,.18);
      pointer-events:auto;
    }
    #modality-toggle-legend .swatch{
      display:inline-block; width:8px; height:8px; border-radius:2px;
      margin-right:6px; vertical-align:middle;
    }
    #modality-toggle-legend .row{ display:flex; align-items:center; gap:0; }
    #modality-toggle-legend .row + .row{ margin-top:3px; }
    #modality-toggle-btn{
      pointer-events:auto; cursor:pointer; border:none;
      background:#141414; color:#fff; font-size:12px; font-weight:500;
      padding:8px 14px 8px 10px; border-radius:999px; display:flex;
      align-items:center; gap:8px; box-shadow:0 3px 10px rgba(0,0,0,.15);
      font-family:inherit;
    }
    #modality-toggle-btn .dot{
      width:8px; height:8px; border-radius:50%; background:#505050;
      transition:background .15s ease;
    }
    body.show-modalities #modality-toggle-btn .dot{ background:#14b8a6; }
    body.show-modalities #modality-toggle-legend{ display:block; }

    body.show-modalities [data-modality]{
      position:relative;
      box-shadow:0 0 0 2px var(--modality-color) inset;
      border-radius:inherit;
    }
    body.show-modalities [data-modality="focus"]{  --modality-color:${COLORS.focus}; }
    body.show-modalities [data-modality="breeze"]{ --modality-color:${COLORS.breeze}; }
    body.show-modalities [data-modality="user"]{   --modality-color:${COLORS.user}; }

    body.show-modalities [data-modality]::after{
      position:absolute; top:-9px; right:-4px;
      padding:2px 7px; font-size:9px; font-weight:600;
      letter-spacing:.04em; text-transform:uppercase;
      color:#fff; border-radius:999px; line-height:1.4;
      pointer-events:none; z-index:20; white-space:nowrap;
      font-family:'HubSpot Sans', system-ui, sans-serif;
      box-shadow:0 1px 3px rgba(0,0,0,.2);
    }
    body.show-modalities [data-modality="focus"]::after{  content:"Focus Mode"; background:${COLORS.focus}; }
    body.show-modalities [data-modality="breeze"]::after{ content:"Breeze";     background:${COLORS.breeze}; }
    body.show-modalities [data-modality="user"]::after{   content:"User-Dir.";  background:${COLORS.user}; }
  `;
  const style = document.createElement('style');
  style.id = 'modality-toggle-style';
  style.textContent = css;
  document.head.appendChild(style);

  // Inject UI
  function mount() {
    const root = document.createElement('div');
    root.id = 'modality-toggle-root';
    root.innerHTML = `
      <div id="modality-toggle-legend">
        <div class="row"><span class="swatch" style="background:${COLORS.focus}"></span>Focus Mode</div>
        <div class="row"><span class="swatch" style="background:${COLORS.breeze}"></span>Breeze on Surface</div>
        <div class="row"><span class="swatch" style="background:${COLORS.user}"></span>User-Directed</div>
      </div>
      <button id="modality-toggle-btn" type="button">
        <span class="dot"></span>
        <span>Show modalities</span>
      </button>
    `;
    document.body.appendChild(root);

    const btn = root.querySelector('#modality-toggle-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const on = !document.body.classList.contains('show-modalities');
      setState(on);
    });
  }

  function setState(on) {
    document.body.classList.toggle('show-modalities', on);
    try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0'); } catch(e) {}
    // Propagate state to any same-origin iframes (Focus Mode preview)
    document.querySelectorAll('iframe').forEach(iframe => {
      try {
        const doc = iframe.contentDocument;
        if (doc && doc.body) doc.body.classList.toggle('show-modalities', on);
      } catch(e) {}
    });
  }

  function init() {
    const inIframe = window !== window.parent;
    if (!inIframe) {
      mount();
      let stored = '0';
      try { stored = localStorage.getItem(STORAGE_KEY) || '0'; } catch(e) {}
      setState(stored === '1');
      return;
    }
    try {
      const parentOn = window.parent.document.body.classList.contains('show-modalities');
      document.body.classList.toggle('show-modalities', parentOn);
    } catch(e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
