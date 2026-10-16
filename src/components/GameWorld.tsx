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
import { audioEngine } from '../utils/audioEngine';
import { SONGS_PLAYLIST } from '../utils/musicTracks';
import { 
  Sun, CloudRain, Snowflake, Compass, ZoomIn, ZoomOut, 
  Navigation, Swords, Palette, Sparkles, Feather, Moon,
  RotateCcw, Skull, Shield, Hammer, Flame, Wand2, Menu,
  Box, Maximize2, Minimize2, Eye, RotateCw, Layers, SlidersHorizontal,
  Mountain, Trees, Sunset, Cloud, Music, Disc, MessageSquare, Mic,
  Volume2, VolumeX, Zap, Radio, Send
} from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

const rows = 50;
const cols = 90;

interface RoamingCharacter {
  id: number;
  x: number;
  y: number;
  avatar: CharacterData;
  isWalking: boolean;
}

interface GameWorldProps {
  selectedAvatar?: CharacterData;
  initialGameMode?: 'survival' | 'creative';
  onChangeGameMode?: (mode: 'survival' | 'creative') => void;
  onQuitToMenu?: () => void;
}

export default function GameWorld({ 
  selectedAvatar, 
  initialGameMode = 'survival',
  onChangeGameMode,
  onQuitToMenu 
}: GameWorldProps) {
  const { playEffect, playAmbient } = useSound();
  const [isPauseMenuOpen, setIsPauseMenuOpen] = useState(false);
  const playerAvatar = selectedAvatar || {
    id: 21,
    name: 'Steve',
    type: 'minecraft',
    subtype: 'steve',
    color: 'bg-cyan-600',
  };

  // Game Mode State: 'survival' or 'creative'
  const [gameMode, setGameMode] = useState<'survival' | 'creative'>(initialGameMode);
  const isCreative = gameMode === 'creative';

  // Creative Flight Mode
  const [isFlying, setIsFlying] = useState(false);

  // Survival Death State
  const [isDead, setIsDead] = useState(false);
  const [blocksMinedCount, setBlocksMinedCount] = useState(0);

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
  });
  const [activeItem, setActiveItem] = useState('pickaxe');

  // Survival Stats
  const [health, setHealth] = useState(100);
  const [hunger, setHunger] = useState(100);

  // Player Position, Movement & Direction
  const [playerPos, setPlayerPos] = useState({ x: 25, y: 7 });
  const [isWalking, setIsWalking] = useState(false);
  const [facingDir, setFacingDir] = useState<'left' | 'right'>('right');
  const [followCamera, setFollowCamera] = useState(true);
  const [zoom, setZoom] = useState(1);
  const walkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Weather Variety & Day/Night Cycle
  const [weather, setWeather] = useState<'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon'>('sunny');
  const [timeOfDay, setTimeOfDay] = useState(20); // 0 to 100

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

  // Refs
  const mapScrollRef = useRef<HTMLDivElement>(null);
  const minimapCanvasRef = useRef<HTMLCanvasElement>(null);
  const jukeboxSectionRef = useRef<HTMLDivElement>(null);

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

    return initialGrid;
  });

  // Roaming NPCs / Other Players Across All Biomes
  const [beatboxActive, setBeatboxActive] = useState(false);
  const [mcActionActive, setMcActionActive] = useState(false);
  const [roamingCharacters, setRoamingCharacters] = useState<RoamingCharacter[]>([
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
    if (isCreative || isDead) return;

    const hungerInterval = setInterval(() => {
      setHunger(prev => Math.max(0, prev - 1));
    }, 9000);
    return () => clearInterval(hungerInterval);
  }, [isCreative, isDead]);

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

  // Center camera on Steve
  const scrollToPlayer = useCallback(() => {
    if (!mapScrollRef.current) return;
    const targetLeft = playerPos.x * 41 - 500;
    const targetTop = playerPos.y * 41 - 400;
    mapScrollRef.current.scrollTo({
      left: Math.max(0, targetLeft),
      top: Math.max(0, targetTop),
      behavior: 'smooth',
    });
  }, [playerPos]);

  useEffect(() => {
    if (followCamera) {
      scrollToPlayer();
    }
  }, [playerPos, followCamera, scrollToPlayer]);

  const handleDropBeatbox = useCallback(() => {
    audioEngine.playSprunkiSound(playerAvatar.name, playerAvatar.isHorror);
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
    if (isPlayerMinecraft) {
      audioEngine.playMinecraftSound(
        playerAvatar.heldWeapon || playerAvatar.subtype || playerAvatar.name
      );
      showToast(`⚔️ ${playerAvatar.name} strikes with power!`);
    } else {
      audioEngine.playMinecraftSound('pickaxe');
      showToast(`⛏️ Action strike!`);
    }
    setMcActionActive(true);
    setTimeout(() => setMcActionActive(false), 400);
  }, [playerAvatar, showToast]);

  // Keyboard Movement for Steve (WASD / Arrows) & Menu (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      
      // Escape key toggles the Game Menu
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsPauseMenuOpen(prev => !prev);
        return;
      }

      if (isPauseMenuOpen || isDead) return;

      const speed = isFlying ? 2 : 1;
      let dx = 0;
      let dy = 0;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        dx = -speed;
        setFacingDir('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        dx = speed;
        setFacingDir('right');
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        dy = -speed;
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        dy = speed;
      } else if (e.key === 'b' || e.key === 'B') {
        handleDropBeatbox();
        return;
      } else if (e.key === 'm' || e.key === 'M') {
        handleMinecraftAction();
        return;
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsChatDialogOpen(prev => !prev);
        return;
      } else {
        return;
      }

      e.preventDefault();

      setPlayerPos(prev => {
        const nextX = Math.max(0, Math.min(cols - 1, prev.x + dx));
        const nextY = Math.max(0, Math.min(rows - 1, prev.y + dy));
        return { x: nextX, y: nextY };
      });

      setIsWalking(true);
      playEffect('build');

      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
      walkTimeoutRef.current = setTimeout(() => {
        setIsWalking(false);
      }, 250);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlying, isDead, isPauseMenuOpen, playEffect, playerAvatar, handleDropBeatbox, handleMinecraftAction]);

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

  // Block Mining & Building Interactivity
  const handleCellClick = (index: number) => {
    if (isDead) return;
    const currentCell = grid[index];

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
      const minedBlock = currentCell;
      const newGrid = [...grid];
      newGrid[index] = 'sky';
      setGrid(newGrid);
      setBlocksMinedCount(prev => prev + 1);

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
      // In Creative mode: unlimited placement!
      if (isCreative) {
        playEffect('build');
        const newGrid = [...grid];
        newGrid[index] = activeItem === 'door' ? 'door_closed' : activeItem;
        setGrid(newGrid);
        return;
      }

      // In Survival mode: requires item in inventory
      if ((inventory[activeItem]?.count || 0) > 0) {
        playEffect('build');
        const newGrid = [...grid];
        newGrid[index] = activeItem === 'door' ? 'door_closed' : activeItem;
        setGrid(newGrid);

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
          <button
            onClick={() => setIsChatDialogOpen(prev => !prev)}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md"
            title="Press T or click to speak aloud"
          >
            <MessageSquare size={13} />
            <span>💬 Talk (T)</span>
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

        {/* Right: Lighting, Grid & Fullscreen Toggles */}
        <div className="flex items-center gap-1.5">
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

      {/* ================= 3D ISOMETRIC GAME CANVAS ================= */}
      <div 
        ref={mapScrollRef}
        className={`relative bg-stone-950 border-4 border-stone-800 rounded-3xl overflow-auto shadow-2xl transition-all ${
          isExpandedView ? 'w-full h-[84vh]' : 'w-full max-w-6xl h-[680px]'
        }`}
      >
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
        <div className="absolute top-4 left-4 z-40 bg-stone-950/85 border border-stone-800 px-3 py-1.5 rounded-xl font-mono text-[11px] text-stone-300 shadow-xl backdrop-blur-md flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-1 font-bold text-emerald-400">
            <span>📍 X: {playerPos.x}</span>
            <span className="text-stone-500">|</span>
            <span>Y: {playerPos.y}</span>
            <span className="text-stone-500">|</span>
            <span className="text-stone-400">Z: {rows - playerPos.y}</span>
          </div>
          <span className="text-stone-600">•</span>
          <div className="text-stone-300 font-bold">
            {playerPos.x < 20 ? '🌲 Emerald Forest' :
             playerPos.x < 38 ? '🏜️ Desert Dunes' :
             playerPos.x < 56 ? '❄️ Snow Tundra' :
             playerPos.x < 74 ? '🔥 Nether Wastes' : '🍄 Deep Dark & Mushroom Grove'}
          </div>
          <span className="text-stone-600 hidden sm:inline">•</span>
          <div className="text-yellow-400 font-bold hidden sm:inline">
            {timeOfDay < 45 ? '☀️ Daytime' : timeOfDay < 65 ? '🌅 Sunset' : timeOfDay < 95 ? '🌙 Nighttime' : '🌄 Dawn'}
          </div>
        </div>

        {/* 3D Tilted World Grid */}
        <div 
          className="relative grid select-none transition-transform duration-200"
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
                onMouseLeave={() => setHoveredCellIndex(null)}
                onClick={() => handleCellClick(index)}
                className={`w-10 h-10 cursor-pointer relative flex items-center justify-center select-none transition-all
                  ${showGridLines && !isSky ? 'border-r border-b border-black/25' : ''}
                  ${showGridLines && isSky ? 'border border-sky-400/[0.08] hover:border-sky-300/40' : ''}
                  ${has3DExtrusion ? 'border-b-[4px] border-r-[3px] shadow-sm' : ''}
                  ${isJustPlaced ? 'animate-block-pop' : ''}
                  ${isHovered ? 'outline outline-2 outline-white shadow-[0_0_12px_rgba(255,255,255,0.7)] z-25 scale-[1.02]' : ''}

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
                  ${block === 'lava' ? 'bg-gradient-to-t from-orange-600 via-amber-500 to-yellow-400 border-t-[4px] border-t-yellow-300 animate-pulse' : ''} 
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
                  ${isClosedDoor ? 'bg-[#6d4c41] border-t-[4px] border-t-[#8d6e63]' : ''} 
                  ${isOpenDoor ? 'bg-sky-400/20 border-2 border-dashed border-[#6d4c41]' : ''} 
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

                {/* Placement Preview Ghost in Sky Air */}
                {isSky && isHovered && (
                  <div className="absolute inset-1 border border-dashed border-emerald-400/80 bg-emerald-500/20 rounded-xs flex items-center justify-center text-[9px] font-mono text-emerald-300 pointer-events-none">
                    +
                  </div>
                )}
              </div>
            );
          })}

          {/* ================= STEVE: 3D BILLBOARD WITH SHADOW ================= */}
          <div
            className={`absolute z-30 transition-all duration-150 pointer-events-none ${
              isFlying ? '-translate-y-8 shadow-2xl' : ''
            }`}
            style={{
              left: `${playerPos.x * 40 - 4}px`,
              top: `${playerPos.y * 40 - 24}px`,
              transform: `rotateZ(${-cameraYaw}deg) rotateX(${-cameraPitch}deg)`,
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
            <CharacterAvatar
              character={playerAvatar}
              size="md"
              isWalking={isWalking}
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
                    handlePlayerSpeak(customChatMessage.trim());
                    setCustomChatMessage('');
                  }
                }}
                placeholder={`Type anything for ${playerAvatar.name} to speak...`}
                className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                autoFocus
              />
              <button
                onClick={() => {
                  if (customChatMessage.trim()) {
                    handlePlayerSpeak(customChatMessage.trim());
                    setCustomChatMessage('');
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
      />
    </div>
  );
}
