const ENEMIES = {
    all: [],
    byAct: { 1: [], 2: [], 3: [] },
    elites: [],
    bosses: [],
    
    get(name) {
        return this.all.find(e => e.name === name);
    },
    
    getRandom(act, isElite = false) {
        if (isElite) {
            const pool = this.elites.filter(e => e.act === act);
            return Random.pick(pool);
        }
        return Random.pick(this.byAct[act]);
    }
};

function createEnemy(data) {
    const enemy = {
        name: data.name,
        act: data.act,
        hpMin: data.hpMin,
        hpMax: data.hpMax,
        sprite: data.sprite,
        size: data.size || 1,
        moveset: data.moveset,
        isElite: data.isElite || false,
        isBoss: data.isBoss || false,
        phases: data.phases || null
    };
    ENEMIES.all.push(enemy);
    if (enemy.isBoss) {
        ENEMIES.bosses.push(enemy);
    } else if (enemy.isElite) {
        ENEMIES.elites.push(enemy);
    } else {
        ENEMIES.byAct[data.act].push(enemy);
    }
    return enemy;
}

createEnemy({
    name: 'Slime Cube',
    act: 1,
    hpMin: 12,
    hpMax: 18,
    sprite: 'slime',
    size: 1,
    moveset: [
        { weight: 40, action: { type: 'attack', damage: 5, name: 'Tackle' } },
        { weight: 30, action: { type: 'split', name: 'Split' } },
        { weight: 30, action: { type: 'block', value: 6, name: 'Goo Shield' } }
    ]
});

createEnemy({
    name: 'Small Slime',
    act: 1,
    hpMin: 6,
    hpMax: 8,
    sprite: 'smallSlime',
    size: 0.75,
    moveset: [
        { weight: 60, action: { type: 'attack', damage: 3, name: 'Tackle' } },
        { weight: 40, action: { type: 'block', value: 4, name: 'Goo Shield' } }
    ]
});

createEnemy({
    name: 'Skeleton Warrior',
    act: 1,
    hpMin: 18,
    hpMax: 24,
    sprite: 'skeleton',
    size: 1,
    moveset: [
        { weight: 50, action: { type: 'attack', damage: 7, name: 'Bone Slash' } },
        { weight: 30, action: { type: 'block', value: 8, name: 'Shield Up' } },
        { weight: 20, action: { type: 'debuff', status: 'weak', value: 1, name: 'Rattle' } }
    ]
});

createEnemy({
    name: 'Goblin Scout',
    act: 1,
    hpMin: 14,
    hpMax: 20,
    sprite: 'goblin',
    size: 1,
    moveset: [
        { weight: 45, action: { type: 'attack', damage: 6, name: 'Stab' } },
        { weight: 35, action: { type: 'attack', damage: 4, times: 2, name: 'Quick Slash' } },
        { weight: 20, action: { type: 'block', value: 6, name: 'Dodge' } }
    ]
});

createEnemy({
    name: 'Cultist',
    act: 1,
    hpMin: 20,
    hpMax: 28,
    sprite: 'cultist',
    size: 1,
    moveset: [
        { weight: 50, action: { type: 'attack', damage: 6, scaling: 'strength', name: 'Dark Strike' } },
        { weight: 30, action: { type: 'buff', stat: 'strength', value: 1, name: 'Chant' } },
        { weight: 20, action: { type: 'sacrifice', hpLoss: 3, stat: 'strength', value: 2, name: 'Sacrifice' } }
    ],
    firstMove: { type: 'buff', stat: 'strength', value: 1, name: 'Ritual' }
});

createEnemy({
    name: 'Giant Rat',
    act: 1,
    hpMin: 10,
    hpMax: 14,
    sprite: 'rat',
    size: 1,
    moveset: [
        { weight: 60, action: { type: 'attack', damage: 4, applyStatus: { status: 'bleed', value: 1 }, name: 'Bite' } },
        { weight: 40, action: { type: 'block', value: 4, name: 'Scurry' } }
    ]
});

createEnemy({
    name: 'Jaw Worm',
    act: 1,
    hpMin: 22,
    hpMax: 30,
    sprite: 'worm',
    size: 1.5,
    moveset: [
        { weight: 40, action: { type: 'attack', damage: 9, name: 'Chomp' } },
        { weight: 35, action: { type: 'blockAndBuff', block: 5, stat: 'strength', value: 1, name: 'Bellow' } },
        { weight: 25, action: { type: 'buffAndHeal', stat: 'strength', value: 2, heal: 3, name: 'Inhale' } }
    ]
});

createEnemy({
    name: 'Demon Imp',
    act: 2,
    hpMin: 16,
    hpMax: 22,
    sprite: 'imp',
    size: 1,
    moveset: [
        { weight: 50, action: { type: 'attack', damage: 8, addCard: 'Burn', name: 'Fireball' } },
        { weight: 30, action: { type: 'block', value: 6, name: 'Dodge' } },
        { weight: 20, action: { type: 'addCard', card: 'Burn', times: 2, name: 'Hellfire' } }
    ]
});

createEnemy({
    name: 'Stone Golem',
    act: 2,
    hpMin: 40,
    hpMax: 55,
    sprite: 'golem',
    size: 2,
    moveset: [
        { weight: 40, action: { type: 'attack', damage: 14, name: 'Slam' } },
        { weight: 30, action: { type: 'block', value: 15, name: 'Harden' } },
        { weight: 20, action: { type: 'attackAndDebuff', damage: 8, status: 'frail', value: 1, name: 'Earthquake' } },
        { weight: 10, action: { type: 'heal', value: 8, name: 'Regenerate' } }
    ]
});

createEnemy({
    name: 'Dark Knight',
    act: 2,
    hpMin: 35,
    hpMax: 45,
    sprite: 'darkKnight',
    size: 1.5,
    moveset: [
        { weight: 35, action: { type: 'attack', damage: 12, name: 'Power Strike' } },
        { weight: 30, action: { type: 'block', value: 18, name: 'Shield Wall' } },
        { weight: 20, action: { type: 'attackAndDebuff', damage: 8, status: 'vulnerable', value: 2, name: 'Dark Blade' } },
        { weight: 15, action: { type: 'attackAndHeal', damage: 6, heal: 6, name: 'Drain Life' } }
    ]
});

createEnemy({
    name: 'Swarm of Bats',
    act: 2,
    hpMin: 25,
    hpMax: 35,
    sprite: 'bats',
    size: 1.5,
    moveset: [
        { weight: 50, action: { type: 'attack', damage: 4, times: 3, lifesteal: true, name: 'Blood Drain' } },
        { weight: 30, action: { type: 'attackAndDebuff', damage: 6, status: 'weak', value: 1, name: 'Screech' } },
        { weight: 20, action: { type: 'block', value: 10, name: 'Evasion' } }
    ]
});

createEnemy({
    name: 'Necromancer',
    act: 2,
    hpMin: 28,
    hpMax: 38,
    sprite: 'necromancer',
    size: 1.5,
    moveset: [
        { weight: 40, action: { type: 'attack', damage: 10, name: 'Dark Bolt' } },
        { weight: 30, action: { type: 'summon', enemy: 'Skeleton Warrior', max: 3, name: 'Raise Dead' } },
        { weight: 20, action: { type: 'selfDamageAndAttack', selfDamage: 3, damage: 15, name: 'Life Tap' } },
        { weight: 10, action: { type: 'addCard', card: 'Normality', name: 'Curse' } }
    ],
    firstMove: { type: 'summon', enemy: 'Skeleton Warrior', name: 'Raise Dead' }
});

createEnemy({
    name: 'Mimic',
    act: 2,
    hpMin: 30,
    hpMax: 40,
    sprite: 'mimic',
    size: 1.5,
    moveset: [
        { weight: 40, action: { type: 'attack', damage: 12, name: 'Surprise Attack' } },
        { weight: 30, action: { type: 'attackAndSteal', damage: 6, gold: 10, name: 'Gold Spray' } },
        { weight: 20, action: { type: 'attackAndDebuff', damage: 8, status: 'bleed', value: 2, name: 'Chomp' } },
        { weight: 10, action: { type: 'attackAll', damage: 5, selfDamage: 5, dropGold: 15, name: 'Treasure Burst' } }
    ]
});

createEnemy({
    name: 'Vampire Lord',
    act: 3,
    hpMin: 50,
    hpMax: 65,
    sprite: 'vampire',
    size: 1.5,
    moveset: [
        { weight: 35, action: { type: 'attackAndHeal', damage: 10, heal: 10, name: 'Vampiric Bite' } },
        { weight: 25, action: { type: 'block', value: 20, name: 'Mist Form' } },
        { weight: 20, action: { type: 'attackAndDebuff', damage: 8, status: 'weak', value: 2, name: 'Blood Control' } },
        { weight: 20, action: { type: 'summon', enemy: 'Bat', count: 2, name: 'Summon Bats' } }
    ]
});

createEnemy({
    name: 'Bat',
    act: 3,
    hpMin: 8,
    hpMax: 12,
    sprite: 'bat',
    size: 0.5,
    moveset: [
        { weight: 70, action: { type: 'attack', damage: 4, name: 'Bite' } },
        { weight: 30, action: { type: 'block', value: 3, name: 'Screech' } }
    ]
});

createEnemy({
    name: 'Shadow Assassin',
    act: 3,
    hpMin: 38,
    hpMax: 50,
    sprite: 'assassin',
    size: 1.5,
    moveset: [
        { weight: 40, action: { type: 'attack', damage: 16, bonusIfNoBlock: 24, name: 'Backstab' } },
        { weight: 30, action: { type: 'block', value: 12, name: 'Smoke Bomb' } },
        { weight: 20, action: { type: 'attackAndDebuff', damage: 8, status: 'poison', value: 4, name: 'Poison Blade' } },
        { weight: 10, action: { type: 'untargetable', name: 'Vanish' } }
    ]
});

createEnemy({
    name: 'Elder Treant',
    act: 3,
    hpMin: 60,
    hpMax: 80,
    sprite: 'treant',
    size: 2.5,
    moveset: [
        { weight: 35, action: { type: 'attack', damage: 14, name: 'Branch Smash' } },
        { weight: 25, action: { type: 'attackAndDebuff', damage: 8, status: 'vulnerable', value: 2, name: 'Root Bind' } },
        { weight: 20, action: { type: 'healAndBlock', heal: 12, block: 8, name: 'Photosynthesis' } },
        { weight: 20, action: { type: 'summon', enemy: 'Sapling', count: 2, name: 'Summon Saplings' } }
    ]
});

createEnemy({
    name: 'Sapling',
    act: 3,
    hpMin: 10,
    hpMax: 15,
    sprite: 'sapling',
    size: 0.75,
    moveset: [
        { weight: 70, action: { type: 'attack', damage: 4, name: 'Whip' } },
        { weight: 30, action: { type: 'healAlly', value: 5, ally: 'Elder Treant', name: 'Grow' } }
    ]
});

createEnemy({
    name: 'Chaos Elemental',
    act: 3,
    hpMin: 45,
    hpMax: 60,
    sprite: 'chaos',
    size: 1.5,
    moveset: [
        { weight: 30, action: { type: 'attack', damageMin: 10, damageMax: 20, name: 'Chaos Bolt' } },
        { weight: 25, action: { type: 'randomDebuff', count: 2, name: 'Reality Tear' } },
        { weight: 25, action: { type: 'block', value: 15, name: 'Void Shield' } },
        { weight: 20, action: { type: 'attackAll', damage: 15, selfDamage: 15, name: 'Unstable' } }
    ]
});

createEnemy({
    name: 'Death Knight',
    act: 3,
    hpMin: 70,
    hpMax: 90,
    sprite: 'deathKnight',
    size: 2,
    moveset: [
        { weight: 30, action: { type: 'attackAndHeal', damage: 18, healPercent: 50, name: 'Soul Reaver' } },
        { weight: 25, action: { type: 'attackAndDebuff', damage: 12, status: 'poison', value: 3, name: 'Death Coil' } },
        { weight: 20, action: { type: 'block', value: 25, name: 'Bone Armor' } },
        { weight: 15, action: { type: 'summon', enemy: 'Skeleton Warrior', max: 2, name: 'Army of One' } },
        { weight: 10, action: { type: 'execute', damage: 15, executeDamage: 40, threshold: 0.3, name: 'Death Strike' } }
    ]
});

createEnemy({
    name: 'Mind Flayer',
    act: 3,
    hpMin: 55,
    hpMax: 70,
    sprite: 'mindFlayer',
    size: 1.5,
    moveset: [
        { weight: 35, action: { type: 'attack', damage: 14, drawReduction: 1, name: 'Mind Blast' } },
        { weight: 25, action: { type: 'attackPerCards', damagePerCard: 3, name: 'Psychic Crush' } },
        { weight: 20, action: { type: 'addRandomCards', count: 2, name: 'Confusion' } },
        { weight: 20, action: { type: 'dominate', name: 'Dominate' } }
    ]
});

createEnemy({
    name: 'The Lich King',
    act: 1,
    hpMin: 180,
    hpMax: 220,
    sprite: 'lichKing',
    size: 3,
    isBoss: true,
    phases: [
        {
            hpThreshold: 0.5,
            moveset: [
                { weight: 30, action: { type: 'attackAndHeal', damage: 15, healPercent: 100, name: 'Soul Drain' } },
                { weight: 25, action: { type: 'summon', enemy: 'Skeleton Warrior', count: 2, name: 'Summon Undead' } },
                { weight: 25, action: { type: 'attackAndDebuff', damage: 8, status: 'poison', value: 3, name: 'Death Coil' } },
                { weight: 20, action: { type: 'block', value: 20, name: 'Bone Shield' } }
            ]
        },
        {
            hpThreshold: 0,
            moveset: [
                { weight: 25, action: { type: 'attackAndHeal', damage: 20, healPercent: 100, name: 'Soul Drain' } },
                { weight: 20, action: { type: 'summon', enemy: 'Skeleton Warrior', count: 3, name: 'Army of the Dead' } },
                { weight: 20, action: { type: 'attackAndDebuff', damage: 12, status: 'poison', value: 5, name: 'Death Coil' } },
                { weight: 15, action: { type: 'block', value: 30, name: 'Bone Shield' } },
                { weight: 10, action: { type: 'multiDebuff', debuffs: [{ status: 'weak', value: 2 }, { status: 'vulnerable', value: 2 }], addCard: 'Normality', name: "Lich's Curse" } },
                { weight: 10, action: { type: 'reviveMinions', hpPercent: 0.5, name: 'Reanimate' } }
            ]
        }
    ]
});

createEnemy({
    name: 'The Dragon',
    act: 2,
    hpMin: 280,
    hpMax: 340,
    sprite: 'dragon',
    size: 4,
    isBoss: true,
    phases: [
        {
            hpThreshold: 0.5,
            moveset: [
                { weight: 30, action: { type: 'attack', damage: 18, name: 'Claw' } },
                { weight: 25, action: { type: 'attackAll', damage: 12, addCard: 'Burn', name: 'Fire Breath' } },
                { weight: 25, action: { type: 'attackAndDrawReduce', damage: 10, drawReduce: 2, name: 'Wing Buffet' } },
                { weight: 20, action: { type: 'debuff', status: 'weak', value: 2, name: 'Roar' } }
            ]
        },
        {
            hpThreshold: 0,
            moveset: [
                { weight: 25, action: { type: 'attack', damage: 22, name: 'Claw' } },
                { weight: 20, action: { type: 'attackAll', damage: 18, addCard: 'Burn', times: 3, name: 'Inferno' } },
                { weight: 20, action: { type: 'attackAndDebuff', damage: 15, status: 'vulnerable', value: 1, name: 'Tail Swipe' } },
                { weight: 15, action: { type: 'buff', stat: 'strength', value: 3, name: "Dragon's Fury" } },
                { weight: 10, action: { type: 'charge', damage: 30, name: 'Devastating Breath' } },
                { weight: 10, action: { type: 'summon', enemy: 'Dragon Whelp', count: 2, name: 'Summon Whelps' } }
            ]
        }
    ]
});

createEnemy({
    name: 'Dragon Whelp',
    act: 2,
    hpMin: 15,
    hpMax: 20,
    sprite: 'whelp',
    size: 1,
    moveset: [
        { weight: 60, action: { type: 'attack', damage: 6, name: 'Bite' } },
        { weight: 40, action: { type: 'attackAndDebuff', damage: 4, status: 'burn', value: 1, name: 'Small Flame' } }
    ]
});

createEnemy({
    name: 'The Dark Lord',
    act: 3,
    hpMin: 400,
    hpMax: 500,
    sprite: 'darkLord',
    size: 4,
    isBoss: true,
    phases: [
        {
            hpThreshold: 0.7,
            moveset: [
                { weight: 25, action: { type: 'attack', damage: 20, name: 'Dark Slash' } },
                { weight: 25, action: { type: 'block', value: 30, name: 'Shadow Shield' } },
                { weight: 20, action: { type: 'attackHealBuff', damage: 12, heal: 12, stat: 'strength', value: 1, name: 'Soul Harvest' } },
                { weight: 15, action: { type: 'summon', enemy: 'Shadow Fiend', count: 2, name: 'Summon Minions' } },
                { weight: 15, action: { type: 'multiDebuff', debuffs: [{ status: 'weak', value: 2 }, { status: 'vulnerable', value: 1 }], name: 'Curse of Weakness' } }
            ]
        },
        {
            hpThreshold: 0.4,
            moveset: [
                { weight: 20, action: { type: 'attack', damage: 25, name: 'Dark Slash' } },
                { weight: 20, action: { type: 'attackAll', damage: 15, status: 'vulnerable', value: 2, name: 'Void Blast' } },
                { weight: 20, action: { type: 'block', value: 40, name: 'Shadow Shield' } },
                { weight: 15, action: { type: 'attackHealBuff', damage: 15, heal: 15, stat: 'strength', value: 2, name: 'Soul Harvest' } },
                { weight: 15, action: { type: 'summon', enemy: 'Shadow Fiend', count: 3, name: 'Summon Minions' } },
                { weight: 10, action: { type: 'selfDamageAndBuff', selfDamage: 20, stat: 'strength', value: 3, name: 'Dark Pact' } }
            ]
        },
        {
            hpThreshold: 0,
            moveset: [
                { weight: 15, action: { type: 'charge', damage: 35, name: 'Annihilation' } },
                { weight: 15, action: { type: 'attackAll', damage: 20, status: 'vulnerable', value: 3, name: 'Void Blast' } },
                { weight: 15, action: { type: 'attackHealBuff', damage: 18, heal: 18, stat: 'strength', value: 2, name: 'Soul Harvest' } },
                { weight: 15, action: { type: 'block', value: 50, name: 'Shadow Shield' } },
                { weight: 15, action: { type: 'summon', enemy: 'Shadow Fiend', count: 4, name: 'Summon Army' } },
                { weight: 10, action: { type: 'addCard', card: 'Normality', times: 2, name: 'Dark Curse' } },
                { weight: 10, action: { type: 'damageFromMissingHP', multiplier: 0.5, name: 'Desperation' } },
                { weight: 5, action: { type: 'lastStand', hpPercent: 0.1, healPercent: 0.2, name: 'Last Stand' } }
            ]
        }
    ]
});

createEnemy({
    name: 'Shadow Fiend',
    act: 3,
    hpMin: 20,
    hpMax: 30,
    sprite: 'shadowFiend',
    size: 1,
    moveset: [
        { weight: 60, action: { type: 'attack', damage: 8, name: 'Shadow Strike' } },
        { weight: 40, action: { type: 'block', value: 10, name: 'Fade' } }
    ]
});

function createEnemyInstance(enemyName) {
    const template = ENEMIES.get(enemyName);
    if (!template) return null;
    
    const hp = Random.int(template.hpMin, template.hpMax);
    return {
        ...template,
        id: Math.random().toString(36).substr(2, 9),
        hp: hp,
        maxHp: hp,
        block: 0,
        strength: 0,
        dexterity: 0,
        statusEffects: {},
        intent: null,
        lastMoveIndex: -1,
        moveHistory: [],
        phase: 0,
        charged: false,
        usedLastStand: false
    };
}

function getEnemyIntent(enemy) {
    if (enemy.charged) {
        return { type: 'attack', damage: enemy.chargedDamage, name: enemy.chargedName };
    }
    
    const template = ENEMIES.get(enemy.name);
    let moveset;
    
    if (template.phases) {
        const phaseIndex = template.phases.findIndex((p, i) => {
            const nextThreshold = template.phases[i + 1]?.hpThreshold || 0;
            return enemy.hp / enemy.maxHp > nextThreshold;
        });
        moveset = template.phases[phaseIndex]?.moveset || template.phases[0].moveset;
    } else {
        moveset = template.moveset;
    }
    
    const move = Random.weighted(moveset);
    return { ...move.action, name: move.action.name };
}
