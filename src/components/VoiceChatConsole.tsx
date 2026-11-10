import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Mic, MicOff, Volume2, VolumeX, Radio, Shield, Users, 
  Settings, AlertTriangle, Compass, Check, ChevronDown, Flag, Sliders,
  MessageSquare, Send, Ban, Smile, Sparkles, UserX, UserCheck, ShieldAlert
} from 'lucide-react';
import { 
  voiceChatEngine, 
  VoiceChannel, 
  TransmissionMode, 
  VoiceUser,
  TextChatChannel,
  ChatMessage
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

  // Text Chat State
  const [textChannel, setTextChannel] = useState<TextChatChannel>('global');
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(voiceChatEngine.getChatMessages());
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>(Array.from(voiceChatEngine.blockedUserIds));
  const [mutedUserIds, setMutedUserIds] = useState<string[]>(Array.from(voiceChatEngine.mutedUserIds));
  const [chatNotice, setChatNotice] = useState<string | null>(null);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Moderation Report Modal state
  const [reportingUser, setReportingUser] = useState<VoiceUser | null>(null);
  const [reportReason, setReportReason] = useState<'trolling' | 'mic_spam' | 'harassment' | 'offensive_language' | 'other'>('mic_spam');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'chat' | 'radar' | 'users' | 'moderation' | 'settings'>('chat');

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
      setBlockedUserIds(Array.from(voiceChatEngine.blockedUserIds));
      setMutedUserIds(Array.from(voiceChatEngine.mutedUserIds));
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

    const handleChatChange = (e: any) => {
      setChatMessages(voiceChatEngine.getChatMessages());
      setBlockedUserIds(Array.from(voiceChatEngine.blockedUserIds));
      setMutedUserIds(Array.from(voiceChatEngine.mutedUserIds));
    };
    window.addEventListener('megaworld_chat_state_changed', handleChatChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('megaworld_voice_state_changed', handleVoiceChange);
      window.removeEventListener('megaworld_chat_state_changed', handleChatChange);
    };
  }, [playerPos]);

  useEffect(() => {
    if (activeTab === 'chat' && chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, activeTab, textChannel]);

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

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText !== undefined ? customText : chatInput).trim();
    if (!textToSend) return;

    audioEngine.playMinecraftSound('click');
    const senderName = currentAvatarName || user?.displayName || 'Player';
    const senderId = user?.uid || 'local-player';

    const res = voiceChatEngine.sendChatMessage(
      textChannel,
      textToSend,
      senderName,
      senderId,
      'hero',
      'bg-indigo-600',
      'Cross-Platform Hero'
    );

    if (res.success) {
      setChatInput('');
      setChatNotice(null);
      setChatMessages(voiceChatEngine.getChatMessages());
    } else if (res.error) {
      setChatNotice(res.error);
      setTimeout(() => setChatNotice(null), 3000);
    }
  };

  const handleToggleBlock = (userId: string) => {
    audioEngine.playMinecraftSound('click');
    if (voiceChatEngine.isUserBlocked(userId)) {
      voiceChatEngine.unblockUser(userId);
    } else {
      voiceChatEngine.blockUser(userId);
    }
    setBlockedUserIds(Array.from(voiceChatEngine.blockedUserIds));
    setChatMessages(voiceChatEngine.getChatMessages());
  };

  const handleToggleMutePeer = (userId: string) => {
    audioEngine.playMinecraftSound('click');
    voiceChatEngine.toggleMutePeer(userId);
    setMutedUserIds(Array.from(voiceChatEngine.mutedUserIds));
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
        <div className="flex border-b border-[#2c2d30] bg-[#1a1b1f] px-4 gap-2 overflow-x-auto scrollbar-none">
          {[
            { id: 'chat', label: '💬 Text Chat (Party / Server / Global)' },
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
              className={`px-3.5 py-2.5 font-mono text-xs font-bold transition border-b-2 cursor-pointer whitespace-nowrap ${
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
          {/* TAB 0: REAL-TIME TEXT CHAT (PARTY / SERVER / GLOBAL) */}
          {activeTab === 'chat' && (
            <div className="flex flex-col h-[520px] max-w-3xl mx-auto bg-[#1c1d22] border border-[#2c2d30] rounded-2xl overflow-hidden shadow-2xl">
              {/* Channel Switcher Header */}
              <div className="p-3 bg-[#16171a] border-b border-[#2c2d30] flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <MessageSquare size={16} className="text-indigo-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider mr-1">
                    Channel:
                  </span>
                  {[
                    { id: 'global', label: '🌐 Global', desc: 'All Multiverse Worlds' },
                    { id: 'server', label: '🏰 Server', desc: 'Current Dimension' },
                    { id: 'party', label: '👥 Party', desc: 'Squad & Raid' },
                  ].map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setTextChannel(ch.id as any);
                        audioEngine.playMinecraftSound('click');
                      }}
                      className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        textChannel === ch.id
                          ? ch.id === 'global'
                            ? 'bg-cyan-600 text-white shadow-cyan-600/30 shadow'
                            : ch.id === 'server'
                            ? 'bg-amber-600 text-white shadow-amber-600/30 shadow'
                            : 'bg-indigo-600 text-white shadow-indigo-600/30 shadow'
                          : 'bg-[#24252a] text-stone-400 hover:text-white border border-stone-800'
                      }`}
                    >
                      <span>{ch.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-stone-400">Filter:</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-mono font-bold flex items-center gap-1">
                    <Shield size={10} /> Auto-Moderated
                  </span>
                </div>
              </div>

              {/* Chat Notice / Alert */}
              {chatNotice && (
                <div className="bg-amber-950/80 border-b border-amber-500/40 px-3 py-1.5 text-xs font-mono text-amber-200 flex items-center justify-between">
                  <span>⚠️ {chatNotice}</span>
                  <button onClick={() => setChatNotice(null)} className="text-amber-400 font-bold underline cursor-pointer text-[10px]">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Message Feed */}
              <div 
                ref={chatScrollRef}
                className="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-xs scrollbar-thin scrollbar-thumb-stone-700"
              >
                {chatMessages
                  .filter((msg) => msg.channel === textChannel)
                  .filter((msg) => !blockedUserIds.includes(msg.senderId))
                  .length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-stone-500 py-12 text-center">
                    <MessageSquare size={36} className="mb-2 opacity-40 text-indigo-400" />
                    <p className="font-bold text-stone-400">No messages in #{textChannel} yet.</p>
                    <p className="text-[11px] text-stone-600 mt-1">Be the first to say hello or coordinate with fellow adventurers!</p>
                  </div>
                ) : (
                  chatMessages
                    .filter((msg) => msg.channel === textChannel)
                    .filter((msg) => !blockedUserIds.includes(msg.senderId))
                    .map((msg) => {
                      const isLocal = msg.senderId === (user?.uid || 'local-player');
                      const isPeerMuted = mutedUserIds.includes(msg.senderId);

                      return (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-2xl border transition group ${
                            isLocal
                              ? 'bg-indigo-950/40 border-indigo-500/30 ml-6'
                              : 'bg-[#17181c] border-[#292a2f] hover:border-stone-700 mr-6'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs text-white ${msg.senderAvatarColor || 'bg-stone-700'}`}>
                                {msg.senderAvatarType === 'minecraft' ? '⛏️' : msg.senderAvatarType === 'roblox' ? '🟡' : msg.senderAvatarType === 'countryball' ? '🌐' : msg.senderAvatarType === 'mcdonalds' ? '🍔' : msg.senderAvatarType === 'sprnuki' ? '🎵' : msg.senderAvatarType === 'xilam' ? '💥' : '⭐'}
                              </span>
                              <span className="font-bold text-white">{msg.senderName}</span>
                              {msg.badge && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/50 text-indigo-300 border border-indigo-500/30 uppercase tracking-wider">
                                  {msg.badge}
                                </span>
                              )}
                              {msg.isFiltered && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-500/40">
                                  Moderated
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 text-stone-500 text-[10px]">
                              <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                              {!isLocal && (
                                <div className="opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                                  <button
                                    onClick={() => handleToggleMutePeer(msg.senderId)}
                                    title={isPeerMuted ? 'Unmute' : 'Mute'}
                                    className={`p-1 rounded cursor-pointer ${isPeerMuted ? 'text-red-400 bg-red-950' : 'text-stone-400 hover:text-white hover:bg-stone-800'}`}
                                  >
                                    {isPeerMuted ? <MicOff size={11} /> : <Mic size={11} />}
                                  </button>
                                  <button
                                    onClick={() => handleToggleBlock(msg.senderId)}
                                    title="Block Player"
                                    className="p-1 rounded text-stone-400 hover:text-red-400 hover:bg-red-950 cursor-pointer"
                                  >
                                    <Ban size={11} />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setReportingUser({
                                        id: msg.senderId,
                                        name: msg.senderName,
                                        avatarType: msg.senderAvatarType,
                                        avatarColor: msg.senderAvatarColor || 'bg-stone-700',
                                        channel: 'proximity',
                                        isSpeaking: false,
                                        isMuted: false,
                                        volume: 1,
                                        x: 0,
                                        y: 0,
                                        role: 'member'
                                      });
                                      setActiveTab('moderation');
                                    }}
                                    title="Report Violation"
                                    className="p-1 rounded text-stone-400 hover:text-amber-400 hover:bg-amber-950 cursor-pointer"
                                  >
                                    <Flag size={11} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <p className="text-stone-300 break-words leading-relaxed pl-8">
                            {msg.text}
                          </p>
                        </div>
                      );
                    })
                )}
              </div>

              {/* Quick Emote / Macro Bar */}
              <div className="px-3 py-1.5 bg-[#17181c] border-t border-[#2c2d30] flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[10px] font-mono text-stone-500 whitespace-nowrap">Quick Emotes:</span>
                {[
                  { label: '💃 /e dance', text: '/e dance' },
                  { label: '👋 /e wave', text: '/e wave' },
                  { label: '💥 /e oof', text: '/e oof' },
                  { label: '✌️ /e peace', text: '/e peace' },
                  { label: '⛏️ Need Netherite!', text: 'Need Netherite for crafting! Anyone exploring caves? ⛏️' },
                  { label: '🍟 McDonald’s Feast!', text: 'Meet at McDonald’s Drive-Thru for Happy Meals! 🍟🍔' },
                ].map((macro) => (
                  <button
                    key={macro.label}
                    onClick={() => handleSendMessage(macro.text)}
                    className="px-2 py-0.5 rounded-lg bg-[#24252a] hover:bg-stone-700 text-stone-300 text-[10px] font-mono whitespace-nowrap transition cursor-pointer border border-stone-800"
                  >
                    {macro.label}
                  </button>
                ))}
              </div>

              {/* Input Row */}
              <div className="p-3 bg-[#141416] border-t border-[#2c2d30] flex items-center gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={`Message #${textChannel}... (Type /e dance, or talk to players)`}
                  className="flex-1 bg-[#1e1f24] border border-[#35363c] focus:border-indigo-500 text-white rounded-xl px-3.5 py-2.5 text-xs font-mono outline-none transition placeholder:text-stone-500"
                />

                <button
                  onClick={() => handleSendMessage()}
                  disabled={!chatInput.trim()}
                  className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow ${
                    chatInput.trim()
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <Send size={13} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          )}

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
              {users.map((peer) => {
                const isBlocked = blockedUserIds.includes(peer.id);
                const isMuted = mutedUserIds.includes(peer.id);

                return (
                  <div
                    key={peer.id}
                    className={`bg-[#1c1d22] border rounded-2xl p-4 flex items-center justify-between flex-wrap gap-4 transition ${
                      isBlocked ? 'border-red-500/40 opacity-75' : 'border-[#2c2d30]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${peer.avatarColor} text-white shadow relative`}>
                        {peer.avatarType === 'sprnuki' ? '🎵' : peer.avatarType === 'train' ? '🚂' : peer.avatarType === 'countryball' ? '🌐' : peer.avatarType === 'xilam' ? '💥' : '⛏️'}
                        {peer.isSpeaking && !isBlocked && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-stone-900 animate-ping" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-mono font-bold text-white">{peer.name}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-stone-400 border border-stone-800 uppercase">
                            {peer.role}
                          </span>
                          {isBlocked && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 uppercase font-bold">
                              BLOCKED
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-400 font-mono mt-0.5">
                          Distance: <strong className="text-emerald-400">{peer.distanceToLocal} tiles</strong> • Pan: {peer.pan && peer.pan < 0 ? 'Left' : peer.pan && peer.pan > 0 ? 'Right' : 'Center'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isBlocked && (
                        <div className="flex items-center gap-1.5 mr-2">
                          <Volume2 size={14} className="text-stone-400" />
                          <input
                            type="range"
                            min="0"
                            max="2"
                            step="0.1"
                            value={peer.volume}
                            onChange={(e) => voiceChatEngine.setPeerVolume(peer.id, parseFloat(e.target.value))}
                            className="w-16 accent-emerald-500 cursor-pointer"
                            title="User Volume"
                          />
                        </div>
                      )}

                      <button
                        onClick={() => handleToggleMutePeer(peer.id)}
                        className={`p-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border flex items-center gap-1 ${
                          isMuted
                            ? 'bg-red-600 text-white border-red-500'
                            : 'bg-stone-800 text-stone-400 hover:text-white border-stone-700'
                        }`}
                        title={isMuted ? 'Unmute User' : 'Mute User for me'}
                      >
                        {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                        <span className="hidden sm:inline">{isMuted ? 'Muted' : 'Mute'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleBlock(peer.id)}
                        className={`p-2 rounded-xl text-xs font-mono font-bold transition cursor-pointer border flex items-center gap-1 ${
                          isBlocked
                            ? 'bg-red-950 text-red-300 border-red-500'
                            : 'bg-stone-800 text-stone-400 hover:text-red-400 border-stone-700'
                        }`}
                        title={isBlocked ? 'Unblock Player' : 'Block Player (Silence Voice & Hide Chat)'}
                      >
                        <Ban size={14} />
                        <span className="hidden sm:inline">{isBlocked ? 'Unblock' : 'Block'}</span>
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
                );
              })}
            </div>
          )}

          {/* TAB 3: MODERATION & SAFETY */}
          {activeTab === 'moderation' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              <div className="bg-[#1c1d22] border border-[#2c2d30] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-red-400 font-mono font-bold text-sm">
                  <Shield size={18} />
                  <span>Community Voice & Text Moderation Suite</span>
                </div>
                <p className="text-xs text-stone-400 font-mono leading-relaxed">
                  We enforce automated real-time profanity censoring, anti-phishing protection, and 1-click player muting and blocking across all Party, Server, and Global channels.
                </p>

                {/* Live Safety Guard Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-black/40 border border-stone-800 rounded-xl font-mono text-xs">
                    <div className="text-stone-400 text-[10px] uppercase font-bold">Text Filter</div>
                    <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <Check size={12} /> Auto-Censorship
                    </div>
                  </div>
                  <div className="p-3 bg-black/40 border border-stone-800 rounded-xl font-mono text-xs">
                    <div className="text-stone-400 text-[10px] uppercase font-bold">Spatial Voice Falloff</div>
                    <div className="text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <Check size={12} /> 15-Block Radius
                    </div>
                  </div>
                  <div className="p-3 bg-black/40 border border-stone-800 rounded-xl font-mono text-xs">
                    <div className="text-stone-400 text-[10px] uppercase font-bold">Cloud Incident Logs</div>
                    <div className="text-indigo-400 font-bold mt-1 flex items-center gap-1">
                      <Check size={12} /> Firebase Synced
                    </div>
                  </div>
                </div>

                {/* Blocked Users Management */}
                <div className="pt-4 border-t border-stone-800">
                  <h3 className="text-xs font-mono font-bold text-white mb-2 flex items-center gap-1.5">
                    <Ban size={14} className="text-red-400" />
                    <span>Blocked Players ({blockedUserIds.length})</span>
                  </h3>

                  {blockedUserIds.length === 0 ? (
                    <p className="text-[11px] font-mono text-stone-500">No players currently blocked.</p>
                  ) : (
                    <div className="space-y-2">
                      {blockedUserIds.map((bid) => {
                        const targetUser = users.find((u) => u.id === bid);
                        return (
                          <div key={bid} className="p-2.5 bg-black/40 border border-red-500/30 rounded-xl flex items-center justify-between">
                            <span className="font-mono text-xs text-stone-300">
                              {targetUser ? targetUser.name : bid}
                            </span>
                            <button
                              onClick={() => handleToggleBlock(bid)}
                              className="px-2.5 py-1 bg-red-950 hover:bg-red-900 border border-red-500/50 text-red-200 text-xs font-mono rounded-lg cursor-pointer transition"
                            >
                              Unblock Player
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Muted Users Management */}
                <div className="pt-4 border-t border-stone-800">
                  <h3 className="text-xs font-mono font-bold text-white mb-2 flex items-center gap-1.5">
                    <MicOff size={14} className="text-amber-400" />
                    <span>Muted Players ({mutedUserIds.length})</span>
                  </h3>

                  {mutedUserIds.length === 0 ? (
                    <p className="text-[11px] font-mono text-stone-500">No players currently muted.</p>
                  ) : (
                    <div className="space-y-2">
                      {mutedUserIds.map((mid) => {
                        const targetUser = users.find((u) => u.id === mid);
                        return (
                          <div key={mid} className="p-2.5 bg-black/40 border border-stone-800 rounded-xl flex items-center justify-between">
                            <span className="font-mono text-xs text-stone-300">
                              {targetUser ? targetUser.name : mid}
                            </span>
                            <button
                              onClick={() => handleToggleMutePeer(mid)}
                              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-mono rounded-lg cursor-pointer transition"
                            >
                              Unmute Audio
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Incident Report Section */}
                <div className="pt-4 border-t border-stone-800">
                  <h3 className="text-xs font-mono font-bold text-white mb-2 flex items-center gap-1.5">
                    <Flag size={14} className="text-red-400" />
                    <span>Report Player Incident</span>
                  </h3>

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
                          <span>Submit Report & Auto-Mute</span>
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
                      To report a player, click the flag icon next to their message in <button onClick={() => setActiveTab('chat')} className="text-emerald-400 underline cursor-pointer">Text Chat</button> or on the <button onClick={() => setActiveTab('users')} className="text-emerald-400 underline cursor-pointer">Active Users list</button>.
                    </div>
                  )}
                </div>
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
