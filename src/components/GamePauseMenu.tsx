import { useState, useEffect } from 'react';
import { 
  Swords, 
  Palette, 
  Settings, 
  BookOpen, 
  Save, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  CloudRain, 
  Feather,
  Music,
  Play,
  Pause,
  Disc,
  X
} from 'lucide-react';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { audioEngine } from '../utils/audioEngine';
import { SONGS_PLAYLIST } from '../utils/musicTracks';

interface GamePauseMenuProps {
  isOpen: boolean;
  onClose: () => void;
  gameMode: 'survival' | 'creative';
  onToggleGameMode: (mode?: 'survival' | 'creative') => void;
  onQuitToTitle: () => void;
  playerAvatar: CharacterData;
  questsCount: { active: number; completed: number };
  onOpenQuests?: () => void;
  weather: 'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon';
  onChangeWeather?: (weather: 'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon') => void;
  onSetTimeOfDay?: (hour: number) => void;
  isFlying?: boolean;
  onToggleFlying?: () => void;
}

export default function GamePauseMenu({
  isOpen,
  onClose,
  gameMode,
  onToggleGameMode,
  onQuitToTitle,
  playerAvatar,
  questsCount,
  onOpenQuests,
  weather,
  onChangeWeather,
  onSetTimeOfDay,
  isFlying,
  onToggleFlying
}: GamePauseMenuProps) {
  const [subView, setSubView] = useState<'main' | 'options' | 'stats'>('main');
  const [soundEnabled, setSoundEnabled] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-stone-900 border-4 border-stone-600 w-full max-w-md p-6 rounded-2xl shadow-2xl relative text-stone-200">
        {/* Top Header */}
        <div className="text-center pb-4 mb-4 border-b border-stone-800">
          <h2 
            className="text-2xl sm:text-3xl font-black font-mono tracking-widest uppercase text-stone-100"
            style={{
              textShadow: '2px 2px 0px #000, 0px 4px 8px rgba(0,0,0,0.8)'
            }}
          >
            {subView === 'main' ? 'Game Menu' : subView === 'options' ? 'Options' : 'World Stats'}
          </h2>
          <div className="text-xs font-mono text-stone-400 mt-1 flex items-center justify-center gap-2">
            <span>Playing as <strong className="text-emerald-400">{playerAvatar.name}</strong></span>
            <span>•</span>
            <span className={gameMode === 'creative' ? 'text-purple-400 font-bold' : 'text-red-400 font-bold'}>
              {gameMode === 'creative' ? 'Creative Mode' : 'Survival Mode'}
            </span>
          </div>
        </div>

        {/* Avatar badge preview */}
        <div className="flex items-center justify-center -mt-2 mb-4">
          <div className="bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl flex items-center gap-2.5">
            <div className="w-6 h-8 overflow-hidden flex items-center justify-center">
              <CharacterAvatar character={playerAvatar} size="sm" isWalking={false} />
            </div>
            <div className="text-left font-mono text-[11px]">
              <div className="text-stone-300 font-bold">{playerAvatar.name}</div>
              <div className="text-stone-500">Quests: {questsCount.completed} done</div>
            </div>
          </div>
        </div>

        {/* MAIN MENU BUTTON LIST */}
        {subView === 'main' && (
          <div className="space-y-3 font-mono">
            {/* 1. Back to Game */}
            <button
              onClick={onClose}
              className="mc-btn mc-btn-primary w-full py-3 text-sm font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <ArrowLeft size={16} />
              <span>Back to Game</span>
            </button>

            {/* 2. Switch Game Mode */}
            <button
              onClick={() => onToggleGameMode()}
              className="mc-btn w-full py-3 text-xs sm:text-sm font-bold rounded flex items-center justify-between px-4 cursor-pointer shadow"
            >
              <div className="flex items-center gap-2">
                {gameMode === 'survival' ? (
                  <Palette size={16} className="text-purple-400" />
                ) : (
                  <Swords size={16} className="text-red-400" />
                )}
                <span>Switch Game Mode</span>
              </div>
              <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                gameMode === 'survival' ? 'bg-red-950 text-red-300 border border-red-700' : 'bg-purple-950 text-purple-300 border border-purple-700'
              }`}>
                Current: {gameMode}
              </span>
            </button>

            {/* 3. Advancements / Quests Modal Trigger */}
            <button
              onClick={() => {
                onClose();
                if (onOpenQuests) onOpenQuests();
              }}
              className="mc-btn w-full py-2.5 text-xs sm:text-sm font-bold rounded flex items-center justify-between px-4 cursor-pointer shadow"
            >
              <div className="flex items-center gap-2">
                <BookOpen size={16} className="text-yellow-400" />
                <span>Advancements & Quests</span>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">
                {questsCount.active} active
              </span>
            </button>

            {/* 4. Options Submenu */}
            <button
              onClick={() => setSubView('options')}
              className="mc-btn w-full py-2.5 text-xs sm:text-sm font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Settings size={16} className="text-stone-300" />
              <span>Options & Controls...</span>
            </button>

            {/* 5. Save & Quit to Title */}
            <div className="pt-2">
              <button
                onClick={() => {
                  onClose();
                  onQuitToTitle();
                }}
                className="mc-btn w-full py-3 text-sm font-bold rounded flex items-center justify-center gap-2 cursor-pointer shadow text-red-200 hover:text-red-100"
              >
                <Save size={16} className="text-amber-400" />
                <span>Save and Quit to Title</span>
              </button>
            </div>
          </div>
        )}

        {/* OPTIONS SUBVIEW */}
        {subView === 'options' && (
          <div className="space-y-4 font-mono text-xs">
            {/* Music & Jukebox Settings */}
            <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Music size={14} /> Jukebox Music ({SONGS_PLAYLIST.length} Songs)
                </span>
                <button
                  onClick={() => audioEngine.togglePlayPause()}
                  className="px-2 py-0.5 bg-amber-600 hover:bg-amber-500 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {audioEngine.getIsPlaying() ? <Pause size={10} /> : <Play size={10} />}
                  <span>{audioEngine.getIsPlaying() ? 'Pause' : 'Play'}</span>
                </button>
              </div>

              {/* Now playing */}
              <div className="text-[11px] text-stone-300 flex items-center gap-2 bg-stone-900 px-2 py-1.5 rounded border border-stone-800">
                <Disc size={13} className="text-amber-400 flex-shrink-0 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="truncate">
                  {audioEngine.getTrack().title}
                </span>
              </div>

              {/* Quick Track Switcher */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {SONGS_PLAYLIST.slice(0, 4).map(track => (
                  <button
                    key={track.id}
                    onClick={() => audioEngine.playTrack(track)}
                    className={`py-1 px-2 rounded text-[10px] truncate text-left cursor-pointer border transition ${
                      audioEngine.getTrack().id === track.id && audioEngine.getIsPlaying()
                        ? 'bg-amber-950 text-amber-300 border-amber-600'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200 border-stone-800'
                    }`}
                  >
                    {track.icon} {track.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Volume Slider */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-400">
                <span>Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioEngine.getIsMuted() ? 0 : audioEngine.getVolume()}
                  onChange={(e) => audioEngine.setVolume(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded"
                />
              </div>
            </div>

            {/* Sound Effects Toggle */}
            <div>
              <label className="block text-stone-300 font-bold mb-1">Sound Effects</label>
              <button
                onClick={() => setSoundEnabled(prev => !prev)}
                className={`mc-btn w-full py-2 rounded flex items-center justify-center gap-2 font-bold ${
                  soundEnabled ? 'mc-btn-primary' : ''
                }`}
              >
                {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                <span>{soundEnabled ? 'Sound Effects: Enabled' : 'Sound Effects: Muted'}</span>
              </button>
            </div>

            {/* Flying Toggle if Creative */}
            {gameMode === 'creative' && onToggleFlying && (
              <div>
                <label className="block text-stone-300 font-bold mb-1">Creative Ability</label>
                <button
                  onClick={onToggleFlying}
                  className={`mc-btn w-full py-2 rounded flex items-center justify-center gap-2 font-bold ${
                    isFlying ? 'mc-btn-primary' : ''
                  }`}
                >
                  <Feather size={16} />
                  <span>{isFlying ? 'Flight Mode: Enabled (Speed x2)' : 'Flight Mode: Disabled'}</span>
                </button>
              </div>
            )}

            {/* Environment Quick Controls */}
            {onChangeWeather && (
              <div>
                <label className="block text-stone-300 font-bold mb-1">Weather Atmosphere</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sunny', 'rainy', 'snowy'] as const).map(w => (
                    <button
                      key={w}
                      onClick={() => onChangeWeather(w)}
                      className={`mc-btn py-1.5 capitalize rounded font-bold ${
                        weather === w ? 'mc-btn-primary' : ''
                      }`}
                    >
                      {w === 'sunny' ? '☀️ Sun' : w === 'rainy' ? '🌧️ Rain' : '❄️ Snow'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {onSetTimeOfDay && (
              <div>
                <label className="block text-stone-300 font-bold mb-1">Time of Day</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSetTimeOfDay(20)}
                    className="mc-btn py-1.5 rounded font-bold flex items-center justify-center gap-1.5"
                  >
                    <Sun size={14} className="text-yellow-400" />
                    <span>Set Day</span>
                  </button>
                  <button
                    onClick={() => onSetTimeOfDay(75)}
                    className="mc-btn py-1.5 rounded font-bold flex items-center justify-center gap-1.5"
                  >
                    <Moon size={14} className="text-blue-300" />
                    <span>Set Night</span>
                  </button>
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-stone-800 flex justify-between items-center">
              <button
                onClick={() => setSubView('main')}
                className="mc-btn px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5"
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                onClick={onClose}
                className="mc-btn mc-btn-primary px-4 py-2 text-xs font-bold rounded"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* Small hint at bottom */}
        <div className="mt-4 pt-3 border-t border-stone-800 text-center text-[11px] font-mono text-stone-500">
          Press <kbd className="bg-stone-800 px-1 py-0.5 rounded text-stone-300 border border-stone-700">ESC</kbd> to resume game
        </div>
      </div>
    </div>
  );
}
