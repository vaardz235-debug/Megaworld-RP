export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  discName: string;
  discColorPrimary: string;
  discColorSecondary: string;
  icon: string;
  bpm: number;
  durationSeconds: number;
  description: string;
  // Notes structure for Web Audio procedural playback
  patterns: {
    lead: (string | null)[]; // e.g. ['C4', 'E4', 'G4', null]
    chords: (string[] | null)[];
    bass: (string | null)[];
    drums?: ('K' | 'S' | 'H' | null)[]; // Kick, Snare, HiHat
  };
}

// Frequency map for note names
export const NOTE_FREQS: Record<string, number> = {
  'C2': 65.41, 'D2': 73.42, 'E2': 82.41, 'F2': 87.31, 'G2': 98.00, 'A2': 110.00, 'B2': 123.47,
  'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56, 'E3': 164.81, 'F3': 174.61, 'F#3': 185.00,
  'G3': 196.00, 'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63, 'F4': 349.23, 'F#4': 369.99,
  'G4': 392.00, 'G#4': 415.30, 'A4': 440.00, 'A#4': 466.16, 'B4': 493.88,
  'C5': 523.25, 'C#5': 554.37, 'D5': 587.33, 'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99,
  'G5': 783.99, 'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77,
  'C6': 1046.50
};

export const SONGS_PLAYLIST: MusicTrack[] = [
  {
    id: 'c418_sweden',
    title: 'Sweden (Calm Voxel)',
    artist: 'C418 Style',
    genre: 'Ambient Minecraft Piano',
    discName: 'Music Disc - Sweden',
    discColorPrimary: '#10b981', // emerald
    discColorSecondary: '#047857',
    icon: '🎹',
    bpm: 78,
    durationSeconds: 142,
    description: 'Nostalgic, peaceful piano chords & bell-like melodies echoing across voxel hills.',
    patterns: {
      lead: [
        'E4', null, 'G4', null, 'D4', null, 'C4', null,
        'D4', null, 'E4', null, 'G4', 'A4', 'G4', null,
        'E4', null, 'G4', null, 'C5', null, 'B4', null,
        'A4', null, 'G4', null, 'E4', null, 'D4', null,
      ],
      chords: [
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['G2', 'B2', 'D3'], null, ['G2', 'B2', 'D3'], null,
        ['A2', 'C3', 'E3'], null, ['A2', 'C3', 'E3'], null,
        ['F2', 'A2', 'C3'], null, ['F2', 'A2', 'C3'], null,
      ],
      bass: [
        'C2', null, 'C2', null,
        'G2', null, 'G2', null,
        'A2', null, 'A2', null,
        'F2', null, 'F2', null,
      ],
      drums: [
        null, null, null, null,
        null, null, null, null,
        null, null, null, null,
        null, null, null, null,
      ]
    }
  },
  {
    id: 'pigstep_groove',
    title: 'Pigstep (Nether Groove)',
    artist: 'Lena Raine Style',
    genre: 'Retro Chiptune & Funk',
    discName: 'Music Disc - Pigstep',
    discColorPrimary: '#dc2626', // ruby red
    discColorSecondary: '#1c1917',
    icon: '🔥',
    bpm: 104,
    durationSeconds: 128,
    description: 'Funky syncopated bass, crisp retro leads, and swinging nether chiptune beats.',
    patterns: {
      lead: [
        'D4', 'D4', null, 'F4', 'G4', null, 'F4', 'D4',
        'C4', null, 'D4', 'F4', 'D4', null, null, 'C4',
        'D4', 'F4', 'A4', null, 'G4', 'F4', 'D4', 'C4',
        'D4', null, 'F4', 'G4', 'F4', 'D4', 'C4', null,
      ],
      chords: [
        ['D3', 'F3', 'A3'], null, ['D3', 'F3', 'A3'], null,
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['Bb2', 'D3', 'F3'], null, ['Bb2', 'D3', 'F3'], null,
        ['A2', 'C#3', 'E3'], null, ['A2', 'C#3', 'E3'], null,
      ],
      bass: [
        'D2', null, 'D2', 'F2',
        'C2', null, 'C2', 'E2',
        'A#2', null, 'A#2', 'D2',
        'A2', null, 'A2', 'C#2',
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'K', 'S', 'H',
      ]
    }
  },
  {
    id: 'sprunki_beatbox',
    title: 'Sprunki Incredibox Beats',
    artist: 'Sprunki Crew',
    genre: 'Funky Beatbox Pop',
    discName: 'Music Disc - Sprunki',
    discColorPrimary: '#ec4899', // pink
    discColorSecondary: '#06b6d4', // cyan
    icon: '👾',
    bpm: 116,
    durationSeconds: 135,
    description: 'Bouncy bassline, infectious vocal synth stabs, and funky beatbox rhythms!',
    patterns: {
      lead: [
        'F4', null, 'G#4', 'A#4', 'C5', null, 'A#4', 'G#4',
        'F4', 'G#4', null, 'F4', 'D#4', 'F4', null, null,
        'C5', 'A#4', 'G#4', 'F4', 'G#4', 'A#4', 'C5', null,
        'D#5', 'C5', 'A#4', 'G#4', 'F4', null, 'G#4', null,
      ],
      chords: [
        ['F3', 'G#3', 'C4'], null, ['F3', 'G#3', 'C4'], null,
        ['C#3', 'F3', 'G#3'], null, ['C#3', 'F3', 'G#3'], null,
        ['D#3', 'G3', 'A#3'], null, ['D#3', 'G3', 'A#3'], null,
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
      ],
      bass: [
        'F2', 'F2', null, 'G#2',
        'C#2', 'C#2', null, 'F2',
        'D#2', 'D#2', null, 'G2',
        'C2', 'C2', 'E2', 'G2',
      ],
      drums: [
        'K', 'H', 'S', 'K',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'K',
        'K', 'S', 'S', 'H',
      ]
    }
  },
  {
    id: 'countryballs_march',
    title: 'Countryballs World March',
    artist: 'Polandball Anthem',
    genre: 'Epic Polka March & Fanfare',
    discName: 'Music Disc - Countryball',
    discColorPrimary: '#ef4444', // red
    discColorSecondary: '#ffffff', // white
    icon: '🌐',
    bpm: 124,
    durationSeconds: 120,
    description: 'Heroic brass fanfare, marching snare cadence, and humorous polka spirit celebrating world countryballs!',
    patterns: {
      lead: [
        'C4', 'E4', 'G4', 'C5', 'G4', 'E4', 'C4', null,
        'D4', 'F4', 'A4', 'D5', 'A4', 'F4', 'D4', null,
        'E4', 'G4', 'C5', 'E5', 'D5', 'C5', 'B4', 'A4',
        'G4', 'F4', 'E4', 'D4', 'C4', null, 'C5', null,
      ],
      chords: [
        ['C3', 'E3', 'G3'], ['C3', 'E3', 'G3'], ['C3', 'E3', 'G3'], null,
        ['D3', 'F3', 'A3'], ['D3', 'F3', 'A3'], ['D3', 'F3', 'A3'], null,
        ['C3', 'E3', 'G3'], ['C3', 'E3', 'G3'], ['G2', 'B2', 'D3'], ['G2', 'B2', 'D3'],
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
      ],
      bass: [
        'C2', 'G2', 'C2', 'G2',
        'D2', 'A2', 'D2', 'A2',
        'C2', 'G2', 'G2', 'D2',
        'C2', 'G2', 'C2', null,
      ],
      drums: [
        'K', 'S', 'K', 'S',
        'K', 'S', 'K', 'S',
        'K', 'S', 'K', 'S',
        'K', 'S', 'K', 'S',
      ]
    }
  },
  {
    id: 'cat_playful',
    title: 'Cat (Playful Synth Disc)',
    artist: 'C418 Style',
    genre: 'Classic Chiptune Melodies',
    discName: 'Music Disc - Cat',
    discColorPrimary: '#059669', // green
    discColorSecondary: '#f59e0b', // amber
    icon: '🐱',
    bpm: 96,
    durationSeconds: 150,
    description: 'Upbeat bouncy synth flute melody and cheerful retro chiptune groove.',
    patterns: {
      lead: [
        'C4', 'D4', 'E4', 'G4', 'A4', 'G4', 'E4', 'D4',
        'C4', null, 'E4', null, 'D4', null, 'C4', null,
        'E4', 'G4', 'A4', 'C5', 'D5', 'C5', 'A4', 'G4',
        'A4', null, 'G4', null, 'E4', 'D4', 'C4', null,
      ],
      chords: [
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['F2', 'A2', 'C3'], null, ['F2', 'A2', 'C3'], null,
        ['A2', 'C3', 'E3'], null, ['A2', 'C3', 'E3'], null,
        ['G2', 'B2', 'D3'], null, ['G2', 'B2', 'D3'], null,
      ],
      bass: [
        'C2', null, 'C2', 'E2',
        'F2', null, 'F2', 'A2',
        'A2', null, 'A2', 'C3',
        'G2', null, 'G2', 'B2',
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
      ]
    }
  },
  {
    id: 'cave_crystals',
    title: 'Cave Crystals & Echoes',
    artist: 'Deep Caverns',
    genre: 'Subterranean Ambient',
    discName: 'Music Disc - 13 / Cave',
    discColorPrimary: '#8b5cf6', // purple
    discColorSecondary: '#38bdf8', // sky
    icon: '💎',
    bpm: 72,
    durationSeconds: 160,
    description: 'Reverberant crystal chimes, deep sub-bass drones, and sparkling subterranean echoes.',
    patterns: {
      lead: [
        'A4', null, null, 'C5', 'E5', null, 'D5', null,
        null, 'B4', null, 'G4', 'A4', null, null, null,
        'C5', null, 'E5', null, 'G5', null, 'F#5', null,
        'E5', null, 'D5', null, 'C5', null, 'B4', null,
      ],
      chords: [
        ['A2', 'E3', 'A3'], null, null, null,
        ['F2', 'C3', 'F3'], null, null, null,
        ['D2', 'A2', 'D3'], null, null, null,
        ['E2', 'B2', 'E3'], null, null, null,
      ],
      bass: [
        'A2', null, null, null,
        'F2', null, null, null,
        'D2', null, null, null,
        'E2', null, null, null,
      ],
      drums: [
        null, null, 'H', null,
        null, null, 'H', null,
        null, null, 'H', null,
        null, null, 'H', null,
      ]
    }
  },
  {
    id: 'creative_sky',
    title: 'Creative Sky (Cloud Flight)',
    artist: 'Horizon Drift',
    genre: 'Lo-Fi Dreamy Ambient',
    discName: 'Music Disc - Ward / Sky',
    discColorPrimary: '#f59e0b', // amber
    discColorSecondary: '#60a5fa', // sky blue
    icon: '☁️',
    bpm: 84,
    durationSeconds: 138,
    description: 'Warm synth pads, harp-like arpeggios, and peaceful acoustic flutter for soaring high in Creative Mode.',
    patterns: {
      lead: [
        'G4', 'B4', 'D5', 'G5', 'F#5', 'D5', 'B4', 'G4',
        'E4', 'G4', 'B4', 'E5', 'D5', 'B4', 'G4', 'E4',
        'C4', 'E4', 'G4', 'C5', 'B4', 'G4', 'E4', 'C4',
        'D4', 'F#4', 'A4', 'D5', 'C5', 'A4', 'F#4', 'D4',
      ],
      chords: [
        ['G3', 'B3', 'D4'], null, ['G3', 'B3', 'D4'], null,
        ['E3', 'G3', 'B3'], null, ['E3', 'G3', 'B3'], null,
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['D3', 'F#3', 'A3'], null, ['D3', 'F#3', 'A3'], null,
      ],
      bass: [
        'G2', null, 'G2', null,
        'E2', null, 'E2', null,
        'C2', null, 'C2', null,
        'D2', null, 'D2', null,
      ],
      drums: [
        null, 'H', null, 'H',
        null, 'H', null, 'H',
        null, 'H', null, 'H',
        null, 'H', null, 'H',
      ]
    }
  },
  {
    id: 'disc_blocks',
    title: 'Blocks (Upbeat Shuffle)',
    artist: 'C418 Music Disc',
    genre: 'Chiptune Swing Waltz',
    discName: 'Music Disc - Blocks',
    discColorPrimary: '#ea580c', // orange
    discColorSecondary: '#c026d3', // fuchsia
    icon: '🟧',
    bpm: 110,
    durationSeconds: 145,
    description: 'Bouncy syncopated electronic bassline with colorful melodic flourishes.',
    patterns: {
      lead: [
        'D4', 'F4', 'G4', 'A4', 'D5', 'A4', 'F4', 'D4',
        'C4', 'E4', 'G4', 'C5', 'E5', 'C5', 'G4', 'E4',
        'Bb3', 'D4', 'F4', 'Bb4', 'D5', 'Bb4', 'F4', 'D4',
        'A3', 'C#4', 'E4', 'A4', 'C#5', 'A4', 'E4', 'C#4',
      ],
      chords: [
        ['D3', 'F3', 'A3'], null, ['D3', 'F3', 'A3'], null,
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['A#2', 'D3', 'F3'], null, ['A#2', 'D3', 'F3'], null,
        ['A2', 'C#3', 'E3'], null, ['A2', 'C#3', 'E3'], null,
      ],
      bass: [
        'D2', null, 'D2', 'F2',
        'C2', null, 'C2', 'E2',
        'A#2', null, 'A#2', 'D2',
        'A2', null, 'A2', 'C#2',
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
      ]
    }
  },
  {
    id: 'disc_chirp',
    title: 'Chirp (Retro Bossa)',
    artist: 'C418 Music Disc',
    genre: '70s Vintage Synth Bossa',
    discName: 'Music Disc - Chirp',
    discColorPrimary: '#dc2626', // red
    discColorSecondary: '#fbbf24', // yellow
    icon: '🐤',
    bpm: 92,
    durationSeconds: 130,
    description: 'Charming vintage synth sample with breezy Latin bossa-nova rhythm.',
    patterns: {
      lead: [
        'F4', 'A4', 'C5', null, 'D5', 'C5', 'A4', 'F4',
        'G4', 'Bb4', 'D5', null, 'C5', 'Bb4', 'G4', 'E4',
        'A4', 'C5', 'E5', null, 'D5', 'C5', 'A4', 'F4',
        'Bb4', 'D5', 'F5', null, 'E5', 'C5', 'G4', null,
      ],
      chords: [
        ['F3', 'A3', 'C4'], null, ['F3', 'A3', 'C4'], null,
        ['G3', 'A#3', 'D4'], null, ['G3', 'A#3', 'D4'], null,
        ['A3', 'C4', 'E4'], null, ['A3', 'C4', 'E4'], null,
        ['A#3', 'D4', 'F4'], null, ['C3', 'E3', 'G3'], null,
      ],
      bass: [
        'F2', null, 'C2', null,
        'G2', null, 'D2', null,
        'A2', null, 'E2', null,
        'A#2', null, 'C2', null,
      ],
      drums: [
        'K', 'H', 'H', 'S',
        'K', 'H', 'H', 'S',
        'K', 'H', 'H', 'S',
        'K', 'H', 'H', 'S',
      ]
    }
  },
  {
    id: 'disc_far',
    title: 'Far (Mystic Ocean Echo)',
    artist: 'C418 Music Disc',
    genre: 'Spiritual Ambient Chimes',
    discName: 'Music Disc - Far',
    discColorPrimary: '#0284c7', // light blue
    discColorSecondary: '#a855f7', // purple
    icon: '🌊',
    bpm: 68,
    durationSeconds: 155,
    description: 'Spiritual bell chimes and ethereal ocean pads echoing into distant horizons.',
    patterns: {
      lead: [
        'D5', null, 'F5', null, 'E5', null, 'C5', null,
        'D5', null, 'A4', null, 'F4', null, 'G4', null,
        'A4', null, 'C5', null, 'D5', null, 'E5', null,
        'F5', null, 'E5', null, 'D5', null, null, null,
      ],
      chords: [
        ['D3', 'F3', 'A3'], null, null, null,
        ['A2', 'C3', 'E3'], null, null, null,
        ['F2', 'A2', 'C3'], null, null, null,
        ['G2', 'B2', 'D3'], null, null, null,
      ],
      bass: [
        'D2', null, null, null,
        'A2', null, null, null,
        'F2', null, null, null,
        'G2', null, null, null,
      ],
      drums: [
        null, null, 'H', null,
        null, null, 'H', null,
        null, null, 'H', null,
        null, null, 'H', null,
      ]
    }
  },
  {
    id: 'disc_mall',
    title: 'Mall (Cozy Evening Vibe)',
    artist: 'C418 Music Disc',
    genre: 'Lofi Rhodes & Slap Groove',
    discName: 'Music Disc - Mall',
    discColorPrimary: '#a855f7', // purple
    discColorSecondary: '#ec4899', // pink
    icon: '🛍️',
    bpm: 88,
    durationSeconds: 140,
    description: 'Warm electric piano keys and comforting evening sunset groove.',
    patterns: {
      lead: [
        'C4', 'E4', 'G4', 'B4', 'A4', 'G4', 'E4', 'D4',
        'E4', 'G4', 'B4', 'D5', 'C5', 'B4', 'G4', 'E4',
        'F4', 'A4', 'C5', 'E5', 'D5', 'C5', 'A4', 'F4',
        'G4', 'B4', 'D5', 'F5', 'E5', 'D5', 'B4', null,
      ],
      chords: [
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['E3', 'G3', 'B3'], null, ['E3', 'G3', 'B3'], null,
        ['F3', 'A3', 'C4'], null, ['F3', 'A3', 'C4'], null,
        ['G3', 'B3', 'D4'], null, ['G3', 'B3', 'D4'], null,
      ],
      bass: [
        'C2', null, 'C2', null,
        'E2', null, 'E2', null,
        'F2', null, 'F2', null,
        'G2', null, 'G2', null,
      ],
      drums: [
        'K', null, 'S', 'H',
        'K', null, 'S', 'H',
        'K', null, 'S', 'H',
        'K', null, 'S', 'H',
      ]
    }
  },
  {
    id: 'disc_mellohi',
    title: 'Mellohi (Haunted Waltz)',
    artist: 'C418 Music Disc',
    genre: 'Gothic Noir Waltz',
    discName: 'Music Disc - Mellohi',
    discColorPrimary: '#e11d48', // rose
    discColorSecondary: '#ffffff', // white
    icon: '🕯️',
    bpm: 76,
    durationSeconds: 136,
    description: 'Melancholic accordion & spooky baroque organ playing a mysterious midnight waltz.',
    patterns: {
      lead: [
        'A4', null, 'B4', 'C5', null, 'B4', 'A4', null,
        'G#4', null, 'A4', 'B4', null, 'A4', 'G#4', null,
        'F4', null, 'G4', 'A4', null, 'G4', 'F4', null,
        'E4', null, 'F4', 'G#4', null, 'E4', null, null,
      ],
      chords: [
        ['A2', 'C3', 'E3'], ['A2', 'C3', 'E3'], null, null,
        ['E2', 'G#2', 'B2'], ['E2', 'G#2', 'B2'], null, null,
        ['D2', 'F2', 'A2'], ['D2', 'F2', 'A2'], null, null,
        ['E2', 'G#2', 'B2'], ['E2', 'G#2', 'B2'], null, null,
      ],
      bass: [
        'A2', null, 'E2', null,
        'E2', null, 'B2', null,
        'D2', null, 'A2', null,
        'E2', null, 'B2', null,
      ],
      drums: [
        'K', null, 'H', null,
        'K', null, 'H', null,
        'K', null, 'H', null,
        'K', null, 'H', null,
      ]
    }
  },
  {
    id: 'disc_stal',
    title: 'Stal (Smooth Jazz & Bass)',
    artist: 'C418 Music Disc',
    genre: 'Vintage Jazz Sax & Bass',
    discName: 'Music Disc - Stal',
    discColorPrimary: '#27272a', // dark zinc
    discColorSecondary: '#e4e4e7', // silver
    icon: '🎷',
    bpm: 100,
    durationSeconds: 152,
    description: 'Swinging acoustic bassline, cool jazz chords, and soulful recorder melody.',
    patterns: {
      lead: [
        'D4', 'F4', 'G4', 'G#4', 'A4', null, 'C5', 'A4',
        'G4', 'F4', 'D4', null, 'C4', 'D4', 'F4', null,
        'D5', null, 'C5', 'A4', 'G4', 'F4', 'D4', 'C4',
        'D4', null, 'F4', 'A4', 'D4', null, null, null,
      ],
      chords: [
        ['D3', 'F3', 'A3', 'C4'], null, ['D3', 'F3', 'A3', 'C4'], null,
        ['G2', 'B2', 'D3', 'F3'], null, ['G2', 'B2', 'D3', 'F3'], null,
        ['C3', 'E3', 'G3', 'B3'], null, ['C3', 'E3', 'G3', 'B3'], null,
        ['A2', 'C#3', 'E3', 'G3'], null, ['A2', 'C#3', 'E3', 'G3'], null,
      ],
      bass: [
        'D2', 'F2', 'G2', 'A2',
        'G2', 'B2', 'C3', 'D3',
        'C2', 'E2', 'F2', 'G2',
        'A2', 'C#3', 'D3', 'E3',
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
      ]
    }
  },
  {
    id: 'disc_strad',
    title: 'Strad (Tropical Flute Breeze)',
    artist: 'C418 Music Disc',
    genre: 'Tropical Steel Drum & Flute',
    discName: 'Music Disc - Strad',
    discColorPrimary: '#f8fafc', // white pearl
    discColorSecondary: '#059669', // emerald
    icon: '🌴',
    bpm: 108,
    durationSeconds: 148,
    description: 'Sunny tropical steel drums and relaxing bamboo flute drifting on a warm beach.',
    patterns: {
      lead: [
        'C4', 'E4', 'G4', 'A4', 'C5', 'A4', 'G4', 'E4',
        'D4', 'F4', 'A4', 'B4', 'D5', 'B4', 'A4', 'F4',
        'E4', 'G4', 'B4', 'C5', 'E5', 'C5', 'B4', 'G4',
        'F4', 'A4', 'C5', 'D5', 'C5', 'A4', 'G4', 'E4',
      ],
      chords: [
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['D3', 'F3', 'A3'], null, ['D3', 'F3', 'A3'], null,
        ['E3', 'G3', 'B3'], null, ['E3', 'G3', 'B3'], null,
        ['F3', 'A3', 'C4'], null, ['G3', 'B3', 'D4'], null,
      ],
      bass: [
        'C2', null, 'C2', 'E2',
        'D2', null, 'D2', 'F2',
        'E2', null, 'E2', 'G2',
        'F2', null, 'G2', null,
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
      ]
    }
  },
  {
    id: 'disc_wait',
    title: 'Wait (Dawn Horizon)',
    artist: 'C418 Music Disc',
    genre: 'Inspiring Sunrise Synth Anthem',
    discName: 'Music Disc - Wait',
    discColorPrimary: '#0ea5e9', // ocean sky
    discColorSecondary: '#f59e0b', // amber
    icon: '🌅',
    bpm: 112,
    durationSeconds: 158,
    description: 'Majestic sunrise synth anthem celebrating a new dawn after surviving the night.',
    patterns: {
      lead: [
        'G4', 'D5', 'B4', 'G4', 'A4', 'E5', 'C5', 'A4',
        'B4', 'F#5', 'D5', 'B4', 'C5', 'G5', 'E5', 'C5',
        'D5', 'B4', 'G4', 'D4', 'E5', 'C5', 'A4', 'E4',
        'D5', 'G4', 'B4', 'D5', 'G5', null, null, null,
      ],
      chords: [
        ['G3', 'B3', 'D4'], null, ['A3', 'C4', 'E4'], null,
        ['B3', 'D4', 'F#4'], null, ['C3', 'E3', 'G3'], null,
        ['G3', 'B3', 'D4'], null, ['A3', 'C4', 'E4'], null,
        ['G3', 'B3', 'D4'], null, ['G3', 'B3', 'D4'], null,
      ],
      bass: [
        'G2', null, 'A2', null,
        'B2', null, 'C2', null,
        'G2', null, 'A2', null,
        'G2', null, 'G2', null,
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'H', 'S', 'H',
      ]
    }
  },
  {
    id: 'disc_otherside',
    title: 'Otherside (Adventure Bounce)',
    artist: 'Lena Raine Style',
    genre: 'Uplifting Adventure Chiptune',
    discName: 'Music Disc - Otherside',
    discColorPrimary: '#14b8a6', // teal
    discColorSecondary: '#f43f5e', // rose
    icon: '🚀',
    bpm: 118,
    durationSeconds: 165,
    description: 'High-energy euphoric adventure theme with sweeping arpeggios and punchy beat.',
    patterns: {
      lead: [
        'C5', 'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'D5',
        'C5', 'G4', 'A4', 'C5', 'E5', 'D5', 'C5', 'A4',
        'E5', 'G5', 'A5', 'C6', 'B5', 'A5', 'G5', 'E5',
        'D5', 'E5', 'G5', 'A5', 'G5', 'E5', 'C5', null,
      ],
      chords: [
        ['C3', 'E3', 'G3'], null, ['C3', 'E3', 'G3'], null,
        ['F3', 'A3', 'C4'], null, ['F3', 'A3', 'C4'], null,
        ['A3', 'C4', 'E4'], null, ['A3', 'C4', 'E4'], null,
        ['G3', 'B3', 'D4'], null, ['G3', 'B3', 'D4'], null,
      ],
      bass: [
        'C2', 'C2', 'G2', 'C2',
        'F2', 'F2', 'C3', 'F2',
        'A2', 'A2', 'E2', 'A2',
        'G2', 'G2', 'D2', 'G2',
      ],
      drums: [
        'K', 'H', 'S', 'H',
        'K', 'K', 'S', 'H',
        'K', 'H', 'S', 'H',
        'K', 'S', 'S', 'H',
      ]
    }
  }
];
