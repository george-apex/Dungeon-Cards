const RELICS = {
    all: [],
    byRarity: { common: [], uncommon: [], rare: [] },
    
    get(name) {
        return this.all.find(r => r.name === name);
    },
    
    getRandom(rarity = null) {
        const pool = rarity ? this.byRarity[rarity] : this.all;
        return Random.pick(pool);
    },
    
    getByRarity(rarity) {
        return this.byRarity[rarity] || [];
    }
};

function createRelic(data) {
    const relic = {
        name: data.name,
        rarity: data.rarity,
        description: data.description,
        flavor: data.flavor || '',
        effect: data.effect || {},
        sprite: data.sprite || 'relic'
    };
    RELICS.all.push(relic);
    RELICS.byRarity[data.rarity].push(relic);
    return relic;
}

createRelic({
    name: "Adventurer's Pack",
    rarity: 'common',
    description: 'At the start of each combat, draw 2 additional cards.',
    flavor: 'Every journey begins with preparation.',
    effect: { type: 'startCombatDraw', value: 2 },
    sprite: 'backpack'
});

createRelic({
    name: 'Iron Heart',
    rarity: 'common',
    description: '+15 Max HP.',
    effect: { type: 'maxHP', value: 15 },
    sprite: 'heart'
});

createRelic({
    name: 'Lucky Coin',
    rarity: 'common',
    description: '+10% chance for double gold rewards.',
    effect: { type: 'goldBonus', value: 0.1 },
    sprite: 'coin'
});

createRelic({
    name: "Traveler's Boots",
    rarity: 'common',
    description: '+1 card draw at start of combat.',
    effect: { type: 'startCombatDraw', value: 1 },
    sprite: 'boots'
});

createRelic({
    name: 'Sharp Blade',
    rarity: 'common',
    description: '+2 damage to first attack each combat.',
    effect: { type: 'firstAttackBonus', value: 2 },
    sprite: 'blade'
});

createRelic({
    name: 'Tough Hide',
    rarity: 'common',
    description: 'Reduce first damage taken each combat by 5.',
    effect: { type: 'firstDamageReduction', value: 5 },
    sprite: 'hide'
});

createRelic({
    name: 'Quick Fingers',
    rarity: 'common',
    description: 'Start combat with 1 extra energy (first turn only).',
    effect: { type: 'firstTurnEnergy', value: 1 },
    sprite: 'fingers'
});

createRelic({
    name: 'Potion Belt',
    rarity: 'common',
    description: 'Can carry 1 additional potion.',
    effect: { type: 'potionSlots', value: 1 },
    sprite: 'belt'
});

createRelic({
    name: 'Gold Pouch',
    rarity: 'common',
    description: 'Start each combat with 5 gold.',
    effect: { type: 'combatGold', value: 5 },
    sprite: 'pouch'
});

createRelic({
    name: "Scout's Eye",
    rarity: 'common',
    description: 'See enemy intents 1 turn in advance.',
    effect: { type: 'seeIntents', value: 1 },
    sprite: 'eye'
});

createRelic({
    name: 'Healing Salve',
    rarity: 'common',
    description: 'Heal 2 HP after each combat.',
    effect: { type: 'postCombatHeal', value: 2 },
    sprite: 'salve'
});

createRelic({
    name: 'Burning Blood',
    rarity: 'uncommon',
    description: 'Heal 6 HP after killing an enemy.',
    effect: { type: 'killHeal', value: 6 },
    sprite: 'blood'
});

createRelic({
    name: 'Shuriken',
    rarity: 'uncommon',
    description: 'Every 3rd Attack card played, gain 1 Strength.',
    effect: { type: 'attackCounter', threshold: 3, bonus: { stat: 'strength', value: 1 } },
    sprite: 'shuriken'
});

createRelic({
    name: 'Kunai',
    rarity: 'uncommon',
    description: 'Every 3rd Attack card played, gain 1 Dexterity.',
    effect: { type: 'attackCounter', threshold: 3, bonus: { stat: 'dexterity', value: 1 } },
    sprite: 'kunai'
});

createRelic({
    name: 'Orichalcum',
    rarity: 'uncommon',
    description: 'At end of turn, if you have no block, gain 6 block.',
    effect: { type: 'noBlockBonus', value: 6 },
    sprite: 'orichalcum'
});

createRelic({
    name: 'Anchor',
    rarity: 'uncommon',
    description: 'Start combat with 10 block.',
    effect: { type: 'startCombatBlock', value: 10 },
    sprite: 'anchor'
});

createRelic({
    name: 'Lantern',
    rarity: 'uncommon',
    description: 'Start each turn with 1 extra energy.',
    effect: { type: 'turnEnergy', value: 1 },
    sprite: 'lantern'
});

createRelic({
    name: 'Bag of Preparation',
    rarity: 'uncommon',
    description: 'Draw 2 additional cards first turn of combat.',
    effect: { type: 'firstTurnDraw', value: 2 },
    sprite: 'bag'
});

createRelic({
    name: 'Vajra',
    rarity: 'uncommon',
    description: 'Start each combat with 1 Strength.',
    effect: { type: 'startCombatStrength', value: 1 },
    sprite: 'vajra'
});

createRelic({
    name: 'Bag of Marbles',
    rarity: 'uncommon',
    description: 'Apply 1 Vulnerable to ALL enemies at start of combat.',
    effect: { type: 'startCombatVulnerable', value: 1 },
    sprite: 'marbles'
});

createRelic({
    name: 'Smiling Mask',
    rarity: 'uncommon',
    description: 'Shop card removal services cost 0 gold (once per shop).',
    effect: { type: 'freeRemove', value: 1 },
    sprite: 'mask'
});

createRelic({
    name: 'Dead Branch',
    rarity: 'rare',
    description: 'Whenever you Exhaust a card, add a random card to hand.',
    effect: { type: 'exhaustBonus', action: 'randomCard' },
    sprite: 'branch'
});

createRelic({
    name: 'Runic Cube',
    rarity: 'rare',
    description: 'Whenever you lose HP, draw 1 card.',
    effect: { type: 'damageDraw', value: 1 },
    sprite: 'cube'
});

createRelic({
    name: 'Runic Dome',
    rarity: 'rare',
    description: 'Draw 2 cards at start of each turn, but cannot see enemy intents.',
    effect: { type: 'turnDraw', value: 2, penalty: 'noIntents' },
    sprite: 'dome'
});

createRelic({
    name: 'Snecko Eye',
    rarity: 'rare',
    description: 'Start each combat with 2 random cards costing 0.',
    effect: { type: 'startCombatZeroCost', value: 2 },
    sprite: 'snecko'
});

createRelic({
    name: 'Sozu',
    rarity: 'rare',
    description: 'Gain 1 energy at start of each turn, but can no longer obtain potions.',
    effect: { type: 'turnEnergy', value: 1, penalty: 'noPotions' },
    sprite: 'sozu'
});

createRelic({
    name: 'Ectoplasm',
    rarity: 'rare',
    description: 'Gain 1 energy at start of each turn, but can no longer obtain gold.',
    effect: { type: 'turnEnergy', value: 1, penalty: 'noGold' },
    sprite: 'ectoplasm'
});

createRelic({
    name: 'Fusion Hammer',
    rarity: 'rare',
    description: 'Gain 1 energy at start of each turn, but can no longer upgrade cards.',
    effect: { type: 'turnEnergy', value: 1, penalty: 'noUpgrades' },
    sprite: 'hammer'
});

createRelic({
    name: "Philosopher's Stone",
    rarity: 'rare',
    description: 'Gain 1 energy at start of each turn, but enemies have +1 Strength.',
    effect: { type: 'turnEnergy', value: 1, penalty: 'enemyStrength', penaltyValue: 1 },
    sprite: 'stone'
});

createRelic({
    name: 'Mark of Pain',
    rarity: 'rare',
    description: 'Start combat with 2 Strength, but add a Burn card to deck each combat.',
    effect: { type: 'startCombatStrength', value: 2, penalty: 'addBurn' },
    sprite: 'mark'
});

createRelic({
    name: 'Brimstone',
    rarity: 'rare',
    description: 'At start of each turn, gain 2 Strength, but ALL enemies gain 1 Strength.',
    effect: { type: 'turnStrength', value: 2, penalty: 'enemyTurnStrength', penaltyValue: 1 },
    sprite: 'brimstone'
});
