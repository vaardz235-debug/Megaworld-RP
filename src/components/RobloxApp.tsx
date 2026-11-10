import React, { useState, useEffect, useRef } from 'react';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { audioEngine } from '../utils/audioEngine';
import { 
  Gamepad2, 
  Sparkles, 
  Volume2, 
  Coins, 
  ShoppingBag, 
  Check, 
  ArrowRight, 
  Flame, 
  Shield, 
  Zap, 
  Smile, 
  X, 
  Play, 
  RotateCcw, 
  Trophy, 
  AlertTriangle, 
  Wind, 
  Waves, 
  Compass, 
  Gift, 
  Tag, 
  Swords, 
  Heart,
  ChevronRight,
  ExternalLink,
  Crown,
  Lock,
  Calendar,
  TrendingUp,
  Star,
  FastForward,
  CheckCircle2,
  Award,
  Search,
  Radio,
  Users,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  Send,
  Sliders,
  MessageCircle,
  RefreshCw,
  Share2,
  Copy
} from 'lucide-react';
import { socialFeedManager, SocialPost } from '../utils/socialFeedManager';

export interface RobloxExperienceInfo {
  id: 'verity_rp' | 'obby' | 'disaster' | 'tycoon' | 'bloxfruits' | 'brookhaven';
  name: string;
  badge?: string;
  isFeatured?: boolean;
  category: string;
  description: string;
  playerCount?: string;
  rating?: string;
  bannerGradient?: string;
  emoji?: string;
  genre?: string;
}

export const ROBLOX_EXPERIENCES: RobloxExperienceInfo[] = [
  { 
    id: 'verity_rp', 
    name: '✨ Sprunki RP: Verity', 
    badge: 'NEW UPDATE', 
    isFeatured: true, 
    category: 'Roleplay & Lore', 
    description: 'Celestial Shrine exploration, Star Oracle morphs, and Starlight chimes!',
    playerCount: '48.2K',
    rating: '98%',
    bannerGradient: 'from-purple-900 via-indigo-900 to-slate-900',
    emoji: '✨',
    genre: 'Roleplay'
  },
  { 
    id: 'obby', 
    name: '🏃 Tower Obby', 
    badge: 'Popular', 
    category: 'Obstacle Course', 
    description: 'Conquer challenging neon platforms, checkpoints, and high-altitude jumps!',
    playerCount: '32.1K',
    rating: '94%',
    bannerGradient: 'from-cyan-900 via-blue-900 to-slate-900',
    emoji: '🏃',
    genre: 'Platformer'
  },
  { 
    id: 'disaster', 
    name: '🌪️ Natural Disasters', 
    badge: 'Survival', 
    category: 'Survival', 
    description: 'Survive flash floods, earthquakes, meteors, and acid storm waves!',
    playerCount: '27.4K',
    rating: '92%',
    bannerGradient: 'from-emerald-900 via-teal-900 to-slate-900',
    emoji: '🌪️',
    genre: 'Survival'
  },
  { 
    id: 'tycoon', 
    name: '🏭 Robux Tycoon', 
    badge: 'Idle', 
    category: 'Tycoon & Economy', 
    description: 'Build automated conveyor droppers, upgrade factories, and collect massive R$!',
    playerCount: '39.8K',
    rating: '96%',
    bannerGradient: 'from-amber-900 via-yellow-900 to-stone-900',
    emoji: '🏭',
    genre: 'Tycoon'
  },
  { 
    id: 'bloxfruits', 
    name: '⚔️ Blox Fruits Arena', 
    badge: 'Action', 
    category: 'Action & PVP', 
    description: 'Master mystical devil fruit powers like Flame, Ice, Dough, and Light!',
    playerCount: '52.6K',
    rating: '97%',
    bannerGradient: 'from-rose-900 via-red-900 to-neutral-900',
    emoji: '⚔️',
    genre: 'Action RPG'
  },
  { 
    id: 'brookhaven', 
    name: '🏡 Brookhaven RP', 
    badge: 'Roleplay', 
    category: 'Roleplay & Hangout', 
    description: 'Live in dream homes, drive luxury sports cars, and meet friendly players!',
    playerCount: '61.4K',
    rating: '95%',
    bannerGradient: 'from-sky-900 via-indigo-950 to-neutral-900',
    emoji: '🏡',
    genre: 'Life Sim'
  },
];

interface RobloxAppProps {
  onSelectAvatar: (char: CharacterData) => void;
  onLaunchGame: () => void;
  currentAvatar?: CharacterData;
  onClose?: () => void;
  onOpenCommunityDashboard?: () => void;
  initialGameId?: RobloxExperienceInfo['id'];
}

export const ROBLOX_PRESET_AVATARS: CharacterData[] = [
  {
    id: 501,
    name: 'Classic Noob',
    type: 'roblox',
    subtype: 'noob',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#0055ff',
    robloxLegsColor: '#16a34a',
    robloxFace: 'smile',
    robloxHat: 'none',
    robloxGear: 'sword',
    color: 'bg-yellow-400',
    description: 'The iconic 2006 yellow/blue/green Roblox Noob. Armed with the legendary Linked Sword!',
  },
  {
    id: 502,
    name: 'Bacon Hair (Pal Hair)',
    type: 'roblox',
    subtype: 'bacon',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#1e3a8a',
    robloxLegsColor: '#451a03',
    robloxFace: 'winning',
    robloxHat: 'bacon',
    robloxGear: 'cola',
    color: 'bg-amber-800',
    description: 'Bacon Hair in a denim jacket with winning smile and ice cold Bloxy Cola!',
  },
  {
    id: 503,
    name: 'Builderman',
    type: 'roblox',
    subtype: 'builderman',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#ea580c',
    robloxLegsColor: '#334155',
    robloxFace: 'smile',
    robloxHat: 'hardhat',
    robloxGear: 'coil',
    color: 'bg-orange-500',
    description: 'Roblox CEO and Master Builder with safety hardhat and bouncing Gravity Coil!',
  },
  {
    id: 504,
    name: 'Guest 666',
    type: 'roblox',
    subtype: 'guest',
    robloxHeadColor: '#1c1917',
    robloxTorsoColor: '#0a0a0a',
    robloxLegsColor: '#09090b',
    robloxFace: 'beast',
    robloxHat: 'beanie',
    robloxGear: 'sword',
    color: 'bg-red-950',
    description: 'Creepypasta legend! Pitch black body with glowing crimson demon eyes and fangs!',
  },
  {
    id: 505,
    name: 'Korblox Deathspeaker',
    type: 'roblox',
    subtype: 'korblox',
    robloxHeadColor: '#0ea5e9',
    robloxTorsoColor: '#0369a1',
    robloxLegsColor: '#075985',
    robloxFace: 'chill',
    robloxHat: 'none',
    robloxGear: 'speed_coil',
    color: 'bg-cyan-600',
    description: 'Frostbite archon with the famous floating frozen toothpick skeleton leg & Speed Coil!',
  },
  {
    id: 506,
    name: 'Dominus Aureus',
    type: 'roblox',
    subtype: 'dominus',
    robloxHeadColor: '#09090b',
    robloxTorsoColor: '#18181b',
    robloxLegsColor: '#18181b',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    color: 'bg-neutral-900',
    description: 'Mythical multimillion-Robux hooded emperor with golden wings and glowing void eyes!',
  },
  {
    id: 507,
    name: 'Valkyrie Warrior',
    type: 'roblox',
    subtype: 'valkyrie',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#475569',
    robloxLegsColor: '#334155',
    robloxFace: 'epic',
    robloxHat: 'valkyrie',
    robloxGear: 'sword',
    color: 'bg-slate-500',
    description: 'Sacred winged silver Valkyrie Helm with emerald jewel and epic face!',
  },
];

// ==========================================================
// LOCALIZED CHAT BUBBLES & COURTYARD MULTIPLAYER SYSTEM
// ==========================================================
export interface LocalizedChatBubble {
  id: string;
  speakerId: string;
  speakerName: string;
  colorHex: string;
  text: string;
  studDistance: number;
  timestamp: number;
  expiresAt: number;
  isPlayer?: boolean;
}

export interface ChatHistoryMessage {
  id: string;
  sender: string;
  channel: 'Local' | 'Emote' | 'Server';
  text: string;
  color: string;
  time: string;
  distance?: number;
}

export interface PlazaNpcPlayer {
  id: string;
  name: string;
  avatar: CharacterData;
  studDistance: number;
  status: string;
  badge: string;
  badgeColor: string;
  colorHex: string;
  positionX: string;
}

export const PLAZA_NPC_PLAYERS: PlazaNpcPlayer[] = [
  {
    id: 'noob',
    name: 'Classic Noob',
    avatar: ROBLOX_PRESET_AVATARS[0],
    studDistance: 4,
    status: 'Exploring',
    badge: 'Noob lvl 8',
    badgeColor: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    colorHex: '#facc15',
    positionX: '12%',
  },
  {
    id: 'bacon',
    name: 'Bacon Hair',
    avatar: ROBLOX_PRESET_AVATARS[1],
    studDistance: 7,
    status: 'In Courtyard',
    badge: 'Veteran',
    badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    colorHex: '#60a5fa',
    positionX: '30%',
  },
  {
    id: 'builderman',
    name: 'Builderman',
    avatar: ROBLOX_PRESET_AVATARS[2],
    studDistance: 11,
    status: 'Master Architect',
    badge: 'Roblox Admin 🔨',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    colorHex: '#fb923c',
    positionX: '68%',
  },
  {
    id: 'valkyrie',
    name: 'Valkyrie Warrior',
    avatar: ROBLOX_PRESET_AVATARS[6],
    studDistance: 16,
    status: 'Champion',
    badge: 'Warrior ⚔️',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    colorHex: '#34d399',
    positionX: '84%',
  },
  {
    id: 'korblox',
    name: 'Korblox Lord',
    avatar: ROBLOX_PRESET_AVATARS[4],
    studDistance: 24,
    status: 'Frostbite',
    badge: 'Archon ❄️',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    colorHex: '#38bdf8',
    positionX: '94%',
  },
  {
    id: 'guest666',
    name: 'Guest 666',
    avatar: ROBLOX_PRESET_AVATARS[3],
    studDistance: 32,
    status: 'Shadow Realm',
    badge: 'Spooky 💀',
    badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    colorHex: '#f87171',
    positionX: '4%',
  },
];

export const ROBLOX_EMOTE_RESPONSES: Record<string, Record<string, string[]>> = {
  '/e dance': {
    noob: [
      'Ayyy dance party! :D',
      '*does classic noob wiggle spin*',
      'Dancing with you!! 🕺',
      'Woooo! Drop the beat!',
    ],
    bacon: [
      'Nice moves! Watch me join! /e dance2',
      'Who has the best rhythm in the server?!',
      "Bacon shuffle let's go! 🔥",
    ],
    builderman: [
      '10/10! Spawning dynamic disco floor lights! 🪩',
      'Top tier choreography, builder!',
      'Physics engine dance cycle approved!',
    ],
    valkyrie: [
      'A glorious victory dance of champions! ⚔️',
      'Valhalla beat drop! Celebrate the glory!',
    ],
    korblox: [
      '*spectral hover dance in the sub-zero frost*',
      'Cold winds echo your rhythmic steps...',
    ],
    guest666: [
      '...the dark ritual tempo begins...',
      '*haunting 360 shadow spin* 💀',
    ],
  },
  '/e dance2': {
    noob: [
      'Breakdance spin!! Look at me go! 🌀',
      'Windmill noob power!',
    ],
    bacon: [
      'Ooh that rhythm is straight fire! 🔥',
      'Server groove on point!',
    ],
    builderman: [
      'Synchronizing network dance packets across all clients!',
    ],
    valkyrie: [
      'Warrior combat drill dance! ⚔️',
    ],
    korblox: [
      '*frost crystallization rhythm*',
    ],
    guest666: [
      '...dancing upon the cursed baseplate...',
    ],
  },
  '/e wave': {
    noob: [
      'Hiiii!! 👋 Welcome to the server!',
      'Hello friend! Can I have 5 Robux please? :3',
      'Hiii! Waving back at you! 👋',
    ],
    bacon: [
      "Yo what's up! 👋",
      'Hey there! Want to jump in Tower Obby?',
      'Welcome to Crossroads Courtyard! 👋',
    ],
    builderman: [
      'Welcome to Roblox! Great to see you in the server!',
      'Happy building and scripting! 🔨',
    ],
    valkyrie: [
      'Greetings, brave warrior! 🛡️',
      'May your sword stay keen and true.',
    ],
    korblox: [
      '*cold silent nod from the frost archon*',
      'Greetings, mortal voyager.',
    ],
    guest666: [
      '...i see you waving into the darkness...',
    ],
  },
  '/e point': {
    noob: [
      "What is over there?! Is it free Bloxy Cola?! 🥤",
      'Look at that sky island platform! 👆',
    ],
    bacon: [
      'Whoa check it out! Secret badge stud spotted! 🔍',
      'Follow them, they found the hidden passage!',
    ],
    builderman: [
      'Careful pointing! That sector is undergoing voxel maintenance!',
    ],
    valkyrie: [
      'Pointing toward the enemy ramparts! Charge! ⚔️',
    ],
    korblox: [
      'You point toward the desolate northern peaks...',
    ],
    guest666: [
      '...the cursed rift opens where you point...',
    ],
  },
  '/e cheer': {
    noob: [
      'HOORAY! WOOOO! 🎉🎉🎉',
      'WE DID IT! GG GUYS!!',
      'BEST SQUAD IN ROBLOX! 🏆',
    ],
    bacon: [
      "LET'S GOOOOO! 🔥🔥🔥",
      'HYPE! That was totally epic!',
      'GG WP! Best server ever!',
    ],
    builderman: [
      'Outstanding teamwork everyone! 🏆',
      'A true masterclass in community gameplay!',
    ],
    valkyrie: [
      'Glory and eternal honor to our server! Huzzah! ⚔️',
    ],
    korblox: [
      'The freezing wind carries our victory.',
    ],
    guest666: [
      '...your cheer echoes across the void...',
    ],
  },
  '/e laugh': {
    noob: [
      'HAHAHAHAHA XD :D',
      'ROFL LOLOL that is too funny!!',
      'My sides hurt from laughing! 😂',
    ],
    bacon: [
      "LMAOOOO I can't even! 😂",
      'Bruh that was hilarious!',
      'Dead from laughter! 💀',
    ],
    builderman: [
      'Haha, that ragdoll glitch never gets old!',
    ],
    valkyrie: [
      'Hearty laughter among battle-tested warriors!',
    ],
    korblox: [
      '*frosty hollow chuckle echoes*',
    ],
    guest666: [
      '...hehehe...hahaha...💀',
    ],
  },
  '/e salute': {
    noob: [
      '🫡 Sir yes sir! Ready to build!',
      'Salute! Respect to the captain!',
    ],
    bacon: [
      '🫡 Big respect! Top player in the lobby!',
    ],
    builderman: [
      '🫡 Salute! Thank you for maintaining our community!',
    ],
    valkyrie: [
      '🫡 Iron discipline and unwavering loyalty! At your command!',
    ],
    korblox: [
      '*freezes rigid in eternal salute*',
    ],
    guest666: [
      '...even shadows recognize authority...',
    ],
  },
  '/e shrug': {
    noob: [
      'idk lol ¯\\_(ツ)_/¯',
      'Nobody told me anything! I am just a noob!',
    ],
    bacon: [
      "Don't look at me, I just spawned 30 seconds ago! 🤷",
    ],
    builderman: [
      'Must be an unhandled physics raycast exception!',
    ],
    valkyrie: [
      'The fog of war conceals the outcome.',
    ],
    korblox: [
      'The winter frost answers nothing.',
    ],
    guest666: [
      '...some mysteries are not meant to be solved...',
    ],
  },
  '/e oof': {
    noob: [
      'NOOOOO! NOT THE OOF! 😭💀',
      'Rest in pepperoni! OOF in peace brother!',
    ],
    bacon: [
      'RIP! Tommy Tallarico grunt strikes again! 💀',
      'Press F to pay respects!',
    ],
    builderman: [
      'Respawning character block model in 3... 2... 1...',
    ],
    valkyrie: [
      'A heroic warrior has fallen! We shall avenge you! ⚔️',
    ],
    korblox: [
      'Another soul claimed by the sub-zero chill...',
    ],
    guest666: [
      '...your soul now belongs to server 666... 💀',
    ],
  },
  '/e flex': {
    noob: [
      'Look at my massive Roblox blox muscles! 💪',
      'Stronk noob power!',
    ],
    bacon: [
      'Do you even lift Robux?! 💪🔥',
      'Pure bacon gains in the gym!',
    ],
    builderman: [
      'Forged from solid anchor blocks!',
    ],
    valkyrie: [
      'Strength forged through hundreds of duels!',
    ],
    korblox: [
      'Frozen iron constitution...',
    ],
    guest666: [
      '...dark essence transcends flesh and stone...',
    ],
  },
  '/e tilt': {
    noob: [
      '*tilts head* Huh? Why is the baseplate sideways? :O',
    ],
    bacon: [
      'Who messed with the camera CFrame?! lol',
    ],
    builderman: [
      'Checking gyroscope and camera rotation matrix!',
    ],
    valkyrie: [
      'Assessing battlefield angles.',
    ],
    korblox: [
      'The world tilts on frozen axes...',
    ],
    guest666: [
      '...reality is distorting before your eyes...',
    ],
  },
  'sound_oof': {
    noob: ['OOF!! 💀 That classic grunt never dies!', 'RIP bro!'],
    bacon: ['Legendary Tommy Tallarico sound! 💀', 'Classic 2006 memory!'],
    builderman: ['Health reduced to 0! Respawning!'],
    valkyrie: ['A warrior has fallen in combat!'],
    guest666: ['...one more soul for the server...'],
  },
  'sound_sword': {
    valkyrie: ['Draw your Linked Swords! En garde! ⚔️', 'Schwing! Combat ready!'],
    noob: ["AHHH don't slash me please! I have no armor! 🛡️"],
    bacon: ['Sword fight on the heights! SFOTH nostalgia! ⚔️'],
    builderman: ['Be careful with the melee hitboxes!'],
  },
  'sound_cola': {
    bacon: ['Ahhh! Crisp cold Bloxy Cola! Save a sip for me! 🥤', 'Ice cold refreshment!'],
    noob: ['Fizzy! Slurp slurp! Can I have a sip? 🥤'],
    builderman: ['Hydration boost: +50 HP applied!'],
  },
  'sound_cheezburger': {
    noob: ['CAN I HAZ CHEEZBURGER PLZ?! 🍔 Mmmm... tasty!'],
    bacon: ['Burgers for the whole squad! 🍔 Mmm!'],
    builderman: ['Mmm... Cheezburger! Classic 2008 audio!'],
  },
  'sound_coil': {
    builderman: ['Gravity Coil enabled! Low gravity spring physics! 🌀'],
    noob: ['BOING BOING BOING! I am flying to the clouds! ☁️'],
    bacon: ['High jump right onto the leaderboard platform!'],
  },
  'sound_speed': {
    korblox: ['Speed Coil supersonic overdrive engaged! ⚡'],
    bacon: ['Zooming across the baseplate at lightspeed! ⚡'],
    noob: ['Wait for meeeee! Too fast!'],
  },
  'sound_rocket': {
    bacon: ['INCOMING SUB-BASS ROCKET! TAKE COVER! 🚀💥'],
    noob: ['BOOM! The explosion rattled my blox! 💥'],
    builderman: ['Rebuilding the blast zone voxels!'],
  },
  'sound_badge': {
    builderman: ['🏆 Badge Awarded: Master of the Crossroads Plaza!'],
    noob: ['WOAH YOU WON A BADGE! CONGRATS! 🎉'],
    valkyrie: ['Trophy earned through skill and valor! 🏅'],
  },
};

// ==========================================================
// DAILY STREAK CONFIGURATION & REWARD TIERS
// ==========================================================
export interface DailyStreakReward {
  day: number;
  robux: number;
  title: string;
  perk: string;
  badgeIcon: string;
  isJackpot?: boolean;
}

export const DAILY_STREAK_REWARDS: DailyStreakReward[] = [
  { day: 1, robux: 300, title: 'Flame Spark', perk: 'Streak Initiated + Spark Aura', badgeIcon: '🔥' },
  { day: 2, robux: 600, title: 'Speed Surge', perk: '+100% Speed Coil Acceleration', badgeIcon: '⚡' },
  { day: 3, robux: 1000, title: 'Bloxy Bronze', perk: 'Bronze Blox Dedication Trophy', badgeIcon: '🥉' },
  { day: 4, robux: 1500, title: 'Gravity Lift', perk: 'Super Jump Coil Float Buff', badgeIcon: '🚀' },
  { day: 5, robux: 2200, title: 'Golden Chime', perk: 'Golden Boombox Music Aura', badgeIcon: '🌟' },
  { day: 6, robux: 3200, title: 'Valkyrie Eve', perk: 'Eve of Dominus Diamond Tier', badgeIcon: '💎' },
  { day: 7, robux: 5000, title: 'Dominus Jackpot', perk: 'Mythic Dominus Crown & 5,000 R$!', badgeIcon: '👑', isJackpot: true },
];

export function getRewardForStreakDay(day: number): DailyStreakReward {
  if (day <= 7) {
    return DAILY_STREAK_REWARDS[day - 1];
  }
  const extraDays = day - 7;
  const extraRobux = 5000 + extraDays * 500;
  return {
    day,
    robux: extraRobux,
    title: `Consecutive Legend Day ${day}`,
    perk: `Mythic Master Streak (${day}x Multiplier Active!)`,
    badgeIcon: '👑',
    isJackpot: day % 7 === 0,
  };
}

export function getTodayDateStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function RobloxExperienceCard({
  game,
  isFavorite,
  onToggleFavorite,
  onSelectGame,
  isSelected,
  onLaunchMegaWorld,
  onShareExperience,
}: {
  game: RobloxExperienceInfo;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSelectGame: (id: RobloxExperienceInfo['id']) => void;
  isSelected?: boolean;
  onLaunchMegaWorld?: () => void;
  onShareExperience?: (game: RobloxExperienceInfo, e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={() => onSelectGame(game.id)}
      className={`group relative rounded-2xl bg-[#232527] border transition-all duration-200 overflow-hidden flex flex-col justify-between cursor-pointer shadow-lg hover:shadow-2xl hover:scale-[1.01] ${
        isSelected
          ? 'border-[#00A2FF] ring-2 ring-[#00A2FF]/30'
          : 'border-[#393B3D] hover:border-stone-500'
      }`}
    >
      {/* Banner Area */}
      <div className={`h-28 bg-gradient-to-r ${game.bannerGradient || 'from-indigo-900 to-slate-900'} p-3.5 relative flex flex-col justify-between overflow-hidden`}>
        {/* Subtle decorative dot grid */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '16px 16px'
          }}
        />

        {/* Top bar: Badge/Category on left, Heart Icon Button on right */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {game.badge && (
              <span className={`text-[10px] font-black font-mono px-2 py-0.5 rounded-full uppercase tracking-wider ${
                game.badge === 'NEW UPDATE'
                  ? 'bg-amber-400 text-black animate-pulse'
                  : 'bg-white/20 text-white backdrop-blur-xs'
              }`}>
                {game.badge}
              </span>
            )}
            <span className="text-[10px] font-mono text-stone-300 bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/10">
              {game.category}
            </span>
          </div>

          {/* Heart Icon Button to favorite/unfavorite */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id, e);
            }}
            title={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
            aria-label={isFavorite ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
            className={`p-2 rounded-xl backdrop-blur-md transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md group/heart ${
              isFavorite
                ? 'bg-red-500/25 text-red-400 hover:bg-red-500/35 border border-red-500/50 scale-105'
                : 'bg-black/50 text-stone-300 hover:text-red-400 hover:bg-black/70 border border-white/15'
            }`}
          >
            <Heart
              size={16}
              className={`transition-transform duration-200 ${
                isFavorite
                  ? 'fill-red-500 text-red-500 scale-110 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                  : 'group-hover/heart:scale-115 text-stone-300 group-hover/heart:text-red-400'
              }`}
            />
          </button>
        </div>

        {/* Big Emoji / Visual Icon in banner */}
        <div className="relative z-10 flex items-end justify-between">
          <span className="text-3xl filter drop-shadow-lg select-none">
            {game.emoji || '🎮'}
          </span>
          <div className="flex items-center gap-2">
            {game.playerCount && (
              <span className="text-[10px] font-mono font-bold text-emerald-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>{game.playerCount}</span>
              </span>
            )}
            {game.rating && (
              <span className="text-[10px] font-mono font-bold text-amber-300 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full flex items-center gap-1 border border-amber-500/30">
                <ThumbsUp size={10} className="text-amber-400" />
                <span>{game.rating}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-mono font-black text-sm text-white group-hover:text-[#00A2FF] transition flex items-center gap-1.5">
            <span>{game.name}</span>
          </h3>
          <p className="text-xs text-stone-400 font-mono mt-1.5 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-[#393B3D]/80 flex items-center gap-1.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectGame(game.id);
            }}
            className={`flex-1 py-1.5 px-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow ${
              isSelected
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-[#00A2FF] hover:bg-[#0091e6] text-white active:scale-95'
            }`}
          >
            <Play size={12} className="fill-current" />
            <span>{isSelected ? 'Playing' : 'Play'}</span>
          </button>

          {/* Share Button to Community Dashboard */}
          {onShareExperience && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShareExperience(game, e);
              }}
              title="Share Experience to Community Dashboard & Social Media"
              aria-label={`Share ${game.name} experience`}
              className="py-1.5 px-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/40 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-mono font-bold shadow hover:scale-105 active:scale-95"
            >
              <Share2 size={12} className="text-purple-300" />
              <span>Share</span>
            </button>
          )}

          {onLaunchMegaWorld && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onLaunchMegaWorld();
              }}
              title="Launch in 2D Minecraft MegaWorld"
              className="p-1.5 rounded-xl bg-[#191B1D] hover:bg-stone-800 text-stone-300 hover:text-white border border-[#393B3D] transition cursor-pointer"
            >
              <ExternalLink size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RobloxApp({
  onSelectAvatar,
  onLaunchGame,
  currentAvatar,
  onClose,
  onOpenCommunityDashboard,
  initialGameId,
}: RobloxAppProps) {
  // Navigation tabs - Includes new 'favorites' tab!
  const [activeTab, setActiveTab] = useState<'games' | 'favorites' | 'avatar' | 'soundboard' | 'robux'>('games');

  // Active game in Discover (Default to brand new Verity Update experience or initialGameId!)
  const [selectedGame, setSelectedGame] = useState<'verity_rp' | 'obby' | 'disaster' | 'tycoon' | 'bloxfruits' | 'brookhaven'>(initialGameId || 'verity_rp');

  useEffect(() => {
    if (initialGameId) {
      setSelectedGame(initialGameId);
      setDiscoverViewMode('game');
    }
  }, [initialGameId]);

  // Social share preview modal state
  const [sharedPreviewData, setSharedPreviewData] = useState<{
    game: RobloxExperienceInfo;
    post: SocialPost;
  } | null>(null);
  const [copiedToast, setCopiedToast] = useState<string | null>(null);

  // Discover tab view mode: 'game' (interactive mini-game) or 'cards' (browse all experience cards)
  const [discoverViewMode, setDiscoverViewMode] = useState<'game' | 'cards'>('game');

  // Search queries
  const [gameSearchQuery, setGameSearchQuery] = useState<string>('');
  const [favoritesSearchQuery, setFavoritesSearchQuery] = useState<string>('');

  // Favorites state with localStorage persistence
  const STORAGE_FAVORITES = 'roblox_favorite_experiences';
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES);
      return saved ? JSON.parse(saved) : ['verity_rp', 'obby'];
    } catch {
      return ['verity_rp', 'obby'];
    }
  });

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter(x => x !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(next));
      } catch {}
      if (!isFav) {
        playSound('badge', '❤️ Added to Favorites!');
      } else {
        playSound('click', '💔 Removed from Favorites');
      }
      return next;
    });
  };

  const handleShareExperience = async (game: RobloxExperienceInfo, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const shareUrl = `https://roblox.megaworld-rp.internal/experience/${game.id}`;
      const newPost = await socialFeedManager.createPost({
        type: 'roblox_experience_share',
        title: `🎮 ${game.name} - Play Now on Roblox Multiverse!`,
        caption: `Check out "${game.name}" in the MegaWorld Roblox Multiverse! ${game.description} Joined by ${game.playerCount || '50K+'} active adventurers with a ${game.rating || '96%'} community approval rating. #Roblox #${(game.genre || 'Gaming').replace(/\\s+/g, '')} #MegaWorldRP`,
        author: {
          uid: 'user_roblox_' + (activeRobloxChar?.id || 'explorer'),
          name: activeRobloxChar?.name || 'Roblox Explorer',
          avatarType: 'roblox',
          avatarSubtype: (activeRobloxChar?.subtype as any) || 'noob',
          verified: true,
          rankTitle: 'Multiverse Creator',
          classTitle: 'Roblox Pioneer',
        },
        brandTheme: 'Roblox',
        tags: ['Roblox', game.genre || 'Experience', game.category, 'Multiplayer', 'MegaWorldRP'],
        robloxExperienceData: {
          gameId: game.id,
          gameName: game.name,
          emoji: game.emoji || '🎮',
          category: game.category,
          genre: game.genre || 'Adventure',
          description: game.description,
          playerCount: game.playerCount || '50K+',
          rating: game.rating || '96%',
          bannerGradient: game.bannerGradient || 'from-indigo-900 to-slate-900',
          badge: game.badge,
          socialPreviewUrl: shareUrl,
          metaTags: ['Roblox', 'Experience', game.category, 'Multiplayer', 'UGC', 'MegaWorldRP'],
          shareTimestamp: Date.now(),
        },
      });

      window.dispatchEvent(new CustomEvent('megaworld_social_feed_updated'));
      playSound('badge', `✨ Shared ${game.name} to Community Feed!`);
      setSharedPreviewData({ game, post: newPost });
    } catch (err) {
      console.warn('Error sharing Roblox experience:', err);
    }
  };

  const filteredExperiences = ROBLOX_EXPERIENCES.filter(game => {
    const q = gameSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      game.name.toLowerCase().includes(q) ||
      game.category.toLowerCase().includes(q) ||
      game.description.toLowerCase().includes(q) ||
      (game.badge && game.badge.toLowerCase().includes(q))
    );
  });

  const favoriteExperiences = ROBLOX_EXPERIENCES.filter(exp => favorites.includes(exp.id));
  const filteredFavoriteExperiences = favoriteExperiences.filter(game => {
    const q = favoritesSearchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      game.name.toLowerCase().includes(q) ||
      game.category.toLowerCase().includes(q) ||
      game.description.toLowerCase().includes(q) ||
      (game.badge && game.badge.toLowerCase().includes(q))
    );
  });

  const selectedGameInfo = ROBLOX_EXPERIENCES.find(g => g.id === selectedGame) || ROBLOX_EXPERIENCES[0];

  // Robux & Daily Streak Economy State
  const STORAGE_ROBUX = 'megaworld_roblox_robux_balance';
  const STORAGE_STREAK = 'megaworld_roblox_daily_streak';
  const STORAGE_LAST_CLAIM = 'megaworld_roblox_last_claim_date';
  const STORAGE_HIGHEST_STREAK = 'megaworld_roblox_highest_streak';
  const STORAGE_TOTAL_STREAK_ROBUX = 'megaworld_roblox_total_streak_robux';

  const [robuxBalance, setRobuxBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ROBUX);
      return saved ? parseInt(saved, 10) : 2750;
    } catch {
      return 2750;
    }
  });

  const [dailyStreak, setDailyStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_STREAK);
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [highestStreak, setHighestStreak] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HIGHEST_STREAK);
      return saved ? Math.max(1, parseInt(saved, 10)) : 1;
    } catch {
      return 1;
    }
  });

  const [totalStreakRobux, setTotalStreakRobux] = useState<number>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_TOTAL_STREAK_ROBUX);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [lastClaimDate, setLastClaimDate] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_LAST_CLAIM);
    } catch {
      return null;
    }
  });

  const [streakCelebration, setStreakCelebration] = useState<{
    day: number;
    robux: number;
    title: string;
    perk: string;
  } | null>(null);

  const [promoCodeInput, setPromoCodeInput] = useState<string>('');
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);

  // Avatar Customizer State
  const [activeRobloxChar, setActiveRobloxChar] = useState<CharacterData>(() => {
    if (currentAvatar?.type === 'roblox') {
      return currentAvatar;
    }
    return ROBLOX_PRESET_AVATARS[0];
  });
  const [avatarPreviewWalk, setAvatarPreviewWalk] = useState<boolean>(true);
  const [avatarPreviewSprint, setAvatarPreviewSprint] = useState<boolean>(false);

  // Soundboard & Localized Chat Bubble Multiplayer State
  const [activeEmote, setActiveEmote] = useState<string | null>(null);
  const [soundEffectToast, setSoundEffectToast] = useState<string | null>(null);

  // Active chat bubbles keyed by speakerId ('player', 'noob', 'bacon', 'builderman', 'valkyrie', 'korblox', 'guest666')
  const [activeChatBubbles, setActiveChatBubbles] = useState<Record<string, LocalizedChatBubble>>({});
  
  // Character animations on stage ('dance' | 'wave' | 'jump' | 'laugh' | 'salute' | 'oof' | 'flex' | 'tilt')
  const [stagePlayerAnims, setStagePlayerAnims] = useState<Record<string, string>>({});

  // Localized Proximity Distance Radius (in studs/meters)
  const [proximityRadius, setProximityRadius] = useState<number>(18);

  // Auto-respond toggle for NPCs
  const [autoNpcResponses, setAutoNpcResponses] = useState<boolean>(true);

  // Floating Roblox Chat Log
  const [isChatLogOpen, setIsChatLogOpen] = useState<boolean>(true);
  const [chatFilter, setChatFilter] = useState<'all' | 'local' | 'emotes'>('all');
  const [chatInputText, setChatInputText] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<ChatHistoryMessage[]>([
    {
      id: 'init-1',
      sender: 'System',
      channel: 'Server',
      color: '#a855f7',
      text: 'Connected to Crossroads Courtyard [Multiplayer Lobby] • Local Proximity Audio Active',
      time: '12:00:00',
    },
    {
      id: 'init-2',
      sender: 'Classic Noob',
      channel: 'Local',
      color: '#facc15',
      text: 'Hiiii everyone! :D Welcome to the courtyard!',
      time: '12:00:01',
      distance: 4,
    },
    {
      id: 'init-3',
      sender: 'Builderman',
      channel: 'Local',
      color: '#fb923c',
      text: 'Select an emote or sound below to trigger live localized chat bubbles!',
      time: '12:00:02',
      distance: 11,
    },
  ]);

  // Selected player for targeted interaction popup in the courtyard
  const [targetedPlayerId, setTargetedPlayerId] = useState<string | null>(null);

  // Ref for managing timeouts cleanly
  const chatBubbleTimersRef = useRef<Record<string, any>>({});

  useEffect(() => {
    return () => {
      Object.values(chatBubbleTimersRef.current).forEach(t => clearTimeout(t));
    };
  }, []);

  // Persistence Effects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ROBUX, robuxBalance.toString());
    } catch {}
  }, [robuxBalance]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_STREAK, dailyStreak.toString());
      localStorage.setItem(STORAGE_HIGHEST_STREAK, highestStreak.toString());
      localStorage.setItem(STORAGE_TOTAL_STREAK_ROBUX, totalStreakRobux.toString());
      if (lastClaimDate) {
        localStorage.setItem(STORAGE_LAST_CLAIM, lastClaimDate);
      } else {
        localStorage.removeItem(STORAGE_LAST_CLAIM);
      }
    } catch {}
  }, [dailyStreak, highestStreak, totalStreakRobux, lastClaimDate]);

  // Derived Daily Streak Evaluation
  const todayDateStr = getTodayDateStr();
  const yesterdayDateStr = getYesterdayDateStr();
  const isClaimedToday = lastClaimDate === todayDateStr;

  // Next target day to claim:
  // If already claimed today: current streak completed is dailyStreak.
  // If not claimed today:
  // - If lastClaimDate was yesterday: streak is contiguous, target is dailyStreak + 1
  // - If lastClaimDate is null: first claim, target is 1
  // - If lastClaimDate is older than yesterday: streak was broken, target is 1
  const isStreakContiguous = !lastClaimDate || lastClaimDate === yesterdayDateStr;
  const isStreakBroken = Boolean(lastClaimDate && lastClaimDate !== todayDateStr && lastClaimDate !== yesterdayDateStr);

  const targetClaimDay = isClaimedToday 
    ? dailyStreak 
    : (lastClaimDate === yesterdayDateStr ? dailyStreak + 1 : 1);

  const targetReward = getRewardForStreakDay(targetClaimDay);

  // Play sound helper
  const playSound = (soundType: string, label?: string) => {
    audioEngine.playRobloxSound(soundType);
    if (label) {
      setSoundEffectToast(label);
      setTimeout(() => setSoundEffectToast(null), 1200);
    }
  };

  // Core handler for triggering an emote with localized speech bubbles for player and nearby NPCs
  const triggerEmoteChat = (
    cmd: string,
    customText?: string,
    soundOverride?: string
  ) => {
    const now = Date.now();
    const timeStr = new Date().toLocaleTimeString();

    // Sound mapping
    let soundToPlay = soundOverride;
    if (!soundToPlay) {
      if (cmd === '/e dance' || cmd === '/e dance2') soundToPlay = 'badge';
      else if (cmd === '/e wave' || cmd === '/e point' || cmd === '/e tilt') soundToPlay = 'click';
      else if (cmd === '/e cheer') soundToPlay = 'badge';
      else if (cmd === '/e laugh') soundToPlay = 'cheezburger';
      else if (cmd === '/e oof') soundToPlay = 'oof';
      else if (cmd === '/e salute') soundToPlay = 'click';
      else if (cmd === '/e flex') soundToPlay = 'speed';
      else if (cmd === '/e shrug') soundToPlay = 'click';
      else soundToPlay = 'click';
    }

    // Play procedural sound & set active emote indicator
    playSound(soundToPlay, customText || cmd);
    setActiveEmote(cmd);
    setTimeout(() => setActiveEmote(null), 2500);

    // Determine animation key from command
    const animKey = cmd.replace('/e ', '').trim();

    // 1. Spawn Player Chat Bubble
    const playerBubbleText = customText || (
      cmd === '/e dance' ? '/e dance 💃' :
      cmd === '/e dance2' ? '/e dance2 🕺' :
      cmd === '/e wave' ? '/e wave 👋' :
      cmd === '/e point' ? '/e point 👉' :
      cmd === '/e cheer' ? '/e cheer 🎉' :
      cmd === '/e laugh' ? '/e laugh 😂' :
      cmd === '/e salute' ? '/e salute 🫡' :
      cmd === '/e shrug' ? '/e shrug 🤷' :
      cmd === '/e oof' ? '/e oof 💀' :
      cmd === '/e flex' ? '/e flex 💪' :
      cmd === '/e tilt' ? '/e tilt 🌀' : cmd
    );

    const playerBubble: LocalizedChatBubble = {
      id: `player-${now}`,
      speakerId: 'player',
      speakerName: activeRobloxChar?.name || 'You',
      colorHex: '#38bdf8',
      text: playerBubbleText,
      studDistance: 0,
      timestamp: now,
      expiresAt: now + 4500,
      isPlayer: true,
    };

    if (chatBubbleTimersRef.current['player']) {
      clearTimeout(chatBubbleTimersRef.current['player']);
    }

    setActiveChatBubbles(prev => ({ ...prev, player: playerBubble }));
    setStagePlayerAnims(prev => ({ ...prev, player: animKey }));

    // Append to Chat Log
    setChatHistory(prev => [
      ...prev.slice(-35),
      {
        id: `msg-${now}`,
        sender: activeRobloxChar?.name || 'You',
        channel: cmd.startsWith('/e') ? 'Emote' : 'Local',
        color: '#38bdf8',
        text: playerBubbleText,
        time: timeStr,
        distance: 0,
      },
    ]);

    chatBubbleTimersRef.current['player'] = setTimeout(() => {
      setActiveChatBubbles(prev => {
        const next = { ...prev };
        delete next.player;
        return next;
      });
      setStagePlayerAnims(prev => {
        const next = { ...prev };
        delete next.player;
        return next;
      });
    }, 4500);

    // 2. Trigger Localized Responses from Nearby NPCs
    if (autoNpcResponses) {
      // Find players within proximityRadius
      const eligibleNpcs = PLAZA_NPC_PLAYERS.filter(npc => npc.studDistance <= proximityRadius);
      
      // Shuffle & pick 2 to 4 respondents so conversation feels lively and authentic
      const shuffled = [...eligibleNpcs].sort(() => Math.random() - 0.5);
      const respondents = shuffled.slice(0, Math.min(shuffled.length, 3));

      respondents.forEach((npc, index) => {
        // Stagger responses by 320ms - 800ms intervals
        const staggerDelay = 320 + index * 420 + Math.floor(Math.random() * 180);

        const timerId = setTimeout(() => {
          // Look up NPC lines for this command or category
          const responsesForCmd = ROBLOX_EMOTE_RESPONSES[cmd] || ROBLOX_EMOTE_RESPONSES['/e dance'];
          const lines = responsesForCmd[npc.id] || responsesForCmd['noob'] || ['*looks over curiously*'];
          const selectedLine = lines[Math.floor(Math.random() * lines.length)];

          // Speech blip
          audioEngine.playSpeechBlip(
            npc.id === 'noob' ? 1.3 : npc.id === 'valkyrie' ? 1.1 : npc.id === 'korblox' ? 0.6 : 0.9,
            npc.id === 'noob'
          );

          const npcNow = Date.now();
          const npcBubble: LocalizedChatBubble = {
            id: `${npc.id}-${npcNow}`,
            speakerId: npc.id,
            speakerName: npc.name,
            colorHex: npc.colorHex,
            text: selectedLine,
            studDistance: npc.studDistance,
            timestamp: npcNow,
            expiresAt: npcNow + 4200,
          };

          setActiveChatBubbles(prev => ({ ...prev, [npc.id]: npcBubble }));
          setStagePlayerAnims(prev => ({
            ...prev,
            [npc.id]: (animKey === 'dance' || animKey === 'dance2') ? 'dance' : (animKey === 'wave' ? 'wave' : 'jump'),
          }));

          // Add to chat history
          setChatHistory(prev => [
            ...prev.slice(-35),
            {
              id: `msg-${npcNow}-${npc.id}`,
              sender: npc.name,
              channel: 'Local',
              color: npc.colorHex,
              text: selectedLine,
              time: new Date().toLocaleTimeString(),
              distance: npc.studDistance,
            },
          ]);

          // Clear after 4.2s
          if (chatBubbleTimersRef.current[npc.id]) {
            clearTimeout(chatBubbleTimersRef.current[npc.id]);
          }
          chatBubbleTimersRef.current[npc.id] = setTimeout(() => {
            setActiveChatBubbles(prev => {
              const next = { ...prev };
              delete next[npc.id];
              return next;
            });
            setStagePlayerAnims(prev => {
              const next = { ...prev };
              delete next[npc.id];
              return next;
            });
          }, 4200);
        }, staggerDelay);

        chatBubbleTimersRef.current[`stagger-${npc.id}`] = timerId;
      });
    }
  };

  // Trigger sound with companion chat bubbles
  const triggerSoundWithChat = (soundId: string, soundName: string) => {
    const soundCmdMap: Record<string, string> = {
      oof: '/e oof',
      sword: 'sound_sword',
      cola: 'sound_cola',
      cheezburger: 'sound_cheezburger',
      coil: 'sound_coil',
      speed: 'sound_speed',
      rocket: 'sound_rocket',
      badge: 'sound_badge',
    };

    const targetKey = soundCmdMap[soundId] || '/e dance';
    const playerMsg = (
      soundId === 'oof' ? '💀 OOF!' :
      soundId === 'sword' ? '⚔️ *schwing!*' :
      soundId === 'cola' ? '🥤 *slurp fizz!*' :
      soundId === 'cheezburger' ? '🍔 Mmm... Cheezburger!' :
      soundId === 'coil' ? '🌀 *boing wobble!*' :
      soundId === 'speed' ? '⚡ *supersonic hum!*' :
      soundId === 'rocket' ? '🚀 *rocket boom!*' :
      soundId === 'badge' ? '🏆 *badge fanfare!*' : soundName
    );

    triggerEmoteChat(targetKey, playerMsg, soundId);
  };

  // Submit custom text from Chat Input box
  const handleSendCustomChat = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setChatInputText('');

    if (trimmed.startsWith('/e ')) {
      triggerEmoteChat(trimmed);
      return;
    }

    const lower = trimmed.toLowerCase();
    if (lower.includes('dance') || lower.includes('party')) {
      triggerEmoteChat('/e dance', trimmed);
    } else if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey') || lower.includes('yo')) {
      triggerEmoteChat('/e wave', trimmed);
    } else if (lower.includes('oof') || lower.includes('rip') || lower.includes('dead')) {
      triggerEmoteChat('/e oof', trimmed);
    } else if (lower.includes('cheer') || lower.includes('gg') || lower.includes('win')) {
      triggerEmoteChat('/e cheer', trimmed);
    } else if (lower.includes('laugh') || lower.includes('lol') || lower.includes('haha') || lower.includes('lmao')) {
      triggerEmoteChat('/e laugh', trimmed);
    } else if (lower.includes('sword') || lower.includes('pvp') || lower.includes('fight')) {
      triggerEmoteChat('sound_sword', trimmed, 'sword');
    } else if (lower.includes('burger') || lower.includes('cheezburger') || lower.includes('food')) {
      triggerEmoteChat('sound_cheezburger', trimmed, 'cheezburger');
    } else if (lower.includes('cola') || lower.includes('drink')) {
      triggerEmoteChat('sound_cola', trimmed, 'cola');
    } else {
      triggerEmoteChat('/e wave', trimmed, 'click');
    }
  };

  // Claim Daily Streak Reward
  const handleClaimStreakReward = () => {
    if (isClaimedToday) return;

    let nextStreak = 1;
    if (!lastClaimDate) {
      nextStreak = 1;
    } else if (lastClaimDate === yesterdayDateStr) {
      nextStreak = dailyStreak + 1;
    } else {
      // Missed one or more days - resets to 1
      nextStreak = 1;
    }

    const reward = getRewardForStreakDay(nextStreak);
    setDailyStreak(nextStreak);
    setHighestStreak(prev => Math.max(prev, nextStreak));
    setRobuxBalance(prev => prev + reward.robux);
    setTotalStreakRobux(prev => prev + reward.robux);
    setLastClaimDate(todayDateStr);

    playSound('badge', `🔥 Day ${nextStreak} Streak Claimed! +${reward.robux.toLocaleString()} R$`);
    setStreakCelebration({
      day: nextStreak,
      robux: reward.robux,
      title: reward.title,
      perk: reward.perk,
    });
  };

  // Simulation & Debug Helpers (allows instant testing of consecutive days)
  const handleSimulateAdvanceDay = () => {
    // Sets last claim date to yesterday, so today becomes claimable for the NEXT streak day!
    setLastClaimDate(yesterdayDateStr);
    playSound('speed', '⏩ Simulated +24h! Next streak day is now ready to claim!');
  };

  const handleResetStreak = () => {
    setDailyStreak(1);
    setLastClaimDate(null);
    playSound('oof', '🔄 Daily Streak reset to Day 1');
  };

  const handleSetDay6Test = () => {
    setDailyStreak(6);
    setHighestStreak(prev => Math.max(prev, 6));
    setLastClaimDate(yesterdayDateStr);
    playSound('coil', '👑 Set to Day 6 Streak! Day 7 Dominus Crown Jackpot is ready!');
  };

  // Promo Code Redeem
  const handleRedeemCode = () => {
    const code = promoCodeInput.trim().toUpperCase();
    if (!code) return;

    if (claimedCodes.includes(code)) {
      setPromoMessage('Code already redeemed!');
      playSound('oof');
      return;
    }

    const validCodes: Record<string, { robux: number; msg: string }> = {
      'ROBLOX': { robux: 300, msg: '+300 R$ Robloxian Bonus!' },
      'OOF': { robux: 250, msg: '+250 R$ Legendary OOF Code!' },
      'MEGAWORLD': { robux: 1000, msg: '+1,000 R$ MegaWorld RP Exclusive!' },
      'NOOB': { robux: 150, msg: '+150 R$ Classic Noob Token!' },
      'SPIDERCOLA': { robux: 500, msg: '+500 R$ Bloxy Cola Sponsor!' },
    };

    if (validCodes[code]) {
      const reward = validCodes[code];
      setClaimedCodes(prev => [...prev, code]);
      setRobuxBalance(prev => prev + reward.robux);
      setPromoMessage(reward.msg);
      playSound('badge', reward.msg);
      setPromoCodeInput('');
    } else {
      setPromoMessage('Invalid promo code. Try ROBLOX, OOF, or MEGAWORLD!');
      playSound('oof');
    }
  };

  // Equip avatar to main game
  const handleEquipToGame = (char: CharacterData) => {
    setActiveRobloxChar(char);
    onSelectAvatar(char);
    playSound('badge', `${char.name} Equipped!`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#191B1D] text-white rounded-3xl border-2 border-[#393B3D] shadow-2xl overflow-hidden font-sans select-none flex flex-col min-h-[85vh]">
      {/* ================= ROBLOX CLIENT HEADER ================= */}
      <header className="bg-[#232527] border-b border-[#393B3D] px-4 py-3 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {/* Iconic Roblox Tilted Square Logo */}
          <div className="w-9 h-9 bg-[#E2231A] rounded-lg shadow-md border border-white/20 flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-xs transform rotate-12 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-[#E2231A] rounded-2xs" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black tracking-wider uppercase font-mono text-white flex items-center gap-1.5">
                ROBLOX
                <span className="text-[10px] bg-[#E2231A] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-tight">
                  APP
                </span>
              </h1>
            </div>
            <p className="text-[11px] text-stone-400 font-mono">MegaWorld Integrated Platform & Games</p>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1 bg-[#191B1D] p-1 rounded-2xl border border-[#393B3D]">
          <button
            onClick={() => { setActiveTab('games'); playSound('click'); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'games'
                ? 'bg-[#393B3D] text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Gamepad2 size={14} className={activeTab === 'games' ? 'text-red-400' : ''} />
            <span>Discover</span>
          </button>

          <button
            onClick={() => { setActiveTab('favorites'); playSound('click'); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer relative ${
              activeTab === 'favorites'
                ? 'bg-[#393B3D] text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
            title="View your favorited Roblox experiences"
          >
            <Heart 
              size={14} 
              className={
                activeTab === 'favorites' 
                  ? 'text-red-500 fill-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' 
                  : favorites.length > 0 
                    ? 'text-red-400 fill-red-400/30' 
                    : ''
              } 
            />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-red-600 text-white shadow-sm">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            onClick={() => { setActiveTab('avatar'); playSound('click'); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'avatar'
                ? 'bg-[#393B3D] text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <ShoppingBag size={14} className={activeTab === 'avatar' ? 'text-yellow-400' : ''} />
            <span>Avatar Shop</span>
          </button>

          <button
            onClick={() => { setActiveTab('soundboard'); playSound('click'); }}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer ${
              activeTab === 'soundboard'
                ? 'bg-[#393B3D] text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Volume2 size={14} className={activeTab === 'soundboard' ? 'text-cyan-400' : ''} />
            <span>OOF Soundboard</span>
          </button>

          <button
            onClick={() => { setActiveTab('robux'); playSound('click'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition cursor-pointer relative ${
              activeTab === 'robux'
                ? 'bg-[#393B3D] text-white shadow'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Coins size={14} className={activeTab === 'robux' ? 'text-amber-400' : ''} />
            <span>Robux</span>
            <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${
              isClaimedToday ? 'bg-orange-950/80 text-orange-400 border border-orange-500/30' : 'bg-amber-400 text-black animate-pulse shadow-sm'
            }`}>
              <Flame size={9} className={isClaimedToday ? 'fill-orange-400' : 'fill-black'} />
              <span>{dailyStreak}d</span>
            </span>
          </button>
        </nav>

        {/* Right Status & Launch to GameWorld */}
        <div className="flex items-center gap-3">
          {/* Daily Streak & Robux Balance Pill */}
          <div 
            onClick={() => { setActiveTab('robux'); playSound('click'); }}
            className="flex items-center gap-2 bg-[#191B1D] border border-amber-500/40 hover:border-amber-400 px-3 py-1.5 rounded-xl cursor-pointer transition shadow hover:scale-105"
            title="Daily Streak & Robux Balance (Click to view Streak Tracker!)"
          >
            <div className="flex items-center gap-1 text-[11px] font-black text-orange-400">
              <Flame size={13} className="fill-orange-400 animate-pulse" />
              <span>{dailyStreak}d</span>
            </div>
            <div className="h-3 w-[1px] bg-stone-700" />
            <div className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 rounded-full bg-amber-400 flex items-center justify-center text-[8px] font-black text-black">
                R$
              </div>
              <span className="font-mono text-xs font-black text-amber-300">
                {robuxBalance.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Quick Play In MegaWorld Button */}
          <button
            onClick={() => {
              handleEquipToGame(activeRobloxChar);
              onLaunchGame();
            }}
            className="bg-[#00A2FF] hover:bg-[#0091e6] active:scale-95 text-white font-mono font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition shadow-lg cursor-pointer"
            title="Launch active Roblox skin into 2D Minecraft MegaWorld"
          >
            <Play size={13} />
            <span>Play in World</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#191B1D] hover:bg-stone-800 text-stone-400 hover:text-white border border-[#393B3D] cursor-pointer"
              title="Close Roblox App"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </header>

      {/* Floating Toast Notification */}
      {soundEffectToast && (
        <div className="fixed top-20 right-8 z-50 bg-[#E2231A] text-white font-mono text-xs font-black px-4 py-2 rounded-2xl shadow-2xl border-2 border-white/30 animate-bounce flex items-center gap-2">
          <span>🔊</span>
          <span>{soundEffectToast}</span>
        </div>
      )}

      {/* ================= TAB 1: DISCOVER / GAMES ================= */}
      {activeTab === 'games' && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
          {/* Game Selection Banner Bar & Search */}
          <div className="flex flex-col gap-3.5 border-b border-[#393B3D] pb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-black font-mono flex items-center gap-2">
                  <span>Featured Experiences</span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Interactive Mini-Games
                  </span>
                </h2>
                <p className="text-xs text-stone-400 font-mono">
                  Search and play interactive Roblox experiences directly inside MegaWorld!
                </p>
              </div>

              {/* View Switcher & Search Bar */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                {/* View Mode Toggle: Play Game vs Browse Cards */}
                <div className="flex items-center gap-1 bg-[#191B1D] p-1 rounded-xl border border-[#393B3D]">
                  <button
                    type="button"
                    onClick={() => {
                      setDiscoverViewMode('game');
                      playSound('click');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      discoverViewMode === 'game'
                        ? 'bg-[#393B3D] text-white shadow'
                        : 'text-stone-400 hover:text-white'
                    }`}
                    title="Play Selected Mini-Game"
                  >
                    <Play size={11} className="fill-current" />
                    <span>Play</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDiscoverViewMode('cards');
                      playSound('click');
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      discoverViewMode === 'cards'
                        ? 'bg-[#393B3D] text-white shadow'
                        : 'text-stone-400 hover:text-white'
                    }`}
                    title="Browse Experience Cards"
                  >
                    <Sparkles size={11} />
                    <span>Cards ({filteredExperiences.length})</span>
                  </button>
                </div>

                {/* Search Bar */}
                <div className="w-full sm:w-72 relative flex items-center bg-[#191B1D] border border-[#393B3D] rounded-xl px-3 py-2 text-xs focus-within:border-[#00A2FF] focus-within:ring-2 focus-within:ring-[#00A2FF]/20 transition-all shadow-inner">
                  <Search size={15} className="text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={gameSearchQuery}
                    onChange={(e) => setGameSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setGameSearchQuery('');
                      if (e.key === 'Enter' && filteredExperiences.length > 0) {
                        setSelectedGame(filteredExperiences[0].id);
                        playSound('click');
                      }
                    }}
                    placeholder="Search games by name..."
                    className="w-full bg-transparent text-white placeholder-stone-500 font-mono text-xs focus:outline-none"
                    aria-label="Search experiences by name"
                  />
                  {gameSearchQuery && (
                    <button
                      onClick={() => setGameSearchQuery('')}
                      className="text-stone-400 hover:text-white p-0.5 rounded-full hover:bg-stone-800 transition cursor-pointer shrink-0 ml-1"
                      title="Clear search"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Experiences Selector or No Results State */}
            {filteredExperiences.length === 0 ? (
              <div className="bg-[#232527] border border-[#393B3D] rounded-2xl p-4 text-center flex flex-col items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-stone-400">
                  <Search size={16} />
                </div>
                <p className="text-xs font-mono font-bold text-stone-200">
                  No experiences matching &ldquo;{gameSearchQuery}&rdquo;
                </p>
                <p className="text-[11px] text-stone-400 font-mono">
                  Try searching for <button onClick={() => setGameSearchQuery('Verity')} className="text-[#00A2FF] underline cursor-pointer">Verity</button>, <button onClick={() => setGameSearchQuery('Obby')} className="text-[#00A2FF] underline cursor-pointer">Obby</button>, <button onClick={() => setGameSearchQuery('Disaster')} className="text-[#00A2FF] underline cursor-pointer">Disasters</button>, <button onClick={() => setGameSearchQuery('Tycoon')} className="text-[#00A2FF] underline cursor-pointer">Tycoon</button>, <button onClick={() => setGameSearchQuery('Blox')} className="text-[#00A2FF] underline cursor-pointer">Blox Fruits</button>, or <button onClick={() => setGameSearchQuery('Brookhaven')} className="text-[#00A2FF] underline cursor-pointer">Brookhaven</button>
                </p>
                <button
                  onClick={() => setGameSearchQuery('')}
                  className="mt-1 px-3 py-1 bg-[#00A2FF] hover:bg-[#0091e6] text-white font-mono text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              <div className="flex gap-2 flex-wrap items-center">
                {gameSearchQuery && (
                  <span className="text-[11px] font-mono text-stone-400 flex items-center gap-1 mr-1">
                    <span>Found:</span>
                    <span className="text-[#00A2FF] font-bold">{filteredExperiences.length} of {ROBLOX_EXPERIENCES.length}</span>
                  </span>
                )}
                {filteredExperiences.map(game => {
                  const isFav = favorites.includes(game.id);
                  return (
                    <div
                      key={game.id}
                      className={`rounded-xl transition flex items-center p-0.5 border shadow ${
                        selectedGame === game.id
                          ? game.id === 'verity_rp' 
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg border-purple-400 scale-102' 
                            : 'bg-[#00A2FF] text-white shadow-lg border-blue-400 scale-102'
                          : game.id === 'verity_rp'
                            ? 'bg-purple-950/60 text-purple-200 border-purple-500/40 hover:bg-purple-900/60'
                            : 'bg-[#232527] text-stone-300 hover:bg-[#393B3D] border-[#393B3D]'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGame(game.id);
                          setDiscoverViewMode('game');
                          playSound('click');
                        }}
                        title={`${game.category} · ${game.description}`}
                        className="px-2.5 py-1 font-mono text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>{game.name}</span>
                        {game.badge === 'NEW UPDATE' && (
                          <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-black animate-pulse">
                            NEW
                          </span>
                        )}
                        {game.badge && game.badge !== 'NEW UPDATE' && (
                          <span className="text-[9px] bg-white/10 text-stone-300 px-1.5 py-0.2 rounded font-medium">
                            {game.badge}
                          </span>
                        )}
                      </button>

                      {/* Heart Icon Button on each game chip */}
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(game.id, e)}
                        title={isFav ? "Favorited (Click to remove)" : "Add to Favorites"}
                        aria-label={isFav ? `Remove ${game.name} from favorites` : `Add ${game.name} to favorites`}
                        className={`p-1.5 rounded-lg transition cursor-pointer mr-0.5 ${
                          isFav
                            ? 'text-red-400 hover:bg-black/30'
                            : 'text-stone-400 hover:text-red-400 hover:bg-black/20'
                        }`}
                      >
                        <Heart
                          size={13}
                          className={`transition-transform hover:scale-120 ${
                            isFav ? 'fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]' : ''
                          }`}
                        />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* DISCOVER CONTENT: Card Grid View OR Active Game View */}
          {discoverViewMode === 'cards' ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-800 pb-2">
                <span>All Experiences Catalog · Click Heart to Favorite</span>
                <span>{filteredExperiences.length} Experiences Available</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredExperiences.map(game => (
                  <RobloxExperienceCard
                    key={game.id}
                    game={game}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={(id, e) => toggleFavorite(id, e)}
                    onShareExperience={handleShareExperience}
                    onSelectGame={(id) => {
                      setSelectedGame(id);
                      setDiscoverViewMode('game');
                      playSound('click');
                    }}
                    isSelected={selectedGame === game.id}
                    onLaunchMegaWorld={() => {
                      handleEquipToGame(activeRobloxChar);
                      onLaunchGame();
                    }}
                  />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Selected Game Info Strip with prominent Heart Button */}
              <div className="flex items-center justify-between flex-wrap gap-3 bg-[#232527] border border-[#393B3D] px-4 py-3 rounded-2xl shadow">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black/40 flex items-center justify-center text-2xl filter drop-shadow">
                    {selectedGameInfo.emoji || '🎮'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-mono font-black text-sm text-white">
                        {selectedGameInfo.name}
                      </h3>
                      <span className="text-[10px] font-mono text-stone-300 bg-black/40 px-2 py-0.5 rounded-full border border-white/10">
                        {selectedGameInfo.category}
                      </span>
                      {selectedGameInfo.badge && (
                        <span className={`text-[9px] font-black font-mono px-1.5 py-0.2 rounded-full ${
                          selectedGameInfo.badge === 'NEW UPDATE' ? 'bg-amber-400 text-black animate-pulse' : 'bg-white/20 text-white'
                        }`}>
                          {selectedGameInfo.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-400 font-mono mt-0.5 line-clamp-1">
                      {selectedGameInfo.description}
                    </p>
                  </div>
                </div>

                {/* Action Buttons for the Active Game */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => handleShareExperience(selectedGameInfo, e)}
                    title="Share this experience to Community Dashboard & generate a social media preview card"
                    aria-label={`Share ${selectedGameInfo.name} experience`}
                    className="px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 hover:text-white border border-purple-500/40 active:scale-95"
                  >
                    <Share2 size={13} className="text-purple-300" />
                    <span>Share Game</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(selectedGame, e)}
                    title={favorites.includes(selectedGame) ? "Remove from Favorites" : "Add to Favorites"}
                    aria-label={favorites.includes(selectedGame) ? `Remove ${selectedGameInfo.name} from favorites` : `Add ${selectedGameInfo.name} to favorites`}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm ${
                      favorites.includes(selectedGame)
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30'
                        : 'bg-[#191B1D] text-stone-300 hover:text-white border border-[#393B3D] hover:border-stone-500'
                    }`}
                  >
                    <Heart
                      size={14}
                      className={favorites.includes(selectedGame) ? "fill-red-500 text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" : "text-stone-400"}
                    />
                    <span>{favorites.includes(selectedGame) ? 'Favorited' : 'Favorite'}</span>
                  </button>
                </div>
              </div>

              {/* ACTIVE GAME RENDERER */}
              {selectedGame === 'verity_rp' && (
                <RobloxVerityRPMiniGame 
                  onReward={(amount, reason) => {
                    setRobuxBalance(prev => prev + amount);
                    playSound('badge', `+${amount} R$ ${reason}`);
                  }}
                  onSelectAvatar={onSelectAvatar}
                  onLaunchGame={onLaunchGame}
                />
              )}

              {selectedGame === 'obby' && (
                <RobloxObbyMiniGame 
                  playerChar={activeRobloxChar} 
                  onReward={(amount) => {
                    setRobuxBalance(prev => prev + amount);
                    playSound('badge', `+${amount} R$ Obby Clear Bonus!`);
                  }}
                />
              )}

              {selectedGame === 'disaster' && (
                <RobloxDisasterMiniGame 
                  playerChar={activeRobloxChar}
                  onReward={(amount) => {
                    setRobuxBalance(prev => prev + amount);
                    playSound('badge', `+${amount} R$ Disaster Survivor Bonus!`);
                  }}
                />
              )}

              {selectedGame === 'tycoon' && (
                <RobloxTycoonMiniGame 
                  robuxBalance={robuxBalance}
                  onAddRobux={(amount) => {
                    setRobuxBalance(prev => prev + amount);
                    playSound('cheezburger');
                  }}
                  onSpendRobux={(amount) => {
                    setRobuxBalance(prev => Math.max(0, prev - amount));
                    playSound('badge');
                  }}
                />
              )}

              {selectedGame === 'bloxfruits' && (
                <RobloxBloxFruitsMiniGame 
                  playerChar={activeRobloxChar}
                  onReward={(amount) => {
                    setRobuxBalance(prev => prev + amount);
                    playSound('badge', `+${amount} R$ Pirate Bounty!`);
                  }}
                />
              )}

              {selectedGame === 'brookhaven' && (
                <RobloxBrookhavenMiniGame 
                  playerChar={activeRobloxChar}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ================= TAB: FAVORITES ================= */}
      {activeTab === 'favorites' && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6">
          {/* Favorites Header & Search Bar */}
          <div className="flex flex-col gap-3.5 border-b border-[#393B3D] pb-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-black font-mono flex items-center gap-2">
                  <Heart className="fill-red-500 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" size={20} />
                  <span>Favorite Experiences</span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30 font-bold">
                    {favoriteExperiences.length} Pinned
                  </span>
                </h2>
                <p className="text-xs text-stone-400 font-mono">
                  Your personalized collection of favorited Roblox games and roleplay experiences.
                </p>
              </div>

              {/* Actions & Search */}
              <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
                {favoriteExperiences.length > 0 && (
                  <div className="w-full sm:w-64 relative flex items-center bg-[#191B1D] border border-[#393B3D] rounded-xl px-3 py-2 text-xs focus-within:border-red-500/60 focus-within:ring-2 focus-within:ring-red-500/20 transition-all shadow-inner">
                    <Search size={14} className="text-stone-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      value={favoritesSearchQuery}
                      onChange={(e) => setFavoritesSearchQuery(e.target.value)}
                      placeholder="Search favorites..."
                      className="w-full bg-transparent text-white placeholder-stone-500 font-mono text-xs focus:outline-none"
                    />
                    {favoritesSearchQuery && (
                      <button
                        onClick={() => setFavoritesSearchQuery('')}
                        className="text-stone-400 hover:text-white p-0.5 rounded-full hover:bg-stone-800 transition cursor-pointer shrink-0 ml-1"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    setActiveTab('games');
                    playSound('click');
                  }}
                  className="bg-[#232527] hover:bg-[#393B3D] text-stone-300 hover:text-white border border-[#393B3D] px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Gamepad2 size={13} className="text-stone-400" />
                  <span>Discover More</span>
                </button>
              </div>
            </div>
          </div>

          {/* Favorites Content: Empty State vs Cards Grid */}
          {favoriteExperiences.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="w-20 h-20 rounded-3xl bg-red-950/30 border-2 border-red-500/30 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse">
                <Heart size={36} className="text-red-400" />
              </div>
              <h3 className="text-lg font-black font-mono text-white mb-2">No Favorite Experiences Yet</h3>
              <p className="text-xs text-stone-400 font-mono max-w-md mb-6 leading-relaxed">
                You haven&apos;t favorited any experiences yet! Click the heart icon on any game card or chip in the Discover tab to bookmark your favorite worlds.
              </p>
              
              <button
                onClick={() => {
                  setActiveTab('games');
                  playSound('click');
                }}
                className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-mono text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-red-500/25 transition cursor-pointer flex items-center gap-2 active:scale-95"
              >
                <Compass size={14} />
                <span>Explore Featured Experiences</span>
              </button>

              {/* Quick suggestions to favorite */}
              <div className="mt-10 w-full max-w-2xl text-left border-t border-[#393B3D] pt-6">
                <div className="text-xs font-mono font-bold text-stone-400 mb-3 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-amber-400" />
                  <span>Suggested Experiences to Favorite</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ROBLOX_EXPERIENCES.slice(0, 4).map(exp => (
                    <div
                      key={exp.id}
                      className="bg-[#232527] border border-[#393B3D] rounded-xl p-3 flex items-center justify-between gap-3 hover:border-stone-500 transition"
                    >
                      <div className="min-w-0">
                        <div className="font-mono font-bold text-xs text-white truncate flex items-center gap-1.5">
                          <span>{exp.emoji}</span>
                          <span>{exp.name}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono truncate">{exp.category}</div>
                      </div>
                      <button
                        onClick={(e) => toggleFavorite(exp.id, e)}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1 cursor-pointer shrink-0 transition"
                      >
                        <Heart size={12} />
                        <span>Favorite</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : filteredFavoriteExperiences.length === 0 ? (
            <div className="bg-[#232527] border border-[#393B3D] rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-2">
              <Search size={18} className="text-stone-400" />
              <p className="text-xs font-mono font-bold text-stone-200">
                No favorited experiences matching &ldquo;{favoritesSearchQuery}&rdquo;
              </p>
              <button
                onClick={() => setFavoritesSearchQuery('')}
                className="mt-1 px-3 py-1 bg-[#00A2FF] text-white font-mono text-xs font-bold rounded-xl transition cursor-pointer"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFavoriteExperiences.map(game => (
                <RobloxExperienceCard
                  key={game.id}
                  game={game}
                  isFavorite={true}
                  onToggleFavorite={(id, e) => toggleFavorite(id, e)}
                  onShareExperience={handleShareExperience}
                  onSelectGame={(id) => {
                    setSelectedGame(id);
                    setDiscoverViewMode('game');
                    setActiveTab('games');
                    playSound('click');
                  }}
                  isSelected={selectedGame === game.id}
                  onLaunchMegaWorld={() => {
                    handleEquipToGame(activeRobloxChar);
                    onLaunchGame();
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: AVATAR SHOP & R6 STUDIO ================= */}
      {activeTab === 'avatar' && (
        <div className="p-4 sm:p-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live 3D Avatar Preview with Animation Controls */}
          <div className="lg:col-span-5 bg-[#232527] rounded-3xl p-6 border border-[#393B3D] flex flex-col items-center justify-between shadow-xl text-center relative overflow-hidden">
            {/* Studio Stage Background Grid */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />

            <div className="relative z-10 w-full flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-stone-400 uppercase tracking-wider">
                R6 Avatar Studio
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live Animations
              </span>
            </div>

            {/* Avatar Stage */}
            <div className="relative z-10 my-4 h-56 flex flex-col items-center justify-center">
              <div className="filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] scale-125">
                <CharacterAvatar 
                  character={activeRobloxChar} 
                  size="xl" 
                  isWalking={avatarPreviewWalk}
                  isSprinting={avatarPreviewSprint}
                  heldItem={activeRobloxChar.robloxGear === 'sword' ? 'sword' : undefined}
                  showName={true}
                />
              </div>
            </div>

            {/* Animation Toggle Pills */}
            <div className="relative z-10 flex gap-2 mb-4 font-mono text-xs">
              <button
                onClick={() => {
                  setAvatarPreviewWalk(prev => !prev);
                  playSound('click');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  avatarPreviewWalk ? 'bg-emerald-600 text-white shadow' : 'bg-[#191B1D] text-stone-400'
                }`}
              >
                {avatarPreviewWalk ? '🚶 Walk Animation: ON' : '🧍 Stance: Idle'}
              </button>

              <button
                onClick={() => {
                  setAvatarPreviewSprint(prev => !prev);
                  playSound('speed');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer ${
                  avatarPreviewSprint ? 'bg-red-600 text-white shadow' : 'bg-[#191B1D] text-stone-400'
                }`}
              >
                {avatarPreviewSprint ? '⚡ Sprint Speed' : '🚶 Normal Walk'}
              </button>
            </div>

            {/* Equip to Minecraft MegaWorld CTA Button */}
            <div className="relative z-10 w-full space-y-2">
              <button
                onClick={() => {
                  handleEquipToGame(activeRobloxChar);
                  onLaunchGame();
                }}
                className="w-full py-3 bg-[#00A2FF] hover:bg-[#0091e6] active:scale-95 text-white font-mono font-bold text-sm rounded-2xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>Equip & Play in 2D World!</span>
              </button>
              <p className="text-[11px] text-stone-400 font-mono">
                Replaces Steve with {activeRobloxChar.name} inside the 2D Minecraft sandbox!
              </p>
            </div>
          </div>

          {/* Right Column: Avatar Shop Catalog & Customizer */}
          <div className="lg:col-span-7 bg-[#232527] rounded-3xl p-6 border border-[#393B3D] flex flex-col gap-5 shadow-xl">
            <div>
              <h3 className="text-lg font-black font-mono text-white flex items-center gap-2">
                <ShoppingBag size={18} className="text-yellow-400" />
                <span>Legendary Roblox Packages</span>
              </h3>
              <p className="text-xs text-stone-400 font-mono">
                Click any iconic character to inspect, customize, and equip for gameplay:
              </p>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {ROBLOX_PRESET_AVATARS.map(avatar => {
                const isSelected = activeRobloxChar.id === avatar.id;
                return (
                  <div
                    key={avatar.id}
                    onClick={() => {
                      setActiveRobloxChar(avatar);
                      playSound('click');
                    }}
                    className={`p-3 rounded-2xl border-2 transition cursor-pointer flex flex-col items-center justify-between text-center relative ${
                      isSelected
                        ? 'bg-[#191B1D] border-[#00A2FF] shadow-lg scale-102 ring-2 ring-[#00A2FF]/40'
                        : 'bg-[#191B1D]/80 border-[#393B3D] hover:border-stone-500'
                    }`}
                  >
                    <div className="h-28 flex items-center justify-center my-1 filter drop-shadow">
                      <CharacterAvatar character={avatar} size="md" isWalking={true} />
                    </div>
                    <div className="w-full">
                      <h4 className="text-xs font-mono font-bold text-white truncate">{avatar.name}</h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEquipToGame(avatar);
                        }}
                        className={`mt-2 w-full py-1 text-[10px] font-mono font-bold rounded-lg transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#00A2FF] text-white shadow'
                            : 'bg-[#393B3D] text-stone-300 hover:text-white'
                        }`}
                      >
                        {isSelected ? 'Equipped' : 'Select'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Gear & Face Wardrobe Options */}
            <div className="border-t border-[#393B3D] pt-4 mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono">
              {/* Faces */}
              <div>
                <span className="text-[11px] text-stone-400 uppercase font-bold block mb-2">
                  Roblox Faces:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'smile', label: 'Classic Smile' },
                    { id: 'winning', label: 'Winning Smile' },
                    { id: 'chill', label: 'Chill Shades' },
                    { id: 'epic', label: 'Epic Face' },
                    { id: 'beast', label: 'Beast Mode' },
                    { id: 'void', label: 'Void Eyes' },
                  ].map(face => (
                    <button
                      key={face.id}
                      onClick={() => {
                        setActiveRobloxChar(prev => ({ ...prev, robloxFace: face.id as any }));
                        playSound('click');
                      }}
                      className={`px-2.5 py-1 text-xs rounded-xl border transition cursor-pointer ${
                        activeRobloxChar.robloxFace === face.id
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400'
                          : 'bg-[#191B1D] text-stone-400 border-[#393B3D]'
                      }`}
                    >
                      {face.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Handheld Gears */}
              <div>
                <span className="text-[11px] text-stone-400 uppercase font-bold block mb-2">
                  Handheld Gears:
                </span>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { id: 'sword', label: '🗡️ Linked Sword' },
                    { id: 'cola', label: '🥤 Bloxy Cola' },
                    { id: 'coil', label: '🌀 Gravity Coil' },
                    { id: 'speed_coil', label: '⚡ Speed Coil' },
                    { id: 'none', label: 'Bare Hands' },
                  ].map(gear => (
                    <button
                      key={gear.id}
                      onClick={() => {
                        setActiveRobloxChar(prev => ({ ...prev, robloxGear: gear.id as any }));
                        playSound(gear.id === 'sword' ? 'sword' : gear.id === 'cola' ? 'cola' : gear.id === 'coil' ? 'coil' : 'click');
                      }}
                      className={`px-2.5 py-1 text-xs rounded-xl border transition cursor-pointer ${
                        (activeRobloxChar.robloxGear || 'none') === gear.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-[#191B1D] text-stone-400 border-[#393B3D]'
                      }`}
                    >
                      {gear.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: OOF SOUNDBOARD & LOCALIZED CHAT BUBBLES ================= */}
      {activeTab === 'soundboard' && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6 font-mono">
          {/* Header Bar */}
          <div className="border-b border-[#393B3D] pb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                <Volume2 className="text-cyan-400" />
                <span>Authentic Roblox Audio Soundboard & Localized Chat</span>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30">
                  Proximity Bubbles
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                Trigger emotes or sounds to cast authentic 3D speech bubbles for your avatar and nearby players in the Crossroads Courtyard!
              </p>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 text-[11px]">
              <span className="flex items-center gap-1.5 bg-[#232527] px-3 py-1 rounded-full border border-[#393B3D] text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>7 Players in Lobby</span>
              </span>
              <span className="bg-cyan-500/10 text-cyan-300 px-3 py-1 rounded-full border border-cyan-500/30">
                Range: {proximityRadius} studs
              </span>
            </div>
          </div>

          {/* ================= PROXIMITY RADIUS & CHAT CONTROLS TOOLBAR ================= */}
          <div className="bg-[#232527] border border-[#393B3D] rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-stone-300 font-bold flex items-center gap-1.5">
                <Sliders size={14} className="text-cyan-400" />
                <span>Proximity Hearing Range:</span>
              </span>
              {[
                { radius: 8, label: '8 studs (Near)' },
                { radius: 18, label: '18 studs (Courtyard)' },
                { radius: 30, label: '30 studs (Plaza)' },
                { radius: 50, label: '50 studs (Server-Wide)' },
              ].map(item => (
                <button
                  key={item.radius}
                  onClick={() => {
                    setProximityRadius(item.radius);
                    playSound('click');
                  }}
                  className={`px-2.5 py-1 text-xs rounded-xl border transition cursor-pointer font-bold ${
                    proximityRadius === item.radius
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-sm'
                      : 'bg-[#191B1D] text-stone-400 border-[#393B3D] hover:border-stone-500'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Auto NPC Reactions Toggle */}
              <button
                onClick={() => {
                  setAutoNpcResponses(prev => !prev);
                  playSound('click');
                }}
                className={`px-3 py-1 text-xs rounded-xl border transition cursor-pointer font-bold flex items-center gap-1.5 ${
                  autoNpcResponses
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400'
                    : 'bg-[#191B1D] text-stone-400 border-[#393B3D]'
                }`}
              >
                <span>Auto-NPC Chat:</span>
                <span className="uppercase text-[10px] px-1.5 py-0.2 rounded bg-black/40">
                  {autoNpcResponses ? 'ON' : 'OFF'}
                </span>
              </button>

              {/* Toggle Chat Log overlay */}
              <button
                onClick={() => setIsChatLogOpen(prev => !prev)}
                className={`px-3 py-1 text-xs rounded-xl border transition cursor-pointer font-bold flex items-center gap-1.5 ${
                  isChatLogOpen
                    ? 'bg-blue-500/20 text-blue-300 border-blue-400'
                    : 'bg-[#191B1D] text-stone-400 border-[#393B3D]'
                }`}
              >
                <MessageSquare size={13} />
                <span>Chat Log</span>
              </button>

              {/* Clear Chat History */}
              <button
                onClick={() => {
                  setChatHistory([]);
                  playSound('click');
                }}
                title="Clear Chat History"
                className="p-1.5 rounded-xl bg-[#191B1D] hover:bg-stone-800 text-stone-400 hover:text-white border border-[#393B3D] transition cursor-pointer"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* ================= CROSSROADS COURTYARD STAGE (MULTIPLAYER PROXIMITY STAGE) ================= */}
          <div className="relative w-full rounded-3xl border-2 border-[#393B3D] overflow-hidden bg-gradient-to-b from-[#18191c] via-[#202225] to-[#121315] shadow-2xl min-h-[380px] flex flex-col justify-between">
            {/* Stage Stud Grid Floor Aesthetic */}
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage: 'radial-gradient(#ffffff 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Stage Ambient Lighting & Floor Boundary */}
            <div className="absolute bottom-0 inset-x-0 h-44 bg-gradient-to-t from-stone-900/90 via-[#1c1d20]/80 to-transparent border-t border-white/5 pointer-events-none" />

            {/* Distance Markers along bottom */}
            <div className="absolute bottom-2 inset-x-4 flex justify-between text-[10px] text-stone-600 font-mono pointer-events-none border-b border-stone-800/80 pb-1">
              <span>⟵ 32 studs (Shadow)</span>
              <span>15 studs</span>
              <span className="text-cyan-400 font-bold">0 studs (YOU)</span>
              <span>15 studs</span>
              <span>30 studs (Frost) ⟶</span>
            </div>

            {/* ================= FLOATING ROBLOX CHAT LOG OVERLAY (TOP-LEFT) ================= */}
            {isChatLogOpen && (
              <div className="absolute top-3 left-3 z-40 w-72 sm:w-80 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10 p-2.5 shadow-2xl flex flex-col gap-1.5 transition-all">
                <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-200">
                    <MessageCircle size={13} className="text-cyan-400" />
                    <span>Roblox Server Chat</span>
                  </div>
                  {/* Channel Filter Pills */}
                  <div className="flex gap-1 text-[9px]">
                    {(['all', 'local', 'emotes'] as const).map(tab => (
                      <button
                        key={tab}
                        onClick={() => setChatFilter(tab)}
                        className={`px-1.5 py-0.5 rounded cursor-pointer capitalize font-bold ${
                          chatFilter === tab
                            ? 'bg-cyan-500 text-black'
                            : 'bg-white/10 text-stone-300 hover:bg-white/20'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Chat Log Message Scrollbox */}
                <div className="h-32 overflow-y-auto flex flex-col gap-1 text-[11px] pr-1 font-sans">
                  {chatHistory
                    .filter(msg => {
                      if (chatFilter === 'local') return msg.channel === 'Local';
                      if (chatFilter === 'emotes') return msg.channel === 'Emote';
                      return true;
                    })
                    .map(msg => (
                      <div key={msg.id} className="leading-tight break-words">
                        <span className="text-[9px] text-stone-500 font-mono mr-1">
                          [{msg.time.split(' ')[0]}]
                        </span>
                        <span
                          className={`text-[9px] font-black uppercase px-1 py-0.2 rounded mr-1 ${
                            msg.channel === 'Server'
                              ? 'bg-purple-900/60 text-purple-300'
                              : msg.channel === 'Emote'
                              ? 'bg-amber-900/60 text-amber-300'
                              : 'bg-emerald-900/60 text-emerald-300'
                          }`}
                        >
                          {msg.channel}
                        </span>
                        <span
                          className="font-bold mr-1"
                          style={{ color: msg.color || '#ffffff' }}
                        >
                          {msg.sender}:
                        </span>
                        <span className="text-stone-200 font-medium">
                          {msg.text}
                        </span>
                        {typeof msg.distance === 'number' && msg.distance > 0 && (
                          <span className="text-[9px] text-stone-500 font-mono ml-1">
                            ({msg.distance}m)
                          </span>
                        )}
                      </div>
                    ))}
                  {chatHistory.length === 0 && (
                    <div className="text-stone-500 text-[10px] italic py-4 text-center">
                      Chat log is empty. Trigger an emote to chat!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Targeted Player Interaction Modal if selected */}
            {targetedPlayerId && (
              <div className="absolute top-3 right-3 z-40 bg-[#232527] border-2 border-cyan-500/60 rounded-2xl p-3 shadow-2xl flex flex-col gap-2 max-w-[220px] animate-in fade-in slide-in-from-top-2">
                {(() => {
                  const targetNpc = PLAZA_NPC_PLAYERS.find(p => p.id === targetedPlayerId);
                  if (!targetNpc) return null;
                  return (
                    <>
                      <div className="flex items-center justify-between border-b border-[#393B3D] pb-1.5">
                        <span className="text-xs font-black text-white">
                          {targetNpc.name}
                        </span>
                        <button
                          onClick={() => setTargetedPlayerId(null)}
                          className="text-stone-400 hover:text-white p-0.5"
                        >
                          <X size={13} />
                        </button>
                      </div>
                      <div className="text-[10px] text-stone-400 flex items-center justify-between">
                        <span>Distance: {targetNpc.studDistance} studs</span>
                        <span className={`px-1.5 py-0.5 rounded border text-[9px] ${targetNpc.badgeColor}`}>
                          {targetNpc.badge}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 mt-1">
                        <button
                          onClick={() => {
                            triggerEmoteChat('/e wave', `👋 Waves directly at ${targetNpc.name}!`);
                            setTargetedPlayerId(null);
                          }}
                          className="px-2 py-1 bg-[#191B1D] hover:bg-cyan-600 text-stone-200 hover:text-white text-[10px] rounded-lg border border-[#393B3D] transition cursor-pointer font-bold"
                        >
                          👋 Wave
                        </button>
                        <button
                          onClick={() => {
                            triggerEmoteChat('/e dance', `💃 Dance battle with ${targetNpc.name}!`);
                            setTargetedPlayerId(null);
                          }}
                          className="px-2 py-1 bg-[#191B1D] hover:bg-emerald-600 text-stone-200 hover:text-white text-[10px] rounded-lg border border-[#393B3D] transition cursor-pointer font-bold"
                        >
                          💃 Dance
                        </button>
                        <button
                          onClick={() => {
                            triggerEmoteChat('/e cheer', `🎉 High fives ${targetNpc.name}!`);
                            setTargetedPlayerId(null);
                          }}
                          className="px-2 py-1 bg-[#191B1D] hover:bg-amber-600 text-stone-200 hover:text-white text-[10px] rounded-lg border border-[#393B3D] transition cursor-pointer font-bold"
                        >
                          🎉 High Five
                        </button>
                        <button
                          onClick={() => {
                            triggerEmoteChat('/e point', `👉 Challenges ${targetNpc.name} to Obby!`);
                            setTargetedPlayerId(null);
                          }}
                          className="px-2 py-1 bg-[#191B1D] hover:bg-purple-600 text-stone-200 hover:text-white text-[10px] rounded-lg border border-[#393B3D] transition cursor-pointer font-bold"
                        >
                          👉 Challenge
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* ================= STAGE CHARACTERS CONTAINER ================= */}
            <div className="relative w-full h-[360px] flex items-end justify-center pb-8 px-4 sm:px-8">
              {/* NPC Characters */}
              {PLAZA_NPC_PLAYERS.map(npc => {
                const isOutOfRange = npc.studDistance > proximityRadius;
                const bubble = activeChatBubbles[npc.id];
                const anim = stagePlayerAnims[npc.id];

                return (
                  <div
                    key={npc.id}
                    style={{ left: npc.positionX }}
                    onClick={() => setTargetedPlayerId(npc.id)}
                    className={`absolute bottom-8 -translate-x-1/2 flex flex-col items-center cursor-pointer group transition-all duration-300 ${
                      isOutOfRange ? 'opacity-40 grayscale-[40%]' : 'opacity-100'
                    }`}
                  >
                    {/* Authentic Roblox Speech Bubble */}
                    {bubble && (
                      <div className="absolute -top-24 z-30 pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-90 slide-in-from-bottom-2">
                        <div className="relative bg-white text-stone-900 border border-stone-200/90 rounded-2xl px-3.5 py-2 shadow-2xl min-w-[130px] max-w-[210px] text-center filter drop-shadow-xl">
                          {/* Bubble Header */}
                          <div className="flex items-center justify-center gap-1.5 mb-1 pb-1 border-b border-stone-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-stone-700 truncate max-w-[90px]">
                              {bubble.speakerName}
                            </span>
                            <span className="text-[9px] font-mono text-stone-500 bg-stone-100 px-1 py-0.2 rounded border border-stone-200">
                              {bubble.studDistance}m
                            </span>
                          </div>
                          {/* Spoken Text */}
                          <div className="text-xs font-bold font-sans text-stone-950 leading-snug break-words">
                            {bubble.text}
                          </div>
                          {/* Downward Pointer Tail */}
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white -mt-[1px]" />
                        </div>
                      </div>
                    )}

                    {/* Avatar Model with Animation */}
                    <div
                      className={`transition-transform duration-300 ${
                        anim === 'dance'
                          ? 'animate-bounce'
                          : anim === 'wave'
                          ? 'rotate-3 -translate-y-1'
                          : anim === 'jump'
                          ? '-translate-y-3'
                          : anim === 'oof'
                          ? 'rotate-90 translate-y-4 opacity-75'
                          : 'hover:scale-105'
                      }`}
                    >
                      <CharacterAvatar
                        character={npc.avatar}
                        size="md"
                        isWalking={anim === 'dance'}
                        isTalking={Boolean(bubble)}
                        showName={false}
                      />
                    </div>

                    {/* Floor Shadow on Baseplate */}
                    <div className="w-14 h-3 bg-black/60 rounded-full blur-[2px] mt-1" />

                    {/* Name & Stud Distance Tag */}
                    <div className="mt-1 flex flex-col items-center">
                      <span className="text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded-md border border-white/10 group-hover:border-cyan-400 transition whitespace-nowrap shadow">
                        {npc.name}
                      </span>
                      <span className="text-[9px] text-stone-400 font-mono">
                        {npc.studDistance} studs
                      </span>
                    </div>
                  </div>
                );
              })}

              {/* ================= PLAYER'S AVATAR (CENTER: 0 STUDS) ================= */}
              {(() => {
                const playerBubble = activeChatBubbles['player'];
                const playerAnim = stagePlayerAnims['player'];

                return (
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center">
                    {/* Player Speech Bubble */}
                    {playerBubble && (
                      <div className="absolute -top-24 z-30 pointer-events-none transition-all duration-200 animate-in fade-in zoom-in-90 slide-in-from-bottom-2">
                        <div className="relative bg-white text-stone-900 border-2 border-cyan-400 rounded-2xl px-3.5 py-2 shadow-2xl min-w-[140px] max-w-[220px] text-center filter drop-shadow-2xl">
                          <div className="flex items-center justify-center gap-1.5 mb-1 pb-1 border-b border-stone-100">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-700">
                              {playerBubble.speakerName} (YOU)
                            </span>
                            <span className="text-[9px] font-mono text-cyan-600 bg-cyan-50 px-1 py-0.2 rounded border border-cyan-200">
                              Local
                            </span>
                          </div>
                          <div className="text-xs font-bold font-sans text-stone-950 leading-snug break-words">
                            {playerBubble.text}
                          </div>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-white -mt-[1px]" />
                        </div>
                      </div>
                    )}

                    {/* Golden Beacon Ground Ring for Player */}
                    <div className="absolute -bottom-1 w-20 h-6 rounded-full border-2 border-yellow-400/80 bg-yellow-500/10 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse" />

                    {/* Player Model */}
                    <div
                      className={`transition-transform duration-300 ${
                        playerAnim === 'dance' || playerAnim === 'dance2'
                          ? 'animate-bounce'
                          : playerAnim === 'wave'
                          ? '-translate-y-2 rotate-2'
                          : playerAnim === 'jump'
                          ? '-translate-y-4'
                          : playerAnim === 'oof'
                          ? 'rotate-90 translate-y-4 opacity-75'
                          : ''
                      }`}
                    >
                      <CharacterAvatar
                        character={activeRobloxChar || ROBLOX_PRESET_AVATARS[0]}
                        size="lg"
                        isWalking={avatarPreviewWalk || playerAnim === 'dance'}
                        isSprinting={avatarPreviewSprint}
                        isTalking={Boolean(playerBubble)}
                        showName={false}
                      />
                    </div>

                    {/* Floor Shadow */}
                    <div className="w-16 h-3.5 bg-black/70 rounded-full blur-[2px] mt-1" />

                    {/* Player Tag */}
                    <div className="mt-1 flex flex-col items-center">
                      <span className="text-[11px] font-black text-yellow-300 bg-black/80 px-2.5 py-0.5 rounded-md border-2 border-yellow-400/80 shadow">
                        ★ {activeRobloxChar?.name || 'You'} (YOU) ★
                      </span>
                      <span className="text-[9px] text-cyan-400 font-mono font-bold">
                        Center Stage (0m)
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* ================= CHAT INPUT & QUICK COMMANDS BAR ================= */}
          <div className="bg-[#232527] rounded-3xl p-4 sm:p-5 border border-[#393B3D] shadow-lg flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Smile size={16} className="text-yellow-400" />
                <span>Roblox Emotes Bar & Localized Chat Input</span>
              </h3>
              <span className="text-[11px] text-stone-400">
                Click any emote below to trigger multi-avatar localized speech bubbles!
              </span>
            </div>

            {/* Custom Chat Input Box */}
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendCustomChat(chatInputText);
              }}
              className="flex items-center gap-2 bg-[#191B1D] rounded-2xl p-1.5 border border-[#393B3D] focus-within:border-cyan-400 transition"
            >
              <div className="pl-3 text-cyan-400">
                <MessageSquare size={16} />
              </div>
              <input
                type="text"
                value={chatInputText}
                onChange={e => setChatInputText(e.target.value)}
                placeholder="Type /e dance, /e wave or say something in local proximity chat..."
                className="flex-1 bg-transparent border-none text-white text-xs font-mono px-2 py-1.5 focus:outline-none placeholder:text-stone-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Send size={13} />
                <span>Send</span>
              </button>
            </form>

            {/* Quick Dialogue Pills */}
            <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
              <span className="text-stone-400 text-[10px] font-bold uppercase mr-1">
                Quick Phrases:
              </span>
              {[
                'Hello everyone! 👋',
                'Anyone want to play Tower Obby? 🏃',
                'CAN I HAZ CHEEZBURGER PLZ 🍔',
                'Nice avatar! ✨',
                'GG WP squad! 🏆',
              ].map(phrase => (
                <button
                  key={phrase}
                  type="button"
                  onClick={() => handleSendCustomChat(phrase)}
                  className="px-2.5 py-1 rounded-lg bg-[#191B1D] hover:bg-stone-800 text-stone-300 hover:text-white border border-[#393B3D] transition text-[10px] cursor-pointer"
                >
                  {phrase}
                </button>
              ))}
            </div>

            {/* 11 Classic Roblox Emotes Palette */}
            <div className="pt-2 border-t border-[#393B3D]">
              <div className="text-[11px] text-stone-400 uppercase font-bold mb-2">
                Classic Roblox Emote Commands:
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { cmd: '/e dance', name: '💃 /e dance', sound: 'badge' },
                  { cmd: '/e dance2', name: '🕺 /e dance2', sound: 'badge' },
                  { cmd: '/e wave', name: '👋 /e wave', sound: 'click' },
                  { cmd: '/e point', name: '👉 /e point', sound: 'click' },
                  { cmd: '/e cheer', name: '🎉 /e cheer', sound: 'badge' },
                  { cmd: '/e laugh', name: '😂 /e laugh', sound: 'cheezburger' },
                  { cmd: '/e salute', name: '🫡 /e salute', sound: 'click' },
                  { cmd: '/e shrug', name: '🤷 /e shrug', sound: 'click' },
                  { cmd: '/e oof', name: '💀 /e oof', sound: 'oof' },
                  { cmd: '/e flex', name: '💪 /e flex', sound: 'speed' },
                  { cmd: '/e tilt', name: '🌀 /e tilt', sound: 'click' },
                ].map(emote => (
                  <button
                    key={emote.cmd}
                    onClick={() => triggerEmoteChat(emote.cmd, undefined, emote.sound)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer shadow flex items-center gap-1.5 ${
                      activeEmote === emote.cmd
                        ? 'bg-emerald-600 text-white border-emerald-400 animate-pulse'
                        : 'bg-[#191B1D] text-stone-300 border-[#393B3D] hover:border-emerald-500 hover:text-white'
                    }`}
                  >
                    <span>{emote.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= PROCEDURAL AUDIO SOUNDBOARD GRID ================= */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Volume2 size={16} className="text-cyan-400" />
                <span>Procedural Soundboard Grid (with Companion Chat Bubbles)</span>
              </h3>
              <span className="text-[11px] text-stone-400">
                Clicking any sound plays procedural Web Audio and triggers localized NPC chat!
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {[
                { id: 'oof', name: '💀 OOF! (Classic Grunt)', desc: 'The legendary death sound', color: 'hover:border-red-500' },
                { id: 'sword', name: '⚔️ Linked Sword', desc: 'Classic metal schwing slash', color: 'hover:border-cyan-500' },
                { id: 'cola', name: '🥤 Bloxy Cola', desc: 'Slurp & fizzy can crack', color: 'hover:border-amber-500' },
                { id: 'cheezburger', name: '🍔 Cheezburger!', desc: 'Mmm... Cheezburger crunch', color: 'hover:border-yellow-500' },
                { id: 'coil', name: '🌀 Gravity Coil', desc: 'High springy bouncy wobble', color: 'hover:border-blue-500' },
                { id: 'speed', name: '⚡ Speed Coil', desc: 'High frequency revving hum', color: 'hover:border-purple-500' },
                { id: 'rocket', name: '🚀 Rocket Launcher', desc: 'Sub-bass explosive boom', color: 'hover:border-orange-500' },
                { id: 'badge', name: '🏆 Badge Awarded', desc: 'Four-note victory arpeggio', color: 'hover:border-emerald-500' },
              ].map(sound => (
                <button
                  key={sound.id}
                  onClick={() => triggerSoundWithChat(sound.id, sound.name)}
                  className={`p-4 rounded-2xl bg-[#232527] border-2 border-[#393B3D] ${sound.color} shadow-lg transition active:scale-95 text-left flex flex-col justify-between cursor-pointer group`}
                >
                  <div className="text-sm font-bold text-white group-hover:text-yellow-300 transition">
                    {sound.name}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-2 leading-tight">
                    {sound.desc}
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-cyan-400 font-bold uppercase">
                    <span>▶ Play + Chat</span>
                    <span>🔊</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ROBUX WALLET & DAILY REWARDS ================= */}
      {activeTab === 'robux' && (
        <div className="p-4 sm:p-6 flex-1 flex flex-col gap-6 font-mono">
          {/* ================= HEADER BALANCE & STREAK SUMMARY BANNER ================= */}
          <div className="bg-gradient-to-r from-amber-950/70 via-[#232527] to-orange-950/70 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black font-black text-2xl flex items-center justify-center shadow-lg border-2 border-amber-300">
                R$
              </div>
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider block">
                  Robux Wallet Balance
                </span>
                <span className="text-3xl sm:text-4xl font-black text-white">
                  {robuxBalance.toLocaleString()} <span className="text-amber-400 text-lg">R$</span>
                </span>
              </div>
            </div>

            {/* Quick Status Pill */}
            <div className="flex items-center gap-2 bg-[#191B1D]/80 border border-orange-500/40 px-4 py-2.5 rounded-2xl shadow-inner">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center">
                <Flame size={20} className="text-orange-400 fill-orange-400 animate-pulse" />
              </div>
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <span>{dailyStreak} Day Streak</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    isClaimedToday 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' 
                      : 'bg-amber-500 text-black animate-pulse'
                  }`}>
                    {isClaimedToday ? '✓ Claimed' : '🔥 Ready'}
                  </span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Best Record: <strong className="text-amber-300">{highestStreak} Days</strong>
                </div>
              </div>
            </div>
          </div>

          {/* ================= VISUAL TRACKER FOR CURRENT STREAK COUNT ================= */}
          <div className="bg-[#232527] rounded-3xl p-5 sm:p-6 border-2 border-orange-500/40 shadow-2xl relative overflow-hidden">
            {/* Background ambient fire glow */}
            <div 
              className="absolute -top-24 -right-24 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
              style={{
                background: 'radial-gradient(circle, rgba(249,115,22,0.8) 0%, rgba(239,68,68,0.4) 60%, transparent 100%)'
              }}
            />

            {/* Top Row: Hero Streak Flame & Count Display */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#393B3D]">
              {/* Flame Visualizer & Big Counter */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Multi-tier animated fire container */}
                <div className="relative group">
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center border-2 shadow-2xl transition-all duration-300 ${
                    dailyStreak >= 7 
                      ? 'bg-gradient-to-br from-yellow-500/30 via-orange-600/40 to-amber-950/80 border-yellow-400 shadow-[0_0_35px_rgba(250,204,21,0.5)] ring-4 ring-yellow-400/30'
                      : dailyStreak >= 4
                      ? 'bg-gradient-to-br from-orange-500/30 via-red-600/30 to-stone-900 border-orange-400 shadow-[0_0_25px_rgba(249,115,22,0.4)] ring-2 ring-orange-400/30'
                      : 'bg-gradient-to-br from-amber-500/20 via-orange-950/40 to-stone-900 border-amber-500/50 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                  }`}>
                    <Flame 
                      size={dailyStreak >= 7 ? 48 : 42} 
                      className={`transition-transform duration-300 ${
                        dailyStreak >= 7 
                          ? 'text-yellow-300 fill-amber-400 animate-pulse scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]'
                          : dailyStreak >= 4 
                          ? 'text-orange-400 fill-orange-500 animate-bounce'
                          : 'text-amber-400 fill-amber-400 animate-pulse'
                      }`} 
                    />
                    {dailyStreak >= 7 && (
                      <Crown size={20} className="absolute -top-2.5 -right-2.5 text-yellow-300 fill-yellow-400 animate-spin" style={{ animationDuration: '8s' }} />
                    )}
                  </div>
                  {/* Tier Label Tag */}
                  <span className="absolute -bottom-2 inset-x-0 mx-auto w-max px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-stone-900 border border-orange-400/60 text-amber-300 shadow">
                    Tier {Math.min(7, dailyStreak)}
                  </span>
                </div>

                {/* Big Streak Numbers */}
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-6xl font-black font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-red-500 drop-shadow-[0_4px_16px_rgba(249,115,22,0.4)]">
                      {dailyStreak}
                    </span>
                    <span className="text-xl sm:text-2xl font-black text-amber-400 uppercase tracking-wide">
                      {dailyStreak === 1 ? 'Day' : 'Days'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-stone-300 flex items-center gap-1.5 mt-0.5">
                    <span className="text-orange-400 font-black uppercase tracking-wider">
                      Consecutive Daily Login Streak
                    </span>
                  </div>
                  <div className="text-[11px] text-amber-400/90 font-bold mt-1">
                    {dailyStreak >= 7 ? '👑 Mythic Dominus Legend (Maximum Multiplier Active)' :
                     dailyStreak >= 5 ? '🌟 Golden Inferno Tier (+2,200 R$ & Higher)' :
                     dailyStreak >= 3 ? '⚡ Blazing Dedication (+1,000 R$ Surge)' :
                     '🔥 Flame Spark Initiated (+300 R$ Start)'}
                  </div>
                </div>
              </div>

              {/* Action / Claim Button Strip */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3">
                {!isClaimedToday ? (
                  <button
                    onClick={handleClaimStreakReward}
                    className="px-6 sm:px-8 py-3.5 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 hover:from-amber-300 hover:to-red-400 text-black shadow-[0_0_30px_rgba(249,115,22,0.5)] active:scale-95 transition cursor-pointer flex items-center justify-center gap-3 animate-pulse border border-yellow-300"
                    title={`Claim Day ${targetClaimDay} streak bonus reward`}
                  >
                    <Gift size={20} className="animate-bounce" />
                    <span>CLAIM DAY {targetClaimDay} REWARD (+{targetReward.robux.toLocaleString()} R$) 🔥</span>
                  </button>
                ) : (
                  <div className="px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm bg-[#191B1D] border-2 border-emerald-500/50 text-emerald-300 flex items-center justify-center gap-2.5 shadow-inner">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span>✓ Day {dailyStreak} Claimed Today · Next Tomorrow!</span>
                  </div>
                )}

                <div className="text-[11px] text-stone-400 text-center sm:text-right">
                  {isClaimedToday ? (
                    <span>Next Reward: <strong className="text-amber-400">+{getRewardForStreakDay(dailyStreak + 1).robux.toLocaleString()} R$</strong> on Day {dailyStreak + 1}</span>
                  ) : isStreakBroken ? (
                    <span className="text-amber-400">⚠️ Missed day reset streak. Claim now for Day 1!</span>
                  ) : (
                    <span>Consecutive login ready · Tap to claim!</span>
                  )}
                </div>
              </div>
            </div>

            {/* Streak Metrics Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4 border-b border-[#393B3D]">
              <div className="bg-[#191B1D] rounded-2xl p-3 border border-[#393B3D] flex flex-col">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Flame size={12} className="text-orange-400" />
                  <span>Current Streak</span>
                </span>
                <span className="text-xl font-black text-white mt-1">
                  {dailyStreak} <span className="text-xs text-orange-400">Days</span>
                </span>
                <span className="text-[9px] text-stone-500 mt-0.5">
                  {isClaimedToday ? 'Logged in today' : 'Claim pending today'}
                </span>
              </div>

              <div className="bg-[#191B1D] rounded-2xl p-3 border border-[#393B3D] flex flex-col">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Trophy size={12} className="text-amber-400" />
                  <span>Personal Best</span>
                </span>
                <span className="text-xl font-black text-amber-300 mt-1">
                  {highestStreak} <span className="text-xs text-stone-400">Days</span>
                </span>
                <span className="text-[9px] text-stone-500 mt-0.5">All-time record</span>
              </div>

              <div className="bg-[#191B1D] rounded-2xl p-3 border border-[#393B3D] flex flex-col">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <Coins size={12} className="text-amber-400" />
                  <span>Streak Robux</span>
                </span>
                <span className="text-xl font-black text-emerald-400 mt-1">
                  +{totalStreakRobux.toLocaleString()} <span className="text-xs text-emerald-500">R$</span>
                </span>
                <span className="text-[9px] text-stone-500 mt-0.5">Total bonus earned</span>
              </div>

              <div className="bg-[#191B1D] rounded-2xl p-3 border border-[#393B3D] flex flex-col">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={12} className="text-cyan-400" />
                  <span>Next Reward</span>
                </span>
                <span className="text-xl font-black text-cyan-300 mt-1">
                  +{targetReward.robux.toLocaleString()} <span className="text-xs text-cyan-400">R$</span>
                </span>
                <span className="text-[9px] text-stone-500 mt-0.5">Day {targetClaimDay} Bonus</span>
              </div>
            </div>

            {/* ================= 7-DAY VISUAL ROADMAP STEPPER ================= */}
            <div className="pt-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Calendar size={14} className="text-amber-400" />
                  <span>7-Day Login Streak Roadmap</span>
                  <span className="text-[10px] text-stone-400 font-normal">
                    (Consecutive daily rewards increase each day!)
                  </span>
                </h3>
                <span className="text-[11px] text-amber-400 font-bold flex items-center gap-1">
                  <Crown size={12} className="text-yellow-400" />
                  <span>Day 7 Grand Jackpot: 5,000 R$</span>
                </span>
              </div>

              {/* Visual Roadmap Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
                {DAILY_STREAK_REWARDS.map((reward) => {
                  const dayNum = reward.day;
                  // Has this day already been claimed in the current cycle?
                  // If claimed today, all days <= dailyStreak are claimed
                  // If not claimed today, all days < targetClaimDay are claimed
                  const isCompleted = isClaimedToday ? dayNum <= dailyStreak : dayNum < targetClaimDay;
                  const isCurrentTarget = dayNum === targetClaimDay && !isClaimedToday;
                  const isTodayCompleted = dayNum === dailyStreak && isClaimedToday;
                  const isLocked = !isCompleted && !isCurrentTarget && !isTodayCompleted;

                  return (
                    <div
                      key={dayNum}
                      onClick={() => {
                        if (isCurrentTarget) {
                          handleClaimStreakReward();
                        }
                      }}
                      className={`rounded-2xl p-3 flex flex-col justify-between transition-all duration-300 relative select-none ${
                        reward.isJackpot
                          ? isCompleted || isTodayCompleted
                            ? 'bg-gradient-to-b from-yellow-900/40 via-amber-950/40 to-[#191B1D] border-2 border-yellow-500 shadow-lg'
                            : isCurrentTarget
                            ? 'bg-gradient-to-b from-yellow-500/25 via-amber-600/20 to-stone-900 border-2 border-yellow-400 ring-4 ring-yellow-400/40 shadow-[0_0_25px_rgba(250,204,21,0.5)] animate-pulse cursor-pointer scale-105'
                            : 'bg-gradient-to-b from-yellow-950/20 to-[#191B1D] border border-yellow-500/40'
                          : isCompleted || isTodayCompleted
                          ? 'bg-[#191B1D] border border-emerald-500/50 shadow-sm'
                          : isCurrentTarget
                          ? 'bg-gradient-to-b from-amber-500/20 to-stone-900 border-2 border-amber-400 ring-4 ring-amber-400/40 shadow-[0_0_20px_rgba(251,191,36,0.4)] animate-pulse cursor-pointer scale-102'
                          : 'bg-[#191B1D]/80 border border-[#393B3D] opacity-75'
                      }`}
                    >
                      {/* Top Day Header */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider ${
                          reward.isJackpot ? 'text-yellow-300' : isCurrentTarget ? 'text-amber-300' : 'text-stone-400'
                        }`}>
                          Day {dayNum} {reward.isJackpot ? '👑' : ''}
                        </span>

                        {isCompleted || isTodayCompleted ? (
                          <span className="w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-bold shadow">
                            ✓
                          </span>
                        ) : isCurrentTarget ? (
                          <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[9px] font-black animate-pulse">
                            NOW
                          </span>
                        ) : (
                          <Lock size={11} className="text-stone-500" />
                        )}
                      </div>

                      {/* Center Icon & Badge */}
                      <div className="my-1.5 flex flex-col items-center justify-center">
                        <span className="text-2xl sm:text-3xl mb-1 filter drop-shadow">
                          {reward.badgeIcon}
                        </span>
                        <span className={`text-base font-black font-mono tracking-tight ${
                          reward.isJackpot ? 'text-yellow-300' : isCompleted || isTodayCompleted ? 'text-emerald-300' : 'text-amber-400'
                        }`}>
                          +{reward.robux.toLocaleString()} <span className="text-[10px]">R$</span>
                        </span>
                      </div>

                      {/* Bottom Title & Status */}
                      <div className="mt-2 pt-1.5 border-t border-stone-800/80 text-center">
                        <div className="text-[10px] font-bold text-stone-300 truncate">
                          {reward.title}
                        </div>
                        <div className={`text-[9px] mt-0.5 truncate font-mono ${
                          isCompleted || isTodayCompleted
                            ? 'text-emerald-400 font-bold'
                            : isCurrentTarget
                            ? 'text-amber-300 font-black animate-pulse'
                            : 'text-stone-500'
                        }`}>
                          {isCompleted || isTodayCompleted ? 'Claimed' : isCurrentTarget ? 'Tap to Claim!' : reward.isJackpot ? 'Grand Prize' : 'Locked'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Toward Day 7 Dominus Jackpot */}
              <div className="mt-4 bg-[#191B1D] p-3 rounded-2xl border border-[#393B3D]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-300 font-bold flex items-center gap-1.5">
                    <Star size={13} className="text-yellow-400 fill-yellow-400" />
                    <span>7-Day Dominus Jackpot Cycle Progress</span>
                  </span>
                  <span className="text-amber-400 font-black font-mono">
                    {Math.min(7, isClaimedToday ? dailyStreak : dailyStreak - 1)} / 7 Days Complete
                  </span>
                </div>
                <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(250,204,21,0.5)]"
                    style={{
                      width: `${Math.min(100, Math.round(((isClaimedToday ? dailyStreak : Math.max(0, dailyStreak - 1)) % 7 || (dailyStreak >= 7 ? 7 : 0)) / 7 * 100))}%`
                    }}
                  />
                </div>
              </div>
            </div>

            {/* ================= STREAK TESTING & SIMULATION CONTROLS ================= */}
            <div className="mt-5 pt-4 border-t border-[#393B3D]/80 flex flex-wrap items-center justify-between gap-3 text-xs bg-[#191B1D]/60 p-3 rounded-2xl">
              <div className="flex items-center gap-2 text-stone-400">
                <FastForward size={14} className="text-amber-400" />
                <span className="font-bold text-stone-300">Streak Testing Sandbox:</span>
                <span className="text-[10px] hidden sm:inline text-stone-500">
                  (Simulate next days without waiting 24h)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSimulateAdvanceDay}
                  className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow"
                  title="Fast-forward 24 hours to make the next streak day claimable immediately"
                >
                  <FastForward size={12} />
                  <span>Advance +24h</span>
                </button>

                <button
                  type="button"
                  onClick={handleSetDay6Test}
                  className="px-3 py-1.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 rounded-xl font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow"
                  title="Fast-track directly to Day 6 to test Day 7 Dominus Grand Jackpot"
                >
                  <Crown size={12} />
                  <span>Test Day 7 Jackpot</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetStreak}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white border border-stone-700 rounded-xl font-bold text-[11px] transition cursor-pointer flex items-center gap-1.5 active:scale-95"
                  title="Reset daily streak back to Day 1"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          {/* ================= CELEBRATION MODAL OVERLAY ================= */}
          {streakCelebration && (
            <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
              <div className="bg-[#232527] border-2 border-amber-400 rounded-3xl p-6 max-w-md w-full shadow-[0_0_50px_rgba(251,191,36,0.5)] text-center relative flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 flex items-center justify-center text-4xl mb-4 shadow-xl border-2 border-yellow-300 animate-bounce">
                  🔥
                </div>

                <h3 className="text-2xl font-black text-white font-mono uppercase tracking-wide flex items-center gap-2 justify-center">
                  <span>Day {streakCelebration.day} Streak!</span>
                  {streakCelebration.day >= 7 && <Crown size={22} className="text-yellow-400 fill-yellow-400" />}
                </h3>

                <div className="my-3 px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50">
                  <div className="text-3xl font-black text-amber-300 font-mono">
                    +{streakCelebration.robux.toLocaleString()} <span className="text-lg">R$</span>
                  </div>
                  <div className="text-xs text-stone-300 font-bold mt-0.5">
                    Deposited into your Robux Wallet
                  </div>
                </div>

                <div className="bg-[#191B1D] p-3 rounded-2xl border border-[#393B3D] w-full text-left mb-5">
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-yellow-400" />
                    <span>Unlocked Perk: {streakCelebration.title}</span>
                  </div>
                  <div className="text-[11px] text-stone-300 mt-1">
                    {streakCelebration.perk}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setStreakCelebration(null)}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-black font-mono text-sm rounded-xl shadow-lg transition active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Awesome! Collect Robux
                </button>
              </div>
            </div>
          )}

          {/* Promo Codes & Gamepasses Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promo Code Box */}
            <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
                  <Tag size={16} className="text-amber-400" />
                  <span>Redeem Roblox Promo Codes</span>
                </h3>
                <p className="text-xs text-stone-400 mb-4">
                  Enter secret promotional codes to unlock free Robux! Try codes: <code>ROBLOX</code>, <code>OOF</code>, <code>MEGAWORLD</code>.
                </p>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCodeInput}
                    onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === 'Enter' && handleRedeemCode()}
                    placeholder="Enter Code (e.g. MEGAWORLD)"
                    className="flex-1 bg-[#191B1D] border border-[#393B3D] rounded-xl px-3 py-2 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    onClick={handleRedeemCode}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95"
                  >
                    Redeem
                  </button>
                </div>

                {promoMessage && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#191B1D] border border-amber-500/30 text-xs text-amber-300">
                    {promoMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Popular Gamepasses */}
            <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] shadow-xl">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                <Coins size={16} className="text-amber-400" />
                <span>Featured Game Passes</span>
              </h3>

              <div className="space-y-2">
                {[
                  { name: 'VIP Golden Radio Boombox', cost: 450, desc: 'Play custom chiptunes everywhere!' },
                  { name: 'Hyper Speed Coil (200% Walk)', cost: 350, desc: 'Ultra sprint speed in MegaWorld' },
                  { name: 'Nuclear OOF Death Sound', cost: 200, desc: 'Shakes the screen upon taking damage' },
                ].map((pass, i) => (
                  <div 
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#191B1D] border border-[#393B3D]"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{pass.name}</div>
                      <div className="text-[10px] text-stone-400">{pass.desc}</div>
                    </div>
                    <button
                      onClick={() => {
                        if (robuxBalance >= pass.cost) {
                          setRobuxBalance(prev => prev - pass.cost);
                          playSound('badge', `Purchased ${pass.name}!`);
                        } else {
                          playSound('oof', 'Not enough Robux!');
                        }
                      }}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow cursor-pointer"
                    >
                      {pass.cost} R$
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= SOCIAL MEDIA-READY PREVIEW MODAL ================= */}
      {sharedPreviewData && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSharedPreviewData(null)}
        >
          <div 
            className="bg-[#1e2022] border-2 border-purple-500/50 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative font-mono text-white animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Toast Feedback within Modal */}
            {copiedToast && (
              <div className="absolute top-4 right-14 bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg border border-emerald-300 animate-bounce flex items-center gap-1.5 z-20">
                <span>✓</span>
                <span>{copiedToast}</span>
              </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-700">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-xl shadow-md">
                  <Share2 size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                    Social Media-Ready Card Generated!
                  </h3>
                  <p className="text-xs text-purple-300">
                    Published to Community Dashboard & ready for social sharing
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSharedPreviewData(null)}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Social Card Visual Mockup (16:9 Aspect Ratio) */}
            <div className="my-5 rounded-2xl overflow-hidden border-2 border-stone-700 shadow-2xl bg-[#141517] relative group">
              {/* Banner with gradient & dot grid */}
              <div className={`w-full min-h-[175px] bg-gradient-to-r ${sharedPreviewData.game.bannerGradient || 'from-indigo-900 to-slate-900'} p-4 relative flex flex-col justify-between overflow-hidden`}>
                <div 
                  className="absolute inset-0 opacity-20 pointer-events-none"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '16px 16px'
                  }}
                />

                {/* Top strip */}
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {sharedPreviewData.game.badge && (
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-amber-400 text-black shadow font-mono">
                        {sharedPreviewData.game.badge}
                      </span>
                    )}
                    <span className="text-[10px] font-mono text-stone-200 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/10">
                      {sharedPreviewData.game.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-black/70 px-2.5 py-0.5 rounded-full border border-white/15 text-[10px] text-cyan-300 font-mono">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span>ROBLOX MULTIVERSE</span>
                  </div>
                </div>

                {/* Center Info */}
                <div className="relative z-10 flex items-center gap-3.5 my-auto">
                  <div className="w-16 h-16 rounded-2xl bg-black/60 border-2 border-white/30 flex items-center justify-center text-4xl shadow-2xl filter drop-shadow">
                    {sharedPreviewData.game.emoji}
                  </div>
                  <div>
                    <h4 className="text-xl font-black text-white drop-shadow font-mono">
                      {sharedPreviewData.game.name}
                    </h4>
                    <div className="text-xs text-stone-200 font-mono flex items-center gap-2.5 mt-1 flex-wrap">
                      <span className="text-emerald-300 font-bold">👥 {sharedPreviewData.game.playerCount} Playing Now</span>
                      <span>•</span>
                      <span className="text-amber-300 font-bold">⭐ {sharedPreviewData.game.rating} Approval</span>
                      <span>•</span>
                      <span className="text-stone-300">🏷️ {sharedPreviewData.game.genre}</span>
                    </div>
                  </div>
                </div>

                {/* Watermark bar */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-stone-300 bg-black/40 px-2.5 py-1 rounded-lg backdrop-blur-xs">
                  <span className="truncate max-w-[340px]">{sharedPreviewData.game.description}</span>
                  <span className="text-stone-400 font-mono">roblox.megaworld-rp.internal</span>
                </div>
              </div>

              {/* OpenGraph Metadata Simulation Bar */}
              <div className="bg-[#191b1d] p-3 border-t border-stone-800 text-xs font-mono space-y-1 text-stone-300">
                <div className="flex items-center justify-between text-[10.5px] text-stone-400 border-b border-stone-800 pb-1.5">
                  <span className="text-cyan-300 flex items-center gap-1 font-bold">
                    <ExternalLink size={12} />
                    <span>OpenGraph Social Media Tags</span>
                  </span>
                  <span className="text-emerald-400 font-bold">✓ Synced to Community Feed</span>
                </div>
                <div className="pt-1 text-[11px] grid grid-cols-1 gap-1 text-stone-300">
                  <div><span className="text-purple-400 font-bold">og:title:</span> {sharedPreviewData.game.name}</div>
                  <div className="text-stone-400 truncate"><span className="text-purple-400 font-bold">og:description:</span> {sharedPreviewData.game.description}</div>
                  <div className="text-stone-400 truncate"><span className="text-purple-400 font-bold">og:url:</span> https://roblox.megaworld-rp.internal/experience/{sharedPreviewData.game.id}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  const url = `https://roblox.megaworld-rp.internal/experience/${sharedPreviewData.game.id}`;
                  navigator.clipboard?.writeText(url);
                  setCopiedToast('Share URL copied!');
                  setTimeout(() => setCopiedToast(null), 2500);
                }}
                className="flex-1 w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95"
              >
                <Copy size={13} />
                <span>Copy Social Link</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const caption = `🎮 Check out "${sharedPreviewData.game.name}" in the MegaWorld Roblox Multiverse! 👥 ${sharedPreviewData.game.playerCount} adventurers active • Rating: ${sharedPreviewData.game.rating} 👍 Play here: https://roblox.megaworld-rp.internal/experience/${sharedPreviewData.game.id} #Roblox #MegaWorldRP`;
                  navigator.clipboard?.writeText(caption);
                  setCopiedToast('Caption & tags copied!');
                  setTimeout(() => setCopiedToast(null), 2500);
                }}
                className="flex-1 w-full py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white font-mono text-xs font-bold transition border border-stone-600 flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95"
              >
                <Share2 size={13} className="text-purple-300" />
                <span>Copy Post Caption</span>
              </button>

              {onOpenCommunityDashboard && (
                <button
                  type="button"
                  onClick={() => {
                    setSharedPreviewData(null);
                    onOpenCommunityDashboard();
                  }}
                  className="w-full sm:w-auto py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-mono text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95"
                >
                  <span>🌐 View in Feed</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   MINI-GAME 1: TOWER OBBY SPEEDRUN (OBSTACLE COURSE)
========================================================== */
function RobloxObbyMiniGame({
  playerChar,
  onReward,
}: {
  playerChar: CharacterData;
  onReward: (amount: number) => void;
}) {
  const [stage, setStage] = useState<number>(1);
  const [playerX, setPlayerX] = useState<number>(30); // percentage 0 - 100
  const [playerY, setPlayerY] = useState<number>(150); // pixels from bottom
  const [isJumping, setIsJumping] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [hasWon, setHasWon] = useState<boolean>(false);
  const [deaths, setDeaths] = useState<number>(0);

  // Obstacle stages definitions
  const stages = [
    { id: 1, name: 'Stage 1: Neon Lava Studs', color: 'border-red-500' },
    { id: 2, name: 'Stage 2: Disappearing Checkerboards', color: 'border-yellow-500' },
    { id: 3, name: 'Stage 3: Laser Grid Walk', color: 'border-cyan-500' },
    { id: 4, name: 'Stage 4: Bouncy Speed Trampolines', color: 'border-purple-500' },
    { id: 5, name: 'Stage 5: The Winner Podium!', color: 'border-emerald-500' },
  ];

  // Timer loop
  useEffect(() => {
    if (hasWon) return;
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [hasWon]);

  // Jump physics
  const jump = () => {
    if (isJumping) return;
    setIsJumping(true);
    audioEngine.playRobloxSound('coil');
    setTimeout(() => {
      setIsJumping(false);
    }, 380);
  };

  // Move left / right
  const move = (delta: number) => {
    setPlayerX(prev => {
      const next = Math.max(5, Math.min(95, prev + delta));
      // Check hazard collisions for stage
      if (next > 40 && next < 60 && !isJumping && stage < 5) {
        // Stepped on red lava brick!
        audioEngine.playRobloxSound('oof');
        setDeaths(d => d + 1);
        return 10; // reset to stage checkpoint
      }
      // Reached goal of stage
      if (next >= 90) {
        if (stage < 5) {
          audioEngine.playRobloxSound('badge');
          setStage(s => s + 1);
          return 10;
        } else if (!hasWon) {
          setHasWon(true);
          onReward(350);
          audioEngine.playRobloxSound('badge');
          return 90;
        }
      }
      return next;
    });
  };

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') move(5);
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') move(-5);
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') jump();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isJumping, stage, hasWon]);

  return (
    <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] flex flex-col gap-4 font-mono">
      {/* Obby Header HUD */}
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#393B3D] pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Tower of Hell: Speedrun Obby</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/40">
              Stage {stage} / 5
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            {stages[stage - 1].name} • Jump over red lava neon blocks! Don't touch or you OOF!
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="text-stone-300">⏱️ Time: <span className="text-yellow-300">{timer}s</span></div>
          <div className="text-stone-300">💀 Oofs: <span className="text-red-400">{deaths}</span></div>
          <button
            onClick={() => {
              setStage(1);
              setPlayerX(10);
              setTimer(0);
              setDeaths(0);
              setHasWon(false);
              audioEngine.playRobloxSound('click');
            }}
            className="p-1.5 rounded-lg bg-[#191B1D] hover:bg-stone-800 text-stone-400 hover:text-white border border-[#393B3D] cursor-pointer"
            title="Restart Obby"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Obby 2D Playfield */}
      <div className="relative h-64 bg-[#111214] rounded-2xl border-2 border-[#393B3D] overflow-hidden select-none">
        {/* Background Grid */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        {/* Start Checkpoint */}
        <div className="absolute bottom-0 left-2 w-16 h-8 bg-emerald-700/80 rounded-t-lg border-t-2 border-emerald-400 flex items-center justify-center text-[9px] font-bold text-emerald-200">
          SPAWN
        </div>

        {/* Hazard: Red Lava Neon Bricks in middle */}
        {stage < 5 && (
          <div className="absolute bottom-0 left-[42%] w-[18%] h-7 bg-red-600 rounded-t-lg border-t-4 border-yellow-300 shadow-[0_0_20px_#ef4444] animate-pulse flex items-center justify-center text-[10px] font-black text-black">
            LAVA (JUMP!)
          </div>
        )}

        {/* End Podium / Checkpoint Door */}
        <div className="absolute bottom-0 right-2 w-20 h-10 bg-amber-600/90 rounded-t-xl border-t-4 border-yellow-300 flex items-center justify-center text-[10px] font-bold text-black shadow-lg">
          {stage === 5 ? '🏆 PODIUM' : 'NEXT >>'}
        </div>

        {/* Floating Player Character */}
        <div 
          className="absolute transition-all duration-75 ease-out"
          style={{
            left: `${playerX}%`,
            bottom: isJumping ? '75px' : '20px',
            transform: 'translateX(-50%)',
          }}
        >
          <CharacterAvatar character={playerChar} size="sm" isWalking={true} isJumping={isJumping} />
        </div>

        {/* Victory Screen */}
        {hasWon && (
          <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center text-center p-4">
            <Trophy size={48} className="text-yellow-400 animate-bounce mb-2" />
            <h4 className="text-xl font-black text-white">OBBY COMPLETED!</h4>
            <p className="text-xs text-yellow-300 mt-1">+350 Robux Added To Your Balance!</p>
            <p className="text-[11px] text-stone-400 mt-1">Finished in {timer} seconds with {deaths} Oofs.</p>
            <button
              onClick={() => {
                setStage(1);
                setPlayerX(10);
                setTimer(0);
                setDeaths(0);
                setHasWon(false);
              }}
              className="mt-4 px-4 py-2 bg-[#00A2FF] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {/* On-Screen Touch D-Pad for Obby */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => move(-8)}
            className="px-4 py-2 bg-[#191B1D] hover:bg-stone-800 border border-[#393B3D] text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95"
          >
            ◀ Run Left (A)
          </button>
          <button
            onClick={() => move(8)}
            className="px-4 py-2 bg-[#191B1D] hover:bg-stone-800 border border-[#393B3D] text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95"
          >
            Run Right (D) ▶
          </button>
        </div>

        <button
          onClick={jump}
          className="px-6 py-2.5 bg-[#00A2FF] hover:bg-[#0091e6] text-white font-bold text-xs rounded-xl shadow cursor-pointer active:scale-95 flex items-center gap-1.5"
        >
          <span>⏫ JUMP (Space)</span>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   MINI-GAME 2: NATURAL DISASTER SURVIVAL
========================================================== */
function RobloxDisasterMiniGame({
  playerChar,
  onReward,
}: {
  playerChar: CharacterData;
  onReward: (amount: number) => void;
}) {
  const [disaster, setDisaster] = useState<'meteor' | 'flood' | 'acid' | 'tornado'>('meteor');
  const [playerX, setPlayerX] = useState<number>(50);
  const [altitude, setAltitude] = useState<number>(0);
  const [health, setHealth] = useState<number>(100);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [survivedCount, setSurvivedCount] = useState<number>(0);

  // Disaster descriptions
  const disasterInfo = {
    meteor: { name: '☄️ Meteor Shower', rule: 'Dodge the flaming meteor craters falling from the sky!' },
    flood: { name: '🌊 Flash Flood', rule: 'Climb to high ground on the brick tower before the water rises!' },
    acid: { name: '🌧️ Acid Rain', rule: 'Seek shelter under the roof awning or take corrosive damage!' },
    tornado: { name: '🌪️ F5 Tornado', rule: 'Run away from the twister vortex to avoid getting flung!' },
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Survived disaster!
          setSurvivedCount(c => c + 1);
          onReward(200);
          audioEngine.playRobloxSound('badge');
          // Pick next disaster
          const list: ('meteor' | 'flood' | 'acid' | 'tornado')[] = ['meteor', 'flood', 'acid', 'tornado'];
          const next = list[Math.floor(Math.random() * list.length)];
          setDisaster(next);
          setHealth(100);
          return 25;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#393B3D] pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Natural Disaster Survival: Green Baseplate Island</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40">
              {disasterInfo[disaster].name}
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            {disasterInfo[disaster].rule}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div>⏳ Evacuation: <span className="text-yellow-300">{timeLeft}s</span></div>
          <div>❤️ Health: <span className="text-emerald-400">{health}%</span></div>
          <div>🏆 Survived: <span className="text-cyan-400">{survivedCount}</span></div>
        </div>
      </div>

      {/* Survival Arena */}
      <div className="relative h-64 bg-sky-950/70 rounded-2xl border-2 border-[#393B3D] overflow-hidden select-none">
        {/* Sky warning weather tint */}
        <div className={`absolute inset-0 transition-colors duration-1000 pointer-events-none ${
          disaster === 'meteor' ? 'bg-orange-950/40' :
          disaster === 'flood' ? 'bg-cyan-950/50' :
          disaster === 'acid' ? 'bg-lime-950/40' : 'bg-stone-900/50'
        }`} />

        {/* Classic 2008 Green Stud Baseplate */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-emerald-600 border-t-4 border-emerald-500 flex items-center justify-center">
          <span className="text-[10px] text-emerald-950 font-black tracking-widest uppercase">ROBLOX GREEN BASEPLATE</span>
        </div>

        {/* Center Tower Structure for Flood Shelter */}
        <div className="absolute bottom-10 left-1/3 w-32 h-36 bg-amber-800/90 rounded-t-md border-2 border-amber-600 flex flex-col justify-between items-center p-1">
          {/* Roof Shelter */}
          <div className="w-36 h-4 bg-red-700 -mt-2 rounded-md border border-red-500 flex items-center justify-center text-[8px] text-white">
            ROOF SHELTER
          </div>
          <div className="text-[9px] text-amber-200">HIGH GROUND</div>
          <div className="w-10 h-16 bg-neutral-900 rounded-t-md border border-neutral-700" />
        </div>

        {/* Flood Water Layer */}
        {disaster === 'flood' && (
          <div 
            className="absolute bottom-0 inset-x-0 bg-blue-500/70 backdrop-blur-xs transition-all duration-1000 border-t-2 border-cyan-300 flex items-start justify-center pt-1"
            style={{ height: `${Math.min(180, (25 - timeLeft) * 8)}px` }}
          >
            <span className="text-[9px] font-black text-white">RISING WATER LEVEL</span>
          </div>
        )}

        {/* Meteor Falling Animation */}
        {disaster === 'meteor' && (
          <div className="absolute top-2 left-1/2 w-8 h-8 rounded-full bg-orange-500 border-2 border-yellow-300 shadow-[0_0_20px_#f97316] animate-ping" />
        )}

        {/* Player Avatar */}
        <div 
          className="absolute transition-all duration-150"
          style={{
            left: `${playerX}%`,
            bottom: altitude === 1 ? '150px' : '40px',
            transform: 'translateX(-50%)',
          }}
        >
          <CharacterAvatar character={playerChar} size="sm" isWalking={true} />
        </div>
      </div>

      {/* Movement Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setPlayerX(prev => Math.max(10, prev - 10))}
            className="px-4 py-2 bg-[#191B1D] hover:bg-stone-800 border border-[#393B3D] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            ◀ Move Left
          </button>
          <button
            onClick={() => setPlayerX(prev => Math.min(90, prev + 10))}
            className="px-4 py-2 bg-[#191B1D] hover:bg-stone-800 border border-[#393B3D] text-white font-bold text-xs rounded-xl cursor-pointer"
          >
            Move Right ▶
          </button>
        </div>

        <button
          onClick={() => {
            setAltitude(prev => (prev === 0 ? 1 : 0));
            audioEngine.playRobloxSound('coil');
          }}
          className="px-5 py-2 bg-[#00A2FF] hover:bg-[#0091e6] text-white font-bold text-xs rounded-xl cursor-pointer shadow"
        >
          {altitude === 0 ? '🧗 Climb Up Tower' : '⬇ Climb Down'}
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   MINI-GAME 3: MEGA ROBUX TYCOON / DROPPER CONVEYOR
========================================================== */
function RobloxTycoonMiniGame({
  robuxBalance,
  onAddRobux,
  onSpendRobux,
}: {
  robuxBalance: number;
  onAddRobux: (amount: number) => void;
  onSpendRobux: (amount: number) => void;
}) {
  const [dropperTier, setDropperTier] = useState<number>(1);
  const [hasWalls, setHasWalls] = useState<boolean>(false);
  const [hasSpeedCoil, setHasSpeedCoil] = useState<boolean>(false);
  const [hasPenthouse, setHasPenthouse] = useState<boolean>(false);
  const [drops, setDrops] = useState<{ id: number; color: string; value: number }[]>([]);

  // Conveyor tick loop
  useEffect(() => {
    const interval = setInterval(() => {
      const dropValue = dropperTier * 15;
      const dropColor = dropperTier === 1 ? '#a8a29e' : dropperTier === 2 ? '#38bdf8' : dropperTier === 3 ? '#facc15' : '#a855f7';
      const newDrop = { id: Date.now() + Math.random(), color: dropColor, value: dropValue };

      setDrops(prev => [...prev.slice(-6), newDrop]);
      onAddRobux(dropValue);
    }, 1800);
    return () => clearInterval(interval);
  }, [dropperTier]);

  return (
    <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#393B3D] pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Mega Factory Tycoon: Conveyor Dropper</span>
            <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-500/40">
              Tier {dropperTier} Dropper
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Blocks drop from ceiling onto conveyor, slide into collector, and generate automatic Robux!
          </p>
        </div>

        <div className="text-xs font-bold text-emerald-400">
          💸 Income: +{dropperTier * 15} R$ per tick
        </div>
      </div>

      {/* Conveyor Visualizer */}
      <div className="relative h-44 bg-[#111214] rounded-2xl border-2 border-[#393B3D] overflow-hidden p-4 flex flex-col justify-between">
        {/* Overhead Dropper Spout */}
        <div className="flex items-center justify-start gap-4 pl-6">
          <div className="w-16 h-10 bg-stone-700 rounded-b-xl border-x-2 border-b-2 border-stone-500 flex items-center justify-center text-[9px] font-bold text-yellow-300 shadow">
            DROPPER
          </div>
          <div className="text-[11px] text-stone-400">Automatic Ore Dispenser</div>
        </div>

        {/* Animated Moving Conveyor Belt */}
        <div className="w-full h-8 bg-stone-800 border-y-2 border-stone-600 rounded relative overflow-hidden flex items-center">
          <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#fff_10px,#fff_20px)] animate-[pulse_1s_infinite]" />
          
          {/* Sliding blocks */}
          <div className="flex items-center gap-6 pl-10 z-10">
            {drops.map((drop) => (
              <div 
                key={drop.id}
                className="w-5 h-5 rounded-xs border border-black shadow-md animate-bounce"
                style={{ backgroundColor: drop.color }}
              />
            ))}
          </div>

          {/* Collector Hopper at right */}
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-red-600 border-l-2 border-red-400 flex items-center justify-center text-[9px] font-black text-white">
            COLLECTOR
          </div>
        </div>

        {/* Base Features summary */}
        <div className="flex gap-4 text-[10px] text-stone-400">
          <span>{hasWalls ? '🛡️ Concrete Walls (Built)' : '⚪ No Walls'}</span>
          <span>{hasSpeedCoil ? '⚡ Speed Coil Dispenser' : '⚪ Normal Speed'}</span>
          <span>{hasPenthouse ? '🏰 Luxury Penthouse' : '⚪ Ground Floor'}</span>
        </div>
      </div>

      {/* Tycoon Purchase Buttons Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => {
            if (robuxBalance >= 100 && dropperTier < 4) {
              onSpendRobux(100);
              setDropperTier(t => t + 1);
            }
          }}
          disabled={robuxBalance < 100 || dropperTier >= 4}
          className="p-3 bg-emerald-950/60 border border-emerald-500/50 hover:bg-emerald-900 rounded-xl text-left transition disabled:opacity-40 cursor-pointer"
        >
          <div className="text-xs font-bold text-emerald-300">Upgrade Dropper</div>
          <div className="text-[10px] text-stone-400 mt-1">Cost: 100 R$</div>
        </button>

        <button
          onClick={() => {
            if (robuxBalance >= 150 && !hasWalls) {
              onSpendRobux(150);
              setHasWalls(true);
            }
          }}
          disabled={robuxBalance < 150 || hasWalls}
          className="p-3 bg-blue-950/60 border border-blue-500/50 hover:bg-blue-900 rounded-xl text-left transition disabled:opacity-40 cursor-pointer"
        >
          <div className="text-xs font-bold text-blue-300">Buy Concrete Walls</div>
          <div className="text-[10px] text-stone-400 mt-1">Cost: 150 R$</div>
        </button>

        <button
          onClick={() => {
            if (robuxBalance >= 200 && !hasSpeedCoil) {
              onSpendRobux(200);
              setHasSpeedCoil(true);
            }
          }}
          disabled={robuxBalance < 200 || hasSpeedCoil}
          className="p-3 bg-purple-950/60 border border-purple-500/50 hover:bg-purple-900 rounded-xl text-left transition disabled:opacity-40 cursor-pointer"
        >
          <div className="text-xs font-bold text-purple-300">Buy Speed Coil</div>
          <div className="text-[10px] text-stone-400 mt-1">Cost: 200 R$</div>
        </button>

        <button
          onClick={() => {
            if (robuxBalance >= 500 && !hasPenthouse) {
              onSpendRobux(500);
              setHasPenthouse(true);
            }
          }}
          disabled={robuxBalance < 500 || hasPenthouse}
          className="p-3 bg-amber-950/60 border border-amber-500/50 hover:bg-amber-900 rounded-xl text-left transition disabled:opacity-40 cursor-pointer"
        >
          <div className="text-xs font-bold text-amber-300">Buy Penthouse Roof</div>
          <div className="text-[10px] text-stone-400 mt-1">Cost: 500 R$</div>
        </button>
      </div>
    </div>
  );
}

/* ==========================================================
   MINI-GAME 4: BLOX FRUITS & SWORD ARENA
========================================================== */
function RobloxBloxFruitsMiniGame({
  playerChar,
  onReward,
}: {
  playerChar: CharacterData;
  onReward: (amount: number) => void;
}) {
  const [mastery, setMastery] = useState<number>(1);
  const [bounty, setBounty] = useState<number>(1000);
  const [equippedFruit, setEquippedFruit] = useState<'flame' | 'ice' | 'dough' | 'light'>('flame');
  const [dummyHealth, setDummyHealth] = useState<number>(100);
  const [slashEffect, setSlashEffect] = useState<string | null>(null);

  const attack = (type: 'sword' | 'skill') => {
    if (type === 'sword') {
      audioEngine.playRobloxSound('sword');
      setSlashEffect('🗡️ SLASH! -25 DMG');
    } else {
      audioEngine.playRobloxSound('rocket');
      setSlashEffect(
        equippedFruit === 'flame' ? '🔥 FIRE FIST! -50 DMG' :
        equippedFruit === 'ice' ? '❄️ GLACIER SURGE! -50 DMG' :
        equippedFruit === 'dough' ? '🍩 DOUGH BARRAGE! -50 DMG' : '⚡ LIGHT KICK! -50 DMG'
      );
    }

    setDummyHealth(prev => {
      const next = prev - (type === 'sword' ? 25 : 50);
      if (next <= 0) {
        // Dummy defeated!
        audioEngine.playRobloxSound('badge');
        setMastery(m => m + 1);
        setBounty(b => b + 250);
        onReward(150);
        return 100; // respawn dummy
      }
      return next;
    });

    setTimeout(() => setSlashEffect(null), 800);
  };

  return (
    <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#393B3D] pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Blox Fruits: Sea Arena</span>
            <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/40">
              Pirate Lv. {mastery}
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Slash training dummies with the classic Linked Sword or unleash Devil Fruit abilities!
          </p>
        </div>

        <div className="text-xs font-bold text-amber-400">
          🏴‍☠️ Bounty: ฿{bounty.toLocaleString()}
        </div>
      </div>

      {/* Combat Arena Canvas */}
      <div className="relative h-48 bg-stone-900 rounded-2xl border-2 border-[#393B3D] flex items-center justify-around p-4 overflow-hidden">
        {/* Player Fighter */}
        <div className="flex flex-col items-center">
          <CharacterAvatar character={playerChar} size="md" isWalking={true} heldItem="sword" />
          <span className="text-[10px] font-bold text-white mt-1">You</span>
        </div>

        {/* Combat Action Slash Effect Banner */}
        {slashEffect && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-red-600 text-white font-black text-xs px-3 py-1.5 rounded-xl border-2 border-white animate-bounce shadow-2xl z-20">
            {slashEffect}
          </div>
        )}

        {/* Training Dummy */}
        <div className="flex flex-col items-center">
          {/* Health Bar */}
          <div className="w-20 h-2 bg-stone-950 rounded-full border border-stone-700 overflow-hidden mb-1">
            <div className="h-full bg-red-500 transition-all duration-150" style={{ width: `${dummyHealth}%` }} />
          </div>
          <div className="w-12 h-20 bg-amber-700 rounded-lg border-2 border-amber-900 flex flex-col items-center justify-center text-xs shadow">
            🎯
          </div>
          <span className="text-[10px] text-stone-400 mt-1">Dummy ({dummyHealth} HP)</span>
        </div>
      </div>

      {/* Ability Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => attack('sword')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <Swords size={14} className="text-cyan-400" />
            <span>Linked Sword (Z)</span>
          </button>

          <button
            onClick={() => attack('skill')}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl cursor-pointer active:scale-95 shadow flex items-center gap-1.5"
          >
            <Flame size={14} className="text-yellow-300" />
            <span>Fruit Skill (X)</span>
          </button>
        </div>

        {/* Fruit Switcher */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>Fruit:</span>
          {(['flame', 'ice', 'dough', 'light'] as const).map(fruit => (
            <button
              key={fruit}
              onClick={() => {
                setEquippedFruit(fruit);
                audioEngine.playRobloxSound('click');
              }}
              className={`px-2 py-0.5 rounded-lg uppercase text-[10px] font-bold border ${
                equippedFruit === fruit
                  ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                  : 'bg-[#191B1D] text-stone-400 border-[#393B3D]'
              }`}
            >
              {fruit}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   MINI-GAME 5: BROOKHAVEN RP SIMULATOR
========================================================== */
function RobloxBrookhavenMiniGame({
  playerChar,
}: {
  playerChar: CharacterData;
}) {
  const [job, setJob] = useState<'police' | 'chef' | 'doctor' | 'rockstar'>('police');
  const [vehicle, setVehicle] = useState<'supercar' | 'skateboard' | 'hoverboard'>('supercar');
  const [house, setHouse] = useState<'mansion' | 'cottage' | 'castle'>('mansion');
  const [speech, setSpeech] = useState<string>('Welcome to Brookhaven!');

  const jobs = {
    police: { title: '🚓 Police Officer', perk: 'Arrest lawbreakers & patrol town' },
    chef: { title: '🍕 Pizza Chef', perk: 'Bake hot pepperoni pies & deliver orders' },
    doctor: { title: '🏥 Hospital Doctor', perk: 'Heal sick citizens in the clinic' },
    rockstar: { title: '🎸 Famous Rockstar', perk: 'Perform sold-out stadium concerts' },
  };

  return (
    <div className="bg-[#232527] rounded-3xl p-5 border border-[#393B3D] flex flex-col gap-4 font-mono">
      <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#393B3D] pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Brookhaven RP: Suburban Neighborhood</span>
            <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/40">
              Roleplay Life
            </span>
          </h3>
          <p className="text-xs text-stone-400">
            Adopt an occupation, drive custom vehicles, customize your estate, and chat with town citizens!
          </p>
        </div>

        <div className="text-xs font-bold text-stone-300">
          Job: <span className="text-emerald-400">{jobs[job].title}</span>
        </div>
      </div>

      {/* Brookhaven Scene Canvas */}
      <div className="relative h-48 bg-gradient-to-t from-stone-900 to-sky-950 rounded-2xl border-2 border-[#393B3D] flex items-center justify-between p-6 overflow-hidden">
        {/* House on Left */}
        <div className="flex flex-col items-center">
          <div className="text-4xl filter drop-shadow">
            {house === 'mansion' ? '🏰' : house === 'cottage' ? '🏡' : '🏯'}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 capitalize">{house} Estate</span>
        </div>

        {/* Character with speech bubble */}
        <div className="flex flex-col items-center relative">
          <div className="absolute -top-10 bg-white text-black font-black text-[10px] px-2.5 py-1 rounded-xl shadow-lg border border-black animate-bounce whitespace-nowrap">
            💬 {speech}
          </div>
          <CharacterAvatar character={playerChar} size="md" isWalking={true} />
        </div>

        {/* Vehicle on Right */}
        <div className="flex flex-col items-center">
          <div className="text-4xl filter drop-shadow">
            {vehicle === 'supercar' ? '🏎️' : vehicle === 'skateboard' ? '🛹' : '🛸'}
          </div>
          <span className="text-[10px] text-stone-400 mt-1 capitalize">{vehicle}</span>
        </div>
      </div>

      {/* Roleplay Options Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <span className="text-[11px] text-stone-400 uppercase font-bold block mb-1">Occupation:</span>
          <div className="grid grid-cols-2 gap-1.5">
            {(Object.keys(jobs) as (keyof typeof jobs)[]).map(key => (
              <button
                key={key}
                onClick={() => {
                  setJob(key);
                  setSpeech(key === 'police' ? 'Stop in the name of the law!' : key === 'chef' ? 'Fresh hot pizza ready!' : key === 'doctor' ? 'Take your medicine!' : 'Rock and roll!');
                  audioEngine.playRobloxSound('click');
                }}
                className={`p-1.5 rounded-lg text-xs font-bold border transition ${
                  job === key ? 'bg-blue-600 text-white border-blue-400' : 'bg-[#191B1D] text-stone-300 border-[#393B3D]'
                }`}
              >
                {jobs[key].title.split(' ')[0]} {key}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] text-stone-400 uppercase font-bold block mb-1">Vehicle:</span>
          <div className="flex gap-1.5">
            {[
              { id: 'supercar', label: '🏎️ Supercar' },
              { id: 'hoverboard', label: '🛸 Hoverboard' },
              { id: 'skateboard', label: '🛹 Skateboard' },
            ].map(v => (
              <button
                key={v.id}
                onClick={() => {
                  setVehicle(v.id as any);
                  audioEngine.playRobloxSound('speed');
                }}
                className={`p-1.5 flex-1 rounded-lg text-xs font-bold border transition ${
                  vehicle === v.id ? 'bg-amber-600 text-white border-amber-400' : 'bg-[#191B1D] text-stone-300 border-[#393B3D]'
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] text-stone-400 uppercase font-bold block mb-1">Dream House:</span>
          <div className="flex gap-1.5">
            {[
              { id: 'mansion', label: '🏰 Mansion' },
              { id: 'cottage', label: '🏡 Cottage' },
              { id: 'castle', label: '🏯 Castle' },
            ].map(h => (
              <button
                key={h.id}
                onClick={() => {
                  setHouse(h.id as any);
                  audioEngine.playRobloxSound('badge');
                }}
                className={`p-1.5 flex-1 rounded-lg text-xs font-bold border transition ${
                  house === h.id ? 'bg-emerald-600 text-white border-emerald-400' : 'bg-[#191B1D] text-stone-300 border-[#393B3D]'
                }`}
              >
                {h.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   MINI-GAME 6: SPRUNKI 3D RP: THE VERITY UPDATE
   Official Roblox experience with interactive Celestial Shrine,
   Jack-in-the-Box winding mechanism, badges, and morphs!
========================================================== */
interface RobloxVerityRPMiniGameProps {
  onReward: (amount: number, reason: string) => void;
  onSelectAvatar: (char: CharacterData) => void;
  onLaunchGame: () => void;
}

function RobloxVerityRPMiniGame({
  onReward,
  onSelectAvatar,
  onLaunchGame,
}: RobloxVerityRPMiniGameProps) {
  const [activeZone, setActiveZone] = useState<'observatory' | 'musicbox' | 'eclipse'>('observatory');
  const [crankCount, setCrankCount] = useState<number>(0);
  const [isWinding, setIsWinding] = useState<boolean>(false);
  const [isPopped, setIsPopped] = useState<boolean>(false);
  const [oracleQuote, setOracleQuote] = useState<string>('Press "Consult Oracle" to receive celestial truth from Verity...');
  const [unlockedBadges, setUnlockedBadges] = useState<string[]>([]);
  const [lightEnergy, setLightEnergy] = useState<number>(30);
  const [voidEnergy, setVoidEnergy] = useState<number>(70);
  const [trialSolved, setTrialSolved] = useState<boolean>(false);

  // Avatar definitions for morphs
  const oracleVerityChar: CharacterData = {
    id: 185,
    name: 'Verity',
    type: 'sprnuki',
    subtype: 'verity',
    musicalNote: 'Voice 7 / Celestial Starlight Truth',
    color: 'bg-purple-600',
    description: '✨ The Celestial Star Oracle of Truth! Radiant starlight halo crown, amethyst tiara, celestial wings, and crystalline harmonic glass chimes!',
  };

  const verityBoxChar: CharacterData = {
    id: 187,
    name: 'Verity in a Box',
    type: 'sprnuki',
    subtype: 'verity_box',
    musicalNote: 'Music Box / Spring Boing Melody',
    color: 'bg-purple-900',
    description: '📦 The iconic Jack-in-the-Box Verity Morph! Turn the golden winding crank to hear celestial music box notes, then POP! out with star fireworks!',
  };

  const eclipseVerityChar: CharacterData = {
    id: 186,
    name: 'Eclipse Verity (Horror Phase 2)',
    type: 'sprnuki',
    subtype: 'verity',
    isHorror: true,
    musicalNote: 'Abyssal Truth / Void Chime',
    color: 'bg-indigo-950',
    description: 'Phase 2 Eclipse: Cosmic void entity crowned with a blood starlight tiara, reality-warping truth resonance, and dark matter celestial wings!',
  };

  const unlockBadge = (badgeId: string, badgeName: string, reward: number) => {
    if (unlockedBadges.includes(badgeId)) return;
    setUnlockedBadges(prev => {
      const next = [...prev, badgeId];
      // Check if all 3 base badges are unlocked
      if (next.includes('seeker') && next.includes('box') && next.includes('eclipse') && !next.includes('ascendant')) {
        setTimeout(() => {
          setUnlockedBadges(p => [...p, 'ascendant']);
          onReward(250, '🏆 UNLOCKED "Celestial Ascendant" All-Badges Grand Master!');
          audioEngine.playVeritySound('oracle');
        }, 1200);
      }
      return next;
    });
    onReward(reward, `🏆 Badge Unlocked: ${badgeName}!`);
  };

  // Oracle Consultation
  const handleConsultOracle = () => {
    audioEngine.playVeritySound('oracle');
    const quotes = [
      '“Truth shines through the darkest mist; false notes wither, but authentic harmony echoes for eternity.”',
      '“Look into the celestial crystal: you were meant to build worlds of wonder, block by block.”',
      '“A melody played with honesty heals the corrupted frequency. The starlight crowns your courage.”',
      '“The mystery box holds what cannot lie: spring forward with cosmic joy!”',
      '“Light and void are two sides of the same song; balance them, and the gate of truth will open.”'
    ];
    const picked = quotes[Math.floor(Math.random() * quotes.length)];
    setOracleQuote(picked);
    unlockBadge('seeker', 'Truth Seeker', 75);
  };

  // Jack-in-the-box crank turn
  const handleTurnCrank = () => {
    if (isPopped || isWinding) return;
    const nextCount = crankCount + 1;
    setCrankCount(nextCount);
    audioEngine.playVeritySound('wind');

    if (nextCount >= 3) {
      setIsWinding(true);
      audioEngine.playVeritySound('musicbox');
      setTimeout(() => {
        setIsPopped(true);
        setIsWinding(false);
        audioEngine.playVeritySound('pop');
        unlockBadge('box', 'Verity in a Box', 150);
      }, 1400);
    }
  };

  const handleResetBox = () => {
    setCrankCount(0);
    setIsPopped(false);
    setIsWinding(false);
    audioEngine.playRobloxSound('click');
  };

  // Eclipse Balance trial
  const handleAdjustBalance = (deltaLight: number) => {
    if (trialSolved) return;
    const newLight = Math.max(0, Math.min(100, lightEnergy + deltaLight));
    const newVoid = 100 - newLight;
    setLightEnergy(newLight);
    setVoidEnergy(newVoid);

    audioEngine.playVeritySound('eclipse');

    if (newLight === 50 && newVoid === 50) {
      setTrialSolved(true);
      unlockBadge('eclipse', 'Eclipse Paradox', 100);
      audioEngine.playVeritySound('oracle');
    }
  };

  return (
    <div className="bg-[#191B1D] border-2 border-purple-500/50 rounded-2xl p-5 shadow-2xl font-mono text-white flex flex-col gap-5">
      {/* Game Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3 border-b border-purple-500/30 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 via-emerald-600 to-amber-400 p-0.5 shadow-[0_0_15px_rgba(239,68,68,0.5)] flex items-center justify-center">
            <span className="text-2xl animate-spin" style={{ animationDuration: '8s' }}>🎅</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-white">Sprunki 3D RP: Christmas Holiday Update</h3>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-black animate-pulse">
                CHRISTMAS OFFICIAL
              </span>
            </div>
            <p className="text-xs text-emerald-300">
              👥 95,800 Playing • ⭐ 99.1% Likes • By Sprunki Christmas Team
            </p>
          </div>
        </div>

        {/* Zone Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-[#111214] p-1 rounded-xl border border-purple-500/40">
          <button
            onClick={() => { setActiveZone('observatory'); audioEngine.playVeritySound('oracle'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeZone === 'observatory' ? 'bg-purple-600 text-white shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            🏛️ Observatory
          </button>
          <button
            onClick={() => { setActiveZone('musicbox'); audioEngine.playVeritySound('musicbox'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeZone === 'musicbox' ? 'bg-amber-600 text-white shadow' : 'text-stone-400 hover:text-white'
            }`}
          >
            📦 Music Box
          </button>
          <button
            onClick={() => { setActiveZone('eclipse'); audioEngine.playVeritySound('eclipse'); }}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
              activeZone === 'eclipse' ? 'bg-indigo-900 text-purple-200 shadow border border-purple-400' : 'text-stone-400 hover:text-white'
            }`}
          >
            🌑 Eclipse Chamber
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      {activeZone === 'observatory' && (
        <div className="bg-gradient-to-b from-purple-950/80 via-stone-900 to-indigo-950/80 border border-purple-500/40 rounded-xl p-5 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
          {/* Celestial Oracle Verity Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-purple-900/30 rounded-2xl border border-purple-400/30 relative">
            {/* Animated Halo Rings */}
            <div className="absolute inset-0 rounded-2xl border border-amber-300/40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />
            <div className="scale-125 mb-3">
              <CharacterAvatar character={oracleVerityChar} isWalking={false} />
            </div>
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
              <span>✦</span> Oracle Verity <span>✦</span>
            </span>
            <span className="text-[10px] text-purple-300">Phase 1: Truth Seeker</span>
          </div>

          {/* Dialogue & Truth Oracle Box */}
          <div className="flex-1 space-y-3">
            <div className="bg-black/60 border border-purple-500/50 p-4 rounded-xl min-h-[90px] flex items-center">
              <p className="text-sm text-purple-200 italic leading-relaxed">
                {oracleQuote}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleConsultOracle}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 rounded-xl text-xs font-bold text-white shadow-lg border border-purple-400 transition cursor-pointer flex items-center gap-1.5"
              >
                <span>✨</span> Consult Oracle (+75 R$)
              </button>
              <button
                onClick={() => {
                  onSelectAvatar(oracleVerityChar);
                  onLaunchGame();
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer flex items-center gap-1.5"
              >
                <span>🎮</span> Equip Oracle & Play in MegaWorld
              </button>
            </div>
          </div>
        </div>
      )}

      {activeZone === 'musicbox' && (
        <div className="bg-gradient-to-b from-amber-950/60 via-stone-900 to-purple-950/70 border border-amber-500/40 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
          {/* Jack-in-the-box Display */}
          <div className="flex flex-col items-center justify-center p-4 bg-black/40 rounded-2xl border border-amber-400/40 relative min-w-[160px]">
            {isPopped ? (
              <div className="scale-125 mb-3 animate-bounce">
                <CharacterAvatar character={verityBoxChar} isWalking={false} />
              </div>
            ) : (
              <div className="w-24 h-24 bg-gradient-to-b from-purple-800 to-indigo-950 border-3 border-amber-300 rounded-xl flex flex-col items-center justify-center relative shadow-[0_0_20px_#c084fc] mb-3">
                <div className="text-3xl animate-pulse">🎁</div>
                <div className="text-[10px] text-amber-300 font-bold mt-1">VERITY BOX</div>
                {/* Crank Handle */}
                <div className={`absolute -right-3 top-6 w-3 h-4 bg-amber-400 rounded-xs flex flex-col items-center justify-end ${isWinding ? 'animate-spin' : ''}`}>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                </div>
              </div>
            )}
            <span className="text-xs font-bold text-amber-300">
              {isPopped ? '🎉 POPPED! Verity in a Box' : `Crank Turns: ${crankCount}/3`}
            </span>
          </div>

          {/* Interactive Controls */}
          <div className="flex-1 space-y-3">
            <h4 className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
              <span>📦</span> The Legendary Verity Jack-in-the-Box
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed">
              Wind the golden mechanical crank 3 times to hear the celestial music box melody. When the music reaches the climax, Verity springs out with star fireworks!
            </p>

            <div className="flex flex-wrap gap-2">
              {!isPopped ? (
                <button
                  onClick={handleTurnCrank}
                  disabled={isWinding}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black rounded-xl text-xs shadow-lg transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>⚙️</span> Turn Winding Crank ({crankCount}/3)
                </button>
              ) : (
                <button
                  onClick={handleResetBox}
                  className="px-3 py-2 bg-stone-700 hover:bg-stone-600 rounded-xl text-xs font-bold text-white transition cursor-pointer"
                >
                  🔄 Reset Box
                </button>
              )}

              {isPopped && (
                <button
                  onClick={() => {
                    onSelectAvatar(verityBoxChar);
                    onLaunchGame();
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold text-white shadow-lg transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>🎮</span> Equip Verity in a Box & Play!
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeZone === 'eclipse' && (
        <div className="bg-gradient-to-b from-stone-950 via-purple-950/80 to-stone-950 border border-red-500/40 rounded-xl p-5 flex flex-col md:flex-row items-center gap-6">
          {/* Eclipse Verity Avatar */}
          <div className="flex flex-col items-center justify-center p-4 bg-red-950/30 rounded-2xl border border-red-500/40 relative">
            <div className="scale-125 mb-3">
              <CharacterAvatar character={eclipseVerityChar} isWalking={false} />
            </div>
            <span className="text-xs font-bold text-red-400">🌑 Eclipse Verity</span>
            <span className="text-[10px] text-stone-400">Horror Phase 2 Entity</span>
          </div>

          {/* Trial Balance Puzzle */}
          <div className="flex-1 space-y-3">
            <h4 className="text-sm font-bold text-red-300 flex items-center gap-1.5">
              <span>⚖️</span> Truth Balance Paradox: Light vs Void
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Balance both energies exactly to 50% / 50% to appease the Eclipse and unlock the Abyssal Truth Paradox!
            </p>

            {/* Energy Bars */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-amber-300">Starlight Light: {lightEnergy}%</span>
                <span className="text-red-400">Void Shadow: {voidEnergy}%</span>
              </div>
              <div className="h-3 w-full bg-black rounded-full overflow-hidden border border-stone-700 flex">
                <div className="bg-amber-400 transition-all duration-300" style={{ width: `${lightEnergy}%` }} />
                <div className="bg-red-600 transition-all duration-300" style={{ width: `${voidEnergy}%` }} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleAdjustBalance(10)}
                disabled={trialSolved}
                className="px-3 py-1.5 bg-amber-500/30 hover:bg-amber-500/50 border border-amber-400 rounded-lg text-xs font-bold text-amber-200 transition cursor-pointer"
              >
                +10% Light
              </button>
              <button
                onClick={() => handleAdjustBalance(-10)}
                disabled={trialSolved}
                className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 border border-red-500 rounded-lg text-xs font-bold text-red-200 transition cursor-pointer"
              >
                +10% Void
              </button>
              <button
                onClick={() => {
                  onSelectAvatar(eclipseVerityChar);
                  onLaunchGame();
                }}
                className="px-4 py-1.5 bg-indigo-700 hover:bg-indigo-600 border border-indigo-400 rounded-lg text-xs font-bold text-white transition cursor-pointer flex items-center gap-1.5 ml-auto"
              >
                <span>🎮</span> Equip Eclipse Verity
              </button>
            </div>
            {trialSolved && (
              <p className="text-xs text-emerald-300 font-bold animate-pulse">
                ✨ PARADOX SOLVED: Cosmic Equilibrium achieved! (+100 R$)
              </p>
            )}
          </div>
        </div>
      )}

      {/* Badges Earned Strip */}
      <div className="bg-[#111214] p-3 rounded-xl border border-stone-800 flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
          <span>🏆</span> Holiday & Celestial Badges ({unlockedBadges.length}/4):
        </span>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'seeker', name: '✨ Truth Seeker (+75 R$)' },
            { id: 'box', name: '📦 Verity in a Box (+150 R$)' },
            { id: 'eclipse', name: '🌑 Eclipse Paradox (+100 R$)' },
            { id: 'ascendant', name: '👑 Celestial Master (+250 R$)' },
          ].map(b => (
            <span
              key={b.id}
              className={`text-[10px] px-2 py-0.5 rounded-full font-bold border transition ${
                unlockedBadges.includes(b.id)
                  ? 'bg-amber-400/20 text-amber-300 border-amber-400/50 shadow'
                  : 'bg-stone-800/40 text-stone-500 border-stone-800'
              }`}
            >
              {unlockedBadges.includes(b.id) ? '✓ ' : '🔒 '}{b.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

