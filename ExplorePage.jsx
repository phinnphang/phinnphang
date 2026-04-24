// ExplorePage.jsx — browse all published works (scent products)

function ExplorePage({ setPage }) {
  const [works] = React.useState(() => [...PP.getPublishedWorks(), ...PP.getDemoWorks()]);
  const [filter, setFilter] = React.useState('all');
  const settings = PP.getSettings();
  const types = ['all', ...(settings.productTypes || [])];

  const list = filter === 'all' ? works : works.filter(w => w.productType === filter);

  return (
    <div style={{ minHeight: '100vh', padding: 'clamp(60px, 8vh, 100px) clamp(20px, 5vw, 80px) 120px' }}>
      <div style={{ textAlign: 'center', marginBottom: 60 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontStyle: 'italic', letterSpacing: '.35em', color: 'var(--gold)', opacity: 0.85, textTransform: 'uppercase', marginBottom: 14 }}>Explore · 探索香氣</div>
        <h1 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 'clamp(28px,4vw,44px)', fontWeight: 300, color: 'var(--text-main)', letterSpacing: '0.18em', marginBottom: 16 }}>學員香氣作品</h1>
        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 14, color: 'var(--text-mute)', letterSpacing: '0.06em', lineHeight: 2, maxWidth: 540, margin: '0 auto' }}>
          每一支，都是學員在 Phinn-Phang 的香氣書房裡，親手調配、反覆比對出的獨特配方。
        </p>
      </div>

      {/* Filter */}
      {works.length > 0 && (
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: 56, flexWrap: 'wrap' }}>
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              style={{
                padding: '8px 20px', background: filter === t ? 'var(--gold3)' : 'transparent',
                border: `1px solid ${filter === t ? 'var(--gold)' : 'rgba(var(--text-rgb),0.12)'}`,
                color: filter === t ? 'var(--gold)' : 'var(--text-sub)',
                fontFamily: "'Noto Serif TC',serif", fontSize: 12, letterSpacing: '.1em', cursor: 'pointer', transition: '.25s'
              }}>
              {t === 'all' ? '全部' : t}
            </button>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <div style={{ maxWidth: 480, margin: '80px auto', padding: 80, textAlign: 'center', border: '1px dashed rgba(var(--gold-rgb),0.15)' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 40, color: 'rgba(var(--gold-rgb),0.3)', marginBottom: 20 }}>✦</div>
          <div style={{ fontSize: 14, color: 'var(--text-mute)', letterSpacing: '.08em', lineHeight: 2 }}>
            尚無上架的香氣作品<br />
            <span style={{ fontSize: 12, color: 'rgba(var(--text-rgb),0.3)' }}>請稍後再回來探索</span>
          </div>
        </div>
      ) : (
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 28 }}>
          {list.map(w => (
            <a key={w.id}
              href={w.isDemo ? '#' : `work.html?id=${w.id}`}
              onClick={w.isDemo ? (e) => { e.preventDefault(); setPage?.('product'); } : undefined}
              style={{
                background: 'var(--card-bg)', border: '1px solid rgba(var(--gold-rgb),0.18)', padding: '32px 28px',
                textDecoration: 'none', color: 'inherit', transition: '.35s',
                display: 'flex', flexDirection: 'column',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--card-hov-bg)'; e.currentTarget.style.borderColor = 'rgba(var(--gold-rgb),0.45)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--card-bg)'; e.currentTarget.style.borderColor = 'rgba(var(--gold-rgb),0.18)'; }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, fontStyle: 'italic', color: 'var(--coral)' }}>℞</div>
                <div style={{ fontSize: 10, letterSpacing: '.2em', color: 'rgba(var(--gold-rgb),0.6)' }}>{w.productType}</div>
              </div>
              <div style={{ borderTop: '1px dashed rgba(var(--gold-rgb),0.2)', marginBottom: 18 }} />
              <div style={{ fontFamily: "'Noto Serif TC',serif", fontSize: 22, fontWeight: 400, color: 'var(--text-main)', letterSpacing: '.1em', marginBottom: 4 }}>{w.workName}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, fontStyle: 'italic', color: 'var(--gold)', opacity: 0.8, letterSpacing: '.08em', marginBottom: 20 }}>by {w.studentName}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20, flex: 1 }}>
                {(w.formula || []).slice(0, 3).map((f, i) => (
                  <div key={i} style={{ fontSize: 12, color: 'var(--text-sub)', letterSpacing: '.04em', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(var(--gold-rgb),0.5)' }} />
                    {f.name}{f.nameEn ? ` · ${f.nameEn}` : ''}
                  </div>
                ))}
                {(w.formula || []).length > 3 && (
                  <div style={{ fontSize: 11, color: 'rgba(var(--text-rgb),0.3)', marginLeft: 12 }}>+ {w.formula.length - 3} 種香精</div>
                )}
              </div>
              <div style={{ borderTop: '1px dashed rgba(var(--gold-rgb),0.2)', paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: 'var(--text-mute)' }}>{w.courseName}</div>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 15, color: 'var(--gold)' }}>閱讀 →</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

window.ExplorePage = ExplorePage;
