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

  // FACE / EYEWEAR
  { id: 'face_shades', name: 'Pixel Deal With It Shades', slot: 'face', priceCoins: 0, brand: 'Minecraft', icon: '🕶️', description: 'Iconic 8-bit cool sunglasses.', rarity: 'common' },
  { id: 'face_monocle', name: 'Aristocrat Gold Monocle', slot: 'face', priceCoins: 110, brand: 'Countryballs', icon: '🧐', description: 'Polished brass optical lens with delicate chain.', rarity: 'rare' },
  { id: 'face_bandana', name: 'Desert Outlaw Bandana', slot: 'face', priceCoins: 90, brand: 'New World', icon: '🧣', description: 'Patterned paisley bandana masking lower face.', rarity: 'common' },
  { id: 'face_cyborg', name: 'Cyborg Laser Monocular', slot: 'face', priceCoins: 300, brand: 'Roblox', icon: '🔴', description: 'Cybernetic targeting ocular unit with red reticle.', rarity: 'epic' },
  { id: 'face_goggles', name: 'Steampunk Brass Goggles', slot: 'face', priceCoins: 160, brand: 'Tarragower', icon: '🥽', description: 'Dual-lens laboratory inspection goggles.', rarity: 'rare' },
  { id: 'face_ta_moko', name: 'Sacred Tā Moko Markings', slot: 'face', priceCoins: 180, brand: 'NZ', icon: '🌀', description: 'Intricate traditional spiral facial tattoo representing ancestral lineage.', rarity: 'legendary' },
  { id: 'face_pounamu', name: 'Pounamu Greenstone Pendant', slot: 'face', priceCoins: 140, brand: 'NZ', icon: '🟢', description: 'Sacred carved nephrite jade talisman carrying ocean blessings.', rarity: 'rare' },

  // BACK / WINGS / CAPE
  { id: 'back_elytra', name: 'Enchanted Elytra Wings', slot: 'back', priceCoins: 0, brand: 'Minecraft', icon: '🪽', description: 'Aerodynamic beetle wings for gliding.', rarity: 'rare' },
  { id: 'back_mojang', name: 'Mojang Red Cape', slot: 'back', priceCoins: 250, brand: 'Minecraft', icon: '🧣', description: 'Rare red cape emblazoned with the Mojang seal.', rarity: 'epic' },
  { id: 'back_katana', name: 'Linked Blade Sheath', slot: 'back', priceCoins: 280, brand: 'Roblox', icon: '⚔️', description: 'Dual cross-sheathed ninjato swords.', rarity: 'epic' },
  { id: 'back_angel', name: 'Seraphic Angel Feathers', slot: 'back', priceCoins: 450, brand: 'Universal', icon: '🕊️', description: 'Luminous white feathered wings.', rarity: 'legendary' },
  { id: 'back_dragon', name: 'Ender Dragon Wings', slot: 'back', priceCoins: 550, brand: 'Minecraft', icon: '🐉', description: 'Dark obsidian membrane wings of the dragon.', rarity: 'legendary' },
  { id: 'back_turtle', name: 'Turtle Scute Carapace', slot: 'back', priceCoins: 190, brand: 'Universal', icon: '🐢', description: 'Sturdy green defensive shell on back.', rarity: 'rare' },
  { id: 'back_kiwi', name: 'Kiwi Companion Backpack', slot: 'back', priceCoins: 260, brand: 'NZ', icon: '🥝', description: 'Adorable nocturnal kiwi bird chick resting comfortably in a pack.', rarity: 'epic' },
  { id: 'back_allblacks_cape', name: 'Silver Fern Flag Cape', slot: 'back', priceCoins: 240, brand: 'NZ', icon: '🏴', description: 'Flowing midnight-black cloak with the white Silver Fern and Southern Cross.', rarity: 'epic' },

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
];

export const COLOR_PRESETS = {
  skin: ['#f5d0a9', '#facc15', '#d49b6a', '#8d5524', '#3b2219', '#38bdf8', '#4ade80', '#c084fc', '#f43f5e'],
  hair: ['#451a03', '#1c1917', '#eab308', '#ea580c', '#38bdf8', '#ec4899', '#a855f7', '#f8fafc', '#22c55e'],
  clothes: ['#0055ff', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#18181b', '#f8fafc', '#ec4899'],
};

export interface PlayerCustomizationData {
  baseCharacterId: number;
  baseType: 'minecraft' | 'countryball' | 'roblox' | 'xilam';
  bodyType: string;
  selectedHair: string;
  selectedShirt: string;
  selectedPants: string;
  skinColor: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  customName: string;
  customTitle: string;
  customClass: string;
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
  origin: 'Sprunki' | 'Thomas & Friends' | 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World';
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
  }
};
