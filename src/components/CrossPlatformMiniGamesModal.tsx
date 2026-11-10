import React, { useState, useEffect } from 'react';
import { 
  X, Gamepad2, Trophy, Clock, Compass, Sparkles, 
  Award, Play, RotateCcw, CheckCircle2, AlertCircle, 
  Flame, Zap, Target, Search, Heart, Star
} from 'lucide-react';
import { avatarManager } from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';

interface CrossPlatformMiniGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

// ================= SCAVENGER RELICS =================
interface ScavengerRelic {
  id: string;
  name: string;
  brand: string;
  icon: string;
  clue: string;
  locationBiome: string;
  distanceMeters: number;
  rewardCoins: number;
  rewardRobux: number;
  found: boolean;
}

const INITIAL_RELICS: ScavengerRelic[] = [
  {
    id: 'relic_spatula',
    name: 'The Golden Master Spatula',
    brand: 'McDonald\'s',
    icon: '🍳',
    clue: 'Hidden beneath the golden neon archways where sizzling gourmet banquets are cooked for weary adventurers.',
    locationBiome: 'Golden Arches Megacity Food Court',
    distanceMeters: 45,
    rewardCoins: 220,
    rewardRobux: 40,
    found: false,
  },
  {
    id: 'relic_lego_separator',
    name: 'The Master Orange Brick Separator',
    brand: 'LEGO',
    icon: '🧱',
    clue: 'Lost near the giant snap-together brick pit where master builders construct towering modular castles.',
    locationBiome: 'LEGO Master Builder Brick Plaza',
    distanceMeters: 80,
    rewardCoins: 260,
    rewardRobux: 50,
    found: false,
  },
  {
    id: 'relic_netherite_core',
    name: 'Ancient Netherite Resonator Shard',
    brand: 'Minecraft',
    icon: '👾',
    clue: 'Vibrating softly in deep dark subterranean caverns where sculk tendrils detect silent footsteps.',
    locationBiome: 'Deep Dark Obsidian Cavern',
    distanceMeters: 130,
    rewardCoins: 300,
    rewardRobux: 60,
    found: false,
  },
  {
    id: 'relic_pounamu',
    name: 'Sacred Waitangi Pounamu Jade Taonga',
    brand: 'NZ',
    icon: '🟢',
    clue: 'Resting beside the sacred mountain awa river, blessed by ancestral Polynesian celestial navigators.',
    locationBiome: 'Waitangi Coastal Haven & Starlight Grove',
    distanceMeters: 65,
    rewardCoins: 240,
    rewardRobux: 45,
    found: false,
  },
  {
    id: 'relic_solar_core',
    name: 'BP Photovoltaic Bio-Cell Overcharger',
    brand: 'BP',
    icon: '⚡',
    clue: 'Mounted high atop a solar tracking array capturing the zenith sun rays over the desert plateau.',
    locationBiome: 'Helios Clean Energy Eco-Pavilion',
    distanceMeters: 110,
    rewardCoins: 250,
    rewardRobux: 45,
    found: false,
  },
  {
    id: 'relic_slapstick_mallet',
    name: 'Oggy\'s 10-Ton Squeak Cartoon Mallet',
    brand: 'Xilam',
    icon: '🔨',
    clue: 'Tucked behind a giant double-door refrigerator where three mischievous cockroaches love to cause chaos.',
    locationBiome: 'Suburban Slapstick Cartoon Villa',
    distanceMeters: 95,
    rewardCoins: 210,
    rewardRobux: 35,
    found: false,
  }
];

// ================= TRIVIA QUESTIONS =================
interface TriviaQuestion {
  question: string;
  brand: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    question: 'According to Polandball rules and meme canon, what is unique about Poland\'s flag colors?',
    brand: 'Countryballs',
    options: ['It is printed upside-down with red on top', 'It has a neon green border', 'It has a mustache in the center', 'It must always be drawn with a ruler'],
    correctIndex: 0,
    explanation: 'Canon Polandball rules dictate Poland’s flag is drawn inverted (red on top, white on bottom) and drawn freehand with no circle tool!'
  },
  {
    question: 'In Minecraft, what is the only pickaxe material capable of harvesting Obsidian without destroying it?',
    brand: 'Minecraft',
    options: ['Gold Pickaxe', 'Diamond or Netherite Pickaxe', 'Iron Pickaxe', 'Copper Pickaxe'],
    correctIndex: 1,
    explanation: 'Obsidian has a high hardness tier and can only be harvested with Diamond or Netherite pickaxes.'
  },
  {
    question: 'In classic 2006 Roblox Crossroads, which weapon produces the iconic prismatic chime when swung?',
    brand: 'Roblox',
    options: ['Rocket Launcher', 'Paintball Gun', 'Illumina Linked Sword', 'Superball'],
    correctIndex: 2,
    explanation: 'The Illumina sword radiates pure light and emits a distinct chime from Sword Fights on the Heights (SFOTH).'
  },
  {
    question: 'What iconic year did the classic yellow LEGO® Minifigure make its worldwide debut?',
    brand: 'LEGO',
    options: ['1958', '1978', '1995', '2001'],
    correctIndex: 1,
    explanation: 'The classic yellow LEGO Minifigure with movable arms and legs debuted in 1978 across Castle, Space, and Town sets.'
  },
  {
    question: 'What is the signature renewable technology developed at the BP Helios Eco-Station in MegaWorld?',
    brand: 'BP',
    options: ['High-efficiency Photovoltaic Bio-Fuel Cells', 'Coal Furnaces', 'Diesel Generators', 'Wood Smelters'],
    correctIndex: 0,
    explanation: 'The Helios station develops clean bio-solar photovoltaic cells that convert sunlight into zero-emission minecart propulsion.'
  },
  {
    question: 'In New World Aeternum lore, what is the mysterious blue supernatural substance used for fast travel and crafting?',
    brand: 'New World',
    options: ['Redstone', 'Azoth', 'Vibranium', 'Mithril'],
    correctIndex: 1,
    explanation: 'Azoth is the glowing blue ethereal lifeblood of Aeternum, used for fast travel, refining, and enchanting weapons.'
  },
  {
    question: 'What is the name of the high-speed blue locomotive on Sodor numbered #1?',
    brand: 'Thomas & Friends',
    options: ['Percy', 'Gordon', 'Thomas the Tank Engine', 'James'],
    correctIndex: 2,
    explanation: 'Thomas is the iconic Really Useful Engine numbered 1 with six small wheels and a blue coat.'
  },
  {
    question: 'In Xilam’s Oggy and the Cockroaches, what are the names of the three pesky cockroaches?',
    brand: 'Xilam',
    options: ['Snap, Crackle & Pop', 'Joey, Dee Dee & Marky', 'Ed, Edd & Eddy', 'Mickey, Donald & Goofy'],
    correctIndex: 1,
    explanation: 'Joey (the leader), Dee Dee (the hungry one), and Marky (the tall one) were named after members of the Ramones punk band.'
  }
];

export default function CrossPlatformMiniGamesModal({
  isOpen,
  onClose,
  user,
}: CrossPlatformMiniGamesModalProps) {
  const [activeTab, setActiveTab] = useState<'scavenger' | 'trivia' | 'race' | 'leaderboard'>('scavenger');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Scavenger Hunt State
  const [relics, setRelics] = useState<ScavengerRelic[]>(INITIAL_RELICS);
  const [playerDistance, setPlayerDistance] = useState<number>(45);

  // Trivia Challenge State
  const [currentTriviaIdx, setCurrentTriviaIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [triviaScore, setTriviaScore] = useState<number>(0);
  const [triviaStreak, setTriviaStreak] = useState<number>(0);
  const [triviaAnswered, setTriviaAnswered] = useState<boolean>(false);
  const [triviaTimer, setTriviaTimer] = useState<number>(15);

  // Resource Race State
  const [raceActive, setRaceActive] = useState<boolean>(false);
  const [raceTimeLeft, setRaceTimeLeft] = useState<number>(30);
  const [raceScore, setRaceScore] = useState<number>(0);
  const [resourceGrid, setResourceGrid] = useState<{ id: number; type: string; points: number; icon: string }[]>([]);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // ================= SCAVENGER EXCAVATION =================
  const handleExcavateRelic = (relicId: string) => {
    setRelics(prev =>
      prev.map(r => {
        if (r.id !== relicId) return r;
        audioEngine.playMinecraftSound('levelup');
        avatarManager.addCurrency(r.rewardCoins, r.rewardRobux);
        showToast(`🎉 Excavated "${r.name}"! Gained +${r.rewardCoins} Coins & +${r.rewardRobux} Robux!`);
        return { ...r, found: true, distanceMeters: 0 };
      })
    );
  };

  // ================= TRIVIA HANDLER =================
  const handleSelectTriviaAnswer = (optionIdx: number) => {
    if (triviaAnswered) return;
    setSelectedOption(optionIdx);
    setTriviaAnswered(true);

    const q = TRIVIA_QUESTIONS[currentTriviaIdx];
    const isCorrect = optionIdx === q.correctIndex;

    if (isCorrect) {
      audioEngine.playMinecraftSound('levelup');
      const earnedCoins = 50 + triviaStreak * 15;
      avatarManager.addCurrency(earnedCoins, 5);
      setTriviaScore(prev => prev + 100);
      setTriviaStreak(prev => prev + 1);
      showToast(`✅ Correct! +${earnedCoins} Coins & Streak x${triviaStreak + 1}!`);
    } else {
      audioEngine.playMinecraftSound('anvil');
      setTriviaStreak(0);
      showToast(`❌ Incorrect! ${q.explanation}`);
    }
  };

  const handleNextTriviaQuestion = () => {
    audioEngine.playMinecraftSound('click');
    setTriviaAnswered(false);
    setSelectedOption(null);
    setCurrentTriviaIdx((prev) => (prev + 1) % TRIVIA_QUESTIONS.length);
  };

  // ================= RESOURCE RACE =================
  const startResourceRace = () => {
    audioEngine.playMinecraftSound('levelup');
    setRaceActive(true);
    setRaceScore(0);
    setRaceTimeLeft(30);

    // Populate initial items
    spawnRaceResources();
  };

  const spawnRaceResources = () => {
    const resourceTypes = [
      { type: 'diamond', points: 15, icon: '💎' },
      { type: 'lego_brick', points: 12, icon: '🧱' },
      { type: 'fries', points: 10, icon: '🍟' },
      { type: 'solar_cell', points: 20, icon: '⚡' },
      { type: 'bloxy_cola', points: 8, icon: '🥤' },
      { type: 'pounamu', points: 25, icon: '🟢' },
      { type: 'bomb', points: -20, icon: '💣' },
    ];

    const newGrid = Array.from({ length: 12 }).map((_, i) => {
      const res = resourceTypes[Math.floor(Math.random() * resourceTypes.length)];
      return { id: i, ...res };
    });
    setResourceGrid(newGrid);
  };

  const handleClickResource = (item: { id: number; type: string; points: number; icon: string }) => {
    if (!raceActive) return;

    if (item.points > 0) {
      audioEngine.playMinecraftSound('pop');
      setRaceScore(prev => prev + item.points);
    } else {
      audioEngine.playMinecraftSound('anvil');
      setRaceScore(prev => Math.max(0, prev + item.points));
      showToast('💥 BOOM! Bomb hit: -20 Points!');
    }

    // Refresh grid slot
    spawnRaceResources();
  };

  // Timer for Race
  useEffect(() => {
    if (!raceActive) return;
    const interval = setInterval(() => {
      setRaceTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setRaceActive(false);
          audioEngine.playMinecraftSound('levelup');
          const payoutCoins = raceScore;
          avatarManager.addCurrency(payoutCoins, Math.floor(raceScore / 25));
          showToast(`🏁 Time's up! Final Score: ${raceScore} pts! Payout: +${payoutCoins} Coins!`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [raceActive, raceScore]);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-mono select-none overflow-y-auto">
      <div className="bg-stone-900 border-2 border-amber-500 rounded-3xl w-full max-w-5xl shadow-[0_20px_70px_rgba(245,158,11,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-700 via-stone-900 to-red-800 text-white border-b-2 border-amber-500/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-amber-500/20 border-2 border-amber-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🎮
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Cross-Platform Arcade & Mini-Games
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 border border-white">
                  Multi-System Sync
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Compete across Minecraft, Roblox, Mobile & Web in shared multiplayer arcade challenges
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-2 rounded-xl transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-amber-400 text-stone-950 px-4 py-2 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-md">
            <Sparkles size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-stone-950 border-b border-stone-800 text-xs font-bold">
          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('scavenger');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'scavenger' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Compass size={14} />
            <span>1. Global Scavenger Hunt ({relics.filter(r => r.found).length}/{relics.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('trivia');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'trivia' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles size={14} />
            <span>2. Brand Trivia Challenge</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('race');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'race' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Flame size={14} className="text-red-400" />
            <span>3. Fast-Paced Resource Race</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('leaderboard');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'leaderboard' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Trophy size={14} />
            <span>4. Cross-Platform Leaderboards</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* ================= TAB 1: GLOBAL SCAVENGER HUNT ================= */}
          {activeTab === 'scavenger' && (
            <div className="space-y-4">
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Compass size={18} className="text-amber-400" />
                    Multiverse Archeological Relic Hunt
                  </h3>
                  <p className="text-xs text-stone-400">
                    Follow the biome clues, track waypoint distances, and excavate hidden brand artifacts!
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-amber-300 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800">
                  Total Discovered: {relics.filter(r => r.found).length} / {relics.length}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {relics.map(relic => (
                  <div
                    key={relic.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition ${
                      relic.found
                        ? 'bg-emerald-950/30 border-emerald-500/60 shadow-inner'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="text-3xl">{relic.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{relic.name}</h4>
                            <span className="text-[10px] bg-stone-900 text-amber-300 px-1.5 py-0.5 rounded border border-stone-800">
                              {relic.brand}
                            </span>
                          </div>
                        </div>

                        {relic.found ? (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-bold border border-emerald-500/40">
                            ✓ Discovered
                          </span>
                        ) : (
                          <span className="text-[10.5px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                            ~{relic.distanceMeters}m away
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-stone-400 font-bold mb-1 flex items-center gap-1">
                        <span className="text-amber-400">📍 Location:</span> {relic.locationBiome}
                      </div>

                      <p className="text-xs text-stone-300 italic mb-3 leading-relaxed">
                        "{relic.clue}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <div className="text-xs font-mono">
                        <span className="text-amber-300 font-bold">🪙 +{relic.rewardCoins}</span>
                        <span className="text-stone-500 mx-1">•</span>
                        <span className="text-cyan-300 font-bold">💎 +{relic.rewardRobux}</span>
                      </div>

                      {relic.found ? (
                        <span className="text-xs text-emerald-400 font-bold">In Inventory</span>
                      ) : (
                        <button
                          onClick={() => handleExcavateRelic(relic.id)}
                          className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl transition shadow flex items-center gap-1.5 cursor-pointer active:scale-95"
                        >
                          <Search size={12} />
                          <span>Excavate Relic</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 2: BRAND TRIVIA CHALLENGE ================= */}
          {activeTab === 'trivia' && (
            <div className="max-w-2xl mx-auto space-y-4 font-mono">
              <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-4 shadow-inner">
                <div className="flex justify-between items-center border-b border-stone-800 pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-yellow-400 font-bold">
                      Question {currentTriviaIdx + 1} of {TRIVIA_QUESTIONS.length}
                    </span>
                    <span className="bg-stone-900 text-amber-300 px-2 py-0.5 rounded text-[10.5px]">
                      {TRIVIA_QUESTIONS[currentTriviaIdx].brand}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-emerald-400 font-bold">Score: {triviaScore} pts</span>
                    {triviaStreak > 1 && (
                      <span className="text-amber-400 font-bold animate-pulse">🔥 Streak x{triviaStreak}</span>
                    )}
                  </div>
                </div>

                {/* Question Prompt */}
                <h3 className="text-base font-bold text-white leading-relaxed">
                  {TRIVIA_QUESTIONS[currentTriviaIdx].question}
                </h3>

                {/* Multiple Choice Options */}
                <div className="space-y-2.5 pt-2">
                  {TRIVIA_QUESTIONS[currentTriviaIdx].options.map((opt, oi) => {
                    const isSelected = selectedOption === oi;
                    const isCorrect = oi === TRIVIA_QUESTIONS[currentTriviaIdx].correctIndex;
                    let btnStyle = 'bg-stone-900 text-stone-200 border-stone-800 hover:border-amber-400';

                    if (triviaAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950 text-emerald-200 border-emerald-500 font-bold ring-2 ring-emerald-500/40';
                      } else if (isSelected) {
                        btnStyle = 'bg-red-950 text-red-200 border-red-500 line-through';
                      }
                    }

                    return (
                      <button
                        key={oi}
                        disabled={triviaAnswered}
                        onClick={() => handleSelectTriviaAnswer(oi)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs transition cursor-pointer flex items-center justify-between ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-black/40 flex items-center justify-center font-bold text-[11px] text-amber-300">
                            {String.fromCharCode(65 + oi)}
                          </span>
                          <span>{opt}</span>
                        </div>

                        {triviaAnswered && isCorrect && <span className="text-emerald-400 text-sm">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation Card upon answering */}
                {triviaAnswered && (
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 text-xs space-y-2">
                    <p className="text-stone-300 leading-relaxed">
                      💡 {TRIVIA_QUESTIONS[currentTriviaIdx].explanation}
                    </p>
                    <button
                      onClick={handleNextTriviaQuestion}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl transition cursor-pointer shadow"
                    >
                      Next Trivia Question ➔
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: FAST-PACED RESOURCE RACE ================= */}
          {activeTab === 'race' && (
            <div className="space-y-4 max-w-2xl mx-auto font-mono">
              <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-4 shadow-inner">
                <div className="flex justify-between items-center border-b border-stone-800 pb-3 text-xs">
                  <div>
                    <h4 className="text-base font-bold text-white">45-Second Resource Frenzy</h4>
                    <p className="text-stone-400 text-[11px]">Tap resources rapidly, avoid bombs!</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1 text-cyan-300">
                      <Clock size={14} />
                      <span>{raceTimeLeft}s</span>
                    </div>
                    <div className="text-amber-300">Score: {raceScore} pts</div>
                  </div>
                </div>

                {!raceActive ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                    <span className="text-5xl animate-bounce">⚡</span>
                    <div>
                      <h4 className="text-lg font-bold text-white">Ready for the Resource Sprint?</h4>
                      <p className="text-xs text-stone-400 max-w-md mt-1">
                        Diamonds, LEGO bricks, Golden Fries and Solar Cells will rapidly materialize. Collect as many as you can before the buzzer!
                      </p>
                    </div>

                    <button
                      onClick={startResourceRace}
                      className="px-8 py-3 bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-sm rounded-2xl shadow-xl transition cursor-pointer active:scale-95"
                    >
                      Start 30s Race Now!
                    </button>
                  </div>
                ) : (
                  /* Live Resource Grid */
                  <div className="grid grid-cols-4 gap-3 py-2">
                    {resourceGrid.map((item, idx) => (
                      <button
                        key={`${item.id}-${idx}`}
                        onClick={() => handleClickResource(item)}
                        className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center transition cursor-pointer active:scale-90 shadow-md ${
                          item.points < 0
                            ? 'bg-red-950/70 border-red-500 hover:bg-red-900/80'
                            : 'bg-stone-900 border-amber-500/50 hover:border-amber-400 hover:bg-stone-800'
                        }`}
                      >
                        <span className="text-3xl">{item.icon}</span>
                        <span className={`text-[10px] font-bold mt-1 ${item.points > 0 ? 'text-amber-300' : 'text-red-400'}`}>
                          {item.points > 0 ? `+${item.points}` : item.points}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 4: CROSS-PLATFORM LEADERBOARD ================= */}
          {activeTab === 'leaderboard' && (
            <div className="space-y-4 max-w-2xl mx-auto font-mono text-xs">
              <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-3 shadow-inner">
                <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Trophy size={16} className="text-yellow-400" />
                    Universal Arcade Hall of Fame
                  </h4>
                  <span className="text-[10.5px] text-stone-400">Live Cross-Platform Sync</span>
                </div>

                <div className="space-y-2">
                  {[
                    { rank: '1', name: 'Telamon_Builderman', platform: 'Roblox Client', score: 1420, badge: '👑 Grand Master' },
                    { rank: '2', name: 'SteveMiner_Official', platform: 'Minecraft Bedrock', score: 1290, badge: '🥈 Silver Speedster' },
                    { rank: '3', name: 'Polandball_CanSpace', platform: 'Web Desktop', score: 1140, badge: '🥉 Bronze Diplomat' },
                    { rank: '4', name: 'LegoMaster_928', platform: 'Mobile App', score: 980, badge: 'Brick Architect' },
                    { rank: '5', name: 'StreamerNova_100M', platform: 'Console', score: 920, badge: 'Viral Creator' },
                    { rank: '6', name: 'KiwiNavigator_Tamati', platform: 'Web Desktop', score: 870, badge: 'Aotearoa Wayfinder' },
                  ].map((entry, ei) => (
                    <div
                      key={ei}
                      className="p-3 bg-stone-900 rounded-2xl border border-stone-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 text-center font-black text-amber-400">{entry.rank}</span>
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{entry.name}</span>
                            <span className="text-[9.5px] bg-stone-800 text-stone-400 px-1.5 py-0.2 rounded">
                              {entry.platform}
                            </span>
                          </div>
                          <div className="text-[10.5px] text-yellow-400">{entry.badge}</div>
                        </div>
                      </div>

                      <div className="text-right font-mono font-bold text-sm text-amber-300">
                        {entry.score.toLocaleString()} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
