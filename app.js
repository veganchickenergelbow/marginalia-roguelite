<script>
(()=>{
'use strict';
/* ================= helpers ================= */
const $=(s,el=document)=>el.querySelector(s);
const $$=(s,el=document)=>[...el.querySelectorAll(s)];
const rnd=(a,b)=>a+Math.random()*(b-a);
const ri=(a,b)=>Math.floor(rnd(a,b+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const wpick=(items,wf)=>{let tot=0;const ws=items.map(i=>{const w=Math.max(0,wf(i));tot+=w;return w;});let r=Math.random()*tot;for(let i=0;i<items.length;i++){r-=ws[i];if(r<=0)return items[i];}return items[items.length-1];};
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const fmt=n=>Math.round(n).toLocaleString('en-US');

/* ================= icons ================= */
const ICONS={
 sg:'<path d="M11 4.5a7.5 7.5 0 0 0 0 15A9 9 0 0 1 11 4.5z" fill="currentColor" stroke="none"/><g fill="currentColor" stroke="none"><circle cx="15.5" cy="8.9" r="1.05"/><circle cx="18.3" cy="11" r="1.05"/><circle cx="17.2" cy="14.3" r="1.05"/><circle cx="13.8" cy="14.3" r="1.05"/><circle cx="12.7" cy="11" r="1.05"/></g>',
 food:'<path d="M3.5 11.5h17a8.5 7.5 0 0 1-17 0z"/><path d="M8.5 20.5h7"/><path d="M13 2.5l6.5 7.5M16.5 2l5 6.5"/><path d="M8 8.5c-1-1.2.9-2 0-3.4"/>',
 sea:'<circle cx="16.5" cy="7" r="3"/><path d="M2 14c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0"/><path d="M2 18.5c2.5-2 4.5-2 7 0s4.5 2 7 0 4.5-2 6 0"/>',
 world:'<circle cx="12" cy="12" r="9"/><path d="M12 5l2.2 7L12 19l-2.2-7z" fill="currentColor"/><path d="M4.5 12H6M18 12h1.5M12 3v1.5"/>',
 sci:'<circle cx="12" cy="12" r="2.4" fill="currentColor"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(35 12 12)"/><circle cx="19.6" cy="7.2" r="1.4" fill="currentColor"/>',
 sport:'<circle cx="7" cy="17" r="3.2"/><path d="M9 14.6 12.6 3.6M9.8 15.6 17.6 5.6M9.4 17.6 20.4 11.4"/><path d="M12.6 3.6c4 .3 7 3.4 7.8 7.8"/>',
 word:'<path d="M20 3c-6 1-11 5-13 12l-1.6 5.5 1.8-.6c1-2.8 2.2-4.6 4-5.6 5-2.4 7.9-6 8.8-11.3z"/><path d="M7.4 15.2l6-6"/>',
 bolt:'<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H12z" fill="currentColor"/>',
 elite:'<path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2z"/><path d="M5 18a2 2 0 0 1 2-2h11"/><circle cx="11.5" cy="9" r="1.7" fill="currentColor"/><path d="M11.5 10.5v2.8"/>',
 bindery:'<path d="M9 3.5h6l-1.6 3.3h-2.8z"/><path d="M10.6 6.8C6.4 8.8 4.6 12.5 5 16c.4 3.2 3 5 7 5s6.6-1.8 7-5c.4-3.5-1.4-7.2-5.6-9.2"/><path d="M13.6 11.6c-.4-.8-3.2-1-3.2.6s3.2 1 3.2 2.8-2.8 1.5-3.4.6M12 10v1M12 16v1"/>',
 rest:'<path d="M4 11c0-3 3.5-5 8-5s8 2 8 5z"/><path d="M12 11v7M7.5 20.5h9"/><path d="M12 6V4"/>',
 curio:'<path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
 boss:'<path d="M12 3c3 0 4 2 6 2.5s3.5 3 2.5 5.5 1 4-1 6-4 1.5-5.5 3-4 1-5.5-.5-4-1-4.5-3.5S2.5 12 3.5 10s1-4 3.5-5S9 3 12 3z" fill="currentColor" stroke="none"/><circle cx="9.3" cy="11" r="1.5" fill="#F6DA8E" stroke="none"/><circle cx="14.7" cy="11" r="1.5" fill="#F6DA8E" stroke="none"/>',
 strike:'<path d="M4 6h12M4 12h16M4 18h9"/><path d="M3 21 21 3" stroke-width="2.2"/>',
 hourglass:'<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/><path d="M9.5 19.5h5l-2.5-3z" fill="currentColor"/>',
 ward:'<path d="M3.5 15a8.5 5.5 0 0 1 17 0z"/><path d="M3.5 15h17v2.5h-17z"/><path d="M12 9.5V5M9.5 5h5"/>',
 dogear:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/><path d="M9 12h6M9 16h4"/>',
 page:'<path d="M6 3h9l3 3v15H6z"/><path d="M9 10h6M9 14h6M9 18h4"/>',
 heart:'<path d="M12 20s-7.5-4.6-7.5-10.2A4.1 4.1 0 0 1 12 7.4a4.1 4.1 0 0 1 7.5 2.4C19.5 15.4 12 20 12 20z"/>',
 cup:'<path d="M5 8h11v6a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8 5.5c0-1 1-1 1-2.2M12 5.5c0-1 1-1 1-2.2"/>',
 tissue:'<rect x="4" y="9" width="16" height="10" rx="2"/><path d="M9 9c0-3.4 6-3.4 6 0"/><path d="M8 14h8"/>',
 abacus:'<rect x="4" y="4" width="16" height="16" rx="1.5"/><path d="M4 9.5h16M4 14.5h16"/><circle cx="8" cy="9.5" r="1.4" fill="currentColor"/><circle cx="11.5" cy="9.5" r="1.4" fill="currentColor"/><circle cx="15.5" cy="14.5" r="1.4" fill="currentColor"/><circle cx="9" cy="14.5" r="1.4" fill="currentColor"/>',
 cloud:'<path d="M7 15a4 4 0 0 1 .5-8A5 5 0 0 1 17 8.2a3.4 3.4 0 0 1 0 6.8z"/><path d="M8 18.2l-1 2.4M12 18.2l-1 2.4M16 18.2l-1 2.4"/>',
 lantern:'<path d="M9 5h6M11 3h2"/><path d="M8 7h8l1 10H7z"/><path d="M12 10v4"/><path d="M8 20h8M12 17v3"/>',
 orchid:'<circle cx="12" cy="12" r="2" fill="currentColor"/><path d="M12 10c-2.2-3-1.2-6 0-7.2 1.2 1.2 2.2 4.2 0 7.2zM14 12c3-2.2 6-1.2 7.2 0-1.2 1.2-4.2 2.2-7.2 0zM10 12c-3-2.2-6-1.2-7.2 0 1.2 1.2 4.2 2.2 7.2 0zM13.2 13.8c2 3 1.8 6.2.8 7.2-1-.8-2.8-3.6-.8-7.2zM10.8 13.8c-2 3-1.8 6.2-.8 7.2 1-.8 2.8-3.6.8-7.2z"/>',
 chopsticks:'<path d="M5 21 17 3M9.5 21 19.5 5"/>',
 husk:'<circle cx="12" cy="13" r="6"/><path d="M12 7V4M12 19v2.2M6 13H3.8M18 13h2.2M7.8 8.8 6.2 7.2M16.2 8.8l1.6-1.6M7.8 17.2l-1.6 1.6M16.2 17.2l1.6 1.6"/>',
 ledger:'<path d="M4 5h6.5a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4zM20 5h-5.5a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2H20z"/>',
 satchel:'<path d="M4 9h16v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M4 9l2-4.5h12L20 9M10 13h4"/>',
 taper:'<path d="M9 9h6v12H9z"/><path d="M12 2.5c1.7 2.1 1.9 3.5 0 4.8-1.9-1.3-1.7-2.7 0-4.8z" fill="currentColor"/><path d="M6.5 21h11M10.5 12v4"/>',
 clepsydra:'<path d="M5.5 4h13l-2.5 7.5h-8z"/><path d="M12 11.5v2.5"/><path d="M12 16c1.1 1.3 1.4 2.2 0 3.3-1.4-1.1-1.1-2 0-3.3z" fill="currentColor"/><path d="M6 21h12"/>',
 worm:'<circle cx="5.5" cy="16.5" r="2.5"/><circle cx="10" cy="15" r="3"/><circle cx="15.8" cy="11" r="4.4"/><circle cx="17.2" cy="10.2" r=".9" fill="currentColor"/>',
 astrolabe:'<circle cx="12" cy="13.5" r="7.5"/><circle cx="12" cy="13.5" r="3.5"/><path d="M12 6V3.5M10 3.5h4M4.5 13.5h15M7 8.5l10 10"/>',
 goldleaf:'<path d="M12 3l2.2 6.8L21 12l-6.8 2.2L12 21l-2.2-6.8L3 12l6.8-2.2z" fill="currentColor"/>',
 tin:'<rect x="4" y="9" width="16" height="10" rx="2"/><path d="M3.5 9h17V6.5h-17z"/><path d="M8 14h8"/>',
 monocle:'<circle cx="10" cy="10" r="6"/><path d="M14.4 14.4 20 21"/><path d="M7.5 8.6a3 3 0 0 1 2.8-2"/>',
 jacket:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 11h6M9 14.5h4"/>',
 card:'<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h6M7 13.5h4"/><circle cx="16.5" cy="12" r="2"/>',
 owl:'<path d="M6 8 4.5 4 8 6.2a7 7 0 0 1 8 0L19.5 4 18 8c1.3 1.6 2 3.5 2 5.5C20 18 16.4 21 12 21s-8-3-8-7.5c0-2 .7-3.9 2-5.5z"/><circle cx="9.3" cy="11.5" r="2"/><circle cx="14.7" cy="11.5" r="2"/><path d="M11.2 14.8 12 16l.8-1.2z" fill="currentColor"/>',
 check:'<path d="M5 12.5l4.5 4.5L19 7.5" stroke-width="2.6"/>',
 sound:'<path d="M4 10v4h3.5l4.5 4V6L7.5 10z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"/>',
 mute:'<path d="M4 10v4h3.5l4.5 4V6L7.5 10z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5"/>',
 seal:'<path d="M12 5l2 4.5 4.8.4-3.7 3.1 1.2 4.7L12 15.1 7.7 17.7l1.2-4.7L5.2 9.9 10 9.5z" fill="currentColor" stroke="none"/>'
};

Object.assign(ICONS,{
 chest:'<path d="M3.5 10.5h17V20h-17z"/><path d="M3.5 10.5a8.5 5.5 0 0 1 17 0"/><path d="M3.5 13.5h17"/><rect x="10.3" y="12" width="3.4" height="4" rx=".8" fill="currentColor"/>',
 rewrite:'<path d="M4 20l1-4L16 5l3 3L8 19z"/><path d="M14 7l3 3"/><path d="M13 20h7"/>',
 fresh:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v3h3"/><path d="M9 14a3 3 0 1 0 1-2.2M9 10.5v2h2"/>',
 double:'<path d="M9 3c2 3 3 4.6 3 6.4a3 3 0 0 1-6 0C6 7.6 7 6 9 3z"/><path d="M16 9c2 3 3 4.6 3 6.4a3 3 0 0 1-6 0c0-1.8 1-3.4 3-6.4z"/>',
 stub:'<path d="M9 12h6v9H9z"/><path d="M12 5c1.6 2 1.8 3.4 0 4.6-1.8-1.2-1.6-2.6 0-4.6z" fill="currentColor"/><path d="M6.5 21h11"/>',
 rosetta:'<path d="M5 4l12-1 2 17-13 1z"/><path d="M8 8h7M8 11h8M8 14h6M8 17h7"/>',
 fish:'<path d="M3 13c3-4 8-6 13-5l5-3-1 5 1 5-5-2c-4 2-9 2-13 0z"/><circle cx="15.5" cy="10.5" r=".9" fill="currentColor"/><path d="M3 13l-1 2M5 11l-2-1"/>',
 lens:'<circle cx="10" cy="10" r="6"/><path d="M14.5 14.5 21 21"/>',
 weights:'<path d="M6 10h12l2 10H4z"/><path d="M9 10a3 3 0 0 1 6 0"/>',
 cat:'<path d="M5 20V9l2.5-5L10 8h4l2.5-4L19 9v11z"/><circle cx="9.5" cy="13" r="1" fill="currentColor"/><circle cx="14.5" cy="13" r="1" fill="currentColor"/><path d="M11 16.5h2"/>',
 bell:'<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
 inkpot:'<path d="M7 9h10l1 11H6z"/><path d="M9 9V6h6v3"/><path d="M14 3l5-1"/>',
 star:'<path d="M12 3l2.6 5.6 6 .6-4.5 4 1.3 6L12 16.2 6.6 19.2l1.3-6-4.5-4 6-.6z"/>'
});
const ic=(n,cls='')=>`<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]||''}</svg>`;
const starsHTML=n=>`<span class="stars" aria-label="${n} of 3 stars">${'★'.repeat(n)}<span class="off">${'★'.repeat(3-n)}</span></span>`;

/* ================= data ================= */
const CATS={
 sg:{name:'Lion City Wing',short:'Singapore',place:'Singapore',color:'#B8413B',ic:'sg'},
 food:{name:'The Banquet Hall',short:'Food & Drink',place:'Istanbul',color:'#C47A28',ic:'food'},
 sea:{name:'Monsoon Gallery',short:'Asia',place:'Melaka',color:'#2A7E86',ic:'sea'},
 world:{name:'Silk Road Stacks',short:'World History',place:'Samarkand',color:'#6F4A9A',ic:'world'},
 sci:{name:'The Orrery',short:'Science & Nature',place:'Jaipur',color:'#35609F',ic:'sci'},
 sport:{name:'Stadium Archive',short:'Sport',place:'Olympia',color:'#34804F',ic:'sport'},
 word:{name:'Lexicon & Legend',short:'Words & Myths',place:'Timbuktu',color:'#8C3A5E',ic:'word'}
};
const CAT_KEYS=Object.keys(CATS);
const TOPICS={
 sg:{streets:'Streets & Places',brands:'Home-grown Brands',food:'Food & Kopi',culture:'Everyday Life & Culture',history:'History & Legends',landmarks:'Landmarks & Heritage'},
 food:{asia:'Asian Kitchens',spice:'Spices & Harvests',world:'World Kitchens'},
 sea:{capitals:'Capitals & Currencies',heritage:'Temples & Heritage',peoples:'Nations & Festivals',geo:'Mountains, Rivers & Skylines'},
 world:{wonders:'Wonders & Monuments',empires:'Empires & Rulers',explorers:'Explorers & Trade Routes',libraries:'Great Libraries'},
 sci:{space:'Space',nature:'Nature & Earth',body:'The Human Body',matter:'Chemistry & Physics',people:'Great Scientists'},
 sport:{football:'Football',olympics:'The Olympics',racquet:'Racquet Sports',others:'Cricket, Combat & More'},
 word:{borrowed:'Words & Languages',myths:'Myths & Gods',books:'Books & Authors',festivals:'Festivals & Calendars'}
};
const ACTS=[
 {n:'Act I',name:'The Rotunda',text:'Gentle books to find your feet. The Silverfish Queen waits on the top shelf.',plan:[[1,1,1],[1,1,2],[1,2,2]],boss:{id:'silverfish',name:'The Silverfish Queen',sub:'Devourer of Margins',seals:6}},
 {n:'Act II',name:'The Silk Road Galleries',text:'Harder books, perfumed with spice and dust. A great moth waits in the rafters.',plan:[[1,2,2],[2,2,2],[2,2,3]],boss:{id:'moth',name:'The Dust Moth',sub:'Eater of Pages',seals:7}},
 {n:'Act III',name:'The Meridian Dome',text:'The oldest and hardest books, beneath the dome itself. The Blot spreads from the Oculus.',plan:[[2,2,3],[2,3,3],[2,3,3]],boss:{id:'blot',name:'The Blot',sub:'Keeper of Oblivion',seals:8}}
];
const SHELVES=3;
const RN=['I','II','III'];
const KIND_LABEL={m:'Choose one',tf:'True or false',e:'Estimate',o:'Put in order'};

const qhash=t=>{let h=5381;for(let i=0;i<t.length;i++)h=((h<<5)+h+t.charCodeAt(i))|0;return (h>>>0).toString(36);};
const BANK=QB;
BANK.forEach(q=>{q.id=q.c+'-'+qhash(q.q);});
const topicName=q=>TOPICS[q.c][q.s]||CATS[q.c].short;

const QUILLS={
 strike:{name:'Strike Through',ic:'strike',desc:'50/50: cross out two wrong answers. Narrows an estimate, or places the first item of an order puzzle.'},
 hourglass:{name:'Hourglass',ic:'hourglass',desc:'Add 10 seconds to the fuse.'},
 ward:{name:'Blotting Paper',ic:'ward',desc:'Your next mistake on this question costs nothing.'},
 dogear:{name:'Dog-ear',ic:'dogear',desc:'Skip this question. No penalty, streak kept.'},
 rewrite:{name:'Rewriting Quill',ic:'rewrite',desc:'Rewrite this question into a wing of your choice, at the same difficulty.'},
 fresh:{name:'Fresh Page',ic:'fresh',desc:'Swap this question for a new one from the same book.'},
 double:{name:'Double Ink',ic:'double',desc:'Triple ink if you’re right. Double wax lost if you’re wrong.'},
 stub:{name:'Candle Stub',ic:'stub',desc:'Heal 2 wax, right now.'}
};
const QKEYS=['q','w','e','r','t','y'];
/* item key -> painterly art path; falls back to the line-art ICON badge when absent */
const ART={
};
function cicHTML(icn,key,cls=''){
 if(key&&ART[key])return `<span class="cic art ${cls}"><img src="${ART[key]}" alt=""></span>`;
 return `<span class="cic ${cls}">${ic(icn)}</span>`;
}
const RELICS={
 taper:{name:'Everburning Taper',ic:'taper',desc:'+3 max wax, and heal 3 now.',gain(){R.maxWax+=3;heal(3);}},
 clepsydra:{name:'Clepsydra',ic:'clepsydra',desc:'An ancient water clock. Every fuse burns 4 seconds longer.'},
 segment:{name:'Spare Segment',ic:'worm',desc:'Worms can spare a segment. Your first mistake in each book doesn’t break your streak.'},
 abacus:{name:'Merchant’s Abacus',ic:'abacus',desc:'+1 page for every correct answer.'},
 astrolabe:{name:'Brass Astrolabe',ic:'astrolabe',desc:'Estimates are 50% more forgiving.'},
 goldleaf:{name:'Illuminator’s Gold Leaf',ic:'goldleaf',desc:'Illumination starts at a 4-streak instead of 5.'},
 vellum:{name:'Tin of Vellum Crumbs',ic:'tin',desc:'A bookworm’s favourite snack. Heal 1 wax after every book.'},
 monocle:{name:'Speed-Reader’s Monocle',ic:'monocle',desc:'Speed bonuses are doubled.'},
 jacket:{name:'Tooled Leather Jacket',ic:'jacket',desc:'A sturdy book cover. Mistakes cost 1 less wax (minimum 1).'},
 card:{name:'Lifetime Library Card',ic:'card',desc:'Everything in the Bindery costs 25% less.'},
 compass:{name:'Mariner’s Compass',ic:'world',desc:'Each new passport stamp heals 2 wax and gives 5 pages.'},
 satchel:{name:'Scholar’s Satchel',ic:'satchel',desc:'+2 quill slots, and a free quill now.',gain(){R.slots+=2;gainQuill(randQuill());}},
 owl:{name:'Owl of Minerva',ic:'owl',desc:'Once per run, when your candle would go out, it stays lit with 1 wax.'},
 rosetta:{name:'Rosetta Fragment',ic:'rosetta',desc:'The first multiple-choice question in every book starts as a 50/50.'},
 cartographer:{name:'Cartographer’s Ink',ic:'rewrite',desc:'Gain a Rewriting Quill now and at the start of every act.',gain(){gainQuill('rewrite');}},
 silverfish:{name:'Pet Silverfish',ic:'fish',desc:'It sniffs out treasure. Chests hold one extra item.'},
 lens:{name:'Magnifying Glass',ic:'lens',desc:'★★★ questions get 5 extra seconds.'},
 weights:{name:'Brass Page Weights',ic:'weights',desc:'Books pay 50% more pages.'},
 cat:{name:'Library Cat',ic:'cat',desc:'The first time-out in each book costs no wax.'},
 bell:{name:'Reading-Room Bell',ic:'bell',desc:'Resting heals 3 extra wax.'},
 inkpot:{name:'Inkpot of Plenty',ic:'inkpot',desc:'+25% ink from every correct answer.'},
 lodestar:{name:'Lodestar',ic:'star',desc:'A perfect book (no mistakes) also heals 2 wax.'}
};
const SAY={
 ok:['Splendid!','Well read!','Bravo!','Brilliant!','Exactly so!','Marvellous!','Top marks!'],
 bad:['Oh dear…','Not quite!','Ink spilt…','Hmm, curious.','Next page!'],
 slow:['Out of time!','The fuse won!'],
 illum:['The page is glowing!','Illuminated!'],
 start:['Onward!','To the stacks!','Let’s read!']
};

/* ================= save ================= */
const SAVE_KEY='marginalia.v2';
function loadSave(){try{const s=JSON.parse(localStorage.getItem(SAVE_KEY)||'null');if(s&&s.codex)return s;}catch(e){}return{best:0,runs:0,wins:0,codex:{}};}
function persist(){try{localStorage.setItem(SAVE_KEY,JSON.stringify(SAVE));}catch(e){}}
let SAVE=loadSave();
function record(q,ok){const r=SAVE.codex[q.id]||{s:0,r:0,l:0};r.s++;if(ok)r.r++;r.l=ok?1:0;SAVE.codex[q.id]=r;persist();}

/* ================= sound ================= */
let AC=null,muted=false;
try{muted=localStorage.getItem('marginalia.mute')==='1';}catch(e){}
function ac(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)();}catch(e){AC=null;}}if(AC&&AC.state==='suspended')AC.resume();return AC;}
function tone(f,d=.12,type='sine',v=.07,when=0,to){if(muted)return;const a=ac();if(!a)return;const t=a.currentTime+when;const o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(to)o.frequency.exponentialRampToValueAtTime(to,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.01);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g).connect(a.destination);o.start(t);o.stop(t+d+.02);}
const sfx={
 click(){tone(660,.05,'triangle',.04);},
 ok(s){const b=523*Math.pow(2,Math.min(s,12)/24);tone(b,.12,'triangle',.07);tone(b*1.25,.12,'triangle',.06,.07);tone(b*1.5,.22,'triangle',.06,.14);},
 bad(){tone(180,.28,'sawtooth',.05,0,90);tone(110,.3,'square',.03,.02);},
 tick(){tone(1320,.03,'square',.018);},
 illum(){[784,988,1175,1568].forEach((f,i)=>tone(f,.35,'sine',.05,i*.06));},
 coin(){tone(1046,.07,'square',.03);tone(1568,.12,'square',.03,.06);},
 stamp(){tone(90,.18,'sine',.12,0,50);tone(400,.05,'triangle',.04);},
 boss(){tone(70,.6,'sawtooth',.06,0,40);},
 hit(){tone(300,.2,'square',.05,0,120);tone(900,.1,'triangle',.04,.05);},
 chest(){[523,659,784,1046,1318].forEach((f,i)=>tone(f,.25,'triangle',.05,i*.08));},
 page(){tone(2400,.06,'triangle',.015,0,1200);}
};

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
function folioSVG(mood='n',cls=''){return `<div class="folio ${cls}" data-mood="${mood}" aria-hidden="true">
<img class="fe fe-n" src="assets/fox-neutral.png" alt="">
<img class="fe fe-h" src="assets/fox-happy.png" alt="">
<img class="fe fe-s" src="assets/fox-hurt.png" alt="">
</div>`;}
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


function silverfishSVG(){return `<svg class="blot" id="blot" viewBox="0 0 200 170" aria-hidden="true">
<defs><linearGradient id="sfg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8EEF3"/><stop offset=".55" stop-color="#9FAEBB"/><stop offset="1" stop-color="#5E6C79"/></linearGradient></defs>
<g stroke="#C9D3DC" stroke-width="2" fill="none" stroke-linecap="round"><path d="M150 72C168 40 184 30 196 28"/><path d="M152 78C176 60 190 58 198 60"/><path d="M40 118C22 128 12 140 4 152"/><path d="M42 122C30 138 26 150 24 162"/><path d="M38 114C22 116 12 120 2 126"/></g>
<g fill="url(#sfg)" stroke="#3a4550" stroke-width="2">
<ellipse cx="52" cy="116" rx="14" ry="10" transform="rotate(-24 52 116)"/><ellipse cx="68" cy="108" rx="16" ry="13" transform="rotate(-24 68 108)"/><ellipse cx="86" cy="100" rx="18" ry="16" transform="rotate(-22 86 100)"/><ellipse cx="106" cy="92" rx="19" ry="18" transform="rotate(-20 106 92)"/><ellipse cx="126" cy="85" rx="18" ry="17" transform="rotate(-18 126 85)"/><ellipse cx="146" cy="78" rx="16" ry="15"/></g>
<g stroke="#3a4550" stroke-width="2.4" stroke-linecap="round"><path d="M82 112l-10 18M100 106l-6 20M118 98l0 20M136 92l6 18"/></g>
<ellipse cx="150" cy="74" rx="4.5" ry="5.5" fill="#F6DA8E"/><ellipse cx="151" cy="75" rx="2" ry="3" fill="#1b0f2c"/>
<path d="M138 70l10-4" stroke="#1b0f2c" stroke-width="3" stroke-linecap="round"/></svg>`;}
function mothSVG(){return `<svg class="blot" id="blot" viewBox="0 0 200 170" aria-hidden="true">
<defs><radialGradient id="mwg" cx=".5" cy=".4" r=".7"><stop offset="0" stop-color="#b59a7a"/><stop offset=".7" stop-color="#6d5640"/><stop offset="1" stop-color="#3a2c20"/></radialGradient></defs>
<g fill="url(#mwg)" stroke="#2a1e17" stroke-width="2.2">
<path d="M100 78C80 30 30 14 12 34c-14 18 2 50 30 58-20 8-30 30-18 44 16 16 52 4 76-44z"/>
<path d="M100 78C120 30 170 14 188 34c14 18-2 50-30 58 20 8 30 30 18 44-16 16-52 4-76-44z"/></g>
<g fill="#F6DA8E"><circle cx="50" cy="56" r="11"/><circle cx="150" cy="56" r="11"/></g><g fill="#2a1e17"><circle cx="50" cy="56" r="5"/><circle cx="150" cy="56" r="5"/></g>
<g stroke="#d8c3a0" stroke-width="1.5" fill="none" opacity=".6"><path d="M30 110c14-4 28-10 40-22M170 110c-14-4-28-10-40-22"/></g>
<ellipse cx="100" cy="92" rx="11" ry="34" fill="#4a3828" stroke="#2a1e17" stroke-width="2.2"/>
<g stroke="#2a1e17" stroke-width="2" fill="none" stroke-linecap="round"><path d="M96 60C88 42 80 34 70 30M104 60c8-18 16-26 26-30"/><path d="M76 34l-4 6M82 40l-5 4M124 34l4 6M118 40l5 4"/></g>
<circle cx="95" cy="66" r="3.4" fill="#F6DA8E"/><circle cx="105" cy="66" r="3.4" fill="#F6DA8E"/>
<g stroke="#2a1e17" stroke-width="2"><path d="M91 84h18M90 96h20M92 108h16"/></g></svg>`;}
function bossSVG(id){return id==='silverfish'?silverfishSVG():id==='moth'?mothSVG():blotSVG();}
function chestSVG(cls=''){return `<svg class="chest ${cls}" viewBox="0 0 150 120" aria-hidden="true">
<ellipse cx="75" cy="112" rx="62" ry="7" fill="rgba(0,0,0,.35)"/>
<rect x="18" y="52" width="114" height="58" rx="5" fill="#7a4a24" stroke="#2a1a0e" stroke-width="3"/>
<path d="M18 70h114" stroke="#2a1a0e" stroke-width="2"/>
<rect x="30" y="52" width="10" height="58" fill="#C99A45" stroke="#6b4a18" stroke-width="1.5"/><rect x="110" y="52" width="10" height="58" fill="#C99A45" stroke="#6b4a18" stroke-width="1.5"/>
<g class="lid"><path d="M16 54c0-24 14-38 59-38s59 14 59 38z" fill="#8f5a2c" stroke="#2a1a0e" stroke-width="3"/><path d="M30 52c0-18 6-30 10-33M120 52c0-18-6-30-10-33" stroke="#C99A45" stroke-width="9" fill="none"/></g>
<rect x="66" y="58" width="18" height="22" rx="3" fill="#F6DA8E" stroke="#6b4a18" stroke-width="2"/><circle cx="75" cy="67" r="3" fill="#6b4a18"/><path d="M75 69v6" stroke="#6b4a18" stroke-width="2.5"/></svg>`;}

/* ================= state ================= */
let S={screen:'title'};
let R=null,EN=null,QS=null;
const has=id=>R&&R.relics.includes(id);
const illumAt=()=>has('goldleaf')?4:5;
function heal(n){R.wax=Math.min(R.maxWax,R.wax+n);}
function randQuill(){return wpick(Object.keys(QUILLS),k=>({strike:3,hourglass:2,ward:2,dogear:2,rewrite:1.4,fresh:1.6,double:1.2,stub:2})[k]);}
function gainQuill(id){if(R.quills.length>=R.slots)return false;R.quills.push(id);return true;}
function gainRelic(id){if(!id||has(id))return null;R.relics.push(id);const r=RELICS[id];if(r.gain)r.gain();return r;}
function unownedRelics(n){return shuffle(Object.keys(RELICS).filter(k=>!has(k))).slice(0,n);}
function addStamp(c){if(!c||R.stamps.includes(c))return;R.stamps.push(c);sfx.stamp();toast(`Passport stamp: ${CATS[c].name} · ${CATS[c].place}`);if(has('compass')){heal(2);R.pages+=5;}}

/* ================= the bookcase ================= */
function dmgFor(st){return st>=3?2:1;}
function avail(c,t,st){let n=0,exact=0;for(const q of BANK){if(q.c!==c||q.s!==t||q.t==='tf'||R.used.has(q.id)||Math.abs(q.d-st)>1)continue;n++;if(q.d===st)exact++;}return{n,exact};}
function makeBook(st,usedCats,usedTopics,strict){
 const cands=[];
 for(const c of CAT_KEYS)for(const t of Object.keys(TOPICS[c])){
  if(usedTopics.has(c+t))continue;if(strict&&usedCats.has(c))continue;
  const a=avail(c,t,st);if(a.n>=st+2&&a.exact>=1)cands.push({c,t,w:Math.sqrt(a.n)});
 }
 if(!cands.length)return strict?makeBook(st,usedCats,usedTopics,false):null;
 const p=wpick(cands,x=>x.w);usedCats.add(p.c);usedTopics.add(p.c+p.t);
 return{type:'book',cat:p.c,topic:p.t,stars:st,n:st+2};
}
function genAct(a){
 const shelves=[],usedTopics=new Set();
 for(let s=0;s<SHELVES;s++){
  const usedCats=new Set();
  let items=shuffle(ACTS[a].plan[s]).map(st=>makeBook(st,usedCats,usedTopics,true)).filter(Boolean);
  if(s===1){const i=items.findIndex(b=>b.stars===Math.min(...items.map(x=>x.stars)));items[i]={type:'lightning',stars:1,n:'30s'};}
  const books=items.map((it,i)=>i).filter(i=>items[i].type==='book');
  let bossIdx=-1;
  if(s===SHELVES-1&&books.length){bossIdx=pick(books);items[bossIdx].bossDisguise=true;}
  const chestPool=books.filter(i=>i!==bossIdx);
  const hc=chestPool.length?pick(chestPool):pick(books);items[hc].hidden='chest';
  if(Math.random()<.45){const rest=books.filter(i=>i!==hc&&i!==bossIdx);if(rest.length)items[pick(rest)].hidden='curio';}
  shelves.push({items,done:false});
 }
 return shelves;
}
function startAct(a){
 R.act=a;R.shelf=0;R.shelves=genAct(a);R.pending=[];
 if(a>0&&has('cartographer'))gainQuill('rewrite');
 showCase();
}
function proceed(){const f=R&&R.pending.shift();if(f)f();else if(R)showCase();}
function bookCover(it,s,i){
 const locked=s>R.shelf,done=it.done;
 const peek=it.hidden&&!done?`<span class="peek" title="${it.hidden==='chest'?'A chest is tucked behind this book':'Something odd is tucked behind this book'}">${ic(it.hidden==='chest'?'chest':'curio')}</span>`:'';
 const state=done?`<span class="readmark">${ic('check')}Read · ${esc(it.res||'')}</span>`:'';
 const dis=locked||done?'disabled':'';
 if(it.type==='lightning'){
  return `<button class="item ${done?'read':''}" data-act="book" data-s="${s}" data-i="${i}" ${dis} aria-label="Lightning Pamphlet">${peek}
  <div class="cover" style="--c:#2E5597"><span class="med">${ic('bolt')}</span><span class="wg">Every wing</span><span class="ttl">Lightning Pamphlet</span><span class="stars">30s</span>
  <span class="meta"><span>${ic('page')}True or false · +8 pages</span><span>${ic('heart')}Mistake: −1 wax</span></span>${state}</div></button>`;
 }
 const c=CATS[it.cat];const pages=Math.round([0,5,8,12][it.stars]*(has('weights')?1.5:1));
 return `<button class="item ${done?'read':''}" data-act="book" data-s="${s}" data-i="${i}" ${dis} aria-label="${esc(c.short)}: ${esc(TOPICS[it.cat][it.topic])}, ${it.stars} stars, ${it.n} questions">${peek}
  <div class="cover" style="--c:${c.color}"><span class="med">${ic(c.ic)}</span><span class="wg">${esc(c.short)}</span><span class="ttl">${esc(TOPICS[it.cat][it.topic])}</span>${starsHTML(it.stars)}
  <span class="meta"><span>${ic('page')}${it.n} questions · +${pages} pages</span><span>${ic('heart')}Mistake: −${dmgFor(it.stars)} wax</span></span>${state}</div></button>`;
}
function showCase(){
 document.body.classList.toggle('illum',R.streak>=illumAt());
 const A=ACTS[R.act];
 const after=['then a bookend chest','then a bookend chest and the Bindery','then a bookend chest — and the boss lurks somewhere on this shelf'];
 let rows='';
 for(let s=SHELVES-1;s>=0;s--){
  const sh=R.shelves[s],locked=s>R.shelf,cur=s===R.shelf;
  rows+=`<div class="case-shelf ${locked?'locked':''} ${cur?'cur':''} ${sh.done?'cleared':''}" id="shelf${s}">
   <div class="shelf-label"><b>Shelf ${RN[s]}</b><span>${sh.done?'Cleared':locked?'Locked until the shelf below is cleared':'Read every book, in any order'} · ${after[s]}</span></div>
   <div class="shelf"><div class="shelf-row" style="--n:${sh.items.length}">${sh.items.map((it,i)=>bookCover(it,s,i)).join('')}</div><div class="plank"></div></div></div>`;
 }
 const read=R.shelves.reduce((n,sh)=>n+sh.items.filter(x=>x.done).length,0),total=R.shelves.reduce((n,sh)=>n+sh.items.length,0);
 setScreen('case',`<div class="shelfwrap">
  <div class="actbar"><div><div class="eyebrow">${esc(A.n)} · ${read} of ${total} read</div><h2>${esc(A.name)}</h2><p>${esc(A.text)}</p></div><button class="btn small" data-act="codex">Codex</button></div>
  ${rows}</div>`);
 requestAnimationFrame(()=>{const t=$('#shelf'+R.shelf);if(t)t.scrollIntoView({block:'center',behavior:reduceMotion?'auto':'smooth'});});
 if(S.caseToast){toast(S.caseToast);S.caseToast=null;}
}
function pickBook(s,i){
 const it=R.shelves[s]&&R.shelves[s].items[i];if(!it||s!==R.shelf||it.done)return;
 if(it.bossDisguise&&!it.bossRevealed){sfx.click();return revealBoss(s,i,it);}
 sfx.page();
 R.cur={s,i};
 startEncounter(it.type==='lightning'?'lightning':'book',it);
}
/* ---------- boss reveal ---------- */
function revealBoss(s,i,it){
 const btn=$(`.item[data-s="${s}"][data-i="${i}"]`);
 const b=ACTS[R.act].boss;
 R.cur={s,i};
 if(btn)btn.classList.add('boss-flip');
 sfx.boss();
 setTimeout(()=>{
  showBossReveal(b,()=>{it.bossRevealed=true;startEncounter('boss',null);});
 },reduceMotion?60:680);
}
function showBossReveal(b,cb){
 const ov=document.createElement('div');
 ov.className='boss-reveal-ov';
 ov.innerHTML=`<div class="br-flash"></div><div class="br-card">${bossSVG(b.id)}<div class="br-wg">A tome unmasks itself</div><h2>${esc(b.name)}</h2><p>${esc(b.sub)}</p></div>`;
 document.body.appendChild(ov);
 requestAnimationFrame(()=>ov.classList.add('show'));
 setTimeout(()=>{
  ov.classList.add('out');
  setTimeout(()=>{ov.remove();cb();},reduceMotion?10:520);
 },reduceMotion?60:1500);
}
/* ================= question drawing ================= */
function qWeight(q){const r=SAVE.codex[q.id];return !r?2:(r.l===0?3.5:1/(1+r.r));}
function drawQs(filter,n){
 let pool=BANK.filter(q=>filter(q)&&!R.used.has(q.id));
 if(pool.length<n)pool=pool.concat(BANK.filter(q=>filter(q)&&R.used.has(q.id)));
 const out=[];pool=pool.slice();
 while(out.length<n&&pool.length){const q=wpick(pool,qWeight);out.push(q);pool.splice(pool.indexOf(q),1);}
 return out;
}
function drawOne(cat,stars,exclude=[],topic){
 const ok=(q,d,t)=>q.c===cat&&q.d===d&&q.t!=='tf'&&(!t||q.s===t)&&!exclude.includes(q)&&q!==(QS&&QS.q);
 for(const t of topic?[topic,null]:[null])for(const d of [stars,stars-1,stars+1,stars-2,stars+2]){if(d<1||d>3)continue;const q=drawQs(x=>ok(x,d,t),1)[0];if(q)return q;}
 return drawQs(x=>x.t==='m'&&!exclude.includes(x),1)[0];
}
function bookQueue(cat,topic,stars,n){
 const out=[];let special=0;
 for(let i=0;i<n;i++){
  let q=null;
  if(special<1&&i>0&&Math.random()<.45){q=drawQs(x=>x.c===cat&&x.s===topic&&Math.abs(x.d-stars)<=1&&(x.t==='e'||x.t==='o')&&!out.includes(x),1)[0];if(q)special++;}
  if(!q&&stars===1&&Math.random()<.15)q=drawQs(x=>x.c===cat&&x.s===topic&&x.t==='tf'&&!out.includes(x),1)[0];
  if(!q){for(const d of [stars,stars-1,stars+1]){if(d<1||d>3)continue;q=drawQs(x=>x.c===cat&&x.s===topic&&x.d===d&&x.t==='m'&&!out.includes(x),1)[0];if(q)break;}}
  if(!q)q=drawOne(cat,stars,out,topic);
  if(q)out.push(q);
 }
 const first=out.find(q=>q.t==='m');
 return first?[first,...out.filter(q=>q!==first)]:out;
}
function bossQueue(n){
 const out=[];const cats=shuffle(CAT_KEYS);const ds=[[1,2],[2],[2,3]][R.act];
 for(let i=0;i<n;i++){const c=cats[i%cats.length];const d=pick(ds);const q=drawQs(x=>x.c===c&&x.d===d&&x.t!=='tf'&&!out.includes(x),1)[0]||drawOne(c,d,out);if(q)out.push(q);}
 return out;
}

/* ================= screens ================= */
const scr=$('#screen');
function setScreen(name,html){
 S.screen=name;scr.innerHTML=html;scr.scrollTop=0;
 document.body.classList.toggle('onTitle',name==='title');
 $('#hud').hidden=!R||['title','codex','end'].includes(name);
 if(!$('#hud').hidden)updateHUD();
}
function updateHUD(){
 if(!R)return;
 const f=R.wax/R.maxWax,h=Math.max(1.5,30*f),y=40-h;
 $('#waxR').setAttribute('y',y);$('#waxR').setAttribute('height',h);
 $('#flame').setAttribute('transform',`translate(0 ${y-10})`);
 $('#hWax').textContent=`${R.wax}/${R.maxWax}`;
 $('#hCandle').classList.toggle('low',R.wax<=3);
 $('#hPages').textContent=R.pages;
 $('#hScore').textContent=fmt(R.score);
 $('#hStamps').innerHTML=CAT_KEYS.map(k=>`<i class="${R.stamps.includes(k)?'on':''}" style="--c:${CATS[k].color}" title="${esc(CATS[k].name)} · ${esc(CATS[k].place)}"></i>`).join('');
 $('#hRelics').innerHTML=R.relics.map(k=>`<span class="relic-chip" title="${esc(RELICS[k].name)}: ${esc(RELICS[k].desc)}" aria-label="${esc(RELICS[k].name)}">${ic(RELICS[k].ic)}</span>`).join('');
}
function renderMute(){$('#muteBtn').innerHTML=ic(muted?'mute':'sound');}

/* ---------- title ---------- */
function showTitle(){
 R=null;document.body.classList.remove('illum');
 const seen=Object.keys(SAVE.codex).filter(id=>BANK.some(q=>q.id===id)).length;
 setScreen('title',`<div class="title">
  <div class="eyebrow">The Meridian Library · Three Acts</div>
  <h1 class="logo">Marginalia</h1>
  <p class="tagline">The great library is going blank. Pull books from its shelves, answer before the fuse burns out, and write the world back into the margins.</p>
  <div class="t-folio folio-wrap">${folioSVG('h')}<div class="bubble show">So many books!</div></div>
  <div class="t-row"><button class="btn gold" data-act="newrun">Enter the Library</button><button class="btn" data-act="howto">How to play</button><button class="btn" data-act="codex">Codex</button></div>
  <div class="t-stats">Best ink <b>${fmt(SAVE.best)}</b> · Runs <b>${SAVE.runs}</b> · Wins <b>${SAVE.wins}</b> · Facts restored <b>${seen}</b>/${BANK.length}</div>
  <div class="wings">${CAT_KEYS.map(k=>`<span class="wing" style="--c:${CATS[k].color}"><i>${ic(CATS[k].ic)}</i>${esc(CATS[k].name)} <em>· ${esc(CATS[k].place)}</em></span>`).join('')}</div>
 </div>`);
}
function howto(){
 openModal(`<div class="sheet parch" role="dialog" aria-modal="true" aria-label="How to play">
 <h2>How to play</h2><p class="muted">Three acts, six shelves each, and a boss at the top of every act. A full run takes about 20–30 minutes.</p>
 <div class="rules">
  <div class="rule"><span class="ri" style="--c:#B8413B">${ic('page')}</span><div><b>Pull a book from each shelf</b><p>Each book is one wing of the library at ★ to ★★★. A ★ book has 3 questions, ★★ has 4 and ★★★ has 5. Harder books pay more pages and better rewards. A mistake costs 1 wax, or 2 in a ★★★ book.</p></div></div>
  <div class="rule"><span class="ri" style="--c:#6B4424">${ic('chest')}</span><div><b>Chests, shops and rest</b><p>Some shelves hold a reward chest, the Bindery, a Reading Room or a Curiosity instead of a book. You can see the next shelf, so plan ahead.</p></div></div>
  <div class="rule"><span class="ri" style="--c:#9A6B22">${ic('hourglass')}</span><div><b>Beat the fuse, chain your streak</b><p>Faster answers score more ink. Five right in a row <em>Illuminates</em> the page: double ink until you slip. Running out of time costs 1 wax less than a wrong answer.</p></div></div>
  <div class="rule"><span class="ri" style="--c:#2A7E86">${ic('rewrite')}</span><div><b>Quills and bookmarks</b><p>Quills are one-shot tools on keys <kbd>Q</kbd> <kbd>W</kbd> <kbd>E</kbd> <kbd>R</kbd>: 50/50, extra time, skip, swap the question, or rewrite it into a wing you know. Bookmarks are permanent perks for the run.</p></div></div>
 </div>
 <p class="muted">After each answer, the explanation stays up until you press Next. Keys: <kbd>1</kbd>–<kbd>4</kbd> answer · <kbd>←</kbd>/<kbd>→</kbd> false/true or nudge an estimate · <kbd>Enter</kbd> lock in or continue.</p>
 <div class="panel-foot" style="margin-top:14px"><button class="btn gold" data-act="closeModal">Got it</button></div></div>`);
}
function openModal(html){$('#modalRoot').innerHTML=`<div class="modal" data-act="modalBg">${html}</div>`;}
function closeModal(){$('#modalRoot').innerHTML='';}

/* ---------- new run ---------- */
function newRun(){
 R={wax:14,maxWax:14,pages:10,score:0,streak:0,best:0,quills:['strike','hourglass','stub'],slots:4,relics:[],stamps:[],act:0,shelf:0,shelves:[],pending:[],used:new Set(),missed:[],correct:0,answered:0,books:0,owlUsed:false};
 const opts=unownedRelics(3);
 showChoice({emblem:'ledger',color:'#9A6B22',title:'Choose your first bookmark',text:'Every scholar needs a trusty bookmark. This one stays with you for the whole run.',
  choices:opts.map(k=>relicChoice(k)),after:()=>startAct(0)});
}
function relicChoice(k){return{kind:'Bookmark',ic:RELICS[k].ic,key:k,name:RELICS[k].name,desc:RELICS[k].desc,run(){gainRelic(k);}};}
function quillChoice(id){return{kind:'Quill',q:true,ic:QUILLS[id].ic,key:id,name:QUILLS[id].name,desc:R.quills.length<R.slots?QUILLS[id].desc:'Your quill slots are full, so the Bindery buys it for 6 pages.',run(){if(!gainQuill(id))R.pages+=6;}};}

/* ================= encounters ================= */
function startEncounter(kind,item,single){
 EN={kind,item,cat:item&&item.cat,stars:item&&item.stars||2,queue:[],i:0,right:0,n:0,results:[],choped:false,catUsed:false,wrong:0,ink0:R.score,pages0:R.pages,seals:0,maxSeals:0,rage:false};
 if(kind==='book'){EN.topic=item.topic;EN.queue=bookQueue(item.cat,item.topic,item.stars,item.n);}
 else if(kind==='boss'){const b=ACTS[R.act].boss;EN.seals=EN.maxSeals=b.seals;EN.boss=b;EN.queue=bossQueue(b.seals+6);EN.stars=R.act+1;}
 else if(kind==='lightning')EN.queue=shuffle(drawQs(q=>q.t==='tf',16));
 else if(kind==='curio'){EN.queue=[single];EN.stars=3;}
 renderEncounterShell();
 if(kind==='boss'){sfx.boss();toast(`${EN.boss.name} rises from the stacks!`,'bad');}
 if(kind==='lightning'){EN.total=30000;EN.deadline=performance.now()+EN.total+600;}
 say(pick(SAY.start));
 setTimeout(nextQ,kind==='boss'?700:250);
}
function encHead(){
 const k=EN.kind;
 if(k==='boss')return `<div class="boss">${bossSVG(EN.boss.id)}<div class="boss-info"><h3>${esc(EN.boss.name)}</h3><small>${esc(EN.boss.sub)}. Break every seal with correct answers.</small><div class="seals" id="seals"></div></div></div>`;
 let color,icn,title,sub;
 if(k==='book'){const c=CATS[EN.cat];color=c.color;icn=c.ic;title=`${c.short}: ${TOPICS[EN.cat][EN.item.topic]}`;sub=`${starsHTML(EN.stars)} ${esc(c.name)} · doors to ${esc(c.place)}`;}
 else if(k==='lightning'){color='#2E5597';icn='bolt';title='Lightning Pamphlet';sub='30 seconds. True or false. Go!';}
 else{color='#55613A';icn='word';title='The Wandering Scholar';sub='One hard question. A bookmark or 3 wax.';}
 return `<div class="enc-head"><div class="bookhead"><span class="spine" style="--c:${color}">${ic(icn)}</span><div><h3>${esc(title)}</h3><small>${sub}</small></div></div><div class="prog" id="prog"></div></div>`;
}
function renderEncounterShell(){
 setScreen('enc',`<div class="enc">
  <div class="enc-main">${encHead()}
   <div class="card parch" id="card"><div class="fuse" id="fuseBox"><i id="fuse"></i></div><div id="qArea"></div></div>
   <div class="tray" id="tray"></div>
  </div>
  <div class="enc-side">
   <div class="meter"><div class="m-label">Streak</div><div class="m-streak" id="mStreak">0</div><div class="m-mult" id="mMult">×1.0</div><div class="pips" id="mPips"></div><div class="m-illum">Illumination</div></div>
   <div class="side-folio folio-wrap">${folioSVG('n')}<div class="bubble" id="bubble"></div></div>
  </div></div>`);
 updateMeter(true);renderProg();renderSeals();
}
function renderProg(){
 const p=$('#prog');if(!p)return;
 if(EN.kind==='lightning'){p.innerHTML=`<span style="font:800 14px var(--ui);color:var(--gold-hi)">${EN.right} correct</span>`;return;}
 const n=EN.queue.length;let h='';for(let i=0;i<n;i++){const r=EN.results[i];h+=`<i class="${r===1?'ok':r===0?'bad':i===EN.i?'cur':''}"></i>`;}p.innerHTML=h;
}
function renderSeals(){const s=$('#seals');if(!s)return;let h='';for(let i=0;i<EN.maxSeals;i++)h+=`<span class="seal ${i>=EN.seals?'broken':''}">${ic('seal')}</span>`;s.innerHTML=h;}
function mult(){return 1+.2*Math.min(Math.max(R.streak-1,0),10);}
function updateMeter(silent){
 const s=$('#mStreak');if(!s)return;
 s.textContent=R.streak;$('#mMult').textContent='×'+mult().toFixed(1)+(R.streak>=illumAt()?' ×2':'');
 let h='';for(let i=0;i<illumAt();i++)h+=`<i class="${i<R.streak?'on':''}"></i>`;$('#mPips').innerHTML=h;
 const was=document.body.classList.contains('illum'),now=R.streak>=illumAt();
 document.body.classList.toggle('illum',now);
 if(now&&!was&&!silent){sfx.illum();banner('Illuminated!');say(pick(SAY.illum));}
}
function timerFor(q){
 let base={m:15,e:20,o:20,tf:10}[q.t];
 if(EN.kind==='book')base-=(EN.stars-1);
 if(EN.kind==='boss'){base-=R.act;if(EN.rage)base-=2;}
 if(has('clepsydra'))base+=4;
 if(has('lens')&&(q.d===3))base+=5;
 return Math.max(6,base);
}
function nextQ(){
 if(!EN)return;
 if(EN.kind==='lightning'&&(EN.i>=EN.queue.length||performance.now()>=EN.deadline))return finishEncounter();
 if(EN.kind!=='lightning'&&EN.kind!=='boss'&&EN.i>=EN.queue.length)return finishEncounter();
 if(EN.kind==='boss'&&EN.i>=EN.queue.length)EN.queue=EN.queue.concat(bossQueue(6));
 loadQ(EN.queue[EN.i]);
}
function loadQ(q){
 R.used.add(q.id);
 QS={q,done:false,ward:false,double:false,shown:performance.now()};
 if(q.t==='m'){QS.opts=shuffle(q.a.map((t,i)=>({t,ok:i===0})));}
 if(q.t==='e'){QS.min=q.min;QS.max=q.max;QS.val=snap(q,(q.min+q.max)/2);}
 if(q.t==='o'){QS.chips=shuffle(q.items.map((it,i)=>({l:it[0],tag:it[1],i})));QS.order=[];QS.locked=0;}
 if(EN.kind==='lightning'){QS.total=EN.total;QS.deadline=EN.deadline;}
 else{QS.total=timerFor(q)*1000;QS.deadline=performance.now()+QS.total;}
 renderQ();renderProg();
 if(has('rosetta')&&EN.kind==='book'&&q.t==='m'&&!EN.rosettaUsed){EN.rosettaUsed=true;strikeTwo();}
 renderTray();
 $('#card').classList.remove('flash-ok','flash-bad');
 timerOn=true;lastTick=-1;
}
function snap(q,v){const s=q.step;return +(Math.round(v/s)*s).toFixed(s<1?1:0);}
function fmtVal(q,v){if(q.step<1)return v.toFixed(1);if(/year/i.test(q.q))return String(v);return v.toLocaleString('en-US');}
function answerText(q){if(q.t==='m')return q.a[0];if(q.t==='tf')return q.v?'True':'False';if(q.t==='e')return fmtVal(q,q.n)+(q.u?' '+q.u:'');return q.items.map(i=>i[0]).join(' → ');}
function renderQ(){
 const q=QS.q,c=CATS[q.c];
 let body='';
 if(q.t==='m')body=`<div class="opts" id="opts">${QS.opts.map((o,i)=>`<button class="opt ${o.gone?'gone':''}" data-act="opt" data-i="${i}"><span class="k">${i+1}</span>${esc(o.t)}</button>`).join('')}</div>`;
 else if(q.t==='tf'){const lr=EN.kind==='lightning';body=`<div class="tf"><button class="tfb f" data-act="tf" data-v="0"><kbd>←</kbd> False</button><button class="tfb t" data-act="tf" data-v="1">True <kbd>→</kbd></button></div>${lr?`<div class="lr-count">${EN.right} right so far · ${EN.queue.length-EN.i} statements left in the stack</div>`:''}`;}
 else if(q.t==='e')body=estBody();
 else if(q.t==='o')body=slotsHTML()+chipsHTML();
 $('#qArea').innerHTML=`<div class="c-top"><span class="ribbon" style="--c:${c.color}">${ic(c.ic)}${esc(c.short)} · ${esc(topicName(q))}</span><span class="kind">${KIND_LABEL[q.t]} · ${'★'.repeat(q.d)}</span><span class="clock" id="clock"></span></div>
  <p class="q">${esc(q.q)}</p>${body}<div id="reveal"></div>`;
}
function estBody(){const q=QS.q;return `<div class="est"><div class="est-read"><b id="estV">${fmtVal(q,QS.val)}</b><span>${esc(q.u||'')}</span></div>
 <input type="range" id="estR" min="${QS.min}" max="${QS.max}" step="${q.step}" value="${QS.val}" aria-label="Your estimate">
 <div class="est-scale"><span>${fmtVal(q,QS.min)}</span><span>${fmtVal(q,QS.max)}</span></div>
 <div class="est-btns"><button class="nudge" data-act="nudge" data-d="-1" aria-label="Decrease">−</button><button class="btn gold" data-act="lock">Lock in ↵</button><button class="nudge" data-act="nudge" data-d="1" aria-label="Increase">+</button></div></div>`;}
function slotsHTML(){
 const slots=[0,1,2,3].map(i=>{const it=QS.order[i]!=null?QS.chips.find(c=>c.i===QS.order[i]):null;return `<div class="slot ${it?'fill':''} ${i<QS.locked?'lock':''}" data-act="slot" data-s="${i}"><span class="n">${['1st','2nd','3rd','4th'][i]}</span>${it?esc(it.l):''}</div>`;}).join('');
 return `<div class="slots" id="slots">${slots}</div>`;
}
function chipsHTML(){return `<div class="chips" id="chips">${QS.chips.map((c,i)=>`<button class="chip ${QS.order.includes(c.i)?'used':''}" data-act="chip" data-i="${i}"><span class="k">${i+1}</span>${esc(c.l)}</button>`).join('')}</div>`;}
function refreshOrder(){$('#slots').outerHTML=slotsHTML();$('#chips').outerHTML=chipsHTML();if(QS.order.length===4&&!QS.done)setTimeout(()=>{if(QS&&!QS.done&&QS.q.t==='o'&&QS.order.length===4)judgeOrder();},280);}
function renderTray(){
 const t=$('#tray');if(!t)return;
 let h='';
 for(let i=0;i<R.slots;i++){
  const id=R.quills[i];
  if(!id){h+=`<div class="quill empty"><span class="qi"></span>Empty slot</div>`;continue;}
  const Q=QUILLS[id],ok=quillUsable(id);
  h+=`<button class="quill" data-act="quill" data-i="${i}" ${ok?'':'disabled'} title="${esc(Q.desc)}"><span class="qi">${ic(Q.ic)}</span>${esc(Q.name)}<kbd>${(QKEYS[i]||'').toUpperCase()}</kbd></button>`;
 }
 if(QS&&QS.ward)h+=`<span class="ward-on">Blotting paper ready</span>`;
 if(QS&&QS.double)h+=`<span class="ward-on">Double ink!</span>`;
 t.innerHTML=h;
}
function quillUsable(id){
 if(!QS||QS.done||QS.picking)return false;const q=QS.q;
 if(id==='strike'){if(q.t==='tf')return false;if(q.t==='m')return QS.opts.filter(o=>!o.ok&&!o.gone).length>1;if(q.t==='e')return !QS.narrowed;if(q.t==='o')return QS.locked<3;}
 if(id==='ward')return !QS.ward&&q.t!=='tf';
 if(id==='double')return !QS.double&&EN.kind!=='lightning';
 if(id==='stub')return R.wax<R.maxWax;
 if(id==='dogear'||id==='rewrite'||id==='fresh')return EN.kind!=='curio'&&EN.kind!=='lightning';
 return true;
}
function strikeTwo(){const wrong=shuffle(QS.opts.filter(o=>!o.ok&&!o.gone)).slice(0,2);wrong.forEach(o=>o.gone=true);$$('.opt').forEach((b,k)=>{if(QS.opts[k].gone)b.classList.add('gone');});}
function useQuill(i){
 const id=R.quills[i];if(!id||!quillUsable(id))return;
 const q=QS.q;sfx.coin();
 R.quills.splice(i,1);
 if(id==='strike'){
  if(q.t==='m')strikeTwo();
  if(q.t==='e'){const span=8*q.tol,a=rnd(2,6)*q.tol;QS.min=Math.max(q.min,snap(q,q.n-a));QS.max=Math.min(q.max,snap(q,QS.min+span));if(QS.max<=q.n)QS.max=Math.min(q.max,snap(q,q.n+q.tol*2));QS.val=clamp(QS.val,QS.min,QS.max);QS.narrowed=true;$('#qArea .est').outerHTML=estBody();}
  if(q.t==='o'){const target=QS.chips.find(c=>c.i===QS.locked);QS.order=QS.order.filter(x=>x!==target.i);QS.order.splice(QS.locked,0,target.i);QS.locked++;refreshOrder();}
  toast('Struck through!');
 }
 if(id==='hourglass'){QS.deadline+=10000;QS.total+=10000;if(EN.kind==='lightning'){EN.deadline+=10000;EN.total+=10000;}toast('+10 seconds');}
 if(id==='ward'){QS.ward=true;toast('Blotting paper ready');}
 if(id==='double'){QS.double=true;toast('Double ink! Triple reward, double risk.');}
 if(id==='stub'){heal(2);updateHUD();toast('+2 wax');}
 if(id==='dogear'){renderTray();return skipQ();}
 if(id==='fresh'){const nq=drawOne(q.c,EN.kind==='book'?EN.stars:q.d,EN.queue,EN.kind==='book'?EN.topic:null);return replaceQ(nq,'Fresh page!');}
 if(id==='rewrite'){return showRewrite();}
 renderTray();
}
function replaceQ(nq,msg){if(!nq)return;EN.queue[EN.i]=nq;timerOn=false;toast(msg);loadQ(nq);}
function showRewrite(){
 QS.picking=true;timerOn=false;QS.pausedRem=QS.deadline-performance.now();renderTray();
 $('#reveal').innerHTML=`<div class="picker"><p>Rewrite this question into which wing? The fuse is paused.</p><div class="tabs">${CAT_KEYS.map(k=>`<button class="tab" style="--c:${CATS[k].color}" data-act="rewriteTo" data-k="${k}">${ic(CATS[k].ic)}${esc(CATS[k].short)}</button>`).join('')}</div></div>`;
 $('#opts')&&$('#opts').classList.add('locked');
}
function rewriteTo(k){
 if(!QS||!QS.picking)return;
 const d=EN.kind==='book'?EN.stars:QS.q.d;
 const nq=drawOne(k,d,EN.queue);
 replaceQ(nq,`Rewritten into ${CATS[k].short}!`);
}

/* timer loop */
let timerOn=false,lastTick=-1;
function tloop(now){
 if(timerOn&&QS&&!QS.done&&S.screen==='enc'){
  const rem=QS.deadline-now,f=clamp(rem/QS.total,0,1);
  const fu=$('#fuse');if(fu){fu.style.width=(f*100)+'%';$('#fuseBox').classList.toggle('low',rem<3000);}
  const cl=$('#clock');if(cl){cl.textContent=Math.max(0,rem/1000).toFixed(1)+'s';cl.classList.toggle('low',rem<3000);}
  const s=Math.ceil(rem/1000);if(rem<3000&&rem>0&&s!==lastTick){lastTick=s;sfx.tick();}
  if(rem<=0)onTimeout();
 }
 requestAnimationFrame(tloop);
}
function onTimeout(){
 if(!QS||QS.done)return;
 if(EN.kind==='lightning'){QS.done=true;timerOn=false;return finishEncounter();}
 say(pick(SAY.slow));
 resolve(false,0,{timeout:true});
}

/* answering */
function chooseOpt(i){
 if(!QS||QS.done||QS.picking||QS.q.t!=='m')return;const o=QS.opts[i];if(!o||o.gone)return;
 const btn=$$('.opt')[i];
 if(o.ok){btn.classList.add('ok');resolve(true,1,{btn});}
 else if(QS.ward){QS.ward=false;o.gone=true;btn.classList.add('bad');setTimeout(()=>btn.classList.add('gone'),350);toast('Blotted! Try again.');sfx.bad();renderTray();}
 else{btn.classList.add('bad');resolve(false,0,{btn});}
}
function tfAns(v){if(!QS||QS.done||QS.q.t!=='tf')return;resolve(QS.q.v===v,1,{btn:$(v?'.tfb.t':'.tfb.f')});}
function lockEst(){
 if(!QS||QS.done||QS.q.t!=='e')return;const q=QS.q;
 const tol=q.tol*(has('astrolabe')?1.5:1),d=Math.abs(QS.val-q.n);
 if(d<=tol)resolve(true,1,{grade:'Bullseye!',btn:$('#estV')});
 else if(d<=tol*3)resolve(true,.6,{grade:'Close enough!',btn:$('#estV')});
 else resolve(false,0,{btn:$('#estV')});
}
function nudge(d,big){if(!QS||QS.done||QS.q.t!=='e')return;const q=QS.q;const span=QS.max-QS.min;let st=q.step;if(span/q.step>400)st=q.step*Math.round(span/q.step/200);if(big)st*=10;setEst(QS.val+d*st);}
function setEst(v){const q=QS.q;QS.val=clamp(snap(q,v),QS.min,QS.max);const r=$('#estR');if(r)r.value=QS.val;const b=$('#estV');if(b)b.textContent=fmtVal(q,QS.val);}
function chipPick(i){if(!QS||QS.done||QS.q.t!=='o')return;const c=QS.chips[i];if(!c||QS.order.includes(c.i))return;sfx.click();QS.order.push(c.i);refreshOrder();}
function slotClear(s){if(!QS||QS.done||QS.q.t!=='o')return;if(s<QS.locked||QS.order[s]==null)return;QS.order.splice(s,1);refreshOrder();}
function judgeOrder(){resolve(QS.order.every((x,i)=>x===i),1,{btn:$('#slots')});}
function skipQ(){
 if(!QS||QS.done)return;QS.done=true;timerOn=false;
 EN.results[EN.i]=2;toast('Dog-eared. Skipped.');
 setTimeout(()=>{EN.i++;nextQ();},500);
}
function resolve(ok,quality,info={}){
 if(!QS||QS.done)return;
 const q=QS.q,now=performance.now();
 if(!ok&&QS.ward&&!info.timeout){QS.ward=false;info.warded=true;}
 QS.done=true;timerOn=false;
 let frac=clamp((QS.deadline-now)/QS.total,0,1);
 if(EN.kind==='lightning')frac=clamp(1-(now-QS.shown)/3500,0,1);
 let pts=0,dmg=0;
 if(ok){
  R.streak++;R.best=Math.max(R.best,R.streak);
  const base=EN.kind==='book'?[0,80,110,150][EN.stars]:{boss:150,lightning:60,curio:150}[EN.kind];
  const spd=Math.round(base*frac*(has('monocle')?2:1));
  const il=R.streak>=illumAt();
  pts=Math.round((base+spd)*quality*mult()*(il?2:1)*(has('inkpot')?1.25:1)*(QS.double?3:1));
  R.score+=pts;R.correct++;R.answered++;EN.right++;
  R.pages+=1+(has('abacus')?1:0);
  sfx.ok(R.streak);
  if(info.btn)burst(info.btn,pts);
  folioMood('h','hop');if(EN.kind!=='lightning'||Math.random()<.3)say(info.grade||pick(SAY.ok));
  if(EN.kind==='boss'){const hit=R.streak>=illumAt()?2:1;EN.seals=Math.max(0,EN.seals-hit);renderSeals();const b=$('#blot');if(b){b.classList.remove('hit');void b.offsetWidth;b.classList.add('hit');}sfx.hit();if(!EN.rage&&EN.seals<=Math.floor(EN.maxSeals/2)){EN.rage=true;setTimeout(()=>{toast(`${EN.boss.name} is enraged! Fuses shorten.`,'bad');const b2=$('#blot');if(b2)b2.classList.add('rage');},600);}}
 }else if(info.warded){
  R.answered++;toast('Blotting paper saved you.');sfx.bad();folioMood('s','wince');
 }else{
  R.answered++;EN.wrong++;
  dmg=EN.kind==='book'?dmgFor(EN.stars):{boss:2,lightning:1,curio:3}[EN.kind];
  if(info.timeout)dmg=Math.max(1,dmg-1);
  if(info.timeout&&has('cat')&&!EN.catUsed){EN.catUsed=true;dmg=0;setTimeout(()=>toast('The Library Cat caught the fuse. No wax lost.'),300);}
  if(dmg>0&&has('jacket'))dmg=Math.max(1,dmg-1);
  if(QS.double)dmg*=2;
  R.wax=Math.max(0,R.wax-dmg);
  if(R.wax<=0&&has('owl')&&!R.owlUsed){R.owlUsed=true;R.wax=1;setTimeout(()=>toast('The Owl of Minerva keeps your flame alive!'),500);}
  if(has('segment')&&!EN.choped&&R.streak>0){EN.choped=true;toast('Spare segment! Streak kept.');}else R.streak=0;
  R.missed.push(q.id);
  sfx.bad();const card=$('#card');card.classList.remove('shake');void card.offsetWidth;card.classList.add('shake');
  folioMood('s','wince');if(!info.timeout)say(pick(SAY.bad));
  if(dmg)floatText(`−${dmg} wax`,$('#hWax'),true);
 }
 record(q,ok);
 EN.results[EN.i]=ok?1:0;EN.n++;
 updateMeter();updateHUD();renderProg();renderTray();
 if(EN.kind==='lightning'){
  $('#card').classList.add(ok?'flash-ok':'flash-bad');
  if(R.wax<=0)return setTimeout(()=>endRun(false),600);
  setTimeout(()=>{EN.i++;nextQ();},ok?260:520);
  return;
 }
 showReveal(ok,pts,info,dmg);
}
function showReveal(ok,pts,info,dmg){
 const q=QS.q;
 $('#opts')&&$('#opts').classList.add('locked');
 if(q.t==='m')$$('.opt').forEach((b,i)=>{if(QS.opts[i].ok)b.classList.add('ok');else if(!b.classList.contains('bad'))b.classList.add('dim');});
 if(q.t==='tf'){const b=$(q.v?'.tfb.t':'.tfb.f');if(b)b.style.outline='3px solid #F6DA8E';}
 if(q.t==='o'){$$('.slot').forEach((s,i)=>{s.classList.remove('fill');s.classList.add(QS.order[i]===i?'ok':'bad');s.innerHTML=`<span class="n">${['1st','2nd','3rd','4th'][i]}</span>${esc(q.items[i][0])}<span class="tag">${esc(q.items[i][1])}</span>`;});$('#chips').remove();}
 if(q.t==='e'){
  const lo=q.min,hi=q.max,P=v=>clamp((v-lo)/(hi-lo)*100,0,100),tol=q.tol*(has('astrolabe')?1.5:1);
  $('.est').innerHTML=`<div class="nl"><div class="nl-bar"></div><i class="band" style="left:${P(q.n-tol*3)}%;width:${P(q.n+tol*3)-P(q.n-tol*3)}%"></i><b class="mk ans" style="left:${P(q.n)}%">${esc(fmtVal(q,q.n))}</b><b class="mk you" style="left:${P(QS.val)}%">You: ${esc(fmtVal(q,QS.val))}</b></div>`;
 }
 const verdict=ok?(info.grade||'Correct'):(info.timeout?'Time’s up':info.warded?'Saved by the blotter':'Not quite');
 const last=(EN.kind==='boss'&&EN.seals<=0)||R.wax<=0||(EN.kind!=='boss'&&EN.i>=EN.queue.length-1);
 $('#reveal').innerHTML=`<div class="reveal" id="rvBox">
  <div class="verdict ${ok?'ok':'bad'}">${esc(verdict)}${ok?`<span class="pts">+${fmt(pts)} ink</span>`:dmg?`<span class="pts">−${dmg} wax</span>`:''}</div>
  ${!ok&&q.t!=='o'?`<div class="rv-ans">Answer: ${esc(answerText(q))}</div>`:''}
  ${q.x?`<p class="rv-x">${esc(q.x)}</p>`:''}
  <div class="rv-foot"><button class="linkbtn primary" data-act="cont" id="contBtn">${last?'Continue':'Next'} ↵</button></div></div>`;
 const cb=$('#contBtn');if(cb)cb.focus({preventScroll:true});
}
function advance(){
 if(!EN||S.screen!=='enc'||!QS||!QS.done)return;
 if(R.wax<=0)return endRun(false);
 if(EN.kind==='boss'&&EN.seals<=0)return bossDefeated();
 EN.i++;nextQ();
}
function folioMood(m,anim){const f=$('.side-folio .folio');if(!f)return;f.dataset.mood=m;if(anim){f.classList.remove('hop','wince');void f.getBoundingClientRect();f.classList.add(anim);}clearTimeout(folioMood.t);folioMood.t=setTimeout(()=>{const g=$('.side-folio .folio');if(g){g.dataset.mood='n';g.classList.remove('hop','wince');}},1400);}
function say(text){const b=$('#bubble');if(!b)return;b.textContent=text;b.classList.add('show');clearTimeout(say.t);say.t=setTimeout(()=>b.classList.remove('show'),1300);}

/* ---------- finishing ---------- */
function finishEncounter(){
 timerOn=false;
 const k=EN.kind;
 if(k==='curio'){
  const won=EN.right>0;let msg;
  if(won){const r=gainRelic(unownedRelics(1)[0]);msg=r?`The scholar bows and hands you ${r.name}: ${r.desc}`:'The scholar bows. You own every bookmark already, so he pays you 20 pages.';if(!r)R.pages+=20;}
  else msg='The scholar tuts and takes 3 wax for his lamp.';
  EN=null;QS=null;
  if(R.wax<=0)return endRun(false);
  return showOutcome({emblem:'word',color:'#55613A',title:'The Wandering Scholar',text:msg});
 }
 const en=EN;EN=null;QS=null;
 if(has('vellum'))heal(1);
 const it=en.item,sh=R.shelves[R.cur.s];
 it.done=true;it.res=k==='lightning'?`${en.right} right`:`${en.right}/${en.n}`;it.wrong=en.wrong;
 let pages;
 if(k==='lightning'){pages=8;}
 else{R.books++;const perfect=en.wrong===0&&en.n>0;pages=[0,5,8,12][en.stars];if(has('weights'))pages*=1.5;if(perfect)pages*=1.5;pages=Math.round(pages);if(perfect&&has('lodestar'))heal(2);addStamp(en.cat);}
 R.pages+=pages;
 const perfectBook=en.wrong===0&&en.n>0;
 S.caseToast=`${k==='lightning'?'Lightning Pamphlet':TOPICS[en.cat][en.topic]}: ${en.right} of ${en.n} right · +${R.pages-en.pages0} pages${perfectBook&&k!=='lightning'?' · Perfect!':''}`;
 // queue what happens next
 if(k==='lightning'){const fixes=en.queue.slice(0,en.n).filter((q,i)=>en.results[i]===0);if(fixes.length)R.pending.push(()=>showCorrections(fixes));}
 if(it.hidden==='chest')R.pending.push(()=>openChest(false,'A hidden chest!','Tucked behind the book, a small chest was waiting.'));
 if(it.hidden==='curio')R.pending.push(showCurio);
 // a shelf's non-boss books gate the bookend chest / Bindery / Reading Room;
 // a disguised boss book never counts toward this, so its shelf still finishes
 // once every real book on it has been read, even before the boss is fought.
 const nonBoss=sh.items.filter(x=>!x.bossDisguise);
 if(!sh.bonusDone&&nonBoss.every(x=>x.done)){
  sh.bonusDone=true;const s=R.cur.s;
  if(s<SHELVES-1)sh.done=true;
  const perfectShelf=nonBoss.every(x=>!x.wrong);
  R.pending.push(()=>openChest(perfectShelf,perfectShelf?'A gilded bookend chest!':'The bookend chest',perfectShelf?`Shelf ${RN[s]} read without a single mistake.`:`Shelf ${RN[s]} is read. The bookend swings open.`));
  if(s===1)R.pending.push(showShop);
  if(s===2)R.pending.push(showRest);
  R.shelf=Math.min(s+1,SHELVES-1);
 }
 proceed();
}
function showCorrections(fixes){
 setScreen('reward',`<div class="panel"><div class="panel-head"><span class="emblem" style="--c:#2E5597">${ic('bolt')}</span><h2>Lightning corrections</h2><p>The statements you missed, set right.</p></div>
 <div class="sheet parch"><div class="facts">${fixes.map(factHTML).join('')}</div></div><div class="panel-foot"><button class="btn gold" data-act="proceed">Continue</button></div></div>`);
}
function bossDefeated(){
 timerOn=false;const b=EN.boss;EN=null;QS=null;
 document.body.classList.remove('illum');
 if(R.act>=2)return endRun(true);
 heal(4);
 const rs=unownedRelics(3);
 showChoice({emblem:'boss',color:'#241733',title:`${b.name} defeated`,sum:`Act ${RN[R.act]} cleared · +4 wax`,text:`The way opens to ${ACTS[R.act+1].name}. Take a bookmark for the road.`,
  choices:rs.length?rs.map(relicChoice):[quillChoice(randQuill())],after:()=>startAct(R.act+1)});
}
function showChoice({emblem,color,title,text,sum,choices,after,extra}){
 document.body.classList.remove('illum');
 S.choices=choices;S.after=after;
 setScreen('reward',`<div class="panel"><div class="panel-head"><span class="emblem" style="--c:${color}">${ic(emblem)}</span><h2>${esc(title)}</h2>${sum?`<div class="sum">${esc(sum)}</div>`:''}<p>${esc(text)}</p></div>
 <div class="choices">${choices.map((c,i)=>`<button class="choice parch" data-act="choose" data-i="${i}">${cicHTML(c.ic,c.key,`${c.q?'q':''} ${c.w?'w':''}`)}<span class="kind">${esc(c.kind)}</span><h4>${esc(c.name)}</h4><p>${esc(c.desc)}</p></button>`).join('')}</div>${extra||''}</div>`);
}
function showOutcome({emblem,color,title,text}){
 setScreen('reward',`<div class="panel"><div class="panel-head"><span class="emblem" style="--c:${color}">${ic(emblem)}</span><h2>${esc(title)}</h2></div><div class="outcome">${esc(text)}</div><div class="panel-foot"><button class="btn gold" data-act="proceed">Continue</button></div></div>`);
}
/* ---------- chests ---------- */
function rollLoot(gilded){
 let n=ri(2,4)+(has('silverfish')?1:0);const out=[];
 if(gilded){const r=unownedRelics(1)[0];if(r)out.push({t:'relic',id:r});}
 while(out.length<n){
  const t=wpick(['pages','quill','wax','relic'],k=>({pages:30,quill:38,wax:20,relic:gilded?4:12})[k]);
  if(t==='relic'){const r=unownedRelics(4).find(x=>!out.some(o=>o.id===x));if(r){out.push({t,id:r});continue;}}
  if(t==='pages')out.push({t,v:ri(8,18)});
  else if(t==='wax')out.push({t,v:ri(2,3)});
  else out.push({t:'quill',id:randQuill()});
 }
 return out;
}
function openChest(gilded,title,text){
 const loot=rollLoot(gilded);
 const cards=loot.map((l,i)=>{
  let icn,name,desc,kind,cls='',key=null;
  if(l.t==='relic'){const r=gainRelic(l.id);icn=r.ic;name=r.name;desc=r.desc;kind='Bookmark';key=l.id;}
  else if(l.t==='quill'){const Q=QUILLS[l.id];const got=gainQuill(l.id);icn=Q.ic;name=Q.name;desc=got?Q.desc:'Slots full, sold for 6 pages.';if(!got)R.pages+=6;kind='Quill';cls='q';key=l.id;}
  else if(l.t==='pages'){R.pages+=l.v;icn='page';name=`${l.v} pages`;desc='For the Bindery.';kind='Pages';}
  else{heal(l.v);icn='heart';name=`+${l.v} wax`;desc='Your candle burns brighter.';kind='Wax';cls='w';}
  return `<div class="choice parch" style="animation-delay:${.5+i*.22}s">${cicHTML(icn,key,cls)}<span class="kind">${kind}</span><h4>${esc(name)}</h4><p>${esc(desc)}</p></div>`;
 }).join('');
 sfx.chest();
 setScreen('reward',`<div class="panel"><div class="panel-head" style="position:relative">${chestSVG('chestart open')}<h2>${esc(title||(gilded?'A gilded chest!':'A reward chest!'))}</h2><p>${esc(text||'')} ${loot.length} items tumble out.</p></div>
 <div class="loot">${cards}</div><div class="panel-foot"><button class="btn gold" data-act="proceed">Take everything</button></div></div>`);
}

/* ---------- bindery, rest, curios ---------- */
function price(p){return Math.round(p*(has('card')?.75:1));}
function showShop(){
 const qs=[randQuill(),randQuill(),randQuill()];
 const rs=unownedRelics(2);
 S.shop=[...qs.map(id=>({t:'q',id,p:price(12)})),...rs.map(id=>({t:'r',id,p:price(ri(34,44))})),{t:'w',p:price(12)}];
 renderShop();
}
function renderShop(){
 const items=S.shop.map((it,i)=>{
  let icn,name,desc,kind,cls='',key=null;
  if(it.t==='q'){const Q=QUILLS[it.id];icn=Q.ic;name=Q.name;desc=Q.desc;kind='Quill';cls='q';key=it.id;}
  else if(it.t==='r'){const r=RELICS[it.id];icn=r.ic;name=r.name;desc=r.desc;kind='Bookmark';key=it.id;}
  else{icn='heart';name='Candle wax';desc='Restore 3 wax.';kind='Wax';cls='w';}
  const cant=it.sold||R.pages<it.p||(it.t==='q'&&R.quills.length>=R.slots)||(it.t==='w'&&R.wax>=R.maxWax);
  return `<button class="choice parch ${it.sold?'sold':''}" data-act="buy" data-i="${i}" ${cant?'disabled':''}><span class="price">${ic('page')}${it.p}</span>${cicHTML(icn,key,cls)}<span class="kind">${kind}</span><h4>${esc(name)}</h4><p>${esc(desc)}</p></button>`;
 }).join('');
 setScreen('shop',`<div class="panel"><div class="panel-head"><span class="emblem" style="--c:#9A6B22">${ic('bindery')}</span><h2>The Bindery</h2><p>An old bookbinder trims quills and stitches bookmarks by lamplight. You have <b>${R.pages}</b> pages.</p></div>
 <div class="choices">${items}</div><div class="panel-foot"><button class="btn" data-act="proceed">Leave the Bindery</button></div></div>`);
}
function buy(i){
 const it=S.shop[i];if(!it||it.sold||R.pages<it.p)return;
 if(it.t==='q'&&!gainQuill(it.id))return;
 if(it.t==='r')gainRelic(it.id);
 if(it.t==='w'){if(R.wax>=R.maxWax)return;heal(3);}
 R.pages-=it.p;it.sold=true;sfx.coin();renderShop();
}
function showRest(){
 const h=6+(has('bell')?3:0);
 showChoice({emblem:'rest',color:'#3F6B61',title:'The Reading Room',text:'Green lamps, leather armchairs, and silence. Take a moment before you pull the boss tome.',
  choices:[
   {kind:'Rest',w:true,ic:'heart',name:'Doze by the lamp',desc:`Heal ${h} wax (you have ${R.wax}/${R.maxWax}).`,run(){heal(h);}},
   {kind:'Study',q:true,ic:'page',name:'Browse the stacks',desc:'Gain 2 random quills (as many as fit).',run(){gainQuill(randQuill());gainQuill(randQuill());}}
  ],after:proceed});
}
const CURIOS=[
 {title:'The Darjeeling Tea Merchant',ic:'cup',text:'A merchant pours you a cup from a brass pot. “A little of your candle, and I’ll trade you a treasure from the high roads.”',opts:[
  {label:'Trade 3 wax for a bookmark',can:()=>R.wax>3&&unownedRelics(1).length>0,run:()=>{R.wax-=3;const r=gainRelic(unownedRelics(1)[0]);return `You gain ${r.name}: ${r.desc}`;}},
  {label:'Buy a pot of tea',sub:'8 pages · heal 3 wax',can:()=>R.pages>=8,run:()=>{R.pages-=8;heal(3);return 'Warm and bracing. +3 wax.';}},
  {label:'Politely decline',run:()=>'He bows and pours himself another cup.'}]},
 {title:'A Star Chart from Samarkand',ic:'sci',text:'Folded inside an atlas is a star chart copied from Ulugh Beg’s observatory, its constellations inked in gold.',opts:[
  {label:'Sell it to the Bindery',sub:'+20 pages',run:()=>{R.pages+=20;return '+20 pages.';}},
  {label:'Study it by lamplight',sub:'Heal 3 wax',run:()=>{heal(3);return 'You trace the old constellations and feel steadier. +3 wax.';}}]},
 {title:'The Bookworm Elder',ic:'worm',text:'An ancient bookworm, grey at every segment, peers at you over a pair of tiny spectacles. “Ah, a young reader. Sit a while.”',opts:[
  {label:'Learn the elder’s trick',sub:'+1 quill slot',run:()=>{R.slots+=1;return 'You learn to tuck a quill under a spare segment. +1 quill slot.';}},
  {label:'Share a snack of old vellum',sub:'Heal 3 wax',run:()=>{heal(3);return 'Chewy, dusty, delicious. +3 wax.';}}]},
 {title:'The Wandering Scholar',ic:'word',text:'A scholar from Timbuktu blocks the stair. “One hard question. Answer it and I’ll give you a bookmark. Miss it and you pay in wax.”',opts:[
  {label:'Accept the wager',sub:'Win a bookmark or lose 3 wax',run:'wager'},
  {label:'Step around him',run:()=>'He shrugs and returns to his manuscript.'}]},
 {title:'Moths in the Stacks',ic:'curio',text:'A cloud of moths is chewing through the margins, and it is heading your way.',opts:[
  {label:'Feed them a quill',can:()=>R.quills.length>0,run:()=>{R.quills.pop();return 'They flutter off, satisfied.';}},
  {label:'Pay the pest-catcher',sub:'10 pages',can:()=>R.pages>=10,run:()=>{R.pages-=10;return 'Swiftly handled.';}},
  {label:'Swat them away',sub:'Lose 2 wax',run:()=>{R.wax=Math.max(1,R.wax-2);return 'You drive them off, singed and dusty. −2 wax.';}}]},
 {title:'Postcard from Kyoto',ic:'dogear',text:'A postcard slips out of a travel diary. A red maple leaf is pressed flat under the stamp.',opts:[
  {label:'Keep it',sub:'Gain two random quills',run:()=>{const a=randQuill(),b=randQuill();const g1=gainQuill(a),g2=gainQuill(b);return g1||g2?`Tucked behind the stamp: ${[g1&&QUILLS[a].name,g2&&QUILLS[b].name].filter(Boolean).join(' and ')}.`:'Your quill slots are full, so you sell them for 12 pages.'+(R.pages+=12,'');}}]},
 {title:'The Wishing Fountain',ic:'sea',text:'In a sunlit courtyard, a marble fountain carved with sea serpents splashes into a stone basin. Coins from a hundred countries glint at the bottom.',opts:[
  {label:'Drink from the basin',sub:'Heal 4 wax',run:()=>{heal(4);return 'Cool and clear. +4 wax.';}},
  {label:'Toss in 5 pages for luck',sub:'Open a small chest',can:()=>R.pages>=5,run:'fountain'}]}
];
function showCurio(){
 const ev=pick(CURIOS);S.curio=ev;
 setScreen('curio',`<div class="panel"><div class="panel-head"><span class="emblem" style="--c:#55613A">${ic(ev.ic)}</span><h2>${esc(ev.title)}</h2><p>${esc(ev.text)}</p></div>
 <div class="choices">${ev.opts.map((o,i)=>{const can=!o.can||o.can();return `<button class="choice parch" data-act="curio" data-i="${i}" ${can?'':'disabled'}><h4>${esc(o.label)}</h4>${o.sub?`<p>${esc(o.sub)}</p>`:''}</button>`;}).join('')}</div></div>`);
}
function curioPick(i){
 const o=S.curio.opts[i];if(!o||(o.can&&!o.can()))return;sfx.click();
 if(o.run==='wager'){const q=drawOne(pick(CAT_KEYS),3,[]);return startEncounter('curio',null,q);}
 if(o.run==='fountain'){R.pages-=5;return openChest(false,'The fountain’s gift','A small chest bobs up from the basin.');}
 const msg=o.run();updateHUD();
 showOutcome({emblem:S.curio.ic,color:'#55613A',title:S.curio.title,text:msg});
}

/* ---------- end of run ---------- */
function endRun(won){
 timerOn=false;EN=null;QS=null;
 document.body.classList.remove('illum');
 let bonus=0;if(won){bonus=R.wax*50+R.stamps.length*150;R.score+=bonus;}
 SAVE.runs++;if(won)SAVE.wins++;const newBest=R.score>SAVE.best;SAVE.best=Math.max(SAVE.best,R.score);persist();
 const acc=R.answered?Math.round(R.correct/R.answered*100):0;
 const missed=[...new Set(R.missed)].slice(-10).map(id=>BANK.find(q=>q.id===id)).filter(Boolean);
 const where=`${ACTS[R.act].n}, ${R.shelf>=SHELVES?'at the boss':'shelf '+RN[R.shelf]}`;
 setScreen('end',`<div class="panel">
  <div class="panel-head"><span class="emblem" style="--c:${won?'#9A6B22':'#241733'}">${ic(won?'sci':'boss')}</span>
  <h2>${won?'The Oculus blazes again':'Your candle gutters out'}</h2>
  <p>${won?'The Blot dissolves into ordinary ink. Light pours down through the dome, and the margins fill with writing.':`It happened in ${esc(ACTS[R.act].name)} (${esc(where)}). The library will wait for your next attempt.`}</p></div>
  <div class="sheet parch">
   <div class="stats">
    <div class="stat"><b>${fmt(R.score)}</b><small>${newBest?'New best ink':'Ink'}</small></div>
    <div class="stat"><b>${acc}%</b><small>Accuracy</small></div>
    <div class="stat"><b>${R.best}</b><small>Best streak</small></div>
    <div class="stat"><b>${R.books}</b><small>Books read</small></div>
    <div class="stat"><b>${R.stamps.length}/7</b><small>Stamps</small></div>
   </div>
   ${won?`<p class="muted" style="margin:12px 0 0">Victory bonus: +${fmt(bonus)} ink for remaining wax and passport stamps.</p>`:''}
   <h3>Margins to revisit</h3>${missed.length?`<div class="facts">${missed.map(factHTML).join('')}</div>`:`<p class="muted">Nothing. You answered everything you saw correctly.</p>`}
  </div>
  <div class="panel-foot"><button class="btn gold" data-act="newrun">Climb again</button><button class="btn" data-act="codex">Codex</button><button class="btn" data-act="title">Title</button></div></div>`);
 R=null;
}
function factHTML(q){const c=CATS[q.c];const r=SAVE.codex[q.id];return `<div class="fact" style="--c:${c.color}"><div class="fm">${ic(c.ic)}${esc(c.short)}: ${esc(topicName(q))} · ${'★'.repeat(q.d)}${r?` · ${r.r}/${r.s} correct`:''}</div><div class="fq">${esc(q.q)}</div><div class="fa">${esc(answerText(q))}</div>${q.x?`<div class="fx">${esc(q.x)}</div>`:''}</div>`;}

/* ---------- codex ---------- */
function showCodex(tab){
 tab=tab||S.codexTab||'sg';S.codexTab=tab;
 const tabs=CAT_KEYS.map(k=>{const all=BANK.filter(q=>q.c===k),seen=all.filter(q=>SAVE.codex[q.id]).length;return `<button class="tab" role="tab" aria-selected="${k===tab}" style="--c:${CATS[k].color}" data-act="codexTab" data-k="${k}">${ic(CATS[k].ic)}${esc(CATS[k].short)} ${seen}/${all.length}</button>`;}).join('');
 const all=BANK.filter(q=>q.c===tab),seen=all.filter(q=>SAVE.codex[q.id]).sort((a,b)=>a.d-b.d);
 const mastered=seen.filter(q=>SAVE.codex[q.id].l===1).length;
 setScreen('codex',`<div class="panel" style="margin-block:0">
  <div class="panel-head"><span class="emblem" style="--c:${CATS[tab].color}">${ic(CATS[tab].ic)}</span><h2>The Codex</h2><p>Every fact you meet is written back into the library. Questions you missed come back more often in future runs.</p></div>
  <div class="sheet parch">
   <div class="tabs" role="tablist">${tabs}</div>
   <h3>${esc(CATS[tab].name)} · ${esc(CATS[tab].place)}</h3>
   <div class="bar" style="--c:${CATS[tab].color}"><i style="width:${all.length?seen.length/all.length*100:0}%"></i></div>
   <p class="muted">${seen.length} of ${all.length} restored · ${mastered} answered correctly last time · ${all.length-seen.length} pages still blank.</p>
   <div class="facts">${seen.length?seen.map(factHTML).join(''):'<p class="muted">No facts restored in this wing yet. Read one of its books to begin.</p>'}</div>
  </div>
  <div class="panel-foot"><button class="btn" data-act="${R?'toCase':'title'}">${R?'Back to the bookcase':'Back to title'}</button></div></div>`);
}

/* ================= effects ================= */
function toast(t,kind){const el=$('#toast');el.textContent=t;el.className=kind==='bad'?'bad show':'show';clearTimeout(toast.t);toast.t=setTimeout(()=>el.className=kind==='bad'?'bad':'',1800);}
function burst(el,pts){
 const r=el.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
 floatTextAt(`+${fmt(pts)}`,x,y-10);
 if(reduceMotion)return;
 for(let i=0;i<16;i++){const s=document.createElement('span');s.className='spark';s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);const a=rnd(0,6.28),d=rnd(40,120);
  s.animate([{transform:'translate(-50%,-50%) scale(1)',opacity:1},{transform:`translate(calc(-50% + ${Math.cos(a)*d}px),calc(-50% + ${Math.sin(a)*d}px)) scale(.2)`,opacity:0}],{duration:rnd(450,800),easing:'cubic-bezier(.2,.8,.3,1)'}).onfinish=()=>s.remove();}
}
function floatText(t,el,bad){const r=el.getBoundingClientRect();floatTextAt(t,r.left+r.width/2,r.bottom+10,bad);}
function floatTextAt(t,x,y,bad){const s=document.createElement('span');s.className='float';s.textContent=t;if(bad)s.style.color='#ff8a78';s.style.left=x+'px';s.style.top=y+'px';document.body.appendChild(s);
 s.animate([{transform:'translate(-50%,0) scale(.8)',opacity:0},{transform:'translate(-50%,-14px) scale(1.1)',opacity:1,offset:.2},{transform:'translate(-50%,-60px) scale(1)',opacity:0}],{duration:1100,easing:'ease-out'}).onfinish=()=>s.remove();}
function banner(t){if(reduceMotion)return toast(t);const b=document.createElement('div');b.className='illum-banner';b.textContent=t;document.body.appendChild(b);
 b.animate([{opacity:0,transform:'translate(-50%,-50%) scale(.6)'},{opacity:1,transform:'translate(-50%,-50%) scale(1.05)',offset:.25},{opacity:1,transform:'translate(-50%,-50%) scale(1)',offset:.7},{opacity:0,transform:'translate(-50%,-60%) scale(1)'}],{duration:1300,easing:'ease-out'}).onfinish=()=>b.remove();}

/* ================= input ================= */
const ACT={
 newrun:()=>{sfx.click();newRun();},
 title:()=>{sfx.click();showTitle();},
 howto:()=>{sfx.click();howto();},
 codex:()=>{sfx.click();showCodex();},
 codexTab:a=>showCodex(a.dataset.k),
 closeModal,
 modalBg:(a,e)=>{if(e.target===a)closeModal();},
 mute:()=>{muted=!muted;try{localStorage.setItem('marginalia.mute',muted?'1':'0');}catch(e){}renderMute();if(!muted)sfx.click();},
 book:a=>pickBook(+a.dataset.s,+a.dataset.i),
 proceed:()=>{sfx.click();proceed();},
 toCase:()=>{sfx.click();showCase();},
 boss:()=>{sfx.click();startEncounter('boss',null);},
 opt:a=>chooseOpt(+a.dataset.i),
 tf:a=>tfAns(a.dataset.v==='1'),
 chip:a=>chipPick(+a.dataset.i),
 slot:a=>slotClear(+a.dataset.s),
 nudge:a=>nudge(+a.dataset.d),
 lock:()=>lockEst(),
 quill:a=>useQuill(+a.dataset.i),
 rewriteTo:a=>rewriteTo(a.dataset.k),
 cont:()=>advance(),
 choose:a=>{const c=S.choices&&S.choices[+a.dataset.i];if(!c)return;sfx.coin();c.run();const after=S.after;S.choices=null;updateHUD();after();},
 buy:a=>buy(+a.dataset.i),
 curio:a=>curioPick(+a.dataset.i)
};
document.addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a||a.disabled)return;const f=ACT[a.dataset.act];if(f)f(a,e);});
document.addEventListener('input',e=>{if(e.target.id==='estR'&&QS&&!QS.done)setEst(+e.target.value);});
document.addEventListener('keydown',e=>{
 if($('#modalRoot').innerHTML){if(e.key==='Escape'||e.key==='Enter'){e.preventDefault();closeModal();}return;}
 if(S.screen!=='enc'||!QS)return;
 const k=e.key,q=QS.q;
 if(!QS.done){
  if(QS.picking)return;
  const qi=QKEYS.indexOf(k.toLowerCase());if(qi>=0&&e.target.tagName!=='INPUT'){useQuill(qi);return;}
  if(q.t==='m'&&/^[1-4]$/.test(k))chooseOpt(+k-1);
  else if(q.t==='tf'){if(k==='ArrowLeft'||k==='1'){e.preventDefault();tfAns(false);}else if(k==='ArrowRight'||k==='2'){e.preventDefault();tfAns(true);}}
  else if(q.t==='o'&&/^[1-4]$/.test(k))chipPick(+k-1);
  else if(q.t==='e'){if(k==='ArrowLeft'||k==='ArrowDown'){e.preventDefault();nudge(-1,e.shiftKey);}else if(k==='ArrowRight'||k==='ArrowUp'){e.preventDefault();nudge(1,e.shiftKey);}else if(k==='Enter'){e.preventDefault();lockEst();}}
 }else if(k==='Enter'||k===' '){if($('#rvBox')){e.preventDefault();advance();}}
});

/* ================= boot ================= */
(function(){
 const svg=`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35 0 0 0 0 .24 0 0 0 0 .12 0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='.35'/></svg>`;
 document.documentElement.style.setProperty('--noise',`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
})();
renderMute();
BG.start();
requestAnimationFrame(tloop);
showTitle();
})();
</script>
