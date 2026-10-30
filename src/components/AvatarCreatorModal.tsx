import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Check, Lock, ShoppingBag, Shield, Award, User, RefreshCw, 
  Coins, Zap, Search, ChevronRight, Palette, Layers, Star, Play, Volume2, Smile,
  Bookmark, Download, Upload, Trash2, FolderPlus, Save
} from 'lucide-react';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { ALL_CHARACTERS } from './CharacterGallery';
import { 
  avatarManager, 
  PlayerCustomizationData, 
  AvatarPreset,
  COSMETICS_CATALOG, 
  CHARACTER_CLASSES, 
  BODY_TYPES,
  HAIRSTYLES_CATALOG,
  CLOTHING_CATALOG,
  COLOR_PRESETS,
  CosmeticItem, 
  CharacterClass,
  ORIGIN_EMOTES_CATALOG,
  OriginEmote
} from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';
import { speechEngine } from '../utils/speechEngine';

interface AvatarCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onAvatarEquipped: (char: CharacterData) => void;
}

export default function AvatarCreatorModal({
  isOpen,
  onClose,
  user,
  onAvatarEquipped,
}: AvatarCreatorModalProps) {
  const [customData, setCustomData] = useState<PlayerCustomizationData>(avatarManager.getLocalCustomization());
  const [activeTab, setActiveTab] = useState<'base' | 'body' | 'hair' | 'clothing' | 'colors' | 'cosmetics' | 'class' | 'emotes' | 'identity' | 'presets'>('base');
  const [baseCategory, setBaseCategory] = useState<'all' | 'minecraft' | 'roblox' | 'countryball' | 'xilam' | 'sprnuki' | 'thomas'>('all');
  const [emoteOriginFilter, setEmoteOriginFilter] = useState<'all' | 'Sprunki' | 'Thomas & Friends' | 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World'>('all');
  const [activeEmotePlaying, setActiveEmotePlaying] = useState<string | null>(null);
  const [cosmeticSlot, setCosmeticSlot] = useState<'hat' | 'face' | 'back' | 'aura' | 'emblem'>('hat');
  const [clothingSlot, setClothingSlot] = useState<'shirt' | 'pants'>('shirt');
  const [colorTarget, setColorTarget] = useState<'skin' | 'hair' | 'shirt' | 'pants'>('skin');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewAnim, setPreviewAnim] = useState<'idle' | 'walk' | 'sprint' | 'jump'>('idle');
  const [purchaseFeedback, setPurchaseFeedback] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Preset slots state
  const [presetsList, setPresetsList] = useState<AvatarPreset[]>(() => avatarManager.getSavedPresets());
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetStyle, setNewPresetStyle] = useState<'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'NZ' | 'Brand'>('Minecraft');

  useEffect(() => {
    if (isOpen) {
      avatarManager.loadFromCloud(user?.uid).then((data) => {
        setCustomData(data);
      });
      setPresetsList(avatarManager.getSavedPresets());
    }
  }, [isOpen, user]);

  const handleSaveNewPreset = () => {
    if (!newPresetName.trim()) {
      setPurchaseFeedback('Please enter a name for your outfit preset.');
      setTimeout(() => setPurchaseFeedback(null), 3000);
      return;
    }
    audioEngine.playMinecraftSound('levelup');
    const created = avatarManager.savePreset(newPresetName, newPresetStyle, customData);
    setPresetsList(avatarManager.getSavedPresets());
    setNewPresetName('');
    setPurchaseFeedback(`Saved preset "${created.name}" successfully!`);
    setTimeout(() => setPurchaseFeedback(null), 3500);
  };

  const handleLoadPreset = (preset: AvatarPreset) => {
    audioEngine.playMinecraftSound('orb');
    setCustomData({ ...preset.data });
    setPurchaseFeedback(`Loaded outfit "${preset.name}" (${preset.style} Style)!`);
    setTimeout(() => setPurchaseFeedback(null), 3000);
  };

  const handleDeletePreset = (presetId: string, presetName: string) => {
    audioEngine.playMinecraftSound('click');
    avatarManager.deletePreset(presetId);
    setPresetsList(avatarManager.getSavedPresets());
    setPurchaseFeedback(`Removed preset "${presetName}".`);
    setTimeout(() => setPurchaseFeedback(null), 2500);
  };

  if (!isOpen) return null;

  // Selected base character object
  const currentBaseChar = ALL_CHARACTERS.find((c) => c.id === customData.baseCharacterId) || ALL_CHARACTERS[0];
  const customizedChar = avatarManager.applyToCharacter(currentBaseChar, customData);
  const selectedClassObj = CHARACTER_CLASSES.find((c) => c.id === customData.customClass) || CHARACTER_CLASSES[0];

  // Filter base characters
  const filteredBases = ALL_CHARACTERS.filter((char) => {
    let matchesCat = false;
    if (baseCategory === 'all') matchesCat = true;
    else if (baseCategory === 'thomas') matchesCat = char.type === 'train' || (char.type as string) === 'thomas';
    else matchesCat = char.type === baseCategory;

    const matchesSearch = char.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (char.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filter cosmetics
  const currentCosmetics = COSMETICS_CATALOG.filter((c) => c.slot === cosmeticSlot);

  // Filter origin emotes
  const filteredEmotes = ORIGIN_EMOTES_CATALOG.filter((emote) => {
    const matchesOrigin = emoteOriginFilter === 'all' || emote.origin === emoteOriginFilter;
    const matchesSearch = emote.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emote.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesOrigin && matchesSearch;
  });

  const playEmoteSound = (soundType: string) => {
    if (soundType === 'sprunki_beat') {
      audioEngine.playSprunkiSound('oren', false);
    } else if (soundType === 'sprunki_horror') {
      audioEngine.playSprunkiSound('raddy', true);
    } else if (soundType === 'verity_oracle') {
      audioEngine.playVeritySound('oracle');
    } else if (soundType === 'verity_pop') {
      audioEngine.playVeritySound('pop');
    } else if (soundType === 'train_whistle') {
      audioEngine.playMinecraftSound('levelup');
    } else if (soundType === 'train_steam') {
      audioEngine.playMinecraftSound('anvil');
    } else if (soundType === 'train_chug') {
      audioEngine.playMinecraftSound('click');
    } else if (soundType === 'fanfare') {
      audioEngine.playMinecraftSound('levelup');
    } else if (soundType === 'minecraft_villager') {
      audioEngine.playMinecraftSound('orb');
    } else if (soundType === 'minecraft_crouch') {
      audioEngine.playMinecraftSound('pop');
    } else if (soundType === 'minecraft_eat') {
      audioEngine.playMinecraftSound('eat');
    } else if (soundType === 'minecraft_levelup') {
      audioEngine.playMinecraftSound('levelup');
    } else if (soundType === 'roblox_oof') {
      audioEngine.playRobloxSound('oof');
    } else if (soundType === 'roblox_cheer') {
      audioEngine.playRobloxSound('cheer');
    } else if (soundType === 'roblox_swish') {
      audioEngine.playRobloxSound('sword_lunge');
    } else if (soundType === 'roblox_equip') {
      audioEngine.playRobloxSound('equip');
    } else if (soundType === 'countryball_bounce') {
      audioEngine.playMinecraftSound('pop');
    } else if (soundType === 'countryball_poland') {
      audioEngine.playMinecraftSound('orb');
    } else if (soundType === 'countryball_salute') {
      audioEngine.playMinecraftSound('levelup');
    } else if (soundType === 'xilam_splat') {
      audioEngine.playMinecraftSound('anvil');
    } else if (soundType === 'xilam_chase') {
      audioEngine.playMinecraftSound('pop');
    } else if (soundType === 'nz_haka') {
      audioEngine.playMinecraftSound('anvil');
    } else if (soundType === 'kiwi_chirp') {
      audioEngine.playMinecraftSound('pop');
    } else if (soundType === 'solar_whir') {
      audioEngine.playMinecraftSound('orb');
    } else if (soundType === 'fry_sizzle') {
      audioEngine.playMinecraftSound('eat');
    } else if (soundType === 'bell_chime') {
      audioEngine.playMinecraftSound('levelup');
    } else if (soundType === 'school_bell') {
      audioEngine.playMinecraftSound('levelup');
    } else if (soundType === 'battle_cry') {
      audioEngine.playMinecraftSound('totem');
    } else {
      audioEngine.playMinecraftSound('pop');
    }
  };

  const handleTriggerEmote = (emote: OriginEmote) => {
    setActiveEmotePlaying(emote.id);
    playEmoteSound(emote.soundType);
    setCustomData((prev) => ({ ...prev, selectedEmote: emote.id }));
    setTimeout(() => {
      setActiveEmotePlaying((curr) => (curr === emote.id ? null : curr));
    }, emote.durationMs);
  };

  const handleAssignQuickEmote = (emoteId: string, slotIndex: number) => {
    audioEngine.playMinecraftSound('orb');
    setCustomData((prev) => {
      const current = [...(prev.quickEmotes || ['emote_sprunki_beatbox', 'emote_thomas_whistle', 'emote_minecraft_crouch', 'emote_roblox_cheer'])];
      current[slotIndex] = emoteId;
      return { ...prev, quickEmotes: current };
    });
    setPurchaseFeedback(`Assigned to Hotbar Slot #${slotIndex + 1}!`);
    setTimeout(() => setPurchaseFeedback(null), 2500);
  };

  const handleSelectBase = (char: CharacterData) => {
    audioEngine.playMinecraftSound('click');
    setCustomData((prev) => ({
      ...prev,
      baseCharacterId: char.id,
      baseType: char.type as any,
    }));
  };

  const handleSelectClass = (cls: CharacterClass) => {
    audioEngine.playMinecraftSound('click');
    setCustomData((prev) => ({
      ...prev,
      customClass: cls.id,
    }));
  };

  const handleEquipCosmetic = (item: CosmeticItem) => {
    audioEngine.playMinecraftSound('pop');
    setCustomData((prev) => {
      const fieldMap: Record<string, string> = {
        hat: 'selectedHat',
        face: 'selectedFace',
        back: 'selectedWings',
        aura: 'selectedAura',
        emblem: 'selectedEmblem',
      };
      const field = fieldMap[item.slot];
      const isAlreadyEquipped = (prev as any)[field] === item.id;
      return {
        ...prev,
        [field]: isAlreadyEquipped ? 'none' : item.id,
      };
    });
  };

  const handleBuyCosmetic = (item: CosmeticItem) => {
    try {
      const updated = avatarManager.unlockCosmetic(customData, item.id, item.priceCoins);
      audioEngine.playMinecraftSound('orb');
      // Auto-equip upon purchase
      const fieldMap: Record<string, string> = {
        hat: 'selectedHat',
        face: 'selectedFace',
        back: 'selectedWings',
        aura: 'selectedAura',
        emblem: 'selectedEmblem',
      };
      (updated as any)[fieldMap[item.slot]] = item.id;
      setCustomData(updated);
      setPurchaseFeedback(`Unlocked & equipped "${item.name}"!`);
      setTimeout(() => setPurchaseFeedback(null), 3500);
    } catch (err: any) {
      audioEngine.playMinecraftSound('anvil');
      setPurchaseFeedback(err.message || 'Purchase failed');
      setTimeout(() => setPurchaseFeedback(null), 3500);
    }
  };

  const handleBuyItem = (itemId: string, price: number, name: string, equipFn: () => void) => {
    try {
      const updated = avatarManager.unlockCosmetic(customData, itemId, price);
      audioEngine.playMinecraftSound('orb');
      setCustomData(updated);
      equipFn();
      setPurchaseFeedback(`Unlocked & equipped "${name}"!`);
      setTimeout(() => setPurchaseFeedback(null), 3500);
    } catch (err: any) {
      audioEngine.playMinecraftSound('anvil');
      setPurchaseFeedback(err.message || 'Purchase failed');
      setTimeout(() => setPurchaseFeedback(null), 3500);
    }
  };

  const handleSaveAndEquip = async () => {
    setSaving(true);
    audioEngine.playMinecraftSound('levelup');
    await avatarManager.saveToCloud(user?.uid, customData);
    const finalAvatar = avatarManager.applyToCharacter(currentBaseChar, customData);
    onAvatarEquipped(finalAvatar);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-stone-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-5xl shadow-[0_15px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              🎨
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                Avatar Creator & Studio
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Universal Sync
                </span>
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Cross-brand customizations: Minecraft, Roblox, Countryballs, Xilam & Brands
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Wallet Balances */}
            <div className="hidden sm:flex items-center gap-3 bg-stone-950/80 px-3 py-1.5 rounded-2xl border border-stone-800 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Coins size={14} className="text-amber-400" />
                <span>{customData.coins} Coins</span>
              </div>
              <div className="w-px h-3 bg-stone-700" />
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 bg-red-500 inline-block rotate-12 rounded-xs" />
                <span>{customData.robux} Robux</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Feedback Alert Bar */}
        {purchaseFeedback && (
          <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md">
            <Sparkles size={14} />
            <span>{purchaseFeedback}</span>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left Preview Stage */}
          <div className="lg:w-80 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 p-6 flex flex-col items-center justify-between border-b lg:border-b-0 lg:border-r border-stone-800 relative overflow-hidden">
            {/* Ambient Backlight */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Title / Name Header */}
            <div className="text-center font-mono z-10 w-full">
              <div className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-500/30 inline-block mb-1">
                {customData.customTitle || 'Master Explorer'}
              </div>
              <h3 className="text-lg font-black text-white truncate px-2">
                {customData.customName || currentBaseChar.name}
              </h3>
              <p className="text-[11px] text-stone-400 capitalize">
                {currentBaseChar.type} • {selectedClassObj.name}
              </p>
              {customData.selectedEmote && (
                <div className="mt-1.5 flex items-center justify-center gap-1.5 text-[10px] text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full inline-flex">
                  <span>🎭</span>
                  <span className="truncate max-w-[180px]">
                    {ORIGIN_EMOTES_CATALOG.find((e) => e.id === customData.selectedEmote)?.name || 'Custom Emote'}
                  </span>
                </div>
              )}
            </div>

            {/* Character Viewport */}
            <div className="my-8 flex items-center justify-center relative min-h-[170px] w-full">
              <div className="scale-125 transition-transform duration-200">
                <CharacterAvatar 
                  character={customizedChar}
                  size="lg"
                  isWalking={previewAnim === 'walk'}
                  isSprinting={previewAnim === 'sprint'}
                  isJumping={previewAnim === 'jump'}
                  showName={false}
                />
              </div>
            </div>

            {/* Animation Toggle Bar */}
            <div className="w-full space-y-3 z-10">
              <div className="flex items-center justify-center gap-1 bg-stone-950/90 p-1 rounded-xl border border-stone-800 text-[11px] font-mono">
                {(['idle', 'walk', 'sprint', 'jump'] as const).map((anim) => (
                  <button
                    key={anim}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setPreviewAnim(anim);
                    }}
                    className={`flex-1 py-1 rounded-lg font-bold capitalize transition cursor-pointer ${
                      previewAnim === anim 
                        ? 'bg-amber-500 text-stone-950 shadow' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    {anim}
                  </button>
                ))}
              </div>

              {/* Class Perk Summary Pill */}
              <div className="bg-stone-950/80 p-3 rounded-2xl border border-stone-800/80 font-mono text-left">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base">{selectedClassObj.icon}</span>
                  <span className="text-xs font-bold text-amber-300">{selectedClassObj.perkTitle}</span>
                </div>
                <p className="text-[10px] text-stone-400 leading-tight">
                  {selectedClassObj.perkDescription}
                </p>
                <div className="mt-1.5 text-[9.5px] font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  {selectedClassObj.statBonus}
                </div>
              </div>
            </div>
          </div>

          {/* Right Customization Studio Tabs */}
          <div className="flex-1 flex flex-col overflow-hidden bg-stone-900/60">
            {/* Studio Navigation Bar */}
            <div className="flex items-center gap-1.5 p-3 bg-stone-950/70 border-b border-stone-800 overflow-x-auto font-mono text-xs">
              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('base');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'base'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <User size={13} />
                <span>1. Base Skin</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('body');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'body'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Layers size={13} />
                <span>2. Body Type</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('hair');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'hair'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span>💇</span>
                <span>3. Hairstyles</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('clothing');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'clothing'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span>👕</span>
                <span>4. Clothing</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('colors');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'colors'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Palette size={13} />
                <span>5. Colors & Dye</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('cosmetics');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'cosmetics'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Sparkles size={13} />
                <span>6. Accessories</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('class');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'class'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Shield size={13} />
                <span>7. Brand Class</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('emotes');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'emotes'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <span>🎭</span>
                <span>8. Origin Emotes</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('identity');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'identity'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Award size={13} />
                <span>9. Identity</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setActiveTab('presets');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
                  activeTab === 'presets'
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'text-stone-400 hover:text-white hover:bg-stone-800'
                }`}
              >
                <Bookmark size={13} />
                <span>10. Saved Presets & Outfits</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto font-mono">
              {/* TAB 1: BASE CHARACTER PICKER */}
              {activeTab === 'base' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    {/* Category Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { id: 'all', label: 'All Roster' },
                        { id: 'minecraft', label: '⛏️ Minecraft' },
                        { id: 'roblox', label: '🟥 Roblox' },
                        { id: 'countryball', label: '🌐 Countryballs' },
                        { id: 'xilam', label: '🐱 Xilam' },
                        { id: 'sprnuki', label: '🎵 Sprunki' },
                        { id: 'thomas', label: '🚂 Thomas & Friends' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            audioEngine.playMinecraftSound('click');
                            setBaseCategory(cat.id as any);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            baseCategory === cat.id
                              ? 'bg-stone-800 text-amber-300 border border-amber-500/60 shadow-sm'
                              : 'text-stone-400 hover:text-stone-200 bg-stone-950/60 border border-stone-800'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        type="text"
                        placeholder="Search skins..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 w-full sm:w-48"
                      />
                    </div>
                  </div>

                  {/* Character Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {filteredBases.map((char) => {
                      const isSelected = char.id === customData.baseCharacterId;
                      return (
                        <button
                          key={`${char.type}-${char.id}`}
                          onClick={() => handleSelectBase(char)}
                          className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer relative group ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                              : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-800/50'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-stone-950">
                              <Check size={12} strokeWidth={3} />
                            </div>
                          )}

                          <div className="h-24 flex items-center justify-center py-2 overflow-hidden">
                            <CharacterAvatar character={char} size="sm" showName={false} />
                          </div>

                          <div className="mt-2">
                            <div className="text-xs font-bold text-white truncate">{char.name}</div>
                            <div className="text-[10px] text-stone-400 uppercase tracking-wider">{char.type}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: BODY TYPE & ANATOMY SCALE */}
              {activeTab === 'body' && (
                <div className="space-y-4">
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs text-stone-300">
                    <p className="font-bold text-amber-300 mb-1">Body Type & Anatomy Scale</p>
                    <p className="text-stone-400">
                      Choose your character's foundational silhouette, ranging from classic blocky cubic proportions to smooth spheres, agile silhouettes, and cartoon slapstick frames.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {BODY_TYPES.map((body) => {
                      const isSelected = (customData.bodyType || 'blocky_steve') === body.id;
                      return (
                        <button
                          key={body.id}
                          onClick={() => {
                            audioEngine.playMinecraftSound('click');
                            setCustomData((prev) => ({ ...prev, bodyType: body.id }));
                          }}
                          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer relative ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-400/50'
                              : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-800/40'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{body.icon}</span>
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-stone-700 font-bold">
                                {body.brand}
                              </span>
                            </div>
                            <h4 className="text-sm font-black text-white mb-1">{body.name}</h4>
                            <p className="text-[11px] text-stone-400 leading-snug">{body.description}</p>
                          </div>

                          <div className="mt-4 pt-2 border-t border-stone-800/60 flex items-center justify-between text-xs">
                            <span className={`text-[11px] font-bold ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                              {isSelected ? '✓ Selected' : 'Select'}
                            </span>
                            {isSelected && (
                              <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-stone-950">
                                <Check size={12} strokeWidth={3} />
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: HAIRSTYLES */}
              {activeTab === 'hair' && (
                <div className="space-y-4">
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs text-stone-300">
                    <p className="font-bold text-amber-300 mb-1">Hairstyles & Cuts</p>
                    <p className="text-stone-400">
                      Equip custom voxel and sprite hairstyles with dynamic physics and dye tinting.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {HAIRSTYLES_CATALOG.map((hair) => {
                      const isUnlocked = hair.priceCoins === 0 || customData.unlockedCosmetics.includes(hair.id);
                      const isEquipped = (customData.selectedHair || 'hair_none') === hair.id;

                      return (
                        <div
                          key={hair.id}
                          className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                            isEquipped
                              ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-400/40'
                              : 'bg-stone-950/70 border-stone-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{hair.icon}</span>
                              {hair.priceCoins === 0 ? (
                                <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                  Free
                                </span>
                              ) : (
                                <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                                  <Coins size={11} /> {hair.priceCoins}
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-bold text-white mb-0.5">{hair.name}</h4>
                            <p className="text-[11px] text-stone-400 leading-tight mb-3">{hair.description}</p>
                          </div>

                          {isUnlocked ? (
                            <button
                              onClick={() => {
                                audioEngine.playMinecraftSound('pop');
                                setCustomData((prev) => ({
                                  ...prev,
                                  selectedHair: isEquipped ? 'hair_none' : hair.id,
                                }));
                              }}
                              className={`w-full py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                isEquipped
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                              }`}
                            >
                              {isEquipped ? (
                                <>
                                  <Check size={13} strokeWidth={3} />
                                  <span>Equipped</span>
                                </>
                              ) : (
                                <span>Equip</span>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleBuyItem(hair.id, hair.priceCoins, hair.name, () => {
                                  setCustomData((prev) => ({ ...prev, selectedHair: hair.id }));
                                });
                              }}
                              className="w-full py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <Lock size={12} />
                              <span>Unlock ({hair.priceCoins} Coins)</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: CLOTHING (SHIRTS & PANTS) */}
              {activeTab === 'clothing' && (
                <div className="space-y-4">
                  {/* Clothing Slot Toggle: Shirts / Pants */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        audioEngine.playMinecraftSound('click');
                        setClothingSlot('shirt');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                        clothingSlot === 'shirt'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      <span>👕 Tops & Armor ({CLOTHING_CATALOG.filter((c) => c.slot === 'shirt').length})</span>
                    </button>

                    <button
                      onClick={() => {
                        audioEngine.playMinecraftSound('click');
                        setClothingSlot('pants');
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                        clothingSlot === 'pants'
                          ? 'bg-amber-500 text-stone-950 shadow'
                          : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      <span>👖 Pants & Greaves ({CLOTHING_CATALOG.filter((c) => c.slot === 'pants').length})</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {CLOTHING_CATALOG.filter((item) => item.slot === clothingSlot).map((cloth) => {
                      const isUnlocked = cloth.priceCoins === 0 || customData.unlockedCosmetics.includes(cloth.id);
                      const isEquipped = clothingSlot === 'shirt' 
                        ? (customData.selectedShirt || 'shirt_default') === cloth.id
                        : (customData.selectedPants || 'pants_default') === cloth.id;

                      return (
                        <div
                          key={cloth.id}
                          className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                            isEquipped
                              ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-400/40'
                              : 'bg-stone-950/70 border-stone-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{cloth.icon}</span>
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-stone-700 font-bold">
                                {cloth.brand}
                              </span>
                            </div>
                            <h4 className="text-xs font-bold text-white mb-0.5">{cloth.name}</h4>
                            <p className="text-[11px] text-stone-400 leading-tight mb-3">{cloth.description}</p>
                          </div>

                          {isUnlocked ? (
                            <button
                              onClick={() => {
                                audioEngine.playMinecraftSound('pop');
                                setCustomData((prev) => ({
                                  ...prev,
                                  [clothingSlot === 'shirt' ? 'selectedShirt' : 'selectedPants']: cloth.id,
                                }));
                              }}
                              className={`w-full py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                isEquipped
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                              }`}
                            >
                              {isEquipped ? (
                                <>
                                  <Check size={13} strokeWidth={3} />
                                  <span>Equipped</span>
                                </>
                              ) : (
                                <span>Equip</span>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                handleBuyItem(cloth.id, cloth.priceCoins, cloth.name, () => {
                                  setCustomData((prev) => ({
                                    ...prev,
                                    [clothingSlot === 'shirt' ? 'selectedShirt' : 'selectedPants']: cloth.id,
                                  }));
                                });
                              }}
                              className="w-full py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <Lock size={12} />
                              <span>Unlock ({cloth.priceCoins} Coins)</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 5: COLORS & DYE */}
              {activeTab === 'colors' && (
                <div className="space-y-5">
                  {/* Target Selection: Skin, Hair, Shirt, Pants */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {[
                      { id: 'skin', label: '👋 Skin Tone', current: customData.skinColor || '#f5d0a9' },
                      { id: 'hair', label: '💇 Hair Dye', current: customData.hairColor || '#451a03' },
                      { id: 'shirt', label: '👕 Shirt Tint', current: customData.shirtColor || '#0055ff' },
                      { id: 'pants', label: '👖 Pants Tint', current: customData.pantsColor || '#1e3a8a' },
                    ].map((target) => (
                      <button
                        key={target.id}
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setColorTarget(target.id as any);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 ${
                          colorTarget === target.id
                            ? 'bg-amber-500 text-stone-950 shadow'
                            : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                          style={{ backgroundColor: target.current }}
                        />
                        <span>{target.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Palette Swatches */}
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                        Preset Palette Swatches
                      </h4>
                      <span className="text-[11px] text-stone-400 capitalize">Editing {colorTarget}</span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      {(COLOR_PRESETS[colorTarget === 'skin' ? 'skin' : colorTarget === 'hair' ? 'hair' : 'clothes'] || COLOR_PRESETS.clothes).map((hex) => {
                        const currentHex = colorTarget === 'skin' 
                          ? customData.skinColor 
                          : colorTarget === 'hair' 
                          ? customData.hairColor 
                          : colorTarget === 'shirt' 
                          ? customData.shirtColor 
                          : customData.pantsColor;
                        const isSelected = (currentHex || '').toLowerCase() === hex.toLowerCase();

                        return (
                          <button
                            key={hex}
                            onClick={() => {
                              audioEngine.playMinecraftSound('click');
                              const field = colorTarget === 'skin' 
                                ? 'skinColor' 
                                : colorTarget === 'hair' 
                                ? 'hairColor' 
                                : colorTarget === 'shirt' 
                                ? 'shirtColor' 
                                : 'pantsColor';
                              setCustomData((prev) => ({ ...prev, [field]: hex }));
                            }}
                            className={`w-9 h-9 rounded-xl border-2 transition cursor-pointer flex items-center justify-center relative hover:scale-110 active:scale-95 shadow-sm ${
                              isSelected ? 'border-white ring-2 ring-amber-400 scale-105' : 'border-stone-700/60'
                            }`}
                            style={{ backgroundColor: hex }}
                            title={hex}
                          >
                            {isSelected && <Check size={14} className="text-stone-900 drop-shadow" strokeWidth={3} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Hex Color Picker */}
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-white mb-0.5">Custom Hex Color Picker</h4>
                      <p className="text-[11px] text-stone-400">Pick any custom shade or enter a custom 6-digit hex code.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={
                          (colorTarget === 'skin' 
                            ? customData.skinColor 
                            : colorTarget === 'hair' 
                            ? customData.hairColor 
                            : colorTarget === 'shirt' 
                            ? customData.shirtColor 
                            : customData.pantsColor) || '#0055ff'
                        }
                        onChange={(e) => {
                          const hex = e.target.value;
                          const field = colorTarget === 'skin' 
                            ? 'skinColor' 
                            : colorTarget === 'hair' 
                            ? 'hairColor' 
                            : colorTarget === 'shirt' 
                            ? 'shirtColor' 
                            : 'pantsColor';
                          setCustomData((prev) => ({ ...prev, [field]: hex }));
                        }}
                        className="w-10 h-10 rounded-xl border border-stone-700 bg-stone-900 cursor-pointer p-0.5"
                      />
                      <input
                        type="text"
                        maxLength={7}
                        value={
                          (colorTarget === 'skin' 
                            ? customData.skinColor 
                            : colorTarget === 'hair' 
                            ? customData.hairColor 
                            : colorTarget === 'shirt' 
                            ? customData.shirtColor 
                            : customData.pantsColor) || '#0055ff'
                        }
                        onChange={(e) => {
                          const hex = e.target.value;
                          const field = colorTarget === 'skin' 
                            ? 'skinColor' 
                            : colorTarget === 'hair' 
                            ? 'hairColor' 
                            : colorTarget === 'shirt' 
                            ? 'shirtColor' 
                            : 'pantsColor';
                          setCustomData((prev) => ({ ...prev, [field]: hex }));
                        }}
                        className="w-24 bg-stone-900 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-white uppercase font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: COSMETICS & ACCESSORIES */}
              {/* TAB 7: BRAND CLASSES & ABILITIES */}
              {activeTab === 'class' && (
                <div className="space-y-4">
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs text-stone-300">
                    <p className="font-bold text-amber-300 mb-1">Brand Starting Abilities & Classes</p>
                    <p className="text-stone-400">
                      Each class grants unique passive abilities, stat multipliers, and thematic sound/particle traits inspired by the world’s crossover brands.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[52vh] overflow-y-auto pr-1">
                    {CHARACTER_CLASSES.map((cls) => {
                      const isSelected = cls.id === customData.customClass;
                      return (
                        <div
                          key={cls.id}
                          className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between relative ${
                            isSelected
                              ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-400/50'
                              : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div>
                            {/* Class Header */}
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2.5">
                                <div className="w-12 h-12 bg-stone-900 border border-stone-700 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-inner">
                                  {cls.icon}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="text-sm font-black text-white">{cls.name}</h4>
                                    <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-stone-700">
                                      {cls.brand}
                                    </span>
                                  </div>
                                  <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                                    {cls.role}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Starting Ability Card */}
                            <div className="bg-stone-900/90 border border-stone-800 p-2.5 rounded-xl mb-2.5 space-y-1">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-amber-300 flex items-center gap-1">
                                  <span>{cls.startingAbility.icon}</span>
                                  <span>Active: {cls.startingAbility.name}</span>
                                </span>
                                <span className="text-[9.5px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded font-mono">
                                  ⏱️ {cls.startingAbility.cooldownSec}s CD
                                </span>
                              </div>
                              <p className="text-[10.5px] text-stone-300 leading-snug">
                                {cls.startingAbility.description}
                              </p>
                            </div>

                            {/* Passive Skill */}
                            <div className="bg-stone-900/60 border border-stone-800/80 p-2 rounded-xl mb-2.5 space-y-0.5 text-xs">
                              <div className="font-bold text-sky-300 flex items-center gap-1 text-[11px]">
                                <span>{cls.passiveSkill.icon}</span>
                                <span>Passive: {cls.passiveSkill.name}</span>
                              </div>
                              <p className="text-[10px] text-stone-400 leading-snug">
                                {cls.passiveSkill.description}
                              </p>
                              <div className="text-[9.5px] font-bold text-emerald-400">
                                Bonus: {cls.passiveSkill.statBonus}
                              </div>
                            </div>

                            {/* Recommended Playstyle */}
                            <div className="text-[10px] text-stone-400 mb-3 bg-stone-950/60 p-2 rounded-lg border border-stone-900">
                              <strong className="text-stone-300">Playstyle: </strong>
                              <span>{cls.recommendedPlaystyle}</span>
                            </div>
                          </div>

                          {/* Footer Actions: Test Voice & Select */}
                          <div className="flex items-center gap-2 pt-2 border-t border-stone-800/80">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                audioEngine.playMinecraftSound('orb');
                                speechEngine.speak({ id: 999, name: cls.name, type: 'minecraft' }, cls.startingAbility.voiceLine);
                              }}
                              className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-[10.5px] font-bold transition flex items-center gap-1 cursor-pointer"
                              title="Listen to class voiceline"
                            >
                              <Volume2 size={12} className="text-yellow-400" />
                              <span>Voiceline</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleSelectClass(cls)}
                              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow ${
                                isSelected
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white font-black'
                                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold'
                              }`}
                            >
                              {isSelected ? '✓ Equipped Class' : 'Select Class'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: COSMETICS & ACCESSORIES */}
              {activeTab === 'cosmetics' && (
                <div className="space-y-4">
                  {/* Cosmetic Slot Selector */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    {[
                      { id: 'hat', label: '🎩 Headgear', count: COSMETICS_CATALOG.filter(c => c.slot === 'hat').length },
                      { id: 'face', label: '🕶️ Eyewear', count: COSMETICS_CATALOG.filter(c => c.slot === 'face').length },
                      { id: 'back', label: '🪽 Wings & Back', count: COSMETICS_CATALOG.filter(c => c.slot === 'back').length },
                      { id: 'aura', label: '✨ Aura Particles', count: COSMETICS_CATALOG.filter(c => c.slot === 'aura').length },
                      { id: 'emblem', label: '🛡️ Brand Badges', count: COSMETICS_CATALOG.filter(c => c.slot === 'emblem').length },
                    ].map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setCosmeticSlot(slot.id as any);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                          cosmeticSlot === slot.id
                            ? 'bg-amber-500 text-stone-950 shadow'
                            : 'bg-stone-950/60 text-stone-400 hover:text-white border border-stone-800'
                        }`}
                      >
                        <span>{slot.label}</span>
                        <span className="text-[10px] opacity-70">({slot.count})</span>
                      </button>
                    ))}
                  </div>

                  {/* Cosmetics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                    {currentCosmetics.map((item) => {
                      const isUnlocked = customData.unlockedCosmetics.includes(item.id) || item.priceCoins === 0;
                      const fieldMap: Record<string, string> = {
                        hat: customData.selectedHat,
                        face: customData.selectedFace,
                        back: customData.selectedWings,
                        aura: customData.selectedAura,
                        emblem: customData.selectedEmblem,
                      };
                      const isEquipped = fieldMap[item.slot] === item.id;

                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                            isEquipped
                              ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-400/40'
                              : 'bg-stone-950/70 border-stone-800'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-2xl">{item.icon}</span>
                              <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                                item.rarity === 'mythic' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                                item.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                                item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                                item.rarity === 'rare' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                                'bg-stone-800 text-stone-300 border-stone-700'
                              }`}>
                                {item.rarity}
                              </span>
                            </div>

                            <h4 className="text-xs font-bold text-white mb-0.5">{item.name}</h4>
                            <div className="text-[10px] text-amber-400 mb-1">{item.brand}</div>
                            <p className="text-[11px] text-stone-400 leading-tight mb-3">{item.description}</p>
                          </div>

                          {isUnlocked ? (
                            <button
                              onClick={() => handleEquipCosmetic(item)}
                              className={`w-full py-1.5 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 ${
                                isEquipped
                                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                              }`}
                            >
                              {isEquipped ? (
                                <>
                                  <Check size={13} strokeWidth={3} />
                                  <span>Equipped</span>
                                </>
                              ) : (
                                <span>Equip</span>
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleBuyCosmetic(item)}
                              className="w-full py-1.5 rounded-xl font-bold text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 transition cursor-pointer flex items-center justify-center gap-1.5 shadow"
                            >
                              <Lock size={12} />
                              <span>Unlock ({item.priceCoins} Coins)</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 8: ORIGIN EMOTES & ANIMATIONS */}
              {activeTab === 'emotes' && (
                <div className="space-y-4">
                  {/* Origin Brand Filters & Hotbar Preview */}
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {[
                        { id: 'all', label: 'All Brands' },
                        { id: 'NZ', label: '🌿 NZ' },
                        { id: 'Minecraft', label: '⛏️ Minecraft' },
                        { id: 'Roblox', label: '🟥 Roblox' },
                        { id: 'Countryballs', label: '🌐 Countryballs' },
                        { id: 'Xilam', label: '🐱 Xilam' },
                        { id: 'BP', label: '⚡ BP' },
                        { id: 'McDonald\'s', label: '🍟 McDonald\'s' },
                        { id: 'YouTube', label: '▶️ YouTube' },
                        { id: 'Tarragower', label: '🏛️ Tarragower' },
                        { id: 'New World', label: '🧭 New World' },
                        { id: 'Sprunki', label: '🎵 Sprunki' },
                        { id: 'Thomas & Friends', label: '🚂 Thomas' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            audioEngine.playMinecraftSound('click');
                            setEmoteOriginFilter(cat.id as any);
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                            emoteOriginFilter === cat.id
                              ? 'bg-amber-500 text-stone-950 font-black shadow-sm'
                              : 'text-stone-400 hover:text-white bg-stone-950/60 border border-stone-800'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Quick Emote Hotbar Bar */}
                    <div className="bg-stone-950/90 border border-stone-800 rounded-xl px-3 py-1.5 flex items-center gap-2 text-xs">
                      <span className="text-stone-400 font-bold">Hotbar (Keys 1-4):</span>
                      <div className="flex items-center gap-1.5">
                        {[0, 1, 2, 3].map((slotIdx) => {
                          const slotEmoteId = (customData.quickEmotes || [])[slotIdx];
                          const emoteObj = ORIGIN_EMOTES_CATALOG.find((e) => e.id === slotEmoteId);
                          return (
                            <button
                              key={slotIdx}
                              onClick={() => {
                                if (emoteObj) handleTriggerEmote(emoteObj);
                              }}
                              title={emoteObj ? `${emoteObj.name} (Key [${slotIdx + 1}])` : `Slot ${slotIdx + 1}`}
                              className="w-7 h-7 rounded-lg bg-stone-900 border border-stone-700 hover:border-amber-400 flex items-center justify-center text-sm cursor-pointer transition hover:scale-110 active:scale-95"
                            >
                              {emoteObj ? emoteObj.icon : <span className="text-[10px] text-stone-500">#{slotIdx + 1}</span>}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Emotes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[52vh] overflow-y-auto pr-1">
                    {filteredEmotes.map((emote) => {
                      const isPrimary = customData.selectedEmote === emote.id;
                      const isPlaying = activeEmotePlaying === emote.id;
                      const quickSlotIndex = (customData.quickEmotes || []).indexOf(emote.id);

                      return (
                        <div
                          key={emote.id}
                          className={`p-3.5 rounded-2xl border transition flex flex-col justify-between ${
                            isPrimary
                              ? 'bg-amber-950/30 border-amber-500 shadow-md ring-1 ring-amber-400/40'
                              : 'bg-stone-950/70 border-stone-800 hover:border-stone-700'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-2xl p-1.5 bg-stone-900 border border-stone-800 rounded-xl">
                                  {emote.icon}
                                </span>
                                <div>
                                  <h4 className="text-xs font-bold text-white leading-tight">{emote.name}</h4>
                                  <span className="text-[10px] text-amber-400 font-semibold">{emote.origin}</span>
                                </div>
                              </div>
                              <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-stone-900 text-stone-400 border border-stone-800">
                                {emote.animationKey}
                              </span>
                            </div>

                            <p className="text-[11px] text-stone-400 leading-snug mb-3">
                              {emote.description}
                            </p>
                          </div>

                          <div className="space-y-2 pt-2 border-t border-stone-800/80">
                            {/* Sound & Trigger Button */}
                            <button
                              onClick={() => handleTriggerEmote(emote)}
                              className={`w-full py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                                isPlaying
                                  ? 'bg-amber-400 text-stone-950 font-black animate-pulse'
                                  : 'bg-stone-800 hover:bg-stone-700 text-stone-200'
                              }`}
                            >
                              <Volume2 size={13} className={isPlaying ? 'animate-bounce' : ''} />
                              <span>{isPlaying ? 'Playing Emote...' : 'Test Sound & Pose'}</span>
                            </button>

                            {/* Equip Primary & Assign Quick Slots */}
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  audioEngine.playMinecraftSound('orb');
                                  setCustomData((prev) => ({ ...prev, selectedEmote: emote.id }));
                                }}
                                className={`flex-1 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer border ${
                                  isPrimary
                                    ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300'
                                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-white'
                                }`}
                              >
                                {isPrimary ? '✓ Primary' : 'Set Primary'}
                              </button>

                              {/* Slot Assign Buttons */}
                              <div className="flex items-center gap-0.5">
                                {[0, 1, 2, 3].map((slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => handleAssignQuickEmote(emote.id, slot)}
                                    title={`Assign to Hotbar Slot #${slot + 1}`}
                                    className={`w-6 h-6 text-[10px] font-bold rounded cursor-pointer transition ${
                                      quickSlotIndex === slot
                                        ? 'bg-amber-500 text-stone-950 font-black'
                                        : 'bg-stone-900 text-stone-400 hover:bg-stone-800 hover:text-white border border-stone-800'
                                    }`}
                                  >
                                    {slot + 1}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 9: IDENTITY & TITLES */}
              {activeTab === 'identity' && (
                <div className="space-y-5 max-w-lg">
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                      Custom Avatar Handle / Character Name
                    </label>
                    <input
                      type="text"
                      maxLength={24}
                      value={customData.customName}
                      onChange={(e) => setCustomData((prev) => ({ ...prev, customName: e.target.value }))}
                      className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 font-mono shadow-inner"
                      placeholder="e.g. Steve The Grand Architect"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1.5 uppercase tracking-wider">
                      Hero Title / Honorific Badge
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        'Master Builder',
                        'Countryball Ambassador',
                        'Bloxy Champion',
                        'Slapstick Legend',
                        'Redstone Archon',
                        'Golden Chef',
                        'Expedition Leader',
                        'Aeternum Pioneer',
                        'Solar Tech Master',
                        'Viral Content Lord',
                      ].map((title) => (
                        <button
                          key={title}
                          onClick={() => {
                            audioEngine.playMinecraftSound('click');
                            setCustomData((prev) => ({ ...prev, customTitle: title }));
                          }}
                          className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition border cursor-pointer ${
                            customData.customTitle === title
                              ? 'bg-amber-950/40 border-amber-500 text-amber-300 shadow-sm'
                              : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:text-white'
                          }`}
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reputation / Trader Stats */}
                  <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Merchant Reputation:</span>
                      <span className="text-amber-400 font-bold flex items-center gap-1">
                        <Star size={13} fill="currentColor" /> {customData.reputation.toFixed(1)} / 5.0
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Completed Market Trades:</span>
                      <span className="text-white font-bold">{customData.tradesCompleted} verified</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Cloud Storage Sync:</span>
                      <span className="text-emerald-400 font-bold">
                        {user ? 'Linked to Google UID' : 'Guest Local Storage'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 10: SAVED PRESETS & OUTFITS (SAVE / LOAD SYSTEM) */}
              {activeTab === 'presets' && (
                <div className="space-y-6">
                  {/* Save Current Outfit Section */}
                  <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/30 p-5 rounded-2xl border border-amber-500/40 space-y-4 shadow-lg">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                        <FolderPlus size={16} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Save Current Avatar Creation</h3>
                        <p className="text-xs text-stone-400">Store your current look, gear, dye colors, and class perks as a reloadable preset</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <input
                        type="text"
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                        placeholder="Outfit Name (e.g. Diamond Spelunker, Red Obby Noob)..."
                        className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                        maxLength={32}
                      />

                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(['Minecraft', 'Roblox', 'Countryballs', 'Xilam', 'NZ', 'Brand'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => {
                              audioEngine.playMinecraftSound('click');
                              setNewPresetStyle(style);
                            }}
                            className={`px-2.5 py-2 rounded-xl text-[11px] font-bold transition border cursor-pointer ${
                              newPresetStyle === style
                                ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-sm'
                                : 'bg-stone-950/70 border-stone-800 text-stone-400 hover:text-white'
                            }`}
                          >
                            {style === 'Minecraft' ? '⛏️ MC' : style === 'Roblox' ? '👟 RBX' : style === 'Countryballs' ? '🌐 CB' : style === 'Xilam' ? '💥 Xilam' : style === 'NZ' ? '🌿 NZ' : '⭐ Brand'}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={handleSaveNewPreset}
                        className="mc-btn mc-btn-primary px-4 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-md"
                      >
                        <Save size={14} />
                        <span>Save Outfit</span>
                      </button>
                    </div>
                  </div>

                  {/* Quick Load Archetype Styles */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={13} className="text-amber-400" />
                      <span>Instant Archetype Presets (Minecraft, Roblox, Countryballs, Xilam, NZ)</span>
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {[
                        { style: 'Minecraft', label: 'Minecraft Steve', icon: '⛏️', color: 'border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400', id: 'preset_minecraft_steve' },
                        { style: 'Roblox', label: 'Roblox Obby Master', icon: '👟', color: 'border-red-500/40 bg-red-950/20 hover:border-red-400', id: 'preset_roblox_speedrunner' },
                        { style: 'Countryballs', label: 'Countryball Diplomat', icon: '🌐', color: 'border-blue-500/40 bg-blue-950/20 hover:border-blue-400', id: 'preset_countryballs_diplomat' },
                        { style: 'Xilam', label: 'Xilam Slapstick Brawler', icon: '💥', color: 'border-orange-500/40 bg-orange-950/20 hover:border-orange-400', id: 'preset_xilam_slapstick' },
                        { style: 'NZ', label: 'Kiwi Wayfinder', icon: '🌿', color: 'border-emerald-500/40 bg-emerald-950/20 hover:border-emerald-400', id: 'preset_nz_wayfinder' },
                      ].map((arch) => (
                        <button
                          key={arch.id}
                          onClick={() => {
                            const found = presetsList.find((p) => p.id === arch.id);
                            if (found) handleLoadPreset(found);
                          }}
                          className={`p-3 rounded-2xl border ${arch.color} transition text-left flex flex-col justify-between cursor-pointer group`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl group-hover:scale-110 transition transform">{arch.icon}</span>
                            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{arch.style}</span>
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white group-hover:text-amber-300 transition">{arch.label}</div>
                            <div className="text-[10px] text-stone-400 mt-0.5">Click to Quick Load</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Saved Outfits List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Bookmark size={13} className="text-amber-400" />
                        <span>All Saved Creations ({presetsList.length})</span>
                      </h4>
                      <span className="text-[10px] text-stone-500">Auto-synced to Cloud & Local Cache</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {presetsList.map((preset) => (
                        <div
                          key={preset.id}
                          className="bg-stone-950/80 border border-stone-800 hover:border-amber-500/50 rounded-2xl p-4 flex flex-col justify-between transition gap-3"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-3">
                              <div className="w-10 h-10 rounded-xl bg-stone-900 border border-stone-700 flex items-center justify-center text-xl shrink-0">
                                {preset.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="text-xs font-bold text-white">{preset.name}</h5>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                                    preset.style === 'Minecraft' ? 'bg-cyan-950 text-cyan-400 border border-cyan-800' :
                                    preset.style === 'Roblox' ? 'bg-red-950 text-red-400 border border-red-800' :
                                    preset.style === 'Countryballs' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                                    'bg-amber-950 text-amber-400 border border-amber-800'
                                  }`}>
                                    {preset.style}
                                  </span>
                                </div>
                                <p className="text-[10.5px] text-stone-400 line-clamp-2 mt-1">
                                  {preset.description}
                                </p>
                              </div>
                            </div>

                            {preset.id.startsWith('preset_custom_') && (
                              <button
                                onClick={() => handleDeletePreset(preset.id, preset.name)}
                                title="Delete Preset"
                                className="text-stone-500 hover:text-red-400 p-1 rounded-lg hover:bg-stone-900 transition cursor-pointer"
                              >
                                <Trash2 size={13} />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-900 text-[10px] text-stone-500">
                            <span>Saved: {new Date(preset.createdAt).toLocaleDateString()}</span>
                            <button
                              onClick={() => handleLoadPreset(preset)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-stone-950 border border-amber-500/40 font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <Download size={12} />
                              <span>Load Avatar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Footer */}
            <div className="p-4 bg-stone-950/90 border-t border-stone-800 flex items-center justify-between font-mono">
              <button
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setCustomData(avatarManager.getLocalCustomization());
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white bg-stone-800 hover:bg-stone-700 transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>Reset to Saved</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-stone-400 hover:text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAndEquip}
                  disabled={saving}
                  className="mc-btn mc-btn-primary px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  <Sparkles size={14} className="text-yellow-400" />
                  <span>{saving ? 'Syncing to Cloud...' : 'Save & Equip to Game'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
