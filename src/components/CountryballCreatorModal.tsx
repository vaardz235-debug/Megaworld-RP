import React, { useState } from 'react';
import { 
  X, Globe, Sparkles, Palette, Crown, Play, 
  RotateCcw, Check, Share2, Copy, Volume2, Shield, 
  Rocket, Compass, Star, Eye
} from 'lucide-react';
import { COUNTRYBALLS_DATA, CountryballData } from '../data/countryballsData';
import { avatarManager } from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';
import { speechEngine } from '../utils/speechEngine';
import { countryballAudio } from '../utils/countryballAudioLibrary';
import { progressionManager } from '../utils/progressionManager';

interface CountryballCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onApplyCountryball?: (countryballData: any) => void;
}

export default function CountryballCreatorModal({
  isOpen,
  onClose,
  user,
  onApplyCountryball,
}: CountryballCreatorModalProps) {
  // Step 1: Base Country
  const [selectedBaseCountry, setSelectedBaseCountry] = useState<CountryballData>(COUNTRYBALLS_DATA[0]); // Poland
  const [regionFilter, setRegionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Step 2: Custom Flag & Layout
  const [flagLayout, setFlagLayout] = useState<'preset' | 'horizontal_tri' | 'vertical_tri' | 'nordic_cross' | 'diagonal' | 'canton_stars'>('preset');
  const [colorTop, setColorTop] = useState('#dc2626');
  const [colorMid, setColorMid] = useState('#ffffff');
  const [colorBot, setColorBot] = useState('#2563eb');
  const [isInverted, setIsInverted] = useState(false); // Invert colors (classic Poland rule)

  // Step 3: Polish Eyes & Facial Expressions
  const [eyeStyle, setEyeStyle] = useState<'classic' | 'squint' | 'angry' | 'crying' | 'cool' | 'monocle' | 'anime' | 'sleeping'>('classic');

  // Step 4: Accessories (Hats, Eyewear/Glasses & Props)
  const [selectedHat, setSelectedHat] = useState<string>('hat_none');
  const [selectedGlasses, setSelectedGlasses] = useState<'none' | 'aviators' | 'monocle' | 'glasses_3d' | 'nerd_specs' | 'snow_goggles' | 'cyber_visor' | 'pirate_patch'>('none');
  const [selectedProp, setSelectedProp] = useState<string>('prop_none');
  const [selectedEmblem, setSelectedEmblem] = useState<string>('none');

  // Step 5: Personality Trait (Influences in-game interactions & stats)
  const [personalityTrait, setPersonalityTrait] = useState<'diplomatic' | 'clay_hungry' | 'industrious' | 'jovial' | 'stoic' | 'space_dreamer'>('diplomatic');

  // Step 6: Stereotype Animations & Emotes
  const [activeAnimation, setActiveAnimation] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Base Country filtering
  const filteredCountries = COUNTRYBALLS_DATA.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.capital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = regionFilter === 'all' || c.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  const handleSelectCountry = (cb: CountryballData) => {
    audioEngine.playMinecraftSound('click');
    setSelectedBaseCountry(cb);
    // Suggest default accessories based on country
    if (cb.name === 'Poland') {
      setSelectedHat('hat_plunger');
      setSelectedProp('prop_plunger');
    } else if (cb.name === 'USA') {
      setSelectedHat('hat_sunglasses');
      setSelectedProp('prop_burger_oil');
    } else if (cb.name === 'UK') {
      setSelectedHat('hat_tophat_monocle');
      setSelectedProp('prop_teacup');
    } else if (cb.name === 'France') {
      setSelectedHat('hat_beret');
      setSelectedProp('prop_baguette');
    } else if (cb.name === 'Germany') {
      setSelectedHat('hat_pickelhaube');
      setSelectedProp('prop_wrench');
    } else if (cb.name === 'Japan') {
      setSelectedHat('hat_hachimaki');
      setSelectedProp('prop_katana');
    } else if (cb.name === 'Mexico') {
      setSelectedHat('hat_sombrero');
      setSelectedProp('prop_taco');
    } else if (cb.name === 'New Zealand') {
      setSelectedHat('hat_maori_feather');
      setSelectedProp('prop_pounamu');
    } else if (cb.name === 'Australia') {
      setSelectedHat('hat_cork');
      setSelectedProp('prop_boomerang');
    }
  };

  const handleTriggerEmote = (emoteKey: string) => {
    setActiveAnimation(emoteKey);
    audioEngine.playMinecraftSound('orb');

    if (emoteKey === 'cannot_into_space') {
      speechEngine.speak(
        { id: 999, name: selectedBaseCountry.name, type: 'countryball', color: '#fff', flag: '' },
        'Poland CANNOT into space! ...Why universe is so cruel?! Kurwa!'
      );
    } else if (emoteKey === 'oil_screech') {
      speechEngine.speak(
        { id: 999, name: selectedBaseCountry.name, type: 'countryball', color: '#fff', flag: '' },
        'DID SOMEBODY SAY OOOIIIL?! Freedom delivery inbound right now!'
      );
    } else if (emoteKey === 'tea_time') {
      speechEngine.speak(
        { id: 999, name: selectedBaseCountry.name, type: 'countryball', color: '#fff', flag: '' },
        'Splendid afternoon for a proper Earl Grey, pip pip cheerio!'
      );
    } else if (emoteKey === 'haka_stomp') {
      speechEngine.speak(
        { id: 999, name: selectedBaseCountry.name, type: 'countryball', color: '#fff', flag: '' },
        'Ka mate, ka mate! Ka ora, ka ora! Tenei te tangata puhuruhuru!'
      );
    } else if (emoteKey === 'guten_tag') {
      speechEngine.speak(
        { id: 999, name: selectedBaseCountry.name, type: 'countryball', color: '#fff', flag: '' },
        'Guten Tag! Work efficiency must increase by exactly 43.7%!'
      );
    } else if (emoteKey === 'hon_hon') {
      speechEngine.speak(
        { id: 999, name: selectedBaseCountry.name, type: 'countryball', color: '#fff', flag: '' },
        'Hon hon hon! En garde with fresh crunchy baguette!'
      );
    }

    setTimeout(() => {
      setActiveAnimation(null);
    }, 2800);
  };

  const handleApplyToAvatar = () => {
    audioEngine.playMinecraftSound('levelup');

    const customData = avatarManager.getLocalCustomization();
    const updatedCustom = {
      ...customData,
      baseCharacterId: selectedBaseCountry.id,
      baseType: 'countryball' as const,
      bodyType: 'countryball_sphere',
      customName: `${selectedBaseCountry.commonName} (${personalityTrait})`,
      customTitle: `Sovereign ${selectedBaseCountry.region} Delegate`,
      selectedHat: selectedHat === 'hat_none' ? 'hat_none' : selectedHat,
      selectedFace: selectedGlasses !== 'none' ? `glasses_${selectedGlasses}` : eyeStyle === 'monocle' ? 'face_monocle' : eyeStyle === 'cool' ? 'face_shades' : 'face_shades',
      selectedEmblem: 'emblem_countryball',
      selectedAura: 'aura_none',
    };

    avatarManager.saveToCloud(user?.uid || 'guest-player', updatedCustom);

    // Save to cross-platform progression manager
    progressionManager.setCountryballCustomization({
      baseCountryName: selectedBaseCountry.name,
      flagLayout,
      colorTop,
      colorMid,
      colorBot,
      isInverted,
      eyeStyle,
      hat: selectedHat,
      glasses: selectedGlasses,
      prop: selectedProp,
      personalityTrait,
    }, user?.uid);

    progressionManager.addXp(35, `Forged ${selectedBaseCountry.name}ball with ${personalityTrait} trait`);

    if (onApplyCountryball) {
      onApplyCountryball({
        id: selectedBaseCountry.id,
        name: selectedBaseCountry.name,
        type: 'countryball',
        flag: getFlagBackground(),
        color: 'bg-white',
        countryballTrait: personalityTrait,
        countryballGlasses: selectedGlasses,
        customHat: selectedHat !== 'hat_none' ? selectedHat : undefined,
        description: `Sovereign ${selectedBaseCountry.commonName} with ${personalityTrait.replace('_', ' ')} personality.`,
      });
    }

    showToast(`🌟 Successfully equipped ${selectedBaseCountry.commonName} with ${personalityTrait} trait!`);
  };

  const handleExportCode = () => {
    const code = `CB-${selectedBaseCountry.name.toUpperCase().substring(0, 3)}-${eyeStyle.toUpperCase()}-${Math.floor(Math.random() * 8999 + 1000)}`;
    navigator.clipboard.writeText(code);
    showToast(`📋 Copied Countryball Passport Code "${code}" to clipboard!`);
    audioEngine.playMinecraftSound('pop');
  };

  // Flag background gradient generator
  const getFlagBackground = () => {
    if (flagLayout === 'preset') {
      return isInverted
        ? 'linear-gradient(to bottom, #ffffff 50%, #dc2626 50%)'
        : selectedBaseCountry.flag;
    }
    if (flagLayout === 'horizontal_tri') {
      return `linear-gradient(to bottom, ${colorTop} 33.3%, ${colorMid} 33.3%, ${colorMid} 66.6%, ${colorBot} 66.6%)`;
    }
    if (flagLayout === 'vertical_tri') {
      return `linear-gradient(to right, ${colorTop} 33.3%, ${colorMid} 33.3%, ${colorMid} 66.6%, ${colorBot} 66.6%)`;
    }
    if (flagLayout === 'diagonal') {
      return `linear-gradient(135deg, ${colorTop} 50%, ${colorBot} 50%)`;
    }
    if (flagLayout === 'nordic_cross') {
      return `radial-gradient(circle at 35% 50%, ${colorMid} 18%, ${colorTop} 19%)`;
    }
    return `linear-gradient(to bottom, ${colorTop} 50%, ${colorBot} 50%)`;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-mono select-none overflow-y-auto">
      <div className="bg-stone-900 border-2 border-blue-500 rounded-3xl w-full max-w-5xl shadow-[0_20px_70px_rgba(59,130,246,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white border-b-2 border-blue-400">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-white/20 border-2 border-white rounded-full flex items-center justify-center text-2xl shadow-inner">
              🌐
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Official Polandball & Countryball Creator
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-yellow-400 text-stone-950 border border-white">
                  Canon Studio
                </span>
              </h2>
              <p className="text-xs text-blue-100">
                Design custom sovereign sphere avatars, stereotype props & authentic cultural emotes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white hover:bg-blue-800 p-2 rounded-xl transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="bg-yellow-400 text-stone-950 px-4 py-2 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-md">
            <Sparkles size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="flex-1 p-5 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* ================= LEFT COLUMN: LIVE COUNTRYBALL VIEWPORT ================= */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between bg-stone-950 p-5 rounded-3xl border border-stone-800 shadow-inner">
            <div className="w-full flex justify-between items-center text-xs text-stone-400 pb-2 border-b border-stone-800">
              <span className="text-blue-400 font-bold">Live Spherical Physics Rig</span>
              <span>{selectedBaseCountry.officialName}</span>
            </div>

            {/* Sphere & Accessories Stage */}
            <div className="relative w-56 h-56 my-6 flex items-center justify-center">
              {/* Animation Flare Shockwave */}
              {activeAnimation && (
                <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-75 pointer-events-none" />
              )}

              {/* Hat Piece (Mounted on Top) */}
              {selectedHat !== 'hat_none' && (
                <div className="absolute -top-6 z-30 text-5xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)] animate-bounce">
                  {selectedHat === 'hat_plunger' && '🪠'}
                  {selectedHat === 'hat_sunglasses' && '🕶️'}
                  {selectedHat === 'hat_tophat_monocle' && '🎩'}
                  {selectedHat === 'hat_beret' && '🎨'}
                  {selectedHat === 'hat_pickelhaube' && '🪖'}
                  {selectedHat === 'hat_sombrero' && '👒'}
                  {selectedHat === 'hat_cork' && '🤠'}
                  {selectedHat === 'hat_hachimaki' && '🥋'}
                  {selectedHat === 'hat_maori_feather' && '🪶'}
                  {selectedHat === 'hat_space_helmet' && '🧑‍🚀'}
                </div>
              )}

              {/* Sovereign Sphere Body */}
              <div
                className={`w-44 h-44 rounded-full border-4 border-black relative overflow-hidden shadow-[0_12px_24px_rgba(0,0,0,0.8)] transition-all duration-300 ${
                  activeAnimation === 'cannot_into_space' ? 'translate-y-4 rotate-12 scale-95' :
                  activeAnimation === 'oil_screech' ? 'scale-110 -rotate-6' :
                  activeAnimation === 'haka_stomp' ? 'scale-105 -translate-y-2' : ''
                }`}
                style={{ background: getFlagBackground() }}
              >
                {/* 3D Curvature Highlight Sheen */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-black/40 via-transparent to-white/30 pointer-events-none" />

                {/* Classic Pure White Oval Eyes */}
                <div className="absolute inset-0 flex items-center justify-center gap-3 z-10">
                  {eyeStyle === 'classic' && (
                    <>
                      <div className="w-8 h-10 bg-white rounded-full border-2 border-black rotate-[-6deg] shadow-sm" />
                      <div className="w-8 h-10 bg-white rounded-full border-2 border-black rotate-[6deg] shadow-sm" />
                    </>
                  )}
                  {eyeStyle === 'squint' && (
                    <>
                      <div className="w-8 h-4 bg-white rounded-full border-2 border-black rotate-[-12deg]" />
                      <div className="w-8 h-4 bg-white rounded-full border-2 border-black rotate-[12deg]" />
                    </>
                  )}
                  {eyeStyle === 'angry' && (
                    <>
                      <div className="w-8 h-7 bg-white rounded-t-full border-2 border-black rotate-[-18deg]" />
                      <div className="w-8 h-7 bg-white rounded-t-full border-2 border-black rotate-[18deg]" />
                    </>
                  )}
                  {eyeStyle === 'crying' && (
                    <>
                      <div className="w-8 h-10 bg-white rounded-full border-2 border-black relative">
                        <span className="absolute -bottom-3 left-1 text-sm">💧</span>
                      </div>
                      <div className="w-8 h-10 bg-white rounded-full border-2 border-black relative">
                        <span className="absolute -bottom-3 right-1 text-sm">💧</span>
                      </div>
                    </>
                  )}
                  {eyeStyle === 'cool' && (
                    <div className="text-4xl -mt-2">🕶️</div>
                  )}
                  {eyeStyle === 'monocle' && (
                    <>
                      <div className="w-8 h-10 bg-white rounded-full border-2 border-black shadow-sm" />
                      <div className="w-9 h-11 bg-white/70 rounded-full border-2 border-amber-400 relative flex items-center justify-center">
                        <div className="w-full h-0.5 bg-amber-400 absolute bottom-0 -right-2 rotate-45" />
                      </div>
                    </>
                  )}
                  {eyeStyle === 'anime' && (
                    <>
                      <div className="w-9 h-11 bg-white rounded-full border-2 border-black flex items-center justify-center text-xs">✨</div>
                      <div className="w-9 h-11 bg-white rounded-full border-2 border-black flex items-center justify-center text-xs">✨</div>
                    </>
                  )}
                  {eyeStyle === 'sleeping' && (
                    <div className="flex flex-col items-center">
                      <div className="flex gap-4">
                        <div className="w-7 h-1.5 bg-black rounded-full" />
                        <div className="w-7 h-1.5 bg-black rounded-full" />
                      </div>
                      <span className="text-xs text-blue-400 font-bold mt-1">Zzz...</span>
                    </div>
                  )}
                </div>

                {/* Custom Glasses / Eyewear Overlay */}
                {selectedGlasses !== 'none' && (
                  <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                    {selectedGlasses === 'aviators' && <span className="text-4xl filter drop-shadow">🕶️</span>}
                    {selectedGlasses === 'monocle' && (
                      <div className="absolute top-12 right-8 w-8 h-8 border-2 border-amber-400 rounded-full shadow-sm">
                        <div className="w-3 h-5 border-r-2 border-amber-400 absolute -bottom-3 right-0" />
                      </div>
                    )}
                    {selectedGlasses === 'glasses_3d' && (
                      <div className="flex gap-2 items-center">
                        <div className="w-7 h-5 bg-red-600/80 border-2 border-white rounded-xs" />
                        <div className="w-7 h-5 bg-cyan-500/80 border-2 border-white rounded-xs" />
                      </div>
                    )}
                    {selectedGlasses === 'nerd_specs' && <span className="text-4xl filter drop-shadow">👓</span>}
                    {selectedGlasses === 'snow_goggles' && <span className="text-4xl filter drop-shadow">🥽</span>}
                    {selectedGlasses === 'cyber_visor' && (
                      <div className="w-24 h-3.5 bg-cyan-400 border border-white rounded-full shadow-lg shadow-cyan-400/80 animate-pulse" />
                    )}
                    {selectedGlasses === 'pirate_patch' && (
                      <div className="absolute top-12 right-8 w-8 h-8 bg-black border-2 border-stone-800 rounded-full flex items-center justify-center text-xs text-white font-bold">
                        ☠️
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Handheld Prop (Right Flank) */}
              {selectedProp !== 'prop_none' && (
                <div className="absolute -bottom-2 -right-4 z-30 text-5xl filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.8)]">
                  {selectedProp === 'prop_plunger' && '🪠'}
                  {selectedProp === 'prop_burger_oil' && '🍔'}
                  {selectedProp === 'prop_teacup' && '☕'}
                  {selectedProp === 'prop_baguette' && '🥖'}
                  {selectedProp === 'prop_wrench' && '🔧'}
                  {selectedProp === 'prop_katana' && '⚔️'}
                  {selectedProp === 'prop_taco' && '🌮'}
                  {selectedProp === 'prop_pounamu' && '🟢'}
                  {selectedProp === 'prop_boomerang' && '🪃'}
                </div>
              )}
            </div>

            {/* Cultural Motto & Polish Lore Card */}
            <div className="w-full bg-stone-900/80 p-3.5 rounded-2xl border border-stone-800 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-yellow-300">"{selectedBaseCountry.motto}"</span>
                <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-500/40">
                  {selectedBaseCountry.region}
                </span>
              </div>
              <p className="text-stone-300 italic text-[11px] leading-relaxed">
                "{selectedBaseCountry.polandballQuote}"
              </p>
              <div className="text-[10.5px] text-emerald-400 font-mono">
                🎁 Perk: {selectedBaseCountry.lorePerk}
              </div>
            </div>

            {/* Active Personality Trait Card */}
            <div className="w-full bg-stone-900/90 p-3 rounded-2xl border border-stone-800 text-xs mt-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Personality Trait</span>
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                  {personalityTrait === 'diplomatic' && '🕊️ Diplomatic'}
                  {personalityTrait === 'clay_hungry' && '⚔️ Clay-Hungry'}
                  {personalityTrait === 'industrious' && '⚙️ Industrious'}
                  {personalityTrait === 'jovial' && '🎉 Jovial'}
                  {personalityTrait === 'stoic' && '🛡️ Stoic'}
                  {personalityTrait === 'space_dreamer' && '🚀 Space Dreamer'}
                </span>
              </div>
              <p className="text-[11px] text-stone-300 mt-1 leading-snug">
                {personalityTrait === 'diplomatic' && '+25% Trade Rep • 15% Brand Hub Shop Discount • Polite NPC interactions'}
                {personalityTrait === 'clay_hungry' && '+20% Melee Attack Damage • Intimidates hostile mobs • Bold battle cries'}
                {personalityTrait === 'industrious' && '+25% Mining Speed • Double resource harvest drops • Engineering buffs'}
                {personalityTrait === 'jovial' && '+15% Move Speed • Holiday cheer aura buffs nearby players • Comedic dialogue'}
                {personalityTrait === 'stoic' && '+25% Defense Armor • Immune to knockback • 50% environmental damage reduction'}
                {personalityTrait === 'space_dreamer' && '+30% Landmark Discovery XP • Higher jump height • Celestial curiosity'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full pt-4 flex gap-2">
              <button
                onClick={handleApplyToAvatar}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition shadow flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                <Check size={14} />
                <span>Apply as Playable Avatar</span>
              </button>

              <button
                onClick={handleExportCode}
                className="p-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl transition cursor-pointer border border-stone-700"
                title="Share Countryball Code"
              >
                <Share2 size={16} />
              </button>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: CUSTOMIZATION CONTROLS ================= */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            {/* Step 1: Base Sovereign Country Selection */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Globe size={14} className="text-blue-400" />
                  1. Select Base Sovereign Country ({filteredCountries.length}):
                </h3>

                {/* Region Filter */}
                <div className="flex gap-1 overflow-x-auto text-[10px]">
                  {['all', 'Europe', 'Americas', 'Asia', 'Oceania'].map(reg => (
                    <button
                      key={reg}
                      onClick={() => setRegionFilter(reg)}
                      className={`px-2 py-0.5 rounded capitalize ${
                        regionFilter === reg ? 'bg-blue-600 text-white' : 'bg-stone-900 text-stone-400 hover:text-white'
                      }`}
                    >
                      {reg}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country Selection Pill Scroller */}
              <div className="flex gap-2 overflow-x-auto pb-1">
                {filteredCountries.slice(0, 16).map(cb => (
                  <button
                    key={cb.id}
                    onClick={() => handleSelectCountry(cb)}
                    className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 shrink-0 transition cursor-pointer ${
                      selectedBaseCountry.id === cb.id
                        ? 'bg-blue-600 text-white border-blue-400 shadow'
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span>{cb.name === 'Poland' ? '🇵🇱' : cb.name === 'USA' ? '🇺🇸' : cb.name === 'UK' ? '🇬🇧' : cb.name === 'Germany' ? '🇩🇪' : cb.name === 'Japan' ? '🇯🇵' : '🌐'}</span>
                    <span className="font-bold">{cb.commonName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Flag Layout & Inversion Rules */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-white flex items-center gap-1.5">
                  <Palette size={14} className="text-pink-400" />
                  2. Flag Pattern & Canon Inversion Rule:
                </h3>
                <label className="flex items-center gap-1.5 text-[11px] text-yellow-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isInverted}
                    onChange={(e) => setIsInverted(e.target.checked)}
                    className="rounded accent-blue-500"
                  />
                  <span>Canon Polandball Invert (Red on Top)</span>
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'preset', label: 'Canon Flag' },
                  { id: 'horizontal_tri', label: 'Tricolor (H)' },
                  { id: 'vertical_tri', label: 'Tricolor (V)' },
                  { id: 'nordic_cross', label: 'Nordic Cross' },
                  { id: 'diagonal', label: 'Diagonal Split' },
                  { id: 'canton_stars', label: 'Canton / Stars' },
                ].map(layout => (
                  <button
                    key={layout.id}
                    onClick={() => setFlagLayout(layout.id as any)}
                    className={`p-2 rounded-xl border text-center font-bold text-[10.5px] transition cursor-pointer ${
                      flagLayout === layout.id ? 'bg-blue-600 text-white border-blue-400' : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>

              {flagLayout !== 'preset' && (
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-[11px] text-stone-400 flex items-center gap-1">
                    Top: <input type="color" value={colorTop} onChange={e => setColorTop(e.target.value)} className="w-6 h-6 rounded border border-stone-700 bg-transparent cursor-pointer" />
                  </label>
                  <label className="text-[11px] text-stone-400 flex items-center gap-1">
                    Mid: <input type="color" value={colorMid} onChange={e => setColorMid(e.target.value)} className="w-6 h-6 rounded border border-stone-700 bg-transparent cursor-pointer" />
                  </label>
                  <label className="text-[11px] text-stone-400 flex items-center gap-1">
                    Bot: <input type="color" value={colorBot} onChange={e => setColorBot(e.target.value)} className="w-6 h-6 rounded border border-stone-700 bg-transparent cursor-pointer" />
                  </label>
                </div>
              )}
            </div>

            {/* Step 3: Polish Eyes Expressions */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Eye size={14} className="text-yellow-400" />
                3. Spherical Eyes & Expressions:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'classic', label: 'Classic Ovals (Canon)' },
                  { id: 'squint', label: 'Suspicious Squint' },
                  { id: 'angry', label: 'Angry Clay Claim' },
                  { id: 'crying', label: 'Weeping / Kurwa!' },
                  { id: 'cool', label: 'Freedom Shades 🕶️' },
                  { id: 'monocle', label: 'Aristocrat Monocle 🧐' },
                  { id: 'anime', label: 'Anime Sparkle ✨' },
                  { id: 'sleeping', label: 'Siesta / Sleep Zzz' },
                ].map(eye => (
                  <button
                    key={eye.id}
                    onClick={() => setEyeStyle(eye.id as any)}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer ${
                      eyeStyle === eye.id ? 'bg-blue-600 text-white border-blue-400' : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {eye.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Cultural Hats & Headgear */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Crown size={14} className="text-amber-400" />
                4. Cultural Hats & Headwear:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'hat_none', label: 'No Hat (Pure Sphere)' },
                  { id: 'hat_plunger', label: 'Plunger 🪠 (Poland)' },
                  { id: 'hat_sunglasses', label: 'Aviators 🕶️ (USA)' },
                  { id: 'hat_tophat_monocle', label: 'Top Hat 🎩 (UK)' },
                  { id: 'hat_beret', label: 'Beret 🎨 (France)' },
                  { id: 'hat_pickelhaube', label: 'Pickelhaube 🪖 (Germany)' },
                  { id: 'hat_sombrero', label: 'Sombrero 👒 (Mexico)' },
                  { id: 'hat_cork', label: 'Cork Hat 🤠 (Australia)' },
                  { id: 'hat_hachimaki', label: 'Hachimaki 🥋 (Japan)' },
                  { id: 'hat_maori_feather', label: 'Huia Feather 🪶 (NZ)' },
                  { id: 'hat_space_helmet', label: 'Space Helmet 🧑‍🚀 (Cannot)' },
                ].map(hat => (
                  <button
                    key={hat.id}
                    onClick={() => setSelectedHat(hat.id)}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer truncate ${
                      selectedHat === hat.id ? 'bg-blue-600 text-white border-blue-400' : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {hat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4b: Glasses & Eyewear Accessories */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Eye size={14} className="text-cyan-400" />
                4b. Eyewear & Glasses Accessories:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'No Glasses' },
                  { id: 'aviators', label: 'Cool Aviators 🕶️' },
                  { id: 'monocle', label: 'Aristocrat Monocle 🧐' },
                  { id: 'glasses_3d', label: '3D Retro Glasses 🔴🔵' },
                  { id: 'nerd_specs', label: 'Nerd Specs 👓' },
                  { id: 'snow_goggles', label: 'Winter Goggles 🥽' },
                  { id: 'cyber_visor', label: 'Cyber Visor 👾' },
                  { id: 'pirate_patch', label: 'Pirate Eyepatch 🏴‍☠️' },
                ].map(g => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGlasses(g.id as any)}
                    className={`p-2 rounded-xl border text-center font-bold text-[11px] transition cursor-pointer truncate ${
                      selectedGlasses === g.id ? 'bg-cyan-600 text-white border-cyan-400' : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4c: Personality Trait & In-Game Influences */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Star size={14} className="text-yellow-400" />
                4c. Personality Trait (Influences Dialogue & In-Game Stats):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { 
                    id: 'diplomatic', 
                    title: '🕊️ Diplomatic Negotiator', 
                    buff: '+25% Trade Rep • 15% Brand Hub Shop Discount • Friendly NPC responses' 
                  },
                  { 
                    id: 'clay_hungry', 
                    title: '⚔️ Clay Conqueror (GIB CLAY!)', 
                    buff: '+20% Melee Damage • Intimidates hostile mobs • Bold war cries' 
                  },
                  { 
                    id: 'industrious', 
                    title: '⚙️ Efficiency Engineer', 
                    buff: '+25% Mining Speed • Double raw mineral yield • Engineering buffs' 
                  },
                  { 
                    id: 'jovial', 
                    title: '🎉 Fiesta Spirit', 
                    buff: '+15% Move Speed • Holiday cheer aura inspires surrounding players' 
                  },
                  { 
                    id: 'stoic', 
                    title: '🛡️ Unshakable Fortress', 
                    buff: '+25% Armor Defense • Immune to knockback • 50% environmental damage resistance' 
                  },
                  { 
                    id: 'space_dreamer', 
                    title: '🚀 Space Dreamer (Cannot Yet)', 
                    buff: '+30% Landmark Discovery XP • Higher jump height • Celestial curiosity' 
                  },
                ].map(trait => (
                  <button
                    key={trait.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setPersonalityTrait(trait.id as any);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                      personalityTrait === trait.id 
                        ? 'bg-yellow-950/60 text-white border-yellow-400 ring-1 ring-yellow-400/50' 
                        : 'bg-stone-900 text-stone-300 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <span className="font-bold text-xs">{trait.title}</span>
                    <span className="text-[10px] text-stone-400 mt-1 leading-snug">{trait.buff}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Stereotype Animations & Emotes */}
            <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2.5">
              <h3 className="font-bold text-white flex items-center gap-1.5">
                <Play size={14} className="text-emerald-400" />
                5. Stereotype Emotes & Cultural Voice Lines:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'cannot_into_space', label: '🚀 Cannot Into Space!', desc: 'Sad rocket fizzle & Kurwa cry' },
                  { id: 'oil_screech', label: '🦅 Did Somebody Say OIL?!', desc: 'Eagle screech & freedom shock' },
                  { id: 'tea_time', label: '☕ Proper British Tea Time', desc: 'Pinky sip & monocle sparkle' },
                  { id: 'guten_tag', label: '⚙️ Guten Tag Efficiency', desc: 'Gears spin & blueprint logic' },
                  { id: 'haka_stomp', label: '🌿 Haka Ancestral Stomp', desc: 'Warrior shout & earth rumble' },
                  { id: 'hon_hon', label: '🥖 Baguette Fencing Duel', desc: 'Crunchy bread swordplay' },
                ].map(emote => (
                  <button
                    key={emote.id}
                    onClick={() => handleTriggerEmote(emote.id)}
                    className="p-2.5 bg-stone-900 hover:bg-stone-800 border border-stone-800 hover:border-emerald-500 rounded-xl text-left transition cursor-pointer flex flex-col justify-between"
                  >
                    <span className="font-bold text-white text-xs">{emote.label}</span>
                    <span className="text-[10px] text-stone-400 mt-1">{emote.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
