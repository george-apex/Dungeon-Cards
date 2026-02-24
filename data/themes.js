const THEMES = {
    acts: {
        1: {
            name: 'The Dungeon',
            description: 'Dark stone corridors and ancient traps',
            colors: {
                bg1: '#2a2a4e',
                bg2: '#1e3a5e',
                bg3: '#0f4470',
                accent: '#5a4738',
                primary: '#e94560',
                secondary: '#0f3460',
                highlight: '#ffd700',
                shadow: 'rgba(0, 0, 0, 0.6)',
                fog: 'rgba(74, 55, 40, 0.3)'
            },
            ambient: {
                particles: ['dust', 'ember'],
                density: 0.3
            }
        },
        2: {
            name: 'The Forest',
            description: 'Twisted trees and corrupted nature',
            colors: {
                bg1: '#1a2e1a',
                bg2: '#0f3420',
                bg3: '#0a2010',
                accent: '#2a4a2d',
                primary: '#4ade80',
                secondary: '#166534',
                highlight: '#a3e635',
                shadow: 'rgba(0, 20, 0, 0.6)',
                fog: 'rgba(42, 74, 45, 0.4)'
            },
            ambient: {
                particles: ['leaf', 'spore'],
                density: 0.4
            }
        },
        3: {
            name: "Demon's Domain",
            description: 'Hellish landscapes and infernal machines',
            colors: {
                bg1: '#2e1a1a',
                bg2: '#340f0f',
                bg3: '#200a0a',
                accent: '#4a2a2a',
                primary: '#f87171',
                secondary: '#991b1b',
                highlight: '#fbbf24',
                shadow: 'rgba(20, 0, 0, 0.7)',
                fog: 'rgba(74, 42, 42, 0.5)'
            },
            ambient: {
                particles: ['fire', 'ash'],
                density: 0.5
            }
        }
    },
    
    screens: {
        menu: {
            bgType: 'menu',
            particles: ['sparkle'],
            particleDensity: 0.2
        },
        map: {
            bgType: 'parchment',
            particles: ['dust'],
            particleDensity: 0.15
        },
        combat: {
            bgType: 'arena',
            particles: ['dust', 'ember'],
            particleDensity: 0.3
        },
        shop: {
            bgType: 'interior',
            particles: ['dust'],
            particleDensity: 0.1
        },
        rest: {
            bgType: 'campfire',
            particles: ['ember', 'spark'],
            particleDensity: 0.4
        },
        event: {
            bgType: 'mysterious',
            particles: ['sparkle', 'mist'],
            particleDensity: 0.25
        },
        reward: {
            bgType: 'treasure',
            particles: ['sparkle', 'gold'],
            particleDensity: 0.5
        },
        gameOver: {
            bgType: 'dark',
            particles: ['ash'],
            particleDensity: 0.2
        },
        victory: {
            bgType: 'triumph',
            particles: ['sparkle', 'gold', 'firework'],
            particleDensity: 0.6
        }
    },
    
    events: {
        'The Shrine': { bgType: 'shrine', mood: 'holy' },
        'The Well': { bgType: 'well', mood: 'mysterious' },
        'The Merchant': { bgType: 'merchant', mood: 'neutral' },
        'The Arena': { bgType: 'arena', mood: 'combat' },
        'The Library': { bgType: 'library', mood: 'scholarly' },
        'The Graveyard': { bgType: 'graveyard', mood: 'spooky' },
        'The Fountain': { bgType: 'fountain', mood: 'healing' },
        'The Portal': { bgType: 'portal', mood: 'mysterious' },
        'The Trap Room': { bgType: 'trap', mood: 'dangerous' },
        'The Treasure Room': { bgType: 'treasure', mood: 'greed' },
        'The Demon Altar': { bgType: 'altar', mood: 'dark' },
        'The Garden': { bgType: 'garden', mood: 'nature' },
        'The Prison': { bgType: 'prison', mood: 'oppressive' },
        'The Laboratory': { bgType: 'laboratory', mood: 'scientific' },
        'The Mirror': { bgType: 'mirror', mood: 'mysterious' }
    },
    
    nodeTypes: {
        battle: {
            icon: 'sword',
            color: '#dc2626',
            glowColor: '#ef4444',
            description: 'Fight enemies'
        },
        elite: {
            icon: 'skull',
            color: '#ca8a04',
            glowColor: '#eab308',
            description: 'Powerful enemy with rare rewards'
        },
        boss: {
            icon: 'demon',
            color: '#7c3aed',
            glowColor: '#8b5cf6',
            description: 'Act boss'
        },
        shop: {
            icon: 'coin',
            color: '#0891b2',
            glowColor: '#06b6d4',
            description: 'Buy and sell items'
        },
        rest: {
            icon: 'campfire',
            color: '#ea580c',
            glowColor: '#f97316',
            description: 'Rest or upgrade cards'
        },
        event: {
            icon: 'question',
            color: '#16a34a',
            glowColor: '#22c55e',
            description: 'Unknown encounter'
        },
        treasure: {
            icon: 'chest',
            color: '#d97706',
            glowColor: '#f59e0b',
            description: 'Gold and relics'
        }
    },
    
    getActTheme(act) {
        return this.acts[Math.min(act, 3)] || this.acts[1];
    },
    
    getScreenTheme(screen) {
        return this.screens[screen] || this.screens.menu;
    },
    
    getEventTheme(eventName) {
        return this.events[eventName] || { bgType: 'mysterious', mood: 'neutral' };
    },
    
    getNodeTheme(nodeType) {
        return this.nodeTypes[nodeType] || this.nodeTypes.battle;
    }
};
