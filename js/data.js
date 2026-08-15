window.PORTFOLIO_DATA = {
  name: 'DAFFA ADIKA',
  fullName: 'Muhammad Daffa Adika Utama',
  role: 'Computer Engineering Student · Fullstack Developer',
  location: 'Bandung, West Java, Indonesia',
  status: 'Open to opportunities',
  availability: 'Open to internships, freelance, and collaboration.',
  replyNote: 'I usually reply within 24-48 hours.',
  character: {
    class: 'Fullstack Adventurer',
    level: 6,
    levelLabel: 'semester',
    hearts: 4,
    interests: ['Tomodachi Life', 'Tamagotchi', 'Neko Atsume'],
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
  bio: 'Computer Engineering student at Universitas Pendidikan Indonesia (UPI) focused on bridging advanced technology and social impact. I build fullstack web apps, mobile apps, and IoT systems.',
  education: { school: 'Universitas Pendidikan Indonesia (UPI)', program: 'Computer Engineering', detail: '3rd year (6th semester)' },
  socials: {
    email: 'daffadikau@gmail.com',
    github: 'https://github.com/Daffadikau',
    linkedin: 'https://www.linkedin.com/in/daffadikau/',
  },
  stats: [
    { number: '3rd Year', label: 'Current Education' },
    { number: '15+', label: 'Licenses & Certificates' },
    { number: '7', label: 'Awards' },
  ],
  projects: [
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
      title: 'Mentorly',
      desc: 'Cross-platform mobile mentoring platform with 2FA, RBAC, AES-256 encryption, real-time chat, payments, and mentor ratings. Published in Jurnal Informatika Teknologi dan Sains.',
      tech: [
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
        { label: 'PHP', icon: 'php' },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
    {
      title: 'OMR Automated Grading',
      desc: 'AI answer-sheet grading with YOLOv11/YOLOv8 — 99.2% accuracy, hybrid cloud-mobile architecture, automated PDF/CSV analytics reports.',
      tech: [
        { label: 'YOLO', icon: null }, { label: 'Python', icon: 'py' },
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
    {
      title: 'Kuai DryVault',
      desc: 'IoT shoe-drying cabinet: ESP32 driving 14 DC fans via 8-channel relays, Flutter app with Firebase realtime monitoring, 87.4W optimized power draw. Published in Jurnal Ilmiah Pendidikan.',
      tech: [
        { label: 'ESP32', icon: 'c' }, { label: 'IoT', icon: null },
        { label: 'Flutter', icon: 'dart' }, { label: 'Firebase', icon: null },
      ],
      links: [{ label: 'GitHub', url: 'https://github.com/Daffadikau' }],
    },
  ],
  skills: [
    { group: 'Languages', items: [
      { label: 'JavaScript', icon: 'js', level: 4 }, { label: 'TypeScript', icon: 'ts', level: 3 },
      { label: 'Python', icon: 'py', level: 4 }, { label: 'Java', icon: 'java', level: 3 },
      { label: 'Dart', icon: 'dart', level: 4 }, { label: 'PHP', icon: 'php', level: 3 },
    ]},
    { group: 'Frontend', items: [
      { label: 'HTML', icon: 'html', level: 5 }, { label: 'CSS', icon: 'css', level: 4 },
      { label: 'React', icon: 'jsx', level: 3 }, { label: 'Vue', icon: 'vue', level: 3 },
      { label: 'Next.js', icon: 'next', level: 3 }, { label: 'Flutter', icon: 'dart', level: 4 },
    ]},
    { group: 'Backend', items: [
      { label: 'Node.js', icon: 'node', level: 4 }, { label: 'FastAPI', icon: 'py', level: 4 },
      { label: 'REST & GraphQL', icon: 'gql', level: 4 }, { label: 'SQL & NoSQL', icon: 'sql', level: 4 },
      { label: 'Firebase', icon: null, level: 4 },
    ]},
    { group: 'DevOps & Tools', items: [
      { label: 'Git', icon: 'git', level: 4 }, { label: 'Docker', icon: 'docker', level: 4 },
      { label: 'CI/CD', icon: null, level: 3 }, { label: 'Linux/VPS', icon: 'shell', level: 4 },
    ]},
  ],
  experience: [
    {
      role: 'Service to Society Dept (P2M) Head of Staff', org: 'HIMA TEKKOM UPI',
      period: 'Jan 2025 — Jan 2026',
      points: [
        'Led community service initiatives for the Computer Engineering student association.',
        'Managed planning and execution of social impact programs.',
      ],
    },
    {
      role: 'Community Service Staff', org: 'Palang Merah Indonesia (KSR PMI UPI)',
      period: 'Sep 2024 — Jan 2026',
      points: [
        'Volunteered with the university humanitarian corps.',
        'Provided emergency medical support and community services.',
      ],
    },
  ],
  awards: [
    { title: 'Best Department of the Year 2025', org: 'HIMA TEKKOM UPI', when: 'Jan 2026' },
    { title: '2nd Place (Silver Medal), National Digital Learning Video Competition (LIDM 2025)', org: 'Ministry of Education', when: 'Dec 2025' },
    { title: '2nd Place, Mobile App UI/UX Design Challenge', org: 'HIMA TEKKOM UPI', when: 'Dec 2025' },
    { title: 'Staff of the Month', org: 'KSR PMI UPI', when: 'Jul 2025' },
  ],
};
