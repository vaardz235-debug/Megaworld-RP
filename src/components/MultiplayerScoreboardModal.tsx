import { useState, useMemo } from 'react';
import { WorldPlayer } from '../utils/multiplayerPlayers';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { 
  Users, Search, X, Wifi, Shield, Sparkles, 
  MapPin, UserCheck, MessageCircle
} from 'lucide-react';

interface MultiplayerScoreboardModalProps {
  players: WorldPlayer[];
  currentPlayerAvatar: CharacterData;
  currentPlayerPos: { x: number; y: number };
  onClose: () => void;
  onSelectPlayer: (player: WorldPlayer) => void;
  onWarpToPlayer: (player: WorldPlayer) => void;
}

export default function MultiplayerScoreboardModal({
  players,
  currentPlayerAvatar,
  currentPlayerPos,
  onClose,
  onSelectPlayer,
  onWarpToPlayer,
}: MultiplayerScoreboardModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All');

  // Zones for filter tabs
  const zones = useMemo(() => {
    const list = ['All', 'North Pole Village', 'Minecraft Overworld', 'Robloxia Cloud Spire', 'Knapford Central Hub', 'Geneva Sovereign Embassy', 'Sprunki Soundstage'];
    return list;
  }, []);

  const filteredPlayers = useMemo(() => {
    return players.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.activity.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesZone = selectedZoneFilter === 'All' || p.zone === selectedZoneFilter;
      return matchesSearch && matchesZone;
    });
  }, [players, searchQuery, selectedZoneFilter]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 select-none">
      <div className="bg-stone-900/98 border-2 border-emerald-500/80 rounded-3xl p-5 max-w-4xl w-full max-h-[88vh] flex flex-col shadow-[0_25px_60px_rgba(0,0,0,0.95)] font-mono text-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-emerald-500/30 to-cyan-500/30 text-emerald-300 rounded-2xl border border-emerald-500/40 shadow-inner">
              <Users size={22} className="text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  MegaWorld Multiverse Server #1
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/25 text-emerald-300 font-bold border border-emerald-500/40">
                    ONLINE: {players.length + 1}/100
                  </span>
                </h2>
              </div>
              <p className="text-xs text-stone-400 flex items-center gap-2">
                <span>US-East Region</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <Wifi size={12} /> 16ms Latency
                </span>
                <span>•</span>
                <span className="text-yellow-300">🎄 Christmas Multiverse Season Active</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Player Card Header Banner */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-stone-950/80 to-blue-950/80 border border-emerald-500/40 rounded-2xl p-3 mb-4 flex items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center scale-90">
              <CharacterAvatar character={currentPlayerAvatar} size="sm" isWalking={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-black uppercase">
                  HOST / YOU
                </span>
                <span className="text-sm font-bold text-white">
                  {currentPlayerAvatar.name}
                </span>
              </div>
              <span className="text-xs text-stone-400">
                Position: X:{currentPlayerPos.x}, Y:{currentPlayerPos.y} • Party Leader
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-xl bg-stone-800 text-emerald-300 border border-stone-700 font-bold">
              0ms Ping (Local)
            </span>
          </div>
        </div>

        {/* Search & Zone Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 mb-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by player name, activity, or zone..."
              className="w-full bg-stone-950/90 border border-stone-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Zone Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none text-xs">
            {zones.map(z => (
              <button
                key={z}
                onClick={() => setSelectedZoneFilter(z)}
                className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedZoneFilter === z
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                {z === 'All' ? '🌐 All Realms' : z}
              </button>
            ))}
          </div>
        </div>

        {/* Players List Table */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[50vh]">
          {filteredPlayers.length === 0 ? (
            <div className="py-12 text-center text-stone-500 text-xs">
              No players found matching &quot;{searchQuery}&quot;.
            </div>
          ) : (
            filteredPlayers.map(player => (
              <div
                key={player.id}
                onClick={() => onSelectPlayer(player)}
                className="bg-stone-950/70 hover:bg-stone-800/80 border border-stone-800 hover:border-emerald-500/50 rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-3 transition cursor-pointer group"
              >
                {/* Left: Avatar & Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 flex items-center justify-center scale-90 shrink-0">
                    <CharacterAvatar character={player.avatar} size="sm" isWalking={player.isWalking} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase shadow-sm ${player.rankBadgeColor}`}>
                        {player.rank}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-white truncate group-hover:text-emerald-300 transition">
                        {player.name}
                      </span>
                      <span className="text-[10px] text-yellow-400 font-bold">
                        Lv.{player.level}
                      </span>
                      {player.isPartyMember && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/30 text-blue-300 border border-blue-500/40">
                          PARTY
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5 truncate">
                      <span className="flex items-center gap-1 text-stone-400">
                        <MapPin size={11} className="text-red-400" />
                        {player.zone}
                      </span>
                      <span>•</span>
                      <span className="text-amber-300 truncate">
                        {player.activity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Holding Item, Ping & Warp Button */}
                <div className="flex items-center gap-3 shrink-0">
                  {/* Item Icon */}
                  <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
                    <span>{player.heldItemIcon}</span>
                    <span className="text-[10px] text-stone-300 capitalize truncate max-w-[90px]">
                      {player.heldItem.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Latency */}
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${
                    player.ping < 20 ? 'text-emerald-400' : player.ping < 40 ? 'text-cyan-400' : 'text-amber-400'
                  }`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {player.ping}ms
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onWarpToPlayer(player);
                      }}
                      className="px-2.5 py-1 bg-stone-800 hover:bg-emerald-600 hover:text-white text-stone-300 rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer border border-stone-700"
                      title="Warp to player's location"
                    >
                      ⚡ Warp
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectPlayer(player);
                      }}
                      className="px-2.5 py-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-[11px] font-bold transition active:scale-95 cursor-pointer shadow-sm"
                    >
                      Interact
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="border-t border-stone-800 pt-3 mt-3 flex items-center justify-between text-xs text-stone-400">
          <span>Click any player to High-Five, Trade, or Invite to Party</span>
          <span className="text-emerald-400 font-bold">Press [Tab] anytime to toggle</span>
        </div>
      </div>
    </div>
  );
}
