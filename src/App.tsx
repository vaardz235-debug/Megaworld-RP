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
import { avatarManager } from './utils/avatarManager';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Default to the iconic Minecraft 'menu'
  const [activeView, setActiveView] = useState<'menu' | 'game' | 'gallery' | 'dashboard' | 'roblox'>('menu');
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
          onImportBuild={(schematic) => {
            setActiveView('game');
          }}
          onWarpToCoordinates={(x, y) => {
            setActiveView('game');
          }}
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
    </div>
  );
}
