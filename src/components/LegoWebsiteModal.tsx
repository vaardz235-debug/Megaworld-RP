import React, { useState } from 'react';
import { 
  X, ShoppingBag, Box, Play, Sparkles, Star, Award, 
  RotateCcw, Check, Plus, ExternalLink, ShieldCheck, Heart, 
  Compass, ChevronRight, Layers, Volume2
} from 'lucide-react';
import { avatarManager } from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';

interface LegoWebsiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onSpawnLegoBuild?: (model: any) => void;
}

interface LegoSet {
  id: string;
  setNumber: string;
  name: string;
  theme: 'Minecraft' | 'City' | 'Technic' | 'Star Wars' | 'Creator' | 'Ninjago';
  pieces: number;
  age: string;
  priceCoins: number;
  priceRobux: number;
  rating: number;
  reviewsCount: number;
  icon: string;
  imageColor: string;
  description: string;
  features: string[];
  brickColors: string[];
}

const LEGO_SETS: LegoSet[] = [
  {
    id: 'set_minecraft_pig_house',
    setNumber: '21170',
    name: 'The Pig House Multi-Story Modular',
    theme: 'Minecraft',
    pieces: 490,
    age: '8+',
    priceCoins: 380,
    priceRobux: 75,
    rating: 4.9,
    reviewsCount: 230,
    icon: '🐷',
    imageColor: 'from-pink-900/60 to-rose-950/80',
    description: 'Authentic brick recreation of a giant pink pig structure with opening side wall and roof for interior play, Creeper blast feature, and Alex minifigure.',
    features: ['Modular Removable Roof', 'Exploding Creeper Lever', 'Includes Alex & 2 Pigs', 'Baby Carrot Garden'],
    brickColors: ['#f472b6', '#ec4899', '#15803d', '#78350f']
  },
  {
    id: 'set_minecraft_iron_golem',
    setNumber: '21250',
    name: 'The Iron Golem Fortress Citadel',
    theme: 'Minecraft',
    pieces: 868,
    age: '9+',
    priceCoins: 540,
    priceRobux: 110,
    rating: 5.0,
    reviewsCount: 412,
    icon: '🦾',
    imageColor: 'from-stone-800 to-emerald-950',
    description: 'Transformable fortress that converts into a gigantic articulated Iron Golem with massive movable arms, Crystal Knight, Golden Knight, and Charged Creeper.',
    features: ['Transforming Golem Mode', 'Shooting Arrow Dispensers', 'Enchanted Diamond Sword', 'Charged Creeper Minifig'],
    brickColors: ['#e2e8f0', '#94a3b8', '#059669', '#ca8a04']
  },
  {
    id: 'set_space_galaxy_explorer',
    setNumber: '10497',
    name: 'Classic Galaxy Explorer 928',
    theme: 'Creator',
    pieces: 1254,
    age: '18+',
    priceCoins: 650,
    priceRobux: 135,
    rating: 5.0,
    reviewsCount: 680,
    icon: '🚀',
    imageColor: 'from-blue-950 to-indigo-950',
    description: 'Celebratory 90th anniversary edition of the legendary 1979 Classic Space flagship with delta wing design, rover cargo bay, and retro classic astronauts.',
    features: ['Retractable Landing Gear', 'Deployable Surface Rover', 'Retro Yellow Cockpit Glass', '4 Red & White Space Minifigs'],
    brickColors: ['#1d4ed8', '#94a3b8', '#facc15', '#dc2626']
  },
  {
    id: 'set_technic_heavy_crane',
    setNumber: '42108',
    name: 'Technic Mobile All-Terrain Crane',
    theme: 'Technic',
    pieces: 1292,
    age: '10+',
    priceCoins: 580,
    priceRobux: 120,
    rating: 4.8,
    reviewsCount: 185,
    icon: '🏗️',
    imageColor: 'from-yellow-950 to-amber-950',
    description: '8-wheel steering, 4 individual outriggers, and a telescoping boom extending up to 78cm. Realistic gear system and 360-degree rotating cabin.',
    features: ['Working Gear Mechanisms', 'Telescoping 78cm Boom', '4 Outrigger Stabilizers', '8-Wheel Synced Steering'],
    brickColors: ['#eab308', '#0f172a', '#64748b', '#ef4444']
  },
  {
    id: 'set_starwars_falcon',
    setNumber: '75257',
    name: 'Millennium Falcon Corellian Freighter',
    theme: 'Star Wars',
    pieces: 1351,
    age: '9+',
    priceCoins: 720,
    priceRobux: 150,
    rating: 4.9,
    reviewsCount: 890,
    icon: '🛸',
    imageColor: 'from-slate-900 to-stone-900',
    description: 'Rotating top and bottom laser turrets, 2 spring-loaded shooters, lowering ramp, and an opening cockpit with space for 2 minifigures.',
    features: ['Dejarik Holographic Game Table', 'Hidden Smuggling Compartment', 'Hyperdrive Maintenance Bay', 'Chewbacca & Lando Minifigs'],
    brickColors: ['#94a3b8', '#475569', '#b91c1c', '#0284c7']
  },
  {
    id: 'set_ninjago_city_gardens',
    setNumber: '71741',
    name: 'NINJAGO City Multi-Tier Gardens',
    theme: 'Ninjago',
    pieces: 5685,
    age: '14+',
    priceCoins: 1200,
    priceRobux: 250,
    rating: 5.0,
    reviewsCount: 1240,
    icon: '🏯',
    imageColor: 'from-emerald-950 to-teal-950',
    description: 'Colossal 5-tier modular ninja metropolis featuring Chen\'s Noodle House, ninja history museum, tea room, and golden Wu minifigure.',
    features: ['5 Detailed Modular Floors', '19 Unique Minifigures', 'Ice Cream Parlor & Arcade', 'Golden Master Wu Tribute'],
    brickColors: ['#0d9488', '#ea580c', '#f59e0b', '#1e293b']
  }
];

export default function LegoWebsiteModal({
  isOpen,
  onClose,
  user,
  onSpawnLegoBuild,
}: LegoWebsiteModalProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder' | 'minifig' | 'games' | 'mocs'>('catalog');
  const [selectedSet, setSelectedSet] = useState<LegoSet>(LEGO_SETS[0]);
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Brick Builder State
  const [placedBricks, setPlacedBricks] = useState<{ id: string; type: string; color: string; x: number; y: number }[]>([
    { id: 'b1', type: '2x4 Brick', color: '#dc2626', x: 2, y: 0 },
    { id: 'b2', type: '2x4 Brick', color: '#dc2626', x: 4, y: 0 },
    { id: 'b3', type: '2x2 Brick', color: '#2563eb', x: 3, y: 1 },
    { id: 'b4', type: 'Roof Slope', color: '#eab308', x: 3, y: 2 },
  ]);
  const [selectedBrickType, setSelectedBrickType] = useState<string>('2x4 Brick');
  const [selectedBrickColor, setSelectedBrickColor] = useState<string>('#dc2626');

  // Minifig Customizer State
  const [minifigHead, setMinifigHead] = useState<'classic_smile' | 'sunglasses' | 'beard_wizard' | 'cyborg' | 'ninja'>('classic_smile');
  const [minifigTorso, setMinifigTorso] = useState<'space_classic' | 'knight_armor' | 'flannel' | 'police' | 'ninja'>('space_classic');
  const [minifigLegs, setMinifigLegs] = useState<'blue_classic' | 'black_stealth' | 'white_space' | 'red_brave'>('blue_classic');
  const [minifigHat, setMinifigHat] = useState<'red_cap' | 'space_helmet' | 'knight_visor' | 'wizard_hat' | 'ninja_hood'>('space_helmet');
  const [minifigAccessory, setMinifigAccessory] = useState<'separator' | 'lightsaber' | 'golden_chalice' | 'raygun' | 'none'>('separator');

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePurchaseSet = (set: LegoSet) => {
    const current = avatarManager.getLocalCustomization();
    if (current.coins < set.priceCoins) {
      showToast(`❌ Need ${set.priceCoins} MegaCoins! (Balance: ${current.coins})`);
      audioEngine.playMinecraftSound('anvil');
      return;
    }

    avatarManager.addCurrency(-set.priceCoins, 0);
    audioEngine.playMinecraftSound('levelup');
    showToast(`🎉 Purchased "${set.name}"! Digital blueprints added to your inventory!`);
  };

  const handleAddBrick = (gridX: number, gridY: number) => {
    audioEngine.playMinecraftSound('pop');
    const newBrick = {
      id: `brick_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: selectedBrickType,
      color: selectedBrickColor,
      x: gridX,
      y: gridY,
    };
    setPlacedBricks(prev => [...prev, newBrick]);
  };

  const handleClearBricks = () => {
    audioEngine.playMinecraftSound('click');
    setPlacedBricks([]);
    showToast('Cleared Master Builder workshop canvas!');
  };

  const handleExportLegoMoc = () => {
    audioEngine.playMinecraftSound('levelup');
    if (onSpawnLegoBuild) {
      onSpawnLegoBuild({
        name: 'Custom Lego MOC Structure',
        bricksCount: placedBricks.length,
        bricks: placedBricks,
      });
    }
    showToast(`🧱 Exported MOC with ${placedBricks.length} digital Lego bricks directly into the Game World!`);
  };

  const filteredSets = LEGO_SETS.filter(s => selectedTheme === 'all' || s.theme === selectedTheme);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-sans select-none overflow-y-auto">
      <div className="bg-stone-900 border-2 border-red-500 rounded-3xl w-full max-w-6xl shadow-[0_20px_70px_rgba(227,0,11,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Official LEGO Top Nav Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white border-b-4 border-yellow-400">
          <div className="flex items-center gap-3">
            {/* Iconic LEGO Logo Emblem */}
            <div className="w-12 h-12 bg-red-600 border-2 border-white rounded-md flex items-center justify-center shadow-lg font-black tracking-tighter text-yellow-300 text-xl font-mono select-none">
              <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] italic">LEGO</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2 drop-shadow-sm">
                  LEGO® Digital Play & Builder Universe
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400 text-red-950 uppercase tracking-widest border border-white">
                    Official Portal
                  </span>
                </h2>
              </div>
              <p className="text-xs text-yellow-100 font-medium">
                Snap bricks, construct MOCs, customize Minifigures & explore iconic sets
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-red-950/40 px-3 py-1.5 rounded-xl border border-yellow-400/50 text-xs font-mono">
              <span className="text-yellow-300 font-bold">⭐ VIP Points: 1,420</span>
              <span className="text-white">|</span>
              <span className="text-emerald-300 font-bold">🪙 {avatarManager.getLocalCustomization().coins} MC</span>
            </div>

            <button
              onClick={onClose}
              className="text-white hover:bg-red-700 p-2 rounded-xl transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-yellow-400 text-red-950 px-4 py-2 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-md">
            <Sparkles size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-stone-950 border-b border-stone-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('catalog');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'catalog'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Box size={14} />
            <span>1. Sets & Catalog ({LEGO_SETS.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('builder');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'builder'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Layers size={14} />
            <span>2. Master Builder Studio (Snap Canvas)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('minifig');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'minifig'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🧑‍🚀</span>
            <span>3. Minifigure Customizer</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('games');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Play size={14} />
            <span>4. LEGO Video Games Showcase</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('mocs');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer whitespace-nowrap ${
              activeTab === 'mocs'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span>5. LEGO Ideas & Community MOCs</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* ================= TAB 1: SETS & CATALOG ================= */}
          {activeTab === 'catalog' && (
            <div className="space-y-5">
              {/* Theme Filter Bar */}
              <div className="flex items-center gap-2 flex-wrap text-xs">
                {['all', 'Minecraft', 'Creator', 'Technic', 'Star Wars', 'Ninjago'].map(theme => (
                  <button
                    key={theme}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setSelectedTheme(theme);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer capitalize ${
                      selectedTheme === theme
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {theme === 'all' ? 'All LEGO Themes' : `${theme}`}
                  </button>
                ))}
              </div>

              {/* Sets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSets.map(set => (
                  <div
                    key={set.id}
                    className="bg-stone-950 border border-stone-800 hover:border-yellow-400/60 rounded-2xl p-4 flex flex-col justify-between transition shadow-lg group"
                  >
                    <div>
                      {/* Set Header with Brick Card Gradient */}
                      <div className={`w-full h-32 rounded-xl bg-gradient-to-br ${set.imageColor} border border-stone-700/60 p-3 flex flex-col justify-between mb-3 shadow-inner relative overflow-hidden`}>
                        <div className="flex justify-between items-start z-10">
                          <span className="text-[10.5px] font-mono font-bold bg-black/60 px-2 py-0.5 rounded text-yellow-300">
                            #{set.setNumber}
                          </span>
                          <span className="text-xs font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                            Age {set.age}
                          </span>
                        </div>

                        <div className="flex items-center justify-center text-5xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] z-10 group-hover:scale-110 transition duration-300">
                          {set.icon}
                        </div>

                        <div className="flex justify-between items-end z-10 text-[10.5px] font-mono text-stone-200">
                          <span>{set.theme}</span>
                          <span>{set.pieces} Bricks</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1 leading-snug">{set.name}</h3>
                      <p className="text-xs text-stone-300 line-clamp-2 mb-3 leading-relaxed">
                        {set.description}
                      </p>

                      {/* Key Features */}
                      <div className="space-y-1 mb-3">
                        {set.features.slice(0, 3).map((feat, fi) => (
                          <div key={fi} className="text-[10.5px] text-stone-400 flex items-center gap-1.5">
                            <span className="text-yellow-400">▪</span>
                            <span className="truncate">{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Color Palette Studs */}
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="text-[10px] text-stone-500 font-mono">Palette:</span>
                        {set.brickColors.map((col, ci) => (
                          <span
                            key={ci}
                            className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-sm"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <div className="font-mono">
                        <div className="text-sm font-black text-amber-300">🪙 {set.priceCoins} Coins</div>
                        <div className="text-[10.5px] text-red-400">💎 {set.priceRobux} Robux</div>
                      </div>

                      <button
                        onClick={() => handlePurchaseSet(set)}
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                      >
                        <ShoppingBag size={13} />
                        <span>Build Set</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 2: MASTER BUILDER STUDIO ================= */}
          {activeTab === 'builder' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="text-2xl">🧱</span>
                    Master Builder Brick Workshop
                  </h3>
                  <p className="text-xs text-stone-400">
                    Click onto the grid to snap digital studs together. Build custom castles, vehicles, or robots!
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearBricks}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl text-xs font-mono border border-stone-700 cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    onClick={handleExportLegoMoc}
                    className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <Box size={14} />
                    <span>Spawn MOC in Game</span>
                  </button>
                </div>
              </div>

              {/* Brick Selection Palette */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                  <label className="text-xs font-bold text-stone-300 mb-2 block font-mono">
                    1. Select Brick Component:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {['2x4 Brick', '2x2 Brick', '1x2 Plate', 'Roof Slope'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedBrickType(type)}
                        className={`p-2 rounded-xl text-xs font-mono font-bold border transition cursor-pointer text-center ${
                          selectedBrickType === type
                            ? 'bg-red-600 text-white border-yellow-400 shadow'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950 p-3 rounded-2xl border border-stone-800">
                  <label className="text-xs font-bold text-stone-300 mb-2 block font-mono">
                    2. Select Classic Brick Color:
                  </label>
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { name: 'Classic Red', hex: '#dc2626' },
                      { name: 'Sunny Yellow', hex: '#eab308' },
                      { name: 'Royal Blue', hex: '#2563eb' },
                      { name: 'Forest Green', hex: '#16a34a' },
                      { name: 'Jet Black', hex: '#0f172a' },
                      { name: 'Pure White', hex: '#f8fafc' },
                      { name: 'Bright Orange', hex: '#ea580c' },
                      { name: 'Trans-Neon Cyan', hex: '#06b6d4' }
                    ].map(col => (
                      <button
                        key={col.hex}
                        onClick={() => setSelectedBrickColor(col.hex)}
                        className={`w-7 h-7 rounded-full border-2 transition cursor-pointer ${
                          selectedBrickColor === col.hex ? 'border-white scale-110 shadow-md ring-2 ring-yellow-400' : 'border-stone-800'
                        }`}
                        style={{ backgroundColor: col.hex }}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Interactive Virtual Stud Canvas */}
              <div className="bg-stone-950 rounded-2xl p-6 border-2 border-stone-800 flex flex-col items-center justify-center min-h-[340px] relative overflow-hidden">
                <div className="text-xs text-stone-500 font-mono mb-4">
                  Stud Baseplate: Click any vacant slot to snap a {selectedBrickType}
                </div>

                {/* 6x6 Stud Baseplate Grid */}
                <div className="grid grid-cols-6 gap-3 p-4 bg-emerald-950/40 rounded-2xl border-4 border-emerald-900 shadow-inner">
                  {Array.from({ length: 24 }).map((_, idx) => {
                    const gx = idx % 6;
                    const gy = Math.floor(idx / 6);
                    const existing = placedBricks.find(b => b.x === gx && b.y === gy);

                    return (
                      <div
                        key={idx}
                        onClick={() => handleAddBrick(gx, gy)}
                        className={`w-14 h-14 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition shadow-md ${
                          existing
                            ? 'border-white/50 scale-105'
                            : 'bg-emerald-900/40 border-emerald-700/40 hover:bg-emerald-800/50'
                        }`}
                        style={{ backgroundColor: existing ? existing.color : undefined }}
                      >
                        {existing ? (
                          <div className="flex flex-col items-center text-white">
                            <div className="w-5 h-2.5 rounded-t-full bg-black/20 border border-white/40 mb-0.5" />
                            <span className="text-[8.5px] font-mono font-bold leading-none truncate max-w-[48px]">
                              {existing.type.split(' ')[0]}
                            </span>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full bg-emerald-700/60 border border-emerald-600/40" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 text-xs font-mono text-yellow-300">
                  Total Bricks Snapped: <strong>{placedBricks.length}</strong> | Structural Integrity: <strong>100% (Solid)</strong>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: MINIFIGURE CUSTOMIZER ================= */}
          {activeTab === 'minifig' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Minifigure 3D/2D Avatar Preview */}
              <div className="bg-stone-950 p-6 rounded-3xl border border-stone-800 flex flex-col items-center justify-center shadow-inner">
                <div className="text-xs text-yellow-400 font-mono uppercase font-bold tracking-wider mb-4">
                  Official Minifigure Preview
                </div>

                {/* Rendered Minifigure Silhouette */}
                <div className="flex flex-col items-center py-4">
                  {/* Hat / Hair */}
                  <div className="text-4xl -mb-2 z-20">
                    {minifigHat === 'space_helmet' && '🧑‍🚀'}
                    {minifigHat === 'red_cap' && '🧢'}
                    {minifigHat === 'knight_visor' && '🪖'}
                    {minifigHat === 'wizard_hat' && '🧙‍♂️'}
                    {minifigHat === 'ninja_hood' && '🥷'}
                  </div>

                  {/* Classic Yellow Head */}
                  <div className="w-12 h-10 bg-yellow-400 rounded-lg border-2 border-yellow-600 flex items-center justify-center text-base shadow-md z-10">
                    {minifigHead === 'classic_smile' && '🙂'}
                    {minifigHead === 'sunglasses' && '😎'}
                    {minifigHead === 'beard_wizard' && '🧔'}
                    {minifigHead === 'cyborg' && '🤖'}
                    {minifigHead === 'ninja' && '🥷'}
                  </div>

                  {/* Torso & Arms */}
                  <div className="w-16 h-14 bg-blue-600 rounded-md border-2 border-stone-800 flex items-center justify-between px-1 text-center shadow-lg my-0.5">
                    <div className="w-3 h-8 bg-yellow-400 rounded-full border border-yellow-600" />
                    <div className="text-[10px] font-black text-white font-mono">
                      {minifigTorso === 'space_classic' && '🚀'}
                      {minifigTorso === 'knight_armor' && '🛡️'}
                      {minifigTorso === 'flannel' && '🪓'}
                      {minifigTorso === 'police' && '⭐'}
                      {minifigTorso === 'ninja' && '⚔️'}
                    </div>
                    <div className="w-3 h-8 bg-yellow-400 rounded-full border border-yellow-600" />
                  </div>

                  {/* Hip & Dual Legs */}
                  <div className="w-14 flex items-center justify-between gap-1">
                    <div className="w-6 h-10 bg-blue-700 rounded-b-md border border-stone-900" />
                    <div className="w-6 h-10 bg-blue-700 rounded-b-md border border-stone-900" />
                  </div>
                </div>

                <div className="text-center font-mono text-xs pt-4 border-t border-stone-800 w-full">
                  <div className="text-white font-bold">Class: Classic Master Explorer</div>
                  <div className="text-stone-400 text-[11px]">Handheld: {minifigAccessory}</div>
                </div>
              </div>

              {/* Minifig Part Selectors */}
              <div className="md:col-span-2 space-y-4 font-mono text-xs">
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                  <label className="text-stone-300 font-bold block mb-2">Head Piece & Expression:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'classic_smile', name: 'Classic Smile 🙂' },
                      { id: 'sunglasses', name: 'Cool Shades 😎' },
                      { id: 'beard_wizard', name: 'Elder Beard 🧔' },
                      { id: 'cyborg', name: 'Cyborg Eye 🤖' },
                      { id: 'ninja', name: 'Ninja Mask 🥷' },
                    ].map(h => (
                      <button
                        key={h.id}
                        onClick={() => setMinifigHead(h.id as any)}
                        className={`p-2 rounded-xl text-center border font-bold transition cursor-pointer ${
                          minifigHead === h.id ? 'bg-yellow-400 text-red-950 border-white' : 'bg-stone-900 text-stone-400 border-stone-800'
                        }`}
                      >
                        {h.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                  <label className="text-stone-300 font-bold block mb-2">Helmet & Headwear:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'space_helmet', name: 'Space Helmet 🧑‍🚀' },
                      { id: 'red_cap', name: 'Red Cap 🧢' },
                      { id: 'knight_visor', name: 'Knight Visor 🪖' },
                      { id: 'wizard_hat', name: 'Wizard Hat 🧙‍♂️' },
                      { id: 'ninja_hood', name: 'Ninja Hood 🥷' },
                    ].map(hat => (
                      <button
                        key={hat.id}
                        onClick={() => setMinifigHat(hat.id as any)}
                        className={`p-2 rounded-xl text-center border font-bold transition cursor-pointer ${
                          minifigHat === hat.id ? 'bg-yellow-400 text-red-950 border-white' : 'bg-stone-900 text-stone-400 border-stone-800'
                        }`}
                      >
                        {hat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800">
                  <label className="text-stone-300 font-bold block mb-2">Torso & Uniform Printing:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {[
                      { id: 'space_classic', name: 'Classic Space 🚀' },
                      { id: 'knight_armor', name: 'Lion Armor 🛡️' },
                      { id: 'flannel', name: 'Lumberjack 🪓' },
                      { id: 'police', name: 'City Police ⭐' },
                      { id: 'ninja', name: 'Dragon Robe ⚔️' },
                    ].map(torso => (
                      <button
                        key={torso.id}
                        onClick={() => setMinifigTorso(torso.id as any)}
                        className={`p-2 rounded-xl text-center border font-bold transition cursor-pointer ${
                          minifigTorso === torso.id ? 'bg-yellow-400 text-red-950 border-white' : 'bg-stone-900 text-stone-400 border-stone-800'
                        }`}
                      >
                        {torso.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex justify-between items-center">
                  <div>
                    <div className="text-white font-bold">1-Click Apply to Player Avatar</div>
                    <div className="text-stone-400 text-[11px]">Equip this Minifigure design as your in-game avatar</div>
                  </div>
                  <button
                    onClick={() => {
                      audioEngine.playMinecraftSound('levelup');
                      showToast('Minifigure equipped as your active avatar in the Multiverse!');
                    }}
                    className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold cursor-pointer transition shadow active:scale-95"
                  >
                    Equip Minifigure
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: LEGO VIDEO GAMES SHOWCASE ================= */}
          {activeTab === 'games' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'LEGO® Star Wars: The Skywalker Saga',
                    year: '2022',
                    icon: '⚔️',
                    genre: 'Action Adventure',
                    description: 'Relive all 9 Star Wars saga films rebuilt with signature LEGO humor, space dogfights, and over 300 playable characters.',
                    rating: '9.5/10',
                    badge: 'Cross-Brand Favorite'
                  },
                  {
                    title: 'LEGO® Worlds & Sandbox Builder',
                    year: '2017',
                    icon: '🌍',
                    genre: 'Open-World Procedural',
                    description: 'Procedurally generated worlds made entirely of LEGO bricks. Manipulate terrain, discover vehicles, and create anything brick by brick.',
                    rating: '9.0/10',
                    badge: 'Minecraft Compatible'
                  },
                  {
                    title: 'LEGO® 2K Drive',
                    year: '2023',
                    icon: '🏎️',
                    genre: 'Open-World Racing',
                    description: 'Race across Bricklandia in vehicles that transform smoothly between street raceways, off-road terrain, and open water!',
                    rating: '8.8/10',
                    badge: 'Multiplayer Speed'
                  }
                ].map((game, gi) => (
                  <div key={gi} className="bg-stone-950 p-5 rounded-2xl border border-stone-800 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-3xl">{game.icon}</span>
                        <span className="text-[10px] bg-red-950 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/40">
                          {game.badge}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-white mb-1">{game.title}</h4>
                      <div className="text-[11px] text-yellow-400 font-mono mb-2">{game.genre} • {game.year}</div>
                      <p className="text-xs text-stone-300 leading-relaxed mb-3">{game.description}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-emerald-400">Rating: {game.rating}</span>
                      <button
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          showToast(`Launching ${game.title} sandbox simulator in MegaWorld!`);
                        }}
                        className="px-3.5 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition"
                      >
                        <Play size={12} />
                        <span>Launch Game</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 5: LEGO IDEAS & COMMUNITY MOCS ================= */}
          {activeTab === 'mocs' && (
            <div className="space-y-4 font-mono">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    LEGO Ideas: Multiverse Community MOCs
                  </h3>
                  <p className="text-xs text-stone-400">
                    Fan creations reaching 10,000 supporter votes enter official review to become real sets!
                  </p>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playMinecraftSound('levelup');
                    showToast('Submission portal opened! Upload your MOC photos and brick list.');
                  }}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-red-950 font-black text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Submit Your MOC</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    title: 'Sodor Knapford Central Station MOC',
                    author: 'ConductorSteve_99',
                    votes: 8420,
                    bricks: 2150,
                    icon: '🚂',
                    description: 'Detailed modular glass-arch station with dual tracks, signal boxes, and Fat Controller office.'
                  },
                  {
                    title: 'Waitangi Waka Taua War Canoe MOC',
                    author: 'KiwiBuilder_Tama',
                    votes: 9140,
                    bricks: 1480,
                    icon: '🛶',
                    description: 'Hand-carved Polynesian ocean-going waka with intricate spiral prow carvings and feather sails.'
                  },
                  {
                    title: 'Roblox Crossroads Classic Battle MOC',
                    author: 'BloxBrickMaster',
                    votes: 9890,
                    bricks: 1820,
                    icon: '🟥',
                    description: '2006 Crossroads arena with watchtower, spring pads, and classic linked swords.'
                  },
                  {
                    title: 'Golden Arches Retro 1955 Diner MOC',
                    author: 'ChefPierre_MOCs',
                    votes: 7920,
                    bricks: 1260,
                    icon: '🍔',
                    description: 'Vintage neon drive-in restaurant with classic fryers, milkshakes, and custom delivery van.'
                  }
                ].map((moc, mi) => (
                  <div key={mi} className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-3xl">{moc.icon}</span>
                        <div>
                          <h4 className="text-sm font-bold text-white">{moc.title}</h4>
                          <span className="text-[11px] text-stone-400">by {moc.author} • {moc.bricks} Bricks</span>
                        </div>
                      </div>
                      <p className="text-xs text-stone-300 mb-3">{moc.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-xs">
                      <span className="text-yellow-400 font-bold">{moc.votes.toLocaleString()} / 10,000 Votes</span>
                      <button
                        onClick={() => {
                          audioEngine.playMinecraftSound('pop');
                          showToast(`Voted for "${moc.title}"! (+1 Supporter)`);
                        }}
                        className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold cursor-pointer transition shadow"
                      >
                        👍 Support (Vote)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
