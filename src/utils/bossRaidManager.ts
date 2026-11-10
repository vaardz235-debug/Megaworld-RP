/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { audioEngine } from './audioEngine';
import { dailyMissionManager } from './dailyMissionManager';

export interface BossAttack {
  name: string;
  damage: number;
  description: string;
  chargeTimeMs: number;
  icon: string;
}

export interface BossDefinition {
  id: string;
  name: string;
  title: string;
  brand: string;
  avatarEmoji: string;
  maxHp: number;
  armorClass: number;
  themeColor: string;
  spawnCoordinates: { x: number; y: number };
  attacks: BossAttack[];
  drops: {
    coins: number;
    robux: number;
    items: string[];
    badgeName: string;
  };
  dialogueIntro: string;
  dialogueDefeat: string;
}

export const BOSS_ROSTER: BossDefinition[] = [
  {
    id: 'diesel_10',
    name: 'Diesel 10 & Pinchy',
    title: 'The Rogue Hydraulic Terror of Sodor',
    brand: 'Sodor Railway',
    avatarEmoji: '🚂',
    maxHp: 3500,
    armorClass: 18,
    themeColor: '#ca8a04',
    spawnCoordinates: { x: -65, y: 7 },
    attacks: [
      { name: 'Hydraulic Claw Smash', damage: 28, description: 'Pinchy crashes downward with 10 tons of pneumatic force!', chargeTimeMs: 2500, icon: '🦀' },
      { name: 'Scrap Metal Shrapnel', damage: 18, description: 'Fires rusty gears and steel rivets across a wide cone.', chargeTimeMs: 1800, icon: '⚙️' },
      { name: 'Locomotive Steam Charge', damage: 35, description: 'Rushes forward on iron wheels, knocking back miners.', chargeTimeMs: 3200, icon: '💨' },
    ],
    drops: {
      coins: 300,
      robux: 60,
      items: ['netherite', 'ore', 'gold'],
      badgeName: 'Pinchy Tamer',
    },
    dialogueIntro: '"Hahaha! Listen to the sweet crunch of metal! Pinchy is hungry today!"',
    dialogueDefeat: '"Grrr... My hydraulics! I will be back with stronger steel!"',
  },
  {
    id: 'ender_sharko',
    name: 'Void Titan Ender-Sharko',
    title: 'Primordial Abyssal Void Lord',
    brand: 'Xilam & Minecraft',
    avatarEmoji: '🦈',
    maxHp: 5000,
    armorClass: 22,
    themeColor: '#7c3aed',
    spawnCoordinates: { x: 25, y: 5 },
    attacks: [
      { name: 'Void Breath Laser', damage: 38, description: 'Fires concentrated purple cosmic void plasma that melts stone!', chargeTimeMs: 3000, icon: '🌌' },
      { name: 'Slapstick Whirlpool Surge', damage: 24, description: 'Summons tidal whirlpool waves that disorient nearby players.', chargeTimeMs: 2000, icon: '🌊' },
      { name: 'Shadow Clone Ambush', damage: 32, description: 'Splits into 3 spectral shark apparitions striking simultaneously.', chargeTimeMs: 2800, icon: '👥' },
    ],
    drops: {
      coins: 500,
      robux: 120,
      items: ['diamond', 'crying_obsidian', 'amethyst'],
      badgeName: 'Abyssal Void Slayer',
    },
    dialogueIntro: '"ROAAAR! The cosmic oceans of the Nether bow before my fins!"',
    dialogueDefeat: '"Fading into the void... Marina... avenge me!"',
  },
  {
    id: 'cosmic_grimace',
    name: 'Cosmic Grimace Colossus',
    title: 'The Transcendent Fast-Food Behemoth',
    brand: 'McDonald\'s',
    avatarEmoji: '🥤',
    maxHp: 4200,
    armorClass: 20,
    themeColor: '#9333ea',
    spawnCoordinates: { x: 1280, y: 6 },
    attacks: [
      { name: 'Berry Shake Seismic Slam', damage: 32, description: 'Jumps 20 blocks high and slams down, causing purple shockwaves!', chargeTimeMs: 2600, icon: '💥' },
      { name: 'Cosmic Flavor Beam', damage: 22, description: 'Shoots radiant purple laser beams from his smiling mouth.', chargeTimeMs: 1900, icon: '✨' },
      { name: 'Golden Fry Flurry', damage: 26, description: 'Rains blistering french fry spears across the battlefield.', chargeTimeMs: 2400, icon: '🍟' },
    ],
    drops: {
      coins: 400,
      robux: 85,
      items: ['grimace_shake', 'mcdonalds_spatula', 'gold'],
      badgeName: 'Cosmic Shake Champion',
    },
    dialogueIntro: '"Happy Birthday to ME! Nobody escapes the flavor vortex!"',
    dialogueDefeat: '"My cosmic shake... it was... delicious..."',
  },
  {
    id: 'frost_krampus',
    name: 'Frost Lord Krampus',
    title: 'Scourge of the Winter Convergence',
    brand: 'Christmas',
    avatarEmoji: '❄️',
    maxHp: 4800,
    armorClass: 21,
    themeColor: '#06b6d4',
    spawnCoordinates: { x: -1520, y: 5 },
    attacks: [
      { name: 'Cryo-Blizzard Howl', damage: 30, description: 'Summons a sub-zero Arctic vortex that freezes players solid!', chargeTimeMs: 2700, icon: '🌬️' },
      { name: 'Explosive Peppermint Barrage', damage: 25, description: 'Fires explosive sugar-cane ordnance at long range.', chargeTimeMs: 2100, icon: '🍭' },
      { name: 'Naughty List Chains', damage: 36, description: 'Binds the player in frozen obsidian chains dealing heavy damage.', chargeTimeMs: 3100, icon: '⛓️' },
    ],
    drops: {
      coins: 450,
      robux: 100,
      items: ['candy_cane_blade', 'santa_gift_box', 'netherite_frost_blade'],
      badgeName: 'Winter Convergence Savior',
    },
    dialogueIntro: '"You dare trespass upon my frozen kingdom? You are on the NAUGHTY list!"',
    dialogueDefeat: '"The frost melts... but winter will return!"',
  },
];

class BossRaidManager {
  private activeBoss: BossDefinition | null = null;
  private currentHp: number = 0;
  private currentPhase: 1 | 2 | 3 = 1;
  private telegraphedAttack: { attack: BossAttack; remainingMs: number } | null = null;
  private attackTimer: any = null;
  private listeners: Set<() => void> = new Set();

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getBossRoster(): BossDefinition[] {
    return BOSS_ROSTER;
  }

  public getActiveBoss(): BossDefinition | null {
    return this.activeBoss;
  }

  public getCurrentHp(): number {
    return this.currentHp;
  }

  public getCurrentPhase(): 1 | 2 | 3 {
    return this.currentPhase;
  }

  public getTelegraphedAttack(): { attack: BossAttack; remainingMs: number } | null {
    return this.telegraphedAttack;
  }

  public summonBoss(bossId: string): boolean {
    const boss = BOSS_ROSTER.find((b) => b.id === bossId);
    if (!boss) return false;

    this.activeBoss = boss;
    this.currentHp = boss.maxHp;
    this.currentPhase = 1;
    this.telegraphedAttack = null;

    audioEngine.playRobloxSound('rocket');
    this.startBossCombatLoop();
    this.notify();
    return true;
  }

  private startBossCombatLoop() {
    if (this.attackTimer) clearInterval(this.attackTimer);

    // Pick random attack every 5 seconds
    this.attackTimer = setInterval(() => {
      if (!this.activeBoss || this.currentHp <= 0) return;

      const attacks = this.activeBoss.attacks;
      const attack = attacks[Math.floor(Math.random() * attacks.length)];

      this.telegraphedAttack = {
        attack,
        remainingMs: attack.chargeTimeMs,
      };
      this.notify();

      // Countdown attack telegraph
      const tick = 200;
      const countdown = setInterval(() => {
        if (!this.telegraphedAttack) {
          clearInterval(countdown);
          return;
        }

        this.telegraphedAttack.remainingMs -= tick;
        if (this.telegraphedAttack.remainingMs <= 0) {
          clearInterval(countdown);
          this.executeBossAttack(this.telegraphedAttack.attack);
          this.telegraphedAttack = null;
          this.notify();
        }
      }, tick);

    }, 6000);
  }

  private executeBossAttack(attack: BossAttack) {
    audioEngine.playRobloxSound('sword');
    // Dispatch event to GameWorld so player takes damage if nearby
    window.dispatchEvent(new CustomEvent('megaworld_boss_attack', {
      detail: {
        bossName: this.activeBoss?.name,
        attackName: attack.name,
        damage: attack.damage,
      }
    }));
  }

  public damageBoss(amount: number): { defeated: boolean; loot?: BossDefinition['drops'] } {
    if (!this.activeBoss || this.currentHp <= 0) {
      return { defeated: false };
    }

    this.currentHp = Math.max(0, this.currentHp - amount);
    audioEngine.playRobloxSound('oof');

    // Phase transitions at 66% and 33%
    const hpPct = this.currentHp / this.activeBoss.maxHp;
    if (hpPct <= 0.33) {
      this.currentPhase = 3;
    } else if (hpPct <= 0.66) {
      this.currentPhase = 2;
    }

    if (this.currentHp <= 0) {
      const loot = this.activeBoss.drops;
      dailyMissionManager.recordAction('defeat_mob', 1);
      audioEngine.playMinecraftSound('levelup');

      if (this.attackTimer) clearInterval(this.attackTimer);
      this.telegraphedAttack = null;

      const bossDef = this.activeBoss;
      setTimeout(() => {
        this.activeBoss = null;
        this.notify();
      }, 5000);

      this.notify();
      return { defeated: true, loot };
    }

    this.notify();
    return { defeated: false };
  }

  public dismissBoss() {
    if (this.attackTimer) clearInterval(this.attackTimer);
    this.activeBoss = null;
    this.currentHp = 0;
    this.telegraphedAttack = null;
    this.notify();
  }
}

export const bossRaidManager = new BossRaidManager();
