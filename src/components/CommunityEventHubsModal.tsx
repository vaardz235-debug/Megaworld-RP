import React, { useState, useEffect } from 'react';
import { 
  X, Users, Mic, MicOff, Radio, Volume2, Globe, 
  MapPin, Trophy, Sparkles, Calendar, Play, Shield, 
  ChevronRight, ArrowRight, MessageSquare, Flame, Check
} from 'lucide-react';
import { avatarManager } from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';

interface CommunityEventHubsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  onWarpToLocation?: (coords: { x: number; y: number; name: string }) => void;
}

export interface CommunityHubLocation {
  id: string;
  name: string;
  brandTheme: 'Multiverse' | 'McDonald\'s' | 'NZ' | 'BP' | 'Tarragower' | 'Roblox' | 'LEGO';
  icon: string;
  bannerEmoji: string;
  coords: { x: number; y: number };
  activePlayersCount: number;
  featuredTemplate: 'tournament' | 'roleplay' | 'celebration';
  voiceChannelMhz: string;
  description: string;
  amenities: string[];
  currentEventTitle?: string;
  ambianceStyle: string;
}

export const COMMUNITY_HUBS: CommunityHubLocation[] = [
  {
    id: 'hub_central_plaza',
    name: 'The Multiverse Central Plaza & Amphitheater',
    brandTheme: 'Multiverse',
    icon: '🏛️',
    bannerEmoji: '🌟',
    coords: { x: 25, y: 7 },
    activePlayersCount: 84,
    featuredTemplate: 'celebration',
    voiceChannelMhz: '144.10 MHz (Plaza General)',
    description: 'The zero-coordinate dimensional hub uniting Minecraft overworld explorers, Roblox jumpers, Countryball delegates, and Sodor engines. Features 4K jumbo screens, stage podiums, and free food stalls.',
    amenities: ['Global Teleportation Nexus', 'Grand Stage with Podium Mic', 'Trade Escrow Stalls', 'Proximity Voice Zone'],
    currentEventTitle: 'Cross-Brand All-Star Gathering & Welcome Parade',
    ambianceStyle: 'from-amber-950/80 via-stone-900 to-emerald-950/80'
  },
  {
    id: 'hub_mcdonalds_arcade',
    name: 'Golden Arches Megacity Food Court & Arcade',
    brandTheme: 'McDonald\'s',
    icon: '🍟',
    bannerEmoji: '🍔',
    coords: { x: 45, y: 8 },
    activePlayersCount: 62,
    featuredTemplate: 'roleplay',
    voiceChannelMhz: '144.30 MHz (Drive-Thru & Diner)',
    description: 'Sizzling culinary and gaming social hub with retro arcade cabinets, drive-thru ordering microphones, and dining booths. Sponsored by McDonald\'s and YouTube Creators.',
    amenities: ['Drive-Thru Intercom System', 'Retro 8-Bit Arcade Cabinets', 'VIP Banquet Lounges', 'Hype Broadcast Screens'],
    currentEventTitle: '24-Hour Burger Flipping Relay & Charity Stream',
    ambianceStyle: 'from-red-950/80 via-stone-900 to-yellow-950/80'
  },
  {
    id: 'hub_waitangi_grove',
    name: 'Waitangi Marae & Celestial Starlight Grove',
    brandTheme: 'NZ',
    icon: '🌿',
    bannerEmoji: '🏉',
    coords: { x: 12, y: 6 },
    activePlayersCount: 48,
    featuredTemplate: 'roleplay',
    voiceChannelMhz: '144.70 MHz (Awa River Sanctuary)',
    description: 'Peaceful Pacific coastal sanctuary surrounded by native silver ferns, carved Wharenui meeting houses, and geothermal healing hot springs under the Southern Cross.',
    amenities: ['Sacred Pounamu Jade Carving Tables', 'Bonfire Storytelling Circle', 'Haka Performance Ground', 'Hot Springs Regeneration'],
    currentEventTitle: 'Aotearoa Cultural Storytelling & Taonga Carving',
    ambianceStyle: 'from-teal-950/80 via-stone-900 to-sky-950/80'
  },
  {
    id: 'hub_helios_pavilion',
    name: 'Helios Clean Energy Eco-Pavilion',
    brandTheme: 'BP',
    icon: '⚡',
    bannerEmoji: '🌻',
    coords: { x: 68, y: 9 },
    activePlayersCount: 39,
    featuredTemplate: 'celebration',
    voiceChannelMhz: '144.20 MHz (Helios Grid Tech)',
    description: 'State-of-the-art renewable energy demonstration park with interactive solar mirrors, hydrogen fuel cell displays, and rapid EV recharging lounges.',
    amenities: ['Rapid Battery Recharging Station', 'Solar Hovercraft Test Loop', 'Green Hydrogen Refueling Point', 'Wind Turbine Observation Deck'],
    currentEventTitle: 'Solar Grid Solstice Overcharge Demonstration',
    ambianceStyle: 'from-emerald-950/80 via-stone-900 to-green-950/80'
  },
  {
    id: 'hub_tarragower_hall',
    name: 'Tarragower STEAM Academy Great Hall',
    brandTheme: 'Tarragower',
    icon: '🎓',
    bannerEmoji: '🏛️',
    coords: { x: 34, y: 11 },
    activePlayersCount: 53,
    featuredTemplate: 'tournament',
    voiceChannelMhz: '144.60 MHz (Academic Forum)',
    description: 'Victorian-Gothic academy assembly hall equipped with redstone logic experiment tables, architectural drafting alcoves, and formal debate lecterns.',
    amenities: ['Redstone Logic Testing Pit', 'Blueprints Archive Terminal', 'Academic Debate Lecterns', 'Scholar Study Desks'],
    currentEventTitle: 'Annual Redstone Logic Gate Olympiad',
    ambianceStyle: 'from-indigo-950/80 via-stone-900 to-blue-950/80'
  },
  {
    id: 'hub_bloxian_colosseum',
    name: 'Bloxian Obby Colosseum & Sky Arena',
    brandTheme: 'Roblox',
    icon: '👟',
    bannerEmoji: '🟥',
    coords: { x: 82, y: 18 },
    activePlayersCount: 77,
    featuredTemplate: 'tournament',
    voiceChannelMhz: '144.50 MHz (Tournament Radio)',
    description: 'Suspended high in the clouds above the Crossroads, this colossal neon arena hosts speedrunning obstacle relay races and spectator stadium viewing.',
    amenities: ['100-Tier Parkour Obstacle Lanes', 'Spectator Stadium Seating', 'Live Speedrun Leaderboard Tower', 'Speed & Gravity Coil Racks'],
    currentEventTitle: 'Inter-Platform Obby Speedrun World Finals',
    ambianceStyle: 'from-purple-950/80 via-stone-900 to-rose-950/80'
  },
  {
    id: 'hub_lego_plaza',
    name: 'LEGO® Master Builder Brick Plaza',
    brandTheme: 'LEGO',
    icon: '🧱',
    bannerEmoji: '🎨',
    coords: { x: 58, y: 7 },
    activePlayersCount: 65,
    featuredTemplate: 'celebration',
    voiceChannelMhz: '144.40 MHz (Brick Builder Studio)',
    description: 'Vibrant play plaza featuring a giant snap-together brick building stage, digital stud fountains, and life-size Minifigure statues.',
    amenities: ['Modular Brick Building Pit', 'Interactive Stud Fountain', 'Minifigure Meet & Greet Area', 'Community MOC Exhibition Pedestals'],
    currentEventTitle: 'Multiverse Giant MOC Collaborative Build',
    ambianceStyle: 'from-red-950/80 via-stone-900 to-yellow-950/80'
  }
];

export default function CommunityEventHubsModal({
  isOpen,
  onClose,
  user,
  onWarpToLocation,
}: CommunityEventHubsModalProps) {
  const [selectedHub, setSelectedHub] = useState<CommunityHubLocation>(COMMUNITY_HUBS[0]);
  const [activeTab, setActiveTab] = useState<'hubs' | 'voice' | 'templates'>('hubs');
  const [selectedTemplateType, setSelectedTemplateType] = useState<'tournament' | 'roleplay' | 'celebration'>('tournament');
  
  // Simulated Voice Chat State in Hub
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isPushToTalk, setIsPushToTalk] = useState(false);
  const [activeFrequency, setActiveFrequency] = useState('144.10 MHz');
  const [voiceVolume, setVoiceVolume] = useState(85);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleWarp = (hub: CommunityHubLocation) => {
    audioEngine.playMinecraftSound('levelup');
    if (onWarpToLocation) {
      onWarpToLocation({ x: hub.coords.x, y: hub.coords.y, name: hub.name });
    }
    showToast(`🌌 Warping directly to ${hub.name}! Connected to voice channel ${hub.voiceChannelMhz}.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 font-mono select-none overflow-y-auto">
      <div className="bg-stone-900 border-2 border-emerald-500 rounded-3xl w-full max-w-5xl shadow-[0_20px_70px_rgba(16,185,129,0.3)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-emerald-800 via-stone-900 to-cyan-900 text-white border-b-2 border-emerald-500/60">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              🌐
            </div>
            <div>
              <h2 className="text-xl font-black text-white flex items-center gap-2">
                Persistent Community Event Hubs
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400">
                  Live Multi-Platform
                </span>
              </h2>
              <p className="text-xs text-stone-300">
                Persistent gathering areas with integrated spatial voice chat across all 8 platforms
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
          <div className="bg-emerald-500 text-stone-950 px-4 py-2 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-md">
            <Sparkles size={14} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 py-2.5 bg-stone-950 border-b border-stone-800 text-xs font-bold">
          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('hubs');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'hubs' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <MapPin size={14} />
            <span>1. Persistent Event Hubs ({COMMUNITY_HUBS.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('voice');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'voice' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Mic size={14} />
            <span>2. Proximity Voice Chat Console</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('templates');
            }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
              activeTab === 'templates' ? 'bg-emerald-600 text-white shadow' : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Trophy size={14} />
            <span>3. Event Hosting Templates (3 Types)</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 p-5 overflow-y-auto">
          {/* ================= TAB 1: PERSISTENT HUBS ================= */}
          {activeTab === 'hubs' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* Hub Cards List */}
              <div className="md:col-span-5 space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
                {COMMUNITY_HUBS.map(hub => (
                  <div
                    key={hub.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setSelectedHub(hub);
                    }}
                    className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center justify-between ${
                      selectedHub.id === hub.id
                        ? 'bg-emerald-950/50 border-emerald-400 shadow-md ring-1 ring-emerald-500/30'
                        : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{hub.icon}</span>
                      <div>
                        <h4 className="text-xs font-bold text-white truncate max-w-[190px]">{hub.name}</h4>
                        <div className="flex items-center gap-2 text-[10.5px] text-stone-400 pt-0.5">
                          <span className="text-emerald-400 font-bold">{hub.activePlayersCount} Online</span>
                          <span>•</span>
                          <span>{hub.brandTheme}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight size={16} className={selectedHub.id === hub.id ? 'text-emerald-400' : 'text-stone-600'} />
                  </div>
                ))}
              </div>

              {/* Selected Hub Inspector */}
              <div className="md:col-span-7 bg-stone-950 p-5 rounded-3xl border border-stone-800 flex flex-col justify-between shadow-inner">
                <div>
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${selectedHub.ambianceStyle} border border-stone-700/60 mb-4 shadow-md`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-3xl">{selectedHub.bannerEmoji}</span>
                      <span className="text-[10px] bg-black/60 px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-500/30">
                        Coords: ({selectedHub.coords.x}, {selectedHub.coords.y})
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{selectedHub.name}</h3>
                    <p className="text-xs text-stone-300 mt-1 leading-relaxed">{selectedHub.description}</p>
                  </div>

                  {/* Current Live Activity */}
                  {selectedHub.currentEventTitle && (
                    <div className="mb-4 p-3 bg-stone-900 rounded-2xl border border-amber-500/40 flex items-center gap-2.5">
                      <span className="text-xl">📢</span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                          Current Live Gathering
                        </span>
                        <div className="text-xs font-bold text-white">{selectedHub.currentEventTitle}</div>
                      </div>
                    </div>
                  )}

                  {/* Voice Chat Frequency */}
                  <div className="mb-4 p-3 bg-cyan-950/40 rounded-2xl border border-cyan-500/40 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Radio size={16} className="text-cyan-400 animate-pulse" />
                      <div>
                        <div className="font-bold text-cyan-200">Integrated Proximity Radio Channel</div>
                        <div className="text-[11px] text-cyan-300">{selectedHub.voiceChannelMhz}</div>
                      </div>
                    </div>
                    <span className="text-[10px] bg-cyan-900/60 text-cyan-200 px-2 py-1 rounded font-bold border border-cyan-400/40">
                      Auto-Tune
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="space-y-1.5 mb-4">
                    <span className="text-xs font-bold text-stone-300 uppercase tracking-wider">Hub Facilities & Amenities:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
                      {selectedHub.amenities.map((amenity, ai) => (
                        <div key={ai} className="flex items-center gap-1.5 p-1.5 bg-stone-900 rounded-xl border border-stone-800">
                          <span className="text-emerald-400">✓</span>
                          <span className="truncate">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-800 flex items-center justify-between">
                  <div className="text-xs text-stone-400">
                    Cross-Platform Synchronized • Open 24/7
                  </div>

                  <button
                    onClick={() => handleWarp(selectedHub)}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition shadow flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <ArrowRight size={14} />
                    <span>Fast Travel & Enter Hub</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: PROXIMITY VOICE CHAT ================= */}
          {activeTab === 'voice' && (
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isMicMuted ? 'bg-red-950 text-red-400 border border-red-500' : 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                    }`}>
                      {isMicMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Proximity Voice Radio Transceiver</h4>
                      <div className="text-xs text-stone-400">Low-latency spatial audio across all 8 platforms</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setIsMicMuted(!isMicMuted);
                      showToast(isMicMuted ? 'Microphone unmuted!' : 'Microphone muted.');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      isMicMuted ? 'bg-red-600 text-white border-red-400' : 'bg-stone-800 text-stone-300 border-stone-700'
                    }`}
                  >
                    {isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                  </button>
                </div>

                {/* Frequency Band Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-300">Hub Radio Frequency Channel:</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {[
                      { freq: '144.10 MHz', name: 'Plaza General' },
                      { freq: '144.30 MHz', name: 'Arcade Diner' },
                      { freq: '144.50 MHz', name: 'Tournament Callouts' },
                      { freq: '144.80 MHz', name: 'Roleplay Whispers' },
                    ].map(f => (
                      <button
                        key={f.freq}
                        onClick={() => {
                          audioEngine.playMinecraftSound('pop');
                          setActiveFrequency(f.freq);
                        }}
                        className={`p-2.5 rounded-xl border text-center transition cursor-pointer ${
                          activeFrequency === f.freq
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-400 font-bold'
                            : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                        }`}
                      >
                        <div>{f.freq}</div>
                        <div className="text-[10px] opacity-75">{f.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Radar: Simulated Nearby Wanderers */}
                <div className="p-4 bg-stone-900/60 rounded-2xl border border-stone-800 space-y-2">
                  <div className="text-xs font-bold text-stone-300 flex items-center justify-between">
                    <span>Nearby Wanderers on {activeFrequency}:</span>
                    <span className="text-emerald-400 text-[11px]">4 Speakers Active</span>
                  </div>

                  <div className="space-y-2 pt-1 text-xs">
                    {[
                      { name: 'Builderman (Crossroads)', dist: '4m (Loud)', platform: 'Roblox Client', speaking: true },
                      { name: 'Steve (Overworld Guild)', dist: '7m (Medium)', platform: 'Minecraft Bedrock', speaking: false },
                      { name: 'Polandball (Diplomat)', dist: '9m (Faint)', platform: 'Web Desktop', speaking: true },
                      { name: 'Streamer Nova (YouTube)', dist: '14m (Faint)', platform: 'Console', speaking: false },
                    ].map((speaker, si) => (
                      <div key={si} className="flex items-center justify-between p-2 rounded-xl bg-stone-950 border border-stone-800/80">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full ${speaker.speaking ? 'bg-emerald-400 animate-ping' : 'bg-stone-600'}`} />
                          <span className="font-bold text-white">{speaker.name}</span>
                          <span className="text-[10px] text-stone-500 bg-stone-900 px-1.5 py-0.5 rounded">{speaker.platform}</span>
                        </div>
                        <span className="text-[11px] font-mono text-cyan-300">{speaker.dist}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 3: EVENT TEMPLATES ================= */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex gap-2">
                {[
                  { id: 'tournament', name: '🏆 Tournament Template', desc: 'Brackets, timer, spectator stands & prize pool' },
                  { id: 'roleplay', name: '🎭 Role-Playing Template', desc: 'Podium mic, prompt board & campfires' },
                  { id: 'celebration', name: '🎉 Brand Celebration Template', desc: 'Banners, free gift drops & fireworks' },
                ].map(tmpl => (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTemplateType(tmpl.id as any)}
                    className={`flex-1 p-3 rounded-2xl border text-left transition cursor-pointer ${
                      selectedTemplateType === tmpl.id
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-400 font-bold'
                        : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="text-sm font-bold text-white">{tmpl.name}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{tmpl.desc}</div>
                  </button>
                ))}
              </div>

              {/* Template Configuration Viewer */}
              <div className="bg-stone-950 p-5 rounded-3xl border border-stone-800 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-800 pb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                      Configuring: {selectedTemplateType.toUpperCase()} EVENT TEMPLATE
                    </h4>
                    <p className="text-xs text-stone-400">Instantly deploy this event preset to any community hub</p>
                  </div>

                  <button
                    onClick={() => {
                      audioEngine.playMinecraftSound('levelup');
                      showToast(`Deployed ${selectedTemplateType} event template to ${selectedHub.name}!`);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition active:scale-95"
                  >
                    Deploy to Hub
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="font-bold text-amber-300">Rules & Enforcement:</span>
                    <ul className="space-y-1 text-stone-300 text-[11.5px]">
                      <li>• Safe neutral zone: No weapon PvP outside designated ring</li>
                      <li>• Automated countdown horn and bracket updates</li>
                      <li>• Smart contract prize escrow verification</li>
                    </ul>
                  </div>

                  <div className="p-3 bg-stone-900 rounded-2xl border border-stone-800 space-y-2">
                    <span className="font-bold text-cyan-300">Audio & Proximity Setup:</span>
                    <ul className="space-y-1 text-stone-300 text-[11.5px]">
                      <li>• Central stage podium voice boost (+12 dB amplification)</li>
                      <li>• Spectator noise cheer suppression filter</li>
                      <li>• Shouted announcements sent to all 8 platforms</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
