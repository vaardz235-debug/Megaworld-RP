import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Play, Pause, Volume2, VolumeX, Maximize2, SkipForward, 
  RotateCcw, Sparkles, Heart, Share2, MessageSquare, Compass, 
  Eye, ThumbsUp, Radio, Film, Plus, Send, Layers, Star, Check,
  Tv, Coins, Zap, ExternalLink, FastForward, Gift
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { avatarManager } from '../utils/avatarManager';

export interface MegaWorldVideoEpisode {
  id: string;
  title: string;
  season: number;
  episode: number;
  series: string;
  duration: string;
  durationSeconds: number;
  thumbnailGradient: string;
  thumbnailEmoji: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'Sprunki' | 'Universal';
  views: number;
  likes: number;
  hasLiked?: boolean;
  channelName: string;
  channelVerified: boolean;
  publishedDate: string;
  resolution: string;
  summary: string;
  landmarkCoordinates: { x: number; y: number; name: string };
  soundtrack: string;
  sceneScript: {
    time: number;
    speaker: string;
    text: string;
    action: string;
    bgColor: string;
  }[];
}

export const MEGAWORLD_VIDEOS_CATALOG: MegaWorldVideoEpisode[] = [
  // Season 1: Multiverse Awakening
  {
    id: 'vid_ep1_genesis',
    title: 'Episode 1: The Awakening in the 200-Billion Block Multiverse',
    season: 1,
    episode: 1,
    series: 'MegaWorld RP Chronicles',
    duration: '08:42',
    durationSeconds: 522,
    thumbnailGradient: 'from-emerald-950 via-teal-900 to-stone-900',
    thumbnailEmoji: '⛏️',
    brand: 'Minecraft',
    views: 482000,
    likes: 38400,
    channelName: 'MegaWorld Studios [Official]',
    channelVerified: true,
    publishedDate: '3 days ago',
    resolution: '4K 60FPS Cinema',
    summary: 'Steve awakens on a mysterious grass plateau to find the world has expanded to 200,000,000,000 blocks with portals connecting to Roblox, Sodor, and Countryballs!',
    landmarkCoordinates: { x: 50, y: 15, name: 'Landmark 1: Genesis Monolith' },
    soundtrack: 'sweden',
    sceneScript: [
      { time: 0, speaker: 'Narrator', text: 'In the beginning, there was only a 15x10 grid...', action: 'Camera pans across boundless voxel horizons', bgColor: '#064e3b' },
      { time: 5, speaker: 'Steve', text: 'Wait... this world stretches 200 billion blocks in every direction!', action: 'Steve jumps atop crying obsidian ledge', bgColor: '#047857' },
      { time: 12, speaker: 'Alex', text: 'Look at the sky! Dimensional rifts are opening across the coordinates!', action: 'Golden rift particles cascade from the clouds', bgColor: '#0d9488' },
      { time: 20, speaker: 'Steve', text: 'Grab your pickaxes. It is time to forge our destiny!', action: 'Pulls out Diamond Pickaxe with starlight gleam', bgColor: '#0f766e' },
    ],
  },
  {
    id: 'vid_ep2_roblox_crossroads',
    title: 'Episode 2: The Crossroads Clash: When Roblox Meets Minecraft',
    season: 1,
    episode: 2,
    series: 'MegaWorld RP Chronicles',
    duration: '12:15',
    durationSeconds: 735,
    thumbnailGradient: 'from-cyan-950 via-blue-900 to-stone-900',
    thumbnailEmoji: '⚔️',
    brand: 'Roblox',
    views: 620000,
    likes: 54100,
    channelName: 'Bloxian Voxel Films',
    channelVerified: true,
    publishedDate: '1 week ago',
    resolution: '1080p 60FPS',
    summary: 'A squad of classic Roblox Noobs equipped with Linked Swords and Gravity Coils enters Minecraft territory to claim the Tower Obby Citadel!',
    landmarkCoordinates: { x: 120, y: 32, name: 'Landmark 2: Crossroads Obby Citadel' },
    soundtrack: 'pigstep',
    sceneScript: [
      { time: 0, speaker: 'Classic Noob', text: 'Ayyy! Look at all these destructible blocks! /e dance', action: 'Noob does classic spin on stud platform', bgColor: '#0369a1' },
      { time: 6, speaker: 'Bacon Hair', text: 'Watch out! The Ender Dragon is circling above the obby checkpoints!', action: 'Dragon shadow swoops across neon pads', bgColor: '#1d4ed8' },
      { time: 14, speaker: 'Steve', text: 'Hold your positions! We can combine redstone with gravity coils!', action: 'Lays down repeating command blocks', bgColor: '#1e40af' },
      { time: 22, speaker: 'Builderman', text: 'Constructing defensive stud barrier now!', action: 'Deploys linked anchor walls', bgColor: '#1e3a8a' },
    ],
  },
  {
    id: 'vid_ep3_warden_verity',
    title: 'Episode 3: The Deep Dark Warden vs The Celestial Verity Shrine',
    season: 1,
    episode: 3,
    series: 'MegaWorld RP Chronicles',
    duration: '15:30',
    durationSeconds: 930,
    thumbnailGradient: 'from-purple-950 via-indigo-900 to-stone-900',
    thumbnailEmoji: '🔮',
    brand: 'Sprunki',
    views: 890000,
    likes: 72300,
    channelName: 'Celestial Lore Network',
    channelVerified: true,
    publishedDate: '2 weeks ago',
    resolution: '4K HDR Cinema',
    summary: 'The terrifying Warden breaks out from subterranean sculk caves, threatening to extinguish all light until Oracle Verity descends with Starlight Chimes!',
    landmarkCoordinates: { x: 86, y: 4, name: 'Landmark 6: Celestial Verity Shrine' },
    soundtrack: 'verity',
    sceneScript: [
      { time: 0, speaker: 'Deep Dark Warden', text: '*DEAFENING SUBTERRANEAN ROAR ECHOES THROUGH VOXELS*', action: 'Sculk tendrils pulse with ultrasonic sound', bgColor: '#1e1b4b' },
      { time: 7, speaker: 'Alex', text: 'My screen is darkening! Sonic boom incoming!', action: 'Alex shields with Diamond Play Button Aegis', bgColor: '#312e81' },
      { time: 15, speaker: 'Oracle Verity', text: 'Let the celestial chord dispel the shadows of the void!', action: 'Spawns crystalline truth altar with rainbow prisms', bgColor: '#4c1d95' },
      { time: 24, speaker: 'Warden', text: '*Sculk resonance harmonizes peacefully with the melody*', action: 'Warden pauses and bows to the starlight chimes', bgColor: '#581c87' },
    ],
  },

  // Season 2: Corporate Wars & Countryballs
  {
    id: 'vid_ep4_poland_space',
    title: 'Episode 4: Polandball Found Netherite & Built a Space Station!',
    season: 2,
    episode: 1,
    series: 'Countryballs Multiverse Wars',
    duration: '09:20',
    durationSeconds: 560,
    thumbnailGradient: 'from-sky-950 via-blue-900 to-stone-900',
    thumbnailEmoji: '🌐',
    brand: 'Countryballs',
    views: 540000,
    likes: 49200,
    channelName: 'Countryball Animation Cinema',
    channelVerified: true,
    publishedDate: '3 weeks ago',
    resolution: '4K 60FPS',
    summary: 'Against all odds, Polandball mined 500 Netherite blocks to construct a sovereign orbital rocket and prove to the world that Poland CAN into space!',
    landmarkCoordinates: { x: 210, y: 88, name: 'Landmark 3: Warsaw Spaceport' },
    soundtrack: 'otherside',
    sceneScript: [
      { time: 0, speaker: 'Polandball', text: 'Polen can into space! Look at my Netherite booster rocket!', action: 'Polandball floats in spherical space helmet', bgColor: '#0c4a6e' },
      { time: 8, speaker: 'UK Ball', text: 'By Jove, he actually constructed an orbital command module!', action: 'Monocle drops in absolute astonishment', bgColor: '#0369a1' },
      { time: 16, speaker: 'USA Ball', text: 'Did someone say oil reserves on the moon?! Launch the space rigs!', action: 'Deploys BP jetpack squadron into high orbit', bgColor: '#0284c7' },
    ],
  },
  {
    id: 'vid_ep5_golden_arches_heist',
    title: 'Episode 5: The Great Golden Arches Midnight Heist',
    season: 2,
    episode: 2,
    series: 'MegaWorld Corporate Shenanigans',
    duration: '11:05',
    durationSeconds: 665,
    thumbnailGradient: 'from-amber-950 via-yellow-900 to-stone-900',
    thumbnailEmoji: '🍔',
    brand: 'McDonald\'s',
    views: 710000,
    likes: 61000,
    channelName: 'FastFood RP Cartel',
    channelVerified: true,
    publishedDate: '1 month ago',
    resolution: '1080p 60FPS',
    summary: 'Oggy and the Cockroaches team up with Guest 666 to break into the McDonald’s secret vault to steal the legendary Cosmic Grimace Shake!',
    landmarkCoordinates: { x: 160, y: 18, name: 'Landmark 4: Golden Arches Super-Store' },
    soundtrack: 'mall',
    sceneScript: [
      { time: 0, speaker: 'Dee Dee & Joey', text: 'Hehehe! Look at all those fresh hot Cheezburgers!', action: 'Cockroaches sneak under the drive-thru sensor', bgColor: '#713f12' },
      { time: 7, speaker: 'Oggy', text: 'MEOOOOOW! Not my secret dinner vault!!', action: 'Oggy swings Colossal Flyswatter with comical slam', bgColor: '#854d0e' },
      { time: 15, speaker: 'Grimace', text: 'Nothing can stop the cosmic shake formula!', action: 'Drinks shake and begins anti-gravity levitation', bgColor: '#a16207' },
    ],
  },

  // Season 3: Sodor Rails & Dark Dimensions
  {
    id: 'vid_ep6_thomas_nether_rescue',
    title: 'Episode 6: Thomas & Percy: Escape from the Nether Fortress',
    season: 3,
    episode: 1,
    series: 'Sodor Steam & Rail RP',
    duration: '10:48',
    durationSeconds: 648,
    thumbnailGradient: 'from-red-950 via-amber-950 to-stone-900',
    thumbnailEmoji: '🚂',
    brand: 'Universal',
    views: 430000,
    likes: 35000,
    channelName: 'Sodor Steam Railway Films',
    channelVerified: true,
    publishedDate: '1 month ago',
    resolution: '4K Cinema',
    summary: 'A rogue portal transports Thomas the Tank Engine and Percy directly onto crying obsidian tracks inside a blazing Nether fortress!',
    landmarkCoordinates: { x: 310, y: 12, name: 'Landmark 7: Netherite Rail Junction' },
    soundtrack: 'far',
    sceneScript: [
      { time: 0, speaker: 'Thomas', text: 'Bust my buffers! These tracks are made of molten lava!', action: 'Puffs steam through glowing nether portal', bgColor: '#7f1d1d' },
      { time: 8, speaker: 'Percy', text: 'Thomas, look out! Diesel 10 has Pinchy on the high bridge!', action: 'Giant hydraulic claw snaps in the smoke', bgColor: '#991b1b' },
      { time: 17, speaker: 'Steve', text: 'Throw the redstone switch! Clear track 4 for the rescue express!', action: 'Fires speed coil booster onto the iron rails', bgColor: '#b91c1c' },
    ],
  },
];

export interface VideoAd {
  id: string;
  sponsorName: string;
  sponsorBadge: string;
  title: string;
  tagline: string;
  emoji: string;
  gradientBg: [string, string];
  perkReward: number;
  productImageOrIcon: string;
  brand: string;
  durationSeconds: number;
  skipAfterSeconds: number;
  callToAction: string;
}

export const VIDEO_ADS_CATALOG: VideoAd[] = [
  {
    id: 'ad_mcdonalds_golden_combo',
    sponsorName: "McDonald's Golden Arches",
    sponsorBadge: 'OFFICIAL FOOD PARTNER',
    title: 'The Multiverse Happy Meal & Cosmic Grimace Shake!',
    tagline: 'Fuel your 200B block adventure! Sizzling fresh burgers, golden fries, and anti-gravity cosmic shakes with +100% saturation boost!',
    emoji: '🍔',
    gradientBg: ['#7f1d1d', '#b45309'],
    perkReward: 100,
    productImageOrIcon: '🍟',
    brand: "McDonald's",
    durationSeconds: 9,
    skipAfterSeconds: 4,
    callToAction: 'Order Happy Meal (+100 🪙)',
  },
  {
    id: 'ad_roblox_robux_valkyrie',
    sponsorName: 'Robloxian Commerce Network',
    sponsorBadge: 'PREMIUM ROBUX SPONSOR',
    title: 'Double Robux Drop & Mythic Valkyrie Speed Pass!',
    tagline: 'Equip classic speed coils and neon jet trails! Dominate any obby in record time with zero fall damage!',
    emoji: '💎',
    gradientBg: ['#1e3a8a', '#991b1b'],
    perkReward: 120,
    productImageOrIcon: '👑',
    brand: 'Roblox',
    durationSeconds: 9,
    skipAfterSeconds: 4,
    callToAction: 'Claim Robux Drop (+120 🪙)',
  },
  {
    id: 'ad_mc_netherite_insurance',
    sponsorName: 'Villager Mutual Assurance Co.',
    sponsorBadge: 'VERIFIED OVERWORLD GUILD',
    title: 'Hrmmm! Netherite Armor Lava Protection Warranty!',
    tagline: 'Never lose your enchanted Netherite gear in the fire again! Instant emergency totem airlift and 100% drop replacement!',
    emoji: '🛡️',
    gradientBg: ['#1c1917', '#047857'],
    perkReward: 100,
    productImageOrIcon: '⛏️',
    brand: 'Minecraft',
    durationSeconds: 8,
    skipAfterSeconds: 4,
    callToAction: 'Sign Insurance Policy (+100 🪙)',
  },
  {
    id: 'ad_sprunki_sound_pack_s3',
    sponsorName: 'Incredibox Beat Studio',
    sponsorBadge: 'NEW ALBUM DROP',
    title: 'Sprunki Season 3: Celestial Truth Sound Pack!',
    tagline: 'Synthesize cosmic rhythm drops with Oren, Pinki, and Oracle Verity! Features 48 high-voltage 808 beats and starlight chimes!',
    emoji: '🎧',
    gradientBg: ['#581c87', '#be185d'],
    perkReward: 110,
    productImageOrIcon: '🔮',
    brand: 'Sprunki',
    durationSeconds: 9,
    skipAfterSeconds: 4,
    callToAction: 'Equip Beat Pack (+110 🪙)',
  },
  {
    id: 'ad_tarragower_academy',
    sponsorName: 'Tarragower School of Engineering',
    sponsorBadge: 'ACADEMIC SCHOLARSHIP',
    title: 'Enroll in the Prestigious Tarragower Voxel Academy!',
    tagline: 'Master advanced redstone logic, quantum circuit design, and alchemical potion crafting with certified master scholars!',
    emoji: '🏫',
    gradientBg: ['#1e1b4b', '#3730a3'],
    perkReward: 100,
    productImageOrIcon: '🎓',
    brand: 'Tarragower',
    durationSeconds: 8,
    skipAfterSeconds: 4,
    callToAction: 'Enroll in Academy (+100 🪙)',
  },
  {
    id: 'ad_bp_helios_clean_energy',
    sponsorName: 'BP Helios Clean Energy Grid',
    sponsorBadge: 'ECO-TECH INNOVATION',
    title: 'Supercharge Your Redstone Outpost with 100% Solar Power!',
    tagline: 'Zero emissions! Smelt ore at 3x velocity with bio-solar photon generators that keep all factories permanently energized!',
    emoji: '⚡',
    gradientBg: ['#064e3b', '#a16207'],
    perkReward: 100,
    productImageOrIcon: '☀️',
    brand: 'BP',
    durationSeconds: 8,
    skipAfterSeconds: 4,
    callToAction: 'Install Solar Cells (+100 🪙)',
  },
  {
    id: 'ad_newworld_azoth_tonic',
    sponsorName: 'Aeternum Syndicate Alchemists',
    sponsorBadge: 'FRONTIER DEFENSE',
    title: 'Aeternum High-Potency Azoth Energy Drink!',
    tagline: 'Traverse uncharted mountain biomes with 40% increased stamina recovery and break corrupted monster fortresses with raw void force!',
    emoji: '🧪',
    gradientBg: ['#0c4a6e', '#0369a1'],
    perkReward: 100,
    productImageOrIcon: '🗡️',
    brand: 'New World',
    durationSeconds: 9,
    skipAfterSeconds: 4,
    callToAction: 'Drink Azoth Tonic (+100 🪙)',
  },
  {
    id: 'ad_youtube_creator_pass',
    sponsorName: 'YouTube Gaming Multiverse',
    sponsorBadge: 'OFFICIAL BROADCAST NETWORK',
    title: 'Subscribe to MegaWorld RP & Unlock the Golden Creator Studio!',
    tagline: 'Stream in 4K 60FPS with custom player chat badges, viral subscriber firework cannons, and golden microphones!',
    emoji: '📺',
    gradientBg: ['#450a0a', '#b91c1c'],
    perkReward: 100,
    productImageOrIcon: '▶️',
    brand: 'YouTube',
    durationSeconds: 9,
    skipAfterSeconds: 4,
    callToAction: 'Hit Subscribe Bell (+100 🪙)',
  },
  {
    id: 'ad_mcdonalds_holiday_feast',
    sponsorName: "McDonald's Holiday Kitchen",
    sponsorBadge: 'HOLIDAY FEAST SPECIAL',
    title: 'Holiday Feast Bucket & Icy Peppermint Shake!',
    tagline: 'Warm buttered holiday biscuits, gingerbread hot cakes, and festive peppermint shakes with +100% saturation boost and jump power!',
    emoji: '🎄',
    gradientBg: ['#7f1d1d', '#14532d'],
    perkReward: 100,
    productImageOrIcon: '🍦',
    brand: "McDonald's",
    durationSeconds: 8,
    skipAfterSeconds: 4,
    callToAction: 'Order Holiday Feast (+100 🪙)',
  },
  {
    id: 'ad_roblox_winter_wonderland',
    sponsorName: 'Roblox Winter Festival',
    sponsorBadge: 'HOLIDAY BATTLE PASS',
    title: 'Winter Wonderland Obby & Santa Dominus Bundle!',
    tagline: 'Slide down sub-zero glacier spires with enchanted snowball launchers and unlock the mythic Frost Dominus hood with infinite speed trails!',
    emoji: '❄️',
    gradientBg: ['#0369a1', '#1e1b4b'],
    perkReward: 120,
    productImageOrIcon: '🎁',
    brand: 'Roblox',
    durationSeconds: 9,
    skipAfterSeconds: 4,
    callToAction: 'Claim Winter Pass (+120 🪙)',
  },
  {
    id: 'ad_mc_santa_flying_sled',
    sponsorName: 'North Pole Voxel Aeronautics',
    sponsorBadge: 'OFFICIAL SLEIGH GUILD',
    title: 'Enchanted Netherite Flying Sled & Reindeer Wings!',
    tagline: 'Fly across 200B blocks with zero fuel! Powered by redstone star engines and equipped with high-yield gift drop cannons!',
    emoji: '🛷',
    gradientBg: ['#14532d', '#7f1d1d'],
    perkReward: 100,
    productImageOrIcon: '🦌',
    brand: 'Minecraft',
    durationSeconds: 8,
    skipAfterSeconds: 4,
    callToAction: 'Rent Flying Sled (+100 🪙)',
  },
  {
    id: 'ad_sprunki_holiday_beats',
    sponsorName: 'Sprunki Incredibox Soundlab',
    sponsorBadge: 'HOLIDAY BEAT PACK',
    title: 'Festive Sleigh Bell 808 Trap & Winter Chimes Pack!',
    tagline: 'Synthesize festive EDM bops with Oren, Simon, and Verity! Drop crisp jingling snare rolls and sub-zero 808 bass drops!',
    emoji: '🔔',
    gradientBg: ['#701a75', '#1e1b4b'],
    perkReward: 100,
    productImageOrIcon: '🎵',
    brand: 'Sprunki',
    durationSeconds: 8,
    skipAfterSeconds: 4,
    callToAction: 'Download Beat Pack (+100 🪙)',
  },
];

interface MegaWorldVideosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWarpToCoordinates?: (x: number, y: number) => void;
  onWarpToScene?: (x: number, y: number) => void;
  onOpenVoiceChat?: (frequency?: string) => void;
  user?: any;
  currentAvatar?: any;
}

export default function MegaWorldVideosModal({
  isOpen,
  onClose,
  onWarpToCoordinates,
  onWarpToScene,
  onOpenVoiceChat,
  user,
  currentAvatar,
}: MegaWorldVideosModalProps) {
  const [episodes, setEpisodes] = useState<MegaWorldVideoEpisode[]>(MEGAWORLD_VIDEOS_CATALOG);
  const [activeEpisode, setActiveEpisode] = useState<MegaWorldVideoEpisode>(MEGAWORLD_VIDEOS_CATALOG[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Chat Simulator State
  const [liveChatMessages, setLiveChatMessages] = useState<Array<{ id: string; user: string; text: string; time: string }>>([
    { id: '1', user: 'VoxelGamer_99', text: 'The 200B block rendering looks INSANE in 4K!', time: '12:01' },
    { id: '2', user: 'BloxianNoob', text: 'Classic Noob with the linked sword carried the raid!! 😂', time: '12:02' },
    { id: '3', user: 'CountryballFan', text: 'Poland CAN into space confirmed!! 🚀', time: '12:02' },
    { id: '4', user: 'OracleFan', text: 'Verity starlight halo music gave me chills 🔮', time: '12:03' },
  ]);
  const [newChatInput, setNewChatInput] = useState('');

  // Upload Video Form Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadSeries, setUploadSeries] = useState('MegaWorld RP Chronicles');
  const [uploadBrand, setUploadBrand] = useState<'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'Sprunki' | 'Universal'>('Minecraft');
  const [uploadSummary, setUploadSummary] = useState('');

  // Video Ads System State
  const [activeAd, setActiveAd] = useState<VideoAd | null>(null);
  const [adTimeRemaining, setAdTimeRemaining] = useState<number>(0);
  const [adCanSkip, setAdCanSkip] = useState<boolean>(false);
  const [adRewardClaimed, setAdRewardClaimed] = useState<boolean>(false);
  const [adsWatchedCount, setAdsWatchedCount] = useState<number>(0);
  const [totalCoinsEarnedFromAds, setTotalCoinsEarnedFromAds] = useState<number>(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Video Ad Countdown & Completion Loop
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeAd) {
      interval = setInterval(() => {
        setAdTimeRemaining((prev) => {
          if (prev <= 1) {
            // Ad finished!
            if (!adRewardClaimed) {
              const reward = activeAd.perkReward;
              avatarManager.addCurrency(reward, 0);
              setTotalCoinsEarnedFromAds((c) => c + reward);
              setAdsWatchedCount((n) => n + 1);
              setAdRewardClaimed(true);
              audioEngine.playMinecraftSound('levelup');
              showToast(`🎉 Ad Complete! Claimed +${reward} MegaCoins from ${activeAd.sponsorName}!`);
            }
            setActiveAd(null);
            setIsPlaying(true);
            return 0;
          }
          if (activeAd.durationSeconds - (prev - 1) >= activeAd.skipAfterSeconds) {
            setAdCanSkip(true);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeAd, adRewardClaimed]);

  // Timer loop for regular video playback
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isPlaying && !activeAd) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= activeEpisode.durationSeconds) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, activeEpisode, activeAd]);

  // Procedural Canvas Animation for Active Video / Sponsored Commercial Player
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame = 0;
    const render = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      // ================= COMMERCIAL AD PLAYBACK MODE =================
      if (activeAd) {
        // Dynamic ad gradient background
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, activeAd.gradientBg[0]);
        grad.addColorStop(1, activeAd.gradientBg[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Animated Rotating Spotlight Beams
        ctx.save();
        ctx.translate(w / 2, h / 2);
        const beamAngle = frame * 0.02;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        for (let i = 0; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.arc(0, 0, Math.max(w, h), beamAngle + (i * Math.PI) / 2, beamAngle + (i * Math.PI) / 2 + 0.3);
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();

        // Pulsing Golden Dust Particles
        for (let i = 0; i < 20; i++) {
          const px = (frame * 1.5 + i * 42) % w;
          const py = (frame * 0.8 + i * 28) % h;
          ctx.fillStyle = i % 2 === 0 ? 'rgba(250, 204, 21, 0.7)' : 'rgba(255, 255, 255, 0.6)';
          ctx.beginPath();
          ctx.arc(px, py, (i % 3) + 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Sponsor Badge Card at Top
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(24, 24, 300, 36, 12);
        ctx.fill();
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = 'bold 10px monospace';
        ctx.fillStyle = '#facc15';
        ctx.textAlign = 'left';
        ctx.fillText(`📢 ${activeAd.sponsorBadge}`, 36, 40);
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(activeAd.sponsorName, 36, 54);

        // Center Product Showcase with Bouncing Avatar
        const adBob = Math.sin(frame * 0.09) * 12;
        const adX = w / 2;
        const adY = h * 0.44 + adBob;

        // Radial Product Glow
        const prodGlow = ctx.createRadialGradient(adX, adY, 20, adX, adY, 120);
        prodGlow.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
        prodGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = prodGlow;
        ctx.beginPath();
        ctx.arc(adX, adY, 120, 0, Math.PI * 2);
        ctx.fill();

        // Central Emojis (Main + Secondary)
        ctx.font = '76px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(activeAd.emoji, adX - 30, adY + 20);
        ctx.font = '54px sans-serif';
        ctx.fillText(activeAd.productImageOrIcon, adX + 45, adY + 10);

        // Commercial Headline & Tagline
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.beginPath();
        ctx.roundRect(40, h * 0.68, w - 80, 80, 16);
        ctx.fill();
        ctx.strokeStyle = 'rgba(250, 204, 21, 0.4)';
        ctx.stroke();

        ctx.font = 'bold 17px sans-serif';
        ctx.fillStyle = '#facc15';
        ctx.textAlign = 'center';
        ctx.fillText(activeAd.title, w / 2, h * 0.68 + 28);

        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.fillText(activeAd.tagline.substring(0, 95) + '...', w / 2, h * 0.68 + 52);

        // Top Right Ad Watermark
        ctx.fillStyle = '#facc15';
        ctx.font = 'bold 11px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(`AD 1 OF 1 ● 0:0${adTimeRemaining}`, w - 24, 40);

        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // ================= REGULAR VIDEO PLAYBACK MODE =================
      // Find current scene script
      const scriptIndex = Math.floor((currentTime % 30) / 7.5);
      const curScript = activeEpisode.sceneScript[scriptIndex % activeEpisode.sceneScript.length];

      // Background gradient
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, curScript.bgColor || '#0f172a');
      grad.addColorStop(1, '#020617');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Procedural Horizon & Ground Blocks
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, h * 0.75, w, h * 0.25);

      // Grid line perspective
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, h * 0.75);
        ctx.lineTo((x - w / 2) * 2 + w / 2, h);
        ctx.stroke();
      }

      // Floating Particles / Embers
      for (let i = 0; i < 15; i++) {
        const px = ((frame * 2 + i * 50) % w);
        const py = h * 0.75 - ((frame + i * 20) % (h * 0.6));
        ctx.fillStyle = i % 2 === 0 ? 'rgba(250,204,21,0.6)' : 'rgba(168,85,247,0.6)';
        ctx.beginPath();
        ctx.arc(px, py, (i % 3) + 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Animated Character Silhouette / Actor in Center
      const bob = Math.sin(frame * 0.08) * 8;
      const charX = w / 2;
      const charY = h * 0.65 + bob;

      // Character Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.beginPath();
      ctx.ellipse(charX, h * 0.75, 45, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Main Actor Glow
      const glow = ctx.createRadialGradient(charX, charY - 20, 10, charX, charY - 20, 90);
      glow.addColorStop(0, 'rgba(56,189,248,0.25)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(charX, charY - 20, 90, 0, Math.PI * 2);
      ctx.fill();

      // Character Emoji Avatar
      ctx.font = '64px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(activeEpisode.thumbnailEmoji, charX, charY);

      // Cinematic Letterbox Black Bars (2.39:1 aspect)
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, 22);
      ctx.fillRect(0, h - 22, w, 22);

      // Top Header Info
      ctx.font = 'bold 11px monospace';
      ctx.fillStyle = '#facc15';
      ctx.textAlign = 'left';
      ctx.fillText(`REC ● ${activeEpisode.series} [EPISODE ${activeEpisode.episode}]`, 20, 16);

      ctx.textAlign = 'right';
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(activeEpisode.resolution, w - 20, 16);

      // Subtitles Bar if enabled
      if (showSubtitles) {
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'center';
        
        // Background Pill
        const subText = `${curScript.speaker}: "${curScript.text}"`;
        const metrics = ctx.measureText(subText);
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.beginPath();
        ctx.roundRect(w / 2 - metrics.width / 2 - 16, h - 56, metrics.width + 32, 28, 8);
        ctx.fill();
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.fillText(subText, w / 2, h - 38);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, activeEpisode, currentTime, showSubtitles, activeAd, adTimeRemaining]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const startVideoAd = (ad?: VideoAd) => {
    const chosenAd = ad || VIDEO_ADS_CATALOG[Math.floor(Math.random() * VIDEO_ADS_CATALOG.length)];
    setActiveAd(chosenAd);
    setAdTimeRemaining(chosenAd.durationSeconds);
    setAdCanSkip(false);
    setAdRewardClaimed(false);
    setIsPlaying(false);
    audioEngine.playRobloxSound('badge');
    showToast(`📢 Sponsored Ad: ${chosenAd.title}`);
  };

  const handleClaimAdReward = () => {
    if (!activeAd || adRewardClaimed) return;
    setAdRewardClaimed(true);
    const reward = activeAd.perkReward;
    avatarManager.addCurrency(reward, 0);
    setTotalCoinsEarnedFromAds((c) => c + reward);
    setAdsWatchedCount((n) => n + 1);
    audioEngine.playMinecraftSound('levelup');
    showToast(`🎉 Claimed +${reward} MegaCoins from ${activeAd.sponsorName}!`);
  };

  const handleSkipAd = () => {
    if (!adCanSkip) return;
    if (!adRewardClaimed && activeAd) {
      handleClaimAdReward();
    }
    setActiveAd(null);
    setIsPlaying(true);
    audioEngine.playMinecraftSound('click');
  };

  const handlePlayEpisode = (ep: MegaWorldVideoEpisode) => {
    setActiveEpisode(ep);
    setCurrentTime(0);
    // Play a sponsored pre-roll video ad
    startVideoAd();
  };

  const handleToggleLike = (epId: string) => {
    setEpisodes(prev =>
      prev.map(ep => {
        if (ep.id === epId) {
          const nextLiked = !ep.hasLiked;
          return {
            ...ep,
            hasLiked: nextLiked,
            likes: ep.likes + (nextLiked ? 1 : -1),
          };
        }
        return ep;
      })
    );
    if (activeEpisode.id === epId) {
      setActiveEpisode(prev => ({
        ...prev,
        hasLiked: !prev.hasLiked,
        likes: prev.likes + (!prev.hasLiked ? 1 : -1),
      }));
    }
    audioEngine.playRobloxSound('click');
  };

  const handleSendLiveChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatInput.trim()) return;
    const msg = {
      id: `chat_${Date.now()}`,
      user: user?.displayName || 'Adventurer_Fan',
      text: newChatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setLiveChatMessages(prev => [...prev, msg]);
    setNewChatInput('');
    audioEngine.playRobloxSound('click');
  };

  const handlePublishUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newEp: MegaWorldVideoEpisode = {
      id: `vid_custom_${Date.now()}`,
      title: uploadTitle.trim(),
      season: 4,
      episode: episodes.length + 1,
      series: uploadSeries,
      duration: '06:30',
      durationSeconds: 390,
      thumbnailGradient: 'from-amber-950 via-red-950 to-stone-900',
      thumbnailEmoji: '🎬',
      brand: uploadBrand,
      views: 120,
      likes: 18,
      channelName: user?.displayName ? `${user.displayName} Studios` : 'Community Creator',
      channelVerified: false,
      publishedDate: 'Just now',
      resolution: '1080p 60FPS',
      summary: uploadSummary || 'Custom player roleplay video broadcast across MegaWorld.',
      landmarkCoordinates: { x: 100, y: 20, name: 'Custom Creator Landmark' },
      soundtrack: 'sweden',
      sceneScript: [
        { time: 0, speaker: user?.displayName || 'Player', text: uploadTitle, action: 'Custom player recording playback', bgColor: '#1c1917' },
      ],
    };

    setEpisodes([newEp, ...episodes]);
    setActiveEpisode(newEp);
    setIsUploadModalOpen(false);
    showToast(`🎬 Video "${newEp.title}" published to MegaWorld Cinema!`);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  const filteredEpisodes = episodes.filter(ep => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'minecraft') return ep.brand === 'Minecraft';
    if (activeCategory === 'roblox') return ep.brand === 'Roblox';
    if (activeCategory === 'countryballs') return ep.brand === 'Countryballs';
    if (activeCategory === 'brands') return ep.brand === 'McDonald\'s' || ep.brand === 'Sprunki' || ep.brand === 'Universal';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-stone-950 border-2 border-red-500/50 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* ================= HEADER BAR ================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-red-950 via-stone-900 to-red-950 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-600/20 border-2 border-red-500/40 flex items-center justify-center text-2xl shadow-lg">
              🎬
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  MegaWorld RP Cinema & Video Vault
                </h2>
                <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  YouTube Broadcast
                </span>
              </div>
              <p className="text-xs text-stone-300 line-clamp-1">
                Stream full roleplay Machinima series, boss raid broadcasts, and YouTube viral clips from the 200B block multiverse!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-3.5 py-1.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Plus size={14} />
              <span>Upload RP Clip</span>
            </button>

            <button
              onClick={() => {
                audioEngine.playRobloxSound('click');
                onClose();
              }}
              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Toast */}
        {toastMessage && (
          <div className="bg-red-600 text-white px-4 py-2 font-bold text-xs text-center border-b border-red-400 animate-in slide-in-from-top-2">
            {toastMessage}
          </div>
        )}

        {/* ================= MAIN THEATER & SIDEBAR ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Main Interactive Theater Player */}
            <div className="lg:col-span-2 space-y-4">
              {/* Cinema Viewport Canvas */}
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-stone-800 bg-black shadow-2xl flex flex-col justify-between group">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={450}
                  className="w-full h-full object-cover"
                />

                {/* ================= ACTIVE AD OVERLAYS ================= */}
                {activeAd ? (
                  <div className="absolute inset-0 z-30 pointer-events-auto flex flex-col justify-between p-4 bg-gradient-to-t from-black/80 via-transparent to-black/60">
                    {/* Top Ad Info & Skip Action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-black/80 border border-amber-500/50 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-400 shadow-md">
                        <Tv size={14} className="text-amber-400 animate-pulse" />
                        <span>SPONSORED AD 1 OF 1 • 0:0{adTimeRemaining}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {adCanSkip ? (
                          <button
                            onClick={handleSkipAd}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl shadow-xl transition transform hover:scale-105 cursor-pointer border border-yellow-300"
                          >
                            <span>Skip Ad</span>
                            <FastForward size={14} />
                          </button>
                        ) : (
                          <div className="px-3.5 py-1.5 bg-black/80 border border-white/20 text-stone-300 text-xs font-mono font-bold rounded-xl shadow">
                            <span>Skip in {Math.max(1, activeAd.skipAfterSeconds - (activeAd.durationSeconds - adTimeRemaining))}s</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Bottom Ad Action Bar */}
                    <div className="bg-black/90 border border-amber-500/40 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xl">
                      <div className="flex items-center gap-3 text-left">
                        <span className="text-3xl">{activeAd.emoji}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-white">{activeAd.title}</span>
                            <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {activeAd.brand}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-300 line-clamp-1">{activeAd.sponsorName}</p>
                        </div>
                      </div>

                      <button
                        onClick={handleClaimAdReward}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition transform hover:scale-105 cursor-pointer shadow-lg whitespace-nowrap ${
                          adRewardClaimed
                            ? 'bg-emerald-600 text-white border border-emerald-400'
                            : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-stone-950 border border-yellow-300'
                        }`}
                      >
                        <Gift size={15} />
                        <span>{adRewardClaimed ? '✓ Reward Claimed (+100 🪙)' : activeAd.callToAction}</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Big Center Play / Pause Overlay Icon when hovered */}
                    <div 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 opacity-0 group-hover:opacity-100 transition duration-200"
                    >
                      <div className="w-16 h-16 rounded-full bg-red-600/90 hover:bg-red-500 text-white flex items-center justify-center text-2xl shadow-2xl transition transform hover:scale-110">
                        {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
                      </div>
                    </div>

                    {/* Bottom Control Bar */}
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3 sm:p-4 space-y-2 z-20">
                      {/* Progress Scrubber */}
                      <div className="w-full flex items-center gap-2">
                        <input
                          type="range"
                          min={0}
                          max={activeEpisode.durationSeconds}
                          value={currentTime}
                          onChange={e => setCurrentTime(parseInt(e.target.value, 10))}
                          className="w-full accent-red-500 h-1.5 bg-stone-700 rounded-lg cursor-pointer"
                        />
                      </div>

                      {/* Controls Row */}
                      <div className="flex items-center justify-between text-xs text-white">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="hover:text-red-400 transition cursor-pointer"
                          >
                            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                          </button>

                          <button
                            onClick={() => setCurrentTime(0)}
                            title="Restart"
                            className="hover:text-amber-400 transition cursor-pointer"
                          >
                            <RotateCcw size={15} />
                          </button>

                          {/* Time Code */}
                          <span className="text-[11px] font-mono text-stone-300">
                            {formatSeconds(currentTime)} / {activeEpisode.duration}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Watch Ad Bonus Button */}
                          <button
                            onClick={() => startVideoAd()}
                            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 rounded-xl text-[10px] font-black transition cursor-pointer"
                            title="Watch a commercial to earn 100 MegaCoins!"
                          >
                            <Tv size={12} />
                            <span>Watch Ad (+100 🪙)</span>
                          </button>

                          {/* Subtitles Toggle */}
                          <button
                            onClick={() => setShowSubtitles(!showSubtitles)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border transition cursor-pointer ${
                              showSubtitles ? 'bg-red-600 text-white border-red-500' : 'bg-stone-800 text-stone-400 border-stone-700'
                            }`}
                          >
                            CC
                          </button>

                          {/* Volume Slider */}
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="hover:text-red-400 transition cursor-pointer"
                          >
                            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                          </button>

                          {/* Resolution Tag */}
                          <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/20">
                            {activeEpisode.resolution}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>


              {/* Video Title & Metadata Details */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 shadow-xl space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-red-400 font-bold mb-1">
                      <span>{activeEpisode.series}</span>
                      <span>•</span>
                      <span>Season {activeEpisode.season}, Ep {activeEpisode.episode}</span>
                    </div>
                    <h3 className="text-xl font-black text-white">{activeEpisode.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                      <span>{activeEpisode.views.toLocaleString()} views</span>
                      <span>•</span>
                      <span>Published {activeEpisode.publishedDate}</span>
                    </div>
                  </div>

                  {/* Action Buttons: Like, Share, Warp to Landmark */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={() => handleToggleLike(activeEpisode.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                        activeEpisode.hasLiked
                          ? 'bg-red-600 text-white border-red-500 shadow-md'
                          : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border-stone-700'
                      }`}
                    >
                      <ThumbsUp size={14} />
                      <span>{activeEpisode.likes.toLocaleString()}</span>
                    </button>

                    {onWarpToCoordinates && (
                      <button
                        onClick={() => {
                          audioEngine.playRobloxSound('badge');
                          onWarpToCoordinates(activeEpisode.landmarkCoordinates.x, activeEpisode.landmarkCoordinates.y);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 hover:text-white border border-cyan-500/50 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow"
                        title="Teleport to Scene Filming Location"
                      >
                        <Compass size={14} />
                        <span>Warp to Scene Location</span>
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed pt-2 border-t border-stone-800">
                  {activeEpisode.summary}
                </p>

                {/* Filming Location Landmark */}
                <div className="flex items-center justify-between text-[11px] bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-stone-400">
                  <span>Filmed at: <strong className="text-amber-400">{activeEpisode.landmarkCoordinates.name}</strong></span>
                  <span>Coordinates: <strong className="text-white">X: {activeEpisode.landmarkCoordinates.x}, Y: {activeEpisode.landmarkCoordinates.y}</strong></span>
                </div>
              </div>
            </div>

            {/* Right Col: Live Chat Simulator & Next In Series */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Live Chat Box */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-xl flex flex-col h-80">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-2">
                  <span className="text-xs font-black text-white flex items-center gap-1.5">
                    <Radio size={14} className="text-red-500 animate-pulse" />
                    <span>Live RP Stream Chat</span>
                  </span>
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30 font-bold">
                    1.4K Watching
                  </span>
                </div>

                {/* Messages Scrollbox */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  {liveChatMessages.map(msg => (
                    <div key={msg.id} className="bg-stone-950/60 p-2 rounded-xl border border-stone-800/80 leading-snug">
                      <div className="flex items-center justify-between text-[10px] mb-0.5">
                        <strong className="text-amber-400">{msg.user}</strong>
                        <span className="text-stone-500">{msg.time}</span>
                      </div>
                      <span className="text-stone-200">{msg.text}</span>
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <form onSubmit={handleSendLiveChat} className="flex gap-1.5 mt-2 pt-2 border-t border-stone-800">
                  <input
                    type="text"
                    value={newChatInput}
                    onChange={e => setNewChatInput(e.target.value)}
                    placeholder="Chat in live stream..."
                    className="flex-1 bg-stone-950 border border-stone-800 text-white text-xs px-3 py-1.5 rounded-xl focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    <Send size={13} />
                  </button>
                </form>
              </div>

              {/* Creator Channel Box */}
              <div className="bg-stone-900 border border-stone-800 rounded-3xl p-4 shadow-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-black text-sm">
                    YT
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-white flex items-center gap-1">
                      <span>{activeEpisode.channelName}</span>
                      {activeEpisode.channelVerified && <span className="text-cyan-400">✓</span>}
                    </h4>
                    <span className="text-[10px] text-stone-400">1.25M Subscribers</span>
                  </div>
                </div>
                <button
                  onClick={() => showToast('🔔 Subscribed to MegaWorld YouTube Creator Network!')}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white font-black text-xs rounded-xl shadow cursor-pointer transition"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* ================= EPISODES & SEASONS BROWSER ================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-2">
              <div>
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <Film size={18} className="text-red-400" />
                  <span>MegaWorld RP Series Catalog</span>
                </h3>
                <p className="text-xs text-stone-400">
                  Select any episode to stream immediately in the cinema player!
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All Episodes' },
                  { id: 'minecraft', label: 'Minecraft Lore' },
                  { id: 'roblox', label: 'Roblox Obby RP' },
                  { id: 'countryballs', label: 'Countryballs Wars' },
                  { id: 'brands', label: 'McDonald\'s & Sprunki' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 text-xs rounded-xl font-bold transition border cursor-pointer ${
                      activeCategory === cat.id
                        ? 'bg-red-600 text-white border-red-500 shadow'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredEpisodes.map(ep => {
                const isSelected = activeEpisode.id === ep.id;

                return (
                  <div
                    key={ep.id}
                    onClick={() => handlePlayEpisode(ep)}
                    className={`bg-stone-900/90 border-2 rounded-2xl overflow-hidden cursor-pointer shadow-xl transition transform hover:-translate-y-1 ${
                      isSelected ? 'border-red-500 ring-2 ring-red-500/40' : 'border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className={`relative w-full aspect-video bg-gradient-to-br ${ep.thumbnailGradient} flex items-center justify-center overflow-hidden`}>
                      <span className="text-4xl filter drop-shadow">{ep.thumbnailEmoji}</span>
                      
                      {/* Duration Tag */}
                      <span className="absolute bottom-2 right-2 bg-black/85 text-white font-mono text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {ep.duration}
                      </span>

                      {/* Brand Tag */}
                      <span className="absolute top-2 left-2 bg-black/70 text-amber-300 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-white/10">
                        {ep.brand}
                      </span>
                    </div>

                    {/* Card Details */}
                    <div className="p-3.5 space-y-1.5">
                      <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-red-400">
                        {ep.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2">
                        {ep.summary}
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-800">
                        <span>{ep.channelName}</span>
                        <span>{ep.views.toLocaleString()} views</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ================= MULTIVERSE COMMERCIALS & SPONSORED ADS ROW ================= */}
            <div className="pt-6 border-t border-stone-800 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                    <Tv size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>Multiverse Commercials & Video Ads</span>
                      <span className="text-[10px] bg-amber-500 text-stone-950 font-black px-2 py-0.2 rounded-full uppercase">
                        +100 🪙 Each
                      </span>
                    </h3>
                    <p className="text-[11px] text-stone-400">
                      Watch authentic commercials from integrated brands and collect instant MegaCoin bonuses!
                    </p>
                  </div>
                </div>

                <div className="text-xs font-mono text-amber-400 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
                  <Coins size={14} className="text-amber-400" />
                  <span>Ads Watched: <strong className="text-white">{adsWatchedCount}</strong></span>
                  <span>•</span>
                  <span>Earned: <strong className="text-emerald-400">+{totalCoinsEarnedFromAds} 🪙</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {VIDEO_ADS_CATALOG.map((ad) => (
                  <div
                    key={ad.id}
                    onClick={() => startVideoAd(ad)}
                    className="p-3 bg-gradient-to-br from-stone-900 to-stone-950 border border-amber-500/30 hover:border-amber-400 rounded-2xl cursor-pointer shadow-lg transition transform hover:-translate-y-1 group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{ad.emoji}</span>
                        <span className="text-lg">{ad.productImageOrIcon}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        +{ad.perkReward} 🪙
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-white line-clamp-1 group-hover:text-amber-300">
                      {ad.title}
                    </h4>
                    <p className="text-[10px] text-stone-400 line-clamp-2 mt-0.5">
                      {ad.sponsorName} • {ad.tagline}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[10px] pt-1.5 border-t border-stone-800/80">
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Tv size={11} />
                        <span>Play Commercial</span>
                      </span>
                      <span className="text-stone-500 font-mono">0:0{ad.durationSeconds}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ================= UPLOAD RP VIDEO CLIP MODAL ================= */}
        {isUploadModalOpen && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <form onSubmit={handlePublishUpload} className="bg-stone-900 border-2 border-red-500/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span>🎬</span>
                  <span>Publish MegaWorld RP Video</span>
                </h4>
                <button type="button" onClick={() => setIsUploadModalOpen(false)} className="text-stone-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Video Title</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="e.g. Infiltration of the McDonald's Vault"
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">Series Name</label>
                  <input
                    type="text"
                    value={uploadSeries}
                    onChange={e => setUploadSeries(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">Brand Universe</label>
                  <select
                    value={uploadBrand}
                    onChange={e => setUploadBrand(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-red-500"
                  >
                    <option value="Minecraft">Minecraft</option>
                    <option value="Roblox">Roblox</option>
                    <option value="Countryballs">Countryballs</option>
                    <option value="McDonald's">McDonald's</option>
                    <option value="Sprunki">Sprunki</option>
                    <option value="Xilam">Xilam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Synopsis & Plot Description</label>
                <textarea
                  rows={3}
                  value={uploadSummary}
                  onChange={e => setUploadSummary(e.target.value)}
                  placeholder="What happens in this roleplay clip? Who are the featured players?"
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow"
                >
                  Publish to Cinema
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
