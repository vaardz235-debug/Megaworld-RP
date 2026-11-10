/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  MapPin, 
  Navigation, 
  Zap, 
  Search, 
  Filter, 
  X, 
  ChevronRight, 
  Globe, 
  Shield, 
  Sparkles, 
  Clock, 
  Users, 
  Crosshair, 
  Route, 
  Flag, 
  ExternalLink 
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { formatBlockNumber } from '../utils/commandEngine';
import ThreeMultiverseMap from './ThreeMultiverseMap';

export interface MultiverseZone {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Sodor' | 'Countryballs' | 'Sprunki' | 'Xilam' | 'NZ' | 'Tarragower' | 'BP' | 'McDonald\'s' | 'YouTube' | 'New World' | 'Christmas';
  brandBadge: string;
  colorHex: string;
  x: number;
  y: number;
  mapX: number; // Percentage 0-100 on visual map
  mapY: number; // Percentage 0-100 on visual map
  dangerLevel: 'Peaceful' | 'Low' | 'Moderate' | 'Hazardous' | 'Raid Tier';
  climate: string;
  leader: string;
  description: string;
  lore: string;
  availableQuests: string[];
  activeEvents: string[];
  transitLinks: string[];
  ambientSound: string;
}

export const MULTIVERSE_ZONES: MultiverseZone[] = [
  {
    id: 'zone_minecraft',
    name: 'Voxel Overworld & Nether Bastion',
    brand: 'Minecraft',
    brandBadge: '⛏️',
    colorHex: '#10b981',
    x: 0,
    y: 12,
    mapX: 50,
    mapY: 52,
    dangerLevel: 'Low',
    climate: 'Temperate Plains & Nether Lava Calderas',
    leader: 'Steve & Alex (Guild Masters)',
    description: 'The geometric bedrock heart of the multiverse. Home to diamond mining veins, redstone automated vaults, and obsidian portal arches to the Nether.',
    lore: 'Discovered during the Primordial Voxel Epoch. All dimensional coordinates converge upon Chunk (0,0) as the universal reference datum.',
    availableQuests: [
      'Construct the Netherite Fortress Watchtower',
      'Harvest 32 Obsidian Blocks',
      'Tame the Wild Ridge Wolves'
    ],
    activeEvents: [
      'Ender-Sharko & Void Titan Raid',
      'Netherite Mining Rush'
    ],
    transitLinks: ['Sodor Knapford Express Line 1', 'Subterranean Nether Minecart Rail', 'Overworld High Road'],
    ambientSound: 'overworld',
  },
  {
    id: 'zone_roblox',
    name: 'Robloxia Crossroads & Obby Cloud Spire',
    brand: 'Roblox',
    brandBadge: '🟥',
    colorHex: '#ef4444',
    x: 1250,
    y: 10,
    mapX: 72,
    mapY: 34,
    dangerLevel: 'Moderate',
    climate: 'Neon Stratosphere & Anti-Gravity Voids',
    leader: 'Builderman & Classic Noob',
    description: 'Floating neon obstacle courses, bouncy trampoline pads, speed coil raceways, and industrial tycoon assembly lines suspended above the clouds.',
    lore: 'Constructed by ancient Bloxian architects in 2006. Powered by pure physics defiance and iconic OOF harmonic resonance.',
    availableQuests: [
      'Conquer the 100-Tier Cloud Obby Obstacle Course',
      'Deliver Speed Coils to Builderman',
      'Fix the Broken Neon Trampoline'
    ],
    activeEvents: [
      'MegaWorld Bloxy Parkour Championship',
      'Low-Gravity Speedrun Challenge'
    ],
    transitLinks: ['Hyper Speed Coil Launchpad', 'Cloud Spire Gliderway', 'Knapford Line 4'],
    ambientSound: 'roblox',
  },
  {
    id: 'zone_sodor',
    name: 'Knapford Central Railway Hub & Steamworks',
    brand: 'Sodor',
    brandBadge: '🚂',
    colorHex: '#2563eb',
    x: 450,
    y: 8,
    mapX: 62,
    mapY: 58,
    dangerLevel: 'Peaceful',
    climate: 'Rolling English Meadows & Ocean Coastal Mist',
    leader: 'Sir Topham Hatt & Thomas The Tank Engine',
    description: 'The grand glass-domed central junction connecting 26 Really Useful steam and diesel locomotives. Turntables, coal bunkers, and dual mainlines.',
    lore: 'Chartered by the North Western Railway to unite all cross-realm travelers through heavy freight and passenger express services.',
    availableQuests: [
      'Clear the Mainline Express Route to Geneva',
      'Stock Gordon’s Tender with Steam Coal',
      'Switch the Turntable Points for Percy'
    ],
    activeEvents: [
      'The Continental Melody Express Crossover',
      'Great Railway Steam Gala'
    ],
    transitLinks: ['All-Continent Express Mainline', 'Coastal Tramway', 'Industrial Shunting Spur'],
    ambientSound: 'train',
  },
  {
    id: 'zone_countryballs',
    name: 'Geneva Sovereign Embassy & Spaceport',
    brand: 'Countryballs',
    brandBadge: '🌐',
    colorHex: '#3b82f6',
    x: -800,
    y: 8,
    mapX: 32,
    mapY: 46,
    dangerLevel: 'Peaceful',
    climate: 'Alpine Lake & Continental Gardens',
    leader: 'Polandball & Sovereign Council',
    description: 'International diplomatic council chambers for 48 sovereign nations. Features border trade customs, treaty desks, and Poland’s Space Rocket Launchpad.',
    lore: 'Established after the Treaty of Non-Aggression to preserve sovereign clay and ensure free exchange of customs and cultural goods.',
    availableQuests: [
      'Negotiate the Multiverse Free Trade Pact',
      'Fuel Polandball’s Space Rocket V2',
      'Resolve the Border Clay Territorial Dispute'
    ],
    activeEvents: [
      'Countryballs United Fireworks Festival',
      'Global Peace Assembly'
    ],
    transitLinks: ['Diplomatic High-Speed Maglev', 'Orbital Space Elevator', 'Knapford Line 2'],
    ambientSound: 'countryball',
  },
  {
    id: 'zone_sprunki',
    name: 'Sprunki Soundstage & Starlight Beat Grove',
    brand: 'Sprunki',
    brandBadge: '🔮',
    colorHex: '#a855f7',
    x: -350,
    y: 10,
    mapX: 42,
    mapY: 38,
    dangerLevel: 'Moderate',
    climate: 'Cosmic Nebula & Neon Harmonic Bloom',
    leader: 'Oren, Raddy & Vineria',
    description: 'Vibrant Incredibox acoustic studio where melodic synth pads, bass drops, and starlight auras resonate. Shifts between cheerful Pop and shadowy Void Horror.',
    lore: 'Formed when a celestial soundwave crystallized in the upper atmosphere, granting vocal consciousness to the musical beatboxers.',
    availableQuests: [
      'Harmonize the 8-Track Incredibox Symphony',
      'Purify the Void Horror Acoustic Echoes',
      'Collect 10 Celestial Treble Clefs'
    ],
    activeEvents: [
      'Multiverse 110-BPM Jam Session',
      'Midnight Horror Beat Showcase'
    ],
    transitLinks: ['Acoustic Soundwave Slide', 'Starlight Leyline Path', 'Western Valley Trail'],
    ambientSound: 'sprunki',
  },
  {
    id: 'zone_xilam',
    name: 'Xilam Slapstick Rubberhouse Villa',
    brand: 'Xilam',
    brandBadge: '💥',
    colorHex: '#f59e0b',
    x: 950,
    y: 8,
    mapX: 66,
    mapY: 66,
    dangerLevel: 'Hazardous',
    climate: 'Subtropical Palms & Volcanic Lagoon',
    leader: 'Oggy, Jack, Sharko & Marina',
    description: 'A sprawling cartoon villa featuring endless staircases, giant refrigerators, spring-loaded boxing traps, and Sharko’s sun-drenched volcanic lagoon.',
    lore: 'Where cartoon slapstick physics reign supreme: anvils fall, mallets squeak, and characters bounce back instantly from 10-ton impacts.',
    availableQuests: [
      'Solve the Case of the Missing 10-Ton Slapstick Mallet',
      'Protect Oggy’s Fridge from Joey & Dee Dee',
      'Build Sharko’s Sand Castle Watchtower'
    ],
    activeEvents: [
      'Grand Cartoon Slapstick Chase',
      'Sharko Lagoon Lifeguard Relay'
    ],
    transitLinks: ['Springboard Catapult Network', 'Lagoon Ferry Line', 'Villa Garden Promenade'],
    ambientSound: 'xilam',
  },
  {
    id: 'zone_nz',
    name: 'Waitangi Coastal Haven & Sacred Taonga Grove',
    brand: 'NZ',
    brandBadge: '🌿',
    colorHex: '#0284c7',
    x: 1600,
    y: 6,
    mapX: 84,
    mapY: 68,
    dangerLevel: 'Low',
    climate: 'Temperate Coastal Rainforest & Glacial Fjords',
    leader: 'Chief Tamati & Wayfinder Maui',
    description: 'Sacred riverbanks rich with Pounamu greenstone, giant Silver Fern canopies, Aoraki Mount Cook peaks, and sacred Polynesian voyaging canoes.',
    lore: 'Guided by the Southern Cross stars, the ancestral navigators charted the southern seas to protect the sacred taonga of Aotearoa.',
    availableQuests: [
      'Solve the Ancient Māori Wayfinding Star Chart',
      'Harvest Sacred Pounamu Jade from the Awa',
      'Participate in the Ka Mate Haka of Unity'
    ],
    activeEvents: [
      'Southern Cross Wayfinder Regatta',
      'Silver Fern Rugby Championship'
    ],
    transitLinks: ['Oceanic Waka Voyaging Route', 'Fjord Mountain Trail', 'Southern Railway Spur'],
    ambientSound: 'nz',
  },
  {
    id: 'zone_tarragower',
    name: 'Tarragower School Quadrangle & Science Academy',
    brand: 'Tarragower',
    brandBadge: '🏛️',
    colorHex: '#6366f1',
    x: 200,
    y: 8,
    mapX: 56,
    mapY: 48,
    dangerLevel: 'Peaceful',
    climate: 'Academic Parklands & Solar Greenhouses',
    leader: 'Headmaster Vance & Academy Scholars',
    description: 'Historic stone quadrangles, redstone engineering labs, the Grand Clock Tower, and the Academy Hall of Wisdom and Logic Schematics.',
    lore: 'Founded in New Zealand to cultivate architectural mastery, scientific inquiry, and multiversal engineering ethics.',
    availableQuests: [
      'Solve the Ancient Clock Tower Logic Schematic',
      'Calibrate the Redstone Laboratory Sensor Array',
      'Transcribe 5 Classical Library Manuscripts'
    ],
    activeEvents: [
      'Annual Multiverse Science Fair',
      'Tarragower Winter Caroler Recital'
    ],
    transitLinks: ['Academy Transit Tram', 'Clock Tower Observation Bridge', 'Overworld Central Path'],
    ambientSound: 'tarragower',
  },
  {
    id: 'zone_bp',
    name: 'BP Solaris Clean Energy Farm & Bio-Cell Hub',
    brand: 'BP',
    brandBadge: '⚡',
    colorHex: '#059669',
    x: -600,
    y: 10,
    mapX: 36,
    mapY: 62,
    dangerLevel: 'Low',
    climate: 'Sunny Solar Basin & Geothermal Plains',
    leader: 'Chief Engineer Sarah & Helios Technicians',
    description: 'Massive rotating photovoltaic solar collectors, biofuel refineries, and geothermal deep-core stations powering regional server cities with zero emissions.',
    lore: 'Built to replace fossil smoke with clean photon arrays, safeguarding the overworld atmosphere against toxic smog.',
    availableQuests: [
      'Calibrate the Winter Solstice Solar Inverters',
      'Reroute Geothermal Steam to the Village Grid',
      'Synthesize High-Grade Bio-Photon Fuel Cells'
    ],
    activeEvents: [
      'The Eco-Automaton Power Grid Calibration',
      'Solar Clean Energy Marathon'
    ],
    transitLinks: ['Photon Superconducting Pipeline', 'Clean Transit Monorail', 'Knapford Power Spur'],
    ambientSound: 'bp',
  },
  {
    id: 'zone_mcdonalds',
    name: 'McDonald\'s Golden Citadel & Mega Drive-Thru',
    brand: 'McDonald\'s',
    brandBadge: '🍟',
    colorHex: '#eab308',
    x: 650,
    y: 8,
    mapX: 68,
    mapY: 50,
    dangerLevel: 'Peaceful',
    climate: 'Sizzling Culinary Boulevard & Playground Dunes',
    leader: 'Chef Ronald & Grimace',
    description: 'Towering 200-foot Golden Arches monument, massive automated banquet fryers, shake fountains, and a 4-lane cross-realm drive-thru depot.',
    lore: 'Spreading wholesome cheer, golden crispy potatoes, and nutritious happy meals to every weary traveler crossing the multiverse.',
    availableQuests: [
      'Deliver 50 Holiday Happy Meals to Sodor Hub',
      'Brew the Secret Recipe Peppermint Shake',
      'Stock 100 Fresh Sesame Buns in the Vault'
    ],
    activeEvents: [
      'The Global 24-Hour Charity Stream & Drive-Thru Relay',
      'Golden Happy Meal Treasure Hunt'
    ],
    transitLinks: ['Drive-Thru Skyway Express', 'Banquet Freight Conveyor', 'Knapford Fast Spur'],
    ambientSound: 'mcdonalds',
  },
  {
    id: 'zone_youtube',
    name: 'YouTube Creator Studio & Broadcast Amphitheater',
    brand: 'YouTube',
    brandBadge: '▶️',
    colorHex: '#dc2626',
    x: -1100,
    y: 12,
    mapX: 24,
    mapY: 36,
    dangerLevel: 'Low',
    climate: 'Digital Neon Stage & Acoustic Soundstage',
    leader: 'Streamer Nova & 10M Creator Guild',
    description: 'A 100,000-seat amphitheater surrounded by 4K broadcast cameras, holographic subscriber counters, and the gleaming Diamond Play Button monument.',
    lore: 'The cultural broadcasting beacon of the multiverse, streaming community builds, speedruns, and charity challenges to millions of viewers.',
    availableQuests: [
      'Host the 10M Subscriber Multiverse Charity Livestream',
      'Calibrate 4K Studio Broadcast Cameras',
      'Unbox the Mythic Diamond Play Button'
    ],
    activeEvents: [
      'YouTube Holiday 24/7 Charity Marathon',
      'Viral UGC Creator Showcase'
    ],
    transitLinks: ['Fiber Optic Transit Tunnel', 'Studio Broadcast Monorail', 'Western Sky Highway'],
    ambientSound: 'youtube',
  },
  {
    id: 'zone_newworld',
    name: 'New World Aeternum Fort Bastion & Azoth Well',
    brand: 'New World',
    brandBadge: '⚔️',
    colorHex: '#d97706',
    x: 2100,
    y: 14,
    mapX: 92,
    mapY: 42,
    dangerLevel: 'Raid Tier',
    climate: 'Ethereal Blue Azoth Rifts & Ancient Runic Ruins',
    leader: 'Commander Thorne & Pioneer Vanguard',
    description: 'Towering stone fortresses fortified with ballistas and siege cannons, guarding the luminescent blue fountains of magical Azoth.',
    lore: 'Discovered on the mysterious island of Aeternum. The vanguard fights endless wars against corrupted shadows to preserve eternal vitality.',
    availableQuests: [
      'Purge the Corrupted Azoth Rift at Bastion Keep',
      'Forge Netherite-Azoth Vanguard Platemail',
      'Capture and Defend the Frontier Fort Flag'
    ],
    activeEvents: [
      'Winter Convergence Azoth Rift Defense',
      '50v50 Fort Everfall Territory Siege'
    ],
    transitLinks: ['Azoth Portal Warp Circle', 'Frontier Wagon Trail', 'Eastern Fortress Highway'],
    ambientSound: 'newworld',
  },
  {
    id: 'zone_christmas',
    name: 'North Pole Santa Toy Workshop & Aurora Spire',
    brand: 'Christmas',
    brandBadge: '🎅',
    colorHex: '#16a34a',
    x: -1600,
    y: 6,
    mapX: 14,
    mapY: 20,
    dangerLevel: 'Peaceful',
    climate: 'Sub-Zero Blizzard, Frosted Pines & Aurora Australis',
    leader: 'Santa Steve, Elf Alex & Rudolph Creeper',
    description: 'The enchanted winter wonderland of Santa’s clockwork toy factory, glowing peppermint candy cane forests, reindeer flight strip, and the Golden Holiday Star.',
    lore: 'Where holiday magic converges across all 11 IPs, crafting presents, golden bells, and delivering seasonal joy to every corner of the universe.',
    availableQuests: [
      'Deliver 100 Wrapped Gift Boxes to All Biomes',
      'Tune the North Pole Toy Train Assembly Line',
      'Craft Peppermint Candy Canes for the Elves'
    ],
    activeEvents: [
      'The Great Multiverse Winter Convergence Boss Raid',
      'Santa\'s Sleigh Express Delivery Relay'
    ],
    transitLinks: ['Flying Reindeer Polar Skyway', 'Polar Express Steam Line', 'Blizzard Sled Trail'],
    ambientSound: 'christmas',
  },
  {
    id: 'zone_central_hub',
    name: 'Central Multiverse Gateway & Grand Crossroads',
    brand: 'Tarragower',
    brandBadge: '🌟',
    colorHex: '#38bdf8',
    x: 100,
    y: 8,
    mapX: 50,
    mapY: 50,
    dangerLevel: 'Peaceful',
    climate: 'Celestial Harmonic Nexus & Floating Crystal Spires',
    leader: 'Grand Custodian & Multiverse Gatekeeper',
    description: 'The omni-directional nexus connecting all 11 brand realms. Features 12 warp arches, the Universal Sprus Exchange, real-estate deed auction hall, and transit monorails to every dimension.',
    lore: 'Forged at the genesis of the United Games and Apps realm to allow instant transit between Minecraft, Roblox, Xilam, Sodor, McDonaldland, and Aeternum.',
    availableQuests: [
      'Attune the 12 Dimensional Warp Arches',
      'Exchange 1,000 Sprus at the Global Treasury',
      'Inspect the High-Speed Trans-Multiverse Rail Terminal'
    ],
    activeEvents: [
      'Multiverse Grand Expo & Trade Gala',
      'Gateway Hourly Fireworks Celebration'
    ],
    transitLinks: ['Direct Portals to all 16 Zones', 'Orbital Skyway', 'Knapford Grand Express Terminal'],
    ambientSound: 'tarragower',
  },
  {
    id: 'zone_mcdonalds_playplace',
    name: 'McDonaldland Ball Pit & Happy Meal PlayPlace',
    brand: 'McDonald\'s',
    brandBadge: '🍔',
    colorHex: '#facc15',
    x: 820,
    y: 9,
    mapX: 74,
    mapY: 58,
    dangerLevel: 'Peaceful',
    climate: 'Neon Playground & Soft-Play Tube Habitats',
    leader: 'Mayor McCheese & Grimace',
    description: 'A 5-story colorful indoor plastic tubing adventure zone with giant slide spirals, 10,000 bouncy plastic balls, shake dispenser geysers, and arcade ticket machines.',
    lore: 'Built for younger explorers and joyous parkourists to burn energy and earn Sprus coins while navigating soft obstacle mazes.',
    availableQuests: [
      'Navigate the 5-Story Ball Pit Maze without Touching the Floor',
      'Collect 25 Golden Happy Meal Tokens in the Tube Spiral',
      'Repair the Grimace Purple Shake Geyser'
    ],
    activeEvents: [
      'The Great Ball Pit Scavenger Dash',
      'Happy Meal Mystery Toy Unboxing Gala'
    ],
    transitLinks: ['Spiral Tube Slide Exit', 'Drive-Thru Skybridge', 'Central Gateway Express'],
    ambientSound: 'mcdonalds',
  },
  {
    id: 'zone_newworld_windsward',
    name: 'New World Windsward Windmills & Settler Homesteads',
    brand: 'New World',
    brandBadge: '⚔️',
    colorHex: '#ea580c',
    x: 2350,
    y: 11,
    mapX: 96,
    mapY: 52,
    dangerLevel: 'Moderate',
    climate: 'Rolling Sunlit Grasslands & Giant Windmill Breezes',
    leader: 'Governor Hawthorne & Homestead Pioneer Guild',
    description: 'Picturesque agrarian farmlands surrounding historic creaking timber windmills, wheat fields, iron forge smithies, and player-owned homestead cottages.',
    lore: 'The agricultural breadbasket of Aeternum, where settlers cultivate crops, brew Azoth-infused remedies, and construct virtual real estate estates.',
    availableQuests: [
      'Harvest 100 Golden Sheaves of Windsward Wheat',
      'Refine 20 Starmetal Ingots at the Settler Forge',
      'Repel Corrupted Stalkers from the Windmill Crest'
    ],
    activeEvents: [
      'Windsward Harvest Festival & Ale Tasting',
      'Homestead Virtual Real-Estate Auction'
    ],
    transitLinks: ['Pioneer Wagon Way', 'Azoth Spirit Portal', 'Everfall Bastion Highway'],
    ambientSound: 'newworld',
  },
  {
    id: 'zone_xilam_hollywood',
    name: 'Xilam Slapstick Hollywood Animation Studios',
    brand: 'Xilam',
    brandBadge: '🎬',
    colorHex: '#fbbf24',
    x: 1120,
    y: 7,
    mapX: 78,
    mapY: 72,
    dangerLevel: 'Low',
    climate: 'Technicolor Spotlight & Cartoon Soundstage',
    leader: 'Director Jack & Sharko Showrunner',
    description: 'Active animation soundstages with rolling cartoon backdrops, mechanical anvil-dropper rigs, oversized rubber mallets, and dynamic cartoon sound-effect pedals.',
    lore: 'Where the timeless slapstick gags of Oggy, Zig & Sharko, and Space Goofs are hand-drawn at 60 FPS and animated for global audiences.',
    availableQuests: [
      'Rig 5 Falling Anvil Traps for the Film Climax',
      'Synchronize the Slapstick Sound-Effect Foley Pedals',
      'Chase Joey & Marky Across the Paint Dept'
    ],
    activeEvents: [
      'Golden Cartoon Clapperboard Film Festival',
      'Slapstick Stunt Doubles Obstacle Race'
    ],
    transitLinks: ['Studio Tram Tour', 'Catapult Soundstage Chute', 'Rubberhouse Villa Path'],
    ambientSound: 'xilam',
  },
  {
    id: 'zone_roblox_bloxburg',
    name: 'Bloxburg High-Tech Cyber-Tycoon & Suburbs',
    brand: 'Roblox',
    brandBadge: '🏙️',
    colorHex: '#3b82f6',
    x: 1480,
    y: 8,
    mapX: 82,
    mapY: 26,
    dangerLevel: 'Peaceful',
    climate: 'Metropolitan Neon & High-Rise Sunsets',
    leader: 'Tycoon Architect Shedletsky',
    description: 'A bustling user-generated content metropolis of player-built mansions, robotic pizza delivery scooters, high-speed neon highways, and customizable server estates.',
    lore: 'The epicenter of virtual commerce where creators buy land, build dream homes, hire friends for business ventures, and trade custom furniture assets.',
    availableQuests: [
      'Deliver 10 High-Tech Pizzas on a Bloxian Moped',
      'Construct a 3-Story Modernist Luxury Villa',
      'Automate the Robotic Factory Assembly Line'
    ],
    activeEvents: [
      'Bloxburg Architectural Design Competition',
      'High-Speed Neon Supercar Street Drag'
    ],
    transitLinks: ['High-Speed Elevated Monorail', 'Suburban Highway 101', 'Cloud Spire Gliderway'],
    ambientSound: 'roblox',
  },
  {
    id: 'zone_minecraft_deepdark',
    name: 'Minecraft Deep Dark Ancient City & Sculk Catacombs',
    brand: 'Minecraft',
    brandBadge: '⛏️',
    colorHex: '#0891b2',
    x: -220,
    y: 22,
    mapX: 44,
    mapY: 64,
    dangerLevel: 'Hazardous',
    climate: 'Subterranean Pitch-Black & Eerie Sculk Luminescence',
    leader: 'Ancient Sculk Warden Guardian',
    description: 'A colossal sunken metropolis carved into deepslate at Y=-52. Silent echoing corridors carpeted with sculk shrieker sensors and soul-fire lanterns.',
    lore: 'Built by an extinct race of ancient miners who uncovered the forbidden resonance of the dark dimension before the Warden arose.',
    availableQuests: [
      'Sneak past 3 Sculk Shriekers without Triggering the Warden',
      'Loot the Reinforced Deepslate Secret Laboratory Chest',
      'Harvest 16 Soul-Catalyst Shards'
    ],
    activeEvents: [
      'Echoes of the Void: Warden Survival Trial',
      'Ancient City Swift Sneak Speedrun'
    ],
    transitLinks: ['Subterranean Minecart Chasm', 'Nether Portal Tunnel', 'Central Overworld Spelunking Shaft'],
    ambientSound: 'overworld',
  },
];

interface InteractiveWorldMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerX: number;
  playerY: number;
  onFastTravel: (x: number, y: number) => void;
  playerAvatarName?: string;
}

export default function InteractiveWorldMapModal({
  isOpen,
  onClose,
  playerX,
  playerY,
  onFastTravel,
  playerAvatarName = 'Player',
}: InteractiveWorldMapModalProps) {
  const [selectedZone, setSelectedZone] = useState<MultiverseZone>(MULTIVERSE_ZONES[0]);
  const [activeBrandFilter, setActiveBrandFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isRoutePlotted, setIsRoutePlotted] = useState<boolean>(true);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [mapPan, setMapPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapMode, setMapMode] = useState<'3d' | '2d'>('3d');

  if (!isOpen) return null;

  // Filtered zones
  const filteredZones = MULTIVERSE_ZONES.filter((zone) => {
    const matchesBrand = activeBrandFilter === 'all' || 
      (activeBrandFilter === 'brand_corps' && ['BP', 'McDonald\'s', 'YouTube', 'New World'].includes(zone.brand)) ||
      (activeBrandFilter === 'nz_tarragower' && ['NZ', 'Tarragower'].includes(zone.brand)) ||
      zone.brand.toLowerCase() === activeBrandFilter.toLowerCase();
    
    const matchesSearch = zone.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
      zone.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesBrand && matchesSearch;
  });

  // Calculate distance in blocks
  const distanceToSelected = Math.abs(playerX - selectedZone.x);

  // Approximate player map position
  // Map represents X from -2000 to +2500
  const normalizedPlayerMapX = Math.max(5, Math.min(95, ((playerX + 2000) / 4500) * 100));
  const normalizedPlayerMapY = 54; // approximate baseline

  const handleWarp = (zone: MultiverseZone) => {
    audioEngine.playMinecraftSound('levelup');
    onFastTravel(zone.x, zone.y);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none font-sans animate-fade-in">
      <div className="bg-stone-950 border-4 border-emerald-500/80 rounded-3xl w-full max-w-6xl h-[92vh] max-h-[850px] shadow-[0_20px_80px_rgba(16,185,129,0.35)] flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-600 to-sky-600 border border-emerald-400 flex items-center justify-center text-xl shadow-lg">
              🗺️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                  Multiverse Interactive World Map
                </h2>
                <span className="text-[10px] uppercase font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full">
                  13 Brand Zones
                </span>
                <span className="hidden sm:inline text-[10px] font-mono text-amber-300 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  🎄 Christmas Update
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Current Position: <span className="text-emerald-400 font-bold">X: {formatBlockNumber(playerX)}</span>, <span className="text-emerald-400 font-bold">Y: {playerY}</span> • Real-Time Navigation & Fast Travel
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 3D vs 2D Mode Switcher */}
            <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                onClick={() => {
                  audioEngine.playRobloxSound('click');
                  setMapMode('3d');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  mapMode === '3d'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow ring-1 ring-emerald-400'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="Full 3D Holographic Multiverse Map with 6-Axis Movement (Up, Down, Left, Right, Forward, Back)"
              >
                <span>🌐</span>
                <span>3D Multiverse</span>
              </button>
              <button
                onClick={() => {
                  audioEngine.playRobloxSound('click');
                  setMapMode('2d');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition ${
                  mapMode === '2d'
                    ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-400'
                    : 'text-stone-400 hover:text-white'
                }`}
                title="2D Tactical Overview Map"
              >
                <span>🗺️</span>
                <span>2D Tactical</span>
              </button>
            </div>

            {mapMode === '2d' && (
              <button
                onClick={() => {
                  setZoomLevel(1);
                  setMapPan({ x: 0, y: 0 });
                }}
                className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg text-xs font-mono border border-stone-700 cursor-pointer transition flex items-center gap-1"
                title="Reset Map View"
              >
                <Crosshair size={12} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center font-bold text-sm cursor-pointer transition"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Brand Filters Strip */}
        <div className="bg-stone-900/90 border-b border-stone-800/80 px-4 py-2 flex items-center gap-1.5 overflow-x-auto flex-shrink-0 text-xs font-mono scrollbar-none">
          <span className="text-stone-400 flex items-center gap-1 mr-1 text-[11px]">
            <Filter size={12} />
            <span>Filter:</span>
          </span>
          {[
            { id: 'all', label: 'All (13)', icon: '🌐' },
            { id: 'Christmas', label: '🎄 Christmas', icon: '🎅' },
            { id: 'Minecraft', label: 'Minecraft', icon: '⛏️' },
            { id: 'Roblox', label: 'Roblox', icon: '🟥' },
            { id: 'Sodor', label: 'Sodor Trains', icon: '🚂' },
            { id: 'Countryballs', label: 'Countryballs', icon: '🌐' },
            { id: 'Sprunki', label: 'Sprunki', icon: '🔮' },
            { id: 'Xilam', label: 'Xilam', icon: '💥' },
            { id: 'nz_tarragower', label: 'NZ & Tarragower', icon: '🌿' },
            { id: 'brand_corps', label: 'Brands (BP, McD, YT, NW)', icon: '🏢' },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => {
                audioEngine.playMinecraftSound('click');
                setActiveBrandFilter(btn.id);
              }}
              className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 font-bold ${
                activeBrandFilter === btn.id
                  ? 'bg-emerald-600 text-white shadow'
                  : 'bg-stone-800/80 hover:bg-stone-700 text-stone-300 border border-stone-700/60'
              }`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Area: Map Canvas (Left 65%) + Zone Details Drawer (Right 35%) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
          
          {/* MAP CANVAS VIEW (3D Holographic Multiverse with 6-Axis Movement or 2D Tactical) */}
          <div className="flex-1 relative bg-gradient-to-b from-stone-950 via-slate-950 to-stone-950 overflow-hidden flex flex-col justify-between">
            {mapMode === '3d' ? (
              <ThreeMultiverseMap
                zones={filteredZones}
                selectedZone={selectedZone}
                onSelectZone={(zone) => setSelectedZone(zone)}
                playerX={playerX}
                playerY={playerY}
                playerAvatarName={playerAvatarName}
                isRoutePlotted={isRoutePlotted}
                onFastTravel={(x, y) => {
                  audioEngine.playMinecraftSound('levelup');
                  onFastTravel(x, y);
                  onClose();
                }}
              />
            ) : (
              <>
                {/* Dynamic Interactive SVG Map Background */}
                <div 
                  className="absolute inset-0 select-none overflow-hidden"
                  style={{
                    transform: `scale(${zoomLevel}) translate(${mapPan.x}px, ${mapPan.y}px)`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s ease-out'
                  }}
                >
                  <svg className="w-full h-full" viewBox="0 0 1000 600" preserveAspectRatio="none">
                    <defs>
                      {/* Subtle Grid */}
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                      </pattern>
                      <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(16,185,129,0.15)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                      </radialGradient>
                      {/* Glowing Route Marker */}
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="4" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                    </defs>

                    <rect width="1000" height="600" fill="#0c0e12" />
                    <rect width="1000" height="600" fill="url(#grid)" />
                    <circle cx="500" cy="300" r="320" fill="url(#centerGlow)" />

                    {/* Multiverse Continental Ocean & Biome Blobs */}
                    <path 
                      d="M 50 150 Q 180 80 340 120 T 600 200 T 850 180 T 950 350 T 800 520 T 450 560 T 150 480 Z" 
                      fill="rgba(30, 41, 59, 0.4)" 
                      stroke="rgba(51, 65, 85, 0.6)" 
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Sub-Zero Northern Ice Shelf (Christmas) */}
                    <path 
                      d="M 20 50 Q 140 30 250 80 T 400 60 T 100 220 Z" 
                      fill="rgba(56, 189, 248, 0.12)" 
                      stroke="rgba(56, 189, 248, 0.4)" 
                      strokeWidth="2"
                    />

                    {/* Inter-Realm High-Speed Railway Splines */}
                    <path 
                      d="M 140 120 L 320 276 L 500 312 L 620 348 L 720 204 L 920 252" 
                      fill="none" 
                      stroke="rgba(245, 158, 11, 0.35)" 
                      strokeWidth="2.5" 
                      strokeDasharray="6 6"
                    />
                    <path 
                      d="M 500 312 L 420 228 L 360 372 L 660 396 L 840 408" 
                      fill="none" 
                      stroke="rgba(59, 130, 246, 0.3)" 
                      strokeWidth="2" 
                      strokeDasharray="4 4"
                    />

                    {/* Dynamic Plotted Travel Route from Player to Selected Zone */}
                    {isRoutePlotted && (
                      <g filter="url(#glow)">
                        <line 
                          x1={normalizedPlayerMapX * 10} 
                          y1={normalizedPlayerMapY * 6} 
                          x2={selectedZone.mapX * 10} 
                          y2={selectedZone.mapY * 6} 
                          stroke="#10b981" 
                          strokeWidth="3.5" 
                          strokeDasharray="8 6"
                          className="animate-pulse"
                        />
                        {/* Animated Midpoint Indicator */}
                        <circle 
                          cx={((normalizedPlayerMapX + selectedZone.mapX) / 2) * 10} 
                          cy={((normalizedPlayerMapY + selectedZone.mapY) / 2) * 6} 
                          r="5" 
                          fill="#34d399" 
                        />
                      </g>
                    )}
                  </svg>
                </div>

                {/* Interactive Multiverse Zone Pins */}
                <div className="absolute inset-0 pointer-events-none">
                  {filteredZones.map((zone) => {
                    const isSelected = selectedZone.id === zone.id;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setSelectedZone(zone);
                        }}
                        className={`absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer group transition-all duration-300 flex flex-col items-center ${
                          isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-20'
                        }`}
                        style={{
                          left: `${zone.mapX}%`,
                          top: `${zone.mapY}%`,
                        }}
                        title={`${zone.name} (${zone.brand}) • Coordinates: X: ${zone.x}, Y: ${zone.y}`}
                      >
                        {/* Outer Glow Ring */}
                        <div 
                          className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg border-2 shadow-2xl transition ${
                            isSelected 
                              ? 'ring-4 ring-white animate-bounce' 
                              : 'border-white/30 group-hover:border-white'
                          }`}
                          style={{
                            backgroundColor: isSelected ? zone.colorHex : '#1c1917',
                            borderColor: zone.colorHex,
                            boxShadow: `0 0 20px ${zone.colorHex}80`,
                          }}
                        >
                          <span>{zone.brandBadge}</span>
                        </div>

                        {/* Zone Label Pill */}
                        <div className="mt-1 px-2 py-0.5 rounded-md bg-stone-900/95 border border-white/20 text-[10px] font-mono font-bold text-white whitespace-nowrap shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: zone.colorHex }} />
                          <span className="truncate max-w-[120px]">{zone.name.split(' ')[0]}</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Player Avatar Live Location Marker */}
                  <div 
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none transition-all duration-500 flex flex-col items-center animate-pulse"
                    style={{
                      left: `${normalizedPlayerMapX}%`,
                      top: `${normalizedPlayerMapY}%`,
                    }}
                  >
                    <div className="w-9 h-9 rounded-full bg-cyan-500 border-3 border-white shadow-[0_0_25px_#06b6d4] flex items-center justify-center text-base">
                      📍
                    </div>
                    <div className="mt-0.5 px-2 py-0.5 rounded bg-cyan-950/95 border border-cyan-400 text-[10px] font-mono font-black text-cyan-200 shadow whitespace-nowrap">
                      YOU ({playerAvatarName})
                    </div>
                  </div>
                </div>

                {/* Map HUD Overlay Controls */}
                <div className="relative z-20 p-3 flex justify-between items-start pointer-events-none">
                  {/* Compass Rose */}
                  <div className="bg-stone-900/90 border border-stone-800 rounded-2xl p-2.5 shadow-xl pointer-events-auto backdrop-blur-md flex items-center gap-2">
                    <Compass className="text-amber-400 animate-spin" style={{ animationDuration: '30s' }} size={24} />
                    <div className="text-[10px] font-mono leading-tight">
                      <div className="text-white font-bold">MULTIVERSE NAV</div>
                      <div className="text-stone-400">Scale: 1:1 Voxel Grid</div>
                    </div>
                  </div>

                  {/* Search Bar */}
                  <div className="w-64 max-w-[50%] relative pointer-events-auto">
                    <Search size={14} className="absolute left-3 top-2.5 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search 13 zones..."
                      className="w-full bg-stone-900/90 border border-stone-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-stone-500 font-mono focus:outline-none focus:border-emerald-500 shadow"
                    />
                  </div>
                </div>

                {/* Bottom Map Bar: Route Plotter & Zoom */}
                <div className="relative z-20 p-3 flex justify-between items-end pointer-events-none">
                  <button
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setIsRoutePlotted(!isRoutePlotted);
                    }}
                    className={`pointer-events-auto px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 shadow transition cursor-pointer ${
                      isRoutePlotted 
                        ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                        : 'bg-stone-900/80 border-stone-700 text-stone-400'
                    }`}
                  >
                    <Route size={14} />
                    <span>{isRoutePlotted ? 'Route Spline Active' : 'Show Route Spline'}</span>
                  </button>

                  <div className="flex items-center gap-1 bg-stone-900/90 border border-stone-800 p-1 rounded-xl pointer-events-auto shadow">
                    <button
                      onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
                      className="w-7 h-7 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <span className="text-[10px] font-mono font-bold px-1.5 text-stone-300">
                      {Math.round(zoomLevel * 100)}%
                    </span>
                    <button
                      onClick={() => setZoomLevel((z) => Math.min(2.0, z + 0.25))}
                      className="w-7 h-7 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-xs font-bold transition flex items-center justify-center cursor-pointer"
                      title="Zoom In"
                    >
                      +
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ZONE DETAILS DRAWER (Right Side) */}
          <div className="w-full md:w-[380px] bg-stone-900 border-t md:border-t-0 md:border-l border-stone-800 flex flex-col justify-between overflow-y-auto p-4 sm:p-5 flex-shrink-0 font-mono">
            
            {/* Header info for selected zone */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-stone-800 pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider mb-1">
                    <span>{selectedZone.brandBadge}</span>
                    <span>{selectedZone.brand} Realm</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                    {selectedZone.name}
                  </h3>
                </div>
                <div 
                  className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border shadow-sm"
                  style={{
                    backgroundColor: `${selectedZone.colorHex}25`,
                    borderColor: selectedZone.colorHex,
                    color: selectedZone.colorHex,
                  }}
                >
                  {selectedZone.dangerLevel}
                </div>
              </div>

              {/* Coordinates & Distance Metrics */}
              <div className="grid grid-cols-2 gap-2 bg-stone-950/80 border border-stone-800/80 p-3 rounded-2xl">
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Zone Coordinates</div>
                  <div className="text-sm font-black text-emerald-400">
                    X: {formatBlockNumber(selectedZone.x)}, Y: {selectedZone.y}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-stone-400 uppercase font-bold">Distance From You</div>
                  <div className="text-sm font-black text-amber-400">
                    {formatBlockNumber(distanceToSelected)} Blocks
                  </div>
                </div>
              </div>

              {/* Climate & Ruling Leader */}
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-stone-400">
                  <span>Biome & Climate:</span>
                  <span className="text-stone-200 font-bold">{selectedZone.climate}</span>
                </div>
                <div className="flex items-center justify-between text-stone-400">
                  <span>Ruling Champions:</span>
                  <span className="text-stone-200 font-bold">{selectedZone.leader}</span>
                </div>
              </div>

              {/* Description & Lore */}
              <div className="space-y-1 bg-stone-950/50 border border-stone-800/60 p-3 rounded-xl text-xs leading-relaxed text-stone-300">
                <p>{selectedZone.description}</p>
                <p className="text-[11px] text-stone-400 italic pt-1 border-t border-stone-800/50">
                  "{selectedZone.lore}"
                </p>
              </div>

              {/* Available Quests in Zone */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase">
                  <span>📜</span>
                  <span>Active Quests in Zone ({selectedZone.availableQuests.length})</span>
                </div>
                <div className="space-y-1">
                  {selectedZone.availableQuests.map((q, idx) => (
                    <div key={idx} className="bg-stone-950/60 border border-emerald-900/40 px-2.5 py-1.5 rounded-lg text-[11px] text-stone-200 flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span className="truncate">{q}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scheduled Events in Zone */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                  <span>⚡</span>
                  <span>Live Events & Raids ({selectedZone.activeEvents.length})</span>
                </div>
                <div className="space-y-1">
                  {selectedZone.activeEvents.map((evt, idx) => (
                    <div key={idx} className="bg-stone-950/60 border border-amber-900/40 px-2.5 py-1.5 rounded-lg text-[11px] text-amber-200 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping inline-block" />
                      <span className="truncate">{evt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Transit Links */}
              <div className="space-y-1 text-xs">
                <div className="text-stone-400 text-[10px] uppercase font-bold">Transit & Highway Links:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedZone.transitLinks.map((tl, idx) => (
                    <span key={idx} className="text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded border border-stone-700">
                      🛤️ {tl}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons: Fast Travel Warp */}
            <div className="pt-4 border-t border-stone-800 mt-4 space-y-2 flex-shrink-0">
              <button
                onClick={() => handleWarp(selectedZone)}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-[0_6px_25px_rgba(16,185,129,0.5)] border border-emerald-400 cursor-pointer transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Zap size={16} className="text-yellow-300 animate-bounce" />
                <span>Fast Travel Warp to {selectedZone.name.split(' ')[0]}</span>
              </button>

              <div className="text-center text-[10px] text-stone-500">
                Warping teleports player to X: {formatBlockNumber(selectedZone.x)}, Y: {selectedZone.y} instantly.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
