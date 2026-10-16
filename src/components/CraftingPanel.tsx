import { Hammer, Sparkles } from 'lucide-react';

interface CraftingProps {
  inventory: Record<string, { count: number; durability?: number }>;
  onCraft: (newItems: Record<string, { count: number; durability?: number }>) => void;
  isCreative?: boolean;
}

export default function CraftingPanel({ inventory, onCraft, isCreative = false }: CraftingProps) {
  const craftItems = (type: string) => {
    let newInventory = { ...inventory };
    let success = false;

    // In Creative mode, crafting is instant and costs nothing!
    if (isCreative) {
      if (type === 'pickaxe') {
        newInventory['pickaxe'] = { count: (newInventory['pickaxe']?.count || 0) + 1, durability: 100 };
      } else {
        const addCount = type === 'planks' || type === 'torch' ? 4 : type === 'sandstone' ? 2 : 1;
        newInventory[type] = { count: (newInventory[type]?.count || 0) + addCount };
      }
      onCraft(newInventory);
      return;
    }

    // Survival Mode Crafting checks
    if (type === 'bricks' && (inventory['stone']?.count || 0) >= 1 && (inventory['coal']?.count || 0) >= 1) {
      newInventory['stone'] = { count: newInventory['stone'].count - 1 };
      newInventory['coal'] = { count: newInventory['coal'].count - 1 };
      newInventory['bricks'] = { count: (newInventory['bricks']?.count || 0) + 1 };
      success = true;
    } else if (type === 'pickaxe' && (inventory['stone']?.count || 0) >= 3 && (inventory['wood']?.count || 0) >= 2) {
      newInventory['stone'] = { count: newInventory['stone'].count - 3 };
      newInventory['wood'] = { count: newInventory['wood'].count - 2 };
      newInventory['pickaxe'] = { count: (newInventory['pickaxe']?.count || 0) + 1, durability: 100 };
      success = true;
    } else if (type === 'planks' && (inventory['wood']?.count || 0) >= 1) {
      newInventory['wood'] = { count: newInventory['wood'].count - 1 };
      newInventory['planks'] = { count: (newInventory['planks']?.count || 0) + 4 };
      success = true;
    } else if (type === 'door' && ((inventory['wood']?.count || 0) >= 2 || (inventory['planks']?.count || 0) >= 2)) {
      if ((inventory['planks']?.count || 0) >= 2) {
        newInventory['planks'] = { count: newInventory['planks'].count - 2 };
      } else {
        newInventory['wood'] = { count: newInventory['wood'].count - 2 };
      }
      newInventory['door'] = { count: (newInventory['door']?.count || 0) + 1 };
      success = true;
    } else if (type === 'torch' && (inventory['coal']?.count || 0) >= 1 && (inventory['wood']?.count || 0) >= 1) {
      newInventory['coal'] = { count: newInventory['coal'].count - 1 };
      newInventory['wood'] = { count: newInventory['wood'].count - 1 };
      newInventory['torch'] = { count: (newInventory['torch']?.count || 0) + 4 };
      success = true;
    } else if (type === 'sandstone' && (inventory['sand']?.count || 0) >= 4) {
      newInventory['sand'] = { count: newInventory['sand'].count - 4 };
      newInventory['sandstone'] = { count: (newInventory['sandstone']?.count || 0) + 2 };
      success = true;
    } else if (type === 'jukebox' && ((inventory['wood']?.count || 0) >= 4 || (inventory['planks']?.count || 0) >= 4) && (inventory['stone']?.count || 0) >= 1) {
      if ((inventory['planks']?.count || 0) >= 4) {
        newInventory['planks'] = { count: newInventory['planks'].count - 4 };
      } else {
        newInventory['wood'] = { count: newInventory['wood'].count - 4 };
      }
      newInventory['stone'] = { count: newInventory['stone'].count - 1 };
      newInventory['jukebox'] = { count: (newInventory['jukebox']?.count || 0) + 1 };
      success = true;
    }
    
    if (success) {
      onCraft(newInventory);
    }
  };

  const recipes = [
    { id: 'bricks', name: 'Bricks', cost: isCreative ? 'Free' : '1 Stone + 1 Coal', icon: '🧱', color: 'bg-red-800' },
    { id: 'pickaxe', name: 'Pickaxe', cost: isCreative ? 'Free' : '3 Stone + 2 Wood', icon: '⛏️', color: 'bg-blue-800' },
    { id: 'planks', name: '4x Planks', cost: isCreative ? 'Free' : '1 Wood', icon: '🪵', color: 'bg-amber-800' },
    { id: 'door', name: 'Door', cost: isCreative ? 'Free' : '2 Wood / Planks', icon: '🚪', color: 'bg-amber-900' },
    { id: 'torch', name: '4x Torches', cost: isCreative ? 'Free' : '1 Coal + 1 Wood', icon: '🕯️', color: 'bg-orange-800' },
    { id: 'sandstone', name: '2x Sandstone', cost: isCreative ? 'Free' : '4 Sand', icon: '🏛️', color: 'bg-yellow-800' },
    { id: 'jukebox', name: 'Jukebox', cost: isCreative ? 'Free' : '4 Wood + 1 Stone', icon: '📻', color: 'bg-amber-950' },
  ];

  return (
    <div className="bg-gray-900/90 border border-gray-800 p-4 rounded-2xl text-white shadow-xl">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-bold flex items-center gap-2">
          <Hammer size={18} className="text-amber-400" /> Crafting Table
        </h3>
        {isCreative && (
          <span className="text-[10px] font-mono bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
            <Sparkles size={11} /> Creative: Free Crafting
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {recipes.map(recipe => (
          <button
            key={recipe.id}
            onClick={() => craftItems(recipe.id)}
            className={`${recipe.color} hover:brightness-110 p-2.5 rounded-xl text-left border border-white/10 transition cursor-pointer flex flex-col justify-between shadow hover:scale-102 active:scale-95`}
          >
            <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
              <span>{recipe.icon}</span>
              <span>{recipe.name}</span>
            </div>
            <span className="text-[10px] text-gray-300 font-mono">
              {recipe.cost}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
