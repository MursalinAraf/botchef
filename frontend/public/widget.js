(function () {
  'use strict';

  var MASCOT_CONFIG = {
    pizza:   { emoji: '🍕', primary: '#ef4444', light: '#fee2e2' },
    burger:  { emoji: '🍔', primary: '#f59e0b', light: '#fef3c7' },
    sushi:   { emoji: '🍣', primary: '#ec4899', light: '#fce7f3' },
    curry:   { emoji: '🍛', primary: '#f97316', light: '#ffedd5' },
    bakery:  { emoji: '🥐', primary: '#92400e', light: '#fef9c3' },
    noodles: { emoji: '🍜', primary: '#ca8a04', light: '#fefce8' },
  };

  var SPEECH_MESSAGES = [
    'Hey! Ask me anything! 👋',
    'Our menu is amazing! 🌟',
    'Best deals inside! 🎉',
    'Free delivery nearby! 🚀',
  ];

  var QUICK_REPLIES = ['See the menu 🍽️', 'Opening hours ⏰', 'Delivery info 🚚', 'Current deals 🎉'];

  var CSS = [
    '* { box-sizing: border-box; margin: 0; padding: 0; }',
    'button { cursor: pointer; border: none; background: none; font-family: inherit; }',
    'input { font-family: inherit; }',

    '@keyframes mascotBounce {',
    '  0%, 100% { transform: translateY(0); }',
    '  50% { transform: translateY(-14px); }',
    '}',
    '@keyframes armWaveL {',
    '  0%, 100% { transform: rotate(-30deg); }',
    '  50% { transform: rotate(20deg); }',
    '}',
    '@keyframes armWaveR {',
    '  0%, 100% { transform: rotate(30deg); }',
    '  50% { transform: rotate(-20deg); }',
    '}',
    '@keyframes legSwingL {',
    '  0%, 100% { transform: rotate(-20deg); }',
    '  50% { transform: rotate(12deg); }',
    '}',
    '@keyframes legSwingR {',
    '  0%, 100% { transform: rotate(20deg); }',
    '  50% { transform: rotate(-12deg); }',
    '}',
    '@keyframes sparkleFloat {',
    '  0% { transform: translateY(0) scale(1); opacity: 0.9; }',
    '  100% { transform: translateY(-44px) scale(0); opacity: 0; }',
    '}',
    '@keyframes speechPop {',
    '  0% { transform: scale(0.85) translateY(6px); opacity: 0; }',
    '  100% { transform: scale(1) translateY(0); opacity: 1; }',
    '}',
    '@keyframes pulseRing {',
    '  0% { transform: scale(1); opacity: 0.5; }',
    '  100% { transform: scale(1.8); opacity: 0; }',
    '}',
    '@keyframes rippleAnim {',
    '  0% { transform: scale(0); opacity: 0.5; }',
    '  100% { transform: scale(3.5); opacity: 0; }',
    '}',
    '@keyframes chatWinSpring {',
    '  0% { transform: scale(0.88) translateY(20px); opacity: 0; }',
    '  55% { transform: scale(1.03) translateY(-5px); opacity: 1; }',
    '  75% { transform: scale(0.98) translateY(2px); }',
    '  100% { transform: scale(1) translateY(0); opacity: 1; }',
    '}',
    '@keyframes msgSlide {',
    '  0% { transform: translateY(10px); opacity: 0; }',
    '  100% { transform: translateY(0); opacity: 1; }',
    '}',
    '@keyframes dotBounce {',
    '  0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }',
    '  30% { transform: translateY(-5px); opacity: 1; }',
    '}',

    '.mascot-wrap { position: relative; display: flex; flex-direction: column; align-items: center; width: 80px; }',
    '.speech-bubble { position: absolute; bottom: 100%; right: 0; margin-bottom: 8px; background: white;',
    '  border: 1px solid #f0f0f0; border-radius: 16px 16px 0 16px; padding: 6px 12px;',
    '  box-shadow: 0 4px 12px rgba(0,0,0,0.1); font-size: 11px; color: #374151; white-space: nowrap;',
    '  font-weight: 500; z-index: 10; animation: speechPop 0.25s ease-out forwards; transition: opacity 0.28s; }',
    '.speech-bubble::after { content: ""; position: absolute; bottom: -6px; right: 10px; width: 0; height: 0;',
    '  border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid white; }',
    '.mascot-bounce { cursor: pointer; user-select: none; animation: mascotBounce 0.85s ease-in-out infinite; position: relative; }',
    '.sparkles { position: absolute; inset: 0; pointer-events: none; overflow: visible; }',
    '.sparkle { position: absolute; }',
    '.s1 { top: -4px; left: 0; font-size: 9px; animation: sparkleFloat 2.2s ease-out infinite; }',
    '.s2 { top: 4px; right: 0; font-size: 7px; animation: sparkleFloat 2.2s ease-out 0.75s infinite; }',
    '.s3 { top: 12px; left: 33%; font-size: 10px; animation: sparkleFloat 2.2s ease-out 1.5s infinite; }',
    '.mascot-row { display: flex; align-items: center; position: relative; }',
    '.arm { width: 10px; height: 24px; border-radius: 9999px; transform-origin: top center; }',
    '.arm-l { margin-right: -4px; z-index: 0; animation: armWaveL 0.9s ease-in-out infinite; }',
    '.arm-r { margin-left: -4px; z-index: 0; animation: armWaveR 0.9s ease-in-out 0.35s infinite; }',
    '.mascot-body { width: 52px; height: 52px; border-radius: 50%; display: flex; align-items: center;',
    '  justify-content: center; font-size: 24px; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }',
    '.mascot-legs { display: flex; justify-content: center; gap: 8px; margin-top: 4px; }',
    '.leg { width: 12px; height: 20px; border-radius: 9999px; transform-origin: top center; }',
    '.leg-l { animation: legSwingL 1s ease-in-out infinite; }',
    '.leg-r { animation: legSwingR 1s ease-in-out 0.45s infinite; }',

    '.float-btn { width: 56px; height: 56px; border-radius: 50%; border: none; cursor: pointer;',
    '  display: flex; align-items: center; justify-content: center; color: white;',
    '  box-shadow: 0 8px 24px rgba(0,0,0,0.2); overflow: hidden; position: relative;',
    '  transition: transform 0.15s; flex-shrink: 0; }',
    '.float-btn:hover { transform: scale(1.05); }',
    '.float-btn:active { transform: scale(0.95); }',
    '.float-btn svg { position: relative; z-index: 1; }',
    '.pulse-ring { position: absolute; inset: 0; border-radius: 50%; pointer-events: none;',
    '  animation: pulseRing 1.8s ease-out infinite; }',
    '.pulse-ring-delayed { position: absolute; inset: 0; border-radius: 50%; pointer-events: none;',
    '  animation: pulseRing 1.8s ease-out 0.9s infinite; }',
    '.ripple-el { position: absolute; inset: 0; border-radius: 50%; background: rgba(255,255,255,0.4);',
    '  pointer-events: none; animation: rippleAnim 0.5s ease-out forwards; }',

    '.chat-win { background: white; border-radius: 16px; box-shadow: 0 20px 60px rgba(0,0,0,0.15);',
    '  display: flex; flex-direction: column; overflow: hidden;',
    '  width: min(320px, calc(100vw - 32px)); height: min(520px, 80vh);',
    '  animation: chatWinSpring 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }',
    '@media (min-width: 640px) { .chat-win { width: min(384px, calc(100vw - 32px)); } }',

    '.chat-hdr { display: flex; align-items: center; gap: 12px; padding: 12px 16px; flex-shrink: 0; color: white; }',
    '.hdr-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2);',
    '  display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }',
    '.hdr-info { flex: 1; min-width: 0; }',
    '.hdr-name { font-size: 14px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }',
    '.hdr-status { display: flex; align-items: center; gap: 6px; margin-top: 2px; }',
    '.status-dot { width: 8px; height: 8px; border-radius: 50%; background: #86efac; flex-shrink: 0; }',
    '.status-txt { font-size: 11px; opacity: 0.8; }',
    '.hdr-close { width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.15);',
    '  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;',
    '  color: white; flex-shrink: 0; transition: background 0.15s; }',
    '.hdr-close:hover { background: rgba(255,255,255,0.3); }',

    '.msg-area { flex: 1; overflow-y: auto; padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; }',
    '.msg-area::-webkit-scrollbar { width: 4px; }',
    '.msg-area::-webkit-scrollbar-track { background: transparent; }',
    '.msg-area::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 2px; }',
    '.empty { text-align: center; margin-top: 32px; padding: 0 8px; color: #9ca3af; }',
    '.empty-emoji { font-size: 36px; margin-bottom: 8px; }',
    '.empty-title { font-size: 14px; font-weight: 500; color: #6b7280; }',
    '.empty-hint { font-size: 12px; margin-top: 4px; }',
    '.msg-row { display: flex; animation: msgSlide 0.25s ease-out forwards; }',
    '.msg-row.user { justify-content: flex-end; }',
    '.msg-row.assistant { justify-content: flex-start; }',
    '.msg-grp { display: flex; flex-direction: column; gap: 4px; max-width: 78%; }',
    '.msg-row.user .msg-grp { align-items: flex-end; }',
    '.msg-row.assistant .msg-grp { align-items: flex-start; }',
    '.msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 13px; line-height: 1.5; word-break: break-word; }',
    '.msg-row.user .msg-bubble { color: white; border-bottom-right-radius: 4px; }',
    '.msg-row.assistant .msg-bubble { background: #f3f4f6; color: #1f2937; border-bottom-left-radius: 4px; }',
    '.msg-time { font-size: 10px; color: #9ca3af; padding: 0 4px; }',
    '.typing-ind { display: flex; justify-content: flex-start; }',
    '.typing-dots { background: #f3f4f6; border-radius: 16px 16px 16px 4px; padding: 12px 16px;',
    '  display: flex; align-items: center; gap: 6px; }',
    '.typing-dot { width: 8px; height: 8px; border-radius: 50%; background: #9ca3af;',
    '  animation: dotBounce 1.4s ease-in-out infinite; }',
    '.typing-dot:nth-child(2) { animation-delay: 0.2s; }',
    '.typing-dot:nth-child(3) { animation-delay: 0.4s; }',

    '.qr-wrap { padding: 0 12px 8px; flex-shrink: 0; }',
    '.qr-scroll { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }',
    '.qr-scroll::-webkit-scrollbar { display: none; }',
    '.qr-btn { flex-shrink: 0; font-size: 12px; padding: 6px 12px; border-radius: 9999px;',
    '  border: 1px solid #e5e7eb; background: white; color: #4b5563; cursor: pointer;',
    '  white-space: nowrap; transition: background 0.15s; }',
    '.qr-btn:hover:not(:disabled) { background: #f9fafb; }',
    '.qr-btn:disabled { opacity: 0.4; cursor: default; }',

    '.input-area { padding: 0 12px 12px; flex-shrink: 0; }',
    '.input-wrap { display: flex; align-items: center; gap: 8px; background: #f9fafb;',
    '  border-radius: 12px; padding: 8px 12px; border: 1.5px solid #e5e7eb; transition: border-color 0.15s; }',
    '.input-wrap:focus-within { border-color: var(--brand, #059669); }',
    '.chat-input { flex: 1; background: transparent; border: none; outline: none;',
    '  font-size: 13px; color: #1f2937; font-family: inherit; }',
    '.chat-input::placeholder { color: #9ca3af; }',
    '.chat-input:disabled { opacity: 0.5; }',
    '.send-btn { width: 32px; height: 32px; border-radius: 8px; border: none; cursor: pointer;',
    '  display: flex; align-items: center; justify-content: center; color: white;',
    '  flex-shrink: 0; transition: opacity 0.15s, transform 0.1s; }',
    '.send-btn:hover:not(:disabled) { opacity: 0.9; }',
    '.send-btn:active:not(:disabled) { transform: scale(0.95); }',
    '.send-btn:disabled { opacity: 0.4; cursor: default; }',
    '.err-msg { text-align: center; font-size: 12px; color: #ef4444; background: #fef2f2;',
    '  border-radius: 8px; padding: 8px 12px; }',
  ].join('\n');

  // --- Script attributes ---
  function findScript() {
    if (document.currentScript) return document.currentScript;
    var all = document.querySelectorAll('script[data-bot-id]');
    return all[all.length - 1] || null;
  }

  var script = findScript();
  if (!script) return;
  var botId = script.getAttribute('data-bot-id');
  var apiUrl = (script.getAttribute('data-api-url') || window.location.origin).replace(/\/$/, '');
  if (!botId) return;

  // --- State ---
  var isOpen = false;
  var messages = [];
  var isLoading = false;
  var errorMsg = null;
  var speechIdx = 0;
  var speechTimer = null;
  var restaurant = null;
  var botConfig = {};
  var mascot = MASCOT_CONFIG.pizza;
  var brandColor = '#059669';

  // --- DOM refs ---
  var host = null;
  var shadow = null;
  var rootEl = null;
  var mascotWrap = null;
  var chatWin = null;
  var msgArea = null;
  var inputEl = null;
  var sendBtnEl = null;
  var speechEl = null;
  var floatBtnEl = null;

  // --- Helpers ---
  function mk(tag, cls, styleStr) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (styleStr) e.style.cssText = styleStr;
    return e;
  }

  function fmt(date) {
    return new Intl.DateTimeFormat('en', { hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
  }

  function parseBrandColor(raw) {
    if (!raw) return '#059669';
    var c = raw.replace(/^#/, '');
    return /^[0-9a-f]{6}$/i.test(c) ? '#' + c : '#059669';
  }

  // --- API ---
  function apiFetch() {
    return fetch(apiUrl + '/api/v1/public/restaurants/' + botId, {
      headers: { Accept: 'application/json' },
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (json) {
      return json.data || json;
    });
  }

  function apiChat(history) {
    return fetch(apiUrl + '/api/v1/public/restaurants/' + botId + '/chats', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ messages: history }),
    }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    }).then(function (json) {
      return (json.data || json).response;
    });
  }

  // --- Build widget ---
  function buildWidget() {
    host = mk('div', '', 'position:fixed;bottom:24px;right:24px;z-index:2147483647;');
    document.body.appendChild(host);
    shadow = host.attachShadow({ mode: 'open' });

    var styleTag = document.createElement('style');
    styleTag.textContent = CSS;
    shadow.appendChild(styleTag);

    rootEl = mk('div', '', 'display:flex;flex-direction:column;align-items:flex-end;gap:12px;');
    rootEl.style.setProperty('--brand', brandColor);
    shadow.appendChild(rootEl);

    mascotWrap = buildMascot();
    rootEl.appendChild(mascotWrap);

    floatBtnEl = buildFloatBtn();
    rootEl.appendChild(floatBtnEl);
  }

  function buildMascot() {
    var wrap = mk('div', 'mascot-wrap');

    speechEl = mk('div', 'speech-bubble');
    speechEl.textContent = SPEECH_MESSAGES[0];
    wrap.appendChild(speechEl);

    var charWrap = mk('div', 'mascot-bounce');
    charWrap.setAttribute('role', 'button');
    charWrap.setAttribute('aria-label', 'Open chat');
    charWrap.addEventListener('click', toggleOpen);

    var sparkles = mk('div', 'sparkles');
    ['✦', '★', '✦'].forEach(function (s, i) {
      var sp = mk('span', 'sparkle s' + (i + 1));
      sp.textContent = s;
      sp.style.color = mascot.primary;
      sparkles.appendChild(sp);
    });
    charWrap.appendChild(sparkles);

    var row = mk('div', 'mascot-row');
    var armL = mk('div', 'arm arm-l');
    armL.style.backgroundColor = mascot.primary;
    var body = mk('div', 'mascot-body');
    body.style.cssText = 'background-color:' + mascot.light + ';border:2.5px solid ' + mascot.primary + '44';
    body.textContent = mascot.emoji;
    var armR = mk('div', 'arm arm-r');
    armR.style.backgroundColor = mascot.primary;
    row.appendChild(armL);
    row.appendChild(body);
    row.appendChild(armR);
    charWrap.appendChild(row);

    var legs = mk('div', 'mascot-legs');
    var legL = mk('div', 'leg leg-l');
    legL.style.backgroundColor = mascot.primary + 'bb';
    var legR = mk('div', 'leg leg-r');
    legR.style.backgroundColor = mascot.primary + 'bb';
    legs.appendChild(legL);
    legs.appendChild(legR);
    charWrap.appendChild(legs);

    wrap.appendChild(charWrap);
    return wrap;
  }

  function buildFloatBtn() {
    var btn = mk('button', 'float-btn');
    btn.style.backgroundColor = brandColor;
    setFloatIcon(btn, false);
    btn.addEventListener('click', function () {
      var ripple = mk('span', 'ripple-el');
      btn.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 500);
      toggleOpen();
    });
    return btn;
  }

  function setFloatIcon(btn, open) {
    btn.innerHTML = '';
    btn.setAttribute('aria-label', open ? 'Close chat' : 'Open chat');
    if (!open) {
      var r1 = mk('span', 'pulse-ring');
      r1.style.backgroundColor = brandColor;
      var r2 = mk('span', 'pulse-ring-delayed');
      r2.style.backgroundColor = brandColor;
      btn.appendChild(r1);
      btn.appendChild(r2);
    }
    var icon = mk('span', '', 'display:flex;align-items:center;justify-content:center;position:relative;z-index:1;');
    icon.innerHTML = open
      ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>'
      : '<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>';
    btn.appendChild(icon);
  }

  function buildChatWindow() {
    var win = mk('div', 'chat-win');

    // Header
    var hdr = mk('div', 'chat-hdr');
    hdr.style.backgroundColor = brandColor;
    var avatar = mk('div', 'hdr-avatar');
    avatar.textContent = mascot.emoji;
    var info = mk('div', 'hdr-info');
    var name = mk('p', 'hdr-name');
    name.textContent = (restaurant && restaurant.name) || 'Restaurant Bot';
    var statusRow = mk('div', 'hdr-status');
    var dot = mk('span', 'status-dot');
    var statusTxt = mk('span', 'status-txt');
    statusTxt.textContent = 'Online now';
    statusRow.appendChild(dot);
    statusRow.appendChild(statusTxt);
    info.appendChild(name);
    info.appendChild(statusRow);
    var closeBtn = mk('button', 'hdr-close');
    closeBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    closeBtn.setAttribute('aria-label', 'Close chat');
    closeBtn.addEventListener('click', function () { setOpen(false); });
    hdr.appendChild(avatar);
    hdr.appendChild(info);
    hdr.appendChild(closeBtn);
    win.appendChild(hdr);

    // Messages
    msgArea = mk('div', 'msg-area');
    win.appendChild(msgArea);
    renderMessages();

    // Quick replies
    var qrWrap = mk('div', 'qr-wrap');
    var qrScroll = mk('div', 'qr-scroll');
    QUICK_REPLIES.forEach(function (reply) {
      var btn = mk('button', 'qr-btn');
      btn.textContent = reply;
      btn.addEventListener('click', function () { if (!isLoading) handleSend(reply); });
      qrScroll.appendChild(btn);
    });
    qrWrap.appendChild(qrScroll);
    win.appendChild(qrWrap);

    // Input
    var inputArea = mk('div', 'input-area');
    var inputWrap = mk('div', 'input-wrap');
    inputEl = mk('input', 'chat-input');
    inputEl.type = 'text';
    inputEl.placeholder = 'Type a message...';
    inputEl.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend(inputEl.value);
      }
    });
    inputEl.addEventListener('input', updateSendBtn);
    sendBtnEl = mk('button', 'send-btn');
    sendBtnEl.style.backgroundColor = brandColor;
    sendBtnEl.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg>';
    sendBtnEl.setAttribute('aria-label', 'Send');
    sendBtnEl.disabled = true;
    sendBtnEl.addEventListener('click', function () { handleSend(inputEl.value); });
    inputWrap.appendChild(inputEl);
    inputWrap.appendChild(sendBtnEl);
    inputArea.appendChild(inputWrap);
    win.appendChild(inputArea);

    return win;
  }

  function renderMessages() {
    if (!msgArea) return;
    msgArea.innerHTML = '';

    if (messages.length === 0) {
      var empty = mk('div', 'empty');
      empty.innerHTML =
        '<div class="empty-emoji">' + mascot.emoji + '</div>' +
        '<p class="empty-title">Hi! I\'m your restaurant assistant.</p>' +
        '<p class="empty-hint">Ask me about the menu, hours, or deals!</p>';
      msgArea.appendChild(empty);
    }

    messages.forEach(function (msg) {
      var row = mk('div', 'msg-row ' + msg.role);
      var grp = mk('div', 'msg-grp');
      var bubble = mk('div', 'msg-bubble');
      bubble.textContent = msg.content;
      if (msg.role === 'user') bubble.style.backgroundColor = brandColor;
      var time = mk('span', 'msg-time');
      time.textContent = fmt(msg.timestamp);
      grp.appendChild(bubble);
      grp.appendChild(time);
      row.appendChild(grp);
      msgArea.appendChild(row);
    });

    if (isLoading) {
      var ind = mk('div', 'typing-ind');
      var dots = mk('div', 'typing-dots');
      for (var i = 0; i < 3; i++) dots.appendChild(mk('div', 'typing-dot'));
      ind.appendChild(dots);
      msgArea.appendChild(ind);
    }

    if (errorMsg) {
      var errEl = mk('p', 'err-msg');
      errEl.textContent = errorMsg;
      msgArea.appendChild(errEl);
    }

    msgArea.scrollTop = msgArea.scrollHeight;
  }

  function updateSendBtn() {
    if (sendBtnEl) sendBtnEl.disabled = !inputEl || !inputEl.value.trim() || isLoading;
  }

  // --- Handlers ---
  function handleSend(text) {
    var trimmed = (text || '').trim();
    if (!trimmed || isLoading) return;
    if (inputEl) inputEl.value = '';
    updateSendBtn();

    messages = messages.concat([{ role: 'user', content: trimmed, timestamp: new Date() }]);
    isLoading = true;
    errorMsg = null;
    renderMessages();

    var history = messages.map(function (m) { return { role: m.role, content: m.content }; });
    apiChat(history).then(function (response) {
      messages = messages.concat([{ role: 'assistant', content: response, timestamp: new Date() }]);
    }).catch(function () {
      errorMsg = 'Something went wrong. Please try again.';
    }).then(function () {
      isLoading = false;
      updateSendBtn();
      renderMessages();
      errorMsg = null;
    });
  }

  function toggleOpen() { setOpen(!isOpen); }

  function setOpen(open) {
    isOpen = open;

    if (mascotWrap) mascotWrap.style.display = isOpen ? 'none' : '';

    if (chatWin) { chatWin.remove(); chatWin = null; msgArea = null; inputEl = null; sendBtnEl = null; }
    if (isOpen) {
      chatWin = buildChatWindow();
      rootEl.insertBefore(chatWin, mascotWrap);
      if (inputEl) inputEl.focus();
    }

    if (floatBtnEl) setFloatIcon(floatBtnEl, isOpen);
    if (isOpen) stopSpeech(); else startSpeech();
  }

  // --- Speech ---
  function startSpeech() {
    stopSpeech();
    speechTimer = setInterval(function () {
      if (!speechEl) return;
      speechEl.style.opacity = '0';
      setTimeout(function () {
        speechIdx = (speechIdx + 1) % SPEECH_MESSAGES.length;
        if (!speechEl) return;
        speechEl.textContent = SPEECH_MESSAGES[speechIdx];
        speechEl.style.opacity = '1';
        speechEl.style.animation = 'none';
        void speechEl.offsetHeight;
        speechEl.style.animation = '';
      }, 280);
    }, 3000);
  }

  function stopSpeech() {
    clearInterval(speechTimer);
    speechTimer = null;
  }

  // --- Mobile layout ---
  function applyLayout() {
    if (!host) return;
    var mobile = window.innerWidth < 480;
    host.style.right = mobile ? '12px' : '24px';
    host.style.bottom = mobile ? '12px' : '24px';
  }

  // --- Init ---
  function init(data) {
    restaurant = data;
    botConfig = data.bot_config || {};
    mascot = MASCOT_CONFIG[botConfig.mascot_type] || MASCOT_CONFIG.pizza;
    brandColor = parseBrandColor(botConfig.brand_color);
    buildWidget();
    applyLayout();
    window.addEventListener('resize', applyLayout);
    startSpeech();
  }

  function bootstrap() {
    apiFetch()
      .then(init)
      .catch(function (err) { console.warn('[BotChef] Widget failed to load:', err); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
  } else {
    bootstrap();
  }
})();
