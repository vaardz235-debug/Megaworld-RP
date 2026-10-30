/**
 * Integrated Low-Latency Proximity Voice Chat Engine
 * 'United Games and Apps of Sprnuki Thomas and Friends' RPG
 * Supports Proximity Spatial Audio, Party Radio, Server Broadcast & Moderation Suite.
 */

import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export type VoiceChannel = 'proximity' | 'party' | 'server';
export type TransmissionMode = 'ptt' | 'vad';

export interface VoiceUser {
  id: string;
  name: string;
  avatarType: string;
  avatarColor: string;
  channel: VoiceChannel;
  isSpeaking: boolean;
  isMuted: boolean;
  volume: number; // 0 to 2 (1 = 100%)
  x: number; // grid tile coordinate
  y: number;
  distanceToLocal?: number;
  effectiveVolume?: number; // after proximity attenuation
  pan?: number; // -1 (left) to 1 (right)
  role: 'member' | 'party_leader' | 'moderator' | 'admin';
}

export interface ModerationReport {
  id: string;
  reporterUid: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: 'trolling' | 'mic_spam' | 'harassment' | 'offensive_language' | 'other';
  channel: VoiceChannel;
  timestamp: number;
  audioSnapshotDesc: string;
}

const DEFAULT_VOICE_USERS: VoiceUser[] = [
  {
    id: 'roamer-101',
    name: 'Alex (Minecraft)',
    avatarType: 'minecraft',
    avatarColor: 'bg-emerald-600',
    channel: 'proximity',
    isSpeaking: false,
    isMuted: false,
    volume: 1.0,
    x: 8,
    y: 6,
    role: 'member',
  },
  {
    id: 'roamer-105',
    name: 'Oren (Sprunki Beat 1)',
    avatarType: 'sprnuki',
    avatarColor: 'bg-orange-500',
    channel: 'proximity',
    isSpeaking: true,
    isMuted: false,
    volume: 1.0,
    x: 5,
    y: 6,
    role: 'member',
  },
  {
    id: 'roamer-185',
    name: 'Verity (Oracle of Truth)',
    avatarType: 'sprnuki',
    avatarColor: 'bg-purple-600',
    channel: 'party',
    isSpeaking: false,
    isMuted: false,
    volume: 1.2,
    x: 86,
    y: 6,
    role: 'party_leader',
  },
  {
    id: 'roamer-501',
    name: 'Classic Noob (Roblox)',
    avatarType: 'roblox',
    avatarColor: 'bg-blue-600',
    channel: 'proximity',
    isSpeaking: false,
    isMuted: false,
    volume: 0.9,
    x: 2,
    y: 6,
    role: 'member',
  },
  {
    id: 'roamer-14',
    name: 'Thomas (Island of Sodor)',
    avatarType: 'train',
    avatarColor: 'bg-blue-700',
    channel: 'server',
    isSpeaking: false,
    isMuted: false,
    volume: 1.1,
    x: 30,
    y: 6,
    role: 'moderator',
  },
  {
    id: 'roamer-40',
    name: 'Poland (Countryballs)',
    avatarType: 'countryball',
    avatarColor: 'bg-red-500',
    channel: 'proximity',
    isSpeaking: false,
    isMuted: false,
    volume: 1.0,
    x: 24,
    y: 6,
    role: 'member',
  },
  {
    id: 'roamer-110',
    name: 'Oggy (Xilam Cartoon)',
    avatarType: 'xilam',
    avatarColor: 'bg-sky-500',
    channel: 'party',
    isSpeaking: false,
    isMuted: false,
    volume: 1.0,
    x: 18,
    y: 6,
    role: 'member',
  },
];

class VoiceChatEngine {
  private audioCtx: AudioContext | null = null;
  private micStream: MediaStream | null = null;
  private micSource: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private pannerMap: Map<string, StereoPannerNode> = new Map();
  private gainMap: Map<string, GainNode> = new Map();

  // Voice Settings & State
  public channel: VoiceChannel = 'proximity';
  public transmissionMode: TransmissionMode = 'ptt';
  public isMicActive: boolean = false;
  public isPushToTalkHeld: boolean = false;
  public isSelfMuted: boolean = false;
  public isDeafened: boolean = false;
  public micSensitivity: number = 25; // 0-100 threshold
  public inputGain: number = 1.0;
  public outputVolume: number = 1.0;
  public noiseFilterEnabled: boolean = true;
  public simulatedMicActive: boolean = false;

  public get isTransmitting(): boolean {
    if (this.isSelfMuted) return false;
    if (this.transmissionMode === 'ptt') {
      return this.isPushToTalkHeld;
    }
    return this.isMicActive || this.simulatedMicActive;
  }

  // Connected Users
  public users: VoiceUser[] = [...DEFAULT_VOICE_USERS];
  public mutedUserIds: Set<string> = new Set();
  public userVolumes: Map<string, number> = new Map();

  // Spatial Range Max
  public readonly PROXIMITY_MAX_RANGE = 15; // tiles

  private animFrameId: number | null = null;
  private spectrumBins: number[] = [0, 0, 0, 0, 0, 0, 0, 0];

  constructor() {
    this.initAudioNodes();
  }

  private initAudioNodes() {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 32;
        this.analyser.smoothingTimeConstant = 0.65;
      }
    } catch (e) {
      console.warn('AudioContext init failed, voice chat will use simulated stream:', e);
    }
  }

  /**
   * Request Real Microphone Stream from Browser
   */
  public async requestMicrophone(): Promise<{ success: boolean; error?: string }> {
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume().catch(() => {});
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });

      this.micStream = stream;
      if (this.audioCtx && this.analyser) {
        this.micSource = this.audioCtx.createMediaStreamSource(stream);
        this.micSource.connect(this.analyser);
      }
      this.isMicActive = true;
      this.simulatedMicActive = false;
      this.startSpectrumLoop();

      this.emitState();
      return { success: true };
    } catch (err: any) {
      console.warn('Microphone permission denied or unavailable. Fallback to interactive simulated audio loop:', err);
      this.isMicActive = true;
      this.simulatedMicActive = true;
      this.startSpectrumLoop();
      this.emitState();
      return {
        success: true,
        error: 'Live microphone permission was denied; simulated vocal feedback enabled for testing!',
      };
    }
  }

  /**
   * Toggle Mute Self
   */
  public toggleMuteSelf(): boolean {
    this.isSelfMuted = !this.isSelfMuted;
    if (this.micStream) {
      this.micStream.getAudioTracks().forEach((track) => {
        track.enabled = !this.isSelfMuted;
      });
    }
    this.emitState();
    return this.isSelfMuted;
  }

  /**
   * Toggle Deafen (Mute All Incoming Voice)
   */
  public toggleDeafen(): boolean {
    this.isDeafened = !this.isDeafened;
    this.emitState();
    return this.isDeafened;
  }

  /**
   * Switch Voice Channel
   */
  public setChannel(channel: VoiceChannel) {
    this.channel = channel;
    this.emitState();
  }

  /**
   * Switch Transmission Mode
   */
  public setTransmissionMode(mode: TransmissionMode) {
    this.transmissionMode = mode;
    this.emitState();
  }

  /**
   * Push to Talk Key Down / Pointer Down
   */
  public setPushToTalk(active: boolean) {
    this.isPushToTalkHeld = active;
    this.emitState();
  }

  /**
   * Check if local user is currently transmitting voice
   */
  public isCurrentlyTransmitting(): boolean {
    if (this.isSelfMuted || this.isDeafened || !this.isMicActive) return false;
    if (this.transmissionMode === 'ptt') {
      return this.isPushToTalkHeld;
    }
    // VAD: check if loudest spectrum bin exceeds sensitivity threshold
    const peak = Math.max(...this.spectrumBins);
    return peak >= this.micSensitivity;
  }

  /**
   * Mute / Unmute individual peer
   */
  public toggleMutePeer(userId: string) {
    if (this.mutedUserIds.has(userId)) {
      this.mutedUserIds.delete(userId);
    } else {
      this.mutedUserIds.add(userId);
    }
    this.emitState();
  }

  /**
   * Adjust individual peer volume (0 to 200%)
   */
  public setPeerVolume(userId: string, volume: number) {
    this.userVolumes.set(userId, Math.max(0, Math.min(2, volume)));
    this.emitState();
  }

  /**
   * Calculate Proximity Spatial Attenuation & Panning
   * Computes Euclidean distance and directional stereo panning for each nearby user.
   */
  public updateProximityAudio(localPlayerX: number, localPlayerY: number): VoiceUser[] {
    const updatedUsers = this.users.map((user) => {
      const isMutedByLocal = this.mutedUserIds.has(user.id);
      const customVol = this.userVolumes.get(user.id) ?? 1.0;

      // Distance calculation in grid tiles
      const dx = user.x - localPlayerX;
      const dy = user.y - localPlayerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Stereo pan: -1 (left) to 1 (right)
      const pan = Math.max(-1, Math.min(1, dx / 8));

      // Channel handling
      let effectiveVolume = 0;
      if (!this.isDeafened && !isMutedByLocal) {
        if (this.channel === 'server') {
          // Global broadcast: heard by everyone equally
          effectiveVolume = this.outputVolume * customVol * user.volume;
        } else if (this.channel === 'party') {
          // Party channel: heard clearly by party members
          effectiveVolume = user.channel === 'party' ? this.outputVolume * customVol * user.volume : 0;
        } else {
          // Proximity channel: strictly attenuated by distance
          if (dist <= this.PROXIMITY_MAX_RANGE) {
            // Linear falloff curve from 1.0 at 0 dist down to 0 at MAX_RANGE
            const falloff = Math.max(0, 1 - dist / this.PROXIMITY_MAX_RANGE);
            effectiveVolume = this.outputVolume * customVol * user.volume * falloff;
          } else {
            effectiveVolume = 0;
          }
        }
      }

      return {
        ...user,
        distanceToLocal: parseFloat(dist.toFixed(1)),
        effectiveVolume: parseFloat(effectiveVolume.toFixed(2)),
        pan: parseFloat(pan.toFixed(2)),
        isMuted: isMutedByLocal,
      };
    });

    return updatedUsers;
  }

  /**
   * Submit Moderation Report to Cloud Database
   */
  public async submitModerationReport(report: Omit<ModerationReport, 'id' | 'timestamp'>): Promise<boolean> {
    const reportId = `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const fullReport: ModerationReport = {
      ...report,
      id: reportId,
      timestamp: Date.now(),
    };

    try {
      const docRef = doc(db, 'voice_moderation', reportId);
      await setDoc(docRef, fullReport);
    } catch (e) {
      console.warn('Voice moderation report cloud log fallback:', e);
    }

    // Auto-mute the reported user locally for immediate protection
    this.mutedUserIds.add(report.reportedUserId);
    this.emitState();
    return true;
  }

  /**
   * Real-time spectrum analysis loop
   */
  private startSpectrumLoop() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

    const updateLoop = () => {
      if (this.isMicActive && !this.isSelfMuted) {
        if (this.analyser && !this.simulatedMicActive) {
          const buffer = new Uint8Array(this.analyser.frequencyBinCount);
          this.analyser.getByteFrequencyData(buffer);
          // Map to 8 normalized bins (0-100)
          this.spectrumBins = Array.from({ length: 8 }).map((_, i) => {
            const val = buffer[i * 2] || 0;
            return Math.min(100, Math.floor((val / 255) * 100));
          });
        } else if (this.simulatedMicActive) {
          // Interactive simulated speech waveform
          const isHeld = this.transmissionMode === 'ptt' ? this.isPushToTalkHeld : true;
          if (isHeld) {
            const time = Date.now() / 150;
            this.spectrumBins = Array.from({ length: 8 }).map((_, i) => {
              const wave = Math.sin(time + i * 0.8) * 35 + Math.random() * 25 + 30;
              return Math.max(0, Math.min(100, Math.floor(wave)));
            });
          } else {
            this.spectrumBins = [0, 0, 0, 0, 0, 0, 0, 0];
          }
        }
      } else {
        this.spectrumBins = [0, 0, 0, 0, 0, 0, 0, 0];
      }

      this.animFrameId = requestAnimationFrame(updateLoop);
    };

    this.animFrameId = requestAnimationFrame(updateLoop);
  }

  public getSpectrumBins(): number[] {
    return this.spectrumBins;
  }

  private emitState() {
    window.dispatchEvent(
      new CustomEvent('megaworld_voice_state_changed', {
        detail: {
          channel: this.channel,
          transmissionMode: this.transmissionMode,
          isSelfMuted: this.isSelfMuted,
          isDeafened: this.isDeafened,
          isTransmitting: this.isCurrentlyTransmitting(),
          simulatedMicActive: this.simulatedMicActive,
        },
      })
    );
  }

  public cleanup() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
    }
  }
}

export const voiceChatEngine = new VoiceChatEngine();
