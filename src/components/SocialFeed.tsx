import React, { useState, useEffect } from 'react';
import { 
  Heart, MessageSquare, Share2, Download, ExternalLink, Sparkles, 
  Flame, Gem, Camera, Compass, Plus, Filter, Check, Eye, MapPin, 
  Send, Layers, Swords, Box, User, Star, ChevronDown, ChevronUp, Copy
} from 'lucide-react';
import { socialFeedManager, SocialPost, BuildSchematic, ScreenshotHighlight } from '../utils/socialFeedManager';
import { audioEngine } from '../utils/audioEngine';
import CharacterAvatar from './CharacterAvatar';

interface SocialFeedProps {
  user?: any;
  onImportBuild?: (schematic: BuildSchematic) => void;
  onWarpToCoordinates?: (x: number, y: number) => void;
}

// Block style definitions for interactive 2D mini-grids
const BLOCK_STYLES: Record<string, { bg: string; border: string; text?: string }> = {
  sky: { bg: 'bg-sky-400/25', border: 'border-sky-300/10' },
  grass: { bg: 'bg-[#557a2b]', border: 'border-t-[#7cfc00] border-t-2 border-[#3d5a1b]' },
  dirt: { bg: 'bg-[#866043]', border: 'border-[#5c3e28]' },
  stone: { bg: 'bg-[#808080]', border: 'border-[#595959]' },
  bedrock: { bg: 'bg-[#1e1e1e]', border: 'border-[#111111]' },
  wood: { bg: 'bg-[#8d6e63]', border: 'border-[#5f4339]' },
  bricks: { bg: 'bg-[#b71c1c]', border: 'border-[#7f0000]' },
  obsidian: { bg: 'bg-[#181124]', border: 'border-[#3b1261]' },
  crying_obsidian: { bg: 'bg-[#3b0764]', border: 'border-purple-400/80 shadow-[0_0_6px_rgba(168,85,247,0.7)]' },
  amethyst: { bg: 'bg-[#a855f7]', border: 'border-purple-300 shadow-[0_0_8px_rgba(216,180,254,0.8)]' },
  glowstone: { bg: 'bg-[#fef08a]', border: 'border-yellow-200 shadow-[0_0_10px_rgba(254,240,138,0.9)]' },
  sculk: { bg: 'bg-[#042f2e]', border: 'border-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]' },
  netherite: { bg: 'bg-[#3f3f46]', border: 'border-stone-500' },
  diamond: { bg: 'bg-[#22d3ee]', border: 'border-cyan-200 shadow-[0_0_8px_rgba(34,211,238,0.9)]' },
  repeating_command_block: { bg: 'bg-[#7e22ce]', border: 'border-fuchsia-300 animate-pulse' },
  glass: { bg: 'bg-cyan-200/40 backdrop-blur-xs', border: 'border-cyan-100/60' },
  door: { bg: 'bg-[#78350f]', border: 'border-[#451a03]' },
  torch: { bg: 'bg-amber-400', border: 'border-yellow-200 shadow-[0_0_8px_rgba(251,191,36,0.9)]' },
  magma: { bg: 'bg-[#ea580c]', border: 'border-yellow-400 shadow-[0_0_8px_rgba(234,88,12,0.9)]' },
};

export default function SocialFeed({
  user,
  onImportBuild,
  onWarpToCoordinates,
}: SocialFeedProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'builds' | 'screenshots' | 'ugc' | 'liked'>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<'trending' | 'newest' | 'top'>('trending');
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<string>('');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareTab, setShareTab] = useState<'build' | 'screenshot'>('build');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Post Form State
  const [postTitle, setPostTitle] = useState('');
  const [postCaption, setPostCaption] = useState('');
  const [postBrand, setPostBrand] = useState<'Minecraft' | 'Roblox' | 'YouTube' | 'McDonald\'s' | 'BP' | 'Countryballs' | 'NZ' | 'New World'>('Minecraft');
  const [postTags, setPostTags] = useState('2D Build, Community, Sandbox');

  useEffect(() => {
    // Initial load from local memory + Firestore cloud sync
    setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
    socialFeedManager.loadFromCloud().then((cloudPosts) => {
      setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
    });

    const handleUpdate = () => {
      setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
    };
    window.addEventListener('megaworld_social_feed_updated', handleUpdate);
    return () => window.removeEventListener('megaworld_social_feed_updated', handleUpdate);
  }, [selectedCategory, selectedSort, selectedBrand]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  const handleLike = (postId: string) => {
    audioEngine.playMinecraftSound('orb');
    socialFeedManager.toggleLike(postId);
    setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
  };

  const handleReaction = (postId: string, type: 'diamond' | 'fire') => {
    audioEngine.playMinecraftSound(type === 'diamond' ? 'levelup' : 'bell');
    socialFeedManager.addReaction(postId, type);
    setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
    showToast(type === 'diamond' ? '💎 Sent Diamond Gem reaction!' : '🔥 Sent Fire reaction!');
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;
    const authorName = user?.displayName || 'Adventurer Miner';
    socialFeedManager.addComment(postId, commentInput, authorName);
    setCommentInput('');
    setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
    audioEngine.playMinecraftSound('click');
    showToast('💬 Comment published to community feed!');
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postCaption.trim()) {
      showToast('⚠️ Please provide both a title and description.');
      return;
    }

    const tagsArray = postTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (shareTab === 'build') {
      await socialFeedManager.createPost({
        type: 'minecraft_2d_build',
        title: postTitle.trim(),
        caption: postCaption.trim(),
        brandTheme: postBrand,
        tags: tagsArray.length > 0 ? tagsArray : ['2D Build', 'Community'],
        author: {
          uid: user?.uid || 'guest-author',
          name: user?.displayName || 'Creative Architect',
          avatarType: 'minecraft',
          avatarSubtype: 'steve',
          verified: !!user,
          rankTitle: 'Community Architect',
        },
        buildData: {
          schematicName: postTitle.trim(),
          dimensions: '12 x 8 Blocks',
          blockCount: 42,
          difficulty: 'Intermediate',
          primaryMaterials: ['Stone', 'Wood Planks', 'Glass', 'Glowstone'],
          worldCoordinates: { x: Math.floor(Math.random() * 80) + 5, y: 5, biome: 'Forest' },
          gridPreview: [
            ['sky', 'sky', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'sky', 'sky', 'glowstone', 'sky'],
            ['sky', 'wood', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'bricks', 'wood', 'sky', 'wood', 'sky'],
            ['wood', 'bricks', 'glass', 'glass', 'stone', 'stone', 'glass', 'glass', 'bricks', 'wood', 'stone', 'wood'],
            ['wood', 'stone', 'stone', 'stone', 'stone', 'stone', 'stone', 'stone', 'stone', 'wood', 'stone', 'wood'],
            ['wood', 'door', 'stone', 'stone', 'stone', 'stone', 'stone', 'stone', 'door', 'wood', 'stone', 'wood'],
            ['stone', 'stone', 'wood', 'wood', 'wood', 'wood', 'wood', 'wood', 'stone', 'stone', 'stone', 'stone'],
            ['dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt', 'dirt'],
            ['bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock', 'bedrock'],
          ],
        },
      });
    } else {
      await socialFeedManager.createPost({
        type: 'community_screenshot',
        title: postTitle.trim(),
        caption: postCaption.trim(),
        brandTheme: postBrand,
        tags: tagsArray.length > 0 ? tagsArray : ['Screenshot', 'Highlight'],
        author: {
          uid: user?.uid || 'guest-author',
          name: user?.displayName || 'Photographer Explorer',
          avatarType: 'youtube',
          verified: !!user,
          rankTitle: 'Frontier Explorer',
        },
        screenshotData: {
          locationName: 'Community Shared Vista',
          coordinates: `X: ${(Math.random() * 80 + 5).toFixed(2)}, Y: 5.00`,
          biome: 'Frontier Highlands',
          cameraAngle: '3D WebGL Isometric (Pitch: 52°)',
          visualTheme: 'Golden Multiverse Horizon',
          sceneStyle: 'sunset_citadel',
          resolution: '4K Ultra High-Definition (165 FPS)',
          featuredPlayers: [user?.displayName || 'Player', 'Steve'],
        },
      });
    }

    setIsShareModalOpen(false);
    setPostTitle('');
    setPostCaption('');
    setPosts(socialFeedManager.getPosts(selectedCategory, selectedSort, selectedBrand));
    audioEngine.playMinecraftSound('levelup');
    showToast('🚀 Your creation was shared to the Community Social Feed!');
  };

  const handleCopySchematic = (schematic: BuildSchematic) => {
    navigator.clipboard.writeText(JSON.stringify(schematic, null, 2));
    audioEngine.playMinecraftSound('orb');
    showToast(`📋 Copied "${schematic.schematicName}" JSON blueprint to clipboard!`);
  };

  return (
    <div className="bg-stone-900/95 border border-stone-800 rounded-3xl p-5 sm:p-7 shadow-2xl space-y-6 text-stone-200 font-mono">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-stone-950/95 border border-amber-400 text-amber-300 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles size={14} className="text-yellow-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-xl shadow-lg border border-amber-300/40">
              🏰
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <span>Community Social Feed</span>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live UGC
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                Explore player-made 2D Minecraft builds, schematics, and community photo moments across 10 universes.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-stone-400 bg-stone-950/80 px-3 py-1.5 rounded-xl border border-stone-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>1,420 Builders Online</span>
          </div>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="mc-btn mc-btn-primary px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow hover:scale-105"
          >
            <Plus size={14} />
            <span>Share Content</span>
          </button>
        </div>
      </div>

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/60 p-3 rounded-2xl border border-stone-800/80">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Posts', icon: '🌐' },
            { id: 'builds', label: '2D Builds', icon: '🏰' },
            { id: 'screenshots', label: 'Screenshots', icon: '📸' },
            { id: 'ugc', label: 'Skins & UGC', icon: '🎨' },
            { id: 'liked', label: 'My Favorites', icon: '❤️' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-black shadow-md'
                  : 'bg-stone-800/80 text-stone-400 hover:text-white hover:bg-stone-800'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Brand & Sort Filters */}
        <div className="flex items-center gap-2">
          {/* Brand Selector */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="bg-stone-800 text-stone-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-700 outline-none cursor-pointer"
          >
            <option value="all">All Universes</option>
            <option value="Minecraft">⛏️ Minecraft</option>
            <option value="Roblox">👟 Roblox</option>
            <option value="YouTube">▶️ YouTube</option>
            <option value="McDonald's">🍔 McDonald's</option>
            <option value="BP">⚡ BP Clean Energy</option>
            <option value="NZ">🌿 NZ Aotearoa</option>
            <option value="Countryballs">🌐 Countryballs</option>
            <option value="New World">⚔️ New World</option>
          </select>

          {/* Sort Selector */}
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value as any)}
            className="bg-stone-800 text-stone-300 text-xs font-bold px-3 py-1.5 rounded-xl border border-stone-700 outline-none cursor-pointer"
          >
            <option value="trending">🔥 Trending</option>
            <option value="newest">✨ Newest</option>
            <option value="top">💎 Top Rated</option>
          </select>
        </div>
      </div>

      {/* Feed Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.length === 0 ? (
          <div className="col-span-full py-16 text-center text-stone-400 space-y-3">
            <div className="text-4xl">📦</div>
            <p className="text-sm">No community posts found matching this filter.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); }}
              className="text-amber-400 hover:underline text-xs font-bold cursor-pointer"
            >
              Clear filters and view all
            </button>
          </div>
        ) : (
          posts.map((post) => (
            <article
              key={post.id}
              className="bg-stone-950/70 border border-stone-800 hover:border-amber-500/40 rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-xl group"
            >
              <div>
                {/* Author Bar */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-sm shadow">
                      {post.author.avatarType === 'minecraft' ? '⛏️' : post.author.avatarType === 'roblox' ? '👟' : post.author.avatarType === 'youtube' ? '▶️' : '👤'}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-white text-xs">{post.author.name}</span>
                        {post.author.verified && (
                          <span className="text-[10px] text-sky-400" title="Verified Creator">✓</span>
                        )}
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-stone-800 text-stone-400 border border-stone-700">
                          {post.brandTheme}
                        </span>
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {post.author.classTitle || post.author.rankTitle || 'Community Builder'} • {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                    post.type === 'minecraft_2d_build' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : post.type === 'community_screenshot'
                      ? 'bg-sky-500/20 text-sky-300 border-sky-500/30'
                      : 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  }`}>
                    {post.type === 'minecraft_2d_build' ? '🏰 2D Build' : post.type === 'community_screenshot' ? '📸 Screenshot' : '🎨 Skin UGC'}
                  </span>
                </div>

                {/* Post Title & Caption */}
                <h3 className="text-base font-bold text-white mb-1.5 group-hover:text-amber-300 transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mb-4 line-clamp-3">
                  {post.caption}
                </p>

                {/* ================= BUILD SCHEMATIC PREVIEW ================= */}
                {post.type === 'minecraft_2d_build' && post.buildData && (
                  <div className="mb-4 bg-stone-900 border border-stone-800 rounded-xl p-3 shadow-inner">
                    <div className="flex items-center justify-between text-[11px] text-stone-400 mb-2 font-mono">
                      <span>Dimensions: <strong className="text-amber-300">{post.buildData.dimensions}</strong></span>
                      <span>Difficulty: <strong className="text-emerald-300">{post.buildData.difficulty}</strong></span>
                    </div>

                    {/* Interactive 12x8 Mini-Grid Visualizer */}
                    <div className="grid grid-cols-12 gap-0.5 bg-black/60 p-2 rounded-lg border border-stone-800/80 mb-2 overflow-x-auto">
                      {post.buildData.gridPreview.map((row, rIdx) => (
                        <React.Fragment key={rIdx}>
                          {row.map((cell, cIdx) => {
                            const style = BLOCK_STYLES[cell] || { bg: 'bg-stone-600', border: 'border-stone-500' };
                            return (
                              <div
                                key={`${rIdx}-${cIdx}`}
                                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-xs border flex items-center justify-center transition-transform hover:scale-125 hover:z-10 cursor-pointer ${style.bg} ${style.border}`}
                                title={`Block: ${cell} (Row ${rIdx + 1}, Col ${cIdx + 1})`}
                              />
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>

                    {/* Primary Materials Tags */}
                    <div className="flex flex-wrap items-center gap-1 text-[10px] text-stone-400">
                      <span className="text-stone-400">Materials:</span>
                      {post.buildData.primaryMaterials.map((mat) => (
                        <span key={mat} className="bg-stone-800/90 text-stone-300 px-1.5 py-0.5 rounded border border-stone-700">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ================= COMMUNITY SCREENSHOT SCENE DISPLAY ================= */}
                {post.type === 'community_screenshot' && post.screenshotData && (
                  <div className="mb-4 bg-gradient-to-b from-stone-900 via-stone-950 to-stone-900 border border-stone-800 rounded-xl p-4 shadow-inner relative overflow-hidden group/screen">
                    <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
                      <span className="text-[9.5px] font-mono bg-black/80 text-yellow-300 px-2 py-0.5 rounded-full border border-yellow-400/40 shadow">
                        {post.screenshotData.resolution}
                      </span>
                    </div>

                    {/* Scenic Graphic Banner */}
                    <div className="w-full h-36 rounded-lg bg-gradient-to-tr from-stone-950 via-slate-900 to-indigo-950 border border-stone-800 flex flex-col items-center justify-center relative p-3 text-center mb-2.5 overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />
                      
                      <Camera size={26} className="text-amber-400 mb-1.5 animate-pulse" />
                      <div className="text-xs font-bold text-white tracking-wide">
                        {post.screenshotData.locationName}
                      </div>
                      <div className="text-[10.5px] text-stone-400 mt-0.5 flex items-center gap-1">
                        <MapPin size={11} className="text-emerald-400" />
                        <span>{post.screenshotData.coordinates}</span>
                      </div>
                      <div className="text-[9.5px] text-stone-400 mt-1">
                        Camera: <span className="text-cyan-300">{post.screenshotData.cameraAngle}</span>
                      </div>
                    </div>

                    {/* Featured Players Bar */}
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span>Featured: <strong className="text-stone-300">{post.screenshotData.featuredPlayers.join(', ')}</strong></span>
                      <span className="text-amber-300">{post.screenshotData.visualTheme}</span>
                    </div>
                  </div>
                )}

                {/* Tags List */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded-md border border-stone-800">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons & Interactions Footer */}
              <div className="pt-3 border-t border-stone-800 flex flex-col gap-2.5">
                <div className="flex items-center justify-between">
                  {/* Left: Reactions */}
                  <div className="flex items-center gap-2">
                    {/* Like / Heart */}
                    <button
                      type="button"
                      onClick={() => handleLike(post.id)}
                      className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        post.hasLiked
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
                          : 'bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white border border-stone-800'
                      }`}
                      title="Favorite / Like Post"
                    >
                      <Heart size={13} className={post.hasLiked ? 'fill-red-500 text-red-500' : ''} />
                      <span>{post.likes}</span>
                    </button>

                    {/* Diamond Reaction */}
                    <button
                      type="button"
                      onClick={() => handleReaction(post.id, 'diamond')}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-cyan-400 hover:text-cyan-200 border border-stone-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="React with Diamond Gem"
                    >
                      <Gem size={13} />
                      <span>{post.diamondReactions}</span>
                    </button>

                    {/* Fire Reaction */}
                    <button
                      type="button"
                      onClick={() => handleReaction(post.id, 'fire')}
                      className="px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-orange-400 hover:text-orange-200 border border-stone-800 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                      title="React with Fire"
                    >
                      <Flame size={13} />
                      <span>{post.fireReactions}</span>
                    </button>
                  </div>

                  {/* Right: Comments Toggle */}
                  <button
                    type="button"
                    onClick={() => setExpandedCommentsPostId(expandedCommentsPostId === post.id ? null : post.id)}
                    className="text-stone-400 hover:text-white text-xs font-bold flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-800 cursor-pointer"
                  >
                    <MessageSquare size={13} />
                    <span>{post.comments.length}</span>
                    {expandedCommentsPostId === post.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                  </button>
                </div>

                {/* Action Buttons for Builds / Coordinates */}
                <div className="flex items-center gap-2">
                  {post.type === 'minecraft_2d_build' && post.buildData && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleCopySchematic(post.buildData!)}
                        className="flex-1 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-stone-700 cursor-pointer"
                        title="Copy JSON schematic"
                      >
                        <Copy size={12} />
                        <span>Copy Blueprint</span>
                      </button>

                      {onImportBuild && (
                        <button
                          type="button"
                          onClick={() => {
                            audioEngine.playMinecraftSound('build');
                            onImportBuild(post.buildData!);
                            showToast(`🧱 Imported "${post.buildData!.schematicName}" to your 2D sandbox!`);
                          }}
                          className="flex-1 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
                          title="Import into your active game world"
                        >
                          <Download size={12} />
                          <span>Import to World</span>
                        </button>
                      )}
                    </>
                  )}

                  {post.type === 'community_screenshot' && post.screenshotData && onWarpToCoordinates && (
                    <button
                      type="button"
                      onClick={() => {
                        onWarpToCoordinates(87, 5);
                        showToast(`🌌 Warping to coordinates at ${post.screenshotData!.locationName}!`);
                      }}
                      className="w-full py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow cursor-pointer active:scale-95"
                    >
                      <Compass size={13} />
                      <span>Visit Location in 3D</span>
                    </button>
                  )}
                </div>

                {/* ================= EXPANDED COMMENTS SECTION ================= */}
                {expandedCommentsPostId === post.id && (
                  <div className="mt-2 pt-3 border-t border-stone-800/80 space-y-2.5">
                    <div className="text-[11px] font-bold text-amber-300">
                      Community Feedback ({post.comments.length})
                    </div>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
                      {post.comments.map((comm) => (
                        <div key={comm.id} className="bg-stone-900/80 rounded-xl p-2 border border-stone-800 text-[11px]">
                          <div className="flex items-center justify-between text-stone-400 mb-0.5">
                            <span className="font-bold text-stone-300">{comm.authorName}</span>
                            <span className="text-[9px]">{new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-stone-300">{comm.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-1.5">
                      <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Write a comment or builder tip..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleAddComment(post.id);
                        }}
                        className="flex-1 bg-stone-900 text-white text-xs px-3 py-1.5 rounded-xl border border-stone-700 outline-none focus:border-amber-400"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black transition cursor-pointer flex items-center gap-1"
                      >
                        <Send size={11} />
                        <span>Post</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))
        )}
      </div>

      {/* ================= SHARE CONTENT MODAL ================= */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-lg rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <span>Share Content to Social Feed</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsShareModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Content Type Selector */}
            <div className="grid grid-cols-2 gap-2 bg-stone-950 p-1 rounded-xl border border-stone-800">
              <button
                type="button"
                onClick={() => setShareTab('build')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  shareTab === 'build' ? 'bg-amber-500 text-black font-black' : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>🏰 2D Minecraft Build</span>
              </button>
              <button
                type="button"
                onClick={() => setShareTab('screenshot')}
                className={`py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  shareTab === 'screenshot' ? 'bg-amber-500 text-black font-black' : 'text-stone-400 hover:text-white'
                }`}
              >
                <span>📸 Community Screenshot</span>
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-400 font-bold mb-1">Creation Title</label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={(e) => setPostTitle(e.target.value)}
                  placeholder={shareTab === 'build' ? 'e.g. Floating Obsidian Sky Castle' : 'e.g. Sunrise at Landmark 6'}
                  className="w-full bg-stone-950 text-white px-3 py-2 rounded-xl border border-stone-800 outline-none focus:border-amber-400 font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold mb-1">Universe / Brand Theme</label>
                <select
                  value={postBrand}
                  onChange={(e) => setPostBrand(e.target.value as any)}
                  className="w-full bg-stone-950 text-white px-3 py-2 rounded-xl border border-stone-800 outline-none focus:border-amber-400 font-bold cursor-pointer"
                >
                  <option value="Minecraft">⛏️ Minecraft</option>
                  <option value="Roblox">👟 Roblox</option>
                  <option value="YouTube">▶️ YouTube</option>
                  <option value="McDonald's">🍔 McDonald's</option>
                  <option value="BP">⚡ BP Clean Energy</option>
                  <option value="NZ">🌿 NZ Aotearoa</option>
                  <option value="Countryballs">🌐 Countryballs</option>
                  <option value="New World">⚔️ New World</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-bold mb-1">Description & Story</label>
                <textarea
                  value={postCaption}
                  onChange={(e) => setPostCaption(e.target.value)}
                  rows={3}
                  placeholder="Describe your schematic, building techniques, or the highlight moment..."
                  className="w-full bg-stone-950 text-white px-3 py-2 rounded-xl border border-stone-800 outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 font-bold mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={postTags}
                  onChange={(e) => setPostTags(e.target.value)}
                  placeholder="2D Build, Fortress, Redstone, Speedrun"
                  className="w-full bg-stone-950 text-white px-3 py-2 rounded-xl border border-stone-800 outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mc-btn mc-btn-primary px-5 py-2 rounded-xl text-xs font-black cursor-pointer shadow hover:scale-105"
                >
                  Publish to Social Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
