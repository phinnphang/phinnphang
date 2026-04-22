// HomePage.jsx
const { useState } = React;

const PRESCRIPTIONS = [
  { id: 1, nameZh: '雨後書房', nameEn: 'After Rain Study', type: '空間噴霧', family: '木質調', notes: ['佛手柑 Bergamot', '茉莉 Jasmine', '檀香 Sandalwood'], price: 1280, vol: 30 },
  { id: 2, nameZh: '舊日咖啡館', nameEn: 'Old Café Reverie', type: '織品噴霧', family: '東方調', notes: ['咖啡豆 Coffee', '廣藿香 Patchouli', '香草 Vanilla'], price: 1480, vol: 30 },
  { id: 3, nameZh: '夜來香的自白', nameEn: 'Night Confessions', type: '擴香瓶', family: '花香調', notes: ['夜來香 Tuberose', '玫瑰 Rose', '麝香 Musk'], price: 1380, vol: 30 },
  { id: 4, nameZh: '晨光薑茶', nameEn: 'Morning Ginger', type: '空間噴霧', family: '柑橘調', notes: ['薑 Ginger', '葡萄柚 Grapefruit', '廣藿香 Patchouli'], price: 1180, vol: 15 },
];

const FAMILIES = [
  { nameZh: '木質調', nameEn: 'Woody', notes: '雪松・檀香・廣藿香', gradient: 'radial-gradient(ellipse at 40% 35%, #5C3A1A 0%, #2A1808 50%, #1A1210 100%)' },
  { nameZh: '東方調', nameEn: 'Oriental', notes: '烏木・龍涎香・香草', gradient: 'radial-gradient(ellipse at 40% 35%, #4A2A10 0%, #241408 50%, #1A1210 100%)' },
  { nameZh: '花香調', nameEn: 'Floral', notes: '茉莉・玫瑰・鈴蘭', gradient: 'radial-gradient(ellipse at 50% 30%, #5A2A28 0%, #2A1412 50%, #1A1210 100%)' },
  { nameZh: '柑橘調', nameEn: 'Citrus', notes: '佛手柑・柚子・萊姆', gradient: 'radial-gradient(ellipse at 50% 30%, #4A3818 0%, #251A08 50%, #1A1210 100%)' },
  { nameZh: '西普調', nameEn: 'Chypre', notes: '橡苔・岩薔薇・廣藿香', gradient: 'radial-gradient(ellipse at 40% 40%, #2A3A28 0%, #141E12 50%, #1A1210 100%)' },
  { nameZh: '馥奇調', nameEn: 'Fougère', notes: '薰衣草・香豆素・橡苔', gradient: 'radial-gradient(ellipse at 45% 35%, #2A2A4A 0%, #141420 50%, #1A1210 100%)' },
];

const CREATORS = [
  { id: 1, nameZh: '林晞', nameEn: 'Hsi Lin', tags: ['木質調', '煙燻'], quote: '在每一款香裡,我試著留下那個下午。', works: 7, gradient: 'radial-gradient(ellipse at 50% 30%, #4A3018 0%, #1E140A 80%)' },
  { id: 2, nameZh: '陳珮如', nameEn: 'Pei-Ju Chen', tags: ['東方調', '花香'], quote: '香氣是我的日記,只是不用文字。', works: 5, gradient: 'radial-gradient(ellipse at 50% 30%, #3A2020 0%, #1A1010 80%)' },
  { id: 3, nameZh: '吳宇哲', nameEn: 'Yu-Che Wu', tags: ['東方調', '辛香'], quote: '東方香料是我的母語。', works: 9, gradient: 'radial-gradient(ellipse at 50% 30%, #2A2A18 0%, #121208 80%)' },
];

function HeroSection({ setPage }) {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: 'radial-gradient(ellipse at 50% 65%, #3D2005 0%, #201208 35%, #1A1210 75%)' }}>
      {/* Warm orb */}
      <div style={{ position: 'absolute', width: '45vw', height: '45vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(190,110,30,0.1) 0%, transparent 70%)', top: '18%', left: '50%', transform: 'translateX(-50%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', width: '20vw', height: '20vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(200,150,90,0.06) 0%, transparent 70%)', top: '30%', left: '40%', pointerEvents: 'none' }} />

      <div style={{ textAlign: 'center', zIndex: 1, maxWidth: 680, padding: '80px 24px 0', animation: 'fadeUp 1s ease both' }}>
        <img src="uploads/Phinn-phang_wh-7ca1d186.png" alt="Phinn-Phang scent lab" style={{ height: 'clamp(60px, 10vw, 110px)', width: 'auto', marginBottom: 32, filter: 'drop-shadow(0 0 40px rgba(200,130,60,0.2))' }} />
        <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 14, letterSpacing: '3.5px', color: 'rgb(246,240,231)', marginBottom: 44 }}>
          來自台語的「聞香」<br />同時也有湊湊熱鬧的意思
        </div>

        <div style={{ width: 36, height: 1, background: 'rgba(200,150,90,0.4)', margin: '0 auto 36px' }} />

        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 14, fontWeight: 300, color: 'rgba(245,239,230,0.55)', lineHeight: 2.1, letterSpacing: '0.06em', maxWidth: 460, margin: '0 auto 52px', height: 0, overflow: 'hidden' }}>
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <CTAButton gold onClick={() => setPage('product')}>探索香氣作品</CTAButton>
          <CTAButton>預約體驗課程</CTAButton>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, opacity: 0.35, animation: 'float 3s ease-in-out infinite' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.25em', color: '#C8965A' }}>scroll</div>
        <div style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(200,150,90,0.6), transparent)' }} />
      </div>
    </section>
  );
}

function PrescriptionCard({ item, setPage }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} onClick={() => setPage('product')}
      style={{ minWidth: 260, maxWidth: 290, flexShrink: 0, background: hov ? '#2A1E12' : '#231810', border: `1px solid ${hov ? 'rgba(200,150,90,0.45)' : 'rgba(200,150,90,0.18)'}`, padding: '28px 26px', cursor: 'pointer', transition: 'all 0.35s ease', boxShadow: hov ? '0 8px 40px rgba(0,0,0,0.5), 0 0 30px rgba(200,150,90,0.06)' : '0 4px 20px rgba(0,0,0,0.3)' }}>
      {/* Rx header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontStyle: 'italic', color: '#E8B5A0', letterSpacing: '0.05em' }}>℞</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 9, letterSpacing: '0.25em', color: 'rgba(200,150,90,0.45)', textTransform: 'uppercase' }}>Phinn-Phang</div>
      </div>

      <div style={{ borderTop: '1px dashed rgba(200,150,90,0.2)', marginBottom: 18 }} />

      <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 400, color: '#F5EFE6', letterSpacing: '0.1em', marginBottom: 4 }}>{item.nameZh}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: 'italic', color: 'rgba(200,150,90,0.6)', letterSpacing: '0.1em', marginBottom: 22 }}>{item.nameEn}</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 24 }}>
        {item.notes.map(n => (
          <div key={n} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, color: 'rgba(245,239,230,0.55)', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(200,150,90,0.5)', flexShrink: 0, display: 'inline-block' }} />
            {n}
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed rgba(200,150,90,0.2)', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 11, color: 'rgba(245,239,230,0.4)', letterSpacing: '0.05em' }}>
          {item.type} · {item.vol}ml
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, color: '#C8965A', letterSpacing: '0.05em' }}>
          NT${item.price.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function PrescriptionsSection({ setPage }) {
  return (
    <section style={{ padding: 'clamp(64px, 8vw, 120px) 0', position: 'relative' }}>
      <div style={{ padding: '0 clamp(20px, 5vw, 80px)', marginBottom: 48 }}>
        <SectionTitle zh="本月香氣處方箋" en="Monthly Fragrance Prescriptions" center />
      </div>
      <div style={{ display: 'flex', gap: 24, overflowX: 'auto', padding: '8px clamp(20px, 5vw, 80px) 24px', scrollbarWidth: 'none' }}>
        {PRESCRIPTIONS.map(item => <PrescriptionCard key={item.id} item={item} setPage={setPage} />)}
      </div>
    </section>
  );
}

function FamilyCard({ fam }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ aspectRatio: '4/5', background: fam.gradient, position: 'relative', overflow: 'hidden', cursor: 'pointer', border: `1px solid ${hov ? 'rgba(200,150,90,0.4)' : 'rgba(200,150,90,0.1)'}`, transition: 'all 0.4s ease', transform: hov ? 'scale(1.02)' : 'scale(1)', boxShadow: hov ? '0 12px 40px rgba(0,0,0,0.6), 0 0 40px rgba(200,150,90,0.07)' : 'none' }}>
      {/* Warm glow */}
      <div style={{ position: 'absolute', inset: 0, background: hov ? 'radial-gradient(ellipse at 50% 40%, rgba(200,150,90,0.08) 0%, transparent 65%)' : 'none', transition: 'all 0.4s' }} />
      {/* Label */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 20px 22px', background: 'linear-gradient(to top, rgba(20,12,6,0.9) 0%, transparent 100%)' }}>
        <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 400, letterSpacing: '0.15em', color: '#F5EFE6', marginBottom: 4 }}>{fam.nameZh}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontStyle: 'italic', letterSpacing: '0.2em', color: 'rgba(200,150,90,0.7)', marginBottom: 8 }}>{fam.nameEn}</div>
        <div style={{ fontFamily: "'Lato', sans-serif", fontSize: 11, color: 'rgba(245,239,230,0.35)', letterSpacing: '0.08em' }}>{fam.notes}</div>
      </div>
      {/* Placeholder label */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,150,90,0.22)', letterSpacing: '0.12em', textAlign: 'center', whiteSpace: 'nowrap' }}>
        // 香材情境照 //
      </div>
    </div>
  );
}

function FamiliesSection() {
  return (
    <section style={{ padding: 'clamp(64px, 8vw, 120px) clamp(20px, 5vw, 80px)', background: 'rgba(0,0,0,0.2)' }}>
      <SectionTitle zh="依香調家族探索" en="Explore by Fragrance Family" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {FAMILIES.map(f => <FamilyCard key={f.nameZh} fam={f} />)}
      </div>
    </section>
  );
}

function CreatorCard({ c }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ flex: 1, minWidth: 220, padding: '36px 28px', background: hov ? '#231810' : 'transparent', border: `1px solid ${hov ? 'rgba(200,150,90,0.3)' : 'rgba(245,239,230,0.08)'}`, transition: 'all 0.35s', textAlign: 'center', cursor: 'pointer' }}>
      {/* Portrait placeholder */}
      <div style={{ width: 88, height: 88, borderRadius: '50%', background: c.gradient, margin: '0 auto 20px', border: '1px solid rgba(200,150,90,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,150,90,0.3)', letterSpacing: '0.1em' }}>肖像</div>
      </div>
      <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 18, fontWeight: 400, letterSpacing: '0.15em', color: '#F5EFE6', marginBottom: 3 }}>{c.nameZh}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontStyle: 'italic', letterSpacing: '0.2em', color: 'rgba(200,150,90,0.55)', marginBottom: 14 }}>{c.nameEn}</div>
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18, flexWrap: 'wrap' }}>
        {c.tags.map(t => <Tag key={t} variant="gold">{t}</Tag>)}
      </div>
      <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(245,239,230,0.5)', lineHeight: 1.9, letterSpacing: '0.05em' }}>「{c.quote}」</p>
      <div style={{ marginTop: 18, fontFamily: 'monospace', fontSize: 10, color: 'rgba(200,150,90,0.35)', letterSpacing: '0.1em' }}>{c.works} 件作品</div>
    </div>
  );
}

function CreatorsSection() {
  return (
    <section style={{ padding: 'clamp(64px, 8vw, 120px) clamp(20px, 5vw, 80px)' }}>
      <SectionTitle zh="遇見創作者" en="Meet the Creators" center />
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        {CREATORS.map(c => <CreatorCard key={c.id} c={c} />)}
      </div>
    </section>
  );
}

function FooterCTA() {
  return (
    <section style={{ padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 80px)', textAlign: 'center', position: 'relative', borderTop: '1px solid rgba(200,150,90,0.1)', background: 'radial-gradient(ellipse at 50% 80%, rgba(61,46,32,0.4) 0%, transparent 70%)' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, letterSpacing: '0.35em', color: 'rgba(200,150,90,0.6)', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 16 }}>Experience the Craft</div>
      <h2 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, color: '#F5EFE6', letterSpacing: '0.15em', lineHeight: 1.4, marginBottom: 20 }}>
        預約體驗課程
      </h2>
      <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 14, color: 'rgba(245,239,230,0.45)', letterSpacing: '0.08em', lineHeight: 2, marginBottom: 44, maxWidth: 400, margin: '0 auto 44px' }}>
        每月限額開班。在 Phinn-Phang 的香氣書房裡,<br />
        你將親手調製屬於自己的第一瓶香水。
      </p>
      <CTAButton gold>了解課程內容</CTAButton>

      <div style={{ marginTop: 80, paddingTop: 40, borderTop: '1px solid rgba(245,239,230,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 14, letterSpacing: '0.2em', color: 'rgba(245,239,230,0.5)', marginBottom: 4 }}>聞香</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.3em', fontStyle: 'italic', color: 'rgba(200,150,90,0.45)' }}>Phinn-Phang · 調香體驗教室</div>
        </div>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(245,239,230,0.2)', letterSpacing: '0.1em' }}>
          © 2026 Phinn-Phang. All rights reserved.
        </div>
      </div>
    </section>
  );
}

function HomePage({ setPage }) {
  return (
    <div>
      <HeroSection setPage={setPage} />
      <PrescriptionsSection setPage={setPage} />
      {/* <FamiliesSection /> */}
      {/* <CreatorsSection /> */}
      <FooterCTA />
    </div>
  );
}

Object.assign(window, { HomePage });
