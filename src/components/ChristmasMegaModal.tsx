import React, { useState, useMemo } from 'react';
import { 
  X, Search, Sparkles, Filter, Sliders, Gift, User, Shield, 
  Flame, Snowflake, Zap, Music, Volume2, Check, RefreshCw, 
  Download, Eye, Play, Star, ChevronLeft, ChevronRight, Layers,
  Compass, Palette, Bell
} from 'lucide-react';
import { 
  CHRISTMAS_CHARACTERS_1000, 
  CHRISTMAS_ITEMS_1000, 
  CHRISTMAS_SETTINGS_1000, 
  CHRISTMAS_PRESET_PACKS,
  ChristmasCharacterRecord,
  ChristmasItemRecord,
  ChristmasSettingRecord,
  ChristmasPresetPack
} from '../data/christmasHolidayMegaData';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { audioEngine } from '../utils/audioEngine';
import { progressionManager } from '../utils/progressionManager';

interface ChristmasMegaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCharacter?: (char: CharacterData) => void;
  onAddItemToInventory?: (item: ChristmasItemRecord) => void;
  onApplySettings?: (settings: Record<string, any>) => void;
  currentAvatar?: CharacterData;
  user?: any;
}

export default function ChristmasMegaModal({
  isOpen,
  onClose,
  onSelectCharacter,
  onAddItemToInventory,
  onApplySettings,
  currentAvatar,
  user
}: ChristmasMegaModalProps) {
  // Navigation Tabs: 'characters' | 'items' | 'settings' | 'presets'
  const [activeTab, setActiveTab] = useState<'characters' | 'items' | 'settings' | 'presets'>('characters');

  // Search & Filter state
  const [charSearch, setCharSearch] = useState('');
  const [charCategory, setCharCategory] = useState<string>('all');
  const [charRarity, setCharRarity] = useState<string>('all');
  const [charPage, setCharPage] = useState(1);
  const charsPerPage = 24;

  const [itemSearch, setItemSearch] = useState('');
  const [itemCategory, setItemCategory] = useState<string>('all');
  const [itemRarity, setItemRarity] = useState<string>('all');
  const [itemPage, setItemPage] = useState(1);
  const itemsPerPage = 24;

  const [settingSearch, setSettingSearch] = useState('');
  const [settingDomain, setSettingDomain] = useState<string>('all');
  const [settingPage, setSettingPage] = useState(1);
  const settingsPerPage = 25;

  // Active settings configuration
  const [settingsValues, setSettingsValues] = useState<Record<string, any>>(() => {
    const saved = localStorage.getItem('megaworld_christmas_settings_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved settings', e);
      }
    }
    const initial: Record<string, any> = {};
    CHRISTMAS_SETTINGS_1000.forEach(s => {
      initial[s.id] = s.defaultValue;
    });
    return initial;
  });

  // Active selected character for inspection
  const [inspectChar, setInspectChar] = useState<ChristmasCharacterRecord>(CHRISTMAS_CHARACTERS_1000[0]);
  const [inspectItem, setInspectItem] = useState<ChristmasItemRecord>(CHRISTMAS_ITEMS_1000[0]);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // -------------------------------------------------------------------------
  // Filtering 1,000 Characters
  // -------------------------------------------------------------------------
  const filteredCharacters = useMemo(() => {
    return CHRISTMAS_CHARACTERS_1000.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(charSearch.toLowerCase()) ||
                            c.christmasLore.toLowerCase().includes(charSearch.toLowerCase());
      const matchesCategory = charCategory === 'all' || c.christmasCategory === charCategory;
      const matchesRarity = charRarity === 'all' || c.rarity === charRarity;
      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [charSearch, charCategory, charRarity]);

  const totalCharPages = Math.ceil(filteredCharacters.length / charsPerPage) || 1;
  const paginatedCharacters = useMemo(() => {
    const start = (charPage - 1) * charsPerPage;
    return filteredCharacters.slice(start, start + charsPerPage);
  }, [filteredCharacters, charPage]);

  // -------------------------------------------------------------------------
  // Filtering 1,000 Items
  // -------------------------------------------------------------------------
  const filteredItems = useMemo(() => {
    return CHRISTMAS_ITEMS_1000.filter(it => {
      const matchesSearch = it.name.toLowerCase().includes(itemSearch.toLowerCase()) ||
                            it.description.toLowerCase().includes(itemSearch.toLowerCase());
      const matchesCategory = itemCategory === 'all' || it.category === itemCategory;
      const matchesRarity = itemRarity === 'all' || it.rarity === itemRarity;
      return matchesSearch && matchesCategory && matchesRarity;
    });
  }, [itemSearch, itemCategory, itemRarity]);

  const totalItemPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const start = (itemPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, itemPage]);

  // -------------------------------------------------------------------------
  // Filtering 1,000 Settings
  // -------------------------------------------------------------------------
  const filteredSettings = useMemo(() => {
    return CHRISTMAS_SETTINGS_1000.filter(s => {
      const matchesSearch = s.label.toLowerCase().includes(settingSearch.toLowerCase()) ||
                            s.description.toLowerCase().includes(settingSearch.toLowerCase()) ||
                            s.key.toLowerCase().includes(settingSearch.toLowerCase());
      const matchesDomain = settingDomain === 'all' || s.domain === settingDomain;
      return matchesSearch && matchesDomain;
    });
  }, [settingSearch, settingDomain]);

  const totalSettingPages = Math.ceil(filteredSettings.length / settingsPerPage) || 1;
  const paginatedSettings = useMemo(() => {
    const start = (settingPage - 1) * settingsPerPage;
    return filteredSettings.slice(start, start + settingsPerPage);
  }, [filteredSettings, settingPage]);

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------
  const handleEquipChar = (char: ChristmasCharacterRecord) => {
    audioEngine.playMinecraftSound('levelup');
    setInspectChar(char);
    if (onSelectCharacter) {
      onSelectCharacter(char);
    }
    // Also record in progression manager
    progressionManager.addXp(25, `Equipped Christmas Hero: ${char.name}`);
    showToast(`🎅 Equipped ${char.name}! Festive cheer +${char.holidayCheer}`);
  };

  const handleClaimItem = (item: ChristmasItemRecord) => {
    audioEngine.playMinecraftSound('pickup');
    setInspectItem(item);
    if (onAddItemToInventory) {
      onAddItemToInventory(item);
    }
    // Award progression
    progressionManager.recordItemAcquired(item.id, item.name, item.icon, item.rarity === 'Holiday Mythic' ? 'legendary' : 'rare');
    progressionManager.addXp(15, `Collected ${item.name}`);
    showToast(`🎁 Added ${item.name} to Inventory!`);
  };

  const handleUpdateSetting = (id: string, val: any) => {
    const next = { ...settingsValues, [id]: val };
    setSettingsValues(next);
    localStorage.setItem('megaworld_christmas_settings_v1', JSON.stringify(next));
    if (onApplySettings) {
      onApplySettings(next);
    }
  };

  const handleApplyPreset = (preset: ChristmasPresetPack) => {
    audioEngine.playMinecraftSound('anvil_use');
    // Configure settings according to preset
    const next = { ...settingsValues };
    if (preset.id === 'blizzard_wonderland') {
      Object.keys(next).forEach(k => {
        if (k.includes('physics') || k.includes('density') || k.includes('velocity')) {
          next[k] = 95;
        }
      });
    } else if (preset.id === 'cozy_hearth') {
      Object.keys(next).forEach(k => {
        if (k.includes('fire') || k.includes('hearth') || k.includes('warmth')) {
          next[k] = 90;
        }
      });
    } else if (preset.id === 'silent_night_aurora') {
      Object.keys(next).forEach(k => {
        if (k.includes('aurora') || k.includes('sky')) {
          next[k] = 100;
        }
      });
    }
    setSettingsValues(next);
    localStorage.setItem('megaworld_christmas_settings_v1', JSON.stringify(next));
    if (onApplySettings) {
      onApplySettings(next);
    }
    showToast(`✨ Applied Preset: ${preset.name}!`);
  };

  const handleResetSettings = () => {
    const defaults: Record<string, any> = {};
    CHRISTMAS_SETTINGS_1000.forEach(s => {
      defaults[s.id] = s.defaultValue;
    });
    setSettingsValues(defaults);
    localStorage.setItem('megaworld_christmas_settings_v1', JSON.stringify(defaults));
    if (onApplySettings) {
      onApplySettings(defaults);
    }
    showToast('🔄 Reset all 1,000 Christmas Settings to factory defaults.');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-stone-900 border-2 border-red-500/80 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 relative">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-700 text-white font-bold px-4 py-2 rounded-xl shadow-xl border border-emerald-400 flex items-center gap-2 text-sm animate-bounce">
            <Sparkles size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="bg-gradient-to-r from-red-950 via-stone-900 to-emerald-950 p-4 border-b border-stone-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/30 border border-red-500 flex items-center justify-center text-2xl shadow-inner">
              🎅
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-wide flex items-center gap-2">
                  1,000 Christmas Mega Edition
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600/40 text-red-300 border border-red-500/50 uppercase">
                    Holiday Master Catalog
                  </span>
                </h2>
              </div>
              <p className="text-xs text-stone-400">
                1,000 Playable Holiday Characters • 1,000 Christmas Items • 1,000 Render & Physics Settings
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition cursor-pointer"
            title="Close Christmas Catalog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="bg-stone-950 px-4 py-2 border-b border-stone-800 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'characters', label: '🎄 1,000 Characters', count: CHRISTMAS_CHARACTERS_1000.length },
            { id: 'items', label: '🎁 1,000 Items', count: CHRISTMAS_ITEMS_1000.length },
            { id: 'settings', label: '⚙️ 1,000 Settings', count: CHRISTMAS_SETTINGS_1000.length },
            { id: 'presets', label: '✨ Quick Presets', count: CHRISTMAS_PRESET_PACKS.length },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                audioEngine.playMinecraftSound('click');
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-400' 
                  : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-stone-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* =================================================================== */}
        {/* TAB 1: 1,000 CHRISTMAS CHARACTERS                                  */}
        {/* =================================================================== */}
        {activeTab === 'characters' && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Filter & Gallery Grid */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden border-r border-stone-800">
              {/* Search & Filter Controls */}
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={charSearch}
                    onChange={e => {
                      setCharSearch(e.target.value);
                      setCharPage(1);
                    }}
                    placeholder="Search by name, lore, costume (e.g. Santa, Rudolph, Poland, Steve)..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Steremy Quick Filter Button */}
                <button
                  type="button"
                  onClick={() => {
                    setCharSearch('Steremy');
                    setCharPage(1);
                  }}
                  className="bg-sky-950/90 hover:bg-sky-900 border border-sky-400 text-sky-200 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-sm"
                  title="Filter Steremy / Jeremy the Jet Plane"
                >
                  <span className="text-sm">✈️</span>
                  <span>Steremy</span>
                </button>

                <select
                  value={charCategory}
                  onChange={e => {
                    setCharCategory(e.target.value);
                    setCharPage(1);
                  }}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All 10 Categories</option>
                  <option value="santa_variants">🎅 Santa Clauss (100)</option>
                  <option value="elf_artisans">🧝 Elf Artisans (100)</option>
                  <option value="reindeer_frost_beasts">🦌 Reindeer Squad (100)</option>
                  <option value="holiday_countryballs">🌐 Holiday Countryballs (100)</option>
                  <option value="frosted_sprunki">🎵 Frosted Sprunki (100)</option>
                  <option value="roblox_winter">🧱 Roblox Winter (100)</option>
                  <option value="minecraft_holiday">⛏️ Minecraft Holiday (100)</option>
                  <option value="brand_ambassadors">⭐ Brand Ambassadors (100)</option>
                  <option value="nutcrackers_toys">💂 Nutcrackers & Toys (100)</option>
                  <option value="yule_mythics">❄️ Yule Mythics (100)</option>
                </select>

                <select
                  value={charRarity}
                  onChange={e => {
                    setCharRarity(e.target.value);
                    setCharPage(1);
                  }}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All Rarities</option>
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                  <option value="Holiday Mythic">⭐ Holiday Mythic</option>
                </select>
              </div>

              {/* Character Grid */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {paginatedCharacters.map(char => {
                  const isSelected = inspectChar.id === char.id;
                  const isEquipped = currentAvatar?.name === char.name;

                  return (
                    <div
                      key={char.id}
                      onClick={() => setInspectChar(char)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col items-center text-center relative ${
                        isSelected 
                          ? 'bg-red-950/60 border-red-500 shadow-md shadow-red-950/50 ring-1 ring-red-400' 
                          : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                      }`}
                    >
                      {isEquipped && (
                        <span className="absolute top-1.5 right-1.5 bg-emerald-600 text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                          ACTIVE
                        </span>
                      )}

                      <div className="w-14 h-14 mb-2 flex items-center justify-center">
                        <CharacterAvatar character={char} isWalking={false} />
                      </div>

                      <div className="w-full">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 block truncate">
                          {char.christmasCategory.replace(/_/g, ' ')}
                        </span>
                        <h4 className="font-bold text-xs text-white truncate w-full" title={char.name}>
                          {char.name}
                        </h4>
                        <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-stone-400">
                          <span className="text-yellow-400 font-semibold">✨ {char.holidayCheer}</span>
                          <span>•</span>
                          <span className={`font-semibold ${
                            char.rarity === 'Holiday Mythic' ? 'text-amber-400' :
                            char.rarity === 'Legendary' ? 'text-purple-400' :
                            char.rarity === 'Epic' ? 'text-indigo-400' :
                            char.rarity === 'Rare' ? 'text-blue-400' : 'text-stone-400'
                          }`}>
                            {char.rarity}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination Controls */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>
                  Showing {paginatedCharacters.length} of {filteredCharacters.length} Christmas Characters
                </span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={charPage <= 1}
                    onClick={() => setCharPage(p => Math.max(1, p - 1))}
                    className="p-1.5 bg-stone-950 border border-stone-800 rounded-lg hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-stone-200">
                    {charPage} / {totalCharPages}
                  </span>
                  <button
                    disabled={charPage >= totalCharPages}
                    onClick={() => setCharPage(p => Math.min(totalCharPages, p + 1))}
                    className="p-1.5 bg-stone-950 border border-stone-800 rounded-lg hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Detailed Inspection Card & Equip Action */}
            <div className="w-full md:w-80 p-4 bg-stone-950 flex flex-col justify-between">
              <div>
                <div className="text-center pb-4 border-b border-stone-800">
                  <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center bg-stone-900/60 rounded-2xl border border-stone-800 shadow-inner">
                    <CharacterAvatar character={inspectChar} isWalking={true} />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/60 uppercase">
                    {inspectChar.rarity} • {inspectChar.christmasCategory.replace(/_/g, ' ')}
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-1.5">{inspectChar.name}</h3>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{inspectChar.christmasLore}</p>
                </div>

                {/* Holiday Stats */}
                <div className="py-3 space-y-2 border-b border-stone-800">
                  <h5 className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Holiday Attributes</h5>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Holiday Cheer</span>
                      <span className="font-bold text-yellow-400">✨ {inspectChar.holidayCheer}</span>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Frost Resist</span>
                      <span className="font-bold text-cyan-400">❄️ {inspectChar.frostResistance}%</span>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Sleigh Speed</span>
                      <span className="font-bold text-emerald-400">🛷 {inspectChar.sleighSpeed}</span>
                    </div>
                    <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                      <span className="text-stone-400 text-[10px] block">Gift Luck</span>
                      <span className="font-bold text-purple-400">🎁 +{inspectChar.giftLuck}%</span>
                    </div>
                  </div>
                </div>

                <div className="py-2 text-[11px] text-stone-400 space-y-1">
                  <div><strong>Costume:</strong> {inspectChar.christmasCostume || 'Festive Attire'}</div>
                  <div><strong>Held Gear:</strong> {inspectChar.heldWeapon ? inspectChar.heldWeapon.replace(/_/g, ' ') : 'None'}</div>
                </div>
              </div>

              {/* Equip CTA */}
              <div className="pt-3">
                <button
                  onClick={() => handleEquipChar(inspectChar)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm shadow-lg shadow-red-950/60 flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Check size={16} />
                  <span>Equip as Player Avatar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: 1,000 CHRISTMAS ITEMS                                       */}
        {/* =================================================================== */}
        {activeTab === 'items' && (
          <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
            {/* Left: Item Search & Grid */}
            <div className="flex-1 flex flex-col p-4 overflow-hidden border-r border-stone-800">
              <div className="flex flex-wrap gap-2 mb-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={itemSearch}
                    onChange={e => {
                      setItemSearch(e.target.value);
                      setItemPage(1);
                    }}
                    placeholder="Search 1,000 items (e.g. Candy Cane, Eggnog, Star, Shield)..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Steremy Quick Filter Button */}
                <button
                  type="button"
                  onClick={() => {
                    setItemSearch('Steremy');
                    setItemPage(1);
                  }}
                  className="bg-sky-950/90 hover:bg-sky-900 border border-sky-400 text-sky-200 px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-sm"
                  title="Filter Steremy flight gear"
                >
                  <span className="text-sm">✈️</span>
                  <span>Steremy Gear</span>
                </button>

                <select
                  value={itemCategory}
                  onChange={e => {
                    setItemCategory(e.target.value);
                    setItemPage(1);
                  }}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All 5 Item Types</option>
                  <option value="weapons_combat">🗡️ Weapons & Combat (200)</option>
                  <option value="armor_apparel">🛡️ Armor & Apparel (200)</option>
                  <option value="food_potions">☕ Food & Potions (200)</option>
                  <option value="building_decor">🎄 Decor & Blocks (200)</option>
                  <option value="toys_collectibles">🚂 Toys & Relics (200)</option>
                </select>

                <select
                  value={itemRarity}
                  onChange={e => {
                    setItemRarity(e.target.value);
                    setItemPage(1);
                  }}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All Rarities</option>
                  <option value="Common">Common</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                  <option value="Holiday Mythic">⭐ Holiday Mythic</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {paginatedItems.map(item => {
                  const isSelected = inspectItem.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setInspectItem(item)}
                      className={`p-2.5 rounded-xl border transition cursor-pointer flex flex-col items-center text-center relative ${
                        isSelected 
                          ? 'bg-red-950/60 border-red-500 shadow-md ring-1 ring-red-400' 
                          : 'bg-stone-950/80 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                      }`}
                    >
                      <div className="text-3xl mb-1.5">{item.icon}</div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 block truncate w-full">
                        {item.category.replace(/_/g, ' ')}
                      </span>
                      <h4 className="font-bold text-xs text-white truncate w-full" title={item.name}>
                        {item.name}
                      </h4>
                      <div className="flex items-center justify-center gap-1.5 mt-1 text-[10px] text-stone-400">
                        <span className="text-yellow-400 font-semibold">✨ {item.cheerPower} Cheer</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">{item.tradeValue} Sprus</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span>Showing {paginatedItems.length} of {filteredItems.length} Christmas Items</span>
                <div className="flex items-center gap-2">
                  <button
                    disabled={itemPage <= 1}
                    onClick={() => setItemPage(p => Math.max(1, p - 1))}
                    className="p-1.5 bg-stone-950 border border-stone-800 rounded-lg hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="font-mono text-stone-200">{itemPage} / {totalItemPages}</span>
                  <button
                    disabled={itemPage >= totalItemPages}
                    onClick={() => setItemPage(p => Math.min(totalItemPages, p + 1))}
                    className="p-1.5 bg-stone-950 border border-stone-800 rounded-lg hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Item Detail & Add to Hotbar/Inventory */}
            <div className="w-full md:w-80 p-4 bg-stone-950 flex flex-col justify-between">
              <div>
                <div className="text-center pb-4 border-b border-stone-800">
                  <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center bg-stone-900 rounded-2xl border border-stone-800 text-5xl shadow-inner">
                    {inspectItem.icon}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-300 border border-red-800/60 uppercase">
                    {inspectItem.rarity} • {inspectItem.itemType}
                  </span>
                  <h3 className="font-extrabold text-base text-white mt-1.5">{inspectItem.name}</h3>
                  <p className="text-xs text-stone-400 mt-1 leading-relaxed">{inspectItem.description}</p>
                </div>

                <div className="py-3 space-y-2 border-b border-stone-800 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-400">Cheer Value:</span>
                    <span className="font-bold text-yellow-400">+{inspectItem.cheerPower} Points</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-400">Market Price:</span>
                    <span className="font-bold text-emerald-400">{inspectItem.tradeValue} Sprus</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-900">
                    <span className="text-stone-400">Equippable:</span>
                    <span className="font-bold text-white">{inspectItem.isEquippable ? 'Yes' : 'Consumable / Placeable'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => handleClaimItem(inspectItem)}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer transition"
                >
                  <Gift size={16} />
                  <span>Add to Inventory / Hotbar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: 1,000 CHRISTMAS SETTINGS                                    */}
        {/* =================================================================== */}
        {activeTab === 'settings' && (
          <div className="flex-1 overflow-hidden flex flex-col p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap gap-2 flex-1 min-w-[280px]">
                <div className="relative flex-1 min-w-[200px]">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={settingSearch}
                    onChange={e => {
                      setSettingSearch(e.target.value);
                      setSettingPage(1);
                    }}
                    placeholder="Search 1,000 settings (e.g. snow, aurora, fireplace, bells, fps)..."
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>

                <select
                  value={settingDomain}
                  onChange={e => {
                    setSettingDomain(e.target.value);
                    setSettingPage(1);
                  }}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-stone-300 focus:outline-none focus:border-red-500 cursor-pointer"
                >
                  <option value="all">All 8 Setting Domains</option>
                  <option value="snow_blizzard_physics">❄️ Snow & Blizzard Physics (200)</option>
                  <option value="sky_aurora_shaders">🌌 Sky & Aurora Shaders (150)</option>
                  <option value="festive_lighting_glow">🕯️ Lighting & Holiday Glow (150)</option>
                  <option value="holiday_audio_soundscape">🔔 Audio & Soundscape (150)</option>
                  <option value="gameplay_world_buffs">🎮 Gameplay & World Modifiers (150)</option>
                  <option value="brand_hub_holiday_decor">🏢 Brand Hub Decor Overrides (100)</option>
                  <option value="ui_hud_camera_skins">🖥️ UI, HUD & Camera Themes (50)</option>
                  <option value="accessibility_performance">⚡ Accessibility & FPS (50)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleResetSettings}
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw size={13} />
                  <span>Reset All</span>
                </button>
              </div>
            </div>

            {/* Settings List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {paginatedSettings.map(set => {
                const current = settingsValues[set.id] !== undefined ? settingsValues[set.id] : set.defaultValue;

                return (
                  <div
                    key={set.id}
                    className="p-3 bg-stone-950 rounded-xl border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:border-stone-700 transition"
                  >
                    <div className="flex-1 min-w-[240px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{set.label}</span>
                        <span className="text-[10px] text-stone-500 font-mono">#{set.id}</span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">{set.description}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                      {set.type === 'slider' && (
                        <div className="flex items-center gap-2 w-full sm:w-48">
                          <input
                            type="range"
                            min={set.min || 0}
                            max={set.max || 100}
                            step={set.step || 1}
                            value={current}
                            onChange={e => handleUpdateSetting(set.id, Number(e.target.value))}
                            className="w-full accent-red-500 cursor-pointer"
                          />
                          <span className="text-xs font-mono font-bold text-red-400 w-9 text-right">
                            {current}
                          </span>
                        </div>
                      )}

                      {set.type === 'boolean' && (
                        <label className="flex items-center gap-2 text-xs text-stone-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={!!current}
                            onChange={e => handleUpdateSetting(set.id, e.target.checked)}
                            className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                          />
                          <span>{current ? 'Enabled' : 'Disabled'}</span>
                        </label>
                      )}

                      {set.type === 'color' && (
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={current}
                            onChange={e => handleUpdateSetting(set.id, e.target.value)}
                            className="w-7 h-7 rounded border border-stone-700 bg-transparent cursor-pointer"
                          />
                          <span className="text-xs font-mono text-stone-300">{current}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
              <span>Showing {paginatedSettings.length} of {filteredSettings.length} Christmas Settings</span>
              <div className="flex items-center gap-2">
                <button
                  disabled={settingPage <= 1}
                  onClick={() => setSettingPage(p => Math.max(1, p - 1))}
                  className="p-1.5 bg-stone-950 border border-stone-800 rounded-lg hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="font-mono text-stone-200">{settingPage} / {totalSettingPages}</span>
                <button
                  disabled={settingPage >= totalSettingPages}
                  onClick={() => setSettingPage(p => Math.min(totalSettingPages, p + 1))}
                  className="p-1.5 bg-stone-950 border border-stone-800 rounded-lg hover:bg-stone-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: PRESET PACKS                                                 */}
        {/* =================================================================== */}
        {activeTab === 'presets' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-2xl mx-auto text-center mb-4">
              <h3 className="font-extrabold text-lg text-white">One-Click Christmas Presets</h3>
              <p className="text-xs text-stone-400 mt-1">
                Instantly configure weather, shader lighting, festive audio, and particle physics in a single tap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
              {CHRISTMAS_PRESET_PACKS.map(preset => (
                <div
                  key={preset.id}
                  className="p-4 bg-stone-950 rounded-2xl border border-stone-800 hover:border-red-500/60 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <span className="text-3xl">{preset.icon}</span>
                      <div>
                        <h4 className="font-bold text-white text-sm">{preset.name}</h4>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {preset.tags.map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.2 rounded bg-stone-900 text-stone-400 border border-stone-800">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-stone-400 leading-relaxed mb-4">{preset.description}</p>
                  </div>

                  <button
                    onClick={() => handleApplyPreset(preset)}
                    className="w-full py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles size={14} />
                    <span>Apply Preset</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
