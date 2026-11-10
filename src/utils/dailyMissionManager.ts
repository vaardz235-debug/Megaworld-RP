/**
 * Daily Mission System Manager
 * 'United Games and Apps of Sprunki Thomas and Friends' RPG
 * Handles randomized daily tasks, mining/combat action tracking, streak rewards, and cloud persistence.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { avatarManager } from './avatarManager';
import { progressionManager } from './progressionManager';
import { audioEngine } from './audioEngine';

export type MissionCategory = 'mining' | 'combat' | 'crafting' | 'exploration' | 'brand';
export type MissionDifficulty = 'Common' | 'Rare' | 'Epic' | 'Legendary';
export type MissionTargetType = 
  | 'mine_diamond'
  | 'mine_gold'
  | 'mine_obsidian'
  | 'mine_amethyst'
  | 'chop_wood'
  | 'mine_stone'
  | 'defeat_zombie'
  | 'defeat_creeper'
  | 'defeat_mob'
  | 'craft_gear'
  | 'travel_distance'
  | 'drink_shake'
  | 'play_beatbox'
  | 'perform_emote'
  | 'trade_item';

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  category: MissionCategory;
  brand: 'Minecraft' | 'Roblox' | 'Sprunki' | 'McDonald\'s' | 'Countryballs' | 'Universal';
  icon: string;
  targetType: MissionTargetType;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  claimed: boolean;
  rewardCoins: number;
  rewardRobux: number;
  rewardXp: number;
  difficulty: MissionDifficulty;
  pinnedInHud: boolean;
}

export interface DailyMissionState {
  dateKey: string; // YYYY-MM-DD
  missions: DailyMission[];
  rerollsAvailable: number;
  lastLoginDate: string;
  streakDays: number;
  streakClaimedToday: boolean;
  allClearBonusClaimed: boolean;
  totalMissionsCompleted: number;
}

const STORAGE_KEY = 'megaworld_daily_missions_v1';

// Comprehensive pool of randomized daily mission blueprints
export const MISSION_TEMPLATES: Array<Omit<DailyMission, 'id' | 'currentCount' | 'completed' | 'claimed' | 'pinnedInHud'>> = [
  // 1. MINING MISSIONS
  {
    title: 'Mine 50 Diamond Ore',
    description: 'Delve into subterranean cavern depths and excavate 50 pristine cyan diamond mineral blocks.',
    category: 'mining',
    brand: 'Minecraft',
    icon: '💎',
    targetType: 'mine_diamond',
    targetCount: 50,
    rewardCoins: 450,
    rewardRobux: 40,
    rewardXp: 500,
    difficulty: 'Epic',
  },
  {
    title: 'Excavate 35 Gold Ore',
    description: 'Prospect and quarry 35 glistening gold blocks to stock the treasury and forge golden apples.',
    category: 'mining',
    brand: 'Minecraft',
    icon: '🪙',
    targetType: 'mine_gold',
    targetCount: 35,
    rewardCoins: 350,
    rewardRobux: 25,
    rewardXp: 380,
    difficulty: 'Rare',
  },
  {
    title: 'Quarry 25 Hard Obsidian',
    description: 'Quench subterranean lava pools with water and chisel 25 indestructible volcanic obsidian blocks.',
    category: 'mining',
    brand: 'Minecraft',
    icon: '🟣',
    targetType: 'mine_obsidian',
    targetCount: 25,
    rewardCoins: 400,
    rewardRobux: 35,
    rewardXp: 420,
    difficulty: 'Epic',
  },
  {
    title: 'Harvest 20 Amethyst Geodes',
    description: 'Locate resonant celestial purple geode formations and extract 20 shimmering crystal shards.',
    category: 'mining',
    brand: 'Minecraft',
    icon: '🔮',
    targetType: 'mine_amethyst',
    targetCount: 20,
    rewardCoins: 320,
    rewardRobux: 20,
    rewardXp: 350,
    difficulty: 'Rare',
  },
  {
    title: 'Chop 40 Oak Wood Logs',
    description: 'Fell mature deciduous oak trees in the forest biome to secure lumber for shelters and tools.',
    category: 'mining',
    brand: 'Minecraft',
    icon: '🪵',
    targetType: 'chop_wood',
    targetCount: 40,
    rewardCoins: 250,
    rewardRobux: 15,
    rewardXp: 280,
    difficulty: 'Common',
  },
  {
    title: 'Mine 60 Cobblestone Blocks',
    description: 'Pickaxe and excavate 60 solid granite cobblestone blocks for guild castle fortifications.',
    category: 'mining',
    brand: 'Minecraft',
    icon: '🪨',
    targetType: 'mine_stone',
    targetCount: 60,
    rewardCoins: 220,
    rewardRobux: 10,
    rewardXp: 250,
    difficulty: 'Common',
  },

  // 2. COMBAT MISSIONS
  {
    title: 'Defeat 3 Minecraft Zombies',
    description: 'Slay 3 roaming undead zombies across desert dunes and midnight forest paths.',
    category: 'combat',
    brand: 'Minecraft',
    icon: '🧟',
    targetType: 'defeat_zombie',
    targetCount: 3,
    rewardCoins: 350,
    rewardRobux: 30,
    rewardXp: 400,
    difficulty: 'Rare',
  },
  {
    title: 'Slay 2 Creepers Before Explosion',
    description: 'Neutralize 2 hissing green creepers with swift sword strikes before they detonate.',
    category: 'combat',
    brand: 'Minecraft',
    icon: '💣',
    targetType: 'defeat_creeper',
    targetCount: 2,
    rewardCoins: 380,
    rewardRobux: 35,
    rewardXp: 450,
    difficulty: 'Epic',
  },
  {
    title: 'Vanquish 5 Multiverse Hostile Mobs',
    description: 'Engage and eliminate 5 roaming monsters or hostile raiders across any biome horizon.',
    category: 'combat',
    brand: 'Universal',
    icon: '⚔️',
    targetType: 'defeat_mob',
    targetCount: 5,
    rewardCoins: 420,
    rewardRobux: 35,
    rewardXp: 480,
    difficulty: 'Epic',
  },

  // 3. CRAFTING & GEAR MISSIONS
  {
    title: 'Forge 2 Brand Gear Items',
    description: 'Use the survival Crafting Panel to forge weapons, tools, or legendary crossover equipment.',
    category: 'crafting',
    brand: 'Universal',
    icon: '🛠️',
    targetType: 'craft_gear',
    targetCount: 2,
    rewardCoins: 300,
    rewardRobux: 25,
    rewardXp: 350,
    difficulty: 'Rare',
  },

  // 4. EXPLORATION & TRAVERSAL MISSIONS
  {
    title: 'Travel 250 World Coordinates',
    description: 'Sprint, hop, or fly across 250 horizontal blocks exploring diverse procedural biomes.',
    category: 'exploration',
    brand: 'Minecraft',
    icon: '🧭',
    targetType: 'travel_distance',
    targetCount: 250,
    rewardCoins: 280,
    rewardRobux: 20,
    rewardXp: 320,
    difficulty: 'Common',
  },

  // 5. BRAND SPECIALTY MISSIONS
  {
    title: 'Consume a Cosmic Grimace Shake',
    description: 'Sip the mystical cosmic purple elixir to restore full vitality and activate cosmic speed.',
    category: 'brand',
    brand: 'McDonald\'s',
    icon: '🥤',
    targetType: 'drink_shake',
    targetCount: 1,
    rewardCoins: 260,
    rewardRobux: 20,
    rewardXp: 300,
    difficulty: 'Common',
  },
  {
    title: 'Drop 2 Sprunki Beatbox Grooves',
    description: 'Press [B] to trigger 2 high-energy 128 BPM musical beatbox rhythm drops.',
    category: 'brand',
    brand: 'Sprunki',
    icon: '🎵',
    targetType: 'play_beatbox',
    targetCount: 2,
    rewardCoins: 220,
    rewardRobux: 15,
    rewardXp: 260,
    difficulty: 'Common',
  },
  {
    title: 'Perform 3 Quick Emotes',
    description: 'Express yourself with 3 character emotes, dances, or soundboard flourishes.',
    category: 'brand',
    brand: 'Roblox',
    icon: '🎭',
    targetType: 'perform_emote',
    targetCount: 3,
    rewardCoins: 200,
    rewardRobux: 15,
    rewardXp: 240,
    difficulty: 'Common',
  },
];

// Streak Calendar Rewards for 7 Days
export const STREAK_REWARDS = [
  { day: 1, coins: 150, robux: 10, xp: 200, icon: '🪙', label: '150 Coins' },
  { day: 2, coins: 250, robux: 15, xp: 300, icon: '🪙', label: '250 Coins + 15 Robux' },
  { day: 3, coins: 350, robux: 25, xp: 400, icon: '📦', label: '350 Coins + Bronze Crate' },
  { day: 4, coins: 450, robux: 35, xp: 500, icon: '🪙', label: '450 Coins + 35 Robux' },
  { day: 5, coins: 600, robux: 50, xp: 650, icon: '🎁', label: '600 Coins + Silver Crate' },
  { day: 6, coins: 750, robux: 60, xp: 800, icon: '🪙', label: '750 Coins + 60 Robux' },
  { day: 7, coins: 1200, robux: 120, xp: 1500, icon: '👑', label: '1,200 Coins + 120 Robux & Gold Crate!' },
];

class DailyMissionManager {
  private state: DailyMissionState;
  private isLoadedFromCloud: boolean = false;

  constructor() {
    this.state = this.loadLocal();
    this.checkAndRefreshForDate();
  }

  private getTodayDateKey(): string {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  private getYesterdayDateKey(): string {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }

  // Simple pseudo-random hash from string seed
  private seededRandom(seedStr: string): number {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  }

  private generateMissionsForDate(dateKey: string): DailyMission[] {
    const selected: DailyMission[] = [];
    const pool = [...MISSION_TEMPLATES];

    // Guarantee: 1 Mining, 1 Combat, 1 Crafting/Brand, 1 Exploration/Other
    const miningTemplates = pool.filter(m => m.category === 'mining');
    const combatTemplates = pool.filter(m => m.category === 'combat');
    const otherTemplates = pool.filter(m => m.category !== 'mining' && m.category !== 'combat');

    // Pick 1 guaranteed mining (e.g., diamond or gold)
    const miningIdx = Math.floor(this.seededRandom(dateKey + '_mine') * miningTemplates.length);
    const m1 = miningTemplates[miningIdx] || miningTemplates[0];

    // Pick 1 guaranteed combat (e.g., zombie or mob)
    const combatIdx = Math.floor(this.seededRandom(dateKey + '_combat') * combatTemplates.length);
    const m2 = combatTemplates[combatIdx] || combatTemplates[0];

    // Pick 2 additional diverse missions
    const shuffledOthers = [...otherTemplates].sort((a, b) => 
      this.seededRandom(dateKey + a.title) - this.seededRandom(dateKey + b.title)
    );
    const m3 = shuffledOthers[0] || pool[0];
    const m4 = shuffledOthers[1] || pool[1];

    const chosen = [m1, m2, m3, m4];
    chosen.forEach((tmpl, idx) => {
      selected.push({
        ...tmpl,
        id: `mission_${dateKey}_${idx}_${tmpl.targetType}`,
        currentCount: 0,
        completed: false,
        claimed: false,
        pinnedInHud: idx < 2, // Default top 2 pinned
      });
    });

    return selected;
  }

  private checkAndRefreshForDate() {
    const today = this.getTodayDateKey();
    const yesterday = this.getYesterdayDateKey();

    if (this.state.dateKey !== today) {
      // Calculate streak
      let newStreak = this.state.streakDays;
      if (this.state.lastLoginDate === yesterday) {
        // Consecutive day
        newStreak = Math.min(7, newStreak + 1);
      } else if (this.state.lastLoginDate !== today) {
        // Missed day or first day
        newStreak = 1;
      }

      this.state = {
        dateKey: today,
        missions: this.generateMissionsForDate(today),
        rerollsAvailable: 1, // 1 free reroll daily
        lastLoginDate: today,
        streakDays: newStreak,
        streakClaimedToday: false,
        allClearBonusClaimed: false,
        totalMissionsCompleted: this.state.totalMissionsCompleted || 0,
      };
      this.saveLocal();
    }
  }

  private loadLocal(): DailyMissionState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.dateKey && Array.isArray(parsed.missions)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse local daily missions:', e);
    }

    const today = this.getTodayDateKey();
    return {
      dateKey: today,
      missions: this.generateMissionsForDate(today),
      rerollsAvailable: 1,
      lastLoginDate: today,
      streakDays: 1,
      streakClaimedToday: false,
      allClearBonusClaimed: false,
      totalMissionsCompleted: 0,
    };
  }

  private saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      window.dispatchEvent(new CustomEvent('megaworld_daily_missions_updated', { detail: this.state }));
    } catch (e) {
      console.warn('Failed to save daily missions locally:', e);
    }
  }

  public getState(): DailyMissionState {
    this.checkAndRefreshForDate();
    return { ...this.state };
  }

  public getMissions(): DailyMission[] {
    this.checkAndRefreshForDate();
    return [...this.state.missions];
  }

  public getPinnedMissions(): DailyMission[] {
    return this.getMissions().filter(m => m.pinnedInHud && !m.claimed);
  }

  public togglePinMission(missionId: string) {
    this.state.missions = this.state.missions.map(m => 
      m.id === missionId ? { ...m, pinnedInHud: !m.pinnedInHud } : m
    );
    this.saveLocal();
  }

  /**
   * Primary action recorder invoked by GameWorld, CraftingPanel, etc.
   * e.g. recordAction('mine_diamond', 1) or recordAction('defeat_zombie', 1)
   */
  public recordAction(targetType: MissionTargetType, amount: number = 1): { updated: boolean; completedAny: boolean; completedMission?: DailyMission } {
    this.checkAndRefreshForDate();
    let updated = false;
    let completedAny = false;
    let completedMission: DailyMission | undefined = undefined;

    this.state.missions = this.state.missions.map(m => {
      // Direct match or 'defeat_mob' matches any mob defeat
      const isMatch = m.targetType === targetType || 
        (m.targetType === 'defeat_mob' && (targetType === 'defeat_zombie' || targetType === 'defeat_creeper' || targetType === 'defeat_mob'));

      if (isMatch && !m.completed) {
        const nextCount = Math.min(m.targetCount, m.currentCount + amount);
        const justFinished = nextCount >= m.targetCount && !m.completed;
        if (justFinished) {
          completedAny = true;
          completedMission = { ...m, currentCount: nextCount, completed: true };
        }
        updated = true;
        return {
          ...m,
          currentCount: nextCount,
          completed: nextCount >= m.targetCount,
        };
      }
      return m;
    });

    if (updated) {
      this.saveLocal();
      if (completedAny && completedMission) {
        audioEngine.playMinecraftSound('levelup');
        window.dispatchEvent(new CustomEvent('megaworld_mission_completed', { detail: completedMission }));
      }
    }

    return { updated, completedAny, completedMission };
  }

  /**
   * Claim reward for a completed mission
   */
  public async claimReward(missionId: string, userUid?: string): Promise<{ success: boolean; coinsAwarded: number; robuxAwarded: number; xpAwarded: number }> {
    const mission = this.state.missions.find(m => m.id === missionId);
    if (!mission || !mission.completed || mission.claimed) {
      return { success: false, coinsAwarded: 0, robuxAwarded: 0, xpAwarded: 0 };
    }

    // Mark claimed
    mission.claimed = true;
    this.state.totalMissionsCompleted = (this.state.totalMissionsCompleted || 0) + 1;

    // Distribute currency rewards into avatarManager
    const cust = avatarManager.getLocalCustomization();
    const updatedCoins = cust.coins + mission.rewardCoins;
    const updatedRobux = cust.robux + mission.rewardRobux;
    const updatedData = {
      ...cust,
      coins: updatedCoins,
      robux: updatedRobux,
    };
    avatarManager.saveLocalCustomization(updatedData);
    if (userUid && userUid !== 'guest-player') {
      avatarManager.saveToCloud(userUid, updatedData);
    }

    // Award XP to progressionManager
    progressionManager.addXp(mission.rewardXp, `Daily Mission: ${mission.title}`);

    // Audio cue
    audioEngine.playMinecraftSound('orb');

    this.saveLocal();
    if (userUid) {
      await this.syncToCloud(userUid);
    }

    return {
      success: true,
      coinsAwarded: mission.rewardCoins,
      robuxAwarded: mission.rewardRobux,
      xpAwarded: mission.rewardXp,
    };
  }

  /**
   * Claim all-clear completion bonus when all 4 daily missions are completed
   */
  public async claimAllClearBonus(userUid?: string): Promise<{ success: boolean; coinsAwarded: number; robuxAwarded: number; xpAwarded: number }> {
    const allDone = this.state.missions.every(m => m.completed);
    if (!allDone || this.state.allClearBonusClaimed) {
      return { success: false, coinsAwarded: 0, robuxAwarded: 0, xpAwarded: 0 };
    }

    this.state.allClearBonusClaimed = true;
    const bonusCoins = 600;
    const bonusRobux = 60;
    const bonusXp = 1000;

    const cust = avatarManager.getLocalCustomization();
    const updatedData = {
      ...cust,
      coins: cust.coins + bonusCoins,
      robux: cust.robux + bonusRobux,
    };
    avatarManager.saveLocalCustomization(updatedData);
    if (userUid && userUid !== 'guest-player') {
      avatarManager.saveToCloud(userUid, updatedData);
    }

    progressionManager.addXp(bonusXp, 'Daily Missions All-Clear Bonus');
    audioEngine.playMinecraftSound('totem');

    this.saveLocal();
    if (userUid) {
      await this.syncToCloud(userUid);
    }

    return {
      success: true,
      coinsAwarded: bonusCoins,
      robuxAwarded: bonusRobux,
      xpAwarded: bonusXp,
    };
  }

  /**
   * Claim daily login streak reward
   */
  public async claimStreakReward(userUid?: string): Promise<{ success: boolean; reward?: typeof STREAK_REWARDS[0] }> {
    if (this.state.streakClaimedToday) {
      return { success: false };
    }

    const currentDayIdx = Math.max(0, Math.min(6, this.state.streakDays - 1));
    const reward = STREAK_REWARDS[currentDayIdx];

    this.state.streakClaimedToday = true;

    const cust = avatarManager.getLocalCustomization();
    const updatedData = {
      ...cust,
      coins: cust.coins + reward.coins,
      robux: cust.robux + reward.robux,
    };
    avatarManager.saveLocalCustomization(updatedData);
    if (userUid && userUid !== 'guest-player') {
      avatarManager.saveToCloud(userUid, updatedData);
    }

    progressionManager.addXp(reward.xp, `Day ${reward.day} Adventurer Streak Reward`);
    audioEngine.playMinecraftSound('levelup');

    this.saveLocal();
    if (userUid) {
      await this.syncToCloud(userUid);
    }

    return { success: true, reward };
  }

  /**
   * Free or purchased mission reroll
   */
  public rerollMission(missionId: string): boolean {
    if (this.state.rerollsAvailable <= 0) return false;
    const idx = this.state.missions.findIndex(m => m.id === missionId);
    if (idx === -1 || this.state.missions[idx].claimed) return false;

    // Pick an alternative template not currently active
    const activeTargetTypes = new Set(this.state.missions.map(m => m.targetType));
    const candidates = MISSION_TEMPLATES.filter(tmpl => !activeTargetTypes.has(tmpl.targetType));
    const replacement = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : MISSION_TEMPLATES[0];

    this.state.missions[idx] = {
      ...replacement,
      id: `mission_${this.state.dateKey}_${Date.now()}_${replacement.targetType}`,
      currentCount: 0,
      completed: false,
      claimed: false,
      pinnedInHud: true,
    };

    this.state.rerollsAvailable = Math.max(0, this.state.rerollsAvailable - 1);
    audioEngine.playMinecraftSound('click');
    this.saveLocal();
    return true;
  }

  /**
   * Time remaining until next daily reset (local midnight)
   */
  public getTimeUntilReset(): { hours: number; minutes: number; seconds: number; formatted: string } {
    const now = new Date();
    const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    const diffMs = Math.max(0, midnight.getTime() - now.getTime());

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      hours,
      minutes,
      seconds,
      formatted: `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`,
    };
  }

  /**
   * Sync with Firebase Firestore
   */
  public async syncToCloud(uid: string) {
    if (!uid || uid === 'guest-player') return;
    try {
      const ref = doc(db, 'daily_missions', uid);
      await setDoc(ref, {
        ...this.state,
        uid,
        updatedAt: Date.now(),
      }, { merge: true });
    } catch (e) {
      console.warn('Failed to sync daily missions to cloud:', e);
    }
  }

  public async loadFromCloud(uid: string): Promise<DailyMissionState> {
    if (!uid || uid === 'guest-player') return this.getState();
    try {
      const ref = doc(db, 'daily_missions', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const cloudData = snap.data() as DailyMissionState;
        const today = this.getTodayDateKey();
        if (cloudData.dateKey === today) {
          this.state = cloudData;
          this.saveLocal();
        }
      }
      this.isLoadedFromCloud = true;
    } catch (e) {
      console.warn('Failed to load daily missions from cloud:', e);
    }
    return this.getState();
  }
}

export const dailyMissionManager = new DailyMissionManager();
