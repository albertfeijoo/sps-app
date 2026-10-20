'use strict';
/* =====================================================================
   San Peregrino Squirt · núcleo: datos locales, sincronización y sesión
   ===================================================================== */
const CFG = window.SPS_CONFIG || {};
const REMOTE = !!(CFG.url && CFG.key);
let sb = null;

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => (o === undefined ? null : JSON.parse(JSON.stringify(o)));
const uuid = () => (crypto.randomUUID ? crypto.randomUUID() :
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }));
const pad = n => String(n).padStart(2, '0');
const isoDay = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
const hhmm = (d = new Date()) => pad(d.getHours()) + ':' + pad(d.getMinutes());
const parseDay = s => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtDay = (s, o = { weekday: 'short', day: 'numeric', month: 'short' }) => { const d = parseDay(s); return d ? d.toLocaleDateString('es-ES', o) : ''; };
const fmtStamp = iso => { if (!iso) return ''; const d = new Date(iso); return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }) + ' · ' + hhmm(d); };
const mmss = s => { s = Math.max(0, Math.round(s || 0)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + pad(m) : m) + ':' + pad(x); };
const parseDur = t => { if (!t) return 0; const p = String(t).trim().split(':').map(Number); if (p.some(isNaN)) return 0; return p.length === 1 ? p[0] * 60 : p.reduce((a, b) => a * 60 + b, 0); };
function deepSet(obj, path, val) {
  if (!path.length) return val;
  let o = obj;
  for (let i = 0; i < path.length - 1; i++) {
    const k = path[i];
    if (o[k] === null || typeof o[k] !== 'object' || Array.isArray(o[k])) o[k] = {};
    o = o[k];
  }
  o[path[path.length - 1]] = val;
  return obj;
}
const deepGet = (obj, path) => path.reduce((o, k) => (o == null ? undefined : o[k]), obj);
const isNetErr = e => !navigator.onLine || /fetch|network|load failed|timeout|aborted|NetworkError|JWT|401/i.test((e && (e.message || e.error_description || e.code)) || String(e));
const errMsg = e => (e && (e.message || e.error_description)) || String(e);

/* ---------- IndexedDB (copia local) ---------- */
const DB = {
  db: null, ok: false,
  open() {
    return new Promise(res => {
      let r;
      try { r = indexedDB.open('sps', 1); } catch (e) { return res(); }
      r.onupgradeneeded = () => {
        const d = r.result;
        d.createObjectStore('items', { keyPath: 'id' });
        d.createObjectStore('outbox', { keyPath: 'seq', autoIncrement: true });
        d.createObjectStore('blobs');
        d.createObjectStore('meta');
        d.createObjectStore('hist', { keyPath: 'seq', autoIncrement: true });
      };
      r.onsuccess = () => { this.db = r.result; this.ok = true; res(); };
      r.onerror = () => res();
    });
  },
  tx(store, mode, fn) {
    if (!this.ok) return Promise.resolve(undefined);
    return new Promise((res, rej) => {
      const t = this.db.transaction(store, mode); const s = t.objectStore(store); let out;
      const r = fn(s); if (r) r.onsuccess = () => { out = r.result; };
      t.oncomplete = () => res(out); t.onerror = () => rej(t.error); t.onabort = () => rej(t.error);
    });
  },
  get(st, k) { return this.tx(st, 'readonly', s => s.get(k)); },
  all(st) { return this.tx(st, 'readonly', s => s.getAll()).then(r => r || []); },
  put(st, v, k) { return this.tx(st, 'readwrite', s => (k === undefined ? s.put(v) : s.put(v, k))); },
  del(st, k) { return this.tx(st, 'readwrite', s => s.delete(k)); },
  clear(st) { return this.tx(st, 'readwrite', s => s.clear()); },
  putMany(st, arr) { return this.tx(st, 'readwrite', s => { arr.forEach(v => s.put(v)); }); }
};

/* ---------- estado ---------- */
const S = {
  items: new Map(),
  outbox: [],            // copia en memoria de la cola de envíos
  me: { uid: null, email: '', role: 'admin', member_id: null },
  accounts: [],          // band_members (user_id → member_id)
  online: navigator.onLine,
  syncing: false,
  lastError: null
};
const isAdmin = () => S.me.role === 'admin';
const live = i => i && !i.deleted_at;
const get = id => { const i = S.items.get(id); return live(i) ? i : null; };
const all = type => [...S.items.values()].filter(i => i.type === type && live(i));
const trash = () => [...S.items.values()].filter(i => i.deleted_at);
const settings = () => all('settings')[0] || null;

/* ---------- operaciones (local primero, luego nube) ---------- */
let onChange = () => {};          // la interfaz se registra aquí
function persist(it) { DB.put('items', it).catch(() => {}); }

async function enqueue(op) {
  if (!REMOTE) return;
  try { const seq = await DB.put('outbox', op); op.seq = seq; } catch (e) { op.seq = Date.now() + Math.random(); }
  S.outbox.push(op);
  scheduleFlush(300);
  onChange('sync');
}

function localHist(it, action) {
  if (REMOTE) return;
  const last = localHist.last[it.id];
  if (action === 'edit' && last && Date.now() - last < 600000) return;
  localHist.last[it.id] = Date.now();
  DB.put('hist', { item_id: it.id, type: it.type, action, data: clone(it.data), changed_by: S.me.uid, changed_at: new Date().toISOString() }).catch(() => {});
}
localHist.last = {};

async function createItem(type, data, id = uuid()) {
  const now = new Date().toISOString();
  const it = { id, type, data: clone(data), created_by: S.me.uid, created_at: now, updated_by: S.me.uid, updated_at: now, deleted_at: null };
  S.items.set(id, it); persist(it); localHist(it, 'create');
  await enqueue({ op: 'create', id, type, data: clone(data) });
  onChange('local');
  return id;
}
async function setField(id, path, value, { render = false } = {}) {
  const it = S.items.get(id); if (!it) return;
  localHist(it, 'edit');
  deepSet(it.data, path, clone(value));
  it.updated_at = new Date().toISOString(); it.updated_by = S.me.uid;
  persist(it);
  await enqueue({ op: 'set', id, path, value: clone(value) });
  if (render) onChange('local');
}
async function trashItem(id) {
  const it = S.items.get(id); if (!it) return;
  localHist(it, 'delete');
  it.deleted_at = new Date().toISOString(); it.deleted_by = S.me.uid; persist(it);
  await enqueue({ op: 'del', id });
  onChange('local');
}
async function restoreItem(id) {
  const it = S.items.get(id); if (!it) return;
  localHist(it, 'restore');
  it.deleted_at = null; persist(it);
  await enqueue({ op: 'restore', id });
  onChange('local');
}
async function purgeItem(id) {
  const it = S.items.get(id); if (!it) return;
  const paths = [];
  if (it.data.path) paths.push(it.data.path);
  JSON.stringify(it.data).replace(/"path":"(img\/[^"]+)"/g, (m, p) => { paths.push(p); return m; });
  S.items.delete(id); DB.del('items', id).catch(() => {});
  if (it.data.blob) DB.del('blobs', it.data.blob).catch(() => {});
  if (!REMOTE) DB.put('hist', { item_id: id, type: it.type, action: 'purge', data: it.data, changed_by: S.me.uid, changed_at: new Date().toISOString() }).catch(() => {});
  await enqueue({ op: 'purge', id, paths });
  onChange('local');
}
// Archivo (audio o imagen): se guarda en el móvil y se sube cuando haya conexión
async function storeFile(key, blob, path, item) {
  await DB.put('blobs', blob, key).catch(() => {});
  blobCache.set(key, blob);
  await enqueue({ op: 'upload', key, path, mime: blob.type, item: item || null });
}

/* ---------- archivos ---------- */
const blobCache = new Map();
const urlCache = new Map();
async function getBlob(key, path) {
  if (blobCache.has(key)) return blobCache.get(key);
  let b = await DB.get('blobs', key).catch(() => null);
  if (!b && REMOTE && path && sb) {
    const { data, error } = await sb.storage.from('media').download(path);
    if (error) throw error;
    b = data;
    if (b && b.size < 40e6) DB.put('blobs', b, key).catch(() => {});
  }
  if (b) blobCache.set(key, b);
  return b || null;
}
async function getUrl(key, path) {
  if (urlCache.has(key)) return urlCache.get(key);
  const b = await getBlob(key, path); if (!b) return null;
  const u = URL.createObjectURL(b); urlCache.set(key, u); return u;
}
const isLocalOnly = key => S.outbox.some(o => o.op === 'upload' && o.key === key);

/* ---------- sincronización ---------- */
let flushTimer = null, flushing = false;
function scheduleFlush(ms = 1000) { clearTimeout(flushTimer); flushTimer = setTimeout(flush, ms); }

async function sendOp(o) {
  const T = sb.from('items');
  let r;
  switch (o.op) {
    case 'create': r = await T.insert({ id: o.id, type: o.type, data: o.data }); if (r.error && r.error.code === '23505') r.error = null; break;
    case 'set': r = await sb.rpc('set_field', { p_id: o.id, p_path: o.path, p_value: o.value ?? null }); break;
    case 'del': r = await T.update({ deleted_at: new Date().toISOString() }).eq('id', o.id); break;
    case 'restore': r = await T.update({ deleted_at: null }).eq('id', o.id); break;
    case 'purge':
      if (o.paths && o.paths.length) await sb.storage.from('media').remove(o.paths);
      r = await T.delete().eq('id', o.id); break;
    case 'upload': {
      const blob = await DB.get('blobs', o.key).catch(() => null) || blobCache.get(o.key);
      if (!blob) return;
      r = await sb.storage.from('media').upload(o.path, blob, { upsert: true, contentType: o.mime || blob.type });
      if (!r.error && o.item) {
        const it = S.items.get(o.item);
        if (it) { it.data.uploaded = true; persist(it); }
        r = await sb.rpc('set_field', { p_id: o.item, p_path: ['uploaded'], p_value: true });
      }
      break;
    }
  }
  if (r && r.error) throw r.error;
}
async function flush() {
  if (!REMOTE || !sb || flushing || !S.me.uid || !S.me.member) return;
  if (!navigator.onLine) { onChange('sync'); return; }
  flushing = true; S.syncing = true; onChange('sync');
  try {
    while (S.outbox.length) {
      const o = S.outbox[0];
      try {
        await sendOp(o);
      } catch (e) {
        if (isNetErr(e)) { S.lastError = 'Sin conexión: se enviará más tarde'; scheduleFlush(15000); break; }
        // Error de permisos o de datos: se descarta el cambio y se recupera lo que hay en la nube
        console.warn('Cambio rechazado', o, e);
        toastSafe('No se pudo guardar: ' + errMsg(e));
        if (o.id) refetch(o.id);
      }
      S.outbox.shift();
      await DB.del('outbox', o.seq).catch(() => {});
      S.lastError = null;
    }
  } finally {
    flushing = false; S.syncing = false; onChange('sync');
  }
}
function toastSafe(m) { try { window.toast && window.toast(m); } catch (e) {} }

function reapplyPending(it) {
  for (const o of S.outbox) {
    if (o.id !== it.id) continue;
    if (o.op === 'set') deepSet(it.data, o.path, clone(o.value));
    if (o.op === 'del') it.deleted_at = it.deleted_at || new Date().toISOString();
    if (o.op === 'restore') it.deleted_at = null;
  }
  return it;
}
async function refetch(id) {
  const { data } = await sb.from('items').select('*').eq('id', id).maybeSingle();
  if (data) { S.items.set(id, reapplyPending(data)); persist(data); }
  else { S.items.delete(id); DB.del('items', id).catch(() => {}); }
  onChange('remote');
}
async function pullAll() {
  let rows = [], from = 0;
  for (;;) {
    const { data, error } = await sb.from('items').select('*').order('created_at').range(from, from + 999);
    if (error) throw error;
    rows = rows.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }
  const map = new Map(rows.map(r => [r.id, r]));
  for (const o of S.outbox) if (o.op === 'create' && !map.has(o.id) && S.items.has(o.id)) map.set(o.id, S.items.get(o.id));
  for (const it of map.values()) reapplyPending(it);
  S.items = map;
  await DB.clear('items').catch(() => {});
  await DB.putMany('items', [...map.values()]).catch(() => {});
  await DB.put('meta', Date.now(), 'lastPull').catch(() => {});
  onChange('remote');
}
async function pullAccounts() {
  const { data } = await sb.from('band_members').select('user_id,member_id,display_name,role');
  if (data) { S.accounts = data; DB.put('meta', data, 'accounts').catch(() => {}); }
}
let channel = null;
function subscribe() {
  if (channel) return;
  channel = sb.channel('sps-items')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'items' }, p => {
      if (p.eventType === 'DELETE') { const id = p.old && p.old.id; if (id) { S.items.delete(id); DB.del('items', id).catch(() => {}); } }
      else { const row = reapplyPending(p.new); S.items.set(row.id, row); persist(row); if (row.type === 'member') pullAccounts(); }
      onChange('remote');
    })
    .subscribe();
}

/* ---------- quién es quién ---------- */
function memberOfUser(uid) {
  if (!REMOTE) return get(S.me.member_id);
  const a = S.accounts.find(x => x.user_id === uid);
  return a ? S.items.get(a.member_id) || null : null;
}
function whoName(uid) {
  if (!uid) return 'Alguien';
  const m = memberOfUser(uid);
  if (m) return m.data.name || 'Sin nombre';
  const a = S.accounts.find(x => x.user_id === uid);
  return (a && a.display_name) || 'Antiguo miembro';
}

/* ---------- historial ---------- */
async function itemHistory(id) {
  if (REMOTE) {
    const { data, error } = await sb.from('item_history').select('*').eq('item_id', id).order('changed_at', { ascending: false }).limit(40);
    if (error) throw error; return data;
  }
  return (await DB.all('hist')).filter(h => h.item_id === id).reverse().slice(0, 40);
}
async function activity() {
  if (REMOTE) {
    const { data, error } = await sb.from('item_history').select('id,item_id,type,action,changed_by,changed_at,title:data->>title,name:data->>name,venue:data->>venue,date:data->>date,text:data->>text').order('changed_at', { ascending: false }).limit(120);
    if (error) throw error; return data;
  }
  return (await DB.all('hist')).reverse().slice(0, 120).map(h => ({ ...h, ...(h.data || {}) }));
}
async function restoreVersion(id, data) {
  const it = S.items.get(id); if (!it) return;
  // Se restaura campo a campo para no pisar la estructura
  for (const k of new Set([...Object.keys(it.data), ...Object.keys(data || {})])) {
    if (JSON.stringify(it.data[k]) !== JSON.stringify(data[k])) await setField(id, [k], data[k] === undefined ? null : data[k]);
  }
  onChange('local');
}

/* ---------- arranque y sesión ---------- */
async function loadLocal() {
  await DB.open();
  const items = await DB.all('items');
  S.items = new Map(items.map(i => [i.id, i]));
  S.outbox = (await DB.all('outbox')).sort((a, b) => a.seq - b.seq);
  S.accounts = (await DB.get('meta', 'accounts').catch(() => null)) || [];
}
async function cachedStatus() { return (await DB.get('meta', 'status').catch(() => null)) || null; }

async function ensureLocalBand() {
  S.me = { uid: 'local', email: '', role: 'admin', member_id: null, member: true };
  let me = all('member')[0];
  if (!me) { const id = await createItem('member', { name: 'Yo', roles: [], color: '#2FE3CB', guest: false }); me = S.items.get(id); }
  S.me.member_id = me.id;
  if (!settings()) await createItem('settings', { band_name: 'San Peregrino Squirt' });
}

async function startSync() {
  try { await pullAccounts(); } catch (e) {}
  try { await pullAll(); } catch (e) { console.warn(e); }
  subscribe();
  flush();
}

window.addEventListener('online', () => { S.online = true; onChange('sync'); scheduleFlush(500); if (REMOTE && sb && S.me.member) pullAll().catch(() => {}); });
window.addEventListener('offline', () => { S.online = false; onChange('sync'); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && REMOTE && sb && S.me.member && navigator.onLine) { flush(); pullAll().catch(() => {}); }
});
setInterval(() => { if (S.outbox.length) flush(); }, 30000);
