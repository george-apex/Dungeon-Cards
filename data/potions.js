const POTIONS = {
    all: [],
    byRarity: { common: [], uncommon: [], rare: [] },
    
    get(name) {
        return this.all.find(p => p.name === name);
    },
    
    getRandom(rarity = null) {
        const pool = rarity ? this.byRarity[rarity] : this.all;
        return Random.pick(pool);
    }
};

function createPotion(data) {
    const potion = {
        name: data.name,
        rarity: data.rarity,
        description: data.description,
        effect: data.effect,
        sprite: data.sprite || 'potion'
    };
    POTIONS.all.push(potion);
    POTIONS.byRarity[data.rarity].push(potion);
    return potion;
}

createPotion({
    name: 'Health Potion',
    rarity: 'common',
    description: 'Heal 20 HP.',
    effect: { type: 'heal', value: 20 },
    sprite: 'healthPotion'
});

createPotion({
    name: 'Block Potion',
    rarity: 'common',
    description: 'Gain 12 block.',
    effect: { type: 'block', value: 12 },
    sprite: 'blockPotion'
});

createPotion({
    name: 'Energy Potion',
    rarity: 'common',
    description: 'Gain 2 energy.',
    effect: { type: 'energy', value: 2 },
    sprite: 'energyPotion'
});

createPotion({
    name: 'Fire Potion',
    rarity: 'common',
    description: 'Deal 20 damage to target enemy.',
    effect: { type: 'damage', value: 20 },
    sprite: 'firePotion'
});

createPotion({
    name: 'Strength Potion',
    rarity: 'uncommon',
    description: 'Gain 2 Strength this combat.',
    effect: { type: 'buff', stat: 'strength', value: 2 },
    sprite: 'strengthPotion'
});

createPotion({
    name: 'Dexterity Potion',
    rarity: 'uncommon',
    description: 'Gain 2 Dexterity this combat.',
    effect: { type: 'buff', stat: 'dexterity', value: 2 },
    sprite: 'dexterityPotion'
});

createPotion({
    name: 'Speed Potion',
    rarity: 'uncommon',
    description: 'Draw 3 cards.',
    effect: { type: 'draw', value: 3 },
    sprite: 'speedPotion'
});

createPotion({
    name: 'Poison Potion',
    rarity: 'uncommon',
    description: 'Apply 6 Poison to target enemy.',
    effect: { type: 'applyStatus', status: 'poison', value: 6 },
    sprite: 'poisonPotion'
});

createPotion({
    name: 'Liquid Memory',
    rarity: 'rare',
    description: 'Choose a card in your discard pile, add it to your hand with 0 cost.',
    effect: { type: 'recallCard', cost: 0 },
    sprite: 'memoryPotion'
});

createPotion({
    name: 'Essence of Steel',
    rarity: 'rare',
    description: 'Gain 1 Strength and 1 Dexterity this combat.',
    effect: { type: 'multiBuff', buffs: [{ stat: 'strength', value: 1 }, { stat: 'dexterity', value: 1 }] },
    sprite: 'steelPotion'
});

createPotion({
    name: 'Bottled Lightning',
    rarity: 'rare',
    description: 'Draw until you have 5 cards in hand.',
    effect: { type: 'drawTo', value: 5 },
    sprite: 'lightningPotion'
});

createPotion({
    name: 'Fruit Juice',
    rarity: 'rare',
    description: 'Permanently gain 5 Max HP.',
    effect: { type: 'maxHP', value: 5 },
    sprite: 'fruitPotion'
});
