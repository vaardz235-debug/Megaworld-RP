import { useEffect, useRef } from 'react';

const soundEffects = {
  mine: 'https://actions.google.com/sounds/v1/foley/wood_hit.ogg',
  build: 'https://actions.google.com/sounds/v1/foley/stone_hit.ogg',
};

const ambientSounds = {
  sunny: 'https://actions.google.com/sounds/v1/nature/birds_chirping.ogg',
  rainy: 'https://actions.google.com/sounds/v1/weather/rain_heavy.ogg',
  snowy: 'https://actions.google.com/sounds/v1/weather/wind_gusts.ogg',
};

export const useSound = () => {
  const ambientAudio = useRef<HTMLAudioElement | null>(null);

  const playEffect = (effect: keyof typeof soundEffects) => {
    const audio = new Audio(soundEffects[effect]);
    audio.play().catch(e => console.log('Audio playback failed', e));
  };

  const playAmbient = (condition: keyof typeof ambientSounds) => {
    if (ambientAudio.current) {
      ambientAudio.current.pause();
    }
    const audio = new Audio(ambientSounds[condition]);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(e => console.log('Audio playback failed', e));
    ambientAudio.current = audio;
  };

  return { playEffect, playAmbient };
};
