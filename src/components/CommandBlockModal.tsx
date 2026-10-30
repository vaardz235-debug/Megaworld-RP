/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  CommandBlockData, 
  executeMinecraftCommand, 
  CommandContext, 
  formatBlockNumber 
} from '../utils/commandEngine';
import { Play, Check, X, Sparkles, Terminal, Compass, Zap, Repeat, ArrowRight, Shield } from 'lucide-react';

interface CommandBlockModalProps {
  isOpen: boolean;
  blockData: CommandBlockData;
  onSave: (updated: CommandBlockData) => void;
  onClose: () => void;
  commandContext: CommandContext;
}

export default function CommandBlockModal({
  isOpen,
  blockData,
  onSave,
  onClose,
  commandContext,
}: CommandBlockModalProps) {
  const [command, setCommand] = useState(blockData.command || '');
  const [mode, setMode] = useState<'impulse' | 'chain' | 'repeat'>(blockData.mode || 'impulse');
  const [condition, setCondition] = useState<'unconditional' | 'conditional'>(blockData.condition || 'unconditional');
  const [redstone, setRedstone] = useState<'needs_redstone' | 'always_active'>(blockData.redstone || 'always_active');
  const [customName, setCustomName] = useState(blockData.customName || '@');
  const [outputLog, setOutputLog] = useState<string>(
    blockData.lastOutput || 'Previous output: [Waiting for execution]'
  );

  if (!isOpen) return null;

  const handleTestExecute = () => {
    const res = executeMinecraftCommand(command, commandContext, customName || '@');
    const newOutput = `[${res.timestamp}] ${res.message}`;
    setOutputLog(newOutput);
  };

  const handleDone = () => {
    const updated: CommandBlockData = {
      ...blockData,
      command,
      mode,
      condition,
      redstone,
      customName,
      lastOutput: outputLog,
      lastExecutedAt: Date.now(),
      enabled: true,
    };
    onSave(updated);
    // If set to Always Active or Impulse, run once immediately
    if (command.trim()) {
      executeMinecraftCommand(command, commandContext, customName || '@');
    }
    onClose();
  };

  const modeColor = 
    mode === 'impulse' ? 'from-orange-600 to-amber-700 border-orange-400' :
    mode === 'chain' ? 'from-teal-600 to-emerald-700 border-teal-400' :
    'from-purple-700 to-fuchsia-800 border-purple-400';

  const modeBadgeColor =
    mode === 'impulse' ? 'bg-orange-500/20 text-orange-300 border-orange-500/40' :
    mode === 'chain' ? 'bg-teal-500/20 text-teal-300 border-teal-500/40' :
    'bg-purple-500/20 text-purple-300 border-purple-500/40';

  const QUICK_COMMAND_PRESETS = [
    { label: '🌌 Warp to 200,000,000 Billion Frontier', cmd: '/tp 200000000000000000 7' },
    { label: '🪐 Warp to The Far Lands', cmd: '/tp 12550821 7' },
    { label: '⛰️ Warp to 29 Billion Border', cmd: '/tp 29000000000 7' },
    { label: '☀️ Set Daytime & Clear Weather', cmd: '/time set day' },
    { label: '🌙 Set Starry Night & Aurora', cmd: '/time set night' },
    { label: '💎 Grant 64 Diamonds & Netherite', cmd: '/give diamond 64' },
    { label: '📦 Give 64 Command Blocks', cmd: '/give command_block 64' },
    { label: '⚡ Summon Cosmic Lightning', cmd: '/summon lightning' },
    { label: '🎆 Launch Fireworks Display', cmd: '/summon fireworks' },
    { label: '🚀 Speed Levitation Boost', cmd: '/effect give speed' },
    { label: '💖 Full Heal & Hunger Restored', cmd: '/effect give regen' },
    { label: '🏠 Warp Back to Spawn (0, 7)', cmd: '/tp 25 7' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none font-mono">
      <div className="bg-stone-900 border-4 border-stone-700 rounded-3xl p-5 sm:p-6 max-w-2xl w-full shadow-[0_20px_60px_rgba(0,0,0,0.95)] text-white relative flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            {/* Visual Block Cube Preview */}
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${modeColor} border-2 flex items-center justify-center shadow-lg relative`}>
              {mode === 'impulse' && <span className="text-xl">🟧</span>}
              {mode === 'chain' && <span className="text-xl">🟩</span>}
              {mode === 'repeat' && <span className="text-xl animate-spin" style={{ animationDuration: '4s' }}>🟪</span>}
              <div className="w-2.5 h-2.5 bg-yellow-300 rounded-full absolute -top-1 -right-1 border border-black animate-ping" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white uppercase">
                  Command Block Console
                </h3>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${modeBadgeColor}`}>
                  {mode.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-stone-400">
                World Coordinate: <span className="text-emerald-400 font-bold">X: {formatBlockNumber(blockData.x)}</span>, <span className="text-emerald-400 font-bold">Y: {blockData.y}</span>
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

        {/* Command Input Area */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Terminal size={14} className="text-amber-400" />
              <span>Console Command</span>
            </label>
            <span className="text-[10px] text-stone-400">
              Supports /tp up to 200,000,000 Billion blocks!
            </span>
          </div>

          <div className="relative">
            <span className="absolute left-3 top-3 text-stone-500 text-sm font-bold select-none">/</span>
            <input
              type="text"
              value={command.startsWith('/') ? command.slice(1) : command}
              onChange={(e) => setCommand('/' + e.target.value.replace(/^\//, ''))}
              placeholder="tp 200000000000000000 7  or  time set day  or  give diamond 64"
              className="w-full bg-stone-950 border-2 border-stone-700 rounded-xl pl-7 pr-28 py-2.5 text-xs text-emerald-300 font-mono placeholder:text-stone-600 focus:outline-none focus:border-amber-400 transition"
              autoFocus
            />
            <button
              onClick={handleTestExecute}
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-black font-bold text-xs rounded-lg flex items-center gap-1 cursor-pointer transition active:scale-95 shadow"
              title="Test execute command immediately"
            >
              <Play size={12} fill="black" />
              <span>Test Run</span>
            </button>
          </div>
        </div>

        {/* Quick Command Presets */}
        <div>
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block mb-1.5">
            Quick Command Presets (Click to insert):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {QUICK_COMMAND_PRESETS.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setCommand(p.cmd)}
                className="text-left px-2 py-1.5 rounded-lg bg-stone-950/70 hover:bg-amber-950/50 border border-stone-800 hover:border-amber-500/60 text-[11px] text-stone-300 hover:text-amber-200 transition cursor-pointer truncate shadow-xs"
                title={p.cmd}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Command Block Settings: Mode, Condition, Redstone */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* Block Mode Button */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Block Type</span>
            <button
              type="button"
              onClick={() => {
                if (mode === 'impulse') setMode('repeat');
                else if (mode === 'repeat') setMode('chain');
                else setMode('impulse');
              }}
              className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-between cursor-pointer transition shadow ${
                mode === 'impulse' ? 'bg-orange-950/80 border-orange-500 text-orange-200' :
                mode === 'repeat' ? 'bg-purple-950/80 border-purple-500 text-purple-200' :
                'bg-teal-950/80 border-teal-500 text-teal-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {mode === 'impulse' && <span>🟧 Impulse</span>}
                {mode === 'repeat' && <span>🟪 Repeating</span>}
                {mode === 'chain' && <span>🟩 Chain</span>}
              </div>
              <Repeat size={12} className="opacity-70" />
            </button>
          </div>

          {/* Condition Button */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Condition</span>
            <button
              type="button"
              onClick={() => setCondition(c => c === 'unconditional' ? 'conditional' : 'unconditional')}
              className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-between cursor-pointer transition shadow ${
                condition === 'unconditional'
                  ? 'bg-stone-800/90 border-stone-600 text-stone-200 hover:border-stone-500'
                  : 'bg-amber-950/80 border-amber-500 text-amber-200'
              }`}
            >
              <span>{condition === 'unconditional' ? 'Unconditional' : 'Conditional'}</span>
              <Shield size={12} className="opacity-70" />
            </button>
          </div>

          {/* Redstone Mode Button */}
          <div className="flex flex-col gap-1">
            <span className="text-[10px] text-stone-400 uppercase tracking-wider font-bold">Redstone Trigger</span>
            <button
              type="button"
              onClick={() => setRedstone(r => r === 'always_active' ? 'needs_redstone' : 'always_active')}
              className={`p-2.5 rounded-xl border-2 font-bold text-xs flex items-center justify-between cursor-pointer transition shadow ${
                redstone === 'always_active'
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                  : 'bg-red-950/80 border-red-500 text-red-200'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Zap size={13} className={redstone === 'always_active' ? 'text-emerald-400' : 'text-red-400'} />
                <span>{redstone === 'always_active' ? 'Always Active' : 'Needs Redstone'}</span>
              </div>
              <span className="text-[10px] opacity-70">Toggle</span>
            </button>
          </div>
        </div>

        {/* Previous Output Log Window */}
        <div className="space-y-1">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block">
            Previous Console Output:
          </span>
          <div className="bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs font-mono text-emerald-400 min-h-[50px] max-h-[85px] overflow-y-auto whitespace-pre-wrap select-text">
            {outputLog}
          </div>
        </div>

        {/* Custom Server / Block Name */}
        <div className="flex items-center gap-3">
          <label className="text-[11px] text-stone-400 whitespace-nowrap">
            Hover Note / Entity Name:
          </label>
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="@"
            className="flex-1 bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-300 font-mono focus:outline-none focus:border-stone-600"
          />
        </div>

        {/* Modal Action Buttons */}
        <div className="flex items-center justify-between border-t border-stone-800 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <X size={14} />
            <span>Cancel</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestExecute}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow"
            >
              <Play size={13} fill="black" />
              <span>Execute</span>
            </button>

            <button
              type="button"
              onClick={handleDone}
              className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-black rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg active:scale-95"
            >
              <Check size={14} />
              <span>Done</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
