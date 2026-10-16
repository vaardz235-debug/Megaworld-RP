import { useState } from 'react';
import { CountryballData } from '../data/countryballsData';
import CharacterAvatar from './CharacterAvatar';
import { 
  X, 
  Shield, 
  Pickaxe, 
  Sparkles, 
  Atom, 
  Zap, 
  Rocket, 
  BookOpen, 
  Volume2, 
  ChevronLeft, 
  ChevronRight, 
  Globe, 
  MapPin, 
  Calendar, 
  Award,
  ExternalLink
} from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

interface CountryballDossierModalProps {
  countryball: CountryballData | null;
  onClose: () => void;
  onSelect: (char: any) => void;
  allCountryballs: CountryballData[];
  onNavigate: (cb: CountryballData) => void;
}

export function CountryballDossierModal({
  countryball,
  onClose,
  onSelect,
  allCountryballs,
  onNavigate,
}: CountryballDossierModalProps) {
  const [activeTab, setActiveTab] = useState<'facts' | 'stats' | 'lore'>('facts');
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!countryball) return null;

  const currentIndex = allCountryballs.findIndex(c => c.id === countryball.id);
  const prevCb = currentIndex > 0 ? allCountryballs[currentIndex - 1] : allCountryballs[allCountryballs.length - 1];
  const nextCb = currentIndex < allCountryballs.length - 1 ? allCountryballs[currentIndex + 1] : allCountryballs[0];

  const handleSpeak = () => {
    setIsSpeaking(true);
    const quote = countryball.polandballQuote;
    speechEngine.speak(
      {
        id: countryball.id,
        name: countryball.name,
        type: 'countryball',
        color: countryball.color,
        flag: countryball.flag,
      },
      quote,
      () => setIsSpeaking(false)
    );
  };

  const statItems = [
    { label: 'Defense & Fortifications', value: countryball.stats.defense, icon: Shield, color: 'text-emerald-400', barBg: 'bg-emerald-500' },
    { label: 'Mining & Resource Extraction', value: countryball.stats.mining, icon: Pickaxe, color: 'text-amber-400', barBg: 'bg-amber-500' },
    { label: 'Culture & Gastronomy', value: countryball.stats.culture, icon: Sparkles, color: 'text-pink-400', barBg: 'bg-pink-500' },
    { label: 'Science & Innovation', value: countryball.stats.science, icon: Atom, color: 'text-cyan-400', barBg: 'bg-cyan-500' },
    { label: 'Agility & Logistics Speed', value: countryball.stats.speed, icon: Zap, color: 'text-yellow-400', barBg: 'bg-yellow-500' },
    { 
      label: 'Space Program Capability', 
      value: countryball.stats.space, 
      icon: Rocket, 
      color: countryball.stats.space === 0 ? 'text-red-400' : 'text-purple-400', 
      barBg: countryball.stats.space === 0 ? 'bg-red-500' : 'bg-purple-500',
      note: countryball.stats.space === 0 ? '0% (CANNOT INTO SPACE!)' : undefined
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md select-none overflow-y-auto">
      <div 
        className="relative w-full max-w-3xl bg-stone-950 border border-stone-800 rounded-3xl shadow-[0_20px_70px_rgba(0,0,0,0.95)] overflow-hidden font-mono text-white flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Header with Flag Gradient */}
        <div 
          className="h-28 sm:h-32 w-full relative flex items-end p-4 sm:p-6"
          style={{
            background: countryball.flag || countryball.color || '#1e3a8a',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Subtle dark contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-black/30 pointer-events-none" />

          {/* Top navigation controls */}
          <div className="absolute top-3.5 inset-x-4 flex items-center justify-between z-20">
            <div className="flex items-center gap-1.5 bg-black/65 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs">
              <Globe size={13} className="text-amber-400" />
              <span className="font-bold text-white">{countryball.region}</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-300">{countryball.capital}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate(prevCb)}
                className="p-1.5 bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white rounded-full border border-white/20 transition cursor-pointer"
                title={`Previous: ${prevCb.name}`}
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={() => onNavigate(nextCb)}
                className="p-1.5 bg-black/60 hover:bg-black/90 text-stone-300 hover:text-white rounded-full border border-white/20 transition cursor-pointer"
                title={`Next: ${nextCb.name}`}
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 bg-black/60 hover:bg-red-600 text-stone-300 hover:text-white rounded-full border border-white/20 transition cursor-pointer ml-1"
                title="Close dossier"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Title in Header */}
          <div className="relative z-10">
            <div className="text-[11px] uppercase tracking-wider text-amber-300 font-bold flex items-center gap-1.5">
              <span>National Archive Dossier</span>
              <span className="text-stone-400">·</span>
              <span className="text-stone-300">№ {countryball.id}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              {countryball.officialName} ({countryball.commonName})
            </h2>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 flex flex-col gap-5">
          {/* Main Hero Bar: Avatar + Catchphrase + Quick Action */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-2xl bg-stone-900/90 border border-stone-800">
            {/* Interactive Countryball Avatar preview */}
            <div className="w-24 h-24 flex items-center justify-center bg-stone-950/80 rounded-2xl border border-stone-800 shrink-0 relative group">
              <CharacterAvatar
                character={{
                  id: countryball.id,
                  name: countryball.name,
                  type: 'countryball',
                  color: countryball.color,
                  flag: countryball.flag,
                }}
                size="lg"
                isWalking={true}
                isTalking={isSpeaking}
                speechText={isSpeaking ? countryball.polandballQuote : undefined}
              />
            </div>

            {/* Quote & Motto Section */}
            <div className="flex-1 flex flex-col justify-between text-center sm:text-left">
              <div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-400 font-bold mb-1">
                  <span>Polandball Catchphrase</span>
                </div>
                <p className="text-sm sm:text-base font-bold text-amber-200 italic leading-snug">
                  "{countryball.polandballQuote}"
                </p>
                <p className="text-xs text-stone-400 mt-1">
                  Motto: <span className="text-stone-300">{countryball.motto}</span>
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleSpeak}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                >
                  <Volume2 size={13} className={isSpeaking ? 'animate-bounce text-amber-400' : ''} />
                  <span>{isSpeaking ? '🗣️ Speaking...' : '🗣️ Hear Catchphrase'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelect({
                      id: countryball.id,
                      name: countryball.name,
                      type: 'countryball',
                      color: countryball.color,
                      flag: countryball.flag,
                      description: countryball.lorePerk,
                    });
                    onClose();
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                >
                  <span>Select {countryball.name} to Play</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('facts')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'facts' 
                  ? 'bg-amber-500 text-black shadow' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <BookOpen size={13} />
              <span>Historical Facts</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('stats')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'stats' 
                  ? 'bg-amber-500 text-black shadow' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Award size={13} />
              <span>National Stats & Space</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lore')}
              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'lore' 
                  ? 'bg-amber-500 text-black shadow' 
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sparkles size={13} />
              <span>Polandball Lore & In-Game Buff</span>
            </button>
          </div>

          {/* TAB 1: HISTORICAL FACTS */}
          {activeTab === 'facts' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-xs text-stone-400 border-b border-stone-800 pb-2">
                <div className="flex items-center gap-1.5">
                  <Calendar size={13} className="text-amber-400" />
                  <span>Historical Era:</span>
                  <span className="font-bold text-stone-200">{countryball.historicalEra}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-amber-400" />
                  <span>Capital:</span>
                  <span className="font-bold text-stone-200">{countryball.capital}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                {countryball.historicalFacts.map((fact, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-stone-900/60 border border-stone-800/80 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed">
                      {fact}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: NATIONAL STATS & SPACE PROGRAM */}
          {activeTab === 'stats' && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {statItems.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className="p-3 rounded-2xl bg-stone-900/70 border border-stone-800 flex flex-col justify-between gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <Icon size={14} className={item.color} />
                          <span className="font-bold text-stone-200">{item.label}</span>
                        </div>
                        <span className={`font-black ${item.color}`}>
                          {item.note ? item.note : `${item.value}/100`}
                        </span>
                      </div>

                      {/* Stat Progress Bar */}
                      <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                        <div 
                          className={`h-full ${item.barBg} transition-all duration-700`}
                          style={{ width: `${item.value}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {countryball.name === 'Poland' && (
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                  <span className="text-base">🚀</span>
                  <span><strong>Polandball Canon Law:</strong> Poland has 0 Space capability because "Poland cannot into space"!</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: POLANDBALL LORE & IN-GAME BUFF */}
          {activeTab === 'lore' && (
            <div className="flex flex-col gap-3">
              <div className="p-3.5 rounded-2xl bg-stone-900/70 border border-stone-800">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block mb-1">
                  Polandball Community Meme Lore
                </span>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {countryball.polandballTrivia}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                  <Award size={14} />
                  <span>Minecraft In-Game Active Perk</span>
                </span>
                <p className="text-xs text-emerald-200 font-bold leading-relaxed">
                  {countryball.lorePerk}
                </p>
                <p className="text-[11px] text-stone-400 mt-1">
                  Iconic Accessory: <span className="text-stone-300">{countryball.iconicProp}</span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 sm:p-4 bg-stone-900/90 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span className="text-stone-400">
            Use <strong>←</strong> and <strong>→</strong> buttons to browse all 48 Countryballs
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Micro hover tooltip / preview card component for Countryballs
 */
export function CountryballHoverPreview({
  countryball,
  onInspect,
}: {
  countryball: CountryballData;
  onInspect: () => void;
}) {
  return (
    <div 
      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 bg-stone-950/95 border-2 border-amber-500/70 rounded-2xl p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.95)] z-50 text-left font-mono pointer-events-auto backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
      onClick={(e) => {
        e.stopPropagation();
        onInspect();
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-white">{countryball.name}</span>
            <span className="text-[10px] text-stone-400">({countryball.commonName})</span>
          </div>
          <span className="text-[10px] text-amber-300 block">Cap: {countryball.capital} · {countryball.historicalEra}</span>
        </div>
        <span className="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shrink-0">
          {countryball.region}
        </span>
      </div>

      {/* Quote */}
      <p className="text-[11px] text-amber-200 italic line-clamp-2 mb-2 font-medium bg-stone-900/60 p-1.5 rounded-lg border border-stone-800">
        "{countryball.polandballQuote}"
      </p>

      {/* Primary Historical Fact Peek */}
      <div className="mb-2 p-2 rounded-xl bg-stone-900/90 border border-stone-800 text-[10px] text-stone-300 leading-snug">
        <span className="text-amber-400 font-bold flex items-center gap-1 text-[9px] uppercase tracking-wider mb-0.5">
          <BookOpen size={10} />
          <span>Historical Fact</span>
        </span>
        <span className="line-clamp-2">{countryball.historicalFacts[0]}</span>
      </div>

      {/* Mini Stats Grid */}
      <div className="grid grid-cols-3 gap-1.5 mb-2.5 text-[10px]">
        <div className="bg-stone-900/90 p-1.5 rounded-lg border border-stone-800 text-center">
          <span className="text-stone-400 block text-[8px] font-bold">DEFENSE</span>
          <span className="text-emerald-400 font-black">{countryball.stats.defense}/100</span>
        </div>
        <div className="bg-stone-900/90 p-1.5 rounded-lg border border-stone-800 text-center">
          <span className="text-stone-400 block text-[8px] font-bold">MINING</span>
          <span className="text-amber-400 font-black">{countryball.stats.mining}/100</span>
        </div>
        <div className="bg-stone-900/90 p-1.5 rounded-lg border border-stone-800 text-center">
          <span className="text-stone-400 block text-[8px] font-bold">SPACE</span>
          <span className={`font-black ${countryball.stats.space === 0 ? 'text-red-400' : 'text-purple-400'}`}>
            {countryball.stats.space === 0 ? '0% (NO)' : `${countryball.stats.space}%`}
          </span>
        </div>
      </div>

      {/* In-game perk */}
      <div className="text-[10px] text-emerald-300 bg-emerald-950/40 p-1.5 rounded-lg border border-emerald-500/30 mb-2 line-clamp-1">
        <span className="font-bold">Active Perk:</span> {countryball.lorePerk}
      </div>

      {/* Call to Action button */}
      <div className="flex items-center justify-between text-[10px] text-amber-300 font-bold pt-1.5 border-t border-stone-800 bg-amber-500/10 -mx-3.5 -mb-3.5 px-3.5 py-2 rounded-b-2xl hover:bg-amber-500/20 transition cursor-pointer">
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-amber-400" />
          <span>Click to Open Full National Dossier</span>
        </span>
        <ExternalLink size={12} className="text-amber-400" />
      </div>
    </div>
  );
}
