/**
 * Avatar Customization, Cosmetic Inventory & Account Persistence Manager
 * Supports Countryballs, Xilam, Minecraft, Roblox, and Brand crossover themes.
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CharacterData } from '../components/CharacterAvatar';

export interface CosmeticItem {
  id: string;
  name: string;
  slot: 'hat' | 'face' | 'back' | 'aura' | 'emblem';
  priceCoins: number;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World' | 'Universal';
  icon: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
}

export interface StartingAbility {
  name: string;
  icon: string;
  description: string;
  cooldownSec: number;
  effectType: 'fortify' | 'inspire' | 'super_jump' | 'feast' | 'overcharge' | 'war_cry' | 'haka_tremor' | 'diplomatic_immunity' | 'blueprint_intel';
  voiceLine: string;
}

export interface PassiveSkill {
  name: string;
  icon: string;
  description: string;
  statBonus: string;
}

export interface CharacterClass {
  id: string;
  name: string;
  brand: string;
  role: string;
  icon: string;
  perkTitle: string;
  perkDescription: string;
  statBonus: string;
  startingAbility: StartingAbility;
  passiveSkill: PassiveSkill;
  recommendedPlaystyle: string;
  abilityVfxColor: string;
}

export interface BrandFaction {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'McDonald\'s' | 'YouTube' | 'NZ' | 'BP' | 'New World' | 'Sprunki' | 'Thomas & Friends';
  icon: string;
  bannerEmoji: string;
  colorHex: string;
  headquarters: string;
  lore: string;
  factionPerkTitle: string;
  factionPerkDescription: string;
  statBonus: string;
  crestIcon: string;
}

export const BRAND_FACTIONS: BrandFaction[] = [
  {
    id: 'faction_minecraft',
    name: 'Overworld Builders Guild',
    brand: 'Minecraft',
    icon: '⛏️',
    bannerEmoji: '🏰',
    colorHex: '#10b981',
    headquarters: 'Obsidian Mountain Citadel (Chunk 0,0)',
    lore: 'Master stonemasons, redstone engineers, and spelunkers dedicated to fortifying the overworld against the abyssal void.',
    factionPerkTitle: 'Bedrock Masonry',
    factionPerkDescription: '+25% defensive block durability and double chance of discovering rare ores while mining.',
    statBonus: '+25% Block Armor, 2x Ore Luck',
    crestIcon: '⛏️',
  },
  {
    id: 'faction_roblox',
    name: 'Bloxian Obby Syndicate',
    brand: 'Roblox',
    icon: '🟥',
    bannerEmoji: '👟',
    colorHex: '#e2231a',
    headquarters: 'Crossroads Sky Tower & Neon Parkour Arena',
    lore: 'Daredevil speedrunners, obby champions, and tycoon builders defying gravity across high-altitude floating platforms.',
    factionPerkTitle: 'Velocity Hyper-Coil',
    factionPerkDescription: '+20% sprint velocity and immunity to standard fall shockwaves after high-altitude vaults.',
    statBonus: '+20% Sprint Speed, 0 Fall Damage',
    crestIcon: '🌀',
  },
  {
    id: 'faction_countryballs',
    name: 'Sovereign Nations League',
    brand: 'Countryballs',
    icon: '🌐',
    bannerEmoji: '🕊️',
    colorHex: '#3b82f6',
    headquarters: 'Geneva Global Assembly Plaza',
    lore: 'Diplomats, cartographers, and sovereign delegates uniting 48 nations to preserve sovereign clay and broker free trade.',
    factionPerkTitle: 'Accord of Non-Aggression',
    factionPerkDescription: '0% marketplace transaction fees and +15% coin yield when completing diplomatic trade quests.',
    statBonus: '0% Trade Fees, +15% Quest Gold',
    crestIcon: '📜',
  },
  {
    id: 'faction_mcdonalds',
    name: 'Golden Arches Happy League',
    brand: 'McDonald\'s',
    icon: '🍟',
    bannerEmoji: '🍔',
    colorHex: '#facc15',
    headquarters: 'Landmark 4 Golden Arches Mega-Depot',
    lore: 'Culinary virtuosos and hospitallers spreading cheer, golden fries, and succulent banquets to all weary wanderers.',
    factionPerkTitle: 'Grand Banquet Nourishment',
    factionPerkDescription: 'Consuming any food item instantly restores +50% bonus health and grants +2 absorption hearts.',
    statBonus: '+50% Food Healing, +2 Max Hearts',
    crestIcon: '🍔',
  },
  {
    id: 'faction_youtube',
    name: 'Viral Streamer Collective',
    brand: 'YouTube',
    icon: '▶️',
    bannerEmoji: '📢',
    colorHex: '#ef4444',
    headquarters: 'Creator Studio 4K Broadcast Amphitheater',
    lore: 'Content creators, shoutcasters, and audio pioneers inspiring audiences across the multiverse with viral hype.',
    factionPerkTitle: 'Viral Algorithm Surge',
    factionPerkDescription: '+35% experience gains from all world events and permanent hype particle trail.',
    statBonus: '+35% Event XP, Hype Trail',
    crestIcon: '💎',
  },
  {
    id: 'faction_nz',
    name: 'Waitangi Voyagers Clan',
    brand: 'NZ',
    icon: '🌿',
    bannerEmoji: '🏉',
    colorHex: '#0284c7',
    headquarters: 'Waitangi Coastal Haven & Sacred Taonga Grove',
    lore: 'Guardians of the Southern Cross, oceanic navigators, and Haka warriors bonded by sacred Pounamu greenstone.',
    factionPerkTitle: 'Wayfinder Celestial Guidance',
    factionPerkDescription: 'Reveals hidden biome shrines on the compass HUD and grants +25% unhindered overland sprint speed.',
    statBonus: '+25% Nav Speed, Biome Radar',
    crestIcon: '🌿',
  },
  {
    id: 'faction_bp',
    name: 'Helios Clean Energy Initiative',
    brand: 'BP',
    icon: '⚡',
    bannerEmoji: '🌻',
    colorHex: '#059669',
    headquarters: 'Helios Solar Research Substation',
    lore: 'Eco-engineers and renewable energy pioneers building high-efficiency solar grid pipelines to cleanse environmental blight.',
    factionPerkTitle: 'Photon Bio-Cell Overcharge',
    factionPerkDescription: 'Furnaces and smelters burn with 3x efficiency and nearby machines stay permanently energized.',
    statBonus: '3x Smelt Efficiency, Hazard Shield',
    crestIcon: '🔋',
  },
  {
    id: 'faction_newworld',
    name: 'Aeternum Azoth Vanguard',
    brand: 'New World',
    icon: '⚔️',
    bannerEmoji: '🛡️',
    colorHex: '#f59e0b',
    headquarters: 'Fort Everfall Bastion Citadel',
    lore: 'Vanguard knights, siege commanders, and alchemists wielding mystical Azoth to conquer territories and repel corrupted rifts.',
    factionPerkTitle: 'Aegis of the Frontier',
    factionPerkDescription: '+30% armor damage mitigation and 50% faster territory flag capture speed.',
    statBonus: '+30% Armor Mitigation, Fast Capture',
    crestIcon: '⚔️',
  },
  {
    id: 'faction_sprunki',
    name: 'Sprunki Harmonic Chorus',
    brand: 'Sprunki',
    icon: '🔮',
    bannerEmoji: '🥁',
    colorHex: '#a855f7',
    headquarters: 'Incredibox Celestial Beat Studio',
    lore: 'Beatbox masters, cosmic vocalists, and sound architects synthesizing multiversal rhythm, from cheerful pop to deep void resonance.',
    factionPerkTitle: 'Acoustic Resonance Drop',
    factionPerkDescription: 'Emotes and ability casts trigger musical rhythm shockwaves that disorient and slow hostile mobs by 40%.',
    statBonus: '+20% Ability Haste, Sonic Aura',
    crestIcon: '🎵',
  },
  {
    id: 'faction_thomas',
    name: 'Sodor North Western Railway',
    brand: 'Thomas & Friends',
    icon: '🚂',
    bannerEmoji: '🛤️',
    colorHex: '#2563eb',
    headquarters: 'Knapford Junction & Sodor Steamworks',
    lore: 'Really Useful Engines and stationmasters dedicated to keeping heavy freight, passenger expresses, and mail trains on time.',
    factionPerkTitle: 'Heavy Boiler Momentum',
    factionPerkDescription: 'Tremendous kinetic momentum; running into hostile mobs deflects them backwards with a steam burst.',
    statBonus: '+40% Knockback Resist, Steam Rush',
    crestIcon: '🚂',
  },
];

export interface SpeciesInfo {
  id: 'minecraft' | 'roblox' | 'countryball' | 'sprnuki' | 'train' | 'xilam';
  name: string;
  icon: string;
  banner: string;
  colorHex: string;
  lore: string;
  innatePerk: string;
  playableCount: number;
  highlightCharacters: string[];
}

export const SPECIES_INFO: SpeciesInfo[] = [
  {
    id: 'minecraft',
    name: 'Minecraft Mobs & Heroes',
    icon: '⛏️',
    banner: 'Blocky 3D voxel anatomy with customizable armor tiers, pixel shields, and enchanted weapons.',
    colorHex: '#10b981',
    lore: 'Heroes and creatures born from the Infinite Voxel World: Steve, Alex, Creepers, Endermen, Breeze, Sniffers, and Nether Titans.',
    innatePerk: 'Voxel Fortitude: Blocks placed have +20% durability and tool breaking chance is reduced.',
    playableCount: 35,
    highlightCharacters: ['Steve', 'Alex', 'Breeze', 'Sniffer', 'Warden', 'Armadillo'],
  },
  {
    id: 'roblox',
    name: 'Roblox Avatars',
    icon: '🟥',
    banner: 'Classic bevelled R6 blocks, custom hats, Pal Bacon Hair, Speed Coils, and Dominus Cowls.',
    colorHex: '#e2231a',
    lore: 'Legions of Bloxburg pioneers, noobs, obby speedrunners, Builderman, and legendary glitch entities.',
    innatePerk: 'Physics Defiance: Enhanced jump height and immunity to standard fall damage on bouncy surfaces.',
    playableCount: 12,
    highlightCharacters: ['Classic Noob', 'Bacon Hair', 'Bacon Girl', 'Builderman', '1x1x1x1', 'Shedletsky'],
  },
  {
    id: 'countryball',
    name: 'Sovereign Countryballs',
    icon: '🌐',
    banner: 'Spherical sovereign flag avatars with expressive national eyes, historic headwear, and regional perks.',
    colorHex: '#3b82f6',
    lore: '48 sovereign nations embodying global cultures, histories, national anthems, and international trade accords.',
    innatePerk: 'Diplomatic Accord: +10% merchant discounts and immunity to border territory disputes.',
    playableCount: 48,
    highlightCharacters: ['Polandball', 'USAball', 'UKball', 'Japanball', 'Germanyball', 'New Zealand'],
  },
  {
    id: 'sprnuki',
    name: 'Sprunki Beatboxers',
    icon: '🔮',
    banner: 'Stylized Incredibox beatbox avatars with musical note auras, dual-phase Horror forms, and star halos.',
    colorHex: '#a855f7',
    lore: 'Cosmic rhythm vocalists and beatbox masters generating acoustic melodies across bright pop and dark void harmonics.',
    innatePerk: 'Harmonic Pulse: Audio abilities have 25% lower cooldown and trigger crowd rhythm cheers.',
    playableCount: 32,
    highlightCharacters: ['Oren', 'Raddy', 'Vineria', 'Pinki', 'Verity', 'Tarragower Piper', 'Cosmic Supernova'],
  },
  {
    id: 'train',
    name: 'Sodor Locomotives',
    icon: '🚂',
    banner: 'Authentic steam and diesel locomotives with working smoke plumes, side rods, and engine livery numbers.',
    colorHex: '#2563eb',
    lore: 'Really Useful Engines of Sodor puffing across branch lines and mainlines with unwavering determination.',
    innatePerk: 'Iron Rail Momentum: Infinite pulling capacity and immune to mob displacement effects.',
    playableCount: 31,
    highlightCharacters: ['Thomas', 'Percy', 'James', 'Gordon', 'Emily', 'Murdoch', 'Daisy', 'Boco'],
  },
  {
    id: 'xilam',
    name: 'Xilam Cartoon Icons',
    icon: '💥',
    banner: 'Rubbery slapstick cartoon characters with animated swatters, boxing gloves, and comedy physics.',
    colorHex: '#f59e0b',
    lore: 'Stars of Oggy and the Cockroaches and Zig & Sharko navigating hilarious slapstick chase mayhem.',
    innatePerk: 'Slapstick Resilience: Delivers 3x comedic knockback and bounces back rapidly from stuns.',
    playableCount: 11,
    highlightCharacters: ['Oggy', 'Jack', 'Joey', 'Dee Dee', 'Bob Bulldog', 'Olivia', 'Bernie'],
  },
];

export const CHARACTER_CLASSES: CharacterClass[] = [
  {
    id: 'minecraft_miner',
    name: 'Minecraft Master Builder',
    brand: 'Minecraft',
    role: 'Builder & Fortification Tank',
    icon: '⛏️',
    perkTitle: 'Diamond Vein Instinct',
    perkDescription: '+35% block mining speed and permanent night-vision spelunking resilience.',
    statBonus: '+35% Mining Speed, 2x Ore Luck',
    startingAbility: {
      name: 'Instant Bedrock Rampart',
      icon: '🧱',
      description: 'Erects an unbreakable defensive bastion that repels hostiles, grants 6s invincibility, and adds +5 building blocks to inventory.',
      cooldownSec: 18,
      effectType: 'fortify',
      voiceLine: 'Grab your pickaxes! Fortifying the perimeter before darkness falls!',
    },
    passiveSkill: {
      name: 'Deep Spelunker Prospector',
      icon: '💎',
      description: 'Rare gemstone veins glow through stone and tool durability depletion is reduced by 30%.',
      statBonus: '+30% Tool Durability, +100% Ore Glow',
    },
    recommendedPlaystyle: 'Frontline base building, subterranean resource extraction, defensive rampart architecture, and fortress containment.',
    abilityVfxColor: '#10b981',
  },
  {
    id: 'youtube_creator',
    name: 'YouTube Content Creator',
    brand: 'YouTube',
    role: 'Support & Crowd Buffer',
    icon: '▶️',
    perkTitle: 'Viral Hype Aura',
    perkDescription: '+40% Experience Gain (XP) and audience subscriber cheers on accomplishments.',
    statBonus: '+40% XP Multiplier, Hype Trail',
    startingAbility: {
      name: '100M Viral Inspiration Wave',
      icon: '📢',
      description: 'Emits a blinding golden stream flare that grants all nearby allies +50% sprint velocity and +30% attack speed for 10s.',
      cooldownSec: 20,
      effectType: 'inspire',
      voiceLine: 'What is up chat! We are LIVE and powering up the whole squad right now!',
    },
    passiveSkill: {
      name: 'Algorithm Trendsetter',
      icon: '✨',
      description: 'Earns +40% bonus XP from world events and generates crowd confetti upon completing any objective.',
      statBonus: '+40% Event XP, +25% Coin Multiplier',
    },
    recommendedPlaystyle: 'Voice chat shoutcasting, team coordination, high-tempo mobility buffing, and rally leadership during world raids.',
    abilityVfxColor: '#ef4444',
  },
  {
    id: 'roblox_speedrunner',
    name: 'Roblox Obby Champion',
    brand: 'Roblox',
    role: 'High-Mobility Parkour Scout',
    icon: '👟',
    perkTitle: 'Speed & Gravity Coil',
    perkDescription: '+25% sprint velocity and jump pad bounce height.',
    statBonus: '+25% Sprint Burst, High Jump',
    startingAbility: {
      name: 'Gravity Coil Hyper-Vault',
      icon: '🌀',
      description: 'Catapults the player skyward with a dual-stage super jump and forward air dash, completely negating fall damage for 8s.',
      cooldownSec: 12,
      effectType: 'super_jump',
      voiceLine: 'OOF! Watch this insane speedrun shortcut across the void!',
    },
    passiveSkill: {
      name: 'Bloxy Stamina & Physics Defiance',
      icon: '⚡',
      description: 'Sprint stamina recharges 2x faster, and character bounces harmlessly off sheer cliff faces.',
      statBonus: '+30% Sprint Speed, 0 Fall Damage',
    },
    recommendedPlaystyle: 'Vertical exploration, rapid outflanking of hostile mobs, obstacle relay speedrunning, and capturing elevated flags.',
    abilityVfxColor: '#e2231a',
  },
  {
    id: 'mcdonalds_chef',
    name: 'McDonald\'s Golden Chef',
    brand: 'McDonald\'s',
    role: 'Healer, Sustainer & Provisioner',
    icon: '🍔',
    perkTitle: 'Secret Recipe Nourishment',
    perkDescription: '+50% food replenishment and instantaneous hunger recovery.',
    statBonus: '+50% Food Regen, +2 Max Hearts',
    startingAbility: {
      name: 'Golden Banquet Feast',
      icon: '🍟',
      description: 'Drops a steaming gourmet banquet crate that instantly heals the player and nearby allies for 50 HP and completely satisfies hunger.',
      cooldownSec: 22,
      effectType: 'feast',
      voiceLine: 'Order up! Sizzling fresh provisions for the whole party!',
    },
    passiveSkill: {
      name: 'Sizzling Chef Vigor',
      icon: '❤️',
      description: 'Consuming any bread, apple, or combo item grants 10s of +25% armor protection and +2 bonus absorption hearts.',
      statBonus: '+2 Bonus Hearts, +25% Defense on Eat',
    },
    recommendedPlaystyle: 'Party sustenance, deep cavern expedition recovery, boss survival support, and frontline food provisioning.',
    abilityVfxColor: '#facc15',
  },
  {
    id: 'bp_engineer',
    name: 'BP Clean Energy Eco-Engineer',
    brand: 'BP',
    role: 'Area Defense & Tech Specialist',
    icon: '⚡',
    perkTitle: 'Bio-Solar Turbo Charge',
    perkDescription: '+25% smelter fuel duration and electrified furnace auto-crafting.',
    statBonus: '+25% Fuel Durability, 2x Smelt Speed',
    startingAbility: {
      name: 'Solar Photon Overcharge',
      icon: '🔋',
      description: 'Radiates a high-frequency cleansing pulse that converts nearby hazardous lava into obsidian and restores +30% tool durability.',
      cooldownSec: 16,
      effectType: 'overcharge',
      voiceLine: 'Solar grid synced! Recharging all batteries and equipment to maximum capacity!',
    },
    passiveSkill: {
      name: 'Bio-Cell Efficiency Grid',
      icon: '☀️',
      description: 'Furnaces and smelters burn with 300% efficiency, and nearby command/redstone blocks remain permanently energized.',
      statBonus: '3x Fuel Longevity, Hazard Resistance',
    },
    recommendedPlaystyle: 'Base automation, circuit logic, environmental hazard cleansing, and outpost grid maintenance.',
    abilityVfxColor: '#059669',
  },
  {
    id: 'new_world_pioneer',
    name: 'New World Faction Conqueror',
    brand: 'New World',
    role: 'Frontline Heavy Tank & Vanguard',
    icon: '🧭',
    perkTitle: 'Frontier Cartographer',
    perkDescription: '+30% wilderness foraging yield and territory claim beacon protection.',
    statBonus: '+30% Forage Yield, Safe Camp Radius',
    startingAbility: {
      name: 'Aeternum Azoth War Cry',
      icon: '⚔️',
      description: 'Unleashes an ethereal blue runic shockwave that taunts hostile mobs away from allies and grants the squad +30% attack strength for 10s.',
      cooldownSec: 18,
      effectType: 'war_cry',
      voiceLine: 'For the realm of Aeternum! Stand firm and break their lines!',
    },
    passiveSkill: {
      name: 'Territory Sovereign Aegis',
      icon: '🛡️',
      description: 'Captures contested fort flags 50% faster and gains +25% damage mitigation while standing inside territory claim zones.',
      statBonus: '+50% Capture Speed, +25% Fort Armor',
    },
    recommendedPlaystyle: 'Frontline melee engagement, raid boss tanking, territory conquest, and leading collaborative assaults.',
    abilityVfxColor: '#38bdf8',
  },
  {
    id: 'nz_rangatira',
    name: 'NZ Rangatira & Wayfinder',
    brand: 'NZ',
    role: 'Exploration Scout & Team Pathfinder',
    icon: '🌿',
    perkTitle: 'Southern Cross Wayfinding',
    perkDescription: '+30% exploration stamina, bioluminescent trail, and +20% wilderness navigation speed.',
    statBonus: '+30% Stamina, +20% Nav Speed',
    startingAbility: {
      name: 'Ka Mate Haka Tremor',
      icon: '👣',
      description: 'Stomps the earth in a sacred ritual cadence, creating an earthquake shockwave that slows hostile mobs by 60% and grants infinite sprint stamina for 12s.',
      cooldownSec: 20,
      effectType: 'haka_tremor',
      voiceLine: 'Ka mate, ka mate! Ka ora, ka ora! The ancestors guide our steps!',
    },
    passiveSkill: {
      name: 'Southern Cross Celestial Guidance',
      icon: '⭐',
      description: 'Pings the nearest landmark and rare biome shrine on the compass HUD, with +25% unhindered overland traversal speed.',
      statBonus: '+25% Overworld Speed, Biome Radar',
    },
    recommendedPlaystyle: 'Long-range multiverse traversal, landmark discovery, crowd-control tremors, and guiding new builders through unfamiliar biomes.',
    abilityVfxColor: '#15803d',
  },
  {
    id: 'countryball_diplomat',
    name: 'Countryball Sovereign Diplomat',
    brand: 'Countryballs',
    role: 'Diplomatic Ambassador & Merchant',
    icon: '🌐',
    perkTitle: 'Sovereign Accord',
    perkDescription: '+25% Marketplace Charisma discount and +10% travel speed.',
    statBonus: '+25% Trade Discount, +10% Speed',
    startingAbility: {
      name: 'Diplomatic Safe Harbor Pact',
      icon: '📜',
      description: 'Declares an international ceasefire bubble that shields all players within 10 blocks from hostile damage for 8s.',
      cooldownSec: 24,
      effectType: 'diplomatic_immunity',
      voiceLine: 'Order in the General Assembly! Sovereign peace treaty enacted!',
    },
    passiveSkill: {
      name: 'Sovereign Free Trade Network',
      icon: '🪙',
      description: 'Reduces all marketplace transaction fees to zero and grants +20% coins when selling harvested resources.',
      statBonus: '0% Trade Fees, +20% Sell Price',
    },
    recommendedPlaystyle: 'Trade negotiation, international guild diplomacy, defensive mediation, and economic asset management.',
    abilityVfxColor: '#3b82f6',
  },
  {
    id: 'tarragower_scholar',
    name: 'Tarragower School Scholar',
    brand: 'Tarragower',
    role: 'Intellect, Logic & Blueprint Sage',
    icon: '🎓',
    perkTitle: 'Architectural Blueprint Logic',
    perkDescription: '+35% puzzle XP, free blueprint hints, and reduced crafting ingredients.',
    statBonus: '+35% Puzzle XP, -15% Crafting Cost',
    startingAbility: {
      name: 'Glyphic Academy Revelation',
      icon: '💡',
      description: 'Projects an intellectual glyph circle that instantly reveals puzzle solutions and grants allies +35% experience gains.',
      cooldownSec: 15,
      effectType: 'blueprint_intel',
      voiceLine: 'Knowledge is our sharpest blade! Analyzing structural schematic now!',
    },
    passiveSkill: {
      name: 'Academic Mastery',
      icon: '📚',
      description: 'Reduces all crafting recipe requirements by 15% and grants instant recognition of all block hardness tiers.',
      statBonus: '-15% Recipe Cost, Instant Inspection',
    },
    recommendedPlaystyle: 'Puzzle solving, schematic engineering, rapid leveling, and guiding apprentice students through complex redstone circuits.',
    abilityVfxColor: '#6366f1',
  },
];

export const COSMETICS_CATALOG: CosmeticItem[] = [
  // HATS
  { id: 'hat_crown', name: 'Golden Monarch Crown', slot: 'hat', priceCoins: 0, brand: 'Universal', icon: '👑', description: 'Gleaming pure gold crown fit for server rulers.', rarity: 'epic' },
  { id: 'hat_sombrero', name: 'Fiesta Sombrero', slot: 'hat', priceCoins: 120, brand: 'Countryballs', icon: '👒', description: 'Wide-brim embroidered sombrero for sunny adventures.', rarity: 'common' },
  { id: 'hat_ushanka', name: 'Winter Ushanka Fur Cap', slot: 'hat', priceCoins: 150, brand: 'Countryballs', icon: '💂', description: 'Cozy ear-flap cap with cold-resistance style.', rarity: 'rare' },
  { id: 'hat_tophat', name: 'Victorian Gentleman Top Hat', slot: 'hat', priceCoins: 200, brand: 'Universal', icon: '🎩', description: 'Polished silk top hat with crimson band.', rarity: 'rare' },
  { id: 'hat_chef', name: 'Golden Arches Chef Hat', slot: 'hat', priceCoins: 180, brand: 'McDonald\'s', icon: '👨‍🍳', description: 'Official high-pleated gourmet burger master toque.', rarity: 'rare' },
  { id: 'hat_dominus', name: 'Dominus Aureus Hood', slot: 'hat', priceCoins: 600, brand: 'Roblox', icon: '✨', description: 'Mythic golden hood with glowing crimson eyes.', rarity: 'mythic' },
  { id: 'hat_mining', name: 'Miner Headlamp Helmet', slot: 'hat', priceCoins: 140, brand: 'Minecraft', icon: '⛑️', description: 'Safety yellow hard hat with high-intensity beam.', rarity: 'common' },
  { id: 'hat_viking', name: 'Valhalla Horned Helm', slot: 'hat', priceCoins: 250, brand: 'Universal', icon: '🪖', description: 'Sturdy iron skullcap with polished bull horns.', rarity: 'epic' },
  { id: 'hat_halo', name: 'Verity Celestial Halo', slot: 'hat', priceCoins: 350, brand: 'Universal', icon: '💫', description: 'Floating ring of pure crystalline starlight.', rarity: 'legendary' },
  { id: 'hat_silver_fern', name: 'Silver Fern Embroidered Cap', slot: 'hat', priceCoins: 160, brand: 'NZ', icon: '🧢', description: 'All Blacks performance cap featuring the iconic New Zealand Silver Fern.', rarity: 'rare' },
  { id: 'hat_kowhai', name: 'Kōwhai Blossom Crown', slot: 'hat', priceCoins: 210, brand: 'NZ', icon: '🌼', description: 'Vibrant golden New Zealand native floral circlet.', rarity: 'epic' },
  { id: 'hat_witch', name: 'Wicked Witch Pointed Hat', slot: 'hat', priceCoins: 180, brand: 'Universal', icon: '🧙', description: 'Pointed midnight hat with a glowing enchanted buckle.', rarity: 'epic' },
  { id: 'hat_pumpkin', name: 'Carved Jack-o\'-Lantern Helm', slot: 'hat', priceCoins: 200, brand: 'Universal', icon: '🎃', description: 'Illuminated glowing pumpkin head with flickering candle embers.', rarity: 'epic' },
  { id: 'hat_frankenstein', name: 'Monster Stitched Brow & Neck Bolts', slot: 'hat', priceCoins: 160, brand: 'Universal', icon: '🧟', description: 'Stitched monstrous forehead with metallic neck electrodes.', rarity: 'rare' },
  { id: 'hat_vampire', name: 'Dracula Widow\'s Peak & Collar', slot: 'hat', priceCoins: 220, brand: 'Universal', icon: '🧛', description: 'High-collared royal vampire capelet and slick widow peak.', rarity: 'epic' },
  { id: 'hat_skeleton_skull', name: 'Catacomb Skull Visor', slot: 'hat', priceCoins: 190, brand: 'Universal', icon: '💀', description: 'Bleached skull crown with sinister hollow eye sockets.', rarity: 'rare' },
  { id: 'hat_santa', name: 'Santa Claus Velvet Cap', slot: 'hat', priceCoins: 150, brand: 'Universal', icon: '🎅', description: 'Plush crimson velvet cap with snowy white fur trim and fluffy pom-pom tip.', rarity: 'epic' },
  { id: 'hat_reindeer_antlers', name: 'Rudolph Glowing Antlers', slot: 'hat', priceCoins: 180, brand: 'Universal', icon: '🦌', description: 'Branching reindeer antlers complete with a warm glowing ruby nose.', rarity: 'rare' },
  { id: 'hat_elf_hat', name: 'Toy Workshop Elf Cap', slot: 'hat', priceCoins: 130, brand: 'Universal', icon: '🧝', description: 'Jolly green elf cap with zig-zag brim and jingling golden bells.', rarity: 'rare' },
  { id: 'hat_christmas_tree', name: 'Tinsel Holiday Tree Crown', slot: 'hat', priceCoins: 220, brand: 'Universal', icon: '🎄', description: 'Pine tree headpiece decked with shiny baubles and a spinning golden star.', rarity: 'legendary' },
  { id: 'hat_winter_earmuffs', name: 'Polar Wool Earmuffs', slot: 'hat', priceCoins: 90, brand: 'Universal', icon: '🎧', description: 'Ultra-warm plush fleece earmuffs for frosty blizzards.', rarity: 'common' },
  { id: 'hat_snow_beanie', name: 'Nordic Snowflake Beanie', slot: 'hat', priceCoins: 110, brand: 'Universal', icon: '🧶', description: 'Hand-knitted winter beanie with geometric ice crystal patterns.', rarity: 'common' },
  { id: 'hat_nutcracker', name: 'Royal Nutcracker Shako', slot: 'hat', priceCoins: 240, brand: 'Universal', icon: '💂', description: 'Ceremonial toy soldier high helmet with gold filigree and visor.', rarity: 'epic' },
  { id: 'hat_polar_bear_hood', name: 'Polar Bear Frost Fur Hood', slot: 'hat', priceCoins: 160, brand: 'Universal', icon: '🐻‍❄️', description: 'Ultra-warm Arctic white bear hood with fluffy ears and thermal lining.', rarity: 'rare' },
  { id: 'hat_gingerbread_chef', name: 'Gingerbread Baker Chef Hat', slot: 'hat', priceCoins: 150, brand: 'McDonald\'s', icon: '👨‍🍳', description: 'Striped peppermint-band chef hat dusted with sweet icing sugar.', rarity: 'rare' },
  { id: 'hat_holly_beret', name: 'Mistletoe & Holly Beret', slot: 'hat', priceCoins: 130, brand: 'Universal', icon: '🌿', description: 'Wool holiday beret pinned with glossy red berries and fresh mistletoe.', rarity: 'common' },
  { id: 'hat_ice_crown', name: 'Glacial Crystal Ice Crown', slot: 'hat', priceCoins: 350, brand: 'New World', icon: '👑', description: 'Frozen spire tiara carved from eternal permafrost crystals.', rarity: 'legendary' },
  { id: 'hat_bp_solar_snowcap', name: 'BP Solar Winter Helmet', slot: 'hat', priceCoins: 170, brand: 'BP', icon: '⚡', description: 'Insulated thermal helmet with micro photovoltaic warming cells.', rarity: 'rare' },
  { id: 'hat_tarragower_mortarboard', name: 'Tarragower Winter Honor Cap', slot: 'hat', priceCoins: 150, brand: 'Tarragower', icon: '🎓', description: 'Ceremonial velvet academic cap with golden tassel and school crest.', rarity: 'rare' },
  { id: 'hat_xilam_mallet_beanie', name: 'Slapstick Mallet Beanie', slot: 'hat', priceCoins: 140, brand: 'Xilam', icon: '💥', description: 'Woven beanie sporting a mini comedy squeak-mallet on top.', rarity: 'rare' },
  { id: 'hat_yt_streamer_headset', name: 'YouTube RGB Holiday Headset', slot: 'hat', priceCoins: 210, brand: 'YouTube', icon: '🎧', description: 'High-fidelity audio headset with pulsing red and green neon lights.', rarity: 'epic' },

  // FACE / EYEWEAR
  { id: 'face_shades', name: 'Pixel Deal With It Shades', slot: 'face', priceCoins: 0, brand: 'Minecraft', icon: '🕶️', description: 'Iconic 8-bit cool sunglasses.', rarity: 'common' },
  { id: 'face_monocle', name: 'Aristocrat Gold Monocle', slot: 'face', priceCoins: 110, brand: 'Countryballs', icon: '🧐', description: 'Polished brass optical lens with delicate chain.', rarity: 'rare' },
  { id: 'face_bandana', name: 'Desert Outlaw Bandana', slot: 'face', priceCoins: 90, brand: 'New World', icon: '🧣', description: 'Patterned paisley bandana masking lower face.', rarity: 'common' },
  { id: 'face_cyborg', name: 'Cyborg Laser Monocular', slot: 'face', priceCoins: 300, brand: 'Roblox', icon: '🔴', description: 'Cybernetic targeting ocular unit with red reticle.', rarity: 'epic' },
  { id: 'face_goggles', name: 'Steampunk Brass Goggles', slot: 'face', priceCoins: 160, brand: 'Tarragower', icon: '🥽', description: 'Dual-lens laboratory inspection goggles.', rarity: 'rare' },
  { id: 'face_ta_moko', name: 'Sacred Tā Moko Markings', slot: 'face', priceCoins: 180, brand: 'NZ', icon: '🌀', description: 'Intricate traditional spiral facial tattoo representing ancestral lineage.', rarity: 'legendary' },
  { id: 'face_pounamu', name: 'Pounamu Greenstone Pendant', slot: 'face', priceCoins: 140, brand: 'NZ', icon: '🟢', description: 'Sacred carved nephrite jade talisman carrying ocean blessings.', rarity: 'rare' },
  { id: 'face_santa_beard', name: 'Snowy Santa Beard & Mustache', slot: 'face', priceCoins: 140, brand: 'Universal', icon: '🧔‍♂️', description: 'Glorious fluffy white Santa beard, mustache, and jolly smile.', rarity: 'rare' },
  { id: 'face_frosty_blush', name: 'Frostbite Cheeks & Rudolph Nose', slot: 'face', priceCoins: 100, brand: 'Universal', icon: '🔴', description: 'Chilly rosy cheeks paired with a luminous red reindeer nose.', rarity: 'common' },
  { id: 'face_elf_ears', name: 'Enchanted Pointed Elf Ears', slot: 'face', priceCoins: 120, brand: 'Universal', icon: '👂', description: 'Magical pointed ears blessed by Santa\'s North Pole workshop.', rarity: 'rare' },
  { id: 'face_frost_spectacles', name: 'Frost-Rim Reading Spectacles', slot: 'face', priceCoins: 110, brand: 'Tarragower', icon: '👓', description: 'Intricate brass spectacles frosted with delicate ice crystal patterns.', rarity: 'rare' },
  { id: 'face_peppermint_monocle', name: 'Peppermint Swirl Monocle', slot: 'face', priceCoins: 120, brand: 'Countryballs', icon: '🧐', description: 'Festive red and white candy-striped diplomatic eyeglass.', rarity: 'rare' },
  { id: 'face_xilam_cat_whiskers', name: 'Oggy Cat Whiskers & Pink Nose', slot: 'face', priceCoins: 90, brand: 'Xilam', icon: '🐱', description: 'Cute twitching cat whiskers and glossy pink slapstick button nose.', rarity: 'common' },
  { id: 'face_bp_energy_visor', name: 'BP Solar Energy HUD Visor', slot: 'face', priceCoins: 180, brand: 'BP', icon: '🥽', description: 'Clean energy digital visor projecting real-time photon grid telemetry.', rarity: 'rare' },
  { id: 'face_yt_streamer_mic', name: 'YouTube Studio Boom Mic', slot: 'face', priceCoins: 130, brand: 'YouTube', icon: '🎙️', description: 'Gold-plated broadcast boom microphone for crisp spatial commentary.', rarity: 'rare' },
  { id: 'face_tarragower_magnifier', name: 'Tarragower Blueprint Loupe', slot: 'face', priceCoins: 140, brand: 'Tarragower', icon: '🔍', description: 'Multi-lens jeweled magnifying loupe for inspecting redstone circuitry.', rarity: 'rare' },

  // BACK / WINGS / CAPE
  { id: 'back_elytra', name: 'Enchanted Elytra Wings', slot: 'back', priceCoins: 0, brand: 'Minecraft', icon: '🪽', description: 'Aerodynamic beetle wings for gliding.', rarity: 'rare' },
  { id: 'back_mojang', name: 'Mojang Red Cape', slot: 'back', priceCoins: 250, brand: 'Minecraft', icon: '🧣', description: 'Rare red cape emblazoned with the Mojang seal.', rarity: 'epic' },
  { id: 'back_katana', name: 'Linked Blade Sheath', slot: 'back', priceCoins: 280, brand: 'Roblox', icon: '⚔️', description: 'Dual cross-sheathed ninjato swords.', rarity: 'epic' },
  { id: 'back_angel', name: 'Seraphic Angel Feathers', slot: 'back', priceCoins: 450, brand: 'Universal', icon: '🕊️', description: 'Luminous white feathered wings.', rarity: 'legendary' },
  { id: 'back_dragon', name: 'Ender Dragon Wings', slot: 'back', priceCoins: 550, brand: 'Minecraft', icon: '🐉', description: 'Dark obsidian membrane wings of the dragon.', rarity: 'legendary' },
  { id: 'back_turtle', name: 'Turtle Scute Carapace', slot: 'back', priceCoins: 190, brand: 'Universal', icon: '🐢', description: 'Sturdy green defensive shell on back.', rarity: 'rare' },
  { id: 'back_kiwi', name: 'Kiwi Companion Backpack', slot: 'back', priceCoins: 260, brand: 'NZ', icon: '🥝', description: 'Adorable nocturnal kiwi bird chick resting comfortably in a pack.', rarity: 'epic' },
  { id: 'back_allblacks_cape', name: 'Silver Fern Flag Cape', slot: 'back', priceCoins: 240, brand: 'NZ', icon: '🏴', description: 'Flowing midnight-black cloak with the white Silver Fern and Southern Cross.', rarity: 'epic' },
  { id: 'back_bat_wings', name: 'Flapping Midnight Bat Wings', slot: 'back', priceCoins: 300, brand: 'Universal', icon: '🦇', description: 'Leathery midnight bat wings that flap with eerie shadows.', rarity: 'legendary' },
  { id: 'back_reaper_scythe', name: 'Crossed Soul Scythes', slot: 'back', priceCoins: 350, brand: 'Universal', icon: '🗡️', description: 'Enchanted grim reaper soul scythes sheathed across spine.', rarity: 'legendary' },
  { id: 'back_ghost_float', name: 'Floating Companion Spook', slot: 'back', priceCoins: 280, brand: 'Universal', icon: '👻', description: 'Friendly translucent wisp ghost floating over shoulder.', rarity: 'rare' },
  { id: 'back_santa_sack', name: 'Santa\'s Heavy Toy Sack', slot: 'back', priceCoins: 260, brand: 'Universal', icon: '🎁', description: 'Bulging velvet sack packed to the brim with toys, candy, and surprises.', rarity: 'epic' },
  { id: 'back_snow_globe', name: 'Luminous Winter Snow Globe', slot: 'back', priceCoins: 340, brand: 'Universal', icon: '🔮', description: 'Crystal sphere containing swirling enchanted snow and micro-pines.', rarity: 'legendary' },
  { id: 'back_festive_wreath', name: 'Evergreen Wreath & Sleigh Bell', slot: 'back', priceCoins: 200, brand: 'Universal', icon: '🎀', description: 'Fresh pine wreath tied with royal red ribbon and golden jingle bells.', rarity: 'rare' },
  { id: 'back_gingerbread_shield', name: 'Iced Gingerbread Warrior Shield', slot: 'back', priceCoins: 220, brand: 'Universal', icon: '🍪', description: 'Hard-baked cookie shield reinforced with royal icing and gumdrop studs.', rarity: 'rare' },
  { id: 'back_reindeer_sleigh', name: 'Mini Flying Reindeer Sleigh', slot: 'back', priceCoins: 360, brand: 'Universal', icon: '🛷', description: 'Detailed miniature sleigh with gold runners and orbiting toy gifts.', rarity: 'legendary' },
  { id: 'back_icicle_spikes', name: 'Glacial Ice Spine Spikes', slot: 'back', priceCoins: 280, brand: 'Minecraft', icon: '🧊', description: 'Serrated crystalline permafrost spikes radiating frosty vapor.', rarity: 'epic' },
  { id: 'back_candy_cane_swords', name: 'Dual Crossed Candy Sabers', slot: 'back', priceCoins: 260, brand: 'Universal', icon: '⚔️', description: 'Twin razor-sharp peppermint candy canes sheathed on back.', rarity: 'rare' },
  { id: 'back_bp_solar_panel', name: 'BP Photon Wing Arrays', slot: 'back', priceCoins: 310, brand: 'BP', icon: '🔋', description: 'High-tech folding solar panel wings absorbing sunlight for speed.', rarity: 'epic' },
  { id: 'back_tarragower_scroll', name: 'Tarragower Ancient Map Scroll', slot: 'back', priceCoins: 190, brand: 'Tarragower', icon: '📜', description: 'Vellum navigational charter containing celestial multiverse routes.', rarity: 'rare' },
  { id: 'back_xilam_mallet', name: '10-Ton Giant Cartoon Mallet', slot: 'back', priceCoins: 270, brand: 'Xilam', icon: '🔨', description: 'Ridiculously oversized wooden hammer delivering comedy knockback.', rarity: 'rare' },
  { id: 'back_yt_play_shield', name: 'YouTube Diamond Play Shield', slot: 'back', priceCoins: 420, brand: 'YouTube', icon: '🛡️', description: 'Prismatic crystal diamond shield reflecting incoming mob projectiles.', rarity: 'legendary' },
  { id: 'back_newworld_warhammer', name: 'Aeternum Gleamite War Hammer', slot: 'back', priceCoins: 350, brand: 'New World', icon: '🪓', description: 'Heavy battle hammer forged with fallen starlight crystals.', rarity: 'epic' },

  // AURA / PARTICLES
  { id: 'aura_none', name: 'No Aura', slot: 'aura', priceCoins: 0, brand: 'Universal', icon: '⚪', description: 'Clean, standard appearance.', rarity: 'common' },
  { id: 'aura_flame', name: 'Nether Blazing Embers', slot: 'aura', priceCoins: 220, brand: 'Minecraft', icon: '🔥', description: 'Swirling fiery sparks and magma smoke.', rarity: 'rare' },
  { id: 'aura_electric', name: 'Cyan Charged Shockwave', slot: 'aura', priceCoins: 300, brand: 'Roblox', icon: '⚡', description: 'Crackling cyan electrical arcs.', rarity: 'epic' },
  { id: 'aura_emerald', name: 'Emerald Fortune Sparkle', slot: 'aura', priceCoins: 280, brand: 'Minecraft', icon: '❇️', description: 'Shimmering green gem glimmers.', rarity: 'rare' },
  { id: 'aura_gold', name: 'Midas Golden Shimmer', slot: 'aura', priceCoins: 500, brand: 'McDonald\'s', icon: '✨', description: 'Dazzling rain of golden coins and glitter.', rarity: 'legendary' },
  { id: 'aura_void', name: 'Abyssal Void Mist', slot: 'aura', priceCoins: 650, brand: 'Minecraft', icon: '🌌', description: 'Cosmic purple fog with star particles.', rarity: 'mythic' },
  { id: 'aura_silver_fern', name: 'Silver Fern & Aurora Australis', slot: 'aura', priceCoins: 380, brand: 'NZ', icon: '🌿', description: 'Luminescent silver fern leaves swirling with emerald Southern Lights.', rarity: 'legendary' },
  { id: 'aura_yt_viral', name: 'YouTube 10M Viral Flare', slot: 'aura', priceCoins: 420, brand: 'YouTube', icon: '▶️', description: 'Cascading red subscriber notifications and golden play button sparkles.', rarity: 'epic' },
  { id: 'aura_bp_solaris', name: 'BP Solar Photon Shield', slot: 'aura', priceCoins: 310, brand: 'BP', icon: '🌻', description: 'Warm solar-energy rays and orbiting bio-fuel photon particles.', rarity: 'rare' },
  { id: 'aura_newworld_azoth', name: 'Aeternum Azoth Blue Mist', slot: 'aura', priceCoins: 450, brand: 'New World', icon: '💎', description: 'Mystic ethereal cyan Azoth mist whispering ancient power.', rarity: 'legendary' },
  { id: 'aura_tarragower_wisdom', name: 'Tarragower Glyphic Orbit', slot: 'aura', priceCoins: 290, brand: 'Tarragower', icon: '📐', description: 'Floating architectural blueprints and illuminated mathematical runes.', rarity: 'rare' },
  { id: 'aura_halloween_spooky', name: 'Dancing Jack-o\'-Lantern & Spirit Aura', slot: 'aura', priceCoins: 400, brand: 'Universal', icon: '🎃', description: 'Orbiting mini carved pumpkins, glowing candy, and spirit wisps.', rarity: 'legendary' },
  { id: 'aura_blood_mist', name: 'Blood Moon Crimson Mist & Bats', slot: 'aura', priceCoins: 450, brand: 'Universal', icon: '🩸', description: 'Ominous crimson fog with fluttering nocturnal bat silhouettes.', rarity: 'mythic' },
  { id: 'aura_snowfall', name: 'Gentle Winter Snowfall', slot: 'aura', priceCoins: 320, brand: 'Universal', icon: '❄️', description: 'Peaceful swirling snowflakes and sparkling crystalline frost drift.', rarity: 'legendary' },
  { id: 'aura_christmas_lights', name: 'Rainbow Holiday Fairy Lights', slot: 'aura', priceCoins: 380, brand: 'Universal', icon: '💡', description: 'Vibrant twinkling red, green, yellow, and blue festive fairy lights.', rarity: 'legendary' },
  { id: 'aura_blizzard', name: 'Arctic Blizzard Wind Vortex', slot: 'aura', priceCoins: 460, brand: 'Universal', icon: '🌪️', description: 'Howling North Pole blizzard gale with spinning ice shards.', rarity: 'mythic' },
  { id: 'aura_jingle_bells', name: 'Sleigh Bells Symphony & Starburst', slot: 'aura', priceCoins: 350, brand: 'Universal', icon: '🔔', description: 'Bouncing golden sleigh bells with floating musical notes and starlight.', rarity: 'epic' },
  { id: 'aura_aurora_borealis', name: 'Aurora Borealis Polar Lights', slot: 'aura', priceCoins: 480, brand: 'Universal', icon: '🌌', description: 'Mesmerizing emerald and violet curtains of dancing northern lights.', rarity: 'mythic' },
  { id: 'aura_golden_tinsel', name: 'Golden Tinsel & Starlight Twinkles', slot: 'aura', priceCoins: 360, brand: 'Universal', icon: '✨', description: 'Cascading golden ribbon streamers with floating miniature holiday stars.', rarity: 'legendary' },
  { id: 'aura_tarragower_runes', name: 'Tarragower Geometrical Star Chart', slot: 'aura', priceCoins: 330, brand: 'Tarragower', icon: '📐', description: 'Rotating celestial navigation compass rings and mathematical equations.', rarity: 'rare' },
  { id: 'aura_bp_photon_wave', name: 'BP Solar Photon Pulse', slot: 'aura', priceCoins: 320, brand: 'BP', icon: '⚡', description: 'Emerald green electromagnetic pulses charging allied player gadgets.', rarity: 'rare' },

  // EMBLEMS / BRAND BADGES
  { id: 'emblem_none', name: 'No Emblem', slot: 'emblem', priceCoins: 0, brand: 'Universal', icon: '⚪', description: 'Standard appearance.', rarity: 'common' },
  { id: 'emblem_mc', name: 'Diamond Pickaxe Insignia', slot: 'emblem', priceCoins: 100, brand: 'Minecraft', icon: '⛏️', description: 'Emblem of the underground miners guild.', rarity: 'rare' },
  { id: 'emblem_roblox', name: 'Blox Red Chevron', slot: 'emblem', priceCoins: 100, brand: 'Roblox', icon: '🟥', description: 'Classic tilted red blox cube insignia.', rarity: 'rare' },
  { id: 'emblem_countryball', name: 'United Nations Accord', slot: 'emblem', priceCoins: 120, brand: 'Countryballs', icon: '🌐', description: 'Laurel wreath framing a world globe.', rarity: 'rare' },
  { id: 'emblem_xilam', name: 'Golden Slapstick Swatter', slot: 'emblem', priceCoins: 150, brand: 'Xilam', icon: '🪰', description: 'Legendary comedy flyswatter of Oggy & Jack.', rarity: 'rare' },
  { id: 'emblem_nz', name: 'NZ Silver Fern & Southern Cross', slot: 'emblem', priceCoins: 140, brand: 'NZ', icon: '🌿', description: 'Official Aotearoa silver fern badge with Southern Cross stars.', rarity: 'rare' },
  { id: 'emblem_mcdonalds', name: 'Golden Arches Seal', slot: 'emblem', priceCoins: 150, brand: 'McDonald\'s', icon: '🍟', description: 'Famous golden curved M crest.', rarity: 'rare' },
  { id: 'emblem_bp', name: 'Helios Eco-Energy Star', slot: 'emblem', priceCoins: 150, brand: 'BP', icon: '🌻', description: 'Green and yellow solar floral rosette.', rarity: 'rare' },
  { id: 'emblem_youtube', name: 'Diamond Play Button', slot: 'emblem', priceCoins: 350, brand: 'YouTube', icon: '💎', description: 'Prismatic crystal triangle creator crest.', rarity: 'legendary' },
  { id: 'emblem_tarragower', name: 'Tarragower Honor Crest', slot: 'emblem', priceCoins: 130, brand: 'Tarragower', icon: '🏛️', description: 'Academic crest of wisdom, craft, and honor.', rarity: 'rare' },
  { id: 'emblem_newworld', name: 'Aeternum Pioneer Compass', slot: 'emblem', priceCoins: 140, brand: 'New World', icon: '🧭', description: 'Navigational compass rose for uncharted realms.', rarity: 'rare' },
  { id: 'emblem_snowflake', name: 'Crystalline Ice Snowflake', slot: 'emblem', priceCoins: 110, brand: 'Universal', icon: '❄️', description: 'Flawless hexagonal winter frost emblem.', rarity: 'rare' },
  { id: 'emblem_candy_cane', name: 'Peppermint Candy Cane', slot: 'emblem', priceCoins: 90, brand: 'Universal', icon: '🦯', description: 'Striped red and white sweet peppermint treat.', rarity: 'common' },
  { id: 'emblem_christmas_star', name: 'Bethlehem Golden Star', slot: 'emblem', priceCoins: 150, brand: 'Universal', icon: '⭐', description: 'Radiant eight-pointed golden star shining with hope.', rarity: 'rare' },
  { id: 'emblem_gingerbread_man', name: 'Gingerbread Baker Crest', slot: 'emblem', priceCoins: 100, brand: 'Universal', icon: '🍪', description: 'Smiling iced holiday cookie baker crest.', rarity: 'common' },
  { id: 'emblem_gift_box', name: 'Mystery Gift Box with Ribbon', slot: 'emblem', priceCoins: 120, brand: 'Universal', icon: '🎁', description: 'Festive wrapped present box tied with satin bow.', rarity: 'rare' },
  { id: 'emblem_tarragower_shield', name: 'Tarragower Falcon Shield', slot: 'emblem', priceCoins: 130, brand: 'Tarragower', icon: '🦅', description: 'Emblem of the soaring falcon representing academic vigilance.', rarity: 'rare' },
  { id: 'emblem_bp_sunburst', name: 'BP Eco-Sunburst Crest', slot: 'emblem', priceCoins: 140, brand: 'BP', icon: '🌻', description: 'Vibrant yellow and green sunflower rosette symbol of renewable energy.', rarity: 'rare' },
  { id: 'emblem_polar_star', name: 'North Pole Star of Bethlehem', slot: 'emblem', priceCoins: 160, brand: 'Universal', icon: '⭐', description: 'Brilliant eight-pointed celestial star guiding winter navigators.', rarity: 'epic' },
  { id: 'emblem_xilam_paw', name: 'Slapstick Paw Print', slot: 'emblem', priceCoins: 100, brand: 'Xilam', icon: '🐾', description: 'Mischievous blue cat paw imprint.', rarity: 'common' },
  { id: 'emblem_yt_gold', name: 'YouTube Golden Button Crest', slot: 'emblem', priceCoins: 250, brand: 'YouTube', icon: '▶️', description: 'Polished 24-karat gold video play triangle.', rarity: 'epic' },
  { id: 'emblem_mc_nether_star', name: 'Minecraft Nether Star', slot: 'emblem', priceCoins: 300, brand: 'Minecraft', icon: '❇️', description: 'Pulsing beacon core forged from triumphant wither boss victories.', rarity: 'legendary' },

  // EXPANDED BRAND ACCESSORIES & COSMETICS
  { id: 'hat_sculk_horns', name: 'Warden Sculk Echo Horns', slot: 'hat', priceCoins: 290, brand: 'Minecraft', icon: '👾', description: 'Vibrating bio-luminescent sensor antennae that detect vibrations in the deep dark.', rarity: 'legendary' },
  { id: 'hat_breeze_swirl', name: 'Trial Chamber Breeze Whirler', slot: 'hat', priceCoins: 230, brand: 'Minecraft', icon: '💨', description: 'Swirling vortex crown shooting bursts of pressurized wind charges.', rarity: 'epic' },
  { id: 'hat_korblox_death_crown', name: 'Korblox Deathspeaker Diadem', slot: 'hat', priceCoins: 580, brand: 'Roblox', icon: '💀', description: 'Ancient dark ice bone crown worn by the supreme ruler of the Korblox empire.', rarity: 'mythic' },
  { id: 'hat_redcliff_helm', name: 'Redcliff Great Knight Visor', slot: 'hat', priceCoins: 260, brand: 'Roblox', icon: '🪖', description: 'Burnished red steel great helm with golden visor slits and lion crest.', rarity: 'epic' },
  { id: 'hat_valkyrie_helm', name: 'Bloxian Valkyrie Helm', slot: 'hat', priceCoins: 520, brand: 'Roblox', icon: '🪽', description: 'Legendary winged helmet of celestial speed and glory.', rarity: 'mythic' },
  { id: 'hat_cockroach_antenna', name: 'Slapstick Wiggle Antennas', slot: 'hat', priceCoins: 140, brand: 'Xilam', icon: '🪳', description: 'Springy rubber antennas that bounce with every comedic jump.', rarity: 'rare' },
  { id: 'hat_haka_feather', name: 'Huia Rangatira Feather Headdress', slot: 'hat', priceCoins: 240, brand: 'NZ', icon: '🪶', description: 'Sacred white-tipped black Huia tail feather honoring chieftain courage.', rarity: 'epic' },
  { id: 'hat_golden_visor', name: 'McDonald\'s Retro Drive-Thru Visor', slot: 'hat', priceCoins: 120, brand: 'McDonald\'s', icon: '🧢', description: 'Vintage red and yellow sun visor with headset mic attachment.', rarity: 'common' },
  { id: 'hat_helios_safety_cap', name: 'BP Helios High-Voltage Grid Cap', slot: 'hat', priceCoins: 160, brand: 'BP', icon: '⚡', description: 'Shock-resistant carbon fiber helmet with integrated solar headlamp.', rarity: 'rare' },
  { id: 'hat_yt_creator_beanie', name: '100M Diamond Creator Beanie', slot: 'hat', priceCoins: 310, brand: 'YouTube', icon: '💎', description: 'Knit streetwear beanie stitched with authentic diamond play button thread.', rarity: 'legendary' },
  { id: 'hat_aeternum_conqueror_coif', name: 'Aeternum Azoth War Coif', slot: 'hat', priceCoins: 330, brand: 'New World', icon: '👑', description: 'Engraved steel coif infused with eternal Azoth embers.', rarity: 'epic' },

  { id: 'face_allay_glow_eyes', name: 'Allay Spectral Cyan Gaze', slot: 'face', priceCoins: 210, brand: 'Minecraft', icon: '👁️', description: 'Luminous cyan eyes that pulse in sync with musical note blocks.', rarity: 'rare' },
  { id: 'face_overseer_optic', name: 'Roblox Overseer Void Ocular', slot: 'face', priceCoins: 350, brand: 'Roblox', icon: '👁️‍🗨️', description: 'Glowing emerald cybernetic eye piece from the mysterious Overseer clan.', rarity: 'epic' },
  { id: 'face_slapstick_grin', name: 'Oggy Comedy Elastic Grin', slot: 'face', priceCoins: 120, brand: 'Xilam', icon: '😸', description: 'Super-stretchy cartoon grin with twitching whiskers and red button nose.', rarity: 'common' },
  { id: 'face_mcd_fry_shades', name: 'McDonald\'s Golden Fry Aviators', slot: 'face', priceCoins: 150, brand: 'McDonald\'s', icon: '😎', description: 'Golden wire sunglasses with miniature fry box decals on the temples.', rarity: 'rare' },
  { id: 'face_bp_smart_hud', name: 'BP Solar Photon Telemetry HUD', slot: 'face', priceCoins: 190, brand: 'BP', icon: '🕶️', description: 'Lightweight holographic monocle HUD tracking environmental solar radiation.', rarity: 'rare' },
  { id: 'face_streamer_led_glasses', name: 'YouTube Sound-Reactive LED Shades', slot: 'face', priceCoins: 260, brand: 'YouTube', icon: '🕶️', description: 'Programmable equalizer shades that flash with incoming voice chat.', rarity: 'epic' },
  { id: 'face_azoth_veins', name: 'Aeternum Azoth Runic Veins', slot: 'face', priceCoins: 280, brand: 'New World', icon: '💠', description: 'Glowing cyan runic patterns etched across cheekbones by ancient power.', rarity: 'epic' },

  { id: 'back_sculk_catalyst', name: 'Sculk Catalyst Soul Urn', slot: 'back', priceCoins: 320, brand: 'Minecraft', icon: '🏺', description: 'Sealed reliquary radiating eerie soul bubbles and dark tendrils.', rarity: 'epic' },
  { id: 'back_illumina_sword', name: 'Illumina Prismatic Linked Sword', slot: 'back', priceCoins: 480, brand: 'Roblox', icon: '🗡️', description: 'Radiant blade sheathed across shoulders humming with classic SFOTH chime energy.', rarity: 'legendary' },
  { id: 'back_subspace_tripmine', name: 'Subspace Tripmine Rig', slot: 'back', priceCoins: 360, brand: 'Roblox', icon: '💣', description: 'High-tech pink magnetic explosive mine mounted to tactical spine harness.', rarity: 'epic' },
  { id: 'back_cream_pie_cannon', name: 'Slapstick Triple Cream Pie Cannon', slot: 'back', priceCoins: 240, brand: 'Xilam', icon: '🥧', description: 'Comedy motorized pie launcher loaded with fresh whipped meringue.', rarity: 'rare' },
  { id: 'back_golden_spatula', name: 'McDonald\'s Master Fryer Spatula', slot: 'back', priceCoins: 210, brand: 'McDonald\'s', icon: '🍳', description: '24-karat gold chef spatula capable of flipping 100 burgers in a flash.', rarity: 'rare' },
  { id: 'back_bp_bio_canister', name: 'BP Twin Bio-Fuel Jet Canisters', slot: 'back', priceCoins: 290, brand: 'BP', icon: '⛽', description: 'High-pressure clean bio-fuel canisters with emerald vapor vents.', rarity: 'rare' },
  { id: 'back_yt_streaming_rig', name: 'YouTube 8K Broadcast Satellite Rig', slot: 'back', priceCoins: 410, brand: 'YouTube', icon: '📡', description: 'Miniature satellite dish and dual boom cameras broadcasting direct to 10M subs.', rarity: 'legendary' },
  { id: 'back_aeternum_life_staff', name: 'Aeternum Celestial Life Staff', slot: 'back', priceCoins: 390, brand: 'New World', icon: '🪄', description: 'Golden carved staff with floating amber crystal granting constant rejuvenation.', rarity: 'legendary' },

  { id: 'aura_warden_vibration', name: 'Sculk Sonar Wave Ripple', slot: 'aura', priceCoins: 480, brand: 'Minecraft', icon: '🌊', description: 'Expanding ripples of cyan sonar waves reacting to footsteps and sprinting.', rarity: 'legendary' },
  { id: 'aura_hyper_spark', name: 'Bloxian Sparkle Shockwave', slot: 'aura', priceCoins: 360, brand: 'Roblox', icon: '💥', description: 'Classic 2008 rainbow particle sparkles bursting continuously on jump.', rarity: 'epic' },
  { id: 'aura_slapstick_stars', name: 'Slapstick Comic Dizzy Stars', slot: 'aura', priceCoins: 280, brand: 'Xilam', icon: '⭐', description: 'Circling comic yellow stars and cartoon question marks hovering overhead.', rarity: 'rare' },
  { id: 'aura_golden_arches_glow', name: 'Golden Arches Radiant Sizzle', slot: 'aura', priceCoins: 390, brand: 'McDonald\'s', icon: '🍟', description: 'Warm comforting golden sunlight radiating sweet aromas of golden fries.', rarity: 'rare' },
  { id: 'aura_bp_clean_grid', name: 'BP Photovoltaic Solar Surge', slot: 'aura', priceCoins: 370, brand: 'BP', icon: '🔋', description: 'Green and amber matrix lines charging all nearby electronic gear.', rarity: 'rare' },
  { id: 'aura_yt_superchat_rain', name: 'YouTube Superchat Coin Rain', slot: 'aura', priceCoins: 490, brand: 'YouTube', icon: '🪙', description: 'Cascading golden coins, heart badges, and streamer superchats.', rarity: 'legendary' },
  { id: 'aura_azoth_consecration', name: 'Aeternum Azoth Consecration', slot: 'aura', priceCoins: 520, brand: 'New World', icon: '✨', description: 'Radiant azure circle of ancient power elevating party defense and morale.', rarity: 'mythic' },

  { id: 'emblem_breeze_charge', name: 'Breeze Wind Charge Insignia', slot: 'emblem', priceCoins: 160, brand: 'Minecraft', icon: '🌪️', description: 'Emblem of the agile trial chamber wind elemental.', rarity: 'rare' },
  { id: 'emblem_korblox_skull', name: 'Korblox Frost Skull', slot: 'emblem', priceCoins: 210, brand: 'Roblox', icon: '💀', description: 'Deep glacial skull crest of the Korblox Deathspeaker.', rarity: 'epic' },
  { id: 'emblem_slapstick_bomb', name: 'Slapstick Round Cartoon Bomb', slot: 'emblem', priceCoins: 120, brand: 'Xilam', icon: '💣', description: 'Classic black cannonball bomb with a fizzing orange wick.', rarity: 'common' },
  { id: 'emblem_mcd_fry_box', name: 'Golden Arches Red Fry Box', slot: 'emblem', priceCoins: 140, brand: 'McDonald\'s', icon: '🍟', description: 'World-renowned crimson fry container filled with golden fries.', rarity: 'rare' },
  { id: 'emblem_bp_wind_turbine', name: 'BP Clean Wind Turbine Crest', slot: 'emblem', priceCoins: 150, brand: 'BP', icon: '🌀', description: 'Tri-blade eco turbine generating renewable kinetic energy.', rarity: 'rare' },
  { id: 'emblem_yt_live_badge', name: 'YouTube Broadcast LIVE Badge', slot: 'emblem', priceCoins: 260, brand: 'YouTube', icon: '🔴', description: 'Pulsing crimson LIVE emblem signaling an active livestream broadcast.', rarity: 'epic' },
  { id: 'emblem_aeternum_covenant', name: 'Aeternum Sacred Spark', slot: 'emblem', priceCoins: 220, brand: 'New World', icon: '🔥', description: 'Golden flame symbol representing the unyielding righteous Crusade.', rarity: 'epic' },

  // NEW THEMATIC BRAND ACCESSORIES & COSMETICS
  { id: 'hat_mcd_golden_visor', name: 'McDonald\'s Golden Arches Retro Visor', slot: 'hat', priceCoins: 160, brand: 'McDonald\'s', icon: '🧢', description: 'Classic red and golden visor worn by drive-thru legends.', rarity: 'rare' },
  { id: 'hat_bp_solar_goggles', name: 'BP Clean Solar Field Safety Goggles', slot: 'hat', priceCoins: 175, brand: 'BP', icon: '🥽', description: 'UV-blocking photo-reactive eyewear with green and yellow accents.', rarity: 'rare' },
  { id: 'hat_tarragower_mortarboard', name: 'Tarragower Valedictorian Mortarboard', slot: 'hat', priceCoins: 230, brand: 'Tarragower', icon: '🎓', description: 'Formal academic cap featuring gold embroidery and sapphire tassel.', rarity: 'epic' },
  { id: 'hat_xilam_sharko_cap', name: 'Sharko Slapstick Shark Fin Cap', slot: 'hat', priceCoins: 190, brand: 'Xilam', icon: '🦈', description: 'Fun foam shark dorsal fin hat that wiggles whenever you sprint.', rarity: 'rare' },
  { id: 'face_mcd_grimace_grin', name: 'Grimace Jovial Purple Smile', slot: 'face', priceCoins: 140, brand: 'McDonald\'s', icon: '🟣', description: 'Wide lovable smile radiating purple cosmic shake cheer.', rarity: 'common' },
  { id: 'back_bp_solar_wings', name: 'BP Photovoltaic Glider Wings', slot: 'back', priceCoins: 420, brand: 'BP', icon: '🪽', description: 'Dual folding solar panel wings that catch sun rays and extend air-hover time.', rarity: 'legendary' },
  { id: 'back_tarragower_scrollcase', name: 'Tarragower Master Library Scroll Case', slot: 'back', priceCoins: 260, brand: 'Tarragower', icon: '📜', description: 'Polished mahogany cylinder holding secret redstone logic diagrams.', rarity: 'rare' },
  { id: 'aura_tarragower_scholar_halo', name: 'Tarragower Logic Clockwork Rings', slot: 'aura', priceCoins: 410, brand: 'Tarragower', icon: '⚙️', description: 'Concentric golden gears and clockwork numerals rotating around your feet.', rarity: 'epic' },
];

export interface BodyTypeItem {
  id: string;
  name: string;
  brand: string;
  icon: string;
  description: string;
}

export const BODY_TYPES: BodyTypeItem[] = [
  { id: 'blocky_steve', name: 'Classic Blocky (Steve)', brand: 'Minecraft', icon: '🧱', description: 'Iconic 4x4 pixel-grid cubic anatomy with angular shoulders.' },
  { id: 'slim_alex', name: 'Wilderness Slim (Alex)', brand: 'Minecraft', icon: '🏹', description: 'Agile 3-pixel slender arms and streamlined silhouette.' },
  { id: 'roblox_r6', name: 'Chunky R6 Torso', brand: 'Roblox', icon: '🟥', description: 'Classic 2006 Roblox bevelled torso with cylindrical head.' },
  { id: 'countryball_sphere', name: 'Sovereign Sphere', brand: 'Countryballs', icon: '🌐', description: 'Pure geometric spherical flag-bearing ball form.' },
  { id: 'xilam_slapstick', name: 'Cartoon Slapstick Cat', brand: 'Xilam', icon: '🐱', description: 'Flexible rubbery cartoon physique with wide paws.' },
  { id: 'brawler_buff', name: 'Heavy Iron Golem', brand: 'Minecraft', icon: '🦾', description: 'Heavyweight reinforced broad-shouldered titan build.' },
  { id: 'nz_allblack', name: 'Kiwi Athlete & Wayfinder', brand: 'NZ', icon: '🏉', description: 'Strong, agile athletic build with traditional Polynesian poise.' },
];

export interface HairStyleItem {
  id: string;
  name: string;
  icon: string;
  priceCoins: number;
  description: string;
}

export const HAIRSTYLES_CATALOG: HairStyleItem[] = [
  { id: 'hair_none', name: 'Classic / Clean', icon: '👤', priceCoins: 0, description: 'Default trimmed appearance.' },
  { id: 'hair_bacon', name: 'Pal Bacon Hair', icon: '🥓', priceCoins: 0, description: 'Iconic glossy swept layered brown fringe.' },
  { id: 'hair_spiky', name: 'Anime Spiky Locks', icon: '⚡', priceCoins: 120, description: 'Sharp wind-swept anime protagonist spikes.' },
  { id: 'hair_curly', name: 'Volume Curly Afro', icon: '🌀', priceCoins: 140, description: 'Full sculpted curls with clean taper.' },
  { id: 'hair_ponytail', name: 'Shinobi Ponytail', icon: '🥷', priceCoins: 150, description: 'High bound ponytail with silk tie.' },
  { id: 'hair_wizard', name: 'Elder Sage Flow', icon: '🧙‍♂️', priceCoins: 180, description: 'Long flowing silver locks and wise beard.' },
  { id: 'hair_emo', name: 'Scene Swept Fringe', icon: '🎸', priceCoins: 130, description: 'Asymmetrical dark angled bangs covering one eye.' },
  { id: 'hair_celestial', name: 'Verity Starlight Waves', icon: '✨', priceCoins: 250, description: 'Ethereal floating hair infused with starlight.' },
];

export interface ClothingItem {
  id: string;
  name: string;
  slot: 'shirt' | 'pants';
  brand: string;
  icon: string;
  priceCoins: number;
  description: string;
}

export const CLOTHING_CATALOG: ClothingItem[] = [
  // SHIRTS / TOPS
  { id: 'shirt_default', name: 'Classic Miner Tee', slot: 'shirt', brand: 'Minecraft', icon: '👕', priceCoins: 0, description: 'Iconic cyan cotton crewneck.' },
  { id: 'shirt_diamond_armor', name: 'Diamond Chestplate', slot: 'shirt', brand: 'Minecraft', icon: '🛡️', priceCoins: 220, description: 'Reinforced diamond alloy plating with enchanted sheen.' },
  { id: 'shirt_denim', name: 'Denim Biker Jacket', slot: 'shirt', brand: 'Roblox', icon: '🧥', priceCoins: 0, description: 'Sturdy blue denim jacket over white tee.' },
  { id: 'shirt_nz_jersey', name: 'All Blacks #7 Rugby Jersey', slot: 'shirt', brand: 'NZ', icon: '🏉', priceCoins: 180, description: 'Iconic all-black championship rugby jersey with white collar and Silver Fern.' },
  { id: 'shirt_mcdonalds', name: 'Golden Crew Polo', slot: 'shirt', brand: 'McDonald\'s', icon: '🍔', priceCoins: 150, description: 'Official red and gold gourmet chef uniform.' },
  { id: 'shirt_bp_suit', name: 'BP Solar Racing Suit', slot: 'shirt', brand: 'BP', icon: '⚡', priceCoins: 160, description: 'High-visibility aerodynamic green/yellow jumpsuit.' },
  { id: 'shirt_tarragower_blazer', name: 'Tarragower Academy Blazer', slot: 'shirt', brand: 'Tarragower', icon: '🧥', priceCoins: 160, description: 'Crisp navy blazer with gold piping and school badge.' },
  { id: 'shirt_youtube_creator', name: 'YouTube Creator Studio Hoodie', slot: 'shirt', brand: 'YouTube', icon: '▶️', priceCoins: 150, description: 'Matte black hoodie with red drawstring accents and subscriber badge.' },
  { id: 'shirt_newworld_armor', name: 'Aeternum Syndicate Cuirass', slot: 'shirt', brand: 'New World', icon: '🛡️', priceCoins: 210, description: 'Ornate leather and steel breastplate worn by frontier captains.' },
  { id: 'shirt_tuxedo', name: 'Royal Velvet Tuxedo', slot: 'shirt', brand: 'Countryballs', icon: '🤵', priceCoins: 200, description: 'Diplomatic gala evening tailcoat with crimson rose.' },
  { id: 'shirt_hoodie', name: 'Cyberpunk Zip Hoodie', slot: 'shirt', brand: 'Roblox', icon: '🥷', priceCoins: 140, description: 'Dark streetwear hoodie with neon cyan drawstrings.' },
  { id: 'shirt_retro_roblox', name: '2008 Vintage Blox Tee', slot: 'shirt', brand: 'Roblox', icon: '🟥', priceCoins: 90, description: 'Nostalgic retro Roblox logo screenprint.' },
  { id: 'shirt_santa_suit', name: 'Santa Claus Velvet Coat', slot: 'shirt', brand: 'Universal', icon: '🎅', priceCoins: 160, description: 'Plush red coat with white fur lapels and wide black leather belt.' },
  { id: 'shirt_holiday_sweater', name: 'Festive Reindeer Knit Sweater', slot: 'shirt', brand: 'Universal', icon: '🦌', priceCoins: 140, description: 'Cozy knitted holiday jumper with leaping reindeer and geometric snowflakes.' },
  { id: 'shirt_elf_tunic', name: 'North Pole Elf Tunic', slot: 'shirt', brand: 'Universal', icon: '🧝', priceCoins: 130, description: 'Emerald elf tunic with jagged jingle-bell trim and candy-cane buttons.' },
  { id: 'shirt_polar_parka', name: 'Expedition Polar Parka', slot: 'shirt', brand: 'Universal', icon: '🧥', priceCoins: 170, description: 'Down-insulated arctic explorer coat with faux-fur hood and storm flap.' },
  { id: 'shirt_nutcracker_jacket', name: 'Royal Nutcracker Velvet Jacket', slot: 'shirt', brand: 'Universal', icon: '💂', priceCoins: 190, description: 'Ceremonial crimson tunic adorned with golden epaulets and brass buttons.' },
  { id: 'shirt_gingerbread_frosting', name: 'Gingerbread Cookie Tunic', slot: 'shirt', brand: 'Universal', icon: '🍪', priceCoins: 130, description: 'Warm gingerbread cookie tunic decorated with scalloped royal icing piping.' },
  { id: 'shirt_tarragower_winter_cape', name: 'Tarragower Winter Academy Cloak', slot: 'shirt', brand: 'Tarragower', icon: '🧥', priceCoins: 160, description: 'Heavy wool winter uniform cloak lined with royal blue satin.' },
  { id: 'shirt_bp_arctic_hazmat', name: 'BP Clean Energy Arctic Suit', slot: 'shirt', brand: 'BP', icon: '⚡', priceCoins: 160, description: 'Heated bio-solar technician parka built for sub-zero energy stations.' },
  { id: 'shirt_mcdonalds_holiday', name: 'McDonald\'s Holiday Crew Sweater', slot: 'shirt', brand: 'McDonald\'s', icon: '🍔', priceCoins: 140, description: 'Knit holiday crewneck featuring golden arches and dancing french fry reindeer.' },
  { id: 'shirt_newworld_gleamite', name: 'Aeternum Gleamite Winter Armor', slot: 'shirt', brand: 'New World', icon: '🛡️', priceCoins: 220, description: 'Plate cuirass encrusted with glowing celestial Gleamite frost shards.' },
  { id: 'shirt_xilam_cartoon_vest', name: 'Oggy Polka-Dot Slapstick Vest', slot: 'shirt', brand: 'Xilam', icon: '🦺', priceCoins: 130, description: 'Classic red polka-dot clown vest with rubber flower that squirts water.' },

  // PANTS / BOTTOMS
  { id: 'pants_default', name: 'Classic Blue Jeans', slot: 'pants', brand: 'Minecraft', icon: '👖', priceCoins: 0, description: 'Sturdy indigo canvas denim.' },
  { id: 'pants_nz_rugby', name: 'Kiwi Black Match Shorts', slot: 'pants', brand: 'NZ', icon: '🩳', priceCoins: 90, description: 'Rugged performance black shorts with silver fern hem stitching.' },
  { id: 'pants_tarragower_slacks', name: 'Tarragower Uniform Trousers', slot: 'pants', brand: 'Tarragower', icon: '👖', priceCoins: 90, description: 'Tailored charcoal school uniform trousers.' },
  { id: 'pants_mcdonalds_crew', name: 'McDonald\'s Crew Slacks', slot: 'pants', brand: 'McDonald\'s', icon: '👖', priceCoins: 80, description: 'Comfortable bistro black service slacks with belt.' },
  { id: 'pants_bp_tech', name: 'BP Solar Engineer Cargos', slot: 'pants', brand: 'BP', icon: '👖', priceCoins: 100, description: 'Reinforced work pants with reflective safety strips.' },
  { id: 'pants_combat', name: 'Tactical Combat Khakis', slot: 'pants', brand: 'New World', icon: '🪖', priceCoins: 110, description: 'Multi-pocket explorer cargo trousers.' },
  { id: 'pants_greaves', name: 'Diamond Greaves', slot: 'pants', brand: 'Minecraft', icon: '🛡️', priceCoins: 200, description: 'Solid diamond shin guards and knee guards.' },
  { id: 'pants_track', name: 'Bloxy Stripe Trackpants', slot: 'pants', brand: 'Roblox', icon: '👟', priceCoins: 90, description: 'Athletic jogger sweatpants with side racing stripes.' },
  { id: 'pants_trunks', name: 'Sharko Lifeguard Trunks', slot: 'pants', brand: 'Xilam', icon: '🩳', priceCoins: 130, description: 'Bright red quick-dry Hawaiian swim shorts.' },
  { id: 'pants_santa', name: 'Santa Red Velvet Trousers & Boots', slot: 'pants', brand: 'Universal', icon: '🎅', priceCoins: 130, description: 'Crimson velvet trousers tucked into polished black winter boots.' },
  { id: 'pants_elf', name: 'Peppermint Striped Elf Leggings', slot: 'pants', brand: 'Universal', icon: '🧝', priceCoins: 100, description: 'Fun red and white candy-cane striped leggings with curved elf shoes.' },
  { id: 'pants_snow_camo', name: 'Arctic Snow Expedition Pants', slot: 'pants', brand: 'Universal', icon: '❄️', priceCoins: 110, description: 'Insulated white-and-gray camouflage thermal snow pants.' },
  { id: 'pants_nutcracker_slacks', name: 'Nutcracker Gold-Braid Slacks', slot: 'pants', brand: 'Universal', icon: '👖', priceCoins: 120, description: 'Midnight navy dress trousers featuring golden parade piping.' },
  { id: 'pants_polar_ski', name: 'Insulated Polar Ski Pants', slot: 'pants', brand: 'Universal', icon: '❄️', priceCoins: 110, description: 'Waterproof white-and-cyan ski trousers with reinforced knee pads.' },
  { id: 'pants_gingerbread_boots', name: 'Gingerbread Cookie Sugar Slacks', slot: 'pants', brand: 'Universal', icon: '🍪', priceCoins: 90, description: 'Cookie dough pants with icing trim and gumdrop ankle buttons.' },
  { id: 'pants_tarragower_winter', name: 'Tarragower Tailored Charcoal Slacks', slot: 'pants', brand: 'Tarragower', icon: '👖', priceCoins: 90, description: 'Pleated wool dress trousers worn during academy winter convocations.' },
  { id: 'pants_bp_arctic', name: 'BP Arctic Solar Cargos', slot: 'pants', brand: 'BP', icon: '👖', priceCoins: 100, description: 'Thermal-reflective utility trousers with tool pouches and solar batteries.' },
  { id: 'pants_newworld_greaves', name: 'Aeternum Azoth Plate Greaves', slot: 'pants', brand: 'New World', icon: '🛡️', priceCoins: 180, description: 'Heavy steel greaves with cyan Azoth runes inscribed along the shins.' },
];

export const COLOR_PRESETS = {
  skin: ['#f5d0a9', '#facc15', '#d49b6a', '#8d5524', '#3b2219', '#38bdf8', '#4ade80', '#c084fc', '#f43f5e'],
  hair: ['#451a03', '#1c1917', '#eab308', '#ea580c', '#38bdf8', '#ec4899', '#a855f7', '#f8fafc', '#22c55e'],
  clothes: ['#0055ff', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#18181b', '#f8fafc', '#ec4899'],
  mcdonalds: ['#da291c', '#ffc72c', '#27251f', '#ffffff', '#6a2875', '#c8102e'],
  bp: ['#007a33', '#009a44', '#ffd100', '#ffffff', '#222222', '#70c542'],
};

export interface PlayerCustomizationData {
  baseCharacterId: number;
  baseType: 'minecraft' | 'countryball' | 'roblox' | 'xilam' | 'sprnuki' | 'train';
  bodyType: string;
  selectedHair: string;
  selectedShirt: string;
  selectedPants: string;
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  customTextureUrl?: string;
  customName: string;
  customTitle: string;
  customClass: string;
  selectedFaction: string;
  selectedHat: string;
  selectedFace: string;
  selectedWings: string;
  selectedAura: string;
  selectedEmblem: string;
  selectedEmote: string;
  quickEmotes: string[];
  unlockedCosmetics: string[];
  coins: number;
  robux: number;
  reputation: number;
  tradesCompleted: number;
  lastUpdated: number;
}

export interface OriginEmote {
  id: string;
  name: string;
  origin: 'Sprunki' | 'Thomas & Friends' | 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World' | 'Universal';
  icon: string;
  description: string;
  animationKey: 'bop' | 'spin' | 'whistle' | 'jump' | 'dance' | 'roll' | 'smash' | 'horror';
  soundType: string;
  durationMs: number;
}

export const ORIGIN_EMOTES_CATALOG: OriginEmote[] = [
  // SPRUNKI
  {
    id: 'emote_sprunki_beatbox',
    name: 'Incredibox Beatbox Bop',
    origin: 'Sprunki',
    icon: '🥁',
    description: 'Dynamic rhythm head-bob with synchronized synthesized beatbox rhythm drop!',
    animationKey: 'bop',
    soundType: 'sprunki_beat',
    durationMs: 2400,
  },
  {
    id: 'emote_sprunki_horror',
    name: 'Horror Abyssal Phase Shift',
    origin: 'Sprunki',
    icon: '🌑',
    description: 'Black cosmic void entity transformation with deep horror chime resonance!',
    animationKey: 'horror',
    soundType: 'sprunki_horror',
    durationMs: 2600,
  },
  {
    id: 'emote_sprunki_verity_truth',
    name: 'Celestial Starlight Truth Pose',
    origin: 'Sprunki',
    icon: '✨',
    description: 'Oracle Verity floating levitation surrounded by crystalline star chimes!',
    animationKey: 'spin',
    soundType: 'verity_oracle',
    durationMs: 2800,
  },
  {
    id: 'emote_sprunki_box_pop',
    name: 'Jack-in-the-Box Spring Surprise',
    origin: 'Sprunki',
    icon: '📦',
    description: 'Turn the golden winding crank... then POP! into the sky with star fireworks!',
    animationKey: 'jump',
    soundType: 'verity_pop',
    durationMs: 2200,
  },

  // THOMAS & FRIENDS
  {
    id: 'emote_thomas_whistle',
    name: 'Sodor High-Pressure Steam Whistle',
    origin: 'Thomas & Friends',
    icon: '🚂',
    description: 'Two sharp, cheerful locomotive steam whistle blasts echoing down the line!',
    animationKey: 'whistle',
    soundType: 'train_whistle',
    durationMs: 2500,
  },
  {
    id: 'emote_thomas_steam_vent',
    name: 'Boiler Steam Exhaust Cloud',
    origin: 'Thomas & Friends',
    icon: '💨',
    description: 'Billow pure white steam plumes from the cylinder vents with a mighty hiss!',
    animationKey: 'bop',
    soundType: 'train_steam',
    durationMs: 2200,
  },
  {
    id: 'emote_thomas_chug',
    name: 'Rail Track Clickety-Clack',
    origin: 'Thomas & Friends',
    icon: '🛤️',
    description: 'Classic heavy steel wheel rhythmic cadence over railway sleepers!',
    animationKey: 'roll',
    soundType: 'train_chug',
    durationMs: 3000,
  },
  {
    id: 'emote_thomas_tophat',
    name: 'Sir Topham Hatt Royal Bow',
    origin: 'Thomas & Friends',
    icon: '🎩',
    description: 'Dignified Victorian formal greeting with pristine top hat flourish!',
    animationKey: 'whistle',
    soundType: 'fanfare',
    durationMs: 2000,
  },

  // MINECRAFT
  {
    id: 'emote_mc_mining_frenzy',
    name: 'Rapid Pickaxe Haste Strike',
    origin: 'Minecraft',
    icon: '⛏️',
    description: 'Lightning-fast pickaxe swings emitting stone mineral chips and sparks!',
    animationKey: 'smash',
    soundType: 'mc_mine',
    durationMs: 2000,
  },
  {
    id: 'emote_mc_shield_parry',
    name: 'Shield Parry & Deflection',
    origin: 'Minecraft',
    icon: '🛡️',
    description: 'Raise an iron-banded oak shield that deflects incoming hits with a metal clang!',
    animationKey: 'smash',
    soundType: 'mc_shield',
    durationMs: 1800,
  },
  {
    id: 'emote_mc_diamond_flex',
    name: 'Diamond Ingot Salute',
    origin: 'Minecraft',
    icon: '💎',
    description: 'Hold up a gleaming rare diamond high in the air with level-up chimes!',
    animationKey: 'jump',
    soundType: 'mc_level',
    durationMs: 2400,
  },
  {
    id: 'emote_mc_sneak_spam',
    name: 'Peaceful Sneak & Crouch Spam',
    origin: 'Minecraft',
    icon: '🏃',
    description: 'The universal multiplayer sign of friendship and peace across servers!',
    animationKey: 'bop',
    soundType: 'mc_step',
    durationMs: 1800,
  },

  // ROBLOX
  {
    id: 'emote_roblox_dance',
    name: 'Classic R6 /e dance',
    origin: 'Roblox',
    icon: '💃',
    description: 'The legendary 2006 blocky arm-swinging groove loved by millions!',
    animationKey: 'dance',
    soundType: 'roblox_cheezburger',
    durationMs: 3200,
  },
  {
    id: 'emote_roblox_wave',
    name: 'Robloxian /e wave',
    origin: 'Roblox',
    icon: '👋',
    description: 'A friendly yellow-handed greeting to all server players!',
    animationKey: 'whistle',
    soundType: 'click',
    durationMs: 1800,
  },
  {
    id: 'emote_roblox_oof',
    name: 'Classic OOF Ragdoll Tumble',
    origin: 'Roblox',
    icon: '💥',
    description: 'Comedic backward stumble with the iconic nostalgic 2006 OOF sound!',
    animationKey: 'jump',
    soundType: 'roblox_oof',
    durationMs: 2000,
  },
  {
    id: 'emote_roblox_coil_bounce',
    name: 'Gravity Coil High-Spring',
    origin: 'Roblox',
    icon: '🌀',
    description: 'Boing into the stratosphere with glowing cyan gravity coils!',
    animationKey: 'jump',
    soundType: 'roblox_coil',
    durationMs: 2500,
  },

  // COUNTRYBALLS
  {
    id: 'emote_cb_clay_roll',
    name: 'Sovereign Clay Roll & Bounce',
    origin: 'Countryballs',
    icon: '⚽',
    description: 'Squash-and-stretch spherical roll with authentic territorial flags!',
    animationKey: 'roll',
    soundType: 'country_march',
    durationMs: 2200,
  },
  {
    id: 'emote_cb_peace_treaty',
    name: 'Peace Accord Wax Stamp',
    origin: 'Countryballs',
    icon: '📜',
    description: 'Slam down an international non-aggression pact with red wax stamp!',
    animationKey: 'smash',
    soundType: 'fanfare',
    durationMs: 2000,
  },
  {
    id: 'emote_cb_monocle_toast',
    name: 'Gentleman Monocle Polish',
    origin: 'Countryballs',
    icon: '🧐',
    description: 'UK ball monocle shine with high-society teacup toast!',
    animationKey: 'whistle',
    soundType: 'chimes',
    durationMs: 2200,
  },

  // XILAM ANIMATION
  {
    id: 'emote_xilam_mallet',
    name: '10-Ton Squeaky Mallet Bonk',
    origin: 'Xilam',
    icon: '🔨',
    description: 'Swing a giant comedy wooden mallet that makes a loud squeak and spinning stars!',
    animationKey: 'smash',
    soundType: 'xilam_bonk',
    durationMs: 2200,
  },
  {
    id: 'emote_xilam_swatter',
    name: 'Cockroach Fly Swatter Flurry',
    origin: 'Xilam',
    icon: '🪰',
    description: 'Oggy frantically swatting Dee Dee and Joey with cartoon ricochet sound effects!',
    animationKey: 'bop',
    soundType: 'xilam_twang',
    durationMs: 2400,
  },
  {
    id: 'emote_xilam_eyeballs',
    name: 'Looney Eyes-Popping Shock',
    origin: 'Xilam',
    icon: '😱',
    description: 'Eyes spring 2 feet out of sockets with funny cartoon train whistle noise!',
    animationKey: 'whistle',
    soundType: 'xilam_scream',
    durationMs: 2000,
  },

  // NEW ZEALAND (NZ)
  {
    id: 'emote_nz_haka',
    name: 'Ka Mate Haka Stomp & Roar',
    origin: 'NZ',
    icon: '🌿',
    description: 'Fierce traditional Māori Haka posture, rhythmic chest taps, and powerful rallying war cry!',
    animationKey: 'smash',
    soundType: 'nz_haka',
    durationMs: 2800,
  },
  {
    id: 'emote_nz_kiwi_hop',
    name: 'Nocturnal Kiwi Double-Hop',
    origin: 'NZ',
    icon: '🥝',
    description: 'Playful low double-hop and forage peck mimicking New Zealand\'s national icon!',
    animationKey: 'jump',
    soundType: 'kiwi_chirp',
    durationMs: 2000,
  },

  // BP
  {
    id: 'emote_bp_solar_recharge',
    name: 'BP Solar Photon Charge',
    origin: 'BP',
    icon: '⚡',
    description: 'Absorb clean solar photons into an energy canister with an exhilarating electric burst!',
    animationKey: 'spin',
    soundType: 'solar_whir',
    durationMs: 2400,
  },

  // MCDONALD'S
  {
    id: 'emote_mcdonalds_fry_flip',
    name: 'Golden Fries Salt & Flip',
    origin: 'McDonald\'s',
    icon: '🍟',
    description: 'Gourmet wire basket flip tossing crispy golden fries with an acoustic sizzle!',
    animationKey: 'bop',
    soundType: 'fry_sizzle',
    durationMs: 2200,
  },

  // YOUTUBE
  {
    id: 'emote_yt_subscribe_bell',
    name: 'Smash That Subscribe Bell',
    origin: 'YouTube',
    icon: '🔔',
    description: 'Ring the golden notification bell with confetti, thumbs-up reaction emojis, and fanfare!',
    animationKey: 'jump',
    soundType: 'bell_chime',
    durationMs: 2500,
  },

  // TARRAGOWER SCHOOL
  {
    id: 'emote_tarragower_bell_ring',
    name: 'Tarragower Academy Bell Ring',
    origin: 'Tarragower',
    icon: '🏛️',
    description: 'Ring the historic heritage school bell signaling assembly and academic honor roll!',
    animationKey: 'whistle',
    soundType: 'school_bell',
    durationMs: 2400,
  },

  // NEW WORLD
  {
    id: 'emote_newworld_war_cry',
    name: 'Aeternum Faction War Cry',
    origin: 'New World',
    icon: '⚔️',
    description: 'Plant a faction territory war banner firmly into the ground with an echoing battle shout!',
    animationKey: 'smash',
    soundType: 'battle_cry',
    durationMs: 2600,
  },

  // HALLOWEEN SPOOKTACULAR EMOTES 🎃
  {
    id: 'emote_halloween_trick_or_treat',
    name: 'Trick-or-Treat Candy Shower',
    origin: 'Universal',
    icon: '🍬',
    description: 'Shake the candy bag and shower glittering candy corn and sweet treats all around!',
    animationKey: 'jump',
    soundType: 'mc_level',
    durationMs: 2200,
  },
  {
    id: 'emote_halloween_thriller',
    name: 'Spooky Monster Thriller Dance',
    origin: 'Universal',
    icon: '🧟',
    description: 'Classic creepy zombie groove with synchronized claws and rhythmic zombie steps!',
    animationKey: 'dance',
    soundType: 'sprunki_beat',
    durationMs: 3000,
  },
  {
    id: 'emote_halloween_ghost_boo',
    name: 'Ghostly "BOO!" Jumpscare',
    origin: 'Universal',
    icon: '👻',
    description: 'Lunge forward playfully with spooky ectoplasm ripples and a spectral laugh!',
    animationKey: 'smash',
    soundType: 'ghast_screech',
    durationMs: 1800,
  },
];

const STORAGE_KEY = 'megaworld_custom_avatar_save';

export const DEFAULT_CUSTOMIZATION: PlayerCustomizationData = {
  baseCharacterId: 21,
  baseType: 'minecraft',
  bodyType: 'blocky_steve',
  selectedHair: 'hair_none',
  selectedShirt: 'shirt_default',
  selectedPants: 'pants_default',
  skinColor: '#f5d0a9',
  hairColor: '#451a03',
  shirtColor: '#0055ff',
  pantsColor: '#1e3a8a',
  customName: 'Steve The Pioneer',
  customTitle: 'Master Builder',
  customClass: 'minecraft_miner',
  selectedFaction: 'faction_minecraft',
  selectedHat: 'none',
  selectedFace: 'none',
  selectedWings: 'none',
  selectedAura: 'none',
  selectedEmblem: 'none',
  selectedEmote: 'emote_mc_mining_frenzy',
  quickEmotes: ['emote_mc_mining_frenzy', 'emote_sprunki_beatbox', 'emote_roblox_dance', 'emote_thomas_whistle'],
  unlockedCosmetics: ['hat_crown', 'face_shades', 'back_elytra', 'aura_none', 'emblem_none'],
  coins: 850,
  robux: 250,
  reputation: 4.9,
  tradesCompleted: 14,
  lastUpdated: Date.now(),
};

export interface AvatarPreset {
  id: string;
  name: string;
  style: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'Brand';
  icon: string;
  description: string;
  createdAt: number;
  data: PlayerCustomizationData;
}

const PRESETS_STORAGE_KEY = 'megaworld_avatar_presets_v1';

export const DEFAULT_AVATAR_PRESETS: AvatarPreset[] = [
  {
    id: 'preset_christmas_santa_steve',
    name: 'Santa Claus Voxel Steve',
    style: 'Minecraft',
    icon: '🎅',
    description: 'Festive Christmas loadout with Santa Velvet Cap, Snowy Santa Beard, Heavy Toy Sack, and Winter Snowfall Aura.',
    createdAt: 1735084800000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      customName: 'Santa Steve',
      customTitle: 'Father Christmas of the Multiverse',
      selectedHat: 'hat_santa',
      selectedFace: 'face_santa_beard',
      selectedWings: 'back_santa_sack',
      selectedAura: 'aura_snowfall',
      selectedEmblem: 'emblem_snowflake',
      selectedShirt: 'shirt_santa_suit',
      selectedPants: 'pants_santa',
      skinColor: '#f5d0a9',
      shirtColor: '#dc2626',
      pantsColor: '#991b1b',
      unlockedCosmetics: [
        ...DEFAULT_CUSTOMIZATION.unlockedCosmetics,
        'hat_santa',
        'face_santa_beard',
        'back_santa_sack',
        'aura_snowfall',
        'emblem_snowflake',
        'hat_reindeer_antlers',
        'back_snow_globe'
      ],
    },
  },
  {
    id: 'preset_christmas_elf_noob',
    name: 'North Pole Toymaker Noob',
    style: 'Roblox',
    icon: '🧝',
    description: 'Holiday elf avatar with Workshop Elf Cap, Pointed Elf Ears, Elf Tunic, and Rainbow Holiday Lights Aura.',
    createdAt: 1735084801000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      baseCharacterId: 501,
      baseType: 'roblox',
      bodyType: 'roblox_r6',
      customName: 'Elf Bloxian',
      customTitle: 'Master Toy Engineer',
      selectedHat: 'hat_elf_hat',
      selectedFace: 'face_elf_ears',
      selectedWings: 'back_festive_wreath',
      selectedAura: 'aura_christmas_lights',
      selectedEmblem: 'emblem_candy_cane',
      selectedShirt: 'shirt_elf_tunic',
      selectedPants: 'pants_elf',
      skinColor: '#facc15',
      shirtColor: '#16a34a',
      pantsColor: '#dc2626',
      unlockedCosmetics: [
        ...DEFAULT_CUSTOMIZATION.unlockedCosmetics,
        'hat_elf_hat',
        'face_elf_ears',
        'back_festive_wreath',
        'aura_christmas_lights',
        'emblem_candy_cane',
      ],
    },
  },
  {
    id: 'preset_halloween_reaper',
    name: 'Halloween Soul Reaper Steve',
    style: 'Minecraft',
    icon: '🎃',
    description: 'Festive Halloween loadout with Carved Jack-o\'-Lantern Helm, Crossed Soul Scythes, and Spooky Ghost Aura.',
    createdAt: 1730332800000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      customName: 'Reaper Steve',
      customTitle: 'Spooky Soul Harvester',
      selectedHat: 'hat_pumpkin',
      selectedWings: 'back_reaper_scythe',
      selectedAura: 'aura_halloween_spooky',
      selectedEmote: 'emote_halloween_trick_or_treat',
      unlockedCosmetics: [
        ...DEFAULT_CUSTOMIZATION.unlockedCosmetics,
        'hat_pumpkin',
        'back_reaper_scythe',
        'aura_halloween_spooky',
        'hat_witch',
        'back_bat_wings'
      ],
    },
  },
  {
    id: 'preset_minecraft_steve',
    name: 'Minecraft Voxel Voyager',
    style: 'Minecraft',
    icon: '⛏️',
    description: 'Iconic blocky cubic silhouette with Diamond Plating, Miner Lamp, and Deal-With-It pixel shades.',
    createdAt: 1700000000000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      baseCharacterId: 21,
      baseType: 'minecraft',
      bodyType: 'blocky_steve',
      selectedHair: 'hair_none',
      selectedShirt: 'shirt_diamond_armor',
      selectedPants: 'pants_greaves',
      skinColor: '#f5d0a9',
      shirtColor: '#22d3ee',
      pantsColor: '#0284c7',
      customName: 'Steve Voxel Master',
      customTitle: 'Deep Vein Spelunker',
      customClass: 'minecraft_miner',
      selectedHat: 'hat_mining',
      selectedFace: 'face_shades',
      selectedWings: 'back_elytra',
      selectedAura: 'aura_emerald',
      selectedEmblem: 'emblem_mc',
      selectedEmote: 'emote_mc_mining_frenzy',
    },
  },
  {
    id: 'preset_roblox_speedrunner',
    name: 'Roblox Obby Champion',
    style: 'Roblox',
    icon: '👟',
    description: 'Classic bevelled R6 torso with Pal Bacon Hair, Dominus Aureus Hood, and Dual Linked Katanas.',
    createdAt: 1700000001000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      baseCharacterId: 501,
      baseType: 'roblox',
      bodyType: 'roblox_r6',
      selectedHair: 'hair_bacon',
      selectedShirt: 'shirt_retro_roblox',
      selectedPants: 'pants_track',
      skinColor: '#facc15',
      shirtColor: '#ef4444',
      pantsColor: '#18181b',
      customName: 'Bloxian Speed Obby',
      customTitle: 'Tower Obby Legend',
      customClass: 'roblox_speedrunner',
      selectedHat: 'hat_dominus',
      selectedFace: 'face_cyborg',
      selectedWings: 'back_katana',
      selectedAura: 'aura_electric',
      selectedEmblem: 'emblem_roblox',
      selectedEmote: 'emote_roblox_dance',
    },
  },
  {
    id: 'preset_countryballs_diplomat',
    name: 'Countryball Sovereign Envoy',
    style: 'Countryballs',
    icon: '🌐',
    description: 'Sovereign spherical ball form with Fiesta Sombrero, Gold Monocle, and UN Accord Laurel emblem.',
    createdAt: 1700000002000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      baseCharacterId: 5,
      baseType: 'countryball',
      bodyType: 'countryball_sphere',
      selectedHair: 'hair_none',
      selectedShirt: 'shirt_tuxedo',
      selectedPants: 'pants_default',
      skinColor: '#f8fafc',
      shirtColor: '#1e293b',
      pantsColor: '#0f172a',
      customName: 'Polandball Diplomat',
      customTitle: 'World Ambassador',
      customClass: 'countryball_diplomat',
      selectedHat: 'hat_sombrero',
      selectedFace: 'face_monocle',
      selectedWings: 'none',
      selectedAura: 'aura_gold',
      selectedEmblem: 'emblem_countryball',
      selectedEmote: 'emote_cb_peace_treaty',
    },
  },
  {
    id: 'preset_xilam_slapstick',
    name: 'Xilam Slapstick Brawler',
    style: 'Xilam',
    icon: '💥',
    description: 'Rubberhose cartoon cat/shark physique with Sharko Trunks, 10-Ton Squeaky Mallet, and Swatter Insignia.',
    createdAt: 1700000003000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      baseCharacterId: 701,
      baseType: 'xilam',
      bodyType: 'xilam_slapstick',
      selectedHair: 'hair_none',
      selectedShirt: 'shirt_default',
      selectedPants: 'pants_trunks',
      skinColor: '#38bdf8',
      shirtColor: '#0284c7',
      pantsColor: '#dc2626',
      customName: 'Oggy Comedy Champion',
      customTitle: 'Cartoon Brawler',
      customClass: 'xilam_brawler',
      selectedHat: 'hat_viking',
      selectedFace: 'none',
      selectedWings: 'none',
      selectedAura: 'aura_flame',
      selectedEmblem: 'emblem_xilam',
      selectedEmote: 'emote_xilam_mallet',
    },
  },
  {
    id: 'preset_nz_wayfinder',
    name: 'Aotearoa Kiwi Wayfinder',
    style: 'NZ',
    icon: '🌿',
    description: 'Kiwi navigator with All Blacks Jersey, Sacred Tā Moko, Silver Fern Cape, and Southern Lights aura.',
    createdAt: 1700000004000,
    data: {
      ...DEFAULT_CUSTOMIZATION,
      baseCharacterId: 801,
      baseType: 'minecraft',
      bodyType: 'nz_allblack',
      selectedHair: 'hair_none',
      selectedShirt: 'shirt_nz_jersey',
      selectedPants: 'pants_nz_rugby',
      skinColor: '#d49b6a',
      shirtColor: '#18181b',
      pantsColor: '#18181b',
      customName: 'Kiwi Rangatira',
      customTitle: 'Southern Cross Navigator',
      customClass: 'nz_rangatira',
      selectedHat: 'hat_silver_fern',
      selectedFace: 'face_ta_moko',
      selectedWings: 'back_allblacks_cape',
      selectedAura: 'aura_silver_fern',
      selectedEmblem: 'emblem_nz',
      selectedEmote: 'emote_nz_haka',
    },
  },
];

export const avatarManager = {
  getLocalCustomization(): PlayerCustomizationData {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CUSTOMIZATION, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse local avatar customization:', e);
    }
    return DEFAULT_CUSTOMIZATION;
  },

  saveLocalCustomization(data: PlayerCustomizationData) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      window.dispatchEvent(new CustomEvent('megaworld_avatar_updated', { detail: data }));
    } catch (e) {
      console.warn('Failed to save local avatar customization:', e);
    }
  },

  async loadFromCloud(uid: string): Promise<PlayerCustomizationData> {
    if (!uid || uid === 'guest-player') {
      return this.getLocalCustomization();
    }
    try {
      const docRef = doc(db, 'players', uid);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const cloudData = snapshot.data();
        if (cloudData.avatarCustomization) {
          const merged = { ...DEFAULT_CUSTOMIZATION, ...cloudData.avatarCustomization };
          this.saveLocalCustomization(merged);
          return merged;
        }
      }
    } catch (e) {
      console.warn('Could not load avatar from cloud, using local fallback:', e);
    }
    return this.getLocalCustomization();
  },

  async saveToCloud(uid: string, data: PlayerCustomizationData): Promise<boolean> {
    this.saveLocalCustomization(data);
    if (!uid || uid === 'guest-player') {
      return true;
    }
    try {
      const docRef = doc(db, 'players', uid);
      await setDoc(docRef, {
        avatarCustomization: data,
        reputation: data.reputation,
        tradesCompleted: data.tradesCompleted,
        lastUpdated: Date.now(),
      }, { merge: true });
      return true;
    } catch (e) {
      console.error('Failed to sync avatar to cloud:', e);
      return false;
    }
  },

  // PRESETS / SAVED AVATAR CREATIONS (Save & Load System)
  getSavedPresets(): AvatarPreset[] {
    try {
      const stored = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) {
        const userPresets = JSON.parse(stored);
        if (Array.isArray(userPresets)) {
          // Merge user presets with defaults if not already present
          const userIds = new Set(userPresets.map((p: AvatarPreset) => p.id));
          const missingDefaults = DEFAULT_AVATAR_PRESETS.filter((p) => !userIds.has(p.id));
          return [...userPresets, ...missingDefaults];
        }
      }
    } catch (e) {
      console.warn('Failed to read saved avatar presets:', e);
    }
    return [...DEFAULT_AVATAR_PRESETS];
  },

  savePreset(name: string, style: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'Brand', data: PlayerCustomizationData): AvatarPreset {
    const iconMap: Record<string, string> = {
      Minecraft: '⛏️',
      Roblox: '👟',
      Countryballs: '🌐',
      Xilam: '💥',
      NZ: '🌿',
      Brand: '⭐',
    };
    const newPreset: AvatarPreset = {
      id: `preset_custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim() || `${style} Creation`,
      style,
      icon: iconMap[style] || '🎨',
      description: `Custom ${style}-inspired avatar created by player.`,
      createdAt: Date.now(),
      data: { ...data, lastUpdated: Date.now() },
    };

    const currentPresets = this.getSavedPresets();
    const updated = [newPreset, ...currentPresets];
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('megaworld_presets_updated', { detail: updated }));
    } catch (e) {
      console.warn('Failed to save avatar preset locally:', e);
    }
    return newPreset;
  },

  deletePreset(presetId: string): boolean {
    const current = this.getSavedPresets();
    const filtered = current.filter((p) => p.id !== presetId);
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(new CustomEvent('megaworld_presets_updated', { detail: filtered }));
      return true;
    } catch (e) {
      console.warn('Failed to delete preset:', e);
      return false;
    }
  },

  loadPreset(presetId: string): PlayerCustomizationData | null {
    const current = this.getSavedPresets();
    const found = current.find((p) => p.id === presetId);
    if (found) {
      return { ...found.data };
    }
    return null;
  },

  unlockCosmetic(currentData: PlayerCustomizationData, cosmeticId: string, costCoins: number): PlayerCustomizationData {
    if (currentData.coins < costCoins) {
      throw new Error('Not enough coins to purchase this cosmetic item!');
    }
    const updated: PlayerCustomizationData = {
      ...currentData,
      coins: currentData.coins - costCoins,
      unlockedCosmetics: Array.from(new Set([...currentData.unlockedCosmetics, cosmeticId])),
      lastUpdated: Date.now(),
    };
    return updated;
  },

  applyToCharacter(baseChar: CharacterData, customData: PlayerCustomizationData): CharacterData {
    return {
      ...baseChar,
      name: customData.customName || baseChar.name,
      customHat: customData.selectedHat,
      customFace: customData.selectedFace,
      customWings: customData.selectedWings,
      customAura: customData.selectedAura,
      customEmblem: customData.selectedEmblem,
      customClass: customData.customClass,
      customFaction: customData.selectedFaction,
      customTitle: customData.customTitle,
      bodyType: customData.bodyType,
      hairStyle: customData.selectedHair,
      hairColor: customData.hairColor,
      shirtStyle: customData.selectedShirt,
      shirtColor: customData.shirtColor,
      pantsStyle: customData.selectedPants,
      pantsColor: customData.pantsColor,
      skinColor: customData.skinColor,
    };
  },

  addCurrency(coins: number, robux: number = 0): { coins: number; robux: number } {
    const current = this.getLocalCustomization();
    const updated: PlayerCustomizationData = {
      ...current,
      coins: Math.max(0, (current.coins || 0) + coins),
      robux: Math.max(0, (current.robux || 0) + robux),
      lastUpdated: Date.now(),
    };
    this.saveLocalCustomization(updated);
    return { coins: updated.coins, robux: updated.robux };
  },

  exportAvatarCode(data: PlayerCustomizationData): string {
    try {
      const payload = {
        name: data.customName,
        title: data.customTitle,
        cls: data.customClass,
        fac: data.selectedFaction,
        btype: data.bodyType,
        base: data.baseCharacterId,
        bkind: data.baseType,
        hat: data.selectedHat,
        face: data.selectedFace,
        back: data.selectedWings,
        aura: data.selectedAura,
        emb: data.selectedEmblem,
        hair: data.selectedHair,
        shirt: data.selectedShirt,
        pants: data.selectedPants,
        sc: data.skinColor,
        hc: data.hairColor,
        tc: data.shirtColor,
        pc: data.pantsColor,
        v: 2
      };
      const json = JSON.stringify(payload);
      const b64 = btoa(unescape(encodeURIComponent(json)));
      return `MEGA-AVTR-${b64}`;
    } catch (e) {
      console.warn('Failed to encode avatar code:', e);
      return '';
    }
  },

  importAvatarCode(code: string, current: PlayerCustomizationData): PlayerCustomizationData {
    const trimmed = code.trim();
    if (!trimmed.startsWith('MEGA-AVTR-')) {
      throw new Error('Invalid Avatar Code format! Must begin with MEGA-AVTR-');
    }
    const b64 = trimmed.replace('MEGA-AVTR-', '');
    const json = decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);

    return {
      ...current,
      customName: parsed.name || current.customName,
      customTitle: parsed.title || current.customTitle,
      customClass: parsed.cls || current.customClass,
      selectedFaction: parsed.fac || current.selectedFaction,
      bodyType: parsed.btype || current.bodyType,
      baseCharacterId: typeof parsed.base === 'number' ? parsed.base : current.baseCharacterId,
      baseType: parsed.bkind || current.baseType,
      selectedHat: parsed.hat || current.selectedHat,
      selectedFace: parsed.face || current.selectedFace,
      selectedWings: parsed.back || current.selectedWings,
      selectedAura: parsed.aura || current.selectedAura,
      selectedEmblem: parsed.emb || current.selectedEmblem,
      selectedHair: parsed.hair || current.selectedHair,
      selectedShirt: parsed.shirt || current.selectedShirt,
      selectedPants: parsed.pants || current.selectedPants,
      skinColor: parsed.sc || current.skinColor,
      hairColor: parsed.hc || current.hairColor,
      shirtColor: parsed.tc || current.shirtColor,
      pantsColor: parsed.pc || current.pantsColor,
      lastUpdated: Date.now(),
    };
  }
};

export interface ThematicOutfitBundle {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World';
  icon: string;
  badge: string;
  description: string;
  customClass: string;
  selectedFaction: string;
  bodyType: string;
  selectedHat: string;
  selectedFace: string;
  selectedWings: string;
  selectedAura: string;
  selectedEmblem: string;
  selectedShirt: string;
  selectedPants: string;
  skinColor: string;
  shirtColor: string;
  pantsColor: string;
}

export const THEMATIC_OUTFIT_BUNDLES: ThematicOutfitBundle[] = [
  {
    id: 'bundle_tarragower_redstone',
    name: 'Tarragower Redstone Scholar',
    brand: 'Tarragower',
    icon: '🎓',
    badge: 'STEAM Academy',
    description: 'Academic attire equipped with redstone logic multimeter, academy blazer, and golden falcon crest.',
    customClass: 'tarragower_scholar',
    selectedFaction: 'faction_countryballs',
    bodyType: 'slim_alex',
    selectedHat: 'hat_tarragower_mortarboard',
    selectedFace: 'face_tarragower_magnifier',
    selectedWings: 'back_tarragower_scroll',
    selectedAura: 'aura_tarragower_wisdom',
    selectedEmblem: 'emblem_tarragower_shield',
    selectedShirt: 'shirt_tarragower_blazer',
    selectedPants: 'pants_tarragower_slacks',
    skinColor: '#f5d0a9',
    shirtColor: '#1e3a8a',
    pantsColor: '#18181b',
  },
  {
    id: 'bundle_bp_clean_vanguard',
    name: 'BP Clean Energy Vanguard',
    brand: 'BP',
    icon: '⚡',
    badge: 'Helios Eco-Tech',
    description: 'High-voltage solar grid protective suit, photon telemetry visor, and dual bio-fuel flight thrusters.',
    customClass: 'bp_engineer',
    selectedFaction: 'faction_bp',
    bodyType: 'brawler_buff',
    selectedHat: 'hat_helios_safety_cap',
    selectedFace: 'face_bp_smart_hud',
    selectedWings: 'back_bp_bio_canister',
    selectedAura: 'aura_bp_clean_grid',
    selectedEmblem: 'emblem_bp_wind_turbine',
    selectedShirt: 'shirt_bp_suit',
    selectedPants: 'pants_bp_tech',
    skinColor: '#d49b6a',
    shirtColor: '#059669',
    pantsColor: '#15803d',
  },
  {
    id: 'bundle_mcd_golden_chef',
    name: 'McDonald\'s Master Chef',
    brand: 'McDonald\'s',
    icon: '🍔',
    badge: 'Golden Arches',
    description: 'Executive chef hat, golden fry aviator sunglasses, and legendary 24k gold master spatula.',
    customClass: 'mcdonalds_chef',
    selectedFaction: 'faction_mcdonalds',
    bodyType: 'blocky_steve',
    selectedHat: 'hat_chef',
    selectedFace: 'face_mcd_fry_shades',
    selectedWings: 'back_golden_spatula',
    selectedAura: 'aura_golden_arches_glow',
    selectedEmblem: 'emblem_mcd_fry_box',
    selectedShirt: 'shirt_mcdonalds',
    selectedPants: 'pants_mcdonalds_crew',
    skinColor: '#facc15',
    shirtColor: '#dc2626',
    pantsColor: '#18181b',
  },
  {
    id: 'bundle_newworld_azoth_crusader',
    name: 'New World Azoth Crusader',
    brand: 'New World',
    icon: '⚔️',
    badge: 'Aeternum Pioneer',
    description: 'Aeternum war coif, glowing Azoth runic cheek markings, and celestial life staff of restoration.',
    customClass: 'new_world_pioneer',
    selectedFaction: 'faction_newworld',
    bodyType: 'brawler_buff',
    selectedHat: 'hat_aeternum_conqueror_coif',
    selectedFace: 'face_azoth_veins',
    selectedWings: 'back_aeternum_life_staff',
    selectedAura: 'aura_azoth_consecration',
    selectedEmblem: 'emblem_aeternum_covenant',
    selectedShirt: 'shirt_newworld_armor',
    selectedPants: 'pants_newworld_greaves',
    skinColor: '#d49b6a',
    shirtColor: '#38bdf8',
    pantsColor: '#0f172a',
  },
  {
    id: 'bundle_roblox_bloxian_speedster',
    name: 'Roblox Bloxian Speedster',
    brand: 'Roblox',
    icon: '👟',
    badge: 'Crossroads Champion',
    description: 'Valkyrie winged helm, Overseer green optic ocular, and prismatic Illumina linked blade.',
    customClass: 'roblox_speedrunner',
    selectedFaction: 'faction_roblox',
    bodyType: 'roblox_r6',
    selectedHat: 'hat_valkyrie_helm',
    selectedFace: 'face_overseer_optic',
    selectedWings: 'back_illumina_sword',
    selectedAura: 'aura_hyper_spark',
    selectedEmblem: 'emblem_roblox',
    selectedShirt: 'shirt_retro_roblox',
    selectedPants: 'pants_track',
    skinColor: '#facc15',
    shirtColor: '#ef4444',
    pantsColor: '#18181b',
  },
  {
    id: 'bundle_mc_sculk_warden',
    name: 'Minecraft Deep Dark Warden',
    brand: 'Minecraft',
    icon: '⛏️',
    badge: 'Ancient City',
    description: 'Vibrating sculk echo horns, allay glowing cyan eyes, and soul urn with expanding sonar waves.',
    customClass: 'minecraft_miner',
    selectedFaction: 'faction_minecraft',
    bodyType: 'blocky_steve',
    selectedHat: 'hat_sculk_horns',
    selectedFace: 'face_allay_glow_eyes',
    selectedWings: 'back_sculk_catalyst',
    selectedAura: 'aura_warden_vibration',
    selectedEmblem: 'emblem_mc_nether_star',
    selectedShirt: 'shirt_diamond_armor',
    selectedPants: 'pants_greaves',
    skinColor: '#8d5524',
    shirtColor: '#0284c7',
    pantsColor: '#0369a1',
  },
  {
    id: 'bundle_nz_aotearoa_guardian',
    name: 'NZ Aotearoa Guardian',
    brand: 'NZ',
    icon: '🌿',
    badge: 'Waitangi Clan',
    description: 'Huia Chieftain feather, sacred Tā Moko facial spiral, Silver Fern cape, and Southern Aurora Australis.',
    customClass: 'nz_rangatira',
    selectedFaction: 'faction_nz',
    bodyType: 'nz_allblack',
    selectedHat: 'hat_haka_feather',
    selectedFace: 'face_ta_moko',
    selectedWings: 'back_allblacks_cape',
    selectedAura: 'aura_silver_fern',
    selectedEmblem: 'emblem_nz',
    selectedShirt: 'shirt_nz_jersey',
    selectedPants: 'pants_nz_rugby',
    skinColor: '#d49b6a',
    shirtColor: '#18181b',
    pantsColor: '#18181b',
  },
  {
    id: 'bundle_xilam_slapstick_brawler',
    name: 'Xilam Slapstick Brawler',
    brand: 'Xilam',
    icon: '💥',
    badge: 'Oggy Cartoon',
    description: 'Springy rubber antennas, stretchy cat grin, 10-ton oversized hammer, and dizzy orbiting stars.',
    customClass: 'roblox_speedrunner',
    selectedFaction: 'faction_roblox',
    bodyType: 'xilam_slapstick',
    selectedHat: 'hat_cockroach_antenna',
    selectedFace: 'face_slapstick_grin',
    selectedWings: 'back_cream_pie_cannon',
    selectedAura: 'aura_slapstick_stars',
    selectedEmblem: 'emblem_slapstick_bomb',
    selectedShirt: 'shirt_xilam_cartoon_vest',
    selectedPants: 'pants_trunks',
    skinColor: '#38bdf8',
    shirtColor: '#ef4444',
    pantsColor: '#f59e0b',
  },
  {
    id: 'bundle_yt_100m_super_creator',
    name: 'YouTube 100M Super Creator',
    brand: 'YouTube',
    icon: '▶️',
    badge: 'Red Diamond Guild',
    description: 'Diamond play beanie, sound-reactive LED sunglasses, 8K broadcast satellite rig, and Superchat coin rain.',
    customClass: 'youtube_creator',
    selectedFaction: 'faction_youtube',
    bodyType: 'slim_alex',
    selectedHat: 'hat_yt_creator_beanie',
    selectedFace: 'face_streamer_led_glasses',
    selectedWings: 'back_yt_streaming_rig',
    selectedAura: 'aura_yt_superchat_rain',
    selectedEmblem: 'emblem_yt_live_badge',
    selectedShirt: 'shirt_youtube_creator',
    selectedPants: 'pants_combat',
    skinColor: '#f5d0a9',
    shirtColor: '#ef4444',
    pantsColor: '#18181b',
  },
];
