import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { BLOCK_LOOT_INFO, BlockDetailMetadata } from './GameWorld';
import { CharacterData } from './CharacterAvatar';
import { audioEngine } from '../utils/audioEngine';
import { 
  Eye, Compass, Camera, Sparkles, Box, Maximize2, Minimize2, 
  RotateCw, Sun, Moon, CloudRain, Snowflake, Zap, Layers, 
  Crosshair, ChevronDown, ChevronUp, Swords, Hammer, Shield
} from 'lucide-react';

// Math helpers pre-allocated at module scope for zero-GC render loop
const _vec3 = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _mat4 = new THREE.Matrix4();
const _color = new THREE.Color();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

interface ThreeVoxelWorldProps {
  grid: string[];
  rows: number;
  cols: number;
  playerPos: { x: number; y: number };
  smoothPlayerPos: { x: number; y: number };
  playerAvatar: CharacterData;
  activeItem: string;
  isCreative: boolean;
  isFlying: boolean;
  isWalking: boolean;
  isSprinting: boolean;
  isJumping: boolean;
  facingDir: 'left' | 'right';
  weather: 'sunny' | 'rainy' | 'snowy' | 'stormy' | 'aurora' | 'bloodmoon';
  timeOfDay: number; // 0 to 100
  roamingCharacters: Array<{
    id: number;
    x: number;
    y: number;
    avatar: CharacterData;
    isWalking: boolean;
  }>;
  onMineBlock: (index: number) => void;
  onPlaceBlock: (index: number, faceNormal: { x: number; y: number; z: number }) => void;
  onPlayerMove: (dx: number, dy: number) => void;
  onInspectBlock?: (blockData: BlockDetailMetadata | null, blockType: string | null) => void;
  onTriggerAction?: () => void;
  onDropBeatbox?: () => void;
}

export type CameraPreset = 'third_person' | 'first_person' | 'isometric' | 'top_down' | 'free_orbit';

export default function ThreeVoxelWorld({
  grid,
  rows,
  cols,
  playerPos,
  smoothPlayerPos,
  playerAvatar,
  activeItem,
  isCreative,
  isFlying,
  isWalking,
  isSprinting,
  isJumping,
  facingDir,
  weather,
  timeOfDay,
  roamingCharacters,
  onMineBlock,
  onPlaceBlock,
  onPlayerMove,
  onInspectBlock,
  onTriggerAction,
  onDropBeatbox,
}: ThreeVoxelWorldProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // Camera & View controls
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('third_person');
  const [isDockCollapsed, setIsDockCollapsed] = useState(false);
  const [hoveredVoxel, setHoveredVoxel] = useState<{
    x: number;
    y: number;
    z: number;
    blockType: string;
    index: number;
    normal: { x: number; y: number; z: number };
  } | null>(null);

  // Orbit state for mouse dragging
  const orbitStateRef = useRef({
    isDragging: false,
    prevX: 0,
    prevY: 0,
    yaw: -0.3,
    pitch: 0.35,
    distance: 14,
  });

  // Reference hooks to allow Three.js loop to access fresh React state without re-mounting
  const stateRef = useRef({
    grid,
    playerPos,
    smoothPlayerPos,
    isWalking,
    isSprinting,
    isJumping,
    isFlying,
    facingDir,
    activeItem,
    cameraPreset,
    weather,
    timeOfDay,
    roamingCharacters,
  });

  useEffect(() => {
    stateRef.current = {
      grid,
      playerPos,
      smoothPlayerPos,
      isWalking,
      isSprinting,
      isJumping,
      isFlying,
      facingDir,
      activeItem,
      cameraPreset,
      weather,
      timeOfDay,
      roamingCharacters,
    };
  }, [
    grid, playerPos, smoothPlayerPos, isWalking, isSprinting, 
    isJumping, isFlying, facingDir, activeItem, cameraPreset, 
    weather, timeOfDay, roamingCharacters
  ]);

  // Three.js instances ref
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    blockMeshes: Map<string, THREE.InstancedMesh>;
    wireframeBox: THREE.LineSegments;
    playerGroup: THREE.Group;
    steveLimbs: {
      head: THREE.Group;
      torso: THREE.Mesh;
      leftArm: THREE.Group;
      rightArm: THREE.Group;
      leftLeg: THREE.Group;
      rightLeg: THREE.Group;
      heldItem: THREE.Group;
    };
    roamingGroups: Map<number, THREE.Group>;
    weatherSystem: THREE.Points;
    sunLight: THREE.DirectionalLight;
    hemiLight: THREE.HemisphereLight;
    ambientLight: THREE.AmbientLight;
    materials: Record<string, THREE.Material | THREE.Material[]>;
    particlePool: Array<{
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
    }>;
    debrisGroup: THREE.Group;
    animFrameId: number;
    isSoftwareGl: boolean;
  } | null>(null);

  // Procedural Canvas Texture Atlas Generator (Zero 404s)
  const generateProceduralTexture = useCallback((type: string, face: 'top' | 'side' | 'bottom' = 'side'): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Helper for procedural pixel noise
    const addPixelNoise = (baseColor: string, count: number, spread: number, alpha: number = 0.25) => {
      ctx.fillStyle = baseColor;
      for (let i = 0; i < count; i++) {
        const px = Math.floor(Math.random() * 32);
        const py = Math.floor(Math.random() * 32);
        ctx.fillStyle = `rgba(0,0,0,${Math.random() * alpha})`;
        ctx.fillRect(px, py, 2, 2);
      }
    };

    switch (type) {
      case 'grass':
        if (face === 'top') {
          ctx.fillStyle = '#558b2f';
          ctx.fillRect(0, 0, 32, 32);
          for (let i = 0; i < 40; i++) {
            ctx.fillStyle = Math.random() < 0.5 ? '#7cb342' : '#33691e';
            ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 2);
          }
        } else if (face === 'bottom') {
          ctx.fillStyle = '#795548';
          ctx.fillRect(0, 0, 32, 32);
          addPixelNoise('#4e342e', 45, 2, 0.3);
        } else {
          // Grass Side: dirt base with green dripping top
          ctx.fillStyle = '#795548';
          ctx.fillRect(0, 0, 32, 32);
          addPixelNoise('#4e342e', 30, 2, 0.3);
          ctx.fillStyle = '#558b2f';
          ctx.fillRect(0, 0, 32, 8);
          // Dripping grass blades
          for (let col = 0; col < 32; col += 3) {
            const h = 8 + Math.floor(Math.sin(col) * 4) + (col % 2 === 0 ? 3 : 0);
            ctx.fillRect(col, 8, 3, h);
          }
          ctx.fillStyle = '#7cb342';
          ctx.fillRect(0, 0, 32, 2);
        }
        break;

      case 'dirt':
        ctx.fillStyle = '#795548';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 50; i++) {
          ctx.fillStyle = Math.random() < 0.5 ? '#5d4037' : '#8d6e63';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 2);
        }
        break;

      case 'farmland':
        ctx.fillStyle = '#4e342e';
        ctx.fillRect(0, 0, 32, 32);
        // Moist furrows
        ctx.fillStyle = '#271c19';
        for (let y = 4; y < 32; y += 8) {
          ctx.fillRect(0, y, 32, 3);
        }
        break;

      case 'stone':
        ctx.fillStyle = '#78909c';
        ctx.fillRect(0, 0, 32, 32);
        // Cobblestone chisel cracks
        ctx.strokeStyle = '#455a64';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(2, 2, 12, 12);
        ctx.strokeRect(16, 2, 14, 12);
        ctx.strokeRect(2, 16, 14, 14);
        ctx.strokeRect(18, 16, 12, 14);
        addPixelNoise('#263238', 35, 2, 0.3);
        break;

      case 'wood':
      case 'tree':
        if (face === 'top' || face === 'bottom') {
          ctx.fillStyle = '#a1887f';
          ctx.fillRect(0, 0, 32, 32);
          ctx.strokeStyle = '#5d4037';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(16, 16, 11, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(16, 16, 6, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#3e2723';
          ctx.fillRect(15, 15, 2, 2);
        } else {
          // Vertical bark grain
          ctx.fillStyle = '#5d4037';
          ctx.fillRect(0, 0, 32, 32);
          for (let x = 0; x < 32; x += 4) {
            ctx.fillStyle = (x % 8 === 0) ? '#3e2723' : '#6d4c41';
            ctx.fillRect(x, 0, 2, 32);
          }
        }
        break;

      case 'leaves':
        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 60; i++) {
          ctx.fillStyle = Math.random() < 0.4 ? '#1b5e20' : Math.random() < 0.7 ? '#388e3c' : '#4caf50';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 3, 3);
        }
        break;

      case 'diamond':
      case 'emerald':
      case 'gold':
      case 'coal':
      case 'ore':
        // Base stone with crystal gemstone insets
        ctx.fillStyle = '#78909c';
        ctx.fillRect(0, 0, 32, 32);
        addPixelNoise('#37474f', 30, 2, 0.3);
        const gemColor = 
          type === 'diamond' ? '#22d3ee' :
          type === 'emerald' ? '#10b981' :
          type === 'gold' ? '#facc15' :
          type === 'coal' ? '#1e293b' : '#d97706';
        
        ctx.fillStyle = gemColor;
        // Inset clusters
        ctx.fillRect(6, 6, 6, 6);
        ctx.fillRect(19, 8, 7, 7);
        ctx.fillRect(9, 20, 8, 6);
        ctx.fillRect(22, 21, 5, 5);
        // Highlight reflection
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(7, 7, 2, 2);
        ctx.fillRect(20, 9, 2, 2);
        ctx.fillRect(10, 21, 2, 2);
        break;

      case 'bricks':
        ctx.fillStyle = '#b71c1c';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#cfd8dc'; // mortar
        ctx.fillRect(0, 8, 32, 2);
        ctx.fillRect(0, 18, 32, 2);
        ctx.fillRect(0, 28, 32, 2);
        ctx.fillRect(15, 0, 2, 8);
        ctx.fillRect(8, 10, 2, 8);
        ctx.fillRect(24, 10, 2, 8);
        ctx.fillRect(16, 20, 2, 8);
        break;

      case 'sand':
        ctx.fillStyle = '#fde047';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 40; i++) {
          ctx.fillStyle = Math.random() < 0.5 ? '#facc15' : '#eab308';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 2);
        }
        break;

      case 'sandstone':
        ctx.fillStyle = '#e2d9cc';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#bcaaa4';
        ctx.fillRect(0, 7, 32, 2);
        ctx.fillRect(0, 16, 32, 3);
        ctx.fillRect(0, 25, 32, 2);
        break;

      case 'snow':
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 2);
        }
        break;

      case 'ice':
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(4, 8);
        ctx.lineTo(24, 24);
        ctx.moveTo(18, 6);
        ctx.lineTo(8, 28);
        ctx.stroke();
        break;

      case 'amethyst':
        ctx.fillStyle = '#581c87';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#c084fc';
        // Crystal facet points
        ctx.beginPath();
        ctx.moveTo(16, 4);
        ctx.lineTo(28, 16);
        ctx.lineTo(16, 28);
        ctx.lineTo(4, 16);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#f3e8ff';
        ctx.fillRect(14, 14, 4, 4);
        break;

      case 'glowstone':
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 30; i++) {
          ctx.fillStyle = Math.random() < 0.5 ? '#fde047' : '#ffffff';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 3, 3);
        }
        break;

      case 'crying_obsidian':
        ctx.fillStyle = '#1e1b4b';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#c084fc';
        ctx.fillRect(6, 4, 4, 12);
        ctx.fillRect(20, 14, 5, 14);
        ctx.fillStyle = '#e879f9';
        ctx.fillRect(8, 8, 2, 4);
        ctx.fillRect(22, 18, 2, 5);
        break;

      case 'obsidian':
        ctx.fillStyle = '#150e28';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 25; i++) {
          ctx.fillStyle = '#2e1065';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 2);
        }
        break;

      case 'magma':
        ctx.fillStyle = '#261208';
        ctx.fillRect(0, 0, 32, 32);
        // Molten cracks
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(2, 8, 28, 4);
        ctx.fillRect(14, 4, 4, 24);
        ctx.fillStyle = '#fde047';
        ctx.fillRect(6, 9, 20, 2);
        ctx.fillRect(15, 6, 2, 20);
        break;

      case 'sculk':
        ctx.fillStyle = '#031722';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(12, 12, 8, 8);
        ctx.fillStyle = '#a5f3fc';
        ctx.fillRect(14, 14, 4, 4);
        break;

      case 'mycelium':
        ctx.fillStyle = '#6b7280';
        ctx.fillRect(0, 0, 32, 32);
        for (let i = 0; i < 35; i++) {
          ctx.fillStyle = Math.random() < 0.5 ? '#a855f7' : '#d8b4fe';
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 2);
        }
        break;

      case 'mushroom_red':
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(8, 8, 3, 0, Math.PI * 2);
        ctx.arc(24, 8, 3, 0, Math.PI * 2);
        ctx.arc(16, 20, 4, 0, Math.PI * 2);
        ctx.fill();
        break;

      case 'mushroom_brown':
        ctx.fillStyle = '#78350f';
        ctx.fillRect(0, 0, 32, 32);
        addPixelNoise('#451a03', 40, 2, 0.4);
        break;

      case 'sponge':
        ctx.fillStyle = '#ca8a04';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#713f12';
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 2, 0, Math.PI * 2);
          ctx.fill();
        }
        break;

      case 'jukebox':
        ctx.fillStyle = '#5d4037';
        ctx.fillRect(0, 0, 32, 32);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2;
        ctx.strokeRect(3, 3, 26, 26);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.arc(16, 16, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(15, 15, 2, 2);
        break;

      case 'water':
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#38bdf8';
        for (let y = 3; y < 32; y += 7) {
          ctx.fillRect(0, y, 32, 2);
        }
        break;

      case 'lava':
        ctx.fillStyle = '#ea580c';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#facc15';
        for (let i = 0; i < 20; i++) {
          ctx.fillRect(Math.floor(Math.random() * 32), Math.floor(Math.random() * 32), 4, 4);
        }
        break;

      case 'command_block':
        // Authentic Minecraft Impulse Command Block (Orange #c47037)
        ctx.fillStyle = '#c47037';
        ctx.fillRect(0, 0, 32, 32);
        // Beveled corner plates
        ctx.fillStyle = '#8f4b1e';
        ctx.fillRect(0, 0, 5, 5);
        ctx.fillRect(27, 0, 5, 5);
        ctx.fillRect(0, 27, 5, 5);
        ctx.fillRect(27, 27, 5, 5);
        ctx.strokeStyle = '#5c2d0c';
        ctx.lineWidth = 1;
        ctx.strokeRect(1, 1, 30, 30);
        // Center control panel square
        ctx.fillStyle = '#e0874e';
        ctx.fillRect(7, 7, 18, 18);
        ctx.strokeRect(7, 7, 18, 18);
        // Center glowing green command node
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.arc(16, 16, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#6ee7b7';
        ctx.fillRect(15, 15, 2, 2);
        // Indicator LEDs
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(9, 9, 2, 2);
        ctx.fillRect(21, 9, 2, 2);
        break;

      case 'chain_command_block':
        // Chain Command Block (Teal #3b846e)
        ctx.fillStyle = '#3b846e';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#235345';
        ctx.fillRect(0, 0, 5, 5);
        ctx.fillRect(27, 0, 5, 5);
        ctx.fillRect(0, 27, 5, 5);
        ctx.fillRect(27, 27, 5, 5);
        ctx.strokeStyle = '#134e4a';
        ctx.lineWidth = 1;
        ctx.strokeRect(1, 1, 30, 30);
        // Center panel
        ctx.fillStyle = '#4fa389';
        ctx.fillRect(7, 7, 18, 18);
        // Chain arrow
        ctx.fillStyle = '#115e59';
        ctx.beginPath();
        ctx.moveTo(16, 8);
        ctx.lineTo(23, 15);
        ctx.lineTo(19, 15);
        ctx.lineTo(19, 24);
        ctx.lineTo(13, 24);
        ctx.lineTo(13, 15);
        ctx.lineTo(9, 15);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#a7f3d0';
        ctx.fillRect(15, 13, 2, 4);
        break;

      case 'repeating_command_block':
        // Repeating Command Block (Purple #6a4697)
        ctx.fillStyle = '#6a4697';
        ctx.fillRect(0, 0, 32, 32);
        ctx.fillStyle = '#422464';
        ctx.fillRect(0, 0, 5, 5);
        ctx.fillRect(27, 0, 5, 5);
        ctx.fillRect(0, 27, 5, 5);
        ctx.fillRect(27, 27, 5, 5);
        ctx.strokeStyle = '#3b0764';
        ctx.lineWidth = 1;
        ctx.strokeRect(1, 1, 30, 30);
        // Center panel
        ctx.fillStyle = '#8b5cf6';
        ctx.fillRect(7, 7, 18, 18);
        // Looping circle / repeat core
        ctx.fillStyle = '#d946ef';
        ctx.beginPath();
        ctx.arc(16, 16, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#fdf4ff';
        ctx.fillRect(15, 15, 2, 2);
        // Repeating pulse ticks
        ctx.fillStyle = '#f0abfc';
        ctx.fillRect(15, 8, 2, 2);
        ctx.fillRect(15, 22, 2, 2);
        ctx.fillRect(8, 15, 2, 2);
        ctx.fillRect(22, 15, 2, 2);
        break;

      default:
        ctx.fillStyle = '#64748b';
        ctx.fillRect(0, 0, 32, 32);
        addPixelNoise('#334155', 30, 2, 0.3);
        break;
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }, []);

  // Steve / Avatar Procedural Face Texture
  const generateSteveFaceTexture = useCallback((skinType: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d')!;

    // Skin base
    ctx.fillStyle = '#c68642';
    ctx.fillRect(0, 0, 32, 32);

    // Hair
    ctx.fillStyle = '#4a2c11';
    ctx.fillRect(0, 0, 32, 10);
    ctx.fillRect(0, 10, 6, 8);
    ctx.fillRect(26, 10, 6, 8);

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(7, 14, 5, 4);
    ctx.fillRect(20, 14, 5, 4);
    // Iris (Steve blue or Alex green)
    ctx.fillStyle = skinType === 'alex' ? '#16a34a' : '#2563eb';
    ctx.fillRect(9, 15, 3, 3);
    ctx.fillRect(20, 15, 3, 3);

    // Nose
    ctx.fillStyle = '#a05c2a';
    ctx.fillRect(13, 18, 6, 3);

    // Beard / Mouth
    ctx.fillStyle = '#38220f';
    ctx.fillRect(11, 23, 10, 3);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    return texture;
  }, []);

  // Main Three.js Scene Setup & Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect software WebGL per Three.js skill
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 650;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#0284c7');
    scene.fog = new THREE.FogExp2('#0284c7', 0.012);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(playerPos.x, (rows - playerPos.y) + 4, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment reflection per Three.js skill
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio 3-point Lighting Rig
    const sunLight = new THREE.DirectionalLight('#fffbeb', 1.9);
    sunLight.position.set(40, 60, 40);
    sunLight.castShadow = !isSoftwareGl;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 180;
    const shadowD = 45;
    sunLight.shadow.camera.left = -shadowD;
    sunLight.shadow.camera.right = shadowD;
    sunLight.shadow.camera.top = shadowD;
    sunLight.shadow.camera.bottom = -shadowD;
    sunLight.shadow.bias = -0.0005;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);

    const hemiLight = new THREE.HemisphereLight('#60a5fa', '#334155', 0.75);
    scene.add(hemiLight);

    const ambientLight = new THREE.AmbientLight('#ffffff', 0.35);
    scene.add(ambientLight);

    // Materials Library Cache
    const blockTypes = Object.keys(BLOCK_LOOT_INFO).concat(['sky_cloud', 'door_closed', 'door_open']);
    const materials: Record<string, THREE.Material | THREE.Material[]> = {};

    blockTypes.forEach(type => {
      if (type === 'grass') {
        const top = new THREE.MeshStandardMaterial({ map: generateProceduralTexture('grass', 'top'), roughness: 0.85, metalness: 0.05 });
        const bottom = new THREE.MeshStandardMaterial({ map: generateProceduralTexture('grass', 'bottom'), roughness: 0.9, metalness: 0.0 });
        const side = new THREE.MeshStandardMaterial({ map: generateProceduralTexture('grass', 'side'), roughness: 0.85, metalness: 0.05 });
        materials[type] = [side, side, top, bottom, side, side];
      } else if (type === 'wood' || type === 'tree') {
        const top = new THREE.MeshStandardMaterial({ map: generateProceduralTexture('wood', 'top'), roughness: 0.8, metalness: 0.05 });
        const side = new THREE.MeshStandardMaterial({ map: generateProceduralTexture('wood', 'side'), roughness: 0.75, metalness: 0.05 });
        materials[type] = [side, side, top, top, side, side];
      } else if (type === 'water') {
        materials[type] = new THREE.MeshStandardMaterial({
          map: generateProceduralTexture('water'),
          transparent: true,
          opacity: 0.75,
          roughness: 0.1,
          metalness: 0.1,
        });
      } else if (type === 'lava' || type === 'glowstone' || type === 'magma') {
        materials[type] = new THREE.MeshStandardMaterial({
          map: generateProceduralTexture(type),
          emissive: new THREE.Color(type === 'glowstone' ? '#fde047' : '#ea580c'),
          emissiveIntensity: 0.8,
          roughness: 0.4,
          metalness: 0.1,
        });
      } else if (type === 'amethyst' || type === 'diamond' || type === 'emerald') {
        materials[type] = new THREE.MeshStandardMaterial({
          map: generateProceduralTexture(type),
          roughness: 0.25,
          metalness: 0.3,
          emissive: new THREE.Color(type === 'diamond' ? '#22d3ee' : type === 'emerald' ? '#10b981' : '#c084fc'),
          emissiveIntensity: 0.3,
        });
      } else if (type === 'command_block' || type === 'chain_command_block' || type === 'repeating_command_block') {
        materials[type] = new THREE.MeshStandardMaterial({
          map: generateProceduralTexture(type),
          roughness: 0.35,
          metalness: 0.2,
          emissive: new THREE.Color(
            type === 'command_block' ? '#c47037' :
            type === 'chain_command_block' ? '#115e59' : '#7e22ce'
          ),
          emissiveIntensity: 0.45,
        });
      } else {
        materials[type] = new THREE.MeshStandardMaterial({
          map: generateProceduralTexture(type),
          roughness: 0.8,
          metalness: 0.05,
        });
      }
    });

    // Voxel Geometry & Instanced Meshes
    const boxGeom = new THREE.BoxGeometry(1, 1, 1);
    const blockMeshes = new Map<string, THREE.InstancedMesh>();

    // Count maximum instances per block type
    const countsByType: Record<string, number> = {};
    for (let i = 0; i < grid.length; i++) {
      const type = grid[i];
      if (type && type !== 'sky') {
        countsByType[type] = (countsByType[type] || 0) + 1;
      }
    }

    // Allocate InstancedMeshes with headroom for live block placement
    blockTypes.forEach(type => {
      const maxCount = Math.max(300, (countsByType[type] || 0) + 150);
      const meshMat = materials[type] || materials['stone'];
      const instMesh = new THREE.InstancedMesh(boxGeom, meshMat, maxCount);
      instMesh.castShadow = !isSoftwareGl;
      instMesh.receiveShadow = !isSoftwareGl;
      instMesh.userData = { blockType: type };
      instMesh.count = 0;
      scene.add(instMesh);
      blockMeshes.set(type, instMesh);
    });

    // Populate Initial World Instances
    const typeInstanceCounts: Record<string, number> = {};
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = grid[r * cols + c];
        if (!type || type === 'sky') continue;

        const instMesh = blockMeshes.get(type);
        if (!instMesh) continue;

        const count = typeInstanceCounts[type] || 0;
        if (count >= instMesh.instanceMatrix.count) continue;

        const posX = c;
        const posY = rows - r;
        const posZ = 0; // Primary play plane

        _mat4.makeTranslation(posX, posY, posZ);
        instMesh.setMatrixAt(count, _mat4);
        typeInstanceCounts[type] = count + 1;
      }
    }

    // Update instance counts and matrices
    blockMeshes.forEach((mesh, type) => {
      mesh.count = typeInstanceCounts[type] || 0;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });

    // 3D Wireframe Hover Highlight Box
    const edgesGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(1.02, 1.02, 1.02));
    const wireframeMat = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
    const wireframeBox = new THREE.LineSegments(edgesGeom, wireframeMat);
    wireframeBox.visible = false;
    scene.add(wireframeBox);

    // ========================================================
    // COMPOSITE PROCEDURAL 3D STEVE CHARACTER (8-PART GROUP)
    // ========================================================
    const playerGroup = new THREE.Group();
    playerGroup.position.set(playerPos.x, rows - playerPos.y, 0);

    // Materials for Steve's procedural body
    const steveSkinMat = new THREE.MeshStandardMaterial({
      map: generateSteveFaceTexture(playerAvatar.subtype || 'steve'),
      roughness: 0.8,
      metalness: 0.05,
    });
    const steveShirtMat = new THREE.MeshStandardMaterial({
      color: 0x00a8a8, // Classic Cyan
      roughness: 0.75,
      metalness: 0.05,
    });
    const stevePantsMat = new THREE.MeshStandardMaterial({
      color: 0x223366, // Dark Blue
      roughness: 0.8,
      metalness: 0.05,
    });
    const steveShoeMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.85,
    });

    // 1. Head Group
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.6, 0);
    const headMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.5, 0.5), steveSkinMat);
    headMesh.castShadow = !isSoftwareGl;
    headGroup.add(headMesh);
    playerGroup.add(headGroup);

    // 2. Torso
    const torsoMesh = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.75, 0.3), steveShirtMat);
    torsoMesh.position.set(0, 1.0, 0);
    torsoMesh.castShadow = !isSoftwareGl;
    playerGroup.add(torsoMesh);

    // 3. Left Arm Group (pivot at shoulder)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.38, 1.3, 0);
    const leftArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.75, 0.25), steveSkinMat);
    leftArmMesh.position.set(0, -0.3, 0);
    leftArmMesh.castShadow = !isSoftwareGl;
    leftArmGroup.add(leftArmMesh);
    playerGroup.add(leftArmGroup);

    // 4. Right Arm Group (pivot at shoulder)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.38, 1.3, 0);
    const rightArmMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.75, 0.25), steveSkinMat);
    rightArmMesh.position.set(0, -0.3, 0);
    rightArmMesh.castShadow = !isSoftwareGl;
    rightArmGroup.add(rightArmMesh);

    // 5. Held Tool / Weapon in Right Hand
    const heldItemGroup = new THREE.Group();
    heldItemGroup.position.set(0, -0.65, 0.2);
    // Procedural Pickaxe in hand
    const handleMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.03, 0.7, 6),
      new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 })
    );
    handleMesh.rotation.x = Math.PI / 3;
    heldItemGroup.add(handleMesh);
    const pickHeadMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0x22d3ee, roughness: 0.2, metalness: 0.8 })
    );
    pickHeadMesh.position.set(0, 0.28, 0.24);
    pickHeadMesh.rotation.y = Math.PI / 4;
    heldItemGroup.add(pickHeadMesh);
    rightArmGroup.add(heldItemGroup);
    playerGroup.add(rightArmGroup);

    // 6. Left Leg Group (pivot at hip)
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.14, 0.65, 0);
    const leftLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.25), stevePantsMat);
    leftLegMesh.position.set(0, -0.35, 0);
    leftLegMesh.castShadow = !isSoftwareGl;
    leftLegGroup.add(leftLegMesh);
    playerGroup.add(leftLegGroup);

    // 7. Right Leg Group (pivot at hip)
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.14, 0.65, 0);
    const rightLegMesh = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.7, 0.25), stevePantsMat);
    rightLegMesh.position.set(0, -0.35, 0);
    rightLegMesh.castShadow = !isSoftwareGl;
    rightLegGroup.add(rightLegMesh);
    playerGroup.add(rightLegGroup);

    // 8. Contact Grounding Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(0.7, 0.7);
    const shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const contactShadow = new THREE.Mesh(shadowGeo, shadowMat);
    contactShadow.rotation.x = -Math.PI / 2;
    contactShadow.position.y = 0.02;
    playerGroup.add(contactShadow);

    scene.add(playerGroup);

    // 3D Weather System (Snow / Rain particles)
    const weatherParticleCount = 600;
    const weatherGeom = new THREE.BufferGeometry();
    const weatherPositions = new Float32Array(weatherParticleCount * 3);
    for (let i = 0; i < weatherParticleCount; i++) {
      weatherPositions[i * 3] = (Math.random() - 0.5) * 80 + playerPos.x;
      weatherPositions[i * 3 + 1] = Math.random() * 40 + (rows - playerPos.y);
      weatherPositions[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    weatherGeom.setAttribute('position', new THREE.BufferAttribute(weatherPositions, 3));
    const weatherMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.25,
      transparent: true,
      opacity: 0.7,
    });
    const weatherSystem = new THREE.Points(weatherGeom, weatherMat);
    scene.add(weatherSystem);

    // 3D Mining Debris Particle Pool
    const debrisGroup = new THREE.Group();
    scene.add(debrisGroup);
    const particlePool: Array<{
      mesh: THREE.Mesh;
      velocity: THREE.Vector3;
      life: number;
      maxLife: number;
    }> = [];
    const debrisGeom = new THREE.BoxGeometry(0.14, 0.14, 0.14);
    for (let i = 0; i < 30; i++) {
      const pMesh = new THREE.Mesh(debrisGeom, materials['stone'] as THREE.Material);
      pMesh.visible = false;
      debrisGroup.add(pMesh);
      particlePool.push({
        mesh: pMesh,
        velocity: new THREE.Vector3(),
        life: 0,
        maxLife: 1,
      });
    }

    // Roaming mobs 3D groups
    const roamingGroups = new Map<number, THREE.Group>();

    // Store in Ref
    threeRef.current = {
      scene,
      camera,
      renderer,
      blockMeshes,
      wireframeBox,
      playerGroup,
      steveLimbs: {
        head: headGroup,
        torso: torsoMesh,
        leftArm: leftArmGroup,
        rightArm: rightArmGroup,
        leftLeg: leftLegGroup,
        rightLeg: rightLegGroup,
        heldItem: heldItemGroup,
      },
      roamingGroups,
      weatherSystem,
      sunLight,
      hemiLight,
      ambientLight,
      materials,
      particlePool,
      debrisGroup,
      animFrameId: 0,
      isSoftwareGl,
    };

    // Pre-warm shaders
    if (!isSoftwareGl) {
      renderer.compile(scene, camera);
    }

    // ==========================================
    // 165 FPS HIGH REFRESH RATE ANIMATION LOOP
    // ==========================================
    let lastTime = performance.now();
    let walkCycleTime = 0;
    let mineSwingTime = 0;

    const animate = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const current = stateRef.current;
      const t = threeRef.current;
      if (!t) return;

      const pPos = current.smoothPlayerPos;
      const targetWorldX = pPos.x;
      const targetWorldY = rows - pPos.y;

      // Update Player Group Position
      t.playerGroup.position.x = targetWorldX;
      t.playerGroup.position.y = targetWorldY;
      t.playerGroup.position.z = 0;

      // Flip player facing direction
      const targetRotY = current.facingDir === 'left' ? -Math.PI / 2 : Math.PI / 2;
      t.playerGroup.rotation.y = THREE.MathUtils.damp(t.playerGroup.rotation.y, targetRotY, 15, delta);

      // Walk cycle animation
      if (current.isWalking) {
        const speedMultiplier = current.isSprinting ? 18 : 11;
        walkCycleTime += delta * speedMultiplier;
        const armSwing = Math.sin(walkCycleTime) * 0.65;
        const legSwing = Math.sin(walkCycleTime) * 0.65;

        t.steveLimbs.leftArm.rotation.x = armSwing;
        t.steveLimbs.rightArm.rotation.x = -armSwing;
        t.steveLimbs.leftLeg.rotation.x = -legSwing;
        t.steveLimbs.rightLeg.rotation.x = legSwing;
      } else {
        // Return limbs to idle
        t.steveLimbs.leftArm.rotation.x = THREE.MathUtils.damp(t.steveLimbs.leftArm.rotation.x, 0, 10, delta);
        t.steveLimbs.rightArm.rotation.x = THREE.MathUtils.damp(t.steveLimbs.rightArm.rotation.x, 0, 10, delta);
        t.steveLimbs.leftLeg.rotation.x = THREE.MathUtils.damp(t.steveLimbs.leftLeg.rotation.x, 0, 10, delta);
        t.steveLimbs.rightLeg.rotation.x = THREE.MathUtils.damp(t.steveLimbs.rightLeg.rotation.x, 0, 10, delta);
      }

      // Jump / Fly lean
      if (current.isJumping || current.isFlying) {
        t.steveLimbs.leftArm.rotation.z = -0.4;
        t.steveLimbs.rightArm.rotation.z = 0.4;
      } else {
        t.steveLimbs.leftArm.rotation.z = 0;
        t.steveLimbs.rightArm.rotation.z = 0;
      }

      // Mine swing animation
      if (mineSwingTime > 0) {
        mineSwingTime -= delta * 5;
        t.steveLimbs.rightArm.rotation.x = -1.2 + Math.sin(mineSwingTime * Math.PI) * 1.5;
      }

      // Dynamic Day/Night & Weather Lighting
      const timeRatio = current.timeOfDay / 100; // 0 to 1
      const sunAngle = timeRatio * Math.PI * 2;
      t.sunLight.position.x = targetWorldX + Math.cos(sunAngle) * 50;
      t.sunLight.position.y = Math.max(10, Math.sin(sunAngle) * 60 + 20);
      t.sunLight.position.z = Math.sin(sunAngle) * 40;

      // Adjust sky and fog colors
      if (current.weather === 'bloodmoon') {
        t.scene.background = _color.set('#450a0a');
        (t.scene.fog as THREE.FogExp2).color.set('#450a0a');
        t.sunLight.color.set('#ef4444');
      } else if (current.weather === 'aurora') {
        t.scene.background = _color.set('#042f2e');
        (t.scene.fog as THREE.FogExp2).color.set('#042f2e');
        t.sunLight.color.set('#34d399');
      } else if (current.weather === 'stormy') {
        t.scene.background = _color.set('#18181b');
        (t.scene.fog as THREE.FogExp2).color.set('#18181b');
        t.sunLight.color.set('#a855f7');
      } else if (current.timeOfDay < 50) {
        // Daytime
        t.scene.background = _color.set('#0284c7');
        (t.scene.fog as THREE.FogExp2).color.set('#0284c7');
        t.sunLight.color.set('#fffbeb');
      } else {
        // Night
        t.scene.background = _color.set('#020617');
        (t.scene.fog as THREE.FogExp2).color.set('#020617');
        t.sunLight.color.set('#93c5fd');
      }

      // Update Weather Particles
      const wPos = t.weatherSystem.geometry.attributes.position as THREE.BufferAttribute;
      const wArray = wPos.array as Float32Array;
      const fallSpeed = current.weather === 'stormy' ? 38 : current.weather === 'rainy' ? 24 : 8;

      for (let i = 0; i < weatherParticleCount; i++) {
        wArray[i * 3 + 1] -= fallSpeed * delta;
        if (wArray[i * 3 + 1] < targetWorldY - 15) {
          wArray[i * 3 + 1] = targetWorldY + 25;
          wArray[i * 3] = (Math.random() - 0.5) * 80 + targetWorldX;
          wArray[i * 3 + 2] = (Math.random() - 0.5) * 40;
        }
      }
      wPos.needsUpdate = true;

      // Update 3D Debris Particles
      t.particlePool.forEach(p => {
        if (p.life > 0) {
          p.life -= delta * 2;
          p.mesh.position.addScaledVector(p.velocity, delta);
          p.velocity.y -= 18 * delta; // Gravity
          p.mesh.rotation.x += p.velocity.x * delta * 5;
          p.mesh.rotation.y += p.velocity.z * delta * 5;
          p.mesh.scale.setScalar(Math.max(0.01, p.life));
          if (p.life <= 0) p.mesh.visible = false;
        }
      });

      // Update Roaming Mobs
      current.roamingCharacters.forEach(char => {
        let mobGroup = t.roamingGroups.get(char.id);
        if (!mobGroup) {
          mobGroup = new THREE.Group();
          // Sphere for Countryball or Mini cube for mobs
          const isBall = char.avatar.type === 'countryball';
          const mobGeom = isBall ? new THREE.SphereGeometry(0.35, 16, 16) : new THREE.BoxGeometry(0.5, 0.8, 0.4);
          const mobMat = new THREE.MeshStandardMaterial({
            color: char.avatar.type === 'countryball' ? 0xef4444 : 0x10b981,
            roughness: 0.6,
          });
          const mobMesh = new THREE.Mesh(mobGeom, mobMat);
          mobMesh.castShadow = !t.isSoftwareGl;
          mobGroup.add(mobMesh);
          t.scene.add(mobGroup);
          t.roamingGroups.set(char.id, mobGroup);
        }
        const mobX = char.x;
        const mobY = rows - char.y;
        mobGroup.position.x = THREE.MathUtils.damp(mobGroup.position.x, mobX, 8, delta);
        mobGroup.position.y = mobY + (Math.sin(now * 0.005 + char.id) * 0.08);
        mobGroup.position.z = 0;
      });

      // ==========================================
      // CAMERA SYSTEM (FOLLOW / FIRST / ISOMETRIC)
      // ==========================================
      const orbit = orbitStateRef.current;
      const cam = t.camera;

      if (current.cameraPreset === 'third_person') {
        const camDistance = 11;
        const camHeight = 4.5;
        const targetCamX = targetWorldX + Math.sin(orbit.yaw) * camDistance;
        const targetCamY = targetWorldY + camHeight + Math.sin(orbit.pitch) * 4;
        const targetCamZ = Math.cos(orbit.yaw) * camDistance;

        cam.position.x = THREE.MathUtils.damp(cam.position.x, targetCamX, 10, delta);
        cam.position.y = THREE.MathUtils.damp(cam.position.y, targetCamY, 10, delta);
        cam.position.z = THREE.MathUtils.damp(cam.position.z, targetCamZ, 10, delta);
        _vec3.set(targetWorldX, targetWorldY + 1.2, 0);
        cam.lookAt(_vec3);
        t.playerGroup.visible = true;
      } else if (current.cameraPreset === 'first_person') {
        // Camera right at Steve's eye position
        cam.position.set(targetWorldX, targetWorldY + 1.6, 0.1);
        const lookTargetX = targetWorldX + (current.facingDir === 'right' ? 10 : -10);
        _vec3.set(lookTargetX, targetWorldY + 1.6, 0);
        cam.lookAt(_vec3);
        // Steve's head invisible in first person so view is clear
        t.playerGroup.visible = false;
      } else if (current.cameraPreset === 'isometric') {
        // Classic 3D Isometric diorama tilt
        const targetCamX = targetWorldX + 16;
        const targetCamY = targetWorldY + 18;
        const targetCamZ = 22;

        cam.position.x = THREE.MathUtils.damp(cam.position.x, targetCamX, 8, delta);
        cam.position.y = THREE.MathUtils.damp(cam.position.y, targetCamY, 8, delta);
        cam.position.z = THREE.MathUtils.damp(cam.position.z, targetCamZ, 8, delta);
        _vec3.set(targetWorldX, targetWorldY, 0);
        cam.lookAt(_vec3);
        t.playerGroup.visible = true;
      } else if (current.cameraPreset === 'top_down') {
        cam.position.x = THREE.MathUtils.damp(cam.position.x, targetWorldX, 10, delta);
        cam.position.y = THREE.MathUtils.damp(cam.position.y, targetWorldY + 24, 10, delta);
        cam.position.z = THREE.MathUtils.damp(cam.position.z, 0.01, 10, delta);
        _vec3.set(targetWorldX, targetWorldY, 0);
        cam.lookAt(_vec3);
        t.playerGroup.visible = true;
      } else {
        // Free Orbit Mode
        const dist = orbit.distance;
        const camX = targetWorldX + Math.sin(orbit.yaw) * Math.cos(orbit.pitch) * dist;
        const camY = targetWorldY + Math.sin(orbit.pitch) * dist;
        const camZ = Math.cos(orbit.yaw) * Math.cos(orbit.pitch) * dist;

        cam.position.x = THREE.MathUtils.damp(cam.position.x, camX, 12, delta);
        cam.position.y = THREE.MathUtils.damp(cam.position.y, camY, 12, delta);
        cam.position.z = THREE.MathUtils.damp(cam.position.z, camZ, 12, delta);
        _vec3.set(targetWorldX, targetWorldY + 1, 0);
        cam.lookAt(_vec3);
        t.playerGroup.visible = true;
      }

      // Render Frame
      t.renderer.render(t.scene, t.camera);
      t.animFrameId = requestAnimationFrame(animate);
    };

    threeRef.current.animFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container || !threeRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      threeRef.current.camera.aspect = w / h;
      threeRef.current.camera.updateProjectionMatrix();
      threeRef.current.renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (threeRef.current) {
        cancelAnimationFrame(threeRef.current.animFrameId);
        threeRef.current.renderer.dispose();
        if (container.contains(threeRef.current.renderer.domElement)) {
          container.removeChild(threeRef.current.renderer.domElement);
        }
      }
    };
  }, []); // Run once on mount

  // Sync World Grid changes to InstancedMeshes
  useEffect(() => {
    const t = threeRef.current;
    if (!t) return;

    const typeInstanceCounts: Record<string, number> = {};

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const type = grid[r * cols + c];
        if (!type || type === 'sky') continue;

        const instMesh = t.blockMeshes.get(type);
        if (!instMesh) continue;

        const count = typeInstanceCounts[type] || 0;
        if (count >= instMesh.instanceMatrix.count) continue;

        const posX = c;
        const posY = rows - r;
        const posZ = 0;

        _mat4.makeTranslation(posX, posY, posZ);
        instMesh.setMatrixAt(count, _mat4);
        typeInstanceCounts[type] = count + 1;
      }
    }

    t.blockMeshes.forEach((mesh, type) => {
      mesh.count = typeInstanceCounts[type] || 0;
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [grid, rows, cols]);

  // Raycasting & Pointer Interactions (Hover & Mining & Placement)
  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const t = threeRef.current;
    const container = mountRef.current;
    if (!t || !container) return;

    // Handle camera orbit drag
    const orbit = orbitStateRef.current;
    if (orbit.isDragging) {
      const deltaX = e.clientX - orbit.prevX;
      const deltaY = e.clientY - orbit.prevY;
      orbit.prevX = e.clientX;
      orbit.prevY = e.clientY;
      orbit.yaw -= deltaX * 0.008;
      orbit.pitch = Math.max(-0.6, Math.min(1.2, orbit.pitch + deltaY * 0.008));
      return;
    }

    const rect = container.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, t.camera);

    const meshes = Array.from(t.blockMeshes.values()).filter(m => m.count > 0);
    const intersects = _raycaster.intersectObjects(meshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const instId = hit.instanceId;
      const mesh = hit.object as THREE.InstancedMesh;

      if (instId !== undefined) {
        mesh.getMatrixAt(instId, _mat4);
        _vec3.setFromMatrixPosition(_mat4);

        const voxelX = Math.round(_vec3.x);
        const voxelY = Math.round(_vec3.y);
        const voxelZ = Math.round(_vec3.z);
        const gridRow = rows - voxelY;
        const gridCol = voxelX;
        const gridIndex = gridRow * cols + gridCol;
        const blockType = grid[gridIndex] || (mesh.userData.blockType as string);

        const normal = hit.face ? {
          x: Math.round(hit.face.normal.x),
          y: Math.round(hit.face.normal.y),
          z: Math.round(hit.face.normal.z),
        } : { x: 0, y: 1, z: 0 };

        setHoveredVoxel({
          x: voxelX,
          y: voxelY,
          z: voxelZ,
          blockType,
          index: gridIndex,
          normal,
        });

        // Position 3D wireframe box around targeted voxel
        t.wireframeBox.position.set(voxelX, voxelY, voxelZ);
        t.wireframeBox.visible = true;

        if (onInspectBlock) {
          const detail = BLOCK_LOOT_INFO[blockType] || null;
          onInspectBlock(detail, blockType);
        }
        return;
      }
    }

    setHoveredVoxel(null);
    t.wireframeBox.visible = false;
    if (onInspectBlock) onInspectBlock(null, null);
  }, [grid, rows, cols, onInspectBlock]);

  // Pointer Down for drag orbit
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Middle button or right button or Alt key initiates free orbit
    if (e.button === 1 || e.button === 2 || e.altKey) {
      orbitStateRef.current.isDragging = true;
      orbitStateRef.current.prevX = e.clientX;
      orbitStateRef.current.prevY = e.clientY;
    }
  };

  const handlePointerUp = () => {
    orbitStateRef.current.isDragging = false;
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const orbit = orbitStateRef.current;
    orbit.distance = Math.max(4, Math.min(32, orbit.distance + e.deltaY * 0.02));
  };

  // Spawn Bursting 3D Debris Particles on Mining
  const trigger3DDebris = useCallback((x: number, y: number, z: number, blockType: string) => {
    const t = threeRef.current;
    if (!t) return;

    const blockColor = BLOCK_LOOT_INFO[blockType]?.color || '#90a4ae';
    const mat = (t.materials[blockType] || t.materials['stone']) as THREE.Material;

    let spawned = 0;
    for (const p of t.particlePool) {
      if (p.life <= 0) {
        p.mesh.position.set(
          x + (Math.random() - 0.5) * 0.8,
          y + (Math.random() - 0.5) * 0.8,
          z + (Math.random() - 0.5) * 0.8
        );
        p.velocity.set(
          (Math.random() - 0.5) * 8,
          Math.random() * 6 + 2,
          (Math.random() - 0.5) * 8
        );
        p.life = 1.0;
        p.maxLife = 1.0;
        p.mesh.material = mat;
        p.mesh.visible = true;
        spawned++;
        if (spawned >= 10) break;
      }
    }
  }, []);

  // Click on targeted 3D Voxel: Left Click = Mine, Right Click = Place
  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (orbitStateRef.current.isDragging) return;

    if (e.button === 0 && !e.shiftKey) {
      // Left Click: Mine Block
      if (hoveredVoxel && hoveredVoxel.index >= 0 && hoveredVoxel.index < grid.length) {
        trigger3DDebris(hoveredVoxel.x, hoveredVoxel.y, hoveredVoxel.z, hoveredVoxel.blockType);
        onMineBlock(hoveredVoxel.index);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (hoveredVoxel) {
      // Right Click: Place Active Block adjacent to targeted face normal
      onPlaceBlock(hoveredVoxel.index, hoveredVoxel.normal);
      audioEngine.playMinecraftSound('build');
    }
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-3xl">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        onContextMenu={handleContextMenu}
        className="w-full h-full cursor-crosshair bg-stone-950"
      />

      {/* Crosshair in Center for Raycasting Target */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-4 h-4 border border-white/50 rounded-full flex items-center justify-center">
          <div className="w-1 h-1 bg-white rounded-full shadow" />
        </div>
      </div>

      {/* Top Left: 3D Engine & Biome Spec Badge */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/85 backdrop-blur-md border border-cyan-500/50 px-3 py-1.5 rounded-xl shadow-xl font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
          <span className="text-xs font-black text-cyan-300 tracking-wider">3D WEBGL VOXEL ENGINE</span>
          <span className="text-[10px] text-stone-400 bg-stone-800/80 px-1.5 py-0.5 rounded">
            {cameraPreset.replace('_', ' ').toUpperCase()}
          </span>
        </div>
      </div>

      {/* Top Right: Targeted Voxel Inspector Pill */}
      {hoveredVoxel && (
        <div className="absolute top-4 right-4 z-20 pointer-events-none">
          <div className="flex items-center gap-2 bg-black/90 backdrop-blur-md border border-amber-400/60 px-3.5 py-1.5 rounded-xl shadow-2xl font-mono text-xs">
            <span className="text-base">{BLOCK_LOOT_INFO[hoveredVoxel.blockType]?.icon || '🧱'}</span>
            <div>
              <span className="text-amber-300 font-bold capitalize">{hoveredVoxel.blockType.replace('_', ' ')}</span>
              <span className="text-[10px] text-stone-400 ml-2">
                [X:{hoveredVoxel.x} Y:{hoveredVoxel.y}]
              </span>
            </div>
            <span className="text-[10px] text-cyan-300 bg-cyan-950/80 border border-cyan-500/40 px-1.5 py-0.5 rounded">
              L-Click: Mine | R-Click: Place
            </span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COLLAPSIBLE 3D BOTTOM CONTROL DOCK (Zero Viewport Occlusion per Skill) */}
      {/* ========================================================================= */}
      <div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 flex flex-col items-center max-w-[min(940px,96vw)]"
        style={{
          transform: `translateX(-50%) translateY(${isDockCollapsed ? 'calc(100% - 24px)' : '0px'})`
        }}
      >
        {/* Dock Collapse Toggle Button */}
        <button
          onClick={() => setIsDockCollapsed(prev => !prev)}
          className="mb-1 px-4 py-0.5 bg-black/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700/80 rounded-t-xl text-[10px] font-mono flex items-center gap-1 shadow-lg cursor-pointer transition active:scale-95"
          title={isDockCollapsed ? 'Expand 3D Control Dock' : 'Collapse 3D Control Dock (Cinema Mode)'}
        >
          {isDockCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          <span>{isDockCollapsed ? 'Show 3D Dock' : 'Zen Cinema Mode'}</span>
        </button>

        {/* Horizontal Control Dock Bar */}
        <div className="w-full bg-stone-900/95 border-2 border-stone-700/90 rounded-2xl shadow-2xl p-2.5 flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-white">
          {/* Camera View Switcher */}
          <div className="flex items-center gap-1.5 bg-black/60 p-1 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 font-bold px-1.5">CAM:</span>
            <button
              onClick={() => setCameraPreset('third_person')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraPreset === 'third_person'
                  ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="Third Person 3D Over-the-Shoulder Camera"
            >
              Third-Person
            </button>
            <button
              onClick={() => setCameraPreset('first_person')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraPreset === 'first_person'
                  ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="First Person View through Steve's eyes"
            >
              First-Person
            </button>
            <button
              onClick={() => setCameraPreset('isometric')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraPreset === 'isometric'
                  ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="Classic 3D Isometric Perspective"
            >
              Isometric 3D
            </button>
            <button
              onClick={() => setCameraPreset('free_orbit')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraPreset === 'free_orbit'
                  ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
              title="Free 360° Mouse Orbit & Zoom"
            >
              Free Orbit
            </button>
          </div>

          {/* Quick 3D Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (hoveredVoxel) {
                  trigger3DDebris(hoveredVoxel.x, hoveredVoxel.y, hoveredVoxel.z, hoveredVoxel.blockType);
                  onMineBlock(hoveredVoxel.index);
                } else if (onTriggerAction) {
                  onTriggerAction();
                }
              }}
              className="px-3 py-1.5 bg-red-600/30 hover:bg-red-600/50 border border-red-500/50 rounded-xl text-red-200 font-bold flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
              title="Mine targeted 3D block (Left Click or M key)"
            >
              <Hammer size={14} className="text-red-400" />
              <span>Mine Block</span>
            </button>

            <button
              onClick={() => {
                if (hoveredVoxel) {
                  onPlaceBlock(hoveredVoxel.index, hoveredVoxel.normal);
                }
              }}
              className="px-3 py-1.5 bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 rounded-xl text-emerald-200 font-bold flex items-center gap-1.5 cursor-pointer shadow transition active:scale-95"
              title="Place active item in 3D (Right Click)"
            >
              <Box size={14} className="text-emerald-400" />
              <span>Place [{activeItem}]</span>
            </button>

            {onDropBeatbox && (
              <button
                onClick={onDropBeatbox}
                className="px-2.5 py-1.5 bg-orange-600/30 hover:bg-orange-600/50 border border-orange-500/50 rounded-xl text-orange-200 font-bold flex items-center gap-1 cursor-pointer shadow transition active:scale-95"
                title="Drop Sprunki Beatbox Rhythm"
              >
                <Sparkles size={13} className="text-orange-400" />
                <span>Beatbox</span>
              </button>
            )}
          </div>

          {/* Mouse Drag Help Hint */}
          <div className="text-[10px] text-stone-400 hidden lg:flex items-center gap-2">
            <span>🖱️ <strong className="text-yellow-300">Right-Click Drag / Alt</strong> to orbit 3D view</span>
            <span>|</span>
            <span>📜 <strong className="text-yellow-300">Scroll</strong> to zoom</span>
          </div>
        </div>
      </div>
    </div>
  );
}
