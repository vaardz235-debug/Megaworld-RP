import { useState, useEffect } from 'react';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { 
  Swords, 
  Palette, 
  Sparkles, 
  Settings, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Globe, 
  Compass, 
  ShieldCheck, 
  ChevronRight,
  UserCheck,
  LogIn,
  Check,
  X
} from 'lucide-react';
import { User } from 'firebase/auth';
import JukeboxPlayer from './JukeboxPlayer';

const SPLASHES = [
  'Now with 2D Steve!',
  'Survival & Creative Modes!',
  'Don’t dig straight down!',
  'Punch wood, get planks!',
  'Creeper? Ssssss-BOOM!',
  'Infinite blocks in Creative!',
  'Eat bread and golden apples!',
  'Press ESC for Game Menu!',
  'Made with pixel love!',
  'Alex approved!',
  'Beware of nighttime zombies!',
  'Tilled dirt grows crops!',
  'Poland CAN into space!',
  'Countryballs with pure white eyes!',
  'Did somebody say OIL?!',
  'Grooving with 24 Sprunkis!',
  'Live Incredibox Beat Studio!',
  'Stunning 3D Voxel Diorama!',
  'Jukebox plays Sweden & Pigstep!',
  'Turn up the Sprunki Beatbox!',
  'Press B to Drop Beatbox!',
  '26 Sodor Locomotives Steam On!',
  'Watch out for Diesel 10 and Pinchy!',
  'Hiro: Master of the Railway!'
];

interface MainMenuProps {
  onStartGame: (mode: 'survival' | 'creative') => void;
  onOpenGallery: () => void;
  selectedAvatar: CharacterData;
  activeGameMode: 'survival' | 'creative';
  onChangeGameMode: (mode: 'survival' | 'creative') => void;
  user: User | null;
  onSignIn: () => void;
  onPlayGuest: () => void;
  onSignOut: () => void;
}

export default function MainMenu({
  onStartGame,
  onOpenGallery,
  selectedAvatar,
  activeGameMode,
  onChangeGameMode,
  user,
  onSignIn,
  onPlayGuest,
  onSignOut,
}: MainMenuProps) {
  const [splashIndex, setSplashIndex] = useState(0);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<'peaceful' | 'normal' | 'hard'>('normal');

  useEffect(() => {
    // Pick a random splash text on load
    setSplashIndex(Math.floor(Math.random() * SPLASHES.length));
  }, []);

  const handleNextSplash = () => {
    setSplashIndex((prev) => (prev + 1) % SPLASHES.length);
  };

  return (
    <div className="relative min-h-[85vh] w-full flex flex-col items-center justify-between select-none py-6 px-4 overflow-hidden rounded-3xl border border-stone-800 shadow-2xl bg-stone-950">
      {/* Pixelated Background Pattern (Classic Minecraft Dirt/Cobble vibe) */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 30%, rgba(30, 70, 32, 0.4) 0%, transparent 70%),
            linear-gradient(45deg, #1c1917 25%, #292524 25%, #292524 50%, #1c1917 50%, #1c1917 75%, #292524 75%, #292524 100%)
          `,
          backgroundSize: '100% 100%, 32px 32px'
        }}
      />

      {/* Floating Panorama Particles / Mist Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/60 to-stone-950/80 pointer-events-none" />

      {/* Top Header Strip with User Profile & Quick Status */}
      <div className="relative z-10 w-full max-w-4xl flex items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-2 bg-stone-900/90 border-2 border-stone-700/80 px-3.5 py-1.5 rounded-xl shadow-lg backdrop-blur-md">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-stone-300 uppercase tracking-wider">
            MegaWorld 2D • Edition 1.6
          </span>
        </div>

        {/* User Account / Guest Button */}
        <div className="flex items-center gap-2">
          {!user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onPlayGuest}
                className="mc-btn px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow"
              >
                <UserCheck size={13} className="text-emerald-400" />
                <span>Play as Guest</span>
              </button>
              <button
                onClick={onSignIn}
                className="mc-btn px-3 py-1.5 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer shadow"
              >
                <LogIn size={13} className="text-sky-400" />
                <span>Google Sign In</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5 bg-stone-900/90 border-2 border-stone-700 px-3 py-1 rounded shadow">
              <div className="w-5 h-5 rounded bg-emerald-500 text-stone-950 font-black text-xs flex items-center justify-center">
                {user.displayName?.charAt(0) || 'M'}
              </div>
              <span className="text-xs font-bold text-stone-200 font-mono">
                {user.displayName || 'Miner'}
              </span>
              <button
                onClick={onSignOut}
                className="text-[11px] text-red-400 hover:text-red-300 font-bold ml-1 cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Center Hero: Iconic Minecraft 3D Pixel Logo & Yellow Splash */}
      <div className="relative z-10 flex flex-col items-center mt-4 mb-6">
        <div className="relative inline-block text-center cursor-default group">
          {/* Main Logo Text with 3D block text-shadow */}
          <div 
            className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-wider font-mono text-stone-200 select-none"
            style={{
              textShadow: `
                0px 2px 0px #78716c,
                0px 4px 0px #57534e,
                0px 6px 0px #44403c,
                0px 8px 0px #292524,
                0px 10px 0px #1c1917,
                0px 12px 14px rgba(0,0,0,0.9)
              `,
              letterSpacing: '0.08em'
            }}
          >
            MINECRAFT
          </div>
          
          {/* Subtitle Bar */}
          <div className="mt-1 flex items-center justify-center gap-3">
            <span className="h-0.5 w-12 bg-stone-600 inline-block" />
            <span className="text-xs sm:text-sm font-mono tracking-widest text-emerald-400 uppercase font-black px-2 py-0.5 bg-stone-900 border border-emerald-500/30 rounded">
              2D SANDBOX EDITION
            </span>
            <span className="h-0.5 w-12 bg-stone-600 inline-block" />
          </div>

          {/* Yellow Bouncing Splash Text */}
          <div 
            onClick={handleNextSplash}
            title="Click for another splash!"
            className="animate-mc-splash absolute -bottom-4 -right-4 sm:-bottom-5 sm:-right-8 bg-black/60 px-2 py-0.5 rounded cursor-pointer select-none z-20 border border-yellow-400/40"
          >
            <span 
              className="text-yellow-300 font-mono font-black text-xs sm:text-sm md:text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] whitespace-nowrap"
            >
              {SPLASHES[splashIndex]}
            </span>
          </div>
        </div>
      </div>

      {/* Center Layout: Avatar Preview (Left) + Classic Menu Buttons (Center) + Quick Info (Right) */}
      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-6 items-center px-4 my-2">
        {/* Left: Active Player Character Preview */}
        <div className="md:col-span-3 flex flex-col items-center justify-center bg-stone-900/80 border-2 border-stone-800 p-4 rounded-2xl shadow-xl backdrop-blur-sm text-center">
          <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400 mb-1">
            Current Skin
          </div>
          <div className="text-sm font-bold text-emerald-300 mb-3 font-mono">
            {selectedAvatar.name}
          </div>
          
          <div className="h-32 flex items-center justify-center my-1 filter drop-shadow-[0_8px_12px_rgba(0,0,0,0.8)]">
            <CharacterAvatar 
              character={selectedAvatar} 
              size="lg" 
              isWalking={true} 
              heldItem="pickaxe" 
              showName={false} 
            />
          </div>

          <button
            onClick={onOpenGallery}
            className="mc-btn w-full mt-3 py-2 text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={13} className="text-yellow-400" />
            <span>Change Skin</span>
          </button>
        </div>

        {/* Center: Iconic Classic Minecraft Menu Buttons */}
        <div className="md:col-span-6 flex flex-col items-center gap-3 w-full">
          {/* Button: Play Survival Mode */}
          <button
            onClick={() => {
              onChangeGameMode('survival');
              onStartGame('survival');
            }}
            className="mc-btn mc-btn-primary w-full py-3.5 px-4 rounded text-base sm:text-lg font-bold flex items-center justify-between cursor-pointer group shadow-lg"
          >
            <div className="flex items-center gap-3">
              <Swords size={20} className="text-yellow-300" />
              <span className="text-left">Play Survival Mode</span>
            </div>
            <span className="text-[11px] font-mono uppercase bg-black/40 px-2 py-0.5 rounded text-emerald-200 border border-emerald-400/30">
              Health & Mining
            </span>
          </button>

          {/* Button: Play Creative Mode */}
          <button
            onClick={() => {
              onChangeGameMode('creative');
              onStartGame('creative');
            }}
            className="mc-btn w-full py-3.5 px-4 rounded text-base sm:text-lg font-bold flex items-center justify-between cursor-pointer group shadow-lg hover:border-purple-400"
          >
            <div className="flex items-center gap-3">
              <Palette size={20} className="text-purple-300" />
              <span className="text-left">Play Creative Mode</span>
            </div>
            <span className="text-[11px] font-mono uppercase bg-black/40 px-2 py-0.5 rounded text-purple-200 border border-purple-400/30">
              Infinite (∞) Blocks
            </span>
          </button>

          {/* Row of 2 Medium Buttons: Select Skin + How to Play */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onOpenGallery}
              className="mc-btn py-3 px-3 rounded text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Sparkles size={16} className="text-yellow-400" />
              <span>Skin Gallery</span>
            </button>
            <button
              onClick={() => setShowHelpModal(true)}
              className="mc-btn py-3 px-3 rounded text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <BookOpen size={16} className="text-sky-400" />
              <span>How To Play</span>
            </button>
          </div>

          {/* Row of 2 Medium Buttons: Options & Settings + Sound Toggle */}
          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={() => setShowOptionsModal(true)}
              className="mc-btn py-3 px-3 rounded text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <Settings size={16} className="text-stone-300" />
              <span>Options...</span>
            </button>
            <button
              onClick={() => setSoundEnabled(prev => !prev)}
              className="mc-btn py-3 px-3 rounded text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              {soundEnabled ? (
                <>
                  <Volume2 size={16} className="text-emerald-400" />
                  <span>Audio: ON</span>
                </>
              ) : (
                <>
                  <VolumeX size={16} className="text-red-400" />
                  <span>Audio: OFF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right: World Lore & Features Card */}
        <div className="md:col-span-3 flex flex-col justify-between bg-stone-900/80 border-2 border-stone-800 p-4 rounded-2xl shadow-xl backdrop-blur-sm h-full">
          <div>
            <div className="flex items-center gap-2 text-stone-300 font-mono text-xs font-bold mb-2 pb-1.5 border-b border-stone-800">
              <Compass size={14} className="text-amber-400" />
              <span>World Biomes</span>
            </div>
            <ul className="text-xs text-stone-300 space-y-2 font-mono">
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">🌲</span> Greenwood Forest
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-yellow-400">🏜️</span> Golden Dunes Altar
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-cyan-300">❄️</span> Frostpeak Glacier
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-stone-400">⛏️</span> Deep Caverns & Coal
              </li>
            </ul>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-800 text-[11px] text-stone-400 font-mono">
            <div className="text-stone-200 font-bold mb-0.5">Quick Hint:</div>
            Press <kbd className="bg-stone-800 px-1 py-0.5 rounded border border-stone-600 text-stone-100">ESC</kbd> anytime during gameplay to open the in-game Menu.
          </div>
        </div>
      </div>

      {/* Jukebox Title Theme & Songs Bar */}
      <div className="relative z-10 w-full max-w-4xl mt-4">
        <JukeboxPlayer defaultExpanded={false} />
      </div>

      {/* Bottom Footer Info */}
      <div className="relative z-10 w-full max-w-4xl flex flex-wrap items-center justify-between text-[11px] font-mono text-stone-400 mt-4 pt-3 border-t border-stone-800/80 px-2">
        <div>
          Minecraft 2D Edition <span className="text-stone-300">v1.6.0-stable</span>
        </div>
        <div className="text-stone-400">
          Created for sandbox miners • Press <span className="text-yellow-300 font-bold">W A S D</span> to walk
        </div>
        <div className="text-stone-400">
          Not an official Minecraft product.
        </div>
      </div>

      {/* ================= OPTIONS MODAL ================= */}
      {showOptionsModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-4 border-stone-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700 mb-4">
              <div className="flex items-center gap-2 font-mono text-lg font-bold">
                <Settings size={20} className="text-yellow-400" />
                <span>Game Options & Settings</span>
              </div>
              <button
                onClick={() => setShowOptionsModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-stone-300 mb-1.5 font-bold">Default Game Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onChangeGameMode('survival')}
                    className={`mc-btn py-2 text-xs font-bold rounded ${
                      activeGameMode === 'survival' ? 'mc-btn-primary' : ''
                    }`}
                  >
                    ⚔️ Survival Mode
                  </button>
                  <button
                    onClick={() => onChangeGameMode('creative')}
                    className={`mc-btn py-2 text-xs font-bold rounded ${
                      activeGameMode === 'creative' ? 'mc-btn-primary' : ''
                    }`}
                  >
                    🎨 Creative Mode
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5 font-bold">Game Difficulty</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['peaceful', 'normal', 'hard'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setDifficulty(lvl)}
                      className={`mc-btn py-2 text-xs capitalize font-bold rounded ${
                        difficulty === lvl ? 'mc-btn-primary' : ''
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-stone-300 mb-1.5 font-bold">Sound Effects & Ambience</label>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`mc-btn w-full py-2.5 text-xs font-bold rounded flex items-center justify-center gap-2 ${
                    soundEnabled ? 'mc-btn-primary' : ''
                  }`}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                  <span>{soundEnabled ? 'Sound Effects: Enabled' : 'Sound Effects: Muted'}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-stone-800 text-[11px] text-stone-400">
                <span className="text-yellow-400 font-bold">Tip:</span> In Creative Mode, you can fly, spawn infinite blocks, and break blocks instantly without tool durability.
              </div>
            </div>

            <div className="mt-6 pt-3 border-t border-stone-700 flex justify-end">
              <button
                onClick={() => setShowOptionsModal(false)}
                className="mc-btn px-6 py-2.5 text-xs font-bold rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= HOW TO PLAY MODAL ================= */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border-4 border-stone-700 w-full max-w-lg p-6 rounded-2xl shadow-2xl text-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-700 mb-4">
              <div className="flex items-center gap-2 font-mono text-lg font-bold">
                <BookOpen size={20} className="text-sky-400" />
                <span>How to Play & Controls</span>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-stone-400 hover:text-white p-1 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 font-mono text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div className="font-bold text-yellow-300 mb-1">🎮 Movement Controls</div>
                <div className="text-stone-300">
                  Use <kbd className="bg-stone-800 px-1 rounded text-white">W</kbd> <kbd className="bg-stone-800 px-1 rounded text-white">A</kbd> <kbd className="bg-stone-800 px-1 rounded text-white">S</kbd> <kbd className="bg-stone-800 px-1 rounded text-white">D</kbd> or the Arrow Keys to walk Steve around the world.
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div className="font-bold text-emerald-400 mb-1">⛏️ Mining & Placing Blocks</div>
                <div className="text-stone-300">
                  Select a tool or block from the hotbar. Click on any block to mine it, or click on sky/empty space to place blocks. Doors can be clicked to open and shut!
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div className="font-bold text-purple-400 mb-1">🎨 Creative vs. ⚔️ Survival</div>
                <div className="text-stone-300">
                  Survival requires eating apples/bread to maintain hunger and health. Creative mode grants god invulnerability, flight, instant mining, and the infinite item catalog.
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div className="font-bold text-sky-400 mb-1">📜 Quests & Dialogue</div>
                <div className="text-stone-300">
                  Walk up to villagers or NPCs and accept tasks to trade gathered materials for rare emeralds, golden apples, and diamond swords.
                </div>
              </div>

              <div className="bg-stone-950 p-3 rounded-xl border border-stone-800">
                <div className="font-bold text-amber-400 mb-1">⏸️ Game Menu (Pause)</div>
                <div className="text-stone-300">
                  Press <kbd className="bg-stone-800 px-1 rounded text-white">ESC</kbd> or click the ☰ Menu button to pause, tweak options, or return to the main title screen.
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-700 flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="mc-btn px-6 py-2.5 text-xs font-bold rounded"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
