import { audioEngine } from './audioEngine';
import { CharacterData } from '../components/CharacterAvatar';
import { COUNTRYBALLS_DATA } from '../data/countryballsData';

export interface SpokenLine {
  quote: string;
  expression?: string;
  soundCue?: string;
}

export type SpeechListener = (event: {
  characterId?: number;
  characterName: string;
  text: string;
  isSpeaking: boolean;
}) => void;

class SpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private isMuted: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<SpeechListener> = new Set();
  private activeSpeakingCharacter: string | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    try {
      this.voices = this.synth.getVoices();
    } catch {
      this.voices = [];
    }
  }

  public subscribe(listener: SpeechListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(characterName: string, text: string, isSpeaking: boolean, characterId?: number) {
    this.listeners.forEach((fn) => fn({ characterId, characterName, text, isSpeaking }));
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stop();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch {
        // ignore
      }
    }
    if (this.activeSpeakingCharacter) {
      this.notify(this.activeSpeakingCharacter, '', false);
      this.activeSpeakingCharacter = null;
    }
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return !!(this.synth && (this.synth.speaking || this.synth.pending));
  }

  public getCharacterQuotes(name: string, type?: string, subtype?: string): string[] {
    const key = (subtype || name).toLowerCase();

    // Specific Minecraft Mobs & Heroes Quotes
    if (key.includes('diamond_steve') || (name.includes('Steve') && key.includes('diamond'))) {
      return [
        "Behold full enchanted diamond armor! The deep underworld holds no fears!",
        "Rule number one: Never dig straight down! Rule number two: Always carry torches!",
        "Fortune III pickaxe equipped! Watch those diamond ores multiply!",
        "I've explored 10,000 blocks and conquered the Ender Dragon!",
      ];
    }
    if (key.includes('netherite') || (name.includes('Steve') && key.includes('netherite'))) {
      return [
        "Forged in ancient Nether debris! Fire and lava cannot burn this armor!",
        "Step aside, Piglins! Netherite sharpness V is ready for battle!",
        "Walking across magma fields like a walk in the park!",
        "From the depths of the Nether to the heights of the Overworld!",
      ];
    }
    if (key.includes('herobrine')) {
      return [
        "You shouldn't have dug this deep into the world...",
        "I watch through the render fog. You are never truly alone.",
        "Redstone torches placed where no player has walked...",
        "Did you hear that sound in the mine shaft? Turn around.",
      ];
    }
    if (key.includes('steve')) {
      return [
        "Punch that tree, craft a workbench, and let's build a castle!",
        "OOF! That was close! Need to eat an apple to regenerate hearts!",
        "Sunset is coming! Quick, light the perimeter with torches!",
        "Found an underground cave! Time to mine for iron and gold!",
      ];
    }
    if (key.includes('alex')) {
      return [
        "Grab your bow and arrows! I'll cover you from the clifftop!",
        "Exploring untouched biomes is the best feeling in the world!",
        "Crafted a compass and mapped the entire river valley!",
        "Look at that view! Let's build a mountain fortress right here!",
      ];
    }
    if (key.includes('charged') || (key.includes('creeper') && key.includes('charge'))) {
      return [
        "STRUCK BY LIGHTNING! CRACKLING WITH BLUE ELECTRICITY!",
        "MY BLAST WILL SHATTER OBSIDIAN! TZZZZZZZ!",
        "10X EXPLOSIVE RADIUS! BETTER RUN SPRINT!",
        "ELECTRIC CHARGE SURGING! SSSSSSSSS... BOOM!",
      ];
    }
    if (key.includes('creeper')) {
      return [
        "Sssss... that's a very nice house you've built there...",
        "Tssss... I don't mean to scare you, I just wanted a hug!",
        "Sneaking softly through the tall grass... Sssss...",
        "Tick tick tick... BOOM! Sorry about your front porch!",
      ];
    }
    if (key.includes('enderman')) {
      return [
        "Do not look directly into my eyes... vwoooomp!",
        "I borrow this grass block for my personal museum.",
        "Teleporting through dimensions! What a curious human you are.",
        "Raindrops sting like fire! Moving to dry land!",
      ];
    }
    if (key.includes('iron_golem') || key.includes('golem')) {
      return [
        "Protect the villagers at all costs. Stand behind me.",
        "Take this gentle red poppy. Peace and strength bloom together.",
        "CLANG! No zombies or illagers shall harm this village!",
        "Forged from four iron blocks and a carved pumpkin heart.",
      ];
    }
    if (key.includes('warden')) {
      return [
        "I hear your vibration... the sculk tendrils guide me...",
        "ROAAAR! Silence the disturbance in the ancient city!",
        "Vibrations echo in the dark... step very, very carefully...",
        "Deep Dark darkness blinds you, but my senses are absolute!",
      ];
    }
    if (key.includes('wither_skeleton')) {
      return [
        "Charred bones from the Nether fortress! Feel the wither effect!",
        "Guarding the blaze spawners! My stone sword strikes with decay!",
        "Gather three of our skulls if you dare summon the Wither!",
        "Born in the crimson ash and soul sand valleys!",
      ];
    }
    if (key.includes('piglin')) {
      return [
        "Oink! Shiny gold! Give gold ingot or prepare for battle!",
        "Snort! Don't you dare touch our fortress treasure chests!",
        "Barter time! Here is an Ender Pearl for your gold bullion!",
        "We love gold! Everything in life should be made of gold!",
      ];
    }
    if (key.includes('drowned')) {
      return [
        "From the ocean depths with a crackling sea trident!",
        "Gurgle... sunken ships and ocean ruins are my domain!",
        "Channeling the storm! Watch lightning strike the ocean waves!",
        "Nautilus shells and heart of the sea await the brave diver!",
      ];
    }
    if (key.includes('blaze')) {
      return [
        "Smoking fire rods rotating with blistering heat!",
        "Fzzzt! Fireball volley incoming! Beware the Nether fortress!",
        "Harvest my blaze rods for brewing strength and eyes of ender!",
        "Igniting the Nether sky with blazing inferno power!",
      ];
    }
    if (key.includes('witch')) {
      return [
        "Hehehehe! A splash potion of slowness and poison for you!",
        "Cackling over my bubbling cauldron! Spider eyes and redstone dust!",
        "Swamp witchery at its finest! Have a taste of my potion brew!",
        "Healing potion chugged! You can't defeat an alchemist!",
      ];
    }
    if (key.includes('wolf') || key.includes('dog')) {
      return [
        "Woof woof! I'm your most loyal diamond-mining companion!",
        "Bark! Skeletons run in terror when they see my collar!",
        "Tail wagging at maximum speed! Ready to explore dungeons together!",
        "Arooooo! I'll protect you through the night!",
      ];
    }
    if (key.includes('pig')) {
      return [
        "Oink oink! Put a saddle on me and grab a carrot on a stick!",
        "Squeal! Zooming across the plains at supersonic pig speed!",
        "Snuffle in the mud! Life as a Minecraft pig is pure joy!",
        "Oink! Look out for cliffs, this carrot steering is sensitive!",
      ];
    }
    if (key.includes('axolotl')) {
      return [
        "Squeee! The cutest cave predator! I grant regeneration hearts!",
        "Splish splash! Fluffy pink gills fluttering with joy!",
        "Playing dead so hostile sea mobs leave us alone!",
        "Keep me in a water bucket and I will follow you anywhere!",
      ];
    }
    if (key.includes('bee')) {
      return [
        "Bzzzzz! Sweet flower nectar gathered for the honey block hive!",
        "Fluttering fuzzy wings! Pollinating your wheat and carrot crops!",
        "Bzzz! Don't disturb the hive and we will be best friends forever!",
        "Honey bottles cure poison! Taste the sweet golden honey!",
      ];
    }
    if (key.includes('skeleton')) {
      return [
        "Clack clack rattle! Sniper bow drawn and aim locked!",
        "Target spotted at 40 paces! Hear the arrow whistle!",
        "Guard the dungeon spawners! Bones rattling in the dark!",
        "Quick, duck behind your shield before my volley strikes!",
      ];
    }
    if (key.includes('zombie')) {
      return [
        "Bruuuuuh... hungry for brains... wait, do you have bread?",
        "Gaaaah... daylight burns, retreat under the oak trees!",
        "Groan... wandering the midnight landscape looking for miners...",
        "Bruuuuh... we always travel in midnight packs!",
      ];
    }
    if (key.includes('villager')) {
      return [
        "Hrmmm? 3 emeralds for 2 fresh wheat loaves! Fair trade!",
        "Hrmmm! Iron Golem, this miner looks suspicious!",
        "Hrmmm... ringing the village bell! Night is approaching!",
        "Hrmmm! Best trades in the entire biome right here!",
      ];
    }
    if (key.includes('snow_golem') || key.includes('snowgolem')) {
      return [
        "Snowball fight champion! Laying down icy snow trails!",
        "Carved pumpkin helmet on, ready to pelt creepers with snowballs!",
        "Stay cool in the winter blizzard! Snowballs away!",
      ];
    }
    if (key.includes('mooshroom')) {
      return [
        "Mooo! Fresh mushroom stew right from my back!",
        "Grazing peacefully on lush mycelium grass!",
        "Red spotted fungus power! The most magical cow in Minecraft!",
      ];
    }
    if (key.includes('evoker')) {
      return [
        "Wololo! Summoning snapping iron fangs from the floorboards!",
        "Vex spirits arise! The Illager Mansion will never fall!",
        "Feel the mystical power of dark totem magic!",
        "Emerald eyes flashing! You shall not pass my threshold!",
      ];
    }
    if (key.includes('copper')) {
      return [
        "Click-clack whirr! Pressing copper buttons and oxidising in the rain!",
        "BZZZT! Lightning rod antenna absorbing 1.21 gigawatts of thunder!",
        "Patina turning green! Sturdy little copper friend at your service!",
        "Click click clack! My internal copper gears are spinning fast!",
      ];
    }
    if (key.includes('allay')) {
      return [
        "Tinkle tinkle! Bring me an item and I will find more for you!",
        "Fluttering sweet fairy wings! Music and cookies make me dance!",
        "Chime chime! Singing happy notes to the sound of note blocks!",
        "I found another shiny diamond for our chest! Wheeee!",
      ];
    }

    // Sprunki Beatboxers Quotes
    if (key.includes('oren')) {
      return [
        "Yo, Oren on the mic! Dropping punchy kicks and funky head-bops!",
        "Feel the rhythm in your bones! 1, 2, 3, let the snare snap!",
        "Orange beanie on point, DJ studio headphones locked in!",
        "Drop that beat and let the melody ride high!",
      ];
    }
    if (key.includes('raddy')) {
      return [
        "Feel the crimson fire! Snappy hi-hats and devil horns up!",
        "Red hot tempo! Keep that high-energy percussion rolling!",
        "Sharp beats, sharp teeth, and unstoppable groove!",
        "Turn up the distortion and pump that sub-bass!",
      ];
    }
    if (key.includes('vineria')) {
      return [
        "Nature sings in harmony... bloom with the acoustic melody!",
        "Gentle green leaves dancing to the gentle woodland flute!",
        "Organic botanical rhythms breathing life into the world!",
        "Flow like a river, sing like the morning forest breeze!",
      ];
    }
    if (key.includes('funbot') || key.includes('fun_bot') || key.includes('computer')) {
      return [
        "BEEP BOOP! Synthesizer online! Activating 8-bit chip matrix!",
        "Digital waveform calibrated to maximum electronic groove!",
        "Quantum glitch arpeggio engaged! Computing party protocol!",
        "01100010 01100101 01100001 01110100 - That spells BEAT!",
      ];
    }
    if (key.includes('gray')) {
      return [
        "Mmm... cozy hoodie vibes and mellow chillhop lo-fi beats.",
        "Soft acoustic hums to soothe your heart on rainy days.",
        "Quiet coffee shop melodies floating through the air.",
        "Warm tea, cozy headphones, and peaceful chords.",
      ];
    }
    if (key.includes('garnold')) {
      return [
        "Golden VIP status! Dropping the platinum vinyl mixtape!",
        "Prism shades glowing! Feel that multi-million dollar drop!",
        "Top of the charts! Golden grooves for true champions!",
        "Scratch that turntable and watch the crowd ignite!",
      ];
    }
    if (key.includes('durple')) {
      return [
        "RAWR! Purple dino stomps make the biggest 808 bass in town!",
        "Smiling cartoon teeth and colossal earthquake drum hits!",
        "Stomp stomp clap! Dino party in full swing!",
        "Loud and proud purple thunder! Let's shake the world!",
      ];
    }
    if (key.includes('sky')) {
      return [
        "Floating high in the cloud nine choir! Angelic halo harmonics!",
        "Feather-light melodies sailing over the rainbows!",
        "Pure celestial vocal runs blessing the beat!",
        "Reach for the sky and let your spirit sing!",
      ];
    }
    if (key.includes('horror') || key.includes('void')) {
      return [
        "T̸h̸e̸ ̸v̸o̸i̸d̸ ̸c̸o̸n̸s̸u̸m̸e̸s̸ ̸a̸l̸l̸ ̸r̸h̸y̸t̸h̸m̸...̸",
        "Phase 2 unleashed! Do not look into the glitching red eyes...",
        "Static screams echoing from the subterranean abyss...",
        "The beat never dies... it only transforms into darkness...",
      ];
    }
    if (key.includes('tunner')) {
      return [
        "Dapper fedora tipped! Smooth jazz basslines on the upright!",
        "Finger-snapping swing rhythm! Vintage style never fades!",
        "Walk that bass down the midnight avenue, cool cat!",
        "A little syncopation makes the whole room sway!",
      ];
    }
    if (key.includes('mrsun') || key.includes('sun')) {
      return [
        "Good morning world! Radiant golden sunshine bops all day!",
        "Shining bright! Warm daytime chords bringing pure happiness!",
        "Bask in the golden glow of the midday chorus!",
        "Keep your face toward the sun and shadows fall behind!",
      ];
    }
    if (key.includes('mrtree') || key.includes('tree')) {
      return [
        "Ancient roots run deep! Subterranean timber bass resonance!",
        "Oak branches swaying to the seasons of harmony!",
        "Deep woodland pulses grounded in century-old soil!",
        "Listen to the whisper of the ancient grove...",
      ];
    }
    if (key.includes('wenda')) {
      return [
        "Nya~ kawaii pop melodies! Whiskers twitching to the beat!",
        "Sweet sugary synth chops! Let's dance together!",
        "Paws in the air! Playful cat energy brightening your day!",
        "Sing along with me! Nya nya, drop the beat!",
      ];
    }
    if (key.includes('pinki')) {
      return [
        "Bubblegum neon popstar! Giant ribbon bow bouncing to the track!",
        "Infectious bubblegum pop hooks stuck in your head forever!",
        "Glitter, neon, and high-energy sparkles on the dancefloor!",
        "1, 2, 3, pop! Let's turn this place into a concert!",
      ];
    }
    if (key.includes('jevin')) {
      return [
        "Aqua slime grooves dripping with liquid percussion!",
        "Bubbling water drops falling on the rhythmic pond!",
        "Splashing basslines and refreshing melodic waves!",
        "Drip drop beat drop! Liquid harmony in motion!",
      ];
    }
    if (key.includes('simon') && !key.includes('horror')) {
      return [
        "Whew-whew-whee! Simon on the whistle! Happy sunny yellow melodies!",
        "Whistle while you build! Cheerful tunes to brighten any biome!",
        "La-di-da-da! Keep your antennas up and groove along with me!",
        "Melody 4 reporting for the band! Let's make everyone smile!",
      ];
    }
    if (key.includes('black')) {
      return [
        "The Black Top Hat... the legendary artifact of the Sprunki universe.",
        "Wear the Black Hat to plunge the world into Phase 2 Horror...",
        "Silent shadow silhouette... sub-bass frequencies echoing from the cosmos.",
        "Deep monochromatic echoes vibrating through empty space...",
      ];
    }
    if (key.includes('clukr')) {
      return [
        "BAWK! 16th-note hyper percussion! Click click bawk bawk!",
        "Chaotic rooster rhythms! Feathers flying everywhere!",
        "Triple-time clucking! You can't match this crazy speed!",
        "Cock-a-doodle-GROOVE! Wake up to the rhythm!",
      ];
    }
    if (key.includes('owakcx')) {
      return [
        "HONK HONK! Circus jester brass bells and spring boings!",
        "Syncopated carnival madness! Step right up to the show!",
        "Juggling beats and tossing rhythm into the air!",
        "Whistle, chime, and laugh! The circus never ends!",
      ];
    }
    if (key.includes('brud')) {
      return [
        "Zzz... yawn... heavy 808 sub bass drifting through dreams...",
        "Slowest tempo, deepest groove... sleepy sloth bedtime beats...",
        "Don't wake me up unless the drop is legendary...",
        "Snoring in key... low C frequency reverberating...",
      ];
    }
    if (key.includes('verity')) {
      return [
        "Behold the celestial light! Truth resonates through cosmic crystal harmonies!",
        "Starlight shines through the shadows! Celestial amethyst chimes awakening!",
        "La-la-lu! Harmonic frequencies revealing the beauty of the universe!",
        "Where truth blooms, the sweetest melody guides our path!",
        "Ethereal star halo radiating peace across all realms!",
      ];
    }

    // Trains (Thomas & Friends)
    if (key.includes('thomas')) {
      return [
        "I'm Thomas, a Really Useful Engine! Peep peep! Clear the tracks!",
        "Off on an adventure across the Island of Sodor!",
        "Sir Topham Hatt will be very pleased with our timetable today!",
        "Puffing proudly along the Ffarquhar branch line!",
      ];
    }
    if (key.includes('percy')) {
      return [
        "Peep peep! Special mail train delivery on schedule!",
        "Small engine, big courage! Through rain and snow!",
        "Delivering parcels to all the stations before dawn!",
        "Thomas is my best friend! Let's puff together!",
      ];
    }
    if (key.includes('james')) {
      return [
        "Look at my splendid scarlet coat! No engine shines brighter!",
        "Clean, polished brass dome gleaming in the morning sun!",
        "A splendid engine like me deserves the finest passenger trains!",
        "Heed my whistle! The splendid red engine is here!",
      ];
    }
    if (key.includes('gordon')) {
      return [
        "Express coming through! Poop poop! Out of my way!",
        "Fast and mighty! Pulling the Wild Nor' Wester express!",
        "Up Gordon's Hill with maximum steam pressure!",
        "Tender engines don't shunter, tender engines fetch the express!",
      ];
    }
    if (key.includes('emily')) {
      return [
        "Polished emerald green single engine with golden driving wheels!",
        "Really Useful and proud of my Stirling single heritage!",
        "Whistling cheerfully through the Knapford harbor!",
        "Ready to take on any railway challenge with elegance!",
      ];
    }
    if (key.includes('diesel 10') || key.includes('diesel10')) {
      return [
        "Pinchy is hungry! Watch out for the Sodor Ironworks!",
        "Steam engines are outdated! Diesels rule the rails!",
        "My mechanical claw is polished and ready for mischief!",
        "Rattling through the scrap lines with a sinister grin!",
      ];
    }
    if (key.includes('flying scotsman') || key.includes('scotsman')) {
      return [
        "Dual tenders carrying speed across the global rails!",
        "First locomotive to officially reach 100 miles per hour!",
        "Apple Green LNER pride! Sibling to the mighty Gordon!",
        "Roaring down the mainline with unmatched majesty!",
      ];
    }
    if (type === 'train') {
      return [
        `Chuff chuff! ${name} rolling down the tracks with full steam!`,
        `Peep peep! ${name} delivering freight on time and safely!`,
        `Signals are green! Full speed ahead for ${name}!`,
        `Whistling around the mountain bend! Clear the crossing!`,
      ];
    }

    // Countryballs
    if (key.includes('poland')) {
      return [
        "Kurwa! Poland CAN into space! Hand me my plunger rocket!",
        "I am best plumber and bravest countryball in the world!",
        "Do not partition my coal mine! I am digging to the stars!",
        "Bouncing proudly across the sandbox! Polska gurom!",
      ];
    }
    if (key.includes('usa') || key.includes('america')) {
      return [
        "Did somebody say OIL?! Freedom, eagles, and big burger power!",
        "Fifty stars on my shades! Mining diamonds at 1776% efficiency!",
        "Landing rocket ships on the moon while grilling on the back porch!",
        "Liberty and high-caliber diamond pickaxes for all!",
      ];
    }
    if (key.includes('uk') || key.includes('britain')) {
      return [
        "Jolly good day, chaps! A splendid cup of Earl Grey tea, what what!",
        "Rule Britannia! Let us erect magnificent Victorian castles!",
        "Polite manners, tall top hat, and an impeccably monocled eye!",
        "Keep calm and carry on mining through the wilderness!",
      ];
    }
    if (key.includes('russia')) {
      return [
        "Babushka made hot borscht! Subzero snow is just beach weather!",
        "Warm ushanka hat with Soviet star! Winter cannot stop us!",
        "Bears and balalaikas! Hard work builds mighty monuments!",
        "Mining through deep tundra permafrost with bare hands!",
      ];
    }
    if (key.includes('france')) {
      return [
        "Hon hon hon! Fresh crispy baguette and high Eiffel tower art!",
        "Tilted artist beret and vintage cheese! Magnifique craftsmanship!",
        "Vive la révolution! We shall paint the entire landscape with glory!",
        "French culinary genius restores all your hunger hearts!",
      ];
    }
    if (key.includes('japan')) {
      return [
        "Sugoi! High-tech anime precision and ultra-fast Shinkansen bullet trains!",
        "Nekomimi cat ears activated! Crafting legendary Katana blades!",
        "Cherry blossoms floating over Tokyo neon towers!",
        "Ganbatte! Striving for supreme craftsmanship in every single block!",
      ];
    }
    if (key.includes('germany')) {
      return [
        "Achtung! Maximum engineering precision and Autobahn efficiency!",
        "Pickelhaube helmet polished! Zero defects in our masonry!",
        "Work hard, build solid stone fortresses, then enjoy pretzels!",
        "Precision tools and impeccable order across every chunk!",
      ];
    }
    if (key.includes('canada')) {
      return [
        "Sorry about mining your yard, eh! Have some warm maple syrup!",
        "Flap hat on, hockey stick ready! Best lumberjacks in the north!",
        "Friendly greetings to all travelers! Moose on the loose!",
        "Pancakes, timber, and polite friendship for everyone!",
      ];
    }
    if (key.includes('italy')) {
      return [
        "Mamma Mia! Best handmade wood-fired pizza in the world!",
        "Chef toque on high! Toss the dough, sprinkle the cheese!",
        "Passionate singing under the Tuscan sun! Bellissimo!",
        "Pasta, monuments, and warm Italian sunshine!",
      ];
    }
    if (key.includes('mexico')) {
      return [
        "¡Ándale! ¡Fiesta con tacos, mariachi y alegría bajo el sol!",
        "Woven sombrero shielding from the desert heat! ¡Viva!",
        "Spicy salsa and sweet churros for energy to dig deep!",
        "Celebration time! No sneaky creepers can ruin our party!",
      ];
    }
    if (key.includes('brazil')) {
      return [
        "Carnival samba! Golazo! Bouncing soccer balls across the beach!",
        "Come to Brazil! Green and gold passion that never sleeps!",
        "Rhythms of Rio! Dancing through the jungle canopy!",
        "Joga bonito! Pure joy and dazzling footwork on every block!",
      ];
    }
    if (key.includes('china')) {
      return [
        "Build the Great Wall! 5,000 years of architectural mastery!",
        "Silk lanterns and golden dragons flying high over the empire!",
        "Enduring stone towers protecting our peaceful valley!",
        "Wisdom and persistent effort moves mountains!",
      ];
    }
    if (key.includes('spain')) {
      return [
        "¡Oro! Conquistador prospector striking rich gold veins in the hills!",
        "Flamenco guitar melodies echoing across the sunny plazas!",
        "Delicious paella and fearless exploration of new frontiers!",
        "¡Olé! Courage and passion in every stone we lay!",
      ];
    }
    if (key.includes('australia')) {
      return [
        "G'day mate! Mind the drop bears and throw that boomerang!",
        "Outback sunshine and barbecue sizzling by the billabong!",
        "No worries mate! We can survive any creature out in the bush!",
        "Kangaroo hops and boomerang strikes across the dunes!",
      ];
    }
    if (key.includes('sweden')) {
      return [
        "Bork bork bork! Homeland of Minecraft and Viking courage!",
        "Flatpack furniture and sturdy wooden longhouses for all!",
        "Midsummer flowers and meatballs to power our mining adventures!",
        "Skål! Born to build blocky worlds of wonder!",
      ];
    }
    if (key.includes('netherlands')) {
      return [
        "Gezellig! Windmills, vibrant tulips, and engineered sea dikes!",
        "Master canal builders keeping the floodwaters at bay!",
        "Orange knitted scarf and cycling across the countryside!",
        "Reclaiming land from the ocean, block by block!",
      ];
    }
    if (type === 'countryball') {
      const cbItem = COUNTRYBALLS_DATA.find(c => 
        c.name.toLowerCase() === key || 
        key.includes(c.name.toLowerCase()) || 
        (c.commonName && key.includes(c.commonName.toLowerCase()))
      );
      if (cbItem) {
        return [
          cbItem.polandballQuote,
          `Motto of ${cbItem.name}: "${cbItem.motto}"`,
          `Historical Fact: ${cbItem.historicalFacts[0]}`,
          `National Perk: ${cbItem.lorePerk}`,
          `Capital: ${cbItem.capital} (Region: ${cbItem.region})!`,
        ];
      }
      return [
        `Greetings from ${name}! Ready to explore this magnificent world!`,
        `Rolling into adventure! ${name} is here to build together!`,
        `Friendship across borders and biomes! Let's mine together!`,
      ];
    }

    // Default Fallback
    return [
      `Hello adventurer! I am ${name}, ready for world exploration!`,
      `Let's craft, build, and conquer this sandbox world together!`,
      `The wilderness is vast and filled with endless discoveries!`,
    ];
  }

  public getRandomQuote(name: string, type?: string, subtype?: string): string {
    const quotes = this.getCharacterQuotes(name, type, subtype);
    const index = Math.floor(Math.random() * quotes.length);
    return quotes[index];
  }

  public speak(
    character: CharacterData,
    customText?: string,
    onEnd?: () => void
  ) {
    const textToSpeak = customText || this.getRandomQuote(character.name, character.type, character.subtype);

    // Cancel any previous speech
    this.stop();

    this.activeSpeakingCharacter = character.name;
    this.notify(character.name, textToSpeak, true, character.id);

    // Also trigger character's signature audio effect from audioEngine
    if (character.type === 'sprnuki') {
      audioEngine.playSprunkiSound(character.name, character.isHorror);
    } else if (character.type === 'minecraft') {
      audioEngine.playMinecraftSound(character.subtype || character.heldWeapon || character.name);
    } else if (character.type === 'train') {
      audioEngine.playMinecraftSound('bell');
    } else {
      audioEngine.playMinecraftSound('orb');
    }

    if (this.isMuted || !this.synth) {
      // Muted or no synth: simulate speech duration for bubble
      const duration = Math.min(5000, Math.max(2000, textToSpeak.length * 70));
      setTimeout(() => {
        this.notify(character.name, textToSpeak, false, character.id);
        this.activeSpeakingCharacter = null;
        if (onEnd) onEnd();
      }, duration);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      this.currentUtterance = utterance;

      // Configure Voice Characteristics based on Character Identity
      const nameLower = character.name.toLowerCase();
      const subtype = (character.subtype || '').toLowerCase();

      // Pitch & Rate adjustments
      let pitch = 1.0;
      let rate = 1.0;

      if (nameLower.includes('creeper') || subtype === 'creeper') {
        pitch = 1.6;
        rate = 1.2;
      } else if (nameLower.includes('enderman') || subtype === 'enderman') {
        pitch = 0.55;
        rate = 0.8;
      } else if (nameLower.includes('zombie') || subtype === 'zombie') {
        pitch = 0.6;
        rate = 0.75;
      } else if (nameLower.includes('warden') || subtype === 'warden') {
        pitch = 0.4;
        rate = 0.65;
      } else if (nameLower.includes('iron golem') || subtype === 'iron_golem') {
        pitch = 0.65;
        rate = 0.85;
      } else if (nameLower.includes('wolf') || subtype === 'tamed_wolf') {
        pitch = 1.45;
        rate = 1.25;
      } else if (nameLower.includes('axolotl') || subtype === 'axolotl') {
        pitch = 1.7;
        rate = 1.2;
      } else if (nameLower.includes('witch') || subtype === 'witch') {
        pitch = 1.5;
        rate = 1.15;
      } else if (nameLower.includes('villager') || subtype === 'villager') {
        pitch = 1.35;
        rate = 1.1;
      } else if (nameLower.includes('alex')) {
        pitch = 1.25;
        rate = 1.1;
      } else if (nameLower.includes('steve')) {
        pitch = 0.95;
        rate = 1.0;
      } else if (nameLower.includes('horror') || character.isHorror) {
        pitch = 0.45;
        rate = 0.7;
      } else if (character.type === 'sprnuki') {
        if (nameLower.includes('pinki') || nameLower.includes('wenda') || nameLower.includes('sky')) {
          pitch = 1.4;
          rate = 1.15;
        } else if (nameLower.includes('funbot') || subtype === 'computer') {
          pitch = 1.1;
          rate = 1.3;
        } else if (nameLower.includes('clukr') || nameLower.includes('owakcx')) {
          pitch = 1.5;
          rate = 1.35;
        } else if (nameLower.includes('brud')) {
          pitch = 0.6;
          rate = 0.7;
        } else {
          pitch = 1.1;
          rate = 1.05;
        }
      } else if (character.type === 'train') {
        if (nameLower.includes('gordon') || nameLower.includes('flying scotsman')) {
          pitch = 0.8;
          rate = 0.9;
        } else if (nameLower.includes('diesel 10')) {
          pitch = 0.55;
          rate = 0.85;
        } else if (nameLower.includes('thomas') || nameLower.includes('percy')) {
          pitch = 1.3;
          rate = 1.05;
        } else {
          pitch = 1.0;
          rate = 1.0;
        }
      } else if (character.type === 'countryball') {
        if (nameLower.includes('poland') || nameLower.includes('italy')) {
          pitch = 1.25;
          rate = 1.15;
        } else if (nameLower.includes('russia') || nameLower.includes('germany')) {
          pitch = 0.8;
          rate = 0.95;
        } else if (nameLower.includes('japan')) {
          pitch = 1.35;
          rate = 1.1;
        } else {
          pitch = 1.05;
          rate = 1.05;
        }
      }

      utterance.pitch = pitch;
      utterance.rate = rate;

      // Select matching voice language if available
      if (this.voices.length > 0) {
        if (character.type === 'countryball') {
          if (nameLower.includes('france')) {
            const fr = this.voices.find(v => v.lang.startsWith('fr'));
            if (fr) utterance.voice = fr;
          } else if (nameLower.includes('germany')) {
            const de = this.voices.find(v => v.lang.startsWith('de'));
            if (de) utterance.voice = de;
          } else if (nameLower.includes('italy')) {
            const it = this.voices.find(v => v.lang.startsWith('it'));
            if (it) utterance.voice = it;
          } else if (nameLower.includes('spain') || nameLower.includes('mexico')) {
            const es = this.voices.find(v => v.lang.startsWith('es'));
            if (es) utterance.voice = es;
          } else if (nameLower.includes('japan')) {
            const ja = this.voices.find(v => v.lang.startsWith('ja'));
            if (ja) utterance.voice = ja;
          } else if (nameLower.includes('uk')) {
            const enGb = this.voices.find(v => v.lang === 'en-GB' || v.lang.startsWith('en-GB'));
            if (enGb) utterance.voice = enGb;
          } else if (nameLower.includes('usa')) {
            const enUs = this.voices.find(v => v.lang === 'en-US' || v.lang.startsWith('en-US'));
            if (enUs) utterance.voice = enUs;
          }
        } else if (character.type === 'train') {
          // British voices fit Thomas & Friends
          const enGb = this.voices.find(v => v.lang.includes('GB') || v.lang.includes('en_GB'));
          if (enGb) utterance.voice = enGb;
        }
      }

      utterance.onend = () => {
        this.notify(character.name, textToSpeak, false, character.id);
        this.activeSpeakingCharacter = null;
        if (onEnd) onEnd();
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis utterance error:', e);
        this.notify(character.name, textToSpeak, false, character.id);
        this.activeSpeakingCharacter = null;
        if (onEnd) onEnd();
      };

      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis speak failure, simulating:', err);
      setTimeout(() => {
        this.notify(character.name, textToSpeak, false, character.id);
        this.activeSpeakingCharacter = null;
        if (onEnd) onEnd();
      }, 3000);
    }
  }
}

export const speechEngine = new SpeechEngine();
