// ============================================================
// BLOQUE JS-17 — LLUVIA ANIMADA y STREAMS BINARIOS de fondo
// Los efectos visuales constantes del fondo: la lluvia cyber y
//   las columnas de 1s y 0s que caen.
// ============================================================

// LLUVIA
const canvas=document.getElementById('lluvia-canvas'),ctx=canvas.getContext('2d');let gotas=[];
function redimCanvas(){canvas.width=window.innerWidth;canvas.height=window.innerHeight;}
function initGotas(){gotas=[];const n=Math.floor(canvas.width*canvas.height/9000);for(let i=0;i<n;i++)gotas.push({x:Math.random()*canvas.width,y:Math.random()*canvas.height,largo:Math.random()*14+7,vel:Math.random()*4+2,op:Math.random()*0.28+0.04,w:Math.random()*0.7+0.2});}
function animLluvia(){ctx.clearRect(0,0,canvas.width,canvas.height);for(let g of gotas){ctx.beginPath();ctx.globalAlpha=g.op;ctx.lineWidth=g.w;ctx.strokeStyle='rgba(0,180,220,1)';ctx.moveTo(g.x,g.y);ctx.lineTo(g.x-g.largo*0.15,g.y+g.largo);ctx.stroke();g.y+=g.vel;g.x-=g.vel*0.15;if(g.y>canvas.height){g.y=-g.largo;g.x=Math.random()*canvas.width;}}ctx.globalAlpha=1;requestAnimationFrame(animLluvia);}
window.addEventListener('resize',()=>{redimCanvas();initGotas();});redimCanvas();initGotas();animLluvia();

// BINARY
function crearBinaryStreams(){const cont=document.getElementById('binary-overlay');const cols=Math.min(Math.floor(window.innerWidth/22),35);for(let i=0;i<cols;i++){const s=document.createElement('div');s.className='binary-stream';s.style.left=(i/cols*100)+'%';s.style.setProperty('--spd',(Math.random()*14+7)+'s');s.style.setProperty('--dly',(Math.random()*10)+'s');let txt='';for(let j=0;j<45;j++)txt+=(Math.random()>0.5?'1':'0')+(j%9===8?'\n':' ');s.textContent=txt;cont.appendChild(s);}}
crearBinaryStreams();


// ============================================================