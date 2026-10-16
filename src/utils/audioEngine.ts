import { MusicTrack, NOTE_FREQS, SONGS_PLAYLIST } from './musicTracks';

type PlaybackListener = (isPlaying: boolean) => void;
type TrackListener = (track: MusicTrack) => void;

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  
  private currentTrack: MusicTrack = SONGS_PLAYLIST[0];
  private isPlaying: boolean = false;
  private volume: number = 0.6; // 0 to 1
  private isMuted: boolean = false;
  private isLooping: boolean = true;
  private isShuffle: boolean = false;

  private stepIndex: number = 0;
  private timerId: number | null = null;
  private listeners: {
    playState: Set<PlaybackListener>;
    trackChange: Set<TrackListener>;
  } = {
    playState: new Set(),
    trackChange: new Set(),
  };

  constructor() {
    // Lazy AudioContext initialization on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(e => console.log('AudioContext resume failed:', e));
    }
  }

  public getTrack(): MusicTrack {
    return this.currentTrack;
  }

  public getPlaylist(): MusicTrack[] {
    return SONGS_PLAYLIST;
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public getVolume(): number {
    return this.volume;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsLooping(): boolean {
    return this.isLooping;
  }

  public getIsShuffle(): boolean {
    return this.isShuffle;
  }

  public setLooping(loop: boolean) {
    this.isLooping = loop;
  }

  public setShuffle(shuffle: boolean) {
    this.isShuffle = shuffle;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.volume, this.ctx.currentTime + 0.05);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        this.isMuted ? 0 : this.volume,
        this.ctx.currentTime + 0.05
      );
    }
    return this.isMuted;
  }

  public playTrack(track: MusicTrack) {
    this.currentTrack = track;
    this.stepIndex = 0;
    this.listeners.trackChange.forEach(fn => fn(track));
    if (!this.isPlaying) {
      this.play();
    } else {
      // Already playing, reset tick schedule
      this.stopTimer();
      this.scheduleLoop();
    }
  }

  public play() {
    this.initContext();
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.listeners.playState.forEach(fn => fn(true));
    this.scheduleLoop();
  }

  public pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    this.stopTimer();
    this.listeners.playState.forEach(fn => fn(false));
  }

  public togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  public nextTrack() {
    let nextIndex = 0;
    const currentIndex = SONGS_PLAYLIST.findIndex(t => t.id === this.currentTrack.id);
    if (this.isShuffle) {
      nextIndex = Math.floor(Math.random() * SONGS_PLAYLIST.length);
      if (nextIndex === currentIndex && SONGS_PLAYLIST.length > 1) {
        nextIndex = (nextIndex + 1) % SONGS_PLAYLIST.length;
      }
    } else {
      nextIndex = (currentIndex + 1) % SONGS_PLAYLIST.length;
    }
    this.playTrack(SONGS_PLAYLIST[nextIndex]);
  }

  public prevTrack() {
    const currentIndex = SONGS_PLAYLIST.findIndex(t => t.id === this.currentTrack.id);
    const prevIndex = (currentIndex - 1 + SONGS_PLAYLIST.length) % SONGS_PLAYLIST.length;
    this.playTrack(SONGS_PLAYLIST[prevIndex]);
  }

  // Visualizer audio frequency levels (0 - 100)
  public getVisualizerData(): number[] {
    if (!this.analyser || !this.isPlaying || this.isMuted) {
      return [0, 0, 0, 0, 0, 0, 0, 0];
    }
    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    this.analyser.getByteFrequencyData(dataArray);

    // Sample 8 distinct frequency buckets from bass to highs
    const barsCount = 8;
    const result: number[] = [];
    const step = Math.max(1, Math.floor(bufferLength / barsCount));
    for (let i = 0; i < barsCount; i++) {
      const val = dataArray[i * step] || 0;
      result.push(Math.round((val / 255) * 100));
    }
    return result;
  }

  private stopTimer() {
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  private scheduleLoop() {
    if (!this.isPlaying) return;

    // 1 step = 1 sixteenth / eighth note depending on BPM
    // Let 4 steps = 1 beat -> stepDuration in ms = (60,000 / BPM) / 2
    const stepDurationMs = Math.max(80, (60000 / this.currentTrack.bpm) / 2);

    this.playCurrentStep();

    this.timerId = window.setTimeout(() => {
      const maxSteps = this.currentTrack.patterns.lead.length;
      this.stepIndex = (this.stepIndex + 1) % maxSteps;

      if (this.stepIndex === 0 && !this.isLooping) {
        // finished track without loop
        this.nextTrack();
      } else {
        this.scheduleLoop();
      }
    }, stepDurationMs);
  }

  private playCurrentStep() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const pat = this.currentTrack.patterns;
    const idx = this.stepIndex;

    // 1. LEAD SYNTH
    const leadNote = pat.lead[idx];
    if (leadNote && NOTE_FREQS[leadNote]) {
      this.triggerLeadSynth(NOTE_FREQS[leadNote], now);
    }

    // 2. CHORD VOICES
    const chordNotes = pat.chords[idx];
    if (chordNotes && Array.isArray(chordNotes)) {
      chordNotes.forEach(noteName => {
        if (NOTE_FREQS[noteName]) {
          this.triggerPadSynth(NOTE_FREQS[noteName], now);
        }
      });
    }

    // 3. BASS SYNTH
    const bassNote = pat.bass[idx];
    if (bassNote && NOTE_FREQS[bassNote]) {
      this.triggerBassSynth(NOTE_FREQS[bassNote], now);
    }

    // 4. DRUMS
    if (pat.drums) {
      const drumHit = pat.drums[idx];
      if (drumHit === 'K') {
        this.triggerKickDrum(now);
      } else if (drumHit === 'S') {
        this.triggerSnareDrum(now);
      } else if (drumHit === 'H') {
        this.triggerHiHat(now);
      }
    }
  }

  // --- SYNTH VOICE GENERATORS ---

  private triggerLeadSynth(freq: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Waveform depends on track style
    if (this.currentTrack.id === 'pigstep_groove' || this.currentTrack.id === 'cat_playful') {
      osc.type = 'square';
      filter.frequency.setValueAtTime(1400, time);
    } else if (this.currentTrack.id === 'countryballs_march') {
      osc.type = 'sawtooth';
      filter.frequency.setValueAtTime(2200, time);
    } else if (this.currentTrack.id === 'sprunki_beatbox') {
      osc.type = 'triangle';
      filter.frequency.setValueAtTime(1800, time);
    } else {
      // C418 style mellow sine/triangle piano bell
      osc.type = 'sine';
      filter.frequency.setValueAtTime(1200, time);
    }

    osc.frequency.setValueAtTime(freq, time);

    // Warm envelope
    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.18, time + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.36);
  }

  private triggerPadSynth(freq: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0, time);
    gain.gain.linearRampToValueAtTime(0.09, time + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.45);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.46);
  }

  private triggerBassSynth(freq: number, time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, time);

    gain.gain.setValueAtTime(0.2, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.31);
  }

  private triggerKickDrum(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.15);

    gain.gain.setValueAtTime(0.35, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(time);
    osc.stop(time + 0.16);
  }

  private triggerSnareDrum(time: number) {
    if (!this.ctx || !this.masterGain) return;
    // Noise buffer for snappy snare
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(1000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.11);
  }

  private triggerHiHat(time: number) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * 0.04;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(5000, time);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(time);
    noise.stop(time + 0.05);
  }

  // ==========================================================
  // MINECRAFT PROCEDURAL SOUND EFFECTS & MOB VOCAL SYNTHESIS
  // ==========================================================
  public playMinecraftSound(rawNameOrType: string) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const type = rawNameOrType.toLowerCase();

    if (type.includes('creeper') || type.includes('fuse') || type.includes('tssss')) {
      // Authentic Creeper Hiss (White noise through modulated bandpass) + Explosion Pop
      const bufferSize = this.ctx.sampleRate * 0.7;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.65);
      filter.Q.setValueAtTime(3.5, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.72);

      // Low explosion thud at end
      const boom = this.ctx.createOscillator();
      const boomGain = this.ctx.createGain();
      boom.type = 'sine';
      boom.frequency.setValueAtTime(95, now + 0.55);
      boom.frequency.exponentialRampToValueAtTime(30, now + 0.85);
      boomGain.gain.setValueAtTime(0.35, now + 0.55);
      boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      boom.connect(boomGain);
      boomGain.connect(this.masterGain);
      boom.start(now + 0.55);
      boom.stop(now + 0.86);
    }
    else if (type.includes('enderman') || type.includes('teleport') || type.includes('vwoop')) {
      // Eerie dimensional warp: dual detuned sines + frequency ramp with high resonance
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc2.type = 'sine';
      osc1.frequency.setValueAtTime(180, now);
      osc1.frequency.exponentialRampToValueAtTime(980, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(220, now + 0.45);

      osc2.frequency.setValueAtTime(185, now);
      osc2.frequency.exponentialRampToValueAtTime(990, now + 0.18);
      osc2.frequency.exponentialRampToValueAtTime(215, now + 0.45);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.46);
      osc2.stop(now + 0.46);
    }
    else if (type.includes('villager') || type.includes('hrmm') || type.includes('trade')) {
      // Iconic Minecraft Villager "HRRMMM" Formant vocal synthesis
      const fund = this.ctx.createOscillator();
      fund.type = 'sawtooth';
      fund.frequency.setValueAtTime(145, now);
      fund.frequency.exponentialRampToValueAtTime(125, now + 0.28);
      fund.frequency.linearRampToValueAtTime(135, now + 0.4);

      // Dual vocal formants simulating nasal cavity
      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(550, now);
      f1.Q.setValueAtTime(4.0, now);

      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1400, now);
      f2.Q.setValueAtTime(5.0, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

      fund.connect(f1);
      fund.connect(f2);
      f1.connect(gain);
      f2.connect(gain);
      gain.connect(this.masterGain);

      fund.start(now);
      fund.stop(now + 0.43);
    }
    else if (type.includes('zombie') || type.includes('drowned')) {
      // Throaty low pitch-drop moan "Uuuugh"
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(115, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.48);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.26, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.51);
    }
    else if (type.includes('skeleton') || type.includes('wither')) {
      // Rattling bone clicks + string twang
      [0, 0.05, 0.1, 0.16].forEach((offset, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400 - idx * 250, now + offset);
        gain.gain.setValueAtTime(0.2, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + offset);
        osc.stop(now + offset + 0.05);
      });
    }
    else if (type.includes('steve') || type.includes('oof') || type.includes('alex') || type.includes('hurt')) {
      // Classic Minecraft Beta "OOF!" voice
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(900, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.19);
    }
    else if (type.includes('mine') || type.includes('pickaxe')) {
      // Stone hit + mineral crystal chime
      const noise = this.ctx.createBufferSource();
      const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.08), this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;
      const nGain = this.ctx.createGain();
      nGain.gain.setValueAtTime(0.22, now);
      nGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      noise.connect(nGain);
      nGain.connect(this.masterGain);
      noise.start(now);
      noise.stop(now + 0.08);

      // High diamond crystal chime
      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1864, now);
      chime.frequency.exponentialRampToValueAtTime(2489, now + 0.12);
      cGain.gain.setValueAtTime(0.18, now);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      chime.connect(cGain);
      cGain.connect(this.masterGain);
      chime.start(now);
      chime.stop(now + 0.21);
    }
    else if (type.includes('sword') || type.includes('crit') || type.includes('attack') || type.includes('netherite') || type.includes('diamond')) {
      // Sharp metallic sword slash + critical strike chime
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(280, now + 0.14);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.16);

      // Crit bell
      const bell = this.ctx.createOscillator();
      const bGain = this.ctx.createGain();
      bell.type = 'sine';
      bell.frequency.setValueAtTime(2093, now + 0.02);
      bGain.gain.setValueAtTime(0.15, now + 0.02);
      bGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      bell.connect(bGain);
      bGain.connect(this.masterGain);
      bell.start(now + 0.02);
      bell.stop(now + 0.26);
    }
    else if (type.includes('level') || type.includes('fanfare') || type.includes('xp')) {
      // Classic rising Minecraft XP level-up orb fanfare
      const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.055;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.15);
      });
    }
    else if (type.includes('warden')) {
      // Terrifying sub-bass pulse & echoing soul scream
      const sub = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      sub.type = 'sawtooth';
      sub.frequency.setValueAtTime(65, now);
      sub.frequency.exponentialRampToValueAtTime(32, now + 0.6);
      sGain.gain.setValueAtTime(0.35, now);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);
      sub.connect(sGain);
      sGain.connect(this.masterGain);
      sub.start(now);
      sub.stop(now + 0.66);
    }
    else if (type.includes('iron_golem') || type.includes('golem')) {
      // Heavy iron thud + delicate music box chime (the red rose)
      const thud = this.ctx.createOscillator();
      const tGain = this.ctx.createGain();
      thud.type = 'triangle';
      thud.frequency.setValueAtTime(80, now);
      thud.frequency.exponentialRampToValueAtTime(40, now + 0.25);
      tGain.gain.setValueAtTime(0.3, now);
      tGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      thud.connect(tGain);
      tGain.connect(this.masterGain);
      thud.start(now);
      thud.stop(now + 0.3);

      const chime = this.ctx.createOscillator();
      const cGain = this.ctx.createGain();
      chime.type = 'sine';
      chime.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      cGain.gain.setValueAtTime(0.18, now + 0.08);
      cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
      chime.connect(cGain);
      cGain.connect(this.masterGain);
      chime.start(now + 0.08);
      chime.stop(now + 0.41);
    }
    else if (type.includes('pig')) {
      // Cute squeaky pig snort
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.linearRampToValueAtTime(260, now + 0.1);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.18);
    }
    else if (type.includes('wolf')) {
      // Cheerful dog bark
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.15);
    }
    else if (type.includes('totem') || type.includes('herobrine')) {
      // Glorious angelic resurrection chord shimmer
      [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);
        gain.gain.setValueAtTime(0.18, now + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.6);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(now + idx * 0.04);
        osc.stop(now + idx * 0.04 + 0.65);
      });
    }
    else {
      // Default Minecraft Click / Wood Pop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  }

  // ==========================================================
  // SPRUNKI PROCEDURAL SOUNDS & INCREDIBOX BEATBOX SYNTHESIS
  // ==========================================================
  public playSprunkiSound(rawName: string, isHorror: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const name = rawName.toLowerCase();

    if (isHorror || name.includes('horror') || (name.includes('simon') && name.includes('phase 2'))) {
      // Phase 2 Cursed Void Glitch & Dark Bass Screech
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const dist = this.ctx.createWaveShaper();

      // Dissonant Tritone & Pitch Glide Down
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(311.13, now); // Eb4
      osc1.frequency.exponentialRampToValueAtTime(75, now + 0.45);

      osc2.type = 'square';
      osc2.frequency.setValueAtTime(440, now); // A4 (tritone!)
      osc2.frequency.exponentialRampToValueAtTime(110, now + 0.45);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(55, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc1.connect(gain);
      osc2.connect(gain);
      sub.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      sub.start(now);
      osc1.stop(now + 0.55);
      osc2.stop(now + 0.55);
      sub.stop(now + 0.55);
      return;
    }

    if (name.includes('oren') || name.includes('orange')) {
      // Oren: Crisp Hip-Hop Kick + Snare Beatbox
      this.triggerKickDrum(now);
      this.triggerHiHat(now + 0.1);
      this.triggerSnareDrum(now + 0.2);
      this.triggerHiHat(now + 0.3);
    } else if (name.includes('raddy') || name.includes('red')) {
      // Raddy: Heavy Aggressive 808 Bass Drop
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.35);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.28, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (name.includes('vineria') || name.includes('green')) {
      // Vineria: Gentle Nature Chime Triad
      const notes = [659.25, 830.61, 987.77, 1318.51]; // E5, G#5, B5, E6
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.07;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.42);
      });
    } else if (name.includes('fun') || name.includes('bot')) {
      // Fun Bot: Fast Retro 8-Bit Chiptune Synth Run
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const t = now + idx * 0.045;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.1, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.09);
      });
    } else if (name.includes('gray') || name.includes('grey')) {
      // Gray: Cozy Lofi Minor 7th Rhodes Chord
      [220, 261.63, 329.63, 392].forEach(freq => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        g.gain.setValueAtTime(0.08, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(now);
        osc.stop(now + 0.6);
      });
    } else if (name.includes('garnold') || name.includes('gold')) {
      // Garnold: Funky Resonant Wah-Wah Synth
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now);

      filter.type = 'bandpass';
      filter.Q.setValueAtTime(6, now);
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(1800, now + 0.15);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.35);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (name.includes('durple') || name.includes('purple')) {
      // Durple: Deep Vowel Monster Chant "Dur-ple"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(98, now);
      osc.frequency.setValueAtTime(146.83, now + 0.12);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.4);
    } else if (name.includes('sky') || name.includes('cyan')) {
      // Sky: Ethereal Angelic Bell Shimmer
      [1046.50, 1318.51, 1567.98].forEach((freq, i) => {
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);
        g.gain.setValueAtTime(0.09, now + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.6);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.65);
      });
    } else if (name.includes('simon')) {
      // Simon: Cheerful Whistling Flute Melody (Melody 4)
      const whistleNotes = [587.33, 659.25, 880.00, 783.99]; // D5, E5, A5, G5
      whistleNotes.forEach((freq, idx) => {
        const t = now + idx * 0.08;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.02, t + 0.05);
        osc.frequency.linearRampToValueAtTime(freq, t + 0.1);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.18, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.25);
      });
    } else if (name.includes('tunner')) {
      // Tunner: Jazz Upright Bass Pluck + Finger Snap
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(73.42, now); // D2
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.35);

      this.triggerHiHat(now + 0.18);
    } else if (name.includes('sun')) {
      // Mr. Sun: Upbeat Tropical Steel Drum
      [587.33, 739.99, 880].forEach((freq, idx) => {
        const t = now + idx * 0.08;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.28);
      });
    } else if (name.includes('tree')) {
      // Mr. Tree: Deep Hollow Wooden Marimba
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(65.41, now); // C2
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (name.includes('wenda')) {
      // Wenda: High-Pitched Playful Cat Vocal Trill "Mew-wop!"
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(700, now + 0.25);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.32);
    } else if (name.includes('pinki')) {
      // Pinki: Sparkly Bubblegum Pop Stab
      [880, 1108.73, 1318.51, 1760].forEach((freq, idx) => {
        const t = now + idx * 0.03;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.12, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    } else if (name.includes('jevin')) {
      // Jevin: Slime Bubble-Drop Water Percussion
      [350, 480, 620].forEach((f, i) => {
        const t = now + i * 0.09;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, t);
        osc.frequency.exponentialRampToValueAtTime(f * 2.2, t + 0.06);
        g.gain.setValueAtTime(0.14, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.1);
      });
    } else if (name.includes('black')) {
      // Black: Cosmic Sub-Bass Drone
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.65);
    } else if (name.includes('verity')) {
      // Verity: Crystalline Celestial Truth Chimes & Ascending Harmonic Glass Pad
      const freqs = [659.25, 783.99, 987.77, 1318.51, 1567.98, 1975.53]; // E5, G5, B5, E6, G6, B6
      freqs.forEach((freq, idx) => {
        const t = now + idx * 0.055;
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.linearRampToValueAtTime(freq * 1.01, t + 0.3);
        gain.gain.setValueAtTime(0.18, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55);
        osc.connect(gain);
        gain.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.58);
      });
      // Glass shimmer resonance
      const shimmer = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();
      shimmer.type = 'triangle';
      shimmer.frequency.setValueAtTime(2637.02, now + 0.1); // E7
      sGain.gain.setValueAtTime(0.12, now + 0.1);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      shimmer.connect(sGain);
      sGain.connect(this.masterGain);
      shimmer.start(now + 0.1);
      shimmer.stop(now + 0.82);
    } else if (name.includes('clukr')) {
      // Clukr: Rapid Eccentric Chiptune Beatbox & Wacky Chicken Pop
      [784, 988, 1175, 1568].forEach((freq, idx) => {
        const t = now + idx * 0.04;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, t + 0.05);
        g.gain.setValueAtTime(0.13, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.07);
      });
      this.triggerHiHat(now + 0.16);
    } else if (name.includes('owakcx')) {
      // OWAKCX: Playful Jester Spring Boing + Carnival Accordion Stab
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.3);
      g.gain.setValueAtTime(0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.38);
    } else if (name.includes('brud')) {
      // Brud: Cozy Sleepy Sub Bass Yawn + Warm Lo-Fi Resonance
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
      osc.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (name.includes('garnold_vip') || name.includes('vip')) {
      // Garnold VIP: Holographic Vinyl Scratch + Prism Electro Clav
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(8, now);
      filter.frequency.setValueAtTime(1200, now);
      g.gain.setValueAtTime(0.22, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(filter);
      filter.connect(g);
      g.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (name.includes('computer')) {
      // Mr. Fun Computer: CRT Retro 8-bit Noise Glitch Run
      [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const t = now + idx * 0.035;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.09, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.05);
      });
    } else if (name.includes('blossom')) {
      // Vineria Blossom: Celestial Ethereal Harp Cascade
      [523.25, 659.25, 783.99, 987.77, 1174.66, 1318.51, 1567.98].forEach((freq, idx) => {
        const t = now + idx * 0.055;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        g.gain.setValueAtTime(0.11, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.55);
      });
    } else if (name.includes('neko')) {
      // Wenda Neko Master: High Energy Kawaii Synth Chirp
      [698.46, 880, 1046.50, 1396.91].forEach((freq, idx) => {
        const t = now + idx * 0.04;
        const osc = this.ctx!.createOscillator();
        const g = this.ctx!.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, t + 0.08);
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        osc.connect(g);
        g.connect(this.masterGain!);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    } else if (name.includes('void')) {
      // Black Void: Subterranean Corrupted Abyssal Pitch Drone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(55, now);
      osc1.frequency.exponentialRampToValueAtTime(25, now + 0.7);
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(58.27, now); // Detuned dissonant semitone
      osc2.frequency.exponentialRampToValueAtTime(28, now + 0.7);
      g.gain.setValueAtTime(0.25, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
      osc1.connect(g);
      osc2.connect(g);
      g.connect(this.masterGain);
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.8);
      osc2.stop(now + 0.8);
    } else {
      // Default Melodic Note
      this.triggerLeadSynth(523.25, now);
    }
  }

  // ==========================================================
  // INCREDIBOX SYNCHRONIZED MULTI-TRACK SPRUNKI JAM LOOP ENGINE
  // ==========================================================
  private jamInterval: number | null = null;
  private jamStep: number = 0;
  private jamCrew: { name: string; muted?: boolean }[] = [];
  private jamIsHorror: boolean = false;
  private jamBpm: number = 110;
  private jamStepListeners: Set<(step: number, bpm: number) => void> = new Set();

  public onJamStep(fn: (step: number, bpm: number) => void): () => void {
    this.jamStepListeners.add(fn);
    return () => this.jamStepListeners.delete(fn);
  }

  public isJamActive(): boolean {
    return this.jamInterval !== null;
  }

  public getJamStep(): number {
    return this.jamStep;
  }

  public startSprunkiJam(crew: { name: string; muted?: boolean }[], isHorror: boolean = false, bpm: number = 110) {
    this.stopSprunkiJam();
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.jamCrew = crew;
    this.jamIsHorror = isHorror;
    this.jamBpm = Math.max(70, Math.min(160, bpm));
    this.jamStep = 0;

    const stepMs = (60 / this.jamBpm / 4) * 1000; // 16th note step

    this.jamInterval = window.setInterval(() => {
      this.tickSprunkiJamStep();
    }, stepMs);
  }

  public updateSprunkiJamSettings(crew: { name: string; muted?: boolean }[], isHorror: boolean = false, bpm?: number) {
    this.jamCrew = crew;
    this.jamIsHorror = isHorror;
    if (bpm && bpm !== this.jamBpm) {
      this.startSprunkiJam(crew, isHorror, bpm);
    }
  }

  public stopSprunkiJam() {
    if (this.jamInterval !== null) {
      clearInterval(this.jamInterval);
      this.jamInterval = null;
    }
    this.jamStep = 0;
    this.jamStepListeners.forEach(fn => fn(-1, this.jamBpm));
  }

  private tickSprunkiJamStep() {
    if (!this.ctx || !this.masterGain) return;
    const step = this.jamStep % 16;
    const now = this.ctx.currentTime;

    // Trigger active unmuted crew members on their respective rhythmic grid steps
    this.jamCrew.forEach(member => {
      if (member.muted) return;
      const n = member.name.toLowerCase();

      // Oren: Kick on 0, 8; Snare on 4, 12; Hi-hats on evens
      if (n.includes('oren')) {
        if (step === 0 || step === 8) this.triggerKickDrum(now);
        if (step === 4 || step === 12) this.triggerSnareDrum(now);
        if (step % 2 === 0) this.triggerHiHat(now);
      }
      // Raddy: Heavy 808 sub hits on 0, 6, 10
      else if (n.includes('raddy')) {
        if (step === 0 || step === 6 || step === 10) {
          this.playSprunkiSound('raddy', this.jamIsHorror);
        }
      }
      // Vineria / Blossom: Chimes on 0, 4, 8, 12
      else if (n.includes('vineria') || n.includes('blossom')) {
        if (step % 4 === 0) {
          this.playSprunkiSound(member.name, this.jamIsHorror);
        }
      }
      // Fun Bot / Computer: 16th chiptune arpeggios on steps 2, 6, 10, 14
      else if (n.includes('fun') || n.includes('bot') || n.includes('computer')) {
        if (step % 2 === 1) {
          const notes = [523.25, 659.25, 783.99, 1046.50];
          const freq = notes[Math.floor(step / 2) % notes.length];
          this.triggerLeadSynth(freq, now);
        }
      }
      // Gray / Brud: Chords/Pads on 0 and 8
      else if (n.includes('gray') || n.includes('brud')) {
        if (step === 0 || step === 8) {
          this.playSprunkiSound(member.name, this.jamIsHorror);
        }
      }
      // Garnold / Tunner: Groove baseline / scratches on 3, 7, 11, 15
      else if (n.includes('garnold') || n.includes('tunner')) {
        if (step === 2 || step === 7 || step === 11) {
          this.playSprunkiSound(member.name, this.jamIsHorror);
        }
      }
      // Pinki / Wenda / Neko: Pop vocal stabs on 2, 8, 14
      else if (n.includes('pinki') || n.includes('wenda') || n.includes('neko')) {
        if (step === 4 || step === 12) {
          this.playSprunkiSound(member.name, this.jamIsHorror);
        }
      }
      // Jevin / Clukr / OWAKCX: Quirky percussion on odd steps
      else if (n.includes('jevin') || n.includes('clukr') || n.includes('owakcx')) {
        if (step === 2 || step === 6 || step === 10 || step === 14) {
          this.playSprunkiSound(member.name, this.jamIsHorror);
        }
      }
      // Sky / Sun / Tree / Black: Atmospheric pads on 0
      else {
        if (step === 0) {
          this.playSprunkiSound(member.name, this.jamIsHorror);
        }
      }
    });

    // Notify listeners for UI animation & VU meters
    this.jamStepListeners.forEach(fn => fn(step, this.jamBpm));
    this.jamStep++;
  }

  // ==========================================================
  // CHARACTER SPEECH SYNTHESIS & VOICE BLIPS ENGINE
  // ==========================================================
  public playSpeechBlip(pitchMultiplier: number = 1.0, isHigh: boolean = false) {
    this.initContext();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = isHigh ? 'triangle' : 'sine';
    const baseFreq = (isHigh ? 480 : 260) * pitchMultiplier;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.15, now + 0.04);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  public speakCharacterVoice(
    characterName: string,
    text: string,
    onWord?: (word: string) => void,
    onEnd?: () => void
  ) {
    const nameLower = characterName.toLowerCase();
    
    // Play speech blip sound for immediate auditory feedback
    const isHigh = nameLower.includes('pinki') || nameLower.includes('wenda') || nameLower.includes('bee') || nameLower.includes('axolotl') || nameLower.includes('verity');
    const pitchMultiplier = 
      nameLower.includes('warden') ? 0.4 :
      nameLower.includes('enderman') ? 0.6 :
      nameLower.includes('zombie') ? 0.5 :
      nameLower.includes('golem') ? 0.7 :
      nameLower.includes('verity') ? 1.4 :
      nameLower.includes('pinki') ? 1.6 :
      nameLower.includes('funbot') ? 1.2 : 1.0;

    this.playSpeechBlip(pitchMultiplier, isHigh);

    // Use Web Speech API if supported in user browser
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Voice pitch tuning based on character personality
        if (nameLower.includes('warden')) {
          utterance.pitch = 0.3;
          utterance.rate = 0.8;
        } else if (nameLower.includes('enderman')) {
          utterance.pitch = 0.5;
          utterance.rate = 0.85;
        } else if (nameLower.includes('zombie')) {
          utterance.pitch = 0.4;
          utterance.rate = 0.75;
        } else if (nameLower.includes('creeper')) {
          utterance.pitch = 1.3;
          utterance.rate = 1.1;
        } else if (nameLower.includes('villager')) {
          utterance.pitch = 0.9;
          utterance.rate = 0.9;
        } else if (nameLower.includes('verity')) {
          utterance.pitch = 1.45;
          utterance.rate = 1.0;
        } else if (nameLower.includes('fun') || nameLower.includes('bot') || nameLower.includes('computer')) {
          utterance.pitch = 1.25;
          utterance.rate = 1.2;
        } else if (nameLower.includes('pinki') || nameLower.includes('wenda')) {
          utterance.pitch = 1.6;
          utterance.rate = 1.15;
        } else if (nameLower.includes('thomas') || nameLower.includes('percy')) {
          utterance.pitch = 1.1;
          utterance.rate = 1.05;
        } else if (nameLower.includes('gordon') || nameLower.includes('diesel')) {
          utterance.pitch = 0.75;
          utterance.rate = 0.95;
        } else {
          utterance.pitch = 1.0;
          utterance.rate = 1.0;
        }

        utterance.volume = this.isMuted ? 0 : Math.min(1, this.volume * 1.5);

        if (onEnd) {
          utterance.onend = () => onEnd();
          utterance.onerror = () => onEnd();
        }

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Speech synthesis error, fallback to blips:', err);
        if (onEnd) onEnd();
      }
    } else {
      if (onEnd) setTimeout(onEnd, 1500);
    }
  }

  // --- LISTENERS ---
  public onPlayStateChange(fn: PlaybackListener): () => void {
    this.listeners.playState.add(fn);
    return () => this.listeners.playState.delete(fn);
  }

  public onTrackChange(fn: TrackListener): () => void {
    this.listeners.trackChange.add(fn);
    return () => this.listeners.trackChange.delete(fn);
  }
}

// Global Singleton audio engine
export const audioEngine = new ProceduralAudioEngine();
