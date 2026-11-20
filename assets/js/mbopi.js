// ═══════════════════════════════════════════════════
// MBOPI — Mascota de coNETate
// "Mbopi" es murciélago en guaraní: se orienta con ondas, como el WiFi.
//
// Uso:
//   <span class="mbopi" data-mbopi="funcionando"></span>   → se dibuja solo
//   Mbopi.cambiar(elemento, 'sin_router')                  → cambia con animación
//   Mbopi.svg('error')                                     → markup SVG suelto
//   <span class="mbopi" data-mbopi="..." data-mbopi-compacto>  → alas cortas, para tamaños chicos
//   Mbopi.ficha()                                          → abre "¿Quién es Mbopi?"
//
// Estados: funcionando | mantenimiento | sin_router | no_encontrado | error | servidor_detenido
//
//   Mbopi.companero(el)  → junto al logo del panel: cada tanto vuela, saluda,
//                          da una voltereta o emite su sonar (según el estado)
//   Mbopi.bienvenida({nombre, estado, activos}) → saludo al iniciar sesión en el panel
//   Mbopi.trasBienvenida(fn) → ejecuta fn cuando termina el saludo (o ya, si no hay)
// Se carga en el <head> para que los scripts en línea puedan usarlo de
// inmediato; los elementos [data-mbopi] se dibujan al terminar de parsear.
// ═══════════════════════════════════════════════════

(function () {
  'use strict';

  // ─── PALETA ───────────────────────────────────────
  // El borde es una variable CSS (--mb-borde): en tema claro va más oscuro
  // para que la silueta no se pierda sobre fondo blanco.
  const P = {
    claro: '#274F75', medio: '#173655', oscuro: '#0D2238', cuerpo: '#173655', vientre: '#0D2238',
    borde: 'var(--mb-borde, #6FA8D6)',
    ojo: '#7FD4FF', boca: '#06121F', diente: '#E6F1FB', senal: '#4FC3F7',
    verde: '#5DCAA5', rojo: '#E24B4A', ambar: '#EF9F27', gris: '#8A94A3',
    cable: '#7E8794', ficha: '#85B7EB', fichaInt: '#185FA5'
  };

  const ESTADOS = ['funcionando', 'mantenimiento', 'sin_router', 'no_encontrado', 'error', 'servidor_detenido'];

  const NOMBRE_ESTADO = {
    funcionando:       'Conectado',
    mantenimiento:     'Mantenimiento',
    sin_router:        'Sin router',
    no_encontrado:     'Buscando',
    error:             'Algo falló',
    servidor_detenido: 'Servidor apagado'
  };

  // ─── PIEZAS DEL DIBUJO ────────────────────────────
  // Coordenadas de la figura: cabeza centrada en x=120, raíz del ala en (116,128).
  // El ala nace por detrás del cuello y del cuerpo: no queda espacio entre ellos,
  // ni siquiera al aletear.
  const ALA = 'M5 104 Q24 84 47 86 Q63 86 75 95 Q94 106 116 112 L116 146 Q92 124 65 123 Q48 114 33 125 Q22 108 5 104 Z';
  const BANDA = d => `M-5 ${104 + d} Q24 ${84 + d} 47 ${86 + d} Q63 ${86 + d} 75 ${95 + d} Q94 ${106 + d} 118 ${112 + d} L118 40 L-5 40 Z`;

  const OJOS = {
    despierto: `<path d="M103 93 L116 98.5 Q114 104 108.5 103.5 Q103.5 102 103 93Z M137 93 L124 98.5 Q126 104 131.5 103.5 Q136.5 102 137 93Z" fill="${P.ojo}"/>`,
    atento:    `<path d="M103.5 95.5 Q110 92.8 116 98.8 Q109 101.4 103.5 95.5Z M136.5 95.5 Q130 92.8 124 98.8 Q131 101.4 136.5 95.5Z" fill="${P.ojo}"/>`,
    descansa:  `<path d="M104 97.5 Q110 96.4 116 98.8 Q110 100.8 104 97.5Z M136 97.5 Q130 96.4 124 98.8 Q130 100.8 136 97.5Z" fill="${P.ojo}" opacity=".85"/>`,
    apagado:   `<path d="M104 98 Q110 100 116 99 Q110 101.6 104 98Z M136 98 Q130 100 124 99 Q130 101.6 136 98Z" fill="${P.ojo}" opacity=".55"/>`
  };

  const BOCA = {
    abierta: `<path d="M109.5 107.5 Q120 104 130.5 107.5 Q127.5 118.5 120 118.5 Q112.5 118.5 109.5 107.5Z" fill="${P.boca}"/>
      <path d="M112 107 L114.6 114.2 L117.2 106Z M128 107 L125.4 114.2 L122.8 106Z" fill="${P.diente}"/>`,
    cerrada: `<path d="M111 109 Q120 111.6 129 109" fill="none" stroke="${P.boca}" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M113.4 109.8 L115.4 115 L117.4 110.6Z M126.6 109.8 L124.6 115 L122.6 110.6Z" fill="${P.diente}"/>`
  };

  // Ondas WiFi: salen del medio de la cabeza, entre las dos antenas
  const SENAL = [
    'M113.64 71.64 A9 9 0 0 1 126.36 71.64',
    'M107.98 65.98 A17 17 0 0 1 132.02 65.98',
    'M102.32 60.32 A25 25 0 0 1 137.68 60.32'
  ];

  let serie = 0;       // ids únicos para los clipPath de cada dibujo
  let grosor = 1;      // la versión compacta engrosa las líneas para que se sigan viendo

  function ala(rot, aletea, escala) {
    const id = 'mb-ala-' + (++serie);
    const s = grosor / (escala || 1);
    const cuerpoAla = `<g transform="rotate(${rot} 116 128)"><g${aletea ? ' class="mb-aleteo"' : ''}>
      <clipPath id="${id}"><path d="${ALA}"/></clipPath>
      <g clip-path="url(#${id})"><path d="${ALA}" fill="${P.claro}"/><path d="${BANDA(23)}" fill="${P.medio}"/><path d="${BANDA(10)}" fill="${P.oscuro}"/></g>
      <g fill="none" stroke="${P.borde}" stroke-width="${2 * s}" stroke-linecap="round"><path d="M47 86 Q36 104 33 125"/><path d="M75 95 Q66 108 65 123"/><path d="M95 104 Q90 116 91 128"/></g>
      <path d="${ALA}" fill="none" stroke="${P.borde}" stroke-width="${1.6 * s}" stroke-linejoin="round"/></g></g>`;
    return escala ? `<g transform="translate(116 128) scale(${escala}) translate(-116 -128)">${cuerpoAla}</g>` : cuerpoAla;
  }

  function antena(rot, x, led, activa, retraso) {
    const luz = led ? `<circle${activa ? ' class="mb-led"' : ''}${retraso ? ' style="animation-delay:.5s"' : ''} cx="${x}" cy="48.5" r="3.2" fill="${led}"/>` : '';
    return `<g transform="rotate(${rot} ${x} 86)">
      <rect x="${x - 5}" y="78" width="10" height="9" rx="2" fill="${P.oscuro}" stroke="${P.borde}" stroke-width="${1.3 * grosor}"/>
      <rect x="${x - 3.2}" y="50" width="6.4" height="29" rx="3.2" fill="${P.cuerpo}" stroke="${P.borde}" stroke-width="${1.4 * grosor}"/>
      <path d="M${x - 3} 60H${x + 3}M${x - 3} 66H${x + 3}M${x - 3} 72H${x + 3}" stroke="${P.borde}" stroke-width="1.1" opacity=".75"/>${luz}</g>`;
  }

  function senal(color, modo) {
    const extra = i => modo === 'pulso' ? ` class="mb-onda mb-onda-${i + 1}"`
                     : modo === 'apagada' ? ' stroke-dasharray="2 4" opacity=".55"' : '';
    return `<circle cx="120" cy="77" r="2.4" fill="${color}"${modo === 'apagada' ? ' opacity=".55"' : ''}/>` +
      SENAL.map((d, i) => `<path${extra(i)} d="${d}" fill="none" stroke="${color}" stroke-width="${3.4 * grosor}" stroke-linecap="round"/>`).join('');
  }

  function cabeza(ojos, boca) {
    return `<path d="M95 97 Q95 78 120 78 Q145 78 145 97 Q145 116 120 121 Q95 116 95 97Z" fill="${P.cuerpo}" stroke="${P.borde}" stroke-width="${1.4 * grosor}"/>${OJOS[ojos]}${BOCA[boca]}`;
  }

  const vientre = () => `<ellipse cx="120" cy="131" rx="15" ry="17" fill="${P.vientre}" stroke="${P.borde}" stroke-width="${1.4 * grosor}"/>`;

  function vuela(o, compacto) {
    const escala = compacto ? 0.62 : 0;
    return `<g class="mb-flota">${ala(o.rot || 0, o.aletea, escala)}<g transform="translate(240,0) scale(-1,1)">${ala(o.rot || 0, o.aletea, escala)}</g>
      ${o.debajo || ''}${vientre()}${antena(-24, 104, o.led, o.ledActivo, 0)}${antena(24, 136, o.led, o.ledActivo, 1)}
      ${senal(o.senal[0], o.senal[1])}${cabeza(o.ojos, o.boca)}${o.extra || ''}</g>`;
  }

  // Mantenimiento: el único estado en que Mbopi cuelga del cable de red
  function colgado(compacto) {
    const cable = compacto ? 'M58 18 Q120 30 182 18' : 'M0 18 Q120 30 240 18';
    const x = compacto ? 166 : 204;
    const alas = `<path d="M90 84 Q70 122 93 156 L120 146 L147 156 Q170 122 150 84Z" fill="${P.medio}" stroke="${P.borde}" stroke-width="${1.6 * grosor}" stroke-linejoin="round"/>
      <g fill="none" stroke="${P.borde}" stroke-width="${1.8 * grosor}" stroke-linecap="round"><path d="M101 90 Q90 122 104 150"/><path d="M139 90 Q150 122 136 150"/></g>`;
    return `<path d="${cable}" fill="none" stroke="${P.cable}" stroke-width="${4.4 * grosor}"/>
      <rect x="${x}" y="12" width="24" height="15" rx="2.5" fill="${P.ficha}"/><rect x="${x + 4}" y="15" width="16" height="4" fill="${P.fichaInt}"/>
      <circle class="mb-led-lento" cx="${x - 7}" cy="20" r="2.6" fill="${P.ambar}"/>
      <g class="mb-mece"><path d="M112 24 V44 M128 24 V44" stroke="${P.borde}" stroke-width="3.4" stroke-linecap="round"/>
        <g transform="rotate(180 120 95)">${alas}${vientre()}${antena(-24, 104)}${antena(24, 136)}${cabeza('descansa', 'cerrada')}</g></g>
      <text class="mb-zz" x="${compacto ? 156 : 170}" y="82" font-size="16" font-weight="500" fill="${P.ojo}">z</text>
      <text class="mb-zz" style="animation-delay:.9s" x="${compacto ? 168 : 184}" y="66" font-size="12" font-weight="500" fill="${P.ojo}">z</text>`;
  }

  const CABLE_SUELTO = `
    <path d="M120 146 Q114 158 124 168" fill="none" stroke="${P.cable}" stroke-width="3.4" stroke-linecap="round"/>
    <g transform="rotate(-16 130 172)"><rect x="123" y="166" width="15" height="11" rx="2" fill="${P.ficha}"/><rect x="126" y="168" width="9" height="2.6" fill="${P.fichaInt}"/></g>
    <path d="M143 164 L148 160 M144 170 L150 170 M143 176 L148 180" stroke="${P.ambar}" stroke-width="1.8" stroke-linecap="round"/>`;

  const PAGINA_PERDIDA = `
    <rect x="108" y="22" width="24" height="27" rx="3" fill="none" stroke="${P.ficha}" stroke-width="1.8" stroke-dasharray="3 2.4"/>
    <text x="120" y="41" text-anchor="middle" font-size="15" font-weight="500" fill="${P.ficha}">?</text>`;

  const ENGRANAJE = `
    <g class="mb-gira"><circle cx="120" cy="34" r="11" fill="none" stroke="${P.ambar}" stroke-width="6" stroke-dasharray="4.4 4.2"/>
    <circle cx="120" cy="34" r="8.6" fill="${P.ambar}"/></g><circle cx="120" cy="34" r="3.2" class="mb-hueco"/>`;

  // Servidor apagado: Mbopi, sin señal, junto a una torre de servidor con el LED en rojo
  function junto_al_servidor() {
    return `<g transform="translate(-4,30) scale(.64)">${vuela({ rot: -14, ojos: 'apagado', boca: 'cerrada', led: P.gris, senal: [P.gris, 'apagada'] })}</g>
      <rect x="168" y="36" width="50" height="94" rx="6" fill="#2C2C2A" stroke="${P.gris}" stroke-width="1.4"/>
      <rect x="176" y="46" width="34" height="8" rx="2" fill="#141413"/><rect x="176" y="60" width="34" height="8" rx="2" fill="#141413"/><rect x="176" y="74" width="34" height="8" rx="2" fill="#141413"/>
      <circle class="mb-led-lento" cx="193" cy="108" r="5" fill="${P.rojo}"/>`;
  }

  // Cada estado: su figura y cuánto se sube para centrarla en el lienzo completo
  const VOLANDO = {
    funcionando:   { y: -26, o: { aletea: 1, ojos: 'despierto', boca: 'abierta', led: P.verde, ledActivo: 1, senal: [P.senal, 'pulso'] } },
    sin_router:    { y: -34, o: { rot: -14, ojos: 'apagado', boca: 'cerrada', led: P.rojo, senal: [P.gris, 'apagada'], debajo: CABLE_SUELTO } },
    no_encontrado: { y: -16, o: { aletea: 1, ojos: 'atento', boca: 'cerrada', led: P.verde, ledActivo: 1, senal: [P.senal, 'pulso'], extra: PAGINA_PERDIDA } },
    error:         { y: -16, o: { aletea: 1, ojos: 'atento', boca: 'cerrada', led: P.ambar, senal: [P.ambar, 'fija'], extra: ENGRANAJE } }
  };

  // Lienzo completo: 240 × 150 (alas enteras), para pantallas grandes.
  // Compacto: alas al 62 % y líneas más gruesas, para el logo y los avisos; el
  // recuadro es el mismo en todos los estados que vuelan, así Mbopi no salta al
  // cambiar, y lo que sobresale (cable, engranaje) se ve porque el SVG no recorta.
  function svg(estado, compacto) {
    const envolver = (caja, contenido) =>
      `<svg class="mbopi-svg" viewBox="${caja}" aria-hidden="true" focusable="false">${contenido}</svg>`;
    grosor = compacto ? 1.5 : 1;
    let salida;
    if (estado === 'mantenimiento') {
      salida = envolver(compacto ? '54 10 136 136' : '0 0 240 150', colgado(compacto));
    } else if (estado === 'servidor_detenido') {
      grosor = 1;
      salida = envolver('0 0 240 150', junto_al_servidor());
    } else {
      const v = VOLANDO[estado] || VOLANDO.funcionando;
      salida = compacto ? envolver('44 46 152 104', vuela(v.o, true))
                        : envolver('0 0 240 150', `<g transform="translate(0,${v.y})">${vuela(v.o)}</g>`);
    }
    grosor = 1;
    return salida;
  }

  // ─── MONTAJE EN LA PÁGINA ─────────────────────────
  function preparar(el) {
    if (el.dataset.mbopiListo) return;
    el.dataset.mbopiListo = '1';
    el.classList.add('mbopi');
    if (el.dataset.mbopiFicha !== 'no') {
      el.setAttribute('role', 'button');
      el.setAttribute('tabindex', '0');
      el.setAttribute('aria-label', 'Mbopi, la mascota de coNETate. Ver quién es');
      el.title = 'Soy Mbopi. Tocame para saber quién soy';
      el.addEventListener('click', function (e) { e.stopPropagation(); ping(el); ficha(); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ficha(); }
      });
    }
  }

  function dibujar(el, estado) {
    preparar(el);
    el.dataset.mbopi = estado;
    el.dataset.mbopiActual = estado;
    el.innerHTML = svg(estado, el.dataset.mbopiCompacto !== undefined);
  }

  function montar(raiz) {
    (raiz || document).querySelectorAll('[data-mbopi]').forEach(function (el) {
      if (el.dataset.mbopiActual !== el.dataset.mbopi) dibujar(el, el.dataset.mbopi);
    });
  }

  // Sonar: anillos que se expanden desde Mbopi (también al cambiar de estado)
  function ping(el) {
    const onda = document.createElement('span');
    onda.className = 'mb-ping';
    onda.setAttribute('aria-hidden', 'true');
    el.appendChild(onda);
    setTimeout(function () { onda.remove(); }, 1300);
  }

  // Cambia de estado con animación: sale, cambia el dibujo, entra y emite un ping
  function cambiar(el, estado) {
    if (!el) return;
    const actual = el.dataset.mbopiActual;
    if (actual === estado) return;
    if (!actual) { dibujar(el, estado); return; }   // primera vez: sin animación
    el.classList.remove('mb-entrando');
    el.classList.add('mb-saliendo');
    setTimeout(function () {
      dibujar(el, estado);
      el.classList.remove('mb-saliendo');
      void el.offsetWidth;                            // reinicia la animación de entrada
      el.classList.add('mb-entrando');
      ping(el);
      setTimeout(function () { el.classList.remove('mb-entrando'); }, 600);
    }, 220);
  }

  // ─── COMPAÑERO (junto al logo del panel) ──────────
  // Cada 6-14 s hace algo acorde al estado de la red. Las acciones son clases
  // CSS sobre el contenedor (.mb-compa), así el movimiento no pisa las
  // animaciones de cambio de estado que van sobre el propio .mbopi.
  const ACCIONES = {
    funcionando:   ['vuelo', 'vuelo', 'sonar', 'voltereta', 'saludo'],
    sin_router:    ['busca', 'busca', 'sonar'],
    mantenimiento: [],                       // descansa colgado: solo se mece
    error:         ['busca'],
    servidor_detenido: []
  };
  const DURACION = { vuelo: 2800, voltereta: 950, saludo: 1000, busca: 1600 };

  function companero(el) {
    if (!el || el.dataset.mbopiCompa) return;
    el.dataset.mbopiCompa = '1';
    const zona = el.closest('.mb-compa') || el.parentElement;
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reloj = null, ocupado = false;

    function hacer(accion) {
      if (ocupado) return;
      if (accion === 'sonar') { ping(el); setTimeout(function () { ping(el); }, 380); return; }
      ocupado = true;
      zona.classList.add('mb-accion-' + accion);
      setTimeout(function () { zona.classList.remove('mb-accion-' + accion); ocupado = false; }, DURACION[accion]);
    }
    function programar(ms) { clearTimeout(reloj); reloj = setTimeout(actuar, ms); }
    function actuar() {
      const lista = ACCIONES[el.dataset.mbopiActual] || [];
      if (!document.hidden && !quieto.matches && lista.length) hacer(lista[Math.floor(Math.random() * lista.length)]);
      programar(6000 + Math.random() * 8000);
    }
    el.addEventListener('mouseenter', function () {
      if (el.dataset.mbopiActual === 'funcionando' && !quieto.matches) hacer('saludo');
    });
    programar(2500 + Math.random() * 2000);   // la primera, poco después de cargar
  }

  // ─── BIENVENIDA AL ADMINISTRADOR ──────────────────
  // Solo en la primera pantalla después de iniciar sesión (app.py: dashboard).
  // Atenúa el panel, Mbopi llega al centro, saluda y vuela hasta su lugar en el
  // logo. Un clic o Esc la saltea. En mantenimiento no vuela: aparece colgado.
  let bienvenidaActiva = false;
  const trasSaludo = [];

  // Para lo que no debe abrirse encima del saludo (asistente de primer uso)
  function trasBienvenida(fn) {
    if (bienvenidaActiva) trasSaludo.push(fn); else fn();
  }

  function textoRed(estado, activos) {
    if (estado === 'mantenimiento') return ['mant', 'Modo mantenimiento activo'];
    if (estado === 'sin_router') return ['sin', 'El MikroTik no responde · el panel funciona igual'];
    // `activos` = personas con su equipo en el WiFi ahora (no las sesiones habilitadas); null = sin lectura
    if (activos === null || activos === undefined) return ['', 'La red funciona'];
    const gente = activos === 1 ? '1 persona conectada ahora'
                : activos > 1 ? activos + ' personas conectadas ahora' : 'nadie conectado en este momento';
    return ['', 'La red funciona · ' + gente];
  }

  function bienvenida(datos) {
    if (bienvenidaActiva || document.hidden) return;
    bienvenidaActiva = true;
    const raiz = document.documentElement;
    raiz.classList.add('mb-bv-activa');     // el logo se oculta: Mbopi va a llegar hasta ahí
    const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let capa = null, cerrada = false, animaciones = [], estado = datos.estado || 'funcionando';
    let activosVistos = datos.activos;   // personas en el WiFi; el flujo en vivo lo pone al día

    function terminar() {
      if (cerrada) return;
      cerrada = true;
      clearTimeout(seguro);
      document.removeEventListener('keydown', alEsc, true);
      document.removeEventListener('conetate:estado', alEstado);
      animaciones.forEach(function (a) { a.cancel(); });
      if (capa) capa.remove();
      raiz.classList.remove('mb-bv-activa');
      bienvenidaActiva = false;
      const logo = document.querySelector('.mb-compa .mbopi');
      if (logo && logo.offsetWidth && !quieto) ping(logo);
      while (trasSaludo.length) trasSaludo.shift()();
    }

    function saltar() {
      if (cerrada || !capa) return;
      animaciones.forEach(function (a) { a.pause(); });   // se queda donde está y se funde
      capa.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, easing: 'ease-out' }).onfinish = terminar;
    }

    function alEsc(e) {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      e.preventDefault();
      saltar();
    }

    function pintarRed(activos) {
      if (!capa) return;
      const t = textoRed(estado, activos);
      const linea = capa.querySelector('.mb-bv-red');
      linea.className = 'mb-bv-red ' + t[0];
      linea.lastChild.textContent = t[1];
    }

    // El dato de la pantalla puede ser de hace unos segundos: el flujo en vivo lo corrige
    function alEstado(e) {
      const d = e.detail;
      const nuevo = d.modo_mantenimiento ? 'mantenimiento' : (d.mikrotik_online ? 'funcionando' : 'sin_router');
      if (capa && nuevo !== estado && nuevo !== 'mantenimiento' && estado !== 'mantenimiento') {
        cambiar(capa.querySelector('.mbopi'), nuevo);
      }
      if (estado !== 'mantenimiento') estado = nuevo === 'mantenimiento' ? estado : nuevo;
      // Solo si el estado trae la lectura del WiFi: sin ella se deja el número que ya se ve
      if (d.personas_conectadas !== undefined && d.personas_conectadas !== null) {
        activosVistos = d.personas_conectadas;
      }
      pintarRed(activosVistos);
    }

    function construir() {
      capa = document.createElement('div');
      capa.className = 'mb-bv';
      capa.setAttribute('role', 'status');
      capa.innerHTML = `
        <div class="mb-bv-fondo"></div>
        <span class="mb-bv-anillo"></span><span class="mb-bv-anillo"></span>
        <div class="mb-bv-figura"><span class="mbopi" data-mbopi="${estado}" data-mbopi-ficha="no"></span></div>
        <div class="mb-bv-texto"><b></b><span>Bienvenido a coNETate</span>
          <em class="mb-bv-red"><u></u><i></i></em></div>`;
      capa.querySelector('b').textContent = 'Hola, ' + (datos.nombre || 'admin');
      document.body.appendChild(capa);
      montar(capa);
      pintarRed(activosVistos);
      capa.addEventListener('click', saltar);
      document.addEventListener('keydown', alEsc, true);
      document.addEventListener('conetate:estado', alEstado);
    }

    function arrancar() {
      if (cerrada) return;
      construir();
      const fondo = capa.querySelector('.mb-bv-fondo'), figura = capa.querySelector('.mb-bv-figura'),
            texto = capa.querySelector('.mb-bv-texto'), anillos = capa.querySelectorAll('.mb-bv-anillo');
      const W = window.innerWidth, H = window.innerHeight, D = quieto ? 2400 : 3900;
      const suave = 'cubic-bezier(.2,.8,.2,1)';
      const animar = function (el, marcos) {
        const a = el.animate(marcos, { duration: D, fill: 'both' });
        animaciones.push(a);
        return a;
      };

      animar(fondo, [{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.8 }, { opacity: 0 }]);
      const r = figura.getBoundingClientRect();
      const logo = document.querySelector('.mb-compa');
      const l = logo && logo.offsetWidth ? logo.getBoundingClientRect() : null;   // en celular el logo no se muestra
      const lx = l ? l.left + l.width / 2 - (r.left + r.width / 2) : W * 0.12;
      const ly = l ? l.top + l.height / 2 - (r.top + r.height / 2) : -H * 0.6;
      const esc = l ? l.width / r.width : 0.4;

      let marcos;
      if (quieto) {
        marcos = [{ offset: 0, opacity: 0 }, { offset: 0.12, opacity: 1 }, { offset: 0.82, opacity: 1 }, { offset: 1, opacity: 0 }];
      } else if (estado === 'mantenimiento') {
        marcos = [
          { offset: 0, opacity: 0, transform: 'translateY(-14px) scale(.94)', easing: suave },
          { offset: 0.14, opacity: 1, transform: 'none' },
          { offset: 0.76, opacity: 1, transform: 'none' },
          { offset: 0.9, opacity: 0, transform: 'scale(.9)' },
          { offset: 1, opacity: 0, transform: 'scale(.9)' }
        ];
      } else {
        const caido = estado === 'sin_router';
        marcos = [
          { offset: 0, opacity: 0, transform: `translate(${-W * 0.62}px,${H * 0.28}px) rotate(-14deg) scale(.5)` },
          { offset: 0.08, opacity: 1, transform: `translate(${-W * 0.42}px,${H * 0.1}px) rotate(-12deg) scale(.62)`, easing: suave },
          { offset: 0.3, transform: 'none', easing: 'ease-in-out' },
          { offset: 0.42, transform: caido ? 'translateY(-2px)' : 'translateY(-7px)', easing: 'ease-in-out' },
          { offset: 0.54, transform: 'translateY(2px)', easing: 'ease-in-out' },
          { offset: 0.66, transform: caido ? 'translateY(-2px)' : 'translateY(-5px)', easing: 'ease-in-out' },
          { offset: 0.74, transform: 'none', easing: 'cubic-bezier(.5,0,.3,1)' },
          { offset: 0.86, opacity: 1, transform: `translate(${lx * 0.55}px,${ly * 0.75}px) rotate(-8deg) scale(.6)`, easing: 'ease-out' },
          { offset: 0.97, opacity: l ? 1 : 0, transform: `translate(${lx}px,${ly}px) scale(${esc})` },
          { offset: 1, opacity: 0, transform: `translate(${lx}px,${ly}px) scale(${esc})` }
        ];
      }
      animar(figura, marcos).onfinish = terminar;

      animar(texto, quieto
        ? [{ offset: 0, opacity: 0 }, { offset: 0.12, opacity: 1 }, { offset: 0.82, opacity: 1 }, { offset: 1, opacity: 0 }]
        : [{ offset: 0, opacity: 0, transform: 'translateY(8px)' },
           { offset: 0.28, opacity: 0, transform: 'translateY(8px)', easing: suave },
           { offset: 0.36, opacity: 1, transform: 'none' },
           { offset: 0.7, opacity: 1, transform: 'none' },
           { offset: 0.77, opacity: 0, transform: 'translateY(-4px)' },
           { offset: 1, opacity: 0, transform: 'translateY(-4px)' }]);

      // Sonar: solo si hay señal que emitir
      if (!quieto && estado === 'funcionando') {
        [0.3, 0.42].forEach(function (o, i) {
          animar(anillos[i], [
            { offset: 0, opacity: 0, transform: 'scale(.6)' },
            { offset: o, opacity: 0, transform: 'scale(.6)' },
            { offset: o + 0.01, opacity: 0.7, transform: 'scale(.6)' },
            { offset: o + 0.2, opacity: 0, transform: 'scale(2.4)' },
            { offset: 1, opacity: 0, transform: 'scale(2.4)' }
          ]);
        });
      }
    }

    // Red de seguridad: pase lo que pase, la pantalla no queda tapada
    const seguro = setTimeout(terminar, 7000);

    // Si se llegó con la transición entre páginas, primero se deja que termine:
    // el contenido se pinta por encima de todo mientras dura y taparía el saludo.
    let esperas = 0;
    function cuandoLibre() {
      if (raiz.classList.contains('vt-activa') && esperas++ < 12) { setTimeout(cuandoLibre, 100); return; }
      try { arrancar(); } catch (err) { terminar(); }
    }
    requestAnimationFrame(function () { requestAnimationFrame(cuandoLibre); });
  }

  // ─── FICHA "¿QUIÉN ES MBOPI?" ─────────────────────
  let fichaEl = null;
  let focoPrevio = null;

  function construirFicha() {
    const fondo = document.createElement('div');
    fondo.className = 'mbopi-ficha-fondo';
    fondo.innerHTML = `
      <div class="mbopi-ficha" role="dialog" aria-modal="true" aria-labelledby="mbopi-ficha-titulo">
        <button type="button" class="mbopi-ficha-cerrar" aria-label="Cerrar">&times;</button>
        <div class="mbopi-ficha-heroe">
          <span class="mbopi mbopi-grande" data-mbopi="funcionando" data-mbopi-ficha="no"></span>
          <span class="mb-sonar" aria-hidden="true"><i></i><i></i><i></i></span>
        </div>
        <p class="mbopi-ficha-eyebrow">La mascota de coNETate</p>
        <h3 id="mbopi-ficha-titulo">Hola, soy Mbopi</h3>
        <p class="mbopi-ficha-texto"><strong>Mbopi</strong> significa <em>murciélago</em> en guaraní.
          Los murciélagos no necesitan ver para orientarse: emiten ondas y escuchan el eco
          que rebota en todo lo que los rodea. A eso se le llama <strong>ecolocalización</strong>.</p>

        <div class="mbopi-ficha-ondas" aria-hidden="true">
          <span class="mbopi mbopi-mini" data-mbopi="funcionando" data-mbopi-ficha="no" data-mbopi-compacto></span>
          <span class="mb-viaje"><i></i><i></i><i></i></span>
          <svg class="mb-equipo" viewBox="0 0 24 24" fill="none"><rect x="6" y="2.5" width="12" height="19" rx="2.5" stroke="currentColor" stroke-width="1.6"/><path d="M10.5 18.5h3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
        </div>
        <p class="mbopi-ficha-pie">Ondas que van y vuelven, como el eco</p>

        <p class="mbopi-ficha-texto">El <strong>WiFi</strong> funciona de forma parecida: el router y tu
          dispositivo se comunican con <strong>ondas de radio</strong> invisibles que viajan por el aire.
          Por eso Mbopi es la mascota: igual que él, coNETate te conecta a través de ondas.
          Sus orejas son antenas y la señal le sale de entre ellas.</p>

        <p class="mbopi-ficha-subtitulo">Cómo me vas a ver</p>
        <div class="mbopi-ficha-estados">
          ${['funcionando', 'sin_router', 'mantenimiento', 'error'].map(e => `
            <div><span class="mbopi" data-mbopi="${e}" data-mbopi-ficha="no"></span><small>${NOMBRE_ESTADO[e]}</small></div>`).join('')}
        </div>
        <button type="button" class="btn btn-primary mbopi-ficha-ok">Entendido</button>
      </div>`;
    fondo.addEventListener('click', function (e) { if (e.target === fondo) cerrarFicha(); });
    fondo.querySelector('.mbopi-ficha-cerrar').addEventListener('click', cerrarFicha);
    fondo.querySelector('.mbopi-ficha-ok').addEventListener('click', cerrarFicha);
    document.body.appendChild(fondo);
    montar(fondo);
    return fondo;
  }

  function ficha() {
    if (!fichaEl) fichaEl = construirFicha();
    focoPrevio = document.activeElement;
    // Reinicia las animaciones de entrada cada vez que se abre
    fichaEl.classList.remove('abierta');
    void fichaEl.offsetWidth;
    fichaEl.classList.add('abierta');
    document.addEventListener('keydown', escFicha);
    const tarjeta = fichaEl.querySelector('.mbopi-ficha');
    tarjeta.scrollTop = 0;
    // preventScroll: si no, el navegador baja hasta el botón y Mbopi queda fuera de vista
    setTimeout(function () { fichaEl.querySelector('.mbopi-ficha-ok').focus({ preventScroll: true }); }, 50);
  }

  function cerrarFicha() {
    if (!fichaEl) return;
    fichaEl.classList.remove('abierta');
    document.removeEventListener('keydown', escFicha);
    if (focoPrevio && focoPrevio.focus) focoPrevio.focus();
  }

  function escFicha(e) { if (e.key === 'Escape') cerrarFicha(); }

  window.Mbopi = { svg: svg, montar: montar, cambiar: cambiar, ping: ping, ficha: ficha,
                   companero: companero, bienvenida: bienvenida, trasBienvenida: trasBienvenida,
                   estados: ESTADOS };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { montar(); });
  } else {
    montar();
  }
})();
