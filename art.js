/* ================= background: the rotunda ================= */
const BG=(()=>{
 const cv=$('#bg'),ctx=cv.getContext('2d');
 let W=0,H=0,DPR=1,scene=null,parts=[],px=0,py=0,tx=0,ty=0,running=false;
 function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
 function build(w,h){
  const c=document.createElement('canvas');c.width=Math.round(w*DPR);c.height=Math.round(h*DPR);
  const g=c.getContext('2d');g.scale(DPR,DPR);
  const R=mulberry32(1819),cx=w/2,hor=h*.6,bend=.5;
  const cy=(y,x)=>y+(y-hor)*bend*Math.pow((x-cx)/(w/2),2);
  const line=(yf,step=6)=>{g.beginPath();for(let x=-4;x<=w+4;x+=step){const y=yf(x);x<0?g.moveTo(x,y):g.lineTo(x,y);}};
  let gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#071a1e');gr.addColorStop(.5,'#10323a');gr.addColorStop(1,'#0a2226');g.fillStyle=gr;g.fillRect(0,0,w,h);
  const T=[.19,.33,.47,.6,.73].map(f=>f*h);
  // dome coffers
  for(let j=0;j<6;j++){
   const yb=T[0]-10-j*h*.034,hh=h*.024,n=18;
   for(let k=-n;k<=n;k++){const x=cx+k*(w/(2*n))*1.08;const y=cy(yb,x);const cw=w/(2*n)*.78;
    g.fillStyle=`rgba(${28+j*2},${66-j*4},${70-j*4},${.55-j*.06})`;g.fillRect(x-cw/2,y-hh,cw,hh);
    g.strokeStyle=`rgba(224,179,84,${.16-j*.02})`;g.lineWidth=1;g.strokeRect(x-cw/2+.5,y-hh+.5,cw-1,hh-1);}
  }
  // oculus glow
  gr=g.createRadialGradient(cx,-h*.04,0,cx,-h*.04,w*.42);gr.addColorStop(0,'rgba(255,230,170,.62)');gr.addColorStop(.35,'rgba(255,210,140,.2)');gr.addColorStop(1,'rgba(255,210,140,0)');g.fillStyle=gr;g.fillRect(0,0,w,h*.6);
  // tiers of shelves
  const pal=['#6e2430','#8a3a2a','#2f4d7a','#284f3f','#7a5a2a','#4a2f4f','#9a6b32','#3b3b52','#5b2a22','#1f5a5a','#a8843e','#7d2f45'];
  for(let i=0;i<4;i++){
   const top=T[i],bot=T[i+1];
   // back wall
   g.beginPath();for(let x=-4;x<=w+4;x+=6)g.lineTo(x,cy(top,x));for(let x=w+4;x>=-4;x-=6)g.lineTo(x,cy(bot,x));g.closePath();g.fillStyle='#1a120e';g.fill();
   let x=-2;
   while(x<w+2){
    const sw=(2.2+R()*4.4)*(.8+i*.14);
    const t=cy(top,x),b=cy(bot,x),Hh=b-t,balc=Hh*.2,rowH=(Hh-balc)/2;
    for(let r=0;r<2;r++){
     const rb=t+balc+rowH*(r+1)-3;
     if(R()<.035)continue;
     const sh=(rowH-7)*(.6+R()*.36);
     g.fillStyle=pal[Math.floor(R()*pal.length)];g.fillRect(x,rb-sh,sw-.7,sh);
     if(R()<.5){g.fillStyle='rgba(235,195,115,.5)';g.fillRect(x,rb-sh+sh*.16,sw-.7,1);g.fillRect(x,rb-sh+sh*.82,sw-.7,1);}
     g.fillStyle='rgba(255,255,255,.07)';g.fillRect(x,rb-sh,1,sh);
    }
    x+=sw;
   }
   // planks
   for(let r=0;r<2;r++){line(xx=>{const t=cy(top,xx),b=cy(bot,xx),bl=(b-t)*.2;return t+bl+((b-t-bl)/2)*(r+1)-1.5;});g.strokeStyle='#2e1d13';g.lineWidth=3.2;g.stroke();}
   // balcony
   const ledge=xx=>{const t=cy(top,xx),b=cy(bot,xx);return t+(b-t)*.2;};
   const rail=xx=>{const t=cy(top,xx),b=cy(bot,xx);return t+(b-t)*.035;};
   g.strokeStyle='rgba(224,179,84,.32)';g.lineWidth=1.3;
   for(let xx=0;xx<=w;xx+=8){g.beginPath();g.moveTo(xx,rail(xx));g.lineTo(xx,ledge(xx));g.stroke();}
   line(rail);g.strokeStyle='#C99A45';g.lineWidth=2.2;g.stroke();
   line(ledge);g.strokeStyle='#2a1a12';g.lineWidth=4.5;g.stroke();
   line(xx=>ledge(xx)-2.5);g.strokeStyle='rgba(224,179,84,.35)';g.lineWidth=1;g.stroke();
   // atmospheric shade
   g.beginPath();for(let xx=-4;xx<=w+4;xx+=6)g.lineTo(xx,cy(top,xx));for(let xx=w+4;xx>=-4;xx-=6)g.lineTo(xx,cy(bot,xx));g.closePath();
   g.fillStyle=`rgba(6,18,20,${[.5,.34,.2,.1][i]})`;g.fill();
  }
  // columns
  const N=9;
  for(let k=0;k<N;k++){
   const x=w*(k+.5)/N,dist=Math.abs(x-cx)/(w/2),cw=Math.max(14,w*.024)*(1+dist*.55);
   const yt=cy(T[0],x)-12,yb=cy(T[4],x)+h*.02;
   const lg=g.createLinearGradient(x-cw/2,0,x+cw/2,0);lg.addColorStop(0,'#16302e');lg.addColorStop(.35,'#6f8d86');lg.addColorStop(.55,'#9fb8ae');lg.addColorStop(1,'#16302e');
   g.fillStyle=lg;g.fillRect(x-cw/2,yt,cw,yb-yt);
   g.strokeStyle='rgba(8,26,26,.28)';g.lineWidth=1;[-.25,0,.25].forEach(f=>{g.beginPath();g.moveTo(x+f*cw,yt+6);g.lineTo(x+f*cw,yb-6);g.stroke();});
   const vg=g.createLinearGradient(0,yt,0,yb);vg.addColorStop(0,'rgba(6,18,20,.6)');vg.addColorStop(.55,'rgba(6,18,20,.1)');vg.addColorStop(1,'rgba(6,18,20,.25)');g.fillStyle=vg;g.fillRect(x-cw/2,yt,cw,yb-yt);
   g.fillStyle='#B98A3C';g.fillRect(x-cw*.72,yt-7,cw*1.44,7);g.fillStyle='#E0B354';g.fillRect(x-cw*.62,yt,cw*1.24,3);
   g.fillStyle='#8f6a2c';g.fillRect(x-cw*.72,yb-6,cw*1.44,6);
  }
  // floor
  g.beginPath();for(let x=-4;x<=w+4;x+=6)g.lineTo(x,cy(T[4],x));g.lineTo(w+4,h);g.lineTo(-4,h);g.closePath();
  gr=g.createLinearGradient(0,T[4],0,h);gr.addColorStop(0,'#0d2624');gr.addColorStop(1,'#1c4541');g.fillStyle=gr;g.fill();
  g.save();g.clip();
  for(let k=1;k<=8;k++){g.beginPath();g.ellipse(cx,h*1.02,w*.11*k,h*.038*k,0,0,Math.PI*2);g.strokeStyle=`rgba(224,179,84,${k%2?.13:.07})`;g.lineWidth=k%2?1.6:1;g.stroke();}
  g.fillStyle='rgba(224,179,84,.4)';g.beginPath();g.moveTo(cx-1,T[4]);g.lineTo(cx+1,T[4]);g.lineTo(cx+5,h);g.lineTo(cx-5,h);g.fill();
  // compass rose
  const rc=h*.94;g.save();g.translate(cx,rc);g.scale(1,.32);g.fillStyle='rgba(224,179,84,.28)';
  for(let a=0;a<8;a++){g.rotate(Math.PI/4);g.beginPath();g.moveTo(0,0);g.lineTo(a%2?8:14,0);g.lineTo(0,a%2?w*.05:w*.09);g.lineTo(a%2?-8:-14,0);g.fill();}
  g.restore();g.restore();
  // vignette
  gr=g.createRadialGradient(cx,h*.45,Math.min(w,h)*.2,cx,h*.45,Math.max(w,h)*.8);gr.addColorStop(0,'rgba(3,10,12,0)');gr.addColorStop(1,'rgba(3,10,12,.78)');g.fillStyle=gr;g.fillRect(0,0,w,h);
  return c;
 }
 function initParts(){const n=Math.min(130,Math.round(W*H/12000));parts=[];for(let i=0;i<n;i++)parts.push({x:Math.random()*W,y:Math.random()*H,r:rnd(.6,2),vy:-rnd(.08,.35),f:rnd(.3,1.2),ph:rnd(0,6.28),a:rnd(.25,.8),tw:rnd(.8,2.5)});}
 function resize(){DPR=Math.min(2,window.devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=Math.round(W*DPR);cv.height=Math.round(H*DPR);scene=build(W+40,H+40);initParts();if(reduceMotion)draw(0);}
 function draw(now){
  const t=now/1000;px+=(tx-px)*.04;py+=(ty-py)*.04;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  ctx.drawImage(scene,-20+px,-20+py,W+40,H+40);
  const il=document.body.classList.contains('illum');
  ctx.save();ctx.globalCompositeOperation='lighter';
  for(let i=0;i<5;i++){
   const sway=Math.sin(t*.22+i*1.7)*W*.03,topX=W/2+(i-2)*W*.03,spread=W*(.09+i*.02),botX=W/2+(i-2)*W*.17+sway;
   const a=(il?.13:.06)*(.7+.3*Math.sin(t*.55+i*2));
   const lg=ctx.createLinearGradient(0,0,0,H);lg.addColorStop(0,`rgba(255,226,165,${a})`);lg.addColorStop(1,'rgba(255,226,165,0)');
   ctx.fillStyle=lg;ctx.beginPath();ctx.moveTo(topX-10,-10);ctx.lineTo(topX+10,-10);ctx.lineTo(botX+spread/2,H);ctx.lineTo(botX-spread/2,H);ctx.fill();
  }
  for(const p of parts){
   p.y+=p.vy*(il?2.4:1);p.x+=Math.sin(t*p.f+p.ph)*.18;
   if(p.y<-5){p.y=H+5;p.x=Math.random()*W;}
   const al=p.a*(.55+.45*Math.sin(t*p.tw+p.ph));
   ctx.fillStyle=il?`rgba(255,214,120,${al})`:`rgba(255,238,205,${al*.7})`;
   ctx.beginPath();ctx.arc(p.x+px*.5,p.y,il?p.r*1.4:p.r,0,6.283);ctx.fill();
  }
  ctx.restore();
 }
 function loop(now){if(!document.hidden)draw(now);requestAnimationFrame(loop);}
 function start(){resize();addEventListener('resize',()=>{clearTimeout(start._t);start._t=setTimeout(resize,150);});
  addEventListener('pointermove',e=>{tx=(e.clientX/W-.5)*-14;ty=(e.clientY/H-.5)*-8;});
  if(!reduceMotion&&!running){running=true;requestAnimationFrame(loop);}}
 return{start};
})();

/* ================= art ================= */
function folioSVG(mood='n',cls=''){return `<svg class="folio ${cls}" data-mood="${mood}" viewBox="0 0 150 122" aria-hidden="true">
<defs><radialGradient id="fbg" cx=".38" cy=".3" r=".75"><stop offset="0" stop-color="#D2EE9C"/><stop offset="1" stop-color="#6E9E40"/></radialGradient></defs>
<ellipse cx="70" cy="114" rx="58" ry="6" fill="rgba(0,0,0,.28)"/>
<g fill="#2A1E17"><ellipse cx="27" cy="107" rx="5" ry="3"/><ellipse cx="48" cy="105" rx="5" ry="3"/><ellipse cx="70" cy="101" rx="5" ry="3"/></g>
<g stroke="#2A1E17" stroke-width="3" fill="url(#fbg)"><circle cx="26" cy="93" r="13"/><circle cx="47" cy="89" r="15"/><circle cx="69" cy="82" r="17"/><circle cx="100" cy="60" r="30"/></g>
<path d="M18 88q6-7 13-4M38 82q7-8 16-5M58 73q8-9 19-6" stroke="rgba(255,255,255,.4)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<ellipse cx="80" cy="72" rx="6" ry="4" fill="#F08F7A" opacity=".65"/><ellipse cx="121" cy="72" rx="6" ry="4" fill="#F08F7A" opacity=".65"/>
<g class="fe fe-n"><circle cx="89" cy="59" r="3.4" fill="#2A1E17"/><circle cx="113" cy="59" r="3.4" fill="#2A1E17"/><circle cx="90.3" cy="57.7" r="1.1" fill="#fff"/><circle cx="114.3" cy="57.7" r="1.1" fill="#fff"/><path d="M95 76q5 4 10 0" stroke="#2A1E17" stroke-width="2.8" fill="none" stroke-linecap="round"/></g>
<g class="fe fe-h"><path d="M84 61q5-6 10 0M108 61q5-6 10 0" stroke="#2A1E17" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M92 73q8 11 16 0z" fill="#7a2a2a" stroke="#2A1E17" stroke-width="2.4" stroke-linejoin="round"/></g>
<g class="fe fe-s"><circle cx="89" cy="61" r="3" fill="#2A1E17"/><circle cx="113" cy="61" r="3" fill="#2A1E17"/><path d="M82 50l10 4M120 50l-10 4" stroke="#2A1E17" stroke-width="2.6" stroke-linecap="round"/><path d="M94 80q6-6 12 0" stroke="#2A1E17" stroke-width="2.8" fill="none" stroke-linecap="round"/></g>
<g stroke="#B8862F" stroke-width="3" fill="rgba(255,255,255,.28)"><circle cx="89" cy="59" r="10"/><circle cx="113" cy="59" r="10"/></g><path d="M99 58q2-3 4 0" stroke="#B8862F" stroke-width="3" fill="none"/>
<path d="M84 37v6q16 7 32 0v-6" fill="#1E4A42" stroke="#2A1E17" stroke-width="3" stroke-linejoin="round"/>
<path d="M72 32 100 22 128 32 100 42z" fill="#24574E" stroke="#2A1E17" stroke-width="3" stroke-linejoin="round"/>
<path d="M100 32 121 36v11" stroke="#E0B354" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="121" cy="49" r="3.4" fill="#F6DA8E" stroke="#8a5d12" stroke-width="1.2"/><circle cx="100" cy="32" r="2.6" fill="#E0B354"/>
</svg>`;}
function blotSVG(){return `<svg class="blot" id="blot" viewBox="0 0 200 170" aria-hidden="true">
<defs><radialGradient id="blg" cx=".4" cy=".3" r=".8"><stop offset="0" stop-color="#4a3470"/><stop offset=".6" stop-color="#1d1230"/><stop offset="1" stop-color="#0c0716"/></radialGradient></defs>
<g opacity=".85"><rect x="18" y="30" width="18" height="24" rx="2" fill="#F4E7C9" transform="rotate(-24 27 42)"/><rect x="165" y="44" width="16" height="22" rx="2" fill="#E6D2A6" transform="rotate(18 173 55)"/><rect x="150" y="10" width="13" height="17" rx="2" fill="#F4E7C9" transform="rotate(-10 156 18)"/></g>
<path d="M100 20C130 18 150 35 160 55c15 5 22 25 12 43-2 20-22 30-34 28-4 14-10 24-16 12-4-10-12-8-22-6-12 2-20-4-28-2-2 16-12 22-14 6-2-10-14-12-22-24-14-12-16-32-6-46 6-22 30-44 70-46z" fill="url(#blg)" stroke="#8b6fc4" stroke-width="2"/>
<path d="M70 58l20 8M130 58l-20 8" stroke="#F6DA8E" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="80" cy="76" rx="10" ry="12" fill="#F6DA8E"/><ellipse cx="120" cy="76" rx="10" ry="12" fill="#F6DA8E"/>
<ellipse cx="82" cy="79" rx="4" ry="6" fill="#1b0f2c"/><ellipse cx="118" cy="79" rx="4" ry="6" fill="#1b0f2c"/>
<path d="M74 106l8-7 8 7 8-7 8 7 8-7 8 7 8-7" stroke="#F6DA8E" stroke-width="3.2" fill="none" stroke-linejoin="round"/>
<circle cx="60" cy="140" r="5" fill="#1d1230"/><circle cx="128" cy="150" r="4" fill="#1d1230"/>
</svg>`;}

