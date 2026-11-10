import React from 'react';
import { CharacterData } from './CharacterAvatar';

interface XilamAvatarProps {
  character: CharacterData;
  isWalking?: boolean;
  heldItem?: string;
}

export default function XilamAvatar({ character, isWalking = false, heldItem }: XilamAvatarProps) {
  const subtype = (character.subtype || character.name || '').toLowerCase();
  const isBob = subtype.includes('bob');
  const isOlivia = subtype.includes('olivia');
  const isBernie = subtype.includes('bernie');
  const isJack = subtype.includes('jack');
  const isJoey = subtype.includes('joey');
  const isDeeDee = subtype.includes('dee');
  const isMarky = subtype.includes('marky');
  const isSharko = subtype.includes('sharko');
  const isZig = subtype.includes('zig');
  const isMarina = subtype.includes('marina');
  const isOggy = subtype.includes('oggy') || (!isBob && !isOlivia && !isBernie && !isJack && !isSharko && !isZig && !isMarina && !isJoey && !isDeeDee && !isMarky);

  return (
    <div className={`relative flex flex-col items-center select-none ${isWalking ? 'animate-bounce' : ''}`}>
      {/* ================= OGGY ================= */}
      {isOggy && (
        <div className="relative flex flex-col items-center">
          {/* Cat Ears */}
          <div className="flex justify-between w-12 -mb-2 z-10 px-0.5">
            <div className="w-4 h-4 bg-blue-600 border-2 border-black rounded-tl-full transform -rotate-12 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-pink-300 rounded-tl-full" />
            </div>
            <div className="w-4 h-4 bg-blue-600 border-2 border-black rounded-tr-full transform rotate-12 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-pink-300 rounded-tr-full" />
            </div>
          </div>

          {/* Oggy Head */}
          <div className="w-14 h-12 bg-blue-500 border-2 border-black rounded-2xl relative shadow-md flex flex-col items-center justify-center">
            {/* Eyes */}
            <div className="flex gap-1 z-10">
              <div className="w-4 h-5 bg-white border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
              <div className="w-4 h-5 bg-white border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2.5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
            </div>

            {/* Giant Iconic Red Nose */}
            <div className="w-5 h-4 bg-red-600 border-2 border-black rounded-full -mt-1 z-20 shadow-sm relative">
              <div className="w-1.5 h-1 bg-white/80 rounded-full absolute top-0.5 left-1" />
            </div>

            {/* Whiskers */}
            <div className="absolute left-0 top-6 w-3 h-0.5 bg-black -rotate-12 -translate-x-2" />
            <div className="absolute left-0 top-7.5 w-3 h-0.5 bg-black rotate-6 -translate-x-2" />
            <div className="absolute right-0 top-6 w-3 h-0.5 bg-black rotate-12 translate-x-2" />
            <div className="absolute right-0 top-7.5 w-3 h-0.5 bg-black -rotate-6 translate-x-2" />

            {/* Wide Smile */}
            <div className="w-6 h-2 border-b-2 border-black rounded-full -mt-0.5" />
          </div>

          {/* Oggy Body (Chubby) */}
          <div className="w-16 h-16 bg-blue-500 border-2 border-black rounded-3xl -mt-2 relative shadow-lg flex flex-col items-center justify-center">
            {/* Cyan Belly */}
            <div className="w-10 h-11 bg-cyan-200 border border-blue-600 rounded-full flex items-center justify-center shadow-inner">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
            </div>

            {/* Flyswatter in hand */}
            <div className="absolute -right-3 -top-1 rotate-45 pointer-events-none drop-shadow">
              <div className="w-1 h-8 bg-amber-800 border border-amber-950" />
              <div className="w-5 h-6 bg-red-500 border border-black -mt-8 -ml-2 rounded-xs grid grid-cols-2 gap-0.5 p-0.5 opacity-90">
                <div className="bg-red-700/50" />
                <div className="bg-red-700/50" />
                <div className="bg-red-700/50" />
                <div className="bg-red-700/50" />
              </div>
            </div>
          </div>

          {/* Feet */}
          <div className="flex gap-4 -mt-1">
            <div className="w-6 h-3 bg-blue-600 border-2 border-black rounded-full" />
            <div className="w-6 h-3 bg-blue-600 border-2 border-black rounded-full" />
          </div>
        </div>
      )}

      {/* ================= JACK ================= */}
      {isJack && (
        <div className="relative flex flex-col items-center">
          {/* Jack Ears */}
          <div className="flex justify-between w-14 -mb-2 z-10 px-1">
            <div className="w-4 h-4 bg-emerald-800 border-2 border-black rounded-tl-full transform -rotate-12" />
            <div className="w-4 h-4 bg-emerald-800 border-2 border-black rounded-tr-full transform rotate-12" />
          </div>

          {/* Tough Head */}
          <div className="w-16 h-13 bg-emerald-700 border-2 border-black rounded-2xl relative shadow-md flex flex-col items-center justify-center">
            {/* Fierce Eyes */}
            <div className="flex gap-1.5 z-10">
              <div className="w-4 h-4 bg-white border border-black rounded-sm transform rotate-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <div className="w-4 h-4 bg-white border border-black rounded-sm transform -rotate-6 flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
            </div>

            {/* Jack Orange Nose */}
            <div className="w-5 h-4 bg-orange-500 border-2 border-black rounded-md -mt-1 z-20 shadow-sm" />
            {/* Growl Mouth */}
            <div className="w-7 h-2.5 bg-neutral-900 border border-black rounded-sm flex items-center justify-around px-0.5 mt-0.5">
              <div className="w-1 h-1 bg-white rounded-xs" />
              <div className="w-1 h-1 bg-white rounded-xs" />
              <div className="w-1 h-1 bg-white rounded-xs" />
            </div>
          </div>

          {/* Buff Muscular Body with White Tank */}
          <div className="w-18 h-18 bg-emerald-700 border-2 border-black rounded-2xl -mt-2 relative shadow-lg flex flex-col items-center justify-center">
            {/* White Muscle Tank */}
            <div className="w-12 h-14 bg-white border-2 border-black rounded-xl flex flex-col items-center justify-center shadow-inner">
              <div className="text-[7px] font-mono font-black text-black">JACK</div>
            </div>
          </div>

          {/* Boots */}
          <div className="flex gap-4 -mt-1">
            <div className="w-6 h-3 bg-stone-900 border-2 border-black rounded-md" />
            <div className="w-6 h-3 bg-stone-900 border-2 border-black rounded-md" />
          </div>
        </div>
      )}

      {/* ================= JOEY (COCKROACH LEADER) ================= */}
      {isJoey && (
        <div className="relative flex flex-col items-center">
          {/* Curled Antennae */}
          <div className="flex justify-between w-10 -mb-2 z-10">
            <div className="w-4 h-6 border-l-2 border-t-2 border-black rounded-tl-full transform -rotate-45" />
            <div className="w-4 h-6 border-r-2 border-t-2 border-black rounded-tr-full transform rotate-45" />
          </div>

          {/* Purple Roach Head */}
          <div className="w-11 h-11 bg-fuchsia-700 border-2 border-black rounded-full relative shadow-md flex items-center justify-center">
            {/* Mismatched Eyes: Right Pink, Left Yellow */}
            <div className="flex gap-1 z-10 -mt-1">
              <div className="w-3.5 h-4 bg-pink-400 border border-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-3.5 h-4 bg-yellow-400 border border-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
            </div>
            {/* Smug smirk */}
            <div className="absolute bottom-1.5 w-4 h-1 border-b-2 border-black rounded-full rotate-6" />
          </div>

          {/* Roach Body with White Gloves */}
          <div className="w-10 h-13 bg-fuchsia-800 border-2 border-black rounded-2xl -mt-2 relative shadow-lg flex flex-col items-center justify-around py-1">
            <div className="w-7 h-1.5 bg-fuchsia-950 rounded-full" />
            <div className="w-7 h-1.5 bg-fuchsia-950 rounded-full" />
            <div className="w-7 h-1.5 bg-fuchsia-950 rounded-full" />

            {/* White Cartoon Gloves */}
            <div className="absolute -left-3 top-3 w-3 h-3 bg-white border border-black rounded-full shadow" />
            <div className="absolute -right-3 top-3 w-3 h-3 bg-white border border-black rounded-full shadow" />
          </div>

          {/* Tiny Roach Legs */}
          <div className="flex gap-3 -mt-0.5">
            <div className="w-2.5 h-4 border-l-2 border-b-2 border-black transform -rotate-12" />
            <div className="w-2.5 h-4 border-r-2 border-b-2 border-black transform rotate-12" />
          </div>
        </div>
      )}

      {/* ================= DEE DEE ================= */}
      {isDeeDee && (
        <div className="relative flex flex-col items-center">
          {/* Antennae */}
          <div className="flex justify-between w-8 -mb-2 z-10">
            <div className="w-3 h-5 border-l-2 border-t-2 border-black rounded-tl-full" />
            <div className="w-3 h-5 border-r-2 border-t-2 border-black rounded-tr-full" />
          </div>

          {/* Chubby Orange Head */}
          <div className="w-13 h-11 bg-orange-500 border-2 border-black rounded-2xl relative shadow-md flex items-center justify-center">
            {/* Big Green Hungry Eyes */}
            <div className="flex gap-1 z-10">
              <div className="w-4 h-4 bg-emerald-400 border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <div className="w-4 h-4 bg-emerald-400 border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
            </div>
            {/* Open hungry mouth */}
            <div className="absolute bottom-1 w-4 h-2 bg-rose-950 border border-black rounded-full" />
          </div>

          {/* Chubby Body holding burger */}
          <div className="w-14 h-14 bg-orange-600 border-2 border-black rounded-3xl -mt-2 relative shadow-lg flex flex-col items-center justify-center">
            <div className="w-9 h-9 bg-amber-400/80 rounded-full flex items-center justify-center">
              <span className="text-xs">🍔</span>
            </div>
          </div>

          <div className="flex gap-3 -mt-0.5">
            <div className="w-3 h-3 bg-orange-700 border border-black rounded-full" />
            <div className="w-3 h-3 bg-orange-700 border border-black rounded-full" />
          </div>
        </div>
      )}

      {/* ================= MARKY ================= */}
      {isMarky && (
        <div className="relative flex flex-col items-center">
          {/* Long Curled Antennae */}
          <div className="flex justify-between w-12 -mb-2 z-10">
            <div className="w-5 h-7 border-l-2 border-t-2 border-black rounded-tl-full transform -rotate-30" />
            <div className="w-5 h-7 border-r-2 border-t-2 border-black rounded-tr-full transform rotate-30" />
          </div>

          {/* Slim Gray Head */}
          <div className="w-10 h-13 bg-slate-500 border-2 border-black rounded-3xl relative shadow-md flex flex-col items-center justify-center">
            {/* Pink Eyelids Eyes */}
            <div className="flex gap-1 z-10 -mt-1">
              <div className="w-3 h-4 bg-pink-300 border border-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-3 h-4 bg-pink-300 border border-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
            </div>
            <div className="w-4 h-0.5 bg-black mt-2" />
          </div>

          {/* Tall Skinny Roach Body */}
          <div className="w-8 h-18 bg-slate-600 border-2 border-black rounded-xl -mt-2 relative shadow-lg flex flex-col items-center justify-around py-1">
            <div className="w-5 h-1 bg-slate-800 rounded-full" />
            <div className="w-5 h-1 bg-slate-800 rounded-full" />
            <div className="w-5 h-1 bg-slate-800 rounded-full" />
            <div className="w-5 h-1 bg-slate-800 rounded-full" />
          </div>

          <div className="flex gap-3 -mt-0.5">
            <div className="w-2 h-4 border-l-2 border-b-2 border-black" />
            <div className="w-2 h-4 border-r-2 border-b-2 border-black" />
          </div>
        </div>
      )}

      {/* ================= SHARKO ================= */}
      {isSharko && (
        <div className="relative flex flex-col items-center">
          {/* Dorsal Fin */}
          <div className="absolute -left-3 top-8 w-4 h-7 bg-slate-500 border-2 border-black rounded-tl-full transform -rotate-45" />

          {/* Shark Head */}
          <div className="w-16 h-14 bg-slate-400 border-2 border-black rounded-t-full rounded-b-2xl relative shadow-md flex flex-col items-center justify-center">
            {/* Fierce Shark Eyes */}
            <div className="flex gap-3 z-10 -mt-2">
              <div className="w-3.5 h-3.5 bg-white border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
              <div className="w-3.5 h-3.5 bg-white border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-black rounded-full" />
              </div>
            </div>

            {/* Giant Grin with Sharp Teeth */}
            <div className="w-12 h-5 bg-neutral-900 border-2 border-black rounded-b-full flex items-center justify-around px-0.5 mt-1 overflow-hidden">
              <div className="w-1.5 h-2 bg-white transform rotate-45" />
              <div className="w-1.5 h-2 bg-white transform rotate-45" />
              <div className="w-1.5 h-2 bg-white transform rotate-45" />
              <div className="w-1.5 h-2 bg-white transform rotate-45" />
              <div className="w-1.5 h-2 bg-white transform rotate-45" />
            </div>
          </div>

          {/* Muscular Torso & Red Lifeguard Shorts */}
          <div className="w-18 h-18 bg-slate-400 border-2 border-black rounded-2xl -mt-2 relative shadow-lg flex flex-col items-center justify-between overflow-hidden">
            {/* White Shark Belly */}
            <div className="w-10 h-10 bg-slate-100 rounded-full -mt-2 shadow-inner" />

            {/* Red Lifeguard Swim Shorts */}
            <div className="w-full h-8 bg-red-600 border-t-2 border-black flex items-center justify-center">
              <div className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-[8px] font-bold text-white">
                ✚
              </div>
            </div>
          </div>

          {/* Finned Feet */}
          <div className="flex gap-4 -mt-1">
            <div className="w-6 h-3 bg-slate-500 border-2 border-black rounded-full" />
            <div className="w-6 h-3 bg-slate-500 border-2 border-black rounded-full" />
          </div>
        </div>
      )}

      {/* ================= ZIG ================= */}
      {isZig && (
        <div className="relative flex flex-col items-center">
          {/* Hyena Ears */}
          <div className="flex justify-between w-14 -mb-2 z-10">
            <div className="w-5 h-5 bg-amber-800 border-2 border-black rounded-tl-full transform -rotate-20" />
            <div className="w-5 h-5 bg-amber-800 border-2 border-black rounded-tr-full transform rotate-20" />
          </div>

          {/* Scruffy Head */}
          <div className="w-14 h-13 bg-amber-700 border-2 border-black rounded-2xl relative shadow-md flex flex-col items-center justify-center">
            {/* Scheming Eyes */}
            <div className="flex gap-2 z-10">
              <div className="w-3.5 h-4 bg-yellow-300 border border-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-3.5 h-4 bg-yellow-300 border border-black rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
            </div>
            {/* Pink Snout */}
            <div className="w-6 h-4 bg-pink-400 border border-black rounded-full -mt-0.5" />
          </div>

          {/* Spotted Hyena Body */}
          <div className="w-15 h-15 bg-amber-700 border-2 border-black rounded-3xl -mt-2 relative shadow-lg flex items-center justify-around p-2">
            <div className="w-2.5 h-2.5 bg-amber-950 rounded-full" />
            <div className="w-3 h-3 bg-amber-950 rounded-full" />
            <div className="w-2 h-2 bg-amber-950 rounded-full" />
          </div>

          <div className="flex gap-3 -mt-1">
            <div className="w-5 h-3 bg-amber-900 border-2 border-black rounded-full" />
            <div className="w-5 h-3 bg-amber-900 border-2 border-black rounded-full" />
          </div>
        </div>
      )}

      {/* ================= MARINA (MERMAID) ================= */}
      {isMarina && (
        <div className="relative flex flex-col items-center">
          {/* Pink Starfish Hair Clip */}
          <div className="absolute -top-3 right-1 text-sm z-20">⭐</div>

          {/* Marina Head with Flowing Lavender Hair */}
          <div className="w-13 h-12 bg-purple-400 border-2 border-black rounded-2xl relative shadow-md flex flex-col items-center justify-center">
            {/* Pretty Eyes */}
            <div className="flex gap-2 z-10">
              <div className="w-3.5 h-4 bg-white border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-sky-500 rounded-full" />
              </div>
              <div className="w-3.5 h-4 bg-white border border-black rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-sky-500 rounded-full" />
              </div>
            </div>
            <div className="w-3 h-1 bg-rose-500 rounded-full mt-1" />
          </div>

          {/* Torso & Turquoise Mermaid Tail */}
          <div className="w-14 h-16 bg-teal-400 border-2 border-black rounded-3xl -mt-2 relative shadow-lg flex flex-col items-center justify-between p-1">
            {/* Shell Top */}
            <div className="flex gap-2">
              <div className="w-4 h-3 bg-pink-400 border border-pink-700 rounded-full" />
              <div className="w-4 h-3 bg-pink-400 border border-pink-700 rounded-full" />
            </div>
            {/* Scale Shimmer Tail */}
            <div className="w-10 h-8 bg-teal-600 border border-teal-800 rounded-b-full flex items-center justify-center">
              <span className="text-xs">🧜‍♀️</span>
            </div>
          </div>
        </div>
      )}

      {/* ================= BOB THE BULLDOG ================= */}
      {isBob && (
        <div className="relative flex flex-col items-center">
          {/* Bulldog Folded Ears */}
          <div className="flex justify-between w-16 -mb-2 z-10 px-1">
            <div className="w-4 h-5 bg-amber-950 border-2 border-black rounded-b-lg transform -rotate-20" />
            <div className="w-4 h-5 bg-amber-950 border-2 border-black rounded-b-lg transform rotate-20" />
          </div>

          {/* Bulldog Massive Jaw & Head */}
          <div className="w-18 h-14 bg-amber-800 border-2 border-black rounded-2xl relative shadow-xl flex flex-col items-center justify-between p-1">
            {/* Angry Brow & Small Eyes */}
            <div className="w-full flex justify-between px-2 pt-1">
              <div className="flex flex-col items-center">
                <div className="w-4 h-1 bg-black -rotate-12 mb-0.5" />
                <div className="w-2.5 h-2.5 bg-white border border-black rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-4 h-1 bg-black rotate-12 mb-0.5" />
                <div className="w-2.5 h-2.5 bg-white border border-black rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-black rounded-full" />
                </div>
              </div>
            </div>

            {/* Pug Snout & Underbite with 2 White Protruding Fangs */}
            <div className="w-12 h-6 bg-amber-950 border border-black rounded-lg relative flex flex-col items-center justify-end pb-0.5">
              <div className="w-3.5 h-2 bg-black rounded-full mb-0.5" />
              <div className="w-full flex justify-between px-2">
                <div className="w-1.5 h-2 bg-white border border-black rounded-t-xs -mt-1" />
                <div className="w-1.5 h-2 bg-white border border-black rounded-t-xs -mt-1" />
              </div>
            </div>
          </div>

          {/* Spiked Dog Collar */}
          <div className="w-16 h-3 bg-red-700 border-2 border-black rounded-sm flex items-center justify-around px-1 -mt-1 z-20 shadow">
            <div className="w-1.5 h-2 bg-stone-200 border border-stone-800 rounded-t-full" />
            <div className="w-1.5 h-2 bg-stone-200 border border-stone-800 rounded-t-full" />
            <div className="w-1.5 h-2 bg-stone-200 border border-stone-800 rounded-t-full" />
            <div className="w-1.5 h-2 bg-stone-200 border border-stone-800 rounded-t-full" />
          </div>

          {/* Heavy Boxer Muscular Torso */}
          <div className="w-20 h-16 bg-amber-800 border-2 border-black rounded-3xl -mt-1 relative shadow-2xl flex flex-col items-center justify-center">
            {/* Chest definition */}
            <div className="w-12 h-10 bg-amber-700/80 border border-amber-900 rounded-2xl flex items-center justify-center">
              <div className="w-0.5 h-8 bg-amber-950/60" />
            </div>
            {/* Giant Boxing Glove / Bone in Hand */}
            <div className="absolute -right-3 top-2 text-base pointer-events-none drop-shadow">
              🦴
            </div>
          </div>

          {/* Heavy Paws */}
          <div className="flex gap-4 -mt-1">
            <div className="w-7 h-4 bg-amber-950 border-2 border-black rounded-full" />
            <div className="w-7 h-4 bg-amber-950 border-2 border-black rounded-full" />
          </div>
        </div>
      )}

      {/* ================= OLIVIA (SWEET WHITE CAT) ================= */}
      {isOlivia && (
        <div className="relative flex flex-col items-center">
          {/* Yellow Daisy Flower in Ear */}
          <div className="absolute -top-3 right-0 text-base z-20 drop-shadow">
            🌼
          </div>

          {/* White Kitty Ears with Soft Pink Inner */}
          <div className="flex justify-between w-12 -mb-2 z-10 px-0.5">
            <div className="w-4 h-4.5 bg-white border-2 border-stone-400 rounded-tl-full transform -rotate-12 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2.5 bg-pink-300 rounded-tl-full" />
            </div>
            <div className="w-4 h-4.5 bg-white border-2 border-stone-400 rounded-tr-full transform rotate-12 flex items-center justify-center shadow-sm">
              <div className="w-2 h-2.5 bg-pink-300 rounded-tr-full" />
            </div>
          </div>

          {/* Sweet White Face */}
          <div className="w-13 h-11 bg-white border-2 border-stone-300 rounded-2xl relative shadow-md flex flex-col items-center justify-center">
            {/* Joyful Emerald Eyes with Long Eyelashes */}
            <div className="flex gap-2 z-10">
              <div className="flex flex-col items-center">
                <div className="w-3 h-0.5 bg-black -rotate-12" />
                <div className="w-3.5 h-4 bg-emerald-400 border border-black rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-2 bg-black rounded-full" />
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-3 h-0.5 bg-black rotate-12" />
                <div className="w-3.5 h-4 bg-emerald-400 border border-black rounded-full flex items-center justify-center">
                  <div className="w-1.5 h-2 bg-black rounded-full" />
                </div>
              </div>
            </div>

            {/* Tiny Pink Nose & Smile */}
            <div className="w-2 h-1.5 bg-pink-500 rounded-full mt-0.5" />
            <div className="w-4 h-1 border-b-2 border-black rounded-full mt-0.5" />
          </div>

          {/* Pretty Pink Dress */}
          <div className="w-13 h-14 bg-pink-400 border-2 border-pink-600 rounded-2xl -mt-1 relative shadow-md flex flex-col items-center justify-between p-1">
            <div className="w-8 h-2 bg-white rounded-full border border-pink-300 shadow-xs mt-0.5" />
            <div className="w-full flex justify-center text-xs">
              🌸
            </div>
            {/* White Curled Cat Tail */}
            <div className="absolute -left-2.5 bottom-1 w-3 h-6 border-l-2 border-b-2 border-stone-400 rounded-bl-full bg-white rotate-12" />
          </div>

          {/* Dainty White Paws */}
          <div className="flex gap-3 -mt-0.5">
            <div className="w-4 h-3 bg-white border-2 border-stone-300 rounded-full shadow-xs" />
            <div className="w-4 h-3 bg-white border-2 border-stone-300 rounded-full shadow-xs" />
          </div>
        </div>
      )}

      {/* ================= BERNIE THE HERMIT CRAB ================= */}
      {isBernie && (
        <div className="relative flex flex-col items-center">
          {/* Eyestalks with Round Spectacles */}
          <div className="flex justify-between w-9 -mb-1 z-20">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-cyan-100/90 border-2 border-amber-600 rounded-full flex items-center justify-center shadow">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-1 h-2 bg-red-600 -mt-0.5" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 bg-cyan-100/90 border-2 border-amber-600 rounded-full flex items-center justify-center shadow">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-1 h-2 bg-red-600 -mt-0.5" />
            </div>
          </div>

          {/* Spiral Red/Orange Conch Shell on Back */}
          <div className="w-14 h-12 bg-gradient-to-tr from-amber-800 via-orange-600 to-amber-500 border-2 border-black rounded-t-3xl rounded-b-xl relative shadow-lg flex items-center justify-center">
            {/* Spiral ridges */}
            <div className="w-10 h-8 border-2 border-amber-950/40 rounded-full" />
            <div className="w-6 h-5 border-2 border-amber-950/40 rounded-full" />
          </div>

          {/* Front Tiny Pincers & Red Crab Legs */}
          <div className="flex justify-between w-16 -mt-3 z-10">
            <div className="w-4 h-4 bg-red-600 border-2 border-black rounded-full flex items-center justify-center shadow">
              <span className="text-[10px] text-white">✂️</span>
            </div>
            <div className="w-4 h-4 bg-red-600 border-2 border-black rounded-full flex items-center justify-center shadow">
              <span className="text-[10px] text-white">✂️</span>
            </div>
          </div>

          {/* Little Walking Crab Skitter Legs */}
          <div className="flex gap-2 -mt-1">
            <div className="w-1.5 h-2.5 bg-red-700 rounded-b-sm" />
            <div className="w-1.5 h-2.5 bg-red-700 rounded-b-sm" />
            <div className="w-1.5 h-2.5 bg-red-700 rounded-b-sm" />
            <div className="w-1.5 h-2.5 bg-red-700 rounded-b-sm" />
          </div>
        </div>
      )}

      {/* Universal Held Item */}
      {heldItem && (
        <div className="absolute -bottom-2 -right-4 z-40 text-base filter drop-shadow">
          {heldItem === 'swatter' ? '🪰' : heldItem === 'burger' ? '🍔' : '📦'}
        </div>
      )}
    </div>
  );
}
