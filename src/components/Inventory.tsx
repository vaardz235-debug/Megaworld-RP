import { useState } from 'react';
import { Sparkles, Package, Plus, ChevronDown, ChevronUp } from 'lucide-react';

interface InventoryProps {
  items: Record<string, { count: number; durability?: number }>;
  activeItem: string;
  onSelectItem: (item: string) => void;
  isCreative?: boolean;
  onAddCreativeItem?: (item: string) => void;
}

export const ALL_CREATIVE_BLOCKS = [
  // 16 Varieties of Building Blocks
  { id: 'grass', name: 'Grass Block', icon: '🌱', category: 'Building' },
  { id: 'dirt', name: 'Dirt', icon: '🟫', category: 'Building' },
  { id: 'stone', name: 'Stone', icon: '🪨', category: 'Building' },
  { id: 'wood', name: 'Oak Wood', icon: '🪵', category: 'Building' },
  { id: 'planks', name: 'Oak Planks', icon: '🪵', category: 'Building' },
  { id: 'leaves', name: 'Oak Leaves', icon: '🍃', category: 'Building' },
  { id: 'bricks', name: 'Bricks', icon: '🧱', category: 'Building' },
  { id: 'sand', name: 'Sand', icon: '🏖️', category: 'Building' },
  { id: 'sandstone', name: 'Sandstone', icon: '🏛️', category: 'Building' },
  { id: 'snow', name: 'Snow Block', icon: '❄️', category: 'Building' },
  { id: 'ice', name: 'Ice Block', icon: '🧊', category: 'Building' },
  { id: 'glass', name: 'Glass Block', icon: '🪟', category: 'Building' },
  { id: 'obsidian', name: 'Obsidian Block', icon: '⬛', category: 'Building' },
  { id: 'crying_obsidian', name: 'Crying Obsidian', icon: '🌌', category: 'Building' },
  { id: 'cobblestone', name: 'Cobblestone', icon: '🪨', category: 'Building' },
  { id: 'terracotta', name: 'Terracotta', icon: '🟧', category: 'Building' },
  { id: 'bookshelf', name: 'Bookshelf', icon: '📚', category: 'Building' },
  { id: 'mycelium', name: 'Mycelium', icon: '🟣', category: 'Building' },
  { id: 'sculk', name: 'Sculk Catalyst', icon: '🔷', category: 'Building' },
  { id: 'magma', name: 'Magma Block', icon: '🔥', category: 'Building' },
  { id: 'glowstone', name: 'Glowstone', icon: '💡', category: 'Building' },
  { id: 'sponge', name: 'Sponge', icon: '🧽', category: 'Building' },

  // Ores & Gems
  { id: 'coal', name: 'Coal', icon: '⚫', category: 'Ores' },
  { id: 'ore', name: 'Iron Ore', icon: '✨', category: 'Ores' },
  { id: 'gold', name: 'Gold Block', icon: '🪙', category: 'Ores' },
  { id: 'diamond', name: 'Diamond Block', icon: '💎', category: 'Ores' },
  { id: 'emerald', name: 'Emerald Block', icon: '❇️', category: 'Ores' },
  { id: 'netherite', name: 'Netherite Ingot', icon: '🔮', category: 'Ores' },
  { id: 'amethyst', name: 'Amethyst Shard', icon: '💜', category: 'Ores' },

  // Decorative & Functional (Featuring Jukebox & 16 Music Discs)
  { id: 'jukebox', name: 'Jukebox', icon: '📻', category: 'Functional' },
  { id: 'door', name: 'Wooden Door', icon: '🚪', category: 'Functional' },
  { id: 'torch', name: 'Torch', icon: '🕯️', category: 'Functional' },
  { id: 'flower', name: 'Red Poppy', icon: '🌸', category: 'Functional' },
  { id: 'cactus', name: 'Cactus', icon: '🌵', category: 'Functional' },
  { id: 'water', name: 'Water Bucket', icon: '💧', category: 'Functional' },
  { id: 'disc_sweden', name: 'Music Disc 1: Sweden', icon: '🟢', category: 'Functional' },
  { id: 'disc_pigstep', name: 'Music Disc 2: Pigstep', icon: '🔴', category: 'Functional' },
  { id: 'disc_sprunki', name: 'Music Disc 3: Sprunki Beats', icon: '🟣', category: 'Functional' },
  { id: 'disc_country', name: 'Music Disc 4: Countryball', icon: '⚪', category: 'Functional' },
  { id: 'disc_cat', name: 'Music Disc 5: Cat', icon: '🟡', category: 'Functional' },
  { id: 'disc_cave', name: 'Music Disc 6: Cave 13', icon: '🟣', category: 'Functional' },
  { id: 'disc_sky', name: 'Music Disc 7: Creative Sky', icon: '🔵', category: 'Functional' },
  { id: 'disc_blocks', name: 'Music Disc 8: Blocks', icon: '🟧', category: 'Functional' },
  { id: 'disc_chirp', name: 'Music Disc 9: Chirp', icon: '🔴', category: 'Functional' },
  { id: 'disc_far', name: 'Music Disc 10: Far', icon: '🔷', category: 'Functional' },
  { id: 'disc_mall', name: 'Music Disc 11: Mall', icon: '🟪', category: 'Functional' },
  { id: 'disc_mellohi', name: 'Music Disc 12: Mellohi', icon: '🤍', category: 'Functional' },
  { id: 'disc_stal', name: 'Music Disc 13: Stal', icon: '⚫', category: 'Functional' },
  { id: 'disc_strad', name: 'Music Disc 14: Strad', icon: '⚪', category: 'Functional' },
  { id: 'disc_wait', name: 'Music Disc 15: Wait', icon: '🌅', category: 'Functional' },
  { id: 'disc_otherside', name: 'Music Disc 16: Otherside', icon: '🚀', category: 'Functional' },

  // Tools & Food
  { id: 'pickaxe', name: 'Diamond Pickaxe', icon: '⛏️', category: 'Equipment' },
  { id: 'apple', name: 'Red Apple', icon: '🍎', category: 'Food' },
  { id: 'golden_apple', name: 'Golden Apple', icon: '🍏', category: 'Food' },
  { id: 'bread', name: 'Fresh Bread', icon: '🍞', category: 'Food' },
];

export const getItemIcon = (name: string) => {
  const match = ALL_CREATIVE_BLOCKS.find(b => b.id === name);
  if (match) return match.icon;
  switch (name) {
    case 'door': return '🚪';
    case 'pickaxe': return '⛏️';
    case 'apple': return '🍎';
    case 'bread': return '🍞';
    case 'wood': return '🪵';
    case 'bricks': return '🧱';
    case 'planks': return '🪵';
    case 'coal': return '⚫';
    case 'stone': return '🪨';
    case 'ore': return '✨';
    case 'grass': return '🌱';
    case 'dirt': return '🟫';
    case 'diamond': return '💎';
    case 'emerald': return '❇️';
    case 'gold': return '🪙';
    case 'netherite': return '🔮';
    case 'golden_apple': return '🍏';
    case 'ice': return '🧊';
    case 'sand': return '🏖️';
    case 'snow': return '❄️';
    case 'water': return '💧';
    case 'leaves': return '🍃';
    case 'cactus': return '🌵';
    case 'flower': return '🌸';
    case 'torch': return '🕯️';
    case 'sandstone': return '🏛️';
    default: return '📦';
  }
};

export default function Inventory({ 
  items, 
  activeItem, 
  onSelectItem, 
  isCreative = false,
  onAddCreativeItem
}: InventoryProps) {
  const [showCreativePalette, setShowCreativePalette] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Building', 'Ores', 'Functional', 'Food', 'Equipment'];
  const filteredCreativeBlocks = ALL_CREATIVE_BLOCKS.filter(b => 
    selectedCategory === 'All' ? true : b.category === selectedCategory
  );

  return (
    <div className="bg-gray-900/90 border border-gray-800 p-4 rounded-2xl text-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Package className={isCreative ? "text-purple-400" : "text-emerald-400"} size={20} />
          <h3 className="text-base font-bold">
            {isCreative ? 'Creative Hotbar' : 'Survival Backpack'}
          </h3>
          {isCreative ? (
            <span className="text-[10px] font-mono uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
              Infinite Supply (∞)
            </span>
          ) : (
            <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              Limited Stock
            </span>
          )}
        </div>

        {/* Creative Item Catalog Button */}
        {isCreative && (
          <button
            onClick={() => setShowCreativePalette(prev => !prev)}
            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer active:scale-95"
          >
            <Sparkles size={13} />
            <span>{showCreativePalette ? 'Close Catalog' : 'Open Item Catalog'}</span>
            {showCreativePalette ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        )}
      </div>

      {/* Expandable Creative Palette Drawer */}
      {isCreative && showCreativePalette && (
        <div className="mb-4 bg-gray-950 border border-purple-500/30 p-3 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span className="text-xs font-bold text-purple-300 flex items-center gap-1">
              <Sparkles size={14} /> Creative Block Palette (Click to equip infinite blocks)
            </span>
            {/* Categories */}
            <div className="flex gap-1 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
            {filteredCreativeBlocks.map(block => (
              <button
                key={block.id}
                onClick={() => {
                  if (onAddCreativeItem) {
                    onAddCreativeItem(block.id);
                  }
                  onSelectItem(block.id);
                }}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center transition cursor-pointer hover:scale-105 ${
                  activeItem === block.id 
                    ? 'border-purple-400 bg-purple-950/60 shadow-lg ring-2 ring-purple-400/50' 
                    : 'border-gray-800 bg-gray-900/90 hover:border-gray-600'
                }`}
                title={`Equip ${block.name} (Infinite)`}
              >
                <span className="text-lg">{block.icon}</span>
                <span className="text-[10px] font-bold text-gray-200 truncate w-full text-center">
                  {block.name}
                </span>
                <span className="text-[9px] font-mono text-purple-300">∞</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Active Hotbar Slots */}
      <div className="flex gap-2 flex-wrap max-h-36 overflow-y-auto p-0.5">
        {Object.entries(items).map(([item, data]) => {
          const isActive = activeItem === item;
          return (
            <button
              key={item}
              onClick={() => onSelectItem(item)}
              className={`p-2.5 rounded-xl border-2 flex flex-col items-center justify-between min-w-[76px] transition cursor-pointer hover:scale-102 ${
                isActive 
                  ? isCreative
                    ? 'border-purple-400 bg-purple-950/50 shadow-md ring-2 ring-purple-400/40 text-white'
                    : 'border-emerald-400 bg-emerald-950/50 shadow-md ring-2 ring-emerald-400/40 text-white'
                  : 'border-gray-800 bg-gray-950/60 text-gray-300 hover:border-gray-600'
              }`}
            >
              <span className="text-lg mb-0.5">{getItemIcon(item)}</span>
              <span className="text-[11px] font-bold truncate max-w-[70px]">
                {item.charAt(0).toUpperCase() + item.slice(1).replace('_', ' ')}
              </span>
              <span className={`text-[11px] font-mono font-black ${isCreative ? 'text-purple-300' : 'text-emerald-400'}`}>
                {isCreative ? '∞' : `x${data.count}`}
              </span>
              {!isCreative && data.durability !== undefined && (
                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-1 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full" 
                    style={{ width: `${data.durability}%` }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
