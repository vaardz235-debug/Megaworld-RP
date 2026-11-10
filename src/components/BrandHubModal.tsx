import React, { useState, useEffect } from 'react';
import { 
  X, Sparkles, Trophy, Award, Check, Play, Star, ChevronRight, 
  MapPin, Flame, Zap, Shield, Heart, Gift, Clock, ExternalLink, RefreshCw
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { progressionManager } from '../utils/progressionManager';

export interface BrandHubData {
  id: string;
  name: string;
  brandTag: string;
  themeColor: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  mapCoords: { x: number; y: number };
  landmarkName: string;
  description: string;
  lore: string;
  ambassadorName: string;
  ambassadorRole: string;
  activityTitle: string;
  activityType: 'burger_assembly' | 'blox_obby' | 'roach_swat' | 'haka_rhythm' | 'energy_grid' | 'azoth_forge' | 'stream_hype';
  activityDescription: string;
  quests: {
    id: string;
    title: string;
    description: string;
    target: number;
    current: number;
    rewardXp: number;
    rewardCoins: number;
    rewardItem: string;
    isCompleted: boolean;
  }[];
  exclusiveRewards: {
    id: string;
    name: string;
    icon: string;
    repRequired: number;
    claimed: boolean;
    description: string;
  }[];
}

export const BRAND_HUBS: BrandHubData[] = [
  {
    id: 'mcdonalds',
    name: "McDonald's Golden Plaza & PlayPlace",
    brandTag: "MCDONALD'S",
    themeColor: 'text-yellow-400',
    bgColor: 'bg-red-950/80',
    borderColor: 'border-yellow-500',
    icon: '🍟',
    mapCoords: { x: 38, y: 6 },
    landmarkName: 'Golden Arches Diner & Spiral PlayPlace',
    description: 'Iconic golden arches dining room, ball pit, fryers, and cheerful Happy Meal toy workshop.',
    lore: 'Providing delicious hot comfort food and festive Happy Meals to weary dimensional travelers across all biomes.',
    ambassadorName: 'Chef Ronald',
    ambassadorRole: 'Chief Hospitality Officer & Frymaster',
    activityTitle: 'Golden Burger Assembly Speed Trial',
    activityType: 'burger_assembly',
    activityDescription: 'Stack sesame buns, sizzling patties, fresh lettuce, and golden cheese within 30 seconds to earn high customer tips!',
    quests: [
      {
        id: 'mcd_quest_1',
        title: 'Happy Meal Multiverse Delivery',
        description: 'Deliver 3 warm Happy Meals to miners near the Nether Citadel.',
        target: 3,
        current: 1,
        rewardXp: 150,
        rewardCoins: 200,
        rewardItem: 'Golden Big Mac (+100 Hunger & Jump Boost)',
        isCompleted: false
      },
      {
        id: 'mcd_quest_2',
        title: 'Secret Fryer Seasoning Secret',
        description: 'Recover the lost recipe parchment from the Sand Dune ruins.',
        target: 1,
        current: 0,
        rewardXp: 250,
        rewardCoins: 350,
        rewardItem: 'Fry Blaster Wand',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'mcd_rew_1',
        name: 'Golden Ronald Crown',
        icon: '👑',
        repRequired: 100,
        claimed: false,
        description: 'Gilded crown radiating warm golden fry luminescence.'
      },
      {
        id: 'mcd_rew_2',
        name: 'Happy Meal Mystery Box',
        icon: '📦',
        repRequired: 250,
        claimed: false,
        description: 'Contains 1 of 5 limited edition Christmas collectible toys.'
      }
    ]
  },
  {
    id: 'roblox',
    name: 'Roblox Blox Plaza & UGC Creator Hub',
    brandTag: 'ROBLOX',
    themeColor: 'text-red-400',
    bgColor: 'bg-stone-950/90',
    borderColor: 'border-red-500',
    icon: '🧱',
    mapCoords: { x: 4, y: 6 },
    landmarkName: 'Bloxian Central Tower & Stud Stage',
    description: 'Neon stud arches, leaderboard towers, speedrun obby courses, and the legendary OOF synth altar.',
    lore: 'The multiverse nexus for user-generated creations, parkour champions, and nostalgic Bloxian physics.',
    ambassadorName: 'Classic Noob & BuilderMan',
    ambassadorRole: 'Master Obby Architects',
    activityTitle: 'Speedrun Blox Obby Parkour',
    activityType: 'blox_obby',
    activityDescription: 'Leap across floating neon studs and dodge lava blocks to beat the world record time!',
    quests: [
      {
        id: 'rbx_quest_1',
        title: 'Lava Jump Master',
        description: 'Complete 10 clean stud jumps without falling into the red void.',
        target: 10,
        current: 6,
        rewardXp: 200,
        rewardCoins: 300,
        rewardItem: 'Bloxian Linked Sword (+16 Attack)',
        isCompleted: false
      },
      {
        id: 'rbx_quest_2',
        title: 'Hidden Stud Scavenger',
        description: 'Locate 5 translucent studs hidden throughout the world trees.',
        target: 5,
        current: 3,
        rewardXp: 300,
        rewardCoins: 450,
        rewardItem: 'Classic Dominus Winter Hood',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'rbx_rew_1',
        name: 'Rainbow Periastron Blade',
        icon: '🗡️',
        repRequired: 150,
        claimed: false,
        description: 'Legendary linked blade that plays retro slash sounds.'
      },
      {
        id: 'rbx_rew_2',
        name: '500 Robux Gems Bundle',
        icon: '💎',
        repRequired: 300,
        claimed: false,
        description: 'Premium currency redeemable for top-tier avatar accessories.'
      }
    ]
  },
  {
    id: 'xilam',
    name: 'Xilam Cartoon Land & Slapstick Studio',
    brandTag: 'XILAM',
    themeColor: 'text-sky-400',
    bgColor: 'bg-blue-950/80',
    borderColor: 'border-sky-400',
    icon: '🌀',
    mapCoords: { x: 30, y: 6 },
    landmarkName: 'Oggy Cartoon House & Anvil Drop Workshop',
    description: 'Vibrant rubbery cartoon physics zone, giant sofas, mischievous roach traps, and slapstick springs.',
    lore: 'Home to high-energy French cartoon comedy where logic bends and hilarious boings reign supreme.',
    ambassadorName: 'Oggy & Jack',
    ambassadorRole: 'Slapstick Comedy Veterans',
    activityTitle: 'Roach Swatting Slapstick Frenzy',
    activityType: 'roach_swat',
    activityDescription: 'Whack pesky cartoon cockroaches popping out of walls before they steal Oggy holiday roast!',
    quests: [
      {
        id: 'xil_quest_1',
        title: 'Protect Oggy Refrigerator',
        description: 'Swat 15 roaches attempting to raid the Christmas holiday feast.',
        target: 15,
        current: 8,
        rewardXp: 180,
        rewardCoins: 250,
        rewardItem: 'Xilam Slapstick Bouncy Coil (+25 Block Boing)',
        isCompleted: false
      },
      {
        id: 'xil_quest_2',
        title: 'Comical Anvil Recovery',
        description: 'Retrieve 3 heavy 100-ton cartoon anvils dropped in the river.',
        target: 3,
        current: 1,
        rewardXp: 280,
        rewardCoins: 400,
        rewardItem: 'Rubber Squeaky Anvil Hammer',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'xil_rew_1',
        name: 'Oggy Cat Whiskers & Ears',
        icon: '🐱',
        repRequired: 120,
        claimed: false,
        description: 'Cosmetic headpiece that plays cartoon boing sound effects on jump.'
      },
      {
        id: 'xil_rew_2',
        name: 'Slapstick Dynamite Prop',
        icon: '🧨',
        repRequired: 280,
        claimed: false,
        description: 'Non-lethal firework prop that leaves characters comically covered in soot.'
      }
    ]
  },
  {
    id: 'tarragower',
    name: 'NZ Tarragower School & Maori Cultural Whare',
    brandTag: 'NZ TARRAGOWER',
    themeColor: 'text-emerald-400',
    bgColor: 'bg-emerald-950/80',
    borderColor: 'border-emerald-500',
    icon: '🌿',
    mapCoords: { x: 74, y: 6 },
    landmarkName: 'Totara Wharenui & Silver Fern Academy',
    description: 'Hand-carved ancestral Wharenui, Totara library, Pounamu jade circle, and indigenous wisdom archive.',
    lore: 'An esteemed sanctuary honoring Maori guardianship (Kaitiakitanga), community respect, and ancestral knowledge.',
    ambassadorName: 'Chief Tamati & Headmaster Tarragower',
    ambassadorRole: 'Rangatira Cultural Guardians',
    activityTitle: 'Haka Rhythm & Poi Timing Challenge',
    activityType: 'haka_rhythm',
    activityDescription: 'Match drumming cadences to perform an honorable, earth-shaking Haka celebration!',
    quests: [
      {
        id: 'tar_quest_1',
        title: 'Silver Fern Lore Scroll',
        description: 'Read the 3 sacred ancestral scrolls inside the Totara Wharenui.',
        target: 3,
        current: 2,
        rewardXp: 220,
        rewardCoins: 300,
        rewardItem: 'Tarragower Master Chronicle Tome',
        isCompleted: false
      },
      {
        id: 'tar_quest_2',
        title: 'Pounamu River Search',
        description: 'Find 4 raw greenstone pebbles along the sacred glacial stream.',
        target: 4,
        current: 1,
        rewardXp: 320,
        rewardCoins: 500,
        rewardItem: 'Sacred Jade Pounamu Pendant',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'tar_rew_1',
        name: 'Rangatira Feathers Cloak',
        icon: '🪶',
        repRequired: 150,
        claimed: false,
        description: 'Regal woven cloak conferring +30% diplomatic respect from all NPCs.'
      },
      {
        id: 'tar_rew_2',
        name: 'Taiaha Guardian Spear',
        icon: '🗡️',
        repRequired: 350,
        claimed: false,
        description: 'Carved hardwood spear imbued with ancestral warding magic.'
      }
    ]
  },
  {
    id: 'bp',
    name: 'BP Clean Energy Innovation Lab & Station',
    brandTag: 'BP',
    themeColor: 'text-lime-400',
    bgColor: 'bg-stone-950/90',
    borderColor: 'border-lime-500',
    icon: '⚡',
    mapCoords: { x: 26, y: 6 },
    landmarkName: 'Solar Helios Canopy & Bio-Hydrogen Terminal',
    description: 'Futuristic solar canopies, wind turbine test masts, clean hydrogen fueling bays, and carbon capture arrays.',
    lore: 'Pioneering sustainable technology and clean power grids for the next generation of mega worlds.',
    ambassadorName: 'Engineer Brenda',
    ambassadorRole: 'Director of Renewable Innovation',
    activityTitle: 'Clean Energy Power Grid Balance',
    activityType: 'energy_grid',
    activityDescription: 'Connect solar tiles and wind turbines to power the holiday winter village without grid brownouts!',
    quests: [
      {
        id: 'bp_quest_1',
        title: 'Zero-Emission Rooftop Arrays',
        description: 'Install 4 solar tiles across the Starter Forest buildings.',
        target: 4,
        current: 2,
        rewardXp: 200,
        rewardCoins: 280,
        rewardItem: 'Solar Bio-Battery Pack',
        isCompleted: false
      },
      {
        id: 'bp_quest_2',
        title: 'Hydrogen Sleigh Refueling',
        description: 'Synthesize 50 units of clean bio-fuel for the North Pole fleet.',
        target: 50,
        current: 30,
        rewardXp: 300,
        rewardCoins: 420,
        rewardItem: 'Clean Energy Aurora Wings',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'bp_rew_1',
        name: 'Eco-Helios Jetpack',
        icon: '🚀',
        repRequired: 140,
        claimed: false,
        description: 'Allows sustained vertical hover powered entirely by solar and wind energy.'
      },
      {
        id: 'bp_rew_2',
        name: 'Green Power Grid Overdrive',
        icon: '⚡',
        repRequired: 320,
        claimed: false,
        description: 'Increases all automated machine and furnace speeds by 50%.'
      }
    ]
  },
  {
    id: 'newworld',
    name: 'New World Aeternum Outpost & Azoth Citadel',
    brandTag: 'NEW WORLD',
    themeColor: 'text-amber-400',
    bgColor: 'bg-stone-950/90',
    borderColor: 'border-amber-500',
    icon: '⚔️',
    mapCoords: { x: 68, y: 6 },
    landmarkName: 'Azoth Forge & Faction War Room',
    description: 'Medieval stonework citadel, glowing Azoth crystal crucibles, siege ballistas, and territory war table.',
    lore: 'Venture into the supernatural frontier of Aeternum, mastering mineral alchemy and legendary armaments.',
    ambassadorName: 'Commander Adelyn',
    ambassadorRole: 'Vanguard Faction Marshall',
    activityTitle: 'Azoth Crucible Smithing',
    activityType: 'azoth_forge',
    activityDescription: 'Strike glowing Azoth steel in rhythmic harmony to forge flawless legendary weaponry!',
    quests: [
      {
        id: 'nw_quest_1',
        title: 'Purge the Nether Breach',
        description: 'Defeat 5 corrupted entities near the Obsidian Citadel.',
        target: 5,
        current: 3,
        rewardXp: 260,
        rewardCoins: 400,
        rewardItem: 'Azoth Greatsword (+22 Damage)',
        isCompleted: false
      },
      {
        id: 'nw_quest_2',
        title: 'Aeternum Azoth Extraction',
        description: 'Extract 10 blue Azoth crystals from subterranean veins.',
        target: 10,
        current: 4,
        rewardXp: 350,
        rewardCoins: 550,
        rewardItem: 'Aeternum Conqueror Plate Armor',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'nw_rew_1',
        name: 'Azoth Infused Warhorn',
        icon: '📯',
        repRequired: 160,
        claimed: false,
        description: 'Blasts a resonant rally call granting nearby allies +20% defense.'
      },
      {
        id: 'nw_rew_2',
        name: 'Territory Governor Cloak',
        icon: '🛡️',
        repRequired: 380,
        claimed: false,
        description: 'Signifies supreme territorial sovereignty and unlocks tax income.'
      }
    ]
  },
  {
    id: 'youtube',
    name: 'YouTube Creator Studio & Stream Lounge',
    brandTag: 'YOUTUBE',
    themeColor: 'text-rose-400',
    bgColor: 'bg-red-950/80',
    borderColor: 'border-rose-500',
    icon: '▶️',
    mapCoords: { x: 50, y: 6 },
    landmarkName: 'Streamer Soundstage & Play Button Gallery',
    description: 'Studio lights, green screen rigs, live chat screens, subscriber milestone plaques, and viral clip booths.',
    lore: 'The global stage where creators broadcast their greatest gaming adventures to millions of live fans.',
    ambassadorName: 'Creator Nova',
    ambassadorRole: 'Lead Content Architect & Streamer',
    activityTitle: 'Viral Live Stream Hype Mini-Game',
    activityType: 'stream_hype',
    activityDescription: 'Mash chat reactions, trigger hype trains, and clip epic moments to reach trending #1!',
    quests: [
      {
        id: 'yt_quest_1',
        title: '100,000 In-Game Subs Milestone',
        description: 'Stream 5 gaming moments to gain virtual in-game subscribers.',
        target: 5,
        current: 2,
        rewardXp: 220,
        rewardCoins: 350,
        rewardItem: 'Silver Play Button Shield',
        isCompleted: false
      },
      {
        id: 'yt_quest_2',
        title: 'Holiday Charity Stream',
        description: 'Host the live Christmas Yule Log charity broadcast.',
        target: 1,
        current: 0,
        rewardXp: 380,
        rewardCoins: 600,
        rewardItem: 'Diamond Play Button Trophy',
        isCompleted: false
      }
    ],
    exclusiveRewards: [
      {
        id: 'yt_rew_1',
        name: 'RGB Neon Streamer Headset',
        icon: '🎧',
        repRequired: 150,
        claimed: false,
        description: 'Glows in synchrony with music and voice lines.'
      },
      {
        id: 'yt_rew_2',
        name: 'Viral Sparkle Trail Emote',
        icon: '✨',
        repRequired: 350,
        claimed: false,
        description: 'Leaves a trail of trending sparks and subscriber confetti.'
      }
    ]
  }
];

interface BrandHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTeleportToHub?: (coords: { x: number; y: number }, hubName: string) => void;
  onRewardClaimed?: (item: string) => void;
  user?: any;
}

export default function BrandHubModal({
  isOpen,
  onClose,
  onTeleportToHub,
  onRewardClaimed,
  user
}: BrandHubModalProps) {
  const [selectedHub, setSelectedHub] = useState<BrandHubData>(BRAND_HUBS[0]);
  const [activeMiniGame, setActiveMiniGame] = useState<boolean>(false);
  const [miniGameScore, setMiniGameScore] = useState<number>(0);
  const [miniGameTimer, setMiniGameTimer] = useState<number>(15);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Reputation per brand
  const [brandReputation, setBrandReputation] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('megaworld_brand_rep_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse brand rep', e);
      }
    }
    return {
      mcdonalds: 60,
      roblox: 85,
      xilam: 40,
      tarragower: 90,
      bp: 55,
      newworld: 70,
      youtube: 75
    };
  });

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Mini-game timer effect
  useEffect(() => {
    let interval: any;
    if (activeMiniGame && miniGameTimer > 0) {
      interval = setInterval(() => {
        setMiniGameTimer(t => t - 1);
      }, 1000);
    } else if (activeMiniGame && miniGameTimer === 0) {
      // Mini-game ended
      setActiveMiniGame(false);
      audioEngine.playMinecraftSound('levelup');
      const repGain = Math.max(10, Math.floor(miniGameScore * 3));
      const nextRep = {
        ...brandReputation,
        [selectedHub.id]: (brandReputation[selectedHub.id] || 0) + repGain
      };
      setBrandReputation(nextRep);
      localStorage.setItem('megaworld_brand_rep_v1', JSON.stringify(nextRep));

      // Record progression
      progressionManager.addXp(repGain * 2, `${selectedHub.name} Activity`);
      showToast(`🏆 Activity Finished! Score: ${miniGameScore} • Earned +${repGain} ${selectedHub.brandTag} Rep!`);
    }
    return () => clearInterval(interval);
  }, [activeMiniGame, miniGameTimer, miniGameScore, selectedHub]);

  const handleStartActivity = () => {
    audioEngine.playMinecraftSound('click');
    setMiniGameScore(0);
    setMiniGameTimer(15);
    setActiveMiniGame(true);
  };

  const handleMiniGameClick = () => {
    audioEngine.playMinecraftSound('orb');
    setMiniGameScore(s => s + 1);
  };

  const handleCompleteQuest = (qId: string, qTitle: string, item: string, xp: number, coins: number) => {
    audioEngine.playMinecraftSound('levelup');
    const nextRep = {
      ...brandReputation,
      [selectedHub.id]: (brandReputation[selectedHub.id] || 0) + 40
    };
    setBrandReputation(nextRep);
    localStorage.setItem('megaworld_brand_rep_v1', JSON.stringify(nextRep));

    // Update progression
    progressionManager.completeQuest(qId, xp, coins);
    progressionManager.recordItemAcquired(`brand_${qId}`, item, '🎁', 'epic');

    if (onRewardClaimed) {
      onRewardClaimed(item);
    }
    showToast(`✅ Quest Completed: "${qTitle}"! Received ${item} & +${xp} XP!`);
  };

  const handleClaimReward = (rew: any) => {
    audioEngine.playMinecraftSound('anvil_use');
    progressionManager.recordItemAcquired(rew.id, rew.name, rew.icon, 'legendary');
    progressionManager.addXp(100, `Claimed Exclusive: ${rew.name}`);
    if (onRewardClaimed) {
      onRewardClaimed(rew.name);
    }
    showToast(`🌟 Claimed Exclusive ${rew.name}! Synchronized to Cross-Platform Cloud!`);
  };

  const handleTeleport = () => {
    audioEngine.playMinecraftSound('portal');
    if (onTeleportToHub) {
      onTeleportToHub(selectedHub.mapCoords, selectedHub.name);
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentRep = brandReputation[selectedHub.id] || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-stone-900 border-2 border-stone-700 rounded-3xl w-full max-w-5xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 relative">
        
        {/* Toast */}
        {toastMsg && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl shadow-xl border border-emerald-400 flex items-center gap-2 text-sm animate-bounce">
            <Sparkles size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="bg-stone-950 p-4 border-b border-stone-800 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-2xl">
              🏢
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white">Multiverse Brand Hubs & Outposts</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  7 Active Hubs
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Explore dedicated realms, complete branded activities, earn reputation, and collect exclusive gear.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-xl transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Brand Selector Bar */}
        <div className="bg-stone-950/60 px-4 py-2.5 border-b border-stone-800 flex items-center gap-2 overflow-x-auto">
          {BRAND_HUBS.map(hub => {
            const isSelected = selectedHub.id === hub.id;
            const rep = brandReputation[hub.id] || 0;

            return (
              <button
                key={hub.id}
                onClick={() => {
                  audioEngine.playMinecraftSound('click');
                  setSelectedHub(hub);
                  setActiveMiniGame(false);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap border ${
                  isSelected 
                    ? 'bg-stone-800 text-white border-blue-400 shadow-md ring-1 ring-blue-500/50' 
                    : 'bg-stone-900 text-stone-400 hover:bg-stone-800/80 hover:text-white border-stone-800'
                }`}
              >
                <span className="text-base">{hub.icon}</span>
                <span>{hub.brandTag}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/40 text-yellow-400 font-mono">
                  {rep} Rep
                </span>
              </button>
            );
          })}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col md:flex-row gap-4">
          
          {/* Left Column: Hub Overview & Activity */}
          <div className="flex-1 flex flex-col space-y-4">
            
            {/* Hub Banner */}
            <div className={`p-5 rounded-2xl border ${selectedHub.borderColor} ${selectedHub.bgColor} relative overflow-hidden shadow-lg`}>
              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-stone-300">
                    Official In-Game Zone • Coordinates ({selectedHub.mapCoords.x}, {selectedHub.mapCoords.y})
                  </span>
                  <h3 className="text-2xl font-black text-white flex items-center gap-2 mt-0.5">
                    <span>{selectedHub.icon}</span>
                    <span>{selectedHub.name}</span>
                  </h3>
                  <p className="text-xs text-stone-300 mt-1 max-w-xl leading-relaxed">{selectedHub.description}</p>
                </div>

                <button
                  onClick={handleTeleport}
                  className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition cursor-pointer self-start"
                >
                  <MapPin size={14} />
                  <span>Fast Travel to Hub</span>
                </button>
              </div>

              {/* Ambassador & Reputation Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-stone-300">Ambassador:</span>
                  <span className="font-bold text-white">{selectedHub.ambassadorName}</span>
                  <span className="text-[10px] text-stone-400">({selectedHub.ambassadorRole})</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-stone-300">Your Reputation:</span>
                  <span className="font-bold font-mono text-yellow-400 text-sm">{currentRep} Points</span>
                </div>
              </div>
            </div>

            {/* Interactive Hub Activity */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span>Unique Brand Activity: {selectedHub.activityTitle}</span>
                  </h4>
                  <p className="text-xs text-stone-400 mt-0.5">{selectedHub.activityDescription}</p>
                </div>
              </div>

              {/* Mini-Game Arena */}
              {!activeMiniGame ? (
                <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-center flex flex-col items-center justify-center space-y-2">
                  <span className="text-4xl">{selectedHub.icon}</span>
                  <p className="text-xs text-stone-300">
                    Test your skills in the {selectedHub.name} interactive challenge to earn brand reputation and XP!
                  </p>
                  <button
                    onClick={handleStartActivity}
                    className="mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer transition"
                  >
                    <Play size={16} />
                    <span>Start Challenge (15s Sprint)</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-stone-900 rounded-xl border-2 border-emerald-500 text-center flex flex-col items-center justify-center space-y-3 animate-pulse">
                  <div className="flex items-center justify-between w-full px-4 text-xs font-mono">
                    <span className="font-bold text-red-400 flex items-center gap-1">
                      <Clock size={14} /> Time Left: {miniGameTimer}s
                    </span>
                    <span className="font-bold text-yellow-400 flex items-center gap-1">
                      <Trophy size={14} /> Score: {miniGameScore}
                    </span>
                  </div>

                  <button
                    onClick={handleMiniGameClick}
                    className="w-32 h-32 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-400 hover:scale-105 active:scale-95 text-white font-black text-3xl shadow-2xl flex items-center justify-center cursor-pointer transition select-none"
                  >
                    {selectedHub.icon}
                  </button>
                  <span className="text-xs text-stone-300 font-bold uppercase tracking-wider">
                    CLICK / TAP RAPIDLY!
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Brand Quests & Exclusive Unlocks */}
          <div className="w-full md:w-96 flex flex-col space-y-4">
            
            {/* Brand Quests */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Trophy size={15} className="text-amber-400" />
                <span>Brand Quests ({selectedHub.quests.length})</span>
              </h4>

              <div className="space-y-2">
                {selectedHub.quests.map(q => (
                  <div
                    key={q.id}
                    className="p-3 bg-stone-900 rounded-xl border border-stone-800 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h5 className="font-bold text-xs text-white">{q.title}</h5>
                      <span className="text-[10px] font-bold text-amber-400 font-mono">
                        +{q.rewardXp} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-400">{q.description}</p>
                    
                    <div className="flex items-center justify-between pt-1 border-t border-stone-800 text-[10px]">
                      <span className="text-stone-300 font-bold">Reward: {q.rewardItem}</span>
                      <button
                        onClick={() => handleCompleteQuest(q.id, q.title, q.rewardItem, q.rewardXp, q.rewardCoins)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-lg cursor-pointer transition"
                      >
                        Complete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exclusive Brand Unlocks */}
            <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-3">
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <Award size={15} className="text-purple-400" />
                <span>Reputation Unlocks</span>
              </h4>

              <div className="space-y-2">
                {selectedHub.exclusiveRewards.map(rew => {
                  const isUnlocked = currentRep >= rew.repRequired;

                  return (
                    <div
                      key={rew.id}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                        isUnlocked 
                          ? 'bg-purple-950/40 border-purple-500/50' 
                          : 'bg-stone-900/60 border-stone-800 opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl">{rew.icon}</span>
                        <div>
                          <h6 className="font-bold text-xs text-white">{rew.name}</h6>
                          <span className="text-[10px] text-purple-300">
                            Requires {rew.repRequired} Rep
                          </span>
                        </div>
                      </div>

                      <button
                        disabled={!isUnlocked}
                        onClick={() => handleClaimReward(rew)}
                        className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white font-bold text-xs rounded-lg cursor-pointer transition"
                      >
                        Claim
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
