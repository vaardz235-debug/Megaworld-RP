/**
 * Guilds & Factions System
 * Multi-faction allegiance, player-created guilds, guild leader controls (rules, recruitment, events),
 * faction perks, guild vaults, and custom guild-organized raids.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { audioEngine } from './audioEngine';

export interface FactionDef {
  id: string;
  name: string;
  brand: string;
  bannerGradient: string;
  accentColor: string;
  icon: string;
  description: string;
  passivePerkName: string;
  passivePerkDesc: string;
  exclusiveQuestId: string;
  exclusiveQuestTitle: string;
  exclusiveQuestReward: string;
  activePlayersCount: number;
}

export interface GuildMember {
  uid: string;
  name: string;
  role: 'Leader' | 'Officer' | 'Member' | 'Recruit';
  avatarType: string;
  avatarSubtype?: string;
  contributionXp: number;
  joinedAt: number;
  isOnline: boolean;
}

export interface GuildEvent {
  id: string;
  title: string;
  type: 'Raid' | 'Building Competition' | 'PvP Tournament' | 'Gathering Expedition';
  scheduledTime: string;
  rewardText: string;
  creatorName: string;
  voiceChannelFrequency: string; // e.g. "144.20 MHz"
  participants: string[];
}

export interface GuildDef {
  id: string;
  name: string;
  tag: string; // e.g. "[VOXEL]"
  factionId: string;
  leaderUid: string;
  leaderName: string;
  crestIcon: string;
  crestBg: string;
  description: string;
  motd: string; // Message of the day
  rules: string[];
  membersCount: number;
  maxMembers: number;
  members: GuildMember[];
  level: number;
  vaultCoins: number;
  vaultRobux: number;
  joinType: 'open' | 'invite_only' | 'closed';
  perksUnlocked: string[];
  organizedEvents: GuildEvent[];
  createdAt: number;
}

export const FACTIONS_LIST: FactionDef[] = [
  {
    id: 'builders_league',
    name: 'The Builders League',
    brand: 'Minecraft',
    bannerGradient: 'from-emerald-950 via-green-900 to-stone-900',
    accentColor: '#10b981',
    icon: '⛏️',
    description: 'The ancient guild of architects and Redstone artificers dedicated to constructing monumental voxel structures across 200 billion blocks.',
    passivePerkName: 'Master Artificer',
    passivePerkDesc: '+35% Mining and Digging Speed; 25% chance to duplicate placed or harvested blocks.',
    exclusiveQuestId: 'quest_fortify_bastion',
    exclusiveQuestTitle: 'Fortify the Nether Bastion Wall',
    exclusiveQuestReward: '1,200 Coins + 2 Netherite Ingots + Builder Trophy',
    activePlayersCount: 1420,
  },
  {
    id: 'bloxian_syndicate',
    name: 'Bloxian Syndicate',
    brand: 'Roblox',
    bannerGradient: 'from-cyan-950 via-blue-900 to-stone-900',
    accentColor: '#0ea5e9',
    icon: '⚡',
    description: 'Agile Obby speedrunners, sword duelist veterans, and high-stakes tycoon tycoons from the classic Crossroads.',
    passivePerkName: 'Stud Acceleration',
    passivePerkDesc: '+30% Movement Speed; +50% Jump Height; Fall damage reduced by 80%.',
    exclusiveQuestId: 'quest_crossroads_mastery',
    exclusiveQuestTitle: 'Conquer the 100-Block Sky Spire',
    exclusiveQuestReward: '600 R$ + Gravity Coil Jump Rig + Linked Sword Badge',
    activePlayersCount: 1850,
  },
  {
    id: 'united_nationballs',
    name: 'United Nationballs',
    brand: 'Countryballs',
    bannerGradient: 'from-sky-950 via-indigo-900 to-stone-900',
    accentColor: '#38bdf8',
    icon: '🌐',
    description: 'Sovereign diplomatic spheres upholding international treaties, oil trade routes, and space colonization programs.',
    passivePerkName: 'Sovereign Trade Pacts',
    passivePerkDesc: '+40% Market Trade Revenue; Knockback immunity; Bonus defensive fortification armor.',
    exclusiveQuestId: 'quest_neutral_zone',
    exclusiveQuestTitle: 'Demarcate the Neutral Oil Rig Territory',
    exclusiveQuestReward: '1,500 Coins + Polandball Space Pioneer Helmet',
    activePlayersCount: 980,
  },
  {
    id: 'vocal_harmony',
    name: 'Vocal Harmony Order',
    brand: 'Sprunki',
    bannerGradient: 'from-purple-950 via-fuchsia-900 to-stone-900',
    accentColor: '#a855f7',
    icon: '🎶',
    description: 'Master musicians and choral guardians harnessing rhythmic sound waves to repel void corruption and heal adventurers.',
    passivePerkName: 'Sonic Resonance Aura',
    passivePerkDesc: 'Continuous +12 HP/sec health regeneration when near allies or active Jukeboxes; Void immunity.',
    exclusiveQuestId: 'quest_cleanse_void',
    exclusiveQuestTitle: 'Purify the Phase 2 Void Corruption',
    exclusiveQuestReward: "1,000 Coins + Sprunki's Sword of Friendship + Music Disc 17",
    activePlayersCount: 1640,
  },
  {
    id: 'corporate_titans',
    name: 'Corporate Titans',
    brand: 'McDonald\'s & BP & New World',
    bannerGradient: 'from-amber-950 via-yellow-900 to-stone-900',
    accentColor: '#f59e0b',
    icon: '🍔',
    description: 'The industrial triumvirate of high-octane petroleum refineries, golden arches nutrition, and frontier supply chain supermarkets.',
    passivePerkName: 'Sustained Supply Line',
    passivePerkDesc: 'Hunger never depletes below 80%; Infinite smelting fuel; +50% coins earned from all activities.',
    exclusiveQuestId: 'quest_supply_hub',
    exclusiveQuestTitle: 'Establish the Multiverse Mega-Distribution Hub',
    exclusiveQuestReward: '1,800 Coins + Golden Arches Battle Spatula + New World Boots',
    activePlayersCount: 1220,
  },
  {
    id: 'streamer_network',
    name: 'Content Creator Network',
    brand: 'YouTube',
    bannerGradient: 'from-rose-950 via-red-900 to-stone-900',
    accentColor: '#f43f5e',
    icon: '🔴',
    description: 'Charismatic broadcasters, clip makers, and raid commanders streaming the 200 billion block multiverse live to millions.',
    passivePerkName: 'Viral Superchat Boost',
    passivePerkDesc: 'Double XP across all quests; Voice chat party members gain +15% attack damage and confetti auras.',
    exclusiveQuestId: 'quest_live_end_raid',
    exclusiveQuestTitle: 'Broadcast the End-Raid Live Stream',
    exclusiveQuestReward: '1,500 Coins + Diamond Play Button Aegis Shield',
    activePlayersCount: 2100,
  },
];

export const INITIAL_GUILDS: GuildDef[] = [
  {
    id: 'guild_voxel_vanguard',
    name: 'Voxel Vanguard',
    tag: 'VOXEL',
    factionId: 'builders_league',
    leaderUid: 'user_steve_prime',
    leaderName: 'Steve_ArchMaster',
    crestIcon: '🏰',
    crestBg: 'bg-emerald-600',
    description: 'Elite architects building high-altitude bastions, automated redstone monorails, and diamond fortresses.',
    motd: 'Weekend Netherite Bastion Raid scheduled this Saturday at 18:00 UTC! Bring obsidian!',
    rules: [
      '1. No griefing or unapproved block deconstruction in guild territories.',
      '2. Deposit 10% of harvested rare ores into the Guild Vault.',
      '3. Be active in Proximity Voice Chat during scheduled boss raids.',
      '4. Help recruits with tool crafting and survival gear.',
    ],
    membersCount: 38,
    maxMembers: 50,
    members: [
      {
        uid: 'user_steve_prime',
        name: 'Steve_ArchMaster',
        role: 'Leader',
        avatarType: 'minecraft',
        avatarSubtype: 'steve',
        contributionXp: 18500,
        joinedAt: Date.now() - 86400000 * 30,
        isOnline: true,
      },
      {
        uid: 'user_alex_scout',
        name: 'AlexSpelunker',
        role: 'Officer',
        avatarType: 'minecraft',
        avatarSubtype: 'alex',
        contributionXp: 12400,
        joinedAt: Date.now() - 86400000 * 25,
        isOnline: true,
      },
      {
        uid: 'user_warden_whisperer',
        name: 'DeepDarkMiner',
        role: 'Member',
        avatarType: 'minecraft',
        avatarSubtype: 'warden',
        contributionXp: 8200,
        joinedAt: Date.now() - 86400000 * 12,
        isOnline: false,
      },
    ],
    level: 7,
    vaultCoins: 48500,
    vaultRobux: 3200,
    joinType: 'open',
    perksUnlocked: ['Guild Hall Teleport', 'Shared Resource Bank', 'Faction XP Booster (+15%)'],
    organizedEvents: [
      {
        id: 'ge_bastion_raid',
        title: 'Weekly Netherite Citadel Guild Raid',
        type: 'Raid',
        scheduledTime: 'Saturday 18:00 UTC',
        rewardText: 'Split 10,000 Coins + 8 Netherite Ingots',
        creatorName: 'Steve_ArchMaster',
        voiceChannelFrequency: '144.20 MHz',
        participants: ['Steve_ArchMaster', 'AlexSpelunker', 'DeepDarkMiner'],
      },
    ],
    createdAt: Date.now() - 86400000 * 30,
  },
  {
    id: 'guild_blox_corsairs',
    name: 'Blox Fruit Corsairs',
    tag: 'BLOX',
    factionId: 'bloxian_syndicate',
    leaderUid: 'user_noob_king',
    leaderName: 'BloxianGeneral_Noob',
    crestIcon: '⚔️',
    crestBg: 'bg-cyan-600',
    description: 'Masters of the Linked Sword, Tower Obbies, and gravity coil aerial acrobatics.',
    motd: 'New members get free Bloxy Colas from officer locker! Check out the Obby training grounds.',
    rules: [
      '1. Practice sword dueling techniques every Friday.',
      '2. Must have completed at least one 50-stud Obby course.',
      '3. Respect all server members in local proximity chat.',
    ],
    membersCount: 42,
    maxMembers: 50,
    members: [
      {
        uid: 'user_noob_king',
        name: 'BloxianGeneral_Noob',
        role: 'Leader',
        avatarType: 'roblox',
        avatarSubtype: 'noob',
        contributionXp: 24200,
        joinedAt: Date.now() - 86400000 * 40,
        isOnline: true,
      },
      {
        uid: 'user_bacon_pro',
        name: 'BaconWarrior_99',
        role: 'Officer',
        avatarType: 'roblox',
        avatarSubtype: 'bacon',
        contributionXp: 16100,
        joinedAt: Date.now() - 86400000 * 20,
        isOnline: true,
      },
    ],
    level: 8,
    vaultCoins: 62000,
    vaultRobux: 14500,
    joinType: 'open',
    perksUnlocked: ['Guild Hall Teleport', 'Speed Coil Resonance (+20%)', 'Guild Robux Dividend'],
    organizedEvents: [
      {
        id: 'ge_crossroads_tourney',
        title: 'SFOTH Sword Tournament & Obby Sprint',
        type: 'PvP Tournament',
        scheduledTime: 'Sunday 20:00 UTC',
        rewardText: '2,500 R$ Winner Pot + Mythic Linked Sword',
        creatorName: 'BloxianGeneral_Noob',
        voiceChannelFrequency: '145.80 MHz',
        participants: ['BloxianGeneral_Noob', 'BaconWarrior_99'],
      },
    ],
    createdAt: Date.now() - 86400000 * 40,
  },
  {
    id: 'guild_golden_arches',
    name: 'Golden Arches Cartel',
    tag: 'MCD',
    factionId: 'corporate_titans',
    leaderUid: 'user_ronald_exec',
    leaderName: 'ChiefExecutive_Grimace',
    crestIcon: '🍔',
    crestBg: 'bg-amber-600',
    description: 'Feeding millions across the multiverse with sizzling combat spatulas and cosmic shake elixirs.',
    motd: 'Grimace Shake supply drops active in Landmark 4! Protect the drive-thru perimeter!',
    rules: [
      '1. Always carry at least 5 fresh Cheezburgers in hotbar.',
      '2. Defend Landmark 4 restaurant franchises from monster hordes.',
      '3. Maintain supply chain logistics with New World supermarkets.',
    ],
    membersCount: 29,
    maxMembers: 50,
    members: [
      {
        uid: 'user_ronald_exec',
        name: 'ChiefExecutive_Grimace',
        role: 'Leader',
        avatarType: 'youtube',
        contributionXp: 15400,
        joinedAt: Date.now() - 86400000 * 18,
        isOnline: true,
      },
    ],
    level: 6,
    vaultCoins: 89000,
    vaultRobux: 5400,
    joinType: 'open',
    perksUnlocked: ['Shared Food Pantry', 'Infinite Sizzle Burn (+10%)', 'Discount Store Passes'],
    organizedEvents: [
      {
        id: 'ge_burger_defense',
        title: 'The Great Golden Arches Defense',
        type: 'Raid',
        scheduledTime: 'Friday 22:00 UTC',
        rewardText: '5,000 Coins + Golden Arches Battle Spatula',
        creatorName: 'ChiefExecutive_Grimace',
        voiceChannelFrequency: '146.50 MHz',
        participants: ['ChiefExecutive_Grimace'],
      },
    ],
    createdAt: Date.now() - 86400000 * 18,
  },
  {
    id: 'guild_sprunki_beats',
    name: 'Sprunki Beat Syndicate',
    tag: 'SPRNK',
    factionId: 'vocal_harmony',
    leaderUid: 'user_verity_oracle',
    leaderName: 'OracleVerity',
    crestIcon: '🎶',
    crestBg: 'bg-fuchsia-600',
    description: 'Chanting starlight harmonies and composing live beatbox symphonies in Landmark 6.',
    motd: 'New Verity celestial chords discovered. Tune in on 144.20 MHz voice radar!',
    rules: [
      '1. Keep rhythm and harmony at all times.',
      '2. Protect Jukebox installations throughout the world.',
      '3. Cleanse void glitch occurrences without delay.',
    ],
    membersCount: 35,
    maxMembers: 50,
    members: [
      {
        uid: 'user_verity_oracle',
        name: 'OracleVerity',
        role: 'Leader',
        avatarType: 'sprnuki',
        avatarSubtype: 'verity',
        contributionXp: 21000,
        joinedAt: Date.now() - 86400000 * 22,
        isOnline: true,
      },
    ],
    level: 7,
    vaultCoins: 51000,
    vaultRobux: 4100,
    joinType: 'open',
    perksUnlocked: ['Harmonic Shield (+25%)', 'Jukebox Song Duplication', 'Healing Note Pulse'],
    organizedEvents: [
      {
        id: 'ge_verity_jam',
        title: 'Celestial Starlight Chime Concert & Void Defense',
        type: 'Raid',
        scheduledTime: 'Saturday 21:00 UTC',
        rewardText: "Music Box + Sprunki's Sword of Friendship",
        creatorName: 'OracleVerity',
        voiceChannelFrequency: '144.20 MHz',
        participants: ['OracleVerity'],
      },
    ],
    createdAt: Date.now() - 86400000 * 22,
  },
];

const STORAGE_GUILDS_KEY = 'megaworld_guilds_data_v1';
const STORAGE_USER_GUILD_KEY = 'megaworld_user_guild_id';
const STORAGE_USER_FACTION_KEY = 'megaworld_user_faction_id';

class GuildFactionManager {
  private guilds: GuildDef[] = INITIAL_GUILDS;
  private userGuildId: string | null = null;
  private userFactionId: string = 'builders_league';

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const savedGuilds = localStorage.getItem(STORAGE_GUILDS_KEY);
      if (savedGuilds) {
        this.guilds = JSON.parse(savedGuilds);
      }
      const savedUserGuild = localStorage.getItem(STORAGE_USER_GUILD_KEY);
      if (savedUserGuild) {
        this.userGuildId = savedUserGuild;
      }
      const savedFaction = localStorage.getItem(STORAGE_USER_FACTION_KEY);
      if (savedFaction) {
        this.userFactionId = savedFaction;
      }
    } catch (e) {
      console.warn('Failed to load guilds from localStorage:', e);
    }
  }

  private saveToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_GUILDS_KEY, JSON.stringify(this.guilds));
      if (this.userGuildId) {
        localStorage.setItem(STORAGE_USER_GUILD_KEY, this.userGuildId);
      } else {
        localStorage.removeItem(STORAGE_USER_GUILD_KEY);
      }
      localStorage.setItem(STORAGE_USER_FACTION_KEY, this.userFactionId);
    } catch (e) {
      console.warn('Failed to save guilds to localStorage:', e);
    }
  }

  public async syncWithCloud(uid?: string) {
    if (!uid) return;
    try {
      const userRef = doc(db, 'user_guild_memberships', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data.guildId) this.userGuildId = data.guildId;
        if (data.factionId) this.userFactionId = data.factionId;
        this.saveToLocalStorage();
      }
    } catch (err) {
      console.warn('Firestore guild sync fallback:', err);
    }
  }

  public getGuilds(): GuildDef[] {
    return this.guilds;
  }

  public getGuildById(id: string): GuildDef | undefined {
    return this.guilds.find(g => g.id === id);
  }

  public getUserGuild(): GuildDef | undefined {
    if (!this.userGuildId) return undefined;
    return this.guilds.find(g => g.id === this.userGuildId);
  }

  public getUserFaction(): FactionDef {
    return FACTIONS_LIST.find(f => f.id === this.userFactionId) || FACTIONS_LIST[0];
  }

  public setUserFaction(factionId: string, uid?: string) {
    this.userFactionId = factionId;
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('badge');

    if (uid) {
      setDoc(doc(db, 'user_guild_memberships', uid), { factionId }, { merge: true }).catch(() => {});
    }
    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
  }

  public createGuild(params: {
    name: string;
    tag: string;
    factionId: string;
    leaderUid: string;
    leaderName: string;
    crestIcon: string;
    crestBg: string;
    description: string;
    motd: string;
    rules: string[];
    joinType: 'open' | 'invite_only' | 'closed';
  }): GuildDef {
    const newGuild: GuildDef = {
      id: `guild_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: params.name,
      tag: params.tag.toUpperCase(),
      factionId: params.factionId,
      leaderUid: params.leaderUid,
      leaderName: params.leaderName,
      crestIcon: params.crestIcon,
      crestBg: params.crestBg,
      description: params.description,
      motd: params.motd,
      rules: params.rules.length > 0 ? params.rules : ['Be respectful and have fun!'],
      membersCount: 1,
      maxMembers: 50,
      members: [
        {
          uid: params.leaderUid,
          name: params.leaderName,
          role: 'Leader',
          avatarType: 'minecraft',
          contributionXp: 1000,
          joinedAt: Date.now(),
          isOnline: true,
        },
      ],
      level: 1,
      vaultCoins: 500,
      vaultRobux: 50,
      joinType: params.joinType,
      perksUnlocked: ['Shared Resource Bank'],
      organizedEvents: [],
      createdAt: Date.now(),
    };

    this.guilds = [newGuild, ...this.guilds];
    this.userGuildId = newGuild.id;
    this.userFactionId = params.factionId;
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('badge');

    // Cloud sync
    if (params.leaderUid) {
      setDoc(doc(db, 'guilds', newGuild.id), newGuild).catch(() => {});
      setDoc(doc(db, 'user_guild_memberships', params.leaderUid), {
        guildId: newGuild.id,
        factionId: params.factionId,
        role: 'Leader',
      }, { merge: true }).catch(() => {});
    }

    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
    return newGuild;
  }

  public joinGuild(guildId: string, memberData: { uid: string; name: string; avatarType: string }): boolean {
    const target = this.guilds.find(g => g.id === guildId);
    if (!target) return false;
    if (target.membersCount >= target.maxMembers) return false;

    // Check if already in
    if (target.members.some(m => m.uid === memberData.uid)) {
      this.userGuildId = guildId;
      this.saveToLocalStorage();
      return true;
    }

    const newMember: GuildMember = {
      uid: memberData.uid,
      name: memberData.name,
      role: 'Member',
      avatarType: memberData.avatarType,
      contributionXp: 0,
      joinedAt: Date.now(),
      isOnline: true,
    };

    target.members.push(newMember);
    target.membersCount = target.members.length;
    this.userGuildId = guildId;
    this.userFactionId = target.factionId;
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('badge');

    // Cloud sync
    if (memberData.uid) {
      setDoc(doc(db, 'guilds', guildId), target).catch(() => {});
      setDoc(doc(db, 'user_guild_memberships', memberData.uid), {
        guildId,
        factionId: target.factionId,
        role: 'Member',
      }, { merge: true }).catch(() => {});
    }

    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
    return true;
  }

  public leaveGuild(guildId: string, uid: string): boolean {
    const target = this.guilds.find(g => g.id === guildId);
    if (!target) return false;

    target.members = target.members.filter(m => m.uid !== uid);
    target.membersCount = target.members.length;
    if (this.userGuildId === guildId) {
      this.userGuildId = null;
    }
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('click');

    if (uid) {
      setDoc(doc(db, 'user_guild_memberships', uid), { guildId: null }, { merge: true }).catch(() => {});
    }

    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
    return true;
  }

  public updateGuildRules(guildId: string, rules: string[], motd: string) {
    const target = this.guilds.find(g => g.id === guildId);
    if (!target) return;
    target.rules = rules;
    target.motd = motd;
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('click');
    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
  }

  public createGuildEvent(guildId: string, eventData: Omit<GuildEvent, 'id' | 'participants'>) {
    const target = this.guilds.find(g => g.id === guildId);
    if (!target) return;

    const newEvent: GuildEvent = {
      ...eventData,
      id: `ge_${Date.now()}`,
      participants: [eventData.creatorName],
    };

    target.organizedEvents.unshift(newEvent);
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('badge');
    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
  }

  public depositVault(guildId: string, coins: number, robux: number = 0) {
    const target = this.guilds.find(g => g.id === guildId);
    if (!target) return;
    target.vaultCoins += coins;
    target.vaultRobux += robux;
    target.level = Math.min(10, Math.floor(target.vaultCoins / 10000) + 1);
    this.saveToLocalStorage();
    audioEngine.playRobloxSound('badge');
    window.dispatchEvent(new CustomEvent('megaworld_guild_updated'));
  }
}

export const guildFactionManager = new GuildFactionManager();
