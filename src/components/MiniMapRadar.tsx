/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, ZoomIn, ZoomOut, Layers, Eye, ShieldAlert, Crosshair, ChevronUp, ChevronDown } from 'lucide-react';
import { getBiomeForX } from '../utils/proceduralWorld';

interface EntityBlip {
  id: number;
  x: number;
  y: number;
  type: 'player' | 'hostile' | 'friendly' | 'boss' | 'ore';
  name: string;
}

interface MiniMapRadarProps {
  playerX: number;
  playerY: number;
  facingDir: 'left' | 'right';
  entities: EntityBlip[];
  worldRows: number;
  worldCols: number;
  onWarpClick?: (x: number, y: number) => void;
}

export default function MiniMapRadar({
  playerX,
  playerY,
  facingDir,
  entities,
  worldRows,
  worldCols,
}: MiniMapRadarProps) {
  const [zoom, setZoom] = useState<number>(1.5); // Radar range
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const radarRadius = 24 / zoom; // Blocks visible in radius
  const currentBiome = getBiomeForX(playerX);

  return (
    <div className="select-none font-mono pointer-events-auto">
      {/* Radar Box */}
      <div className="bg-stone-950/90 border-2 border-emerald-500/70 rounded-2xl shadow-2xl p-2 flex flex-col items-center backdrop-blur-md">
        {/* Radar Header */}
        <div className="w-full flex items-center justify-between text-[10px] text-stone-300 pb-1 mb-1 border-b border-stone-800 gap-1">
          <div className="flex items-center gap-1 font-bold text-emerald-400">
            <Compass size={11} className="text-emerald-400" />
            <span>RADAR [N]</span>
          </div>
          <span className="text-[9px] text-stone-400 truncate max-w-[80px]" title={currentBiome.name}>
            {currentBiome.name.split(' ')[0]}
          </span>
          <button
            onClick={() => setIsCollapsed(c => !c)}
            className="text-stone-400 hover:text-white p-0.5 cursor-pointer"
            title={isCollapsed ? 'Expand Radar' : 'Collapse Radar'}
          >
            {isCollapsed ? <ChevronDown size={11} /> : <ChevronUp size={11} />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Circular Radar Screen */}
            <div className="relative w-36 h-36 rounded-full bg-stone-900 border-2 border-emerald-500/50 overflow-hidden shadow-inner flex items-center justify-center">
              {/* Polar Grid Lines */}
              <div className="absolute inset-0 rounded-full border border-emerald-500/20" />
              <div className="absolute inset-4 rounded-full border border-emerald-500/20" />
              <div className="absolute inset-8 rounded-full border border-emerald-500/20" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-emerald-500/20" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-emerald-500/20" />

              {/* Sweeping Radar Beam */}
              <div 
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(16, 185, 129, 0.25) 0deg, transparent 60deg)',
                  animation: 'spin 4s linear infinite',
                }}
              />

              {/* Entity Blips */}
              {entities.map((e) => {
                const dx = e.x - playerX;
                const dy = e.y - playerY;

                // Within radar radius
                if (Math.hypot(dx, dy) > radarRadius) return null;

                // Map to percentage (-50% to +50%)
                const posX = 50 + (dx / radarRadius) * 45;
                const posY = 50 + (dy / radarRadius) * 45;

                const color = e.type === 'boss' 
                  ? 'bg-purple-500 ring-2 ring-yellow-400 animate-ping' 
                  : e.type === 'hostile' 
                  ? 'bg-red-500' 
                  : e.type === 'friendly' 
                  ? 'bg-emerald-400' 
                  : 'bg-yellow-400';

                return (
                  <div
                    key={e.id}
                    className={`absolute w-2 h-2 rounded-full -translate-x-1/2 -translate-y-1/2 ${color} shadow`}
                    style={{ left: `${posX}%`, top: `${posY}%` }}
                    title={`${e.name} (${e.type})`}
                  />
                );
              })}

              {/* Center Player Marker */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                <div 
                  className="w-2.5 h-2.5 bg-cyan-400 rounded-xs transform"
                  style={{ transform: facingDir === 'right' ? 'rotate(45deg)' : 'rotate(-135deg)' }}
                />
              </div>
            </div>

            {/* Radar Coordinates & Zoom Bar */}
            <div className="w-full flex items-center justify-between mt-1.5 text-[9.5px] text-stone-400">
              <span className="text-cyan-300 font-bold">X:{playerX} Y:{playerY}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setZoom(z => Math.min(3, z + 0.5))}
                  className="w-4 h-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center justify-center font-bold text-[9px] cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={() => setZoom(z => Math.max(0.75, z - 0.5))}
                  className="w-4 h-4 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center justify-center font-bold text-[9px] cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
