// components.jsx — shared primitives + Header
const { useState, useEffect } = React;

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
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.3em', color: 'rgba(200,150,90,0.65)', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 10 }}>{en}</div>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 'clamp(22px, 2.8vw, 34px)', fontWeight: 300, color: '#F5EFE6', letterSpacing: '0.12em', lineHeight: 1.3 }}>{zh}</h2>
      <div style={{ width: 32, height: 1, background: 'rgba(200,150,90,0.45)', marginTop: 16, ...(center ? { margin: '16px auto 0' } : {}) }} />
    </div>
  );
}

function GoldDivider({ style }) {
  return <div style={{ width: '100%', height: 1, background: 'linear-gradient(to right, transparent, rgba(200,150,90,0.3), transparent)', margin: '0 auto', ...style }} />;
}

function Tag({ children, variant = 'default' }) {
  const variants = {
    default: { background: 'rgba(245,239,230,0.06)', color: 'rgba(245,239,230,0.55)', border: '1px solid rgba(245,239,230,0.12)' },
    gold:    { background: 'rgba(200,150,90,0.12)', color: '#C8965A', border: '1px solid rgba(200,150,90,0.3)' },
    coral:   { background: 'rgba(232,181,160,0.1)', color: '#E8B5A0', border: '1px solid rgba(232,181,160,0.25)' },
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
    background: 'transparent', border: `1px solid ${gold ? (hov ? '#C8965A' : 'rgba(200,150,90,0.5)') : (hov ? 'rgba(245,239,230,0.4)' : 'rgba(245,239,230,0.18)')}`,
    color: gold ? (hov ? '#C8965A' : '#F5EFE6') : (hov ? 'rgba(245,239,230,0.9)' : 'rgba(245,239,230,0.5)'),
    padding: '13px 36px', transition: 'all 0.3s ease', cursor: 'pointer', ...style,
  };
  return <button style={base} onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} onClick={onClick}>{children}</button>;
}

// ── Admin Tab (inline login) ──────────────────────────────────────────────
function AdminTabLogin({ onClose }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const submit = (e) => {
    e.preventDefault();
    const s = PP.getSettings();
    if (pw === s.adminPassword) {
      sessionStorage.setItem('pp_admin_auth', '1');
      window.location.href = 'admin.html';
    } else {
      setErr('密碼錯誤');
    }
  };
  return (
    <form onSubmit={submit}>
      <p style={{ fontFamily:"'Noto Serif TC',serif", fontSize:13, color:'rgba(245,239,230,0.45)', lineHeight:2, letterSpacing:'.04em', marginBottom:20 }}>
        請輸入管理員密碼，進入課程管理後台。
      </p>
      <input
        type="password" value={pw} onChange={e=>{setPw(e.target.value);setErr('');}}
        placeholder="管理員密碼" autoFocus
        style={{ width:'100%', background:'rgba(200,150,90,0.06)', border:`1px solid ${err?'rgba(200,80,60,0.5)':'rgba(200,150,90,0.25)'}`, color:'#F0E8DE', fontFamily:"'Noto Serif TC',serif", fontSize:13, padding:'11px 14px', outline:'none', marginBottom: err?8:20, transition:'.25s' }}
      />
      {err && <div style={{ color:'#C86050', fontSize:12, marginBottom:16 }}>{err}</div>}
      <button type="submit" style={{ width:'100%', fontFamily:"'Noto Serif TC',serif", fontSize:14, letterSpacing:'.15em', padding:'12px', background:'transparent', border:'1px solid rgba(245,239,230,0.2)', color:'rgba(245,239,230,0.6)', transition:'.3s' }}>
        進入後台 →
      </button>
    </form>
  );
}

// ── Portal Modal ──────────────────────────────────────────────────────────
function PortalModal({ onClose }) {
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
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:500, background:'rgba(20,14,8,0.85)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div onClick={e=>e.stopPropagation()} style={{ width:'100%', maxWidth:400, background:'#1E1812', border:'1px solid rgba(200,150,90,0.25)', padding:'36px 32px', animation:'fadeUp .3s ease', position:'relative' }}>
        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:16, right:18, background:'none', border:'none', color:'rgba(245,239,230,0.35)', fontSize:18, lineHeight:1 }}>✕</button>

        {/* Brand */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:11, fontStyle:'italic', letterSpacing:'.3em', color:'rgba(200,150,90,0.6)', marginBottom:4 }}>Phinn-Phang</div>
          <div style={{ fontFamily:"'Noto Serif TC',serif", fontSize:16, fontWeight:300, letterSpacing:'.15em', color:'#F0E8DE' }}>課程入口</div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(200,150,90,0.15)', marginBottom:28 }}>
          {[['student','學員配方登錄'],['admin','管理員後台']].map(([key,label])=>(
            <button key={key} onClick={()=>{setTab(key);setErr('');}} style={{ flex:1, background:'none', border:'none', borderBottom:`2px solid ${tab===key?'#C8965A':'transparent'}`, padding:'10px 0', fontFamily:"'Noto Serif TC',serif", fontSize:13, letterSpacing:'.1em', color:tab===key?'#C8965A':'rgba(245,239,230,0.4)', transition:'.25s', marginBottom:-1 }}>
              {label}
            </button>
          ))}
        </div>

        {/* Student tab */}
        {tab==='student' && (
          <div>
            <p style={{ fontFamily:"'Noto Serif TC',serif", fontSize:13, color:'rgba(245,239,230,0.45)', lineHeight:2, letterSpacing:'.04em', marginBottom:20 }}>
              請貼入老師傳給你的課程連結，進入今天的配方登錄頁。
            </p>
            <input
              value={token} onChange={e=>{setToken(e.target.value);setErr('');}}
              onKeyDown={e=>e.key==='Enter'&&handleStudent()}
              placeholder="貼入課程連結或 Token"
              autoFocus
              style={{ width:'100%', background:'rgba(200,150,90,0.06)', border:`1px solid ${err?'rgba(200,80,60,0.5)':'rgba(200,150,90,0.25)'}`, color:'#F0E8DE', fontFamily:"'Noto Serif TC',serif", fontSize:13, padding:'11px 14px', outline:'none', marginBottom: err?8:20, transition:'.25s' }}
            />
            {err && <div style={{ color:'#C86050', fontSize:12, marginBottom:16, letterSpacing:'.04em' }}>{err}</div>}
            <button onClick={handleStudent} style={{ width:'100%', fontFamily:"'Noto Serif TC',serif", fontSize:14, letterSpacing:'.15em', padding:'12px', background:'rgba(200,150,90,0.12)', border:'1px solid rgba(200,150,90,0.45)', color:'#C8965A', transition:'.3s' }}>
              進入配方登錄 →
            </button>
            {/* Demo link */}
            {(() => {
              const demo = PP.getCourseByToken('pp-demo0001');
              if (!demo) return null;
              const url = `formula.html?token=pp-demo0001`;
              return (
                <div style={{ marginTop:16, padding:'10px 14px', background:'rgba(245,239,230,0.03)', border:'1px dashed rgba(200,150,90,0.2)' }}>
                  <div style={{ fontSize:11, color:'rgba(200,150,90,0.5)', letterSpacing:'.1em', marginBottom:6 }}>示範課程連結</div>
                  <a href={url} style={{ fontSize:12, color:'rgba(200,150,90,0.7)', fontFamily:'monospace', wordBreak:'break-all' }}>{url}</a>
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

function Header({ setPage, cartCount = 0, tweaks, onPortal }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: '預約體驗', page: 'reserve' },
    { label: '探索香氣', page: 'explore' },
    { label: '關於 Phinn-Phang', page: 'about' },
  ];

  return (
    <header style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      height: 72, padding: '0 clamp(20px, 5vw, 60px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      background: scrolled ? 'rgba(26,22,18,0.94)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(200,150,90,0.12)' : '1px solid transparent',
      backdropFilter: scrolled ? 'blur(14px)' : 'none',
      transition: 'all 0.45s ease',
    }}>
      {/* Logo */}
      <div onClick={() => setPage('home')} style={{ cursor: 'pointer' }}>
        <img src="uploads/Phinn-phang_wh-7ca1d186.png" alt="Phinn-Phang scent lab" style={{ height: 38, width: 'auto', display: 'block', objectFit: 'contain' }} />
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {navLinks.map(l => (
          <NavBtn key={l.label} label={l.label} onClick={() => setPage(l.page)} />
        ))}
        <button onClick={onPortal} style={{ background: 'none', border: '1px solid rgba(200,150,90,0.3)', color: 'rgba(200,150,90,0.75)', fontFamily:"'Noto Serif TC',serif", fontSize: 12, letterSpacing: '.12em', padding: '5px 14px', transition: '.25s' }}>課程入口</button>
        <button onClick={() => {}} style={{ background: 'none', border: 'none', color: 'rgba(245,239,230,0.6)', display: 'flex', alignItems: 'center', gap: 6, padding: 0, position: 'relative' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span style={{ position: 'absolute', top: -6, right: -8, width: 15, height: 15, borderRadius: '50%', background: '#C8965A', color: '#1A1612', fontSize: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>
          )}
        </button>
      </nav>
    </header>
  );
}

function NavBtn({ label, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} style={{
      background: 'none', border: 'none', fontFamily: "'Noto Serif TC', serif", fontSize: 13, fontWeight: 300,
      letterSpacing: '0.08em', color: hov ? '#C8965A' : 'rgba(245,239,230,0.6)', transition: 'color 0.3s', padding: '4px 0',
    }}>{label}</button>
  );
}

Object.assign(window, { ImagePlaceholder, SectionTitle, GoldDivider, Tag, CTAButton, Header, PortalModal });
