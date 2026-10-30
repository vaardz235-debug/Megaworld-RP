import React, { useState, useEffect } from 'react';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { 
  Play, Square, Shuffle, Trash2, Volume2, VolumeX, Disc3, 
  Flame, Skull, Plus, Headphones, Sparkles, Mic, Music2, Gauge
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export interface BeatCrewSlot {
  id: number;
  name: string;
  subtype?: string;
  category: 'beats' | 'effects' | 'melodies' | 'voices' | 'horror';
  loopTitle: string;
  muted?: boolean;
  solo?: boolean;
}

export const SPRUNKI_CANONICAL_ROSTER: {
  id: number;
  name: string;
  subtype: string;
  category: 'beats' | 'effects' | 'melodies' | 'voices' | 'horror';
  categoryLabel: string;
  itemNumber: number;
  loopTitle: string;
  color: string;
  tagColor: string;
  description: string;
  isHorror?: boolean;
}[] = [
  // --- BEATS (1-5) ---
  {
    id: 11,
    name: 'Oren',
    subtype: 'oren',
    category: 'beats',
    categoryLabel: 'Beat 1',
    itemNumber: 1,
    loopTitle: 'Lead Kick & Snare Beatbox',
    color: 'bg-orange-500',
    tagColor: 'border-orange-500 text-orange-400 bg-orange-950/60',
    description: 'Iconic orange beatboxer in ribbed knit beanie and DJ headphones dropping punchy kicks and crisp snare snaps.',
  },
  {
    id: 12,
    name: 'Raddy',
    subtype: 'raddy',
    category: 'beats',
    categoryLabel: 'Beat 2',
    itemNumber: 2,
    loopTitle: 'Heavy 808 Trap Sub-Drop',
    color: 'bg-red-600',
    tagColor: 'border-red-500 text-red-400 bg-red-950/60',
    description: 'Fiery crimson beatmaker with curved devil horns and sharp fang tooth delivering seismic sub-bass hits.',
  },
  {
    id: 71,
    name: 'Clukr',
    subtype: 'clukr',
    category: 'beats',
    categoryLabel: 'Beat 3',
    itemNumber: 3,
    loopTitle: 'Hyper Rooster Click Percussion',
    color: 'bg-sky-500',
    tagColor: 'border-sky-500 text-sky-400 bg-sky-950/60',
    description: 'Chaotic jittery rooster beatboxer with crazy googly eyes and eccentric 16th-note click percussion.',
  },
  {
    id: 31,
    name: 'Fun Bot',
    subtype: 'funbot',
    category: 'beats',
    categoryLabel: 'Beat 4',
    itemNumber: 4,
    loopTitle: '8-Bit Chiptune Matrix Arp',
    color: 'bg-slate-400',
    tagColor: 'border-slate-400 text-slate-300 bg-slate-900/60',
    description: 'Retro silver robot synthesizer with glowing cyan matrix LED visor and spring antenna generating electronic chip arps.',
  },
  {
    id: 13,
    name: 'Vineria',
    subtype: 'vineria',
    category: 'beats',
    categoryLabel: 'Beat 5',
    itemNumber: 5,
    loopTitle: 'Botanical Nature Triad Chimes',
    color: 'bg-green-600',
    tagColor: 'border-emerald-500 text-emerald-400 bg-emerald-950/60',
    description: 'Botanical rhythm singer crowned with curly leaf tendrils and blooming 5-petal pink flower ringing out woodland chimes.',
  },

  // --- EFFECTS (1-5) ---
  {
    id: 32,
    name: 'Gray',
    subtype: 'gray',
    category: 'effects',
    categoryLabel: 'Effect 1',
    itemNumber: 6,
    loopTitle: 'Cozy Lo-Fi Ambient Rhodes',
    color: 'bg-slate-600',
    tagColor: 'border-slate-500 text-slate-300 bg-slate-900/60',
    description: 'Cozy hoodie singer with cute animal ears humming mellow chillhop minor 7th ambient pads for relaxing vibes.',
  },
  {
    id: 73,
    name: 'Brud',
    subtype: 'brud',
    category: 'effects',
    categoryLabel: 'Effect 2',
    itemNumber: 7,
    loopTitle: 'Sleepy 808 Sub Yawn & Resonance',
    color: 'bg-amber-900',
    tagColor: 'border-amber-700 text-amber-300 bg-amber-950/60',
    description: 'Ultra-sleepy sloth wearing a striped nightcap and medical band-aid across the snout, humming cavernous 808 sub yawns.',
  },
  {
    id: 19,
    name: 'Garnold',
    subtype: 'garnold',
    category: 'effects',
    categoryLabel: 'Effect 3',
    itemNumber: 8,
    loopTitle: 'Gold Funk Resonant Wah Scratch',
    color: 'bg-yellow-400',
    tagColor: 'border-yellow-500 text-yellow-300 bg-yellow-950/60',
    description: 'Gold-plated funk DJ rocking sleek dark shades and headphones with resonant wah-wah vinyl scratches and bass chops.',
  },
  {
    id: 72,
    name: 'OWAKCX',
    subtype: 'owakcx',
    category: 'effects',
    categoryLabel: 'Effect 4',
    itemNumber: 9,
    loopTitle: 'Carnival Jester Boing & Bells',
    color: 'bg-fuchsia-600',
    tagColor: 'border-fuchsia-500 text-fuchsia-300 bg-fuchsia-950/60',
    description: 'Wild circus jester with spinning spiral eyes, red ball nose, and jingling brass bells bouncing on spring boings.',
  },
  {
    id: 34,
    name: 'Sky',
    subtype: 'sky',
    category: 'effects',
    categoryLabel: 'Effect 5',
    itemNumber: 10,
    loopTitle: 'Angelic Cloud Choir Shimmer',
    color: 'bg-cyan-500',
    tagColor: 'border-cyan-400 text-cyan-300 bg-cyan-950/60',
    description: 'Angelic cloud melody singer with a floating golden halo ring and fluffy white earmuffs cascading celestial chime harmonics.',
  },

  // --- MELODIES (1-5) ---
  {
    id: 37,
    name: 'Mr. Sun',
    subtype: 'mrsun',
    category: 'melodies',
    categoryLabel: 'Melody 1',
    itemNumber: 11,
    loopTitle: 'Tropical Calypso Steel Drums',
    color: 'bg-yellow-400',
    tagColor: 'border-yellow-400 text-yellow-300 bg-yellow-950/60',
    description: 'Radiant smiling golden sunshine mascot crowned with warm beams playing uplifting daytime tropical steel drums.',
  },
  {
    id: 33,
    name: 'Durple',
    subtype: 'durple',
    category: 'melodies',
    categoryLabel: 'Melody 2',
    itemNumber: 12,
    loopTitle: 'Dino Monster "Dur-ple" Chant',
    color: 'bg-purple-600',
    tagColor: 'border-purple-500 text-purple-300 bg-purple-950/60',
    description: 'Cheerful purple dino rhythm monster with lilac horns chanting deep, resonant cartoon vocal lines.',
  },
  {
    id: 38,
    name: 'Mr. Tree',
    subtype: 'mrtree',
    category: 'melodies',
    categoryLabel: 'Melody 3',
    itemNumber: 13,
    loopTitle: 'Ancient Woodland Timber Marimba',
    color: 'bg-emerald-700',
    tagColor: 'border-emerald-600 text-emerald-300 bg-emerald-950/60',
    description: 'Ancient woodland tree deity with oak twigs and rich subterranean roots striking deep hollow wooden percussion.',
  },
  {
    id: 79,
    name: 'Simon',
    subtype: 'simon',
    category: 'melodies',
    categoryLabel: 'Melody 4',
    itemNumber: 14,
    loopTitle: 'Sunny Whistle Flute Melody',
    color: 'bg-yellow-400',
    tagColor: 'border-yellow-400 text-yellow-300 bg-yellow-950/60',
    description: 'The cheerful sunny yellow boy with golden antennae whistling joyful melodies that brighten any world.',
  },
  {
    id: 36,
    name: 'Tunner',
    subtype: 'tunner',
    category: 'melodies',
    categoryLabel: 'Melody 5',
    itemNumber: 15,
    loopTitle: 'Smooth Jazz Upright Bass & Snaps',
    color: 'bg-amber-800',
    tagColor: 'border-amber-600 text-amber-300 bg-amber-950/60',
    description: 'Dapper jazz beatboxer sporting a vintage fedora and dark shades, walking a swinging upright acoustic bassline.',
  },

  // --- VOICES (1-5) ---
  {
    id: 75,
    name: 'Mr. Fun Computer',
    subtype: 'computer',
    category: 'voices',
    categoryLabel: 'Voice 1',
    itemNumber: 16,
    loopTitle: 'CRT Phosphor Vocoder Glitch',
    color: 'bg-slate-700',
    tagColor: 'border-emerald-500 text-emerald-300 bg-emerald-950/60',
    description: 'Vintage arcade CRT monitor head with green scanlines and retro 8-bit chip speech synthesis.',
  },
  {
    id: 39,
    name: 'Wenda',
    subtype: 'wenda',
    category: 'voices',
    categoryLabel: 'Voice 2',
    itemNumber: 17,
    loopTitle: 'High Feline Vocal Trills "Nya~"',
    color: 'bg-slate-100',
    tagColor: 'border-pink-400 text-pink-300 bg-pink-950/60',
    description: 'Playful white cat singer with cute kitty ears and pink whisker cheeks humming bright, catchy vocal runs.',
  },
  {
    id: 40,
    name: 'Pinki',
    subtype: 'pinki',
    category: 'voices',
    categoryLabel: 'Voice 3',
    itemNumber: 18,
    loopTitle: 'Bubblegum Pop Vocal Stabs',
    color: 'bg-pink-500',
    tagColor: 'border-pink-500 text-pink-300 bg-pink-950/60',
    description: 'Vibrant neon bubblegum popstar with a giant ribbon bow singing infectious high-energy pop choruses.',
  },
  {
    id: 44,
    name: 'Jevin',
    subtype: 'jevin',
    category: 'voices',
    categoryLabel: 'Voice 4',
    itemNumber: 19,
    loopTitle: 'Liquid Slime Bubble Percussion',
    color: 'bg-cyan-500',
    tagColor: 'border-cyan-500 text-cyan-300 bg-cyan-950/60',
    description: 'Aqua slime DJ sporting a dripping slime cap and dropping bubbling water drop percussive vocal blips.',
  },
  {
    id: 45,
    name: 'Black',
    subtype: 'black',
    category: 'voices',
    categoryLabel: 'Voice 5 · Horror Trigger',
    itemNumber: 20,
    loopTitle: 'Cosmic Void Sub Drone (Top Hat)',
    color: 'bg-neutral-950',
    tagColor: 'border-red-600 text-red-400 bg-red-950/80',
    description: 'The iconic void shadow wearing the legendary Black Top Hat with crimson ribbon. In the real Sprunki game, equipping this hat triggers Phase 2 Horror for the entire world!',
  },

  // --- HORROR SPECIALS ---
  {
    id: 35,
    name: 'Horror Simon (Phase 2)',
    subtype: 'horror',
    category: 'horror',
    categoryLabel: 'Phase 2 Cursed',
    itemNumber: 21,
    loopTitle: 'Abyssal Void Screech & Distortion',
    isHorror: true,
    color: 'bg-neutral-900',
    tagColor: 'border-red-700 text-red-300 bg-red-950/90',
    description: 'The infamous Creepypasta Phase 2 Sprunki with void body, glitching red pupils, and dark matter mist.',
  },
  {
    id: 78,
    name: 'Horror Black Void',
    subtype: 'black_void',
    category: 'horror',
    categoryLabel: 'Phase 2 Abyssal',
    itemNumber: 22,
    loopTitle: 'Seismic Sub-Bass Singularity',
    isHorror: true,
    color: 'bg-black',
    tagColor: 'border-red-800 text-red-400 bg-black',
    description: 'Terrifying 6-eyed abyssal entity with weeping blood tears and seismic subterranean void resonance.',
  },
];

export interface SprunkiBeatStudioProps {
  allCharacters: CharacterData[];
  onSelectCharacter?: (char: CharacterData) => void;
}

export default function SprunkiBeatStudio({ allCharacters, onSelectCharacter }: SprunkiBeatStudioProps) {
  // 7 Stage Slots for the live Incredibox beat crew
  const [stageCrew, setStageCrew] = useState<BeatCrewSlot[]>([
    { id: 11, name: 'Oren', subtype: 'oren', category: 'beats', loopTitle: 'Lead Kick & Snare Beatbox' },
    { id: 12, name: 'Raddy', subtype: 'raddy', category: 'beats', loopTitle: 'Heavy 808 Trap Sub-Drop' },
    { id: 31, name: 'Fun Bot', subtype: 'funbot', category: 'beats', loopTitle: '8-Bit Chiptune Matrix Arp' },
    { id: 32, name: 'Gray', subtype: 'gray', category: 'effects', loopTitle: 'Cozy Lo-Fi Ambient Rhodes' },
  ]);

  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpm] = useState(110);
  const [activeStep, setActiveStep] = useState(-1);
  const [isHorrorMode, setIsHorrorMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'beats' | 'effects' | 'melodies' | 'voices' | 'horror'>('all');
  const [draggedItem, setDraggedItem] = useState<any>(null);
  const [dragOverSlotIndex, setDragOverSlotIndex] = useState<number | null>(null);

  // Sync Audio Engine Jam step listener
  useEffect(() => {
    const unsub = audioEngine.onJamStep((step, currentBpm) => {
      setActiveStep(step);
      if (currentBpm && currentBpm !== bpm) {
        setBpm(currentBpm);
      }
    });
    return () => {
      unsub();
      audioEngine.stopSprunkiJam();
    };
  }, []);

  // Update audio engine settings when crew, horror mode, or BPM changes
  useEffect(() => {
    if (isPlaying) {
      audioEngine.updateSprunkiJamSettings(stageCrew, isHorrorMode, bpm);
    }
  }, [stageCrew, isHorrorMode, bpm, isPlaying]);

  const toggleMasterPlay = () => {
    if (isPlaying) {
      audioEngine.stopSprunkiJam();
      setIsPlaying(false);
      setActiveStep(-1);
    } else {
      if (stageCrew.length === 0) {
        // Seed default 3 members if empty
        const defaultSeed: BeatCrewSlot[] = [
          { id: 11, name: 'Oren', subtype: 'oren', category: 'beats', loopTitle: 'Lead Kick & Snare Beatbox' },
          { id: 12, name: 'Raddy', subtype: 'raddy', category: 'beats', loopTitle: 'Heavy 808 Trap Sub-Drop' },
          { id: 79, name: 'Simon', subtype: 'simon', category: 'melodies', loopTitle: 'Sunny Whistle Flute Melody' },
        ];
        setStageCrew(defaultSeed);
        audioEngine.startSprunkiJam(defaultSeed, isHorrorMode, bpm);
      } else {
        audioEngine.startSprunkiJam(stageCrew, isHorrorMode, bpm);
      }
      setIsPlaying(true);
    }
  };

  const handleAddMemberToSlot = (item: typeof SPRUNKI_CANONICAL_ROSTER[0], targetSlotIndex?: number) => {
    // If Black (the horror trigger) is dragged/deployed, toggle horror mode!
    if (item.name === 'Black' || item.name.includes('Horror')) {
      setIsHorrorMode(true);
    }

    setStageCrew(prev => {
      const existingIndex = prev.findIndex(m => m.id === item.id);
      let next = [...prev];

      const newSlot: BeatCrewSlot = {
        id: item.id,
        name: item.name,
        subtype: item.subtype,
        category: item.category,
        loopTitle: item.loopTitle,
        muted: false,
        solo: false,
      };

      if (targetSlotIndex !== undefined && targetSlotIndex < 7) {
        // Put in specific slot index
        if (existingIndex >= 0) {
          next.splice(existingIndex, 1);
        }
        if (targetSlotIndex < next.length) {
          next[targetSlotIndex] = newSlot;
        } else {
          next.push(newSlot);
        }
      } else {
        // Toggle or push
        if (existingIndex >= 0) {
          next.splice(existingIndex, 1);
        } else if (next.length < 7) {
          next.push(newSlot);
        }
      }
      return next.slice(0, 7);
    });

    // Auto-start play if not playing
    if (!isPlaying) {
      setIsPlaying(true);
      audioEngine.startSprunkiJam(stageCrew, isHorrorMode, bpm);
    }
  };

  const handleRemoveSlot = (index: number) => {
    setStageCrew(prev => prev.filter((_, i) => i !== index));
  };

  const handleToggleMute = (id: number) => {
    setStageCrew(prev => prev.map(m => m.id === id ? { ...m, muted: !m.muted } : m));
  };

  const handleToggleSolo = (id: number) => {
    setStageCrew(prev => prev.map(m => m.id === id ? { ...m, solo: !m.solo } : m));
  };

  const handleRandomize = () => {
    const pool = SPRUNKI_CANONICAL_ROSTER.filter(c => !c.isHorror);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4).map(c => ({
      id: c.id,
      name: c.name,
      subtype: c.subtype,
      category: c.category,
      loopTitle: c.loopTitle,
      muted: false,
      solo: false,
    }));
    setStageCrew(selected);
    if (isPlaying) {
      audioEngine.startSprunkiJam(selected, isHorrorMode, bpm);
    }
  };

  const handleClear = () => {
    setStageCrew([]);
    if (isPlaying) {
      audioEngine.stopSprunkiJam();
      setIsPlaying(false);
      setActiveStep(-1);
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, item: typeof SPRUNKI_CANONICAL_ROSTER[0]) => {
    setDraggedItem(item);
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDragOver = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlotIndex(slotIndex);
  };

  const handleDragLeave = () => {
    setDragOverSlotIndex(null);
  };

  const handleDrop = (e: React.DragEvent, slotIndex: number) => {
    e.preventDefault();
    setDragOverSlotIndex(null);
    let item = draggedItem;
    if (!item) {
      try {
        const raw = e.dataTransfer.getData('text/plain');
        item = JSON.parse(raw);
      } catch {
        // ignore
      }
    }
    if (item) {
      handleAddMemberToSlot(item, slotIndex);
    }
    setDraggedItem(null);
  };

  // Filtered Roster
  const filteredRoster = SPRUNKI_CANONICAL_ROSTER.filter(item => {
    if (selectedCategory === 'all') return true;
    return item.category === selectedCategory;
  });

  return (
    <div className={`mt-6 p-4 sm:p-6 rounded-3xl border shadow-2xl relative overflow-hidden backdrop-blur font-mono transition-colors duration-500 ${
      isHorrorMode 
        ? 'bg-neutral-950/95 border-red-700/60 shadow-[0_0_50px_rgba(220,38,38,0.25)]' 
        : 'bg-stone-900/95 border-orange-500/40 shadow-2xl'
    }`}>
      {/* Background Ambience Shimmer */}
      <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-20 -mr-20 -mt-20 ${
        isHorrorMode ? 'bg-red-600' : 'bg-orange-500'
      }`} />

      {/* ================= HEADER CONTROLS ================= */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 border-b border-stone-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-2xl transition shadow-lg ${
            isPlaying 
              ? isHorrorMode ? 'bg-red-600 text-white animate-pulse' : 'bg-orange-500 text-black animate-pulse'
              : 'bg-stone-800 text-stone-300'
          }`}>
            <Disc3 size={24} className={isPlaying ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                Sprunki Incredibox Live Beat Studio
              </h2>
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                isHorrorMode 
                  ? 'bg-red-950 text-red-300 border-red-600 shadow-[0_0_8px_#ef4444]' 
                  : 'bg-orange-500/20 text-orange-300 border-orange-500/40'
              }`}>
                {isHorrorMode ? 'Phase 2 Horror Active' : '7-Track Synchronized Stage'}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              Drag characters onto the stage podiums or click below to build your custom rhythmic beatbox groove!
            </p>
          </div>
        </div>

        {/* Master Control Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Play / Stop Master */}
          <button
            type="button"
            onClick={toggleMasterPlay}
            className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer shadow-lg transition active:scale-95 ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-950/50'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
            }`}
          >
            {isPlaying ? (
              <>
                <Square size={14} className="fill-white" />
                <span>STOP BEAT</span>
              </>
            ) : (
              <>
                <Play size={14} className="fill-white" />
                <span>PLAY STAGE BEAT</span>
              </>
            )}
          </button>

          {/* Randomize Stage */}
          <button
            type="button"
            onClick={handleRandomize}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 cursor-pointer transition shadow"
            title="Randomize crew members"
          >
            <Shuffle size={13} className="text-amber-400" />
            <span>Random</span>
          </button>

          {/* Clear Stage */}
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl text-stone-400 hover:text-red-400 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 cursor-pointer transition shadow"
            title="Clear all 7 stage slots"
          >
            <Trash2 size={16} />
          </button>

          {/* Canonical Phase 2 Horror Toggle (The Black Top Hat Effect) */}
          <button
            type="button"
            onClick={() => setIsHorrorMode(prev => !prev)}
            className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              isHorrorMode
                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)] animate-pulse'
                : 'bg-stone-800 hover:bg-stone-750 text-stone-300 border-stone-700'
            }`}
            title="Toggle Phase 2 Horror mode (triggered by the Black Top Hat in the real game!)"
          >
            {isHorrorMode ? (
              <>
                <Skull size={14} className="text-white" />
                <span>Phase 2 (Horror) ON</span>
              </>
            ) : (
              <>
                <Flame size={14} className="text-orange-400" />
                <span>Phase 2 (Horror) OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ================= 16-STEP MASTER CLOCK VISUALIZER ================= */}
      <div className="mb-5 bg-stone-950/70 p-2.5 rounded-2xl border border-stone-800/80">
        <div className="flex items-center justify-between gap-1 mb-1.5 px-1 text-[10px] text-stone-500 font-bold">
          <span>STEP SEQUENCER CLOCK</span>
          <span className="text-orange-400">{bpm} BPM · 16th NOTE GRID</span>
        </div>
        <div className="flex items-center justify-between gap-1">
          {[...Array(16)].map((_, i) => (
            <div
              key={i}
              className={`h-2.5 flex-1 rounded-sm transition-all duration-75 ${
                activeStep === i 
                  ? (isHorrorMode ? 'bg-red-500 scale-y-200 shadow-[0_0_8px_#ef4444]' : 'bg-orange-400 scale-y-200 shadow-[0_0_8px_#fb923c]')
                  : (i % 4 === 0 ? 'bg-stone-600' : 'bg-stone-800')
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= 7 STAGE PODIUM SLOTS (THE LIVE BEAT STAGE) ================= */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
            <Headphones size={13} className="text-orange-400" />
            <span>LIVE STAGE PODIUMS (UP TO 7 SLOTS)</span>
          </span>
          <span className="text-[11px] text-stone-500">
            {stageCrew.length}/7 active performers
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[...Array(7)].map((_, idx) => {
            const member = stageCrew[idx];
            const fullChar = member ? allCharacters.find(c => c.id === member.id) : null;
            const isHoveredTarget = dragOverSlotIndex === idx;

            if (!member || !fullChar) {
              return (
                <div
                  key={idx}
                  onDragOver={(e) => handleDragOver(e, idx)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, idx)}
                  className={`border-2 border-dashed rounded-2xl p-3 flex flex-col items-center justify-center min-h-[160px] text-stone-600 font-mono text-xs gap-1.5 transition-all duration-200 ${
                    isHoveredTarget 
                      ? 'border-orange-400 bg-orange-500/10 scale-102 shadow-[0_0_15px_rgba(249,115,22,0.3)]' 
                      : 'border-stone-800 bg-stone-950/40 hover:border-stone-700'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center">
                    <Plus size={16} className={isHoveredTarget ? 'text-orange-400 animate-bounce' : 'text-stone-600'} />
                  </div>
                  <span className="font-bold text-stone-400">Podium {idx + 1}</span>
                  <span className="text-[10px] text-stone-500 text-center leading-tight">
                    Drop Sprunki Here
                  </span>
                </div>
              );
            }

            const isSoundingNow = isPlaying && !member.muted && (activeStep % 2 === 0);

            return (
              <div
                key={`${member.id}-${idx}`}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, idx)}
                className={`rounded-2xl p-3 flex flex-col items-center justify-between relative border transition-all duration-200 min-h-[160px] shadow-lg group ${
                  member.muted 
                    ? 'bg-stone-950/60 border-stone-800 opacity-50' 
                    : member.solo
                    ? 'bg-amber-950/40 border-amber-500 shadow-amber-950/40 ring-2 ring-amber-500/50'
                    : isHorrorMode
                    ? 'bg-red-950/50 border-red-800 shadow-[0_0_15px_rgba(220,38,38,0.2)]'
                    : 'bg-stone-950 border-orange-500/40 shadow-orange-950/20'
                }`}
              >
                {/* Top Control Bar: Mute, Solo & Remove */}
                <div className="w-full flex items-center justify-between z-20">
                  <div className="flex items-center gap-1">
                    {/* Mute Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleMute(member.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black cursor-pointer transition ${
                        member.muted 
                          ? 'bg-red-600 text-white' 
                          : 'bg-stone-800 text-stone-300 hover:text-white'
                      }`}
                      title={member.muted ? 'Unmute (M)' : 'Mute Track (M)'}
                    >
                      M
                    </button>

                    {/* Solo Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleSolo(member.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-black cursor-pointer transition ${
                        member.solo 
                          ? 'bg-amber-500 text-black font-black' 
                          : 'bg-stone-800 text-stone-300 hover:text-amber-400'
                      }`}
                      title={member.solo ? 'Disable Solo (S)' : 'Solo Track (S)'}
                    >
                      S
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveSlot(idx)}
                    className="w-5 h-5 rounded-full bg-stone-900 hover:bg-red-600 text-stone-400 hover:text-white flex items-center justify-center text-xs font-bold transition cursor-pointer"
                    title="Remove from stage"
                  >
                    ×
                  </button>
                </div>

                {/* Animated Sprunki Avatar on Stage */}
                <div className={`my-2 transition-transform duration-100 ${
                  isSoundingNow ? 'scale-105' : 'scale-95'
                }`}>
                  <CharacterAvatar
                    character={{
                      ...fullChar,
                      isHorror: isHorrorMode || fullChar.isHorror
                    }}
                    size="sm"
                    isWalking={isPlaying && !member.muted}
                  />
                </div>

                {/* Podium Floor Base & Audio Wave Indicator */}
                <div className="w-full text-center">
                  <div className={`h-1.5 w-full rounded-full mb-1.5 transition-all duration-75 ${
                    isSoundingNow
                      ? isHorrorMode ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' : 'bg-orange-400 shadow-[0_0_8px_#fb923c]'
                      : 'bg-stone-800'
                  }`} />
                  <p className="text-xs font-black text-white truncate px-1">
                    {member.name}
                  </p>
                  <p className="text-[9px] text-stone-400 truncate">
                    {member.loopTitle.split(':')[1]?.trim() || member.loopTitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= MASTER TEMPO & BPM CONTROLS ================= */}
      <div className="p-3 sm:p-4 rounded-2xl bg-stone-950/80 border border-stone-800 mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Tempo Slider */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
            <Gauge size={18} />
          </div>
          <div>
            <span className="text-[11px] text-stone-400 font-bold block">
              MASTER TEMPO / BPM CONTROL
            </span>
            <div className="flex items-center gap-3 mt-1">
              <input
                type="range"
                min="60"
                max="160"
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
                className="w-32 sm:w-48 accent-orange-500 cursor-pointer"
              />
              <span className="text-sm font-black text-orange-400 min-w-[65px]">
                {bpm} BPM
              </span>
            </div>
          </div>
        </div>

        {/* Quick Tempo Presets */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-stone-500 mr-1">Presets:</span>
          {[
            { label: '80 Half-Time', val: 80 },
            { label: '110 Groove', val: 110 },
            { label: '128 House', val: 128 },
            { label: '145 Turbo', val: 145 },
          ].map(p => (
            <button
              key={p.val}
              type="button"
              onClick={() => setBpm(p.val)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer border ${
                bpm === p.val 
                  ? 'bg-orange-500 text-black border-orange-400 font-black' 
                  : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= SPRUNKI IN-GAME ROSTER BAR (DRAGGABLE SOUND PACKS) ================= */}
      <div className="text-left">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3 border-b border-stone-800 pb-2">
          <div>
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Music2 size={16} className="text-orange-400" />
              <span>Canonical Incredibox Sound Roster</span>
            </h3>
            <p className="text-[11px] text-stone-400">
              Drag any character icon onto an empty stage podium above, or click "Deploy" to add them to your live jam!
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: 'All (22)' },
              { id: 'beats', label: '🥁 Beats' },
              { id: 'effects', label: '✨ Effects' },
              { id: 'melodies', label: '🎼 Melodies' },
              { id: 'voices', label: '🎤 Voices' },
              { id: 'horror', label: '💀 Horror Phase 2' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer border whitespace-nowrap ${
                  selectedCategory === cat.id 
                    ? 'bg-orange-500 text-black border-orange-400 shadow-md font-black' 
                    : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Draggable Roster Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredRoster.map(item => {
            const isAlreadyOnStage = stageCrew.some(m => m.id === item.id);
            const fullChar = allCharacters.find(c => c.id === item.id) || {
              id: item.id,
              name: item.name,
              type: 'sprnuki' as const,
              subtype: item.subtype,
              color: item.color,
              isHorror: isHorrorMode || item.isHorror,
              description: item.description,
            };

            return (
              <div
                key={item.id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, item)}
                className={`p-3 rounded-2xl border transition-all duration-200 cursor-grab active:cursor-grabbing flex flex-col justify-between select-none relative overflow-hidden group ${
                  isAlreadyOnStage
                    ? 'bg-stone-900 border-orange-500/50 shadow-md ring-1 ring-orange-500/30'
                    : 'bg-stone-950/80 border-stone-800 hover:border-orange-500/40 hover:bg-stone-900'
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                    {item.categoryLabel}
                  </span>
                  <span className="text-[10px] text-stone-500 font-bold">
                    #{item.itemNumber}
                  </span>
                </div>

                {/* Character Avatar & Preview */}
                <div className="flex items-center gap-3 my-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-stone-900 rounded-xl border border-stone-800 shrink-0">
                    <CharacterAvatar
                      character={{
                        ...fullChar,
                        isHorror: isHorrorMode || item.isHorror,
                      }}
                      size="sm"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-black text-white group-hover:text-orange-400 transition truncate">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-orange-300/90 font-medium truncate">
                      {item.loopTitle}
                    </p>
                    <p className="text-[9px] text-stone-500 line-clamp-1 mt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Action Row */}
                <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-850">
                  {/* Solo Sample Test */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playSprunkiSound(item.name, isHorrorMode || item.isHorror);
                    }}
                    className="flex-1 py-1 px-2 rounded-lg bg-stone-800 hover:bg-stone-750 text-stone-200 text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer"
                    title="Preview this sound loop"
                  >
                    <Volume2 size={11} className="text-orange-400" />
                    <span>Solo Sample</span>
                  </button>

                  {/* Deploy to Stage Button */}
                  <button
                    type="button"
                    onClick={() => handleAddMemberToSlot(item)}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition cursor-pointer ${
                      isAlreadyOnStage
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                        : 'bg-orange-600 hover:bg-orange-500 text-white font-black'
                    }`}
                  >
                    <Plus size={11} />
                    <span>{isAlreadyOnStage ? 'On Stage' : 'Deploy'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
