import React, { useState, useEffect } from 'react';
import { 
  X, ShoppingBag, Search, Filter, Star, ShieldCheck, Tag, Plus, 
  Coins, CheckCircle2, AlertCircle, Clock, FileText, Sparkles, ChevronRight,
  TrendingUp, Award, ExternalLink, ThumbsUp
} from 'lucide-react';
import { 
  marketplaceManager, 
  MarketItem, 
  TransactionReceipt,
  COMMODITY_RATES,
  ONLINE_TRADE_PARTNERS,
  CommodityRate,
  P2PTradePartner
} from '../utils/marketplaceManager';
import { 
  ugcManager, 
  UgcCreation, 
  UgcReview 
} from '../utils/ugcManager';
import { avatarManager, PlayerCustomizationData } from '../utils/avatarManager';
import { audioEngine } from '../utils/audioEngine';

interface MarketplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
}

export default function MarketplaceModal({
  isOpen,
  onClose,
  user,
}: MarketplaceModalProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'commodities' | 'p2p' | 'ugc' | 'sell' | 'receipts'>('browse');
  const [items, setItems] = useState<MarketItem[]>(marketplaceManager.getLocalItems());
  const [receipts, setReceipts] = useState<TransactionReceipt[]>(marketplaceManager.getReceipts());
  const [customData, setCustomData] = useState<PlayerCustomizationData>(avatarManager.getLocalCustomization());

  // Commodity Resource Exchange State
  const [selectedCommodityKey, setSelectedCommodityKey] = useState<string>('wood');
  const [commodityQty, setCommodityQty] = useState<number>(8);
  const [sellingCommodity, setSellingCommodity] = useState<boolean>(false);

  // P2P Escrow Trading State
  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('partner_steve');
  const [p2pOfferedCoins, setP2pOfferedCoins] = useState<number>(50);
  const [p2pOfferedRobux, setP2pOfferedRobux] = useState<number>(0);
  const [p2pRequestedItem, setP2pRequestedItem] = useState<string>('Diamond Pickaxe');
  const [p2pTradeLocked, setP2pTradeLocked] = useState<boolean>(false);
  const [p2pCountdown, setP2pCountdown] = useState<number>(0);
  const [p2pTrading, setP2pTrading] = useState<boolean>(false);

  // Cloud Wallet Sync State
  const [syncingCloud, setSyncingCloud] = useState<boolean>(false);
  const [cloudSyncToken, setCloudSyncToken] = useState<string | null>(null);

  // UGC State
  const [ugcCreations, setUgcCreations] = useState<UgcCreation[]>(ugcManager.getLocalCreations());
  const [ugcCategoryFilter, setUgcCategoryFilter] = useState<string>('all');
  const [selectedUgcForReviews, setSelectedUgcForReviews] = useState<UgcCreation | null>(null);
  const [ugcReviewsMap, setUgcReviewsMap] = useState<Record<string, UgcReview[]>>(ugcManager.getLocalReviews());
  const [newReviewRating, setNewReviewRating] = useState<number>(5);
  const [newReviewComment, setNewReviewComment] = useState<string>('');

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rep'>('featured');

  // Purchase Escrow Confirmation State
  const [selectedItemToBuy, setSelectedItemToBuy] = useState<MarketItem | null>(null);
  const [buying, setBuying] = useState(false);

  // Sell Item Form State
  const [sellMode, setSellMode] = useState<'item' | 'ugc'>('item');
  const [sellName, setSellName] = useState('');
  const [sellBrand, setSellBrand] = useState<'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World'>('Minecraft');
  const [sellCategory, setSellCategory] = useState<'weapons' | 'tools' | 'blocks' | 'consumables' | 'accessories' | 'curios'>('weapons');
  const [sellPrice, setSellPrice] = useState(150);
  const [sellCurrency, setSellCurrency] = useState<'coins' | 'robux'>('coins');
  const [sellRarity, setSellRarity] = useState<'common' | 'rare' | 'epic' | 'legendary' | 'mythic'>('rare');
  const [sellIcon, setSellIcon] = useState('📦');
  const [sellDesc, setSellDesc] = useState('');

  // UGC Upload Form State
  const [ugcTitle, setUgcTitle] = useState('');
  const [ugcCategory, setUgcCategory] = useState<'countryball_skin' | 'minecraft_build' | 'roblox_template' | 'custom_wearable'>('countryball_skin');
  const [ugcBrand, setUgcBrand] = useState<'Countryballs' | 'Minecraft' | 'Roblox' | 'Xilam' | 'McDonald\'s' | 'BP' | 'Universal'>('Countryballs');
  const [ugcPrice, setUgcPrice] = useState(150);
  const [ugcCurrency, setUgcCurrency] = useState<'coins' | 'robux'>('coins');
  const [ugcIcon, setUgcIcon] = useState('🎨');
  const [ugcDesc, setUgcDesc] = useState('');
  const [ugcTags, setUgcTags] = useState('Skin, Custom, HD');

  // Feedback Notification
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      marketplaceManager.loadFromCloud().then((loaded) => setItems(loaded));
      ugcManager.loadFromCloud().then((loadedUgc) => setUgcCreations(loadedUgc));
      setUgcReviewsMap(ugcManager.getLocalReviews());
      setReceipts(marketplaceManager.getReceipts());
      avatarManager.loadFromCloud(user?.uid).then((data) => setCustomData(data));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const showToast = (type: 'success' | 'error', message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.sellerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = brandFilter === 'all' || item.brand === brandFilter;
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesBrand && matchesCat;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rep') return b.sellerReputation - a.sellerReputation;
    return b.listedAt - a.listedAt;
  });

  // Filter UGC creations
  const filteredUgc = ugcCreations.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = ugcCategoryFilter === 'all' || c.category === ugcCategoryFilter;
    const matchesBrand = brandFilter === 'all' || c.brandTheme === brandFilter;
    return matchesSearch && matchesCat && matchesBrand;
  });

  const handleBuyConfirm = async () => {
    if (!selectedItemToBuy) return;
    setBuying(true);
    try {
      const res = await marketplaceManager.executePurchase(
        selectedItemToBuy,
        user?.uid || 'guest-player',
        user?.displayName || 'Steve Miner'
      );
      audioEngine.playMinecraftSound('levelup');
      setItems(marketplaceManager.getLocalItems());
      setReceipts(marketplaceManager.getReceipts());
      setCustomData(avatarManager.getLocalCustomization());
      setSelectedItemToBuy(null);
      showToast('success', res.message);
    } catch (e: any) {
      audioEngine.playMinecraftSound('anvil');
      showToast('error', e.message || 'Transaction failed in escrow.');
    } finally {
      setBuying(false);
    }
  };

  const handleSellCommodityAction = async () => {
    setSellingCommodity(true);
    try {
      const res = await marketplaceManager.sellCommodity(
        selectedCommodityKey,
        commodityQty,
        user?.uid || 'guest-player'
      );
      audioEngine.playMinecraftSound('levelup');
      setReceipts(marketplaceManager.getReceipts());
      setCustomData(avatarManager.getLocalCustomization());
      showToast('success', res.message);
    } catch (e: any) {
      audioEngine.playMinecraftSound('anvil');
      showToast('error', e.message || 'Failed to sell commodity.');
    } finally {
      setSellingCommodity(false);
    }
  };

  const handleStartP2PLockCountdown = () => {
    if (p2pTradeLocked) {
      setP2pTradeLocked(false);
      setP2pCountdown(0);
      return;
    }
    audioEngine.playMinecraftSound('click');
    setP2pTradeLocked(true);
    setP2pCountdown(3);
    const interval = setInterval(() => {
      setP2pCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          audioEngine.playMinecraftSound('orb');
          return 0;
        }
        audioEngine.playMinecraftSound('click');
        return prev - 1;
      });
    }, 1000);
  };

  const handleExecuteP2PTradeAction = async () => {
    setP2pTrading(true);
    try {
      const res = await marketplaceManager.executeP2PExchange(
        selectedPartnerId,
        p2pOfferedCoins,
        p2pOfferedRobux,
        p2pRequestedItem,
        user?.uid || 'guest-player',
        user?.displayName || 'Steve Miner'
      );
      audioEngine.playMinecraftSound('levelup');
      setReceipts(marketplaceManager.getReceipts());
      setCustomData(avatarManager.getLocalCustomization());
      setP2pTradeLocked(false);
      showToast('success', res.message);
    } catch (e: any) {
      audioEngine.playMinecraftSound('anvil');
      showToast('error', e.message || 'P2P trade failed.');
    } finally {
      setP2pTrading(false);
    }
  };

  const handleSyncCloudWalletAction = async () => {
    setSyncingCloud(true);
    try {
      const res = await marketplaceManager.syncCloudEconomyLedger(user?.uid);
      audioEngine.playMinecraftSound('orb');
      setCloudSyncToken(res.hash);
      showToast('success', `Cloud Wallet & Ledger synchronized! Token: ${res.hash}`);
    } catch (e: any) {
      showToast('error', 'Cloud sync failed, using local offline ledger.');
    } finally {
      setSyncingCloud(false);
    }
  };

  const handleEndorseTrader = (sellerUid: string, sellerName: string) => {
    const ok = marketplaceManager.endorseTrader(sellerUid);
    if (ok) {
      audioEngine.playMinecraftSound('pop');
      setItems(marketplaceManager.getLocalItems());
      showToast('success', `Endorsed ${sellerName}! +0.1 Trader Reputation added.`);
    } else {
      showToast('error', `You have already endorsed ${sellerName}.`);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellName.trim()) {
      showToast('error', 'Please enter an item name');
      return;
    }
    audioEngine.playMinecraftSound('levelup');
    await marketplaceManager.createListing(
      {
        name: sellName.trim(),
        brand: sellBrand,
        category: sellCategory,
        price: Number(sellPrice),
        currency: sellCurrency,
        rarity: sellRarity,
        icon: sellIcon || '📦',
        description: sellDesc.trim() || 'Authentic cross-brand item listed on the MegaWorld exchange.',
        sellerUid: user?.uid || 'guest-seller',
        sellerName: user?.displayName || 'Steve The Trader',
        stock: 1,
      },
      user?.uid || 'guest-seller',
      customData.reputation,
      customData.tradesCompleted
    );

    setItems(marketplaceManager.getLocalItems());
    setActiveTab('browse');
    showToast('success', `Listed "${sellName}" for sale on the Marketplace!`);
    setSellName('');
    setSellDesc('');
  };

  const handleBuyUgc = async (creation: UgcCreation) => {
    audioEngine.playMinecraftSound('click');
    try {
      const res = await ugcManager.purchaseCreation(
        creation,
        user?.uid || 'guest-player',
        user?.displayName || 'Steve Miner'
      );
      audioEngine.playMinecraftSound('levelup');
      setUgcCreations(ugcManager.getLocalCreations());
      setCustomData(avatarManager.getLocalCustomization());
      showToast('success', res.message);
    } catch (e: any) {
      audioEngine.playMinecraftSound('anvil');
      showToast('error', e.message || 'Purchase failed');
    }
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUgcForReviews) return;
    if (!newReviewComment.trim()) {
      showToast('error', 'Please write a review comment.');
      return;
    }
    audioEngine.playMinecraftSound('pop');
    ugcManager.addReview(
      selectedUgcForReviews.id,
      user?.uid || 'guest-reviewer',
      user?.displayName || 'CreativeBuilder',
      newReviewRating,
      newReviewComment.trim()
    );
    setUgcReviewsMap({ ...ugcManager.getLocalReviews() });
    setUgcCreations(ugcManager.getLocalCreations());
    setNewReviewComment('');
    showToast('success', 'Review and rating submitted successfully!');
  };

  const handleUpvoteReview = (creationId: string, reviewId: string) => {
    audioEngine.playMinecraftSound('pop');
    ugcManager.upvoteReview(creationId, reviewId);
    setUgcReviewsMap({ ...ugcManager.getLocalReviews() });
    showToast('success', 'Marked review as helpful!');
  };

  const handleUploadUgc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ugcTitle.trim()) {
      showToast('error', 'Please enter a title for your creation.');
      return;
    }
    audioEngine.playMinecraftSound('levelup');
    await ugcManager.uploadCreation(
      {
        title: ugcTitle.trim(),
        category: ugcCategory,
        brandTheme: ugcBrand,
        authorReputation: customData.reputation || 5.0,
        price: Number(ugcPrice),
        currency: ugcCurrency,
        previewIcon: ugcIcon || '🎨',
        description: ugcDesc.trim() || 'Custom creator design crafted for the MegaWorld community.',
        tags: ugcTags.split(',').map((t) => t.trim()).filter(Boolean),
        isVerifiedCreator: true,
      },
      user?.uid || 'guest-author',
      user?.displayName || 'Steve The Creator'
    );
    setUgcCreations(ugcManager.getLocalCreations());
    showToast('success', `Published "${ugcTitle.trim()}" to the UGC Showcase & Marketplace!`);
    setUgcTitle('');
    setUgcDesc('');
    setActiveTab('ugc');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-sans">
      <div className="bg-stone-900 border-2 border-amber-500/60 rounded-3xl w-full max-w-6xl shadow-[0_15px_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/40 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 border border-amber-500/50 rounded-2xl flex items-center justify-center text-xl shadow-inner">
              ⚖️
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center gap-2">
                MegaWorld Cross-Brand Marketplace
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Escrow Verified
                </span>
              </h2>
              <p className="text-xs text-stone-400 font-mono">
                Trade items from Minecraft, Roblox, Countryballs, Xilam & Brands
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Wallet Balances + Cloud Sync */}
            <div className="flex items-center gap-3 bg-stone-950/80 px-3 py-1.5 rounded-2xl border border-stone-800 font-mono text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                <Coins size={14} className="text-amber-400" />
                <span>{customData.coins} Coins</span>
              </div>
              <div className="w-px h-3 bg-stone-700" />
              <div className="flex items-center gap-1.5 text-red-400 font-bold">
                <span className="w-2.5 h-2.5 bg-red-500 inline-block rotate-12 rounded-xs" />
                <span>{customData.robux} Robux</span>
              </div>
              <button
                onClick={handleSyncCloudWalletAction}
                disabled={syncingCloud}
                className="ml-1 px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-[10.5px] text-emerald-400 border border-emerald-500/40 rounded-lg flex items-center gap-1 transition cursor-pointer"
                title="Synchronize virtual wallet and cryptographic ledger to Firestore"
              >
                <span>{syncingCloud ? 'Syncing...' : '☁️ Cloud Sync'}</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-2 rounded-xl hover:bg-stone-800 transition cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Feedback Alert Bar */}
        {feedback && (
          <div className={`px-4 py-2 text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-md ${
            feedback.type === 'success' ? 'bg-emerald-500 text-stone-950' : 'bg-red-500 text-white'
          }`}>
            {feedback.type === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Primary Tabs */}
        <div className="flex items-center gap-2 px-5 py-3 bg-stone-950/80 border-b border-stone-800 font-mono text-xs overflow-x-auto">
          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('browse');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'browse'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <ShoppingBag size={14} />
            <span>1. Virtual Item Market ({filteredItems.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('commodities');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'commodities'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>⛏️</span>
            <span>2. Resource Exchange (Sell Ores)</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('p2p');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'p2p'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <span>🤝</span>
            <span>3. P2P Escrow Trading Post</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('ugc');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'ugc'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Sparkles size={14} className="text-yellow-400" />
            <span>4. Community UGC & Creations ({filteredUgc.length})</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('sell');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'sell'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <Plus size={14} />
            <span>5. Sell Items & Publish UGC</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playMinecraftSound('click');
              setActiveTab('receipts');
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeTab === 'receipts'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-400 hover:text-white hover:bg-stone-800'
            }`}
          >
            <FileText size={14} />
            <span>6. Receipts & Cloud Ledger ({receipts.length})</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="flex-1 p-5 overflow-y-auto font-mono">
          {/* ================= TAB 1: BROWSE LISTINGS ================= */}
          {activeTab === 'browse' && (
            <div className="space-y-4">
              {/* Search & Filters Controls */}
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by item name, description, or seller..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Brand Dropdown */}
                <select
                  value={brandFilter}
                  onChange={(e) => setBrandFilter(e.target.value)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200"
                >
                  <option value="all">All Brands</option>
                  <option value="Minecraft">⛏️ Minecraft</option>
                  <option value="Roblox">🟥 Roblox</option>
                  <option value="Countryballs">🌐 Countryballs</option>
                  <option value="Xilam">🐱 Xilam</option>
                  <option value="McDonald's">🍔 McDonald's</option>
                  <option value="BP">⚡ BP</option>
                  <option value="YouTube">▶️ YouTube</option>
                  <option value="Tarragower">🏛️ Tarragower</option>
                  <option value="New World">🧭 New World</option>
                </select>

                {/* Sort By Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200"
                >
                  <option value="featured">Newest Listed</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rep">Highest Trader Rating</option>
                </select>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'All Categories' },
                  { id: 'weapons', label: '🗡️ Weapons' },
                  { id: 'tools', label: '⛏️ Tools' },
                  { id: 'consumables', label: '🍎 Food & Potions' },
                  { id: 'accessories', label: '🪽 Accessories' },
                  { id: 'curios', label: '🔮 Curios & Relics' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setCategoryFilter(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                      categoryFilter === cat.id
                        ? 'bg-stone-800 text-amber-300 border border-amber-500/60 shadow-sm'
                        : 'bg-stone-950/60 text-stone-400 hover:text-white border border-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Listings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-stone-950/70 border border-stone-800 hover:border-amber-500/50 p-4 rounded-2xl flex flex-col justify-between transition shadow-xl relative group"
                  >
                    <div>
                      {/* Top Bar: Icon, Brand & Rarity */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{item.icon}</span>
                          <span className="text-[10px] uppercase font-bold text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                            {item.brand}
                          </span>
                        </div>
                        <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full border ${
                          item.rarity === 'mythic' ? 'bg-red-500/20 text-red-300 border-red-500/40' :
                          item.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' :
                          item.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' :
                          item.rarity === 'rare' ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' :
                          'bg-stone-800 text-stone-300 border-stone-700'
                        }`}>
                          {item.rarity}
                        </span>
                      </div>

                      {/* Item Title & Desc */}
                      <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-stone-400 mb-3 leading-relaxed">{item.description}</p>

                      {/* Trader Profile Pill */}
                      <div className="bg-stone-900/90 p-2.5 rounded-xl border border-stone-800 mb-3 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-1.5 text-xs text-stone-200 font-bold">
                            <span>{item.sellerName}</span>
                            <ShieldCheck size={13} className="text-emerald-400" />
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-stone-400 mt-0.5">
                            <span className="text-amber-400 flex items-center gap-0.5">
                              <Star size={11} fill="currentColor" /> {item.sellerReputation.toFixed(1)}
                            </span>
                            <span>•</span>
                            <span>{item.sellerTrades} trades</span>
                          </div>
                        </div>

                        {/* Endorse Button */}
                        <button
                          onClick={() => handleEndorseTrader(item.sellerUid, item.sellerName)}
                          className="text-[10px] bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-amber-300 px-2 py-1 rounded-lg border border-stone-700 transition cursor-pointer flex items-center gap-1"
                          title="Endorse trader for positive reputation (+0.1)"
                        >
                          <ThumbsUp size={11} />
                          <span>Endorse</span>
                        </button>
                      </div>
                    </div>

                    {/* Bottom Price & Purchase Button */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-800/80">
                      <div>
                        <div className="text-[10px] text-stone-400">Price (Stock: {item.stock})</div>
                        <div className="text-sm font-black flex items-center gap-1">
                          {item.currency === 'coins' ? (
                            <span className="text-amber-400 flex items-center gap-1">
                              <Coins size={14} /> {item.price} Coins
                            </span>
                          ) : (
                            <span className="text-red-400 flex items-center gap-1">
                              <span className="w-2.5 h-2.5 bg-red-500 inline-block rotate-12 rounded-xs" /> {item.price} Robux
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setSelectedItemToBuy(item);
                        }}
                        className="mc-btn mc-btn-primary px-4 py-2 rounded-xl text-xs font-bold transition shadow hover:scale-102 cursor-pointer flex items-center gap-1.5"
                      >
                        <ShieldCheck size={14} className="text-yellow-400" />
                        <span>Buy (Escrow)</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= TAB 2: RESOURCE EXCHANGE (COMMODITIES) ================= */}
          {activeTab === 'commodities' && (
            <div className="space-y-5">
              {/* Economy Guide Banner */}
              <div className="bg-gradient-to-r from-amber-950/60 via-stone-900 to-emerald-950/60 border border-amber-500/40 p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-amber-500/20 border border-amber-500/50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    ⛏️
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      MegaWorld Commodity Exchange
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        Primary Coin Engine
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300 font-mono mt-0.5">
                      Earn <strong className="text-amber-400">MegaCoins (🪙)</strong> by selling raw mined ores, lumber, and harvested farm crops at dynamic server exchange rates.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-stone-950/80 px-4 py-2 rounded-2xl border border-stone-800 shrink-0">
                  <div className="text-right">
                    <div className="text-[10px] text-stone-400 uppercase font-mono">Current Wallet</div>
                    <div className="text-sm font-black text-amber-400 flex items-center gap-1 font-mono">
                      <Coins size={14} /> {customData.coins} Coins
                    </div>
                  </div>
                </div>
              </div>

              {/* Commodity Exchange Grid & Trade Terminal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Available Commodities List */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COMMODITY_RATES.map((item) => {
                    const isSelected = selectedCommodityKey === item.key;
                    return (
                      <div
                        key={item.key}
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setSelectedCommodityKey(item.key);
                        }}
                        className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/30 shadow-lg'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700 hover:bg-stone-900/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl">{item.icon}</span>
                            <div>
                              <div className="text-xs font-bold text-white">{item.name}</div>
                              <span className="text-[9.5px] uppercase text-stone-400 font-mono">
                                {item.category.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            item.marketTrend === 'up'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : 'bg-stone-800 text-stone-300 border-stone-700'
                          }`}>
                            {item.marketTrend === 'up' ? '📈 +5%' : '➖ Stable'}
                          </span>
                        </div>

                        <p className="text-[11px] text-stone-400 mb-3 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-stone-800/80 font-mono text-xs">
                          <span className="text-stone-400 text-[10.5px]">Unit Exchange Rate</span>
                          <span className="text-amber-400 font-bold flex items-center gap-1">
                            <Coins size={12} /> {item.sellPriceCoins} 🪙 / block
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Sell / Liquidation Terminal Panel */}
                {(() => {
                  const activeCommodity = COMMODITY_RATES.find((c) => c.key === selectedCommodityKey) || COMMODITY_RATES[0];
                  const totalPayout = activeCommodity.sellPriceCoins * commodityQty;

                  return (
                    <div className="bg-stone-950/90 border-2 border-amber-500/50 p-5 rounded-3xl flex flex-col justify-between shadow-2xl h-fit sticky top-4">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{activeCommodity.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-white">{activeCommodity.name}</h4>
                            <span className="text-[10px] text-stone-400 font-mono">Exchange Liquidation Desk</span>
                          </div>
                        </div>

                        <div className="bg-stone-900/80 p-3 rounded-2xl border border-stone-800 mb-4 space-y-2 text-xs">
                          <div className="flex justify-between text-stone-300">
                            <span>Base Commodity Rate:</span>
                            <span className="text-amber-400 font-bold font-mono">{activeCommodity.sellPriceCoins} MegaCoins each</span>
                          </div>
                          <div className="flex justify-between text-stone-300">
                            <span>Platform Escrow Fee:</span>
                            <span className="text-emerald-400 font-bold font-mono">0% (Subsidized)</span>
                          </div>
                          <div className="flex justify-between text-stone-300">
                            <span>Settlement Speed:</span>
                            <span className="text-cyan-400 font-bold font-mono">Instant Atomic Transfer</span>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-xs font-mono">
                            <span className="text-stone-400">Sell Quantity:</span>
                            <span className="text-white font-bold">{commodityQty} units</span>
                          </div>

                          <input
                            type="range"
                            min="1"
                            max="64"
                            value={commodityQty}
                            onChange={(e) => setCommodityQty(Number(e.target.value))}
                            className="w-full accent-amber-500 cursor-pointer"
                          />

                          <div className="flex items-center gap-1.5 pt-1">
                            {[1, 8, 16, 32, 64].map((amt) => (
                              <button
                                key={amt}
                                type="button"
                                onClick={() => {
                                  audioEngine.playMinecraftSound('click');
                                  setCommodityQty(amt);
                                }}
                                className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition cursor-pointer font-mono ${
                                  commodityQty === amt
                                    ? 'bg-amber-500 text-stone-950 border-amber-400 font-black'
                                    : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                                }`}
                              >
                                {amt === 64 ? 'Stack' : amt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Total Revenue Box */}
                        <div className="bg-amber-950/40 border border-amber-500/40 p-3.5 rounded-2xl mb-4 font-mono">
                          <div className="text-[10px] text-stone-400 uppercase">Total MegaCoins Payout</div>
                          <div className="text-2xl font-black text-amber-300 flex items-center gap-1.5 mt-0.5">
                            <Coins size={20} className="text-amber-400" />
                            <span>+{totalPayout} MegaCoins (🪙)</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={handleSellCommodityAction}
                        disabled={sellingCommodity}
                        className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <Coins size={16} />
                        <span>{sellingCommodity ? 'Liquidating to Wallet...' : `Sell ${commodityQty}x & Claim +${totalPayout} 🪙`}</span>
                      </button>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* ================= TAB 3: P2P ESCROW TRADING POST ================= */}
          {activeTab === 'p2p' && (
            <div className="space-y-5">
              {/* P2P Header Banner */}
              <div className="bg-gradient-to-r from-blue-950/60 via-stone-900 to-purple-950/60 border border-blue-500/40 p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    🤝
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      Cross-Platform P2P Escrow Trading Post
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40">
                        Live Escrow
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300 font-mono mt-0.5">
                      Stage items, MegaCoins, and Robux with online multiplayer traders. Protected with a 3-second safety countdown lock and atomic ledger verification.
                    </p>
                  </div>
                </div>

                <div className="text-right text-xs font-mono shrink-0">
                  <span className="text-stone-400 text-[10px] uppercase">Trader Security Rating</span>
                  <div className="text-emerald-400 font-bold flex items-center justify-end gap-1">
                    <ShieldCheck size={14} /> Verified Escrow (100% Non-Bait)
                  </div>
                </div>
              </div>

              {/* Trader Partner Selector */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-stone-300 font-mono flex items-center justify-between">
                  <span>Select Active Online Trading Partner:</span>
                  <span className="text-[11px] text-stone-400">{ONLINE_TRADE_PARTNERS.length} Traders Available</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {ONLINE_TRADE_PARTNERS.map((partner) => {
                    const isSelected = selectedPartnerId === partner.id;
                    return (
                      <div
                        key={partner.id}
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setSelectedPartnerId(partner.id);
                          setP2pRequestedItem(partner.availableItems[0]?.name || 'Rare Gear');
                          setP2pTradeLocked(false);
                          setP2pCountdown(0);
                        }}
                        className={`p-3.5 rounded-2xl border transition cursor-pointer flex items-center gap-3 ${
                          isSelected
                            ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/30 shadow-md'
                            : 'bg-stone-950/60 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        <span className="text-3xl">{partner.avatar}</span>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-white truncate">{partner.name}</div>
                          <div className="text-[10px] text-amber-300 flex items-center gap-1">
                            <Star size={11} fill="currentColor" /> {partner.rating.toFixed(1)} • {partner.badge}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dual Escrow Staging Window */}
              {(() => {
                const partner = ONLINE_TRADE_PARTNERS.find((p) => p.id === selectedPartnerId) || ONLINE_TRADE_PARTNERS[0];

                return (
                  <div className="bg-stone-950/90 border border-stone-800 p-5 rounded-3xl space-y-5 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                      <div className="text-xs font-bold text-stone-200 font-mono flex items-center gap-2">
                        <span>🤝 Live Trade Escrow Session with:</span>
                        <span className="text-blue-400">{partner.name}</span>
                      </div>
                      <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border font-mono ${
                        p2pTradeLocked
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}>
                        {p2pTradeLocked ? '🔒 Offers Locked (Inspecting)' : '📝 Stage Your Offer Below'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Left Side: YOUR OFFER */}
                      <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                          <div className="text-xs font-black text-amber-400 uppercase font-mono flex items-center gap-1.5">
                            <span>👤</span>
                            <span>Your Offer ({customData.customName || 'Player'})</span>
                          </div>
                          <span className="text-[10px] text-stone-400 font-mono">
                            Balance: {customData.coins}🪙 | {customData.robux}💎
                          </span>
                        </div>

                        {/* Staged Currency Inputs */}
                        <div className="space-y-3 font-mono">
                          <div>
                            <div className="flex justify-between text-xs text-stone-300 mb-1">
                              <span>Offer MegaCoins:</span>
                              <span className="text-amber-400 font-bold">{p2pOfferedCoins} 🪙</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={Math.min(customData.coins, 500)}
                              step="10"
                              value={p2pOfferedCoins}
                              disabled={p2pTradeLocked}
                              onChange={(e) => setP2pOfferedCoins(Number(e.target.value))}
                              className="w-full accent-amber-500 cursor-pointer disabled:opacity-50"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-stone-300 mb-1">
                              <span>Offer Robux Gems:</span>
                              <span className="text-red-400 font-bold">{p2pOfferedRobux} 💎</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max={Math.min(customData.robux, 100)}
                              step="5"
                              value={p2pOfferedRobux}
                              disabled={p2pTradeLocked}
                              onChange={(e) => setP2pOfferedRobux(Number(e.target.value))}
                              className="w-full accent-red-500 cursor-pointer disabled:opacity-50"
                            />
                          </div>
                        </div>

                        <div className="bg-stone-950 p-3 rounded-xl border border-stone-800 text-xs text-stone-300 font-mono">
                          <div className="text-[10px] text-stone-400 uppercase mb-1">Items Staged from Bag:</div>
                          <div className="flex items-center gap-2 text-stone-200">
                            <span>📦</span>
                            <span>Standard Adventurer Trade Certificate (Verified)</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Side: PARTNER'S OFFER */}
                      <div className="bg-stone-900/80 p-4 rounded-2xl border border-stone-800 space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                          <div className="text-xs font-black text-blue-400 uppercase font-mono flex items-center gap-1.5">
                            <span>{partner.avatar}</span>
                            <span>{partner.name}'s Offer</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono">
                            Offering: +{partner.offerCoins}🪙 {partner.offerRobux > 0 ? `+${partner.offerRobux}💎` : ''}
                          </span>
                        </div>

                        {/* Select which item to request from partner */}
                        <div className="space-y-2 font-mono">
                          <div className="text-xs text-stone-300">Choose Desired Partner Item:</div>
                          <div className="space-y-1.5">
                            {partner.availableItems.map((item, idx) => {
                              const isChosen = p2pRequestedItem === item.name;
                              return (
                                <div
                                  key={idx}
                                  onClick={() => {
                                    if (p2pTradeLocked) return;
                                    audioEngine.playMinecraftSound('click');
                                    setP2pRequestedItem(item.name);
                                  }}
                                  className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                                    isChosen
                                      ? 'bg-blue-950/60 border-blue-400 text-white font-bold'
                                      : 'bg-stone-950/60 border-stone-800 text-stone-300 hover:border-stone-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-lg">{item.icon}</span>
                                    <span>{item.name}</span>
                                  </div>
                                  <span className="text-amber-400 font-mono">Value: ~{item.valueCoins} 🪙</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-500/30 text-xs text-blue-200 font-mono">
                          <div className="text-[10px] text-blue-300 uppercase mb-0.5">Bonus Currency in Escrow:</div>
                          <div className="font-bold flex items-center gap-2">
                            <span>🪙 +{partner.offerCoins} MegaCoins</span>
                            {partner.offerRobux > 0 && <span>💎 +{partner.offerRobux} Robux</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Escrow Lock & Final Execution Controls */}
                    <div className="bg-stone-900 p-4 rounded-2xl border border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <ShieldCheck size={15} className="text-emerald-400" />
                          <span>Escrow Security Protection Active</span>
                        </div>
                        <p className="text-[11px] text-stone-400 mt-0.5">
                          {p2pTradeLocked
                            ? p2pCountdown > 0
                              ? `Reviewing counter-offer... Safety lock expires in ${p2pCountdown}s.`
                              : 'Both offers verified & locked! Ready to finalize atomic exchange.'
                            : 'Click "Lock In Offer" to verify terms and enable final trade confirmation.'}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <button
                          type="button"
                          onClick={handleStartP2PLockCountdown}
                          disabled={p2pTrading}
                          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                            p2pTradeLocked
                              ? 'bg-stone-800 text-amber-300 border border-stone-700 hover:bg-stone-700'
                              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                          }`}
                        >
                          {p2pTradeLocked ? '🔓 Modify Offer' : '🔒 Lock In Offer'}
                        </button>

                        <button
                          type="button"
                          onClick={handleExecuteP2PTradeAction}
                          disabled={!p2pTradeLocked || p2pCountdown > 0 || p2pTrading}
                          className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition shadow-lg flex items-center gap-2 cursor-pointer ${
                            p2pTradeLocked && p2pCountdown === 0
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 shadow-emerald-500/20'
                              : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed opacity-60'
                          }`}
                        >
                          <CheckCircle2 size={16} />
                          <span>
                            {p2pTrading
                              ? 'Executing Escrow...'
                              : p2pCountdown > 0
                              ? `Safety Lock (${p2pCountdown}s)`
                              : 'Execute P2P Trade'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ================= TAB 2: COMMUNITY UGC & CREATIONS ================= */}
          {activeTab === 'ugc' && (
            <div className="space-y-5">
              {/* Creator Banner */}
              <div className="bg-gradient-to-r from-purple-950/60 via-stone-900 to-amber-950/60 border border-purple-500/40 p-5 rounded-3xl shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/20 border border-purple-500/50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
                    🎨
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      User-Generated Content Marketplace
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        Creator Economy
                      </span>
                    </h3>
                    <p className="text-xs text-stone-300">
                      Upload custom skins, schematics, and templates. Creators keep <strong>90% of all revenues</strong>!
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    audioEngine.playMinecraftSound('click');
                    setSellMode('ugc');
                    setActiveTab('sell');
                  }}
                  className="mc-btn mc-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow hover:scale-105 whitespace-nowrap self-start sm:self-auto"
                >
                  <Plus size={14} />
                  <span>Publish New Creation</span>
                </button>
              </div>

              {/* UGC Category Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { id: 'all', label: 'All UGC' },
                  { id: 'countryball_skin', label: '🌐 Countryball Skins' },
                  { id: 'minecraft_build', label: '⛏️ Minecraft Builds' },
                  { id: 'roblox_template', label: '🟥 Roblox Templates' },
                  { id: 'custom_wearable', label: '🪰 Custom Wearables' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioEngine.playMinecraftSound('click');
                      setUgcCategoryFilter(cat.id);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      ugcCategoryFilter === cat.id
                        ? 'bg-stone-800 text-amber-300 border border-amber-500/60 shadow-sm'
                        : 'text-stone-400 hover:text-white bg-stone-950/60 border border-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* UGC Creations Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUgc.map((creation) => {
                  return (
                    <div
                      key={creation.id}
                      className="bg-stone-950/80 border border-stone-800 hover:border-purple-500/50 p-5 rounded-2xl flex flex-col justify-between transition shadow-lg group relative"
                    >
                      <div>
                        {/* Top Meta Bar */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <span className="text-3xl">{creation.previewIcon}</span>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                                  {creation.title}
                                </h4>
                                {creation.isVerifiedCreator && (
                                  <span className="text-emerald-400 text-xs font-bold" title="Verified Community Creator">✓</span>
                                )}
                              </div>
                              <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
                                <span>by {creation.authorName}</span>
                                <span>•</span>
                                <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                  <Star size={10} fill="currentColor" /> {creation.authorReputation.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="text-[9.5px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-900 text-amber-300 border border-stone-800">
                            {creation.brandTheme}
                          </span>
                        </div>

                        <p className="text-xs text-stone-300 mb-3 leading-relaxed">
                          {creation.description}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center gap-1.5 flex-wrap mb-3">
                          {creation.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-[9.5px] bg-stone-900/90 text-stone-400 border border-stone-800/80 px-2 py-0.5 rounded-md"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        {/* Rating & Stats Bar */}
                        <div className="bg-stone-900/60 p-2.5 rounded-xl border border-stone-800/60 mb-4 flex items-center justify-between text-xs">
                          <button
                            onClick={() => {
                              audioEngine.playMinecraftSound('click');
                              setSelectedUgcForReviews(creation);
                            }}
                            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition cursor-pointer"
                          >
                            <div className="flex items-center text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={11}
                                  fill={s <= Math.round(creation.averageRating) ? 'currentColor' : 'none'}
                                  className={s <= Math.round(creation.averageRating) ? 'text-amber-400' : 'text-stone-600'}
                                />
                              ))}
                            </div>
                            <span className="text-[11px] underline">
                              {creation.averageRating.toFixed(1)} ({creation.reviewsCount} reviews)
                            </span>
                          </button>

                          <span className="text-[10px] text-stone-400">
                            📥 {creation.downloadsCount} claims
                          </span>
                        </div>
                      </div>

                      {/* Bottom Price & Acquisition */}
                      <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                        <div>
                          <div className="text-[9.5px] text-stone-400 uppercase font-bold">Price (90% to Creator)</div>
                          <div className="text-sm font-black flex items-center gap-1">
                            {creation.currency === 'coins' ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <Coins size={14} /> {creation.price} Coins
                              </span>
                            ) : (
                              <span className="text-red-400 flex items-center gap-1">
                                <span className="w-2.5 h-2.5 bg-red-500 inline-block rotate-12 rounded-xs" /> {creation.price} Robux
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              audioEngine.playMinecraftSound('click');
                              setSelectedUgcForReviews(creation);
                            }}
                            className="p-2 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded-xl transition cursor-pointer text-xs"
                            title="View & Submit Reviews"
                          >
                            ⭐
                          </button>
                          <button
                            onClick={() => handleBuyUgc(creation)}
                            className="mc-btn mc-btn-primary px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow hover:scale-102"
                          >
                            <ShoppingBag size={13} />
                            <span>Acquire</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= TAB 3: SELL ITEMS & PUBLISH UGC ================= */}
          {activeTab === 'sell' && (
            <div className="max-w-2xl mx-auto bg-stone-950/80 p-6 rounded-3xl border border-stone-800 shadow-xl space-y-5">
              {/* Sell Mode Sub-Selector */}
              <div className="flex items-center justify-center p-1 bg-stone-900 border border-stone-800 rounded-2xl">
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.playMinecraftSound('click');
                    setSellMode('item');
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    sellMode === 'item' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Tag size={13} />
                  <span>1. List In-Game Virtual Item</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audioEngine.playMinecraftSound('click');
                    setSellMode('ugc');
                  }}
                  className={`flex-1 py-2 rounded-xl font-bold text-xs transition cursor-pointer flex items-center justify-center gap-2 ${
                    sellMode === 'ugc' ? 'bg-amber-500 text-stone-950 shadow' : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Sparkles size={13} />
                  <span>2. Publish UGC Creation (90% Payout)</span>
                </button>
              </div>

              {sellMode === 'item' ? (
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white mb-1">Create an In-Game Item Listing</h3>
                    <p className="text-xs text-stone-400">
                      List tradeable items originating from Minecraft, Roblox, Countryballs, or Xilam. Your seller reputation rating will be attached to the escrow contract.
                    </p>
                  </div>

                  <form onSubmit={handleCreateListing} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Item Title / Name:</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Masterwork Netherite Pickaxe"
                          value={sellName}
                          onChange={(e) => setSellName(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Item Icon (Emoji):</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={sellIcon}
                          onChange={(e) => setSellIcon(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                          placeholder="e.g. ⛏️, 🗡️, 🥤, 🪠, 🍔"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Brand Universe:</label>
                        <select
                          value={sellBrand}
                          onChange={(e) => setSellBrand(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="Minecraft">Minecraft</option>
                          <option value="Roblox">Roblox</option>
                          <option value="Countryballs">Countryballs</option>
                          <option value="Xilam">Xilam</option>
                          <option value="McDonald's">McDonald's</option>
                          <option value="BP">BP</option>
                          <option value="YouTube">YouTube</option>
                          <option value="Tarragower">Tarragower</option>
                          <option value="New World">New World</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Category:</label>
                        <select
                          value={sellCategory}
                          onChange={(e) => setSellCategory(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="weapons">Weapons</option>
                          <option value="tools">Tools</option>
                          <option value="consumables">Consumables & Food</option>
                          <option value="accessories">Accessories & Gear</option>
                          <option value="curios">Curios & Relics</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Rarity:</label>
                        <select
                          value={sellRarity}
                          onChange={(e) => setSellRarity(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="common">Common</option>
                          <option value="rare">Rare</option>
                          <option value="epic">Epic</option>
                          <option value="legendary">Legendary</option>
                          <option value="mythic">Mythic</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Asking Price:</label>
                        <input
                          type="number"
                          min={1}
                          max={9999}
                          value={sellPrice}
                          onChange={(e) => setSellPrice(parseInt(e.target.value) || 1)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Currency:</label>
                        <select
                          value={sellCurrency}
                          onChange={(e) => setSellCurrency(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="coins">Coins (Standard)</option>
                          <option value="robux">Robux (Premium)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Sales Pitch / Description:</label>
                      <textarea
                        rows={2}
                        value={sellDesc}
                        onChange={(e) => setSellDesc(e.target.value)}
                        placeholder="Describe condition, enchantments, or special effects..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('browse')}
                        className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="mc-btn mc-btn-primary px-6 py-2.5 rounded-xl font-bold shadow-lg"
                      >
                        Publish Listing to Market
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div>
                  <div className="mb-4">
                    <h3 className="text-base font-bold text-white mb-1">Upload & Monetize UGC Creation</h3>
                    <p className="text-xs text-stone-400">
                      Publish custom Countryball skins, Minecraft builds, Roblox templates, or custom wearables. Set your own price in Coins or Robux — 90% of every sale goes to your creator wallet!
                    </p>
                  </div>

                  <form onSubmit={handleUploadUgc} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Creation Title:</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Neon Cyberpunk Obby Template"
                          value={ugcTitle}
                          onChange={(e) => setUgcTitle(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Preview Icon (Emoji):</label>
                        <input
                          type="text"
                          maxLength={4}
                          value={ugcIcon}
                          onChange={(e) => setUgcIcon(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                          placeholder="e.g. 👑, 🏰, 🪜, 🪰"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Creation Type / Category:</label>
                        <select
                          value={ugcCategory}
                          onChange={(e) => setUgcCategory(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="countryball_skin">🌐 Countryball Custom Skin</option>
                          <option value="minecraft_build">⛏️ Minecraft Build Schematic</option>
                          <option value="roblox_template">🟥 Roblox Game Template</option>
                          <option value="custom_wearable">🪰 Custom Wearable & Weapon</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Brand Universe / Theme:</label>
                        <select
                          value={ugcBrand}
                          onChange={(e) => setUgcBrand(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="Countryballs">Countryballs</option>
                          <option value="Minecraft">Minecraft</option>
                          <option value="Roblox">Roblox</option>
                          <option value="Xilam">Xilam</option>
                          <option value="McDonald's">McDonald's</option>
                          <option value="BP">BP</option>
                          <option value="Universal">Universal Crossover</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-300 mb-1">Monetization Price:</label>
                        <input
                          type="number"
                          min={10}
                          max={9999}
                          value={ugcPrice}
                          onChange={(e) => setUgcPrice(parseInt(e.target.value) || 10)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-300 mb-1">Currency:</label>
                        <select
                          value={ugcCurrency}
                          onChange={(e) => setUgcCurrency(e.target.value as any)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                        >
                          <option value="coins">Coins (Earned in-game)</option>
                          <option value="robux">Robux (Premium Currency)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Creation Description & Blueprint Specs:</label>
                      <textarea
                        rows={2}
                        value={ugcDesc}
                        onChange={(e) => setUgcDesc(e.target.value)}
                        placeholder="Describe special features, compatibility, animations, or build tips..."
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-300 mb-1">Community Tags (Comma-separated):</label>
                      <input
                        type="text"
                        value={ugcTags}
                        onChange={(e) => setUgcTags(e.target.value)}
                        placeholder="e.g. Skin, HD, Cyberpunk, Speedrun"
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-white"
                      />
                    </div>

                    <div className="pt-2 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setActiveTab('ugc')}
                        className="px-4 py-2 rounded-xl text-stone-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="mc-btn mc-btn-primary px-6 py-2.5 rounded-xl font-bold shadow-lg"
                      >
                        Publish to Community UGC Marketplace
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: RECEIPTS & HISTORY ================= */}
          {activeTab === 'receipts' && (
            <div className="space-y-4">
              <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 text-xs text-stone-300">
                <p className="font-bold text-amber-300 mb-1">Cryptographic Escrow Receipts & Trade History</p>
                <p className="text-stone-400">
                  Every marketplace transaction is verified through automated escrow with guaranteed delivery of items and funds.
                </p>
              </div>

              {receipts.length === 0 ? (
                <div className="bg-stone-950/60 p-8 rounded-2xl border border-stone-800 text-center text-stone-500 text-xs">
                  No purchases yet. Browse the marketplace and acquire your first virtual relic!
                </div>
              ) : (
                <div className="space-y-3">
                  {receipts.map((rcpt) => (
                    <div
                      key={rcpt.id}
                      className="bg-stone-950/70 border border-stone-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={15} className="text-emerald-400" />
                          <span className="font-bold text-white">{rcpt.itemName}</span>
                          <span className="text-[10px] bg-stone-900 text-stone-400 px-2 py-0.5 rounded border border-stone-800">
                            {rcpt.id}
                          </span>
                        </div>
                        <div className="text-stone-400">
                          Seller: <strong className="text-stone-200">{rcpt.sellerName}</strong> • Buyer: <strong className="text-stone-200">{rcpt.buyerName}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <div className="font-bold text-amber-400">
                            {rcpt.amount} {rcpt.currency.toUpperCase()}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            {new Date(rcpt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>

                        <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30">
                          {rcpt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ================= PURCHASE CONFIRMATION ESCROW MODAL ================= */}
        {selectedItemToBuy && (
          <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-stone-900 border-2 border-amber-500 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 font-mono">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Escrow Purchase Verification</h3>
                </div>
                <button
                  onClick={() => setSelectedItemToBuy(null)}
                  className="text-stone-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedItemToBuy.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedItemToBuy.name}</h4>
                    <span className="text-[10px] text-amber-400 uppercase">{selectedItemToBuy.brand}</span>
                  </div>
                </div>
                <p className="text-xs text-stone-300">{selectedItemToBuy.description}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Seller:</span>
                  <span className="text-white font-bold">{selectedItemToBuy.sellerName} (⭐ {selectedItemToBuy.sellerReputation})</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Price:</span>
                  <span className="text-amber-400 font-bold">{selectedItemToBuy.price} {selectedItemToBuy.currency.toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Your Current Balance:</span>
                  <span className="text-emerald-400 font-bold">
                    {selectedItemToBuy.currency === 'coins' ? `${customData.coins} Coins` : `${customData.robux} Robux`}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedItemToBuy(null)}
                  className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBuyConfirm}
                  disabled={buying}
                  className="mc-btn mc-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg disabled:opacity-50"
                >
                  {buying ? 'Verifying Escrow...' : 'Confirm & Authorize'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* UGC Reviews & Feedback Modal */}
        {selectedUgcForReviews && (
          <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 font-mono">
            <div className="bg-stone-900 border-2 border-purple-500/60 rounded-3xl w-full max-w-xl shadow-2xl p-5 space-y-4 max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{selectedUgcForReviews.previewIcon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedUgcForReviews.title}</h3>
                    <div className="text-[10px] text-stone-400 flex items-center gap-1.5">
                      <span>by {selectedUgcForReviews.authorName}</span>
                      <span>•</span>
                      <div className="flex items-center text-amber-400 font-bold">
                        <Star size={11} fill="currentColor" /> {selectedUgcForReviews.averageRating.toFixed(1)} / 5.0
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedUgcForReviews(null)}
                  className="text-stone-400 hover:text-white p-1.5 rounded-lg hover:bg-stone-800 transition cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Reviews List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {(!ugcReviewsMap[selectedUgcForReviews.id] || ugcReviewsMap[selectedUgcForReviews.id].length === 0) ? (
                  <div className="text-center py-6 text-stone-500 text-xs">
                    No community reviews yet. Be the first explorer to review this creation!
                  </div>
                ) : (
                  ugcReviewsMap[selectedUgcForReviews.id].map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-stone-950/80 p-3.5 rounded-2xl border border-stone-800/80 space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
                          <span>{rev.reviewerName}</span>
                          <span className="text-[10px] text-stone-500 font-normal">
                            • {new Date(rev.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              fill={s <= rev.rating ? 'currentColor' : 'none'}
                              className={s <= rev.rating ? 'text-amber-400' : 'text-stone-600'}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-stone-300 leading-relaxed">{rev.comment}</p>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleUpvoteReview(selectedUgcForReviews.id, rev.id)}
                          className="text-[10px] text-stone-400 hover:text-amber-300 flex items-center gap-1 bg-stone-900 px-2 py-0.5 rounded border border-stone-800 transition cursor-pointer"
                        >
                          <ThumbsUp size={10} />
                          <span>Helpful ({rev.helpfulCount})</span>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Submit a Review Form */}
              <form onSubmit={handleAddReview} className="border-t border-stone-800 pt-3 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300">Rate this Creation:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => {
                          audioEngine.playMinecraftSound('click');
                          setNewReviewRating(star);
                        }}
                        className="text-amber-400 hover:scale-125 transition cursor-pointer p-0.5"
                      >
                        <Star
                          size={16}
                          fill={star <= newReviewRating ? 'currentColor' : 'none'}
                          className={star <= newReviewRating ? 'text-amber-400' : 'text-stone-600'}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-amber-300 ml-1 font-mono">{newReviewRating}.0</span>
                  </div>
                </div>

                <textarea
                  rows={2}
                  required
                  placeholder="Share your thoughts on design, animations, or gameplay value..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-amber-400"
                />

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedUgcForReviews(null)}
                    className="px-3 py-1.5 rounded-xl text-xs text-stone-400 hover:text-white"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="mc-btn mc-btn-primary px-4 py-1.5 rounded-xl text-xs font-bold shadow cursor-pointer"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
