// components.jsx — shared primitives + Header
const { useState, useEffect } = React;

function useIsLight() {
  const [isLight, setIsLight] = useState(() => document.documentElement.getAttribute('data-theme') === 'light');
  useEffect(() => {
    const root = document.documentElement;
    const update = () => setIsLight(root.getAttribute('data-theme') === 'light');
    update();
    const obs = new MutationObserver(update);
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);
  return isLight;
}

function ImagePlaceholder({ label, sublabel, style, gradient }) {
  const bg = gradient || 'radial-gradient(ellipse at 35% 40%, #4A2E14 0%, #2C1A08 45%, #1A1210 100%)';
  return (
    <div style={{ background: bg, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
      <div style={{ position: 'absolute', width: '55%', height: '55%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,150,90,0.07) 0%, transparent 70%)', top: '20%', left: '22%', pointerEvents: 'none' }} />
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(200,150,90,0.3)', textAlign: 'center', letterSpacing: '0.15em', lineHeight: 2.2, zIndex: 1, padding: 16 }}>
        {label && <div>// {label} //</div>}
        {sublabel && <div style={{ opacity: 0.55, fontSize: 9 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

function SectionTitle({ zh, en, center }) {
  return (
    <div style={{ textAlign: center ? 'center' : 'left', marginBottom: 48 }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.3em', color: 'var(--gold)', opacity: 0.85, textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 10 }}>{en}</div>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '0.12em', lineHeight: 1.3 }}>{zh}</h2>
      <div style={{ width: 32, height: 1, background: 'var(--gold)', opacity: 0.45, marginTop: 16, ...(center ? { margin: '16px auto 0' } : {}) }} />
    </div>
  );
}

function GoldDivider({ style }) {
  return <div style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, rgba(200,150,90,0.3), transparent)', margin: '0 auto', ...style }} />;
}

function Tag({ children, variant = 'default' }) {
  const variants = {
    default: { background: 'rgba(var(--text-rgb),0.06)', color: 'var(--text-sub)', border: '1px solid rgba(var(--text-rgb),0.12)' },
    gold:    { background: 'rgba(var(--gold-rgb),0.12)', color: 'var(--gold)', border: '1px solid rgba(var(--gold-rgb),0.3)' },
    coral:   { background: 'rgba(var(--gold-rgb),0.08)', color: 'var(--coral)', border: '1px solid var(--coral)' },
  };
  return (
    <span style={{ ...variants[variant], fontSize: 11, letterSpacing: '0.1em', padding: '3px 10px', fontFamily: "'Noto Serif TC', serif", fontWeight: 300, display: 'inline-block' }}>
      {children}
    </span>
  );
}

function CTAButton({ children, onClick, gold, style }) {
  const [hov, setHov] = useState(false);
  const base = {
    fontFamily: "'Noto Serif TC', serif", fontWeight: 300, fontSize: 13, letterSpacing: '0.2em',
    background: 'transparent', border: `1px solid ${gold ? (hov ? 'var(--gold)' : 'var(--gold2)') : (hov ? 'var(--text-sub)' : 'var(--gold2)')}`,
    color: gold ? (hov ? 'var(--gold)' : 'var(--text-main)') : (hov ? 'var(--text-main)' : 'var(--text-sub)'),
    padding: '13px 36px', transition: 'all 0.3s ease', cursor: 'pointer', ...style,
  };
  return <button style={base} onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} onClick={onClick}>{children}</button>;
}

// ── Admin Tab (inline login) ──────────────────────────────────────────────
function AdminTabLogin({ onClose }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const settings = PP.getSettings();

  useEffect(() => {
    if (settings.googleClientId && window.google) {
      window.google.accounts.id.initialize({
        client_id: settings.googleClientId,
        callback: handleGoogleLogin
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleBtnSide"),
        { theme: "outline", size: "large", width: 334, text: "signin_with" }
      );
    }
  }, [settings.googleClientId]);

  const handleGoogleLogin = (response) => {
    const user = PP.parseJwt(response.credential);
    if (user && PP.isAuthorizedAdmin(user.email)) {
      sessionStorage.setItem('pp_admin_auth', '1');
      window.location.href = 'admin.html';
    } else {
      setErr('此 Google 帳號未獲得授權');
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const h = await PP.hash(pw);
    if (h === settings.adminPassword) {
      sessionStorage.setItem('pp_admin_auth', '1');
      window.location.href = 'admin.html';
    } else {
      setErr('密碼錯誤');
    }
  };

  return (
    <div>
      <p style={{ fontFamily:"'Noto Serif TC',serif", fontSize:13, color:'var(--text-mute)', lineHeight:2, letterSpacing:'.04em', marginBottom:20 }}>
        請登入管理員帳號，進入課程管理後台。
      </p>

      {settings.googleClientId && (
        <div style={{marginBottom:24}}>
          <div id="googleBtnSide"></div>
          <div style={{display:'flex', alignItems:'center', gap:10, margin:'20px 0'}}>
            <div style={{flex:1, height:1, background:'rgba(200,150,90,0.1)'}}></div>
            <div style={{fontSize:11, color:'rgba(200,150,90,0.3)', letterSpacing:'.1em'}}>或使用密碼</div>
            <div style={{flex:1, height:1, background:'rgba(200,150,90,0.1)'}}></div>
          </div>
        </div>
      )}

      <form onSubmit={submit}>
        <input
          type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr('');}}
          placeholder="管理員密碼" autoFocus
          style={{ width:'100%', background:'rgba(var(--gold-rgb),0.06)', border:`1px solid ${err?'rgba(200,80,60,0.5)':'rgba(var(--gold-rgb),0.25)'}`, color:'var(--text-main)', fontFamily:"'Noto Serif TC',serif", fontSize:13, padding:'11px 14px', outline:'none', marginBottom: err?8:20, transition:'.25s' }}
        />
        {err && <div style={{ color:'var(--danger, #C86050)', fontSize:12, marginBottom:16 }}>{err}</div>}
        <button type="submit" style={{ width:'100%', fontFamily:"'Noto Serif TC',serif", fontSize:14, letterSpacing:'.15em', padding:'12px', background:'transparent', border:'1px solid rgba(var(--text-rgb),0.2)', color:'var(--nav-link)', transition:'.3s' }}>
          進入後台 →
        </button>
      </form>
    </div>
  );
}

// ── Reserve Modal ─────────────────────────────────────────────────────────
function ReserveModal({ onClose }) {
  const isLight = useIsLight();
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
  }, [onClose]);

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:600, background: isLight ? 'rgba(245,240,232,0.82)' : 'rgba(10,6,4,0.88)', backdropFilter:'blur(10px)', display:'flex', alignItems:'center', justifyContent:'center', padding:'clamp(12px,3vw,32px)', animation:'fadeUp .25s ease' }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%', maxWidth:640, maxHeight:'92vh', background: isLight ? 'var(--card-bg)' : 'radial-gradient(ellipse at 50% 0%, #2A1810 0%, #1A1210 70%)', border:'1px solid rgba(200,150,90,0.2)', position:'relative', overflow:'hidden', boxShadow: isLight ? '0 20px 60px rgba(0,0,0,0.08)' : '0 40px 120px rgba(0,0,0,0.6)' }}>
        <iframe src="reserve.html?modal=1" title="預約體驗" style={{ width:'100%', height:'min(92vh, 820px)', border:'none', display:'block', background:'transparent' }} />
      </div>
    </div>
  );
}

// ── Portal Modal ──────────────────────────────────────────────────────────
function PortalModal({ onClose }) {
  const isLight = useIsLight();
  const [tab, setTab] = useState('student');
  const [token, setToken] = useState('');
  const [err, setErr] = useState('');

  const handleStudent = () => {
    setErr('');
    let t = token.trim();
    // Accept full URL or bare token
    const m = t.match(/[?&]token=(pp-[a-z0-9]+)/i);
    if (m) t = m[1];
    if (!t.startsWith('pp-') || t.length < 8) { setErr('請貼入完整的課程連結或 Token'); return; }
    const course = PP.getCourseByToken(t);
    if (!course) { setErr('找不到對應課程，請確認連結是否正確'); return; }
    window.location.href = `formula.html?token=${t}`;
  };

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:500, background: isLight ? 'rgba(245,240,232,0.82)' : 'rgba(20,14,8,0.85)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%', maxWidth:400, background: isLight ? 'var(--card-bg)' : '#1E1812', border:'1px solid rgba(var(--gold-rgb),0.25)', padding:'36px 32px', animation:'fadeUp .3s ease', position:'relative', boxShadow: isLight ? '0 16px 48px rgba(0,0,0,0.08)' : '0 8px 40px rgba(0,0,0,0.6)' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:16, right:18, background:'none', border:'none', color:'var(--text-mute)', fontSize:18, lineHeight:1 }}>✕</button>

        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, fontStyle:'italic', letterSpacing:'.3em', color:'rgba(200,150,90,0.6)', marginBottom:4 }}>Phinn-Phang</div>
          <div style={{ fontFamily:"'Noto Serif TC',serif", fontSize:16, fontWeight:300, letterSpacing:'.15em', color:'var(--text-main)' }}>課程入口</div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(200,150,90,0.15)', marginBottom:28 }}>
          {[['student','學員配方登錄'],['admin','管理員後台']].map(([key,label])=>(
            <button key={key} onClick={()=>{setTab(key);setErr('');}} style={{ flex:1, background:'none', border:'none', borderBottom:`2px solid ${tab===key?'#C8965A':'transparent'}`, padding:'10px 0', fontFamily:"'Noto Serif TC',serif", fontSize:13, letterSpacing:'.1em', color:tab===key?'#C8965A':'var(--text-sub)', transition:'.25s', marginBottom:-1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Student tab */}
        {tab==='student' && (
          <div>
            <p style={{ fontFamily:"'Noto Serif TC',serif", fontSize:13, color:'var(--text-mute)', lineHeight:2, letterSpacing:'.04em', marginBottom:20 }}>
              請貼入老師傳給你的課程連結，進入今天的配方登錄頁。
            </p>
            <input
              value={token} onChange={e=>{setToken(e.target.value);setErr('');}}
              onKeyDown={e=>e.key==='Enter'&&handleStudent()}
              placeholder="貼入課程連結或 Token"
              autoFocus
              style={{ width:'100%', background:'rgba(200,150,90,0.06)', border:`1px solid ${err?'rgba(200,80,60,0.5)':'rgba(200,150,90,0.25)'}`, color:'var(--text-main)', fontFamily:"'Noto Serif TC',serif", fontSize:13, padding:'11px 14px', outline:'none', marginBottom: err?8:20, transition:'.25s' }}
            />
            {err && <div style={{ color:'var(--danger, #C86050)', fontSize:12, marginBottom:16, letterSpacing:'.04em' }}>{err}</div>}
            <button onClick={handleStudent} style={{ width:'100%', fontFamily:"'Noto Serif TC',serif", fontSize:14, letterSpacing:'.15em', padding:'12px', background:'rgba(var(--gold-rgb),0.12)', border:'1px solid var(--gold)', color:'var(--gold)', transition:'.3s' }}>
              進入配方登錄 →
            </button>
            {/* Demo link */}
            {(() => {
              const demo = PP.getCourseByToken('pp-demo0001');
              if (!demo) return null;
              const url = `formula.html?token=pp-demo0001`;
              return (
                <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(var(--text-rgb),0.03)', border:'1px dashed rgba(var(--gold-rgb),0.2)' }}>
                  <div style={{ fontSize:11, color:'rgba(var(--gold-rgb),0.5)', letterSpacing:'.1em', marginBottom:6 }}>示範課程連結</div>
                  <a href={url} style={{ fontSize:12, color:'rgba(var(--gold-rgb),0.7)', fontFamily:'monospace', wordBreak:'break-all' }}>{url}</a>
                </div>
              );
            })()}
          </div>
        )}

        {/* Admin tab */}
        {tab==='admin' && (
          <AdminTabLogin onClose={onClose} />
        )}
      </div>
    </div>
  );
}

function Header({ setPage, cartCount = 0, tweaks, setTweaks, onPortal, onReserve }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLight = useIsLight();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const navLinks = [
    { label: '預約體驗',          labelEn: 'Reserve', action: 'reserve' },
    { label: '探索香氣',          labelEn: 'Explore', page: 'explore' },
    { label: '關於 Phinn-Phang',  labelEn: 'About',   page: 'about' },
  ];

  const toggleTheme = () => {
    // Cycle: system -> light -> dark -> system
    let nextTheme = 'system';
    if (tweaks.theme === 'system') nextTheme = 'light';
    else if (tweaks.theme === 'light') nextTheme = 'dark';
    else if (tweaks.theme === 'dark') nextTheme = 'system';

    const next = { ...tweaks, theme: nextTheme };
    setTweaks(next);
    if (window.parent) window.parent.postMessage({ type: '__edit_mode_set_keys', edits: next }, '*');
  };

  const getThemeTitle = () => {
    if (tweaks.theme === 'system') return "目前：跟隨系統 (點擊切換至明亮)";
    if (tweaks.theme === 'light') return "目前：手動明亮 (點擊切換至深色)";
    return "目前：手動深色 (點擊切換至自動)";
  };

  const handleNav = (l) => {
    setMenuOpen(false);
    if (l.action === 'reserve') onReserve?.();
    else setPage(l.page);
  };

  const ThemeBtn = () => (
    <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, transition: '0.3s', position: 'relative' }} title={getThemeTitle()}>
      {isLight ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      )}
      {tweaks.theme === 'system' && (
        <div style={{ position: 'absolute', top: 0, right: 0, width: 5, height: 5, borderRadius: '50%', background: 'var(--gold)', boxShadow: '0 0 5px var(--gold)' }} />
      )}
    </button>
  );

  const CartBtn = () => (
    <button onClick={() => {}} style={{ background: 'none', border: 'none', color: 'var(--text-sub)', display: 'flex', alignItems: 'center', gap: 6, padding: 0, position: 'relative', cursor: 'pointer' }}>
      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {cartCount > 0 && (
        <span style={{ position: 'absolute', top: -6, right: -8, width: 15, height: 15, borderRadius: '50%', background: 'var(--gold)', color: 'var(--bg)', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>
      )}
    </button>
  );

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 72, padding: '0 clamp(20px, 5vw, 60px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'var(--bg)' : 'transparent',
        opacity: scrolled ? 0.96 : 1,
        borderBottom: scrolled ? '1px solid var(--gold2)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        transition: 'all 0.45s ease',
      }}>
        {/* Logo */}
        <div onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
          <img
            src={isLight ? "uploads/logo_light.png" : "uploads/logo_dark.png"}
            alt="Phinn-Phang scent lab"
            style={{ height: 38, width: 'auto', display: 'block', objectFit: 'contain', transition: '0.3s' }}
          />
        </div>

        {/* Desktop nav (≥ 769px) */}
        <nav className="nav-desktop" style={{ gap: 32, alignItems: 'center' }}>
          {navLinks.map(l => (
            <NavBtn key={l.label} label={l.label} onClick={() => l.action === 'reserve' ? onReserve?.() : setPage(l.page)} />
          ))}
          <button onClick={onPortal} style={{ background: 'none', border: '1px solid var(--gold)', color: 'var(--gold)', fontFamily:"'Noto Serif TC',serif", fontSize: 12, letterSpacing: '.12em', padding: '5px 14px', transition: '.25s', cursor: 'pointer' }}>課程入口</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 8 }}>
            <ThemeBtn />
            <CartBtn />
          </div>
        </nav>

        {/* Mobile header bar (≤ 768px): theme + cart + hamburger */}
        <div className="nav-hamburger" style={{ gap: 16, alignItems: 'center' }}>
          <ThemeBtn />
          <CartBtn />
          <button
            className={`hamburger-btn ${menuOpen ? 'open' : ''}`}
            onClick={() => setMenuOpen(o => !o)}
            aria-label={menuOpen ? '關閉選單' : '開啟選單'}
            aria-expanded={menuOpen}
          >
            <span className="line line-1"></span>
            <span className="line line-2"></span>
            <span className="line line-3"></span>
          </button>
        </div>
      </header>

      {/* Mobile full-screen overlay: navLinks + 課程入口 */}
      <div className={`mobile-menu-overlay ${menuOpen ? 'open' : ''}`}>
        {navLinks.map(l => (
          <button key={l.label} className="mobile-menu-item" onClick={() => handleNav(l)}>
            {l.label}
            <span className="en">{l.labelEn}</span>
          </button>
        ))}
        <button className="mobile-menu-item" onClick={() => { setMenuOpen(false); onPortal?.(); }}>
          課程入口
          <span className="en">Portal</span>
        </button>
      </div>
    </>
  );
}

function NavBtn({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} style={{
      background: 'none', border: 'none', fontFamily: "'Noto Serif TC', serif", fontSize: 13, fontWeight: 300,
      letterSpacing: '0.08em', color: hov ? 'var(--gold)' : 'var(--nav-link)', transition: 'color 0.3s', padding: '4px 0', cursor: 'pointer'
    }}>{label}</button>
  );
}

Object.assign(window, { ImagePlaceholder, SectionTitle, GoldDivider, Tag, CTAButton, Header, PortalModal, ReserveModal, useIsLight });
