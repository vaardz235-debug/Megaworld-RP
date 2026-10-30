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
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World';
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

export interface ScheduledEvent {
  id: string;
  title: string;
  type: 'tournament' | 'festival' | 'boss_battle';
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
  // Voice Coordination & Cross-Player Collaboration
  voiceCoordination?: string;
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
];

export const INITIAL_EVENTS: ScheduledEvent[] = [
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
];

export const INITIAL_RANDOM_OCCURRENCES: RandomOccurrence[] = [
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
  }
};
