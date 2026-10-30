import React, { useState, useEffect } from 'react';
import { 
  X, Swords, Award, Sparkles, Clock, Users, Shield, Server, Plus, 
  CheckCircle2, ChevronRight, Zap, Trophy, Flame, Play, HelpCircle, 
  RotateCcw, Compass, ArrowRight, Star, Heart
} from 'lucide-react';
import { 
  questEventManager, 
  QUESTS_CATALOG, 
  INITIAL_EVENTS, 
  INITIAL_RANDOM_OCCURRENCES,
  INITIAL_COMMUNITY_GOAL,
  QuestDef, 
  ScheduledEvent, 
  RandomOccurrence,
  CommunityGoal,
  CustomServer, 
  PlayerQuestsState 
} from '../utils/questEventManager';
import { avatarManager } from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';

interface QuestAndEventsHubProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onJoinServer?: (server: CustomServer) => void;
}

export default function QuestAndEventsHub({
  isOpen,
  onClose,
  user,
  onJoinServer,
}: QuestAndEventsHubProps) {
  const [activeTab, setActiveTab] = useState<'quests' | 'events' | 'random' | 'servers'>('quests');
  const [questCategory, setQuestCategory] = useState<'all' | 'fetch' | 'combat' | 'puzzle' | 'territory' | 'interaction'>('all');
  const [questState, setQuestState] = useState<PlayerQuestsState>(questEventManager.getLocalState());
  const [events, setEvents] = useState<ScheduledEvent[]>(INITIAL_EVENTS);
  const [randomOccurrences, setRandomOccurrences] = useState<RandomOccurrence[]>(INITIAL_RANDOM_OCCURRENCES);
  const [communityGoal, setCommunityGoal] = useState<CommunityGoal>(INITIAL_COMMUNITY_GOAL);
  const [servers, setServers] = useState<CustomServer[]>(questEventManager.getServers());
  
  // Interactive Dialogue State
  const [activeDialogueQuest, setActiveDialogueQuest] = useState<QuestDef | null>(null);
  const [dialogueReplies, setDialogueReplies] = useState<{ option: string; reply: string }[]>([]);

  // Territory Control State
  const [activeTerritoryQuest, setActiveTerritoryQuest] = useState<QuestDef | null>(null);
  const [territoryPercent, setTerritoryPercent] = useState<number>(0);

  // Interactive Puzzle State
  const [activePuzzleQuest, setActivePuzzleQuest] = useState<QuestDef | null>(null);
  const [puzzleNodes, setPuzzleNodes] = useState<{ id: string; label: string; active: boolean }[]>([]);
  const [burgerSteps, setBurgerSteps] = useState<string[]>([]);
  const [puzzleSolved, setPuzzleSolved] = useState(false);

  // Host Server Modal State
  const [isHostingServer, setIsHostingServer] = useState(false);
  const [newServerName, setNewServerName] = useState('Epic Cross-Brand Roleplay Sandbox');
  const [newServerTheme, setNewServerTheme] = useState<'minecraft' | 'roblox' | 'countryballs' | 'xilam' | 'cross_brand'>('cross_brand');
  const [newServerPvP, setNewServerPvP] = useState(false);
  const [newServerGravity, setNewServerGravity] = useState<'normal' | 'low' | 'float'>('normal');
  const [newServerSpeed, setNewServerSpeed] = useState(1.0);
  const [newServerKeepInv, setNewServerKeepInv] = useState(true);

  // Toast / Feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      questEventManager.loadFromCloud(user?.uid).then((st) => setQuestState(st));
      setServers(questEventManager.getServers());
    }
  }, [isOpen, user]);

  // Real-time ticking timer for scheduled events and random occurrences
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setEvents((prev) =>
        prev.map((evt) => {
          if (evt.countdownSeconds <= 1) {
            return {
              ...evt,
              countdownSeconds: evt.status === 'LIVE_NOW' ? 1800 : 900,
              status: evt.status === 'UPCOMING' ? 'LIVE_NOW' : 'CONCLUDED',
            };
          }
          return { ...evt, countdownSeconds: evt.countdownSeconds - 1 };
        })
      );

      setRandomOccurrences((prev) =>
        prev.map((occ) => {
          if (occ.remainingSeconds <= 1) {
            return {
              ...occ,
              remainingSeconds: occ.totalSeconds,
            };
          }
          return { ...occ, remainingSeconds: occ.remainingSeconds - 1 };
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleParticipateRandom = (occId: string) => {
    audioEngine.playMinecraftSound('pop');
    setRandomOccurrences((prev) =>
      prev.map((occ) => {
        if (occ.id !== occId) return occ;
        const nextProgress = occ.progressCount + 1;
        const isComplete = nextProgress >= occ.targetCount;
        if (isComplete) {
          audioEngine.playMinecraftSound('levelup');
          // Grant rewards to player wallet
          const customAvatarData = avatarManager.getLocalCustomization();
          avatarManager.saveToCloud(user?.uid, {
            ...customAvatarData,
            coins: customAvatarData.coins + occ.reward.coins,
            robux: customAvatarData.robux + (occ.reward.robux || 0),
          });
          // Contribute points to global community goal
          setCommunityGoal((cg) => {
            const nextPoints = Math.min(cg.maxTarget, cg.totalPoints + 75);
            return {
              ...cg,
              totalPoints: nextPoints,
              tier2Unlocked: nextPoints >= 3500,
              tier3Unlocked: nextPoints >= 5000,
            };
          });
          showToast(`🎉 Completed "${occ.name}"! Gained +${occ.reward.coins} Coins, +${occ.reward.xp} XP & +75 Server Milestone Pts!`);
          return {
            ...occ,
            progressCount: occ.targetCount,
            activeStatus: 'RESOLVED',
          };
        } else {
          showToast(`Progress logged: ${nextProgress}/${occ.targetCount} for "${occ.name}"!`);
          return {
            ...occ,
            progressCount: nextProgress,
          };
        }
      })
    );
  };

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleAdvanceQuest = (quest: QuestDef) => {
    audioEngine.playMinecraftSound('pop');
    const nextState = questEventManager.advanceProgress(questState, quest.id, 1);
    setQuestState(nextState);
    questEventManager.saveToCloud(user?.uid, nextState);
    showToast(`Tracked progress for "${quest.title}"!`);
  };

  const handleClaimReward = (quest: QuestDef) => {
    try {
      const { state: updatedState, reward } = questEventManager.claimReward(questState, quest.id);
      audioEngine.playMinecraftSound('levelup');
      setQuestState(updatedState);
      questEventManager.saveToCloud(user?.uid, updatedState);

      // Add coins / robux to avatar manager wallet
      const customAvatarData = avatarManager.getLocalCustomization();
      const newCustom = {
        ...customAvatarData,
        coins: customAvatarData.coins + reward.coins,
        robux: customAvatarData.robux + (reward.robux || 0),
        unlockedCosmetics: reward.cosmeticUnlockId && !customAvatarData.unlockedCosmetics.includes(reward.cosmeticUnlockId)
          ? [...customAvatarData.unlockedCosmetics, reward.cosmeticUnlockId]
          : customAvatarData.unlockedCosmetics,
      };
      avatarManager.saveToCloud(user?.uid, newCustom);

      showToast(`Claimed: +${reward.coins} Coins, +${reward.xp} XP${reward.robux ? `, +${reward.robux} Robux` : ''}!`);
    } catch (e: any) {
      showToast(e.message || 'Could not claim reward');
    }
  };

  // Interactive Puzzle Handlers
  const handleOpenPuzzle = (quest: QuestDef) => {
    audioEngine.playMinecraftSound('click');
    setActivePuzzleQuest(quest);
    setPuzzleSolved(false);
    if (quest.puzzleData?.type === 'logic_circuit' && quest.puzzleData.nodes) {
      setPuzzleNodes(quest.puzzleData.nodes.map(n => ({ ...n, active: false })));
    } else if (quest.puzzleData?.type === 'burger_recipe') {
      setBurgerSteps([]);
    } else if (quest.puzzleData?.type === 'treaty_match' && quest.puzzleData.nodes) {
      setPuzzleNodes(quest.puzzleData.nodes.map(n => ({ ...n, active: false })));
    }
  };

  const handleToggleLogicNode = (id: string) => {
    audioEngine.playMinecraftSound('click');
    setPuzzleNodes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n));
      // Solution check: gate_1, gate_3, gate_4 active and gate_2 false
      const activeIds = next.filter((n) => n.active).map((n) => n.id).sort();
      const isCorrect = JSON.stringify(activeIds) === JSON.stringify(['gate_1', 'gate_3', 'gate_4']);
      if (isCorrect) {
        setPuzzleSolved(true);
        audioEngine.playMinecraftSound('orb');
      }
      return next;
    });
  };

  const handleAddBurgerIngredient = (ingredient: string) => {
    audioEngine.playMinecraftSound('pop');
    setBurgerSteps((prev) => {
      const next = [...prev, ingredient];
      const target = ['bun', 'patty', 'cheese', 'sauce'];
      if (next.length === 4) {
        if (JSON.stringify(next) === JSON.stringify(target)) {
          setPuzzleSolved(true);
          audioEngine.playMinecraftSound('orb');
        } else {
          showToast('Wrong recipe order! Click reset to try again.');
        }
      }
      return next;
    });
  };

  const handleToggleTreatyNode = (id: string) => {
    audioEngine.playMinecraftSound('click');
    setPuzzleNodes((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, active: !n.active } : n));
      const activeCount = next.filter((n) => n.active && n.id !== 'uk_treaty').length;
      if (activeCount === 3 && !next.find(n => n.id === 'uk_treaty')?.active) {
        setPuzzleSolved(true);
        audioEngine.playMinecraftSound('orb');
      }
      return next;
    });
  };

  const handleCompletePuzzleAndClaim = () => {
    if (!activePuzzleQuest) return;
    const nextState = questEventManager.advanceProgress(questState, activePuzzleQuest.id, 1);
    setQuestState(nextState);
    questEventManager.saveToCloud(user?.uid, nextState);
    handleClaimReward(activePuzzleQuest);
    setActivePuzzleQuest(null);
  };

  const handleSelectDialogueOption = (quest: QuestDef, opt: { label: string; reply: string; progressGranted?: number }) => {
    audioEngine.playMinecraftSound('orb');
    setDialogueReplies((prev) => [...prev, { option: opt.label, reply: opt.reply }]);
    const nextState = questEventManager.advanceProgress(questState, quest.id, opt.progressGranted || 1);
    setQuestState(nextState);
    questEventManager.saveToCloud(user?.uid, nextState);
    if ((nextState.activeQuestProgress[quest.id] || 0) >= quest.targetCount) {
      audioEngine.playMinecraftSound('levelup');
      showToast(`🎉 Completed all dialogue steps with ${quest.npcName}! Claim your rewards!`);
    }
  };

  const handleCaptureTerritoryStep = (quest: QuestDef) => {
    audioEngine.playMinecraftSound('anvil');
    setTerritoryPercent((prev) => {
      const next = Math.min(100, prev + 35);
      if (next >= 100) {
        audioEngine.playMinecraftSound('levelup');
        const nextState = questEventManager.advanceProgress(questState, quest.id, 1);
        setQuestState(nextState);
        questEventManager.saveToCloud(user?.uid, nextState);
        showToast(`🚩 Captured & Fortified ${quest.territoryData?.locationName || 'Outpost'}! Claim rewards!`);
      }
      return next;
    });
  };

  // Boss Battle Cooperative Raid Strike
  const handleStrikeBoss = (eventId: string) => {
    audioEngine.playMinecraftSound('anvil');
    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id === eventId && evt.bossHp) {
          const nextHp = Math.max(0, evt.bossHp - 160);
          return { ...evt, bossHp: nextHp };
        }
        return evt;
      })
    );
    showToast('💥 Team Strike landed on Boss! -160 Boss HP & +40 Coins earned!');
  };

  // Host Custom Server
  const handleCreateServer = () => {
    const newSrv: CustomServer = {
      id: `srv_${Date.now()}`,
      name: newServerName.trim() || 'Custom Multi-World Arena',
      hostUid: user?.uid || 'guest-host',
      hostName: user?.displayName || 'Steve Host',
      theme: newServerTheme,
      region: 'US-East (Virginia)',
      playerCount: 1,
      maxPlayers: 32,
      pvpEnabled: newServerPvP,
      gravity: newServerGravity,
      speedMultiplier: newServerSpeed,
      keepInventory: newServerKeepInv,
      isOnline: true,
    };
    audioEngine.playMinecraftSound('levelup');
    const updated = questEventManager.addCustomServer(newSrv);
    setServers(updated);
    setIsHostingServer(false);
    showToast(`Server "${newSrv.name}" created and hosted successfully!`);
  };

  // Filtered Quests
  const filteredQuests = QUESTS_CATALOG.filter((q) => {
    if (questCategory === 'all') return true;
    return q.category === questCategory;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-stone-900 border-2 border-emerald-500/60 rounded-3xl w-full max-w-5xl shadow-[0_15px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-emerald-950/40 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              📜
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                Quests, Events & Servers Hub
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Live Sync
                </span>
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Themed missions, live tournaments, boss battles & custom servers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="bg-emerald-500 text-stone-950 px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md">
            <Sparkles size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Primary Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 bg-stone-950/80 border-b border-stone-800 font-mono text-xs">
          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('quests');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer ${
              activeTab === 'quests'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Award size={15} />
            <span>1. Dynamic Quests ({QUESTS_CATALOG.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('events');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Trophy size={15} />
            <span>2. Scheduled Events ({events.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('random');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'random'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Flame size={15} className="text-amber-400" />
            <span>3. Random Occurrences & Global Goals ({randomOccurrences.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('servers');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'servers'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Server size={15} />
            <span>4. Custom Servers ({servers.length})</span>
          </button>
        </div>

        {/* Main Content Body */}
        <div className="flex-1 p-5 overflow-y-auto font-mono">
          {/* ================= TAB 1: DYNAMIC QUESTS ================= */}
          {activeTab === 'quests' && (
            <div className="space-y-4">
              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All Quests' },
                  { id: 'fetch', label: '📦 Resource Gathering' },
                  { id: 'territory', label: '🚩 Territory Control' },
                  { id: 'interaction', label: '💬 Roleplay Dialogue' },
                  { id: 'combat', label: '⚔️ Combat Challenges' },
                  { id: 'puzzle', label: '🧩 Logic Puzzles' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setQuestCategory(cat.id as any);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      questCategory === cat.id
                        ? 'bg-stone-800 text-emerald-300 border border-emerald-500/60 shadow-sm'
                        : 'text-stone-400 hover:text-white bg-stone-950/60 border border-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Quests Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredQuests.map((quest) => {
                  const progress = questState.activeQuestProgress[quest.id] || 0;
                  const isCompleted = questState.completedQuestIds.includes(quest.id) || progress >= quest.targetCount;
                  const isClaimed = questState.claimedRewards.includes(quest.id);
                  const progressPercent = Math.min(100, Math.round((progress / quest.targetCount) * 100));

                  return (
                    <div
                      key={quest.id}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between ${
                        isClaimed
                          ? 'bg-stone-950/40 border-stone-800/80 opacity-75'
                          : isCompleted
                          ? 'bg-emerald-950/30 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                          : 'bg-stone-950/70 border-stone-800'
                      }`}
                    >
                      <div>
                        {/* Header: NPC + Brand */}
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{quest.npcAvatar}</span>
                            <div>
                              <div className="text-[10px] text-stone-400 uppercase">{quest.npcName}</div>
                              <h4 className="text-sm font-bold text-white">{quest.title}</h4>
                            </div>
                          </div>
                          <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                            {quest.brand}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-stone-300 italic mb-2 leading-relaxed">
                          "{quest.description}"
                        </p>

                        {/* Objective Instruction */}
                        <div className="text-[11px] font-bold text-amber-300 bg-amber-950/30 p-2 rounded-xl border border-amber-500/30 mb-2">
                          🎯 {quest.instruction}
                        </div>

                        {/* Voice Chat & Cross-Player Collaboration Tips */}
                        {quest.voiceChatTip && (
                          <div className="text-[10.5px] text-cyan-300 bg-cyan-950/40 p-2 rounded-xl border border-cyan-500/30 mb-2 flex items-start gap-1.5 font-mono">
                            <span className="text-sm">🎙️</span>
                            <div>
                              <strong className="text-cyan-200">Voice Chat Requirement: </strong>
                              <span>{quest.voiceChatTip}</span>
                            </div>
                          </div>
                        )}

                        {quest.crossPlayerInteraction && (
                          <div className="text-[10.5px] text-purple-300 bg-purple-950/40 p-2 rounded-xl border border-purple-500/30 mb-3 flex items-start gap-1.5 font-mono">
                            <span className="text-sm">👥</span>
                            <div>
                              <strong className="text-purple-200">Team Collaboration: </strong>
                              <span>{quest.crossPlayerInteraction}</span>
                            </div>
                          </div>
                        )}

                        {/* Progress Bar */}
                        <div className="space-y-1 mb-3">
                          <div className="flex justify-between text-[10px] text-stone-400 font-bold">
                            <span>Progress</span>
                            <span>{progress} / {quest.targetCount} ({progressPercent}%)</span>
                          </div>
                          <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                isCompleted ? 'bg-emerald-500' : 'bg-amber-500'
                              }`}
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>

                        {/* Rewards Pill Row */}
                        <div className="flex items-center gap-2 flex-wrap mb-4 text-[10px]">
                          <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">
                            +{quest.reward.coins} Coins
                          </span>
                          {quest.reward.robux && (
                            <span className="bg-red-950/60 text-red-300 px-2 py-0.5 rounded border border-red-500/30 font-bold">
                              +{quest.reward.robux} Robux
                            </span>
                          )}
                          <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                            +{quest.reward.xp} XP
                          </span>
                          {quest.reward.item && (
                            <span className="bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700 font-bold">
                              🎁 {quest.reward.itemCount}x {quest.reward.item}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Button */}
                      <div>
                        {isClaimed ? (
                          <div className="w-full py-2 bg-stone-900 border border-stone-800 rounded-xl text-xs text-stone-500 font-bold flex items-center justify-center gap-1.5">
                            <CheckCircle2 size={13} />
                            <span>Completed & Claimed</span>
                          </div>
                        ) : isCompleted ? (
                          <button
                            onClick={() => handleClaimReward(quest)}
                            className="mc-btn mc-btn-primary w-full py-2.5 rounded-xl text-xs font-bold shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer hover:scale-102"
                          >
                            <Sparkles size={13} className="text-yellow-400" />
                            <span>Claim Quest Rewards!</span>
                          </button>
                        ) : quest.category === 'interaction' ? (
                          <button
                            onClick={() => {
                              audioEngine.playMinecraftSound('click');
                              setActiveDialogueQuest(quest);
                              setDialogueReplies([]);
                            }}
                            className="w-full py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <span>💬 Talk with {quest.npcName}</span>
                          </button>
                        ) : quest.category === 'territory' ? (
                          <button
                            onClick={() => {
                              audioEngine.playMinecraftSound('click');
                              setActiveTerritoryQuest(quest);
                              setTerritoryPercent(0);
                            }}
                            className="w-full py-2 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <span>🚩 Capture Outpost ({quest.territoryData?.locationName || 'Fortress'})</span>
                          </button>
                        ) : quest.category === 'puzzle' ? (
                          <button
                            onClick={() => handleOpenPuzzle(quest)}
                            className="w-full py-2 bg-purple-700 hover:bg-purple-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
                          >
                            <Zap size={13} />
                            <span>Launch Interactive Puzzle</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAdvanceQuest(quest)}
                            className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ArrowRight size={13} />
                            <span>Log Activity / Step Progress</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 2: SCHEDULED EVENTS ================= */}
          {activeTab === 'events' && (
            <div className="space-y-4">
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs text-stone-300">
                <p className="font-bold text-emerald-300 mb-1">Scheduled Live Server Activities & World Events</p>
                <p className="text-stone-400">
                  Join server tournaments, cultural peace festivals, or team up for massive cooperative multiplayer boss encounters with active synchronized countdowns!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {events.map((evt) => (
                  <div
                    key={evt.id}
                    className="bg-stone-950/70 border border-stone-800 hover:border-emerald-500/50 p-5 rounded-2xl flex flex-col justify-between shadow-xl transition"
                  >
                    <div>
                      {/* Status + Type */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{evt.bannerEmoji}</span>
                          <div>
                            <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                              evt.status === 'LIVE_NOW'
                                ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                                : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                            }`}>
                              {evt.status === 'LIVE_NOW' ? '🔴 LIVE NOW' : '🟡 UPCOMING'}
                            </span>
                            <span className="text-[10px] text-stone-400 ml-2 font-mono">
                              {evt.serverTheme}
                            </span>
                          </div>
                        </div>

                        {/* Countdown Timer */}
                        <div className="flex items-center gap-1 text-xs font-black text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                          <Clock size={12} />
                          <span>{formatCountdown(evt.countdownSeconds)}</span>
                        </div>
                      </div>

                      <h3 className="text-base font-bold text-white mb-1">{evt.title}</h3>
                      <p className="text-xs text-stone-300 mb-3 leading-relaxed">{evt.description}</p>

                      {/* Boss HP Bar if Raid */}
                      {evt.type === 'boss_battle' && evt.bossHp !== undefined && evt.maxBossHp && (
                        <div className="bg-stone-900 p-3 rounded-xl border border-red-500/40 mb-3 space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold text-red-400">
                            <span className="flex items-center gap-1">
                              <Heart size={13} fill="currentColor" /> {evt.bossName}
                            </span>
                            <span>{evt.bossHp} / {evt.maxBossHp} HP</span>
                          </div>
                          <div className="w-full bg-stone-950 h-2.5 rounded-full overflow-hidden border border-red-900">
                            <div 
                              className="h-full bg-red-600 transition-all duration-300"
                              style={{ width: `${(evt.bossHp / evt.maxBossHp) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Rule Modifiers */}
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {evt.modifiers.map((mod, i) => (
                          <span
                            key={i}
                            className="text-[9.5px] bg-stone-900 text-stone-300 border border-stone-800 px-2 py-0.5 rounded-md"
                          >
                            ⚡ {mod}
                          </span>
                        ))}
                      </div>

                      {evt.voiceCoordination && (
                        <div className="mt-2.5 p-2 bg-cyan-950/40 rounded-xl border border-cyan-500/30 text-[10.5px] text-cyan-300 flex items-start gap-1.5 font-mono">
                          <span className="text-sm">🎙️</span>
                          <div>
                            <strong className="text-cyan-200">Voice Objective: </strong>
                            <span>{evt.voiceCoordination}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
                      <div className="flex items-center gap-1.5 text-xs text-stone-400">
                        <Users size={13} />
                        <span>{evt.participantsCount} / {evt.maxParticipants} Miners</span>
                      </div>

                      {evt.type === 'boss_battle' ? (
                        <button
                          onClick={() => handleStrikeBoss(evt.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow active:scale-95"
                        >
                          <Swords size={13} />
                          <span>Strike Boss!</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => showToast(`Joined "${evt.title}" waiting room!`)}
                          className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
                        >
                          <Play size={13} />
                          <span>Join Event Server</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 3: RANDOM OCCURRENCES & COMMUNITY GOALS ================= */}
          {activeTab === 'random' && (
            <div className="space-y-6">
              {/* Cross-Server Community Goal Banner */}
              <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-emerald-950/60 border-2 border-amber-500/50 p-5 rounded-3xl shadow-xl space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">🌐</span>
                    <div>
                      <h3 className="text-base font-black text-white flex items-center gap-2">
                        Cross-Server Community Milestone
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          Universal Buff
                        </span>
                      </h3>
                      <p className="text-xs text-stone-300">
                        All servers contribute to shared global milestones. Reaching goals unlocks passive realm buffs!
                      </p>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className="text-sm font-black text-amber-300">
                      {communityGoal.totalPoints.toLocaleString()} / {communityGoal.maxTarget.toLocaleString()} Pts
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {Math.round((communityGoal.totalPoints / communityGoal.maxTarget) * 100)}% Milestone Complete
                    </div>
                  </div>
                </div>

                {/* Progress Meter Bar */}
                <div className="w-full bg-stone-950 h-3.5 rounded-full overflow-hidden border border-amber-500/30 p-0.5 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${Math.min(100, (communityGoal.totalPoints / communityGoal.maxTarget) * 100)}%` }}
                  />
                </div>

                {/* Milestone Tier Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                    communityGoal.tier1Unlocked
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-200'
                      : 'bg-stone-950/60 border-stone-800 text-stone-500'
                  }`}>
                    <span className="text-lg">🪙</span>
                    <div className="text-left text-xs leading-tight">
                      <div className="font-bold flex items-center gap-1">
                        Tier 1 (1,500 Pts)
                        {communityGoal.tier1Unlocked && <span className="text-emerald-400 text-[10px]">✓ Active</span>}
                      </div>
                      <div className="text-[10.5px] opacity-80">+20% Coin Earnings on all activities</div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                    communityGoal.tier2Unlocked
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                      : 'bg-stone-950/60 border-stone-800 text-stone-500'
                  }`}>
                    <span className="text-lg">⛏️</span>
                    <div className="text-left text-xs leading-tight">
                      <div className="font-bold flex items-center gap-1">
                        Tier 2 (3,500 Pts)
                        {communityGoal.tier2Unlocked && <span className="text-emerald-400 text-[10px]">✓ Active</span>}
                      </div>
                      <div className="text-[10.5px] opacity-80">2x Rare Ore Mining & Harvest Yield</div>
                    </div>
                  </div>

                  <div className={`p-3 rounded-2xl border flex items-center gap-2.5 ${
                    communityGoal.tier3Unlocked
                      ? 'bg-purple-950/40 border-purple-500/60 text-purple-200'
                      : 'bg-stone-950/60 border-stone-800 text-stone-500'
                  }`}>
                    <span className="text-lg">👑</span>
                    <div className="text-left text-xs leading-tight">
                      <div className="font-bold flex items-center gap-1">
                        Tier 3 (5,000 Pts)
                        {communityGoal.tier3Unlocked && <span className="text-emerald-400 text-[10px]">✓ Active</span>}
                      </div>
                      <div className="text-[10.5px] opacity-80">Mythic "Aeternum Sovereign" Crown</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Random Occurrences Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Flame size={16} className="text-red-400" />
                    Spontaneous Random Occurrences
                  </h3>
                  <p className="text-xs text-stone-400">
                    Emergent cross-server anomalies that materialize randomly across active realms.
                  </p>
                </div>
                <span className="text-xs text-amber-300 bg-stone-900 border border-stone-800 px-3 py-1 rounded-xl">
                  {randomOccurrences.filter((o) => o.activeStatus === 'ACTIVE').length} Active Anomalies
                </span>
              </div>

              {/* Random Occurrences Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {randomOccurrences.map((occ) => {
                  const isDone = occ.activeStatus === 'RESOLVED';
                  return (
                    <div
                      key={occ.id}
                      className={`p-5 rounded-2xl border flex flex-col justify-between transition relative overflow-hidden ${
                        isDone
                          ? 'bg-stone-950/60 border-stone-800 opacity-80'
                          : 'bg-gradient-to-br from-stone-950 via-stone-900 to-stone-950 border-amber-500/40 shadow-lg hover:border-amber-400/70'
                      }`}
                    >
                      <div>
                        {/* Status bar */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{occ.icon}</span>
                            <div>
                              <h4 className="text-sm font-black text-white">{occ.name}</h4>
                              <span className="text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-800 text-amber-400 border border-stone-700">
                                {occ.brand}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-500/30">
                            <Clock size={12} />
                            <span>{formatCountdown(occ.remainingSeconds)}</span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-300 mb-2 leading-relaxed">{occ.description}</p>

                        <div className="bg-stone-950/80 p-3 rounded-xl border border-stone-800 mb-3 space-y-2">
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-amber-300 font-bold">🎯 Objective:</span>
                            <span className="text-white font-bold">{occ.progressCount} / {occ.targetCount}</span>
                          </div>
                          <p className="text-[11px] text-stone-400 leading-snug">{occ.objective}</p>
                          <div className="w-full bg-stone-900 h-2 rounded-full overflow-hidden border border-stone-800">
                            <div
                              className="h-full bg-amber-500 transition-all duration-300"
                              style={{ width: `${Math.min(100, (occ.progressCount / occ.targetCount) * 100)}%` }}
                            />
                          </div>
                        </div>

                        {/* Reward & Cross-Server Count */}
                        <div className="flex items-center justify-between text-xs text-stone-400 mb-4 flex-wrap gap-2">
                          <div className="flex items-center gap-1.5">
                            <Users size={13} className="text-cyan-400" />
                            <span>{occ.crossServerParticipants} Players Collaborating</span>
                          </div>

                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-amber-300 font-bold">+{occ.reward.coins} Coins</span>
                            {occ.reward.robux && <span className="text-red-400 font-bold">+{occ.reward.robux} R$</span>}
                            <span className="text-emerald-400 font-bold">+{occ.reward.xp} XP</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      {isDone ? (
                        <button
                          disabled
                          className="w-full py-2.5 bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-default"
                        >
                          <CheckCircle2 size={14} />
                          <span>Event Cleared & Rewards Granted</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleParticipateRandom(occ.id)}
                          className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-md hover:scale-[1.01] active:scale-98"
                        >
                          <Zap size={14} />
                          <span>Participate & Advance (+1 Progress)</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 4: CUSTOM GAME SERVERS ================= */}
          {activeTab === 'servers' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white">Public & Community Custom Servers</h3>
                  <p className="text-xs text-stone-400">
                    Host or join servers with custom rule sets, gravity physics, and cross-brand themes.
                  </p>
                </div>
                <button
                  onClick={() => setIsHostingServer(true)}
                  className="mc-btn mc-btn-primary px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
                >
                  <Plus size={14} />
                  <span>Host Custom Server</span>
                </button>
              </div>

              {/* Server List */}
              <div className="space-y-3">
                {servers.map((srv) => (
                  <div
                    key={srv.id}
                    className="bg-stone-950/70 border border-stone-800 hover:border-emerald-500/40 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition shadow-md"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                        <h4 className="text-sm font-bold text-white">{srv.name}</h4>
                        <span className="text-[9px] uppercase px-2 py-0.5 rounded-full bg-stone-800 text-amber-300 border border-stone-700">
                          {srv.theme}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-stone-400 flex-wrap">
                        <span>Host: <strong className="text-stone-200">{srv.hostName}</strong></span>
                        <span>•</span>
                        <span>Region: {srv.region}</span>
                        <span>•</span>
                        <span>PvP: {srv.pvpEnabled ? '⚔️ Enabled' : '🛡️ Safe'}</span>
                        <span>•</span>
                        <span>Gravity: {srv.gravity}</span>
                        <span>•</span>
                        <span>Speed: {srv.speedMultiplier}x</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-xs text-stone-400 font-mono">
                        <strong className="text-white">{srv.playerCount}</strong> / {srv.maxPlayers}
                      </div>
                      <button
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          if (onJoinServer) {
                            onJoinServer(srv);
                          } else {
                            showToast(`Connected to server "${srv.name}"!`);
                          }
                          onClose();
                        }}
                        className="mc-btn px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer hover:scale-105"
                      >
                        Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ================= INTERACTIVE PUZZLE MODAL ================= */}
        {activePuzzleQuest && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 border-2 border-purple-500 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🧩</span>
                  <h3 className="text-base font-bold text-white">{activePuzzleQuest.title}</h3>
                </div>
                <button
                  onClick={() => setActivePuzzleQuest(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <p className="text-xs text-stone-300">{activePuzzleQuest.puzzleData?.prompt}</p>

              {/* Logic Circuit Puzzle */}
              {activePuzzleQuest.puzzleData?.type === 'logic_circuit' && (
                <div className="grid grid-cols-2 gap-3 py-3">
                  {puzzleNodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleToggleLogicNode(node.id)}
                      className={`p-3 rounded-xl border text-xs font-bold transition cursor-pointer flex flex-col gap-1 items-start ${
                        node.active
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      <span>{node.label}</span>
                      <span className="text-[10px] uppercase">{node.active ? '🟢 [HIGH 1]' : '🔴 [LOW 0]'}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Burger Recipe Puzzle */}
              {activePuzzleQuest.puzzleData?.type === 'burger_recipe' && (
                <div className="space-y-3 py-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-stone-400">Current Culinary Stack:</span>
                    <button
                      onClick={() => setBurgerSteps([])}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw size={12} /> Reset Stack
                    </button>
                  </div>
                  <div className="min-h-[50px] bg-stone-950 p-2 rounded-xl border border-stone-800 flex items-center gap-2">
                    {burgerSteps.length === 0 ? (
                      <span className="text-xs text-stone-500 italic">Click ingredients below to stack in order...</span>
                    ) : (
                      burgerSteps.map((step, idx) => (
                        <span key={idx} className="bg-amber-950/80 text-amber-300 border border-amber-500/40 px-2 py-1 rounded text-xs font-bold">
                          {idx + 1}. {step.toUpperCase()}
                        </span>
                      ))
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: 'bun', label: '🍞 Sesame Bun' },
                      { id: 'patty', label: '🥩 Beef Patty' },
                      { id: 'cheese', label: '🧀 Melted Cheddar' },
                      { id: 'sauce', label: '🥫 Secret Sauce' },
                    ].map((ing) => (
                      <button
                        key={ing.id}
                        onClick={() => handleAddBurgerIngredient(ing.id)}
                        className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-white border border-stone-700 cursor-pointer font-bold"
                      >
                        {ing.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Treaty Match Puzzle */}
              {activePuzzleQuest.puzzleData?.type === 'treaty_match' && (
                <div className="space-y-2 py-2">
                  {puzzleNodes.map((node) => (
                    <button
                      key={node.id}
                      onClick={() => handleToggleTreatyNode(node.id)}
                      className={`w-full p-2.5 rounded-xl border text-left text-xs font-bold transition cursor-pointer flex items-center justify-between ${
                        node.active
                          ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                          : 'bg-stone-950 border-stone-800 text-stone-400'
                      }`}
                    >
                      <span>{node.label}</span>
                      <span>{node.active ? '✅ Ratified' : '⭕ Unsigned'}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Puzzle Solved Confirmation */}
              {puzzleSolved ? (
                <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-2xl flex items-center justify-between">
                  <div className="text-xs text-emerald-300 font-bold flex items-center gap-1.5">
                    <CheckCircle2 size={16} />
                    <span>Puzzle Successfully Deciphered!</span>
                  </div>
                  <button
                    onClick={handleCompletePuzzleAndClaim}
                    className="mc-btn mc-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Claim Reward!
                  </button>
                </div>
              ) : (
                <div className="text-[11px] text-stone-400 text-center">
                  Align inputs to target logic pattern to unlock vault rewards.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= INTERACTIVE DIALOGUE MODAL ================= */}
        {activeDialogueQuest && activeDialogueQuest.dialogueData && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 border-2 border-blue-500 rounded-3xl p-6 w-full max-w-xl shadow-2xl space-y-4 font-mono animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{activeDialogueQuest.npcAvatar}</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeDialogueQuest.npcName}</h3>
                    <span className="text-[10px] text-blue-400 uppercase tracking-widest">{activeDialogueQuest.brand} Roleplay Storyline</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveDialogueQuest(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Speaker Greeting */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs text-stone-200 leading-relaxed italic">
                "{activeDialogueQuest.dialogueData.speakerGreeting}"
              </div>

              {/* Lore Context Pill */}
              <div className="text-[11px] text-amber-300 bg-amber-950/30 border border-amber-500/30 p-2.5 rounded-xl">
                📖 <strong>Cultural Lore:</strong> {activeDialogueQuest.dialogueData.loreNotes}
              </div>

              {/* Past Responses Log */}
              {dialogueReplies.length > 0 && (
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {dialogueReplies.map((r, i) => (
                    <div key={i} className="bg-blue-950/30 border border-blue-500/30 p-2.5 rounded-xl text-xs space-y-1">
                      <div className="text-blue-300 font-bold">You: "{r.option}"</div>
                      <div className="text-stone-300 italic">{activeDialogueQuest.npcName}: "{r.reply}"</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Branching Dialogue Choices */}
              <div className="space-y-2 pt-2">
                <p className="text-xs text-stone-400 font-bold">Choose your response:</p>
                {activeDialogueQuest.dialogueData.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelectDialogueOption(activeDialogueQuest, opt)}
                    className="w-full text-left p-3 rounded-xl bg-stone-950 hover:bg-blue-950/50 border border-stone-800 hover:border-blue-500 text-xs text-stone-200 transition flex items-center justify-between cursor-pointer group"
                  >
                    <span>💬 {opt.label}</span>
                    <ChevronRight size={14} className="text-stone-500 group-hover:text-blue-400 transition" />
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setActiveDialogueQuest(null)}
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Conclude Audience
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TERRITORY OUTPOST CAPTURE MODAL ================= */}
        {activeTerritoryQuest && activeTerritoryQuest.territoryData && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 border-2 border-rose-500 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 font-mono animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🚩</span>
                  <div>
                    <h3 className="text-base font-bold text-white">{activeTerritoryQuest.territoryData.locationName}</h3>
                    <span className="text-[10px] text-rose-400 uppercase tracking-widest">{activeTerritoryQuest.brand} Outpost Defense</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTerritoryQuest(null)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Defending Faction:</span>
                  <span className="text-amber-300 font-bold">{activeTerritoryQuest.territoryData.faction}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Fortification Tier:</span>
                  <span className="text-emerald-300 font-bold">Level {activeTerritoryQuest.territoryData.fortificationLevel} Bastion</span>
                </div>
              </div>

              {/* Capture Control Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-stone-300 font-bold">
                  <span>Territory Claim Gauge</span>
                  <span className="text-rose-400">{territoryPercent}% Fortified</span>
                </div>
                <div className="w-full bg-stone-950 border border-stone-800 h-4 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${territoryPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2">
                {territoryPercent >= 100 ? (
                  <div className="bg-emerald-950/80 border border-emerald-500 p-3 rounded-2xl flex items-center justify-between">
                    <span className="text-xs text-emerald-300 font-bold">🚩 Outpost Captured for Your Faction!</span>
                    <button
                      onClick={() => setActiveTerritoryQuest(null)}
                      className="mc-btn mc-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Return to Hub
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleCaptureTerritoryStep(activeTerritoryQuest)}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-black shadow-lg transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    <span>⚔️ Strike Outpost Defenses & Raise War Banner (+35%)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= HOST CUSTOM SERVER MODAL ================= */}
        {isHostingServer && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 border-2 border-emerald-500 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">🌐</span>
                  <h3 className="text-base font-bold text-white">Host Custom Multiplayer Server</h3>
                </div>
                <button
                  onClick={() => setIsHostingServer(false)}
                  className="text-stone-400 hover:text-white p-1 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Server Name:</label>
                <input
                  type="text"
                  value={newServerName}
                  onChange={(e) => setNewServerName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Theme & Ruleset:</label>
                <select
                  value={newServerTheme}
                  onChange={(e) => setNewServerTheme(e.target.value as any)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="cross_brand">Universal MegaWorld (All Brands)</option>
                  <option value="minecraft">Minecraft Pure Survival</option>
                  <option value="roblox">Robloxian Obby Mania</option>
                  <option value="countryballs">Countryballs Diplomatic War & Peace</option>
                  <option value="xilam">Xilam Slapstick Brawler</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-300 mb-1">Gravity:</label>
                  <select
                    value={newServerGravity}
                    onChange={(e) => setNewServerGravity(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value="normal">Normal (1.0g)</option>
                    <option value="low">Low Moon Gravity (0.5g)</option>
                    <option value="float">Zero-G Float (0.2g)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-300 mb-1">Speed Boost:</label>
                  <select
                    value={newServerSpeed}
                    onChange={(e) => setNewServerSpeed(parseFloat(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-1.5 text-xs text-white"
                  >
                    <option value={1.0}>1.0x Normal</option>
                    <option value={1.25}>1.25x Swift</option>
                    <option value={1.5}>1.5x Supersonic</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newServerPvP}
                    onChange={(e) => setNewServerPvP(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>PvP Enabled</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newServerKeepInv}
                    onChange={(e) => setNewServerKeepInv(e.target.checked)}
                    className="rounded accent-emerald-500"
                  />
                  <span>Keep Inventory on Death</span>
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setIsHostingServer(false)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateServer}
                  className="mc-btn mc-btn-primary px-5 py-2 rounded-xl text-xs font-bold"
                >
                  Deploy & Host Server
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
