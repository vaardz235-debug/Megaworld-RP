import { audioEngine } from './audioEngine';

export interface AppSettings {
  // Audio & Sound
  masterVolume: number; // 0 to 100
  sfxVolume: number; // 0 to 100
  musicVolume: number; // 0 to 100
  soundEnabled: boolean;
  musicEnabled: boolean;
  ttsVoiceEnabled: boolean;
  ambientWeatherAudio: boolean;
  oofSoundStyle: 'classic' | 'modern' | 'nuclear' | 'silly';

  // Graphics & Performance
  targetFps: 60 | 120 | 144 | 165;
  canvasViewMode: 'standard' | 'expanded';
  particlesEnabled: boolean;
  dynamicShading: boolean;
  skyboxGradient: boolean;
  blockOutlines: 'subtle' | 'bold' | 'none';

  // Gameplay
  defaultGameMode: 'survival' | 'creative';
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  autoJump: boolean;
  keepInventoryOnDeath: boolean;
  instantCreativeMining: boolean;
  showOnScreenControls: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  // Audio
  masterVolume: 80,
  sfxVolume: 90,
  musicVolume: 65,
  soundEnabled: true,
  musicEnabled: true,
  ttsVoiceEnabled: true,
  ambientWeatherAudio: true,
  oofSoundStyle: 'classic',

  // Graphics
  targetFps: 165,
  canvasViewMode: 'standard',
  particlesEnabled: true,
  dynamicShading: true,
  skyboxGradient: true,
  blockOutlines: 'subtle',

  // Gameplay
  defaultGameMode: 'survival',
  difficulty: 'normal',
  autoJump: true,
  keepInventoryOnDeath: true,
  instantCreativeMining: true,
  showOnScreenControls: true,
};

const STORAGE_KEY = 'megaworld_game_settings_v1';

type SettingsChangeListener = (settings: AppSettings) => void;
const listeners = new Set<SettingsChangeListener>();

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.warn('Failed to load settings from localStorage, using defaults:', e);
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applySettings(settings);
    listeners.forEach((fn) => {
      try {
        fn(settings);
      } catch (err) {
        console.error('Error in settings listener:', err);
      }
    });
  } catch (e) {
    console.error('Failed to save settings to localStorage:', e);
  }
}

export function applySettings(settings: AppSettings): void {
  // Apply to audio engine
  const masterRatio = (settings.masterVolume / 100);
  const musicRatio = (settings.musicVolume / 100);
  const effectiveMusicVol = settings.musicEnabled ? masterRatio * musicRatio : 0;
  
  audioEngine.setVolume(effectiveMusicVol);
  if (!settings.soundEnabled || !settings.musicEnabled) {
    if (!settings.musicEnabled && audioEngine.getIsPlaying()) {
      audioEngine.pause();
    }
  }

  audioEngine.setSfxMuted(!settings.soundEnabled);
  audioEngine.setSfxVolume((settings.sfxVolume / 100) * masterRatio);
}

export function subscribeToSettings(listener: SettingsChangeListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
