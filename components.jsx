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

function Header({ setPage, cartCount = 0, tweaks }) {
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

Object.assign(window, { ImagePlaceholder, SectionTitle, GoldDivider, Tag, CTAButton, Header });
