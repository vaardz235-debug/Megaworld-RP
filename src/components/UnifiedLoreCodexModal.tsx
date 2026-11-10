import React, { useState } from 'react';
import { 
  X, BookOpen, Globe, Compass, Shield, Sparkles, Scroll, Award, 
  MapPin, Flame, Zap, Search, ChevronRight, Layers, Users, Star, 
  Tv, Coffee, Radio, Swords, Eye
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface FactionLore {
  id: string;
  name: string;
  brand: string;
  icon: string;
  leader: string;
  hqLocation: string;
  ideology: string;
  lorePerk: string;
  backstory: string;
  conflictHook: string;
  accentColor: string;
}

interface EpochLore {
  epochNumber: string;
  title: string;
  era: string;
  icon: string;
  description: string;
  keyEvents: string[];
}

interface FigureLore {
  id: string;
  name: string;
  title: string;
  origin: string;
  icon: string;
  role: string;
  biography: string;
  signatureArtifact: string;
}

interface QuestHook {
  id: string;
  title: string;
  involvedIPs: string[];
  difficulty: 'Apprentice' | 'Adept' | 'Master' | 'Mythic';
  brief: string;
  rewards: string;
  coordinates: string;
}

const EPOCHS_DATA: EpochLore[] = [
  {
    epochNumber: 'EPOCH I',
    title: 'The Era of Sovereign Dimensions',
    era: 'Pre-Convergence',
    icon: '🌌',
    description: 'Before the Great Resonance, each universe existed within its own isolated dimensional bubble. Minecraft was an infinite quiet wilderness of voxels and redstone; Robloxia was a dynamic canvas of Lua-powered physics towers; the Island of Sodor was governed by punctual steam engines; the sovereign spheres of Countryballs debated territorial borders; and the enchanted shores of Aeternum surged with volatile Azoth.',
    keyEvents: [
      'Minecraft Steve completes the first Ender Dragon excavation and discovers deepslate resonance crystals.',
      'Robloxia establishes the Bloxian High Council under Builderman and codifies the Obby Physics Accord.',
      'The Island of Sodor celebrates 100 years of Really Useful railway service under Sir Topham Hatt.',
      'The League of Sovereign Spheres signs the Geneva Flag Treaty regulating spherical territory rights.',
    ],
  },
  {
    epochNumber: 'EPOCH II',
    title: 'The Great Resonance of Tarragower',
    era: 'Year of Convergence (2026)',
    icon: '⚡',
    description: 'In the subterranean engineering laboratories of Tarragower Academy in New Zealand, researchers combined a deep-vein Netherite particle accelerator with high-output BP Helios solar arrays and a 10-Million-Subscriber YouTube live streaming satellite link. During an attempt to synthesize infinite clean energy, the machine resonated with pure celestial Azoth. The dimensional fabric ruptured, fusing the timelines into one shared 200-billion-block persistent multiverse sandbox.',
    keyEvents: [
      'The Tarragower Particle Breach creates permanent spatial rifts across biomes.',
      'Sentient steam rails seamlessly link Sodor to Minecraft minecart tracks.',
      'Sovereign Countryballs awaken with physical block avatars, establishing regional embassies.',
      'Xilam slapstick cartoon physics manifest as non-lethal impact resistance for all citizens.',
    ],
  },
  {
    epochNumber: 'EPOCH III',
    title: 'The Grand Multiverse Syndicate Accords',
    era: 'Reconstruction & Trade Era',
    icon: '⚖️',
    description: 'To prevent total dimensional collapse, the leaders of the 10 major civilizations met at the Center of the World. McDonald\'s established the universal culinary supply chain providing unlimited nourishment; BP revolutionized mining with zero-emission solar turbines; YouTube created the 24/7 Creator Broadcast Grid; and the Sprunki Incredibox Collective synthesized harmonic frequency towers that stabilize the dimensional borders.',
    keyEvents: [
      'Ratification of the Multiverse Trade Compact uniting MegaCoins and Robux under the Golden Arches standard.',
      'Construction of the North Western Trans-Multiverse Express Line connecting all server regions.',
      'Establishment of the Aeternum Vanguard Watch to guard against Abyssal Void rifts.',
      'Oracle Verity constructs the Celestial Harmonic Tower to prevent Phase 2 Horror incursions.',
    ],
  },
  {
    epochNumber: 'EPOCH IV',
    title: 'The Winter Convergence & The Holiday Star',
    era: 'Present Day (Current Update)',
    icon: '🎄',
    description: 'A miraculous celestial phenomenon known as the Winter Convergence has begun! Deep within the North Pole biomes, Santa Claus Steve and the Frost Dominus have awakened the Bethlehem Holiday Star. Ancient holiday magic now flows through all regions, transforming weapons into toy soldier nutcrackers, candy cane staff weapons, and enchanted flying sleds that allow instant multi-platform travel.',
    keyEvents: [
      'Santa Claus Steve and Elf Alex inaugurate the North Pole Multiverse Toy Workshop.',
      'Ronald McDonald releases the limited-edition Peppermint Holiday Shake with Frost Immunity.',
      'The Kiwi Summer Santa establishes the Southern Hemisphere Beach Festival on Aotearoa shores.',
      'Adventurers unite to complete the Great Holiday Bounties and preserve dimensional peace.',
    ],
  },
];

const FACTIONS_DATA: FactionLore[] = [
  {
    id: 'faction_minecraft',
    name: 'The Diamond Voxel Syndicate',
    brand: 'Minecraft',
    icon: '⛏️',
    leader: 'Steve the Pioneer & Alex the Swift',
    hqLocation: 'Overworld Deepslate Spire (X: 0, Y: -58, Z: 0)',
    ideology: 'Architectural sovereignty through precision mining, redstone logic, and indestructible voxel fortifications.',
    lorePerk: '+20% Mining Speed & +15% Structural Durability on all placed blocks.',
    backstory: 'The earliest settlers of the physical world. Masters of deep subterranean terraforming, they guard the primary bedrock ley lines that anchor the world against void corruption.',
    conflictHook: 'A subterranean fissure beneath their primary diamond vault has tapped into an unrefined Azoth vein, causing mechanical redstone devices to animate with sentient wills.',
    accentColor: '#06b6d4',
  },
  {
    id: 'faction_roblox',
    name: 'The Bloxian High Council',
    brand: 'Roblox',
    icon: '🟥',
    leader: 'Builderman & Lord Dominus Aureus',
    hqLocation: 'The Skyward Obby Citadel (X: 1200, Y: 250, Z: -400)',
    ideology: 'Boundless user-generated creation, infinite parkour agility, and mastery over physics engine parameters.',
    lorePerk: '+15% Sprint Speed, Zero Fall Damage on yellow bounce pads, and +10% Robux bonus.',
    backstory: 'Hailing from the high-velocity cloud cities, Bloxians constructed the massive gravity towers and speed-coil arenas that train heroes to traverse treacherous multiverse voids.',
    conflictHook: 'Guest 666 has been sighted tampering with the central Lua scripting altar, attempting to invert gravitational constants across all servers.',
    accentColor: '#ef4444',
  },
  {
    id: 'faction_countryballs',
    name: 'The League of Sovereign Spheres',
    brand: 'Countryballs',
    icon: '🌐',
    leader: 'President USAball & Ambassador Polandball',
    hqLocation: 'Geneva World Embassy (X: -800, Y: 64, Z: 500)',
    ideology: 'Diplomatic sovereignty, cultural preservation, and collective planetary defense with spherical perfection.',
    lorePerk: '+15% Trade Haggling discount & instant access to all regional folk music motifs.',
    backstory: 'Composed of 48 sovereign national spheres, the League handles international diplomacy, trade sanctions, and manages the space exploration programs to ensure Poland can into space.',
    conflictHook: 'The historic Geneva Non-Aggression Parchment was stolen from the high vault, sparking comic border disputes between neighboring ball embassies.',
    accentColor: '#3b82f6',
  },
  {
    id: 'faction_thomas',
    name: 'The North Western Railway Directorate',
    brand: 'Thomas & Friends',
    icon: '🚂',
    leader: 'Sir Topham Hatt & Thomas No. 1',
    hqLocation: 'Knapford Central Hub (X: 450, Y: 68, Z: 120)',
    ideology: 'Punctuality, unyielding work ethic, and ensuring every machine remains "Really Useful" to society.',
    lorePerk: '+25% Transport Rail Velocity & free steam whistle morale boosts for parties.',
    backstory: 'Operating the trans-continental heavy freight and passenger lines, their sentient steam engines deliver food, raw ores, and holiday letters through blizzards and mountain passes.',
    conflictHook: 'Diesel and his mischievous shunter cabal have diverted the holiday mail coaches into an abandoned Nether fortress branch line.',
    accentColor: '#2563eb',
  },
  {
    id: 'faction_sprunki',
    name: 'The Incredibox Harmonic Collective',
    brand: 'Sprunki',
    icon: '🔮',
    leader: 'Oracle Verity & Oren Beatmaster',
    hqLocation: 'The Soundstage of Starlight (X: -200, Y: 140, Z: -800)',
    ideology: 'Cosmic resonance through synchronized polyrhythms, celestial frequencies, and warding against Phase 2 void distortion.',
    lorePerk: '+20% Party Morale & passive musical aura that regenerates health in combat.',
    backstory: 'The metaphysical balance of the multiverse is maintained by music. Their beatbox rhythms, melodic vocals, and synthesizer pads stabilize the cosmic boundaries between dimensions.',
    conflictHook: 'Deep beneath the soundstage, an abyssal frequency known as the Void Drone is vibrating, threatening to plunge the realm into a permanent horror phase.',
    accentColor: '#a855f7',
  },
  {
    id: 'faction_xilam',
    name: 'The Slapstick Syndicate',
    brand: 'Xilam',
    icon: '💥',
    leader: 'Oggy the Gentle & Jack the Champion',
    hqLocation: 'The Rubberhouse Villa (X: 950, Y: 70, Z: 850)',
    ideology: 'Life is a hilarious comedy! Subvert grim reality through oversized wooden mallets, comic ricochets, and eternal resilience.',
    lorePerk: '80% Knockback Resistance & comic bounce recovery when falling from cliffs.',
    backstory: 'Refusing to obey dreary laws of physics, this colorful guild turns every catastrophic battle into a slapstick spectacle where nobody is permanently harmed, but everyone has a laugh.',
    conflictHook: 'Joey, Dee Dee, and Marky have rigged the annual Holiday Feast banquet hall with 500 tons of spring-loaded whoopee cushions and cherry pies.',
    accentColor: '#f97316',
  },
  {
    id: 'faction_mcdonalds',
    name: 'The Golden Arches Culinary Guild',
    brand: 'McDonald\'s',
    icon: '🍔',
    leader: 'Master Chef Ronald McDonald & Grimace',
    hqLocation: 'Golden Citadel Kitchen (X: 300, Y: 72, Z: 300)',
    ideology: 'Universal sustenance, radiant joy, and golden gourmet burgers that empower adventurers across all platforms.',
    lorePerk: '+100% Saturation Duration & limited-edition Peppermint Shake frost resistance.',
    backstory: 'The primary logistical food supplier of the multiverse. Whether exploring permafrost glaciers or deep mines, every adventurer relies on their hearty meals for energy.',
    conflictHook: 'The Hamburglar has escaped into the wilderness with the secret recipe for the Cosmic Grimace Shake, guarded by high-level mob mercenaries.',
    accentColor: '#eab308',
  },
  {
    id: 'faction_bp',
    name: 'The Helios Eco-Energy Consortium',
    brand: 'BP',
    icon: '🌻',
    leader: 'Director Sarah Vance & Chief Solar Engineer Liam',
    hqLocation: 'Solaris Wind & Sun Array (X: -600, Y: 90, Z: -300)',
    ideology: 'Clean, sustainable power for infinite worlds. Zero emissions, advanced battery grids, and solar-kinetic transportation.',
    lorePerk: '+25% Furnace Smelting Velocity & perpetual redstone machinery charging.',
    backstory: 'Pioneers in carbon-neutral industrial engineering. They converted dirty coal furnaces across the world into clean solar-thermal grids that power entire cities without smoke.',
    conflictHook: 'An intense magnetic storm over the solar array has overloaded the primary energy capacitors, threatening to de-power the city hospitals.',
    accentColor: '#10b981',
  },
  {
    id: 'faction_tarragower',
    name: 'Tarragower Academy of Dimensional Sciences',
    brand: 'NZ Tarragower',
    icon: '🏛️',
    leader: 'Headmaster Te Rangi & Dr. Alistair Finch',
    hqLocation: 'Tarragower Quadrangle (X: 100, Y: 80, Z: -150)',
    ideology: 'Academic excellence, sacred Polynesian wayfinding wisdom, and scientific inquiry into the physics of the multiverse.',
    lorePerk: '-15% Crafting Recipe Costs & instant identification of rare ancient artifacts.',
    backstory: 'The prestigious New Zealand academy where the Great Resonance originated. Today, its scholars teach advanced dimensional math, redstone physics, and traditional wayfinding.',
    conflictHook: 'A locked laboratory in the historic clocktower has started emitting strange quantum radio signals matching the frequency of an alternate dimension.',
    accentColor: '#6366f1',
  },
  {
    id: 'faction_newworld',
    name: 'The Aeternum Azoth Order',
    brand: 'New World',
    icon: '🧭',
    leader: 'Commander Valeria & Syndicate Magus Corvus',
    hqLocation: 'Aeternum Bastion Keep (X: -1100, Y: 110, Z: 900)',
    ideology: 'Frontier courage, mastery over the miraculous cyan Azoth mineral, and unwavering vigilance against abyssal corruption.',
    lorePerk: '+15% Armor Resilience & weapon attacks have a 10% chance to release an Azoth shockwave.',
    backstory: 'Hardened frontier warriors and alchemists who crossed the stormy mists of Aeternum. They understand the dangerous, godlike power of pure Azoth better than anyone alive.',
    conflictHook: 'Corrupted Azoth stalks the outer borderlands, mutating standard skeletons into crystalline monstrosities that immune to normal arrows.',
    accentColor: '#0ea5e9',
  },
];

const FIGURES_DATA: FigureLore[] = [
  {
    id: 'steve_pioneer',
    name: 'Steve the Pioneer',
    title: 'Grand Master Builder of the Overworld',
    origin: 'Minecraft',
    icon: '⛏️',
    role: 'Voxel Vanguard Commander',
    biography: 'The silent titan who hollowed out mountains, laid the first stone foundations, and defeated the ancient dragons. He embodies pure persistence and builder ingenuity.',
    signatureArtifact: 'Enchanted Netherite Broadsword & Elytra Wings',
  },
  {
    id: 'builderman',
    name: 'Builderman',
    title: 'Chief Architect of the Bloxian Matrix',
    origin: 'Roblox',
    icon: '👷',
    role: 'Matrix Systems Engineer',
    biography: 'The visionary creator behind Robloxia\'s dynamic physics engines. Clad in safety hardhat and toolbelt, he can reprogram gravitational fields with a flick of his golden wrench.',
    signatureArtifact: 'The Golden Admin Spanner & Speed Coil',
  },
  {
    id: 'polandball',
    name: 'Polandball',
    title: 'High Envoy of the Sovereign Spheres',
    origin: 'Countryballs',
    icon: '🇵🇱',
    role: 'Interdimensional Diplomat',
    biography: 'Unyielding, cheerful, and armed with a plunger and diplomatic treaty. Despite countless historical jokes, his unwavering determination inspired all nations to unite under one banner.',
    signatureArtifact: 'The Plunger of Sovereignty & Geneva Seal',
  },
  {
    id: 'sir_topham',
    name: 'Sir Topham Hatt',
    title: 'The Fat Controller of Sodor',
    origin: 'Thomas & Friends',
    icon: '🎩',
    role: 'Master of Railway Logistics',
    biography: 'Impeccably dressed in top hat and tails, Sir Topham Hatt ensures the rails run like clockwork. He commands the respect of both mighty steam locomotives and modern diesels alike.',
    signatureArtifact: 'The Master Gold Pocketwatch of Punctuality',
  },
  {
    id: 'oracle_verity',
    name: 'Oracle Verity',
    title: 'Guardian of Celestial Harmony',
    origin: 'Sprunki',
    icon: '✨',
    role: 'Starlight Choral Priestess',
    biography: 'Hovering serenely with a halo of crystalline star chimes, Verity senses disturbances in the dimensional beat. When horror threatens to overtake the realm, her truth restores the light.',
    signatureArtifact: 'The Starlight Crown of Pure Harmony',
  },
  {
    id: 'oggy_cat',
    name: 'Oggy the Gentle',
    title: 'Champion of Slapstick Resilience',
    origin: 'Xilam',
    icon: '🐱',
    role: 'Cartoon Comedy Master',
    biography: 'A serene blue cat who only wants to watch television and eat sandwiches, but is endlessly propelled into hilarious chaos by the cockroach trio. He cannot be broken by any impact.',
    signatureArtifact: 'The 10-Ton Squeaky Rubber Mallet',
  },
  {
    id: 'ronald_mcdonald',
    name: 'Chief Ronald McDonald',
    title: 'High Custodian of the Golden Arches',
    origin: 'McDonald\'s',
    icon: '🍟',
    role: 'Master Chef & Morale General',
    biography: 'Spreading laughter and golden gourmet meals across infinite worlds. His culinary enchantments provide stamina and warmth to miners in the deepest, coldest caverns.',
    signatureArtifact: 'The Endless Golden Happy Meal Scepter',
  },
  {
    id: 'dr_finch',
    name: 'Dr. Alistair Finch',
    title: 'Dean of Multiverse Physics',
    origin: 'NZ Tarragower School',
    icon: '🎓',
    role: 'Chief Resonance Scientist',
    biography: 'The eccentric Kiwi physicist who accidentally initiated the Great Resonance. He now devotes his life to calibrating the dimensional stabilizers and teaching bright students.',
    signatureArtifact: 'The Quantum Tarragower Spectrometer',
  },
];

const QUEST_HOOKS_DATA: QuestHook[] = [
  {
    id: 'quest_holiday_star',
    title: 'The Awakening of the Bethlehem Holiday Star',
    involvedIPs: ['Minecraft', 'Roblox', 'Countryballs', 'McDonald\'s'],
    difficulty: 'Master',
    brief: 'Climb Mount Permafrost alongside Santa Steve and Frost Dominus to rekindle the ancient Holiday Star atop the world spire before the winter solstice ends.',
    rewards: '+500 MegaCoins, Frost Dominus Hood, Santa Velvet Cap',
    coordinates: 'X: 0, Y: 240, Z: -1500 (North Pole Spire)',
  },
  {
    id: 'quest_sodor_mail_heist',
    title: 'The Great Sodor Christmas Mail Recovery',
    involvedIPs: ['Thomas & Friends', 'Xilam', 'Tarragower'],
    difficulty: 'Adept',
    brief: 'The Dalton Brothers and Joey Cockroach hijacked Percy\'s holiday mail train! Track the steam engine across the Knapford viaduct and recover the letters.',
    rewards: '+350 MegaCoins, Really Useful Conductor Whistle, Elf Tunic',
    coordinates: 'X: 450, Y: 68, Z: 120 (Knapford Mainline)',
  },
  {
    id: 'quest_azoth_solar_grid',
    title: 'The High-Voltage Azoth Clean Energy Grid',
    involvedIPs: ['BP', 'New World', 'Minecraft'],
    difficulty: 'Master',
    brief: 'Assist BP solar engineers and Aeternum alchemists in connecting a volatile cyan Azoth power node to the central city grid without triggering a thermal overload.',
    rewards: '+450 MegaCoins, BP Solar Racing Suit, Azoth Blue Aura',
    coordinates: 'X: -600, Y: 90, Z: -300 (Solaris Farm)',
  },
  {
    id: 'quest_poland_space_mission',
    title: 'Operation Starlight: Poland CAN Into Space',
    involvedIPs: ['Countryballs', 'Roblox', 'YouTube'],
    difficulty: 'Mythic',
    brief: 'Build a multi-stage redstone-rocket with USAball and stream the historic lunar landing live to 10 million YouTube subscribers worldwide.',
    rewards: '+700 MegaCoins, Diamond Play Button Aegis, Sovereign Monocle',
    coordinates: 'X: -800, Y: 110, Z: 500 (Geneva Launchpad)',
  },
  {
    id: 'quest_void_horror_chime',
    title: 'Silencing the Abyssal Void Drone',
    involvedIPs: ['Sprunki', 'Minecraft', 'Xilam'],
    difficulty: 'Mythic',
    brief: 'Descend into the deepest bedrock catacombs where Phase 2 horror entities whisper. Perform a 7-track polyrhythmic jam with Oren and Verity to seal the rift.',
    rewards: '+600 MegaCoins, Starlight Celestial Wings, Pure Beatbox Crown',
    coordinates: 'X: -200, Y: -50, Z: -800 (The Deep Void Chasm)',
  },
];

interface UnifiedLoreCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWarpToCoordinates?: (x: number, y: number) => void;
}

export default function UnifiedLoreCodexModal({
  isOpen,
  onClose,
  onWarpToCoordinates,
}: UnifiedLoreCodexModalProps) {
  const [activeTab, setActiveTab] = useState<'genesis' | 'epochs' | 'factions' | 'figures' | 'quests'>('genesis');
  const [selectedFaction, setSelectedFaction] = useState<FactionLore>(FACTIONS_DATA[0]);
  const [selectedFigure, setSelectedFigure] = useState<FigureLore>(FIGURES_DATA[0]);
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredFactions = FACTIONS_DATA.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.ideology.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFigures = FIGURES_DATA.filter(fig =>
    fig.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fig.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    fig.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab: any) => {
    audioEngine.playMinecraftSound('click');
    setActiveTab(tab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-stone-950 border-2 border-amber-500/60 rounded-3xl shadow-2xl overflow-hidden text-white">
        
        {/* ================= HEADER BAR ================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950 via-stone-900 to-indigo-950 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/40 flex items-center justify-center text-2xl shadow-lg">
              📜
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-wide">
                  The Multiverse Lore Codex & Chronicles
                </h2>
                <span className="text-[10px] bg-amber-500 text-stone-950 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                  CANON MULTIVERSE ARCHIVES
                </span>
              </div>
              <p className="text-xs text-stone-400">
                The unified history, cosmological epochs, factions & legends uniting all 10+ integrated dimensions.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              onClose();
            }}
            className="w-10 h-10 rounded-2xl bg-stone-800 hover:bg-red-600 hover:text-white border border-stone-700 flex items-center justify-center transition cursor-pointer shadow-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-stone-900/90 border-b border-stone-800 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'genesis', label: '🌌 Grand Genesis', icon: Sparkles },
              { id: 'epochs', label: '⏳ Epoch Timeline', icon: Scroll },
              { id: 'factions', label: `🛡️ 10 Factions (${FACTIONS_DATA.length})`, icon: Shield },
              { id: 'figures', label: `👑 Influential Legends (${FIGURES_DATA.length})`, icon: Award },
              { id: 'quests', label: `📜 Quest Hooks (${QUEST_HOOKS_DATA.length})`, icon: Compass },
            ].map(tab => {
              const IconComp = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
                  }`}
                >
                  <IconComp size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search lore, heroes, factions..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-stone-950 border border-stone-700 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400 w-44 sm:w-56"
            />
          </div>
        </div>

        {/* ================= TAB CONTENTS ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: GRAND GENESIS */}
          {activeTab === 'genesis' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Hero Banner */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/60 via-stone-900 to-indigo-950/60 border border-amber-500/40 shadow-xl relative overflow-hidden">
                <div className="max-w-3xl space-y-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold">
                    <Sparkles size={14} /> The Origin of the 200-Billion Block Multiverse
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    The Great Resonance of Tarragower
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
                    How an experimental quantum particle collider in New Zealand fused Minecraft, Robloxia, Sodor, Cartoon Slapstick Reality, Sovereign Countryball Nations, and Aeternum into one permanent shared persistent realm.
                  </p>
                </div>
              </div>

              {/* Four Pillars of Multiverse Physics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-stone-900/90 border border-cyan-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                    <span>⛏️</span> Voxel Material Grid & Minecraft Physics
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    All terrain, stone, diamond ores, and structures conform to an indestructible cubic grid. Redstone circuitry functions as the nervous system of the earth, conducting energy, logic gates, and piston mechanics flawlessly.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/90 border border-red-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                    <span>🟥</span> Lua Scripting Matrix & Roblox Parkour
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    Robloxian physics allow players to leap across high-altitude obby platforms, use speed coils to sprint across water, and perform fluid parkour maneuvers that defy standard gravity.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/90 border border-purple-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                    <span>🔮</span> Harmonic Beats & Sprunki Frequency Wards
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    The cosmic perimeter of the world is tuned to a 7-track musical symphony. When peaceful beats resonate, crops flourish and players heal. When dissonance strikes, Phase 2 horror dimensional rifts open.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-stone-900/90 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                    <span>💥</span> Cartoon Slapstick Elasticity & Peace Treaties
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    Thanks to Xilam and Countryball diplomacy, mortal damage is absorbed into comic elasticity: anvils bonk with squeaks, players bounce back from 100-meter drops, and international treaties maintain server peace.
                  </p>
                </div>
              </div>

              {/* Genesis Timeline Narrative */}
              <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-4">
                <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Scroll size={16} /> The Day the Dimensions Collided
                </h4>
                <div className="text-xs text-stone-300 space-y-3 leading-relaxed">
                  <p>
                    On a brisk winter morning in 2026 at Tarragower Academy (NZ), Dr. Alistair Finch initiated Test Run #77 of the Netherite-Azoth Quantum Synchronizer. The objective was purely philanthropic: harness clean solar photon energy from the BP orbital grid and stream the scientific breakthrough live on YouTube to inspire millions of aspiring young engineers.
                  </p>
                  <p>
                    However, at 11:11 AM, an unexpected Azoth harmonic pulse resonated with an ancient music box crafted by Oracle Verity. A blinding pillar of crystalline starlight erupted into the upper atmosphere, tearing across dimensional folds. In an instant, the Island of Sodor’s railway mainline materialized alongside the Overworld coastline; Bloxian skyscrapers merged into Minecraft stone plateaus; and 48 sovereign Countryball spheres rolled into existence with full diplomatic embassies.
                  </p>
                  <p>
                    Rather than succumbing to chaos, the leaders forged the <strong>Grand Multiverse Treaty</strong>. McDonald\'s stepped in to provide universal sustenance; Sir Topham Hatt standardized trans-dimensional freight logistics; and Steve and Alex began teaching all citizens how to mine, build, and thrive in this united playground.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EPOCHS TIMELINE */}
          {activeTab === 'epochs' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="space-y-4">
                {EPOCHS_DATA.map((epoch, idx) => (
                  <div
                    key={epoch.epochNumber}
                    className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-400/50 transition shadow-xl space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{epoch.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-amber-400 uppercase tracking-widest">
                              {epoch.epochNumber}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                              {epoch.era}
                            </span>
                          </div>
                          <h3 className="text-base font-black text-white">{epoch.title}</h3>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-stone-300 leading-relaxed pl-2 border-l-2 border-amber-500/40">
                      {epoch.description}
                    </p>

                    <div className="pt-2">
                      <div className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
                        Key Historical Milestones:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {epoch.keyEvents.map((ev, eIdx) => (
                          <div key={eIdx} className="flex items-start gap-2 text-xs text-stone-300 bg-stone-950/60 p-2 rounded-xl border border-stone-800/80">
                            <span className="text-amber-400 mt-0.5">✦</span>
                            <span>{ev}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 10 FACTIONS */}
          {activeTab === 'factions' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
              {/* Left Faction Picker List */}
              <div className="space-y-2 lg:max-h-[600px] lg:overflow-y-auto pr-1">
                {filteredFactions.map(faction => (
                  <button
                    key={faction.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setSelectedFaction(faction);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedFaction.id === faction.id
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                        : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{faction.icon}</span>
                      <div>
                        <div className="text-xs font-black text-white">{faction.name}</div>
                        <div className="text-[10px] text-stone-400 uppercase font-bold">{faction.brand}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={selectedFaction.id === faction.id ? 'text-amber-400' : 'text-stone-600'} />
                  </button>
                ))}
              </div>

              {/* Right Detailed Faction Dossier View */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-5 shadow-2xl">
                <div className="flex items-start justify-between flex-wrap gap-3 border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-14 h-14 rounded-2xl bg-stone-800 border-2 border-amber-400/40 flex items-center justify-center text-3xl shadow">
                      {selectedFaction.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-black text-white">{selectedFaction.name}</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                          {selectedFaction.brand}
                        </span>
                      </div>
                      <p className="text-xs text-stone-400 flex items-center gap-1.5 mt-0.5">
                        <MapPin size={12} className="text-amber-400" />
                        <span>{selectedFaction.hqLocation}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold">Leadership:</span>
                    <div className="text-xs font-black text-amber-300">{selectedFaction.leader}</div>
                  </div>
                </div>

                {/* Lore Perk */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                  <Award size={20} className="text-amber-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                      Faction Perk & Mastery:
                    </span>
                    <span className="text-xs text-stone-200">{selectedFaction.lorePerk}</span>
                  </div>
                </div>

                {/* Core Ideology */}
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Core Ideology & Doctrine:
                  </h4>
                  <p className="text-xs text-stone-200 leading-relaxed bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                    "{selectedFaction.ideology}"
                  </p>
                </div>

                {/* Backstory */}
                <div className="space-y-1">
                  <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Historical Dossier:
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedFaction.backstory}
                  </p>
                </div>

                {/* Active Conflict Hook */}
                <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 space-y-1">
                  <div className="flex items-center gap-1.5 text-red-300 text-xs font-bold">
                    <Flame size={14} className="text-red-400 animate-pulse" />
                    <span>Current Crisis & Storyline Hook:</span>
                  </div>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    {selectedFaction.conflictHook}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INFLUENTIAL FIGURES */}
          {activeTab === 'figures' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-150">
              {/* Figure List */}
              <div className="space-y-2 lg:max-h-[600px] lg:overflow-y-auto pr-1">
                {filteredFigures.map(fig => (
                  <button
                    key={fig.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setSelectedFigure(fig);
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left transition flex items-center justify-between gap-3 cursor-pointer ${
                      selectedFigure.id === fig.id
                        ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                        : 'bg-stone-900/80 border-stone-800 text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{fig.icon}</span>
                      <div>
                        <div className="text-xs font-black text-white">{fig.name}</div>
                        <div className="text-[10px] text-amber-400 font-bold">{fig.title}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className={selectedFigure.id === fig.id ? 'text-amber-400' : 'text-stone-600'} />
                  </button>
                ))}
              </div>

              {/* Detailed Figure Dossier */}
              <div className="lg:col-span-2 p-6 rounded-3xl bg-stone-900/90 border border-stone-800 space-y-5 shadow-2xl">
                <div className="flex items-start justify-between flex-wrap gap-3 border-b border-stone-800 pb-4">
                  <div className="flex items-center gap-3.5">
                    <div className="w-16 h-16 rounded-2xl bg-stone-800 border-2 border-amber-400/40 flex items-center justify-center text-3xl shadow">
                      {selectedFigure.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white">{selectedFigure.name}</h3>
                      <div className="text-xs font-bold text-amber-300">{selectedFigure.title}</div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700 font-mono mt-1 inline-block">
                        {selectedFigure.origin} • {selectedFigure.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Legendary Biography:
                  </h4>
                  <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-4 rounded-2xl border border-stone-800/80">
                    {selectedFigure.biography}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/30 flex items-center gap-3">
                  <Award size={20} className="text-yellow-400 flex-shrink-0" />
                  <div>
                    <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider block">
                      Signature Relic / Artifact:
                    </span>
                    <span className="text-xs text-white font-bold">{selectedFigure.signatureArtifact}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: QUEST & NARRATIVE HOOKS */}
          {activeTab === 'quests' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Compass size={18} className="text-amber-400" />
                  <span className="text-xs text-stone-200">
                    Cross-IP Campaign Storylines uniting characters across Minecraft, Roblox, Countryballs, Sodor & Brands.
                  </span>
                </div>
                <span className="text-[10px] text-amber-300 font-bold uppercase">
                  {QUEST_HOOKS_DATA.length} Active Campaigns
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {QUEST_HOOKS_DATA.map(q => (
                  <div
                    key={q.id}
                    className="p-5 rounded-3xl bg-stone-900/90 border border-stone-800 hover:border-amber-400/50 transition shadow-xl space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          q.difficulty === 'Mythic' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' :
                          q.difficulty === 'Master' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                          'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        }`}>
                          {q.difficulty}
                        </span>

                        <div className="flex items-center gap-1">
                          {q.involvedIPs.map(ip => (
                            <span key={ip} className="text-[9px] px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 border border-stone-700">
                              {ip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <h4 className="text-sm font-black text-white">{q.title}</h4>
                      <p className="text-xs text-stone-300 leading-relaxed">{q.brief}</p>
                    </div>

                    <div className="pt-3 border-t border-stone-800/80 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-stone-400">
                        <span className="text-[10px] uppercase font-bold">Rewards:</span>
                        <span className="text-amber-300 font-bold">{q.rewards}</span>
                      </div>
                      <div className="flex items-center justify-between text-stone-400">
                        <span className="text-[10px] uppercase font-bold flex items-center gap-1">
                          <MapPin size={11} className="text-amber-400" /> Coordinates:
                        </span>
                        <span className="text-stone-300 font-mono text-[11px]">{q.coordinates}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ================= FOOTER BAR ================= */}
        <div className="p-4 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400">●</span>
            <span>Multiverse Lore Archives: 100% Synchronized with Cloud Database</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                audioEngine.playMinecraftSound('click');
                onClose();
              }}
              className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black transition cursor-pointer shadow-md"
            >
              Close Lore Codex
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
