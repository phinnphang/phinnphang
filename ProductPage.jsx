// ProductPage.jsx — Single product page with Fragrance Pyramid
const { useState, useEffect, useRef } = React;

const PRODUCT = {
  nameZh: '雨後書房', nameEn: 'After Rain Study',
  creator: { nameZh: '林晞', nameEn: 'Hsi Lin', id: 1, tags: ['木質調', '煙燻'], bio: '林晞的調香日記從一本關於茶的書開始。她相信每一款香水都應該有一個可以安靜下來的地方。目前已上架作品七件,每一件都有自己的天氣。', works: 7, gradient: 'radial-gradient(ellipse at 50% 30%, #4A3018 0%, #1E140A 80%)' },
  volume: 30, price: 1280, family: '木質調', familyEn: 'Woody',
  notes: {
    top: [
      { en: 'Bergamot', zh: '佛手柑', desc: '清新柑橘前緣,帶著微煙薰的茶香質地。第一道清醒的問候,開瓶即到來。' },
      { en: 'Green Tea', zh: '綠茶', desc: '輕盈的茶葉青氣,若有似無。像晨光穿過茶園的第一縷,乾淨而悠遠。' },
      { en: 'Petrichor', zh: '雨後泥土', desc: '雨後大地特有的清涼濕潤。是土壤、青苔與水的對話,稍縱即逝。' },
    ],
    middle: [
      { en: 'Jasmine', zh: '茉莉', desc: '溫潤的白花,不甜膩不搶戲。像夜晚窗邊飄來的一縷,安靜而存在。' },
      { en: 'Cedar Wood', zh: '雪松', desc: '乾淨清澈的木質心,沉穩中帶著一種空曠感,如山林清晨。' },
      { en: 'Iris', zh: '鳶尾花', desc: '帶著粉質感的花香,有點冷冽,有點傲慢。這款香的個性,藏在這裡。' },
    ],
    base: [
      { en: 'Sandalwood', zh: '檀香', desc: '溫潤綿密的木香,像撫摸一件老木器。有時間的質地,越久越深。' },
      { en: 'Vetiver', zh: '香根草', desc: '大地的根鬚,煙薰而深邃。給人一種安定感,讓香氣落地生根。' },
      { en: 'Musk', zh: '麝香', desc: '若有似無的獸香,是整款香的輪廓與最後的回聲。' },
    ],
  },
  narrative: [
    '這款香,始於一個週三午後的書房。',
    '窗外下著小雨,書桌上的茶剛泡開。蒸氣和著書頁的氣息在空氣中緩緩漫開。我想捕捉的不是「下雨」這件事,而是雨停之後的那種靜謐——空氣裡還留著水的清涼,地面的泥土剛剛呼吸,而你坐在那裡,什麼也不必做,什麼也不必想。',
    '前調的佛手柑和綠茶是窗外的雨聲。茉莉和雪松是那一杯茶,以及書頁的氣息。到了後調,檀香和香根草才是書房本身——那些靜靜等你的木頭與紙張,以及某種你說不清楚的、關於獨處的美好。',
  ],
  emotions: ['雨夜', '獨處', '書桌前', '月光下', '深呼吸', '告別焦慮', '回到自己', '靜思', '新的開始'],
  journey: [
    { time: '5 分鐘', desc: '佛手柑與雨後泥土最先現身,清新而濕潤', color: '#C8A060', abstract: 'rgba(200,160,90,0.35)' },
    { time: '30 分鐘', desc: '茉莉與雪松逐漸展開,木質與花香對話', color: '#A07848', abstract: 'rgba(160,120,72,0.3)' },
    { time: '2 小時', desc: '木質調完全甦醒,溫暖而沉穩', color: '#7A5830', abstract: 'rgba(120,90,48,0.28)' },
    { time: '4 小時+', desc: '麝香與香根草安靜陪伴,是最後的底色', color: '#503820', abstract: 'rgba(80,56,32,0.25)' },
  ],
  similar: [
    { nameZh: '深山裡的茶席', nameEn: 'Mountain Tea', creator: '林晞', price: 1380, family: '木質調', gradient: 'radial-gradient(ellipse at 40% 35%, #3A2810 0%, #1A1208 80%)' },
    { nameZh: '煙雨京都', nameEn: 'Kyoto Rain', creator: '陳珮如', price: 1280, family: '東方調', gradient: 'radial-gradient(ellipse at 40% 35%, #2A2010 0%, #141008 80%)' },
    { nameZh: '老書店', nameEn: 'Old Bookshop', creator: '吳宇哲', price: 1480, family: '木質調', gradient: 'radial-gradient(ellipse at 40% 35%, #3A2A18 0%, #1A1410 80%)' },
  ],
};

// ─── Fragrance Pyramid ───────────────────────────────────────────────────────
function IngredientBtn({ ing, active, onClick }) {
  const [hov, setHov] = useState(false);
  const on = active || hov;
  return (
    <button onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)} onClick={() => onClick(ing)}
      style={{ background: on ? 'rgba(200,150,90,0.15)' : 'rgba(245,239,230,0.04)', border: `1px solid ${on ? 'rgba(200,150,90,0.55)' : 'rgba(245,239,230,0.12)'}`, color: on ? '#C8965A' : 'rgba(245,239,230,0.65)', padding: '5px 13px', margin: '3px', cursor: 'pointer', fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: '0.05em', transition: 'all 0.25s', display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
      <em style={{ fontStyle: 'italic' }}>{ing.en}</em>
      <span style={{ opacity: 0.65, fontSize: 12 }}>{ing.zh}</span>
    </button>
  );
}

function IngredientPopup({ ing, onClose }) {
  if (!ing) return null;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(20,14,8,0.75)', backdropFilter: 'blur(4px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#231810', border: '1px solid rgba(200,150,90,0.35)', padding: '36px 40px', maxWidth: 340, width: '90%', position: 'relative', animation: 'fadeUp 0.3s ease' }}>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.3em', color: 'rgba(200,150,90,0.5)', textTransform: 'uppercase', marginBottom: 12 }}>香材介紹 · Ingredient</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontStyle: 'italic', color: '#F5EFE6', lineHeight: 1, marginBottom: 4 }}>{ing.en}</div>
        <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 16, color: 'rgba(200,150,90,0.8)', marginBottom: 24, letterSpacing: '0.1em' }}>{ing.zh}</div>
        <div style={{ width: 24, height: 1, background: 'rgba(200,150,90,0.3)', marginBottom: 20 }} />
        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 14, color: 'rgba(245,239,230,0.6)', lineHeight: 2, letterSpacing: '0.04em' }}>{ing.desc}</p>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 20, background: 'none', border: 'none', color: 'rgba(245,239,230,0.35)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}>✕</button>
      </div>
    </div>
  );
}

function SmokeParticle({ style }) {
  return <div style={{ position: 'absolute', borderRadius: '50%', filter: 'blur(18px)', background: 'rgba(200,150,90,0.12)', animation: 'smokeRise 4s ease-out infinite', ...style }} />;
}

function FragrancePyramid({ notes }) {
  const [active, setActive] = useState(null);
  const toggle = (ing) => setActive(prev => prev?.en === ing.en ? null : ing);

  const LAYERS = [
    { key: 'top', labelZh: '前調', labelEn: 'Top Notes', items: notes.top, pct: '4%', side: '22%', fill: 'rgba(200,150,90,0.07)' },
    { key: 'middle', labelZh: '中調', labelEn: 'Heart Notes', items: notes.middle, pct: '36%', side: '9%', fill: 'rgba(200,150,90,0.04)' },
    { key: 'base', labelZh: '後調', labelEn: 'Base Notes', items: notes.base, pct: '67%', side: '0%', fill: 'rgba(61,46,32,0.25)' },
  ];

  return (
    <div style={{ position: 'relative', maxWidth: 660, margin: '0 auto' }}>
      {/* Pyramid SVG */}
      <svg viewBox="0 0 660 560" style={{ width: '100%', display: 'block' }} aria-hidden="true">
        <defs>
          <linearGradient id="pyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(200,150,90,0.22)" />
            <stop offset="100%" stopColor="rgba(61,30,10,0.18)" />
          </linearGradient>
        </defs>
        {/* Outer triangle */}
        <polygon points="330,24 624,520 36,520" fill="url(#pyGrad)" stroke="rgba(200,150,90,0.28)" strokeWidth="1" />
        {/* Divider lines */}
        <line x1="150" y1="350" x2="510" y2="350" stroke="rgba(200,150,90,0.2)" strokeWidth="0.8" strokeDasharray="5,5" />
        <line x1="214" y1="195" x2="446" y2="195" stroke="rgba(200,150,90,0.15)" strokeWidth="0.8" strokeDasharray="5,5" />
        {/* Central rising line */}
        <line x1="330" y1="520" x2="330" y2="24" stroke="rgba(200,150,90,0.07)" strokeWidth="0.5" />
      </svg>

      {/* Note layers */}
      {LAYERS.map(layer => (
        <div key={layer.key} style={{ position: 'absolute', top: layer.pct, left: layer.side, right: layer.side, textAlign: 'center', padding: '0 8px' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 10, letterSpacing: '0.3em', color: 'rgba(200,150,90,0.55)', textTransform: 'uppercase', fontStyle: 'italic', marginBottom: 6 }}>
            {layer.labelEn}
          </div>
          <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 11, letterSpacing: '0.2em', color: 'rgba(245,239,230,0.35)', marginBottom: 10 }}>
            {layer.labelZh}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            {layer.items.map(ing => (
              <IngredientBtn key={ing.en} ing={ing} active={active?.en === ing.en} onClick={toggle} />
            ))}
          </div>
        </div>
      ))}

      {/* Smoke at base */}
      <div style={{ position: 'absolute', bottom: '2%', left: '50%', transform: 'translateX(-50%)', width: 120, height: 60, pointerEvents: 'none' }}>
        <SmokeParticle style={{ width: 50, height: 50, bottom: 0, left: '10%', animationDelay: '0s', animationDuration: '4s' }} />
        <SmokeParticle style={{ width: 35, height: 35, bottom: 0, left: '40%', animationDelay: '1.3s', animationDuration: '3.5s' }} />
        <SmokeParticle style={{ width: 45, height: 45, bottom: 0, left: '55%', animationDelay: '2.6s', animationDuration: '4.5s' }} />
      </div>

      <IngredientPopup ing={active} onClose={() => setActive(null)} />
    </div>
  );
}

// ─── Emotion Tags ────────────────────────────────────────────────────────────
function EmotionTags({ emotions }) {
  const angles = [-3, 1.5, -2, 3, -1, 2.5, -3.5, 1, -2.5];
  const [hovIdx, setHovIdx] = useState(null);
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', padding: '16px 0' }}>
      {emotions.map((em, i) => (
        <div key={em}
          onMouseOver={() => setHovIdx(i)} onMouseOut={() => setHovIdx(null)}
          style={{ transform: `rotate(${hovIdx === i ? 0 : angles[i % angles.length]}deg)`, transition: 'all 0.3s ease', fontFamily: "'Noto Serif TC', serif", fontSize: 14, letterSpacing: '0.15em', color: hovIdx === i ? '#C8965A' : 'rgba(245,239,230,0.55)', background: hovIdx === i ? 'rgba(200,150,90,0.1)' : 'rgba(245,239,230,0.04)', border: `1px solid ${hovIdx === i ? 'rgba(200,150,90,0.4)' : 'rgba(245,239,230,0.1)'}`, padding: '7px 16px', cursor: 'default', boxShadow: hovIdx === i ? '0 0 20px rgba(200,150,90,0.12)' : 'none' }}>
          {em}
        </div>
      ))}
    </div>
  );
}

// ─── Journey Timeline ────────────────────────────────────────────────────────
function JourneyTimeline({ journey }) {
  return (
    <div style={{ position: 'relative', padding: '20px 0 40px' }}>
      {/* Connecting line */}
      <div style={{ position: 'absolute', top: 44, left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(to right, rgba(200,150,90,0.4), rgba(200,150,90,0.15))', zIndex: 0 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, position: 'relative', zIndex: 1 }}>
        {journey.map((stage, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            {/* Abstract blob */}
            <div style={{ width: 48, height: 48, borderRadius: '50%', margin: '0 auto 16px', background: stage.abstract, border: `1px solid ${stage.color}40`, boxShadow: `0 0 24px ${stage.abstract}`, filter: 'blur(1px)', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 4, borderRadius: '50%', background: `radial-gradient(circle, ${stage.color}60 0%, transparent 70%)` }} />
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', color: stage.color, letterSpacing: '0.1em', marginBottom: 10 }}>{stage.time}</div>
            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 12, color: 'rgba(245,239,230,0.45)', lineHeight: 1.8, letterSpacing: '0.04em' }}>{stage.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Product Page ────────────────────────────────────────────────────────────
function ProductSection({ title, zh, en, children, bg }) {
  return (
    <section style={{ padding: 'clamp(56px, 7vw, 96px) clamp(20px, 6vw, 100px)', background: bg || 'transparent', borderTop: '1px solid rgba(200,150,90,0.08)' }}>
      <SectionTitle zh={zh} en={en} />
      {children}
    </section>
  );
}

function ProductPage({ setPage }) {
  const [cartAdded, setCartAdded] = useState(false);
  const p = PRODUCT;

  const handleCart = () => {
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2500);
  };

  return (
    <div>
      {/* Hero Gallery */}
      <div style={{ height: '65vh', minHeight: 420, position: 'relative', background: 'radial-gradient(ellipse at 40% 50%, #4A2E14 0%, #2A1A08 40%, #1A1210 100%)' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(200,150,90,0.2)', letterSpacing: '0.2em', textAlign: 'center', lineHeight: 2.5 }}>
            <div>// 產品主圖 //</div>
            <div style={{ fontSize: 9, opacity: 0.6 }}>product hero · full bleed</div>
          </div>
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 60%, rgba(200,120,40,0.08) 0%, transparent 60%)' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120, background: 'linear-gradient(to top, #1A1612 0%, transparent 100%)' }} />
      </div>

      {/* Product Info */}
      <section style={{ padding: 'clamp(40px, 5vw, 72px) clamp(20px, 6vw, 100px)', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start', borderBottom: '1px solid rgba(200,150,90,0.08)' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <Tag variant="gold">{p.family}</Tag>
            <Tag variant="default">{p.familyEn}</Tag>
          </div>
          <h1 style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 300, letterSpacing: '0.15em', color: '#F5EFE6', lineHeight: 1.2, marginBottom: 6 }}>{p.nameZh}</h1>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 2vw, 22px)', fontStyle: 'italic', color: 'rgba(200,150,90,0.7)', letterSpacing: '0.15em', marginBottom: 20 }}>{p.nameEn}</div>
          <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', fontFamily: "'Noto Serif TC', serif", fontSize: 13, color: 'rgba(245,239,230,0.45)', letterSpacing: '0.1em', cursor: 'pointer', padding: 0, marginBottom: 8, textDecoration: 'underline', textDecorationColor: 'rgba(245,239,230,0.2)', textUnderlineOffset: 3 }}>
            {p.creator.nameZh} {p.creator.nameEn}
          </button>
          <div style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(245,239,230,0.3)', letterSpacing: '0.1em' }}>{p.volume} ml</div>
        </div>

        <div style={{ textAlign: 'right', minWidth: 180 }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(24px, 3vw, 38px)', color: '#C8965A', letterSpacing: '0.05em', marginBottom: 20 }}>NT${p.price.toLocaleString()}</div>
          <button onClick={handleCart} style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 13, letterSpacing: '0.2em', background: cartAdded ? 'rgba(200,150,90,0.2)' : 'transparent', border: `1px solid ${cartAdded ? 'rgba(200,150,90,0.6)' : 'rgba(200,150,90,0.4)'}`, color: cartAdded ? '#C8965A' : '#F5EFE6', padding: '13px 28px', cursor: 'pointer', transition: 'all 0.4s', display: 'block', width: '100%', marginBottom: 10 }}>
            {cartAdded ? '✓ 已加入' : '加入購物車'}
          </button>
          <button style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 11, letterSpacing: '0.15em', background: 'transparent', border: '1px solid rgba(245,239,230,0.1)', color: 'rgba(245,239,230,0.35)', padding: '10px 28px', cursor: 'pointer', width: '100%' }}>
            試聞小樣
          </button>
        </div>
      </section>

      {/* Fragrance Pyramid */}
      <ProductSection zh="香調金字塔" en="The Fragrance Pyramid" bg="rgba(0,0,0,0.15)">
        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 13, color: 'rgba(245,239,230,0.4)', letterSpacing: '0.08em', lineHeight: 2, marginBottom: 48, maxWidth: 520 }}>
          點擊香材名稱,了解每一味的氣息語言。香調比例為創作者的商業機密,僅呈現層次結構。
        </p>
        <FragrancePyramid notes={p.notes} />
      </ProductSection>

      {/* Narrative */}
      <ProductSection zh="創作者的香氣敘事" en="The Creator's Narrative">
        <div style={{ maxWidth: 620, position: 'relative' }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, color: 'rgba(200,150,90,0.15)', lineHeight: 1, marginBottom: -16, marginLeft: -8 }}>"</div>
          {p.narrative.map((para, i) => (
            <p key={i} style={{ fontFamily: i === 0 ? "'Noto Serif TC', serif" : "'Noto Serif TC', serif", fontSize: i === 0 ? 18 : 14, fontWeight: i === 0 ? 400 : 300, color: i === 0 ? 'rgba(245,239,230,0.85)' : 'rgba(245,239,230,0.55)', lineHeight: 2.2, letterSpacing: '0.07em', marginBottom: i === p.narrative.length - 1 ? 0 : 28 }}>{para}</p>
          ))}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: '1px solid rgba(200,150,90,0.15)', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(200,150,90,0.6)', letterSpacing: '0.1em' }}>
            — {p.creator.nameZh}，2026 年春
          </div>
        </div>
      </ProductSection>

      {/* Emotion Tags */}
      <ProductSection zh="此時此刻,適合你嗎" en="Mood & Occasion" bg="rgba(0,0,0,0.12)">
        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 13, color: 'rgba(245,239,230,0.35)', letterSpacing: '0.08em', lineHeight: 2, marginBottom: 36 }}>
          這款香水,適合某種特定的狀態。你是否也在其中?
        </p>
        <EmotionTags emotions={p.emotions} />
      </ProductSection>

      {/* Journey Timeline */}
      <ProductSection zh="香氣旅程" en="Fragrance Journey">
        <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 13, color: 'rgba(245,239,230,0.35)', letterSpacing: '0.08em', lineHeight: 2, marginBottom: 48 }}>
          噴上之後,香氣如何隨時間演變。每個階段都是一種不同的相遇。
        </p>
        <JourneyTimeline journey={p.journey} />
      </ProductSection>

      {/* Creator Bio */}
      <ProductSection zh="關於創作者" en="About the Creator" bg="rgba(0,0,0,0.15)">
        <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ width: 100, height: 100, borderRadius: '50%', background: p.creator.gradient, border: '1px solid rgba(200,150,90,0.2)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,150,90,0.3)', letterSpacing: '0.08em' }}>肖像</div>
          </div>
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 22, fontWeight: 400, letterSpacing: '0.15em', color: '#F5EFE6', marginBottom: 3 }}>{p.creator.nameZh}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, fontStyle: 'italic', letterSpacing: '0.2em', color: 'rgba(200,150,90,0.6)', marginBottom: 14 }}>{p.creator.nameEn}</div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
              {p.creator.tags.map(t => <Tag key={t} variant="gold">{t}</Tag>)}
            </div>
            <p style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 13, color: 'rgba(245,239,230,0.5)', lineHeight: 2, letterSpacing: '0.05em', marginBottom: 20 }}>{p.creator.bio}</p>
            <button onClick={() => setPage('home')} style={{ background: 'none', border: 'none', fontFamily: "'Cormorant Garamond', serif", fontSize: 13, fontStyle: 'italic', color: 'rgba(200,150,90,0.7)', letterSpacing: '0.1em', cursor: 'pointer', padding: 0, textDecoration: 'underline', textDecorationColor: 'rgba(200,150,90,0.3)', textUnderlineOffset: 3 }}>
              查看 {p.creator.nameZh} 的全部作品 →
            </button>
          </div>
        </div>
      </ProductSection>

      {/* Similar Works */}
      <ProductSection zh="也許你也會喜歡" en="You May Also Like">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {p.similar.map((s, i) => (
            <SimilarCard key={i} item={s} />
          ))}
        </div>
      </ProductSection>
    </div>
  );
}

function SimilarCard({ item }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseOver={() => setHov(true)} onMouseOut={() => setHov(false)}
      style={{ cursor: 'pointer', border: `1px solid ${hov ? 'rgba(200,150,90,0.35)' : 'rgba(200,150,90,0.1)'}`, background: hov ? '#231810' : 'transparent', transition: 'all 0.35s', overflow: 'hidden' }}>
      <div style={{ aspectRatio: '4/3', background: item.gradient, position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(200,150,90,0.2)', letterSpacing: '0.12em' }}>// 情境照 //</div>
        </div>
        {hov && <div style={{ position: 'absolute', inset: 0, background: 'rgba(200,150,90,0.04)' }} />}
      </div>
      <div style={{ padding: '16px 18px' }}>
        <div style={{ fontFamily: "'Noto Serif TC', serif", fontSize: 16, fontWeight: 400, letterSpacing: '0.1em', color: '#F5EFE6', marginBottom: 2 }}>{item.nameZh}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 11, fontStyle: 'italic', color: 'rgba(200,150,90,0.55)', letterSpacing: '0.1em', marginBottom: 10 }}>{item.nameEn}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Tag variant="gold">{item.family}</Tag>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, color: '#C8965A' }}>NT${item.price.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ProductPage });
