(function(){
  var NM = ['2220000022','2221000022','2222100022','2222200022','2212210022','2201220022','2200221022','2200122122','2200022222','2200012222','2200001222','2200000222'];
  function pintarN(g){
    NM.forEach(function(fila,f){ fila.split('').forEach(function(v,c){ if(v!=='0'){
      var m=document.createElementNS('http://www.w3.org/2000/svg','circle');
      m.setAttribute('cx',c+.5); m.setAttribute('cy',f+.5); m.setAttribute('r',.42);
      if(v==='1') m.setAttribute('opacity','.45'); g.appendChild(m);
    }}); });
  }
  document.querySelectorAll('.logoN').forEach(pintarN);

  var escenas = [
    { id:'logo',   dur:3200, etiqueta:'Tu marca, en grande',              brillo:'rgba(34,184,255,.55)' },
    { id:'fotos',  dur:8400, etiqueta:'Las fotos de tus invitados con selfiA', brillo:'rgba(255,170,120,.45)' },
    { id:'texto',  dur:3600, etiqueta:'Mensajes para los protagonistas',   brillo:'rgba(242,200,120,.5)' },
    { id:'aurora', dur:3000, etiqueta:'Luz y ambiente para la pista',       brillo:'rgba(61,255,208,.6)' }
  ];
  var pendones = Array.prototype.slice.call(document.querySelectorAll('.pendon'));
  var nombre = document.getElementById('escenaNombre');
  var M = window.Motion;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostrar(e, inmediato){
    pendones.forEach(function(p, i){
      p.style.setProperty('--brillo', e.brillo);
      var fotosP = p.querySelectorAll('.capa.foto');
      if (e.id === 'fotos') subciclo(fotosP, e.dur, i, inmediato);
      p.querySelectorAll('.capa:not(.foto)').forEach(function(c){
        var activa = c.dataset.escena === e.id;
        if (inmediato || !M){ c.style.opacity = activa ? 1 : 0; return; }
        M.animate(c, { opacity: activa ? 1 : 0 }, { duration: .9, delay: activa ? i*0.15 : 0, ease:'easeInOut' });
        var img = c.querySelector('img');
        if (activa && img) M.animate(img, { scale:[1.0, 1.07] }, { duration: e.dur/1000 + 1, ease:'linear' });
        if (activa && c.classList.contains('capa-texto')){
          M.animate(c.querySelectorAll('span,i,em,small,.flores'), { opacity:[0,1], y:[12,0] }, { delay: M.stagger(.15,{start:.3+i*.2}), duration:.7 });
        }
        if (activa && c.classList.contains('capa-logo')){
          M.animate(c.querySelectorAll('circle'), { opacity:[0,1] }, { delay: M.stagger(.012,{start:.2}), duration:.25 });
        }
      });
    });
    if (e.id !== 'fotos') document.querySelectorAll('.capa.foto').forEach(function(c){
      if (inmediato || !M) c.style.opacity = 0; else M.animate(c,{opacity:0},{duration:.9});
    });
    nombre.textContent = e.etiqueta;
    if (M && !inmediato) M.animate(nombre, { opacity:[0,1] }, { duration:.6 });
  }

  // Dentro de la escena de fotos, cada pendón recorre sus propias fotos
  function subciclo(capas, dur, desfase, inmediato){
    var n = capas.length, cada = dur / n, k = 0;
    function paso(){
      capas.forEach(function(c, j){
        var on = j === k;
        if (inmediato || !M){ c.style.opacity = on ? 1 : 0; return; }
        M.animate(c, { opacity: on ? 1 : 0 }, { duration: .8, delay: on ? desfase*0.2 : 0 });
        var img = c.querySelector('img');
        if (on && img) M.animate(img, { scale:[1, 1.07] }, { duration: cada/1000 + 1, ease:'linear' });
      });
      k++;
      if (k < n && !inmediato) setTimeout(paso, cada);
    }
    paso();
  }

  var revelar = document.querySelectorAll('.revelar');
  if (reducido){
    revelar.forEach(function(e){ e.style.opacity=1; });
    mostrar(escenas[1], true);
    return;
  }
  if (M){ M.animate(revelar, { opacity:[0,1], y:[14,0] }, { delay: M.stagger(.09,{start:.4}), duration:.7, ease:[.22,1,.36,1] }); }
  else { revelar.forEach(function(e){ e.style.opacity=1; }); }

  var i = 0;
  function siguiente(){
    mostrar(escenas[i], false);
    var d = escenas[i].dur;
    i = (i + 1) % escenas.length;
    setTimeout(siguiente, d);
  }
  siguiente();
})();

/* Revelado al hacer scroll */
(function(){
  var els = document.querySelectorAll('.revelar-scroll');
  var M = window.Motion;
  var reducido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducido || !M || !M.inView){ els.forEach(function(e){ e.style.opacity = 1; }); return; }
  els.forEach(function(e){
    M.inView(e, function(){ M.animate(e, { opacity:[0,1], y:[20,0] }, { duration:.7, ease:[.22,1,.36,1] }); }, { amount:.25 });
  });
})();

/* Formulario: arma el mensaje y abre WhatsApp */
(function(){
  var form = document.getElementById('formulario');
  var err = document.getElementById('formError');
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var d = new FormData(form);
    var nombre = (d.get('nombre') || '').trim();
    if (!nombre){ err.textContent = 'Escribe tu nombre para poder responderte.'; form.nombre.focus(); return; }
    err.textContent = '';
    var fecha = d.get('fecha');
    if (fecha){ var p = fecha.split('-'); fecha = p[2] + '-' + p[1] + '-' + p[0]; }
    var msj = 'Hola NexoLED, soy ' + nombre + '. Quiero cotizar pantallas LED.\n' +
      '• Evento: ' + d.get('tipo') + '\n' +
      '• Fecha: ' + (fecha || 'por definir') + '\n' +
      '• Pantallas: ' + d.get('pantallas') +
      ((d.get('detalle') || '').trim() ? '\n• Detalles: ' + d.get('detalle').trim() : '');
    window.open('https://wa.me/56990188665?text=' + encodeURIComponent(msj), '_blank', 'noopener');
  });
})();

/* Chat de soporte */
(function(){
  var btn = document.getElementById('supportBtn');
  var win = document.getElementById('supportWindow');
  function cerrar(){ win.classList.remove('open'); btn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  btn.addEventListener('click', function(){
    var abierto = win.classList.toggle('open');
    btn.setAttribute('aria-expanded', abierto ? 'true' : 'false');
    if (window.innerWidth <= 560) document.body.style.overflow = abierto ? 'hidden' : '';
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') cerrar(); });
})();
