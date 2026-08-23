import type { Localized } from '../types'

/* ── Navigation ── */
export interface NavLink {
  id: string
  label: Localized
}

export const SECTION_LINKS: NavLink[] = [
  { id: 'about',        label: { en: 'About',       ar: 'عني' } },
  { id: 'skills',       label: { en: 'Skills',      ar: 'مهاراتي' } },
  { id: 'experience',   label: { en: 'Experience',  ar: 'الخبرة' } },
  { id: 'projects',     label: { en: 'Projects',    ar: 'المشاريع' } },
  { id: 'games',        label: { en: 'Games',       ar: 'الألعاب' } },
  { id: 'team',         label: { en: 'Team',        ar: 'الفريق' } },
  { id: 'testimonials', label: { en: 'Reviews',     ar: 'آراء' } },
  { id: 'faq',          label: { en: 'FAQ',         ar: 'أسئلة' } },
  { id: 'contact',      label: { en: 'Contact',     ar: 'تواصل' } },
]

/* ── Typing effect strings ── */
export const TYPING_STRINGS: Record<'en' | 'ar', string[]> = {
  en: ['Senior Full Stack Developer', 'Laravel & React Expert', 'React Native Specialist', 'API Architect', 'Open Source Contributor'],
  ar: ['مطور Full Stack أول', 'خبير Laravel وReact', 'متخصص React Native', 'مهندس APIs', 'مساهم في المصادر المفتوحة'],
}

/* ── Hero stats ── */
export const HERO_STATS = [
  { value: 7,  suffix: '+', labelKey: 'statYears' },
  { value: 50, suffix: '+', labelKey: 'statProjects' },
  { value: 30, suffix: '+', labelKey: 'statClients' },
  { value: 39, suffix: '',  labelKey: 'statRepos' },
] as const

/* ── About chips ── */
export const ABOUT_CHIPS = [
  { value: 7,  suffix: '+', labelKey: 'chipYears' },
  { value: 50, suffix: '+', labelKey: 'chipProjects' },
  { value: 30, suffix: '+', labelKey: 'chipClients' },
  { value: 4,  suffix: '',  labelKey: 'chipCountries' },
] as const

/* ── Skills ── */
export type SkillIcon = 'monitor' | 'server' | 'phone' | 'cog'

export interface SkillCategory {
  icon: SkillIcon
  title: Localized
  skills: { name: string; level: number }[]
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    icon: 'monitor',
    title: { en: 'Frontend', ar: 'الواجهة الأمامية' },
    skills: [
      { name: 'React.js', level: 95 },
      { name: 'Next.js', level: 88 },
      { name: 'TypeScript', level: 85 },
      { name: 'Tailwind CSS', level: 92 },
    ],
  },
  {
    icon: 'server',
    title: { en: 'Backend', ar: 'الخلفية' },
    skills: [
      { name: 'Laravel', level: 96 },
      { name: 'Node.js', level: 88 },
      { name: 'Python', level: 78 },
      { name: 'GraphQL', level: 82 },
    ],
  },
  {
    icon: 'phone',
    title: { en: 'Mobile', ar: 'الموبايل' },
    skills: [
      { name: 'React Native', level: 93 },
      { name: 'Expo', level: 90 },
      { name: 'iOS / Android', level: 85 },
      { name: 'Firebase', level: 80 },
    ],
  },
  {
    icon: 'cog',
    title: { en: 'DevOps & Tools', ar: 'DevOps والأدوات' },
    skills: [
      { name: 'Docker', level: 85 },
      { name: 'AWS', level: 78 },
      { name: 'MySQL / PostgreSQL', level: 90 },
      { name: 'Redis', level: 80 },
    ],
  },
]

export const TECH_TAGS = [
  'React.js', 'React Native', 'Laravel', 'Node.js', 'Next.js', 'TypeScript',
  'Python', 'MySQL', 'PostgreSQL', 'Docker', 'AWS', 'Redis',
  'GraphQL', 'REST API', 'Git', 'Firebase', 'Tailwind', 'Linux',
]

/* ── Experience ── */
export interface ExperienceItem {
  role: Localized
  company: Localized
  period: Localized
  desc: Localized
  tags: string[]
  dotOpacity: string
}

export const EXPERIENCE: ExperienceItem[] = [
  {
    role: { en: 'Senior Full Stack Developer', ar: 'مطور Full Stack أول' },
    company: { en: 'Freelance / Remote', ar: 'مستقل / عن بُعد' },
    period: { en: '2022 – Present', ar: '2022 – حتى الآن' },
    desc: {
      en: 'Leading architecture and delivery of full-stack SaaS products for clients across Egypt, KSA, UAE and beyond. Specializing in Laravel APIs + React frontends + React Native mobile apps with CI/CD pipelines.',
      ar: 'قيادة تصميم وتسليم منتجات SaaS لعملاء في مصر والسعودية والإمارات وخارجها. متخصص في Laravel APIs + React + React Native مع خطوط CI/CD.',
    },
    tags: ['Laravel', 'React', 'React Native', 'Docker', 'AWS'],
    dotOpacity: '1',
  },
  {
    role: { en: 'Full Stack Developer', ar: 'مطور Full Stack' },
    company: { en: 'Tech Agency — Cairo, Egypt', ar: 'وكالة تقنية — القاهرة، مصر' },
    period: { en: '2020 – 2022', ar: '2020 – 2022' },
    desc: {
      en: 'Developed and maintained multiple client web platforms using Laravel + Vue.js. Introduced Docker-based dev environments reducing onboarding time by 70%.',
      ar: 'تطوير وصيانة منصات ويب متعددة باستخدام Laravel + Vue.js. تقديم بيئات تطوير مبنية على Docker خفّضت وقت الإعداد 70%.',
    },
    tags: ['Laravel', 'Vue.js', 'MySQL', 'Docker'],
    dotOpacity: '0.6',
  },
  {
    role: { en: 'Junior Web Developer', ar: 'مطور ويب مبتدئ' },
    company: { en: 'Startup — Egypt', ar: 'شركة ناشئة — مصر' },
    period: { en: '2017 – 2020', ar: '2017 – 2020' },
    desc: {
      en: 'Kickstarted my career building PHP/Laravel backends and jQuery frontends, laying a solid foundation in web fundamentals, REST APIs, and database design.',
      ar: 'بدأت مسيرتي ببناء backends بـ PHP/Laravel وواجهات jQuery، وأسّست قاعدة قوية في أساسيات الويب وـ REST APIs وتصميم قواعد البيانات.',
    },
    tags: ['PHP', 'Laravel', 'jQuery', 'MySQL'],
    dotOpacity: '0.4',
  },
]

/* ── Projects ── */
export type ProjectCategory = 'web' | 'mobile' | 'backend'
export type ProjectIcon = 'home' | 'phone' | 'server' | 'chart' | 'users' | 'lock'

export interface Project {
  category: ProjectCategory
  categoryLabel: Localized
  icon: ProjectIcon
  gradient: string
  overlay: string
  title: Localized
  desc: Localized
  tags: string[]
  ctaLabel: Localized
}

export const PROJECT_FILTERS: { key: ProjectCategory | 'all'; label: Localized }[] = [
  { key: 'all',     label: { en: 'All',     ar: 'الكل' } },
  { key: 'web',     label: { en: 'Web',     ar: 'ويب' } },
  { key: 'mobile',  label: { en: 'Mobile',  ar: 'موبايل' } },
  { key: 'backend', label: { en: 'Backend', ar: 'خلفية' } },
]

export const PROJECTS: Project[] = [
  {
    category: 'web',
    categoryLabel: { en: 'Web', ar: 'ويب' },
    icon: 'home',
    gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)',
    overlay: 'linear-gradient(135deg,rgba(124,58,237,.3),rgba(67,56,202,.2))',
    title: { en: 'Real Estate Platform', ar: 'منصة عقارية' },
    desc: {
      en: 'Full-featured property listing & management platform with advanced search, virtual tours, and mortgage calculator.',
      ar: 'منصة قوائم وإدارة عقارية متكاملة مع بحث متقدم وجولات افتراضية وحاسبة رهن.',
    },
    tags: ['Laravel', 'React', 'MySQL', 'Redis'],
    ctaLabel: { en: 'Live Demo', ar: 'معاينة' },
  },
  {
    category: 'mobile',
    categoryLabel: { en: 'Mobile', ar: 'موبايل' },
    icon: 'phone',
    gradient: 'linear-gradient(135deg,#0d1117,#1a1a2e)',
    overlay: 'linear-gradient(135deg,rgba(99,102,241,.3),rgba(124,58,237,.2))',
    title: { en: 'E-Commerce Mobile App', ar: 'تطبيق تجارة إلكترونية' },
    desc: {
      en: 'Cross-platform React Native shopping app with real-time order tracking, payment gateway, and push notifications.',
      ar: 'تطبيق تسوق React Native متعدد المنصات مع تتبع الطلبات وبوابة الدفع والإشعارات الفورية.',
    },
    tags: ['React Native', 'Node.js', 'Firebase'],
    ctaLabel: { en: 'Live Demo', ar: 'معاينة' },
  },
  {
    category: 'backend',
    categoryLabel: { en: 'Backend', ar: 'خلفية' },
    icon: 'server',
    gradient: 'linear-gradient(135deg,#111118,#1e1e2e)',
    overlay: 'linear-gradient(135deg,rgba(109,40,217,.3),rgba(76,29,149,.2))',
    title: { en: 'Multi-Tenant SaaS API', ar: 'API متعدد المستأجرين' },
    desc: {
      en: 'Robust RESTful & GraphQL API with multi-tenancy, RBAC, rate limiting, caching, and automated testing suite.',
      ar: 'API قوي RESTful وGraphQL مع تعدد المستأجرين وـ RBAC وتحديد المعدل والتخزين المؤقت ومجموعة الاختبارات.',
    },
    tags: ['Laravel', 'GraphQL', 'Redis', 'PostgreSQL'],
    ctaLabel: { en: 'Docs', ar: 'التوثيق' },
  },
  {
    category: 'web',
    categoryLabel: { en: 'Web', ar: 'ويب' },
    icon: 'chart',
    gradient: 'linear-gradient(135deg,#0f0f1a,#1a0a2e)',
    overlay: 'linear-gradient(135deg,rgba(167,139,250,.2),rgba(124,58,237,.15))',
    title: { en: 'Healthcare Management System', ar: 'نظام إدارة الرعاية الصحية' },
    desc: {
      en: 'Clinic & hospital management system with appointments, EMR, billing, and telemedicine features.',
      ar: 'نظام إدارة عيادات ومستشفيات مع المواعيد والسجلات الطبية والفواتير والطب عن بُعد.',
    },
    tags: ['Next.js', 'Laravel', 'TypeScript', 'Docker'],
    ctaLabel: { en: 'Live Demo', ar: 'معاينة' },
  },
  {
    category: 'mobile',
    categoryLabel: { en: 'Mobile', ar: 'موبايل' },
    icon: 'users',
    gradient: 'linear-gradient(135deg,#0a0a18,#14142e)',
    overlay: 'linear-gradient(135deg,rgba(99,102,241,.25),rgba(67,56,202,.15))',
    title: { en: 'Delivery & Logistics App', ar: 'تطبيق توصيل ولوجستيات' },
    desc: {
      en: 'On-demand delivery app with real-time GPS tracking, driver management, and analytics dashboard.',
      ar: 'تطبيق توصيل فوري مع تتبع GPS الفوري وإدارة السائقين ولوحة تحليلات.',
    },
    tags: ['React Native', 'Laravel', 'WebSocket'],
    ctaLabel: { en: 'Live Demo', ar: 'معاينة' },
  },
  {
    category: 'backend',
    categoryLabel: { en: 'Backend', ar: 'خلفية' },
    icon: 'lock',
    gradient: 'linear-gradient(135deg,#0c0c18,#181828)',
    overlay: 'linear-gradient(135deg,rgba(109,40,217,.2),rgba(76,29,149,.15))',
    title: { en: 'Auth & Notification Microservice', ar: 'ميكروسيرفس المصادقة والإشعارات' },
    desc: {
      en: 'Standalone microservice for JWT auth, 2FA, SMS/Email notifications, and OAuth2 integrations.',
      ar: 'ميكروسيرفس مستقل لـ JWT auth وـ 2FA وإشعارات SMS/Email وتكاملات OAuth2.',
    },
    tags: ['Node.js', 'Python', 'Redis', 'Docker'],
    ctaLabel: { en: 'Docs', ar: 'التوثيق' },
  },
]

/* ── Team ── */
export interface TeamMember {
  img: string
  name: Localized
  role: Localized
  bio: Localized
  socials: { icon: 'github' | 'linkedin' | 'behance'; href: string; label: string }[]
}

export const TEAM: TeamMember[] = [
  {
    img: 'assets/ibrahem-khaled.jpg',
    name: { en: 'Ibrahem Khaled', ar: 'إبراهيم خالد' },
    role: { en: 'Senior Full Stack Developer', ar: 'مطور Full Stack أول' },
    bio: {
      en: 'Specialized in Laravel, React, and React Native. Turning complex requirements into scalable and beautiful products.',
      ar: 'متخصص في Laravel و React و React Native. تحويل المتطلبات المعقدة إلى منتجات قابلة للتوسع وجميلة.',
    },
    socials: [
      { icon: 'github',   href: 'https://github.com/Ibrahem-Khaled', label: 'GitHub' },
      { icon: 'linkedin', href: 'https://www.linkedin.com/in/ibrahim-khalid-b1a76223a/', label: 'LinkedIn' },
    ],
  },
  {
    img: 'assets/ali-salem.jpg',
    name: { en: 'Ali Salem', ar: 'علي سالم' },
    role: { en: 'UI/UX Designer', ar: 'مصمم UI/UX' },
    bio: {
      en: 'UI/UX designer from Egypt with over 2 years of experience. Crafting intuitive, user-centric interfaces.',
      ar: 'مصمم UI/UX من مصر بخبرة أكثر من سنتين. صياغة واجهات بديهية تركز على المستخدم.',
    },
    socials: [
      { icon: 'behance',  href: '#', label: 'Behance' },
      { icon: 'linkedin', href: '#', label: 'LinkedIn' },
    ],
  },
]

/* ── Testimonials ── */
export interface Testimonial {
  text: Localized
  name: Localized
  project: Localized
  initials: string
  avatarClass: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    text: {
      en: "The best developer I've dealt with on Mostaql. Very understanding, fast, and respectful. May God grant you success Mr. Ibrahim, and we will surely continue our work together.",
      ar: 'افضل مبرمج تعاملت معاه على مستقل، جداً متفهم وسريع ومحترم. الله يوفقك استاذ ابراهيم وباذن الله نكمل بقية اعمالنا سوياً.',
    },
    name: { en: 'Mostaql Client', ar: 'عميل مستقل' },
    project: { en: 'Software Project', ar: 'مشروع برمجي' },
    initials: 'MC',
    avatarClass: 'bg-violet-500/20 text-violet-400',
  },
  {
    text: {
      en: 'A truly wonderful engineer. Thank you, a thousand stars, bless your hands.',
      ar: 'مهندس رائع جداً، شكراً جزيلاً.. ألف نجمة مهندس، يسلم ايديك.',
    },
    name: { en: 'App Client', ar: 'صاحب تطبيق' },
    project: { en: 'Mobile App Project', ar: 'مشروع تطبيق موبايل' },
    initials: 'AC',
    avatarClass: 'bg-indigo-500/20 text-indigo-400',
  },
  {
    text: {
      en: "One of the best people I've dealt with. He understands his work well, thank you for your time and for explaining the points I needed.",
      ar: 'من أفضل الناس اللي تعاملت معهم، فاهم شغله وشكراً لوقتك وشرحك للنقاط التي احتاجها.',
    },
    name: { en: 'Business Client', ar: 'عميل أعمال' },
    project: { en: 'Backend Development', ar: 'تطوير الخلفية البرمجية' },
    initials: 'BC',
    avatarClass: 'bg-violet-600/20 text-violet-300',
  },
]

/* ── FAQ ── */
export const FAQS: { q: Localized; a: Localized }[] = [
  {
    q: { en: 'What technologies do you specialize in?', ar: 'ما هي التقنيات التي تتخصص فيها؟' },
    a: {
      en: 'I specialize in Laravel, React.js, React Native, Node.js, Next.js, TypeScript, and Python. For databases I use MySQL, PostgreSQL, and Redis. I also work with Docker, AWS, and Firebase for deployment and cloud services.',
      ar: 'أتخصص في Laravel وReact.js وReact Native وNode.js وNext.js وTypeScript وPython. لقواعد البيانات أستخدم MySQL وPostgreSQL وRedis. أعمل أيضاً مع Docker وAWS وFirebase للنشر والخدمات السحابية.',
    },
  },
  {
    q: { en: 'How long does a typical project take?', ar: 'كم تستغرق مدة المشروع عادةً؟' },
    a: {
      en: 'Project timelines vary based on complexity. A simple website takes 1-2 weeks, a full web application 4-8 weeks, and a mobile app 6-12 weeks. I always provide a detailed timeline estimate before starting any project.',
      ar: 'تختلف المدة حسب تعقيد المشروع. موقع بسيط يأخذ 1-2 أسبوع، تطبيق ويب كامل 4-8 أسابيع، وتطبيق موبايل 6-12 أسبوع. أقدم دائماً تقدير زمني مفصل قبل بدء أي مشروع.',
    },
  },
  {
    q: { en: 'Do you provide ongoing support and maintenance?', ar: 'هل تقدم دعم وصيانة مستمرة؟' },
    a: {
      en: 'Absolutely! I offer maintenance packages that include bug fixes, security updates, performance optimization, and feature additions. I believe in building long-term relationships with my clients.',
      ar: 'بالتأكيد! أقدم باقات صيانة تشمل إصلاح الأخطاء وتحديثات الأمان وتحسين الأداء وإضافة ميزات جديدة. أؤمن ببناء علاقات طويلة المدى مع عملائي.',
    },
  },
  {
    q: { en: 'Can you work with clients remotely?', ar: 'هل تستطيع العمل مع عملاء عن بُعد؟' },
    a: {
      en: 'Yes! I have experience working with clients across Egypt, Saudi Arabia, UAE, and beyond. I use tools like Slack, Zoom, and Trello for seamless communication and project management.',
      ar: 'نعم! لدي خبرة في العمل مع عملاء في مصر والسعودية والإمارات وخارجها. أستخدم أدوات مثل Slack وZoom وTrello للتواصل السلس وإدارة المشاريع.',
    },
  },
  {
    q: { en: 'What is your pricing structure?', ar: 'ما هو هيكل التسعير لديك؟' },
    a: {
      en: 'I offer both fixed-price projects and hourly rates depending on the project scope. For larger projects, I break them into milestones with payments tied to deliverables. Contact me for a free consultation and quote!',
      ar: 'أقدم مشاريع بسعر ثابت وأسعار بالساعة حسب نطاق المشروع. للمشاريع الكبيرة، أقسمها إلى مراحل مع دفعات مرتبطة بالتسليمات. تواصل معي للحصول على استشارة وعرض سعر مجاني!',
    },
  },
  {
    q: { en: 'Do you build mobile apps for both iOS and Android?', ar: 'هل تبني تطبيقات موبايل لـ iOS و Android؟' },
    a: {
      en: 'Yes! Using React Native and Expo, I build cross-platform mobile apps that run on both iOS and Android from a single codebase. This saves time and cost while delivering a native experience on both platforms.',
      ar: 'نعم! باستخدام React Native وExpo، أبني تطبيقات موبايل متعددة المنصات تعمل على iOS وAndroid من كود واحد. هذا يوفر الوقت والتكلفة مع تقديم تجربة أصلية على كلا المنصتين.',
    },
  },
]

/* ── Socials ── */
export type SocialIcon = 'github' | 'linkedin' | 'facebook' | 'x' | 'whatsapp'

export const SOCIALS: { icon: SocialIcon; href: string; label: string }[] = [
  { icon: 'github',   href: 'https://github.com/Ibrahem-Khaled',                          label: 'GitHub' },
  { icon: 'linkedin', href: 'https://www.linkedin.com/in/ibrahim-khalid-b1a76223a/',      label: 'LinkedIn' },
  { icon: 'facebook', href: 'https://www.facebook.com/sgoon130',                          label: 'Facebook' },
  { icon: 'x',        href: '#',                                                          label: 'X/Twitter' },
  { icon: 'whatsapp', href: 'https://wa.me/201159253196',                                 label: 'WhatsApp' },
]

export const LINKS = {
  email: 'hemosh550@gmail.com',
  github: 'https://github.com/Ibrahem-Khaled',
  linkedin: 'https://www.linkedin.com/in/ibrahim-khalid-b1a76223a/',
  whatsapp: 'https://wa.me/201159253196',
  cv: 'assets/Ibrahim_Khaled_CV_Advanced.pdf',
}

/* ── Games ── */
export type GameStatus = 'live' | 'soon'

export interface GameItem {
  id: string
  emoji: string
  title: Localized
  desc: Localized
  status: GameStatus
}

export const GAMES: GameItem[] = [
  {
    id: 'bug-wars',
    emoji: '🐛',
    title: { en: 'BUG WARS · 3D FPS', ar: 'حرب الباجات · 3D' },
    desc: {
      en: 'A full 3D first-person shooter: defend the mainframe from SyntaxErrors, Memory Leaks and the LEGACY_CODE boss. Procedural sound, zero assets.',
      ar: 'لعبة تصويب ثلاثية الأبعاد كاملة: دافع عن الماين فريم ضد SyntaxError وMemory Leak وزعيم LEGACY_CODE. أصوات مولّدة برمجيًا بدون أي ملفات.',
    },
    status: 'live',
  },
  {
    id: 'tic-tac-toe',
    emoji: '⭕',
    title: { en: 'Tic-Tac-Toe', ar: 'إكس أو' },
    desc: { en: 'Classic duel against a simple AI.', ar: 'مواجهة كلاسيكية ضد ذكاء اصطناعي بسيط.' },
    status: 'live',
  },
  {
    id: 'memory',
    emoji: '🧠',
    title: { en: 'Memory Match', ar: 'لعبة الذاكرة' },
    desc: { en: 'Flip cards and match the pairs.', ar: 'اقلب الكروت وطابق الأزواج.' },
    status: 'soon',
  },
  {
    id: 'snake',
    emoji: '🐍',
    title: { en: 'Snake', ar: 'الثعبان' },
    desc: { en: 'The legendary snake game.', ar: 'لعبة الثعبان الأسطورية.' },
    status: 'soon',
  },
  {
    id: '2048',
    emoji: '🔢',
    title: { en: '2048', ar: '٢٠٤٨' },
    desc: { en: 'Merge tiles to reach 2048.', ar: 'ادمج المربعات لتصل إلى 2048.' },
    status: 'soon',
  },
]

/* ── Section headers ── */
export const HEADERS = {
  about: {
    kicker: { en: 'Who I Am', ar: 'من أنا' },
    title: { en: 'Passionate about building impactful digital products', ar: 'شغوف ببناء منتجات رقمية مؤثرة' },
  },
  aboutP1: {
    en: "I'm Ibrahem Khaled, a Senior Full Stack Developer based in Egypt with 7+ years of hands-on experience across the entire software development lifecycle. From architecting robust backend APIs to crafting pixel-perfect React UIs and shipping React Native apps to the stores.",
    ar: 'أنا إبراهيم خالد، مطور Full Stack أول مقيم في مصر بخبرة +7 سنوات في دورة حياة تطوير البرمجيات الكاملة. من تصميم APIs خلفية متينة، إلى واجهات React دقيقة، وتطبيقات React Native جاهزة للمتجر.',
  },
  aboutP2: {
    en: 'My core stack is Laravel + React + React Native, augmented with Node.js, Next.js, Docker, and AWS. I thrive in collaborative environments, mentor junior developers, and love turning ambitious product ideas into production-ready software.',
    ar: 'مكدسي الأساسي هو Laravel + React + React Native مدعومًا بـ Node.js وNext.js وDocker وAWS. أزدهر في بيئات تعاونية، أُرشد المطورين الجدد، وأحب تحويل الأفكار الطموحة إلى برمجيات جاهزة للإنتاج.',
  },
  skills: {
    kicker: { en: 'What I Work With', ar: 'ما أعمل به' },
    title: { en: 'Skills & Technologies', ar: 'المهارات والتقنيات' },
  },
  experience: {
    kicker: { en: 'Career Path', ar: 'المسار المهني' },
    title: { en: 'Work Experience', ar: 'الخبرة المهنية' },
  },
  projects: {
    kicker: { en: 'Portfolio', ar: 'الأعمال' },
    title: { en: 'Featured Projects', ar: 'المشاريع المميزة' },
  },
  team: {
    kicker: { en: 'The People', ar: 'الأشخاص' },
    title: { en: 'Team & Collaborators', ar: 'الفريق والمتعاونون' },
  },
  testimonials: {
    kicker: { en: 'What Clients Say', ar: 'ما يقوله العملاء' },
    title: { en: 'Testimonials', ar: 'شهادات العملاء' },
  },
  faq: {
    kicker: { en: 'Common Questions', ar: 'أسئلة شائعة' },
    title: { en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' },
  },
  contact: {
    kicker: { en: 'Get in Touch', ar: 'تواصل معي' },
    title: { en: "Let's Work Together", ar: 'لنعمل معاً' },
  },
  footerAbout: {
    en: 'Senior Full Stack Developer crafting elegant digital solutions with 7+ years of passion and precision.',
    ar: 'مطور Full Stack أول يصنع حلولاً رقمية أنيقة بـ +7 سنوات من الشغف والدقة.',
  },
} as const
