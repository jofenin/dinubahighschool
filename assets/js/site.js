/* Public site renderer — reads the shared content model and paints the page.
   CMS writes to localStorage('dhs_cms'); we prefer that over the seed so any
   edit made in Part 2 shows up live here in Part 1. */
(function(){
  const C = (() => {
    try { const s = localStorage.getItem('dhs_cms'); if (s) return JSON.parse(s); } catch(e){}
    return window.DHS_SEED;
  })();
  const $ = (s,r=document)=>r.querySelector(s);
  const el = (t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n;};
  const MO=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  const fmtDate=d=>{const x=new Date(d+'T00:00');return x.toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});};

  /* Top quick links (first 4) */
  const tq=$('#topQuick');
  C.quickLinks.slice(0,4).forEach(q=>{const a=el('a',null,q.label);a.href=q.href;if(q.ext)a.target='_blank';tq.appendChild(a);});

  /* Dept mega-menu (first 8 + all link) */
  const dm=$('#deptMenu');
  C.departments.slice(0,8).forEach(d=>{const a=el('a',null,`<span style="display:inline-flex;align-items:center;gap:.5rem">${ICON(d.icon,17)} ${d.name}</span>`);a.href='page.html#dept/'+d.id;dm.appendChild(a);});
  dm.appendChild(el('a',null,'<strong style="color:var(--green)">All Departments →</strong>')).href='#departments';

  /* Hero */
  const hs=$('#heroSlides'),hc=$('#heroContent'),hd=$('#heroDots');
  C.hero.forEach((s,i)=>{
    const sl=el('div','hero-slide'+(i===0?' active':''));sl.style.backgroundImage=`url(${s.img})`;hs.appendChild(sl);
    const dot=el('button',i===0?'on':'');dot.onclick=()=>goHero(i);hd.appendChild(dot);
  });
  function paintHero(i){const s=C.hero[i];
    hc.innerHTML=`<span class="h-tag">${s.tag}</span><h1>${s.title}</h1><p>${s.text}</p>
      <div class="hero-cta"><a class="btn btn-gold" href="${s.href}">${s.cta}</a>
      <a class="btn btn-ghost" href="#news">Latest News</a></div>`;}
  let hi=0;paintHero(0);
  function goHero(i){hi=i;document.querySelectorAll('.hero-slide').forEach((n,k)=>n.classList.toggle('active',k===i));
    document.querySelectorAll('.hero-dots button').forEach((n,k)=>n.classList.toggle('on',k===i));paintHero(i);}
  setInterval(()=>goHero((hi+1)%C.hero.length),6000);

  /* Stats */
  const st=$('#stats');
  C.stats.forEach(s=>st.appendChild(el('div','stat',`<b>${s.value}</b><span>${s.label}</span>`)));

  /* Quick grid */
  const qg=$('#quickGrid');
  C.quickLinks.forEach(q=>{const a=el('a','qcard',`<span class="qi">${ICON(q.icon,22)}</span>${q.label}`);a.href=q.href;if(q.ext)a.target='_blank';qg.appendChild(a);});

  /* News */
  const ng=$('#newsGrid');
  C.news.forEach(n=>{
    ng.appendChild(el('article','ncard reveal',
      `<div class="ph"><img src="${n.img}" alt="${n.title}"></div>
       <div class="body"><span class="cat">${n.cat}</span>
       <h3>${n.title}</h3><p class="ex">${n.excerpt}</p>
       <div class="dt">${n.pinned?'<span class="pin">★ Pinned · </span>':''}${fmtDate(n.date)}</div></div>`));
  });

  /* Departments + filter */
  const df=$('#deptFilter'),dg=$('#deptGrid');
  const cats=[['all','All'],['academy','Academies'],['cte','CTE / Career'],['core','Core Academics']];
  const coreIds=['english','math','science','social','language','eld'];
  const cteIds=['ag','firefighting','njrotc','ame','business','industrial','cfn','teachered'];
  function inCat(d,c){if(c==='all')return true;if(c==='academy')return d.academy;if(c==='core')return coreIds.includes(d.id);if(c==='cte')return cteIds.includes(d.id);}
  function renderDepts(c){dg.innerHTML='';C.departments.filter(d=>inCat(d,c)).forEach(d=>{
    const a=el('a','dcard reveal in'+(d.academy?' is-academy':''),
      `${d.academy?'<span class="academy-tag">Academy</span>':''}<div class="di">${ICON(d.icon,28)}</div>
       <h3>${d.name}</h3><p>${d.blurb||''}</p>`);
    a.href='page.html#dept/'+d.id;dg.appendChild(a);});}
  cats.forEach((c,i)=>{const b=el('button','chip'+(i===0?' on':''),c[1]);b.onclick=()=>{
    df.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');renderDepts(c[0]);};df.appendChild(b);});
  renderDepts('all');

  /* Athletics */
  $('#athIntro').textContent=C.athletics.intro;
  const sc=$('#sportChips');C.athletics.sports.forEach(s=>sc.appendChild(el('span',null,s)));
  const al=$('#athLinks');C.athletics.links.forEach(l=>{const a=el('a','btn btn-outline',l.label);a.href='page.html#athletics';al.appendChild(a);});
  al.appendChild(el('a','btn btn-primary','Full Schedule & Coaches →')).href='page.html#athletics';

  /* Counseling */
  $('#counselIntro').textContent=C.counseling.intro;
  const cg=$('#counselGrid');
  C.counseling.cards.forEach(c=>{const a=el('a','ccard reveal',`<h3>${c.title}</h3><p>${c.text}</p>`);a.href='page.html#counseling';cg.appendChild(a);});

  /* Events */
  const ev=$('#eventsList');
  C.events.forEach(e=>{const d=new Date(e.date+'T00:00');
    ev.appendChild(el('div','ev',
      `<div class="cal"><div class="mo">${MO[d.getMonth()]}</div><div class="dy">${d.getDate()}</div></div>
       <div class="ev-b"><strong>${e.title}</strong><span>${e.where} · ${e.time}</span></div>`));});

  /* Bell */
  $('#bellNote').textContent=C.bell.note;
  const br=$('#bellRows');
  C.bell.periods.forEach(p=>br.appendChild(el('div','brow',`<span>${p.p}</span><span>${p.t}</span>`)));

  /* Drawer */
  const drawer=$('#drawer'),scrim=$('#scrim');
  const openD=()=>{drawer.classList.add('open');scrim.classList.add('open');};
  const closeD=()=>{drawer.classList.remove('open');scrim.classList.remove('open');};
  $('#burger').onclick=openD;$('#drawerClose').onclick=closeD;scrim.onclick=closeD;
  drawer.querySelectorAll('a').forEach(a=>a.onclick=closeD);

  /* Reveal on scroll */
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(n=>io.observe(n));

  const ps=$('#psSocial');if(ps)ps.innerHTML=ICON('message-circle',18);

  /* Boot Emperor AI with content context */
  if(window.EmperorAI) window.EmperorAI.init(C);
})();
