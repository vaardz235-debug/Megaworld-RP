/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { bossRaidManager, BOSS_ROSTER, BossDefinition } from '../utils/bossRaidManager';
import { Skull, Swords, Award, ShieldAlert, Zap, X, MapPin } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { formatBlockNumber } from '../utils/commandEngine';

interface BossRaidSummonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWarpToArena?: (x: number, y: number) => void;
}

export default function BossRaidSummonModal({
  isOpen,
  onClose,
  onWarpToArena,
}: BossRaidSummonModalProps) {
  const [selectedBoss, setSelectedBoss] = useState<BossDefinition>(BOSS_ROSTER[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isOpen) return null;

  const activeBoss = bossRaidManager.getActiveBoss();

  const handleSummon = (boss: BossDefinition) => {
    bossRaidManager.summonBoss(boss.id);
    setSelectedBoss(boss);
    setFeedback(`🚨 ${boss.name} has been summoned! Prepare for battle!`);
    setTimeout(() => {
      setFeedback(null);
      if (onWarpToArena) {
        onWarpToArena(boss.spawnCoordinates.x, boss.spawnCoordinates.y);
      }
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none font-mono animate-fade-in">
      <div className="bg-stone-950 border-4 border-red-500/80 rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-[0_20px_70px_rgba(239,68,68,0.35)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-900 border-b border-stone-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center text-xl shadow">
              ⚔️
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Multiverse World Boss Raids
                <span className="text-[10px] uppercase font-bold bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded-full">
                  4 Colossal Titans
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Summon and battle multiverse bosses with multi-phase mechanics, telegraphed attacks, and legendary loot rewards!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition"
          >
            ✕
          </button>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="bg-red-950/90 border-b border-red-500/60 px-4 py-2 text-xs font-bold text-red-200 text-center flex items-center justify-center gap-2">
            <Skull size={14} className="text-red-400 animate-bounce" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Boss Roster */}
          <div className="md:col-span-5 border-r border-stone-800 p-4 overflow-y-auto space-y-2.5 bg-stone-900/40">
            <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">
              Boss Roster
            </div>

            {BOSS_ROSTER.map((boss) => {
              const isActive = activeBoss?.id === boss.id;
              const isSelected = selectedBoss.id === boss.id;

              return (
                <div
                  key={boss.id}
                  onClick={() => setSelectedBoss(boss)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-stone-800/90 border-red-400 shadow-md' 
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow border"
                      style={{ backgroundColor: `${boss.themeColor}20`, borderColor: boss.themeColor }}
                    >
                      {boss.avatarEmoji}
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs flex items-center gap-1.5">
                        <span>{boss.name}</span>
                        {isActive && (
                          <span className="text-[9px] bg-red-500/30 text-red-300 border border-red-500/50 px-1.5 py-0.2 rounded font-black animate-pulse">
                            ACTIVE RAID
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">{boss.brand}</div>
                      <div className="text-[10px] text-red-400 font-bold mt-0.5">
                        HP: {boss.maxHp.toLocaleString()} • 3 Combat Phases
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSummon(boss);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition bg-red-600 hover:bg-red-500 text-white"
                  >
                    Summon
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Boss Details, Abilities & Drops */}
          <div className="md:col-span-7 p-5 overflow-y-auto space-y-4 bg-stone-950 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Boss Header */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg border-2"
                    style={{ backgroundColor: `${selectedBoss.themeColor}25`, borderColor: selectedBoss.themeColor }}
                  >
                    {selectedBoss.avatarEmoji}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedBoss.name}</h3>
                    <div className="text-xs text-stone-400">{selectedBoss.title}</div>
                    <div className="text-xs font-bold text-red-400 mt-0.5">
                      {selectedBoss.maxHp.toLocaleString()} Maximum Health
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleSummon(selectedBoss)}
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black cursor-pointer shadow transition active:scale-95 border border-red-400 flex items-center gap-1.5"
                >
                  <Swords size={14} className="text-yellow-300" />
                  <span>Start Raid</span>
                </button>
              </div>

              {/* Arena Coordinates & Quote */}
              <div className="bg-stone-900/60 border border-stone-800 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Raid Arena Coordinates:</div>
                  <div className="text-sm font-black text-emerald-400">
                    X: {formatBlockNumber(selectedBoss.spawnCoordinates.x)}, Y: {selectedBoss.spawnCoordinates.y}
                  </div>
                </div>
                {onWarpToArena && (
                  <button
                    onClick={() => {
                      onWarpToArena(selectedBoss.spawnCoordinates.x, selectedBoss.spawnCoordinates.y);
                      onClose();
                    }}
                    className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1 border border-stone-700 cursor-pointer"
                  >
                    <MapPin size={12} />
                    <span>Warp to Arena</span>
                  </button>
                )}
              </div>

              {/* Intro Dialogue Quote */}
              <div className="bg-stone-900/70 border border-stone-800 p-3 rounded-xl text-xs italic text-stone-300">
                {selectedBoss.dialogueIntro}
              </div>

              {/* Attacks & Telegraphs */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert size={13} />
                  <span>Telegraphed Combat Abilities:</span>
                </div>
                <div className="space-y-1.5">
                  {selectedBoss.attacks.map((atk, idx) => (
                    <div key={idx} className="bg-stone-900/60 border border-red-950/60 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{atk.icon}</span>
                        <div>
                          <div className="font-bold text-white">{atk.name} ({atk.damage} DMG)</div>
                          <div className="text-[10.5px] text-stone-400">{atk.description}</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded">
                        {(atk.chargeTimeMs / 1000).toFixed(1)}s Charge
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Defeat Drops & Bounty */}
              <div className="bg-stone-900/60 border border-amber-500/40 p-3 rounded-2xl flex items-center justify-between text-xs">
                <div>
                  <div className="text-[10px] text-amber-400 font-bold uppercase">Victory Bounty Rewards:</div>
                  <div className="font-bold text-stone-200 mt-0.5">
                    🪙 {selectedBoss.drops.coins} Coins • 💎 {selectedBoss.drops.robux} Robux • 🏆 {selectedBoss.drops.badgeName}
                  </div>
                </div>
                <div className="text-right text-[10px] text-stone-400">
                  + Epic Material Drops
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
              <button
                onClick={onClose}
                className="mc-btn px-6 py-2.5 text-xs font-bold rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
