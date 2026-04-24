// App.jsx — routing + Tweaks panel
const { useState, useEffect } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "colorTemp": "amber",
  "theme": "system",
  "pyramidStyle": "triangle",
  "startPage": "home"
}/*EDITMODE-END*/;

function TweaksPanel({ visible, tweaks, setTweaks }) {
  if (!visible) return null;
  const row = (label, children) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 11, color: 'rgba(200,150,90,0.7)', letterSpacing: '0.15em', marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
  const opt = (key, val, label) => {
    const active = tweaks[key] === val;
    return (
      <button key={val} onClick={() => { const next = { ...tweaks, [key]: val }; setTweaks(next); window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*'); }}
        style={{ background: active ? 'rgba(200,150,90,0.18)' : 'transparent', border: `1px solid ${active ? 'rgba(200,150,90,0.5)' : 'rgba(245,239,230,0.12)'}`, color: active ? '#C8965A' : 'rgba(245,239,230,0.45)', fontFamily: "'Noto Serif TC', serif", fontSize: 11, letterSpacing: '0.1em', padding: '6px 14px', cursor: 'pointer', marginRight: 6, marginBottom: 6, transition: 'all 0.25s' }}>
        {label}
      </button>
    );
  };

  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 999, background: '#1E1510', border: '1px solid rgba(200,150,90,0.25)', padding: '24px 24px 18px', width: 260, boxShadow: '0 8px 40px rgba(0,0,0,0.6)' }}>
      {row('佈景主題 Theme',
        <div>
          {opt('theme', 'dark', '深色')}
          {opt('theme', 'light', '明亮')}
          {opt('theme', 'system', '自動')}
        </div>
      )}
      {row('色溫 Color Temperature',
        <div>
          {opt('colorTemp', 'amber', '琥珀暖調')}
          {opt('colorTemp', 'violet', '紫羅蘭冷調')}
        </div>
      )}
      {row('起始頁面 Start Page',
        <div>
          {opt('startPage', 'home', '首頁')}
          {opt('startPage', 'product', '作品頁')}
        </div>
      )}
      {row('字體強調 Type Emphasis',
        <div>
          {opt('pyramidStyle', 'triangle', '中文優先')}
          {opt('pyramidStyle', 'layers', '英中並重')}
        </div>
      )}
    </div>
  );
}

function App() {
  const saved = (() => { try { return JSON.parse(localStorage.getItem('pp_page') || '"home"'); } catch { return 'home'; } })();
  const [page, setPageRaw] = useState(TWEAK_DEFAULTS.startPage || saved);
  const [cartCount, setCartCount] = useState(0);
  const [tweaksVisible, setTweaksVisible] = useState(false);
  const [portalOpen, setPortalOpen] = useState(false);
  const [reserveOpen, setReserveOpen] = useState(false);

  // Load tweaks from localStorage or defaults
  const [tweaks, setTweaksRaw] = useState(() => {
    try {
      const saved = localStorage.getItem('pp_tweaks');
      return saved ? { ...TWEAK_DEFAULTS, ...JSON.parse(saved) } : TWEAK_DEFAULTS;
    } catch {
      return TWEAK_DEFAULTS;
    }
  });

  const setTweaks = (next) => {
    setTweaksRaw(next);
    localStorage.setItem('pp_tweaks', JSON.stringify(next));
  };

  const setPage = (p) => {
    setPageRaw(p);
    localStorage.setItem('pp_page', JSON.stringify(p));
    window.scrollTo(0, 0);
  };

  // Apply theme & color temperature
  useEffect(() => {
    const root = document.documentElement;
    
    const applyTheme = (theme) => {
      let activeTheme = theme;
      if (theme === 'system') {
        activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      const isLight = activeTheme === 'light';
      root.setAttribute('data-theme', activeTheme);
      
      if (isLight) {
        if (tweaks.colorTemp === 'violet') {
          root.style.setProperty('--gold', '#6B5A94');
          root.style.setProperty('--gold2', 'rgba(138,123,176,0.18)');
          root.style.setProperty('--coral', '#B08BA0');
          root.style.setProperty('--bg', '#F8F6FA');
          root.style.setProperty('--bg2', '#F0EAF5');
          root.style.setProperty('--bg3', '#E4D9EF');
        } else {
          // amber light: defer to CSS [data-theme="light"] (clear JS overrides)
          root.style.removeProperty('--gold');
          root.style.removeProperty('--gold2');
          root.style.removeProperty('--coral');
          root.style.removeProperty('--bg');
          root.style.removeProperty('--bg2');
          root.style.removeProperty('--bg3');
        }
      } else {
        if (tweaks.colorTemp === 'violet') {
          root.style.setProperty('--gold', '#A090C8');
          root.style.setProperty('--gold2', 'rgba(160,144,200,0.25)');
          root.style.setProperty('--coral', '#C0A8D8');
          root.style.setProperty('--bg', '#16141A');
          root.style.setProperty('--bg2', '#1A1820');
          root.style.setProperty('--bg3', '#2E2A3D');
        } else {
          // amber dark: defer to CSS :root (clear JS overrides)
          root.style.removeProperty('--gold');
          root.style.removeProperty('--gold2');
          root.style.removeProperty('--coral');
          root.style.removeProperty('--bg');
          root.style.removeProperty('--bg2');
          root.style.removeProperty('--bg3');
        }
      }
    };

    applyTheme(tweaks.theme);

    // Listen for system changes if in system mode
    if (tweaks.theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      media.addEventListener('change', handler);
      return () => media.removeEventListener('change', handler);
    }
  }, [tweaks.theme, tweaks.colorTemp]);

  // Create demo course if not exists
  useEffect(() => {
    if (!PP.getCourseByToken('pp-demo0001')) {
      PP.saveCourse({
        id: 'demo0001', name: '示範體驗課', type: '春季體驗課',
        date: new Date().toISOString().slice(0,10), token: 'pp-demo0001',
        hasBase: false, bases: [],
        aiNamePrompt: PP.DEFAULT_SETTINGS.defaultAiNamePrompt,
        aiDescPrompt: PP.DEFAULT_SETTINGS.defaultAiDescPrompt,
        ingredients: [
          { id:'d1', name:'佛手柑', nameEn:'Bergamot',  family:'citrus',   layer:'top'    },
          { id:'d2', name:'茉莉',   nameEn:'Jasmine',   family:'floral',   layer:'middle' },
          { id:'d3', name:'檀香',   nameEn:'Sandalwood',family:'woody',    layer:'base'   },
          { id:'d4', name:'廣藿香', nameEn:'Patchouli', family:'oriental', layer:'base'   },
          { id:'d5', name:'葡萄柚', nameEn:'Grapefruit',family:'citrus',   layer:'top'    },
          { id:'d6', name:'玫瑰',   nameEn:'Rose',      family:'floral',   layer:'middle' },
        ],
        createdAt: new Date().toISOString(),
      });
    }
  }, []);
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksVisible(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksVisible(false);
      if (e.data?.type === 'pp-reserve-close') setReserveOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  // Intercept navigation to reserve.html and open as modal instead
  useEffect(() => {
    const onClick = (e) => {
      const a = e.target.closest('a[href="reserve.html"]');
      if (a) { e.preventDefault(); setReserveOpen(true); }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const openReserve = () => setReserveOpen(true);

  const wrapStyle = {
    minHeight: '100vh',
    background: tweaks.colorTemp === 'violet'
      ? 'radial-gradient(ellipse at 50% 0%, #1E1828 0%, #16141A 60%)'
      : 'var(--bg)',
    transition: 'background 0.6s ease',
  };

  return (
    <div style={wrapStyle}>
      <Header setPage={setPage} cartCount={cartCount} tweaks={tweaks} setTweaks={setTweaks} onPortal={()=>setPortalOpen(true)} onReserve={openReserve} />
      {portalOpen && <PortalModal onClose={()=>setPortalOpen(false)} />}
      {reserveOpen && <ReserveModal onClose={()=>setReserveOpen(false)} />}
      <main style={{ paddingTop: page === 'home' ? 0 : 72 }}>
        {page === 'home'    && <HomePage setPage={setPage} tweaks={tweaks} openReserve={openReserve} />}
        {page === 'product' && <ProductPage setPage={setPage} tweaks={tweaks} openReserve={openReserve} />}
        {page === 'explore' && <ExplorePage setPage={setPage} tweaks={tweaks} openReserve={openReserve} />}
        {page === 'reserve' && (() => { setTimeout(()=>{setReserveOpen(true);setPage('home');},0); return null; })()}
        {page === 'creator' && <HomePage setPage={setPage} tweaks={tweaks} openReserve={openReserve} />}
        {page === 'about'   && <HomePage setPage={setPage} tweaks={tweaks} openReserve={openReserve} />}
      </main>
      <TweaksPanel visible={tweaksVisible} tweaks={tweaks} setTweaks={setTweaks} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
