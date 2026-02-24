const Map = {
    NODE_TYPES: {
        BATTLE: 'battle',
        ELITE: 'elite',
        BOSS: 'boss',
        SHOP: 'shop',
        REST: 'rest',
        EVENT: 'event',
        TREASURE: 'treasure',
        START: 'start',
        UNKNOWN: 'unknown'
    },
    
    FLOORS_PER_ACT: 15,
    LANES: 4,
    
    current: null,
    
    generate(act = 1) {
        const map = {
            act: act,
            floors: [],
            currentNode: null,
            currentFloor: 0,
            visited: new Set()
        };
        
        const startRow = this.createStartRow();
        map.floors.push(startRow);
        
        for (let floor = 1; floor < this.FLOORS_PER_ACT - 1; floor++) {
            const row = this.createRow(floor, act);
            map.floors.push(row);
        }
        
        const bossRow = this.createBossRow(act);
        map.floors.push(bossRow);
        
        this.connectNodes(map);
        
        map.currentNode = map.floors[0][0];
        map.currentFloor = 0;
        map.visited.add(map.currentNode.id);
        
        this.current = map;
        return map;
    },
    
    createStartRow() {
        const startNode = {
            id: 'start',
            type: this.NODE_TYPES.START,
            floor: 0,
            lane: 1,
            connections: [],
            visited: true
        };
        return [startNode];
    },
    
    createRow(floor, act) {
        const row = [];
        const occupiedLanes = new Set();
        const numNodes = Random.int(2, this.LANES);
        
        const availableLanes = [0, 1, 2, 3];
        const selectedLanes = Random.pickMultiple(availableLanes, numNodes).sort((a, b) => a - b);
        
        for (const lane of selectedLanes) {
            row.push(this.createNode(floor, lane, act));
        }
        
        return row;
    },
    
    createNode(floor, lane, act) {
        const type = this.determineNodeType(floor, act);
        
        return {
            id: `${floor}-${lane}`,
            type: type,
            floor: floor,
            lane: lane,
            connections: [],
            visited: false,
            enemy: null,
            event: null
        };
    },
    
    determineNodeType(floor, act) {
        if (floor === 4 || floor === 9) {
            return Random.chance(0.5) ? this.NODE_TYPES.REST : this.NODE_TYPES.SHOP;
        }
        
        if (floor === 7) {
            return Random.chance(0.6) ? this.NODE_TYPES.TREASURE : this.NODE_TYPES.EVENT;
        }
        
        const weights = this.getTypeWeights(floor, act);
        return Random.weighted(weights);
    },
    
    getTypeWeights(floor, act) {
        const baseWeights = [
            { weight: 50, value: this.NODE_TYPES.BATTLE },
            { weight: 15, value: this.NODE_TYPES.EVENT },
            { weight: 10, value: this.NODE_TYPES.SHOP },
            { weight: 8, value: this.NODE_TYPES.ELITE },
            { weight: 8, value: this.NODE_TYPES.REST },
            { weight: 5, value: this.NODE_TYPES.TREASURE }
        ];
        
        if (floor < 3) {
            return baseWeights.filter(w => w.value !== this.NODE_TYPES.ELITE);
        }
        
        if (floor > this.FLOORS_PER_ACT - 3) {
            return baseWeights.map(w => {
                if (w.value === this.NODE_TYPES.BATTLE) w.weight += 10;
                return w;
            });
        }
        
        return baseWeights;
    },
    
    createBossRow(act) {
        const bossNode = {
            id: `${this.FLOORS_PER_ACT}-1`,
            type: this.NODE_TYPES.BOSS,
            floor: this.FLOORS_PER_ACT,
            lane: 1,
            connections: [],
            visited: false,
            boss: this.getBossForAct(act)
        };
        return [bossNode];
    },
    
    getBossForAct(act) {
        switch (act) {
            case 1: return 'The Lich King';
            case 2: return 'The Dragon';
            case 3: return 'The Dark Lord';
            default: return 'The Lich King';
        }
    },
    
    connectNodes(map) {
        for (let floor = 0; floor < map.floors.length - 1; floor++) {
            const currentRow = map.floors[floor];
            const nextRow = map.floors[floor + 1];
            
            for (const node of currentRow) {
                if (!node) continue;
                
                const possibleTargets = nextRow.filter(n => 
                    Math.abs(n.lane - node.lane) <= 1
                );
                
                if (possibleTargets.length === 0) continue;
                
                const numConnections = Math.min(
                    Random.int(1, Math.min(2, possibleTargets.length)),
                    possibleTargets.length
                );
                
                const targets = Random.pickMultiple(
                    possibleTargets.map(n => n.id),
                    numConnections
                );
                
                for (const conn of targets) {
                    node.connections.push(conn);
                }
            }
        }
        
        for (let floor = 1; floor < map.floors.length; floor++) {
            const prevRow = map.floors[floor - 1];
            const currentRow = map.floors[floor];
            
            for (const node of currentRow) {
                const hasIncoming = prevRow.some(prev => 
                    prev && prev.connections.includes(node.id)
                );
                
                if (!hasIncoming) {
                    const possibleParents = prevRow.filter(p =>
                        Math.abs(p.lane - node.lane) <= 1
                    );
                    
                    if (possibleParents.length > 0) {
                        const randomPrev = Random.pick(possibleParents);
                        randomPrev.connections.push(node.id);
                    }
                }
            }
        }
        
        for (let floor = 0; floor < map.floors.length - 1; floor++) {
            const currentRow = map.floors[floor];
            const nextRow = map.floors[floor + 1];
            
            for (const node of currentRow) {
                if (!node) continue;
                
                if (node.connections.length === 0) {
                    const possibleTargets = nextRow.filter(n => 
                        Math.abs(n.lane - node.lane) <= 1
                    );
                    
                    if (possibleTargets.length > 0) {
                        const target = Random.pick(possibleTargets);
                        node.connections.push(target.id);
                    }
                }
            }
        }
    },
    
    getAvailableNodes(map) {
        if (!map.currentNode) return [];
        
        const currentFloor = map.currentFloor;
        const nextFloor = currentFloor + 1;
        
        if (nextFloor >= map.floors.length) return [];
        
        const nextRow = map.floors[nextFloor];
        const available = [];
        
        for (const nodeId of map.currentNode.connections) {
            for (const node of nextRow) {
                if (node && node.id === nodeId) {
                    available.push(node);
                }
            }
        }
        
        return available;
    },
    
    selectNode(map, node) {
        const available = this.getAvailableNodes(map);
        const targetNode = available.find(n => n.id === node.id);
        
        if (!targetNode) return false;
        
        map.currentNode = targetNode;
        map.currentFloor = targetNode.floor;
        map.visited.add(targetNode.id);
        targetNode.visited = true;
        
        return true;
    },
    
    getNodeEncounter(node, act) {
        switch (node.type) {
            case this.NODE_TYPES.BATTLE:
                return {
                    type: 'battle',
                    enemies: this.generateBattleEncounter(act)
                };
                
            case this.NODE_TYPES.ELITE:
                return {
                    type: 'elite',
                    enemies: this.generateEliteEncounter(act)
                };
                
            case this.NODE_TYPES.BOSS:
                return {
                    type: 'boss',
                    enemies: [createEnemyInstance(node.boss || this.getBossForAct(act))]
                };
                
            case this.NODE_TYPES.SHOP:
                return {
                    type: 'shop'
                };
                
            case this.NODE_TYPES.REST:
                return {
                    type: 'rest',
                    options: ['rest', 'upgrade']
                };
                
            case this.NODE_TYPES.EVENT:
                return {
                    type: 'event',
                    event: this.getRandomEvent(act)
                };
                
            case this.NODE_TYPES.TREASURE:
                return {
                    type: 'treasure',
                    rewards: this.generateTreasureRewards()
                };
                
            default:
                return { type: 'unknown' };
        }
    },
    
    generateBattleEncounter(act) {
        const enemies = [];
        const encounterType = Random.weighted([
            { weight: 60, value: 'single' },
            { weight: 30, value: 'double' },
            { weight: 10, value: 'triple' }
        ]);
        
        const count = encounterType === 'single' ? 1 : 
                      encounterType === 'double' ? 2 : 3;
        
        for (let i = 0; i < count; i++) {
            const enemy = ENEMIES.getRandom(act);
            if (enemy) {
                enemies.push(createEnemyInstance(enemy.name));
            }
        }
        
        return enemies;
    },
    
    generateEliteEncounter(act) {
        const elite = ENEMIES.getRandom(act, true);
        if (elite) {
            return [createEnemyInstance(elite.name)];
        }
        return this.generateBattleEncounter(act);
    },
    
    getRandomEvent(act) {
        const availableEvents = EVENTS.all.filter(e => {
            if (e.actRequired && e.actRequired !== act) return false;
            return true;
        });
        
        return Random.pick(availableEvents);
    },
    
    generateTreasureRewards() {
        const rewards = {
            gold: Random.int(75, 150),
            relics: [],
            cards: []
        };
        
        if (Random.chance(0.3)) {
            const relic = RELICS.getRandom();
            if (relic) rewards.relics.push(relic);
        }
        
        if (Random.chance(0.5)) {
            const card = CARDS.getRandom();
            if (card) rewards.cards.push(card);
        }
        
        return rewards;
    },
    
    render(map, ctx, width, height) {
        const nodeSize = 24;
        const floorHeight = height / (map.floors.length + 1);
        const margin = 200;
        const usableWidth = width - margin * 2;
        const laneSpacing = usableWidth / (this.LANES - 1);
        
        for (let floor = 0; floor < map.floors.length; floor++) {
            const row = map.floors[floor];
            const y = height - (floor + 1) * floorHeight;
            
            for (const node of row) {
                if (!node) continue;
                
                const nodeX = this.getLaneX(node.lane, margin, laneSpacing);
                
                for (const connId of node.connections) {
                    const [connFloor, connLane] = connId.split('-');
                    const connFloorNum = parseInt(connFloor);
                    const connLaneNum = parseInt(connLane);
                    const connRow = map.floors[connFloorNum];
                    const connNode = connRow ? connRow.find(n => n.lane === connLaneNum) : null;
                    
                    if (connNode) {
                        const connNodeX = this.getLaneX(connNode.lane, margin, laneSpacing);
                        const connY = height - (connFloorNum + 1) * floorHeight;
                        
                        this.drawCurvedPath(ctx, nodeX, y, connNodeX, connY, map.visited.has(connId));
                    }
                }
            }
        }
        
        for (let floor = 0; floor < map.floors.length; floor++) {
            const row = map.floors[floor];
            const y = height - (floor + 1) * floorHeight;
            
            for (const node of row) {
                if (!node) continue;
                
                const nodeX = this.getLaneX(node.lane, margin, laneSpacing);
                
                const isCurrent = map.currentNode && map.currentNode.id === node.id;
                const isVisited = map.visited.has(node.id);
                const isAvailable = this.isNodeAvailable(map, node);
                
                if (isCurrent) {
                    this.drawNodeHighlight(ctx, nodeX, y, nodeSize, '#ffd700');
                } else if (isAvailable) {
                    this.drawNodeHighlight(ctx, nodeX, y, nodeSize, '#6495ed');
                }
                
                MapIcons.draw(ctx, node.type, nodeX, y, nodeSize, {
                    visited: isVisited && !isCurrent,
                    glow: isCurrent || isAvailable
                });
            }
        }
    },
    
    getLaneX(lane, margin, laneSpacing) {
        return margin + lane * laneSpacing;
    },
    
    getNodeX(node, index, rowLength, margin, usableWidth) {
        return this.getLaneX(node.lane, margin, usableWidth / (this.LANES - 1));
    },
    
    drawCurvedPath(ctx, x1, y1, x2, y2, visited) {
        const midY = (y1 + y2) / 2;
        const controlY = midY + (y1 - y2) * 0.2;
        
        ctx.strokeStyle = visited ? '#5a4a3a' : '#8b7355';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.quadraticCurveTo(x1, controlY, (x1 + x2) / 2, midY);
        ctx.quadraticCurveTo(x2, controlY, x2, y2);
        ctx.stroke();
        
        if (visited) {
            ctx.strokeStyle = 'rgba(100, 180, 100, 0.5)';
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    },
    
    drawNodeHighlight(ctx, x, y, size, color) {
        const gradient = ctx.createRadialGradient(x, y, size * 0.5, x, y, size * 2);
        gradient.addColorStop(0, color + '44');
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
    },
    
    isNodeAvailable(map, node) {
        const available = this.getAvailableNodes(map);
        return available.some(n => n.id === node.id);
    },
    
    getNodeColor(type) {
        const colors = {
            [this.NODE_TYPES.START]: '#4a4a4a',
            [this.NODE_TYPES.BATTLE]: '#cd5c5c',
            [this.NODE_TYPES.ELITE]: '#ff4500',
            [this.NODE_TYPES.BOSS]: '#8b0000',
            [this.NODE_TYPES.SHOP]: '#ffd700',
            [this.NODE_TYPES.REST]: '#90ee90',
            [this.NODE_TYPES.EVENT]: '#9932cc',
            [this.NODE_TYPES.TREASURE]: '#daa520',
            [this.NODE_TYPES.UNKNOWN]: '#3d3d3d'
        };
        return colors[type] || '#3d3d3d';
    },
    
    getNodeSymbol(type) {
        const symbols = {
            [this.NODE_TYPES.START]: 'S',
            [this.NODE_TYPES.BATTLE]: '⚔',
            [this.NODE_TYPES.ELITE]: '★',
            [this.NODE_TYPES.BOSS]: '☠',
            [this.NODE_TYPES.SHOP]: '$',
            [this.NODE_TYPES.REST]: '♥',
            [this.NODE_TYPES.EVENT]: '?',
            [this.NODE_TYPES.TREASURE]: '⬡',
            [this.NODE_TYPES.UNKNOWN]: '?'
        };
        return symbols[type] || '?';
    },
    
    darkenColor(color) {
        const hex = color.replace('#', '');
        const r = Math.floor(parseInt(hex.substr(0, 2), 16) * 0.5);
        const g = Math.floor(parseInt(hex.substr(2, 2), 16) * 0.5);
        const b = Math.floor(parseInt(hex.substr(4, 2), 16) * 0.5);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }
};
