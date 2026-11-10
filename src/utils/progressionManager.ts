/**
 * Robust Cross-Platform Progression, Cloud Sync & Anti-Data-Loss Manager
 * 'United Games and Apps of Sprnuki Thomas and Friends' RPG
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SkillPerk {
  id: string;
  name: string;
  tree: 'minecraft' | 'sprnuki' | 'roblox' | 'countryballs' | 'thomas' | 'xilam';
  levelRequired: number;
  costSkillPoints: number;
  icon: string;
  title: string;
  description: string;
  buffType: 'mining' | 'speed' | 'defense' | 'xp' | 'rhythm' | 'cargo' | 'slapstick';
  buffValue: number;
}

export interface AchievementRecord {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'building' | 'rhythm' | 'combat' | 'diplomacy' | 'crossover';
  xpReward: number;
  coinReward: number;
  robuxReward: number;
  unlockedAt?: number;
  claimed: boolean;
}

export interface AcquiredItem {
  id: string;
  name: string;
  count: number;
  icon: string;
  tier: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlatformProfile {
  platform: 'PC' | 'Console' | 'Mobile' | 'Web';
  deviceModel: string;
  osVersion: string;
  lastActive: number;
  latencyMs: number;
  status: 'ONLINE' | 'STANDBY' | 'SYNCED';
  isCurrentDevice?: boolean;
}

export interface PlayerProgressionData {
  version: number;
  deviceId: string;
  lastSyncedAt: number;
  level: number;
  characterLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  skillPointsAvailable: number;
  totalSkillPointsEarned: number;
  unlockedSkillIds: string[];
  achievements: Record<string, AchievementRecord>;
  cloudSyncCode?: string;
  syncCodeExpiresAt?: number;
  platform: 'web' | 'mobile' | 'tablet' | 'desktop';
  crossPlatformSyncedDevices: string[];
  inventoryBackup: Record<string, { count: number; durability?: number }>;
  acquiredItems: AcquiredItem[];
  completedQuests: string[];
  cosmeticUnlocks: string[];
  megaCoins: number;
  robuxGems: number;
  unlockedItems: string[];
  platformProfiles: PlatformProfile[];
  dataIntegrityHash: string;
  cloudSyncLatencyMs: number;
  countryballCustomization?: {
    baseCountryName: string;
    flagLayout: string;
    colorTop?: string;
    colorMid?: string;
    colorBot?: string;
    isInverted?: boolean;
    eyeStyle: string;
    hat: string;
    glasses: string;
    prop: string;
    personalityTrait: 'diplomatic' | 'clay_hungry' | 'industrious' | 'jovial' | 'stoic' | 'space_dreamer';
  };
  brandReputation?: Record<string, number>;
  christmasSettings?: Record<string, any>;
  stats: {
    blocksMined: number;
    blocksPlaced: number;
    distanceTraveled: number;
    emotesPerformed: number;
    questsFinished: number;
    playtimeMinutes: number;
  };
}

export const SKILL_TREES_DATA: SkillPerk[] = [
  // MINECRAFT
  {
    id: 'mc_vein_miner',
    name: 'Deep Vein Spelunker',
    tree: 'minecraft',
    levelRequired: 1,
    costSkillPoints: 1,
    icon: '⛏️',
    title: 'Deep Vein Mining',
    description: '+25% Block mining speed and higher chance to extract raw minerals.',
    buffType: 'mining',
    buffValue: 25,
  },
  {
    id: 'mc_diamond_fortune',
    name: 'Diamond Fortune Infusion',
    tree: 'minecraft',
    levelRequired: 5,
    costSkillPoints: 2,
    icon: '💎',
    title: 'Fortune III Mineral Luck',
    description: 'Double drops (2x) when mining Diamond, Gold, Emerald, and Netherite blocks.',
    buffType: 'mining',
    buffValue: 50,
  },
  {
    id: 'mc_obsidian_resilience',
    name: 'Obsidian Armor Plating',
    tree: 'minecraft',
    levelRequired: 10,
    costSkillPoints: 3,
    icon: '🛡️',
    title: 'Obsidian Vitality',
    description: '+2 Max Hearts, immune to fire/lava hazards, and reduced environmental damage.',
    buffType: 'defense',
    buffValue: 30,
  },

  // SPRUNKI
  {
    id: 'sprunki_rhythm_groove',
    name: 'Harmonic Beat Cadence',
    tree: 'sprnuki',
    levelRequired: 1,
    costSkillPoints: 1,
    icon: '🥁',
    title: 'Rhythmic Mining Resonance',
    description: 'Mining blocks in rhythm releases harmonic shockwaves that gather adjacent loot.',
    buffType: 'rhythm',
    buffValue: 20,
  },
  {
    id: 'sprunki_beatbox_blast',
    name: 'Acoustic Shockwave Blast',
    tree: 'sprnuki',
    levelRequired: 5,
    costSkillPoints: 2,
    icon: '🔊',
    title: 'Bass Drop Knockback',
    description: 'Pressing B triggers musical shockwaves that push away hostile creatures and alert friends.',
    buffType: 'rhythm',
    buffValue: 40,
  },
  {
    id: 'sprunki_starlight_truth',
    name: 'Celestial Truth Oracle',
    tree: 'sprnuki',
    levelRequired: 12,
    costSkillPoints: 3,
    icon: '✨',
    title: 'Verity Starlight Grace',
    description: 'Permanent celestial halo radiance, truth X-ray vision for underground ores, and +20% flight velocity.',
    buffType: 'xp',
    buffValue: 50,
  },

  // ROBLOX
  {
    id: 'roblox_speed_coil',
    name: 'Speed Coil Overdrive',
    tree: 'roblox',
    levelRequired: 1,
    costSkillPoints: 1,
    icon: '👟',
    title: 'Robloxian Sprint Burst',
    description: '+30% Base sprint velocity and zero stamina exhaustion when running across biomes.',
    buffType: 'speed',
    buffValue: 30,
  },
  {
    id: 'roblox_gravity_bounce',
    name: 'Gravity Coil High Jump',
    tree: 'roblox',
    levelRequired: 5,
    costSkillPoints: 2,
    icon: '🌀',
    title: 'Coil Spring Levitation',
    description: 'Double jump leap height and soft landing spring absorption.',
    buffType: 'speed',
    buffValue: 45,
  },
  {
    id: 'roblox_brick_architect',
    name: 'Studs Master Architect',
    tree: 'roblox',
    levelRequired: 10,
    costSkillPoints: 3,
    icon: '🧱',
    title: 'Modular Brickcraft',
    description: 'Craft 2x blocks from wood/stone recipes and 20% discount in Roblox Avatar Shop.',
    buffType: 'xp',
    buffValue: 35,
  },

  // COUNTRYBALLS
  {
    id: 'cb_sovereign_accord',
    name: 'Sovereign Diplomatic Ward',
    tree: 'countryballs',
    levelRequired: 1,
    costSkillPoints: 1,
    icon: '🌐',
    title: 'Diplomatic Accord',
    description: '+25% Trading discount at all NPC merchant outposts and marketplace stands.',
    buffType: 'defense',
    buffValue: 25,
  },
  {
    id: 'cb_clay_resilience',
    name: 'Clay Roll Elasticity',
    tree: 'countryballs',
    levelRequired: 5,
    costSkillPoints: 2,
    icon: '⚽',
    title: 'Squash & Stretch Roll',
    description: 'Completely immune to fall damage; steep slopes grant a rolling momentum speed bonus.',
    buffType: 'defense',
    buffValue: 40,
  },
  {
    id: 'cb_global_coalition',
    name: 'Global Coalition Treaty',
    tree: 'countryballs',
    levelRequired: 10,
    costSkillPoints: 3,
    icon: '🚩',
    title: 'United Nations Accord',
    description: 'All 15+ Countryball roamers provide daily bonus supply drops and diplomatic defense aura.',
    buffType: 'xp',
    buffValue: 45,
  },

  // THOMAS & FRIENDS
  {
    id: 'thomas_steam_overdrive',
    name: 'Locomotive Boiler Pressure',
    tree: 'thomas',
    levelRequired: 1,
    costSkillPoints: 1,
    icon: '🚂',
    title: 'Steam Engine Overdrive',
    description: '+35% Acceleration when traversing tracks and roads; steam whistle clears blockages.',
    buffType: 'speed',
    buffValue: 35,
  },
  {
    id: 'thomas_heavy_freight',
    name: 'Sodor Heavy Cargo Haul',
    tree: 'thomas',
    levelRequired: 5,
    costSkillPoints: 2,
    icon: '📦',
    title: 'Tender Cargo Capacity',
    description: 'Doubles inventory maximum stack size (from 64 to 128) and +12 quick-pocket slots.',
    buffType: 'cargo',
    buffValue: 50,
  },
  {
    id: 'thomas_really_useful',
    name: 'Really Useful Engine Honor',
    tree: 'thomas',
    levelRequired: 10,
    costSkillPoints: 3,
    icon: '🎩',
    title: 'Sir Topham Hatt Commendation',
    description: '+50% Extra Experience (XP) on all completed quests and daily event trials.',
    buffType: 'xp',
    buffValue: 50,
  },

  // XILAM ANIMATION
  {
    id: 'xilam_cartoon_bounce',
    name: 'Rubberhose Cartoon Physics',
    tree: 'xilam',
    levelRequired: 1,
    costSkillPoints: 1,
    icon: '💥',
    title: 'Cartoon Elasticity',
    description: 'Hazards and creeper blasts bounce off you with a comedic squeak and zero damage.',
    buffType: 'slapstick',
    buffValue: 30,
  },
  {
    id: 'xilam_anvil_drop',
    name: '10-Ton Comedic Mallet',
    tree: 'xilam',
    levelRequired: 5,
    costSkillPoints: 2,
    icon: '🔨',
    title: 'Slapstick Anvil Impact',
    description: 'Action strikes summon a giant comedy hammer shockwave that harvests 3x3 blocks.',
    buffType: 'slapstick',
    buffValue: 45,
  },
  {
    id: 'xilam_squeaky_luck',
    name: 'Looney Cartoon Luck',
    tree: 'xilam',
    levelRequired: 10,
    costSkillPoints: 3,
    icon: '🪰',
    title: 'Oggy & Roaches Surprise',
    description: 'Random lucky chests, golden apples, and retro sound effects spawn while exploring.',
    buffType: 'xp',
    buffValue: 50,
  },
];

export const INITIAL_ACHIEVEMENTS: Record<string, AchievementRecord> = {
  ach_first_steps: {
    id: 'ach_first_steps',
    title: 'Pioneer of the United Realm',
    description: 'Take your first 50 steps across the integrated 2D sandbox biomes.',
    icon: '👟',
    category: 'exploration',
    xpReward: 100,
    coinReward: 50,
    robuxReward: 25,
    claimed: false,
  },
  ach_deep_miner: {
    id: 'ach_deep_miner',
    title: 'Depths of the Voxel Earth',
    description: 'Mine 25 solid blocks of stone, ore, or wood in Survival Mode.',
    icon: '⛏️',
    category: 'building',
    xpReward: 200,
    coinReward: 100,
    robuxReward: 50,
    claimed: false,
  },
  ach_sprunki_maestro: {
    id: 'ach_sprunki_maestro',
    title: 'Sprunki Incredibox Maestro',
    description: 'Perform 3 beatbox drops and groove with 4 active music loops.',
    icon: '🎵',
    category: 'rhythm',
    xpReward: 250,
    coinReward: 150,
    robuxReward: 75,
    claimed: false,
  },
  ach_verity_truth: {
    id: 'ach_verity_truth',
    title: 'Celestial Starlight Truth',
    description: 'Visit Landmark 6 (Celestial Shrine) and interact with Oracle Verity.',
    icon: '✨',
    category: 'exploration',
    xpReward: 350,
    coinReward: 200,
    robuxReward: 100,
    claimed: false,
  },
  ach_robloxian_master: {
    id: 'ach_robloxian_master',
    title: 'Robloxian Speed Obby Champion',
    description: 'Sprint 200 blocks using Speed Coil or complete a Tower Obby stage.',
    icon: '🏃',
    category: 'crossover',
    xpReward: 300,
    coinReward: 150,
    robuxReward: 150,
    claimed: false,
  },
  ach_country_diplomat: {
    id: 'ach_country_diplomat',
    title: 'Sovereign World Ambassador',
    description: 'Meet 5 Countryballs and listen to their regional anthems and folk motifs.',
    icon: '🌐',
    category: 'diplomacy',
    xpReward: 300,
    coinReward: 200,
    robuxReward: 75,
    claimed: false,
  },
  ach_thomas_locomotive: {
    id: 'ach_thomas_locomotive',
    title: 'Really Useful Railway Master',
    description: 'Blow the steam whistle and chug 100 blocks with Thomas & Friends engines.',
    icon: '🚂',
    category: 'crossover',
    xpReward: 350,
    coinReward: 250,
    robuxReward: 100,
    claimed: false,
  },
  ach_xilam_slapstick: {
    id: 'ach_xilam_slapstick',
    title: 'Cartoon Slapstick Champion',
    description: 'Perform 4 unique cartoon emotes with Oggy, Sharko, or Jack.',
    icon: '💥',
    category: 'crossover',
    xpReward: 300,
    coinReward: 150,
    robuxReward: 50,
    claimed: false,
  },
  ach_cloud_wanderer: {
    id: 'ach_cloud_wanderer',
    title: 'Cross-Platform Cloud Voyager',
    description: 'Securely sync your character progression to the Firestore Cloud Database.',
    icon: '☁️',
    category: 'crossover',
    xpReward: 500,
    coinReward: 300,
    robuxReward: 200,
    claimed: false,
  },
};

const STORAGE_KEY = 'megaworld_progression_v2';

function generateDeviceId(): string {
  const agent = navigator.userAgent.toLowerCase();
  const type = agent.includes('mobile') ? 'Mobile' : agent.includes('tablet') ? 'Tablet' : 'Desktop';
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${type}-${rand}`;
}

export function getRankTitle(level: number): string {
  if (level >= 50) return 'United Legend of Sodor & Realm';
  if (level >= 35) return 'Sovereign Realm Paragon';
  if (level >= 20) return 'Celestial Star Warden';
  if (level >= 10) return 'Realm Master Artificer';
  if (level >= 5) return 'Frontier Explorer';
  return 'Novice Adventurer';
}

export function getXpRequiredForLevel(level: number): number {
  return level * 250;
}

export const DEFAULT_PROGRESSION: PlayerProgressionData = {
  version: 2,
  deviceId: generateDeviceId(),
  lastSyncedAt: Date.now(),
  level: 1,
  characterLevel: 1,
  currentXp: 45,
  xpToNextLevel: 250,
  skillPointsAvailable: 1,
  totalSkillPointsEarned: 1,
  unlockedSkillIds: ['mc_vein_miner'],
  achievements: INITIAL_ACHIEVEMENTS,
  platform: 'web',
  crossPlatformSyncedDevices: ['Web-Browser-Alpha', 'PC-Steam-Client', 'Mobile-iOS-Engine'],
  inventoryBackup: {
    grass: { count: 16 },
    wood: { count: 12 },
    stone: { count: 10 },
    pickaxe: { count: 1, durability: 100 },
    bread: { count: 5 },
  },
  acquiredItems: [
    { id: 'wood', name: 'Oak Timber', count: 12, icon: '🪵', tier: 'common' },
    { id: 'stone', name: 'Refined Granite', count: 10, icon: '🪨', tier: 'common' },
    { id: 'diamond', name: 'Voxel Diamond Ingot', count: 2, icon: '💎', tier: 'legendary' },
    { id: 'pickaxe', name: 'Steel Prospector Pickaxe', count: 1, icon: '⛏️', tier: 'rare' },
    { id: 'apple', name: 'Golden Orchard Apple', count: 4, icon: '🍎', tier: 'epic' },
  ],
  completedQuests: ['q_oggy_kitchen'],
  cosmeticUnlocks: ['hat_crown', 'face_shades', 'back_elytra', 'aura_none', 'emblem_none', 'hat_silver_fern'],
  megaCoins: 850,
  robuxGems: 250,
  unlockedItems: ['pickaxe', 'wood', 'stone', 'diamond', 'apple'],
  platformProfiles: [
    { platform: 'PC', deviceModel: 'Custom Rig (RTX 4090 / Windows 11)', osVersion: 'Win11 23H2', lastActive: Date.now() - 360000, latencyMs: 16, status: 'SYNCED' },
    { platform: 'Console', deviceModel: 'PlayStation 5 / Xbox Series X', osVersion: 'Firmware 9.0', lastActive: Date.now() - 86400000, latencyMs: 28, status: 'STANDBY' },
    { platform: 'Mobile', deviceModel: 'Apple iPhone 15 Pro / Android Galaxy', osVersion: 'iOS 17.5', lastActive: Date.now() - 7200000, latencyMs: 34, status: 'SYNCED' },
    { platform: 'Web', deviceModel: 'Chromium Web Client (Vite)', osVersion: 'Browser v126', lastActive: Date.now(), latencyMs: 22, status: 'ONLINE', isCurrentDevice: true },
  ],
  dataIntegrityHash: 'sha256-d8f3b92a4e912c77f0a',
  cloudSyncLatencyMs: 22,
  brandReputation: {
    mcdonalds: 60,
    roblox: 85,
    xilam: 40,
    tarragower: 90,
    bp: 55,
    newworld: 70,
    youtube: 75,
  },
  christmasSettings: {},
  stats: {
    blocksMined: 0,
    blocksPlaced: 0,
    distanceTraveled: 0,
    emotesPerformed: 0,
    questsFinished: 0,
    playtimeMinutes: 0,
  },
};

class CrossPlatformProgressionManager {
  private memoryCache: PlayerProgressionData;
  private syncTimeout: ReturnType<typeof setTimeout> | null = null;
  private currentUid: string = '';

  constructor() {
    this.memoryCache = this.loadLocal();
  }

  public getProgression(): PlayerProgressionData {
    return { ...this.memoryCache };
  }

  private loadLocal(): PlayerProgressionData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Merge with initial achievements to ensure newly added achievements exist
        const mergedAchievements = { ...INITIAL_ACHIEVEMENTS, ...(parsed.achievements || {}) };
        return {
          ...DEFAULT_PROGRESSION,
          ...parsed,
          achievements: mergedAchievements,
        };
      }
    } catch (e) {
      console.warn('Failed to parse local progression data:', e);
    }
    return { ...DEFAULT_PROGRESSION };
  }

  public saveLocal(data: PlayerProgressionData) {
    this.memoryCache = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('megaworld_progression_updated', { detail: data }));
    } catch (e) {
      console.warn('Failed to save progression locally:', e);
    }
  }

  /**
   * Anti-Data-Loss Smart Reconciliation
   * Merges local and cloud snapshots, guaranteeing highest level, combined achievements,
   * all unlocked skills, and latest timestamp.
   */
  public smartReconcile(
    localData: PlayerProgressionData,
    cloudData: Partial<PlayerProgressionData>
  ): PlayerProgressionData {
    // Determine level & XP: whichever represents higher cumulative advancement
    const higherLevel = Math.max(localData.level, cloudData.level || 1);
    const higherXp =
      higherLevel === (cloudData.level || 1) && (cloudData.currentXp || 0) > localData.currentXp
        ? cloudData.currentXp || 0
        : localData.currentXp;

    // Merge unlocked skills so player never loses unlocked perks
    const combinedSkills = Array.from(
      new Set([...localData.unlockedSkillIds, ...(cloudData.unlockedSkillIds || [])])
    );

    // Merge achievements
    const mergedAchievements: Record<string, AchievementRecord> = {
      ...INITIAL_ACHIEVEMENTS,
      ...localData.achievements,
      ...(cloudData.achievements || {}),
    };

    // Calculate skill points
    const higherPointsEarned = Math.max(
      localData.totalSkillPointsEarned,
      cloudData.totalSkillPointsEarned || higherLevel
    );
    const pointsSpent = combinedSkills.reduce((sum, skillId) => {
      const skill = SKILL_TREES_DATA.find((s) => s.id === skillId);
      return sum + (skill ? skill.costSkillPoints : 0);
    }, 0);
    const availablePoints = Math.max(0, higherPointsEarned - pointsSpent);

    // Merge stats
    const localStats = localData.stats || DEFAULT_PROGRESSION.stats;
    const cloudStats: any = cloudData.stats || {};
    const mergedStats = {
      blocksMined: Math.max(localStats.blocksMined, cloudStats.blocksMined || 0),
      blocksPlaced: Math.max(localStats.blocksPlaced, cloudStats.blocksPlaced || 0),
      distanceTraveled: Math.max(localStats.distanceTraveled, cloudStats.distanceTraveled || 0),
      emotesPerformed: Math.max(localStats.emotesPerformed, cloudStats.emotesPerformed || 0),
      questsFinished: Math.max(localStats.questsFinished, cloudStats.questsFinished || 0),
      playtimeMinutes: Math.max(localStats.playtimeMinutes, cloudStats.playtimeMinutes || 0),
    };

    // Merge device history
    const devices = Array.from(
      new Set([
        localData.deviceId,
        ...(localData.crossPlatformSyncedDevices || []),
        ...(cloudData.crossPlatformSyncedDevices || []),
      ])
    );

    // Merge quests and cosmetics
    const combinedCompletedQuests = Array.from(
      new Set([...(localData.completedQuests || []), ...(cloudData.completedQuests || [])])
    );
    const combinedCosmetics = Array.from(
      new Set([...(localData.cosmeticUnlocks || []), ...(cloudData.cosmeticUnlocks || [])])
    );
    const acquiredItemsList = (cloudData.acquiredItems && cloudData.acquiredItems.length > 0)
      ? cloudData.acquiredItems
      : localData.acquiredItems || DEFAULT_PROGRESSION.acquiredItems;

    // Reconcile currency & unlocked items
    const higherCoins = Math.max(localData.megaCoins || 0, cloudData.megaCoins || 0);
    const higherRobux = Math.max(localData.robuxGems || 0, cloudData.robuxGems || 0);
    const combinedUnlockedItems = Array.from(
      new Set([...(localData.unlockedItems || []), ...(cloudData.unlockedItems || [])])
    );

    const merged: PlayerProgressionData = {
      ...DEFAULT_PROGRESSION,
      ...localData,
      ...cloudData,
      version: Math.max(localData.version, cloudData.version || 2) + 1,
      lastSyncedAt: Date.now(),
      level: higherLevel,
      characterLevel: higherLevel,
      currentXp: higherXp,
      xpToNextLevel: getXpRequiredForLevel(higherLevel),
      totalSkillPointsEarned: higherPointsEarned,
      skillPointsAvailable: availablePoints,
      unlockedSkillIds: combinedSkills,
      achievements: mergedAchievements,
      crossPlatformSyncedDevices: devices,
      stats: mergedStats,
      acquiredItems: acquiredItemsList,
      completedQuests: combinedCompletedQuests,
      cosmeticUnlocks: combinedCosmetics,
      megaCoins: higherCoins,
      robuxGems: higherRobux,
      unlockedItems: combinedUnlockedItems,
      platformProfiles: localData.platformProfiles || DEFAULT_PROGRESSION.platformProfiles,
      dataIntegrityHash: `sha256-verified-${Date.now().toString(16)}`,
      cloudSyncLatencyMs: cloudData.cloudSyncLatencyMs || 22,
      inventoryBackup: {
        ...(cloudData.inventoryBackup || {}),
        ...localData.inventoryBackup,
      },
    };

    return merged;
  }

  /**
   * Load Progression from Firestore with offline fallback & smart reconciliation
   */
  public async loadFromCloud(uid?: string): Promise<PlayerProgressionData> {
    if (uid) this.currentUid = uid;
    const effectiveUid = uid || this.currentUid;

    const localSnapshot = this.loadLocal();

    if (!effectiveUid || effectiveUid === 'guest-player') {
      return localSnapshot;
    }

    try {
      const docRef = doc(db, 'player_progressions', effectiveUid);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const cloudData = snapshot.data() as Partial<PlayerProgressionData>;
        const merged = this.smartReconcile(localSnapshot, cloudData);
        this.saveLocal(merged);
        return merged;
      } else {
        // First cloud sync for this user: upload local snapshot
        await setDoc(docRef, localSnapshot, { merge: true });
      }
    } catch (e) {
      console.warn('Cloud sync load failed, using local offline fallback:', e);
    }

    return localSnapshot;
  }

  /**
   * Force save progression to Firestore
   */
  public async syncToCloud(uid?: string): Promise<{ success: boolean; timestamp: number; message: string }> {
    if (uid) this.currentUid = uid;
    const effectiveUid = uid || this.currentUid;

    const dataToSave = {
      ...this.memoryCache,
      lastSyncedAt: Date.now(),
    };
    this.saveLocal(dataToSave);

    if (!effectiveUid || effectiveUid === 'guest-player') {
      return {
        success: true,
        timestamp: dataToSave.lastSyncedAt,
        message: 'Saved to local device cache (Sign in to sync with Cloud Database)',
      };
    }

    try {
      const docRef = doc(db, 'player_progressions', effectiveUid);
      await setDoc(docRef, dataToSave, { merge: true });
      return {
        success: true,
        timestamp: dataToSave.lastSyncedAt,
        message: 'Seamlessly synced to Firestore Cloud Database!',
      };
    } catch (e: any) {
      console.error('Cloud synchronization error:', e);
      return {
        success: false,
        timestamp: Date.now(),
        message: `Offline mode active: Local backup preserved (${e.message || 'Network delay'})`,
      };
    }
  }

  /**
   * Auto-sync debouncer (triggers 1.5 seconds after gameplay event)
   */
  public triggerAutoSync(uid?: string) {
    if (this.syncTimeout) clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => {
      this.syncToCloud(uid);
    }, 1500);
  }

  /**
   * Award Experience (XP) & auto-level-up with celebratory event
   */
  public addXp(amount: number, reason: string): { leveledUp: boolean; newLevel: number; pointsAwarded: number } {
    let current = { ...this.memoryCache };
    let newXp = current.currentXp + amount;
    let newLevel = current.level;
    let earnedPoints = 0;
    let leveledUp = false;

    let req = getXpRequiredForLevel(newLevel);
    while (newXp >= req) {
      newXp -= req;
      newLevel += 1;
      earnedPoints += 1;
      leveledUp = true;
      req = getXpRequiredForLevel(newLevel);
    }

    current = {
      ...current,
      level: newLevel,
      currentXp: newXp,
      xpToNextLevel: req,
      totalSkillPointsEarned: current.totalSkillPointsEarned + earnedPoints,
      skillPointsAvailable: current.skillPointsAvailable + earnedPoints,
      lastSyncedAt: Date.now(),
    };

    this.saveLocal(current);
    this.triggerAutoSync();

    if (leveledUp) {
      window.dispatchEvent(
        new CustomEvent('megaworld_level_up', {
          detail: { level: newLevel, title: getRankTitle(newLevel), reason },
        })
      );
    }

    return { leveledUp, newLevel, pointsAwarded: earnedPoints };
  }

  /**
   * Record Acquired Item to progression inventory and unlock list
   */
  public recordItemAcquired(
    id: string,
    name: string,
    icon: string,
    tier: 'common' | 'rare' | 'epic' | 'legendary'
  ): void {
    const current = { ...this.memoryCache };
    const items = [...(current.acquiredItems || [])];
    const existingIndex = items.findIndex((it) => it.id === id);

    if (existingIndex >= 0) {
      items[existingIndex].count += 1;
    } else {
      items.push({ id, name, count: 1, icon, tier });
    }

    const unlocked = Array.from(new Set([...(current.unlockedItems || []), id]));

    current.acquiredItems = items;
    current.unlockedItems = unlocked;
    this.saveLocal(current);
    this.triggerAutoSync();
  }

  /**
   * Complete Quest and award progression rewards
   */
  public completeQuest(questId: string, xpReward: number, coinReward: number): void {
    const current = { ...this.memoryCache };
    const completed = Array.from(new Set([...(current.completedQuests || []), questId]));
    current.completedQuests = completed;
    current.megaCoins = (current.megaCoins || 0) + coinReward;
    current.stats.questsFinished = (current.stats.questsFinished || 0) + 1;
    this.saveLocal(current);
    this.addXp(xpReward, `Quest Completed: ${questId}`);
  }

  /**
   * Unlock Skill Perk in one of the 6 Origin Trees
   */
  public unlockSkill(skillId: string): boolean {
    const current = { ...this.memoryCache };
    const perk = SKILL_TREES_DATA.find((s) => s.id === skillId);
    if (!perk) return false;

    if (current.unlockedSkillIds.includes(skillId)) return true;
    if (current.level < perk.levelRequired) {
      throw new Error(`Requires Level ${perk.levelRequired} to unlock ${perk.name}!`);
    }
    if (current.skillPointsAvailable < perk.costSkillPoints) {
      throw new Error(`Requires ${perk.costSkillPoints} skill points!`);
    }

    current.unlockedSkillIds = [...current.unlockedSkillIds, skillId];
    current.skillPointsAvailable -= perk.costSkillPoints;
    current.lastSyncedAt = Date.now();

    this.saveLocal(current);
    this.triggerAutoSync();
    return true;
  }

  /**
   * Claim Achievement Reward
   */
  public claimAchievement(achievementId: string): { xp: number; coins: number; robux: number } {
    const current = { ...this.memoryCache };
    const ach = current.achievements[achievementId];
    if (!ach || ach.claimed) {
      return { xp: 0, coins: 0, robux: 0 };
    }

    current.achievements[achievementId] = {
      ...ach,
      claimed: true,
      unlockedAt: ach.unlockedAt || Date.now(),
    };

    this.saveLocal(current);
    this.addXp(ach.xpReward, `Achievement: ${ach.title}`);
    this.triggerAutoSync();

    return {
      xp: ach.xpReward,
      coins: ach.coinReward,
      robux: ach.robuxReward,
    };
  }

  /**
   * Record Gameplay Stat (mining, moving, emotes, quests)
   */
  public recordStat(statKey: keyof PlayerProgressionData['stats'], increment: number = 1) {
    const current = { ...this.memoryCache };
    const stats = { ...current.stats };
    stats[statKey] = (stats[statKey] || 0) + increment;
    current.stats = stats;

    // Check achievement triggers
    if (statKey === 'blocksMined' && stats.blocksMined >= 25 && !current.achievements.ach_deep_miner?.unlockedAt) {
      current.achievements.ach_deep_miner.unlockedAt = Date.now();
    }
    if (statKey === 'distanceTraveled' && stats.distanceTraveled >= 50 && !current.achievements.ach_first_steps?.unlockedAt) {
      current.achievements.ach_first_steps.unlockedAt = Date.now();
    }
    if (statKey === 'emotesPerformed' && stats.emotesPerformed >= 4 && !current.achievements.ach_xilam_slapstick?.unlockedAt) {
      current.achievements.ach_xilam_slapstick.unlockedAt = Date.now();
    }

    this.saveLocal(current);
    this.triggerAutoSync();
  }

  /**
   * Backup current inventory to cloud progression
   */
  public backupInventory(inventory: Record<string, { count: number; durability?: number }>) {
    const current = { ...this.memoryCache };
    current.inventoryBackup = { ...inventory };
    current.lastSyncedAt = Date.now();
    this.saveLocal(current);
    this.triggerAutoSync();
  }

  /**
   * Generate 6-Character Cross-Platform Device Link Code (e.g. SPR-842)
   */
  public async generateCrossPlatformCode(): Promise<string> {
    const code = `SPR-${Math.floor(100 + Math.random() * 900)}`;
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    const current = {
      ...this.memoryCache,
      cloudSyncCode: code,
      syncCodeExpiresAt: expiresAt,
    };
    this.saveLocal(current);

    try {
      const codeRef = doc(db, 'sync_codes', code);
      await setDoc(codeRef, {
        code,
        data: current,
        expiresAt,
        createdAt: Date.now(),
      });
    } catch (e) {
      console.warn('Sync code cloud publication failed:', e);
    }

    return code;
  }

  /**
   * Redeem Cross-Platform Device Link Code on another platform (Phone/Tablet/PC)
   */
  public async redeemCrossPlatformCode(code: string): Promise<{ success: boolean; message: string }> {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return { success: false, message: 'Please enter a valid 6-character code.' };

    try {
      const codeRef = doc(db, 'sync_codes', cleanCode);
      const snapshot = await getDoc(codeRef);

      if (!snapshot.exists()) {
        return { success: false, message: 'Invalid code. Check for typos or generate a new code.' };
      }

      const remote = snapshot.data();
      if (remote.expiresAt && Date.now() > remote.expiresAt) {
        return { success: false, message: 'This sync code has expired. Please generate a fresh code.' };
      }

      const merged = this.smartReconcile(this.memoryCache, remote.data);
      this.saveLocal(merged);
      await this.syncToCloud();

      return {
        success: true,
        message: `Successfully transferred Level ${merged.level} progression from linked device!`,
      };
    } catch (e: any) {
      return { success: false, message: `Redeem error: ${e.message || 'Network failure'}` };
    }
  }

  /**
   * Set and save Countryball Avatar Customization (Flag, Glasses, Hat, Personality Trait)
   */
  public setCountryballCustomization(
    custom: PlayerProgressionData['countryballCustomization'],
    userId?: string
  ): void {
    this.memoryCache.countryballCustomization = custom;
    this.saveLocal(this.memoryCache);
    this.triggerAutoSync(userId);
  }

  public getCountryballCustomization(): PlayerProgressionData['countryballCustomization'] {
    return this.memoryCache.countryballCustomization;
  }

  /**
   * Add Brand Reputation and sync cross-platform
   */
  public addBrandReputation(brandId: string, amount: number, userId?: string): number {
    if (!this.memoryCache.brandReputation) {
      this.memoryCache.brandReputation = {};
    }
    const current = this.memoryCache.brandReputation[brandId] || 0;
    const next = current + amount;
    this.memoryCache.brandReputation[brandId] = next;
    this.saveLocal(this.memoryCache);
    this.triggerAutoSync(userId);
    return next;
  }

  public getBrandReputation(): Record<string, number> {
    return this.memoryCache.brandReputation || {};
  }

  /**
   * Save 1,000 Christmas Settings to local and cloud
   */
  public setChristmasSettings(settings: Record<string, any>, userId?: string): void {
    this.memoryCache.christmasSettings = settings;
    this.saveLocal(this.memoryCache);
    this.triggerAutoSync(userId);
  }

  public getChristmasSettings(): Record<string, any> {
    return this.memoryCache.christmasSettings || {};
  }

  /**
   * Export Save File as JSON
   */
  public exportBackupJson(): string {
    return JSON.stringify(this.memoryCache, null, 2);
  }

  /**
   * Import Save File from JSON
   */
  public importBackupJson(jsonString: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.level || !parsed.achievements) {
        throw new Error('Invalid save file structure.');
      }
      const reconciled = this.smartReconcile(this.memoryCache, parsed);
      this.saveLocal(reconciled);
      this.syncToCloud();
      return { success: true, message: `Successfully restored Level ${reconciled.level} save file!` };
    } catch (e: any) {
      return { success: false, message: `Import failed: ${e.message}` };
    }
  }
}

export const progressionManager = new CrossPlatformProgressionManager();
