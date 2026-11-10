/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { vehicleManager } from '../utils/vehicleManager';
import { Gauge, Zap, Volume2, Lightbulb, LogOut, Sparkles } from 'lucide-react';

interface VehicleMountHUDProps {
  onOpenGarage?: () => void;
}

export default function VehicleMountHUD({ onOpenGarage }: VehicleMountHUDProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsub = vehicleManager.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  const activeVehicle = vehicleManager.getActiveVehicle();
  const speed = vehicleManager.getSpeedKmh();
  const fuel = vehicleManager.getFuel();
  const isBoosting = vehicleManager.getIsBoosting();
  const isHeadlightsOn = vehicleManager.getIsHeadlightsOn();

  if (!activeVehicle) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto select-none font-mono animate-fade-in">
      <div className="bg-stone-950/95 border-2 border-amber-500/80 rounded-2xl p-2.5 shadow-[0_10px_35px_rgba(245,158,11,0.35)] flex items-center gap-3 backdrop-blur-md">
        {/* Vehicle Icon & Identity */}
        <div className="flex items-center gap-2 border-r border-stone-800 pr-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center text-xl shadow">
            {activeVehicle.icon}
          </div>
          <div>
            <div className="text-white font-bold text-xs flex items-center gap-1.5">
              <span>{activeVehicle.name}</span>
              <span className="text-[9px] uppercase px-1.5 py-0.2 rounded" style={{ backgroundColor: `${activeVehicle.themeColor}35`, color: activeVehicle.themeColor }}>
                {activeVehicle.brand}
              </span>
            </div>
            <div className="text-[10px] text-amber-300 font-bold">
              {activeVehicle.specialAbility}
            </div>
          </div>
        </div>

        {/* Speedometer Gauge */}
        <div className="flex flex-col items-center border-r border-stone-800 pr-3">
          <div className="text-[9px] text-stone-400 uppercase font-bold flex items-center gap-1">
            <Gauge size={11} className="text-amber-400" />
            <span>Speed</span>
          </div>
          <div className="text-base font-black text-white">
            <span className={speed > 70 ? 'text-amber-400' : 'text-white'}>{speed}</span>
            <span className="text-[10px] text-stone-400 font-normal ml-0.5">KM/H</span>
          </div>
        </div>

        {/* Turbo / Fuel Energy Bar */}
        <div className="flex flex-col gap-1 w-28 border-r border-stone-800 pr-3">
          <div className="flex items-center justify-between text-[9px] text-stone-400 font-bold uppercase">
            <span className="flex items-center gap-1">
              <Zap size={10} className="text-yellow-400" />
              <span>Fuel/Boost</span>
            </span>
            <span className="text-yellow-300">{fuel}%</span>
          </div>
          <div className="w-full h-2.5 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
            <div 
              className={`h-full transition-all duration-150 ${isBoosting ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' : 'bg-emerald-500'}`}
              style={{ width: `${fuel}%` }}
            />
          </div>
        </div>

        {/* Action Buttons: Horn, Headlights, Dismount */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => vehicleManager.honkHorn()}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition border border-stone-700"
            title="Honk Horn [H Key]"
          >
            <Volume2 size={13} className="text-yellow-400" />
            <span className="text-[10px]">Horn [H]</span>
          </button>

          <button
            onClick={() => vehicleManager.toggleHeadlights()}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 cursor-pointer transition border ${
              isHeadlightsOn 
                ? 'bg-amber-950/80 border-amber-500 text-amber-300' 
                : 'bg-stone-800 border-stone-700 text-stone-400'
            }`}
            title="Toggle Headlights [L Key]"
          >
            <Lightbulb size={13} />
            <span className="text-[10px]">{isHeadlightsOn ? 'Lights: ON' : 'Lights: OFF'}</span>
          </button>

          <button
            onClick={() => vehicleManager.dismountVehicle()}
            className="px-2.5 py-1.5 bg-red-600/80 hover:bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer transition border border-red-500"
            title="Dismount Vehicle [Shift Key]"
          >
            <LogOut size={13} />
            <span className="text-[10px]">Dismount</span>
          </button>
        </div>
      </div>
    </div>
  );
}
