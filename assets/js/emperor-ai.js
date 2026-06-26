/* =============================================================================
   Emperor AI — Dinuba High School's branded campus assistant
   -----------------------------------------------------------------------------
   Persona: "Emperor AI" — a knowledgeable, encouraging campus guide for students,
   families, and staff. Speaks in the Emperors' voice (Excellence, Maturity,
   Perseverance, Safety).

   Cost posture: ZERO API. This is a local intent-matching engine grounded in the
   live site content model (the same object the CMS edits). In production the same
   widget swaps to a retrieval call against the school's own content — Sharemeister
   hosts the "Emperor AI" character on top of the school's CMS knowledge base.
   ========================================================================== */
window.EmperorAI = (function(){
  let C=null, started=false;
  const body=()=>document.getElementById('eaiBody');
  const chips=()=>document.getElementById('eaiChips');

  const QUICK=[
    "Get my transcript","How do I enroll?","Bell schedule","Sports & forms","College & Career",
    "Find a department","Contact the office","What are the school colors?"
  ];

  /* ---- Knowledge intents. Each: keywords + a reply builder grounded in C. ---- */
  const INTENTS=[
    {k:['enroll','enrollment','register','registration','new student','sign up','transfer'],
     r:()=>`Welcome to Emperor Nation! New-student enrollment for <b>2026–2027</b> is open. ` +
        `Start online, then bring proof of residency, immunization records, and a transcript to the front office at <b>${C.meta.address}</b>. ` +
        `Jump to <a href="#enroll">Enrollment</a> or call <a href="tel:5595957220">559-595-7220</a>.`},
    {k:['bell','schedule','time','start','period','what time','class times'],
     r:()=>`Here's the <b>Regular Day</b> bell schedule:<br>` +
        C.bell.periods.map(p=>`• <b>${p.p}</b> — ${p.t}`).join('<br>') +
        `<br><span style="color:#6b747c">Minimum, Rally & Finals schedules live in the office calendar.</span>`},
    {k:['sport','athletic','football','team','tryout','eligibility','emperor nation','coach','forms'],
     r:()=>`Emperor Nation competes in: ${C.athletics.sports.join(', ')}. ` +
        `For eligibility and tryouts you'll need your <b>sports forms</b> and a current physical on file. ` +
        `Start at <a href="#athletics">Athletics → Entering Emperor Nation</a>.`},
    {k:['college','career','counsel','scholarship','fafsa','a-g','cte','apprentice','military','financial aid'],
     r:()=>`The <b>College & Career Center</b> has you covered: A-G course list, college readiness, ` +
        `${C.counseling.cards.length} support tracks including CTE (24+ pathways), apprenticeships, and military options. ` +
        `Visit <a href="#counseling">Counseling</a> to connect with your counselor.`},
    {k:['academy','academies','agriculture','ag ','fire','firefighting','four-year','four year'],
     r:()=>`Dinuba High runs <b>two flagship four-year academies</b>: ` +
        `${ICON('sprout',14)} <b>Agriculture</b> (FFA, plant & animal science, ag mechanics) and ` +
        `${ICON('flame',14)} <b>Fire Fighting</b> (fire science, live-fire training, EMR prep). ` +
        `Both lead straight to careers and college credit. See <a href="#departments">Departments</a>.`},
    {k:['department','class','subject','program','course','major','study'],
     r:()=>`We have <b>${C.departments.length} departments</b>. A few: ` +
        C.departments.slice(0,6).map(d=>`${ICON(d.icon,14)} ${d.name}`).join(', ') +
        `… Filter the full list by Academies, CTE, or Core at <a href="#departments">Departments</a>.`},
    {k:['transcript','record','records','diploma','gpa','grades','alumni','alum','transfer record','my account','emperor id','profile','sign in','login'],
     r:()=>`Your <b>Emperor ID</b> is your record for life. Sign in to see your unofficial academic summary and <b>request an official transcript</b> (for college, work, NCAA, or the military) — current students <i>and</i> alumni. ` +
        `Open <a href="profile.html">your Emperor ID</a>. Official copies are issued by the Registrar; I'll route the request for you.`},
    {k:['contact','phone','address','office','email','call','where','location','map'],
     r:()=>`📍 <b>${C.meta.name}</b><br>${C.meta.address}<br>📞 <a href="tel:5595957220">${C.meta.phone}</a> · Fax ${C.meta.fax}<br>` +
        `Front office is the best first stop for any question I can't answer.`},
    {k:['color','mascot','emperor','motto','emps','about','history','tradition'],
     r:()=>`Our colors are <b>Emperor green</b> and white — the green is matched to a Valley grape leaf, a nod to Dinuba's Emperor-grape heritage. ` +
        `Mascot: the <b>Emperors</b> ⚔️. Our motto is <b>${C.meta.motto}</b> (${C.meta.mottoKey}).`},
    {k:['event','calendar','graduation','commencement','game','back to school','when'],
     r:()=>`Upcoming on the calendar:<br>` +
        C.events.slice(0,4).map(e=>`• <b>${e.title}</b> — ${new Date(e.date+'T00:00').toLocaleDateString('en-US',{month:'short',day:'numeric'})}, ${e.time}, ${e.where}`).join('<br>') +
        `<br>Full calendar under <a href="#events">Events</a>.`},
    {k:['news','bulletin','announcement','grapevine','detv','update'],
     r:()=>`Latest headlines:<br>` + C.news.slice(0,3).map(n=>`• <b>${n.title}</b> — ${n.cat}`).join('<br>') +
        `<br>More in <a href="#news">News & Announcements</a> and the Daily Bulletin.`},
    {k:['lunch','menu','food','cafeteria','breakfast','eat'],
     r:()=>`Daily breakfast & lunch menus are posted through the district nutrition portal — find it in <a href="#">Quick Links → Lunch Menus</a>. Brunch is 10:57–11:07 and lunch is 12:08–12:43.`},
    {k:['powerschool','grade','clever','login','portal','password','parentsquare'],
     r:()=>`Students & families log in through <b>PowerSchool</b> (grades & attendance) and <b>Clever</b> (class apps). Family messaging is on <b>ParentSquare</b>. All three are in the top Quick Links bar.`}
  ];

  const GREET=`👋 Hail, Emperor! I'm <b>Emperor AI</b>, your campus guide. ` +
    `Ask me about enrollment, bell schedules, sports, college & career, departments, events — anything Dinuba High. How can I help?`;
  const FALLBACK=()=>`I want to point you the right way. I can help with <b>enrollment, schedules, athletics, ` +
    `college & career, departments, events, and contacts</b>. Try one of the chips below, or call the office at ` +
    `<a href="tel:5595957220">559-595-7220</a>.`;

  function add(role,html,scroll){
    const m=document.createElement('div');m.className='msg '+role;m.innerHTML=html;
    body().appendChild(m);
    if(scroll!==false) body().scrollTop=body().scrollHeight;
    return m;
  }
  function match(q){
    const t=q.toLowerCase();let best=null,score=0;
    INTENTS.forEach(it=>{const s=it.k.reduce((a,k)=>a+(t.includes(k)?k.length:0),0);if(s>score){score=s;best=it;}});
    return score>0?best.r():FALLBACK();
  }
  function answer(q){
    add('me',q.replace(/</g,'&lt;'));
    const typing=add('bot','<span class="typing"><i></i><i></i><i></i></span>');
    setTimeout(()=>{typing.remove();add('bot',match(q));},480+Math.min(q.length*8,520));
  }
  function paintChips(){chips().innerHTML='';QUICK.forEach(q=>{const b=document.createElement('button');b.textContent=q;b.onclick=()=>answer(q);chips().appendChild(b);});}

  function open(){const p=document.getElementById('eaiPanel');p.classList.add('open');
    if(!started){started=true;setTimeout(()=>{add('bot',GREET,false);body().scrollTop=0;},200);paintChips();}
    document.getElementById('eaiInput').focus();}
  function close(){document.getElementById('eaiPanel').classList.remove('open');}

  return {
    init(content){C=content;
      document.getElementById('eaiFab').onclick=open;
      document.getElementById('eaiClose').onclick=close;
      const send=()=>{const i=document.getElementById('eaiInput');const v=i.value.trim();if(!v)return;i.value='';answer(v);};
      document.getElementById('eaiSend').onclick=send;
      document.getElementById('eaiInput').addEventListener('keydown',e=>{if(e.key==='Enter')send();});
    }
  };
})();
