/**
 * Social Feed, Community UGC Showcase, 2D Minecraft Build Schematics & Screenshot Sharing Manager
 * 'United Games and Apps of Sprnuki Thomas and Friends' RPG
 */

import { collection, doc, getDocs, setDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatarType?: string;
  text: string;
  createdAt: number;
}

export interface BuildSchematic {
  dimensions: string;
  blockCount: number;
  primaryMaterials: string[];
  gridPreview: string[][]; // 2D array of block types: rows x cols
  worldCoordinates?: { x: number; y: number; biome: string };
  schematicName: string;
  difficulty: 'Easy' | 'Intermediate' | 'Master' | 'Legendary';
}

export interface ScreenshotHighlight {
  locationName: string;
  coordinates: string;
  biome: string;
  cameraAngle: string;
  visualTheme: string;
  sceneStyle: 'sunset_citadel' | 'nether_warden' | 'streamer_stage' | 'roblox_tower' | 'golden_carnival' | 'waitangi_bay';
  resolution: string;
  featuredPlayers: string[];
}

export interface RobloxExperienceShareData {
  gameId: string;
  gameName: string;
  emoji: string;
  category: string;
  genre: string;
  description: string;
  playerCount: string;
  rating: string;
  bannerGradient: string;
  badge?: string;
  socialPreviewUrl?: string;
  metaTags?: string[];
  shareTimestamp?: number;
}

export interface SocialPost {
  id: string;
  type: 'minecraft_2d_build' | 'community_screenshot' | 'ugc_skin' | 'megaworld_video' | 'roblox_experience_share';
  title: string;
  caption: string;
  author: {
    uid: string;
    name: string;
    avatarType: string;
    avatarSubtype?: string;
    verified?: boolean;
    rankTitle?: string;
    classTitle?: string;
  };
  brandTheme: 'Minecraft' | 'Roblox' | 'YouTube' | 'McDonald\'s' | 'BP' | 'Countryballs' | 'NZ' | 'New World' | 'Xilam' | 'Universal';
  tags: string[];
  likes: number;
  hasLiked?: boolean;
  diamondReactions: number;
  fireReactions: number;
  views: number;
  createdAt: number;
  comments: PostComment[];
  buildData?: BuildSchematic;
  screenshotData?: ScreenshotHighlight;
  robloxExperienceData?: RobloxExperienceShareData;
  videoData?: {
    videoId: string;
    episodeTitle: string;
    duration: string;
    thumbnailStyle: string;
    views: string;
    cast: string[];
  };
  ugcData?: {
    itemSlot: string;
    price: number;
    currency: 'coins' | 'robux';
    itemIcon: string;
  };
}

const STORAGE_KEY = 'megaworld_social_feed_v1';
const LIKES_KEY = 'megaworld_user_liked_posts';

export const INITIAL_SOCIAL_POSTS: SocialPost[] = [
  {
    id: 'post_mc_celestial_fortress',
    type: 'minecraft_2d_build',
    title: 'Celestial Netherite Sky Bastion (12x8 Modular)',
    caption: 'Designed this anti-blast floating citadel near Landmark 6! Fully equipped with crying obsidian blast shield walls, amethyst geode resonators, and a central repeating solar command core. Free to import and rebuild in your 2D sandbox!',
    author: {
      uid: 'user_master_builder_77',
      name: 'VoxelArch_Steve',
      avatarType: 'minecraft',
      avatarSubtype: 'steve',
      verified: true,
      rankTitle: 'Realm Master Artificer',
      classTitle: 'Minecraft Master Builder',
    },
    brandTheme: 'Minecraft',
    tags: ['2D Build', 'Fortress', 'Netherite', 'Command Block', 'Schematic'],
    likes: 384,
    diamondReactions: 142,
    fireReactions: 96,
    views: 1820,
    createdAt: Date.now() - 3600000 * 4, // 4 hours ago
    comments: [
      {
        id: 'c1',
        authorName: 'AlexSpelunker',
        authorAvatarType: 'minecraft',
        text: 'Imported this into column 45! The crying obsidian reflections look incredible with 3D WebGL lighting!',
        createdAt: Date.now() - 3600000 * 3,
      },
      {
        id: 'c2',
        authorName: 'BloxianRunner',
        authorAvatarType: 'roblox',
        text: 'The jump gap at row 4 works perfectly with the Gravity Coil! 10/10 build design.',
        createdAt: Date.now() - 3600000 * 2,
      },
    ],
    buildData: {
      schematicName: 'Sky Bastion Alpha',
      dimensions: '12 x 8 Blocks',
      blockCount: 48,
      difficulty: 'Master',
      primaryMaterials: ['Crying Obsidian', 'Amethyst', 'Glowstone', 'Netherite', 'Repeating Command Block'],
      worldCoordinates: { x: 86, y: 4, biome: 'Mushroom Deep Dark' },
      gridPreview: [
        ['sky', 'sky', 'crying_obsidian', 'crying_obsidian', 'repeating_command_block', 'crying_obsidian', 'crying_obsidian', 'sky', 'sky', 'glowstone', 'sky', 'sky'],
        ['sky', 'glowstone', 'obsidian', 'amethyst', 'amethyst', 'amethyst', 'obsidian', 'glowstone', 'sky', 'crying_obsidian', 'glowstone', 'sky'],
        ['crying_obsidian', 'obsidian', 'netherite', 'netherite', 'diamond', 'netherite', 'netherite', 'obsidian', 'crying_obsidian', 'obsidian', 'obsidian', 'crying_obsidian'],
        ['obsidian', 'amethyst', 'glass', 'sculk', 'amethyst', 'sculk', 'glass', 'amethyst', 'obsidian', 'stone', 'wood', 'obsidian'],
        ['obsidian', 'door', 'stone', 'stone', 'stone', 'stone', 'stone', 'stone', 'obsidian', 'stone', 'stone', 'obsidian'],
        ['crying_obsidian', 'obsidian', 'torch', 'wood', 'wood', 'wood', 'torch', 'obsidian', 'crying_obsidian', 'stone', 'stone', 'crying_obsidian'],
        ['bedrock', 'obsidian', 'obsidian', 'stone', 'stone', 'stone', 'obsidian', 'obsidian', 'bedrock', 'stone', 'stone', 'bedrock'],
        ['bedrock', 'bedrock', 'bedrock', 'obsidian', 'obsidian', 'obsidian', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock'],
      ],
    },
  },
  {
    id: 'post_screen_celestial_dawn',
    type: 'community_screenshot',
    title: 'Dawn Over Landmark 6: The Verity Celestial Shrine & Oracle Altar',
    caption: 'Captured this stunning 165 FPS 3D isometric shot right at sunrise (Time: 20%)! You can see Oracle Verity levitating beside the giant red mushroom canopy with dynamic volumetric shadow rays.',
    author: {
      uid: 'user_shutterbug_nova',
      name: 'Cinematic_Nova',
      avatarType: 'youtube',
      verified: true,
      rankTitle: 'Sovereign Realm Paragon',
      classTitle: 'YouTube Content Creator',
    },
    brandTheme: 'YouTube',
    tags: ['Screenshot', 'Landmark 6', 'Verity', '3D WebGL', 'Sunrise'],
    likes: 512,
    diamondReactions: 230,
    fireReactions: 185,
    views: 2450,
    createdAt: Date.now() - 3600000 * 7,
    comments: [
      {
        id: 'c3',
        authorName: 'ChiefTamati',
        authorAvatarType: 'custom',
        text: 'The celestial starlight aura brings great mana to the horizon. Kia ora!',
        createdAt: Date.now() - 3600000 * 5,
      },
      {
        id: 'c4',
        authorName: 'ChefRonald',
        authorAvatarType: 'custom',
        text: 'We should set up a mobile drive-thru banquet right next to this shrine!',
        createdAt: Date.now() - 3600000 * 4,
      },
    ],
    screenshotData: {
      locationName: 'Landmark 6: The Verity Celestial Shrine',
      coordinates: 'X: 87.00, Y: 4.50, Multiverse Chunk #0',
      biome: 'Mushroom Deep Dark & Celestial Biome',
      cameraAngle: '3D Isometric (Pitch: 52°, Yaw: -18°)',
      visualTheme: 'Celestial Starlight Dawn & Aurora Rays',
      sceneStyle: 'sunset_citadel',
      resolution: '4K Ultra High-Definition (165 FPS)',
      featuredPlayers: ['Steve The Pioneer', 'Oracle Verity', 'Axolotl', 'Enderman'],
    },
  },
  {
    id: 'post_mc_mcdonalds_diner',
    type: 'minecraft_2d_build',
    title: 'McDonald\'s Mega Drive-Thru & Golden Kitchen 2D Blueprint',
    caption: 'Turned the Desert-Border into an authentic 24/7 drive-thru rest stop! Red brick kiln facade with glowing yellow glowstone arches, functional furnace fryers, and dining booths. Ready for the Grand Banquet Rush quest!',
    author: {
      uid: 'user_chef_ronald_gold',
      name: 'ChefRonald_99',
      avatarType: 'custom',
      verified: true,
      rankTitle: 'Frontier Explorer',
      classTitle: 'McDonald\'s Golden Chef',
    },
    brandTheme: 'McDonald\'s',
    tags: ['2D Build', 'McDonald\'s', 'Food', 'Restaurant', 'Roleplay'],
    likes: 429,
    diamondReactions: 95,
    fireReactions: 154,
    views: 1980,
    createdAt: Date.now() - 3600000 * 12,
    comments: [
      {
        id: 'c5',
        authorName: 'Brenda_BP',
        authorAvatarType: 'custom',
        text: 'Installed a clean BP solar photon panel on the roof! Zero emissions burgers!',
        createdAt: Date.now() - 3600000 * 8,
      },
    ],
    buildData: {
      schematicName: 'Golden Diner Express',
      dimensions: '12 x 8 Blocks',
      blockCount: 42,
      difficulty: 'Intermediate',
      primaryMaterials: ['Red Bricks', 'Glowstone', 'Wood Planks', 'Door', 'Furnace'],
      worldCoordinates: { x: 38, y: 6, biome: 'Desert / Frontier' },
      gridPreview: [
        ['sky', 'glowstone', 'glowstone', 'sky', 'sky', 'sky', 'sky', 'glowstone', 'glowstone', 'sky', 'sky', 'sky'],
        ['glowstone', 'sky', 'sky', 'glowstone', 'bricks', 'bricks', 'bricks', 'bricks', 'sky', 'glowstone', 'sky', 'sky'],
        ['bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks'],
        ['bricks', 'glass', 'glass', 'bricks', 'glass', 'glass', 'bricks', 'bricks', 'glass', 'glass', 'bricks', 'bricks'],
        ['bricks', 'wood', 'stone', 'bricks', 'door', 'wood', 'wood', 'bricks', 'wood', 'wood', 'bricks', 'bricks'],
        ['bricks', 'dirt', 'torch', 'bricks', 'wood', 'wood', 'wood', 'bricks', 'wood', 'torch', 'bricks', 'bricks'],
        ['bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks'],
        ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
      ],
    },
  },
  {
    id: 'post_screen_streamer_raid',
    type: 'community_screenshot',
    title: '100M Subscriber Stream Raid: 10,000 Decibel Voice Hype Meter Cleared!',
    caption: 'Historical moment on the server! 14 players jumped on proximity voice chat with Creator Nova, hit 100% on the audio decibel meter, and activated the server-wide 3x Coin & XP boost. Look at the crowd confetti!',
    author: {
      uid: 'user_hype_king',
      name: 'StreamSniper_Pro',
      avatarType: 'youtube',
      verified: true,
      rankTitle: 'Celestial Star Warden',
      classTitle: 'YouTube Content Creator',
    },
    brandTheme: 'YouTube',
    tags: ['Screenshot', 'World Event', 'Voice Chat', '100M Hype', 'Confetti'],
    likes: 640,
    diamondReactions: 310,
    fireReactions: 290,
    views: 3120,
    createdAt: Date.now() - 3600000 * 18,
    comments: [
      {
        id: 'c6',
        authorName: 'VoxelArch_Steve',
        authorAvatarType: 'minecraft',
        text: 'My mic blew out when we all chanted at once! Best event in the game yet!',
        createdAt: Date.now() - 3600000 * 14,
      },
    ],
    screenshotData: {
      locationName: 'YouTube Multiverse Live Broadcast Stage',
      coordinates: 'X: 50.00, Y: 5.00, Stage A',
      biome: 'Snowy Alpine Arena',
      cameraAngle: 'Cinematic High-Angle Panoramic',
      visualTheme: 'Golden Stream Flare & Firework Confetti',
      sceneStyle: 'streamer_stage',
      resolution: '4K Ultra High-Definition',
      featuredPlayers: ['Creator Nova', 'Bloxian Champion', 'Steve', 'Polandball'],
    },
  },
  {
    id: 'post_mc_roblox_parkour',
    type: 'minecraft_2d_build',
    title: 'Neon Obby Void Relay (15-Stage Jump Challenge)',
    caption: 'Designed a vertical speedrun obstacle course for the Roblox Obby Relay quest! Features glowing magma launch pads, vanishing sculk triggers, and amethyst ladder hops. Can you beat the 42-second world record?',
    author: {
      uid: 'user_obby_legend',
      name: 'SpeedObby_God',
      avatarType: 'roblox',
      avatarSubtype: 'noob',
      verified: true,
      rankTitle: 'Sovereign Realm Paragon',
      classTitle: 'Roblox Obby Champion',
    },
    brandTheme: 'Roblox',
    tags: ['2D Build', 'Roblox', 'Obby', 'Parkour', 'Speedrun'],
    likes: 472,
    diamondReactions: 165,
    fireReactions: 210,
    views: 2150,
    createdAt: Date.now() - 3600000 * 24,
    comments: [
      {
        id: 'c7',
        authorName: 'NoobKing_06',
        authorAvatarType: 'roblox',
        text: 'That row 3 amethyst bounce pad is ruthless if you don\'t tap Shift to sprint! OOF!',
        createdAt: Date.now() - 3600000 * 20,
      },
    ],
    buildData: {
      schematicName: 'Neon Speed Obby R6',
      dimensions: '12 x 8 Blocks',
      blockCount: 36,
      difficulty: 'Legendary',
      primaryMaterials: ['Amethyst', 'Magma Block', 'Sculk Sensor', 'Obsidian', 'Glowstone'],
      worldCoordinates: { x: 4, y: 3, biome: 'Forest / Starter Park' },
      gridPreview: [
        ['sky', 'sky', 'sky', 'sky', 'glowstone', 'sky', 'sky', 'sky', 'sky', 'glowstone', 'sky', 'sky'],
        ['sky', 'amethyst', 'sky', 'sky', 'sky', 'sky', 'amethyst', 'sky', 'sky', 'sky', 'amethyst', 'sky'],
        ['sky', 'sky', 'sky', 'sculk', 'sky', 'sky', 'sky', 'sculk', 'sky', 'sky', 'sky', 'sky'],
        ['amethyst', 'sky', 'sky', 'sky', 'magma', 'sky', 'sky', 'sky', 'magma', 'sky', 'sky', 'glowstone'],
        ['sky', 'sky', 'amethyst', 'sky', 'sky', 'sky', 'amethyst', 'sky', 'sky', 'sky', 'amethyst', 'sky'],
        ['sky', 'magma', 'sky', 'sky', 'sky', 'magma', 'sky', 'sky', 'sky', 'magma', 'sky', 'sky'],
        ['obsidian', 'obsidian', 'sky', 'sky', 'obsidian', 'obsidian', 'sky', 'sky', 'obsidian', 'obsidian', 'sky', 'obsidian'],
        ['bedrock', 'bedrock', 'sky', 'sky', 'bedrock', 'bedrock', 'sky', 'sky', 'bedrock', 'bedrock', 'sky', 'bedrock'],
      ],
    },
  },
  {
    id: 'post_screen_waitangi_bay',
    type: 'community_screenshot',
    title: 'Waitangi River Valley Dawn: Haka Tremor & Pounamu Blessing',
    caption: 'Sunrise view over the Waitangi River palisades. Chief Tamati performed the Ka Mate Haka with the green Southern Cross aurora glowing above the forest canopy.',
    author: {
      uid: 'user_kiwi_explorer',
      name: 'AotearoaWayfinder',
      avatarType: 'custom',
      verified: true,
      rankTitle: 'United Legend of Sodor & Realm',
      classTitle: 'NZ Rangatira Wayfinder',
    },
    brandTheme: 'NZ',
    tags: ['Screenshot', 'NZ', 'Aotearoa', 'Waitangi', 'Haka', 'Aurora'],
    likes: 388,
    diamondReactions: 175,
    fireReactions: 130,
    views: 1690,
    createdAt: Date.now() - 3600000 * 30,
    comments: [
      {
        id: 'c8',
        authorName: 'GrandDiplomat_99',
        authorAvatarType: 'countryball',
        text: 'Magnificent landscape! The Polish Ambassador sends warm sovereign greetings!',
        createdAt: Date.now() - 3600000 * 25,
      },
    ],
    screenshotData: {
      locationName: 'Waitangi River Valley Palisade Outpost',
      coordinates: 'X: 12.00, Y: 5.00, River Mouth',
      biome: 'Forest / Coastal Bay',
      cameraAngle: '3D Isometric (Pitch: 48°, Yaw: 22°)',
      visualTheme: 'Silver Fern Aurora Australis & River Mist',
      sceneStyle: 'waitangi_bay',
      resolution: '4K Ultra High-Definition',
      featuredPlayers: ['Chief Tamati', 'Wayfinder Rangatira', 'Alex', 'Tamed Wolf'],
    },
  },
  {
    id: 'post_video_genesis',
    type: 'megaworld_video',
    title: '🎬 [MegaWorld Cinema] Episode 1: Genesis of the Ten Realms',
    caption: 'When the ancient Command Core fractured across the Multiverse, Steve, Classic Noob, and Polandball joined hands to seal the Nether Rift.',
    author: {
      uid: 'megaworld_studios',
      name: 'MegaWorld RP Studios',
      avatarType: 'youtube',
      avatarSubtype: 'director',
      verified: true,
      rankTitle: 'Official RP Cinema',
      classTitle: 'Content Creator',
    },
    brandTheme: 'Universal',
    tags: ['MegaWorld RP', 'Cinema', 'Episode 1', 'Genesis', 'Multiverse Lore'],
    likes: 3840,
    diamondReactions: 1420,
    fireReactions: 2950,
    views: 48920,
    createdAt: Date.now() - 86400000 * 3,
    videoData: {
      videoId: 'ep_genesis',
      episodeTitle: 'Genesis of the Ten Realms',
      duration: '04:18',
      thumbnailStyle: 'sunset_citadel',
      views: '48.9K views',
      cast: ['Steve', 'Classic Noob', 'Polandball', 'Oren the Sprunki'],
    },
    comments: [
      {
        id: 'c_vid_1',
        authorName: 'SprunkiBeats_DJ',
        text: 'The 128 BPM remix when the command block sparked was peak cinema! 🔥🔥🔥',
        createdAt: Date.now() - 86400000 * 2,
      },
    ],
  },
  {
    id: 'post_video_polandball',
    type: 'megaworld_video',
    title: '🎬 [MegaWorld Cinema] Episode 4: Polandball’s Lunar Odyssey',
    caption: 'Equipped with the high-octane BP Jetpack and Pioneer Helmet, Polandball proves to the entire multiverse that Poland CAN into space!',
    author: {
      uid: 'space_odyssey_rp',
      name: 'Nations League RP',
      avatarType: 'countryballs',
      avatarSubtype: 'poland',
      verified: true,
      rankTitle: 'Space Agency Director',
      classTitle: 'Pioneer',
    },
    brandTheme: 'Countryballs',
    tags: ['Polandball', 'Space', 'BP Jetpack', 'Apollo RP', 'Cinema'],
    likes: 4210,
    diamondReactions: 2180,
    fireReactions: 3120,
    views: 62400,
    createdAt: Date.now() - 86400000 * 2,
    videoData: {
      videoId: 'ep_poland_space',
      episodeTitle: 'Polandball’s Lunar Odyssey',
      duration: '05:42',
      thumbnailStyle: 'waitangi_bay',
      views: '62.4K views',
      cast: ['Polandball', 'USA-ball', 'BP Mechanic', 'Space Steve'],
    },
    comments: [
      {
        id: 'c_vid_3',
        authorName: 'BloxianWarrior',
        text: 'The zero-G bounce with the Gravity Coil Rig was insane haha! 🚀',
        createdAt: Date.now() - 86400000,
      },
    ],
  },
  {
    id: 'post_roblox_share_verity',
    type: 'roblox_experience_share',
    title: '✨ Verity: Celestial Awakening RP (Holiday Update)',
    caption: 'Step through the Starlight Gate into Verity! Claim festive auras, solve the Starlight Obelisk puzzle, and hang out with friends in the snow-dusted celestial courtyard.',
    author: {
      uid: 'user_verity_dev',
      name: 'VerityArchitect',
      avatarType: 'roblox',
      avatarSubtype: 'guest',
      verified: true,
      rankTitle: 'Celestial Grandmaster',
      classTitle: 'Roblox World Architect',
    },
    brandTheme: 'Roblox',
    tags: ['Roblox', 'Experience', 'Roleplay', 'Holiday Update', 'Verity', 'Multiplayer'],
    likes: 854,
    diamondReactions: 412,
    fireReactions: 520,
    views: 8940,
    createdAt: Date.now() - 3600000 * 5,
    comments: [
      {
        id: 'c_roblox_1',
        authorName: 'StarChaser_99',
        authorAvatarType: 'roblox',
        text: 'The starlight aura effect is incredible! Can\'t wait to explore with my guild.',
        createdAt: Date.now() - 3600000 * 3,
      },
    ],
    robloxExperienceData: {
      gameId: 'verity_rp',
      gameName: 'Verity: Celestial Awakening RP',
      emoji: '✨',
      category: 'Roleplay & Exploration',
      genre: 'Celestial Fantasy RP',
      description: 'Step into the realm of Verity! Form ancient pacts, harness astral magic, awaken celestial spirits, and socialize in high-fantasy sanctuaries.',
      playerCount: '48.2K',
      rating: '98%',
      bannerGradient: 'from-purple-900 via-indigo-950 to-slate-950',
      badge: 'NEW UPDATE',
      socialPreviewUrl: 'https://roblox.megaworld-rp.internal/experience/verity_rp',
      metaTags: ['Roblox', 'Verity', 'Roleplay', 'Celestial', 'Multiplayer', 'MegaWorldRP'],
      shareTimestamp: Date.now() - 3600000 * 5,
    },
  },
];

class SocialFeedManager {
  private posts: SocialPost[] = [];
  private userLikedIds: Set<string> = new Set();
  private isLoadedFromCloud: boolean = false;

  constructor() {
    this.posts = this.loadLocal();
    this.userLikedIds = this.loadLikedIds();
  }

  private loadLocal(): SocialPost[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge to ensure sample posts persist alongside user additions
          const ids = new Set(parsed.map((p: SocialPost) => p.id));
          const missingSamples = INITIAL_SOCIAL_POSTS.filter((p) => !ids.has(p.id));
          return [...parsed, ...missingSamples];
        }
      }
    } catch (e) {
      console.warn('Failed to parse local social feed posts:', e);
    }
    return [...INITIAL_SOCIAL_POSTS];
  }

  private loadLikedIds(): Set<string> {
    try {
      const stored = localStorage.getItem(LIKES_KEY);
      if (stored) {
        return new Set(JSON.parse(stored));
      }
    } catch {}
    return new Set();
  }

  private saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.posts));
      localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(this.userLikedIds)));
      window.dispatchEvent(new CustomEvent('megaworld_social_feed_updated', { detail: this.posts }));
    } catch (e) {
      console.warn('Failed to save social feed locally:', e);
    }
  }

  public getPosts(category?: string, sort?: 'trending' | 'newest' | 'top', brandTheme?: string): SocialPost[] {
    let filtered = [...this.posts];

    if (category && category !== 'all') {
      if (category === 'builds') {
        filtered = filtered.filter((p) => p.type === 'minecraft_2d_build');
      } else if (category === 'screenshots') {
        filtered = filtered.filter((p) => p.type === 'community_screenshot');
      } else if (category === 'ugc') {
        filtered = filtered.filter((p) => p.type === 'ugc_skin');
      } else if (category === 'videos') {
        filtered = filtered.filter((p) => p.type === 'megaworld_video');
      } else if (category === 'experiences' || category === 'roblox_experiences') {
        filtered = filtered.filter((p) => p.type === 'roblox_experience_share');
      } else if (category === 'liked') {
        filtered = filtered.filter((p) => this.userLikedIds.has(p.id));
      }
    }

    if (brandTheme && brandTheme !== 'all') {
      filtered = filtered.filter((p) => p.brandTheme === brandTheme);
    }

    if (sort === 'newest') {
      filtered.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sort === 'top') {
      filtered.sort((a, b) => (b.likes + b.diamondReactions * 2) - (a.likes + a.diamondReactions * 2));
    } else {
      // Trending (score based on recency and interactions)
      filtered.sort((a, b) => {
        const scoreA = a.likes * 1.5 + a.diamondReactions * 2 + a.fireReactions * 2 + a.comments.length * 3;
        const scoreB = b.likes * 1.5 + b.diamondReactions * 2 + b.fireReactions * 2 + b.comments.length * 3;
        return scoreB - scoreA;
      });
    }

    // Mark current user's liked state
    return filtered.map((p) => ({
      ...p,
      hasLiked: this.userLikedIds.has(p.id),
    }));
  }

  public getPostById(id: string): SocialPost | undefined {
    const post = this.posts.find((p) => p.id === id);
    if (!post) return undefined;
    return {
      ...post,
      hasLiked: this.userLikedIds.has(post.id),
    };
  }

  public toggleLike(postId: string): { hasLiked: boolean; newCount: number } {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return { hasLiked: false, newCount: 0 };

    let hasLiked = false;
    if (this.userLikedIds.has(postId)) {
      this.userLikedIds.delete(postId);
      post.likes = Math.max(0, post.likes - 1);
      hasLiked = false;
    } else {
      this.userLikedIds.add(postId);
      post.likes += 1;
      hasLiked = true;
    }

    this.saveLocal();
    this.syncLikeToCloud(postId, hasLiked);
    return { hasLiked, newCount: post.likes };
  }

  public addReaction(postId: string, reactionType: 'diamond' | 'fire') {
    const post = this.posts.find((p) => p.id === postId);
    if (!post) return;

    if (reactionType === 'diamond') {
      post.diamondReactions += 1;
    } else {
      post.fireReactions += 1;
    }

    this.saveLocal();
    this.syncReactionToCloud(postId, reactionType);
  }

  public addComment(postId: string, text: string, authorName: string, avatarType?: string): PostComment | null {
    const post = this.posts.find((p) => p.id === postId);
    if (!post || !text.trim()) return null;

    const newComment: PostComment = {
      id: `comm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorName: authorName.trim() || 'Anonymous Explorer',
      authorAvatarType: avatarType || 'minecraft',
      text: text.trim(),
      createdAt: Date.now(),
    };

    post.comments.push(newComment);
    this.saveLocal();
    this.syncCommentToCloud(postId, newComment);
    return newComment;
  }

  public async createPost(
    postData: Omit<SocialPost, 'id' | 'likes' | 'diamondReactions' | 'fireReactions' | 'views' | 'createdAt' | 'comments'>
  ): Promise<SocialPost> {
    const newPost: SocialPost = {
      ...postData,
      id: `post_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      likes: 1,
      diamondReactions: 0,
      fireReactions: 0,
      views: 1,
      createdAt: Date.now(),
      comments: [],
    };

    this.userLikedIds.add(newPost.id);
    this.posts.unshift(newPost);
    this.saveLocal();

    // Sync to Firestore
    try {
      const docRef = doc(db, 'social_feed_posts', newPost.id);
      await setDoc(docRef, newPost, { merge: true });
    } catch (e) {
      console.warn('Failed to sync new post to cloud:', e);
    }

    return newPost;
  }

  public async loadFromCloud(): Promise<SocialPost[]> {
    if (this.isLoadedFromCloud) return this.getPosts();

    try {
      const colRef = collection(db, 'social_feed_posts');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudPosts: SocialPost[] = [];
        snap.forEach((d) => {
          cloudPosts.push(d.data() as SocialPost);
        });

        const localIds = new Set(this.posts.map((p) => p.id));
        const merged = [...this.posts];

        cloudPosts.forEach((cp) => {
          if (!localIds.has(cp.id)) {
            merged.push(cp);
          }
        });

        this.posts = merged;
        this.saveLocal();
      }
      this.isLoadedFromCloud = true;
    } catch (e) {
      console.warn('Could not load social feed from Firestore, using local cache:', e);
    }
    return this.getPosts();
  }

  private async syncLikeToCloud(postId: string, hasLiked: boolean) {
    try {
      const docRef = doc(db, 'social_feed_posts', postId);
      await updateDoc(docRef, {
        likes: increment(hasLiked ? 1 : -1),
      });
    } catch {}
  }

  private async syncReactionToCloud(postId: string, reactionType: 'diamond' | 'fire') {
    try {
      const docRef = doc(db, 'social_feed_posts', postId);
      await updateDoc(docRef, {
        [reactionType === 'diamond' ? 'diamondReactions' : 'fireReactions']: increment(1),
      });
    } catch {}
  }

  private async syncCommentToCloud(postId: string, comment: PostComment) {
    try {
      const docRef = doc(db, 'social_feed_posts', postId);
      await updateDoc(docRef, {
        comments: arrayUnion(comment),
      });
    } catch {}
  }
}

export const socialFeedManager = new SocialFeedManager();
