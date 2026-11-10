import React from 'react';
import { 
  Swords, Palette, Home, Sparkles, LayoutDashboard, 
  Gamepad2, Compass, Shield, Flame, Gem, ShoppingBag, 
  FolderPlus, ChevronRight, Layers, Users
} from 'lucide-react';
import CharacterAvatar from './CharacterAvatar';
import FriendsList from './FriendsList';
import SocialFeed from './SocialFeed';
import { BuildSchematic } from '../utils/socialFeedManager';

interface DashboardProps {
  user: any;
  selectedAvatar: any;
  activeGameMode: 'survival' | 'creative';
  onStartMode: (mode: 'survival' | 'creative') => void;
  onOpenAvatarStudio: () => void;
  onOpenQuests: () => void;
  onOpenMarketplace: () => void;
  onOpenStore: () => void;
  onOpenTitleMenu: () => void;
  onImportBuild?: (schematic: BuildSchematic) => void;
  onWarpToCoordinates?: (x: number, y: number) => void;
  onOpenEditor?: () => void;
  onOpenVideos?: () => void;
  onOpenGuilds?: () => void;
  onOpenDailyMissions?: () => void;
  onSelectRobloxExperience?: (gameId: string) => void;
  onOpenLegoWebsite?: () => void;
  onOpenCountryballCreator?: () => void;
  onOpenCommunityHubs?: () => void;
  onOpenMiniGames?: () => void;
}

export default function Dashboard({
  user,
  selectedAvatar,
  activeGameMode,
  onStartMode,
  onOpenAvatarStudio,
  onOpenQuests,
  onOpenMarketplace,
  onOpenStore,
  onOpenTitleMenu,
  onImportBuild,
  onWarpToCoordinates,
  onOpenEditor,
  onOpenVideos,
  onOpenGuilds,
  onOpenDailyMissions,
  onSelectRobloxExperience,
  onOpenLegoWebsite,
  onOpenCountryballCreator,
  onOpenCommunityHubs,
  onOpenMiniGames,
}: DashboardProps) {
  return (
    <main className="max-w-6xl mx-auto space-y-8 font-mono pb-12">
      {/* ================= HERO DASHBOARD BANNER ================= */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-bold mb-3">
            <Sparkles size={12} className="text-yellow-400" />
            <span>200,000,000 Billion Block Multiverse</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2 text-white font-mono tracking-tight">
            MegaWorld RP Sandbox Dashboard
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed mb-6 font-mono">
            Explore 10 crossover universes, build in the 2D/3D sandbox, share schematics in the live <strong>Social Feed</strong>, or embark on voice-coordinated team raids!
          </p>

          <div className="flex flex-wrap gap-2.5 font-mono">
            <button
              type="button"
              onClick={() => onStartMode('survival')}
              className="mc-btn mc-btn-primary font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm"
            >
              <Swords size={16} className="text-yellow-400" /> 
              <span>Play Survival Mode</span>
            </button>

            <button
              type="button"
              onClick={() => onStartMode('creative')}
              className="mc-btn font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm"
            >
              <Palette size={16} className="text-purple-400" /> 
              <span>Play Creative Mode</span>
            </button>

            {onOpenEditor && (
              <button
                type="button"
                onClick={onOpenEditor}
                className="mc-btn font-bold px-5 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 cursor-pointer active:scale-95 text-xs sm:text-sm bg-amber-950/40 border border-amber-500/60 text-amber-200 hover:text-white"
                title="Open World & Level Editor to create and edit custom levels"
              >
                <span className="text-base">🛠️</span> 
                <span>World & Level Editor</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenAvatarStudio}
              className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-amber-300 text-xs sm:text-sm"
              title="Open Avatar Studio"
            >
              <span>🎨</span> 
              <span>Avatar Studio</span>
            </button>

            <button
              type="button"
              onClick={onOpenStore}
              className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-amber-400 text-xs sm:text-sm"
              title="Open Cosmetic Store"
            >
              <span>🛍️</span> 
              <span>Cosmetic Store</span>
            </button>

            {onOpenDailyMissions && (
              <button
                type="button"
                onClick={onOpenDailyMissions}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-amber-300 hover:text-white bg-amber-950/40 border border-amber-500/50 text-xs sm:text-sm"
                title="Open Daily Missions & 7-Day Adventurer Streak"
              >
                <span>🎯</span> 
                <span>Daily Missions</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenQuests}
              className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-emerald-300 text-xs sm:text-sm"
              title="Open Quests & Events"
            >
              <span>📜</span> 
              <span>Quests</span>
            </button>

            <button
              type="button"
              onClick={onOpenMarketplace}
              className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-yellow-300 text-xs sm:text-sm"
              title="Open Marketplace"
            >
              <span>⚖️</span> 
              <span>Market</span>
            </button>

            {onOpenVideos && (
              <button
                type="button"
                onClick={onOpenVideos}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-red-300 hover:text-white bg-red-950/40 border border-red-500/50 text-xs sm:text-sm"
                title="Watch MegaWorld RP Cinema Videos"
              >
                <span>🎬</span> 
                <span>RP Videos</span>
              </button>
            )}

            {onOpenGuilds && (
              <button
                type="button"
                onClick={onOpenGuilds}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-indigo-300 hover:text-white bg-indigo-950/40 border border-indigo-500/50 text-xs sm:text-sm"
                title="Open Guilds & Factions Hub"
              >
                <span>🛡️</span> 
                <span>Guilds & Factions</span>
              </button>
            )}

            {onOpenLegoWebsite && (
              <button
                type="button"
                onClick={onOpenLegoWebsite}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-yellow-300 hover:text-white bg-red-950/50 border border-red-500/60 text-xs sm:text-sm"
                title="Open Official LEGO.com Builder Universe & Minifigure Studio"
              >
                <span>🧱</span> 
                <span>LEGO.com</span>
              </button>
            )}

            {onOpenCountryballCreator && (
              <button
                type="button"
                onClick={onOpenCountryballCreator}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-blue-200 hover:text-white bg-blue-950/50 border border-blue-500/60 text-xs sm:text-sm"
                title="Open Sovereign Countryball Creator Studio"
              >
                <span>🌐</span> 
                <span>CB Creator</span>
              </button>
            )}

            {onOpenCommunityHubs && (
              <button
                type="button"
                onClick={onOpenCommunityHubs}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-teal-200 hover:text-white bg-teal-950/50 border border-teal-500/60 text-xs sm:text-sm"
                title="Open Persistent Community Event Hubs & Spatial Voice Radio"
              >
                <span>🏛️</span> 
                <span>Event Hubs</span>
              </button>
            )}

            {onOpenMiniGames && (
              <button
                type="button"
                onClick={onOpenMiniGames}
                className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-purple-200 hover:text-white bg-purple-950/50 border border-purple-500/60 text-xs sm:text-sm"
                title="Open Cross-Platform Mini-Games Arcade"
              >
                <span>🎮</span> 
                <span>Mini-Games</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenTitleMenu}
              className="mc-btn font-bold px-4 py-2.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer text-xs sm:text-sm"
              title="Return to Main Title Screen"
            >
              <Home size={15} className="text-yellow-400" /> 
              <span>Title Menu</span>
            </button>
          </div>
        </div>

        {/* Visual preview of Active Avatar on the right */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center pointer-events-none opacity-90 scale-110">
          <CharacterAvatar character={selectedAvatar} size="xl" isWalking={true} heldItem="pickaxe" showName={true} />
        </div>
      </div>

      {/* ================= GAME MODES & FRIENDS OVERVIEW ================= */}
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
              Depleting hunger and health, block mining, tool durability depletion, resource crafting, wheat farming, and respawn mechanics.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartMode('survival')}
            className="mc-btn mc-btn-primary px-4 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer self-start active:scale-95"
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
              Infinite supply (∞) of all blocks, instant block breaking, flight mode, invincibility, weather/time commands, and 3x3 instant builders.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onStartMode('creative')}
            className="mc-btn px-4 py-2.5 rounded-xl font-bold text-xs shadow transition cursor-pointer self-start active:scale-95"
          >
            Start Creative
          </button>
        </section>

        {/* Real-time Multiplayer Friends List */}
        <FriendsList />
      </div>

      {/* ================= SOCIAL FEED MODULE ================= */}
      <section>
        <SocialFeed
          user={user}
          onImportBuild={onImportBuild}
          onWarpToCoordinates={onWarpToCoordinates}
          onSelectRobloxExperience={onSelectRobloxExperience}
        />
      </section>
    </main>
  );
}
