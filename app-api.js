// app-api.js — Phinn-Phang Apps Script Web App layer
// Loaded after app-data.js. Attaches to window.PP.api namespace.
//
// Backend: Google Apps Script Web App
//   - GET  ?action=<name>&...        → reads
//   - POST { action, ...payload }     → writes  (Content-Type: text/plain to skip CORS preflight)
//
// Network failures resolve to thrown errors; callers catch and decide UX.

(function () {
  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxvIO_B0slmYfoCFsP4EgNbLRqqjsDav0SI6UEBkcG4U4gFkpdgkE-cgMimIlImAc6-7g/exec';
  const TIMEOUT_MS = 5000;

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms)),
    ]);
  }

  async function get(action, params = {}) {
    const url = new URL(ENDPOINT);
    url.searchParams.set('action', action);
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
    const res = await withTimeout(fetch(url.toString()), TIMEOUT_MS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.ok === false) throw new Error(data.error || 'api error');
    return data;
  }

  async function post(action, body) {
    // text/plain avoids CORS preflight; Apps Script reads via e.postData.contents
    const res = await withTimeout(fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...body }),
    }), TIMEOUT_MS);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.ok === false) throw new Error(data.error || 'api error');
    return data;
  }

  PP.api = {
    ENDPOINT,

    // Health check
    ping()               { return get('ping'); },

    // Reads
    getAllCourses()      { return get('getAllCourses'); },
    getAllReservations() { return get('getAllReservations'); },
    getAllWorks()        { return get('getAllWorks'); },
    getAllSettings()     { return get('getAllSettings'); },

    // Writes
    addCourse(data)             { return post('addCourse',         { data }); },
    updateCourse(id, data)      { return post('updateCourse',      { id, data }); },
    deleteCourse(id)            { return post('deleteCourse',      { id }); },
    addReservation(data)        { return post('addReservation',    { data }); },
    updateReservation(id, data) { return post('updateReservation', { id, data }); },
    deleteReservation(id)       { return post('deleteReservation', { id }); },
    addWork(data)               { return post('addWork',           { data }); },
    updateSetting(key, value)   { return post('updateSetting',     { key, value }); },
  };
})();
