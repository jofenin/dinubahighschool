/* Interior page renderer — the deep layers under the homepage.
   Data-driven from the same content model (localStorage 'dhs_cms' or seed).
   Routes off the URL hash:  #dept/<id> · #athletics · #counseling · #staff   */
(function(){
  const C=(()=>{try{const s=localStorage.getItem('dhs_cms');if(s)return JSON.parse(s);}catch(e){}return window.DHS_SEED;})();
  const $=(s,r=document)=>r.querySelector(s);
  const esc=s=>(s||'').replace(/</g,'&lt;');
  const mount=$('#pageMount');
  const fmt=d=>new Date(d+'T00:00').toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'});

  function hero(crumb,title,lead,badges,img){
    return `<section class="page-hero${img?' has-img':''}">
      ${img?`<style>.page-hero.has-img::before{background-image:url(${img})}</style>`:''}
      <div class="wrap">
        <div class="crumb"><a href="index.html">Home</a>${crumb.map(c=>`<span class="sep">›</span>${c.href?`<a href="${c.href}">${c.t}</a>`:`<span>${c.t}</span>`}`).join('')}</div>
        <h1>${title}</h1>${lead?`<p class="lead">${lead}</p>`:''}
        ${badges&&badges.length?`<div class="badges">${badges.map(b=>`<span class="badge${b.ghost?' ghost':''}">${b.t}</span>`).join('')}</div>`:''}
      </div></section>`;
  }
  const officeBox=`<div class="box"><h3>Main Office</h3>
    <p>${C.meta.address}</p><p>📞 <a href="tel:5595957220">${C.meta.phone}</a></p>
    <p>Fax ${C.meta.fax}</p></div>`;

  /* ---- Department detail ---- */
  function renderDept(id){
    const d=C.departments.find(x=>x.id===id)||C.departments[0];
    const det=(C.deptDetail&&C.deptDetail[id])||null;
    const intro=det?det.intro:(d.blurb||'');
    const courses=det?det.courses:["Intro / Foundations","Intermediate Coursework","Advanced & Honors","AP / College-Credit Options"];
    const badges=[];
    if(d.academy)badges.push({t:"Four-Year Academy"});
    if(det&&det.pathway)badges.push({t:det.pathway,ghost:true});
    badges.push({t:`<span style="display:inline-flex;align-items:center;gap:.4rem">${ICON(d.icon,15)} ${d.name}</span>`,ghost:true});
    const lead=det&&det.lead?{name:det.lead,email:det.email||'office@dinuba.k12.ca.us'}:null;
    mount.innerHTML=hero(
      [{t:"Departments",href:"index.html#departments"},{t:d.name}],
      d.name, intro, badges, det?det.img:'assets/img/campus-mountains.jpg'
    )+`<div class="wrap page-body">
      <div class="page-main">
        <h2>Courses Offered</h2>
        <div class="coursegrid">${courses.map(c=>`<div class="ci">${esc(c)}</div>`).join('')}</div>
        ${det&&det.highlights?`<h2>Program Highlights</h2><div class="hl">${det.highlights.map(h=>`<div>${ICON('shield',17)}<span>${esc(h)}</span></div>`).join('')}</div>`:''}
        <h2>About the ${d.academy?'Academy':'Department'}</h2>
        <p>${esc(d.blurb||'')} Dinuba High's program supports every Emperor toward college and career readiness, grounded in our values of Excellence, Maturity, Perseverance, and Safety.</p>
      </div>
      <aside class="aside">
        <div class="box"><h3>Department Info</h3>
          ${lead?`<p><b>Chair:</b> ${esc(lead.name)}</p><p><a href="mailto:${lead.email}">${lead.email}</a></p>`:'<p>Contact the front office for the department chair.</p>'}
          ${det&&det.room?`<p><b>Location:</b> ${esc(det.room)}</p>`:''}
        </div>
        <div class="box"><h3>Explore</h3>
          <a href="index.html#departments">All Departments</a>
          <a href="page.html#counseling">Counseling & College/Career</a>
          <a href="index.html#enroll">Enroll at DHS</a></div>
        ${officeBox}
      </aside></div>`;
  }

  /* ---- Athletics ---- */
  function renderAthletics(){
    const a=C.athletics;
    mount.innerHTML=hero(
      [{t:"Athletics"}],"Emperor Nation Athletics",a.intro,
      [{t:"Central Section"},{t:`${a.sports.length} Sports`,ghost:true}],'assets/img/hero-sports.jpg'
    )+`<div class="wrap page-body">
      <div class="page-main">
        <h2>Upcoming Schedule</h2>
        <table class="sched"><thead><tr><th>Date</th><th>Sport</th><th>Opponent</th><th>Site</th><th>Time</th></tr></thead>
        <tbody>${C.athleticsSchedule.map(g=>`<tr><td>${fmt(g.date)}</td><td><b>${esc(g.sport)}</b></td><td>${esc(g.opp)}</td>
          <td class="${g.site==='Home'?'home':'away'}">${g.site}</td><td>${esc(g.time)}</td></tr>`).join('')}</tbody></table>
        <h2>Sports Programs</h2>
        <div class="sportchips">${a.sports.map(s=>`<span>${esc(s)}</span>`).join('')}</div>
        <h2>Coaches</h2>
        <div class="dirgrid">${C.coaches.map(c=>`<div class="dircard"><div class="av">${ICON('award',22)}</div><b>${esc(c.name)}</b>
          <div class="rl">${esc(c.sport)}</div><a href="mailto:${c.email}">${c.email}</a></div>`).join('')}</div>
      </div>
      <aside class="aside">
        <div class="box"><h3>Entering Emperor Nation</h3>
          ${a.links.map(l=>`<a href="${l.href}">${esc(l.label)}</a>`).join('')}</div>
        <div class="box"><h3>Eligibility</h3><p>A current physical and completed sports forms must be on file before tryouts. See the Athletic Director.</p></div>
        ${officeBox}
      </aside></div>`;
  }

  /* ---- Counseling ---- */
  function renderCounseling(){
    mount.innerHTML=hero(
      [{t:"Counseling"}],"College, Career & Wellness",C.counseling.intro,
      [{t:"A-G & CTE"},{t:"24+ Pathways",ghost:true}],'assets/img/grad-2025.jpg'
    )+`<div class="wrap page-body">
      <div class="page-main">
        <h2>Counseling Centers</h2>
        <div class="linkcards">${C.counselingPages.map(p=>`<div class="linkcard"><h3>${esc(p.title)}</h3>
          <p>${esc(p.intro)}</p>${p.links.map(l=>`<a href="#">${esc(l)}</a>`).join('')}</div>`).join('')}</div>
        <h2>Counseling Staff</h2>
        <div class="dirgrid">${C.staff.filter(s=>s.dept==='Counseling').map(s=>`<div class="dircard"><div class="av">${ICON('user',22)}</div>
          <b>${esc(s.name)}</b><div class="rl">${esc(s.role)}</div><a href="mailto:${s.email}">${s.email}</a></div>`).join('')}</div>
      </div>
      <aside class="aside">
        <div class="box"><h3>Quick Resources</h3>
          <a href="#">A-G Course List</a><a href="#">FAFSA & Financial Aid</a>
          <a href="#">Scholarship Calendar</a><a href="#">Say Something Reporting</a></div>
        <div class="box"><h3>California Dashboard</h3><p>View school performance on the official state dashboard.</p><a href="#">Open Dashboard ↗</a></div>
        ${officeBox}
      </aside></div>`;
  }

  /* ---- Staff directory ---- */
  function renderStaff(){
    const depts=['All',...new Set(C.staff.map(s=>s.dept))];
    mount.innerHTML=hero([{t:"Staff Directory"}],"Staff Directory","Reach any department or office at Dinuba High School.",
      [{t:`${C.staff.length} Listed`}],null)+
      `<div class="wrap page-body" style="grid-template-columns:1fr">
        <div class="page-main">
          <div class="dirfilter" id="staffFilter">${depts.map((d,i)=>`<button class="chip${i===0?' on':''}" data-d="${d}">${d}</button>`).join('')}</div>
          <div class="dirgrid" id="staffGrid"></div>
        </div></div>`;
    const grid=$('#staffGrid');
    const paint=f=>{grid.innerHTML=C.staff.filter(s=>f==='All'||s.dept===f).map(s=>
      `<div class="dircard"><div class="av">${ICON('user',22)}</div><b>${esc(s.name)}</b><div class="rl">${esc(s.role)} · ${esc(s.dept)}</div>
       <a href="mailto:${s.email}">${s.email}</a></div>`).join('');};
    paint('All');
    $('#staffFilter').querySelectorAll('.chip').forEach(b=>b.onclick=()=>{
      $('#staffFilter').querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));b.classList.add('on');paint(b.dataset.d);});
  }

  function route(){
    const h=(location.hash||'#').replace(/^#/,'');
    if(h.startsWith('dept/'))renderDept(h.split('/')[1]);
    else if(h==='athletics')renderAthletics();
    else if(h==='counseling')renderCounseling();
    else if(h==='staff')renderStaff();
    else renderDept(C.departments[0].id);
    window.scrollTo(0,0);
  }
  window.addEventListener('hashchange',route);
  route();
  if(window.EmperorAI)window.EmperorAI.init(C);
})();
