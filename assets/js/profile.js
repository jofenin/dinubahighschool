/* =============================================================================
   Emperor ID — role-aware profile (student · faculty · alumni)
   -----------------------------------------------------------------------------
   One identity, lifelong. The profile is the personalized home for whoever signs
   in: a launcher of the things THAT person actually does, plus role-specific
   panels (schedule, attendance, classes, transcript…). Demo identities + state
   live in localStorage. Zero API. In production: SSO/ID-proofing + SIS/ScribOrder.
   ========================================================================== */
(function(){
  const $=(s,r=document)=>r.querySelector(s);
  const el=(t,c,h)=>{const n=document.createElement(t);if(c)n.className=c;if(h!=null)n.innerHTML=h;return n;};
  const esc=s=>(s||'').replace(/</g,'&lt;');
  const SESSION='dhs_emperor_session', SCRIBORDER='https://dinubaca.scriborder.com/';
  const PS='https://dinuba.powerschool.com/public/home.html', SUBS='https://dinuba.powerschool.com/subs/pw.html';
  const STAGES=['Requested','Processing','Issued'];
  const initials=n=>n.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  const yr=2026;

  /* ---- Demo identities (production: SIS records behind SSO/ID-proofing) ---- */
  const IDENTITIES={
    student:{ type:'student', name:"Jordan Avila", emperorId:"EMP-2027-0481", status:"Current Student",
      gradYear:2027, grade:11, academy:"Agriculture Academy",
      gpa:"3.82", credits:{earned:160,required:220}, ag:"On Track",
      honors:["California Scholarship Federation","FFA Chapter Officer"],
      clubs:["FFA","CSF","Key Club"],
      attendance:{present:172,absent:3,tardy:2,rate:"98%"},
      balance:{lunch:12.40,fees:25.00},
      schedule:[
        {per:"Per 1",time:"8:00–8:55",course:"AP English Language",room:"E-42",teacher:"Ms. Carter"},
        {per:"Per 2",time:"9:01–9:56",course:"AP U.S. History",room:"H-71",teacher:"Mr. Vang"},
        {per:"Per 3",time:"10:02–10:57",course:"Pre-Calculus",room:"M-12",teacher:"Mrs. Lopez"},
        {per:"Per 4",time:"11:13–12:08",course:"Agriculture Biology",room:"Ag-2",teacher:"Mr. Ramirez"},
        {per:"Per 5",time:"12:49–1:44",course:"Spanish 3",room:"L-83",teacher:"Sra. Núñez"},
        {per:"Per 6",time:"1:50–2:45",course:"Physical Education",room:"Gym",teacher:"Coach Diaz"}
      ],
      courses:[
        {y:"2025–26",t:"S1",name:"AP English Language",g:"A"},
        {y:"2025–26",t:"S1",name:"AP U.S. History",g:"A-"},
        {y:"2025–26",t:"S1",name:"Pre-Calculus",g:"B+"},
        {y:"2024–25",t:"S2",name:"Chemistry",g:"B+"},
        {y:"2024–25",t:"S2",name:"Spanish 3",g:"A"}
      ]},
    faculty:{ type:'faculty', name:"David Soto", emperorId:"EMP-STAFF-238", status:"Faculty · Science",
      role:"Science Teacher", room:"Science Wing — Rm S-4", since:2014, cmsRole:"Department Lead",
      email:"science@dinuba.k12.ca.us",
      sections:[
        {per:"Per 1",time:"8:00–8:55",course:"Biology",room:"S-4",students:32},
        {per:"Per 2",time:"9:01–9:56",course:"AP Biology",room:"S-4",students:28},
        {per:"Per 3",time:"10:02–10:57",course:"Biology",room:"S-4",students:34},
        {per:"Per 4",time:"11:13–12:08",course:"Prep Period",room:"S-4",students:0},
        {per:"Per 5",time:"12:49–1:44",course:"Chemistry",room:"S-4",students:30},
        {per:"Per 6",time:"1:50–2:45",course:"Chemistry",room:"S-4",students:31}
      ]},
    alumni:{ type:'alumni', name:"Maria Delgado", emperorId:"EMP-2009-1342", status:"Alumni · Class of 2009",
      gradYear:2009, academy:"Fire Science Academy",
      gpa:"3.55", credits:{earned:230,required:220}, ag:"Met A-G", diploma:"Awarded June 2009",
      honors:["Million Dollar Club 2009","Fire Science Completer"],
      courses:[
        {y:"2008–09",t:"S2",name:"Fire Science 4",g:"A"},
        {y:"2008–09",t:"S2",name:"AP Government",g:"B+"},
        {y:"2008–09",t:"S2",name:"English 12 / ERWC",g:"A-"},
        {y:"2007–08",t:"S1",name:"Algebra 2",g:"B+"}
      ]}
  };

  /* ---- transcript requests (persisted per Emperor ID) ---- */
  const reqKey=id=>'dhs_tr_'+id;
  const loadReqs=id=>{try{const s=localStorage.getItem(reqKey(id));if(s)return JSON.parse(s);}catch(e){}return null;};
  const saveReqs=(id,r)=>localStorage.setItem(reqKey(id),JSON.stringify(r));
  function seedReqs(p){
    if(p.type==='faculty'||loadReqs(p.emperorId))return;
    if(p.type==='alumni') saveReqs(p.emperorId,[{to:"Reedley College Admissions",how:"Electronic (PDF)",n:1,date:"Aug 14, 2019",stage:2}]);
    else saveReqs(p.emperorId,[]);
  }

  const session=()=>{try{return localStorage.getItem(SESSION);}catch(e){return null;}};
  const signIn=k=>{localStorage.setItem(SESSION,k);render();};
  const signOut=()=>{localStorage.removeItem(SESSION);render();};

  /* ---------- Personalized launcher per role ---------- */
  function actionsFor(p){
    if(p.type==='student')return[
      {i:'graduation-cap',l:'Grades',s:'PowerSchool',h:PS,ext:1},
      {i:'key-round',l:'Class Apps',s:'Clever',h:'#',ext:1},
      {i:'calendar',l:'My Schedule',s:'6 periods',h:'#schedule'},
      {i:'clipboard-list',l:'Attendance',s:p.attendance.rate+' present',h:'#attendance'},
      {i:'book-open',l:'Course Selection',s:'Plan next year',h:'page.html#counseling'},
      {i:'apple',l:'Lunch Menu',s:'$'+p.balance.lunch.toFixed(2)+' balance',h:'#',ext:1},
      {i:'file-check',l:'Pay Fees',s:'$'+p.balance.fees.toFixed(2)+' due',h:'#',ext:1},
      {i:'award',l:'Athletics',s:'Forms & eligibility',h:'page.html#athletics'}
    ];
    if(p.type==='faculty')return[
      {i:'book-open',l:'Gradebook',s:'PowerSchool Teacher',h:PS,ext:1},
      {i:'clipboard-list',l:'Take Attendance',s:'Period roll',h:PS,ext:1},
      {i:'users',l:'My Classes',s:p.sections.filter(s=>s.students).length+' sections',h:'#sections'},
      {i:'calendar',l:'Sub Finder',s:'Report an absence',h:SUBS,ext:1},
      {i:'puzzle',l:'Emperor CMS',s:p.cmsRole,h:'admin.html',ext:1},
      {i:'user',l:'Staff Directory',s:'Find a colleague',h:'page.html#staff'},
      {i:'megaphone',l:'ParentSquare',s:'Message families',h:'#',ext:1},
      {i:'mail',l:'District Email',s:esc(p.email),h:'mailto:'+p.email,ext:1}
    ];
    return[
      {i:'file-check',l:'Transcript',s:'Request official',action:'transcript'},
      {i:'megaphone',l:'Alumni News',s:'Class updates',h:'index.html#news'},
      {i:'heart-handshake',l:'Give Back',s:'Support DHS',h:'#'},
      {i:'user',l:'Update Info',s:'Keep in touch',h:'#'}
    ];
  }
  function launcher(p){
    return `<div class="section-label">Quick actions</div><div class="launch">`+
      actionsFor(p).map(a=>{
        const ext=a.ext?`<span class="ext-i">${ICON('arrow-right',15)}</span>`:'';
        const attr=a.action?`href="#" data-action="${a.action}"`:`href="${a.h}"${a.ext?' target="_blank" rel="noopener"':''}`;
        return `<a ${attr}>${ext}<span class="li">${ICON(a.i,22)}</span><b>${a.l}</b><span>${a.s}</span></a>`;
      }).join('')+`</div>`;
  }

  /* ---------- Top stat tiles per role ---------- */
  function tiles(p){
    if(p.type==='faculty'){
      const taught=p.sections.filter(s=>s.students).length, total=p.sections.reduce((a,s)=>a+s.students,0);
      return [[taught,'Sections'],[total,'Students'],[(yr-p.since),'Years at DHS'],['S-4','Room']];
    }
    const pct=Math.min(100,Math.round(p.credits.earned/p.credits.required*100));
    return [[p.gpa,'GPA'],[pct+'%','Credits ('+p.credits.earned+'/'+p.credits.required+')'],[p.ag,'A-G Status'],[p.honors.length,'Honors']];
  }

  /* ---------- Role panels ---------- */
  function studentPanels(p){
    const cc=[
      {done:1,label:'A-G requirements on track',meta:p.ag},
      {done:1,label:'California Scholarship Federation',meta:'Member'},
      {done:0,label:'Complete FAFSA / CADAA',meta:'Opens Oct 1'},
      {done:0,label:'Submit college applications',meta:'Due Nov–Jan'},
      {done:0,label:'Senior portfolio & defense',meta:'Spring 2027'}
    ];
    return `
      <div class="panel" id="schedule"><h2>My Schedule</h2><div class="psub">Regular day · Spring semester</div>
        <table class="acad"><thead><tr><th>Period</th><th>Time</th><th>Course</th><th>Room</th><th>Teacher</th></tr></thead>
        <tbody>${p.schedule.map(s=>`<tr><td>${s.per}</td><td>${s.time}</td><td>${esc(s.course)}</td><td>${s.room}</td><td>${esc(s.teacher)}</td></tr>`).join('')}</tbody></table></div>

      <div class="panel" id="attendance"><h2>Attendance</h2><div class="psub">This school year</div>
        <div class="tiles" style="margin:0">
          <div class="tile"><b>${p.attendance.rate}</b><span>Present rate</span></div>
          <div class="tile"><b>${p.attendance.present}</b><span>Days present</span></div>
          <div class="tile"><b>${p.attendance.absent}</b><span>Absences</span></div>
          <div class="tile"><b>${p.attendance.tardy}</b><span>Tardies</span></div>
        </div></div>

      <div class="panel"><h2>Academic Summary</h2>
        <div class="psub">Unofficial — request an official copy on the right.</div>
        <table class="acad"><thead><tr><th>Year</th><th>Term</th><th>Course</th><th>Grade</th></tr></thead>
        <tbody>${p.courses.map(c=>`<tr><td>${c.y}</td><td>${c.t}</td><td>${esc(c.name)}</td><td class="g">${c.g}</td></tr>`).join('')}</tbody></table></div>

      <div class="panel"><h2>College &amp; Career Checklist</h2><div class="psub">Class of ${p.gradYear} milestones</div>
        <div class="checklist">${cc.map(c=>`<div class="ck ${c.done?'':'todo'}"><span class="ico">${ICON(c.done?'file-check':'target',18)}</span>${c.label}<span class="meta">${c.meta}</span></div>`).join('')}</div></div>

      <div class="panel"><h2>Clubs &amp; Activities</h2>
        <div class="honors">${p.clubs.map(c=>`<span>${ICON('users',15)} ${esc(c)}</span>`).join('')}</div></div>`;
  }
  function alumniPanels(p){
    return `
      <div class="panel"><h2>Academic Record</h2>
        <div class="psub">Unofficial summary — request an official, sealed copy on the right.</div>
        <table class="acad"><thead><tr><th>Year</th><th>Term</th><th>Course</th><th>Grade</th></tr></thead>
        <tbody>${p.courses.map(c=>`<tr><td>${c.y}</td><td>${c.t}</td><td>${esc(c.name)}</td><td class="g">${c.g}</td></tr>`).join('')}</tbody></table></div>
      <div class="panel"><h2>Honors &amp; Recognition</h2>
        <div class="honors">${p.honors.map(h=>`<span>${ICON('award',15)} ${esc(h)}</span>`).join('')}
          ${p.diploma?`<span>${ICON('graduation-cap',15)} Diploma ${esc(p.diploma)}</span>`:''}</div></div>`;
  }
  function facultyPanels(p){
    return `
      <div class="panel" id="sections"><h2>My Classes</h2><div class="psub">${p.role} · ${esc(p.room)}</div>
        <table class="acad"><thead><tr><th>Period</th><th>Time</th><th>Course</th><th>Room</th><th>Students</th></tr></thead>
        <tbody>${p.sections.map(s=>`<tr><td>${s.per}</td><td>${s.time}</td><td>${esc(s.course)}</td><td>${s.room}</td><td class="g">${s.students||'—'}</td></tr>`).join('')}</tbody></table></div>

      <div class="panel"><h2>Today's Tasks</h2><div class="psub">Quick links to your daily tools</div>
        <div class="checklist">
          <div class="ck"><span class="ico">${ICON('clipboard-list',18)}</span>Take attendance for all periods<span class="meta">PowerSchool</span></div>
          <div class="ck"><span class="ico">${ICON('book-open',18)}</span>Post grades & assignments<span class="meta">Gradebook</span></div>
          <div class="ck"><span class="ico">${ICON('megaphone',18)}</span>Send family updates<span class="meta">ParentSquare</span></div>
          <div class="ck todo"><span class="ico">${ICON('puzzle',18)}</span>Update your department page<span class="meta">Emperor CMS</span></div>
        </div></div>`;
  }

  /* ---------- Aside per role ---------- */
  function aside(p){
    if(p.type==='faculty'){
      return `
        <div class="tr-card" style="border-top-color:var(--green)"><h3>Staff Resources</h3>
          <p>Your role: <b>${p.cmsRole}</b> in the Emperor CMS.</p>
          <a class="btn btn-primary" href="admin.html" target="_blank" style="width:100%;justify-content:center">${ICON('puzzle',17)} Open Emperor CMS</a></div>
        <div class="panel"><h2 style="font-size:1rem">Staff Links</h2>
          <div class="checklist">
            <div class="ck"><span class="ico">${ICON('calendar',17)}</span><a href="${SUBS}" target="_blank">Sub Finder / Absence</a></div>
            <div class="ck"><span class="ico">${ICON('file-check',17)}</span><a href="index.html#about">Payroll & HR</a></div>
            <div class="ck"><span class="ico">${ICON('briefcase',17)}</span><a href="index.html#about">Purchasing & Finance</a></div>
            <div class="ck"><span class="ico">${ICON('graduation-cap',17)}</span><a href="#">Professional Development</a></div>
          </div></div>`;
    }
    // student + alumni → transcript
    return `
      <div class="tr-card"><h3>Official Transcripts</h3>
        <p>Request a sealed, official transcript sent anywhere — college, employer, NCAA, or military. Tracked here for life.</p>
        <button class="btn btn-primary" id="reqTr" style="width:100%;justify-content:center">${ICON('file-check',17)} Request official transcript</button></div>
      <div class="panel"><h2 style="font-size:1rem">Request History</h2>
        <div class="psub" style="margin-bottom:.6rem">Every transcript you've ever requested.</div>
        <div class="req-list" id="reqList"></div></div>
      <div class="tr-card" style="border-top-color:var(--green)"><h3>${p.type==='alumni'?'Stay an Emperor':'College &amp; Career'}</h3>
        <p style="margin-bottom:.6rem">${p.type==='alumni'?('Class of '+p.gradYear+' updates, the alumni directory, and ways to give back.'):'Plan your path — A-G, CTE, and the College & Career Center.'}</p>
        <a class="btn btn-outline" href="${p.type==='alumni'?'index.html#news':'page.html#counseling'}" style="width:100%;justify-content:center">${p.type==='alumni'?'Alumni & News':'Open Counseling'}</a></div>`;
  }

  /* ---------- Auth gate ---------- */
  function renderAuth(){
    $('#navCta').innerHTML='';
    $('#mount').innerHTML=`
    <section class="auth"><div class="wrap">
      <div class="lead-row">
        <p class="eyebrow">Emperor ID</p>
        <h1>Your Emperor ID, for life.</h1>
        <p>One identity from your first day to your reunion. Students see grades, schedules and fees; staff reach their classes and tools; alumni return any time for their record and official transcripts.</p>
      </div>
      <div class="auth-grid">
        <div class="auth-card stud">
          <h3>Student / Staff</h3>
          <div class="ac-sub">Sign in with your district account — the same login you use every day.</div>
          <div class="sso">
            <button data-sso="student"><span class="dot" style="background:#4274f6">C</span> Student — sign in with Clever</button>
            <button data-sso="faculty"><span class="dot" style="background:#ea4335">G</span> Staff — sign in with Google</button>
          </div>
          <div class="demo-note">Demo — Clever signs you in as a sample student; Google as a sample teacher.</div>
        </div>
        <div class="auth-card alum">
          <h3>Alumni</h3>
          <div class="ac-sub">Graduated from Dinuba High? Verify your identity to unlock your lifelong record.</div>
          <div class="field"><label>Full name at graduation</label><input id="alName" placeholder="Maria Delgado"></div>
          <div class="field"><label>Graduation year</label><input id="alYear" placeholder="2009"></div>
          <div class="field"><label>Date of birth</label><input id="alDob" type="text" placeholder="MM / DD / YYYY"></div>
          <button class="btn btn-gold" id="alVerify" style="width:100%;justify-content:center">Verify &amp; send my sign-in link</button>
          <div class="demo-note">Demo — verification signs you in as a sample alum (Class of 2009).</div>
        </div>
      </div>
    </div></section>`;
    [...document.querySelectorAll('[data-sso]')].forEach(b=>b.onclick=()=>signIn(b.dataset.sso));
    $('#alVerify').onclick=()=>signIn('alumni');
  }

  /* ---------- Signed-in dashboard ---------- */
  function renderProfile(p){
    seedReqs(p);
    $('#navCta').innerHTML=`<button class="btn btn-outline" id="signOut">Sign out</button>`;
    const meta = p.type==='faculty'
      ? [['Emperor ID',p.emperorId],['Role',p.role],['Department','Science']]
      : [['Emperor ID',p.emperorId],[p.type==='alumni'?'Graduated':'Class of',p.gradYear],['Academy',p.academy]];
    const main = p.type==='faculty'?facultyPanels(p):p.type==='alumni'?alumniPanels(p):studentPanels(p);
    $('#mount').innerHTML=`
    <section class="profile-wrap"><div class="wrap">
      <div class="idcard">
        <div class="ic-top">
          <div class="avatar">${initials(p.name)}</div>
          <div class="who"><b>${esc(p.name)}</b><span class="status">${esc(p.status)}</span></div>
        </div>
        <div class="ic-meta">${meta.map(m=>`<div><span>${m[0]}</span><b>${esc(String(m[1]))}</b></div>`).join('')}</div>
      </div>

      ${launcher(p)}

      <div class="profile-grid">
        <div>
          <div class="tiles">${tiles(p).map(t=>`<div class="tile"><b>${t[0]}</b><span>${t[1]}</span></div>`).join('')}</div>
          ${main}
        </div>
        <aside class="aside-stick">${aside(p)}</aside>
      </div>
    </div></section>`;
    $('#signOut').onclick=signOut;
    [...document.querySelectorAll('[data-action="transcript"]')].forEach(a=>a.onclick=e=>{e.preventDefault();openTr(p);});
    const rt=$('#reqTr'); if(rt){rt.onclick=()=>openTr(p);renderReqs(p);}
  }

  function renderReqs(p){
    const list=$('#reqList'); if(!list)return;
    const reqs=loadReqs(p.emperorId)||[];
    if(!reqs.length){list.innerHTML='<div class="empty">No transcript requests yet.</div>';return;}
    list.innerHTML='';
    reqs.forEach(r=>{
      const st=STAGES[r.stage];const cls=r.stage===2?'sent':r.stage===1?'proc':'req-ed';
      list.appendChild(el('div','req',
        `<div class="rtop"><b>${esc(r.to)}</b><span class="badge-st ${cls}">${st}</span></div>
         <div class="when">${esc(r.how)} · ${r.n} cop${r.n>1?'ies':'y'} · ${r.date}</div>
         <div class="steps">${[0,1,2].map(i=>`<i class="${i<=r.stage?'on':''}"></i>`).join('')}</div>`));
    });
  }

  /* ---------- Transcript request modal ---------- */
  let curP=null;
  function openTr(p){curP=p;$('#trScrim').classList.add('on');}
  function closeTr(){$('#trScrim').classList.remove('on');}
  $('#trCancel').onclick=closeTr;
  $('#trScrim').onclick=e=>{if(e.target.id==='trScrim')closeTr();};
  $('#trSubmit').onclick=()=>{
    const to=$('#trTo').value, who=$('#trWho').value.trim(), how=$('#trHow').value, n=Math.max(1,+$('#trN').value||1);
    const reqs=loadReqs(curP.emperorId)||[];
    reqs.unshift({to:who||to, how, n, date:new Date().toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}), stage:0});
    saveReqs(curP.emperorId,reqs);
    closeTr();renderReqs(curP);
    window.open(SCRIBORDER,'_blank','noopener');
  };

  function render(){
    const k=session();const p=k&&IDENTITIES[k];
    if(p)renderProfile(p); else renderAuth();
  }

  render();
  if(window.EmperorAI) window.EmperorAI.init(window.DHS_SEED);
})();
