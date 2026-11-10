/**
 * Christmas Holiday Mega Data Catalog
 * Generates and manages 1,000 Christmas Characters, 1,000 Christmas Items, and 1,000 Christmas Settings.
 * Optimized for high-performance virtualized searching, filtering, equipping, and Firestore synchronization.
 */

import { CharacterData } from '../components/CharacterAvatar';

// ============================================================================
// 1. 1,000 CHRISTMAS CHARACTERS
// ============================================================================

export interface ChristmasCharacterRecord extends CharacterData {
  christmasCategory: 
    | 'santa_variants'
    | 'elf_artisans'
    | 'reindeer_frost_beasts'
    | 'holiday_countryballs'
    | 'frosted_sprunki'
    | 'roblox_winter'
    | 'minecraft_holiday'
    | 'brand_ambassadors'
    | 'nutcrackers_toys'
    | 'yule_mythics';
  christmasLore: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Holiday Mythic';
  holidayCheer: number;
  frostResistance: number;
  sleighSpeed: number;
  giftLuck: number;
  unlockedByDefault: boolean;
}

// Prefixes, names, and titles for generating 1,000 distinct characters
const SANTA_TITLES = [
  'St. Nicholas Prime', 'Cyber Santa 3000', 'Arctic Viking Santa', 'Steampunk Toymaker Santa',
  'Cosmic Galaxy Santa', 'Pixel Block Santa', 'Golden Grand Santa', 'Frostfire Nicholas',
  'Deep Mountain Santa', 'Highland Kringle', 'Neon North Santa', 'Celestial Starlight Santa',
  'Clockwork Claus', 'Gingerbread Santa', 'Snowstorm Claus', 'Toymaster General',
  'Old Father Christmas', 'Sleigh Commander Nick', 'Aurora Nicholas', 'Evergreen Santa'
];

const ELF_ROLES = [
  'Master Clockmaker', 'Candy Cane Smelter', 'Sleigh Engine Tuner', 'Ribbon Weaver',
  'Toy Soldier Carver', 'Starlight Glassblower', 'Peppermint Alchemist', 'Gingerbread Mason',
  'Wishlist Cartographer', 'Reindeer Stablemaster', 'Snowglobe Enchanter', 'Jingle Bell Tuner',
  'Elf Scout Ranger', 'North Pole Courier', 'Ornament Gilder', 'Toy Train Conductor',
  'Sugar Plum Baker', 'Nutcracker Machinist', 'Aurora Lantern Lighter', 'Frost Runic Scribe'
];

const REINDEER_NAMES = [
  'Rudolph', 'Dasher', 'Dancer', 'Prancer', 'Vixen', 'Comet', 'Cupid', 'Donner', 'Blitzen',
  'Borealis', 'Frosthorn', 'Silverhoof', 'Glowantler', 'Starlit', 'Glacier', 'Timberhoof',
  'Thunderstride', 'Mistral', 'Canyon-Leaper', 'Yule-Antler'
];

const NATIONS_FOR_BALLS = [
  'Poland', 'USA', 'UK', 'Germany', 'France', 'Japan', 'Canada', 'Sweden', 'Norway', 'Finland',
  'Iceland', 'Italy', 'Switzerland', 'Austria', 'Denmark', 'New Zealand', 'Australia', 'Brazil',
  'Mexico', 'Greece', 'Ukraine', 'Ireland', 'Netherlands', 'Czechia', 'South Korea'
];

const SPRUNKI_HOLIDAY_ALIASES = [
  'Jingle Oren', 'Peppermint Clukr', 'Mistletoe Vineria', 'Caroler Simon', 'Frostbeat Tuner',
  'Glacial Funbot', 'Holiday Wenda', 'Gingerbread Garnold', 'Starlight Pinki', 'Sub-Zero Sky',
  'Snowfall Durple', 'Evergreen Mr. Sun', 'Chimney Gray', 'Festive Brud', 'Aurora Verity'
];

const ROBLOX_WINTER_CLASSES = [
  'Frosted Noob', 'Candy Cane Bloxian', 'Frostguard Paladin', 'Dominus Blizzard', 'Guest 666 Yule',
  'Gingerbread Builder', 'Winter Speedrun Runner', 'Holiday Tycoon Tycoon', 'Obby Snow Climber', 'OOF-mas Caroler'
];

const MINECRAFT_HOLIDAY_CLASSES = [
  'Holiday Diamond Steve', 'Winter Cloak Alex', 'Festive Creeper with Bow', 'Snow Golem King',
  'Santa Hat Piglin', 'Peppermint Iron Golem', 'Frost Walker Ender Knight', 'Cozy Fireplace Villager',
  'Glazed Terracotta Strider', 'Bells & Holly Evoker'
];

const BRAND_HOLIDAY_TITLES = [
  "McDonald's Secret Santa Ronald", "McDonald's Frosted Grimace", "McDonald's Holiday Fry Elf",
  "BP Solar Aurora Specialist", "BP Clean Hydrogen Yule Trucker",
  "Xilam Slapstick Snowman Oggy", "Xilam Christmas Mallet Jack", "Xilam Gingerbread Cockroach Trio",
  "Tarragower Yule Whare Rangatira", "Tarragower Winter Academy Scholar",
  "New World Aeternum Winter Conqueror", "New World Azoth Yule Smith",
  "YouTube Holiday Streamer Nova", "YouTube 10M Sub Gold Bell Creator",
  "LEGO Master Holiday Bricksmith"
];

// Generate exactly 1,000 distinct Christmas characters
export const generate1000ChristmasCharacters = (): ChristmasCharacterRecord[] => {
  const characters: ChristmasCharacterRecord[] = [];
  const totalTarget = 1000;

  for (let i = 1; i <= totalTarget; i++) {
    const id = 10000 + i;
    const catIndex = (i - 1) % 10;
    let name = '';
    let category: ChristmasCharacterRecord['christmasCategory'] = 'santa_variants';
    let type: CharacterData['type'] = 'custom';
    let costume: CharacterData['christmasCostume'] = 'santa';
    let color = 'bg-red-600';
    let heldWeapon: string | undefined = undefined;
    let lore = '';

    if (i === 1) {
      name = 'Holiday Jeremy the Jet Plane (Steremy)';
      category = 'santa_variants';
      type = 'train';
      costume = 'santa';
      color = 'bg-sky-400';
      heldWeapon = 'jeremy_flight_token';
      lore = 'The iconic high-flying jet plane of Sodor Airport dressed in Christmas cheer! Soars through winter blizzards delivering holiday gifts at Mach 4.';
    } else if (i === 2) {
      name = 'Steremy Supersonic Holiday Aviator';
      category = 'reindeer_frost_beasts';
      type = 'train';
      costume = 'reindeer';
      color = 'bg-rose-600';
      heldWeapon = 'jet_turbine_booster';
      lore = 'Steremy equipped with twin candy cane turbojets and reindeer antlers, lighting up the Christmas night skies!';
    } else if (catIndex === 0) {
      // Santa variants (100)
      category = 'santa_variants';
      const title = SANTA_TITLES[(i / 10 | 0) % SANTA_TITLES.length];
      const variantSuffix = Math.floor((i - 1) / 10) + 1;
      name = `${title} (Mark ${variantSuffix})`;
      type = 'custom';
      costume = 'santa';
      color = i % 2 === 0 ? 'bg-red-700' : 'bg-rose-800';
      heldWeapon = i % 3 === 0 ? 'candy_cane_staff' : 'sack_of_toys';
      lore = `An avatar of pure festive benevolence from North Pole Sector ${variantSuffix}, delivering gifts across multiverse realms.`;
    } else if (catIndex === 1) {
      // Elf artisans (100)
      category = 'elf_artisans';
      const role = ELF_ROLES[(i / 10 | 0) % ELF_ROLES.length];
      const elfIndex = Math.floor((i - 1) / 10) + 1;
      name = `Elf ${role} #${elfIndex}`;
      type = 'custom';
      costume = 'elf';
      color = 'bg-emerald-600';
      heldWeapon = 'toy_hammer';
      lore = `Dedicated artisan in Santa's high-tech clockwork workshop, specializing in precision ${role.toLowerCase()}.`;
    } else if (catIndex === 2) {
      // Reindeer & Frost Beasts (100)
      category = 'reindeer_frost_beasts';
      const baseName = REINDEER_NAMES[(i / 10 | 0) % REINDEER_NAMES.length];
      const squadron = Math.floor((i - 1) / 10) + 1;
      name = `${baseName} Squadron Wing ${squadron}`;
      type = 'custom';
      costume = 'reindeer';
      color = 'bg-amber-800';
      heldWeapon = 'starlight_harness';
      lore = `Supersonic flight squadron member capable of navigating sub-zero blizzards at Mach 4 with enchanted starlight antlers.`;
    } else if (catIndex === 3) {
      // Holiday Countryballs (100)
      category = 'holiday_countryballs';
      const nation = NATIONS_FOR_BALLS[(i / 10 | 0) % NATIONS_FOR_BALLS.length];
      const edition = Math.floor((i - 1) / 10) + 1;
      name = `Holiday ${nation}ball #${edition}`;
      type = 'countryball';
      costume = (['santa', 'elf', 'reindeer', 'tree', 'gingerbread'] as const)[i % 5];
      color = 'bg-blue-600';
      heldWeapon = 'festive_flag';
      lore = `Celebrates national Christmas and Yule traditions with festive decorations, holiday meals, and cultural pride.`;
    } else if (catIndex === 4) {
      // Frosted Sprunki (100)
      category = 'frosted_sprunki';
      const sprunkiBase = SPRUNKI_HOLIDAY_ALIASES[(i / 10 | 0) % SPRUNKI_HOLIDAY_ALIASES.length];
      const track = Math.floor((i - 1) / 10) + 1;
      name = `${sprunkiBase} (Track ${track})`;
      type = 'sprnuki';
      costume = 'tree';
      color = 'bg-teal-600';
      heldWeapon = 'jingle_mic';
      lore = `Brings upbeat rhythm loops and harmonious Christmas carols to the Sprunki beatbox stage.`;
    } else if (catIndex === 5) {
      // Roblox Winter (100)
      category = 'roblox_winter';
      const rClass = ROBLOX_WINTER_CLASSES[(i / 10 | 0) % ROBLOX_WINTER_CLASSES.length];
      const tier = Math.floor((i - 1) / 10) + 1;
      name = `${rClass} v${tier}.0`;
      type = 'roblox';
      costume = 'santa';
      color = 'bg-yellow-500';
      heldWeapon = 'diamond_sword';
      lore = `Equipped with classic Robloxian winter accessories, ready to dominate snowy obbies and holiday tycoon arenas.`;
    } else if (catIndex === 6) {
      // Minecraft Holiday (100)
      category = 'minecraft_holiday';
      const mcClass = MINECRAFT_HOLIDAY_CLASSES[(i / 10 | 0) % MINECRAFT_HOLIDAY_CLASSES.length];
      const realm = Math.floor((i - 1) / 10) + 1;
      name = `${mcClass} [Chunk ${realm}]`;
      type = 'minecraft';
      costume = (['snow_golem', 'tree', 'santa', 'elf'] as const)[i % 4];
      color = 'bg-cyan-600';
      heldWeapon = 'diamond_sword';
      lore = `Forged in blocky voxel realms beneath falling snow and decorated spruce biomes.`;
    } else if (catIndex === 7) {
      // Brand Holiday Ambassadors (100)
      category = 'brand_ambassadors';
      const brand = BRAND_HOLIDAY_TITLES[(i / 10 | 0) % BRAND_HOLIDAY_TITLES.length];
      const branch = Math.floor((i - 1) / 10) + 1;
      name = `${brand} (Station ${branch})`;
      type = 'custom';
      costume = 'gingerbread';
      color = 'bg-red-600';
      heldWeapon = 'brand_gift_box';
      lore = `Official holiday ambassador coordinating festive activities, community quests, and holiday rewards at brand hubs.`;
    } else if (catIndex === 8) {
      // Nutcrackers & Toy Soldiers (100)
      category = 'nutcrackers_toys';
      const rank = ['Cadet', 'Lieutenant', 'Captain', 'Major', 'General', 'Marshal', 'Commander', 'Grand Sentinel'][i % 8];
      const regiment = Math.floor((i - 1) / 10) + 1;
      name = `Nutcracker ${rank} Regiment ${regiment}`;
      type = 'custom';
      costume = 'nutcracker';
      color = 'bg-indigo-900';
      heldWeapon = 'ceremonial_saber';
      lore = `Impeccably polished wooden toy soldier guarding Santa's treasury against mischievous holiday imps.`;
    } else {
      // Yule Mythics & Frost Queens (100)
      category = 'yule_mythics';
      const mythic = ['Borealis Frost Queen', 'Krampus Warden', 'Yule Goat Elder', 'Sugar Plum Fairy', 'Frost Wyrm King', 'Snow Spirit Dryad', 'Starlight Seraph', 'Solstice Archon'][i % 8];
      const cycle = Math.floor((i - 1) / 10) + 1;
      name = `${mythic} (Cycle ${cycle})`;
      type = 'custom';
      costume = 'tree';
      color = 'bg-purple-900';
      heldWeapon = 'aurora_staff';
      lore = `Ancient mythic entity embodying the primordial beauty, winter chills, and magical wonders of the winter solstice.`;
    }

    const rarities: ChristmasCharacterRecord['rarity'][] = ['Common', 'Common', 'Rare', 'Rare', 'Epic', 'Epic', 'Legendary', 'Holiday Mythic'];
    const rarity = rarities[i % rarities.length];

    characters.push({
      id,
      name,
      christmasCategory: category,
      type,
      color,
      isChristmas: true,
      christmasCostume: costume,
      heldWeapon,
      description: lore,
      christmasLore: lore,
      rarity,
      holidayCheer: 50 + (i % 50),
      frostResistance: 40 + ((i * 3) % 60),
      sleighSpeed: 30 + ((i * 7) % 70),
      giftLuck: 20 + ((i * 11) % 80),
      unlockedByDefault: i <= 50 || rarity === 'Common'
    });
  }

  return characters;
};

export const CHRISTMAS_CHARACTERS_1000 = generate1000ChristmasCharacters();

// ============================================================================
// 2. 1,000 CHRISTMAS ITEMS
// ============================================================================

export interface ChristmasItemRecord {
  id: string;
  name: string;
  category: 'weapons_combat' | 'armor_apparel' | 'food_potions' | 'building_decor' | 'toys_collectibles';
  icon: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Holiday Mythic';
  cheerPower: number;
  tradeValue: number;
  description: string;
  isEquippable: boolean;
  itemType: 'weapon' | 'armor' | 'consumable' | 'block' | 'tool' | 'relic';
}

const WEAPON_PREFIXES = [
  'Enchanted Candy Cane', 'Frostbite Crystal', 'Snowball Blaster', 'Pine Needle', 'Icicle Piercer',
  'Starlight Beam', 'Jingle Bell Sledge', 'Peppermint Flail', 'Gingerbread Greatsword', 'Winter Solstice',
  'North Pole Aurora', 'Gilded Nutcracker', 'Glacial Shard', 'Sleigh Runner', 'Holly Wrath'
];

const WEAPON_TYPES = [
  'Broadsword', 'Spear', 'Crossbow', 'Staff', 'Warhammer', 'Daggers', 'Halberd', 'Bow', 'Blaster', 'Scythe'
];

const ARMOR_PARTS = [
  'Santa Velvet Cap', 'Golden Antler Crown', 'Aurora Mantle', 'Jingle Bell Boots', 'Frosted Chestplate',
  'Gingerbread Shield', 'Winter Fur Mittens', 'Starlight Pauldrons', 'Frost Guard Greaves', 'Holly Wreath Tiara'
];

const FOOD_NAMES = [
  'Spiced Eggnog of Swiftness', 'Hot Cocoa of Cozy Healing', 'Gingerbread Man of Might', 'Roasted Sugar Chestnuts',
  'Candy Cane Sugar Rush', 'Peppermint Marshmallow Puff', 'Yule Log Cake of Wisdom', 'Frosted Cranberry Tart',
  'Warm Mulled Cider', 'Frosted Butter Cookie of Luck'
];

const DECOR_NAMES = [
  'Twinkling Fairy Garland', 'Gilded Star Tree Topper', 'Frosted Pine Pillar', 'Candy Cane Arch Block',
  'Snowy Gingerbread Brick', 'Holiday Hearth Fireplace', 'Festive Stocking of Treats', 'Glazed Ice Lantern',
  'Poinsettia Flower Bed', 'Illuminated Snowflake Tile'
];

const TOY_NAMES = [
  'Clockwork Sleigh Express', 'Magic Multiverse Snowglobe', 'Music Box of Silent Night', 'Windup Toy Soldier',
  'Remote-Controlled Reindeer Drone', 'Golden Nutcracker Key', 'Mystery Wrapped Gift Parcel', 'Aurora Sleigh Bell',
  'Plushie Oggy Snowman', 'Bloxian Holiday Snow Cannon'
];

export const generate1000ChristmasItems = (): ChristmasItemRecord[] => {
  const items: ChristmasItemRecord[] = [];
  const total = 1000;

  for (let i = 1; i <= total; i++) {
    const id = `xmas_item_${i.toString().padStart(4, '0')}`;
    const catIndex = (i - 1) % 5;
    let name = '';
    let category: ChristmasItemRecord['category'] = 'weapons_combat';
    let icon = '🎁';
    let description = '';
    let isEquippable = false;
    let itemType: ChristmasItemRecord['itemType'] = 'relic';

    if (i === 1) {
      name = 'Steremy Flight Remote & Jet Turbine Summoner';
      category = 'weapons_combat';
      icon = '✈️';
      description = 'Direct wireless telemetry uplink to Jeremy the Jet Plane at Sodor Airport. Summons supersonic air support and holiday airdrops!';
      isEquippable = true;
      itemType = 'tool';
    } else if (i === 2) {
      name = 'Sodor Airport Supersonic Aviator Shades';
      category = 'armor_apparel';
      icon = '🕶️';
      description = 'Official polarized gold-tinted aviator sunglasses rated for Mach 4 high-altitude winter flights over Sodor.';
      isEquippable = true;
      itemType = 'armor';
    } else if (catIndex === 0) {
      // Weapons (200)
      category = 'weapons_combat';
      const pref = WEAPON_PREFIXES[(i / 5 | 0) % WEAPON_PREFIXES.length];
      const wType = WEAPON_TYPES[(i / 5 | 0) % WEAPON_TYPES.length];
      const tier = Math.floor((i - 1) / 5) + 1;
      name = `${pref} ${wType} +${tier}`;
      icon = ['🗡️', '🏹', '🪄', '🔨', '❄️', '⭐', '⚡'][i % 7];
      description = `Infused with crystalline frost and joyful holiday magic. Deals +${20 + (tier % 80)} Holiday damage.`;
      isEquippable = true;
      itemType = 'weapon';
    } else if (catIndex === 1) {
      // Armor & Apparel (200)
      category = 'armor_apparel';
      const piece = ARMOR_PARTS[(i / 5 | 0) % ARMOR_PARTS.length];
      const rank = Math.floor((i - 1) / 5) + 1;
      name = `${piece} (Ward Level ${rank})`;
      icon = ['👑', '🧥', '🥾', '🛡️', '🧤', '🪖'][i % 6];
      description = `Imbued with North Pole warmth and sub-zero frost resistance. Grants +${15 + (rank % 50)} Frost Armor.`;
      isEquippable = true;
      itemType = 'armor';
    } else if (catIndex === 2) {
      // Food & Potions (200)
      category = 'food_potions';
      const food = FOOD_NAMES[(i / 5 | 0) % FOOD_NAMES.length];
      const vintage = Math.floor((i - 1) / 5) + 1;
      name = `${food} [Batch #${vintage}]`;
      icon = ['☕', '🍪', '🥛', '🍬', '🥧', '🍎'][i % 6];
      description = `Delicious holiday delicacy baked in Mrs. Claus' bakery. Restores full hunger and grants 5m buffs.`;
      isEquippable = false;
      itemType = 'consumable';
    } else if (catIndex === 3) {
      // Building Blocks & Decor (200)
      category = 'building_decor';
      const decor = DECOR_NAMES[(i / 5 | 0) % DECOR_NAMES.length];
      const variation = Math.floor((i - 1) / 5) + 1;
      name = `${decor} (Design #${variation})`;
      icon = ['🎄', '🌟', '🧱', '🏮', '🕯️', '🎀', '🌺'][i % 7];
      description = `Placeable decorative element that increases surrounding territory Holiday Cheer by +${10 + (variation % 40)}.`;
      isEquippable = true;
      itemType = 'block';
    } else {
      // Toys & Collectibles (200)
      category = 'toys_collectibles';
      const toy = TOY_NAMES[(i / 5 | 0) % TOY_NAMES.length];
      const serial = Math.floor((i - 1) / 5) + 1;
      name = `${toy} [Serial #${serial}]`;
      icon = ['🚂', '🔮', '🧸', '📦', '🔔', '🪀'][i % 6];
      description = `Limited edition collector item crafted during the Winter Solstice. Can be traded or displayed in Brand Hubs.`;
      isEquippable = true;
      itemType = 'relic';
    }

    const rarities: ChristmasItemRecord['rarity'][] = ['Common', 'Common', 'Rare', 'Rare', 'Epic', 'Epic', 'Legendary', 'Holiday Mythic'];
    const rarity = rarities[i % rarities.length];

    items.push({
      id,
      name,
      category,
      icon,
      rarity,
      cheerPower: 25 + (i % 75),
      tradeValue: 10 + (i * 3),
      description,
      isEquippable,
      itemType
    });
  }

  return items;
};

export const CHRISTMAS_ITEMS_1000 = generate1000ChristmasItems();

// ============================================================================
// 3. 1,000 CHRISTMAS SETTINGS
// ============================================================================

export interface ChristmasSettingRecord {
  id: string;
  key: string;
  label: string;
  domain: 
    | 'snow_blizzard_physics'
    | 'sky_aurora_shaders'
    | 'festive_lighting_glow'
    | 'holiday_audio_soundscape'
    | 'gameplay_world_buffs'
    | 'brand_hub_holiday_decor'
    | 'ui_hud_camera_skins'
    | 'accessibility_performance';
  type: 'boolean' | 'slider' | 'select' | 'color';
  defaultValue: any;
  currentValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  description: string;
}

const SETTING_DOMAINS: {
  domain: ChristmasSettingRecord['domain'];
  label: string;
  count: number;
  aspects: string[];
}[] = [
  {
    domain: 'snow_blizzard_physics',
    label: 'Snow & Blizzard Physics',
    count: 200,
    aspects: [
      'Flake Density', 'Fall Velocity', 'Wind Swirl Intensity', 'Ground Snow Accumulation',
      'Snowflake Crystal Geometry', 'Footstep Crunch Depth', 'Melt Time Rate', 'Blizzard Visibility Fade',
      'Snow Drift Horizon Angle', 'Sub-Zero Frost Particle Turbulence'
    ]
  },
  {
    domain: 'sky_aurora_shaders',
    label: 'Sky & Aurora Borealis Shaders',
    count: 150,
    aspects: [
      'Aurora Wave Amplitude', 'Emerald-Magenta Ribbon Blend', 'Starlight Twinkle Speed', 'Solstice Moon Luminescence',
      'Winter Twilight Horizon Fog', 'Shooting Star Frequency', 'Cosmic Dust Shimmer', 'Frost Cloud Density',
      'Midnight Celestial Glow', 'Solar Wind Aurora Resonance'
    ]
  },
  {
    domain: 'festive_lighting_glow',
    label: 'Festive Lighting & Holiday Glow',
    count: 150,
    aspects: [
      'Christmas Tree String Blink Frequency', 'Warm Fireplace Hearth Radius', 'Gold Lantern Bioluminescence',
      'Candy Cane Highway Glow', 'Candle Flicker Jitter', 'Holiday Rim-Lighting Shader Warmth',
      'Star Tree Topper Ray Tracing', 'Glowstone Frost Hue', 'Stained Glass Reflection Intensity', 'Icicle Specular Highlight'
    ]
  },
  {
    domain: 'holiday_audio_soundscape',
    label: 'Holiday Audio & Soundscapes',
    count: 150,
    aspects: [
      'Jingle Bell Ambient Frequency', 'Fireplace Wood Crackle Volume', 'Carol Choir Reverb Decay',
      'Sleigh Flyby Doppler Pitch', 'Snow Footstep Crispness', 'Frost Breath Exhale Sound',
      'Ice Chime Wind Resonance', 'North Pole Radio Broadcast Fidelity', 'Holiday Disc Master Volume', 'Gift Opening Confetti Pop'
    ]
  },
  {
    domain: 'gameplay_world_buffs',
    label: 'Gameplay & World Holiday Modifiers',
    count: 150,
    aspects: [
      'Gift Drop Chance from Blocks', 'Eggnog Stamina Boost Multiplier', 'Snowball Knockback Force',
      'Elf Workshop Crafting Speed', 'Reindeer Mount Glide Duration', 'Holiday Cheer XP Multiplier',
      'Santa Sleigh Random Event Interval', 'Festive Boss Health Scaling', 'Frost Armor Durability Buff', 'Yule Log Rest Bonus'
    ]
  },
  {
    domain: 'brand_hub_holiday_decor',
    label: 'Brand Hub Holiday Decor Overrides',
    count: 100,
    aspects: [
      "McDonald's Golden Arches Candy Cane Striping", "McDonald's PlayPlace Snowball Pit Toggle",
      "Roblox Blox Plaza OOF-mas Bell Chimes", "Roblox Obby Frosted Stud Physics",
      "Xilam Cartoon Land Slapstick Snowballs", "Xilam Oggy Yule Log Fireplace Decor",
      "NZ Tarragower Carved Wharenui Winter Garland", "Tarragower Totara Hearth Warmth",
      "BP Clean Energy Aurora Wind Turbines", "New World Azoth Forge Winter Flame",
      "YouTube Creator Studio Holiday RGB Lights", "Sodor Airport Steremy Jet Contrail Density",
      "Sodor Airport Runway Landing Light Brightness", "Steremy Supersonic Sound-Barrier Boost FX"
    ]
  },
  {
    domain: 'ui_hud_camera_skins',
    label: 'UI, HUD & Camera Themes',
    count: 50,
    aspects: [
      'Candy Cane Health Bar Theme', 'Frosted Minimap Radar Glass', 'Mistletoe Notification Badges',
      'Snowflake Cursor Particle Trail', 'Christmas Ribbon Inventory Border', 'Holiday Font Accents',
      'Winter Vignette Screen Edge Fog', 'Present Gift Box Tooltip Styling'
    ]
  },
  {
    domain: 'accessibility_performance',
    label: 'Accessibility & Performance Optimizations',
    count: 50,
    aspects: [
      'Low-End Device Snowflake Particle Cap', 'Motion Sickness Snow Dampener', 'High-Contrast Candy Cane Lines',
      'Holiday Audio Chime Limiter', 'Screen Reader Festive Tagging', 'Photosensitive Light Strobe Blocker',
      'Dynamic LOD for Holiday Assets'
    ]
  }
];

export const generate1000ChristmasSettings = (): ChristmasSettingRecord[] => {
  const settings: ChristmasSettingRecord[] = [];
  let globalIndex = 1;

  for (const group of SETTING_DOMAINS) {
    for (let i = 1; i <= group.count; i++) {
      const id = `xmas_set_${globalIndex.toString().padStart(4, '0')}`;
      const aspect = group.aspects[(i - 1) % group.aspects.length];
      const subNumber = Math.floor((i - 1) / group.aspects.length) + 1;
      const key = `${group.domain}_${aspect.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${subNumber}`;
      const label = `${aspect} (Tier ${subNumber})`;

      let type: ChristmasSettingRecord['type'] = 'slider';
      let defaultValue: any = 50;
      let min = 0;
      let max = 100;
      let step = 1;

      if (i % 4 === 0) {
        type = 'boolean';
        defaultValue = true;
      } else if (i % 6 === 0) {
        type = 'color';
        defaultValue = i % 2 === 0 ? '#ef4444' : '#10b981';
      } else {
        type = 'slider';
        min = 0;
        max = 100;
        step = 1;
        defaultValue = 50 + (i % 40);
      }

      settings.push({
        id,
        key,
        label,
        domain: group.domain,
        type,
        defaultValue,
        currentValue: defaultValue,
        min,
        max,
        step,
        description: `Fine-tunes ${aspect.toLowerCase()} across all Christmas rendering pipelines and multiplayer sync channels.`
      });

      globalIndex++;
    }
  }

  return settings;
};

export const CHRISTMAS_SETTINGS_1000 = generate1000ChristmasSettings();

// ============================================================================
// PRESET PACKS (Quick Switcher)
// ============================================================================

export interface ChristmasPresetPack {
  id: string;
  name: string;
  icon: string;
  description: string;
  tags: string[];
}

export const CHRISTMAS_PRESET_PACKS: ChristmasPresetPack[] = [
  {
    id: 'cozy_hearth',
    name: 'Gentle Cozy Hearth',
    icon: '🔥',
    description: 'Warm glowing fireplace, soft falling snowflakes, crackling logs, and mellow acoustic carols.',
    tags: ['Relaxed', 'Warm Lighting', 'Gentle Snow']
  },
  {
    id: 'blizzard_wonderland',
    name: 'Winter Blizzard Wonderland',
    icon: '❄️',
    description: 'Dense whirling snow flurries, frosted terrain, sub-zero winds, and heavy winter coats.',
    tags: ['Intense Snow', 'Frost Shaders', 'Arctic Wind']
  },
  {
    id: 'cyber_north_pole',
    name: 'Hyper Cyber North Pole',
    icon: '⚡',
    description: 'Neon candy cane lasers, synthwave holiday beats, glowing RGB reindeers, and turbo sleighs.',
    tags: ['Neon Glow', 'High Tech', 'Synthwave']
  },
  {
    id: 'silent_night_aurora',
    name: 'Silent Night & Emerald Aurora',
    icon: '🌌',
    description: 'Breathtaking green and violet aurora ribbons stretching across a crystal clear midnight sky.',
    tags: ['Aurora Borealis', 'Starlight', 'Midnight']
  },
  {
    id: 'slapstick_holiday_chaos',
    name: 'Xilam & Roblox Holiday Party',
    icon: '🎉',
    description: 'Flying giant snowballs, comical boing springs, 2x gift drop rates, and fast-paced fun!',
    tags: ['Fast Paced', 'Party Mode', 'Double Rewards']
  }
];
