'use strict';
/* =====================================================================
   San Peregrino Squirt · interfaz
   ===================================================================== */
const STATUS = ['Idea', 'En construcción', 'Casi lista', 'Lista para directo', 'Aparcada'];
const ROLES = ['Guitarra 1', 'Guitarra 2', 'Bajo', 'Batería', 'Voz', 'Coros', 'Teclado', 'Percusión'];
const PART_NAMES = ['Intro', 'Estrofa', 'Pre', 'Estribillo', 'Puente', 'Solo', 'Break', 'Outro'];
const DEFAULT_TAGS = ['Canción entera', 'Solo', 'Riff', 'Cambio de batería', 'Idea nueva', 'Toma buena', 'Letra', 'Estructura'];
const DEFAULT_GEAR = ['Cables jack', 'Cables XLR', 'Pedalera y alimentador', 'Afinador', 'Púas', 'Cuerdas de repuesto', 'Baquetas', 'Pilas 9 V', 'Regleta', 'Setlist impreso', 'Agua'];
const COLORS = ['#2FE3CB', '#F2B84B', '#FF7A6B', '#9B8CFF', '#6EC1FF', '#B6E35A', '#FF8AD1', '#E8E2D6'];
const INST = [
  { k: 'g1', name: 'Guitarra 1', short: 'Guitarra 1', role: 'Guitarra 1', fields: [['riffs', 'Riffs', 'tab'], ['chords', 'Acordes por parte', 'tab'], ['tabs', 'Tablaturas', 'tab'], ['solos', 'Solos', 'tab'], ['fx', 'Efectos y pedales (qué y en qué parte)', 'text'], ['capo', 'Cejilla', 'line'], ['tuning', 'Afinación, si cambia', 'line']] },
  { k: 'g2', name: 'Guitarra 2', short: 'Guitarra 2', role: 'Guitarra 2', optional: true, fields: [['riffs', 'Riffs', 'tab'], ['chords', 'Acordes por parte', 'tab'], ['tabs', 'Tablaturas', 'tab'], ['solos', 'Solos', 'tab'], ['fx', 'Efectos y pedales (qué y en qué parte)', 'text'], ['capo', 'Cejilla', 'line'], ['tuning', 'Afinación, si cambia', 'line']] },
  { k: 'bass', name: 'Bajo', short: 'Bajo', role: 'Bajo', fields: [['lines', 'Líneas de bajo', 'tab'], ['tabs', 'Tablaturas', 'tab'], ['notes', 'Notas por parte', 'text']] },
  { k: 'drums', name: 'Batería', short: 'Batería', role: 'Batería', fields: [['grooves', 'Grooves por parte', 'tab'], ['fills', 'Fills', 'text'], ['changes', 'Cambios', 'text'], ['dynamics', 'Dinámica', 'text'], ['cues', 'Entradas y cortes', 'text'], ['click', 'Click', 'select', ['', 'Con click', 'Sin click']]] },
  { k: 'voice', name: 'Voz', short: 'Voz', role: 'Voz', fields: [['lyrics', 'Letra (por partes)', 'lyrics'], ['backing', 'Coros', 'text'], ['harmonies', 'Armonías (quién las hace)', 'text'], ['key', 'Tonalidad cómoda', 'line'], ['notes', 'Notas de interpretación', 'text']] },
  { k: 'guest', name: 'Invitado', short: 'Invitado', role: null, optional: true, guest: true, fields: [['instrument', 'Instrumento', 'line'], ['parts', 'Partes', 'text'], ['sheet', 'Partitura o tablatura', 'tab'], ['notes', 'Notas', 'text']] }
];
const SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const INST_ICON = {
  mic: SVG_OPEN + '<rect x="9" y="2.5" width="6" height="11" rx="3"/><path d="M9 6.5h2.2M9 9.5h2.2"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0"/><path d="M12 17.5V21M8.5 21h7"/></svg>',
  guitar: SVG_OPEN + '<g transform="rotate(40 12 12) translate(12 12) scale(.92) translate(-12 -12.6)"><path d="M9.33 14.76A3.2 3.2 0 1 1 14.67 14.76A4.2 4.2 0 1 1 9.33 14.76Z"/><circle cx="12" cy="15.4" r="1.15"/><path d="M10.6 19.3h2.8"/><path d="M12 9.8V3.6"/><rect x="10.9" y="0.6" width="2.2" height="3" rx=".6"/></g></svg>',
  bass: SVG_OPEN + '<g transform="rotate(40 12 12) translate(12 12) scale(.9) translate(-12 -12.4)"><path d="M11 13.2 9.4 10c-.3-.7.6-1.1 1-.5l1.2 1.6h1.6l.8-1.1c.4-.5 1.2-.2 1 .4l-.9 2.6c1.6 1 2.3 2.8 2 4.6-.4 2.6-2.3 4.4-4.4 4.4-2.4 0-4.4-2-4.4-4.6 0-1.7.9-3.2 2.4-4.1z"/><path d="M12 11V1.2"/><path d="M12 2.2h-1.3M12 3.8h-1.3M12 2.2h1.3M12 3.8h1.3"/><path d="M10.5 15.4h3M10.8 17.6h2.4"/></g></svg>',
  drums: SVG_OPEN + '<ellipse cx="12" cy="13" rx="8" ry="3"/><path d="M4 13v5c0 1.7 3.6 3 8 3s8-1.3 8-3v-5"/><path d="M8 15.8v4.6M16 15.8v4.6M12 16v5"/><path d="M5 3.5l7 6.5M19 3.5l-7 6.5"/></svg>'
};
const ROLE_ICON = { 'Voz': 'mic', 'Coros': 'mic', 'Guitarra 1': 'guitar', 'Guitarra 2': 'guitar', 'Bajo': 'bass', 'Batería': 'drums' };
const ICON_LABEL = { mic: 'Voz', guitar: 'Guitarra', bass: 'Bajo', drums: 'Batería' };
const roleIcons = m => [...new Set((m.data.roles || []).map(r => ROLE_ICON[r]).filter(Boolean))];
const TYPE_LABEL = { song: 'Tema', recording: 'Grabación', rehearsal: 'Ensayo', gig: 'Concierto', setlist: 'Setlist', task: 'Deber', member: 'Miembro', settings: 'Ajustes' };
const ACTION_LABEL = { create: 'creó', edit: 'editó', delete: 'mandó a la papelera', restore: 'restauró', purge: 'borró para siempre' };

const app = $('#app'), nav = $('#nav'), fab = $('#fab'), layer = $('#layer'), stageEl = $('#stage'), recEl = $('#rec');
let V = { name: 'home', depth: 0 };
let authMode = null;

/* ---------- ayudas de datos ---------- */
const members = (withFormer = false) => all('member').filter(m => withFormer || !m.data.former)
  .sort((a, b) => (a.data.guest ? 1 : 0) - (b.data.guest ? 1 : 0) || mName(a).localeCompare(mName(b)));
const songsSorted = () => all('song').sort((a, b) => (a.data.title || '').localeCompare(b.data.title || '', 'es'));
const tagsAll = () => { const s = settings(); const base = (s && s.data.tags && s.data.tags.length) ? s.data.tags : DEFAULT_TAGS; const used = new Set(base); all('recording').forEach(r => (r.data.tags || []).forEach(t => used.add(t))); return [...used]; };
const gearAll = () => { const s = settings(); return (s && s.data.gear && s.data.gear.length) ? s.data.gear : DEFAULT_GEAR; };
const openRehearsal = () => all('rehearsal').find(r => r.data.open);
const recsOf = (pred) => all('recording').filter(pred).sort((a, b) => (b.data.recorded_at || '').localeCompare(a.data.recorded_at || ''));
function songStats(id) {
  const rs = all('rehearsal').filter(r => (r.data.songs || []).includes(id)).map(r => r.data.date).filter(Boolean).sort();
  return { count: rs.length, last: rs[rs.length - 1] || null };
}
const instOn = (song, def) => { const o = deepGet(song.data, ['inst', def.k, 'on']); return def.optional ? o === true : o !== false; };
function itemTitle(it) {
  if (!it) return '';
  const d = it.data || {};
  if (it.type === 'rehearsal') return 'Ensayo del ' + fmtDay(d.date, { day: 'numeric', month: 'short', year: 'numeric' });
  if (it.type === 'gig') return (d.venue || 'Concierto') + (d.date ? ' · ' + fmtDay(d.date, { day: 'numeric', month: 'short' }) : '');
  if (it.type === 'task') return d.text || 'Deber';
  if (it.type === 'settings') return 'Ajustes del grupo';
  return d.title || d.alias || d.name || 'Sin título';
}
const initials = n => (n || '?').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
const avatar = m => (m && m.data.photo && m.data.photo.key)
  ? `<span class="av" style="background-color:${esc(m.data.color || '#888')}" data-bg="${m.data.photo.key}|${esc(m.data.photo.path)}"></span>`
  : `<span class="av" style="background-color:${esc((m && m.data.color) || '#888')}">${esc(initials(mName(m)))}</span>`;
const durOf = song => parseDur(song && song.data.duration);

/* ---------- capa de hojas, avisos y confirmaciones ---------- */
const sheets = [];
function sheet(html, opts = {}) {
  const sc = document.createElement('div'); sc.className = 'scrim';
  sc.innerHTML = `<div class="sheet" role="dialog" aria-modal="true"><div class="grab"></div>${html}</div>`;
  sc.addEventListener('click', e => { if (e.target === sc) closeSheet(); });
  layer.appendChild(sc); sheets.push({ el: sc, opts });
  return sc.querySelector('.sheet');
}
function closeSheet() {
  const s = sheets.pop(); if (!s) return false;
  flushFields();
  s.el.remove(); if (s.opts.onClose) s.opts.onClose();
  return true;
}
function closeAllSheets() { while (sheets.length) closeSheet(); }
let toastT;
function toast(m) {
  clearTimeout(toastT); let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
  t.textContent = m; toastT = setTimeout(() => t.remove(), 2600);
}
window.toast = toast;
let cfResolve = null;
function confirmBox(msg, ok = 'Borrar', danger = true, extra = '') {
  return new Promise(res => {
    cfResolve = res;
    sheet(`<h3>${msg}</h3>${extra}<div class="row"><button class="btn ${danger ? 'danger' : 'pri'}" data-a="cf-ok">${ok}</button><button class="btn ghost" data-a="cf-no">Cancelar</button></div>`,
      { onClose: () => { if (cfResolve) { const r = cfResolve; cfResolve = null; r(false); } } });
  });
}
function askText(title, label, value = '', ok = 'Crear') {
  return new Promise(res => {
    let done = false;
    const sh = sheet(`<h3>${esc(title)}</h3><form class="stack" id="askf"><label class="field"><span>${esc(label)}</span><input id="askin" value="${esc(value)}" autocomplete="off"></label><button class="btn pri" type="submit">${esc(ok)}</button></form>`,
      { onClose: () => { if (!done) res(null); } });
    const inp = $('#askin', sh); setTimeout(() => inp.focus(), 60);
    $('#askf', sh).addEventListener('submit', e => { e.preventDefault(); done = true; const v = inp.value.trim(); closeSheet(); res(v || null); });
  });
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); toast('Copiado'); }
  catch (e) { sheet(`<h3>Copia este texto</h3><textarea readonly id="cpt">${esc(t)}</textarea><button class="btn" data-a="close">Listo</button>`); const x = $('#cpt'); x.focus(); x.select(); }
}

/* ---------- navegación ---------- */
const MAIN = ['home', 'songs', 'rehearsals', 'live', 'band'];
function go(view, mode = 'push') {
  flushFields(); Metro.stop();
  if (MAIN.includes(view.name)) { view.depth = 0; V = view; history.replaceState(V, ''); }
  else if (mode === 'replace') { view.depth = V.depth; V = view; history.replaceState(V, ''); }
  else { view.depth = (V.depth || 0) + 1; V = view; history.pushState(V, ''); }
  lastKey = null; render(); window.scrollTo(0, 0);
}
function goBack() {
  if (V.depth > 0) history.back();
  else go({ name: V.back || 'home' });
}
window.addEventListener('popstate', e => {
  if (!stageEl.hidden) { closeStage(); history.pushState(V, ''); return; }
  if (sheets.length) { closeSheet(); history.pushState(V, ''); return; }
  flushFields(); Metro.stop();
  V = e.state || { name: 'home', depth: 0 }; lastKey = null; render();
});
const parentOf = v => ({ song: 'songs', rehearsal: 'rehearsals', gig: 'live', setlist: 'live', trash: 'band', activity: 'band', member: 'band' }[v.name] || 'home');

/* ---------- edición de campos (se guarda sola) ---------- */
const pendingFields = new Map();
function fieldValue(el) {
  if (el.type === 'checkbox') return el.checked;
  if ('num' in el.dataset) { const v = el.value.trim().replace(',', '.'); return v === '' ? null : Number(v); }
  return el.value;
}
function commitField(key, elArg) {
  const p = pendingFields.get(key); const el = elArg || (p && p.el);
  if (p) clearTimeout(p.t); pendingFields.delete(key);
  if (!el) return;
  const i = key.indexOf('|'); const id = key.slice(0, i), path = key.slice(i + 1).split('.');
  const rerender = 'r' in el.dataset;
  setField(id, path, fieldValue(el));
  if (rerender) { if (el.tagName === 'SELECT' || el.type === 'checkbox') el.blur(); setTimeout(() => onChange('local'), 0); }
}
function flushFields() { [...pendingFields.keys()].forEach(k => commitField(k)); flushParts(); }
document.addEventListener('input', e => {
  const el = e.target;
  if (el.id === 'songq') return filterSongs(el.value);
  if (el.dataset.p) return partInput(el);
  if (!el.dataset.f) return;
  const key = el.dataset.f; const p = pendingFields.get(key); if (p) clearTimeout(p.t);
  pendingFields.set(key, { el, t: setTimeout(() => commitField(key), 700) });
});
document.addEventListener('change', e => {
  const el = e.target;
  if (el.dataset.f) return commitField(el.dataset.f, el);
  if (el.dataset.ch) return CHANGE[el.dataset.ch] && CHANGE[el.dataset.ch](el);
  if (el.dataset.img) return addImage(el);
});
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushFields(); });

// Estructura de la canción: se guarda la lista entera
let partsTimer = null, partsSong = null;
function partInput(el) {
  const [idx, f] = el.dataset.p.split(':'); const song = S.items.get(V.id); if (!song) return;
  song.data.parts = song.data.parts || [];
  if (!song.data.parts[idx]) return;
  song.data.parts[idx][f] = f === 'bars' ? (el.value === '' ? null : Number(el.value)) : el.value;
  partsSong = song.id; clearTimeout(partsTimer); partsTimer = setTimeout(flushParts, 700);
}
function flushParts() {
  clearTimeout(partsTimer);
  if (!partsSong) return; const s = S.items.get(partsSong); partsSong = null;
  if (s) setField(s.id, ['parts'], s.data.parts || []);
}

/* ---------- render ---------- */
let pendingRender = false, lastKey = null;
function isEditing() {
  const a = document.activeElement;
  return a && app.contains(a) && a.matches('input:not([type=checkbox]):not([type=range]):not([type=color]):not([type=file]),textarea');
}
document.addEventListener('focusout', e => {
  if (!pendingRender) return;
  const nx = e.relatedTarget;
  if (nx && nx.matches && nx.matches('input,textarea')) return;
  setTimeout(() => { if (!isEditing()) render(); }, 30);
});
function render() {
  if (authMode) return;
  if (isEditing()) { pendingRender = true; return; }
  pendingRender = false;
  const key = JSON.stringify([V.name, V.id, V.tab, V.sub]); const y = window.scrollY;
  const fn = VIEWS[V.name] || VIEWS.home;
  let html;
  try { html = fn(V); } catch (e) { console.error(e); html = topBar('Algo ha fallado', true) + `<p class="err">${esc(e.message)}</p>`; }
  app.innerHTML = html;
  hydrate();
  renderNav();
  if (key === lastKey) window.scrollTo(0, y);
  lastKey = key;
}
function handleChange(kind) {
  if (kind === 'sync') { updateSync(); return; }
  render();
  if (kind === 'remote') refreshSheets();
}
function refreshSheets() {
  const s = sheets[sheets.length - 1];
  if (s && s.opts.refresh && !(document.activeElement && s.el.contains(document.activeElement) && document.activeElement.matches('input,textarea'))) s.opts.refresh();
}

/* ---------- barra inferior ---------- */
const ICONS = {
  home: '<svg viewBox="0 0 24 24"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/></svg>',
  songs: '<svg viewBox="0 0 24 24"><path d="M9 18V6l11-2v12"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/></svg>',
  rehearsals: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M8 14h3M8 17h6"/></svg>',
  live: '<svg viewBox="0 0 24 24"><path d="M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3z"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/></svg>',
  band: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A5 5 0 0 1 21 19"/></svg>'
};
const TABS = [['home', 'Inicio'], ['songs', 'Temas'], ['rehearsals', 'Ensayos'], ['live', 'Directo'], ['band', 'Grupo']];
function renderNav() {
  const cur = MAIN.includes(V.name) ? V.name : parentOf(V);
  nav.innerHTML = TABS.map(([k, l]) => `<button data-a="tab" data-v="${k}" ${k === cur ? 'aria-current="page"' : ''}>${ICONS[k]}${l}</button>`).join('');
  nav.hidden = false;
  fab.hidden = !['home', 'songs', 'song', 'rehearsals', 'rehearsal', 'gig'].includes(V.name);
}
function syncBadge() {
  if (!REMOTE) return `<span class="sync"><i></i>Modo prueba</span>`;
  const n = S.outbox.length;
  if (!navigator.onLine) return `<span class="sync off"><i></i>Sin conexión${n ? ' · ' + n : ''}</span>`;
  if (n) return `<span class="sync pend"><i></i>${S.syncing ? 'Enviando' : 'Pendiente'} · ${n}</span>`;
  return `<span class="sync ok"><i></i>Al día</span>`;
}
function updateSync() { $$('.sync').forEach(el => { el.outerHTML = syncBadge(); }); const p = $('#pendinfo'); if (p) p.textContent = pendText(); }
const pendText = () => S.outbox.length ? `${S.outbox.length} cambio(s) pendiente(s) de enviar` : 'Todo enviado';
function topBar(title, back = true) {
  return `<header class="top">${back ? `<button class="back" data-a="back" aria-label="Volver">‹</button>` : ''}<h1>${esc(title)}</h1>${syncBadge()}</header>`;
}

/* ---------- vistas ---------- */
const VIEWS = {};

VIEWS.home = () => {
  const today = isoDay();
  const open = openRehearsal();
  const nextR = all('rehearsal').filter(r => !r.data.open && (r.data.date || '') >= today).sort((a, b) => (a.data.date + a.data.time).localeCompare(b.data.date + b.data.time))[0];
  const nextG = all('gig').filter(g => (g.data.date || '') >= today).sort((a, b) => a.data.date.localeCompare(b.data.date))[0];
  const tasks = all('task').filter(t => !t.data.done).sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
  const recs = recsOf(() => true).slice(0, 5);
  const ready = songsSorted().filter(s => s.data.status === 'Lista para directo').map(s => ({ s, st: songStats(s.id) }))
    .filter(x => !x.st.last || (Date.now() - parseDay(x.st.last)) / 864e5 > 21)
    .sort((a, b) => (a.st.last || '').localeCompare(b.st.last || '')).slice(0, 3);
  const nSongs = all('song').length;
  const me = get(S.me.member_id);
  let h = `<header class="top"><img class="pillbrand" src="brand/pill.jpg" alt="San Peregrino Squirt"><span class="grow"></span>${syncBadge()}</header>`;
  if (!REMOTE) h += `<div class="notice">Modo prueba: los datos se guardan solo en este móvil. Cuando conectes Supabase, todo se compartirá con el grupo.</div>`;
  h += `<p class="muted" style="margin-top:6px">Hola${me ? ', ' + esc(mName(me)) : ''}. ${nSongs ? nSongs + (nSongs === 1 ? ' tema' : ' temas') + ' en el repertorio.' : 'Empieza creando el primer tema.'}</p>`;
  if (open) {
    const cur = get(open.data.current_song);
    h += `<button class="card hl stack" data-a="open" data-v="rehearsal" data-id="${open.id}" style="text-align:left;margin-top:14px">
      <span class="row between"><span class="label" style="color:var(--accent)">Ensayo en curso</span><span class="tag rec">● EN DIRECTO</span></span>
      <h2>${cur ? esc(cur.data.title) : 'Elige el tema que estáis tocando'}</h2>
      <span class="small muted">${(open.data.songs || []).length} temas tocados · ${(open.data.attendees || []).length} asistentes</span></button>`;
  }
  h += `<div class="sec"><div class="label">Próximo</div>`;
  if (!nextR && !nextG) h += `<div class="card muted small">No hay nada programado. <button class="btn sm" data-a="newRehearsal">Programar ensayo</button></div>`;
  [nextR, nextG].filter(Boolean).sort((a, b) => a.data.date.localeCompare(b.data.date)).forEach(x => {
    h += `<button class="card row" data-a="open" data-v="${x.type}" data-id="${x.id}" style="text-align:left;width:100%">
      <span class="grow"><span class="label">${x.type === 'gig' ? 'Concierto' : 'Ensayo'}</span><br><b>${esc(fmtDay(x.data.date, { weekday: 'long', day: 'numeric', month: 'long' }))}</b>
      ${(x.type === 'gig' ? x.data.time_show : x.data.time) ? `<span class="muted"> · ${esc(x.type === 'gig' ? x.data.time_show : x.data.time)}</span>` : ''}<br><span class="small muted">${esc(x.type === 'gig' ? [x.data.venue, x.data.city].filter(Boolean).join(', ') : (x.data.place || ''))}</span></span><span class="chev muted">›</span></button>`;
  });
  h += `</div>`;
  h += `<div class="sec"><div class="row between"><div class="label">Deberes pendientes</div></div>`;
  h += tasks.length ? `<div class="list">${tasks.map(taskRow).join('')}</div>` : `<div class="card small muted">Nada pendiente. Sospechoso.</div>`;
  h += `</div>`;
  h += `<div class="sec"><div class="label">Últimas grabaciones</div>${recs.length ? `<div class="list">${recs.map(r => recRow(r, true)).join('')}</div>` : `<div class="card small muted">Todavía no hay grabaciones. Pulsa GRABAR dentro de un tema.</div>`}</div>`;
  if (ready.length) h += `<div class="sec"><div class="label">Temas que lleváis tiempo sin tocar</div><div class="list">${ready.map(({ s, st }) =>
    `<button class="li" data-a="open" data-v="song" data-id="${s.id}"><span class="grow"><span class="t">${esc(s.data.title)}</span><br><span class="s">${st.last ? 'Último ensayo: ' + fmtDay(st.last) : 'Nunca ensayado'} · ${st.count} ensayo(s)</span></span><span class="chev">›</span></button>`).join('')}</div></div>`;
  return h;
};

function taskRow(t) {
  const m = get(t.data.member);
  return `<div class="li"><button class="check" data-a="taskDone" data-id="${t.id}" aria-pressed="${!!t.data.done}" aria-label="Hecho">${t.data.done ? '✓' : ''}</button>
    <span class="grow" style="${t.data.done ? 'text-decoration:line-through;color:var(--muted)' : ''}">${esc(t.data.text)}</span>${m ? avatar(m) : ''}<button class="x" data-a="taskDel" data-id="${t.id}" aria-label="Quitar">×</button></div>`;
}
function recRow(r, showSong = false) {
  const song = showSong ? get(r.data.song_id) : null;
  const pend = REMOTE && !r.data.uploaded;
  return `<button class="li" data-a="play" data-id="${r.id}">
    <span class="icon" aria-hidden="true">▶</span>
    <span class="grow"><span class="t">${r.data.ref ? '★ ' : ''}${esc(r.data.name || 'Grabación')}</span><br>
    <span class="s">${showSong ? esc(song ? song.data.title : 'Sin asignar') + ' · ' : ''}${fmtStamp(r.data.recorded_at)} · ${mmss(r.data.duration)} · ${esc(whoName(r.created_by))}</span>
    ${(r.data.tags || []).length || pend ? `<span class="chips" style="margin-top:4px">${(r.data.tags || []).map(t => `<span class="tag acc">${esc(t)}</span>`).join('')}${pend ? `<span class="tag warn">Pendiente de subir</span>` : ''}</span>` : ''}</span></button>`;
}

/* -- Temas -- */
VIEWS.songs = v => {
  const st = v.st || '';
  const list = songsSorted().filter(s => !st || s.data.status === st);
  let h = topBar('Temas', false);
  h += `<div class="stack"><div class="row"><input id="songq" class="grow" type="search" placeholder="Buscar tema…" autocomplete="off" style="flex:1"><button class="btn pri" data-a="newSong">+ Nuevo</button></div>
    <div class="tabs">${[['', 'Todos'], ...STATUS.map(x => [x, x])].map(([k, l]) => `<button data-a="songFilter" data-v="${esc(k)}" aria-current="${k === st}">${esc(l)}</button>`).join('')}</div>`;
  if (!list.length) h += `<div class="card empty">${all('song').length ? 'Ningún tema con ese estado.' : 'El repertorio está vacío. Crea el primer tema con «+ Nuevo».'}</div>`;
  else h += `<div class="list" id="songlist">${list.map(s => {
    const n = all('recording').filter(r => r.data.song_id === s.id).length;
    const meta = [s.data.key, s.data.bpm ? s.data.bpm + ' BPM' : '', s.data.duration].filter(Boolean).join(' · ');
    return `<button class="li" data-a="open" data-v="song" data-id="${s.id}" data-title="${esc((s.data.title || '').toLowerCase())}">
      <span class="grow"><span class="t">${esc(s.data.title || 'Sin título')}</span><br><span class="s">${esc(meta || (s.data.origin === 'Versión' ? 'Versión' : 'Propia'))}${n ? ' · ' + n + ' grab.' : ''}</span></span>
      ${s.data.status ? `<span class="tag ${s.data.status === 'Lista para directo' ? 'acc' : ''}">${esc(s.data.status)}</span>` : ''}<span class="chev">›</span></button>`;
  }).join('')}</div>`;
  return h + `</div>`;
};
function filterSongs(q) {
  q = q.trim().toLowerCase();
  $$('#songlist .li').forEach(el => { el.hidden = q && !el.dataset.title.includes(q); });
}

VIEWS.song = v => {
  const s = get(v.id);
  if (!s) return topBar('Tema no encontrado') + `<div class="card empty">Puede que alguien lo haya borrado.</div>`;
  const tab = v.tab || 'general';
  const tabs = [['general', 'General'], ...INST.filter(d => instOn(s, d)).map(d => [d.k, d.short]), ['log', 'Bitácora'], ['recs', 'Grabaciones']];
  let h = topBar(s.data.title || 'Sin título');
  h += `<div class="tabs" role="tablist">${tabs.map(([k, l]) => `<button data-a="songTab" data-v="${k}" aria-current="${k === tab}">${esc(l)}${k === 'recs' ? ' · ' + all('recording').filter(r => r.data.song_id === s.id).length : ''}</button>`).join('')}</div>`;
  if (tab === 'general') h += songGeneral(s);
  else if (tab === 'recs') h += songRecs(s, v);
  else if (tab === 'log') h += songLog(s);
  else { const def = INST.find(d => d.k === tab); h += def ? instPane(s, def) : ''; }
  return h;
};
function songGeneral(s) {
  const d = s.data, id = s.id, st = songStats(id);
  const opt = (arr, val) => arr.map(x => `<option ${x === val ? 'selected' : ''}>${esc(x)}</option>`).join('');
  let h = `<div class="stack">
  <label class="field"><span>Título</span><input data-f="${id}|title" value="${esc(d.title)}"></label>
  <div class="grid2"><label class="field"><span>Autor o compositor</span><input data-f="${id}|author" value="${esc(d.author)}"></label>
  <label class="field"><span>Origen</span><select data-f="${id}|origin">${opt(['Propia', 'Versión'], d.origin || 'Propia')}</select></label></div>
  <label class="field"><span>Estado</span><select data-f="${id}|status" data-r><option value="">Sin estado</option>${opt(STATUS, d.status)}</select></label>
  <div class="grid3"><label class="field"><span>Tempo (BPM)</span><input data-f="${id}|bpm" data-num inputmode="decimal" id="bpmIn" value="${esc(d.bpm ?? '')}"></label>
  <label class="field"><span>Compás</span><input data-f="${id}|sig" value="${esc(d.sig || '4/4')}"></label>
  <label class="field"><span>Tonalidad</span><input data-f="${id}|key" value="${esc(d.key)}" placeholder="Mi menor"></label>
  <label class="field"><span>Duración</span><input data-f="${id}|duration" value="${esc(d.duration)}" placeholder="3:45" inputmode="numeric"></label>
  <label class="field" style="grid-column:span 2"><span>Afinación</span><input data-f="${id}|tuning" value="${esc(d.tuning)}" placeholder="Estándar, drop D…"></label></div>
  <div class="row"><button class="btn sm" data-a="metro" data-id="${id}">${Metro.on ? '■ Parar metrónomo' : '▶ Metrónomo'}</button><button class="btn sm" data-a="tap" data-id="${id}">Tap tempo</button><span class="small muted" id="tapinfo"></span></div>
  </div>`;
  h += `<div class="sec"><div class="label">Instrumentos en este tema</div><div class="card">
    ${INST.filter(x => x.optional).map(x => `<label class="switch"><span>${esc(x.name)}</span><input type="checkbox" data-f="${id}|inst.${x.k}.on" data-r ${instOn(s, x) ? 'checked' : ''}></label>`).join('')}</div></div>`;
  const parts = d.parts || [];
  h += `<div class="sec"><div class="label">Estructura</div><div class="stack">${parts.map((p, i) => `
    <div class="card stack" style="padding:10px"><div class="row"><input data-p="${i}:name" value="${esc(p.name)}" class="grow" style="flex:1" aria-label="Parte">
    <input data-p="${i}:bars" value="${esc(p.bars ?? '')}" inputmode="numeric" style="width:76px" placeholder="Comp." aria-label="Compases">
    <button class="x" data-a="partMove" data-v="${i}:-1" aria-label="Subir">↑</button><button class="x" data-a="partMove" data-v="${i}:1" aria-label="Bajar">↓</button><button class="x" data-a="partDel" data-v="${i}" aria-label="Quitar">×</button></div>
    <input data-p="${i}:note" value="${esc(p.note)}" placeholder="Nota corta (opcional)"></div>`).join('')}
    <div class="chips">${PART_NAMES.map(n => `<button class="chip" data-a="partAdd" data-v="${n}">+ ${n}</button>`).join('')}</div></div></div>`;
  h += `<div class="sec"><label class="field"><span>Nota para el modo escenario</span><textarea data-f="${id}|stage_note" style="min-height:70px" placeholder="Ej.: entra la batería sola, 4 golpes de charles">${esc(d.stage_note)}</textarea></label>
    <label class="field"><span>Notas generales</span><textarea data-f="${id}|notes">${esc(d.notes)}</textarea></label></div>`;
  h += `<div class="sec"><p class="small muted">${st.count ? `Ensayado ${st.count} ${st.count === 1 ? 'vez' : 'veces'} · último: ${fmtDay(st.last)}` : 'Aún no aparece en ningún ensayo.'}<br>Creado por ${esc(whoName(s.created_by))} · última edición: ${esc(whoName(s.updated_by))}, ${fmtStamp(s.updated_at)}</p>
    <div class="row"><button class="btn recb" data-a="recHere">● Grabar en este tema</button><button class="btn" data-a="history" data-id="${id}">Historial de versiones</button><button class="btn danger" data-a="trashIt" data-id="${id}">Papelera</button></div></div>`;
  return h;
}
function instPane(s, def) {
  const d = deepGet(s.data, ['inst', def.k]) || {}; const id = s.id, base = `inst.${def.k}`;
  const ms = members();
  const sugg = def.role ? ms.filter(m => (m.data.roles || []).includes(def.role)) : ms.filter(m => m.data.guest);
  const sel = d.member || (sugg[0] && sugg[0].id) || '';
  let h = `<div class="stack"><label class="field"><span>${def.guest ? 'Músico invitado' : 'Quién lo toca'}</span><select data-f="${id}|${base}.member" data-r>
    <option value="">— Sin asignar —</option>${ms.filter(m => def.guest ? m.data.guest : true).map(m => `<option value="${m.id}" ${m.id === d.member ? 'selected' : ''}>${esc(mName(m))}${m.data.guest ? ' (invitado)' : ''}</option>`).join('')}</select></label>
    ${!d.member && sel ? `<p class="small muted">Sugerencia: ${esc(mName(get(sel)))}</p>` : ''}
    ${def.guest && !ms.some(m => m.data.guest) ? `<p class="small muted">No hay invitados creados. ${isAdmin() ? 'Añádelos en Grupo.' : 'Pídeselo al administrador.'}</p>` : ''}`;
  for (const [f, label, kind, opts] of def.fields) {
    const val = d[f];
    if (kind === 'line') h += `<label class="field"><span>${esc(label)}</span><input data-f="${id}|${base}.${f}" value="${esc(val)}"></label>`;
    else if (kind === 'select') h += `<label class="field"><span>${esc(label)}</span><select data-f="${id}|${base}.${f}">${opts.map(o => `<option value="${esc(o)}" ${o === (val || '') ? 'selected' : ''}>${esc(o || '—')}</option>`).join('')}</select></label>`;
    else h += `<label class="field"><span>${esc(label)}</span><textarea class="${kind === 'tab' ? 'tab' : kind === 'lyrics' ? 'lyrics' : ''}" data-f="${id}|${base}.${f}" spellcheck="${kind === 'tab' ? 'false' : 'true'}" ${kind === 'tab' ? 'wrap="off"' : ''}>${esc(val)}</textarea></label>`;
  }
  const imgs = d.img || [];
  h += `<div class="sec"><div class="label">Imágenes</div><div class="thumbs">${imgs.map(im => `<button class="thumb" data-a="viewImg" data-key="${im.key}" data-path="${esc(im.path)}" data-list="${id}|inst.${def.k}.img" data-candel="1" data-bg="${im.key}|${esc(im.path)}" aria-label="Ver imagen"></button>`).join('')}
    <label class="thumb" style="display:grid;place-items:center;cursor:pointer;font-size:1.6rem;color:var(--muted)" aria-label="Añadir imagen">+<input type="file" accept="image/*" data-img="${id}|inst.${def.k}.img|many" hidden></label></div>
    <p class="small muted">Fotos de partituras, de la pizarra o de una libreta.</p></div>`;
  const linked = (d.recs || []).map(get).filter(Boolean);
  h += `<div class="sec"><div class="row between"><div class="label">Grabaciones enlazadas</div><button class="btn sm" data-a="linkRec" data-v="${def.k}">Enlazar</button></div>
    ${linked.length ? `<div class="list">${linked.map(r => recRow(r)).join('')}</div>` : `<p class="small muted">Enlaza aquí la toma del solo, del riff… para tenerla a mano.</p>`}</div></div>`;
  return h;
}
function songLog(s) {
  const rs = all('rehearsal').filter(r => (r.data.songs || []).includes(s.id)).sort((a, b) => (b.data.date || '').localeCompare(a.data.date || ''));
  if (!rs.length) return `<div class="card empty">Este tema todavía no aparece en ningún ensayo.</div>`;
  return `<p class="small muted" style="margin-bottom:10px">Lo apuntado sobre este tema en cada ensayo, del más reciente al más antiguo.</p><div class="list">${rs.map(r => {
    const note = (r.data.song_notes || {})[s.id]; const n = recsOf(x => x.data.song_id === s.id && x.data.rehearsal_id === r.id).length;
    return `<button class="li" data-a="open" data-v="rehearsal" data-id="${r.id}" style="align-items:flex-start"><span class="grow"><span class="t">${esc(fmtDay(r.data.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}</span>
      <span class="s"> · ${esc((r.data.attendees || []).map(get).filter(Boolean).map(mName).join(', '))}${n ? ' · ' + n + ' grab.' : ''}</span><br>
      <span style="white-space:pre-wrap">${note ? esc(note) : '<span class="muted small">Sin notas</span>'}</span></span><span class="chev">›</span></button>`;
  }).join('')}</div>`;
}
function songRecs(s, v) {
  const recs = recsOf(r => r.data.song_id === s.id);
  const used = [...new Set(recs.flatMap(r => r.data.tags || []))];
  const f = v.tag || '';
  const list = f ? recs.filter(r => (r.data.tags || []).includes(f)) : recs;
  let h = `<div class="stack"><button class="btn recb block" data-a="recHere">● Grabar en este tema</button>`;
  if (used.length) h += `<div class="tabs">${[['', 'Todas'], ...used.map(t => [t, t])].map(([k, l]) => `<button data-a="recFilter" data-v="${esc(k)}" aria-current="${k === f}">${esc(l)}</button>`).join('')}</div>`;
  h += list.length ? `<div class="list">${list.map(r => recRow(r)).join('')}</div>` : `<div class="card empty">Sin grabaciones${f ? ' con esa etiqueta' : ''}.</div>`;
  return h + `</div>`;
}

/* -- Ensayos -- */
VIEWS.rehearsals = () => {
  const list = all('rehearsal').sort((a, b) => ((b.data.date || '') + (b.data.time || '')).localeCompare((a.data.date || '') + (a.data.time || '')));
  let h = topBar('Ensayos', false) + `<div class="stack"><button class="btn pri block" data-a="newRehearsal">+ Nuevo ensayo</button>`;
  h += list.length ? `<div class="list">${list.map(r => `<button class="li" data-a="open" data-v="rehearsal" data-id="${r.id}">
    <span class="grow"><span class="t">${esc(fmtDay(r.data.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}${r.data.time ? ' · ' + esc(r.data.time) : ''}</span><br>
    <span class="s">${(r.data.songs || []).length} temas · ${esc((r.data.attendees || []).map(get).filter(Boolean).map(mName).join(', ') || 'sin asistentes')}${r.data.place ? ' · ' + esc(r.data.place) : ''}</span></span>
    ${r.data.open ? '<span class="tag rec">En curso</span>' : ''}<span class="chev">›</span></button>`).join('')}</div>` : `<div class="card empty">Aún no hay ensayos apuntados.</div>`;
  return h + `</div>`;
};
VIEWS.rehearsal = v => {
  const r = get(v.id); if (!r) return topBar('Ensayo no encontrado') + `<div class="card empty">Puede que se haya borrado.</div>`;
  const d = r.data, id = r.id;
  const songs = (d.songs || []).map(get).filter(Boolean);
  const cur = get(d.current_song);
  let h = topBar(fmtDay(d.date, { weekday: 'long', day: 'numeric', month: 'long' }) || 'Ensayo');
  h += `<div class="stack">`;
  if (d.open) {
    h += `<div class="card hl stack"><div class="row between"><span class="label" style="color:var(--accent)">Ensayo en curso</span><button class="btn sm" data-a="closeReh" data-id="${id}">Terminar ensayo</button></div>
      <div class="label">Tema actual</div>
      <div class="chips">${songs.map(s => `<button class="chip" data-a="curSong" data-id="${s.id}" aria-pressed="${s.id === d.current_song}">${esc(s.data.title)}</button>`).join('')}</div>
      <select data-ch="rehAddCur" aria-label="Añadir tema"><option value="">+ Añadir tema y ponerlo como actual…</option>${songsSorted().filter(s => !(d.songs || []).includes(s.id)).map(s => `<option value="${s.id}">${esc(s.data.title)}</option>`).join('')}</select>
      <button class="btn recb block" data-a="recReh">● Grabar${cur ? ' «' + esc(cur.data.title) + '»' : ''}</button></div>`;
  } else if (d.date === isoDay()) {
    h += `<button class="btn pri block" data-a="openReh" data-id="${id}">Empezar ensayo ahora</button>`;
  }
  h += `<div class="grid2"><label class="field"><span>Fecha</span><input type="date" data-f="${id}|date" value="${esc(d.date)}"></label>
    <label class="field"><span>Hora</span><input type="time" data-f="${id}|time" value="${esc(d.time)}"></label>
    <label class="field"><span>Lugar</span><input data-f="${id}|place" value="${esc(d.place)}"></label>
    <label class="field"><span>Duración</span><input data-f="${id}|duration" value="${esc(d.duration)}" placeholder="2 h"></label></div></div>`;
  h += `<div class="sec"><div class="label">Asistentes</div><div class="chips">${members().map(m => `<button class="chip" data-a="toggleIn" data-id="${id}" data-k="attendees" data-v="${m.id}" aria-pressed="${(d.attendees || []).includes(m.id)}">${avatar(m)}${esc(mName(m))}${m.data.guest ? ' · inv.' : ''}</button>`).join('') || '<span class="small muted">Añade miembros en Grupo.</span>'}</div></div>`;
  h += `<div class="sec"><div class="label">Temas tocados</div>`;
  h += songs.length ? `<div class="list">${songs.map(s => {
    const recs = recsOf(x => x.data.song_id === s.id && x.data.rehearsal_id === id);
    return `<div class="li" style="flex-wrap:wrap"><button class="grow" data-a="open" data-v="song" data-id="${s.id}" style="border:0;background:none;text-align:left;padding:0"><span class="t">${esc(s.data.title)}</span><br><span class="s">${recs.length ? recs.length + ' grabación(es) en este ensayo' : 'Sin grabaciones hoy'}</span></button>
      <button class="x" data-a="toggleIn" data-id="${id}" data-k="songs" data-v="${s.id}" aria-label="Quitar">×</button>
      <textarea data-f="${id}|song_notes.${s.id}" placeholder="Cómo ha ido este tema…" style="min-height:64px;width:100%" aria-label="Notas de ${esc(s.data.title)}">${esc((d.song_notes || {})[s.id])}</textarea>
      ${recs.length ? `<div class="list" style="width:100%">${recs.map(x => recRow(x)).join('')}</div>` : ''}</div>`;
  }).join('')}</div>` : `<p class="small muted">Todavía ningún tema.</p>`;
  h += `<select data-ch="rehAdd" aria-label="Añadir tema tocado"><option value="">+ Añadir tema tocado…</option>${songsSorted().filter(s => !(d.songs || []).includes(s.id)).map(s => `<option value="${s.id}">${esc(s.data.title)}</option>`).join('')}</select></div>`;
  h += `<div class="sec"><label class="field"><span>Notas del ensayo</span><textarea data-f="${id}|notes" placeholder="Qué ha ido bien, qué hay que repasar…">${esc(d.notes)}</textarea></label></div>`;
  const tasks = all('task').filter(t => t.data.rehearsal_id === id);
  h += `<div class="sec"><div class="label">Deberes para el próximo ensayo</div>${tasks.length ? `<div class="list">${tasks.map(taskRow).join('')}</div>` : ''}
    <form class="stack" id="taskForm" data-id="${id}"><input id="taskText" placeholder="Ej.: sacar el solo de Burbujas" autocomplete="off">
    <div class="row"><select id="taskWho" class="grow" style="flex:1"><option value="">Para todos</option>${members().map(m => `<option value="${m.id}">${esc(mName(m))}</option>`).join('')}</select><button class="btn" type="submit">Añadir</button></div></form></div>`;
  h += `<div class="sec"><button class="btn danger" data-a="trashIt" data-id="${id}">Mandar ensayo a la papelera</button></div>`;
  return h;
};

/* -- Directo: conciertos y setlists -- */
VIEWS.live = v => {
  const sub = v.sub || 'gigs';
  let h = topBar('Directo', false) + `<div class="seg" style="margin-bottom:12px"><button data-a="liveSub" data-v="gigs" aria-current="${sub === 'gigs'}">Conciertos</button><button data-a="liveSub" data-v="setlists" aria-current="${sub === 'setlists'}">Setlists</button></div>`;
  if (sub === 'gigs') {
    const today = isoDay();
    const gigs = all('gig');
    const up = gigs.filter(g => (g.data.date || '') >= today).sort((a, b) => a.data.date.localeCompare(b.data.date));
    const past = gigs.filter(g => (g.data.date || '') < today).sort((a, b) => b.data.date.localeCompare(a.data.date));
    const row = g => `<button class="li" data-a="open" data-v="gig" data-id="${g.id}"><span class="grow"><span class="t">${esc(g.data.venue || 'Sin sala')}</span><br><span class="s">${esc(fmtDay(g.data.date, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }))}${g.data.city ? ' · ' + esc(g.data.city) : ''}</span></span><span class="chev">›</span></button>`;
    h += `<div class="stack"><button class="btn pri block" data-a="newGig">+ Nuevo concierto</button>
      <div class="label">Próximos</div>${up.length ? `<div class="list">${up.map(row).join('')}</div>` : `<div class="card small muted">Ningún concierto a la vista.</div>`}
      ${past.length ? `<div class="label" style="margin-top:10px">Anteriores</div><div class="list">${past.map(row).join('')}</div>` : ''}</div>`;
  } else {
    const sls = all('setlist').sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || ''));
    h += `<div class="stack"><button class="btn pri block" data-a="newSetlist">+ Nuevo setlist</button>
      ${sls.length ? `<div class="list">${sls.map(s => { const n = (s.data.entries || []).filter(e => e.k === 's').length; return `<button class="li" data-a="open" data-v="setlist" data-id="${s.id}"><span class="grow"><span class="t">${esc(s.data.name || 'Setlist')}</span><br><span class="s">${n} temas · ${mmss(setlistDur(s))}</span></span><span class="chev">›</span></button>`; }).join('')}</div>` : `<div class="card empty">Sin setlists todavía.</div>`}</div>`;
  }
  return h;
};
const setlistDur = s => (s.data.entries || []).reduce((t, e) => t + (e.k === 's' ? durOf(get(e.id)) : 0), 0);
VIEWS.setlist = v => {
  const s = get(v.id); if (!s) return topBar('Setlist no encontrado') + `<div class="card empty">Puede que se haya borrado.</div>`;
  const id = s.id, ent = s.data.entries || [];
  let n = 0;
  let h = topBar(s.data.name || 'Setlist') + `<div class="stack"><label class="field"><span>Nombre</span><input data-f="${id}|name" value="${esc(s.data.name)}"></label>
    <div class="row between"><span class="muted small">${ent.filter(e => e.k === 's').length} temas · duración total ${mmss(setlistDur(s))}</span><button class="btn pri sm" data-a="stage" data-id="${id}" ${ent.length ? '' : 'disabled'}>Modo escenario</button></div>`;
  h += ent.length ? `<div class="list sl" id="sl">${ent.map((e, i) => {
    if (e.k === 'x') return `<div class="li sep" data-idx="${i}"><button class="handle" aria-label="Arrastrar">⠿</button><span class="grow muted">— ${esc(e.text)} —</span><button class="x" data-a="slDel" data-v="${i}" aria-label="Quitar">×</button></div>`;
    const sg = get(e.id); n++;
    return `<div class="li" data-idx="${i}"><button class="handle" aria-label="Arrastrar">⠿</button><span class="mono muted" style="width:22px">${n}</span><span class="grow"><span class="t">${esc(sg ? sg.data.title : 'Tema borrado')}</span><br><span class="s">${esc([sg && sg.data.key, sg && sg.data.bpm ? sg.data.bpm + ' BPM' : '', sg && sg.data.tuning].filter(Boolean).join(' · '))}</span></span><span class="mono small muted">${sg && sg.data.duration ? esc(sg.data.duration) : ''}</span><button class="x" data-a="slDel" data-v="${i}" aria-label="Quitar">×</button></div>`;
  }).join('')}</div><p class="small muted">Arrastra desde ⠿ para cambiar el orden.</p>` : `<div class="card empty">Añade temas abajo.</div>`;
  h += `<select data-ch="slAdd"><option value="">+ Añadir tema…</option>${songsSorted().map(sg => `<option value="${sg.id}">${esc(sg.data.title)}${ent.some(e => e.id === sg.id) ? ' (ya está)' : ''}</option>`).join('')}</select>
    <form class="row" id="sepForm" style="flex-wrap:nowrap"><input id="sepText" placeholder="Separador: pausa, cambio de afinación, presentación…" style="flex:1"><button class="btn" type="submit">Añadir</button></form>
    <div class="row"><button class="btn" data-a="dupSetlist" data-id="${id}">Duplicar</button><button class="btn danger" data-a="trashIt" data-id="${id}">Papelera</button></div></div>`;
  return h;
};
VIEWS.gig = v => {
  const g = get(v.id); if (!g) return topBar('Concierto no encontrado') + `<div class="card empty">Puede que se haya borrado.</div>`;
  const d = g.data, id = g.id;
  const sl = get(d.setlist_id);
  let h = topBar(d.venue || 'Concierto') + `<div class="stack">
    <div class="grid2"><label class="field"><span>Sala</span><input data-f="${id}|venue" value="${esc(d.venue)}"></label><label class="field"><span>Ciudad</span><input data-f="${id}|city" value="${esc(d.city)}"></label>
    <label class="field"><span>Fecha</span><input type="date" data-f="${id}|date" value="${esc(d.date)}"></label><label class="field"><span>Prueba de sonido</span><input type="time" data-f="${id}|time_sound" value="${esc(d.time_sound)}"></label>
    <label class="field"><span>Actuación</span><input type="time" data-f="${id}|time_show" value="${esc(d.time_show)}"></label><label class="field"><span>Contacto</span><input data-f="${id}|contact" value="${esc(d.contact)}" placeholder="Nombre y teléfono"></label></div>
    <label class="field"><span>Caché o condiciones</span><input data-f="${id}|fee" value="${esc(d.fee)}"></label>
    <label class="field"><span>Setlist</span><select data-f="${id}|setlist_id" data-r><option value="">— Sin setlist —</option>${all('setlist').map(s => `<option value="${s.id}" ${s.id === d.setlist_id ? 'selected' : ''}>${esc(s.data.name)}</option>`).join('')}</select></label>
    ${sl ? `<div class="row"><button class="btn pri" data-a="stage" data-id="${sl.id}">Modo escenario</button><button class="btn" data-a="open" data-v="setlist" data-id="${sl.id}">Ver setlist</button></div>` : ''}</div>`;
  h += `<div class="sec"><div class="label">Quién toca</div><div class="chips">${members().map(m => `<button class="chip" data-a="toggleIn" data-id="${id}" data-k="attendees" data-v="${m.id}" aria-pressed="${(d.attendees || []).includes(m.id)}">${avatar(m)}${esc(mName(m))}</button>`).join('')}</div></div>`;
  const gear = [...gearAll(), ...(d.extra_gear || [])]; const chk = d.check || {};
  const done = gear.filter(x => chk[x]).length;
  h += `<div class="sec"><div class="row between"><div class="label">Material</div><span class="mono small muted">${done}/${gear.length}</span></div><div class="list">${gear.map(x => `<div class="li"><button class="check" data-a="gearChk" data-id="${id}" data-v="${esc(x)}" aria-pressed="${!!chk[x]}">${chk[x] ? '✓' : ''}</button><span class="grow" style="${chk[x] ? 'color:var(--muted);text-decoration:line-through' : ''}">${esc(x)}</span></div>`).join('')}</div>
    <form class="row" id="gearForm" style="flex-wrap:nowrap"><input id="gearText" placeholder="Añadir algo solo para este concierto" style="flex:1"><button class="btn" type="submit">Añadir</button></form></div>`;
  h += `<div class="sec"><label class="field"><span>Notas (antes y después)</span><textarea data-f="${id}|notes">${esc(d.notes)}</textarea></label></div>`;
  const recs = recsOf(r => r.data.gig_id === id);
  h += `<div class="sec"><div class="row between"><div class="label">Grabaciones del concierto</div><button class="btn recb sm" data-a="recGig" data-id="${id}">● Grabar</button></div>${recs.length ? `<div class="list">${recs.map(r => recRow(r, true)).join('')}</div>` : '<p class="small muted">Ninguna todavía.</p>'}</div>
    <div class="sec"><button class="btn danger" data-a="trashIt" data-id="${id}">Mandar concierto a la papelera</button></div>`;
  return h;
};

/* -- Grupo -- */
VIEWS.band = () => {
  const me = get(S.me.member_id);
  const st = settings();
  let h = topBar(st ? st.data.band_name || 'Grupo' : 'Grupo', false) + `<div class="stack">`;
  if (me) h += `<button class="card row" data-a="open" data-v="member" data-id="${me.id}" style="text-align:left;width:100%">${avatar(me)}<span class="grow"><span class="label">Mi ficha</span><br><b>${esc(mName(me))}</b> <span class="small muted">${esc((me.data.roles || []).join(', '))}</span></span><span class="chev muted">›</span></button>`;
  h += `</div><div class="sec"><div class="row between"><div class="label">Miembros</div>${isAdmin() ? `<div class="row"><button class="btn sm" data-a="newMember" data-v="0">+ Colaborador</button><button class="btn sm" data-a="newMember" data-v="1">+ Invitado</button></div>` : ''}</div>
    <div class="list">${members().map(m => `<button class="li" data-a="open" data-v="member" data-id="${m.id}">${avatar(m)}<span class="grow"><span class="t">${esc(mName(m))}</span><br><span class="s">${esc([m.data.name !== mName(m) ? m.data.name : '', (m.data.roles || []).join(', ') || 'Sin rol'].filter(Boolean).join(' · '))}</span></span>${m.data.guest ? '<span class="tag">Invitado</span>' : ''}${REMOTE && S.accounts.some(a => a.member_id === m.id && a.role === 'admin') ? '<span class="tag acc">Admin</span>' : ''}<span class="chev">›</span></button>`).join('')}</div></div>`;
  if (isAdmin()) {
    h += `<div class="sec"><div class="label">Administración</div><div class="list">
      ${REMOTE ? `<button class="li" data-a="invite"><span class="grow"><span class="t">Invitar al grupo</span><br><span class="s">Código de invitación para que se unan</span></span><span class="chev">›</span></button>
      <button class="li" data-a="accounts"><span class="grow"><span class="t">Cuentas</span><br><span class="s">Quién usa la app, expulsar, ceder la administración</span></span><span class="chev">›</span></button>` : ''}
      <button class="li" data-a="open" data-v="trash"><span class="grow"><span class="t">Papelera</span><br><span class="s">${trash().length} elemento(s)</span></span><span class="chev">›</span></button>
      <button class="li" data-a="open" data-v="activity"><span class="grow"><span class="t">Actividad</span><br><span class="s">Quién ha hecho qué y cuándo</span></span><span class="chev">›</span></button>
      <button class="li" data-a="bandSettings"><span class="grow"><span class="t">Ajustes del grupo</span><br><span class="s">Nombre, etiquetas de grabación, material</span></span><span class="chev">›</span></button>
      <button class="li" data-a="backup"><span class="grow"><span class="t">Copia de seguridad</span><br><span class="s">Descargar todos los datos y audios</span></span><span class="chev">›</span></button></div></div>`;
  }
  h += `<div class="sec"><div class="label">Sincronización</div><div class="card stack">${REMOTE ? `<div class="row between"><span id="pendinfo">${pendText()}</span>${syncBadge()}</div><button class="btn sm" data-a="syncNow" style="align-self:flex-start">Sincronizar ahora</button>` : `<p class="small muted">Modo prueba: no hay nube configurada. Los datos solo están en este móvil.</p>`}</div></div>`;
  if (REMOTE) h += `<div class="sec"><div class="label">Mi cuenta</div><div class="card stack"><span class="small muted">${esc(S.me.email)} · ${isAdmin() ? 'Administrador' : 'Miembro'}</span><button class="btn danger sm" data-a="logout" style="align-self:flex-start">Cerrar sesión</button></div></div>`;
  return h;
};
VIEWS.member = v => {
  const m = get(v.id); if (!m) return topBar('Ficha no encontrada') + `<div class="card empty">Puede que se haya dado de baja.</div>`;
  const d = m.data, id = m.id, adm = isAdmin(), can = adm || id === S.me.member_id;
  const acc = REMOTE ? S.accounts.find(a => a.member_id === id) : null;
  const extraRoles = (d.roles || []).filter(r => !ROLES.includes(r));
  let h = topBar(mName(m));
  const icons = roleIcons(m);
  h += `<div class="prof"><div class="prof-top">${icons.length ? `<div class="prof-inst">${icons.map(k => `<span class="inst-ic" title="${ICON_LABEL[k]}" role="img" aria-label="${ICON_LABEL[k]}">${INST_ICON[k]}</span>`).join('')}</div>` : ''}<div class="prof-photo" style="background-color:${esc(d.color || '#888')}" ${d.photo && d.photo.key ? `data-bg="${d.photo.key}|${esc(d.photo.path)}"` : ''}>${d.photo && d.photo.key ? '' : `<span>${esc(initials(mName(m)))}</span>`}
      ${can ? `<label class="prof-edit" aria-label="Cambiar foto de perfil">Cambiar foto<input type="file" accept="image/*" data-img="${id}|photo|one" hidden></label>` : ''}</div>${icons.length ? '<div class="prof-inst" aria-hidden="true" style="visibility:hidden"></div>' : ''}</div>
    <div class="prof-name">${esc(mName(m))}</div>${d.name && d.name !== mName(m) ? `<div class="muted">${esc(d.name)}</div>` : ''}
    <div class="chips" style="justify-content:center">${(d.roles || []).map(r => `<span class="tag">${esc(r)}</span>`).join('')}${d.guest ? '<span class="tag">Invitado</span>' : ''}${acc && acc.role === 'admin' ? '<span class="tag acc">Admin</span>' : ''}</div></div>`;
  if (can) h += `<div class="sec"><div class="grid2"><label class="field"><span>Alias (como sale en la app)</span><input data-f="${id}|alias" value="${esc(d.alias || '')}"></label>
    <label class="field"><span>Nombre completo</span><input data-f="${id}|name" value="${esc(d.name || '')}"></label></div>
    <label class="field" style="flex-direction:row;align-items:center;gap:10px"><span>Color</span><input type="color" data-f="${id}|color" data-r value="${esc(d.color || '#2FE3CB')}" style="width:56px;padding:4px"></label></div>`;
  if (adm) h += `<div class="sec"><div class="label">Roles e instrumentos</div><div class="chips">${[...ROLES, ...extraRoles].map(r => `<button class="chip" data-a="roleToggle" data-id="${id}" data-v="${esc(r)}" aria-pressed="${(d.roles || []).includes(r)}">${esc(r)}</button>`).join('')}</div>
    <form class="row" id="roleForm" data-id="${id}" style="flex-wrap:nowrap"><input id="roleIn" placeholder="Otro rol (saxo, teclados…)" style="flex:1"><button class="btn sm" type="submit">Añadir</button></form>
    <label class="switch"><span>Músico invitado (sin cuenta)</span><input type="checkbox" data-f="${id}|guest" data-r ${d.guest ? 'checked' : ''}></label></div>`;
  const quotes = (d.quotes || []).slice().sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  h += `<div class="sec"><div class="label">Citas célebres</div>${quotes.length ? quotes.map(q => `<figure class="quote"><blockquote>${esc(q.text)}</blockquote>
      <figcaption>— ${esc(mName(m))}${q.date ? ', ' + esc(fmtDay(q.date, { day: 'numeric', month: 'long', year: 'numeric' })) : ''}${q.context ? ' · ' + esc(q.context) : ''}</figcaption>
      ${can ? `<button class="x" data-a="quoteDel" data-id="${id}" data-v="${q.id}" aria-label="Borrar cita">×</button>` : ''}</figure>`).join('') : `<p class="small muted">Aún no hay frases para la posteridad. Todo llegará.</p>`}
    ${can ? `<form class="stack" id="quoteForm" data-id="${id}"><textarea id="qText" placeholder="La frase, tal cual la dijo" style="min-height:70px" required></textarea>
      <div class="grid2"><input id="qDate" type="date" value="${isoDay()}" aria-label="Fecha"><input id="qCtx" placeholder="Contexto (opcional)" aria-label="Contexto"></div><button class="btn" type="submit">Guardar cita</button></form>` : ''}</div>`;
  const photos = d.photos || [];
  h += `<div class="sec"><div class="label">Fotos</div><div class="thumbs">${photos.map(im => `<button class="thumb" data-a="viewImg" data-key="${im.key}" data-path="${esc(im.path)}" data-list="${id}|photos" data-candel="${can ? 1 : 0}" data-bg="${im.key}|${esc(im.path)}" aria-label="Ver foto"></button>`).join('')}
    ${can ? `<label class="thumb" style="display:grid;place-items:center;cursor:pointer;font-size:1.6rem;color:var(--muted)" aria-label="Añadir foto">+<input type="file" accept="image/*" data-img="${id}|photos|many" hidden></label>` : ''}</div>
    ${!photos.length && !can ? '<p class="small muted">Sin fotos todavía.</p>' : ''}</div>`;
  h += `<div class="sec">${can ? `<label class="field"><span>Notas propias</span><textarea data-f="${id}|notes" placeholder="Material, ajustes del ampli, recordatorios…">${esc(d.notes)}</textarea></label>`
    : `<div class="label">Notas</div>${d.notes ? `<div class="card" style="white-space:pre-wrap">${esc(d.notes)}</div>` : '<p class="small muted">Sin notas.</p>'}`}</div>`;
  if (!can) h += `<p class="small muted" style="margin-top:14px">Solo ${esc(mName(m))} y el administrador pueden editar esta ficha.</p>`;
  if (REMOTE && adm) h += `<p class="small muted" style="margin-top:14px">${acc ? 'Usa la app con su cuenta.' : d.guest ? 'Los invitados no necesitan cuenta.' : 'Todavía no ha entrado en la app. Al unirse con el código podrá elegir esta ficha.'}</p>`;
  if (adm && id !== S.me.member_id) h += `<div class="sec"><button class="btn danger" data-a="trashIt" data-id="${id}">Dar de baja</button></div>`;
  return h;
};
VIEWS.trash = () => {
  const list = trash().sort((a, b) => (b.deleted_at || '').localeCompare(a.deleted_at || ''));
  let h = topBar('Papelera');
  if (!isAdmin()) return h + `<div class="card empty">Solo el administrador puede ver la papelera.</div>`;
  h += `<p class="small muted" style="margin-bottom:10px">Lo que borra cualquier miembro llega aquí. Puedes restaurarlo o eliminarlo para siempre.</p>`;
  h += list.length ? `<div class="list">${list.map(i => `<div class="li"><span class="grow"><span class="t">${esc(itemTitle(i))}</span><br><span class="s">${TYPE_LABEL[i.type] || i.type} · borrado por ${esc(whoName(i.deleted_by))} · ${fmtStamp(i.deleted_at)}</span></span>
    <button class="btn sm" data-a="restore" data-id="${i.id}">Restaurar</button><button class="x" data-a="purge" data-id="${i.id}" aria-label="Borrar para siempre">🗑</button></div>`).join('')}</div>` : `<div class="card empty">La papelera está vacía.</div>`;
  return h;
};
let actCache = null;
function actName(x) {
  const t = x.title || x.name || x.text || x.venue || (x.date ? fmtDay(x.date, { day: 'numeric', month: 'short' }) : '');
  return t ? ' «' + esc(t) + '»' : '';
}
VIEWS.activity = () => {
  let h = topBar('Actividad');
  if (!actCache) { activity().then(a => { actCache = a; render(); }).catch(e => { actCache = []; toast('No se pudo cargar: ' + errMsg(e)); }); return h + `<div class="card empty">Cargando…</div>`; }
  const a = actCache; actCache = null;
  h += a.length ? `<div class="list">${a.map(x => `<div class="li"><span class="grow"><span class="t">${esc(whoName(x.changed_by))} ${ACTION_LABEL[x.action] || x.action} ${esc((TYPE_LABEL[x.type] || '').toLowerCase())}${actName(x)}</span><br><span class="s">${fmtStamp(x.changed_at)}</span></span></div>`).join('')}</div>` : `<div class="card empty">Sin actividad todavía.</div>`;
  return h;
};

/* ---------- imágenes y fondos ---------- */
function hydrate() {
  $$('[data-bg]').forEach(el => {
    const [k, p] = el.dataset.bg.split('|');
    getUrl(k, p).then(u => { if (u) el.style.backgroundImage = `url("${u}")`; }).catch(() => { el.textContent = '⚠'; });
  });
  if (V.name === 'setlist') bindDrag();
}
async function compressImage(file, max = 1600) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const c = document.createElement('canvas'); c.width = Math.round(bmp.width * s); c.height = Math.round(bmp.height * s);
  c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise(r => c.toBlob(r, 'image/jpeg', 0.82));
}
async function addImage(el) {
  const f = el.files && el.files[0]; if (!f) return;
  const [id, path, mode] = el.dataset.img.split('|'); const pa = path.split('.');
  try {
    const blob = await compressImage(f, mode === 'one' ? 900 : 1600);
    const key = uuid(), fpath = `img/${key}.jpg`;
    await storeFile(key, blob, fpath, null);
    const s = S.items.get(id);
    const val = mode === 'one' ? { key, path: fpath } : (deepGet(s.data, pa) || []).concat([{ key, path: fpath }]);
    await setField(id, pa, val, { render: true });
    toast(mode === 'one' ? 'Foto actualizada' : 'Imagen añadida');
  } catch (e) { toast('No se pudo añadir la imagen'); }
}

/* ---------- arrastrar en setlist ---------- */
function bindDrag() {
  const list = $('#sl'); if (!list) return;
  list.querySelectorAll('.handle').forEach(hd => hd.addEventListener('pointerdown', e => {
    e.preventDefault();
    const row = hd.closest('.li'); row.classList.add('dragging'); hd.setPointerCapture(e.pointerId);
    const move = ev => {
      const rows = [...list.children].filter(x => x !== row);
      const after = rows.find(x => { const b = x.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; });
      if (after) list.insertBefore(row, after); else list.appendChild(row);
    };
    const up = () => {
      hd.removeEventListener('pointermove', move); hd.removeEventListener('pointerup', up); hd.removeEventListener('pointercancel', up);
      row.classList.remove('dragging');
      const s = get(V.id); const old = s.data.entries || [];
      const order = [...list.children].map(x => old[Number(x.dataset.idx)]);
      if (JSON.stringify(order) !== JSON.stringify(old)) setField(s.id, ['entries'], order, { render: true });
    };
    hd.addEventListener('pointermove', move); hd.addEventListener('pointerup', up); hd.addEventListener('pointercancel', up);
  }));
}

/* ---------- metrónomo ---------- */
const Metro = {
  ctx: null, on: false, timer: null, next: 0, beat: 0, bpm: 120, beats: 4,
  start(bpm, beats) {
    this.ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)(); this.ctx.resume();
    this.bpm = Math.min(300, Math.max(30, bpm || 120)); this.beats = beats || 4; this.beat = 0; this.on = true;
    this.next = this.ctx.currentTime + 0.06; clearInterval(this.timer); this.timer = setInterval(() => this.tick(), 25);
  },
  tick() { while (this.next < this.ctx.currentTime + 0.12) { this.click(this.next, this.beat % this.beats === 0); this.next += 60 / this.bpm; this.beat++; } },
  click(t, acc) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.frequency.value = acc ? 1600 : 1000;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(acc ? 0.9 : 0.45, t + 0.002); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
    o.connect(g).connect(this.ctx.destination); o.start(t); o.stop(t + 0.06);
  },
  stop() { clearInterval(this.timer); this.on = false; }
};
let taps = [];

/* ---------- acciones (clics) ---------- */
const ACT = {
  back: goBack,
  close: () => closeSheet(),
  tab: el => go({ name: el.dataset.v }),
  open: el => go({ name: el.dataset.v, id: el.dataset.id }),
  'cf-ok': () => { const r = cfResolve; cfResolve = null; closeSheet(); r && r(true); },
  'cf-no': () => closeSheet(),
  songFilter: el => { V.st = el.dataset.v; history.replaceState(V, ''); render(); },
  songTab: el => { flushFields(); Metro.stop(); V.tab = el.dataset.v; history.replaceState(V, ''); render(); window.scrollTo(0, 0); },
  recFilter: el => { V.tag = el.dataset.v; history.replaceState(V, ''); render(); },
  quoteDel: async el => {
    if (!await confirmBox('¿Borrar esta cita?', 'Borrar')) return;
    const m = get(el.dataset.id); setField(m.id, ['quotes'], (m.data.quotes || []).filter(q => q.id !== el.dataset.v), { render: true });
  },
  roleToggle: el => {
    const m = get(el.dataset.id); const arr = (m.data.roles || []).slice(); const i = arr.indexOf(el.dataset.v);
    if (i >= 0) arr.splice(i, 1); else arr.push(el.dataset.v); setField(m.id, ['roles'], arr, { render: true });
  },
  liveSub: el => { V.sub = el.dataset.v; history.replaceState(V, ''); render(); },
  async newSong() {
    const t = await askText('Nuevo tema', 'Título'); if (!t) return;
    const id = await createItem('song', { title: t, origin: 'Propia', status: 'Idea', sig: '4/4', parts: [], inst: {} });
    go({ name: 'song', id });
  },
  partAdd: el => { const s = get(V.id); const parts = (s.data.parts || []).concat([{ name: el.dataset.v, bars: null, note: '' }]); setField(s.id, ['parts'], parts, { render: true }); },
  partDel: el => { flushParts(); const s = get(V.id); const parts = (s.data.parts || []).slice(); parts.splice(Number(el.dataset.v), 1); setField(s.id, ['parts'], parts, { render: true }); },
  partMove: el => {
    flushParts(); const [i, d] = el.dataset.v.split(':').map(Number); const s = get(V.id); const parts = (s.data.parts || []).slice(); const j = i + d;
    if (j < 0 || j >= parts.length) return; [parts[i], parts[j]] = [parts[j], parts[i]]; setField(s.id, ['parts'], parts, { render: true });
  },
  metro: el => { const s = get(el.dataset.id); if (Metro.on) Metro.stop(); else Metro.start(Number(s.data.bpm) || 120, parseInt(s.data.sig) || 4); el.textContent = Metro.on ? '■ Parar metrónomo' : '▶ Metrónomo'; },
  tap: el => {
    const now = performance.now(); if (taps.length && now - taps[taps.length - 1] > 2000) taps = []; taps.push(now); taps = taps.slice(-6);
    const info = $('#tapinfo');
    if (taps.length < 3) { info.textContent = 'Sigue tocando al ritmo…'; return; }
    const iv = (taps[taps.length - 1] - taps[0]) / (taps.length - 1); const bpm = Math.round(60000 / iv);
    info.textContent = bpm + ' BPM guardado'; const inp = $('#bpmIn'); if (inp) inp.value = bpm; setField(el.dataset.id, ['bpm'], bpm);
  },
  async trashIt(el) {
    const it = get(el.dataset.id); if (!it) return;
    if (!await confirmBox(`¿Mandar «${esc(itemTitle(it))}» a la papelera?`, 'Mandar a la papelera', true, `<p class="small muted">${isAdmin() ? 'Podrás recuperarlo desde Grupo → Papelera.' : 'El administrador podrá recuperarlo si hace falta.'}</p>`)) return;
    closeAllSheets(); await trashItem(it.id); toast('En la papelera'); if (['song', 'rehearsal', 'gig', 'setlist'].includes(it.type) && V.id === it.id) goBack();
  },
  history: el => openHistory(el.dataset.id),
  recHere: () => openRecorder({ song_id: V.id }),
  recReh: () => { const r = openRehearsal(); openRecorder({ song_id: r && r.data.current_song, rehearsal_id: r && r.id }); },
  recGig: el => openRecorder({ gig_id: el.dataset.id }),
  play: el => openPlayer(el.dataset.id),
  linkRec: el => openLinkRec(V.id, el.dataset.v),
  viewImg: el => openImage(el.dataset.key, el.dataset.path, el.dataset.list, el.dataset.candel === '1'),
  async newRehearsal() {
    const last = all('rehearsal').sort((a, b) => (b.data.date || '').localeCompare(a.data.date || ''))[0];
    const id = await createItem('rehearsal', { date: isoDay(), time: hhmm(), place: last ? last.data.place || '' : '', duration: '', attendees: members().filter(m => !m.data.guest).map(m => m.id), songs: [], notes: '', open: false });
    go({ name: 'rehearsal', id });
  },
  async openReh(el) {
    for (const r of all('rehearsal').filter(r => r.data.open && r.id !== el.dataset.id)) await setField(r.id, ['open'], false);
    await setField(el.dataset.id, ['open'], true, { render: true }); toast('Ensayo en marcha. Las grabaciones se guardarán aquí.');
  },
  closeReh: el => { setField(el.dataset.id, ['open'], false, { render: true }); toast('Ensayo terminado'); },
  curSong: el => setField(V.id, ['current_song'], el.dataset.id, { render: true }),
  toggleIn: el => {
    const it = get(el.dataset.id); const k = el.dataset.k; const arr = (it.data[k] || []).slice(); const v = el.dataset.v; const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1); else arr.push(v); setField(it.id, [k], arr, { render: true });
  },
  taskDone: el => { const t = get(el.dataset.id); setField(t.id, ['done'], !t.data.done, { render: true }); },
  taskDel: el => trashItem(el.dataset.id),
  async newGig() { const id = await createItem('gig', { date: isoDay(), venue: '', city: '', attendees: members().filter(m => !m.data.guest).map(m => m.id), check: {}, extra_gear: [] }); go({ name: 'gig', id }); },
  gearChk: el => { const g = get(el.dataset.id); setField(g.id, ['check', el.dataset.v], !(g.data.check || {})[el.dataset.v], { render: true }); },
  async newSetlist() { const id = await createItem('setlist', { name: 'Setlist ' + fmtDay(isoDay(), { day: 'numeric', month: 'short' }), entries: [] }); go({ name: 'setlist', id }); },
  slDel: el => { const s = get(V.id); const e = (s.data.entries || []).slice(); e.splice(Number(el.dataset.v), 1); setField(s.id, ['entries'], e, { render: true }); },
  async dupSetlist(el) { const s = get(el.dataset.id); const id = await createItem('setlist', { name: (s.data.name || 'Setlist') + ' (copia)', entries: clone(s.data.entries || []) }); go({ name: 'setlist', id }, 'replace'); toast('Setlist duplicado'); },
  stage: el => openStage(el.dataset.id),

  async newMember(el) {
    const guest = el.dataset.v === '1';
    const nm = guest ? 'Invitado' : 'Colaborador';
    const id = await createItem('member', { name: nm, alias: nm, roles: [], color: COLORS[all('member').length % COLORS.length], guest, notes: '', photos: [], quotes: [] });
    go({ name: 'member', id });
  },
  invite: openInvite,
  accounts: openAccounts,
  bandSettings: openSettings,
  backup: openBackup,
  async restore(el) { await restoreItem(el.dataset.id); toast('Restaurado'); },
  async purge(el) {
    const it = S.items.get(el.dataset.id);
    if (!await confirmBox(`¿Borrar «${esc(itemTitle(it))}» para siempre?`, 'Borrar para siempre', true, '<p class="small muted">No se podrá recuperar.</p>')) return;
    await purgeItem(it.id); toast('Borrado');
  },
  syncNow: async () => { await flush(); if (REMOTE && sb) await pullAll().catch(e => toast('No se pudo sincronizar: ' + errMsg(e))); toast('Sincronizado'); },
  async logout() {
    const extra = S.outbox.length ? `<p class="err">Hay ${S.outbox.length} cambio(s) sin enviar. Si cierras sesión ahora se perderán.</p>` : '';
    if (!await confirmBox('¿Cerrar sesión en este móvil?', 'Cerrar sesión', true, extra)) return;
    await sb.auth.signOut().catch(() => {});
    await Promise.all(['items', 'outbox', 'blobs', 'meta', 'hist'].map(s => DB.clear(s).catch(() => {})));
    location.reload();
  }
};
fab.addEventListener('click', () => {
  const ctx = {};
  if (V.name === 'song') ctx.song_id = V.id;
  if (V.name === 'gig') ctx.gig_id = V.id;
  openRecorder(ctx);
});
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el || el.disabled) return;
  const fn = ACT[el.dataset.a] || REC_ACT[el.dataset.a] || PLAY_ACT[el.dataset.a];
  if (fn) { e.preventDefault(); fn(el, e); }
});
document.addEventListener('submit', async e => {
  const f = e.target;
  if (f.id === 'taskForm') {
    e.preventDefault(); const t = $('#taskText').value.trim(); if (!t) return;
    await createItem('task', { text: t, member: $('#taskWho').value || null, done: false, rehearsal_id: f.dataset.id }); toast('Deber añadido');
  } else if (f.id === 'sepForm') {
    e.preventDefault(); const t = $('#sepText').value.trim(); if (!t) return;
    const s = get(V.id); setField(s.id, ['entries'], (s.data.entries || []).concat([{ k: 'x', text: t }]), { render: true });
  } else if (f.id === 'quoteForm') {
    e.preventDefault(); const t = $('#qText').value.trim(); if (!t) return;
    const m = get(f.dataset.id);
    await setField(m.id, ['quotes'], (m.data.quotes || []).concat([{ id: uuid(), text: t, date: $('#qDate').value || isoDay(), context: $('#qCtx').value.trim() }]), { render: true });
    toast('Cita guardada para la posteridad');
  } else if (f.id === 'roleForm') {
    e.preventDefault(); const v = $('#roleIn').value.trim(); if (!v) return;
    const m = get(f.dataset.id); setField(m.id, ['roles'], [...new Set([...(m.data.roles || []), v])], { render: true });
  } else if (f.id === 'gearForm') {
    e.preventDefault(); const t = $('#gearText').value.trim(); if (!t) return;
    const g = get(V.id); setField(g.id, ['extra_gear'], (g.data.extra_gear || []).concat([t]), { render: true });
  }
});
const CHANGE = {
  rehAdd: el => { if (!el.value) return; const r = get(V.id); setField(r.id, ['songs'], (r.data.songs || []).concat([el.value]), { render: true }); },
  rehAddCur: async el => { if (!el.value) return; const r = get(V.id); await setField(r.id, ['songs'], (r.data.songs || []).concat([el.value])); await setField(r.id, ['current_song'], el.value, { render: true }); },
  slAdd: el => { if (!el.value) return; const s = get(V.id); setField(s.id, ['entries'], (s.data.entries || []).concat([{ k: 's', id: el.value }]), { render: true }); }
};

/* ---------- grabadora ---------- */
const R = { state: 'idle', ctx: {}, mr: null, chunks: [], stream: null, t0: 0, dur: 0, markers: [], raf: 0, actx: null, lock: null, tick: null, blob: null, tags: [], mime: '' };
async function wake() { try { return await navigator.wakeLock.request('screen'); } catch (e) { return null; } }
function openRecorder(ctx = {}) {
  const open = openRehearsal();
  if (open && !ctx.gig_id) { ctx.rehearsal_id = ctx.rehearsal_id || open.id; if (!ctx.song_id) ctx.song_id = open.data.current_song || null; }
  R.ctx = ctx; R.state = 'ready'; R.tags = []; R.markers = []; R.blob = null;
  recEl.hidden = false; drawRec();
}
function recCtxText() {
  const r = get(R.ctx.rehearsal_id), g = get(R.ctx.gig_id);
  return r ? 'Se guardará en el ensayo del ' + fmtDay(r.data.date, { day: 'numeric', month: 'long' }) : g ? 'Se guardará en el concierto de ' + (g.data.venue || fmtDay(g.data.date)) : '';
}
function drawRec() {
  const song = get(R.ctx.song_id);
  const songSel = `<label class="field"><span>Tema</span><select id="recSong"><option value="">Sin asignar</option>${songsSorted().map(s => `<option value="${s.id}" ${s.id === R.ctx.song_id ? 'selected' : ''}>${esc(s.data.title)}</option>`).join('')}</select></label>`;
  if (R.state === 'ready') {
    recEl.innerHTML = `<div class="row between"><h2>Grabar</h2><button class="btn ghost sm" data-a="recClose">Cerrar</button></div>
      ${songSel}<p class="small muted">${esc(recCtxText())}</p>
      <div style="flex:1;display:grid;place-items:center"><button class="bigrec" data-a="recStart">GRABAR</button></div>
      <p class="small muted" style="text-align:center">Deja el móvil quieto y lejos del amplificador para que no sature.</p>`;
    $('#recSong').addEventListener('change', e => { R.ctx.song_id = e.target.value || null; });
  } else if (R.state === 'rec') {
    const parts = (song && song.data.parts || []).map(p => p.name).filter(Boolean);
    recEl.innerHTML = `<div class="row between"><span class="tag rec">● GRABANDO</span><span class="small muted">${esc(song ? song.data.title : 'Sin asignar')}</span></div>
      <div class="timer" id="recT">${mmss((Date.now() - R.t0) / 1000)}</div>
      <div class="meter"><i id="recM"></i></div>
      <div class="stack"><button class="btn block" data-a="recMark" style="min-height:56px">＋ Marcador aquí</button>
      ${parts.length ? `<div class="chips">${[...new Set(parts)].map(p => `<button class="chip" data-a="recMark" data-v="${esc(p)}">${esc(p)}</button>`).join('')}</div>` : ''}
      <div id="recMarks" class="small muted">${R.markers.map(m => mmss(m.t) + ' ' + esc(m.label)).join(' · ')}</div></div>
      <div style="flex:1;display:grid;place-items:center"><button class="bigrec on" data-a="recStop">PARAR</button></div>`;
  } else if (R.state === 'done') {
    const tags = tagsAll();
    const parts = (song && song.data.parts || []).map(p => p.name).filter(Boolean);
    recEl.innerHTML = `<div class="row between"><h2>Guardar grabación</h2><span class="mono muted">${mmss(R.dur)}</span></div>
      <label class="field"><span>Nombre</span><input id="recName" value="${esc(R.name)}"></label>
      ${songSel}
      <div class="field"><span>Etiquetas</span><div class="chips" id="recTags">${tags.map(t => `<button class="chip" data-a="recTag" data-v="${esc(t)}" aria-pressed="${R.tags.includes(t)}">${esc(t)}</button>`).join('')}</div>
      <form class="row" id="recTagF" style="flex-wrap:nowrap"><input id="recTagIn" placeholder="Otra etiqueta" style="flex:1"><button class="btn sm" type="submit">Añadir</button></form></div>
      <label class="field"><span>Parte de la canción</span><select id="recPart"><option value="">—</option>${[...new Set(parts)].map(p => `<option>${esc(p)}</option>`).join('')}</select></label>
      <label class="field"><span>Nota</span><textarea id="recNote" style="min-height:70px"></textarea></label>
      ${R.markers.length ? `<p class="small muted">Marcadores: ${R.markers.map(m => mmss(m.t) + ' ' + esc(m.label)).join(' · ')}</p>` : ''}
      <p class="small muted">${esc(recCtxText())}</p>
      <div class="row"><button class="btn pri" data-a="recSave" style="flex:1">Guardar</button><button class="btn danger" data-a="recDiscard">Descartar</button></div>`;
    $('#recSong').addEventListener('change', e => { R.ctx.song_id = e.target.value || null; });
    $('#recTagF').addEventListener('submit', e => { e.preventDefault(); const v = $('#recTagIn').value.trim(); if (v && !R.tags.includes(v)) { R.tags.push(v); const b = document.createElement('button'); b.className = 'chip'; b.dataset.a = 'recTag'; b.dataset.v = v; b.setAttribute('aria-pressed', 'true'); b.textContent = v; $('#recTags').appendChild(b); } $('#recTagIn').value = ''; });
  }
}
const pickMime = () => ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'].find(m => window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || '';
const extOf = m => (m.includes('mp4') ? 'm4a' : m.includes('ogg') ? 'ogg' : 'webm');
function stopStream() {
  cancelAnimationFrame(R.raf); clearInterval(R.tick);
  if (R.stream) R.stream.getTracks().forEach(t => t.stop()); R.stream = null;
  if (R.actx) { R.actx.close().catch(() => {}); R.actx = null; }
  if (R.lock) { R.lock.release().catch(() => {}); R.lock = null; }
}
const REC_ACT = {
  async recStart() {
    if (!navigator.mediaDevices || !window.MediaRecorder) { toast('Este navegador no permite grabar audio'); return; }
    try { R.stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } }); }
    catch (e) { toast('Sin acceso al micrófono. Revisa los permisos del navegador.'); return; }
    R.mime = pickMime();
    try { R.mr = new MediaRecorder(R.stream, R.mime ? { mimeType: R.mime, audioBitsPerSecond: 64000 } : { audioBitsPerSecond: 64000 }); }
    catch (e) { R.mr = new MediaRecorder(R.stream); }
    R.chunks = [];
    R.mr.ondataavailable = e => { if (e.data && e.data.size) R.chunks.push(e.data); };
    R.mr.onstop = () => {
      R.blob = new Blob(R.chunks, { type: R.mr.mimeType || R.mime || 'audio/webm' });
      stopStream(); R.state = 'done';
      R.name = (get(R.ctx.song_id) ? get(R.ctx.song_id).data.title + ' · ' : 'Toma · ') + hhmm(new Date(R.t0));
      drawRec();
    };
    R.mr.start(1000); R.t0 = Date.now(); R.state = 'rec'; drawRec();
    R.lock = await wake();
    R.tick = setInterval(() => { const t = $('#recT'); if (t) t.textContent = mmss((Date.now() - R.t0) / 1000); }, 250);
    try {
      R.actx = new (window.AudioContext || window.webkitAudioContext)();
      const src = R.actx.createMediaStreamSource(R.stream); const an = R.actx.createAnalyser(); an.fftSize = 1024; src.connect(an);
      const buf = new Float32Array(an.fftSize);
      const loop = () => { an.getFloatTimeDomainData(buf); let s = 0; for (const x of buf) s += x * x; const rms = Math.sqrt(s / buf.length); const m = $('#recM'); if (m) m.style.width = Math.min(100, rms * 320) + '%'; R.raf = requestAnimationFrame(loop); };
      loop();
    } catch (e) {}
  },
  recMark(el) {
    const t = (Date.now() - R.t0) / 1000; const label = el.dataset.v || 'Marca ' + (R.markers.length + 1);
    R.markers.push({ t, label }); const m = $('#recMarks'); if (m) m.textContent = R.markers.map(x => mmss(x.t) + ' ' + x.label).join(' · ');
    if (navigator.vibrate) navigator.vibrate(30);
  },
  recStop() { R.dur = (Date.now() - R.t0) / 1000; if (R.mr && R.mr.state !== 'inactive') R.mr.stop(); },
  recTag(el) { const v = el.dataset.v; const i = R.tags.indexOf(v); if (i >= 0) R.tags.splice(i, 1); else R.tags.push(v); el.setAttribute('aria-pressed', i < 0); },
  async recSave() {
    const id = uuid(), mime = R.blob.type || 'audio/webm', path = `audio/${id}.${extOf(mime)}`;
    const song_id = R.ctx.song_id || null;
    const data = {
      name: $('#recName').value.trim() || 'Grabación', song_id, rehearsal_id: R.ctx.rehearsal_id || null, gig_id: R.ctx.gig_id || null,
      tags: R.tags.slice(), part: $('#recPart').value || '', note: $('#recNote').value.trim(), markers: R.markers.slice(),
      duration: Math.round(R.dur * 10) / 10, mime, size: R.blob.size, path, blob: id, recorded_at: new Date(R.t0).toISOString(),
      uploaded: !REMOTE, ref: false, by_member: S.me.member_id
    };
    await DB.put('blobs', R.blob, id).catch(() => {});
    blobCache.set(id, R.blob);
    await createItem('recording', data, id);
    if (REMOTE) await enqueue({ op: 'upload', key: id, path, mime, item: id });
    const reh = get(data.rehearsal_id);
    if (reh && song_id && !(reh.data.songs || []).includes(song_id)) await setField(reh.id, ['songs'], (reh.data.songs || []).concat([song_id]));
    R.state = 'idle'; R.blob = null; recEl.hidden = true;
    toast(REMOTE && !navigator.onLine ? 'Guardada en el móvil. Se subirá al recuperar la conexión.' : 'Grabación guardada');
    onChange('local');
  },
  async recDiscard() { if (!await confirmBox('¿Descartar esta grabación?', 'Descartar')) return; R.state = 'idle'; R.blob = null; recEl.hidden = true; },
  async recClose() { stopStream(); R.state = 'idle'; recEl.hidden = true; }
};
window.addEventListener('beforeunload', e => { if (R.state === 'rec' || R.state === 'done') { e.preventDefault(); e.returnValue = ''; } });

/* ---------- reproductor ---------- */
const P = { audio: null, id: null, A: null, B: null, raf: 0 };
async function openPlayer(id) {
  const r = get(id); if (!r) return;
  P.id = id; P.A = P.B = null;
  const sh = sheet(`<div id="plWrap" class="player"><p class="muted">Cargando audio…</p></div>`, { onClose: () => { if (P.audio) { P.audio.pause(); P.audio = null; } cancelAnimationFrame(P.raf); }, refresh: () => drawPlayerMeta() });
  let url = null;
  try { url = await getUrl(r.data.blob || r.id, r.data.path); } catch (e) { console.warn(e); }
  if (!sheets.length || P.id !== id) return;
  P.audio = url ? new Audio(url) : null;
  if (P.audio) { P.audio.preload = 'auto'; P.audio.addEventListener('timeupdate', loopCheck); P.audio.addEventListener('ended', () => updPlay()); P.audio.addEventListener('loadedmetadata', () => updPlay()); }
  $('#plWrap', sh).innerHTML = `${url ? `<div class="seek"><input type="range" id="plSeek" min="0" max="1000" value="0" aria-label="Posición"><div class="marks" id="plMarks"></div></div>
    <div class="row between mono small muted"><span id="plCur">0:00</span><span id="plDur">${mmss(r.data.duration)}</span></div>
    <div class="ctl"><button class="icon" data-a="plJump" data-v="-10" aria-label="Atrás 10 segundos">−10</button><button class="play" data-a="plPlay" id="plBtn" aria-label="Reproducir">▶</button><button class="icon" data-a="plJump" data-v="10" aria-label="Adelante 10 segundos">+10</button></div>
    <div class="row between"><div class="chips">${[1, 0.75, 0.5].map(x => `<button class="chip" data-a="plSpeed" data-v="${x}" aria-pressed="${x === 1}">${String(x).replace('.', ',')}x</button>`).join('')}</div>
    <div class="chips"><button class="chip" data-a="plAB" id="plAB">Bucle A-B</button></div></div>` :
    `<p class="err">${REMOTE && !navigator.onLine ? 'Sin conexión: este audio todavía no está en el móvil.' : 'No se ha podido cargar el audio.'}</p>`}
    <div id="plMeta"></div>`;
  const seek = $('#plSeek', sh);
  if (seek) seek.addEventListener('input', () => { if (P.audio && P.audio.duration) P.audio.currentTime = seek.value / 1000 * dur(); });
  drawPlayerMeta(); updPlay();
}
const dur = () => (P.audio && isFinite(P.audio.duration) && P.audio.duration) || (get(P.id) && get(P.id).data.duration) || 1;
function loopCheck() { if (P.A != null && P.B != null && P.audio.currentTime >= P.B) P.audio.currentTime = P.A; }
function updPlay() {
  if (!P.audio) return;
  const b = $('#plBtn'); if (b) b.textContent = P.audio.paused ? '▶' : '❚❚';
  const c = $('#plCur'); if (c) c.textContent = mmss(P.audio.currentTime);
  const s = $('#plSeek'); if (s && document.activeElement !== s) s.value = Math.round(P.audio.currentTime / dur() * 1000);
  const r = get(P.id); const mk = $('#plMarks');
  if (mk && r) mk.innerHTML = (r.data.markers || []).map(m => `<i style="left:${Math.min(100, m.t / dur() * 100)}%"></i>`).join('') + [P.A, P.B].filter(x => x != null).map(x => `<i class="ab" style="left:${x / dur() * 100}%"></i>`).join('');
  cancelAnimationFrame(P.raf); if (!P.audio.paused) P.raf = requestAnimationFrame(updPlay);
}
function drawPlayerMeta() {
  const r = get(P.id); const box = $('#plMeta'); if (!r || !box) return;
  const d = r.data, id = r.id; const song = get(d.song_id);
  const parts = (song && song.data.parts || []).map(p => p.name).filter(Boolean);
  const tags = [...new Set([...tagsAll(), ...(d.tags || [])])];
  box.innerHTML = `<div class="stack">
    <label class="field"><span>Nombre</span><input data-f="${id}|name" value="${esc(d.name)}"></label>
    <p class="small muted">${fmtStamp(d.recorded_at)} · ${mmss(d.duration)} · grabada por ${esc(whoName(r.created_by))}${REMOTE && !d.uploaded ? ' · <span style="color:var(--warn)">pendiente de subir</span>' : ''}</p>
    ${(d.markers || []).length ? `<div class="field"><span>Marcadores</span><div class="chips">${d.markers.map(m => `<button class="chip" data-a="plGo" data-v="${m.t}">${mmss(m.t)} ${esc(m.label)}</button>`).join('')}</div></div>` : ''}
    <div class="field"><span>Etiquetas</span><div class="chips">${tags.map(t => `<button class="chip" data-a="plTag" data-v="${esc(t)}" aria-pressed="${(d.tags || []).includes(t)}">${esc(t)}</button>`).join('')}</div></div>
    <label class="field"><span>Tema</span><select data-f="${id}|song_id" id="plSong"><option value="">Sin asignar</option>${songsSorted().map(s => `<option value="${s.id}" ${s.id === d.song_id ? 'selected' : ''}>${esc(s.data.title)}</option>`).join('')}</select></label>
    <label class="field"><span>Parte</span><select data-f="${id}|part"><option value="">—</option>${[...new Set([...parts, d.part].filter(Boolean))].map(p => `<option ${p === d.part ? 'selected' : ''}>${esc(p)}</option>`).join('')}</select></label>
    <label class="field"><span>Nota</span><textarea data-f="${id}|note" style="min-height:70px">${esc(d.note)}</textarea></label>
    <label class="switch"><span>★ Toma de referencia del tema</span><input type="checkbox" data-f="${id}|ref" ${d.ref ? 'checked' : ''}></label>
    <div class="row"><button class="btn ghost" data-a="plDownload">Descargar</button><button class="btn danger" data-a="trashIt" data-id="${id}">Papelera</button></div></div>`;
}
const PLAY_ACT = {
  plPlay() { if (!P.audio) return; if (P.audio.paused) P.audio.play().catch(() => toast('No se puede reproducir este formato en este móvil')); else P.audio.pause(); setTimeout(updPlay, 50); },
  plJump(el) { if (!P.audio) return; P.audio.currentTime = Math.max(0, Math.min(dur(), P.audio.currentTime + Number(el.dataset.v))); updPlay(); },
  plGo(el) { if (!P.audio) return; P.audio.currentTime = Math.max(0, Number(el.dataset.v) - 1); P.audio.play().catch(() => {}); updPlay(); },
  plSpeed(el) { if (!P.audio) return; P.audio.playbackRate = Number(el.dataset.v); try { P.audio.preservesPitch = true; } catch (e) {} $$('[data-a="plSpeed"]').forEach(b => b.setAttribute('aria-pressed', b === el)); },
  plAB(el) {
    if (!P.audio) return; const t = P.audio.currentTime;
    if (P.A == null) { P.A = t; el.textContent = 'Marcar B'; el.setAttribute('aria-pressed', 'true'); }
    else if (P.B == null && t > P.A) { P.B = t; el.textContent = `Bucle ${mmss(P.A)}–${mmss(P.B)} ✕`; P.audio.currentTime = P.A; }
    else { P.A = P.B = null; el.textContent = 'Bucle A-B'; el.setAttribute('aria-pressed', 'false'); }
    updPlay();
  },
  plTag(el) { const r = get(P.id); const arr = (r.data.tags || []).slice(); const i = arr.indexOf(el.dataset.v); if (i >= 0) arr.splice(i, 1); else arr.push(el.dataset.v); setField(r.id, ['tags'], arr); el.setAttribute('aria-pressed', i < 0); },
  async plDownload() {
    const r = get(P.id); const b = await getBlob(r.data.blob || r.id, r.data.path).catch(() => null); if (!b) return toast('Audio no disponible');
    const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = (r.data.name || 'grabacion').replace(/[\\/:*?"<>|]/g, '-') + '.' + extOf(r.data.mime || ''); a.click();
  }
};

/* ---------- enlazar grabación a un instrumento ---------- */
function openLinkRec(songId, k) {
  const s = get(songId); const cur = deepGet(s.data, ['inst', k, 'recs']) || [];
  const recs = recsOf(r => r.data.song_id === songId);
  sheet(`<h3>Enlazar grabaciones</h3>${recs.length ? `<div class="list">${recs.map(r => `<div class="li"><button class="check" data-a="linkToggle" data-v="${r.id}" data-k="${k}" aria-pressed="${cur.includes(r.id)}">${cur.includes(r.id) ? '✓' : ''}</button><span class="grow"><span class="t">${esc(r.data.name)}</span><br><span class="s">${fmtStamp(r.data.recorded_at)} · ${mmss(r.data.duration)}</span></span></div>`).join('')}</div>` : '<p class="muted">Este tema aún no tiene grabaciones.</p>'}<button class="btn" data-a="close">Listo</button>`,
    { onClose: () => onChange('local') });
}
ACT.linkToggle = el => {
  const s = get(V.id); const k = el.dataset.k; const arr = (deepGet(s.data, ['inst', k, 'recs']) || []).slice(); const i = arr.indexOf(el.dataset.v);
  if (i >= 0) arr.splice(i, 1); else arr.push(el.dataset.v); setField(s.id, ['inst', k, 'recs'], arr);
  el.setAttribute('aria-pressed', i < 0); el.textContent = i < 0 ? '✓' : '';
};
async function openImage(key, path, list, canDel) {
  const u = await getUrl(key, path).catch(() => null); if (!u) return toast('Imagen no disponible');
  const v = document.createElement('div'); v.className = 'viewer';
  v.innerHTML = `<img src="${u}" alt=""><div class="row" style="position:absolute;top:calc(12px + env(safe-area-inset-top,0px));right:12px">${canDel && list ? '<button class="btn sm danger" id="imgDel">Quitar</button>' : ''}<button class="btn sm" id="imgClose">Cerrar</button></div>`;
  document.body.appendChild(v);
  $('#imgClose', v).onclick = () => v.remove();
  const del = $('#imgDel', v);
  if (del) del.onclick = async () => {
    if (!await confirmBox('¿Quitar esta imagen?', 'Quitar')) return;
    v.remove(); const [id, p] = list.split('|'); const pa = p.split('.'); const s = get(id);
    const arr = (deepGet(s.data, pa) || []).filter(x => x.key !== key);
    await setField(id, pa, arr, { render: true }); toast('Imagen quitada');
  };
}

/* ---------- historial de versiones ---------- */
async function openHistory(id) {
  const sh = sheet(`<h3>Historial de versiones</h3><div id="hiBox"><p class="muted">Cargando…</p></div>`);
  let h;
  try { h = await itemHistory(id); } catch (e) { $('#hiBox', sh).innerHTML = `<p class="err">No se pudo cargar: ${esc(errMsg(e))}</p>`; return; }
  const box = $('#hiBox', sh); if (!box) return;
  box.innerHTML = h.length ? `<p class="small muted">Cada entrada guarda cómo estaba el tema antes de esa tanda de cambios.</p><div class="list">${h.map((x, i) => `<div class="li"><span class="grow"><span class="t">${esc(whoName(x.changed_by))} ${ACTION_LABEL[x.action] || x.action}</span><br><span class="s">${fmtStamp(x.changed_at)}</span></span>${x.data && x.action !== 'create' ? `<button class="btn sm" data-a="hiView" data-v="${i}">Ver</button>` : ''}</div>`).join('')}</div>` : '<p class="muted">Sin historial todavía.</p>';
  openHistory.cache = { id, h };
}
ACT.hiView = el => {
  const { id, h } = openHistory.cache; const x = h[Number(el.dataset.v)]; const d = x.data || {};
  const blocks = [['Título', d.title], ['Notas', d.notes], ['Estructura', (d.parts || []).map(p => p.name + (p.bars ? ' (' + p.bars + ')' : '')).join(' · ')]];
  INST.forEach(def => def.fields.forEach(([f, l]) => { const v = deepGet(d, ['inst', def.k, f]); if (v) blocks.push([def.name + ' · ' + l, v]); }));
  sheet(`<h3>Versión del ${fmtStamp(x.changed_at)}</h3>${blocks.filter(b => b[1]).map(([l, v]) => `<div class="field"><span>${esc(l)}</span><pre class="mono small" style="white-space:pre-wrap;margin:0;background:var(--surface2);padding:10px;border-radius:10px">${esc(v)}</pre></div>`).join('')}
    <button class="btn pri" data-a="hiRestore" data-v="${el.dataset.v}">Restaurar esta versión</button>`);
};
ACT.hiRestore = async el => {
  const { id, h } = openHistory.cache; const x = h[Number(el.dataset.v)];
  if (!await confirmBox('¿Restaurar esta versión?', 'Restaurar', false, '<p class="small muted">Se sustituye el contenido actual del tema. La versión actual quedará también en el historial.</p>')) return;
  await restoreVersion(id, x.data); closeAllSheets(); toast('Versión restaurada');
};

/* ---------- modo escenario ---------- */
const ST = { id: null, i: 0, lock: null, x0: null };
async function openStage(setlistId) {
  ST.id = setlistId; ST.i = 0; stageEl.hidden = false; drawStage(); ST.lock = await wake();
  try { if (stageEl.requestFullscreen) stageEl.requestFullscreen().catch(() => {}); } catch (e) {}
}
function closeStage() { stageEl.hidden = true; if (ST.lock) ST.lock.release().catch(() => {}); ST.lock = null; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
function drawStage() {
  const sl = get(ST.id); if (!sl) return closeStage();
  const ent = sl.data.entries || []; const e = ent[ST.i]; if (!e) return closeStage();
  const songNum = ent.slice(0, ST.i + 1).filter(x => x.k === 's').length, total = ent.filter(x => x.k === 's').length;
  const nx = ent[ST.i + 1]; const nxt = nx ? (nx.k === 'x' ? '— ' + nx.text + ' —' : (get(nx.id) ? get(nx.id).data.title : '')) : 'Fin del setlist';
  let main;
  if (e.k === 'x') main = `<div class="st-title" style="color:#888">${esc(e.text)}</div>`;
  else {
    const s = get(e.id); const d = s ? s.data : {};
    const bpm = Number(d.bpm);
    main = `<div class="st-title">${esc(d.title || 'Tema borrado')}</div>
      <div class="st-meta">${d.key ? `<span>${esc(d.key)}</span>` : ''}${bpm ? `<span><span class="beat" style="--beat:${(60 / bpm).toFixed(3)}s"></span>${bpm} BPM</span>` : ''}${d.tuning ? `<span>${esc(d.tuning)}</span>` : ''}${d.sig && d.sig !== '4/4' ? `<span>${esc(d.sig)}</span>` : ''}</div>
      ${d.stage_note ? `<div class="st-note">${esc(d.stage_note)}</div>` : ''}`;
  }
  stageEl.innerHTML = `<div class="st-top"><span>${e.k === 's' ? songNum + ' / ' + total : 'PAUSA'}</span><span>${esc(sl.data.name || '')}</span><button class="btn sm" data-a="stClose" style="background:#111;border-color:#333;color:#fff">Salir</button></div>
    <div class="st-main">${main}</div><div class="st-next">Siguiente: ${esc(nxt)}</div>
    <div class="st-nav" style="margin-top:12px"><button data-a="stPrev" ${ST.i ? '' : 'disabled'}>‹ ANTERIOR</button><button data-a="stNext">${nx ? 'SIGUIENTE ›' : 'TERMINAR'}</button></div>`;
}
ACT.stClose = () => closeStage();
ACT.stPrev = () => { if (ST.i > 0) { ST.i--; drawStage(); } };
ACT.stNext = () => { const sl = get(ST.id); if (ST.i < (sl.data.entries || []).length - 1) { ST.i++; drawStage(); } else closeStage(); };
stageEl.addEventListener('pointerdown', e => { ST.x0 = e.clientX; });
stageEl.addEventListener('pointerup', e => { if (ST.x0 == null) return; const dx = e.clientX - ST.x0; ST.x0 = null; if (Math.abs(dx) > 70) (dx < 0 ? ACT.stNext : ACT.stPrev)(); });
document.addEventListener('keydown', e => { if (stageEl.hidden) return; if (e.key === 'ArrowRight' || e.key === ' ') ACT.stNext(); if (e.key === 'ArrowLeft') ACT.stPrev(); if (e.key === 'Escape') closeStage(); });

/* ---------- miembros, cuentas y ajustes ---------- */
async function openInvite() {
  const sh = sheet(`<h3>Invitar al grupo</h3><div id="invBox"><p class="muted">Cargando…</p></div>`);
  const show = code => {
    const url = location.href.split('#')[0].split('?')[0];
    const msg = `Únete a ${(settings() && settings().data.band_name) || 'San Peregrino Squirt'} en la app del grupo:\n1. Abre ${url}\n2. Crea tu cuenta\n3. Usa el código de invitación: ${code}`;
    $('#invBox', sh).innerHTML = `<div class="card" style="text-align:center"><div class="label">Código de invitación</div><div class="mono" style="font-size:2.4rem;letter-spacing:.15em;color:var(--accent)">${esc(code)}</div></div>
      <p class="small muted" style="margin-top:10px">Mándaselo a quien quieras invitar junto con el enlace de la app.</p>
      <div class="row" style="margin-top:10px"><button class="btn pri" id="invCopy">Copiar mensaje</button><button class="btn" id="invNew">Cambiar código</button></div>`;
    $('#invCopy', sh).onclick = () => copyText(msg);
    $('#invNew', sh).onclick = async () => {
      const { data, error } = await sb.rpc('new_invite_code'); if (error) return toast(errMsg(error)); show(data); toast('El código anterior ya no sirve');
    };
  };
  const { data, error } = await sb.rpc('get_invite_code');
  if (error) { $('#invBox', sh).innerHTML = `<p class="err">${esc(errMsg(error))}</p>`; return; }
  show(data);
}
async function openAccounts() {
  const sh = sheet(`<h3>Cuentas</h3><div id="accBox"><p class="muted">Cargando…</p></div>`);
  const load = async () => {
    const { data, error } = await sb.rpc('list_accounts');
    if (error) { $('#accBox', sh).innerHTML = `<p class="err">${esc(errMsg(error))}</p>`; return; }
    const ms = members(true);
    $('#accBox', sh).innerHTML = `<div class="stack">${data.map(a => `<div class="card stack"><div class="row between"><b>${esc(a.email || a.display_name)}</b><span class="tag ${a.role === 'admin' ? 'acc' : ''}">${a.role === 'admin' ? 'Admin' : 'Miembro'}</span></div>
      <label class="field"><span>Ficha de miembro</span><select data-acc="${a.user_id}">${ms.map(m => `<option value="${m.id}" ${m.id === a.member_id ? 'selected' : ''}>${esc(mName(m))}${m.data.guest ? ' (invitado)' : ''}</option>`).join('')}</select></label>
      ${a.user_id !== S.me.uid ? `<div class="row"><button class="btn sm danger" data-kick="${a.user_id}">Expulsar</button><button class="btn sm" data-admin="${a.user_id}">Hacer administrador</button></div>` : '<span class="small muted">Eres tú</span>'}</div>`).join('')}</div>`;
    $$('[data-acc]', sh).forEach(s => s.addEventListener('change', async () => {
      const { error } = await sb.rpc('link_account', { p_user: s.dataset.acc, p_member: s.value }); if (error) return toast(errMsg(error));
      await pullAccounts(); toast('Ficha vinculada'); onChange('local');
    }));
    $$('[data-kick]', sh).forEach(b => b.addEventListener('click', async () => {
      if (!await confirmBox('¿Expulsar esta cuenta del grupo?', 'Expulsar', true, '<p class="small muted">Dejará de ver el contenido. Lo que haya creado se queda.</p>')) return;
      const { error } = await sb.rpc('remove_account', { p_user: b.dataset.kick }); if (error) return toast(errMsg(error));
      await pullAccounts(); toast('Cuenta expulsada'); load();
    }));
    $$('[data-admin]', sh).forEach(b => b.addEventListener('click', async () => {
      if (!await confirmBox('¿Ceder la administración?', 'Ceder administración', true, '<p class="small muted">Esa persona pasará a ser la administradora y tú quedarás como miembro.</p>')) return;
      const { error } = await sb.rpc('transfer_admin', { p_user: b.dataset.admin }); if (error) return toast(errMsg(error));
      S.me.role = 'member'; await pullAccounts(); closeAllSheets(); toast('Administración cedida'); onChange('local');
    }));
  };
  load();
}
function openSettings() {
  const s = settings();
  if (!s) return toast('Ajustes no disponibles todavía');
  const id = s.id;
  sheet(`<h3>Ajustes del grupo</h3>
    <label class="field"><span>Nombre del grupo</span><input data-f="${id}|band_name" value="${esc(s.data.band_name)}"></label>
    <label class="field"><span>Etiquetas de grabación (una por línea)</span><textarea id="setTags" style="min-height:160px">${esc(((s.data.tags && s.data.tags.length) ? s.data.tags : DEFAULT_TAGS).join('\n'))}</textarea></label>
    <label class="field"><span>Material para conciertos (una cosa por línea)</span><textarea id="setGear" style="min-height:180px">${esc(gearAll().join('\n'))}</textarea></label>
    <button class="btn pri" id="setSave">Guardar</button>`);
  $('#setSave').onclick = async () => {
    const lines = v => v.split('\n').map(x => x.trim()).filter(Boolean);
    await setField(id, ['tags'], lines($('#setTags').value)); await setField(id, ['gear'], lines($('#setGear').value));
    closeSheet(); toast('Ajustes guardados'); onChange('local');
  };
}
function openBackup() {
  const sh = sheet(`<h3>Copia de seguridad</h3><p class="small muted">Descarga todo el contenido del grupo. Guárdala en tu ordenador o en la nube de vez en cuando.</p>
    <button class="btn" id="bkJson">Solo datos (rápido)</button><button class="btn pri" id="bkZip">Datos y todos los audios e imágenes (ZIP)</button><p class="small muted" id="bkInfo"></p>`);
  const dl = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); };
  const dataJson = () => JSON.stringify({ app: 'San Peregrino Squirt', exported_at: new Date().toISOString(), items: [...S.items.values()], accounts: S.accounts }, null, 1);
  const stamp = isoDay();
  $('#bkJson', sh).onclick = () => dl(new Blob([dataJson()], { type: 'application/json' }), `sps-datos-${stamp}.json`);
  $('#bkZip', sh).onclick = async () => {
    const info = $('#bkInfo', sh);
    try {
      if (!window.JSZip) { info.textContent = 'Preparando…'; await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
      const zip = new JSZip(); zip.file('datos.json', dataJson());
      const files = [];
      for (const it of S.items.values()) {
        if (it.type === 'recording' && it.data.path) files.push([it.data.blob || it.id, it.data.path, (it.data.name || 'grabacion')]);
        JSON.stringify(it.data).replace(/\{"key":"([^"]+)","path":"(img\/[^"]+)"\}/g, (m, k, p) => { files.push([k, p, 'imagen']); return m; });
      }
      let n = 0;
      for (const [k, p] of files) { n++; info.textContent = `Descargando archivos ${n}/${files.length}…`; const b = await getBlob(k, p).catch(() => null); if (b) zip.file(p, b); }
      info.textContent = 'Comprimiendo…';
      const out = await zip.generateAsync({ type: 'blob' });
      dl(out, `sps-copia-${stamp}.zip`); info.textContent = 'Copia descargada';
    } catch (e) { info.textContent = 'No se pudo crear la copia: ' + errMsg(e); }
  };
}

/* ---------- inicio de sesión ---------- */
function authShell(inner) {
  nav.hidden = true; fab.hidden = true;
  app.innerHTML = `<div class="auth"><img class="logo" src="brand/logo.jpg" alt="San Peregrino Squirt">${inner}</div>`;
}
function renderAuth(mode, st) {
  authMode = mode;
  if (mode === 'login' || mode === 'signup') {
    const su = mode === 'signup';
    authShell(`<h1>${su ? 'Crear cuenta' : 'Entrar'}</h1>
      <form class="stack" id="authF">${su ? '<label class="field"><span>Tu nombre</span><input id="auName" required autocomplete="name"></label>' : ''}
      <label class="field"><span>Email</span><input id="auEmail" type="email" required autocomplete="email"></label>
      <label class="field"><span>Contraseña</span><input id="auPass" type="password" required minlength="6" autocomplete="${su ? 'new-password' : 'current-password'}"></label>
      <p class="err" id="auErr"></p><button class="btn pri block" type="submit">${su ? 'Crear cuenta' : 'Entrar'}</button></form>
      <button class="btn ghost" id="auSwap">${su ? 'Ya tengo cuenta' : 'Soy nuevo: crear cuenta'}</button>
      ${su ? '' : '<button class="btn ghost sm" id="auForgot">He olvidado la contraseña</button>'}`);
    $('#auSwap').onclick = () => renderAuth(su ? 'login' : 'signup');
    if (!su) $('#auForgot').onclick = async () => {
      const em = $('#auEmail').value.trim(); if (!em) { $('#auErr').textContent = 'Escribe tu email primero.'; return; }
      const { error } = await sb.auth.resetPasswordForEmail(em, { redirectTo: location.href.split('#')[0] });
      $('#auErr').textContent = error ? errMsg(error) : 'Te hemos enviado un email para cambiarla.';
    };
    $('#authF').onsubmit = async e => {
      e.preventDefault(); const err = $('#auErr'); err.textContent = '';
      const email = $('#auEmail').value.trim(), password = $('#auPass').value;
      const btn = e.submitter || $('#authF button[type=submit]'); btn.disabled = true;
      try {
        let res;
        if (su) {
          const name = $('#auName').value.trim();
          res = await sb.auth.signUp({ email, password, options: { data: { name } } });
          if (res.error) throw res.error;
          try { localStorage.setItem('sps.name', name); } catch (x) {}
          if (!res.data.session) { err.textContent = 'Cuenta creada. Revisa tu email para confirmarla y vuelve a entrar.'; btn.disabled = false; return; }
        } else {
          res = await sb.auth.signInWithPassword({ email, password });
          if (res.error) throw res.error;
        }
        await afterLogin(res.data.session.user);
      } catch (x) {
        const m = errMsg(x);
        err.textContent = /Invalid login/i.test(m) ? 'Email o contraseña incorrectos.' : /already registered/i.test(m) ? 'Ese email ya tiene cuenta. Entra con él.' : m;
        btn.disabled = false;
      }
    };
  } else if (mode === 'join') {
    let nm = ''; try { nm = localStorage.getItem('sps.name') || ''; } catch (x) {}
    const first = st && !st.admin_exists;
    authShell(`<h1>${first ? 'Crear el grupo' : 'Unirte al grupo'}</h1>
      <p class="muted">${first ? 'Eres el primero en entrar: serás el administrador.' : 'Pide el código de invitación al administrador.'}</p>
      ${first ? '' : `<form class="stack" id="codeF"><label class="field"><span>Código de invitación</span><input id="jCode" required autocomplete="off" style="text-transform:uppercase;letter-spacing:.15em" class="mono"></label><button class="btn pri block" type="submit">Continuar</button></form>`}
      <div id="whoBox"></div><p class="err" id="jErr"></p>
      <button class="btn ghost sm" id="jOut">Cerrar sesión</button>`);
    $('#jOut').onclick = async () => { await sb.auth.signOut(); renderAuth('login'); };
    let code = '';
    const finish = async (memberId, name) => {
      const args = { p_name: name, p_member: memberId || null };
      const { data, error } = first ? await sb.rpc('create_band', { p_band: 'San Peregrino Squirt', ...args }) : await sb.rpc('join_band', { p_code: code, ...args });
      if (error) { $('#jErr').textContent = errMsg(error); return; }
      await enter(data);
    };
    const showWho = async () => {
      $('#jErr').textContent = '';
      const { data, error } = await sb.rpc('unclaimed_members', { p_code: code });
      if (error) { $('#jErr').textContent = errMsg(error); return; }
      const cf = $('#codeF'); if (cf) cf.hidden = true;
      $('#whoBox').innerHTML = `<div class="stack"><div class="label">¿Quién eres?</div>
        ${(data || []).map(m => `<button class="btn block" data-who="${m.id}" data-n="${esc(m.alias || m.name)}" style="justify-content:space-between"><span><b>${esc(m.alias || m.name)}</b> <span class="muted">${esc(m.name || '')}</span></span><span class="muted small">${esc((m.roles || []).join(', '))}</span></button>`).join('')}
        <details class="card"><summary style="cursor:pointer">No estoy en la lista (colaborador)</summary>
        <form class="stack" id="newF" style="margin-top:10px"><label class="field"><span>Tu nombre o alias</span><input id="jName" required value="${esc(nm)}"></label><button class="btn pri" type="submit">Entrar como colaborador</button></form></details></div>`;
      $$('[data-who]').forEach(b => b.onclick = () => finish(b.dataset.who, b.dataset.n));
      $('#newF').onsubmit = e => { e.preventDefault(); finish(null, $('#jName').value.trim()); };
    };
    if (first) showWho();
    else $('#codeF').onsubmit = e => { e.preventDefault(); code = $('#jCode').value.trim(); showWho(); };
  } else if (mode === 'offline') {
    authShell(`<h1>Sin conexión</h1><p class="muted">La primera vez hace falta conexión para entrar. Vuelve a intentarlo cuando tengas cobertura.</p><button class="btn pri" onclick="location.reload()">Reintentar</button>`);
  } else if (mode === 'nolib') {
    authShell(`<h1>Falta conexión</h1><p class="muted">No se ha podido cargar la conexión con la nube. Abre la app con conexión al menos una vez.</p><button class="btn pri" onclick="location.reload()">Reintentar</button>`);
  } else if (mode === 'newpass') {
    authShell(`<h1>Nueva contraseña</h1><form class="stack" id="npF"><input id="npIn" type="password" minlength="6" required autocomplete="new-password" placeholder="Nueva contraseña"><p class="err" id="npErr"></p><button class="btn pri" type="submit">Guardar</button></form>`);
    $('#npF').onsubmit = async e => {
      e.preventDefault(); const { error } = await sb.auth.updateUser({ password: $('#npIn').value });
      if (error) { $('#npErr').textContent = errMsg(error); return; }
      const { data } = await sb.auth.getSession(); await afterLogin(data.session.user);
    };
  }
  hideSplash();
}
async function enter(st) {
  await DB.put('meta', { ...st, uid: S.me.uid }, 'status').catch(() => {});
  S.me.role = st.role; S.me.member_id = st.member_id; S.me.member = true;
  authMode = null; startApp(); startSync().then(() => onChange('remote'));
}
async function afterLogin(user) {
  S.me.uid = user.id; S.me.email = user.email;
  let st = null;
  try { const { data, error } = await sb.rpc('my_status'); if (error) throw error; st = data; await DB.put('meta', { ...st, uid: user.id }, 'status').catch(() => {}); }
  catch (e) { const c = await cachedStatus(); if (c && c.uid === user.id) st = c; }
  if (!st) return renderAuth('offline');
  if (!st.member) return renderAuth('join', st);
  await enter(st);
}

/* ---------- arranque ---------- */
let splashT0 = Date.now();
function hideSplash() {
  const sp = $('#splash'); if (!sp || sp.classList.contains('out')) return;
  setTimeout(() => { sp.classList.add('out'); setTimeout(() => sp.remove(), 500); }, Math.max(0, 900 - (Date.now() - splashT0)));
}
function startApp() {
  authMode = null;
  V = history.state && history.state.name ? history.state : { name: 'home', depth: 0 };
  if (!history.state) history.replaceState(V, '');
  render(); hideSplash();
}
async function boot() {
  await loadLocal();
  onChange = handleChange;
  if (!REMOTE) { await ensureLocalBand(); return startApp(); }
  if (!window.supabase || !window.supabase.createClient) return renderAuth('nolib');
  sb = window.supabase.createClient(CFG.url, CFG.key, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  sb.auth.onAuthStateChange(ev => { if (ev === 'PASSWORD_RECOVERY') setTimeout(() => renderAuth('newpass'), 0); });
  const { data } = await sb.auth.getSession();
  if (!data.session) return renderAuth('login');
  await afterLogin(data.session.user);
}
if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
boot();
