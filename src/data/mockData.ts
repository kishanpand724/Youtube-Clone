import { Channel, Video, Comment } from '../types';

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'ch_tech',
    name: 'TechVision Labs',
    handle: '@techvisionlabs',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
    subscribers: '1.42M',
    subscriberCount: 1420000,
    verified: true,
    description: 'Deep dives into futuristic artificial intelligence, cutting-edge hardware, and software engineering masterpieces.',
    joinedDate: 'Jan 15, 2019'
  },
  {
    id: 'ch_code',
    name: 'CodeCraft Master',
    handle: '@codecraftmaster',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
    subscribers: '890K',
    subscriberCount: 890000,
    verified: true,
    description: 'Learn full-stack web development, React, TypeScript, and modern AI app creation step-by-step.',
    joinedDate: 'Mar 22, 2020'
  },
  {
    id: 'ch_gaming',
    name: 'PixelForge Gaming',
    handle: '@pixelforge',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
    subscribers: '2.1M',
    subscriberCount: 2100000,
    verified: true,
    description: 'Ultra 4K RTX gaming walkthroughs, speedruns, esports highlights, and game design breakdowns.',
    joinedDate: 'Nov 10, 2018'
  },
  {
    id: 'ch_music',
    name: 'Lofi Chill Vibes',
    handle: '@lofichillvibes',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&auto=format&fit=crop&q=80',
    subscribers: '3.5M',
    subscriberCount: 3500000,
    verified: true,
    description: '24/7 relaxing lo-fi beats for studying, coding, relaxing, and deep focus.',
    joinedDate: 'Jul 4, 2017'
  },
  {
    id: 'ch_cooking',
    name: 'Gourmet Kitchen',
    handle: '@gourmetkitchen',
    avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
    banner: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&auto=format&fit=crop&q=80',
    subscribers: '520K',
    subscriberCount: 520000,
    verified: false,
    description: 'Delicious artisan recipes, masterchef techniques, and quick 15-minute weeknight dinners.',
    joinedDate: 'Sep 18, 2021'
  }
];

export const INITIAL_VIDEOS: Video[] = [
  {
    id: 'vid_1',
    title: 'Building a Full-Stack AI App in 10 Minutes with React & Gemini',
    description: 'In this step-by-step tutorial, you will learn how to build an ultra-fast full-stack web app integrated with Gemini 3.8 Flash API! We cover Express server setup, streaming responses, and responsive Tailwind styling.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
    duration: '9:56',
    views: '248K views',
    viewCount: 248000,
    uploadedAt: '2 days ago',
    category: 'Coding',
    tags: ['react', 'ai', 'gemini', 'typescript', 'webdev'],
    channel: INITIAL_CHANNELS[1],
    likes: 18400,
    dislikes: 120,
    isLiked: false
  },
  {
    id: 'vid_2',
    title: 'The Future of Quantum Computing & Neural Hardware Breakthroughs',
    description: 'Quantum processing units are reaching new coherence benchmarks. Today we analyze the physical mechanics of superconducting qubits and how photonics may disrupt classical silicon forever.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    duration: '14:20',
    views: '612K views',
    viewCount: 612000,
    uploadedAt: '5 days ago',
    category: 'Tech',
    tags: ['quantum', 'hardware', 'futuretech', 'physics'],
    channel: INITIAL_CHANNELS[0],
    likes: 42100,
    dislikes: 350,
    isLiked: false
  },
  {
    id: 'vid_3',
    title: 'Unreal Engine 5.5 Ultra Realistic Cyberpunk City Environment Drive',
    description: 'Witness next-gen Lumen lighting and Nanite geometry in action as we cruise through a dense rainy cyberpunk metropolis at 4K 120FPS with full ray tracing enabled.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80',
    duration: '11:04',
    views: '1.2M views',
    viewCount: 1200000,
    uploadedAt: '1 week ago',
    category: 'Gaming',
    tags: ['unrealengine5', 'rtx4090', 'cyberpunk', 'gaming'],
    channel: INITIAL_CHANNELS[2],
    likes: 89000,
    dislikes: 920,
    isLiked: false
  },
  {
    id: 'vid_4',
    title: 'Midnight Lofi Beats - Chill Beats to Relax / Study / Code to 🎧',
    description: 'Smooth atmospheric lo-fi hip hop instrumental selection. Perfect companion for late night coding sessions, reading, homework, or unwinding after a long day.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    duration: '45:00',
    views: '3.8M views',
    viewCount: 3800000,
    uploadedAt: '2 weeks ago',
    category: 'Music',
    tags: ['lofi', 'chillbeats', 'study', 'relaxing'],
    channel: INITIAL_CHANNELS[3],
    likes: 210000,
    dislikes: 1100,
    isLiked: false
  },
  {
    id: 'vid_5',
    title: 'How to Bake Authentic Italian Neapolitan Pizza at Home from Scratch',
    description: 'Master the secrets of 72-hour cold-fermented pizza dough, San Marzano sauce preparation, and high-heat home baking techniques for crispy, airy crusts.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
    duration: '18:32',
    views: '450K views',
    viewCount: 450000,
    uploadedAt: '3 weeks ago',
    category: 'Cooking',
    tags: ['pizza', 'cooking', 'italian', 'recipes'],
    channel: INITIAL_CHANNELS[4],
    likes: 31500,
    dislikes: 210,
    isLiked: false
  },
  {
    id: 'vid_6',
    title: '10 Clean Architecture Tips for Scalable React Applications',
    description: 'Stop building monolithic React components! Learn how custom hooks, layer separation, atomic component design, and smart memoization transform spaghetti code into elegant systems.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyances.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    duration: '16:45',
    views: '320K views',
    viewCount: 320000,
    uploadedAt: '1 month ago',
    category: 'Coding',
    tags: ['react', 'cleanarchitecture', 'typescript', 'frontend'],
    channel: INITIAL_CHANNELS[1],
    likes: 24300,
    dislikes: 180,
    isLiked: false
  },
  {
    id: 'vid_7',
    title: 'Top 5 AI Tools Every Software Engineer Must Use in 2026',
    description: 'We review the top generative AI tools, code agents, and context-aware copilots that boost developer productivity by 3x.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80',
    duration: '12:15',
    views: '890K views',
    viewCount: 890000,
    uploadedAt: '3 days ago',
    category: 'AI',
    tags: ['ai', 'developer', 'productivity', 'tools'],
    channel: INITIAL_CHANNELS[0],
    likes: 67000,
    dislikes: 410,
    isLiked: false
  },
  {
    id: 'vid_8',
    title: 'Tears of Steel - Cinematic VFX Breakdown & Open Source Short Film',
    description: 'Explore the VFX compositing and open-source animation production behind Tears of Steel. Features high contrast cyberpunk futuristic aesthetic.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80',
    duration: '12:14',
    views: '1.5M views',
    viewCount: 1500000,
    uploadedAt: '2 months ago',
    category: 'Tech',
    tags: ['vfx', 'cyberpunk', 'blender', 'cinema'],
    channel: INITIAL_CHANNELS[0],
    likes: 115000,
    dislikes: 800,
    isLiked: false
  }
];

export const INITIAL_SHORTS: Video[] = [
  {
    id: 'short_1',
    title: '3 CSS Tricks You Wish You Knew Sooner! 🚀 #shorts #css #webdev',
    description: 'Quick CSS flexbox & grid secrets for instant responsive designs.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=500&auto=format&fit=crop&q=80',
    duration: '0:30',
    views: '1.8M views',
    viewCount: 1800000,
    uploadedAt: 'Yesterday',
    category: 'Coding',
    tags: ['shorts', 'css'],
    channel: INITIAL_CHANNELS[1],
    likes: 142000,
    dislikes: 800,
    isShort: true
  },
  {
    id: 'short_2',
    title: 'Insane 1v4 Clutch in Cyberpunk Tournament! 🎮 #shorts #gaming',
    description: 'Unbelievable reflex shot to secure match point!',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
    duration: '0:45',
    views: '2.4M views',
    viewCount: 2400000,
    uploadedAt: '3 days ago',
    category: 'Gaming',
    tags: ['shorts', 'gaming'],
    channel: INITIAL_CHANNELS[2],
    likes: 230000,
    dislikes: 1200,
    isShort: true
  },
  {
    id: 'short_3',
    title: 'Secret Knife Technique Chefs Don\'t Tell You 🔪 #shorts #cooking',
    description: 'How to dice onions 5x faster with zero tears.',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=500&auto=format&fit=crop&q=80',
    duration: '0:25',
    views: '980K views',
    viewCount: 980000,
    uploadedAt: '4 days ago',
    category: 'Cooking',
    tags: ['shorts', 'food'],
    channel: INITIAL_CHANNELS[4],
    likes: 87000,
    dislikes: 430,
    isShort: true
  }
];

export const INITIAL_COMMENTS: Record<string, Comment[]> = {
  vid_1: [
    {
      id: 'c_101',
      videoId: 'vid_1',
      channelId: 'ch_tech',
      authorName: 'Alex Rivera',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: 'This video saved me so much time! The clean backend logic with Gemini API integration is top notch.',
      timestamp: '1 day ago',
      likes: 342,
      replies: [
        {
          id: 'c_101_r1',
          videoId: 'vid_1',
          channelId: 'ch_code',
          authorName: 'CodeCraft Master',
          authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          text: 'Appreciate it Alex! Next video will cover real-time streaming hooks.',
          timestamp: '22 hours ago',
          likes: 89
        }
      ]
    },
    {
      id: 'c_102',
      videoId: 'vid_1',
      channelId: 'ch_user',
      authorName: 'DevSamurai',
      authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      text: 'Loved the breakdown at 4:20. Super easy to follow even for beginners!',
      timestamp: '2 days ago',
      likes: 128
    }
  ],
  vid_2: [
    {
      id: 'c_201',
      videoId: 'vid_2',
      channelId: 'ch_code',
      authorName: 'Dr. Sarah Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
      text: 'Great explanation of qubit decoherence times! The graphics made the superconducting state intuitive.',
      timestamp: '4 days ago',
      likes: 512
    }
  ]
};

export const CATEGORIES = [
  'All',
  'Coding',
  'Tech',
  'Gaming',
  'AI',
  'Music',
  'Cooking',
  'Podcasts',
  'Live',
  'Recently uploaded'
];
