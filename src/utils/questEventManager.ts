/**
 * Dynamic Quest System & Scheduled In-Game Events Manager
 * Supports Fetch, Combat, and Puzzle Quests across Minecraft, Roblox, Countryballs, Xilam, and Brands.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { audioEngine } from './audioEngine';

export interface QuestReward {
  coins: number;
  robux?: number;
  xp: number;
  item?: string;
  itemCount?: number;
  cosmeticUnlockId?: string;
}

export interface QuestDef {
  id: string;
  title: string;
  category: 'fetch' | 'combat' | 'puzzle' | 'territory' | 'interaction';
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World' | 'Multiverse';
  participatingBrands?: string[];
  isCrossover?: boolean;
  collaborativeBonus?: string;
  npcName: string;
  npcAvatar: string;
  description: string;
  instruction: string;
  targetCount: number;
  targetKey: string; // item id or action id
  reward: QuestReward;
  // Cross-player collaboration & Voice Chat features
  voiceChatTip?: string;
  crossPlayerInteraction?: string;
  // Territory Control data
  territoryData?: {
    locationName: string;
    faction: string;
    targetProgress: number;
    fortificationLevel: number;
  };
  // Character Interaction / Branching Dialogue data
  dialogueData?: {
    speakerGreeting: string;
    loreNotes: string;
    options: { label: string; reply: string; progressGranted?: number }[];
  };
  // Puzzle data for interactive puzzle mini-quests
  puzzleData?: {
    type: 'logic_circuit' | 'treaty_match' | 'burger_recipe' | 'solar_valves';
    prompt: string;
    nodes?: { id: string; label: string; active: boolean }[];
    solutionOrder?: string[];
  };
}

export interface EventRewardTier {
  tierName: string;
  requirement: string;
  coins: number;
  robux?: number;
  itemReward?: string;
  badgeTitle?: string;
}

export interface ScheduledEvent {
  id: string;
  title: string;
  type: 'tournament' | 'festival' | 'boss_battle' | 'cooperative' | 'gathering';
  brand: string;
  bannerEmoji: string;
  description: string;
  serverTheme: string;
  hostName: string;
  status: 'UPCOMING' | 'LIVE_NOW' | 'CONCLUDED';
  scheduledTime: string;
  countdownSeconds: number;
  participantsCount: number;
  maxParticipants: number;
  modifiers: string[];
  // Multi-platform accessibility tags across all 8 integrated platforms
  accessiblePlatforms?: string[];
  // Clear participation rules & prerequisites
  participationRules?: string[];
  // Structured reward mechanisms & tiers
  rewardTiers?: EventRewardTier[];
  // Live multiversal announcement headline
  announcementBroadcast?: string;
  // Voice Coordination & Cross-Player Collaboration
  voiceCoordination?: string;
  collaborativeObjective?: string;
  collaborativeProgress?: number;
  collaborativeTarget?: number;
  collaborativePerk?: string;
  // Boss Battle specific state
  bossHp?: number;
  maxBossHp?: number;
  bossName?: string;
}

export interface RandomOccurrence {
  id: string;
  name: string;
  brand: string;
  icon: string;
  description: string;
  objective: string;
  remainingSeconds: number;
  totalSeconds: number;
  reward: {
    coins: number;
    robux?: number;
    xp: number;
    item?: string;
  };
  crossServerParticipants: number;
  activeStatus: 'ACTIVE' | 'RESOLVED';
  progressCount: number;
  targetCount: number;
}

export interface CommunityGoal {
  totalPoints: number;
  maxTarget: number;
  tier1Unlocked: boolean;
  tier2Unlocked: boolean;
  tier3Unlocked: boolean;
}

export interface CustomServer {
  id: string;
  name: string;
  hostUid: string;
  hostName: string;
  theme: 'minecraft' | 'roblox' | 'countryballs' | 'xilam' | 'cross_brand';
  region: string;
  playerCount: number;
  maxPlayers: number;
  pvpEnabled: boolean;
  gravity: 'normal' | 'low' | 'float';
  speedMultiplier: number;
  keepInventory: boolean;
  activeEventTitle?: string;
  isOnline: boolean;
}

export const QUESTS_CATALOG: QuestDef[] = [
  // 1. RESOURCE GATHERING (FETCH) QUESTS
  {
    id: 'q_nz_pounamu',
    title: 'Waitangi Sacred Pounamu Harvest',
    category: 'fetch',
    brand: 'NZ',
    npcName: 'Chief Tamati (Wayfinder)',
    npcAvatar: '🌿',
    description: 'The ancestral awa (river) whispers of spiritual renewal. Harvest raw emerald greenstone and native timber to carve sacred taonga pendants for wandering builders.',
    instruction: 'Harvest 8 Wood and 4 Emerald / Jade Ore from the river valley.',
    targetKey: 'wood',
    targetCount: 8,
    reward: { coins: 260, xp: 210, item: 'emerald', itemCount: 4, cosmeticUnlockId: 'face_pounamu' },
  },
  {
    id: 'q_oggy_kitchen',
    title: 'Oggy\'s Kitchen Restock Defense',
    category: 'fetch',
    brand: 'Xilam',
    npcName: 'Oggy The Cat',
    npcAvatar: '🐱',
    description: 'The cockroach trio raided my giant double-door refrigerator again! I need fresh provisions to cook a lavish stew and restore order in the house.',
    instruction: 'Collect 10 Wood and 5 Apples from the lush forest.',
    targetKey: 'wood',
    targetCount: 10,
    reward: { coins: 160, xp: 120, item: 'apple', itemCount: 6, cosmeticUnlockId: 'emblem_xilam' },
  },
  {
    id: 'q_polandball_launchpad',
    title: 'Polandball Can Into Space!',
    category: 'fetch',
    brand: 'Countryballs',
    npcName: 'Polandball',
    npcAvatar: '🇵🇱',
    description: 'Niemcy and Rosja said Poland cannot into space. Help me construct a rocket launchpad out of refined stone blocks to prove them wrong!',
    instruction: 'Mine 15 Cobblestone / Stone blocks.',
    targetKey: 'stone',
    targetCount: 15,
    reward: { coins: 200, xp: 150, item: 'diamond', itemCount: 2, cosmeticUnlockId: 'emblem_countryball' },
  },
  {
    id: 'q_roblox_cola_depot',
    title: 'Bloxburg Soda Factory Restock',
    category: 'fetch',
    brand: 'Roblox',
    npcName: 'Builderman',
    npcAvatar: '👷',
    description: 'The Bloxy Cola bottling line has run dry of raw silica sand. Supply our refinery so players across the server can enjoy fresh soda!',
    instruction: 'Mine 8 Sand blocks from the Desert dunes.',
    targetKey: 'sand',
    targetCount: 8,
    reward: { coins: 220, robux: 40, xp: 160, item: 'gold', itemCount: 4 },
  },
  {
    id: 'q_bp_bio_cells',
    title: 'BP Solar Photon Fuel Synthesis',
    category: 'fetch',
    brand: 'BP',
    npcName: 'Engineer Sarah (BP Energy)',
    npcAvatar: '⚡',
    description: 'Our zero-emission renewable energy converter requires raw coal carbon catalysts and pure glass quartz to assemble high-efficiency photovoltaic battery cells.',
    instruction: 'Gather 6 Coal and 6 Sand blocks to recharge the solar pipeline.',
    targetKey: 'coal',
    targetCount: 6,
    reward: { coins: 240, xp: 190, item: 'gold', itemCount: 5, cosmeticUnlockId: 'emblem_bp' },
  },
  {
    id: 'q_mcdonalds_provisions',
    title: 'Golden Arches Fresh Provisions',
    category: 'fetch',
    brand: 'McDonald\'s',
    npcName: 'Chef Pierre',
    npcAvatar: '🍔',
    description: 'The lunch rush is starting across the realm! We need fresh farm wheat bread and orchard apples to assemble thousands of gourmet Happy Meal bundles.',
    instruction: 'Deliver 8 Bread and 6 Apples to the drive-thru commissary.',
    targetKey: 'bread',
    targetCount: 8,
    reward: { coins: 250, xp: 200, item: 'bread', itemCount: 10, cosmeticUnlockId: 'shirt_mcdonalds' },
  },
  {
    id: 'q_youtube_broadcast_rig',
    title: 'YouTube Studio 4K Broadcast Kit',
    category: 'fetch',
    brand: 'YouTube',
    npcName: 'Streamer Nova',
    npcAvatar: '▶️',
    description: 'We are hosting a 24-hour charity livestream for the MegaWorld community! Gather rare redstone crystal and gold conduits to wire our high-speed streaming server rack.',
    instruction: 'Mine 5 Gold Ingot ores and 5 Iron blocks for studio electronics.',
    targetKey: 'gold',
    targetCount: 5,
    reward: { coins: 320, xp: 300, item: 'diamond', itemCount: 3, cosmeticUnlockId: 'emblem_youtube' },
  },
  {
    id: 'q_newworld_azoth_harvest',
    title: 'Aeternum Azoth & Flint Foraging',
    category: 'fetch',
    brand: 'New World',
    npcName: 'Syndicate Commander Thorne',
    npcAvatar: '🧭',
    description: 'The supernatural island of Aeternum demands eternal preparation. Gather flint stone and seasoned timber to reinforce our frontier expedition camp.',
    instruction: 'Harvest 12 Stone blocks and 8 Wood logs.',
    targetKey: 'stone',
    targetCount: 12,
    reward: { coins: 270, xp: 220, item: 'netherite', itemCount: 2, cosmeticUnlockId: 'emblem_newworld' },
  },

  // 2. TERRITORY CONTROL & OUTPOST DEFENSE QUESTS
  {
    id: 'q_nz_waitangi_outpost',
    title: 'Waitangi Wayfinder Beacon Defense',
    category: 'territory',
    brand: 'NZ',
    npcName: 'Warrior Kahu',
    npcAvatar: '🏉',
    description: 'Corrupted void specters seek to shroud the Southern Cross navigational lighthouse. Fortify the defensive perimeter and hold the beacon waypoint!',
    instruction: 'Defend and secure the Waitangi Coastal Beacon until control reaches 100%.',
    targetKey: 'territory_nz_waitangi',
    targetCount: 1,
    reward: { coins: 340, xp: 280, item: 'diamond', itemCount: 3, cosmeticUnlockId: 'back_allblacks_cape' },
    territoryData: {
      locationName: 'Waitangi Coastal Waypoint (NZ)',
      faction: 'Aotearoa Voyagers Guild',
      targetProgress: 100,
      fortificationLevel: 3,
    },
  },
  {
    id: 'q_newworld_fort_war',
    title: 'Fort Everfall Outpost Conquest',
    category: 'territory',
    brand: 'New World',
    npcName: 'Commander Thorne',
    npcAvatar: '🛡️',
    description: 'The Syndicate, Marauders, and Covenant are warring for administrative control of Fort Everfall. Capture the central flag banner to claim local trade taxes.',
    instruction: 'Capture and hold the Fort Everfall courtyard flag for 60 seconds.',
    targetKey: 'territory_newworld_fort',
    targetCount: 1,
    reward: { coins: 380, xp: 320, item: 'diamond', itemCount: 4, cosmeticUnlockId: 'aura_newworld_azoth' },
    territoryData: {
      locationName: 'Fort Everfall Garrison',
      faction: 'Syndicate Frontier Expedition',
      targetProgress: 100,
      fortificationLevel: 4,
    },
  },
  {
    id: 'q_tarragower_bell_tower',
    title: 'Tarragower Quad & Bell Tower Defense',
    category: 'territory',
    brand: 'Tarragower',
    npcName: 'Prof. Alistair',
    npcAvatar: '🏛️',
    description: 'Unruly rogue gremlins are disrupting the historic science labs! Secure the four quadrants of the campus clock tower and restore school yard harmony.',
    instruction: 'Cleanse and secure the 4 campus courtyards.',
    targetKey: 'territory_tarragower_quad',
    targetCount: 4,
    reward: { coins: 310, xp: 260, item: 'emerald', itemCount: 5, cosmeticUnlockId: 'aura_tarragower_wisdom' },
    territoryData: {
      locationName: 'Tarragower Academy Clock Tower',
      faction: 'Tarragower Honor Board',
      targetProgress: 100,
      fortificationLevel: 3,
    },
  },
  {
    id: 'q_bp_grid_outpost',
    title: 'BP Clean Energy Grid Substation',
    category: 'territory',
    brand: 'BP',
    npcName: 'Tech Lead Marcus',
    npcAvatar: '⚡',
    description: 'A massive power surge threatens the central solar grid. Hold the perimeter of the Helios transformer substation to maintain clean power across all cities.',
    instruction: 'Stabilize 3 renewable energy relay capacitors at the substation.',
    targetKey: 'territory_bp_substation',
    targetCount: 3,
    reward: { coins: 330, xp: 270, item: 'gold', itemCount: 6, cosmeticUnlockId: 'aura_bp_solaris' },
    territoryData: {
      locationName: 'Helios Eco-Energy Substation',
      faction: 'BP Renewable Energy Engineers',
      targetProgress: 100,
      fortificationLevel: 3,
    },
  },
  {
    id: 'q_roblox_hill_capture',
    title: 'King of the Blox Castle Hill',
    category: 'territory',
    brand: 'Roblox',
    npcName: 'Bloxian Knight',
    npcAvatar: '🟥',
    description: 'Classic sword fighting territory duel! Clamber atop the iconic tiered stone fortress and raise the red block flag above all challengers.',
    instruction: 'Hold the hilltop flag against rival sword duelists.',
    targetKey: 'territory_roblox_hill',
    targetCount: 1,
    reward: { coins: 350, robux: 50, xp: 280, item: 'diamond', itemCount: 3, cosmeticUnlockId: 'aura_electric' },
    territoryData: {
      locationName: 'Bloxburg Heights Fortress',
      faction: 'Robloxian Vanguard Guild',
      targetProgress: 100,
      fortificationLevel: 2,
    },
  },

  // 3. CHARACTER INTERACTIONS (BRANCHING DIALOGUE & LORE)
  {
    id: 'q_nz_haka_dialogue',
    title: 'The Wayfinder\'s Sacred Haka',
    category: 'interaction',
    brand: 'NZ',
    npcName: 'Chief Tamati (Wayfinder)',
    npcAvatar: '🌿',
    description: 'Engage in an honorable meeting with Rangatira Chief Tamati. Discover the timeless heritage of the Ka Mate Haka, sea voyaging navigation, and the spirit of Manaakitanga (hospitality).',
    instruction: 'Converse with Chief Tamati and choose respectful diplomatic responses.',
    targetKey: 'interaction_nz_tamati',
    targetCount: 3,
    reward: { coins: 300, xp: 350, item: 'golden_apple', itemCount: 3, cosmeticUnlockId: 'aura_silver_fern' },
    dialogueData: {
      speakerGreeting: 'Kia ora e te hoa! (Greetings friend!) Welcome to the ancestral lands beneath the Southern Cross. Do you walk these shores as a seeker of wisdom, or a reckless conqueror?',
      loreNotes: 'In Māori culture, the Silver Fern represents strength, endurance, and guidance in the dark forest.',
      options: [
        {
          label: 'I come in peace and humility to learn the ways of the Wayfinder.',
          reply: 'Ka pai! Your humility honors your ancestors. The true navigator reads the stars, the ocean swells, and the flight of the albatross.',
          progressGranted: 1,
        },
        {
          label: 'Teach me the posture and spirit of the Ka Mate Haka.',
          reply: 'The Haka is not merely a dance—it is a roar of life triumphing over death! Stand firm, strike your chest with pride, and let your spirit ignite.',
          progressGranted: 1,
        },
        {
          label: 'How can our multiplayer community protect these sacred groves?',
          reply: 'By practicing Kaitiakitanga—guardianship of the earth, waters, and fellow builders. Take only what you need, and plant ten trees for each you harvest.',
          progressGranted: 1,
        },
      ],
    },
  },
  {
    id: 'q_countryball_diplomacy',
    title: 'Geneva Sovereign Summit Hearing',
    category: 'interaction',
    brand: 'Countryballs',
    npcName: 'UN Secretariat Ball',
    npcAvatar: '🌐',
    description: 'Step onto the diplomatic floor of the Countryballs League of Nations. Mediate territorial disputes between Polandball, USA ball, and UK ball to draft a lasting server treaty.',
    instruction: 'Reach consensus across 3 international sovereign resolutions.',
    targetKey: 'interaction_un_summit',
    targetCount: 3,
    reward: { coins: 280, xp: 300, item: 'emerald', itemCount: 4, cosmeticUnlockId: 'hat_tophat' },
    dialogueData: {
      speakerGreeting: 'Order in the General Assembly! The delegates are squabbling over biome boundary lines again. Delegate, what is your motion for world peace?',
      loreNotes: 'Countryballs communicate with charming sovereign flags and historical diplomatic humor.',
      options: [
        {
          label: 'Propose a universal non-aggression pact with 0% tariff trade across all server borders.',
          reply: 'Brilliant! Polandball claps with joy and Germanyball nods in economic approval. Resolution passed!',
          progressGranted: 1,
        },
        {
          label: 'Designate the Grand Capitol as a permanent safe haven with infinite tea for all balls.',
          reply: 'Splendid idea, chap! UK ball adjusts his gold monocle and votes aye immediately.',
          progressGranted: 1,
        },
        {
          label: 'Authorize a joint space program to send Polandball to Mars!',
          reply: 'POLAND CAN INTO SPACE! The hall erupts in fireworks and thunderous cheering!',
          progressGranted: 1,
        },
      ],
    },
  },
  {
    id: 'q_youtube_creator_nova',
    title: 'Nova\'s 10M Sub Milestone Strategy',
    category: 'interaction',
    brand: 'YouTube',
    npcName: 'Streamer Nova',
    npcAvatar: '▶️',
    description: 'Sit down with YouTube sensation Nova to plan the ultimate viral sandbox episode. Brainstorm thumbnails, challenges, and charity community goals.',
    instruction: 'Pitch 3 viral content ideas to produce the mega-broadcast.',
    targetKey: 'interaction_yt_nova',
    targetCount: 3,
    reward: { coins: 350, robux: 60, xp: 320, item: 'diamond', itemCount: 4, cosmeticUnlockId: 'shirt_youtube_creator' },
    dialogueData: {
      speakerGreeting: 'What is up, chat?! We are 50,000 subscribers away from the Diamond Play Button. What kind of insane challenge should we drop for the server today?',
      loreNotes: 'Nova streams weekly 100-player sandbox roleplay tournaments to millions of viewers.',
      options: [
        {
          label: 'Let us build a 200,000,000 billion block rollercoaster through the Nether and Sky islands!',
          reply: 'That thumbnail is going to go ABSOLUTELY CRAZY! Our editor is already rendering the 4K cinematic trailer!',
          progressGranted: 1,
        },
        {
          label: 'Host a cross-server Hide & Seek where the winner receives 500 Diamonds!',
          reply: 'Chat is spamming Ws in the stream! Everyone is already logging onto the server lobby!',
          progressGranted: 1,
        },
        {
          label: 'Promise to plant 10,000 virtual trees if we hit the goal before midnight!',
          reply: 'Positive community impact! The wholesome vibes will break the algorithm!',
          progressGranted: 1,
        },
      ],
    },
  },

  // 4. COMBAT & PUZZLE CHALLENGES
  {
    id: 'q_sharko_beach_patrol',
    title: 'Sharko\'s High Tide Defense',
    category: 'combat',
    brand: 'Xilam',
    npcName: 'Sharko The Lifeguard',
    npcAvatar: '🦈',
    description: 'Hostile midnight creepers and ocean drowned are disturbing Marina\'s peaceful beach cove. Flex your muscles and clear out the intruders!',
    instruction: 'Defeat 5 hostile mobs during nighttime.',
    targetKey: 'mobs_defeated',
    targetCount: 5,
    reward: { coins: 280, xp: 220, item: 'golden_apple', itemCount: 2, cosmeticUnlockId: 'hat_viking' },
  },
  {
    id: 'q_nether_warden_hunt',
    title: 'Ancient Deep Dark Expedition',
    category: 'combat',
    brand: 'Minecraft',
    npcName: 'Herobrine Stalker',
    npcAvatar: '👁️',
    description: 'Venture into the subterranean depths where shadows whisper and rare sculk sensors vibrate. Conquer the darkness to earn nether spoils.',
    instruction: 'Slay 8 monsters or mine below depth level 25.',
    targetKey: 'deep_spelunking',
    targetCount: 8,
    reward: { coins: 350, xp: 280, item: 'diamond', itemCount: 5, cosmeticUnlockId: 'aura_flame' },
  },
  {
    id: 'q_tarragower_circuit',
    title: 'Tarragower Redstone Logic Gate',
    category: 'puzzle',
    brand: 'Tarragower',
    npcName: 'Prof. Alistair',
    npcAvatar: '🎓',
    description: 'The ancient academy archives are sealed by a 4-channel binary redstone comparator. Align the logic switches to activate the door solenoid!',
    instruction: 'Flip the 4 logic gate levers to achieve target voltage balance (Target: 1011).',
    targetKey: 'puzzle_tarragower',
    targetCount: 1,
    reward: { coins: 300, xp: 250, item: 'emerald', itemCount: 6, cosmeticUnlockId: 'emblem_tarragower' },
    puzzleData: {
      type: 'logic_circuit',
      prompt: 'Toggle the binary switches to match the master keycode: [ ON | OFF | ON | ON ]',
      nodes: [
        { id: 'gate_1', label: 'AND Gate Alpha', active: false },
        { id: 'gate_2', label: 'OR Repeater Beta', active: false },
        { id: 'gate_3', label: 'XOR Inverter Gamma', active: false },
        { id: 'gate_4', label: 'NOT Latch Delta', active: false },
      ],
      solutionOrder: ['gate_1', 'gate_3', 'gate_4'], // 1, 3, 4 active
    },
  },
  {
    id: 'q_mcdonalds_recipe',
    title: 'McDonald\'s Secret Golden Recipe',
    category: 'puzzle',
    brand: 'McDonald\'s',
    npcName: 'Chef Pierre',
    npcAvatar: '👨‍🍳',
    description: 'The vault holding the original 1948 Golden Recipe is locked by an ingredient sequence! Assemble the layers in the exact gourmet order.',
    instruction: 'Click the ingredients in classic order: Toasted Bun ➔ Pure Beef Patty ➔ Melted Cheese ➔ Secret Sauce.',
    targetKey: 'puzzle_mcdonalds',
    targetCount: 1,
    reward: { coins: 280, xp: 210, item: 'bread', itemCount: 8, cosmeticUnlockId: 'hat_chef' },
    puzzleData: {
      type: 'burger_recipe',
      prompt: 'Sequence the four culinary layers in authentic order:',
      solutionOrder: ['bun', 'patty', 'cheese', 'sauce'],
    },
  },

  // 5. BRAND QUESTS WITH VOICE CHAT & CROSS-PLAYER COLLABORATION
  {
    id: 'q_rescue_lost_villager',
    title: 'Rescuing the Lost Villager in the Nether Ravine',
    category: 'combat',
    brand: 'Minecraft',
    npcName: 'Cartographer Barnaby',
    npcAvatar: '🧑‍🌾',
    description: 'A Minecraft cartographer villager was ambushed and trapped deep in the obsidian cavern near Landmark 4. Team up with another player, activate your voice chat/radio to coordinate directional callouts ("Look out left!", "Torches placed!"), slay the Nether guards, and safely escort the villager to the forest surface.',
    instruction: 'Coordinate via Proximity Voice Chat [C], breach the Nether Caldera, and defeat 6 Nether guards while escorting the villager.',
    targetKey: 'mobs_defeated',
    targetCount: 6,
    voiceChatTip: 'Hold [V] for Push-to-Talk or press [C] for Voice Radar to call out hostile flanks to your party!',
    crossPlayerInteraction: 'Requires at least 2 players in proximity to defend the front and rear escort extraction vectors.',
    reward: { coins: 420, xp: 380, item: 'diamond', itemCount: 5, cosmeticUnlockId: 'hat_mining' },
  },
  {
    id: 'q_youtube_viral_challenge',
    title: 'The 100M Viral Audio Challenge',
    category: 'interaction',
    brand: 'YouTube',
    npcName: 'Creator Nova',
    npcAvatar: '▶️',
    description: 'Streamer Nova is shooting a viral trend video! Players must gather at the broadcast stage, open Proximity Voice Chat or character speech wheel, harmonize a 3-part rhythm chant, and cheer simultaneously when the recording beacon activates.',
    instruction: 'Gather with at least one other player at the broadcast rig and transmit voice lines or shouts to reach 10,000 viral decibels.',
    targetKey: 'interaction_yt_nova',
    targetCount: 3,
    voiceChatTip: 'Speak aloud into Voice Chat [V] or use Character Speech Wheel [T] within 8 blocks of Nova\'s camera rig!',
    crossPlayerInteraction: 'Simultaneous voice transmission from 2+ players multiplies viral audience engagement score.',
    reward: { coins: 450, robux: 75, xp: 420, item: 'diamond', itemCount: 4, cosmeticUnlockId: 'aura_yt_viral' },
    dialogueData: {
      speakerGreeting: 'Camera is rolling in 3... 2... 1! Mic check everyone! Drop your catchphrases into voice chat to break the algorithm!',
      loreNotes: 'Nova streams weekly 100-player sandbox tournaments with spatial voice audio reactions.',
      options: [
        {
          label: 'Broadcast "ALL ABOARD MEGAMULTIVERSE!" into the spatial voice channel!',
          reply: 'THE DECIBEL METER IS OFF THE CHARTS! The stream chat is going wild!',
          progressGranted: 1,
        },
        {
          label: 'Harmonize an 8-bit chiptune beatbox loop with Oren and Simon!',
          reply: 'Insane acoustic resonance! That audio snippet is instantly trending at #1 worldwide!',
          progressGranted: 1,
        },
        {
          label: 'Lead the entire server in a thunderous Ka Mate Haka stomp chant!',
          reply: 'Pure chills! The entire chat room is spamming standing ovations and gifting subscriptions!',
          progressGranted: 1,
        },
      ],
    },
  },
  {
    id: 'q_mcdonalds_banquet_rush',
    title: 'McDonald\'s Drive-Thru Grand Banquet Rush',
    category: 'fetch',
    brand: 'McDonald\'s',
    npcName: 'Chef Ronald',
    npcAvatar: '🍟',
    description: 'A massive convoy of hungry adventurers has arrived at the Golden Arches Depot! One player acts as Grill Master collecting farm wheat and golden apples, while another coordinates customer orders over the Drive-Thru Voice Intercom.',
    instruction: 'Use the Voice Intercom to call out meal prep steps, then deliver 8 Bread and 4 Apples to the rush counter.',
    targetKey: 'bread',
    targetCount: 8,
    voiceChatTip: 'Relay customer order numbers over Voice Chat to sync kitchen assembly with delivery runners!',
    crossPlayerInteraction: 'Grill master and delivery runner divide wheat harvesting and customer handoff for 2x combo points.',
    reward: { coins: 380, xp: 320, item: 'golden_apple', itemCount: 4, cosmeticUnlockId: 'aura_mc_golden' },
  },
  {
    id: 'q_roblox_relay_soundboard',
    title: 'Roblox Obby Relay & Soundboard Duel',
    category: 'puzzle',
    brand: 'Roblox',
    npcName: 'Bloxian Champion',
    npcAvatar: '🟥',
    description: 'The Bloxian Champion challenges your party to a synchronized high-altitude relay race. One player guides the runner through disappearing red neon blocks using voice callouts ("Jump right!", "Wait for the laser!"), while hitting soundboard triggers on timing beats.',
    instruction: 'Navigate the high-altitude neon platforms while your partner gives live voice directions, then trigger the victory soundboard.',
    targetKey: 'puzzle_roblox_relay',
    targetCount: 1,
    voiceChatTip: 'Navigator guides blindfolded jumper over Voice Chat [C] using directional calls: JUMP, STOP, DASH!',
    crossPlayerInteraction: 'Asymmetric teamwork where the caller sees the floor sequence and the runner executes the jumps.',
    reward: { coins: 400, robux: 60, xp: 350, item: 'gold', itemCount: 6, cosmeticUnlockId: 'hat_dominus' },
    puzzleData: {
      type: 'logic_circuit',
      prompt: 'Activate the three relay coils in synchronized order as called out by your navigator:',
      nodes: [
        { id: 'coil_red', label: 'Speed Coil Alpha', active: false },
        { id: 'coil_blue', label: 'Gravity Coil Beta', active: false },
        { id: 'coil_gold', label: 'Fusion Coil Gamma', active: false },
      ],
      solutionOrder: ['coil_red', 'coil_blue', 'coil_gold'],
    },
  },
  {
    id: 'q_newworld_azoth_incursion',
    title: 'New World Azoth Rift Incursion Defense',
    category: 'territory',
    brand: 'New World',
    npcName: 'Commander Adelyn',
    npcAvatar: '⚔️',
    description: 'Corrupted Void Rifts are erupting along the Waitangi border outpost. Players of different factions must declare a temporary truce, call out breach points over the tactical voice radio channel, and hold the defensive circle until the rift is cleansed.',
    instruction: 'Radio in tactical defense positions over Voice Chat [C] and hold the border gate until rift purification reaches 100%.',
    targetKey: 'territory_azoth_rift',
    targetCount: 1,
    voiceChatTip: 'Call out incoming breach directions (North/South) over the tactical voice frequency [C].',
    crossPlayerInteraction: 'Faction cross-play where competing players join forces to maintain the 360-degree perimeter shield.',
    reward: { coins: 460, xp: 400, item: 'netherite', itemCount: 3, cosmeticUnlockId: 'aura_newworld_azoth' },
    territoryData: {
      locationName: 'Aeternum Azoth Rift Boundary',
      faction: 'United Multiverse Coalition',
      targetProgress: 100,
      fortificationLevel: 5,
    },
  },

  // 6. MULTIVERSE 3+ IP INTERACTIVE CROSSOVER QUESTS
  {
    id: 'q_crossover_tri_sovereign',
    title: 'The Tri-Realm Sovereign Relic',
    category: 'puzzle',
    brand: 'Multiverse',
    participatingBrands: ['Minecraft', 'Roblox', 'Countryballs'],
    isCrossover: true,
    collaborativeBonus: '+50% Coins & Robux when solving in a 2+ player squad!',
    npcName: 'Polandball & Steve & Builderman',
    npcAvatar: '🌐',
    description: 'Polandball has designed the ultimate Inter-Realm Space Portal! To ignite its core, you must bring together Minecraft Netherite alloys, a Roblox Speed Coil frequency regulator, and the official Sovereign Clay Stamp from the United Nations delegates.',
    instruction: 'Solve the tri-realm frequency alignment puzzle, then deposit 1 Netherite and 1 Speed Coil into the portal altar.',
    targetKey: 'puzzle_tri_realm_matrix',
    targetCount: 1,
    voiceChatTip: 'Coordinate frequency puzzle node values with your teammates using voice frequency 144.20 MHz!',
    crossPlayerInteraction: 'Requires one player on the redstone switch, one on the Roblox gravity lift, and one stamping the diplomatic visa.',
    reward: { 
      coins: 550, 
      robux: 120, 
      xp: 450, 
      item: 'tri_realm_blade', 
      itemCount: 1, 
      cosmeticUnlockId: 'emblem_countryball' 
    },
    puzzleData: {
      type: 'logic_circuit',
      prompt: 'Synchronize the three cross-universe harmonic energy conduits:',
      nodes: [
        { id: 'node_mc_netherite', label: 'Minecraft Netherite Resonator', active: false },
        { id: 'node_rbx_coil', label: 'Roblox Hyper-Coil Accelerator', active: false },
        { id: 'node_cb_diplomacy', label: 'Countryballs Diplomatic Matrix', active: false },
      ],
      solutionOrder: ['node_mc_netherite', 'node_rbx_coil', 'node_cb_diplomacy'],
    },
  },
  {
    id: 'q_crossover_viral_banquet',
    title: 'The 100M Viral Golden Feast Stream',
    category: 'fetch',
    brand: 'Multiverse',
    participatingBrands: ['McDonald\'s', 'YouTube', 'Minecraft'],
    isCrossover: true,
    collaborativeBonus: 'Triggers a golden subscriber confetti shower for all players on the server upon completion!',
    npcName: 'Chef Ronald & Streamer Nova',
    npcAvatar: '🍟',
    description: 'Streamer Nova is hosting a global 24-hour charity broadcast with Chef Ronald! Mine Minecraft gold to forge sparkling golden apples, bake 10 loaves of bread in the furnace, assemble Happy Meal bundles, and broadcast the feast live on the YouTube stage.',
    instruction: 'Harvest 6 Gold Ingot ores, deliver 8 Bread to the McDonald\'s depot, and trigger the livestream broadcast on stage.',
    targetKey: 'gold',
    targetCount: 6,
    voiceChatTip: 'Speak into your microphone on stage or chant "Happy Meal Viral!" to pump the livestream viewer counter!',
    crossPlayerInteraction: 'Chef prepares provisions while the Streamer coordinates the broadcast decibel meter and audience reactions.',
    reward: { 
      coins: 600, 
      xp: 500, 
      item: 'viral_golden_mic', 
      itemCount: 1, 
      cosmeticUnlockId: 'aura_yt_viral' 
    },
  },
  {
    id: 'q_crossover_slapstick_fjords',
    title: 'The Slapstick Gravity Obby Expedition',
    category: 'puzzle',
    brand: 'Multiverse',
    participatingBrands: ['Roblox', 'Xilam', 'NZ'],
    isCrossover: true,
    collaborativeBonus: 'Grants all party members +40% jump boost and cartoon bounce physics for 15 minutes!',
    npcName: 'Oggy Cat & Chief Tamati',
    npcAvatar: '🐱',
    description: 'Oggy and Jack escaped the cockroaches by vacationing in the New Zealand fjords, where Builderman built a colossal floating obby across the peaks! Dodge flying flyswatters, jump across bouncy Kiwi trampolines, and sound the sacred Pounamu gong.',
    instruction: 'Complete the 3 fjord jump stages with slapstick flyswatter obstacles and strike the sacred Pounamu gong.',
    targetKey: 'puzzle_fjord_obby',
    targetCount: 1,
    voiceChatTip: 'Call out flyswatter swing timing ("Swing... JUMP!") to guide your party past the swinging obstacles!',
    crossPlayerInteraction: 'One player holds the pressure plate to disable the mega flyswatter while the runner sprints across the greenstone bridge.',
    reward: { 
      coins: 520, 
      robux: 90, 
      xp: 480, 
      item: 'sharko_bloxy_swatter', 
      itemCount: 1, 
      cosmeticUnlockId: 'back_allblacks_cape' 
    },
    puzzleData: {
      type: 'logic_circuit',
      prompt: 'Activate the three fjord obstacle mechanisms in order:',
      nodes: [
        { id: 'gate_roblox_pad', label: 'Roblox Neon Bounce Pad', active: false },
        { id: 'gate_xilam_spring', label: 'Xilam Slapstick Trapdoor', active: false },
        { id: 'gate_nz_pounamu', label: 'Waitangi Pounamu Beacon', active: false },
      ],
      solutionOrder: ['gate_roblox_pad', 'gate_xilam_spring', 'gate_nz_pounamu'],
    },
  },
  {
    id: 'q_crossover_continental_express',
    title: 'The Continental Melody Express',
    category: 'interaction',
    brand: 'Multiverse',
    participatingBrands: ['Thomas & Friends', 'Sprunki', 'Countryballs'],
    isCrossover: true,
    collaborativeBonus: 'Unlocks the Conductor\'s Celestial Whistle emote that plays rhythmic steam chords!',
    npcName: 'Thomas The Tank Engine & Oren',
    npcAvatar: '🚂',
    description: 'Thomas is pulling an international VIP express carrying Sprunki beatboxers to the Countryballs Peace Summit! Switch the railway track points, harmonize Thomas\'s steam whistle with Oren\'s 808 beat drop, and clear border customs.',
    instruction: 'Complete the branching dialogue with the customs border guard and Thomas to clear the musical express.',
    targetKey: 'dialogue_melody_express',
    targetCount: 1,
    voiceChatTip: 'Whistle or beatbox in Proximity Voice Chat to activate the locomotive\'s supercharged acoustic boiler!',
    crossPlayerInteraction: 'Driver controls the boiler pressure while passenger squad members synchronize rhythmic track signals.',
    reward: { 
      coins: 580, 
      xp: 460, 
      item: 'celestial_steam_whistle', 
      itemCount: 1, 
      cosmeticUnlockId: 'emblem_countryball' 
    },
    dialogueData: {
      speakerGreeting: 'Peep peep! The Continental Melody Express is on schedule, but we need border clearance and proper tempo synchronization!',
      loreNotes: 'This cross-realm locomotive journey connects the Island of Sodor with the Incredibox Beat Studios and sovereign capitols.',
      options: [
        { label: 'Present UN Diplomatic Passport to the border guard.', reply: 'Visa stamped! Polandball salutes your diplomatic passage!', progressGranted: 1 },
        { label: 'Tune Thomas\'s whistle to the key of C with Oren\'s beatbox.', reply: 'The steam pressure matches the beat drop perfectly! Track switches are cleared!', progressGranted: 1 },
        { label: 'Blow the double whistle and accelerate to full speed!', reply: 'Full steam ahead! The crowd at the summit is cheering for the musical arrival!', progressGranted: 1 },
      ],
    },
  },
  {
    id: 'q_crossover_clean_energy_tycoon',
    title: 'The Eco-Automaton Power Grid',
    category: 'puzzle',
    brand: 'Multiverse',
    participatingBrands: ['BP', 'Minecraft', 'Roblox'],
    isCrossover: true,
    collaborativeBonus: 'Provides infinite furnace fuel and electrified conveyer speed for all allied players.',
    npcName: 'Engineer Sarah & Builderman',
    npcAvatar: '⚡',
    description: 'A revolutionary power grid uniting BP Solar Photon Collectors, Minecraft Redstone Repeater Circuits, and Roblox Industrial Tycoon Conveyors needs calibration to power the central server metropolis.',
    instruction: 'Solve the solar capacitor circuit and route renewable power to the industrial conveyors.',
    targetKey: 'puzzle_eco_grid',
    targetCount: 1,
    voiceChatTip: 'Read out the solar voltage values over Voice Chat to sync capacitor breakers in real time!',
    crossPlayerInteraction: 'One player manages redstone logic gates while the other calibrates the solar photon intake valves.',
    reward: { 
      coins: 500, 
      robux: 80, 
      xp: 450, 
      item: 'helios_solar_core', 
      itemCount: 1, 
      cosmeticUnlockId: 'emblem_bp' 
    },
    puzzleData: {
      type: 'solar_valves',
      prompt: 'Calibrate the three renewable energy converters to stabilize grid frequency:',
      nodes: [
        { id: 'bp_solar_intake', label: 'BP Photovoltaic Collector Alpha', active: false },
        { id: 'mc_redstone_relay', label: 'Minecraft Redstone Comparator Beta', active: false },
        { id: 'rbx_tycoon_capacitor', label: 'Roblox Industrial Power Capacitor Gamma', active: false },
      ],
      solutionOrder: ['bp_solar_intake', 'mc_redstone_relay', 'rbx_tycoon_capacitor'],
    },
  },
  {
    id: 'q_crossover_aeternum_space_defense',
    title: 'The Azoth Space Bastion Incursion',
    category: 'territory',
    brand: 'Multiverse',
    participatingBrands: ['New World', 'Countryballs', 'Minecraft'],
    isCrossover: true,
    collaborativeBonus: 'Awards the legendary Aeternum Sovereign Aegis Shield and grants +35% fort defense.',
    npcName: 'Commander Thorne & Polandball',
    npcAvatar: '⚔️',
    description: 'Corrupted Void Rifts have breached the perimeter of Polandball\'s celestial space observatory! New World vanguard warriors and Minecraft master builders must form a united front, erect obsidian barricades, and hold the perimeter.',
    instruction: 'Fortify the Space Bastion boundary and hold the territory until purification reaches 100%.',
    targetKey: 'territory_space_bastion',
    targetCount: 1,
    voiceChatTip: 'Issue tactical shieldwall commands over the raid voice radio channel [C] to repel elite void specters!',
    crossPlayerInteraction: 'Vanguard warriors taunt incoming bosses while builders place defensive obsidian blocks to seal breaches.',
    reward: { 
      coins: 650, 
      xp: 520, 
      item: 'aeternum_sovereign_shield', 
      itemCount: 1, 
      cosmeticUnlockId: 'aura_newworld_azoth' 
    },
    territoryData: {
      locationName: 'Polandball Observatory & Azoth Caldera',
      faction: 'United Sovereign Vanguard',
      targetProgress: 100,
      fortificationLevel: 5,
    },
  },

  // 7. BRAND-SPECIFIC EXPANDED MULTIVERSE QUESTS
  {
    id: 'q_mc_netherite_watchtower',
    title: 'Construct the Netherite Fortress Watchtower',
    category: 'fetch',
    brand: 'Minecraft',
    npcName: 'Alex Master Architect',
    npcAvatar: '⛏️',
    description: 'The Overworld fortress requires a fortified watchtower to defend against void incursion raiders. Mine obsidian blocks, craft diamond reinforcement trusses, and assemble the bedrock foundation.',
    instruction: 'Gather 12 Stone and 6 Wood from the overworld to assemble the watchtower scaffold.',
    targetKey: 'stone',
    targetCount: 12,
    reward: { coins: 380, xp: 320, item: 'netherite', itemCount: 2, cosmeticUnlockId: 'emblem_mc_nether_star' },
  },
  {
    id: 'q_rbx_cloud_100_tier_obby',
    title: 'Conquer the 100-Tier Cloud Obby',
    category: 'puzzle',
    brand: 'Roblox',
    npcName: 'Builderman (Crossroads Admin)',
    npcAvatar: '🟥',
    description: 'The Bloxian high-altitude parkour spire is swaying in the upper clouds. Speedrunners and jumpers must navigate spring pads, disappearing platforms, and laser grids to reach the apex.',
    instruction: 'Complete the neon parkour stage sequence without falling to unlock the Bloxian Trophy.',
    targetKey: 'puzzle_cloud_obby',
    targetCount: 1,
    puzzleData: {
      type: 'logic_circuit',
      prompt: 'Activate the neon leap triggers in sequence:',
      nodes: [
        { id: 'pad_spring', label: 'Bouncy Neon Trampoline', active: false },
        { id: 'pad_speed', label: 'Speed Coil Railing', active: false },
        { id: 'pad_apex', label: 'Apex Winner Star', active: false },
      ],
      solutionOrder: ['pad_spring', 'pad_speed', 'pad_apex'],
    },
    reward: { coins: 420, robux: 100, xp: 380, cosmeticUnlockId: 'hat_dominus' },
  },
  {
    id: 'q_xilam_missing_mallet',
    title: 'Solve the Case of the Missing 10-Ton Mallet',
    category: 'interaction',
    brand: 'Xilam',
    npcName: 'Oggy & Jack Detective Agency',
    npcAvatar: '🐱',
    description: 'Jack\'s prized 10-ton squeaking cartoon hammer has vanished from the tool shed! Interrogate the cockroach trio and search the kitchen cupboards to recover the comedy relic.',
    instruction: 'Speak with Jack and question Joey about the missing mallet hiding spot.',
    targetKey: 'dialogue_missing_mallet',
    targetCount: 1,
    dialogueData: {
      speakerGreeting: 'Meow! Someone pinched my favorite 10-ton comedy mallet right off the tool workbench!',
      loreNotes: 'Xilam slapstick comedy relics are indestructible and cause loud cartoon squeaks on impact.',
      options: [
        { label: 'Check inside the giant refrigerator behind the cheese block.', reply: 'Bingo! Joey hid it right behind the cheddar! Here is your finder reward!', progressGranted: 1 },
        { label: 'Ask Dee Dee if he traded it for a pizza slice.', reply: 'Dee Dee confessed! The mallet has been safely recovered!', progressGranted: 1 },
      ],
    },
    reward: { coins: 350, xp: 280, item: 'sharko_bloxy_swatter', itemCount: 1, cosmeticUnlockId: 'back_xilam_mallet' },
  },
  {
    id: 'q_bp_winter_solar_inverters',
    title: 'Calibrate the Winter Solstice Solar Inverters',
    category: 'puzzle',
    brand: 'BP',
    npcName: 'Chief Engineer Sarah (Helios Grid)',
    npcAvatar: '⚡',
    description: 'Low winter sun angles demand maximum photon capture efficiency. Synchronize the photovoltaic tilt inverters and balance thermal storage buffers to prevent blackout in Sodor and Tarragower.',
    instruction: 'Align the three solar tracking arrays with the winter solstice azimuth.',
    targetKey: 'puzzle_bp_solstice',
    targetCount: 1,
    puzzleData: {
      type: 'solar_valves',
      prompt: 'Rotate the three solar arrays to capture maximum photon flux:',
      nodes: [
        { id: 'array_dawn', label: 'East Photovoltaic Tracker', active: false },
        { id: 'array_noon', label: 'Zenith Fresnel Collector', active: false },
        { id: 'array_dusk', label: 'West Geothermal Radiator', active: false },
      ],
      solutionOrder: ['array_dawn', 'array_noon', 'array_dusk'],
    },
    reward: { coins: 400, xp: 350, item: 'helios_solar_core', itemCount: 2, cosmeticUnlockId: 'emblem_bp_sunburst' },
  },
  {
    id: 'q_tarragower_wayfinder_chart',
    title: 'Solve the Ancient Māori Wayfinding Star Chart',
    category: 'interaction',
    brand: 'Tarragower',
    npcName: 'Headmaster Vance & Scholar Tama',
    npcAvatar: '🏛️',
    description: 'Tarragower Academy researchers have unearthed an ancient Polynesian celestial navigation chart connecting the Southern Cross stars to the multiversal leyline coordinates.',
    instruction: 'Decipher the astronomical star positions with the academy scholars.',
    targetKey: 'dialogue_star_chart',
    targetCount: 1,
    dialogueData: {
      speakerGreeting: 'Greetings, scholar. The Southern Cross (Crux) aligns directly with the Aeternum rift and Sodor mainline.',
      loreNotes: 'Traditional voyagers navigated vast oceans without compasses, using bird flights, currents, and stars.',
      options: [
        { label: 'Align the Southern Cross pointers Alpha and Beta Centauri.', reply: 'The celestial bearings lock in! True south coordinates revealed!', progressGranted: 1 },
        { label: 'Cross-reference the star bearings with the Sodor railway timetable.', reply: 'Incredible! The rail lines follow the ancient voyaging trade winds!', progressGranted: 1 },
      ],
    },
    reward: { coins: 450, xp: 380, cosmeticUnlockId: 'aura_tarragower_runes' },
  },
  {
    id: 'q_mcd_holiday_feast_sodor',
    title: 'Deliver 50 Holiday Happy Meals to Sodor Hub',
    category: 'fetch',
    brand: 'McDonald\'s',
    npcName: 'Chef Ronald & Conductor',
    npcAvatar: '🍟',
    description: 'The Knapford station crowd is famished after holiday train delays! Pack up steaming fresh Happy Meals, golden crispy fries, and holiday milkshakes, then load them aboard Thomas\'s express freight cars.',
    instruction: 'Deliver 15 Wood and 5 Apples to Chef Ronald to assemble the holiday banquet crates.',
    targetKey: 'wood',
    targetCount: 15,
    reward: { coins: 480, xp: 360, item: 'apple', itemCount: 10, cosmeticUnlockId: 'shirt_mcdonalds_holiday' },
  },
  {
    id: 'q_yt_10m_charity_stream',
    title: 'Host the 10M Subscriber Multiverse Charity Livestream',
    category: 'interaction',
    brand: 'YouTube',
    npcName: 'Streamer Nova',
    npcAvatar: '▶️',
    description: 'The annual 24-hour holiday charity marathon is live! Shout out donor names, switch 4K cameras, and trigger confetti cannons to hit the 10 Million Coin community goal.',
    instruction: 'Complete the interactive streaming dialogue options to raise holiday charity funds.',
    targetKey: 'dialogue_charity_stream',
    targetCount: 1,
    dialogueData: {
      speakerGreeting: 'Chat is going wild! We are only 500,000 views away from hitting our multiverse hospital charity milestone!',
      loreNotes: 'YouTube streaming studios broadcast across all 11 dimensions with zero packet drop.',
      options: [
        { label: 'Drop a 1,000-subscriber hype train with golden fireworks!', reply: 'Chat explodes! $100,000 raised in seconds! Viewer meter is glowing red!', progressGranted: 1 },
        { label: 'Invite Polandball and Thomas to do a duet on stream!', reply: 'The stream peaked at 12 million concurrent viewers! Goal shattered!', progressGranted: 1 },
      ],
    },
    reward: { coins: 600, robux: 150, xp: 500, cosmeticUnlockId: 'back_yt_play_shield' },
  },
  {
    id: 'q_newworld_azoth_rift_purge',
    title: 'Purge the Corrupted Azoth Rift at Bastion Keep',
    category: 'fetch',
    brand: 'New World',
    npcName: 'Commander Thorne',
    npcAvatar: '⚔️',
    description: 'Red corrupted rifts are spewing forth frost fiends and shadowy void stalkers near Bastion Keep. Equip your enchanted battle gear, rally your guild squad, and collect corrupted catalyst cores to seal the dimensional tear!',
    instruction: 'Gather 10 Stone blocks from the Bastion ruins to reinforce the perimeter seal.',
    targetKey: 'stone',
    targetCount: 10,
    reward: { coins: 520, xp: 460, item: 'netherite', itemCount: 3, cosmeticUnlockId: 'shirt_newworld_gleamite' },
  },

  // ================= SPRUS ECONOMY QUESTS =================
  {
    id: 'q_tarragower_science_fair_prep',
    title: 'Tarragower School Science Fair & Redstone Exhibition',
    category: 'puzzle',
    brand: 'Tarragower',
    npcName: 'Headmaster Vance',
    npcAvatar: '🏛️',
    description: 'The annual Tarragower School Science Exhibition is underway! Help student scholars assemble logic sensors, calibrate solar converters, and earn official Sprus currency scholarships.',
    instruction: 'Solve the Tarragower laboratory logic schematic to power the exhibition hall.',
    targetKey: 'dialogue_tarragower_science',
    targetCount: 1,
    dialogueData: {
      speakerGreeting: 'Welcome to the Tarragower Academy Quadrangle! The science exhibition opens at noon, but the redstone clock circuit is uncalibrated.',
      loreNotes: 'Tarragower School awards accredited Sprus coin grants to students who master inter-dimensional engineering.',
      options: [
        { label: 'Connect the quartz comparator to the solar photovoltaic array.', reply: 'Brilliant logic! The power output is stabilized at 100%. Here is your Sprus grant!', progressGranted: 1 },
        { label: 'Re-align the acoustic harmonic sensor to 440 Hz.', reply: 'Splendid calibration! The clock tower is chiming with perfect resonance!', progressGranted: 1 },
      ],
    },
    reward: { coins: 450, xp: 320, cosmeticUnlockId: 'hat_tarragower_mortarboard' },
  },
  {
    id: 'q_roblox_minecraft_minigame_dash',
    title: 'Cross-Platform Mini-Game Championship: Obby & Resource Race',
    category: 'interaction',
    brand: 'Multiverse',
    participatingBrands: ['Roblox', 'Minecraft'],
    isCrossover: true,
    npcName: 'Builderman & Alex',
    npcAvatar: '🎮',
    description: 'Compete in high-energy cross-platform mini-games! Leap across floating neon obby platforms and mine speed blocks in the Resource Race to hoard massive Sprus payouts.',
    instruction: 'Participate in any cross-platform mini-game session to claim your Sprus purse.',
    targetKey: 'dialogue_minigame_dash',
    targetCount: 1,
    dialogueData: {
      speakerGreeting: 'Ready for the ultimate speedrun showdown? Bloxian parkour meets voxel mining!',
      loreNotes: 'Players across all connected platforms compete on unified servers for real Sprus rewards.',
      options: [
        { label: 'Equip speed coil and sprint through the Cloud Obby checkpoints!', reply: 'New record time! Crowd goes wild! You earned 500 Sprus coins and 50 Robux!', progressGranted: 1 },
        { label: 'Mine the gold trial nodes in the subterranean Resource Race!', reply: 'Full cart of raw ores! Master miner payout credited to your wallet!', progressGranted: 1 },
      ],
    },
    reward: { coins: 500, robux: 50, xp: 400, item: 'diamond', itemCount: 3 },
  },
  {
    id: 'q_youtube_sponsored_showcase',
    title: 'Watch Sponsored YouTube Creator Livestream & Community Builds',
    category: 'interaction',
    brand: 'YouTube',
    npcName: 'Streamer Nova',
    npcAvatar: '▶️',
    description: 'Tune into official in-game sponsored YouTube community livestreams! Watch builder showcases, learn speed-building tips, and earn passive Sprus drops every 5 minutes.',
    instruction: 'Watch the sponsored showcase broadcast in the YouTube Creator Studio Amphitheater.',
    targetKey: 'dialogue_youtube_sponsored',
    targetCount: 1,
    dialogueData: {
      speakerGreeting: 'Hey chat! Today our sponsor is BP Clean Solar Energy and the Tarragower Academy. Watch the build showcase to claim your viewer loot drop!',
      loreNotes: 'Watching verified sponsored content generates active Sprus ad-revenue share directly to player accounts.',
      options: [
        { label: 'Like the video, subscribe, and share the stream to the community feed!', reply: 'Superchat unlocked! 400 Sprus coins and 100 Robux Gems transferred to your balance!', progressGranted: 1 },
        { label: 'Clip the 360-no-scope building trick and post to social media!', reply: 'Viral clip hit #1 trending! Bonus viral creator aura awarded!', progressGranted: 1 },
      ],
    },
    reward: { coins: 400, robux: 100, xp: 350, cosmeticUnlockId: 'aura_yt_superchat_rain' },
  },
];

export const INITIAL_EVENTS: ScheduledEvent[] = [
  {
    id: 'evt_winter_convergence_boss_raid',
    title: 'The Great Multiverse Winter Convergence Boss Raid',
    type: 'boss_battle',
    brand: 'Multiverse & Christmas',
    bannerEmoji: '❄️',
    description: 'Jack Frost and the Ancient Permafrost Titan have frozen the central dimensional rifts! Players from all 11 brands (Minecraft builders, Roblox jumpers, Sodor steam engines, Countryball delegates, and New World crusaders) must join the server-wide raid pool and shatter the 15,000 HP Frost Shield!',
    serverTheme: 'Sub-Zero Aurora Glacier',
    hostName: 'Santa Steve & Frost Warden',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Holiday Raid',
    countdownSeconds: 2400,
    participantsCount: 88,
    maxParticipants: 120,
    modifiers: ['Server-Wide Team Health Pool', 'Frostbite Resistance Buff', 'Candy Cane Weapon 2x Damage', 'Mythic Winter Loot Chests'],
    voiceCoordination: 'Voice Channel 144.90 MHz: Call out ice crystal vulnerability phases and coordinate firework artillery!',
    collaborativeObjective: 'Shatter the Permafrost Titan\'s 15,000 HP ice armor before the winter solstice timer expires!',
    collaborativeProgress: 11420,
    collaborativeTarget: 15000,
    collaborativePerk: 'Awards 800 MegaCoins, 200 Robux, and the Mythic Glacial Crystal Ice Crown to all participants!',
    bossHp: 3580,
    maxBossHp: 15000,
    bossName: 'Jack Frost Permafrost Titan',
  },
  {
    id: 'evt_tri_multiverse_boss_raid',
    title: 'Grand Multiverse Convergence: The Corrupted 1x1x1x1 Wither Titan',
    type: 'boss_battle',
    brand: 'Minecraft, Roblox, Countryballs & Xilam',
    bannerEmoji: '👾',
    description: 'The legendary corrupted glitch lord 1x1x1x1 has merged with a Three-Headed Nether Wither and stolen the golden slapstick swatters! All players across all platforms must assemble, coordinate target calls, break the corrupted matrix shields, and conquer this multiversal calamity!',
    serverTheme: 'Fractured Glitch Void Caldera',
    hostName: 'Builderman & Steve & Polandball (Admins)',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Multiverse Raid',
    countdownSeconds: 1440,
    participantsCount: 46,
    maxParticipants: 60,
    modifiers: ['Server-Wide Team Health Pool', 'Collaborative Shield Generation', '3x Enchanted Weapon Damage', 'Legendary Matrix Drops'],
    voiceCoordination: 'Voice frequency 144.50 MHz: Call out shield vulnerability phases (Void, Fire, Glitch) and focus-fire with your squad!',
    collaborativeObjective: 'Collaborative Server Damage Pool: Break the 10,000 HP matrix barrier before the rift timer expires!',
    collaborativeProgress: 6850,
    collaborativeTarget: 10000,
    collaborativePerk: 'When defeated, all participants unlock 500 MegaCoins, 150 Robux Gems, and the Mythic Glitch Titan Trophy!',
    bossHp: 3150,
    maxBossHp: 10000,
    bossName: 'Corrupted 1x1x1x1 Wither Matrix Titan',
  },
  {
    id: 'evt_mcdonalds_youtube_collab_relay',
    title: 'The Global 24-Hour Charity Stream & Drive-Thru Relay',
    type: 'festival',
    brand: 'McDonald\'s, YouTube & Minecraft',
    bannerEmoji: '🌟',
    description: 'Chef Ronald and Streamer Nova are hosting a global collaborative charity stream! The entire server works together to deliver 500 gourmet Happy Meals to needy overworld villagers. Live cheering and singing in spatial voice chat boosts the server-wide hype meter!',
    serverTheme: 'Golden Arches Broadcast Amphitheater',
    hostName: 'Chef Ronald & Streamer Nova',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Collaborative Festival',
    countdownSeconds: 1800,
    participantsCount: 128,
    maxParticipants: 200,
    modifiers: ['Collaborative Server Delivery Meter', 'Voice Hype Decibel Multipliers', 'Golden Balloon Supply Drops', 'Global 3x Coin & XP Server Buff'],
    voiceCoordination: 'Join Voice Chat [C] or call out order tickets to increase the server-wide charity viewer count!',
    collaborativeObjective: 'Server Community Goal: Deliver 500 Happy Meals collectively across all biomes!',
    collaborativeProgress: 365,
    collaborativeTarget: 500,
    collaborativePerk: 'Reaching 500 delivers server-wide 3x Coin & XP multiplier and Diamond Play Button Auras for everyone!',
  },
  {
    id: 'evt_bloxy_parkour',
    title: 'MegaWorld Bloxy Parkour Championship',
    type: 'tournament',
    brand: 'Roblox & Minecraft',
    bannerEmoji: '🏆',
    description: 'High-speed jumping obstacle course spanning floating sky islands! Speed and Gravity Coils permitted. Top 3 speedrunners receive mythic trophies.',
    serverTheme: 'Sky High Floating Obby',
    hostName: 'Builderman (Admin)',
    status: 'LIVE_NOW',
    scheduledTime: 'Today at 21:00 UTC',
    countdownSeconds: 840,
    participantsCount: 38,
    maxParticipants: 50,
    modifiers: ['Low Gravity', 'Double Jump', 'No Fall Damage', 'Speed Coil Boost'],
  },
  {
    id: 'evt_countryballs_gala',
    title: 'Countryballs United Fireworks Festival',
    type: 'festival',
    brand: 'Countryballs',
    bannerEmoji: '🎆',
    description: 'Global celebration of peace and unity! Sovereign delegates from all 48 nations meet in the Grand Capitol for firework mortars and double XP trading.',
    serverTheme: 'Capitol Diplomatic Plaza',
    hostName: 'Polandball & Friends',
    status: 'UPCOMING',
    scheduledTime: 'Tomorrow at 18:00 UTC',
    countdownSeconds: 3600,
    participantsCount: 64,
    maxParticipants: 100,
    modifiers: ['2x XP Multiplier', 'Infinite Firework Mortars', 'Safe Zone (No PvP)', 'Free Tea Stalls'],
  },
  {
    id: 'evt_boss_sharko_titan',
    title: 'Raid Boss: Ender-Sharko & Void Titan',
    type: 'boss_battle',
    brand: 'Xilam & Minecraft',
    bannerEmoji: '🐲',
    description: 'A 50-foot mutated shark-dragon colossus has emerged from the subterranean dimensional rift! Coordinate with other players to break its armor shields.',
    serverTheme: 'Subterranean Caldera',
    hostName: 'Elder Silas & Sharko',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Raid',
    countdownSeconds: 1420,
    participantsCount: 22,
    maxParticipants: 30,
    modifiers: ['Team Health Pool', 'Slapstick Knockback', 'Enchanted Weapons 2x', 'Epic Boss Drops'],
    bossHp: 3450,
    maxBossHp: 5000,
    bossName: 'Ender-Sharko The Void Devourer',
  },
  {
    id: 'evt_mcdonalds_hunt',
    title: 'McDonald\'s Happy Meal Hunt',
    type: 'festival',
    brand: 'McDonald\'s',
    bannerEmoji: '🍟',
    description: 'Golden Happy Meal surprise boxes are hidden across all wilderness biomes! Cooperate across servers to gather boxes and unlock the Golden Arches Chef Hat & Happy Meal Toy curio.',
    serverTheme: 'Golden Arches Central Plaza',
    hostName: 'Chef Pierre & Ronald',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Festival',
    countdownSeconds: 1650,
    participantsCount: 84,
    maxParticipants: 120,
    modifiers: ['2x Food Saturation', 'Golden Box Proximity Chimes', 'Speed Boost Pads', 'Community Chest Drops'],
  },
  {
    id: 'evt_xilam_fest',
    title: 'Xilam Animation Festival',
    type: 'festival',
    brand: 'Xilam',
    bannerEmoji: '🐱',
    description: 'Cartoon slapstick celebration with Oggy, Jack, Joey, and Sharko! Features the Slapstick Flyswatter arena, Oggy soundboard tunes, and double comedy knockback velocity physics.',
    serverTheme: 'Cartoon Suburbia & Deep Lagoon',
    hostName: 'Oggy, Jack & Sharko',
    status: 'UPCOMING',
    scheduledTime: 'In 35 Minutes',
    countdownSeconds: 2100,
    participantsCount: 52,
    maxParticipants: 80,
    modifiers: ['3x Weapon Knockback', 'Cartoon Squeak Sound FX', 'Low Gravity Trampolines', 'Free Flyswatters'],
  },
  {
    id: 'evt_mcdonalds_rally',
    title: 'McDonald\'s x BP Golden Desert Grand Prix',
    type: 'tournament',
    brand: 'McDonald\'s & BP',
    bannerEmoji: '🏎️',
    description: 'Roar across the Great Dune Desert with bio-solar speed carts! Grab golden burger power-ups and hit turbo fuel pads for maximum velocity.',
    serverTheme: 'Desert Golden Speedway',
    hostName: 'Chef Pierre & Helios Tech',
    status: 'UPCOMING',
    scheduledTime: 'In 2 Hours',
    countdownSeconds: 7200,
    participantsCount: 19,
    maxParticipants: 40,
    modifiers: ['Turbo Fuel Boost Pads', 'Golden Apple Nitro', 'Checkpoint Gates'],
  },
  {
    id: 'evt_nz_waitangi',
    title: 'Aotearoa Waitangi Tribal Gathering & Lantern Flotilla',
    type: 'festival',
    brand: 'NZ',
    bannerEmoji: '🌿',
    description: 'Annual cultural festival uniting players beneath the Southern Cross! Traditional Haka performances, Waka canoe flotillas, Pounamu jade carving stalls, and Southern Lights fireworks.',
    serverTheme: 'Waitangi Coastal Haven',
    hostName: 'Chief Tamati & Rangatira Guild',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Festival',
    countdownSeconds: 1980,
    participantsCount: 76,
    maxParticipants: 100,
    modifiers: ['3x Navigation Speed', 'Southern Lights Bioluminescence', 'Safe Zone (No PvP)', 'Free Pounamu Carvings'],
  },
  {
    id: 'evt_youtube_stream',
    title: 'YouTube 100K Creator Celebration Live Raid',
    type: 'tournament',
    brand: 'YouTube',
    bannerEmoji: '▶️',
    description: 'Global live-streamed creative building showcase with millions of viewers! Top builds earn Diamond Play Button awards and viral recognition.',
    serverTheme: 'YouTube Creator Amphitheater',
    hostName: 'Streamer Nova',
    status: 'UPCOMING',
    scheduledTime: 'In 45 Minutes',
    countdownSeconds: 2700,
    participantsCount: 88,
    maxParticipants: 150,
    modifiers: ['2x XP Multiplier', 'Hype Emote Chat Broadcasts', 'Viral Particle Trails'],
  },
  {
    id: 'evt_newworld_siege',
    title: 'Aeternum 50v50 Faction Territory Siege',
    type: 'tournament',
    brand: 'New World',
    bannerEmoji: '⚔️',
    description: 'Epic faction war for Fort Everfall! Syndicate, Marauders, and Covenant clash with siege weapons, cannons, and Azoth power crystals.',
    serverTheme: 'Everfall Bastion Citadel',
    hostName: 'Commander Thorne',
    status: 'LIVE_NOW',
    scheduledTime: 'Active War',
    countdownSeconds: 1520,
    participantsCount: 92,
    maxParticipants: 100,
    modifiers: ['Siege Cannons Active', 'Territory Tax Payouts', 'Faction Battle Cries', 'Fortress Wall Breaches'],
  },
  {
    id: 'evt_tarragower_science',
    title: 'Tarragower Annual Redstone & Science Olympiad',
    type: 'tournament',
    brand: 'Tarragower',
    bannerEmoji: '🏛️',
    description: 'Scholars compete in redstone logic circuits, architecture blueprints, and alchemy brewing. Top architects win the Tarragower Honor Crest.',
    serverTheme: 'Tarragower Great Hall & Quad',
    hostName: 'Prof. Alistair',
    status: 'UPCOMING',
    scheduledTime: 'In 1 Hour',
    countdownSeconds: 3600,
    participantsCount: 44,
    maxParticipants: 60,
    modifiers: ['3x Puzzle XP', 'Free Blueprint Hints', 'Redstone Wire Proximity Glow'],
  },
  {
    id: 'evt_youtube_stream_raid',
    title: 'YouTube Multiverse Viral Stream Raid',
    type: 'festival',
    brand: 'YouTube',
    bannerEmoji: '▶️',
    description: 'Nova is hosting a live cross-server raid with over 10 million concurrent viewers! Players in the broadcasting sector who cheer, sing, or talk into Proximity Voice Chat fill the global Hype Meter, unlocking 2x XP and Diamond Playbutton auras for all.',
    serverTheme: 'Amphitheater Broadcast Stage',
    hostName: 'Streamer Nova & YouTube Staff',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Raid Stream',
    countdownSeconds: 1200,
    participantsCount: 114,
    maxParticipants: 150,
    modifiers: ['2x XP Multiplier', 'Voice Hype Decibel Multiplier', 'Viral Golden Fireworks', 'Subscriber Superchat Rain'],
    voiceCoordination: 'Transmit in Proximity Voice Chat [V] or use speech wheel to pump the global Hype Meter to 10,000 decibels!',
  },
  {
    id: 'evt_minecraft_warden_siege',
    title: 'Minecraft Nether Warden Cave-In Siege',
    type: 'boss_battle',
    brand: 'Minecraft',
    bannerEmoji: '👁️',
    description: 'A subterranean acoustic tremor has unleashed the mutated Nether Warden Titan! Its sonic boom tracks sound vibrations. Squads must whisper in Proximity Voice Chat to sneak crying obsidian bombs into its blind spot.',
    serverTheme: 'Deep Dark Obsidian Cavern',
    hostName: 'Cartographer Barnaby & Silas',
    status: 'LIVE_NOW',
    scheduledTime: 'Active Raid Boss',
    countdownSeconds: 1680,
    participantsCount: 26,
    maxParticipants: 35,
    modifiers: ['Sculk Sensor Acoustic Sensitivity', 'Whisper Voice Chat Stealth Mode', 'Sonic Boom Knockback', 'Legendary Netherite Drops'],
    voiceCoordination: 'Coordinate quietly using low-volume Voice Radar [C] so as not to agitate the Warden\'s acoustic antennas!',
    bossHp: 6800,
    maxBossHp: 8000,
    bossName: 'Obsidian Nether Warden Titan',
  },
  {
    id: 'evt_mcdonalds_carnival',
    title: 'McDonald\'s Happy Meal Midnight Carnival',
    type: 'festival',
    brand: 'McDonald\'s',
    bannerEmoji: '🍟',
    description: 'The Golden Arches illuminate the night sky as hot air balloons drop golden combo crates across all wilderness biomes! Players who greet and welcome newcomers over spatial voice chat earn Golden Fry Wings and Happy Meal Toys.',
    serverTheme: 'Golden Arches Festival Plaza',
    hostName: 'Chef Ronald & Crew',
    status: 'UPCOMING',
    scheduledTime: 'In 20 Minutes',
    countdownSeconds: 1200,
    participantsCount: 95,
    maxParticipants: 120,
    modifiers: ['Infinite Golden Fry Saturation', 'Balloon Crate Air Drops', 'Speed Boost Trampolines', 'Voice Welcoming Gift Boxes'],
    voiceCoordination: 'Welcome newcomers via Voice Chat [C] or say "Happy Meal Welcome!" to receive Golden Fry Wings!',
  },
  {
    id: 'evt_mcdonalds_invasion',
    title: 'Sudden McDonald\'s Fry Invasion & Giant Grimace Raid',
    type: 'boss_battle',
    brand: 'McDonald\'s & Xilam',
    bannerEmoji: '🍟',
    description: 'Giant mechanized burger crates and golden fry invaders are descending on Landmark 4! Coordinate over Voice Radar (146.50 MHz) to dismantle the invading fleet and defeat Giant Grimace!',
    serverTheme: 'Landmark 4 Golden Arches Plaza',
    hostName: 'Chef Ronald & Oggy Defense Guard',
    status: 'LIVE_NOW',
    scheduledTime: 'Active World Invasion',
    countdownSeconds: 1100,
    participantsCount: 34,
    maxParticipants: 45,
    modifiers: ['Golden Fry Rain', 'Voice Radar Target Callouts', 'Sizzling Spatula Knockback', 'Legendary Grimace Shake Drops'],
    voiceCoordination: 'Voice channel 146.50 MHz: Call out incoming fry bombs and coordinate focus-fire on Giant Grimace!',
    bossHp: 4200,
    maxBossHp: 5000,
    bossName: 'Giant Mechanized Grimace & The Fry Legion',
  },
  {
    id: 'evt_roblox_build_comp',
    title: 'Roblox Crossroads 200B Block Building Championship',
    type: 'tournament',
    brand: 'Roblox & Minecraft',
    bannerEmoji: '🏗️',
    description: 'Live cross-platform building competition! Players have 15 minutes to construct the most creative sky obby or monument using stud blocks and redstone. Voice commentary is live on 145.80 MHz!',
    serverTheme: 'Crossroads Creative Baseplate',
    hostName: 'Builderman (Lead Admin)',
    status: 'UPCOMING',
    scheduledTime: 'In 15 Minutes',
    countdownSeconds: 900,
    participantsCount: 48,
    maxParticipants: 64,
    modifiers: ['Infinite Stud Blocks', 'Fly Mode Enabled', 'Judge Scoring System', 'Mythic Linked Hyper-Sword Prize'],
    voiceCoordination: 'Voice frequency 145.80 MHz: Live commentary, judge ratings, and team builder voice channels!',
  },
];

export const INITIAL_RANDOM_OCCURRENCES: RandomOccurrence[] = [
  {
    id: 'rnd_mcdonalds_fry_shower',
    name: 'Sudden McDonald\'s Golden Fry Meteor Shower',
    brand: 'McDonald\'s',
    icon: '🍟',
    description: 'Glowing golden french fry meteors are raining across wilderness biomes! Gather them before they dissolve to claim rare Golden Arches Spatulas!',
    objective: 'Gather 5 Golden Fry meteors in the wilderness zone',
    remainingSeconds: 240,
    totalSeconds: 240,
    reward: { coins: 300, xp: 250, item: 'mcdonalds_spatula' },
    crossServerParticipants: 182,
    activeStatus: 'ACTIVE',
    progressCount: 2,
    targetCount: 5,
  },
  {
    id: 'rnd_roblox_stud_storm',
    name: 'Roblox Glitch Storm & Falling Studs',
    brand: 'Roblox',
    icon: '⚡',
    description: 'A matrix glitch is causing gravity coils and neon studs to rain across the baseplate! Catch floating coils!',
    objective: 'Capture 4 floating gravity coils before despawn',
    remainingSeconds: 310,
    totalSeconds: 320,
    reward: { coins: 250, robux: 100, xp: 200, item: 'gravity_coil_rig' },
    crossServerParticipants: 140,
    activeStatus: 'ACTIVE',
    progressCount: 1,
    targetCount: 4,
  },
  {
    id: 'rnd_sprunki_void_outbreak',
    name: 'Sprunki Void Resonance Alert',
    brand: 'Sprunki',
    icon: '🎶',
    description: 'Corrupted void frequencies detected! Play any Jukebox disc to counter the harmonic resonance and protect the realm!',
    objective: 'Play a music disc or strike 3 void echoes',
    remainingSeconds: 280,
    totalSeconds: 280,
    reward: { coins: 350, xp: 300, item: 'sprunki_sword' },
    crossServerParticipants: 195,
    activeStatus: 'ACTIVE',
    progressCount: 0,
    targetCount: 3,
  },
  {
    id: 'rnd_roblox_party',
    name: 'Roblox Block Party',
    brand: 'Roblox',
    icon: '🪩',
    description: 'Spontaneous disco stage spawns in the square! Glowing Bloxburg music notes are falling from the sky.',
    objective: 'Collect 5 Disco Beat pickups or groove with 3 fellow players',
    remainingSeconds: 295,
    totalSeconds: 300,
    reward: { coins: 150, robux: 50, xp: 120, item: 'speed_coil' },
    crossServerParticipants: 156,
    activeStatus: 'ACTIVE',
    progressCount: 2,
    targetCount: 5,
  },
  {
    id: 'rnd_minecraft_dungeon',
    name: 'Minecraft Dungeon Raid',
    brand: 'Minecraft',
    icon: '💀',
    description: 'An ancient crypt seal has broken in the underground caverns! Undead skeletons and creepers are surging.',
    objective: 'Slay 5 subterranean crypt monsters before the dimensional rift closes',
    remainingSeconds: 410,
    totalSeconds: 420,
    reward: { coins: 250, xp: 200, item: 'diamond' },
    crossServerParticipants: 218,
    activeStatus: 'ACTIVE',
    progressCount: 1,
    targetCount: 5,
  },
  {
    id: 'rnd_sharko_tide',
    name: 'Sharko High Tide Alert',
    brand: 'Xilam',
    icon: '🌊',
    description: 'A glowing oceanic flash tide has washed iridescent sea pearls and friendly tropical dolphins ashore!',
    objective: 'Gather 4 Shimmering Coral Pearls along the waterfront',
    remainingSeconds: 340,
    totalSeconds: 360,
    reward: { coins: 180, xp: 160, item: 'golden_apple' },
    crossServerParticipants: 94,
    activeStatus: 'ACTIVE',
    progressCount: 0,
    targetCount: 4,
  },
  {
    id: 'rnd_bp_solar',
    name: 'BP Solar Flare Overcharge',
    brand: 'BP',
    icon: '⚡',
    description: 'A burst of clean solar power blankets the realm, supercharging all crafting furnaces to 5x instantaneous speed!',
    objective: 'Smelt 4 ores or craft 6 items during the energy surge',
    remainingSeconds: 230,
    totalSeconds: 240,
    reward: { coins: 160, xp: 140, item: 'gold' },
    crossServerParticipants: 110,
    activeStatus: 'ACTIVE',
    progressCount: 3,
    targetCount: 4,
  },
];

export const INITIAL_COMMUNITY_GOAL: CommunityGoal = {
  totalPoints: 2840,
  maxTarget: 5000,
  tier1Unlocked: true, // 1500: +20% Coin multiplier for all active servers
  tier2Unlocked: false, // 3500: 2x Mining & Harvest yield
  tier3Unlocked: false, // 5000: Mythic "World Unifier" Title & Crown
};

export const INITIAL_SERVERS: CustomServer[] = [
  {
    id: 'srv_megacity_rp',
    name: 'MegaWorld Official #1: All-Star Roleplay',
    hostUid: 'admin-megaworld',
    hostName: 'MegaWorld Staff',
    theme: 'cross_brand',
    region: 'US-East (Virginia)',
    playerCount: 42,
    maxPlayers: 64,
    pvpEnabled: false,
    gravity: 'normal',
    speedMultiplier: 1.0,
    keepInventory: true,
    activeEventTitle: 'Bloxy Parkour Championship',
    isOnline: true,
  },
  {
    id: 'srv_hardcore_survival',
    name: 'Polandball & Steve\'s Hardcore Frontier',
    hostUid: 'host_poland',
    hostName: 'Polandball_Miner',
    theme: 'minecraft',
    region: 'EU-Central (Frankfurt)',
    playerCount: 18,
    maxPlayers: 32,
    pvpEnabled: true,
    gravity: 'normal',
    speedMultiplier: 1.1,
    keepInventory: false,
    activeEventTitle: 'Night Nether Incursion',
    isOnline: true,
  },
  {
    id: 'srv_roblox_obby_chaos',
    name: 'Robloxian Obby Mania & Low-Gravity Parkour',
    hostUid: 'host_builder',
    hostName: 'Builderman_Pro',
    theme: 'roblox',
    region: 'US-West (Oregon)',
    playerCount: 27,
    maxPlayers: 40,
    pvpEnabled: false,
    gravity: 'low',
    speedMultiplier: 1.4,
    keepInventory: true,
    isOnline: true,
  },
  {
    id: 'srv_xilam_slapstick',
    name: 'Oggy & Sharko\'s Cartoon Slapstick Havoc',
    hostUid: 'host_oggy',
    hostName: 'OggyTheCat',
    theme: 'xilam',
    region: 'Asia-East (Tokyo)',
    playerCount: 14,
    maxPlayers: 24,
    pvpEnabled: true,
    gravity: 'normal',
    speedMultiplier: 1.25,
    keepInventory: true,
    activeEventTitle: 'Raid Boss: Ender-Sharko',
    isOnline: true,
  },
];

const QUEST_STORAGE_KEY = 'megaworld_player_quests_state_v1';
const SERVER_STORAGE_KEY = 'megaworld_custom_servers_v1';

export interface PlayerQuestsState {
  completedQuestIds: string[];
  activeQuestProgress: Record<string, number>; // questId -> progress count
  claimedRewards: string[];
  bossDamageDealt: number;
}

const DEFAULT_QUESTS_STATE: PlayerQuestsState = {
  completedQuestIds: [],
  activeQuestProgress: {
    q_oggy_kitchen: 4,
    q_polandball_launchpad: 7,
    q_sharko_beach_patrol: 2,
    q_roblox_sword_duel: 5,
  },
  claimedRewards: [],
  bossDamageDealt: 120,
};

export const questEventManager = {
  getLocalState(): PlayerQuestsState {
    try {
      const stored = localStorage.getItem(QUEST_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_QUESTS_STATE, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Error reading quest state:', e);
    }
    return DEFAULT_QUESTS_STATE;
  },

  saveLocalState(state: PlayerQuestsState) {
    try {
      localStorage.setItem(QUEST_STORAGE_KEY, JSON.stringify(state));
      window.dispatchEvent(new CustomEvent('megaworld_quests_updated', { detail: state }));
    } catch (e) {
      console.warn('Error saving quest state:', e);
    }
  },

  async loadFromCloud(uid: string): Promise<PlayerQuestsState> {
    if (!uid || uid === 'guest-player') {
      return this.getLocalState();
    }
    try {
      const docRef = doc(db, 'player_quests', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const cloudState = snap.data() as PlayerQuestsState;
        const merged = { ...DEFAULT_QUESTS_STATE, ...cloudState };
        this.saveLocalState(merged);
        return merged;
      }
    } catch (e) {
      console.warn('Failed to load quests from cloud:', e);
    }
    return this.getLocalState();
  },

  async saveToCloud(uid: string, state: PlayerQuestsState): Promise<void> {
    this.saveLocalState(state);
    if (!uid || uid === 'guest-player') return;
    try {
      const docRef = doc(db, 'player_quests', uid);
      await setDoc(docRef, { ...state, lastUpdated: Date.now() }, { merge: true });
    } catch (e) {
      console.error('Failed to sync quests to cloud:', e);
    }
  },

  advanceProgress(state: PlayerQuestsState, questId: string, amount: number = 1): PlayerQuestsState {
    const quest = QUESTS_CATALOG.find((q) => q.id === questId);
    if (!quest) return state;

    const current = state.activeQuestProgress[questId] || 0;
    const nextVal = Math.min(quest.targetCount, current + amount);
    const updatedProgress = { ...state.activeQuestProgress, [questId]: nextVal };

    const newlyCompleted = nextVal >= quest.targetCount && !state.completedQuestIds.includes(questId);
    const updatedCompleted = newlyCompleted 
      ? [...state.completedQuestIds, questId] 
      : state.completedQuestIds;

    return {
      ...state,
      activeQuestProgress: updatedProgress,
      completedQuestIds: updatedCompleted,
    };
  },

  claimReward(state: PlayerQuestsState, questId: string): { state: PlayerQuestsState; reward: QuestReward } {
    const quest = QUESTS_CATALOG.find((q) => q.id === questId);
    if (!quest) throw new Error('Quest definition not found');
    if (state.claimedRewards.includes(questId)) {
      throw new Error('Reward has already been claimed for this quest');
    }

    const updatedState: PlayerQuestsState = {
      ...state,
      claimedRewards: [...state.claimedRewards, questId],
    };

    return { state: updatedState, reward: quest.reward };
  },

  getServers(): CustomServer[] {
    try {
      const stored = localStorage.getItem(SERVER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading servers:', e);
    }
    return INITIAL_SERVERS;
  },

  saveServers(servers: CustomServer[]) {
    try {
      localStorage.setItem(SERVER_STORAGE_KEY, JSON.stringify(servers));
    } catch (e) {
      console.warn('Error saving servers:', e);
    }
  },

  addCustomServer(newServer: CustomServer): CustomServer[] {
    const current = this.getServers();
    const updated = [newServer, ...current];
    this.saveServers(updated);
    return updated;
  },

  // GLOBAL EVENT SCHEDULING, ANNOUNCEMENT & MANAGEMENT
  getEvents(): ScheduledEvent[] {
    const EVENTS_STORAGE_KEY = 'megaworld_scheduled_events_v2';
    try {
      const stored = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((e: ScheduledEvent) => ({
            ...e,
            accessiblePlatforms: e.accessiblePlatforms || ['Minecraft', 'Roblox', 'Xilam', 'NZ Tarragower School', 'BP', 'McDonald\'s', 'YouTube', 'New World'],
            participationRules: e.participationRules || [
              'Open to all verified server wanderers and faction champions.',
              'Cross-platform voice chat coordination enabled on frequency 144.50 MHz.',
              'No forbidden exploit items or griefing in event neutral zones.',
              'Fair loot distribution governed by smart escrow contracts.'
            ],
            rewardTiers: e.rewardTiers || [
              { tierName: 'Champion (Gold)', requirement: 'Top 1% or Victory Boss Finisher', coins: 1000, robux: 250, badgeTitle: 'Grand Multiverse Champion' },
              { tierName: 'Elite (Silver)', requirement: 'Top 25% Objective Contribution', coins: 500, robux: 100, badgeTitle: 'Silver Vanguard' },
              { tierName: 'Hero (Bronze)', requirement: 'Completed Core Event Checklist', coins: 250, robux: 50, badgeTitle: 'Cross-Brand Contributor' },
              { tierName: 'Participant', requirement: 'Checked in & Logged Attendance', coins: 100, badgeTitle: 'Event Attendee' },
            ]
          }));
        }
      }
    } catch (e) {
      console.warn('Error reading scheduled events:', e);
    }

    return INITIAL_EVENTS.map((e) => ({
      ...e,
      accessiblePlatforms: e.accessiblePlatforms || ['Minecraft', 'Roblox', 'Xilam', 'NZ Tarragower School', 'BP', 'McDonald\'s', 'YouTube', 'New World'],
      participationRules: e.participationRules || [
        'Open to players across all 8 integrated platforms.',
        'Proximity Voice Chat enabled with team tactical radio callouts.',
        'Cooperative objectives reward all active squad members equally.',
        'PvP rules adapt dynamically based on server region.'
      ],
      rewardTiers: e.rewardTiers || [
        { tierName: 'Grand Champion', requirement: '1st Place or Final Raid Strike', coins: 800, robux: 200, badgeTitle: 'Multiverse Grand Master' },
        { tierName: 'Honorary Vanguard', requirement: 'High Damage / Delivery Output', coins: 450, robux: 80, badgeTitle: 'Vanguard Hero' },
        { tierName: 'All-Star Participant', requirement: 'Active Participation in Event Pool', coins: 200, robux: 25, badgeTitle: 'Event Veteran' },
      ]
    }));
  },

  saveEvents(events: ScheduledEvent[]) {
    const EVENTS_STORAGE_KEY = 'megaworld_scheduled_events_v2';
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      window.dispatchEvent(new CustomEvent('megaworld_events_updated', { detail: events }));
    } catch (e) {
      console.warn('Error saving events:', e);
    }
  },

  scheduleEvent(eventData: Omit<ScheduledEvent, 'id' | 'countdownSeconds' | 'status'>): ScheduledEvent {
    const newId = `evt_custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const newEvent: ScheduledEvent = {
      ...eventData,
      id: newId,
      status: 'UPCOMING',
      countdownSeconds: 1800,
      participantsCount: 1,
      announcementBroadcast: eventData.announcementBroadcast || `📢 NEW GLOBAL EVENT SCHEDULED: "${eventData.title}" hosted by ${eventData.hostName}!`,
      accessiblePlatforms: eventData.accessiblePlatforms && eventData.accessiblePlatforms.length > 0 
        ? eventData.accessiblePlatforms 
        : ['Minecraft', 'Roblox', 'Xilam', 'NZ Tarragower School', 'BP', 'McDonald\'s', 'YouTube', 'New World'],
      participationRules: eventData.participationRules && eventData.participationRules.length > 0
        ? eventData.participationRules
        : [
            'All registered player avatars may enter regardless of home realm.',
            'Maintain sportsmanship in global text and proximity voice chat.',
            'Rewards sent directly to cross-platform inventory upon conclusion.'
          ],
      rewardTiers: eventData.rewardTiers && eventData.rewardTiers.length > 0
        ? eventData.rewardTiers
        : [
            { tierName: '1st Place / MVP', requirement: 'Top Score or Boss Elimination', coins: 600, robux: 150, badgeTitle: 'Event MVP' },
            { tierName: 'Runner Up', requirement: 'Top 10% Score', coins: 350, robux: 75, badgeTitle: 'Silver Contender' },
            { tierName: 'Participation', requirement: 'Complete at least 1 objective', coins: 150, badgeTitle: 'Verified Entrant' },
          ],
    };

    const currentEvents = this.getEvents();
    const updated = [newEvent, ...currentEvents];
    this.saveEvents(updated);
    this.broadcastAnnouncement(newEvent.id, newEvent.announcementBroadcast);
    return newEvent;
  },

  broadcastAnnouncement(eventId: string, message?: string) {
    const current = this.getEvents();
    const event = current.find((e) => e.id === eventId);
    const title = event?.title || 'Global Multiverse Event';
    const broadcastText = message || `📢 MULTIVERSE BROADCAST: "${title}" is officially live across all connected platforms!`;

    try {
      audioEngine.playRobloxSound('badge');
    } catch {
      // Audio fallback
    }

    window.dispatchEvent(new CustomEvent('megaworld_global_announcement', {
      detail: {
        eventId,
        title,
        message: broadcastText,
        timestamp: Date.now(),
      }
    }));
  },

  deleteEvent(eventId: string): boolean {
    const current = this.getEvents();
    const filtered = current.filter((e) => e.id !== eventId);
    this.saveEvents(filtered);
    return true;
  },

  joinEvent(eventId: string): { success: boolean; message: string; event: ScheduledEvent } {
    const current = this.getEvents();
    const idx = current.findIndex((e) => e.id === eventId);
    if (idx === -1) {
      throw new Error('Event not found');
    }

    const event = current[idx];
    if (event.participantsCount >= event.maxParticipants) {
      return { success: false, message: 'Event is already full at maximum capacity!', event };
    }

    const updatedEvent: ScheduledEvent = {
      ...event,
      participantsCount: event.participantsCount + 1,
    };
    current[idx] = updatedEvent;
    this.saveEvents(current);

    try {
      audioEngine.playRobloxSound('click');
    } catch {
      // Audio fallback
    }

    const platformsText = event.accessiblePlatforms && event.accessiblePlatforms.length > 0
      ? event.accessiblePlatforms.join(', ')
      : 'All Connected Platforms';

    return { 
      success: true, 
      message: `Successfully joined ${event.title}! Cross-platform sync active across ${platformsText}.`,
      event: updatedEvent 
    };
  }
};

