/* =============================================================================
   Dinuba High School — Shared Content Model (single source of truth)
   -----------------------------------------------------------------------------
   This object IS the contract between the two halves of the build:
     • Part 1 (public site, site.js)  READS this model and renders the front-end.
     • Part 2 (Emperor CMS, admin.js) WRITES this model and live-previews changes.
   In production this is a database (Postgres) exposed through a headless API.
   Here it is seeded in localStorage so the prototype is fully self-contained and
   demonstrates the read/write relationship with zero backend and zero API cost.
   ========================================================================== */
window.DHS_SEED = {
  meta: {
    name: "Dinuba High School",
    mascot: "Emperors",
    motto: "Excellence · Maturity · Perseverance · Safety",
    mottoKey: "EMPS",
    established: 1903,
    address: "490 W. Kamm Avenue, Dinuba, CA 93618",
    phone: "559-595-7220",
    fax: "559-596-2019",
    principal: "Administration",
    district: "Dinuba Unified School District",
    colors: { green: "#127a3c", greenDeep: "#0b4f27", gold: "#c9a24b", steel: "#aeb6bd" }
  },

  stats: [
    { value: "2,131", label: "Emperors enrolled" },
    { value: "97%", label: "Graduation rate" },
    { value: "24+", label: "CTE pathways" },
    { value: "2", label: "Four-year academies" }
  ],

  /* Rotating hero — the CMS edits slide order, headline, image, and CTA. */
  hero: [
    { tag: "Class of 2026", title: "Congratulations, Emperors.", text: "Commencement June 2026 — a legacy 123 years in the making.", img: "assets/img/grad-2025.jpg", cta: "Graduation Info", href: "#events" },
    { tag: "Emperor Nation", title: "Enter Emperor Nation.", text: "Forms, eligibility, and schedules for every sport — all in one place.", img: "assets/img/hero-sports.jpg", cta: "Athletics", href: "#athletics" },
    { tag: "Now Enrolling", title: "Become an Emperor.", text: "New-student enrollment for 2026–2027 is open. Start the process today.", img: "assets/img/admin-bldg.jpg", cta: "Enroll Now", href: "#enroll" }
  ],

  /* Top utility links — the daily-use destinations students/parents/staff hit. */
  quickLinks: [
    { label: "PowerSchool", icon: "graduation-cap", href: "https://dinuba.powerschool.com/public/home.html", ext: true },
    { label: "Clever", icon: "key-round", href: "#", ext: true },
    { label: "Daily Bulletin", icon: "megaphone", href: "#bulletin" },
    { label: "Bell Schedules", icon: "bell", href: "#bell" },
    { label: "ParentSquare", icon: "message-circle", href: "#", ext: true },
    { label: "DHS ASB", icon: "landmark", href: "http://www.dhsasb.com/", ext: true },
    { label: "Lunch Menus", icon: "apple", href: "#", ext: true },
    { label: "Records & Transcripts", icon: "file-text", href: "profile.html" }
  ],

  news: [
    { id: "n1", cat: "Athletics", title: "Athletic Senior Night", date: "2026-06-20", img: "assets/img/football.jpg", excerpt: "Honoring our graduating senior athletes across every program. Ceremony times by sport inside.", pinned: true },
    { id: "n2", cat: "Agriculture", title: "Ag Department Newsletters", date: "2026-06-18", img: "assets/img/campus-mountains.jpg", excerpt: "FFA results, SAE projects, and the spring plant sale recap from the Ag program." },
    { id: "n3", cat: "Business", title: "2026 Million Dollar Club", date: "2026-06-15", img: "assets/img/admin-bldg.jpg", excerpt: "Seniors who earned $1M+ in combined scholarship offers. A record-setting cohort." },
    { id: "n4", cat: "Fine Arts", title: "Band at the Big Fresno Fair", date: "2026-06-10", img: "assets/img/band.png", excerpt: "The Emperor Regiment takes the field — field show, photos, and the fall competition slate." },
    { id: "n5", cat: "Safety", title: "See Something, Say Something", date: "2026-06-05", img: "assets/img/emperor-nation.jpg", excerpt: "Our anonymous reporting system keeps Emperor Nation safe. How and when to use it." },
    { id: "n6", cat: "Counseling", title: "College & Career Newsletters", date: "2026-06-01", img: "assets/img/grad-2025.jpg", excerpt: "FAFSA deadlines, scholarship rounds, and CTE certification dates for the College & Career Center." }
  ],

  /* 18 departments + the two flagship four-year academies (academy:true). */
  departments: [
    { id: "ag", name: "Agriculture", academy: true, icon: "sprout", blurb: "FFA, plant & animal science, ag mechanics, and the Valley's grape heritage — a four-year academy pathway." },
    { id: "firefighting", name: "Fire Fighting", academy: true, icon: "flame", blurb: "A four-year fire-science academy with live-fire training, EMR prep, and a direct line to first-responder careers." },
    { id: "njrotc", name: "NJROTC", icon: "anchor", blurb: "Naval Junior ROTC — leadership, citizenship, drill, and physical training." },
    { id: "ame", name: "Arts, Media & Entertainment", icon: "clapperboard", blurb: "DETV broadcast, digital media, and the Emperor Grapevine student newsroom." },
    { id: "business", name: "Business", icon: "briefcase", blurb: "Finance, marketing, entrepreneurship, and the Million Dollar Club." },
    { id: "industrial", name: "Industrial Arts", icon: "wrench", blurb: "Welding, construction, and engineering technology." },
    { id: "cfn", name: "Child, Foods & Nutrition", icon: "utensils-crossed", blurb: "Culinary arts, nutrition science, and child development." },
    { id: "teachered", name: "Teacher Education", icon: "graduation-cap", blurb: "Grow-your-own pathway introducing students to careers in education." },
    { id: "english", name: "English", icon: "book-open", blurb: "Literature, composition, and AP Language & Literature." },
    { id: "math", name: "Mathematics", icon: "ruler", blurb: "Algebra through AP Calculus and Statistics." },
    { id: "science", name: "Science", icon: "flask-conical", blurb: "Biology, chemistry, physics, and AP sciences." },
    { id: "social", name: "Social Science", icon: "globe", blurb: "World & U.S. history, government, economics, and AP courses." },
    { id: "language", name: "Modern Language", icon: "languages", blurb: "Spanish language and culture across all levels." },
    { id: "eld", name: "ELD", icon: "message-square", blurb: "English Language Development for multilingual learners." },
    { id: "finearts", name: "Fine Arts", icon: "music", blurb: "Band, choir, visual art, and the Emperor Regiment." },
    { id: "pe", name: "Physical Education", icon: "activity", blurb: "Fitness, team sports, and lifelong wellness." },
    { id: "leadership", name: "Leadership", icon: "landmark", blurb: "ASB, class councils, and campus activities." },
    { id: "ocs", name: "OCS — Strategies for Success", icon: "target", blurb: "Organizational and study strategies for student success." },
    { id: "support", name: "Academic Support", icon: "life-buoy", blurb: "Tutoring, intervention, and resource support." }
  ],

  athletics: {
    intro: "Emperor Nation competes across the Central Section. Eligibility, forms, and schedules live here.",
    sports: ["Football","Volleyball","Cross Country","Soccer","Basketball","Wrestling","Baseball","Softball","Track & Field","Swimming","Tennis","Golf"],
    links: [
      { label: "Entering Emperor Nation", href: "#" },
      { label: "Sports Forms", href: "#" },
      { label: "Athletic Schedules", href: "#" },
      { label: "Coaches List", href: "#" }
    ]
  },

  counseling: {
    intro: "The Counseling team supports every Emperor academically, in college & career planning, and social-emotionally.",
    cards: [
      { title: "College & Career Center", text: "A-G course list, college readiness, CSF, and college exam prep." },
      { title: "CTE & Career Readiness", text: "24+ pathways, apprenticeships, and industry certifications." },
      { title: "Military & Post-Secondary", text: "Enlistment, academies, trade schools, and additional options." },
      { title: "Social-Emotional Support", text: "Wellness resources and counseling for every student." }
    ]
  },

  events: [
    { date: "2026-06-12", title: "Senior Commencement", where: "Claud Hatch Stadium", time: "8:00 PM" },
    { date: "2026-08-13", title: "First Day of School 2026–27", where: "Campus", time: "8:00 AM" },
    { date: "2026-08-29", title: "Football vs. Selma", where: "Claud Hatch Stadium", time: "7:30 PM" },
    { date: "2026-09-05", title: "Back-to-School Night", where: "Campus", time: "6:00 PM" }
  ],

  bell: {
    note: "Regular Day schedule. Minimum, Rally, and Finals schedules available in the CMS.",
    periods: [
      { p: "Period 1", t: "8:00 – 8:55" },
      { p: "Period 2", t: "9:01 – 9:56" },
      { p: "Period 3", t: "10:02 – 10:57" },
      { p: "Brunch", t: "10:57 – 11:07" },
      { p: "Period 4", t: "11:13 – 12:08" },
      { p: "Lunch", t: "12:08 – 12:43" },
      { p: "Period 5", t: "12:49 – 1:44" },
      { p: "Period 6", t: "1:50 – 2:45" },
      { p: "Period 7", t: "2:51 – 3:46" }
    ]
  },

  staff: [
    { name: "Principal", role: "Principal", dept: "Administration", email: "principal@dinuba.k12.ca.us" },
    { name: "Assistant Principal — Curriculum", role: "Assistant Principal", dept: "Administration", email: "ap1@dinuba.k12.ca.us" },
    { name: "Assistant Principal — Discipline", role: "Assistant Principal", dept: "Administration", email: "ap2@dinuba.k12.ca.us" },
    { name: "Athletic Director", role: "Athletic Director", dept: "Athletics", email: "ad@dinuba.k12.ca.us" },
    { name: "Lead Counselor", role: "Counselor (A–G)", dept: "Counseling", email: "counselor1@dinuba.k12.ca.us" },
    { name: "College & Career Tech", role: "College & Career Center", dept: "Counseling", email: "ccc@dinuba.k12.ca.us" },
    { name: "Ag Academy Lead", role: "Department Chair", dept: "Agriculture", email: "ag@dinuba.k12.ca.us" },
    { name: "Fire Science Lead", role: "Department Chair", dept: "Fire Fighting", email: "fire@dinuba.k12.ca.us" },
    { name: "English Chair", role: "Department Chair", dept: "English", email: "english@dinuba.k12.ca.us" },
    { name: "Math Chair", role: "Department Chair", dept: "Mathematics", email: "math@dinuba.k12.ca.us" },
    { name: "Science Chair", role: "Department Chair", dept: "Science", email: "science@dinuba.k12.ca.us" },
    { name: "Band Director", role: "Director", dept: "Fine Arts", email: "band@dinuba.k12.ca.us" },
    { name: "NJROTC Instructor", role: "Senior Naval Instructor", dept: "NJROTC", email: "njrotc@dinuba.k12.ca.us" },
    { name: "Front Office Secretary", role: "Attendance & Records", dept: "Administration", email: "office@dinuba.k12.ca.us" }
  ],

  /* ---- Interior-page detail (the deep layers). Renderer falls back to a
     generated course list for any department without an explicit entry. ---- */
  deptDetail: {
    ag: { lead: "Mr. Ramirez", email: "ag@dinuba.k12.ca.us", room: "Ag Farm / Rooms 60–64", img: "assets/img/campus-mountains.jpg",
      pathway: "Four-Year Academy · CTE Pathway",
      intro: "A four-year academy rooted in the Valley's grape heritage. Students earn industry certifications, lead FFA, and run real Supervised Agricultural Experience (SAE) projects.",
      courses: ["Intro to Agriculture","Agriculture Biology","Animal Science","Plant & Soil Science","Ag Mechanics & Welding","Ag Leadership (FFA)","Veterinary Science","Floral Design"],
      highlights: ["State-recognized FFA chapter","School farm & livestock","Spring plant sale","Articulated college credit"] },
    firefighting: { lead: "Capt. Torres", email: "fire@dinuba.k12.ca.us", room: "Fire Science Lab", img: "assets/img/admin-bldg.jpg",
      pathway: "Four-Year Academy · CTE Pathway",
      intro: "A four-year fire-science academy with live-fire training, EMR preparation, and a direct line into first-responder careers and the academy.",
      courses: ["Fire Science 1–4","Emergency Medical Responder (EMR)","Wildland Fire Behavior","Hazardous Materials Awareness","Physical Training & Drill","Fire Service Career Prep"],
      highlights: ["Live-fire training props","EMR certification track","Cal Fire / academy pipeline","Turnout-gear & SCBA practice"] },
    njrotc: { lead: "Senior Naval Instructor", email: "njrotc@dinuba.k12.ca.us", room: "NJROTC Building", img: "assets/img/football.jpg",
      pathway: "CTE · Leadership",
      intro: "Naval Junior ROTC builds leadership, citizenship, and discipline through classroom study, physical training, and drill.",
      courses: ["Naval Science 1–4","Leadership & Citizenship","Drill & Ceremony","Physical Training","Naval History & Navigation"],
      highlights: ["Color guard & drill team","Community service","Orienteering & athletics","Scholarship opportunities"] },
    ame: { lead: "Media Arts Lead", email: "ame@dinuba.k12.ca.us", room: "Media Lab / DETV Studio", img: "assets/img/band.png",
      pathway: "CTE Pathway",
      intro: "Tell the Emperors' story. Students run DETV broadcasts and the Emperor Grapevine newsroom while building digital media and design skills.",
      courses: ["Digital Photography","Video Production (DETV)","Graphic Design","Journalism (Emperor Grapevine)","Audio Production","Yearbook"],
      highlights: ["Student-run DETV broadcast","Emperor Grapevine newspaper","Adobe Certified Professional prep","Real client design projects"] },
    business: { lead: "Business Chair", email: "business@dinuba.k12.ca.us", room: "Rooms 30–34", img: "assets/img/admin-bldg.jpg",
      pathway: "CTE Pathway",
      intro: "Finance, marketing, and entrepreneurship — home of the Million Dollar Club. Students leave with real-world business and money skills.",
      courses: ["Intro to Business","Marketing","Accounting","Entrepreneurship","Personal Finance","Computer Applications"],
      highlights: ["2026 Million Dollar Club","Business plan competitions","Work-based learning","Industry certifications"] },
    industrial: { lead: "Industrial Arts Chair", email: "industrial@dinuba.k12.ca.us", room: "Shops 50–52", img: "assets/img/hero-sports.jpg",
      pathway: "CTE Pathway",
      intro: "Build it. Welding, construction, and engineering technology with hands-on, project-based learning.",
      courses: ["Woodworking","Welding 1–2","Construction Technology","Engineering Technology","CAD & Drafting","Metal Fabrication"],
      highlights: ["Welding certification","Project-based builds","Articulated college credit","Industry-grade shop"] },
    cfn: { lead: "FCS Chair", email: "cfn@dinuba.k12.ca.us", room: "FCS Kitchen Lab", img: "assets/img/campus-mountains.jpg",
      pathway: "CTE Pathway",
      intro: "Culinary arts, nutrition science, and child development in working kitchen and preschool labs.",
      courses: ["Foods & Nutrition","Culinary Arts","Child Development","Careers with Children","Baking & Pastry"],
      highlights: ["ServSafe preparation","On-campus preschool lab","Culinary competitions","Nutrition science"] },
    teachered: { lead: "Teacher Ed Lead", email: "teachered@dinuba.k12.ca.us", room: "Room 22", img: "assets/img/grad-2025.jpg",
      pathway: "CTE Pathway · Grow-Your-Own",
      intro: "A grow-your-own pathway introducing students to careers in education through real classroom internships.",
      courses: ["Intro to Education","Child & Adolescent Development","Teaching Internship","Careers in Education"],
      highlights: ["Classroom internships","Dual-enrollment credit","Pathway to teaching credential","Local district partnership"] },
    english: { lead: "English Chair", email: "english@dinuba.k12.ca.us", room: "Rooms 40–48", img: "assets/img/grad-2025.jpg",
      pathway: "Core · A-G",
      intro: "Reading, writing, and analysis from English 9 through AP — building the communication skills every Emperor needs.",
      courses: ["English 9","English 10","English 11","Expository Reading & Writing (ERWC)","AP English Language","AP English Literature"],
      highlights: ["ERWC senior course","AP Language & Literature","Writing center support","Emperor Grapevine ties"] },
    math: { lead: "Math Chair", email: "math@dinuba.k12.ca.us", room: "Rooms 10–18", img: "assets/img/admin-bldg.jpg",
      pathway: "Core · A-G",
      intro: "Integrated Math through AP Calculus and Statistics, with a tutoring lab for every level.",
      courses: ["Integrated Math 1","Integrated Math 2","Integrated Math 3","Pre-Calculus","AP Calculus AB","AP Statistics"],
      highlights: ["AP Calculus & Statistics","Math tutoring lab","Articulated college credit","College-readiness focus"] },
    science: { lead: "Science Chair", email: "science@dinuba.k12.ca.us", room: "Science Wing", img: "assets/img/campus-mountains.jpg",
      pathway: "Core · A-G",
      intro: "NGSS-aligned biology, chemistry, and physics with AP options and real lab investigation.",
      courses: ["Biology","Chemistry","Physics","AP Biology","AP Chemistry","Anatomy & Physiology"],
      highlights: ["NGSS lab investigations","AP sciences","Anatomy & Physiology","Field study opportunities"] },
    social: { lead: "Social Science Chair", email: "social@dinuba.k12.ca.us", room: "Rooms 70–78", img: "assets/img/emperor-nation.jpg",
      pathway: "Core · A-G",
      intro: "World and U.S. history, government, and economics — with AP offerings and a civics focus.",
      courses: ["World History","U.S. History","Government","Economics","AP U.S. History","AP Government & Politics"],
      highlights: ["AP history & government","Civics & mock trial","Current-events analysis","College-readiness writing"] },
    language: { lead: "World Language Chair", email: "language@dinuba.k12.ca.us", room: "Rooms 80–84", img: "assets/img/campus-mountains.jpg",
      pathway: "Core · A-G",
      intro: "Spanish language and culture across all levels, including a track for heritage speakers and the Seal of Biliteracy.",
      courses: ["Spanish 1","Spanish 2","Spanish 3","AP Spanish Language","Spanish for Heritage Speakers"],
      highlights: ["State Seal of Biliteracy","AP Spanish Language","Heritage-speaker track","Cultural celebrations"] },
    eld: { lead: "ELD Coordinator", email: "eld@dinuba.k12.ca.us", room: "Rooms 26–28", img: "assets/img/grad-2025.jpg",
      pathway: "Support",
      intro: "English Language Development supporting multilingual learners toward reclassification and full access to the curriculum.",
      courses: ["ELD 1","ELD 2","ELD 3","Designated ELD","Integrated ELD Support"],
      highlights: ["Newcomer support","Reclassification pathway","Bilingual instructional aides","Family engagement"] },
    finearts: { lead: "Band Director", email: "band@dinuba.k12.ca.us", room: "Band Room / Art Studio", img: "assets/img/band.png",
      pathway: "Visual & Performing Arts · A-G",
      intro: "Home of the Emperor Regiment — band, choir, and visual art that perform and compete across the Valley.",
      courses: ["Concert Band","Marching Band (Emperor Regiment)","Choir","Visual Art","Ceramics","Drama"],
      highlights: ["Emperor Regiment marching band","Big Fresno Fair competition","Choir & vocal ensembles","Student art shows"] },
    pe: { lead: "PE Chair", email: "pe@dinuba.k12.ca.us", room: "Gym & Athletic Fields", img: "assets/img/football.jpg",
      pathway: "Graduation Requirement",
      intro: "Fitness, team sports, and lifelong wellness — plus strength and conditioning for Emperor athletes.",
      courses: ["PE 9","PE 10","Weight Training","Team Sports","Lifetime Fitness"],
      highlights: ["State fitness testing","Strength & conditioning","Team-sport units","Wellness education"] },
    leadership: { lead: "ASB Advisor", email: "leadership@dinuba.k12.ca.us", room: "Student Union", img: "assets/img/hero-sports.jpg",
      pathway: "Elective",
      intro: "ASB, class councils, and campus activities — the students who power Emperor spirit and service.",
      courses: ["ASB Leadership","Class Council","Activities & Events","Peer Mentoring"],
      highlights: ["Associated Student Body (ASB)","Rallies & spirit weeks","Community service drives","Homecoming & events"] },
    ocs: { lead: "OCS Lead", email: "ocs@dinuba.k12.ca.us", room: "Room 24", img: "assets/img/admin-bldg.jpg",
      pathway: "Support",
      intro: "Organizational and study strategies that help students take ownership of their learning and stay on track.",
      courses: ["Strategies for Success","Study Skills","Organizational Strategies","Academic Support"],
      highlights: ["Organization coaching","Study-strategy instruction","Goal-setting","Progress monitoring"] },
    support: { lead: "Intervention Lead", email: "support@dinuba.k12.ca.us", room: "Library / Resource Center", img: "assets/img/campus-mountains.jpg",
      pathway: "Support",
      intro: "Tutoring, intervention, and resource support so every Emperor has what they need to succeed.",
      courses: ["Academic Intervention","Reading Support","Math Support","Tutoring Lab"],
      highlights: ["Peer & teacher tutoring","Targeted intervention","Credit recovery","Resource Center access"] }
  },

  athleticsSchedule: [
    { date: "2026-08-29", sport: "Football", opp: "Selma", site: "Home", time: "7:30 PM" },
    { date: "2026-09-05", sport: "Volleyball", opp: "Hanford", site: "Away", time: "6:00 PM" },
    { date: "2026-09-09", sport: "Girls Tennis", opp: "Reedley", site: "Home", time: "3:30 PM" },
    { date: "2026-09-12", sport: "Football", opp: "Tulare Western", site: "Away", time: "7:30 PM" },
    { date: "2026-09-16", sport: "Cross Country", opp: "EYL Cluster Meet", site: "Away", time: "4:00 PM" },
    { date: "2026-09-19", sport: "Football", opp: "Kingsburg", site: "Home", time: "7:30 PM" }
  ],

  coaches: [
    { name: "Head Football Coach", sport: "Football", email: "fb@dinuba.k12.ca.us" },
    { name: "Head Volleyball Coach", sport: "Volleyball", email: "vb@dinuba.k12.ca.us" },
    { name: "Head Basketball Coach", sport: "Basketball", email: "bb@dinuba.k12.ca.us" },
    { name: "Head Wrestling Coach", sport: "Wrestling", email: "wr@dinuba.k12.ca.us" },
    { name: "Head Baseball Coach", sport: "Baseball", email: "base@dinuba.k12.ca.us" },
    { name: "Head Track Coach", sport: "Track & Field", email: "track@dinuba.k12.ca.us" }
  ],

  counselingPages: [
    { title: "College & Career Center", intro: "Your hub for A-G planning, applications, scholarships, and exams.",
      links: ["A-G Course List","College Readiness","California Scholarship Federation (CSF)","College Exams (SAT/ACT)"] },
    { title: "CTE & Career Readiness", intro: "24+ pathways connecting classroom to career.",
      links: ["Career Technical Education","Apprenticeships","Industry Certifications","Work-Based Learning"] },
    { title: "Military & Post-Secondary", intro: "Every path after Dinuba High.",
      links: ["Military Enlistment & Academies","Trade & Technical Schools","Community College","Additional Options"] },
    { title: "Social-Emotional Support", intro: "Wellness and counseling for every Emperor.",
      links: ["Wellness Resources","Crisis Support","Say Something Reporting","Counselor Appointments"] }
  ]
};
