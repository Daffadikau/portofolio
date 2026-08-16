window.PORTFOLIO_DATA = {
  name: 'DAFFA ADIKA',
  fullName: 'Muhammad Daffa Adika Utama',
  role: 'Computer Engineering Student · AI & Fullstack Developer',
  location: 'Bandung, West Java, Indonesia',
  status: 'Open to opportunities',
  bio: 'Computer Engineering student at Universitas Pendidikan Indonesia (UPI), concentrating in Intelligent Device Development. I build AI-powered systems, fullstack web apps, and IoT solutions — with a focus on impactful technology for social and environmental challenges.',
  availability: 'Open to internships, freelance, and collaboration.',
  replyNote: 'I usually reply within 24-48 hours.',
  character: {
    class: 'AI × Fullstack Adventurer',
    level: 6,
    levelLabel: 'semester',
    partner: {
      name: 'Smoky',
      species: 'Neko Atsume regular cat',
      japanese: 'くろねこさん "Black Cat"',
      appearance: 'Solid Black',
      personality: 'Hot and Cold',
      powerLevel: 140,
      memento: 'Soft Brush',
    },
  },
  // sampul dibuat Dikau sendiri via giventofly.github.io/pixelit
  musicPlaylist: 'https://sptfy.bio/dikau',
  music: [
    { title: 'Chanel', artist: 'Frank Ocean', cover: 'assets/covers/chanel.png', sid: '6Nle9hKrkL1wQpwNfEkxjh' },
    { title: 'Going to Babble On', artist: 'The Strokes', cover: 'assets/covers/bable-on.png', sid: '2nxsLJwW4eFDwl36fUQJWe' },
    { title: 'Juna', artist: 'Clairo', cover: 'assets/covers/juna.png', sid: '2mWfVxEo4xZYDaz0v7hYrN' },
  ],
  education: {
    school: 'Universitas Pendidikan Indonesia (UPI)',
    program: 'Computer Engineering',
    detail: '2023–2027 (expected) · GPA 3.65/4.00 · concentration: Intelligent Device Development',
  },
  socials: {
    email: 'daffadikau@gmail.com',
    github: 'https://github.com/Daffadikau',
    linkedin: 'https://www.linkedin.com/in/daffadikau/',
  },
  // value/max dipakai bar di layar status Tamagotchi (tab About).
  // number tetap dipertahankan karena itu yang ditampilkan apa adanya.
  stats: [
    { number: '3.65', label: 'GPA (of 4.00)', short: 'GPA', value: 3.65, max: 4 },
    { number: '15+', label: 'Licenses & Certificates', short: 'CERT', value: 15, max: 20 },
    { number: '7', label: 'Awards', short: 'AWRD', value: 7, max: 10 },
  ],
  projects: [
    {
      title: 'CBRN Drone Monitoring',
      desc: 'Real-time CBRN (Chemical, Biological, Radiological, Nuclear) monitoring platform for UAVs at PT IROSTECH — backend for high-frequency sensor telemetry, low-latency drone-to-command-center streams, AI-driven hazard detection.',
      tech: [
        { label: 'Backend', icon: 'node' }, { label: 'AI Analytics', icon: 'py' },
        { label: 'IoT Telemetry', icon: null },
      ],
      links: [],
    },
    {
      title: 'TestKit Gas Monitor',
      desc: 'Real-time IoT gas monitoring platform: sensor ingestion API, live dashboard with charts and alerting, time-series storage, Dockerized VPS deployment.',
      tech: [
        { label: 'FastAPI', icon: 'py' }, { label: 'Next.js', icon: 'next' },
        { label: 'TimescaleDB', icon: 'sql' }, { label: 'Docker', icon: 'docker' },
      ],
      links: [],
    },
    {
      title: 'BengkelBot',
      desc: 'AI chatbot for auto repair shops — answers service questions and guides bookings. Final project of the Hacktiv8 "Maju Bareng AI" program.',
      tech: [
        { label: 'Gemini API', icon: null }, { label: 'Node.js', icon: 'node' },
        { label: 'JavaScript', icon: 'js' },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau/bengkelbot' }],
    },
    {
      title: 'OMR Automated Grading',
      desc: 'AI answer-sheet grading app (Intelligent Device Systems, graded 4.00/4.00) — pattern recognition + image preprocessing, 99.7% accuracy, cuts manual grading time by 90%.',
      tech: [
        { label: 'YOLO', icon: null }, { label: 'Python', icon: 'py' },
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
    {
      title: 'Trias Bakti MSME Platform',
      desc: 'Web platform digitalizing MSMEs in Drawati Village — backend services, database schemas for inventory & transactions, full SRS documentation, and onboarding for local stakeholders.',
      tech: [
        { label: 'Backend', icon: 'php' }, { label: 'SQL', icon: 'sql' },
        { label: 'Systems Design', icon: null },
      ],
      links: [],
    },
    {
      title: 'Mentorly',
      desc: 'Cross-platform mobile mentoring platform with 2FA, RBAC, AES-256 encryption, real-time chat, payments, and mentor ratings. Published in Jurnal Informatika Teknologi dan Sains.',
      tech: [
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
        { label: 'PHP', icon: 'php' },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
    {
      title: 'Kuai DryVault',
      desc: 'IoT shoe-drying cabinet for a local shoe laundry: ESP32 with temperature & humidity sensors automating airflow and heating, Flutter app with Firebase realtime monitoring.',
      tech: [
        { label: 'ESP32', icon: 'c' }, { label: 'IoT', icon: null },
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
  ],
  skills: [
    { group: 'Languages', items: [
      { label: 'Python', icon: 'py', level: 4 }, { label: 'TypeScript', icon: 'ts', level: 4 },
      { label: 'JavaScript', icon: 'js', level: 4 }, { label: 'Dart', icon: 'dart', level: 4 },
      { label: 'PHP', icon: 'php', level: 3 }, { label: 'SQL', icon: 'sql', level: 4 },
    ]},
    { group: 'Web & Mobile', items: [
      { label: 'HTML/CSS', icon: 'html', level: 5 }, { label: 'React', icon: 'jsx', level: 3 },
      { label: 'Next.js', icon: 'next', level: 3 }, { label: 'Node.js', icon: 'node', level: 4 },
      { label: 'FastAPI', icon: 'py', level: 4 }, { label: 'Flutter', icon: 'dart', level: 4 },
    ]},
    { group: 'AI & Data', items: [
      { label: 'Machine Learning', icon: null, level: 4 }, { label: 'Computer Vision (YOLO)', icon: null, level: 4 },
      { label: 'Data Analysis', icon: null, level: 4 }, { label: 'Gemini API', icon: null, level: 3 },
    ]},
    { group: 'DevOps, Cloud & IoT', items: [
      { label: 'Git', icon: 'git', level: 4 }, { label: 'Docker', icon: 'docker', level: 4 },
      { label: 'AWS', icon: null, level: 3 }, { label: 'Azure', icon: null, level: 3 },
      { label: 'Linux/VPS', icon: 'shell', level: 4 }, { label: 'Microcontroller/IoT', icon: 'c', level: 4 },
    ]},
  ],
  experience: [
    {
      role: 'Backend Developer & AI Engineer Intern', org: 'PT IROSTECH Solusi Intelejen',
      period: 'Feb 2026 — Aug 2026',
      points: [
        'Building a real-time CBRN monitoring platform for UAV/drone surveillance.',
        'Engineering backend architecture for high-frequency sensor telemetry with low-latency drone-to-command-center communication.',
        'Implementing AI-driven analytics for automated hazardous-material detection.',
      ],
    },
    {
      role: 'Staff of Research and Creativity', org: 'Rumah Prestasi Kemahasiswaan UPI',
      period: 'Jan 2026 — now',
      points: [
        'Curating and mentoring student digital-innovation projects for the national LIDM competition.',
        'Reviewing research methodologies and system architectures against national competition standards.',
      ],
    },
    {
      role: 'Service to Society Dept (P2M) Head of Staff', org: 'HIMA TEKKOM UPI',
      period: 'Jan 2025 — Jan 2026',
      points: [
        'Orchestrated BASKOM, a flagship social program — mobilized and distributed IDR 5,000,000+ in humanitarian aid.',
        'Managed end-to-end fundraising for disaster relief (Bekasi floods, Sumatra) and orphanage support with transparent reporting.',
      ],
    },
    {
      role: 'Staff of Bakti Sosial', org: 'KSR PMI UPI (Indonesian Red Cross)',
      period: 'Sep 2024 — Jan 2026',
      points: [
        'First responder & field medic in emergency missions and disaster relief operations.',
        'Spearheaded a blood donation program with PMI Kabupaten Bandung — large-scale donor recruitment and logistics.',
      ],
    },
  ],
  // CV lengkap yang bisa diunduh dari tab About
  cv: {
    file: 'assets/cv-daffa-adika-utama.pdf',
    download: 'CV - Daffa Adika Utama.pdf',
    note: "If you're feeling nerdy, here's a much more detailed one.",
    label: 'Download CV (PDF)',
  },
  // isi meja kerja di tab About. Tiap benda jadi hotspot yang mengeluarkan
  // satu kalimat waktu di-hover/di-fokus.
  desk: [
    { icon: 'deskEsp', label: 'ESP32', fact: 'Reads the gas sensors, then throws the numbers at my backend.' },
    { icon: 'deskLaptop', label: 'Laptop', fact: 'zsh and oh-my-zsh on it. Most of the day happens in here.' },
    { icon: 'deskDrone', label: 'Drone', fact: 'The CBRN platform I build at IROSTECH flies on one of these.' },
    { icon: 'catSleep', label: 'Smoky', fact: 'Owns the warm spot next to the laptop. Non-negotiable.' },
    { icon: 'fish', label: 'Snack', fact: "His, not mine. That is the official position." },
    { icon: 'deskMug', label: 'Coffee', fact: 'Refuelling. The mug is older than most of my repos.' },
  ],
  // icon + rarity dipakai kartu Joker di tab About (rarity menentukan warna
  // pita bawah kartu, meniru sistem kelangkaan Balatro)
  awards: [
    {
      title: 'Best Department of the Year (P2M)', org: 'HIMA TEKKOM UPI', when: '2026',
      icon: 'awCup', rarity: 'rare', blurb: 'Ran the department that shipped the most.',
    },
    {
      title: '2nd Place (Silver Medal), National Digital Learning Video Competition (LIDM)',
      org: 'Ministry of Education', when: '2025',
      icon: 'awMedal', rarity: 'legendary', blurb: 'National stage. Silver, out of the whole country.',
    },
    {
      title: 'Best Biro of the Year (Pengabdian)', org: 'KSR PMI Unit UPI Kampus Cibiru', when: '2026',
      icon: 'awShield', rarity: 'rare', blurb: 'Community service, done properly for a full year.',
    },
    {
      title: '2nd Place Winner, Best UI/UX Front-End Design', org: 'HIMA UPI', when: '2025',
      icon: 'awPalette', rarity: 'rare', blurb: 'Design and front-end, judged together.',
    },
    {
      title: 'Staff of the Month (July)', org: 'KSR PMI Unit UPI Kampus Cibiru', when: '2025',
      icon: 'awStar', rarity: 'common', blurb: 'Showed up, every single time.',
    },
    {
      title: 'Biro of the Month (September)', org: 'KSR PMI Unit UPI Kampus Cibiru', when: '2025',
      icon: 'awRosette', rarity: 'common', blurb: 'Same energy, one month later.',
    },
    {
      title: 'Best Robotics and IT Student Program', org: 'SMAI PB Soedirman Bekasi', when: '2022',
      icon: 'awRobot', rarity: 'uncommon', blurb: 'Where the whole thing started.',
    },
  ],
};
