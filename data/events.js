const EVENTS = {
    all: [],
    
    getRandom() {
        return Random.pick(this.all);
    }
};

function createEvent(data) {
    const event = {
        id: data.id,
        name: data.name,
        description: data.description,
        choices: data.choices,
        sprite: data.sprite || 'event'
    };
    EVENTS.all.push(event);
    return event;
}

createEvent({
    id: 'shrine',
    name: 'The Shrine',
    description: 'An ancient shrine glows with mysterious energy.',
    choices: [
        { text: 'Pray for strength', effect: { buff: 'strength', value: 1, selfDamage: 5 } },
        { text: 'Pray for protection', effect: { buff: 'dexterity', value: 1, selfDamage: 5 } },
        { text: 'Pray for wisdom', effect: { upgradeRandom: true, selfDamage: 5 } },
        { text: 'Leave', effect: {} }
    ],
    sprite: 'shrine'
});

createEvent({
    id: 'gamble',
    name: "The Merchant's Gamble",
    description: 'A shady merchant offers a game of chance.',
    choices: [
        { text: 'Pay 50 gold to play', requires: { gold: 50 }, effect: { gamble: { cost: 50, winReward: 'rareRelic' } } },
        { text: 'Decline', effect: {} }
    ],
    sprite: 'merchant'
});

createEvent({
    id: 'tomb',
    name: 'The Forgotten Tomb',
    description: 'You discover an ancient tomb. It might hold treasure... or danger.',
    choices: [
        { text: 'Open it', effect: { random: [
            { weight: 40, effect: { gold: 100, relic: 'random' } },
            { weight: 40, effect: { fight: 'Skeleton Warrior', count: 2 } },
            { weight: 20, effect: { addCard: 'Normality' } }
        ]}},
        { text: 'Leave it alone', effect: {} }
    ],
    sprite: 'tomb'
});

createEvent({
    id: 'traveler',
    name: 'The Wounded Traveler',
    description: 'A wounded traveler lies on the path.',
    choices: [
        { text: 'Help them (lose 10 HP)', effect: { selfDamage: 10, potion: 'random', gold: 30 } },
        { text: 'Rob them', effect: { gold: 50, addCard: 'Normality' } },
        { text: 'Leave', effect: {} }
    ],
    sprite: 'traveler'
});

createEvent({
    id: 'darkPool',
    name: 'The Dark Pool',
    description: 'A pool of dark liquid bubbles ominously.',
    choices: [
        { text: 'Drink', effect: { random: [
            { weight: 33, effect: { buff: 'strength', value: 2 } },
            { weight: 34, effect: { selfDamage: 10 } },
            { weight: 33, effect: { addCard: 'Pain' } }
        ]}},
        { text: 'Fish in it', effect: { random: [
            { weight: 50, effect: { relic: 'random' } },
            { weight: 50, effect: { fight: 'Slime Cube' } }
        ]}},
        { text: 'Leave', effect: {} }
    ],
    sprite: 'pool'
});

createEvent({
    id: 'upgradeShrine',
    name: 'The Upgrade Shrine',
    description: 'A mystical forge burns eternally.',
    choices: [
        { text: 'Upgrade a card (free)', effect: { upgrade: true } },
        { text: 'Remove a card (costs 75 gold)', requires: { gold: 75 }, effect: { remove: true, goldCost: 75 } },
        { text: 'Leave', effect: {} }
    ],
    sprite: 'forge'
});

createEvent({
    id: 'beggar',
    name: 'The Beggar',
    description: 'A beggar asks for spare change.',
    choices: [
        { text: 'Give 25 gold', requires: { gold: 25 }, effect: { goldCost: 25, relic: 'common' } },
        { text: 'Give 50 gold', requires: { gold: 50 }, effect: { goldCost: 50, relic: 'uncommon' } },
        { text: 'Refuse', effect: {} }
    ],
    sprite: 'beggar'
});

createEvent({
    id: 'trappedChest',
    name: 'The Trapped Chest',
    description: 'A chest sits in the middle of the room. It might be trapped.',
    choices: [
        { text: 'Open carefully', effect: { random: [
            { weight: 70, effect: { gold: 50, potion: 'random' } },
            { weight: 30, effect: { fight: 'Mimic' } }
        ]}},
        { text: 'Smash it open', effect: { random: [
            { weight: 30, effect: { gold: 75, relic: 'random' } },
            { weight: 70, effect: { fight: 'Mimic', bonusHP: 10 } }
        ]}},
        { text: 'Leave', effect: {} }
    ],
    sprite: 'chest'
});

createEvent({
    id: 'portal',
    name: 'The Portal',
    description: 'A swirling portal appears before you.',
    choices: [
        { text: 'Enter', effect: { teleport: true } },
        { text: 'Touch it', effect: { random: [
            { weight: 50, effect: { buff: 'random' } },
            { weight: 50, effect: { debuff: 'random' } }
        ]}},
        { text: 'Walk away', effect: {} }
    ],
    sprite: 'portal'
});

createEvent({
    id: 'arena',
    name: 'The Arena',
    description: 'An ancient arena beckons. Glory awaits... or death.',
    choices: [
        { text: 'Fight for glory', effect: { arena: { battles: 3, rewards: { gold: 150, relic: 'rare', card: 'rare' } } } },
        { text: 'Decline', effect: {} }
    ],
    sprite: 'arena'
});

createEvent({
    id: 'fountain',
    name: 'The Fairy Fountain',
    description: 'A magical fountain sparkles with healing waters.',
    choices: [
        { text: 'Drink', effect: { fullHeal: true } },
        { text: 'Make a wish (costs 50 gold)', requires: { gold: 50 }, effect: { goldCost: 50, random: [
            { weight: 33, effect: { buff: 'strength', value: 2 } },
            { weight: 34, effect: { buff: 'dexterity', value: 2 } },
            { weight: 33, effect: { potion: 'random' } }
        ]}},
        { text: 'Leave', effect: {} }
    ],
    sprite: 'fountain'
});

createEvent({
    id: 'curseRemoval',
    name: 'The Curse Removal',
    description: 'A hooded figure offers to remove your burdens.',
    choices: [
        { text: 'Remove a Curse card (free)', effect: { removeCurse: true } },
        { text: 'Remove any card (costs 100 gold)', requires: { gold: 100 }, effect: { remove: true, goldCost: 100 } },
        { text: 'Decline', effect: {} }
    ],
    sprite: 'hooded'
});

createEvent({
    id: 'collector',
    name: 'The Card Collector',
    description: 'An eccentric collector wants to trade cards.',
    choices: [
        { text: 'Trade a card', effect: { trade: true } },
        { text: 'Buy a card (costs 50 gold)', requires: { gold: 50 }, effect: { goldCost: 50, chooseCard: 3 } },
        { text: 'Decline', effect: {} }
    ],
    sprite: 'collector'
});

createEvent({
    id: 'machine',
    name: 'The Ancient Machine',
    description: 'A strange machine hums with power.',
    choices: [
        { text: 'Activate', effect: { random: [
            { weight: 25, effect: { gold: 100 } },
            { weight: 25, effect: { potion: 'random', count: 2 } },
            { weight: 25, effect: { fight: 'random', count: 2 } },
            { weight: 25, effect: { relic: 'rare' } }
        ]}},
        { text: 'Destroy it', effect: { gold: 30 } },
        { text: 'Leave', effect: {} }
    ],
    sprite: 'machine'
});

createEvent({
    id: 'mirror',
    name: 'The Mirror',
    description: 'A magical mirror shows you... yourself?',
    choices: [
        { text: 'Look into it', effect: { duplicateCard: true } },
        { text: 'Smash it', effect: { random: [
            { weight: 50, effect: { gold: 50 } },
            { weight: 50, effect: { selfDamage: 10, addCard: 'Normality' } }
        ]}},
        { text: 'Leave', effect: {} }
    ],
    sprite: 'mirror'
});
