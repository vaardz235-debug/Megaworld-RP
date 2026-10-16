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
import { 
  Gamepad2, 
  UserCheck, 
  Sparkles, 
  LogIn, 
  Swords, 
  Palette, 
  Home, 
  LayoutDashboard, 
  HelpCircle 
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Default to the iconic Minecraft 'menu'
  const [activeView, setActiveView] = useState<'menu' | 'game' | 'gallery' | 'dashboard'>('menu');
  // Default to Steve with his full Minecraft body
  const [selectedAvatar, setSelectedAvatar] = useState<any>(ALL_CHARACTERS[0]);
  // Game Mode State: 'survival' | 'creative'
  const [activeGameMode, setActiveGameMode] = useState<'survival' | 'creative'>('survival');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
      setLoading(false);
    });
    return unsubscribe;
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
            onClick={() => setActiveView('gallery')}
            className="flex items-center gap-2 bg-stone-800/90 hover:bg-stone-700/90 border border-stone-700 px-3 py-1.5 rounded-xl cursor-pointer transition shadow hover:border-emerald-400"
            title="Click to change your avatar"
          >
            <div className="w-6 h-8 overflow-hidden flex items-center justify-center -my-1">
              <CharacterAvatar character={selectedAvatar} size="sm" />
            </div>
            <div className="text-left font-mono">
              <div className="text-[9px] text-stone-400 uppercase">Skin</div>
              <div className="text-xs font-bold text-emerald-300 leading-tight">
                {selectedAvatar?.name || 'Steve'}
              </div>
            </div>
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

          {/* Dashboard Tab */}
          {activeView !== 'dashboard' && (
            <button
              onClick={() => setActiveView('dashboard')}
              className="bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 border border-stone-700 px-2.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer font-mono"
              title="View Community Dashboard"
            >
              <LayoutDashboard size={14} />
            </button>
          )}

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
          selectedAvatar={selectedAvatar}
          activeGameMode={activeGameMode}
          onChangeGameMode={setActiveGameMode}
          user={user}
          onSignIn={handleSignIn}
          onPlayGuest={handlePlayAsGuest}
          onSignOut={() => auth.signOut()}
        />
      ) : activeView === 'game' ? (
        <GameWorld 
          selectedAvatar={selectedAvatar} 
          initialGameMode={activeGameMode}
          onChangeGameMode={setActiveGameMode}
          onQuitToMenu={() => setActiveView('menu')}
        />
      ) : activeView === 'gallery' ? (
        <CharacterGallery
          onSelect={(char) => {
            setSelectedAvatar(char);
            setActiveView('game');
          }}
        />
      ) : (
        <main className="max-w-6xl mx-auto space-y-6">
          <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 border border-stone-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-black mb-2 text-white font-mono">
                MegaWorld RP Sandbox Dashboard
              </h2>
              <p className="text-stone-300 text-sm leading-relaxed mb-6 font-mono">
                Choose between hard-earned <strong>Survival Mode</strong> (hunger, health, mining, tool crafting) or infinite <strong>Creative Mode</strong> (unlimited blocks, instant breaking, flight, and invincibility)!
              </p>
              <div className="flex flex-wrap gap-3 font-mono">
                <button
                  onClick={() => handleStartMode('survival')}
                  className="mc-btn mc-btn-primary font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Swords size={18} className="text-yellow-400" /> Play Survival Mode
                </button>
                <button
                  onClick={() => handleStartMode('creative')}
                  className="mc-btn font-bold px-6 py-3 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <Palette size={18} className="text-purple-400" /> Play Creative Mode
                </button>
                <button
                  onClick={() => setActiveView('menu')}
                  className="mc-btn font-bold px-5 py-3 rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Home size={18} className="text-yellow-400" /> Title Menu
                </button>
              </div>
            </div>
            {/* Visual preview of Steve on right */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center pointer-events-none opacity-90">
              <CharacterAvatar character={selectedAvatar} size="xl" isWalking={true} heldItem="pickaxe" showName={true} />
            </div>
          </div>

          {/* Game Modes Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono">
            {/* Survival Mode Card */}
            <section className="bg-stone-900/90 border border-stone-800 hover:border-red-500/50 p-6 rounded-2xl flex flex-col justify-between shadow-xl transition">
              <div>
                <div className="w-10 h-10 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center justify-center text-xl mb-3 text-red-400">
                  <Swords size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span>Survival Mode</span>
                  <span className="text-[10px] uppercase bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full border border-red-500/30">
                    Hardcore
                  </span>
                </h3>
                <p className="text-stone-400 text-xs mb-4 leading-relaxed">
                  Depleting hunger and health, block mining, tool durability loss, resource consumption, farming wheat, and respawn upon death.
                </p>
              </div>
              <button
                onClick={() => handleStartMode('survival')}
                className="mc-btn mc-btn-primary px-4 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer self-start"
              >
                Start Survival
              </button>
            </section>

            {/* Creative Mode Card */}
            <section className="bg-stone-900/90 border border-stone-800 hover:border-purple-500/50 p-6 rounded-2xl flex flex-col justify-between shadow-xl transition">
              <div>
                <div className="w-10 h-10 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-xl mb-3 text-purple-400">
                  <Palette size={20} />
                </div>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <span>Creative Mode</span>
                  <span className="text-[10px] uppercase bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    God Mode
                  </span>
                </h3>
                <p className="text-stone-400 text-xs mb-4 leading-relaxed">
                  Infinite supply (∞) of all blocks, instant block breaking, flight mode, invincibility, weather/time commands, and quick 3x3 builders.
                </p>
              </div>
              <button
                onClick={() => handleStartMode('creative')}
                className="mc-btn px-4 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer self-start"
              >
                Start Creative
              </button>
            </section>

            <FriendsList />
          </div>
        </main>
      )}
    </div>
  );
}
