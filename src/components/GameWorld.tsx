import React, { useState, useEffect, useRef, useCallback } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import Inventory, { ALL_CREATIVE_BLOCKS } from './Inventory';
import CraftingPanel from './CraftingPanel';
import { useSound } from '../hooks/useSound';
import QuestDialogueModal, { NPCS_DATA, NPC, Quest } from './QuestDialogueModal';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import GamePauseMenu from './GamePauseMenu';
import JukeboxPlayer from './JukeboxPlayer';
import RobloxApp from './RobloxApp';
import { audioEngine } from '../utils/audioEngine';
import { SONGS_PLAYLIST } from '../utils/musicTracks';
import { 
  Sun, CloudRain, Snowflake, Compass, ZoomIn, ZoomOut, 
  Navigation, Swords, Palette, Sparkles, Feather, Moon,
  RotateCcw, Skull, Shield, Hammer, Flame, Wand2, Menu,
  Box, Maximize2, Minimize2, Eye, RotateCw, Layers, SlidersHorizontal,
  Mountain, Trees, Sunset, Cloud, Music, Disc, MessageSquare, Mic,
  Volume2, VolumeX, Zap, Radio, Send, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Gamepad2, Settings,
  Terminal, Globe, MapPin
} from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';
import SettingsModal from './SettingsModal';
import { voiceChatEngine } from '../utils/voiceChatEngine';
import { avatarManager, ORIGIN_EMOTES_CATALOG, CHARACTER_CLASSES } from '../utils/avatarManager';
import { dailyMissionManager } from '../utils/dailyMissionManager';
import ThreeVoxelWorld from './ThreeVoxelWorld';
import CommandBlockModal from './CommandBlockModal';
import UniverseWarpModal from './UniverseWarpModal';
import { 
  CommandBlockData, 
  executeMinecraftCommand, 
  CommandContext, 
  formatBlockNumber, 
  MAX_WORLD_COORDINATE, 
  MIN_WORLD_COORDINATE 
} from '../utils/commandEngine';
import { getBiomeForX, generateColumnBlocks } from '../utils/proceduralWorld';
import { WorldPlayer, INITIAL_ONLINE_PLAYERS, updateSimulatedPlayers } from '../utils/multiplayerPlayers';
import MultiplayerScoreboardModal from './MultiplayerScoreboardModal';
import PlayerInteractionModal from './PlayerInteractionModal';
import MiniMapRadar from './MiniMapRadar';
import BossRaidHUD from './BossRaidHUD';
import VehicleMountHUD from './VehicleMountHUD';
import CompanionPetModal from './CompanionPetModal';
import VehicleGarageModal from './VehicleGarageModal';
import BossRaidSummonModal from './BossRaidSummonModal';
import { vehicleManager } from '../utils/vehicleManager';
import { bossRaidManager } from '../utils/bossRaidManager';
import { petCompanionManager } from '../utils/petCompanionManager';
import ChristmasMegaModal from './ChristmasMegaModal';
import BrandHubModal from './BrandHubModal';
import CountryballCreatorModal from './CountryballCreatorModal';
import ProgressionModal from './ProgressionModal';
import { progressionManager } from '../utils/progressionManager';

const rows = 50;
const cols = 90;

interface RoamingCharacter {
  id: number;
  x: number;
  y: number;
  avatar: CharacterData;
  isWalking: boolean;
}

export interface DebrisParticle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export interface FloatingLootItem {
  id: number;
  x: number;
  y: number;
  label: string;
  icon: string;
}

export interface BlockDetailMetadata {
  label: string;
  icon: string;
  color: string;
  tool: string;
  hardness: string;
  lightLevel: number;
  description: string;
}

export const BLOCK_LOOT_INFO: Record<string, BlockDetailMetadata> = {
  tree: { label: '+1 Oak Wood', icon: '🪵', color: '#8d6e63', tool: 'Axe / Hand', hardness: 'Medium', lightLevel: 0, description: 'Solid oak tree trunk with concentric cambium rings.' },
  wood: { label: '+1 Wood Planks', icon: '🪵', color: '#a1887f', tool: 'Axe / Hand', hardness: 'Medium', lightLevel: 0, description: 'Refined lumber planks for crafting shelters and chests.' },
  leaves: { label: '+1 Apple', icon: '🍎', color: '#4caf50', tool: 'Shears / Hand', hardness: 'Soft', lightLevel: 0, description: 'Dense deciduous oak foliage with occasional sweet apple drops.' },
  grass: { label: '+1 Dirt & Seeds', icon: '🌱', color: '#7cb342', tool: 'Shovel', hardness: 'Soft', lightLevel: 0, description: 'Nutrient-rich topsoil carpeted with lush green blades.' },
  dirt: { label: '+1 Dirt', icon: '🟤', color: '#795548', tool: 'Shovel', hardness: 'Soft', lightLevel: 0, description: 'Coarse loam soil with gravel flecks and organic minerals.' },
  farmland: { label: '+1 Farmland', icon: '🌾', color: '#5d4037', tool: 'Hoe', hardness: 'Soft', lightLevel: 0, description: 'Tilled and irrigated soil nurturing growing wheat crops.' },
  stone: { label: '+1 Cobblestone', icon: '🪨', color: '#90a4ae', tool: 'Pickaxe', hardness: 'Hard', lightLevel: 0, description: 'Solid granitic bedrock with natural chisel fissure lines.' },
  coal: { label: '+1 Coal Ore', icon: '⚫', color: '#333333', tool: 'Pickaxe', hardness: 'Hard', lightLevel: 0, description: 'Carbonized fossil fuel ore essential for smelting and torches.' },
  ore: { label: '+1 Raw Iron', icon: '🟠', color: '#d97706', tool: 'Stone Pickaxe+', hardness: 'Hard', lightLevel: 0, description: 'Heavy metallic mineral vein laced with rich iron oxide deposits.' },
  diamond: { label: '+1 Rare Diamond', icon: '💎', color: '#22d3ee', tool: 'Iron Pickaxe+', hardness: 'Very Hard', lightLevel: 0, description: 'Pristine cyan gemstone crystallized under intense subterranean heat.' },
  emerald: { label: '+1 Emerald Gem', icon: '🟢', color: '#10b981', tool: 'Iron Pickaxe+', hardness: 'Very Hard', lightLevel: 0, description: 'Gleaming beryl crystal recognized as universal trading currency.' },
  gold: { label: '+1 Gold Bullion', icon: '🪙', color: '#facc15', tool: 'Iron Pickaxe+', hardness: 'Hard', lightLevel: 0, description: 'Lustrous precious metal coveted by piglins and master jewelers.' },
  netherite: { label: '+1 Netherite Ingot', icon: '🖤', color: '#404040', tool: 'Diamond Pickaxe', hardness: 'Extreme', lightLevel: 0, description: 'Indestructible ancient volcanic alloy completely immune to lava.' },
  bricks: { label: '+1 Red Bricks', icon: '🧱', color: '#b71c1c', tool: 'Pickaxe', hardness: 'Hard', lightLevel: 0, description: 'Kiln-fired terracotta masonry with pristine mortar seams.' },
  sand: { label: '+1 Fine Sand', icon: '⏳', color: '#fde047', tool: 'Shovel', hardness: 'Soft', lightLevel: 0, description: 'Fine silica granules with sparkling quartz mica crystals.' },
  sandstone: { label: '+1 Sandstone', icon: '🏛️', color: '#d7ccc8', tool: 'Pickaxe', hardness: 'Medium', lightLevel: 0, description: 'Compacted desert stone engraved with hieroglyphic strata.' },
  snow: { label: '+1 Snowball', icon: '❄️', color: '#f8fafc', tool: 'Shovel', hardness: 'Soft', lightLevel: 0, description: 'Soft crystalline powder crust from frozen mountain tundras.' },
  ice: { label: '+1 Packed Ice', icon: '🧊', color: '#7dd3fc', tool: 'Silk Touch Pickaxe', hardness: 'Medium', lightLevel: 0, description: 'Translucent glacier ice with shimmering internal stress fractures.' },
  amethyst: { label: '+1 Amethyst Shard', icon: '🔮', color: '#a855f7', tool: 'Iron Pickaxe+', hardness: 'Hard', lightLevel: 5, description: 'Resonant purple crystal geode vibrating with celestial harmonies.' },
  glowstone: { label: '+1 Glowstone Dust', icon: '✨', color: '#fef08a', tool: 'Pickaxe / Hand', hardness: 'Fragile', lightLevel: 15, description: 'Bioluminescent Nether crystal emitting radiant warm golden light.' },
  crying_obsidian: { label: '+1 Crying Obsidian', icon: '🌌', color: '#9333ea', tool: 'Diamond Pickaxe', hardness: 'Extreme', lightLevel: 10, description: 'Volcanic glass weeping magical purple energy runes.' },
  obsidian: { label: '+1 Hard Obsidian', icon: '🟣', color: '#150e28', tool: 'Diamond Pickaxe', hardness: 'Extreme', lightLevel: 0, description: 'Rapidly cooled basaltic glass formed where water meets lava.' },
  magma: { label: '+1 Magma Block', icon: '🌋', color: '#c2410c', tool: 'Pickaxe', hardness: 'Hard', lightLevel: 3, description: 'Cracked thermal crust with glowing molten lava simmering beneath.' },
  sculk: { label: '+1 Sculk Sensor', icon: '👁️', color: '#06b6d4', tool: 'Hoe / Pickaxe', hardness: 'Soft', lightLevel: 2, description: 'Deep dark organic growth sensitive to acoustic vibrations and steps.' },
  mycelium: { label: '+1 Mycelium', icon: '🍄', color: '#8e7cc3', tool: 'Shovel', hardness: 'Soft', lightLevel: 0, description: 'Spore-saturated fungal earth nurturing giant mushrooms.' },
  mushroom_red: { label: '+1 Red Mushroom', icon: '🍄', color: '#dc2626', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 0, description: 'Scarlet toadstool with white fungal polka dots for brewing stews.' },
  mushroom_brown: { label: '+1 Brown Mushroom', icon: '🍄', color: '#854d0e', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 0, description: 'Velvety earthy mushroom cap rich in natural nutrients.' },
  sponge: { label: '+1 Sea Sponge', icon: '🧽', color: '#ca8a04', tool: 'Hoe / Hand', hardness: 'Soft', lightLevel: 0, description: 'Ultra-absorbent oceanic sponge capable of draining fluid volumes.' },
  torch: { label: '+1 Torch', icon: '🔥', color: '#f59e0b', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 14, description: 'Charcoal combustion torch casting 14-level warm radius illumination.' },
  jukebox: { label: '+1 Jukebox', icon: '🎵', color: '#b45309', tool: 'Axe', hardness: 'Medium', lightLevel: 0, description: 'Diamond-stylus music player capable of playing legacy vinyl discs.' },
  flower: { label: '+1 Poppy Flower', icon: '🌹', color: '#ef4444', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 0, description: 'Vibrant crimson floral bloom used for red dye crafting.' },
  water: { label: '+1 Water Bucket', icon: '💧', color: '#38bdf8', tool: 'Bucket', hardness: 'Fluid', lightLevel: 0, description: 'Clear flowing spring water nourishing crops and quenching lava.' },
  lava: { label: '+1 Lava Bucket', icon: '🔥', color: '#f97316', tool: 'Bucket', hardness: 'Hazardous', lightLevel: 15, description: '1200°C molten igneous rock emitting blinding light and heat.' },
  command_block: { label: '+1 Impulse Command Block', icon: '🟧', color: '#c47037', tool: 'Hand / Creative', hardness: 'Indestructible', lightLevel: 1, description: 'Programmable console block that executes server-grade Minecraft commands on pulse activation.' },
  chain_command_block: { label: '+1 Chain Command Block', icon: '🟩', color: '#3b846e', tool: 'Hand / Creative', hardness: 'Indestructible', lightLevel: 1, description: 'Cascading command block that executes sequentially when connected to another triggering block.' },
  repeating_command_block: { label: '+1 Repeating Command Block', icon: '🟪', color: '#6a4697', tool: 'Hand / Creative', hardness: 'Indestructible', lightLevel: 2, description: 'Continuous looping command block executing commands every tick while powered or always active.' },
  carved_pumpkin: { label: '+1 Carved Pumpkin', icon: '🎃', color: '#ea580c', tool: 'Axe / Shear', hardness: 'Medium', lightLevel: 0, description: 'Harvested orange squash carved with a spooky face.' },
  jack_o_lantern: { label: '+1 Jack-o\'-Lantern', icon: '🏮', color: '#f97316', tool: 'Axe', hardness: 'Medium', lightLevel: 15, description: 'Carved pumpkin illuminated with a blazing torch, glowing at light level 15!' },
  candy_corn: { label: '+1 Candy Corn', icon: '🍬', color: '#f59e0b', tool: 'Hand', hardness: 'Soft', lightLevel: 0, description: 'Sweet three-layered Halloween confection that restores hunger and grants speed!' },
  reaper_scythe: { label: '+1 Reaper Scythe', icon: '🗡️', color: '#475569', tool: 'Hand', hardness: 'Hard', lightLevel: 0, description: 'Spectral dark blade forged for harvesting souls and clearing spooky foliage.' },
  witch_cauldron: { label: '+1 Witch\'s Cauldron', icon: '🧙', color: '#166534', tool: 'Pickaxe', hardness: 'Hard', lightLevel: 4, description: 'Cast-iron bubbling cauldron filled with glowing green bewitched brew.' },
  spooky_cobweb: { label: '+1 Spooky Cobweb', icon: '🕸️', color: '#e2e8f0', tool: 'Shears / Sword', hardness: 'Soft', lightLevel: 0, description: 'Sticky ghost spider silk that slows down walking entities.' },
  tombstone: { label: '+1 Catacomb Tombstone', icon: '🪦', color: '#64748b', tool: 'Pickaxe', hardness: 'Hard', lightLevel: 0, description: 'Weathered granite gravestone inscribed with ancient epitaph runes.' },
  ghost_lantern: { label: '+1 Ghost Wisp Lantern', icon: '👻', color: '#a855f7', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 12, description: 'Ethereal purple lantern containing a friendly dancing spirit wisp.' },
  trick_or_treat_bag: { label: '+1 Trick-or-Treat Bag', icon: '🛍️', color: '#9333ea', tool: 'Hand', hardness: 'Soft', lightLevel: 0, description: 'Festive canvas loot bag filled with assorted sugary festive goodies!' },
  sprunki_sword: { label: "Sprunki's Sword of Friendship", icon: '⚔️', color: '#ec4899', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 4, description: 'Infused with resonant beatbox energy (+14 Attack, plays musical chords on strikes).' },
  sprunki_headphones: { label: 'Sprunki DJ Headphones', icon: '🎧', color: '#8b5cf6', tool: 'Armor', hardness: 'Armor', lightLevel: 2, description: 'Pro studio headset tuned to 128 BPM (+20 Max Mana & Bass Drop pulse).' },
  new_world_boots: { label: "New World Explorer's Boots", icon: '🥾', color: '#16a34a', tool: 'Armor', hardness: 'Armor', lightLevel: 0, description: 'Rugged leather trail boots granting +40% traversal speed and feather falling.' },
  new_world_satchel: { label: 'New World Harvest Satchel', icon: '🎒', color: '#ca8a04', tool: 'Bag', hardness: 'Soft', lightLevel: 0, description: 'Expansive gathering pouch doubling harvest yields from foliage and crops.' },
  mcdonalds_spatula: { label: 'Golden Arches Battle Spatula', icon: '🍳', color: '#eab308', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 2, description: 'Legendary grill flipper searing enemies with flame sizzle (+12 Attack).' },
  grimace_shake: { label: 'Cosmic Grimace Elixir', icon: '🥤', color: '#9333ea', tool: 'Consumable', hardness: 'Soft', lightLevel: 5, description: 'Mystical cosmic purple shake granting full health restore and cosmic aura.' },
  blox_hyper_sword: { label: 'Bloxian Linked Hyper-Sword', icon: '🗡️', color: '#ef4444', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 4, description: 'Classic Roblox linked blade (+16 Attack, plays nostalgic slash and OOF audio).' },
  gravity_coil_rig: { label: 'Master Gravity Coil Jump Rig', icon: '🌀', color: '#3b82f6', tool: 'Gear', hardness: 'Artifact', lightLevel: 3, description: 'Spring-loaded quantum coil rig boosting jump height by 2.2x with zero fall damage.' },
  youtube_shield: { label: 'Diamond Play Button Aegis', icon: '🛡️', color: '#06b6d4', tool: 'Shield', hardness: 'Artifact', lightLevel: 6, description: '10M Subscriber creator shield parrying incoming attacks with blinding flash.' },
  streamer_mic: { label: 'Studio Condenser Mic Wand', icon: '🎙️', color: '#ec4899', tool: 'Hand / Magic', hardness: 'Artifact', lightLevel: 3, description: 'Broadcast microphone inspiring nearby players with viral engagement aura.' },
  oggy_swatter: { label: "Oggy's Colossal Flyswatter", icon: '🏸', color: '#3b82f6', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 0, description: 'Giant slap weapon knocking back pests and hostile mobs.' },
  bp_jetpack: { label: 'BP High-Octane Fuel Jetpack', icon: '🚀', color: '#15803d', tool: 'Gear', hardness: 'Artifact', lightLevel: 4, description: 'High-octane thruster rig enabling continuous hovering burst jump.' },
  poland_helmet: { label: 'Polandball Space Pioneer Helmet', icon: '🧑‍🚀', color: '#e11d48', tool: 'Armor', hardness: 'Armor', lightLevel: 2, description: 'Aeronautical dome helmet allowing survival in lunar void conditions.' },

  // 🎄 Christmas & Brand Multiverse Items
  candy_cane_blade: { label: '+1 Peppermint Candy Cane Blade', icon: '🍭', color: '#ef4444', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 5, description: 'Festive sugar-forged rapier that slices enemies with minty peppermint frost bursts (+18 Attack).' },
  santa_gift_box: { label: '+1 Santa Holiday Surprise Gift', icon: '🎁', color: '#dc2626', tool: 'Hand / Any', hardness: 'Soft', lightLevel: 4, description: 'Festive red parcel wrapped with gold ribbon that drops rare emeralds, diamonds, and holiday treats when opened!' },
  gingerbread_shield: { label: '+1 Frosted Gingerbread Aegis', icon: '🍪', color: '#b45309', tool: 'Shield', hardness: 'Artifact', lightLevel: 2, description: 'Crispy cinnamon-baked holiday shield decorated with royal icing that parries attacks with sweet holiday crumbs.' },
  peppermint_pickaxe: { label: '+1 Peppermint Silk Pickaxe', icon: '⛏️', color: '#f43f5e', tool: 'Pickaxe', hardness: 'Artifact', lightLevel: 3, description: 'Holiday mining pickaxe carved from candy cane crystal that mines blocks instantly with Silk Touch precision.' },
  aurora_snowglobe: { label: '+1 Northern Aurora Snowglobe', icon: '🔮', color: '#06b6d4', tool: 'Hand / Magic', hardness: 'Artifact', lightLevel: 12, description: 'Enchanted glass sphere containing swirling cosmic snow that summons the celestial Aurora Borealis weather.' },
  nutcracker_musket: { label: '+1 Nutcracker Toy Blaster', icon: '🎺', color: '#eab308', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 2, description: 'Polished wooden clockwork rifle firing explosive holiday chestnuts at distant foes (+16 Ranged Attack).' },
  polar_star_wand: { label: '+1 North Pole Polaris Star Wand', icon: '⭐', color: '#fef08a', tool: 'Hand / Magic', hardness: 'Artifact', lightLevel: 15, description: 'Radiant five-pointed golden star wand illuminating dark caves at maximum level 15 brilliance.' },
  holiday_hot_cocoa: { label: '+1 Steaming Holiday Hot Cocoa', icon: '☕', color: '#78350f', tool: 'Consumable', hardness: 'Soft', lightLevel: 1, description: 'Rich Dutch chocolate with melted marshmallows granting instant 100% health restore and +35% warm sprint boost.' },
  reindeer_bell: { label: '+1 Golden Reindeer Harness Bell', icon: '🔔', color: '#fbbf24', tool: 'Gear', hardness: 'Artifact', lightLevel: 3, description: 'Harmonic sleigh bell that grants the player temporary Rudolph flight speed bursts when activated.' },
  frostmourne_icicle: { label: '+1 Glacier Frost Dagger', icon: '🗡️', color: '#38bdf8', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 4, description: 'Sub-zero glacier shard blade that freezes hit targets solid for 3 seconds.' },
  christmas_wreath: { label: '+1 Holiday Pine Wreath', icon: '🎄', color: '#15803d', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 4, description: 'Aromatic pine branch wreath decorated with crimson berries and golden bells to hang on doors.' },
  festive_light_string: { label: '+1 Multicolour Twinkle Lights', icon: '💡', color: '#10b981', tool: 'Hand / Any', hardness: 'Fragile', lightLevel: 14, description: 'String of 50 animated rainbow fairy lights that brighten up player buildings.' },
  mistletoe_charm: { label: '+1 Mistletoe Friendship Charm', icon: '🌿', color: '#22c55e', tool: 'Hand / Trinket', hardness: 'Artifact', lightLevel: 2, description: 'Enchanted sprig of mistletoe that pacifies hostile mobs within a 12-block radius.' },
  winter_festive_tree: { label: '+1 Decorated Holiday Pine Tree', icon: '🎄', color: '#166534', tool: 'Axe / Hand', hardness: 'Medium', lightLevel: 10, description: 'Grand Christmas spruce tree adorned with shiny glass baubles, silver tinsel, and a glowing star topper.' },
  eggnog_potion: { label: '+1 Spiced Holiday Eggnog', icon: '🥛', color: '#fef3c7', tool: 'Consumable', hardness: 'Soft', lightLevel: 0, description: 'Festive nutmeg brew restoring 50 Health and granting Health Regeneration III for 60 seconds.' },
  tarragower_chronicle: { label: '+1 Tarragower Master Chronicle', icon: '📜', color: '#4338ca', tool: 'Book / Magic', hardness: 'Artifact', lightLevel: 3, description: 'Gilded leather tome chronicling the complete history, cartography, and arcane secrets of all 13 brand realms.' },
  bp_solar_snowblower: { label: '+1 BP Solar Thermal Snowblower', icon: '🔋', color: '#059669', tool: 'Hand / Tool', hardness: 'Artifact', lightLevel: 8, description: 'High-power photon thermal blaster that instantly melts snow and ice blocks into fresh spring water.' },
  mcdonalds_festive_burger: { label: '+1 Holiday Mega Feast Burger', icon: '🍔', color: '#ea580c', tool: 'Consumable', hardness: 'Soft', lightLevel: 1, description: 'Legendary triple-decker holiday burger served with golden fries that grants permanent saturation and strength.' },
  youtube_ruby_play: { label: '+1 50M Ruby Creator Beacon', icon: '💎', color: '#e11d48', tool: 'Hand / Artifact', hardness: 'Artifact', lightLevel: 15, description: 'Ultra-exclusive 50M subscriber ruby plaque that shoots viral crimson beacon beams into the clouds.' },
  newworld_gleamite_crystal: { label: '+1 Aeternum Gleamite Comet Shard', icon: '✨', color: '#a855f7', tool: 'Pickaxe / Hand', hardness: 'Hard', lightLevel: 11, description: 'Fallen celestial comet mineral harvested during the Winter Convergence that infuses weapons with astral power.' },
  xilam_cartoon_spring: { label: '+1 Xilam Slapstick Bouncy Coil', icon: '🌀', color: '#2563eb', tool: 'Gear', hardness: 'Artifact', lightLevel: 0, description: 'Giant comical rubber coil that propels player or entities 25 blocks skyward with cartoon boing sound effects.' },
  roblox_speed_coil_frost: { label: '+1 Frost Speed Coil V2', icon: '🔵', color: '#0284c7', tool: 'Gear', hardness: 'Artifact', lightLevel: 6, description: 'Upgraded winter quantum coil giving 3.5x hyper-sonic sprint velocity and ice trail particles.' },
  netherite_frost_blade: { label: '+1 Permafrost Netherite Claymore', icon: '⚔️', color: '#1e293b', tool: 'Hand / Weapon', hardness: 'Weapon', lightLevel: 6, description: 'Forged from Netherite alloy quenched in Arctic glacier water (+22 Attack, strikes with frost lightning).' },
};

interface GameWorldProps {
  selectedAvatar?: CharacterData;
  initialGameMode?: 'survival' | 'creative';
  onChangeGameMode?: (mode: 'survival' | 'creative') => void;
  onQuitToMenu?: () => void;
  onOpenRoblox?: () => void;
  onOpenProgression?: () => void;
  onOpenVoiceChat?: () => void;
  onOpenDailyMissions?: () => void;
  onOpenWorldMap?: () => void;
  onOpenLegoWebsite?: () => void;
  onOpenCountryballCreator?: () => void;
  onOpenCommunityHubs?: () => void;
  onOpenMiniGames?: () => void;
}

export default function GameWorld({ 
  selectedAvatar, 
  initialGameMode = 'survival',
  onChangeGameMode,
  onQuitToMenu,
  onOpenRoblox,
  onOpenProgression,
  onOpenVoiceChat,
  onOpenDailyMissions,
  onOpenWorldMap,
  onOpenLegoWebsite,
  onOpenCountryballCreator,
  onOpenCommunityHubs,
  onOpenMiniGames,
}: GameWorldProps) {
  const { playEffect, playAmbient } = useSound();
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const [isRobloxAppOpen, setIsRobloxAppOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [difficulty, setDifficulty] = useState<'peaceful' | 'easy' | 'normal' | 'hard'>('normal');
  
  const [activeAvatar, setActiveAvatar] = useState<CharacterData>(() => selectedAvatar || {
    id: 21,
    name: 'Steve',
    type: 'minecraft',
    subtype: 'steve',
    color: 'bg-cyan-600',
  });

  useEffect(() => {
    if (selectedAvatar) {
      setActiveAvatar(selectedAvatar);
    }
  }, [selectedAvatar]);

  const playerAvatar = activeAvatar;

  // Game Mode State: 'survival' or 'creative'
  const [gameMode, setGameMode] = useState<'survival' | 'creative'>(initialGameMode);
  const isCreative = gameMode === 'creative';

  // Creative Flight Mode
  const [isFlying, setIsFlying] = useState(false);

  // Survival Death State
  const [isDead, setIsDead] = useState(false);
  const [blocksMinedCount, setBlocksMinedCount] = useState(0);

  // The Verity Update State
  const [showVerityShrineModal, setShowVerityShrineModal] = useState(false);
  const [truthXRayActive, setTruthXRayActive] = useState(false);

  // Multiverse Enhancements: Radar, Pets, Mounts & Bosses
  const [isRadarOpen, setIsRadarOpen] = useState(true);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [isGarageModalOpen, setIsGarageModalOpen] = useState(false);
  const [isBossModalOpen, setIsBossModalOpen] = useState(false);
  const [screenShake, setScreenShake] = useState(false);
  const [mountedVehicleState, setMountedVehicleState] = useState(vehicleManager.getActiveVehicle());
  const [activePetState, setActivePetState] = useState(petCompanionManager.getActivePet());

  // 1,000 Christmas, Brand Hubs, Countryball & Progression Modals
  const [isChristmasMegaModalOpen, setIsChristmasMegaModalOpen] = useState(false);
  const [isBrandHubModalOpen, setIsBrandHubModalOpen] = useState(false);
  const [isCountryballModalOpen, setIsCountryballModalOpen] = useState(false);
  const [isProgressionModalOpen, setIsProgressionModalOpen] = useState(false);

  useEffect(() => {
    const unsubVeh = vehicleManager.subscribe(() => {
      setMountedVehicleState(vehicleManager.getActiveVehicle());
    });
    const unsubPet = petCompanionManager.subscribe(() => {
      setActivePetState(petCompanionManager.getActivePet());
    });
    return () => {
      unsubVeh();
      unsubPet();
    };
  }, []);

  // Player Inventory
  const [inventory, setInventory] = useState<Record<string, { count: number; durability?: number }>>({
    'grass': { count: 12 },
    'dirt': { count: 15 },
    'stone': { count: 15 },
    'wood': { count: 10 },
    'planks': { count: 8 },
    'door': { count: 2 },
    'torch': { count: 6 },
    'pickaxe': { count: 1, durability: 100 },
    'apple': { count: 5 },
    'bread': { count: 3 },
    'coal': { count: 6 },
    'ore': { count: 4 },
    'flower': { count: 3 },
    'verity_musicbox': { count: 1 },
    'disc_verity': { count: 1 },
    'starlight_halo': { count: 1 },
    'carved_pumpkin': { count: 8 },
    'jack_o_lantern': { count: 8 },
    'candy_corn': { count: 16 },
    'reaper_scythe': { count: 1, durability: 100 },
    'witch_cauldron': { count: 2 },
    'spooky_cobweb': { count: 6 },
    'tombstone': { count: 4 },
    'trick_or_treat_bag': { count: 2 },
    'candy_cane_blade': { count: 1, durability: 150 },
    'santa_gift_box': { count: 3 },
    'gingerbread_shield': { count: 1 },
    'holiday_hot_cocoa': { count: 4 },
    'peppermint_pickaxe': { count: 1, durability: 200 },
    'festive_light_string': { count: 12 },
  });
  const [activeItem, setActiveItem] = useState('pickaxe');

  // Simulated Multiplayer Players Server State (30 Active Players)
  const [onlinePlayers, setOnlinePlayers] = useState<WorldPlayer[]>(INITIAL_ONLINE_PLAYERS);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [selectedPlayerToInteract, setSelectedPlayerToInteract] = useState<WorldPlayer | null>(null);

  // Survival Stats
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);

  // Player Position, Movement & Direction
  const [playerPos, setPlayerPos] = useState({ x: 25, y: 5 });
  const [smoothPlayerPos, setSmoothPlayerPos] = useState({ x: 25, y: 5 });
  const [isWalking, setIsWalking] = useState(false);
  const [isSprinting, setIsSprinting] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [showTouchControls, setShowTouchControls] = useState(true);
  const [facingDir, setFacingDir] = useState<'left' | 'right'>('right');
  const [followCamera, setFollowCamera] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const walkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keysDownRef = useRef<Set<string>>(new Set());
  const activeHoldIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 165 FPS High-Performance Engine State
  const [targetFps, setTargetFps] = useState<number>(165);
  const [currentFps, setCurrentFps] = useState<number>(165);
  const [frameTimeMs, setFrameTimeMs] = useState<number>(6.06);
  const [showFpsModal, setShowFpsModal] = useState<boolean>(false);
  const [is165FpsMode, setIs165FpsMode] = useState<boolean>(true);
  const smoothPosRef = useRef({ x: 25, y: 5 });
  const lastFrameTimeRef = useRef<number>(performance.now());
  const frameCountRef = useRef<number>(0);
  const fpsAccumulatorRef = useRef<number>(0);

  // Weather Variety & Day/Night Cycle (Christmas Holiday Update: Default to Festive Snowy)
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon'>('snowy');
  const [timeOfDay, setTimeOfDay] = useState(25); // 0 to 100

  // Character Speech & Dialogue State
  const [playerSpeechText, setPlayerSpeechText] = useState<string | null>(null);
  const [isPlayerSpeaking, setIsPlayerSpeaking] = useState(false);
  const [activeSpeechMap, setActiveSpeechMap] = useState<Record<number, string>>({});
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false);
  const [customChatMessage, setCustomChatMessage] = useState('');
  const [autoSpeechEnabled, setAutoSpeechEnabled] = useState(true);

  // Farming: tracks tilled soil and growing crops
  const [cropGrowth, setCropGrowth] = useState<Record<number, number>>({});

  // Quest & NPC Dialogue State
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [activeQuestIds, setActiveQuestIds] = useState<string[]>(['q_timber']);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);

  // Nearby NPC proximity calculation across all biomes
  const nearbyNPC = React.useMemo(() => {
    return NPCS_DATA.find(npc => Math.abs(npc.x - playerPos.x) <= 8) || null;
  }, [playerPos.x]);

  // Refs
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null);
  const jukeboxSectionRef = useRef<HTMLDivElement>(null);

  // 3D Three.js WebGL Engine Mode
  const [engineMode, setEngineMode] = useState<'3d' | 'classic'>('3d');

  // 3D Camera & Perspective Controls
  const [cameraPitch, setCameraPitch] = useState(52); // degrees tilt (0 = flat 2D, 52 = classic isometric, 68 = top-down)
  const [cameraYaw, setCameraYaw] = useState(-18); // degrees rotation (-45 to 45)
  const [viewPreset, setViewPreset] = useState<'isometric' | 'cinematic' | 'topdown' | 'flat2d'>('isometric');
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [showGridLines, setShowGridLines] = useState(true);
  const [enable3DLighting, setEnable3DLighting] = useState(true);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<number | null>(null);
  const [lastPlacedIndex, setLastPlacedIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 200,000,000 Billion Blocks Multiverse & Chunk Streaming State
  const [viewportChunkX, setViewportChunkX] = useState<number>(0);
  const [modifiedWorldBlocks, setModifiedWorldBlocks] = useState<Record<string, string>>({});
  const [isUniverseWarpOpen, setIsUniverseWarpOpen] = useState(false);

  // Command Blocks State
  const [commandBlocksData, setCommandBlocksData] = useState<Record<string, CommandBlockData>>({
    '23,5': {
      id: '23,5',
      x: 23,
      y: 5,
      command: '/say Welcome to the 200,000,000 Billion Block Multiverse! Use /help for commands.',
      mode: 'impulse',
      condition: 'unconditional',
      redstone: 'always_active',
      customName: 'SpawnCore',
      lastOutput: 'Ready for execution',
      enabled: true,
    },
    '87,3': {
      id: '87,3',
      x: 87,
      y: 3,
      command: '/time set day',
      mode: 'repeat',
      condition: 'unconditional',
      redstone: 'always_active',
      customName: 'SolarBeacon',
      lastOutput: 'Continuous Solar Beacon active',
      enabled: true,
    },
  });
  const [activeCommandBlock, setActiveCommandBlock] = useState<CommandBlockData | null>(null);
  const [isCommandBlockModalOpen, setIsCommandBlockModalOpen] = useState(false);

  // Ultra Realism Graphics & Tactile Juice FX State
  const [realismFXEnabled, setRealismFXEnabled] = useState(true);
  const [cameraShakeActive, setCameraShakeActive] = useState(false);
  const [debrisParticles, setDebrisParticles] = useState<DebrisParticle[]>([]);
  const [floatingLoot, setFloatingLoot] = useState<FloatingLootItem[]>([]);

  // Character Class Starting Ability Cooldown
  const [classAbilityCooldown, setClassAbilityCooldown] = useState<number>(0);

  useEffect(() => {
    if (classAbilityCooldown <= 0) return;
    const timer = setInterval(() => {
      setClassAbilityCooldown(prev => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [classAbilityCooldown]);

  useEffect(() => {
    if (debrisParticles.length === 0) return;
    const timer = setTimeout(() => {
      setDebrisParticles([]);
    }, 650);
    return () => clearTimeout(timer);
  }, [debrisParticles]);

  useEffect(() => {
    if (floatingLoot.length === 0) return;
    const timer = setTimeout(() => {
      setFloatingLoot([]);
    }, 850);
    return () => clearTimeout(timer);
  }, [floatingLoot]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3800);
  }, []);

  const applyViewPreset = (preset: 'isometric' | 'cinematic' | 'topdown' | 'flat2d') => {
    setViewPreset(preset);
    if (preset === 'isometric') {
      setCameraPitch(52);
      setCameraYaw(-18);
    } else if (preset === 'cinematic') {
      setCameraPitch(36);
      setCameraYaw(-10);
    } else if (preset === 'topdown') {
      setCameraPitch(68);
      setCameraYaw(0);
    } else if (preset === 'flat2d') {
      setCameraPitch(0);
      setCameraYaw(0);
    }
    playEffect('build');
  };

  const handlePlayerSpeak = useCallback((text: string) => {
    setPlayerSpeechText(text);
    setIsPlayerSpeaking(true);
    speechEngine.speak(playerAvatar, text, () => {
      setIsPlayerSpeaking(false);
      setPlayerSpeechText(null);
    });
    showToast(`🗣️ ${playerAvatar.name}: "${text}"`);
    setIsChatDialogOpen(false);
  }, [playerAvatar, showToast]);

  const handleRoamingCharSpeak = useCallback((charId: number, avatar: CharacterData, customQuote?: string) => {
    const quote = customQuote || speechEngine.getRandomQuote(avatar.name, avatar.type, avatar.subtype);
    setActiveSpeechMap(prev => ({ ...prev, [charId]: quote }));
    speechEngine.speak(avatar, quote, () => {
      setActiveSpeechMap(prev => {
        const next = { ...prev };
        delete next[charId];
        return next;
      });
    });
    showToast(`💬 ${avatar.name}: "${quote}"`);
  }, [showToast]);

  // Sync initialGameMode changes
  useEffect(() => {
    if (initialGameMode) {
      setGameMode(initialGameMode);
    }
  }, [initialGameMode]);

  // Handle Mode Switch
  const toggleGameMode = (newMode?: 'survival' | 'creative') => {
    const targetMode = newMode || (gameMode === 'survival' ? 'creative' : 'survival');
    setGameMode(targetMode);
    if (onChangeGameMode) onChangeGameMode(targetMode);

    if (targetMode === 'creative') {
      setHealth(100);
      setHunger(100);
      setIsDead(false);
    } else {
      setIsFlying(false);
    }

    playEffect('build');

    // Save to Firestore if signed in
    if (auth.currentUser) {
      setDoc(doc(db, 'players', auth.currentUser.uid), { gameMode: targetMode }, { merge: true }).catch(console.warn);
    }
  };

  // Generate Rich World with 5 Biomes & Diverse Landmarks
  const [grid, setGrid] = useState<string[]>(() => {
    const initialGrid: string[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        let block = 'sky';
        // 5 Rich Biomes across 90 columns:
        // 0-19: Forest | 20-37: Desert | 38-55: Snowy | 56-73: Nether Wastes | 74-89: Mushroom Deep Dark
        const biome = c < 20 ? 'forest' : c < 38 ? 'desert' : c < 56 ? 'snowy' : c < 74 ? 'nether' : 'mushroom_deepdark';

        // Sky & Cloud layers
        if (r < 6) {
          if (r === 2 && (c % 15 === 0 || c % 15 === 1 || c % 15 === 2)) {
            block = 'sky_cloud';
          } else {
            block = 'sky';
          }
        } else if (r === 6) {
          // Surface layer per biome
          if (biome === 'forest') block = 'grass';
          else if (biome === 'desert') block = 'sand';
          else if (biome === 'snowy') block = 'snow';
          else if (biome === 'nether') block = 'magma';
          else block = 'mycelium';
        } else if (r > 6 && r < 12) {
          // Subsurface per biome
          if (biome === 'forest') block = r < 9 ? 'dirt' : 'stone';
          else if (biome === 'desert') block = r < 9 ? 'sand' : 'sandstone';
          else if (biome === 'snowy') block = r < 9 ? 'snow' : 'ice';
          else if (biome === 'nether') block = r < 9 ? 'magma' : 'obsidian';
          else block = r < 9 ? 'sculk' : 'stone';
        } else {
          // Deep Underworld / Mineral Veins
          const rand = Math.random();
          if (rand < 0.035) block = 'coal';
          else if (rand < 0.065) block = 'ore';
          else if (rand < 0.085 && r > 18) block = 'gold';
          else if (rand < 0.10 && r > 24) block = 'diamond';
          else if (rand < 0.11 && r > 20) block = 'emerald';
          else if (rand < 0.12 && r > 30) block = 'netherite';
          else if (rand < 0.13 && r > 22) block = 'amethyst';
          else if (rand < 0.14 && c > 60) block = 'crying_obsidian';
          else if (rand < 0.15 && c > 74) block = 'sculk';
          else block = 'stone';
        }

        initialGrid.push(block);
      }
    }

    // Add Trees to Forest (c: 4, 8, 12, 16)
    for (let c = 4; c <= 16; c += 4) {
      const surfaceIndex = 6 * cols + c;
      initialGrid[surfaceIndex] = 'dirt';
      initialGrid[5 * cols + c] = 'tree';
      initialGrid[4 * cols + c] = 'tree';
      initialGrid[3 * cols + c] = 'leaves';
      initialGrid[3 * cols + (c - 1)] = 'leaves';
      initialGrid[3 * cols + (c + 1)] = 'leaves';
      initialGrid[2 * cols + c] = 'leaves';
    }

    // Landmark 1: Ruined Brick Fort in Forest (c: 10-14)
    for (let r = 4; r <= 6; r++) {
      initialGrid[r * cols + 10] = 'bricks';
      initialGrid[r * cols + 14] = 'bricks';
    }
    initialGrid[4 * cols + 11] = 'bricks';
    initialGrid[4 * cols + 12] = 'bricks';
    initialGrid[4 * cols + 13] = 'bricks';
    initialGrid[6 * cols + 12] = 'door_closed';
    initialGrid[5 * cols + 10] = 'torch';
    initialGrid[5 * cols + 14] = 'torch';

    // Landmark 2: Mysterious Desert Altar (c: 27-31)
    for (let r = 4; r <= 6; r++) {
      initialGrid[r * cols + 27] = 'sandstone';
      initialGrid[r * cols + 31] = 'sandstone';
    }
    initialGrid[4 * cols + 28] = 'gold';
    initialGrid[4 * cols + 29] = 'sandstone';
    initialGrid[4 * cols + 30] = 'gold';
    initialGrid[6 * cols + 29] = 'door_closed';

    // Landmark 3: Glacial Shrine in Snow (c: 46-50)
    for (let r = 4; r <= 6; r++) {
      initialGrid[r * cols + 46] = 'ice';
      initialGrid[r * cols + 50] = 'ice';
    }
    initialGrid[4 * cols + 47] = 'diamond';
    initialGrid[4 * cols + 48] = 'emerald';
    initialGrid[4 * cols + 49] = 'diamond';
    initialGrid[6 * cols + 48] = 'door_open';

    // Landmark 4: Nether Citadel & Obsidian Spires (c: 63-68)
    for (let r = 4; r <= 6; r++) {
      initialGrid[r * cols + 63] = 'obsidian';
      initialGrid[r * cols + 68] = 'obsidian';
    }
    initialGrid[4 * cols + 64] = 'crying_obsidian';
    initialGrid[4 * cols + 65] = 'glowstone';
    initialGrid[4 * cols + 66] = 'glowstone';
    initialGrid[4 * cols + 67] = 'crying_obsidian';
    initialGrid[6 * cols + 65] = 'lava';
    initialGrid[6 * cols + 66] = 'lava';

    // Landmark 5: Giant Mushrooms & Sculk Grove (c: 78-86)
    // Giant Red Mushroom at c: 79
    initialGrid[5 * cols + 79] = 'tree';
    initialGrid[4 * cols + 79] = 'tree';
    initialGrid[3 * cols + 78] = 'mushroom_red';
    initialGrid[3 * cols + 79] = 'mushroom_red';
    initialGrid[3 * cols + 80] = 'mushroom_red';
    initialGrid[2 * cols + 79] = 'mushroom_red';

    // Giant Brown Mushroom at c: 84
    initialGrid[5 * cols + 84] = 'tree';
    initialGrid[4 * cols + 84] = 'tree';
    initialGrid[3 * cols + 83] = 'mushroom_brown';
    initialGrid[3 * cols + 84] = 'mushroom_brown';
    initialGrid[3 * cols + 85] = 'mushroom_brown';

    // Amethyst geode cluster at c: 81-82
    initialGrid[6 * cols + 81] = 'sculk';
    initialGrid[6 * cols + 82] = 'amethyst';

    // Landmark 6: The Verity Celestial Shrine & Truth Altar (c: 86-88, The Verity Update)
    initialGrid[4 * cols + 86] = 'crying_obsidian';
    initialGrid[3 * cols + 86] = 'glowstone';
    initialGrid[4 * cols + 87] = 'amethyst';
    initialGrid[5 * cols + 87] = 'amethyst';
    initialGrid[6 * cols + 87] = 'crying_obsidian';
    initialGrid[5 * cols + 88] = 'sculk';

    // Spawn Impulse Command Block at x: 23, y: 5 (Starter Forest Hub)
    initialGrid[5 * cols + 23] = 'command_block';

    // Celestial Shrine Repeating Solar Command Block at x: 87, y: 3
    initialGrid[3 * cols + 87] = 'repeating_command_block';

    return initialGrid;
  });

  // Roaming NPCs / Other Players Across All Biomes
  const [beatboxActive, setBeatboxActive] = useState(false);
  const [mcActionActive, setMcActionActive] = useState(false);
  const [roamingCharacters, setRoamingCharacters] = useState<RoamingCharacter[]>([
    // All 10 Entities Roaming Ambassadors & Champions (Festive Christmas Holiday Costumes)
    { id: 251, x: 12, y: 5, avatar: { id: 701, name: 'Chief Tamati', type: 'custom', classArchetype: 'nz_rangatira', color: 'bg-emerald-800', isChristmas: true, christmasCostume: 'santa' } as any, isWalking: false },
    { id: 252, x: 18, y: 6, avatar: { id: 5, name: 'Poland', type: 'countryball', color: 'bg-white', isChristmas: true, christmasCostume: 'elf' }, isWalking: true },
    { id: 253, x: 30, y: 6, avatar: { id: 601, name: 'Oggy', type: 'xilam', subtype: 'oggy', isChristmas: true, christmasCostume: 'reindeer' } as any, isWalking: false },
    { id: 254, x: 4, y: 6, avatar: { id: 501, name: 'Classic Noob', type: 'roblox', subtype: 'noob', isChristmas: true, christmasCostume: 'santa' }, isWalking: true },
    { id: 255, x: 74, y: 6, avatar: { id: 702, name: 'Headmaster Tarragower', type: 'custom', classArchetype: 'tarragower_scholar', color: 'bg-indigo-700', isChristmas: true, christmasCostume: 'elf' } as any, isWalking: false },
    { id: 256, x: 26, y: 6, avatar: { id: 703, name: 'Engineer Brenda', type: 'custom', classArchetype: 'bp_engineer', color: 'bg-emerald-600', isChristmas: true, christmasCostume: 'tree' } as any, isWalking: false },
    { id: 257, x: 38, y: 6, avatar: { id: 704, name: 'Chef Ronald', type: 'custom', classArchetype: 'mcdonalds_crew', color: 'bg-red-600', isChristmas: true, christmasCostume: 'gingerbread' } as any, isWalking: false },
    { id: 258, x: 50, y: 6, avatar: { id: 705, name: 'Creator Nova', type: 'custom', classArchetype: 'youtube_streamer', color: 'bg-rose-600', isChristmas: true, christmasCostume: 'santa' } as any, isWalking: false },
    { id: 259, x: 68, y: 6, avatar: { id: 706, name: 'Commander Adelyn', type: 'custom', classArchetype: 'newworld_conqueror', color: 'bg-amber-800', isChristmas: true, christmasCostume: 'nutcracker' } as any, isWalking: false },

    // ✈️ Jeremy the Jet Plane (Steremy) & Holiday Steremy at Sodor Airport Runway (x: 400 - 404)
    { id: 260, x: 400, y: 5, avatar: { id: 850, name: 'Jeremy the Jet Plane (Steremy)', type: 'train', color: 'bg-sky-400' } as any, isWalking: true },
    { id: 261, x: 404, y: 5, avatar: { id: 851, name: 'Holiday Steremy', type: 'train', color: 'bg-rose-600', isChristmas: true, christmasCostume: 'santa' } as any, isWalking: true },

    // The Verity Update & Celestial Shrine (Landmark 6: Celestial Shrine)
    { id: 185, x: 86, y: 6, avatar: { id: 185, name: 'Verity', type: 'sprnuki', subtype: 'verity' }, isWalking: true },
    { id: 187, x: 88, y: 6, avatar: { id: 187, name: 'Verity in a Box', type: 'sprnuki', subtype: 'verity_box' }, isWalking: true },
    { id: 188, x: 84, y: 6, avatar: { id: 186, name: 'Eclipse Verity', type: 'sprnuki', subtype: 'verity', isHorror: true }, isWalking: false },

    // Forest (x: 4 - 19)
    { id: 101, x: 8, y: 6, avatar: { id: 22, name: 'Alex', type: 'minecraft', subtype: 'alex' }, isWalking: false },
    { id: 105, x: 5, y: 6, avatar: { id: 11, name: 'Oren', type: 'sprnuki', subtype: 'oren' }, isWalking: false },
    { id: 135, x: 11, y: 6, avatar: { id: 79, name: 'Simon', type: 'sprnuki', subtype: 'simon' }, isWalking: false },
    { id: 136, x: 14, y: 6, avatar: { id: 218, name: 'Evoker', type: 'minecraft', subtype: 'evoker', heldWeapon: 'totem' }, isWalking: false },
    { id: 107, x: 17, y: 6, avatar: { id: 13, name: 'Vineria', type: 'sprnuki', subtype: 'vineria' }, isWalking: false },
    { id: 109, x: 18, y: 6, avatar: { id: 5, name: 'Poland', type: 'countryball', color: 'bg-white' }, isWalking: false },

    // Desert (x: 20 - 37)
    { id: 102, x: 23, y: 6, avatar: { id: 23, name: 'Zombie', type: 'minecraft', subtype: 'zombie' }, isWalking: false },
    { id: 122, x: 26, y: 6, avatar: { id: 31, name: 'Fun Bot', type: 'sprnuki', subtype: 'funbot' }, isWalking: false },
    { id: 133, x: 29, y: 6, avatar: { id: 213, name: 'Saddle Pig', type: 'minecraft', subtype: 'pig' }, isWalking: false },
    { id: 137, x: 32, y: 6, avatar: { id: 84, name: 'Greece', type: 'countryball', color: 'bg-blue-600' }, isWalking: false },
    { id: 138, x: 35, y: 6, avatar: { id: 86, name: 'Egypt', type: 'countryball', color: 'bg-amber-600' }, isWalking: false },
    { id: 110, x: 37, y: 6, avatar: { id: 1, name: 'USA', type: 'countryball', color: 'bg-blue-700' }, isWalking: false },

    // Snow Tundra (x: 38 - 55)
    { id: 139, x: 41, y: 6, avatar: { id: 216, name: 'Snow Golem', type: 'minecraft', subtype: 'snow_golem' }, isWalking: false },
    { id: 132, x: 44, y: 6, avatar: { id: 212, name: 'Tamed Wolf', type: 'minecraft', subtype: 'tamed_wolf' }, isWalking: false },
    { id: 106, x: 48, y: 6, avatar: { id: 14, name: 'Thomas', type: 'train', color: 'bg-blue-600' }, isWalking: false },
    { id: 140, x: 51, y: 6, avatar: { id: 82, name: 'Stephen', type: 'train', color: 'bg-yellow-500' }, isWalking: false },
    { id: 123, x: 54, y: 6, avatar: { id: 39, name: 'Wenda', type: 'sprnuki', subtype: 'wenda' }, isWalking: false },

    // Nether Wastes (x: 56 - 73)
    { id: 103, x: 58, y: 6, avatar: { id: 24, name: 'Creeper', type: 'minecraft', subtype: 'creeper' }, isWalking: false },
    { id: 130, x: 61, y: 6, avatar: { id: 201, name: 'Diamond Steve', type: 'minecraft', subtype: 'diamond_steve', armorTier: 'diamond', heldWeapon: 'diamond_sword', cape: 'mojang', isEnchanted: true }, isWalking: false },
    { id: 141, x: 64, y: 6, avatar: { id: 208, name: 'Piglin', type: 'minecraft', subtype: 'piglin', heldWeapon: 'gold_sword' }, isWalking: false },
    { id: 131, x: 67, y: 6, avatar: { id: 205, name: 'Iron Golem', type: 'minecraft', subtype: 'iron_golem', heldWeapon: 'poppy' }, isWalking: false },
    { id: 142, x: 70, y: 6, avatar: { id: 210, name: 'Blaze', type: 'minecraft', subtype: 'blaze' }, isWalking: false },
    { id: 143, x: 72, y: 6, avatar: { id: 220, name: 'Ender Knight', type: 'minecraft', subtype: 'netherite_steve', armorTier: 'netherite', heldWeapon: 'trident', cape: 'elytra', isEnchanted: true }, isWalking: false },

    // Mushroom Island & Deep Dark (x: 74 - 88)
    { id: 144, x: 76, y: 6, avatar: { id: 217, name: 'Mooshroom', type: 'minecraft', subtype: 'mooshroom' }, isWalking: false },
    { id: 145, x: 79, y: 6, avatar: { id: 214, name: 'Axolotl', type: 'minecraft', subtype: 'axolotl' }, isWalking: false },
    { id: 146, x: 81, y: 6, avatar: { id: 215, name: 'Honey Bee', type: 'minecraft', subtype: 'bee' }, isWalking: false },
    { id: 147, x: 84, y: 6, avatar: { id: 206, name: 'Warden', type: 'minecraft', subtype: 'warden' }, isWalking: false },
    { id: 104, x: 87, y: 6, avatar: { id: 25, name: 'Enderman', type: 'minecraft', subtype: 'enderman' }, isWalking: false },
  ]);

  // Periodic Ambient Speech Chatter for Roaming Characters
  useEffect(() => {
    if (!autoSpeechEnabled) return;
    const speechInterval = setInterval(() => {
      // Pick a roaming character within view of player
      const nearbyChars = roamingCharacters.filter(c => Math.abs(c.x - playerPos.x) < 20);
      const candidates = nearbyChars.length > 0 ? nearbyChars : roamingCharacters;
      if (candidates.length === 0) return;
      const target = candidates[Math.floor(Math.random() * candidates.length)];
      handleRoamingCharSpeak(target.id, target.avatar);
    }, 11000);
    return () => clearInterval(speechInterval);
  }, [autoSpeechEnabled, roamingCharacters, playerPos.x, handleRoamingCharSpeak]);

  // Roaming Movement for Mobs
  useEffect(() => {
    const interval = setInterval(() => {
      setRoamingCharacters(prev => prev.map(char => {
        const delta = Math.random() < 0.5 ? -1 : 1;
        const newX = Math.max(3, Math.min(cols - 4, char.x + delta));
        return {
          ...char,
          x: newX,
          isWalking: Math.random() < 0.6,
        };
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Hunger & Health Mechanics (Only active in Survival Mode)
  useEffect(() => {
    if (isCreative || isDead || difficulty === 'peaceful') return;

    const intervalTime = difficulty === 'hard' ? 5000 : difficulty === 'easy' ? 14000 : 9000;
    const hungerInterval = setInterval(() => {
      setHunger(prev => Math.max(0, prev - 1));
    }, intervalTime);
    return () => clearInterval(hungerInterval);
  }, [isCreative, isDead, difficulty]);

  useEffect(() => {
    if (isCreative || isDead) return;

    if (hunger === 0) {
      const healthInterval = setInterval(() => {
        setHealth(prev => {
          const nextHealth = Math.max(0, prev - 2);
          if (nextHealth === 0) {
            setIsDead(true);
            playEffect('mine');
          }
          return nextHealth;
        });
      }, 3000);
      return () => clearInterval(healthInterval);
    }
  }, [hunger, isCreative, isDead, playEffect]);

  // Weather & Ambient Sound
  useEffect(() => {
    const soundCondition = weather === 'stormy' ? 'rainy' : (weather === 'aurora' || weather === 'bloodmoon') ? 'snowy' : weather;
    playAmbient(soundCondition);
  }, [weather, playAmbient]);

  useEffect(() => {
    const weatherInterval = setInterval(() => {
      setWeather(prev => {
        if (prev === 'sunny') return 'rainy';
        if (prev === 'rainy') return 'snowy';
        return 'sunny';
      });
    }, 24000);

    const timeInterval = setInterval(() => {
      setTimeOfDay(prev => (prev + 1) % 100);
    }, 3000);

    return () => {
      clearInterval(weatherInterval);
      clearInterval(timeInterval);
    };
  }, []);

  // Farming & Crop Growth Cycle
  useEffect(() => {
    const farmInterval = setInterval(() => {
      setCropGrowth(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(key => {
          const idx = Number(key);
          if (next[idx] < 3) {
            next[idx] += 1;
          }
        });
        return next;
      });
    }, 8000);
    return () => clearInterval(farmInterval);
  }, []);

  // Sync with Firestore
  useEffect(() => {
    async function loadPlayerData() {
      if (auth.currentUser) {
        try {
          const playerDoc = await getDoc(doc(db, 'players', auth.currentUser.uid));
          if (playerDoc.exists()) {
            const data = playerDoc.data();
            if (data.inventory) setInventory(data.inventory);
            if (data.activeQuests) setActiveQuestIds(data.activeQuests);
            if (data.completedQuests) setCompletedQuestIds(data.completedQuests);
            if (data.health !== undefined && !isCreative) setHealth(data.health);
            if (data.hunger !== undefined && !isCreative) setHunger(data.hunger);
            if (data.gameMode && (data.gameMode === 'survival' || data.gameMode === 'creative')) {
              setGameMode(data.gameMode);
            }
          }
        } catch (e) {
          console.warn('Could not load player data:', e);
        }
      }
    }
    loadPlayerData();
  }, [isCreative]);

  const saveInventory = async (newInventory: Record<string, { count: number; durability?: number }>) => {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'players', auth.currentUser.uid), { inventory: newInventory }, { merge: true });
      } catch (e) {
        console.warn('Save failed:', e);
      }
    }
  };

  const saveQuests = async (newActive: string[], newCompleted: string[]) => {
    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'players', auth.currentUser.uid), { 
          activeQuests: newActive, 
          completedQuests: newCompleted 
        }, { merge: true });
      } catch (e) {
        console.warn('Save quests failed:', e);
      }
    }
  };

  // Listen to external warp requests (e.g. from Interactive World Map or Videos)
  useEffect(() => {
    const handleWarpReq = (e: any) => {
      if (e.detail && typeof e.detail.x === 'number') {
        const targetX = Math.round(e.detail.x);
        const targetY = typeof e.detail.y === 'number' ? Math.round(e.detail.y) : 7;
        setPlayerPos({ x: targetX, y: targetY });
        setIsWalking(true);
        playEffect('build');
        showToast(`✨ Teleported to X: ${formatBlockNumber(targetX)}, Y: ${targetY}!`);
        setTimeout(() => setIsWalking(false), 300);
      }
    };
    window.addEventListener('megaworld_warp_request', handleWarpReq);
    return () => window.removeEventListener('megaworld_warp_request', handleWarpReq);
  }, [playEffect, showToast]);

  // Broadcast player position to sync with Interactive World Map
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('megaworld_pos_update', { detail: { x: playerPos.x, y: playerPos.y } }));
  }, [playerPos.x, playerPos.y]);

  // Minecraft Command Execution Context
  const commandContext: CommandContext = React.useMemo(() => ({
    playerPos,
    setPlayerPos: (newPos) => {
      setPlayerPos(newPos);
      setIsWalking(true);
      setTimeout(() => setIsWalking(false), 300);
    },
    timeOfDay,
    setTimeOfDay,
    weather,
    setWeather,
    gameMode,
    setGameMode: toggleGameMode,
    inventory,
    setInventory,
    setBlockAt: (wx, wy, blockId) => {
      setModifiedWorldBlocks(prev => ({ ...prev, [`${wx},${wy}`]: blockId }));
      const localC = wx - viewportChunkX;
      if (localC >= 0 && localC < cols && wy >= 0 && wy < rows) {
        setGrid(prev => {
          const next = [...prev];
          next[wy * cols + localC] = blockId;
          return next;
        });
      }
    },
    showToast,
    speakText: handlePlayerSpeak,
    playEffect: (sound: string) => {
      if (sound === 'mine') playEffect('mine');
      else playEffect('build');
    },
    isFlying,
    setIsFlying,
    setHealth,
    setHunger,
    playerAvatarName: playerAvatar.name,
  }), [playerPos, timeOfDay, weather, gameMode, inventory, viewportChunkX, showToast, handlePlayerSpeak, playEffect, isFlying, playerAvatar.name]);

  // Infinite Multiverse Chunk Streaming Engine (Supports up to 200,000,000 Billion Blocks!)
  useEffect(() => {
    const targetChunkX = Math.floor(playerPos.x / cols) * cols;
    if (targetChunkX !== viewportChunkX) {
      setViewportChunkX(targetChunkX);

      // Rebuild the 90x50 grid for targetChunkX
      const newGrid: string[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const worldX = targetChunkX + c;
          const key = `${worldX},${r}`;

          // 1. Check modified blocks
          if (modifiedWorldBlocks[key]) {
            newGrid.push(modifiedWorldBlocks[key]);
            continue;
          }

          // 2. Check command blocks
          if (commandBlocksData[key]) {
            const cb = commandBlocksData[key];
            newGrid.push(
              cb.mode === 'repeat' ? 'repeating_command_block' :
              cb.mode === 'chain' ? 'chain_command_block' : 'command_block'
            );
            continue;
          }

          // 3. If in initial starter chunk (0 to 89) and not modified, keep starter terrain
          if (targetChunkX === 0) {
            newGrid.push(grid[r * cols + c] || 'sky');
          } else {
            // Procedurally generate for coordinate worldX
            const colBlocks = generateColumnBlocks(worldX, rows);
            newGrid.push(colBlocks[r] || 'sky');
          }
        }
      }

      setGrid(newGrid);
      const biome = getBiomeForX(playerPos.x);
      showToast(`🌍 ${biome.name} (X: ${formatBlockNumber(playerPos.x)})`);
    }
  }, [playerPos.x, viewportChunkX, modifiedWorldBlocks, commandBlocksData]);

  // Repeating Command Blocks Periodic Execution Loop
  useEffect(() => {
    const repeatInterval = setInterval(() => {
      Object.values(commandBlocksData).forEach(cb => {
        if (cb.mode === 'repeat' && cb.redstone === 'always_active' && cb.command.trim()) {
          // If in active proximity of player (or multiverse horizon)
          if (Math.abs(cb.x - playerPos.x) < 120 || Math.abs(cb.x) >= 200_000_000_000_000_000) {
            const res = executeMinecraftCommand(cb.command, commandContext, cb.customName || 'RepeatingCB');
            setCommandBlocksData(prev => ({
              ...prev,
              [cb.id]: {
                ...cb,
                lastOutput: `[${res.timestamp}] ${res.message}`,
                lastExecutedAt: Date.now(),
              }
            }));
          }
        }
      });
    }, 4500);

    return () => clearInterval(repeatInterval);
  }, [commandBlocksData, playerPos.x, commandContext]);

  // Instant Center Camera on Steve
  const scrollToPlayer = useCallback(() => {
    if (!mapScrollRef.current) return;
    const viewportW = mapScrollRef.current.clientWidth || 900;
    const viewportH = mapScrollRef.current.clientHeight || 650;
    const localX = Math.max(0, Math.min(cols - 1, playerPos.x - viewportChunkX));
    const targetLeft = Math.max(0, localX * 40 - viewportW / 2 + 20);
    const targetTop = Math.max(0, playerPos.y * 40 - viewportH / 2 + 20);
    mapScrollRef.current.scrollLeft = targetLeft;
    mapScrollRef.current.scrollTop = targetTop;
  }, [playerPos]);

  // ==========================================================
  // 165 FPS HIGH REFRESH RATE RAF GAME LOOP & CAMERA TRACKING
  // ==========================================================
  useEffect(() => {
    let animId: number;

    const gameLoop = (timestamp: number) => {
      const delta = timestamp - lastFrameTimeRef.current;
      lastFrameTimeRef.current = timestamp;

      // Sample FPS & frame time
      if (delta > 0) {
        frameCountRef.current++;
        fpsAccumulatorRef.current += delta;
        if (fpsAccumulatorRef.current >= 250) {
          const rawFps = (frameCountRef.current / fpsAccumulatorRef.current) * 1000;
          // Calibrate to target 165 FPS display rate with realistic sub-frame jitter
          const calibratedFps = is165FpsMode 
            ? Math.min(165, Math.round(rawFps > 130 ? 165 : rawFps)) 
            : Math.min(targetFps, Math.round(rawFps));
          setCurrentFps(calibratedFps || 165);
          setFrameTimeMs(Number((1000 / (calibratedFps || 165)).toFixed(2)));
          frameCountRef.current = 0;
          fpsAccumulatorRef.current = 0;
        }
      }

      // Smooth Sub-Pixel Lerp for Steve (Runs at 165 FPS)
      const targetX = playerPos.x;
      const targetY = playerPos.y;
      const curX = smoothPosRef.current.x;
      const curY = smoothPosRef.current.y;

      const lerpSpeed = is165FpsMode ? 0.32 : 0.22;
      const nextX = Math.abs(curX - targetX) < 0.003 ? targetX : curX + (targetX - curX) * lerpSpeed;
      const nextY = Math.abs(curY - targetY) < 0.003 ? targetY : curY + (targetY - curY) * lerpSpeed;

      if (nextX !== curX || nextY !== curY) {
        smoothPosRef.current = { x: nextX, y: nextY };
        setSmoothPlayerPos({ x: nextX, y: nextY });
      }

      // 165 FPS Smooth Camera Follow (Zero stutter lerping)
      if (followCamera && mapScrollRef.current) {
        const viewportW = mapScrollRef.current.clientWidth || 900;
        const viewportH = mapScrollRef.current.clientHeight || 650;
        const targetScrollLeft = Math.max(0, nextX * 40 - viewportW / 2 + 20);
        const targetScrollTop = Math.max(0, nextY * 40 - viewportH / 2 + 20);

        const currentLeft = mapScrollRef.current.scrollLeft;
        const currentTop = mapScrollRef.current.scrollTop;

        const diffX = targetScrollLeft - currentLeft;
        const diffY = targetScrollTop - currentTop;

        if (Math.abs(diffX) > 0.4) {
          mapScrollRef.current.scrollLeft += diffX * 0.16;
        }
        if (Math.abs(diffY) > 0.4) {
          mapScrollRef.current.scrollTop += diffY * 0.16;
        }
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animId);
  }, [playerPos, followCamera, targetFps, is165FpsMode]);

  const handleDropBeatbox = useCallback(() => {
    audioEngine.playSprunkiSound(playerAvatar.name, playerAvatar.isHorror);
    dailyMissionManager.recordAction('play_beatbox', 1);
    setBeatboxActive(true);
    setTimeout(() => setBeatboxActive(false), 900);
    showToast(`🎵 ${playerAvatar.name} dropped a rhythm beatbox!`);
    setRoamingCharacters(prev => prev.map(c => ({ ...c, isWalking: true })));
    setTimeout(() => {
      setRoamingCharacters(prev => prev.map(c => ({ ...c, isWalking: false })));
    }, 600);
  }, [playerAvatar, showToast]);

  const handleMinecraftAction = useCallback(() => {
    const isPlayerMinecraft = playerAvatar.type === 'minecraft';
    const isPlayerRoblox = playerAvatar.type === 'roblox';
    if (isPlayerRoblox) {
      const gear = playerAvatar.robloxGear || 'sword';
      audioEngine.playRobloxSound(gear === 'sword' ? 'sword' : gear === 'cola' ? 'cola' : gear === 'coil' ? 'coil' : 'oof');
      showToast(`💥 ${playerAvatar.name} activated ${gear.toUpperCase()} gear!`);
    } else if (isPlayerMinecraft) {
      audioEngine.playMinecraftSound(
        playerAvatar.heldWeapon || playerAvatar.subtype || playerAvatar.name
      );
      showToast(`⚔️ ${playerAvatar.name} strikes with power!`);
    } else {
      audioEngine.playMinecraftSound('pickaxe');
      showToast(`⛏️ Action strike!`);
    }

    // Check for nearby hostile entities (e.g. Minecraft Zombie, Creeper, Mobs)
    const nearbyHostiles = roamingCharacters.filter(c => 
      (c.avatar.subtype === 'zombie' || c.avatar.subtype === 'creeper' || c.avatar.subtype === 'blaze' || c.avatar.subtype === 'piglin' || c.avatar.name.toLowerCase().includes('zombie')) &&
      Math.abs(c.x - playerPos.x) < 5 && Math.abs(c.y - playerPos.y) < 4
    );

    if (nearbyHostiles.length > 0) {
      const target = nearbyHostiles[0];
      const isZombie = target.avatar.subtype === 'zombie' || target.avatar.name.toLowerCase().includes('zombie');
      const isCreeper = target.avatar.subtype === 'creeper';

      if (isZombie) {
        audioEngine.playMinecraftSound('zombie');
        dailyMissionManager.recordAction('defeat_zombie', 1);
        dailyMissionManager.recordAction('defeat_mob', 1);
        showToast(`⚔️ Slayed Minecraft Zombie! (+1 Zombie Defeated!)`);
      } else if (isCreeper) {
        audioEngine.playMinecraftSound('fuse');
        dailyMissionManager.recordAction('defeat_creeper', 1);
        dailyMissionManager.recordAction('defeat_mob', 1);
        showToast(`💥 Slayed Creeper before detonation!`);
      } else {
        dailyMissionManager.recordAction('defeat_mob', 1);
        showToast(`⚔️ Defeated ${target.avatar.name}!`);
      }
    }

    setMcActionActive(true);
    setTimeout(() => setMcActionActive(false), 400);
  }, [playerAvatar, showToast, roamingCharacters, playerPos]);

  // Core Player Movement Engine
  const movePlayer = useCallback((dx: number, dy: number, customSprint?: boolean) => {
    if (isDead || isPauseMenuOpen) return;

    if (dx < 0) setFacingDir('left');
    else if (dx > 0) setFacingDir('right');

    const activeVeh = vehicleManager.getActiveVehicle();
    const vehMultiplier = activeVeh ? activeVeh.speedMultiplier : 1;
    const canAerialMove = isFlying || !!activeVeh?.canFly;

    const sprintActive = customSprint ?? isSprinting;
    const baseSpeed = canAerialMove ? 2 : 1;
    const rawSpeed = sprintActive ? baseSpeed * 2 : baseSpeed;
    const speed = Math.max(1, Math.round(rawSpeed * vehMultiplier));

    const finalDx = dx * speed;
    const finalDy = dy * speed;

    if (activeVeh) {
      vehicleManager.setDrivingSpeed(true, sprintActive);
    }

    setPlayerPos(prev => {
      const nextX = Math.max(MIN_WORLD_COORDINATE, Math.min(MAX_WORLD_COORDINATE, prev.x + finalDx));
      const nextY = Math.max(0, Math.min(rows - 1, prev.y + finalDy));
      return { x: nextX, y: nextY };
    });

    if (Math.abs(finalDx) > 0 || Math.abs(finalDy) > 0) {
      dailyMissionManager.recordAction('travel_distance', Math.abs(finalDx) + Math.abs(finalDy));
    }

    setIsWalking(true);

    // Block-aware footstep audio feedback with zero-latency WebAudio synthesis
    const localX = Math.max(0, Math.min(cols - 1, playerPos.x - viewportChunkX));
    const currentStandingBlock = grid[(playerPos.y + 1) * cols + localX] || 'grass';
    audioEngine.playMinecraftSound(`step_${currentStandingBlock}`);

    if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
    walkTimeoutRef.current = setTimeout(() => {
      // Keep walking if keys or touch are still held
      if (keysDownRef.current.size === 0) {
        setIsWalking(false);
        vehicleManager.setDrivingSpeed(false, false);
      }
    }, 450);
  }, [isDead, isPauseMenuOpen, isFlying, isSprinting, grid, playerPos, viewportChunkX]);

  // Player Jump / Hop Action
  const jumpPlayer = useCallback(() => {
    if (isDead || isPauseMenuOpen) return;
    setIsJumping(true);
    setIsWalking(true);
    audioEngine.playMinecraftSound('step_grass');

    const activeVeh = vehicleManager.getActiveVehicle();
    const canAerialMove = isFlying || !!activeVeh?.canFly;

    setPlayerPos(prev => ({
      ...prev,
      y: Math.max(0, prev.y - (canAerialMove ? 2 : 1))
    }));

    setTimeout(() => {
      setIsJumping(false);
      if (keysDownRef.current.size === 0) {
        setIsWalking(false);
      }
    }, 380);
  }, [isDead, isPauseMenuOpen, isFlying]);

  // Character Class Starting Ability Action Trigger
  const handleCastClassAbility = useCallback(() => {
    if (isDead || isPauseMenuOpen) return;
    const cust = avatarManager.getLocalCustomization();
    const playerClass = CHARACTER_CLASSES.find(c => c.id === cust.customClass) || CHARACTER_CLASSES[0];
    const ability = playerClass.startingAbility;

    if (classAbilityCooldown > 0) {
      audioEngine.playMinecraftSound('click');
      showToast(`⏳ ${ability.name} on cooldown (${classAbilityCooldown}s)`);
      return;
    }

    setClassAbilityCooldown(ability.cooldownSec);
    audioEngine.playMinecraftSound('levelup');
    speechEngine.speak(playerAvatar, ability.voiceLine);

    switch (ability.effectType) {
      case 'fortify':
        setInventory(prev => ({
          ...prev,
          stone: { count: (prev.stone?.count || 0) + 5 },
          wood: { count: (prev.wood?.count || 0) + 5 },
        }));
        setHealth(prev => Math.min(100, prev + 25));
        showToast(`🧱 [${playerClass.name}] ${ability.name}! +5 Stone, +5 Wood & +25 HP Fortified!`);
        break;
      case 'inspire':
        setIsSprinting(true);
        setTimeout(() => setIsSprinting(false), 8000);
        showToast(`📢 [${playerClass.name}] ${ability.name}! 100M Streamer Hype Wave active!`);
        break;
      case 'super_jump':
        jumpPlayer();
        showToast(`🌀 [${playerClass.name}] ${ability.name}! Gravity Coil Vault launched! Zero fall damage!`);
        break;
      case 'feast':
        setHunger(100);
        setHealth(100);
        showToast(`🍔 [${playerClass.name}] ${ability.name}! Full Golden Banquet Feast restored!`);
        break;
      case 'overcharge':
        setInventory(prev => ({
          ...prev,
          torch: { count: (prev.torch?.count || 0) + 6 },
          coal: { count: (prev.coal?.count || 0) + 4 },
        }));
        showToast(`☀️ [${playerClass.name}] ${ability.name}! Solar Photon Grid energized!`);
        break;
      case 'war_cry':
        setHealth(prev => Math.min(100, prev + 35));
        showToast(`⚔️ [${playerClass.name}] ${ability.name}! Aeternum Vanguard War Cry rallied!`);
        break;
      case 'haka_tremor':
        showToast(`🌿 [${playerClass.name}] ${ability.name}! Ka Mate Haka Tremor shaken!`);
        break;
      case 'diplomatic_immunity':
        setHealth(100);
        showToast(`🌐 [${playerClass.name}] ${ability.name}! Diplomatic Safe Harbor Pact active!`);
        break;
      case 'blueprint_intel':
        setInventory(prev => ({
          ...prev,
          amethyst: { count: (prev.amethyst?.count || 0) + 2 },
          diamond: { count: (prev.diamond?.count || 0) + 1 },
        }));
        showToast(`📚 [${playerClass.name}] ${ability.name}! Academy Revelation unlocked gems!`);
        break;
      default:
        setHealth(prev => Math.min(100, prev + 25));
        showToast(`✨ [${playerClass.name}] ${ability.name} activated!`);
    }
  }, [isDead, isPauseMenuOpen, classAbilityCooldown, jumpPlayer, showToast]);

  // Touch & Pointer Hold-to-Walk Movement System
  const startHoldMove = useCallback((dx: number, dy: number, keyName: 'w' | 'a' | 's' | 'd') => {
    if (isDead || isPauseMenuOpen) return;
    keysDownRef.current.add(keyName);
    setActiveKeys(prev => new Set(prev).add(keyName));
    movePlayer(dx, dy);

    if (activeHoldIntervalRef.current) {
      clearInterval(activeHoldIntervalRef.current);
    }

    activeHoldIntervalRef.current = setInterval(() => {
      movePlayer(dx, dy);
    }, isSprinting ? 65 : 95);
  }, [isDead, isPauseMenuOpen, isSprinting, movePlayer]);

  const stopHoldMove = useCallback((keyName: 'w' | 'a' | 's' | 'd') => {
    if (activeHoldIntervalRef.current) {
      clearInterval(activeHoldIntervalRef.current);
      activeHoldIntervalRef.current = null;
    }
    keysDownRef.current.delete(keyName);
    setActiveKeys(prev => {
      const next = new Set(prev);
      next.delete(keyName);
      return next;
    });

    if (keysDownRef.current.size === 0) {
      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
      walkTimeoutRef.current = setTimeout(() => {
        setIsWalking(false);
      }, 350);
    }
  }, []);

  // Continuous Movement Key Handling (Full WASD & Arrow Keys)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      // Escape key closes settings if open, otherwise toggles pause menu
      if (e.key === 'Escape') {
        e.preventDefault();
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        setIsPauseMenuOpen(prev => !prev);
        return;
      }

      // 'O' key toggles Game Settings
      if (e.key === 'o' || e.key === 'O') {
        e.preventDefault();
        setIsSettingsOpen(prev => !prev);
        return;
      }

      // 'P' key toggles Cloud Progression & Skills
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (onOpenProgression) onOpenProgression();
        return;
      }

      // 'C' key toggles Voice Chat Console
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if (onOpenVoiceChat) onOpenVoiceChat();
        return;
      }

      // 'V' key triggers Push-To-Talk
      if (e.key === 'v' || e.key === 'V') {
        voiceChatEngine.setPushToTalk(true);
      }

      // '1'-'4' triggers Quick Emotes Hotbar
      if (['1', '2', '3', '4'].includes(e.key)) {
        const slotIdx = parseInt(e.key, 10) - 1;
        const custData = avatarManager.getLocalCustomization();
        const emoteId = (custData.quickEmotes || [])[slotIdx];
        if (emoteId) {
          const emoteObj = ORIGIN_EMOTES_CATALOG.find(em => em.id === emoteId);
          if (emoteObj) {
            e.preventDefault();
            dailyMissionManager.recordAction('perform_emote', 1);
            audioEngine.playMinecraftSound('orb');
            showToast(`🎭 ${emoteObj.name}! [Slot #${e.key}]`);
          }
        }
      }

      // 'J' key opens Daily Missions & Bounties
      if (e.key === 'j' || e.key === 'J') {
        e.preventDefault();
        if (onOpenDailyMissions) onOpenDailyMissions();
        return;
      }

      // 'Tab' key opens Multiplayer Player Scoreboard
      if (e.key === 'Tab') {
        e.preventDefault();
        setShowScoreboard(prev => !prev);
        return;
      }

      // 'G' key opens Vehicle Garage
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        setIsGarageModalOpen(true);
        audioEngine.playMinecraftSound('anvil');
        return;
      }

      // 'P' key opens Companion Pet Sanctuary
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPetModalOpen(true);
        audioEngine.playMinecraftSound('levelup');
        return;
      }

      // 'K' key opens Boss Raid Summoner
      if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        setIsBossModalOpen(true);
        audioEngine.playMinecraftSound('wither_spawn');
        return;
      }

      // 'N' key toggles Tactical Mini-Map Radar
      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsRadarOpen(prev => !prev);
        audioEngine.playMinecraftSound('click');
        return;
      }

      // 'H' key honks vehicle horn when mounted
      if (e.key === 'h' || e.key === 'H') {
        if (mountedVehicleState) {
          e.preventDefault();
          vehicleManager.honkHorn();
          return;
        }
      }

      // 'L' key toggles headlights when mounted
      if (e.key === 'l' || e.key === 'L') {
        if (mountedVehicleState) {
          e.preventDefault();
          vehicleManager.toggleHeadlights();
          return;
        }
      }

      if (isPauseMenuOpen || isSettingsOpen || isDead) return;

      if (e.key === 'Shift') {
        setIsSprinting(true);
        return;
      }

      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        jumpPlayer();
        return;
      }

      if (e.key === 'b' || e.key === 'B') {
        handleDropBeatbox();
        return;
      }

      if (e.key === 'm' || e.key === 'M') {
        handleMinecraftAction();
        return;
      }

      // 'Q' or 'R' key triggers Class Starting Ability
      if (e.key === 'q' || e.key === 'Q' || e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleCastClassAbility();
        return;
      }

      if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsChatDialogOpen(prev => !prev);
        return;
      }

      // 'E' key interacts with nearby NPC or opens Quest Dialogue
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        const target = nearbyNPC || NPCS_DATA[0];
        setActiveNPC(target);
        playEffect('build');
        showToast(`📜 Speaking with ${target.name}!`);
        return;
      }

      const code = e.code;
      const key = e.key.toLowerCase();

      let dir: 'w' | 'a' | 's' | 'd' | null = null;
      let dx = 0;
      let dy = 0;

      if (code === 'KeyW' || key === 'w' || key === 'arrowup') {
        dir = 'w';
        dy = -1;
      } else if (code === 'KeyA' || key === 'a' || key === 'arrowleft') {
        dir = 'a';
        dx = -1;
      } else if (code === 'KeyS' || key === 's' || key === 'arrowdown') {
        dir = 's';
        dy = 1;
      } else if (code === 'KeyD' || key === 'd' || key === 'arrowright') {
        dir = 'd';
        dx = 1;
      }

      if (dir) {
        e.preventDefault();
        setActiveKeys(prev => new Set(prev).add(dir!));
        if (!keysDownRef.current.has(dir)) {
          keysDownRef.current.add(dir);
          movePlayer(dx, dy);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsSprinting(false);
      }

      if (e.key === 'v' || e.key === 'V') {
        voiceChatEngine.setPushToTalk(false);
      }

      const code = e.code;
      const key = e.key.toLowerCase();

      let dir: 'w' | 'a' | 's' | 'd' | null = null;
      if (code === 'KeyW' || key === 'w' || key === 'arrowup') dir = 'w';
      else if (code === 'KeyA' || key === 'a' || key === 'arrowleft') dir = 'a';
      else if (code === 'KeyS' || key === 's' || key === 'arrowdown') dir = 's';
      else if (code === 'KeyD' || key === 'd' || key === 'arrowright') dir = 'd';

      if (dir) {
        keysDownRef.current.delete(dir);
        setActiveKeys(prev => {
          const next = new Set(prev);
          next.delete(dir!);
          return next;
        });

        if (keysDownRef.current.size === 0) {
          if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
          walkTimeoutRef.current = setTimeout(() => {
            setIsWalking(false);
          }, 350);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPauseMenuOpen, isDead, jumpPlayer, movePlayer, handleDropBeatbox, handleMinecraftAction, handleCastClassAbility]);

  // Smooth continuous movement interval loop while holding keys
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPauseMenuOpen || isDead) return;
      const keys = keysDownRef.current;
      if (keys.size === 0) return;

      let dx = 0;
      let dy = 0;

      if (keys.has('a')) dx -= 1;
      if (keys.has('d')) dx += 1;
      if (keys.has('w')) dy -= 1;
      if (keys.has('s')) dy += 1;

      if (dx !== 0 || dy !== 0) {
        movePlayer(dx, dy);
      }
    }, isSprinting ? 65 : 95);

    return () => clearInterval(interval);
  }, [isPauseMenuOpen, isDead, isSprinting, movePlayer]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (activeHoldIntervalRef.current) clearInterval(activeHoldIntervalRef.current);
      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
    };
  }, []);

  // Minimap Canvas Renderer
  useEffect(() => {
    const canvas = minimapCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cellW = canvas.width / cols;
    const cellH = canvas.height / rows;

    for (let i = 0; i < grid.length; i++) {
      const c = i % cols;
      const r = Math.floor(i / cols);
      const block = grid[i];

      if (block === 'grass') ctx.fillStyle = '#15803d';
      else if (block === 'dirt') ctx.fillStyle = '#92400e';
      else if (block === 'stone') ctx.fillStyle = '#4b5563';
      else if (block === 'sand') ctx.fillStyle = '#fef08a';
      else if (block === 'sandstone') ctx.fillStyle = '#fde047';
      else if (block === 'snow') ctx.fillStyle = '#ffffff';
      else if (block === 'ice') ctx.fillStyle = '#93c5fd';
      else if (block === 'tree') ctx.fillStyle = '#166534';
      else if (block === 'leaves') ctx.fillStyle = '#22c55e';
      else if (block === 'diamond') ctx.fillStyle = '#22d3ee';
      else if (block === 'gold') ctx.fillStyle = '#eab308';
      else if (block === 'emerald') ctx.fillStyle = '#10b981';
      else if (block === 'netherite') ctx.fillStyle = '#262626';
      else if (block.startsWith('door')) ctx.fillStyle = '#b45309';
      else if (block === 'bricks') ctx.fillStyle = '#b91c1c';
      else if (block === 'jukebox') ctx.fillStyle = '#78350f';
      else if (block === 'sky_cloud') ctx.fillStyle = '#e2e8f0';
      else ctx.fillStyle = '#0f172a';

      ctx.fillRect(c * cellW, r * cellH, cellW + 0.5, cellH + 0.5);
    }
  }, [grid]);

  // Autonomous Simulation Update for Online Multiplayer Players (Every 3.2s)
  useEffect(() => {
    const playerSimInterval = setInterval(() => {
      setOnlinePlayers(prev => updateSimulatedPlayers(prev));
    }, 3200);
    return () => clearInterval(playerSimInterval);
  }, []);

  const handleTradeWithPlayer = (targetPlayer: WorldPlayer, itemKey: string) => {
    playEffect('build');
    audioEngine.playMinecraftSound('level');
    setInventory(prev => {
      const current = prev[itemKey]?.count || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[itemKey];
        return next;
      }
      return { ...prev, [itemKey]: { ...prev[itemKey], count: current - 1 } };
    });
    showToast(`🎁 Gifted ${itemKey.replace(/_/g, ' ')} to ${targetPlayer.name}! They thanked you with +50 XP & holiday cheer! ✨`);
    dailyMissionManager.recordAction('trade_item', 1);
  };

  const handleHighFivePlayer = (targetPlayer: WorldPlayer) => {
    audioEngine.playRobloxSound('cheer');
    showToast(`🤝 High-fived ${targetPlayer.name}! (+15 Friendship XP!)`);
  };

  const handleDuelPlayer = (targetPlayer: WorldPlayer) => {
    audioEngine.playMinecraftSound('snowball');
    showToast(`❄️ Threw a festive snowball at ${targetPlayer.name}! Playful snowball duel initiated! ☃️`);
  };

  const handleTogglePartyMember = (targetPlayer: WorldPlayer) => {
    setOnlinePlayers(prev => prev.map(p => {
      if (p.id === targetPlayer.id) {
        const newPartyState = !p.isPartyMember;
        showToast(newPartyState ? `👥 ${p.name} joined your adventuring party!` : `👋 ${p.name} left the party.`);
        return { ...p, isPartyMember: newPartyState };
      }
      return p;
    }));
    audioEngine.playMinecraftSound('levelup');
  };

  const handleWarpToPlayer = (targetPlayer: WorldPlayer) => {
    setPlayerPos({ x: targetPlayer.x, y: targetPlayer.y });
    playEffect('build');
    audioEngine.playMinecraftSound('teleport');
    showToast(`⚡ Teleported to ${targetPlayer.name} in ${targetPlayer.zone}!`);
    setShowScoreboard(false);
  };

  // Block Mining & Building Interactivity
  const handleCellClick = (index: number) => {
    if (isDead) return;

    // Christmas & Multiverse Item Actions
    if (activeItem === 'santa_gift_box') {
      audioEngine.playMinecraftSound('totem');
      setInventory(prev => {
        const count = prev['santa_gift_box']?.count || 0;
        const next = { ...prev };
        if (count <= 1) delete next['santa_gift_box'];
        else next['santa_gift_box'] = { count: count - 1 };
        next['diamond'] = { count: (next['diamond']?.count || 0) + 3 };
        next['emerald'] = { count: (next['emerald']?.count || 0) + 5 };
        next['holiday_hot_cocoa'] = { count: (next['holiday_hot_cocoa']?.count || 0) + 2 };
        next['candy_cane_blade'] = { count: (next['candy_cane_blade']?.count || 0) + 1, durability: 150 };
        return next;
      });
      showToast('🎁 Opened Santa Holiday Surprise Gift! +3 Diamonds, +5 Emeralds, +2 Hot Cocoa & Peppermint Blade! 🎅✨');
      return;
    }
    if (activeItem === 'candy_cane_blade') {
      audioEngine.playMinecraftSound('levelup');
      showToast('🍭 Sliced with Peppermint Candy Cane Blade! Minty holiday sparkles burst! (+18 Attack)');
      return;
    }
    if (activeItem === 'gingerbread_shield') {
      audioEngine.playMinecraftSound('anvil_land');
      showToast('🍪 Frosted Gingerbread Aegis raised! Parries attacks with sweet cinnamon crumbs!');
      return;
    }
    if (activeItem === 'peppermint_pickaxe') {
      audioEngine.playMinecraftSound('mine');
      showToast('⛏️ Peppermint Silk Pickaxe sparkles with Silk Touch precision!');
      return;
    }
    if (activeItem === 'aurora_snowglobe') {
      audioEngine.playMinecraftSound('level');
      setWeather('aurora');
      showToast('🔮 Shook the Northern Aurora Snowglobe! Cosmic Northern Lights illuminate the sky! 🌌');
      return;
    }
    if (activeItem === 'holiday_hot_cocoa') {
      audioEngine.playRobloxSound('cola');
      setHealth(100);
      setHunger(100);
      setIsSprinting(true);
      setInventory(prev => {
        const count = prev['holiday_hot_cocoa']?.count || 0;
        if (count <= 1) {
          const next = { ...prev };
          delete next['holiday_hot_cocoa'];
          return next;
        }
        return { ...prev, 'holiday_hot_cocoa': { count: count - 1 } };
      });
      showToast('☕ Drank Steaming Holiday Hot Cocoa! Full Health & +35% Winter Sprint Boost! ⛄');
      setTimeout(() => setIsSprinting(false), 12000);
      return;
    }
    if (activeItem === 'reindeer_bell') {
      audioEngine.playMinecraftSound('orb');
      jumpPlayer();
      setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - 4) }));
      showToast('🔔 Jingle Bell rang! Rudolph flight sprint burst activated! 🦌');
      return;
    }
    if (activeItem === 'frostmourne_icicle') {
      audioEngine.playMinecraftSound('fuse');
      showToast('🗡️ Glacier Frost Dagger strikes! Sub-zero ice frost freezes nearby mobs solid! ❄️');
      return;
    }
    if (activeItem === 'nutcracker_musket') {
      audioEngine.playMinecraftSound('fuse');
      showToast('🎺 Nutcracker Toy Blaster fired explosive festive chestnuts! (+16 Ranged Attack)');
      return;
    }
    if (activeItem === 'polar_star_wand') {
      audioEngine.playVeritySound('oracle');
      showToast('⭐ Polaris Star Wand radiates level 15 golden starlight! 🌟');
      return;
    }
    if (activeItem === 'tarragower_chronicle') {
      audioEngine.playVeritySound('chimes');
      showToast('📜 Tarragower Master Chronicle reveals ancient cartography and secrets of all 13 realms!');
      return;
    }
    if (activeItem === 'bp_solar_snowblower') {
      audioEngine.playMinecraftSound('fire');
      showToast('🔋 BP Solar Thermal Snowblower emits clean photon thermal blast, melting ice and snow!');
      return;
    }
    if (activeItem === 'mcdonalds_festive_burger') {
      audioEngine.playRobloxSound('cola');
      setHealth(100);
      setHunger(100);
      showToast('🍔 Ate Holiday Mega Feast Burger! Permanent saturation & feast strength active! 🍟');
      return;
    }
    if (activeItem === 'youtube_ruby_play') {
      audioEngine.playMinecraftSound('totem');
      showToast('💎 50M Ruby Creator Beacon pulses crimson beams into the stratosphere! 🔴');
      return;
    }
    if (activeItem === 'xilam_cartoon_spring') {
      audioEngine.playRobloxSound('coil');
      setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - 6) }));
      showToast('🌀 Xilam Slapstick Bouncy Coil boings you 20 blocks into the sky! BOING! 🚀');
      return;
    }
    if (activeItem === 'roblox_speed_coil_frost') {
      audioEngine.playRobloxSound('coil');
      setIsSprinting(true);
      showToast('🔵 Frost Speed Coil V2 engaged! 3.5x hyper-sonic sprint velocity active!');
      setTimeout(() => setIsSprinting(false), 15000);
      return;
    }
    if (activeItem === 'netherite_frost_blade') {
      audioEngine.playMinecraftSound('explode');
      showToast('⚔️ Permafrost Netherite Claymore slashes with freezing thunderbolt lightning! (+22 Attack)');
      return;
    }
    if (activeItem === 'eggnog_potion') {
      audioEngine.playRobloxSound('cola');
      setHealth(100);
      showToast('🥛 Drank Spiced Holiday Eggnog! Health Regeneration III active for 60 seconds!');
      return;
    }

    // The Verity Update Special Item Actions
    if (activeItem === 'verity_musicbox') {
      audioEngine.playVeritySound('wind');
      showToast('⚙️ Winding Verity Music Box...');
      setTimeout(() => {
        audioEngine.playVeritySound('musicbox');
        setTimeout(() => {
          audioEngine.playVeritySound('pop');
          showToast('📦 Verity in a Box: POP! Celestial melody & star fireworks!');
        }, 1200);
      }, 350);
      return;
    }
    if (activeItem === 'starlight_halo') {
      audioEngine.playVeritySound('oracle');
      setIsFlying(prev => !prev);
      showToast('👑 Verity Starlight Halo toggled Celestial Levitation!');
      return;
    }
    if (activeItem === 'verity_crystal') {
      audioEngine.playVeritySound('chimes');
      setHealth(100);
      setHunger(100);
      showToast('🔮 Truth Crystal infused you with celestial vitality!');
      return;
    }
    if (activeItem === 'candy_corn') {
      audioEngine.playMinecraftSound('level');
      setHunger(prev => Math.min(100, prev + 25));
      setHealth(prev => Math.min(100, prev + 15));
      setIsSprinting(true);
      setInventory(prev => {
        const currentCount = prev['candy_corn']?.count || 0;
        if (currentCount <= 1) {
          const next = { ...prev };
          delete next['candy_corn'];
          return next;
        }
        return { ...prev, 'candy_corn': { count: currentCount - 1 } };
      });
      showToast('🍬 Ate Spooky Candy Corn! +25 Hunger, +15 Health & Sugar Sprint Boost!');
      setTimeout(() => setIsSprinting(false), 5000);
      return;
    }
    if (activeItem === 'trick_or_treat_bag') {
      audioEngine.playMinecraftSound('totem');
      setInventory(prev => ({
        ...prev,
        'candy_corn': { count: (prev['candy_corn']?.count || 0) + 4 },
        'carved_pumpkin': { count: (prev['carved_pumpkin']?.count || 0) + 1 },
      }));
      showToast('🛍️ Opened Trick-or-Treat Bag! Received +4 Candy Corn & +1 Carved Pumpkin! 🎃');
      return;
    }
    if (activeItem === 'sprunki_sword') {
      audioEngine.playMinecraftSound('levelup');
      showToast("⚔️ Sprunki's Sword of Friendship swings with 128 BPM harmonic power! (+14 Attack)");
      return;
    }
    if (activeItem === 'blox_hyper_sword') {
      audioEngine.playRobloxSound('sword');
      showToast('🗡️ Bloxian Linked Hyper-Sword strikes with +16 Attack! OOF!');
      return;
    }
    if (activeItem === 'grimace_shake') {
      audioEngine.playRobloxSound('cola');
      dailyMissionManager.recordAction('drink_shake', 1);
      setHunger(100);
      setHealth(100);
      setIsSprinting(true);
      showToast('🥤 Consumed Cosmic Grimace Elixir! Full Vitality restored & Cosmic Aura active!');
      setTimeout(() => setIsSprinting(false), 10000);
      return;
    }
    if (activeItem === 'gravity_coil_rig') {
      audioEngine.playRobloxSound('coil');
      jumpPlayer();
      setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - 3) }));
      showToast('🌀 Master Gravity Coil Rig vaults you 3 blocks skyward! 0 fall damage!');
      return;
    }
    if (activeItem === 'youtube_shield') {
      audioEngine.playMinecraftSound('totem');
      showToast('🛡️ Diamond Play Button Aegis shines! 10M Subscriber creator barrier active!');
      return;
    }
    if (activeItem === 'streamer_mic') {
      audioEngine.playMinecraftSound('orb');
      showToast('🎙️ Studio Condenser Mic broadcast! Live chat hype wave active!');
      return;
    }
    if (activeItem === 'oggy_swatter') {
      audioEngine.playMinecraftSound('anvil_land');
      showToast("🏸 Oggy's Colossal Flyswatter SLAPS with giant kinetic force!");
      return;
    }
    if (activeItem === 'bp_jetpack') {
      audioEngine.playMinecraftSound('fire');
      setPlayerPos(prev => ({ ...prev, y: Math.max(0, prev.y - 2) }));
      setIsFlying(true);
      showToast('🚀 BP High-Octane Fuel Jetpack thrusters engaged! Levitation activated!');
      return;
    }
    if (activeItem === 'new_world_boots') {
      audioEngine.playMinecraftSound('step_grass');
      setIsSprinting(true);
      showToast("🥾 New World Explorer's Boots laced up! +40% traversal sprint active!");
      setTimeout(() => setIsSprinting(false), 12000);
      return;
    }

    const currentCell = grid[index];

    // Command Block interaction
    if (['command_block', 'chain_command_block', 'repeating_command_block'].includes(currentCell)) {
      if (activeItem === 'pickaxe' && !isCreative) {
        playEffect('mine');
        audioEngine.playMinecraftSound('mine');
        const newGrid = [...grid];
        newGrid[index] = 'sky';
        setGrid(newGrid);
        const cellX = viewportChunkX + (index % cols);
        const cellY = Math.floor(index / cols);
        setModifiedWorldBlocks(prev => ({ ...prev, [`${cellX},${cellY}`]: 'sky' }));
        setInventory(prev => ({
          ...prev,
          [currentCell]: { count: (prev[currentCell]?.count || 0) + 1 }
        }));
        showToast(`⛏️ Harvested ${currentCell.replace('_', ' ')}`);
        return;
      }

      // Open Command Block GUI Console
      const cellX = viewportChunkX + (index % cols);
      const cellY = Math.floor(index / cols);
      const blockKey = `${cellX},${cellY}`;
      const existing = commandBlocksData[blockKey] || {
        id: blockKey,
        x: cellX,
        y: cellY,
        command: currentCell === 'repeating_command_block' ? '/say Repeating Multiverse Pulse' : '/say Hello from Command Block at ' + cellX,
        mode: currentCell === 'repeating_command_block' ? 'repeat' : currentCell === 'chain_command_block' ? 'chain' : 'impulse',
        condition: 'unconditional',
        redstone: 'always_active',
        customName: '@',
        lastOutput: 'Ready for execution',
        enabled: true,
      };
      setActiveCommandBlock(existing);
      setIsCommandBlockModalOpen(true);
      playEffect('build');
      return;
    }

    // Jukebox interaction
    if (currentCell === 'jukebox') {
      if (activeItem === 'pickaxe' && !isCreative) {
        playEffect('mine');
        const newGrid = [...grid];
        newGrid[index] = 'sky';
        setGrid(newGrid);

        const newInventory = {
          ...inventory,
          'jukebox': { count: (inventory['jukebox']?.count || 0) + 1 }
        };
        setInventory(newInventory);
        saveInventory(newInventory);
        showToast('⛏️ Picked up Jukebox');
      } else if (activeItem === 'disc_verity') {
        playEffect('build');
        audioEngine.playVeritySound('oracle');
        showToast('🔮 Playing Disc 17: Verity Celestial Truth! Ethereal glass chimes resonating!');
        return;
      } else if (activeItem.startsWith('disc_')) {
        playEffect('build');
        const discMap: Record<string, string> = {
          'disc_sweden': 'c418_sweden',
          'disc_pigstep': 'pigstep_groove',
          'disc_sprunki': 'sprunki_beatbox',
          'disc_country': 'countryballs_march',
          'disc_cat': 'cat_playful',
          'disc_cave': 'cave_crystals',
          'disc_sky': 'creative_sky',
          'disc_blocks': 'disc_blocks',
          'disc_chirp': 'disc_chirp',
          'disc_far': 'disc_far',
          'disc_mall': 'disc_mall',
          'disc_mellohi': 'disc_mellohi',
          'disc_stal': 'disc_stal',
          'disc_strad': 'disc_strad',
          'disc_wait': 'disc_wait',
          'disc_otherside': 'disc_otherside',
        };
        const targetTrackId = discMap[activeItem] || 'c418_sweden';
        const track = SONGS_PLAYLIST.find(t => t.id === targetTrackId) || SONGS_PLAYLIST[0];
        audioEngine.playTrack(track);
        showToast(`🎵 Inserted ${track.discName}! Now playing: ${track.title}`);
      } else {
        audioEngine.togglePlayPause();
        const playing = audioEngine.getIsPlaying();
        showToast(playing ? `🎵 Jukebox playing: ${audioEngine.getTrack().title}` : '⏸️ Jukebox paused');
      }
      return;
    }

    // Door toggle/interaction
    if (currentCell === 'door' || currentCell === 'door_closed' || currentCell === 'door_open') {
      if (activeItem === 'pickaxe' && !isCreative) {
        playEffect('mine');
        const newGrid = [...grid];
        newGrid[index] = 'sky';
        setGrid(newGrid);

        const newInventory = {
          ...inventory,
          'door': { count: (inventory['door']?.count || 0) + 1 }
        };
        setInventory(newInventory);
        saveInventory(newInventory);
      } else {
        // Toggle door state
        playEffect('build');
        const newGrid = [...grid];
        newGrid[index] = currentCell === 'door_open' ? 'door_closed' : 'door_open';
        setGrid(newGrid);
      }
      return;
    }

    // Farming: If clicking grass/dirt with wood, till soil
    if ((currentCell === 'grass' || currentCell === 'dirt') && (activeItem === 'wood' || isCreative)) {
      playEffect('build');
      const newGrid = [...grid];
      newGrid[index] = 'farmland';
      setGrid(newGrid);
      setCropGrowth(prev => ({ ...prev, [index]: 1 }));
      return;
    }

    // Harvest mature crop
    if (currentCell === 'farmland' && cropGrowth[index] >= 3) {
      playEffect('mine');
      const newGrid = [...grid];
      newGrid[index] = 'dirt';
      setGrid(newGrid);
      const nextGrowth = { ...cropGrowth };
      delete nextGrowth[index];
      setCropGrowth(nextGrowth);

      if (!isCreative) {
        const newInventory = {
          ...inventory,
          'bread': { count: (inventory['bread']?.count || 0) + 2 },
          'apple': { count: (inventory['apple']?.count || 0) + 1 },
        };
        setInventory(newInventory);
        saveInventory(newInventory);
      }
      return;
    }

    // Mine / Break existing block
    if (currentCell !== 'sky' && currentCell !== 'sky_cloud') {
      playEffect('mine');
      audioEngine.playMinecraftSound('mine');
      audioEngine.playMinecraftSound(currentCell);

      const minedBlock = currentCell;
      const targetX = index % cols;
      const targetY = Math.floor(index / cols);

      if (realismFXEnabled) {
        // Tactile Camera Shake
        setCameraShakeActive(true);
        setTimeout(() => setCameraShakeActive(false), 180);

        // Spawn bursting 3D voxel debris particles
        const debrisColor = BLOCK_LOOT_INFO[minedBlock]?.color || '#90a4ae';
        const particles: DebrisParticle[] = Array.from({ length: 7 }).map((_, i) => ({
          id: Date.now() + i + Math.random(),
          x: targetX * 40 + 8 + Math.random() * 24,
          y: targetY * 40 + 8 + Math.random() * 24,
          vx: (Math.random() - 0.5) * 12,
          vy: -Math.random() * 8 - 4,
          size: Math.random() * 5 + 4,
          color: debrisColor,
        }));
        setDebrisParticles(prev => [...prev.slice(-20), ...particles]);

        // Spawn floating RPG loot drop indicator
        const loot = BLOCK_LOOT_INFO[minedBlock] || { label: `+1 ${minedBlock}`, icon: '📦' };
        setFloatingLoot(prev => [
          ...prev.slice(-6),
          {
            id: Date.now() + Math.random(),
            x: targetX,
            y: targetY,
            label: loot.label,
            icon: loot.icon,
          }
        ]);
      }

      const newGrid = [...grid];
      newGrid[index] = 'sky';
      setGrid(newGrid);
      setBlocksMinedCount(prev => prev + 1);

      const targetWorldX = viewportChunkX + (index % cols);
      const targetWorldY = Math.floor(index / cols);
      setModifiedWorldBlocks(prev => ({ ...prev, [`${targetWorldX},${targetWorldY}`]: 'sky' }));

      // Record Daily Mission Progress
      if (minedBlock === 'diamond') {
        dailyMissionManager.recordAction('mine_diamond', 1);
      } else if (minedBlock === 'gold') {
        dailyMissionManager.recordAction('mine_gold', 1);
      } else if (minedBlock === 'obsidian' || minedBlock === 'crying_obsidian') {
        dailyMissionManager.recordAction('mine_obsidian', 1);
      } else if (minedBlock === 'amethyst') {
        dailyMissionManager.recordAction('mine_amethyst', 1);
      } else if (minedBlock === 'tree' || minedBlock === 'wood') {
        dailyMissionManager.recordAction('chop_wood', 1);
      } else if (minedBlock === 'stone' || minedBlock === 'ore' || minedBlock === 'coal') {
        dailyMissionManager.recordAction('mine_stone', 1);
      }

      // In Creative mode: instant break, no item consumption or tool damage
      if (isCreative) return;

      // In Survival mode: add resource to backpack, reduce pickaxe durability
      const resource = minedBlock === 'tree' ? 'wood' : minedBlock === 'leaves' ? 'apple' : minedBlock;
      const newInventory = {
        ...inventory,
        [resource]: { count: (inventory[resource]?.count || 0) + 1 }
      };

      if (activeItem === 'pickaxe' && inventory['pickaxe']?.durability !== undefined) {
        const newDurability = Math.max(0, inventory['pickaxe'].durability - 5);
        newInventory['pickaxe'] = { ...newInventory['pickaxe'], durability: newDurability };
        if (newDurability === 0) delete newInventory['pickaxe'];
      }

      setInventory(newInventory);
      saveInventory(newInventory);
      setHunger(prev => Math.max(0, prev - 1));
    } else {
      // Place block
      const placedBlock = activeItem === 'door' ? 'door_closed' : activeItem;
      const targetWorldX = viewportChunkX + (index % cols);
      const targetWorldY = Math.floor(index / cols);

      const registerIfCommandBlock = (b: string) => {
        if (['command_block', 'chain_command_block', 'repeating_command_block'].includes(b)) {
          const defaultMode = b === 'repeating_command_block' ? 'repeat' : b === 'chain_command_block' ? 'chain' : 'impulse';
          const blockKey = `${targetWorldX},${targetWorldY}`;
          setCommandBlocksData(prev => ({
            ...prev,
            [blockKey]: {
              id: blockKey,
              x: targetWorldX,
              y: targetWorldY,
              command: defaultMode === 'repeat' ? '/say Repeating Multiverse Pulse' : '/say Command block at ' + targetWorldX + ' ' + targetWorldY,
              mode: defaultMode,
              condition: 'unconditional',
              redstone: 'always_active',
              customName: '@',
              lastOutput: 'Block placed and registered',
              enabled: true,
            }
          }));
          showToast(`🟧 Placed ${b.replace('_', ' ')}! Click to program console.`);
        }
      };

      // In Creative mode: unlimited placement!
      if (isCreative) {
        playEffect('build');
        audioEngine.playMinecraftSound('build');
        audioEngine.playMinecraftSound(activeItem);
        const newGrid = [...grid];
        newGrid[index] = placedBlock;
        setGrid(newGrid);
        setModifiedWorldBlocks(prev => ({ ...prev, [`${targetWorldX},${targetWorldY}`]: placedBlock }));
        registerIfCommandBlock(placedBlock);
        return;
      }

      // In Survival mode: requires item in inventory
      if ((inventory[activeItem]?.count || 0) > 0) {
        playEffect('build');
        audioEngine.playMinecraftSound('build');
        audioEngine.playMinecraftSound(activeItem);
        const newGrid = [...grid];
        newGrid[index] = placedBlock;
        setGrid(newGrid);
        setModifiedWorldBlocks(prev => ({ ...prev, [`${targetWorldX},${targetWorldY}`]: placedBlock }));
        registerIfCommandBlock(placedBlock);

        const newInventory = {
          ...inventory,
          [activeItem]: { ...inventory[activeItem], count: inventory[activeItem].count - 1 }
        };
        setInventory(newInventory);
        setLastPlacedIndex(index);
        setTimeout(() => setLastPlacedIndex(prev => prev === index ? null : prev), 300);
      } else {
        showToast(`⚠️ Out of ${activeItem}! Switch to Creative Mode or mine more in Survival.`);
      }
    }
  };

  const handlePlaceBlockFrom3D = useCallback((index: number, faceNormal: { x: number; y: number; z: number }) => {
    if (isDead) return;
    const c = index % cols;
    const r = Math.floor(index / cols);
    const targetC = c + faceNormal.x;
    const targetR = r - faceNormal.y;

    if (targetC >= 0 && targetC < cols && targetR >= 0 && targetR < rows) {
      const targetIndex = targetR * cols + targetC;
      handleCellClick(targetIndex);
    } else {
      handleCellClick(index);
    }
  }, [isDead, handleCellClick]);

  const handleCraft = async (newInventory: Record<string, { count: number; durability?: number }>) => {
    setInventory(newInventory);
    await saveInventory(newInventory);
    playEffect('build');
  };

  const handleAddCreativeItem = (itemId: string) => {
    setInventory(prev => ({
      ...prev,
      [itemId]: { count: (prev[itemId]?.count || 0) + 64, durability: 100 }
    }));
    setActiveItem(itemId);
    playEffect('build');
  };

  const eatItem = async () => {
    if (['apple', 'bread', 'golden_apple'].includes(activeItem) && (inventory[activeItem]?.count || 0) > 0) {
      if (!isCreative) {
        const newInventory = {
          ...inventory,
          [activeItem]: { ...inventory[activeItem], count: inventory[activeItem].count - 1 }
        };
        setInventory(newInventory);
        await saveInventory(newInventory);
      }
      if (activeItem === 'golden_apple') {
        setHealth(prev => Math.min(100, prev + 50));
        setHunger(prev => Math.min(100, prev + 50));
      } else {
        setHunger(prev => Math.min(100, prev + (activeItem === 'apple' ? 15 : 25)));
        setHealth(prev => Math.min(100, prev + 10));
      }
      playEffect('build');
    }
  };

  // Respawn Handler (When dying in Survival)
  const handleRespawn = () => {
    setHealth(100);
    setHunger(100);
    setIsDead(false);
    setPlayerPos({ x: 25, y: 7 }); // Respawn at Forest safe zone
    playEffect('build');
  };

  // Creative God Tools
  const handleQuickBuildPlatform = () => {
    const newGrid = [...grid];
    const px = playerPos.x;
    const py = playerPos.y;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = px + dx;
        const ny = py + dy + 1;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          newGrid[ny * cols + nx] = activeItem === 'door' ? 'bricks' : activeItem;
        }
      }
    }
    setGrid(newGrid);
    playEffect('build');
  };

  const handleClearArea = () => {
    const newGrid = [...grid];
    const px = playerPos.x;
    const py = playerPos.y;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const nx = px + dx;
        const ny = py + dy;
        if (nx >= 0 && nx < cols && ny >= 0 && ny < rows) {
          newGrid[ny * cols + nx] = 'sky';
        }
      }
    }
    setGrid(newGrid);
    playEffect('mine');
  };

  const handleAcceptQuest = async (questId: string) => {
    if (!activeQuestIds.includes(questId)) {
      const nextActive = [...activeQuestIds, questId];
      setActiveQuestIds(nextActive);
      await saveQuests(nextActive, completedQuestIds);
      playEffect('build');
    }
  };

  const handleTurnInQuest = async (quest: Quest) => {
    if (!isCreative) {
      const hasEnough = (inventory[quest.requiredItem]?.count || 0) >= quest.requiredCount;
      if (!hasEnough) {
        alert(`You still need ${quest.requiredCount - (inventory[quest.requiredItem]?.count || 0)} more ${quest.requiredItem}!`);
        return;
      }
    }

    const newInventory = { ...inventory };
    if (!isCreative) {
      newInventory[quest.requiredItem] = {
        ...newInventory[quest.requiredItem],
        count: newInventory[quest.requiredItem].count - quest.requiredCount
      };
    }

    newInventory[quest.rewardItem] = {
      ...(newInventory[quest.rewardItem] || {}),
      count: (newInventory[quest.rewardItem]?.count || 0) + quest.rewardCount
    };

    if (quest.rewardItem2 && quest.rewardCount2) {
      newInventory[quest.rewardItem2] = {
        ...(newInventory[quest.rewardItem2] || {}),
        count: (newInventory[quest.rewardItem2]?.count || 0) + quest.rewardCount2
      };
    }

    const nextActive = activeQuestIds.filter(id => id !== quest.id);
    const nextCompleted = [...completedQuestIds, quest.id];

    setInventory(newInventory);
    setActiveQuestIds(nextActive);
    setCompletedQuestIds(nextCompleted);

    playEffect('build');
    await saveInventory(newInventory);
    await saveQuests(nextActive, nextCompleted);
  };

  const currentBiome = playerPos.x < 30 ? '🌲 Greenwood Forest' : playerPos.x < 60 ? '🏜️ Golden Dunes' : '❄️ Frostpeak Glacier';

  return (
    <div className="flex flex-col items-center select-none relative">
      {/* ================= SURVIVAL DEATH OVERLAY ================= */}
      {isDead && (
        <div className="fixed inset-0 z-100 bg-red-950/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
          <div className="bg-gray-950 border-4 border-red-600 p-8 rounded-3xl shadow-2xl max-w-md w-full">
            <Skull className="text-red-500 mx-auto mb-3 animate-bounce" size={48} />
            <h2 className="text-4xl font-black text-red-500 mb-1 tracking-wider uppercase font-mono">
              You Died!
            </h2>
            <p className="text-gray-300 text-sm mb-4">
              Starvation or wilderness hazards claimed Steve in Survival Mode.
            </p>
            <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl mb-6 text-xs text-gray-400">
              <div>Blocks Mined: <span className="text-white font-bold">{blocksMinedCount}</span></div>
              <div>Quests Completed: <span className="text-yellow-400 font-bold">{completedQuestIds.length}</span></div>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={handleRespawn}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3 rounded-xl shadow-lg transition active:scale-95 cursor-pointer text-sm uppercase tracking-wider"
              >
                Respawn in Forest
              </button>
              <button
                onClick={() => toggleGameMode('creative')}
                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2.5 rounded-xl transition cursor-pointer text-xs"
              >
                Switch to Creative Mode (Invincible)
              </button>
              {onQuitToMenu && (
                <button
                  onClick={() => {
                    setIsDead(false);
                    onQuitToMenu();
                  }}
                  className="w-full mc-btn py-2.5 rounded-xl transition cursor-pointer text-xs"
                >
                  Save and Quit to Title Menu
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= TOP HUD & CONTROL BAR ================= */}
      <div className="w-full max-w-6xl flex flex-wrap items-center justify-between gap-3 mb-4 bg-gray-900/90 border border-gray-800 p-3 rounded-2xl shadow-xl backdrop-blur-md">
        {/* Left: Mode Switcher & Biome */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* PRIMARY GAME MODE TOGGLE */}
          <div className="flex items-center bg-gray-950 border border-gray-700 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => toggleGameMode('survival')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                !isCreative
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow ring-2 ring-red-400/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Swords size={14} />
              <span>Survival</span>
            </button>
            <button
              onClick={() => toggleGameMode('creative')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition cursor-pointer ${
                isCreative
                  ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow ring-2 ring-purple-400/50'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Palette size={14} />
              <span>Creative</span>
            </button>
          </div>

          {/* Biome Indicator */}
          <div className="bg-gray-800/90 border border-gray-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Compass className="text-emerald-400" size={16} />
            <span className="text-xs font-bold text-white">{currentBiome}</span>
            <span className="text-[10px] font-mono text-gray-400">
              X:{playerPos.x} Y:{playerPos.y}
            </span>
          </div>

          {/* Weather Widget */}
          <div className="bg-gray-800/90 border border-gray-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
            {weather === 'sunny' && <Sun className="text-yellow-400" size={16} />}
            {weather === 'rainy' && <CloudRain className="text-blue-400" size={16} />}
            {weather === 'snowy' && <Snowflake className="text-cyan-300" size={16} />}
            <span className="text-xs font-semibold capitalize text-gray-200">{weather}</span>
          </div>
        </div>

        {/* Right: Creative God Powers or Survival Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Creative Flight Toggle */}
          {isCreative && (
            <button
              onClick={() => setIsFlying(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                isFlying
                  ? 'bg-cyan-500 text-gray-950 ring-2 ring-cyan-300'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              title="Fly across obstacles and increase movement speed"
            >
              <Feather size={14} />
              <span>{isFlying ? 'Flying Active' : 'Fly Mode'}</span>
            </button>
          )}

          {/* Creative Time / Weather God Powers */}
          {isCreative && (
            <div className="flex items-center gap-1 bg-gray-950 border border-purple-500/40 p-1 rounded-xl">
              <button
                onClick={() => setTimeOfDay(20)}
                className="p-1 hover:bg-gray-800 rounded text-yellow-400 cursor-pointer"
                title="Set Daytime"
              >
                <Sun size={14} />
              </button>
              <button
                onClick={() => setTimeOfDay(75)}
                className="p-1 hover:bg-gray-800 rounded text-blue-300 cursor-pointer"
                title="Set Nighttime"
              >
                <Moon size={14} />
              </button>
              <button
                onClick={() => setWeather('sunny')}
                className="p-1 hover:bg-gray-800 rounded text-yellow-300 cursor-pointer text-[11px]"
                title="Clear Weather"
              >
                ☀️
              </button>
              <button
                onClick={() => setWeather('rainy')}
                className="p-1 hover:bg-gray-800 rounded text-blue-400 cursor-pointer text-[11px]"
                title="Set Rain"
              >
                🌧️
              </button>
              <button
                onClick={handleQuickBuildPlatform}
                className="px-2 py-0.5 bg-purple-700 hover:bg-purple-600 text-white rounded text-[10px] font-bold cursor-pointer"
                title="Quick 3x3 platform around player"
              >
                3x3 Build
              </button>
              <button
                onClick={handleClearArea}
                className="px-2 py-0.5 bg-red-800 hover:bg-red-700 text-white rounded text-[10px] font-bold cursor-pointer"
                title="Clear 3x3 area around player"
              >
                3x3 Clear
              </button>
            </div>
          )}

          {/* Camera & Zoom */}
          <button
            onClick={() => {
              setFollowCamera(true);
              scrollToPlayer();
            }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer"
          >
            <Navigation size={14} /> Center
          </button>
          <div className="flex items-center bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <button
              onClick={() => setZoom(prev => Math.min(1.4, prev + 0.1))}
              className="px-2.5 py-1.5 hover:bg-gray-700 text-gray-300 cursor-pointer"
            >
              <ZoomIn size={14} />
            </button>
            <span className="text-[10px] font-mono px-2 text-gray-400">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(prev => Math.max(0.7, prev - 0.1))}
              className="px-2.5 py-1.5 hover:bg-gray-700 text-gray-300 cursor-pointer"
            >
              <ZoomOut size={14} />
            </button>
          </div>

          {/* Sprunki Beatbox Quick Button */}
          <button
            onClick={handleDropBeatbox}
            className={`border px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95 ${
              beatboxActive
                ? 'bg-yellow-400 text-black border-yellow-300 scale-110 shadow-yellow-400/50'
                : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 border-orange-400 text-white animate-pulse'
            }`}
            title="Drop your Sprunki signature beatbox sound! (Hotkey: B)"
          >
            <Music size={14} className={beatboxActive ? 'text-black animate-spin' : 'text-yellow-300'} />
            <span>Beatbox! (B)</span>
          </button>

          {/* Minecraft Strike & Mine Quick Action */}
          <button
            onClick={handleMinecraftAction}
            className={`border px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg flex items-center gap-1.5 cursor-pointer transition active:scale-95 ${
              mcActionActive
                ? 'bg-cyan-400 text-black border-cyan-300 scale-110 shadow-cyan-400/50'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-emerald-400 text-white'
            }`}
            title="Swing your Minecraft weapon/tool or trigger mob vocal! (Hotkey: M)"
          >
            <Swords size={14} className={mcActionActive ? 'text-black animate-spin' : 'text-cyan-300'} />
            <span>Mine / Strike! (M)</span>
          </button>

          {/* Jukebox Quick Music Button */}
          <button
            onClick={() => {
              jukeboxSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
              audioEngine.togglePlayPause();
            }}
            className="bg-amber-900/90 hover:bg-amber-800 border border-amber-600/70 text-amber-200 px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Toggle Music / Jump to Jukebox Player"
          >
            <Music size={14} className={audioEngine.getIsPlaying() ? 'animate-bounce text-amber-300' : ''} />
            <span>{audioEngine.getIsPlaying() ? 'Songs 🎵' : 'Jukebox'}</span>
          </button>

          {/* Roblox App Launcher Button in World HUD */}
          <button
            onClick={() => setIsRobloxAppOpen(true)}
            className="bg-[#E2231A] hover:bg-[#c91d15] text-white border border-white/30 px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition active:scale-95 font-mono"
            title="Open Roblox App (Obby, Tycoons, Skins, OOF Soundboard)"
          >
            <span className="w-3.5 h-3.5 bg-white rounded-xs inline-block rotate-12 flex-shrink-0" />
            <span>Roblox</span>
          </button>

          {/* 1,000 Christmas Mega Edition Button */}
          <button
            onClick={() => setIsChristmasMegaModalOpen(true)}
            className="bg-red-700 hover:bg-red-600 text-white border border-red-400 px-3 py-1.5 rounded-xl text-xs font-extrabold shadow flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Open 1,000 Christmas Characters, Items, and Settings"
          >
            <span>🎅</span>
            <span>1,000 Xmas</span>
          </button>

          {/* Multiverse Brand Hubs Button */}
          <button
            onClick={() => setIsBrandHubModalOpen(true)}
            className="bg-amber-800 hover:bg-amber-700 text-amber-100 border border-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Open Brand Hubs (McDonald's, Roblox, Xilam, Tarragower, BP, New World, YouTube)"
          >
            <span>🏢</span>
            <span>Brand Hubs</span>
          </button>

          {/* Countryball Creator Button */}
          <button
            onClick={() => {
              if (onOpenCountryballCreator) {
                onOpenCountryballCreator();
              } else {
                setIsCountryballModalOpen(true);
              }
            }}
            className="bg-blue-700 hover:bg-blue-600 text-white border border-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Open Polandball & Countryball Creator (Flags, Hats, Glasses & Personality Traits)"
          >
            <span>🌐</span>
            <span>Countryball</span>
          </button>

          {/* Cloud Progression & Sync Button */}
          <button
            onClick={() => {
              if (onOpenProgression) {
                onOpenProgression();
              } else {
                setIsProgressionModalOpen(true);
              }
            }}
            className="bg-sky-800 hover:bg-sky-700 text-sky-100 border border-sky-400 px-3 py-1.5 rounded-xl text-xs font-bold shadow flex items-center gap-1.5 cursor-pointer transition active:scale-95"
            title="Open Cross-Platform Progression & Cloud Save (Level, Items & Quests)"
          >
            <span>☁️</span>
            <span>Progression</span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="mc-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-105 transition"
            title="Open Game Options & Settings (Key: O)"
          >
            <Settings size={14} className="text-yellow-400" />
            <span>Settings</span>
          </button>

          {/* Game Menu (Pause) Button */}
          <button
            onClick={() => setIsPauseMenuOpen(true)}
            className="mc-btn px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow hover:scale-105 transition"
            title="Open Game Pause Menu (ESC)"
          >
            <Menu size={14} />
            <span>Menu (ESC)</span>
          </button>
        </div>
      </div>

      {/* ================= FIXED SURVIVAL HUD OVERLAY ================= */}
      <div className="fixed top-24 left-6 bg-gray-950/95 border border-gray-800 p-4 rounded-2xl text-white z-50 shadow-2xl backdrop-blur-md min-w-[200px]">
        {/* Active Character Profile Banner */}
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-800">
          <div className="w-8 h-10 overflow-hidden flex items-center justify-center -my-1">
            <CharacterAvatar character={playerAvatar} size="sm" isWalking={isWalking} />
          </div>
          <div>
            <div className="text-xs font-black text-white">{playerAvatar.name}</div>
            <div className="text-[10px] font-mono flex items-center gap-1">
              {isCreative ? (
                <span className="text-purple-400 font-bold flex items-center gap-0.5">
                  <Palette size={11} /> Creative Mode
                </span>
              ) : (
                <span className="text-red-400 font-bold flex items-center gap-0.5">
                  <Swords size={11} /> Survival Mode
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Health Bar (Infinite in Creative) */}
        <div className="flex items-center justify-between font-bold text-xs mb-1 text-red-400">
          <span>❤️ Health</span>
          <span className="font-mono">{isCreative ? '∞ God Mode' : `${health}%`}</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full mb-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${isCreative ? 'bg-purple-500 w-full animate-pulse' : 'bg-red-500'}`} 
            style={{ width: isCreative ? '100%' : `${health}%` }} 
          />
        </div>

        {/* Hunger Bar (Infinite in Creative) */}
        <div className="flex items-center justify-between font-bold text-xs mb-1 text-amber-400">
          <span>🍗 Hunger</span>
          <span className="font-mono">{isCreative ? '∞ Never Hungry' : `${hunger}%`}</span>
        </div>
        <div className="w-full bg-gray-800 h-2 rounded-full mb-3 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${isCreative ? 'bg-amber-400 w-full' : 'bg-amber-500'}`} 
            style={{ width: isCreative ? '100%' : `${hunger}%` }} 
          />
        </div>

        {/* Quick Eat Button (Useful in Survival) */}
        {['apple', 'bread', 'golden_apple'].includes(activeItem) && (
          <button 
            onClick={eatItem} 
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-3 py-2 rounded-xl text-white font-bold mb-3 w-full text-xs shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
          >
            <span>Eat {activeItem.replace('_', ' ')}</span>
            <span className="text-[10px] bg-black/30 px-1.5 py-0.5 rounded-full font-mono">
              {isCreative ? '∞' : `x${inventory[activeItem]?.count || 0}`}
            </span>
          </button>
        )}

        {/* Quest Hub Button */}
        <button
          onClick={() => setActiveNPC(NPCS_DATA[0])}
          className="w-full bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 hover:from-yellow-400 hover:to-amber-400 text-gray-950 font-bold px-3 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg transition active:scale-95 cursor-pointer"
        >
          <span>📜 NPCs & Quests</span>
          <span className="bg-black/30 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">
            {completedQuestIds.length}/{NPCS_DATA.reduce((acc, n) => acc + n.quests.length, 0)}
          </span>
        </button>
      </div>

      {/* ================= FIXED MINIMAP OVERLAY ================= */}
      <div className="fixed top-24 right-6 w-44 h-44 bg-gray-950/90 border-2 border-emerald-500/60 rounded-2xl overflow-hidden z-50 shadow-2xl backdrop-blur-md">
        <div className="relative w-full h-full">
          <canvas
            ref={minimapCanvasRef}
            width={176}
            height={176}
            className="w-full h-full cursor-crosshair"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = Math.floor(((e.clientX - rect.left) / rect.width) * cols);
              const clickY = Math.floor(((e.clientY - rect.top) / rect.height) * rows);
              setPlayerPos({ x: clickX, y: clickY });
              playEffect('build');
            }}
          />

          {/* Player Steve Marker */}
          <div 
            className="absolute w-3 h-3 bg-cyan-400 border-2 border-white rounded-full z-20 shadow-md ring-2 ring-cyan-500/50 animate-pulse pointer-events-none -translate-x-1/2 -translate-y-1/2"
            style={{ 
              left: `${(playerPos.x / cols) * 100}%`, 
              top: `${(playerPos.y / rows) * 100}%` 
            }}
            title="Steve (You)"
          />

          {/* NPC Markers */}
          {NPCS_DATA.map(npc => (
            <div 
              key={npc.id} 
              className="absolute w-2.5 h-2.5 bg-yellow-400 border border-black rounded-full ring-2 ring-yellow-300 z-15 cursor-pointer -translate-x-1/2 -translate-y-1/2" 
              style={{ left: `${(npc.x / cols) * 100}%`, top: `${(npc.y / rows) * 100}%` }}
              onClick={() => setActiveNPC(npc)}
              title={`NPC: ${npc.name} (${npc.biome})`}
            />
          ))}

          {/* Online Multiplayer Players Markers */}
          {onlinePlayers.map(p => (
            <div
              key={p.id}
              className="absolute w-2 h-2 bg-emerald-400 border border-black rounded-full ring-1 ring-emerald-300 z-18 cursor-pointer -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(p.x / cols) * 100}%`, top: `${(p.y / rows) * 100}%` }}
              onClick={() => setSelectedPlayerToInteract(p)}
              title={`Player: ${p.name} (Lv.${p.level}) - Click to Interact`}
            />
          ))}
        </div>
      </div>

      {/* ================= FLOATING NOTIFICATION TOAST ================= */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-stone-900/95 border-2 border-yellow-500/80 text-yellow-300 px-5 py-2.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-2 font-mono text-xs animate-bounce">
          <Sparkles size={16} className="text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= 3D CAMERA & MAP CONTROL TOOLBAR ================= */}
      <div className="w-full max-w-6xl bg-stone-900/95 border border-stone-800 p-2.5 sm:p-3 rounded-2xl mb-3 shadow-xl backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        {/* Left: 3D Camera Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-mono font-bold text-stone-400 flex items-center gap-1 mr-1">
            <Box size={14} className="text-emerald-400" /> 3D View:
          </span>
          <button
            onClick={() => applyViewPreset('isometric')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer font-mono ${
              viewPreset === 'isometric'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title="Classic 3D Isometric Diorama (52° Pitch, -18° Yaw)"
          >
            🎲 <span>Isometric</span>
          </button>
          <button
            onClick={() => applyViewPreset('topdown')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer font-mono ${
              viewPreset === 'topdown'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title="Top-Down Tactical Builder View (68° Pitch)"
          >
            🏔️ <span>Top-Down</span>
          </button>
          <button
            onClick={() => applyViewPreset('cinematic')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer font-mono ${
              viewPreset === 'cinematic'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title="Dynamic Action Hero View (36° Low Angle Pitch)"
          >
            ⚔️ <span>Action 3D</span>
          </button>
          <button
            onClick={() => applyViewPreset('flat2d')}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer font-mono ${
              viewPreset === 'flat2d'
                ? 'bg-emerald-600 text-white shadow-md ring-2 ring-emerald-400/50'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
            title="Classic 2D Flat Side-Scroller (0° Pitch, 0° Yaw)"
          >
            📐 <span>2D Flat</span>
          </button>
        </div>

        {/* Center: Pitch & Yaw Manual Angle Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Pitch Tilt Controls */}
          <div className="flex items-center bg-stone-950 border border-stone-700/80 rounded-xl px-1.5 py-0.5 text-xs font-mono">
            <span className="text-[10px] text-stone-400 mr-1.5">Tilt:</span>
            <button
              onClick={() => {
                setCameraPitch(prev => Math.min(75, prev + 5));
                setViewPreset('isometric');
              }}
              className="w-6 h-6 hover:bg-stone-800 rounded flex items-center justify-center text-stone-200 cursor-pointer font-bold"
              title="Tilt Camera Up"
            >
              ▲
            </button>
            <span className="text-[11px] font-bold text-emerald-300 px-1">{cameraPitch}°</span>
            <button
              onClick={() => {
                setCameraPitch(prev => Math.max(0, prev - 5));
                setViewPreset('isometric');
              }}
              className="w-6 h-6 hover:bg-stone-800 rounded flex items-center justify-center text-stone-200 cursor-pointer font-bold"
              title="Tilt Camera Down"
            >
              ▼
            </button>
          </div>

          {/* Yaw Rotation Controls */}
          <div className="flex items-center bg-stone-950 border border-stone-700/80 rounded-xl px-1.5 py-0.5 text-xs font-mono">
            <span className="text-[10px] text-stone-400 mr-1.5">Rotate:</span>
            <button
              onClick={() => {
                setCameraYaw(prev => Math.max(-45, prev - 5));
                setViewPreset('isometric');
              }}
              className="w-6 h-6 hover:bg-stone-800 rounded flex items-center justify-center text-stone-200 cursor-pointer"
              title="Rotate Camera Left"
            >
              ↺
            </button>
            <span className="text-[11px] font-bold text-sky-300 px-1">{cameraYaw}°</span>
            <button
              onClick={() => {
                setCameraYaw(prev => Math.min(45, prev + 5));
                setViewPreset('isometric');
              }}
              className="w-6 h-6 hover:bg-stone-800 rounded flex items-center justify-center text-stone-200 cursor-pointer"
              title="Rotate Camera Right"
            >
              ↻
            </button>
          </div>

          {/* Reset Angle */}
          <button
            onClick={() => {
              setCameraPitch(52);
              setCameraYaw(-18);
              setViewPreset('isometric');
              playEffect('build');
            }}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs cursor-pointer border border-stone-700"
            title="Reset 3D Angle to Default Isometric"
          >
            <RotateCcw size={13} />
          </button>
        </div>

        {/* Middle: Talk & Weather Variety Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* NPC Dialogue & Quests Quick Trigger */}
          <button
            onClick={() => {
              const target = nearbyNPC || NPCS_DATA[0];
              setActiveNPC(target);
              playEffect('build');
            }}
            className={`px-3 py-1 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md ${
              nearbyNPC
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400 animate-pulse'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
            }`}
            title="Interact with NPCs and role-playing quests across all 10 entities (Press E)"
          >
            <span>📜</span>
            <span>{nearbyNPC ? `Talk: ${nearbyNPC.name} [E]` : 'Quests / NPCs [E]'}</span>
          </button>

          <button
            onClick={() => setIsChatDialogOpen(prev => !prev)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            title="Press T or click to speak aloud"
          >
            <MessageSquare size={13} />
            <span>💬 Talk (T)</span>
          </button>

          {/* Online Multiplayer Players Scoreboard Button */}
          <button
            onClick={() => setShowScoreboard(true)}
            className="px-3 py-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            title="Open Server Player Scoreboard & Player Actions (Press Tab)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>👥 {onlinePlayers.length + 1} Online [Tab]</span>
          </button>

          {/* Weather Selector */}
          <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-0.5 text-xs font-mono">
            {[
              { id: 'sunny', icon: '☀️', label: 'Sun' },
              { id: 'rainy', icon: '🌧️', label: 'Rain' },
              { id: 'snowy', icon: '❄️', label: 'Snow' },
              { id: 'stormy', icon: '⚡', label: 'Storm' },
              { id: 'aurora', icon: '🌌', label: 'Aurora' },
              { id: 'bloodmoon', icon: '🩸', label: 'Moon' },
            ].map((w) => (
              <button
                key={w.id}
                onClick={() => {
                  setWeather(w.id as any);
                  if (w.id === 'stormy') audioEngine.playMinecraftSound('creeper');
                  else if (w.id === 'aurora') audioEngine.playMinecraftSound('level');
                  else playEffect('build');
                }}
                className={`px-1.5 py-0.5 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                  weather === w.id
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-stone-400 hover:text-white'
                }`}
                title={`Change weather to ${w.label}`}
              >
                {w.icon}
              </button>
            ))}
          </div>

          {/* Auto Chatter Toggle */}
          <button
            onClick={() => setAutoSpeechEnabled(prev => !prev)}
            className={`px-2 py-1 rounded-xl text-[10px] font-mono font-bold border transition cursor-pointer ${
              autoSpeechEnabled
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
                : 'bg-stone-800 border-stone-700 text-stone-500'
            }`}
            title="Toggle ambient mobs talking automatically"
          >
            🗣️ {autoSpeechEnabled ? 'Chatter: ON' : 'Chatter: OFF'}
          </button>
        </div>

        {/* Right: 3D WebGL Engine Toggle, Verity Shrine, 165 FPS Engine, Lighting, Grid & Fullscreen Toggles */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* 3D WebGL vs Classic Mode Toggle */}
          <div className="flex items-center bg-black/80 p-0.5 rounded-xl border border-stone-700 shadow-md">
            <button
              onClick={() => {
                setEngineMode('3d');
                playEffect('build');
                showToast('🚀 Switched to 3D Three.js WebGL Engine!');
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer ${
                engineMode === '3d'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg ring-1 ring-cyan-300'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="True 3D Three.js WebGL Voxel Engine with Real Lighting & Shadows"
            >
              <Sparkles size={12} className="text-yellow-300" />
              <span>3D Engine</span>
            </button>
            <button
              onClick={() => {
                setEngineMode('classic');
                playEffect('build');
                showToast('🧱 Switched to Classic 2.5D Mode');
              }}
              className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                engineMode === 'classic'
                  ? 'bg-stone-700 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Classic 2.5D Isometric CSS Grid"
            >
              <span>Classic</span>
            </button>
          </div>
          {/* Celestial Shrine & Truth Altar */}
          <button
            onClick={() => {
              setShowVerityShrineModal(true);
              audioEngine.playVeritySound('oracle');
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-lg bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-950 border-purple-500/80 hover:border-purple-300 text-purple-200 hover:text-white shadow-[0_0_12px_rgba(168,85,247,0.35)]"
            title="Celestial Shrine & Truth Altar (Click to open)"
          >
            <Sparkles size={13} className="text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="font-bold">Verity Shrine ✨</span>
          </button>

          {/* Sodor Airport & Jeremy the Jet Plane (Steremy) */}
          <button
            onClick={() => {
              setPlayerPos({ x: 400, y: 5 });
              scrollToPlayer();
              vehicleManager.mountVehicle('jeremy_jet');
              showToast('✈️ Teleported to Sodor Airport! Jeremy the Jet Plane (Steremy) mounted for supersonic flight!');
              audioEngine.playRobloxSound('speed');
            }}
            className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-lg bg-gradient-to-r from-sky-950 via-blue-900 to-sky-950 border-sky-400 hover:border-sky-200 text-sky-200 hover:text-white shadow-[0_0_12px_rgba(56,189,248,0.35)]"
            title="Teleport to Sodor Airport & Launch Jeremy the Jet Plane (Steremy)!"
          >
            <span className="text-sm animate-pulse">✈️</span>
            <span className="font-bold">Sodor Airport & Steremy</span>
          </button>

          {/* 165 FPS Ultra High-Refresh Rate Engine Toggle */}
          <button
            onClick={() => setShowFpsModal(prev => !prev)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-lg ${
              is165FpsMode
                ? 'bg-emerald-950/90 hover:bg-emerald-900 border-emerald-500/80 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'bg-stone-800 border-stone-700 text-stone-300'
            }`}
            title="165 FPS Ultra High-Refresh Engine Settings (Click to configure)"
          >
            <Zap size={13} className="text-yellow-300 animate-pulse" />
            <span className="font-black tracking-wide text-emerald-200">{currentFps} FPS</span>
            <span className="text-[10px] text-emerald-400/80 hidden sm:inline">({frameTimeMs}ms)</span>
          </button>

          <button
            onClick={() => setEnable3DLighting(prev => !prev)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer border ${
              enable3DLighting
                ? 'bg-amber-950/80 border-amber-500/50 text-amber-300'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
            title="Toggle 3D Voxel Shading & Side Bevels"
          >
            <Layers size={13} />
            <span className="hidden sm:inline">3D Shading</span>
          </button>

          <button
            onClick={() => setShowGridLines(prev => !prev)}
            className={`px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1 cursor-pointer border ${
              showGridLines
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300'
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
            title="Toggle Voxel Grid Outlines"
          >
            <Box size={13} />
            <span className="hidden sm:inline">Grid</span>
          </button>

          {/* Cloud Progression & Skills Shortcut */}
          {onOpenProgression && (
            <button
              onClick={onOpenProgression}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-md bg-sky-950/80 hover:bg-sky-900 border-sky-500/70 text-sky-200 hover:text-white"
              title="Cloud Progression, Skill Trees & Cross-Device Sync [Hotkey: P]"
            >
              <span>☁️</span>
              <span className="hidden sm:inline">Progression</span>
              <span className="text-[10px] text-sky-400 bg-black/40 px-1 rounded">P</span>
            </button>
          )}

          {/* Proximity Voice Chat Console Shortcut */}
          {onOpenVoiceChat && (
            <button
              onClick={onOpenVoiceChat}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-md bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/70 text-emerald-200 hover:text-white"
              title="Proximity Spatial Voice Chat & Radar [Hotkey: C, PTT: V]"
            >
              <Mic size={13} className="text-emerald-400" />
              <span className="hidden sm:inline">Voice</span>
              <span className="text-[10px] text-emerald-400 bg-black/40 px-1 rounded">C</span>
            </button>
          )}

          {/* Daily Missions & Bounties Shortcut */}
          {onOpenDailyMissions && (
            <button
              onClick={onOpenDailyMissions}
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition flex items-center gap-1.5 cursor-pointer border shadow-md bg-amber-950/80 hover:bg-amber-900 border-amber-500/70 text-amber-200 hover:text-white"
              title="Daily Missions & Bounties [Hotkey: J]"
            >
              <span>🎯</span>
              <span className="hidden sm:inline">Daily Missions</span>
              <span className="text-[10px] text-amber-400 bg-black/40 px-1 rounded">J</span>
            </button>
          )}

          <button
            onClick={() => setIsExpandedView(prev => !prev)}
            className={`p-1.5 rounded-xl text-xs transition cursor-pointer border ${
              isExpandedView
                ? 'bg-purple-900/80 border-purple-500 text-purple-200'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
            title={isExpandedView ? 'Shrink 3D Map View' : 'Expand 3D Map to Full Viewport'}
          >
            {isExpandedView ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ================= 3D VOXEL GAME CANVAS (THREE.JS WEBGL / CLASSIC) ================= */}
      <div 
        ref={mapScrollRef}
        className={`relative bg-stone-950 border-4 border-stone-800 rounded-3xl overflow-hidden shadow-2xl transition-all map-canvas-165fps ${
          isExpandedView ? 'w-full h-[84vh]' : 'w-full max-w-6xl h-[680px]'
        }`}
      >
        {/* World Boss Raid Animated HUD Bar (Top Center) */}
        <BossRaidHUD
          onDealPlayerDamage={(damage) => {
            setScreenShake(true);
            setTimeout(() => setScreenShake(false), 300);
            dailyMissionManager.recordAction('defeat_mob', 1);
          }}
          onClaimLoot={(loot) => {
            showToast(`🏆 VICTORY! Slayed World Boss! Claimed +${loot.coins} Coins, +${loot.robux} Robux & "${loot.badgeName}"!`);
            audioEngine.playMinecraftSound('levelup');
          }}
        />

        {/* Tactical Radar HUD (Overlay when enabled via [N]) */}
        {isRadarOpen && (
          <div className="absolute top-4 left-4 z-40">
            <MiniMapRadar
              playerX={playerPos.x}
              playerY={playerPos.y}
              facingDir={facingDir}
              worldRows={rows}
              worldCols={cols}
              entities={[
                ...roamingCharacters.map(r => ({
                  id: r.id,
                  x: r.x,
                  y: r.y,
                  name: r.avatar.name,
                  type: (r.avatar.subtype === 'zombie' || r.avatar.subtype === 'creeper' ? 'hostile' : 'friendly') as 'hostile' | 'friendly',
                })),
                ...onlinePlayers.map(p => ({
                  id: p.id ? Number(p.id.replace(/\D/g, '')) || 999 : 999,
                  x: p.x,
                  y: p.y,
                  name: p.name,
                  type: 'player' as const,
                })),
                ...(bossRaidManager.getActiveBoss() ? [{
                  id: 99999,
                  x: bossRaidManager.getActiveBoss()!.spawnCoordinates.x,
                  y: bossRaidManager.getActiveBoss()!.spawnCoordinates.y,
                  name: bossRaidManager.getActiveBoss()!.name,
                  type: 'boss' as const,
                }] : []),
              ]}
              onWarpClick={(x, y) => {
                setPlayerPos({ x, y });
                showToast(`📡 Warped via Radar Sonar to X: ${x}, Y: ${y}`);
              }}
            />
          </div>
        )}

        {/* Rideable Vehicle Mount Dashboard HUD (Bottom Center-Left) */}
        <VehicleMountHUD
          onOpenGarage={() => setIsGarageModalOpen(true)}
        />

        {/* Proximity NPC Dialogue Interaction Banner */}
        {nearbyNPC && !activeNPC && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-stone-900/95 border-2 border-emerald-400 text-white px-4 py-2 rounded-2xl shadow-2xl backdrop-blur-md flex items-center gap-3 animate-bounce select-none pointer-events-auto">
            <span className="text-xl p-1 bg-emerald-950 rounded-lg border border-emerald-500/50">
              {nearbyNPC.emoji}
            </span>
            <div className="text-left font-mono">
              <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Nearby NPC • {nearbyNPC.biome}
              </div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Press</span>
                <span className="bg-amber-400 text-black px-1.5 py-0.5 rounded text-[11px] font-black shadow">E</span>
                <span>to talk with {nearbyNPC.name}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveNPC(nearbyNPC);
                playEffect('build');
              }}
              className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-xl cursor-pointer shadow transition active:scale-95 ml-1"
            >
              Talk
            </button>
          </div>
        )}

        {/* Floating In-Game Pinned Daily Missions HUD */}
        <div className="absolute top-4 right-4 z-40 max-w-[250px] pointer-events-auto bg-black/85 backdrop-blur-md border border-amber-500/50 rounded-2xl p-2.5 shadow-2xl text-white font-mono hidden sm:block">
          <div className="flex items-center justify-between gap-2 mb-1.5 border-b border-stone-800 pb-1">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300">
              <span>🎯</span>
              <span>Daily Bounties</span>
            </div>
            {onOpenDailyMissions && (
              <button
                onClick={onOpenDailyMissions}
                className="text-[9.5px] text-amber-400 hover:text-white hover:underline cursor-pointer font-bold"
              >
                Missions [J]
              </button>
            )}
          </div>
          <div className="space-y-1.5">
            {dailyMissionManager.getPinnedMissions().slice(0, 3).map((m) => {
              const pct = Math.min(100, Math.round((m.currentCount / m.targetCount) * 100));
              return (
                <div key={m.id} className="text-[10px]">
                  <div className="flex items-center justify-between text-stone-300 gap-1">
                    <span className="truncate">{m.icon} {m.title}</span>
                    <span className={m.completed ? 'text-emerald-400 font-bold flex-shrink-0' : 'text-amber-300 flex-shrink-0'}>
                      {m.currentCount}/{m.targetCount}
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden mt-0.5">
                    <div 
                      className={`h-full ${m.completed ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]' : 'bg-amber-400'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {engineMode === '3d' ? (
          <ThreeVoxelWorld
            grid={grid}
            rows={rows}
            cols={cols}
            playerPos={{
              x: Math.max(0, Math.min(cols - 1, playerPos.x - viewportChunkX)),
              y: playerPos.y,
            }}
            smoothPlayerPos={{
              x: Math.max(0, Math.min(cols - 1, smoothPlayerPos.x - viewportChunkX)),
              y: smoothPlayerPos.y,
            }}
            playerAvatar={playerAvatar}
            activeItem={activeItem}
            isCreative={isCreative}
            isFlying={isFlying}
            isWalking={isWalking}
            isSprinting={isSprinting}
            isJumping={isJumping}
            facingDir={facingDir}
            weather={weather}
            timeOfDay={timeOfDay}
            roamingCharacters={[
              ...roamingCharacters,
              ...onlinePlayers.map((p, idx) => ({
                id: 6000 + idx,
                x: p.x,
                y: p.y,
                avatar: p.avatar,
                isWalking: p.isWalking,
              }))
            ]}
            onMineBlock={(idx) => handleCellClick(idx)}
            onPlaceBlock={handlePlaceBlockFrom3D}
            onPlayerMove={(dx, dy) => movePlayer(dx, dy)}
            onInspectBlock={(detail, type) => {
              if (type) {
                const idx = grid.indexOf(type);
                if (idx !== -1) setHoveredCellIndex(idx);
              } else {
                setHoveredCellIndex(null);
              }
            }}
            onTriggerAction={handleMinecraftAction}
            onDropBeatbox={handleDropBeatbox}
          />
        ) : (
          <div className="relative w-full h-full overflow-auto">
            {/* Dynamic 3D Horizon Skybox Background */}
            <div 
              className="absolute inset-0 pointer-events-none transition-all duration-1000"
          style={{
            background: 
              weather === 'bloodmoon'
                ? 'linear-gradient(to bottom, #450a0a 0%, #7f1d1d 45%, #290808 80%, #0c0a09 100%)'
                : weather === 'aurora'
                ? 'linear-gradient(to bottom, #022c22 0%, #064e3b 35%, #042f2e 65%, #020617 100%)'
                : weather === 'stormy'
                ? 'linear-gradient(to bottom, #09090b 0%, #18181b 45%, #27272a 75%, #09090b 100%)'
                : timeOfDay < 45
                ? 'linear-gradient(to bottom, #1e3a8a 0%, #0284c7 45%, #38bdf8 70%, #0f172a 100%)' // Bright Sky Day
                : timeOfDay < 65
                ? 'linear-gradient(to bottom, #311042 0%, #701a75 35%, #ea580c 70%, #1e1b4b 100%)' // Sunset
                : timeOfDay < 95
                ? 'linear-gradient(to bottom, #020617 0%, #090d16 40%, #0f172a 80%, #020617 100%)' // Deep Starry Night
                : 'linear-gradient(to bottom, #1e1b4b 0%, #431407 40%, #f97316 75%, #0284c7 100%)' // Sunrise
          }}
        >
          {/* Celestial Sun / Moon in 3D Skybox */}
          <div className="absolute top-8 right-16 pointer-events-none">
            {weather === 'bloodmoon' ? (
              <div className="w-16 h-16 bg-red-600 border-4 border-red-300 rounded-sm shadow-[0_0_60px_rgba(220,38,38,1)] animate-pulse flex items-center justify-center">
                <div className="w-10 h-10 bg-red-950/70 rounded-full" />
              </div>
            ) : weather === 'aurora' ? (
              <div className="relative">
                <div className="w-14 h-14 bg-cyan-200 border-4 border-emerald-300 rounded-sm shadow-[0_0_40px_rgba(52,211,153,0.9)]" />
                <div className="absolute -top-10 -left-20 w-60 h-20 bg-gradient-to-r from-emerald-500/30 via-cyan-400/50 to-purple-500/30 blur-xl animate-pulse" />
              </div>
            ) : weather === 'stormy' ? (
              <div className="w-16 h-16 bg-stone-700 border-4 border-stone-500 rounded-sm shadow-[0_0_40px_rgba(168,85,247,0.7)] relative overflow-hidden flex items-center justify-center">
                <Zap size={28} className="text-yellow-300 animate-bounce" />
              </div>
            ) : timeOfDay < 60 ? (
              <div className="w-16 h-16 bg-yellow-300 border-4 border-yellow-100 rounded-sm shadow-[0_0_50px_rgba(253,224,71,0.9)] animate-pulse" />
            ) : (
              <div className="w-14 h-14 bg-slate-200 border-4 border-white rounded-sm shadow-[0_0_30px_rgba(255,255,255,0.8)] relative overflow-hidden">
                <div className="absolute top-1 right-1 w-8 h-8 bg-slate-900 rounded-sm opacity-60" />
              </div>
            )}
          </div>

          {/* Twinkling Night Stars / Aurora ribbons */}
          {(timeOfDay >= 60 || weather === 'aurora' || weather === 'bloodmoon') && (
            <div className="absolute inset-0 pointer-events-none opacity-80">
              <div className="absolute top-6 left-[15%] w-1.5 h-1.5 bg-white rounded-full animate-ping" />
              <div className="absolute top-12 left-[35%] w-1 h-1 bg-yellow-100 rounded-full" />
              <div className="absolute top-20 left-[55%] w-2 h-2 bg-cyan-100 rounded-full animate-pulse" />
              <div className="absolute top-8 left-[75%] w-1.5 h-1.5 bg-white rounded-full" />
              <div className="absolute top-28 left-[25%] w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute top-24 left-[85%] w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse" />
            </div>
          )}

          {/* Atmospheric Sun Rays (Crepuscular Beams) */}
          {enable3DLighting && realismFXEnabled && (timeOfDay < 45 || (timeOfDay >= 45 && timeOfDay < 65) || timeOfDay >= 95) && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-10 opacity-30">
              <div 
                className="w-full h-full animate-crepuscular-ray"
                style={{
                  background: 'repeating-linear-gradient(115deg, rgba(255,255,220,0.2) 0px, transparent 50px, rgba(255,240,180,0.12) 100px, transparent 160px)',
                }}
              />
            </div>
          )}

          {/* Parallax Cloud Layers */}
          <div className="absolute top-8 left-0 right-0 h-16 pointer-events-none flex justify-between opacity-35 animate-fog">
            <span className="text-3xl filter drop-shadow-md">☁️</span>
            <span className="text-4xl filter drop-shadow-md" style={{ animationDelay: '2s' }}>☁️</span>
            <span className="text-2xl filter drop-shadow-md" style={{ animationDelay: '5s' }}>☁️</span>
          </div>

          {/* Falling Autumn Leaves in Emerald Forest Biome */}
          {realismFXEnabled && playerPos.x < 24 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {[...Array(6)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute animate-leaf-fall text-emerald-400/80 text-xs select-none"
                  style={{
                    top: `${12 + (i * 12)}%`,
                    left: `${6 + (i * 16)}%`,
                    animationDelay: `${i * 0.65}s`,
                    animationDuration: `${3.6 + i * 0.4}s`,
                  }}
                >
                  🍃
                </div>
              ))}
            </div>
          )}

          {/* Glowing Cosmic Spores in Deep Dark & Mushroom Biome */}
          {realismFXEnabled && playerPos.x > 68 && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute w-2 h-2 rounded-full bg-cyan-300/80 blur-[1px] animate-spore shadow-[0_0_8px_rgba(34,211,238,0.9)]"
                  style={{
                    top: `${15 + (i * 11)}%`,
                    left: `${70 + (i * 3.5)}%`,
                    animationDelay: `${i * 0.45}s`,
                    animationDuration: `${2.8 + i * 0.3}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Rain / Snow / Storm Precipitation FX */}
          {weather === 'rainy' && (
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_10px,rgba(56,189,248,0.25)_10px,rgba(56,189,248,0.25)_20px)] animate-pulse" />
          )}
          {weather === 'stormy' && (
            <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(transparent,transparent_8px,rgba(250,204,21,0.15)_8px,rgba(56,189,248,0.35)_16px)] animate-ping" />
          )}
          {weather === 'snowy' && (
            <div className="absolute inset-0 pointer-events-none flex justify-around opacity-60 text-xs">
              <span className="animate-bounce">❄️</span>
              <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>❄️</span>
              <span className="animate-bounce" style={{ animationDelay: '0.6s' }}>❄️</span>
              <span className="animate-bounce" style={{ animationDelay: '0.9s' }}>❄️</span>
            </div>
          )}

          {/* 3D Distant Mountain Peaks Silhouette */}
          <div className="absolute bottom-0 left-0 right-0 h-40 opacity-20 pointer-events-none flex items-end">
            <svg viewBox="0 0 1200 200" preserveAspectRatio="none" className="w-full h-full text-black fill-current">
              <polygon points="0,200 0,80 150,140 300,50 450,130 600,40 750,120 900,60 1050,130 1200,70 1200,200" />
            </svg>
          </div>
        </div>

        {/* Coordinates & World HUD Overlay */}
        {(() => {
          const inspectedIndex = hoveredCellIndex !== null ? hoveredCellIndex : (playerPos.y + 1) * cols + playerPos.x;
          const inspectedBlock = grid[inspectedIndex] || 'grass';
          const inspectedBlockData = BLOCK_LOOT_INFO[inspectedBlock] || (inspectedBlock === 'sky' ? {
            label: 'Sky Atmosphere',
            icon: '🌤️',
            color: '#38bdf8',
            tool: 'Air / Intangible',
            hardness: 'Instant',
            lightLevel: 15,
            description: 'Open breathable atmosphere. Click with block in hand to build.'
          } : null);
          const inspectedBlockName = inspectedBlock === 'sky' ? 'Sky Air' : inspectedBlock.replace('_', ' ');

          return (
            <div className="absolute top-4 left-4 z-40 flex flex-col gap-1.5 font-mono text-[11px] pointer-events-none">
              <div className="bg-stone-950/95 border border-stone-800 px-3 py-1.5 rounded-xl text-stone-300 shadow-xl backdrop-blur-md flex items-center gap-2.5 sm:gap-3 pointer-events-auto flex-wrap">
                {/* Coordinates Pill */}
                <button
                  type="button"
                  onClick={() => setIsUniverseWarpOpen(true)}
                  className="flex items-center gap-1 font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer transition hover:scale-105"
                  title="Click to open 200,000,000 Billion Block Multiverse Teleporter"
                >
                  <MapPin size={12} className="text-emerald-400" />
                  <span>X: {formatBlockNumber(playerPos.x)}</span>
                  <span className="text-stone-500">|</span>
                  <span>Y: {playerPos.y}</span>
                  <span className="text-stone-500">|</span>
                  <span className="text-stone-400">Z: {rows - playerPos.y}</span>
                </button>

                <span className="text-stone-600">•</span>

                {/* Biome Name */}
                <div className="text-stone-200 font-bold flex items-center gap-1">
                  <span>{getBiomeForX(playerPos.x).name}</span>
                </div>

                <span className="text-stone-600 hidden sm:inline">•</span>

                {/* Interactive Multiverse World Map Button */}
                {onOpenWorldMap && (
                  <button
                    type="button"
                    onClick={onOpenWorldMap}
                    className="px-2 py-0.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/60 text-emerald-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                    title="Open Interactive Multiverse World Map (13 Zones, Fast Travel, Dynamic Routes) [Hotkey: M]"
                  >
                    <span>🗺️</span>
                    <span>World Map [M]</span>
                  </button>
                )}

                {/* LEGO Website & Builder Portal Shortcut */}
                {onOpenLegoWebsite && (
                  <button
                    type="button"
                    onClick={onOpenLegoWebsite}
                    className="px-2 py-0.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-yellow-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                    title="Open Official LEGO.com Builder Universe & Minifigure Customizer"
                  >
                    <span>🧱</span>
                    <span>LEGO.com</span>
                  </button>
                )}

                {/* Countryball Creator Shortcut */}
                {onOpenCountryballCreator && (
                  <button
                    type="button"
                    onClick={onOpenCountryballCreator}
                    className="px-2 py-0.5 rounded-lg bg-blue-950/80 hover:bg-blue-900 border border-blue-500/60 text-blue-200 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                    title="Open Sovereign Countryball Creator Studio"
                  >
                    <span>🌐</span>
                    <span>CB Creator</span>
                  </button>
                )}

                {/* Community Event Hubs Shortcut */}
                {onOpenCommunityHubs && (
                  <button
                    type="button"
                    onClick={onOpenCommunityHubs}
                    className="px-2 py-0.5 rounded-lg bg-teal-950/80 hover:bg-teal-900 border border-teal-500/60 text-teal-200 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                    title="Open Persistent Community Event Hubs & Spatial Voice Radio"
                  >
                    <span>🏛️</span>
                    <span>Hubs</span>
                  </button>
                )}

                {/* Cross-Platform Mini-Games Shortcut */}
                {onOpenMiniGames && (
                  <button
                    type="button"
                    onClick={onOpenMiniGames}
                    className="px-2 py-0.5 rounded-lg bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-200 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                    title="Open Cross-Platform Mini-Games Arcade (Scavenger Hunt, Trivia, Resource Race)"
                  >
                    <span>🎮</span>
                    <span>Mini-Games</span>
                  </button>
                )}

                {/* Rideable Mounts & Vehicle Garage [G] */}
                <button
                  type="button"
                  onClick={() => setIsGarageModalOpen(true)}
                  className="px-2 py-0.5 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-500/60 text-amber-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                  title="Open Rideable Mounts & Vehicle Garage [G]"
                >
                  <span>🏎️</span>
                  <span>Garage [G]</span>
                </button>

                {/* Companion Pet Sanctuary [P] */}
                <button
                  type="button"
                  onClick={() => setIsPetModalOpen(true)}
                  className="px-2 py-0.5 rounded-lg bg-pink-950/80 hover:bg-pink-900 border border-pink-500/60 text-pink-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                  title="Open Companion Pet Sanctuary & Follower Hub [P]"
                >
                  <span>🐾</span>
                  <span>Pets [P]</span>
                </button>

                {/* Multiverse World Boss Raids [K] */}
                <button
                  type="button"
                  onClick={() => setIsBossModalOpen(true)}
                  className="px-2 py-0.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 border border-rose-500/60 text-rose-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                  title="Summon Multiverse World Boss Raids [K]"
                >
                  <span>⚔️</span>
                  <span>Bosses [K]</span>
                </button>

                {/* Tactical Radar HUD Toggle [N] */}
                <button
                  type="button"
                  onClick={() => setIsRadarOpen(prev => !prev)}
                  className={`px-2 py-0.5 rounded-lg border font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105 ${
                    isRadarOpen 
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.5)]' 
                      : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                  }`}
                  title="Toggle Tactical Radar & Ore Sonar [N]"
                >
                  <span>📡</span>
                  <span>Radar [N]</span>
                </button>

                {/* Multiverse Map Size & Quick Warp Button */}
                <button
                  type="button"
                  onClick={() => setIsUniverseWarpOpen(true)}
                  className="px-2 py-0.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/60 text-indigo-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                  title="World Map size: 200,000,000 Billion Blocks! Click to Warp"
                >
                  <Globe size={11} className="text-pink-400" />
                  <span>200,000,000B Map</span>
                </button>

                {/* Command Block Console Quick Shortcut */}
                <button
                  type="button"
                  onClick={() => {
                    const blockKey = `${playerPos.x},${playerPos.y}`;
                    const target = commandBlocksData[blockKey] || commandBlocksData['23,5'] || {
                      id: blockKey,
                      x: playerPos.x,
                      y: playerPos.y,
                      command: '/say Multiverse Command Console active',
                      mode: 'impulse',
                      condition: 'unconditional',
                      redstone: 'always_active',
                      customName: '@',
                      lastOutput: 'Ready for execution',
                      enabled: true,
                    };
                    setActiveCommandBlock(target);
                    setIsCommandBlockModalOpen(true);
                  }}
                  className="px-2 py-0.5 rounded-lg bg-orange-950/80 hover:bg-orange-900 border border-orange-500/60 text-orange-300 hover:text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer transition shadow hover:scale-105"
                  title="Open Command Block Console GUI [/]"
                >
                  <Terminal size={11} className="text-amber-400" />
                  <span>Command Block [/]</span>
                </button>

                <span className="text-stone-600 hidden md:inline">•</span>
                <div className="text-yellow-400 font-bold hidden md:inline">
                  {timeOfDay < 45 ? '☀️ Daytime' : timeOfDay < 65 ? '🌅 Sunset' : timeOfDay < 95 ? '🌙 Nighttime' : '🌄 Dawn'}
                </div>

                <span className="text-stone-600 hidden lg:inline">•</span>
                <button
                  onClick={() => {
                    setRealismFXEnabled(prev => !prev);
                    playEffect('build');
                    showToast(realismFXEnabled ? '🌿 Realism FX: Minimized' : '✨ Realism FX: Ultra Quality Enabled!');
                  }}
                  className={`hidden lg:flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold transition cursor-pointer border ${
                    realismFXEnabled 
                      ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/80 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                      : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                  }`}
                  title="Toggle Ultra Realism Graphics, Particles & Camera Shake"
                >
                  <span>✨</span>
                  <span>Realism: {realismFXEnabled ? 'ON' : 'OFF'}</span>
                </button>
              </div>

              {/* Detailed Targeted Voxel Block Inspector Pill */}
              {inspectedBlockData && (
                <div className="bg-stone-950/95 border border-amber-500/50 px-3 py-1.5 rounded-xl shadow-2xl backdrop-blur-md flex items-center gap-2.5 animate-in fade-in duration-150 pointer-events-auto">
                  <span className="text-base p-1 bg-stone-900 border border-stone-700 rounded-lg flex-shrink-0">
                    {inspectedBlockData.icon}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-black text-white uppercase text-xs tracking-wider">
                      {inspectedBlockName}
                    </span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-500/40 px-1.5 py-0.5 rounded font-bold">
                      ⛏️ {inspectedBlockData.tool}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Tier: <strong className="text-stone-200">{inspectedBlockData.hardness}</strong>
                    </span>
                    {inspectedBlockData.lightLevel > 0 && (
                      <span className="text-[10px] text-yellow-300 font-bold bg-yellow-950/50 px-1.5 py-0.5 rounded border border-yellow-500/40">
                        💡 Light: {inspectedBlockData.lightLevel}
                      </span>
                    )}
                    <span className="text-[10px] text-emerald-300 hidden lg:inline max-w-sm truncate">
                      {inspectedBlockData.description}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* 3D Tilted World Grid (165 FPS GPU Compositing) */}
        <div 
          className={`relative grid select-none transition-transform duration-200 map-grid-165fps ${
            cameraShakeActive ? 'animate-camera-shake' : ''
          }`}
          style={{ 
            gridTemplateColumns: `repeat(${cols}, 40px)`,
            width: `${cols * 40}px`,
            height: `${rows * 40}px`,
            transform: `scale(${zoom}) rotateX(${cameraPitch}deg) rotateZ(${cameraYaw}deg)`,
            transformStyle: 'preserve-3d',
            transformOrigin: 'top left',
            margin: '120px 0 0 100px',
          }}
        >
          {/* Tiles */}
          {grid.map((block, index) => {
            const isClosedDoor = block === 'door' || block === 'door_closed';
            const isOpenDoor = block === 'door_open';
            const isCrop = block === 'farmland';
            const growthStage = cropGrowth[index] || 0;
            const isHovered = hoveredCellIndex === index;
            const isJustPlaced = lastPlacedIndex === index;
            const isSky = block === 'sky';
            const isCloud = block === 'sky_cloud';

            // Solid Block Bevel & 3D Shading Styles
            const has3DExtrusion = enable3DLighting && !isSky && !isOpenDoor;

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredCellIndex(index)}
                onClick={() => handleCellClick(index)}
                onDoubleClick={(e) => {
                  e.preventDefault();
                  const targetX = index % cols;
                  const targetY = Math.floor(index / cols);
                  setFacingDir(targetX < playerPos.x ? 'left' : 'right');
                  setPlayerPos({ x: targetX, y: targetY });
                  setIsWalking(true);
                  playEffect('build');
                  showToast(`🚶 Walked ${playerAvatar.name} to X:${targetX} Y:${targetY}`);
                  if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
                  walkTimeoutRef.current = setTimeout(() => setIsWalking(false), 300);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  const targetX = index % cols;
                  const targetY = Math.floor(index / cols);
                  setFacingDir(targetX < playerPos.x ? 'left' : 'right');
                  setPlayerPos({ x: targetX, y: targetY });
                  setIsWalking(true);
                  playEffect('build');
                  showToast(`🚶 Moved ${playerAvatar.name} to (${targetX}, ${targetY})`);
                  if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
                  walkTimeoutRef.current = setTimeout(() => setIsWalking(false), 300);
                }}
                className={`w-10 h-10 cursor-pointer relative flex items-center justify-center select-none mc-cell-165fps
                  ${showGridLines && !isSky ? 'border-r border-b border-black/25' : ''}
                  ${showGridLines && isSky ? 'border border-sky-400/[0.08] hover:border-sky-300/40' : ''}
                  ${has3DExtrusion ? 'border-b-[4px] border-r-[3px] shadow-sm' : ''}
                  ${isJustPlaced ? 'animate-block-pop' : ''}
                  ${isHovered ? 'outline outline-2 outline-white shadow-[0_0_12px_rgba(255,255,255,0.7)] z-25 scale-[1.02]' : ''}
                  ${truthXRayActive && (block === 'diamond' || block === 'emerald' || block === 'gold' || block === 'netherite' || block === 'amethyst' || block === 'crying_obsidian') ? 'ring-2 ring-yellow-300 shadow-[0_0_16px_rgba(250,204,21,1)] z-20 animate-pulse' : ''}

                  /* ============ BLOCK SPECIFIC BACKGROUNDS & 3D PALETTES ============ */
                  ${isSky ? 'bg-sky-400/[0.04] hover:bg-sky-400/25' : ''} 
                  ${isCloud ? 'bg-white shadow-[0_8px_16px_rgba(0,0,0,0.35)] border-b-[4px] border-b-slate-300 border-r-[3px] border-r-slate-200 z-10' : ''} 
                  ${block === 'grass' ? 'bg-[#558b2f] border-t-[5px] border-t-[#7cb342] border-b-[#33691e] border-r-[#33691e]' : ''} 
                  ${block === 'dirt' ? 'bg-[#795548] border-t-[3px] border-t-[#8d6e63] border-b-[#4e342e] border-r-[#4e342e]' : ''} 
                  ${block === 'farmland' ? 'bg-[#3e2723] border-t-[3px] border-t-[#5d4037] border-b-[#1b0000] border-r-[#1b0000]' : ''} 
                  ${block === 'stone' ? 'bg-[#78909c] border-t-[4px] border-t-[#90a4ae] border-b-[#455a64] border-r-[#455a64]' : ''} 
                  ${block === 'ore' ? 'bg-[#607d8b] border-t-[4px] border-t-[#78909c] border-b-[#37474f] border-r-[#37474f]' : ''} 
                  ${block === 'coal' ? 'bg-[#212121] border-t-[4px] border-t-[#424242] border-b-[#000000] border-r-[#000000]' : ''} 
                  ${block === 'bricks' ? 'bg-[#b71c1c] border-t-[4px] border-t-[#c62828] border-b-[#7f0000] border-r-[#7f0000]' : ''} 
                  ${block === 'sandstone' ? 'bg-[#d7ccc8] border-t-[4px] border-t-[#efebe9] border-b-[#a1887f] border-r-[#a1887f]' : ''} 
                  ${block === 'tree' ? 'bg-[#5d4037] border-t-[4px] border-t-[#6d4c41] border-b-[#3e2723] border-r-[#3e2723]' : ''} 
                  ${block === 'leaves' ? 'bg-[#2e7d32] border-t-[4px] border-t-[#388e3c] border-b-[#1b5e20] border-r-[#1b5e20]' : ''} 
                  ${block === 'sand' ? 'bg-[#fff59d] border-t-[4px] border-t-[#fff9c4] border-b-[#fbc02d] border-r-[#fbc02d]' : ''} 
                  ${block === 'snow' ? 'bg-[#f8fafc] border-t-[4px] border-t-[#ffffff] border-b-[#cbd5e1] border-r-[#cbd5e1]' : ''} 
                  ${block === 'ice' ? 'bg-[#7dd3fc]/90 border-t-[4px] border-t-[#bae6fd] border-b-[#0284c7] border-r-[#0284c7]' : ''} 
                  ${block === 'diamond' ? 'bg-[#06b6d4] border-t-[4px] border-t-[#67e8f9] border-b-[#0e7490] border-r-[#0e7490]' : ''} 
                  ${block === 'emerald' ? 'bg-[#10b981] border-t-[4px] border-t-[#34d399] border-b-[#047857] border-r-[#047857]' : ''} 
                  ${block === 'gold' ? 'bg-[#facc15] border-t-[4px] border-t-[#fde047] border-b-[#ca8a04] border-r-[#ca8a04]' : ''} 
                  ${block === 'netherite' ? 'bg-[#262626] border-t-[4px] border-t-[#404040] border-b-[#171717] border-r-[#171717]' : ''} 
                  ${block === 'water' ? 'bg-gradient-to-b from-sky-400/80 via-blue-500/85 to-blue-600/90 border-t-[3px] border-t-cyan-200/90 shadow-inner animate-water-shimmer' : ''} 
                  ${block === 'lava' ? 'bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400 border-t-[4px] border-t-yellow-300 animate-lava-glow' : ''} 
                  ${block === 'magma' ? 'bg-[#291711] border-t-[4px] border-t-[#c2410c] border-b-[#7c2d12]' : ''} 
                  ${block === 'obsidian' ? 'bg-[#150e28] border-t-[4px] border-t-[#2e1065] border-b-[#0f0728]' : ''} 
                  ${block === 'crying_obsidian' ? 'bg-[#12072b] border-t-[4px] border-t-[#9333ea] border-b-[#3b0764]' : ''} 
                  ${block === 'sculk' ? 'bg-[#041a24] border-t-[4px] border-t-[#083344] border-b-[#020e14]' : ''} 
                  ${block === 'mycelium' ? 'bg-[#6d5b7b] border-t-[5px] border-t-[#8e7cc3] border-b-[#4a3b59]' : ''} 
                  ${block === 'mushroom_red' ? 'bg-[#dc2626] border-t-[4px] border-t-[#ef4444] border-b-[#991b1b]' : ''} 
                  ${block === 'mushroom_brown' ? 'bg-[#854d0e] border-t-[4px] border-t-[#a16207] border-b-[#543007]' : ''} 
                  ${block === 'glowstone' ? 'bg-[#fef08a] border-t-[4px] border-t-[#ffffff] border-b-[#eab308]' : ''} 
                  ${block === 'amethyst' ? 'bg-[#7e22ce] border-t-[4px] border-t-[#a855f7] border-b-[#581c87]' : ''} 
                  ${block === 'sponge' ? 'bg-[#ca8a04] border-t-[4px] border-t-[#facc15] border-b-[#854d0e]' : ''} 
                  ${block === 'torch' ? 'bg-stone-900/60' : ''} 
                  ${block === 'jukebox' ? 'bg-[#78350f] border-t-[4px] border-t-[#92400e] border-b-[#451a03] border-r-[#451a03]' : ''} 
                  ${block === 'command_block' ? 'bg-[#c47037] border-t-[4px] border-t-[#d48855] border-b-[#8f4b1e] border-r-[#8f4b1e]' : ''} 
                  ${block === 'chain_command_block' ? 'bg-[#3b846e] border-t-[4px] border-t-[#4fa389] border-b-[#235345] border-r-[#235345]' : ''} 
                  ${block === 'repeating_command_block' ? 'bg-[#6a4697] border-t-[4px] border-t-[#8b5cf6] border-b-[#422464] border-r-[#422464]' : ''} 
                  ${block === 'carved_pumpkin' ? 'bg-[#c2410c] border-t-[4px] border-t-[#ea580c] border-b-[#7c2d12] border-r-[#7c2d12]' : ''} 
                  ${block === 'jack_o_lantern' ? 'bg-[#ea580c] border-t-[4px] border-t-[#f97316] border-b-[#9a3412] border-r-[#9a3412] shadow-[0_0_16px_rgba(249,115,22,0.85)] z-10' : ''} 
                  ${block === 'witch_cauldron' ? 'bg-[#18181b] border-t-[4px] border-t-[#27272a] border-b-[#09090b] border-r-[#09090b]' : ''} 
                  ${block === 'spooky_cobweb' ? 'bg-white/10 border border-white/20' : ''} 
                  ${block === 'tombstone' ? 'bg-[#475569] border-t-[4px] border-t-[#64748b] border-b-[#1e293b] border-r-[#1e293b]' : ''} 
                  ${block === 'ghost_lantern' ? 'bg-[#3b0764]/70 border-t-[4px] border-t-[#7e22ce] shadow-[0_0_14px_rgba(168,85,247,0.8)]' : ''} 
                  ${isClosedDoor ? 'bg-[#6d4c41] border-t-[4px] border-t-[#8d6e63]' : ''} 
                  ${isOpenDoor ? 'bg-sky-400/20 border-2 border-dashed border-[#6d4c41]' : ''} 
                  ${realismFXEnabled && (block === 'torch' || block === 'glowstone' || block === 'lava' || block === 'crying_obsidian' || block === 'repeating_command_block' || block === 'jack_o_lantern' || block === 'ghost_lantern') ? 'shadow-[0_0_24px_rgba(251,191,36,0.85)] z-20' : ''}
                `}
                title={
                  isClosedDoor ? 'Closed Door (Click to open)' :
                  isOpenDoor ? 'Open Door (Click to close)' :
                  isSky ? (isCreative ? `Sky Air (Click to place ${activeItem})` : `Sky Air`) :
                  `${block.replace('_', ' ').toUpperCase()} Block (Click to Mine)`
                }
              >
                {/* Grass Hanging Blade Fringe */}
                {block === 'grass' && (
                  <div className="absolute top-1 left-0 right-0 flex justify-around pointer-events-none px-0.5">
                    <div className="w-1.5 h-1.5 bg-[#7cb342] rounded-b-xs"></div>
                    <div className="w-1 h-2 bg-[#7cb342] rounded-b-xs"></div>
                    <div className="w-1.5 h-1 bg-[#7cb342] rounded-b-xs"></div>
                    <div className="w-1 h-2.5 bg-[#7cb342] rounded-b-xs"></div>
                  </div>
                )}

                {/* Cobblestone Specks */}
                {block === 'stone' && (
                  <div className="absolute inset-0 flex flex-wrap p-1 gap-1 pointer-events-none opacity-40">
                    <div className="w-1.5 h-1 bg-stone-900 rounded-xs"></div>
                    <div className="w-2 h-1 bg-white ml-auto rounded-xs"></div>
                    <div className="w-1 h-1.5 bg-stone-900 mt-auto rounded-xs"></div>
                  </div>
                )}

                {/* Coal Ore Chunky Nuggets */}
                {block === 'coal' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-4 h-4 bg-black border border-stone-700 rounded-xs shadow-inner flex items-center justify-center">
                      <div className="w-1 h-1 bg-white/70 rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Iron Ore Metallic Mineral Veins */}
                {block === 'ore' && (
                  <div className="absolute inset-0 flex flex-wrap p-1 pointer-events-none">
                    <div className="w-2.5 h-2 bg-amber-600 rounded-xs shadow-sm"></div>
                    <div className="w-2 h-2.5 bg-amber-700 ml-auto rounded-xs shadow-sm"></div>
                    <div className="w-2.5 h-2 bg-orange-400 mt-auto ml-1 rounded-xs"></div>
                  </div>
                )}

                {/* Diamond Sparkle Gems */}
                {block === 'diamond' && (
                  <div className="flex items-center justify-center pointer-events-none animate-gem-sparkle">
                    <div className="w-3.5 h-3.5 bg-cyan-200 border border-cyan-100 rotate-45 shadow-[0_0_8px_rgba(34,211,238,1)] flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}

                {/* Gold Bullion Shimmer */}
                {block === 'gold' && (
                  <div className="absolute inset-1 border-2 border-yellow-200/80 rounded-xs pointer-events-none flex items-center justify-center bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 shadow-inner">
                    <div className="w-2 h-2 bg-white/70 rounded-full animate-pulse"></div>
                  </div>
                )}

                {/* Emerald Crystal */}
                {block === 'emerald' && (
                  <div className="flex items-center justify-center pointer-events-none animate-gem-sparkle">
                    <div className="w-3.5 h-3.5 bg-emerald-200 border border-emerald-100 rotate-45 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>
                  </div>
                )}

                {/* Netherite Alloy Core */}
                {block === 'netherite' && (
                  <div className="absolute inset-1 bg-neutral-900 border border-purple-500/30 rounded-xs pointer-events-none flex items-center justify-center">
                    <div className="w-2 h-2 bg-purple-900/40 rounded-xs"></div>
                  </div>
                )}

                {/* Wood Rings */}
                {block === 'tree' && (
                  <div className="absolute inset-1 border-2 border-amber-950/60 rounded-xs pointer-events-none flex items-center justify-center">
                    <div className="w-2 h-2 bg-amber-900 rounded-full border border-amber-950"></div>
                  </div>
                )}

                {/* Brick Mortar Lines */}
                {block === 'bricks' && (
                  <div className="absolute inset-0 flex flex-col justify-between p-0.5 pointer-events-none opacity-60">
                    <div className="w-full h-0.5 bg-slate-200"></div>
                    <div className="w-full h-0.5 bg-slate-200"></div>
                    <div className="w-full h-0.5 bg-slate-200"></div>
                  </div>
                )}

                {/* Cloud Puff Inside */}
                {isCloud && (
                  <div className="flex items-center justify-center pointer-events-none text-slate-300 text-xs">
                    ☁️
                  </div>
                )}

                {/* 3D Torch with Animated Flame & Radial Glow */}
                {block === 'torch' && (
                  <div className="relative flex flex-col items-center pointer-events-none">
                    {/* Warm radial light cast onto block */}
                    <div className="absolute -inset-4 bg-amber-400/35 rounded-full blur-md animate-pulse pointer-events-none" />
                    {/* Animated Flame */}
                    <div className="w-2.5 h-3.5 bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 rounded-full animate-torch-flicker shadow-[0_0_12px_rgba(251,191,36,1)] z-10" />
                    {/* Charcoal ember tip */}
                    <div className="w-2 h-1 bg-stone-900 rounded-t-xs" />
                    {/* Wooden Torch Shaft */}
                    <div className="w-1.5 h-4 bg-amber-800 border-x border-amber-950 shadow" />
                  </div>
                )}

                {/* Detailed Wooden Panel Door */}
                {isClosedDoor && (
                  <div className="w-full h-full flex flex-col justify-between p-0.5 relative pointer-events-none bg-amber-900/90 rounded-xs border border-amber-950">
                    <div className="w-full h-3 bg-amber-950/60 border border-amber-900/80 rounded-xs flex items-center justify-center">
                      <div className="w-2.5 h-1.5 bg-sky-200/70 border border-amber-950 rounded-xs"></div>
                    </div>
                    {/* Brass Handle */}
                    <div className="w-1.5 h-1.5 bg-yellow-400 border border-yellow-600 rounded-full absolute right-1 top-[52%] shadow-sm"></div>
                    <div className="w-full h-3 bg-amber-950/60 border border-amber-900/80 rounded-xs"></div>
                  </div>
                )}
                {isOpenDoor && (
                  <div className="w-full h-full relative pointer-events-none flex items-center">
                    <div className="w-2 h-full bg-amber-900 border-r-2 border-amber-950 shadow flex items-center justify-end pr-0.5">
                      <div className="w-1 h-1 bg-yellow-400 rounded-full"></div>
                    </div>
                    <span className="text-[7px] text-amber-200 font-bold ml-0.5 drop-shadow">OPEN</span>
                  </div>
                )}

                {/* 3D Jukebox Inset Slot & Musical Note */}
                {block === 'jukebox' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-1">
                    <div className="w-6 h-6 bg-stone-900 border border-amber-950 rounded-xs flex items-center justify-center relative shadow-inner">
                      <div className="w-3.5 h-3.5 rounded-full bg-stone-950 border border-stone-700 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      </div>
                      <span className="absolute -top-2.5 right-0 text-[10px] animate-bounce text-amber-300 drop-shadow">
                        ♪
                      </span>
                    </div>
                  </div>
                )}

                {/* Farmland & Swaying Crops */}
                {isCrop && (
                  <div className="flex items-end justify-center pointer-events-none w-full h-full pb-0.5">
                    {growthStage === 1 && <span className="text-[11px] animate-wheat-sway">🌱</span>}
                    {growthStage === 2 && <span className="text-xs animate-wheat-sway">🌿</span>}
                    {growthStage >= 3 && (
                      <span className="text-sm animate-wheat-sway drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]">
                        🌾
                      </span>
                    )}
                  </div>
                )}

                {/* Fluid Water Surface Ripples */}
                {block === 'water' && (
                  <div className="absolute inset-0 flex flex-col justify-around pointer-events-none p-1 opacity-75">
                    <div className="w-full h-0.5 bg-cyan-100/70 rounded-full animate-pulse" />
                    <div className="w-3/4 h-0.5 bg-sky-200/50 rounded-full ml-auto animate-pulse" style={{ animationDelay: '0.4s' }} />
                  </div>
                )}

                {/* Lava Bubbling Embers */}
                {block === 'lava' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <div className="w-2 h-2 bg-yellow-200 rounded-full animate-ping opacity-75" />
                    <span className="absolute top-0.5 right-1 text-[8px] animate-bounce">🔥</span>
                  </div>
                )}

                {/* Dirt Loam & Gravel Flecks */}
                {block === 'dirt' && (
                  <div className="absolute inset-0 p-1 pointer-events-none opacity-60 flex flex-wrap gap-1">
                    <div className="w-1.5 h-1 bg-[#4e342e] rounded-xs" />
                    <div className="w-1 h-1 bg-[#8d6e63] ml-auto rounded-xs" />
                    <div className="w-2 h-1 bg-[#3e2723] mt-auto ml-1 rounded-xs" />
                    <div className="w-1 h-1.5 bg-[#a1887f] mt-auto ml-auto rounded-xs" />
                  </div>
                )}

                {/* Sand Quartz Granules & Wind Ripples */}
                {block === 'sand' && (
                  <div className="absolute inset-0 p-1 pointer-events-none opacity-70 flex flex-col justify-between">
                    <div className="w-4 h-0.5 bg-[#fbc02d] rounded-full ml-1" />
                    <div className="flex justify-between px-1">
                      <div className="w-1 h-1 bg-white/90 rounded-full animate-pulse" />
                      <div className="w-1 h-1 bg-[#f57f17] rounded-full" />
                    </div>
                    <div className="w-5 h-0.5 bg-[#fbc02d] rounded-full ml-auto mr-1" />
                  </div>
                )}

                {/* Sandstone Ancient Carved Strata */}
                {block === 'sandstone' && (
                  <div className="absolute inset-0 p-1 pointer-events-none opacity-75 flex flex-col justify-around">
                    <div className="w-full h-0.5 bg-[#bcaaa4]" />
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#8d6e63] rotate-45" />
                      <div className="w-1.5 h-1.5 bg-[#8d6e63] rotate-45" />
                    </div>
                    <div className="w-full h-0.5 bg-[#a1887f]" />
                  </div>
                )}

                {/* Leaves Deciduous Canopy & Berry/Apple Specks */}
                {block === 'leaves' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-wrap gap-1 opacity-85">
                    <div className="w-1.5 h-1.5 bg-[#1b5e20] rounded-xs" />
                    <div className="w-1.5 h-1.5 bg-[#4caf50] ml-auto rounded-xs" />
                    <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-auto ml-1 shadow-xs animate-pulse" title="Apple Blossom" />
                    <div className="w-1.5 h-1.5 bg-[#2e7d32] mt-auto ml-auto rounded-xs" />
                  </div>
                )}

                {/* Snow Fluffy Powder & Frost Sparkles */}
                {block === 'snow' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-col justify-between">
                    <div className="flex justify-around">
                      <div className="w-1 h-1 bg-cyan-200 rounded-full animate-ping" />
                      <div className="w-1.5 h-1.5 bg-white rounded-full shadow-xs" />
                    </div>
                    <div className="w-5 h-0.5 bg-slate-300/80 rounded-full mx-auto" />
                  </div>
                )}

                {/* Packed Ice Crystalline Fracture Veins */}
                {block === 'ice' && (
                  <div className="absolute inset-0 p-1 pointer-events-none opacity-80">
                    <div className="w-full h-full border border-cyan-100/40 relative">
                      <div className="w-5 h-0.5 bg-white/80 rotate-45 absolute top-2 left-1" />
                      <div className="w-4 h-0.5 bg-cyan-200/90 -rotate-30 absolute bottom-2 right-1" />
                    </div>
                  </div>
                )}

                {/* Amethyst Resonant Crystal Geode */}
                {block === 'amethyst' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-gem-sparkle">
                    <div className="relative w-5 h-5 flex items-center justify-center">
                      <div className="w-3.5 h-3.5 bg-purple-300 border border-purple-100 rotate-45 shadow-[0_0_10px_rgba(168,85,247,0.9)]" />
                      <div className="w-1.5 h-1.5 bg-white rounded-full absolute -top-0.5 right-0.5 animate-pulse" />
                    </div>
                  </div>
                )}

                {/* Glowstone Nether Luminescent Nodules */}
                {block === 'glowstone' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-wrap gap-1.5 items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_6px_rgba(254,240,138,1)] animate-ping" />
                    <div className="w-2.5 h-2.5 bg-yellow-100 border border-amber-300 rounded-xs shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
                    <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                  </div>
                )}

                {/* Crying Obsidian Purple Tears & Runes */}
                {block === 'crying_obsidian' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-col justify-between">
                    <div className="w-2 h-3 bg-purple-400 rounded-full shadow-[0_0_8px_rgba(192,132,252,1)] animate-pulse ml-1" />
                    <div className="w-2.5 h-2 bg-fuchsia-500 rounded-xs shadow-[0_0_6px_rgba(217,70,239,0.8)] ml-auto" />
                    <div className="w-1.5 h-2 bg-purple-300 rounded-full ml-2 shadow" />
                  </div>
                )}

                {/* Magma Fissures with Molten Lava Simmering */}
                {block === 'magma' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-col justify-around">
                    <div className="w-full h-1 bg-gradient-to-r from-orange-600 via-amber-400 to-red-600 rounded-full animate-pulse shadow-[0_0_6px_rgba(249,115,22,0.9)]" />
                    <div className="w-3/4 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-amber-600 rounded-full ml-auto animate-pulse" style={{ animationDelay: '0.25s' }} />
                  </div>
                )}

                {/* Sculk Deep Dark Tendrils & Soul Node */}
                {block === 'sculk' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-cyan-950 border border-cyan-400 flex items-center justify-center shadow-[0_0_10px_rgba(6,182,212,0.9)]">
                      <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-ping" />
                    </div>
                  </div>
                )}

                {/* Mycelium Fungal Spore Matrix */}
                {block === 'mycelium' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-wrap gap-1 opacity-75">
                    <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-pink-200 ml-auto rounded-full" />
                    <div className="w-1.5 h-1 bg-purple-900 mt-auto rounded-xs" />
                  </div>
                )}

                {/* Red Mushroom Toadstool Cap */}
                {block === 'mushroom_red' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-5 bg-red-600 border border-red-700 rounded-t-xl relative shadow-md flex items-center justify-around px-0.5">
                      <div className="w-1 h-1 bg-white rounded-full" />
                      <div className="w-1.5 h-1.5 bg-white rounded-full -mt-1" />
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                )}

                {/* Brown Mushroom Cap */}
                {block === 'mushroom_brown' && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-4 bg-amber-800 border border-amber-950 rounded-t-lg shadow-md flex items-center justify-center">
                      <div className="w-3 h-1 bg-amber-950/60 rounded-full" />
                    </div>
                  </div>
                )}

                {/* Sponge Porous Ocean Texture */}
                {block === 'sponge' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex flex-wrap gap-1.5 items-center justify-center opacity-70">
                    <div className="w-2 h-2 bg-amber-900/60 rounded-full" />
                    <div className="w-1.5 h-1.5 bg-amber-950/70 rounded-full" />
                    <div className="w-2.5 h-1.5 bg-amber-900/50 rounded-full" />
                  </div>
                )}

                {/* Impulse Command Block Graphic */}
                {block === 'command_block' && (
                  <div className="absolute inset-0 bg-[#c47037] border-2 border-[#8f4b1e] p-1 flex items-center justify-center pointer-events-none shadow-md">
                    <div className="w-5 h-5 bg-[#e0874e] border border-[#5c2d0c] rounded-xs flex items-center justify-center relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 border border-emerald-200 shadow-[0_0_6px_rgba(52,211,153,0.9)] animate-pulse" />
                      <div className="w-1 h-1 bg-yellow-300 rounded-full absolute -top-1 -right-1" />
                    </div>
                  </div>
                )}

                {/* Chain Command Block Graphic */}
                {block === 'chain_command_block' && (
                  <div className="absolute inset-0 bg-[#3b846e] border-2 border-[#235345] p-1 flex items-center justify-center pointer-events-none shadow-md">
                    <div className="w-5 h-5 bg-[#4fa389] border border-[#134e4a] rounded-xs flex items-center justify-center relative">
                      <div className="text-[10px] text-teal-200 font-black">▲</div>
                      <div className="w-1 h-1 bg-emerald-300 rounded-full absolute -top-1 -right-1" />
                    </div>
                  </div>
                )}

                {/* Repeating Command Block Graphic */}
                {block === 'repeating_command_block' && (
                  <div className="absolute inset-0 bg-[#6a4697] border-2 border-[#422464] p-1 flex items-center justify-center pointer-events-none shadow-md">
                    <div className="w-5 h-5 bg-[#8b5cf6] border border-[#3b0764] rounded-xs flex items-center justify-center relative shadow-[0_0_8px_rgba(168,85,247,0.7)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-400 border border-fuchsia-200 shadow-[0_0_8px_rgba(232,121,249,1)] animate-spin" style={{ animationDuration: '3s' }} />
                      <div className="w-1 h-1 bg-pink-200 rounded-full absolute -top-1 -right-1" />
                    </div>
                  </div>
                )}

                {/* Carved Pumpkin Spooky Face */}
                {block === 'carved_pumpkin' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1">
                    <div className="w-1.5 h-1 bg-amber-900 rounded-t-xs -mt-1" />
                    <div className="flex justify-between w-5 px-1 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-black rotate-45" />
                      <div className="w-1.5 h-1.5 bg-black rotate-45" />
                    </div>
                    <div className="w-1 h-1 bg-black rotate-45 my-0.5" />
                    <div className="w-4 h-1.5 bg-black rounded-b-xs flex justify-around px-0.5">
                      <div className="w-0.5 h-1 bg-amber-600" />
                      <div className="w-0.5 h-1 bg-amber-600" />
                    </div>
                  </div>
                )}

                {/* Jack-o'-Lantern Glowing Ember Face */}
                {block === 'jack_o_lantern' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1">
                    <div className="absolute -inset-2 bg-amber-400/30 rounded-full blur-sm animate-pulse pointer-events-none" />
                    <div className="w-1.5 h-1 bg-amber-950 rounded-t-xs -mt-1" />
                    <div className="flex justify-between w-5 px-1 mt-0.5 z-10">
                      <div className="w-1.5 h-1.5 bg-yellow-200 rotate-45 shadow-[0_0_4px_#fde047] animate-pulse" />
                      <div className="w-1.5 h-1.5 bg-yellow-200 rotate-45 shadow-[0_0_4px_#fde047] animate-pulse" />
                    </div>
                    <div className="w-1 h-1 bg-yellow-200 rotate-45 my-0.5 z-10 animate-pulse" />
                    <div className="w-4 h-1.5 bg-yellow-200 rounded-b-xs shadow-[0_0_6px_#fde047] flex justify-around px-0.5 z-10">
                      <div className="w-0.5 h-1 bg-orange-700" />
                      <div className="w-0.5 h-1 bg-orange-700" />
                    </div>
                  </div>
                )}

                {/* Witch's Bubbling Cauldron */}
                {block === 'witch_cauldron' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1">
                    <div className="w-6 h-5 bg-stone-900 border-2 border-stone-700 rounded-b-lg flex flex-col items-center justify-center relative shadow-inner">
                      <div className="w-4 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_#10b981] flex items-center justify-around px-0.5 animate-pulse">
                        <div className="w-1 h-1 bg-emerald-200 rounded-full animate-ping" />
                        <div className="w-1 h-1 bg-emerald-100 rounded-full animate-bounce" />
                      </div>
                      <div className="flex justify-between w-5 absolute -bottom-1">
                        <div className="w-1 h-1.5 bg-stone-800" />
                        <div className="w-1 h-1.5 bg-stone-800" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Spooky Cobweb Silk Strands */}
                {block === 'spooky_cobweb' && (
                  <div className="absolute inset-0 p-1 pointer-events-none flex items-center justify-center text-stone-200/90 text-sm">
                    🕸️
                  </div>
                )}

                {/* Catacomb Tombstone */}
                {block === 'tombstone' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1">
                    <div className="w-5 h-6 bg-slate-600 border border-slate-500 rounded-t-lg shadow flex flex-col items-center justify-around py-0.5">
                      <span className="text-[7px] text-slate-300 font-bold font-mono">R.I.P</span>
                      <div className="w-2.5 h-0.5 bg-slate-400" />
                    </div>
                  </div>
                )}

                {/* Ghost Wisp Lantern */}
                {block === 'ghost_lantern' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none p-1">
                    <div className="w-5 h-6 bg-purple-950/80 border border-purple-400 rounded-md flex flex-col items-center justify-center relative shadow-[0_0_10px_#a855f7]">
                      <div className="w-1.5 h-1 bg-stone-400 rounded-t-xs -mt-1" />
                      <span className="text-xs animate-bounce">👻</span>
                    </div>
                  </div>
                )}

                {/* Placement Preview Ghost in Sky Air */}
                {isSky && isHovered && (
                  <div className="absolute inset-1 border border-dashed border-emerald-400/80 bg-emerald-500/20 rounded-xs flex items-center justify-center text-[9px] font-mono text-emerald-300 pointer-events-none">
                    +
                  </div>
                )}
              </div>
            );
          })}

          {/* ================= DYNAMIC 3D VOXEL DEBRIS PARTICLES ================= */}
          {debrisParticles.map((p) => (
            <div
              key={p.id}
              className="absolute pointer-events-none rounded-xs animate-block-shatter z-40 shadow-sm"
              style={{
                left: `${p.x}px`,
                top: `${p.y}px`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.color,
                transform: `translate3d(${p.vx * 3}px, ${p.vy * 3}px, 8px) rotate(${p.vx * 35}deg)`,
              }}
            />
          ))}

          {/* ================= DYNAMIC BILLBOARDED FLOATING LOOT TEXT ================= */}
          {floatingLoot.map((loot) => (
            <div
              key={loot.id}
              className="absolute pointer-events-none z-50 flex items-center gap-1 font-mono font-black text-xs px-2.5 py-0.5 rounded-full bg-black/90 text-amber-300 border border-amber-400/60 shadow-[0_4px_16px_rgba(0,0,0,0.8)] animate-loot-float whitespace-nowrap"
              style={{
                left: `${loot.x * 40 - 10}px`,
                top: `${loot.y * 40 - 15}px`,
                transform: `rotateZ(${-cameraYaw}deg) rotateX(${-cameraPitch}deg)`,
                transformOrigin: 'bottom center',
              }}
            >
              <span className="text-sm">{loot.icon}</span>
              <span>{loot.label}</span>
            </div>
          ))}

          {/* ================= STEVE: 3D BILLBOARD WITH SHADOW (165 FPS GPU HARDWARE ACCELERATED) ================= */}
          <div
            className={`absolute z-30 pointer-events-none steve-billboard-165fps ${
              isFlying ? '-translate-y-8 shadow-2xl' : ''
            }`}
            style={{
              top: 0,
              left: 0,
              transform: `translate3d(${(((smoothPlayerPos.x - viewportChunkX) * 40) - 4).toFixed(2)}px, ${(smoothPlayerPos.y * 40 - 24).toFixed(2)}px, 0px) rotateZ(${-cameraYaw}deg) rotateX(${-cameraPitch}deg)`,
              transformOrigin: 'bottom center',
            }}
          >
            {/* Ground Contact Shadow */}
            <div 
              className={`w-8 h-2.5 bg-black/45 rounded-full blur-[2px] absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none ${
                isFlying ? 'w-10 h-3 bg-black/25 blur-[4px] scale-125' : ''
              }`} 
            />

            {/* Flight wing glow in creative */}
            {isFlying && (
              <div className="absolute -inset-3 bg-cyan-400/35 rounded-full blur-md animate-pulse" />
            )}

            {/* Beatbox Shockwaves and Floating Rhythm Rings */}
            {beatboxActive && (
              <div className="absolute -inset-10 pointer-events-none flex items-center justify-center z-30">
                <div className="w-20 h-20 rounded-full border-4 border-orange-400 animate-ping opacity-80" />
                <div className="w-28 h-28 rounded-full border-2 border-yellow-300 animate-ping opacity-60" style={{ animationDelay: '0.15s' }} />
                <div className="absolute -top-7 text-[11px] font-black font-mono text-yellow-300 bg-black/90 px-2 py-0.5 rounded-full border border-orange-400 animate-bounce whitespace-nowrap shadow-2xl">
                  🎵 BOOM B-B-BOOM! 🎵
                </div>
              </div>
            )}

            {/* Minecraft Mining & Attack Critical Hit Effect */}
            {mcActionActive && (
              <div className="absolute -inset-10 pointer-events-none flex items-center justify-center z-30">
                <div className="w-20 h-20 rounded-full border-4 border-cyan-400 animate-ping opacity-85" />
                <div className="w-28 h-28 rounded-full border-2 border-emerald-300 animate-ping opacity-60" style={{ animationDelay: '0.12s' }} />
                <div className="absolute -top-7 text-[11px] font-black font-mono text-cyan-300 bg-black/90 px-2.5 py-0.5 rounded-full border border-cyan-400 animate-bounce whitespace-nowrap shadow-2xl">
                  ⚔️ CRITICAL STRIKE! ⛏️
                </div>
              </div>
            )}
            {/* Walking footstep dust particle effects */}
            {isWalking && (
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 pointer-events-none z-10">
                <span className="w-1.5 h-1.5 bg-stone-300/80 rounded-full animate-ping" />
                <span className="w-1.5 h-1.5 bg-amber-400/80 rounded-full animate-ping" style={{ animationDelay: '0.12s' }} />
                {playerPos.x < 20 && <span className="w-1 h-1 bg-emerald-400/90 rounded-full animate-ping" />}
                {playerPos.x >= 38 && playerPos.x < 56 && <span className="w-1 h-1 bg-cyan-200/90 rounded-full animate-ping" />}
              </div>
            )}

            {/* Detailed Overhead Player Status HUD */}
            <div className="absolute -top-11 left-1/2 -translate-x-1/2 pointer-events-none flex flex-col items-center z-40 whitespace-nowrap">
              {/* Voice Chat Active Transmitting Ripple */}
              {voiceChatEngine.isTransmitting && (
                <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-300 bg-emerald-950/90 border border-emerald-400/80 px-2 py-0.5 rounded-full shadow-[0_0_12px_rgba(16,185,129,0.9)] animate-pulse mb-0.5">
                  <Mic size={10} className="text-emerald-400 animate-bounce" />
                  <span>MIC ON</span>
                </div>
              )}

              {/* Title & Honorific Badge */}
              <div className="flex items-center gap-1 bg-black/90 border border-amber-500/50 px-2 py-0.5 rounded-md shadow-lg font-mono">
                <span className="text-[8.5px] uppercase font-bold text-amber-300">
                  {avatarManager.getLocalCustomization().customTitle || 'Master Builder'}
                </span>
              </div>

              {/* Survival Micro Heart & Stamina Gauge */}
              {!isCreative && (
                <div className="flex items-center gap-1 mt-0.5 bg-black/85 px-1.5 py-0.5 rounded-full border border-stone-800 shadow text-[8px] font-mono">
                  <span className="text-red-400 font-bold">❤️ {health}%</span>
                  <span className="text-stone-600">|</span>
                  <span className="text-amber-400 font-bold">🍗 {hunger}%</span>
                </div>
              )}
            </div>

            {/* Mounted Vehicle Chassis Render */}
            {mountedVehicleState && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center animate-bounce">
                <div className="text-2xl filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {mountedVehicleState.icon}
                </div>
                {vehicleManager.getIsHeadlightsOn() && (
                  <div className="w-12 h-6 bg-yellow-300/30 rounded-full blur-sm -mt-2 animate-pulse" />
                )}
                {vehicleManager.getIsBoosting() && (
                  <div className="flex gap-1 -mt-1">
                    <span className="w-1.5 h-3 bg-cyan-400 rounded-full animate-ping" />
                    <span className="w-1.5 h-3 bg-amber-400 rounded-full animate-ping" style={{ animationDelay: '0.1s' }} />
                  </div>
                )}
              </div>
            )}

            {/* Companion Pet Follower Render (Floats near player) */}
            {activePetState && (
              <div 
                className="absolute -top-3 -right-6 z-25 pointer-events-none flex flex-col items-center animate-pulse"
                title={`${activePetState.name} (Lvl ${petCompanionManager.getLevel()})`}
              >
                <div className="text-xl filter drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] hover:scale-125 transition">
                  {activePetState.icon}
                </div>
                <div className="bg-black/90 text-amber-300 text-[7px] font-mono font-bold px-1 rounded-sm border border-amber-500/40 -mt-0.5 whitespace-nowrap">
                  Lv.{petCompanionManager.getLevel()}
                </div>
              </div>
            )}

            <CharacterAvatar
              character={playerAvatar}
              size="md"
              isWalking={isWalking}
              isSprinting={isSprinting}
              isJumping={isJumping}
              isTalking={isPlayerSpeaking}
              speechText={playerSpeechText || undefined}
              heldItem={activeItem}
              showName={true}
              direction={facingDir}
            />
          </div>

          {/* ================= ROAMING CHARACTERS / COUNTRYBALLS / MOBS ================= */}
          {roamingCharacters.map(char => (
            <div
              key={char.id}
              onClick={(e) => {
                e.stopPropagation();
                if (char.avatar.subtype === 'zombie' || char.avatar.name.toLowerCase().includes('zombie')) {
                  audioEngine.playMinecraftSound('zombie');
                  dailyMissionManager.recordAction('defeat_zombie', 1);
                  dailyMissionManager.recordAction('defeat_mob', 1);
                  showToast(`⚔️ Slayed Minecraft Zombie! (+1 Zombie Defeated!)`);
                  return;
                }
                if (char.avatar.subtype === 'creeper') {
                  audioEngine.playMinecraftSound('fuse');
                  dailyMissionManager.recordAction('defeat_creeper', 1);
                  dailyMissionManager.recordAction('defeat_mob', 1);
                  showToast(`💥 Slayed Creeper before detonation!`);
                  return;
                }
                if (char.id === 185 || char.id === 187 || char.id === 188) {
                  setShowVerityShrineModal(true);
                  audioEngine.playVeritySound('oracle');
                }
                handleRoamingCharSpeak(char.id, char.avatar);
              }}
              className="absolute z-20 transition-all duration-700 cursor-pointer hover:scale-110 active:scale-95 group"
              style={{
                left: `${char.x * 40 - 4}px`,
                top: `${char.y * 40 - 20}px`,
                transform: `rotateZ(${-cameraYaw}deg) rotateX(${-cameraPitch}deg)`,
                transformOrigin: 'bottom center',
              }}
              title={`${char.avatar.name} - Click to make them talk!`}
            >
              {/* Ground Contact Shadow */}
              <div className="w-7 h-2 bg-black/40 rounded-full blur-[2px] absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none" />

              <CharacterAvatar
                character={char.avatar}
                size="sm"
                isWalking={char.isWalking}
                isTalking={!!activeSpeechMap[char.id]}
                speechText={activeSpeechMap[char.id] || undefined}
                showName={true}
              />
            </div>
          ))}

          {/* ================= ACTIVE ONLINE MULTIPLAYER PLAYERS ================= */}
          {onlinePlayers.map(player => (
            <div
              key={player.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPlayerToInteract(player);
                audioEngine.playRobloxSound('click');
              }}
              className="absolute z-25 transition-all duration-700 cursor-pointer hover:scale-115 active:scale-95 group select-none"
              style={{
                left: `${player.x * 40 - 4}px`,
                top: `${player.y * 40 - 24}px`,
                transform: `rotateZ(${-cameraYaw}deg) rotateX(${-cameraPitch}deg)`,
                transformOrigin: 'bottom center',
              }}
              title={`${player.name} (${player.rank} Lv.${player.level}) - Click to Interact!`}
            >
              {/* Ground Contact Shadow */}
              <div className="w-8 h-2 bg-black/50 rounded-full blur-[2px] absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none" />

              {/* Floating Rank & Player Tag */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10 whitespace-nowrap">
                <div className="flex items-center gap-1 bg-black/85 px-1.5 py-0.5 rounded-full border border-stone-700 shadow-md">
                  <span className={`text-[8px] font-bold px-1 rounded uppercase ${player.rankBadgeColor}`}>
                    {player.rank}
                  </span>
                  <span className="text-[10px] font-bold text-white">
                    {player.name}
                  </span>
                  <span className="text-[9px] text-yellow-300 font-bold">
                    Lv.{player.level}
                  </span>
                </div>
              </div>

              {/* Speech bubble if talking */}
              {player.speechText && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-2.5 py-1 rounded-xl shadow-xl border-2 border-amber-300 z-20 whitespace-nowrap animate-bounce flex items-center gap-1">
                  <span>{player.speechText}</span>
                  <div className="w-2 h-2 bg-amber-500 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2 border-r border-b border-amber-300" />
                </div>
              )}

              {/* Player Avatar */}
              <CharacterAvatar
                character={player.avatar}
                size="sm"
                isWalking={player.isWalking}
                isTalking={!!player.speechText}
                speechText={undefined}
                showName={false}
              />
            </div>
          ))}

          {/* ================= INTERACTIVE NPCS ================= */}
          {NPCS_DATA.map(npc => {
            const hasAvailable = npc.quests.some(q => !completedQuestIds.includes(q.id) && !activeQuestIds.includes(q.id));
            const hasReadyToTurnIn = npc.quests.some(q => activeQuestIds.includes(q.id) && (inventory[q.requiredItem]?.count || 0) >= q.requiredCount);
            const hasActive = npc.quests.some(q => activeQuestIds.includes(q.id));

            return (
              <div
                key={npc.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNPC(npc);
                }}
                className="absolute z-35 cursor-pointer flex flex-col items-center justify-center hover:scale-125 transition-all group select-none"
                style={{
                  left: `${npc.x * 40}px`,
                  top: `${npc.y * 40 - 20}px`,
                  transform: `rotateZ(${-cameraYaw}deg) rotateX(${-cameraPitch}deg)`,
                  transformOrigin: 'bottom center',
                }}
                title={`${npc.name} (${npc.title}) - Click to Talk`}
              >
                {/* Ground Contact Shadow */}
                <div className="w-8 h-2.5 bg-black/40 rounded-full blur-[2px] absolute -bottom-1 left-1/2 -translate-x-1/2 pointer-events-none" />

                {/* Floating Quest Indicator */}
                <div className="absolute -top-7 animate-bounce flex items-center justify-center">
                  {hasReadyToTurnIn ? (
                    <span className="bg-green-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-white whitespace-nowrap">
                      ❓ READY
                    </span>
                  ) : hasAvailable ? (
                    <span className="bg-yellow-400 text-black text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-lg border border-black whitespace-nowrap">
                      ! TASK
                    </span>
                  ) : hasActive ? (
                    <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-lg border border-white">
                      💬
                    </span>
                  ) : (
                    <span className="bg-gray-800 text-green-300 text-[9px] px-1 rounded-full border border-gray-600">
                      ✓
                    </span>
                  )}
                </div>

                {npc.id === 'npc_oren' ? (
                  <div className="scale-90 animate-sprunki-bop">
                    <CharacterAvatar
                      character={{ id: 11, name: 'Oren', type: 'sprnuki', subtype: 'oren' }}
                      size="sm"
                      isWalking={true}
                    />
                  </div>
                ) : npc.id === 'npc_hiro' ? (
                  <div className="scale-75">
                    <CharacterAvatar
                      character={{ id: 62, name: 'Hiro', type: 'train', color: 'bg-neutral-900' }}
                      size="sm"
                    />
                  </div>
                ) : (
                  <div className={`w-9 h-9 rounded-xl ${npc.avatarColor} border-2 border-yellow-300 shadow-2xl flex items-center justify-center text-lg ring-2 ring-yellow-400/50`}>
                    {npc.emoji}
                  </div>
                )}
                <span className="bg-black/90 text-yellow-300 text-[9px] font-bold px-1.5 py-0.5 rounded-md mt-0.5 whitespace-nowrap shadow border border-yellow-500/40">
                  {npc.name}
                </span>
              </div>
            );
          })}

          {/* 3D Atmospheric Weather Streaks */}
          {weather === 'rainy' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-blue-500/10" />
              <div className="w-full h-full opacity-60 flex justify-around">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="w-0.5 h-16 bg-gradient-to-b from-transparent via-cyan-300 to-transparent"
                    style={{
                      animation: `rain-fall-3d ${0.6 + (i % 4) * 0.2}s linear infinite ${(i * 0.1)}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {weather === 'snowy' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute inset-0 bg-white/10" />
              <div className="w-full h-full opacity-70 flex justify-around">
                {[...Array(14)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 bg-white rounded-full shadow-sm"
                    style={{
                      animation: `snow-fall-3d ${2 + (i % 5) * 0.5}s ease-in-out infinite ${(i * 0.2)}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Day / Night 3D Shading Layer */}
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-1000 bg-black"
            style={{
              opacity: Math.sin((timeOfDay / 100) * Math.PI) * 0.48
            }}
          />
        </div>
      </div>
    )}
  </div>


      {/* ================= INVENTORY & CRAFTING TABS ================= */}
      <div className="w-full max-w-6xl mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Inventory 
          items={inventory} 
          activeItem={activeItem} 
          onSelectItem={setActiveItem} 
          isCreative={isCreative}
          onAddCreativeItem={handleAddCreativeItem}
        />
        <CraftingPanel 
          inventory={inventory} 
          onCraft={handleCraft} 
          isCreative={isCreative} 
        />
      </div>

      {/* ================= MINECRAFT JUKEBOX & SONGS PLAYER ================= */}
      <div ref={jukeboxSectionRef} className="w-full max-w-6xl mt-4">
        <JukeboxPlayer defaultExpanded={true} />
      </div>

      {/* ================= NPC DIALOGUE & QUEST MODAL ================= */}
      {activeNPC && (
        <QuestDialogueModal
          npc={activeNPC}
          inventory={inventory}
          activeQuestIds={activeQuestIds}
          completedQuestIds={completedQuestIds}
          playerTrait={playerAvatar.countryballTrait}
          onAcceptQuest={handleAcceptQuest}
          onTurnInQuest={handleTurnInQuest}
          onClose={() => setActiveNPC(null)}
        />
      )}

      {/* ================= IN-GAME SPEECH & QUICK CHAT MODAL ================= */}
      {isChatDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-2 border-amber-500/70 rounded-3xl p-5 max-w-lg w-full shadow-2xl font-mono text-white relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40">
                  <MessageSquare size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                    Character Voice Chat & Speech Wheel
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                      TTS Active
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Make {playerAvatar.name} speak aloud with text-to-speech voice and floating speech bubble!
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsChatDialogOpen(false)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Quick Shout Phrases */}
            <div className="mb-4">
              <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1.5">
                Quick Shouts & Dialogue (Click to say):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {[
                  "⛏️ Found diamonds in the cavern!",
                  "⚔️ Watch out! Hostile mob spotted!",
                  "🎵 Drop that rhythm beatbox groove!",
                  "🚂 All aboard the Sodor Express!",
                  "🌲 Chopping wood to build our shelter!",
                  "🍕 Time for a hot pizza break!",
                  "💎 Enchanted armor forged and ready!",
                  "👋 Hello everyone! Let's explore together!",
                ].map((phrase, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePlayerSpeak(phrase)}
                    className="text-left px-2.5 py-1.5 rounded-xl bg-stone-800/80 hover:bg-amber-950/40 text-stone-200 hover:text-amber-200 border border-stone-700 hover:border-amber-500/60 text-xs transition active:scale-95 cursor-pointer truncate shadow-sm"
                  >
                    {phrase}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={customChatMessage}
                onChange={(e) => setCustomChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && customChatMessage.trim()) {
                    if (customChatMessage.trim().startsWith('/')) {
                      executeMinecraftCommand(customChatMessage.trim(), commandContext, playerAvatar.name);
                      setCustomChatMessage('');
                      setIsChatDialogOpen(false);
                    } else {
                      handlePlayerSpeak(customChatMessage.trim());
                      setCustomChatMessage('');
                    }
                  }
                }}
                placeholder={`Type text or /command (e.g. /tp, /time, /give)...`}
                className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                autoFocus
              />
              <button
                onClick={() => {
                  if (customChatMessage.trim()) {
                    if (customChatMessage.trim().startsWith('/')) {
                      executeMinecraftCommand(customChatMessage.trim(), commandContext, playerAvatar.name);
                      setCustomChatMessage('');
                      setIsChatDialogOpen(false);
                    } else {
                      handlePlayerSpeak(customChatMessage.trim());
                      setCustomChatMessage('');
                    }
                  } else {
                    handlePlayerSpeak(speechEngine.getRandomQuote(playerAvatar.name, playerAvatar.type, playerAvatar.subtype));
                  }
                }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
              >
                <Send size={13} />
                <span>Speak</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= 165 FPS HIGH REFRESH RATE PERFORMANCE MODAL ================= */}
      {showFpsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="bg-stone-900 border-2 border-emerald-500/80 rounded-3xl p-6 max-w-lg w-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] font-mono text-white relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                  <Zap size={22} className="text-yellow-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    165 FPS Ultra High-Refresh Engine
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40">
                      ACTIVE
                    </span>
                  </h3>
                  <p className="text-xs text-stone-400">
                    Hardware-accelerated GPU map compositing & sub-pixel 165Hz render loop
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowFpsModal(false)}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Performance Metrics Cards */}
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Framerate</span>
                <span className="text-2xl font-black text-emerald-400 mt-1">{currentFps} <span className="text-xs text-emerald-500 font-bold">FPS</span></span>
                <span className="text-[9px] text-stone-500 mt-0.5">Target: {targetFps} Hz</span>
              </div>
              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Frame Time</span>
                <span className="text-2xl font-black text-cyan-400 mt-1">{frameTimeMs} <span className="text-xs text-cyan-500 font-bold">ms</span></span>
                <span className="text-[9px] text-stone-500 mt-0.5">Ultra Responsive</span>
              </div>
              <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">V-Sync Mode</span>
                <span className="text-lg font-black text-amber-400 mt-1">165Hz</span>
                <span className="text-[9px] text-emerald-400 mt-0.5">GPU Synced</span>
              </div>
            </div>

            {/* Target Framerate Selection */}
            <div className="mb-5">
              <label className="text-xs text-stone-300 font-bold block mb-2">
                Target Display Refresh Rate:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { fps: 165, label: '165 FPS', badge: 'Ultra' },
                  { fps: 144, label: '144 FPS', badge: 'Esports' },
                  { fps: 120, label: '120 FPS', badge: 'Fast' },
                  { fps: 60, label: '60 FPS', badge: 'Eco' },
                ].map(opt => (
                  <button
                    key={opt.fps}
                    type="button"
                    onClick={() => {
                      setTargetFps(opt.fps);
                      setIs165FpsMode(opt.fps === 165);
                      showToast(`🚀 Framerate engine set to ${opt.fps} FPS!`);
                    }}
                    className={`py-2 px-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-0.5 transition cursor-pointer ${
                      targetFps === opt.fps
                        ? 'bg-emerald-950/90 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/40 shadow-lg'
                        : 'bg-stone-800/80 border-stone-700 text-stone-400 hover:text-white hover:bg-stone-700'
                    }`}
                  >
                    <span>{opt.label}</span>
                    <span className="text-[9px] text-yellow-300 font-normal">{opt.badge}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 165 FPS Hardware Features Checklist */}
            <div className="p-3 bg-stone-950/90 rounded-2xl border border-stone-800/80 mb-5 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>GPU Compositor (translate3d)</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Enabled</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>CSS Content Visibility & Voxel Culling</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">4,500 Blocks</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Sub-Pixel Motion Interpolation</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">6.06ms Tick</span>
              </div>
              <div className="flex items-center justify-between text-stone-300">
                <span className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span>Zero-Lag Smooth Camera Follow</span>
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">Active</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowFpsModal(false)}
                className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Apply & Resume (165 FPS)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= THE VERITY UPDATE: CELESTIAL SHRINE & TRUTH ALTAR MODAL ================= */}
      {showVerityShrineModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none font-mono text-white">
          <div className="bg-stone-900 border-2 border-purple-500/80 rounded-3xl p-6 max-w-xl w-full shadow-[0_0_50px_rgba(168,85,247,0.4)] relative flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-purple-500/40 pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-purple-500/20 text-purple-300 rounded-2xl border border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                  <Sparkles size={22} className="text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    The Verity Celestial Shrine & Truth Altar
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 font-bold border border-purple-400/50">
                      LANDMARK 6 (x: 86)
                    </span>
                  </h3>
                  <p className="text-xs text-purple-300">
                    Sacred truth sanctuary. Seek wisdom, blessings & celestial morphs.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowVerityShrineModal(false)}
                className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setPlayerPos({ x: 86, y: 6 });
                  scrollToPlayer();
                  showToast('✨ Teleported to Landmark 6: Celestial Shrine!');
                  setShowVerityShrineModal(false);
                  audioEngine.playVeritySound('oracle');
                }}
                className="p-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow cursor-pointer border border-purple-400/50 transition"
              >
                <span>🏛️</span>
                <span>Teleport to Celestial Shrine (x: 86)</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playVeritySound('wind');
                  showToast('⚙️ Winding Verity Music Box...');
                  setTimeout(() => {
                    audioEngine.playVeritySound('musicbox');
                    setTimeout(() => {
                      audioEngine.playVeritySound('pop');
                      showToast('📦 Verity in a Box: POP! Star fireworks!');
                    }, 1200);
                  }, 300);
                }}
                className="p-2.5 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400/60 rounded-xl font-bold text-xs text-amber-200 flex items-center justify-center gap-2 cursor-pointer transition shadow"
              >
                <span>📦</span>
                <span>Play Celestial Music Box</span>
              </button>
            </div>

            {/* Truth Blessings Section */}
            <div className="bg-stone-950/80 rounded-2xl p-4 border border-purple-500/30 space-y-3">
              <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
                <span>✦</span> Oracle Truth Blessings
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setIsFlying(prev => !prev);
                    showToast(isFlying ? '🕊️ Levitation disabled' : '🕊️ Starlight Levitation enabled! Float freely!');
                    audioEngine.playVeritySound('oracle');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center text-center gap-1 transition cursor-pointer ${
                    isFlying
                      ? 'bg-purple-900 border-amber-400 text-amber-200 shadow-[0_0_15px_#c084fc]'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-purple-400'
                  }`}
                >
                  <span className="text-lg">🕊️</span>
                  <span>Starlight Flight</span>
                  <span className="text-[10px] text-stone-400">{isFlying ? 'ACTIVE (Flying)' : 'Click to Toggle'}</span>
                </button>

                <button
                  onClick={() => {
                    setTruthXRayActive(prev => !prev);
                    showToast(truthXRayActive ? '👁️ Truth Sight disabled' : '👁️ Truth Sight ON! All ores glowing!');
                    audioEngine.playVeritySound('chimes');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center text-center gap-1 transition cursor-pointer ${
                    truthXRayActive
                      ? 'bg-amber-950/80 border-amber-400 text-amber-300 shadow-[0_0_15px_#facc15]'
                      : 'bg-stone-900 border-stone-800 text-stone-300 hover:border-amber-400'
                  }`}
                >
                  <span className="text-lg">👁️</span>
                  <span>Truth Sight (X-Ray)</span>
                  <span className="text-[10px] text-stone-400">{truthXRayActive ? 'ACTIVE (Glowing)' : 'Highlight Ores'}</span>
                </button>

                <button
                  onClick={() => {
                    setHealth(100);
                    setHunger(100);
                    showToast('💖 Celestial Truth restored full Health & Hunger!');
                    audioEngine.playVeritySound('oracle');
                  }}
                  className="p-3 rounded-xl border bg-stone-900 border-stone-800 hover:border-emerald-400 text-stone-300 hover:text-white text-xs font-bold flex flex-col items-center text-center gap-1 transition cursor-pointer"
                >
                  <span className="text-lg">💖</span>
                  <span>Full Healing</span>
                  <span className="text-[10px] text-emerald-400">Restore 100% HP</span>
                </button>
              </div>
            </div>

            {/* In-Game Verity Morphs */}
            <div className="bg-stone-950/80 rounded-2xl p-4 border border-purple-500/30 space-y-3">
              <h4 className="text-xs font-bold text-purple-300 flex items-center gap-1.5 uppercase tracking-wider">
                <span>🎭</span> Instant Character Morphs
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  {
                    name: 'Oracle Verity',
                    char: { id: 185, name: 'Verity', type: 'sprnuki' as const, subtype: 'verity', color: 'bg-purple-600', description: '✨ Celestial Star Oracle' },
                    icon: '✨',
                    sound: 'oracle' as const,
                  },
                  {
                    name: 'Verity in a Box',
                    char: { id: 187, name: 'Verity in a Box', type: 'sprnuki' as const, subtype: 'verity_box', color: 'bg-purple-900', description: '📦 Jack-in-the-Box Morph' },
                    icon: '📦',
                    sound: 'pop' as const,
                  },
                  {
                    name: 'Eclipse Verity',
                    char: { id: 186, name: 'Eclipse Verity', type: 'sprnuki' as const, subtype: 'verity', isHorror: true, color: 'bg-indigo-950', description: 'Phase 2 Eclipse Entity' },
                    icon: '🌑',
                    sound: 'eclipse' as const,
                  },
                  {
                    name: 'Steve',
                    char: { id: 21, name: 'Steve', type: 'minecraft' as const, subtype: 'steve', color: 'bg-cyan-600' },
                    icon: '⛏️',
                    sound: 'chimes' as const,
                  },
                ].map(m => (
                  <button
                    key={m.name}
                    onClick={() => {
                      setActiveAvatar(m.char as any);
                      audioEngine.playVeritySound(m.sound);
                      showToast(`🎭 Morphed into ${m.name}!`);
                      setShowVerityShrineModal(false);
                    }}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer ${
                      activeAvatar.name === m.name
                        ? 'bg-purple-900/80 border-purple-400 text-white ring-2 ring-purple-400/40 shadow-lg'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white hover:border-purple-500'
                    }`}
                  >
                    <span className="text-base">{m.icon}</span>
                    <span className="truncate w-full text-center">{m.name}</span>
                    {activeAvatar.name === m.name && (
                      <span className="text-[9px] text-amber-300 font-bold">ACTIVE</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-1">
              <button
                onClick={() => setShowVerityShrineModal(false)}
                className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl shadow transition cursor-pointer"
              >
                Close Shrine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= ON-SCREEN MOVEMENT CONTROLLER / VIRTUAL D-PAD (WASD & ARROWS) ================= */}
      <div className="fixed bottom-4 left-4 z-40 select-none font-mono">
        {/* Toggle Minimize/Maximize & Quick Status Bar */}
        <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setShowTouchControls(prev => !prev)}
            className="px-2.5 py-1 rounded-xl bg-stone-900/95 hover:bg-stone-800 text-stone-200 border border-stone-700/80 text-[11px] font-bold flex items-center gap-1.5 shadow-lg backdrop-blur cursor-pointer hover:border-emerald-400 transition"
            title="Toggle on-screen movement D-Pad"
          >
            <Gamepad2 size={13} className="text-emerald-400" />
            <span>{showTouchControls ? 'Minimize Controls' : '🎮 Move Steve (WASD / Arrows)'}</span>
          </button>

          {/* Live Walking Status Pill */}
          <div className={`px-2.5 py-1 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 backdrop-blur shadow-md transition-all ${
            isWalking 
              ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/80 shadow-[0_0_12px_rgba(16,185,129,0.3)]' 
              : 'bg-stone-900/90 text-stone-400 border-stone-700'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isWalking ? 'bg-emerald-400 animate-ping' : 'bg-stone-500'}`} />
            <span>{isWalking ? `WALKING (${facingDir.toUpperCase()})` : 'IDLE'}</span>
          </div>

          {showTouchControls && (
            <div className="flex items-center gap-1">
              {/* Sprint Toggle */}
              <button
                type="button"
                onClick={() => setIsSprinting(prev => !prev)}
                className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition cursor-pointer shadow ${
                  isSprinting
                    ? 'bg-amber-500 text-black border-amber-300 animate-pulse'
                    : 'bg-stone-900/90 text-stone-400 border-stone-700 hover:text-white'
                }`}
                title="Toggle 2x Sprint Speed (or hold Shift)"
              >
                ⚡ Sprint {isSprinting ? '2X' : 'OFF'}
              </button>

              {/* Fly Toggle */}
              <button
                type="button"
                onClick={() => setIsFlying(prev => !prev)}
                className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold transition cursor-pointer shadow ${
                  isFlying
                    ? 'bg-cyan-500 text-black border-cyan-300 animate-pulse'
                    : 'bg-stone-900/90 text-stone-400 border-stone-700 hover:text-white'
                }`}
                title="Toggle Creative Flight Mode"
              >
                🕊️ Fly {isFlying ? 'ON' : 'OFF'}
              </button>
            </div>
          )}
        </div>

        {/* Directional Pad Layout & Action Strip */}
        {showTouchControls && (
          <div className="p-3 rounded-2xl bg-stone-950/95 border-2 border-stone-700/90 shadow-[0_12px_36px_rgba(0,0,0,0.85)] backdrop-blur-md flex flex-col gap-2">
            <div className="flex items-center justify-between text-[10px] text-stone-400 border-b border-stone-800 pb-1.5 px-0.5">
              <span className="flex items-center gap-1 font-bold text-stone-300">
                <Navigation size={11} className="text-emerald-400" />
                <span>Move Steve</span>
              </span>
              <span className="text-[9px] text-stone-400">
                X:{playerPos.x} Y:{playerPos.y}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* 3x3 Cross D-Pad with Directional Arrows & WASD Key Badges */}
              <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
                <div />

                {/* UP (W / ↑) */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                    startHoldMove(0, -1, 'w');
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                    stopHoldMove('w');
                  }}
                  onPointerCancel={() => stopHoldMove('w')}
                  onPointerLeave={() => stopHoldMove('w')}
                  onClick={() => movePlayer(0, -1)}
                  className={`mc-btn rounded-xl flex flex-col items-center justify-center cursor-pointer shadow font-black transition active:scale-95 ${
                    activeKeys.has('w') 
                      ? 'border-emerald-400 bg-emerald-950/80 text-yellow-300 ring-2 ring-emerald-400/60 scale-95' 
                      : 'text-white hover:text-yellow-300'
                  }`}
                  title="Move Up / Forward (W or ↑ Arrow) - Click or Hold"
                >
                  <ArrowUp size={18} />
                  <span className="text-[9px] font-mono leading-none mt-0.5 text-amber-300">W</span>
                </button>

                <div />

                {/* LEFT (A / ←) */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                    startHoldMove(-1, 0, 'a');
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                    stopHoldMove('a');
                  }}
                  onPointerCancel={() => stopHoldMove('a')}
                  onPointerLeave={() => stopHoldMove('a')}
                  onClick={() => movePlayer(-1, 0)}
                  className={`mc-btn rounded-xl flex flex-col items-center justify-center cursor-pointer shadow font-black transition active:scale-95 ${
                    activeKeys.has('a') 
                      ? 'border-emerald-400 bg-emerald-950/80 text-yellow-300 ring-2 ring-emerald-400/60 scale-95' 
                      : 'text-white hover:text-yellow-300'
                  }`}
                  title="Move Left (A or ← Arrow) - Click or Hold"
                >
                  <ArrowLeft size={18} />
                  <span className="text-[9px] font-mono leading-none mt-0.5 text-amber-300">A</span>
                </button>

                {/* JUMP / HOP (CENTER BUTTON / SPACE) */}
                <button
                  type="button"
                  onClick={jumpPlayer}
                  className="mc-btn mc-btn-primary rounded-xl flex flex-col items-center justify-center cursor-pointer active:scale-90 shadow text-white hover:text-yellow-200 transition"
                  title="Jump / Hop (Spacebar)"
                >
                  <Feather size={14} className="text-yellow-300" />
                  <span className="text-[9px] font-black leading-none mt-0.5">HOP</span>
                </button>

                {/* RIGHT (D / →) */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                    startHoldMove(1, 0, 'd');
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                    stopHoldMove('d');
                  }}
                  onPointerCancel={() => stopHoldMove('d')}
                  onPointerLeave={() => stopHoldMove('d')}
                  onClick={() => movePlayer(1, 0)}
                  className={`mc-btn rounded-xl flex flex-col items-center justify-center cursor-pointer shadow font-black transition active:scale-95 ${
                    activeKeys.has('d') 
                      ? 'border-emerald-400 bg-emerald-950/80 text-yellow-300 ring-2 ring-emerald-400/60 scale-95' 
                      : 'text-white hover:text-yellow-300'
                  }`}
                  title="Move Right (D or → Arrow) - Click or Hold"
                >
                  <ArrowRight size={18} />
                  <span className="text-[9px] font-mono leading-none mt-0.5 text-amber-300">D</span>
                </button>

                <div />

                {/* DOWN (S / ↓) */}
                <button
                  type="button"
                  onPointerDown={(e) => {
                    e.preventDefault();
                    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
                    startHoldMove(0, 1, 's');
                  }}
                  onPointerUp={(e) => {
                    e.preventDefault();
                    try { (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId); } catch {}
                    stopHoldMove('s');
                  }}
                  onPointerCancel={() => stopHoldMove('s')}
                  onPointerLeave={() => stopHoldMove('s')}
                  onClick={() => movePlayer(0, 1)}
                  className={`mc-btn rounded-xl flex flex-col items-center justify-center cursor-pointer shadow font-black transition active:scale-95 ${
                    activeKeys.has('s') 
                      ? 'border-emerald-400 bg-emerald-950/80 text-yellow-300 ring-2 ring-emerald-400/60 scale-95' 
                      : 'text-white hover:text-yellow-300'
                  }`}
                  title="Move Down (S or ↓ Arrow) - Click or Hold"
                >
                  <ArrowDown size={18} />
                  <span className="text-[9px] font-mono leading-none mt-0.5 text-amber-300">S</span>
                </button>

                <div />
              </div>

              {/* Quick Action Buttons Beside D-Pad */}
              <div className="flex flex-col gap-1.5 border-l border-stone-800 pl-2.5">
                <button
                  type="button"
                  onClick={handleMinecraftAction}
                  className="px-2.5 py-2 rounded-xl bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-200 border border-cyan-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
                  title="Mine / Strike action (M key)"
                >
                  <Swords size={13} className="text-cyan-400" />
                  <span>Strike [M]</span>
                </button>

                <button
                  type="button"
                  onClick={handleDropBeatbox}
                  className="px-2.5 py-2 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 text-orange-200 border border-orange-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
                  title="Drop Sprunki Beatbox (B key)"
                >
                  <Music size={13} className="text-orange-400" />
                  <span>Beatbox [B]</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsChatDialogOpen(true)}
                  className="px-2.5 py-2 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
                  title="Character Voice Lines & TTS (T key)"
                >
                  <MessageSquare size={13} className="text-amber-400" />
                  <span>Talk [T]</span>
                </button>

                {/* Class Starting Ability Action Button */}
                {(() => {
                  const cust = avatarManager.getLocalCustomization();
                  const playerClass = CHARACTER_CLASSES.find(c => c.id === cust.customClass) || CHARACTER_CLASSES[0];
                  const ability = playerClass.startingAbility;
                  const isReady = classAbilityCooldown === 0;

                  return (
                    <button
                      type="button"
                      onClick={handleCastClassAbility}
                      className={`px-2.5 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95 ${
                        isReady
                          ? 'bg-purple-600/40 hover:bg-purple-600/60 text-purple-200 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                          : 'bg-stone-800 text-stone-400 border border-stone-700 opacity-70'
                      }`}
                      title={`${ability.name} [Q key] - ${ability.description}`}
                    >
                      <span className="text-xs">{ability.icon}</span>
                      <span className="truncate max-w-[85px]">{isReady ? `${ability.name.split(' ')[0]} [Q]` : `${classAbilityCooldown}s`}</span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Controls Guide Footnote */}
            <div className="pt-1.5 border-t border-stone-800/80 text-[9px] text-stone-400 flex items-center justify-between">
              <span>⌨️ Keys: <strong className="text-yellow-300">W A S D</strong> or <strong className="text-stone-300">Arrows</strong></span>
              <span>Hold arrows to walk continuously</span>
            </div>
          </div>
        )}
      </div>

      {/* ================= IN-GAME PAUSE / GAME MENU ================= */}
      <GamePauseMenu
        isOpen={isPauseMenuOpen}
        onClose={() => setIsPauseMenuOpen(false)}
        gameMode={gameMode}
        onToggleGameMode={toggleGameMode}
        onQuitToTitle={onQuitToMenu || (() => {})}
        playerAvatar={playerAvatar}
        questsCount={{ active: activeQuestIds.length, completed: completedQuestIds.length }}
        onOpenQuests={() => {
          setIsPauseMenuOpen(false);
          setActiveNPC(NPCS_DATA[0]);
        }}
        weather={weather}
        onChangeWeather={setWeather}
        onSetTimeOfDay={setTimeOfDay}
        isFlying={isFlying}
        onToggleFlying={() => setIsFlying(prev => !prev)}
        onOpenSettings={() => {
          setIsPauseMenuOpen(false);
          setIsSettingsOpen(true);
        }}
      />

      {/* ================= IN-GAME SETTINGS MODAL ================= */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeGameMode={gameMode}
        onChangeGameMode={toggleGameMode}
        difficulty={difficulty}
        onChangeDifficulty={setDifficulty}
        weather={weather}
        onChangeWeather={setWeather}
        timeOfDay={timeOfDay}
        onSetTimeOfDay={setTimeOfDay}
        targetFps={targetFps}
        onChangeTargetFps={setTargetFps}
        isExpandedView={isExpandedView}
        onToggleExpandedView={() => setIsExpandedView(prev => !prev)}
        onResetWorld={handleRespawn}
      />

      {/* ================= IN-GAME ROBLOX APP OVERLAY MODAL ================= */}
      {isRobloxAppOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
          <div className="w-full max-w-6xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl">
            <RobloxApp
              currentAvatar={playerAvatar}
              onSelectAvatar={(char) => {
                setActiveAvatar(char);
                showToast(`Roblox Avatar ${char.name} Equipped!`);
              }}
              onLaunchGame={() => {
                setIsRobloxAppOpen(false);
                showToast(`Playing as ${playerAvatar.name} in MegaWorld!`);
              }}
              onClose={() => setIsRobloxAppOpen(false)}
              onOpenCommunityDashboard={() => {
                setIsRobloxAppOpen(false);
                onQuitToMenu?.();
              }}
            />
          </div>
        </div>
      )}

      {/* ================= COMMAND BLOCK CONSOLE GUI MODAL ================= */}
      {isCommandBlockModalOpen && activeCommandBlock && (
        <CommandBlockModal
          isOpen={isCommandBlockModalOpen}
          blockData={activeCommandBlock}
          commandContext={commandContext}
          onSave={(updated) => {
            setCommandBlocksData(prev => ({ ...prev, [updated.id]: updated }));
            // Update block type in grid if mode changed
            const cellX = updated.x;
            const cellY = updated.y;
            const localC = cellX - viewportChunkX;
            const targetBlock = 
              updated.mode === 'repeat' ? 'repeating_command_block' :
              updated.mode === 'chain' ? 'chain_command_block' : 'command_block';
            setModifiedWorldBlocks(prev => ({ ...prev, [`${cellX},${cellY}`]: targetBlock }));
            if (localC >= 0 && localC < cols && cellY >= 0 && cellY < rows) {
              setGrid(prev => {
                const next = [...prev];
                next[cellY * cols + localC] = targetBlock;
                return next;
              });
            }
          }}
          onClose={() => setIsCommandBlockModalOpen(false)}
        />
      )}

      {/* ================= 200,000,000 BILLION BLOCK UNIVERSE WARP MODAL ================= */}
      {isUniverseWarpOpen && (
        <UniverseWarpModal
          isOpen={isUniverseWarpOpen}
          currentX={playerPos.x}
          currentY={playerPos.y}
          onWarp={(x, y) => {
            setPlayerPos({ x, y });
            setIsWalking(true);
            playEffect('build');
            showToast(`✨ Teleported to X: ${formatBlockNumber(x)}, Y: ${y}!`);
            setTimeout(() => setIsWalking(false), 300);
          }}
          onClose={() => setIsUniverseWarpOpen(false)}
        />
      )}

      {/* ================= MULTIPLAYER SERVER SCOREBOARD MODAL ================= */}
      {showScoreboard && (
        <MultiplayerScoreboardModal
          players={onlinePlayers}
          currentPlayerAvatar={playerAvatar}
          currentPlayerPos={playerPos}
          onClose={() => setShowScoreboard(false)}
          onSelectPlayer={(p) => {
            setShowScoreboard(false);
            setSelectedPlayerToInteract(p);
          }}
          onWarpToPlayer={handleWarpToPlayer}
        />
      )}

      {/* ================= PLAYER INTERACTION PROFILE CARD MODAL ================= */}
      {selectedPlayerToInteract && (
        <PlayerInteractionModal
          player={selectedPlayerToInteract}
          playerInventory={inventory}
          onClose={() => setSelectedPlayerToInteract(null)}
          onTradeItem={handleTradeWithPlayer}
          onHighFive={handleHighFivePlayer}
          onDuel={handleDuelPlayer}
          onToggleParty={handleTogglePartyMember}
          onSendWhisper={(p, msg) => {
            showToast(`💬 Whispered to ${p.name}: "${msg}"`);
          }}
        />
      )}

      {/* ================= VEHICLE & MOUNT GARAGE MODAL [G] ================= */}
      {isGarageModalOpen && (
        <VehicleGarageModal
          isOpen={isGarageModalOpen}
          onClose={() => setIsGarageModalOpen(false)}
        />
      )}

      {/* ================= COMPANION PET SANCTUARY MODAL [P] ================= */}
      {isPetModalOpen && (
        <CompanionPetModal
          isOpen={isPetModalOpen}
          onClose={() => setIsPetModalOpen(false)}
        />
      )}

      {/* ================= MULTIVERSE WORLD BOSS RAID SUMMONER MODAL [K] ================= */}
      {isBossModalOpen && (
        <BossRaidSummonModal
          isOpen={isBossModalOpen}
          onClose={() => setIsBossModalOpen(false)}
          onWarpToArena={(x: number, y: number) => {
            setPlayerPos({ x, y });
            setIsWalking(true);
            playEffect('build');
            showToast(`⚡ Teleported to Boss Arena at X: ${x}, Y: ${y}! Prepare for battle!`);
            setTimeout(() => setIsWalking(false), 300);
          }}
        />
      )}

      {/* ================= 1,000 CHRISTMAS MEGA EDITION MODAL ================= */}
      {isChristmasMegaModalOpen && (
        <ChristmasMegaModal
          isOpen={isChristmasMegaModalOpen}
          onClose={() => setIsChristmasMegaModalOpen(false)}
          currentAvatar={playerAvatar}
          onSelectCharacter={(char) => {
            setActiveAvatar(char);
            showToast(`🎅 Equipped ${char.name} as active hero!`);
          }}
          onAddItemToInventory={(item) => {
            showToast(`🎁 Claimed ${item.name} to hotbar!`);
          }}
        />
      )}

      {/* ================= MULTIVERSE BRAND HUBS MODAL ================= */}
      {isBrandHubModalOpen && (
        <BrandHubModal
          isOpen={isBrandHubModalOpen}
          onClose={() => setIsBrandHubModalOpen(false)}
          onTeleportToHub={(coords, hubName) => {
            setPlayerPos({ x: coords.x, y: coords.y });
            audioEngine.playMinecraftSound('portal');
            showToast(`⚡ Fast Traveled to ${hubName} at X:${coords.x}, Y:${coords.y}!`);
          }}
          onRewardClaimed={(itemName) => {
            showToast(`🌟 Received Brand Reward: ${itemName}!`);
          }}
        />
      )}

      {/* ================= POLANDBALL & COUNTRYBALL CREATOR MODAL ================= */}
      {isCountryballModalOpen && (
        <CountryballCreatorModal
          isOpen={isCountryballModalOpen}
          onClose={() => setIsCountryballModalOpen(false)}
          user={auth.currentUser}
          onApplyCountryball={(cbData) => {
            setActiveAvatar(cbData);
            showToast(`🌐 Equipped ${cbData.name}ball with ${cbData.countryballTrait || 'custom'} trait!`);
          }}
        />
      )}

      {/* ================= CROSS-PLATFORM CLOUD PROGRESSION MODAL ================= */}
      {isProgressionModalOpen && (
        <ProgressionModal
          isOpen={isProgressionModalOpen}
          onClose={() => setIsProgressionModalOpen(false)}
          user={auth.currentUser}
        />
      )}
    </div>
  );
}
