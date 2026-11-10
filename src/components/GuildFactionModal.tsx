import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Users, Trophy, Award, Sparkles, Plus, Swords, 
  Check, ChevronRight, MessageSquare, Radio, Coins, Flame, 
  Crown, LogOut, Compass, FileText, CheckCircle2, Lock
} from 'lucide-react';
import { 
  guildFactionManager, 
  FACTIONS_LIST, 
  GuildDef, 
  FactionDef, 
  GuildMember 
} from '../utils/guildFactionManager';
import { audioEngine } from '../utils/audioEngine';
import CharacterAvatar from './CharacterAvatar';

interface GuildFactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  currentAvatar?: any;
  onOpenQuests?: () => void;
  onOpenVoiceChat?: (frequency?: string) => void;
  onJoinVoiceRadar?: (frequency?: string) => void;
}

export default function GuildFactionModal({
  isOpen,
  onClose,
  user,
  currentAvatar,
  onOpenQuests,
  onOpenVoiceChat,
  onJoinVoiceRadar,
}: GuildFactionModalProps) {
  const [activeTab, setActiveTab] = useState<'my_guild' | 'factions' | 'browse' | 'create'>('my_guild');
  const [guilds, setGuilds] = useState<GuildDef[]>(guildFactionManager.getGuilds());
  const [myGuild, setMyGuild] = useState<GuildDef | undefined>(guildFactionManager.getUserGuild());
  const [myFaction, setMyFaction] = useState<FactionDef>(guildFactionManager.getUserFaction());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFactionFilter, setSelectedFactionFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Guild Creation Form State
  const [newGuildName, setNewGuildName] = useState('');
  const [newGuildTag, setNewGuildTag] = useState('');
  const [newGuildFaction, setNewGuildFaction] = useState<string>('builders_league');
  const [newGuildCrest, setNewGuildCrest] = useState('🏰');
  const [newGuildCrestBg, setNewGuildCrestBg] = useState('bg-emerald-600');
  const [newGuildDesc, setNewGuildDesc] = useState('');
  const [newGuildMotd, setNewGuildMotd] = useState('Welcome to our new guild! Check out scheduled raids and voice channels.');
  const [newGuildRules, setNewGuildRules] = useState([
    '1. Be active and respectful to all guild members.',
    '2. Participate in weekly scheduled boss raids and events.',
    '3. Deposit surplus resources into the Guild Vault.',
  ]);

  // Organize Guild Event Modal State
  const [isOrganizingEvent, setIsOrganizingEvent] = useState(false);
  const [eventTitle, setEventTitle] = useState('Weekly Guild Fortress Raid');
  const [eventType, setEventType] = useState<'Raid' | 'Building Competition' | 'PvP Tournament' | 'Gathering Expedition'>('Raid');
  const [eventTime, setEventTime] = useState('Saturday 20:00 UTC');
  const [eventReward, setEventReward] = useState('5,000 Guild Vault Coins + Rare Drop Split');
  const [eventFreq, setEventFreq] = useState('144.20 MHz');

  // Vault Deposit State
  const [depositAmount, setDepositAmount] = useState(1000);

  const CREST_ICONS = ['🏰', '⚔️', '🍔', '🎶', '🚀', '🛡️', '🌐', '👑', '💎', '🔥', '⚡', '⛏️'];
  const CREST_BGS = [
    'bg-emerald-600', 'bg-cyan-600', 'bg-amber-600', 'bg-purple-600', 
    'bg-rose-600', 'bg-blue-600', 'bg-lime-600', 'bg-stone-800'
  ];

  const refreshState = () => {
    setGuilds([...guildFactionManager.getGuilds()]);
    setMyGuild(guildFactionManager.getUserGuild());
    setMyFaction(guildFactionManager.getUserFaction());
  };

  useEffect(() => {
    if (isOpen) {
      guildFactionManager.syncWithCloud(user?.uid).then(refreshState);
      refreshState();
    }

    const handler = () => refreshState();
    window.addEventListener('megaworld_guild_updated', handler);
    return () => window.removeEventListener('megaworld_guild_updated', handler);
  }, [isOpen, user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handlePledgeFaction = (factionId: string) => {
    guildFactionManager.setUserFaction(factionId, user?.uid);
    refreshState();
    showToast(`🚩 Allegiance pledged to ${guildFactionManager.getUserFaction().name}! Faction perk active.`);
  };

  const handleCreateGuild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuildName.trim() || !newGuildTag.trim()) {
      showToast('❌ Please provide a Guild Name and Tag!');
      return;
    }

    const created = guildFactionManager.createGuild({
      name: newGuildName.trim(),
      tag: newGuildTag.trim(),
      factionId: newGuildFaction,
      leaderUid: user?.uid || 'guest_leader',
      leaderName: user?.displayName || 'Adventurer_Leader',
      crestIcon: newGuildCrest,
      crestBg: newGuildCrestBg,
      description: newGuildDesc.trim() || 'A proud guild of MegaWorld adventurers.',
      motd: newGuildMotd.trim(),
      rules: newGuildRules,
      joinType: 'open',
    });

    refreshState();
    setActiveTab('my_guild');
    showToast(`👑 Guild [${created.tag}] ${created.name} successfully established!`);
  };

  const handleJoinGuild = (guild: GuildDef) => {
    const success = guildFactionManager.joinGuild(guild.id, {
      uid: user?.uid || `guest_${Date.now()}`,
      name: user?.displayName || 'Adventurer',
      avatarType: 'minecraft',
    });

    if (success) {
      refreshState();
      setActiveTab('my_guild');
      showToast(`🎉 Joined [${guild.tag}] ${guild.name}! Faction aligned to ${guildFactionManager.getUserFaction().name}.`);
    } else {
      showToast('❌ Guild is currently full or invite-only.');
    }
  };

  const handleLeaveGuild = () => {
    if (!myGuild) return;
    guildFactionManager.leaveGuild(myGuild.id, user?.uid || 'guest_leader');
    refreshState();
    setActiveTab('browse');
    showToast(`Left ${myGuild.name}. You are now an independent adventurer.`);
  };

  const handleScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!myGuild) return;

    guildFactionManager.createGuildEvent(myGuild.id, {
      title: eventTitle,
      type: eventType,
      scheduledTime: eventTime,
      rewardText: eventReward,
      creatorName: user?.displayName || 'Guild Leader',
      voiceChannelFrequency: eventFreq,
    });

    setIsOrganizingEvent(false);
    refreshState();
    showToast(`📅 Guild Event "${eventTitle}" scheduled! Dispatched to all members.`);
  };

  const handleDepositVault = () => {
    if (!myGuild || depositAmount <= 0) return;
    guildFactionManager.depositVault(myGuild.id, depositAmount, Math.floor(depositAmount / 20));
    refreshState();
    showToast(`🪙 Deposited ${depositAmount.toLocaleString()} Coins into Guild Vault!`);
  };

  if (!isOpen) return null;

  const isLeader = myGuild?.leaderUid === (user?.uid || 'guest_leader');

  const filteredGuilds = guilds.filter(g => {
    const matchesSearch = 
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      g.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFaction = selectedFactionFilter === 'all' || g.factionId === selectedFactionFilter;
    return matchesSearch && matchesFaction;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-mono">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-stone-950 border-2 border-amber-500/50 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* ================= HEADER STRIP ================= */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-900 via-amber-950/60 to-stone-900 border-b border-stone-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 flex items-center justify-center text-2xl shadow-lg">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white">
                  MegaWorld Guilds & Factions
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-400/30 font-bold">
                  Multiplayer RPG Faction System
                </span>
              </div>
              <p className="text-xs text-stone-400 line-clamp-1">
                Pledge allegiance to major world factions, form player guilds, organize voice raids, and unlock powerful shared perks!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              audioEngine.playRobloxSound('click');
              onClose();
            }}
            className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-700 transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= TOAST NOTIFICATION ================= */}
        {toastMessage && (
          <div className="bg-amber-500 text-black px-4 py-2 font-bold text-xs text-center animate-in slide-in-from-top-2 border-b border-amber-400">
            {toastMessage}
          </div>
        )}

        {/* ================= NAVIGATION TABS ================= */}
        <div className="flex items-center justify-between bg-stone-900/90 border-b border-stone-800 px-4 py-2.5 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { id: 'my_guild', label: myGuild ? `🛡️ ${myGuild.tag} ${myGuild.name}` : '🛡️ My Guild' },
              { id: 'factions', label: '🚩 Major Factions (6)' },
              { id: 'browse', label: '🔍 Browse Guilds' },
              { id: 'create', label: '👑 Create Guild' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  audioEngine.playRobloxSound('click');
                  setActiveTab(tab.id as any);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md font-black'
                    : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Current Faction Badge */}
          <div className="flex items-center gap-2 text-xs bg-stone-950 px-3 py-1 rounded-xl border border-stone-800">
            <span className="text-stone-400 text-[11px]">Faction:</span>
            <span className="font-bold flex items-center gap-1" style={{ color: myFaction.accentColor }}>
              <span>{myFaction.icon}</span>
              <span>{myFaction.name}</span>
            </span>
          </div>
        </div>

        {/* ================= MAIN CONTENT BODY ================= */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* ================= TAB 1: MY GUILD DASHBOARD ================= */}
          {activeTab === 'my_guild' && (
            <div>
              {myGuild ? (
                <div className="space-y-6">
                  {/* Guild Banner Card */}
                  <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border-2 border-stone-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-16 h-16 rounded-2xl ${myGuild.crestBg} border-2 border-white/20 flex items-center justify-center text-3xl shadow-xl`}>
                          {myGuild.crestIcon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-2 py-0.5 rounded bg-amber-500 text-black font-black">
                              [{myGuild.tag}]
                            </span>
                            <h3 className="text-2xl font-black text-white">
                              {myGuild.name}
                            </h3>
                            <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                              Level {myGuild.level} Guild
                            </span>
                          </div>
                          <p className="text-xs text-stone-300 mt-1 max-w-xl">
                            {myGuild.description}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-400">
                            <span>Leader: <strong className="text-amber-400">{myGuild.leaderName}</strong></span>
                            <span>Members: <strong className="text-white">{myGuild.membersCount} / {myGuild.maxMembers}</strong></span>
                            <span>Alignment: <strong style={{ color: myFaction.accentColor }}>{myFaction.name}</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Guild Vault Stats */}
                      <div className="flex items-center gap-3 bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800">
                        <div>
                          <div className="text-[10px] text-stone-400 uppercase font-bold">Guild Vault</div>
                          <div className="flex items-center gap-3 text-sm font-black mt-0.5">
                            <span className="text-yellow-400 flex items-center gap-1">
                              🪙 {myGuild.vaultCoins.toLocaleString()}
                            </span>
                            <span className="text-cyan-400 flex items-center gap-1">
                              R$ {myGuild.vaultRobux.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={handleDepositVault}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl transition cursor-pointer"
                        >
                          + Deposit
                        </button>
                      </div>
                    </div>

                    {/* Message of the Day (MOTD) */}
                    <div className="mt-4 pt-4 border-t border-stone-800/80 flex items-start gap-2 bg-stone-950/40 p-3 rounded-2xl">
                      <span className="text-amber-400 text-base">📢</span>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-400 block">Message of the Day:</span>
                        <p className="text-xs text-stone-200 font-medium">{myGuild.motd}</p>
                      </div>
                    </div>
                  </div>

                  {/* Perks Unlocked & Guild Rules */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Perks */}
                    <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow">
                      <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Sparkles size={16} className="text-yellow-400" />
                        <span>Unlocked Guild Perks</span>
                      </h4>
                      <div className="flex flex-col gap-2">
                        {myGuild.perksUnlocked.map((perk, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs bg-stone-950 p-2.5 rounded-xl border border-stone-800 text-stone-200">
                            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                            <span>{perk}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Rules */}
                    <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 shadow">
                      <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <FileText size={16} className="text-cyan-400" />
                        <span>Guild Rules & Code of Conduct</span>
                      </h4>
                      <div className="flex flex-col gap-1.5 text-xs text-stone-300">
                        {myGuild.rules.map((rule, idx) => (
                          <div key={idx} className="bg-stone-950 p-2 rounded-xl border border-stone-800/80">
                            {rule}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Organized Guild In-Game Events & Raids */}
                  <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Trophy size={16} className="text-amber-400" />
                          <span>Guild Organized Events & Raids</span>
                        </h4>
                        <p className="text-[11px] text-stone-400">
                          Events scheduled by guild leadership with dedicated proximity voice radar channels!
                        </p>
                      </div>

                      {isLeader && (
                        <button
                          onClick={() => setIsOrganizingEvent(true)}
                          className="px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-black font-bold text-xs rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow"
                        >
                          <Plus size={14} />
                          <span>Schedule Guild Event</span>
                        </button>
                      )}
                    </div>

                    {/* Events List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {myGuild.organizedEvents.map(evt => (
                        <div key={evt.id} className="bg-stone-950 border border-stone-800 p-3.5 rounded-2xl flex flex-col justify-between gap-2 shadow">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-amber-300">{evt.title}</span>
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-bold uppercase">
                                {evt.type}
                              </span>
                            </div>
                            <div className="text-[11px] text-stone-400 mt-1">
                              Time: <strong className="text-white">{evt.scheduledTime}</strong>
                            </div>
                            <div className="text-[11px] text-emerald-400 mt-0.5">
                              Reward: {evt.rewardText}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 text-[10px]">
                            {onOpenVoiceChat && (
                              <button
                                onClick={() => onOpenVoiceChat(evt.voiceChannelFrequency)}
                                className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer"
                              >
                                <Radio size={12} />
                                <span>Voice: {evt.voiceChannelFrequency}</span>
                              </button>
                            )}
                            <span className="text-stone-500">Host: {evt.creatorName}</span>
                          </div>
                        </div>
                      ))}
                      {myGuild.organizedEvents.length === 0 && (
                        <div className="col-span-2 text-center text-xs text-stone-500 italic py-6">
                          No upcoming events scheduled. Guild leaders can schedule raids above!
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Members Roster */}
                  <div className="bg-stone-900/80 border border-stone-800 rounded-2xl p-4 sm:p-5 shadow">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Users size={16} className="text-emerald-400" />
                      <span>Guild Members Roster ({myGuild.membersCount})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {myGuild.members.map(member => (
                        <div key={member.uid} className="bg-stone-950 border border-stone-800 p-2.5 rounded-xl flex items-center justify-between gap-2 shadow">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-stone-900 flex items-center justify-center text-base border border-stone-700">
                              {member.role === 'Leader' ? '👑' : member.role === 'Officer' ? '⭐' : '🛡️'}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white leading-tight truncate max-w-[120px]">
                                {member.name}
                              </div>
                              <div className="text-[10px] text-stone-400">
                                {member.role} • {member.contributionXp} XP
                              </div>
                            </div>
                          </div>
                          <span className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-emerald-400' : 'bg-stone-600'}`} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leave / Disband Guild Button */}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleLeaveGuild}
                      className="px-4 py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/40 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                    >
                      <LogOut size={14} />
                      <span>Leave Guild</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="w-20 h-20 bg-stone-900 rounded-3xl border-2 border-stone-800 flex items-center justify-center text-4xl mx-auto shadow-xl">
                    🛡️
                  </div>
                  <h3 className="text-xl font-black text-white">You are not in a Guild</h3>
                  <p className="text-xs text-stone-400 max-w-md mx-auto">
                    Join an existing guild to access shared guild vaults, scheduled boss raids, and faction perks, or establish your own!
                  </p>
                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab('browse')}
                      className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition cursor-pointer shadow"
                    >
                      Browse Guilds
                    </button>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="px-5 py-2.5 bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs rounded-xl border border-stone-700 transition cursor-pointer"
                    >
                      Create a Guild
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 2: MAJOR FACTIONS (6) ================= */}
          {activeTab === 'factions' && (
            <div className="space-y-4">
              <div className="border-b border-stone-800 pb-2">
                <h3 className="text-base font-black text-white">MegaWorld Major Factions</h3>
                <p className="text-xs text-stone-400">
                  Each faction grants permanent passive world perks and unlocks exclusive brand storylines!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FACTIONS_LIST.map(fac => {
                  const isMyFac = myFaction.id === fac.id;

                  return (
                    <div
                      key={fac.id}
                      className={`bg-gradient-to-br ${fac.bannerGradient} border-2 rounded-2xl p-5 flex flex-col justify-between gap-4 shadow-xl transition ${
                        isMyFac ? 'border-amber-400 ring-2 ring-amber-400/40' : 'border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-3xl">{fac.icon}</span>
                            <div>
                              <h4 className="text-base font-black text-white flex items-center gap-2">
                                <span>{fac.name}</span>
                                {isMyFac && (
                                  <span className="text-[9px] bg-amber-400 text-black px-2 py-0.2 rounded font-black uppercase">
                                    Active Allegiance
                                  </span>
                                )}
                              </h4>
                              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                                {fac.brand} Faction • {fac.activePlayersCount} Players
                              </span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-stone-300 mt-2.5 leading-relaxed">
                          {fac.description}
                        </p>

                        {/* Passive Perk */}
                        <div className="mt-3 bg-black/50 p-2.5 rounded-xl border border-white/10">
                          <span className="text-[10px] uppercase font-bold text-amber-400 block">
                            ⚡ Passive Perk: {fac.passivePerkName}
                          </span>
                          <span className="text-xs text-stone-200">
                            {fac.passivePerkDesc}
                          </span>
                        </div>

                        {/* Exclusive Quest */}
                        <div className="mt-2 bg-black/40 p-2.5 rounded-xl border border-white/5">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                            📜 Exclusive Storyline: {fac.exclusiveQuestTitle}
                          </span>
                          <span className="text-[11px] text-stone-300">
                            Reward: {fac.exclusiveQuestReward}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                        {onOpenQuests && (
                          <button
                            onClick={onOpenQuests}
                            className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <span>View Quests</span>
                            <ChevronRight size={14} />
                          </button>
                        )}

                        <button
                          onClick={() => handlePledgeFaction(fac.id)}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shadow ${
                            isMyFac
                              ? 'bg-amber-400 text-black cursor-default'
                              : 'bg-stone-900 hover:bg-stone-800 text-white border border-stone-700'
                          }`}
                        >
                          {isMyFac ? '✓ Pledged' : 'Pledge Allegiance'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: BROWSE GUILDS ================= */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900 p-3 rounded-2xl border border-stone-800">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search guilds by name, tag, or description..."
                  className="flex-1 bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />

                <select
                  value={selectedFactionFilter}
                  onChange={e => setSelectedFactionFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                >
                  <option value="all">All Factions</option>
                  {FACTIONS_LIST.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Guilds List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGuilds.map(guild => {
                  const isCurrent = myGuild?.id === guild.id;
                  const guildFaction = FACTIONS_LIST.find(f => f.id === guild.factionId) || FACTIONS_LIST[0];

                  return (
                    <div
                      key={guild.id}
                      className="bg-stone-900/90 border border-stone-800 hover:border-amber-500/40 p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-3 shadow-xl transition"
                    >
                      <div>
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${guild.crestBg} flex items-center justify-center text-2xl shadow`}>
                            {guild.crestIcon}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs px-1.5 py-0.2 rounded bg-amber-500 text-black font-black">
                                [{guild.tag}]
                              </span>
                              <h4 className="text-base font-black text-white">{guild.name}</h4>
                            </div>
                            <span className="text-[10px] text-stone-400">
                              Aligned with <strong style={{ color: guildFaction.accentColor }}>{guildFaction.name}</strong> • Level {guild.level}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-stone-300 mt-2 line-clamp-2">
                          {guild.description}
                        </p>

                        <div className="mt-2 text-[11px] text-stone-400 flex items-center justify-between">
                          <span>Members: <strong className="text-white">{guild.membersCount} / {guild.maxMembers}</strong></span>
                          <span>Vault: <strong className="text-yellow-400">🪙 {guild.vaultCoins.toLocaleString()}</strong></span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-stone-800/80">
                        <span className="text-[10px] text-stone-500">Leader: {guild.leaderName}</span>
                        {isCurrent ? (
                          <span className="text-xs text-amber-400 font-bold">Your Guild</span>
                        ) : (
                          <button
                            onClick={() => handleJoinGuild(guild)}
                            className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-xl transition cursor-pointer shadow"
                          >
                            Join Guild
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 4: CREATE GUILD ================= */}
          {activeTab === 'create' && (
            <form onSubmit={handleCreateGuild} className="max-w-2xl mx-auto space-y-4 bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-2xl">
              <div>
                <h3 className="text-lg font-black text-white">Establish a New Guild</h3>
                <p className="text-xs text-stone-400">
                  Lead your own squad of builders, raiders, and content creators across the multiverse.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">Guild Name</label>
                  <input
                    type="text"
                    required
                    value={newGuildName}
                    onChange={e => setNewGuildName(e.target.value)}
                    placeholder="e.g. Diamond Voxel Knights"
                    className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">Guild Tag (3-5 Letters)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={newGuildTag}
                    onChange={e => setNewGuildTag(e.target.value.toUpperCase())}
                    placeholder="e.g. DVK"
                    className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400 uppercase font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Faction Allegiance</label>
                <select
                  value={newGuildFaction}
                  onChange={e => setNewGuildFaction(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2.5 rounded-xl focus:outline-none focus:border-amber-400"
                >
                  {FACTIONS_LIST.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.icon} {f.name} ({f.brand})
                    </option>
                  ))}
                </select>
              </div>

              {/* Crest Icon & Background Pickers */}
              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1.5">Choose Crest Emblem & Color</label>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  {CREST_ICONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setNewGuildCrest(icon)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition border cursor-pointer ${
                        newGuildCrest === icon ? 'bg-amber-500/20 border-amber-400 scale-110' : 'bg-stone-950 border-stone-800 hover:border-stone-700'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {CREST_BGS.map(bg => (
                    <button
                      key={bg}
                      type="button"
                      onClick={() => setNewGuildCrestBg(bg)}
                      className={`w-7 h-7 rounded-lg ${bg} transition border-2 cursor-pointer ${
                        newGuildCrestBg === bg ? 'border-white scale-110' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Guild Description</label>
                <textarea
                  rows={2}
                  value={newGuildDesc}
                  onChange={e => setNewGuildDesc(e.target.value)}
                  placeholder="Describe your guild goals, recruitment focus, and playstyle..."
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-black text-sm rounded-xl transition cursor-pointer shadow-lg active:scale-98"
              >
                👑 Establish Guild (500 Starting Coins Granted)
              </button>
            </form>
          )}

        </div>

        {/* ================= MODAL: ORGANIZE GUILD EVENT ================= */}
        {isOrganizingEvent && (
          <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <form onSubmit={handleScheduleEvent} className="bg-stone-900 border-2 border-amber-500/80 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                <h4 className="text-base font-black text-white flex items-center gap-2">
                  <span>📅</span>
                  <span>Schedule Guild Event or Raid</span>
                </h4>
                <button type="button" onClick={() => setIsOrganizingEvent(false)} className="text-stone-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Event Title</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={e => setEventTitle(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3.5 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">Event Type</label>
                  <select
                    value={eventType}
                    onChange={e => setEventType(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                  >
                    <option value="Raid">Boss Raid</option>
                    <option value="Building Competition">Building Competition</option>
                    <option value="PvP Tournament">PvP Tournament</option>
                    <option value="Gathering Expedition">Gathering Expedition</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-stone-300 font-bold block mb-1">Voice Radar Frequency</label>
                  <input
                    type="text"
                    value={eventFreq}
                    onChange={e => setEventFreq(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Scheduled Time / Date</label>
                <input
                  type="text"
                  required
                  value={eventTime}
                  onChange={e => setEventTime(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-xs text-stone-300 font-bold block mb-1">Reward Pool</label>
                <input
                  type="text"
                  value={eventReward}
                  onChange={e => setEventReward(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-white text-xs px-3 py-2 rounded-xl focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOrganizingEvent(false)}
                  className="px-4 py-2 bg-stone-800 text-stone-300 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-black rounded-xl shadow"
                >
                  Confirm & Schedule
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
