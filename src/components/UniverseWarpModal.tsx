/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FAMOUS_COORDINATES, 
  formatBlockNumber, 
  MAX_WORLD_COORDINATE, 
  MIN_WORLD_COORDINATE 
} from '../utils/commandEngine';
import { Compass, Sparkles, Navigation, Globe, ArrowRight, Zap, MapPin } from 'lucide-react';

interface UniverseWarpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentX: number;
  currentY: number;
  onWarp: (x: number, y: number) => void;
}

export default function UniverseWarpModal({
  isOpen,
  onClose,
  currentX,
  currentY,
  onWarp,
}: UniverseWarpModalProps) {
  const [customX, setCustomX] = useState<string>('200000000000000000');
  const [customY, setCustomY] = useState<string>('7');

  if (!isOpen) return null;

  const handleCustomWarp = () => {
    let x = parseFloat(customX.replace(/,/g, ''));
    let y = parseFloat(customY.replace(/,/g, ''));
    if (isNaN(x)) x = 0;
    if (isNaN(y)) y = 7;
    x = Math.max(MIN_WORLD_COORDINATE, Math.min(MAX_WORLD_COORDINATE, Math.round(x)));
    y = Math.max(0, Math.min(48, Math.round(y)));
    onWarp(x, y);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none font-mono">
      <div className="bg-stone-900 border-4 border-indigo-500/80 rounded-3xl p-5 sm:p-6 max-w-xl w-full shadow-[0_20px_70px_rgba(99,102,241,0.5)] text-white relative flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-500/30 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border border-indigo-400 flex items-center justify-center text-xl shadow-lg animate-pulse">
              🌌
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white">
                  200,000,000 Billion Block Teleporter
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/40">
                  200Q Blocks
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Current Position: <span className="text-emerald-400 font-bold">X: {formatBlockNumber(currentX)}</span>, <span className="text-emerald-400 font-bold">Y: {currentY}</span>
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

        {/* World Scale Info Banner */}
        <div className="bg-gradient-to-r from-indigo-950/90 to-purple-950/90 border border-indigo-500/40 rounded-2xl p-3.5 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-indigo-300 font-bold flex items-center gap-1.5">
              <Globe size={14} className="text-pink-400" />
              <span>Multiverse World Boundaries:</span>
            </span>
            <span className="text-amber-300 font-bold">200 Quadrillion Blocks</span>
          </div>
          <p className="text-[11px] text-stone-300 leading-relaxed">
            The world seamlessly generates infinite procedural biomes, the legendary <strong>Far Lands</strong> ($X \ge 12,550,821$), <strong>Billion-Block Ridge</strong> ($X \ge 10^9$), <strong>29 Billion Outer Border</strong>, and the <strong>200,000,000 Billion Universe Frontier</strong> ($X = 200,000,000,000,000,000$)!
          </p>
        </div>

        {/* Custom Coordinate Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider">
            <Navigation size={13} className="text-amber-400" />
            <span>Warp to Custom Coordinates (X, Y)</span>
          </label>
          <div className="flex gap-2 items-center">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-2.5 text-stone-500 text-xs font-bold">X:</span>
              <input
                type="text"
                value={customX}
                onChange={(e) => setCustomX(e.target.value)}
                placeholder="200000000000000000"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-3 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>
            <div className="w-24 relative">
              <span className="absolute left-3 top-2.5 text-stone-500 text-xs font-bold">Y:</span>
              <input
                type="text"
                value={customY}
                onChange={(e) => setCustomY(e.target.value)}
                placeholder="7"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-3 py-2 text-xs text-emerald-300 font-mono focus:outline-none focus:border-indigo-400"
              />
            </div>
            <button
              onClick={handleCustomWarp}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-lg cursor-pointer transition active:scale-95"
            >
              <span>Warp</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Famous Multiverse Destinations */}
        <div className="space-y-1.5">
          <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
            Famous Multiverse Warp Points:
          </span>
          <div className="grid grid-cols-1 gap-2">
            {FAMOUS_COORDINATES.map((dest, idx) => (
              <button
                key={idx}
                onClick={() => {
                  onWarp(dest.x, dest.y);
                  onClose();
                }}
                className="p-2.5 rounded-xl bg-stone-950/70 hover:bg-indigo-950/60 border border-stone-800 hover:border-indigo-500/60 flex items-center justify-between text-left transition cursor-pointer group shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 rounded-lg bg-stone-900 border border-stone-800 group-hover:border-indigo-500/40 text-base">
                    {idx === 0 ? '🌲' : idx === 1 ? '🏛️' : idx === 2 ? '🏕️' : idx === 3 ? '🪐' : idx === 4 ? '⛰️' : idx === 5 ? '🌌' : '⚡'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-stone-200 group-hover:text-indigo-200 flex items-center gap-1.5">
                      <span>{dest.name}</span>
                    </div>
                    <div className="text-[10px] text-stone-400">{dest.desc}</div>
                  </div>
                </div>

                <div className="text-right font-mono flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-400 bg-stone-900/90 px-2 py-0.5 rounded-lg border border-stone-800">
                    X: {formatBlockNumber(dest.x)}
                  </span>
                  <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-1 transition" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-stone-800 pt-3">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            Close Warp Portal
          </button>
        </div>

      </div>
    </div>
  );
}
