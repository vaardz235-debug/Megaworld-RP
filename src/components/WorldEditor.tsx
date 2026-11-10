import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Pencil, Paintbrush, PaintBucket, Eraser, Pipette, Square, 
  Minus, Undo2, Redo2, Trash2, Download, Upload, Play, Save, 
  Sparkles, Layers, Box, HelpCircle, Check, X, Copy, Eye, 
  Share2, Compass, RefreshCw, ZoomIn, ZoomOut, ArrowLeft,
  ChevronDown, ChevronUp, Plus, ShieldCheck, Flame, Zap
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { socialFeedManager, BuildSchematic } from '../utils/socialFeedManager';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';

export interface SavedLevel {
  id: string;
  name: string;
  author: string;
  description: string;
  rows: number;
  cols: number;
  grid: string[][];
  theme: string;
  updatedAt: number;
}

export interface PaletteBlock {
  id: string;
  name: string;
  icon: string;
  category: 'Halloween' | 'Terrain' | 'Building' | 'Ores' | 'Functional' | 'Nature' | 'Fluids';
  color: string;
  borderColor?: string;
  description: string;
}

export const EDITOR_PALETTE: PaletteBlock[] = [
  // Halloween Update 🎃
  { id: 'carved_pumpkin', name: 'Carved Pumpkin', icon: '🎃', category: 'Halloween', color: '#ea580c', borderColor: '#c2410c', description: 'Orange carved gourd with menacing grin' },
  { id: 'jack_o_lantern', name: 'Jack-o\'-Lantern', icon: '🏮', category: 'Halloween', color: '#f97316', borderColor: '#ea580c', description: 'Glowing illuminated jack-o\'-lantern casting level 15 light' },
  { id: 'witch_cauldron', name: 'Witch\'s Cauldron', icon: '🧙', category: 'Halloween', color: '#18181b', borderColor: '#27272a', description: 'Bubbling cauldron with glowing green brew' },
  { id: 'spooky_cobweb', name: 'Haunted Cobweb', icon: '🕸️', category: 'Halloween', color: '#e2e8f0', borderColor: '#cbd5e1', description: 'Spectral spider silk that slows movement' },
  { id: 'tombstone', name: 'Catacomb Tombstone', icon: '🪦', category: 'Halloween', color: '#475569', borderColor: '#334155', description: 'Weathered stone gravestone with R.I.P marker' },
  { id: 'ghost_lantern', name: 'Ghost Wisp Lantern', icon: '👻', category: 'Halloween', color: '#7e22ce', borderColor: '#a855f7', description: 'Mystic lantern containing a dancing spirit wisp' },

  // Terrain
  { id: 'grass', name: 'Grass Block', icon: '🌱', category: 'Terrain', color: '#557a2b', borderColor: '#7cfc00', description: 'Topsoil with lush grass turf' },
  { id: 'dirt', name: 'Dirt Loam', icon: '🟫', category: 'Terrain', color: '#866043', borderColor: '#5c3e28', description: 'Rich mineral soil for farming and leveling' },
  { id: 'stone', name: 'Stone Bedrock', icon: '🪨', category: 'Terrain', color: '#808080', borderColor: '#595959', description: 'Solid chisel granitic foundation stone' },
  { id: 'cobblestone', name: 'Cobblestone', icon: '🪨', category: 'Terrain', color: '#6b7280', borderColor: '#4b5563', description: 'Cracked, rough-hewn stone pavers' },
  { id: 'sand', name: 'Desert Sand', icon: '🏖️', category: 'Terrain', color: '#fef08a', borderColor: '#fde047', description: 'Fine golden silica sand granules' },
  { id: 'sandstone', name: 'Sandstone', icon: '🏛️', category: 'Terrain', color: '#fde047', borderColor: '#eab308', description: 'Compressed arid desert rock' },
  { id: 'snow', name: 'Snow Block', icon: '❄️', category: 'Terrain', color: '#f8fafc', borderColor: '#cbd5e1', description: 'Soft frozen powder snow' },
  { id: 'ice', name: 'Packed Ice', icon: '🧊', category: 'Terrain', color: '#7dd3fc', borderColor: '#38bdf8', description: 'Slick translucent glacial ice' },
  { id: 'magma', name: 'Magma Block', icon: '🌋', category: 'Terrain', color: '#c2410c', borderColor: '#ea580c', description: 'Thermal volcanic crust with molten veins' },
  { id: 'mycelium', name: 'Mycelium', icon: '🟣', category: 'Terrain', color: '#8e7cc3', borderColor: '#a855f7', description: 'Fungal spore earth for giant mushrooms' },

  // Building
  { id: 'wood', name: 'Oak Log', icon: '🪵', category: 'Building', color: '#5d4037', borderColor: '#3e2723', description: 'Sturdy natural oak tree wood' },
  { id: 'planks', name: 'Oak Planks', icon: '🪵', category: 'Building', color: '#a1887f', borderColor: '#8d6e63', description: 'Milled wooden lumber planks' },
  { id: 'bricks', name: 'Clay Bricks', icon: '🧱', category: 'Building', color: '#b71c1c', borderColor: '#7f0000', description: 'Kiln-fired red terracotta masonry' },
  { id: 'glass', name: 'Glass Window', icon: '🪟', category: 'Building', color: '#bae6fd', borderColor: '#7dd3fc', description: 'Translucent architectural glass pane' },
  { id: 'bookshelf', name: 'Bookshelf', icon: '📚', category: 'Building', color: '#78350f', borderColor: '#451a03', description: 'Scholastic shelves filled with knowledge' },
  { id: 'obsidian', name: 'Hard Obsidian', icon: '⬛', category: 'Building', color: '#150e28', borderColor: '#2e1065', description: 'Blast-proof volcanic obsidian glass' },
  { id: 'crying_obsidian', name: 'Crying Obsidian', icon: '🌌', category: 'Building', color: '#1e1b4b', borderColor: '#c084fc', description: 'Magical glass weeping celestial tears' },

  // Ores & Minerals
  { id: 'coal', name: 'Coal Ore', icon: '⚫', category: 'Ores', color: '#262626', borderColor: '#171717', description: 'Combustible carbon ore vein' },
  { id: 'ore', name: 'Iron Ore', icon: '✨', category: 'Ores', color: '#d97706', borderColor: '#b45309', description: 'Metallic mineral vein for tools & armor' },
  { id: 'gold', name: 'Gold Block', icon: '🪙', category: 'Ores', color: '#facc15', borderColor: '#ca8a04', description: 'Lustrous precious royal gold' },
  { id: 'diamond', name: 'Diamond Gem Block', icon: '💎', category: 'Ores', color: '#06b6d4', borderColor: '#22d3ee', description: 'Crystalline cyan precious diamond' },
  { id: 'emerald', name: 'Emerald Block', icon: '❇️', category: 'Ores', color: '#10b981', borderColor: '#34d399', description: 'Sovereign trading emerald gemstone' },
  { id: 'netherite', name: 'Netherite Alloy', icon: '🔮', category: 'Ores', color: '#404040', borderColor: '#171717', description: 'Fireproof ancient debris alloy' },
  { id: 'amethyst', name: 'Amethyst Shard', icon: '💜', category: 'Ores', color: '#9333ea', borderColor: '#c084fc', description: 'Harmonic resonating crystal cluster' },

  // Functional & Tech
  { id: 'command_block', name: 'Impulse Command Block', icon: '🟧', category: 'Functional', color: '#c47037', borderColor: '#8f4b1e', description: 'Programmable impulse command execution core' },
  { id: 'chain_command_block', name: 'Chain Command Block', icon: '🟩', category: 'Functional', color: '#3b846e', borderColor: '#235345', description: 'Sequentially triggered cascading command block' },
  { id: 'repeating_command_block', name: 'Repeating Command Block', icon: '🟪', category: 'Functional', color: '#6a4697', borderColor: '#422464', description: 'Continuous tick looping command block' },
  { id: 'door', name: 'Wooden Door', icon: '🚪', category: 'Functional', color: '#6d4c41', borderColor: '#4e342e', description: 'Hinged doorway for shelter passage' },
  { id: 'torch', name: 'Torch Light', icon: '🕯️', category: 'Functional', color: '#f59e0b', borderColor: '#fbbf24', description: 'Charcoal torch casting radius illumination' },
  { id: 'jukebox', name: 'Jukebox', icon: '📻', category: 'Functional', color: '#78350f', borderColor: '#92400e', description: 'Vinyl music disc player' },
  { id: 'sponge', name: 'Sea Sponge', icon: '🧽', category: 'Functional', color: '#ca8a04', borderColor: '#facc15', description: 'Water absorbent porous block' },
  { id: 'sculk', name: 'Sculk Catalyst', icon: '🔷', category: 'Functional', color: '#041a24', borderColor: '#06b6d4', description: 'Acoustic vibration sensitive organism' },

  // Fluids & Hazards
  { id: 'water', name: 'Spring Water', icon: '💧', category: 'Fluids', color: '#0284c7', borderColor: '#38bdf8', description: 'Flowing clear water fluid' },
  { id: 'lava', name: 'Molten Lava', icon: '🔥', category: 'Fluids', color: '#ea580c', borderColor: '#facc15', description: 'Hazardous incandescent liquid magma' },

  // Nature
  { id: 'leaves', name: 'Oak Leaves', icon: '🍃', category: 'Nature', color: '#2e7d32', borderColor: '#1b5e20', description: 'Deciduous foliage canopy' },
  { id: 'flower', name: 'Red Poppy', icon: '🌸', category: 'Nature', color: '#ef4444', borderColor: '#dc2626', description: 'Crimson wild poppy flower' },
  { id: 'cactus', name: 'Desert Cactus', icon: '🌵', category: 'Nature', color: '#15803d', borderColor: '#166534', description: 'Prickly desert succulent' },
  { id: 'mushroom_red', name: 'Red Toadstool', icon: '🍄', category: 'Nature', color: '#dc2626', borderColor: '#ef4444', description: 'Scarlet polka dot mushroom' },
];

export interface WorldEditorProps {
  initialSchematic?: BuildSchematic | null;
  onClose: () => void;
  onPlayInWorld?: (customWorld: { grid: string[]; rows: number; cols: number; name: string }) => void;
  user?: any;
  selectedAvatar?: CharacterData;
}

export type ToolType = 'pencil' | 'brush' | 'bucket' | 'line' | 'box' | 'eraser' | 'picker' | 'replace';

const PRESET_LEVELS: SavedLevel[] = [
  {
    id: 'preset_cottage',
    name: 'Cozy Mountain Cottage',
    author: 'Steve The Builder',
    description: 'Charming oak and brick cabin with chimney, porch torches and flower garden.',
    rows: 14,
    cols: 22,
    theme: 'Plains',
    updatedAt: Date.now() - 3600000,
    grid: [
      Array(22).fill('sky'),
      Array(22).fill('sky'),
      Array(22).fill('sky'),
      Array(22).fill('sky'),
      ['sky','sky','sky','sky','sky','sky','sky','sky','bricks','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','sky','sky','wood','wood','bricks','wood','wood','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','sky','wood','planks','planks','bricks','planks','planks','wood','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','wood','planks','glass','planks','glass','planks','planks','planks','wood','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','wood','torch','planks','door','planks','bookshelf','planks','torch','wood','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass'],
      ['dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt'],
      ['dirt','dirt','ore','dirt','dirt','stone','stone','coal','stone','dirt','dirt','dirt','ore','dirt','dirt','stone','stone','dirt','dirt','coal','dirt','dirt'],
      ['stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','diamond','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone'],
      ['stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone','stone'],
    ]
  },
  {
    id: 'preset_halloween',
    name: 'Haunted Halloween Catacombs',
    author: 'Reaper Steve',
    description: 'Spooky graveyard filled with carved pumpkins, jack-o-lanterns, tombstones and bubbling cauldron.',
    rows: 12,
    cols: 20,
    theme: 'Halloween',
    updatedAt: Date.now() - 7200000,
    grid: [
      Array(20).fill('sky'),
      Array(20).fill('sky'),
      Array(20).fill('sky'),
      Array(20).fill('sky'),
      ['sky','sky','spooky_cobweb','sky','sky','sky','sky','sky','sky','sky','sky','ghost_lantern','sky','sky','sky','spooky_cobweb','sky','sky','sky','sky'],
      ['sky','tombstone','sky','jack_o_lantern','sky','sky','tombstone','sky','witch_cauldron','sky','carved_pumpkin','sky','tombstone','sky','jack_o_lantern','sky','sky','tombstone','sky','sky'],
      ['grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass','grass'],
      ['dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt','dirt'],
      ['stone','stone','crying_obsidian','stone','stone','stone','amethyst','stone','stone','crying_obsidian','stone','stone','stone','amethyst','stone','stone','stone','crying_obsidian','stone','stone'],
      ['stone','stone','stone','stone','stone','diamond','stone','stone','stone','stone','stone','stone','diamond','stone','stone','stone','stone','stone','stone','stone'],
      ['obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian'],
      ['obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian','obsidian'],
    ]
  },
  {
    id: 'preset_obby',
    name: 'Roblox Tower Jump Obby',
    author: 'Builderman R6',
    description: 'Challenging parkour jump courses across lava pits and floating obsidian platforms.',
    rows: 12,
    cols: 22,
    theme: 'Roblox',
    updatedAt: Date.now() - 10800000,
    grid: [
      Array(22).fill('sky'),
      Array(22).fill('sky'),
      ['sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','repeating_command_block','sky','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','diamond','sky','sky','sky','sky','gold','gold','gold','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','sky','sky','sky','amethyst','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['sky','sky','sky','sky','bricks','sky','sky','sky','sky','sky','sky','sky','sky','emerald','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['sky','wood','wood','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky'],
      ['stone','stone','stone','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','sky','stone','stone','stone'],
      ['bedrock','bedrock','bedrock','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','bedrock','bedrock','bedrock'],
      ['bedrock','bedrock','bedrock','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','lava','bedrock','bedrock','bedrock'],
      ['bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock'],
      ['bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock','bedrock'],
    ]
  }
];

export default function WorldEditor({
  initialSchematic,
  onClose,
  onPlayInWorld,
  user,
  selectedAvatar
}: WorldEditorProps) {
  // Grid Dimensions: default 15 rows x 25 columns
  const [rows, setRows] = useState<number>(14);
  const [cols, setCols] = useState<number>(24);
  const [levelName, setLevelName] = useState<string>('My Custom Multiverse Level');
  const [levelTheme, setLevelTheme] = useState<string>('Plains');

  // 2D Matrix of block IDs
  const [grid, setGrid] = useState<string[][]>(() => {
    if (initialSchematic?.gridPreview) {
      return initialSchematic.gridPreview;
    }
    // Default world generation: Sky top, grass, dirt, stone
    return Array.from({ length: 14 }, (_, r) => 
      Array.from({ length: 24 }, (_, c) => {
        if (r < 7) return 'sky';
        if (r === 7) return 'grass';
        if (r < 10) return 'dirt';
        return (c % 5 === 0 && r > 10) ? 'coal' : (c % 9 === 0 && r > 11) ? 'ore' : 'stone';
      })
    );
  });

  // Editor Tools & State
  const [activeTool, setActiveTool] = useState<ToolType>('pencil');
  const [brushSize, setBrushSize] = useState<1 | 2 | 3>(1);
  const [selectedBlock, setSelectedBlock] = useState<string>('grass');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [paletteSearch, setPaletteSearch] = useState<string>('');
  
  // History Buffer for Undo/Redo
  const [history, setHistory] = useState<string[][][]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Mouse interaction state
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [dragStartCell, setDragStartCell] = useState<{ r: number; c: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number } | null>(null);

  // Saved levels modal
  const [savedLevels, setSavedLevels] = useState<SavedLevel[]>(() => {
    try {
      const stored = localStorage.getItem('megaworld_saved_levels_v1');
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return PRESET_LEVELS;
  });
  const [isSavedModalOpen, setIsSavedModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Built-in Instant Playtest Mode
  const [isPlaytesting, setIsPlaytesting] = useState<boolean>(false);
  const [playtestPlayer, setPlaytestPlayer] = useState<{ x: number; y: number; vx: number; vy: number; isGrounded: boolean }>({
    x: 2,
    y: 6,
    vx: 0,
    vy: 0,
    isGrounded: true
  });
  const [playtestActiveKeys, setPlaytestActiveKeys] = useState<Set<string>>(new Set());

  // Show Toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Push to Undo History
  const pushHistory = useCallback((newGrid: string[][]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const nextHistory = [...trimmed, newGrid.map(row => [...row])];
      if (nextHistory.length > 40) nextHistory.shift();
      return nextHistory;
    });
    setHistoryIndex(prev => Math.min(prev + 1, 39));
  }, [historyIndex]);

  // Initial history save
  useEffect(() => {
    if (history.length === 0) {
      setHistory([grid.map(row => [...row])]);
      setHistoryIndex(0);
    }
  }, []);

  const handleUndo = () => {
    if (historyIndex > 0) {
      audioEngine.playMinecraftSound('click');
      const targetIndex = historyIndex - 1;
      setGrid(history[targetIndex].map(r => [...r]));
      setHistoryIndex(targetIndex);
      showToast('↩️ Undone');
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      audioEngine.playMinecraftSound('click');
      const targetIndex = historyIndex + 1;
      setGrid(history[targetIndex].map(r => [...r]));
      setHistoryIndex(targetIndex);
      showToast('↪️ Redone');
    }
  };

  // Flood fill algorithm
  const floodFill = (startR: number, startC: number, targetType: string, fillType: string) => {
    if (targetType === fillType) return;
    const newGrid = grid.map(row => [...row]);
    const queue: [number, number][] = [[startR, startC]];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const [r, c] = queue.pop()!;
      const key = `${r},${c}`;
      if (visited.has(key)) continue;
      visited.add(key);

      if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
      if (newGrid[r][c] !== targetType) continue;

      newGrid[r][c] = fillType;

      queue.push([r + 1, c]);
      queue.push([r - 1, c]);
      queue.push([r, c + 1]);
      queue.push([r, c - 1]);
    }

    setGrid(newGrid);
    pushHistory(newGrid);
  };

  // Replace all instances of target block with fill block
  const replaceAllBlocks = (targetType: string, fillType: string) => {
    if (targetType === fillType) return;
    const newGrid = grid.map(row => row.map(cell => cell === targetType ? fillType : cell));
    setGrid(newGrid);
    pushHistory(newGrid);
    audioEngine.playMinecraftSound('totem');
    showToast(`🔀 Replaced all ${targetType} with ${fillType}!`);
  };

  // Apply brush / single placement
  const applyPaintAt = (r: number, c: number, blockType: string) => {
    const newGrid = grid.map(row => [...row]);
    let modified = false;

    for (let dr = -Math.floor(brushSize / 2); dr <= Math.floor(brushSize / 2); dr++) {
      for (let dc = -Math.floor(brushSize / 2); dc <= Math.floor(brushSize / 2); dc++) {
        const targetR = r + dr;
        const targetC = c + dc;
        if (targetR >= 0 && targetR < rows && targetC >= 0 && targetC < cols) {
          if (newGrid[targetR][targetC] !== blockType) {
            newGrid[targetR][targetC] = blockType;
            modified = true;
          }
        }
      }
    }

    if (modified) {
      setGrid(newGrid);
    }
  };

  // Line drawing algorithm (Bresenham)
  const drawLine = (r0: number, c0: number, r1: number, c1: number, blockType: string) => {
    const newGrid = grid.map(row => [...row]);
    const dx = Math.abs(c1 - c0);
    const dy = Math.abs(r1 - r0);
    const sx = c0 < c1 ? 1 : -1;
    const sy = r0 < r1 ? 1 : -1;
    let err = dx - dy;
    let currR = r0;
    let currC = c0;

    while (true) {
      if (currR >= 0 && currR < rows && currC >= 0 && currC < cols) {
        newGrid[currR][currC] = blockType;
      }
      if (currR === r1 && currC === c1) break;
      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        currC += sx;
      }
      if (e2 < dx) {
        err += dx;
        currR += sy;
      }
    }

    setGrid(newGrid);
    pushHistory(newGrid);
  };

  // Box drawing (filled or hollow)
  const drawBox = (r0: number, c0: number, r1: number, c1: number, blockType: string) => {
    const newGrid = grid.map(row => [...row]);
    const minR = Math.min(r0, r1);
    const maxR = Math.max(r0, r1);
    const minC = Math.min(c0, c1);
    const maxC = Math.max(c0, c1);

    for (let r = minR; r <= maxR; r++) {
      for (let c = minC; c <= maxC; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          newGrid[r][c] = blockType;
        }
      }
    }

    setGrid(newGrid);
    pushHistory(newGrid);
  };

  // Handle cell mouse down
  const handleCellMouseDown = (r: number, c: number) => {
    if (isPlaytesting) return;
    setIsMouseDown(true);
    setDragStartCell({ r, c });

    const currentCellType = grid[r][c];

    if (activeTool === 'picker') {
      audioEngine.playMinecraftSound('orb');
      setSelectedBlock(currentCellType === 'sky' ? 'grass' : currentCellType);
      setActiveTool('pencil');
      showToast(`💧 Picked ${currentCellType.replace('_', ' ')}! Switched to Pencil`);
      return;
    }

    if (activeTool === 'bucket') {
      audioEngine.playMinecraftSound('water');
      floodFill(r, c, currentCellType, selectedBlock);
      return;
    }

    if (activeTool === 'replace') {
      replaceAllBlocks(currentCellType, selectedBlock);
      return;
    }

    if (activeTool === 'pencil' || activeTool === 'brush') {
      audioEngine.playMinecraftSound(selectedBlock === 'grass' ? 'step' : 'mine');
      applyPaintAt(r, c, selectedBlock);
    } else if (activeTool === 'eraser') {
      audioEngine.playMinecraftSound('pop');
      applyPaintAt(r, c, 'sky');
    }
  };

  // Handle cell mouse enter during drag
  const handleCellMouseEnter = (r: number, c: number) => {
    setHoveredCell({ r, c });
    if (!isMouseDown || isPlaytesting) return;

    if (activeTool === 'pencil' || activeTool === 'brush') {
      applyPaintAt(r, c, selectedBlock);
    } else if (activeTool === 'eraser') {
      applyPaintAt(r, c, 'sky');
    }
  };

  // Handle mouse up (finalize line/box)
  const handleMouseUp = (r?: number, c?: number) => {
    if (!isMouseDown) return;
    setIsMouseDown(false);

    if (dragStartCell && r !== undefined && c !== undefined) {
      if (activeTool === 'line') {
        audioEngine.playMinecraftSound('build');
        drawLine(dragStartCell.r, dragStartCell.c, r, c, selectedBlock);
      } else if (activeTool === 'box') {
        audioEngine.playMinecraftSound('build');
        drawBox(dragStartCell.r, dragStartCell.c, r, c, selectedBlock);
      } else if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
        pushHistory(grid);
      }
    } else if (activeTool === 'pencil' || activeTool === 'brush' || activeTool === 'eraser') {
      pushHistory(grid);
    }
    setDragStartCell(null);
  };

  // Terrain generation templates
  const applyTerrainPreset = (presetName: string) => {
    audioEngine.playMinecraftSound('totem');
    let newGrid: string[][] = [];

    if (presetName === 'flat') {
      newGrid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, () => {
          if (r < Math.floor(rows * 0.6)) return 'sky';
          if (r === Math.floor(rows * 0.6)) return 'grass';
          if (r < Math.floor(rows * 0.85)) return 'dirt';
          return 'stone';
        })
      );
    } else if (presetName === 'halloween') {
      newGrid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const groundY = Math.floor(rows * 0.55);
          if (r < groundY - 1) return (c % 7 === 2 && r === 2) ? 'ghost_lantern' : 'sky';
          if (r === groundY - 1) {
            if (c % 4 === 0) return 'jack_o_lantern';
            if (c % 4 === 1) return 'tombstone';
            if (c % 4 === 2) return 'witch_cauldron';
            return 'carved_pumpkin';
          }
          if (r === groundY) return 'grass';
          if (r < groundY + 3) return 'dirt';
          if (r < rows - 1) return (c % 3 === 0) ? 'crying_obsidian' : 'stone';
          return 'obsidian';
        })
      );
    } else if (presetName === 'nether') {
      newGrid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          const groundY = Math.floor(rows * 0.5);
          if (r < groundY) return (c % 6 === 3 && r < 3) ? 'glowstone' : 'sky';
          if (r === groundY) return (c % 4 === 0) ? 'magma' : 'netherite';
          if (r < rows - 2) return (c % 5 === 0) ? 'magma' : 'crying_obsidian';
          return 'lava';
        })
      );
    } else if (presetName === 'islands') {
      newGrid = Array.from({ length: rows }, (_, r) =>
        Array.from({ length: cols }, (_, c) => {
          // Floating island in middle
          if (c >= Math.floor(cols * 0.25) && c <= Math.floor(cols * 0.75)) {
            const islandTop = Math.floor(rows * 0.35);
            if (r === islandTop) return 'grass';
            if (r > islandTop && r <= islandTop + 2) return 'dirt';
            if (r === islandTop + 3) return 'stone';
          }
          // Lower platform
          if (c >= Math.floor(cols * 0.1) && c <= Math.floor(cols * 0.4) && r >= Math.floor(rows * 0.75) && r <= Math.floor(rows * 0.85)) {
            return r === Math.floor(rows * 0.75) ? 'amethyst' : 'stone';
          }
          return 'sky';
        })
      );
    } else if (presetName === 'clear') {
      newGrid = Array.from({ length: rows }, () => Array(cols).fill('sky'));
    }

    if (newGrid.length > 0) {
      setGrid(newGrid);
      pushHistory(newGrid);
      showToast(`✨ Generated ${presetName.toUpperCase()} Terrain!`);
    }
  };

  // Stamp prefab structure
  const stampPrefab = (prefabType: string) => {
    audioEngine.playMinecraftSound('build');
    const newGrid = grid.map(row => [...row]);
    const startC = Math.max(1, Math.floor(cols / 2) - 4);
    const startR = Math.max(1, Math.floor(rows * 0.45));

    if (prefabType === 'cabin') {
      // 7x5 wooden cabin
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 7; c++) {
          const targetR = startR + r;
          const targetC = startC + c;
          if (targetR < rows && targetC < cols) {
            if (r === 0) newGrid[targetR][targetC] = 'wood';
            else if (r === 4) newGrid[targetR][targetC] = 'planks';
            else if (c === 0 || c === 6) newGrid[targetR][targetC] = 'wood';
            else if (r === 2 && (c === 2 || c === 4)) newGrid[targetR][targetC] = 'glass';
            else if (r === 3 && c === 3) newGrid[targetR][targetC] = 'door';
            else if (r === 1 && c === 5) newGrid[targetR][targetC] = 'bricks';
            else newGrid[targetR][targetC] = 'sky';
          }
        }
      }
      showToast('🏡 Stamped Cozy Wood Cabin!');
    } else if (prefabType === 'portal') {
      // 5x6 Nether Portal
      for (let r = 0; r < 6; r++) {
        for (let c = 0; c < 5; c++) {
          const targetR = startR + r;
          const targetC = startC + c;
          if (targetR < rows && targetC < cols) {
            if (r === 0 || r === 5 || c === 0 || c === 4) {
              newGrid[targetR][targetC] = 'obsidian';
            } else {
              newGrid[targetR][targetC] = 'crying_obsidian';
            }
          }
        }
      }
      showToast('🔮 Stamped Nether Portal Altar!');
    } else if (prefabType === 'pumpkin_crypt') {
      // Halloween Pumpkin crypt
      for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 6; c++) {
          const targetR = startR + r;
          const targetC = startC + c;
          if (targetR < rows && targetC < cols) {
            if (r === 0) newGrid[targetR][targetC] = (c % 2 === 0) ? 'jack_o_lantern' : 'carved_pumpkin';
            else if (c === 0 || c === 5) newGrid[targetR][targetC] = 'tombstone';
            else if (r === 3) newGrid[targetR][targetC] = 'obsidian';
            else newGrid[targetR][targetC] = 'witch_cauldron';
          }
        }
      }
      showToast('🎃 Stamped Spooky Pumpkin Crypt!');
    }

    setGrid(newGrid);
    pushHistory(newGrid);
  };

  // Resize canvas
  const handleResizeCanvas = (newRows: number, newCols: number) => {
    if (newRows === rows && newCols === cols) return;
    const newGrid = Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) => {
        if (r < rows && c < cols) {
          return grid[r][c];
        }
        return r > Math.floor(newRows * 0.6) ? 'stone' : 'sky';
      })
    );
    setRows(newRows);
    setCols(newCols);
    setGrid(newGrid);
    pushHistory(newGrid);
    audioEngine.playMinecraftSound('click');
    showToast(`📐 Canvas resized to ${newCols}x${newRows}!`);
  };

  // Save Level Locally & to state
  const handleSaveLevel = () => {
    audioEngine.playMinecraftSound('totem');
    const newLevel: SavedLevel = {
      id: 'level_' + Date.now(),
      name: levelName || 'Untitled Multiverse Level',
      author: user?.displayName || 'Master Builder',
      description: `Custom ${cols}x${rows} block level with ${levelTheme} theme`,
      rows,
      cols,
      grid: grid.map(r => [...r]),
      theme: levelTheme,
      updatedAt: Date.now(),
    };

    const updated = [newLevel, ...savedLevels.filter(l => l.name !== newLevel.name)];
    setSavedLevels(updated);
    try {
      localStorage.setItem('megaworld_saved_levels_v1', JSON.stringify(updated));
    } catch (e) {}
    showToast(`💾 Saved level "${newLevel.name}"!`);
  };

  // Load Saved Level
  const handleLoadLevel = (lvl: SavedLevel) => {
    audioEngine.playMinecraftSound('pop');
    setLevelName(lvl.name);
    setRows(lvl.rows);
    setCols(lvl.cols);
    setGrid(lvl.grid.map(r => [...r]));
    setHistory([lvl.grid.map(r => [...r])]);
    setHistoryIndex(0);
    setIsSavedModalOpen(false);
    showToast(`📁 Loaded "${lvl.name}" (${lvl.cols}x${lvl.rows})!`);
  };

  // Export JSON Blueprint
  const handleExportJson = () => {
    audioEngine.playMinecraftSound('orb');
    const schematic: BuildSchematic = {
      schematicName: levelName,
      dimensions: `${cols}x${rows}`,
      blockCount: grid.flat().filter(b => b !== 'sky').length,
      primaryMaterials: Array.from(new Set(grid.flat().filter(b => b !== 'sky'))).slice(0, 5),
      gridPreview: grid,
      difficulty: cols > 30 ? 'Legendary' : cols > 20 ? 'Master' : 'Intermediate',
    };
    const jsonStr = JSON.stringify(schematic, null, 2);
    navigator.clipboard.writeText(jsonStr);
    showToast('📋 JSON Blueprint copied to clipboard!');
  };

  // Import JSON Blueprint
  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed.gridPreview && Array.isArray(parsed.gridPreview)) {
        const importRows = parsed.gridPreview.length;
        const importCols = parsed.gridPreview[0].length;
        setRows(importRows);
        setCols(importCols);
        setGrid(parsed.gridPreview);
        if (parsed.schematicName) setLevelName(parsed.schematicName);
        setHistory([parsed.gridPreview]);
        setHistoryIndex(0);
        setIsImportModalOpen(false);
        setImportJsonText('');
        audioEngine.playMinecraftSound('levelup');
        showToast(`✅ Successfully imported "${parsed.schematicName || 'Level'}"!`);
      } else {
        showToast('❌ Invalid Blueprint JSON: missing gridPreview matrix');
      }
    } catch (e) {
      showToast('❌ JSON Parse Error. Check syntax!');
    }
  };

  // Publish Level Directly to Social Feed
  const handlePublishToSocialFeed = async () => {
    audioEngine.playMinecraftSound('levelup');
    const schematic: BuildSchematic = {
      schematicName: levelName,
      dimensions: `${cols}x${rows}`,
      blockCount: grid.flat().filter(b => b !== 'sky').length,
      primaryMaterials: Array.from(new Set(grid.flat().filter(b => b !== 'sky'))).slice(0, 5),
      gridPreview: grid.slice(0, 12).map(r => r.slice(0, 18)), // thumbnail fit
      difficulty: cols > 30 ? 'Legendary' : cols > 20 ? 'Master' : 'Intermediate',
    };

    await socialFeedManager.createPost({
      type: 'minecraft_2d_build',
      title: levelName,
      caption: `Custom 2D level crafted in the World & Level Editor! Includes ${schematic.blockCount} blocks with ${levelTheme} biomes.`,
      author: {
        uid: user?.uid || 'guest_editor',
        name: user?.displayName || 'Creative World Builder',
        avatarType: selectedAvatar?.subtype || 'steve',
        rankTitle: 'Architect',
        classTitle: 'Level Designer',
        verified: true,
      },
      brandTheme: levelTheme === 'Halloween' ? 'Minecraft' : levelTheme === 'Roblox' ? 'Roblox' : 'Universal',
      tags: ['World Editor', 'Custom Level', levelTheme, `${cols}x${rows}`],
      buildData: schematic,
    });

    showToast('🚀 Level published to Community Social Feed!');
  };

  // Playtest Keyboard Handling (WASD / Arrows)
  useEffect(() => {
    if (!isPlaytesting) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      setPlaytestActiveKeys(prev => new Set(prev).add(e.key.toLowerCase()));
      if (['arrowup', 'w', ' '].includes(e.key.toLowerCase())) {
        e.preventDefault();
        // Jump if on ground
        setPlaytestPlayer(p => {
          if (p.isGrounded) {
            audioEngine.playMinecraftSound('step');
            return { ...p, vy: -1.2, isGrounded: false };
          }
          return p;
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setPlaytestActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isPlaytesting]);

  // Playtest Physics Tick
  useEffect(() => {
    if (!isPlaytesting) return;

    const interval = setInterval(() => {
      setPlaytestPlayer(p => {
        let newX = p.x;
        let newY = p.y;
        let newVy = p.vy + 0.22; // gravity

        // Horizontal movement
        if (playtestActiveKeys.has('a') || playtestActiveKeys.has('arrowleft')) {
          newX = Math.max(0, newX - 0.25);
        }
        if (playtestActiveKeys.has('d') || playtestActiveKeys.has('arrowright')) {
          newX = Math.min(cols - 1, newX + 0.25);
        }

        // Apply vertical velocity
        newY += newVy;

        // Ground Collision with blocks
        const checkCellR = Math.floor(newY + 1);
        const checkCellC = Math.floor(newX);
        let grounded = false;

        if (checkCellR >= rows) {
          // Bottom boundary
          newY = rows - 1;
          newVy = 0;
          grounded = true;
        } else if (checkCellR >= 0 && checkCellC >= 0 && checkCellC < cols) {
          const belowBlock = grid[checkCellR]?.[checkCellC];
          if (belowBlock && belowBlock !== 'sky') {
            newY = checkCellR - 1;
            newVy = 0;
            grounded = true;
          }
        }

        return {
          ...p,
          x: newX,
          y: Math.max(0, newY),
          vy: newVy,
          isGrounded: grounded,
        };
      });
    }, 30);

    return () => clearInterval(interval);
  }, [isPlaytesting, grid, playtestActiveKeys, rows, cols]);

  // Filter palette blocks
  const filteredBlocks = EDITOR_PALETTE.filter(b => {
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    if (paletteSearch.trim() && !b.name.toLowerCase().includes(paletteSearch.toLowerCase()) && !b.id.toLowerCase().includes(paletteSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div 
      className="bg-stone-950 text-white min-h-[90vh] flex flex-col font-mono select-none relative pb-10"
      onMouseUp={() => handleMouseUp()}
    >
      {/* ================= TOP APPLICATION HEADER ================= */}
      <div className="bg-stone-900/90 border-b border-stone-800 p-3 sm:p-4 sticky top-0 z-40 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-3">
        {/* Left: Back & Level Title Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 cursor-pointer transition"
            title="Exit Level Editor"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🛠️</span>
              <input
                type="text"
                value={levelName}
                onChange={(e) => setLevelName(e.target.value)}
                className="bg-transparent border-b border-dashed border-stone-700 hover:border-amber-400 focus:border-amber-400 text-sm sm:text-base font-black text-white focus:outline-none px-1"
                placeholder="Enter Level Title..."
              />
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40 font-bold">
                {cols}×{rows} Grid
              </span>
            </div>
            <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5">
              <span>Theme:</span>
              <select
                value={levelTheme}
                onChange={(e) => setLevelTheme(e.target.value)}
                className="bg-stone-800 text-stone-200 rounded px-1.5 py-0.5 text-[11px] border border-stone-700 focus:outline-none focus:border-amber-400 cursor-pointer"
              >
                <option value="Plains">🌲 Overworld Plains</option>
                <option value="Halloween">🎃 Haunted Halloween</option>
                <option value="Nether">🌋 Nether Caldera</option>
                <option value="Roblox">🟥 Roblox Obby Platform</option>
                <option value="Desert">🏜️ Desert Oasis</option>
                <option value="DeepDark">🔷 Deep Dark Sculk</option>
              </select>
            </div>
          </div>
        </div>

        {/* Center: Undo, Redo, Clear & Grid Resizing */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 hover:text-white border border-stone-700 cursor-pointer transition shadow"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 size={16} />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 disabled:opacity-40 text-stone-300 hover:text-white border border-stone-700 cursor-pointer transition shadow"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 size={16} />
          </button>

          <div className="h-5 w-px bg-stone-800 mx-1 hidden sm:block" />

          {/* Canvas Size Presets */}
          <div className="flex items-center bg-stone-800 border border-stone-700 rounded-xl p-0.5 text-xs">
            <span className="text-[10px] text-stone-400 px-1.5">Size:</span>
            {[
              { label: '15×10', r: 10, c: 15 },
              { label: '24×14', r: 14, c: 24 },
              { label: '36×18', r: 18, c: 36 },
              { label: '48×24', r: 24, c: 48 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => handleResizeCanvas(preset.r, preset.c)}
                className={`px-2 py-1 rounded-lg font-bold transition text-[11px] cursor-pointer ${
                  rows === preset.r && cols === preset.c
                    ? 'bg-amber-500 text-black shadow'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => applyTerrainPreset('clear')}
            className="p-2 rounded-xl bg-stone-800 hover:bg-red-950/60 hover:border-red-500 text-stone-300 hover:text-red-300 border border-stone-700 cursor-pointer transition shadow"
            title="Clear All Canvas Blocks"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {/* Right: Playtest, Save, Load, Export & Publish */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Instant Playtest Toggle */}
          <button
            onClick={() => {
              audioEngine.playMinecraftSound(isPlaytesting ? 'click' : 'levelup');
              setIsPlaytesting(!isPlaytesting);
              if (!isPlaytesting) {
                // Find first non-sky ground block
                let spawnC = 2;
                let spawnR = 4;
                for (let r = 0; r < rows; r++) {
                  if (grid[r][spawnC] !== 'sky') {
                    spawnR = Math.max(0, r - 1);
                    break;
                  }
                }
                setPlaytestPlayer({ x: spawnC, y: spawnR, vx: 0, vy: 0, isGrounded: true });
                showToast('🎮 Playtest active! Walk with A/D, Jump with Space/W!');
              } else {
                showToast('✏️ Exited Playtest. Back to editing mode!');
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer ${
              isPlaytesting
                ? 'bg-red-600 hover:bg-red-500 text-white animate-pulse ring-2 ring-red-400'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white hover:scale-105'
            }`}
          >
            <Play size={14} />
            <span>{isPlaytesting ? 'Stop Playtest' : 'Playtest Level'}</span>
          </button>

          {/* Play In Full GameWorld */}
          {onPlayInWorld && (
            <button
              onClick={() => {
                onPlayInWorld({
                  grid: grid.flat(),
                  rows,
                  cols,
                  name: levelName,
                });
              }}
              className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow cursor-pointer"
              title="Launch directly into full RPG 2D/3D GameWorld"
            >
              <Zap size={14} className="text-yellow-300" />
              <span className="hidden md:inline">Play In RPG</span>
            </button>
          )}

          {/* Save Button */}
          <button
            onClick={handleSaveLevel}
            className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 hover:border-amber-400 font-bold text-xs transition flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Save size={14} />
            <span>Save</span>
          </button>

          {/* Saved Levels Dropdown */}
          <button
            onClick={() => setIsSavedModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs transition flex items-center gap-1 shadow cursor-pointer"
            title="Browse & Load Saved Levels"
          >
            <span>📁</span>
            <span className="hidden sm:inline">Levels ({savedLevels.length})</span>
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExportJson}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 cursor-pointer transition shadow"
            title="Export Blueprint JSON (Copy to clipboard)"
          >
            <Download size={15} />
          </button>

          {/* Import JSON */}
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 cursor-pointer transition shadow"
            title="Import Blueprint JSON"
          >
            <Upload size={15} />
          </button>

          {/* Publish to Social Feed */}
          <button
            onClick={handlePublishToSocialFeed}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-black text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
            title="Publish level to the Community Social Feed"
          >
            <Share2 size={13} />
            <span className="hidden lg:inline">Publish to UGC Feed</span>
          </button>
        </div>
      </div>

      {/* ================= SECONDARY CONTROLS STRIP: TOOLS & TERRAIN PRESETS ================= */}
      <div className="bg-stone-900 border-b border-stone-800 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Editing Tools */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-stone-400 uppercase font-black mr-1">Tools:</span>

          {[
            { id: 'pencil' as ToolType, label: 'Pencil', icon: <Pencil size={14} />, desc: 'Single block placement' },
            { id: 'brush' as ToolType, label: `Brush (${brushSize}x${brushSize})`, icon: <Paintbrush size={14} />, desc: 'Multi-block stroke' },
            { id: 'bucket' as ToolType, label: 'Fill Bucket', icon: <PaintBucket size={14} />, desc: 'Flood fill area' },
            { id: 'line' as ToolType, label: 'Line', icon: <Minus size={14} />, desc: 'Draw straight block line' },
            { id: 'box' as ToolType, label: 'Box / Rect', icon: <Square size={14} />, desc: 'Draw filled rectangle' },
            { id: 'eraser' as ToolType, label: 'Eraser', icon: <Eraser size={14} />, desc: 'Erase blocks to sky air' },
            { id: 'picker' as ToolType, label: 'Eyedropper', icon: <Pipette size={14} />, desc: 'Sample block from canvas' },
            { id: 'replace' as ToolType, label: 'Replace All', icon: <RefreshCw size={14} />, desc: 'Replace all matching blocks' },
          ].map(tool => (
            <button
              key={tool.id}
              onClick={() => {
                audioEngine.playMinecraftSound('click');
                setActiveTool(tool.id);
              }}
              className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                activeTool === tool.id
                  ? 'bg-amber-500 text-black border-amber-400 shadow scale-105'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border-stone-700'
              }`}
              title={tool.desc}
            >
              {tool.icon}
              <span className="text-[11px]">{tool.label}</span>
            </button>
          ))}

          {/* Brush Size Toggle */}
          {activeTool === 'brush' && (
            <div className="flex items-center bg-stone-950 border border-amber-500/50 rounded-lg px-2 py-0.5 ml-1">
              <span className="text-[10px] text-amber-300 mr-1.5 font-bold">Radius:</span>
              {[1, 2, 3].map(size => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size as any)}
                  className={`px-1.5 py-0.5 text-[10px] rounded font-bold cursor-pointer ${
                    brushSize === size ? 'bg-amber-500 text-black' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {size}x{size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Terrain Presets & Prefabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-stone-400 uppercase font-black mr-1">Generators & Prefabs:</span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => applyTerrainPreset('flat')}
              className="px-2 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-bold border border-stone-700 cursor-pointer"
              title="Generate Flat Plains Grassland"
            >
              🌱 Flat
            </button>
            <button
              onClick={() => applyTerrainPreset('halloween')}
              className="px-2 py-1 rounded-lg bg-orange-950/70 hover:bg-orange-900 border border-orange-500/50 text-orange-200 text-[11px] font-bold cursor-pointer"
              title="Generate Spooky Halloween Catacombs"
            >
              🎃 Halloween
            </button>
            <button
              onClick={() => applyTerrainPreset('nether')}
              className="px-2 py-1 rounded-lg bg-red-950/70 hover:bg-red-900 border border-red-500/50 text-red-200 text-[11px] font-bold cursor-pointer"
              title="Generate Nether Wastes & Magma"
            >
              🌋 Nether
            </button>
            <button
              onClick={() => applyTerrainPreset('islands')}
              className="px-2 py-1 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-200 text-[11px] font-bold cursor-pointer"
              title="Generate Floating Sky Islands"
            >
              ☁️ Islands
            </button>
          </div>

          <div className="h-4 w-px bg-stone-700 mx-1 hidden sm:block" />

          {/* Prefab Structure Stamps */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => stampPrefab('cabin')}
              className="px-2 py-1 rounded-lg bg-amber-950/50 hover:bg-amber-900 border border-amber-600/50 text-amber-200 text-[11px] font-bold cursor-pointer"
              title="Stamp 7x5 Wooden Cabin"
            >
              🏡 Cabin
            </button>
            <button
              onClick={() => stampPrefab('portal')}
              className="px-2 py-1 rounded-lg bg-purple-950/50 hover:bg-purple-900 border border-purple-500/50 text-purple-200 text-[11px] font-bold cursor-pointer"
              title="Stamp Nether Portal Altar"
            >
              🔮 Portal
            </button>
            <button
              onClick={() => stampPrefab('pumpkin_crypt')}
              className="px-2 py-1 rounded-lg bg-orange-950/50 hover:bg-orange-900 border border-orange-500/50 text-orange-200 text-[11px] font-bold cursor-pointer"
              title="Stamp Spooky Pumpkin Crypt"
            >
              🎃 Crypt
            </button>
          </div>
        </div>
      </div>

      {/* ================= MAIN WORKSPACE AREA: CANVAS + PALETTE SIDEBAR ================= */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left/Center: Interactive Canvas */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col items-center justify-start bg-stone-950 relative">
          {/* Active Tool & Cursor Coordinates Indicator */}
          <div className="w-full max-w-5xl flex items-center justify-between mb-2 text-xs font-mono text-stone-400">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                Active Block:
                <span className="text-base">{EDITOR_PALETTE.find(b => b.id === selectedBlock)?.icon || '📦'}</span>
                <span className="text-amber-400">{selectedBlock.replace('_', ' ').toUpperCase()}</span>
              </span>
              <span className="text-stone-600">•</span>
              <span className="text-stone-300">Tool: <strong className="text-white capitalize">{activeTool}</strong></span>
            </div>

            {hoveredCell && (
              <div className="bg-stone-900 border border-stone-800 px-2.5 py-0.5 rounded-lg text-emerald-400 font-bold text-[11px]">
                X: {hoveredCell.c} | Y: {hoveredCell.r} ({grid[hoveredCell.r]?.[hoveredCell.c] || 'sky'})
              </div>
            )}
          </div>

          {/* Grid Canvas Frame */}
          <div 
            className="p-3 bg-stone-900 border-4 border-stone-800 rounded-2xl shadow-2xl overflow-auto max-w-full max-h-[70vh] relative"
            style={{ 
              backgroundColor: levelTheme === 'Halloween' ? '#0f0728' : levelTheme === 'Nether' ? '#1c0b0b' : '#0c121e' 
            }}
          >
            {/* The Voxel Grid */}
            <div 
              className="grid gap-[1px] bg-black/60 p-1 rounded-lg shadow-inner"
              style={{
                gridTemplateColumns: `repeat(${cols}, minmax(28px, 36px))`,
                gridTemplateRows: `repeat(${rows}, minmax(28px, 36px))`,
              }}
            >
              {grid.map((row, r) => 
                row.map((block, c) => {
                  const isHovered = hoveredCell?.r === r && hoveredCell?.c === c;
                  const isDragOrigin = dragStartCell?.r === r && dragStartCell?.c === c;
                  const isSky = block === 'sky';

                  // Palette info
                  const blockMeta = EDITOR_PALETTE.find(b => b.id === block);

                  return (
                    <div
                      key={`${r}-${c}`}
                      onMouseDown={() => handleCellMouseDown(r, c)}
                      onMouseEnter={() => handleCellMouseEnter(r, c)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 relative cursor-pointer transition-transform duration-75 flex items-center justify-center text-xs select-none ${
                        isHovered ? 'z-20 scale-105 outline outline-2 outline-white shadow-lg' : ''
                      } ${isDragOrigin ? 'ring-2 ring-amber-400' : ''}`}
                      style={{
                        backgroundColor: isSky ? 'rgba(56, 189, 248, 0.08)' : blockMeta?.color || '#555',
                        borderTop: block === 'grass' ? '4px solid #7cfc00' : 
                                   block === 'dirt' ? '3px solid #8d6e63' :
                                   block === 'stone' ? '3px solid #90a4ae' :
                                   blockMeta?.borderColor ? `3px solid ${blockMeta.borderColor}` : '1px solid rgba(0,0,0,0.3)',
                      }}
                      title={`${block.replace('_', ' ').toUpperCase()} [${c}, ${r}]`}
                    >
                      {/* Inner details for iconic blocks */}
                      {block === 'carved_pumpkin' && <span className="text-sm">🎃</span>}
                      {block === 'jack_o_lantern' && <span className="text-sm animate-pulse">🏮</span>}
                      {block === 'witch_cauldron' && <span className="text-xs animate-bounce">🧙</span>}
                      {block === 'spooky_cobweb' && <span className="text-xs">🕸️</span>}
                      {block === 'tombstone' && <span className="text-[10px] font-black text-slate-300">🪦</span>}
                      {block === 'ghost_lantern' && <span className="text-xs animate-bounce">👻</span>}
                      {block === 'torch' && <span className="text-xs animate-pulse">🕯️</span>}
                      {block === 'door' && <span className="text-xs">🚪</span>}
                      {block === 'flower' && <span className="text-xs">🌸</span>}
                      {block === 'cactus' && <span className="text-xs">🌵</span>}
                      {block === 'diamond' && <div className="w-2.5 h-2.5 bg-cyan-200 rotate-45 shadow-[0_0_6px_#22d3ee]" />}
                      {block === 'emerald' && <div className="w-2.5 h-2.5 bg-emerald-200 rotate-45 shadow-[0_0_6px_#10b981]" />}
                      {block === 'gold' && <div className="w-2.5 h-2.5 bg-yellow-200 rotate-45 shadow-[0_0_6px_#facc15]" />}
                      {block === 'ore' && <div className="w-2 h-2 bg-amber-500 rounded-full" />}
                      {block === 'coal' && <div className="w-2 h-2 bg-stone-900 rounded-full" />}
                      {block === 'command_block' && <span className="text-[10px] font-black text-amber-200">🟧</span>}
                      {block === 'chain_command_block' && <span className="text-[10px] font-black text-emerald-200">🟩</span>}
                      {block === 'repeating_command_block' && <span className="text-[10px] font-black text-fuchsia-200">🟪</span>}
                      {block === 'water' && <div className="w-full h-1 bg-cyan-200/50 rounded-full animate-pulse" />}
                      {block === 'lava' && <div className="w-full h-1 bg-yellow-300/80 rounded-full animate-pulse" />}

                      {/* Tool Preview Ghost Cursor */}
                      {isHovered && !isPlaytesting && (
                        <div className="absolute inset-0 bg-white/20 border border-white/60 pointer-events-none rounded flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white drop-shadow">
                            {activeTool === 'eraser' ? '✕' : '+'}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Playtest Player Character Sprite */}
            {isPlaytesting && (
              <div
                className="absolute z-50 pointer-events-none transition-all duration-75 flex flex-col items-center justify-center"
                style={{
                  left: `${12 + playtestPlayer.x * 37}px`,
                  top: `${12 + playtestPlayer.y * 37}px`,
                  width: '36px',
                  height: '36px',
                }}
              >
                <div className="scale-75 origin-bottom">
                  <CharacterAvatar
                    character={selectedAvatar || { id: 21, name: 'Steve', type: 'minecraft', subtype: 'steve', color: 'bg-cyan-600' }}
                    size="sm"
                  />
                </div>
                <div className="text-[8px] font-bold bg-black/80 px-1 rounded text-yellow-300 font-mono -mt-1 shadow">
                  Steve
                </div>
              </div>
            )}
          </div>

          {/* Help Instructions Strip */}
          <div className="mt-3 text-[11px] text-stone-400 flex items-center gap-3 flex-wrap justify-center">
            <span>🖱️ <strong>Click / Drag:</strong> Paint blocks</span>
            <span>•</span>
            <span>🪣 <strong>Bucket:</strong> Flood fill area</span>
            <span>•</span>
            <span>💧 <strong>Eyedropper:</strong> Sample block</span>
            <span>•</span>
            <span>↩️ <strong>Undo:</strong> Ctrl+Z</span>
            <span>•</span>
            <span>🎮 <strong>Playtest:</strong> Space to jump, A/D to walk</span>
          </div>
        </div>

        {/* Right Sidebar: Block Palette Catalog */}
        <div className="w-full lg:w-80 bg-stone-900 border-t lg:border-t-0 lg:border-l border-stone-800 p-4 flex flex-col gap-3 overflow-y-auto max-h-[45vh] lg:max-h-none">
          <div className="flex items-center justify-between border-b border-stone-800 pb-2">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Box size={16} className="text-amber-400" />
              <span>Block Palette ({EDITOR_PALETTE.length})</span>
            </h3>
            <span className="text-[10px] text-stone-400 font-bold uppercase">Click to Select</span>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            value={paletteSearch}
            onChange={(e) => setPaletteSearch(e.target.value)}
            placeholder="Search blocks (pumpkin, diamond...)"
            className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400 font-mono"
          />

          {/* Category Tabs */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Halloween', 'Terrain', 'Building', 'Ores', 'Functional', 'Nature', 'Fluids'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap cursor-pointer transition ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-black shadow'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                {cat === 'Halloween' ? '🎃 Halloween' : cat}
              </button>
            ))}
          </div>

          {/* Block Grid Cards */}
          <div className="grid grid-cols-2 gap-2 overflow-y-auto pr-1 flex-1">
            {filteredBlocks.map(block => {
              const isSelected = selectedBlock === block.id;

              return (
                <button
                  key={block.id}
                  onClick={() => {
                    audioEngine.playMinecraftSound('click');
                    setSelectedBlock(block.id);
                    if (activeTool === 'eraser') setActiveTool('pencil');
                  }}
                  className={`p-2 rounded-xl border text-left flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-sm ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-2 ring-amber-400/50'
                      : 'bg-stone-950/70 hover:bg-stone-800/80 border-stone-800 hover:border-stone-700 text-stone-300'
                  }`}
                >
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-sm shadow shrink-0"
                    style={{ backgroundColor: block.color }}
                  >
                    {block.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold truncate text-white">{block.name}</div>
                    <div className="text-[9px] text-stone-400 truncate">{block.category}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Active Block Details Card */}
          {(() => {
            const activeMeta = EDITOR_PALETTE.find(b => b.id === selectedBlock);
            if (!activeMeta) return null;

            return (
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 mt-auto">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{activeMeta.icon}</span>
                  <div>
                    <h4 className="text-xs font-black text-amber-300">{activeMeta.name}</h4>
                    <span className="text-[10px] text-stone-400">{activeMeta.category} Category</span>
                  </div>
                </div>
                <p className="text-[10px] text-stone-300 leading-tight">{activeMeta.description}</p>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ================= MODAL: SAVED LEVELS & PRESETS ================= */}
      {isSavedModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-2xl w-full shadow-2xl relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">📁</span>
                <div>
                  <h3 className="text-base font-black text-white">Saved Levels & Pre-Made Worlds</h3>
                  <p className="text-xs text-stone-400">Select any saved draft or template to load instantly into the editor</p>
                </div>
              </div>
              <button
                onClick={() => setIsSavedModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto flex-1 pr-1">
              {savedLevels.map(lvl => (
                <div
                  key={lvl.id}
                  className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-amber-400/60 flex items-center justify-between gap-3 transition shadow"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{lvl.name}</h4>
                      <span className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded-full border border-stone-700 font-mono">
                        {lvl.cols}×{lvl.rows} Blocks
                      </span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/30">
                        {lvl.theme}
                      </span>
                    </div>
                    <p className="text-xs text-stone-400 mt-1">{lvl.description}</p>
                    <div className="text-[10px] text-stone-500 mt-1">Author: {lvl.author}</div>
                  </div>

                  <button
                    onClick={() => handleLoadLevel(lvl)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition active:scale-95 cursor-pointer shadow shrink-0"
                  >
                    Load Level
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: IMPORT JSON BLUEPRINT ================= */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Upload size={18} className="text-amber-400" />
                <h3 className="text-base font-black text-white">Import Blueprint JSON</h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-stone-300 mb-3">
              Paste exported schematic JSON below to import custom blocks and structures directly onto the canvas:
            </p>

            <textarea
              rows={8}
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder='{ "schematicName": "Castle", "gridPreview": [["stone", "sky"...]] }'
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-400 mb-4 shadow-inner"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleImportJson}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition cursor-pointer shadow"
              >
                Import Blueprint
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= FLOATING TOAST NOTIFICATION ================= */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 border border-amber-400 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-mono font-bold flex items-center gap-2 animate-bounce backdrop-blur-md">
          <Sparkles size={14} className="text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
