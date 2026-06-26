/* Emperor CMS engine (Part 2).
   Loads a working draft (localStorage 'dhs_cms' or the seed), lets staff edit
   records, and on Publish writes the model back to 'dhs_cms' — which the public
   site (Part 1) reads on next load. One model, two surfaces. Zero API cost. */
(function(){
  const KEY='dhs_cms';
  const clone=o=>JSON.parse(JSON.stringify(o));
  const load=()=>{try{const s=localStorage.getItem(KEY);if(s)return JSON.parse(s);}catch(e){}return clone(window.DHS_SEED);};
  let M=load(), dirty=false;
  if(!M.deptDetail)M.deptDetail={};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const el=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n;};
  const esc=s=>(s||'').replace(/</g,'&lt;');
  const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),1900);};
  const setDirty=v=>{dirty=v;$('#dirtyPill').style.display=v?'inline-block':'none';};

  const activity=[];
  const log=(a)=>{activity.unshift({a,t:'just now'});renderDash();};

  /* ---------- View routing ---------- */
  const titles={dash:'Dashboard',hero:'Hero Slides',news:'News & Bulletin',depts:'Departments',events:'Events',quick:'Quick Links',staff:'Staff Directory',emperorai:'Emperor AI',roles:'Roles & Workflow',integrations:'Integrations',arch:'Architecture'};
  $$('#sbNav a').forEach(a=>a.onclick=()=>{
    $$('#sbNav a').forEach(x=>x.classList.remove('on'));a.classList.add('on');
    const v=a.dataset.v;$$('.view').forEach(s=>s.classList.toggle('on',s.dataset.view===v));
    $('#viewTitle').textContent=titles[v];window.scrollTo(0,0);
  });

  /* ---------- Renderers ---------- */
  function renderDash(){
    $('#dashMetrics').innerHTML='';
    [['News stories',M.news.length,'live on homepage'],
     ['Departments',M.departments.length,M.departments.filter(d=>d.academy).length+' academies'],
     ['Events',M.events.length,'upcoming'],
     ['Quick links',M.quickLinks.length,'utility + grid']
    ].forEach(([l,v,d])=>$('#dashMetrics').appendChild(el('div','metric',`<b>${v}</b><span>${l}</span><div class="d">${d}</div>`)));
    const ac=$('#activity');ac.innerHTML='';
    const items=activity.length?activity:[{a:'Content model loaded from store',t:'now'}];
    items.slice(0,8).forEach(x=>ac.appendChild(el('div','row',`<div class="ic-badge">${ICON('square-pen',20)}</div><div class="meta"><b>${x.a}</b><span>Site Admin · ${x.t}</span></div>`)));
  }

  function rowAct(type,i){
    return `<div class="acts">
      <button class="btn btn-ghost btn-sm" data-edit="${type}" data-i="${i}">Edit</button>
      <button class="btn btn-ghost btn-sm" data-del="${type}" data-i="${i}">✕</button></div>`;}

  function renderHero(){const r=$('#heroRows');r.innerHTML='';M.hero.forEach((s,i)=>
    r.appendChild(el('div','row',`<img class="thumb" src="${s.img}"><div class="meta"><b>${esc(s.title)}</b><span>${esc(s.tag)} · CTA: ${esc(s.cta)}</span></div>${rowAct('hero',i)}`)));}
  function renderNews(){const r=$('#newsRows');r.innerHTML='';M.news.forEach((n,i)=>
    r.appendChild(el('div','row',`<img class="thumb" src="${n.img}"><div class="meta"><b>${esc(n.title)}</b><span>${n.date}</span></div><span class="tag${n.pinned?' gold':''}">${n.pinned?'★ '+n.cat:n.cat}</span>${rowAct('news',i)}`)));}
  function renderDepts(){const r=$('#deptRows');r.innerHTML='';M.departments.forEach((d,i)=>
    r.appendChild(el('div','row',`<div class="ic-badge">${ICON(d.icon||'book-open',22)}</div><div class="meta"><b>${esc(d.name)}</b><span>${esc((d.blurb||'').slice(0,64))}…</span></div>${d.academy?'<span class="tag gold">Academy</span>':''}${rowAct('depts',i)}`)));}
  function renderEvents(){const r=$('#eventRows');r.innerHTML='';M.events.forEach((e,i)=>
    r.appendChild(el('div','row',`<div class="ic-badge">${ICON('calendar',20)}</div><div class="meta"><b>${esc(e.title)}</b><span>${e.date} · ${esc(e.time)} · ${esc(e.where)}</span></div>${rowAct('events',i)}`)));}
  function renderQuick(){const r=$('#quickRows');r.innerHTML='';M.quickLinks.forEach((q,i)=>
    r.appendChild(el('div','row',`<div class="ic-badge">${ICON(q.icon,20)}</div><div class="meta"><b>${esc(q.label)}</b><span>${esc(q.href)}</span></div>${q.ext?'<span class="tag">external</span>':''}${rowAct('quick',i)}`)));}
  function renderStaff(){const r=$('#staffRows');r.innerHTML='';M.staff.forEach((s,i)=>
    r.appendChild(el('div','row',`<div class="ic-badge">${ICON('user',20)}</div><div class="meta"><b>${esc(s.name)}</b><span>${esc(s.role)} · ${esc(s.email)}</span></div><span class="tag">${esc(s.dept)}</span>${rowAct('staff',i)}`)));}

  function renderAll(){renderDash();renderHero();renderNews();renderDepts();renderEvents();renderQuick();renderStaff();}

  /* ---------- Static system panels ---------- */
  function renderStatic(){
    const src=[['Departments & academies','19 records','live'],['News & bulletin','homepage feed','live'],
      ['Bell schedules','regular/min/rally/finals','live'],['Athletics & forms','Emperor Nation','live'],
      ['Counseling & College/Career','support tracks','live'],['Events calendar','upcoming items','live'],
      ['Staff directory','contacts','live'],['Front-office fallback','559-595-7220','live']];
    $('#aiSources').innerHTML='';src.forEach(([a,b,st])=>$('#aiSources').appendChild(el('div','row',`<div class="ic-badge">${ICON('paperclip',20)}</div><div class="meta"><b>${a}</b><span>${b}</span></div><span class="tag">${st}</span>`)));

    const roles=[['Super Admin','District-wide — every school, all content, users, integrations, settings & audit','Everything'],
      ['Site Admin','Full control of this campus — publish, manage users, integrations','This school'],
      ['Editor','Review & publish content from any contributor','News, Events, Hero, Depts'],
      ['Department Lead','Edit only their own department page','Assigned department'],
      ['Athletics Director','Manage Emperor Nation, schedules, forms','Athletics'],
      ['Counselor','Update College & Career, social-emotional','Counseling'],
      ['Contributor (Student/ASB)','Draft Grapevine/DETV posts for review','Drafts only']];
    $('#roleRows').innerHTML='';roles.forEach(([n,d,s])=>$('#roleRows').appendChild(el('div','row',`<div class="ic-badge">${ICON('lock',20)}</div><div class="meta"><b>${n}</b><span>${d}</span></div><span class="tag">${s}</span>`)));

    const integ=[['PowerSchool','Grades, attendance, sub portal — SSO + roster sync','live'],
      ['Clever','Single sign-on hub for class apps','live'],
      ['ParentSquare','Family messaging & announcements push','live'],
      ['Sandy Hook — Say Something','Anonymous safety reporting','live'],
      ['District nutrition portal','Daily lunch menus','live'],
      ['Records / ScribOrder','Transcript & records requests','live'],
      ['Weglot','Multilingual (ES + 10 more) translation','live'],
      ['Google Workspace','Staff SSO & shared drives','plan'],
      ['Emperor AI retrieval','Grounds the assistant on published content','plan']];
    $('#integrationGrid').innerHTML='';integ.forEach(([n,d,st])=>$('#integrationGrid').appendChild(el('div','a',`<h3>${n}</h3><p>${d}</p><span class="st ${st}">${st==='live'?'Connected':'Planned'}</span>`)));

    const arch=[['Headless content API','Postgres + a content service exposes the model both surfaces use. The site reads; the CMS writes. Every write passes the authorization layer below.','live'],
      ['Server-side authorization (the real boundary)','The CMS hiding sections is convenience only — NOT security. Every API request is independently checked server-side: the caller\'s token carries role + scope (school_id, department_id), and the service rejects any read/write outside it. A Department Lead\'s token literally cannot fetch or PATCH another department, even by calling the API directly. Super Admin = unscoped; Site Admin = one school_id; Dept Lead = one department_id. Enforced in middleware on every route, plus row-level security in Postgres as defense-in-depth.','plan'],
      ['Role-based access (RBAC) model','Roles (Super Admin → Site Admin → Editor → Dept Lead / Athletics / Counselor / Contributor) map to scopes + a permission set. Mirrored in the UI switcher; authoritative on the server. Draft→review→publish gate per role.','live'],
      ['Media library','Central store for photos/PDFs (newsletters, forms) with alt-text + reuse across pages.','plan'],
      ['Audit trail & versioning','Every publish logged; roll back any page to a prior version.','plan'],
      ['Emperor AI service','Retrieval over published content + front-office fallback. Re-indexes on publish — no separate training.','plan'],
      ['Multilingual pipeline','Source-of-truth English; Spanish + 10 languages generated and cached at publish.','live'],
      ['Accessibility & WCAG','Enforced alt-text, contrast, and keyboard nav baked into the editor.','plan'],
      ['SSO + directory sync','Staff sign in via district Google/Clever; roles mapped from the directory.','plan']];
    $('#archGrid').innerHTML='';arch.forEach(([n,d,st])=>$('#archGrid').appendChild(el('div','a',`<h3>${n}</h3><p>${d}</p><span class="st ${st}">${st==='live'?'In prototype':'Production'}</span>`)));

    /* District / multi-school (Super Admin visibility) */
    const schools=[
      ['Dinuba High School','High School · 2,131 students',true],
      ['Sierra Vista High School','Continuation High School',false],
      ['Washington Intermediate','Intermediate (7–8)',false],
      ['Ronald Reagan Academy','Elementary (K–6)',false],
      ['Grand View Elementary','Elementary (K–6)',false],
      ['Jefferson Elementary','Elementary (K–6)',false],
      ['Kennedy Elementary','Elementary (K–6)',false],
      ['Lincoln Elementary','Elementary (K–6)',false],
      ['Roosevelt Elementary','Elementary (K–6)',false],
      ['Wilson Elementary','Elementary (K–6)',false],
      ['Dinuba Adult School','Adult Education',false]];
    if($('#schoolRows')){$('#schoolRows').innerHTML='';
      schools.forEach(([n,t,cur])=>$('#schoolRows').appendChild(el('div','row',`<div class="ic-badge">${ICON('school',20)}</div><div class="meta"><b>${n}</b><span>${t}</span></div><span class="tag${cur?' gold':''}">${cur?'Current site':'Linked'}</span>`)));
      $('#districtMetrics').innerHTML='';
      [['Schools',schools.length,'on platform'],['Students','6,400+','district-wide'],['Sites managed',schools.length,'one login'],['Your access','Full','all campuses']]
        .forEach(([l,v,d])=>$('#districtMetrics').appendChild(el('div','metric',`<b>${v}</b><span>${l}</span><div class="d">${d}</div>`)));
    }
  }

  /* ---------- Role scoping — "Super Admin can see everything" ---------- */
  const SCOPES={
    superadmin:{label:'Super Admin', scope:null /* null = all sections */},
    siteadmin:{label:'Site Admin', scope:['dash','hero','news','depts','events','quick','staff','emperorai','roles','integrations','arch']},
    editor:{label:'Editor', scope:['dash','hero','news','depts','events','quick','emperorai']},
    deptlead:{label:'Department Lead', scope:['dash','depts']}
  };
  function applyRole(key){
    const r=SCOPES[key];
    $('#whoami').textContent=r.label;
    const isSuper=key==='superadmin';
    $$('.sa-only').forEach(n=>n.style.display=isSuper?'':'none');
    $$('#sbNav a').forEach(a=>{const v=a.dataset.v;const ok=!r.scope||r.scope.includes(v);
      if(a.classList.contains('sa-only'))return; a.style.display=ok?'':'none';});
    const active=$('#sbNav a.on');
    if(active && active.style.display==='none') $('#sbNav a[data-v="dash"]').click();
  }

  /* ---------- Edit modal ---------- */
  const FIELDS={
    hero:[['tag','Tag','text'],['title','Headline','text'],['text','Subtext','area'],['img','Image path','text'],['cta','Button label','text'],['href','Button link','text']],
    news:[['title','Title','text'],['cat','Category','text'],['date','Date (YYYY-MM-DD)','text'],['img','Image path','text'],['excerpt','Excerpt','area'],['pinned','Pinned (true/false)','bool']],
    depts:[['name','Name','text'],['icon','Icon (emoji)','text'],['blurb','Description','area'],['academy','Four-year academy (true/false)','bool']],
    events:[['title','Title','text'],['date','Date (YYYY-MM-DD)','text'],['time','Time','text'],['where','Location','text']],
    quick:[['label','Label','text'],['icon','Icon (emoji)','text'],['href','Link','text'],['ext','Opens external (true/false)','bool']],
    staff:[['name','Name','text'],['role','Role','text'],['dept','Department','text'],['email','Email','text']]
  };
  const COLL={hero:'hero',news:'news',depts:'departments',events:'events',quick:'quickLinks',staff:'staff'};
  let editType=null,editIdx=-1;

  function openModal(type,i){
    editType=type;editIdx=i;
    const coll=M[COLL[type]];const rec=i>=0?coll[i]:{};
    $('#modalTitle').textContent=(i>=0?'Edit ':'Add ')+titles[type==='depts'?'depts':type].replace(/s$/,'');
    const f=$('#modalForm');f.innerHTML='';
    FIELDS[type].forEach(([k,lbl,t])=>{
      const v=rec[k]!=null?rec[k]:'';
      let inp;
      if(t==='area')inp=`<textarea data-k="${k}">${esc(String(v))}</textarea>`;
      else if(t==='bool')inp=`<select data-k="${k}"><option value="false"${!v?' selected':''}>No</option><option value="true"${v?' selected':''}>Yes</option></select>`;
      else inp=`<input data-k="${k}" value="${esc(String(v))}">`;
      f.appendChild(el('div','field',`<label>${lbl}</label>${inp}`));
    });
    /* Departments also carry interior-page detail (courses, highlights, chair…) */
    if(type==='depts'){
      const det=M.deptDetail[rec.id]||{};
      f.appendChild(el('div',null,'<hr style="border:0;border-top:1px solid var(--line);margin:.4rem 0 .8rem"><div style="font-family:var(--display);text-transform:uppercase;font-size:.72rem;letter-spacing:.07em;color:var(--steel-dark);margin-bottom:.2rem">Interior page detail · drives the department page + Emperor AI</div>'));
      [['lead','Chair / Lead','text'],['email','Chair email','text'],['room','Location / Room','text'],['pathway','Pathway label','text'],['intro','Intro paragraph','area'],['courses','Courses (one per line)','list'],['highlights','Highlights (one per line)','list']]
      .forEach(([k,lbl,t])=>{
        let v=det[k]!=null?det[k]:'';
        if(t==='list')v=Array.isArray(v)?v.join('\n'):'';
        const inp=(t==='area'||t==='list')
          ? `<textarea data-dk="${k}"${t==='list'?' data-arr="1"':''}>${esc(String(v))}</textarea>`
          : `<input data-dk="${k}" value="${esc(String(v))}">`;
        f.appendChild(el('div','field',`<label>${lbl}</label>${inp}`));
      });
    }
    $('#modalScrim').classList.add('on');
  }
  function closeModal(){$('#modalScrim').classList.remove('on');}
  $('#modalCancel').onclick=closeModal;$('#modalScrim').onclick=e=>{if(e.target.id==='modalScrim')closeModal();};
  $('#modalSave').onclick=()=>{
    const coll=M[COLL[editType]];const rec=editIdx>=0?coll[editIdx]:{};
    $$('#modalForm [data-k]').forEach(inp=>{
      const k=inp.dataset.k;let v=inp.value;
      if(v==='true')v=true;else if(v==='false')v=false;
      rec[k]=v;
    });
    if(editIdx<0){rec.id=editType[0]+Date.now();coll.unshift(rec);log('Added '+editType+': '+(rec.title||rec.name||rec.label));}
    else log('Edited '+editType+': '+(rec.title||rec.name||rec.label));
    if(editType==='depts'){
      const det=M.deptDetail[rec.id]||(M.deptDetail[rec.id]={});
      $$('#modalForm [data-dk]').forEach(inp=>{
        let v=inp.value;
        if(inp.dataset.arr)v=v.split('\n').map(x=>x.trim()).filter(Boolean);
        det[inp.dataset.dk]=v;
      });
    }
    setDirty(true);closeModal();renderAll();
  };

  /* delegate edit/del/add buttons */
  document.body.addEventListener('click',e=>{
    const a=e.target.closest('[data-add]');if(a){openModal(a.dataset.add,-1);return;}
    const ed=e.target.closest('[data-edit]');if(ed){openModal(ed.dataset.edit,+ed.dataset.i);return;}
    const dl=e.target.closest('[data-del]');if(dl){const t=dl.dataset.del;const coll=M[COLL[t]];
      const rec=coll[+dl.dataset.i];if(confirm('Delete this item?')){coll.splice(+dl.dataset.i,1);log('Deleted '+t+': '+(rec.title||rec.name||rec.label));setDirty(true);renderAll();}return;}
  });

  /* ---------- Publish / reset ---------- */
  $('#publishBtn').onclick=()=>{localStorage.setItem(KEY,JSON.stringify(M));setDirty(false);log('Published to live site');toast('✅ Published — open the live site to see it');};
  $('#resetBtn').onclick=()=>{if(confirm('Reset all content to the original seed? This clears your edits.')){localStorage.removeItem(KEY);M=clone(window.DHS_SEED);setDirty(false);renderAll();toast('Content reset to seed');}};

  window.addEventListener('beforeunload',e=>{if(dirty){e.preventDefault();e.returnValue='';}});

  /* sidebar icons — swap emoji for 2026 SVG */
  const NAVICON={district:'school',dash:'layout-dashboard',hero:'image',news:'megaphone',depts:'book-open',
    events:'calendar',quick:'link',staff:'users',emperorai:'crown',roles:'lock',integrations:'plug',arch:'puzzle'};
  $$('#sbNav a').forEach(a=>{const ic=a.querySelector('.ic');if(ic&&NAVICON[a.dataset.v])ic.innerHTML=ICON(NAVICON[a.dataset.v],18);});

  /* boot */
  renderAll();renderStatic();
  $('#roleSwitch').onchange=e=>applyRole(e.target.value);
  applyRole('superadmin');
})();
