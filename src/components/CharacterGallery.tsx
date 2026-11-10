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
import { countryballAudio, COUNTRYBALL_AUDIO_PROFILES } from '../utils/countryballAudioLibrary';
import SprunkiBeatStudio from './SprunkiBeatStudio';

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
  { 
    id: 222, 
    name: 'Breeze', 
    type: 'minecraft', 
    subtype: 'breeze', 
    color: 'bg-indigo-500', 
    description: 'Trial Chambers wind elemental with swirling lilac tornado coils, hovering breeze rods, and explosive wind charge blasts!' 
  },
  { 
    id: 223, 
    name: 'Sniffer', 
    type: 'minecraft', 
    subtype: 'sniffer', 
    color: 'bg-emerald-700', 
    description: 'Gentle ancient prehistoric beast with a lush moss-covered shell, sniffing snout for ancient torchflower seeds, and 6 walking legs!' 
  },
  { 
    id: 224, 
    name: 'Armadillo', 
    type: 'minecraft', 
    subtype: 'armadillo', 
    color: 'bg-amber-700', 
    description: 'Savannah traveler with banded terracotta armor shell, folding into a diamond-hard protective cube when startled!' 
  },
  { 
    id: 225, 
    name: 'Frog', 
    type: 'minecraft', 
    subtype: 'frog', 
    color: 'bg-emerald-600', 
    description: 'Bouncy mangrove swamp amphibian with big bulging slit eyes, webbed feet, and glowing Ochre Froglight!' 
  },
  { 
    id: 226, 
    name: 'Camel', 
    type: 'minecraft', 
    subtype: 'camel', 
    color: 'bg-amber-600', 
    description: 'Tall desert traveler with floppy ears, decorative patterned saddle, and rapid dash sprint across cactus dunes!' 
  },
  { 
    id: 227, 
    name: 'Ghast', 
    type: 'minecraft', 
    subtype: 'ghast', 
    color: 'bg-slate-100', 
    description: 'Ghostly white Nether phantom floating through the crimson fog with 9 dangling tentacles and fiery projectile charges!' 
  },
  { 
    id: 228, 
    name: 'Golden Knight Alex', 
    type: 'minecraft', 
    subtype: 'alex', 
    armorTier: 'gold', 
    heldWeapon: 'gold_sword', 
    isEnchanted: true, 
    color: 'bg-amber-400', 
    description: 'Suited in gleaming gilded Nether Gold plate armor, holding an enchanted Golden Sword and a glistening Golden Apple!' 
  },
  { 
    id: 229, 
    name: 'Bogged', 
    type: 'minecraft', 
    subtype: 'bogged', 
    heldWeapon: 'bow', 
    color: 'bg-stone-600', 
    description: 'Moss-covered swamp skeleton sprouting red poisonous mushrooms from its skull, shooting lethal poison-tipped arrows!' 
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
  { 
    id: 185, 
    name: 'Verity', 
    type: 'sprnuki', 
    subtype: 'verity',
    musicalNote: 'Voice 7 / Celestial Starlight Truth',
    color: 'bg-purple-600', 
    description: '✨ The Celestial Star Oracle of Truth! Radiant starlight halo crown, amethyst tiara, celestial wings, and crystalline harmonic glass chimes!' 
  },
  { 
    id: 186, 
    name: 'Eclipse Verity (Horror Phase 2)', 
    type: 'sprnuki', 
    subtype: 'verity',
    isHorror: true,
    musicalNote: 'Abyssal Truth / Void Chime',
    color: 'bg-indigo-950', 
    description: 'Phase 2 Eclipse: Cosmic void entity crowned with a blood starlight tiara, reality-warping truth resonance, and dark matter celestial wings!' 
  },
  { 
    id: 187, 
    name: 'Verity in a Box', 
    type: 'sprnuki', 
    subtype: 'verity_box',
    musicalNote: 'Music Box / Spring Boing Melody',
    color: 'bg-purple-900', 
    description: '📦 The iconic Jack-in-the-Box Verity Morph! Turn the golden winding crank to hear celestial music box notes, then POP! out with star fireworks!' 
  },
  { 
    id: 85, 
    name: 'Tarragower Piper', 
    type: 'sprnuki', 
    subtype: 'tarragower_piper', 
    color: 'bg-emerald-800', 
    description: 'Highland rhythm Sprunki wearing an authentic Scottish Glengarry beret, red toorie pom, and swinging Celtic pipe grooves!' 
  },
  { 
    id: 188, 
    name: 'Cosmic Supernova Verity', 
    type: 'sprnuki', 
    subtype: 'supernova_verity', 
    color: 'bg-violet-600', 
    description: '✨ The Supreme Ascended Celestial Form! Dual radiant galaxy halos, orbiting starburst prisms, and celestial starlight arpeggios!' 
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
  { 
    id: 70, 
    name: 'Murdoch', 
    type: 'train', 
    color: 'bg-emerald-900', 
    description: 'The gentle giant BR Standard 9F heavy goods locomotive with 10 powerful driving wheels who loves the quiet Sodor countryside!' 
  },
  { 
    id: 86, 
    name: 'Daisy', 
    type: 'train', 
    color: 'bg-green-700', 
    description: 'The highly-sprung luxury diesel railcar with fluttery eyelashes, yellow hazard skirts, and impeccably refined passenger manners!' 
  },
  { 
    id: 84, 
    name: 'Boco', 
    type: 'train', 
    color: 'bg-teal-800', 
    description: 'The sensible, friendly Metrovick Type 2 green diesel (D5702) who acts as the peacemaker of Edward\'s branch line!' 
  },
  { 
    id: 850, 
    name: 'Jeremy the Jet Plane (Steremy)', 
    type: 'train', 
    color: 'bg-sky-400', 
    description: 'The legendary high-flying jet plane of Sodor Airport! Built with swept wings, twin turbojets, and a cheerful smile, zooming across the multiverse at Mach 4.' 
  },
  { 
    id: 851, 
    name: 'Holiday Steremy the Christmas Jet', 
    type: 'train', 
    color: 'bg-rose-600', 
    isChristmas: true,
    christmasCostume: 'santa',
    description: 'Festive Christmas edition of Jeremy the Jet Plane! Equipped with candy cane contrails, holiday gift bays, and Christmas bells for supersonic deliveries!' 
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

  // ================= ROBLOX CHARACTERS (ICONIC ROBLOX ROSTER) =================
  {
    id: 501,
    name: 'Classic Noob',
    type: 'roblox',
    subtype: 'noob',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#0055ff',
    robloxLegsColor: '#16a34a',
    robloxFace: 'smile',
    robloxHat: 'none',
    robloxGear: 'sword',
    color: 'bg-yellow-400',
    description: 'The legendary yellow-skinned, blue-shirted, green-legged Roblox icon! Armed with the classic Linked Sword and ready to say "OOF!"',
  },
  {
    id: 502,
    name: 'Bacon Hair (Pal Hair)',
    type: 'roblox',
    subtype: 'bacon',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#1e3a8a',
    robloxLegsColor: '#451a03',
    robloxFace: 'winning',
    robloxHat: 'bacon',
    robloxGear: 'cola',
    color: 'bg-amber-800',
    description: 'The cool modern avatar with iconic swept brown Pal Hair, navy denim jacket, winning smile, and a refreshing can of Bloxy Cola!',
  },
  {
    id: 503,
    name: 'Builderman',
    type: 'roblox',
    subtype: 'builderman',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#ea580c',
    robloxLegsColor: '#334155',
    robloxFace: 'smile',
    robloxHat: 'hardhat',
    robloxGear: 'coil',
    color: 'bg-orange-500',
    description: 'CEO and Chief Architect of Robloxia! Wearing the safety orange hard hat and wielding the bouncing Gravity Coil!',
  },
  {
    id: 504,
    name: 'Guest 666',
    type: 'roblox',
    subtype: 'guest',
    robloxHeadColor: '#1c1917',
    robloxTorsoColor: '#0a0a0a',
    robloxLegsColor: '#09090b',
    robloxFace: 'beast',
    robloxHat: 'beanie',
    robloxGear: 'sword',
    color: 'bg-red-950',
    description: 'The mythical creepypasta legend of Roblox! Pitch black body, demonic glowing red eyes, sharp fangs, and 666 beanie!',
  },
  {
    id: 505,
    name: 'Korblox Deathspeaker',
    type: 'roblox',
    subtype: 'korblox',
    robloxHeadColor: '#0ea5e9',
    robloxTorsoColor: '#0369a1',
    robloxLegsColor: '#075985',
    robloxFace: 'chill',
    robloxHat: 'none',
    robloxGear: 'speed_coil',
    color: 'bg-cyan-600',
    description: 'The frostbite archon of Roblox! Features the famous floating frozen toothpick skeleton leg, icy skull, and glowing red Speed Coil!',
  },
  {
    id: 506,
    name: 'Dominus Aureus',
    type: 'roblox',
    subtype: 'dominus',
    robloxHeadColor: '#09090b',
    robloxTorsoColor: '#18181b',
    robloxLegsColor: '#18181b',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    color: 'bg-neutral-900',
    description: 'Multimillion-Robux mythic hooded emperor! Glowing white void eyes, golden winged trim, and absolute high-society flex!',
  },
  {
    id: 507,
    name: 'Valkyrie Warrior',
    type: 'roblox',
    subtype: 'valkyrie',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#475569',
    robloxLegsColor: '#334155',
    robloxFace: 'epic',
    robloxHat: 'valkyrie',
    robloxGear: 'sword',
    color: 'bg-slate-500',
    description: 'Elite champion wearing the sacred winged silver Valkyrie Helm with emerald crown jewel and epic face!',
  },
  {
    id: 508,
    name: 'Mr. Robot (Roblox Android)',
    type: 'roblox',
    subtype: 'robot',
    robloxHeadColor: '#cbd5e1',
    robloxTorsoColor: '#94a3b8',
    robloxLegsColor: '#64748b',
    robloxFace: 'chill',
    robloxHat: 'hardhat',
    robloxGear: 'subspace',
    color: 'bg-slate-400',
    description: 'Vintage silver metallic robloxian with glowing cyan optic visor, silver head stud, and armed with the explosive Subspace Tripmine!',
  },
  {
    id: 509,
    name: 'Bacon Girl (Acorn Hair)',
    type: 'roblox',
    subtype: 'bacon_girl',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#c084fc',
    robloxLegsColor: '#38bdf8',
    robloxFace: 'happy',
    robloxHat: 'bacon',
    robloxGear: 'cola',
    color: 'bg-purple-400',
    description: 'Pal Hair\'s sister rocking the iconic acorn hair bun, lavender pastel hoodie, happy smile, and a refreshing Bloxy Cola can!',
  },
  {
    id: 510,
    name: 'Shedletsky (Telamon)',
    type: 'roblox',
    subtype: 'shedletsky',
    robloxHeadColor: '#fde047',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#1e3a8a',
    robloxFace: 'winning',
    robloxHat: 'shades',
    robloxGear: 'sword',
    color: 'bg-red-600',
    description: 'Founding administrator of Robloxia! Swinging the glowing Illumina katana, rocking dark shades, and eating crispy fried chicken!',
  },
  {
    id: 511,
    name: '1x1x1x1 (The Void Hacker)',
    type: 'roblox',
    subtype: 'hacker_1x1x1x1',
    robloxHeadColor: '#22c55e',
    robloxTorsoColor: '#0a0a0a',
    robloxLegsColor: '#0a0a0a',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    color: 'bg-emerald-950',
    description: 'The terrifying mythic rogue exploiter shrouded in pitch-black dominus robes, glowing matrix code, and void eyes!',
  },
  {
    id: 512,
    name: 'Slender Boy (Trendy Aesthetic)',
    type: 'roblox',
    subtype: 'slender',
    robloxHeadColor: '#ffffff',
    robloxTorsoColor: '#09090b',
    robloxLegsColor: '#09090b',
    robloxFace: 'epic',
    robloxHat: 'beanie',
    robloxGear: 'speed_coil',
    color: 'bg-neutral-900',
    description: 'Tall modern aesthetic avatar in black layered streetwear, stitched smirk face, and holding a glowing red Speed Coil!',
  },

  // ================= XILAM CHARACTERS =================
  {
    id: 701,
    name: 'Oggy',
    type: 'xilam',
    subtype: 'oggy',
    color: 'bg-blue-500',
    description: 'The lazy, good-natured blue cat from Oggy and the Cockroaches! Armed with his trusty red flyswatter and a dream of peaceful naps.',
  },
  {
    id: 702,
    name: 'Jack',
    type: 'xilam',
    subtype: 'jack',
    color: 'bg-emerald-700',
    description: 'Oggy\'s tough, muscular green cousin and mechanical genius in a white tank shirt! Always ready for high-octane cartoon slapstick.',
  },
  {
    id: 703,
    name: 'Joey',
    type: 'xilam',
    subtype: 'joey',
    color: 'bg-fuchsia-700',
    description: 'The scheming cockroach leader with one pink eye and one yellow eye! Full of grand plans to raid Oggy\'s refrigerator.',
  },
  {
    id: 704,
    name: 'Dee Dee',
    type: 'xilam',
    subtype: 'deedee',
    color: 'bg-orange-500',
    description: 'The ravenous, chubby orange cockroach with big green eyes who will eat absolutely everything in sight!',
  },
  {
    id: 705,
    name: 'Marky',
    type: 'xilam',
    subtype: 'marky',
    color: 'bg-slate-500',
    description: 'The tall, smooth-talking cockroach with curled antennae and romantic guitar serenades.',
  },
  {
    id: 706,
    name: 'Sharko',
    type: 'xilam',
    subtype: 'sharko',
    color: 'bg-slate-400',
    description: 'The muscular great white shark lifeguard from Zig & Sharko! Fierce protector of Marina with unstoppable ocean strength.',
  },
  {
    id: 707,
    name: 'Zig',
    type: 'xilam',
    subtype: 'zig',
    color: 'bg-amber-700',
    description: 'The scruffy desert island hyena forever devising hilarious Rube Goldberg traps and cartoon inventions.',
  },
  {
    id: 708,
    name: 'Marina',
    type: 'xilam',
    subtype: 'marina',
    color: 'bg-teal-400',
    description: 'The joyful, singing mermaid with pink sea star hair clip, lavender hair, and iridescent turquoise tail.',
  },
  {
    id: 709,
    name: 'Bob the Bulldog',
    type: 'xilam',
    subtype: 'bob',
    color: 'bg-amber-900',
    description: 'Oggy\'s giant, muscular bulldog neighbor with spiked dog collar, heavy boxing underbite, and a devastating cartoon punch!',
  },
  {
    id: 710,
    name: 'Olivia',
    type: 'xilam',
    subtype: 'olivia',
    color: 'bg-pink-300',
    description: 'Oggy\'s sweet, elegant white cat girlfriend with a yellow daisy in her ear, pink dress, and a peaceful love for nature!',
  },
  {
    id: 711,
    name: 'Bernie the Hermit Crab',
    type: 'xilam',
    subtype: 'bernie',
    color: 'bg-red-600',
    description: 'Zig\'s brilliant little red hermit crab accomplice with magnifying spectacles and mad-scientist cartoon blueprints!',
  },

  // ================= HALLOWEEN SPOOKTACULAR COSTUME ROSTER =================
  {
    id: 901,
    name: 'Halloween Vampire Steve',
    type: 'minecraft',
    subtype: 'vampire_steve',
    isHalloween: true,
    halloweenCostume: 'vampire',
    customHat: 'hat_vampire',
    customWings: 'back_bat_wings',
    customAura: 'aura_blood_mist',
    heldWeapon: 'candy_corn',
    color: 'bg-neutral-900',
    description: 'Dracula Steve dressed in formal crimson-lined tuxedo, bat wings, and widow\'s peak! Thirsting for candy corn and midnight mining!',
  },
  {
    id: 902,
    name: 'Halloween Witch Alex',
    type: 'minecraft',
    subtype: 'witch_alex',
    isHalloween: true,
    halloweenCostume: 'witch',
    customHat: 'hat_witch',
    customAura: 'aura_halloween_spooky',
    heldWeapon: 'jack_o_lantern',
    color: 'bg-purple-950',
    description: 'Wicked Witch Alex in pointed buckle hat, brewing potions in bubbling cauldrons and riding midnight brooms over the treetops!',
  },
  {
    id: 903,
    name: 'Halloween Pumpkin Creeper',
    type: 'minecraft',
    subtype: 'pumpkin_creeper',
    isHalloween: true,
    halloweenCostume: 'pumpkin',
    customHat: 'hat_pumpkin',
    customAura: 'aura_halloween_spooky',
    color: 'bg-orange-700',
    description: 'Haunted Jack-o\'-Lantern Creeper! When it approaches, it explodes into festive candy corn showers and dancing orange sparks!',
  },
  {
    id: 904,
    name: 'Halloween Skeleton Knight',
    type: 'minecraft',
    subtype: 'skeleton_knight',
    isHalloween: true,
    halloweenCostume: 'skeleton',
    customHat: 'hat_skeleton_skull',
    customWings: 'back_reaper_scythe',
    customAura: 'aura_void',
    heldWeapon: 'reaper_scythe',
    color: 'bg-stone-800',
    description: 'Undead Catacomb Knight armed with the Soul Reaper\'s Scythe! Rattling ribcage armor glowing in the dark underworld!',
  },
  {
    id: 905,
    name: 'Halloween Ghost Polandball',
    type: 'countryball',
    subtype: 'ghost_polandball',
    isHalloween: true,
    halloweenCostume: 'ghost',
    customHat: 'hat_pumpkin',
    customWings: 'back_ghost_float',
    customAura: 'aura_halloween_spooky',
    flag: 'pl',
    color: 'bg-white',
    description: 'Polandball wearing a spooky white bedsheet ghost costume with cutout eyeholes! "BOO! Can Poland into hauntings and candy?!"',
  },
  {
    id: 906,
    name: 'Halloween Frankenstein Oggy',
    type: 'xilam',
    subtype: 'frankenstein_oggy',
    isHalloween: true,
    halloweenCostume: 'frankenstein',
    customHat: 'hat_frankenstein',
    customAura: 'aura_electric',
    color: 'bg-emerald-800',
    description: 'Oggy the Cat turned into Frankenstein\'s monster with neck bolts, stitches, and heavy stomper boots! Still chasing cockroaches!',
  },
  {
    id: 907,
    name: 'Halloween Werewolf Noob',
    type: 'roblox',
    subtype: 'werewolf_noob',
    isHalloween: true,
    halloweenCostume: 'werewolf',
    robloxHeadColor: '#a16207',
    robloxTorsoColor: '#1e3a8a',
    robloxLegsColor: '#1e293b',
    robloxFace: 'beast',
    robloxGear: 'sword',
    customAura: 'aura_blood_mist',
    color: 'bg-amber-900',
    description: 'Classic Roblox Noob transformed by the full bloodmoon! Sharp wolf fangs, fur-padded torso, beast face, and slashing claws!',
  },
  {
    id: 908,
    name: 'Halloween Grim Reaper Ronald',
    type: 'minecraft',
    subtype: 'reaper_ronald',
    isHalloween: true,
    halloweenCostume: 'reaper',
    customHat: 'hat_tophat',
    customWings: 'back_reaper_scythe',
    customAura: 'aura_halloween_spooky',
    heldWeapon: 'reaper_scythe',
    color: 'bg-red-950',
    description: 'McDonald\'s Golden Chef in dark Grim Reaper robes! Serving Happy Meal toy cauldrons and harvesting golden fry souls!',
  },
  {
    id: 909,
    name: 'Halloween Headless Engine Thomas',
    type: 'train',
    subtype: 'headless_thomas',
    isHalloween: true,
    halloweenCostume: 'headless',
    color: 'bg-slate-900',
    description: 'Spooky No. 1 Blue Engine with glowing Jack-o\'-Lantern smoke-box lantern, whistling ghostly echoes through misty railway tunnels!',
  },
  {
    id: 910,
    name: 'Halloween Mummy Brenda BP',
    type: 'minecraft',
    subtype: 'mummy_brenda',
    isHalloween: true,
    halloweenCostume: 'mummy',
    customAura: 'aura_bp_solaris',
    heldWeapon: 'torch',
    color: 'bg-amber-100',
    description: 'BP Eco-Engineer wrapped from head-to-toe in hieroglyphic solar-powered mummy gauze, illuminating ancient catacomb chambers!',
  },
  {
    id: 911,
    name: 'Halloween Jack-o\'-Lantern Verity',
    type: 'sprnuki',
    subtype: 'halloween_verity',
    isHalloween: true,
    halloweenCostume: 'pumpkin',
    customHat: 'hat_pumpkin',
    customWings: 'back_ghost_float',
    customAura: 'aura_halloween_spooky',
    color: 'bg-purple-900',
    description: 'Oracle Verity floating in festive purple witch garments, surrounded by dancing carved pumpkins and showering sweet star candies!',
  },
  {
    id: 912,
    name: 'Gold Ronald McDonald',
    type: 'minecraft',
    subtype: 'gold_ronald',
    isEnchanted: true,
    color: 'bg-amber-500',
    description: 'Golden Arches Ambassador in enchanted gold silk clown robes, serving sparkling Big Mac boxes and spreading golden smiles!',
  },
  // ================= INTEGRATED BRANDS & SCHOOL ROSTER =================
  {
    id: 950,
    name: 'NZ Rangatira Maui Voyager',
    type: 'countryball',
    subtype: 'nz_voyager',
    flag: 'nz',
    customHat: 'hat_silver_fern',
    color: 'bg-black',
    description: 'Māori oceanic voyager carrying the sacred greenstone Pounamu Hei-Tiki pendant and celestial compass!',
  },
  {
    id: 951,
    name: 'Tarragower School Scholar',
    type: 'minecraft',
    subtype: 'tarragower_scholar',
    customHat: 'hat_tophat',
    shirtStyle: 'shirt_tarragower_blazer',
    color: 'bg-indigo-900',
    description: 'Tarragower School researcher mastering structural schematics, redstone engineering, and ancient glyphs!',
  },
  {
    id: 952,
    name: 'BP Helios Solar Engineer',
    type: 'minecraft',
    subtype: 'bp_engineer',
    shirtStyle: 'shirt_bp_suit',
    customAura: 'aura_bp_solaris',
    color: 'bg-emerald-700',
    description: 'BP Helios eco-technician operating solar photon collectors and zero-emission energy turbines!',
  },
  {
    id: 953,
    name: 'Chef Ronald',
    type: 'minecraft',
    subtype: 'mcdonalds_chef',
    customHat: 'hat_chef',
    shirtStyle: 'shirt_mcdonalds',
    color: 'bg-red-600',
    description: 'Executive chef of the Golden Arches serving gourmet banquet provisions and sizzling hot fries!',
  },
  {
    id: 954,
    name: 'Grimace',
    type: 'minecraft',
    subtype: 'grimace',
    color: 'bg-purple-800',
    description: 'Loving cosmic giant wielding the anti-gravity Grimace Shake with mystical purple space aura!',
  },
  {
    id: 955,
    name: 'YouTube Golden Creator',
    type: 'roblox',
    subtype: 'youtube_creator',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#18181b',
    robloxLegsColor: '#18181b',
    robloxFace: 'winning',
    robloxHat: 'shades',
    robloxGear: 'sword',
    color: 'bg-red-600',
    description: '10-Million-Subscriber broadcast pioneer wielding the Diamond Play Button Aegis and studio condenser mic!',
  },
  {
    id: 956,
    name: 'Aeternum Azoth Vanguard',
    type: 'minecraft',
    subtype: 'newworld_vanguard',
    armorTier: 'diamond',
    shirtStyle: 'shirt_newworld_armor',
    color: 'bg-amber-600',
    description: 'Heavy vanguard legionnaire of Aeternum fortified with glowing Azure Azoth energy plates and battle cry!',
  },

  // ================= EXPANDED MINECRAFT ROSTER (TRIAL CHAMBERS & WILD UPDATE) =================
  {
    id: 221,
    name: 'Breeze',
    type: 'minecraft',
    subtype: 'breeze',
    heldWeapon: 'wind_charge',
    color: 'bg-sky-400',
    description: 'Trial Chambers elemental of spinning wind gusts, bouncing around chambers and launching explosive wind charges!',
  },
  {
    id: 222,
    name: 'Sniffer',
    type: 'minecraft',
    subtype: 'sniffer',
    color: 'bg-red-800',
    description: 'Giant prehistoric creature with a moss-covered floral shell sniffing out ancient torchflower seeds!',
  },
  {
    id: 223,
    name: 'Allay',
    type: 'minecraft',
    subtype: 'allay',
    heldWeapon: 'cookie',
    customWings: 'back_angel',
    color: 'bg-cyan-300',
    description: 'Delightful glowing blue spirit of friendship flying on translucent wings, delivering your favorite items with a chime!',
  },
  {
    id: 224,
    name: 'Bogged',
    type: 'minecraft',
    subtype: 'bogged',
    heldWeapon: 'bow',
    color: 'bg-emerald-900',
    description: 'Mossy mangrove swamp skeleton with blooming mushrooms sprouting from its skull, shooting poison-tipped arrows!',
  },
  {
    id: 225,
    name: 'Armadillo',
    type: 'minecraft',
    subtype: 'armadillo',
    color: 'bg-amber-700',
    description: 'Savanna roller with tough scute plates! Rolls into a solid defense sphere whenever danger threatens.',
  },
  {
    id: 226,
    name: 'Wither Boss',
    type: 'minecraft',
    subtype: 'wither',
    heldWeapon: 'netherite_sword',
    customAura: 'aura_void',
    color: 'bg-neutral-950',
    description: 'Terrifying 3-headed nether sovereign hovering above cratered bedrock, unleashing wither skull barrages and blue shockwaves!',
  },
  {
    id: 227,
    name: 'Ender Dragon',
    type: 'minecraft',
    subtype: 'ender_dragon',
    customWings: 'back_dragon',
    customAura: 'aura_cosmic',
    color: 'bg-purple-950',
    description: 'Majestic empress of the End with obsidian scales, violet breath beams, and massive sweeping wingspan!',
  },
  {
    id: 228,
    name: 'Netherite Knight Alex',
    type: 'minecraft',
    subtype: 'netherite_alex',
    armorTier: 'netherite',
    heldWeapon: 'diamond_sword',
    cape: 'elytra',
    isEnchanted: true,
    color: 'bg-stone-900',
    description: 'Alex fully outfitted in enchanted Netherite armor, twin Elytra wings, and glowing Ancient Debris longsword!',
  },
  {
    id: 229,
    name: 'Desert Camel',
    type: 'minecraft',
    subtype: 'camel',
    color: 'bg-amber-200',
    description: 'Tall desert traveler with floppy ears and a double saddle, dashing across dunes and safely out of reach of standard mobs!',
  },
  {
    id: 230,
    name: 'Mangrove Frog',
    type: 'minecraft',
    subtype: 'frog',
    color: 'bg-emerald-500',
    description: 'Cheerful croaking swamp amphibian that eats tiny magma cubes to produce glowing froglight lanterns!',
  },

  // ================= EXPANDED ROBLOX AVATARS =================
  {
    id: 513,
    name: 'Builderman',
    type: 'roblox',
    subtype: 'builderman',
    robloxHeadColor: '#fde047',
    robloxTorsoColor: '#ea580c',
    robloxLegsColor: '#1e3a8a',
    robloxFace: 'smile',
    robloxHat: 'hardhat',
    robloxGear: 'subspace',
    color: 'bg-orange-500',
    description: 'The master engineer and founding builder of Robloxia! High-visibility safety vest, yellow hardhat, and construction wrench!',
  },
  {
    id: 514,
    name: 'Guest 666',
    type: 'roblox',
    subtype: 'guest_666',
    robloxHeadColor: '#0a0a0a',
    robloxTorsoColor: '#450a0a',
    robloxLegsColor: '#000000',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    customAura: 'aura_blood_mist',
    color: 'bg-red-950',
    description: 'The infamous creepypasta guest with piercing crimson pupil eyes, dark aura of corruption, and flaming horns!',
  },
  {
    id: 515,
    name: 'John Doe',
    type: 'roblox',
    subtype: 'john_doe',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#71717a',
    robloxLegsColor: '#27272a',
    robloxFace: 'chill',
    robloxHat: 'none',
    robloxGear: 'none',
    color: 'bg-stone-600',
    description: 'The legendary test account of March 18th folklore! Black jacket, slicked hair, and an enigmatic, stoic stare.',
  },
  {
    id: 516,
    name: 'Dominus Empyreus Sovereign',
    type: 'roblox',
    subtype: 'dominus_empyreus',
    robloxHeadColor: '#fef08a',
    robloxTorsoColor: '#ffffff',
    robloxLegsColor: '#ffffff',
    robloxFace: 'epic',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    customWings: 'back_angel',
    customAura: 'aura_celestial',
    color: 'bg-yellow-100',
    description: 'The holy grail of Roblox catalog wealth! Golden winged armor, blinding sacred aura, and the mythic Dominus Empyreus hood.',
  },
  {
    id: 517,
    name: 'Blue (Rainbow Friends)',
    type: 'roblox',
    subtype: 'rainbow_blue',
    robloxHeadColor: '#2563eb',
    robloxTorsoColor: '#1d4ed8',
    robloxLegsColor: '#1e40af',
    robloxFace: 'happy',
    robloxHat: 'valkyrie',
    robloxGear: 'none',
    color: 'bg-blue-600',
    description: 'The big lovable blue friend with a tilted yellow king crown, cartoon button eye, and a trail of sweet drool!',
  },
  {
    id: 518,
    name: 'Figure (DOORS)',
    type: 'roblox',
    subtype: 'doors_figure',
    robloxHeadColor: '#78350f',
    robloxTorsoColor: '#451a03',
    robloxLegsColor: '#292524',
    robloxFace: 'void',
    robloxHat: 'none',
    robloxGear: 'none',
    customAura: 'aura_blood_mist',
    color: 'bg-amber-950',
    description: 'The terrifying blind librarian from Hotel DOORS! Huge gaping circular jaw lined with razor teeth and stomping footsteps!',
  },
  {
    id: 519,
    name: 'Brookhaven Police Chief',
    type: 'roblox',
    subtype: 'brookhaven_police',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#0f172a',
    robloxLegsColor: '#020617',
    robloxFace: 'winning',
    robloxHat: 'shades',
    robloxGear: 'speed_coil',
    color: 'bg-blue-950',
    description: 'Keeping the streets of Brookhaven safe! High-speed pursuit cruiser keys, gold law badge, and reflective aviators.',
  },
  {
    id: 520,
    name: 'Blox Fruits Swordsman',
    type: 'roblox',
    subtype: 'blox_fruits_swordsman',
    robloxHeadColor: '#fde047',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#18181b',
    robloxFace: 'epic',
    robloxHat: 'bacon',
    robloxGear: 'sword',
    customWings: 'back_katana',
    color: 'bg-red-700',
    description: 'Master of the Three-Sword Style and legendary Blox Fruit powers! Cutting sea beasts with devastating flying slash waves.',
  },

  // ================= EXPANDED COUNTRYBALLS =================
  {
    id: 631,
    name: 'Japanball (Neko Kawaii)',
    type: 'countryball',
    subtype: 'japan_neko',
    flag: 'jp',
    customHat: 'hat_party',
    color: 'bg-white',
    description: 'Super cute Japanball with fluffy anime cat ears, pink sakura cherry blossoms, and adorable kawaii blush lines! "Nyan~!"',
  },
  {
    id: 632,
    name: 'Italyball (Pizza Chef)',
    type: 'countryball',
    subtype: 'italy_chef',
    flag: 'it',
    customHat: 'hat_chef',
    color: 'bg-green-600',
    description: 'Master culinary artist Italyball in a tall white chef toque, tossing fresh Neapolitan dough and singing joyous operatic arias!',
  },
  {
    id: 633,
    name: 'Brazilball (Carnaval & Futebol)',
    type: 'countryball',
    subtype: 'brazil_carnaval',
    flag: 'br',
    customHat: 'hat_viking',
    color: 'bg-green-500',
    description: 'Energetic Brazilball dancing samba with festive Rio carnival plumes and kicking the gold World Cup soccer ball!',
  },
  {
    id: 634,
    name: 'Switzerlandball (Alpine Medic)',
    type: 'countryball',
    subtype: 'switzerland_medic',
    flag: 'ch',
    color: 'bg-red-600',
    description: 'Strictly neutral Switzerlandball equipped with red cross first-aid kit, precision gold watches, and delicious Swiss chocolate!',
  },
  {
    id: 635,
    name: 'Australiaball (Outback Explorer)',
    type: 'countryball',
    subtype: 'australia_outback',
    flag: 'au',
    customHat: 'hat_silver_fern',
    color: 'bg-blue-900',
    description: 'G\'day mate! Rugged Australian bushwhacker with a cork-dangling slouch hat, aerodynamic boomerang, and kangaroo buddy.',
  },
  {
    id: 636,
    name: 'Egyptball (Pharaoh of the Nile)',
    type: 'countryball',
    subtype: 'egypt_pharaoh',
    flag: 'eg',
    customHat: 'hat_crown',
    color: 'bg-yellow-600',
    description: 'Ancient royal Egyptball adorned in gold-and-lapis Nemes headcloth, holding the golden Ankh of eternal life and building pyramids!',
  },
  {
    id: 637,
    name: 'South Koreaball (K-Pop Cyberpunk)',
    type: 'countryball',
    subtype: 'korea_kpop',
    flag: 'kr',
    customHat: 'hat_party',
    color: 'bg-white',
    description: 'Seoul sensation South Koreaball with neon LED visor, wireless headset microphone, and stadium-rocking holographic lightsticks!',
  },
  {
    id: 638,
    name: 'Irelandball (Leprechaun Luck)',
    type: 'countryball',
    subtype: 'ireland_leprechaun',
    flag: 'ie',
    customHat: 'hat_tophat',
    color: 'bg-emerald-600',
    description: 'Emerald Isle Irelandball rocking a buckle top hat, golden shamrock clover, and guarding a sparkling pot of gold at rainbow\'s end!',
  },
  {
    id: 639,
    name: 'Mexicoball (Mariachi Charro)',
    type: 'countryball',
    subtype: 'mexico_mariachi',
    flag: 'mx',
    customHat: 'hat_sombrero',
    color: 'bg-green-700',
    description: 'Viva México! Splendid broad-brimmed sombrero, colorful serape poncho, and strumming festive vihuela chords under the desert sun!',
  },
  {
    id: 640,
    name: 'Icelandball (Aurora Borealis)',
    type: 'countryball',
    subtype: 'iceland_aurora',
    flag: 'is',
    customAura: 'aura_celestial',
    color: 'bg-cyan-700',
    description: 'Land of Fire and Ice! Glowing with pulsating emerald northern lights aura, geothermal geyser steam, and volcanic crystals.',
  },

  // ================= EXPANDED THOMAS & FRIENDS LOCOMOTIVES =================
  {
    id: 416,
    name: 'Percy (No. 6 Green Saddle Tank)',
    type: 'train',
    subtype: 'percy',
    color: 'bg-emerald-600',
    description: 'Cheeky, faithful No. 6 small green saddle tank engine who loves pulling the midnight mail train and bantering with Thomas!',
  },
  {
    id: 417,
    name: 'Gordon (No. 4 Royal Express Engine)',
    type: 'train',
    subtype: 'gordon',
    color: 'bg-blue-700',
    description: 'Grand and glorious No. 4 royal blue express engine! Boasting thunderous cylinders as he races down the main line with the Wild Nor\' Wester!',
  },
  {
    id: 418,
    name: 'James (No. 5 Splendid Red Engine)',
    type: 'train',
    subtype: 'james',
    color: 'bg-red-600',
    description: 'The splendid No. 5 engine shining in bright scarlet red paint with polished brass dome, eager for passenger coaches and sunny runs!',
  },
  {
    id: 419,
    name: 'Emily (No. 12 Emerald Stirling Single)',
    type: 'train',
    subtype: 'emily',
    color: 'bg-emerald-800',
    description: 'Graceful, kind emerald green single-wheeler engine with giant driving wheels and dark green brass-lined coaches!',
  },
  {
    id: 420,
    name: 'Diesel (Class 08 Shunter)',
    type: 'train',
    subtype: 'diesel',
    color: 'bg-neutral-900',
    description: 'Oily and scheming black diesel shunter from the Other Railway, full of cunning tricks and heavy yard switching power!',
  },
  {
    id: 421,
    name: 'Sir Topham Hatt (The Fat Controller)',
    type: 'train',
    subtype: 'sir_topham_hatt',
    customHat: 'hat_tophat',
    color: 'bg-yellow-600',
    description: 'The head of the Sodor Railway in top hat, black tailcoat, and gold watch, ensuring all engines remain Really Useful!',
  },
  {
    id: 422,
    name: 'Flying Scotsman (LNER 4472)',
    type: 'train',
    subtype: 'flying_scotsman',
    color: 'bg-emerald-700',
    description: 'World record-breaking two-tender Pacific locomotive, Gordon\'s illustrious brother who conquered 100 MPH across Britain!',
  },

  // ================= EXPANDED SPRUNKI & INCREDIBOX BEATS =================
  {
    id: 187,
    name: 'Garnold (Golden Vinyl DJ)',
    type: 'sprnuki',
    subtype: 'garnold',
    color: 'bg-yellow-500',
    musicalNote: '🎺',
    description: 'Golden turntable scratch DJ laying down deep brass stabs, funky horns, and dazzling rhythm loops!',
  },
  {
    id: 188,
    name: 'Tunner (Cyber Synthesizer)',
    type: 'sprnuki',
    subtype: 'tunner',
    color: 'bg-amber-800',
    musicalNote: '🎹',
    description: 'Smooth jazz synth soloist in amber fedora, weaving complex chord progressions and silky vocoder tones.',
  },
  {
    id: 189,
    name: 'Simon (Golden Beat Drummer)',
    type: 'sprnuki',
    subtype: 'simon',
    color: 'bg-yellow-400',
    musicalNote: '🥁',
    description: 'The cheerful whistling lad with bouncing golden antennae, driving the tempo with snappy 808 snare kicks!',
  },
  {
    id: 190,
    name: 'Brud (Brown Sub-Bass Vocalist)',
    type: 'sprnuki',
    subtype: 'brud',
    color: 'bg-amber-900',
    musicalNote: '🔉',
    description: 'Deep subterranean sub-bass guru in warm brown beanie, generating chest-thumping bass frequencies that rattle the stage!',
  },
  {
    id: 191,
    name: 'Pinki (Popstar Melodic Diva)',
    type: 'sprnuki',
    subtype: 'pinki',
    color: 'bg-pink-500',
    musicalNote: '💖',
    description: 'Radiant pop soloist with heart hairpin and star microphone, hitting soaring vocal heights with sweet harmonies!',
  },
  {
    id: 192,
    name: 'Gray (Ambient Chillwave Pad)',
    type: 'sprnuki',
    subtype: 'gray',
    color: 'bg-slate-600',
    musicalNote: '☁️',
    description: 'Monochrome ambient soundscaper weaving lush reverb pads, gentle white noise rain, and lo-fi textures.',
  },
  {
    id: 193,
    name: 'Mr. Sun (Solar Radiant Brass)',
    type: 'sprnuki',
    subtype: 'mr_sun',
    color: 'bg-yellow-500',
    musicalNote: '☀️',
    description: 'Blazing golden sunbeam crown bursting with uplifting morning fanfare and soaring trumpet fanfares!',
  },
  {
    id: 194,
    name: 'Mr. Tree (Forest Percussionist)',
    type: 'sprnuki',
    subtype: 'mr_tree',
    color: 'bg-emerald-700',
    musicalNote: '🍃',
    description: 'Ancient living oak with lush foliage crown, tapping organic woodblocks, hollow bamboo, and rustling forest leaves.',
  },

  // ================= EXPANDED XILAM ANIMATION CARTOON ROSTER =================
  {
    id: 712,
    name: 'Rantanplan (The Goofiest Hound)',
    type: 'xilam',
    subtype: 'rantanplan',
    color: 'bg-amber-500',
    description: 'The delightfully clueless, lovable prison hound who chases his own tail and falls asleep on top of dynamite boxes!',
  },
  {
    id: 713,
    name: 'Joe Dalton (Hot-Tempered Outlaw)',
    type: 'xilam',
    subtype: 'joe_dalton',
    color: 'bg-yellow-500',
    description: 'The pint-sized, red-faced leader of the Dalton Brothers in striped jail pyjamas! Fuming with fury whenever Lucky Luke appears!',
  },
  {
    id: 714,
    name: 'Averell Dalton (The Hungry Giant)',
    type: 'xilam',
    subtype: 'averell_dalton',
    color: 'bg-amber-600',
    description: 'The towering, kind-hearted giant of the Dalton clan whose only real criminal ambition is finding out when supper is served!',
  },
  {
    id: 715,
    name: 'Lucky Luke (Fastest Gun in the West)',
    type: 'xilam',
    subtype: 'lucky_luke',
    color: 'bg-yellow-400',
    description: 'The legendary lone cowboy in white Stetson and red bandana who shoots faster than his own shadow and brings outlaws to justice!',
  },
  {
    id: 716,
    name: 'Dee Dee Hungry Mode (Giant Cockroach)',
    type: 'xilam',
    subtype: 'deedee_hungry',
    heldWeapon: 'cookie',
    color: 'bg-orange-600',
    description: 'Dee Dee at full appetite capacity! Armed with an oversized fork and spoon, ready to swallow entire wedding cakes in one bite!',
  },

  // ================= EXPANDED MULTIVERSE BRANDS & SCHOOLS =================
  {
    id: 957,
    name: 'Mayor McCheese (McDonaldland)',
    type: 'minecraft',
    subtype: 'mcdonalds_mayor',
    customHat: 'hat_tophat',
    color: 'bg-amber-600',
    description: 'Distinguished cheeseburger-headed mayor of McDonaldland wearing a silk top hat, ceremonial sash, and pince-nez spectacles!',
  },
  {
    id: 958,
    name: 'Hamburglar (McDonald\'s)',
    type: 'minecraft',
    subtype: 'mcdonalds_hamburglar',
    customHat: 'hat_tophat',
    customWings: 'back_mojang',
    color: 'bg-neutral-900',
    description: 'The classic masked burger mischief maker in black-and-white stripes, wide-brim fedora, and red cape shouting "Robble Robble!"',
  },
  {
    id: 959,
    name: 'Birdie the Early Bird (McDonald\'s)',
    type: 'minecraft',
    subtype: 'mcdonalds_birdie',
    customWings: 'back_angel',
    color: 'bg-yellow-400',
    description: 'Joyful yellow bird in pink aviator goggles and flight cap, soaring in for delicious breakfast hotcakes and egg sandwiches!',
  },
  {
    id: 960,
    name: 'Tarragower School Headmaster',
    type: 'minecraft',
    subtype: 'tarragower_headmaster',
    customHat: 'hat_tophat',
    color: 'bg-indigo-950',
    description: 'Venerable head of Tarragower School in ceremonial graduation robes, presenting the golden quill and academic awards of excellence!',
  },
  {
    id: 961,
    name: 'Tarragower Athletics Champion',
    type: 'minecraft',
    subtype: 'tarragower_champion',
    color: 'bg-blue-600',
    description: 'Tarragower sports captain holding the gold championship trophy, leading house teams in cross-country sprints and relays!',
  },
  {
    id: 962,
    name: 'BP Helios Aero-Kineticist',
    type: 'minecraft',
    subtype: 'bp_kineticist',
    customWings: 'back_elytra',
    customAura: 'aura_bp_solaris',
    color: 'bg-emerald-600',
    description: 'High-altitude clean wind-energy aeronaut testing carbon-neutral glider wings and aerodynamic storm turbines!',
  },
  {
    id: 963,
    name: 'YouTube Diamond Play Button Titan',
    type: 'roblox',
    subtype: 'youtube_diamond',
    robloxHeadColor: '#38bdf8',
    robloxTorsoColor: '#0f172a',
    robloxLegsColor: '#0f172a',
    robloxFace: 'winning',
    robloxHat: 'valkyrie',
    robloxGear: 'sword',
    customWings: 'back_angel',
    customAura: 'aura_celestial',
    color: 'bg-cyan-500',
    description: 'Apex digital creator celebrated for reaching 10 Million subscribers! Armed with the Diamond Play Button Aegis and crystal wings!',
  },
  {
    id: 964,
    name: 'New World Marauder Commander',
    type: 'minecraft',
    subtype: 'newworld_marauder',
    armorTier: 'netherite',
    heldWeapon: 'diamond_sword',
    color: 'bg-green-700',
    description: 'Battle-hardened vanguard commander of the Marauder military faction on Aeternum, clad in spiked iron battle armor!',
  },
  {
    id: 965,
    name: 'New World Syndicate Alchemist',
    type: 'minecraft',
    subtype: 'newworld_syndicate',
    customAura: 'aura_void',
    color: 'bg-purple-900',
    description: 'Occult researcher of the Syndicate faction unraveling dark Azoth corruption secrets and brewing ethereal vitality elixirs!',
  },
  {
    id: 966,
    name: 'Wither Skeleton Vanguard',
    type: 'minecraft',
    subtype: 'wither_skeleton',
    armorTier: 'netherite',
    heldWeapon: 'stone_sword',
    color: 'bg-stone-900',
    description: 'Towering char-black skeletal warrior patrolling Nether fortresses with withered soul blades!',
  },
  {
    id: 967,
    name: 'Breeze Gale Dancer',
    type: 'minecraft',
    subtype: 'breeze',
    customAura: 'aura_wind',
    color: 'bg-sky-400',
    description: 'Swirling Trial Chamber elemental that leaps in high parabolas and unleashes explosive wind charges!',
  },
  {
    id: 968,
    name: 'Deep Dark Sculk Shrieker',
    type: 'minecraft',
    subtype: 'sculk_shrieker',
    customAura: 'aura_sculk',
    color: 'bg-cyan-950',
    description: 'Ancient acoustic sensor vibrating with bioluminescent deep-dark resonance, guarding subterranean catacombs!',
  },
  {
    id: 969,
    name: 'Guest 666 Shadow Fiend',
    type: 'roblox',
    subtype: 'guest666',
    customAura: 'aura_fire',
    color: 'bg-red-950',
    description: 'Legendary creepypasta shadow guest of old Roblox folklore, wielding demonic claws and shadow teleportation!',
  },
  {
    id: 970,
    name: 'Builderman Master Architect',
    type: 'roblox',
    subtype: 'builderman',
    color: 'bg-yellow-600',
    description: 'The benevolent chief builder and architect of Robloxia, armed with the golden wrench of creation!',
  },
  {
    id: 971,
    name: 'Telamon Shedletsky Chicken Master',
    type: 'roblox',
    subtype: 'shedletsky',
    color: 'bg-amber-700',
    description: 'Iconic veteran administrator wielding colossal crispy fried drumsticks and legendary Telamon linked hyper-blades!',
  },
  {
    id: 972,
    name: 'Korblox Deathspeaker Sovereign',
    type: 'roblox',
    subtype: 'korblox',
    armorTier: 'netherite',
    customAura: 'aura_frost',
    color: 'bg-blue-950',
    description: 'The chilling floating necromancer lord of Korblox realm, featuring the infamous floating ice bone leg!',
  },
  {
    id: 973,
    name: 'Flying Scotsman Express Legend',
    type: 'train',
    color: 'bg-emerald-600',
    description: 'World-famous two-tender LNER Class A3 locomotive celebrated for smashing the 100 mph steam railway record!',
  },
  {
    id: 974,
    name: 'Diesel 10 with Pinchy Claw',
    type: 'train',
    color: 'bg-amber-600',
    description: 'The menacing warship-class diesel engine featuring his rooftop hydraulic crusher claw "Pinchy"!',
  },
  {
    id: 975,
    name: 'Emily the Emerald Engine',
    type: 'train',
    color: 'bg-emerald-700',
    description: 'Elegant Stirling Single locomotive with magnificent giant brass driving wheels and coaches of distinction!',
  },
  {
    id: 976,
    name: 'Brazilball Samba Champion',
    type: 'countryball',
    color: 'bg-emerald-500',
    description: 'Energetic carnival football maestro dancing to infectious samba rhythms with five World Cup stars!',
  },
  {
    id: 977,
    name: 'SouthKoreaball K-Pop Star',
    type: 'countryball',
    color: 'bg-rose-500',
    description: 'Ultra-stylish dance star and cyber-sports titan radiating neon aegis and world-charting melodies!',
  },
  {
    id: 978,
    name: 'Australiaball Boomerang Outbacker',
    type: 'countryball',
    color: 'bg-amber-600',
    description: 'Fearless outback explorer wearing a cork slouch hat and taming desert reptiles with seasoned boomerangs!',
  },
  {
    id: 979,
    name: 'Jevin Neon Synth Maestro',
    type: 'sprnuki',
    subtype: 'jevin',
    color: 'bg-teal-500',
    description: 'Cyberpunk Sprunki beatboxer laying down hypnotic 140 BPM synth arpeggios that supercharge nearby allies!',
  },
  {
    id: 980,
    name: 'Dee Dee Hungry Cockroach',
    type: 'xilam',
    subtype: 'deedee',
    color: 'bg-orange-600',
    description: 'The chubby ravenous blue-headed cockroach whose eternal quest is raiding Oggy’s refrigerator!',
  },
  {
    id: 981,
    name: 'Marky Tall Cockroach',
    type: 'xilam',
    subtype: 'marky',
    color: 'bg-slate-700',
    description: 'The suave, tall, romance-obsessed cockroach strumming acoustic love serenades amidst kitchen chaos!',
  },
  {
    id: 982,
    name: 'Mayor McCheese Gourmet Politician',
    type: 'custom',
    classArchetype: 'mcdonalds_crew',
    color: 'bg-amber-600',
    description: 'Distinguished cheeseburger-headed mayor of McDonaldland wearing a presidential sash and top hat!',
  },
  {
    id: 983,
    name: 'Hamburglar Stealth Robber',
    type: 'custom',
    classArchetype: 'mcdonalds_crew',
    color: 'bg-neutral-800',
    description: 'The striped masked rogue famous for sneaking through McDonald\'s burger vaults chanting "Robble Robble!"',
  },
  {
    id: 984,
    name: 'BP Solar Clean Drone Pilot',
    type: 'custom',
    classArchetype: 'bp_engineer',
    color: 'bg-emerald-600',
    description: 'High-tech solar drone pilot surveying mega-scale solar panel fields and zero-emission battery arrays!',
  },
  {
    id: 985,
    name: 'Tarragower Senior Prefect Luminary',
    type: 'custom',
    classArchetype: 'tarragower_scholar',
    color: 'bg-indigo-900',
    description: 'Top academic prefect of Tarragower Academy mastering navigation cartography and celestial sciences!',
  },

  // ================= 🎄 CHRISTMAS & HOLIDAY MULTIVERSE ROSTER 🎄 =================
  {
    id: 1001,
    name: 'Santa Steve',
    type: 'minecraft',
    subtype: 'steve',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_santa_beard',
    customWings: 'back_santa_sack',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_snowflake',
    shirtStyle: 'shirt_santa_suit',
    pantsStyle: 'pants_santa',
    color: 'bg-red-700',
    description: 'Father Christmas Steve delivering Diamond Blocks and enchanted golden apples down every chimney across the Overworld!',
  },
  {
    id: 1002,
    name: 'Elf Alex',
    type: 'minecraft',
    subtype: 'alex',
    isChristmas: true,
    christmasCostume: 'elf',
    customHat: 'hat_elf_hat',
    customFace: 'face_elf_ears',
    customWings: 'back_festive_wreath',
    customAura: 'aura_christmas_lights',
    customEmblem: 'emblem_candy_cane',
    shirtStyle: 'shirt_elf_tunic',
    pantsStyle: 'pants_elf',
    color: 'bg-emerald-600',
    description: 'Chief toy workshop engineer crafting redstone train sets and clockwork music boxes at the North Pole!',
  },
  {
    id: 1003,
    name: 'Rudolph the Red-Nosed Creeper',
    type: 'minecraft',
    subtype: 'creeper',
    isChristmas: true,
    christmasCostume: 'reindeer',
    customHat: 'hat_reindeer_antlers',
    customFace: 'face_frosty_blush',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_christmas_star',
    color: 'bg-emerald-700',
    description: 'The gentlest creeper whose glowing ruby nose guides Santa\'s sleigh through dense blizzards! Explodes with colorful confetti!',
  },
  {
    id: 1004,
    name: 'Frosty Snow Golem with Carved Top Hat',
    type: 'minecraft',
    subtype: 'snow_golem',
    isChristmas: true,
    christmasCostume: 'snow_golem',
    customHat: 'hat_tophat',
    customWings: 'back_snow_globe',
    customAura: 'aura_blizzard',
    customEmblem: 'emblem_snowflake',
    color: 'bg-cyan-200',
    description: 'Enchanted jolly snowman leaving pristine snow trails, slinging playful snowballs that deal friendly festive knockback!',
  },
  {
    id: 1005,
    name: 'Santa Bloxian Noob',
    type: 'roblox',
    subtype: 'santa_noob',
    isChristmas: true,
    christmasCostume: 'santa',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#18181b',
    robloxFace: 'happy',
    customHat: 'hat_santa',
    customFace: 'face_santa_beard',
    customWings: 'back_santa_sack',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_gift_box',
    shirtStyle: 'shirt_santa_suit',
    color: 'bg-red-600',
    description: 'Classic yellow-and-red Robloxian dressed as Santa, handing out free Robux and toy blox to every player in the server!',
  },
  {
    id: 1006,
    name: 'Nutcracker Toy Soldier Bloxian',
    type: 'roblox',
    subtype: 'nutcracker_blox',
    isChristmas: true,
    christmasCostume: 'nutcracker',
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#1e3a8a',
    robloxFace: 'chill',
    customHat: 'hat_nutcracker',
    customEmblem: 'emblem_roblox',
    customAura: 'aura_jingle_bells',
    robloxGear: 'sword',
    color: 'bg-red-800',
    description: 'Stately clockwork soldier from the Land of Sweets guarding the holiday tree with his gold-hilted saber!',
  },
  {
    id: 1007,
    name: 'Frost Dominus Snowlord',
    type: 'roblox',
    subtype: 'frost_dominus',
    isChristmas: true,
    customHat: 'hat_dominus',
    customWings: 'back_snow_globe',
    customAura: 'aura_blizzard',
    customEmblem: 'emblem_snowflake',
    robloxHeadColor: '#38bdf8',
    robloxTorsoColor: '#0f172a',
    robloxLegsColor: '#0f172a',
    robloxFace: 'void',
    color: 'bg-cyan-600',
    description: 'Mythic arctic Dominus forged from absolute zero permafrost, whispering frosty winter tidings across the metaverse.',
  },
  {
    id: 1008,
    name: 'Christmas Polandball',
    type: 'countryball',
    subtype: 'poland',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customWings: 'back_santa_sack',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_gift_box',
    flag: '🇵🇱',
    color: 'bg-red-500',
    description: 'Polandball wearing Santa\'s velvet hat! Bringing pierogi and gingerbread to all sovereign nations. Santa CAN into space!',
  },
  {
    id: 1009,
    name: 'Father Christmas UKball',
    type: 'countryball',
    subtype: 'uk',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_monocle',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_countryball',
    flag: '🇬🇧',
    color: 'bg-blue-800',
    description: 'Victorian Father Christmas UKball toasting holiday cheer with hot Earl Grey tea and plum pudding under the mistletoe!',
  },
  {
    id: 1010,
    name: 'Joulupukki Finlandball',
    type: 'countryball',
    subtype: 'finland',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_santa_beard',
    customWings: 'back_festive_wreath',
    customAura: 'aura_blizzard',
    customEmblem: 'emblem_snowflake',
    flag: '🇫🇮',
    color: 'bg-blue-600',
    description: 'The original Santa Claus of Lapland! Journeying from Korvatunturi with loyal reindeer to bring genuine Arctic joy.',
  },
  {
    id: 1011,
    name: 'Festive USAball Holiday Star',
    type: 'countryball',
    subtype: 'usa',
    isChristmas: true,
    customHat: 'hat_santa',
    customFace: 'face_shades',
    customAura: 'aura_christmas_lights',
    customEmblem: 'emblem_christmas_star',
    flag: '🇺🇸',
    color: 'bg-blue-700',
    description: 'USAball decked out with 50,000 electric holiday lights, candy canes, and classic pixel shades on Christmas morning!',
  },
  {
    id: 1012,
    name: 'Thomas (Christmas Sodor Express)',
    type: 'train',
    subtype: 'thomas_christmas',
    isChristmas: true,
    customHat: 'hat_santa',
    customWings: 'back_festive_wreath',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_snowflake',
    color: 'bg-blue-600',
    description: 'Thomas the Tank Engine decorated with pine garland, a giant Santa cap on his funnel, and snowplow clearing the mainline!',
  },
  {
    id: 1013,
    name: 'Percy (Holiday Mail Express)',
    type: 'train',
    subtype: 'percy_christmas',
    isChristmas: true,
    customHat: 'hat_elf_hat',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_candy_cane',
    color: 'bg-emerald-600',
    description: 'Percy the Small Engine pulling the heavy Sodor Christmas Mail coaches through deep snowdrifts to deliver holiday letters!',
  },
  {
    id: 1014,
    name: 'Santa Oren (Holiday Beatmaster)',
    type: 'sprnuki',
    subtype: 'oren_christmas',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_santa_beard',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_gingerbread_man',
    musicalNote: '🔔',
    color: 'bg-red-600',
    description: 'Oren dropping rhythmic 808 sleigh-bell beats and warm festive bass grooves for the Multiverse holiday party!',
  },
  {
    id: 1015,
    name: 'Festive Simon (Jingle Bell Whistle)',
    type: 'sprnuki',
    subtype: 'simon_christmas',
    isChristmas: true,
    christmasCostume: 'elf',
    customHat: 'hat_elf_hat',
    customAura: 'aura_christmas_lights',
    customEmblem: 'emblem_candy_cane',
    musicalNote: '🎶',
    color: 'bg-yellow-400',
    description: 'Simon whistling beloved Christmas carols with glowing candy-cane antennae and cheerful syncopated bell chimes!',
  },
  {
    id: 1016,
    name: 'Celestial Christmas Star Verity',
    type: 'sprnuki',
    subtype: 'verity_star',
    isChristmas: true,
    customHat: 'hat_christmas_tree',
    customWings: 'back_snow_globe',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_christmas_star',
    musicalNote: '✨',
    color: 'bg-cyan-300',
    description: 'Oracle Verity glowing with the warmth of the Bethlehem Christmas Star, radiating ethereal starlight choral harmonies.',
  },
  {
    id: 1017,
    name: 'Santa Oggy & Holiday Sled',
    type: 'xilam',
    subtype: 'oggy_santa',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_santa_beard',
    customWings: 'back_santa_sack',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_xilam',
    color: 'bg-sky-500',
    description: 'Oggy dressed as Santa trying to deliver gifts peacefully, while dodging hilarious cockroach ice traps and snowball booby traps!',
  },
  {
    id: 1018,
    name: 'Gingerbread Dee Dee (Cookie Glutton)',
    type: 'xilam',
    subtype: 'deedee_gingerbread',
    isChristmas: true,
    christmasCostume: 'gingerbread',
    customHat: 'hat_elf_hat',
    customWings: 'back_gingerbread_shield',
    customEmblem: 'emblem_gingerbread_man',
    color: 'bg-amber-600',
    description: 'Dee Dee coated in sugar icing and gumdrops, devouring all of Jack and Oggy\'s holiday cookies in five seconds flat!',
  },
  {
    id: 1019,
    name: 'Santa Ronald McDonald',
    type: 'minecraft',
    subtype: 'ronald_santa',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customWings: 'back_santa_sack',
    customAura: 'aura_gold',
    customEmblem: 'emblem_mcdonalds',
    shirtStyle: 'shirt_santa_suit',
    color: 'bg-red-600',
    description: 'Ronald McDonald handing out giant Holiday Feast Buckets, piping hot apple pies, and golden toys to celebrating players!',
  },
  {
    id: 1020,
    name: 'Gingerbread Grimace & Peppermint Shake',
    type: 'minecraft',
    subtype: 'grimace_peppermint',
    isChristmas: true,
    christmasCostume: 'gingerbread',
    customHat: 'hat_snow_beanie',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_mcdonalds',
    color: 'bg-purple-800',
    description: 'Grimace in a cozy winter beanie serving limited-edition Peppermint Holiday Shakes that grant frost resistance and jump boost!',
  },
  {
    id: 1021,
    name: 'Tarragower Holiday Caroler Choir',
    type: 'minecraft',
    subtype: 'tarragower_caroler',
    isChristmas: true,
    customHat: 'hat_winter_earmuffs',
    customAura: 'aura_tarragower_wisdom',
    customEmblem: 'emblem_tarragower',
    shirtStyle: 'shirt_tarragower_blazer',
    color: 'bg-indigo-900',
    description: 'Tarragower School Academy choir singing harmonious holiday hymns with brass horns and four-part harmony!',
  },
  {
    id: 1022,
    name: 'BP Winter Solstice Solar Engineer',
    type: 'minecraft',
    subtype: 'bp_solstice',
    isChristmas: true,
    customHat: 'hat_snow_beanie',
    customAura: 'aura_bp_solaris',
    customEmblem: 'emblem_bp',
    shirtStyle: 'shirt_bp_suit',
    color: 'bg-emerald-600',
    description: 'BP engineer harnessing low-angle winter sunlight with high-efficiency geothermal solar cells to keep the village heated!',
  },
  {
    id: 1023,
    name: 'YouTube Holiday 24/7 Livestreamer',
    type: 'roblox',
    subtype: 'youtube_holiday',
    isChristmas: true,
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#18181b',
    robloxFace: 'winning',
    customHat: 'hat_santa',
    customAura: 'aura_yt_viral',
    customEmblem: 'emblem_youtube',
    shirtStyle: 'shirt_youtube_creator',
    color: 'bg-red-600',
    description: 'Broadcasting the annual 24-Hour Charity Holiday Stream! Dropping gift codes, subscriber snow cannons, and diamond badges!',
  },
  {
    id: 1024,
    name: 'Aeternum Winter Convergence Warrior',
    type: 'minecraft',
    subtype: 'newworld_winter',
    isChristmas: true,
    armorTier: 'netherite',
    heldWeapon: 'diamond_sword',
    customWings: 'back_snow_globe',
    customAura: 'aura_newworld_azoth',
    customEmblem: 'emblem_newworld',
    shirtStyle: 'shirt_newworld_armor',
    color: 'bg-cyan-800',
    description: 'Aeternum knight participating in the sacred Winter Convergence, gathering gleaming Gleamite crystals and battling frost fiends!',
  },
  {
    id: 1025,
    name: 'Kiwi Beach Santa Claus (NZ Summer)',
    type: 'minecraft',
    subtype: 'nz_beach_santa',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_shades',
    customWings: 'back_kiwi',
    customAura: 'aura_silver_fern',
    customEmblem: 'emblem_nz',
    pantsStyle: 'pants_nz_rugby',
    color: 'bg-amber-600',
    description: 'Southern Hemisphere Kiwi Santa celebrating Christmas on the sunny beach with barbecued seafood, sunglasses, and companion kiwi!',
  },
  {
    id: 1026,
    name: 'Mount Cook Frost Yeti',
    type: 'minecraft',
    subtype: 'nz_yeti',
    isChristmas: true,
    customHat: 'hat_winter_earmuffs',
    customAura: 'aura_blizzard',
    customEmblem: 'emblem_snowflake',
    color: 'bg-slate-200',
    description: 'Friendly giant albino yeti from Aoraki Mount Cook peaks, tossing oversized snowball boulders and bringing sub-zero blizzards!',
  },
  {
    id: 1027,
    name: 'Gordon the Polar Express Streamliner',
    type: 'train',
    subtype: 'gordon',
    isChristmas: true,
    customHat: 'hat_santa',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_snowflake',
    color: 'bg-blue-800',
    description: 'The Big Blue Engine pulling the luxury holiday Polar Express at maximum steam speed across frozen rails!',
  },
  {
    id: 1028,
    name: 'James the Red-Nosed Shiny Engine',
    type: 'train',
    subtype: 'james',
    isChristmas: true,
    customHat: 'hat_reindeer_antlers',
    customFace: 'face_frosty_blush',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_christmas_star',
    color: 'bg-red-700',
    description: 'Splendid red engine adorned with glowing antlers and holiday wreaths, puffing cheerful Christmas carols from his whistle!',
  },
  {
    id: 1029,
    name: 'Santa Duck the Great Western Engine',
    type: 'train',
    subtype: 'duck',
    isChristmas: true,
    customHat: 'hat_snow_beanie',
    customAura: 'aura_golden_tinsel',
    customEmblem: 'emblem_gift_box',
    color: 'bg-emerald-800',
    description: 'Proud Great Western engine doing things the Great Western way: delivering heavy crates of toys and gingerbread on time!',
  },
  {
    id: 1030,
    name: 'Santa Lucky Luke',
    type: 'xilam',
    subtype: 'lucky_luke',
    isChristmas: true,
    customHat: 'hat_santa',
    customWings: 'back_santa_sack',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_xilam',
    color: 'bg-yellow-600',
    description: 'The fastest shooter in the West delivering candy faster than his own shadow on Santa\'s horse Jolly Jumper!',
  },
  {
    id: 1031,
    name: 'Snowball Sharko the Lifeguard',
    type: 'xilam',
    subtype: 'sharko',
    isChristmas: true,
    customHat: 'hat_polar_bear_hood',
    customWings: 'back_candy_cane_swords',
    customAura: 'aura_blizzard',
    customEmblem: 'emblem_snowflake',
    color: 'bg-blue-600',
    description: 'Sharko in a fluffy polar hood, sculpting towering ice castles for Marina and tossing harmless snow boulders at Zig!',
  },
  {
    id: 1032,
    name: 'Santa Marina the Mermaid',
    type: 'xilam',
    subtype: 'marina',
    isChristmas: true,
    customHat: 'hat_holly_beret',
    customWings: 'back_snow_globe',
    customAura: 'aura_aurora_borealis',
    customEmblem: 'emblem_candy_cane',
    color: 'bg-cyan-600',
    description: 'Enchanted lagoon mermaid singing shimmering ocean carols with companion dolphins wearing holiday bells!',
  },
  {
    id: 1033,
    name: 'Ziggy Elf Hyena',
    type: 'xilam',
    subtype: 'zig',
    isChristmas: true,
    customHat: 'hat_elf_hat',
    customFace: 'face_elf_ears',
    customWings: 'back_xilam_mallet',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_xilam_paw',
    color: 'bg-amber-700',
    description: 'Mischievous hyena disguised in an elf costume, scheming hilarious slapstick ambushes with wrapped gift box traps!',
  },
  {
    id: 1034,
    name: 'Elf Vineria with Mistletoe Harp',
    type: 'sprnuki',
    subtype: 'vineria',
    isChristmas: true,
    customHat: 'hat_holly_beret',
    customWings: 'back_festive_wreath',
    customAura: 'aura_golden_tinsel',
    customEmblem: 'emblem_christmas_star',
    color: 'bg-emerald-700',
    description: 'Sprunki melody weaver plucking crystalline holiday chords on an evergreen mistletoe harp!',
  },
  {
    id: 1035,
    name: 'Tunner Winter Jazz Saxophonist',
    type: 'sprnuki',
    subtype: 'tunner',
    isChristmas: true,
    customHat: 'hat_winter_earmuffs',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_snowflake',
    color: 'bg-stone-700',
    description: 'Sprunki brass master blowing smooth holiday jazz solos while warm brass notes swirl in the winter breeze!',
  },
  {
    id: 1036,
    name: 'Garnold Golden Holiday Vinyl DJ',
    type: 'sprnuki',
    subtype: 'garnold',
    isChristmas: true,
    customHat: 'hat_tophat',
    customAura: 'aura_christmas_lights',
    customEmblem: 'emblem_gift_box',
    color: 'bg-amber-600',
    description: 'Spinning rare golden Christmas discs and synthwave carols that energize the entire party!',
  },
  {
    id: 1037,
    name: 'Festive Allay with Peppermint Candy',
    type: 'minecraft',
    subtype: 'allay',
    isChristmas: true,
    customHat: 'hat_elf_hat',
    customWings: 'back_candy_cane_swords',
    customAura: 'aura_aurora_borealis',
    customEmblem: 'emblem_candy_cane',
    color: 'bg-cyan-400',
    description: 'Tiny hovering fairy spirit clutching giant striped candy canes, joyfully dancing to winter jukebox tunes!',
  },
  {
    id: 1038,
    name: 'Winter Frost Breeze',
    type: 'minecraft',
    subtype: 'breeze',
    isChristmas: true,
    customHat: 'hat_ice_crown',
    customWings: 'back_icicle_spikes',
    customAura: 'aura_blizzard',
    customEmblem: 'emblem_snowflake',
    color: 'bg-purple-300',
    description: 'Whirling glacial wind elemental firing friendly frosted snowball charges that bounce players into the sky!',
  },
  {
    id: 1039,
    name: 'Christmas Sniffer with Holly Wreath',
    type: 'minecraft',
    subtype: 'sniffer',
    isChristmas: true,
    customHat: 'hat_christmas_tree',
    customWings: 'back_festive_wreath',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_polar_star',
    color: 'bg-red-800',
    description: 'Ancient gentle prehistoric creature sniffing out buried holiday gifts and rare winter Torchflower seeds under deep snowdrifts!',
  },
  {
    id: 1040,
    name: 'Holiday Armadillo with Jingle Bells',
    type: 'minecraft',
    subtype: 'armadillo',
    isChristmas: true,
    customHat: 'hat_winter_earmuffs',
    customFace: 'face_frosty_blush',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_gift_box',
    color: 'bg-amber-700',
    description: 'Cute savanna critter rolling into a shiny wrapped gift ball whenever startled, ringing jingling bells as it rolls!',
  },
  {
    id: 1041,
    name: 'Santa Dominus Rex Bloxian',
    type: 'roblox',
    subtype: 'dominus_santa',
    isChristmas: true,
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#18181b',
    robloxFace: 'epic',
    customHat: 'hat_dominus',
    customWings: 'back_reindeer_sleigh',
    customAura: 'aura_golden_tinsel',
    customEmblem: 'emblem_roblox',
    shirtStyle: 'shirt_santa_suit',
    color: 'bg-red-800',
    description: 'Mythic Bloxian lord wearing the gilded Dominus hood and commanding a fleet of supersonic flying sleighs!',
  },
  {
    id: 1042,
    name: 'Gingerbread Bacon Hair Champion',
    type: 'roblox',
    subtype: 'bacon_gingerbread',
    isChristmas: true,
    robloxHeadColor: '#b45309',
    robloxTorsoColor: '#78350f',
    robloxLegsColor: '#451a03',
    robloxFace: 'winning',
    customHat: 'hat_gingerbread_chef',
    customWings: 'back_gingerbread_shield',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_gingerbread_man',
    shirtStyle: 'shirt_gingerbread_frosting',
    pantsStyle: 'pants_gingerbread_boots',
    color: 'bg-amber-800',
    description: 'The legendary Bloxian Pal transformed into a sweet spiced cookie warrior coated with royal icing armor!',
  },
  {
    id: 1043,
    name: 'Winter Valkyrie Sovereign',
    type: 'roblox',
    subtype: 'valkyrie_winter',
    isChristmas: true,
    robloxHeadColor: '#f5d0a9',
    robloxTorsoColor: '#0284c7',
    robloxLegsColor: '#0f172a',
    robloxFace: 'chill',
    customHat: 'hat_ice_crown',
    customWings: 'back_icicle_spikes',
    customAura: 'aura_aurora_borealis',
    customEmblem: 'emblem_polar_star',
    color: 'bg-sky-700',
    description: 'Celestial Bloxian warrior wielding frosted Valkyrie wings and channeling northern light aurora blasts!',
  },
  {
    id: 1044,
    name: 'Germanyball Lebkuchen Baker',
    type: 'countryball',
    subtype: 'germany_christmas',
    isChristmas: true,
    customHat: 'hat_gingerbread_chef',
    customFace: 'face_peppermint_monocle',
    customWings: 'back_gingerbread_shield',
    customAura: 'aura_jingle_bells',
    customEmblem: 'emblem_gingerbread_man',
    flag: 'de',
    color: 'bg-neutral-900',
    description: 'Master holiday pastry chef baking authentic Nuremberg gingerbread, stollen, and spiced festive cookies!',
  },
  {
    id: 1045,
    name: 'Swedenball Santa Lucia',
    type: 'countryball',
    subtype: 'sweden_christmas',
    isChristmas: true,
    customHat: 'hat_christmas_tree',
    customFace: 'face_frosty_blush',
    customAura: 'aura_golden_tinsel',
    customEmblem: 'emblem_polar_star',
    flag: 'se',
    color: 'bg-blue-600',
    description: 'Bearing the radiant crown of holiday lights, singing peaceful winter hymns and bringing saffron buns to morning sleepers!',
  },
  {
    id: 1046,
    name: 'Canadaball Maple Snow Candy',
    type: 'countryball',
    subtype: 'canada_christmas',
    isChristmas: true,
    customHat: 'hat_snow_beanie',
    customWings: 'back_candy_cane_swords',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_snowflake',
    flag: 'ca',
    color: 'bg-red-600',
    description: 'Rolling hot pure maple taffy onto fresh pristine snowdrifts and serving sweet candy sticks to everyone!',
  },
  {
    id: 1047,
    name: 'BP Arctic Solar Snowplow Engineer',
    type: 'minecraft',
    subtype: 'bp_snowplow',
    isChristmas: true,
    customHat: 'hat_bp_solar_snowcap',
    customFace: 'face_bp_energy_visor',
    customWings: 'back_bp_solar_panel',
    customAura: 'aura_bp_photon_wave',
    customEmblem: 'emblem_bp_sunburst',
    shirtStyle: 'shirt_bp_arctic_hazmat',
    pantsStyle: 'pants_bp_arctic',
    color: 'bg-emerald-600',
    description: 'BP high-tech eco engineer operating solar-powered thermal snowplows to keep inter-realm railway tracks de-iced!',
  },
  {
    id: 1048,
    name: 'Tarragower Winter Brass Bugler',
    type: 'minecraft',
    subtype: 'tarragower_brass',
    isChristmas: true,
    customHat: 'hat_tarragower_mortarboard',
    customFace: 'face_frost_spectacles',
    customWings: 'back_tarragower_scroll',
    customAura: 'aura_tarragower_runes',
    customEmblem: 'emblem_tarragower_shield',
    shirtStyle: 'shirt_tarragower_winter_cape',
    pantsStyle: 'pants_tarragower_winter',
    color: 'bg-indigo-900',
    description: 'Tarragower School honors student sounding resonant brass trumpet fanfares for the annual winter convocation!',
  },
  {
    id: 1049,
    name: 'Santa Warden of Deep Chill',
    type: 'minecraft',
    subtype: 'warden',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customAura: 'aura_snowfall',
    customEmblem: 'emblem_snowflake',
    color: 'bg-cyan-900',
    description: 'Benevolent subterranean frost titan wearing giant fluffy ear muffs and delivering deep-cavern Christmas geodes!',
  },
  {
    id: 1050,
    name: 'Festive Light Creeper',
    type: 'minecraft',
    subtype: 'creeper',
    isChristmas: true,
    customHat: 'hat_holly_beret',
    customAura: 'aura_golden_tinsel',
    customEmblem: 'emblem_polar_star',
    color: 'bg-emerald-600',
    description: 'Holiday creeper wrapped in 100 multicolour twinkle lights that explodes into holiday confetti and candy corn!',
  },
  {
    id: 1051,
    name: 'Twinkle Light Iron Golem',
    type: 'minecraft',
    subtype: 'iron_golem',
    isChristmas: true,
    customHat: 'hat_santa',
    customWings: 'back_candy_cane_swords',
    customAura: 'aura_aurora_borealis',
    color: 'bg-stone-300',
    description: 'Giant metal village protector offering fresh Christmas poinsettias and candy canes to passing players!',
  },
  {
    id: 1052,
    name: 'Holiday Elf Villager Trader',
    type: 'minecraft',
    subtype: 'villager',
    isChristmas: true,
    christmasCostume: 'elf',
    customHat: 'hat_elf',
    shirtStyle: 'shirt_elf_tunic',
    pantsStyle: 'pants_elf_tights',
    color: 'bg-emerald-700',
    description: 'Master toy builder in Santa\'s North Pole workshop exchanging emeralds for rare holiday gift boxes!',
  },
  {
    id: 1053,
    name: 'Gingerbread Steve',
    type: 'minecraft',
    subtype: 'steve',
    isChristmas: true,
    christmasCostume: 'gingerbread',
    customHat: 'hat_gingerbread_chef',
    customWings: 'back_candy_cane_swords',
    shirtStyle: 'shirt_gingerbread_frosting',
    pantsStyle: 'pants_gingerbread_boots',
    color: 'bg-amber-800',
    description: 'Crisp oven-baked gingerbread hero glazed with vanilla royal icing and gumdrop buttons!',
  },
  {
    id: 1054,
    name: 'Frost Archer Skeleton',
    type: 'minecraft',
    subtype: 'skeleton',
    isChristmas: true,
    customHat: 'hat_ice_crown',
    customFace: 'face_frost_spectacles',
    customAura: 'aura_frost',
    color: 'bg-slate-300',
    description: 'Sub-zero glacier archer firing sparkling icicle arrows that trail stardust and snow powder!',
  },
  {
    id: 1055,
    name: 'Reindeer Mooshroom',
    type: 'minecraft',
    subtype: 'mooshroom',
    isChristmas: true,
    christmasCostume: 'reindeer',
    customHat: 'hat_reindeer_antlers',
    customFace: 'face_rudolph_nose',
    customWings: 'back_reindeer_sleigh',
    color: 'bg-red-800',
    description: 'Magical North Pole bovine sprouting Christmas mistletoe and holiday holly instead of fungi!',
  },
  {
    id: 1056,
    name: 'Candy Cane Piglin',
    type: 'minecraft',
    subtype: 'piglin',
    isChristmas: true,
    heldWeapon: 'candy_cane_blade',
    customHat: 'hat_santa',
    color: 'bg-rose-400',
    description: 'Festive Nether trader who swaps shimmering gold nuggets for striped peppermint candy cane blades!',
  },
  {
    id: 1057,
    name: 'Flying Scotsman Polar Express',
    type: 'train',
    isChristmas: true,
    color: 'bg-emerald-700',
    description: 'The legendary steam express engine outfitted with festive gold headlamps and holiday passenger coaches!',
  },
  {
    id: 1058,
    name: 'Percy Christmas Mail Carrier',
    type: 'train',
    isChristmas: true,
    color: 'bg-emerald-500',
    description: 'Sodor\'s #6 saddle tank engine steaming through blizzards to deliver letters to Santa Claus!',
  },
  {
    id: 1059,
    name: 'Toby Winter Holly Tram',
    type: 'train',
    isChristmas: true,
    color: 'bg-amber-800',
    description: 'The quaint square steam tram adorned with a giant spruce wreath and glowing brass holiday lanterns!',
  },
  {
    id: 1060,
    name: 'Diesel 10 with Santa Hat & Pinchy',
    type: 'train',
    isChristmas: true,
    color: 'bg-amber-600',
    description: 'Diesel 10 getting into the Christmas spirit by using Pinchy to place the giant star on the Sodor tree!',
  },
  {
    id: 1061,
    name: 'Santa Noob with Gingerbread Hoodie',
    type: 'roblox',
    subtype: 'noob',
    isChristmas: true,
    christmasCostume: 'gingerbread',
    customHat: 'hat_santa',
    shirtStyle: 'shirt_gingerbread_frosting',
    color: 'bg-yellow-400',
    description: 'Festive Robloxian noob wearing a cozy gingerbread hoodie and passing out festive gingerbread slices!',
  },
  {
    id: 1062,
    name: 'Frost Korblox Ice Sovereign',
    type: 'roblox',
    subtype: 'korblox',
    isChristmas: true,
    customHat: 'hat_ice_crown',
    customAura: 'aura_frost',
    color: 'bg-sky-950',
    description: 'The Winter King of Korblox wielding a staff of glacier ice and commanding frozen winter blizzards!',
  },
  {
    id: 1063,
    name: 'Winter Snowboarder Robloxian',
    type: 'roblox',
    subtype: 'robloxian',
    isChristmas: true,
    customFace: 'face_frost_spectacles',
    shirtStyle: 'shirt_polar_parka',
    pantsStyle: 'pants_polar_ski',
    color: 'bg-cyan-500',
    description: 'Extreme sports avatar shredding double-black-diamond powder slopes on the Cloud Spire!',
  },
  {
    id: 1064,
    name: 'Peppermint Dominus Overlord',
    type: 'roblox',
    subtype: 'dominus',
    isChristmas: true,
    customAura: 'aura_golden_tinsel',
    customEmblem: 'emblem_polar_star',
    color: 'bg-red-800',
    description: 'Ultra-rare holiday Dominus hood woven with red and white peppermint candy silk and golden wings!',
  },
  {
    id: 1065,
    name: 'Finlandball Official Santa Claus',
    type: 'countryball',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customFace: 'face_santa_beard',
    customWings: 'back_santa_sack',
    color: 'bg-blue-600',
    description: 'The true home of Joulupukki (Santa Claus) residing in Korvatunturi, Lapland surrounded by reindeer!',
  },
  {
    id: 1066,
    name: 'Norwayball Olympic Ski Star',
    type: 'countryball',
    isChristmas: true,
    customHat: 'hat_holly_beret',
    customFace: 'face_frost_spectacles',
    color: 'bg-red-600',
    description: 'Nordic ski master racing across pristine fjord snowbanks with golden holiday medals!',
  },
  {
    id: 1067,
    name: 'Icelandball Yule Lad Gifter',
    type: 'countryball',
    isChristmas: true,
    customHat: 'hat_elf',
    customEmblem: 'emblem_snowflake',
    color: 'bg-blue-700',
    description: 'Representing the 13 mischievous Icelandic Yule Lads bringing gifts and holiday merriment!',
  },
  {
    id: 1068,
    name: 'Switzerlandball Winter Fondue Chalet',
    type: 'countryball',
    isChristmas: true,
    customFace: 'face_peppermint_monocle',
    color: 'bg-red-600',
    description: 'Alpine chalet host serving bubbling melted Gruyère cheese fondue and Swiss holiday chocolate!',
  },
  {
    id: 1069,
    name: 'Australiaball Summer Christmas Beachgoer',
    type: 'countryball',
    isChristmas: true,
    customHat: 'hat_santa',
    customFace: 'face_frost_spectacles',
    color: 'bg-amber-600',
    description: 'Celebrating southern hemisphere Christmas with beach cricket, prawns on the barbecue, and surfing in a Santa hat!',
  },
  {
    id: 1070,
    name: 'Santa Oren Festive Beatbox King',
    type: 'sprnuki',
    subtype: 'oren',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    color: 'bg-amber-500',
    description: 'Lead Sprunki vocalist dropping heavy hip-hop Christmas basslines and festive jingle beat drops!',
  },
  {
    id: 1071,
    name: 'Mistletoe Clukr Beatmaker',
    type: 'sprnuki',
    subtype: 'clukr',
    isChristmas: true,
    customHat: 'hat_holly_beret',
    color: 'bg-cyan-500',
    description: 'Energetic robotic Sprunki laying down metallic holiday hi-hats and syncopated snare grooves!',
  },
  {
    id: 1072,
    name: 'Jingle Bells Garnold Golden DJ',
    type: 'sprnuki',
    subtype: 'garnold',
    isChristmas: true,
    customAura: 'aura_golden_tinsel',
    color: 'bg-yellow-500',
    description: 'Master turntable maestro spinning 128 BPM electronic Christmas dance tracks with golden vinyl!',
  },
  {
    id: 1073,
    name: 'Winter Frost Durple Flute',
    type: 'sprnuki',
    subtype: 'durple',
    isChristmas: true,
    customHat: 'hat_polar_bear_hood',
    color: 'bg-purple-600',
    description: 'Ethereal purple Sprunki producing crystal-clear pan flute melodies echoing across snowy tundras!',
  },
  {
    id: 1074,
    name: 'Santa Oggy Holiday Gift Deliverer',
    type: 'xilam',
    subtype: 'oggy',
    isChristmas: true,
    christmasCostume: 'santa',
    customHat: 'hat_santa',
    customWings: 'back_santa_sack',
    color: 'bg-blue-500',
    description: 'Oggy playing Santa Claus to deliver toys to all the neighborhood kittens while dodging holiday pranks!',
  },
  {
    id: 1075,
    name: 'Christmas Cockroaches Caroling Trio',
    type: 'xilam',
    subtype: 'joey',
    isChristmas: true,
    customHat: 'hat_elf',
    color: 'bg-pink-600',
    description: 'Joey, Dee Dee, and Marky forming a hilarious miniature choir singing off-key Christmas carols!',
  },
  {
    id: 1076,
    name: 'Winter Scarf Sharko Surf Patrol',
    type: 'xilam',
    subtype: 'sharko',
    isChristmas: true,
    customFace: 'face_frost_spectacles',
    shirtStyle: 'shirt_nutcracker_jacket',
    color: 'bg-slate-600',
    description: 'Heroic shark lifeguard wearing a warm knitted red scarf while guarding the icy coastal waters!',
  },
  {
    id: 1077,
    name: 'McDonald\'s Holiday Ronald with Mega Feasts',
    type: 'custom',
    classArchetype: 'mcdonalds_crew',
    isChristmas: true,
    customHat: 'hat_santa',
    shirtStyle: 'shirt_mcdonalds_holiday',
    color: 'bg-red-600',
    description: 'Chief happiness officer delivering festive red-and-gold holiday feast boxes and cosmic shakes to all!',
  },
  {
    id: 1078,
    name: 'BP Solar Arctic Snowblower Technician',
    type: 'custom',
    classArchetype: 'bp_engineer',
    isChristmas: true,
    customHat: 'hat_bp_solar_snowcap',
    customFace: 'face_bp_energy_visor',
    customWings: 'back_bp_solar_panel',
    shirtStyle: 'shirt_bp_arctic_hazmat',
    color: 'bg-emerald-600',
    description: 'Operating high-efficiency solar-thermal snowmelters to clear clean transit paths through the North Pole!',
  },
  {
    id: 1079,
    name: 'YouTube 50M Ruby Creator Santa',
    type: 'custom',
    classArchetype: 'youtube_streamer',
    isChristmas: true,
    customHat: 'hat_santa',
    customFace: 'face_yt_streamer_mic',
    customWings: 'back_yt_play_shield',
    color: 'bg-rose-600',
    description: 'Superstar creator hosting the record-breaking 24-hour Holiday Charity Livestream with ruby play buttons!',
  },
  {
    id: 1080,
    name: 'New World Winter Convergence Gleamite Champion',
    type: 'custom',
    classArchetype: 'newworld_conqueror',
    isChristmas: true,
    customHat: 'hat_ice_crown',
    customWings: 'back_newworld_warhammer',
    shirtStyle: 'shirt_newworld_gleamite',
    pantsStyle: 'pants_newworld_greaves',
    color: 'bg-sky-800',
    description: 'Master Aeternum warrior clad in shimmering Gleamite comet plate mail defending the Convergence Tree!',
  },
  // ================= 40+ EXPANDED CHARACTERS: MULTIVERSE UNIFIED ROSTER =================
  // MINECRAFT EXTENDED HEROES & MOBS
  {
    id: 1081,
    name: 'Copper Golem (Lightning Rod)',
    type: 'minecraft',
    subtype: 'copper_golem',
    heldWeapon: 'pickaxe',
    color: 'bg-amber-700',
    description: 'Autonomous oxidizable little automaton with an overhead copper lightning rod. Loves pressing copper buttons!',
  },
  {
    id: 1082,
    name: 'Allay Music Harvester',
    type: 'minecraft',
    subtype: 'allay',
    color: 'bg-cyan-400',
    musicalNote: 'Note: E4 Celestial Chime',
    description: 'Gentle flying spirit that collects items and delivers them to sounding note blocks. Dances to jukeboxes!',
  },
  {
    id: 1083,
    name: 'Ancient Sniffer Archeologist',
    type: 'minecraft',
    subtype: 'sniffer',
    color: 'bg-emerald-900',
    description: 'Gentle prehistoric giant with an acute sense of smell, sniffing out ancient torchflower and pitcher seeds.',
  },
  {
    id: 1084,
    name: 'Armadillo Savanna Scout',
    type: 'minecraft',
    subtype: 'armadillo',
    color: 'bg-amber-600',
    description: 'Curious savanna forager that rolls into a defensive armored ball when startled. Drops scutes for wolf armor!',
  },
  {
    id: 1085,
    name: 'Trial Chamber Breeze',
    type: 'minecraft',
    subtype: 'breeze',
    color: 'bg-purple-400',
    description: 'Whirling vortex elemental from underground trial chambers that shoots devastating explosive wind charges.',
  },
  {
    id: 1086,
    name: 'Deep Ocean Glow Squid',
    type: 'minecraft',
    subtype: 'glow_squid',
    color: 'bg-teal-400',
    description: 'Bioluminescent aquatic marvel gliding silently through underwater ravines, illuminating dark sea floors.',
  },
  {
    id: 1087,
    name: 'Mooshroom Island Guardian',
    type: 'minecraft',
    subtype: 'mooshroom',
    color: 'bg-red-700',
    description: 'Spiritual bovine native to rare mycelium islands with red fly agaric mushrooms growing on its back.',
  },
  {
    id: 1088,
    name: 'Nether Bastion Piglin Brute',
    type: 'minecraft',
    subtype: 'piglin_brute',
    heldWeapon: 'golden_axe',
    color: 'bg-orange-800',
    description: 'Elite unbribable guardian of nether bastions wielding a heavy golden battle axe. Defends treasure chests!',
  },
  {
    id: 1089,
    name: 'Mangrove Swamp Frog',
    type: 'minecraft',
    subtype: 'frog',
    color: 'bg-lime-700',
    description: 'High-jumping amphibian leaping from lily pad to mangrove root, creating luminous pearlescent froglights.',
  },
  {
    id: 1090,
    name: 'Wandering Trader & Llama Master',
    type: 'minecraft',
    subtype: 'wandering_trader',
    color: 'bg-blue-800',
    description: 'Interdimensional merchant traveling with two decorative leaded llamas, bartering exotic coral and saplings.',
  },

  // ROBLOX ICONS & LEGENDS
  {
    id: 1091,
    name: 'Telamon (Builderman Legend)',
    type: 'roblox',
    subtype: 'telamon',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#e2231a',
    robloxLegsColor: '#1e293b',
    robloxFace: 'epic',
    robloxHat: 'hardhat',
    robloxGear: 'sword',
    color: 'bg-red-600',
    description: 'The mythic co-founding builder of Crossroads, wielding the legendary flaming sword and building stamp hammer.',
  },
  {
    id: 1092,
    name: 'Shedletsky (Fried Chicken Knight)',
    type: 'roblox',
    subtype: 'shedletsky',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#0284c7',
    robloxLegsColor: '#16a34a',
    robloxFace: 'beast',
    robloxHat: 'valkyrie',
    robloxGear: 'sword',
    color: 'bg-sky-600',
    description: 'Beloved Roblox developer famous for the Linked Sword, fried chicken powerups, and Telamon mystery lore.',
  },
  {
    id: 1093,
    name: 'Erik Cassel Tribute Guardian',
    type: 'roblox',
    subtype: 'erik_cassel',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#1e293b',
    robloxLegsColor: '#334155',
    robloxFace: 'chill',
    robloxHat: 'beanie',
    robloxGear: 'none',
    color: 'bg-slate-700',
    description: 'Eternal co-founder of the Roblox platform. A beloved innovator whose spirit watches over all builders.',
  },
  {
    id: 1094,
    name: 'Crown King Noob (God of Crossroads)',
    type: 'roblox',
    subtype: 'king_noob',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#0055ff',
    robloxLegsColor: '#16a34a',
    robloxFace: 'winning',
    robloxHat: 'dominus',
    robloxGear: 'speed_coil',
    color: 'bg-amber-400',
    description: 'The ancient 2006 yellow/blue/green noob crowned with imperial gold regalia and dual hyper-coils!',
  },
  {
    id: 1095,
    name: 'Korblox Deathspeaker Sovereign',
    type: 'roblox',
    subtype: 'korblox',
    robloxHeadColor: '#38bdf8',
    robloxTorsoColor: '#0f172a',
    robloxLegsColor: '#0284c7',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    color: 'bg-cyan-900',
    description: 'Commander of the freezing undead Korblox Legion. Glides on floating icy energy with spectral frost eyes.',
  },
  {
    id: 1096,
    name: 'Bacon Girl (Pal Hair Obbyist)',
    type: 'roblox',
    subtype: 'bacon_girl',
    robloxHeadColor: '#fed7aa',
    robloxTorsoColor: '#ec4899',
    robloxLegsColor: '#3b82f6',
    robloxFace: 'happy',
    robloxHat: 'bacon',
    robloxGear: 'coil',
    color: 'bg-pink-500',
    description: 'The energetic counterpart to Bacon Hair! World-class Tower of Hell obby jumper and badge collector.',
  },
  {
    id: 1097,
    name: 'Redcliff Knight Commander',
    type: 'roblox',
    subtype: 'redcliff_knight',
    robloxHeadColor: '#e2e8f0',
    robloxTorsoColor: '#dc2626',
    robloxLegsColor: '#991b1b',
    robloxFace: 'smile',
    robloxHat: 'valkyrie',
    robloxGear: 'sword',
    color: 'bg-red-700',
    description: 'Champion of the Order of the Redcliff. Sworn defenders of the Crossroads against the Darkage Korblox hordes.',
  },
  {
    id: 1098,
    name: 'Overseer Eye of the Void',
    type: 'roblox',
    subtype: 'overseer',
    robloxHeadColor: '#10b981',
    robloxTorsoColor: '#064e3b',
    robloxLegsColor: '#022c22',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'subspace',
    color: 'bg-emerald-950',
    description: 'Ancient mysterious all-seeing eye of the emerald void. Deploys deadly Subspace Tripmines with telekinesis.',
  },

  // XILAM ANIMATIONS SLAPSTICK CAST
  {
    id: 1100,
    name: 'Dee Dee (The Gourmet Cockroach)',
    type: 'xilam',
    subtype: 'dee_dee',
    color: 'bg-amber-500',
    description: 'The ever-hungry, chubby blue-eyed cockroach from Oggy and the Cockroaches with an insatiable appetite for fridge raids.',
  },
  {
    id: 1101,
    name: 'Marky (The Long Cockroach)',
    type: 'xilam',
    subtype: 'marky',
    color: 'bg-emerald-500',
    description: 'The tall, sophisticated cockroach with pink eyes who loves serenading puppets, reading poetry, and sabotaging Oggy.',
  },
  {
    id: 1102,
    name: 'Joey (The Leader Cockroach)',
    type: 'xilam',
    subtype: 'joey',
    color: 'bg-purple-600',
    description: 'The fiery, mastermind leader of the cockroach trio with mismatching red and yellow eyes. Always plots giant slapstick traps!',
  },
  {
    id: 1103,
    name: 'Jack the Dog (Bulldog Mechanic)',
    type: 'xilam',
    subtype: 'jack',
    color: 'bg-stone-700',
    description: 'Oggy\'s hot-tempered monster-truck-loving cousin. Builds absurd mechanical inventions to counter cockroach pranks.',
  },
  {
    id: 1104,
    name: 'Bob the Neighbor Bulldog',
    type: 'xilam',
    subtype: 'bob',
    color: 'bg-amber-800',
    description: 'Oggy\'s towering, muscular neighbor who just wants to prune his prize bonsai trees without flying bowling balls hitting him.',
  },
  {
    id: 1105,
    name: 'Etno Polino (Space Goofs Alien)',
    type: 'xilam',
    subtype: 'etno',
    color: 'bg-purple-800',
    description: 'The brilliant purple four-eyed alien scientist from Space Goofs. Desperately repairing his saucer to escape Earth!',
  },
  {
    id: 1106,
    name: 'Bud Budiovitch (Lazy Space Goof)',
    type: 'xilam',
    subtype: 'bud',
    color: 'bg-orange-500',
    description: 'Tall, skinny orange alien whose favorite hobbies include watching terrestrial television sitcoms and drinking sodas.',
  },
  {
    id: 1107,
    name: 'Gorgious Klatoo (Hungry Alien)',
    type: 'xilam',
    subtype: 'gorgious',
    color: 'bg-blue-600',
    description: 'The blue, short-tempered gluttonous alien chef from Space Goofs who turns earthly delicacies into alien banquets.',
  },

  // COUNTRYBALLS MULTIVERSE EXPANSION
  {
    id: 1108,
    name: 'Argentina-ball (Sun of May Maestro)',
    type: 'countryball',
    subtype: 'argentina',
    flag: '🇦🇷',
    color: 'bg-sky-400',
    description: 'World Cup soccer maestro and tango poet crowned with the golden smiling Sun of May. Master of impossible goals!',
  },
  {
    id: 1109,
    name: 'South Korea-ball (K-Pop Tech Giant)',
    type: 'countryball',
    subtype: 'south_korea',
    flag: '🇰🇷',
    color: 'bg-rose-500',
    description: 'High-speed broadband gaming titan with glowing cyber headphones, kimchi powerups, and synchronized K-Pop dance emotes.',
  },
  {
    id: 1110,
    name: 'India-ball (Chakra Space Pioneer)',
    type: 'countryball',
    subtype: 'india',
    flag: '🇮🇳',
    color: 'bg-orange-500',
    description: 'Cosmic aerospace innovator flying the Chandrayaan moon lander with the 24-spoke Ashoka Chakra radiating peace.',
  },
  {
    id: 1111,
    name: 'Mexico-ball (Luchador Champion)',
    type: 'countryball',
    subtype: 'mexico',
    flag: '🇲🇽',
    color: 'bg-emerald-600',
    description: 'Masked high-flying wrestling hero crowned with a festive sombrero, delicious spicy street tacos, and mariachi guitars.',
  },
  {
    id: 1112,
    name: 'Egypt-ball (Pyramid Pharaoh)',
    type: 'countryball',
    subtype: 'egypt',
    flag: '🇪🇬',
    color: 'bg-yellow-600',
    description: 'Keeper of the ancient Nile hieroglyphics and desert pyramids, wearing the Golden Nemes pharaoh headpiece.',
  },
  {
    id: 1113,
    name: 'Greece-ball (Olympian Philosopher)',
    type: 'countryball',
    subtype: 'greece',
    flag: '🇬🇷',
    color: 'bg-blue-500',
    description: 'Father of democracy and philosophy, crowned with silver olive laurel wreaths and wielding Euclidean geometry rulers.',
  },
  {
    id: 1114,
    name: 'Ireland-ball (Emerald Clover Bard)',
    type: 'countryball',
    subtype: 'ireland',
    flag: '🇮🇪',
    color: 'bg-green-600',
    description: 'Jolly storyteller with a lucky four-leaf clover leprechaun hat, Celtic folk harp, and a pot of gold at the rainbow\'s end.',
  },
  {
    id: 1115,
    name: 'Netherlands-ball (Windmill Tulip Duke)',
    type: 'countryball',
    subtype: 'netherlands',
    flag: '🇳🇱',
    color: 'bg-orange-600',
    description: 'Master of water dykes, glowing orange bicycles, wooden clogs, and endless kaleidoscopic tulip fields.',
  },
  {
    id: 1116,
    name: 'Switzerland-ball (Neutral Fortress Banker)',
    type: 'countryball',
    subtype: 'switzerland',
    flag: '🇨🇭',
    color: 'bg-red-600',
    description: 'Mountain fortress banker armed with a multi-blade Swiss army knife, pocket watch, and mountain fondue cheese.',
  },
  {
    id: 1117,
    name: 'Jamaica-ball (Reggae Rhythm King)',
    type: 'countryball',
    subtype: 'jamaica',
    flag: '🇯🇲',
    color: 'bg-emerald-500',
    description: 'Peaceful tropical icon with rastacap colors, steel drums, 100-meter gold medals, and positive island vibrations.',
  },

  // NZ & TARRAGOWER SCHOOL & INTEGRATED BRANDS
  {
    id: 1118,
    name: 'Headmaster Alistair (Tarragower School)',
    type: 'custom',
    classArchetype: 'tarragower_scholar',
    customHat: 'hat_tarragower_mortarboard',
    customFace: 'face_tarragower_magnifier',
    shirtStyle: 'shirt_tarragower_uniform',
    pantsStyle: 'pants_tarragower_slacks',
    color: 'bg-indigo-900',
    description: 'Esteemed principal of Tarragower School, inspiring pupils in redstone physics, astronomy, and cross-realm ethics.',
  },
  {
    id: 1119,
    name: 'Maya Redstone Prefect (Tarragower School)',
    type: 'custom',
    classArchetype: 'tarragower_scholar',
    customHat: 'hat_goggles',
    shirtStyle: 'shirt_tarragower_uniform',
    pantsStyle: 'pants_tarragower_slacks',
    color: 'bg-rose-800',
    description: 'Tarragower top science student capable of designing automated flying redstone machines and arithmetic logic units.',
  },
  {
    id: 1120,
    name: 'Liam STEAM Captain (Tarragower School)',
    type: 'custom',
    classArchetype: 'tarragower_scholar',
    shirtStyle: 'shirt_tarragower_uniform',
    pantsStyle: 'pants_tarragower_slacks',
    color: 'bg-sky-800',
    description: 'Robotics captain at Tarragower, programming block-sorting sorting networks and wireless command consoles.',
  },
  {
    id: 1121,
    name: 'Aroha Botany Scholar (Tarragower & NZ)',
    type: 'custom',
    classArchetype: 'nz_wayfinder',
    customHat: 'hat_kowhai',
    customFace: 'face_pounamu',
    color: 'bg-emerald-800',
    description: 'New Zealand exchange scholar cultivating indigenous silver ferns, kowhai blossoms, and medicinal harakeke.',
  },
  {
    id: 1122,
    name: 'Kiwi Moa Forest Ranger (Aotearoa NZ)',
    type: 'custom',
    classArchetype: 'nz_wayfinder',
    customHat: 'hat_silver_fern',
    customFace: 'face_ta_moko',
    customWings: 'back_nz_pateke_wings',
    color: 'bg-teal-900',
    description: 'Guardian of Waitangi\'s ancient kauri forests and rare giant moa birds, carrying sacred greenstone nephrite.',
  },
  {
    id: 1123,
    name: 'Grimace (The Purple Shake Giant)',
    type: 'custom',
    classArchetype: 'mcdonalds_chef',
    color: 'bg-purple-700',
    description: 'The legendary lovable purple giant from McDonaldland who brings pure joy, berry shakes, and friendship to everyone.',
  },
  {
    id: 1124,
    name: 'Hamburglar (Master Burger Heist)',
    type: 'custom',
    classArchetype: 'mcdonalds_chef',
    customFace: 'face_shades',
    shirtStyle: 'shirt_striped_thief',
    pantsStyle: 'pants_black_heist',
    color: 'bg-neutral-800',
    description: 'The mischievous burger enthusiast with his striped coat and fedora! "Robble Robble!" is heard across the overworld.',
  },
  {
    id: 1125,
    name: 'Birdie Early Bird (Breakfast Aviator)',
    type: 'custom',
    classArchetype: 'mcdonalds_chef',
    customHat: 'hat_viking',
    color: 'bg-amber-500',
    description: 'The chirpy breakfast pilot delivering fresh hotcakes and crispy hash browns at the crack of sunrise across biomes.',
  },
  {
    id: 1126,
    name: 'Mayor McCheese (Golden Bun Statesman)',
    type: 'custom',
    classArchetype: 'mcdonalds_chef',
    customHat: 'hat_tophat',
    color: 'bg-yellow-700',
    description: 'The distinguished Cheeseburger Mayor of McDonaldland, sporting his mayoral sash and upholding high culinary standards.',
  },
  {
    id: 1127,
    name: 'Fry Kid (Pom-Pom Golden Crispy)',
    type: 'custom',
    classArchetype: 'mcdonalds_chef',
    color: 'bg-red-600',
    description: 'Shaggy, bouncing ball of laughter obsessed with stealing crunchy French Fries from picnic tables across the realm.',
  },
  {
    id: 1128,
    name: 'Helios Solar Vanguard (BP Energy)',
    type: 'custom',
    classArchetype: 'bp_engineer',
    customHat: 'hat_bp_solar_snowcap',
    customFace: 'face_bp_energy_visor',
    customAura: 'aura_bp_solar',
    color: 'bg-emerald-600',
    description: 'Next-generation clean energy pioneer deploying solar micro-grids and charging stations across dark caverns.',
  },
  {
    id: 1129,
    name: 'Chloe Wind Turbine Tech (BP Clean Power)',
    type: 'custom',
    classArchetype: 'bp_engineer',
    customWings: 'back_bp_jetpack',
    color: 'bg-teal-600',
    description: 'High-altitude aerodynamic engineer climbing mega wind towers to harvest howling gale-force winds into clean electricity.',
  },
  {
    id: 1130,
    name: 'Max EV Grid Overcharger (BP Pulse)',
    type: 'custom',
    classArchetype: 'bp_engineer',
    customAura: 'aura_bp_solar',
    color: 'bg-lime-600',
    description: 'Electric mobility specialist upgrading server minecarts and vehicles with ultra-fast kinetic regenerative batteries.',
  },
  {
    id: 1131,
    name: 'Valkyrie Streamer (100M YouTube Hype)',
    type: 'custom',
    classArchetype: 'youtube_streamer',
    customHat: 'hat_yt_streamer_headset',
    customFace: 'face_yt_streamer_mic',
    customWings: 'back_yt_play_shield',
    color: 'bg-red-600',
    description: 'Top-charting YouTube live streamer rallying 100,000 players on voice chat to take down server bosses in real time.',
  },
  {
    id: 1132,
    name: 'Kai Speedrun Champion (YouTube World Record)',
    type: 'custom',
    classArchetype: 'youtube_streamer',
    customFace: 'face_shades',
    color: 'bg-rose-700',
    description: 'Precision gaming streamer holding the sub-12 minute Minecraft speedrun and sub-40 second Roblox obby records.',
  },
  {
    id: 1133,
    name: 'Lex Tech Reviewer (YouTube Studio 8K)',
    type: 'custom',
    classArchetype: 'youtube_streamer',
    customHat: 'hat_goggles',
    color: 'bg-slate-800',
    description: 'Tech teardown creator reviewing quantum redstone hardware and high-refresh holographic visor setups.',
  },
  {
    id: 1134,
    name: 'Void Gauntlet Occultist (New World)',
    type: 'custom',
    classArchetype: 'newworld_conqueror',
    customHat: 'hat_halo',
    customAura: 'aura_verity_starlight',
    color: 'bg-indigo-950',
    description: 'Wielder of forbidden Aeternum void magic, draining enemy vitality to heal companions and tear dimensional rifts.',
  },
  {
    id: 1135,
    name: 'War Hammer Juggernaut (New World Marauder)',
    type: 'custom',
    classArchetype: 'newworld_conqueror',
    customWings: 'back_newworld_warhammer',
    shirtStyle: 'shirt_armor',
    color: 'bg-amber-900',
    description: 'Frontline heavy siege specialist wielding a massive stone warhammer that crushes castle barricades and ground-pounds foes.',
  },
  {
    id: 1136,
    name: 'Life Staff Cleric (New World Covenant)',
    type: 'custom',
    classArchetype: 'newworld_conqueror',
    customHat: 'hat_ice_crown',
    customAura: 'aura_verity_starlight',
    color: 'bg-amber-200',
    description: 'Devout healer projecting glowing circles of protection and beacon spells to sustain raid parties against titans.',
  },
  {
    id: 1137,
    name: 'Musket Sharpshooter (New World Syndicate)',
    type: 'custom',
    classArchetype: 'newworld_conqueror',
    customHat: 'hat_viking',
    color: 'bg-purple-900',
    description: 'Deadeye marksman perched on watchtowers firing precision powder rounds that stop charging monsters in their tracks.',
  },
  {
    id: 1138,
    name: 'Toby the Tram Engine (Sodor Vintage)',
    type: 'train',
    subtype: 'toby',
    color: 'bg-amber-700',
    description: 'Wise, friendly square brown tram engine with cowcatchers and sideplates, working the Ffarquhar quarry line safely.',
  },
  {
    id: 1139,
    name: 'Diesel 10 (Claw Sodor Rebel)',
    type: 'train',
    subtype: 'diesel10',
    color: 'bg-amber-600',
    description: 'Formidable diesel engine equipped with Pinchy, a giant hydraulic roof claw! Always plotting to outshine steam engines.',
  },
  {
    id: 1140,
    name: 'Mr. Fun Computer (Sprunki Multiverse AI Core)',
    type: 'sprnuki',
    subtype: 'fun_computer',
    musicalNote: 'Note: 8-Bit Chiptune Synth Core',
    color: 'bg-cyan-500',
    description: 'The retro chiptune computer monitor mascot from the Sprunki universe, generating 128 BPM electronic basslines.',
  },

  // ================= EXPANDED MULTIVERSE CAST & HEROES =================
  {
    id: 1141,
    name: 'Australia Countryball (Bush Ranger)',
    type: 'countryball',
    subtype: 'australia_bushranger',
    flag: 'au',
    customHat: 'hat_sombrero',
    color: 'bg-blue-800',
    description: 'Aussie countryball wearing an outback slouch hat with cork string, holding a boomerang and navigating desert bushlands.',
  },
  {
    id: 1142,
    name: 'Canadaball (Mountie Timberjack)',
    type: 'countryball',
    subtype: 'canada_mountie',
    flag: 'ca',
    customHat: 'hat_ushanka',
    color: 'bg-red-700',
    description: 'Cheerful Canadian sphere sporting a wide Mountie stetson, sipping hot maple syrup, and wielding a diamond felling axe.',
  },
  {
    id: 1143,
    name: 'Marina the Mermaid (Xilam Coastal Idol)',
    type: 'xilam',
    subtype: 'marina',
    color: 'bg-teal-500',
    description: 'Enchanting cartoon siren from Zig & Sharko with shimmering aquamarine tail fins and flower crown, protected fiercely by Sharko.',
  },
  {
    id: 1144,
    name: 'Bernie the Hermit Crab (Xilam Slapstick)',
    type: 'xilam',
    subtype: 'bernie',
    color: 'bg-orange-600',
    description: 'Zig’s miniature mechanical inventor friend who builds crazy rocket traps out of seashells and rusted tin cans.',
  },
  {
    id: 1145,
    name: 'Breeze Trial Master (Minecraft 1.21)',
    type: 'minecraft',
    subtype: 'breeze',
    heldWeapon: 'wind_charge',
    color: 'bg-indigo-500',
    description: 'Swirling trial chamber wind elemental that leaps acrobatically from wall to wall firing compressed kinetic wind bursts.',
  },
  {
    id: 1146,
    name: 'Armadillo Savanna Scout (Minecraft)',
    type: 'minecraft',
    subtype: 'armadillo',
    color: 'bg-amber-700',
    description: 'Gentle savanna wanderer that rolls up into an armored protective sphere when startled, shedding protective scutes for wolf armor.',
  },
  {
    id: 1147,
    name: 'Robloxian Neon Speedster',
    type: 'roblox',
    subtype: 'speed_demon',
    robloxHeadColor: '#facc15',
    robloxTorsoColor: '#0284c7',
    robloxLegsColor: '#0f172a',
    robloxFace: 'epic',
    robloxHat: 'shades',
    robloxGear: 'speed_coil',
    color: 'bg-cyan-600',
    description: 'High-speed parkour specialist equipped with dual Neon Speed Coils, leaving blazing particle trails across obby skyways.',
  },
  {
    id: 1148,
    name: 'Bloxian Hacker 1x1x1x1 (Void Glitch)',
    type: 'roblox',
    subtype: 'glitch_entity',
    robloxHeadColor: '#450a0a',
    robloxTorsoColor: '#18181b',
    robloxLegsColor: '#09090b',
    robloxFace: 'void',
    robloxHat: 'dominus',
    robloxGear: 'sword',
    customAura: 'aura_blood_mist',
    color: 'bg-red-950',
    description: 'Legendary Bloxian mythical shadow entity surrounded by inverted code fragments and humming with dark void energy.',
  },
  {
    id: 1149,
    name: 'Mayor McCheese (Golden Citadel Dignitary)',
    type: 'custom',
    classArchetype: 'mcdonalds_crew',
    customHat: 'hat_tophat',
    color: 'bg-amber-500',
    description: 'Distinguished municipal leader of McDonaldland with a giant sesame cheeseburger head, formal tuxedo sash, and diplomatic gavel.',
  },
  {
    id: 1150,
    name: 'Hamburglar (Sneak Burglar of McDonaldland)',
    type: 'custom',
    classArchetype: 'mcdonalds_crew',
    customHat: 'hat_tophat',
    color: 'bg-stone-900',
    description: 'Cunning masked rogue wearing black-and-white prison stripes and a wide fedora, perpetually on the hunt for delicious hamburgers.',
  },
  {
    id: 1151,
    name: 'Helios Bio-Drone Operator (BP Clean Energy)',
    type: 'custom',
    classArchetype: 'bp_engineer',
    customHat: 'hat_mining',
    color: 'bg-emerald-600',
    description: 'High-tech field technician in an insulated green jumpsuit controlling autonomous solar-drone swarms across geothermal basins.',
  },
  {
    id: 1152,
    name: 'Tarragower Senior Proctor (Clock Tower Guild)',
    type: 'custom',
    classArchetype: 'tarragower_scholar',
    customHat: 'hat_tophat',
    color: 'bg-indigo-900',
    description: 'Academic scholar carrying ancient leather-bound schematics and tuning the grand resonant pendulums of Tarragower Clock Tower.',
  },
  {
    id: 1153,
    name: 'Aeternum Azoth Alchemist (New World Covenant)',
    type: 'custom',
    classArchetype: 'newworld_conqueror',
    customHat: 'hat_viking',
    color: 'bg-amber-700',
    description: 'Frontier master alchemist brewing luminous azure Azoth vials to enhance weapon strikes and ward off corrupted territory invasions.',
  },
];

export default function CharacterGallery({ onSelect }: { onSelect: (char: any) => void }) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'minecraft' | 'sprnuki' | 'train' | 'countryball' | 'roblox' | 'xilam' | 'halloween' | 'multiverse' | 'christmas'>('all');
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [horrorModeAll, setHorrorModeAll] = useState(false);

  // Countryball Regional Audio Motif State
  const [isHoverSoundEnabled, setIsHoverSoundEnabled] = useState<boolean>(() => countryballAudio.getIsHoverSoundEnabled());
  const [activeMotifCountry, setActiveMotifCountry] = useState<string | null>(null);

  // Sprunki Incredibox Studio Mode State
  const [sprunkiStudioOpen, setSprunkiStudioOpen] = useState<boolean>(false);
  const [sprunkiViewMode, setSprunkiViewMode] = useState<'both' | 'studio' | 'cards'>('both');

  useEffect(() => {
    const unsub = countryballAudio.subscribe((country) => {
      setActiveMotifCountry(country);
    });
    return () => unsub();
  }, []);

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
    if (selectedFilter === 'christmas') {
      if (!char.isChristmas && !char.christmasCostume && !char.name.toLowerCase().includes('santa') && !char.name.toLowerCase().includes('christmas') && !char.name.toLowerCase().includes('holiday') && !char.name.toLowerCase().includes('rudolph') && !char.name.toLowerCase().includes('frosty') && !char.name.toLowerCase().includes('elf') && !char.name.toLowerCase().includes('gingerbread')) {
        return false;
      }
    } else if (selectedFilter === 'halloween') {
      if (!char.isHalloween && !char.halloweenCostume && !char.name.toLowerCase().includes('halloween')) {
        return false;
      }
    } else if (selectedFilter === 'multiverse') {
      const isBrand = char.id >= 950 || [
        'mcdonald', 'youtube', 'tarragower', 'bp', 'newworld', 'nz', 'aeternum', 'maui'
      ].some(k => char.name.toLowerCase().includes(k) || (char.subtype || '').toLowerCase().includes(k));
      if (!isBrand) return false;
    } else if (selectedFilter !== 'all' && char.type !== selectedFilter) {
      return false;
    }

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
          Now with <strong>{ALL_CHARACTERS.length} Playable Multiverse Characters</strong>! Featuring <strong>The Multiverse Super-Update 🌟</strong> with <strong>45 Minecraft Heroes & Mobs</strong> (Breeze, Sniffer, Armadillo, Ender Dragon...), <strong>20 Roblox Legends</strong> (Builderman, Guest 666, Dominus Empyreus...), <strong>40 Sprunkis</strong> (Garnold, Tunner, Simon, Pinki...), <strong>16 Xilam Slapstick</strong> (Lucky Luke, Rantanplan, Joe Dalton...), <strong>38 Sodor Locomotives</strong> (Percy, Gordon, James, Scotsman...), <strong>58 Sovereign Countryballs</strong> (Japan Neko, Italy Chef, Brazil...), and <strong>16 Multiverse Brands & Schools</strong> (McDonald’s, YouTube, BP Helios, Tarragower School, New World, NZ)!
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
            { id: 'all', label: `🌟 All Cast (${ALL_CHARACTERS.length})` },
            { id: 'christmas', label: '🎄 Christmas Update (80)' },
            { id: 'minecraft', label: '⛏️ Minecraft (45)' },
            { id: 'roblox', label: '🟥 Roblox (20)' },
            { id: 'sprnuki', label: '🔮 Sprunkis (40)' },
            { id: 'xilam', label: '💥 Xilam (16)' },
            { id: 'train', label: '🚂 Locomotives (38)' },
            { id: 'countryball', label: '🌐 Countryballs (58)' },
            { id: 'multiverse', label: '🍔 Multiverse Brands (16)' },
            { id: 'halloween', label: '🎃 Halloween (11)' },
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

              {/* Quick Actions: Audio Toggle, Random Dossier & Space Program Info */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Folk Motifs Audio Toggle */}
                <button
                  type="button"
                  onClick={() => {
                    const next = countryballAudio.toggleHoverSound();
                    setIsHoverSoundEnabled(next);
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow ${
                    isHoverSoundEnabled
                      ? 'bg-blue-600/30 hover:bg-blue-600/45 text-blue-200 border-blue-400'
                      : 'bg-stone-800 text-stone-400 border-stone-700 hover:text-stone-200'
                  }`}
                  title="Toggle instant musical folk instrument motifs when hovering Countryball cards"
                >
                  {isHoverSoundEnabled ? (
                    <>
                      <Volume2 size={13} className="text-blue-400 animate-pulse" />
                      <span>🔊 Hover Motifs: ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={13} className="text-stone-400" />
                      <span>🔇 Hover Motifs: MUTED</span>
                    </>
                  )}
                </button>

                {activeMotifCountry && (
                  <div className="flex items-center gap-1.5 bg-blue-950/90 border border-blue-400/60 px-3 py-1 rounded-xl text-xs text-blue-200 animate-pulse shadow">
                    <Sparkles size={12} className="text-yellow-300 animate-spin" />
                    <span className="truncate max-w-[200px] sm:max-w-[320px]">
                      🎶 <strong>{activeMotifCountry}</strong>: {COUNTRYBALL_AUDIO_PROFILES[activeMotifCountry]?.instrument || 'Folk Motif'}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    const randomCb = COUNTRYBALLS_DATA[Math.floor(Math.random() * COUNTRYBALLS_DATA.length)];
                    setSelectedCountryballDossier(randomCb);
                    countryballAudio.playMotif(randomCb.name, true);
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
                    countryballAudio.playMotif('Poland', true);
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
        {selectedFilter === 'sprnuki' && (
          <div className="mt-4">
            {/* View Mode Switcher for Sprunki */}
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap bg-stone-900/80 p-2.5 rounded-2xl border border-stone-800 font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="text-orange-400 font-bold">Sprunki View:</span>
                <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
                  <button
                    type="button"
                    onClick={() => setSprunkiViewMode('studio')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      sprunkiViewMode === 'studio' 
                        ? 'bg-orange-500 text-black shadow' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🎛️ Studio Only
                  </button>
                  <button
                    type="button"
                    onClick={() => setSprunkiViewMode('both')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      sprunkiViewMode === 'both' 
                        ? 'bg-orange-500 text-black shadow' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🌟 Studio + Cards
                  </button>
                  <button
                    type="button"
                    onClick={() => setSprunkiViewMode('cards')}
                    className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                      sprunkiViewMode === 'cards' 
                        ? 'bg-orange-500 text-black shadow' 
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    🃏 27 Character Cards
                  </button>
                </div>
              </div>

              <div className="text-stone-400 text-[11px]">
                Drag character badges onto the 7 stage podiums to mix loops!
              </div>
            </div>

            {/* Full Interactive Sprunki Beat Studio */}
            {(sprunkiViewMode === 'studio' || sprunkiViewMode === 'both') && (
              <SprunkiBeatStudio 
                allCharacters={ALL_CHARACTERS}
                onSelectCharacter={onSelect}
              />
            )}
          </div>
        )}

        {/* When viewing All cast, show quick launcher for Sprunki Beat Studio */}
        {selectedFilter === 'all' && (
          <div className="mt-6 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-stone-900 via-orange-950/40 to-stone-900 border border-orange-500/40 shadow-2xl relative overflow-hidden backdrop-blur font-mono">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-500 text-black shadow-lg shadow-orange-950/50">
                  <Disc3 size={24} className="animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <div className="text-left">
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    Sprunki Incredibox Interactive Beat Studio
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 font-normal">
                      Drag & Drop Stage
                    </span>
                  </h3>
                  <p className="text-xs text-stone-300">
                    Live 7-podium mixing stage with tempo control (60-160 BPM), solo/mute buttons, and Black Top Hat horror mode!
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedFilter('sprnuki');
                  setSprunkiViewMode('both');
                }}
                className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-black text-xs shadow-lg transition active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Music size={14} />
                <span>Launch Beat Studio Stage</span>
              </button>
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
      {!(selectedFilter === 'sprnuki' && sprunkiViewMode === 'studio') && (
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
              key={`${char.type}-${char.id}`}
              onMouseEnter={() => {
                setHoveredId(char.id);
                if (char.type === 'countryball') {
                  countryballAudio.playMotif(char.name);
                }
              }}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => {
                if (char.type === 'countryball' && cbData) {
                  // Play distinct regional folk motif + full voiced catchphrase + open dossier
                  countryballAudio.playMotif(char.name, true);
                  handleMakeCharacterTalk(effectiveChar);
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

              {/* Countryball Actions: Play Folk Instrument Motif & View Historical Dossier */}
              {char.type === 'countryball' && cbData && (
                <div className="w-full flex flex-col gap-1.5 mt-1 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      countryballAudio.playMotif(char.name, true);
                    }}
                    className="w-full py-1.5 px-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/35 text-blue-300 hover:text-blue-100 border border-blue-500/40 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow"
                    title={`Play ${COUNTRYBALL_AUDIO_PROFILES[char.name]?.instrument || 'regional folk motif'}`}
                  >
                    <Sparkles size={13} className="text-yellow-400" />
                    <span className="truncate">🎵 Play Folk Motif ({COUNTRYBALL_AUDIO_PROFILES[char.name]?.instrument?.split('&')[0]?.trim() || 'Folk Motif'})</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      countryballAudio.playMotif(char.name, true);
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
      )}

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
