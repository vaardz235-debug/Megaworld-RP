/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { bossRaidManager, BossDefinition } from '../utils/bossRaidManager';
import { Swords, Skull, ShieldAlert, Sparkles, Award, Flame, Zap, X } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface BossRaidHUDProps {
  onDealPlayerDamage?: (damage: number) => void;
  onClaimLoot?: (loot: BossDefinition['drops']) => void;
}

export default function BossRaidHUD({
  onDealPlayerDamage,
  onClaimLoot,
}: BossRaidHUDProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = bossRaidManager.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  const activeBoss = bossRaidManager.getActiveBoss();
  const currentHp = bossRaidManager.getCurrentHp();
  const phase = bossRaidManager.getCurrentPhase();
  const telegraphedAttack = bossRaidManager.getTelegraphedAttack();

  if (!activeBoss) return null;

  const hpPct = Math.max(0, Math.min(100, Math.round((currentHp / activeBoss.maxHp) * 100)));

  const handleAttackBoss = () => {
    // Player hits boss for 150 - 320 damage
    const damage = Math.floor(180 + Math.random() * 140);
    const result = bossRaidManager.damageBoss(damage);

    if (result.defeated && result.loot && onClaimLoot) {
      onClaimLoot(result.loot);
    }
  };

  return (
    <div className="absolute top-14 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-3 select-none font-mono animate-fade-in pointer-events-auto">
      <div className="bg-stone-950/95 border-2 border-red-500/80 rounded-2xl p-3 shadow-[0_10px_35px_rgba(239,68,68,0.35)] flex flex-col gap-2">
        {/* Boss Title & Phase Header */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{activeBoss.avatarEmoji}</span>
            <div>
              <div className="text-white font-black text-sm flex items-center gap-1.5">
                <span>{activeBoss.name}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded" style={{ backgroundColor: `${activeBoss.themeColor}40`, color: activeBoss.themeColor }}>
                  Phase {phase}
                </span>
                {phase === 3 && (
                  <span className="text-[9px] uppercase font-black bg-red-600 text-white px-1.5 py-0.2 rounded animate-pulse">
                    🔥 ENRAGED
                  </span>
                )}
              </div>
              <div className="text-[10px] text-stone-400">{activeBoss.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-red-400">
              {currentHp.toLocaleString()} / {activeBoss.maxHp.toLocaleString()} HP ({hpPct}%)
            </span>
            <button
              onClick={() => bossRaidManager.dismissBoss()}
              className="text-stone-400 hover:text-white p-1 cursor-pointer"
              title="Dismiss Boss Raid"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Boss Health Bar */}
        <div className="relative w-full h-4 bg-stone-900 rounded-full overflow-hidden border border-red-950">
          <div 
            className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-200"
            style={{ width: `${hpPct}%` }}
          />
          {/* Phase divider markers */}
          <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-black/60" />
          <div className="absolute left-2/3 top-0 bottom-0 w-0.5 bg-black/60" />
        </div>

        {/* Incoming Attack Telegraph Warning */}
        {telegraphedAttack && (
          <div className="bg-red-950/70 border border-red-500/80 px-2.5 py-1.5 rounded-xl flex items-center justify-between text-xs text-red-200 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="text-base">{telegraphedAttack.attack.icon}</span>
              <div>
                <span className="font-bold text-red-300">INCOMING: {telegraphedAttack.attack.name}</span>
                <p className="text-[10px] text-stone-300 leading-tight">{telegraphedAttack.attack.description}</p>
              </div>
            </div>
            <div className="text-right text-xs font-black text-amber-300">
              {((telegraphedAttack.remainingMs) / 1000).toFixed(1)}s
            </div>
          </div>
        )}

        {/* Combat Action Buttons */}
        <div className="flex items-center justify-between pt-1">
          <div className="text-[10px] text-stone-400 flex items-center gap-1">
            <Skull size={11} className="text-red-400" />
            <span>Recommended: Dodge incoming attack telegraphs & strike with your highest weapon!</span>
          </div>

          <button
            onClick={handleAttackBoss}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95 border border-red-400"
          >
            <Swords size={14} className="text-yellow-300" />
            <span>Strike Boss!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
