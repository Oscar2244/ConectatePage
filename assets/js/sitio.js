// ═══════════════════════════════════════════════════
// coNETate — página de presentación
// La demo es una simulación en el navegador: no hay servidor ni router,
// y nada de lo que se escribe sale de esta página.
// ═══════════════════════════════════════════════════
(function () {
  'use strict';

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = t => String(t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icono = (id, extra) => `<svg${extra ? ' ' + extra : ''}><use href="#i-${id}"/></svg>`;
  const movReducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const guardar = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  const leer = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };

  // ─── TEMA ───────────────────────────────────────────
  $('#btnTema').addEventListener('click', () => {
    const nuevo = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    const aplicar = () => document.documentElement.setAttribute('data-theme', nuevo);
    if (document.startViewTransition && !movReducido) document.startViewTransition(aplicar); else aplicar();
    guardar('conetate_web_tema', nuevo);
  });

  // ─── BARRA SUPERIOR: vidrio al bajar ────────────────
  const nav = $('#nav');
  const medirNav = () => nav.classList.toggle('vidrio', scrollY > 8);
  addEventListener('scroll', medirNav, { passive: true });
  medirNav();

  // ─── APARICIÓN AL BAJAR Y CONTADORES ────────────────
  function contar(el) {
    const fin = +el.dataset.contar, suf = el.dataset.sufijo || '';
    if (movReducido) { el.textContent = fin + suf; return; }
    const t0 = performance.now(), dur = 1200;
    (function paso(t) {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(fin * e) + suf;
      if (p < 1) requestAnimationFrame(paso);
    })(t0);
  }
  const obs = new IntersectionObserver(entradas => {
    entradas.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      if (el.classList.contains('paso')) {
        const i = $$('.paso').indexOf(el);
        setTimeout(() => el.classList.add('visible'), movReducido ? 0 : i * 140);
      } else el.classList.add('visible');
      $$('[data-contar]', el).forEach(contar);
      obs.unobserve(el);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.revelar, .paso').forEach(el => obs.observe(el));

  // Brillo que sigue al mouse en las tarjetas de funciones
  $$('.funcion').forEach(el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }));

  // ─── CAPTURAS ───────────────────────────────────────
  $$('[data-cap]').forEach(b => b.addEventListener('click', () => {
    $$('[data-cap]').forEach(x => x.setAttribute('aria-selected', x === b));
    $$('[data-capv]').forEach(f => f.classList.toggle('activa', f.dataset.capv === b.dataset.cap));
  }));

  // ═══════════════════════════════════════════════════
  // DEMO
  // ═══════════════════════════════════════════════════
  const MI_IP = '192.168.99.57';
  const MIN = 60000;

  const SERVICIOS = [
    { id: 'tiktok',    nombre: 'TikTok',    dominio: 'tiktok.com',    color: '#111111', letra: 'T', dominios: 3 },
    { id: 'instagram', nombre: 'Instagram', dominio: 'instagram.com', color: 'linear-gradient(135deg,#F58529,#DD2A7B 55%,#8134AF)', ic: 'camera', dominios: 2 },
    { id: 'youtube',   nombre: 'YouTube',   dominio: 'youtube.com',   color: '#E62117', ic: 'yt', dominios: 4 },
    { id: 'facebook',  nombre: 'Facebook',  dominio: 'facebook.com',  color: '#1877F2', letra: 'f', dominios: 3 },
    { id: 'roblox',    nombre: 'Roblox',    dominio: 'roblox.com',    color: '#3A3A3A', ic: 'game', dominios: 2 },
    { id: 'netflix',   nombre: 'Netflix',   dominio: 'netflix.com',   color: '#B20710', ic: 'film', dominios: 2 },
    { id: 'chatgpt',   nombre: 'ChatGPT',   dominio: 'chatgpt.com',   color: '#10A37F', ic: 'spark', dominios: 2 },
    { id: 'whatsapp',  nombre: 'WhatsApp',  dominio: 'whatsapp.com',  color: '#25D366', ic: 'msg', dominios: 3 },
    { id: 'spotify',   nombre: 'Spotify',   dominio: 'spotify.com',   color: '#1DB954', ic: 'note', dominios: 2 }
  ];
  const APPS = ['youtube', 'tiktok', 'instagram', 'whatsapp', 'roblox', 'chatgpt', 'netflix', 'wikipedia', 'spotify'];
  const WIKI = { id: 'wikipedia', nombre: 'Wikipedia', dominio: 'wikipedia.org', color: '#5A6270', ic: 'book' };
  const servicio = id => id === 'wikipedia' ? WIKI : SERVICIOS.find(s => s.id === id);
  const logoServicio = s => s.ic ? icono(s.ic) : s.letra;

  const MARCAS = [
    { id: 'azul', nombre: 'Azul', c: '#0055A4' }, { id: 'verde', nombre: 'Verde', c: '#0F7A4F' },
    { id: 'naranja', nombre: 'Naranja', c: '#C2410C' }, { id: 'violeta', nombre: 'Violeta', c: '#6D3FD1' },
    { id: 'vino', nombre: 'Vino', c: '#A61E3A' }, { id: 'turquesa', nombre: 'Turquesa', c: '#0E7490' }
  ];

  const MISIONES = [
    { id: 'conectar',  texto: 'Tocá la red «Instituto Ejemplo» en el celular y entrá con los datos de prueba.', lado: 'celular' },
    { id: 'sesiones',  texto: 'En el panel, abrí «Sesiones» y buscá tu celular entre los conectados.', lado: 'panel' },
    { id: 'bloquear',  texto: 'En «Control de red» bloqueá TikTok y probá abrirlo desde el navegador del celular.', lado: 'panel' },
    { id: 'cerrar',    texto: 'Desde «Sesiones», cerrá la sesión de tu celular y mirá qué pasa en el teléfono.', lado: 'panel' },
    { id: 'visitante', texto: 'En el portal tocá «Solicitar acceso como visitante» y aprobá el pedido desde «Usuarios».', lado: 'celular' },
    { id: 'marca',     texto: 'En «Configuración» cambiá el color o el nombre de la organización y mirá el portal.', lado: 'panel' }
  ];

  let S;          // estado de la demo
  let sonido = leer('conetate_web_sonido') !== '0';

  function estadoInicial() {
    const ahora = Date.now();
    return {
      usuarios: [
        { ci: '4567890', nombre: 'María González', correo: 'maria@ejemplo.com', activo: true, tipo: 'regular' },
        { ci: '5132759', nombre: 'Juan Pérez', correo: 'juan.perez@ejemplo.com', activo: true, tipo: 'regular' },
        { ci: '3876543', nombre: 'Lucía Benítez', correo: 'lucia.b@ejemplo.com', activo: true, tipo: 'regular' },
        { ci: '4321098', nombre: 'Sofía Martínez', correo: 'sofi.martinez@ejemplo.com', activo: true, tipo: 'regular' },
        { ci: '6012345', nombre: 'Diego Ramírez', correo: 'diego.r@ejemplo.com', activo: false, tipo: 'regular' }
      ],
      sesiones: [
        { id: 1, ci: '5132759', equipo: 'phone', nombreEq: 'Galaxy-A54', ip: '192.168.99.31', inicio: ahora - 42 * MIN, activa: true },
        { id: 2, ci: '3876543', equipo: 'phone', nombreEq: 'iPhone de Lucía', ip: '192.168.99.44', inicio: ahora - 15 * MIN, activa: true },
        { id: 3, ci: '4321098', equipo: 'laptop', nombreEq: 'NOTEBOOK-SOFI', ip: '192.168.99.52', inicio: ahora - 80 * MIN, activa: true }
      ],
      sigSesion: 4,
      bloqueos: { instagram: true, roblox: true },
      solicitudes: [],
      eventos: [
        { t: ahora - 80 * MIN, sev: 'ok', tit: 'Ingreso al portal', desc: 'Sofía Martínez entró desde NOTEBOOK-SOFI' },
        { t: ahora - 64 * MIN, sev: 'info', tit: 'Regla creada', desc: 'Administración bloqueó Roblox desde el catálogo' },
        { t: ahora - 42 * MIN, sev: 'ok', tit: 'Ingreso al portal', desc: 'Juan Pérez entró desde Galaxy-A54' },
        { t: ahora - 31 * MIN, sev: 'mal', tit: 'Acceso denegado', desc: 'CI 6012345 intentó entrar con el acceso desactivado' },
        { t: ahora - 15 * MIN, sev: 'ok', tit: 'Ingreso al portal', desc: 'Lucía Benítez entró desde iPhone de Lucía' }
      ],
      sesionesHoy: 12, intentosBloq: 3,
      cel: { pantalla: 'redes', sesionId: null, solicitudId: null, consumo: 0, conectadoWifi: false },
      marca: 'azul', org: 'Instituto Ejemplo', titulo: 'Portal de acceso a internet',
      misiones: {}, vistaPanel: 'dashboard',
      trafico: { entra: Array(40).fill(0).map(() => 3 + Math.random() * 3), sale: Array(40).fill(0).map(() => 2.6 + Math.random() * 2.6) },
      cpu: 18, ram: 41
    };
  }

  const usuario = ci => S.usuarios.find(u => u.ci === ci);
  const sesionesActivas = () => S.sesiones.filter(s => s.activa);
  const miSesion = () => S.sesiones.find(s => s.id === S.cel.sesionId && s.activa);
  const tono = ci => { let h = 0; for (const c of ci) h = (h * 31 + c.charCodeAt(0)) % 360; return (h >= 40 && h < 120) ? h + 90 : h; };
  const iniciales = n => n.split(/\s+/).slice(0, 2).map(p => p[0] || '').join('').toUpperCase();
  const hora = t => new Date(t).toLocaleTimeString('es-PY', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  function duracion(ms) {
    const m = Math.max(0, Math.floor(ms / MIN));
    return m < 60 ? m + ' min' : Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  }
  function reloj(ms) {
    const s = Math.max(0, Math.floor(ms / 1000)), h = Math.floor(s / 3600);
    const mm = String(Math.floor(s / 60) % 60).padStart(2, '0'), ss = String(s % 60).padStart(2, '0');
    return h ? h + ':' + mm + ':' + ss : mm + ':' + ss;
  }

  // ─── AVISOS ─────────────────────────────────────────
  const TOAST_IC = { ok: 'check', mal: 'x-circle', aviso: 'bell', info: 'wifi' };
  function toast(tipo, titulo, texto, alTocar) {
    const t = document.createElement('div');
    t.className = 'toast ' + tipo + (alTocar ? ' boton' : '');
    t.innerHTML = icono(TOAST_IC[tipo] || 'bell') + `<div><b>${esc(titulo)}</b>${texto ? `<span>${esc(texto)}</span>` : ''}</div>`;
    if (alTocar) { t.setAttribute('role', 'button'); t.tabIndex = 0; t.addEventListener('click', () => { alTocar(); quitar(); }); }
    const caja = $('#toasts');
    caja.appendChild(t);
    while (caja.children.length > 3) caja.firstChild.remove();
    const quitar = () => { t.classList.add('sale'); setTimeout(() => t.remove(), 300); };
    setTimeout(quitar, alTocar ? 7000 : 4200);
  }

  let notiTimer;
  function notiCel(titulo, texto, ic, alTocar) {
    const n = $('#celNoti');
    $('#celNotiTit').textContent = titulo;
    $('#celNotiTxt').textContent = texto;
    n.querySelector('use').setAttribute('href', '#i-' + (ic || 'wifi'));
    n.onclick = () => { n.classList.remove('ver'); if (alTocar) alTocar(); };
    n.classList.add('ver');
    clearTimeout(notiTimer);
    notiTimer = setTimeout(() => n.classList.remove('ver'), 3800);
  }

  // Aviso en la pestaña que no se ve (solo cuando la demo está partida en dos, en pantallas angostas)
  function avisarLado(lado) {
    const demo = $('#demo-app');
    if (getComputedStyle($('.demo-cambiar')).display === 'none') return;
    if (demo.dataset.vista !== lado) $(lado === 'panel' ? '#avisoPanel' : '#avisoCel').classList.add('ver');
  }

  // Ding-dong sintetizado (como el del panel real), solo después de una interacción
  let ctxAudio;
  function dingDong() {
    if (!sonido) return;
    try {
      ctxAudio = ctxAudio || new (window.AudioContext || window.webkitAudioContext)();
      const t0 = ctxAudio.currentTime;
      [[880, 0], [698.5, 0.22]].forEach(([f, d]) => {
        const o = ctxAudio.createOscillator(), g = ctxAudio.createGain();
        o.type = 'sine'; o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t0 + d);
        g.gain.exponentialRampToValueAtTime(0.22, t0 + d + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + d + 0.7);
        o.connect(g).connect(ctxAudio.destination);
        o.start(t0 + d); o.stop(t0 + d + 0.75);
      });
    } catch (e) {}
  }

  function evento(sev, tit, desc) {
    S.eventos.push({ t: Date.now(), sev, tit, desc, nuevo: true });
    pintarEventos();
  }

  // ─── MISIONES ───────────────────────────────────────
  let misionVista = null;   // la que se eligió tocando un círculo
  function completar(id) {
    if (S.misiones[id]) return;
    S.misiones[id] = true;
    misionVista = null;
    pintarMision();
    const el = $('#misionMbopi');
    if (window.Mbopi && el) Mbopi.ping(el);
  }
  function pintarMision() {
    const pendiente = MISIONES.findIndex(m => !S.misiones[m.id]);
    const hechas = MISIONES.filter(m => S.misiones[m.id]).length;
    const i = misionVista != null ? misionVista : pendiente;
    if (i === -1) {
      $('#misionNum').textContent = '¡Demo completa!';
      $('#misionTexto').textContent = 'Recorriste todo lo principal. Así funciona coNETate en una institución real.';
    } else {
      $('#misionNum').textContent = `Misión ${i + 1} de ${MISIONES.length}` + (S.misiones[MISIONES[i].id] ? ' · hecha' : '') + ` · ${hechas} completas`;
      $('#misionTexto').textContent = MISIONES[i].texto;
    }
    $('#misionPasos').innerHTML = MISIONES.map((m, k) =>
      `<button type="button" data-mis="${k}" class="${S.misiones[m.id] ? 'hecho' : ''}${k === i ? ' actual' : ''}" aria-label="Misión ${k + 1}${S.misiones[m.id] ? ', hecha' : ''}">${S.misiones[m.id] ? icono('check') : k + 1}</button>`).join('');
  }
  $('#misionPasos').addEventListener('click', e => {
    const b = e.target.closest('[data-mis]');
    if (!b) return;
    misionVista = +b.dataset.mis;
    pintarMision();
    const lado = MISIONES[misionVista].lado;
    if (getComputedStyle($('.demo-cambiar')).display !== 'none') verLado(lado);
  });

  // ─── CAMBIO CELULAR / PANEL (pantallas angostas) ────
  function verLado(lado) {
    $('#demo-app').dataset.vista = lado;
    $$('.demo-cambiar [data-ver]').forEach(b => b.setAttribute('aria-selected', b.dataset.ver === lado));
    $(lado === 'panel' ? '#avisoPanel' : '#avisoCel').classList.remove('ver');
    // Al cambiar de lado cambia el alto de la página: volver a dejar los botones a la vista
    const tabs = $('.demo-cambiar');
    if (tabs.getBoundingClientRect().top < 64) tabs.scrollIntoView({ block: 'start' });
  }
  $$('.demo-cambiar [data-ver]').forEach(b => b.addEventListener('click', () => verLado(b.dataset.ver)));

  // ═══ CELULAR ═══════════════════════════════════════
  function irCel(pantalla) {
    S.cel.pantalla = pantalla;
    $$('.cel-vista').forEach(v => v.classList.toggle('activa', v.dataset.cel === pantalla));
    const v = $(`.cel-vista[data-cel="${pantalla}"]`);
    if (v) v.scrollTop = 0;
    if (pantalla === 'portal') { $('#portalError').classList.remove('ver'); }
    pintarWifiCel();
  }
  function pintarWifiCel() {
    const conectado = S.cel.conectadoWifi;
    $('#celWifiIc').setAttribute('href', conectado ? '#i-wifi' : '#i-wifi-off');
    $('#celWifiAlerta').hidden = !conectado || !!miSesion();
  }
  $$('[data-volver]').forEach(b => b.addEventListener('click', () => {
    const destino = b.dataset.volver;
    if ((destino === 'bienvenida' || destino === 'navegador') && !miSesion()) return irCel('portal');
    irCel(destino);
  }));

  $('#btnRed').addEventListener('click', () => {
    S.cel.conectadoWifi = true;
    pintarWifiCel();
    const red = $('#btnRed small');
    red.textContent = 'Conectando…';
    setTimeout(() => {
      red.textContent = 'Conectado, sin internet';
      notiCel('Iniciá sesión en la red', S.org, 'wifi', () => irCel('portal'));
      setTimeout(() => { if (S.cel.pantalla === 'redes') irCel('portal'); }, 1300);
    }, 700);
  });

  $('#btnPista').addEventListener('click', () => {
    $('#pCi').value = '4567890';
    $('#pCorreo').value = 'maria@ejemplo.com';
    $('#formPortal button[type="submit"]').focus();
  });

  function errorPortal(txt) {
    const e = $('#portalError');
    e.textContent = txt;
    e.classList.remove('ver'); void e.offsetWidth; e.classList.add('ver');
  }

  $('#formPortal').addEventListener('submit', e => {
    e.preventDefault();
    const ci = $('#pCi').value.replace(/\D/g, '');
    const correo = $('#pCorreo').value.trim().toLowerCase();
    if (!ci || !correo) return errorPortal('Completá tu cédula y tu correo.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return errorPortal('El correo no parece válido.');
    const u = usuario(ci);
    if (!u) {
      S.intentosBloq++;
      evento('mal', 'Acceso denegado', `CI ${ci} no está registrada`);
      pintarKpis();
      return errorPortal('Tu cédula no está registrada. Podés pedir acceso como visitante.');
    }
    if (!u.activo) {
      S.intentosBloq++;
      evento('mal', 'Acceso denegado', `${u.nombre} intentó entrar con el acceso desactivado`);
      pintarKpis();
      return errorPortal('Tu acceso está desactivado. Consultá con la administración.');
    }
    if (u.correo !== correo) return errorPortal('El correo no coincide con el registrado para esa cédula.');
    abrirSesionCel(u, 'Mi celular');
  });

  function abrirSesionCel(u, nombreEq) {
    const s = { id: S.sigSesion++, ci: u.ci, equipo: 'phone', nombreEq, ip: MI_IP, inicio: Date.now(), activa: true, mia: true };
    S.sesiones.push(s);
    S.cel.sesionId = s.id;
    S.cel.consumo = 0.4;
    S.sesionesHoy++;
    evento('ok', 'Ingreso al portal', `${u.nombre} entró desde ${nombreEq} (${MI_IP})`);
    evento('info', 'IP autorizada en el MikroTik', `${MI_IP} agregada a la lista «autorizados»`);
    $('#pCi').value = ''; $('#pCorreo').value = '';
    pintarBienvenida();
    irCel('bienvenida');
    toast('ok', `${u.nombre} se conectó`, `Desde ${nombreEq} · ${MI_IP}`, () => irPanel('sesiones'));
    avisarLado('panel');
    pintarTodo();
    completar('conectar');
  }

  function pintarBienvenida() {
    const s = miSesion();
    if (!s) return;
    const u = usuario(s.ci);
    $('#bvNombre').textContent = '¡Listo, ' + u.nombre.split(' ')[0] + '!';
    const vence = $('#bvVence');
    if (u.vence) {
      vence.hidden = false;
      vence.querySelector('span').textContent = 'Acceso hasta las ' + hora(u.vence);
    } else vence.hidden = true;
    const max = u.maxDisp || +$('#cfgDisp').value;
    const mias = sesionesActivas().filter(x => x.ci === u.ci).length;
    $('#bvDisp').textContent = mias + ' de ' + max;
  }

  $('#btnSalirCel').addEventListener('click', () => {
    const s = miSesion();
    if (!s) return irCel('portal');
    cerrarSesion(s, 'usuario');
  });
  $('#btnNavegar').addEventListener('click', () => irCel('navegador'));

  // Navegador del celular
  $('#apps').innerHTML = APPS.map(id => {
    const s = servicio(id);
    return `<button class="app" type="button" data-app="${id}"><span style="background:${s.color}">${logoServicio(s)}</span><span>${s.nombre}</span></button>`;
  }).join('');
  let sitioActual = null;
  $('#apps').addEventListener('click', e => {
    const b = e.target.closest('[data-app]');
    if (b) abrirSitio(b.dataset.app);
  });
  $('#btnRecargar').addEventListener('click', () => sitioActual && abrirSitio(sitioActual));

  function abrirSitio(id) {
    if (!miSesion()) return irCel('portal');
    sitioActual = id;
    const s = servicio(id);
    $('#sitioUrl').textContent = s.dominio;
    const caja = $('#sitio');
    if (S.bloqueos[id]) {
      caja.className = 'sitio bloqueado';
      caja.innerHTML = `<div class="sitio-logo">${icono('ban')}</div><h4>No se puede acceder a este sitio</h4>
        <p><b>${esc(s.dominio)}</b> está bloqueado por la red de ${esc(S.org)}.</p>
        <span class="codigo-error">DNS → 127.0.0.1 · ERR_CONNECTION_REFUSED</span>`;
      S.intentosBloq++;
      const u = usuario(miSesion().ci);
      evento('aviso', 'Sitio bloqueado', `${u.nombre} intentó abrir ${s.dominio}`);
      pintarKpis();
      if (id === 'tiktok') completar('bloquear');
    } else {
      caja.className = 'sitio';
      caja.innerHTML = `<div class="sitio-logo" style="background:${s.color}">${logoServicio(s)}</div><h4>${esc(s.nombre)}</h4>
        <p>La página cargó correctamente.</p><div class="esqueleto"><i></i><i></i><i></i></div>`;
      S.cel.consumo += 2 + Math.random() * 6;
      S.navegandoHasta = Date.now() + 9000;
    }
    irCel('sitio');
  }

  // Visitante
  $('#btnIrVisitante').addEventListener('click', () => irCel('visitante'));
  $('#btnPistaVis').addEventListener('click', () => {
    $('#vNombre').value = 'Carlos Benítez';
    $('#vCi').value = '3214567';
    $('#vMotivo').value = 'Reunión con dirección';
  });
  $('#formVisitante').addEventListener('submit', e => {
    e.preventDefault();
    const nombre = $('#vNombre').value.trim().replace(/\s+/g, ' ').slice(0, 40);
    const ci = $('#vCi').value.replace(/\D/g, '');
    const motivo = $('#vMotivo').value.trim().slice(0, 80) || 'Sin motivo';
    const err = $('#visError');
    const mal = t => { err.textContent = t; err.classList.remove('ver'); void err.offsetWidth; err.classList.add('ver'); };
    if (nombre.length < 3) return mal('Escribí tu nombre y apellido.');
    if (ci.length < 5 || ci.length > 8) return mal('La cédula debe tener entre 5 y 8 números.');
    if (usuario(ci) && usuario(ci).tipo === 'regular') return mal('Esa cédula ya está registrada: entrá desde el portal.');
    err.classList.remove('ver');
    const sol = { id: Date.now(), nombre, ci, motivo, t: Date.now(), estado: 'pendiente' };
    S.solicitudes.push(sol);
    S.cel.solicitudId = sol.id;
    evento('aviso', 'Solicitud de visitante', `${nombre} (CI ${ci}) pidió acceso: «${motivo}»`);
    $('#formVisitante').reset();
    irCel('espera');
    dingDong();
    toast('aviso', 'Nueva solicitud de visitante', `${nombre} pide acceso. Tocá para verla.`, () => irPanel('usuarios'));
    avisarLado('panel');
    pintarTodo();
  });
  $('#btnCancelarSol').addEventListener('click', () => {
    const sol = S.solicitudes.find(x => x.id === S.cel.solicitudId);
    if (sol && sol.estado === 'pendiente') {
      sol.estado = 'cancelada';
      evento('info', 'Solicitud cancelada', `${sol.nombre} canceló su solicitud`);
    }
    S.cel.solicitudId = null;
    irCel('portal');
    pintarTodo();
  });

  // ═══ PANEL ═════════════════════════════════════════
  const TITULOS = {
    dashboard: ['Dashboard', 'Resumen general del sistema en tiempo real'],
    usuarios: ['Usuarios', 'Personas habilitadas para usar la red'],
    sesiones: ['Sesiones', 'Quién está conectado ahora y desde qué equipo'],
    red: ['Control de red', 'Bloqueo de sitios y aplicaciones por DNS'],
    auditoria: ['Auditoría', 'Todo lo que pasó, con quién y cuándo'],
    config: ['Configuración', 'Marca, textos del portal y límites']
  };
  function irPanel(v) {
    S.vistaPanel = v;
    $$('.pd-item').forEach(b => { if (b.dataset.pd === v) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
    $$('.pd-vista').forEach(x => x.classList.toggle('activa', x.dataset.pdv === v));
    $('#pdTitulo').textContent = TITULOS[v][0];
    $('#pdSub').textContent = TITULOS[v][1];
    $('#pdUrl').textContent = '192.168.99.10:8000/admin/' + (v === 'red' ? 'control-red' : v === 'config' ? 'configuracion' : v);
    if (v === 'sesiones' && miSesion()) completar('sesiones');
    if (getComputedStyle($('.demo-cambiar')).display !== 'none') verLado('panel');
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pd]');
    if (b) irPanel(b.dataset.pd);
  });

  function cambiarKpi(id, valor) {
    const k = $(id), b = k.querySelector('b');
    if (b.textContent !== String(valor)) {
      b.textContent = valor;
      k.classList.remove('cambio'); void k.offsetWidth; k.classList.add('cambio');
    }
  }
  function pintarKpis() {
    const pend = S.solicitudes.filter(x => x.estado === 'pendiente').length;
    cambiarKpi('#kpiCon', sesionesActivas().length);
    cambiarKpi('#kpiHoy', S.sesionesHoy);
    cambiarKpi('#kpiSol', pend);
    cambiarKpi('#kpiBloq', S.intentosBloq);
    $('#badgeSes').textContent = sesionesActivas().length || '';
    $('#badgeSol').textContent = pend || '';
  }

  function pintarEventos() {
    const fila = e => `<li class="${e.nuevo ? 'nuevo' : ''}"><span class="sev ${e.sev}"></span><span><b style="font-weight:600">${esc(e.tit)}</b><span class="ev-desc">${esc(e.desc)}</span></span><small>${hora(e.t)}</small></li>`;
    const orden = S.eventos.slice().reverse();
    $('#evDash').innerHTML = orden.slice(0, 5).map(fila).join('');
    $('#evTodos').innerHTML = orden.map(fila).join('');
    $('#cantEv').textContent = S.eventos.length + ' eventos';
    S.eventos.forEach(e => { e.nuevo = false; });
  }

  function avatar(u) { return `<span class="avatar" style="--h:${tono(u.ci)}">${esc(iniciales(u.nombre))}</span>`; }

  function pintarUsuarios() {
    const pend = S.solicitudes.filter(x => x.estado === 'pendiente');
    $('#solicitudes').innerHTML = pend.map(sol => `
      <div class="solicitud" data-sol="${sol.id}">
        ${avatar(sol)}
        <div class="info"><b>${esc(sol.nombre)}</b> pide acceso como visitante<span>CI ${esc(sol.ci)} · «${esc(sol.motivo)}» · ${hora(sol.t)}</span></div>
        <select aria-label="Vigencia del acceso" data-vig><option value="30">30 minutos</option><option value="60" selected>1 hora</option><option value="fin">Hasta el fin del día</option></select>
        <div class="acciones"><button class="btn btn-ok btn-chico" type="button" data-aprobar>${icono('check')}Aprobar</button><button class="btn btn-peligro btn-chico" type="button" data-rechazar>Rechazar</button></div>
      </div>`).join('');
    $('#cantUsu').textContent = S.usuarios.length + ' personas';
    $('#tablaUsu').innerHTML = S.usuarios.map(u => {
      const est = u.tipo === 'visitante'
        ? `<span class="estado vis">Visitante${u.vence ? ' · hasta ' + hora(u.vence) : ''}</span>`
        : u.activo ? '<span class="estado ok">Activo</span>' : '<span class="estado no">Inactivo</span>';
      return `<tr class="${u.nuevo ? 'nuevo' : ''}"><td><div class="persona">${avatar(u)}<div><b>${esc(u.nombre)}</b><small>${esc(u.correo || 'sin correo')}</small></div></div></td>
        <td class="oculto-cq">${esc(u.ci)}</td><td>${est}</td>
        <td><div class="acciones"><label class="interruptor verde" title="${u.activo ? 'Desactivar' : 'Activar'} el acceso"><input type="checkbox" data-activo="${esc(u.ci)}" ${u.activo ? 'checked' : ''} aria-label="Acceso de ${esc(u.nombre)}"><span></span></label></div></td></tr>`;
    }).join('');
    S.usuarios.forEach(u => { u.nuevo = false; });
  }

  $('#solicitudes').addEventListener('click', e => {
    const caja = e.target.closest('[data-sol]');
    if (!caja) return;
    const sol = S.solicitudes.find(x => x.id === +caja.dataset.sol);
    if (!sol || sol.estado !== 'pendiente') return;
    if (e.target.closest('[data-aprobar]')) aprobar(sol, caja.querySelector('[data-vig]').value);
    else if (e.target.closest('[data-rechazar]')) rechazar(sol);
  });

  function aprobar(sol, vig) {
    sol.estado = 'aprobada';
    let vence;
    if (vig === 'fin') { const d = new Date(); d.setHours(23, 59, 0, 0); vence = d.getTime(); }
    else vence = Date.now() + (+vig) * MIN;
    let u = usuario(sol.ci);
    if (!u) { u = { ci: sol.ci, nombre: sol.nombre, correo: '', activo: true, tipo: 'visitante', nuevo: true }; S.usuarios.push(u); }
    u.activo = true; u.tipo = 'visitante'; u.vence = vence; u.maxDisp = 1;
    evento('ok', 'Solicitud aprobada', `Administración aprobó a ${sol.nombre} hasta las ${hora(vence)}`);
    toast('ok', 'Visitante aprobado', `${sol.nombre} ya tiene internet hasta las ${hora(vence)}`);
    completar('visitante');
    if (S.cel.solicitudId === sol.id) {
      S.cel.solicitudId = null;
      abrirSesionCel(u, 'Mi celular');
      notiCel('¡Solicitud aprobada!', 'Ya tenés acceso a internet', 'check', () => irCel('bienvenida'));
      avisarLado('celular');
    }
    pintarTodo();
  }
  function rechazar(sol) {
    sol.estado = 'rechazada';
    evento('mal', 'Solicitud rechazada', `Administración rechazó a ${sol.nombre}`);
    toast('mal', 'Solicitud rechazada', sol.nombre);
    if (S.cel.solicitudId === sol.id) {
      S.cel.solicitudId = null;
      $('#rechMotivo').textContent = 'Motivo: «Acercate a recepción para registrarte».';
      irCel('rechazada');
      avisarLado('celular');
    }
    pintarTodo();
  }

  $('#tablaUsu').addEventListener('change', e => {
    const c = e.target.closest('[data-activo]');
    if (!c) return;
    const u = usuario(c.dataset.activo);
    u.activo = c.checked;
    evento(u.activo ? 'ok' : 'aviso', u.activo ? 'Usuario activado' : 'Usuario desactivado', `Administración ${u.activo ? 'activó' : 'desactivó'} a ${u.nombre}`);
    if (!u.activo) sesionesActivas().filter(s => s.ci === u.ci).forEach(s => cerrarSesion(s, 'admin', true));
    toast(u.activo ? 'ok' : 'aviso', u.activo ? 'Acceso activado' : 'Acceso desactivado', u.nombre + (u.activo ? ' puede volver a conectarse' : ': se cerraron sus sesiones'));
    pintarTodo();
  });

  function pintarSesiones() {
    const act = sesionesActivas().slice().sort((a, b) => (b.mia ? 1 : 0) - (a.mia ? 1 : 0) || b.inicio - a.inicio);
    $('#cantSes').textContent = act.length + (act.length === 1 ? ' abierta' : ' abiertas');
    if (!act.length) {
      $('#tablaSes').innerHTML = `<tr><td colspan="4"><div class="vacio"><span data-mbopi="no_encontrado" data-mbopi-ficha="no"></span>No hay nadie conectado ahora.</div></td></tr>`;
      if (window.Mbopi) Mbopi.montar($('#tablaSes'));
      return;
    }
    $('#tablaSes').innerHTML = act.map(s => {
      const u = usuario(s.ci);
      return `<tr class="${s.nueva ? 'nuevo' : ''}"><td><div class="persona">${avatar(u)}<div><b>${esc(u.nombre)}${s.mia ? ' <span class="estado vis" style="margin-left:4px">tu celular</span>' : ''}</b><small>CI ${esc(u.ci)}</small></div></div></td>
        <td class="oculto-cq"><span class="equipo">${icono(s.equipo)}${esc(s.nombreEq)}</span><br><small style="color:var(--text3);font-size:11.5px">${s.ip}</small></td>
        <td data-dur="${s.inicio}" style="font-variant-numeric:tabular-nums">${duracion(Date.now() - s.inicio)}</td>
        <td><div class="acciones"><button class="btn btn-peligro btn-chico" type="button" data-cerrar="${s.id}">${icono('logout')}Cerrar</button></div></td></tr>`;
    }).join('');
  }
  $('#tablaSes').addEventListener('click', e => {
    const b = e.target.closest('[data-cerrar]');
    if (!b) return;
    const s = S.sesiones.find(x => x.id === +b.dataset.cerrar);
    if (s && s.activa) cerrarSesion(s, 'admin');
  });

  function cerrarSesion(s, por, silencio) {
    s.activa = false;
    const u = usuario(s.ci);
    const quien = por === 'admin' ? 'Administración' : u.nombre;
    evento(por === 'admin' ? 'aviso' : 'info', 'Sesión cerrada', `${quien} cerró la sesión de ${u.nombre} (${s.nombreEq})`);
    evento('info', 'IP revocada en el MikroTik', `${s.ip} quitada de la lista «autorizados»`);
    if (s.id === S.cel.sesionId) {
      S.cel.sesionId = null;
      irCel('portal');
      if (por === 'admin') {
        notiCel('Tu sesión fue cerrada', 'El administrador cerró tu acceso a internet', 'logout');
        avisarLado('celular');
        completar('cerrar');
        if (!silencio) toast('ok', 'Sesión cerrada', `${u.nombre} ya no tiene internet en ${s.nombreEq}`);
      }
    } else if (por === 'admin' && !silencio) toast('ok', 'Sesión cerrada', `${u.nombre} · ${s.nombreEq}`);
    pintarTodo();
  }

  function pintarCatalogo() {
    const n = SERVICIOS.filter(s => S.bloqueos[s.id]).length;
    $('#cantBloq').textContent = n + (n === 1 ? ' bloqueado' : ' bloqueados');
    $('#catalogo').innerHTML = SERVICIOS.map(s => `
      <div class="servicio ${S.bloqueos[s.id] ? 'bloq' : ''}">
        <span class="s-logo" style="background:${s.color}">${logoServicio(s)}</span>
        <div><b>${s.nombre}</b><small>${S.bloqueos[s.id] ? 'Bloqueado' : 'Permitido'} · ${s.dominios} dominios</small></div>
        <label class="interruptor" title="Bloquear ${s.nombre}"><input type="checkbox" data-bloq="${s.id}" ${S.bloqueos[s.id] ? 'checked' : ''} aria-label="Bloquear ${s.nombre}"><span></span></label>
      </div>`).join('');
  }
  $('#catalogo').addEventListener('change', e => {
    const c = e.target.closest('[data-bloq]');
    if (!c) return;
    const s = servicio(c.dataset.bloq);
    S.bloqueos[s.id] = c.checked;
    evento('info', c.checked ? 'Regla creada' : 'Regla eliminada', `Administración ${c.checked ? 'bloqueó' : 'desbloqueó'} ${s.nombre} (${s.dominio} y ${s.dominios - 1} más)`);
    toast('ok', `${s.nombre} ${c.checked ? 'bloqueado' : 'permitido'}`, `Se envió al MikroTik la lista completa de dominios bloqueados`);
    pintarCatalogo();
    if (sitioActual === s.id && S.cel.pantalla === 'sitio') abrirSitio(s.id);
  });

  // Configuración: marca y textos
  $('#colores').innerHTML = MARCAS.map(m => `<button class="color-op" type="button" style="--c:${m.c}" data-color="${m.id}" aria-pressed="${m.id === 'azul'}" aria-label="${m.nombre}" title="${m.nombre}"></button>`).join('');
  $('#colores').addEventListener('click', e => {
    const b = e.target.closest('[data-color]');
    if (!b) return;
    S.marca = b.dataset.color;
    $$('#colores [data-color]').forEach(x => x.setAttribute('aria-pressed', x === b));
    $('#demo-app').dataset.marca = S.marca;
    evento('info', 'Marca actualizada', `Color de la marca: ${b.title}`);
    toast('ok', 'Marca actualizada', 'El portal ya muestra el color nuevo');
    completar('marca');
  });
  let textoTimer;
  function textosPortal() {
    S.org = $('#cfgOrg').value.trim() || 'Instituto Ejemplo';
    S.titulo = $('#cfgTit').value.trim() || 'Portal de acceso a internet';
    $$('.org-nombre').forEach(el => { el.textContent = S.org; });
    $('#portalTitulo').textContent = S.titulo;
    clearTimeout(textoTimer);
    textoTimer = setTimeout(() => { evento('info', 'Textos del portal', `Organización: «${S.org}»`); completar('marca'); }, 900);
  }
  $('#cfgOrg').addEventListener('input', textosPortal);
  $('#cfgTit').addEventListener('input', textosPortal);
  $('#cfgDisp').addEventListener('change', () => { pintarBienvenida(); toast('ok', 'Límite actualizado', `${$('#cfgDisp').value} dispositivos por persona`); });
  $('#cfgTol').addEventListener('change', () => toast('ok', 'Tolerancia actualizada', 'Se aplica en la próxima revisión (cada 30 s)'));

  // ─── GRÁFICO Y ANILLOS ──────────────────────────────
  function pintarGrafico() {
    const g = $('#grafico'), W = 300, H = 140;
    const { entra, sale } = S.trafico;
    const max = Math.max(10, ...entra, ...sale) * 1.15;
    const pts = arr => arr.map((v, i) => `${(i / (arr.length - 1) * W).toFixed(1)},${(H - v / max * (H - 8)).toFixed(1)}`).join(' ');
    const lineas = [0.25, 0.5, 0.75].map(f => `<line x1="0" x2="${W}" y1="${H * f}" y2="${H * f}" stroke="var(--soft-border)" stroke-width="1" vector-effect="non-scaling-stroke"/>`).join('');
    g.innerHTML = `${lineas}
      <polygon points="0,${H} ${pts(entra)} ${W},${H}" fill="var(--blue-light)" opacity=".12"/>
      <polyline points="${pts(entra)}" fill="none" stroke="var(--blue-light)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round"/>
      <polyline points="${pts(sale)}" fill="none" stroke="var(--green)" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linejoin="round" stroke-dasharray="1 0"/>`;
    $('#trafAhora').textContent = entra[entra.length - 1].toFixed(1) + ' Mbps';
  }
  function anillo(sel, valor) {
    const r = 32, c = 2 * Math.PI * r, color = valor >= 95 ? 'var(--red)' : valor >= 85 ? 'var(--amber)' : 'var(--blue-light)';
    $(sel).innerHTML = `<circle cx="40" cy="40" r="${r}" fill="none" stroke="var(--bg4)" stroke-width="8"/>
      <circle cx="40" cy="40" r="${r}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(valor / 100 * c).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 40 40)" style="transition:stroke-dasharray .6s"/>
      <text x="40" y="45" text-anchor="middle">${Math.round(valor)}%</text>`;
  }
  function pulso() {
    const n = sesionesActivas().length;
    const navegando = S.navegandoHasta && Date.now() < S.navegandoHasta;
    const base = 1.5 + n * 1.3 + (navegando ? 6 + Math.random() * 4 : 0);
    const entra = Math.max(0.3, base + (Math.random() - 0.5) * 2.4);
    S.trafico.entra.push(entra); S.trafico.entra.shift();
    S.trafico.sale.push(Math.max(0.2, entra * (0.82 + Math.random() * 0.14))); S.trafico.sale.shift();
    S.cpu = Math.min(70, Math.max(8, S.cpu + (Math.random() - 0.5) * 6 + (navegando ? 3 : -1)));
    S.ram = Math.min(60, Math.max(38, S.ram + (Math.random() - 0.5) * 1.5));
    if (miSesion()) S.cel.consumo += navegando ? 0.8 + Math.random() : 0.05;
    pintarGrafico(); anillo('#anCpu', S.cpu); anillo('#anRam', S.ram);
  }

  // Relojes que avanzan cada segundo (solo con la demo a la vista)
  function cadaSegundo() {
    $('#celHora').textContent = hora(Date.now());
    const s = miSesion();
    if (s) {
      $('#bvReloj').textContent = reloj(Date.now() - s.inicio);
      $('#bvConsumo').textContent = S.cel.consumo < 1000 ? S.cel.consumo.toFixed(1) + ' MB' : (S.cel.consumo / 1024).toFixed(2) + ' GB';
    }
    $$('#tablaSes [data-dur]').forEach(td => { td.textContent = duracion(Date.now() - +td.dataset.dur); });
  }

  function pintarTodo() {
    pintarKpis(); pintarUsuarios(); pintarSesiones(); pintarCatalogo(); pintarEventos(); pintarMision(); pintarBienvenida();
  }

  let demoVisible = false, ultimoPulso = 0;
  new IntersectionObserver(en => { demoVisible = en[0].isIntersecting; }, { threshold: 0.05 }).observe($('#demo'));
  setInterval(() => {
    if (!demoVisible || document.hidden) return;
    cadaSegundo();
    if (Date.now() - ultimoPulso > 1800) { ultimoPulso = Date.now(); pulso(); }
  }, 1000);

  // ─── SONIDO Y REINICIO ──────────────────────────────
  function pintarSonido() {
    const b = $('#btnSonido');
    b.setAttribute('aria-pressed', sonido);
    b.querySelector('span').textContent = 'Sonido de avisos: ' + (sonido ? 'sí' : 'no');
  }
  $('#btnSonido').addEventListener('click', () => {
    sonido = !sonido; guardar('conetate_web_sonido', sonido ? '1' : '0'); pintarSonido();
    if (sonido) dingDong();
  });
  $('#btnReiniciar').addEventListener('click', iniciar);

  function iniciar() {
    S = estadoInicial();
    misionVista = null;
    sitioActual = null;
    $('#demo-app').dataset.marca = 'azul';
    $$('#colores [data-color]').forEach(x => x.setAttribute('aria-pressed', x.dataset.color === 'azul'));
    $('#cfgOrg').value = S.org; $('#cfgTit').value = S.titulo;
    $$('.org-nombre').forEach(el => { el.textContent = S.org; });
    $('#portalTitulo').textContent = S.titulo;
    $('#btnRed small').textContent = 'Abierta · Tocá para conectarte';
    $('#toasts').innerHTML = '';
    $$('.avisito').forEach(a => a.classList.remove('ver'));
    irCel('redes');
    irPanelSilencioso('dashboard');
    pintarTodo(); pintarGrafico(); anillo('#anCpu', S.cpu); anillo('#anRam', S.ram); cadaSegundo();
  }
  function irPanelSilencioso(v) {
    const lado = $('#demo-app').dataset.vista;
    irPanel(v);
    if (getComputedStyle($('.demo-cambiar')).display !== 'none') verLado(lado);
  }

  pintarSonido();
  iniciar();
})();
