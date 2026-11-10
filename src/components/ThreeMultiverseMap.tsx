/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { MultiverseZone, MULTIVERSE_ZONES } from './InteractiveWorldMapModal';
import { audioEngine } from '../utils/audioEngine';
import { 
  Compass, Navigation, Eye, Crosshair, ArrowUp, ArrowDown, 
  ArrowLeft, ArrowRight, RotateCcw, RotateCw, ChevronUp, ChevronDown, 
  ZoomIn, ZoomOut, Maximize2, Sparkles, MapPin, Layers, Zap
} from 'lucide-react';

// Pre-allocated math helpers at module scope for zero-GC render loop
const _vec3 = new THREE.Vector3();
const _vec3B = new THREE.Vector3();
const _vec3C = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _euler = new THREE.Euler();
const _mat4 = new THREE.Matrix4();
const _color = new THREE.Color();
const _raycaster = new THREE.Raycaster();
const _mouse = new THREE.Vector2();

interface ThreeMultiverseMapProps {
  zones: MultiverseZone[];
  selectedZone: MultiverseZone;
  onSelectZone: (zone: MultiverseZone) => void;
  playerX: number;
  playerY: number;
  playerAvatarName?: string;
  isRoutePlotted: boolean;
  onFastTravel: (x: number, y: number) => void;
}

export type MapCameraView = 'orbit_3d' | 'top_down' | 'horizon' | 'isometric' | 'player_vantage';

export default function ThreeMultiverseMap({
  zones,
  selectedZone,
  onSelectZone,
  playerX,
  playerY,
  playerAvatarName = 'Player',
  isRoutePlotted,
  onFastTravel,
}: ThreeMultiverseMapProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // UI state
  const [cameraView, setCameraView] = useState<MapCameraView>('orbit_3d');
  const [isNavDockCollapsed, setIsNavDockCollapsed] = useState(false);
  const [moveSpeedMode, setMoveSpeedMode] = useState<'normal' | 'turbo'>('normal');
  const [hoveredZone, setHoveredZone] = useState<MultiverseZone | null>(null);
  const [cameraHeadingDeg, setCameraHeadingDeg] = useState(0);

  // Active keys down for 6-directional navigation
  const keysDownRef = useRef<Set<string>>(new Set());

  // 3D Camera / Drone Navigation State
  // Allows moving: Up, Down, Left, Right, Forward, and Backward
  const navStateRef = useRef({
    // Camera target (lookAt point) in world space
    targetX: 0,
    targetY: 4,
    targetZ: 0,
    // Camera spherical offset around target
    yaw: 0.15, // horizontal angle
    pitch: 0.55, // elevation angle (approx 31 degrees)
    distance: 120, // distance from lookAt target
    // Smooth interpolated values
    currentX: 0,
    currentY: 4,
    currentZ: 0,
    currentYaw: 0.15,
    currentPitch: 0.55,
    currentDistance: 120,
    // Drag state
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
    startYaw: 0.15,
    startPitch: 0.55,
    // Turbo flight speed
    speedMultiplier: 1.0,
  });

  // Track props for animation loop without tearing down Three.js canvas
  const stateRef = useRef({
    zones,
    selectedZone,
    playerX,
    playerY,
    isRoutePlotted,
  });

  useEffect(() => {
    stateRef.current = {
      zones,
      selectedZone,
      playerX,
      playerY,
      isRoutePlotted,
    };
  }, [zones, selectedZone, playerX, playerY, isRoutePlotted]);

  // Focus smooth transition to a target zone or coordinate
  const flyToTarget = useCallback((worldX: number, worldZ: number, dist: number = 70) => {
    const nav = navStateRef.current;
    nav.targetX = worldX;
    nav.targetZ = worldZ;
    nav.targetY = 6;
    nav.distance = dist;
    nav.pitch = 0.48;
  }, []);

  // When selectedZone changes from outside, smoothly pan camera
  useEffect(() => {
    if (!selectedZone) return;
    // Map zone coordinates to 3D world space (scale 0.05)
    const target3dX = (selectedZone.mapX - 50) * 3.4;
    const target3dZ = (selectedZone.mapY - 50) * 3.0;
    flyToTarget(target3dX, target3dZ, 65);
  }, [selectedZone, flyToTarget]);

  // Three.js instances ref
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    zoneMeshes: Map<string, THREE.Group>;
    beaconMaterials: THREE.MeshBasicMaterial[];
    playerGroup: THREE.Group;
    routeLine: THREE.Line;
    routeSplineMesh: THREE.Mesh;
    particles: THREE.Points;
    starfield: THREE.Points;
    isSoftwareGl: boolean;
    animFrameId: number;
  } | null>(null);

  // Procedural Badge Billboard Texture Generator
  const createZoneBadgeTexture = (emoji: string, title: string, colorHex: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    // Rounded rectangle card background
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = colorHex;
    ctx.lineWidth = 6;

    const x = 8, y = 8, w = 240, h = 112, r = 24;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Emoji icon
    ctx.font = '48px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 64, 64);

    // Title text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(title.length > 11 ? title.substring(0, 10) + '…' : title, 110, 52);

    ctx.fillStyle = colorHex;
    ctx.font = 'bold 16px monospace';
    ctx.fillText('REALM MONUMENT', 110, 80);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };

  // =========================================================================
  // MAIN THREE.JS MOUNT & LIFECYCLE
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 550;

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x060814);
    scene.fog = new THREE.FogExp2(0x060814, 0.0035);

    const camera = new THREE.PerspectiveCamera(52, width / height, 0.5, 1000);
    camera.position.set(0, 70, 120);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 4. Studio Environment Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lights
    const hemiLight = new THREE.HemisphereLight(0x93c5fd, 0x1e1b4b, 0.9);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.8);
    dirLight.position.set(80, 140, 60);
    dirLight.castShadow = !isSoftwareGl;
    if (dirLight.shadow) {
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 350;
      const d = 160;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0005;
    }
    scene.add(dirLight);

    // Secondary rim light for dramatic depth
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-90, 80, -70);
    scene.add(rimLight);

    // 6. Starfield Nebula Particles
    const starCount = isSoftwareGl ? 350 : 1200;
    const starGeom = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 250 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = Math.max(10, radius * Math.cos(phi));
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Star tinting (cyan, gold, white, magenta)
      const rPick = Math.random();
      if (rPick < 0.3) {
        starColors[i * 3] = 0.4; starColors[i * 3 + 1] = 0.8; starColors[i * 3 + 2] = 1.0;
      } else if (rPick < 0.6) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.85; starColors[i * 3 + 2] = 0.4;
      } else {
        starColors[i * 3] = 0.9; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0;
      }
    }
    starGeom.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeom.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 2.2,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
    });
    const starfield = new THREE.Points(starGeom, starMat);
    scene.add(starfield);

    // 7. Base Ocean / Cosmic Grid Plane
    const oceanGeom = new THREE.PlaneGeometry(500, 400, 32, 32);
    const oceanMat = new THREE.MeshStandardMaterial({
      color: 0x0a1128,
      roughness: 0.3,
      metalness: 0.5,
    });
    const oceanMesh = new THREE.Mesh(oceanGeom, oceanMat);
    oceanMesh.rotation.x = -Math.PI / 2;
    oceanMesh.position.y = -2;
    oceanMesh.receiveShadow = !isSoftwareGl;
    scene.add(oceanMesh);

    // Holographic Grid Overlay
    const gridHelper = new THREE.GridHelper(360, 36, 0x10b981, 0x1e293b);
    gridHelper.position.y = -1.8;
    scene.add(gridHelper);

    // 8. Procedural 3D Continental Terrains (Floating Biome Islands)
    const continentsGroup = new THREE.Group();

    // Central Voxel Continents & Biome Islands
    const biomes = [
      { x: 0, z: 0, w: 90, h: 65, color: 0x10b981, name: 'Voxel Valley', height: 4.5 },
      { x: 75, z: -48, w: 65, h: 50, color: 0xef4444, name: 'Roblox Spire Shelf', height: 14.0 },
      { x: -75, z: -45, w: 60, h: 45, color: 0x0284c7, name: 'Sodor Coastal Hills', height: 5.5 },
      { x: -50, z: 45, w: 55, h: 45, color: 0x8b5cf6, name: 'Sprunki Neon Stage', height: 6.0 },
      { x: 55, z: 48, w: 50, h: 45, color: 0xf59e0b, name: 'Xilam Palm Lagoon', height: 3.5 },
      { x: 110, z: 50, w: 45, h: 40, color: 0x059669, name: 'Waitangi Sacred Fjord', height: 7.0 },
      { x: -115, z: -85, w: 70, h: 55, color: 0x38bdf8, name: 'Christmas Aurora Glacier', height: 9.5 },
      { x: -110, z: 20, w: 50, h: 40, color: 0x6366f1, name: 'Tarragower STEAM Spire', height: 8.0 },
      { x: 80, z: 5, w: 45, h: 40, color: 0x15803d, name: 'Helios Eco Basin', height: 5.0 },
      { x: 125, z: -35, w: 50, h: 45, color: 0xeab308, name: 'Golden Arches Megacity', height: 11.0 },
      { x: 25, z: -70, w: 45, h: 40, color: 0xe11d48, name: 'Creator Redstone Monolith', height: 12.0 },
      { x: -25, z: 75, w: 45, h: 40, color: 0x7c3aed, name: 'Aeternum Azoth Citadel', height: 8.5 },
    ];

    biomes.forEach(b => {
      // Sculpted 3-tier stepped plateau
      for (let tier = 0; tier < 3; tier++) {
        const factor = 1 - tier * 0.22;
        const tierHeight = b.height * 0.45;
        const boxGeom = new THREE.BoxGeometry(b.w * factor, tierHeight, b.h * factor);
        const boxMat = new THREE.MeshStandardMaterial({
          color: b.color,
          roughness: 0.65,
          metalness: 0.15,
        });
        const box = new THREE.Mesh(boxGeom, boxMat);
        box.position.set(b.x, tier * tierHeight + tierHeight / 2 - 1.5, b.z);
        box.castShadow = !isSoftwareGl;
        box.receiveShadow = !isSoftwareGl;
        continentsGroup.add(box);
      }
    });

    scene.add(continentsGroup);

    // 9. Zone Monuments & Beacons (13 Brands)
    const zoneMeshes = new Map<string, THREE.Group>();
    const beaconMaterials: THREE.MeshBasicMaterial[] = [];

    zones.forEach(zone => {
      const zoneGroup = new THREE.Group();
      // Map percentage to world units
      const posX = (zone.mapX - 50) * 3.4;
      const posZ = (zone.mapY - 50) * 3.0;
      const posY = 3.5;

      zoneGroup.position.set(posX, posY, posZ);

      // (A) Pedestal Base (Composite 3-part structure)
      const baseGeom = new THREE.CylinderGeometry(4.5, 5.5, 2.5, 16);
      const baseMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        metalness: 0.6,
        roughness: 0.3,
      });
      const baseMesh = new THREE.Mesh(baseGeom, baseMat);
      baseMesh.castShadow = !isSoftwareGl;
      baseMesh.receiveShadow = !isSoftwareGl;
      zoneGroup.add(baseMesh);

      // (B) Glowing Contact Ring
      const ringGeom = new THREE.RingGeometry(4.8, 6.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(zone.colorHex),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = 1.3;
      zoneGroup.add(ringMesh);

      // (C) Vertical Beacon Light Beam
      const beamHeight = 42;
      const beamGeom = new THREE.CylinderGeometry(0.7, 1.4, beamHeight, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(zone.colorHex),
        transparent: true,
        opacity: 0.35,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      beaconMaterials.push(beamMat);
      const beamMesh = new THREE.Mesh(beamGeom, beamMat);
      beamMesh.position.y = beamHeight / 2 + 1.2;
      zoneGroup.add(beamMesh);

      // (D) Floating 3D Holographic Billboard Badge
      const badgeTex = createZoneBadgeTexture(zone.brandBadge, zone.name.split(' ')[0], zone.colorHex);
      const spriteMat = new THREE.SpriteMaterial({
        map: badgeTex,
        transparent: true,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(16, 8, 1);
      sprite.position.y = 18;
      zoneGroup.add(sprite);

      // Tag for raycasting
      zoneGroup.userData = { zoneId: zone.id, zoneData: zone };

      scene.add(zoneGroup);
      zoneMeshes.set(zone.id, zoneGroup);
    });

    // 10. Plotted Travel Route Spline
    const routeLineGeom = new THREE.BufferGeometry();
    const routeLineMat = new THREE.LineDashedMaterial({
      color: 0x34d399,
      linewidth: 3,
      scale: 1,
      dashSize: 3,
      gapSize: 2,
    });
    const routeLine = new THREE.Line(routeLineGeom, routeLineMat);
    scene.add(routeLine);

    // 3D Tube Spline Mesh for Route
    const tubeGeom = new THREE.BufferGeometry();
    const tubeMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.8,
      roughness: 0.2,
      metalness: 0.8,
    });
    const routeSplineMesh = new THREE.Mesh(tubeGeom, tubeMat);
    scene.add(routeSplineMesh);

    // 11. 3D Player Location Marker (Composite Mini-Figure Pin)
    const playerGroup = new THREE.Group();

    // Beacon ring
    const pRingGeom = new THREE.RingGeometry(2.0, 3.2, 24);
    const pRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.9,
    });
    const pRing = new THREE.Mesh(pRingGeom, pRingMat);
    pRing.rotation.x = -Math.PI / 2;
    pRing.position.y = 0.1;
    playerGroup.add(pRing);

    // Steve head cube / avatar pin
    const headGeom = new THREE.BoxGeometry(2.2, 2.2, 2.2);
    const headMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      roughness: 0.3,
      metalness: 0.2,
    });
    const headMesh = new THREE.Mesh(headGeom, headMat);
    headMesh.position.y = 4.5;
    playerGroup.add(headMesh);

    // Floating YOU label sprite
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 256;
    pCanvas.height = 80;
    const pCtx = pCanvas.getContext('2d')!;
    pCtx.fillStyle = '#0891b2';
    pCtx.fillRect(10, 10, 236, 60);
    pCtx.strokeStyle = '#ffffff';
    pCtx.lineWidth = 4;
    pCtx.strokeRect(10, 10, 236, 60);
    pCtx.fillStyle = '#ffffff';
    pCtx.font = 'bold 24px monospace';
    pCtx.textAlign = 'center';
    pCtx.textBaseline = 'middle';
    pCtx.fillText(`YOU: ${playerAvatarName.toUpperCase()}`, 128, 40);

    const pTex = new THREE.CanvasTexture(pCanvas);
    pTex.colorSpace = THREE.SRGBColorSpace;
    const pSpriteMat = new THREE.SpriteMaterial({ map: pTex, transparent: true });
    const pSprite = new THREE.Sprite(pSpriteMat);
    pSprite.scale.set(12, 4, 1);
    pSprite.position.y = 9;
    playerGroup.add(pSprite);

    scene.add(playerGroup);

    // 12. Floating Energy Particles along travel routes
    const particleCount = isSoftwareGl ? 60 : 180;
    const partGeom = new THREE.BufferGeometry();
    const partPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      partPos[i * 3] = (Math.random() - 0.5) * 260;
      partPos[i * 3 + 1] = 4 + Math.random() * 22;
      partPos[i * 3 + 2] = (Math.random() - 0.5) * 220;
    }
    partGeom.setAttribute('position', new THREE.BufferAttribute(partPos, 3));
    const partMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 2.8,
      transparent: true,
      opacity: 0.75,
    });
    const particles = new THREE.Points(partGeom, partMat);
    scene.add(particles);

    threeRef.current = {
      scene,
      camera,
      renderer,
      zoneMeshes,
      beaconMaterials,
      playerGroup,
      routeLine,
      routeSplineMesh,
      particles,
      starfield,
      isSoftwareGl,
      animFrameId: 0,
    };

    // =========================================================================
    // 6-DIRECTIONAL NAVIGATION ANIMATION LOOP (Runs at 60-165 FPS)
    // =========================================================================
    let lastTime = performance.now();

    const animate = (timestamp: number) => {
      const delta = Math.min((timestamp - lastTime) / 1000, 0.1);
      lastTime = timestamp;

      const t = threeRef.current;
      if (!t) return;

      const nav = navStateRef.current;
      const current = stateRef.current;

      // -------------------------------------------------------------
      // 1. PROCESS 6-AXIS CONTINUOUS MOVEMENT KEYS (W, A, S, D, Q, E)
      // -------------------------------------------------------------
      const keys = keysDownRef.current;
      const baseMoveSpeed = (moveSpeedMode === 'turbo' ? 75 : 35) * delta;

      // Compute forward & strafe vectors based on current camera heading
      const forwardX = Math.sin(nav.yaw);
      const forwardZ = Math.cos(nav.yaw);
      const strafeX = Math.cos(nav.yaw);
      const strafeZ = -Math.sin(nav.yaw);

      // (A) Forward & Backward (W / S / Up / Down)
      if (keys.has('KeyW') || keys.has('ArrowUp')) {
        nav.targetX -= forwardX * baseMoveSpeed;
        nav.targetZ -= forwardZ * baseMoveSpeed;
      }
      if (keys.has('KeyS') || keys.has('ArrowDown')) {
        nav.targetX += forwardX * baseMoveSpeed;
        nav.targetZ += forwardZ * baseMoveSpeed;
      }

      // (B) Left & Right Strafe (A / D / Left / Right)
      if (keys.has('KeyA') || keys.has('ArrowLeft')) {
        nav.targetX -= strafeX * baseMoveSpeed;
        nav.targetZ -= strafeZ * baseMoveSpeed;
      }
      if (keys.has('KeyD') || keys.has('ArrowRight')) {
        nav.targetX += strafeX * baseMoveSpeed;
        nav.targetZ += strafeZ * baseMoveSpeed;
      }

      // (C) Up & Down Altitude (Space / Shift / Q / E / PageUp / PageDown)
      if (keys.has('Space') || keys.has('KeyQ') || keys.has('PageUp')) {
        nav.targetY = Math.min(100, nav.targetY + baseMoveSpeed * 1.1);
        nav.distance = Math.min(240, nav.distance + baseMoveSpeed * 0.8);
      }
      if (keys.has('ShiftLeft') || keys.has('ShiftRight') || keys.has('KeyE') || keys.has('PageDown')) {
        nav.targetY = Math.max(0, nav.targetY - baseMoveSpeed * 1.1);
        nav.distance = Math.max(25, nav.distance - baseMoveSpeed * 0.8);
      }

      // Clamp target within multiverse bounds
      nav.targetX = Math.max(-180, Math.min(180, nav.targetX));
      nav.targetZ = Math.max(-140, Math.min(140, nav.targetZ));

      // -------------------------------------------------------------
      // 2. SMOOTH EXPONENTIAL DAMPING (Zero Stutter Kinematics)
      // -------------------------------------------------------------
      nav.currentX = THREE.MathUtils.damp(nav.currentX, nav.targetX, 9, delta);
      nav.currentY = THREE.MathUtils.damp(nav.currentY, nav.targetY, 9, delta);
      nav.currentZ = THREE.MathUtils.damp(nav.currentZ, nav.targetZ, 9, delta);
      nav.currentYaw = THREE.MathUtils.damp(nav.currentYaw, nav.yaw, 10, delta);
      nav.currentPitch = THREE.MathUtils.damp(nav.currentPitch, nav.pitch, 10, delta);
      nav.currentDistance = THREE.MathUtils.damp(nav.currentDistance, nav.distance, 8, delta);

      // Compute 3D Camera Position from Spherical Coordinates
      const eyeX = nav.currentX + Math.sin(nav.currentYaw) * Math.cos(nav.currentPitch) * nav.currentDistance;
      const eyeY = nav.currentY + Math.sin(nav.currentPitch) * nav.currentDistance;
      const eyeZ = nav.currentZ + Math.cos(nav.currentYaw) * Math.cos(nav.currentPitch) * nav.currentDistance;

      t.camera.position.set(eyeX, eyeY, eyeZ);
      _vec3.set(nav.currentX, nav.currentY, nav.currentZ);
      t.camera.lookAt(_vec3);

      // Update Compass Heading
      const heading = ((nav.currentYaw * 180 / Math.PI) % 360 + 360) % 360;
      setCameraHeadingDeg(Math.round(heading));

      // -------------------------------------------------------------
      // 3. ANIMATE BEACONS, SPHERES & ROTATING BADGES
      // -------------------------------------------------------------
      const pulseTime = timestamp * 0.003;
      t.beaconMaterials.forEach(mat => {
        mat.opacity = 0.28 + Math.sin(pulseTime) * 0.12;
      });

      // Update Player Marker Position
      const pWorldX = (current.playerX / 4500) * 160;
      const pWorldZ = 12;
      t.playerGroup.position.set(pWorldX, 4 + Math.sin(pulseTime * 2) * 0.4, pWorldZ);
      t.playerGroup.rotation.y += delta * 0.8;

      // -------------------------------------------------------------
      // 4. ANIMATE 3D ROUTE SPLINE FROM PLAYER TO SELECTED ZONE
      // -------------------------------------------------------------
      if (current.selectedZone && current.isRoutePlotted) {
        const destX = (current.selectedZone.mapX - 50) * 3.4;
        const destZ = (current.selectedZone.mapY - 50) * 3.0;

        // Create 3D Arched Curve
        const midX = (pWorldX + destX) / 2;
        const midZ = (pWorldZ + destZ) / 2;
        const arcHeight = 18 + Math.min(30, Math.hypot(destX - pWorldX, destZ - pWorldZ) * 0.2);

        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(pWorldX, 4, pWorldZ),
          new THREE.Vector3(midX, arcHeight, midZ),
          new THREE.Vector3(destX, 6, destZ)
        );

        const points = curve.getPoints(24);
        t.routeLine.geometry.setFromPoints(points);
        t.routeLine.visible = true;

        // Tube geometry for solid glowing arch
        t.routeSplineMesh.geometry.dispose();
        t.routeSplineMesh.geometry = new THREE.TubeGeometry(curve, 32, 0.45, 8, false);
        t.routeSplineMesh.visible = true;
      } else {
        t.routeLine.visible = false;
        t.routeSplineMesh.visible = false;
      }

      // Rotate starfield slowly
      t.starfield.rotation.y += delta * 0.015;

      // Render
      t.renderer.render(t.scene, t.camera);

      t.animFrameId = requestAnimationFrame(animate);
    };

    threeRef.current.animFrameId = requestAnimationFrame(animate);

    // Resize handler
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
  }, [playerAvatarName]);

  // =========================================================================
  // KEYBOARD NAVIGATION LISTENER (Up, Down, Left, Right, Forward, Backward)
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't hijack input if user is typing in search
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;

      const code = e.code;
      keysDownRef.current.add(code);

      // Hotkey camera views
      if (code === 'KeyR') {
        // Reset camera
        const nav = navStateRef.current;
        nav.targetX = 0;
        nav.targetY = 4;
        nav.targetZ = 0;
        nav.yaw = 0.15;
        nav.pitch = 0.55;
        nav.distance = 120;
      } else if (code === 'KeyF') {
        // Focus selected zone
        if (selectedZone) {
          const target3dX = (selectedZone.mapX - 50) * 3.4;
          const target3dZ = (selectedZone.mapY - 50) * 3.0;
          flyToTarget(target3dX, target3dZ, 55);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysDownRef.current.delete(e.code);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedZone, flyToTarget]);

  // =========================================================================
  // MOUSE & TOUCH ORBIT / DRAG LISTENERS
  // =========================================================================
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only drag on left click (button 0)
    if (e.button !== 0) return;
    const nav = navStateRef.current;
    nav.isDragging = true;
    nav.dragStartX = e.clientX;
    nav.dragStartY = e.clientY;
    nav.startYaw = nav.yaw;
    nav.startPitch = nav.pitch;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const nav = navStateRef.current;
    const t = threeRef.current;

    // Drag Orbit
    if (nav.isDragging) {
      const dx = e.clientX - nav.dragStartX;
      const dy = e.clientY - nav.dragStartY;
      nav.yaw = nav.startYaw - dx * 0.006;
      nav.pitch = Math.max(0.08, Math.min(1.45, nav.startPitch + dy * 0.006));
      return;
    }

    // Raycast zone hover
    if (t && mountRef.current) {
      const rect = mountRef.current.getBoundingClientRect();
      _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      _raycaster.setFromCamera(_mouse, t.camera);
      const objectsToIntersect = Array.from(t.zoneMeshes.values());
      const intersects = _raycaster.intersectObjects(objectsToIntersect, true);

      if (intersects.length > 0) {
        // Find ancestor with zoneData
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && !obj.userData?.zoneData) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.zoneData) {
          setHoveredZone(obj.userData.zoneData);
          mountRef.current.style.cursor = 'pointer';
          return;
        }
      }
      setHoveredZone(null);
      mountRef.current.style.cursor = 'default';
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    navStateRef.current.isDragging = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const nav = navStateRef.current;
    const zoomFactor = e.deltaY > 0 ? 1.1 : 0.9;
    nav.distance = Math.max(25, Math.min(260, nav.distance * zoomFactor));
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    const t = threeRef.current;
    if (!t || !mountRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    _mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    _mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    _raycaster.setFromCamera(_mouse, t.camera);
    const objectsToIntersect = Array.from(t.zoneMeshes.values());
    const intersects = _raycaster.intersectObjects(objectsToIntersect, true);

    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0].object;
      while (obj && !obj.userData?.zoneData) {
        obj = obj.parent;
      }
      if (obj && obj.userData?.zoneData) {
        const clickedZone: MultiverseZone = obj.userData.zoneData;
        audioEngine.playRobloxSound('click');
        onSelectZone(clickedZone);
        // Smoothly zoom in to the clicked zone
        const target3dX = (clickedZone.mapX - 50) * 3.4;
        const target3dZ = (clickedZone.mapY - 50) * 3.0;
        flyToTarget(target3dX, target3dZ, 60);
      }
    }
  };

  // Preset Views Switcher
  const handleApplyPreset = (view: MapCameraView) => {
    setCameraView(view);
    const nav = navStateRef.current;
    if (view === 'orbit_3d') {
      nav.yaw = 0.2;
      nav.pitch = 0.52;
      nav.distance = 120;
    } else if (view === 'top_down') {
      nav.yaw = 0;
      nav.pitch = 1.48; // almost 90 deg straight down
      nav.distance = 150;
    } else if (view === 'horizon') {
      nav.yaw = 0.4;
      nav.pitch = 0.18; // low horizon grazing angle
      nav.distance = 95;
    } else if (view === 'isometric') {
      nav.yaw = Math.PI / 4;
      nav.pitch = 0.615; // 35.264 deg isometric angle
      nav.distance = 135;
    } else if (view === 'player_vantage') {
      const pWorldX = (playerX / 4500) * 160;
      flyToTarget(pWorldX, 12, 45);
    }
  };

  // Directional D-Pad button helpers
  const triggerMoveStep = (dir: 'forward' | 'back' | 'left' | 'right' | 'up' | 'down') => {
    const nav = navStateRef.current;
    const step = (moveSpeedMode === 'turbo' ? 24 : 12);
    const forwardX = Math.sin(nav.yaw);
    const forwardZ = Math.cos(nav.yaw);
    const strafeX = Math.cos(nav.yaw);
    const strafeZ = -Math.sin(nav.yaw);

    if (dir === 'forward') {
      nav.targetX -= forwardX * step;
      nav.targetZ -= forwardZ * step;
    } else if (dir === 'back') {
      nav.targetX += forwardX * step;
      nav.targetZ += forwardZ * step;
    } else if (dir === 'left') {
      nav.targetX -= strafeX * step;
      nav.targetZ -= strafeZ * step;
    } else if (dir === 'right') {
      nav.targetX += strafeX * step;
      nav.targetZ += strafeZ * step;
    } else if (dir === 'up') {
      nav.targetY = Math.min(100, nav.targetY + step);
      nav.distance = Math.min(240, nav.distance + step * 0.8);
    } else if (dir === 'down') {
      nav.targetY = Math.max(0, nav.targetY - step);
      nav.distance = Math.max(25, nav.distance - step * 0.8);
    }
  };

  const triggerRotateYaw = (deltaRad: number) => {
    navStateRef.current.yaw += deltaRad;
  };

  return (
    <div className="relative w-full h-full select-none overflow-hidden rounded-2xl bg-stone-950 font-mono">
      {/* Three.js Canvas Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-stone-950"
      />

      {/* Top Left: 3D Holographic Status Badge & Compass Heading */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 pointer-events-none">
        <div className="flex items-center gap-2 bg-stone-900/90 border border-emerald-500/50 px-3 py-1.5 rounded-xl shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          <span className="text-xs font-black text-emerald-300 tracking-wider">3D HOLOGRAPHIC MULTIVERSE</span>
          <span className="text-[10px] text-stone-400 bg-stone-800 px-1.5 py-0.5 rounded">
            {cameraView.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Live Compass Heading & Controls Key Hint */}
        <div className="flex items-center gap-2 bg-black/80 border border-stone-800 px-2.5 py-1 rounded-lg text-[10.5px] text-stone-300">
          <Compass size={13} className="text-amber-400 transform transition-transform" style={{ transform: `rotate(${-cameraHeadingDeg}deg)` }} />
          <span>Heading: <strong className="text-white">{cameraHeadingDeg}°</strong></span>
          <span className="text-stone-600">|</span>
          <span className="text-stone-400 text-[10px]">WASD: Move • Q/E: Up/Down</span>
        </div>
      </div>

      {/* Top Right: Hovered Zone Quick Inspector Card */}
      {hoveredZone && (
        <div className="absolute top-3 right-3 z-20 pointer-events-none animate-fade-in">
          <div className="flex items-center gap-2.5 bg-black/95 border-2 border-emerald-400/80 px-3.5 py-2 rounded-2xl shadow-2xl text-xs">
            <span className="text-2xl">{hoveredZone.brandBadge}</span>
            <div>
              <div className="text-white font-bold text-sm flex items-center gap-1.5">
                <span>{hoveredZone.name}</span>
                <span className="text-[10px] uppercase px-1.5 py-0.2 rounded" style={{ backgroundColor: `${hoveredZone.colorHex}40`, color: hoveredZone.colorHex }}>
                  {hoveredZone.brand}
                </span>
              </div>
              <div className="text-[10.5px] text-stone-300">
                Coords: X: {hoveredZone.x}, Y: {hoveredZone.y} • Click to View & Warp
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6-DIRECTIONAL 3D ON-SCREEN NAVIGATION D-PAD (UP, DOWN, LEFT, RIGHT, FORWARD, BACK) */}
      {/* ========================================================================= */}
      <div className="absolute bottom-20 left-4 z-20 pointer-events-auto">
        <div className="bg-stone-900/95 border-2 border-stone-700/80 rounded-2xl p-2.5 shadow-2xl flex flex-col gap-2">
          <div className="text-[10px] text-stone-400 font-bold uppercase tracking-wider text-center flex items-center justify-between gap-1">
            <span>3D Nav Pad</span>
            <button
              onClick={() => setMoveSpeedMode(m => m === 'normal' ? 'turbo' : 'normal')}
              className={`text-[9px] px-1.5 py-0.5 rounded font-bold cursor-pointer transition ${
                moveSpeedMode === 'turbo' 
                  ? 'bg-amber-500 text-black' 
                  : 'bg-stone-800 text-stone-300'
              }`}
              title="Toggle Move Speed (1x Normal vs 2x Turbo)"
            >
              {moveSpeedMode === 'turbo' ? '⚡ TURBO' : '1x SPEED'}
            </button>
          </div>

          {/* D-Pad Grid: Forward, Back, Left, Right */}
          <div className="grid grid-cols-3 gap-1 w-28 mx-auto">
            <div />
            <button
              onClick={() => triggerMoveStep('forward')}
              className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-emerald-600 text-white flex flex-col items-center justify-center cursor-pointer border border-stone-700 shadow"
              title="Move Forward [W / Arrow Up]"
            >
              <ArrowUp size={15} />
              <span className="text-[7.5px] font-bold">FWD</span>
            </button>
            <div />

            <button
              onClick={() => triggerMoveStep('left')}
              className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-emerald-600 text-white flex flex-col items-center justify-center cursor-pointer border border-stone-700 shadow"
              title="Move Left [A / Arrow Left]"
            >
              <ArrowLeft size={15} />
              <span className="text-[7.5px] font-bold">LFT</span>
            </button>
            <button
              onClick={() => {
                const nav = navStateRef.current;
                nav.targetX = 0;
                nav.targetY = 4;
                nav.targetZ = 0;
              }}
              className="w-9 h-9 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 flex flex-col items-center justify-center cursor-pointer border border-emerald-600 shadow"
              title="Center Map on Origin (0,0)"
            >
              <Crosshair size={14} />
              <span className="text-[7.5px] font-bold">CTR</span>
            </button>
            <button
              onClick={() => triggerMoveStep('right')}
              className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-emerald-600 text-white flex flex-col items-center justify-center cursor-pointer border border-stone-700 shadow"
              title="Move Right [D / Arrow Right]"
            >
              <ArrowRight size={15} />
              <span className="text-[7.5px] font-bold">RGT</span>
            </button>

            <div />
            <button
              onClick={() => triggerMoveStep('back')}
              className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-emerald-600 text-white flex flex-col items-center justify-center cursor-pointer border border-stone-700 shadow"
              title="Move Backward [S / Arrow Down]"
            >
              <ArrowDown size={15} />
              <span className="text-[7.5px] font-bold">BCK</span>
            </button>
            <div />
          </div>

          {/* Altitude Controls: Up (Ascend) & Down (Descend) */}
          <div className="grid grid-cols-2 gap-1 pt-1 border-t border-stone-800">
            <button
              onClick={() => triggerMoveStep('up')}
              className="py-1 px-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 active:bg-indigo-700 text-indigo-300 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer border border-indigo-700/60 shadow"
              title="Fly Up / Ascend [Space / Q]"
            >
              <span>⇪ UP</span>
            </button>
            <button
              onClick={() => triggerMoveStep('down')}
              className="py-1 px-2 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 active:bg-indigo-700 text-indigo-300 font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer border border-indigo-700/60 shadow"
              title="Fly Down / Descend [Shift / E]"
            >
              <span>⇩ DOWN</span>
            </button>
          </div>

          {/* Rotation Orbit Controls */}
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => triggerRotateYaw(0.25)}
              className="py-1 px-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] flex items-center justify-center gap-1 cursor-pointer border border-stone-700 shadow"
              title="Rotate Left"
            >
              <RotateCcw size={11} />
              <span>Pan L</span>
            </button>
            <button
              onClick={() => triggerRotateYaw(-0.25)}
              className="py-1 px-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-[10px] flex items-center justify-center gap-1 cursor-pointer border border-stone-700 shadow"
              title="Rotate Right"
            >
              <RotateCw size={11} />
              <span>Pan R</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SLEEK COLLAPSIBLE 3D VIEWPORT BOTTOM DOCK (Per Three.js Constitution) */}
      {/* ========================================================================= */}
      <div 
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 flex flex-col items-center max-w-[min(940px,94vw)]"
        style={{
          transform: `translateX(-50%) translateY(${isNavDockCollapsed ? 'calc(100% - 24px)' : '0px'})`
        }}
      >
        {/* Collapse Toggle Pill */}
        <button
          onClick={() => setIsNavDockCollapsed(c => !c)}
          className="mb-1 px-4 py-0.5 bg-black/90 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-700 rounded-t-xl text-[10px] font-mono flex items-center gap-1 shadow-lg cursor-pointer transition"
          title={isNavDockCollapsed ? 'Expand 3D Camera Controls' : 'Collapse 3D Controls (Full Viewport)'}
        >
          {isNavDockCollapsed ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          <span>{isNavDockCollapsed ? 'Show 3D Dock' : 'Cinema Mode'}</span>
        </button>

        {/* Dock Bar */}
        <div className="w-full bg-stone-900/95 border-2 border-stone-700/90 rounded-2xl shadow-2xl p-2 flex flex-wrap items-center justify-between gap-2.5 text-xs text-white">
          {/* Preset Camera Views */}
          <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-stone-800">
            <span className="text-[10px] text-stone-400 font-bold px-1.5">3D VIEW:</span>
            <button
              onClick={() => handleApplyPreset('orbit_3d')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraView === 'orbit_3d' 
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-300' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Orbital 3D
            </button>
            <button
              onClick={() => handleApplyPreset('isometric')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraView === 'isometric' 
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-300' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Isometric
            </button>
            <button
              onClick={() => handleApplyPreset('horizon')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraView === 'horizon' 
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-300' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Horizon
            </button>
            <button
              onClick={() => handleApplyPreset('top_down')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                cameraView === 'top_down' 
                  ? 'bg-emerald-600 text-white shadow ring-1 ring-emerald-300' 
                  : 'text-stone-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              Top-Down
            </button>
            <button
              onClick={() => handleApplyPreset('player_vantage')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition flex items-center gap-1 ${
                cameraView === 'player_vantage' 
                  ? 'bg-cyan-600 text-white shadow ring-1 ring-cyan-300' 
                  : 'text-cyan-300 hover:text-white hover:bg-stone-800'
              }`}
            >
              <MapPin size={11} />
              <span>Player Focus</span>
            </button>
          </div>

          {/* Zoom & Quick Reset Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                const nav = navStateRef.current;
                nav.distance = Math.max(25, nav.distance - 20);
              }}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg cursor-pointer transition border border-stone-700"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => {
                const nav = navStateRef.current;
                nav.distance = Math.min(260, nav.distance + 20);
              }}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg cursor-pointer transition border border-stone-700"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>

            {/* Fast Travel Button directly from 3D Viewport */}
            {selectedZone && (
              <button
                onClick={() => onFastTravel(selectedZone.x, selectedZone.y)}
                className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 border border-emerald-400/40"
                title={`Fast Travel to ${selectedZone.name}`}
              >
                <Zap size={13} className="text-yellow-300 animate-pulse" />
                <span>Warp to {selectedZone.brandBadge}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
