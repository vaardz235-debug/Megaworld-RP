import { useState } from 'react';
import { WorldPlayer } from '../utils/multiplayerPlayers';
import CharacterAvatar from './CharacterAvatar';
import { 
  X, Sparkles, Gift, Swords, MessageSquare, 
  UserCheck, Shield, Award, Heart, Send, Check
} from 'lucide-react';

interface PlayerInteractionModalProps {
  player: WorldPlayer;
  playerInventory: Record<string, { count: number }>;
  onClose: () => void;
  onTradeItem: (targetPlayer: WorldPlayer, itemKey: string) => void;
  onHighFive: (targetPlayer: WorldPlayer) => void;
  onDuel: (targetPlayer: WorldPlayer) => void;
  onToggleParty: (targetPlayer: WorldPlayer) => void;
  onSendWhisper: (targetPlayer: WorldPlayer, message: string) => void;
}

export default function PlayerInteractionModal({
  player,
  playerInventory,
  onClose,
  onTradeItem,
  onHighFive,
  onDuel,
  onToggleParty,
  onSendWhisper,
}: PlayerInteractionModalProps) {
  const [selectedGiftItem, setSelectedGiftItem] = useState<string>('candy_cane_blade');
  const [whisperMessage, setWhisperMessage] = useState('');
  const [recentReply, setRecentReply] = useState<string | null>(null);
  const [highFiveSuccess, setHighFiveSuccess] = useState(false);

  const availableGiftItems = Object.entries(playerInventory)
    .filter(([_, data]) => (data.count || 0) > 0)
    .map(([key, data]) => ({ key, count: data.count }));

  const handleSendWhisper = () => {
    if (!whisperMessage.trim()) return;
    onSendWhisper(player, whisperMessage.trim());
    const replies = [
      `Thanks for messaging, ${player.name} says hello back!`,
      `"Awesome to meet you! Happy holidays!" 🎄`,
      `"Let's explore the world together!" ✨`,
      `"Thanks! Need any help with mining or quests?" ⛏️`,
      `"GG! Check out the Christmas workshop near spawn!" 🎁`,
    ];
    setRecentReply(replies[Math.floor(Math.random() * replies.length)]);
    setWhisperMessage('');
  };

  const handleHighFiveClick = () => {
    onHighFive(player);
    setHighFiveSuccess(true);
    setTimeout(() => setHighFiveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-stone-900 border-2 border-emerald-500/80 rounded-3xl p-5 max-w-md w-full shadow-[0_20px_50px_rgba(0,0,0,0.9)] font-mono text-white relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/40 shadow-inner">
              <Award size={20} className="text-yellow-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase shadow-sm ${player.rankBadgeColor}`}>
                  {player.rank}
                </span>
                <h3 className="text-base font-bold text-white truncate max-w-[180px]">
                  {player.name}
                </h3>
              </div>
              <p className="text-[11px] text-stone-400">
                Level {player.level} • {player.zone} • {player.ping}ms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white cursor-pointer transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Player Avatar Preview Card */}
        <div className="bg-stone-950/80 rounded-2xl p-4 border border-stone-800 flex items-center justify-between gap-4 mb-4">
          <div className="flex flex-col items-center justify-center w-24">
            <div className="scale-90 transform-gpu">
              <CharacterAvatar character={player.avatar} size="sm" isWalking={player.isWalking} />
            </div>
            <span className="text-[10px] text-stone-500 mt-2 font-mono">
              {player.avatar.name}
            </span>
          </div>

          <div className="flex-1 space-y-1.5 text-xs">
            <div className="flex items-center justify-between text-stone-300">
              <span className="text-stone-400">Activity:</span>
              <span className="font-bold text-amber-300">{player.activity}</span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span className="text-stone-400">Holding:</span>
              <span className="font-bold text-cyan-300 flex items-center gap-1">
                <span>{player.heldItemIcon}</span>
                <span className="capitalize">{player.heldItem.replace(/_/g, ' ')}</span>
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span className="text-stone-400">Health:</span>
              <span className="font-bold text-red-400 flex items-center gap-1">
                <Heart size={12} className="fill-red-500 text-red-500" />
                {player.health}/{player.maxHealth}
              </span>
            </div>
            <div className="flex items-center justify-between text-stone-300">
              <span className="text-stone-400">Status:</span>
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Online & Active
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {/* High Five */}
          <button
            onClick={handleHighFiveClick}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
              highFiveSuccess
                ? 'bg-emerald-600 border-emerald-400 text-white'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
            }`}
          >
            {highFiveSuccess ? <Check size={14} className="text-yellow-300" /> : <Sparkles size={14} className="text-yellow-400" />}
            <span>{highFiveSuccess ? 'High Five Sent!' : '🤝 High Five (+15 XP)'}</span>
          </button>

          {/* Party Toggle */}
          <button
            onClick={() => onToggleParty(player)}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer ${
              player.isPartyMember
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-200'
            }`}
          >
            <UserCheck size={14} className={player.isPartyMember ? 'text-white' : 'text-blue-400'} />
            <span>{player.isPartyMember ? 'Leave Party' : '👥 Invite to Party'}</span>
          </button>

          {/* Friendly Snowball Spar / Duel */}
          <button
            onClick={() => onDuel(player)}
            className="py-2 px-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Swords size={14} className="text-red-400" />
            <span>⚔️ Snowball Spar</span>
          </button>

          {/* Defend / Shield */}
          <button
            onClick={() => onHighFive(player)}
            className="py-2 px-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <Shield size={14} className="text-cyan-400" />
            <span>🛡️ Cheer On</span>
          </button>
        </div>

        {/* Gift / Trade Section */}
        <div className="bg-stone-950/90 rounded-2xl p-3 border border-stone-800 mb-4">
          <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5 mb-2">
            <Gift size={13} className="text-red-400" />
            <span>Send Holiday Gift / Trade Item:</span>
          </label>
          <div className="flex items-center gap-2">
            <select
              value={selectedGiftItem}
              onChange={(e) => setSelectedGiftItem(e.target.value)}
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-stone-200 font-mono focus:outline-none focus:border-emerald-500"
            >
              {availableGiftItems.length > 0 ? (
                availableGiftItems.map(item => (
                  <option key={item.key} value={item.key}>
                    {item.key.replace(/_/g, ' ')} (x{item.count})
                  </option>
                ))
              ) : (
                <option value="candy_cane_blade">Peppermint Candy Cane Blade (Gift)</option>
              )}
            </select>
            <button
              onClick={() => onTradeItem(player, selectedGiftItem)}
              className="px-3 py-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer shadow-md"
            >
              <span>🎁 Gift</span>
            </button>
          </div>
        </div>

        {/* Whisper / Chat Section */}
        <div className="bg-stone-950/90 rounded-2xl p-3 border border-stone-800">
          <label className="text-[11px] font-bold text-stone-300 flex items-center gap-1.5 mb-2">
            <MessageSquare size={13} className="text-amber-400" />
            <span>Whisper to {player.name}:</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={whisperMessage}
              onChange={(e) => setWhisperMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendWhisper();
              }}
              placeholder="Type holiday message or trade offer..."
              className="flex-1 bg-stone-800 border border-stone-700 rounded-xl px-2.5 py-1.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={handleSendWhisper}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black rounded-xl text-xs font-bold flex items-center gap-1 transition active:scale-95 cursor-pointer"
            >
              <Send size={12} />
              <span>Send</span>
            </button>
          </div>

          {recentReply && (
            <div className="mt-2.5 p-2 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-200 flex items-start gap-1.5">
              <span>💬</span>
              <span><strong>{player.name}:</strong> {recentReply}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
