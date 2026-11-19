/*!
 * WP Lead Assistant – widget chat (v0.1)
 * Vanilla JS, nessuna dipendenza, isolato in Shadow DOM.
 *
 * Uso:
 *   <script src="wpla-widget.js" defer
 *     data-endpoint="https://…/webhook/wpla-chat"
 *     data-site-key="impiantirossi-demo"
 *     data-mode="servizi"            (servizi | ecommerce)
 *     data-title="Assistente Impianti Rossi"
 *     data-company="Impianti Rossi"
 *     data-color="#0b5cad"
 *     data-privacy-url="https://…/privacy"
 *     data-fallback-phone="089 000000"
 *     data-fallback-email="info@…"
 *     data-suggestions="Fate manutenzione caldaie?|Dove lavorate?"></script>
 * oppure window.WPLA_CONFIG = { endpoint, siteKey, mode, … } prima dello script.
 *
 * API: window.WPLA.open() · close() · toggle() · reset() · send(testo)
 */
(function () {
  'use strict';
  if (window.WPLA && window.WPLA.__loaded) return;

  // ---------------------------------------------------------------- config
  var script = document.currentScript || document.querySelector('script[data-site-key]');
  var ds = (script && script.dataset) || {};
  // The WordPress plugin owns its endpoint; an old standalone embed must not override it.
  var user = ds.wplaPlugin === 'true' ? {} : (window.WPLA_CONFIG || {});
  var pick = function (k, d) { return user[k] != null ? user[k] : (ds[k] != null && ds[k] !== '' ? ds[k] : d); };

  var cfg = {
    endpoint: pick('endpoint', ''),
    siteKey: pick('siteKey', ''),
    mode: pick('mode', 'servizi') === 'ecommerce' ? 'ecommerce' : 'servizi',
    title: pick('title', 'Assistente virtuale'),
    company: pick('company', ''),
    color: pick('color', '#1f5fbf'),
    position: pick('position', 'right') === 'left' ? 'left' : 'right',
    welcome: pick('welcome', ''),
    privacyUrl: pick('privacyUrl', ''),
    consentText: pick('consentText', ''),
    consentVersion: pick('consentVersion', 'privacy-v1'),
    marketingConsent: String(pick('marketingConsent', 'false')) === 'true',
    fallbackPhone: pick('fallbackPhone', ''),
    fallbackEmail: pick('fallbackEmail', ''),
    launcherLabel: pick('launcherLabel', 'Hai domande? Chiedi a me'),
    suggestions: pick('suggestions', ''),
    open: String(pick('open', 'false')) === 'true',
    timeoutMs: Number(pick('timeoutMs', 30000)) || 30000
  };
  if (typeof cfg.suggestions === 'string') cfg.suggestions = cfg.suggestions.split('|').map(function (s) { return s.trim(); }).filter(Boolean);
  if (!cfg.endpoint || !cfg.siteKey) { console.warn('[WPLA] endpoint e site-key sono obbligatori'); return; }

  var company = cfg.company || 'l\'azienda';
  var WELCOME = cfg.welcome || ('Ciao! Sono l\'assistente virtuale di ' + company + ', un sistema di intelligenza artificiale. ' +
    'Rispondo usando le informazioni presenti su questo sito. Per richieste particolari posso metterti in contatto con una persona del nostro team.');
  var CONSENT = cfg.consentText || ('Per ricontattarti trasmetteremo a ' + company + ' il riepilogo della tua richiesta e i dati di contatto ' +
    'che ci hai indicato, usati solo per rispondere alla tua richiesta.');

  // ---------------------------------------------------------------- stato (sessionStorage, solo per la scheda)
  var KEY = 'wpla:' + cfg.siteKey;
  var store = {
    get: function () { try { return JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) { return null; } },
    set: function (v) { try { sessionStorage.setItem(KEY, JSON.stringify(v)); } catch (e) { /* storage non disponibile */ } },
    del: function () { try { sessionStorage.removeItem(KEY); } catch (e) { /* noop */ } }
  };
  var uuid = function () {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16);
    });
  };
  var fresh = function () { return { sessionId: uuid(), items: [], state: 'domande', profile: {}, done: false, isOpen: false }; };
  var S = store.get() || fresh();
  var save = function () { store.set(S); };

  var utm = (function () {
    try {
      var q = new URLSearchParams(location.search);
      return { source: q.get('utm_source') || '', medium: q.get('utm_medium') || '', campaign: q.get('utm_campaign') || '' };
    } catch (e) { return {}; }
  })();

  // ---------------------------------------------------------------- utilità
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  // Solo link http(s) o percorsi dello stesso sito: niente javascript: o data:
  var safeUrl = function (u) { return /^(https?:\/\/|\/(?!\/))/i.test(String(u || '')) ? String(u) : ''; };
  // Testo del modello: escape, **grassetto**, link http(s), a capo.
  var fmt = function (text) {
    var h = esc(text);
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(https?:\/\/[^\s<]+[^\s<.,;:!?)])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    return h.replace(/\n/g, '<br>');
  };
  var telHref = function (s) { var m = String(s).match(/\+?\d[\d\s]{4,}\d/); return m ? 'tel:' + m[0].replace(/\s/g, '') : ''; };
  var euro = function (n) { return n == null ? 'prezzo su richiesta' : Number(n).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }); };
  var el = function (tag, attrs, html) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null && attrs[k] !== false) e.setAttribute(k, attrs[k] === true ? '' : attrs[k]); });
    if (html != null) e.innerHTML = html;
    return e;
  };

  // ---------------------------------------------------------------- rete
  function post(body) {
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, cfg.timeoutMs) : null;
    var headers = { 'Content-Type': 'application/json' };
    if (/ngrok/.test(cfg.endpoint)) headers['ngrok-skip-browser-warning'] = '1';
    return fetch(cfg.endpoint, { method: 'POST', headers: headers, body: JSON.stringify(body), signal: ctrl && ctrl.signal, credentials: 'omit' })
      .then(function (res) {
        return res.text().then(function (t) {
          var data = null;
          try { data = t ? JSON.parse(t) : null; } catch (e) { data = null; }
          // n8n restituisce 200 con corpo vuoto se il workflow va in errore: è un guasto, non una risposta
          if (!data || typeof data !== 'object') throw new Error('empty_response_' + res.status);
          data.__http = res.status;
          return data;
        });
      })
      .finally(function () { if (timer) clearTimeout(timer); });
  }

  // Le due verticali hanno contratti diversi: li riportiamo a una forma unica.
  function normalize(r) {
    var n = {
      ok: r.ok !== false, status: r.status || '', reply: r.reply || '',
      sources: Array.isArray(r.sources) ? r.sources : [],
      products: [], total: null, action: null,
      emergency: r.emergency_contact || null,
      disclosure: r.show_ai_disclosure && r.ai_disclosure ? r.ai_disclosure : null,
      state: r.conversation_state || null,
      done: r.status === 'lead_captured' || r.status === 'lead_already_sent',
      errors: r.errors || r.validation_errors || []
    };
    if (cfg.mode === 'servizi') {
      var a = r.action;
      if (a && a.type === 'ask_field') n.action = { type: 'ask_field', field: a.field, label: a.label, options: a.options || [] };
      if (a && a.type === 'show_contact_form') {
        n.action = { type: 'contact_form', reason: a.reason || 'lead', consentText: a.consent_text, privacyUrl: a.privacy_url,
          version: a.consent_notice_version, marketing: a.marketing_consent === true, summary: a.summary || [] };
      }
    } else {
      n.products = Array.isArray(r.recommended_setup) ? r.recommended_setup : [];
      n.total = r.estimated_total_eur || null;
      if (n.products.length) n.sources = []; // i link stanno già nelle schede prodotto
      if (r.advisor_profile && typeof r.advisor_profile === 'object') S.profile = r.advisor_profile;
      if (!n.done && (r.needs_contact_capture || r.show_contact_form)) {
        n.action = { type: 'contact_form', reason: r.status === 'ai_unavailable' ? 'handoff' : 'lead',
          privacyUrl: r.privacy_url, version: r.consent_notice_version, marketing: false, summary: [], emailRequired: true };
      }
    }
    return n;
  }

  // ---------------------------------------------------------------- stile
  var CSS = [
    ':host{all:initial}',
    '*{box-sizing:border-box}',
    '.root{--c:' + esc(cfg.color) + ';--ink:#1d2330;--muted:#5b6372;--line:#e3e6ec;--bg:#fff;--soft:#f4f6f9;',
    ' font:15px/1.45 system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;color:var(--ink);',
    ' position:fixed;bottom:20px;' + cfg.position + ':20px;z-index:2147483000}',
    'button,textarea,input{font:inherit;color:inherit}',
    '.launch{display:flex;align-items:center;gap:10px;border:0;cursor:pointer;background:var(--c);color:#fff;',
    ' border-radius:999px;padding:12px 18px 12px 14px;box-shadow:0 6px 24px rgba(16,24,40,.25);font-weight:600}',
    '.launch:hover{filter:brightness(1.08)}',
    '.launch svg{width:24px;height:24px;flex:none}',
    '.launch .lbl{white-space:nowrap}',
    '.panel{position:absolute;bottom:0;' + cfg.position + ':0;width:380px;height:min(620px,calc(100vh - 40px));',
    ' background:var(--bg);border-radius:16px;box-shadow:0 12px 48px rgba(16,24,40,.28);display:flex;flex-direction:column;overflow:hidden}',
    '.panel[hidden],.launch[hidden]{display:none}',
    'header{background:var(--c);color:#fff;padding:14px 12px 12px 16px;display:flex;align-items:center;gap:10px}',
    '.av{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:grid;place-items:center;flex:none}',
    '.av svg{width:20px;height:20px}',
    '.ht{flex:1;min-width:0}',
    '.ht b{display:block;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.ht span{font-size:12px;opacity:.9}',
    '.badge{display:inline-block;background:rgba(255,255,255,.22);border-radius:4px;padding:0 5px;margin-right:4px;font-weight:700;font-size:11px;letter-spacing:.3px}',
    '.ib{background:transparent;border:0;color:#fff;width:34px;height:34px;border-radius:8px;cursor:pointer;display:grid;place-items:center}',
    '.ib:hover{background:rgba(255,255,255,.16)}',
    '.ib svg{width:18px;height:18px}',
    '.log{flex:1;overflow-y:auto;padding:16px 14px 8px;background:var(--soft);display:flex;flex-direction:column;gap:10px}',
    '.notice{background:#fff;border:1px solid var(--line);border-left:4px solid var(--c);border-radius:10px;padding:10px 12px;font-size:13.5px}',
    '.notice a{color:var(--c)}',
    '.msg{max-width:86%;padding:9px 12px;border-radius:14px;word-wrap:break-word;overflow-wrap:anywhere}',
    '.bot{align-self:flex-start;background:#fff;border:1px solid var(--line);border-bottom-left-radius:4px}',
    '.me{align-self:flex-end;background:var(--c);color:#fff;border-bottom-right-radius:4px}',
    '.bot a{color:var(--c)}',
    '.err{align-self:flex-start;background:#fff4f2;border:1px solid #f3c7bf;color:#7a2617}',
    '.err a{color:#7a2617;font-weight:600}',
    '.src{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;font-size:12.5px}',
    '.src span{color:var(--muted)}',
    '.src a{color:var(--c);background:var(--soft);border:1px solid var(--line);border-radius:999px;padding:2px 9px;text-decoration:none}',
    '.src a:hover{text-decoration:underline}',
    '.emg{margin-top:8px;background:#fff7e6;border:1px solid #f5d38a;border-radius:8px;padding:7px 10px;font-size:13.5px}',
    '.emg a{color:#7a4b00;font-weight:700}',
    '.prods{display:flex;flex-direction:column;gap:6px;margin-top:8px}',
    '.prod{display:flex;justify-content:space-between;gap:10px;border:1px solid var(--line);border-radius:8px;padding:7px 10px;text-decoration:none;color:var(--ink);background:var(--soft)}',
    'a.prod:hover{border-color:var(--c)}',
    '.prod b{font-weight:600}',
    '.prod small{display:block;color:var(--muted);font-size:11.5px}',
    '.prod .pr{white-space:nowrap;font-weight:700}',
    '.tot{font-size:13px;color:var(--muted);text-align:right}',
    '.opts{display:flex;flex-wrap:wrap;gap:6px;align-self:flex-start;max-width:92%}',
    '.opt{border:1.5px solid var(--c);color:var(--c);background:#fff;border-radius:999px;padding:6px 12px;cursor:pointer;font-size:14px}',
    '.opt:hover,.opt:focus-visible{background:var(--c);color:#fff}',
    '.form{align-self:stretch;background:#fff;border:1px solid var(--line);border-radius:12px;padding:12px;display:flex;flex-direction:column;gap:8px}',
    '.form h3{margin:0;font-size:15px}',
    '.form ul{margin:0;padding-left:18px;font-size:13.5px;color:var(--muted)}',
    '.form label{font-size:13px;font-weight:600;display:flex;flex-direction:column;gap:3px}',
    '.form input[type=text],.form input[type=email],.form input[type=tel]{border:1px solid #c9ced8;border-radius:8px;padding:8px 10px;font-weight:400;background:#fff}',
    '.form input:focus{outline:2px solid var(--c);outline-offset:0;border-color:var(--c)}',
    '.form .ck{flex-direction:row;align-items:flex-start;gap:8px;font-weight:400;font-size:12.5px;color:var(--ink)}',
    '.form .ck input{margin-top:2px;flex:none;width:16px;height:16px;accent-color:var(--c)}',
    '.form .ck a{color:var(--c)}',
    '.form .hint{font-size:12px;color:var(--muted);margin:0}',
    '.form .fe{color:#a32711;font-size:13px;margin:0}',
    '.row{display:flex;gap:8px}',
    '.pri{flex:1;background:var(--c);color:#fff;border:0;border-radius:8px;padding:10px;font-weight:700;cursor:pointer}',
    '.pri[disabled]{opacity:.6;cursor:wait}',
    '.sec{background:#fff;border:1px solid #c9ced8;border-radius:8px;padding:10px 12px;cursor:pointer}',
    '.typing{align-self:flex-start;background:#fff;border:1px solid var(--line);border-radius:14px;padding:10px 14px;display:flex;gap:4px}',
    '.typing i{width:7px;height:7px;border-radius:50%;background:#9aa3b2;animation:b 1.2s infinite}',
    '.typing i:nth-child(2){animation-delay:.15s}.typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes b{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-4px);opacity:1}}',
    '.sugg{display:flex;flex-wrap:wrap;gap:6px}',
    'form.comp{display:flex;gap:8px;align-items:flex-end;border-top:1px solid var(--line);padding:10px 10px 6px;background:#fff}',
    'textarea{flex:1;resize:none;border:1px solid #c9ced8;border-radius:10px;padding:9px 11px;max-height:120px;min-height:42px;line-height:1.4}',
    'textarea:focus{outline:2px solid var(--c);outline-offset:0;border-color:var(--c)}',
    '.send{width:42px;height:42px;border-radius:10px;border:0;background:var(--c);color:#fff;cursor:pointer;display:grid;place-items:center;flex:none}',
    '.send[disabled]{opacity:.5;cursor:not-allowed}',
    '.send svg{width:20px;height:20px}',
    '.foot{font-size:11.5px;color:var(--muted);text-align:center;padding:0 10px 8px;background:#fff}',
    '.foot a{color:var(--muted)}',
    '.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}',
    ':focus-visible{outline:2px solid var(--c);outline-offset:2px}',
    'header :focus-visible{outline-color:#fff}',
    '@media (max-width:480px){.root{bottom:12px;' + cfg.position + ':12px}',
    ' .root.open{top:0;bottom:0;left:0;right:0}',
    ' .panel{position:fixed;inset:0;width:auto;height:100%;border-radius:0}',
    ' .launch .lbl{display:none}.launch{padding:14px}}',
    '@media (prefers-reduced-motion:reduce){.typing i{animation:none}}'
  ].join('\n');

  var ICON = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/></svg>',
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13h.01M15 13h.01M9 17h6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  // ---------------------------------------------------------------- DOM
  var host = el('div', { id: 'wpla-widget' });
  var shadow = host.attachShadow({ mode: 'open' });
  var style = el('style'); style.textContent = CSS;
  var root = el('div', { 'class': 'root' });
  var launch = el('button', { 'class': 'launch', type: 'button', 'aria-haspopup': 'dialog', 'aria-expanded': 'false',
    'aria-label': 'Apri la chat con l\'assistente virtuale (intelligenza artificiale)' }, ICON.chat + '<span class="lbl">' + esc(cfg.launcherLabel) + '</span>');
  var panel = el('div', { 'class': 'panel', role: 'dialog', 'aria-modal': 'false', 'aria-labelledby': 'wpla-t', hidden: true });
  panel.innerHTML =
    '<header><div class="av">' + ICON.bot + '</div>' +
    '<div class="ht"><b id="wpla-t">' + esc(cfg.title) + '</b><span><span class="badge">AI</span>Risponde con i contenuti del sito</span></div>' +
    '<button class="ib" type="button" data-act="reset" title="Nuova conversazione" aria-label="Nuova conversazione">' + ICON.reset + '</button>' +
    '<button class="ib" type="button" data-act="close" title="Chiudi" aria-label="Chiudi la chat">' + ICON.close + '</button></header>' +
    '<div class="log" role="log" aria-live="polite" aria-relevant="additions"></div>' +
    '<form class="comp" novalidate><label class="sr" for="wpla-in">Scrivi un messaggio</label>' +
    '<textarea id="wpla-in" rows="1" maxlength="1000" placeholder="Scrivi la tua domanda…" autocomplete="off"></textarea>' +
    '<button class="send" type="submit" aria-label="Invia" disabled>' + ICON.send + '</button></form>' +
    '<div class="foot">Risposte generate da un\'intelligenza artificiale: possono contenere imprecisioni.' +
    (safeUrl(cfg.privacyUrl) ? ' <a href="' + esc(cfg.privacyUrl) + '" target="_blank" rel="noopener">Informativa privacy</a>' : '') + '</div>';
  root.appendChild(launch); root.appendChild(panel);
  shadow.appendChild(style); shadow.appendChild(root);

  var log = panel.querySelector('.log');
  var form = panel.querySelector('form.comp');
  var input = panel.querySelector('textarea');
  var sendBtn = panel.querySelector('.send');
  var busy = false;

  // ---------------------------------------------------------------- rendering
  function scroll() { log.scrollTop = log.scrollHeight; }

  function renderItem(it) {
    var node;
    if (it.kind === 'notice') {
      node = el('div', { 'class': 'notice' }, fmt(it.text) +
        (safeUrl(it.privacyUrl) ? ' <a href="' + esc(it.privacyUrl) + '" target="_blank" rel="noopener">Informativa privacy</a>' : ''));
    } else if (it.kind === 'me') {
      node = el('div', { 'class': 'msg me' }, fmt(it.text));
      node.insertBefore(el('span', { 'class': 'sr' }, 'Tu: '), node.firstChild);
    } else if (it.kind === 'error') {
      node = el('div', { 'class': 'msg err', role: 'alert' }, fmt(it.text) + fallbackHtml());
    } else {
      var html = '<span class="sr">Assistente: </span>' + fmt(it.text);
      if (it.emergency) {
        var tel = telHref(it.emergency);
        var num = (String(it.emergency).match(/\+?\d[\d\s]{4,}\d/) || [it.emergency])[0];
        html += '<div class="emg">Numero per le urgenze: ' + (tel ? '<a href="' + tel + '">' + esc(num) + '</a>' : esc(it.emergency)) + '</div>';
      }
      if (it.products && it.products.length) {
        html += '<div class="prods">' + it.products.map(function (p) {
          var inner = '<span><b>' + esc(p.name) + '</b><small>' + esc(p.sku || '') + '</small></span><span class="pr">' + euro(p.price_eur) + '</span>';
          var u = safeUrl(p.url);
          return u ? '<a class="prod" href="' + esc(u) + '" target="_blank" rel="noopener">' + inner + '</a>' : '<div class="prod">' + inner + '</div>';
        }).join('') + (it.total ? '<div class="tot">Totale indicativo: <b>' + euro(it.total) + '</b></div>' : '') + '</div>';
      }
      var src = (it.sources || []).filter(function (s) { return safeUrl(s.url); });
      if (src.length) {
        html += '<div class="src"><span>Fonti:</span>' + src.map(function (s) {
          return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.title || 'pagina') + '</a>';
        }).join('') + '</div>';
      }
      node = el('div', { 'class': 'msg bot' }, html);
    }
    log.appendChild(node);
    return node;
  }

  function fallbackHtml() {
    var parts = [];
    if (cfg.fallbackPhone) parts.push('<a href="' + telHref(cfg.fallbackPhone) + '">' + esc(cfg.fallbackPhone) + '</a>');
    if (cfg.fallbackEmail) parts.push('<a href="mailto:' + esc(cfg.fallbackEmail) + '">' + esc(cfg.fallbackEmail) + '</a>');
    return parts.length ? '<br>Puoi contattarci direttamente: ' + parts.join(' · ') : '';
  }

  function clearInteractive() {
    Array.prototype.forEach.call(log.querySelectorAll('.opts,.form,.sugg'), function (n) { n.remove(); });
  }

  function renderOptions(action) {
    var box = el('div', { 'class': 'opts', role: 'group', 'aria-label': action.label || 'Scegli un\'opzione' });
    action.options.forEach(function (o) {
      var b = el('button', { 'class': 'opt', type: 'button' }, esc(o));
      b.addEventListener('click', function () { send(o); });
      box.appendChild(b);
    });
    log.appendChild(box);
  }

  function renderSuggestions() {
    if (!cfg.suggestions.length) return;
    var box = el('div', { 'class': 'sugg opts', role: 'group', 'aria-label': 'Domande frequenti' });
    cfg.suggestions.forEach(function (s) {
      var b = el('button', { 'class': 'opt', type: 'button' }, esc(s));
      b.addEventListener('click', function () { send(s); });
      box.appendChild(b);
    });
    log.appendChild(box);
  }

  function renderForm(a) {
    var priv = safeUrl(a.privacyUrl) || safeUrl(cfg.privacyUrl);
    var emailReq = a.emailRequired === true;
    var f = el('form', { 'class': 'form', novalidate: true, 'aria-label': 'Modulo di contatto' });
    f.innerHTML =
      '<h3>' + (a.reason === 'handoff' ? 'Ti mettiamo in contatto con il team' : 'Lascia i tuoi contatti') + '</h3>' +
      (a.summary && a.summary.length ? '<p class="hint">Riepilogo della richiesta:</p><ul>' + a.summary.map(function (s) {
        return '<li>' + (s && typeof s === 'object' ? esc(s.label) + ': ' + esc(s.value) : esc(s)) + '</li>';
      }).join('') + '</ul>' : '') +
      '<label>Nome<input type="text" name="cname" autocomplete="name" maxlength="80"></label>' +
      '<label>Email<input type="email" name="email" autocomplete="email" maxlength="200"' + (emailReq ? ' required' : '') + '></label>' +
      '<label>Telefono' + (emailReq ? ' (facoltativo)' : '') + '<input type="tel" name="phone" autocomplete="tel" maxlength="20"></label>' +
      (emailReq ? '' : '<p class="hint">Basta l\'email o il telefono.</p>') +
      '<label class="ck"><input type="checkbox" name="privacy" required><span>' + esc(a.consentText || CONSENT) +
      (priv ? ' <a href="' + esc(priv) + '" target="_blank" rel="noopener">Informativa privacy</a>' : '') + '</span></label>' +
      (a.marketing ? '<label class="ck"><input type="checkbox" name="mkt"><span>Acconsento a ricevere comunicazioni commerciali da ' + esc(company) + '. (Facoltativo)</span></label>' : '') +
      '<p class="fe" role="alert" hidden></p>' +
      '<div class="row"><button class="pri" type="submit">Invia la richiesta</button><button class="sec" type="button" data-act="later">Non ora</button></div>';
    var fe = f.querySelector('.fe');
    var showErr = function (t) { fe.textContent = t; fe.hidden = !t; };
    f.addEventListener('input', function () { if (!fe.hidden) showErr(''); });
    f.addEventListener('change', function () { if (!fe.hidden) showErr(''); });
    f.querySelector('[data-act=later]').addEventListener('click', function () {
      f.remove(); S.pendingForm = null; save(); input.focus();
    });
    f.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var q = function (n) { return f.querySelector('[name=' + n + ']'); };
      var name = q('cname').value.trim(), email = q('email').value.trim(), phone = q('phone').value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      var phoneOk = /^\+?\d{6,15}$/.test(phone.replace(/[\s.\-()/]/g, ''));
      if (emailReq && !emailOk) return showErr('Inserisci un indirizzo email valido.'), q('email').focus();
      if (!emailReq && !emailOk && !phoneOk) return showErr('Serve un\'email o un numero di telefono valido.'), q('email').focus();
      if (email && !emailOk) return showErr('L\'indirizzo email non sembra corretto.'), q('email').focus();
      if (phone && !phoneOk) return showErr('Il numero di telefono non sembra corretto.'), q('phone').focus();
      if (!q('privacy').checked) return showErr('Per inviare la richiesta serve la conferma dell\'informativa.'), q('privacy').focus();
      showErr('');
      submitContact({ name: name, email: email, phone: phone, marketing: !!(q('mkt') && q('mkt').checked), reason: a.reason, version: a.version }, f);
    });
    log.appendChild(f);
    // Non spostare il cursore di chi sta già scrivendo nel modulo
    setTimeout(function () { if (!f.contains(shadow.activeElement)) f.querySelector('[name=cname]').focus(); }, 30);
  }

  function push(it) { S.items.push(it); save(); renderItem(it); scroll(); }

  function typing(on) {
    var t = log.querySelector('.typing');
    if (on && !t) { log.appendChild(el('div', { 'class': 'typing', 'aria-label': 'L\'assistente sta scrivendo' }, '<i></i><i></i><i></i>')); scroll(); }
    if (!on && t) t.remove();
  }

  function setBusy(b) {
    busy = b;
    sendBtn.disabled = b || !input.value.trim() || S.done;
    input.disabled = S.done;
    input.placeholder = S.done ? 'Richiesta inviata. Usa ↻ per una nuova conversazione.' : 'Scrivi la tua domanda…';
  }

  function applyResponse(n) {
    // L'avviso AI è già il primo elemento della chat: quello del server serve solo se manca
    var hasNotice = S.items.some(function (i) { return i.kind === 'notice'; });
    if (n.disclosure && !hasNotice) push({ kind: 'notice', text: n.disclosure, privacyUrl: cfg.privacyUrl });
    if (n.reply) push({ kind: 'bot', text: n.reply, sources: n.sources, emergency: n.emergency, products: n.products, total: n.total });
    if (n.state) S.state = n.state;
    if (n.done) { S.done = true; S.pendingForm = null; }
    S.pendingOptions = null;
    if (n.action && n.action.type === 'ask_field' && n.action.options.length) { S.pendingOptions = n.action; renderOptions(n.action); }
    if (n.action && n.action.type === 'contact_form' && !S.done) { S.pendingForm = n.action; renderForm(n.action); }
    save(); scroll();
  }

  function failure(err, offerForm) {
    console.warn('[WPLA]', err && err.message ? err.message : err);
    push({ kind: 'error', text: offerForm
      ? 'In questo momento non riesco a rispondere. Lasciaci i tuoi contatti e ti risponderemo al più presto.'
      : 'Non sono riuscito a inviare la richiesta: il servizio non risponde. Riprova tra poco.' });
    // Degrado (spec. §12): se il servizio non risponde, il modulo di contatto resta disponibile
    if (offerForm && !S.done) {
      S.pendingForm = { type: 'contact_form', reason: 'handoff', version: cfg.consentVersion, emailRequired: cfg.mode === 'ecommerce' };
      renderForm(S.pendingForm); save(); scroll();
    }
  }

  // ---------------------------------------------------------------- azioni
  function send(text) {
    text = String(text || '').trim().slice(0, 1000);
    if (!text || busy || S.done) return;
    clearInteractive(); S.pendingOptions = null; S.pendingForm = null;
    push({ kind: 'me', text: text });
    input.value = ''; autosize(); setBusy(true); typing(true);
    var body = cfg.mode === 'servizi'
      ? { type: 'message', site_key: cfg.siteKey, session_id: S.sessionId, message: text, page_url: location.href, utm: utm }
      : { site_key: cfg.siteKey, session_id: S.sessionId, message: text, advisor_profile: S.profile || {}, lead_data: {} };
    post(body).then(function (r) {
      typing(false);
      applyResponse(normalize(r));
    }).catch(function (e) { typing(false); failure(e, true); })
      .then(function () { setBusy(false); });
  }

  function submitContact(d, f) {
    if (busy) return;
    var btn = f.querySelector('.pri'); btn.disabled = true; btn.textContent = 'Invio in corso…';
    setBusy(true);
    var version = d.version || cfg.consentVersion;
    var body = cfg.mode === 'servizi'
      ? { type: 'submit_contact', site_key: cfg.siteKey, session_id: S.sessionId, page_url: location.href, utm: utm,
          lead_data: { contact_name: d.name, email: d.email, phone: d.phone, privacy_consent: true,
                       marketing_consent: d.marketing, consent_notice_version: version, reason: d.reason === 'handoff' ? 'handoff' : 'lead' } }
      : { site_key: cfg.siteKey, session_id: S.sessionId, advisor_profile: S.profile || {},
          message: d.reason === 'handoff' ? 'Vorrei parlare con una persona del team.' : 'Vorrei essere ricontattato per questa richiesta.',
          lead_data: { first_name: d.name, email: d.email, phone: d.phone, privacy_consent: true, consent_notice_version: version } };
    post(body).then(function (r) {
      var n = normalize(r);
      if (!n.ok && !n.done) {
        btn.disabled = false; btn.textContent = 'Invia la richiesta';
        var fe = f.querySelector('.fe'); fe.textContent = n.reply || 'Controlla i dati inseriti.'; fe.hidden = false;
        return;
      }
      f.remove();
      if (cfg.mode === 'ecommerce' && !n.done) n.done = r.lead_captured === true || r.status === 'crm_ready';
      n.action = null;
      applyResponse(n);
    }).catch(function (e) {
      btn.disabled = false; btn.textContent = 'Riprova';
      var fe = f.querySelector('.fe');
      fe.innerHTML = 'Il servizio non risponde, la richiesta non è stata inviata.' + fallbackHtml();
      fe.hidden = false;
      console.warn('[WPLA]', e && e.message);
    }).then(function () { setBusy(false); });
  }

  function restore() {
    log.innerHTML = '';
    if (!S.items.length) S.items.push({ kind: 'notice', text: WELCOME, privacyUrl: cfg.privacyUrl });
    S.items.forEach(renderItem);
    if (S.items.length === 1 && !S.done) renderSuggestions();
    if (S.pendingOptions) renderOptions(S.pendingOptions);
    if (S.pendingForm && !S.done) renderForm(S.pendingForm);
    save(); setBusy(false); scroll();
  }

  function open() {
    panel.hidden = false; launch.hidden = true; root.classList.add('open');
    launch.setAttribute('aria-expanded', 'true'); S.isOpen = true; save();
    scroll();
    if (!panel.querySelector('.form')) setTimeout(function () { input.focus(); }, 30);
  }
  function close() {
    panel.hidden = true; launch.hidden = false; root.classList.remove('open');
    launch.setAttribute('aria-expanded', 'false'); S.isOpen = false; save(); launch.focus();
  }
  function reset() { store.del(); S = fresh(); S.isOpen = true; restore(); input.focus(); }

  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 120) + 'px'; }

  launch.addEventListener('click', open);
  panel.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-act]');
    if (!b) return;
    if (b.getAttribute('data-act') === 'close') close();
    if (b.getAttribute('data-act') === 'reset') reset();
  });
  panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); send(input.value); });
  input.addEventListener('input', function () { autosize(); sendBtn.disabled = busy || !input.value.trim() || S.done; });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(input.value); }
  });

  function mount() {
    document.body.appendChild(host);
    restore();
    if (S.isOpen || cfg.open) open();
  }
  if (document.body) mount(); else document.addEventListener('DOMContentLoaded', mount);

  window.WPLA = { __loaded: true, open: open, close: close, toggle: function () { panel.hidden ? open() : close(); },
    reset: reset, send: function (t) { open(); send(t); }, config: cfg };
})();
