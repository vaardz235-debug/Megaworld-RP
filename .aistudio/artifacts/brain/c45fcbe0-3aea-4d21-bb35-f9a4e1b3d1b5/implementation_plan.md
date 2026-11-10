# United Games and Apps RPG - 10-Brand Avatar Customization, Classes, Quests & Cross-Platform Cosmetic Store

Comprehensive architectural blueprint and implementation details across all 10 integrated entities:
**Countryballs, Minecraft, Roblox, Xilam, NZ (New Zealand), Tarragower School, BP, McDonald's, YouTube, and New World**.

---

## 1. Character Classes Architecture (7+ Distinct Brand Classes)

Each class features a thematic Role, Starting Active Ability (with live in-game casting via `[Q]` key & HUD button), Passive Skill, and Recommended Playstyle:

1. **Minecraft Master Builder**
   - **Role**: Builder & Fortification Tank
   - **Icon**: ⛏️ | **Ability VFX Color**: `#10b981` (Emerald Glow)
   - **Starting Ability**: *Instant Bedrock Rampart* (Cooldown: 18s)
     - *Effect*: Erects an unbreakable defensive bastion, grants invulnerability boost, restores +25 HP, and adds +5 building blocks directly to inventory.
     - *Voice Line*: "Grab your pickaxes! Fortifying the perimeter before darkness falls!"
   - **Passive Skill**: *Deep Spelunker Prospector* (+30% tool durability, rare gemstone veins glow through rock).
   - **Recommended Playstyle**: Base fortification, subterranean resource extraction, defensive rampart architecture, and fortress containment.

2. **YouTube Content Creator**
   - **Role**: Support & Crowd Buffer
   - **Icon**: ▶️ | **Ability VFX Color**: `#ef4444` (YouTube Red Stream)
   - **Starting Ability**: *100M Viral Inspiration Wave* (Cooldown: 20s)
     - *Effect*: Emits a blinding golden stream flare that grants the player and nearby allies +50% sprint velocity and attack speed.
     - *Voice Line*: "What is up chat! We are LIVE and powering up the whole squad right now!"
   - **Passive Skill**: *Algorithm Trendsetter* (+40% bonus XP from world events, crowd confetti celebrations on objective completions).
   - **Recommended Playstyle**: Voice chat shoutcasting, team coordination, high-tempo mobility buffing, and raid rally leadership.

3. **Roblox Obby Champion**
   - **Role**: High-Mobility Parkour Scout
   - **Icon**: 👟 | **Ability VFX Color**: `#e2231a` (Roblox Crimson)
   - **Starting Ability**: *Gravity Coil Hyper-Vault* (Cooldown: 12s)
     - *Effect*: Catapults the character skyward with a dual-stage super jump and forward air dash, completely negating fall damage.
     - *Voice Line*: "OOF! Watch this insane speedrun shortcut across the void!"
   - **Passive Skill**: *Bloxy Stamina & Physics Defiance* (Stamina recharges 2x faster, harmlessly bounces off cliff faces).
   - **Recommended Playstyle**: Vertical exploration, rapid outflanking of hostile mobs, obstacle relay speedrunning, and capturing elevated flags.

4. **McDonald's Golden Chef**
   - **Role**: Healer, Sustainer & Provisioner
   - **Icon**: 🍔 | **Ability VFX Color**: `#ffbc0d` (Golden Arches)
   - **Starting Ability**: *Golden Banquet Feast* (Cooldown: 22s)
     - *Effect*: Deploys a banquet table restoring 100% hunger and health to all nearby teammates.
     - *Voice Line*: "Order up! Golden crisp fries and burgers for the whole party!"
   - **Passive Skill**: *Sizzling Chef Vigor* (Food consumable recovery effectiveness increased by +50%, +2 permanent hearts).
   - **Recommended Playstyle**: Squad medic, provisioning supply caches, cooking team feasts, and sustaining vanguard units.

5. **BP Clean Energy Eco-Engineer**
   - **Role**: Area Defense & Utility Artificer
   - **Icon**: ⚡ | **Ability VFX Color**: `#00a651` (Helios Green)
   - **Starting Ability**: *Solar Photon Overcharge* (Cooldown: 16s)
     - *Effect*: Discharges an energy dome, grants +6 Torches & +4 Coal, and illuminates dark subterranean depths.
     - *Voice Line*: "Clean solar photon grid online! Maximize power output to all systems!"
   - **Passive Skill**: *Bio-Cell Efficiency Grid* (Tool crafting cost reduced by 25%, automatic micro-energy shield regeneration).
   - **Recommended Playstyle**: Power grid distribution, machine automation, tech crafting, and lighting unmapped dungeons.

6. **New World Faction Conqueror**
   - **Role**: Vanguard Heavy Tank & Territory Commander
   - **Icon**: ⚔️ | **Ability VFX Color**: `#f59e0b` (Azoth Amber)
   - **Starting Ability**: *Aeternum Azoth War Cry* (Cooldown: 20s)
     - *Effect*: Emits an ancient Azoth shockwave that taunts mobs, pushes hostiles back, and restores +35 HP.
     - *Voice Line*: "For the Faction! Stand firm behind the shieldwall of Aeternum!"
   - **Passive Skill**: *Territory Sovereign Aegis* (+30% armor mitigation while in allied biomes, +20% faster fort capture).
   - **Recommended Playstyle**: Frontline vanguard defense, territorial siege wars, commanding palisade battles, and aggro containment.

7. **NZ Rangatira Wayfinder**
   - **Role**: Exploration Scout & Cultural Guardian
   - **Icon**: 🌿 | **Ability VFX Color**: `#0284c7` (Southern Pacific Teal)
   - **Starting Ability**: *Ka Mate Haka Tremor* (Cooldown: 15s)
     - *Effect*: Performs a ground-shaking Haka stomp creating acoustic shockwaves that stun monsters for 3s.
     - *Voice Line*: "Ka mate, ka mate! Ka ora, ka ora! Tenei te tangata puhuruhuru!"
   - **Passive Skill**: *Southern Cross Celestial Guidance* (Permanent minimap fog clearance, +20% swimming speed in oceans).
   - **Recommended Playstyle**: Biome navigation, leading expeditions through uncharted frontiers, discovering hidden shrines.

8. **Countryball Sovereign Diplomat**
   - **Role**: Support & Non-Aggression Peacemaker
   - **Icon**: 🌐 | **Ability VFX Color**: `#3b82f6` (UN Blue)
   - **Starting Ability**: *Diplomatic Safe Harbor Pact* (Cooldown: 24s)
     - *Effect*: Establishes a demilitarized zone where hostile mobs cannot attack and restores full team health.
     - *Voice Line*: "Attention sovereign nations! Ceasefire signed! Clay borders are officially protected!"
   - **Passive Skill**: *Sovereign Free Trade Network* (+25% marketplace coin profits, 0% trade tariff fees).
   - **Recommended Playstyle**: Inter-faction trade, economic mediation, establishing neutral trading outposts.

9. **Tarragower School Scholar**
   - **Role**: Intel Gatherer & Sage Enchanter
   - **Icon**: 🏛️ | **Ability VFX Color**: `#6366f1` (Academic Indigo)
   - **Starting Ability**: *Glyphic Academy Revelation* (Cooldown: 18s)
     - *Effect*: Rings the heritage bell, reveals secret ore veins, and awards Amethyst & Diamond crystal shards.
     - *Voice Line*: "Class is now in session! Knowledge is the ultimate weapon against chaos!"
   - **Passive Skill**: *Academic Mastery* (+35% experience gain from all sources, recipe unlock costs halved).
   - **Recommended Playstyle**: Fast leveling, research and enchantment crafting, library archive management.

---

## 2. In-Game Quests & Recurring World Events (Voice Chat & Team Interaction)

### 5 Thematic Brand Quests:
1. **Rescue the Lost Villager in the Nether Caldera (Minecraft)**
   - *Theme*: Minecraft Nether Wastes & Fortresses.
   - *Objectives*: Mine 10 Magma blocks, locate lost Villager Alistair trapped in basalt ruins, escort him back safely.
   - *Voice Chat Integration*: Requires calling out coordinate coordinates via proximity voice chat (`[V]` key) so squadmates can watch the rear flank.
   - *Cross-Player Interaction*: One player carries the torch/shield while a second player handles extraction pickaxe mining.

2. **100M Viral Audio Challenge (YouTube)**
   - *Theme*: YouTube Trending Stage & Studio Rig.
   - *Objectives*: Gather 6 Torches, step onto the Golden Play Button stage, broadcast a viral hype session.
   - *Voice Chat Integration*: 2 or more players speak into their spatial voice channel to fill the decibel meter to 100%.
   - *Cross-Player Interaction*: Audience players trigger reaction soundboard effects while the host delivers the live broadcast.

3. **Drive-Thru Grand Banquet Rush (McDonald's)**
   - *Theme*: McDonald's Golden Drive-Thru.
   - *Objectives*: Cook 8 Bread, gather 6 Apples, deliver 4 Golden Provision Kits before the 3-minute timer expires.
   - *Voice Chat Integration*: Chef calls out incoming order tickets over the voice intercom; runners verify pickup stations.
   - *Cross-Player Interaction*: Order splitting where one player handles grill/furnace cooking while another handles packaging.

4. **Obby Relay & Soundboard Duel (Roblox)**
   - *Theme*: Roblox Mega Obby & Soundboard Arena.
   - *Objectives*: Complete the 15-stage neon jump platforms under 90 seconds, hit the victory button, sound the celebration board.
   - *Voice Chat Integration*: Lead navigator gives auditory voice cues ("jump now!", "laser clear!") to guide teammates across invisible blocks.
   - *Cross-Player Interaction*: Players press alternating weight pads to lower laser gates for each other.

5. **Azoth Rift Incursion Defense (New World)**
   - *Theme*: New World Aeternum Fort War.
   - *Objectives*: Reinforce 3 bastion gates with 12 Cobblestone, eliminate 5 Corrupted Rift walkers, seal the dimensional breach.
   - *Voice Chat Integration*: Raid leader issues tactical voice orders calling defensive positions (North Gate, Flank, Portal Core).
   - *Cross-Player Interaction*: Shared shieldwall formation blocking projectiles while builders patch breached ramparts.

### 3 Recurring World Events:
1. **YouTube Multiverse Viral Stream Raid**
   - *Cadence*: Every 45 minutes.
   - *Mechanic*: A 10,000 Decibel Voice Hype Meter appears server-wide. All players chant, cheer, and sing together via spatial voice chat to unlock a global 3x Coin & XP multiplier.

2. **Minecraft Nether Warden Cave-In Siege**
   - *Cadence*: Every 60 minutes.
   - *Mechanic*: Underground cave tremor triggers deep sculk awakening. Players must communicate in low whispers over voice chat to avoid activating vibration sensors while mining emerald beacons.

3. **McDonald's Happy Meal Midnight Carnival**
   - *Cadence*: Every 30 minutes.
   - *Mechanic*: Golden balloon drops scatter across the server. Players coordinate over voice chat to share mystery toys, trading for complete commemorative sets.

---

## 3. Cross-Platform Cosmetic Store & Monetization Strategy

### Features & Catalog
- **10-Brand Themed Catalog**: Unique skins, outfits, animated emotes, back accessories, and aura particle effects themed around all 10 universes.
- **Dual Currency Economy**:
  - **F2P Coins**: Earned abundantly through gameplay (mining, completing quests, voice chat challenges, level-ups).
  - **Premium Robux / Gems**: Used for exclusive animated prestige skins, mythic soundboard effects, and VIP titles.
- **Fair Bundles & Zero Pay-to-Win**:
  - Cosmetics provide **100% visual and acoustic flair only**; no competitive gameplay advantages.
  - Transparent currency bundles ($4.99 for 500 Gems to $49.99 for 6,500 Gems) with permanent purchase protection.
- **Live 3D Dressing Room**:
  - Interactive live preview on player's active character avatar with 360° inspection and "Test Sound & Emote Audio" button.

### Multi-Device Synchronization & Anti-Data-Loss
- **Unified Cloud Storage**: Synchronized through Firestore collection `player_progressions/{uid}`.
- **Deterministic High-Water-Mark Reconciliation**: When switching between PC, console, and mobile, highest level, unlocked cosmetic IDs, and currency balances are merged to eliminate progress rollback.
- **SHA-256 Data Integrity Hashing**: Cryptographic hash attached to each save payload verifying authenticity and preventing tampering.
- **15-Minute 6-Digit Transfer Code**: Enables fast device handoff (e.g. from mobile phone to PC) without re-entering credentials.

---

## 4. Community Social Feed Module (Dashboard Integration)

### Features & Architecture
- **Embedded in Dashboard (`src/components/Dashboard.tsx` & `src/components/SocialFeed.tsx`)**:
  - Direct module in Dashboard accessible via top navbar button "Social Feed", Title Menu shortcut "Community Social Feed & UGC Builds", and the in-game dashboard.
  - Active builders counter (e.g. `1,420 Builders Online`) and live UGC status badges.
- **Shared 2D Minecraft Build Schematics**:
  - Interactive **12x8 block schematic visualizer**: renders block colors, textures, and borders (crying obsidian, glowing amethyst, sculk, netherite, gold, repeating command blocks, glass, doors, torches, magma).
  - Hover tooltip displaying exact block type, row, and column.
  - Detailed metadata: Dimensions, block count, difficulty tier (Easy, Intermediate, Master, Legendary), primary materials checklist, and world coordinates.
  - One-click **"Import to World"** and **"Copy Blueprint"** (JSON) capabilities.
- **Community Screenshots & Scenic Highlights**:
  - Showcases high-fidelity moments (e.g. *Dawn Over Landmark 6: The Verity Celestial Shrine*, *100M Subscriber Stream Raid with Voice Decibel Fireworks*, *Waitangi River Valley Haka Tremor*).
  - Visual badges for camera angles (*3D WebGL Isometric*, *Cinematic Panoramic*), resolutions (*4K Ultra High-Definition 165 FPS*), coordinates (*X: 87.00, Y: 4.50*), and featured multiplayer cast.
  - **"Visit Location in 3D"** coordinate warp button.
- **Social Engagement & Feedback**:
  - Dual reactions: ❤️ Heart Likes with live count, 💎 Diamond Gem reactions, and 🔥 Fire flame reactions.
  - Real-time interactive comments thread: collapsible drawer displaying community builder tips, timestamps, and active user comment submission.
- **Content Creation & Publishing Modal**:
  - **Share 2D Minecraft Build**: Specify schematic title, brand theme, story, materials, and tags.
  - **Share Community Screenshot**: Specify camera angle, coordinate landmarks, resolution, and caption.
  - Persists directly to Firebase Firestore collection `social_feed_posts` with automatic offline local fallback.

---

## 5. Halloween Spooktacular Update 🎃 (Characters in Costumes, Spooky Items & Blocks)

### 11 Halloween Costumed Crossover Icons:
1. **Halloween Vampire Steve** (ID: 901) - Dracula crimson velvet capelet, slick widow's peak, bats, and held torch.
2. **Halloween Witch Alex** (ID: 902) - Pointed buckled witch hat, bubbling cauldron, starlight halo, and potion flacons.
3. **Halloween Pumpkin Creeper** (ID: 903) - Illuminated glowing carved jack-o'-lantern helm, spooky ghost wisp aura.
4. **Halloween Skeleton Knight** (ID: 904) - Catacomb skull visor, crossed soul reaper scythes, and spectral aura.
5. **Halloween Ghost Polandball** (ID: 905) - Translucent spectral white sheet wisp floating across sovereign borders.
6. **Halloween Frankenstein Oggy** (ID: 906) - Stitched monster brow with dual high-voltage neck bolts and lightning spark aura.
7. **Halloween Werewolf Noob** (ID: 907) - Full-moon ragged lumberjack flannel, sharp werewolf claws, and howling blood moon mist.
8. **Halloween Grim Reaper Ronald** (ID: 908) - Black cowl hood, twin soul harvesting scythes, and golden fry bag lantern.
9. **Halloween Headless Engine Thomas** (ID: 909) - Spooky Blue Engine with carved jack-o'-lantern smoke-box wisp echoes.
10. **Halloween Mummy Brenda BP** (ID: 910) - Solar-powered hieroglyphic mummy gauze wrap with torch illumination.
11. **Halloween Jack-o'-Lantern Verity** (ID: 911) - Purple witch robes, orbiting mini carved pumpkins, and sweet star candies.

### Halloween Items & Blocks:
- **Carved Pumpkin** (`carved_pumpkin`): Orange carved gourd block with triangular eyes and jagged tooth smile.
- **Jack-o'-Lantern** (`jack_o_lantern`): Glowing carved pumpkin illuminated by internal candle, casting level-15 light.
- **Spooky Candy Corn** (`candy_corn`): Consumable food item restoring +25 hunger, +15 health, and triggering a 5-second sugar rush sprint boost.
- **Soul Reaper Scythe** (`reaper_scythe`): Dark obsidian-handled scythe with curved spectral blade.
- **Witch's Cauldron** (`witch_cauldron`): Cast-iron bubbling cauldron filled with glowing green bewitched elixir and bubbles.
- **Haunted Cobweb** (`spooky_cobweb`): Sticky spider silk strands slowing walking entities.
- **Catacomb Tombstone** (`tombstone`): Weathered stone gravestone with R.I.P engraving.
- **Ghost Wisp Lantern** (`ghost_lantern`): Ethereal purple lantern housing a dancing spirit wisp.
- **Trick-or-Treat Bag** (`trick_or_treat_bag`): Festive canvas treat bag giving bonus candies and pumpkin drops on use.

### Avatar Customization & Cosmetics Catalog:
- **Hats**: Wicked Witch Hat (`hat_witch`), Carved Jack-o'-Lantern Helm (`hat_pumpkin`), Frankenstein Stitched Brow & Neck Bolts (`hat_frankenstein`), Vampire Widow's Peak (`hat_vampire`), Catacomb Skull Visor (`hat_skeleton_skull`).
- **Back Accessories**: Flapping Midnight Bat Wings (`back_bat_wings`), Crossed Soul Scythes (`back_reaper_scythe`), Floating Companion Ghost (`back_ghost_float`).
- **Auras**: Dancing Jack-o'-Lantern & Spirit Aura (`aura_halloween_spooky`), Blood Moon Crimson Mist & Bats (`aura_blood_mist`).
- **Emotes**: Trick-or-Treat Candy Shower (`emote_halloween_trick_or_treat`), Spooky Monster Thriller Dance (`emote_halloween_thriller`), Ghostly "BOO!" Jumpscare (`emote_halloween_ghost_boo`).
- **Preset**: Halloween Soul Reaper Steve (`preset_halloween_reaper`) ready for instant one-click equipping.
- **Store Showcase**: Featured Halloween Spooktacular skins and emotes added to `STORE_CATALOG` in `CosmeticStoreModal.tsx`.

---

## 6. World & Level Editor Architecture (`src/components/WorldEditor.tsx`)

### Overview
A comprehensive, interactive 2D Voxel Level Editor empowering players to design, paint, test, save, export, and publish custom levels across all 10 universes with full Halloween block support.

### Features & Capabilities:
1. **Interactive Editing Canvas**:
   - Custom dynamic matrix sizes: `15x10` (Classic Mini Canvas), `24x14`, `36x18`, `48x24`, and custom grids.
   - Live block and coordinate inspection cursor (`X, Y`).
   - 40-step Undo (`Ctrl+Z`) & Redo (`Ctrl+Y`) history buffer.
2. **Full Creative Toolkit**:
   - ✏️ **Pencil**: Precise single-block placement.
   - 🖌️ **Brush**: Adjustable radius (1x1, 2x2, 3x3).
   - 🪣 **Bucket (Flood Fill)**: Fast contiguous region filling.
   - 📏 **Line Tool**: Bresenham line drawer.
   - 🔲 **Box / Rect Tool**: Wall and structure enclosure creator.
   - 🧹 **Eraser**: Sets tiles back to sky atmosphere.
   - 💧 **Eyedropper**: Sample blocks directly from the canvas.
   - 🔀 **Replace All**: Instant global block replacement.
3. **Categorized Block Palette (35+ Blocks)**:
   - *Halloween*: Carved Pumpkin, Jack-o'-Lantern, Witch Cauldron, Spooky Cobweb, Tombstone, Ghost Lantern.
   - *Terrain*: Grass, Dirt, Stone, Cobblestone, Sand, Sandstone, Snow, Ice, Magma, Mycelium.
   - *Building*: Oak Wood, Oak Planks, Clay Bricks, Glass, Bookshelf, Obsidian, Crying Obsidian.
   - *Ores*: Coal, Raw Iron, Gold, Diamond, Emerald, Netherite, Amethyst.
   - *Functional*: Impulse, Chain & Repeating Command Blocks, Wooden Door, Torch, Jukebox, Sponge, Sculk Sensor.
   - *Fluids & Nature*: Water, Lava, Leaves, Poppy Flower, Cactus, Red Mushroom.
4. **Procedural Terrain Presets & Structure Prefabs**:
   - Generators: *Flat Plains*, *Haunted Halloween Catacombs*, *Nether Caldera*, *Floating Sky Islands*, *Clear Canvas*.
   - Prefab Stamps: *7x5 Cozy Wood Cabin*, *5x6 Nether Portal Altar*, *6x4 Spooky Pumpkin Crypt*.
5. **Built-In Instant Playtest Mode**:
   - Jump directly onto the level inside the editor with Steve or custom avatar.
   - Gravity, block collision, jumping (Space / W), walking (A / D).
6. **Cross-Platform Persistence & Social Sharing**:
   - Local & Cloud Level Saving with metadata (author, theme, block counts).
   - JSON Blueprint Export (Copy to clipboard) and Import (JSON schematic reader).
   - 1-Click **"Publish to UGC Feed"** publishing directly to the Community Social Feed.



---

## 7. Jeremy the Jet Plane ("Steremy") & Sodor Airport Expansion ✈️

### Overview
Integration of Jeremy the Jet Plane (the iconic jet plane of Sodor Airport from Thomas & Friends, affectionately known as "Steremy") as both a high-speed mount and fully customizable character avatar, accompanied by the Sodor International Airport & Runway landmark, aviation equipment, and supersonic holiday quests.

### Features & Capabilities:
1. **Sodor Airport & Runway Biome**:
   - Location: Coordinates `worldX: 392 - 415`.
   - Laser-leveled smooth tarmac runway with illuminated `glowstone` runway edge lights.
   - High-speed supersonic launch pad with repeating command block thruster boost.
   - Dedicated roaming NPCs: Jeremy the Jet Plane (Steremy) and Holiday Steremy.
2. **Playable Avatar & High-Speed Mount**:
   - Character ID 850: `Jeremy the Jet Plane (Steremy)` with glossy white fuselage, blue/yellow Sodor livery, twin jet turbines, cockpit smile, and contrail vapors.
   - Character ID 851: `Holiday Steremy the Christmas Jet` with Santa aviator hat, candy cane exhaust flares, and gift bays.
   - Vehicles in `VEHICLE_CATALOG`: `jeremy_jet` (220 km/h, 4.2x multiplier, canFly) and `jeremy_xmas` (240 km/h, 4.6x multiplier).
3. **Aviation & Steremy Items**:
   - `jeremy_flight_token`: Steremy Flight Remote & Plane Summoner
   - `sodor_aviator_shades`: Sodor Airport Supersonic Aviator Shades
   - `jet_turbine_booster`: Twin Turbojet Sound-Barrier Booster
   - `aviation_jet_fuel`: Sodor Airport High-Octane Jet Fuel
   - `airport_radar_beacon`: Sodor Airport Radar Transponder
4. **Interactive Quests (`npc_jeremy`)**:
   - *Sodor Runway Illumination*: Provide glowstones to light the night airstrip.
   - *Multiverse Holiday Airdrop*: Supply food rations for high-altitude emergency airdrops.
   - *Break the Sound Barrier*: Reinforce turbojet heat shielding with obsidian blocks.
5. **Instant Quick-Travel Button**:
   - Top action bar button `✈️ Sodor Airport & Steremy` instantly teleports the player to x: 400 and mounts Jeremy the Jet Plane for immediate supersonic flight.
