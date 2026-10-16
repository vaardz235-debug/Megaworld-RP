import React from 'react';

export interface CharacterData {
  id: number;
  name: string;
  type: 'minecraft' | 'sprnuki' | 'train' | 'countryball';
  subtype?: string;
  color?: string;
  flag?: string;
  description?: string;
  isHorror?: boolean;
  musicalNote?: string;
  armorTier?: 'none' | 'iron' | 'diamond' | 'netherite' | 'gold';
  heldWeapon?: string;
  cape?: 'none' | 'mojang' | 'creeper' | 'elytra';
  isEnchanted?: boolean;
  isCharged?: boolean;
}

interface CharacterAvatarProps {
  character: CharacterData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isWalking?: boolean;
  isTalking?: boolean;
  speechText?: string;
  heldItem?: string;
  showName?: boolean;
  direction?: 'left' | 'right';
  className?: string;
}

const getHeldItemIcon = (item?: string) => {
  if (!item) return null;
  switch (item) {
    case 'pickaxe': return '⛏️';
    case 'apple': return '🍎';
    case 'golden_apple': return '🍏';
    case 'bread': return '🍞';
    case 'wood': return '🪵';
    case 'torch': return '🕯️';
    case 'diamond': return '💎';
    case 'emerald': return '❇️';
    case 'flower': return '🌸';
    case 'door': return '🚪';
    default: return '📦';
  }
};

export default function CharacterAvatar({
  character,
  size = 'md',
  isWalking = false,
  isTalking = false,
  speechText,
  heldItem,
  showName = false,
  direction = 'right',
  className = '',
}: CharacterAvatarProps) {
  // Scale multipliers
  const scale = size === 'sm' ? 0.6 : size === 'md' ? 0.85 : size === 'xl' ? 1.5 : 1.1;

  // Determine subtype for minecraft
  const nameLower = character.name.toLowerCase();
  const subLower = (character.subtype || '').toLowerCase();
  const subtype = subLower || 
    (nameLower.includes('diamond') ? 'diamond_steve' :
     nameLower.includes('netherite') ? 'netherite_steve' :
     nameLower.includes('herobrine') ? 'herobrine' :
     nameLower.includes('golem') ? 'iron_golem' :
     nameLower.includes('warden') ? 'warden' :
     nameLower.includes('wither') ? 'wither_skeleton' :
     nameLower.includes('piglin') ? 'piglin' :
     nameLower.includes('drowned') ? 'drowned' :
     nameLower.includes('blaze') ? 'blaze' :
     nameLower.includes('witch') ? 'witch' :
     nameLower.includes('wolf') ? 'tamed_wolf' :
     nameLower.includes('axolotl') ? 'axolotl' :
     nameLower.includes('bee') ? 'bee' :
     nameLower.includes('pig') ? 'pig' :
     nameLower.includes('alex') ? 'alex' :
     nameLower.includes('zombie') ? 'zombie' :
     nameLower.includes('creeper') ? 'creeper' :
     nameLower.includes('enderman') ? 'enderman' :
     nameLower.includes('skeleton') ? 'skeleton' :
     nameLower.includes('villager') ? 'villager' : 'steve');

  return (
    <div 
      className={`relative inline-flex flex-col items-center select-none ${isTalking ? 'animate-pulse' : ''} ${className}`}
      style={{
        transform: `scale(${scale}) ${direction === 'left' ? 'scaleX(-1)' : ''}`,
        transformOrigin: 'bottom center',
      }}
    >
      {/* Dynamic Comic Speech Bubble */}
      {speechText && (
        <div 
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-50 pointer-events-none whitespace-normal bg-stone-900/95 text-amber-300 border-2 border-amber-400 px-3 py-1.5 rounded-2xl shadow-[0_6px_25px_rgba(0,0,0,0.85)] text-[11px] font-mono font-black animate-bounce flex items-center gap-1.5 backdrop-blur-md min-w-[140px] max-w-[280px] text-center justify-center leading-snug"
          style={{ transform: `translateX(-50%) ${direction === 'left' ? 'scaleX(-1)' : 'none'}` }}
        >
          <span className="text-amber-400 text-xs">💬</span>
          <span>{speechText}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-stone-900 border-r-2 border-b-2 border-amber-400 rotate-45" />
        </div>
      )}

      {/* Floating Name Tag (counter-flipped if facing left) */}
      {showName && (
        <div 
          className="absolute -top-6 bg-black/85 px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white tracking-wider border border-white/20 whitespace-nowrap z-30 shadow-md flex items-center gap-1"
          style={{ transform: direction === 'left' ? 'scaleX(-1)' : 'none' }}
        >
          {isTalking && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />}
          <span>{character.name}</span>
        </div>
      )}

      {/* Render Character according to type */}
      {character.type === 'minecraft' && (
        <MinecraftAvatar character={character} subtype={subtype} isWalking={isWalking} heldItem={heldItem} />
      )}

      {character.type === 'sprnuki' && (
        <SprnukiAvatar character={character} isWalking={isWalking} heldItem={heldItem} />
      )}

      {character.type === 'train' && (
        <TrainAvatar character={character} isWalking={isWalking} />
      )}

      {character.type === 'countryball' && (
        <CountryballAvatar character={character} isWalking={isWalking} heldItem={heldItem} />
      )}
    </div>
  );
}

/* ==========================================================
   MINECRAFT PIXEL WEAPONS & ACCESSORIES (SVG PIXEL ART)
========================================================== */
function PixelDiamondSword() {
  return (
    <div className="w-5 h-11 relative filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
      {/* Diamond Blade */}
      <div className="absolute top-0 left-2 w-2.5 h-6 bg-[#2ef5e4] border-x border-t border-[#009c91] shadow-inner">
        <div className="w-1 h-5 bg-[#a3fffa] ml-0.5" />
      </div>
      {/* Blade Tip */}
      <div className="absolute -top-1 left-2.5 w-1.5 h-1 bg-[#2ef5e4] border-t border-x border-[#009c91]" />
      {/* Crossguard */}
      <div className="absolute top-6 left-0.5 w-5.5 h-1.5 bg-[#174872] border border-[#0d2a44] rounded-xs flex justify-between px-0.5">
        <div className="w-1 h-1 bg-[#2ef5e4]" />
        <div className="w-1 h-1 bg-[#2ef5e4]" />
      </div>
      {/* Wood Handle Grip */}
      <div className="absolute top-7.5 left-2.5 w-1.5 h-2 bg-[#5d3b19] border-x border-[#3b250f]" />
      {/* Pommel */}
      <div className="absolute top-9.5 left-2 w-2.5 h-1 bg-[#174872] border border-[#0d2a44]" />
    </div>
  );
}

function PixelDiamondPickaxe() {
  return (
    <div className="w-8 h-10 relative filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] -rotate-12">
      {/* Pickaxe Head Arch */}
      <div className="absolute top-0 left-0 w-8 h-2.5 bg-[#2ef5e4] border border-[#009c91] rounded-t-sm flex justify-between px-1">
        <div className="w-1.5 h-2 bg-[#127a72]" />
        <div className="w-2 h-2 bg-[#154668]" />
        <div className="w-1.5 h-2 bg-[#127a72]" />
      </div>
      {/* Wooden Shaft */}
      <div className="absolute top-2.5 left-3.5 w-1.5 h-7.5 bg-[#6b4226] border-x border-[#4a2e19]" />
    </div>
  );
}

function PixelBow() {
  return (
    <div className="w-4 h-11 relative filter drop-shadow-md">
      {/* Wooden Curve */}
      <div className="absolute top-0 bottom-0 left-1 w-2 border-l-3 border-[#6b4226] rounded-l-full" />
      {/* String */}
      <div className="absolute top-1 bottom-1 left-2.5 w-0.5 bg-neutral-200" />
      {/* Arrow */}
      <div className="absolute top-5 left-0.5 w-4 h-0.5 bg-amber-200 border-t border-amber-900">
        <div className="absolute -left-1 -top-0.5 w-1 h-1.5 bg-neutral-400" />
      </div>
    </div>
  );
}

function PixelTrident() {
  return (
    <div className="w-5 h-13 relative filter drop-shadow-md">
      {/* 3 Prongs */}
      <div className="flex justify-between w-5 absolute top-0">
        <div className="w-1 h-3 bg-[#06b6d4] border border-[#0891b2]" />
        <div className="w-1 h-4 bg-[#22d3ee] border border-[#0891b2] -mt-1" />
        <div className="w-1 h-3 bg-[#06b6d4] border border-[#0891b2]" />
      </div>
      {/* Cross Head */}
      <div className="absolute top-3 w-5 h-1 bg-[#0e7490] border-y border-[#164e63]" />
      {/* Gold Ring */}
      <div className="absolute top-4 left-1.5 w-2 h-1 bg-amber-400 border border-amber-600" />
      {/* Aqua Pole */}
      <div className="absolute top-5 left-2 w-1 h-8 bg-[#0891b2] border-x border-[#164e63]" />
    </div>
  );
}

function PixelTotem() {
  return (
    <div className="w-5 h-7 relative bg-amber-400 border border-amber-600 rounded-xs flex flex-col items-center drop-shadow-md animate-pulse">
      {/* Totem Wings */}
      <div className="absolute -left-1.5 top-1.5 w-1.5 h-2.5 bg-amber-300 border border-amber-500 rounded-l-xs" />
      <div className="absolute -right-1.5 top-1.5 w-1.5 h-2.5 bg-amber-300 border border-amber-500 rounded-r-xs" />
      {/* Emerald Eyes */}
      <div className="flex justify-between w-3.5 mt-1">
        <div className="w-1 h-1 bg-emerald-400 shadow-[0_0_4px_#34d399]" />
        <div className="w-1 h-1 bg-emerald-400 shadow-[0_0_4px_#34d399]" />
      </div>
      {/* Totem Mouth */}
      <div className="w-2 h-0.5 bg-amber-700 mt-1" />
      {/* Golden Torso Core */}
      <div className="w-2.5 h-2 bg-amber-500 mt-0.5 border-t border-amber-600" />
    </div>
  );
}

function PixelShield() {
  return (
    <div className="w-6 h-9 relative bg-[#8b5a2b] border-2 border-neutral-400 rounded-b-md shadow-lg flex flex-col items-center justify-center">
      {/* Iron Boss */}
      <div className="w-2 h-2 bg-neutral-300 border border-neutral-600 rounded-full" />
      <div className="w-4 h-0.5 bg-neutral-600 mt-1" />
    </div>
  );
}

function PixelPoppy() {
  return (
    <div className="w-4 h-6 relative flex flex-col items-center drop-shadow">
      <div className="w-3.5 h-3 bg-red-600 border border-red-800 rounded-xs flex items-center justify-center">
        <div className="w-1 h-1 bg-neutral-900" />
      </div>
      <div className="w-0.5 h-3 bg-green-600" />
    </div>
  );
}

/* ==========================================================
   MINECRAFT CAPES (MOJANG RED, CREEPER, ELYTRA)
========================================================== */
function MinecraftCape({ type, isWalking }: { type?: 'none' | 'mojang' | 'creeper' | 'elytra'; isWalking: boolean }) {
  if (!type || type === 'none') return null;

  if (type === 'elytra') {
    return (
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-14 h-14 pointer-events-none -z-10 flex justify-between">
        <div className={`w-6 h-12 bg-neutral-800 border border-neutral-950 rounded-tl-full rounded-br-full origin-top-right transition-transform ${isWalking ? '-rotate-12' : '-rotate-6'}`} />
        <div className={`w-6 h-12 bg-neutral-800 border border-neutral-950 rounded-tr-full rounded-bl-full origin-top-left transition-transform ${isWalking ? 'rotate-12' : 'rotate-6'}`} />
      </div>
    );
  }

  const isMojang = type === 'mojang';

  return (
    <div 
      className={`absolute top-10 left-1/2 -translate-x-1/2 w-9 h-14 border border-black/40 rounded-b-xs -z-10 shadow-lg origin-top transition-transform ${
        isWalking ? 'rotate-12 translate-y-0.5' : 'rotate-3'
      }`}
      style={{ backgroundColor: isMojang ? '#a81c1c' : '#262626' }}
    >
      {/* Mojang Emblem or Creeper Face on Cape */}
      {isMojang ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <div className="w-4 h-6 border-2 border-white rounded-t-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white" />
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center p-1">
          <div className="w-4 h-4 bg-lime-500 p-0.5 flex flex-col items-center justify-center">
            <div className="w-full flex justify-between px-0.5">
              <div className="w-1 h-1 bg-black" />
              <div className="w-1 h-1 bg-black" />
            </div>
            <div className="w-1.5 h-1 bg-black mt-0.5" />
            <div className="w-2.5 h-1 bg-black" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   MINECRAFT AVATARS (ALL 21 AUTHENTIC HEROES & MOBS)
========================================================== */
function MinecraftAvatar({
  character,
  subtype,
  isWalking,
  heldItem,
}: {
  character: CharacterData;
  subtype: string;
  isWalking: boolean;
  heldItem?: string;
}) {
  const itemIcon = getHeldItemIcon(heldItem);
  const nameLower = character.name.toLowerCase();
  const sub = subtype.toLowerCase();

  // Mob Identifiers
  const isCreeper = sub === 'creeper' || nameLower.includes('creeper');
  const isEnderman = sub === 'enderman' || nameLower.includes('enderman');
  const isIronGolem = sub === 'iron_golem' || (nameLower.includes('golem') && !nameLower.includes('snow') && !nameLower.includes('copper'));
  const isSnowGolem = sub === 'snow_golem' || nameLower.includes('snow golem') || nameLower.includes('snow_golem');
  const isCopperGolem = sub === 'copper_golem' || nameLower.includes('copper golem') || nameLower.includes('copper_golem');
  const isMooshroom = sub === 'mooshroom' || nameLower.includes('mooshroom');
  const isEvoker = sub === 'evoker' || nameLower.includes('evoker') || nameLower.includes('illager');
  const isAllay = sub === 'allay' || nameLower.includes('allay');
  const isWarden = sub === 'warden' || nameLower.includes('warden');
  const isBlaze = sub === 'blaze' || nameLower.includes('blaze');
  const isPig = sub === 'pig' || (nameLower.includes('pig') && !nameLower.includes('piglin'));
  const isPiglin = sub === 'piglin' || nameLower.includes('piglin');
  const isWolf = sub === 'tamed_wolf' || nameLower.includes('wolf') || nameLower.includes('dog');
  const isAxolotl = sub === 'axolotl' || nameLower.includes('axolotl');
  const isBee = sub === 'bee' || nameLower.includes('bee');
  const isWitch = sub === 'witch' || nameLower.includes('witch');
  const isWitherSkeleton = sub === 'wither_skeleton' || nameLower.includes('wither');
  const isDrowned = sub === 'drowned' || nameLower.includes('drowned');
  const isSkeleton = sub === 'skeleton' || nameLower.includes('skeleton');
  const isZombie = sub === 'zombie' || nameLower.includes('zombie');
  const isVillager = sub === 'villager' || nameLower.includes('villager');
  const isHerobrine = sub === 'herobrine' || nameLower.includes('herobrine');
  const isDiamondSteve = sub === 'diamond_steve' || nameLower.includes('diamond');
  const isNetheriteSteve = sub === 'netherite_steve' || nameLower.includes('netherite');
  const isAlex = sub === 'alex' || nameLower.includes('alex');
  const isSteve = !isCreeper && !isEnderman && !isIronGolem && !isSnowGolem && !isCopperGolem && !isMooshroom && !isEvoker && !isAllay && !isWarden && !isBlaze && !isPig && !isPiglin && !isWolf && !isAxolotl && !isBee && !isWitch && !isWitherSkeleton && !isDrowned && !isSkeleton && !isZombie && !isVillager && !isHerobrine && !isDiamondSteve && !isNetheriteSteve && !isAlex;

  // Determine Weapon
  const activeWeapon = character.heldWeapon || 
    (isDiamondSteve ? 'diamond_sword' :
     isNetheriteSteve ? 'diamond_sword' :
     isDrowned ? 'trident' :
     isSkeleton ? 'bow' :
     isWitherSkeleton ? 'stone_sword' :
     isPiglin ? 'gold_sword' :
     isIronGolem ? 'poppy' :
     isHerobrine ? 'totem' :
     'diamond_pickaxe');

  // Determine Armor Tier
  const armorTier = character.armorTier || 
    (isDiamondSteve ? 'diamond' :
     isNetheriteSteve ? 'netherite' :
     'none');

  // Determine Cape
  const cape = character.cape || 
    (isDiamondSteve ? 'mojang' :
     isNetheriteSteve ? 'creeper' :
     isHerobrine ? 'elytra' :
     'none');

  // ==========================================
  // 1. CREEPER (WITH CHARGED ELECTRIC OPTION)
  // ==========================================
  if (isCreeper) {
    const isCharged = character.isCharged || nameLower.includes('charged');
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl group">
        {/* Charged Creeper Blue Electric Aura */}
        {isCharged && (
          <>
            <div className="absolute -inset-3 bg-cyan-400/30 rounded-xl blur-md animate-pulse border-2 border-cyan-300 shadow-[0_0_20px_#22d3ee] pointer-events-none" />
            <div className="absolute -top-3 text-[10px] text-cyan-300 font-mono font-black animate-bounce">⚡ CHARGED</div>
          </>
        )}

        {/* Creeper Head */}
        <div className="w-12 h-12 bg-[#4fa734] border-2 border-[#1e5812] relative shadow-inner overflow-hidden flex flex-col justify-center items-center">
          {/* Creeper Pixel Texture */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-35 pointer-events-none">
            <div className="bg-[#2e741a] col-span-2 row-span-2" />
            <div className="bg-[#7ce24e] col-span-1 row-span-1" />
            <div className="bg-[#1c4b10] col-span-3 row-span-1" />
            <div className="bg-[#3e8a27] col-span-2 row-span-2" />
            <div className="bg-[#65c33e] col-span-2 row-span-1" />
          </div>

          {/* Creeper Face */}
          <div className="relative z-10 w-9 h-8 flex flex-col items-center">
            {/* Eyes */}
            <div className="w-full flex justify-between px-1">
              <div className="w-2.5 h-2.5 bg-black" />
              <div className="w-2.5 h-2.5 bg-black" />
            </div>
            {/* Nose & Frowning Mouth */}
            <div className="w-2 h-1.5 bg-black mt-0.5" />
            <div className="w-6 h-2 bg-black" />
            <div className="w-4 h-2 bg-black flex justify-between px-0.5">
              <div className="w-1.5 h-2 bg-[#4fa734]" />
              <div className="w-1.5 h-2 bg-[#4fa734]" />
            </div>
          </div>
        </div>

        {/* Creeper Torso */}
        <div className="w-8 h-12 bg-[#3f8c28] border-x-2 border-[#1c4b10] relative">
          <div className="absolute inset-0 bg-gradient-to-b from-[#4fa734] to-[#2d6c1b] opacity-70" />
        </div>

        {/* Creeper 4 Walking Feet */}
        <div className="flex gap-1 -mt-0.5">
          <div className={`w-3.5 h-5 bg-[#2d6c1b] border-2 border-[#163a0d] rounded-b-xs transition-transform ${isWalking ? 'translate-y-1' : ''}`} />
          <div className={`w-3.5 h-5 bg-[#1f5012] border-2 border-[#163a0d] rounded-b-xs transition-transform ${isWalking ? '-translate-y-1' : ''}`} />
          <div className={`w-3.5 h-5 bg-[#2d6c1b] border-2 border-[#163a0d] rounded-b-xs transition-transform ${isWalking ? 'translate-y-1' : ''}`} />
          <div className={`w-3.5 h-5 bg-[#1f5012] border-2 border-[#163a0d] rounded-b-xs transition-transform ${isWalking ? '-translate-y-1' : ''}`} />
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. ENDERMAN (SLENDER, PORTAL PARTICLES)
  // ==========================================
  if (isEnderman) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-2xl">
        {/* Ender Portal Aura Particles */}
        <div className="absolute -inset-3 bg-purple-600/25 rounded-full blur-md animate-pulse pointer-events-none shadow-[0_0_15px_#a855f7]" />
        
        {/* Floating Ender Particles */}
        <div className="absolute -top-2 left-1 w-1.5 h-1.5 bg-fuchsia-400 rounded-full animate-ping opacity-80" />
        <div className="absolute top-8 -right-2 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse opacity-90" />

        {/* Slender Head */}
        <div className="w-10 h-10 bg-[#0e0c12] border border-[#2e1065] relative shadow-2xl flex flex-col justify-center items-center">
          {/* Glowing Fuchsia Slit Eyes */}
          <div className="w-full flex justify-between px-1.5 mt-2">
            <div className="w-2.5 h-1 bg-[#d946ef] shadow-[0_0_8px_#e879f9] border border-white/60" />
            <div className="w-2.5 h-1 bg-[#d946ef] shadow-[0_0_8px_#e879f9] border border-white/60" />
          </div>
        </div>

        {/* Slender Torso */}
        <div className="w-6 h-15 bg-[#141219] border-x border-[#0e0c12] relative flex justify-center">
          {/* Holding Grass Block */}
          <div className="absolute -top-1 w-7 h-7 bg-[#4d7c0f] border border-[#365314] shadow-md z-10 flex flex-col">
            <div className="w-full h-2.5 bg-[#65a30d] border-b border-[#4d7c0f]" />
            <div className="w-full flex-1 bg-[#78350f] p-0.5 grid grid-cols-2 gap-0.5">
              <div className="bg-[#59260b] w-full h-full" />
              <div className="bg-[#451a03] w-full h-full" />
            </div>
          </div>
        </div>

        {/* Extra Long Arms */}
        <div className="absolute top-10 flex justify-between w-14 pointer-events-none">
          <div className={`w-2 h-20 bg-[#0e0c12] border border-black rounded-xs transition-transform origin-top ${isWalking ? 'rotate-12' : ''}`} />
          <div className={`w-2 h-20 bg-[#0e0c12] border border-black rounded-xs transition-transform origin-top ${isWalking ? '-rotate-12' : ''}`} />
        </div>

        {/* Extra Long Slender Legs */}
        <div className="flex gap-2">
          <div className={`w-2.5 h-20 bg-[#0e0c12] border-r border-[#1e1b24] transition-transform ${isWalking ? 'translate-y-1.5' : ''}`} />
          <div className={`w-2.5 h-20 bg-[#0e0c12] border-l border-[#1e1b24] transition-transform ${isWalking ? '-translate-y-1.5' : ''}`} />
        </div>
      </div>
    );
  }

  // ==========================================
  // 3. IRON GOLEM (TITAN BODY, RED POPPY)
  // ==========================================
  if (isIronGolem) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-2xl">
        {/* Massive Iron Head */}
        <div className="w-13 h-14 bg-[#d1d5db] border-2 border-[#6b7280] relative shadow-md flex flex-col items-center">
          {/* Protruding Brow */}
          <div className="w-full h-3 bg-[#9ca3af] border-b border-[#4b5563]" />
          {/* Deep Red Glowing Eyes */}
          <div className="w-full flex justify-between px-2 mt-2">
            <div className="w-2 h-2 bg-red-600 shadow-[0_0_6px_#dc2626]" />
            <div className="w-2 h-2 bg-red-600 shadow-[0_0_6px_#dc2626]" />
          </div>
          {/* Prominent Golem Nose */}
          <div className="w-2.5 h-4 bg-[#9ca3af] border border-[#6b7280] shadow-sm mt-0.5" />
        </div>

        {/* Broad Titan Torso with Vine Moss */}
        <div className="w-16 h-14 bg-[#e5e7eb] border-2 border-[#6b7280] relative overflow-hidden flex flex-col justify-between">
          {/* Creeping Vine Moss */}
          <div className="absolute top-0 right-1 w-3 h-8 bg-emerald-600/60 border-l border-emerald-700" />
          <div className="absolute bottom-1 left-2 w-4 h-4 bg-emerald-700/50" />
          {/* Waist Band */}
          <div className="w-full h-3 bg-[#9ca3af] border-t border-[#6b7280] mt-auto" />
        </div>

        {/* Massive Arms (Right Arm gently offering a Red Poppy) */}
        <div className="absolute top-14 flex justify-between w-22 pointer-events-none">
          <div className={`w-3.5 h-16 bg-[#d1d5db] border-2 border-[#6b7280] rounded-xs transition-transform origin-top ${isWalking ? 'rotate-12' : ''}`} />
          <div className={`w-3.5 h-16 bg-[#d1d5db] border-2 border-[#6b7280] rounded-xs relative transition-transform origin-top ${isWalking ? '-rotate-12' : ''}`}>
            {/* Holding Red Poppy */}
            <div className="absolute -bottom-3 -right-2 pointer-events-auto">
              <PixelPoppy />
            </div>
          </div>
        </div>

        {/* Sturdy Legs */}
        <div className="flex gap-1.5 -mt-0.5">
          <div className={`w-5 h-10 bg-[#9ca3af] border-2 border-[#4b5563] ${isWalking ? 'translate-y-1' : ''}`} />
          <div className={`w-5 h-10 bg-[#9ca3af] border-2 border-[#4b5563] ${isWalking ? '-translate-y-1' : ''}`} />
        </div>
      </div>
    );
  }

  // ==========================================
  // 4. WARDEN (DEEP DARK SCULK, PULSING CORE)
  // ==========================================
  if (isWarden) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-2xl">
        {/* Sculk Particle Smoke */}
        <div className="absolute -inset-4 bg-teal-950/40 rounded-full blur-lg animate-pulse pointer-events-none shadow-[0_0_20px_#0d9488]" />

        {/* Warden Head with Sensor Horns */}
        <div className="relative w-14 h-12 bg-[#091e24] border-2 border-[#042f2e] shadow-2xl flex flex-col items-center justify-center">
          {/* Left Sculk Sensor Horn */}
          <div className="absolute -top-4 -left-2 w-3.5 h-5 border-l-2 border-t-2 border-[#14b8a6] flex flex-col justify-between">
            <div className="w-2 h-2 bg-[#0d9488] shadow-[0_0_6px_#14b8a6]" />
            <div className="w-1.5 h-1.5 bg-[#2dd4bf]" />
          </div>
          {/* Right Sculk Sensor Horn */}
          <div className="absolute -top-4 -right-2 w-3.5 h-5 border-r-2 border-t-2 border-[#14b8a6] flex flex-col justify-between items-end">
            <div className="w-2 h-2 bg-[#0d9488] shadow-[0_0_6px_#14b8a6]" />
            <div className="w-1.5 h-1.5 bg-[#2dd4bf]" />
          </div>

          {/* Blind Face & Gaping Sculk Maw with Teeth */}
          <div className="w-8 h-4 bg-neutral-950 border border-teal-900 flex flex-col justify-between p-0.5">
            <div className="flex justify-around">
              <div className="w-1 h-1 bg-teal-200" />
              <div className="w-1 h-1 bg-teal-200" />
              <div className="w-1 h-1 bg-teal-200" />
            </div>
            <div className="flex justify-around">
              <div className="w-1 h-1 bg-teal-200" />
              <div className="w-1 h-1 bg-teal-200" />
            </div>
          </div>
        </div>

        {/* Sculk Torso with Pulsing Soul Heart Core */}
        <div className="w-14 h-14 bg-[#082026] border-2 border-[#042f2e] relative overflow-hidden flex flex-col items-center justify-center">
          {/* Sculk Ribcage */}
          <div className="absolute inset-1 border border-teal-800/40 flex flex-col justify-around py-1">
            <div className="w-full h-0.5 bg-teal-700/50" />
            <div className="w-full h-0.5 bg-teal-700/50" />
          </div>
          {/* Beating Soul Heart Core */}
          <div className="w-5 h-5 rounded-full bg-[#14b8a6] shadow-[0_0_12px_#2dd4bf] animate-ping opacity-75" />
          <div className="absolute w-4 h-4 rounded-full bg-[#5eead4] shadow-[0_0_8px_#5eead4]" />
        </div>

        {/* Heavy Arms */}
        <div className="absolute top-12 flex justify-between w-18 pointer-events-none">
          <div className={`w-3.5 h-16 bg-[#082026] border-2 border-teal-950 rounded-xs ${isWalking ? 'rotate-12' : ''}`} />
          <div className={`w-3.5 h-16 bg-[#082026] border-2 border-teal-950 rounded-xs ${isWalking ? '-rotate-12' : ''}`} />
        </div>

        {/* Heavy Legs */}
        <div className="flex gap-1.5">
          <div className={`w-4.5 h-12 bg-[#091e24] border-2 border-teal-950 ${isWalking ? 'translate-y-1' : ''}`} />
          <div className={`w-4.5 h-12 bg-[#091e24] border-2 border-teal-950 ${isWalking ? '-translate-y-1' : ''}`} />
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. BLAZE (NETHER FORTRESS SPINNING RODS)
  // ==========================================
  if (isBlaze) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-2xl">
        {/* Fire & Smoke Aura */}
        <div className="absolute -inset-3 bg-amber-500/25 rounded-full blur-md animate-pulse pointer-events-none shadow-[0_0_15px_#f59e0b]" />

        {/* Orbiting Fire Rods Top Layer */}
        <div className="absolute -top-2 w-16 flex justify-between pointer-events-none">
          <div className="w-2 h-7 bg-amber-400 border border-orange-600 rounded-xs animate-bounce" />
          <div className="w-2 h-7 bg-yellow-300 border border-orange-600 rounded-xs animate-bounce delay-150" />
        </div>

        {/* Fiery Core Head */}
        <div className="w-10 h-10 bg-[#f59e0b] border-2 border-[#b45309] relative shadow-lg flex flex-col items-center justify-center">
          {/* Blazing Pixel Textures */}
          <div className="absolute inset-0 bg-gradient-to-tr from-orange-600 to-yellow-300 opacity-60" />
          {/* Smoking Eyes */}
          <div className="relative z-10 w-full flex justify-between px-1.5">
            <div className="w-2 h-1 bg-[#451a03] border-b border-yellow-200" />
            <div className="w-2 h-1 bg-[#451a03] border-b border-yellow-200" />
          </div>
        </div>

        {/* Middle Orbiting Fire Rods */}
        <div className="w-18 flex justify-between my-1 pointer-events-none">
          <div className="w-2.5 h-8 bg-amber-500 border border-orange-700 rounded-xs animate-pulse" />
          <div className="w-2.5 h-8 bg-yellow-400 border border-orange-700 rounded-xs animate-pulse delay-75" />
          <div className="w-2.5 h-8 bg-amber-500 border border-orange-700 rounded-xs animate-pulse delay-150" />
        </div>

        {/* Lower Smoke Puffs */}
        <div className="flex gap-2">
          <div className="w-2 h-5 bg-neutral-800 rounded-xs animate-ping opacity-60" />
          <div className="w-2 h-5 bg-neutral-900 rounded-xs animate-ping opacity-50 delay-100" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 6. SADDLE PIG (CUTE QUAD-LEGGED SNOUT)
  // ==========================================
  if (isPig) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl">
        {/* Pig Head */}
        <div className="w-11 h-10 bg-[#f472b6] border-2 border-[#db2777] relative shadow-md flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="w-full flex justify-between px-1.5 mb-1">
            <div className="flex">
              <div className="w-1.5 h-1.5 bg-white" />
              <div className="w-1.5 h-1.5 bg-black" />
            </div>
            <div className="flex">
              <div className="w-1.5 h-1.5 bg-black" />
              <div className="w-1.5 h-1.5 bg-white" />
            </div>
          </div>
          {/* Protruding 3D Snout */}
          <div className="w-5 h-3 bg-[#ec4899] border border-[#be185d] flex justify-between px-1 items-center shadow-md">
            <div className="w-1 h-1 bg-[#831843]" />
            <div className="w-1 h-1 bg-[#831843]" />
          </div>
        </div>

        {/* Pig Body with Leather Saddle */}
        <div className="w-14 h-9 bg-[#f472b6] border-2 border-[#db2777] relative shadow-inner">
          {/* Brown Leather Saddle */}
          <div className="absolute inset-x-2 top-0 bottom-0 bg-[#854d0e] border-x border-[#713f12] flex justify-between items-center px-0.5">
            <div className="w-1 h-3 bg-neutral-300" />
            <div className="w-1 h-3 bg-neutral-300" />
          </div>
        </div>

        {/* 4 Trotter Legs */}
        <div className="flex justify-between w-13 -mt-0.5">
          <div className={`w-2.5 h-4 bg-[#ec4899] border border-[#be185d] ${isWalking ? 'translate-y-0.5' : ''}`} />
          <div className={`w-2.5 h-4 bg-[#ec4899] border border-[#be185d] ${isWalking ? '-translate-y-0.5' : ''}`} />
          <div className={`w-2.5 h-4 bg-[#ec4899] border border-[#be185d] ${isWalking ? 'translate-y-0.5' : ''}`} />
          <div className={`w-2.5 h-4 bg-[#ec4899] border border-[#be185d] ${isWalking ? '-translate-y-0.5' : ''}`} />
        </div>
      </div>
    );
  }

  // ==========================================
  // 7. TAMED WOLF / DOG (FLUFFY, RED COLLAR)
  // ==========================================
  if (isWolf) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl">
        {/* Pointy Ears */}
        <div className="flex justify-between w-10 -mb-1 z-10">
          <div className="w-2.5 h-3 bg-[#d1d5db] border-t-2 border-l-2 border-neutral-600 rounded-t-xs" />
          <div className="w-2.5 h-3 bg-[#d1d5db] border-t-2 border-r-2 border-neutral-600 rounded-t-xs" />
        </div>

        {/* Wolf Head */}
        <div className="w-11 h-10 bg-[#e5e7eb] border-2 border-neutral-500 relative shadow-md flex flex-col items-center justify-center">
          {/* Eyes */}
          <div className="w-full flex justify-between px-2 mb-1">
            <div className="w-1.5 h-1.5 bg-black" />
            <div className="w-1.5 h-1.5 bg-black" />
          </div>
          {/* Blocky Snout with Black Nose */}
          <div className="w-5 h-3 bg-[#d1d5db] border border-neutral-600 flex flex-col items-center justify-between">
            <div className="w-2 h-1 bg-black" />
            <div className="w-2 h-0.5 bg-pink-400" />
          </div>
        </div>

        {/* Red Wool Collar */}
        <div className="w-12 h-2.5 bg-red-600 border border-red-800 flex items-center justify-center z-10">
          <div className="w-1.5 h-1.5 bg-amber-400 border border-amber-600 rounded-full" />
        </div>

        {/* Wolf Torso */}
        <div className="w-12 h-8 bg-[#e5e7eb] border-x-2 border-b-2 border-neutral-500 relative">
          {/* Wagging Fluffy Tail */}
          <div className={`absolute top-1 -right-3 w-2.5 h-6 bg-[#d1d5db] border border-neutral-500 rounded-r-xs origin-top-left transition-transform ${isWalking ? 'rotate-25' : 'rotate-12'}`} />
        </div>

        {/* Paws */}
        <div className="flex justify-between w-11 -mt-0.5">
          <div className={`w-2.5 h-4 bg-[#d1d5db] border border-neutral-600 ${isWalking ? 'translate-y-0.5' : ''}`} />
          <div className={`w-2.5 h-4 bg-[#d1d5db] border border-neutral-600 ${isWalking ? '-translate-y-0.5' : ''}`} />
          <div className={`w-2.5 h-4 bg-[#d1d5db] border border-neutral-600 ${isWalking ? 'translate-y-0.5' : ''}`} />
          <div className={`w-2.5 h-4 bg-[#d1d5db] border border-neutral-600 ${isWalking ? '-translate-y-0.5' : ''}`} />
        </div>
      </div>
    );
  }

  // ==========================================
  // 8. AXOLOTL (PINK, 6 CORAL FRILLY GILLS)
  // ==========================================
  if (isAxolotl) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl animate-bounce" style={{ animationDuration: '2.5s' }}>
        {/* Frilly External Coral Gills */}
        <div className="absolute -top-1 w-16 flex justify-between pointer-events-none z-10">
          <div className="flex flex-col gap-1 -rotate-12">
            <div className="w-3 h-1.5 bg-rose-400 rounded-l-full shadow-sm" />
            <div className="w-3.5 h-1.5 bg-rose-500 rounded-l-full shadow-sm" />
            <div className="w-3 h-1.5 bg-rose-400 rounded-l-full shadow-sm" />
          </div>
          <div className="flex flex-col gap-1 rotate-12 items-end">
            <div className="w-3 h-1.5 bg-rose-400 rounded-r-full shadow-sm" />
            <div className="w-3.5 h-1.5 bg-rose-500 rounded-r-full shadow-sm" />
            <div className="w-3 h-1.5 bg-rose-400 rounded-r-full shadow-sm" />
          </div>
        </div>

        {/* Axolotl Head */}
        <div className="w-12 h-9 bg-[#fbcfe8] border-2 border-pink-400 relative shadow-md flex flex-col items-center justify-between py-1">
          {/* Eyes */}
          <div className="w-full flex justify-between px-2">
            <div className="w-1.5 h-1.5 bg-black rounded-xs" />
            <div className="w-1.5 h-1.5 bg-black rounded-xs" />
          </div>
          {/* Wide Happy Mouth */}
          <div className="w-4 h-1 bg-rose-400 rounded-full" />
        </div>

        {/* Axolotl Body */}
        <div className="w-13 h-7 bg-[#fbcfe8] border-2 border-pink-400 relative flex justify-center items-center">
          {/* Dorsal Fin */}
          <div className="w-full h-1 bg-rose-300" />
          {/* Fin Tail */}
          <div className="absolute -bottom-3 w-4 h-4 bg-rose-400 rotate-45 rounded-xs" />
        </div>

        {/* Swimming Feet */}
        <div className="flex justify-between w-12 -mt-0.5">
          <div className="w-2.5 h-3 bg-pink-300 border border-pink-400" />
          <div className="w-2.5 h-3 bg-pink-300 border border-pink-400" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 9. BEE (YELLOW/BLACK STRIPES, WINGS)
  // ==========================================
  if (isBee) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl animate-bounce" style={{ animationDuration: '1.2s' }}>
        {/* Antennae */}
        <div className="flex justify-between w-8 -mb-1">
          <div className="w-1 h-3 bg-neutral-900 -rotate-12" />
          <div className="w-1 h-3 bg-neutral-900 rotate-12" />
        </div>

        {/* Fluttering Translucent Wings */}
        <div className="absolute -top-2 w-16 flex justify-between pointer-events-none z-10">
          <div className="w-5 h-7 bg-white/70 border border-cyan-200 rounded-full -rotate-45 shadow-sm animate-pulse" />
          <div className="w-5 h-7 bg-white/70 border border-cyan-200 rounded-full rotate-45 shadow-sm animate-pulse" />
        </div>

        {/* Striped Bee Body */}
        <div className="w-12 h-11 bg-amber-400 border-2 border-neutral-900 relative shadow-md overflow-hidden flex flex-col justify-between">
          {/* Face: Blue Eyes */}
          <div className="w-full flex justify-between px-1.5 mt-1.5">
            <div className="w-2 h-2 bg-sky-500 border border-sky-800" />
            <div className="w-2 h-2 bg-sky-500 border border-sky-800" />
          </div>
          {/* Black Stripes */}
          <div className="w-full h-2.5 bg-neutral-950" />
          <div className="w-full h-2 bg-neutral-950" />
        </div>

        {/* Stinger */}
        <div className="w-1.5 h-2 bg-neutral-900" />
      </div>
    );
  }

  // ==========================================
  // 10. SNOW GOLEM (CARVED PUMPKIN, SNOWBALLS)
  // ==========================================
  if (isSnowGolem) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl">
        {/* Carved Pumpkin Head */}
        <div className="w-12 h-12 bg-amber-600 border-2 border-amber-900 rounded-sm relative shadow-md flex flex-col items-center justify-center">
          {/* Pumpkin Ridges */}
          <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-30">
            <div className="w-0.5 h-full bg-amber-950" />
            <div className="w-0.5 h-full bg-amber-950" />
          </div>
          {/* Glowing Carved Face: Triangular Eyes & Tooth Grin */}
          <div className="w-full flex justify-between px-2.5 z-10 mb-1">
            <div className="w-2 h-2 bg-yellow-300 shadow-[0_0_6px_#facc15] clip-triangle" />
            <div className="w-2 h-2 bg-yellow-300 shadow-[0_0_6px_#facc15] clip-triangle" />
          </div>
          <div className="w-6 h-2 bg-neutral-950 flex justify-around px-0.5 z-10">
            <div className="w-1 h-1 bg-yellow-300" />
            <div className="w-1 h-1 bg-yellow-300" />
            <div className="w-1 h-1 bg-yellow-300" />
          </div>
        </div>

        {/* Middle Snow Sphere with Twig Stick Arms */}
        <div className="relative w-11 h-10 bg-slate-100 border-2 border-slate-300 rounded-md shadow flex flex-col items-center justify-around py-1 -mt-0.5">
          {/* Left Stick Arm */}
          <div className={`absolute -left-5 top-2 w-5 h-1 bg-amber-900 origin-right transition-transform ${isWalking ? '-rotate-25' : '-rotate-12'}`}>
            <div className="absolute -left-1 -top-1 w-2 h-0.5 bg-amber-900 rotate-45" />
          </div>
          {/* Right Stick Arm holding Snowball */}
          <div className={`absolute -right-5 top-2 w-5 h-1 bg-amber-900 origin-left transition-transform ${isWalking ? 'rotate-25' : 'rotate-12'}`}>
            <div className="absolute -right-2 -top-1 w-3 h-3 bg-white border border-slate-300 rounded-full shadow-sm" />
          </div>
          {/* Coal Buttons */}
          <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
          <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
        </div>

        {/* Bottom Snow Base */}
        <div className="w-13 h-8 bg-slate-200 border-2 border-slate-300 rounded-md shadow -mt-0.5 flex items-center justify-center">
          <div className="w-2 h-2 bg-neutral-900 rounded-full" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 11. MOOSHROOM (RED MUSHROOM COW)
  // ==========================================
  if (isMooshroom) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl">
        {/* Head with Sprouting Red Mushrooms */}
        <div className="relative flex flex-col items-center">
          {/* Sprouting Head Mushroom */}
          <div className="relative -mb-1 z-20 flex flex-col items-center">
            <div className="w-5 h-3 bg-red-600 border border-red-800 rounded-t-full relative flex items-center justify-around px-0.5">
              <div className="w-1 h-1 bg-white rounded-full" />
              <div className="w-1 h-1 bg-white rounded-full" />
            </div>
            <div className="w-1 h-1.5 bg-amber-100" />
          </div>

          {/* Cow Horns & Floppy Ears */}
          <div className="w-15 flex justify-between px-0.5 -mb-1">
            <div className="w-2 h-2 bg-neutral-400 border border-neutral-600 rounded-tl-sm -rotate-25" />
            <div className="w-2 h-2 bg-neutral-400 border border-neutral-600 rounded-tr-sm rotate-25" />
          </div>

          {/* Red Cow Head */}
          <div className="w-12 h-10 bg-red-600 border-2 border-red-800 relative shadow-md flex flex-col items-center justify-between p-1">
            {/* White Patches */}
            <div className="absolute top-1 left-1 w-2 h-2 bg-white rounded-xs" />
            <div className="w-full flex justify-between px-1">
              <div className="w-2 h-2 bg-neutral-900 border border-white" />
              <div className="w-2 h-2 bg-neutral-900 border border-white" />
            </div>
            {/* Wide Cow Muzzle */}
            <div className="w-8 h-3.5 bg-neutral-300 border border-neutral-500 rounded-xs flex items-center justify-around px-1">
              <div className="w-1.5 h-1.5 bg-neutral-800 rounded-xs" />
              <div className="w-1.5 h-1.5 bg-neutral-800 rounded-xs" />
            </div>
          </div>
        </div>

        {/* Body with Back Mushroom */}
        <div className="relative w-14 h-9 bg-red-600 border-x-2 border-b-2 border-red-800 flex items-center justify-center">
          <div className="absolute top-1 right-2 w-3 h-2 bg-white rounded-xs" />
          {/* Back Mushroom */}
          <div className="absolute -top-3 right-3 flex flex-col items-center">
            <div className="w-4 h-2.5 bg-red-600 border border-red-800 rounded-t-full flex items-center justify-around px-0.5">
              <div className="w-0.8 h-0.8 bg-white rounded-full" />
            </div>
            <div className="w-1 h-1 bg-amber-100" />
          </div>
        </div>

        {/* 4 Cloven Hooves */}
        <div className="flex justify-between w-13 -mt-0.5">
          <div className={`w-2.5 h-5 bg-red-700 border border-red-900 flex flex-col justify-end ${isWalking ? 'translate-y-0.5' : ''}`}>
            <div className="w-full h-1.5 bg-neutral-900" />
          </div>
          <div className={`w-2.5 h-5 bg-red-700 border border-red-900 flex flex-col justify-end ${isWalking ? '-translate-y-0.5' : ''}`}>
            <div className="w-full h-1.5 bg-neutral-900" />
          </div>
          <div className={`w-2.5 h-5 bg-red-700 border border-red-900 flex flex-col justify-end ${isWalking ? 'translate-y-0.5' : ''}`}>
            <div className="w-full h-1.5 bg-neutral-900" />
          </div>
          <div className={`w-2.5 h-5 bg-red-700 border border-red-900 flex flex-col justify-end ${isWalking ? '-translate-y-0.5' : ''}`}>
            <div className="w-full h-1.5 bg-neutral-900" />
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 12. EVOKER (ILLAGER ROBES, SUMMONING VEIL)
  // ==========================================
  if (isEvoker) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl">
        {/* Illager Head */}
        <div className="w-12 h-12 bg-[#9ca3af] border-2 border-[#4b5563] relative shadow-md flex flex-col items-center">
          {/* Heavy Brow */}
          <div className="w-full h-2.5 bg-[#4b5563] border-b border-[#374151]" />
          {/* Emerald Green Eyes */}
          <div className="w-full flex justify-between px-2 mt-1">
            <div className="w-2 h-2 bg-emerald-500 border border-emerald-800 shadow-[0_0_6px_#10b981]" />
            <div className="w-2 h-2 bg-emerald-500 border border-emerald-800 shadow-[0_0_6px_#10b981]" />
          </div>
          {/* Iconic Long Illager Nose */}
          <div className="w-3.5 h-6 bg-[#6b7280] border border-[#374151] rounded-b -mt-0.5 z-20 shadow-md" />
        </div>

        {/* Torso: Dark Grey Robe with Golden Embroidery */}
        <div className="relative w-13 h-10 bg-neutral-900 border-x-2 border-neutral-950 flex flex-col items-center justify-between">
          <div className="w-full h-1 bg-yellow-400" />
          {/* Folded / Raised Magic Arms */}
          <div className="w-15 h-4 bg-neutral-800 border-2 border-yellow-500/80 rounded flex items-center justify-center shadow-lg -mt-1">
            <div className="text-[10px] text-amber-300 animate-pulse font-mono font-bold">✨ FANGS ✨</div>
          </div>
          <div className="w-full h-1.5 bg-yellow-500" />
        </div>

        {/* Long Robe Skirt */}
        <div className="w-13 h-11 bg-neutral-900 border-2 border-neutral-950 border-t-0 flex flex-col justify-end">
          <div className="w-full h-2 bg-yellow-400 border-t border-yellow-600" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 13. COPPER GOLEM (PATINA & LIGHTNING ROD)
  // ==========================================
  if (isCopperGolem) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl">
        {/* Copper Lightning Rod Antenna */}
        <div className="flex flex-col items-center -mb-1 z-20">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse shadow-[0_0_6px_#f59e0b]" />
          <div className="w-1 h-3.5 bg-amber-700" />
          <div className="w-3 h-1 bg-amber-600 rounded-sm" />
        </div>

        {/* Oxidised Copper Head with Verdigris Patina */}
        <div className="w-12 h-11 bg-[#b45309] border-2 border-[#78350f] rounded-xs relative shadow-md flex flex-col items-center justify-between p-1">
          {/* Turquoise Verdigris Patina Patches */}
          <div className="absolute top-1 left-1 w-2.5 h-2 bg-[#14b8a6] opacity-80 rounded-xs" />
          <div className="absolute bottom-1 right-1 w-2 h-2.5 bg-[#0d9488] opacity-80 rounded-xs" />
          {/* Big Round Copper Eyes */}
          <div className="w-full flex justify-between px-1 mt-1 z-10">
            <div className="w-2.5 h-2.5 bg-neutral-950 border border-amber-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-amber-300 rounded-full animate-ping" />
            </div>
            <div className="w-2.5 h-2.5 bg-neutral-950 border border-amber-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-amber-300 rounded-full" />
            </div>
          </div>
          {/* Copper Nose */}
          <div className="w-2 h-2.5 bg-[#d97706] border border-[#78350f] z-10" />
        </div>

        {/* Torso with Internal Gear */}
        <div className="w-11 h-8 bg-[#92400e] border-2 border-[#78350f] relative flex items-center justify-center shadow">
          <div className="w-3.5 h-3.5 border-2 border-dashed border-[#14b8a6] rounded-full animate-spin" style={{ animationDuration: '4s' }} />
        </div>

        {/* Sturdy Copper Legs */}
        <div className="flex justify-between w-9 -mt-0.5">
          <div className="w-3 h-5 bg-[#b45309] border border-[#78350f]" />
          <div className="w-3 h-5 bg-[#b45309] border border-[#78350f]" />
        </div>
      </div>
    );
  }

  // ==========================================
  // 14. ALLAY (FLYING SKY BLUE FAIRY)
  // ==========================================
  if (isAllay) {
    return (
      <div className="relative flex flex-col items-center drop-shadow-xl animate-bounce" style={{ animationDuration: '1.8s' }}>
        {/* Glowing Translucent Fairy Wings */}
        <div className="absolute -top-2 w-16 flex justify-between pointer-events-none z-10">
          <div className="w-6 h-8 bg-sky-200/80 border border-white rounded-full -rotate-45 shadow-[0_0_10px_#38bdf8] animate-pulse" />
          <div className="w-6 h-8 bg-sky-200/80 border border-white rounded-full rotate-45 shadow-[0_0_10px_#38bdf8] animate-pulse" />
        </div>

        {/* Allay Head */}
        <div className="w-8 h-8 bg-sky-400 border border-sky-200 rounded-sm relative shadow flex flex-col items-center justify-center">
          <div className="w-full flex justify-between px-1 mb-0.5">
            <div className="w-1.5 h-1.5 bg-neutral-900 border border-white rounded-xs" />
            <div className="w-1.5 h-1.5 bg-neutral-900 border border-white rounded-xs" />
          </div>
          <div className="w-2 h-0.5 bg-sky-200 rounded-full" />
        </div>

        {/* Floating Tapering Body */}
        <div className="w-6 h-6 bg-sky-500 border border-sky-300 rounded-b-md flex items-center justify-center shadow-md">
          {/* Held Cookie or Diamond item */}
          <div className="text-xs animate-pulse">🍪</div>
        </div>
      </div>
    );
  }

  // ==========================================================
  // 15. HUMANOID BODIES (STEVE, ALEX, DIAMOND, NETHERITE,
  //     HEROBRINE, ZOMBIE, DROWNED, WITCH, PIGLIN, SKELETON,
  //     WITHER SKELETON, VILLAGER)
  // ==========================================================

  // Colors & Attributes based on Subtype
  const skinColor = 
    isZombie ? '#588b48' :
    isDrowned ? '#2dd4bf' :
    isSkeleton ? '#d4d4d8' :
    isWitherSkeleton ? '#1c1917' :
    isPiglin ? '#f472b6' :
    isVillager ? '#b07954' :
    isWitch ? '#9d7857' :
    isAlex ? '#e3af85' :
    '#c58b5c'; // Steve, Herobrine, Diamond, Netherite

  const hairColor = 
    isAlex ? '#bf5b27' :
    isZombie ? '#2b4d24' :
    isDrowned ? '#0f766e' :
    isSkeleton ? '#a1a1aa' :
    isWitherSkeleton ? '#0c0a09' :
    isVillager ? '#4a3325' :
    isWitch ? '#2e1065' :
    '#4a2c14';

  const shirtColor = 
    isSteve || isDiamondSteve || isNetheriteSteve || isHerobrine ? '#00a8a8' :
    isZombie ? '#009b9b' :
    isDrowned ? '#0d9488' :
    isAlex ? '#5c8a4c' :
    isWitch ? '#6b21a8' :
    isPiglin ? '#78350f' :
    isSkeleton ? '#71717a' :
    isWitherSkeleton ? '#18181b' :
    isVillager ? '#6b4226' :
    '#00a8a8';

  const pantsColor = 
    isSteve || isDiamondSteve || isNetheriteSteve || isHerobrine || isZombie || isDrowned ? '#243763' :
    isAlex ? '#473623' :
    isWitch ? '#581c87' :
    isPiglin ? '#451a03' :
    isSkeleton ? '#52525b' :
    isWitherSkeleton ? '#09090b' :
    isVillager ? '#52321c' :
    '#243763';

  return (
    <div className="relative flex flex-col items-center drop-shadow-xl group">
      {/* Herobrine Thunder / Lightning Aura & Cursed Fog */}
      {isHerobrine && (
        <>
          <div className="absolute -inset-4 bg-sky-950/40 rounded-xl blur-lg pointer-events-none shadow-[0_0_20px_#38bdf8]" />
          <div className="absolute -top-3 left-1 text-[10px] text-cyan-300 font-mono font-black animate-pulse">⚡ LIGHTNING AURA</div>
        </>
      )}

      {/* Netherite Embers */}
      {isNetheriteSteve && (
        <div className="absolute -inset-2 bg-amber-950/30 rounded-xl blur-md pointer-events-none shadow-[0_0_15px_#f97316]" />
      )}

      {/* Cape Attached behind shoulders */}
      <MinecraftCape type={cape} isWalking={isWalking} />

      {/* ===================== HEAD ===================== */}
      <div 
        className="w-12 h-12 relative shadow-md border-2 border-black/40 overflow-hidden"
        style={{ backgroundColor: skinColor }}
      >
        {/* Witch Crooked Pointed Hat */}
        {isWitch && (
          <div className="absolute -top-1 left-0 right-0 z-20 flex flex-col items-center">
            {/* Crooked Cone */}
            <div className="w-5 h-6 bg-[#1e1b4b] border border-black rotate-12 -mt-3" />
            {/* Hat Brim */}
            <div className="w-14 h-2.5 bg-[#0f172a] border border-black shadow-md flex items-center justify-center">
              {/* Emerald Buckle */}
              <div className="w-2 h-1.5 bg-emerald-400 border border-emerald-700" />
            </div>
          </div>
        )}

        {/* Piglin Floppy Ears & Tusks */}
        {isPiglin && (
          <>
            <div className="absolute top-2 -left-2 w-2 h-5 bg-[#ec4899] border border-[#be185d] rounded-l-xs rotate-12" />
            <div className="absolute top-2 -right-2 w-2 h-5 bg-[#ec4899] border border-[#be185d] rounded-r-xs -rotate-12" />
            {/* Tusks */}
            <div className="absolute bottom-1 left-3 w-1.5 h-2 bg-white border border-neutral-400 -rotate-12 z-10" />
            <div className="absolute bottom-1 right-3 w-1.5 h-2 bg-white border border-neutral-400 rotate-12 z-10" />
          </>
        )}

        {/* Armor Helmet Overlay (Diamond / Netherite / Iron) */}
        {armorTier !== 'none' && (
          <div 
            className={`absolute -inset-0.5 border-2 z-20 flex flex-col justify-between ${
              armorTier === 'diamond' 
                ? 'bg-[#2ef5e4]/70 border-[#009c91] shadow-inner' 
                : armorTier === 'netherite' 
                ? 'bg-[#33313b]/85 border-[#1c1a21]' 
                : 'bg-neutral-300/80 border-neutral-500'
            }`}
          >
            {/* Helmet Nose Guard */}
            <div className="w-2.5 h-3 bg-current mx-auto mt-4 opacity-90" />
            {/* Enchanted Glint Sheen */}
            {(character.isEnchanted || armorTier === 'diamond') && (
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/35 to-pink-500/25 mix-blend-color-dodge animate-pulse pointer-events-none" />
            )}
          </div>
        )}

        {/* Hair Top & Sides (Steve, Alex, Zombie, Villager) */}
        {!isSkeleton && !isWitherSkeleton && !isVillager && (
          <>
            <div className="absolute top-0 left-0 right-0 h-4" style={{ backgroundColor: hairColor }} />
            <div className="absolute top-4 left-0 w-2.5 h-2" style={{ backgroundColor: hairColor }} />
            <div className="absolute top-4 right-0 w-2.5 h-2" style={{ backgroundColor: hairColor }} />
            {(isSteve || isDiamondSteve || isNetheriteSteve || isHerobrine) && (
              <div className="absolute top-4 left-3 w-6 h-1" style={{ backgroundColor: hairColor }} />
            )}
            {isAlex && (
              <div className="absolute top-4 left-2 w-7 h-2.5" style={{ backgroundColor: hairColor }} />
            )}
          </>
        )}

        {/* Skeleton Skull Details */}
        {(isSkeleton || isWitherSkeleton) && (
          <>
            <div className="absolute top-5 left-2 w-3 h-3 bg-neutral-900 border border-neutral-700">
              {isWitherSkeleton && <div className="w-1.5 h-1.5 bg-red-600 m-0.5 shadow-[0_0_4px_#ef4444]" />}
            </div>
            <div className="absolute top-5 right-2 w-3 h-3 bg-neutral-900 border border-neutral-700">
              {isWitherSkeleton && <div className="w-1.5 h-1.5 bg-red-600 m-0.5 shadow-[0_0_4px_#ef4444]" />}
            </div>
            <div className="absolute top-8 left-5 w-2 h-2 bg-neutral-900" />
            <div className="absolute top-10 left-3 w-6 h-1 bg-neutral-800" />
          </>
        )}

        {/* Villager / Witch Unibrow & Protruding 3D Nose */}
        {(isVillager || isWitch) && (
          <>
            <div className="absolute top-3 left-1 right-1 h-2 bg-stone-900" />
            {/* Big 3D Protruding Nose */}
            <div className="absolute top-5 left-4.5 w-3 h-5 bg-[#966341] border border-[#6b4226] shadow-md z-10 flex items-end">
              {isWitch && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mb-0.5 ml-0.5" />}
            </div>
          </>
        )}

        {/* Eyes (Herobrine: Pure Glowing White; Others: Pixel Highlights) */}
        {!isSkeleton && !isWitherSkeleton && (
          <div className="absolute top-6 left-0 right-0 flex justify-between px-1.5">
            {isHerobrine ? (
              <>
                <div className="w-3 h-2 bg-white shadow-[0_0_8px_#ffffff] border border-cyan-200" />
                <div className="w-3 h-2 bg-white shadow-[0_0_8px_#ffffff] border border-cyan-200" />
              </>
            ) : (
              <>
                {/* Left Eye */}
                <div className="flex">
                  <div className="w-2 h-2 bg-white" />
                  <div 
                    className="w-2 h-2"
                    style={{ 
                      backgroundColor: 
                        isZombie ? '#23381a' : 
                        isDrowned ? '#22d3ee' :
                        isAlex ? '#3b7a57' : 
                        isVillager || isWitch ? '#10b981' : 
                        '#27449c' 
                    }} 
                  />
                </div>
                {/* Right Eye */}
                <div className="flex">
                  <div 
                    className="w-2 h-2"
                    style={{ 
                      backgroundColor: 
                        isZombie ? '#23381a' : 
                        isDrowned ? '#22d3ee' :
                        isAlex ? '#3b7a57' : 
                        isVillager || isWitch ? '#10b981' : 
                        '#27449c' 
                    }} 
                  />
                  <div className="w-2 h-2 bg-white" />
                </div>
              </>
            )}
          </div>
        )}

        {/* Steve's Iconic Smile / Beard */}
        {(isSteve || isDiamondSteve || isNetheriteSteve || isHerobrine) && (
          <>
            <div className="absolute top-8 left-5 w-2 h-1 bg-[#aa7248]" />
            <div className="absolute top-9 left-3.5 w-5 h-2 bg-[#4a2c14] border-t border-[#3b200c] flex justify-center">
              <div className="w-3 h-1 bg-[#aa7248]" />
            </div>
          </>
        )}

        {/* Alex Lip */}
        {isAlex && <div className="absolute top-9 left-4 w-4 h-1 bg-[#c9806b]" />}
      </div>

      {/* ===================== TORSO & ARMS ===================== */}
      <div className="relative flex items-start justify-center">
        {/* Left Arm */}
        <div 
          className={`w-3.5 h-12 border-y-2 border-l-2 border-black/40 flex flex-col transition-transform origin-top ${
            isWalking ? 'rotate-16' : isZombie || isDrowned ? '-rotate-75' : ''
          }`}
          style={{ backgroundColor: skinColor }}
        >
          {/* Sleeve */}
          {!isSkeleton && !isWitherSkeleton && (
            <div className="w-full h-4 border-b border-black/30" style={{ backgroundColor: shirtColor }} />
          )}
          {/* Armor Pauldron */}
          {armorTier !== 'none' && (
            <div 
              className={`w-full h-4 border-b ${
                armorTier === 'diamond' ? 'bg-[#2ef5e4] border-[#009c91]' : 'bg-[#33313b] border-[#1c1a21]'
              }`} 
            />
          )}
        </div>

        {/* Main Torso */}
        <div 
          className="w-10 h-12 border-2 border-black/40 relative overflow-hidden flex flex-col justify-between"
          style={{ backgroundColor: shirtColor }}
        >
          {/* Steve V-neck collar */}
          {(isSteve || isDiamondSteve || isNetheriteSteve || isHerobrine) && armorTier === 'none' && (
            <div className="absolute top-0 left-3 w-4 h-2 bg-[#c58b5c] border-b border-black/30 flex justify-center">
              <div className="w-2 h-1 bg-[#aa7248]" />
            </div>
          )}

          {/* Armor Chestplate Overlay */}
          {armorTier !== 'none' && (
            <div 
              className={`absolute inset-0 flex flex-col justify-between p-0.5 ${
                armorTier === 'diamond' ? 'bg-[#2ef5e4]/90' : 'bg-[#33313b]/95'
              }`}
            >
              <div className="w-full h-2 border-b border-black/30 flex justify-center">
                <div className="w-4 h-1 bg-black/20" />
              </div>
              {/* Enchanted Glint */}
              {(character.isEnchanted || armorTier === 'diamond') && (
                <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/35 to-pink-500/25 mix-blend-color-dodge animate-pulse pointer-events-none" />
              )}
            </div>
          )}

          {/* Skeleton Ribs */}
          {(isSkeleton || isWitherSkeleton) && (
            <div className="w-full h-full flex flex-col justify-between py-1 px-1">
              <div className="h-1 bg-neutral-900 rounded-full" />
              <div className="h-1 bg-neutral-900 rounded-full" />
              <div className="h-1 bg-neutral-900 rounded-full" />
              <div className="h-1 bg-neutral-900 rounded-full" />
            </div>
          )}

          {/* Belt */}
          <div className="w-full h-2 bg-neutral-950/40 border-t border-black/30 mt-auto" />
        </div>

        {/* Right Arm (Holding Weapon / Tool) */}
        <div 
          className={`w-3.5 h-12 border-y-2 border-r-2 border-black/40 relative flex flex-col transition-transform origin-top ${
            isWalking ? '-rotate-16' : isZombie || isDrowned ? '-rotate-75' : ''
          }`}
          style={{ backgroundColor: skinColor }}
        >
          {/* Sleeve */}
          {!isSkeleton && !isWitherSkeleton && (
            <div className="w-full h-4 border-b border-black/30" style={{ backgroundColor: shirtColor }} />
          )}

          {/* Armor Pauldron */}
          {armorTier !== 'none' && (
            <div 
              className={`w-full h-4 border-b ${
                armorTier === 'diamond' ? 'bg-[#2ef5e4] border-[#009c91]' : 'bg-[#33313b] border-[#1c1a21]'
              }`} 
            />
          )}

          {/* Wielded Pixel Weapon / Tool Display */}
          <div className="absolute -bottom-4 -right-4 z-20 pointer-events-none">
            {activeWeapon === 'diamond_sword' && <PixelDiamondSword />}
            {activeWeapon === 'diamond_pickaxe' && <PixelDiamondPickaxe />}
            {activeWeapon === 'bow' && <PixelBow />}
            {activeWeapon === 'trident' && <PixelTrident />}
            {activeWeapon === 'totem' && <PixelTotem />}
            {activeWeapon === 'shield' && <PixelShield />}
            {activeWeapon === 'poppy' && <PixelPoppy />}
            {/* Generic Item fallback if heldItem passed */}
            {itemIcon && !['diamond_sword', 'diamond_pickaxe', 'bow', 'trident', 'totem', 'shield', 'poppy'].includes(activeWeapon) && (
              <div className="text-sm animate-pulse drop-shadow-md">{itemIcon}</div>
            )}
          </div>
        </div>
      </div>

      {/* ===================== LEGS & BOOTS ===================== */}
      <div className="flex justify-center -mt-0.5">
        {/* Left Leg */}
        <div 
          className={`w-4.5 h-12 border-x-2 border-b-2 border-black/40 flex flex-col justify-between transition-transform origin-top ${
            isWalking ? 'rotate-8' : ''
          }`}
          style={{ backgroundColor: armorTier !== 'none' ? (armorTier === 'diamond' ? '#2ef5e4' : '#33313b') : pantsColor }}
        >
          <div className="w-full h-1 bg-black/20 mt-4" />
          <div 
            className="w-full h-3 border-t-2 border-black/40"
            style={{ backgroundColor: armorTier === 'diamond' ? '#127a72' : armorTier === 'netherite' ? '#1c1a21' : '#383838' }}
          />
        </div>

        {/* Right Leg */}
        <div 
          className={`w-4.5 h-12 border-r-2 border-b-2 border-black/40 flex flex-col justify-between transition-transform origin-top ${
            isWalking ? '-rotate-8' : ''
          }`}
          style={{ backgroundColor: armorTier !== 'none' ? (armorTier === 'diamond' ? '#2ef5e4' : '#33313b') : pantsColor }}
        >
          <div className="w-full h-1 bg-black/20 mt-4" />
          <div 
            className="w-full h-3 border-t-2 border-black/40"
            style={{ backgroundColor: armorTier === 'diamond' ? '#127a72' : armorTier === 'netherite' ? '#1c1a21' : '#383838' }}
          />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   SPRNUKI AVATAR (HIGH-FIDELITY INCREDIBOX RHYTHM CHARACTERS)
========================================================== */
function SprnukiAvatar({
  character,
  isWalking,
  heldItem,
}: {
  character: CharacterData;
  isWalking: boolean;
  heldItem?: string;
}) {
  const itemIcon = getHeldItemIcon(heldItem);
  const nameLower = character.name.toLowerCase();
  const sub = (character.subtype || '').toLowerCase();

  // Identify Archetypes
  const isHorror = character.isHorror || sub === 'horror' || nameLower.includes('horror') || (nameLower.includes('simon') && nameLower.includes('phase 2')) || (nameLower.includes('void') && !nameLower.includes('phase 1'));
  const isSimon = sub === 'simon' || nameLower === 'simon' || (nameLower.includes('simon') && !isHorror);
  const isOren = sub === 'oren' || nameLower.includes('oren') || nameLower.includes('orange');
  const isRaddy = sub === 'raddy' || nameLower.includes('raddy') || nameLower.includes('red');
  const isVineria = sub === 'vineria' || nameLower.includes('vineria') || nameLower.includes('green');
  const isFunBot = sub === 'funbot' || nameLower.includes('fun') || nameLower.includes('bot');
  const isGray = sub === 'gray' || nameLower.includes('gray') || nameLower.includes('grey');
  const isGarnold = sub === 'garnold' || nameLower.includes('garnold') || nameLower.includes('gold') || nameLower.includes('yellow');
  const isDurple = sub === 'durple' || nameLower.includes('durple') || nameLower.includes('purple');
  const isSky = sub === 'sky' || nameLower.includes('sky') || nameLower.includes('cyan');
  const isTunner = sub === 'tunner' || nameLower.includes('tunner');
  const isMrSun = sub === 'mrsun' || nameLower.includes('sun');
  const isMrTree = sub === 'mrtree' || nameLower.includes('tree');
  const isWenda = sub === 'wenda' || nameLower.includes('wenda');
  const isPinki = sub === 'pinki' || nameLower.includes('pinki');
  const isJevin = sub === 'jevin' || nameLower.includes('jevin');
  const isBlack = sub === 'black' || nameLower.includes('black') || nameLower.includes('shadow');
  
  // New Expanded Sprunkis
  const isClukr = sub === 'clukr' || nameLower.includes('clukr');
  const isOwakcx = sub === 'owakcx' || nameLower.includes('owakcx');
  const isBrud = sub === 'brud' || nameLower.includes('brud');
  const isGarnoldVip = sub === 'garnold_vip' || nameLower.includes('vip');
  const isComputer = sub === 'computer' || nameLower.includes('computer');
  const isBlossom = sub === 'vineria_blossom' || nameLower.includes('blossom');
  const isWendaNeko = sub === 'wenda_neko' || nameLower.includes('neko');
  const isBlackVoid = sub === 'black_void' || nameLower.includes('void');
  const isVerity = sub === 'verity' || nameLower.includes('verity');

  // Palette Setup
  let bodyColor = '#3b82f6';
  let headwearColor = '#1d4ed8';
  let accentColor = '#60a5fa';
  let noteColor = 'text-blue-400';

  if (isHorror || isBlack || isBlackVoid) {
    bodyColor = isBlackVoid ? '#030712' : '#0c0a09';
    headwearColor = '#1c1917';
    accentColor = '#ef4444';
    noteColor = isBlack && !isHorror ? 'text-zinc-300' : 'text-red-500';
  } else if (isOren) {
    bodyColor = '#ea580c';
    headwearColor = '#c2410c';
    accentColor = '#fdba74';
    noteColor = 'text-orange-400';
  } else if (isRaddy) {
    bodyColor = '#dc2626';
    headwearColor = '#991b1b';
    accentColor = '#f87171';
    noteColor = 'text-red-400';
  } else if (isBlossom) {
    bodyColor = '#059669';
    headwearColor = '#10b981';
    accentColor = '#f472b6';
    noteColor = 'text-pink-300';
  } else if (isVineria) {
    bodyColor = '#16a34a';
    headwearColor = '#15803d';
    accentColor = '#86efac';
    noteColor = 'text-emerald-400';
  } else if (isComputer) {
    bodyColor = '#334155';
    headwearColor = '#0f172a';
    accentColor = '#22c55e';
    noteColor = 'text-emerald-400';
  } else if (isFunBot) {
    bodyColor = '#94a3b8';
    headwearColor = '#64748b';
    accentColor = '#38bdf8';
    noteColor = 'text-cyan-400';
  } else if (isGray) {
    bodyColor = '#475569';
    headwearColor = '#334155';
    accentColor = '#cbd5e1';
    noteColor = 'text-slate-300';
  } else if (isGarnoldVip) {
    bodyColor = '#ca8a04';
    headwearColor = '#000000';
    accentColor = '#38bdf8';
    noteColor = 'text-cyan-300';
  } else if (isGarnold || isMrSun || isSimon) {
    bodyColor = isSimon ? '#facc15' : '#eab308';
    headwearColor = '#ca8a04';
    accentColor = '#fef08a';
    noteColor = 'text-yellow-400';
  } else if (isDurple) {
    bodyColor = '#9333ea';
    headwearColor = '#7e22ce';
    accentColor = '#d8b4fe';
    noteColor = 'text-purple-400';
  } else if (isSky || isJevin) {
    bodyColor = isJevin ? '#06b6d4' : '#0ea5e9';
    headwearColor = '#0891b2';
    accentColor = '#a5f3fc';
    noteColor = 'text-cyan-300';
  } else if (isClukr) {
    bodyColor = '#0284c7';
    headwearColor = '#facc15';
    accentColor = '#38bdf8';
    noteColor = 'text-yellow-400';
  } else if (isOwakcx) {
    bodyColor = '#8b5cf6';
    headwearColor = '#ec4899';
    accentColor = '#facc15';
    noteColor = 'text-fuchsia-400';
  } else if (isBrud) {
    bodyColor = '#7c2d12';
    headwearColor = '#451a03';
    accentColor = '#fdba74';
    noteColor = 'text-amber-300';
  } else if (isTunner) {
    bodyColor = '#78350f';
    headwearColor = '#451a03';
    accentColor = '#d97706';
    noteColor = 'text-amber-500';
  } else if (isMrTree) {
    bodyColor = '#15803d';
    headwearColor = '#78350f';
    accentColor = '#86efac';
    noteColor = 'text-emerald-400';
  } else if (isWendaNeko) {
    bodyColor = '#fdf2f8';
    headwearColor = '#f472b6';
    accentColor = '#ec4899';
    noteColor = 'text-pink-400';
  } else if (isWenda) {
    bodyColor = '#f8fafc';
    headwearColor = '#f1f5f9';
    accentColor = '#f472b6';
    noteColor = 'text-pink-300';
  } else if (isVerity) {
    bodyColor = isHorror ? '#2e1065' : '#8b5cf6';
    headwearColor = isHorror ? '#0f051d' : '#7c3aed';
    accentColor = isHorror ? '#ef4444' : '#c084fc';
    noteColor = isHorror ? 'text-red-400' : 'text-purple-300';
  } else if (isPinki) {
    bodyColor = '#ec4899';
    headwearColor = '#db2777';
    accentColor = '#fbcfe8';
    noteColor = 'text-pink-400';
  }

  return (
    <div 
      className={`relative flex flex-col items-center select-none ${
        isHorror 
          ? 'filter drop-shadow-[0_0_18px_rgba(239,68,68,0.95)] animate-glitch' 
          : 'filter drop-shadow-xl animate-sprunki-bop'
      } ${isWalking ? 'scale-105' : ''}`}
    >
      {/* ================= BACKGROUND WINGS / TENTACLES / TAILS / SHADOWS ================= */}
      {/* Sky, Vineria Blossom & Verity: Angelic / Celestial Wings */}
      {(isSky || isBlossom || isVerity) && !isHorror && (
        <div className="absolute top-10 inset-x-0 flex justify-between px-1 pointer-events-none z-0">
          <div className="w-5 h-7 bg-white border border-cyan-200 rounded-l-full shadow-md -rotate-25 origin-right animate-pulse" />
          <div className="w-5 h-7 bg-white border border-cyan-200 rounded-r-full shadow-md rotate-25 origin-left animate-pulse" />
        </div>
      )}

      {/* Sky Phase 2 / Black Void: Fallen Dark Wings */}
      {(isSky || isBlackVoid) && isHorror && (
        <div className="absolute top-10 inset-x-0 flex justify-between px-0 pointer-events-none z-0">
          <div className="w-6 h-8 bg-neutral-950 border border-red-700 rounded-l-full shadow-[0_0_10px_#ef4444] -rotate-30 origin-right" />
          <div className="w-6 h-8 bg-neutral-950 border border-red-700 rounded-r-full shadow-[0_0_10px_#ef4444] rotate-30 origin-left" />
        </div>
      )}

      {/* Wenda & Wenda Neko: Fluffy Cat Tail Wagging */}
      {(isWenda || isWendaNeko) && (
        <div className={`absolute bottom-3 -right-3.5 w-6 h-8 border-r-4 ${isHorror ? 'border-neutral-900' : isWendaNeko ? 'border-pink-400' : 'border-white'} rounded-r-full pointer-events-none z-0 origin-bottom-left ${isWalking ? 'animate-bounce' : 'animate-pulse'}`} />
      )}

      {/* Durple: Reptilian Dino Tail */}
      {isDurple && (
        <div className={`absolute bottom-3 -left-3 w-5 h-7 border-l-4 ${isHorror ? 'border-neutral-900' : 'border-purple-600'} rounded-l-full pointer-events-none z-0 origin-bottom-right`} />
      )}

      {/* Clukr: Rooster Feathers */}
      {isClukr && (
        <div className="absolute bottom-3 -right-2.5 w-4 h-6 border-r-3 border-sky-400 rounded-r-full pointer-events-none z-0 rotate-12" />
      )}

      {/* Horror / Black Void: Void Shadow Tendrils */}
      {(isHorror || isBlack || isBlackVoid) && (
        <div className="absolute -top-4 inset-x-0 flex justify-between px-0.5 pointer-events-none z-0 opacity-85">
          <div className="w-2.5 h-8 bg-black rounded-full border-t border-red-600 -rotate-35 shadow-[0_0_10px_#ef4444] animate-pulse" />
          <div className="w-2.5 h-8 bg-black rounded-full border-t border-red-600 rotate-35 shadow-[0_0_10px_#ef4444] animate-pulse" />
        </div>
      )}

      {/* ================= FLOATING RHYTHM MUSICAL PARTICLES ================= */}
      <div 
        className={`absolute -top-8 -left-3 animate-note-float-1 pointer-events-none text-sm font-bold ${noteColor}`}
      >
        {isHorror ? '⚡' : isBlossom ? '🌸' : isVineria ? '🌸' : isFunBot || isComputer ? '⚡' : isOren ? '🎵' : isPinki ? '✨' : isClukr ? '🐔' : '♪'}
      </div>
      <div 
        className={`absolute -top-9 -right-3 animate-note-float-2 pointer-events-none text-sm font-bold ${noteColor}`}
      >
        {isHorror ? '🩸' : isSky ? '✨' : isGarnold || isGarnoldVip ? '🎶' : isRaddy ? '🔥' : isWenda || isWendaNeko ? '🐾' : isOwakcx ? '🎪' : isBrud ? '💤' : '♫'}
      </div>

      {/* ================= HEADWEAR / HORNS / ANTENNAE / CROWNS ================= */}
      <div className="relative z-20 flex items-center justify-center -mb-2">
        {/* OREN: Ribbed Knit Orange Beanie with Top Pompom */}
        {isOren && (
          <div className="flex flex-col items-center">
            <div className={`w-3.5 h-3.5 ${isHorror ? 'bg-neutral-950 border border-red-600 shadow-[0_0_6px_#ef4444]' : 'bg-orange-300 border border-orange-600 shadow'} rounded-full -mb-1 z-20`} />
            <div 
              className={`w-13 h-6.5 rounded-t-2xl border-2 ${isHorror ? 'border-red-950 bg-neutral-950' : 'border-orange-950 bg-orange-600'} shadow-md relative overflow-hidden`}
            >
              <div className="absolute inset-0 flex justify-between px-1.5 opacity-30">
                <div className="w-0.5 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
                <div className="w-0.5 h-full bg-black" />
              </div>
            </div>
            <div 
              className={`w-14 h-2.5 rounded-sm border-2 ${isHorror ? 'border-red-900 bg-neutral-900' : 'border-orange-950 bg-orange-700'} -mt-1 shadow z-10`}
            />
          </div>
        )}

        {/* RADDY: Sharp Curved Crimson Devil Horns */}
        {isRaddy && (
          <div className="flex justify-between w-13 px-0.5 -mb-1">
            <div 
              className={`w-3.5 h-5.5 rounded-tl-full border-2 ${isHorror ? 'border-black bg-red-950 shadow-[0_0_8px_#ef4444]' : 'border-red-950 bg-red-700 shadow-md'} -rotate-15 flex flex-col justify-between`}
            >
              {isHorror && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />}
            </div>
            <div 
              className={`w-3.5 h-5.5 rounded-tr-full border-2 ${isHorror ? 'border-black bg-red-950 shadow-[0_0_8px_#ef4444]' : 'border-red-950 bg-red-700 shadow-md'} rotate-15 flex flex-col justify-between`}
            >
              {isHorror && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />}
            </div>
          </div>
        )}

        {/* VINERIA & BLOSSOM: Leafy Tendrils & Blooming Sakura / Lotus Flower */}
        {(isVineria || isBlossom) && (
          <div className="relative flex items-center justify-center w-14 h-6">
            <div className={`absolute -left-1 top-1 w-3.5 h-4 border-l-2 border-t-2 ${isHorror ? 'border-red-800' : 'border-green-800'} rounded-tl-full -rotate-12`} />
            <div className={`absolute -right-1 top-1 w-3.5 h-4 border-r-2 border-t-2 ${isHorror ? 'border-red-800' : 'border-green-800'} rounded-tr-full rotate-12`} />
            <div className="relative w-6 h-6 flex items-center justify-center drop-shadow-md">
              <div className={`absolute w-2.5 h-2.5 ${isHorror ? 'bg-red-950 border border-red-700' : isBlossom ? 'bg-pink-300' : 'bg-pink-400'} rounded-full top-0`} />
              <div className={`absolute w-2.5 h-2.5 ${isHorror ? 'bg-red-950 border border-red-700' : isBlossom ? 'bg-pink-300' : 'bg-pink-400'} rounded-full bottom-0`} />
              <div className={`absolute w-2.5 h-2.5 ${isHorror ? 'bg-red-950 border border-red-700' : isBlossom ? 'bg-pink-300' : 'bg-pink-400'} rounded-full left-0`} />
              <div className={`absolute w-2.5 h-2.5 ${isHorror ? 'bg-red-950 border border-red-700' : isBlossom ? 'bg-pink-300' : 'bg-pink-400'} rounded-full right-0`} />
              <div className={`relative z-10 w-2 h-2 ${isHorror ? 'bg-red-500 shadow-[0_0_6px_#ef4444]' : 'bg-yellow-300'} rounded-full shadow-inner`} />
            </div>
          </div>
        )}

        {/* FUN BOT: Spring Antenna with Blinking Bulb */}
        {isFunBot && !isComputer && (
          <div className="flex flex-col items-center -mb-1">
            <div className={`w-3.5 h-3.5 ${isHorror ? 'bg-red-600 shadow-[0_0_10px_#ef4444] border border-red-900' : 'bg-yellow-300 shadow-[0_0_8px_#facc15] border border-yellow-500'} rounded-full animate-pulse`} />
            <div className="w-1.5 h-4 border-x border-slate-700 bg-slate-400 flex flex-col justify-between">
              <div className="w-full h-0.5 bg-slate-900" />
              <div className="w-full h-0.5 bg-slate-900" />
            </div>
          </div>
        )}

        {/* MR FUN COMPUTER: Retro CRT Antenna Pair */}
        {isComputer && (
          <div className="flex justify-between w-10 -mb-1">
            <div className="w-1 h-5 bg-slate-400 -rotate-25 rounded-t" />
            <div className="w-1 h-5 bg-slate-400 rotate-25 rounded-t" />
          </div>
        )}

        {/* CLUKR: Chaotic Rooster Crest & Yellow Beak Tip */}
        {isClukr && (
          <div className="flex items-center justify-center -mb-1">
            <div className="w-4 h-5 bg-red-600 border border-red-900 rounded-t-full shadow-md" />
            <div className="w-3.5 h-4 bg-red-500 border border-red-900 rounded-t-full -ml-1 shadow-md" />
          </div>
        )}

        {/* OWAKCX: Colorful Jester Cap with Jingling Bells */}
        {isOwakcx && (
          <div className="flex justify-between w-14 px-1 -mb-1">
            <div className="w-4 h-5 bg-fuchsia-600 border border-fuchsia-950 rounded-tl-full -rotate-30 flex items-start justify-start">
              <div className="w-2 h-2 bg-yellow-400 rounded-full shadow" />
            </div>
            <div className="w-4 h-5 bg-cyan-500 border border-cyan-950 rounded-tr-full rotate-30 flex items-start justify-end">
              <div className="w-2 h-2 bg-yellow-400 rounded-full shadow" />
            </div>
          </div>
        )}

        {/* BRUD: Floppy Striped Nightcap with Pompom */}
        {isBrud && (
          <div className="flex flex-col items-center -mb-1 -rotate-12">
            <div className="w-12 h-5 bg-blue-900 border-2 border-blue-950 rounded-t-xl flex justify-between px-2 pt-0.5">
              <div className="w-1 h-full bg-white/40" />
              <div className="w-1 h-full bg-white/40" />
            </div>
            <div className="w-3 h-3 bg-white rounded-full shadow -mt-1 -ml-8" />
          </div>
        )}

        {/* GRAY: Cute Bear / Cat Ears */}
        {isGray && (
          <div className="flex justify-between w-12 px-1 -mb-1">
            <div className={`w-4 h-4 ${isHorror ? 'bg-neutral-900 border-red-800' : 'bg-slate-700 border-slate-900'} rounded-t-full border-2 flex items-center justify-center`}>
              <div className={`w-2 h-2 ${isHorror ? 'bg-red-700' : 'bg-pink-300'} rounded-full`} />
            </div>
            <div className={`w-4 h-4 ${isHorror ? 'bg-neutral-900 border-red-800' : 'bg-slate-700 border-slate-900'} rounded-t-full border-2 flex items-center justify-center`}>
              <div className={`w-2 h-2 ${isHorror ? 'bg-red-700' : 'bg-pink-300'} rounded-full`} />
            </div>
          </div>
        )}

        {/* SKY: Floating Golden Angel Halo */}
        {isSky && (
          <div className="relative flex items-center justify-center w-14 h-4 mb-0.5">
            <div className={`w-11 h-3 border-2 ${isHorror ? 'border-red-600 shadow-[0_0_12px_#ef4444] bg-red-950/40 rotate-12' : 'border-yellow-400 shadow-[0_0_12px_#facc15] bg-yellow-300/30'} rounded-full`} />
          </div>
        )}

        {/* DURPLE: Purple Dino Horns & Spines */}
        {isDurple && (
          <div className="flex justify-between w-12 px-1 -mb-0.5">
            <div className={`w-3 h-4.5 ${isHorror ? 'bg-neutral-950 border-red-600' : 'bg-purple-950 border-purple-400'} rounded-t-full border -rotate-12 shadow`} />
            <div className={`w-3 h-4.5 ${isHorror ? 'bg-neutral-950 border-red-600' : 'bg-purple-950 border-purple-400'} rounded-t-full border rotate-12 shadow`} />
          </div>
        )}

        {/* HORROR SIMON & BLACK VOID: Shadow Spikes / Cracked Cursed Horns */}
        {isHorror && !isOren && !isRaddy && !isVineria && !isFunBot && !isGray && !isSky && !isDurple && (
          <div className="flex justify-between w-13 px-0.5 -mb-1">
            <div className="w-3.5 h-6 bg-neutral-950 border-t-2 border-l-2 border-red-600 rounded-tl-full shadow-[0_0_10px_#dc2626]" />
            <div className="w-3.5 h-6 bg-neutral-950 border-t-2 border-r-2 border-red-600 rounded-tr-full shadow-[0_0_10px_#dc2626]" />
          </div>
        )}

        {/* TUNNER: Dapper Jazz Fedora Hat with Band */}
        {isTunner && (
          <div className="flex flex-col items-center -mb-1">
            <div className={`w-11 h-4.5 ${isHorror ? 'bg-neutral-950 border-red-900' : 'bg-amber-900 border-amber-950'} border rounded-t-lg shadow relative`}>
              <div className={`absolute bottom-0 w-full h-1 ${isHorror ? 'bg-red-700' : 'bg-neutral-950'}`} />
            </div>
            <div className={`w-14 h-2 ${isHorror ? 'bg-neutral-950' : 'bg-amber-950'} rounded-full shadow -mt-0.5`} />
          </div>
        )}

        {/* MR SUN: Radiating Sunbeam Crown */}
        {isMrSun && (
          <div className="flex items-center justify-center w-14 h-4.5 mb-0.5 gap-1">
            <div className={`w-1 h-4 ${isHorror ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-yellow-400 shadow-[0_0_8px_#facc15]'} rounded-full -rotate-35`} />
            <div className={`w-1.5 h-5 ${isHorror ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-yellow-400 shadow-[0_0_8px_#facc15]'} rounded-full`} />
            <div className={`w-1 h-4 ${isHorror ? 'bg-red-600 shadow-[0_0_8px_#dc2626]' : 'bg-yellow-400 shadow-[0_0_8px_#facc15]'} rounded-full rotate-35`} />
          </div>
        )}

        {/* MR TREE: Forest Oak Twig & Acorns */}
        {isMrTree && (
          <div className="flex flex-col items-center -mb-1">
            <div className="flex gap-1.5">
              <div className={`w-2.5 h-3.5 ${isHorror ? 'bg-red-900' : 'bg-emerald-600'} rounded-full -rotate-45 shadow`} />
              <div className={`w-2.5 h-3.5 ${isHorror ? 'bg-red-900' : 'bg-emerald-600'} rounded-full rotate-45 shadow`} />
            </div>
            <div className="w-1.5 h-2 bg-amber-900 shadow" />
          </div>
        )}

        {/* WENDA & WENDA NEKO: White / Pastel Kitty Ears with Pink Inners */}
        {(isWenda || isWendaNeko) && (
          <div className="flex justify-between w-13 px-1 -mb-1">
            <div className={`w-4 h-4.5 ${isHorror ? 'bg-neutral-950 border-red-700' : 'bg-white border-stone-300'} rounded-t-full border flex items-center justify-center -rotate-12 shadow`}>
              <div className={`w-2 h-3 ${isHorror ? 'bg-red-600' : 'bg-pink-400'} rounded-full`} />
            </div>
            <div className={`w-4 h-4.5 ${isHorror ? 'bg-neutral-950 border-red-700' : 'bg-white border-stone-300'} rounded-t-full border flex items-center justify-center rotate-12 shadow`}>
              <div className={`w-2 h-3 ${isHorror ? 'bg-red-600' : 'bg-pink-400'} rounded-full`} />
            </div>
          </div>
        )}

        {/* PINKI: Giant Popstar Ribbon Hair Bow */}
        {isPinki && (
          <div className="flex items-center justify-center w-14 h-4.5 mb-0.5">
            <div className={`w-4 h-3.5 ${isHorror ? 'bg-neutral-950 border border-red-600 shadow-[0_0_6px_#ef4444]' : 'bg-pink-500 shadow'} rounded-full -rotate-30`} />
            <div className={`w-3 h-3 ${isHorror ? 'bg-red-700' : 'bg-pink-600'} rounded-full z-10 shadow`} />
            <div className={`w-4 h-3.5 ${isHorror ? 'bg-neutral-950 border border-red-600 shadow-[0_0_6px_#ef4444]' : 'bg-pink-500 shadow'} rounded-full rotate-30`} />
          </div>
        )}

        {/* JEVIN: Dripping Slime Cap */}
        {isJevin && (
          <div className="flex flex-col items-center -mb-0.5">
            <div className={`w-4 h-4 ${isHorror ? 'bg-lime-900 border-red-600 shadow-[0_0_8px_#84cc16]' : 'bg-cyan-400 border-cyan-600 shadow-[0_0_8px_#22d3ee]'} rounded-full border`} />
            <div className={`w-2.5 h-2 ${isHorror ? 'bg-lime-950' : 'bg-cyan-500'} rounded-b-full -mt-1`} />
          </div>
        )}

        {/* BLACK: The Iconic Black Top Hat with Crimson Ribbon (Phase 2 Horror Trigger) */}
        {(isBlack || isBlackVoid) && (
          <div className="flex flex-col items-center -mb-1 z-25 relative">
            {/* Top Hat Crown */}
            <div className={`w-8 h-8 ${isHorror ? 'bg-neutral-950 border-2 border-red-700 shadow-[0_0_12px_#ef4444]' : 'bg-neutral-900 border-2 border-neutral-950 shadow-xl'} rounded-t-sm flex flex-col justify-end items-center relative overflow-hidden`}>
              {/* Crimson Ribbon Band */}
              <div className={`w-full h-2.5 ${isHorror ? 'bg-red-700 shadow-[0_0_6px_#ef4444]' : 'bg-red-600'} border-y border-red-950`} />
              {/* Subtle sheen highlight on the hat */}
              <div className="absolute top-0.5 left-1 w-1 h-4 bg-white/20 rounded-full" />
            </div>
            {/* Hat Brim */}
            <div className={`w-13 h-2.5 ${isHorror ? 'bg-neutral-950 border-2 border-red-900 shadow-[0_0_10px_#dc2626]' : 'bg-neutral-950 border-t border-neutral-800'} rounded-full shadow-lg -mt-0.5`} />
          </div>
        )}

        {/* SIMON (Phase 1): Cheerful Whistling Boy with Curved Gold-Tipped Antennae */}
        {isSimon && !isHorror && (
          <div className="flex justify-between w-11 px-1 -mb-1">
            <div className="flex flex-col items-center -rotate-12">
              <div className="w-2.5 h-2.5 bg-yellow-300 border border-yellow-500 rounded-full shadow-[0_0_6px_#fde047]" />
              <div className="w-1 h-3.5 bg-yellow-500 -mt-0.5" />
            </div>
            <div className="flex flex-col items-center rotate-12">
              <div className="w-2.5 h-2.5 bg-yellow-300 border border-yellow-500 rounded-full shadow-[0_0_6px_#fde047]" />
              <div className="w-1 h-3.5 bg-yellow-500 -mt-0.5" />
            </div>
          </div>
        )}

        {/* VERITY: Celestial Starlight Halo Crown & Amethyst Tiara */}
        {isVerity && (
          <div className="flex flex-col items-center -mb-2 z-30">
            <div className={`flex items-center justify-center gap-1.5 ${isHorror ? 'text-red-500 animate-pulse' : 'text-amber-300 animate-bounce'}`}>
              <span className="text-xs">✦</span>
              <div className={`w-3.5 h-3.5 rounded-full ${isHorror ? 'bg-red-950 border-2 border-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-gradient-to-tr from-amber-400 to-purple-400 border border-amber-200 shadow-[0_0_12px_#c084fc]'} flex items-center justify-center`}>
                <span className="text-[8px] text-white font-black">★</span>
              </div>
              <span className="text-xs">✦</span>
            </div>
            <div className={`w-11 h-2 rounded-full ${isHorror ? 'bg-neutral-950 border border-red-800' : 'bg-purple-900 border border-purple-400 shadow'} -mt-1`} />
          </div>
        )}
      </div>

      {/* ================= HEAD & ANIMATED DJ HEADPHONES ================= */}
      <div className="relative flex items-center justify-center z-10">
        {/* DJ Headphones: Left Padded Ear Cup with Animated 5-Band EQ LED Bars */}
        <div 
          className="absolute -left-4 w-5.5 h-11 rounded-2xl border-2 border-neutral-950 z-20 flex flex-col items-center justify-center shadow-2xl gap-0.5"
          style={{ 
            backgroundColor: isHorror ? '#0c0a09' : isSky ? '#f8fafc' : isGarnoldVip ? '#eab308' : '#171717' 
          }}
        >
          {/* Animated Equalizer LED Bars */}
          <div className="flex items-end gap-0.5 h-6 px-1">
            <div className={`w-0.8 bg-cyan-400 rounded-xs animate-bounce`} style={{ height: '70%', animationDuration: '0.4s' }} />
            <div className={`w-0.8 ${isHorror ? 'bg-red-500' : 'bg-emerald-400'} rounded-xs animate-bounce`} style={{ height: '100%', animationDuration: '0.5s', animationDelay: '0.1s' }} />
            <div className={`w-0.8 ${isHorror ? 'bg-yellow-500' : 'bg-yellow-400'} rounded-xs animate-bounce`} style={{ height: '80%', animationDuration: '0.45s', animationDelay: '0.15s' }} />
            <div className={`w-0.8 ${isHorror ? 'bg-red-600' : 'bg-pink-400'} rounded-xs animate-bounce`} style={{ height: '60%', animationDuration: '0.35s', animationDelay: '0.2s' }} />
          </div>
        </div>

        {/* DJ Headphones: Arched Top Headband */}
        <div className="absolute -top-3.5 w-16 h-4 border-t-4 border-neutral-900 rounded-t-full z-15 pointer-events-none shadow" />

        {/* Main Head Face Chassis */}
        <div 
          className="w-14 h-14 rounded-2xl border-3 border-neutral-950 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center"
          style={{ 
            backgroundColor: bodyColor,
            backgroundImage: isComputer ? 'radial-gradient(#15803d 10%, #022c22 90%)' : isFunBot ? 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)' : undefined
          }}
        >
          {/* Subtle 3D highlight */}
          <div className="absolute top-0 inset-x-0 h-3.5 bg-white/20 rounded-t-xl pointer-events-none" />

          {/* Cosmic Starfield for Black / Black Void */}
          {(isBlack || isBlackVoid) && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping" />
              <div className="absolute top-4 right-3 w-1 h-1 bg-white rounded-full animate-pulse" />
              <div className="absolute bottom-2 left-3 w-0.8 h-0.8 bg-cyan-300 rounded-full" />
            </div>
          )}

          {/* CRT Scanline Overlay for Mr Fun Computer */}
          {isComputer && (
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px]" />
          )}

          {/* ================= EYES ================= */}
          {isHorror ? (
            /* Spooky Horror Eyes: Hollow Black Sockets with Glowing Red Pupils & Dripping Blood Tears */
            <div className="flex justify-between w-10 px-1 mt-1 z-10 relative">
              <div className="relative flex flex-col items-center">
                <div className="w-4 h-4 bg-black rounded-full border border-red-600/80 flex items-center justify-center shadow-[inset_0_0_8px_#000]">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444] animate-ping" />
                </div>
                <div className="w-1.2 h-3.5 bg-red-600 rounded-b-full shadow-[0_0_4px_#ef4444] -mt-0.5" />
              </div>
              <div className="relative flex flex-col items-center">
                <div className="w-4 h-4 bg-black rounded-full border border-red-600/80 flex items-center justify-center shadow-[inset_0_0_8px_#000]">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_8px_#ef4444]" />
                </div>
                <div className="w-1.2 h-3 bg-red-600 rounded-b-full shadow-[0_0_4px_#ef4444] -mt-0.5" />
              </div>
            </div>
          ) : isComputer ? (
            /* Computer: Glowing Green Matrix Phosphor Visor */
            <div className="flex justify-between items-center w-10 px-1.5 py-1 bg-black/90 rounded border border-emerald-400 z-10 shadow-[0_0_10px_#10b981]">
              <span className="text-[10px] text-emerald-400 font-mono font-black animate-pulse">[o]</span>
              <span className="text-[10px] text-emerald-400 font-mono font-black animate-pulse">[o]</span>
            </div>
          ) : isFunBot ? (
            /* Fun Bot Eyes: Cyan Digital Matrix Visor */
            <div className="flex justify-between items-center w-10 px-1.5 py-1 bg-black rounded-sm border border-cyan-400 z-10 shadow-[0_0_8px_#06b6d4]">
              <div className="text-[10px] text-cyan-300 font-mono font-black leading-none">■</div>
              <div className="text-[10px] text-cyan-300 font-mono font-black leading-none">■</div>
            </div>
          ) : isGarnoldVip ? (
            /* Garnold VIP: Iridescent Holographic Prism Shades */
            <div className="relative w-11 h-4 bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-400 border-2 border-black rounded-sm flex items-center justify-between px-1 z-10 shadow-lg">
              <div className="w-3.5 h-0.5 bg-white rounded-full -rotate-12" />
              <div className="w-3.5 h-0.5 bg-white rounded-full -rotate-12" />
            </div>
          ) : isGarnold || isTunner ? (
            /* Garnold & Tunner: Reflective Sunglasses */
            <div className={`relative w-10.5 h-4 bg-neutral-950 border-2 ${isTunner ? 'border-amber-700' : 'border-yellow-400'} rounded-sm flex items-center justify-between px-1 z-10 shadow-md`}>
              <div className="w-3 h-0.5 bg-white/80 rounded-full -rotate-12" />
              <div className="w-3 h-0.5 bg-white/80 rounded-full -rotate-12" />
            </div>
          ) : isBlack || isBlackVoid ? (
            /* Black: Piercing Solid White Glowing Sockets */
            <div className="flex justify-between w-10 px-1 mt-1 z-10">
              <div className="w-3.5 h-4.5 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
              <div className="w-3.5 h-4.5 bg-white rounded-full shadow-[0_0_12px_#ffffff]" />
            </div>
          ) : isBrud ? (
            /* Brud: Sleepy Half-Closed Heavy Eyelids */
            <div className="flex justify-between w-9.5 px-1 mt-1 z-10">
              <div className="w-3.5 h-2 bg-neutral-900 rounded-b-full border-t-2 border-amber-950" />
              <div className="w-3.5 h-2 bg-neutral-900 rounded-b-full border-t-2 border-amber-950" />
            </div>
          ) : isClukr ? (
            /* Clukr: Crazy Googly Jitter Eyes */
            <div className="flex justify-between w-10 px-1 mt-1 z-10">
              <div className="w-4 h-4 bg-white rounded-full border border-black flex items-center justify-start p-0.5 shadow">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
              <div className="w-4 h-4 bg-white rounded-full border border-black flex items-center justify-end p-0.5 shadow">
                <div className="w-1.5 h-1.5 bg-black rounded-full" />
              </div>
            </div>
          ) : isOwakcx && !isHorror ? (
            /* OWAKCX: Crazy Carnival Spiral Eyes */
            <div className="flex justify-between w-10 px-1 mt-1 z-10">
              <div className="w-4 h-4 bg-white rounded-full border-2 border-fuchsia-950 flex items-center justify-center shadow">
                <div className="text-[10px] text-fuchsia-600 font-black animate-spin" style={{ animationDuration: '3s' }}>🌀</div>
              </div>
              <div className="w-4 h-4 bg-white rounded-full border-2 border-fuchsia-950 flex items-center justify-center shadow">
                <div className="text-[10px] text-fuchsia-600 font-black animate-spin" style={{ animationDuration: '3s' }}>🌀</div>
              </div>
            </div>
          ) : isVerity && !isHorror ? (
            /* Verity: Radiant Cosmic Crystal Star Eyes */
            <div className="flex justify-between w-10 px-1 mt-1 z-10">
              <div className="w-4 h-4.5 bg-purple-950 rounded-full border-2 border-purple-300 flex items-center justify-center shadow-[0_0_8px_#c084fc] relative overflow-hidden">
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-ping" />
                <div className="absolute top-0.5 right-0.5 text-[8px] text-white">✦</div>
              </div>
              <div className="w-4 h-4.5 bg-purple-950 rounded-full border-2 border-purple-300 flex items-center justify-center shadow-[0_0_8px_#c084fc] relative overflow-hidden">
                <div className="w-2 h-2 bg-cyan-300 rounded-full animate-ping" />
                <div className="absolute top-0.5 right-0.5 text-[8px] text-white">✦</div>
              </div>
            </div>
          ) : (
            /* Classic Sprunki: Big Expressive Cartoon Eyes with Specular Highlights */
            <div className="flex justify-between w-9.5 px-1 mt-1 z-10">
              <div className="w-3.5 h-4.5 bg-white rounded-full border border-neutral-900 flex items-center justify-center shadow relative overflow-hidden">
                <div className="w-2 h-2.5 bg-black rounded-full relative">
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
              <div className="w-3.5 h-4.5 bg-white rounded-full border border-neutral-900 flex items-center justify-center shadow relative overflow-hidden">
                <div className="w-2 h-2.5 bg-black rounded-full relative">
                  <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-white rounded-full" />
                </div>
              </div>
            </div>
          )}

          {/* Brud: Medical Band-Aid across bridge of snout */}
          {isBrud && !isHorror && (
            <div className="w-6 h-2 bg-amber-200 border border-amber-500 rounded-xs flex items-center justify-center my-0.5 shadow-xs z-15">
              <div className="w-1.5 h-1 bg-amber-300 rounded-xs" />
            </div>
          )}

          {/* OWAKCX: Red Clown Ball Nose */}
          {isOwakcx && !isHorror && (
            <div className="w-3 h-3 bg-red-600 border border-red-800 rounded-full my-0.5 z-15 shadow-md" />
          )}

          {/* Rosy Anime Blush Cheeks */}
          {!isHorror && !isFunBot && !isGarnold && !isGarnoldVip && !isBlack && !isBlackVoid && !isComputer && !isOwakcx && !isBrud && (
            <div className="flex justify-between w-11 px-1 mt-0.5 z-10">
              <div className="w-2 h-1 bg-pink-400/60 rounded-full" />
              <div className="w-2 h-1 bg-pink-400/60 rounded-full" />
            </div>
          )}

          {/* ================= MOUTH ================= */}
          {isHorror ? (
            /* Horror Void Smile / Stitches / Needle Teeth */
            <div className="w-7 h-2.5 border-b-2 border-red-600 flex justify-between px-0.5 mt-0.5 bg-black/60 rounded">
              <div className="w-0.5 h-2.5 bg-red-600" />
              <div className="w-0.5 h-2.5 bg-red-600" />
              <div className="w-0.5 h-2.5 bg-red-600" />
              <div className="w-0.5 h-2.5 bg-red-600" />
              <div className="w-0.5 h-2.5 bg-red-600" />
            </div>
          ) : isComputer ? (
            /* Computer: Sine Wave Oscilloscope Mouth */
            <div className="w-7 h-2 flex items-center justify-center gap-0.5 mt-0.5">
              <div className="w-1 h-1 bg-emerald-400 animate-pulse" />
              <div className="w-1.5 h-2.5 bg-emerald-400 animate-pulse" />
              <div className="w-1.5 h-1.5 bg-emerald-400" />
              <div className="w-1 h-1 bg-emerald-400 animate-pulse" />
            </div>
          ) : isFunBot ? (
            /* Fun Bot Oscilloscope Wave Mouth */
            <div className="w-6 h-1.5 flex items-center justify-center gap-0.5 mt-1">
              <div className="w-1 h-1.5 bg-cyan-400 animate-pulse" />
              <div className="w-1 h-2 bg-cyan-400" />
              <div className="w-1 h-1.5 bg-cyan-400 animate-pulse" />
            </div>
          ) : isRaddy ? (
            /* Raddy Mischievous Smirk with Sharp Fang Tooth */
            <div className="w-5 h-2.5 bg-neutral-950 rounded-b-full relative overflow-hidden flex justify-end px-0.5 mt-0.5 border border-red-950">
              <div className="w-1.5 h-1.5 bg-white rounded-b-xs" />
            </div>
          ) : isClukr ? (
            /* Clukr: Pointy Yellow Rooster Beak */
            <div className="w-3.5 h-2.5 bg-yellow-400 border border-amber-600 rounded-b-full mt-0.5 shadow" />
          ) : isSimon && !isHorror ? (
            /* Simon Whistling Round Mouth */
            <div className="w-3.5 h-3.5 bg-neutral-950 rounded-full border border-black/50 flex items-center justify-center mt-0.5 shadow-inner">
              <div className="w-1.5 h-1.5 bg-pink-400 rounded-full" />
            </div>
          ) : (
            /* Rhythmic Beatbox / Singing Open Mouth with Animated Tongue */
            <div className="w-4.5 h-3 bg-neutral-950 rounded-full border border-black/40 relative overflow-hidden flex items-end justify-center mt-0.5 shadow-inner">
              <div className="w-3 h-1.5 bg-pink-400 rounded-t-full" />
            </div>
          )}
        </div>

        {/* DJ Headphones: Right Padded Ear Cup with Animated 5-Band EQ LED Bars */}
        <div 
          className="absolute -right-4 w-5.5 h-11 rounded-2xl border-2 border-neutral-950 z-20 flex flex-col items-center justify-center shadow-2xl gap-0.5"
          style={{ 
            backgroundColor: isHorror ? '#0c0a09' : isSky ? '#f8fafc' : isGarnoldVip ? '#eab308' : '#171717' 
          }}
        >
          {/* Animated Equalizer LED Bars */}
          <div className="flex items-end gap-0.5 h-6 px-1">
            <div className={`w-0.8 ${isHorror ? 'bg-red-500' : 'bg-pink-400'} rounded-xs animate-bounce`} style={{ height: '60%', animationDuration: '0.45s', animationDelay: '0.15s' }} />
            <div className={`w-0.8 ${isHorror ? 'bg-yellow-500' : 'bg-yellow-400'} rounded-xs animate-bounce`} style={{ height: '90%', animationDuration: '0.35s' }} />
            <div className={`w-0.8 ${isHorror ? 'bg-red-600' : 'bg-emerald-400'} rounded-xs animate-bounce`} style={{ height: '75%', animationDuration: '0.4s', animationDelay: '0.05s' }} />
            <div className={`w-0.8 bg-cyan-400 rounded-xs animate-bounce`} style={{ height: '50%', animationDuration: '0.5s', animationDelay: '0.1s' }} />
          </div>
        </div>
      </div>

      {/* ================= TORSO, HOODIE, ACCESSORIES & ARMS ================= */}
      <div className="relative flex items-center justify-center -mt-1.5 z-5">
        {/* Left Arm & Mitten Hand */}
        <div 
          className={`w-3.5 h-8.5 rounded-full border-2 border-neutral-950 -mr-1 shadow-lg flex flex-col justify-end items-center pb-0.5 origin-top transition-transform ${
            isWalking ? 'rotate-20' : '-rotate-6'
          }`}
          style={{ backgroundColor: isHorror ? '#171717' : bodyColor }}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isHorror ? 'bg-red-900' : 'bg-white/40'}`} />
        </div>

        {/* Hoodie Torso */}
        <div 
          className="w-10.5 h-10 rounded-2xl border-2 border-neutral-950 shadow-md relative overflow-hidden flex flex-col items-center justify-between p-1"
          style={{ backgroundColor: isHorror ? '#171717' : bodyColor }}
        >
          {/* White Center Zipper Line */}
          <div className="w-0.5 h-full bg-white/70 absolute left-1/2 -translate-x-1/2 top-0" />

          {/* Garnold: Gold Chain Necklace with Treble Clef */}
          {(isGarnold || isGarnoldVip) && !isHorror && (
            <div className="absolute top-1 z-20 flex flex-col items-center">
              <div className="w-6 h-1 border-b-2 border-yellow-400 rounded-full" />
              <div className="w-2 h-2 bg-yellow-400 rounded-full shadow flex items-center justify-center -mt-0.5">
                <span className="text-[6px] text-amber-950 font-black">♪</span>
              </div>
            </div>
          )}

          {/* Fun Bot & Computer: Chest Battery Power Gauge */}
          {(isFunBot || isComputer) && (
            <div className="absolute top-2 z-20 w-5 h-2 bg-black border border-cyan-400 rounded-xs flex items-center px-0.5 gap-0.5">
              <div className="w-1 h-1 bg-cyan-400 animate-pulse" />
              <div className="w-1 h-1 bg-cyan-400 animate-pulse" />
              <div className="w-1 h-1 bg-cyan-400" />
            </div>
          )}

          {/* Twin White Drawstrings with Knot Aglets */}
          <div className="flex justify-between w-6.5 z-10 pt-0.5">
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-3.5 bg-white shadow" />
              <div className="w-1 h-1 bg-white rounded-full shadow" />
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-3.5 bg-white shadow" />
              <div className="w-1 h-1 bg-white rounded-full shadow" />
            </div>
          </div>

          {/* Front Kangaroo Pouch Pocket */}
          <div className="w-8 h-2.5 bg-black/25 rounded-sm border-t border-black/30 z-10" />
        </div>

        {/* Right Arm & Mitten Hand (Holds Signature Item / Microphone!) */}
        <div 
          className={`w-3.5 h-8.5 rounded-full border-2 border-neutral-950 -ml-1 shadow-lg flex flex-col justify-end items-center pb-0.5 origin-top transition-transform relative ${
            isWalking ? '-rotate-20' : 'rotate-6'
          }`}
          style={{ backgroundColor: isHorror ? '#171717' : bodyColor }}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${isHorror ? 'bg-red-900' : 'bg-white/40'}`} />

          {/* Held Items */}
          {itemIcon ? (
            <div className="absolute -bottom-2 -right-3 text-sm filter drop-shadow animate-bounce">
              {itemIcon}
            </div>
          ) : isOren ? (
            /* Oren's Shure SM58 Stage Microphone */
            <div className="absolute -bottom-1 -right-2 w-2 h-4 bg-neutral-900 border border-stone-400 rounded-t flex flex-col items-center">
              <div className="w-2.5 h-2.5 bg-stone-300 rounded-full border border-stone-500 -mt-1 shadow" />
            </div>
          ) : isPinki ? (
            /* Pinki's Star Pop Wand */
            <div className="absolute -bottom-1 -right-2 text-xs animate-spin" style={{ animationDuration: '3s' }}>
              ⭐
            </div>
          ) : isTunner ? (
            /* Tunner's Gold Trumpet Pin */
            <div className="absolute -bottom-1 -right-2 text-xs">
              🎺
            </div>
          ) : (isGarnold || isGarnoldVip) ? (
            /* Mini Vinyl Turntable Scratch Disc */
            <div className="absolute -bottom-1 -right-2 w-3.5 h-3.5 bg-black rounded-full border border-yellow-400 flex items-center justify-center shadow animate-spin" style={{ animationDuration: '4s' }}>
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
            </div>
          ) : isWenda || isWendaNeko ? (
            /* Cute Cat Paw with Pink Pad */
            <div className="absolute -bottom-1 -right-1.5 w-2.5 h-2.5 bg-pink-300 rounded-full border border-pink-400" />
          ) : isJevin ? (
            /* Slime Drop Goo */
            <div className="absolute -bottom-2 -right-1.5 w-2 h-3 bg-cyan-400 rounded-b-full border border-cyan-500 shadow" />
          ) : null}
        </div>
      </div>

      {/* ================= LEGS & CARTOON SNEAKERS ================= */}
      <div className="flex justify-center gap-1.5 -mt-1 z-0">
        <div 
          className={`w-4 h-5.5 rounded-b-lg border-2 border-neutral-950 flex flex-col justify-end shadow-md transition-transform ${
            isWalking ? 'translate-y-0.5' : ''
          }`}
          style={{ backgroundColor: isHorror ? '#0c0a09' : bodyColor }}
        >
          <div className="w-full h-1.5 bg-white border-t border-neutral-900 rounded-b-sm" />
        </div>
        <div 
          className={`w-4 h-5.5 rounded-b-lg border-2 border-neutral-950 flex flex-col justify-end shadow-md transition-transform ${
            isWalking ? '-translate-y-0.5' : ''
          }`}
          style={{ backgroundColor: isHorror ? '#0c0a09' : bodyColor }}
        >
          <div className="w-full h-1.5 bg-white border-t border-neutral-900 rounded-b-sm" />
        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   TRAIN AVATAR (THOMAS & FRIENDS LOCOMOTIVE BODY)
========================================================== */
function TrainAvatar({
  character,
  isWalking,
}: {
  character: CharacterData;
  isWalking: boolean;
}) {
  const trainColor = character.color || 'bg-blue-600';
  const nameLower = (character.name || '').toLowerCase();

  // Engine Identification
  const isToby = nameLower.includes('toby');
  const isDiesel10 = nameLower.includes('diesel 10') || nameLower.includes('diesel10');
  const isDiesel = (nameLower.includes('diesel') && !nameLower.includes('salty') && !isDiesel10);
  const isSalty = nameLower.includes('salty');
  const isSpencer = nameLower.includes('spencer');
  const isEmily = nameLower.includes('emily');
  const isGordon = nameLower.includes('gordon');
  const isHenry = nameLower.includes('henry');
  const isJames = nameLower.includes('james');
  const isPercy = nameLower.includes('percy');
  const isEdward = nameLower.includes('edward');
  const isDuck = nameLower.includes('duck');
  const isOliver = nameLower.includes('oliver');
  const isNia = nameLower.includes('nia');
  const isRebecca = nameLower.includes('rebecca');
  const isHiro = nameLower.includes('hiro');
  const isMavis = nameLower.includes('mavis');
  const isScotsman = nameLower.includes('scotsman');
  const isConnor = nameLower.includes('connor');
  const isCaitlin = nameLower.includes('caitlin');
  const isAshima = nameLower.includes('ashima');
  const isSkarloey = nameLower.includes('skarloey');
  const isRusty = nameLower.includes('rusty');
  const isFlynn = nameLower.includes('flynn');

  const isCombustion = isDiesel || isSalty || isDiesel10 || isMavis || isRusty;

  // Engine Number or Letter
  const engineNumber = 
    isToby ? '7' :
    isDiesel10 ? 'D10' :
    isDiesel ? 'D' :
    isSalty ? '2991' :
    isSpencer ? 'S' :
    isEmily ? '12' :
    isOliver ? '11' :
    isDuck ? '8' :
    isPercy ? '6' :
    isJames ? '5' :
    isGordon ? '4' :
    isHenry ? '3' :
    isEdward ? '2' :
    isNia ? '18' :
    isRebecca ? '22' :
    isHiro ? '51' :
    isMavis ? '3393' :
    isScotsman ? '4472' :
    isConnor ? 'C' :
    isCaitlin ? 'K' :
    isAshima ? 'A' :
    isSkarloey ? '1' :
    isRusty ? '5' :
    isFlynn ? 'F' :
    nameLower.includes('donald') ? '9' :
    nameLower.includes('douglas') ? '10' : '1';

  return (
    <div className={`relative flex flex-col items-center drop-shadow-xl ${isWalking ? 'animate-bounce' : ''}`}>
      {/* Steam puffs while chuffing */}
      {isWalking && !isCombustion && !isFlynn && (
        <>
          <div className="absolute -top-5 left-1 w-3.5 h-3.5 bg-white/80 rounded-full animate-ping pointer-events-none" />
          <div className="absolute -top-7 left-4 w-2.5 h-2.5 bg-white/60 rounded-full animate-pulse pointer-events-none" />
        </>
      )}

      {/* Diesel exhaust smoke puffs */}
      {isWalking && isCombustion && (
        <div className="absolute -top-4 right-3 w-2.5 h-2.5 bg-neutral-700/70 rounded-full animate-ping pointer-events-none" />
      )}

      {/* Flynn Water Jet Spritz */}
      {isWalking && isFlynn && (
        <div className="absolute -top-5 right-2 w-3 h-3 bg-cyan-300/80 rounded-full animate-ping pointer-events-none" />
      )}

      {/* ================= ROOF, SMOKESTACK & DOME ================= */}
      {isToby ? (
        /* Toby Tram Roof & Brass Bell */
        <div className="flex flex-col items-center -mb-0.5 z-10 w-16">
          <div className="w-2 h-2 bg-yellow-400 rounded-t-full shadow border border-yellow-600 mb-0.5" />
          <div className="w-16 h-2 bg-neutral-800 border-t border-neutral-600 rounded-t-md shadow" />
        </div>
      ) : isDiesel10 ? (
        /* Diesel 10 Hydraulic Claw "Pinchy" */
        <div className="flex flex-col items-center -mb-1 z-20 w-16">
          <div className="flex items-center gap-0.5 pl-2">
            <div className="w-1.5 h-3 bg-yellow-400 border border-yellow-600 rounded-t transform -rotate-12 shadow" />
            <div className="w-2.5 h-2.5 bg-neutral-800 rounded-full border border-yellow-500 flex items-center justify-center shadow">
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
            </div>
            <div className="relative flex items-center">
              <div className="w-3.5 h-1.5 bg-slate-300 border border-slate-600 rounded-tr-md transform rotate-12 shadow" />
              <div className="w-3.5 h-1.5 bg-slate-300 border border-slate-600 rounded-br-md transform -rotate-12 -ml-3.5 mt-1.5 shadow" />
            </div>
          </div>
        </div>
      ) : isFlynn ? (
        /* Flynn Fire Engine Roof with Dual Water Cannons & Flashing Beacon */
        <div className="flex justify-between items-end w-16 px-2 -mb-0.5 z-10">
          <div className="w-2 h-3.5 bg-yellow-400 border border-amber-600 rounded-t flex flex-col items-center shadow">
            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
          </div>
          <div className="w-3 h-3 bg-red-600 rounded-full border-2 border-yellow-300 shadow-md animate-pulse flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full" />
          </div>
          <div className="w-2 h-3.5 bg-yellow-400 border border-amber-600 rounded-t flex flex-col items-center shadow">
            <div className="w-1 h-1 bg-neutral-800 rounded-full" />
          </div>
        </div>
      ) : isHiro ? (
        /* Hiro D51 Heavy Mikado Smokestack and Golden Headlight */
        <div className="flex gap-2.5 w-16 px-2 -mb-0.5 z-10 items-end">
          <div className="w-4 h-4 bg-neutral-950 border border-neutral-700 rounded-t-sm shadow flex flex-col justify-between">
            <div className="w-full h-1 bg-yellow-500 rounded-t-xs" />
          </div>
          <div className="w-3 h-3 bg-yellow-400 border-2 border-yellow-600 rounded-full shadow-lg flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          </div>
          <div className="w-3 h-3 bg-neutral-900 border border-neutral-700 rounded-t-full shadow" />
        </div>
      ) : isScotsman ? (
        /* Flying Scotsman Double Chimney & Brass Dome */
        <div className="flex gap-2.5 w-16 px-2 -mb-0.5 z-10 items-end">
          <div className="flex bg-neutral-900 border border-neutral-700 rounded-t-sm p-0.5 shadow">
            <div className="w-2 h-3.5 bg-neutral-800 rounded-t-xs border-r border-neutral-700" />
            <div className="w-2 h-3.5 bg-neutral-800 rounded-t-xs" />
          </div>
          <div className="w-3 h-3 bg-yellow-400 border border-yellow-600 rounded-t-full shadow" />
        </div>
      ) : isConnor || isCaitlin ? (
        /* Streamlined Bullet Aerodynamic Curved Nose & Cab */
        <div className="flex justify-center w-16 -mb-0.5 z-10">
          <div className={`w-14 h-2 rounded-t-full shadow border-t ${isConnor ? 'bg-teal-600 border-teal-300' : 'bg-fuchsia-900 border-fuchsia-400'}`} />
        </div>
      ) : isAshima ? (
        /* Ashima Indian Nilgiri Mountain Chimney */
        <div className="flex gap-2.5 w-14 px-2 -mb-0.5 z-10 items-end">
          <div className="w-3.5 h-4.5 bg-pink-800 border border-yellow-400 rounded-t-sm shadow flex flex-col justify-between">
            <div className="w-full h-1 bg-yellow-400 rounded-t-xs" />
          </div>
          <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full border border-yellow-600 shadow" />
        </div>
      ) : isMavis || isRusty ? (
        /* Quarry / Maintenance Diesel Cab Roof & Horns */
        <div className="flex justify-between w-16 px-3 -mb-0.5 z-10">
          <div className={`w-2 h-1 ${isRusty ? 'bg-orange-700' : 'bg-yellow-500'} rounded-t-sm`} />
          <div className={`w-2 h-1 ${isRusty ? 'bg-orange-700' : 'bg-yellow-500'} rounded-t-sm`} />
        </div>
      ) : isDiesel ? (
        /* Diesel Shunter Flat Cab Roof & Horns */
        <div className="flex justify-between w-16 px-3 -mb-0.5 z-10">
          <div className="w-2 h-1 bg-yellow-500 rounded-t-sm" />
          <div className="w-2 h-1 bg-yellow-500 rounded-t-sm" />
        </div>
      ) : isSpencer ? (
        /* Spencer Streamlined Silver Chimney */
        <div className="flex gap-4 w-16 px-2 -mb-0.5 z-10">
          <div className="w-4 h-2.5 bg-slate-400 border border-slate-600 rounded-t-full shadow" />
          <div className="w-3 h-2 bg-slate-300 rounded-t-full shadow" />
        </div>
      ) : isSkarloey ? (
        /* Skarloey Petite Vintage Stovepipe */
        <div className="flex gap-2.5 w-14 px-2 -mb-0.5 z-10 items-end">
          <div className="w-2.5 h-5 bg-neutral-900 border border-neutral-700 rounded-t-sm shadow flex flex-col justify-between">
            <div className="w-full h-1 bg-yellow-500 rounded-t-xs" />
          </div>
          <div className="w-3 h-2.5 bg-yellow-400 border border-yellow-600 rounded-t-full shadow" />
        </div>
      ) : (
        /* Classic Steam Smokestack & Brass Dome */
        <div className="flex gap-3 w-14 px-2 -mb-0.5 z-10">
          <div className={`w-3.5 h-4.5 bg-neutral-900 border border-neutral-700 rounded-t-sm shadow flex flex-col justify-between ${isEmily ? 'bg-amber-900' : ''}`}>
            <div className="w-full h-1 bg-yellow-500/80 rounded-t-xs" />
          </div>
          <div className="w-3 h-3 bg-yellow-400 border border-yellow-600 rounded-t-full shadow -mt-0.5" />
          {isJames && (
            <div className="w-2.5 h-2.5 bg-yellow-400 rounded-t-full shadow -mt-0.5 -ml-1" />
          )}
        </div>
      )}

      {/* ================= MAIN LOCOMOTIVE BODY ================= */}
      {isToby ? (
        /* Toby: Square Tram Body with Wooden Slats & Sideplates */
        <div className="w-17 h-11 bg-amber-800 border-2 border-amber-950 rounded shadow-2xl relative flex items-center px-1">
          <div className="absolute inset-0 flex justify-between px-2 opacity-30 pointer-events-none">
            <div className="w-0.5 h-full bg-black" />
            <div className="w-0.5 h-full bg-black" />
            <div className="w-0.5 h-full bg-black" />
            <div className="w-0.5 h-full bg-black" />
          </div>
          <div className="w-7 h-7 bg-gray-200 border-2 border-stone-400 rounded-sm flex flex-col items-center justify-center shadow-inner z-10">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-neutral-700 rounded-full mt-0.5" />
          </div>
          <div className="ml-auto pr-1.5 z-10 flex flex-col items-center">
            <div className="w-4 h-3 bg-sky-100 border border-neutral-900 rounded-xs mb-0.5" />
            <span className="text-[10px] font-black text-yellow-300 drop-shadow">7</span>
          </div>
        </div>
      ) : isDiesel10 ? (
        /* Diesel 10 Ochre Heavy Body with Hazard Chevrons & Menacing Face */
        <div className="w-18 h-11 bg-amber-600 border-2 border-amber-900 rounded-md shadow-2xl relative flex items-center px-1.5 overflow-hidden">
          <div className="w-7 h-7 bg-stone-300 border-2 border-stone-500 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1 mb-0.5">
              <div className="w-2 h-0.5 bg-neutral-800 rotate-12" />
              <div className="w-2 h-0.5 bg-neutral-800 -rotate-12" />
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-red-700 rounded-full" />
              <div className="w-1.5 h-1.5 bg-red-700 rounded-full" />
            </div>
            <div className="w-3.5 h-1 bg-neutral-900 rounded-full mt-0.5 border-b border-white" />
          </div>
          <div className="flex flex-col gap-0.5 ml-1.5 opacity-90">
            <div className="w-4 h-1 bg-yellow-300" />
            <div className="w-4 h-1 bg-black" />
            <div className="w-4 h-1 bg-yellow-300" />
            <div className="w-4 h-1 bg-black" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-stone-800 border border-amber-950 rounded-xs" />
            <span className="text-[9px] font-black text-yellow-300 drop-shadow">D10</span>
          </div>
        </div>
      ) : isHiro ? (
        /* Hiro Master of the Railway Mikado Black & Gold Body */
        <div className="w-18 h-11 bg-neutral-950 border-2 border-yellow-500/80 rounded-lg shadow-2xl relative flex items-center px-1">
          <div className="w-7 h-7 bg-stone-200 border-2 border-stone-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-3 h-0.5 bg-neutral-700 rounded-full mt-0.5" />
          </div>
          <div className="flex flex-col items-center ml-1">
            <div className="w-5 h-0.5 bg-yellow-400 shadow" />
            <div className="px-1 py-0.5 bg-red-800 border border-yellow-400 rounded-xs my-0.5">
              <span className="text-[7px] font-bold text-yellow-200">D51</span>
            </div>
            <div className="w-5 h-0.5 bg-yellow-400 shadow" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-sky-200 border border-neutral-800 rounded-xs" />
            <span className="text-[9px] font-black text-yellow-400 drop-shadow">51</span>
          </div>
        </div>
      ) : isFlynn ? (
        /* Flynn Fire Engine Locomotive Body with Hose Reels */
        <div className="w-18 h-11 bg-red-600 border-2 border-yellow-400 rounded-lg shadow-2xl relative flex items-center px-1">
          <div className="w-7 h-7 bg-stone-100 border-2 border-stone-300 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-3 h-1 bg-red-900 rounded-b-full mt-0.5" />
          </div>
          <div className="flex items-center gap-1 ml-1 z-10">
            <div className="w-3 h-4 bg-slate-300 border border-slate-500 rounded-xs flex flex-col justify-around p-0.5">
              <div className="w-full h-0.5 bg-red-500" />
              <div className="w-full h-0.5 bg-red-500" />
            </div>
            <div className="w-2.5 h-2.5 bg-yellow-300 border border-amber-600 rounded-full" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-sky-100 border border-red-950 rounded-xs" />
            <span className="text-[8px] font-black text-yellow-300">FIRE</span>
          </div>
        </div>
      ) : isConnor ? (
        /* Connor Teal Speed Bullet Streamliner */
        <div className="w-18 h-10.5 bg-teal-500 border-2 border-teal-300 rounded-r-xl rounded-l-2xl shadow-2xl relative flex items-center px-1.5 overflow-hidden">
          <div className="w-7 h-7 bg-stone-100 border-2 border-stone-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-neutral-700 rounded-full mt-0.5" />
          </div>
          <div className="flex items-center gap-0.5 ml-1">
            <div className="w-4 h-1 bg-yellow-300 skew-x-12" />
            <div className="w-2 h-2 bg-yellow-300 rotate-45 -ml-1" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-cyan-100 border border-teal-900 rounded-xs" />
            <span className="text-[9px] font-black text-yellow-300 italic">C</span>
          </div>
        </div>
      ) : isCaitlin ? (
        /* Caitlin Magenta Aerodynamic Streamliner */
        <div className="w-18 h-10.5 bg-fuchsia-800 border-2 border-fuchsia-400 rounded-r-xl rounded-l-2xl shadow-2xl relative flex items-center px-1.5 overflow-hidden">
          <div className="w-7 h-7 bg-stone-100 border-2 border-fuchsia-300 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-3 h-1 bg-fuchsia-950 rounded-b-full mt-0.5" />
          </div>
          <div className="flex flex-col gap-0.5 ml-1">
            <div className="w-5 h-1 bg-amber-100 rounded-full" />
            <div className="w-5 h-1 bg-pink-300 rounded-full" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-pink-100 border border-fuchsia-950 rounded-xs" />
            <span className="text-[9px] font-black text-amber-200 italic">K</span>
          </div>
        </div>
      ) : isAshima ? (
        /* Ashima Indian Nilgiri Mountain Engine with Lotus Motifs */
        <div className="w-17 h-10.5 bg-pink-600 border-2 border-yellow-300 rounded-lg shadow-xl relative flex items-center px-1">
          <div className="w-7 h-7 bg-stone-100 border-2 border-yellow-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="w-1 h-1 bg-red-600 rounded-full -mt-0.5 mb-0.5" />
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-pink-700 rounded-full mt-0.5" />
          </div>
          <div className="flex items-center gap-0.5 ml-1">
            <div className="w-2 h-3 bg-teal-400 rounded-full border border-yellow-300" />
            <div className="w-2.5 h-3.5 bg-yellow-300 rounded-full -ml-1 border border-amber-600" />
            <div className="w-2 h-3 bg-teal-400 rounded-full -ml-1 border border-yellow-300" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-amber-100 border border-yellow-600 rounded-xs" />
            <span className="text-[9px] font-black text-yellow-300">A</span>
          </div>
        </div>
      ) : isMavis ? (
        /* Mavis Black Quarry Diesel with Yellow Wasp Skirts */
        <div className="w-17 h-11 bg-stone-900 border-2 border-yellow-400 rounded-md shadow-2xl relative flex items-center px-1.5">
          <div className="w-7 h-7 bg-stone-200 border-2 border-stone-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-neutral-800 rounded-full mt-0.5" />
          </div>
          <div className="flex gap-0.5 ml-1">
            <div className="w-1 h-5 bg-yellow-400" />
            <div className="w-1 h-5 bg-black" />
            <div className="w-1 h-5 bg-yellow-400" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-sky-200 border border-stone-950 rounded-xs" />
            <span className="text-[8px] font-black text-yellow-400">3393</span>
          </div>
        </div>
      ) : isRusty ? (
        /* Rusty Orange Maintenance Diesel */
        <div className="w-17 h-10.5 bg-orange-600 border-2 border-orange-800 rounded-md shadow-xl relative flex items-center px-1.5">
          <div className="w-7 h-7 bg-stone-200 border-2 border-stone-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-3 h-0.5 bg-neutral-800 rounded-full mt-0.5" />
          </div>
          <div className="ml-1 px-1 py-0.5 bg-neutral-800 border border-orange-400 rounded-xs flex items-center justify-center">
            <span className="text-[7px] text-white">🛠️</span>
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-sky-100 border border-orange-950 rounded-xs" />
            <span className="text-[9px] font-black text-white drop-shadow">5</span>
          </div>
        </div>
      ) : isSkarloey ? (
        /* Skarloey Red Narrow-Gauge Engine */
        <div className="w-16 h-10 bg-red-700 border-2 border-red-900 rounded-lg shadow-xl relative flex items-center px-1">
          <div className="w-6.5 h-6.5 bg-stone-200 border-2 border-stone-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-neutral-700 rounded-full mt-0.5" />
          </div>
          <div className="flex gap-1 ml-1">
            <div className="w-0.5 h-6 bg-yellow-400" />
            <div className="w-0.5 h-6 bg-yellow-400" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-3.5 h-3 bg-neutral-800 border border-yellow-400 rounded-xs" />
            <span className="text-[8px] font-black text-yellow-300">1</span>
          </div>
        </div>
      ) : isDiesel ? (
        /* Diesel 08 Shunter Boxy Black Body */
        <div className="w-17 h-11 bg-neutral-900 border-2 border-neutral-700 rounded-md shadow-2xl relative flex items-center px-1.5">
          <div className="w-7 h-8 bg-neutral-950 border border-neutral-700 rounded-xs flex flex-col justify-around p-0.5">
            <div className="w-full h-0.5 bg-neutral-600" />
            <div className="w-full h-0.5 bg-neutral-600" />
            <div className="w-5 h-5 bg-gray-300 border border-neutral-600 rounded-full mx-auto flex flex-col items-center justify-center shadow-inner">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-black rounded-full" />
                <div className="w-1 h-1 bg-black rounded-full" />
              </div>
              <div className="w-2 h-0.5 bg-black rounded-full mt-0.5 -rotate-6" />
            </div>
            <div className="w-full h-0.5 bg-neutral-600" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1">
            <div className="w-4 h-3 bg-sky-200 border border-black rounded-xs" />
            <span className="text-[9px] font-black text-white drop-shadow">D</span>
          </div>
        </div>
      ) : isSalty ? (
        /* Salty: Crimson Dockside Diesel with Hazard Wasp Stripes */
        <div className="w-17 h-11 bg-red-800 border-2 border-red-950 rounded-md shadow-2xl relative flex items-center px-1.5">
          <div className="w-7 h-7 bg-gray-200 border-2 border-neutral-600 rounded-full flex flex-col items-center justify-center shadow-inner z-10">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
            <div className="w-3 h-1 bg-black rounded-b-full mt-0.5" />
          </div>
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-sky-200 border border-neutral-900 rounded-xs" />
            <span className="text-[8px] font-black text-yellow-300 drop-shadow">2991</span>
          </div>
        </div>
      ) : isSpencer ? (
        /* Spencer: Sleek Silver Streamliner */
        <div className="w-18 h-10 bg-slate-300 border-2 border-slate-500 rounded-r-xl rounded-l-2xl shadow-2xl relative flex items-center px-1.5">
          <div className="w-7 h-7 bg-gray-100 border-2 border-slate-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
              <div className="w-1.5 h-1.5 bg-black rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-neutral-700 rounded-full mt-0.5" />
          </div>
          <div className="ml-auto pr-1 flex flex-col items-center z-10">
            <div className="w-5 h-3 bg-sky-200 border border-slate-600 rounded-xs" />
            <span className="text-[8px] font-black text-slate-800">BOXFORD</span>
          </div>
        </div>
      ) : (
        /* Classic Steam Locomotive (Thomas, Percy, James, Gordon, Emily, Edward, Duck, Scotsman, etc.) */
        <div className={`w-17 h-10.5 ${trainColor} border-2 border-white/80 rounded-lg shadow-xl relative flex items-center px-1`}>
          <div className="w-7 h-7 bg-gray-200 border-2 border-gray-400 rounded-full flex flex-col items-center justify-center shadow-inner z-10 flex-shrink-0">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
            </div>
            <div className="w-2.5 h-0.5 bg-neutral-700 rounded-full mt-0.5" />
          </div>

          {/* Special decorative details per engine */}
          {isNia && (
            <div className="flex gap-0.5 ml-1 opacity-80">
              <div className="w-1.5 h-4 bg-yellow-400" />
              <div className="w-1.5 h-4 bg-green-600" />
            </div>
          )}

          {isEmily && (
            <div className="w-6 h-6 border-2 border-yellow-400 bg-yellow-500/30 rounded-full absolute left-7 top-1 shadow-inner flex items-center justify-center">
              <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            </div>
          )}

          {isScotsman && (
            <div className="flex items-center gap-0.5 ml-1">
              <div className="w-3.5 h-5 bg-emerald-900 border border-yellow-400/80 rounded-xs flex flex-col justify-between p-0.5">
                <div className="w-full h-1 bg-black rounded-xs" />
              </div>
            </div>
          )}

          {/* Cab Window & Official Sodor Number */}
          <div className="ml-auto flex flex-col items-center pr-1 z-10">
            <div className="w-4 h-3 bg-sky-200 border border-neutral-800 rounded-xs" />
            <span className="text-[9px] font-black text-yellow-300 drop-shadow">
              {engineNumber}
            </span>
          </div>
        </div>
      )}

      {/* ================= WHEELS & LOWER CHASSIS ================= */}
      {isToby ? (
        /* Toby Cowcatcher & Wooden Sideplates */
        <div className="w-17 h-3 bg-amber-950 flex justify-between items-center px-1 border-t border-amber-900 rounded-b-sm">
          <div className="flex gap-0.5">
            <div className="w-0.5 h-2 bg-stone-400" />
            <div className="w-0.5 h-2 bg-stone-400" />
            <div className="w-0.5 h-2 bg-stone-400" />
          </div>
          <span className="text-[7px] text-amber-400 font-mono font-bold">LNER 7</span>
          <div className="flex gap-0.5">
            <div className="w-0.5 h-2 bg-stone-400" />
            <div className="w-0.5 h-2 bg-stone-400" />
            <div className="w-0.5 h-2 bg-stone-400" />
          </div>
        </div>
      ) : isDiesel10 ? (
        /* Diesel 10 Industrial Hazard Buffer Beam */
        <div className="w-18 h-3.5 bg-neutral-950 flex justify-around items-center px-0.5 border-t-2 border-yellow-500 rounded-b-sm overflow-hidden relative">
          <div className="absolute -left-1 w-1.5 h-1.5 bg-black rounded-full border border-yellow-500" />
          <div className="absolute -right-1 w-1.5 h-1.5 bg-black rounded-full border border-yellow-500" />
          <div className={`w-3.5 h-3.5 bg-neutral-700 border border-amber-600 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
          <div className={`w-3.5 h-3.5 bg-neutral-700 border border-amber-600 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
          <div className={`w-3.5 h-3.5 bg-neutral-700 border border-amber-600 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
        </div>
      ) : isHiro ? (
        /* Hiro D51 Heavy Mikado 4 Driving Wheels */
        <div className="w-18 h-3.5 bg-neutral-950 flex justify-around items-center px-0.5 border-t-2 border-red-700 rounded-b-sm relative">
          <div className={`w-3 h-3 bg-neutral-600 border border-yellow-500 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
          <div className={`w-3 h-3 bg-neutral-600 border border-yellow-500 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
          <div className={`w-3 h-3 bg-neutral-600 border border-yellow-500 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
          <div className={`w-3 h-3 bg-neutral-600 border border-yellow-500 rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-yellow-400 rounded-full" />
          </div>
        </div>
      ) : isFlynn ? (
        /* Flynn Road-Rail Wheels with Red Hubcaps */
        <div className="w-18 h-3.5 bg-neutral-900 flex justify-around items-center px-1 border-t-2 border-yellow-400 rounded-b-sm relative">
          <div className={`w-3.5 h-3.5 bg-red-600 border border-black rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className={`w-3.5 h-3.5 bg-red-600 border border-black rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className={`w-3.5 h-3.5 bg-red-600 border border-black rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
        </div>
      ) : isSalty || isMavis ? (
        /* Salty / Mavis Yellow & Black Hazard Stripe Buffer Beam */
        <div className="w-17 h-3 bg-neutral-900 flex justify-around items-center px-0.5 border-t-2 border-yellow-400 rounded-b-sm overflow-hidden">
          <div className="w-3.5 h-3.5 bg-neutral-700 border border-black rounded-full" />
          <div className="w-3.5 h-3.5 bg-neutral-700 border border-black rounded-full" />
          <div className="w-3.5 h-3.5 bg-neutral-700 border border-black rounded-full" />
        </div>
      ) : (
        /* Steam Locomotive Red Buffer Beam & Driving Wheels */
        <div className="w-17 h-3.5 bg-neutral-900 flex justify-around items-center px-1 border-t-2 border-red-600 rounded-b-sm relative">
          <div className="absolute -left-1 w-1.5 h-1.5 bg-black rounded-full border border-stone-500" />
          <div className="absolute -right-1 w-1.5 h-1.5 bg-black rounded-full border border-stone-500" />
          
          <div className={`w-3.5 h-3.5 bg-gray-400 border border-black rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          <div className={`w-3.5 h-3.5 bg-gray-400 border border-black rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          <div className={`w-3.5 h-3.5 bg-gray-400 border border-black rounded-full flex items-center justify-center ${isWalking ? 'animate-spin' : ''}`}>
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
        </div>
      )}
    </div>
  );
}

/* ==========================================================
   COUNTRYBALL VECTOR FLAGS (HIGH FIDELITY SVG DESIGNS)
========================================================== */
function CountryballFlagSvg({ name, flag, color }: { name: string; flag?: string; color?: string }) {
  const n = name.toLowerCase();

  if (n.includes('usa') || n.includes('america')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* 13 Stripes */}
        {Array.from({ length: 13 }).map((_, i) => (
          <rect key={i} y={i * (100 / 13)} width="100" height={100 / 13 + 0.5} fill={i % 2 === 0 ? '#b91c1c' : '#ffffff'} />
        ))}
        {/* Blue Canton */}
        <rect x="0" y="0" width="46" height="54" fill="#1e3a8a" />
        {/* White Stars */}
        <circle cx="10" cy="11" r="2.8" fill="#ffffff" />
        <circle cx="23" cy="11" r="2.8" fill="#ffffff" />
        <circle cx="36" cy="11" r="2.8" fill="#ffffff" />
        <circle cx="16" cy="22" r="2.8" fill="#ffffff" />
        <circle cx="29" cy="22" r="2.8" fill="#ffffff" />
        <circle cx="10" cy="33" r="2.8" fill="#ffffff" />
        <circle cx="23" cy="33" r="2.8" fill="#ffffff" />
        <circle cx="36" cy="33" r="2.8" fill="#ffffff" />
        <circle cx="16" cy="44" r="2.8" fill="#ffffff" />
        <circle cx="29" cy="44" r="2.8" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('uk') || n.includes('britain')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {/* Blue Background */}
        <rect width="100" height="100" fill="#00247d" />
        {/* Diagonal White Cross */}
        <line x1="0" y1="0" x2="100" y2="100" stroke="#ffffff" strokeWidth="22" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#ffffff" strokeWidth="22" />
        {/* Diagonal Red Cross */}
        <line x1="0" y1="0" x2="100" y2="100" stroke="#cf142b" strokeWidth="9" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#cf142b" strokeWidth="9" />
        {/* Central White Cross */}
        <rect x="36" y="0" width="28" height="100" fill="#ffffff" />
        <rect x="0" y="36" width="100" height="28" fill="#ffffff" />
        {/* Central Red St. George Cross */}
        <rect x="42" y="0" width="16" height="100" fill="#cf142b" />
        <rect x="0" y="42" width="100" height="16" fill="#cf142b" />
      </svg>
    );
  }

  if (n.includes('poland')) {
    // Polandball canon: inverted flag (red on top, white on bottom)
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#dc2626" />
        <rect x="0" y="50" width="100" height="50" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('japan')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#ffffff" />
        <circle cx="50" cy="50" r="28" fill="#bc002d" />
      </svg>
    );
  }

  if (n.includes('china')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#de2910" />
        {/* Big Yellow Star */}
        <polygon points="20,10 24,22 36,22 26,30 30,42 20,34 10,42 14,30 4,22 16,22" fill="#ffde00" />
        {/* 4 Arc Stars */}
        <polygon points="40,12 42,16 46,16 43,18 44,22 40,20 37,22 38,18 35,16 39,16" fill="#ffde00" />
        <polygon points="46,20 48,24 52,24 49,26 50,30 46,28 43,30 44,26 41,24 45,24" fill="#ffde00" />
        <polygon points="46,31 48,35 52,35 49,37 50,41 46,39 43,41 44,37 41,35 45,35" fill="#ffde00" />
        <polygon points="40,40 42,44 46,44 43,46 44,50 40,48 37,50 38,46 35,44 39,44" fill="#ffde00" />
      </svg>
    );
  }

  if (n.includes('canada')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="26" height="100" fill="#d80027" />
        <rect x="26" y="0" width="48" height="100" fill="#ffffff" />
        <rect x="74" y="0" width="26" height="100" fill="#d80027" />
        {/* 11-point Red Maple Leaf */}
        <path d="M50 25 L53 36 L63 34 L58 43 L68 47 L63 54 L69 61 L58 60 L54 67 L51 64 L50 78 L49 64 L46 67 L42 60 L31 61 L37 54 L32 47 L42 43 L37 34 L47 36 Z" fill="#d80027" />
      </svg>
    );
  }

  if (n.includes('germany')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#171717" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#dd0000" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#ffce00" />
      </svg>
    );
  }

  if (n.includes('france')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#002654" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#ffffff" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#ed2939" />
      </svg>
    );
  }

  if (n.includes('russia')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#0039a6" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#d52b1e" />
      </svg>
    );
  }

  if (n.includes('italy')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#009246" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#ffffff" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#ce2b37" />
      </svg>
    );
  }

  if (n.includes('mexico')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#006847" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#ffffff" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#ce1126" />
        {/* Golden Eagle Emblem */}
        <circle cx="50" cy="50" r="9" fill="#92400e" opacity="0.85" />
        <circle cx="50" cy="50" r="5" fill="#15803d" opacity="0.9" />
      </svg>
    );
  }

  if (n.includes('brazil')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#009c3b" />
        <polygon points="50,15 88,50 50,85 12,50" fill="#ffdf00" />
        <circle cx="50" cy="50" r="19" fill="#002776" />
        <path d="M 33 52 Q 50 46 67 48" stroke="#ffffff" strokeWidth="3" fill="none" />
      </svg>
    );
  }

  if (n.includes('spain')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="25" fill="#aa151b" />
        <rect x="0" y="25" width="100" height="50" fill="#f1bf00" />
        <rect x="0" y="75" width="100" height="25" fill="#aa151b" />
        {/* Spanish Royal Crest */}
        <rect x="25" y="38" width="11" height="14" rx="2" fill="#aa151b" />
        <circle cx="30.5" cy="35" r="3" fill="#f1bf00" />
      </svg>
    );
  }

  if (n.includes('australia')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#00008b" />
        {/* Union Jack canton */}
        <rect x="0" y="0" width="48" height="34" fill="#00247d" />
        <line x1="0" y1="0" x2="48" y2="34" stroke="#ffffff" strokeWidth="4" />
        <line x1="0" y1="34" x2="48" y2="0" stroke="#ffffff" strokeWidth="4" />
        <line x1="0" y1="0" x2="48" y2="34" stroke="#cf142b" strokeWidth="2" />
        <line x1="0" y1="34" x2="48" y2="0" stroke="#cf142b" strokeWidth="2" />
        <rect x="21" y="0" width="6" height="34" fill="#ffffff" />
        <rect x="0" y="14" width="48" height="6" fill="#ffffff" />
        <rect x="22" y="0" width="4" height="34" fill="#cf142b" />
        <rect x="0" y="15" width="48" height="4" fill="#cf142b" />
        {/* Commonwealth 7-point Star */}
        <polygon points="24,52 27,62 37,62 29,68 32,78 24,72 16,78 19,68 11,62 21,62" fill="#ffffff" />
        {/* Southern Cross stars */}
        <circle cx="75" cy="24" r="2.8" fill="#ffffff" />
        <circle cx="86" cy="44" r="2.8" fill="#ffffff" />
        <circle cx="75" cy="72" r="2.8" fill="#ffffff" />
        <circle cx="64" cy="48" r="2.8" fill="#ffffff" />
        <circle cx="80" cy="58" r="1.8" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('sweden')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#006aa7" />
        <rect x="30" y="0" width="16" height="100" fill="#fecc00" />
        <rect x="0" y="42" width="100" height="16" fill="#fecc00" />
      </svg>
    );
  }

  if (n.includes('netherland') || n.includes('dutch')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#ae1c28" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#21468b" />
      </svg>
    );
  }

  if (n.includes('ukraine')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#0057b7" />
        <rect x="0" y="50" width="100" height="50" fill="#ffd700" />
      </svg>
    );
  }

  if (n.includes('india')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#ff9933" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#138808" />
        <circle cx="50" cy="50" r="11" fill="none" stroke="#000088" strokeWidth="2.5" />
        <circle cx="50" cy="50" r="2.5" fill="#000088" />
      </svg>
    );
  }

  if (n.includes('turkey') || n.includes('türkiye')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#e30a17" />
        <circle cx="44" cy="50" r="22" fill="#ffffff" />
        <circle cx="50" cy="50" r="17.5" fill="#e30a17" />
        <polygon points="62,42 64,48 70,48 65,52 67,58 62,54 57,58 59,52 54,48 60,48" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('switzerland') || n.includes('swiss')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#d52b1e" />
        <rect x="40" y="20" width="20" height="60" fill="#ffffff" />
        <rect x="20" y="40" width="60" height="20" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('greece') || n.includes('greek')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} y={i * (100 / 9)} width="100" height={100 / 9 + 0.5} fill={i % 2 === 0 ? '#0d5eaf' : '#ffffff'} />
        ))}
        <rect x="0" y="0" width="50" height="55.5" fill="#0d5eaf" />
        <rect x="20" y="0" width="10" height="55.5" fill="#ffffff" />
        <rect x="0" y="22.7" width="50" height="10" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('korea')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#ffffff" />
        <circle cx="50" cy="50" r="24" fill="#003478" />
        <path d="M 26 50 A 24 24 0 0 1 74 50 A 12 12 0 0 1 50 50 A 12 12 0 0 0 26 50 Z" fill="#c60c30" />
        <circle cx="38" cy="50" r="12" fill="#c60c30" />
        <circle cx="62" cy="50" r="12" fill="#003478" />
      </svg>
    );
  }

  if (n.includes('egypt')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#ce1126" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#000000" />
        <circle cx="50" cy="50" r="7" fill="#c09300" />
      </svg>
    );
  }

  if (n.includes('norway')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#ba0c2f" />
        <rect x="26" y="0" width="22" height="100" fill="#ffffff" />
        <rect x="0" y="39" width="100" height="22" fill="#ffffff" />
        <rect x="31" y="0" width="12" height="100" fill="#00205b" />
        <rect x="0" y="44" width="100" height="12" fill="#00205b" />
      </svg>
    );
  }

  if (n.includes('finland')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#ffffff" />
        <rect x="28" y="0" width="18" height="100" fill="#002f6c" />
        <rect x="0" y="41" width="100" height="18" fill="#002f6c" />
      </svg>
    );
  }

  if (n.includes('argentina')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#74acdf" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#74acdf" />
        <circle cx="50" cy="50" r="8" fill="#f6b40e" />
      </svg>
    );
  }

  if (n.includes('ireland')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#169b62" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#ffffff" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#ff883e" />
      </svg>
    );
  }

  if (n.includes('portugal')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="40" height="100" fill="#006600" />
        <rect x="40" y="0" width="60" height="100" fill="#ff0000" />
        <circle cx="40" cy="50" r="14" fill="#ffcc00" stroke="#000" strokeWidth="1" />
        <circle cx="40" cy="50" r="8" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('belgium')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#000000" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#ffd90c" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#f31830" />
      </svg>
    );
  }

  if (n.includes('austria')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#ed2939" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#ed2939" />
      </svg>
    );
  }

  if (n.includes('denmark')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#c60c30" />
        <rect x="28" y="0" width="14" height="100" fill="#ffffff" />
        <rect x="0" y="43" width="100" height="14" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('singapore')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#ed2939" />
        <rect x="0" y="50" width="100" height="50" fill="#ffffff" />
        <circle cx="25" cy="25" r="12" fill="#ffffff" />
        <circle cx="28" cy="25" r="10" fill="#ed2939" />
        <circle cx="34" cy="18" r="2" fill="#ffffff" />
        <circle cx="38" cy="23" r="2" fill="#ffffff" />
        <circle cx="36" cy="29" r="2" fill="#ffffff" />
        <circle cx="30" cy="30" r="2" fill="#ffffff" />
        <circle cx="28" cy="22" r="2" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('vietnam')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#da251d" />
        <polygon points="50,18 58,42 82,42 62,56 70,80 50,65 30,80 38,56 18,42 42,42" fill="#ffff00" />
      </svg>
    );
  }

  if (n.includes('kazakh')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#00afca" />
        <circle cx="50" cy="45" r="14" fill="#fec50c" />
        <path d="M 32 68 Q 50 56 68 68 Q 50 63 32 68 Z" fill="#fec50c" />
        <rect x="0" y="0" width="12" height="100" fill="#fec50c" opacity="0.9" />
      </svg>
    );
  }

  if (n.includes('jamaica')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#009b3a" />
        <polygon points="0,0 50,50 0,100" fill="#000000" />
        <polygon points="100,0 50,50 100,100" fill="#000000" />
        <line x1="0" y1="0" x2="100" y2="100" stroke="#fed100" strokeWidth="14" />
        <line x1="100" y1="0" x2="0" y2="100" stroke="#fed100" strokeWidth="14" />
      </svg>
    );
  }

  if (n.includes('mongolia')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#da2032" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#005bae" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#da2032" />
        <circle cx="16" cy="35" r="4" fill="#ffd700" />
        <rect x="11" y="44" width="10" height="18" fill="#ffd700" />
      </svg>
    );
  }

  if (n.includes('philippine')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#0038a8" />
        <rect x="0" y="50" width="100" height="50" fill="#ce1126" />
        <polygon points="0,0 50,50 0,100" fill="#ffffff" />
        <circle cx="18" cy="50" r="7" fill="#fcd116" />
      </svg>
    );
  }

  if (n.includes('colombia')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#fcd116" />
        <rect x="0" y="50" width="100" height="25" fill="#003893" />
        <rect x="0" y="75" width="100" height="25" fill="#ce1126" />
      </svg>
    );
  }

  if (n.includes('peru')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="33.4" height="100" fill="#d91023" />
        <rect x="33.3" y="0" width="33.4" height="100" fill="#ffffff" />
        <rect x="66.6" y="0" width="33.4" height="100" fill="#d91023" />
      </svg>
    );
  }

  if (n.includes('chile')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="50" height="50" fill="#0039a6" />
        <rect x="50" y="0" width="50" height="50" fill="#ffffff" />
        <rect x="0" y="50" width="100" height="50" fill="#d52b1e" />
        <polygon points="25,12 28,21 37,21 30,26 33,35 25,30 17,35 20,26 13,21 22,21" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('czech')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#ffffff" />
        <rect x="0" y="50" width="100" height="50" fill="#d7141a" />
        <polygon points="0,0 50,50 0,100" fill="#11457e" />
      </svg>
    );
  }

  if (n.includes('hungary')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="33.4" fill="#ce2939" />
        <rect x="0" y="33.3" width="100" height="33.4" fill="#ffffff" />
        <rect x="0" y="66.6" width="100" height="33.4" fill="#477050" />
      </svg>
    );
  }

  if (n.includes('thailand')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="16.6" fill="#a51931" />
        <rect x="0" y="16.6" width="100" height="16.6" fill="#f4f5f8" />
        <rect x="0" y="33.2" width="100" height="33.6" fill="#2d2a4a" />
        <rect x="0" y="66.8" width="100" height="16.6" fill="#f4f5f8" />
        <rect x="0" y="83.4" width="100" height="16.6" fill="#a51931" />
      </svg>
    );
  }

  if (n.includes('south africa') || n.includes('southafrica')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect x="0" y="0" width="100" height="50" fill="#e03c31" />
        <rect x="0" y="50" width="100" height="50" fill="#001489" />
        <polygon points="0,0 45,50 0,100" fill="#000000" />
        <polygon points="0,10 40,50 0,90" fill="#ffb612" />
        <polygon points="0,15 35,50 0,85" fill="#000000" />
        <path d="M 0 35 L 45 35 L 75 0 L 100 0 L 100 20 L 70 50 L 100 80 L 100 100 L 75 100 L 45 65 L 0 65 Z" fill="#ffffff" />
        <path d="M 0 40 L 48 40 L 80 0 L 95 0 L 65 47 L 95 95 L 80 95 L 48 60 L 0 60 Z" fill="#007749" />
      </svg>
    );
  }

  if (n.includes('saudi')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#165b33" />
        <line x1="20" y1="62" x2="80" y2="62" stroke="#ffffff" strokeWidth="4" />
        <polygon points="76,58 84,62 76,66" fill="#ffffff" />
        <rect x="25" y="38" width="50" height="6" fill="#ffffff" />
      </svg>
    );
  }

  if (n.includes('iceland')) {
    return (
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#02529c" />
        <rect x="26" y="0" width="22" height="100" fill="#ffffff" />
        <rect x="0" y="39" width="100" height="22" fill="#ffffff" />
        <rect x="31" y="0" width="12" height="100" fill="#dc1e35" />
        <rect x="0" y="44" width="100" height="12" fill="#dc1e35" />
      </svg>
    );
  }

  // Fallback gradient/color
  return (
    <div 
      className="w-full h-full" 
      style={{ 
        background: flag || color || '#dc2626',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} 
    />
  );
}

/* ==========================================================
   COUNTRYBALL AVATAR (AUTHENTIC POLANDBALL WITH WHITE EYES & PROPS)
========================================================== */
function CountryballAvatar({
  character,
  isWalking,
  heldItem,
}: {
  character: CharacterData;
  isWalking: boolean;
  heldItem?: string;
}) {
  const itemIcon = getHeldItemIcon(heldItem);
  const nameLower = (character.name || '').toLowerCase();

  // Characteristic countryball props & lore flags
  const isPoland = nameLower.includes('poland');
  const isUSA = nameLower.includes('usa') || nameLower.includes('america');
  const isUK = nameLower.includes('uk') || nameLower.includes('britain');
  const isRussia = nameLower.includes('russia');
  const isFrance = nameLower.includes('france');
  const isJapan = nameLower.includes('japan');
  const isGermany = nameLower.includes('germany');
  const isCanada = nameLower.includes('canada');
  const isMexico = nameLower.includes('mexico');
  const isItaly = nameLower.includes('italy');
  const isBrazil = nameLower.includes('brazil');
  const isAustralia = nameLower.includes('australia');
  const isSweden = nameLower.includes('sweden');
  const isNetherlands = nameLower.includes('netherland') || nameLower.includes('dutch');

  return (
    <div 
      className={`relative flex flex-col items-center drop-shadow-xl ${
        isWalking ? 'animate-cb-squish' : 'animate-cb-wobble'
      }`}
    >
      {/* ================= ICONIC PROPS & HEADWEAR ================= */}

      {/* Poland: The Legendary Plunger Stuck on Head */}
      {isPoland && (
        <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 animate-plunger-wobble origin-bottom pointer-events-none">
          {/* Wood Plunger Handle */}
          <div className="w-1.5 h-6 bg-amber-700 border border-amber-900 rounded-t-xs shadow" />
          {/* Red Rubber Suction Cup */}
          <div className="w-5 h-2.5 bg-red-600 border border-red-950 rounded-t-full shadow-md -mt-0.5" />
          <div className="w-6 h-1 bg-red-700 border-b border-red-950 rounded-b-sm" />
        </div>
      )}

      {/* UK: Aristocratic Victorian Top Hat */}
      {isUK && (
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-6 h-5.5 bg-neutral-900 border border-neutral-700 rounded-t-xs relative shadow">
            {/* Crimson Silk Ribbon */}
            <div className="absolute bottom-0 w-full h-1.5 bg-red-600 border-t border-red-400" />
          </div>
          {/* Hat Brim */}
          <div className="w-9 h-1.5 bg-neutral-950 rounded-full shadow" />
        </div>
      )}

      {/* Russia: Furry Winter Ushanka Hat with Red Star */}
      {isRussia && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-11 h-4 bg-stone-700 border-2 border-stone-900 rounded-t-lg flex items-center justify-center shadow">
            <span className="text-[8px] text-red-500 font-black drop-shadow">★</span>
          </div>
          <div className="flex justify-between w-13 -mt-1 px-0.5">
            <div className="w-3 h-3.5 bg-stone-800 rounded-b-sm border border-stone-900 shadow" />
            <div className="w-3 h-3.5 bg-stone-800 rounded-b-sm border border-stone-900 shadow" />
          </div>
        </div>
      )}

      {/* France: Tilted Artist Beret */}
      {isFrance && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none -rotate-12">
          {/* Beret Stem */}
          <div className="w-1 h-1.5 bg-neutral-900" />
          {/* Beret Cap */}
          <div className="w-9 h-3 bg-neutral-900 border border-neutral-700 rounded-full shadow" />
        </div>
      )}

      {/* Japan: Cute Anime Nekomimi Cat Ears */}
      {isJapan && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex justify-between w-9 z-20 pointer-events-none">
          {/* Left Cat Ear */}
          <div className="w-3 h-3.5 bg-white border border-black rounded-tl-full flex items-end justify-center pb-0.5 shadow">
            <div className="w-1.5 h-2 bg-pink-300 rounded-tl-full" />
          </div>
          {/* Right Cat Ear */}
          <div className="w-3 h-3.5 bg-white border border-black rounded-tr-full flex items-end justify-center pb-0.5 shadow">
            <div className="w-1.5 h-2 bg-pink-300 rounded-tr-full" />
          </div>
        </div>
      )}

      {/* Germany: Engineer Safety Hardhat / Pickelhaube Brass Spike */}
      {isGermany && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-1.5 h-2 bg-yellow-500 border border-yellow-700 rounded-t-full" />
          <div className="w-9 h-2.5 bg-amber-500 border border-amber-800 rounded-t-full shadow" />
        </div>
      )}

      {/* Canada: Lumberjack Trapper Hat */}
      {isCanada && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-10 h-3.5 bg-amber-900 border-2 border-stone-900 rounded-t-lg flex items-center justify-center shadow">
            <span className="text-[7px] text-red-400">🍁</span>
          </div>
          <div className="flex justify-between w-12 -mt-1">
            <div className="w-2.5 h-3 bg-amber-950 rounded-b-sm border border-black" />
            <div className="w-2.5 h-3 bg-amber-950 rounded-b-sm border border-black" />
          </div>
        </div>
      )}

      {/* Mexico: Festive Woven Sombrero */}
      {isMexico && (
        <div className="absolute -top-4.5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-4 h-3 bg-yellow-600 border border-yellow-800 rounded-t-md" />
          <div className="w-12 h-2 bg-yellow-500 border-2 border-yellow-800 rounded-full shadow -mt-0.5 flex items-center justify-center">
            <div className="w-8 h-0.5 bg-red-600 rounded-full" />
          </div>
        </div>
      )}

      {/* Italy: Chef Toque Hat */}
      {isItaly && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-7 h-4 bg-white border border-stone-400 rounded-t-lg shadow" />
          <div className="w-8 h-1.5 bg-stone-100 border border-stone-400 rounded-xs -mt-0.5" />
        </div>
      )}

      {/* Brazil: Vibrant Carnival Samba Plumes */}
      {isBrazil && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20 pointer-events-none">
          <div className="w-1.5 h-4 bg-yellow-400 border border-black rounded-t-full transform -rotate-15" />
          <div className="w-1.5 h-5 bg-green-500 border border-black rounded-t-full transform -rotate-0" />
          <div className="w-1.5 h-4 bg-blue-500 border border-black rounded-t-full transform rotate-15" />
        </div>
      )}

      {/* USA: Aviator Sunglasses (perched above or stylishly worn) */}
      {isUSA && (
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20 pointer-events-none">
          <div className="w-4 h-3 bg-neutral-950 border border-neutral-400 rounded-t-sm shadow-md relative overflow-hidden">
            {/* Glass Glare Reflection */}
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/70 rounded-full" />
          </div>
          <div className="w-1 h-0.5 bg-neutral-400 -mt-1" />
          <div className="w-4 h-3 bg-neutral-950 border border-neutral-400 rounded-t-sm shadow-md relative overflow-hidden">
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/70 rounded-full" />
          </div>
        </div>
      )}

      {/* Australia: Aussie Slouch Hat with Dangling Corks */}
      {isAustralia && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-20 pointer-events-none">
          <div className="w-8 h-3.5 bg-amber-800 border border-amber-950 rounded-t-lg shadow relative">
            <div className="absolute bottom-0 w-full h-1 bg-yellow-600" />
          </div>
          <div className="w-12 h-1.5 bg-amber-900 border border-amber-950 rounded-full -mt-0.5 shadow" />
          {/* Dangling Corks */}
          <div className="flex gap-2 -mt-0.5">
            <div className="w-1 h-2 bg-stone-300 border border-stone-800 rounded-xs" />
            <div className="w-1 h-2 bg-stone-300 border border-stone-800 rounded-xs" />
          </div>
        </div>
      )}

      {/* Sweden: Legendary Viking Horned Helmet */}
      {isSweden && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none">
          <div className="w-2.5 h-4 bg-stone-100 border border-stone-800 rounded-t-full transform -rotate-25 -mr-1 shadow" />
          <div className="w-8 h-3.5 bg-stone-400 border border-stone-700 rounded-t-full shadow" />
          <div className="w-2.5 h-4 bg-stone-100 border border-stone-800 rounded-t-full transform rotate-25 -ml-1 shadow" />
        </div>
      )}

      {/* Netherlands: Orange Tulip */}
      {isNetherlands && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center justify-center z-20 pointer-events-none drop-shadow">
          <span className="text-sm">🌷</span>
        </div>
      )}

      {/* ================= MAIN COUNTRYBALL SPHERE ================= */}
      <div 
        className="w-13 h-13 rounded-full border-[2.8px] border-black shadow-2xl relative overflow-hidden flex items-center justify-center select-none"
      >
        {/* Authentic Vector SVG Flag */}
        <div className="absolute inset-0 w-full h-full">
          <CountryballFlagSvg name={character.name} flag={character.flag} color={character.color} />
        </div>

        {/* 3D Spherical Volume Shading Overlay */}
        <div 
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 35% 25%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.06) 45%, rgba(0,0,0,0.18) 75%, rgba(0,0,0,0.52) 100%)',
          }}
        />

        {/* Countryball Eyes - 100% PURE WHITE (Authentic Polandball Canon: NO Pupils!) */}
        <div className="flex gap-2 z-10 -mt-0.5 items-center justify-center">
          {/* Left Eye: Pure Solid White Oval with Black Border, slight inward angle */}
          <div 
            className="w-4 h-5 bg-white border-[2.2px] border-black rounded-full -rotate-6 shadow-xs flex-shrink-0 animate-cb-blink"
            style={{ transformOrigin: 'center' }}
          />

          {/* Right Eye: Pure Solid White Oval with Black Border, slight inward angle */}
          <div className="relative flex-shrink-0">
            <div 
              className="w-4 h-5 bg-white border-[2.2px] border-black rounded-full rotate-6 shadow-xs animate-cb-blink"
              style={{ transformOrigin: 'center' }}
            />
            
            {/* UK Monocle Rim & Chain */}
            {isUK && (
              <div className="absolute -inset-0.5 border-2 border-amber-400 rounded-full pointer-events-none">
                <div className="absolute -bottom-1.5 -right-0.5 w-2 h-2 border-r-2 border-b-2 border-amber-400 rounded-br-full" />
              </div>
            )}
          </div>
        </div>

        {/* France or Mexico: Curled Cartoon Mustache */}
        {(isFrance || isMexico) && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-10 pointer-events-none">
            <div className="w-2.5 h-1 bg-neutral-950 rounded-l-full transform -rotate-12" />
            <div className="w-2.5 h-1 bg-neutral-950 rounded-r-full transform rotate-12" />
          </div>
        )}
      </div>

      {/* ================= HELD MINECRAFT TOOL / WEAPON ================= */}
      {itemIcon && (
        <div className="absolute -bottom-1 -right-3 z-30 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-stone-900/90 border border-stone-600 flex items-center justify-center shadow-lg text-sm filter drop-shadow animate-bounce">
            {itemIcon}
          </div>
        </div>
      )}

      {/* Subtle Extra Handheld Trinkets (Baguette for France, Tea for UK, Pizza for Italy, Ball for Brazil) */}
      {!itemIcon && isFrance && (
        <div className="absolute -bottom-0.5 -right-2 text-xs z-20 filter drop-shadow">
          🥖
        </div>
      )}
      {!itemIcon && isUK && (
        <div className="absolute -bottom-0.5 -right-2 text-xs z-20 filter drop-shadow">
          ☕
        </div>
      )}
      {!itemIcon && isItaly && (
        <div className="absolute -bottom-0.5 -right-2 text-xs z-20 filter drop-shadow">
          🍕
        </div>
      )}
      {!itemIcon && isBrazil && (
        <div className="absolute -bottom-0.5 -right-2 text-xs z-20 filter drop-shadow">
          ⚽
        </div>
      )}

      {/* Ground Polish Shadow */}
      <div className="w-11 h-2 bg-black/45 rounded-full blur-[1px] mt-1" />
    </div>
  );
}
