import React from 'react';
import { X, CheckCircle2, Award, Sparkles, MessageSquare, ChevronRight, Volume2 } from 'lucide-react';
import { speechEngine } from '../utils/speechEngine';

export interface Quest {
  id: string;
  npcId: string;
  npcName: string;
  title: string;
  description: string;
  requiredItem: string;
  requiredCount: number;
  rewardItem: string;
  rewardCount: number;
  rewardItem2?: string;
  rewardCount2?: number;
  xpReward?: number;
}

export interface NPC {
  id: string;
  name: string;
  title: string;
  biome: string;
  avatarColor: string;
  emoji: string;
  x: number;
  y: number;
  greeting: string;
  lore: string;
  quests: Quest[];
}

export const NPCS_DATA: NPC[] = [
  {
    id: 'npc_silas',
    name: 'Elder Silas',
    title: 'Forest Builder & Keeper',
    biome: 'Forest',
    avatarColor: 'bg-emerald-600',
    emoji: '🧙‍♂️',
    x: 25,
    y: 5,
    greeting: "Welcome, brave builder! The forest is alive with ancient energy, but the shadows whisper of danger.",
    lore: "Silas has watched over the Greenwood groves for over eighty winters. He needs lumber and sturdy doors to build shelters for wandering survivors.",
    quests: [
      {
        id: 'q_timber',
        npcId: 'npc_silas',
        npcName: 'Elder Silas',
        title: "Lumberjack's Bounty",
        description: "Gather 5 Wood from the forest trees to help reinforce our outpost.",
        requiredItem: 'wood',
        requiredCount: 5,
        rewardItem: 'diamond',
        rewardCount: 2,
        rewardItem2: 'apple',
        rewardCount2: 4,
        xpReward: 100,
      },
      {
        id: 'q_door',
        npcId: 'npc_silas',
        npcName: 'Elder Silas',
        title: "Securing the Sanctuary",
        description: "Craft and bring 1 Door so we can seal the shelter from wilderness storms.",
        requiredItem: 'door',
        requiredCount: 1,
        rewardItem: 'gold',
        rewardCount: 3,
        rewardItem2: 'golden_apple',
        rewardCount2: 2,
        xpReward: 150,
      }
    ]
  },
  {
    id: 'npc_tariq',
    name: 'Nomad Tariq',
    title: 'Desert Alchemist & Smelter',
    biome: 'Desert',
    avatarColor: 'bg-amber-600',
    emoji: '👳‍♂️',
    x: 95,
    y: 6,
    greeting: "Peace be with you, traveler of the sun. The scorching sands hold riches, if you know what to seek.",
    lore: "Tariq roams the great golden dunes seeking raw quartz, sand, and ore to synthesize rare netherite alloy.",
    quests: [
      {
        id: 'q_desert_sand',
        npcId: 'npc_tariq',
        npcName: 'Nomad Tariq',
        title: "Silica for the Furnace",
        description: "Mine 6 Sand blocks from the desert floor for my glass alchemy.",
        requiredItem: 'sand',
        requiredCount: 6,
        rewardItem: 'emerald',
        rewardCount: 3,
        rewardItem2: 'bread',
        rewardCount2: 3,
        xpReward: 120,
      },
      {
        id: 'q_rare_minerals',
        npcId: 'npc_tariq',
        npcName: 'Nomad Tariq',
        title: "Alchemical Catalyst",
        description: "Bring 4 Coal blocks to stoke the desert forge to smelting temperature.",
        requiredItem: 'coal',
        requiredCount: 4,
        rewardItem: 'netherite',
        rewardCount: 2,
        rewardItem2: 'bricks',
        rewardCount2: 5,
        xpReward: 200,
      }
    ]
  },
  {
    id: 'npc_freya',
    name: 'Frostguard Freya',
    title: 'Snow Peak Sentinel',
    biome: 'Snowy Peaks',
    avatarColor: 'bg-cyan-600',
    emoji: '🏹',
    x: 165,
    y: 3,
    greeting: "Stand firm, wanderer! The glacial winds spare no one. What brings you to the icy heights?",
    lore: "Freya patrols the freezing summits to protect the ancient glacial shrine. She rewards those who brave the freezing cold.",
    quests: [
      {
        id: 'q_snow_blocks',
        npcId: 'npc_freya',
        npcName: 'Frostguard Freya',
        title: "Permafrost Collection",
        description: "Harvest 6 Snow blocks from the peaks to reconstruct our avalanche barriers.",
        requiredItem: 'snow',
        requiredCount: 6,
        rewardItem: 'diamond',
        rewardCount: 3,
        rewardItem2: 'golden_apple',
        rewardCount2: 2,
        xpReward: 180,
      },
      {
        id: 'q_glacial_ice',
        npcId: 'npc_freya',
        npcName: 'Frostguard Freya',
        title: "Heart of the Glacier",
        description: "Mine 4 Ice blocks from deep below the mountain peaks.",
        requiredItem: 'ice',
        requiredCount: 4,
        rewardItem: 'netherite',
        rewardCount: 3,
        rewardItem2: 'emerald',
        rewardCount2: 3,
        xpReward: 250,
      }
    ]
  },
  {
    id: 'npc_oren',
    name: 'Oren (Sprunki DJ)',
    title: 'Rhythm Beatboxer & Sound Maestro',
    biome: 'Greenwood Outpost',
    avatarColor: 'bg-orange-500',
    emoji: '🎧',
    x: 22,
    y: 6,
    greeting: "Yo! B-b-boom chk-chk! Ready to drop some heavy sandbox beats across the biomes?",
    lore: "Oren is the legendary orange Sprunki beatboxer. He collects acoustic wood and rare ore to compose 8-bit chiptune rhythms for all miners.",
    quests: [
      {
        id: 'q_sprunki_beat',
        npcId: 'npc_oren',
        npcName: 'Oren (Sprunki DJ)',
        title: "Acoustic Resonance",
        description: "Bring 4 Wood and 2 Golden Apples so I can carve rhythm drum blocks for the outpost stage!",
        requiredItem: 'wood',
        requiredCount: 4,
        rewardItem: 'diamond',
        rewardCount: 4,
        rewardItem2: 'golden_apple',
        rewardCount2: 3,
        xpReward: 220,
      }
    ]
  },
  {
    id: 'npc_hiro',
    name: 'Hiro (Master of the Railway)',
    title: 'Sodor Railway Legend & Master Engineer',
    biome: 'Mountain Depot',
    avatarColor: 'bg-neutral-900',
    emoji: '🚂',
    x: 60,
    y: 6,
    greeting: "Greetings, young builder! The rails hum with ancient power. Do you wish to build tracks and keep the locomotives steaming?",
    lore: "Hiro is the grand D51 Mikado locomotive from Japan. Rescued and restored on the Island of Sodor, he guides builders to lay rails, mine iron, and keep the roundhouse stocked.",
    quests: [
      {
        id: 'q_train_tracks',
        npcId: 'npc_hiro',
        npcName: 'Hiro (Master of the Railway)',
        title: "Locomotive Steel & Coal",
        description: "Bring 4 Iron Ore and 4 Coal blocks to help forge sturdy rails and stoke locomotive fireboxes!",
        requiredItem: 'ore',
        requiredCount: 4,
        rewardItem: 'netherite',
        rewardCount: 2,
        rewardItem2: 'diamond',
        rewardCount2: 3,
        xpReward: 300,
      }
    ]
  }
];

interface QuestDialogueModalProps {
  npc: NPC;
  inventory: Record<string, { count: number; durability?: number }>;
  activeQuestIds: string[];
  completedQuestIds: string[];
  onAcceptQuest: (questId: string) => void;
  onTurnInQuest: (quest: Quest) => void;
  onClose: () => void;
}

export default function QuestDialogueModal({
  npc,
  inventory,
  activeQuestIds,
  completedQuestIds,
  onAcceptQuest,
  onTurnInQuest,
  onClose
}: QuestDialogueModalProps) {
  const [selectedQuestId, setSelectedQuestId] = React.useState<string>(
    npc.quests[0]?.id || ''
  );

  const selectedQuest = npc.quests.find(q => q.id === selectedQuestId) || npc.quests[0];

  const getItemCount = (itemName: string) => inventory[itemName]?.count || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-gray-900 border-2 border-yellow-500/80 rounded-xl shadow-2xl overflow-hidden flex flex-col text-white">
        {/* Header with NPC Theme */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg ${npc.avatarColor} border-2 border-white/80 shadow flex items-center justify-center text-2xl`}>
              {npc.emoji}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-yellow-400">{npc.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded bg-gray-800 border border-gray-700 text-gray-300">
                  {npc.biome} Biome
                </span>
              </div>
              <p className="text-xs text-gray-400">{npc.title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* NPC Dialogue Box */}
        <div className="bg-gray-950/70 px-6 py-3 border-b border-gray-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <MessageSquare size={18} className="text-yellow-400 mt-1 shrink-0" />
            <div>
              <p className="text-sm text-yellow-100 italic leading-relaxed">
                "{npc.greeting}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {npc.lore}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              speechEngine.speak(
                { id: 9999, name: npc.name, type: npc.id.includes('oren') ? 'sprnuki' : npc.id.includes('hiro') ? 'train' : 'minecraft' },
                npc.greeting
              );
            }}
            className="p-2 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/35 text-yellow-300 border border-yellow-500/40 cursor-pointer transition active:scale-95 shrink-0 flex items-center gap-1 text-xs font-mono font-bold"
            title="Read greeting aloud with character voice"
          >
            <Volume2 size={14} className="animate-pulse" />
            <span>Speak</span>
          </button>
        </div>

        {/* Main Content: Quest Selector & Quest Details */}
        <div className="grid grid-cols-1 md:grid-cols-5 flex-1 min-h-[300px]">
          {/* Left: Quest List */}
          <div className="md:col-span-2 border-r border-gray-800 bg-gray-900/60 p-3 space-y-2">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2">
              Available Tasks
            </h4>
            {npc.quests.map(quest => {
              const isCompleted = completedQuestIds.includes(quest.id);
              const isActive = activeQuestIds.includes(quest.id);
              const isSelected = quest.id === selectedQuestId;
              const hasItems = getItemCount(quest.requiredItem) >= quest.requiredCount;

              return (
                <button
                  key={quest.id}
                  onClick={() => setSelectedQuestId(quest.id)}
                  className={`w-full text-left p-2.5 rounded-lg border transition flex flex-col gap-1 ${
                    isSelected 
                      ? 'border-yellow-400 bg-yellow-400/10' 
                      : 'border-gray-800 hover:border-gray-700 bg-gray-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate text-white">
                      {quest.title}
                    </span>
                    {isCompleted && (
                      <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                    )}
                    {isActive && !isCompleted && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${hasItems ? 'bg-green-900 text-green-200' : 'bg-yellow-900 text-yellow-200'}`}>
                        {hasItems ? 'Ready!' : 'In Progress'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 truncate">
                    Needs: {quest.requiredCount}x {quest.requiredItem}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Selected Quest Details */}
          {selectedQuest ? (
            <div className="md:col-span-3 p-5 flex flex-col justify-between bg-gray-900/40">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      <Award size={18} className="text-yellow-400" />
                      {selectedQuest.title}
                    </h4>
                    {completedQuestIds.includes(selectedQuest.id) ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-green-900/60 border border-green-600 text-green-300 font-medium">
                        Completed
                      </span>
                    ) : activeQuestIds.includes(selectedQuest.id) ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-yellow-900/60 border border-yellow-600 text-yellow-300 font-medium">
                        Active Quest
                      </span>
                    ) : (
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-900/60 border border-blue-600 text-blue-300 font-medium">
                        Available
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">
                    {selectedQuest.description}
                  </p>
                </div>

                {/* Requirements Section */}
                <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/80">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide block mb-2">
                    Required Materials
                  </span>
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium text-white">
                      {selectedQuest.requiredItem}
                    </span>
                    <span className={`font-mono font-bold ${
                      getItemCount(selectedQuest.requiredItem) >= selectedQuest.requiredCount 
                        ? 'text-green-400' 
                        : 'text-amber-400'
                    }`}>
                      {getItemCount(selectedQuest.requiredItem)} / {selectedQuest.requiredCount}
                    </span>
                  </div>
                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-gray-700 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        getItemCount(selectedQuest.requiredItem) >= selectedQuest.requiredCount 
                          ? 'bg-green-500' 
                          : 'bg-yellow-500'
                      }`}
                      style={{ 
                        width: `${Math.min(100, (getItemCount(selectedQuest.requiredItem) / selectedQuest.requiredCount) * 100)}%` 
                      }}
                    />
                  </div>
                </div>

                {/* Rewards Section */}
                <div className="bg-gray-800/60 rounded-lg p-3 border border-gray-700/80">
                  <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wide flex items-center gap-1 mb-2">
                    <Sparkles size={14} /> Rewards on Completion
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <div className="px-2.5 py-1.5 rounded bg-gray-900 border border-yellow-500/50 flex items-center gap-1.5 text-xs text-yellow-300 font-semibold shadow-xs">
                      <span>{selectedQuest.rewardItem === 'diamond' ? '💎' : selectedQuest.rewardItem === 'emerald' ? '✨' : selectedQuest.rewardItem === 'netherite' ? '🔮' : '🪙'}</span>
                      <span className="capitalize">{selectedQuest.rewardItem}</span>
                      <span>x{selectedQuest.rewardCount}</span>
                    </div>
                    {selectedQuest.rewardItem2 && (
                      <div className="px-2.5 py-1.5 rounded bg-gray-900 border border-gray-700 flex items-center gap-1.5 text-xs text-gray-200 font-medium">
                        <span>{selectedQuest.rewardItem2.includes('apple') ? '🍏' : selectedQuest.rewardItem2 === 'bread' ? '🍞' : '🧱'}</span>
                        <span className="capitalize">{selectedQuest.rewardItem2.replace('_', ' ')}</span>
                        <span>x{selectedQuest.rewardCount2}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-3 border-t border-gray-800 flex justify-end gap-3">
                {completedQuestIds.includes(selectedQuest.id) ? (
                  <button 
                    disabled 
                    className="px-4 py-2 bg-gray-800 text-gray-500 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-not-allowed"
                  >
                    <CheckCircle2 size={16} /> Task Completed
                  </button>
                ) : activeQuestIds.includes(selectedQuest.id) ? (
                  <button
                    onClick={() => onTurnInQuest(selectedQuest)}
                    disabled={getItemCount(selectedQuest.requiredItem) < selectedQuest.requiredCount}
                    className={`px-5 py-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                      getItemCount(selectedQuest.requiredItem) >= selectedQuest.requiredCount
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white animate-pulse'
                        : 'bg-gray-800 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Sparkles size={16} /> Turn In & Claim Rewards
                  </button>
                ) : (
                  <button
                    onClick={() => onAcceptQuest(selectedQuest.id)}
                    className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-950 font-bold rounded-lg text-xs transition flex items-center gap-1 shadow-md"
                  >
                    Accept Task <ChevronRight size={16} />
                  </button>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
