const Shop = {
    CARD_SLOTS: 5,
    RELIC_SLOTS: 2,
    POTION_SLOTS: 2,
    
    CARD_BASE_COST: { common: 50, uncommon: 75, rare: 150 },
    RELIC_BASE_COST: { common: 150, uncommon: 250, rare: 300 },
    POTION_BASE_COST: { common: 50, uncommon: 75, rare: 100 },
    REMOVE_COST: 75,
    REMOVE_COST_INCREASE: 25,
    
    current: null,
    
    generate(act = 1) {
        const shop = {
            cards: [],
            relics: [],
            potions: [],
            removeCost: this.getRemoveCost(),
            removeUsed: false,
            purchased: new Set()
        };
        
        for (let i = 0; i < this.CARD_SLOTS; i++) {
            const rarity = Random.weighted([
                { weight: 50, value: 'common' },
                { weight: 35, value: 'uncommon' },
                { weight: 15, value: 'rare' }
            ]);
            const card = CARDS.getRandom(rarity);
            if (card) {
                shop.cards.push({
                    card: card,
                    cost: this.getCardCost(card),
                    sold: false
                });
            }
        }
        
        for (let i = 0; i < this.RELIC_SLOTS; i++) {
            const rarity = Random.weighted([
                { weight: 40, value: 'common' },
                { weight: 40, value: 'uncommon' },
                { weight: 20, value: 'rare' }
            ]);
            const relic = RELICS.getRandom(rarity);
            if (relic && !Game.hasRelic(relic.name)) {
                shop.relics.push({
                    relic: relic,
                    cost: this.getRelicCost(relic),
                    sold: false
                });
            }
        }
        
        const maxPotions = Game.getMaxPotions();
        for (let i = 0; i < this.POTION_SLOTS; i++) {
            const rarity = Random.weighted([
                { weight: 50, value: 'common' },
                { weight: 35, value: 'uncommon' },
                { weight: 15, value: 'rare' }
            ]);
            const potion = POTIONS.getRandom(rarity);
            if (potion) {
                shop.potions.push({
                    potion: potion,
                    cost: this.getPotionCost(potion),
                    sold: false
                });
            }
        }
        
        this.current = shop;
        return shop;
    },
    
    getRemoveCost() {
        const timesRemoved = Game.player.timesRemoved || 0;
        return this.REMOVE_COST + (timesRemoved * this.REMOVE_COST_INCREASE);
    },
    
    getCardCost(card) {
        let cost = this.CARD_BASE_COST[card.rarity] || 50;
        cost += Random.int(-10, 10);
        return Math.max(25, cost);
    },
    
    getRelicCost(relic) {
        let cost = this.RELIC_BASE_COST[relic.rarity] || 150;
        cost += Random.int(-25, 25);
        return Math.max(100, cost);
    },
    
    getPotionCost(potion) {
        let cost = this.POTION_BASE_COST[potion.rarity] || 50;
        cost += Random.int(-10, 10);
        return Math.max(25, cost);
    },
    
    buyCard(shop, index) {
        if (index < 0 || index >= shop.cards.length) return false;
        
        const item = shop.cards[index];
        if (item.sold) return false;
        
        if (Game.player.gold < item.cost) return false;
        
        Game.player.gold -= item.cost;
        Game.player.deck.push(createCardInstance(item.card.name));
        item.sold = true;
        shop.purchased.add(`card-${index}`);
        
        return true;
    },
    
    buyRelic(shop, index) {
        if (index < 0 || index >= shop.relics.length) return false;
        
        const item = shop.relics[index];
        if (item.sold) return false;
        
        if (Game.player.gold < item.cost) return false;
        if (Game.hasRelic(item.relic.name)) return false;
        
        Game.player.gold -= item.cost;
        Game.addRelic(item.relic);
        item.sold = true;
        shop.purchased.add(`relic-${index}`);
        
        return true;
    },
    
    buyPotion(shop, index) {
        if (index < 0 || index >= shop.potions.length) return false;
        
        const item = shop.potions[index];
        if (item.sold) return false;
        
        if (Game.player.gold < item.cost) return false;
        if (Game.player.potions.length >= Game.getMaxPotions()) return false;
        
        Game.player.gold -= item.cost;
        Game.player.potions.push(item.potion);
        item.sold = true;
        shop.purchased.add(`potion-${index}`);
        
        return true;
    },
    
    removeCard(shop, cardIndex) {
        if (shop.removeUsed && !Game.hasRelic('Smiling Mask')) return false;
        if (cardIndex < 0 || cardIndex >= Game.player.deck.length) return false;
        
        let cost = shop.removeCost;
        if (Game.hasRelic('Smiling Mask') && !shop.removeUsed) {
            cost = 0;
        }
        
        if (Game.player.gold < cost) return false;
        
        Game.player.gold -= cost;
        Game.player.deck.splice(cardIndex, 1);
        Game.player.timesRemoved = (Game.player.timesRemoved || 0) + 1;
        shop.removeUsed = true;
        shop.removeCost = this.getRemoveCost();
        
        return true;
    }
};

const Rewards = {
    generate(victory, enemies, act = 1) {
        if (!victory) return null;
        
        const rewards = {
            gold: 0,
            cards: [],
            relics: [],
            potions: [],
            pickedCards: [],
            pickedRelics: [],
            pickedPotions: [],
            skipped: false
        };
        
        enemies.forEach(enemy => {
            const template = ENEMIES.get(enemy.name);
            if (template) {
                let baseGold = Random.int(10, 20);
                if (template.isElite) baseGold *= 2;
                if (template.isBoss) baseGold *= 5;
                rewards.gold += baseGold;
            }
        });
        
        if (Game.hasRelic('Golden Idol')) {
            rewards.gold = Math.floor(rewards.gold * 1.25);
        }
        
        const isBoss = enemies.some(e => {
            const t = ENEMIES.get(e.name);
            return t && t.isBoss;
        });
        const isElite = enemies.some(e => {
            const t = ENEMIES.get(e.name);
            return t && t.isElite;
        });
        
        const cardCount = isBoss ? 3 : (isElite ? 2 : (Random.chance(0.5) ? 1 : 0));
        for (let i = 0; i < cardCount; i++) {
            const rarity = this.determineCardRarity(isElite || isBoss);
            const card = CARDS.getRandom(rarity);
            if (card) rewards.cards.push(card);
        }
        
        if (isElite || isBoss) {
            const relicRarity = isBoss ? 'rare' : Random.weighted([
                { weight: 50, value: 'uncommon' },
                { weight: 50, value: 'rare' }
            ]);
            const relic = RELICS.getRandom(relicRarity);
            if (relic && !Game.hasRelic(relic.name)) {
                rewards.relics.push(relic);
            }
        }
        
        if (Random.chance(0.15) || isBoss) {
            const potionRarity = isBoss ? 'rare' : Random.weighted([
                { weight: 50, value: 'common' },
                { weight: 35, value: 'uncommon' },
                { weight: 15, value: 'rare' }
            ]);
            const potion = POTIONS.getRandom(potionRarity);
            if (potion && Game.player.potions.length < Game.getMaxPotions()) {
                rewards.potions.push(potion);
            }
        }
        
        return rewards;
    },
    
    determineCardRarity(guaranteedBetter = false) {
        if (guaranteedBetter) {
            return Random.weighted([
                { weight: 30, value: 'common' },
                { weight: 45, value: 'uncommon' },
                { weight: 25, value: 'rare' }
            ]);
        }
        
        return Random.weighted([
            { weight: 50, value: 'common' },
            { weight: 35, value: 'uncommon' },
            { weight: 15, value: 'rare' }
        ]);
    },
    
    pickCard(rewards, index) {
        if (index < 0 || index >= rewards.cards.length) return false;
        
        const card = rewards.cards[index];
        Game.player.deck.push(createCardInstance(card.name));
        rewards.pickedCards.push(card);
        
        return true;
    },
    
    pickRelic(rewards, index) {
        if (index < 0 || index >= rewards.relics.length) return false;
        
        const relic = rewards.relics[index];
        if (Game.hasRelic(relic.name)) return false;
        
        Game.addRelic(relic);
        rewards.pickedRelics.push(relic);
        
        return true;
    },
    
    pickPotion(rewards, index) {
        if (index < 0 || index >= rewards.potions.length) return false;
        
        const potion = rewards.potions[index];
        if (Game.player.potions.length >= Game.getMaxPotions()) return false;
        
        Game.player.potions.push(potion);
        rewards.pickedPotions.push(potion);
        
        return true;
    },
    
    skipRewards(rewards) {
        rewards.skipped = true;
    },
    
    claimGold(rewards) {
        Game.player.gold += rewards.gold;
        rewards.gold = 0;
    }
};

const RestSite = {
    HEAL_PERCENT: 0.3,
    
    getOptions() {
        const options = [
            { id: 'rest', name: 'Rest', description: `Heal ${Math.floor(Game.player.maxHp * this.HEAL_PERCENT)} HP` },
            { id: 'upgrade', name: 'Upgrade', description: 'Upgrade a card' }
        ];
        
        if (Game.hasRelic('Shrine of Healing')) {
            options.push({ id: 'healFull', name: 'Full Heal', description: 'Heal to full HP (once per run)' });
        }
        
        return options;
    },
    
    rest() {
        const healAmount = Math.floor(Game.player.maxHp * this.HEAL_PERCENT);
        Game.player.hp = Math.min(Game.player.maxHp, Game.player.hp + healAmount);
        return healAmount;
    },
    
    upgradeCard(cardIndex) {
        if (cardIndex < 0 || cardIndex >= Game.player.deck.length) return false;
        
        const card = Game.player.deck[cardIndex];
        if (card.upgraded) return false;
        
        card.upgraded = true;
        
        if (card.upgrade) {
            if (card.upgrade.cost !== undefined) card.cost = card.upgrade.cost;
            if (card.upgrade.damage) {
                const effect = card.effects.find(e => e.type === 'damage');
                if (effect) effect.value = card.upgrade.damage;
            }
            if (card.upgrade.block) {
                const effect = card.effects.find(e => e.type === 'block');
                if (effect) effect.value = card.upgrade.block;
            }
        }
        
        return true;
    }
};

const EventSystem = {
    current: null,
    
    startEvent(event) {
        this.current = {
            event: event,
            currentChoice: 0,
            result: null
        };
        return this.current;
    },
    
    makeChoice(choiceIndex) {
        if (!this.current) return null;
        
        const event = this.current.event;
        if (choiceIndex < 0 || choiceIndex >= event.choices.length) return null;
        
        const choice = event.choices[choiceIndex];
        
        if (choice.requires) {
            if (choice.requires.gold && Game.player.gold < choice.requires.gold) {
                return { text: "You don't have enough gold!", effects: [] };
            }
        }
        
        const result = this.resolveChoice(choice);
        
        this.current.result = result;
        return result;
    },
    
    resolveChoice(choice) {
        const result = {
            text: choice.resultText || 'You made a choice.',
            effects: [],
            startCombat: false,
            enemies: null
        };
        
        let effect = choice.effect || choice;
        
        if (effect.random) {
            const picked = Random.weighted(effect.random.map(e => ({ weight: e.weight, value: e.effect })));
            effect = picked || {};
        }
        
        if (effect.goldCost) {
            Game.player.gold -= effect.goldCost;
            result.effects.push({ type: 'gold', value: -effect.goldCost });
        }
        
        if (effect.gold) {
            const gold = typeof effect.gold === 'object' 
                ? Random.int(effect.gold.min, effect.gold.max)
                : effect.gold;
            Game.player.gold += gold;
            result.effects.push({ type: 'gold', value: gold });
        }
        
        if (effect.heal) {
            const heal = Math.min(effect.heal, Game.player.maxHp - Game.player.hp);
            Game.player.hp += heal;
            result.effects.push({ type: 'heal', value: heal });
        }
        
        if (effect.fullHeal) {
            const heal = Game.player.maxHp - Game.player.hp;
            Game.player.hp = Game.player.maxHp;
            result.effects.push({ type: 'heal', value: heal });
        }
        
        if (effect.selfDamage || effect.damage) {
            const dmg = effect.selfDamage || effect.damage;
            Game.player.hp -= dmg;
            result.effects.push({ type: 'damage', value: dmg });
        }
        
        if (effect.maxHp) {
            Game.player.maxHp += effect.maxHp;
            if (effect.maxHp > 0) {
                Game.player.hp += effect.maxHp;
            }
            result.effects.push({ type: 'maxHp', value: effect.maxHp });
        }
        
        if (effect.buff) {
            const buffType = effect.buff === 'random' ? Random.pick(['strength', 'dexterity']) : effect.buff;
            const value = effect.value || 1;
            if (buffType === 'strength') {
                Game.player.strength = (Game.player.strength || 0) + value;
                result.effects.push({ type: 'strength', value: value });
            } else if (buffType === 'dexterity') {
                Game.player.dexterity = (Game.player.dexterity || 0) + value;
                result.effects.push({ type: 'dexterity', value: value });
            }
        }
        
        if (effect.debuff) {
            result.effects.push({ type: 'debuff', value: effect.debuff });
        }
        
        if (effect.addCard) {
            const card = createCardInstance(effect.addCard);
            if (card) {
                Game.player.deck.push(card);
                result.effects.push({ type: 'addCard', card: card.name });
            }
        }
        
        if (effect.remove || effect.removeCurse) {
            const curses = Game.player.deck.filter(c => c.type === 'curse');
            if (effect.removeCurse && curses.length > 0) {
                const idx = Game.player.deck.indexOf(curses[0]);
                if (idx !== -1) {
                    Game.player.deck.splice(idx, 1);
                    result.effects.push({ type: 'removeCard', card: curses[0].name });
                }
            } else if (effect.removeCurse) {
                result.text = "You have no curse cards to remove.";
            } else if (effect.remove) {
                result.effects.push({ type: 'removeCardRequest', count: 1 });
            }
        }
        
        if (effect.upgrade) {
            const upgradeable = Game.player.deck.filter(c => !c.upgraded);
            if (upgradeable.length > 0) {
                const card = Random.pick(upgradeable);
                const idx = Game.player.deck.indexOf(card);
                if (idx !== -1) {
                    Game.player.deck[idx] = upgradeCard(Game.player.deck[idx]);
                    result.effects.push({ type: 'upgrade', card: card.name });
                }
            } else {
                result.text = "No cards to upgrade.";
            }
        }
        
        if (effect.upgradeRandom) {
            const upgradeable = Game.player.deck.filter(c => !c.upgraded);
            if (upgradeable.length > 0) {
                const card = Random.pick(upgradeable);
                const idx = Game.player.deck.indexOf(card);
                if (idx !== -1) {
                    Game.player.deck[idx] = upgradeCard(Game.player.deck[idx]);
                    result.effects.push({ type: 'upgrade', card: card.name });
                }
            }
        }
        
        if (effect.relic) {
            let relic;
            if (effect.relic === 'random') {
                relic = RELICS.getRandom();
            } else if (effect.relic === 'common') {
                relic = RELICS.getByRarity('common')[0];
            } else if (effect.relic === 'uncommon') {
                relic = RELICS.getByRarity('uncommon')[0];
            } else if (effect.relic === 'rare' || effect.relic === 'rareRelic') {
                relic = RELICS.getByRarity('rare')[0];
            } else {
                relic = RELICS.get(effect.relic);
            }
            if (relic && !Game.hasRelic(relic.name)) {
                Game.addRelic(relic);
                result.effects.push({ type: 'addRelic', relic: relic.name });
            }
        }
        
        if (effect.potion) {
            let potion;
            if (effect.potion === 'random') {
                potion = POTIONS.getRandom();
            } else {
                potion = POTIONS.get(effect.potion);
            }
            if (potion && Game.player.potions.length < Game.getMaxPotions()) {
                Game.player.potions.push(potion);
                result.effects.push({ type: 'addPotion', potion: potion.name });
            }
            if (effect.count > 1) {
                for (let i = 1; i < effect.count && Game.player.potions.length < Game.getMaxPotions(); i++) {
                    const extraPotion = POTIONS.getRandom();
                    Game.player.potions.push(extraPotion);
                }
            }
        }
        
        if (effect.fight) {
            const count = effect.count || 1;
            const enemies = [];
            
            for (let i = 0; i < count; i++) {
                let enemyData;
                if (effect.fight === 'random') {
                    enemyData = ENEMIES.getRandom(Game.act || 1);
                } else {
                    enemyData = ENEMIES.get(effect.fight);
                }
                
                if (enemyData) {
                    const enemy = createEnemyInstance(enemyData.name);
                    if (effect.bonusHP && enemy) {
                        enemy.maxHp += effect.bonusHP;
                        enemy.hp += effect.bonusHP;
                    }
                    if (enemy) enemies.push(enemy);
                }
            }
            
            if (enemies.length > 0) {
                result.startCombat = true;
                result.enemies = enemies;
                result.text = `You encounter ${enemies.map(e => e.name).join(' and ')}!`;
            }
        }
        
        if (effect.gamble) {
            if (Game.player.gold >= effect.gamble.cost) {
                Game.player.gold -= effect.gamble.cost;
                result.effects.push({ type: 'gold', value: -effect.gamble.cost });
                
                if (Random.chance(50)) {
                    const relic = RELICS.getByRarity('rare')[0];
                    if (relic && !Game.hasRelic(relic.name)) {
                        Game.addRelic(relic);
                        result.effects.push({ type: 'addRelic', relic: relic.name });
                        result.text = "You won a rare relic!";
                    } else {
                        const goldWin = 100;
                        Game.player.gold += goldWin;
                        result.effects.push({ type: 'gold', value: goldWin });
                        result.text = `You won ${goldWin} gold!`;
                    }
                } else {
                    result.text = "You lost the gamble!";
                }
            }
        }
        
        if (effect.duplicateCard) {
            const nonBasic = Game.player.deck.filter(c => c.rarity !== 'common' || c.type !== 'attack');
            if (nonBasic.length > 0) {
                const card = Random.pick(nonBasic);
                const copy = createCardInstance(card.name);
                if (copy) {
                    Game.player.deck.push(copy);
                    result.effects.push({ type: 'addCard', card: copy.name });
                    result.text = `You duplicated ${card.name}!`;
                }
            } else {
                result.text = "The mirror shows nothing worth duplicating.";
            }
        }
        
        if (effect.chooseCard) {
            const cards = [];
            for (let i = 0; i < effect.chooseCard; i++) {
                const card = CARDS.getRandom();
                if (card) cards.push(card);
            }
            if (cards.length > 0) {
                const chosen = Random.pick(cards);
                const instance = createCardInstance(chosen.name);
                if (instance) {
                    Game.player.deck.push(instance);
                    result.effects.push({ type: 'addCard', card: instance.name });
                }
            }
        }
        
        if (effect.teleport) {
            result.effects.push({ type: 'teleport' });
            result.text = "The portal whisks you away!";
        }
        
        if (effect.arena) {
            result.effects.push({ type: 'arena', data: effect.arena });
            result.text = "The crowd roars as you enter the arena!";
        }
        
        if (effect.trade) {
            const nonBasic = Game.player.deck.filter(c => c.rarity !== 'common');
            if (nonBasic.length > 0) {
                const tradedCard = Random.pick(nonBasic);
                const idx = Game.player.deck.indexOf(tradedCard);
                if (idx !== -1) {
                    Game.player.deck.splice(idx, 1);
                    const newCard = CARDS.getRandom();
                    if (newCard) {
                        const instance = createCardInstance(newCard.name);
                        if (instance) {
                            Game.player.deck.push(instance);
                            result.effects.push({ type: 'removeCard', card: tradedCard.name });
                            result.effects.push({ type: 'addCard', card: instance.name });
                            result.text = `Traded ${tradedCard.name} for ${instance.name}!`;
                        }
                    }
                }
            } else {
                result.text = "You have no cards worth trading.";
            }
        }
        
        return result;
    },
    
    endEvent() {
        this.current = null;
    }
};
