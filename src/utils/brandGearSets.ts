/**
 * Brand Item & Gear Sets System
 * Unique gear sets inspired by Minecraft, Roblox, Xilam, McDonald's, YouTube, New World, Sprunki, BP & Countryballs.
 * Obtainable through quests, events, crafting, and achievements.
 */

export interface BrandGearItem {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Xilam' | 'McDonald\'s' | 'YouTube' | 'New World' | 'Sprunki' | 'BP' | 'Countryballs' | 'Tarragower';
  slot: 'weapon' | 'armor' | 'boots' | 'accessory' | 'tool' | 'shield';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';
  icon: string;
  description: string;
  gameplayEffect: string;
  statBonus: {
    attack?: number;
    defense?: number;
    speedBonus?: number; // e.g. 0.3 for +30%
    jumpBonus?: number;
    healthRegen?: number;
    dropMultiplier?: number;
  };
  sfxSound?: string;
  colorBorder: string;
  colorBg: string;
  obtainMethod: string; // e.g. "Complete Quest: Sprokui's Harmony", "Event: Golden Arches Raid"
  craftingRecipe?: {
    materials: { item: string; count: number }[];
  };
}

export interface BrandGearSet {
  id: string;
  setName: string;
  brand: BrandGearItem['brand'];
  themeColor: string;
  bannerGradient: string;
  lore: string;
  setBonus2pc: string;
  setBonusFull: string;
  items: BrandGearItem[];
}

export const BRAND_GEAR_SETS: BrandGearSet[] = [
  // 1. Sprunki Harmonic Set
  {
    id: 'set_sprunki',
    setName: "Sprunki's Harmonic Ensemble",
    brand: 'Sprunki',
    themeColor: '#a855f7',
    bannerGradient: 'from-purple-900 via-fuchsia-950 to-stone-900',
    lore: 'Forged from pure vocal wavelengths and celestial Starlight Chimes in the heart of Incredibox Studio.',
    setBonus2pc: 'Harmonic Pulse: Attacks unleash musical soundwaves that heal allies for 15 HP.',
    setBonusFull: 'Symphonic Overdrive: Jukebox playback grants +50% movement speed and damage immunity for 10s.',
    items: [
      {
        id: 'sprunki_sword',
        name: "Sprunki's Sword of Friendship",
        brand: 'Sprunki',
        slot: 'weapon',
        rarity: 'Mythic',
        icon: '🎶',
        description: 'A glowing crystalline rapier vibrating with friendly melodic beats. Strikes play resonant harp chords!',
        gameplayEffect: 'Plays procedural chord stabs on hit; heals 8 HP every 3 consecutive strikes; grants allies +10% attack.',
        statBonus: { attack: 14, speedBonus: 0.15, healthRegen: 2 },
        sfxSound: 'badge',
        colorBorder: 'border-fuchsia-400',
        colorBg: 'bg-fuchsia-950/60',
        obtainMethod: 'Complete Quest: "Harmonic Peace Treaty" in Quest Hub',
        craftingRecipe: {
          materials: [
            { item: 'amethyst', count: 3 },
            { item: 'diamond', count: 2 },
            { item: 'gold', count: 1 },
          ],
        },
      },
      {
        id: 'sprunki_headphones',
        name: 'Sprunki Studio DJ Headphones',
        brand: 'Sprunki',
        slot: 'accessory',
        rarity: 'Epic',
        icon: '🎧',
        description: 'Noise-canceling retro neon DJ cans that pump procedural beats directly into your adventurer.',
        gameplayEffect: 'Immunity to hostile screech and warden vibration blinds; +20% jump height.',
        statBonus: { defense: 6, jumpBonus: 0.25 },
        sfxSound: 'click',
        colorBorder: 'border-purple-400',
        colorBg: 'bg-purple-950/60',
        obtainMethod: 'Event: Sprunki Phase 2 Void Infiltration Raid',
        craftingRecipe: {
          materials: [
            { item: 'coal', count: 4 },
            { item: 'ore', count: 2 },
            { item: 'amethyst', count: 1 },
          ],
        },
      },
    ],
  },

  // 2. New World Explorer Set
  {
    id: 'set_new_world',
    setName: "New World Pioneer's Expedition Kit",
    brand: 'New World',
    themeColor: '#e11d48',
    bannerGradient: 'from-rose-950 via-red-950 to-stone-900',
    lore: 'Crafted by the master frontiersmen of New World supermarkets and boundless wilderness territories.',
    setBonus2pc: 'Swift Pioneer: +25% sprint speed on all terrain types and double forage yields.',
    setBonusFull: 'Supply Chain Dominance: Defeated foes drop triple coins and rare fresh produce!',
    items: [
      {
        id: 'new_world_boots',
        name: "New World Explorer's Boots",
        brand: 'New World',
        slot: 'boots',
        rarity: 'Legendary',
        icon: '🥾',
        description: 'Rugged all-weather reinforced leather boots built for trekking across 200 billion blocks.',
        gameplayEffect: 'Negates 75% fall damage; grants +40% sprint speed and instant cliff ascent.',
        statBonus: { defense: 8, speedBonus: 0.4 },
        sfxSound: 'step',
        colorBorder: 'border-rose-400',
        colorBg: 'bg-rose-950/60',
        obtainMethod: 'Complete Quest: "New World Frontier Provisioning"',
        craftingRecipe: {
          materials: [
            { item: 'wood', count: 6 },
            { item: 'gold', count: 2 },
          ],
        },
      },
      {
        id: 'new_world_satchel',
        name: 'New World Harvest Satchel',
        brand: 'New World',
        slot: 'accessory',
        rarity: 'Rare',
        icon: '🎒',
        description: 'Enchanted deep-pocket haversack that automatically gathers nearby floating blocks.',
        gameplayEffect: 'Magnetic collection radius +4 blocks; expands maximum item stack limits.',
        statBonus: { dropMultiplier: 1.5, defense: 4 },
        sfxSound: 'click',
        colorBorder: 'border-red-400',
        colorBg: 'bg-red-950/60',
        obtainMethod: 'Random World Event: Supply Crate Airdrop',
        craftingRecipe: {
          materials: [
            { item: 'wood', count: 4 },
            { item: 'apples', count: 2 },
          ],
        },
      },
    ],
  },

  // 3. McDonald's Golden Arches Set
  {
    id: 'set_mcdonalds',
    setName: 'McDonald’s Golden Feast Arsenal',
    brand: 'McDonald\'s',
    themeColor: '#eab308',
    bannerGradient: 'from-amber-950 via-yellow-950 to-stone-900',
    lore: 'Legendary kitchen weaponry forged in the blazing fryers of Landmark 4.',
    setBonus2pc: 'Sizzling Aura: Attacks ignite enemies with golden fry oil (+5 fire damage per sec).',
    setBonusFull: 'Happy Meal Miracle: Taking fatal damage instantly consumes a Cheezburger to revive with 100% HP!',
    items: [
      {
        id: 'mcdonalds_spatula',
        name: 'Golden Arches Battle Spatula',
        brand: 'McDonald\'s',
        slot: 'weapon',
        rarity: 'Legendary',
        icon: '🍳',
        description: 'A heavy titanium burger-flipper with a sizzling serrated edge. Flips enemy projectiles right back!',
        gameplayEffect: 'Heavy knockback; deflects incoming projectiles; strikes create a sizzle burst that feeds allies.',
        statBonus: { attack: 13, healthRegen: 3 },
        sfxSound: 'cheezburger',
        colorBorder: 'border-yellow-400',
        colorBg: 'bg-yellow-950/60',
        obtainMethod: 'Event: Giant Grimace Invasion Boss Raid',
        craftingRecipe: {
          materials: [
            { item: 'ore', count: 4 },
            { item: 'gold', count: 3 },
            { item: 'coal', count: 2 },
          ],
        },
      },
      {
        id: 'grimace_shake',
        name: 'Cosmic Grimace Elixir',
        brand: 'McDonald\'s',
        slot: 'accessory',
        rarity: 'Mythic',
        icon: '🥤',
        description: 'Vibrant purple otherworldly thickshake that bends spacetime around the drinker.',
        gameplayEffect: 'Active consumption grants 25s of invincibility, zero-gravity levitation, and purple trail sparkles.',
        statBonus: { defense: 12, healthRegen: 5 },
        sfxSound: 'cola',
        colorBorder: 'border-purple-400',
        colorBg: 'bg-purple-950/60',
        obtainMethod: 'Complete Quest: "The Secret Arches Formula"',
      },
    ],
  },

  // 4. Roblox Classic Bloxian Set
  {
    id: 'set_roblox',
    setName: 'Crossroads Classic Bloxian Regalia',
    brand: 'Roblox',
    themeColor: '#0ea5e9',
    bannerGradient: 'from-cyan-950 via-blue-950 to-stone-900',
    lore: 'The time-honored gear of 2006 Roblox Crossroads gladiators and Obby masters.',
    setBonus2pc: 'Stud Resilience: Reduces all explosion and spike damage by 50%.',
    setBonusFull: 'Respawn Velocity: Falling OOF resets position to nearest safe stud block without losing inventory.',
    items: [
      {
        id: 'blox_hyper_sword',
        name: 'Bloxian Linked Hyper-Sword',
        brand: 'Roblox',
        slot: 'weapon',
        rarity: 'Mythic',
        icon: '⚔️',
        description: 'Classic SFOTH linked sword forged from solid poly-studs. Emits the legendary "schwing" sound!',
        gameplayEffect: 'Lunge slash forward 5 blocks; critical hit deals 2.5x damage with iconic sword slash audio.',
        statBonus: { attack: 16, speedBonus: 0.2 },
        sfxSound: 'sword',
        colorBorder: 'border-cyan-400',
        colorBg: 'bg-cyan-950/60',
        obtainMethod: 'Tournament: Roblox Crossroads Obby Championship',
        craftingRecipe: {
          materials: [
            { item: 'diamond', count: 2 },
            { item: 'ore', count: 4 },
            { item: 'amethyst', count: 1 },
          ],
        },
      },
      {
        id: 'gravity_coil_rig',
        name: 'Master Gravity Coil Jump Rig',
        brand: 'Roblox',
        slot: 'accessory',
        rarity: 'Epic',
        icon: '🌀',
        description: 'High-tension coiled spring worn around the waist. Defies the normal laws of gravity.',
        gameplayEffect: 'Reduces falling speed by 60%; jump height increased by +80%; springy wobble audio on jump.',
        statBonus: { jumpBonus: 0.8, defense: 5 },
        sfxSound: 'coil',
        colorBorder: 'border-blue-400',
        colorBg: 'bg-blue-950/60',
        obtainMethod: 'Complete Quest: "High-Altitude Obby Mastery"',
        craftingRecipe: {
          materials: [
            { item: 'ore', count: 3 },
            { item: 'gold', count: 2 },
          ],
        },
      },
    ],
  },

  // 5. YouTube Content Creator Set
  {
    id: 'set_youtube',
    setName: 'Viral Streamer Broadcast Gear',
    brand: 'YouTube',
    themeColor: '#ef4444',
    bannerGradient: 'from-red-950 via-rose-950 to-stone-900',
    lore: 'Stream gear gifted to content creators broadcasting MegaWorld RP live across the multiverse.',
    setBonus2pc: 'Hype Momentum: Killing foes increases movement and attack speed by 5% stacking up to 5 times.',
    setBonusFull: 'Viral Raid: Nearby allies gain double experience points and golden celebratory confetti!',
    items: [
      {
        id: 'youtube_shield',
        name: 'Diamond Play Button Aegis',
        brand: 'YouTube',
        slot: 'shield',
        rarity: 'Legendary',
        icon: '🛡️',
        description: 'A heavy mirrored shield carved from 10,000,000 subscriber diamond crystal.',
        gameplayEffect: 'Reflects 50% of melee damage back to attackers; blocks 100% of projectile arrows.',
        statBonus: { defense: 18, attack: 4 },
        sfxSound: 'badge',
        colorBorder: 'border-red-400',
        colorBg: 'bg-red-950/60',
        obtainMethod: 'Complete Event: "MegaWorld 10M Streamer Broadcast"',
        craftingRecipe: {
          materials: [
            { item: 'diamond', count: 4 },
            { item: 'gold', count: 2 },
          ],
        },
      },
      {
        id: 'streamer_mic',
        name: 'Studio Condenser Mic Wand',
        brand: 'YouTube',
        slot: 'weapon',
        rarity: 'Rare',
        icon: '🎙️',
        description: 'High-gain broadcast condenser microphone that channels sonic soundwaves against hostiles.',
        gameplayEffect: 'Fires high-frequency vocal blips that stun monsters for 2.5 seconds.',
        statBonus: { attack: 10, speedBonus: 0.1 },
        sfxSound: 'click',
        colorBorder: 'border-red-500',
        colorBg: 'bg-red-950/60',
        obtainMethod: 'Complete Quest: "Live Broadcast from the End"',
      },
    ],
  },

  // 6. Xilam Slapstick Cartoon Set
  {
    id: 'set_xilam',
    setName: 'Xilam Slapstick Havoc Kit',
    brand: 'Xilam',
    themeColor: '#10b981',
    bannerGradient: 'from-emerald-950 via-teal-950 to-stone-900',
    lore: 'Wild, wacky cartoon slapstick inventions straight from Oggy and the Cockroaches.',
    setBonus2pc: 'Rubber Bones: Immune to falling damage; bouncing off walls propels you forward.',
    setBonusFull: 'Cartoon Chaos: Hostile hits trigger a squeaky anvil drop from the sky onto the attacker!',
    items: [
      {
        id: 'oggy_swatter',
        name: "Oggy's Colossal Flyswatter",
        brand: 'Xilam',
        slot: 'weapon',
        rarity: 'Epic',
        icon: '🪰',
        description: 'Giant oversized red rubber swatter. Flattens monsters into hilarious 2D pancakes!',
        gameplayEffect: 'Massive vertical slam; flattens enemies for 3s; plays squeaky slapstick sound effect.',
        statBonus: { attack: 12, healthRegen: 1 },
        sfxSound: 'click',
        colorBorder: 'border-emerald-400',
        colorBg: 'bg-emerald-950/60',
        obtainMethod: 'Complete Quest: "Cockroach Pantry Counter-Attack"',
        craftingRecipe: {
          materials: [
            { item: 'wood', count: 6 },
            { item: 'planks', count: 4 },
          ],
        },
      },
    ],
  },

  // 7. BP Industrial Power Set
  {
    id: 'set_bp',
    setName: 'BP Petro-Mechanical Rig',
    brand: 'BP',
    themeColor: '#84cc16',
    bannerGradient: 'from-lime-950 via-emerald-950 to-stone-900',
    lore: 'High-octane industrial engineering gear developed at the Landmark 5 Deep Sea Platforms.',
    setBonus2pc: 'High Octane: Mining and digging speed increased by +40%.',
    setBonusFull: 'Refinery Core: Burning fuels lasts 300% longer; furnace and smelting operate instantly!',
    items: [
      {
        id: 'bp_jetpack',
        name: 'BP High-Octane Fuel Jetpack',
        brand: 'BP',
        slot: 'accessory',
        rarity: 'Legendary',
        icon: '🚀',
        description: 'Dual-thruster petroleum booster pack strapped to the adventurer’s back.',
        gameplayEffect: 'Holding Jump activates sustained rocket propulsion with roaring sub-bass thrusters.',
        statBonus: { jumpBonus: 1.2, speedBonus: 0.35, defense: 6 },
        sfxSound: 'speed',
        colorBorder: 'border-lime-400',
        colorBg: 'bg-lime-950/60',
        obtainMethod: 'Event: Offshore Refinery Defense',
        craftingRecipe: {
          materials: [
            { item: 'ore', count: 5 },
            { item: 'coal', count: 8 },
            { item: 'gold', count: 2 },
          ],
        },
      },
    ],
  },

  // 8. Countryballs Diplomatic Vanguard Set
  {
    id: 'set_countryballs',
    setName: 'Countryballs Sovereign Vanguard',
    brand: 'Countryballs',
    themeColor: '#38bdf8',
    bannerGradient: 'from-sky-950 via-blue-950 to-stone-900',
    lore: 'Sovereign battle equipment carried by the diplomatic sphere emissaries across the globe.',
    setBonus2pc: 'Sovereignty: Immunity to knockback and forced displacement.',
    setBonusFull: 'Poland Can Into Space: Double gravity reduction at high altitudes; infinite oxygen!',
    items: [
      {
        id: 'poland_helmet',
        name: 'Polandball Space Pioneer Helmet',
        brand: 'Countryballs',
        slot: 'armor',
        rarity: 'Legendary',
        icon: '🪖',
        description: 'Proof that Poland CAN into space! Glass-domed cosmic helm with red-and-white spherical trim.',
        gameplayEffect: 'Allows survival in deep void biomes and space altitude; +50% night vision clarity.',
        statBonus: { defense: 14, jumpBonus: 0.4 },
        sfxSound: 'badge',
        colorBorder: 'border-sky-400',
        colorBg: 'bg-sky-950/60',
        obtainMethod: 'Complete Quest: "Polandball’s Lunar Dream"',
        craftingRecipe: {
          materials: [
            { item: 'glass', count: 4 },
            { item: 'ore', count: 3 },
            { item: 'diamond', count: 1 },
          ],
        },
      },
    ],
  },
];

// Helper to find all brand items flat
export const ALL_BRAND_GEAR_ITEMS: BrandGearItem[] = BRAND_GEAR_SETS.flatMap(s => s.items);

export const getBrandGearById = (id: string): BrandGearItem | undefined => {
  return ALL_BRAND_GEAR_ITEMS.find(item => item.id === id);
};
