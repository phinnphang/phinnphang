// app-data.js — Phinn-Phang shared data layer (plain JS, no framework)

const PP = (() => {
  const KEYS = {
    SETTINGS:     'pp_settings',
    COURSES:      'pp_courses',
    WORKS:        'pp_works',
    RESERVATIONS: 'pp_reservations',
  };

  const DEFAULT_FAMILIES = [
    { id: 'citrus',   zh: '柑橘',   en: 'Citrus',    color: '#E8A84A', bg: 'rgba(232,168,74,0.15)'  },
    { id: 'floral',   zh: '花香',   en: 'Floral',    color: '#E8B5A0', bg: 'rgba(232,181,160,0.15)' },
    { id: 'woody',    zh: '木質',   en: 'Woody',     color: '#A07848', bg: 'rgba(160,120,72,0.15)'  },
    { id: 'oriental', zh: '東方',   en: 'Oriental',  color: '#C8965A', bg: 'rgba(200,150,90,0.15)'  },
    { id: 'fresh',    zh: '清新',   en: 'Fresh',     color: '#7B9E6E', bg: 'rgba(123,158,110,0.15)' },
    { id: 'gourmand', zh: '美食',   en: 'Gourmand',  color: '#D4956A', bg: 'rgba(212,149,106,0.15)' },
    { id: 'spicy',    zh: '辛香',   en: 'Spicy',     color: '#B5614A', bg: 'rgba(181,97,74,0.15)'   },
    { id: 'aldehyde', zh: '醛香',   en: 'Aldehyde',  color: '#D8C8A8', bg: 'rgba(216,200,168,0.15)' },
    { id: 'animalic', zh: '動物香', en: 'Animalic', color: '#7A5438', bg: 'rgba(122,84,56,0.15)'   },
  ];

  // Runtime FAMILIES — settings.families overrides defaults (additions + edits)
  const FAMILIES = new Proxy([], {
    get(_, prop) {
      const s = load(KEYS.SETTINGS, {});
      const fams = Array.isArray(s.families) && s.families.length ? s.families : DEFAULT_FAMILIES;
      const target = fams;
      const v = target[prop];
      return typeof v === 'function' ? v.bind(target) : v;
    },
    has(_, prop) { return prop in DEFAULT_FAMILIES; },
    ownKeys() {
      const s = load(KEYS.SETTINGS, {});
      const fams = Array.isArray(s.families) && s.families.length ? s.families : DEFAULT_FAMILIES;
      return Reflect.ownKeys(fams);
    },
    getOwnPropertyDescriptor(_, prop) {
      const s = load(KEYS.SETTINGS, {});
      const fams = Array.isArray(s.families) && s.families.length ? s.families : DEFAULT_FAMILIES;
      return Object.getOwnPropertyDescriptor(fams, prop);
    },
  });

  const DEFAULT_SETTINGS = {
    adminPassword: 'phinnphang2026',
    googleScriptUrl: '',
    courseTypes: ['春季體驗課', '秋季體驗課', '企業團體活動', '週末工作坊'],
    productTypes: ['空間噴霧', '織品噴霧', '擴香瓶'],
    defaultAiNamePrompt: '根據以下香精配方，為這款香水創作一個富有詩意的繁體中文名字（2～4個字）。不可包含任何香精原料的名稱。要能喚起一種情境、氛圍或感受，帶有文學性。請提供3個選項，每行一個，只回覆名字本身。',
    defaultAiDescPrompt: '根據以下香精配方，用優美的繁體中文寫一段香水介紹（約120字）。描述氣味的層次與演變、喚起的情境與感受，語氣溫暖而富有詩意，像是一封寫給香氣的短信。',
  };

  // ── Storage helpers ──────────────────────────────────────────────────────
  function load(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
    catch { return fallback; }
  }
  function save(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

  function getSettings()      { return { ...DEFAULT_SETTINGS, ...load(KEYS.SETTINGS, {}) }; }
  function saveSettings(s)    { save(KEYS.SETTINGS, s); }
  function getCourses()       { return load(KEYS.COURSES, []); }
  function getWorks()         { return load(KEYS.WORKS, []); }

  function saveCourse(course) {
    const list = getCourses();
    const idx  = list.findIndex(c => c.id === course.id);
    if (idx >= 0) list[idx] = course; else list.unshift(course);
    save(KEYS.COURSES, list);
  }
  function deleteCourse(id) { save(KEYS.COURSES, getCourses().filter(c => c.id !== id)); }

  function saveWork(work) {
    const list = getWorks();
    const idx  = list.findIndex(w => w.id === work.id);
    if (idx >= 0) list[idx] = work; else list.unshift(work);
    save(KEYS.WORKS, list);
  }

  function getCourseByToken(token) { return getCourses().find(c => c.token === token) || null; }
  function getWorkById(id)         { return getWorks().find(w => w.id === id) || null; }
  function getCourseById(id)       { return getCourses().find(c => c.id === id) || null; }

  function getReservations()       { return load(KEYS.RESERVATIONS, []); }
  function saveReservation(r) {
    const list = getReservations();
    const idx  = list.findIndex(x => x.id === r.id);
    if (idx >= 0) list[idx] = r; else list.unshift(r);
    save(KEYS.RESERVATIONS, list);
  }
  function deleteReservation(id) { save(KEYS.RESERVATIONS, getReservations().filter(r => r.id !== id)); }

  function getBookableCourses() { return getCourses().filter(c => c.bookable && c.date); }
  function getPublishedWorks()  { return getWorks().filter(w => w.published && w.productType); }

  const RESERVATION_STATUSES = [
    { id: 'pending',   label: '待確認', color: '#C8965A' },
    { id: 'confirmed', label: '已確認', color: '#7B9E6E' },
    { id: 'emailed',   label: '已寄信', color: '#6A93A8' },
    { id: 'paid',      label: '已付款', color: '#A088C8' },
    { id: 'completed', label: '已完成', color: '#8AA878' },
    { id: 'cancelled', label: '已取消', color: '#B05850' },
  ];

  // ── ID / Token generation ─────────────────────────────────────────────────
  function genId()    { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function genToken() { return 'pp-' + genId(); }

  // ── Radar computation ────────────────────────────────────────────────────
  function computeRadar(formula) {
    const totals = {};
    const total  = formula.reduce((s, f) => s + (Number(f.drops) || 0), 0);
    formula.forEach(f => {
      if (!totals[f.family]) totals[f.family] = 0;
      totals[f.family] += Number(f.drops) || 0;
    });
    return FAMILIES.map(fam => ({
      ...fam,
      value: total > 0 ? Math.round((totals[fam.id] || 0) / total * 100) : 0,
    }));
  }

  // ── Google Sheet sync (via Apps Script Web App) ───────────────────────────
  async function syncWorkToSheet(work, scriptUrl) {
    if (!scriptUrl) throw new Error('尚未設定 Google Script URL');
    const payload = {
      timestamp:   new Date().toISOString(),
      workId:      work.id,
      workName:    work.workName,
      studentName: work.studentName,
      courseId:    work.courseId,
      courseName:  work.courseName,
      courseDate:  work.courseDate,
      totalDrops:  work.totalDrops,
      base:        work.base?.name || '',
      aiDesc:      work.aiDescription,
      shareUrl:    work.shareUrl,
      ...Object.fromEntries(work.formula.map(f => [`${f.name}(${f.nameEn})`, f.drops + '滴 (' + f.percentage + '%)'])),
    };
    const res = await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return true;
  }

  // ── Canvas image export ──────────────────────────────────────────────────
  function drawRadarOnCanvas(ctx, cx, cy, r, data, opts = {}) {
    const n     = data.length;
    const step  = (Math.PI * 2) / n;
    const start = -Math.PI / 2;

    // Grid
    [0.25, 0.5, 0.75, 1].forEach(scale => {
      ctx.beginPath();
      for (let i = 0; i <= n; i++) {
        const a = start + step * i;
        const x = cx + Math.cos(a) * r * scale;
        const y = cy + Math.sin(a) * r * scale;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(200,150,90,0.12)';
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    });

    // Axes
    data.forEach((_, i) => {
      const a = start + step * i;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
      ctx.strokeStyle = 'rgba(200,150,90,0.18)';
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    });

    // Data polygon
    ctx.beginPath();
    data.forEach((d, i) => {
      const a = start + step * i;
      const v = d.value / 100;
      const x = cx + Math.cos(a) * r * v;
      const y = cy + Math.sin(a) * r * v;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.fillStyle   = 'rgba(232,149,122,0.28)';
    ctx.fill();
    ctx.strokeStyle = '#E8957A';
    ctx.lineWidth   = 1.5;
    ctx.stroke();

    // Labels
    ctx.font         = opts.font || '13px serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    data.forEach((d, i) => {
      const a   = start + step * i;
      const lx  = cx + Math.cos(a) * (r + 22);
      const ly  = cy + Math.sin(a) * (r + 22);
      ctx.fillStyle = d.value > 0 ? '#E8957A' : 'rgba(200,150,90,0.35)';
      ctx.fillText(d.zh, lx, ly);
    });
  }

  async function generateWorkImage(work) {
    const size   = 1080;
    const canvas = document.createElement('canvas');
    canvas.width  = size;
    canvas.height = size;
    const ctx    = canvas.getContext('2d');

    // Background
    const bg = ctx.createRadialGradient(size/2, size*0.55, 0, size/2, size/2, size*0.72);
    bg.addColorStop(0, '#3D1A10');
    bg.addColorStop(0.45, '#201008');
    bg.addColorStop(1, '#1A1210');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, size, size);

    // Coral glow
    const glow = ctx.createRadialGradient(size/2, size*0.42, 0, size/2, size*0.42, 320);
    glow.addColorStop(0, 'rgba(220,120,90,0.12)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, size, size);

    // Top brand
    ctx.fillStyle    = 'rgba(200,150,90,0.65)';
    ctx.font         = '500 22px "Noto Serif TC", serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('Phinn-Phang  scent lab', size/2, 60);

    // Divider
    ctx.beginPath();
    ctx.moveTo(size/2 - 80, 98);
    ctx.lineTo(size/2 + 80, 98);
    ctx.strokeStyle = 'rgba(200,150,90,0.3)';
    ctx.lineWidth   = 0.8;
    ctx.stroke();

    // Work name
    ctx.fillStyle    = '#F5EFE6';
    ctx.font         = '300 80px "Noto Serif TC", serif';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText(work.workName, size/2, 130);

    // Student name
    ctx.fillStyle = 'rgba(245,239,230,0.45)';
    ctx.font      = '300 22px "Noto Serif TC", serif';
    ctx.fillText(work.studentName + '  ·  ' + (work.courseDate || ''), size/2, 240);

    // Radar chart (center)
    drawRadarOnCanvas(ctx, size/2, 520, 190, computeRadar(work.formula), { font: '18px "Noto Serif TC", serif' });

    // AI description (bottom)
    const desc   = work.aiDescription || '';
    const words  = desc.split('');
    const maxW   = 640;
    const lineH  = 36;
    let line = '', lines = [], y = 760;
    ctx.font = '300 20px "Noto Serif TC", serif';
    for (const ch of words) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxW) { lines.push(line); line = ch; }
      else line = test;
    }
    if (line) lines.push(line);
    ctx.fillStyle    = 'rgba(245,239,230,0.5)';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'top';
    lines.slice(0, 4).forEach((l, i) => ctx.fillText(l, size/2, y + i * lineH));

    // Bottom brand
    ctx.fillStyle = 'rgba(200,150,90,0.4)';
    ctx.font      = '300 16px "Noto Serif TC", serif';
    ctx.fillText('聞香 · Phinn-Phang scent lab', size/2, size - 56);

    return canvas;
  }

  // ── Public API ────────────────────────────────────────────────────────────
  return {
    FAMILIES, KEYS, DEFAULT_SETTINGS, RESERVATION_STATUSES,
    getSettings, saveSettings,
    getCourses, saveCourse, deleteCourse, getCourseById,
    getWorks, saveWork,
    getBookableCourses, getPublishedWorks,
    getReservations, saveReservation, deleteReservation,
    getCourseByToken, getWorkById,
    genId, genToken,
    computeRadar,
    syncWorkToSheet,
    generateWorkImage,
  };
})();
