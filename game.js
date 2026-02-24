const Game = {
    STATES: {
        MENU: 'menu',
        HOW_TO_PLAY: 'howToPlay',
        MAP: 'map',
        COMBAT: 'combat',
        REWARD: 'reward',
        SHOP: 'shop',
        REST: 'rest',
        EVENT: 'event',
        TREASURE: 'treasure',
        GAME_OVER: 'gameOver',
        VICTORY: 'victory'
    },
    
    state: null,
    previousState: null,
    act: 1,
    maxActs: 3,
    
    player: null,
    map: null,
    shop: null,
    currentEvent: null,
    eventResult: null,
    treasureResult: null,
    arenaRewards: null,
    currentRewards: null,
    restSubState: null,
    viewingDeck: false,
    pendingAction: null,
    
    mouse: { x: 0, y: 0 },
    hoveredCard: null,
    selectedCard: null,
    hoveredEnemy: null,
    selectedEnemy: null,
    hoveredButton: null,
    hoveredMapNode: null,
    
    lastTime: 0,
    deltaTime: 0,
    
    init() {
        UI.init();
        this.state = this.STATES.MENU;
        this.setupEventListeners();
        this.gameLoop();
    },
    
    setupEventListeners() {
        const canvas = UI.canvas;
        
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.handleMouseMove();
        });
        
        canvas.addEventListener('click', (e) => {
            this.handleClick();
        });
        
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.handleRightClick();
        });
    },
    
    gameLoop(timestamp = 0) {
        this.deltaTime = Math.min(timestamp - this.lastTime, 100);
        this.lastTime = timestamp;
        
        Animations.update();
        Backgrounds.update(this.deltaTime);
        Particles.update(this.deltaTime);
        this.update();
        this.render();
        
        requestAnimationFrame((t) => this.gameLoop(t));
    },
    
    update() {
        switch (this.state) {
            case this.STATES.MENU:
                this.updateMenu();
                break;
            case this.STATES.HOW_TO_PLAY:
                this.updateHowToPlay();
                break;
            case this.STATES.MAP:
                this.updateMap();
                break;
            case this.STATES.COMBAT:
                this.updateCombat();
                break;
            case this.STATES.SHOP:
                this.updateShop();
                break;
            case this.STATES.REWARD:
                this.updateReward();
                break;
            case this.STATES.REST:
                this.updateRest();
                break;
            case this.STATES.EVENT:
                this.updateEvent();
                break;
            case this.STATES.TREASURE:
                this.updateTreasure();
                break;
            case this.STATES.GAME_OVER:
            case this.STATES.VICTORY:
                this.updateGameOver();
                break;
        }
    },
    
    render() {
        UI.ctx.clearRect(0, 0, UI.width, UI.height);
        
        switch (this.state) {
            case this.STATES.MENU:
                UI.drawMainMenu(this.hoveredButton);
                break;
            case this.STATES.HOW_TO_PLAY:
                UI.drawHowToPlay(this.hoveredButton);
                break;
            case this.STATES.MAP:
                UI.drawEnvironment('map', this.act);
                this.renderMap();
                this.renderPlayerBar();
                break;
            case this.STATES.COMBAT:
                UI.drawEnvironment('combat', this.act);
                this.renderCombat();
                this.renderPlayerBar();
                break;
            case this.STATES.SHOP:
                UI.drawEnvironment('shop', this.act);
                this.renderShop();
                this.renderPlayerBar();
                break;
            case this.STATES.REWARD:
                UI.drawEnvironment('combat', this.act);
                this.renderReward();
                this.renderPlayerBar();
                break;
            case this.STATES.REST:
                UI.drawEnvironment('rest', this.act);
                this.renderRest();
                this.renderPlayerBar();
                break;
            case this.STATES.EVENT:
                UI.drawEnvironment('event', this.act);
                this.renderEvent();
                this.renderPlayerBar();
                break;
            case this.STATES.TREASURE:
                this.renderTreasure();
                this.renderPlayerBar();
                break;
            case this.STATES.GAME_OVER:
            case this.STATES.VICTORY:
                UI.drawGameOverScreen(this.state === this.STATES.VICTORY, this.hoveredButton);
                break;
        }
        
        Particles.draw(UI.ctx, UI.width, UI.height);
        Animations.render(UI.ctx);
    },
    
    hoveredBarItem: null,
    
    renderPlayerBar() {
        if (!this.player) return;
        
        const barHeight = 50;
        const barY = 0;
        
        UI.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        UI.ctx.fillRect(0, barY, UI.width, barHeight);
        
        UI.ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        UI.ctx.lineWidth = 1;
        UI.ctx.beginPath();
        UI.ctx.moveTo(0, barHeight);
        UI.ctx.lineTo(UI.width, barHeight);
        UI.ctx.stroke();
        
        const relicStartX = 10;
        const relicY = 10;
        this.hoveredBarItem = null;
        
        for (let i = 0; i < this.player.relics.length; i++) {
            const relicName = this.player.relics[i];
            const relic = RELICS.get(relicName);
            if (relic) {
                const x = relicStartX + i * 30;
                Sprites.drawRelic(UI.ctx, x + 4, relicY, relic, 1.5);
                
                if (this.mouse.x >= x && this.mouse.x < x + 24 && this.mouse.y >= relicY && this.mouse.y < relicY + 24) {
                    this.hoveredBarItem = { type: 'relic', item: relic, x: x, y: relicY };
                }
            }
        }
        
        const potionStartX = UI.width - 10 - (this.player.potions.length * 30);
        const potionY = 10;
        
        for (let i = 0; i < this.player.potions.length; i++) {
            const potion = this.player.potions[i];
            if (potion) {
                const x = potionStartX + i * 30;
                Sprites.drawPotion(UI.ctx, x + 4, potionY, potion, 1.5);
                
                if (this.mouse.x >= x && this.mouse.x < x + 24 && this.mouse.y >= potionY && this.mouse.y < potionY + 24) {
                    this.hoveredBarItem = { type: 'potion', item: potion, x: x, y: potionY };
                }
            }
        }
        
        if (this.hoveredBarItem) {
            const item = this.hoveredBarItem.item;
            const tooltipX = Math.min(this.mouse.x + 15, UI.width - 200);
            const tooltipY = 55;
            const rarityColor = item.rarity === 'rare' ? '#aa44ff' : item.rarity === 'uncommon' ? '#4488ff' : '#ffffff';
            UI.drawItemTooltip(item.name, item.description, rarityColor, tooltipX, tooltipY);
        }
    },
    
    startNewGame() {
        this.act = 1;
        this.player = this.createPlayer();
        this.map = Map.generate(this.act);
        this.state = this.STATES.MAP;
    },
    
    createPlayer() {
        const deck = [];
        STARTING_DECK.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                const card = createCardInstance(item.name);
                if (card) deck.push(card);
            }
        });
        
        return {
            name: 'Hero',
            hp: 80,
            maxHp: 80,
            gold: 99,
            deck: deck,
            drawPile: [],
            discardPile: [],
            relics: [],
            potions: [],
            strength: 0,
            dexterity: 0,
            maxEnergy: 3,
            timesRemoved: 0
        };
    },
    
    updateMenu() {
        const centerX = UI.width / 2;
        const centerY = UI.height / 2;
        
        const newGameBtn = { x: centerX - 100, y: centerY - 30, w: 200, h: 50 };
        const howToBtn = { x: centerX - 100, y: centerY + 40, w: 200, h: 50 };
        
        this.hoveredButton = null;
        
        if (this.isInRect(this.mouse, newGameBtn)) {
            this.hoveredButton = 'newGame';
        } else if (this.isInRect(this.mouse, howToBtn)) {
            this.hoveredButton = 'howToPlay';
        }
    },
    
    updateHowToPlay() {
        const backBtn = { x: UI.width / 2 - 60, y: UI.height - 80, w: 120, h: 40 };
        this.hoveredButton = this.isInRect(this.mouse, backBtn) ? 'back' : null;
    },
    
    updateMap() {
        this.hoveredButton = null;
        this.hoveredMapNode = null;
        
        if (this.viewingDeck) {
            const closeBtn = { x: UI.width / 2 - 60, y: UI.height - 80, w: 120, h: 40 };
            if (this.isInRect(this.mouse, closeBtn)) {
                this.hoveredButton = 'closeDeck';
            }
            return;
        }
        
        const deckBtn = { x: UI.width - 110, y: 55, w: 100, h: 30 };
        if (this.isInRect(this.mouse, deckBtn)) {
            this.hoveredButton = 'viewDeck';
            return;
        }
        
        const available = Map.getAvailableNodes(this.map);
        
        const nodeRadius = 20;
        const floorHeight = UI.height / (this.map.floors.length + 1);
        const margin = 200;
        const usableWidth = UI.width - margin * 2;
        const laneSpacing = usableWidth / (Map.LANES - 1);
        
        for (let floor = 0; floor < this.map.floors.length; floor++) {
            const row = this.map.floors[floor];
            const y = UI.height - (floor + 1) * floorHeight;
            
            for (const node of row) {
                if (!node) continue;
                
                const nodeX = Map.getLaneX(node.lane, margin, laneSpacing);
                
                if (this.isInCircle(this.mouse, { x: nodeX, y }, nodeRadius)) {
                    if (available.some(n => n.id === node.id)) {
                        this.hoveredMapNode = node;
                    }
                }
            }
        }
    },
    
    updateCombat() {
        if (!Combat.state || Combat.state.isOver) return;
        
        Combat.updateEnemyActions(this.deltaTime);
        
        this.hoveredCard = null;
        this.hoveredEnemy = null;
        this.hoveredIntent = null;
        this.hoveredButton = null;
        
        if (Combat.state.pendingAction) {
            const centerX = UI.width / 2;
            const pending = Combat.state.pendingAction;
            const canConfirm = pending.selectedCards.length === pending.count;
            
            if (this.isInRect(this.mouse, { x: centerX - 130, y: UI.height - 80, w: 120, h: 40 }) && canConfirm) {
                this.hoveredButton = 'confirmDiscard';
            }
            if (this.isInRect(this.mouse, { x: centerX + 10, y: UI.height - 80, w: 120, h: 40 })) {
                this.hoveredButton = 'cancelDiscard';
            }
            
            const hand = Combat.state.hand;
            const cardWidth = 120;
            const cardHeight = 160;
            const overlap = 80;
            const totalWidth = (hand.length - 1) * overlap + cardWidth;
            const startX = (UI.width - totalWidth) / 2;
            const baseY = UI.height / 2 - 80;
            
            for (let i = hand.length - 1; i >= 0; i--) {
                const x = startX + i * overlap;
                const y = baseY;
                if (this.isInRect(this.mouse, { x, y, w: cardWidth, h: cardHeight })) {
                    this.hoveredCard = hand[i];
                    break;
                }
            }
            return;
        }
        
        const hand = Combat.state.hand;
        const cardWidth = 120;
        const cardHeight = 160;
        const overlap = 80;
        const totalWidth = (hand.length - 1) * overlap + cardWidth;
        const startX = (UI.width - totalWidth) / 2;
        const baseY = UI.height - cardHeight - 20;
        
        for (let i = hand.length - 1; i >= 0; i--) {
            const x = startX + i * overlap;
            const y = baseY;
            
            if (this.isInRect(this.mouse, { x, y, w: cardWidth, h: cardHeight })) {
                this.hoveredCard = hand[i];
                break;
            }
        }
        
        const enemies = Combat.state.enemies.filter(e => e.hp > 0);
        
        const enemySpacing = 50;
        let enemyTotalWidth = 0;
        const enemySizes = enemies.map(enemy => {
            const size = UI.getEnemySpriteSize(enemy) * (enemy.isBoss ? 1 : (enemy.size || 1));
            enemyTotalWidth += size + enemySpacing;
            return size;
        });
        enemyTotalWidth -= enemySpacing;
        
        const enemyStartX = (UI.width - enemyTotalWidth) / 2;
        
        let offsetX = 0;
        enemies.forEach((enemy, i) => {
            const size = enemySizes[i];
            const x = enemyStartX + offsetX;
            const y = 200;
            
            if (this.isInRect(this.mouse, { x, y, w: size, h: size })) {
                this.hoveredEnemy = enemy;
            }
            
            if (enemy.intent) {
                const intentW = 52;
                const intentH = 32;
                const intentX = x + size / 2 - intentW / 2;
                const intentY = y - 30 - intentH / 2;
                if (this.isInRect(this.mouse, { x: intentX, y: intentY, w: intentW, h: intentH })) {
                    this.hoveredIntent = enemy;
                }
            }
            
            offsetX += size + enemySpacing;
        });
        
        const endTurnBtn = { x: UI.width - 150, y: UI.height / 2 - 25, w: 120, h: 50 };
        if (this.isInRect(this.mouse, endTurnBtn)) {
            this.hoveredButton = 'endTurn';
        }
    },
    
    updateShop() {
        this.hoveredButton = null;
        this.hoveredCard = null;
        
        if (!this.shop) return;
        
        if (this.shop.removeMode) {
            const deck = this.player.deck;
            const centerX = UI.width / 2;
            const padding = 50;
            const cardSpacing = 130;
            const cardsPerRow = Math.max(1, Math.floor((UI.width - padding * 2) / cardSpacing));
            const startX = padding;
            const startY = 100;
            
            for (let i = deck.length - 1; i >= 0; i--) {
                const row = Math.floor(i / cardsPerRow);
                const col = i % cardsPerRow;
                const x = startX + col * cardSpacing;
                const y = startY + row * 180;
                if (this.isInRect(this.mouse, { x, y, w: 96, h: 128 })) {
                    this.hoveredCard = deck[i];
                    break;
                }
            }
            
            if (this.selectedCard) {
                if (this.isInRect(this.mouse, { x: centerX - 130, y: UI.height - 80, w: 120, h: 40 })) {
                    this.hoveredButton = 'confirmRemove';
                }
            }
            
            if (this.isInRect(this.mouse, { x: centerX + 10, y: UI.height - 80, w: 120, h: 40 })) {
                this.hoveredButton = 'cancel';
            }
            return;
        }
        
        const centerX = UI.width / 2;
        
        if (this.shop.cards) {
            const availableCards = this.shop.cards.filter(c => !c.sold);
            const cardStartX = centerX - (availableCards.length * 65);
            const cardY = 100;
            
            let cardIndex = 0;
            this.shop.cards.forEach((item, i) => {
                if (item.sold) return;
                const x = cardStartX + cardIndex * 130;
                if (this.isInRect(this.mouse, { x, y: cardY, w: 96, h: 128 })) {
                    this.hoveredCard = { type: 'card', cardIndex: i, item };
                }
                cardIndex++;
            });
        }
        
        if (this.shop.relics) {
            const availableRelics = this.shop.relics.filter(r => !r.sold);
            const relicStartX = centerX - (availableRelics.length * 60);
            this.shop.relics.forEach((item, i) => {
                if (item.sold) return;
                const x = relicStartX + i * 120;
                if (this.isInRect(this.mouse, { x, y: 340, w: 48, h: 48 })) {
                    this.hoveredCard = { type: 'relic', relicIndex: i, item };
                }
            });
        }
        
        if (this.shop.potions) {
            const availablePotions = this.shop.potions.filter(p => !p.sold);
            const potionStartX = centerX - (availablePotions.length * 40);
            this.shop.potions.forEach((item, i) => {
                if (item.sold) return;
                const x = potionStartX + i * 80;
                if (this.isInRect(this.mouse, { x, y: 470, w: 32, h: 36 })) {
                    this.hoveredCard = { type: 'potion', potionIndex: i, item };
                }
            });
        }
        
        if (this.shop.removeCost !== undefined) {
            const removeCost = this.shop.removeCost;
            const canRemove = !this.shop.removeUsed && this.player.gold >= removeCost && this.player.deck.length > 0;
            if (canRemove && this.isInRect(this.mouse, { x: centerX - 90, y: 560, w: 180, h: 40 })) {
                this.hoveredButton = 'removeCard';
            }
        }
        
        if (this.isInRect(this.mouse, { x: centerX - 60, y: UI.height - 60, w: 120, h: 40 })) {
            this.hoveredButton = 'leave';
        }
    },
    
    updateReward() {
        this.hoveredCard = null;
        this.hoveredButton = null;
        
        if (!this.currentRewards) return;
        
        const centerX = UI.width / 2;
        const startY = 210;
        const cardWidth = 120;
        const totalWidth = this.currentRewards.cards.length * (cardWidth + 20);
        const startX = centerX - totalWidth / 2;
        
        this.currentRewards.cards.forEach((card, i) => {
            const x = startX + i * (cardWidth + 20);
            if (this.isInRect(this.mouse, { x, y: startY + 100, w: cardWidth, h: 160 })) {
                this.hoveredCard = { card, index: i };
            }
        });
        
        if (this.isInRect(this.mouse, { x: centerX - 60, y: UI.height - 100, w: 120, h: 40 })) {
            this.hoveredButton = 'skip';
        }
    },
    
    updateRest() {
        this.hoveredButton = null;
        this.hoveredCard = null;
        const centerX = UI.width / 2;
        
        if (this.restSubState === 'upgrade') {
            const upgradeable = this.player.deck.filter(c => !c.upgraded);
            const cardWidth = 120;
            const overlap = 80;
            const totalWidth = (upgradeable.length - 1) * overlap + cardWidth;
            const startX = (UI.width - totalWidth) / 2;
            const baseY = UI.height / 2 - 80;
            
            for (let i = 0; i < upgradeable.length; i++) {
                const x = startX + i * overlap;
                const y = baseY;
                if (this.isInRect(this.mouse, { x, y, w: cardWidth, h: 160 })) {
                    this.hoveredCard = upgradeable[i];
                }
            }
            
            if (this.selectedCard) {
                if (this.isInRect(this.mouse, { x: centerX - 130, y: UI.height - 100, w: 120, h: 40 })) {
                    this.hoveredButton = 'confirmUpgrade';
                }
            }
            
            if (this.isInRect(this.mouse, { x: centerX + 10, y: UI.height - 100, w: 120, h: 40 })) {
                this.hoveredButton = 'cancel';
            }
        } else {
            if (this.isInRect(this.mouse, { x: centerX - 150, y: 250, w: 300, h: 50 })) {
                this.hoveredButton = 'rest';
            }
            if (this.isInRect(this.mouse, { x: centerX - 150, y: 320, w: 300, h: 50 })) {
                this.hoveredButton = 'upgrade';
            }
        }
    },
    
    updateEvent() {
        this.hoveredButton = null;
        
        if (!this.currentEvent) return;
        
        if (this.eventResult) {
            const continueBtn = { x: UI.width / 2 - 75, y: 400, w: 150, h: 50 };
            if (this.isInRect(this.mouse, continueBtn)) {
                this.hoveredButton = 'continue';
            }
            return;
        }
        
        const centerX = UI.width / 2;
        const event = this.currentEvent.event;
        
        if (event.choices) {
            event.choices.forEach((choice, i) => {
                const y = 320 + i * 60;
                if (this.isInRect(this.mouse, { x: centerX - 200, y, w: 400, h: 50 })) {
                    this.hoveredButton = `choice-${i}`;
                }
            });
        }
    },
    
    updateGameOver() {
        const mainMenuBtn = { x: UI.width / 2 - 75, y: UI.height / 2 + 50, w: 150, h: 50 };
        this.hoveredButton = this.isInRect(this.mouse, mainMenuBtn) ? 'mainMenu' : null;
    },
    
    updateTreasure() {
        this.hoveredButton = null;
        const continueBtn = { x: UI.width / 2 - 75, y: 400, w: 150, h: 50 };
        if (this.isInRect(this.mouse, continueBtn)) {
            this.hoveredButton = 'continue';
        }
    },
    
    renderTreasure() {
        UI.drawEnvironment('event', this.act);
        UI.drawTreasureResult(this.treasureResult, this.hoveredButton === 'continue');
    },
    
    renderMap() {
        Map.render(this.map, UI.ctx, UI.width, UI.height);
        
        UI.drawPlayerPanel(this.player, true);
        
        UI.drawButton('View Deck', UI.width - 110, 55, 100, 30, true, this.hoveredButton === 'viewDeck');
        
        if (this.viewingDeck) {
            UI.drawDeckView(this.player.deck, this.hoveredCard);
        }
        
        const available = Map.getAvailableNodes(this.map);
        if (available.length > 0) {
            UI.drawText('Select your next destination', UI.width / 2, 30, {
                align: 'center',
                font: UI.fonts.header,
                color: UI.colors.text
            });
        }
    },
    
    renderCombat() {
        if (!Combat.state) return;
        
        const combatPlayer = {
            ...Combat.state.player,
            gold: this.player.gold,
            relics: this.player.relics,
            potions: this.player.potions
        };
        UI.drawPlayerPanel(combatPlayer);
        UI.drawEnergy(Combat.state.player.energy, Combat.state.player.maxEnergy);
        UI.drawPlayerBuffs(Combat.state.player);
        
        if (Combat.state.pendingAction) {
            UI.drawDiscardSelection(
                Combat.state.hand,
                Combat.state.pendingAction,
                this.hoveredCard,
                Combat.state.pendingAction.selectedCards
            );
            return;
        }
        
        const enemies = Combat.state.enemies.filter(e => e.hp > 0);
        
        let totalWidth = 0;
        const enemySpacing = 100;
        const enemySizes = enemies.map(enemy => {
            const size = UI.getEnemySpriteSize(enemy) * (enemy.isBoss ? 1 : (enemy.size || 1));
            totalWidth += size + enemySpacing;
            return size;
        });
        totalWidth -= enemySpacing;
        
        const enemyStartX = (UI.width - totalWidth) / 2;
        
        let offsetX = 0;
        enemies.forEach((enemy, i) => {
            const size = enemySizes[i];
            const x = enemyStartX + offsetX;
            const y = 200;
            const isSelected = this.selectedEnemy && this.selectedEnemy.id === enemy.id;
            const isHovered = this.hoveredEnemy && this.hoveredEnemy.id === enemy.id;
            const isIntentHovered = this.hoveredIntent && this.hoveredIntent.id === enemy.id;
            const isTargetable = this.selectedCard && this.selectedCard.targets === 'single' && Combat.canPlayCard(this.selectedCard);
            const isActing = Combat.state.currentEnemyAction && Combat.state.currentEnemyAction.enemy.id === enemy.id;
            UI.drawEnemy(enemy, x, y, isSelected, isHovered, isIntentHovered, isTargetable, isActing);
            offsetX += size + enemySpacing;
        });
        
        UI.drawHand(Combat.state.hand, this.selectedCard, this.hoveredCard);
        UI.drawDrawPile(Combat.state.drawPile.length);
        UI.drawDiscardPile(Combat.state.discardPile.length);
        
        if (Combat.state.phase === 'enemy' && Combat.state.currentEnemyAction) {
            const action = Combat.state.currentEnemyAction;
            const actionText = this.getEnemyActionText(action.intent);
            UI.drawText(`${action.enemy.name}: ${actionText}`, UI.width / 2, 80, {
                align: 'center',
                font: UI.fonts.header,
                color: '#ff4444',
                shadow: '#000000'
            });
        }
        
        const endTurnBtn = { x: UI.width - 150, y: UI.height / 2 - 25, w: 120, h: 50 };
        const endTurnHovered = this.isInRect(this.mouse, endTurnBtn);
        const canEndTurn = Combat.state.phase === 'player';
        UI.drawButton('End Turn', endTurnBtn.x, endTurnBtn.y, endTurnBtn.w, endTurnBtn.h, canEndTurn, endTurnHovered);
        
        UI.drawCombatLog(Combat.state.combatLog, UI.width - 260, UI.height - 200, 250, 180);
        
        if (Combat.state.isOver) {
            if (Combat.state.victory) {
                this.handleCombatVictory();
            } else {
                this.state = this.STATES.GAME_OVER;
            }
        }
    },
    
    renderShop() {
        UI.drawPlayerPanel(this.player);
        
        if (this.shop && this.shop.removeMode) {
            this.renderRemoveMode();
            return;
        }
        
        UI.drawText('Shop', UI.width / 2, 30, {
            align: 'center',
            font: UI.fonts.header,
            color: UI.colors.gold
        });
        
        if (!this.shop) return;
        
        const centerX = UI.width / 2;
        
        if (this.shop.cards && this.shop.cards.length > 0) {
            const cardStartX = centerX - (this.shop.cards.filter(c => !c.sold).length * 65);
            const cardY = 100;
            
            let cardIndex = 0;
            this.shop.cards.forEach((item, i) => {
                if (item.sold) return;
                const x = cardStartX + cardIndex * 130;
                const isHovered = this.hoveredCard && this.hoveredCard.cardIndex === i && this.hoveredCard.type === 'card';
                UI.drawCard(item.card, x, cardY, 0.8, isHovered, false);
                UI.drawText(`${item.cost}g`, x + 48, cardY + 135, {
                    align: 'center',
                    font: UI.fonts.normal,
                    color: this.player.gold >= item.cost ? UI.colors.gold : '#888888'
                });
                cardIndex++;
            });
        }
        
        if (this.shop.relics && this.shop.relics.length > 0) {
            UI.drawText('Relics', centerX, 320, {
                align: 'center',
                font: UI.fonts.normal,
                color: UI.colors.text
            });
            
            const relicStartX = centerX - (this.shop.relics.filter(r => !r.sold).length * 60);
            this.shop.relics.forEach((item, i) => {
                if (item.sold) return;
                const x = relicStartX + i * 120;
                const isHovered = this.hoveredCard && this.hoveredCard.relicIndex === i && this.hoveredCard.type === 'relic';
                Sprites.drawRelic(UI.ctx, x + 12, 340, item.relic, 3);
                UI.ctx.fillStyle = isHovered ? UI.colors.gold : UI.colors.text;
                UI.ctx.font = UI.fonts.small;
                UI.ctx.textAlign = 'center';
                UI.ctx.fillText(item.relic.name, x + 24, 400);
                UI.ctx.fillStyle = this.player.gold >= item.cost ? UI.colors.gold : '#888888';
                UI.ctx.fillText(`${item.cost}g`, x + 24, 418);
            });
        }
        
        if (this.shop.potions && this.shop.potions.length > 0) {
            UI.drawText('Potions', centerX, 450, {
                align: 'center',
                font: UI.fonts.normal,
                color: UI.colors.text
            });
            
            const potionStartX = centerX - (this.shop.potions.filter(p => !p.sold).length * 40);
            this.shop.potions.forEach((item, i) => {
                if (item.sold) return;
                const x = potionStartX + i * 80;
                const isHovered = this.hoveredCard && this.hoveredCard.potionIndex === i && this.hoveredCard.type === 'potion';
                Sprites.drawPotion(UI.ctx, x + 8, 470, item.potion, 2);
                UI.ctx.fillStyle = this.player.gold >= item.cost ? UI.colors.gold : '#888888';
                UI.ctx.font = UI.fonts.small;
                UI.ctx.textAlign = 'center';
                UI.ctx.fillText(`${item.cost}g`, x + 16, 520);
            });
        }
        
        if (this.shop.removeCost !== undefined) {
            const removeCost = this.shop.removeCost;
            const canRemove = !this.shop.removeUsed && this.player.gold >= removeCost && this.player.deck.length > 0;
            UI.drawButton(`Remove Card (${removeCost}g)`, centerX - 90, 560, 180, 40, canRemove, this.hoveredButton === 'removeCard');
        }
        
        UI.drawButton('Leave', centerX - 60, UI.height - 60, 120, 40, true, this.hoveredButton === 'leave');
        
        if (this.hoveredCard && (this.hoveredCard.type === 'relic' || this.hoveredCard.type === 'potion')) {
            const item = this.hoveredCard.item;
            if (item) {
                const tooltipX = Math.min(this.mouse.x + 20, UI.width - 200);
                const tooltipY = Math.min(this.mouse.y - 10, UI.height - 80);
                const name = item.relic ? item.relic.name : item.potion.name;
                const desc = item.relic ? item.relic.description : item.potion.description;
                const rarity = item.relic ? item.relic.rarity : item.potion.rarity;
                const rarityColor = rarity === 'rare' ? '#aa44ff' : rarity === 'uncommon' ? '#4488ff' : '#ffffff';
                UI.drawItemTooltip(name, desc, rarityColor, tooltipX, tooltipY);
            }
        }
    },
    
    renderRemoveMode() {
        const centerX = UI.width / 2;
        
        UI.drawText('Select a card to remove', centerX, 50, {
            align: 'center',
            font: UI.fonts.header,
            color: UI.colors.gold
        });
        
        const deck = this.player.deck;
        const padding = 50;
        const cardSpacing = 130;
        const cardsPerRow = Math.max(1, Math.floor((UI.width - padding * 2) / cardSpacing));
        const startX = padding;
        const startY = 100;
        
        deck.forEach((card, i) => {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            const x = startX + col * cardSpacing;
            const y = startY + row * 180;
            const isHovered = this.hoveredCard && this.hoveredCard.id === card.id;
            const isSelected = this.selectedCard && this.selectedCard.id === card.id;
            UI.drawCard(card, x, y, 0.8, isHovered, false);
            if (isSelected) {
                UI.ctx.strokeStyle = '#ff4444';
                UI.ctx.lineWidth = 3;
                UI.ctx.strokeRect(x - 2, y - 2, 100, 132);
            }
        });
        
        if (this.selectedCard) {
            UI.drawButton('Confirm Remove', centerX - 130, UI.height - 80, 120, 40, true, this.hoveredButton === 'confirmRemove');
        }
        
        UI.drawButton('Cancel', centerX + 10, UI.height - 80, 120, 40, true, this.hoveredButton === 'cancel');
    },
    
    renderReward() {
        if (!this.currentRewards) return;
        
        const skipHovered = this.hoveredButton === 'skip';
        UI.drawRewardScreen(this.currentRewards, this.hoveredCard ? this.hoveredCard.index : (skipHovered ? -2 : -1));
    },
    
    renderRest() {
        const centerX = UI.width / 2;
        
        if (this.restSubState === 'upgrade') {
            UI.drawText('Select a card to upgrade', centerX, 80, {
                align: 'center',
                font: UI.fonts.header,
                color: UI.colors.gold
            });
            
            const upgradeable = this.player.deck.filter(c => !c.upgraded);
            
            if (upgradeable.length === 0) {
                UI.drawText('No cards available to upgrade', centerX, UI.height / 2, {
                    align: 'center',
                    font: UI.fonts.normal,
                    color: UI.colors.textDim
                });
            } else {
                const cardWidth = 120;
                const overlap = 80;
                const totalWidth = (upgradeable.length - 1) * overlap + cardWidth;
                const startX = (UI.width - totalWidth) / 2;
                const baseY = UI.height / 2 - 80;
                
                for (let i = 0; i < upgradeable.length; i++) {
                    const card = upgradeable[i];
                    const x = startX + i * overlap;
                    const y = baseY;
                    const isHovered = this.hoveredCard && this.hoveredCard.id === card.id;
                    const isSelected = this.selectedCard && this.selectedCard.id === card.id;
                    UI.drawCard(card, x, isHovered ? y - 20 : y, 1, isHovered, false);
                    if (isSelected) {
                        UI.ctx.strokeStyle = '#44ff44';
                        UI.ctx.lineWidth = 3;
                        UI.ctx.strokeRect(x - 2, y - 22, cardWidth + 4, 164);
                    }
                }
            }
            
            if (this.selectedCard) {
                UI.drawUpgradePreview(this.selectedCard, centerX, UI.height - 200);
                UI.drawButton('Confirm', centerX - 130, UI.height - 100, 120, 40, true, this.hoveredButton === 'confirmUpgrade');
            }
            
            UI.drawButton('Cancel', centerX + 10, UI.height - 100, 120, 40, true, this.hoveredButton === 'cancel');
        } else {
            UI.drawRestScreen(this.hoveredButton);
        }
    },
    
    renderEvent() {
        if (!this.currentEvent) return;
        
        if (this.eventResult) {
            UI.drawEventResult(this.eventResult, this.hoveredButton === 'continue');
        } else {
            UI.drawEventScreen(this.currentEvent.event, this.hoveredButton ? parseInt(this.hoveredButton.split('-')[1]) : -1);
        }
    },
    
    handleClick() {
        switch (this.state) {
            case this.STATES.MENU:
                this.handleMenuClick();
                break;
            case this.STATES.HOW_TO_PLAY:
                this.handleHowToPlayClick();
                break;
            case this.STATES.MAP:
                this.handleMapClick();
                break;
            case this.STATES.COMBAT:
                this.handleCombatClick();
                break;
            case this.STATES.SHOP:
                this.handleShopClick();
                break;
            case this.STATES.REWARD:
                this.handleRewardClick();
                break;
            case this.STATES.REST:
                this.handleRestClick();
                break;
            case this.STATES.EVENT:
                this.handleEventClick();
                break;
            case this.STATES.TREASURE:
                this.handleTreasureClick();
                break;
            case this.STATES.GAME_OVER:
            case this.STATES.VICTORY:
                this.handleGameOverClick();
                break;
        }
    },
    
    handleMenuClick() {
        if (this.hoveredButton === 'newGame') {
            this.startNewGame();
        } else if (this.hoveredButton === 'howToPlay') {
            this.state = this.STATES.HOW_TO_PLAY;
        }
    },
    
    handleHowToPlayClick() {
        const backBtn = { x: UI.width / 2 - 60, y: UI.height - 80, w: 120, h: 40 };
        if (this.isInRect(this.mouse, backBtn)) {
            this.state = this.STATES.MENU;
        }
    },
    
    handleMapClick() {
        if (this.hoveredButton === 'viewDeck') {
            this.viewingDeck = true;
            return;
        }
        
        if (this.hoveredButton === 'closeDeck') {
            this.viewingDeck = false;
            return;
        }
        
        if (this.viewingDeck) return;
        
        if (this.hoveredMapNode) {
            if (Map.selectNode(this.map, this.hoveredMapNode)) {
                this.startEncounter(this.hoveredMapNode);
            }
        }
    },
    
    handleCombatClick() {
        if (!Combat.state || Combat.state.isOver) return;
        
        if (Combat.state.pendingAction) {
            const pending = Combat.state.pendingAction;
            const centerX = UI.width / 2;
            
            if (this.hoveredButton === 'confirmDiscard' && pending.selectedCards.length === pending.count) {
                Combat.completePendingDiscard();
                return;
            }
            
            if (this.hoveredButton === 'cancelDiscard') {
                Combat.cancelPendingAction();
                return;
            }
            
            if (this.hoveredCard) {
                const cardId = this.hoveredCard.id;
                const idx = pending.selectedCards.indexOf(cardId);
                if (idx !== -1) {
                    pending.selectedCards.splice(idx, 1);
                } else if (pending.selectedCards.length < pending.count) {
                    pending.selectedCards.push(cardId);
                }
            }
            return;
        }
        
        if (this.hoveredCard) {
            if (this.selectedCard && this.selectedCard.id === this.hoveredCard.id) {
                this.selectedCard = null;
            } else {
                this.selectedCard = this.hoveredCard;
            }
            return;
        }
        
        if (this.selectedCard && this.hoveredEnemy) {
            const canPlay = Combat.canPlayCard(this.selectedCard);
            if (canPlay) {
                const success = Combat.playCard(this.selectedCard, this.hoveredEnemy);
                if (success) {
                    this.selectedCard = null;
                }
            }
            return;
        }
        
        if (this.selectedCard && !this.hoveredEnemy) {
            if (this.selectedCard.targets === 'self' || this.selectedCard.targets === 'all') {
                const success = Combat.playCard(this.selectedCard, null);
                if (success) {
                    this.selectedCard = null;
                }
            }
        }
        
        const endTurnBtn = { x: UI.width - 150, y: UI.height / 2 - 25, w: 120, h: 50 };
        if (this.isInRect(this.mouse, endTurnBtn)) {
            Combat.endPlayerTurn();
            this.selectedCard = null;
        }
    },
    
    handleShopClick() {
        if (this.hoveredButton === 'leave') {
            this.state = this.STATES.MAP;
            return;
        }
        
        if (!this.shop) return;
        
        if (this.shop.removeMode) {
            if (this.hoveredButton === 'cancel') {
                this.selectedCard = null;
                this.shop.removeMode = false;
                if (!this.shop.cards) {
                    this.shop = null;
                    this.state = this.STATES.MAP;
                }
                return;
            }
            
            if (this.hoveredButton === 'confirmRemove' && this.selectedCard) {
                const idx = this.player.deck.indexOf(this.selectedCard);
                if (idx !== -1 && Shop.removeCard(this.shop, idx)) {
                    Animations.particleBurst(UI.width / 2, UI.height / 2, 10, UI.colors.curse);
                }
                this.selectedCard = null;
                this.shop.removeMode = false;
                if (!this.shop.cards) {
                    this.shop = null;
                    this.state = this.STATES.MAP;
                }
                return;
            }
            
            if (this.hoveredCard) {
                this.selectedCard = this.hoveredCard;
            }
            return;
        }
        
        if (this.hoveredButton === 'removeCard') {
            this.shop.removeMode = true;
            return;
        }
        
        if (this.hoveredCard) {
            const { type, cardIndex, relicIndex, potionIndex, item } = this.hoveredCard;
            
            if (type === 'card' && cardIndex !== undefined && this.shop.cards) {
                if (Shop.buyCard(this.shop, cardIndex)) {
                    const availableCards = this.shop.cards.filter(c => !c.sold);
                    const centerX = UI.width / 2;
                    const cardStartX = centerX - (availableCards.length * 65);
                    const visualIndex = this.shop.cards.slice(0, cardIndex).filter(c => !c.sold).length;
                    const x = cardStartX + visualIndex * 130;
                    Animations.particleBurst(x + 48, 100 + 64, 8, UI.colors.gold);
                }
            } else if (type === 'relic' && relicIndex !== undefined && this.shop.relics) {
                if (Shop.buyRelic(this.shop, relicIndex)) {
                    const availableRelics = this.shop.relics.filter(r => !r.sold);
                    const centerX = UI.width / 2;
                    const relicStartX = centerX - (availableRelics.length * 60);
                    const visualIndex = this.shop.relics.slice(0, relicIndex).filter(r => !r.sold).length;
                    const x = relicStartX + visualIndex * 120;
                    Animations.particleBurst(x + 24, 300 + 24, 8, UI.colors.energy);
                }
            } else if (type === 'potion' && potionIndex !== undefined && this.shop.potions) {
                if (Shop.buyPotion(this.shop, potionIndex)) {
                    const availablePotions = this.shop.potions.filter(p => !p.sold);
                    const centerX = UI.width / 2;
                    const potionStartX = centerX - (availablePotions.length * 40);
                    const visualIndex = this.shop.potions.slice(0, potionIndex).filter(p => !p.sold).length;
                    const x = potionStartX + visualIndex * 80;
                    Animations.particleBurst(x + 16, 430 + 18, 8, UI.colors.skill);
                }
            }
        }
    },
    
    handleRewardClick() {
        if (!this.currentRewards) return;
        
        if (this.hoveredCard) {
            Rewards.pickCard(this.currentRewards, this.hoveredCard.index);
            this.currentRewards.cards.splice(this.hoveredCard.index, 1);
            this.hoveredCard = null;
            
            if (this.currentRewards.cards.length === 0) {
                this.finishReward();
            }
            return;
        }
        
        if (this.hoveredButton === 'skip') {
            this.finishReward();
        }
    },
    
    finishReward() {
        if (this.currentRewards) {
            Rewards.claimGold(this.currentRewards);
            
            this.currentRewards.relics.forEach(relic => {
                Rewards.pickRelic(this.currentRewards, 0);
            });
            
            this.currentRewards.potions.forEach(potion => {
                Rewards.pickPotion(this.currentRewards, 0);
            });
        }
        
        this.currentRewards = null;
        
        if (this.map.currentNode.type === Map.NODE_TYPES.BOSS && Combat.state && Combat.state.victory) {
            if (this.act < this.maxActs) {
                this.act++;
                this.map = Map.generate(this.act);
                this.state = this.STATES.MAP;
            } else {
                this.state = this.STATES.VICTORY;
            }
        } else {
            this.state = this.STATES.MAP;
        }
    },
    
    handleRestClick() {
        if (this.restSubState === 'upgrade') {
            if (this.hoveredButton === 'cancel') {
                this.selectedCard = null;
                this.restSubState = null;
                return;
            }
            
            if (this.hoveredButton === 'confirmUpgrade' && this.selectedCard) {
                const idx = this.player.deck.indexOf(this.selectedCard);
                if (idx !== -1) {
                    RestSite.upgradeCard(idx);
                }
                this.selectedCard = null;
                this.restSubState = null;
                this.state = this.STATES.MAP;
                return;
            }
            
            if (this.hoveredCard) {
                this.selectedCard = this.hoveredCard;
            }
        } else {
            if (this.hoveredButton === 'rest') {
                RestSite.rest();
                this.state = this.STATES.MAP;
            } else if (this.hoveredButton === 'upgrade') {
                const upgradeable = this.player.deck.filter(c => !c.upgraded);
                if (upgradeable.length > 0) {
                    this.restSubState = 'upgrade';
                }
            }
        }
    },
    
    handleEventClick() {
        if (!this.currentEvent) return;
        
        if (this.eventResult) {
            const hasSpecialEffect = this.eventResult.effects?.some(e => 
                e.type === 'removeCardRequest' || e.type === 'teleport' || e.type === 'arena'
            );
            
            if (hasSpecialEffect) {
                for (const effect of this.eventResult.effects) {
                    if (effect.type === 'removeCardRequest') {
                        this.eventResult = null;
                        this.state = this.STATES.SHOP;
                        this.shop = { removeMode: true, removeCost: 0, removeUsed: false };
                        return;
                    }
                    if (effect.type === 'teleport') {
                        this.eventResult = null;
                        EventSystem.endEvent();
                        this.currentEvent = null;
                        if (this.map.currentFloor < this.map.floors.length - 1) {
                            this.map.currentFloor += 2;
                        }
                        this.state = this.STATES.MAP;
                        return;
                    }
                    if (effect.type === 'arena') {
                        this.eventResult = null;
                        EventSystem.endEvent();
                        this.currentEvent = null;
                        this.startArenaBattle(effect.data);
                        return;
                    }
                }
            }
            
            EventSystem.endEvent();
            this.currentEvent = null;
            this.eventResult = null;
            this.state = this.STATES.MAP;
            return;
        }
        
        if (this.hoveredButton && this.hoveredButton.startsWith('choice-')) {
            const choiceIndex = parseInt(this.hoveredButton.split('-')[1]);
            const result = EventSystem.makeChoice(choiceIndex);
            
            if (result) {
                if (result.startCombat && result.enemies) {
                    this.startCombat(result.enemies);
                    EventSystem.endEvent();
                    this.currentEvent = null;
                    this.eventResult = null;
                } else {
                    this.eventResult = result;
                }
            }
        }
    },
    
    handleTreasureClick() {
        if (this.hoveredButton === 'continue') {
            this.treasureResult = null;
            this.state = this.STATES.MAP;
        }
    },
    
    handleGameOverClick() {
        const mainMenuBtn = { x: UI.width / 2 - 75, y: UI.height / 2 + 50, w: 150, h: 50 };
        if (this.isInRect(this.mouse, mainMenuBtn)) {
            this.state = this.STATES.MENU;
        }
    },
    
    handleRightClick() {
        if (this.state === this.STATES.COMBAT) {
            this.selectedCard = null;
            this.selectedEnemy = null;
        }
    },
    
    handleMouseMove() {
        if (this.state === this.STATES.SHOP) {
            const leaveBtn = { x: UI.width / 2 - 60, y: UI.height - 80, w: 120, h: 40 };
            this.hoveredButton = this.isInRect(this.mouse, leaveBtn) ? 'leave' : this.hoveredButton;
        }
    },
    
    startEncounter(node) {
        const encounter = Map.getNodeEncounter(node, this.act);
        
        switch (encounter.type) {
            case 'battle':
            case 'elite':
            case 'boss':
                this.startCombat(encounter.enemies);
                break;
            case 'shop':
                this.shop = Shop.generate(this.act);
                this.state = this.STATES.SHOP;
                break;
            case 'rest':
                this.restSubState = null;
                this.state = this.STATES.REST;
                break;
            case 'event':
                this.currentEvent = EventSystem.startEvent(encounter.event);
                this.state = this.STATES.EVENT;
                break;
            case 'treasure':
                this.handleTreasure(encounter.rewards);
                break;
        }
    },
    
    startCombat(enemies) {
        this.player.drawPile = [...this.player.deck];
        this.player.drawPile = Random.shuffle(this.player.drawPile);
        this.player.discardPile = [];
        
        Combat.init(enemies);
        this.state = this.STATES.COMBAT;
    },
    
    startArenaBattle(arenaData) {
        const randomEnemy = ENEMIES.getRandom(this.act);
        if (!randomEnemy) {
            this.state = this.STATES.MAP;
            return;
        }
        
        const enemies = [];
        const count = arenaData.battles || 1;
        for (let i = 0; i < count; i++) {
            const enemy = createEnemyInstance(randomEnemy.name);
            if (enemy) enemies.push(enemy);
        }
        
        if (enemies.length > 0) {
            this.arenaRewards = arenaData.rewards;
            this.startCombat(enemies);
        } else {
            this.state = this.STATES.MAP;
        }
    },
    
    handleCombatVictory() {
        this.player.hp = Combat.state.player.hp;
        this.player.maxHp = Combat.state.player.maxHp;
        this.player.gold += Combat.state.player.gold || 0;
        
        if (this.arenaRewards) {
            if (this.arenaRewards.gold) this.player.gold += this.arenaRewards.gold;
            if (this.arenaRewards.relic) {
                const relic = RELICS.getByRarity(this.arenaRewards.relic)[0];
                if (relic) this.addRelic(relic);
            }
            if (this.arenaRewards.card) {
                const card = CARDS.getByRarity(this.arenaRewards.card);
                if (card && card.length > 0) {
                    this.player.deck.push(createCardInstance(card[0].name));
                }
            }
            this.arenaRewards = null;
        }
        
        this.currentRewards = Rewards.generate(true, Combat.state.enemies, this.act);
        this.state = this.STATES.REWARD;
    },
    
    getEnemyActionText(intent) {
        if (!intent) return 'Unknown';
        switch (intent.type) {
            case 'attack': return `Attacking for ${intent.damage}`;
            case 'attackAll': return `Attacking all for ${intent.damage}`;
            case 'block': return `Gaining ${intent.value} block`;
            case 'buff': return `Gaining ${intent.value} ${intent.stat}`;
            case 'debuff': return `Applying ${intent.status}`;
            case 'heal': return `Healing ${intent.value}`;
            case 'summon': return `Summoning ${intent.enemy}`;
            default: return intent.type;
        }
    },
    
    handleTreasure(rewards) {
        this.player.gold += rewards.gold;
        
        const obtainedRelics = [];
        const obtainedCards = [];
        
        if (rewards.relics.length > 0) {
            rewards.relics.forEach(relic => {
                this.addRelic(relic);
                obtainedRelics.push(relic.name);
            });
        }
        
        if (rewards.cards.length > 0) {
            rewards.cards.forEach(card => {
                this.player.deck.push(createCardInstance(card.name));
                obtainedCards.push(card.name);
            });
        }
        
        this.treasureResult = {
            gold: rewards.gold,
            relics: obtainedRelics,
            cards: obtainedCards
        };
        
        this.state = this.STATES.TREASURE;
    },
    
    hasRelic(name) {
        return this.player && this.player.relics && this.player.relics.includes(name);
    },
    
    addRelic(relic) {
        if (!this.player.relics.includes(relic.name)) {
            this.player.relics.push(relic.name);
            
            if (relic.effect && relic.effect.type === 'maxHP') {
                this.player.maxHp += relic.effect.value;
                this.player.hp += relic.effect.value;
            }
        }
    },
    
    getMaxPotions() {
        return 3;
    },
    
    onCardPlayed(card) {
        if (this.hasRelic('Ninja Scroll') && card.type === 'attack') {
            this.player.drawPile.push(createCardInstance('Shuriken'));
        }
    },
    
    isInRect(point, rect) {
        return point.x >= rect.x && point.x <= rect.x + rect.w &&
               point.y >= rect.y && point.y <= rect.y + rect.h;
    },
    
    isInCircle(point, center, radius) {
        const dx = point.x - center.x;
        const dy = point.y - center.y;
        return dx * dx + dy * dy <= radius * radius;
    }
};

function createCardInstance(cardName) {
    const template = CARDS.get(cardName);
    if (!template) return null;
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: template.name,
        type: template.type,
        cost: template.cost,
        rarity: template.rarity,
        description: template.description,
        effects: [...template.effects],
        keywords: [...(template.keywords || [])],
        exhausts: template.exhausts || false,
        retains: template.retains || false,
        targets: template.targets || 'single',
        upgraded: false,
        upgrade: template.upgrade ? { ...template.upgrade } : null
    };
}

function createEnemyInstance(enemyName) {
    const template = ENEMIES.get(enemyName);
    if (!template) return null;
    
    return {
        id: Math.random().toString(36).substr(2, 9),
        name: template.name,
        hp: Random.int(template.hpMin, template.hpMax),
        maxHp: Random.int(template.hpMin, template.hpMax),
        sprite: template.sprite,
        size: template.size || 1,
        moveset: template.moveset,
        isElite: template.isElite || false,
        isBoss: template.isBoss || false,
        phases: template.phases,
        block: 0,
        strength: 0,
        statusEffects: {},
        intent: null,
        lastMoveIndex: -1,
        moveHistory: [],
        phase: 0
    };
}

function getEnemyIntent(enemy) {
    if (!enemy.moveset || enemy.moveset.length === 0) return null;
    
    const validMoves = enemy.moveset.filter((move, index) => {
        if (move.action.type === 'charge' && enemy.charged) return false;
        if (enemy.lastMoveIndex === index && enemy.moveset.length > 1) {
            return Random.chance(0.25);
        }
        return true;
    });
    
    if (validMoves.length === 0) {
        return enemy.moveset[0].action;
    }
    
    const totalWeight = validMoves.reduce((sum, m) => sum + m.weight, 0);
    let roll = Random.int(0, totalWeight - 1);
    
    for (const move of validMoves) {
        roll -= move.weight;
        if (roll <= 0) {
            return move.action;
        }
    }
    
    return validMoves[0].action;
}

window.addEventListener('load', () => {
    Game.init();
});
