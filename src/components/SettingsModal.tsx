import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Volume2, 
  VolumeX, 
  Music, 
  Monitor, 
  Gamepad2, 
  Keyboard, 
  Save, 
  RotateCcw, 
  Check, 
  X, 
  Sparkles, 
  Zap, 
  Sun, 
  Moon, 
  CloudRain, 
  Snowflake, 
  Wind, 
  Skull, 
  Shield, 
  Feather, 
  Download, 
  Upload, 
  Play, 
  Flame, 
  Coins
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { 
  AppSettings, 
  DEFAULT_SETTINGS, 
  loadSettings, 
  saveSettings, 
  applySettings 
} from '../utils/settingsManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeGameMode?: 'survival' | 'creative';
  onChangeGameMode?: (mode: 'survival' | 'creative') => void;
  difficulty?: 'peaceful' | 'easy' | 'normal' | 'hard';
  onChangeDifficulty?: (diff: 'peaceful' | 'easy' | 'normal' | 'hard') => void;
  weather?: string;
  onChangeWeather?: (w: any) => void;
  timeOfDay?: number;
  onSetTimeOfDay?: (t: number) => void;
  targetFps?: number;
  onChangeTargetFps?: (fps: number) => void;
  isExpandedView?: boolean;
  onToggleExpandedView?: () => void;
  onResetWorld?: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  activeGameMode = 'survival',
  onChangeGameMode,
  difficulty = 'normal',
  onChangeDifficulty,
  weather = 'sunny',
  onChangeWeather,
  timeOfDay = 25,
  onSetTimeOfDay,
  targetFps = 165,
  onChangeTargetFps,
  isExpandedView = false,
  onToggleExpandedView,
  onResetWorld,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'gameplay' | 'audio' | 'graphics' | 'controls' | 'data'>('gameplay');
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [importJsonText, setImportJsonText] = useState<string>('');
  const [showImportBox, setShowImportBox] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setSettings(loadSettings());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const updateSetting = <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    const next = { ...settings, [key]: value };
    setSettings(next);
    saveSettings(next);
  };

  // Sound test triggers
  const handleTestSound = (type: string) => {
    if (type === 'mine') audioEngine.playMinecraftSound('stone');
    else if (type === 'creeper') audioEngine.playMinecraftSound('creeper');
    else if (type === 'oof') audioEngine.playRobloxSound('oof');
    else if (type === 'chime') audioEngine.playVeritySound('oracle');
    else if (type === 'jukebox') {
      audioEngine.togglePlayPause();
      showToast(audioEngine.getIsPlaying() ? '🎵 Music Track Playing' : '⏸️ Music Paused');
    }
    showToast(`Tested: ${type}`);
  };

  // Export Save File
  const handleExportSave = () => {
    try {
      const dataToExport: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('megaworld') || key.includes('roblox') || key.includes('minecraft'))) {
          dataToExport[key] = localStorage.getItem(key);
        }
      }
      const jsonStr = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `megaworld-save-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('💾 Save data exported to JSON!');
      audioEngine.playRobloxSound('badge');
    } catch (e) {
      console.error(e);
      showToast('❌ Failed to export save data');
    }
  };

  // Import Save File
  const handleImportSave = () => {
    try {
      if (!importJsonText.trim()) return;
      const parsed = JSON.parse(importJsonText);
      Object.entries(parsed).forEach(([k, v]) => {
        if (typeof v === 'string') {
          localStorage.setItem(k, v);
        }
      });
      showToast('✅ Save data imported! Reloading...');
      audioEngine.playRobloxSound('badge');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (e) {
      console.error(e);
      showToast('❌ Invalid JSON save file!');
      audioEngine.playRobloxSound('oof');
    }
  };

  // Reset to defaults
  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
    showToast('🔄 Settings reset to factory defaults!');
    audioEngine.playRobloxSound('click');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none font-sans">
      <div className="bg-[#191B1D] border-4 border-stone-700 w-full max-w-3xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.9)] text-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#232527] px-6 py-4 border-b-2 border-stone-700 flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-500 text-black flex items-center justify-center shadow-lg border-2 border-yellow-300">
              <Settings size={22} className="animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                Game Options & Settings
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  MegaWorld
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Configure audio, graphics, controls, and gameplay rules
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            title="Close Settings (ESC)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#1c1e20] px-4 sm:px-6 pt-3 border-b border-stone-800 flex gap-2 overflow-x-auto font-mono text-xs font-bold scrollbar-none">
          {[
            { id: 'gameplay', label: 'Gameplay', icon: Gamepad2 },
            { id: 'audio', label: 'Audio & Sound', icon: Volume2 },
            { id: 'graphics', label: 'Graphics & FPS', icon: Monitor },
            { id: 'controls', label: 'Controls', icon: Keyboard },
            { id: 'data', label: 'Data & Saves', icon: Save },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  audioEngine.playRobloxSound('click');
                }}
                className={`px-4 py-2.5 rounded-t-xl transition flex items-center gap-2 cursor-pointer border-t-2 border-x-2 -mb-[1px] ${
                  isActive
                    ? 'bg-[#232527] text-white border-amber-400 shadow'
                    : 'bg-transparent text-stone-400 border-transparent hover:text-stone-200 hover:bg-stone-800/50'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-amber-400' : ''} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-mono text-xs space-y-5 bg-[#191B1D]">
          {/* ================= TAB 1: GAMEPLAY ================= */}
          {activeTab === 'gameplay' && (
            <div className="space-y-5">
              {/* Game Mode */}
              <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800">
                <label className="block text-white font-bold text-sm mb-1.5 flex items-center gap-2">
                  <Gamepad2 size={16} className="text-amber-400" />
                  <span>Primary Game Mode</span>
                </label>
                <p className="text-stone-400 text-[11px] mb-3">
                  Choose between resource gathering survival or sandbox creative building
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (onChangeGameMode) onChangeGameMode('survival');
                      updateSetting('defaultGameMode', 'survival');
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer ${
                      activeGameMode === 'survival'
                        ? 'bg-red-950/60 border-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] ring-2 ring-red-500/30'
                        : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-red-400 flex items-center gap-1.5">
                        <Skull size={16} /> Survival Mode
                      </span>
                      {activeGameMode === 'survival' && <span className="text-xs text-red-300 font-bold">✓ Active</span>}
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Hearts, hunger bar, mining drops, tool durability & wilderness hazards.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (onChangeGameMode) onChangeGameMode('creative');
                      updateSetting('defaultGameMode', 'creative');
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer ${
                      activeGameMode === 'creative'
                        ? 'bg-purple-950/60 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.3)] ring-2 ring-purple-500/30'
                        : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-purple-300 flex items-center gap-1.5">
                        <Feather size={16} /> Creative Mode
                      </span>
                      {activeGameMode === 'creative' && <span className="text-xs text-purple-200 font-bold">✓ Active</span>}
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Infinite blocks, flight mode (double speed), instant mining & godmode invincibility.
                    </p>
                  </button>
                </div>
              </div>

              {/* Game Difficulty */}
              <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800">
                <label className="block text-white font-bold text-sm mb-1.5 flex items-center gap-2">
                  <Shield size={16} className="text-yellow-400" />
                  <span>World Difficulty Level</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {[
                    { id: 'peaceful', label: 'Peaceful', icon: '🕊️', desc: 'No hunger or hazard damage' },
                    { id: 'easy', label: 'Easy', icon: '🛡️', desc: 'Slow hunger, reduced hazards' },
                    { id: 'normal', label: 'Normal', icon: '⚔️', desc: 'Standard Minecraft survival' },
                    { id: 'hard', label: 'Hard', icon: '💀', desc: 'Fast hunger, severe hazards' },
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      type="button"
                      onClick={() => {
                        if (onChangeDifficulty) onChangeDifficulty(diff.id as any);
                        updateSetting('difficulty', diff.id as any);
                      }}
                      className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                        difficulty === diff.id
                          ? 'bg-amber-950 border-amber-400 text-amber-200 ring-2 ring-amber-400/30 shadow'
                          : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{diff.icon}</span>
                      <span className="font-bold text-xs">{diff.label}</span>
                      <span className="text-[9px] text-stone-400 leading-tight">{diff.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Gameplay Toggles */}
              <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="text-white font-bold text-sm mb-1">Rules & Abilities</div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Keep Inventory on Death</div>
                    <div className="text-[10px] text-stone-400">Keep all your mined materials upon respawn</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.keepInventoryOnDeath}
                    onChange={(e) => updateSetting('keepInventoryOnDeath', e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Auto-Jump & Walk Hold</div>
                    <div className="text-[10px] text-stone-400">Holding movement keys moves continuously across voxels</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.autoJump}
                    onChange={(e) => updateSetting('autoJump', e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">On-Screen D-Pad & Quick Controls</div>
                    <div className="text-[10px] text-stone-400">Show floating touch buttons for mobile and mouse navigation</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.showOnScreenControls}
                    onChange={(e) => updateSetting('showOnScreenControls', e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick Atmosphere & Time Controls */}
              {onChangeWeather && (
                <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800">
                  <div className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <Sun size={16} className="text-amber-400" />
                    <span>Atmospheric Weather Presets</span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {[
                      { id: 'sunny', label: 'Sun', icon: '☀️' },
                      { id: 'rainy', label: 'Rain', icon: '🌧️' },
                      { id: 'snowy', label: 'Snow', icon: '❄️' },
                      { id: 'stormy', label: 'Storm', icon: '⚡' },
                      { id: 'aurora', label: 'Aurora', icon: '🌌' },
                      { id: 'bloodmoon', label: 'Blood', icon: '🌕' },
                    ].map(w => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => {
                          onChangeWeather(w.id);
                          showToast(`Weather set to ${w.label}!`);
                        }}
                        className={`py-2 px-1 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1 ${
                          weather === w.id
                            ? 'bg-amber-950 border-amber-400 text-amber-200 ring-2 ring-amber-400/30'
                            : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">{w.icon}</span>
                        <span className="text-[10px] font-bold">{w.label}</span>
                      </button>
                    ))}
                  </div>

                  {onSetTimeOfDay && (
                    <div className="mt-3 pt-3 border-t border-stone-800 flex items-center justify-between gap-3">
                      <span className="text-stone-300 font-bold text-xs">Set Time:</span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => onSetTimeOfDay(20)}
                          className="px-3 py-1 bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-400 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <Sun size={12} /> Dawn / Day
                        </button>
                        <button
                          type="button"
                          onClick={() => onSetTimeOfDay(75)}
                          className="px-3 py-1 bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 border border-indigo-400 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1"
                        >
                          <Moon size={12} /> Midnight
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: AUDIO & SOUND ================= */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              {/* Volume Sliders */}
              <div className="bg-[#232527] p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-stone-800">
                  <div className="text-white font-bold text-sm flex items-center gap-2">
                    <Volume2 size={16} className="text-amber-400" />
                    <span>Audio Volumes & Controls</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => updateSetting('soundEnabled', !settings.soundEnabled)}
                    className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      settings.soundEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-red-900 text-red-200 border border-red-600'
                    }`}
                  >
                    {settings.soundEnabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
                    <span>{settings.soundEnabled ? 'Master Sound: ON' : 'Master Sound: MUTED'}</span>
                  </button>
                </div>

                {/* Master Volume */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-300">Master Volume</span>
                    <span className="text-amber-400 font-mono">{settings.masterVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.masterVolume}
                    onChange={(e) => updateSetting('masterVolume', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                </div>

                {/* Sound Effects Volume */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-300">Sound Effects (SFX) Volume</span>
                    <span className="text-emerald-400 font-mono">{settings.sfxVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.sfxVolume}
                    onChange={(e) => updateSetting('sfxVolume', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                {/* Jukebox / Music Volume */}
                <div className="space-y-1">
                  <div className="flex justify-between font-bold">
                    <span className="text-stone-300">Jukebox Music Volume</span>
                    <span className="text-cyan-400 font-mono">{settings.musicVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.musicVolume}
                    onChange={(e) => updateSetting('musicVolume', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                </div>
              </div>

              {/* Audio Toggles */}
              <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="text-white font-bold text-sm mb-1">Audio Features</div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Jukebox Background Tracks</div>
                    <div className="text-[10px] text-stone-400">Play procedural 8-bit chiptune background tracks</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.musicEnabled}
                    onChange={(e) => updateSetting('musicEnabled', e.target.checked)}
                    className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Character Voice Lines & TTS</div>
                    <div className="text-[10px] text-stone-400">Voice dialogue audio synthesis when talking to NPCs</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.ttsVoiceEnabled}
                    onChange={(e) => updateSetting('ttsVoiceEnabled', e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Weather Environmental Ambience</div>
                    <div className="text-[10px] text-stone-400">Dynamic thunder rumbles, wind howls & rain spatters</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.ambientWeatherAudio}
                    onChange={(e) => updateSetting('ambientWeatherAudio', e.target.checked)}
                    className="w-5 h-5 accent-indigo-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Sound Test Playground */}
              <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800">
                <div className="text-white font-bold text-sm mb-1.5 flex items-center gap-1.5">
                  <Play size={14} className="text-amber-400" />
                  <span>Test Audio Synthesis</span>
                </div>
                <p className="text-stone-400 text-[10px] mb-3">
                  Click any sound to verify your current volume and speaker output:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleTestSound('mine')}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    ⛏️ Mine Block
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestSound('creeper')}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-emerald-300 border border-emerald-500/40 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    💣 Creeper Hiss
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestSound('oof')}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-red-300 border border-red-500/40 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    💀 Roblox OOF
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestSound('chime')}
                    className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-purple-300 border border-purple-500/40 rounded-xl font-bold text-xs transition cursor-pointer"
                  >
                    ✨ Verity Oracle
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTestSound('jukebox')}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400 rounded-xl font-bold text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Music size={12} /> Toggle Jukebox Track
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: GRAPHICS & 165 FPS ================= */}
          {activeTab === 'graphics' && (
            <div className="space-y-5">
              {/* 165 FPS Refresh Rate */}
              <div className="bg-[#232527] p-5 rounded-2xl border border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-white font-bold text-sm flex items-center gap-2">
                    <Zap size={16} className="text-yellow-400" />
                    <span>Display Refresh Rate (FPS Engine)</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    GPU ACCELERATED
                  </span>
                </div>
                <p className="text-stone-400 text-[11px] mb-3">
                  Controls the sub-pixel camera interpolation and compositing loop speed
                </p>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { fps: 165, label: '165 FPS', badge: 'Ultra' },
                    { fps: 144, label: '144 FPS', badge: 'Esports' },
                    { fps: 120, label: '120 FPS', badge: 'Fast' },
                    { fps: 60, label: '60 FPS', badge: 'Eco' },
                  ].map((opt) => (
                    <button
                      key={opt.fps}
                      type="button"
                      onClick={() => {
                        if (onChangeTargetFps) onChangeTargetFps(opt.fps);
                        updateSetting('targetFps', opt.fps as any);
                        showToast(`Display target set to ${opt.fps} FPS!`);
                      }}
                      className={`p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-0.5 ${
                        targetFps === opt.fps
                          ? 'bg-emerald-950 border-emerald-400 text-emerald-200 ring-2 ring-emerald-400/30 shadow'
                          : 'bg-stone-900 border-stone-700 text-stone-400 hover:text-white'
                      }`}
                    >
                      <span className="font-bold text-sm">{opt.label}</span>
                      <span className="text-[9px] text-yellow-300">{opt.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Viewport Size */}
              {onToggleExpandedView && (
                <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-sm">Panoramic Canvas Mode</div>
                    <div className="text-[10px] text-stone-400">Expand the 3D map canvas to fill 84vh of viewport</div>
                  </div>
                  <button
                    type="button"
                    onClick={onToggleExpandedView}
                    className={`px-4 py-2 rounded-xl font-bold text-xs transition cursor-pointer ${
                      isExpandedView
                        ? 'bg-cyan-600 text-white shadow'
                        : 'bg-stone-800 text-stone-300 border border-stone-700 hover:bg-stone-700'
                    }`}
                  >
                    {isExpandedView ? 'Expanded (84vh)' : 'Standard (680px)'}
                  </button>
                </div>
              )}

              {/* Visual Toggles */}
              <div className="bg-[#232527] p-4 rounded-2xl border border-stone-800 space-y-3">
                <div className="text-white font-bold text-sm mb-1">Rendering & Effects</div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Dynamic Day / Night Shading</div>
                    <div className="text-[10px] text-stone-400">Smooth ambient shadow progression based on time of day</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.dynamicShading}
                    onChange={(e) => updateSetting('dynamicShading', e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">3D Horizon Skybox Gradients</div>
                    <div className="text-[10px] text-stone-400">Render gradient skies for Blood Moon, Aurora, and sunsets</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.skyboxGradient}
                    onChange={(e) => updateSetting('skyboxGradient', e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <div>
                    <div className="text-stone-200 font-bold">Particle Effects</div>
                    <div className="text-[10px] text-stone-400">Block-breaking voxel debris, fireworks, and starlight</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={settings.particlesEnabled}
                    onChange={(e) => updateSetting('particlesEnabled', e.target.checked)}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: CONTROLS & KEYBINDS ================= */}
          {activeTab === 'controls' && (
            <div className="space-y-5">
              <div className="bg-[#232527] p-5 rounded-2xl border border-stone-800">
                <div className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <Keyboard size={16} className="text-amber-400" />
                  <span>Keybindings Reference Guide</span>
                </div>
                <p className="text-stone-400 text-[11px] mb-4">
                  Full keyboard shortcuts for seamless mining, movement, and abilities:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[
                    { key: 'W / ↑', desc: 'Climb / Move Upwards (hold to walk)', badge: 'Movement' },
                    { key: 'A / ←', desc: 'Move Left (hold for continuous walk)', badge: 'Movement' },
                    { key: 'S / ↓', desc: 'Descend / Move Downwards', badge: 'Movement' },
                    { key: 'D / →', desc: 'Move Right (hold for continuous walk)', badge: 'Movement' },
                    { key: 'SPACE', desc: 'Jump / Hop / Flight Ascendance', badge: 'Action' },
                    { key: 'M / Click', desc: 'Mine Block / Strike Sword', badge: 'Mining' },
                    { key: 'B', desc: 'Drop Sprunki Beatbox Audio Box', badge: 'Music' },
                    { key: 'T', desc: 'Talk to Character & Voice Lines (TTS)', badge: 'Voice' },
                    { key: 'E', desc: 'Open Inventory & 3x3 Crafting Table', badge: 'Inventory' },
                    { key: 'ESC / O', desc: 'Pause Menu / Open Settings', badge: 'Menu' },
                    { key: 'SHIFT', desc: 'Fast Sprint / Speed Coil Boost', badge: 'Sprint' },
                  ].map((bind, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-900 border border-stone-800"
                    >
                      <div className="flex items-center gap-2.5">
                        <kbd className="px-2.5 py-1 bg-stone-800 border-2 border-stone-600 rounded-lg text-amber-300 font-black font-mono shadow-xs text-xs">
                          {bind.key}
                        </kbd>
                        <span className="text-stone-300 text-xs">{bind.desc}</span>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-400 font-bold">
                        {bind.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: DATA & SAVES ================= */}
          {activeTab === 'data' && (
            <div className="space-y-5">
              {/* Backup & Restore */}
              <div className="bg-[#232527] p-5 rounded-2xl border border-stone-800 space-y-3">
                <div className="text-white font-bold text-sm flex items-center gap-2">
                  <Save size={16} className="text-amber-400" />
                  <span>World Save Backup & Restore</span>
                </div>
                <p className="text-stone-400 text-[11px]">
                  Export all your mined world state, player inventory, quest completions, and Robux wallet to a portable JSON backup file.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleExportSave}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <Download size={14} />
                    <span>Export Save File (JSON)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowImportBox(!showImportBox)}
                    className="px-4 py-2.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer transition active:scale-95"
                  >
                    <Upload size={14} />
                    <span>Import Save File</span>
                  </button>
                </div>

                {showImportBox && (
                  <div className="mt-3 p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2">
                    <label className="text-stone-300 font-bold text-xs block">Paste Save JSON:</label>
                    <textarea
                      rows={4}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder='{"megaworld_inventory": "...", "megaworld_roblox_robux_balance": "2750"}'
                      className="w-full bg-[#191B1D] border border-stone-700 rounded-xl p-2.5 text-[11px] text-white font-mono focus:outline-none focus:border-amber-400"
                    />
                    <button
                      type="button"
                      onClick={handleImportSave}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg shadow cursor-pointer transition"
                    >
                      Apply & Load Save
                    </button>
                  </div>
                )}
              </div>

              {/* Reset World & Defaults */}
              <div className="bg-[#232527] p-5 rounded-2xl border border-stone-800 space-y-3">
                <div className="text-white font-bold text-sm flex items-center gap-2">
                  <RotateCcw size={16} className="text-red-400" />
                  <span>World Generation & Settings Reset</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {onResetWorld && (
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm('Are you sure you want to regenerate the world terrain? Your mined blocks will be restored to fresh seed.')) {
                          onResetWorld();
                          showToast('🌲 World terrain regenerated!');
                          audioEngine.playMinecraftSound('build');
                        }
                      }}
                      className="p-3 bg-stone-900 hover:bg-stone-800 border border-amber-500/40 text-amber-300 rounded-xl font-bold text-xs text-left cursor-pointer transition"
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <span>🌲 Regenerate World Blocks</span>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        Resets terrain to fresh Greenwood Forest, Golden Dunes & Glacier landmarks.
                      </div>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="p-3 bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-300 rounded-xl font-bold text-xs text-left cursor-pointer transition"
                  >
                    <div className="flex items-center gap-1.5 font-bold mb-1">
                      <span>🔄 Reset All Settings to Defaults</span>
                    </div>
                    <div className="text-[10px] text-stone-400">
                      Restores factory volumes, 165 FPS mode, and default survival rules.
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#232527] px-6 py-3.5 border-t border-stone-800 flex items-center justify-between">
          <div className="text-[11px] text-stone-400 font-mono">
            {toastMessage ? (
              <span className="text-emerald-400 font-bold animate-pulse">{toastMessage}</span>
            ) : (
              <span>Settings auto-saved to localStorage</span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mc-btn mc-btn-primary px-6 py-2 rounded-xl text-xs font-bold transition shadow cursor-pointer font-mono"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
