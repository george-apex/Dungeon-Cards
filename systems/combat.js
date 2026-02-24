const Combat = {
    state: null,
    actionTimer: 0,
    actionDelay: 800,
    animationPhase: 'idle',
    
    init(enemies) {
        this.state = {
            turn: 0,
            phase: 'player',
            player: {
                hp: Game.player.hp,
                maxHp: Game.player.maxHp,
                block: 0,
                energy: 3,
                maxEnergy: 3,
                strength: 0,
                dexterity: 0,
                focus: 0,
                statusEffects: {},
                buffs: {},
                tookDamageThisTurn: false,
                tookDamageLastTurn: false,
                cardsPlayedThisTurn: 0,
                attacksPlayedThisTurn: 0
            },
            enemies: enemies.map(e => ({
                ...e,
                block: 0,
                strength: 0,
                statusEffects: {},
                intent: null,
                lastMoveIndex: -1,
                moveHistory: [],
                phase: 0,
                charged: false,
                usedLastStand: false,
                animation: { type: 'idle', offsetX: 0, offsetY: 0 }
            })),
            drawPile: [...Game.player.drawPile],
            hand: [],
            discardPile: [...Game.player.discardPile],
            exhaustPile: [],
            selectedCard: null,
            selectedTarget: null,
            combatLog: [],
            isOver: false,
            victory: false,
            pendingAction: null,
            enemyActionQueue: [],
            currentEnemyAction: null,
            pendingDamage: null
        };
        
        this.shuffleDrawPile();
        this.drawCards(5);
        this.calculateEnemyIntents();
        this.applyStartOfCombatEffects();
        
        return this.state;
    },
    
    shuffleDrawPile() {
        this.state.drawPile = Random.shuffle(this.state.drawPile);
    },
    
    drawCards(count) {
        const drawReduction = this.state.player.statusEffects.drawReduction || 0;
        const actualCount = Math.max(0, count - drawReduction);
        
        for (let i = 0; i < actualCount; i++) {
            if (this.state.drawPile.length === 0) {
                if (this.state.discardPile.length === 0) break;
                this.state.drawPile = Random.shuffle([...this.state.discardPile]);
                this.state.discardPile = [];
            }
            const card = this.state.drawPile.pop();
            if (card) {
                this.state.hand.push(card);
                this.onCardDrawn(card);
            }
        }
    },
    
    onCardDrawn(card) {
        if (card.onDraw) {
            if (card.onDraw.type === 'selfDamage') {
                this.dealDamageToPlayer(card.onDraw.value, true);
            } else if (card.onDraw.type === 'selfStatus') {
                this.applyStatus(this.state.player, card.onDraw.status, card.onDraw.value);
            }
        }
        
        if (Game.hasRelic('Sundial') && this.state.drawPile.length === 0) {
            this.state.player.energy += 2;
        }
    },
    
    canPlayCard(card) {
        if (card.cost === -2) return false;
        
        let cost = card.cost;
        if (card.cost === -1) {
            cost = this.state.player.energy;
        }
        
        if (this.state.player.energy < cost) return false;
        
        if (card.name === 'Normality' && this.state.player.cardsPlayedThisTurn >= 3) {
            return false;
        }
        
        return true;
    },
    
    playCard(card, target = null) {
        if (!this.canPlayCard(card)) return false;
        
        let cost = card.cost;
        if (card.cost === -1) {
            cost = this.state.player.energy;
        }
        
        this.state.player.energy -= cost;
        
        const cardIndex = this.state.hand.findIndex(c => c.id === card.id);
        if (cardIndex === -1) return false;
        this.state.hand.splice(cardIndex, 1);
        
        this.state.player.cardsPlayedThisTurn++;
        
        if (card.type === 'attack') {
            this.state.player.attacksPlayedThisTurn++;
        }
        
        this.executeCardEffects(card, target);
        
        if (card.exhausts) {
            this.state.exhaustPile.push(card);
            this.log(`${card.name} is exhausted.`);
        } else {
            this.state.discardPile.push(card);
        }
        
        if (card.type === 'attack' && this.state.player.buffs.rage) {
            this.state.player.block += this.state.player.buffs.rage;
        }
        
        Game.onCardPlayed(card);
        
        this.checkCombatEnd();
        
        return true;
    },
    
    executeCardEffects(card, target) {
        const player = this.state.player;
        
        for (const effect of card.effects) {
            let value = effect.value || 0;
            let times = effect.times || 1;
            
            if (effect.xCost) {
                times = player.energy;
            }
            
            switch (effect.type) {
                case 'damage':
                    this.executeDamageEffect(effect, target, times, player);
                    break;
                    
                case 'block':
                    let blockValue = value + player.dexterity;
                    if (player.statusEffects.frail) {
                        blockValue = Math.floor(blockValue * 0.75);
                    }
                    player.block += blockValue;
                    this.log(`Gain ${blockValue} block.`);
                    
                    if (player.buffs.juggernaut) {
                        const enemies = this.state.enemies.filter(e => e.hp > 0);
                        if (enemies.length > 0) {
                            const randomEnemy = Random.pick(enemies);
                            this.dealDamageToEnemy(randomEnemy, player.buffs.juggernaut);
                        }
                    }
                    break;
                    
                case 'draw':
                    this.drawCards(value);
                    break;
                    
                case 'discard':
                    if (this.state.hand.length > 0) {
                        this.state.pendingAction = {
                            type: 'discard',
                            count: Math.min(value, this.state.hand.length),
                            selectedCards: []
                        };
                    }
                    break;
                    
                case 'discardHand':
                    while (this.state.hand.length > 0) {
                        this.state.discardPile.push(this.state.hand.pop());
                    }
                    break;
                    
                case 'drawDiscarded':
                    const discardedCount = this.state.discardPile.length;
                    this.drawCards(discardedCount);
                    break;
                    
                case 'energy':
                    player.energy += value;
                    this.log(`Gain ${value} energy.`);
                    break;
                    
                case 'heal':
                    const healAmount = Math.min(value, player.maxHp - player.hp);
                    player.hp += healAmount;
                    this.log(`Heal ${healAmount} HP.`);
                    break;
                    
                case 'selfDamage':
                    this.dealDamageToPlayer(value, true);
                    break;
                    
                case 'applyStatus':
                    if (target) {
                        this.applyStatus(target, effect.status, value);
                    }
                    break;
                    
                case 'buff':
                    if (effect.temporary) {
                        player.buffs[effect.buff] = (player.buffs[effect.buff] || 0) + value;
                        player.buffs[`${effect.buff}_temporary`] = (player.buffs[`${effect.buff}_temporary`] || 0) + value;
                    } else {
                        player[effect.buff] = (player[effect.buff] || 0) + value;
                    }
                    this.log(`Gain ${value} ${effect.buff}.`);
                    break;
                    
                case 'doubleBlock':
                    player.block *= 2;
                    this.log(`Block doubled to ${player.block}.`);
                    break;
                    
                case 'doubleStatus':
                    if (target && target.statusEffects[effect.status]) {
                        target.statusEffects[effect.status] *= 2;
                        this.log(`${effect.status} doubled on ${target.name}.`);
                    }
                    break;
                    
                case 'damageFromBlock':
                    const blockDamage = player.block + player.strength;
                    this.dealDamageToEnemy(target, blockDamage);
                    break;
                    
                case 'damageFromHP':
                    const hpDamage = player.hp;
                    this.dealDamageToEnemy(target, hpDamage);
                    break;
                    
                case 'damageFromMissingHP':
                    const missingHp = player.maxHp - player.hp;
                    this.dealDamageToEnemy(target, missingHp);
                    break;
                    
                case 'damagePerDiscard':
                    const discardDamage = this.state.discardPile.length + player.strength;
                    this.dealDamageToEnemy(target, discardDamage);
                    break;
                    
                case 'damagePerStatus':
                    if (target && target.statusEffects[effect.status]) {
                        const statusDamage = target.statusEffects[effect.status] + player.strength;
                        this.dealDamageToEnemy(target, statusDamage);
                    }
                    break;
                    
                case 'blockPerHand':
                    const handBlock = this.state.hand.length + player.dexterity;
                    player.block += handBlock;
                    this.log(`Gain ${handBlock} block.`);
                    break;
                    
                case 'thorns':
                    player.buffs.thorns = (player.buffs.thorns || 0) + value;
                    this.log(`Gain ${value} thorns.`);
                    break;
                    
                case 'cleanse':
                    player.statusEffects = {};
                    this.log('All debuffs removed.');
                    break;
                    
                case 'addCard':
                    const cardToAdd = createCardInstance(effect.card);
                    if (cardToAdd) {
                        for (let i = 0; i < (effect.times || 1); i++) {
                            this.state.discardPile.push(createCardInstance(effect.card));
                        }
                    }
                    break;
                    
                case 'addCardToHand':
                    const handCard = createCardInstance(effect.card);
                    if (handCard) {
                        this.state.hand.push(handCard);
                    }
                    break;
                    
                case 'addCardToDeck':
                    Game.player.deck.push(createCardInstance(effect.card));
                    break;
                    
                case 'consumeCard':
                    break;
                    
                case 'upgradeHand':
                    if (this.state.hand.length > 0) {
                        const toUpgrade = Random.pick(this.state.hand);
                        toUpgrade.upgraded = true;
                        this.log(`${toUpgrade.name} upgraded this combat.`);
                    }
                    break;
                    
                case 'topDeck':
                    break;
                    
                case 'playTopCard':
                    if (this.state.drawPile.length > 0) {
                        const topCard = this.state.drawPile.pop();
                        this.state.hand.push(topCard);
                        this.playCard(topCard, target);
                    }
                    break;
                    
                case 'discover':
                    const pool = CARDS.all.filter(c => c.type !== 'curse');
                    const choices = [];
                    for (let i = 0; i < effect.count && pool.length > 0; i++) {
                        const picked = Random.pick(pool);
                        choices.push(picked);
                        pool.splice(pool.indexOf(picked), 1);
                    }
                    if (choices.length > 0) {
                        const discovered = createCardInstance(choices[0].name);
                        discovered.cost = effect.cost;
                        this.state.hand.push(discovered);
                    }
                    break;
                    
                case 'drawPerDiscard':
                    const drawCount = Math.min(effect.max || 10, this.state.discardPile.length);
                    this.drawCards(drawCount);
                    break;
            }
        }
    },
    
    executeDamageEffect(effect, target, times, player) {
        let baseDamage = effect.value || 0;
        
        if (effect.conditional) {
            const cond = effect.conditional;
            let conditionMet = false;
            
            if (cond.type === 'hpBelow' && target) {
                conditionMet = target.hp / target.maxHp < cond.percent / 100;
            } else if (cond.type === 'tookDamage') {
                conditionMet = player.tookDamageThisTurn;
            } else if (cond.type === 'noDamageLastTurn') {
                conditionMet = !player.tookDamageLastTurn;
            }
            
            if (conditionMet && cond.bonusValue) {
                baseDamage = cond.bonusValue;
            }
        }
        
        for (let i = 0; i < times; i++) {
            let damage = baseDamage + player.strength;
            
            if (player.statusEffects.weak) {
                damage = Math.floor(damage * 0.75);
            }
            
            if (effect.pierce && target && target.block > 0) {
                const blocked = Math.min(target.block, damage);
                target.block -= blocked;
                const remaining = damage - blocked;
                if (remaining > 0) {
                    target.hp -= remaining;
                }
            } else {
                this.dealDamageToEnemy(target, damage, effect.lifesteal);
            }
            
            if (effect.onKill) {
                this.state.pendingOnKill = effect.onKill;
            }
        }
    },
    
    dealDamageToEnemy(enemy, damage, lifesteal = false) {
        if (!enemy || enemy.hp <= 0) return;
        
        let actualDamage = damage;
        
        if (enemy.block > 0) {
            const blocked = Math.min(enemy.block, actualDamage);
            enemy.block -= blocked;
            actualDamage -= blocked;
        }
        
        if (actualDamage > 0) {
            enemy.hp -= actualDamage;
            this.log(`Deal ${actualDamage} damage to ${enemy.name}.`);
            
            if (lifesteal) {
                const healAmount = Math.min(actualDamage, this.state.player.maxHp - this.state.player.hp);
                this.state.player.hp += healAmount;
                this.log(`Lifesteal heals ${healAmount}.`);
            }
            
            if (enemy.hp <= 0) {
                this.onEnemyDeath(enemy);
            }
        } else {
            this.log(`${enemy.name} blocks ${damage} damage.`);
        }
    },
    
    dealDamageToPlayer(damage, ignoreBlock = false) {
        let actualDamage = damage;
        
        if (!ignoreBlock && this.state.player.block > 0) {
            const blocked = Math.min(this.state.player.block, actualDamage);
            this.state.player.block -= blocked;
            actualDamage -= blocked;
        }
        
        if (actualDamage > 0) {
            this.state.player.hp -= actualDamage;
            this.state.player.tookDamageThisTurn = true;
            this.log(`Take ${actualDamage} damage.`);
            
            if (this.state.player.buffs.noPainNoGain) {
                this.drawCards(1);
            }
            
            if (this.state.player.hp <= 0) {
                this.state.isOver = true;
                this.state.victory = false;
            }
        }
    },
    
    applyStatus(target, status, value) {
        if (!target) return;
        
        target.statusEffects[status] = (target.statusEffects[status] || 0) + value;
        this.log(`Apply ${value} ${status} to ${target.name || 'player'}.`);
    },
    
    onEnemyDeath(enemy) {
        this.log(`${enemy.name} is defeated!`);
        
        if (enemy.stolenGold && enemy.stolenGold > 0) {
            Game.player.gold += enemy.stolenGold;
            this.log(`Recovered ${enemy.stolenGold} stolen gold!`);
            enemy.stolenGold = 0;
        }
        
        if (this.state.pendingOnKill) {
            const onKill = this.state.pendingOnKill;
            if (onKill.targets === 'all') {
                this.state.enemies.forEach(e => {
                    if (e.hp > 0) {
                        this.applyStatus(e, onKill.status, onKill.value);
                    }
                });
            }
            this.state.pendingOnKill = null;
        }
        
        if (enemy.isBoss) {
            this.state.isOver = true;
            this.state.victory = true;
        }
    },
    
    calculateEnemyIntents() {
        this.state.enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                enemy.intent = getEnemyIntent(enemy);
            }
        });
    },
    
    executeEnemyTurn() {
        this.state.phase = 'enemy';
        this.state.enemyActionQueue = [];
        
        this.state.enemies.forEach(enemy => {
            if (enemy.hp <= 0) return;
            
            enemy.block = 0;
            
            this.processStatusEffects(enemy, 'start');
            
            if (enemy.statusEffects.stun) {
                enemy.statusEffects.stun--;
                this.log(`${enemy.name} is stunned!`);
                return;
            }
            
            const intent = enemy.intent;
            if (!intent) return;
            
            this.state.enemyActionQueue.push({ enemy, intent });
        });
        
        this.actionTimer = 0;
        this.animationPhase = 'start';
        this.processNextEnemyAction();
    },
    
    processNextEnemyAction() {
        if (this.state.enemyActionQueue.length === 0) {
            this.state.enemies = this.state.enemies.filter(e => e.hp > 0);
            
            if (this.state.enemies.length === 0 && !this.state.isOver) {
                this.state.isOver = true;
                this.state.victory = true;
            }
            
            this.checkCombatEnd();
            
            if (!this.state.isOver) {
                this.startNewTurn();
            }
            return;
        }
        
        const { enemy, intent } = this.state.enemyActionQueue.shift();
        this.state.currentEnemyAction = { enemy, intent };
        this.animationPhase = 'windup';
        this.actionTimer = 0;
        
        if (intent.type === 'attack' || intent.type === 'attackAll' || intent.type === 'attackAndDebuff') {
            enemy.animation = { type: 'attack', offsetX: 0, offsetY: 0 };
        } else if (intent.type === 'block') {
            enemy.animation = { type: 'block', offsetX: 0, offsetY: 0 };
        } else {
            enemy.animation = { type: 'action', offsetX: 0, offsetY: 0 };
        }
    },
    
    updateEnemyActions(deltaTime) {
        if (this.state.phase !== 'enemy' || !this.state.currentEnemyAction) return;
        
        this.actionTimer += deltaTime;
        const enemy = this.state.currentEnemyAction.enemy;
        const intent = this.state.currentEnemyAction.intent;
        
        const windupTime = 200;
        const holdTime = 150;
        const totalTime = this.actionDelay;
        
        if (this.animationPhase === 'windup') {
            const progress = Math.min(this.actionTimer / windupTime, 1);
            if (enemy.animation.type === 'attack') {
                enemy.animation.offsetX = -40 * progress;
            } else if (enemy.animation.type === 'block') {
                enemy.animation.offsetY = 20 * progress;
            }
            
            if (this.actionTimer >= windupTime) {
                this.animationPhase = 'strike';
                this.executeEnemyAction(enemy, intent);
            }
        } else if (this.animationPhase === 'strike') {
            const strikeTime = this.actionTimer - windupTime;
            const progress = Math.min(strikeTime / holdTime, 1);
            
            if (enemy.animation.type === 'attack') {
                enemy.animation.offsetX = -40 + 80 * progress;
            } else if (enemy.animation.type === 'block') {
                enemy.animation.offsetY = 20 - 30 * progress;
            }
            
            if (strikeTime >= holdTime) {
                this.animationPhase = 'recover';
            }
        } else if (this.animationPhase === 'recover') {
            const recoverTime = this.actionTimer - windupTime - holdTime;
            const progress = Math.min(recoverTime / (totalTime - windupTime - holdTime), 1);
            
            enemy.animation.offsetX *= (1 - progress);
            enemy.animation.offsetY *= (1 - progress);
            
            if (this.actionTimer >= totalTime) {
                enemy.animation = { type: 'idle', offsetX: 0, offsetY: 0 };
                this.state.currentEnemyAction = null;
                this.processNextEnemyAction();
            }
        }
    },
    
    executeEnemyAction(enemy, action) {
        const player = this.state.player;
        
        switch (action.type) {
            case 'attack':
                let damage = (action.damage || 0) + enemy.strength;
                if (player.statusEffects.vulnerable) {
                    damage = Math.floor(damage * 1.5);
                }
                
                const times = action.times || 1;
                for (let i = 0; i < times; i++) {
                    this.dealDamageToPlayer(damage);
                }
                
                if (action.lifesteal && damage > 0) {
                    enemy.hp = Math.min(enemy.maxHp, enemy.hp + damage);
                }
                
                if (action.addCard) {
                    for (let i = 0; i < (action.times || 1); i++) {
                        this.state.discardPile.push(createCardInstance(action.addCard));
                    }
                }
                break;
                
            case 'attackAll':
                const aoeDamage = action.damage + enemy.strength;
                this.dealDamageToPlayer(aoeDamage);
                if (action.selfDamage) {
                    enemy.hp -= action.selfDamage;
                }
                if (action.addCard) {
                    this.state.discardPile.push(createCardInstance(action.addCard));
                }
                break;
                
            case 'block':
                enemy.block += action.value;
                this.log(`${enemy.name} gains ${action.value} block.`);
                break;
                
            case 'buff':
                enemy[action.stat] = (enemy[action.stat] || 0) + action.value;
                this.log(`${enemy.name} gains ${action.value} ${action.stat}.`);
                break;
                
            case 'debuff':
                this.applyStatus(player, action.status, action.value);
                break;
                
            case 'attackAndDebuff':
                let aadDamage = action.damage + enemy.strength;
                if (player.statusEffects.vulnerable) {
                    aadDamage = Math.floor(aadDamage * 1.5);
                }
                this.dealDamageToPlayer(aadDamage);
                this.applyStatus(player, action.status, action.value);
                break;
                
            case 'attackAndHeal':
                let aahDamage = action.damage + enemy.strength;
                this.dealDamageToPlayer(aahDamage);
                const healVal = action.healPercent 
                    ? Math.floor(enemy.maxHp * action.healPercent / 100)
                    : action.heal;
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + healVal);
                break;
                
            case 'heal':
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + action.value);
                this.log(`${enemy.name} heals ${action.value}.`);
                break;
                
            case 'healAndBlock':
                enemy.hp = Math.min(enemy.maxHp, enemy.hp + action.heal);
                enemy.block += action.block;
                break;
                
            case 'summon':
                const count = action.count || 1;
                for (let i = 0; i < count; i++) {
                    const summoned = createEnemyInstance(action.enemy);
                    if (summoned) {
                        if (action.max && this.state.enemies.filter(e => e.name === action.enemy).length >= action.max) {
                            break;
                        }
                        this.state.enemies.push(summoned);
                        this.log(`${enemy.name} summons ${action.enemy}!`);
                    }
                }
                break;
                
            case 'addCard':
                for (let i = 0; i < (action.times || 1); i++) {
                    this.state.discardPile.push(createCardInstance(action.card));
                }
                this.log(`${enemy.name} adds ${action.card} to your deck.`);
                break;
                
            case 'charge':
                enemy.charged = true;
                enemy.chargedDamage = action.damage;
                enemy.chargedName = action.name;
                this.log(`${enemy.name} is charging up!`);
                break;
                
            case 'multiDebuff':
                action.debuffs.forEach(d => {
                    this.applyStatus(player, d.status, d.value);
                });
                if (action.addCard) {
                    this.state.discardPile.push(createCardInstance(action.addCard));
                }
                break;
                
            case 'steal':
                const stealAmount = Math.min(action.gold, Game.player.gold);
                if (stealAmount > 0) {
                    Game.player.gold -= stealAmount;
                    enemy.stolenGold = (enemy.stolenGold || 0) + stealAmount;
                    this.log(`${enemy.name} steals ${stealAmount} gold!`);
                } else {
                    this.log(`${enemy.name} tries to steal but you have no gold!`);
                }
                break;
                
            case 'attackAndSteal':
                let aasDamage = action.damage + enemy.strength;
                if (player.statusEffects.vulnerable) {
                    aasDamage = Math.floor(aasDamage * 1.5);
                }
                this.dealDamageToPlayer(aasDamage);
                const aasStealAmount = Math.min(action.gold, Game.player.gold);
                if (aasStealAmount > 0) {
                    Game.player.gold -= aasStealAmount;
                    enemy.stolenGold = (enemy.stolenGold || 0) + aasStealAmount;
                    this.log(`${enemy.name} steals ${aasStealAmount} gold!`);
                }
                break;
        }
        
        enemy.moveHistory.push(action);
    },
    
    processStatusEffects(target, phase) {
        const effects = target.statusEffects;
        
        if (phase === 'start') {
            if (effects.poison) {
                target.hp -= effects.poison;
                effects.poison--;
                if (effects.poison <= 0) delete effects.poison;
            }
            
            if (effects.bleed) {
                target.hp -= effects.bleed;
                effects.bleed--;
                if (effects.bleed <= 0) delete effects.bleed;
            }
        }
        
        if (phase === 'end') {
            if (effects.weak && effects.weak > 0) {
                effects.weak--;
                if (effects.weak <= 0) delete effects.weak;
            }
            
            if (effects.vulnerable && effects.vulnerable > 0) {
                effects.vulnerable--;
                if (effects.vulnerable <= 0) delete effects.vulnerable;
            }
            
            if (effects.frail && effects.frail > 0) {
                effects.frail--;
                if (effects.frail <= 0) delete effects.frail;
            }
        }
    },
    
    endPlayerTurn() {
        const player = this.state.player;
        
        this.state.hand.forEach(card => {
            if (card.retains) {
                this.state.drawPile.unshift(card);
            } else {
                this.state.discardPile.push(card);
            }
        });
        this.state.hand = [];
        
        player.block = 0;
        player.tookDamageLastTurn = player.tookDamageThisTurn;
        player.tookDamageThisTurn = false;
        player.cardsPlayedThisTurn = 0;
        player.attacksPlayedThisTurn = 0;
        
        if (player.buffs.strength_temporary) {
            player.strength -= player.buffs.strength_temporary;
            delete player.buffs.strength_temporary;
        }
        
        this.processStatusEffects(player, 'end');
        
        if (player.buffs.metallicize) {
            player.block += player.buffs.metallicize;
        }
        
        if (player.buffs.combust) {
            player.hp -= 1;
            this.state.enemies.forEach(e => {
                if (e.hp > 0) {
                    e.hp -= player.buffs.combust;
                }
            });
        }
        
        this.state.hand.forEach(card => {
            if (card.endTurn && card.endTurn.type === 'selfDamage') {
                this.dealDamageToPlayer(card.endTurn.value, true);
            }
        });
        
        this.executeEnemyTurn();
    },
    
    startNewTurn() {
        this.state.turn++;
        this.state.phase = 'player';
        
        const player = this.state.player;
        
        player.energy = player.maxEnergy;
        
        if (Game.hasRelic('Energy Core')) {
            player.energy += 1;
        }
        
        if (player.buffs.demonForm) {
            player.strength += player.buffs.demonForm;
        }
        
        this.state.enemies.forEach(enemy => {
            if (enemy.hp > 0) {
                this.processStatusEffects(enemy, 'start');
            }
        });
        
        this.drawCards(5);
        this.calculateEnemyIntents();
        
        this.applyStartOfTurnRelics();
    },
    
    applyStartOfCombatEffects() {
        const player = this.state.player;
        
        if (Game.hasRelic('Lantern')) {
            player.energy += 1;
        }
        
        if (Game.hasRelic('Snake Ring')) {
            this.drawCards(2);
        }
    },
    
    applyStartOfTurnRelics() {
        if (Game.hasRelic('Odd Mushroom')) {
            this.state.player.block += 3;
        }
    },
    
    checkCombatEnd() {
        if (this.state.player.hp <= 0) {
            this.state.isOver = true;
            this.state.victory = false;
        }
        
        const aliveEnemies = this.state.enemies.filter(e => e.hp > 0);
        if (aliveEnemies.length === 0 && !this.state.enemies.some(e => e.isBoss)) {
            this.state.isOver = true;
            this.state.victory = true;
        }
    },
    
    log(message) {
        this.state.combatLog.push(message);
        if (this.state.combatLog.length > 50) {
            this.state.combatLog.shift();
        }
    },
    
    completePendingDiscard() {
        if (!this.state.pendingAction || this.state.pendingAction.type !== 'discard') return;
        
        const selected = this.state.pendingAction.selectedCards;
        for (const cardId of selected) {
            const idx = this.state.hand.findIndex(c => c.id === cardId);
            if (idx !== -1) {
                const card = this.state.hand.splice(idx, 1)[0];
                this.state.discardPile.push(card);
                this.log(`Discarded ${card.name}.`);
            }
        }
        
        this.state.pendingAction = null;
    },
    
    cancelPendingAction() {
        this.state.pendingAction = null;
    },
    
    getRewards() {
        if (!this.state.victory) return null;
        
        const rewards = {
            gold: 0,
            cards: [],
            relics: [],
            potions: []
        };
        
        this.state.enemies.forEach(enemy => {
            const template = ENEMIES.get(enemy.name);
            if (template) {
                rewards.gold += Random.int(10, 20) * (template.isElite ? 2 : 1) * (template.isBoss ? 5 : 1);
            }
        });
        
        if (Game.hasRelic('Golden Idol')) {
            rewards.gold = Math.floor(rewards.gold * 1.25);
        }
        
        const cardCount = this.state.enemies.some(e => e.isBoss) ? 3 : (Random.chance(0.5) ? 1 : 0);
        for (let i = 0; i < cardCount; i++) {
            const rarity = Random.weighted([
                { weight: 50, value: 'common' },
                { weight: 35, value: 'uncommon' },
                { weight: 15, value: 'rare' }
            ]);
            const card = CARDS.getRandom(rarity);
            if (card) rewards.cards.push(card);
        }
        
        if (this.state.enemies.some(e => e.isElite || e.isBoss)) {
            const relic = Random.pick(RELICS.all.filter(r => !Game.hasRelic(r.name)));
            if (relic) rewards.relics.push(relic);
        }
        
        if (Random.chance(0.15)) {
            const potion = Random.pick(POTIONS.all);
            if (potion && Game.player.potions.length < 3) {
                rewards.potions.push(potion);
            }
        }
        
        return rewards;
    },
    
    usePotion(potionIndex, target = null) {
        const potion = Game.player.potions[potionIndex];
        if (!potion) return false;
        
        const player = this.state.player;
        
        switch (potion.effect) {
            case 'heal':
                player.hp = Math.min(player.maxHp, player.hp + potion.value);
                break;
            case 'block':
                player.block += potion.value;
                break;
            case 'energy':
                player.energy += potion.value;
                break;
            case 'strength':
                player.strength += potion.value;
                break;
            case 'damage':
                if (target) {
                    this.dealDamageToEnemy(target, potion.value);
                }
                break;
            case 'poison':
                if (target) {
                    this.applyStatus(target, 'poison', potion.value);
                }
                break;
            case 'draw':
                this.drawCards(potion.value);
                break;
            case 'removeDebuffs':
                player.statusEffects = {};
                break;
            case 'gainDexterity':
                player.dexterity += potion.value;
                break;
            case 'gainStrength':
                player.strength += potion.value;
                break;
            case 'randomBuff':
                const buffs = ['strength', 'dexterity', 'focus'];
                const buff = Random.pick(buffs);
                player[buff] += potion.value;
                break;
        }
        
        Game.player.potions.splice(potionIndex, 1);
        this.log(`Used ${potion.name}.`);
        return true;
    }
};
