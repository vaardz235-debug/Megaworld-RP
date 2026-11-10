/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { audioEngine } from './audioEngine';

export interface PetDefinition {
  id: string;
  name: string;
  species: string;
  brand: string;
  icon: string;
  description: string;
  perkDescription: string;
  favoriteFood: string;
  themeColor: string;
  soundName: string;
  xpPerFeed: number;
}

export const PET_CATALOG: PetDefinition[] = [
  {
    id: 'diamond_dog',
    name: 'Snoopy the Diamond Dog',
    species: 'Tamed Loyal Wolf',
    brand: 'Minecraft',
    icon: '🐶',
    description: 'A loyal blue-collared wolf companion with sharp senses. Wags tail and barks when hostile mobs get within 12 blocks.',
    perkDescription: 'Auto-harvests nearby mined items & alerts you to hostile zombies.',
    favoriteFood: 'apple',
    themeColor: '#38bdf8',
    soundName: 'dog_bark',
    xpPerFeed: 25,
  },
  {
    id: 'midnight_cat',
    name: 'Luna the Midnight Shadow Cat',
    species: 'Black Mystic Ocelot',
    brand: 'Minecraft & Sprunki',
    icon: '🐱',
    description: 'An agile, silent feline that roams with glowing green eyes. Hisses violently at Creepers, causing them to turn and flee in terror!',
    perkDescription: 'Pacifies Creepers within 8 blocks and grants +15% silent sprint velocity.',
    favoriteFood: 'bread',
    themeColor: '#a855f7',
    soundName: 'cat_purr',
    xpPerFeed: 20,
  },
  {
    id: 'bloxian_drone',
    name: 'Byte the Bloxian Hover-Drone',
    species: 'Quantum Scan Drone',
    brand: 'Roblox',
    icon: '🤖',
    description: 'A floating mechanical sphere equipped with neon headlights and an acoustic ore sensor. Illuminates pitch-black caverns.',
    perkDescription: 'Projects a 14-level headlight in caves & highlights rare diamond veins.',
    favoriteFood: 'coal',
    themeColor: '#ef4444',
    soundName: 'drone_beep',
    xpPerFeed: 30,
  },
  {
    id: 'mini_polandball',
    name: 'Piotr the Mini-Polandball',
    species: 'Sovereign Countryball',
    brand: 'Countryballs',
    icon: '🌐',
    description: 'A miniature bouncing Polish sphere wearing a tiny plunger hat. Constantly declares "Can into space!" and helps hoard coins.',
    perkDescription: '+35% Coin drops from all activities & bounces alongside with canonical pride.',
    favoriteFood: 'bread',
    themeColor: '#e11d48',
    soundName: 'poland_kurwa',
    xpPerFeed: 25,
  },
  {
    id: 'holiday_penguin',
    name: 'Pip the Holiday Penguin',
    species: 'Arctic Sledder',
    brand: 'Christmas',
    icon: '🐧',
    description: 'A cheerful Antarctic chick wearing a festive red scarf. Slides along on its belly and throws friendly holiday snowballs!',
    perkDescription: 'Leaves glittering frost trails & slowly regenerates hunger bar over time.',
    favoriteFood: 'candy_corn',
    themeColor: '#06b6d4',
    soundName: 'penguin_chirp',
    xpPerFeed: 35,
  },
];

class PetCompanionManager {
  private activePet: PetDefinition | null = PET_CATALOG[0]; // Snoopy active by default
  private behavior: 'follow' | 'guard' | 'stay' = 'follow';
  private petLevel: number = 3;
  private petXp: number = 45;
  private autoLootEnabled: boolean = true;
  private listeners: Set<() => void> = new Set();

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getCatalog(): PetDefinition[] {
    return PET_CATALOG;
  }

  public getActivePet(): PetDefinition | null {
    return this.activePet;
  }

  public getBehavior(): 'follow' | 'guard' | 'stay' {
    return this.behavior;
  }

  public getLevel(): number {
    return this.petLevel;
  }

  public getXp(): number {
    return this.petXp;
  }

  public getAutoLootEnabled(): boolean {
    return this.autoLootEnabled;
  }

  public toggleAutoLoot(): boolean {
    this.autoLootEnabled = !this.autoLootEnabled;
    this.notify();
    return this.autoLootEnabled;
  }

  public setBehavior(mode: 'follow' | 'guard' | 'stay') {
    this.behavior = mode;
    audioEngine.playRobloxSound('click');
    this.notify();
  }

  public setActivePet(petId: string | null) {
    if (!petId) {
      this.activePet = null;
    } else {
      const p = PET_CATALOG.find((pet) => pet.id === petId);
      if (p) this.activePet = p;
    }
    audioEngine.playRobloxSound('badge');
    this.notify();
  }

  public feedPet(foodType: string): { success: boolean; message: string; leveledUp: boolean } {
    if (!this.activePet) {
      return { success: false, message: 'No pet currently equipped!', leveledUp: false };
    }

    const xpGain = this.activePet.xpPerFeed;
    this.petXp += xpGain;

    audioEngine.playMinecraftSound('eat');

    let leveledUp = false;
    if (this.petXp >= 100) {
      this.petLevel += 1;
      this.petXp -= 100;
      leveledUp = true;
      audioEngine.playMinecraftSound('levelup');
    }

    this.notify();
    return {
      success: true,
      message: `Fed ${this.activePet.name} a delicious ${foodType}! +${xpGain} Pet XP!`,
      leveledUp,
    };
  }
}

export const petCompanionManager = new PetCompanionManager();
