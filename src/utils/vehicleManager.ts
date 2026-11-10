/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { audioEngine } from './audioEngine';

export interface VehicleDefinition {
  id: string;
  name: string;
  brand: string;
  icon: string;
  description: string;
  topSpeedKmh: number;
  speedMultiplier: number;
  canFly: boolean;
  canHoverWater: boolean;
  hornSound: string;
  themeColor: string;
  fuelDrainRate: number; // per second when boosting
  fuelRechargeRate: number; // per second when idle
  specialAbility: string;
  avatarScale: number;
}

export const VEHICLE_CATALOG: VehicleDefinition[] = [
  {
    id: 'thomas',
    name: 'Thomas the Tank Engine #1',
    brand: 'Sodor Railway',
    icon: '🚂',
    description: 'The legendary blue E2 tank locomotive from the Island of Sodor. Chuffs along terrain and rails at high speed with billowing steam!',
    topSpeedKmh: 95,
    speedMultiplier: 2.2,
    canFly: false,
    canHoverWater: false,
    hornSound: 'train_whistle',
    themeColor: '#2563eb',
    fuelDrainRate: 8,
    fuelRechargeRate: 15,
    specialAbility: 'Steam Whistle Blast & Rail Track Auto-Glide',
    avatarScale: 1.0,
  },
  {
    id: 'bp_jetpack',
    name: 'BP High-Octane Photon Jetpack',
    brand: 'BP Energy',
    icon: '🚀',
    description: 'Dual-thruster aero-rig powered by high-octane biofuel. Enables instant vertical liftoff, air hovering, and forward sonic flight bursts.',
    topSpeedKmh: 140,
    speedMultiplier: 2.8,
    canFly: true,
    canHoverWater: true,
    hornSound: 'rocket_boost',
    themeColor: '#16a34a',
    fuelDrainRate: 14,
    fuelRechargeRate: 20,
    specialAbility: 'Hover Thrust & Vertical Rocket Ascent [Space]',
    avatarScale: 0.9,
  },
  {
    id: 'santa_sleigh',
    name: "Santa's Magic Flying Sleigh",
    brand: 'Christmas',
    icon: '🛷',
    description: 'Enchanted golden runner sleigh pulled by celestial Rudolph reindeer dust. Glides effortlessly across mountains and clouds.',
    topSpeedKmh: 120,
    speedMultiplier: 2.5,
    canFly: true,
    canHoverWater: true,
    hornSound: 'sleigh_bells',
    themeColor: '#dc2626',
    fuelDrainRate: 10,
    fuelRechargeRate: 18,
    specialAbility: 'Holiday Gift Dropper & Star Glitter Trail',
    avatarScale: 0.95,
  },
  {
    id: 'blox_kart',
    name: 'Roblox Hyper-Kart Obby Racer',
    brand: 'Roblox',
    icon: '🏎️',
    description: 'Neon-infused Bloxian go-kart equipped with twin speed coils. Sprints around obstacles with tire drift sparks and iconic physics defiance.',
    topSpeedKmh: 130,
    speedMultiplier: 3.0,
    canFly: false,
    canHoverWater: false,
    hornSound: 'kart_horn',
    themeColor: '#ef4444',
    fuelDrainRate: 12,
    fuelRechargeRate: 22,
    specialAbility: 'Drift Boost & Obby Jump Pad Launch',
    avatarScale: 0.9,
  },
  {
    id: 'sharko_jetski',
    name: "Sharko's Slapstick Aqua-Scooter",
    brand: 'Xilam',
    icon: '🦈',
    description: 'High-speed cartoon jet ski that skims across lakes and rivers with colossal splash waves. Bounces off rocks with rubber slapstick physics!',
    topSpeedKmh: 110,
    speedMultiplier: 2.4,
    canFly: false,
    canHoverWater: true,
    hornSound: 'cartoon_honk',
    themeColor: '#0284c7',
    fuelDrainRate: 9,
    fuelRechargeRate: 16,
    specialAbility: 'Hydro-Plane Water Skimming & 10-Ton Wave Splash',
    avatarScale: 0.95,
  },
  {
    id: 'lego_dragster',
    name: 'LEGO Technic Nitro Dragster',
    brand: 'LEGO',
    icon: '🧱',
    description: 'Built from 420 studded Technic bricks with functioning differential gears, rubber drag slicks, and dual exhaust pipes firing brick sparks!',
    topSpeedKmh: 155,
    speedMultiplier: 3.4,
    canFly: false,
    canHoverWater: false,
    hornSound: 'technic_click',
    themeColor: '#eab308',
    fuelDrainRate: 16,
    fuelRechargeRate: 25,
    specialAbility: 'Nitro Brick Wheelie & Sonic Acceleration',
    avatarScale: 0.95,
  },
  {
    id: 'jeremy_jet',
    name: 'Jeremy the Jet Plane (Steremy)',
    brand: 'Sodor Airport / Thomas & Friends',
    icon: '✈️',
    description: 'The iconic high-flying jet plane of Sodor Airport! Built with sleek swept wings, dual turbojet engines, and friendly cockpit smile. Soars over mountains and oceans at supersonic speeds.',
    topSpeedKmh: 220,
    speedMultiplier: 4.2,
    canFly: true,
    canHoverWater: true,
    hornSound: 'jet_engine_roar',
    themeColor: '#38bdf8',
    fuelDrainRate: 10,
    fuelRechargeRate: 22,
    specialAbility: 'Supersonic Jet Boost & High-Altitude Contrail Flight',
    avatarScale: 1.15,
  },
  {
    id: 'jeremy_xmas',
    name: 'Holiday Steremy the Christmas Jet',
    brand: 'Sodor Airport / Christmas',
    icon: '🛫',
    description: 'Festive holiday edition of Jeremy the Jet Plane! Decorated with twinkling Christmas fairy lights, peppermint candy turbine exhausts, and festive present drop bays.',
    topSpeedKmh: 240,
    speedMultiplier: 4.6,
    canFly: true,
    canHoverWater: true,
    hornSound: 'festive_jet_chime',
    themeColor: '#f43f5e',
    fuelDrainRate: 9,
    fuelRechargeRate: 25,
    specialAbility: 'Holiday Gift Air-Drop & Candy Cane Vapor Trail',
    avatarScale: 1.2,
  },
];

class VehicleManager {
  private activeVehicle: VehicleDefinition | null = null;
  private fuel: number = 100; // 0 to 100%
  private speedKmh: number = 0;
  private isBoosting: boolean = false;
  private isHeadlightsOn: boolean = true;
  private listeners: Set<() => void> = new Set();

  constructor() {
    // Passive fuel recharge loop
    setInterval(() => {
      if (!this.activeVehicle) return;
      if (!this.isBoosting && this.fuel < 100) {
        this.fuel = Math.min(100, this.fuel + (this.activeVehicle.fuelRechargeRate * 0.1));
        this.notify();
      }
    }, 100);
  }

  public subscribe(fn: () => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
  }

  public getCatalog(): VehicleDefinition[] {
    return VEHICLE_CATALOG;
  }

  public getActiveVehicle(): VehicleDefinition | null {
    return this.activeVehicle;
  }

  public getFuel(): number {
    return Math.round(this.fuel);
  }

  public getSpeedKmh(): number {
    return Math.round(this.speedKmh);
  }

  public getIsBoosting(): boolean {
    return this.isBoosting;
  }

  public getIsHeadlightsOn(): boolean {
    return this.isHeadlightsOn;
  }

  public toggleHeadlights(): boolean {
    this.isHeadlightsOn = !this.isHeadlightsOn;
    this.notify();
    return this.isHeadlightsOn;
  }

  public mountVehicle(vehicleId: string): boolean {
    const v = VEHICLE_CATALOG.find((veh) => veh.id === vehicleId);
    if (!v) return false;

    this.activeVehicle = v;
    this.fuel = 100;
    this.speedKmh = 0;
    this.isBoosting = false;

    audioEngine.playRobloxSound('coil');
    this.notify();
    return true;
  }

  public dismountVehicle(): void {
    if (!this.activeVehicle) return;
    this.activeVehicle = null;
    this.speedKmh = 0;
    this.isBoosting = false;
    audioEngine.playRobloxSound('step');
    this.notify();
  }

  public setDrivingSpeed(isMoving: boolean, isSprint: boolean): void {
    if (!this.activeVehicle) {
      this.speedKmh = 0;
      return;
    }

    if (!isMoving) {
      this.speedKmh = Math.max(0, this.speedKmh - 6);
      this.isBoosting = false;
    } else {
      const targetSpeed = isSprint 
        ? this.activeVehicle.topSpeedKmh 
        : this.activeVehicle.topSpeedKmh * 0.6;
      this.speedKmh = Math.min(targetSpeed, this.speedKmh + 8);

      if (isSprint && this.fuel > 0) {
        this.isBoosting = true;
        this.fuel = Math.max(0, this.fuel - (this.activeVehicle.fuelDrainRate * 0.05));
      } else {
        this.isBoosting = false;
      }
    }
    this.notify();
  }

  public honkHorn(): void {
    if (!this.activeVehicle) return;

    if (this.activeVehicle.id === 'thomas') {
      // Play multi-tone train whistle
      audioEngine.playRobloxSound('badge');
    } else if (this.activeVehicle.id === 'jeremy_jet' || this.activeVehicle.id === 'jeremy_xmas') {
      audioEngine.playRobloxSound('speed');
    } else if (this.activeVehicle.id === 'santa_sleigh') {
      audioEngine.playRobloxSound('badge');
    } else {
      audioEngine.playRobloxSound('cheezburger');
    }
  }
}

export const vehicleManager = new VehicleManager();
