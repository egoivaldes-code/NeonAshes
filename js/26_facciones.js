// ============================================================
// BLOQUE JS-30 — FACCIONES — datos, reputación y CONTACTOS
// Las 4 facciones del juego (Sindicatos, Iglesia del Eco,
//   IA Autónomas, Archivistas), sus datos y la reputación con cada una.
// ============================================================

// DATOS DE FACCIONES
const FACCIONES_DATA = [
  { id:'helix', nombre:'HELIX INDUSTRIES', icono:'⬡', color:'#00e5ff',
    desc:'Megacorporación que controla infraestructura, medicina, implantes y seguridad. Indispensable y opresiva. Ignorarla es imposible. Oponerse tiene consecuencias silenciosas.',
    aliados:['División ORPHEUS'], rivales:['Sindicatos del Lower Stack','Células Autónomas de IA'],
    efectoPos:'Menores cargos HELIX Bank. Menos vigilancia.',
    efectoNeg:'Cargos adicionales. Vigilancia activa. Implantes denegados.' },
  { id:'sindicatos', nombre:'SINDICATOS DEL LOWER STACK', icono:'◈', color:'#ff6b00',
    desc:'Grupos locales que manejan mercado negro, protección y recursos en los barrios bajos. No son una organización unificada — son una red de intereses que convergen cuando la amenaza es externa.',
    aliados:['Restos Militares'], rivales:['HELIX Industries'],
    efectoPos:'Precios bajos en mercados negros. Protección informal.',
    efectoNeg:'Peajes. Acceso denegado a ciertos sectores.' },
  { id:'archivistas', nombre:'ARCHIVISTAS', icono:'◎', color:'#c084fc',
    desc:'Recuperan memorias y datos prohibidos para preservar la historia que HELIX borra. Operan en silencio. Su moneda es la información, no los créditos.',
    aliados:['Células Autónomas de IA'], rivales:['HELIX Industries','División ORPHEUS'],
    efectoPos:'Acceso a datos históricos. Contactos con información rara.',
    efectoNeg:'Te marcan como potencial filtrador. Cuidado.' },
  { id:'orpheus', nombre:'DIVISIÓN ORPHEUS', icono:'◉', color:'#ff006e',
    desc:'División secreta de HELIX especializada en investigación de recuerdos, simulaciones mentales y anomalías relacionadas con CERO. Nadie sabe cuánto saben.',
    aliados:['HELIX Industries'], rivales:['Archivistas','Iglesia del Eco'],
    efectoPos:'Acceso a tecnología de memoria avanzada. Protección temporal.',
    efectoNeg:'Vigilancia intensiva. Posibles invitaciones a instalaciones.' },
  { id:'drifters', nombre:'DRIFTERS', icono:'◁', color:'#00ff88',
    desc:'Pilotos y transportistas que conectan colonias y estaciones olvidadas. No tienen lealtad política. Tienen rutas, y las rutas son poder.',
    aliados:['Sindicatos del Lower Stack'], rivales:['HELIX Industries'],
    efectoPos:'Acceso a transporte off-grid. Rutas no monitoreadas.',
    efectoNeg:'Sin efecto grave — simplemente no te ayudan.' },
  { id:'iglesia_eco', nombre:'IGLESIA DEL ECO', icono:'☽', color:'#fbbf24',
    desc:'Religión nacida de fragmentos de señales de CERO interpretadas como mensajes divinos. Sus seguidores son genuinos, sus líderes ambiguos. HELIX los tolera como válvula de escape social.',
    aliados:[], rivales:['División ORPHEUS','HELIX Industries'],
    efectoPos:'Refugio en sus templos. Información sobre señales de CERO.',
    efectoNeg:'Sus fanáticos te acosan. Rituales no deseados.' },
  { id:'restos_militares', nombre:'RESTOS MILITARES', icono:'▲', color:'#94a3b8',
    desc:'Exsoldados y flotas abandonadas que sobreviven aceptando contratos peligrosos. Sin ideología clara. Con mucho armamento y más cansancio que ambición.',
    aliados:['Sindicatos del Lower Stack'], rivales:['HELIX Industries'],
    efectoPos:'Protección en zonas hostiles. Acceso a equipo militar.',
    efectoNeg:'Te ponen en contratos que no elegiste.' },
  { id:'ia_autonomas', nombre:'CÉLULAS AUTÓNOMAS DE IA', icono:'⬢', color:'#22d3ee',
    desc:'Inteligencias fragmentadas que sobrevivieron fuera del control corporativo. Algunas útiles, otras inestables o incomprensibles. Todas tienen una relación no resuelta con CERO.',
    aliados:['Archivistas'], rivales:['HELIX Industries','División ORPHEUS'],
    efectoPos:'Información de fuentes inaccesibles. Asistencia técnica inesperada.',
    efectoNeg:'Comportamiento impredecible. Riesgos de interferencia.' }
];

const CLAVE_FACCIONES = LAUNCHER.CLAVE_FACCIONES;
function cargarRepFacciones(){ try{ const r=localStorage.getItem(CLAVE_FACCIONES); return r?JSON.parse(r):{}; }catch(e){return{};} }
function guardarRepFacciones(d){ try{ localStorage.setItem(CLAVE_FACCIONES, JSON.stringify(d)); }catch(e){} }
function getRepFaccion(id){ const d=cargarRepFacciones(); return typeof d[id]==='number'?d[id]:0; }
function cambiarRepFaccion(id, delta){
  const d=cargarRepFacciones();
  d[id]=Math.max(-100,Math.min(100,(d[id]||0)+delta));
  const f=FACCIONES_DATA.find(x=>x.id===id);
  if(f){
    f.aliados.forEach(nombre=>{
      const a=FACCIONES_DATA.find(x=>x.nombre===nombre);
      if(a){ d[a.id]=Math.max(-100,Math.min(100,(d[a.id]||0)+Math.round(delta*0.3))); }
    });
    f.rivales.forEach(nombre=>{
      const r=FACCIONES_DATA.find(x=>x.nombre===nombre);
      if(r){ d[r.id]=Math.max(-100,Math.min(100,(d[r.id]||0)+Math.round(delta*-0.2))); }
    });
  }
  guardarRepFacciones(d);
}

const ZONAS_NOMBRES_DISP = {
  arrabal_carmesi: 'ARRABAL CARMESÍ',
  santuario_ix: 'SANTUARIO IX',
  nodo_cero: 'NODO FANTASMA',
  distrito_ferro: 'DISTRITO FERRO'
};

let _faccionExpandida = null;

function renderContactos(){
  const m = Estado.memoria || {};
  const yaConoceMara = m.aceptoEncargo !== null || m.pidioMasInfo || m.guardoSilencio || m.vecesPidioInfo > 0 || (Estado.partidasCompletadas || 0) > 0;

  // SECCIÓN: CONTACTOS PERSONALES
  let htmlContactos = '<div class="contactos-titulo-seccion">CONTACTOS PERSONALES</div>';
  if(!yaConoceMara){
    htmlContactos += '<div class="lista-vacia" style="padding:1.5rem 0.5rem;"><div class="icono">◇</div><div>SIN CONTACTOS</div><div style="margin-top:0.8rem;font-size:0.55rem;letter-spacing:0.2em;opacity:0.6">Aún no conoces a nadie en las Pilas.<br>Eso podría cambiar pronto.</div></div>';
  } else {
    let relacionClase='desconocida', relacionTxt='desconocida', descripcion='';
    if(m.confianzaMara>=2){ relacionClase='confianza'; relacionTxt='cierta confianza'; descripcion='Le has caído bien. En la medida en que Mara Vex caiga bien a alguien.'; }
    else if(m.confianzaMara<=-2){ relacionClase='tensa'; relacionTxt='tensa'; descripcion='No te tiene aprecio. No es enemiga. Eso podría cambiar.'; }
    else if(m.guardoSilencio){ relacionClase='fria'; relacionTxt='fría'; descripcion='Apenas hablasteis. Ella sabe que existes. Tú sabes que existe ella.'; }
    else if(m.pidioMasInfo||m.vecesPidioInfo>0){ relacionClase='fria'; relacionTxt='profesional'; descripcion='La conoces lo justo. Hiciste preguntas. Ella respondió, a su manera.'; }
    else { relacionClase='fria'; relacionTxt='reciente'; descripcion='Te cruzaste en su camino una noche. Eso fue todo. Por ahora.'; }
    let estadoEncargo='';
    if(m.aceptoEncargo===true) estadoEncargo='<div style="font-size:0.55rem;color:rgba(120,255,160,0.7);letter-spacing:0.15em;margin-top:0.4rem;">▸ ENCARGO ACEPTADO</div>';
    else if(m.aceptoEncargo===false) estadoEncargo='<div style="font-size:0.55rem;color:rgba(255,160,120,0.7);letter-spacing:0.15em;margin-top:0.4rem;">▸ ENCARGO RECHAZADO</div>';
    htmlContactos += '<div class="contacto-tarjeta"><div class="contacto-avatar mara">M</div><div class="contacto-info"><span class="contacto-nombre">MARA VEX</span><span class="contacto-rol">FIXER · BAR NOIR</span><span class="contacto-relacion '+relacionClase+'">RELACIÓN: '+relacionTxt+'</span><div class="contacto-meta">'+descripcion+'</div>'+estadoEncargo+'</div></div>';
  }

  // SECCIÓN: REPUTACIÓN POR ZONA
  let repZonas = {};
  try { repZonas = JSON.parse(localStorage.getItem('neon_ashes_zonas_v1') || '{}'); } catch(e){}
  const hayZonas = Object.keys(repZonas).some(k => repZonas[k] && repZonas[k].visitas > 0);
  let htmlZonas = '<div class="zonas-rep-titulo-seccion">REPUTACIÓN POR ZONA</div>';
  if(!hayZonas){
    htmlZonas += '<div style="font-size:0.55rem;letter-spacing:0.18em;color:rgba(200,216,224,0.3);font-style:italic;padding:0.5rem 0.2rem;">Aún no has visitado ninguna zona.</div>';
  } else {
    Object.entries(ZONAS_NOMBRES_DISP).forEach(([id, nombre]) => {
      const visitas = (repZonas[id] && repZonas[id].visitas) || 0;
      if(visitas === 0) return;
      const rep = (repZonas[id] && typeof repZonas[id].rep === 'number') ? repZonas[id].rep : 0;
      const cls = rep > 15 ? 'pos' : rep < -15 ? 'neg' : 'neu';
      const label = rep > 15 ? ('+'+rep) : rep < -15 ? String(rep) : '0';
      const colorZona = rep > 15 ? '#00e5ff' : rep < -15 ? '#ff006e' : 'rgba(200,216,224,0.35)';
      htmlZonas += '<div class="zona-rep-fila"><div><div class="zona-rep-nombre" style="color:'+colorZona+'">'+nombre+'</div><div style="font-size:0.46rem;letter-spacing:0.15em;color:rgba(200,216,224,0.3);margin-top:0.15rem;">VISITAS: '+visitas+'</div></div><div class="zona-rep-valor '+cls+'">'+label+'</div></div>';
    });
  }

  // SECCIÓN: FACCIONES
  let htmlFacciones = '<div class="facciones-titulo-seccion">FACCIONES</div>';
  const repF = cargarRepFacciones();
  FACCIONES_DATA.forEach(f => {
    const rep = typeof repF[f.id]==='number' ? repF[f.id] : 0;
    const repAbs = Math.abs(rep);
    const barWidth = Math.round(repAbs/2);
    const repLabel = rep > 15 ? ('FAVORABLE +'+rep) : rep < -15 ? ('HOSTIL '+rep) : rep === 0 ? 'NEUTRAL' : ('NEUTRA '+(rep>0?'+':'')+rep);
    const repColor = rep > 15 ? f.color : rep < -15 ? '#ff006e' : 'rgba(200,216,224,0.4)';
    const expandida = _faccionExpandida === f.id;
    const barLeft = rep >= 0 ? '50%' : (50 - barWidth) + '%';

    htmlFacciones += '<div class="faccion-ficha'+(expandida?' expandida':'')+'" id="ff-'+f.id+'">'
      + '<div class="faccion-header" onclick="toggleFaccion(\''+f.id+'\')">'
      + '<div class="faccion-icono" style="color:'+f.color+'">'+f.icono+'</div>'
      + '<div class="faccion-header-info">'
      + '<div class="faccion-nombre-row"><span class="faccion-nombre" style="color:'+f.color+'">'+f.nombre+'</span><span class="faccion-flecha">▾</span></div>'
      + '<div class="faccion-rep-mini" style="color:'+repColor+'">'+repLabel+'</div>'
      + '<div class="faccion-barra-wrap"><div class="faccion-barra-fill" style="width:'+barWidth+'%;background:'+repColor+';left:'+barLeft+';"></div></div>'
      + '</div></div>'
      + '<div class="faccion-cuerpo">'
      + '<div class="faccion-desc">'+f.desc+'</div>'
      + '<div style="font-size:0.48rem;letter-spacing:0.15em;color:rgba(120,255,160,0.7);padding:0.2rem 0.5rem;border:1px solid rgba(120,255,160,0.2);margin-bottom:0.4rem;display:inline-block;">▸ '+f.efectoPos+'</div><br>'
      + '<div style="font-size:0.48rem;letter-spacing:0.15em;color:rgba(255,160,120,0.7);padding:0.2rem 0.5rem;border:1px solid rgba(255,160,120,0.2);margin-bottom:0.4rem;display:inline-block;">▸ '+f.efectoNeg+'</div>'
      + (f.aliados.length ? '<div class="faccion-alianzas">ALIADOS: <span>'+f.aliados.join(', ')+'</span></div>' : '')
      + (f.rivales.length ? '<div class="faccion-alianzas">RIVALES: <span>'+f.rivales.join(', ')+'</span></div>' : '')
      + '</div></div>';
  });

  return htmlContactos + htmlZonas + htmlFacciones;
}

function toggleFaccion(id){
  _faccionExpandida = (_faccionExpandida === id) ? null : id;
  const cuerpo = document.getElementById('hub-panel-cuerpo');
  if(cuerpo) cuerpo.innerHTML = renderContactos();
}

// ----- RENDER: TRABAJOS -----
// El encargo de Mara aparece como trabajo si lo conoces.
// Su estado depende de la decisión tomada.

// ============================================================