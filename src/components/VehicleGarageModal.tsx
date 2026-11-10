/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { vehicleManager, VEHICLE_CATALOG, VehicleDefinition } from '../utils/vehicleManager';
import { Gauge, Zap, Volume2, Shield, Check, Flame, X, Sparkles } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface VehicleGarageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleGarageModal({ isOpen, onClose }: VehicleGarageModalProps) {
  const [, setTick] = useState(0);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleDefinition>(VEHICLE_CATALOG[0]);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const unsub = vehicleManager.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const activeVehicle = vehicleManager.getActiveVehicle();

  const handleMount = (veh: VehicleDefinition) => {
    vehicleManager.mountVehicle(veh.id);
    setSelectedVehicle(veh);
    setFeedback(`Mounted ${veh.name}! Use W, A, S, D to drive. Shift to boost!`);
    setTimeout(() => {
      setFeedback(null);
      onClose();
    }, 1500);
  };

  const handleDismount = () => {
    vehicleManager.dismountVehicle();
    setFeedback('Dismounted vehicle.');
    setTimeout(() => setFeedback(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none font-mono animate-fade-in">
      <div className="bg-stone-950 border-4 border-amber-500/80 rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-[0_20px_70px_rgba(245,158,11,0.35)] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="bg-stone-900 border-b border-stone-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-yellow-600 flex items-center justify-center text-xl shadow">
              🏎️
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Multiverse Vehicle & Mount Garage
                <span className="text-[10px] uppercase font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  {VEHICLE_CATALOG.length} Mounts Available
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Summon trains, supersonic jet planes (Steremy), flying sleighs, jetpacks, and race karts to traverse the 200,000,000 block universe at breakneck speed!
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
          <div className="bg-amber-950/90 border-b border-amber-500/60 px-4 py-2 text-xs font-bold text-amber-200 text-center flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            <span>{feedback}</span>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Vehicle List */}
          <div className="md:col-span-5 border-r border-stone-800 p-4 overflow-y-auto space-y-2.5 bg-stone-900/40">
            <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">
              Vehicle Catalog
            </div>

            {VEHICLE_CATALOG.map((veh) => {
              const isMounted = activeVehicle?.id === veh.id;
              const isSelected = selectedVehicle.id === veh.id;

              return (
                <div
                  key={veh.id}
                  onClick={() => setSelectedVehicle(veh)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-stone-800/90 border-amber-400 shadow-md' 
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow border"
                      style={{ backgroundColor: `${veh.themeColor}20`, borderColor: veh.themeColor }}
                    >
                      {veh.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs flex items-center gap-1.5">
                        <span>{veh.name}</span>
                        {isMounted && (
                          <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.2 rounded font-black">
                            MOUNTED
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">{veh.brand}</div>
                      <div className="text-[10px] text-amber-400 font-bold mt-0.5">
                        Top Speed: {veh.topSpeedKmh} KM/H {veh.canFly ? '• ✈️ Flight' : ''}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isMounted) handleDismount();
                      else handleMount(veh);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      isMounted 
                        ? 'bg-red-600/80 text-white hover:bg-red-600' 
                        : 'bg-amber-600 hover:bg-amber-500 text-white'
                    }`}
                  >
                    {isMounted ? 'Dismount' : 'Ride'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Vehicle Preview & Controls */}
          <div className="md:col-span-7 p-5 overflow-y-auto space-y-4 bg-stone-950 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Vehicle Title & Icon */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg border-2"
                    style={{ backgroundColor: `${selectedVehicle.themeColor}25`, borderColor: selectedVehicle.themeColor }}
                  >
                    {selectedVehicle.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedVehicle.name}</h3>
                    <div className="text-xs text-stone-400">{selectedVehicle.brand}</div>
                    <div className="text-xs font-bold text-amber-300 mt-0.5">
                      {selectedVehicle.specialAbility}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleMount(selectedVehicle)}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white rounded-xl text-xs font-black cursor-pointer shadow transition active:scale-95 border border-amber-400"
                >
                  {activeVehicle?.id === selectedVehicle.id ? 'Currently Riding' : 'Mount & Drive'}
                </button>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2.5 bg-stone-900/60 border border-stone-800 p-3 rounded-2xl text-center">
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Max Velocity</div>
                  <div className="text-base font-black text-white">{selectedVehicle.topSpeedKmh} KM/H</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Speed Boost</div>
                  <div className="text-base font-black text-amber-400">+{Math.round((selectedVehicle.speedMultiplier - 1) * 100)}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Traversal Mode</div>
                  <div className="text-base font-black text-cyan-400">
                    {selectedVehicle.canFly ? 'Air & Ground' : selectedVehicle.canHoverWater ? 'Water & Ground' : 'Terrain & Rails'}
                  </div>
                </div>
              </div>

              {/* Description Box */}
              <div className="bg-stone-900/70 border border-stone-800 p-3.5 rounded-2xl text-xs text-stone-300 leading-relaxed">
                {selectedVehicle.description}
              </div>

              {/* Driving Controls Instructions */}
              <div className="bg-stone-900/50 border border-stone-800 p-3 rounded-xl space-y-1.5 text-xs">
                <div className="font-bold text-amber-400 uppercase tracking-wider text-[11px]">
                  🎮 Driving Instructions:
                </div>
                <ul className="text-stone-300 space-y-1 text-[11px]">
                  <li>• <strong className="text-white">W / A / S / D</strong> or Arrow Keys: Steer & accelerate</li>
                  <li>• <strong className="text-white">Shift</strong>: Turbo boost sprint (drains fuel)</li>
                  <li>• <strong className="text-white">Space</strong>: Jump / Liftoff (for flying sleigh & jetpack)</li>
                  <li>• <strong className="text-white">H</strong>: Sound vehicle horn / steam whistle</li>
                  <li>• <strong className="text-white">L</strong>: Toggle vehicle headlights</li>
                </ul>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-between items-center">
              <button
                onClick={() => vehicleManager.honkHorn()}
                className="mc-btn px-4 py-2 text-xs font-bold rounded flex items-center gap-1.5"
              >
                <Volume2 size={14} className="text-yellow-400" />
                <span>Test Horn Sound</span>
              </button>

              <button
                onClick={onClose}
                className="mc-btn px-6 py-2.5 text-xs font-bold rounded"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
