import { useState, useEffect } from 'react';
import CharacterAvatar, { CharacterData } from './CharacterAvatar';
import { 
  Sparkles, Swords, Flame, Skull, Music, Volume2, VolumeX, Play, Square, Plus, 
  Trash2, Shuffle, Disc3, Shield, Hammer, Zap, Heart, MessageSquare, Mic, Radio, 
  Send, Globe, BookOpen, Award, ExternalLink, Search, RefreshCw, BarChart2 
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { speechEngine } from '../utils/speechEngine';
import { COUNTRYBALLS_DATA, CountryballData, REGIONS_LIST } from '../data/countryballsData';
import { CountryballDossierModal, CountryballHoverPreview } from './CountryballDossier';

export const ALL_CHARACTERS: CharacterData[] = [
  // ================= MINECRAFT CHARACTERS =================
  { 
    id: 21, 
    name: 'Steve', 
    type: 'minecraft', 
    subtype: 'steve', 
    color: 'bg-cyan-600', 
    description: 'Iconic master builder and miner. Armed with diamond determination.' 
  },
  { 
    id: 22, 
    name: 'Alex', 
    type: 'minecraft', 
    subtype: 'alex', 
    color: 'bg-emerald-600', 
    description: 'Swift wilderness tracker with keen survival instincts.' 
  },
  { 
    id: 201, 
    name: 'Diamond Steve', 
    type: 'minecraft', 
    subtype: 'diamond_steve', 
    armorTier: 'diamond',
    heldWeapon: 'diamond_sword',
    cape: 'mojang',
    isEnchanted: true,
    color: 'bg-cyan-400', 
    description: 'Fully suited in enchanted Diamond armor, shimmering with magical resilience, wielding a glowing Diamond Sword and Mojang Red Cape!' 
  },
  { 
    id: 202, 
    name: 'Netherite Steve', 
    type: 'minecraft', 
    subtype: 'netherite_steve', 
    armorTier: 'netherite',
    heldWeapon: 'diamond_sword',
    cape: 'creeper',
    color: 'bg-stone-900', 
    description: 'Ancient Netherite plate armor forged in volcanic debris. Fireproof, knockback resistant, and radiating floating lava embers!' 
  },
  { 
    id: 203, 
    name: 'Herobrine', 
    type: 'minecraft', 
    subtype: 'herobrine', 
    heldWeapon: 'totem',
    cape: 'elytra',
    color: 'bg-sky-900', 
    description: 'The ancient myth with glowing pupilless white eyes, crackling lightning aura, dark void fog, and a Totem of Undying in hand.' 
  },
  { 
    id: 24, 
    name: 'Creeper', 
    type: 'minecraft', 
    subtype: 'creeper', 
    color: 'bg-green-600', 
    description: 'Silent stealth stalker with camouflage green pixel coat. Sssss... BOOM!' 
  },
  { 
    id: 204, 
    name: 'Charged Creeper', 
    type: 'minecraft', 
    subtype: 'creeper', 
    isCharged: true,
    color: 'bg-cyan-500', 
    description: 'Struck by lightning! Surrounded by a crackling cyan electric barrier with 10x devastating explosive shockwaves!' 
  },
  { 
    id: 25, 
    name: 'Enderman', 
    type: 'minecraft', 
    subtype: 'enderman', 
    color: 'bg-neutral-900', 
    description: 'Slender dimensional traveler with glowing fuchsia eyes and purple teleport particles. Holding a stolen Grass Block.' 
  },
  { 
    id: 205, 
    name: 'Iron Golem', 
    type: 'minecraft', 
    subtype: 'iron_golem', 
    heldWeapon: 'poppy',
    color: 'bg-stone-300', 
    description: 'Mighty iron village protector with vine-moss shoulders, ruby-red eyes, and a delicate red poppy flower held gently in hand.' 
  },
  { 
    id: 206, 
    name: 'Warden', 
    type: 'minecraft', 
    subtype: 'warden', 
    color: 'bg-teal-950', 
    description: 'Blind deep dark titan with vibrating sculk sensor horns, toothy maw, and a glowing soul heartbeat pulsing inside its ribcage.' 
  },
  { 
    id: 207, 
    name: 'Wither Skeleton', 
    type: 'minecraft', 
    subtype: 'wither_skeleton', 
    heldWeapon: 'stone_sword',
    color: 'bg-neutral-950', 
    description: 'Charred obsidian bones from Nether Fortresses with glowing coal eyes and a deadly withering stone blade.' 
  },
  { 
    id: 208, 
    name: 'Piglin', 
    type: 'minecraft', 
    subtype: 'piglin', 
    heldWeapon: 'gold_sword',
    color: 'bg-amber-700', 
    description: 'Nether gold enthusiast with floppy ears, tusks, leather strap harness, and a lustrous golden sword.' 
  },
  { 
    id: 209, 
    name: 'Drowned', 
    type: 'minecraft', 
    subtype: 'drowned', 
    heldWeapon: 'trident',
    color: 'bg-teal-600', 
    description: 'Sunken ocean zombie with glowing aqua eyes and clinging seaweed kelp, wielding an ancient 3-pronged sea trident.' 
  },
  { 
    id: 210, 
    name: 'Blaze', 
    type: 'minecraft', 
    subtype: 'blaze', 
    color: 'bg-amber-500', 
    description: 'Nether fortress pyromancer with rotating floating fire rods orbiting a smoking yellow core.' 
  },
  { 
    id: 211, 
    name: 'Witch', 
    type: 'minecraft', 
    subtype: 'witch', 
    color: 'bg-purple-900', 
    description: 'Swamp alchemist wearing a crooked pointed black hat with emerald buckle, green nose wart, and a swirling splash potion bottle.' 
  },
  { 
    id: 212, 
    name: 'Tamed Wolf', 
    type: 'minecraft', 
    subtype: 'tamed_wolf', 
    color: 'bg-neutral-200', 
    description: 'Loyal fluffy companion with pointy ears, cheerful red collar with gold tag, and a happily wagging tail.' 
  },
  { 
    id: 213, 
    name: 'Saddle Pig', 
    type: 'minecraft', 
    subtype: 'pig', 
    color: 'bg-pink-400', 
    description: 'Classic pink snout pig wearing a brown leather saddle, ready to sprint anywhere with a carrot-on-a-stick!' 
  },
  { 
    id: 214, 
    name: 'Axolotl', 
    type: 'minecraft', 
    subtype: 'axolotl', 
    color: 'bg-pink-300', 
    description: 'Adorable pink leucistic cave salamander with 6 frilly coral gills, tiny swimming feet, and joyful healing aura!' 
  },
  { 
    id: 215, 
    name: 'Honey Bee', 
    type: 'minecraft', 
    subtype: 'bee', 
    color: 'bg-amber-400', 
    description: 'Chubby fuzzy striped bee with fluttering translucent wings, tiny antennae, and sweet nectar pollen particles.' 
  },
  { 
    id: 26, 
    name: 'Skeleton', 
    type: 'minecraft', 
    subtype: 'skeleton', 
    heldWeapon: 'bow',
    color: 'bg-gray-300', 
    description: 'Rattling bone sniper guarding ancient stone dungeons with a curved oak bow and feather-fletched arrow.' 
  },
  { 
    id: 23, 
    name: 'Zombie', 
    type: 'minecraft', 
    subtype: 'zombie', 
    color: 'bg-teal-700', 
    description: 'Relentless midnight crawler with outstretched arms searching for unwary players in the darkness.' 
  },
  { 
    id: 27, 
    name: 'Villager', 
    type: 'minecraft', 
    subtype: 'villager', 
    color: 'bg-amber-800', 
    description: 'Hrmmm... Peaceful farmer with big 3D nose, folded robe arms, and shiny emerald trades for your wheat and carrots.' 
  },
  { 
    id: 216, 
    name: 'Snow Golem', 
    type: 'minecraft', 
    subtype: 'snow_golem', 
    color: 'bg-slate-100', 
    description: 'Friendly winter sentry with a carved pumpkin head, coal smile, and endless rapid-fire snowball barrage!' 
  },
  { 
    id: 217, 
    name: 'Mooshroom', 
    type: 'minecraft', 
    subtype: 'mooshroom', 
    color: 'bg-red-600', 
    description: 'Enchanted red mushroom cow from rare magical mushroom island biomes providing endless mushroom stew!' 
  },
  { 
    id: 218, 
    name: 'Evoker', 
    type: 'minecraft', 
    subtype: 'evoker', 
    heldWeapon: 'totem',
    color: 'bg-stone-800', 
    description: 'Dark woodland mansion illager summoning magical ground fangs, flying vexes, and holding the immortal Totem of Undying!' 
  },
  { 
    id: 219, 
    name: 'Copper Golem', 
    type: 'minecraft', 
    subtype: 'copper_golem', 
    color: 'bg-amber-600', 
    description: 'Cute oxidized copper automaton with a lightning rod head antenna and an irresistible urge to push buttons!' 
  },
  { 
    id: 220, 
    name: 'Ender Dragon Rider Steve', 
    type: 'minecraft', 
    subtype: 'netherite_steve', 
    armorTier: 'netherite',
    heldWeapon: 'trident',
    cape: 'elytra',
    isEnchanted: true,
    color: 'bg-neutral-950', 
    description: 'Legendary conqueror of the End dimension gliding with Elytra wings, dragon breath shimmer, and a loyalty ocean trident!' 
  },
  { 
    id: 221, 
    name: 'Allay', 
    type: 'minecraft', 
    subtype: 'allay', 
    color: 'bg-sky-400', 
    description: 'Gentle flying fairy companion with glowing translucent wings, fluttering to note block rhythms and collecting shiny gifts!' 
  },

  // ================= SPRUNKI CHARACTERS (CANONICAL INCREDIBOX REAL GAME ROSTER) =================
  // --- BEATS (1-5) ---
  { 
    id: 11, 
    name: 'Oren', 
    type: 'sprnuki', 
    subtype: 'oren',
    color: 'bg-orange-500', 
    description: 'Beat 1: The flagship orange beatboxer wearing his iconic knit beanie and DJ studio headphones!' 
  },
  { 
    id: 12, 
    name: 'Raddy', 
    type: 'sprnuki', 
    subtype: 'raddy',
    color: 'bg-red-600', 
    description: 'Beat 2: Fiery crimson rhythm monster with curved devil horns, sharp fang tooth, and aggressive 808 snare drops!' 
  },
  { 
    id: 71, 
    name: 'Clukr', 
    type: 'sprnuki', 
    subtype: 'clukr',
    color: 'bg-sky-500', 
    description: 'Beat 3: The jittery rooster beatboxer with red rooster crest, pointy beak, and hyper-speed click percussion!' 
  },
  { 
    id: 31, 
    name: 'Fun Bot', 
    type: 'sprnuki', 
    subtype: 'funbot',
    color: 'bg-slate-400', 
    description: 'Beat 4: Retro silver robot synthesizer with glowing cyan LED screen visor and spring antenna!' 
  },
  { 
    id: 13, 
    name: 'Vineria', 
    type: 'sprnuki', 
    subtype: 'vineria',
    color: 'bg-green-600', 
    description: 'Beat 5: Botanical nature singer with green curly leaf tendrils and blooming 5-petal pink flower!' 
  },

  // --- EFFECTS (1-5) ---
  { 
    id: 32, 
    name: 'Gray', 
    type: 'sprnuki', 
    subtype: 'gray',
    color: 'bg-slate-600', 
    description: 'Effect 1: The cozy gray cat-ear hoodie singer humming soft, ambient lo-fi rhodes rhythms!' 
  },
  { 
    id: 73, 
    name: 'Brud', 
    type: 'sprnuki', 
    subtype: 'brud',
    color: 'bg-amber-900', 
    description: 'Effect 2: The sleepy brown sloth/bear wearing a striped nightcap and medical band-aid, dropping yawning 808 sub bass!' 
  },
  { 
    id: 19, 
    name: 'Garnold', 
    type: 'sprnuki', 
    subtype: 'garnold',
    color: 'bg-yellow-400', 
    description: 'Effect 3: Golden funk DJ rocking sleek dark shades and headphones with resonant wah-wah scratch grooves!' 
  },
  { 
    id: 72, 
    name: 'OWAKCX', 
    type: 'sprnuki', 
    subtype: 'owakcx',
    color: 'bg-fuchsia-600', 
    description: 'Effect 4: Wild circus jester clown with jingling bells, spring boings, spinning spiral eyes, and red nose!' 
  },
  { 
    id: 34, 
    name: 'Sky', 
    type: 'sprnuki', 
    subtype: 'sky',
    color: 'bg-cyan-500', 
    description: 'Effect 5: Angelic cloud choir singer with a floating golden halo ring, soft white earmuffs, and celestial shimmer!' 
  },

  // --- MELODIES (1-5) ---
  { 
    id: 37, 
    name: 'Mr. Sun', 
    type: 'sprnuki', 
    subtype: 'mrsun',
    color: 'bg-yellow-400', 
    description: 'Melody 1: The radiant smiling sunshine mascot crowned with golden sunbeams and tropical steel drum bops!' 
  },
  { 
    id: 33, 
    name: 'Durple', 
    type: 'sprnuki', 
    subtype: 'durple',
    color: 'bg-purple-600', 
    description: 'Melody 2: Cheerful purple dragon-monster with horns and wide grin chanting resonant "Dur-ple" vocal lines!' 
  },
  { 
    id: 38, 
    name: 'Mr. Tree', 
    type: 'sprnuki', 
    subtype: 'mrtree',
    color: 'bg-emerald-700', 
    description: 'Melody 3: Ancient forest tree spirit with oak twigs and rich subterranean wooden marimba resonance!' 
  },
  { 
    id: 79, 
    name: 'Simon', 
    type: 'sprnuki', 
    subtype: 'simon',
    color: 'bg-yellow-400', 
    description: 'Melody 4: The cheerful sunny yellow boy with curved antennae who whistles sweet, joyful melodies!' 
  },
  { 
    id: 36, 
    name: 'Tunner', 
    type: 'sprnuki', 
    subtype: 'tunner',
    color: 'bg-amber-800', 
    description: 'Melody 5: The dapper jazz beatboxer with vintage fedora, dark sunglasses, and swinging upright bass!' 
  },

  // --- VOICES (1-5) ---
  { 
    id: 75, 
    name: 'Mr. Fun Computer', 
    type: 'sprnuki', 
    subtype: 'computer',
    color: 'bg-slate-700', 
    description: 'Voice 1: Vintage CRT arcade monitor head with green phosphor scanlines and retro 8-bit vocoder glitches!' 
  },
  { 
    id: 39, 
    name: 'Wenda', 
    type: 'sprnuki', 
    subtype: 'wenda',
    color: 'bg-slate-100', 
    description: 'Voice 2: Playful white cat singer with cute kitty ears, pink whisker cheeks, and sweet vocal runs!' 
  },
  { 
    id: 40, 
    name: 'Pinki', 
    type: 'sprnuki', 
    subtype: 'pinki',
    color: 'bg-pink-500', 
    description: 'Voice 3: Vibrant neon bubblegum popstar with a giant ribbon bow and infectious upbeat hooks!' 
  },
  { 
    id: 44, 
    name: 'Jevin', 
    type: 'sprnuki', 
    subtype: 'jevin',
    color: 'bg-cyan-500', 
    description: 'Voice 4: Aqua slime DJ with a dripping goo cap and bubbling liquid water droplet percussion!' 
  },
  { 
    id: 45, 
    name: 'Black', 
    type: 'sprnuki', 
    subtype: 'black',
    color: 'bg-neutral-950', 
    description: 'Voice 5 / Horror Trigger: The iconic void shadow wearing the Black Top Hat with crimson ribbon that transforms the world into Phase 2 Horror!' 
  },

  // --- PHASE 2 HORROR ROSTER ---
  { 
    id: 35, 
    name: 'Horror Simon (Phase 2)', 
    type: 'sprnuki', 
    subtype: 'horror',
    isHorror: true,
    color: 'bg-neutral-900', 
    description: 'The infamous Creepypasta Phase 2 Sprunki with void body, glitching red pupils, and cursed shadow mist!' 
  },
  { 
    id: 78, 
    name: 'Horror Black Void', 
    type: 'sprnuki', 
    subtype: 'black_void',
    isHorror: true,
    color: 'bg-black', 
    description: 'Terrifying 6-eyed abyssal entity with weeping blood tears, dark matter swirls, and seismic sub drone!' 
  },

  // --- SPRUNKI VARIANTS & COMMUNITY EDITIONS ---
  { 
    id: 74, 
    name: 'Garnold VIP', 
    type: 'sprnuki', 
    subtype: 'garnold_vip',
    color: 'bg-yellow-500', 
    description: 'Gold-plated cyber master with holographic prism shades and high-speed laser vinyl scratch grooves!' 
  },
  { 
    id: 76, 
    name: 'Vineria Blossom', 
    type: 'sprnuki', 
    subtype: 'vineria_blossom',
    color: 'bg-emerald-600', 
    description: 'Botanical deity crowned with glowing lotus petals and ethereal cascading celestial harp chimes!' 
  },
  { 
    id: 77, 
    name: 'Wenda Neko Master', 
    type: 'sprnuki', 
    subtype: 'wenda_neko',
    color: 'bg-pink-100', 
    description: 'Kawaii anime cat with glowing LED cat-ear DJ headphones and infectious upbeat J-Pop synth chops!' 
  },
  { 
    id: 80, 
    name: 'Silver Bot Neo', 
    type: 'sprnuki', 
    subtype: 'computer',
    color: 'bg-slate-300', 
    description: 'Cyberpunk chrome vocoder bot with high-resolution rainbow LED matrix analyzer and FM synth percussion!' 
  },
  { 
    id: 81, 
    name: 'Ancient Mr. Tree', 
    type: 'sprnuki', 
    subtype: 'mrtree',
    color: 'bg-amber-800', 
    description: 'Centuries-old autumn redwood tree deity radiating warm organic acoustic bass and rustling amber leaves!' 
  },

  // ================= THOMAS & FRIENDS =================
  { 
    id: 14, 
    name: 'Thomas', 
    type: 'train', 
    color: 'bg-blue-600', 
    description: 'The Really Useful No. 1 blue tank engine on the Island of Sodor.' 
  },
  { 
    id: 15, 
    name: 'Percy', 
    type: 'train', 
    color: 'bg-green-600', 
    description: 'The cheerful green saddle tank engine who delivers the mail.' 
  },
  { 
    id: 16, 
    name: 'James', 
    type: 'train', 
    color: 'bg-red-600', 
    description: 'The splendid red engine who loves boasting his shiny scarlet coat.' 
  },
  { 
    id: 17, 
    name: 'Gordon', 
    type: 'train', 
    color: 'bg-blue-900', 
    description: 'The mighty express locomotive. "Express coming through!"' 
  },
  { 
    id: 18, 
    name: 'Toby', 
    type: 'train', 
    color: 'bg-yellow-700', 
    description: 'The wise brown tram engine with cowcatchers and sideplates.' 
  },
  { 
    id: 20, 
    name: 'Henry', 
    type: 'train', 
    color: 'bg-green-700', 
    description: 'The proud green tender engine who conquered the forest lines.' 
  },
  { 
    id: 50, 
    name: 'Edward', 
    type: 'train', 
    color: 'bg-blue-600', 
    description: 'The kind, wise No. 2 blue tender engine who always helps his friends up Gordon\'s Hill!' 
  },
  { 
    id: 51, 
    name: 'Emily', 
    type: 'train', 
    color: 'bg-emerald-700', 
    description: 'The splendid emerald green Stirling Single No. 12 with giant gold driving wheels and polished brass fittings.' 
  },
  { 
    id: 52, 
    name: 'Diesel', 
    type: 'train', 
    color: 'bg-neutral-900', 
    description: 'The cunning black shunter engine who believes diesels are revolutionary and modern.' 
  },
  { 
    id: 53, 
    name: 'Salty', 
    type: 'train', 
    color: 'bg-red-800', 
    description: 'The cheerful dockside diesel with yellow hazard stripes who spins yarns about pirate ships! "Ahoy mateys!"' 
  },
  { 
    id: 54, 
    name: 'Spencer', 
    type: 'train', 
    color: 'bg-slate-300', 
    description: 'The sleek silver streamlined express engine for the Duke and Duchess of Boxford.' 
  },
  { 
    id: 55, 
    name: 'Duck (Montague)', 
    type: 'train', 
    color: 'bg-green-800', 
    description: 'Proud Great Western Railway No. 8 pannier tank: "There is the Great Western way or the wrong way!"' 
  },
  { 
    id: 56, 
    name: 'Donald & Douglas', 
    type: 'train', 
    color: 'bg-neutral-950', 
    description: 'The loyal Scottish twin black engines who blasted through winter snowdrifts with their heavy snowplows!' 
  },
  { 
    id: 57, 
    name: 'Oliver', 
    type: 'train', 
    color: 'bg-emerald-600', 
    description: 'The brave No. 11 Western autotank engine rescued from the scrapyard to run the Little Western line!' 
  },
  { 
    id: 58, 
    name: 'Nia', 
    type: 'train', 
    color: 'bg-orange-500', 
    description: 'Adventurous No. 18 tank engine from Kenya with colorful geometric patterns and world explorer optimism!' 
  },
  { 
    id: 59, 
    name: 'Rebecca', 
    type: 'train', 
    color: 'bg-yellow-400', 
    description: 'Friendly, bright yellow streamlined Bulleid Pacific engine with tremendous pulling power on the express!' 
  },
  { 
    id: 60, 
    name: 'Diesel 10', 
    type: 'train', 
    color: 'bg-amber-600', 
    description: 'The terrifying ochre rogue diesel armed with "Pinchy", his mechanical hydraulic roof claw! Master of the Sodor Ironworks.' 
  },
  { 
    id: 61, 
    name: 'Hiro', 
    type: 'train', 
    color: 'bg-neutral-900', 
    description: 'The legendary "Master of the Railway". Grand Japanese D51 heavy Mikado locomotive with gold brass plates and timeless wisdom.' 
  },
  { 
    id: 62, 
    name: 'Mavis', 
    type: 'train', 
    color: 'bg-stone-900', 
    description: 'Feisty No. 3393 black quarry diesel with yellow hazard side skirts who keeps the Ffarquhar stone quarry running smoothly!' 
  },
  { 
    id: 63, 
    name: 'Flying Scotsman', 
    type: 'train', 
    color: 'bg-emerald-800', 
    description: 'Gordon’s legendary brother, No. 4472 in LNER Apple Green! The world-famous dual-tender record holder who first hit 100 mph.' 
  },
  { 
    id: 64, 
    name: 'Connor', 
    type: 'train', 
    color: 'bg-teal-500', 
    description: 'Supersonic teal and yellow streamlined bullet locomotive from the Mainland who loves high-speed races to Ulfstead Castle!' 
  },
  { 
    id: 65, 
    name: 'Caitlin', 
    type: 'train', 
    color: 'bg-fuchsia-800', 
    description: 'Magnificent magenta aerodynamic streamline sister engine with unstoppable energy, roaring through hills with passenger coaches!' 
  },
  { 
    id: 66, 
    name: 'Ashima', 
    type: 'train', 
    color: 'bg-pink-600', 
    description: 'Vibrant pink Nilgiri Mountain Railway locomotive from India adorned with hand-painted lotus flowers, climbing steep rack railways.' 
  },
  { 
    id: 67, 
    name: 'Skarloey', 
    type: 'train', 
    color: 'bg-red-700', 
    description: 'The wise and faithful No. 1 red narrow-gauge engine, dedicated since 1864 to guiding travelers across the mountain passes.' 
  },
  { 
    id: 68, 
    name: 'Rusty', 
    type: 'train', 
    color: 'bg-orange-600', 
    description: 'The hardworking No. 5 orange maintenance diesel who clears rockslides, inspects bridges, and keeps the mountain lines safe.' 
  },
  { 
    id: 69, 
    name: 'Flynn', 
    type: 'train', 
    color: 'bg-red-600', 
    description: 'The fearless Sodor Search & Rescue fire engine on rails! Equipped with roof water cannons and emergency beacons to extinguish blazes.' 
  },
  { 
    id: 82, 
    name: 'Stephen (The Rocket)', 
    type: 'train', 
    color: 'bg-yellow-500', 
    description: 'The legendary "Rocket"! Historic pioneer locomotive with tall brass chimney and vintage wooden tender who brings joy to Ulfstead Castle!' 
  },
  { 
    id: 83, 
    name: 'Yong Bao', 
    type: 'train', 
    color: 'bg-red-700', 
    description: 'Magnificent Chinese tender engine adorned with ceremonial golden tiger and dragon murals, celebrated for wisdom and heroic rescues!' 
  },

  // ================= COUNTRYBALLS (48 FULL POLANDBALL ROSTER) =================
  ...COUNTRYBALLS_DATA.map(cb => ({
    id: cb.id,
    name: cb.name,
    type: 'countryball' as const,
    color: cb.color,
    flag: cb.flag,
    description: `${cb.motto} — ${cb.lorePerk}`,
  })),
];

export default function CharacterGallery({ onSelect }: { onSelect: (char: any) => void }) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'minecraft' | 'sprnuki' | 'train' | 'countryball'>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [horrorModeAll, setHorrorModeAll] = useState(false);

  // Incredibox Multi-Track Beat Crew Studio
  const [beatCrew, setBeatCrew] = useState<{ id: number; name: string; subtype?: string; muted?: boolean }[]>([
    { id: 11, name: 'Oren', subtype: 'oren', muted: false },
    { id: 12, name: 'Raddy', subtype: 'raddy', muted: false },
    { id: 13, name: 'Vineria', subtype: 'vineria', muted: false },
    { id: 31, name: 'Fun Bot', subtype: 'funbot', muted: false },
  ]);
  const [isJamPlaying, setIsJamPlaying] = useState(false);
  const [jamBpm, setJamBpm] = useState(110);
  const [activeStep, setActiveStep] = useState(-1);

  // Minecraft Armory & Gear Forge State
  const [mcArmor, setMcArmor] = useState<'none' | 'iron' | 'diamond' | 'netherite'>('diamond');
  const [mcWeapon, setMcWeapon] = useState<string>('diamond_sword');
  const [mcCape, setMcCape] = useState<'none' | 'mojang' | 'creeper' | 'elytra'>('mojang');
  const [mcEnchanted, setMcEnchanted] = useState<boolean>(true);
  const [mcBaseChar, setMcBaseChar] = useState<string>('steve');

  const customMinecraftHero: CharacterData = {
    id: 999,
    name: mcBaseChar === 'alex' ? 'Alex (Custom Gear)' : 'Steve (Custom Gear)',
    type: 'minecraft',
    subtype: mcBaseChar,
    armorTier: mcArmor,
    heldWeapon: mcWeapon,
    cape: mcCape,
    isEnchanted: mcEnchanted,
    color: mcArmor === 'diamond' ? 'bg-cyan-500' : mcArmor === 'netherite' ? 'bg-stone-900' : 'bg-cyan-600',
    description: `Custom Loadout: ${mcArmor !== 'none' ? mcArmor.toUpperCase() + ' Armor' : 'No Armor'}, ${mcWeapon.replace('_', ' ').toUpperCase()}, ${mcCape !== 'none' ? mcCape.toUpperCase() + ' Cape' : 'No Cape'}${mcEnchanted ? ' (Enchanted)' : ''}`,
  };

  // Sync Audio Engine Jam step listener
  useEffect(() => {
    const unsub = audioEngine.onJamStep((step) => {
      setActiveStep(step);
    });
    return () => {
      unsub();
      audioEngine.stopSprunkiJam();
    };
  }, []);

  // Update audio engine settings when crew, horror mode, or BPM changes
  useEffect(() => {
    if (isJamPlaying) {
      audioEngine.updateSprunkiJamSettings(beatCrew, horrorModeAll, jamBpm);
    }
  }, [beatCrew, horrorModeAll, jamBpm, isJamPlaying]);

  const toggleJamPlay = () => {
    if (isJamPlaying) {
      audioEngine.stopSprunkiJam();
      setIsJamPlaying(false);
      setActiveStep(-1);
    } else {
      if (beatCrew.length === 0) {
        // Default seed if empty
        const defaultCrew = [
          { id: 11, name: 'Oren', subtype: 'oren', muted: false },
          { id: 12, name: 'Raddy', subtype: 'raddy', muted: false }
        ];
        setBeatCrew(defaultCrew);
        audioEngine.startSprunkiJam(defaultCrew, horrorModeAll, jamBpm);
      } else {
        audioEngine.startSprunkiJam(beatCrew, horrorModeAll, jamBpm);
      }
      setIsJamPlaying(true);
    }
  };

  const toggleCrewMember = (char: CharacterData) => {
    setBeatCrew(prev => {
      const exists = prev.some(m => m.id === char.id);
      if (exists) {
        return prev.filter(m => m.id !== char.id);
      } else {
        if (prev.length >= 7) return prev; // max 7 simultaneous tracks
        return [...prev, { id: char.id, name: char.name, subtype: char.subtype, muted: false }];
      }
    });
  };

  const toggleMuteMember = (id: number) => {
    setBeatCrew(prev => prev.map(m => m.id === id ? { ...m, muted: !m.muted } : m));
  };

  const randomizeCrew = () => {
    const allSprunkis = ALL_CHARACTERS.filter(c => c.type === 'sprnuki');
    const shuffled = [...allSprunkis].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 4).map(c => ({
      id: c.id,
      name: c.name,
      subtype: c.subtype,
      muted: false
    }));
    setBeatCrew(selected);
  };

  // Countryball Historical Dossier & Stats Inspector State
  const [selectedCountryballDossier, setSelectedCountryballDossier] = useState<CountryballData | null>(null);
  const [countryballRegionFilter, setCountryballRegionFilter] = useState<string>('All');
  const [countryballSearch, setCountryballSearch] = useState<string>('');

  const filteredCharacters = ALL_CHARACTERS.filter(char => {
    if (selectedFilter !== 'all' && char.type !== selectedFilter) return false;

    if (char.type === 'countryball') {
      const cbData = COUNTRYBALLS_DATA.find(c => c.id === char.id || c.name.toLowerCase() === char.name.toLowerCase());
      if (countryballRegionFilter !== 'All' && cbData && cbData.region !== countryballRegionFilter) {
        return false;
      }
      if (countryballSearch.trim()) {
        const query = countryballSearch.toLowerCase();
        const matchesName = char.name.toLowerCase().includes(query);
        const matchesOfficial = cbData?.officialName.toLowerCase().includes(query);
        const matchesCapital = cbData?.capital.toLowerCase().includes(query);
        const matchesPerk = cbData?.lorePerk.toLowerCase().includes(query);
        const matchesFact = cbData?.historicalFacts.some(f => f.toLowerCase().includes(query));
        if (!matchesName && !matchesOfficial && !matchesCapital && !matchesPerk && !matchesFact) {
          return false;
        }
      }
    }

    return true;
  });

  // Character Talking & Speech Studio State
  const [speakingCharId, setSpeakingCharId] = useState<number | null>(null);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [customStudioText, setCustomStudioText] = useState('');
  const [studioTargetChar, setStudioTargetChar] = useState<CharacterData>(ALL_CHARACTERS[0]);

  useEffect(() => {
    const unsub = speechEngine.subscribe((event) => {
      if (event.isSpeaking) {
        if (event.characterId !== undefined) {
          setSpeakingCharId(event.characterId);
        }
        setSpeakingText(event.text);
      } else {
        setSpeakingCharId(null);
        setSpeakingText(null);
      }
    });
    return () => unsub();
  }, []);

  const handleMakeCharacterTalk = (char: CharacterData, customLine?: string) => {
    const quote = customLine || speechEngine.getRandomQuote(char.name, char.type, char.subtype);
    setSpeakingCharId(char.id);
    setSpeakingText(quote);
    speechEngine.speak(char, quote, () => {
      setSpeakingCharId(null);
      setSpeakingText(null);
    });
  };

  const toggleVoiceMute = () => {
    const isMuted = speechEngine.toggleMute();
    setVoiceMuted(isMuted);
  };

  return (
    <div className="p-4 sm:p-6 bg-stone-950 text-white min-h-screen select-none">
      {/* Header */}
      <div className="max-w-6xl mx-auto text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight mb-2 flex items-center justify-center gap-3">
          <Sparkles className="text-yellow-400" /> Choose Your Character & Speech Studio
        </h2>
        <p className="text-stone-400 text-xs sm:text-sm max-w-3xl mx-auto font-mono">
          Now with <strong>130 Characters</strong>! <strong>27 Minecraft Mobs & Heroes</strong>, <strong>27 Sprunkis</strong>, <strong>28 Sodor Locomotives</strong>, and <strong>48 Countryballs</strong> with Full Historical Dossiers & Stats!
        </p>

        {/* Global Quick Action Strip */}
        <div className="flex items-center justify-center gap-3 mt-3 flex-wrap">
          <button
            onClick={toggleVoiceMute}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              voiceMuted
                ? 'bg-red-500/20 border-red-500/40 text-red-300'
                : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300 hover:text-white'
            }`}
            title="Toggle Web Speech synthesis voice on/off"
          >
            {voiceMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-emerald-400" />}
            <span>{voiceMuted ? 'Voice Muted' : 'Voice Synthesis Active'}</span>
          </button>

          <button
            onClick={() => setHorrorModeAll(!horrorModeAll)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition cursor-pointer ${
              horrorModeAll
                ? 'bg-red-600 text-white border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse'
                : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Skull size={14} />
            <span>{horrorModeAll ? 'Phase 2 Horror Active' : 'Enable Horror Phase'}</span>
          </button>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
          {[
            { id: 'all', label: '🌟 All Cast (130)' },
            { id: 'minecraft', label: '⛏️ 27 Minecraft Heroes & Mobs' },
            { id: 'sprnuki', label: '🎵 27 Sprunkis (Real Incredibox Cast)' },
            { id: 'train', label: '🚂 28 Trains' },
            { id: 'countryball', label: '🌐 48 Countryballs (Dossier & Stats)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold font-mono transition-all shadow-md cursor-pointer ${
                selectedFilter === tab.id
                  ? 'mc-btn mc-btn-primary scale-105'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white border border-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= COUNTRYBALLS WORLD EMBASSY & HISTORICAL ARCHIVES BANNER ================= */}
        {(selectedFilter === 'countryball' || selectedFilter === 'all') && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-blue-500/40 shadow-2xl relative overflow-hidden backdrop-blur font-mono text-left">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-600/30 text-blue-400 border border-blue-500/40">
                  <Globe size={22} className="text-blue-400 animate-spin" style={{ animationDuration: '30s' }} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    Countryballs Historical Archives & Stats Embassy
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold">
                      48 Sovereign Nations
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Hover any Countryball card for instant historical facts & stats, or click to open the full National Dossier!
                  </p>
                </div>
              </div>

              {/* Quick Actions: Random Dossier & Space Program Info */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const randomCb = COUNTRYBALLS_DATA[Math.floor(Math.random() * COUNTRYBALLS_DATA.length)];
                    setSelectedCountryballDossier(randomCb);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                >
                  <RefreshCw size={13} className="text-amber-400" />
                  <span>🎲 Random Countryball Fact</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const poland = COUNTRYBALLS_DATA.find(c => c.name === 'Poland') || COUNTRYBALLS_DATA[0];
                    setSelectedCountryballDossier(poland);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-red-600/25 hover:bg-red-600/40 text-red-300 border border-red-500/50 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                  title="View Poland's unique 0% space program in canon lore"
                >
                  <span>🚀 Space Program: Poland (0%)</span>
                </button>
              </div>
            </div>

            {/* Region Filter Chips & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              {/* Region Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-[11px] text-stone-400 font-bold whitespace-nowrap mr-1 flex items-center gap-1">
                  <Award size={13} className="text-amber-400" /> Region:
                </span>
                {REGIONS_LIST.map((reg) => {
                  const count = reg === 'All' 
                    ? COUNTRYBALLS_DATA.length 
                    : COUNTRYBALLS_DATA.filter(c => c.region === reg).length;
                  return (
                    <button
                      key={reg}
                      type="button"
                      onClick={() => setCountryballRegionFilter(reg)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                        countryballRegionFilter === reg
                          ? 'bg-blue-600 text-white border-blue-400 shadow-md'
                          : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white hover:border-blue-400/50'
                      }`}
                    >
                      {reg} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={countryballSearch}
                  onChange={(e) => setCountryballSearch(e.target.value)}
                  placeholder="Search 48 Countryballs..."
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl pl-8 pr-3 py-1 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-blue-400"
                />
                {countryballSearch && (
                  <button
                    type="button"
                    onClick={() => setCountryballSearch('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================= INCREDIBOX SPRUNKI LIVE BEAT STUDIO ================= */}
        {(selectedFilter === 'all' || selectedFilter === 'sprnuki') && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-orange-500/40 shadow-2xl relative overflow-hidden backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className={`p-2 rounded-xl ${isJamPlaying ? 'bg-orange-500 text-black animate-pulse' : 'bg-stone-800 text-orange-400'}`}>
                  <Disc3 size={20} className={isJamPlaying ? 'animate-spin' : ''} style={{ animationDuration: '3s' }} />
                </div>
                <div className="text-left font-mono">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    Sprunki Incredibox Beat Studio
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-normal">
                      Multi-Track Live Crew
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Assemble up to 7 Sprunkis to build your synchronized custom beatbox groove!
                  </p>
                </div>
              </div>

              {/* Master Studio Controls */}
              <div className="flex items-center gap-2">
                {/* Play / Stop Master Button */}
                <button
                  onClick={toggleJamPlay}
                  className={`px-4 py-2 rounded-xl text-xs font-black font-mono flex items-center gap-2 cursor-pointer shadow-lg transition active:scale-95 ${
                    isJamPlaying
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/50'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/50'
                  }`}
                >
                  {isJamPlaying ? (
                    <>
                      <Square size={14} className="fill-white" />
                      <span>STOP BEAT</span>
                    </>
                  ) : (
                    <>
                      <Play size={14} className="fill-white" />
                      <span>PLAY CREW BEAT</span>
                    </>
                  )}
                </button>

                {/* Randomize Crew Button */}
                <button
                  onClick={randomizeCrew}
                  className="px-3 py-2 rounded-xl text-xs font-bold font-mono bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 flex items-center gap-1.5 cursor-pointer transition shadow"
                  title="Randomize crew members"
                >
                  <Shuffle size={13} className="text-amber-400" />
                  <span>Random</span>
                </button>

                {/* Clear Crew Button */}
                <button
                  onClick={() => setBeatCrew([])}
                  className="p-2 rounded-xl text-stone-400 hover:text-red-400 bg-stone-800/80 hover:bg-stone-800 border border-stone-700 cursor-pointer transition shadow"
                  title="Clear all crew slots"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {/* 16-Step Rhythm Sequencer Visualizer */}
            <div className="mb-4 flex items-center justify-between gap-1 px-1">
              {[...Array(16)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-sm transition-all duration-75 ${
                    activeStep === i 
                      ? (horrorModeAll ? 'bg-red-500 scale-y-200 shadow-[0_0_8px_#ef4444]' : 'bg-orange-400 scale-y-200 shadow-[0_0_8px_#fb923c]')
                      : (i % 4 === 0 ? 'bg-stone-700' : 'bg-stone-800')
                  }`}
                />
              ))}
            </div>

            {/* Active Beat Crew Slots (Up to 7) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
              {[...Array(7)].map((_, idx) => {
                const member = beatCrew[idx];
                const fullChar = member ? ALL_CHARACTERS.find(c => c.id === member.id) : null;

                if (!member || !fullChar) {
                  return (
                    <div
                      key={idx}
                      className="border-2 border-dashed border-stone-800 rounded-xl p-2.5 flex flex-col items-center justify-center min-h-[110px] text-stone-600 font-mono text-[11px] gap-1 bg-stone-950/40"
                    >
                      <Plus size={16} className="text-stone-700" />
                      <span>Slot {idx + 1}</span>
                      <span className="text-[9px] text-stone-600">Select Below</span>
                    </div>
                  );
                }

                return (
                  <div
                    key={member.id}
                    className={`rounded-xl p-2 flex flex-col items-center justify-between relative border transition shadow-md ${
                      member.muted 
                        ? 'bg-stone-950/60 border-stone-800 opacity-60' 
                        : horrorModeAll
                        ? 'bg-red-950/40 border-red-800/80 shadow-red-950/30'
                        : 'bg-stone-950 border-orange-500/30 shadow-orange-950/20'
                    }`}
                  >
                    {/* Remove 'X' button */}
                    <button
                      onClick={() => toggleCrewMember(fullChar)}
                      className="absolute top-1 right-1 text-stone-500 hover:text-red-400 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center cursor-pointer"
                      title="Remove from crew"
                    >
                      ×
                    </button>

                    {/* Mute Toggle */}
                    <button
                      onClick={() => toggleMuteMember(member.id)}
                      className={`absolute top-1 left-1 p-0.5 rounded cursor-pointer ${
                        member.muted ? 'text-red-400 bg-red-950/50' : 'text-emerald-400 bg-stone-800'
                      }`}
                      title={member.muted ? "Unmute track" : "Mute track"}
                    >
                      {member.muted ? <VolumeX size={11} /> : <Volume2 size={11} />}
                    </button>

                    {/* Mini Avatar */}
                    <div className="my-1 scale-90">
                      <CharacterAvatar
                        character={{
                          ...fullChar,
                          isHorror: horrorModeAll || fullChar.isHorror
                        }}
                        size="sm"
                        isWalking={isJamPlaying && !member.muted}
                      />
                    </div>

                    {/* Member Name & Tag */}
                    <div className="text-center font-mono w-full">
                      <p className="text-[11px] font-bold text-white truncate px-1">
                        {member.name}
                      </p>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded-full inline-block ${
                        member.muted ? 'text-stone-500 bg-stone-900' : 'text-orange-400 bg-orange-950/60'
                      }`}>
                        {member.muted ? 'MUTED' : 'ACTIVE'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Studio Bottom Bar: Tempo BPM & Mode controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-stone-800 text-xs font-mono">
              <div className="flex items-center gap-3">
                <span className="text-stone-400">Tempo:</span>
                <input
                  type="range"
                  min="75"
                  max="145"
                  value={jamBpm}
                  onChange={(e) => setJamBpm(Number(e.target.value))}
                  className="w-28 sm:w-36 accent-orange-500 cursor-pointer"
                />
                <span className="text-orange-400 font-bold">{jamBpm} BPM</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHorrorModeAll(prev => !prev)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    horrorModeAll
                      ? 'bg-red-950 text-red-300 border-red-600 shadow-[0_0_12px_rgba(220,38,38,0.7)]'
                      : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                  }`}
                >
                  {horrorModeAll ? (
                    <>
                      <Skull size={13} className="text-red-500" />
                      <span>Phase 2 (Horror Mode): ON</span>
                    </>
                  ) : (
                    <>
                      <Flame size={13} className="text-orange-400" />
                      <span>Phase 2 (Horror Mode): OFF</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= MINECRAFT ARMORY & CRAFTING FORGE ================= */}
        {(selectedFilter === 'all' || selectedFilter === 'minecraft') && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-emerald-500/40 shadow-2xl relative overflow-hidden backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-lg shadow-emerald-950/50">
                  <Hammer size={20} className="animate-bounce" style={{ animationDuration: '2s' }} />
                </div>
                <div className="text-left font-mono">
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    Minecraft Armory & Custom Crafting Forge
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-normal">
                      Interactive Gear Builder
                    </span>
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    Customize armor tiers, pixel weapons, capes, and enchanted shimmers — or test mob vocal sound effects!
                  </p>
                </div>
              </div>

              {/* Action button to equip custom hero */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelect(customMinecraftHero)}
                  className="px-4 py-2 rounded-xl text-xs font-black font-mono bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 flex items-center gap-1.5 cursor-pointer transition active:scale-95"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>PLAY WITH CUSTOM LOADOUT</span>
                </button>
              </div>
            </div>

            {/* Forge Customizer Grid: Preview + Custom Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Preview Avatar Box */}
              <div className="md:col-span-3 flex flex-col items-center justify-center p-3 rounded-xl bg-stone-950/70 border border-stone-800 relative">
                <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mb-1">Live Forge Preview</div>
                <div className="my-2 py-1">
                  <CharacterAvatar character={customMinecraftHero} size="lg" isWalking={true} />
                </div>
                <div className="text-center font-mono mt-1">
                  <span className="text-xs font-bold text-emerald-400">{customMinecraftHero.name}</span>
                  <div className="text-[10px] text-stone-400 flex items-center justify-center gap-1 mt-0.5">
                    <span>{mcArmor.toUpperCase()} ARMOR</span> • <span>{mcWeapon.replace('_', ' ').toUpperCase()}</span>
                  </div>
                </div>
              </div>

              {/* Customizer Controls */}
              <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* Base Skin & Armor Tier */}
                <div className="p-3 rounded-xl bg-stone-950/50 border border-stone-800/80 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-stone-300 font-bold">
                    <span>Hero & Armor Tier</span>
                    <Shield size={14} className="text-emerald-400" />
                  </div>
                  {/* Base Skin Selector */}
                  <div className="flex gap-1.5">
                    {['steve', 'alex'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setMcBaseChar(b)}
                        className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold uppercase cursor-pointer border transition ${
                          mcBaseChar === b
                            ? 'bg-emerald-600 text-white border-emerald-400'
                            : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                  {/* Armor Selector */}
                  <div className="grid grid-cols-4 gap-1">
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'iron', label: 'Iron' },
                      { id: 'diamond', label: 'Diamond' },
                      { id: 'netherite', label: 'Netherite' },
                    ].map((a) => (
                      <button
                        key={a.id}
                        onClick={() => setMcArmor(a.id as any)}
                        className={`py-1 px-1 rounded-lg text-[10px] font-bold uppercase cursor-pointer border transition text-center ${
                          mcArmor === a.id
                            ? 'bg-cyan-600 text-white border-cyan-400 shadow-sm'
                            : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                        }`}
                      >
                        {a.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Held Weapon & Cape */}
                <div className="p-3 rounded-xl bg-stone-950/50 border border-stone-800/80 flex flex-col gap-2">
                  <div className="flex justify-between items-center text-stone-300 font-bold">
                    <span>Hand Weapon & Cape</span>
                    <Swords size={14} className="text-cyan-400" />
                  </div>
                  {/* Weapon Selector */}
                  <div className="grid grid-cols-3 gap-1">
                    {[
                      { id: 'diamond_sword', label: '⚔️ Sword' },
                      { id: 'diamond_pickaxe', label: '⛏️ Pick' },
                      { id: 'bow', label: '🏹 Bow' },
                      { id: 'trident', label: '🔱 Trident' },
                      { id: 'totem', label: '🧚 Totem' },
                      { id: 'shield', label: '🛡️ Shield' },
                    ].map((w) => (
                      <button
                        key={w.id}
                        onClick={() => {
                          setMcWeapon(w.id);
                          audioEngine.playMinecraftSound(w.id.includes('sword') ? 'sword' : w.id.includes('bow') ? 'bow' : 'pickaxe');
                        }}
                        className={`py-1 px-1 rounded-lg text-[10px] font-bold cursor-pointer border transition text-center truncate ${
                          mcWeapon === w.id
                            ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                            : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                  {/* Cape Selector */}
                  <div className="flex gap-1 items-center">
                    <span className="text-[10px] text-stone-400">Cape:</span>
                    {[
                      { id: 'none', label: 'None' },
                      { id: 'mojang', label: 'Mojang' },
                      { id: 'creeper', label: 'Creeper' },
                      { id: 'elytra', label: 'Elytra' },
                    ].map((c) => (
                      <button
                        key={c.id}
                        onClick={() => setMcCape(c.id as any)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold cursor-pointer border transition text-center ${
                          mcCape === c.id
                            ? 'bg-red-700 text-white border-red-500'
                            : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-white'
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mob Vocal Soundboard Test Bed */}
            <div className="mt-4 pt-3 border-t border-stone-800 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-stone-300 font-bold flex items-center gap-1.5">
                  <Volume2 size={13} className="text-emerald-400" />
                  Mob Vocal & Action Soundboard (Click to hear):
                </span>
                <button
                  onClick={() => setMcEnchanted(prev => !prev)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-mono transition border cursor-pointer ${
                    mcEnchanted
                      ? 'bg-purple-900/60 text-purple-300 border-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                      : 'bg-stone-800 text-stone-400 border-stone-700'
                  }`}
                >
                  ✨ Enchanted Purple Glint: {mcEnchanted ? 'ON' : 'OFF'}
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 font-mono">
                {[
                  { label: 'Steve "OOF!"', sound: 'steve' },
                  { label: 'Villager "HRRMMM!"', sound: 'villager' },
                  { label: 'Creeper "Tssss!"', sound: 'creeper' },
                  { label: 'Enderman "Vwoop!"', sound: 'enderman' },
                  { label: 'Zombie "Bruuh!"', sound: 'zombie' },
                  { label: 'Skeleton "Rattle!"', sound: 'skeleton' },
                  { label: 'XP Level-Up 🎺', sound: 'level' },
                  { label: 'Diamond Clink ⛏️', sound: 'mine' },
                  { label: 'Sword Crit ⚔️', sound: 'sword' },
                  { label: 'Iron Golem 🌹', sound: 'iron_golem' },
                  { label: 'Warden Heartbeat 💓', sound: 'warden' },
                  { label: 'Wolf Bark 🐕', sound: 'wolf' },
                  { label: 'Pig Oink 🐷', sound: 'pig' },
                  { label: 'Totem Bless ✨', sound: 'totem' },
                ].map((s) => (
                  <button
                    key={s.sound}
                    onClick={() => audioEngine.playMinecraftSound(s.sound)}
                    className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-emerald-950/70 hover:border-emerald-500/60 text-stone-300 hover:text-emerald-200 border border-stone-700 text-[11px] font-bold cursor-pointer transition active:scale-95 shadow-sm"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= CHARACTER SPEECH & DIALOGUE STUDIO ================= */}
        <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-stone-900/90 border border-amber-500/40 shadow-2xl relative overflow-hidden backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-stone-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <Mic size={20} className={speakingCharId ? 'animate-bounce text-yellow-300' : ''} />
              </div>
              <div className="text-left font-mono">
                <h3 className="text-sm font-black text-white flex items-center gap-2">
                  Live Character Voice & Dialogue Studio
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-normal">
                    {voiceMuted ? 'Muted' : 'Web Speech Synthesizer'}
                  </span>
                </h3>
                <p className="text-[11px] text-stone-400">
                  Select any character, make them speak catchphrases aloud with animated speech bubbles, or type your own custom line!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleVoiceMute}
                className="px-2.5 py-1 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-stone-700 cursor-pointer"
              >
                {voiceMuted ? <VolumeX size={13} className="text-red-400" /> : <Volume2 size={13} className="text-emerald-400" />}
                <span>{voiceMuted ? 'Unmute TTS' : 'Mute TTS'}</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Live Talking Avatar Preview */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 rounded-xl bg-stone-950/60 border border-stone-800 relative min-h-[190px]">
              <div className="text-[10px] font-mono text-stone-400 uppercase tracking-wider mb-2">
                Active Speaker: <span className="text-amber-300 font-bold">{studioTargetChar.name}</span>
              </div>
              <CharacterAvatar
                character={studioTargetChar}
                size="lg"
                isTalking={speakingCharId === studioTargetChar.id}
                speechText={speakingCharId === studioTargetChar.id ? speakingText || undefined : undefined}
                isWalking={speakingCharId === studioTargetChar.id}
                showName={true}
              />
            </div>

            {/* Quick Dialogue Options & Custom Input */}
            <div className="lg:col-span-8 flex flex-col gap-3 font-mono">
              {/* Character Quick Selector Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                <span className="text-[11px] text-stone-400 font-bold whitespace-nowrap">Pick:</span>
                {[
                  ALL_CHARACTERS[0], // Steve
                  ALL_CHARACTERS[1], // Alex
                  ALL_CHARACTERS[2], // Diamond Steve
                  ALL_CHARACTERS.find(c => c.name === 'Creeper'),
                  ALL_CHARACTERS.find(c => c.name === 'Enderman'),
                  ALL_CHARACTERS.find(c => c.name === 'Iron Golem'),
                  ALL_CHARACTERS.find(c => c.name === 'Warden'),
                  ALL_CHARACTERS.find(c => c.name === 'Oren'),
                  ALL_CHARACTERS.find(c => c.name === 'Raddy'),
                  ALL_CHARACTERS.find(c => c.name === 'Fun Bot'),
                  ALL_CHARACTERS.find(c => c.name === 'Thomas'),
                  ALL_CHARACTERS.find(c => c.name === 'Poland'),
                  ALL_CHARACTERS.find(c => c.name === 'USA'),
                  ALL_CHARACTERS.find(c => c.name === 'Japan'),
                  ALL_CHARACTERS.find(c => c.name === 'Germany'),
                ].filter(Boolean).map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setStudioTargetChar(c);
                      handleMakeCharacterTalk(c);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
                      studioTargetChar.id === c.id
                        ? 'bg-amber-500 text-black border-amber-300 shadow'
                        : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white hover:border-amber-400/50'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Preset Quotes List */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] text-stone-400 uppercase tracking-wider">
                  Voiced Catchphrases (Click to hear):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {speechEngine.getCharacterQuotes(studioTargetChar.name, studioTargetChar.type, studioTargetChar.subtype).slice(0, 4).map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleMakeCharacterTalk(studioTargetChar, q)}
                      className="text-left px-2.5 py-1.5 rounded-lg bg-stone-800/80 hover:bg-amber-950/40 text-stone-200 hover:text-amber-200 border border-stone-700 hover:border-amber-500/60 text-xs transition cursor-pointer flex items-center justify-between gap-2 shadow-sm"
                    >
                      <span className="truncate">"{q}"</span>
                      <Radio size={12} className="text-amber-400 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Text to Speech Input */}
              <div className="flex gap-2 items-center mt-1">
                <input
                  type="text"
                  value={customStudioText}
                  onChange={(e) => setCustomStudioText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && customStudioText.trim()) {
                      handleMakeCharacterTalk(studioTargetChar, customStudioText.trim());
                    }
                  }}
                  placeholder={`Type any line for ${studioTargetChar.name} to say aloud...`}
                  className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-200 focus:outline-none focus:border-amber-400 font-mono shadow-inner"
                />
                <button
                  onClick={() => {
                    if (customStudioText.trim()) {
                      handleMakeCharacterTalk(studioTargetChar, customStudioText.trim());
                    } else {
                      handleMakeCharacterTalk(studioTargetChar);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-md shrink-0"
                >
                  <Send size={13} />
                  <span>Speak Aloud</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Characters Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filteredCharacters.map(char => {
          const isHovered = hoveredId === char.id;

          // Apply horror mode toggle if enabled and character is Sprunki
          const effectiveChar: CharacterData = {
            ...char,
            isHorror: char.type === 'sprnuki' ? (horrorModeAll || char.isHorror) : char.isHorror
          };

          const roleTag = 
            char.subtype === 'oren' ? '🥁 Beat 1 · Oren' :
            char.subtype === 'raddy' ? '🥁 Beat 2 · Raddy' :
            char.subtype === 'clukr' ? '🥁 Beat 3 · Clukr' :
            char.subtype === 'funbot' ? '🥁 Beat 4 · Fun Bot' :
            char.subtype === 'vineria' ? '🥁 Beat 5 · Vineria' :
            char.subtype === 'gray' ? '✨ Effect 1 · Gray' :
            char.subtype === 'brud' ? '✨ Effect 2 · Brud' :
            char.subtype === 'garnold' ? '✨ Effect 3 · Garnold' :
            char.subtype === 'owakcx' ? '✨ Effect 4 · OWAKCX' :
            char.subtype === 'sky' ? '✨ Effect 5 · Sky' :
            char.subtype === 'mrsun' ? '🎼 Melody 1 · Mr. Sun' :
            char.subtype === 'durple' ? '🎼 Melody 2 · Durple' :
            char.subtype === 'mrtree' ? '🎼 Melody 3 · Mr. Tree' :
            char.subtype === 'simon' ? '🎼 Melody 4 · Simon' :
            char.subtype === 'tunner' ? '🎼 Melody 5 · Tunner' :
            char.subtype === 'computer' ? '🎤 Voice 1 · Computer' :
            char.subtype === 'wenda' ? '🎤 Voice 2 · Wenda' :
            char.subtype === 'pinki' ? '🎤 Voice 3 · Pinki' :
            char.subtype === 'jevin' ? '🎤 Voice 4 · Jevin' :
            char.subtype === 'black' ? '🎩 Voice 5 · Black Hat' :
            char.subtype === 'horror' ? '💀 Phase 2 Horror' :
            char.subtype === 'garnold_vip' ? '💎 Prism VIP' :
            char.subtype === 'vineria_blossom' ? '🌺 Lotus Melody' :
            char.subtype === 'wenda_neko' ? '🐱 Neko Voice' :
            char.subtype === 'black_void' ? '🕳️ Abyssal Singularity' : null;

          const minecraftRole = 
            char.subtype === 'diamond_steve' ? '💎 Enchanted Legend' :
            char.subtype === 'netherite_steve' ? '🖤 Netherite Knight' :
            char.subtype === 'herobrine' ? '⚡ Mythical Specter' :
            char.subtype === 'iron_golem' ? '🌹 Iron Guardian' :
            char.subtype === 'warden' ? '🔊 Deep Dark Titan' :
            char.subtype === 'wither_skeleton' ? '💀 Nether Assassin' :
            char.subtype === 'piglin' ? '🪙 Gold Hunter' :
            char.subtype === 'drowned' ? '🔱 Ocean Tridentist' :
            char.subtype === 'blaze' ? '🔥 Fire Rod Vortex' :
            char.subtype === 'witch' ? '🧪 Potion Alchemist' :
            char.subtype === 'tamed_wolf' ? '🐕 Loyal Hound' :
            char.subtype === 'pig' ? '🐷 Saddle Racer' :
            char.subtype === 'axolotl' ? '🌸 Leucistic Cutie' :
            char.subtype === 'bee' ? '🐝 Pollen Drone' :
            char.subtype === 'creeper' ? (char.isCharged ? '⚡ 10x Charged Blast' : '💥 Stealth Ambush') :
            char.subtype === 'enderman' ? '🌌 Void Teleporter' :
            char.subtype === 'skeleton' ? '🏹 Bone Sniper' :
            char.subtype === 'zombie' ? '🧟 Midnight Shambler' :
            char.subtype === 'villager' ? '❇️ Emerald Broker' :
            char.subtype === 'alex' ? '🏹 Forest Pathfinder' :
            char.subtype === 'steve' ? '⛏️ Master Miner' : null;

          const minecraftQuote = char.type === 'minecraft' ? (
            char.subtype === 'diamond_steve' ? "Diamond gear, enchanted blade, ready for the Ender Dragon!" :
            char.subtype === 'netherite_steve' ? "Forged in ancient Nether debris. Fire cannot touch me!" :
            char.subtype === 'herobrine' ? "He was never added... and yet he watches you." :
            char.subtype === 'iron_golem' ? "Protects the village with gentle iron hands." :
            char.subtype === 'warden' ? "The sculk hears every heartbeat in the dark..." :
            char.subtype === 'wither_skeleton' ? "Beware the withering touch in the dark fortress." :
            char.subtype === 'piglin' ? "Give gold, get goods! Just do not touch our chests!" :
            char.subtype === 'drowned' ? "From the cold depths with a crackling ocean trident!" :
            char.subtype === 'blaze' ? "Smoking fire rods rotating with blistering heat!" :
            char.subtype === 'witch' ? "Cackle! A splash potion of slowness and poison!" :
            char.subtype === 'tamed_wolf' ? "Woof! Your most faithful diamond-mining companion!" :
            char.subtype === 'pig' ? "Oink! Steering with a dangling carrot-on-a-stick!" :
            char.subtype === 'axolotl' ? "Tiny gills fluttering with regenerating aquatic joy!" :
            char.subtype === 'bee' ? "Buzzz! Bringing pollen back to the golden beehive!" :
            char.subtype === 'creeper' ? (char.isCharged ? "Sssss... SUPERCHARGED EXPLOSION!" : "Sssss... That is a very nice house you have there.") :
            char.subtype === 'enderman' ? "Vwoooomp! Staring into the purple void..." :
            char.subtype === 'skeleton' ? "Rattling bones and a sniper shot in the dark." :
            char.subtype === 'zombie' ? "Bruuuuh... Searching for players in the night." :
            char.subtype === 'villager' ? "Hrmmm? 32 wheat for 1 shiny emerald! Deal?" :
            char.subtype === 'alex' ? "Swift survivalist charting the unexplored frontiers." :
            "Never dig straight down!"
          ) : null;

          const sprunkiQuote = char.type === 'sprnuki' ? (
            effectiveChar.isHorror ? "Y̶O̶U̶ ̶C̶A̶N̶N̶O̶T̶ ̶E̶S̶C̶A̶P̶E̶ ̶P̶H̶A̶S̶E̶ ̶2̶..." :
            char.subtype === 'oren' ? "Boots & cats & boots & cats! Drop that beat!" :
            char.subtype === 'raddy' ? "Feel the 808 sub-bass drop! BOOM!" :
            char.subtype === 'vineria' ? "Nature sings in pure four-part harmony~" :
            char.subtype === 'funbot' ? "01000010 01001001 01010000! Chiptune synths online!" :
            char.subtype === 'gray' ? "Cozy lofi beats to relax and mine diamonds..." :
            char.subtype === 'garnold' ? "Pure gold-plated funk rhythms, baby!" :
            char.subtype === 'durple' ? "Dur-dur-durple bop monster groove!" :
            char.subtype === 'sky' ? "Angelic choir melodies from high above ✨" :
            char.subtype === 'simon' ? "Whew-whew-whee! Simon on the whistle! Happy sunny yellow melodies!" :
            char.subtype === 'tunner' ? "Smooth walking bass and crisp finger snaps!" :
            char.subtype === 'mrsun' ? "Warm tropical steel drums for everyone!" :
            char.subtype === 'mrtree' ? "Deep ancient woodland resonance!" :
            char.subtype === 'wenda' ? "Purr-fect tempo! Meow-bop!" :
            char.subtype === 'pinki' ? "Popstar sparkle energy at max volume!" :
            char.subtype === 'jevin' ? "Bloop-plop-drip! Liquid slime percussion!" :
            char.subtype === 'black' ? "The void vibrates with cosmic bass frequencies..." :
            char.subtype === 'clukr' ? "Bawk-bawk chk-chk! Hyper speed beatbox!" :
            char.subtype === 'owakcx' ? "Boinggg! Watch the jester flip the groove!" :
            char.subtype === 'brud' ? "Yaaawn... 5 more minutes of 808 sub bass..." :
            char.subtype === 'garnold_vip' ? "Diamond needle on the platinum record!" :
            char.subtype === 'computer' ? "INSERT COIN to continue the 8-bit beat!" :
            char.subtype === 'vineria_blossom' ? "Petals bloom to the rhythm of the cosmos ✨" :
            char.subtype === 'wenda_neko' ? "Neko-neko bop! Kawaii tempo maxed out!" :
            char.subtype === 'black_void' ? "T̷H̷E̷ ̷V̷O̷I̷D̷ ̷C̷O̷N̷S̷U̷M̷E̷S̷ ̷A̷L̷L̷ ̷F̷R̷E̷Q̷U̷E̷N̷C̷I̷E̷S̷" : "Rhythm drop!"
          ) : null;

          const cbData = char.type === 'countryball'
            ? COUNTRYBALLS_DATA.find(c => c.id === char.id || c.name.toLowerCase() === char.name.toLowerCase())
            : null;

          const countryballRole = cbData 
            ? `${cbData.region} · ${cbData.iconicProp}` 
            : null;

          const countryballQuote = cbData 
            ? cbData.polandballQuote 
            : null;

          const trainRole = char.type === 'train' ? (
            char.name === 'Thomas' ? '💙 #1 Tank Engine' :
            char.name === 'Edward' ? '📘 #2 Wise Old Iron' :
            char.name === 'Henry' ? '🌲 #3 Forest Tender' :
            char.name === 'Gordon' ? '⚡ #4 Express Star' :
            char.name === 'James' ? '🔴 #5 Red Splendid' :
            char.name === 'Percy' ? '🟢 #6 Mail Carrier' :
            char.name === 'Toby' ? '🪵 #7 Tram Engine' :
            char.name.includes('Duck') ? '🦆 #8 Great Western' :
            char.name.includes('Donald') ? '🏴󠁧󠁢󠁳󠁣󠁴󠁿 #9 Scottish Twins' :
            char.name === 'Oliver' ? '💚 #11 Little Western' :
            char.name === 'Emily' ? '✨ #12 Stirling Single' :
            char.name === 'Nia' ? '🌍 #18 World Explorer' :
            char.name === 'Rebecca' ? '💛 #22 Bulleid Pacific' :
            char.name === 'Spencer' ? '👑 Silver Duke' :
            char.name === 'Diesel' ? '🕶️ Devious Shunter' :
            char.name === 'Salty' ? '⚓ Sea Dog Pirate' :
            char.name === 'Diesel 10' ? '🦀 Claw Master (Pinchy)' :
            char.name === 'Hiro' ? '⛩️ Master of the Railway' :
            char.name === 'Mavis' ? '🪨 #3393 Quarry Diesel' :
            char.name === 'Flying Scotsman' ? '🏴󠁧󠁢󠁳󠁣󠁴󠁿 #4472 Double Tender' :
            char.name === 'Connor' ? '⚡ Teal Bullet Streamliner' :
            char.name === 'Caitlin' ? '🚀 Aerodynamic Express' :
            char.name === 'Ashima' ? '🌸 Indian Nilgiri Mountain' :
            char.name === 'Skarloey' ? '🏔️ #1 Narrow Gauge Patriarch' :
            char.name === 'Rusty' ? '🛠️ #5 Track Maintenance Hero' :
            char.name === 'Flynn' ? '🚒 Search & Rescue Fire Engine' : '🚂 Sodor Locomotive'
          ) : null;

          const trainQuote = char.type === 'train' ? (
            char.name === 'Thomas' ? "I'm a Really Useful Engine!" :
            char.name === 'Percy' ? "Mail train delivered on time!" :
            char.name === 'James' ? "Look at my splendid scarlet coat!" :
            char.name === 'Gordon' ? "Express coming through! Out of my way!" :
            char.name === 'Toby' ? "Always happy with my bell & cowcatchers!" :
            char.name === 'Edward' ? "Slow and steady conquers the hill!" :
            char.name === 'Emily' ? "Right on time, with Stirling elegance!" :
            char.name === 'Diesel 10' ? "Pinchy is hungry! Out of my way, puffballs!" :
            char.name === 'Hiro' ? "Patience and honor guide our journey." :
            char.name === 'Mavis' ? "No stone quarry is too tough for me!" :
            char.name === 'Flying Scotsman' ? "First to 100 mph! Full steam ahead!" :
            char.name === 'Connor' ? "Fastest engine on the Mainland rails!" :
            char.name === 'Caitlin' ? "High speed express, full velocity!" :
            char.name === 'Ashima' ? "Namaste! Mountain rails can't stop me!" :
            char.name === 'Skarloey' ? "The little engine that always could." :
            char.name === 'Rusty' ? "Tracks inspected and clear for all!" :
            char.name === 'Flynn' ? "Fire engine on rails to the rescue!" :
            char.name === 'Spencer' ? "Sleek and splendid for the Duke!" :
            char.name.includes('Duck') ? "There is the Great Western way!" :
            char.name === 'Oliver' ? "Resourceful and ready for adventure!" :
            char.name === 'Nia' ? "Let's explore every corner of the world!" :
            char.name === 'Rebecca' ? "Big boiler, warm heart, ready to pull!" :
            char.name === 'Salty' ? "Ahoy mateys! Yo ho ho on the rails!" :
            char.name === 'Diesel' ? "Diesels are revolutionary and modern!" : null
          ) : null;

          return (
            <div
              key={char.id}
              onMouseEnter={() => setHoveredId(char.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                if (char.type === 'countryball' && cbData) {
                  setSelectedCountryballDossier(cbData);
                }
              }}
              className={`bg-stone-900/90 border rounded-2xl p-4 flex flex-col items-center justify-between shadow-xl transition-all duration-300 hover:-translate-y-1.5 relative group ${
                isHovered && char.type === 'countryball' ? 'z-30 overflow-visible' : 'overflow-hidden'
              } ${
                char.type === 'countryball' ? 'cursor-pointer hover:border-blue-400 hover:shadow-blue-900/30' : ''
              } ${
                effectiveChar.isHorror 
                  ? 'border-red-900 hover:border-red-500 shadow-red-950/30' 
                  : char.type === 'sprnuki' 
                  ? 'border-stone-800 hover:border-orange-400 shadow-orange-950/20' 
                  : char.type === 'countryball'
                  ? 'border-stone-800 hover:border-blue-400 shadow-blue-950/20'
                  : char.type === 'train'
                  ? 'border-stone-800 hover:border-amber-400 shadow-amber-950/20'
                  : 'border-stone-800 hover:border-emerald-400 shadow-stone-950'
              }`}
            >
              {/* Floating Interactive Hover Preview for Countryballs */}
              {isHovered && char.type === 'countryball' && cbData && (
                <CountryballHoverPreview 
                  countryball={cbData} 
                  onInspect={() => setSelectedCountryballDossier(cbData)} 
                />
              )}
              {/* Type Badge & Role */}
              <div className="w-full flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-stone-950 text-stone-300 border border-stone-800">
                  {char.type}
                </span>
                {roleTag && (
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    effectiveChar.isHorror 
                      ? 'bg-red-950/80 text-red-300 border-red-700' 
                      : 'bg-orange-950/60 text-orange-300 border-orange-500/40'
                  }`}>
                    {roleTag}
                  </span>
                )}
                {countryballRole && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40">
                    {countryballRole}
                  </span>
                )}
                {trainRole && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-600/40">
                    {trainRole}
                  </span>
                )}
                {minecraftRole && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                    {minecraftRole}
                  </span>
                )}
              </div>

              {/* Avatar Preview Box with Full Body */}
              <div className="w-full h-44 flex items-center justify-center bg-stone-950/80 rounded-xl border border-stone-800/80 my-2 relative overflow-hidden group-hover:border-stone-700 transition">
                {/* Floor shadow */}
                <div className="absolute bottom-3 w-20 h-3.5 bg-black/60 rounded-full blur-[2px]" />

                {/* Countryball, Train, Sprunki or Minecraft Humor Bubble on Hover */}
                {isHovered && (countryballQuote || trainQuote || sprunkiQuote || minecraftQuote) && (
                  <div className="absolute top-2 z-30 bg-white text-stone-950 text-[10px] font-bold font-mono px-2.5 py-1 rounded-full shadow-lg border border-stone-400 animate-bounce max-w-[85%] text-center">
                    "{countryballQuote || trainQuote || sprunkiQuote || minecraftQuote}"
                  </div>
                )}

                {/* Full Body Character Avatar */}
                <CharacterAvatar
                  character={effectiveChar}
                  size="xl"
                  isWalking={isHovered || speakingCharId === char.id}
                  isTalking={speakingCharId === char.id}
                  speechText={speakingCharId === char.id ? speakingText || undefined : undefined}
                  heldItem={
                    char.name === 'Steve' 
                      ? 'pickaxe' 
                      : char.type === 'sprnuki' 
                      ? 'golden_apple' 
                      : char.type === 'minecraft' 
                      ? 'apple' 
                      : char.type === 'countryball'
                      ? (char.name === 'Poland' ? 'torch' :
                         char.name === 'USA' ? 'pickaxe' :
                         char.name === 'UK' ? 'compass' :
                         char.name === 'Russia' ? 'sword' :
                         char.name === 'France' ? 'bread' :
                         char.name === 'Japan' ? 'diamond' :
                         char.name === 'Canada' ? 'wood' :
                         char.name === 'Germany' ? 'pickaxe' :
                         char.name === 'Italy' ? 'bread' :
                         char.name === 'Mexico' ? 'golden_apple' :
                         char.name === 'Brazil' ? 'emerald' :
                         char.name === 'China' ? 'door' : 'diamond')
                      : undefined
                  }
                />
              </div>

              {/* Name & Description */}
              <div className="text-center w-full my-2 font-mono">
                <h3 className={`font-black text-base text-white transition ${
                  effectiveChar.isHorror ? 'text-red-400' : 'group-hover:text-yellow-300'
                }`}>
                  {effectiveChar.isHorror && !char.name.includes('Horror') ? `Spooky ${char.name}` : char.name}
                  {cbData && (
                    <span className="block text-[11px] font-normal text-amber-300">
                      {cbData.commonName} · {cbData.capital}
                    </span>
                  )}
                </h3>
                <p className="text-[11px] text-stone-400 line-clamp-2 mt-1 min-h-[30px] leading-relaxed">
                  {effectiveChar.isHorror && !char.name.includes('Horror')
                    ? 'Transformed by Phase 2 void energy! Red glitch eyes and shadowy resonance.'
                    : char.description || 'Ready for adventures across all biomes.'}
                </p>
              </div>

              {/* Countryball Historical Fact & Stats Mini-Display inside Card */}
              {char.type === 'countryball' && cbData && (
                <div className="w-full my-1.5 flex flex-col gap-1.5 font-mono text-left">
                  {/* Historical Fact Peek Banner */}
                  <div className="p-2 rounded-xl bg-blue-950/40 border border-blue-500/30 text-stone-300 text-[11px] leading-snug">
                    <span className="text-amber-400 font-bold flex items-center gap-1 text-[9px] uppercase tracking-wider mb-0.5">
                      <BookOpen size={10} />
                      <span>History: {cbData.historicalEra}</span>
                    </span>
                    <p className="line-clamp-2 text-stone-200">{cbData.historicalFacts[0]}</p>
                  </div>

                  {/* Mini Stats Progress Strips */}
                  <div className="grid grid-cols-3 gap-1 text-[9px]">
                    <div className="bg-stone-950/80 p-1 rounded-lg border border-stone-800 text-center">
                      <span className="text-stone-400 block text-[7px] font-bold">DEFENSE</span>
                      <span className="text-emerald-400 font-black">{cbData.stats.defense}</span>
                    </div>
                    <div className="bg-stone-950/80 p-1 rounded-lg border border-stone-800 text-center">
                      <span className="text-stone-400 block text-[7px] font-bold">MINING</span>
                      <span className="text-amber-400 font-black">{cbData.stats.mining}</span>
                    </div>
                    <div className="bg-stone-950/80 p-1 rounded-lg border border-stone-800 text-center">
                      <span className="text-stone-400 block text-[7px] font-bold">SPACE</span>
                      <span className={`font-black ${cbData.stats.space === 0 ? 'text-red-400' : 'text-purple-400'}`}>
                        {cbData.stats.space === 0 ? '0% 🚫' : `${cbData.stats.space}%`}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Sprunki Actions: Crew Toggle + Solo Beatbox */}
              {char.type === 'sprnuki' && (
                <div className="w-full flex flex-col gap-1.5 mt-1 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCrewMember(char);
                    }}
                    className={`w-full py-1.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow ${
                      beatCrew.some(m => m.id === char.id)
                        ? 'bg-amber-500/25 hover:bg-amber-500/40 text-amber-300 border border-amber-500/60'
                        : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
                    }`}
                  >
                    {beatCrew.some(m => m.id === char.id) ? (
                      <>
                        <Disc3 size={13} className="text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                        <span>In Beat Crew (Remove)</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} className="text-orange-400" />
                        <span>Add to Beat Crew</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playSprunkiSound(char.name, effectiveChar.isHorror);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/35 text-orange-300 hover:text-orange-100 border border-orange-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                  >
                    <Music size={13} className="text-orange-400 animate-pulse" />
                    <span>🎵 Solo Beatbox Sample</span>
                  </button>
                </div>
              )}

              {/* Minecraft Actions: Mob Voice / Sound FX + Test Attack */}
              {char.type === 'minecraft' && (
                <div className="w-full flex flex-col gap-1.5 mt-1 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playMinecraftSound(char.subtype || char.name);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-emerald-600/25 hover:bg-emerald-600/40 text-emerald-300 hover:text-emerald-100 border border-emerald-500/50 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                  >
                    <Volume2 size={13} className="text-emerald-400" />
                    <span>🔊 Mob Voice & Sound</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      audioEngine.playMinecraftSound(
                        char.name.includes('Bow') || char.subtype === 'skeleton' ? 'bow' :
                        char.subtype === 'creeper' ? 'fuse' :
                        char.name.includes('Sword') || char.heldWeapon === 'diamond_sword' ? 'sword' : 'pickaxe'
                      );
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                  >
                    <Swords size={13} className="text-cyan-400" />
                    <span>⚔️ Attack / Tool Action</span>
                  </button>
                </div>
              )}

              {/* Countryball Actions: View Historical Facts & Stats Dossier */}
              {char.type === 'countryball' && cbData && (
                <div className="w-full flex flex-col gap-1.5 mt-1 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCountryballDossier(cbData);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-blue-600/25 hover:bg-blue-600/40 text-blue-300 hover:text-blue-100 border border-blue-500/50 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                  >
                    <BookOpen size={13} className="text-blue-400" />
                    <span>📜 Historical Facts & Stats Dossier</span>
                  </button>
                </div>
              )}

              {/* Universal Character Speech Button */}
              <div className="w-full flex flex-col gap-1.5 mt-1 mb-2">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMakeCharacterTalk(effectiveChar);
                  }}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow border ${
                    speakingCharId === char.id
                      ? 'bg-yellow-400 text-black border-yellow-300 animate-pulse font-black'
                      : 'bg-amber-500/20 hover:bg-amber-500/35 text-amber-300 hover:text-amber-100 border-amber-500/40'
                  }`}
                >
                  <MessageSquare size={13} className={speakingCharId === char.id ? 'animate-bounce text-black' : 'text-amber-400'} />
                  <span>{speakingCharId === char.id ? '🗣️ Speaking...' : '💬 Make Character Talk'}</span>
                </button>
              </div>

              {/* Select Button */}
              <button
                onClick={() => onSelect(effectiveChar)}
                className={`w-full mt-1 py-2 px-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow ${
                  effectiveChar.isHorror
                    ? 'bg-red-800 hover:bg-red-700 text-white'
                    : 'mc-btn mc-btn-primary text-white'
                }`}
              >
                <span>Select {char.name}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Countryball Historical Dossier & Stats Modal */}
      {selectedCountryballDossier && (
        <CountryballDossierModal
          countryball={selectedCountryballDossier}
          onClose={() => setSelectedCountryballDossier(null)}
          onSelect={(c) => {
            onSelect(c);
            setSelectedCountryballDossier(null);
          }}
          allCountryballs={COUNTRYBALLS_DATA}
          onNavigate={(cb) => setSelectedCountryballDossier(cb)}
        />
      )}
    </div>
  );
}
