// ==========================================================
// COUNTRYBALL REGIONAL AUDIO LIBRARY (AUTHENTIC INSTRUMENT MOTIFS)
// ==========================================================

export interface CountryballAudioProfile {
  instrument: string;
  regionalStyle: string;
  folkTradition: string;
}

export const COUNTRYBALL_AUDIO_PROFILES: Record<string, CountryballAudioProfile> = {
  // Western & Southern Europe
  'Poland': { instrument: 'Polka Accordion & Clarinet', regionalStyle: 'Mazurka & Polonaise', folkTradition: 'Lively Polish village dance with characteristic dotted rhythm' },
  'Poland Hussar': { instrument: 'Cavalry Fanfare & War Horn', regionalStyle: 'Winged Hussar Charge', folkTradition: 'Regal golden brass fanfare of the Commonwealth cavalry' },
  'France': { instrument: 'Musette Accordion', regionalStyle: 'Parisian Cafe Waltz', folkTradition: 'Romantic Seine riverbank accordion with gentle bellows vibrato' },
  'Germany': { instrument: 'Bavarian Oompah Brass', regionalStyle: 'Oktoberfest Polka', folkTradition: 'Deep tuba bounce with cheerful brass harmonic accents' },
  'Italy': { instrument: 'Neapolitan Mandolin', regionalStyle: 'Tarantella & Canzone', folkTradition: 'Fast tremolo plucked double-strings over sunny Mediterranean bass' },
  'Spain': { instrument: 'Flamenco Guitar & Castanets', regionalStyle: 'Andalusian Bulerías', folkTradition: 'Rapid nylon rasgueado strum in traditional Phrygian cadence' },
  'Portugal': { instrument: 'Portuguese Guitarra', regionalStyle: 'Fado Melancólico', folkTradition: '12-string teardrop guitar plucking nostalgic Lisbon ballads' },
  'UK': { instrument: 'Highland Bagpipe & Regal Brass', regionalStyle: 'Westminster Fanfare', folkTradition: 'Highland drone with stately royal ceremonial heraldry' },
  'Ireland': { instrument: 'Celtic Tin Whistle', regionalStyle: 'Galway Reel', folkTradition: 'Ornamented pennywhistle jig with emerald meadow spirit' },
  'Belgium': { instrument: 'Grand Carillon Bell', regionalStyle: 'Flemish Belfry Chimes', folkTradition: 'Historic belfry bells echoing across cobblestone market squares' },
  'Netherlands': { instrument: 'Street Barrel Organ', regionalStyle: 'Amsterdam Draaiorgel', folkTradition: 'Cheerful mechanical street organ with festive pipes and bells' },
  'Switzerland': { instrument: 'Alpine Alphorn & Cowbells', regionalStyle: 'Matterhorn Echo', folkTradition: 'Deep natural brass overtone resonant across alpine peaks' },
  'Austria': { instrument: 'Viennese Concert Strings', regionalStyle: 'Blue Danube Waltz', folkTradition: 'Graceful classical 3/4 waltz with sweeping string flourishes' },
  'Vatican': { instrument: 'Cathedral Pipe Organ', regionalStyle: 'Gregorian Choral Swell', folkTradition: 'Sacred multi-rank organ chords echoing through high stone arches' },

  // Eastern & Northern Europe
  'Russia': { instrument: 'Folk Balalaika', regionalStyle: 'Korobeiniki Dance', folkTradition: 'Triangular lute with blistering 16th-note tremolo in Russian minor' },
  'Ukraine': { instrument: 'Bandura & Sopilka', regionalStyle: 'Cossack Hopak', folkTradition: 'Plucked 60-string lute and wooden flute in energetic Cossack leap' },
  'Sweden': { instrument: 'Nordic Nyckelharpa', regionalStyle: 'Scandinavian Polska', folkTradition: 'Keyed fiddle with sympathetic resonance and birch forest melody' },
  'Norway': { instrument: 'Hardingfele (Hardanger Fiddle)', regionalStyle: 'Fjord Halling Dance', folkTradition: 'Resonant drone strings with lively Norwegian mountain rhythm' },
  'Finland': { instrument: 'Kantele Zither', regionalStyle: 'Kalevala Ballad', folkTradition: 'Silver-string box zither echoing ancient lakes and northern lights' },
  'Denmark': { instrument: 'Tivoli Brass & Glockenspiel', regionalStyle: 'Copenhagen Polka', folkTradition: 'Brisk Nordic brass march with crisp percussive bells' },
  'Iceland': { instrument: 'Langspil & Volcanic Drone', regionalStyle: 'Geysir Echo', folkTradition: 'Ethereal bowed drone evoking glaciers, moss, and midnight sun' },
  'Greece': { instrument: 'Mediterranean Bouzouki', regionalStyle: 'Hasapiko & Syrtaki', folkTradition: 'Fast metallic triplet tremolo accelerating in joyful Greek celebration' },
  'Czechia': { instrument: 'Bohemian Clarinet & Polka', regionalStyle: 'Prague Brass', folkTradition: 'Rustic woodwind runs and rich Bohemian beer-hall brass' },
  'Hungary': { instrument: 'Cimbalom & Gypsy Fiddle', regionalStyle: 'Czardas Accelerando', folkTradition: 'Hammered dulcimer rolls accelerating into fiery virtuoso tempo' },

  // The Americas
  'USA': { instrument: 'Blues-Rock Electric Guitar', regionalStyle: 'Star-Spangled Riff', folkTradition: 'Overdriven pentatonic power licks with soaring stadium sustain' },
  'Texas': { instrument: 'Country Slide Guitar', regionalStyle: 'Lone Star Western', folkTradition: 'Steel bottleneck slide bending along open dusty prairie trails' },
  'Canada': { instrument: 'Lumberjack Voyageur Fiddle', regionalStyle: 'Quebecois Reel', folkTradition: 'Fast foot-stomping fiddle dance of northern woodchoppers' },
  'Mexico': { instrument: 'Mariachi Trumpet & Guitarrón', regionalStyle: 'Jalisco Son', folkTradition: 'Dual bright brass trumpets and deep acoustic bass rasgueado' },
  'Brazil': { instrument: 'Samba Batucada & Berimbau', regionalStyle: 'Rio Carnival Grooves', folkTradition: 'Syncopated whistle, cuíca squeeze, and joyful beach polyrhythms' },
  'Argentina': { instrument: 'Bandoneón Accordion', regionalStyle: 'Buenos Aires Tango', folkTradition: 'Passionate staccato accents and weeping tango melodies' },
  'Chile': { instrument: 'Cueca Charango & Clapped Rhythm', regionalStyle: 'Andean Cueca', folkTradition: 'High-pitched armadillo-shell lute and enthusiastic handkerchief dance' },
  'Colombia': { instrument: 'Cumbia Accordion & Maracas', regionalStyle: 'Caribe Cumbia', folkTradition: 'Hypnotic syncopated 2/4 rhythm with breezy tropical accordion' },
  'Peru': { instrument: 'Andean Zampoña Pan Flute', regionalStyle: 'El Cóndor Pasa', folkTradition: 'Breathy multi-pipe pan flute soaring over sacred Incan ridges' },

  // Asia & Oceania
  'Japan': { instrument: 'Traditional Koto & Shakuhachi', regionalStyle: 'Sakura Pentatonic', folkTradition: 'Plucked 13-string zither with bamboo flute vibrato in In-sen scale' },
  'China': { instrument: 'Guzheng & Erhu Fiddle', regionalStyle: 'Dragon Mountain Pentatonic', folkTradition: 'Cascading harp glissandi and weeping two-string bow melody' },
  'India': { instrument: 'Classical Sitar & Tabla', regionalStyle: 'Raga Bhupali', folkTradition: 'Bending sympathetic drone with lightning-fast fingerboard meend' },
  'South Korea': { instrument: 'Gayageum & Buk Drum', regionalStyle: 'Arirang Folk Phrasing', folkTradition: 'Silk-string zither pitch-bending with rhythmic barrel drum accents' },
  'Vietnam': { instrument: 'Dan Tranh & Bamboo Flute', regionalStyle: 'Lotus River Melodies', folkTradition: 'Ornamented 16-string zither gliding gracefully over gentle waters' },
  'Thailand': { instrument: 'Ranat Ek Xylophone & Piphat', regionalStyle: 'Siam Royal Court', folkTradition: 'High-speed curved boat-xylophone with exotic royal court scales' },
  'Indonesia': { instrument: 'Javanese Gamelan Gong', regionalStyle: 'Slendro Royal Bells', folkTradition: 'Deep bronze kettle gongs and tuned metallophones in cyclic trance' },
  'Philippines': { instrument: 'Kulintang Gong & Rondalla', regionalStyle: 'Island Fiesta String Band', folkTradition: 'Melodic pot gongs and Spanish-influenced plucked bandurrias' },
  'Australia': { instrument: 'Yidaki Didgeridoo & Clapping Sticks', regionalStyle: 'Outback Dreamtime', folkTradition: 'Vibrating subterranean guttural drone with boomerang click' },
  'New Zealand': { instrument: 'Koauau Bone Flute & Pukaea Horn', regionalStyle: 'Maori Haka Resonance', folkTradition: 'Rhythmic breathy chanting horn resonant of tribal ancestral land' },
  'Singapore': { instrument: 'Guzheng & Festive Bells', regionalStyle: 'Lion City Straits Harmony', folkTradition: 'Melodic Chinese zither runs blended with festive Peranakan chime chimes' },
  'Mongolia': { instrument: 'Morin Khuur & Khoomei Overtone', regionalStyle: 'Steppe Throat Singing', folkTradition: 'Resonant horsehead fiddle melodies riding over deep nomad vocal overtones' },
  'Kazakhstan': { instrument: 'Kazakh Dombra Lute', regionalStyle: 'Steppe Horse Gallop Kui', folkTradition: 'Two-stringed fretted wooden lute strummed in lightning-fast horse-gallop tempo' },

  // The Caribbean
  'Jamaica': { instrument: 'Island Steel Pan & Sub Bass', regionalStyle: 'Roots Reggae Skank', folkTradition: 'Bright Caribbean steel pans syncopated over deep dub roots sub-bass' },

  // Middle East & Africa
  'Turkey': { instrument: 'Baglama Saz & Ney Flute', regionalStyle: 'Anatolian Makam', folkTradition: 'Long-necked lute quarter-tone phrasing and mystical reed flute' },
  'Saudi Arabia': { instrument: 'Oud Lute & Desert Darbuka', regionalStyle: 'Arabian Khaleeji', folkTradition: 'Pear-shaped fretless lute weaving rich modal Hijaz phrases' },
  'Israel': { instrument: 'Klezmer Clarinet & Accordion', regionalStyle: 'Hora Celebration', folkTradition: 'Laughing and crying clarinet ornamentation in joyful circle dance' },
  'Egypt': { instrument: 'Nile Nay & Riq Tambourine', regionalStyle: 'Pharaonic Baladi', folkTradition: 'Hypnotic breathy cane flute over crisp jingle tambourine accents' },
  'South Africa': { instrument: 'Kalimba Mbira & Djembe Drum', regionalStyle: 'Township Mbaqanga', folkTradition: 'Prismatic steel-tine thumb piano melodies over driving bass beats' },
  'Czech Republic': { instrument: 'Bohemian Clarinet & Polka Brass', regionalStyle: 'Prague Brass', folkTradition: 'Rustic woodwind runs and rich Bohemian beer-hall brass' },
};

class CountryballAudioEngine {
  private ctx: AudioContext | null = null;
  private currentStopFn: (() => void) | null = null;
  private activePlayingCountry: string | null = null;
  private isHoverSoundEnabled: boolean = true;
  private lastTriggerTime: number = 0;
  private listeners: Set<(activeCountry: string | null) => void> = new Set();

  constructor() {
    // Check saved preference
    try {
      const saved = localStorage.getItem('cb_hover_sounds');
      if (saved !== null) {
        this.isHoverSoundEnabled = saved === 'true';
      }
    } catch {
      // ignore
    }
  }

  public getIsHoverSoundEnabled(): boolean {
    return this.isHoverSoundEnabled;
  }

  public setHoverSoundEnabled(enabled: boolean) {
    this.isHoverSoundEnabled = enabled;
    try {
      localStorage.setItem('cb_hover_sounds', String(enabled));
    } catch {
      // ignore
    }
    if (!enabled) {
      this.stop();
    }
  }

  public toggleHoverSound(): boolean {
    this.setHoverSoundEnabled(!this.isHoverSoundEnabled);
    return this.isHoverSoundEnabled;
  }

  public subscribe(fn: (activeCountry: string | null) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify(country: string | null) {
    this.activePlayingCountry = country;
    this.listeners.forEach(fn => fn(country));
  }

  private initCtx(): AudioContext | null {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public stop() {
    if (this.currentStopFn) {
      this.currentStopFn();
      this.currentStopFn = null;
    }
    this.notify(null);
  }

  /**
   * Play the signature folk instrument motif for a Countryball on hover.
   */
  public playMotif(countryName: string, isClick = false) {
    // If hover sound is disabled and this is a hover event, ignore
    if (!isClick && !this.isHoverSoundEnabled) {
      return;
    }

    // Debounce hover triggers within 120ms to avoid audio pile-up while scrubbing
    const now = performance.now();
    if (!isClick && now - this.lastTriggerTime < 100) {
      return;
    }
    this.lastTriggerTime = now;

    const ctx = this.initCtx();
    if (!ctx) return;

    // Stop currently playing motif
    this.stop();

    const t0 = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(0.35, t0);
    master.connect(ctx.destination);

    const activeNodes: (AudioNode & { stop?: (when?: number) => void })[] = [];

    const register = <T extends AudioNode>(node: T): T => {
      activeNodes.push(node as any);
      return node;
    };

    // Helper: Play a plucked string (Koto, Balalaika, Sitar, Guitar)
    const playPluck = (freq: number, start: number, dur = 0.4, type: OscillatorType = 'triangle', filterFreq = 2200) => {
      const osc = register(ctx.createOscillator());
      const gain = register(ctx.createGain());
      const filter = register(ctx.createBiquadFilter());

      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(filterFreq, start);
      filter.frequency.exponentialRampToValueAtTime(300, start + dur);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.4, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(start);
      osc.stop(start + dur + 0.05);
    };

    // Helper: Play accordion / reed tone
    const playReed = (freq: number, start: number, dur = 0.5, vibratoDepth = 3) => {
      const osc1 = register(ctx.createOscillator());
      const osc2 = register(ctx.createOscillator());
      const gain = register(ctx.createGain());
      const filter = register(ctx.createBiquadFilter());

      // Twin detuned reeds (classic musette / polka accordion)
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 1.008, start); // subtle chorus detune

      // Vibrato
      if (vibratoDepth > 0) {
        const lfo = register(ctx.createOscillator());
        const lfoGain = register(ctx.createGain());
        lfo.frequency.setValueAtTime(5.5, start);
        lfoGain.gain.setValueAtTime(vibratoDepth, start);
        lfo.connect(lfoGain);
        lfoGain.connect(osc1.frequency);
        lfoGain.connect(osc2.frequency);
        lfo.start(start);
        lfo.stop(start + dur + 0.05);
      }

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.5, start);
      filter.frequency.setValueAtTime(1200, start);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.22, start + 0.03);
      gain.gain.setValueAtTime(0.2, start + dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + dur + 0.05);
      osc2.stop(start + dur + 0.05);
    };

    // Helper: Brass Fanfare / Horn
    const playBrass = (freq: number, start: number, dur = 0.45) => {
      const osc = register(ctx.createOscillator());
      const gain = register(ctx.createGain());
      const filter = register(ctx.createBiquadFilter());

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, start);

      filter.type = 'lowpass';
      filter.Q.setValueAtTime(4, start);
      filter.frequency.setValueAtTime(400, start);
      filter.frequency.exponentialRampToValueAtTime(2400, start + 0.08);
      filter.frequency.exponentialRampToValueAtTime(900, start + dur);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.3, start + 0.03);
      gain.gain.setValueAtTime(0.25, start + dur - 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(master);

      osc.start(start);
      osc.stop(start + dur + 0.05);
    };

    // Helper: Wooden flute / tin whistle / pan flute
    const playFlute = (freq: number, start: number, dur = 0.45, breath = true) => {
      const osc = register(ctx.createOscillator());
      const gain = register(ctx.createGain());

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      // Gentle pitch bend up
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, start + dur * 0.5);

      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.25, start + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc.connect(gain);
      gain.connect(master);

      osc.start(start);
      osc.stop(start + dur + 0.05);

      // Breath noise overlay
      if (breath) {
        const oscNoise = register(ctx.createOscillator());
        const noiseGain = register(ctx.createGain());
        oscNoise.type = 'triangle';
        oscNoise.frequency.setValueAtTime(freq * 2.8, start);
        noiseGain.gain.setValueAtTime(0.04, start);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, start + dur * 0.7);
        oscNoise.connect(noiseGain);
        noiseGain.connect(master);
        oscNoise.start(start);
        oscNoise.stop(start + dur);
      }
    };

    // Helper: Percussive Bell / Gamelan / Glockenspiel
    const playBell = (freq: number, start: number, dur = 0.8) => {
      const osc1 = register(ctx.createOscillator());
      const osc2 = register(ctx.createOscillator());
      const gain = register(ctx.createGain());

      osc1.type = 'sine';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(freq, start);
      osc2.frequency.setValueAtTime(freq * 2.76, start); // metallic inharmonic overtone

      gain.gain.setValueAtTime(0.3, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(master);

      osc1.start(start);
      osc2.start(start);
      osc1.stop(start + dur + 0.05);
      osc2.stop(start + dur + 0.05);
    };

    // Dispatch Regional Synthesized Motif
    const name = countryName.toLowerCase();

    if (name.includes('france')) {
      // Parisian Musette Waltz in 3/4
      [523.25, 659.25, 783.99, 659.25].forEach((f, i) => playReed(f, t0 + i * 0.16, 0.22, 4));
      playReed(1046.50, t0 + 0.65, 0.55, 6);
    } else if (name.includes('poland hussar')) {
      // Cavalry Charge Fanfare & Tuba March
      [261.63, 329.63, 392.00, 523.25].forEach((f, i) => playBrass(f, t0 + i * 0.12, 0.18));
      playBrass(659.25, t0 + 0.52, 0.5);
    } else if (name.includes('poland')) {
      // Upbeat Polka Accordion lilt
      [392.00, 493.88, 587.33, 783.99].forEach((f, i) => playReed(f, t0 + i * 0.13, 0.18, 3));
      playReed(659.25, t0 + 0.55, 0.4, 4);
    } else if (name.includes('usa')) {
      // Overdriven Blues-Rock Power Riff
      [220.00, 261.63, 293.66, 311.13, 329.63].forEach((f, i) => playPluck(f, t0 + i * 0.1, 0.25, 'sawtooth', 3500));
      playBrass(440, t0 + 0.55, 0.5);
    } else if (name.includes('texas')) {
      // Country Slide Guitar Twang
      const osc = register(ctx.createOscillator());
      const g = register(ctx.createGain());
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(293.66, t0); // D4
      osc.frequency.exponentialRampToValueAtTime(440, t0 + 0.25); // slide up to A4
      g.gain.setValueAtTime(0.35, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.7);
      osc.connect(g);
      g.connect(master);
      osc.start(t0);
      osc.stop(t0 + 0.75);
      playPluck(587.33, t0 + 0.35, 0.45, 'triangle', 2600);
    } else if (name.includes('uk')) {
      // Stately Westminster Chime + Royal Trumpet Fanfare
      playBell(523.25, t0, 0.6);
      playBell(659.25, t0 + 0.2, 0.6);
      [392, 523.25, 659.25, 783.99].forEach((f, i) => playBrass(f, t0 + 0.4 + i * 0.12, 0.25));
    } else if (name.includes('germany')) {
      // Bavarian Oompah Polka Brass
      playBrass(130.81, t0, 0.2); // Tuba low C
      playReed(523.25, t0 + 0.12, 0.15); // Oompah chord
      playBrass(196.00, t0 + 0.25, 0.2); // Tuba G
      playReed(587.33, t0 + 0.37, 0.15);
      playBrass(261.63, t0 + 0.5, 0.4);
    } else if (name.includes('russia')) {
      // Rapid Balalaika Tremolo Strum
      [440, 440, 493.88, 523.25, 493.88, 440, 392, 440].forEach((f, i) => playPluck(f, t0 + i * 0.08, 0.15, 'sawtooth', 3000));
      playPluck(329.63, t0 + 0.68, 0.5, 'triangle', 2200);
    } else if (name.includes('japan')) {
      // Traditional Koto Pentatonic Sakura Glissando
      [440.00, 466.16, 587.33, 659.25, 698.46, 880.00].forEach((f, i) => playPluck(f, t0 + i * 0.11, 0.4, 'triangle', 2800));
    } else if (name.includes('china')) {
      // Guzheng Pentatonic Waterfall Run
      [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50].forEach((f, i) => playPluck(f, t0 + i * 0.09, 0.45, 'sine', 3200));
    } else if (name.includes('mexico')) {
      // Mariachi Trumpet Duet & Guitarrón Strum
      playPluck(146.83, t0, 0.35, 'triangle', 1800); // Guitarrón bass
      [587.33, 739.99, 880.00, 1174.66].forEach((f, i) => playBrass(f, t0 + 0.1 + i * 0.11, 0.25));
    } else if (name.includes('italy')) {
      // Neapolitan Mandolin Tremolo
      [659.25, 659.25, 783.99, 783.99, 987.77, 880.00].forEach((f, i) => playPluck(f, t0 + i * 0.09, 0.2, 'sawtooth', 3600));
      playReed(523.25, t0 + 0.55, 0.45);
    } else if (name.includes('spain')) {
      // Flamenco Guitar Rasgueado Strum in Phrygian
      [329.63, 349.23, 392.00, 440.00, 329.63].forEach((f, i) => playPluck(f, t0 + i * 0.1, 0.3, 'sawtooth', 2900));
      playPluck(164.81, t0 + 0.52, 0.55, 'triangle', 1800);
    } else if (name.includes('brazil')) {
      // Samba Batucada Whistle & Percussion
      [880, 1174.66, 880, 1318.51].forEach((f, i) => playFlute(f, t0 + i * 0.12, 0.12, false));
      playPluck(110, t0 + 0.5, 0.45, 'sawtooth', 2000);
    } else if (name.includes('canada')) {
      // Canadian Lumberjack Fiddle Jig
      [440, 554.37, 659.25, 880, 659.25].forEach((f, i) => playPluck(f, t0 + i * 0.11, 0.2, 'sawtooth', 3200));
      playFlute(880, t0 + 0.56, 0.4);
    } else if (name.includes('india')) {
      // Sitar Sympathetic Meend Glide
      const sitar = register(ctx.createOscillator());
      const g = register(ctx.createGain());
      sitar.type = 'sawtooth';
      sitar.frequency.setValueAtTime(293.66, t0); // D4
      sitar.frequency.linearRampToValueAtTime(329.63, t0 + 0.2); // E4 meend bend
      sitar.frequency.exponentialRampToValueAtTime(440, t0 + 0.45); // A4
      g.gain.setValueAtTime(0.3, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.8);
      sitar.connect(g);
      g.connect(master);
      sitar.start(t0);
      sitar.stop(t0 + 0.85);
    } else if (name.includes('australia')) {
      // Outback Didgeridoo Subterranean Drone & Boomerang Swish
      const didg = register(ctx.createOscillator());
      const filter = register(ctx.createBiquadFilter());
      const g = register(ctx.createGain());
      didg.type = 'sawtooth';
      didg.frequency.setValueAtTime(65.41, t0); // C2
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(8, t0);
      filter.frequency.setValueAtTime(220, t0);
      filter.frequency.exponentialRampToValueAtTime(700, t0 + 0.35);
      filter.frequency.exponentialRampToValueAtTime(220, t0 + 0.7);
      g.gain.setValueAtTime(0.4, t0);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.85);
      didg.connect(filter);
      filter.connect(g);
      g.connect(master);
      didg.start(t0);
      didg.stop(t0 + 0.9);
    } else if (name.includes('greece')) {
      // Mediterranean Bouzouki Tremolo Run
      [587.33, 587.33, 659.25, 783.99, 880, 1046.50].forEach((f, i) => playPluck(f, t0 + i * 0.08, 0.18, 'sawtooth', 3400));
    } else if (name.includes('ireland')) {
      // Celtic Tin Whistle Jig
      [587.33, 659.25, 783.99, 880, 987.77, 1174.66].forEach((f, i) => playFlute(f, t0 + i * 0.09, 0.16));
    } else if (name.includes('vatican')) {
      // Gregorian Church Cathedral Organ Chords
      [261.63, 329.63, 392.00, 523.25].forEach(f => playReed(f, t0, 0.95, 0));
    } else if (name.includes('switzerland')) {
      // Alpine Horn Echo & Bell
      playBrass(196, t0, 0.35);
      playBrass(293.66, t0 + 0.3, 0.35);
      playBell(880, t0 + 0.55, 0.7);
    } else if (name.includes('sweden') || name.includes('norway') || name.includes('finland') || name.includes('denmark') || name.includes('iceland')) {
      // Nordic Forest Folk Flute & Bell
      [587.33, 659.25, 783.99, 1046.50].forEach((f, i) => playFlute(f, t0 + i * 0.12, 0.25));
      playBell(1318.51, t0 + 0.5, 0.65);
    } else if (name.includes('indonesia') || name.includes('thailand') || name.includes('vietnam') || name.includes('philippines')) {
      // Gamelan & Slendro Bronze Bell Chimes
      [523.25, 587.33, 698.46, 783.99, 932.33].forEach((f, i) => playBell(f, t0 + i * 0.12, 0.75));
    } else if (name.includes('south africa')) {
      // Kalimba / Mbira Thumb Piano Cycling Arpeggio
      [392, 523.25, 659.25, 783.99, 987.77, 1174.66].forEach((f, i) => playPluck(f, t0 + i * 0.09, 0.35, 'sine', 3800));
    } else if (name.includes('peru') || name.includes('chile') || name.includes('colombia') || name.includes('argentina')) {
      // Andean Pan Flute / Siku
      [440, 523.25, 659.25, 880, 1046.50].forEach((f, i) => playFlute(f, t0 + i * 0.11, 0.35, true));
    } else if (name.includes('singapore')) {
      // Singapore Guzheng Pentatonic Flourish & Straits Chimes
      [523.25, 587.33, 659.25, 783.99, 1046.50].forEach((f, i) => playPluck(f, t0 + i * 0.08, 0.35, 'triangle', 3600));
      playBell(1318.51, t0 + 0.42, 0.7);
    } else if (name.includes('jamaica')) {
      // Caribbean Steel Pan Drum & Reggae Roots Sub
      [587.33, 739.99, 880, 1174.66].forEach((f, i) => playBell(f, t0 + i * 0.1, 0.45));
      playPluck(98, t0 + 0.42, 0.5, 'triangle', 800);
    } else if (name.includes('kazakhstan')) {
      // Kazakh Dombra Lute Galloping Kui
      [293.66, 440, 293.66, 440, 587.33, 440].forEach((f, i) => playPluck(f, t0 + i * 0.07, 0.22, 'sawtooth', 3100));
    } else if (name.includes('mongolia')) {
      // Morin Khuur Horsehead Fiddle & Steppe Throat Drone
      const drone = register(ctx.createOscillator());
      const droneGain = register(ctx.createGain());
      drone.type = 'sawtooth';
      drone.frequency.setValueAtTime(110, t0); // A2 low throat drone
      droneGain.gain.setValueAtTime(0.3, t0);
      droneGain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.95);
      drone.connect(droneGain);
      droneGain.connect(master);
      drone.start(t0);
      drone.stop(t0 + 1.0);
      [440, 554.37, 659.25, 880].forEach((f, i) => playPluck(f, t0 + 0.15 + i * 0.1, 0.25, 'sawtooth', 2400));
    } else if (name.includes('czech')) {
      // Bohemian Clarinet & Polka Brass Lilt
      [349.23, 440.00, 523.25, 698.46].forEach((f, i) => playReed(f, t0 + i * 0.1, 0.22));
      playBrass(174.61, t0 + 0.42, 0.45);
    } else {
      // Generic Celebratory European / World Folk Flourish
      [440, 554.37, 659.25, 880].forEach((f, i) => playFlute(f, t0 + i * 0.1, 0.25));
      playBell(880, t0 + 0.45, 0.6);
    }

    this.notify(countryName);

    // Auto-reset active country state after motif completes
    const timer = setTimeout(() => {
      if (this.activePlayingCountry === countryName) {
        this.notify(null);
      }
    }, 1200);

    this.currentStopFn = () => {
      clearTimeout(timer);
      activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          node.disconnect();
        } catch {
          // ignore
        }
      });
      master.disconnect();
    };
  }
}

export const countryballAudio = new CountryballAudioEngine();
