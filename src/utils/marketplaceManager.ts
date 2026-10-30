/**
 * In-Game Multi-Brand Virtual Marketplace & Trader Reputation System
 * Supports Minecraft, Roblox, Countryballs, Xilam, and Brand Crossover Items.
 */

import { collection, doc, getDocs, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { avatarManager } from './avatarManager';

export interface MarketItem {
  id: string;
  name: string;
  brand: 'Minecraft' | 'Roblox' | 'Countryballs' | 'Xilam' | 'McDonald\'s' | 'BP' | 'YouTube' | 'Tarragower' | 'New World';
  category: 'weapons' | 'tools' | 'blocks' | 'consumables' | 'accessories' | 'curios';
  price: number;
  currency: 'coins' | 'robux';
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  icon: string;
  description: string;
  sellerUid: string;
  sellerName: string;
  sellerReputation: number;
  sellerTrades: number;
  sellerBadges: string[];
  stock: number;
  listedAt: number;
}

export interface TransactionReceipt {
  id: string;
  itemId: string;
  itemName: string;
  sellerName: string;
  buyerName: string;
  amount: number;
  currency: 'coins' | 'robux';
  timestamp: number;
  status: 'COMPLETED_ESCROW';
}

export const DEFAULT_MARKET_ITEMS: MarketItem[] = [
  // MINECRAFT ITEMS
  {
    id: 'mkt_diamond_sword',
    name: 'Enchanted Sharpness V Diamond Sword',
    brand: 'Minecraft',
    category: 'weapons',
    price: 320,
    currency: 'coins',
    rarity: 'epic',
    icon: '🗡️',
    description: 'Forged from deep-cavern diamonds with shimmering purple enchantment glint and +8 attack damage.',
    sellerUid: 'trader_steve_pro',
    sellerName: 'Steve_The_Miner',
    sellerReputation: 4.9,
    sellerTrades: 124,
    sellerBadges: ['Verified Trader', 'Master Smith'],
    stock: 5,
    listedAt: Date.now() - 3600000,
  },
  {
    id: 'mkt_totem_undying',
    name: 'Totem of Undying',
    brand: 'Minecraft',
    category: 'curios',
    price: 450,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🗿',
    description: 'Grants instant resurrection, regeneration II, and fire resistance upon fatal damage.',
    sellerUid: 'trader_evoker_deal',
    sellerName: 'MansionTrader',
    sellerReputation: 4.8,
    sellerTrades: 89,
    sellerBadges: ['Verified Trader'],
    stock: 2,
    listedAt: Date.now() - 7200000,
  },
  {
    id: 'mkt_enchanted_apple',
    name: 'Notch Golden Apple (God Apple)',
    brand: 'Minecraft',
    category: 'consumables',
    price: 280,
    currency: 'coins',
    rarity: 'epic',
    icon: '🍏',
    description: 'Eight blocks of pure gold surrounding a succulent apple. Full saturation and absorption IV.',
    sellerUid: 'trader_nomad',
    sellerName: 'DesertAlchemist',
    sellerReputation: 4.9,
    sellerTrades: 210,
    sellerBadges: ['Master Merchant', 'Top Rated'],
    stock: 9,
    listedAt: Date.now() - 5400000,
  },

  // ROBLOX ITEMS
  {
    id: 'mkt_speed_coil',
    name: 'Hyper Red Speed Coil',
    brand: 'Roblox',
    category: 'accessories',
    price: 90,
    currency: 'robux',
    rarity: 'epic',
    icon: '🌀',
    description: 'Iconic glowing red helical spring granting +100% sprint velocity and trailing red neon particles.',
    sellerUid: 'trader_builderman',
    sellerName: 'BloxyCollector_99',
    sellerReputation: 5.0,
    sellerTrades: 340,
    sellerBadges: ['Verified Trader', 'Instant Escrow'],
    stock: 4,
    listedAt: Date.now() - 1800000,
  },
  {
    id: 'mkt_bloxy_cola',
    name: 'Vintage Bloxy Cola 6-Pack',
    brand: 'Roblox',
    category: 'consumables',
    price: 110,
    currency: 'coins',
    rarity: 'common',
    icon: '🥤',
    description: 'Crack open an icy cold can of authentic Bloxburg soda! Restores full stamina and plays the glug sound.',
    sellerUid: 'trader_bacon',
    sellerName: 'BaconHairBro',
    sellerReputation: 4.7,
    sellerTrades: 45,
    sellerBadges: ['Verified Trader'],
    stock: 15,
    listedAt: Date.now() - 10800000,
  },
  {
    id: 'mkt_dominus_aureus',
    name: 'Dominus Aureus Emperor Cowl',
    brand: 'Roblox',
    category: 'accessories',
    price: 350,
    currency: 'robux',
    rarity: 'mythic',
    icon: '👑',
    description: 'Ultra-rare mythic headpiece worn by high-society Roblox billionaires. Glowing crimson eyes and golden plumage.',
    sellerUid: 'trader_rich_noob',
    sellerName: 'LordDominus',
    sellerReputation: 4.9,
    sellerTrades: 512,
    sellerBadges: ['Diamond Merchant', 'Certified Escrow'],
    stock: 1,
    listedAt: Date.now() - 14400000,
  },

  // COUNTRYBALLS ITEMS
  {
    id: 'mkt_poland_plunger',
    name: 'Polish Plunger of Destiny',
    brand: 'Countryballs',
    category: 'weapons',
    price: 190,
    currency: 'coins',
    rarity: 'rare',
    icon: '🪠',
    description: 'Polandball\'s legendary domestic tool turned ultimate anti-imperial defensive weapon. +15% knockback!',
    sellerUid: 'trader_polandball',
    sellerName: 'PolskaSovereign',
    sellerReputation: 5.0,
    sellerTrades: 178,
    sellerBadges: ['Verified Trader', 'UN Diplomat'],
    stock: 6,
    listedAt: Date.now() - 4000000,
  },
  {
    id: 'mkt_british_tea_kettle',
    name: 'Royal Windsor Tea Kettle of Calm',
    brand: 'Countryballs',
    category: 'curios',
    price: 240,
    currency: 'coins',
    rarity: 'rare',
    icon: '🫖',
    description: 'Brew an impeccable Earl Grey cuppa. Cleanses all poison and negative status effects while providing diplomatic calm.',
    sellerUid: 'trader_ukball',
    sellerName: 'LordSalisbury_UK',
    sellerReputation: 4.8,
    sellerTrades: 92,
    sellerBadges: ['Verified Trader'],
    stock: 3,
    listedAt: Date.now() - 8600000,
  },

  // XILAM ITEMS
  {
    id: 'mkt_flyswatter_9000',
    name: 'Oggy\'s Golden Flyswatter 9000',
    brand: 'Xilam',
    category: 'weapons',
    price: 260,
    currency: 'coins',
    rarity: 'epic',
    icon: '🪰',
    description: 'Reinforced cartoon titanium mesh! Delivers hilarious slapstick squeaks and pushes adversaries 10 blocks back.',
    sellerUid: 'trader_oggy_cat',
    sellerName: 'OggyKitchenGuard',
    sellerReputation: 4.9,
    sellerTrades: 165,
    sellerBadges: ['Verified Trader', 'Slapstick Master'],
    stock: 7,
    listedAt: Date.now() - 6200000,
  },
  {
    id: 'mkt_marina_pearl',
    name: 'Marina\'s Deep Lagoon Pearl',
    brand: 'Xilam',
    category: 'curios',
    price: 340,
    currency: 'coins',
    rarity: 'legendary',
    icon: '🦪',
    description: 'Luminous oceanic pearl found by Marina and Sharko. Grants permanent water breathing and swim swiftness.',
    sellerUid: 'trader_sharko_guard',
    sellerName: 'SharkoLifeguard',
    sellerReputation: 5.0,
    sellerTrades: 230,
    sellerBadges: ['Top Rated', 'Verified Trader'],
    stock: 2,
    listedAt: Date.now() - 9500000,
  },

  // BRAND EXCLUSIVES
  {
    id: 'mkt_mcdonalds_burger',
    name: 'McDonald\'s Supreme Quad-Stack Meal',
    brand: 'McDonald\'s',
    category: 'consumables',
    price: 130,
    currency: 'coins',
    rarity: 'rare',
    icon: '🍔',
    description: 'Four 100% beef patties, golden fries, and a large drink. Instantly restores 100% hunger and grants 5 bonus hearts.',
    sellerUid: 'trader_mcd_chef',
    sellerName: 'ChefPierre_MCD',
    sellerReputation: 4.9,
    sellerTrades: 420,
    sellerBadges: ['Certified Chef', 'Instant Escrow'],
    stock: 20,
    listedAt: Date.now() - 2100000,
  },
  {
    id: 'mkt_bp_fuel_cell',
    name: 'BP Helios Turbo Fuel Cell',
    brand: 'BP',
    category: 'tools',
    price: 210,
    currency: 'coins',
    rarity: 'rare',
    icon: '🔋',
    description: 'High-density solar bio-fuel cell that powers any furnace or steam locomotive for 20 minutes continuously.',
    sellerUid: 'trader_bp_eng',
    sellerName: 'HeliosEnergy_BP',
    sellerReputation: 4.8,
    sellerTrades: 110,
    sellerBadges: ['Verified Trader'],
    stock: 12,
    listedAt: Date.now() - 3200000,
  },
  {
    id: 'mkt_youtube_play_button',
    name: 'YouTube Diamond Creator Trophy',
    brand: 'YouTube',
    category: 'curios',
    price: 550,
    currency: 'coins',
    rarity: 'mythic',
    icon: '💎',
    description: 'Commemorating 10,000,000 subscribers! Emits an inspiring starlight prism aura and grants +50% XP multiplier.',
    sellerUid: 'trader_yt_star',
    sellerName: 'DiamondCreator_YT',
    sellerReputation: 5.0,
    sellerTrades: 600,
    sellerBadges: ['Master Merchant', 'Top Rated', 'Instant Escrow'],
    stock: 1,
    listedAt: Date.now() - 15000000,
  },
  {
    id: 'mkt_newworld_compass',
    name: 'Aeternum Expedition Compass',
    brand: 'New World',
    category: 'tools',
    price: 230,
    currency: 'coins',
    rarity: 'rare',
    icon: '🧭',
    description: 'Antiquated brass navigational compass pointing toward unmined diamond veins and hidden treasure chests.',
    sellerUid: 'trader_pioneer_nw',
    sellerName: 'FrontierCartographer',
    sellerReputation: 4.7,
    sellerTrades: 76,
    sellerBadges: ['Verified Trader'],
    stock: 5,
    listedAt: Date.now() - 4500000,
  },
];

const STORAGE_MARKET_KEY = 'megaworld_marketplace_items_v1';
const STORAGE_RECEIPTS_KEY = 'megaworld_marketplace_receipts_v1';
const STORAGE_ENDORSEMENTS_KEY = 'megaworld_trader_endorsements_v1';

export const marketplaceManager = {
  getLocalItems(): MarketItem[] {
    try {
      const stored = localStorage.getItem(STORAGE_MARKET_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading marketplace items:', e);
    }
    return DEFAULT_MARKET_ITEMS;
  },

  saveLocalItems(items: MarketItem[]) {
    try {
      localStorage.setItem(STORAGE_MARKET_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn('Error saving marketplace items:', e);
    }
  },

  getReceipts(): TransactionReceipt[] {
    try {
      const stored = localStorage.getItem(STORAGE_RECEIPTS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading receipts:', e);
    }
    return [];
  },

  addReceipt(receipt: TransactionReceipt) {
    try {
      const existing = this.getReceipts();
      localStorage.setItem(STORAGE_RECEIPTS_KEY, JSON.stringify([receipt, ...existing.slice(0, 49)]));
    } catch (e) {
      console.warn('Error adding receipt:', e);
    }
  },

  async loadFromCloud(): Promise<MarketItem[]> {
    try {
      const colRef = collection(db, 'marketplace_listings');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const cloudItems: MarketItem[] = [];
        snap.forEach((docSnap) => cloudItems.push(docSnap.data() as MarketItem));
        this.saveLocalItems(cloudItems);
        return cloudItems;
      }
    } catch (e) {
      console.warn('Could not load market listings from cloud, using local cache:', e);
    }
    return this.getLocalItems();
  },

  async executePurchase(
    item: MarketItem,
    buyerUid: string,
    buyerName: string
  ): Promise<{ success: boolean; newReceipt: TransactionReceipt; message: string }> {
    const customData = avatarManager.getLocalCustomization();

    // 1. Escrow Balance Validation
    if (item.currency === 'coins' && customData.coins < item.price) {
      throw new Error(`Insufficient Coins! You need ${item.price} Coins (Balance: ${customData.coins}).`);
    }
    if (item.currency === 'robux' && customData.robux < item.price) {
      throw new Error(`Insufficient Robux! You need ${item.price} Robux (Balance: ${customData.robux}).`);
    }

    // 2. Stock Validation
    if (item.stock <= 0) {
      throw new Error('This listing is out of stock!');
    }

    // 3. Deduct funds from buyer wallet
    const updatedCustom = {
      ...customData,
      coins: item.currency === 'coins' ? customData.coins - item.price : customData.coins,
      robux: item.currency === 'robux' ? customData.robux - item.price : customData.robux,
      tradesCompleted: customData.tradesCompleted + 1,
    };
    await avatarManager.saveToCloud(buyerUid, updatedCustom);

    // 4. Update Market Item Stock
    const allItems = this.getLocalItems();
    const updatedItems = allItems
      .map((it) => {
        if (it.id === item.id) {
          return {
            ...it,
            stock: it.stock - 1,
            sellerTrades: it.sellerTrades + 1,
          };
        }
        return it;
      })
      .filter((it) => it.stock > 0);

    this.saveLocalItems(updatedItems);

    // 5. Generate Secure Transaction Receipt
    const receipt: TransactionReceipt = {
      id: `TX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      itemId: item.id,
      itemName: item.name,
      sellerName: item.sellerName,
      buyerName: buyerName || 'Steve',
      amount: item.price,
      currency: item.currency,
      timestamp: Date.now(),
      status: 'COMPLETED_ESCROW',
    };
    this.addReceipt(receipt);

    // 6. Sync listing update to cloud
    try {
      if (item.stock - 1 <= 0) {
        await deleteDoc(doc(db, 'marketplace_listings', item.id));
      } else {
        await setDoc(doc(db, 'marketplace_listings', item.id), {
          ...item,
          stock: item.stock - 1,
          sellerTrades: item.sellerTrades + 1,
        }, { merge: true });
      }
    } catch (e) {
      console.warn('Could not sync listing decrement to cloud:', e);
    }

    return {
      success: true,
      newReceipt: receipt,
      message: `Successfully purchased "${item.name}" for ${item.price} ${item.currency.toUpperCase()}!`,
    };
  },

  async createListing(
    item: Omit<MarketItem, 'id' | 'listedAt' | 'sellerTrades' | 'sellerReputation' | 'sellerBadges'>,
    sellerUid: string,
    sellerRep: number,
    sellerTrades: number
  ): Promise<MarketItem> {
    const newItem: MarketItem = {
      ...item,
      id: `mkt_user_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      sellerReputation: sellerRep || 4.9,
      sellerTrades: sellerTrades || 1,
      sellerBadges: ['Verified Player', 'Live Escrow'],
      listedAt: Date.now(),
    };

    const currentItems = this.getLocalItems();
    const updated = [newItem, ...currentItems];
    this.saveLocalItems(updated);

    try {
      await setDoc(doc(db, 'marketplace_listings', newItem.id), newItem);
    } catch (e) {
      console.warn('Could not write listing to cloud:', e);
    }

    return newItem;
  },

  endorseTrader(sellerUid: string): boolean {
    try {
      const stored = localStorage.getItem(STORAGE_ENDORSEMENTS_KEY);
      const endorsedList: string[] = stored ? JSON.parse(stored) : [];
      if (endorsedList.includes(sellerUid)) {
        return false; // already endorsed
      }
      endorsedList.push(sellerUid);
      localStorage.setItem(STORAGE_ENDORSEMENTS_KEY, JSON.stringify(endorsedList));

      // Increase trader reputation in local listings
      const items = this.getLocalItems();
      const updated = items.map((it) => {
        if (it.sellerUid === sellerUid) {
          return {
            ...it,
            sellerReputation: Math.min(5.0, Number((it.sellerReputation + 0.1).toFixed(1))),
          };
        }
        return it;
      });
      this.saveLocalItems(updated);
      return true;
    } catch (e) {
      console.warn('Error endorsing trader:', e);
      return false;
    }
  }
};
