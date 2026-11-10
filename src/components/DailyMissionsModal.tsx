import React, { useState, useEffect } from 'react';
import { 
  X, Target, Sparkles, Check, Clock, RefreshCw, Pin, PinOff, 
  Coins, Award, Flame, Gift, CheckCircle2, ChevronRight, Zap, 
  ShieldAlert, Gem, Trophy, Star
} from 'lucide-react';
import { 
  dailyMissionManager, 
  DailyMission, 
  DailyMissionState, 
  STREAK_REWARDS 
} from '../utils/dailyMissionManager';
import { audioEngine } from '../utils/audioEngine';

interface DailyMissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  onNavigateToGame?: () => void;
}

export default function DailyMissionsModal({
  isOpen,
  onClose,
  user,
  onNavigateToGame,
}: DailyMissionsModalProps) {
  const [missionState, setMissionState] = useState<DailyMissionState>(dailyMissionManager.getState());
  const [resetTimer, setResetTimer] = useState<string>(dailyMissionManager.getTimeUntilReset().formatted);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimingAllClear, setClaimingAllClear] = useState<boolean>(false);
  const [claimingStreak, setClaimingStreak] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setMissionState(dailyMissionManager.getState());
      if (user?.uid) {
        dailyMissionManager.loadFromCloud(user.uid).then(st => setMissionState(st));
      }
    }

    const timer = setInterval(() => {
      setResetTimer(dailyMissionManager.getTimeUntilReset().formatted);
    }, 1000);

    const handleUpdate = () => {
      setMissionState(dailyMissionManager.getState());
    };
    window.addEventListener('megaworld_daily_missions_updated', handleUpdate);

    return () => {
      clearInterval(timer);
      window.removeEventListener('megaworld_daily_missions_updated', handleUpdate);
    };
  }, [isOpen, user]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleClaimReward = async (mission: DailyMission) => {
    if (claimingId || mission.claimed || !mission.completed) return;
    setClaimingId(mission.id);

    try {
      const res = await dailyMissionManager.claimReward(mission.id, user?.uid);
      if (res.success) {
        showToast(`🎉 Claimed +${res.coinsAwarded} Coins, +${res.robuxAwarded} Robux & +${res.xpAwarded} XP!`);
        setMissionState(dailyMissionManager.getState());
      }
    } finally {
      setClaimingId(null);
    }
  };

  const handleClaimAllClear = async () => {
    if (claimingAllClear || missionState.allClearBonusClaimed) return;
    setClaimingAllClear(true);
    try {
      const res = await dailyMissionManager.claimAllClearBonus(user?.uid);
      if (res.success) {
        showToast(`👑 ALL-CLEAR BONUS UNLOCKED! +${res.coinsAwarded} Coins, +${res.robuxAwarded} Robux & +${res.xpAwarded} XP!`);
        setMissionState(dailyMissionManager.getState());
      }
    } finally {
      setClaimingAllClear(false);
    }
  };

  const handleClaimStreak = async () => {
    if (claimingStreak || missionState.streakClaimedToday) return;
    setClaimingStreak(true);
    try {
      const res = await dailyMissionManager.claimStreakReward(user?.uid);
      if (res.success && res.reward) {
        showToast(`🔥 Day ${missionState.streakDays} Streak Claimed! +${res.reward.coins} Coins, +${res.reward.robux} Robux & +${res.reward.xp} XP!`);
        setMissionState(dailyMissionManager.getState());
      }
    } finally {
      setClaimingStreak(false);
    }
  };

  const handleReroll = (missionId: string) => {
    const ok = dailyMissionManager.rerollMission(missionId);
    if (ok) {
      showToast('🎲 Mission rerolled with fresh random objective!');
      setMissionState(dailyMissionManager.getState());
    } else {
      showToast('❌ No rerolls remaining today! Free rerolls reset midnight.');
    }
  };

  const handleTogglePin = (missionId: string) => {
    dailyMissionManager.togglePinMission(missionId);
    audioEngine.playMinecraftSound('click');
    setMissionState(dailyMissionManager.getState());
  };

  const completedCount = missionState.missions.filter(m => m.completed).length;
  const allMissionsCompleted = completedCount === missionState.missions.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="bg-stone-900 border-2 border-stone-700 w-full max-w-4xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden text-white relative">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 border border-emerald-400 text-white px-5 py-2.5 rounded-full font-bold text-xs sm:text-sm shadow-2xl flex items-center gap-2 animate-bounce">
            <span>✨</span>
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-stone-800 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-2xl shadow-lg border border-amber-300/40">
              🎯
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                  <span>Daily Missions & Bounties</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    24h Cycle
                  </span>
                </h2>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Complete daily mining and combat tasks to earn gold coins, robux, and XP progression!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Countdown Badge */}
            <div className="hidden sm:flex items-center gap-1.5 bg-black/60 border border-stone-700 px-3 py-1.5 rounded-xl text-xs text-stone-300">
              <Clock size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="text-stone-400">Reset in:</span>
              <span className="font-bold text-amber-300">{resetTimer}</span>
            </div>

            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition cursor-pointer"
              title="Close Daily Missions Modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* ================= 7-DAY LOGIN STREAK REWARDS ================= */}
          <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow-inner">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
              <div className="flex items-center gap-2">
                <Flame size={18} className="text-orange-400 animate-pulse" />
                <h3 className="text-sm sm:text-base font-bold text-white">
                  7-Day Adventurer Login Streak
                </h3>
                <span className="text-xs font-bold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-md border border-orange-500/30">
                  Day {missionState.streakDays} of 7
                </span>
              </div>

              {!missionState.streakClaimedToday ? (
                <button
                  type="button"
                  onClick={handleClaimStreak}
                  disabled={claimingStreak}
                  className="mc-btn mc-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
                >
                  <Gift size={13} />
                  <span>Claim Day {missionState.streakDays} Reward</span>
                </button>
              ) : (
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-2.5 py-1 rounded-xl border border-emerald-500/30 flex items-center gap-1">
                  <Check size={12} /> Today's Streak Claimed
                </span>
              )}
            </div>

            {/* Streak Day Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
              {STREAK_REWARDS.map((rew) => {
                const isCurrent = rew.day === missionState.streakDays;
                const isPast = rew.day < missionState.streakDays || (isCurrent && missionState.streakClaimedToday);
                const isLocked = rew.day > missionState.streakDays;

                return (
                  <div
                    key={rew.day}
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-between text-center relative transition-all ${
                      isCurrent && !missionState.streakClaimedToday
                        ? 'bg-amber-950/40 border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-105'
                        : isPast
                        ? 'bg-emerald-950/30 border-emerald-500/40 opacity-90'
                        : 'bg-stone-950/80 border-stone-800 opacity-60'
                    }`}
                  >
                    <div className="text-[10px] font-bold text-stone-400 uppercase">
                      Day {rew.day}
                    </div>
                    <div className="text-xl sm:text-2xl my-1">
                      {rew.icon}
                    </div>
                    <div className="text-[10.5px] font-bold text-amber-300 truncate w-full">
                      {rew.label}
                    </div>

                    {isPast && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ================= ALL-CLEAR 4/4 BONUS CHEST BANNER ================= */}
          <div className={`p-4 rounded-2xl border transition-all flex flex-wrap items-center justify-between gap-4 ${
            allMissionsCompleted && !missionState.allClearBonusClaimed
              ? 'bg-gradient-to-r from-purple-950/70 via-indigo-950/70 to-purple-950/70 border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
              : 'bg-stone-950/60 border-stone-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-xl shadow-md border border-purple-300/40">
                👑
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    Daily All-Clear Master Bonus
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    {completedCount} / {missionState.missions.length} Done
                  </span>
                </div>
                <p className="text-xs text-stone-400">
                  Complete all 4 daily missions to claim <strong className="text-yellow-300">+600 Coins</strong>, <strong className="text-red-400">+60 Robux</strong> & <strong className="text-purple-300">+1,000 XP</strong>!
                </p>
              </div>
            </div>

            <div>
              {missionState.allClearBonusClaimed ? (
                <div className="text-xs text-emerald-400 font-bold bg-emerald-500/20 px-3 py-1.5 rounded-xl border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 size={14} />
                  <span>All-Clear Bonus Claimed!</span>
                </div>
              ) : allMissionsCompleted ? (
                <button
                  type="button"
                  onClick={handleClaimAllClear}
                  disabled={claimingAllClear}
                  className="mc-btn mc-btn-primary px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer shadow-lg animate-pulse hover:scale-105"
                >
                  <Trophy size={15} className="text-yellow-300" />
                  <span>Claim All-Clear Grand Chest</span>
                </button>
              ) : (
                <div className="text-xs text-stone-400 font-mono bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                  <span>Complete {missionState.missions.length - completedCount} more to unlock</span>
                </div>
              )}
            </div>
          </div>

          {/* ================= ACTIVE DAILY MISSIONS GRID ================= */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Today's Random Objectives</span>
                <span className="text-xs font-mono text-stone-400">
                  ({completedCount}/{missionState.missions.length} Completed)
                </span>
              </h3>

              <div className="text-xs text-stone-400 flex items-center gap-1.5 font-mono">
                <RefreshCw size={12} className="text-stone-400" />
                <span>Free Rerolls: <strong className="text-amber-400">{missionState.rerollsAvailable}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {missionState.missions.map((mission) => {
                const percent = Math.min(100, Math.round((mission.currentCount / mission.targetCount) * 100));

                return (
                  <div
                    key={mission.id}
                    className={`p-4 rounded-2xl border transition-all flex flex-col justify-between relative overflow-hidden group ${
                      mission.claimed
                        ? 'bg-stone-950/70 border-stone-800/80 opacity-70'
                        : mission.completed
                        ? 'bg-gradient-to-br from-emerald-950/40 via-stone-900 to-stone-900 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                        : 'bg-stone-900/90 border-stone-800 hover:border-stone-700 shadow-md'
                    }`}
                  >
                    {/* Top Row: Icon, Title, Difficulty, Pin & Reroll */}
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center text-2xl flex-shrink-0 shadow">
                          {mission.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                              {mission.title}
                            </h4>
                            <span className={`text-[9.5px] uppercase font-bold px-1.5 py-0.2 rounded border ${
                              mission.difficulty === 'Legendary'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                : mission.difficulty === 'Epic'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : mission.difficulty === 'Rare'
                                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                                : 'bg-stone-800 text-stone-400 border-stone-700'
                            }`}>
                              {mission.difficulty}
                            </span>
                          </div>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                            {mission.description}
                          </p>
                        </div>
                      </div>

                      {/* Header Actions: HUD Pin & Reroll */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleTogglePin(mission.id)}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs transition cursor-pointer ${
                            mission.pinnedInHud
                              ? 'bg-amber-500 text-black shadow'
                              : 'bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white'
                          }`}
                          title={mission.pinnedInHud ? 'Unpin from Game HUD' : 'Pin to Game HUD overlay'}
                        >
                          {mission.pinnedInHud ? <Pin size={12} className="rotate-45" /> : <PinOff size={12} />}
                        </button>

                        {!mission.completed && !mission.claimed && missionState.rerollsAvailable > 0 && (
                          <button
                            type="button"
                            onClick={() => handleReroll(mission.id)}
                            className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-amber-300 flex items-center justify-center text-xs transition cursor-pointer"
                            title="Reroll this mission"
                          >
                            <RefreshCw size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar & Counter */}
                    <div className="my-2">
                      <div className="flex items-center justify-between text-xs mb-1 font-mono">
                        <span className="text-stone-400">Progress</span>
                        <span className={`font-bold ${mission.completed ? 'text-emerald-400' : 'text-amber-300'}`}>
                          {mission.currentCount} / {mission.targetCount} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-black/60 rounded-full overflow-hidden border border-stone-800">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            mission.completed
                              ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                              : 'bg-gradient-to-r from-amber-500 to-yellow-400'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom Rewards & Action Button */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 gap-2 mt-1">
                      {/* Reward Badges */}
                      <div className="flex items-center gap-1.5 flex-wrap text-xs">
                        <span className="flex items-center gap-1 text-yellow-300 bg-yellow-500/10 px-2 py-0.5 rounded-md border border-yellow-500/20 font-bold">
                          <span>🪙</span>
                          <span>+{mission.rewardCoins}</span>
                        </span>
                        {mission.rewardRobux > 0 && (
                          <span className="flex items-center gap-1 text-red-300 bg-red-500/10 px-2 py-0.5 rounded-md border border-red-500/20 font-bold">
                            <span>💎</span>
                            <span>+{mission.rewardRobux}</span>
                          </span>
                        )}
                        <span className="text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded-md border border-purple-500/20 font-bold">
                          +{mission.rewardXp} XP
                        </span>
                      </div>

                      {/* Claim or Go Action Button */}
                      <div>
                        {mission.claimed ? (
                          <div className="text-xs text-stone-500 font-bold flex items-center gap-1 px-2.5 py-1">
                            <Check size={13} />
                            <span>Claimed</span>
                          </div>
                        ) : mission.completed ? (
                          <button
                            type="button"
                            onClick={() => handleClaimReward(mission)}
                            disabled={claimingId === mission.id}
                            className="mc-btn mc-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow hover:scale-105 animate-pulse"
                          >
                            <Coins size={13} className="text-yellow-300" />
                            <span>Claim Reward</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              if (onNavigateToGame) onNavigateToGame();
                            }}
                            className="mc-btn px-3 py-1 rounded-xl text-xs font-bold text-stone-300 hover:text-white transition flex items-center gap-1 cursor-pointer"
                          >
                            <span>Go Quest</span>
                            <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>Actions tracked automatically in Survival & Creative mode.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="mc-btn px-4 py-2 rounded-xl text-xs font-bold cursor-pointer text-stone-300 hover:text-white"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
