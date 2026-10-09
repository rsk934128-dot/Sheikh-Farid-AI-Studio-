import { DistrictThana, HotlineItem, SheikhProject, GmailLabel, GmailMessage, SampleVideo } from '../types';

export const BANGLADESH_DISTRICTS: DistrictThana[] = [
  {
    district: 'Dhaka',
    districtBn: 'ঢাকা',
    thanas: [
      'রমনা (Ramna)',
      'ধানমন্ডি (Dhanmondi)',
      'গুলশান (Gulshan)',
      'মিরপুর (Mirpur)',
      'উত্তরা (Uttara)',
      'শাহবাগ (Shahbagh)',
      'পল্টন (Paltan)',
      'মতিঝিল (Motijheel)',
      'তেজগাঁও (Tejgaon)',
      'মোহাম্মদপুর (Mohammadpur)',
      'যাত্রাবাড়ী (Jatrabari)',
      'বাড্ডা (Badda)',
      'বনানী (Banani)',
      'চকবাজার (Chawkbazar)',
      'কোতোয়ালি (Kotwali)',
    ],
  },
  {
    district: 'Chattogram',
    districtBn: 'চট্টগ্রাম',
    thanas: [
      'কোতোয়ালি (Kotwali)',
      'পাঁচলাইশ (Panchlaish)',
      'ডবলমুরিং (Double Mooring)',
      'খুলশী (Khulshi)',
      'পতেঙ্গা (Patenga)',
      'হালিশহর (Halishahar)',
      'চান্দগাঁও (Chandgaon)',
      'পাহাড়তলী (Pahartali)',
    ],
  },
  {
    district: 'Rajshahi',
    districtBn: 'রাজশাহী',
    thanas: [
      'বোয়ালিয়া (Boalia)',
      'মতিহার (Motihar)',
      'রাজপাড়া (Rajpara)',
      'শাহ মখদুম (Shah Makhdum)',
      'পবা (Paba)',
    ],
  },
  {
    district: 'Sylhet',
    districtBn: 'সিলেট',
    thanas: [
      'কোতোয়ালি (Kotwali)',
      'শাহপরাণ (Shahparan)',
      'বিমানবন্দর (Airport)',
      'দক্ষিণ সুরমা (South Surma)',
      'জালালাবাদ (Jalalabad)',
    ],
  },
  {
    district: 'Khulna',
    districtBn: 'খুলনা',
    thanas: [
      'সদর (Khulna Sadar)',
      'সোনাডাঙ্গা (Sonadanga)',
      'খালিশপুর (Khalishpur)',
      'দৌলতপুর (Daulatpur)',
      'খানজাহান আলী (Khan Jahan Ali)',
    ],
  },
  {
    district: 'Barishal',
    districtBn: 'বরিশাল',
    thanas: [
      'কোতোয়ালি (Kotwali)',
      'কাউনিয়া (Kaunia)',
      'বিমানবন্দর (Airport)',
      'রূপাতলী (Rupatali)',
    ],
  },
  {
    district: 'Rangpur',
    districtBn: 'রংপুর',
    thanas: [
      'কোতোয়ালি (Kotwali)',
      'তাজহাট (Tajhat)',
      'পরশুরাম (Parshuram)',
      'হাজীরহাট (Hajirhat)',
      'হারাগাছ (Haragach)',
    ],
  },
  {
    district: 'Mymensingh',
    districtBn: 'ময়মনসিংহ',
    thanas: [
      'কোতোয়ালি (Kotwali)',
      'মুক্তাগাছা (Muktagachha)',
      'ত্রিশাল (Trishal)',
      'ভালুকা (Bhaluka)',
    ],
  },
  {
    district: 'Bogura',
    districtBn: 'বগুড়া',
    thanas: ['বগুড়া সদর (Bogura Sadar)', 'শাজাহানপুর (Shajahanpur)', 'শেরপুর (Sherpur)'],
  },
  {
    district: 'Cumilla',
    districtBn: 'কুমিল্লা',
    thanas: ['কোতোয়ালি মডেল (Kotwali Model)', 'সদর দক্ষিণ (Sadar South)', 'বুড়িচং (Burichang)'],
  },
];

export const NATIONAL_HOTLINES: HotlineItem[] = [
  {
    number: '999',
    title: 'National Emergency Service',
    titleBn: 'জাতীয় জরুরি সেবা',
    category: 'পুলিশ, ফায়ার ও অ্যাম্বুলেন্স',
    description: 'বাংলাদেশ পুলিশ, ফায়ার সার্ভিস ও সিভিল ডিফেন্স এবং অ্যাম্বুলেন্স সহায়তার জন্য ২৪/৭ সার্বক্ষণিক ফ্রি কল।',
    isEmergency: true,
    available: '২৪ ঘণ্টা / প্রতিদিন (টোল ফ্রি)',
  },
  {
    number: '333',
    title: 'Citizen Information & Services',
    titleBn: 'নাগরিক সেবা ও সরকারি তথ্য',
    category: 'সরকারি সেবার তথ্য ও অভিযোগ',
    description: 'সরকারি দপ্তরসমূহের তথ্য সেবা, দুর্যোগকালীন সহায়তা এবং সামাজিক সমস্যার প্রতিকারের প্ল্যাটফর্ম।',
    isEmergency: false,
    available: '২৪ ঘণ্টা / প্রতিদিন',
  },
  {
    number: '109',
    title: 'Women & Child Helpline',
    titleBn: 'নারী ও শিশু নির্যাতন প্রতিরোধ হেল্পলাইন',
    category: 'সুরক্ষা ও নিরাপত্তা',
    description: 'নারী ও শিশুর ওপর যেকোনো নির্যাতন, পারিবারিক সহিংসতা বা বাল্যবিয়ে প্রতিরোধে তাৎক্ষণিক আইনি সহায়তা।',
    isEmergency: true,
    available: '২৪ ঘণ্টা / প্রতিদিন (টোল ফ্রি)',
  },
  {
    number: '106',
    title: 'Anti-Corruption Commission (ACC)',
    titleBn: 'দুদক অভিযোগ কেন্দ্র',
    category: 'দুর্নীতি প্রতিরোধ',
    description: 'যেকোনো সরকারি কর্মকর্তা-কর্মচারীর দুর্নীতি ও ঘুষ গ্রহণের তথ্য তাৎক্ষণিক গোপনে জানানোর হটলাইন।',
    isEmergency: false,
    available: 'অফিস চলাকালীন (টোল ফ্রি)',
  },
  {
    number: '16122',
    title: 'Land Service Customer Care',
    titleBn: 'ভূমি সেবা কাস্টমার কেয়ার',
    category: 'খতিয়ান, নামজারি ও ভূমি উন্নয়ন কর',
    description: 'ই-নামজারি, জমির পর্চা বা খতিয়ান সংগ্রহ এবং ভূমি সংক্রান্ত সব ধরণের আইনি ও প্রক্রিয়াগত পরামর্শ।',
    isEmergency: false,
    available: 'সকাল ৭টা - রাত ১০টা',
  },
  {
    number: '16121',
    title: 'Health Batayan',
    titleBn: 'স্বাস্থ্য বাতায়ন',
    category: 'টেলিমেডিসিন ও ডাক্তার পরামর্শ',
    description: 'রেজিস্টার্ড এমবিবিএস ডাক্তারের কাছ থেকে যেকোনো শারীরিক অসুস্থতায় তাৎক্ষণিক ফ্রি স্বাস্থ্য পরামর্শ।',
    isEmergency: false,
    available: '২৪ ঘণ্টা / প্রতিদিন',
  },
  {
    number: '1098',
    title: 'Child Helpline',
    titleBn: 'চাইল্ড হেল্পলাইন',
    category: 'শিশু অধিকার ও সুরক্ষা',
    description: 'ঝুঁকিতে থাকা শিশুদের সহায়তা, নিখোঁজ শিশু উদ্ধার এবং আইনি সুরক্ষার জন্য ২৪/৭ সেবা।',
    isEmergency: true,
    available: '২৪ ঘণ্টা / প্রতিদিন (টোল ফ্রি)',
  },
];

export const SHEIKH_PROJECTS: SheikhProject[] = [
  {
    id: 'scrollverse',
    title: 'ScrollVerse (স্ক্রোলভার্স)',
    tagline: 'The Next-Gen Infinite Spatial Canvas & Productivity Workspace',
    badge: 'Flagship Core',
    status: 'Production',
    techStack: ['React 19', 'Canvas API', 'TypeScript', 'Motion', 'Web Workers'],
    description: 'অসীম জুম ও ক্যানভাস প্রযুক্তিভিত্তিক মাল্টিটাস্কিং আর্কিটেকচার, যা সাধারণ ব্রাউজারে ডেক্সটপ সমতুল্য উইন্ডো ম্যানেজমেন্ট প্রদান করে।',
    highlights: [
      'ইনফিনিট স্পেশিয়াল ক্যানভাস ভিউপোর্ট',
      'মাল্টি-টাস্ক উইন্ডো ক্যাশিং ও স্ন্যাপিং',
      'শূন্য ফ্রেম ড্রপ এবং ৬৫% মেমোরি অপ্টিমাইজেশন',
      'বাংলা ফন্ট রেন্ডারিং ইঞ্জিন সমন্বয়',
    ],
    githubUrl: 'https://github.com/sf0745026/scrollverse',
    liveDemoUrl: '#',
    iconName: 'Layers',
  },
  {
    id: 'citizendesk-bd',
    title: 'CitizenDesk BD (সার্ভিস সরকার)',
    tagline: 'Public Service & GovTech Legal Automation Engine',
    badge: 'GovTech BD',
    status: 'Production',
    techStack: ['React 19', 'Tailwind CSS v4', 'Gemini AI API', 'PWA Engine'],
    description: 'অনলাইন জিডি ও প্রশাসনিক আবেদনপত্র প্রস্তুতের সর্বাধুনিক ডিজিটাল প্ল্যাটফর্ম। থানাভিত্তিক নিখুঁত ফরম্যাটিং এবং তাৎক্ষণিক প্রিন্ট সুবিধা।',
    highlights: [
      '৬৪ জেলার থানাভিত্তিক জিডি ফরম্যাট জেনারেটর',
      'সরকারি স্ট্যান্ডার্ড ছুটির আবেদনপত্র খসড়া',
      'এক ক্লিকে ৯৯৯ ও ৩৩৩ জরুরি হটলাইন ডায়াল',
      'সম্পূর্ণ অফলাইন প্রস্তুত ও লোকাল ক্যাশ ব্যাকড',
    ],
    githubUrl: 'https://github.com/sf0745026/citizendesk-bd',
    liveDemoUrl: '#',
    iconName: 'FileCheck',
  },
  {
    id: 'noorai-edge',
    title: 'NoorAI & FastGov Edge',
    tagline: 'Ultra-Low Latency Bengali AI Model & Edge Inferencing',
    badge: 'AI Engine',
    status: 'Beta',
    techStack: ['@google/genai', 'Gemini 3.1 Pro', 'Edge Cache', 'Node.js Express'],
    description: 'বাংলা ভাষার ব্যাকরণ, আইনি পরিভাষা ও সরকারি সেবার নির্ভুল তথ্য পরিবেশনে বিশেষায়িত প্রম্পট ইঞ্জিন ও এজ ক্যাশ প্রযুক্তি।',
    highlights: [
      'Gemini 3.1 Pro মাল্টিমোডাল ভিডিও ও টেক্সট অনুধাবন',
      'প্রশাসনিক প্রশ্নের জন্য 0ms লোকাল ক্যাশ রেসপন্স',
      'আইনি নথিপত্রের জন্য লিগ্যাল টার্মিনোলজি গার্ডরেল',
      'দ্বিভাষিক (বাংলা-ইংরেজি) সুনির্দিষ্ট সারসংক্ষেপ',
    ],
    githubUrl: 'https://github.com/sf0745026/noor-ai',
    liveDemoUrl: '#',
    iconName: 'Cpu',
  },
  {
    id: 'code-exchange',
    title: 'Sheikh Code Exchange & Proxy Lab',
    tagline: 'Developer Network Utility, V2Ray & Security Script Studio',
    badge: 'DevOps & NetSec',
    status: 'Active',
    techStack: ['V2Ray/Xray Core', '3X-UI', 'WireGuard', 'Bash Scripts'],
    description: 'সার্ভার ও ভিপিএন টানেলিং আর্কিটেকচার, অটোমেটেড স্ক্রিপ্ট জেনারেশন ও ক্লাউড ডেভলপারদের জন্য নিরাপদ কনফিগারেশন হাব।',
    highlights: [
      '3X-UI এক ক্লিকে ইনস্টলেশন গাইড ও স্ক্রিপ্ট',
      'V2Ray VMess/WebSocket কনফিগারেশন জেনারেটর',
      'UUID ও প্রাইভেট নেটওয়ার্ক এনক্রিপশন টুল',
      'সাইবার সিকিউরিটি ও লফুল কমপ্লায়েন্স অ্যাডভাইজরি',
    ],
    githubUrl: 'https://github.com/sf0745026/code-exchange',
    liveDemoUrl: '#',
    iconName: 'Terminal',
  },
  {
    id: 'mini-ms-suite',
    title: 'Mini Microsoft Suite',
    tagline: 'All-in-One PWA Desktop Ecosystem for Bengali Creators',
    badge: 'PWA Suite',
    status: 'Production',
    techStack: ['PWA Manifest', 'Workbox', 'Vite 6', 'TypeScript', 'Tailwind CSS'],
    description: 'একটি ওয়েব অ্যাপে অফিস স্যুট, এআই ল্যাব, জিমেইল ফিল্টারিং ও সিটিজেন সার্ভিস। ১০০/১০০ মাইক্রোসফট PWABuilder স্কোর অর্জনকারী।',
    highlights: [
      '১০০/১০০ মাইক্রোসফট PWABuilder কমপ্লায়েন্স',
      'ফুলস্ক্রিন অফলাইন ফার্স্ট অ্যাপ্লিকেশন',
      'জিমেইল ওয়ার্কস্পেস রেস্ট এপিআই ও ডেমো মোড',
      'মোবাইল, ট্যাবলেট ও ডেসটপ রেসপন্সিভ গ্রিড',
    ],
    githubUrl: 'https://github.com/sf0745026/mini-ms-suite',
    liveDemoUrl: '#',
    iconName: 'LayoutGrid',
  },
];

export const ZERO_LATENCY_CACHE: Record<string, string> = {
  'gd-nid': `বিষয়: জাতীয় পরিচয়পত্র (NID) হারানোর কারণে সাধারণ ডায়েরি (জিডি) আবেদন নির্দেশিকা

১. প্রয়োজনীয় তথ্য: NID নম্বর, হারানোর স্থান, সম্ভাব্য সময় ও এলাকার প্রত্যক্ষদর্শীর বিবরণ।
২. ফি: থানায় জিডি করার জন্য কোনো সরকারি ফি প্রদান করতে হয় না (সম্পূর্ণ ফ্রি)।
৩. পরবর্তী পদক্ষেপ: জিডি নম্বর সংবলিত কপি নিয়ে বাংলাদেশ নির্বাচন কমিশন (ইসি) এর ওয়েবসাইটে (services.nidw.gov.bd) গিয়ে পুনরায় NID কার্ড রি-ইস্যু আবেদন করতে হবে।
৪. প্রয়োজনীয় কাগজপত্র: জিডির কপি, অনলাইন ফি এবং প্রযোজ্য ক্ষেত্রে জন্ম নিবন্ধন।`,

  'leave-casual': `প্রশাসনিক ছুটির নিয়মাবলী (নৈমিত্তিক ছুটি - Casual Leave):
১. সরকারি বিধি মোতাবেক বছরে সাধারণ সরকারি কর্মচারীগণ সর্বোচ্চ ২০ দিনের নৈমিত্তিক ছুটি ভোগ করতে পারেন।
২. একবারে সচরাচর সর্বোচ্চ ৩ দিনের বেশি নৈমিত্তিক ছুটি অনুমোদনযোগ্য নয় (বিশেষ কারণ ব্যতিরেকে)।
৩. ছুটির আবেদনের সাথে কর্মস্থলে অনুপস্থিতিকালীন দায়িত্ব পালনকারীর নাম ও জরুরি যোগাযোগের ঠিকানা উল্লেখ বাধ্যতামূলক।`,

  'hotline-emergency': `জরুরি জাতীয় হেল্পলাইন নির্দেশিকা:
• ৯৯৯: তাৎক্ষণিক পুলিশ পাহারা, সড়ক দুর্ঘটনা উদ্ধার, অগ্নিকাণ্ড এবং সংকটকালীন মেডিকেল সহায়তা।
• ৩৩৩: সরকারি ভাতা, বয়স্ক ভাতা, নাগরিক সনদের নিয়মাবলী ও সরকারি সেবা সংক্রান্ত অভিযোগ।
• ১০৯: বাল্যবিয়ে রোধ ও পারিবারিক সহিংসতায় সরাসরি পুলিশ প্রশাসনের সাথে সংযোগ স্থাপন।`,
};

export const SAMPLE_VIDEOS: SampleVideo[] = [
  {
    id: 'video-govtech-summit',
    title: 'Smart Bangladesh GovTech & Cybersecurity Summit',
    titleBn: 'স্মার্ট বাংলাদেশ গভটেক ও সাইবার নিরাপত্তা সম্মেলন',
    duration: '03:45',
    category: 'GovTech & Security',
    description: 'বাংলাদেশ সরকারের ডিজিটাল নাগরিক সেবা সম্প্রসারণ, অনলাইন জিডি সিস্টেমের নিরাপত্তা এবং এআই প্ল্যাটফর্ম বাস্তবায়নের মূল আলোচনা।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
    presetKeyInfo: `📌 নির্বাহী সারসংক্ষেপ (Executive Summary):
সম্মেলনে বাংলাদেশ পাবলিক সার্ভিসের ডিজিটালাইজেশন এবং অনলাইন জিডি প্রক্রিয়ার আধুনিকায়নের ওপর জোর দেওয়া হয়েছে।

⏱️ সময়রেখা ও মূল তথ্যাবলী (Key Information & Timestamps):
• 00:15 - ডিজিটাল বাংলাদেশের অগ্রগতি এবং ৬৪ জেলার থানা নেটওয়ার্ক সংযুক্তি।
• 01:20 - হারানো পাসপোর্ট, ড্রাইভিং লাইসেন্স ও NID ট্র্যাকিংয়ে কেন্দ্রীয় ডেটাবেস প্রণয়ন।
• 02:40 - সাইবার নিরাপত্তা সচেতনতা ও অনুমোদিত প্রক্সি/ভিপিএন পলিসি ঘোষণা।

🎯 সিদ্ধান্ত ও করণীয়:
১. নাগরিক সেন্টারে হেল্পডেস্ক স্থাপন।
২. তাৎক্ষণিক এসএমএস ভেরিফিকেশন সিস্টেম চালু।`,
  },
  {
    id: 'video-server-tunneling',
    title: 'Cloud VPS Setup & V2Ray 3X-UI Architecture Guide',
    titleBn: 'ক্লাউড ভিপিএস ও 3X-UI ভিপিএন আর্কিটেকচার টিউটোরিয়াল',
    duration: '05:12',
    category: 'DevOps & Networking',
    description: 'উবুন্টু ২২.০৪ সার্ভারে V2Ray কোর, WebSocket ও TLS এনক্রিপশন কনফিগারেশন এবং মাল্টি-ইউজার ড্যাশবোর্ড সেটআপের বিস্তারিত।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80',
    presetKeyInfo: `📌 নির্বাহী সারসংক্ষেপ (Executive Summary):
ক্লাউড সার্ভারে প্রাইভেট ভিপিএন টানেল তৈরির জন্য V2Ray (VMess/VLess) ও 3X-UI ড্যাশবোর্ড সেটআপের পূর্ণাঙ্গ নির্দেশনা।

⏱️ সময়রেখা ও মূল তথ্যাবলী:
• 00:30 - DigitalOcean / Linode VPS-এ Ubuntu 22.04 LTS প্রোভিশনিং।
• 01:45 - 3X-UI এক-ক্লিক ব্যাশ স্ক্রিপ্ট এক্সিকিউশন ও পোর্ট ২০৫৩ ওপেনিং।
• 03:10 - SSL সার্টিফিকেট ও Cloudflare CDN প্রক্সি রুট কনফিগারেশন।
• 04:35 - Android V2RayNG ক্লায়েন্টে QR কোড ইমপোর্ট ও সফল কানেকশন।

🎯 সিদ্ধান্ত ও করণীয়:
• প্রতিটি ইউজারের জন্য পৃথক UUID ও ডেটা কোটা নির্ধারণ।
• আইনি কাঠামো নিশ্চিতকরণ।`,
  },
  {
    id: 'video-ai-law-rights',
    title: 'Citizen Rights & Digital Legal Document Workflow',
    titleBn: 'নাগরিক অধিকার ও অনলাইন আইনি নথি তৈরি নির্দেশিকা',
    duration: '02:30',
    category: 'Legal & Rights',
    description: 'নাগরিকদের যেকোনো দলিল, হারানো মালামাল এবং সাধারণ ডায়েরির আইনি গুরুত্ব ও নির্বাচন কমিশন রি-ইস্যু প্রক্রিয়া।',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    presetKeyInfo: `📌 নির্বাহী সারসংক্ষেপ (Executive Summary):
আইনি জটিলতা এড়াতে যেকোনো জরুরি ডকুমেন্ট হারানোর সাথে সাথে থানায় সাধারণ ডায়েরি (GD) করার প্রয়োজনীয়তা।

⏱️ সময়রেখা ও মূল তথ্যাবলী:
• 00:20 - পুলিশ রেগুলেশনস অব বেঙ্গল (PRB) অনুযায়ী জিডির সংজ্ঞা ও তাৎপর্য।
• 01:05 - হারানো NID দিয়ে প্রতারণা প্রতিরোধে জিডি নম্বরের কার্যকারিতা।
• 02:00 - ছুটির আবেদনের সরকারি ফর্ম ও অফিসিয়াল প্রক্রিয়া।`,
  },
];

export const DEMO_EMAILS: GmailMessage[] = [
  {
    id: 'msg_001',
    threadId: 'th_001',
    labelIds: ['INBOX', 'IMPORTANT', 'Label_GovTech'],
    sender: 'Bangladesh Police CitizenDesk',
    senderEmail: 'support@police.gov.bd',
    subject: 'অনলাইন জিডি নিশ্চিতকরণ ও ডায়েরি নম্বর প্রদান - GD #84920/2026',
    date: 'আজ, ১০:৪২ AM',
    snippet: 'জনাব মোহাম্মদ শেখ ফরিদ, আপনার রমনা মডেল থানায় দাখিলকৃত হারানো জাতীয় পরিচয়পত্রের সাধারণ ডায়েরি সফলভাবে গৃহীত হয়েছে...',
    body: `প্রিয় নাগরিক,

আপনার অনলাইন সাধারণ ডায়েরি (GD) সফলভাবে সংশ্লিষ্ট থানায় সংরক্ষিত হয়েছে।

বিস্তারিত বিবরণ:
• জিডি ট্র্যাকিং নং: GD-RAM-84920-2026
• থানা: রমনা মডেল থানা, ঢাকা
• আবেদনকারীর নাম: মোহাম্মদ শেখ ফরিদ
• হারানোর বিষয়: গণপ্রজাতন্ত্রী বাংলাদেশ জাতীয় পরিচয়পত্র (NID)
• তদন্তকারী কর্মকর্তা: এসআই মোঃ নাজমুল হাসান (মোবাইল: 01711-XXXXXX)

জরুরি প্রয়োজনে নির্বাচন কমিশন বা ব্যাংকে এই ডায়েরি নম্বর উপস্থাপন করতে পারবেন।

ধন্যবাদান্তে,
অনলাইন সিটিজেনডেস্ক সেল
বাংলাদেশ পুলিশ`,
    isStarred: true,
    isRead: false,
  },
  {
    id: 'msg_002',
    threadId: 'th_002',
    labelIds: ['INBOX', 'Label_Projects'],
    sender: 'GitHub Studio Actions',
    senderEmail: 'notifications@github.com',
    subject: '[Sheikh Studio Hub] Build successful: Video Understanding Engine v3.1',
    date: 'গতকাল, ০৫:১৫ PM',
    snippet: 'Workflow "Gemini Pro 3.1 Multimodal Pipeline" completed successfully on main branch...',
    body: `Hi Sheikh Farid,

Your repository "sf0745026/sheikh-farid-ai-studio" just finished running the test suite and production build.

Key Milestones:
- Video keyframe extraction optimized (under 300ms)
- Gemini 3.1 Pro integration validated with deep multimodal prompts
- Zero-latency GovTech edge cache benchmark: 0.2ms retrieval
- PWA Builder Audit score: 100/100

Commit: f9a812b - "Add Gemini 3.1 Pro Video Understanding Module"
Status: 🟢 Passing All Checks`,
    isStarred: true,
    isRead: true,
  },
  {
    id: 'msg_003',
    threadId: 'th_003',
    labelIds: ['INBOX', 'Label_Security'],
    sender: 'Cloud Security Alert',
    senderEmail: 'security@cloud-vps.io',
    subject: 'V2Ray & 3X-UI Node Health: 99.98% Uptime in SG Region',
    date: '০৮ অক্টোবর, ০৯:০০ AM',
    snippet: 'Your private network tunnel node sg-node-01 passed automated latency and bandwidth checks...',
    body: `Security Audit Summary:
Node: sg-node-01 (Singapore Region)
Protocols Active: V2Ray VMess + WebSocket (TLS on port 443)
Traffic Monitored: 42.5 GB transferred, 0 security anomalies.
Active Sessions: 3 private admin users verified.
No suspicious inbound intrusion detected.

Keep your server security credentials and SSH keys rotated regularly.`,
    isStarred: false,
    isRead: true,
  },
  {
    id: 'msg_004',
    threadId: 'th_004',
    labelIds: ['SENT'],
    sender: 'Sheikh Farid',
    senderEmail: 'sf0745026@gmail.com',
    subject: 'স্মার্ট সিটিজেনশিপ ও ডিজিটাল গভর্নেন্স প্রজেক্ট ড্রাফট প্রস্তাবনা',
    date: '০৭ অক্টোবর, ০৩:৩০ PM',
    snippet: 'শ্রদ্ধেয় মহোদয়, আমি ডিজিটাল বাংলাদেশের সরকারি নাগরিক সেবা সহজীকরণের জন্য CitizenDesk BD এর একটি সম্পূর্ণ ড্রাফট...',
    body: `শ্রদ্ধেয় মহোদয়,

আসসালামু আলাইকুম।
আমি সাধারণ নাগরিক এবং তরুণ ডেভেলপারদের সুবিধার্থে একটি মিনি মাইক্রোসফট ইকোসিস্টেম ও সিটিজেনডেস্ক তৈরি করেছি। এতে সাধারণ মানুষ ঘরে বসেই নির্ভুল ফরম্যাটে জিডি খসড়া করতে পারবে এবং জরুরি হেল্পলাইনে কল করতে পারবে।

বিস্তারিত প্রজেক্ট লিঙ্ক সংযুক্ত করা হলো।

বিনীত,
মোহাম্মদ শেখ ফরিদ`,
    isStarred: false,
    isRead: true,
  },
];
