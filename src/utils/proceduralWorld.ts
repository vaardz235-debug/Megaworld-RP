/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 200,000,000 Billion Blocks World Engine
// Seamless procedural terrain generator capable of streaming chunks up to 200 Quadrillion coordinates!

export interface BiomeInfo {
  id: string;
  name: string;
  icon: string;
  surfaceBlock: string;
  subsurfaceBlock: string;
  deepBlock: string;
  hasTrees?: boolean;
  hasMushrooms?: boolean;
  hasCacti?: boolean;
  hasFlowers?: boolean;
  isSpecial?: boolean;
}

export function getBiomeForX(worldX: number): BiomeInfo {
  const absX = Math.abs(worldX);

  // 1. The 200,000,000 Billion Multiverse Horizon (200 Quadrillion Blocks!)
  if (absX >= 200_000_000_000_000_000 || absX >= 200_000_000_000) {
    return {
      id: 'universe_horizon',
      name: '🌌 200,000,000 Billion Multiverse Horizon',
      icon: '🌌',
      surfaceBlock: 'repeating_command_block',
      subsurfaceBlock: 'command_block',
      deepBlock: 'crying_obsidian',
      isSpecial: true,
    };
  }

  // 2. The 29 Billion Outer Border
  if (absX >= 29_000_000_000) {
    return {
      id: 'outer_border',
      name: '🪐 29 Billion Outer Border',
      icon: '🪐',
      surfaceBlock: 'sculk',
      subsurfaceBlock: 'crying_obsidian',
      deepBlock: 'netherite',
      isSpecial: true,
    };
  }

  // 3. Billion-Block Ridge (1,000,000,000+)
  if (absX >= 1_000_000_000) {
    return {
      id: 'billion_ridge',
      name: '⛰️ Billion-Block Ridge',
      icon: '⛰️',
      surfaceBlock: 'amethyst',
      subsurfaceBlock: 'stone',
      deepBlock: 'diamond',
      isSpecial: true,
    };
  }

  // 4. The Legendary Far Lands (12,550,821+)
  if (absX >= 12_550_821) {
    return {
      id: 'far_lands',
      name: '🌀 The Far Lands (Voxel Anomaly)',
      icon: '🌀',
      surfaceBlock: (absX % 2 === 0) ? 'crying_obsidian' : 'stone',
      subsurfaceBlock: 'obsidian',
      deepBlock: 'magma',
      isSpecial: true,
    };
  }

  // 5. Sodor International Airport & Supersonic Runway (Jeremy / Steremy Hub)
  if (absX >= 392 && absX <= 415) {
    return {
      id: 'sodor_airport',
      name: '✈️ Sodor International Airport & Runway (Jeremy / Steremy)',
      icon: '🛫',
      surfaceBlock: 'stone',
      subsurfaceBlock: 'obsidian',
      deepBlock: 'netherite',
      isSpecial: true,
    };
  }

  // Natural cycling biomes across the infinite procedural landscape
  const cycleIndex = Math.floor(absX / 30) % 6;
  switch (cycleIndex) {
    case 0:
      return {
        id: 'forest',
        name: '🌲 Emerald Forest',
        icon: '🌲',
        surfaceBlock: 'grass',
        subsurfaceBlock: 'dirt',
        deepBlock: 'stone',
        hasTrees: true,
        hasFlowers: true,
      };
    case 1:
      return {
        id: 'desert',
        name: '🏜️ Desert Dunes',
        icon: '🏜️',
        surfaceBlock: 'sand',
        subsurfaceBlock: 'sandstone',
        deepBlock: 'stone',
        hasCacti: true,
      };
    case 2:
      return {
        id: 'snowy',
        name: '❄️ Snow Tundra',
        icon: '❄️',
        surfaceBlock: 'snow',
        subsurfaceBlock: 'ice',
        deepBlock: 'stone',
      };
    case 3:
      return {
        id: 'nether',
        name: '🔥 Nether Wastes',
        icon: '🔥',
        surfaceBlock: 'magma',
        subsurfaceBlock: 'obsidian',
        deepBlock: 'netherite',
      };
    case 4:
      return {
        id: 'mushroom',
        name: '🍄 Deep Dark & Mushroom Island',
        icon: '🍄',
        surfaceBlock: 'mycelium',
        subsurfaceBlock: 'sculk',
        deepBlock: 'amethyst',
        hasMushrooms: true,
      };
    default:
      return {
        id: 'plains',
        name: '🌱 Radiant Plains & Geodes',
        icon: '🌱',
        surfaceBlock: 'grass',
        subsurfaceBlock: 'dirt',
        deepBlock: 'stone',
        hasFlowers: true,
      };
  }
}

/**
 * Procedural pseudo-random hash for deterministic block generation at any coordinate
 */
function pseudoHash(x: number, y: number, seed: number = 1337): number {
  let h = (x * 374761393 + y * 668265263 + seed) ^ (x >> 13);
  h = (h ^ (h >> 16)) * 0x85ebca6b;
  h = (h ^ (h >> 13)) * 0xc2b2ae35;
  return ((h ^ (h >> 16)) >>> 0) / 4294967296;
}

/**
 * Generate a vertical column of blocks for coordinate worldX (rows: 0 to 49)
 */
export function generateColumnBlocks(worldX: number, rows: number = 50): string[] {
  const biome = getBiomeForX(worldX);
  const column: string[] = new Array(rows);

  // Surface height formula
  let surfaceY = 6;
  if (biome.id === 'sodor_airport') {
    // Perfectly level supersonic airstrip tarmac
    surfaceY = 6;
  } else if (biome.id === 'far_lands') {
    // Wild swiss-cheese distortion in the Far Lands
    surfaceY = 5 + Math.floor(Math.sin(worldX * 0.45) * 4);
  } else if (biome.id === 'universe_horizon') {
    // Stepped quantum bedrock pillars
    surfaceY = 6 + (Math.abs(worldX) % 3);
  } else {
    // Smooth natural rolling hills
    surfaceY = 6 + Math.round(Math.sin(worldX * 0.12) * 1.5);
  }

  surfaceY = Math.max(3, Math.min(12, surfaceY));

  for (let r = 0; r < rows; r++) {
    if (r < surfaceY) {
      // Sky or Clouds
      if (r === 2 && (worldX % 14 === 0 || worldX % 14 === 1 || worldX % 14 === 2)) {
        column[r] = 'sky_cloud';
      } else {
        column[r] = 'sky';
      }
    } else if (r === surfaceY) {
      // Surface block
      column[r] = biome.surfaceBlock;
    } else if (r > surfaceY && r < surfaceY + 6) {
      // Subsurface layer
      column[r] = biome.subsurfaceBlock;
    } else {
      // Deep Underworld / Mineral Veins
      const rand = pseudoHash(worldX, r);
      if (biome.id === 'universe_horizon') {
        if (rand < 0.15) column[r] = 'command_block';
        else if (rand < 0.30) column[r] = 'repeating_command_block';
        else if (rand < 0.45) column[r] = 'chain_command_block';
        else if (rand < 0.60) column[r] = 'crying_obsidian';
        else if (rand < 0.75) column[r] = 'amethyst';
        else column[r] = 'diamond';
      } else if (biome.id === 'far_lands') {
        // Far lands perforation
        if (rand < 0.28) column[r] = 'sky'; // Swiss-cheese void pockets!
        else if (rand < 0.45) column[r] = 'crying_obsidian';
        else if (rand < 0.60) column[r] = 'obsidian';
        else if (rand < 0.75) column[r] = 'magma';
        else column[r] = 'stone';
      } else {
        if (rand < 0.035) column[r] = 'coal';
        else if (rand < 0.065) column[r] = 'ore';
        else if (rand < 0.085 && r > 18) column[r] = 'gold';
        else if (rand < 0.10 && r > 24) column[r] = 'diamond';
        else if (rand < 0.11 && r > 20) column[r] = 'emerald';
        else if (rand < 0.12 && r > 30) column[r] = 'netherite';
        else if (rand < 0.13 && r > 22) column[r] = 'amethyst';
        else column[r] = 'stone';
      }
    }
  }

  // Foliage & Runway decorations: Trees, Mushrooms, Cacti, Flowers, Runway Lights
  if (biome.id === 'sodor_airport') {
    // Sodor Airport Runway edge lights & launch pad
    if (worldX % 3 === 0 && surfaceY >= 1) {
      column[surfaceY - 1] = 'glowstone'; // Bright runway beacon light
    }
    if (Math.abs(worldX) === 400 && surfaceY >= 2) {
      column[surfaceY - 1] = 'repeating_command_block'; // Supersonic launch pad
      column[surfaceY - 2] = 'torch';
    }
  } else if (biome.hasTrees && worldX % 6 === 0 && surfaceY >= 4) {
    column[surfaceY - 1] = 'tree';
    column[surfaceY - 2] = 'tree';
    column[surfaceY - 3] = 'leaves';
  } else if (biome.hasMushrooms && worldX % 5 === 0 && surfaceY >= 3) {
    column[surfaceY - 1] = worldX % 2 === 0 ? 'mushroom_red' : 'mushroom_brown';
  } else if (biome.hasFlowers && worldX % 4 === 0 && surfaceY >= 2) {
    column[surfaceY - 1] = 'flower';
  }

  return column;
}
