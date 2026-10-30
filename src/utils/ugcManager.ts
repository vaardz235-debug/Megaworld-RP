/**
 * User-Generated Content (UGC) Marketplace, Showcase, Creator Monetization & Rating System
 * Supports Custom Skins for Countryballs, Minecraft Builds, Roblox Templates, and Wearables.
 */

import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { avatarManager } from './avatarManager';

export interface UgcReview {
  id: string;
  creationId: string;
  reviewerUid: string;
  reviewerName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: number;
  helpfulCount: number;
}

export interface UgcCreation {
  id: string;
  title: string;
  category: 'countryball_skin' | 'minecraft_build' | 'roblox_template' | 'custom_wearable';
  brandTheme: 'Countryballs' | 'Minecraft' | 'Roblox' | 'Xilam' | 'McDonald\'s' | 'BP' | 'Universal';
  authorUid: string;
  authorName: string;
  authorReputation: number;
  price: number;
  currency: 'coins' | 'robux';
  previewIcon: string;
  description: string;
  tags: string[];
  downloadsCount: number;
  averageRating: number;
  reviewsCount: number;
  isVerifiedCreator?: boolean;
  creationPayload?: {
    skinColors?: string[];
    blueprintBlocks?: { x: number; y: number; block: string }[];
    gameRules?: Record<string, any>;
    motto?: string;
  };
  createdAt: number;
}

export const INITIAL_UGC_CREATIONS: UgcCreation[] = [
  {
    id: 'ugc_countryball_aeternum',
    title: 'Aeternum Sovereign Ball Skin',
    category: 'countryball_skin',
    brandTheme: 'Countryballs',
    authorUid: 'creator_poland_fan',
    authorName: 'GrandDiplomat_99',
    authorReputation: 4.9,
    price: 180,
    currency: 'coins',
    previewIcon: '👑',
    description: 'Custom community sovereign ball crowned with golden laurel wreath and imperial deep amethyst banner. Grants +15% travel speed.',
    tags: ['Skin', 'Countryball', 'Imperial', 'Diplomat'],
    downloadsCount: 342,
    averageRating: 4.9,
    reviewsCount: 38,
    isVerifiedCreator: true,
    creationPayload: {
      skinColors: ['#7c3aed', '#fbbf24'],
      motto: 'In Unity and Starlight We Endure',
    },
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'ugc_mc_sky_castle',
    title: 'Nether Fortress Sky Castle Blueprint',
    category: 'minecraft_build',
    brandTheme: 'Minecraft',
    authorUid: 'creator_voxel_god',
    authorName: 'MasterArchitect_MC',
    authorReputation: 5.0,
    price: 350,
    currency: 'coins',
    previewIcon: '🏰',
    description: 'Full schematic for an elevated floating obsidian and nether brick fortress! Includes automated redstone drawbridge and chest vaults.',
    tags: ['Blueprint', 'Castle', 'Redstone', 'Nether'],
    downloadsCount: 520,
    averageRating: 4.8,
    reviewsCount: 64,
    isVerifiedCreator: true,
    creationPayload: {
      blueprintBlocks: [
        { x: 0, y: 0, block: 'obsidian' },
        { x: 1, y: 0, block: 'stone' },
        { x: 2, y: 0, block: 'obsidian' },
      ],
    },
    createdAt: Date.now() - 172800000,
  },
  {
    id: 'ugc_roblox_speed_obby',
    title: 'Tower of Speedrun Obby 50-Stages',
    category: 'roblox_template',
    brandTheme: 'Roblox',
    authorUid: 'creator_obby_pro',
    authorName: 'BloxBuilder_Elite',
    authorReputation: 4.8,
    price: 80,
    currency: 'robux',
    previewIcon: '🪜',
    description: 'Fully scripted 50-checkpoint vertical parkour obby with speed coils, gravity pads, neon laser grids, and leaderboard integration.',
    tags: ['Obby', 'Parkour', 'Template', 'Leaderboard'],
    downloadsCount: 410,
    averageRating: 4.7,
    reviewsCount: 29,
    isVerifiedCreator: true,
    creationPayload: {
      gameRules: { stages: 50, coilAllowed: true, checkpointFx: 'confetti' },
    },
    createdAt: Date.now() - 259200000,
  },
  {
    id: 'ugc_xilam_swatter_pro',
    title: 'Oggy\'s Giant Mecha-Flyswatter',
    category: 'custom_wearable',
    brandTheme: 'Xilam',
    authorUid: 'creator_slapstick',
    authorName: 'OggyAnimator',
    authorReputation: 4.9,
    price: 190,
    currency: 'coins',
    previewIcon: '🪰',
    description: 'Player-crafted comedy weapon with custom squeak sound matrix and 4x knockback shockwave. Built for cartoon PVP arenas.',
    tags: ['Wearable', 'Slapstick', 'Weapon', 'Oggy'],
    downloadsCount: 280,
    averageRating: 4.9,
    reviewsCount: 42,
    isVerifiedCreator: true,
    createdAt: Date.now() - 120000000,
  },
  {
    id: 'ugc_mcd_tycoon',
    title: 'McDonald\'s Drive-Thru Tycoon Blueprint',
    category: 'minecraft_build',
    brandTheme: 'McDonald\'s',
    authorUid: 'creator_ronald_fan',
    authorName: 'GoldenChef_Builder',
    authorReputation: 4.9,
    price: 240,
    currency: 'coins',
    previewIcon: '🍔',
    description: 'Interactive restaurant blueprint with conveyor belt kitchen, order window dispensers, and golden arches entrance archway.',
    tags: ['Blueprint', 'Tycoon', 'Food', 'Creative'],
    downloadsCount: 310,
    averageRating: 4.8,
    reviewsCount: 35,
    isVerifiedCreator: false,
    createdAt: Date.now() - 60000000,
  },
];

export const INITIAL_UGC_REVIEWS: Record<string, UgcReview[]> = {
  ugc_countryball_aeternum: [
    {
      id: 'rev_1',
      creationId: 'ugc_countryball_aeternum',
      reviewerUid: 'user_cb_player',
      reviewerName: 'SteveExplorer',
      rating: 5,
      comment: 'Super crisp custom skin! The gold laurel wreath looks incredible in multiplayer servers.',
      createdAt: Date.now() - 36000000,
      helpfulCount: 14,
    },
    {
      id: 'rev_2',
      creationId: 'ugc_countryball_aeternum',
      reviewerUid: 'user_alex_miner',
      reviewerName: 'AlexWilderness',
      rating: 5,
      comment: 'Great work! The speed boost works as described during expeditions.',
      createdAt: Date.now() - 18000000,
      helpfulCount: 9,
    },
  ],
  ugc_mc_sky_castle: [
    {
      id: 'rev_3',
      creationId: 'ugc_mc_sky_castle',
      reviewerUid: 'user_redstone_kid',
      reviewerName: 'RedstoneMechanic',
      rating: 5,
      comment: 'The automated drawbridge wiring is genius. Imported cleanly into my survival world.',
      createdAt: Date.now() - 48000000,
      helpfulCount: 21,
    },
  ],
  ugc_roblox_speed_obby: [
    {
      id: 'rev_4',
      creationId: 'ugc_roblox_speed_obby',
      reviewerUid: 'user_parkour_fan',
      reviewerName: 'NoobSpeedrunner',
      rating: 4,
      comment: 'Stages 30-40 are delightfully difficult! Fun template for hosting custom servers.',
      createdAt: Date.now() - 20000000,
      helpfulCount: 12,
    },
  ],
};

const UGC_STORAGE_KEY = 'megaworld_ugc_creations_v1';
const UGC_REVIEWS_STORAGE_KEY = 'megaworld_ugc_reviews_v1';

export const ugcManager = {
  getLocalCreations(): UgcCreation[] {
    try {
      const stored = localStorage.getItem(UGC_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading UGC creations:', e);
    }
    return INITIAL_UGC_CREATIONS;
  },

  saveLocalCreations(creations: UgcCreation[]) {
    try {
      localStorage.setItem(UGC_STORAGE_KEY, JSON.stringify(creations));
      window.dispatchEvent(new CustomEvent('megaworld_ugc_updated', { detail: creations }));
    } catch (e) {
      console.warn('Error saving UGC creations:', e);
    }
  },

  getLocalReviews(): Record<string, UgcReview[]> {
    try {
      const stored = localStorage.getItem(UGC_REVIEWS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Error reading UGC reviews:', e);
    }
    return INITIAL_UGC_REVIEWS;
  },

  saveLocalReviews(reviews: Record<string, UgcReview[]>) {
    try {
      localStorage.setItem(UGC_REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (e) {
      console.warn('Error saving UGC reviews:', e);
    }
  },

  async loadFromCloud(): Promise<UgcCreation[]> {
    try {
      const colRef = collection(db, 'ugc_creations');
      const snap = await getDocs(colRef);
      if (!snap.empty) {
        const list: UgcCreation[] = [];
        snap.forEach((d) => list.push(d.data() as UgcCreation));
        this.saveLocalCreations(list);
        return list;
      }
    } catch (e) {
      console.warn('Using local UGC cache:', e);
    }
    return this.getLocalCreations();
  },

  async uploadCreation(
    creationData: Omit<UgcCreation, 'id' | 'authorUid' | 'authorName' | 'downloadsCount' | 'averageRating' | 'reviewsCount' | 'createdAt'>,
    authorUid: string,
    authorName: string
  ): Promise<UgcCreation> {
    const newCreation: UgcCreation = {
      ...creationData,
      id: `ugc_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      authorUid: authorUid || 'guest-author',
      authorName: authorName || 'CreativeMiner',
      downloadsCount: 0,
      averageRating: 5.0,
      reviewsCount: 0,
      createdAt: Date.now(),
    };

    const current = this.getLocalCreations();
    const updated = [newCreation, ...current];
    this.saveLocalCreations(updated);

    try {
      await setDoc(doc(db, 'ugc_creations', newCreation.id), newCreation);
    } catch (e) {
      console.warn('Cloud UGC write fallback:', e);
    }

    return newCreation;
  },

  async purchaseCreation(
    creation: UgcCreation,
    buyerUid: string,
    buyerName: string
  ): Promise<{ success: boolean; message: string }> {
    const customData = avatarManager.getLocalCustomization();

    if (creation.currency === 'coins' && customData.coins < creation.price) {
      throw new Error(`Insufficient Coins! You need ${creation.price} Coins (Balance: ${customData.coins}).`);
    }
    if (creation.currency === 'robux' && customData.robux < creation.price) {
      throw new Error(`Insufficient Robux! You need ${creation.price} Robux (Balance: ${customData.robux}).`);
    }

    // Deduct payment
    const updatedCustom = {
      ...customData,
      coins: creation.currency === 'coins' ? customData.coins - creation.price : customData.coins,
      robux: creation.currency === 'robux' ? customData.robux - creation.price : customData.robux,
      tradesCompleted: customData.tradesCompleted + 1,
    };
    await avatarManager.saveToCloud(buyerUid, updatedCustom);

    // Increase downloads count
    const list = this.getLocalCreations();
    const updatedList = list.map((c) =>
      c.id === creation.id ? { ...c, downloadsCount: c.downloadsCount + 1 } : c
    );
    this.saveLocalCreations(updatedList);

    return {
      success: true,
      message: `Successfully acquired "${creation.title}"! ${Math.round(creation.price * 0.9)} ${creation.currency.toUpperCase()} credited to ${creation.authorName}.`,
    };
  },

  addReview(
    creationId: string,
    reviewerUid: string,
    reviewerName: string,
    rating: number,
    comment: string
  ): UgcReview {
    const newRev: UgcReview = {
      id: `rev_${Date.now()}`,
      creationId,
      reviewerUid: reviewerUid || 'guest-reviewer',
      reviewerName: reviewerName || 'Verified Builder',
      rating,
      comment: comment.trim(),
      createdAt: Date.now(),
      helpfulCount: 1,
    };

    const allReviews = this.getLocalReviews();
    const itemReviews = [newRev, ...(allReviews[creationId] || [])];
    allReviews[creationId] = itemReviews;
    this.saveLocalReviews(allReviews);

    // Recalculate average rating for the creation
    const creations = this.getLocalCreations();
    const avg = Number(
      (itemReviews.reduce((sum, r) => sum + r.rating, 0) / itemReviews.length).toFixed(1)
    );
    const updatedCreations = creations.map((c) =>
      c.id === creationId
        ? { ...c, averageRating: avg, reviewsCount: itemReviews.length }
        : c
    );
    this.saveLocalCreations(updatedCreations);

    return newRev;
  },

  upvoteReview(creationId: string, reviewId: string): void {
    const allReviews = this.getLocalReviews();
    const list = allReviews[creationId] || [];
    allReviews[creationId] = list.map((r) =>
      r.id === reviewId ? { ...r, helpfulCount: r.helpfulCount + 1 } : r
    );
    this.saveLocalReviews(allReviews);
  }
};
