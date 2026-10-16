import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle, 
  Disc, 
  Music, 
  Radio, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Sparkles,
  Sliders
} from 'lucide-react';
import ReactPlayer from 'react-player';
import { audioEngine } from '../utils/audioEngine';
import { SONGS_PLAYLIST, MusicTrack } from '../utils/musicTracks';

interface JukeboxPlayerProps {
  className?: string;
  defaultExpanded?: boolean;
  onTrackSelect?: (track: MusicTrack) => void;
}

export default function JukeboxPlayer({ 
  className = '', 
  defaultExpanded = false,
  onTrackSelect 
}: JukeboxPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(audioEngine.getIsPlaying());
  const [currentTrack, setCurrentTrack] = useState<MusicTrack>(audioEngine.getTrack());
  const [volume, setVolume] = useState(audioEngine.getVolume());
  const [isMuted, setIsMuted] = useState(audioEngine.getIsMuted());
  const [isLooping, setIsLooping] = useState(audioEngine.getIsLooping());
  const [isShuffle, setIsShuffle] = useState(audioEngine.getIsShuffle());
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [showCustomUrlDrawer, setShowCustomUrlDrawer] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [activeExternalUrl, setActiveExternalUrl] = useState('');
  const [visualizerBars, setVisualizerBars] = useState<number[]>([15, 25, 40, 60, 30, 45, 20, 10]);

  // Sync state with global audioEngine
  useEffect(() => {
    const unsubPlay = audioEngine.onPlayStateChange((playing) => setIsPlaying(playing));
    const unsubTrack = audioEngine.onTrackChange((track) => setCurrentTrack(track));
    return () => {
      unsubPlay();
      unsubTrack();
    };
  }, []);

  // Visualizer loop when playing
  useEffect(() => {
    let animId: number;
    const updateVisualizer = () => {
      if (isPlaying && !isMuted) {
        const data = audioEngine.getVisualizerData();
        // Fallback pulsing if frequencies are minimal
        const enhanced = data.map((v, i) => Math.max(12, v + Math.floor(Math.sin(Date.now() / 150 + i) * 15 + 15)));
        setVisualizerBars(enhanced);
      } else {
        setVisualizerBars([6, 6, 6, 6, 6, 6, 6, 6]);
      }
      animId = requestAnimationFrame(updateVisualizer);
    };

    animId = requestAnimationFrame(updateVisualizer);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, isMuted]);

  const handleTogglePlay = () => {
    // If playing external url, pause it
    if (activeExternalUrl) {
      setActiveExternalUrl('');
    }
    audioEngine.togglePlayPause();
  };

  const handleSelectTrack = (track: MusicTrack) => {
    if (activeExternalUrl) {
      setActiveExternalUrl('');
    }
    audioEngine.playTrack(track);
    if (onTrackSelect) onTrackSelect(track);
  };

  const handleNext = () => {
    if (activeExternalUrl) {
      setActiveExternalUrl('');
    }
    audioEngine.nextTrack();
  };

  const handlePrev = () => {
    if (activeExternalUrl) {
      setActiveExternalUrl('');
    }
    audioEngine.prevTrack();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    audioEngine.setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  const handleToggleLoop = () => {
    const newLoop = !isLooping;
    setIsLooping(newLoop);
    audioEngine.setLooping(newLoop);
  };

  const handleToggleShuffle = () => {
    const newShuffle = !isShuffle;
    setIsShuffle(newShuffle);
    audioEngine.setShuffle(newShuffle);
  };

  const handlePlayCustomUrl = () => {
    if (!customUrl.trim()) return;
    audioEngine.pause();
    setActiveExternalUrl(customUrl.trim());
  };

  return (
    <div className={`bg-stone-900/95 border-2 border-amber-800/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden text-stone-200 transition-all select-none ${className}`}>
      {/* ================= TOP JUKEBOX HEADER / MINI BAR ================= */}
      <div className="p-3.5 sm:p-4 bg-gradient-to-r from-amber-950/80 via-stone-900 to-amber-950/80 flex flex-wrap items-center justify-between gap-3 border-b border-amber-800/40">
        {/* Left: Spinning Disc & Song Info */}
        <div className="flex items-center gap-3 min-w-0">
          <div 
            onClick={handleTogglePlay}
            className="relative w-12 h-12 rounded-full cursor-pointer flex-shrink-0 flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
            style={{
              background: `radial-gradient(circle, ${currentTrack.discColorPrimary} 25%, #18181b 26%, #27272a 60%, ${currentTrack.discColorSecondary} 62%, #09090b 100%)`,
              boxShadow: isPlaying ? `0 0 15px ${currentTrack.discColorPrimary}60` : 'none'
            }}
            title={isPlaying ? 'Click to Pause' : 'Click to Play'}
          >
            {/* Vinyl record grooves */}
            <div className={`w-full h-full rounded-full border border-stone-700/60 flex items-center justify-center ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
              <div 
                className="w-4 h-4 rounded-full border border-stone-950 flex items-center justify-center shadow-inner"
                style={{ backgroundColor: currentTrack.discColorPrimary }}
              >
                <div className="w-1.5 h-1.5 bg-stone-950 rounded-full" />
              </div>
            </div>
            {/* Play/Pause overlay indicator */}
            <div className="absolute inset-0 bg-black/30 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              {isPlaying ? <Pause size={16} className="text-white drop-shadow" /> : <Play size={16} className="text-white drop-shadow ml-0.5" />}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider bg-amber-900/60 text-amber-300 border border-amber-700/60 px-1.5 py-0.5 rounded font-bold">
                Jukebox
              </span>
              <span className="text-[11px] font-mono text-stone-400 truncate">
                {currentTrack.genre}
              </span>
            </div>
            <div className="text-sm font-bold text-white truncate flex items-center gap-1.5 mt-0.5 font-mono">
              <span>{currentTrack.icon}</span>
              <span className="truncate">{currentTrack.title}</span>
            </div>
            <div className="text-xs text-stone-400 font-mono truncate">
              {currentTrack.artist} • {currentTrack.bpm} BPM
            </div>
          </div>
        </div>

        {/* Center: Live Bouncing Audio Visualizer */}
        <div className="hidden sm:flex items-end gap-1 h-7 px-3 bg-stone-950/80 border border-stone-800 rounded-lg">
          {visualizerBars.map((val, idx) => (
            <div
              key={idx}
              className="w-1.5 rounded-t transition-all duration-75"
              style={{
                height: `${Math.max(4, (val / 100) * 24)}px`,
                backgroundColor: currentTrack.discColorPrimary,
                opacity: isPlaying ? 0.9 : 0.3
              }}
            />
          ))}
        </div>

        {/* Right: Quick Controls & Toggle Expand */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          {/* Previous */}
          <button
            onClick={handlePrev}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition active:scale-95 cursor-pointer"
            title="Previous Song"
          >
            <SkipBack size={16} />
          </button>

          {/* Play / Pause Main Button */}
          <button
            onClick={handleTogglePlay}
            className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-mono text-xs font-bold shadow-md border border-amber-400/60 flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? (
              <>
                <Pause size={14} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={14} />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Next */}
          <button
            onClick={handleNext}
            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-lg transition active:scale-95 cursor-pointer"
            title="Next Song"
          >
            <SkipForward size={16} />
          </button>

          {/* Expand Playlist Button */}
          <button
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-1.5 bg-stone-800 hover:bg-amber-800/60 text-stone-300 hover:text-amber-200 rounded-lg transition flex items-center gap-1 text-xs font-mono cursor-pointer border border-stone-700"
            title="Browse All Songs"
          >
            <Music size={14} />
            <span className="hidden md:inline">Tracklist</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* ================= EXPANDABLE PLAYLIST & DETAILED CONTROLS ================= */}
      {isExpanded && (
        <div className="p-3 sm:p-4 space-y-4 bg-stone-950/70 border-t border-stone-800 animate-in fade-in duration-200">
          {/* Secondary Controls Bar: Volume, Shuffle, Loop, Custom URL */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900/90 p-2.5 rounded-xl border border-stone-800">
            {/* Volume Control */}
            <div className="flex items-center gap-2 min-w-[150px]">
              <button
                onClick={handleToggleMute}
                className="text-stone-400 hover:text-white transition cursor-pointer"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? <VolumeX size={16} className="text-red-400" /> : <Volume2 size={16} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 accent-amber-500 cursor-pointer h-1.5 bg-stone-700 rounded-lg"
                title="Master Music Volume"
              />
              <span className="text-[11px] font-mono text-stone-400 w-8">
                {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
              </span>
            </div>

            {/* Playback Modes: Loop & Shuffle */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleLoop}
                className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition cursor-pointer ${
                  isLooping 
                    ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50' 
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="Repeat current song"
              >
                <Repeat size={13} />
                <span>Loop</span>
              </button>
              <button
                onClick={handleToggleShuffle}
                className={`px-2 py-1 rounded text-xs font-mono flex items-center gap-1 transition cursor-pointer ${
                  isShuffle 
                    ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50' 
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
                title="Shuffle tracklist"
              >
                <Shuffle size={13} />
                <span>Shuffle</span>
              </button>
            </div>

            {/* Custom URL / YouTube toggle */}
            <button
              onClick={() => setShowCustomUrlDrawer(prev => !prev)}
              className="text-xs font-mono text-stone-400 hover:text-stone-200 flex items-center gap-1.5 bg-stone-800 hover:bg-stone-700 px-2.5 py-1 rounded transition cursor-pointer"
              title="Play custom YouTube or external audio link"
            >
              <ExternalLink size={13} />
              <span>Custom Audio Link</span>
            </button>
          </div>

          {/* Custom URL Drawer */}
          {showCustomUrlDrawer && (
            <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl space-y-2">
              <div className="text-xs font-mono text-stone-300 flex items-center gap-1">
                <span>🔗 Paste YouTube Video or Audio stream link:</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="bg-stone-950 border border-stone-700 px-3 py-1.5 rounded-lg text-xs font-mono text-white flex-grow outline-none focus:border-amber-400"
                />
                <button
                  onClick={handlePlayCustomUrl}
                  className="bg-amber-600 hover:bg-amber-500 text-white font-mono text-xs px-3 py-1.5 rounded-lg font-bold transition cursor-pointer shadow"
                >
                  Stream Link
                </button>
              </div>
              {activeExternalUrl && (
                <div className="mt-2 bg-black rounded-lg overflow-hidden border border-stone-800">
                  <ReactPlayer 
                    {...({ 
                      url: activeExternalUrl, 
                      width: '100%', 
                      height: '180px', 
                      controls: true, 
                      playing: true 
                    } as any)} 
                  />
                </div>
              )}
            </div>
          )}

          {/* ================= SONG TRACK LIST (CARDS) ================= */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Disc size={14} />
                <span>Minecraft & Themed Music Discs ({SONGS_PLAYLIST.length})</span>
              </h4>
              <span className="text-[11px] font-mono text-stone-500">
                Click any disc to play
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {SONGS_PLAYLIST.map((track) => {
                const isSelected = currentTrack.id === track.id;
                const isCurrentPlaying = isSelected && isPlaying && !activeExternalUrl;

                return (
                  <div
                    key={track.id}
                    onClick={() => handleSelectTrack(track)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 relative overflow-hidden group ${
                      isSelected
                        ? 'bg-amber-950/40 border-amber-500/80 shadow-md ring-1 ring-amber-400/30'
                        : 'bg-stone-900/80 border-stone-800 hover:border-stone-700 hover:bg-stone-800/80'
                    }`}
                  >
                    {/* Disc Icon with colored ring */}
                    <div 
                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border shadow-inner ${
                        isCurrentPlaying ? 'animate-spin' : ''
                      }`}
                      style={{
                        animationDuration: '4s',
                        background: `radial-gradient(circle, ${track.discColorPrimary} 35%, #18181b 36%, #27272a 75%, ${track.discColorSecondary} 100%)`,
                        borderColor: track.discColorPrimary
                      }}
                    >
                      <span className="text-sm select-none">{track.icon}</span>
                    </div>

                    {/* Song Details */}
                    <div className="min-w-0 flex-grow font-mono">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isSelected ? 'text-amber-300' : 'text-stone-200 group-hover:text-white'}`}>
                          {track.title}
                        </span>
                        <span className="text-[10px] text-stone-500 flex-shrink-0">
                          {Math.floor(track.durationSeconds / 60)}:{(track.durationSeconds % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 truncate">
                        {track.artist}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate flex items-center gap-2 mt-0.5">
                        <span className="text-amber-400/80">{track.genre}</span>
                        <span>•</span>
                        <span>{track.bpm} BPM</span>
                      </div>
                    </div>

                    {/* Playing indicator / Disc tag */}
                    {isSelected && (
                      <div className="flex-shrink-0">
                        {isCurrentPlaying ? (
                          <div className="flex items-center gap-0.5 h-4">
                            <span className="w-1 h-3 bg-amber-400 animate-pulse rounded" />
                            <span className="w-1 h-4 bg-amber-300 animate-bounce rounded" />
                            <span className="w-1 h-2 bg-amber-500 animate-pulse rounded" />
                          </div>
                        ) : (
                          <Play size={14} className="text-amber-400/80" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
