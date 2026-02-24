# Spec Improvements Document

This document tracks changes/improvements made to the Dungeon Cards game that should be reflected in future spec updates.

## 2026-02-23

### Bug Fix: Missing `Random.pickMultiple` function
- **File**: `utils/random.js`
- **Issue**: `map.js:181` called `Random.pickMultiple()` which didn't exist
- **Fix**: Added `pickMultiple(array, count)` function to Random utility
- **Spec Improvement**: The spec should explicitly list all required utility functions in `random.js`:
  - `int(min, max)` - random integer in range
  - `float(min, max)` - random float in range
  - `pick(array)` - pick single random element
  - `pickMultiple(array, count)` - pick multiple unique random elements
  - `shuffle(array)` - shuffle array
  - `chance(percent)` - boolean based on percentage
  - `weighted(items)` - weighted random selection

### Bug Fix: `Random.weighted` return value
- **File**: `utils/random.js`
- **Issue**: `Random.weighted()` returned the whole object `{ weight, value }` instead of just `value`
- **Impact**: Broke map node type determination, shop generation, and many other systems
- **Fix**: Modified `weighted()` to return `item.value` if it exists, otherwise return the item
- **Spec Improvement**: The spec should clarify that `weighted(items)` expects items with `{ weight, value }` structure and returns just the `value`

### Bug Fix: Sprite rendering coordinates
- **File**: `rendering/sprites.js`
- **Issue**: Pixel offsets in sprite functions weren't being scaled, causing sprites to render incorrectly
- **Impact**: All sprites (player, enemies, relics, potions) were rendering as distorted shapes
- **Fix**: 
  - `drawRect(ctx, x, y, w, h, color, scale)` only scales width/height: `ctx.fillRect(x, y, w * scale, h * scale)`
  - Each sprite function multiplies pixel offsets by `s` when calling drawRect: `this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, color, s)`
- **Spec Improvement**: The spec should clarify that sprite drawing functions take pixel coordinates (x, y) where each "pixel" offset must be multiplied by scale in the caller.

### Feature: Rest site card upgrade UI
- **File**: `game.js`
- **Issue**: Rest site "Upgrade a Card" auto-upgraded a random card instead of letting player choose
- **Fix**: Added `restSubState` property and card selection UI when upgrading at rest site
- **Spec Improvement**: The spec should describe the rest site upgrade flow:
  1. Player clicks "Upgrade a Card"
  2. Game shows all upgradeable cards (deck cards where `!card.upgraded`)
  3. Player clicks a card to upgrade it
  4. Game calls `RestSite.upgradeCard(index)` and returns to map

### UI Improvement: Enemy HP numbers visible
- **File**: `rendering/ui.js`
- **Issue**: Enemies only showed HP bars without numeric values, making it hard to calculate damage
- **Fix**: Added `hp/maxHp` text below enemy HP bars, plus block value display when enemy has block
- **Spec Improvement**: `drawEnemyHPBar()` should display:
  - HP bar (visual)
  - `hp/maxHp` text below the bar
  - Block icon and value above bar when `enemy.block > 0`

### UI Improvement: Hovered card renders on top
- **File**: `rendering/ui.js`
- **Issue**: When hovering over cards in hand, other cards could overlap and obscure the hovered card
- **Fix**: Modified `drawHand()` to draw all non-hovered cards first, then draw the hovered card last
- **Spec Improvement**: `drawHand()` should use a two-pass rendering approach:
  1. First pass: Draw all non-hovered cards
  2. Second pass: Draw hovered card (if any) on top

### UI Feature: End Turn button visible
- **File**: `game.js`
- **Issue**: No visible End Turn button in combat; players couldn't end their turn
- **Fix**: Added visible "End Turn" button on right side of combat screen with hover state
- **Spec Improvement**: Combat UI should include:
  - End Turn button positioned at `{ x: UI.width - 150, y: UI.height / 2 - 25, w: 120, h: 50 }`
  - Button should be hoverable and clickable
  - Clicking calls `Combat.endPlayerTurn()`

### UI Improvement: Enemy sprite sizes and positioning
- **File**: `rendering/ui.js`, `game.js`
- **Issue**: All enemies used same 64px size regardless of type; positioning didn't account for different sizes
- **Fix**: 
  - Added `getEnemySpriteSize(enemy)` function with specific sizes per enemy type (30-128px)
  - Updated `drawEnemy()` to use proper sprite sizes
  - Updated `drawEnemyHPBar()` to accept custom width matching sprite
  - Updated `renderCombat()` and `updateCombat()` to calculate proper enemy positioning based on actual sizes
- **Spec Improvement**: Enemy rendering should:
  - Use `getEnemySpriteSize(enemy)` to get base pixel size for each enemy type
  - Multiply by `enemy.size` (or 1 for bosses) for final size
  - Position enemies with proper spacing based on actual sprite widths
  - HP bar width should match sprite width

### UI Feature: Enemy intent tooltip
- **File**: `rendering/ui.js`
- **Issue**: Enemy intents showed only icon and damage, no detailed info
- **Fix**: Added `drawIntentTooltip()` that shows on hover with:
  - Intent name
  - Damage (with multi-hit info)
  - Block value
  - Heal amount
  - Status effects applied
  - "Hits all" indicator for `attackAll` type
- **Spec Improvement**: `drawEnemyIntent()` should:
  - Accept `hovered` parameter
  - When hovered, call `drawIntentTooltip()` showing detailed intent info
  - Tooltip positioned above intent icon, clamped to screen bounds

### UI Improvement: Draw/Discard pile positioning
- **File**: `rendering/ui.js`
- **Issue**: Draw and Discard pile indicators were positioned too low, overlapping with hand area
- **Fix**: Moved both indicators from `y = this.height - 100` to `y = this.height - 200`
- **Spec Improvement**: Draw/Discard pile indicators should be positioned above the hand area to avoid overlap

### UI Improvement: Enemy intent hover detection
- **File**: `game.js`, `rendering/ui.js`
- **Issue**: Intent tooltip triggered when hovering enemy sprite, not the intent icon itself
- **Fix**: 
  - Added `hoveredIntent` property to track when mouse is over intent icon
  - Added separate hitbox detection for intent icon (52x32 pixels, positioned above enemy)
  - Updated `drawEnemy()` to accept `intentHovered` parameter
- **Spec Improvement**: Intent tooltip should only appear when hovering the intent icon, not the enemy sprite

### UI Feature: Enemy targeting highlight
- **File**: `rendering/ui.js`, `game.js`
- **Issue**: No visual feedback showing which enemies are valid targets when selecting a targeting card
- **Fix**:
  - Added `targetable` parameter to `drawEnemy()`
  - When a card with `targets: 'single'` is selected and playable, enemies show green glow
  - Pass `isTargetable` flag from `renderCombat()` when `selectedCard.targets === 'single'`
- **Spec Improvement**: When player selects a card that targets a single enemy:
  - All valid target enemies should display a green glow effect
  - This provides clear visual feedback for targeting

### Feature: Event result display
- **File**: `game.js`, `rendering/ui.js`, `systems/shop.js`
- **Issue**: Events like "Magic Mirror" weren't showing results - just returned to map immediately
- **Fix**:
  - Added `eventResult` property to `game.js` to track result state
  - Added `drawEventResult()` function in `ui.js` to display outcome with effects
  - Modified `handleEventClick()` to show result screen before returning to map
  - Added `trade` effect implementation in `shop.js` (was completely missing)
  - Added `startArenaBattle()` function for arena events
  - Added `arenaRewards` property and handling in `handleCombatVictory()`
- **Spec Improvement**: Event system should:
  - Display a result screen after player makes a choice
  - Show all effects applied (gold, HP, cards, relics, etc.)
  - Handle special effects like `removeCardRequest`, `teleport`, `arena`

### Feature: Card removal mode for events
- **File**: `game.js`
- **Issue**: Events that remove cards (like "Remove a card" at upgrade shrine) had no UI for selection
- **Fix**:
  - Added `renderRemoveMode()` function to display deck for card selection
  - Updated `updateShop()` to detect hovered cards in remove mode
  - Updated `handleShopClick()` to handle card removal clicks
  - Events can trigger remove mode by setting `shop = { removeMode: true, removeCost: 0 }`
- **Spec Improvement**: Card removal UI should:
  - Display all deck cards in a grid layout
  - Allow player to click a card to remove it
  - Have a cancel button to exit without removing

## 2026-02-24

### Feature: Visual Revitalization - Theme System
- **File**: `data/themes.js` (NEW)
- **Purpose**: Centralized theme configuration for visual consistency across acts and screens
- **Implementation**:
  - Act themes: Expanse (Act 1), Depths (Act 2), Spire (Act 3) with unique color palettes
  - Screen themes: menu, map, combat, shop, rest, event with specific background/particle settings
  - Node themes: Colors and glow effects for each map node type
  - Event themes: Visual configurations for different event types
- **API**:
  - `THEMES.getActTheme(act)` - Get theme for current act
  - `THEMES.getScreenTheme(screenType)` - Get theme for current screen
  - `THEMES.getNodeTheme(nodeType)` - Get theme for map node
  - `THEMES.getEventTheme(eventType)` - Get theme for event
- **Spec Improvement**: Add `data/themes.js` to spec with full theme structure

### Feature: Visual Revitalization - Dynamic Backgrounds
- **File**: `rendering/backgrounds.js` (NEW)
- **Purpose**: Dynamic, animated backgrounds that respond to game state
- **Implementation**:
  - Layered rendering: base gradient, midground patterns, foreground effects
  - Screen-specific backgrounds: dungeon map, combat arena, shop, rest site, event
  - Animated elements: floating particles, light rays, ambient effects
  - Act-specific color schemes and visual themes
- **API**:
  - `Backgrounds.draw(ctx, w, h, screenType, act, options)` - Main render function
  - `Backgrounds.update(deltaTime)` - Animation update
- **Spec Improvement**: Add `rendering/backgrounds.js` with layer structure and animation details

### Feature: Visual Revitalization - Particle System
- **File**: `rendering/particles.js` (NEW)
- **Purpose**: Full particle system for ambient and action effects
- **Implementation**:
  - Particle types: dust, spark, ember, snow, bubble, leaf, star, smoke
  - Ambient particles: Auto-spawned based on screen theme settings
  - Action particles: Triggered by game events (damage, healing, etc.)
  - Particle pools for performance optimization
  - Physics: gravity, drift, fade, scale over lifetime
- **API**:
  - `Particles.update(deltaTime)` - Update all particles
  - `Particles.draw(ctx, w, h)` - Render all particles
  - `Particles.spawn(type, x, y, count, options)` - Spawn particles
  - `Particles.burst(x, y, type, count)` - Quick burst effect
- **Spec Improvement**: Add `rendering/particles.js` with particle types and physics

### Feature: Visual Revitalization - Map Icons
- **File**: `rendering/mapIcons.js` (NEW)
- **Purpose**: Pixel-art style icons for map nodes
- **Implementation**:
  - Custom drawn icons for each node type: sword, skull, demon, coin, campfire, question, chest
  - Visited state: Dimmed colors and reduced effects
  - Glow effects for available/current nodes
  - Scale-based rendering for different sizes
- **API**:
  - `MapIcons.draw(ctx, type, x, y, size, options)` - Draw node icon
  - Options: `{ visited, glow }`
- **Spec Improvement**: Add `rendering/mapIcons.js` with icon drawing specifications

### Feature: Curved Map Paths
- **File**: `systems/map.js`
- **Issue**: Map connections were straight lines, looked rigid
- **Fix**:
  - Added `drawCurvedPath()` using quadratic Bezier curves
  - Paths curve naturally between nodes
  - Visited paths show subtle glow effect
  - Added `drawNodeHighlight()` for current/available node glow
- **Spec Improvement**: Map paths should use curved connections with:
  - Quadratic Bezier curves with control points
  - Different colors for visited vs unvisited
  - Glow effect for visited paths

### Feature: MapIcons Integration
- **File**: `systems/map.js`
- **Issue**: Map nodes used basic circles with text symbols
- **Fix**:
  - Replaced circle+text rendering with `MapIcons.draw()`
  - Icons show detailed pixel-art representations
  - Visited nodes show dimmed versions
  - Current/available nodes have glow effects
- **Spec Improvement**: Map nodes should use `MapIcons` for rendering with:
  - Type-specific icons (sword for battle, skull for elite, etc.)
  - Visual states for visited, current, and available

### Feature: Environment System Integration
- **File**: `rendering/ui.js`
- **Purpose**: Unified environment rendering for all screens
- **Implementation**:
  - `drawEnvironment(screenType, act, options)` - Main entry point
  - Calls `Backgrounds.draw()` with appropriate theme
  - Spawns ambient particles based on theme settings
- **Spec Improvement**: UI should call `drawEnvironment()` at start of each screen render

### Feature: Game Loop Visual Updates
- **File**: `game.js`
- **Issue**: New visual systems weren't being updated/rendered
- **Fix**:
  - Added `Backgrounds.update(deltaTime)` to game loop
  - Added `Particles.update(deltaTime)` to game loop
  - Added `Particles.draw(ctx, w, h)` to render loop (after UI, before Animations)
- **Spec Improvement**: Game loop should update/render visual systems:
  - Update: Backgrounds, Particles
  - Render: UI, Particles, Animations (in order)

### Bug Fix: Backgrounds not rendering
- **File**: `game.js`, `data/themes.js`, `rendering/backgrounds.js`
- **Issue**: Backgrounds were not visible on any screen despite code appearing correct
- **Root Causes**:
  1. Canvas not being cleared at start of each frame - added `UI.ctx.clearRect(0, 0, UI.width, UI.height)` at start of `render()`
  2. Theme colors too dark - brightened Act 1 colors (bg1: `#1a1a2e` → `#2a2a4e`, bg2: `#16213e` → `#1e3a5e`, bg3: `#0f3460` → `#0f4470`, accent: `#4a3728` → `#5a4738`)
  3. Background element alpha values too low - increased menu circle alpha (0.08→0.15), line alpha (0.25→0.4), fog alpha
- **Fix**:
  - Added `clearRect()` call in `render()` function
  - Brightened theme colors in `themes.js`
  - Increased visibility of background elements in `backgrounds.js`
- **Spec Improvement**: 
  - Always clear canvas at start of render frame
  - Use sufficiently bright/visible colors for background elements
  - Test background visibility with actual rendering

### Feature: Parchment-style map background
- **File**: `rendering/backgrounds.js`
- **Issue**: Map background was a dark transparent overlay that was hard to see; path lines were dark grey on dark blue
- **Fix**:
  - Replaced transparent overlay with proper parchment-style background
  - Added torn/irregular edges using sinusoidal displacement for scroll-like appearance
  - Applied parchment gradient (`#d9c9a9` to `#cbb898`)
  - Changed path colors to brown tones (`#8b7355` unvisited, `#5a4a3a` visited) for contrast
  - Removed fog effect from map screen (moving ellipses)
- **Spec Improvement**: 
  - Map background should use parchment/scroll styling with torn edges
  - Path colors should be brown/tan to contrast with parchment
  - Fog effects should not be drawn on map screen

### Feature: Dynamic map node positioning
- **File**: `systems/map.js`, `game.js`
- **Issue**: Fixed 3-column grid could create unreachable nodes; spacing was static
- **Fix**:
  - Changed to lane-based system with 4 fixed lanes (like Slay the Spire)
  - Nodes occupy lanes (0-3) and connect only to adjacent lanes (±1)
  - Each row has 2-4 nodes placed in random lanes
  - `getLaneX(lane, margin, laneSpacing)` calculates x position for a lane
  - Nodes connect to nodes in adjacent lanes only, creating branching paths
  - Two independent branches can exist (e.g., left nodes in lanes 0-1, right in lanes 2-3)
- **Spec Improvement**:
  - Map uses 4 fixed lanes for positioning
  - Nodes connect only to adjacent lanes (±1)
  - Each row has 2-4 nodes in random lanes
  - `getLaneX()` converts lane number to x coordinate

### Bug Fix: Missing `CARDS.getByRarity` function
- **File**: `data/cards.js`
- **Issue**: `game.js:1046` called `CARDS.getByRarity()` which didn't exist (similar to RELICS fix)
- **Fix**: Added `getByRarity(rarity)` method to CARDS object, returning `this.byRarity[rarity] || []`
- **Spec Improvement**: Both `CARDS` and `RELICS` data objects should have:
  - `get(name)` - get item by name
  - `getByRarity(rarity)` - get array of items by rarity
  - `getRandom(rarity)` - get random item (optionally filtered by rarity)

### Feature: Treasure result screen
- **File**: `game.js`, `rendering/ui.js`
- **Issue**: Clicking treasure chest on map immediately gave rewards with no feedback
- **Fix**:
  - Added `treasureResult` property to game state
  - Added `STATES.TREASURE` state with `updateTreasure()`, `renderTreasure()`, `handleTreasureClick()`
  - Modified `handleTreasure()` to set `treasureResult` and switch to TREASURE state
  - Added `drawTreasureResult()` to UI showing gold, relics, and cards obtained
- **Spec Improvement**: Treasure nodes should:
  - Display a result screen showing all rewards obtained
  - Show gold amount, relic names, and card names
  - Have a "Continue" button to return to map

### Feature: Relic and Potion tooltips in shop
- **File**: `game.js`, `rendering/ui.js`
- **Issue**: Relics and potions in shop showed no information about what they do
- **Fix**:
  - Added `drawItemTooltip(name, description, nameColor, x, y)` function to UI
  - When hovering over relic or potion in shop, shows tooltip with name, description, and rarity color
  - Rarity colors: rare (purple), uncommon (blue), common (white)
- **Spec Improvement**: Shop items should show tooltips on hover with:
  - Item name colored by rarity
  - Description text wrapped to fit
  - Positioned near mouse cursor

### Feature: Persistent player bar with relics and potions
- **File**: `game.js`
- **Issue**: No way to see owned relics and potions during gameplay
- **Fix**:
  - Added `renderPlayerBar()` function that draws a bar at top of screen
  - Shows all owned relics on the left side
  - Shows all owned potions on the right side
  - Hovering over items shows tooltip with name and description
  - Bar is rendered on all game screens (map, combat, shop, rest, event, treasure)
  - Bar has semi-transparent background with gold accent line
- **Spec Improvement**: Player should always see their relics and potions:
  - Persistent bar at top of screen (50px height)
  - Relics displayed left-aligned, potions right-aligned
  - Hover tooltips show item details
  - Never blocked by other UI elements

### Bug Fix: Relic and Potion sprite positioning in shop
- **File**: `game.js`
- **Issue**: Relic and potion sprites were offset from their click hitboxes
- **Fix**:
  - Added offset to sprite draw calls to center sprites within hitbox
  - Relics: `x + 12` offset
  - Potions: `x + 8` offset
- **Spec Improvement**: Sprite draw positions should match hitbox positions

### UI Fix: Shop layout positioning
- **File**: `game.js`
- **Issue**: Relics and potions positioned too high, overlapping with cards
- **Fix**:
  - Moved relics section down: title y=280→320, sprites y=300→340
  - Moved potions section down: title y=410→450, sprites y=430→470
  - Moved Remove Card button: y=520→560
  - Updated hover detection coordinates to match
- **Spec Improvement**: Shop layout should have proper vertical spacing between sections

### UI Fix: View Deck button blocked by player bar
- **File**: `game.js`
- **Issue**: View Deck button at y=10 was behind the player bar
- **Fix**: Moved View Deck button to y=55 (below the 50px player bar)
- **Spec Improvement**: UI buttons should be positioned below the player bar

### Bug Fix: Map dead end nodes
- **File**: `systems/map.js`
- **Issue**: Map generation could create nodes with no outgoing connections (dead ends)
- **Fix**: Added third pass in `connectNodes()` to ensure every node has at least one outgoing connection
- **Spec Improvement**: Map generation must guarantee all nodes are reachable and have paths forward

### Bug Fix: Player health bar not updating in combat
- **File**: `game.js`
- **Issue**: `drawPlayerPanel()` used `this.player` instead of `Combat.state.player`, so HP/block didn't update during combat
- **Fix**: Changed `renderCombat()` to pass a merged object combining `Combat.state.player` (HP, block, energy, buffs) with `Game.player` (gold, relics, potions)
- **Spec Improvement**: Combat UI should use `Combat.state.player` for live combat stats, but merge with `Game.player` for persistent data like gold/relics

### Bug Fix: Enemy block resetting each turn
- **File**: `systems/combat.js`
- **Issue**: Enemy block was reset to 0 at start of player turn, should persist until broken
- **Fix**: Removed `enemy.block = 0` from `startNewTurn()` - block now persists until damage breaks it
- **Spec Improvement**: Enemy block should persist between turns, only reduced when taking damage

### Feature: Visible enemy turn phase
- **File**: `systems/combat.js`, `game.js`, `rendering/ui.js`
- **Issue**: Enemy turn executed instantly with no visual feedback
- **Fix**:
  - Added `enemyActionQueue` and `currentEnemyAction` to combat state
  - Added `processNextEnemyAction()` and `updateEnemyActions()` for phased execution
  - Added `isActing` parameter to `drawEnemy()` showing red glow on acting enemy
  - Added action text display (e.g., "Cultist: Attacking for 6")
  - End Turn button disabled during enemy phase
  - 800ms delay between enemy actions
- **Spec Improvement**: Enemy turn should be visible:
  - Each enemy action shows with visual feedback
  - Red glow on currently acting enemy
  - Action description text displayed
  - Player cannot act during enemy phase

### UI Improvement: Standardized enemy HP bars with block display
- **File**: `rendering/ui.js`
- **Issue**: Enemy HP bars had different widths based on sprite size; block was a tiny separate bar
- **Fix**:
  - All enemy HP bars now fixed 80px width, centered under sprite
  - Block displays as blue/grey bar behind HP bar, sized by percentage of max HP
  - Block value text (`🛡X`) shown above HP bar
  - Block bar has light blue outline to distinguish from HP
- **Spec Improvement**: Enemy HP/block display:
  - Fixed 80px width for all enemies
  - HP bar shows percentage of current/max HP
  - Block bar (when >0) shows behind HP, sized as block/maxHp percentage
  - Block text shows exact value above bar

### UI Improvement: Enemy positioning in combat
- **File**: `game.js`
- **Issue**: Enemies were bunched up near top of screen with tight spacing
- **Fix**:
  - Moved enemy y-position from 150 to 200 (down 50px)
  - Increased enemy spacing from 20px to 50px between sprites
- **Spec Improvement**: Enemy positioning should:
  - Position enemies at y=200 for better vertical centering
  - Use 50px spacing between enemies for less cramped layout

### Feature: Enemy attack animations
- **File**: `systems/combat.js`, `rendering/ui.js`, `game.js`
- **Issue**: Enemy turn executed instantly with no visual feedback; only first enemy's damage seemed to apply
- **Fix**:
  - Added `animation` property to each enemy with `{ type, offsetX, offsetY }`
  - Three-phase animation: windup (pull back), strike (lunge forward), recover (return to idle)
  - Attack animation: enemy pulls back (-40px), then lunges forward (+40px from start)
  - Block animation: enemy crouches down (+20px) then rises up (-10px from start)
  - Animation offsets applied to sprite and HP bar rendering
  - 800ms total animation time per enemy action
  - Capped deltaTime at 100ms in game loop to prevent first-frame animation skips
- **Spec Improvement**: Enemy actions should have visible animations:
  - Windup phase (200ms): Enemy pulls back
  - Strike phase (150ms): Enemy lunges forward, damage applied
  - Recover phase (450ms): Enemy returns to idle position
  - Each enemy animates sequentially in turn order
  - deltaTime capped to prevent animation timing issues

### Feature: Enemy steal mechanic
- **File**: `systems/combat.js`, `data/enemies.js`
- **Issue**: `steal` action type existed in enemy movesets but had no implementation
- **Fix**:
  - Added `steal` case in `executeEnemyAction()` that deducts gold from player and tracks it on enemy
  - Added `attackAndSteal` case for Mimic's combo attack
  - Modified `onEnemyDeath()` to return stolen gold when enemy is killed
  - Removed steal from Goblin Scout (too annoying for early game), kept only on Mimic
- **Spec Improvement**: Enemy steal mechanic:
  - `steal` action: Takes gold from player, tracked via `enemy.stolenGold`
  - `attackAndSteal` action: Damage + steal in one move
  - Killing enemy returns all stolen gold to player
  - Only Mimic has steal moves (Act 2) to avoid early-game frustration
