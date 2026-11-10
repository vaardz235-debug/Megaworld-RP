/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { petCompanionManager, PET_CATALOG, PetDefinition } from '../utils/petCompanionManager';
import { Heart, Sparkles, Shield, Compass, Award, Utensils, X, Check, ArrowRight } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface CompanionPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryFoodItems?: Record<string, { count: number }>;
}

export default function CompanionPetModal({
  isOpen,
  onClose,
  inventoryFoodItems = { apple: { count: 5 }, bread: { count: 3 }, coal: { count: 6 }, candy_corn: { count: 2 } },
}: CompanionPetModalProps) {
  const [, setTick] = useState(0);
  const [selectedPet, setSelectedPet] = useState<PetDefinition>(PET_CATALOG[0]);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = petCompanionManager.subscribe(() => {
      setTick(t => t + 1);
    });
    return unsub;
  }, []);

  if (!isOpen) return null;

  const activePet = petCompanionManager.getActivePet();
  const level = petCompanionManager.getLevel();
  const xp = petCompanionManager.getXp();
  const behavior = petCompanionManager.getBehavior();
  const autoLoot = petCompanionManager.getAutoLootEnabled();

  const handleEquipPet = (pet: PetDefinition) => {
    petCompanionManager.setActivePet(pet.id);
    setSelectedPet(pet);
    setFeedbackMsg(`Equipped ${pet.name} as your active companion!`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleFeed = (foodType: string) => {
    const result = petCompanionManager.feedPet(foodType);
    setFeedbackMsg(result.message);
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none font-mono animate-fade-in">
      <div className="bg-stone-950 border-4 border-cyan-500/80 rounded-3xl w-full max-w-4xl max-h-[85vh] shadow-[0_20px_70px_rgba(6,182,212,0.35)] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="bg-stone-900 border-b border-stone-800 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-600 to-sky-600 flex items-center justify-center text-xl shadow">
              🐾
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                Companion Pet Sanctuary
                <span className="text-[10px] uppercase font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full">
                  Followers & Perks
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Adopt loyal multiverse companions that follow you, pacify hostile mobs, and auto-harvest mined resources!
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

        {/* Feedback Banner */}
        {feedbackMsg && (
          <div className="bg-cyan-950/90 border-b border-cyan-500/60 px-4 py-2 text-xs font-bold text-cyan-200 text-center flex items-center justify-center gap-2">
            <Sparkles size={14} className="text-cyan-400 animate-spin" />
            <span>{feedbackMsg}</span>
          </div>
        )}

        {/* Modal Body: Pets Grid (Left) + Selected Pet Details & Feeding (Right) */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          {/* Left: Pet Selection List */}
          <div className="md:col-span-5 border-r border-stone-800 p-4 overflow-y-auto space-y-2.5 bg-stone-900/40">
            <div className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">
              Available Companions ({PET_CATALOG.length})
            </div>

            {PET_CATALOG.map((pet) => {
              const isEquipped = activePet?.id === pet.id;
              const isSelected = selectedPet.id === pet.id;

              return (
                <div
                  key={pet.id}
                  onClick={() => setSelectedPet(pet)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected 
                      ? 'bg-stone-800/90 border-cyan-400 shadow-md' 
                      : 'bg-stone-900/60 border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow border"
                      style={{ backgroundColor: `${pet.themeColor}20`, borderColor: pet.themeColor }}
                    >
                      {pet.icon}
                    </div>
                    <div>
                      <div className="text-white font-bold text-xs flex items-center gap-1.5">
                        <span>{pet.name}</span>
                        {isEquipped && (
                          <span className="text-[9px] bg-emerald-500/30 text-emerald-300 border border-emerald-500/50 px-1.5 py-0.2 rounded font-black">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-400">{pet.species}</div>
                      <div className="text-[9.5px] text-cyan-400/90 font-bold mt-0.5 truncate max-w-[170px]">
                        {pet.perkDescription}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEquipPet(pet);
                    }}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                      isEquipped 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                    }`}
                  >
                    {isEquipped ? 'Equipped' : 'Equip'}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Right: Selected Pet Stats, Level Progression & Feeding */}
          <div className="md:col-span-7 p-5 overflow-y-auto space-y-4 bg-stone-950 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Pet Card Header */}
              <div className="flex items-start justify-between gap-3 border-b border-stone-800 pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl shadow-lg border-2"
                    style={{ backgroundColor: `${selectedPet.themeColor}25`, borderColor: selectedPet.themeColor }}
                  >
                    {selectedPet.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">{selectedPet.name}</h3>
                    <div className="text-xs text-stone-400">{selectedPet.species} • {selectedPet.brand}</div>
                    <div className="text-xs font-bold text-cyan-300 mt-0.5">
                      Level {level} Companion (XP: {xp}/100)
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleEquipPet(selectedPet)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-500 hover:to-sky-500 text-white rounded-xl text-xs font-black cursor-pointer shadow transition active:scale-95 border border-cyan-400"
                >
                  {activePet?.id === selectedPet.id ? 'Equipped' : 'Set as Active'}
                </button>
              </div>

              {/* XP Progress Bar */}
              <div>
                <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                  <span>Companion Mastery Level {level}</span>
                  <span className="text-cyan-300 font-bold">{xp}% Next Level</span>
                </div>
                <div className="w-full h-3 bg-stone-900 rounded-full overflow-hidden border border-stone-800">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300"
                    style={{ width: `${xp}%` }}
                  />
                </div>
              </div>

              {/* Description & Perk Box */}
              <div className="bg-stone-900/70 border border-stone-800 p-3.5 rounded-2xl space-y-2">
                <p className="text-xs text-stone-300 leading-relaxed">{selectedPet.description}</p>
                <div className="flex items-center gap-2 pt-2 border-t border-stone-800 text-xs font-bold text-emerald-300">
                  <Sparkles size={14} className="text-emerald-400 shrink-0" />
                  <span>Perk: {selectedPet.perkDescription}</span>
                </div>
              </div>

              {/* Behavior Mode Switcher */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                  Companion Behavior Mode:
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['follow', 'guard', 'stay'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => petCompanionManager.setBehavior(mode)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold capitalize transition border cursor-pointer ${
                        behavior === mode 
                          ? 'bg-cyan-600 text-white border-cyan-400 shadow' 
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-400 border-stone-800'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Auto-Loot Toggle */}
              <div className="flex items-center justify-between bg-stone-900/60 border border-stone-800 p-3 rounded-2xl">
                <div>
                  <div className="text-xs font-bold text-white">Auto-Loot Nearby Dropped Items</div>
                  <div className="text-[10px] text-stone-400">Pet automatically gathers mined minerals and items into your inventory</div>
                </div>
                <button
                  onClick={() => petCompanionManager.toggleAutoLoot()}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition border ${
                    autoLoot 
                      ? 'bg-emerald-600 border-emerald-400 text-white' 
                      : 'bg-stone-800 border-stone-700 text-stone-400'
                  }`}
                >
                  {autoLoot ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* Treat & Food Feeding Section */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                  <Utensils size={13} />
                  <span>Feed Treats (Favorite: {selectedPet.favoriteFood}):</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['apple', 'bread', 'coal', 'candy_corn'].map((food) => {
                    const count = inventoryFoodItems[food]?.count || 0;
                    return (
                      <button
                        key={food}
                        onClick={() => handleFeed(food)}
                        disabled={count <= 0}
                        className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 cursor-pointer transition ${
                          count > 0 
                            ? 'bg-stone-900 hover:bg-stone-800 border-stone-700 text-stone-200' 
                            : 'bg-stone-950 border-stone-900 text-stone-600 cursor-not-allowed opacity-50'
                        }`}
                      >
                        <span className="text-lg">
                          {food === 'apple' ? '🍎' : food === 'bread' ? '🍞' : food === 'coal' ? '⚫' : '🍬'}
                        </span>
                        <span className="capitalize">{food}</span>
                        <span className="text-[10px] text-stone-400 font-normal">x{count} left</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex justify-end">
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
