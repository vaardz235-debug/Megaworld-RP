import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Sparkles, ShieldCheck, Coins, Check, Lock, Star, 
  Volume2, RefreshCw, Smartphone, Monitor, Gamepad2, Globe, Tag, 
  Info, Award, ArrowRight, Zap, CheckCircle2, Gift
} from 'lucide-react';
import { avatarManager, COSMETICS_CATALOG, ORIGIN_EMOTES_CATALOG, CosmeticItem, OriginEmote, PlayerCustomizationData } from '../utils/avatarManager';
import { progressionManager } from '../utils/progressionManager';
import { audioEngine } from '../utils/audioEngine';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';

export interface StoreBrandSkin {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'YouTube' | 'McDonald\'s' | 'BP' | 'New World' | 'NZ' | 'Countryballs' | 'Xilam' | 'Tarragower';
  category: 'skin' | 'emote' | 'accessory' | 'aura' | 'sfx';
  priceCoins: number;
  priceRobux: number;
  icon: string;
  rarity: 'rare' | 'epic' | 'legendary' | 'mythic';
  description: string;
  features: string[];
  previewCharData?: Partial<CharacterData>;
  associatedEmoteId?: string;
  associatedCosmeticId?: string;
}

export const STORE_CATALOG: StoreBrandSkin[] = [
  // HALLOWEEN SPOOKTACULAR SPECIALS 🎃
  {
    id: 'skin_halloween_reaper_steve',
    name: 'Halloween Soul Reaper Steve',
    brand: 'Minecraft',
    category: 'skin',
    priceCoins: 550,
    priceRobux: 90,
    icon: '🎃',
    rarity: 'mythic',
    description: 'Festive Halloween costume featuring glowing Carved Jack-o\'-Lantern Helm, crossed Soul Scythes, and dancing spirit aura.',
    features: ['Glowing Jack-o\'-Lantern Eyes', 'Spectral Soul Reaper Scythes', 'Ectoplasm Ghost Mist Aura'],
    associatedCosmeticId: 'hat_pumpkin',
    associatedEmoteId: 'emote_halloween_trick_or_treat',
  },
  {
    id: 'skin_halloween_witch_alex',
    name: 'Halloween Midnight Witch Alex',
    brand: 'Minecraft',
    category: 'skin',
    priceCoins: 480,
    priceRobux: 85,
    icon: '🧙',
    rarity: 'legendary',
    description: 'Pointed buckled witch hat with bubbling cauldron and dancing purple potion bubbles.',
    features: ['Pointed Midnight Witch Hat', 'Bubbling Green Cauldron Brew', 'Dancing Star Candies VFX'],
    associatedCosmeticId: 'hat_witch',
    associatedEmoteId: 'emote_halloween_thriller',
  },

  // MINECRAFT BRAND
  {
    id: 'skin_mc_netherite_titan',
    name: 'Netherite Abyssal Archon',
    brand: 'Minecraft',
    category: 'skin',
    priceCoins: 650,
    priceRobux: 120,
    icon: '🖤',
    rarity: 'mythic',
    description: 'Forged from ancient debris in the deepest volcanic mantle of the Nether. Emits crystalline purple weeping obsidian runes.',
    features: ['Indestructible Netherite Plate', 'Crying Obsidian Glow', 'Custom Pickaxe Swing SFX'],
    associatedCosmeticId: 'aura_sculk',
  },
  {
    id: 'skin_mc_diamond_steve',
    name: 'Enchanted Diamond Paragon',
    brand: 'Minecraft',
    category: 'skin',
    priceCoins: 450,
    priceRobux: 80,
    icon: '💎',
    rarity: 'legendary',
    description: 'Pristine glowing cyan armor enchanted with Protection IV and Unbreaking III, with custom Mojang cape.',
    features: ['Gleaming Diamond Armor', 'Enchantment Glint VFX', 'Classic Minecraft Level-Up SFX'],
    associatedCosmeticId: 'hat_mining',
  },

  // ROBLOX BRAND
  {
    id: 'skin_rbx_valkyrie_noob',
    name: 'Valkyrie Helm Classic Noob',
    brand: 'Roblox',
    category: 'skin',
    priceCoins: 500,
    priceRobux: 100,
    icon: '👑',
    rarity: 'legendary',
    description: 'The legendary yellow-and-blue R6 avatar crowned with the million-Robux gilded Valkyrie Helm.',
    features: ['Iconic R6 Boxy Geometry', 'High-Altitude Super Jump VFX', 'Bloxy Cola Hip Bottle'],
    associatedCosmeticId: 'hat_dominus',
    associatedEmoteId: 'emote_roblox_oof',
  },
  {
    id: 'emote_rbx_sword_duel',
    name: 'Classic Crossroads Sword Duel',
    brand: 'Roblox',
    category: 'emote',
    priceCoins: 300,
    priceRobux: 50,
    icon: '⚔️',
    rarity: 'epic',
    description: 'Execute the legendary 2006 sword lunge and spin animation with authentic metallic clash audio.',
    features: ['360-Degree Sword Spin', 'Metallic Clash Audio', 'Sparks Particle Trail'],
    associatedEmoteId: 'emote_roblox_lunge',
  },

  // YOUTUBE BRAND
  {
    id: 'skin_yt_diamond_creator',
    name: '100M Diamond Playbutton Streamer',
    brand: 'YouTube',
    category: 'skin',
    priceCoins: 600,
    priceRobux: 110,
    icon: '▶️',
    rarity: 'mythic',
    description: 'Equipped with LED studio ringlight rig, diamond playbutton amulet, and live viewer counter aura.',
    features: ['Floating Live Viewers Hologram', 'Viral Confetti Aura', 'Subscriber Superchat Notification Sound'],
    associatedCosmeticId: 'aura_yt_viral',
    associatedEmoteId: 'emote_yt_subscribe_bell',
  },
  {
    id: 'emote_yt_subscribe_bell',
    name: 'Smash The Subscribe Bell',
    brand: 'YouTube',
    category: 'emote',
    priceCoins: 280,
    priceRobux: 45,
    icon: '🔔',
    rarity: 'rare',
    description: 'Pulls out an oversized brass notification bell and strikes it to shower the area in viral golden stars.',
    features: ['High-Pitch Chime Sound', 'Golden Bell 3D Mesh', 'Like & Subscribe Confetti'],
    associatedEmoteId: 'emote_yt_subscribe_bell',
  },

  // MCDONALD\'S BRAND
  {
    id: 'skin_mc_golden_chef',
    name: 'Golden Arches Executive Chef',
    brand: 'McDonald\'s',
    category: 'skin',
    priceCoins: 480,
    priceRobux: 85,
    icon: '🍔',
    rarity: 'epic',
    description: 'Crisp crimson crew jacket with golden embroidered arch emblems, hot fry box backpack, and golden burger trail.',
    features: ['French Fry Box Backpack', 'Golden Arches Warm Glow', 'Sizzling Grill Sound Cues'],
    associatedCosmeticId: 'aura_mc_golden',
    associatedEmoteId: 'emote_mcdonalds_fry_flip',
  },
  {
    id: 'emote_mc_fry_flip',
    name: 'Gourmet French Fry Salt & Flip',
    brand: 'McDonald\'s',
    category: 'emote',
    priceCoins: 250,
    priceRobux: 40,
    icon: '🍟',
    rarity: 'rare',
    description: 'Tosses fresh golden French fries into the air from a paper carton and catches them flawlessly.',
    features: ['Sizzling Oil Sound Effect', 'Falling Salt Crystals', 'Crispy Golden Particles'],
    associatedEmoteId: 'emote_mcdonalds_fry_flip',
  },

  // BP CLEAN ENERGY BRAND
  {
    id: 'skin_bp_solaris_exo',
    name: 'BP Solaris Photovoltaic Exosuit',
    brand: 'BP',
    category: 'skin',
    priceCoins: 520,
    priceRobux: 90,
    icon: '⚡',
    rarity: 'legendary',
    description: 'Next-generation bio-solar titanium armor with glowing green photon shields and active solar energy wings.',
    features: ['Photovoltaic Wing Glider', 'Clean Energy Particle Field', 'Solar Hum Audio Cues'],
    associatedCosmeticId: 'aura_bp_solaris',
    associatedEmoteId: 'emote_bp_solar_recharge',
  },

  // NEW WORLD BRAND
  {
    id: 'skin_nw_azoth_conqueror',
    name: 'Aeternum Azoth Vanguard',
    brand: 'New World',
    category: 'skin',
    priceCoins: 580,
    priceRobux: 105,
    icon: '🧭',
    rarity: 'mythic',
    description: 'Heavy plate armor infused with mystical glowing blue Azoth mist from the frontier of Aeternum.',
    features: ['Azoth Blue Mist Aura', 'Runic War Horn', 'Territory Victory Stance'],
    associatedCosmeticId: 'aura_newworld_azoth',
    associatedEmoteId: 'emote_newworld_war_cry',
  },

  // NZ BRAND
  {
    id: 'skin_nz_allblacks_rangatira',
    name: 'NZ All Blacks Rangatira & Wayfinder',
    brand: 'NZ',
    category: 'skin',
    priceCoins: 550,
    priceRobux: 95,
    icon: '🌿',
    rarity: 'mythic',
    description: 'Official Silver Fern performance jersey with sacred Tā Moko spiral markings, Pounamu jade talisman, and Southern Cross cape.',
    features: ['Silver Fern Flag Cape', 'Pounamu Jade Shimmer', 'Aurora Australis Bioluminescent Trail'],
    associatedCosmeticId: 'aura_silver_fern',
    associatedEmoteId: 'emote_nz_haka',
  },
  {
    id: 'emote_nz_ka_mate_haka',
    name: 'Ka Mate Tribal Haka Stomp',
    brand: 'NZ',
    category: 'emote',
    priceCoins: 350,
    priceRobux: 60,
    icon: '👣',
    rarity: 'legendary',
    description: 'Perform the timeless Ka Mate Haka with synchronized chest-slaps, rhythmic foot stomps, and ground tremors.',
    features: ['Rhythmic Stomp Shockwave', 'Sacred Chanted Vocals', 'Earthquake Ground Cracks'],
    associatedEmoteId: 'emote_nz_haka',
  },

  // COUNTRYBALLS BRAND
  {
    id: 'skin_cb_poland_space',
    name: 'Astronaut Polandball',
    brand: 'Countryballs',
    category: 'skin',
    priceCoins: 420,
    priceRobux: 75,
    icon: '🇵🇱',
    rarity: 'epic',
    description: 'Equipped with full pressurized space helmet and rocket thrusters to finally reach the stars.',
    features: ['Ballistic Orbital Rolling', 'Rocket Exhaust Sparks', 'Space Helmet Reflections'],
    associatedEmoteId: 'emote_countryball_poland',
  },

  // XILAM BRAND
  {
    id: 'skin_xilam_oggy_toon',
    name: 'Slapstick Oggy The Blue Cat',
    brand: 'Xilam',
    category: 'skin',
    priceCoins: 400,
    priceRobux: 70,
    icon: '🐱',
    rarity: 'epic',
    description: 'Hilarious cartoon cat with rubber-hose physics, comical flyswatter weapon, and slapstick squash-and-stretch.',
    features: ['Cartoon Squash & Stretch', 'Rubber Hose Arm Physics', 'Toon Squeak Soundboard'],
    associatedEmoteId: 'emote_xilam_anvil',
  },

  // TARRAGOWER SCHOOL BRAND
  {
    id: 'skin_tarragower_dean',
    name: 'Tarragower High Academy Dean',
    brand: 'Tarragower',
    category: 'skin',
    priceCoins: 460,
    priceRobux: 80,
    icon: '🏛️',
    rarity: 'epic',
    description: 'Distinguished collegiate blazer with embroidered honor crest, mortarboard, and floating architectural glyphs.',
    features: ['Floating Mathematical Glyphs', 'School Bell Toll SFX', 'Academy Wisdom Aura'],
    associatedCosmeticId: 'aura_tarragower_wisdom',
    associatedEmoteId: 'emote_tarragower_bell_ring',
  },
];

interface CosmeticStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  currentAvatar: CharacterData;
  onEquipItem?: (cosmeticId: string) => void;
}

export default function CosmeticStoreModal({
  isOpen,
  onClose,
  user,
  currentAvatar,
  onEquipItem,
}: CosmeticStoreModalProps) {
  const [activeTab, setActiveTab] = useState<'catalog' | 'monetization' | 'sync' | 'currency'>('catalog');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewItem, setPreviewItem] = useState<StoreBrandSkin | null>(STORE_CATALOG[0]);
  const [playerProgression, setPlayerProgression] = useState(progressionManager.getProgression());
  const [customData, setCustomData] = useState<PlayerCustomizationData>(avatarManager.getLocalCustomization());
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPlayerProgression(progressionManager.getProgression());
      setCustomData(avatarManager.getLocalCustomization());
      if (user?.uid) {
        progressionManager.loadFromCloud(user.uid).then((p) => setPlayerProgression(p));
        avatarManager.loadFromCloud(user.uid).then((c) => setCustomData(c));
      }
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const filteredItems = STORE_CATALOG.filter((item) => {
    const matchesBrand = selectedBrand === 'all' || item.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesBrand && matchesCategory;
  });

  const handlePurchase = async (item: StoreBrandSkin, currency: 'coins' | 'robux') => {
    if (purchasingId) return;
    setPurchasingId(item.id);

    const cost = currency === 'coins' ? item.priceCoins : item.priceRobux;
    const currentBalance = currency === 'coins' ? customData.coins : customData.robux;

    if (currentBalance < cost) {
      audioEngine.playMinecraftSound('anvil');
      showToast(`❌ Insufficient ${currency === 'coins' ? 'Coins' : 'Robux/Gems'}! Complete quests or view the Earn tab.`);
      setPurchasingId(null);
      return;
    }

    try {
      // Deduct currency & unlock cosmetic
      const updatedCoins = currency === 'coins' ? customData.coins - cost : customData.coins;
      const updatedRobux = currency === 'robux' ? customData.robux - cost : customData.robux;
      
      const newUnlockedCosmetics = Array.from(new Set([
        ...customData.unlockedCosmetics,
        item.id,
        item.associatedCosmeticId || '',
        item.associatedEmoteId || '',
      ])).filter(Boolean);

      const updatedCustom: PlayerCustomizationData = {
        ...customData,
        coins: updatedCoins,
        robux: updatedRobux,
        unlockedCosmetics: newUnlockedCosmetics,
      };

      setCustomData(updatedCustom);
      avatarManager.saveLocalCustomization(updatedCustom);
      await avatarManager.saveToCloud(user?.uid || '', updatedCustom);

      // Record in progression manager
      const prog = progressionManager.getProgression();
      if (!prog.cosmeticUnlocks.includes(item.id)) {
        prog.cosmeticUnlocks.push(item.id);
      }
      if (item.associatedCosmeticId && !prog.cosmeticUnlocks.includes(item.associatedCosmeticId)) {
        prog.cosmeticUnlocks.push(item.associatedCosmeticId);
      }
      progressionManager.saveLocal(prog);
      progressionManager.triggerAutoSync(user?.uid);
      setPlayerProgression(prog);

      audioEngine.playMinecraftSound('levelup');
      showToast(`🎉 Purchased & Synced ${item.name}! Added to all connected devices.`);

      if (onEquipItem && item.associatedCosmeticId) {
        onEquipItem(item.associatedCosmeticId);
      }
    } catch (e) {
      console.error('Purchase error:', e);
      showToast('⚠️ Transaction failed. Please check network connection.');
    } finally {
      setPurchasingId(null);
    }
  };

  const isItemUnlocked = (item: StoreBrandSkin) => {
    return customData.unlockedCosmetics.includes(item.id) || 
           (item.associatedCosmeticId && customData.unlockedCosmetics.includes(item.associatedCosmeticId)) ||
           (item.associatedEmoteId && customData.unlockedCosmetics.includes(item.associatedEmoteId));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans select-none">
      <div className="bg-stone-900 border-2 border-amber-500/70 rounded-3xl w-full max-w-6xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200 text-white">
        
        {/* Top Navigation & Balance Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              🛍️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-mono flex items-center gap-2">
                Cross-Platform Cosmetic Store
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  10-Brand Catalog
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Official thematic skins, emotes & visual flair synced securely across PC, Console, Mobile, and Web
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Currency Badges */}
            <div className="flex items-center gap-2 bg-stone-950/90 border border-stone-800 rounded-xl px-3 py-1.5 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Coins size={14} />
                <span>{customData.coins.toLocaleString()}</span>
                <span className="text-[10px] text-stone-400 font-normal">Coins</span>
              </div>
              <span className="text-stone-700">|</span>
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-3.5 h-3.5 bg-red-600 rounded flex items-center justify-center text-[9px] text-white">R</span>
                <span>{customData.robux.toLocaleString()}</span>
                <span className="text-[10px] text-stone-400 font-normal">Gems</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center cursor-pointer transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Selector Strip */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-stone-950/90 border-b border-stone-800 text-xs font-mono overflow-x-auto gap-2">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'catalog', label: '🛒 Store Catalog', count: STORE_CATALOG.length },
              { id: 'monetization', label: '💎 Monetization Strategy' },
              { id: 'sync', label: '☁️ Cross-Platform Cloud Sync' },
              { id: 'currency', label: '🪙 Earn Free Currency' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab(tab.id as any);
                }}
                className={`px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && <span className="ml-1 opacity-70">({tab.count})</span>}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-emerald-400 hidden lg:flex items-center gap-1.5 font-bold">
            <ShieldCheck size={14} />
            <span>Zero Pay-to-Win • Purely Visual Cosmetics</span>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-amber-500 text-stone-950 font-mono text-xs font-bold py-2 px-4 text-center animate-pulse flex items-center justify-center gap-2">
            <Sparkles size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* TAB 1: STORE CATALOG & DRESSING ROOM */}
          {activeTab === 'catalog' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Filters & Item Grid (8 cols) */}
              <div className="lg:col-span-8 space-y-4">
                {/* Brand Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  {[
                    { id: 'all', label: 'All Brands' },
                    { id: 'Minecraft', label: '⛏️ Minecraft' },
                    { id: 'Roblox', label: '🟥 Roblox' },
                    { id: 'YouTube', label: '▶️ YouTube' },
                    { id: 'McDonald\'s', label: '🍟 McDonald\'s' },
                    { id: 'BP', label: '⚡ BP' },
                    { id: 'New World', label: '🧭 New World' },
                    { id: 'NZ', label: '🌿 NZ' },
                    { id: 'Countryballs', label: '🌐 Countryballs' },
                    { id: 'Xilam', label: '🐱 Xilam' },
                    { id: 'Tarragower', label: '🏛️ Tarragower' },
                  ].map((brand) => (
                    <button
                      key={brand.id}
                      onClick={() => {
                        audioEngine.playMinecraftSound('click');
                        setSelectedBrand(brand.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer border ${
                        selectedBrand === brand.id
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-white'
                      }`}
                    >
                      {brand.label}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[58vh] overflow-y-auto pr-1">
                  {filteredItems.map((item) => {
                    const isUnlocked = isItemUnlocked(item);
                    const isSelected = previewItem?.id === item.id;

                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setPreviewItem(item);
                          audioEngine.playMinecraftSound('click');
                        }}
                        className={`p-3.5 rounded-2xl border transition flex flex-col justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/50 shadow-lg'
                            : isUnlocked
                            ? 'bg-stone-950/60 border-emerald-500/40 hover:border-emerald-500/70'
                            : 'bg-stone-950/80 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <div>
                          {/* Card Top */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl p-1 bg-stone-900 rounded-xl border border-stone-800 shadow-inner">
                                {item.icon}
                              </span>
                              <div>
                                <h4 className="text-xs font-bold text-white leading-tight">{item.name}</h4>
                                <span className="text-[10px] text-amber-400 font-semibold">{item.brand}</span>
                              </div>
                            </div>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              item.rarity === 'mythic' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                              item.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                              'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            }`}>
                              {item.rarity}
                            </span>
                          </div>

                          <p className="text-[11px] text-stone-400 leading-snug mb-2.5">
                            {item.description}
                          </p>

                          {/* Features Pills */}
                          <div className="flex flex-wrap gap-1 mb-3">
                            {item.features.map((feat, idx) => (
                              <span key={idx} className="text-[9px] bg-stone-900 border border-stone-800 px-1.5 py-0.5 rounded text-stone-300 font-mono">
                                ✓ {feat}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Bottom: Prices & Action */}
                        <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between gap-2">
                          {isUnlocked ? (
                            <div className="w-full py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5">
                              <CheckCircle2 size={13} />
                              <span>Unlocked & Synced</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 w-full">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePurchase(item, 'coins');
                                }}
                                disabled={purchasingId === item.id}
                                className="flex-1 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold text-xs flex items-center justify-center gap-1 transition shadow cursor-pointer"
                              >
                                <Coins size={12} />
                                <span>{item.priceCoins} Coins</span>
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePurchase(item, 'robux');
                                }}
                                disabled={purchasingId === item.id}
                                className="flex-1 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-1 transition shadow cursor-pointer"
                              >
                                <span className="text-[10px] font-black">R</span>
                                <span>{item.priceRobux} Gems</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Live Dressing Room & Preview (4 cols) */}
              <div className="lg:col-span-4 bg-stone-950/80 border border-stone-800 p-4 rounded-3xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-stone-800 mb-3">
                    <span className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                      Live Dressing Room Preview
                    </span>
                    <span className="text-[10px] bg-stone-800 px-2 py-0.5 rounded text-stone-400 font-mono">
                      3D / 2D Model
                    </span>
                  </div>

                  {/* Avatar Visual Preview Box */}
                  <div className="w-full h-56 bg-gradient-to-b from-stone-900 to-stone-950 rounded-2xl border border-stone-800/80 flex flex-col items-center justify-center relative overflow-hidden shadow-inner mb-3">
                    {/* Ambient Aura Rings */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />

                    <div className="scale-125 transform transition-transform hover:scale-135 duration-300">
                      <CharacterAvatar 
                        character={currentAvatar} 
                        size="lg" 
                      />
                    </div>

                    <div className="absolute bottom-2 text-center text-[10px] text-stone-400 font-mono">
                      Previewing with {previewItem?.name || 'Standard Outfit'}
                    </div>
                  </div>

                  {/* Selected Item Detail */}
                  {previewItem && (
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm">{previewItem.name}</h3>
                        <span className="text-amber-400 text-[11px] font-bold">{previewItem.brand}</span>
                      </div>
                      <p className="text-stone-300 text-[11px] leading-relaxed">
                        {previewItem.description}
                      </p>

                      <div className="bg-stone-900/90 border border-stone-800 p-2 rounded-xl space-y-1">
                        <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
                          Exclusive Item Perks:
                        </span>
                        {previewItem.features.map((feat, i) => (
                          <div key={i} className="text-[10.5px] text-emerald-400 flex items-center gap-1.5">
                            <span>✦</span>
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sound Preview Button if available */}
                      {previewItem.associatedEmoteId && (
                        <button
                          onClick={() => {
                            audioEngine.playMinecraftSound('orb');
                            showToast(`🎵 Testing audio signature for ${previewItem.name}...`);
                          }}
                          className="w-full py-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded-xl text-xs font-bold text-stone-200 flex items-center justify-center gap-1.5 cursor-pointer transition"
                        >
                          <Volume2 size={13} className="text-amber-400" />
                          <span>Test Sound & Emote Audio</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Direct Purchase / Equip in Dressing Room */}
                {previewItem && (
                  <div className="pt-3 border-t border-stone-800/80 mt-3">
                    {isItemUnlocked(previewItem) ? (
                      <button
                        onClick={() => {
                          audioEngine.playMinecraftSound('build');
                          showToast(`✨ Equipped ${previewItem.name}!`);
                          if (onEquipItem && previewItem.associatedCosmeticId) {
                            onEquipItem(previewItem.associatedCosmeticId);
                          }
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check size={14} strokeWidth={3} />
                        <span>Equip on Avatar</span>
                      </button>
                    ) : (
                      <div className="space-y-1.5">
                        <button
                          onClick={() => handlePurchase(previewItem, 'coins')}
                          className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <Coins size={13} />
                          <span>Buy for {previewItem.priceCoins} Coins (Free F2P)</span>
                        </button>
                        <button
                          onClick={() => handlePurchase(previewItem, 'robux')}
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition shadow cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span className="text-[10px] font-black">R</span>
                          <span>Buy for {previewItem.priceRobux} Robux / Gems</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: MONETIZATION STRATEGY ARCHITECTURE */}
          {activeTab === 'monetization' && (
            <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
              <div className="bg-gradient-to-r from-amber-950/40 via-stone-900 to-stone-950 border border-amber-500/50 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/20 text-amber-300 rounded-2xl border border-amber-500/40">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      United Games and Apps RPG - Monetization Strategy
                    </h3>
                    <p className="text-xs text-stone-300">
                      Ethical, cross-platform cosmetic economy designed for multi-brand longevity and fair play
                    </p>
                  </div>
                </div>
              </div>

              {/* Three Core Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xl">⚖️</span>
                  <h4 className="font-bold text-amber-300 text-sm">1. Strict Zero Pay-to-Win</h4>
                  <p className="text-stone-400 leading-relaxed text-[11px]">
                    Every item in the cosmetic store is purely visual (outfits, 3D wings, particle trails, soundboard audio, and emotes). No combat stats, weapon damage, or health multipliers are ever monetized.
                  </p>
                </div>

                <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xl">🪙</span>
                  <h4 className="font-bold text-amber-300 text-sm">2. Dual Currency Engine</h4>
                  <p className="text-stone-400 leading-relaxed text-[11px]">
                    <strong>Coins (Soft Currency):</strong> 100% earnable by mining, completing introductory quests, and territory defense.<br/>
                    <strong>Robux / Gems (Hard Currency):</strong> Earnable via seasonal raid bosses, cross-server milestones, or microtransaction bundles.
                  </p>
                </div>

                <div className="bg-stone-950/80 border border-stone-800 p-4 rounded-2xl space-y-2">
                  <span className="text-xl">🌐</span>
                  <h4 className="font-bold text-amber-300 text-sm">3. Universal Portability</h4>
                  <p className="text-stone-400 leading-relaxed text-[11px]">
                    Any skin or accessory purchased on one platform (e.g. Mobile iOS) immediately transfers to PC and Console without double-charging the player. One universal ledger.
                  </p>
                </div>
              </div>

              {/* Currency Bundles Overview */}
              <div className="bg-stone-950/80 border border-stone-800 p-5 rounded-3xl space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <span>💎</span> Optional Robux & Gem Currency Bundles (Fair Pricing Tier)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {[
                    { amount: 500, price: '$4.99', badge: 'Starter Pack', bonus: '+50 Bonus Gems' },
                    { amount: 1200, price: '$9.99', badge: 'Popular Choice', bonus: '+150 Bonus Gems' },
                    { amount: 2600, price: '$19.99', badge: 'Best Value', bonus: '+400 Bonus Gems' },
                    { amount: 7000, price: '$49.99', badge: 'Multiverse Vault', bonus: '+1500 Bonus Gems' },
                  ].map((pkg, idx) => (
                    <div key={idx} className="bg-stone-900 border border-stone-800 p-3.5 rounded-2xl text-center space-y-1.5 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full font-bold">
                          {pkg.badge}
                        </span>
                        <div className="text-xl font-black text-red-400 mt-1">{pkg.amount} Gems</div>
                        <div className="text-[10px] text-emerald-400">{pkg.bonus}</div>
                      </div>
                      <button
                        onClick={() => {
                          audioEngine.playMinecraftSound('levelup');
                          setCustomData(prev => ({ ...prev, robux: prev.robux + pkg.amount }));
                          showToast(`🎁 Simulated sandbox purchase: Added +${pkg.amount} Gems to your account!`);
                        }}
                        className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        {pkg.price} USD
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CROSS-PLATFORM CLOUD SYNCHRONIZATION SPECIFICATION */}
          {activeTab === 'sync' && (
            <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
              <div className="bg-gradient-to-r from-sky-950/40 via-stone-900 to-stone-950 border border-sky-500/50 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-sky-500/20 text-sky-300 rounded-2xl border border-sky-500/40">
                    <Globe size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      Cross-Platform Progression & Security Synchronization
                    </h3>
                    <p className="text-xs text-stone-300">
                      Technical implementation of multi-device state synchronization via Firebase Firestore
                    </p>
                  </div>
                </div>
              </div>

              {/* Architecture Diagram Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                {[
                  { icon: <Monitor size={22} className="text-sky-400" />, title: 'PC Client', desc: 'Windows / Mac / Linux (Chrome, Electron)' },
                  { icon: <Gamepad2 size={22} className="text-emerald-400" />, title: 'Console Edition', desc: 'Xbox, PlayStation & Switch web runtime' },
                  { icon: <Smartphone size={22} className="text-purple-400" />, title: 'Mobile Client', desc: 'iOS & Android responsive touch client' },
                  { icon: <Globe size={22} className="text-amber-400" />, title: 'Web App', desc: 'Live hosted high-speed cloud instance' },
                ].map((plat, idx) => (
                  <div key={idx} className="bg-stone-950/90 border border-stone-800 p-4 rounded-2xl text-center space-y-1.5">
                    <div className="w-10 h-10 mx-auto bg-stone-900 rounded-xl flex items-center justify-center border border-stone-800">
                      {plat.icon}
                    </div>
                    <div className="font-bold text-white text-xs">{plat.title}</div>
                    <div className="text-[10px] text-stone-400 leading-tight">{plat.desc}</div>
                    <div className="text-[9px] text-emerald-400 font-bold bg-emerald-950/40 py-0.5 rounded border border-emerald-500/20">
                      Sync Status: ACTIVE
                    </div>
                  </div>
                ))}
              </div>

              {/* Security & Data Integrity Features */}
              <div className="bg-stone-950/90 border border-stone-800 p-5 rounded-3xl space-y-4">
                <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wider">
                  🔐 Cloud Data Integrity & Tamper-Proof Safeguards
                </h4>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-stone-900/60 rounded-xl border border-stone-800/80">
                    <ShieldCheck size={18} className="text-emerald-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs block">1. Cryptographic Checksum Verification (dataIntegrityHash):</strong>
                      <span className="text-stone-400 text-[11px] leading-relaxed">
                        Every save payload generates a SHA-256 equivalent hash of user level, cosmetics unlocked, and coin balances. The cloud rejects any payload whose client signature does not match expected arithmetic progression.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-stone-900/60 rounded-xl border border-stone-800/80">
                    <Zap size={18} className="text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs block">2. High-Water Mark Reconciliation (Zero Data Loss):</strong>
                      <span className="text-stone-400 text-[11px] leading-relaxed">
                        When syncing between an offline mobile session and a PC cloud session, the reconciliation algorithm merges via set-union: max level is preserved, all newly acquired cosmetics are combined, and the highest currency balance is locked in.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-stone-900/60 rounded-xl border border-stone-800/80">
                    <Info size={18} className="text-amber-400 mt-0.5 shrink-0" />
                    <div>
                      <strong className="text-white text-xs block">3. Universal 6-Digit Link Codes (No Passwords Required):</strong>
                      <span className="text-stone-400 text-[11px] leading-relaxed">
                        Players on TV/consoles generate a secure 15-minute link code (e.g. `SPR-8K2`) in the Progression modal and enter it on mobile to transfer their entire inventory instantly with zero password typing.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: EARN FREE CURRENCY GUIDE */}
          {activeTab === 'currency' && (
            <div className="space-y-6 max-w-4xl mx-auto font-mono text-xs">
              <div className="bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-950 border border-emerald-500/50 p-6 rounded-3xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 text-emerald-300 rounded-2xl border border-emerald-500/40">
                    <Coins size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      How to Earn Free In-Game Currency (100% Free-to-Play)
                    </h3>
                    <p className="text-xs text-stone-300">
                      Explore the multi-brand sandbox, complete cooperative quests, and win recurring world events
                    </p>
                  </div>
                </div>
              </div>

              {/* Earn Methods Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    icon: '⛏️',
                    title: '1. Voxel Mining & Crop Harvesting',
                    payout: '10 - 50 Coins per mineral vein',
                    desc: 'Mine diamonds, emeralds, and netherite blocks across the biomes, or farm wheat to earn steady merchant trade coins.',
                  },
                  {
                    icon: '📜',
                    title: '2. Introductory Brand Quests',
                    payout: '200 - 450 Coins & 50 Gems per quest',
                    desc: 'Help Chief Tamati (NZ), Oggy (Xilam), Polandball, or Nova (YouTube) to claim guaranteed coins and cosmetic unlocks.',
                  },
                  {
                    icon: '🎙️',
                    title: '3. Voice Chat Collaboration Events',
                    payout: '150 - 300 Coins per raid strike',
                    desc: 'Participate in the YouTube Viral Stream Raid or the Minecraft Nether Warden Incursion using proximity voice chat [V].',
                  },
                  {
                    icon: '🏰',
                    title: '4. Outpost Territory Control',
                    payout: '300 - 400 Coins per defense',
                    desc: 'Hold the Waitangi Coastal Beacon or Fort Everfall garrison to earn server trade tax payouts.',
                  },
                ].map((method, idx) => (
                  <div key={idx} className="bg-stone-950/90 border border-stone-800 p-4 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{method.icon}</span>
                      <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                        {method.payout}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-white">{method.title}</h4>
                    <p className="text-stone-400 text-[11px] leading-relaxed">{method.desc}</p>
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
