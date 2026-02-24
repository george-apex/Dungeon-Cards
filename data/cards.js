const CARDS = {
    ATTACK: 'attack',
    DEFENSE: 'defense',
    SKILL: 'skill',
    CURSE: 'curse',
    
    COMMON: 'common',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    
    all: [],
    byRarity: { common: [], uncommon: [], rare: [] },
    
    get(name) {
        return this.all.find(c => c.name === name);
    },
    
    getByRarity(rarity) {
        return this.byRarity[rarity] || [];
    },
    
    getRandom(rarity = null) {
        const pool = rarity ? this.byRarity[rarity] : this.all;
        return Random.pick(pool);
    }
};

function createCard(data) {
    const card = {
        name: data.name,
        type: data.type,
        cost: data.cost,
        rarity: data.rarity,
        description: data.description,
        effects: data.effects || [],
        keywords: data.keywords || [],
        exhausts: data.exhausts || false,
        retains: data.retains || false,
        targets: data.targets || 'single',
        upgraded: false,
        upgrade: data.upgrade || null
    };
    CARDS.all.push(card);
    CARDS.byRarity[data.rarity].push(card);
    return card;
}

const STARTING_DECK = [
    { name: 'Rusty Blade', count: 4 },
    { name: 'Wooden Shield', count: 4 },
    { name: 'Focus', count: 1 },
    { name: 'Coin Toss', count: 1 }
];

createCard({ name: 'Rusty Blade', type: CARDS.ATTACK, cost: 1, rarity: CARDS.COMMON, description: 'Deal 6 damage.', effects: [{ type: 'damage', value: 6 }], targets: 'single' });
createCard({ name: 'Wooden Shield', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.COMMON, description: 'Gain 5 block.', effects: [{ type: 'block', value: 5 }], targets: 'self' });
createCard({ name: 'Focus', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Draw 1 card.', effects: [{ type: 'draw', value: 1 }], targets: 'self' });
createCard({ name: 'Coin Toss', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Gain 1 energy. Draw 1 card. Discard 1 card.', effects: [{ type: 'energy', value: 1 }, { type: 'draw', value: 1 }, { type: 'discard', value: 1 }], targets: 'self' });

createCard({ name: 'Iron Strike', type: CARDS.ATTACK, cost: 1, rarity: CARDS.COMMON, description: 'Deal 8 damage.', effects: [{ type: 'damage', value: 8 }], targets: 'single' });
createCard({ name: 'Heavy Swing', type: CARDS.ATTACK, cost: 2, rarity: CARDS.COMMON, description: 'Deal 15 damage.', effects: [{ type: 'damage', value: 15 }], targets: 'single' });
createCard({ name: 'Quick Jab', type: CARDS.ATTACK, cost: 0, rarity: CARDS.COMMON, description: 'Deal 3 damage. Draw 1 card.', effects: [{ type: 'damage', value: 3 }, { type: 'draw', value: 1 }], targets: 'single' });
createCard({ name: 'Double Strike', type: CARDS.ATTACK, cost: 1, rarity: CARDS.COMMON, description: 'Deal 5 damage twice.', effects: [{ type: 'damage', value: 5, times: 2 }], targets: 'single' });
createCard({ name: 'Thrust', type: CARDS.ATTACK, cost: 1, rarity: CARDS.COMMON, description: 'Deal 9 damage. Strike.', effects: [{ type: 'damage', value: 9 }], keywords: ['strike'], targets: 'single' });
createCard({ name: 'Wide Slash', type: CARDS.ATTACK, cost: 2, rarity: CARDS.COMMON, description: 'Deal 7 damage to ALL enemies.', effects: [{ type: 'damage', value: 7 }], targets: 'all' });
createCard({ name: 'Flurry', type: CARDS.ATTACK, cost: 1, rarity: CARDS.COMMON, description: 'Deal 3 damage 4 times.', effects: [{ type: 'damage', value: 3, times: 4 }], targets: 'single' });

createCard({ name: 'Execute', type: CARDS.ATTACK, cost: 2, rarity: CARDS.UNCOMMON, description: 'Deal 12 damage. If enemy HP below 50%, deal 20 instead.', effects: [{ type: 'damage', value: 12, conditional: { type: 'hpBelow', percent: 50, bonusValue: 20 } }], targets: 'single' });
createCard({ name: 'Rupture', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 10 damage. If you took damage this turn, deal 15 instead.', effects: [{ type: 'damage', value: 10, conditional: { type: 'tookDamage', bonusValue: 15 } }], targets: 'single' });
createCard({ name: 'Venomous Dagger', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 4 damage. Apply 3 Poison.', effects: [{ type: 'damage', value: 4 }, { type: 'applyStatus', status: 'poison', value: 3 }], targets: 'single' });
createCard({ name: 'Bleeding Cut', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 6 damage. Apply 2 Bleed.', effects: [{ type: 'damage', value: 6 }, { type: 'applyStatus', status: 'bleed', value: 2 }], targets: 'single' });
createCard({ name: 'Pommel Strike', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 6 damage. Draw 1 card.', effects: [{ type: 'damage', value: 6 }, { type: 'draw', value: 1 }], targets: 'single' });
createCard({ name: 'Body Slam', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal damage equal to your current block.', effects: [{ type: 'damageFromBlock' }], targets: 'single' });
createCard({ name: 'Clothesline', type: CARDS.ATTACK, cost: 2, rarity: CARDS.UNCOMMON, description: 'Deal 10 damage. Apply 1 Weak.', effects: [{ type: 'damage', value: 10 }, { type: 'applyStatus', status: 'weak', value: 1 }], targets: 'single' });
createCard({ name: 'Sword Boomerang', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 4 damage 3 times to random enemies.', effects: [{ type: 'damage', value: 4, times: 3 }], targets: 'random' });
createCard({ name: 'Poison Spray', type: CARDS.ATTACK, cost: 2, rarity: CARDS.UNCOMMON, description: 'Apply 4 Poison to ALL enemies. Deal 1 damage per Poison on target.', effects: [{ type: 'applyStatus', status: 'poison', value: 4 }, { type: 'damagePerStatus', status: 'poison' }], targets: 'all' });
createCard({ name: 'Rattlebones', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 1 damage for each card in your discard pile.', effects: [{ type: 'damagePerDiscard' }], targets: 'single' });
createCard({ name: 'Twin Daggers', type: CARDS.ATTACK, cost: 1, rarity: CARDS.UNCOMMON, description: 'Deal 4 damage twice. If both hit same target, apply 1 Bleed.', effects: [{ type: 'damage', value: 4, times: 2, bonusStatus: { status: 'bleed', value: 1 } }], targets: 'single' });

createCard({ name: "Reaper's Scythe", type: CARDS.ATTACK, cost: 2, rarity: CARDS.RARE, description: 'Deal 8 damage to ALL enemies. Lifesteal.', effects: [{ type: 'damage', value: 8, lifesteal: true }], targets: 'all', keywords: ['lifesteal'] });
createCard({ name: 'Ragnarok', type: CARDS.ATTACK, cost: 3, rarity: CARDS.RARE, description: 'Deal 25 damage. Exhaust.', effects: [{ type: 'damage', value: 25 }], targets: 'single', exhausts: true });
createCard({ name: 'Thousand Cuts', type: CARDS.ATTACK, cost: 1, rarity: CARDS.RARE, description: 'Deal 1 damage 10 times.', effects: [{ type: 'damage', value: 1, times: 10 }], targets: 'single' });
createCard({ name: 'Bludgeon', type: CARDS.ATTACK, cost: 3, rarity: CARDS.RARE, description: 'Deal 32 damage.', effects: [{ type: 'damage', value: 32 }], targets: 'single' });
createCard({ name: 'Skewer', type: CARDS.ATTACK, cost: 2, rarity: CARDS.RARE, description: 'Deal 8 damage. Pierce.', effects: [{ type: 'damage', value: 8, pierce: true }], targets: 'single', keywords: ['pierce'] });
createCard({ name: 'Fiend Fire', type: CARDS.ATTACK, cost: 2, rarity: CARDS.RARE, description: 'Consume a card from hand. Deal 20 damage.', effects: [{ type: 'consumeCard' }, { type: 'damage', value: 20 }], targets: 'single', keywords: ['consume'] });
createCard({ name: 'Whirlwind', type: CARDS.ATTACK, cost: -1, rarity: CARDS.RARE, description: 'Deal 5 damage to ALL enemies X times. (X = energy spent)', effects: [{ type: 'damage', value: 5, xCost: true }], targets: 'all' });
createCard({ name: 'Searing Blade', type: CARDS.ATTACK, cost: 1, rarity: CARDS.RARE, description: 'Deal 6 damage. Add a Burn card to your discard pile.', effects: [{ type: 'damage', value: 6 }, { type: 'addCard', card: 'Burn' }], targets: 'single' });
createCard({ name: 'Bleed Out', type: CARDS.ATTACK, cost: 1, rarity: CARDS.RARE, description: 'Double the Bleed on target. Deal damage equal to Bleed.', effects: [{ type: 'doubleStatus', status: 'bleed' }, { type: 'damagePerStatus', status: 'bleed' }], targets: 'single' });
createCard({ name: 'Catalyst', type: CARDS.ATTACK, cost: 1, rarity: CARDS.RARE, description: 'Double the Poison on target.', effects: [{ type: 'doubleStatus', status: 'poison' }], targets: 'single' });
createCard({ name: 'Corpse Explosion', type: CARDS.ATTACK, cost: 2, rarity: CARDS.RARE, description: 'Deal 8 damage. If target dies this turn, apply 15 Poison to ALL enemies.', effects: [{ type: 'damage', value: 8, onKill: { type: 'applyStatus', status: 'poison', value: 15, targets: 'all' } }], targets: 'single' });
createCard({ name: 'Heavy Heart', type: CARDS.ATTACK, cost: 2, rarity: CARDS.RARE, description: 'Deal damage equal to your missing HP.', effects: [{ type: 'damageFromMissingHP' }], targets: 'single' });
createCard({ name: 'Last Stand', type: CARDS.ATTACK, cost: 0, rarity: CARDS.RARE, description: 'Deal damage equal to your current HP. Exhaust.', effects: [{ type: 'damageFromHP' }], targets: 'single', exhausts: true });
createCard({ name: 'Sword Storm', type: CARDS.ATTACK, cost: 2, rarity: CARDS.RARE, description: 'Deal 4 damage 5 times to random enemies.', effects: [{ type: 'damage', value: 4, times: 5 }], targets: 'random' });

createCard({ name: 'Iron Wall', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.COMMON, description: 'Gain 7 block.', effects: [{ type: 'block', value: 7 }], targets: 'self' });
createCard({ name: 'Dodge Roll', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.COMMON, description: 'Gain 4 block. Draw 1 card.', effects: [{ type: 'block', value: 4 }, { type: 'draw', value: 1 }], targets: 'self' });
createCard({ name: 'Reinforce', type: CARDS.DEFENSE, cost: 2, rarity: CARDS.COMMON, description: 'Gain 12 block.', effects: [{ type: 'block', value: 12 }], targets: 'self' });
createCard({ name: 'Parry', type: CARDS.DEFENSE, cost: 0, rarity: CARDS.COMMON, description: 'Gain 3 block. If you took no damage last turn, gain 6 instead.', effects: [{ type: 'block', value: 3, conditional: { type: 'noDamageLastTurn', bonusValue: 6 } }], targets: 'self' });
createCard({ name: 'Shield Bash', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.COMMON, description: 'Gain 5 block. Deal 5 damage.', effects: [{ type: 'block', value: 5 }, { type: 'damage', value: 5 }], targets: 'single' });
createCard({ name: 'Bandage Up', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.COMMON, description: 'Heal 6 HP.', effects: [{ type: 'heal', value: 6 }], targets: 'self' });

createCard({ name: 'Spirit Shield', type: CARDS.DEFENSE, cost: 2, rarity: CARDS.UNCOMMON, description: 'Gain 1 block for each card in your hand.', effects: [{ type: 'blockPerHand' }], targets: 'self' });
createCard({ name: 'Flame Barrier', type: CARDS.DEFENSE, cost: 2, rarity: CARDS.UNCOMMON, description: 'Gain 8 block. Deal 3 damage to attackers this turn.', effects: [{ type: 'block', value: 8 }, { type: 'thorns', value: 3 }], targets: 'self', keywords: ['thorns'] });
createCard({ name: 'Impervious', type: CARDS.DEFENSE, cost: 2, rarity: CARDS.RARE, description: 'Gain 20 block. Exhaust.', effects: [{ type: 'block', value: 20 }], targets: 'self', exhausts: true });
createCard({ name: 'Juggernaut', type: CARDS.DEFENSE, cost: 2, rarity: CARDS.RARE, description: 'Gain 10 block. Whenever you gain block this combat, deal 3 damage to random enemy.', effects: [{ type: 'block', value: 10 }, { type: 'buff', buff: 'juggernaut', value: 3 }], targets: 'self' });
createCard({ name: 'Entrench', type: CARDS.DEFENSE, cost: 2, rarity: CARDS.UNCOMMON, description: 'Double your current block.', effects: [{ type: 'doubleBlock' }], targets: 'self' });
createCard({ name: 'Metallicize', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.RARE, description: 'Gain 4 block. At the end of each turn, gain 2 block.', effects: [{ type: 'block', value: 4 }, { type: 'buff', buff: 'metallicize', value: 2 }], targets: 'self' });
createCard({ name: 'Cleansing Rain', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.UNCOMMON, description: 'Remove all debuffs from yourself.', effects: [{ type: 'cleanse' }], targets: 'self' });
createCard({ name: 'Second Wind', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.UNCOMMON, description: 'Heal 4 HP. Gain 4 block.', effects: [{ type: 'heal', value: 4 }, { type: 'block', value: 4 }], targets: 'self' });
createCard({ name: "Reaper's Blessing", type: CARDS.DEFENSE, cost: 2, rarity: CARDS.RARE, description: 'Heal 15 HP. Add a Curse to your deck.', effects: [{ type: 'heal', value: 15 }, { type: 'addCardToDeck', card: 'Normality' }], targets: 'self' });
createCard({ name: 'Blood Pact', type: CARDS.DEFENSE, cost: 0, rarity: CARDS.UNCOMMON, description: 'Lose 3 HP. Gain 8 block. Draw 1 card.', effects: [{ type: 'selfDamage', value: 3 }, { type: 'block', value: 8 }, { type: 'draw', value: 1 }], targets: 'self' });
createCard({ name: 'Ghostly Armor', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.UNCOMMON, description: 'Gain 10 block. Retain.', effects: [{ type: 'block', value: 10 }], targets: 'self', retains: true, keywords: ['retain'] });
createCard({ name: 'Power Through', type: CARDS.DEFENSE, cost: 1, rarity: CARDS.UNCOMMON, description: 'Gain 8 block. Add 2 Burn cards to discard pile.', effects: [{ type: 'block', value: 8 }, { type: 'addCard', card: 'Burn', times: 2 }], targets: 'self' });
createCard({ name: 'Rage', type: CARDS.DEFENSE, cost: 0, rarity: CARDS.UNCOMMON, description: 'Whenever you play an Attack this turn, gain 3 block.', effects: [{ type: 'buff', buff: 'rage', value: 3 }], targets: 'self' });

createCard({ name: 'Battle Plan', type: CARDS.SKILL, cost: 1, rarity: CARDS.COMMON, description: 'Draw 3 cards.', effects: [{ type: 'draw', value: 3 }], targets: 'self' });
createCard({ name: 'Acrobatics', type: CARDS.SKILL, cost: 1, rarity: CARDS.COMMON, description: 'Draw 3 cards, discard 1 card.', effects: [{ type: 'draw', value: 3 }, { type: 'discard', value: 1 }], targets: 'self' });
createCard({ name: 'Calculated Gamble', type: CARDS.SKILL, cost: 0, rarity: CARDS.UNCOMMON, description: 'Discard your hand, draw that many cards.', effects: [{ type: 'discardHand' }, { type: 'drawDiscarded' }], targets: 'self' });
createCard({ name: 'Deep Breath', type: CARDS.SKILL, cost: 1, rarity: CARDS.RARE, description: 'Draw 1 card for each card in your discard pile (max 10).', effects: [{ type: 'drawPerDiscard', max: 10 }], targets: 'self' });
createCard({ name: 'Adrenaline', type: CARDS.SKILL, cost: 0, rarity: CARDS.RARE, description: 'Gain 2 energy. Draw 2 cards.', effects: [{ type: 'energy', value: 2 }, { type: 'draw', value: 2 }], targets: 'self' });
createCard({ name: 'Seeing Red', type: CARDS.SKILL, cost: 1, rarity: CARDS.UNCOMMON, description: 'Gain 2 energy. Exhaust.', effects: [{ type: 'energy', value: 2 }], targets: 'self', exhausts: true });
createCard({ name: 'Blood for Blood', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Lose 2 HP. Gain 1 energy.', effects: [{ type: 'selfDamage', value: 2 }, { type: 'energy', value: 1 }], targets: 'self' });
createCard({ name: 'Concentrate', type: CARDS.SKILL, cost: 0, rarity: CARDS.UNCOMMON, description: 'Discard 3 cards. Gain 2 energy.', effects: [{ type: 'discard', value: 3 }, { type: 'energy', value: 2 }], targets: 'self' });
createCard({ name: 'Armaments', type: CARDS.SKILL, cost: 1, rarity: CARDS.COMMON, description: 'Upgrade a card in your hand this combat.', effects: [{ type: 'upgradeHand' }], targets: 'self' });
createCard({ name: 'Warcry', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Draw 1 card. Place a card from your hand on top of your draw pile.', effects: [{ type: 'draw', value: 1 }, { type: 'topDeck' }], targets: 'self' });
createCard({ name: 'Havoc', type: CARDS.SKILL, cost: 1, rarity: CARDS.UNCOMMON, description: 'Play the top card of your draw pile. Exhaust.', effects: [{ type: 'playTopCard' }], targets: 'self', exhausts: true });
createCard({ name: 'Flash of Steel', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Deal 3 damage. Draw 1 card.', effects: [{ type: 'damage', value: 3 }, { type: 'draw', value: 1 }], targets: 'single' });
createCard({ name: 'Inflame', type: CARDS.SKILL, cost: 1, rarity: CARDS.UNCOMMON, description: 'Gain 2 Strength.', effects: [{ type: 'buff', buff: 'strength', value: 2 }], targets: 'self' });
createCard({ name: 'Flex', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Gain 2 Strength. Lose 2 Strength at end of turn.', effects: [{ type: 'buff', buff: 'strength', value: 2, temporary: true }], targets: 'self' });
createCard({ name: 'Demon Form', type: CARDS.SKILL, cost: 3, rarity: CARDS.RARE, description: 'At the start of each turn, gain 2 Strength.', effects: [{ type: 'buff', buff: 'demonForm', value: 2 }], targets: 'self' });
createCard({ name: 'No Pain No Gain', type: CARDS.SKILL, cost: 1, rarity: CARDS.RARE, description: 'Whenever you lose HP this combat, draw 1 card.', effects: [{ type: 'buff', buff: 'noPainNoGain' }], targets: 'self' });
createCard({ name: 'Combust', type: CARDS.SKILL, cost: 1, rarity: CARDS.UNCOMMON, description: 'At the end of each turn, lose 1 HP and deal 5 damage to ALL enemies.', effects: [{ type: 'buff', buff: 'combust', value: 5 }], targets: 'self' });
createCard({ name: 'Panic Button', type: CARDS.SKILL, cost: 0, rarity: CARDS.COMMON, description: 'Gain 1 energy. Add a Dazed to your hand.', effects: [{ type: 'energy', value: 1 }, { type: 'addCardToHand', card: 'Dazed' }], targets: 'self' });
createCard({ name: 'Discovery', type: CARDS.SKILL, cost: 1, rarity: CARDS.RARE, description: 'Choose 1 of 3 random cards. Add it to your hand. It costs 0 this turn.', effects: [{ type: 'discover', count: 3, cost: 0 }], targets: 'self' });
createCard({ name: 'Panacea', type: CARDS.SKILL, cost: 0, rarity: CARDS.RARE, description: 'Gain 1 Strength, 1 Dexterity. Exhaust.', effects: [{ type: 'buff', buff: 'strength', value: 1 }, { type: 'buff', buff: 'dexterity', value: 1 }], targets: 'self', exhausts: true });

createCard({ name: 'Normality', type: CARDS.CURSE, cost: -2, rarity: CARDS.COMMON, description: 'Unplayable. You cannot play more than 3 cards this turn.', effects: [], targets: 'none', keywords: ['unplayable'] });
createCard({ name: 'Pain', type: CARDS.CURSE, cost: -2, rarity: CARDS.COMMON, description: 'Unplayable. Whenever drawn, lose 1 HP.', effects: [], targets: 'none', keywords: ['unplayable'], onDraw: { type: 'selfDamage', value: 1 } });
createCard({ name: 'Doubt', type: CARDS.CURSE, cost: -2, rarity: CARDS.COMMON, description: 'Unplayable. Whenever drawn, apply 1 Weak to yourself.', effects: [], targets: 'none', keywords: ['unplayable'], onDraw: { type: 'selfStatus', status: 'weak', value: 1 } });
createCard({ name: 'Burn', type: CARDS.CURSE, cost: -2, rarity: CARDS.COMMON, description: 'Unplayable. At the end of your turn, take 2 damage.', effects: [], targets: 'none', keywords: ['unplayable'], endTurn: { type: 'selfDamage', value: 2 } });
createCard({ name: 'Dazed', type: CARDS.CURSE, cost: -2, rarity: CARDS.COMMON, description: 'Unplayable. This card is removed from your deck at the end of combat.', effects: [], targets: 'none', keywords: ['unplayable'] });

function createCardInstance(cardName) {
    const template = CARDS.get(cardName);
    if (!template) return null;
    return {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        upgraded: false
    };
}

function upgradeCard(card) {
    if (!card || card.upgraded) return card;
    
    const upgraded = { ...card, upgraded: true };
    
    if (card.upgrade) {
        if (card.upgrade.cost !== undefined) upgraded.cost = card.upgrade.cost;
        if (card.upgrade.damage) {
            upgraded.effects = card.effects.map(e => 
                e.type === 'damage' ? { ...e, value: card.upgrade.damage } : e
            );
        }
        if (card.upgrade.block) {
            upgraded.effects = card.effects.map(e => 
                e.type === 'block' ? { ...e, value: card.upgrade.block } : e
            );
        }
        if (card.upgrade.description) {
            upgraded.description = card.upgrade.description;
        }
    }
    
    return upgraded;
}

function buildStartingDeck() {
    const deck = [];
    for (const entry of STARTING_DECK) {
        for (let i = 0; i < entry.count; i++) {
            deck.push(createCardInstance(entry.name));
        }
    }
    return deck;
}
