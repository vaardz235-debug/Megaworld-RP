/**
 * In-Game Multi-Brand Virtual Marketplace & Trader Reputation System
 * Supports Minecraft, Roblox, Countryballs, Xilam, and Brand Crossover Items.
 */

import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { avatarManager } from './avatarManager';

export interface MarketItem {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World' | 'Universal' | 'Sprunki' | 'NZ' | 'Thomas & Friends';
  category: 'weapons' | 'tools' | 'blocks' | 'consumables' | 'accessories' | 'curios' | 'materials' | 'food';
  price: number;
  currency: 'coins' | 'robux';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  description: string;
  sellerUid: string;
  sellerName: string;
  sellerReputation: number;
  sellerTrades: number;
  sellerBadges: string[];
  stock: number;
  listedAt: number;
}

export interface TransactionReceipt {
  id: string;
  itemId: string;
  itemName: string;
  sellerName: string;
  buyerName: string;
  amount: number;
  currency: 'coins' | 'robux';
  timestamp: number;
  status: 'COMPLETED_ESCROW';
}

export const DEFAULT_MARKET_ITEMS: MarketItem[] = [
  // MINECRAFT ITEMS
  {
    id: 'mkt_diamond_sword',
    name: 'Enchanted Sharpness V Diamond Sword',
    brand: 'Minecraft',
    category: 'weapons',
    price: 320,
    currency: 'coins',
    rarity: 'epic',
    icon: '🗡️',
    description: 'Forged from deep-cavern diamonds with shimmering purple enchantment glint and +8 attack damage.',
    sellerUid: 'trader_steve_pro',
    sellerName: 'Steve_The_Miner',
    sellerReputation: 4.9,
    sellerTrades: 124,
    sellerBadges: ['Verified Trader', 'Master Smith'],
    stock: 5,
    listedAt: Date.now() - 3600000,
  },
  {
    id: 'mkt_totem_undying',
    name: 'Totem of Undying',
    brand: 'Minecraft',
    category: 'curios',
    price: 450,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🗿',
    description: 'Grants instant resurrection, regeneration II, and fire resistance upon fatal damage.',
    sellerUid: 'trader_evoker_deal',
    sellerName: 'MansionTrader',
    sellerReputation: 4.8,
    sellerTrades: 89,
    sellerBadges: ['Verified Trader'],
    stock: 2,
    listedAt: Date.now() - 7200000,
  },
  {
    id: 'mkt_enchanted_apple',
    name: 'Notch Golden Apple (God Apple)',
    brand: 'Minecraft',
    category: 'consumables',
    price: 280,
    currency: 'coins',
    rarity: 'epic',
    icon: '🍏',
    description: 'Eight blocks of pure gold surrounding a succulent apple. Full saturation and absorption IV.',
    sellerUid: 'trader_nomad',
    sellerName: 'DesertAlchemist',
    sellerReputation: 4.9,
    sellerTrades: 210,
    sellerBadges: ['Master Merchant', 'Top Rated'],
    stock: 9,
    listedAt: Date.now() - 5400000,
  },

  // ROBLOX ITEMS
  {
    id: 'mkt_speed_coil',
    name: 'Hyper Red Speed Coil',
    brand: 'Roblox',
    category: 'accessories',
    price: 90,
    currency: 'robux',
    rarity: 'epic',
    icon: '🌀',
    description: 'Iconic glowing red helical spring granting +100% sprint velocity and trailing red neon particles.',
    sellerUid: 'trader_builderman',
    sellerName: 'BloxyCollector_99',
    sellerReputation: 5.0,
    sellerTrades: 340,
    sellerBadges: ['Verified Trader', 'Instant Escrow'],
    stock: 4,
    listedAt: Date.now() - 1800000,
  },
  {
    id: 'mkt_bloxy_cola',
    name: 'Vintage Bloxy Cola 6-Pack',
    brand: 'Roblox',
    category: 'consumables',
    price: 110,
    currency: 'coins',
    rarity: 'common',
    icon: '🥤',
    description: 'Crack open an icy cold can of authentic Bloxburg soda! Restores full stamina and plays the glug sound.',
    sellerUid: 'trader_bacon',
    sellerName: 'BaconHairBro',
    sellerReputation: 4.7,
    sellerTrades: 45,
    sellerBadges: ['Verified Trader'],
    stock: 15,
    listedAt: Date.now() - 10800000,
  },
  {
    id: 'mkt_dominus_aureus',
    name: 'Dominus Aureus Emperor Cowl',
    brand: 'Roblox',
    category: 'accessories',
    price: 350,
    currency: 'robux',
    rarity: 'mythic',
    icon: '👑',
    description: 'Ultra-rare mythic headpiece worn by high-society Roblox billionaires. Glowing crimson eyes and golden plumage.',
    sellerUid: 'trader_rich_noob',
    sellerName: 'LordDominus',
    sellerReputation: 4.9,
    sellerTrades: 512,
    sellerBadges: ['Diamond Merchant', 'Certified Escrow'],
    stock: 1,
    listedAt: Date.now() - 14400000,
  },

  // COUNTRYBALLS ITEMS
  {
    id: 'mkt_poland_plunger',
    name: 'Polish Plunger of Destiny',
    brand: 'Countryballs',
    category: 'weapons',
    price: 190,
    currency: 'coins',
    rarity: 'rare',
    icon: '🪠',
    description: 'Polandball\'s legendary domestic tool turned ultimate anti-imperial defensive weapon. +15% knockback!',
    sellerUid: 'trader_polandball',
    sellerName: 'PolskaSovereign',
    sellerReputation: 5.0,
    sellerTrades: 178,
    sellerBadges: ['Verified Trader', 'UN Diplomat'],
    stock: 6,
    listedAt: Date.now() - 4000000,
  },
  {
    id: 'mkt_british_tea_kettle',
    name: 'Royal Windsor Tea Kettle of Calm',
    brand: 'Countryballs',
    category: 'curios',
    price: 240,
    currency: 'coins',
    rarity: 'rare',
    icon: '🫖',
    description: 'Brew an impeccable Earl Grey cuppa. Cleanses all poison and negative status effects while providing diplomatic calm.',
    sellerUid: 'trader_ukball',
    sellerName: 'LordSalisbury_UK',
    sellerReputation: 4.8,
    sellerTrades: 92,
    sellerBadges: ['Verified Trader'],
    stock: 3,
    listedAt: Date.now() - 8600000,
  },

  // XILAM ITEMS
  {
    id: 'mkt_flyswatter_9000',
    name: 'Oggy\'s Golden Flyswatter 9000',
    brand: 'Xilam',
    category: 'weapons',
    price: 260,
    currency: 'coins',
    rarity: 'epic',
    icon: '🪰',
    description: 'Reinforced cartoon titanium mesh! Delivers hilarious slapstick squeaks and pushes adversaries 10 blocks back.',
    sellerUid: 'trader_oggy_cat',
    sellerName: 'OggyKitchenGuard',
    sellerReputation: 4.9,
    sellerTrades: 165,
    sellerBadges: ['Verified Trader', 'Slapstick Master'],
    stock: 7,
    listedAt: Date.now() - 6200000,
  },
  {
    id: 'mkt_marina_pearl',
    name: 'Marina\'s Deep Lagoon Pearl',
    brand: 'Xilam',
    category: 'curios',
    price: 340,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🦪',
    description: 'Luminous oceanic pearl found by Marina and Sharko. Grants permanent water breathing and swim swiftness.',
    sellerUid: 'trader_sharko_guard',
    sellerName: 'SharkoLifeguard',
    sellerReputation: 5.0,
    sellerTrades: 230,
    sellerBadges: ['Top Rated', 'Verified Trader'],
    stock: 2,
    listedAt: Date.now() - 9500000,
  },

  // BRAND EXCLUSIVES
  {
    id: 'mkt_mcdonalds_burger',
    name: 'McDonald\'s Supreme Quad-Stack Meal',
    brand: 'McDonald\'s',
    category: 'consumables',
    price: 130,
    currency: 'coins',
    rarity: 'rare',
    icon: '🍔',
    description: 'Four 100% beef patties, golden fries, and a large drink. Instantly restores 100% hunger and grants 5 bonus hearts.',
    sellerUid: 'trader_mcd_chef',
    sellerName: 'ChefPierre_MCD',
    sellerReputation: 4.9,
    sellerTrades: 420,
    sellerBadges: ['Certified Chef', 'Instant Escrow'],
    stock: 20,
    listedAt: Date.now() - 2100000,
  },
  {
    id: 'mkt_bp_fuel_cell',
    name: 'BP Helios Turbo Fuel Cell',
    brand: 'BP',
    category: 'tools',
    price: 210,
    currency: 'coins',
    rarity: 'rare',
    icon: '🔋',
    description: 'High-density solar bio-fuel cell that powers any furnace or steam locomotive for 20 minutes continuously.',
    sellerUid: 'trader_bp_eng',
    sellerName: 'HeliosEnergy_BP',
    sellerReputation: 4.8,
    sellerTrades: 110,
    sellerBadges: ['Verified Trader'],
    stock: 12,
    listedAt: Date.now() - 3200000,
  },
  {
    id: 'mkt_youtube_play_button',
    name: 'YouTube Diamond Creator Trophy',
    brand: 'YouTube',
    category: 'curios',
    price: 550,
    currency: 'coins',
    rarity: 'mythic',
    icon: '💎',
    description: 'Commemorating 10,000,000 subscribers! Emits an inspiring starlight prism aura and grants +50% XP multiplier.',
    sellerUid: 'trader_yt_star',
    sellerName: 'DiamondCreator_YT',
    sellerReputation: 5.0,
    sellerTrades: 600,
    sellerBadges: ['Master Merchant', 'Top Rated', 'Instant Escrow'],
    stock: 1,
    listedAt: Date.now() - 15000000,
  },
  {
    id: 'mkt_newworld_compass',
    name: 'Aeternum Expedition Compass',
    brand: 'New World',
    category: 'tools',
    price: 230,
    currency: 'coins',
    rarity: 'rare',
    icon: '🧭',
    description: 'Antiquated brass navigational compass pointing toward unmined diamond veins and hidden treasure chests.',
    sellerUid: 'trader_pioneer_nw',
    sellerName: 'FrontierCartographer',
    sellerReputation: 4.7,
    sellerTrades: 76,
    sellerBadges: ['Verified Trader'],
    stock: 5,
    listedAt: Date.now() - 4500000,
  },

  // EXPANDED MULTIVERSE ITEMS & WEAPONS (25+ NEW ITEMS)
  {
    id: 'mkt_void_gauntlet',
    name: 'Void Gauntlet of Aeternum',
    brand: 'New World',
    category: 'weapons',
    price: 520,
    currency: 'coins',
    rarity: 'mythic',
    icon: '🔮',
    description: 'Ancient occult relic channeling pure void tethering magic. Drains enemy health to heal party members.',
    sellerUid: 'trader_occultist_nw',
    sellerName: 'VoidCaller_Aeternum',
    sellerReputation: 4.9,
    sellerTrades: 195,
    sellerBadges: ['Verified Trader', 'Master Armorer'],
    stock: 2,
    listedAt: Date.now() - 1200000,
  },
  {
    id: 'mkt_warhammer_aeternum',
    name: 'War Hammer of the Marauder',
    brand: 'New World',
    category: 'weapons',
    price: 360,
    currency: 'coins',
    rarity: 'epic',
    icon: '🔨',
    description: 'Forged from meteorite iron with a heavy spiked block. Deals massive structural shockwave knockback.',
    sellerUid: 'trader_marauder_forge',
    sellerName: 'Ironbreaker_NW',
    sellerReputation: 4.8,
    sellerTrades: 142,
    sellerBadges: ['Verified Trader'],
    stock: 4,
    listedAt: Date.now() - 2500000,
  },
  {
    id: 'mkt_subspace_tripmine',
    name: 'Subspace Tripmine Vintage 2008',
    brand: 'Roblox',
    category: 'weapons',
    price: 85,
    currency: 'robux',
    rarity: 'epic',
    icon: '💣',
    description: 'Legendary proximity explosive that turns neon pink before inverting gravitational physics across 8 blocks.',
    sellerUid: 'trader_shedletsky_shop',
    sellerName: 'ClassicBlox_Store',
    sellerReputation: 5.0,
    sellerTrades: 420,
    sellerBadges: ['Verified Trader', 'Instant Escrow'],
    stock: 7,
    listedAt: Date.now() - 3100000,
  },
  {
    id: 'mkt_gravity_coil_rig',
    name: 'Quantum Gravity Coil Rig',
    brand: 'Roblox',
    category: 'accessories',
    price: 95,
    currency: 'robux',
    rarity: 'epic',
    icon: '🌀',
    description: 'Blue helical anti-gravity coil granting 3x jump height and soft lunar feather-fall mechanics.',
    sellerUid: 'trader_obby_king',
    sellerName: 'ObbyGod_Roblox',
    sellerReputation: 4.9,
    sellerTrades: 310,
    sellerBadges: ['Verified Trader'],
    stock: 5,
    listedAt: Date.now() - 1700000,
  },
  {
    id: 'mkt_bloxy_sword_illumina',
    name: 'Illumina Prismatic Linked Sword',
    brand: 'Roblox',
    category: 'weapons',
    price: 180,
    currency: 'robux',
    rarity: 'legendary',
    icon: '⚔️',
    description: 'The holiest sword in Crossroads history! Shimmers with rainbow glints and emits a divine bell toll on strike.',
    sellerUid: 'trader_sword_master',
    sellerName: 'SwordFight_Legend',
    sellerReputation: 5.0,
    sellerTrades: 780,
    sellerBadges: ['Diamond Merchant', 'Instant Escrow'],
    stock: 3,
    listedAt: Date.now() - 900000,
  },
  {
    id: 'mkt_redstone_logic_meter',
    name: 'Tarragower Redstone Logic Multimeter',
    brand: 'Tarragower',
    category: 'tools',
    price: 175,
    currency: 'coins',
    rarity: 'rare',
    icon: '📟',
    description: 'Essential instrument for school engineers! Measures signal strength, repeater delay ticks, and logic gate loops.',
    sellerUid: 'trader_tarragower_lab',
    sellerName: 'PrefectMaya_STEAM',
    sellerReputation: 4.9,
    sellerTrades: 160,
    sellerBadges: ['School Prefect', 'Verified Trader'],
    stock: 12,
    listedAt: Date.now() - 4100000,
  },
  {
    id: 'mkt_steam_robotics_kit',
    name: 'Tarragower Autonomous Drone Core',
    brand: 'Tarragower',
    category: 'curios',
    price: 310,
    currency: 'coins',
    rarity: 'epic',
    icon: '🤖',
    description: 'Programmable clockwork drone core designed in Tarragower STEAM lab. Automatically harvests ripe crops.',
    sellerUid: 'trader_tarragower_lab',
    sellerName: 'HeadmasterAlistair',
    sellerReputation: 5.0,
    sellerTrades: 290,
    sellerBadges: ['Master Educator', 'Certified Escrow'],
    stock: 4,
    listedAt: Date.now() - 5300000,
  },
  {
    id: 'mkt_pounamu_mere',
    name: 'Waitangi Sacred Pounamu Mere',
    brand: 'Countryballs',
    category: 'weapons',
    price: 420,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🗡️',
    description: 'Hand-carved nephrite greenstone mere carrying the spiritual mana of Waitangi river chiefs. +20% defense.',
    sellerUid: 'trader_tamati',
    sellerName: 'ChiefTamati_NZ',
    sellerReputation: 5.0,
    sellerTrades: 215,
    sellerBadges: ['Taonga Guardian', 'Verified Trader'],
    stock: 2,
    listedAt: Date.now() - 6100000,
  },
  {
    id: 'mkt_kowhai_honey',
    name: 'Aotearoa Kowhai Manuka Honey Pot',
    brand: 'Countryballs',
    category: 'consumables',
    price: 140,
    currency: 'coins',
    rarity: 'rare',
    icon: '🍯',
    description: 'Pure native bush honey offering rapid regeneration and immunity to frostbite in blizzard regions.',
    sellerUid: 'trader_aroha',
    sellerName: 'ArohaBotanist',
    sellerReputation: 4.8,
    sellerTrades: 98,
    sellerBadges: ['Verified Trader'],
    stock: 14,
    listedAt: Date.now() - 7200000,
  },
  {
    id: 'mkt_golden_spatula',
    name: 'McDonald\'s Golden Master Spatula',
    brand: 'McDonald\'s',
    category: 'tools',
    price: 220,
    currency: 'coins',
    rarity: 'epic',
    icon: '🍳',
    description: 'Mirror-polished gold burger spatula that cooks meats instantly without consuming furnace fuel.',
    sellerUid: 'trader_ronald_kitchen',
    sellerName: 'ChefRonald_Official',
    sellerReputation: 5.0,
    sellerTrades: 640,
    sellerBadges: ['Golden Arches Star', 'Instant Escrow'],
    stock: 6,
    listedAt: Date.now() - 1900000,
  },
  {
    id: 'mkt_grimace_shake_vintage',
    name: 'Grimace Cosmic Purple Berry Shake',
    brand: 'McDonald\'s',
    category: 'consumables',
    price: 160,
    currency: 'coins',
    rarity: 'epic',
    icon: '🧋',
    description: 'The legendary purple milkshake! Grants floating jump levitation, super-speed, and a joyful birthday aura.',
    sellerUid: 'trader_grimace_hq',
    sellerName: 'GrimaceLover_99',
    sellerReputation: 4.9,
    sellerTrades: 270,
    sellerBadges: ['Verified Trader'],
    stock: 18,
    listedAt: Date.now() - 2800000,
  },
  {
    id: 'mkt_bp_solar_jetpack',
    name: 'BP Photovoltaic Flight Jetpack',
    brand: 'BP',
    category: 'accessories',
    price: 480,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🚀',
    description: 'Zero-emission solar ion thrusters providing steady flight during daylight hours without sulfur fuel.',
    sellerUid: 'trader_helios_lab',
    sellerName: 'HeliosEngineer_BP',
    sellerReputation: 4.9,
    sellerTrades: 180,
    sellerBadges: ['Clean Energy Pioneer', 'Instant Escrow'],
    stock: 3,
    listedAt: Date.now() - 3600000,
  },
  {
    id: 'mkt_bp_biofuel_canister',
    name: 'BP Bio-Fuel Overdrive Canister',
    brand: 'BP',
    category: 'consumables',
    price: 120,
    currency: 'coins',
    rarity: 'rare',
    icon: '⛽',
    description: 'Refined sunflower biofuel providing 15 minutes of 2x minecart speed and automated furnace smelting.',
    sellerUid: 'trader_chloe_wind',
    sellerName: 'WindTechChloe',
    sellerReputation: 4.8,
    sellerTrades: 88,
    sellerBadges: ['Verified Trader'],
    stock: 25,
    listedAt: Date.now() - 4800000,
  },
  {
    id: 'mkt_youtube_8k_camera',
    name: 'YouTube Red Cinema 8K Streamer Rig',
    brand: 'YouTube',
    category: 'tools',
    price: 490,
    currency: 'coins',
    rarity: 'legendary',
    icon: '📹',
    description: 'Broadcast-grade cinema rig with real-time autofocus. Doubles XP gained from boss battles and events.',
    sellerUid: 'trader_streamer_kai',
    sellerName: 'KaiStreamer_YT',
    sellerReputation: 5.0,
    sellerTrades: 510,
    sellerBadges: ['Verified Partner', 'Top Rated'],
    stock: 3,
    listedAt: Date.now() - 1100000,
  },
  {
    id: 'mkt_oggy_pie_cannon',
    name: 'Oggy\'s Cream Pie Slapstick Launcher',
    brand: 'Xilam',
    category: 'weapons',
    price: 210,
    currency: 'coins',
    rarity: 'rare',
    icon: '🥧',
    description: 'Fires high-velocity whipped cream pies with comic accordion sound effects, blinding adversaries with meringue!',
    sellerUid: 'trader_jack_workshop',
    sellerName: 'JackMonsterTrucks',
    sellerReputation: 4.7,
    sellerTrades: 94,
    sellerBadges: ['Slapstick Master'],
    stock: 8,
    listedAt: Date.now() - 3900000,
  },
  {
    id: 'mkt_space_goofs_teleporter',
    name: 'Space Goofs Quantum Teleport Remote',
    brand: 'Xilam',
    category: 'curios',
    price: 460,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🛸',
    description: 'Etno\'s prototype extraterrestrial teleporter. Instantly warps player back to their home spawn beacon.',
    sellerUid: 'trader_etno_lab',
    sellerName: 'EtnoPolino_Alien',
    sellerReputation: 4.9,
    sellerTrades: 175,
    sellerBadges: ['Alien Tech', 'Verified Trader'],
    stock: 2,
    listedAt: Date.now() - 5800000,
  },
  {
    id: 'mkt_argentina_mate',
    name: 'Yerba Mate Gourd & Silver Bombilla',
    brand: 'Countryballs',
    category: 'consumables',
    price: 110,
    currency: 'coins',
    rarity: 'common',
    icon: '🧉',
    description: 'Traditional herbal infusion shared among travelers. Restores hunger and gives 5 minutes of focused sprint.',
    sellerUid: 'trader_arg_mate',
    sellerName: 'GauchoSovereign',
    sellerReputation: 4.8,
    sellerTrades: 130,
    sellerBadges: ['Verified Trader'],
    stock: 20,
    listedAt: Date.now() - 2900000,
  },
  {
    id: 'mkt_korea_kimchi_pot',
    name: 'Spicy Kimchi Clay Pot of Power',
    brand: 'Countryballs',
    category: 'consumables',
    price: 125,
    currency: 'coins',
    rarity: 'rare',
    icon: '🥬',
    description: 'Fermented chili cabbage fermented in onggi jars. Cures freeze effects and grants fiery flame breath.',
    sellerUid: 'trader_seoul_chef',
    sellerName: 'KPopChef_Seoul',
    sellerReputation: 4.9,
    sellerTrades: 190,
    sellerBadges: ['Verified Trader'],
    stock: 16,
    listedAt: Date.now() - 3400000,
  },
  {
    id: 'mkt_netherite_core_drill',
    name: 'Deepslate Netherite Core Mining Drill',
    brand: 'Minecraft',
    category: 'tools',
    price: 460,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🪚',
    description: 'Engineered with netherite teeth and redstone battery. Mines 3x3 stone blocks instantly in survival mode.',
    sellerUid: 'trader_deepslate_pro',
    sellerName: 'CavernEngineer_Steve',
    sellerReputation: 5.0,
    sellerTrades: 480,
    sellerBadges: ['Master Smith', 'Instant Escrow'],
    stock: 4,
    listedAt: Date.now() - 1500000,
  },
  {
    id: 'mkt_sculk_echo_beacon',
    name: 'Calibrated Sculk Echo Acoustic Beacon',
    brand: 'Minecraft',
    category: 'curios',
    price: 330,
    currency: 'coins',
    rarity: 'epic',
    icon: '📡',
    description: 'Detects hostile entity vibrations within 40 blocks, pinging nearby allies on the integrated mini-map.',
    sellerUid: 'trader_warden_den',
    sellerName: 'DeepDarkSurvivor',
    sellerReputation: 4.8,
    sellerTrades: 112,
    sellerBadges: ['Verified Trader'],
    stock: 3,
    listedAt: Date.now() - 4400000,
  },
  {
    id: 'mkt_amethyst_flute',
    name: 'Shimmering Amethyst Harmonic Flute',
    brand: 'Minecraft',
    category: 'tools',
    price: 190,
    currency: 'coins',
    rarity: 'rare',
    icon: '🪈',
    description: 'Carved from purple amethyst clusters. Plays soothing crystal melodies that tame nearby wild wolves and allays.',
    sellerUid: 'trader_music_steve',
    sellerName: 'VoxelBard_Alex',
    sellerReputation: 4.9,
    sellerTrades: 220,
    sellerBadges: ['Verified Trader', 'Master Musician'],
    stock: 9,
    listedAt: Date.now() - 5100000,
  },

  // ================= SPRUS ECONOMY: VIRTUAL REAL ESTATE & SERVER CUSTOMIZATION =================
  {
    id: 'mkt_deed_bloxburg_villa',
    name: 'Virtual Real Estate Deed: Bloxburg Hilltop Mansion Lot',
    brand: 'Roblox',
    category: 'materials',
    price: 1200,
    currency: 'coins',
    rarity: 'mythic',
    icon: '🏡',
    description: 'Permanent ownership title to a 64x64 building plot in Bloxburg Suburbs with high-tech driveway and panoramic city skyline view.',
    sellerUid: 'bloxb_realtor_pro',
    sellerName: 'BloxburgRealty_Shed',
    sellerReputation: 5.0,
    sellerTrades: 340,
    sellerBadges: ['Certified Land Broker', 'Top Architect'],
    stock: 3,
    listedAt: Date.now() - 1200000,
  },
  {
    id: 'mkt_deed_windsward_homestead',
    name: 'Virtual Real Estate Deed: Windsward Windmill Estate',
    brand: 'New World',
    category: 'materials',
    price: 950,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🌾',
    description: 'Historic farmland title in Aeternum Windsward featuring fertile soil plots, stone barn, and active timber grain mill.',
    sellerUid: 'aeternum_landmaster',
    sellerName: 'Governor_Hawthorne',
    sellerReputation: 4.9,
    sellerTrades: 195,
    sellerBadges: ['Territory Governor', 'Pioneer Vanguard'],
    stock: 4,
    listedAt: Date.now() - 2500000,
  },
  {
    id: 'mkt_server_motd_beacon',
    name: 'Server Customization: Holographic Multiverse Sky MOTD Beacon',
    brand: 'Universal',
    category: 'tools',
    price: 750,
    currency: 'coins',
    rarity: 'legendary',
    icon: '📡',
    description: 'Deploys a custom floating neon banner visible across all 16 multiverse zones broadcasting player clan messages and announcements.',
    sellerUid: 'sys_admin_tarragower',
    sellerName: 'Vance_SystemCore',
    sellerReputation: 5.0,
    sellerTrades: 420,
    sellerBadges: ['Server Architect', 'Verified Dev'],
    stock: 12,
    listedAt: Date.now() - 3600000,
  },
  {
    id: 'mkt_server_weather_controller',
    name: 'Server Customization: Celestial Weather & Aurora Totem',
    brand: 'Sprunki',
    category: 'tools',
    price: 680,
    currency: 'coins',
    rarity: 'epic',
    icon: '🌦️',
    description: 'Control global weather effects: summon emerald aurora borealis, cherry blossom rain, or warm sunny skies server-wide.',
    sellerUid: 'weather_wizard_vineria',
    sellerName: 'Chrono_Vineria',
    sellerReputation: 4.8,
    sellerTrades: 160,
    sellerBadges: ['Atmosphere Weaver'],
    stock: 8,
    listedAt: Date.now() - 4800000,
  },
  {
    id: 'mkt_bp_clean_solar_kit',
    name: 'BP Helios Photovoltaic Solar Power Generator Kit',
    brand: 'BP',
    category: 'tools',
    price: 450,
    currency: 'coins',
    rarity: 'rare',
    icon: '⚡',
    description: 'Zero-emission solar generator array that auto-powers all electric engines, jetpacks, and smelters without fuel drain.',
    sellerUid: 'bp_engineer_brenda',
    sellerName: 'EngineerBrenda_BP',
    sellerReputation: 4.9,
    sellerTrades: 310,
    sellerBadges: ['Clean Tech Pioneer', 'Certified Engineer'],
    stock: 15,
    listedAt: Date.now() - 1800000,
  },
  {
    id: 'mkt_mcd_banquet_cart',
    name: 'McDonald\'s Mobile Happy Meal Banquet Food Truck',
    brand: 'McDonald\'s',
    category: 'food',
    price: 380,
    currency: 'coins',
    rarity: 'rare',
    icon: '🍔',
    description: 'Rollable culinary food cart dispensing fresh hot golden fries, double cheeseburgers, and legendary Grimace shakes to party members.',
    sellerUid: 'chef_ronald_kitchen',
    sellerName: 'ChefRonald_MCD',
    sellerReputation: 5.0,
    sellerTrades: 520,
    sellerBadges: ['Master Gourmet', 'Happy Meal Ambassador'],
    stock: 20,
    listedAt: Date.now() - 2900000,
  },
  {
    id: 'mkt_tarragower_chronos_lens',
    name: 'Tarragower Academy Chronos-Monocle & Logic Quill',
    brand: 'Tarragower',
    category: 'accessories',
    price: 290,
    currency: 'coins',
    rarity: 'rare',
    icon: '🧐',
    description: 'Official academic optics that highlight secret redstone circuits, hidden quest triggers, and ancient library puzzle clues.',
    sellerUid: 'tarragower_dean_office',
    sellerName: 'Proctor_Alistair',
    sellerReputation: 4.9,
    sellerTrades: 175,
    sellerBadges: ['Academy Fellow'],
    stock: 10,
    listedAt: Date.now() - 4200000,
  },
  {
    id: 'mkt_xilam_slapstick_mallet',
    name: 'Xilam 10-Ton Squeaky Rubber Comedy Mallet',
    brand: 'Xilam',
    category: 'weapons',
    price: 340,
    currency: 'coins',
    rarity: 'epic',
    icon: '🔨',
    description: 'Cartoon oversized mallet that deals comic knockback with hilarious squeaks, catapulting mobs backward like in Zig & Sharko.',
    sellerUid: 'oggy_comedy_props',
    sellerName: 'PropMaster_Jack',
    sellerReputation: 4.8,
    sellerTrades: 260,
    sellerBadges: ['Cartoon Stuntman'],
    stock: 7,
    listedAt: Date.now() - 3100000,
  },
];

const STORAGE_MARKET_KEY = 'megaworld_marketplace_items_v1';
const STORAGE_RECEIPTS_KEY = 'megaworld_marketplace_receipts_v1';
const STORAGE_ENDORSEMENTS_KEY = 'megaworld_trader_endorsements_v1';

export const marketplaceManager = {
  getLocalItems(): MarketItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_MARKET_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading marketplace items:', e);
    }
    return DEFAULT_MARKET_ITEMS;
  },

  saveLocalItems(items: MarketItem[]) {
    try {
      localStorage.setItem(STORAGE_MARKET_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving marketplace items:', e);
    }
  },

  getReceipts(): TransactionReceipt[] {
    try {
      const stored = localStorage.getItem(STORAGE_RECEIPTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading receipts:', e);
    }
    return [];
  },

  addReceipt(receipt: TransactionReceipt) {
    try {
      const existing = this.getReceipts();
      localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify([receipt, ...existing.slice(0, 49)]));
    } catch (e) {
      console.warn('Error adding receipt:', e);
    }
  },

  async loadFromCloud(): Promise<MarketItem[]> {
    try {
      const colRef = collection(db, 'marketplace_listings');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudItems: MarketItem[] = [];
        snap.forEach((docSnap) => cloudItems.push(docSnap.data() as MarketItem));
        this.saveLocalItems(cloudItems);
        return cloudItems;
      }
    } catch (e) {
      console.warn('Could not load market listings from cloud, using local cache:', e);
    }
    return this.getLocalItems();
  },

  async executePurchase(
    item: MarketItem,
    buyerUid: string,
    buyerName: string
  ): Promise<{ success: boolean; newReceipt: TransactionReceipt; message: string }> {
    const customData = avatarManager.getLocalCustomization();

    // 1. Escrow Balance Validation
    if (item.currency === 'coins' && customData.coins < item.price) {
      throw new Error(`Insufficient Coins! You need ${item.price} Coins (Balance: ${customData.coins}).`);
    }
    if (item.currency === 'robux' && customData.robux < item.price) {
      throw new Error(`Insufficient Robux! You need ${item.price} Robux (Balance: ${customData.robux}).`);
    }

    // 2. Stock Validation
    if (item.stock <= 0) {
      throw new Error('This listing is out of stock!');
    }

    // 3. Deduct funds from buyer wallet
    const updatedCustom = {
      ...customData,
      coins: item.currency === 'coins' ? customData.coins - item.price : customData.coins,
      robux: item.currency === 'robux' ? customData.robux - item.price : customData.robux,
      tradesCompleted: customData.tradesCompleted + 1,
    };
    await avatarManager.saveToCloud(buyerUid, updatedCustom);

    // 4. Update Market Item Stock
    const allItems = this.getLocalItems();
    const updatedItems = allItems
      .map((it) => {
        if (it.id === item.id) {
          return {
            ...it,
            stock: it.stock - 1,
            sellerTrades: it.sellerTrades + 1,
          };
        }
        return it;
      })
      .filter((it) => it.stock > 0);

    this.saveLocalItems(updatedItems);

    // 5. Generate Secure Transaction Receipt
    const receipt: TransactionReceipt = {
      id: `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      itemId: item.id,
      itemName: item.name,
      sellerName: item.sellerName,
      buyerName: buyerName || 'Steve',
      amount: item.price,
      currency: item.currency,
      timestamp: Date.now(),
      status: 'COMPLETED_ESCROW',
    };
    this.addReceipt(receipt);

    // 6. Sync listing update to cloud
    try {
      if (item.stock - 1 <= 0) {
        await deleteDoc(doc(db, 'marketplace_listings', item.id));
      } else {
        await setDoc(doc(db, 'marketplace_listings', item.id), {
          ...item,
          stock: item.stock - 1,
          sellerTrades: item.sellerTrades + 1,
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not sync listing decrement to cloud:', e);
    }

    return {
      success: true,
      newReceipt: receipt,
      message: `Successfully purchased "${item.name}" for ${item.price} ${item.currency.toUpperCase()}!`,
    };
  },

  async createListing(
    item: Omit<MarketItem, 'id' | 'listedAt' | 'sellerTrades' | 'sellerReputation' | 'sellerBadges'>,
    sellerUid: string,
    sellerRep: number,
    sellerTrades: number
  ): Promise<MarketItem> {
    const newItem: MarketItem = {
      ...item,
      id: `mkt_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sellerReputation: sellerRep || 4.9,
      sellerTrades: sellerTrades || 1,
      sellerBadges: ['Verified Player', 'Live Escrow'],
      listedAt: Date.now(),
    };

    const currentItems = this.getLocalItems();
    const updated = [newItem, ...currentItems];
    this.saveLocalItems(updated);

    try {
      await setDoc(doc(db, 'marketplace_listings', newItem.id), newItem);
    } catch (e) {
      console.warn('Could not write listing to cloud:', e);
    }

    return newItem;
  },

  endorseTrader(sellerUid: string): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_ENDORSEMENTS_KEY);
      const endorsedList: string[] = stored ? JSON.parse(stored) : [];
      if (endorsedList.includes(sellerUid)) {
        return false; // already endorsed
      }
      endorsedList.push(sellerUid);
      localStorage.setItem(STORAGE_ENDORSEMENTS_KEY, JSON.stringify(endorsedList));

      // Increase trader reputation in local listings
      const items = this.getLocalItems();
      const updated = items.map((it) => {
        if (it.sellerUid === sellerUid) {
          return {
            ...it,
            sellerReputation: Math.min(5.0, Number((it.sellerReputation + 0.1).toFixed(1))),
          };
        }
        return it;
      });
      this.saveLocalItems(updated);
      return true;
    } catch (e) {
      console.warn('Error endorsing trader:', e);
      return false;
    }
  },

  // ================= COMMODITY EXCHANGE (EARNING MEGACOINS) =================
  getCommodityRates(): CommodityRate[] {
    return COMMODITY_RATES;
  },

  async sellCommodity(
    commodityKey: string,
    quantity: number,
    buyerUid: string
  ): Promise<{ success: boolean; earnedCoins: number; message: string }> {
    const rate = COMMODITY_RATES.find((c) => c.key === commodityKey);
    if (!rate) {
      throw new Error(`Unknown commodity: ${commodityKey}`);
    }
    const safeQty = Math.max(1, Math.min(64, quantity));
    const totalEarned = rate.sellPriceCoins * safeQty;

    const customData = avatarManager.getLocalCustomization();
    const updatedCustom = {
      ...customData,
      coins: customData.coins + totalEarned,
      tradesCompleted: customData.tradesCompleted + 1,
      lastUpdated: Date.now(),
    };
    await avatarManager.saveToCloud(buyerUid, updatedCustom);

    const receipt: TransactionReceipt = {
      id: `TX-COMMODITY-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      itemId: `commodity_${commodityKey}`,
      itemName: `${safeQty}x ${rate.name}`,
      sellerName: customData.customName || 'Player',
      buyerName: 'MegaWorld Commodity Exchange',
      amount: totalEarned,
      currency: 'coins',
      timestamp: Date.now(),
      status: 'COMPLETED_ESCROW',
    };
    this.addReceipt(receipt);

    return {
      success: true,
      earnedCoins: totalEarned,
      message: `Sold ${safeQty}x ${rate.name} for +${totalEarned} MegaCoins (🪙)!`,
    };
  },

  // ================= P2P PEER-TO-PEER ESCROW TRADING =================
  getP2PPartners(): P2PTradePartner[] {
    return ONLINE_TRADE_PARTNERS;
  },

  async executeP2PExchange(
    partnerId: string,
    offeredCoins: number,
    offeredRobux: number,
    requestedItemName: string,
    userUid: string,
    userName: string
  ): Promise<{ success: boolean; receipt: TransactionReceipt; message: string }> {
    const partner = ONLINE_TRADE_PARTNERS.find((p) => p.id === partnerId);
    if (!partner) {
      throw new Error('Selected trade partner is offline or not found.');
    }
    const customData = avatarManager.getLocalCustomization();

    if (offeredCoins > 0 && customData.coins < offeredCoins) {
      throw new Error(`Insufficient MegaCoins! You offered ${offeredCoins} 🪙, but only have ${customData.coins} 🪙.`);
    }
    if (offeredRobux > 0 && customData.robux < offeredRobux) {
      throw new Error(`Insufficient Robux! You offered ${offeredRobux} 💎, but only have ${customData.robux} 💎.`);
    }

    // Atomic Escrow Transfer: deduct offered, credit partner's offer
    const gainedCoins = partner.offerCoins;
    const gainedRobux = partner.offerRobux;

    const updatedCustom = {
      ...customData,
      coins: customData.coins - offeredCoins + gainedCoins,
      robux: customData.robux - offeredRobux + gainedRobux,
      tradesCompleted: customData.tradesCompleted + 1,
      reputation: Math.min(5.0, Number((customData.reputation + 0.05).toFixed(2))),
      lastUpdated: Date.now(),
    };
    await avatarManager.saveToCloud(userUid, updatedCustom);

    const receipt: TransactionReceipt = {
      id: `TX-P2P-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      itemId: `p2p_${partner.id}`,
      itemName: `${requestedItemName} (+${gainedCoins}🪙 +${gainedRobux}💎)`,
      sellerName: partner.name,
      buyerName: userName || 'Steve',
      amount: offeredCoins,
      currency: 'coins',
      timestamp: Date.now(),
      status: 'COMPLETED_ESCROW',
    };
    this.addReceipt(receipt);

    // Sync transaction to Cloud Ledger
    try {
      await setDoc(doc(db, 'economy_ledger', receipt.id), {
        ...receipt,
        partnerId,
        userUid,
        securityToken: `SHA256-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      });
    } catch (e) {
      console.warn('Could not record transaction to cloud ledger:', e);
    }

    return {
      success: true,
      receipt,
      message: `P2P Trade with ${partner.name} completed successfully! Received "${requestedItemName}" and +${gainedCoins} MegaCoins!`,
    };
  },

  async syncCloudEconomyLedger(uid: string): Promise<{ success: boolean; hash: string }> {
    const customData = avatarManager.getLocalCustomization();
    const receipts = this.getReceipts();
    const token = `LEDGER-SYNC-${Date.now().toString(16)}-${receipts.length}TX`;

    try {
      if (uid && uid !== 'guest-player') {
        await setDoc(doc(db, 'player_wallets', uid), {
          coins: customData.coins,
          robux: customData.robux,
          tradesCompleted: customData.tradesCompleted,
          reputation: customData.reputation,
          ledgerHash: token,
          receiptsCount: receipts.length,
          lastSync: Date.now(),
        }, { merge: true });
      }
      return { success: true, hash: token };
    } catch (e) {
      console.warn('Cloud wallet sync fallback to local cache:', e);
      return { success: true, hash: token };
    }
  }
};

export interface CommodityRate {
  key: string;
  name: string;
  icon: string;
  category: 'raw_materials' | 'ores' | 'provisions';
  sellPriceCoins: number;
  marketTrend: 'up' | 'stable' | 'down';
  description: string;
}

export const COMMODITY_RATES: CommodityRate[] = [
  { key: 'wood', name: 'Oak Timber Logs', icon: '🪵', category: 'raw_materials', sellPriceCoins: 12, marketTrend: 'up', description: 'Essential building timber harvested from forest biomes.' },
  { key: 'stone', name: 'Refined Cobblestone', icon: '🪨', category: 'raw_materials', sellPriceCoins: 8, marketTrend: 'stable', description: 'Dense masonry stone used for ramparts and foundations.' },
  { key: 'sand', name: 'Silica Desert Sand', icon: '🏖️', category: 'raw_materials', sellPriceCoins: 10, marketTrend: 'up', description: 'Silica sand refined into glass and industrial soda bottles.' },
  { key: 'coal', name: 'Anthracite Carbon Coal', icon: '⬛', category: 'ores', sellPriceCoins: 18, marketTrend: 'stable', description: 'High-thermal fuel source for smelters and steam locomotives.' },
  { key: 'iron', name: 'Raw Iron Ore Chunks', icon: '⚙️', category: 'ores', sellPriceCoins: 35, marketTrend: 'up', description: 'Industrial grade iron for tools, rails, and armor plating.' },
  { key: 'gold', name: 'Gleaming Gold Ingots', icon: '🟡', category: 'ores', sellPriceCoins: 65, marketTrend: 'up', description: 'High-purity gold conduits used for electronics and golden meals.' },
  { key: 'diamond', name: 'Deepslate Diamond Gem', icon: '💎', category: 'ores', sellPriceCoins: 150, marketTrend: 'stable', description: 'The pinnacle of subterranean durability and tool sharpness.' },
  { key: 'emerald', name: 'Villager Trade Emerald', icon: '❇️', category: 'ores', sellPriceCoins: 120, marketTrend: 'up', description: 'Universal currency of overworld merchants and diplomats.' },
  { key: 'netherite', name: 'Ancient Netherite Scrap', icon: '🛡️', category: 'ores', sellPriceCoins: 320, marketTrend: 'up', description: 'Mythic heat-resistant alloy dredged from subterranean lava lakes.' },
  { key: 'bread', name: 'Fresh Farm Bread Loaf', icon: '🍞', category: 'provisions', sellPriceCoins: 25, marketTrend: 'stable', description: 'Warm oven-baked wheat bread restoring stamina.' },
  { key: 'apple', name: 'Succulent Orchard Apple', icon: '🍎', category: 'provisions', sellPriceCoins: 20, marketTrend: 'stable', description: 'Sweet crisp orchard harvest for travelers and gourmet recipes.' },
  { key: 'golden_apple', name: 'Enchanted Golden Apple', icon: '🍏', category: 'provisions', sellPriceCoins: 200, marketTrend: 'up', description: 'Legendary eight-ingot enchanted apple granting absorption hearts.' },
];

export interface P2PTradePartner {
  id: string;
  name: string;
  avatar: string;
  badge: string;
  rating: number;
  availableItems: { name: string; icon: string; count: number; valueCoins: number }[];
  offerCoins: number;
  offerRobux: number;
}

export const ONLINE_TRADE_PARTNERS: P2PTradePartner[] = [
  {
    id: 'partner_steve',
    name: 'Steve (Master Miner)',
    avatar: '⛏️',
    badge: 'Certified Smith',
    rating: 5.0,
    availableItems: [
      { name: 'Diamond Pickaxe', icon: '⛏️', count: 1, valueCoins: 280 },
      { name: 'Enchanted Shield', icon: '🛡️', count: 1, valueCoins: 190 },
      { name: 'Netherite Ingot', icon: '⬛', count: 2, valueCoins: 450 },
    ],
    offerCoins: 150,
    offerRobux: 0,
  },
  {
    id: 'partner_bacon',
    name: 'Bacon Hair (Obby Pro)',
    avatar: '🥓',
    badge: 'Speedrunner',
    rating: 4.8,
    availableItems: [
      { name: 'Gravity Coil Rig', icon: '🌀', count: 1, valueCoins: 300 },
      { name: 'Bloxy Cola Case', icon: '🥤', count: 3, valueCoins: 180 },
      { name: 'Classic Linked Sword', icon: '🗡️', count: 1, valueCoins: 220 },
    ],
    offerCoins: 80,
    offerRobux: 40,
  },
  {
    id: 'partner_poland',
    name: 'Polandball (Diplomat)',
    avatar: '🇵🇱',
    badge: 'UN Sovereign',
    rating: 4.9,
    availableItems: [
      { name: 'Plunger of Destiny', icon: '🪠', count: 1, valueCoins: 210 },
      { name: 'Royal Tea Kettle', icon: '🫖', count: 1, valueCoins: 240 },
      { name: 'Sovereign Treaty Stamp', icon: '📜', count: 1, valueCoins: 310 },
    ],
    offerCoins: 200,
    offerRobux: 20,
  },
  {
    id: 'partner_ronald',
    name: 'Chef Ronald (Golden Arches)',
    avatar: '🍟',
    badge: 'Executive Chef',
    rating: 4.9,
    availableItems: [
      { name: 'Golden Arches Spatula', icon: '🍳', count: 1, valueCoins: 350 },
      { name: 'Happy Meal Surprise Box', icon: '🎁', count: 4, valueCoins: 160 },
      { name: 'Crispy Fry Satchel', icon: '🍟', count: 2, valueCoins: 140 },
    ],
    offerCoins: 250,
    offerRobux: 50,
  },
  {
    id: 'partner_maya',
    name: 'Prefect Maya (Tarragower)',
    avatar: '🎓',
    badge: 'STEAM Scholar',
    rating: 5.0,
    availableItems: [
      { name: 'Redstone Logic Multimeter', icon: '📟', count: 1, valueCoins: 175 },
      { name: 'Autonomous Drone Core', icon: '🤖', count: 1, valueCoins: 310 },
      { name: 'Deepslate Logic Compass', icon: '🧭', count: 2, valueCoins: 160 },
    ],
    offerCoins: 180,
    offerRobux: 30,
  },
  {
    id: 'partner_tamati',
    name: 'Chief Tamati (Waitangi)',
    avatar: '🌿',
    badge: 'Rangatira Wayfinder',
    rating: 5.0,
    availableItems: [
      { name: 'Sacred Pounamu Mere', icon: '🗡️', count: 1, valueCoins: 420 },
      { name: 'Manuka Honey Pot', icon: '🍯', count: 3, valueCoins: 140 },
      { name: 'Silver Fern All-Blacks Sash', icon: '🏉', count: 1, valueCoins: 220 },
    ],
    offerCoins: 220,
    offerRobux: 25,
  },
];

// ================= PLAYER BUSINESS ENTERPRISE SYSTEM =================
export interface PlayerBusiness {
  id: string;
  ownerUid: string;
  ownerName: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World';
  businessType: 'restaurant' | 'energy_grid' | 'forge' | 'tech_lab' | 'curio_emporium' | 'slapstick_pranks' | 'trading_post';
  icon: string;
  tier: number; // 1: Startup, 2: Franchise, 3: Enterprise, 4: Multiverse Conglomerate
  tierName: string;
  dailyRevenueMegaCoins: number;
  reputationRating: number;
  totalCustomersServed: number;
  headquartersBiome: string;
  perkDescription: string;
  unlockedServices: string[];
  lastCollectedTimestamp: number;
}

export const INITIAL_PLAYER_BUSINESSES: PlayerBusiness[] = [
  {
    id: 'biz_mcd_express_01',
    ownerUid: 'trader_mcd_chef',
    ownerName: 'ChefRonald_Official',
    name: 'McDonald\'s Multiverse Drive-Thru #1',
    brand: 'McDonald\'s',
    businessType: 'restaurant',
    icon: '🍟',
    tier: 3,
    tierName: 'Golden Enterprise',
    dailyRevenueMegaCoins: 280,
    reputationRating: 4.9,
    totalCustomersServed: 1840,
    headquartersBiome: 'Overworld Plains Crossroad (0, 0)',
    perkDescription: 'Automated conveyor grills cook meats and burgers at 3x speed, generating passive daily MegaCoins.',
    unlockedServices: ['Supreme Quad-Stack Burgers', 'Golden Fries Delivery', 'Drive-Thru Speed Lane'],
    lastCollectedTimestamp: Date.now() - 43200000,
  },
  {
    id: 'biz_bp_helios_grid',
    ownerUid: 'trader_bp_eng',
    ownerName: 'HeliosEnergy_BP',
    name: 'BP Helios Clean Energy Hub & EV Terminal',
    brand: 'BP',
    businessType: 'energy_grid',
    icon: '⚡',
    tier: 3,
    tierName: 'Clean Energy Grid',
    dailyRevenueMegaCoins: 310,
    reputationRating: 5.0,
    totalCustomersServed: 1420,
    headquartersBiome: 'Solar Desert Basin (Chunk 12, 4)',
    perkDescription: 'Provides clean solar-cell charging to all server locomotives and minecarts, earning green energy tariff dividends.',
    unlockedServices: ['Solar Fuel Cells', 'Turbine Power Feeds', 'EV Rapid Recharge'],
    lastCollectedTimestamp: Date.now() - 36000000,
  },
  {
    id: 'biz_tarragower_workshop',
    ownerUid: 'trader_tarragower_lab',
    ownerName: 'HeadmasterAlistair',
    name: 'Tarragower STEAM Logic & Redstone Foundry',
    brand: 'Tarragower',
    businessType: 'tech_lab',
    icon: '🏛️',
    tier: 2,
    tierName: 'Academic Tech Lab',
    dailyRevenueMegaCoins: 210,
    reputationRating: 4.9,
    totalCustomersServed: 960,
    headquartersBiome: 'Highland Redwood Valley (Tarragower Campus)',
    perkDescription: 'Produces custom arithmetic logic units and automated harvesting drone cores for builders.',
    unlockedServices: ['Logic Multimeter Testing', 'Autonomous Drone Fabrication', 'Redstone Apprentice Training'],
    lastCollectedTimestamp: Date.now() - 50000000,
  },
  {
    id: 'biz_crossroads_coils',
    ownerUid: 'trader_builderman',
    ownerName: 'BloxyCollector_99',
    name: 'Crossroads Quantum Coils & Swords Boutique',
    brand: 'Roblox',
    businessType: 'curio_emporium',
    icon: '🌀',
    tier: 3,
    tierName: 'Crossroads Emporium',
    dailyRevenueMegaCoins: 340,
    reputationRating: 5.0,
    totalCustomersServed: 2310,
    headquartersBiome: 'Sky-High Neon Obby Caldera',
    perkDescription: 'Premier vendor of Speed Coils, Gravity Coils, and Illumina Linked Swords with verified escrow warranties.',
    unlockedServices: ['Quantum Coil Tuning', 'Linked Blade Restoration', 'Subspace Proximity Calibration'],
    lastCollectedTimestamp: Date.now() - 28000000,
  },
  {
    id: 'biz_xilam_prank_depot',
    ownerUid: 'trader_jack_workshop',
    ownerName: 'JackMonsterTrucks',
    name: 'Oggy & Jack\'s Cartoon Slapstick Depot',
    brand: 'Xilam',
    businessType: 'slapstick_pranks',
    icon: '💥',
    tier: 2,
    tierName: 'Comedy Workshop',
    dailyRevenueMegaCoins: 190,
    reputationRating: 4.8,
    totalCustomersServed: 870,
    headquartersBiome: 'Suburban Boulevard Villa',
    perkDescription: 'Crafts comical 10-ton squeak mallets, flying cream pie launchers, and spring-loaded boxing glove doors.',
    unlockedServices: ['Cream Pie Artillery', 'Titanium Flyswatters', 'Monster Truck Suspension Tuning'],
    lastCollectedTimestamp: Date.now() - 55000000,
  },
];

// ================= PLAYER SERVICE CONTRACTS & BOUNTIES =================
export interface ServiceContract {
  id: string;
  title: string;
  employerName: string;
  employerAvatar: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World';
  serviceType: 'building' | 'redstone_engineering' | 'combat_bodyguard' | 'resource_delivery' | 'custom_skin_commission';
  payoutMegaCoins: number;
  payoutRobux?: number;
  description: string;
  requirements: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
  workerName?: string;
  createdAt: number;
}

export const INITIAL_SERVICE_CONTRACTS: ServiceContract[] = [
  {
    id: 'cnt_castle_fortification',
    title: 'Construct Netherite Fortified Bastion Outpost',
    employerName: 'Steve (Overworld Guild)',
    employerAvatar: '⛏️',
    brand: 'Minecraft',
    serviceType: 'building',
    payoutMegaCoins: 350,
    payoutRobux: 50,
    description: 'Looking for a master architect to lay 40 obsidian and reinforced deepslate blocks to shield our portal against raid invasions.',
    requirements: 'Must have at least Level 10 Mining and Diamond Pickaxe.',
    status: 'OPEN',
    createdAt: Date.now() - 7200000,
  },
  {
    id: 'cnt_tarragower_elevator',
    title: 'Engineer 20-Floor Water-Bubble & Redstone Elevator',
    employerName: 'Headmaster Alistair',
    employerAvatar: '🎓',
    brand: 'Tarragower',
    serviceType: 'redstone_engineering',
    payoutMegaCoins: 280,
    payoutRobux: 40,
    description: 'Tarragower science hall requires a zero-lag vertical transit elevator powered by soul sand and observer clocks.',
    requirements: 'Must pass the Tarragower STEAM Logic certification.',
    status: 'OPEN',
    createdAt: Date.now() - 14400000,
  },
  {
    id: 'cnt_mcdonalds_rush_hour',
    title: 'Multiverse Grand Carnival Burger Catering Service',
    employerName: 'Chef Ronald',
    employerAvatar: '🍟',
    brand: 'McDonald\'s',
    serviceType: 'resource_delivery',
    payoutMegaCoins: 220,
    payoutRobux: 30,
    description: 'Deliver 30 Golden Arches meals to players in the PvP colosseum before the tournament finals begin.',
    requirements: 'Fast runner or Speed Coil equipped.',
    status: 'OPEN',
    createdAt: Date.now() - 3600000,
  },
  {
    id: 'cnt_bp_solar_substation',
    title: 'Deploy 8 High-Efficiency Solar Micro-Grids in Caverns',
    employerName: 'Helios Solar Vanguard',
    employerAvatar: '⚡',
    brand: 'BP',
    serviceType: 'building',
    payoutMegaCoins: 260,
    payoutRobux: 35,
    description: 'Install photovoltaic receptor mirrors in deep caves to illuminate rail networks with renewable daylight reflections.',
    requirements: 'Equipped with BP Solar Helmet or Goggles.',
    status: 'OPEN',
    createdAt: Date.now() - 10800000,
  },
  {
    id: 'cnt_aeternum_boss_bodyguard',
    title: 'Elite Raid Escort: Netherite Permafrost Titan Hunt',
    employerName: 'Aeternum Pioneer',
    employerAvatar: '🛡️',
    brand: 'New World',
    serviceType: 'combat_bodyguard',
    payoutMegaCoins: 420,
    payoutRobux: 75,
    description: 'Need two veteran warriors armed with War Hammers or Void Gauntlets to hold aggro while our cleric sustains the beacon.',
    requirements: 'Defense rating 40+ and enchanted armor.',
    status: 'OPEN',
    createdAt: Date.now() - 1800000,
  },
];

const STORAGE_BUSINESS_KEY = 'megaworld_player_businesses_v1';
const STORAGE_CONTRACTS_KEY = 'megaworld_service_contracts_v1';

export const playerEconomyManager = {
  getBusinesses(): PlayerBusiness[] {
    try {
      const stored = localStorage.getItem(STORAGE_BUSINESS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_PLAYER_BUSINESSES;
  },

  saveBusinesses(businesses: PlayerBusiness[]) {
    try {
      localStorage.setItem(STORAGE_BUSINESS_KEY, JSON.stringify(businesses));
    } catch {}
  },

  registerBusiness(
    ownerUid: string,
    ownerName: string,
    name: string,
    brand: PlayerBusiness['brand'],
    businessType: PlayerBusiness['businessType'],
    headquartersBiome: string
  ): PlayerBusiness {
    const iconMap: Record<PlayerBusiness['businessType'], string> = {
      restaurant: '🍔',
      energy_grid: '⚡',
      forge: '🔨',
      tech_lab: '🔬',
      curio_emporium: '💎',
      slapstick_pranks: '💥',
      trading_post: '⚖️',
    };

    const newBiz: PlayerBusiness = {
      id: `biz_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      ownerUid,
      ownerName,
      name,
      brand,
      businessType,
      icon: iconMap[businessType] || '🏢',
      tier: 1,
      tierName: 'Startup Venture',
      dailyRevenueMegaCoins: 120,
      reputationRating: 5.0,
      totalCustomersServed: 1,
      headquartersBiome: headquartersBiome || 'Overworld Hub',
      perkDescription: `Generates passive daily MegaCoins and provides ${brand} signature services to wandering players.`,
      unlockedServices: [`Standard ${brand} Supply`, 'Player Rest Stop'],
      lastCollectedTimestamp: Date.now(),
    };

    const current = this.getBusinesses();
    current.unshift(newBiz);
    this.saveBusinesses(current);
    return newBiz;
  },

  upgradeBusiness(businessId: string): PlayerBusiness | null {
    const list = this.getBusinesses();
    const biz = list.find(b => b.id === businessId);
    if (!biz || biz.tier >= 4) return null;

    biz.tier += 1;
    const tierNames = ['', 'Startup Venture', 'Franchise Branch', 'Regional Enterprise', 'Multiverse Conglomerate'];
    biz.tierName = tierNames[biz.tier] || 'Mega Enterprise';
    biz.dailyRevenueMegaCoins += 90;
    biz.totalCustomersServed += 250;
    this.saveBusinesses(list);
    return biz;
  },

  collectRevenue(businessId: string): number {
    const list = this.getBusinesses();
    const biz = list.find(b => b.id === businessId);
    if (!biz) return 0;

    const payout = biz.dailyRevenueMegaCoins;
    biz.lastCollectedTimestamp = Date.now();
    biz.totalCustomersServed += Math.floor(Math.random() * 15) + 5;
    this.saveBusinesses(list);
    return payout;
  },

  getContracts(): ServiceContract[] {
    try {
      const stored = localStorage.getItem(STORAGE_CONTRACTS_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_SERVICE_CONTRACTS;
  },

  saveContracts(contracts: ServiceContract[]) {
    try {
      localStorage.setItem(STORAGE_CONTRACTS_KEY, JSON.stringify(contracts));
    } catch {}
  },

  postContract(contract: Omit<ServiceContract, 'id' | 'status' | 'createdAt'>): ServiceContract {
    const newContract: ServiceContract = {
      ...contract,
      id: `cnt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      status: 'OPEN',
      createdAt: Date.now(),
    };
    const list = this.getContracts();
    list.unshift(newContract);
    this.saveContracts(list);
    return newContract;
  },

  acceptContract(contractId: string, workerName: string): boolean {
    const list = this.getContracts();
    const item = list.find(c => c.id === contractId);
    if (!item || item.status !== 'OPEN') return false;
    item.status = 'IN_PROGRESS';
    item.workerName = workerName;
    this.saveContracts(list);
    return true;
  },

  completeContract(contractId: string): ServiceContract | null {
    const list = this.getContracts();
    const item = list.find(c => c.id === contractId);
    if (!item) return null;
    item.status = 'COMPLETED';
    this.saveContracts(list);
    return item;
  },
};

