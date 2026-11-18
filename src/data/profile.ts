import type { Localized } from '../utils/paths'

/**
 * Single source of truth for identity, contact info, CV data, live products,
 * open-source repositories, and collaborators.
 * Synced strictly with public/cv/Ibrahim_Khaled_CV.pdf.
 */
export const PROFILE = {
  name: {
    en: 'Ibrahim Khaled',
    ar: 'إبراهيم خالد',
  } satisfies Localized,
  role: {
    en: 'Senior Full-Stack Software Engineer',
    ar: 'مهندس برمجيات أول — Full-Stack & AI',
  } satisfies Localized,
  subtitle: {
    en: 'Web, Mobile & AI Systems',
    ar: 'الويب، الموبايل، وأنظمة الذكاء الاصطناعي',
  } satisfies Localized,
  positioning: {
    en: 'I architect multi-tenant SaaS platforms, multi-currency payment systems, and self-hosted AI products.',
    ar: 'أصمّم وأبني منصات SaaS متعددة المستأجرين، بوابات الدفع متعددة العملات، ومنتجات الذكاء الاصطناعي المستضافة ذاتياً.',
  } satisfies Localized,
  summary: {
    en: '5 years shipping production web platforms, cross-platform mobile apps, and AI workflows across Laravel, Node.js, React, React Native, and Python — owning architecture from database isolation to store release.',
    ar: '5 سنوات في بناء وإطلاق منصات الويب وتطبيقات الموبايل وأنظمة الذكاء الاصطناعي باستخدام Laravel وNode.js وReact وReact Native وPython — من تصميم قاعدة البيانات والعزل حتى الإطلاق الفعلي على المتاجر.',
  } satisfies Localized,
  location: {
    en: 'Remote from Egypt (UTC+2)',
    ar: 'عن بُعد من مصر (UTC+2)',
  } satisfies Localized,
  availability: {
    en: 'Available for Senior Remote roles & select contract builds',
    ar: 'متاح لوظائف Senior عن بُعد ومشاريع تطوير مختارة',
  } satisfies Localized,
  experienceYears: 5,
  email: 'hemosh550@gmail.com',
  phoneDisplay: '+20 127 866 6941',
  phoneHref: 'tel:+201278666941',
  whatsapp: 'https://wa.me/201278666941',
  linkedin: 'https://www.linkedin.com/in/ebrahemkhaled3',
  github: 'https://github.com/Ibrahem-Khaled',
  cvPath: '/cv/Ibrahim_Khaled_CV.pdf',
} as const

export interface ProofStat {
  value: Localized
  label: Localized
  detail: Localized
}

export const HERO_FACTS: ProofStat[] = [
  {
    value: { en: '5 yrs', ar: '5 سنوات' },
    label: { en: 'Production engineering', ar: 'خبرة إنتاجية فعلية' },
    detail: { en: '2021 – Present · Full lifecycle', ar: '2021 – الآن · دورة تطوير كاملة' },
  },
  {
    value: { en: '8 live', ar: '8 مشاريع حية' },
    label: { en: 'Public web & Play Store releases', ar: 'مواقع ويب وتطبيقات Google Play' },
    detail: { en: 'KSA, Yemen, Jordan & Iraq', ar: 'السعودية، اليمن، الأردن والعراق' },
  },
  {
    value: { en: '30%', ar: '30%' },
    label: { en: 'Avg API latency reduction', ar: 'تحسين متوسط استجابة الـ API' },
    detail: { en: 'Measured MySQL query refactoring', ar: 'إعادة هيكلة استعلامات MySQL' },
  },
  {
    value: { en: '12,000+ TEU', ar: '+12,000 حاوية' },
    label: { en: 'Dry-port yard twin capacity', ar: 'سعة ساحة الحاويات المُدارة' },
    detail: { en: '120,000 m² Jeddah logistics system', ar: 'منظومة لوجستية بمساحة 120,000 م² بجدة' },
  },
]

export interface LiveProductShowcase {
  id: string
  name: Localized
  kind: Localized
  year: string
  role: Localized
  summary: Localized
  metric: Localized
  stack: string[]
  liveUrl?: string
  playStoreUrl?: string
  layout: 'web' | 'mobile-trio'
  images: { src: string; alt: string; width: number; height: number }[]
}

export const SHIPPED_SHOWCASE: LiveProductShowcase[] = [
  {
    id: 'alsorayai-academy',
    name: { en: 'Al-Sorayai Academy', ar: 'أكاديمية السريع' },
    kind: { en: 'E-Learning Platform · Web', ar: 'منصة تعليم إلكتروني · ويب' },
    year: '2024',
    role: { en: 'Sole Full-Stack Engineer', ar: 'المبرمج والمسؤول التقني الكامل' },
    summary: {
      en: 'Production Saudi e-learning academy powering structured study tracks, interactive classrooms, and dedicated institutional programs (Tamooh & Riyadah).',
      ar: 'منصة تعليمية سعودية متكاملة تدير المسارات الدراسية والفصول التفاعلية والبرامج المتخصصة (برنامج طموح وبرنامج ريادة).',
    },
    metric: { en: '102+ courses · 3,824+ students', ar: '+102 دورة · +3,824 طالب' },
    stack: ['Laravel', 'MySQL', 'JavaScript', 'Video Streaming'],
    liveUrl: 'https://alsorayaiacademy.com/',
    layout: 'web',
    images: [
      {
        src: '/images/projects/alsorayai-web.webp',
        alt: 'Al-Sorayai Academy live e-learning platform homepage',
        width: 1006,
        height: 628,
      },
    ],
  },
  {
    id: 'alsorayai-family',
    name: { en: 'Al-Sorayai Family App', ar: 'تطبيق عائلة السريع' },
    kind: { en: 'Community & Commerce · Mobile', ar: 'تطبيق مجتمعي ومتجر · موبايل' },
    year: '2025',
    role: { en: 'Sole Mobile & Backend Engineer', ar: 'المطور الكامل للتطبيق والخلفية' },
    summary: {
      en: 'Cross-platform community application featuring genealogy/family tree documentation, step-tracking walking challenges with leaderboards, event invitations, and a productive-families marketplace.',
      ar: 'تطبيق متكامل لتوثيق شجرة العائلة والتاريخ، برنامج تحديات المشي ولوحة الشرف، إدارة الدعوات والمناسبات، ومتجر للأسر المنتجة.',
    },
    metric: { en: 'Live on Google Play · Full-stack solo build', ar: 'منشور على Google Play · بناء كامل منفرد' },
    stack: ['React Native (Expo)', 'Laravel API', 'Push Notifications', 'In-App Purchases'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.alsorayia.app',
    layout: 'mobile-trio',
    images: [
      {
        src: '/images/projects/alsorayia-app-1.webp',
        alt: 'Al-Sorayai Family app walking challenge and leaderboard screen',
        width: 330,
        height: 592,
      },
      {
        src: '/images/projects/alsorayia-app-2.webp',
        alt: 'Al-Sorayai Family app community challenges screen',
        width: 330,
        height: 592,
      },
      {
        src: '/images/projects/alsorayia-app-3.webp',
        alt: 'Al-Sorayai Family app services and marketplace screen',
        width: 330,
        height: 592,
      },
    ],
  },
  {
    id: 'albasera-iptv',
    name: { en: 'Albasera IPTV Player', ar: 'تطبيق البصيرة IPTV' },
    kind: { en: 'Media Streaming · Android & TV', ar: 'بث مباشر وميديا · أندرويد و TV' },
    year: '2023–2025',
    role: { en: 'Sole Full-Stack & Mobile Engineer', ar: 'المطور الكامل للتطبيق والـ API' },
    summary: {
      en: 'Live TV and VOD streaming client supporting Xtream Codes API and M3U/M3U8 playlists across Android phones, tablets, and Android TV — backed by an RBAC channel management API.',
      ar: 'مشغل بث مباشر ومحتوى حسب الطلب يدعم Xtream Codes وملفات M3U/M3U8 لهواتف وتابلت وأجهزة Android TV مع لوحة تحكم وـ REST API بصلاحيات RBAC.',
    },
    metric: { en: '100+ Play Store installs · Phone, Tablet & TV', ar: '+100 تحميل على المتجر · موبايل وتلفاز' },
    stack: ['React Native', 'Laravel REST API', 'RBAC', 'Xtream / HLS'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.albasera.player',
    layout: 'mobile-trio',
    images: [
      {
        src: '/images/projects/albasera-app-1.webp',
        alt: 'Albasera IPTV subscription and server connection status screen',
        width: 266,
        height: 592,
      },
      {
        src: '/images/projects/albasera-app-2.webp',
        alt: 'Albasera IPTV watch-later queue screen',
        width: 266,
        height: 592,
      },
      {
        src: '/images/projects/albasera-app-3.webp',
        alt: 'Albasera IPTV favorites management screen',
        width: 266,
        height: 592,
      },
    ],
  },
]

export type WorkFilterKey = 'all' | 'saas' | 'ai' | 'commerce' | 'mobile'

export interface WorkIndexEntry {
  year: string
  name: Localized
  domain: Localized
  category: Exclude<WorkFilterKey, 'all'>
  role: Localized
  outcome: Localized
  stack: string[]
  caseStudySlug?: string
  liveUrl?: string
  playStoreUrl?: string
  nda?: boolean
  status?: 'live' | 'in-progress' | 'nda'
}

export const WORK_INDEX: WorkIndexEntry[] = [
  {
    year: '2026',
    name: { en: 'Multi-Tenant Fuel Stations Platform', ar: 'منصة إدارة محطات الوقود (Multi-Tenant)' },
    domain: { en: 'Energy SaaS', ar: 'SaaS طاقة ومحطات' },
    category: 'saas',
    role: { en: 'Lead Architect', ar: 'المعماري المسؤول' },
    outcome: { en: 'In progress — isolated tenant DBs, shift/pump reconciliation & fleet billing', ar: 'قيد التطوير — عزل قواعد البيانات، تسوية الورديات والمضخات وفواتير الأساطيل' },
    stack: ['Laravel', 'Stancl/Tenancy', 'PostgreSQL', 'React'],
    caseStudySlug: 'multi-tenant-saas',
    status: 'in-progress',
    nda: true,
  },
  {
    year: '2025',
    name: { en: 'Hawyati — Dry-Port & Yard Twin', ar: 'حاوياتي — إدارة ساحات الحاويات' },
    domain: { en: 'Logistics / 3D', ar: 'لوجستيات / 3D' },
    category: 'commerce',
    role: { en: 'Sole Architect & Engineer', ar: 'المبرمج والمسؤول الكامل' },
    outcome: { en: '120,000 m² Jeddah yard · 12,000+ TEU capacity · 60fps 3D digital twin', ar: 'ساحة 120,000 م² بجدة · سعة +12,000 حاوية · توأم رقمي 3D لحظي' },
    stack: ['React', 'Three.js', 'Laravel', 'WebSockets'],
    caseStudySlug: 'hawyati',
    liveUrl: 'https://hawyati.ahmednomer.com/',
    status: 'live',
  },
  {
    year: '2025',
    name: { en: 'Abdulaziz Learn (Self-Hosted Qwen)', ar: 'منصة عبدالعزيز للتعلم (Qwen محلي)' },
    domain: { en: 'EdTech / AI', ar: 'تعليم / ذكاء اصطناعي' },
    category: 'ai',
    role: { en: 'Lead Full-Stack & AI Engineer', ar: 'قائد التطوير والذكاء الاصطناعي' },
    outcome: { en: 'Migrated audio-visual explainer from commercial APIs to fine-tuned self-hosted Qwen', ar: 'نقل محرك الشرح الصوتي والمرئي من APIs تجارية إلى نموذج Qwen مفتوح المصدر مستضاف ذاتياً' },
    stack: ['Python', 'Qwen LLM', 'Laravel', 'Docker'],
    caseStudySlug: 'abdulaziz-learn',
    nda: true,
    status: 'nda',
  },
  {
    year: '2025',
    name: { en: 'Multi-Tenant ERP / CRM SaaS', ar: 'منصة ERP/CRM متعددة المستأجرين' },
    domain: { en: 'Enterprise SaaS', ar: 'SaaS للمؤسسات' },
    category: 'saas',
    role: { en: 'Lead Architect', ar: 'المعماري المسؤول' },
    outcome: { en: 'Dynamic subdomain routing, strict per-tenant DB isolation, storefronts & rental modules', ar: 'توجيه نطاقات فرعية ديناميكي، عزل كامل لقاعدة بيانات كل مستأجر، متاجر وتأجير' },
    stack: ['Laravel', 'Stancl/Tenancy', 'MySQL', 'Redis'],
    caseStudySlug: 'multi-tenant-saas',
    nda: true,
    status: 'nda',
  },
  {
    year: '2025',
    name: { en: 'Souqak AI / Haraj AI Marketplace', ar: 'السوق الإلكتروني AI (تفاوض ذكي)' },
    domain: { en: 'AI Marketplace', ar: 'سوق ذكي / AI' },
    category: 'ai',
    role: { en: 'Sole Full-Stack & AI Engineer', ar: 'المبرمج والمسؤول الكامل' },
    outcome: { en: 'Autonomous LLM negotiation agent benchmarking specs across 449 categories & live auctions', ar: 'وكيل تفاوض ذكي بالـ LLM يقارن المواصفات عبر 449 تصنيف ومزادات مباشرة' },
    stack: ['Laravel', 'OpenAI API', 'React', 'WebSockets'],
    liveUrl: 'http://souqak-ai.com/',
    status: 'live',
  },
  {
    year: '2025',
    name: { en: 'SIOSS Swedish International Platform', ar: 'المنصة السويدية الدولية SIOSS' },
    domain: { en: 'EdTech / Training', ar: 'تدريب وتعليم' },
    category: 'ai',
    role: { en: 'Sole Full-Stack Engineer', ar: 'المبرمج والمسؤول الكامل' },
    outcome: { en: 'E-learning platform with subscription tiers, academic calendar, referral system & AI tools', ar: 'منصة تدريب إلكتروني بباقات اشتراك، تقويم أكاديمي، نظام إحالة وأدوات ذكاء اصطناعي' },
    stack: ['Laravel', 'MySQL', 'Payments', 'AI Integration'],
    liveUrl: 'https://sioss-ai.com/',
    status: 'live',
  },
  {
    year: '2025',
    name: { en: 'Al-Sorayai Family App', ar: 'تطبيق عائلة السريع' },
    domain: { en: 'Community Mobile', ar: 'تطبيق مجتمعي' },
    category: 'mobile',
    role: { en: 'Sole Full-Stack & Mobile Engineer', ar: 'المطور الكامل للتطبيق والخلفية' },
    outcome: { en: 'Family tree, step-tracking competitions, invitations & productive-families store on Google Play', ar: 'شجرة العائلة، تحديات المشي، الدعوات، ومتجر الأسر المنتجة على Google Play' },
    stack: ['React Native', 'Expo', 'Laravel', 'Push Notifications'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.alsorayia.app',
    status: 'live',
  },
  {
    year: '2025',
    name: { en: 'IFAF Real-Time Social Platform', ar: 'منصة IFAF للتواصل اللحظي' },
    domain: { en: 'Real-Time Social', ar: 'تواصل لحظي' },
    category: 'mobile',
    role: { en: 'Lead Full-Stack Engineer', ar: 'مهندس Full-Stack رئيسي' },
    outcome: { en: 'WhatsApp-style WebSocket messaging, interactive timelines & nested comment feeds', ar: 'مراسلة لحظية بأسلوب واتساب عبر WebSockets مع تايملاين وتعليقات متعددة المستويات' },
    stack: ['React Native', 'Node.js', 'WebSockets', 'Redis'],
    nda: true,
    status: 'nda',
  },
  {
    year: '2025',
    name: { en: 'Biometric Attendance Mobile App', ar: 'تطبيق حضور بالبصمة وFaceID' },
    domain: { en: 'HR / Mobile', ar: 'موارد بشرية / موبايل' },
    category: 'mobile',
    role: { en: 'Mobile & Backend Engineer', ar: 'مهندس موبايل وخلفية' },
    outcome: { en: 'Native Fingerprint & FaceID employee verification with real-time attendance logs', ar: 'توثيق حضور الموظفين عبر بصمة الإصبع والوجه أصلية على الجهاز مع سجل لحظي' },
    stack: ['React Native', 'Expo LocalAuth', 'Laravel API'],
    nda: true,
    status: 'nda',
  },
  {
    year: '2024',
    name: { en: 'Magic Linker (Web + Mobile)', ar: 'ماجيك لينكر (ويب + موبايل)' },
    domain: { en: 'B2B / B2C Commerce', ar: 'تجارة B2B و B2C' },
    category: 'commerce',
    role: { en: 'Full-Stack Software Engineer', ar: 'مهندس برمجيات Full-Stack' },
    outcome: { en: 'Multi-merchant marketplace (Yemen) with unified cart, Stripe/PayPal/Moyasar & auto-settlements', ar: 'سوق متعدد التجار (اليمن) بسلة موحدة، بوابات Stripe/PayPal/Moyasar وتسوية عمولات تلقائية' },
    stack: ['Laravel', 'React Native', 'Stripe', 'PayPal', 'Moyasar'],
    caseStudySlug: 'magic-linker',
    liveUrl: 'https://magiclinker.com/',
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.magiclink.medstore',
    status: 'live',
  },
  {
    year: '2024',
    name: { en: 'Al-Sorayai Academy', ar: 'أكاديمية السريع' },
    domain: { en: 'EdTech LMS', ar: 'منصة تعليمية' },
    category: 'saas',
    role: { en: 'Sole Full-Stack Engineer', ar: 'المبرمج والمسؤول الكامل' },
    outcome: { en: '102+ courses and 3,824+ students across structured Saudi training tracks', ar: '+102 دورة وأكثر من 3,824 طالب عبر مسارات تدريبية سعودية' },
    stack: ['Laravel', 'MySQL', 'REST API'],
    liveUrl: 'https://alsorayaiacademy.com/',
    status: 'live',
  },
  {
    year: '2022–2023',
    name: { en: 'Albasera IPTV & Streaming API', ar: 'منصة وتطبيق البصيرة IPTV' },
    domain: { en: 'Media Streaming', ar: 'بث مباشر' },
    category: 'mobile',
    role: { en: 'Full-Stack & Mobile Developer', ar: 'مطور Full-Stack وموبايل' },
    outcome: { en: '100+ Play Store installs, scalable RBAC REST API & 1 year post-launch production maintenance', ar: '+100 تحميل على Google Play مع REST API بصلاحيات RBAC وسنة صيانة إنتاجية كاملة' },
    stack: ['Laravel', 'React Native', 'RBAC', 'Xtream API'],
    playStoreUrl: 'https://play.google.com/store/apps/details?id=com.albasera.player',
    status: 'live',
  },
  {
    year: '2022–2023',
    name: { en: 'Tailored E-Learning LMS (Jordan)', ar: 'نظام LMS مخصص (الأردن)' },
    domain: { en: 'EdTech', ar: 'تعليم إلكتروني' },
    category: 'saas',
    role: { en: 'Full-Stack Developer', ar: 'مطور Full-Stack' },
    outcome: { en: 'Interactive video courses, automated assessments & real-time progress for thousands of learners', ar: 'دورات فيديو تفاعلية واختبارات آلية وتتبع لحظي لتقدم آلاف الطلاب' },
    stack: ['Laravel', 'React', 'MySQL'],
    nda: true,
    status: 'nda',
  },
  {
    year: '2021',
    name: { en: 'Domestic Remittance & Multi-Branch Ledger', ar: 'نظام تحويلات مالية وفروع متزامنة' },
    domain: { en: 'FinTech', ar: 'تكنولوجيا مالية' },
    category: 'commerce',
    role: { en: 'Full-Stack Developer', ar: 'مطور Full-Stack' },
    outcome: { en: 'Cryptographic transfer tokens, National ID verification & atomic multi-branch ledgers', ar: 'رموز تحويل مشفرة، تحقق بالهوية الوطنية وتحديث دفاتر حسابات الفروع بشكل ذري' },
    stack: ['Laravel', 'MySQL Transactions', 'Security'],
    nda: true,
    status: 'nda',
  },
  {
    year: '2021',
    name: { en: 'Forex AI Bot & MySQL Optimization', ar: 'بوت تداول AI وتحسين قواعد البيانات' },
    domain: { en: 'FinTech / Perf', ar: 'تداول / أداء' },
    category: 'ai',
    role: { en: 'Full-Stack Developer', ar: 'مطور Full-Stack' },
    outcome: { en: 'Automated OpenAI + Twelve Data analysis bot; reduced average production API response time by 30%', ar: 'بوت تحليل فوركس آلي بـ OpenAI وTwelve Data + تحسين زمن استجابة API الإنتاجية بنسبة 30%' },
    stack: ['Python', 'OpenAI API', 'MySQL Indexing'],
    nda: true,
    status: 'nda',
  },
]

export interface StackGroup {
  area: Localized
  items: { tech: string; shippedIn: Localized }[]
}

export const STACK_GROUPS: StackGroup[] = [
  {
    area: { en: 'Backend & Architecture', ar: 'الخلفية والمعمارية' },
    items: [
      { tech: 'Laravel / PHP 8+', shippedIn: { en: 'Multi-Tenant ERP, Magic Linker, Fuel SaaS, Hawyati', ar: 'منصات SaaS، ماجيك لينكر، محطات الوقود، حاوياتي' } },
      { tech: 'Stancl/Tenancy', shippedIn: { en: 'Subdomain routing & isolated tenant databases', ar: 'توجيه النطاقات الفرعية وعزل قواعد البيانات' } },
      { tech: 'Node.js & WebSockets', shippedIn: { en: 'IFAF real-time messaging & WebRTC signaling', ar: 'مراسلة IFAF اللحظية وإشارات WebRTC' } },
      { tech: 'Python', shippedIn: { en: 'Self-hosted Qwen inference & trading automation', ar: 'تشغيل نماذج Qwen المحلية وأتمتة التحليل' } },
    ],
  },
  {
    area: { en: 'Frontend & Mobile', ar: 'الواجهات والموبايل' },
    items: [
      { tech: 'React.js / Next.js', shippedIn: { en: 'Hawyati 3D twin, dashboards, LMS portals', ar: 'التوأم الرقمي لحاوياتي، لوحات التحكم، المنصات التعليمية' } },
      { tech: 'React Native (Expo)', shippedIn: { en: 'Magic Linker, Al-Sorayai Family, Albasera, Biometrics', ar: 'تطبيقات ماجيك لينك، عائلة السريع، البصيرة، البصمة' } },
      { tech: 'Three.js / WebGL', shippedIn: { en: 'Hawyati container yard twin & BugWars 3D lab', ar: 'التوأم ثلاثي الأبعاد لساحة الحاويات ومختبر 3D' } },
      { tech: 'TypeScript & Tailwind', shippedIn: { en: 'Strict typed UI systems & RTL Arabic layouts', ar: 'واجهات صارمة الأنواع ودعم كامل للغة العربية RTL' } },
    ],
  },
  {
    area: { en: 'AI & LLM Engineering', ar: 'هندسة الذكاء الاصطناعي' },
    items: [
      { tech: 'Self-Hosted LLMs (Qwen)', shippedIn: { en: 'Abdulaziz Learn migration off commercial APIs', ar: 'نقل محرك منصة عبدالعزيز لتقليل التكلفة والزمن' } },
      { tech: 'Autonomous AI Agents', shippedIn: { en: 'Souqak / Haraj AI automated price negotiation', ar: 'وكيل التفاوض الآلي في السوق الإلكتروني AI' } },
      { tech: 'OpenAI & Prompt Pipelines', shippedIn: { en: 'SIOSS, Smart Letter Guide, Forex analysis', ar: 'SIOSS، معلم الحروف الذكي، وتحليل الأسواق' } },
    ],
  },
  {
    area: { en: 'Data, Payments & Infra', ar: 'البيانات والدفع والبنية التحتية' },
    items: [
      { tech: 'MySQL, PostgreSQL, Redis', shippedIn: { en: 'Atomic ledgers, composite indexes (-30% latency), queues', ar: 'دفاتر حسابات ذرية، فهارس مركبة (-30% زمن استجابة)، طوابير' } },
      { tech: 'Stripe, PayPal, Moyasar', shippedIn: { en: 'Multi-currency checkout & vendor settlements', ar: 'دفع متعدد العملات وتسوية عمولات التجار' } },
      { tech: 'Docker, AWS, GitHub Actions', shippedIn: { en: 'Linux VPS deployments, CI/CD pipelines, container isolation', ar: 'خوادم Linux، خطوط CI/CD، وحاويات Docker' } },
    ],
  },
]

export interface OpenSourceRepo {
  name: string
  url: string
  stack: string
  summary: Localized
}

export const OPEN_SOURCE_REPOS: OpenSourceRepo[] = [
  {
    name: 'react-webrtc-conference',
    url: 'https://github.com/Ibrahem-Khaled/react-webrtc-conference',
    stack: 'React 19 · WebRTC · Node.js WS',
    summary: {
      en: 'P2P video conferencing with a real-time collaborative whiteboard and custom WebSocket signaling server.',
      ar: 'مؤتمرات فيديو P2P عبر WebRTC مع سبورة تشاركية لحظية وخادم إشارات WebSocket مخصص.',
    },
  },
  {
    name: 'laravel-live-streaming-app',
    url: 'https://github.com/Ibrahem-Khaled/laravel-live-streaming-app',
    stack: 'Laravel · REST API · RBAC',
    summary: {
      en: 'IPTV admin panel and RESTful API for live channel scheduling, VOD catalogs, and subscriber access control.',
      ar: 'لوحة تحكم وـ REST API لإدارة قنوات البث المباشر IPTV ومكتبة الفيديو وصلاحيات المشتركين.',
    },
  },
  {
    name: 'dev-to-x-publisher',
    url: 'https://github.com/Ibrahem-Khaled/dev-to-x-publisher',
    stack: 'AI Pipeline · Telegram · Automation',
    summary: {
      en: 'Automation workflow converting raw engineering notes into technical threads via Telegram with human-in-the-loop review.',
      ar: 'نظام أتمتة بالذكاء الاصطناعي يحول الملاحظات الهندسية إلى سلاسل تقنية عبر تليجرام مع مراجعة بشرية قبل النشر.',
    },
  },
  {
    name: 'laravel-money-Transfer-system',
    url: 'https://github.com/Ibrahem-Khaled/laravel-money-Transfer-system',
    stack: 'Laravel · Multi-Currency · Ledger',
    summary: {
      en: 'Multi-currency transfer backend with transactional balance management, audit trail, and status notifications.',
      ar: 'نظام خلفي لتحويل الأموال متعدد العملات مع إدارة الأرصدة داخل معاملات ذرية وسجل تدقيق كامل.',
    },
  },
  {
    name: 'smart-letter-guide',
    url: 'https://github.com/Ibrahem-Khaled/smart-letter-guide',
    stack: 'React · OpenAI · Voice · 3D',
    summary: {
      en: 'Interactive AI children tutor with speech recognition, Arabic voice responses, and a 3D companion.',
      ar: 'معلم تفاعلي للأطفال بالذكاء الاصطناعي يدعم التعرف الصوتي والردود العربية مع شخصية ثلاثية الأبعاد.',
    },
  },
  {
    name: 'laravel-Family-app-with-store',
    url: 'https://github.com/Ibrahem-Khaled/laravel-Family-app-with-store',
    stack: 'Laravel · Community · Commerce',
    summary: {
      en: 'Family management backend combining member roles, shared calendars, messaging, and an integrated family store.',
      ar: 'منظومة خلفية لإدارة الأنشطة العائلية تجمع صلاحيات الأعضاء والتقويم المشترك والمراسلة والمتجر الداخلي.',
    },
  },
]

export interface ExperienceRecord {
  period: Localized
  role: Localized
  org: Localized
  bullets: Localized[]
  tags: string[]
}

export const EXPERIENCE_TIMELINE: ExperienceRecord[] = [
  {
    period: { en: 'Jan 2025 – Present', ar: 'يناير 2025 – حتى الآن' },
    role: { en: 'Senior Full-Stack & SaaS Engineer', ar: 'مهندس برمجيات أول — SaaS والذكاء الاصطناعي' },
    org: { en: 'Lead Architect — Enterprise SaaS & AI Ecosystems · Remote', ar: 'المعماري المسؤول — أنظمة SaaS والذكاء الاصطناعي · عن بُعد' },
    bullets: [
      {
        en: 'Architected multi-tenant ERP/CRM and fuel-station SaaS platforms on Laravel + Stancl/Tenancy with dynamic subdomains and isolated per-tenant databases.',
        ar: 'تصميم وبناء منصات SaaS متعددة المستأجرين (ERP/CRM ومحطات الوقود) بـ Laravel وStancl/Tenancy مع عزل كامل لقواعد البيانات وتوجيه ديناميكي للنطاقات.',
      },
      {
        en: 'Built Hawyati dry-port management platform (120,000 m², 12,000+ TEU) featuring a 3D live container yard twin.',
        ar: 'بناء منظومة حاوياتي لإدارة ساحات الحاويات في جدة (120,000 م² / +12,000 حاوية) مع توأم رقمي ثلاثي الأبعاد.',
      },
      {
        en: 'Migrated Abdulaziz Learn audio-visual explanation engine from commercial APIs to a self-hosted fine-tuned Qwen LLM.',
        ar: 'نقل محرك الشرح الصوتي والمرئي في منصة عبدالعزيز من APIs تجارية إلى نموذج Qwen مستضاف ذاتياً لتقليل زمن الاستجابة والتكلفة التشغيلية.',
      },
      {
        en: 'Shipped Souqak/Haraj AI negotiation agent, IFAF WebSocket social app, Al-Sorayai Family Play Store app, and native Biometric Attendance app.',
        ar: 'إطلاق وكيل التفاوض الذكي في السوق الإلكتروني، تطبيق IFAF اللحظي، تطبيق عائلة السريع على Google Play، وتطبيق الحضور بالبصمة وFaceID.',
      },
    ],
    tags: ['Laravel', 'Stancl/Tenancy', 'Qwen LLM', 'React Native', 'Three.js', 'WebSockets'],
  },
  {
    period: { en: 'Jan 2024 – Dec 2024', ar: 'يناير 2024 – ديسمبر 2024' },
    role: { en: 'Full-Stack Software Engineer', ar: 'مهندس برمجيات Full-Stack' },
    org: { en: 'Magic Linker — Enterprise B2B & B2C Marketplace · Remote (Yemen)', ar: 'ماجيك لينكر — سوق B2B و B2C متعدد التجار · عن بُعد (اليمن)' },
    bullets: [
      {
        en: 'Architected a multi-merchant e-commerce platform (web + Google Play app) with independent vendor onboarding, unified multi-vendor carts, and inventory control.',
        ar: 'تصميم وإطلاق سوق إلكتروني متعدد التجار (ويب وتطبيق على Google Play) مع تسجيل مستقل للتجار، سلة موحدة، وإدارة مخزون.',
      },
      {
        en: 'Integrated Stripe, PayPal, and Moyasar payment gateways for multi-currency checkouts and automated vendor commission settlements.',
        ar: 'ربط بوابات الدفع Stripe وPayPal وميسّر لمعالجة العملات المتعددة وتسوية عمولات التجار آلياً.',
      },
    ],
    tags: ['Laravel', 'React Native', 'Stripe', 'PayPal', 'Moyasar', 'MySQL'],
  },
  {
    period: { en: 'Jan 2022 – Dec 2023', ar: 'يناير 2022 – ديسمبر 2023' },
    role: { en: 'Full-Stack Developer', ar: 'مطور Full-Stack' },
    org: { en: 'International Client Systems — E-Learning & Streaming · Remote (Jordan & Iraq)', ar: 'أنظمة عملاء دوليين — تعليم وبث مباشر · عن بُعد (الأردن والعراق)' },
    bullets: [
      {
        en: 'Built custom LMS platforms (including Al-Sorayai Academy with 102+ courses / 3,824+ students and a Jordanian LMS serving thousands of learners).',
        ar: 'تطوير منصات تعليمية مخصصة (منها أكاديمية السريع بـ +102 دورة و+3,824 طالب، ومنصة أردنية تخدم آلاف الطلاب).',
      },
      {
        en: 'Engineered scalable IPTV backend REST API with granular RBAC and Android/TV player (Albasera, 100+ Play Store installs), maintaining production for 1 year post-launch.',
        ar: 'هندسة REST API لبث القنوات IPTV بصلاحيات RBAC دقيقة وتطبيق البصيرة (أندرويد وTV، +100 تحميل) مع سنة كاملة من صيانة الإنتاج.',
      },
    ],
    tags: ['Laravel', 'React', 'React Native', 'RBAC', 'IPTV / HLS'],
  },
  {
    period: { en: 'Jan 2021 – Dec 2021', ar: 'يناير 2021 – ديسمبر 2021' },
    role: { en: 'Full-Stack Developer', ar: 'مطور Full-Stack' },
    org: { en: 'FinTech & Core Web Systems · Remote', ar: 'أنظمة تكنولوجيا مالية وويب · عن بُعد' },
    bullets: [
      {
        en: 'Built a branch-based domestic remittance platform in Laravel with cryptographic transaction tokens, National ID verification, and synchronized multi-branch ledgers.',
        ar: 'بناء نظام تحويلات مالية محلية بين الفروع باستخدام Laravel مع رموز معاملات مشفرة، تحقق بالهوية الوطنية، وتحديث متزامن لدفاتر الفروع.',
      },
      {
        en: 'Developed an automated Forex analysis bot (OpenAI + Twelve Data) and refactored legacy MySQL queries, cutting average API response times by 30%.',
        ar: 'تطوير بوت تحليل فوركس آلي (OpenAI + Twelve Data) وإعادة هيكلة استعلامات MySQL القديمة لتقليل متوسط زمن استجابة الـ API بنسبة 30%.',
      },
    ],
    tags: ['Laravel', 'MySQL Tuning', 'Python', 'OpenAI API', 'FinTech'],
  },
]

export const EDUCATION: Localized[] = [
  {
    en: 'Professional Diploma in Software Engineering & Full-Stack Development — Intensive Technical Academy Program, Egypt',
    ar: 'دبلوم مهني في هندسة البرمجيات وتطوير Full-Stack — برنامج أكاديمي تقني مكثف، مصر',
  },
  {
    en: 'Docker & AWS Cloud Essentials — Coursera / Pluralsight',
    ar: 'أساسيات Docker وسحابة AWS — Coursera / Pluralsight',
  },
  {
    en: 'Advanced PHP & Laravel Engineering Certification — Udemy',
    ar: 'شهادة هندسة PHP وLaravel المتقدمة — Udemy',
  },
  {
    en: 'React Native Mobile Mastery Certification — Udemy',
    ar: 'شهادة إتقان تطوير تطبيقات الموبايل React Native — Udemy',
  },
]

export interface Collaborator {
  name: Localized
  role: Localized
  bio: Localized
  photo: string
  links: { label: string; href: string }[]
}

export const COLLABORATORS: Collaborator[] = [
  {
    name: PROFILE.name,
    role: { en: 'Principal Full-Stack & Systems Engineer', ar: 'مهندس برمجيات ونظم Full-Stack' },
    bio: {
      en: 'Owns system architecture, database isolation, APIs, mobile builds, AI pipelines, and cloud deployment end to end.',
      ar: 'مسؤول عن المعمارية الهندسية، عزل قواعد البيانات، واجهات البرمجة، تطبيقات الموبايل، أنظمة الذكاء الاصطناعي والنشر السحابي.',
    },
    photo: '/images/team/ibrahim-khaled.webp',
    links: [
      { label: 'GitHub', href: PROFILE.github },
      { label: 'LinkedIn', href: PROFILE.linkedin },
    ],
  },
  {
    name: { en: 'Ali Salem', ar: 'علي سالم' },
    role: { en: 'UI/UX Design Collaborator', ar: 'شريك تصميم واجهات وتجربة مستخدم UI/UX' },
    bio: {
      en: 'Product and UI/UX designer based in Egypt (2+ years). Partners with me on end-to-end client builds when a product needs dedicated UX research and Figma systems.',
      ar: 'مصمم منتجات وواجهات UI/UX من مصر (خبرة +2 سنوات). نتعاون سوياً في المشاريع التي تحتاج تصميم تجربة مستخدم كاملة ونظام تصميم على Figma قبل التطوير.',
    },
    photo: '/images/team/ali-salem.webp',
    links: [],
  },
]

export interface ClientQuote {
  quote: Localized
  author: Localized
  context: Localized
}

export const CLIENT_QUOTES: ClientQuote[] = [
  {
    quote: {
      en: "The best developer I've dealt with on Mostaql. Very understanding, fast, and respectful. We will continue our upcoming work together.",
      ar: 'أفضل مبرمج تعاملت معاه على مستقل، جداً متفهم وسريع ومحترم. الله يوفقك أستاذ إبراهيم وبإذن الله نكمل بقية أعمالنا سوياً.',
    },
    author: { en: 'Verified Mostaql Client', ar: 'عميل موثق على مستقل' },
    context: { en: 'Custom Web Platform Delivery', ar: 'تسليم منصة برمجية مخصصة' },
  },
  {
    quote: {
      en: 'Clear technical thinking and thorough explanation of every architectural point we needed before shipping.',
      ar: 'من أفضل الناس اللي تعاملت معهم، فاهم شغله وشكراً لوقتك وشرحك للنقاط التي احتاجها.',
    },
    author: { en: 'Direct Business Client', ar: 'عميل أعمال مباشر' },
    context: { en: 'Backend Architecture & API', ar: 'تطوير الخلفية والـ API' },
  },
  {
    quote: {
      en: 'Reliable engineering from start to store submission — delivered cleanly without surprises.',
      ar: 'مهندس رائع جداً، شكراً جزيلاً.. ألف نجمة مهندس، يسلم إيديك.',
    },
    author: { en: 'Mobile Product Owner', ar: 'صاحب تطبيق موبايل' },
    context: { en: 'Cross-Platform Mobile Build', ar: 'بناء وإطلاق تطبيق موبايل' },
  },
]

export const PRINCIPLES: { num: string; title: Localized; body: Localized }[] = [
  {
    num: '01',
    title: { en: 'Data integrity before UI polish', ar: 'سلامة البيانات قبل اللمسات الشكلية' },
    body: {
      en: 'Multi-tenant boundaries, transactional ledgers, and idempotent payment webhooks are designed first. A fast interface sitting on leaky schemas fails in production.',
      ar: 'حدود عزل المستأجرين، المعاملات المالية الذرية، وـ webhooks الدفع المقاومة للتكرار تُصمَّم أولاً. الواجهة الجميلة فوق قاعدة بيانات هشة تنهار عند أول ضغط حقيقي.',
    },
  },
  {
    num: '02',
    title: { en: 'Own the problem end to end', ar: 'ملكية كاملة من التصميم حتى الإنتاج' },
    body: {
      en: 'From SQL schema and Laravel/Node services to React Native store release and Linux/Docker infrastructure — one accountable engineer instead of handoff gaps.',
      ar: 'من مخطط SQL وخدمات Laravel/Node وحتى رفع التطبيق على Google Play وإعداد خوادم Linux وDocker — مهندس واحد مسؤول بدلاً من ضياع التفاصيل بين الفرق.',
    },
  },
  {
    num: '03',
    title: { en: 'Measure cost, latency, and trade-offs', ar: 'قياس التكلفة وزمن الاستجابة والمقايضات' },
    body: {
      en: 'Whether migrating off commercial LLM APIs to self-hosted Qwen or rewriting slow MySQL queries for a 30% speedup, architectural choices are justified by numbers, not hype.',
      ar: 'سواء بنقل الذكاء الاصطناعي إلى نموذج Qwen محلي أو إعادة هيكلة استعلامات MySQL لتحسين الأداء 30%، كل قرار معماري مبرَّر بالأرقام وليس بالموضة.',
    },
  },
]
