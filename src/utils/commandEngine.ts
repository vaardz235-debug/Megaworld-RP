/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommandBlockData {
  id: string; // "x,y"
  x: number;
  y: number;
  command: string;
  mode: 'impulse' | 'chain' | 'repeat'; // Orange, Teal, Purple
  condition: 'unconditional' | 'conditional';
  redstone: 'needs_redstone' | 'always_active';
  customName?: string;
  lastOutput?: string;
  lastExecutedAt?: number;
  enabled: boolean;
}

export interface CommandContext {
  playerPos: { x: number; y: number };
  setPlayerPos: (pos: { x: number; y: number } | ((prev: { x: number; y: number }) => { x: number; y: number })) => void;
  timeOfDay: number;
  setTimeOfDay: (t: number | ((prev: number) => number)) => void;
  weather: 'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon';
  setWeather: (w: 'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon') => void;
  gameMode: 'survival' | 'creative';
  setGameMode: (m: 'survival' | 'creative') => void;
  inventory: Record<string, { count: number; durability?: number }>;
  setInventory: React.Dispatch<React.SetStateAction<Record<string, { count: number; durability?: number }>>>;
  setBlockAt: (x: number, y: number, block: string) => void;
  fillBlocksRegion?: (x1: number, y1: number, x2: number, y2: number, block: string) => void;
  showToast: (msg: string) => void;
  speakText?: (text: string) => void;
  playEffect?: (sound: string) => void;
  isFlying: boolean;
  setIsFlying: (f: boolean | ((p: boolean) => boolean)) => void;
  setHealth: React.Dispatch<React.SetStateAction<number>>;
  setHunger: React.Dispatch<React.SetStateAction<number>>;
  playerAvatarName?: string;
}

export interface CommandResult {
  success: boolean;
  message: string;
  command: string;
  timestamp: string;
}

// 200,000,000 Billion Blocks Boundary Constants
// 200,000,000 * 1,000,000,000 = 200,000,000,000,000,000 (200 Quadrillion blocks)
export const MAX_WORLD_COORDINATE = 200_000_000_000_000_000;
export const MIN_WORLD_COORDINATE = -200_000_000_000_000_000;

export const FAMOUS_COORDINATES = [
  { name: 'Spawn Ground Zero', x: 25, y: 7, desc: 'Original Starter Forest & Village' },
  { name: 'Celestial Verity Shrine', x: 86, y: 6, desc: 'Oracle Truth Altar & Starlight Portal' },
  { name: 'Outpost 1,000', x: 1000, y: 7, desc: 'Deep Pine Forest Wilderness' },
  { name: 'The Legendary Far Lands', x: 12550821, y: 7, desc: 'Voxel Horizon Anomaly & Swiss-Cheese Terrain' },
  { name: 'Billion-Block Ridge', x: 1000000000, y: 7, desc: 'Floating Amethyst Spire Archipelago' },
  { name: '29 Billion Outer Border', x: 29000000000, y: 7, desc: 'Quantum Sculk Void & Cosmic Horizon' },
  { name: '200,000,000 Billion Universe Edge', x: 200000000000000000, y: 7, desc: 'Multiverse Multithread Command Core' },
];

/**
 * Format huge numbers nicely for HUD and logs
 */
export function formatBlockNumber(n: number): string {
  if (Math.abs(n) >= 1_000_000_000_000_000) {
    const quadrillions = (n / 1_000_000_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return `${quadrillions}Q (${(n / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 0 })}B)`;
  }
  if (Math.abs(n) >= 1_000_000_000) {
    const billions = (n / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: 3 });
    return `${billions} Billion`;
  }
  if (Math.abs(n) >= 1_000_000) {
    const millions = (n / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: 2 });
    return `${millions}M`;
  }
  return n.toLocaleString();
}

/**
 * Execute Minecraft Console Command
 */
export function executeMinecraftCommand(
  rawCommand: string,
  context: CommandContext,
  sourceLabel: string = '@'
): CommandResult {
  const timestamp = new Date().toLocaleTimeString();
  const trimmed = rawCommand.trim();
  
  if (!trimmed) {
    return {
      success: false,
      message: 'Error: Empty command provided.',
      command: rawCommand,
      timestamp,
    };
  }

  // Remove leading slash if present
  const cmd = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;
  const tokens = cmd.split(/\s+/);
  const action = tokens[0]?.toLowerCase();

  switch (action) {
    // ----------------- /tp or /teleport -----------------
    case 'tp':
    case 'teleport': {
      if (tokens.length < 2) {
        return {
          success: false,
          message: 'Usage: /tp <x> [y] (Supports up to 200,000,000 Billion blocks!)',
          command: rawCommand,
          timestamp,
        };
      }

      let targetX = context.playerPos.x;
      let targetY = context.playerPos.y;

      const parseCoord = (arg: string, current: number) => {
        if (arg.startsWith('~')) {
          const delta = arg.length > 1 ? parseFloat(arg.slice(1)) : 0;
          return isNaN(delta) ? current : current + delta;
        }
        const val = parseFloat(arg.replace(/,/g, ''));
        return isNaN(val) ? current : val;
      };

      targetX = parseCoord(tokens[1], context.playerPos.x);
      if (tokens[2]) {
        targetY = Math.max(0, Math.min(48, Math.round(parseCoord(tokens[2], context.playerPos.y))));
      }

      // Clamp within 200,000,000 Billion Blocks
      targetX = Math.max(MIN_WORLD_COORDINATE, Math.min(MAX_WORLD_COORDINATE, Math.round(targetX)));

      context.setPlayerPos({ x: targetX, y: targetY });
      if (context.playEffect) context.playEffect('build');

      const msg = `[${sourceLabel}: Teleported ${context.playerAvatarName || 'player'} to X: ${formatBlockNumber(targetX)}, Y: ${targetY}]`;
      context.showToast(`✨ ${msg}`);
      return {
        success: true,
        message: msg,
        command: rawCommand,
        timestamp,
      };
    }

    // ----------------- /time set <day|night|noon|midnight|number> -----------------
    case 'time': {
      const sub = tokens[1]?.toLowerCase();
      const val = tokens[2]?.toLowerCase();
      if (sub === 'set') {
        let newTime = 20; // day
        if (val === 'day' || val === '1000') newTime = 20;
        else if (val === 'noon' || val === '6000') newTime = 40;
        else if (val === 'sunset' || val === '12000') newTime = 60;
        else if (val === 'night' || val === '14000') newTime = 75;
        else if (val === 'midnight' || val === '18000') newTime = 85;
        else if (!isNaN(parseFloat(val))) {
          newTime = Math.max(0, Math.min(100, Math.round(parseFloat(val))));
        } else {
          return {
            success: false,
            message: 'Usage: /time set <day|noon|sunset|night|midnight|0-100>',
            command: rawCommand,
            timestamp,
          };
        }
        context.setTimeOfDay(newTime);
        const timeName = newTime < 45 ? 'Day' : newTime < 65 ? 'Sunset' : newTime < 95 ? 'Night' : 'Dawn';
        const msg = `[${sourceLabel}: Set time of day to ${newTime} (${timeName})]`;
        context.showToast(`☀️ ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      return {
        success: false,
        message: 'Usage: /time set <day|night|noon|midnight|0-100>',
        command: rawCommand,
        timestamp,
      };
    }

    // ----------------- /weather <clear|rain|snow|storm|aurora|bloodmoon> -----------------
    case 'weather': {
      const type = tokens[1]?.toLowerCase();
      const valid: Array<'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon'> = [
        'sunny', 'rainy', 'snowy', 'stormy', 'aurora', 'bloodmoon'
      ];
      let targetWeather: 'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon' = 'sunny';
      if (type === 'clear' || type === 'sun' || type === 'sunny') targetWeather = 'sunny';
      else if (type === 'rain' || type === 'rainy') targetWeather = 'rainy';
      else if (type === 'snow' || type === 'snowy') targetWeather = 'snowy';
      else if (type === 'storm' || type === 'thunder' || type === 'stormy') targetWeather = 'stormy';
      else if (type === 'aurora') targetWeather = 'aurora';
      else if (type === 'bloodmoon' || type === 'blood') targetWeather = 'bloodmoon';
      else {
        return {
          success: false,
          message: 'Usage: /weather <clear|rain|snow|storm|aurora|bloodmoon>',
          command: rawCommand,
          timestamp,
        };
      }
      context.setWeather(targetWeather);
      const msg = `[${sourceLabel}: Changed weather to ${targetWeather.toUpperCase()}]`;
      context.showToast(`🌦️ ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /gamemode <survival|creative|0|1> -----------------
    case 'gamemode': {
      const mode = tokens[1]?.toLowerCase();
      let target: 'survival' | 'creative' = 'survival';
      if (mode === 'creative' || mode === 'c' || mode === '1') target = 'creative';
      else if (mode === 'survival' || mode === 's' || mode === '0') target = 'survival';
      else {
        return {
          success: false,
          message: 'Usage: /gamemode <survival|creative>',
          command: rawCommand,
          timestamp,
        };
      }
      context.setGameMode(target);
      const msg = `[${sourceLabel}: Set own game mode to ${target.toUpperCase()} Mode]`;
      context.showToast(`🎮 ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /give <item> [amount] -----------------
    case 'give': {
      const item = tokens[1]?.toLowerCase();
      if (!item) {
        return {
          success: false,
          message: 'Usage: /give <item_name> [amount]',
          command: rawCommand,
          timestamp,
        };
      }
      const count = Math.max(1, Math.min(640, parseInt(tokens[2] || '64', 10) || 64));
      context.setInventory(prev => ({
        ...prev,
        [item]: { count: (prev[item]?.count || 0) + count, durability: 100 },
      }));
      const msg = `[${sourceLabel}: Gave ${count} [${item}] to ${context.playerAvatarName || 'player'}]`;
      context.showToast(`📦 ${msg}`);
      if (context.playEffect) context.playEffect('build');
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /say <message> -----------------
    case 'say': {
      const text = tokens.slice(1).join(' ');
      if (!text) {
        return {
          success: false,
          message: 'Usage: /say <message>',
          command: rawCommand,
          timestamp,
        };
      }
      const msg = `[${sourceLabel}] ${text}`;
      context.showToast(`💬 ${msg}`);
      if (context.speakText) {
        context.speakText(text);
      }
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /effect give <speed|jump|regen|strength|clear> -----------------
    case 'effect': {
      const sub = tokens[1]?.toLowerCase();
      if (sub === 'clear') {
        context.setIsFlying(false);
        const msg = `[${sourceLabel}: Cleared all active effects]`;
        context.showToast(`✨ ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      const effectName = tokens[2]?.toLowerCase() || sub;
      if (effectName === 'speed' || effectName === 'levitation' || effectName === 'fly') {
        context.setIsFlying(true);
        const msg = `[${sourceLabel}: Applied Levitation / Speed Boost to player]`;
        context.showToast(`🚀 ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      if (effectName === 'regen' || effectName === 'heal') {
        context.setHealth(100);
        context.setHunger(100);
        const msg = `[${sourceLabel}: Restored player Health and Hunger to 100%]`;
        context.showToast(`💖 ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      return {
        success: false,
        message: 'Usage: /effect give <speed|fly|regen|heal> or /effect clear',
        command: rawCommand,
        timestamp,
      };
    }

    // ----------------- /setblock <x> <y> <block> -----------------
    case 'setblock': {
      if (tokens.length < 4) {
        return {
          success: false,
          message: 'Usage: /setblock <x> <y> <block_id>',
          command: rawCommand,
          timestamp,
        };
      }
      const bx = tokens[1].startsWith('~') 
        ? context.playerPos.x + (parseInt(tokens[1].slice(1), 10) || 0)
        : parseInt(tokens[1], 10);
      const by = tokens[2].startsWith('~') 
        ? context.playerPos.y + (parseInt(tokens[2].slice(1), 10) || 0)
        : parseInt(tokens[2], 10);
      const blockId = tokens[3].toLowerCase();

      context.setBlockAt(bx, by, blockId);
      const msg = `[${sourceLabel}: Placed block '${blockId}' at X: ${formatBlockNumber(bx)}, Y: ${by}]`;
      context.showToast(`🧱 ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /fill <x1> <y1> <x2> <y2> <block> -----------------
    case 'fill': {
      if (tokens.length < 6) {
        return {
          success: false,
          message: 'Usage: /fill <x1> <y1> <x2> <y2> <block_id>',
          command: rawCommand,
          timestamp,
        };
      }
      const parseCoord = (arg: string, cur: number) => 
        arg.startsWith('~') ? cur + (parseInt(arg.slice(1), 10) || 0) : parseInt(arg, 10);

      const x1 = parseCoord(tokens[1], context.playerPos.x);
      const y1 = parseCoord(tokens[2], context.playerPos.y);
      const x2 = parseCoord(tokens[3], context.playerPos.x);
      const y2 = parseCoord(tokens[4], context.playerPos.y);
      const block = tokens[5].toLowerCase();

      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.max(0, Math.min(48, Math.min(y1, y2)));
      const maxY = Math.max(0, Math.min(48, Math.max(y1, y2)));

      let count = 0;
      for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
          context.setBlockAt(x, y, block);
          count++;
          if (count > 2500) break; // Safety cap
        }
      }

      const msg = `[${sourceLabel}: Filled ${count} blocks with '${block}']`;
      context.showToast(`🏗️ ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /kill -----------------
    case 'kill': {
      context.setHealth(0);
      const msg = `[${sourceLabel}: Ouch! That looks like it hurt.]`;
      context.showToast(`💀 ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /clear -----------------
    case 'clear': {
      context.setInventory({});
      const msg = `[${sourceLabel}: Cleared the inventory of ${context.playerAvatarName || 'player'}]`;
      context.showToast(`🧹 ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /summon <entity> -----------------
    case 'summon': {
      const entity = tokens[1]?.toLowerCase() || 'fireworks';
      if (entity === 'lightning') {
        context.setWeather('stormy');
        const msg = `[${sourceLabel}: Summoned Cosmic Lightning Strike!]`;
        context.showToast(`⚡ ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      if (entity === 'fireworks') {
        const msg = `[${sourceLabel}: Launched Multiverse Fireworks Display!]`;
        context.showToast(`🎆 ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      const msg = `[${sourceLabel}: Summoned entity: ${entity}]`;
      context.showToast(`✨ ${msg}`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /locate <biome|far_lands|billion_ridge|frontier> -----------------
    case 'locate': {
      const target = tokens[1]?.toLowerCase();
      if (target === 'far_lands' || target === 'farlands') {
        const msg = `[${sourceLabel}: The Far Lands located at X: 12,550,821, Y: 7. Use /tp 12550821 7]`;
        context.showToast(`🧭 ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      if (target === 'billion_ridge' || target === 'billion') {
        const msg = `[${sourceLabel}: Billion-Block Ridge located at X: 1,000,000,000, Y: 7. Use /tp 1000000000 7]`;
        context.showToast(`🧭 ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      if (target === 'universe' || target === 'frontier' || target === 'edge') {
        const msg = `[${sourceLabel}: 200,000,000 Billion Universe Edge located at X: 200,000,000,000,000,000, Y: 7. Use /tp 200000000000000000 7]`;
        context.showToast(`🌌 ${msg}`);
        return { success: true, message: msg, command: rawCommand, timestamp };
      }
      const msg = `[${sourceLabel}: Available landmarks: /locate far_lands, /locate billion_ridge, /locate universe]`;
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    // ----------------- /help -----------------
    case 'help': {
      const msg = `[${sourceLabel}: Commands: /tp <x> [y], /time set <day|night>, /weather <clear|storm>, /gamemode <c|s>, /give <item> [amt], /say <msg>, /setblock <x> <y> <block>, /fill, /effect, /summon, /kill, /locate]`;
      context.showToast(`ℹ️ Check console output for command help.`);
      return { success: true, message: msg, command: rawCommand, timestamp };
    }

    default: {
      return {
        success: false,
        message: `Unknown command: /${action}. Type /help for available Minecraft commands.`,
        command: rawCommand,
        timestamp,
      };
    }
  }
}
