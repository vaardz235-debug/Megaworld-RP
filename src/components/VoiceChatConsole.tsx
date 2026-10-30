import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Radio, Shield, Users, 
  Settings, AlertTriangle, Compass, Check, ChevronDown, Flag, Sliders
} from 'lucide-react';
import { 
  voiceChatEngine, 
  VoiceChannel, 
  TransmissionMode, 
  VoiceUser 
} from '../utils/voiceChatEngine';
import { audioEngine } from '../utils/audioEngine';

interface VoiceChatConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  playerPos?: { x: number; y: number };
  user: any;
  currentAvatarName?: string;
}

export default function VoiceChatConsole({
  isOpen,
  onClose,
  playerPos = { x: 25, y: 12 },
  user,
  currentAvatarName,
}: VoiceChatConsoleProps) {
  const [channel, setChannel] = useState<VoiceChannel>(voiceChatEngine.channel);
  const [transmissionMode, setTransmissionMode] = useState<TransmissionMode>(voiceChatEngine.transmissionMode);
  const [isSelfMuted, setIsSelfMuted] = useState(voiceChatEngine.isSelfMuted);
  const [isDeafened, setIsDeafened] = useState(voiceChatEngine.isDeafened);
  const [isTransmitting, setIsTransmitting] = useState(voiceChatEngine.isCurrentlyTransmitting());
  const [spectrum, setSpectrum] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);
  const [users, setUsers] = useState<VoiceUser[]>([]);
  const [micGranted, setMicGranted] = useState(voiceChatEngine.isMicActive);
  const [micNotice, setMicNotice] = useState<string | null>(null);

  // Moderation Report Modal state
  const [reportingUser, setReportingUser] = useState<VoiceUser | null>(null);
  const [reportReason, setReportReason] = useState<'trolling' | 'mic_spam' | 'harassment' | 'offensive_language' | 'other'>('mic_spam');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'radar' | 'users' | 'moderation' | 'settings'>('radar');

  useEffect(() => {
    if (!voiceChatEngine.isMicActive) {
      voiceChatEngine.requestMicrophone().then((res) => {
        setMicGranted(true);
        if (res.error) setMicNotice(res.error);
      });
    }

    const interval = setInterval(() => {
      setSpectrum([...voiceChatEngine.getSpectrumBins()]);
      setIsTransmitting(voiceChatEngine.isCurrentlyTransmitting());
      const updated = voiceChatEngine.updateProximityAudio(playerPos.x, playerPos.y);
      setUsers(updated);
    }, 100);

    const handleVoiceChange = (e: any) => {
      if (e.detail) {
        setChannel(e.detail.channel);
        setTransmissionMode(e.detail.transmissionMode);
        setIsSelfMuted(e.detail.isSelfMuted);
        setIsDeafened(e.detail.isDeafened);
        setIsTransmitting(e.detail.isTransmitting);
      }
    };
    window.addEventListener('megaworld_voice_state_changed', handleVoiceChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('megaworld_voice_state_changed', handleVoiceChange);
    };
  }, [playerPos]);

  // Global Push-To-Talk Keyboard Hotkey (V)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if ((e.key === 'v' || e.key === 'V') && transmissionMode === 'ptt' && !e.repeat) {
        voiceChatEngine.setPushToTalk(true);
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if ((e.key === 'v' || e.key === 'V') && transmissionMode === 'ptt') {
        voiceChatEngine.setPushToTalk(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [transmissionMode]);

  if (!isOpen) return null;

  const handleChannelSwitch = (ch: VoiceChannel) => {
    audioEngine.playMinecraftSound('click');
    voiceChatEngine.setChannel(ch);
    setChannel(ch);
  };

  const handleToggleMuteSelf = () => {
    audioEngine.playMinecraftSound('click');
    const muted = voiceChatEngine.toggleMuteSelf();
    setIsSelfMuted(muted);
  };

  const handleToggleDeafen = () => {
    audioEngine.playMinecraftSound('click');
    const deaf = voiceChatEngine.toggleDeafen();
    setIsDeafened(deaf);
  };

  const handleSubmitReport = async () => {
    if (!reportingUser) return;
    audioEngine.playMinecraftSound('click');
    await voiceChatEngine.submitModerationReport({
      reporterUid: user?.uid || 'guest-reporter',
      reportedUserId: reportingUser.id,
      reportedUserName: reportingUser.name,
      reason: reportReason,
      channel,
      audioSnapshotDesc: `Proximity user at distance ${reportingUser.distanceToLocal} tiles`,
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportingUser(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none font-sans">
      <div className="relative w-full max-w-4xl bg-[#141416] border-2 border-[#2c2d30] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#1d1e22] border-b border-[#2c2d30] flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-all ${
              isTransmitting 
                ? 'bg-emerald-500 shadow-emerald-500/50 scale-105 animate-pulse' 
                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
            }`}>
              <Radio size={22} className={isTransmitting ? 'animate-bounce' : ''} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black font-mono text-white tracking-wide">
                  Proximity & Party Voice Chat
                </h2>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                  isTransmitting 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse' 
                    : isSelfMuted 
                    ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                    : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                }`}>
                  {isTransmitting ? '🎙️ TRANSMITTING (LIVE)' : isSelfMuted ? '🔇 MUTED' : 'READY TO TALK'}
                </span>
              </div>
              <p className="text-xs text-stone-400 font-mono">
                Spatial 3D Audio • 15-Block Falloff • Party Radio • Anti-Harassment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMuteSelf}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                isSelfMuted 
                  ? 'bg-red-600 text-white' 
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
              title={isSelfMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isSelfMuted ? <MicOff size={14} /> : <Mic size={14} />}
              <span>{isSelfMuted ? 'Unmute' : 'Mute'}</span>
            </button>

            <button
              onClick={handleToggleDeafen}
              className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                isDeafened 
                  ? 'bg-amber-600 text-white' 
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
              title={isDeafened ? 'Undeafen Voice' : 'Deafen (Mute all incoming audio)'}
            >
              {isDeafened ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{isDeafened ? 'Undeafen' : 'Deafen'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notice Banner */}
        {micNotice && (
          <div className="bg-amber-950/70 border-b border-amber-500/40 px-4 py-2 text-xs font-mono text-amber-200 flex items-center justify-between">
            <span>ℹ️ {micNotice}</span>
            <button onClick={() => setMicNotice(null)} className="text-amber-400 font-bold underline cursor-pointer">
              Dismiss
            </button>
          </div>
        )}

        {/* Channel Switcher Tabs Bar */}
        <div className="p-3 bg-[#18191c] border-b border-[#2c2d30] flex items-center justify-between flex-wrap gap-2">
          <div className="flex gap-2">
            {[
              { id: 'proximity', label: '📡 Proximity Chat (15 Tiles)', desc: 'Attenuates with distance' },
              { id: 'party', label: '🛡️ Party Squad Radio', desc: 'Private squad stereo' },
              { id: 'server', label: '📢 Server Megaphone', desc: 'Broadcast to everyone' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => handleChannelSwitch(ch.id as any)}
                className={`px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                  channel === ch.id
                    ? ch.id === 'proximity' 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/30' 
                      : ch.id === 'party'
                      ? 'bg-indigo-600 text-white shadow-indigo-600/30'
                      : 'bg-amber-600 text-white shadow-amber-600/30'
                    : 'bg-[#222328] text-stone-400 hover:text-white border border-stone-800'
                }`}
              >
                <span>{ch.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-stone-400">Mode:</span>
            <button
              onClick={() => {
                const next = transmissionMode === 'ptt' ? 'vad' : 'ptt';
                voiceChatEngine.setTransmissionMode(next);
                setTransmissionMode(next);
                audioEngine.playMinecraftSound('click');
              }}
              className="px-2.5 py-1 bg-stone-800 border border-stone-700 hover:border-stone-500 text-xs font-mono font-bold text-stone-300 rounded-lg cursor-pointer"
            >
              {transmissionMode === 'ptt' ? 'Hold [V] Push-To-Talk' : 'Voice Activity (Auto)'}
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#2c2d30] bg-[#1a1b1f] px-4 gap-2">
          {[
            { id: 'radar', label: '🧭 Spatial Proximity Radar' },
            { id: 'users', label: `👥 Active Voice Users (${users.length})` },
            { id: 'moderation', label: '🛡️ Moderation & Safety' },
            { id: 'settings', label: '⚙️ Audio Hardware' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                audioEngine.playMinecraftSound('click');
              }}
              className={`px-3.5 py-2.5 font-mono text-xs font-bold transition border-b-2 cursor-pointer ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-white bg-emerald-500/10'
                  : 'border-transparent text-stone-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
          {/* TAB 1: SPATIAL PROXIMITY RADAR */}
          {activeTab === 'radar' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#1c1d22] border border-[#2c2d30] rounded-3xl p-5 flex flex-col items-center justify-center relative overflow-hidden text-center shadow-inner">
                {/* Radar Grid Circles (15-Tile Hearing Bubble) */}
                <div className="relative w-72 h-72 sm:w-80 sm:h-80 rounded-full border border-emerald-500/30 flex items-center justify-center bg-black/60 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                  {/* Outer circle: 15 tiles (Whisper limit) */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-stone-700/80 pointer-events-none" />
                  {/* Mid circle: 8 tiles (Half volume) */}
                  <div className="absolute inset-14 rounded-full border border-yellow-500/25 pointer-events-none" />
                  {/* Inner circle: 4 tiles (Full volume) */}
                  <div className="absolute inset-24 rounded-full border border-emerald-400/40 pointer-events-none" />

                  {/* Radar Sweeping Scanner Line */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/10 via-transparent to-transparent pointer-events-none animate-spin" style={{ animationDuration: '6s' }} />

                  {/* Center Dot: Local Player */}
                  <div className="relative z-10 w-9 h-9 rounded-full bg-emerald-500 text-stone-950 font-black font-mono text-xs flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.8)] border-2 border-white">
                    YOU
                  </div>

                  {/* Nearby Voice Peers Plotted in Radar Space */}
                  {users.map((peer) => {
                    const dx = peer.x - playerPos.x;
                    const dy = peer.y - playerPos.y;
                    const maxR = 15;
                    const scale = 110 / maxR;
                    const posX = Math.max(-120, Math.min(120, dx * scale));
                    const posY = Math.max(-120, Math.min(120, dy * scale));
                    const inRange = (peer.distanceToLocal || 0) <= 15;

                    return (
                      <div
                        key={peer.id}
                        className={`absolute z-10 p-1 rounded-full flex flex-col items-center pointer-events-auto cursor-pointer group ${
                          inRange ? 'opacity-100' : 'opacity-30'
                        }`}
                        style={{
                          transform: `translate(${posX}px, ${posY}px)`,
                        }}
                        onClick={() => {
                          setReportingUser(peer);
                          setActiveTab('moderation');
                        }}
                        title={`${peer.name} (${peer.distanceToLocal} blocks away)`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md border ${
                          peer.isSpeaking 
                            ? 'bg-emerald-400 text-black border-white animate-pulse shadow-[0_0_12px_rgba(52,211,153,1)]' 
                            : 'bg-stone-800 text-stone-300 border-stone-600'
                        }`}>
                          {peer.avatarType === 'sprnuki' ? '🎵' : peer.avatarType === 'train' ? '🚂' : peer.avatarType === 'countryball' ? '🌐' : peer.avatarType === 'xilam' ? '💥' : '⛏️'}
                        </div>
                        <span className="text-[9px] font-mono font-bold text-stone-300 bg-black/80 px-1 rounded whitespace-nowrap mt-0.5">
                          {peer.name.split(' ')[0]} ({peer.distanceToLocal}m)
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Radar Distance Legend */}
                <div className="flex gap-4 mt-4 text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>0-4m: Full Volume (100%)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span>5-10m: Spatial Directional</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-stone-500" />
                    <span>11-15m: Whisper Edge</span>
                  </span>
                </div>
              </div>

              {/* Push-to-Talk Big Button & Spectrum Visualizer */}
              <div className="bg-[#1c1d22] border border-[#2c2d30] rounded-3xl p-5 flex flex-col items-center gap-4">
                <div className="flex items-center gap-2 text-stone-300 font-mono text-xs">
                  <span>Voice Spectrum Level:</span>
                  <div className="flex items-end gap-1 h-6 w-32 bg-black/50 p-1 rounded border border-stone-800">
                    {spectrum.map((val, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-emerald-500 to-cyan-300 rounded-xs transition-all duration-75"
                        style={{ height: `${Math.max(10, val)}%` }}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onMouseDown={() => voiceChatEngine.setPushToTalk(true)}
                  onMouseUp={() => voiceChatEngine.setPushToTalk(false)}
                  onTouchStart={() => voiceChatEngine.setPushToTalk(true)}
                  onTouchEnd={() => voiceChatEngine.setPushToTalk(false)}
                  className={`w-full max-w-md py-4 rounded-2xl font-mono text-sm font-black transition cursor-pointer shadow-xl flex items-center justify-center gap-3 select-none ${
                    isTransmitting
                      ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 shadow-[0_0_30px_rgba(16,185,129,0.5)] scale-102'
                      : 'bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700'
                  }`}
                >
                  <Mic size={20} className={isTransmitting ? 'animate-bounce' : ''} />
                  <span>{isTransmitting ? 'TRANSMITTING VOICE (HOLDING)' : 'HOLD TO TALK (OR PRESS [V])'}</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ACTIVE VOICE USERS LIST */}
          {activeTab === 'users' && (
            <div className="space-y-3 max-w-3xl mx-auto">
              {users.map((peer) => (
                <div
                  key={peer.id}
                  className="bg-[#1c1d22] border border-[#2c2d30] rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${peer.avatarColor} text-white shadow relative`}>
                      {peer.avatarType === 'sprnuki' ? '🎵' : peer.avatarType === 'train' ? '🚂' : peer.avatarType === 'countryball' ? '🌐' : peer.avatarType === 'xilam' ? '💥' : '⛏️'}
                      {peer.isSpeaking && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-stone-900 animate-ping" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-mono font-bold text-white">{peer.name}</h4>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-stone-400 border border-stone-800 uppercase">
                          {peer.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                        Distance: <strong className="text-emerald-400">{peer.distanceToLocal} tiles</strong> • Pan: {peer.pan && peer.pan < 0 ? 'Left' : peer.pan && peer.pan > 0 ? 'Right' : 'Center'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Volume2 size={14} className="text-stone-400" />
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={peer.volume}
                        onChange={(e) => voiceChatEngine.setPeerVolume(peer.id, parseFloat(e.target.value))}
                        className="w-20 accent-emerald-500 cursor-pointer"
                        title="User Volume"
                      />
                    </div>

                    <button
                      onClick={() => voiceChatEngine.toggleMutePeer(peer.id)}
                      className={`p-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border ${
                        peer.isMuted
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-stone-800 text-stone-400 hover:text-white border-stone-700'
                      }`}
                      title={peer.isMuted ? 'Unmute User' : 'Mute User for me'}
                    >
                      {peer.isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>

                    <button
                      onClick={() => {
                        setReportingUser(peer);
                        setActiveTab('moderation');
                      }}
                      className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-red-400 border border-stone-700 transition cursor-pointer"
                      title="Report User for Toxicity / Harassment"
                    >
                      <Flag size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: MODERATION & SAFETY */}
          {activeTab === 'moderation' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#1c1d22] border border-[#2c2d30] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                  <Shield size={18} />
                  <span>Community Voice Moderation & Safety Center</span>
                </div>
                <p className="text-xs text-stone-400 font-mono leading-relaxed">
                  We maintain zero tolerance for audio toxicity, slurs, mic spam, or harassment. When you submit a report, the offender is immediately muted for you, and incident logs are pushed to the Cloud Database.
                </p>

                {reportingUser ? (
                  <div className="p-4 bg-black/60 border border-red-500/40 rounded-2xl space-y-3">
                    <h4 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                      <span>Report User:</span>
                      <span className="text-red-400 font-bold">{reportingUser.name}</span>
                    </h4>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-stone-400">Select Violation Category:</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'mic_spam', label: '🔊 Mic Spam / Screaming' },
                          { id: 'harassment', label: '🛑 Verbal Harassment' },
                          { id: 'offensive_language', label: '⚠️ Profanity / Slurs' },
                          { id: 'trolling', label: '🧌 Disruptive Trolling' },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            onClick={() => setReportReason(opt.id as any)}
                            className={`p-2.5 rounded-xl text-xs font-mono font-bold text-left transition cursor-pointer border ${
                              reportReason === opt.id
                                ? 'bg-red-950/80 border-red-500 text-red-200'
                                : 'bg-[#27272a] border-[#3f3f46] text-stone-400 hover:text-white'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={handleSubmitReport}
                        className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs rounded-xl shadow transition cursor-pointer flex items-center gap-1.5"
                      >
                        <Flag size={14} />
                        <span>Submit Report & Mute Offender</span>
                      </button>
                      <button
                        onClick={() => setReportingUser(null)}
                        className="px-3 py-2 bg-stone-800 text-stone-400 hover:text-white font-mono text-xs rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>

                    {reportSubmitted && (
                      <div className="p-2.5 bg-emerald-950 text-emerald-300 border border-emerald-500/40 rounded-xl text-xs font-mono flex items-center gap-2">
                        <Check size={14} />
                        <span>Report logged to Cloud Database! User has been auto-muted.</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 bg-stone-900/60 border border-stone-800 rounded-xl text-center text-xs font-mono text-stone-400">
                    To report a player, click the flag icon next to their name in the <button onClick={() => setActiveTab('users')} className="text-emerald-400 underline cursor-pointer">Active Users list</button> or on the <button onClick={() => setActiveTab('radar')} className="text-emerald-400 underline cursor-pointer">Spatial Radar</button>.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: AUDIO HARDWARE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-4 max-w-2xl mx-auto font-mono text-xs">
              <div className="bg-[#1c1d22] border border-[#2c2d30] rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders size={16} className="text-indigo-400" />
                  <span>Hardware & Voice Tuning</span>
                </h4>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-300">Voice Activity Sensitivity (Gate):</span>
                    <span className="text-emerald-400 font-bold">{voiceChatEngine.micSensitivity} dB</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={voiceChatEngine.micSensitivity}
                    onChange={(e) => {
                      voiceChatEngine.micSensitivity = parseInt(e.target.value, 10);
                    }}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[11px] text-stone-500">
                    Lower values detect quiet whispers; higher values reject background keyboard clicks.
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-stone-800">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-300">Master Output Volume:</span>
                    <span className="text-indigo-400 font-bold">{Math.floor(voiceChatEngine.outputVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={voiceChatEngine.outputVolume}
                    onChange={(e) => {
                      voiceChatEngine.outputVolume = parseFloat(e.target.value);
                    }}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-stone-800">
                  <span className="text-stone-300">Acoustic Echo Cancellation:</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                    ENABLED
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
