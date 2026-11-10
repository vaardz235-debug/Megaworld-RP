/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';
import GameWorld from './components/GameWorld';
import CharacterGallery, { ALL_CHARACTERS } from './components/CharacterGallery';
import FriendsList from './components/FriendsList';
import CharacterAvatar from './components/CharacterAvatar';
import MainMenu from './components/MainMenu';
import RobloxApp from './components/RobloxApp';
import Dashboard from './components/Dashboard';
import { 
  Gamepad2, 
  UserCheck, 
  Sparkles, 
  LogIn, 
  Swords, 
  Palette, 
  Home, 
  LayoutDashboard, 
  HelpCircle,
  Settings,
  Cloud,
  Mic
} from 'lucide-react';
import SettingsModal from './components/SettingsModal';
import AvatarCreatorModal from './components/AvatarCreatorModal';
import QuestAndEventsHub from './components/QuestAndEventsHub';
import MarketplaceModal from './components/MarketplaceModal';
import CosmeticStoreModal from './components/CosmeticStoreModal';
import ProgressionModal from './components/ProgressionModal';
import VoiceChatConsole from './components/VoiceChatConsole';
import WorldEditor from './components/WorldEditor';
import MegaWorldVideosModal from './components/MegaWorldVideosModal';
import GuildFactionModal from './components/GuildFactionModal';
import DailyMissionsModal from './components/DailyMissionsModal';
import UnifiedLoreCodexModal from './components/UnifiedLoreCodexModal';
import InteractiveWorldMapModal from './components/InteractiveWorldMapModal';
import LegoWebsiteModal from './components/LegoWebsiteModal';
import CountryballCreatorModal from './components/CountryballCreatorModal';
import CommunityEventHubsModal from './components/CommunityEventHubsModal';
import CrossPlatformMiniGamesModal from './components/CrossPlatformMiniGamesModal';
import ChristmasMegaModal from './components/ChristmasMegaModal';
import BrandHubModal from './components/BrandHubModal';
import { avatarManager } from './utils/avatarManager';
import { dailyMissionManager } from './utils/dailyMissionManager';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Default to the iconic Minecraft 'menu'
  const [activeView, setActiveView] = useState<'menu' | 'game' | 'gallery' | 'dashboard' | 'roblox' | 'editor'>('menu');
  // Selected Roblox Experience to launch or preview
  const [selectedRobloxExperienceId, setSelectedRobloxExperienceId] = useState<any>('verity_rp');
  // Custom level/schematic passed to or from WorldEditor
  const [customEditorLevel, setCustomEditorLevel] = useState<any>(null);
  // Default to Steve with his full Minecraft body
  const [selectedAvatar, setSelectedAvatar] = useState<any>(ALL_CHARACTERS[0]);
  // Game Mode State: 'survival' | 'creative'
  const [activeGameMode, setActiveGameMode] = useState<'survival' | 'creative'>('survival');
  // Global Settings Modal State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // Custom Avatar Studio Modal State
  const [isAvatarCreatorOpen, setIsAvatarCreatorOpen] = useState(false);
  // Dynamic Quests & Scheduled Events Modal State
  const [isQuestHubOpen, setIsQuestHubOpen] = useState(false);
  // Cross-Brand Virtual Marketplace Modal State
  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  // Cross-Platform 10-Brand Cosmetic Store Modal State
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  // Cross-Platform Cloud Progression Modal State
  const [isProgressionOpen, setIsProgressionOpen] = useState(false);
  // Integrated Proximity Voice Chat Modal State
  const [isVoiceChatOpen, setIsVoiceChatOpen] = useState(false);
  // MegaWorld RP Cinema & Video Vault Modal State
  const [isVideosOpen, setIsVideosOpen] = useState(false);
  // Guilds & Factions Modal State
  const [isGuildsOpen, setIsGuildsOpen] = useState(false);
  // Daily Missions & Bounties Modal State
  const [isDailyMissionsOpen, setIsDailyMissionsOpen] = useState(false);
  // Unified Multiverse Lore Codex Modal State
  const [isLoreModalOpen, setIsLoreModalOpen] = useState(false);
  // Interactive Multiverse World Map Modal State
  const [isWorldMapOpen, setIsWorldMapOpen] = useState(false);
  // Official LEGO Website & Builder Portal State
  const [isLegoWebsiteOpen, setIsLegoWebsiteOpen] = useState(false);
  // Detailed Countryball Creator Modal State
  const [isCountryballCreatorOpen, setIsCountryballCreatorOpen] = useState(false);
  // Persistent Community Event Hubs Modal State
  const [isCommunityHubsOpen, setIsCommunityHubsOpen] = useState(false);
  // Cross-Platform Arcade & Mini-Games Modal State
  const [isMiniGamesOpen, setIsMiniGamesOpen] = useState(false);
  // 1,000 Christmas Mega Edition Modal State
  const [isChristmasMegaModalOpen, setIsChristmasMegaModalOpen] = useState(false);
  // Multiverse Brand Hubs Modal State
  const [isBrandHubOpen, setIsBrandHubOpen] = useState(false);
  // Track player coordinates for World Map
  const [playerCoords, setPlayerCoords] = useState({ x: 25, y: 7 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'm' || e.key === 'M') {
        setIsWorldMapOpen(prev => !prev);
      }
    };
    const handlePosUpdate = (e: any) => {
      if (e.detail && typeof e.detail.x === 'number') {
        setPlayerCoords({ x: e.detail.x, y: e.detail.y || 7 });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('megaworld_pos_update', handlePosUpdate);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('megaworld_pos_update', handlePosUpdate);
    };
  }, []);

  useEffect(() => {
    const syncAvatar = async (uid?: string) => {
      const data = await avatarManager.loadFromCloud(uid || '');
      const base = ALL_CHARACTERS.find((c) => c.id === data.baseCharacterId) || ALL_CHARACTERS[0];
      setSelectedAvatar(avatarManager.applyToCharacter(base, data));
    };

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        syncAvatar(firebaseUser.uid);
      } else {
        syncAvatar();
      }
      setLoading(false);
    });

    const handleAvatarUpdate = (e: any) => {
      if (e.detail) {
        const base = ALL_CHARACTERS.find((c) => c.id === e.detail.baseCharacterId) || ALL_CHARACTERS[0];
        setSelectedAvatar(avatarManager.applyToCharacter(base, e.detail));
      }
    };
    window.addEventListener('megaworld_avatar_updated', handleAvatarUpdate);

    return () => {
      unsubscribe();
      window.removeEventListener('megaworld_avatar_updated', handleAvatarUpdate);
    };
  }, []);

  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (signingIn) return;
    setSigningIn(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request') {
        console.warn('Sign-in popup was closed by the user.');
      } else {
        console.error('Sign-in error:', error);
      }
    } finally {
      setSigningIn(false);
    }
  };

  const handlePlayAsGuest = () => {
    setUser({
      uid: 'guest-player',
      displayName: 'Steve (Guest Miner)',
      email: 'guest@megaworld.local',
    } as any);
  };

  const handleStartMode = (mode: 'survival' | 'creative') => {
    setActiveGameMode(mode);
    setActiveView('game');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-sm text-stone-400">Loading Minecraft 2D Edition...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-white p-3 sm:p-4 font-sans selection:bg-emerald-500 selection:text-black">
      {/* Top Header Navigation Strip */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-4 bg-stone-900/90 border border-stone-800 p-3 sm:p-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveView('menu')}
            className="w-10 h-10 bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center text-xl shadow-md border border-emerald-400 cursor-pointer transition active:scale-95"
            title="Go to Main Title Menu"
          >
            ⛏️
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2 font-mono">
              MegaWorld RP
              <span className="text-[10px] font-mono uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Minecraft 2D
              </span>
            </h1>
            <p className="text-[11px] text-stone-400 font-mono">Sandbox Survival & Creative Worlds</p>
          </div>
        </div>

        {/* View Switchers & Mode Indicators */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Active Avatar Widget */}
          <button
            onClick={() => setIsAvatarCreatorOpen(true)}
            className="flex items-center gap-2 bg-stone-800/90 hover:bg-stone-700/90 border border-stone-700 hover:border-amber-400 px-3 py-1.5 rounded-xl cursor-pointer transition shadow"
            title="Open Avatar Creator Studio to customize skins, cosmetics & classes"
          >
            <div className="w-6 h-8 overflow-hidden flex items-center justify-center -my-1">
              <CharacterAvatar character={selectedAvatar} size="sm" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[9px] text-amber-400 uppercase font-bold">Studio</div>
              <div className="text-xs font-bold text-emerald-300 leading-tight truncate max-w-[100px]">
                {selectedAvatar?.name || 'Steve'}
              </div>
            </div>
          </button>

          {/* Avatar Studio Button */}
          <button
            onClick={() => setIsAvatarCreatorOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-amber-300 hover:text-white border border-stone-700 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Avatar Creator: Countryballs, Xilam, Minecraft, Roblox & Cosmetics"
          >
            <span>🎨</span>
            <span className="hidden sm:inline">Avatar Studio</span>
          </button>

          {/* Quests & Events Button */}
          <button
            onClick={() => setIsQuestHubOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-emerald-300 hover:text-white border border-stone-700 hover:border-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Dynamic Quests, Boss Raids & Custom Servers Hub"
          >
            <span>📜</span>
            <span className="hidden sm:inline">Quests & Events</span>
          </button>

          {/* Marketplace Button */}
          <button
            onClick={() => setIsMarketplaceOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-yellow-300 hover:text-white border border-stone-700 hover:border-yellow-400 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Virtual Marketplace: Trade Minecraft, Roblox, Countryballs & Brand Items"
          >
            <span>⚖️</span>
            <span className="hidden sm:inline">Market</span>
          </button>

          {/* 10-Brand Cosmetic Store Button */}
          <button
            onClick={() => setIsStoreOpen(true)}
            className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-white border border-amber-500/50 hover:border-amber-400 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Cross-Platform 10-Brand Cosmetic Store (Skins, Emotes & Accessories)"
          >
            <span>🛍️</span>
            <span className="hidden sm:inline">Store</span>
          </button>

          {/* Quick Mode Toggle in Navbar */}
          <div className="flex items-center bg-stone-800 border border-stone-700 p-0.5 rounded-xl font-mono">
            <button
              onClick={() => setActiveGameMode('survival')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                activeGameMode === 'survival'
                  ? 'bg-red-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Survival Mode: Health, hunger & limited resources"
            >
              <Swords size={12} />
              <span>Survival</span>
            </button>
            <button
              onClick={() => setActiveGameMode('creative')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition cursor-pointer ${
                activeGameMode === 'creative'
                  ? 'bg-purple-600 text-white shadow'
                  : 'text-stone-400 hover:text-white'
              }`}
              title="Creative Mode: Infinite blocks, flight & god mode"
            >
              <Palette size={12} />
              <span>Creative</span>
            </button>
          </div>

          {/* Menu / Home Button */}
          {activeView !== 'menu' && (
            <button
              onClick={() => setActiveView('menu')}
              className="mc-btn px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
              title="Return to Main Title Screen"
            >
              <Home size={14} className="text-yellow-400" />
              <span>Title Menu</span>
            </button>
          )}

          {/* Play World Button */}
          {activeView !== 'game' && (
            <button
              onClick={() => setActiveView('game')}
              className="mc-btn mc-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer hover:scale-105"
            >
              <Gamepad2 size={14} />
              <span>Play World</span>
            </button>
          )}

          {/* Skin Gallery Button */}
          {activeView !== 'gallery' && (
            <button
              onClick={() => setActiveView('gallery')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            >
              <Sparkles size={14} className="text-yellow-400" />
              <span>Skins</span>
            </button>
          )}

          {/* Roblox App Button */}
          <button
            onClick={() => setActiveView('roblox')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono ${
              activeView === 'roblox'
                ? 'bg-[#E2231A] text-white ring-2 ring-red-400'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-red-500'
            }`}
            title="Open Roblox App (Obby, Tycoons, R6 Avatars, OOF Soundboard, Robux)"
          >
            <span className="w-3 h-3 bg-[#E2231A] rounded-xs inline-block rotate-12 flex-shrink-0 border border-white/60 shadow-xs" />
            <span>Roblox</span>
          </button>

          {/* World & Level Editor Button */}
          <button
            onClick={() => setActiveView('editor')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono ${
              activeView === 'editor'
                ? 'bg-amber-500 text-black shadow ring-2 ring-amber-400 font-black'
                : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-stone-700 hover:border-amber-400'
            }`}
            title="Open World & Level Editor (Create, Edit & Publish Custom Multiverse Levels)"
          >
            <span>🛠️</span>
            <span>Editor</span>
          </button>

          {/* Community Social Feed & Dashboard Tab */}
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono ${
              activeView === 'dashboard'
                ? 'bg-amber-500 text-black shadow ring-2 ring-amber-400 font-black'
                : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 hover:border-amber-400'
            }`}
            title="View Community Dashboard & Social Feed"
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Social Feed</span>
          </button>

          {/* Cloud Progression Shortcut */}
          <button
            onClick={() => setIsProgressionOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-sky-300 hover:text-white border border-stone-700 hover:border-sky-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Cloud Progression, Skills & Device Sync"
          >
            <Cloud size={14} className="text-sky-400" />
            <span className="hidden md:inline">Progression</span>
          </button>

          {/* Voice Chat Shortcut */}
          <button
            onClick={() => setIsVoiceChatOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-emerald-300 hover:text-white border border-stone-700 hover:border-emerald-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Low-Latency Proximity Voice Chat & Radar"
          >
            <Mic size={14} className="text-emerald-400" />
            <span className="hidden md:inline">Voice</span>
          </button>

          {/* MegaWorld RP Videos Shortcut */}
          <button
            onClick={() => setIsVideosOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-red-300 hover:text-white border border-stone-700 hover:border-red-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open MegaWorld RP Cinema & Video Vault"
          >
            <span className="text-sm">🎬</span>
            <span className="hidden md:inline">Videos</span>
          </button>

          {/* Guilds & Factions Shortcut */}
          <button
            onClick={() => setIsGuildsOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-indigo-300 hover:text-white border border-stone-700 hover:border-indigo-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Guilds & Major Factions Hub"
          >
            <span className="text-sm">🛡️</span>
            <span className="hidden md:inline">Guilds</span>
          </button>

          {/* Daily Missions & Bounties Shortcut */}
          <button
            onClick={() => setIsDailyMissionsOpen(true)}
            className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-white border border-amber-500/50 hover:border-amber-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Daily Missions & Bounties (Randomized Tasks: Mine 50 Diamonds, Defeat Zombies, etc.) [Hotkey: J]"
          >
            <span className="text-sm animate-pulse">🎯</span>
            <span className="hidden sm:inline">Daily</span>
          </button>

          {/* Interactive World Map Button */}
          <button
            onClick={() => setIsWorldMapOpen(true)}
            className="bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 hover:text-white border border-emerald-500/50 hover:border-emerald-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Interactive Multiverse World Map (13 Brand Zones, Fast Travel, Dynamic Routes) [Hotkey: M]"
          >
            <span className="text-sm">🗺️</span>
            <span className="hidden sm:inline">World Map</span>
          </button>

          {/* Official LEGO Website Button */}
          <button
            onClick={() => setIsLegoWebsiteOpen(true)}
            className="bg-red-950/60 hover:bg-red-900/80 text-yellow-300 hover:text-white border border-red-500/50 hover:border-yellow-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Official LEGO.com Builder Universe & Minifigure Customizer"
          >
            <span className="text-sm">🧱</span>
            <span className="hidden sm:inline">LEGO.com</span>
          </button>

          {/* 1,000 Christmas Mega Edition Button */}
          <button
            onClick={() => setIsChristmasMegaModalOpen(true)}
            className="bg-red-950/60 hover:bg-red-900/80 text-red-200 hover:text-white border border-red-500/60 hover:border-red-400 px-2.5 py-1.5 rounded-xl text-xs font-black transition shadow flex items-center gap-1.5 cursor-pointer font-mono animate-pulse"
            title="Open 1,000 Christmas Characters, Items, and Settings"
          >
            <span className="text-sm">🎅</span>
            <span className="hidden sm:inline">1,000 Xmas</span>
          </button>

          {/* Multiverse Brand Hubs Button */}
          <button
            onClick={() => setIsBrandHubOpen(true)}
            className="bg-amber-950/50 hover:bg-amber-900/70 text-amber-300 hover:text-white border border-amber-500/50 hover:border-amber-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Multiverse Brand Hubs (McDonald's, Roblox, Xilam, Tarragower, BP, New World, YouTube)"
          >
            <span className="text-sm">🏢</span>
            <span className="hidden sm:inline">Brand Hubs</span>
          </button>

          {/* Detailed Countryball Creator Button */}
          <button
            onClick={() => setIsCountryballCreatorOpen(true)}
            className="bg-blue-950/50 hover:bg-blue-900/70 text-blue-300 hover:text-white border border-blue-500/50 hover:border-blue-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Detailed Polandball & Countryball Creator Studio"
          >
            <span className="text-sm">🌐</span>
            <span className="hidden sm:inline">CB Creator</span>
          </button>

          {/* Community Event Hubs Button */}
          <button
            onClick={() => setIsCommunityHubsOpen(true)}
            className="bg-teal-950/50 hover:bg-teal-900/70 text-teal-300 hover:text-white border border-teal-500/50 hover:border-teal-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Persistent Community Event Hubs & Spatial Voice Radio"
          >
            <span className="text-sm">🏛️</span>
            <span className="hidden sm:inline">Hubs</span>
          </button>

          {/* Cross-Platform Mini-Games Button */}
          <button
            onClick={() => setIsMiniGamesOpen(true)}
            className="bg-purple-950/50 hover:bg-purple-900/70 text-purple-300 hover:text-white border border-purple-500/50 hover:border-purple-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Cross-Platform Mini-Games Arcade (Scavenger Hunt, Trivia, Resource Race)"
          >
            <span className="text-sm">🎮</span>
            <span className="hidden sm:inline">Mini-Games</span>
          </button>

          {/* Unified Multiverse Lore Codex Button */}
          <button
            onClick={() => setIsLoreModalOpen(true)}
            className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 hover:text-white border border-amber-500/50 hover:border-amber-400 px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono"
            title="Open Unified Multiverse Lore Codex (Epochs, 10 Factions, Legends & Quest Hooks)"
          >
            <span className="text-sm">📜</span>
            <span className="hidden sm:inline">Lore Codex</span>
          </button>

          {/* Global Game Settings Button */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white border border-stone-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow flex items-center gap-1.5 cursor-pointer font-mono hover:border-yellow-400"
            title="Open Game Options & Settings (Audio, Graphics, Controls, Gameplay)"
          >
            <Settings size={14} className="text-yellow-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {/* User Status / Login */}
          {!user ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePlayAsGuest}
                className="bg-emerald-700 hover:bg-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold shadow transition flex items-center gap-1 cursor-pointer font-mono"
              >
                <UserCheck size={13} /> Guest
              </button>
              <button
                onClick={handleSignIn}
                disabled={signingIn}
                className="bg-sky-700 hover:bg-sky-600 px-3 py-1.5 rounded-xl text-xs font-bold disabled:opacity-50 transition flex items-center gap-1 cursor-pointer font-mono"
              >
                <LogIn size={13} /> {signingIn ? '...' : 'Sign In'}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-stone-800/80 px-2.5 py-1 rounded-xl border border-stone-700">
              <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-black text-black">
                {user.displayName?.charAt(0) || 'M'}
              </div>
              <span className="text-xs font-bold text-stone-200 font-mono hidden sm:inline">
                {user.displayName || 'Miner'}
              </span>
              <button
                onClick={() => auth.signOut()}
                className="text-xs text-red-400 hover:text-red-300 font-bold ml-1 cursor-pointer"
                title="Sign Out"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main View Router */}
      {activeView === 'menu' ? (
        <MainMenu
          onStartGame={(mode) => handleStartMode(mode)}
          onOpenGallery={() => setActiveView('gallery')}
          onOpenRoblox={() => setActiveView('roblox')}
          selectedAvatar={selectedAvatar}
          activeGameMode={activeGameMode}
          onChangeGameMode={setActiveGameMode}
          user={user}
          onSignIn={handleSignIn}
          onPlayGuest={handlePlayAsGuest}
          onSignOut={() => auth.signOut()}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAvatarStudio={() => setIsAvatarCreatorOpen(true)}
          onOpenQuests={() => setIsQuestHubOpen(true)}
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
          onOpenStore={() => setIsStoreOpen(true)}
          onOpenProgression={() => setIsProgressionOpen(true)}
          onOpenVoiceChat={() => setIsVoiceChatOpen(true)}
          onOpenDashboard={() => setActiveView('dashboard')}
          onOpenEditor={() => setActiveView('editor')}
          onOpenVideos={() => setIsVideosOpen(true)}
          onOpenGuilds={() => setIsGuildsOpen(true)}
          onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
          onOpenLoreCodex={() => setIsLoreModalOpen(true)}
          onOpenWorldMap={() => setIsWorldMapOpen(true)}
          onOpenLegoWebsite={() => setIsLegoWebsiteOpen(true)}
          onOpenCountryballCreator={() => setIsCountryballCreatorOpen(true)}
          onOpenCommunityHubs={() => setIsCommunityHubsOpen(true)}
          onOpenMiniGames={() => setIsMiniGamesOpen(true)}
          onOpenChristmasMegaModal={() => setIsChristmasMegaModalOpen(true)}
          onOpenBrandHubs={() => setIsBrandHubOpen(true)}
        />
      ) : activeView === 'game' ? (
        <GameWorld 
          selectedAvatar={selectedAvatar} 
          initialGameMode={activeGameMode}
          onChangeGameMode={setActiveGameMode}
          onQuitToMenu={() => setActiveView('menu')}
          onOpenRoblox={() => setActiveView('roblox')}
          onOpenProgression={() => setIsProgressionOpen(true)}
          onOpenVoiceChat={() => setIsVoiceChatOpen(true)}
          onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
          onOpenWorldMap={() => setIsWorldMapOpen(true)}
          onOpenLegoWebsite={() => setIsLegoWebsiteOpen(true)}
          onOpenCountryballCreator={() => setIsCountryballCreatorOpen(true)}
          onOpenCommunityHubs={() => setIsCommunityHubsOpen(true)}
          onOpenMiniGames={() => setIsMiniGamesOpen(true)}
        />
      ) : activeView === 'gallery' ? (
        <CharacterGallery
          onSelect={(char) => {
            setSelectedAvatar(char);
            setActiveView('game');
          }}
        />
      ) : activeView === 'roblox' ? (
        <RobloxApp
          onSelectAvatar={(char) => setSelectedAvatar(char)}
          onLaunchGame={() => setActiveView('game')}
          currentAvatar={selectedAvatar}
          onClose={() => setActiveView('menu')}
          onOpenCommunityDashboard={() => setActiveView('menu')}
          initialGameId={selectedRobloxExperienceId}
        />
      ) : activeView === 'editor' ? (
        <WorldEditor
          initialSchematic={customEditorLevel}
          onClose={() => setActiveView('menu')}
          onPlayInWorld={(customWorld) => {
            setActiveView('game');
          }}
          user={user}
          selectedAvatar={selectedAvatar}
        />
      ) : (
        <Dashboard
          user={user}
          selectedAvatar={selectedAvatar}
          activeGameMode={activeGameMode}
          onStartMode={(mode) => handleStartMode(mode)}
          onOpenAvatarStudio={() => setIsAvatarCreatorOpen(true)}
          onOpenQuests={() => setIsQuestHubOpen(true)}
          onOpenMarketplace={() => setIsMarketplaceOpen(true)}
          onOpenStore={() => setIsStoreOpen(true)}
          onOpenTitleMenu={() => setActiveView('menu')}
          onOpenEditor={() => setActiveView('editor')}
          onOpenVideos={() => setIsVideosOpen(true)}
          onOpenGuilds={() => setIsGuildsOpen(true)}
          onOpenDailyMissions={() => setIsDailyMissionsOpen(true)}
          onSelectRobloxExperience={(gameId) => {
            setSelectedRobloxExperienceId(gameId);
            setActiveView('roblox');
          }}
          onImportBuild={(schematic) => {
            setCustomEditorLevel(schematic);
            setActiveView('editor');
          }}
          onWarpToCoordinates={(x, y) => {
            setActiveView('game');
          }}
          onOpenLegoWebsite={() => setIsLegoWebsiteOpen(true)}
          onOpenCountryballCreator={() => setIsCountryballCreatorOpen(true)}
          onOpenCommunityHubs={() => setIsCommunityHubsOpen(true)}
          onOpenMiniGames={() => setIsMiniGamesOpen(true)}
        />
      )}

      {/* Global Game Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        activeGameMode={activeGameMode}
        onChangeGameMode={setActiveGameMode}
      />

      {/* Avatar Creator & Studio Modal */}
      <AvatarCreatorModal
        isOpen={isAvatarCreatorOpen}
        onClose={() => setIsAvatarCreatorOpen(false)}
        user={user}
        onAvatarEquipped={(char) => setSelectedAvatar(char)}
      />

      {/* Dynamic Quests & Scheduled Events Hub Modal */}
      <QuestAndEventsHub
        isOpen={isQuestHubOpen}
        onClose={() => setIsQuestHubOpen(false)}
        user={user}
        onJoinServer={(srv) => {
          setActiveGameMode('survival');
          setActiveView('game');
        }}
      />

      {/* Virtual Marketplace Modal */}
      <MarketplaceModal
        isOpen={isMarketplaceOpen}
        onClose={() => setIsMarketplaceOpen(false)}
        user={user}
      />

      {/* Cross-Platform 10-Brand Cosmetic Store Modal */}
      <CosmeticStoreModal
        isOpen={isStoreOpen}
        onClose={() => setIsStoreOpen(false)}
        user={user}
        currentAvatar={selectedAvatar}
      />

      {/* Cross-Platform Progression, Skills & Cloud Sync Modal */}
      <ProgressionModal
        isOpen={isProgressionOpen}
        onClose={() => setIsProgressionOpen(false)}
        user={user}
      />

      {/* Integrated Low-Latency Proximity Voice Chat & Radar Console */}
      <VoiceChatConsole
        isOpen={isVoiceChatOpen}
        onClose={() => setIsVoiceChatOpen(false)}
        user={user}
        currentAvatarName={selectedAvatar?.name || 'Player'}
      />

      {/* MegaWorld RP Cinema & Video Vault Modal */}
      <MegaWorldVideosModal
        isOpen={isVideosOpen}
        onClose={() => setIsVideosOpen(false)}
        user={user}
        currentAvatar={selectedAvatar}
        onWarpToScene={(x: number, y: number) => {
          setIsVideosOpen(false);
          setActiveView('game');
        }}
        onOpenVoiceChat={(freq?: string) => {
          setIsVoiceChatOpen(true);
        }}
      />

      {/* Guilds & Factions Hub Modal */}
      <GuildFactionModal
        isOpen={isGuildsOpen}
        onClose={() => setIsGuildsOpen(false)}
        user={user}
        currentAvatar={selectedAvatar}
        onJoinVoiceRadar={(freq?: string) => {
          setIsGuildsOpen(false);
          setIsVoiceChatOpen(true);
        }}
      />

      {/* Daily Missions & Bounties Modal */}
      <DailyMissionsModal
        isOpen={isDailyMissionsOpen}
        onClose={() => setIsDailyMissionsOpen(false)}
        user={user}
        onNavigateToGame={() => {
          setIsDailyMissionsOpen(false);
          setActiveView('game');
        }}
      />

      {/* Unified Multiverse Lore Codex Modal */}
      <UnifiedLoreCodexModal
        isOpen={isLoreModalOpen}
        onClose={() => setIsLoreModalOpen(false)}
      />

      {/* Interactive Multiverse World Map Modal */}
      {isWorldMapOpen && (
        <InteractiveWorldMapModal
          isOpen={isWorldMapOpen}
          onClose={() => setIsWorldMapOpen(false)}
          playerX={playerCoords.x}
          playerY={playerCoords.y}
          onFastTravel={(x: number, y: number) => {
            setPlayerCoords({ x, y });
            window.dispatchEvent(new CustomEvent('megaworld_warp_request', { detail: { x, y } }));
            setActiveView('game');
            setIsWorldMapOpen(false);
          }}
          playerAvatarName={selectedAvatar?.name || 'Player'}
        />
      )}

      {/* Official LEGO Website & Builder Portal Modal */}
      <LegoWebsiteModal
        isOpen={isLegoWebsiteOpen}
        onClose={() => setIsLegoWebsiteOpen(false)}
        user={user}
        onSpawnLegoBuild={() => {
          setIsLegoWebsiteOpen(false);
          setActiveView('game');
        }}
      />

      {/* Detailed Polandball & Countryball Creator Modal */}
      <CountryballCreatorModal
        isOpen={isCountryballCreatorOpen}
        onClose={() => setIsCountryballCreatorOpen(false)}
        user={user}
        onApplyCountryball={(cbData) => {
          setIsCountryballCreatorOpen(false);
          setActiveView('game');
        }}
      />

      {/* Persistent Community Event Hubs Modal */}
      <CommunityEventHubsModal
        isOpen={isCommunityHubsOpen}
        onClose={() => setIsCommunityHubsOpen(false)}
        user={user}
        onWarpToLocation={(coords) => {
          setPlayerCoords({ x: coords.x, y: coords.y });
          window.dispatchEvent(new CustomEvent('megaworld_warp_request', { detail: coords }));
          setIsCommunityHubsOpen(false);
          setActiveView('game');
        }}
      />

      {/* Cross-Platform Arcade & Mini-Games Modal */}
      <CrossPlatformMiniGamesModal
        isOpen={isMiniGamesOpen}
        onClose={() => setIsMiniGamesOpen(false)}
        user={user}
      />

      {/* 1,000 Christmas Characters, Items & Settings Modal */}
      <ChristmasMegaModal
        isOpen={isChristmasMegaModalOpen}
        onClose={() => setIsChristmasMegaModalOpen(false)}
        currentAvatar={selectedAvatar}
        user={user}
        onSelectCharacter={(char) => {
          setSelectedAvatar(char);
          setActiveView('game');
        }}
      />

      {/* Multiverse Brand Hubs & Outposts Modal */}
      <BrandHubModal
        isOpen={isBrandHubOpen}
        onClose={() => setIsBrandHubOpen(false)}
        user={user}
        onTeleportToHub={(coords, hubName) => {
          setPlayerCoords({ x: coords.x, y: coords.y });
          window.dispatchEvent(new CustomEvent('megaworld_warp_request', { detail: coords }));
          setIsBrandHubOpen(false);
          setActiveView('game');
        }}
      />
    </div>
  );
}
