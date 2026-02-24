console.log('ui.js loading');
const UI = {
    canvas: null,
    ctx: null,
    width: 1280,
    height: 720,
    
    colors: {
        bg: '#1a1a2e',
        bgLight: '#16213e',
        bgLighter: '#0f3460',
        text: '#ffffff',
        textDim: '#a0a0a0',
        hp: '#dc143c',
        hpBg: '#4a0000',
        block: '#4169e1',
        blockBg: '#1a1a5e',
        energy: '#ffd700',
        energyBg: '#8b7500',
        attack: '#b22222',
        defense: '#4169e1',
        skill: '#228b22',
        curse: '#8b008b',
        gold: '#ffd700',
        poison: '#00ff00',
        bleed: '#ff4500',
        weak: '#ffa500',
        vulnerable: '#ff6347',
        frail: '#87ceeb',
        strength: '#ff0000',
        dexterity: '#00ff00'
    },
    
    fonts: {
        title: 'bold 32px Arial',
        header: 'bold 24px Arial',
        normal: '16px Arial',
        small: '12px Arial',
        tiny: '10px Arial'
    },
    
    init() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    },
    
    clear() {
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, this.width, this.height);
    },
    
    drawEnvironment(type, act = 1, options = {}) {
        Backgrounds.draw(this.ctx, this.width, this.height, type, act, options);
        
        const screenTheme = THEMES.getScreenTheme(type);
        if (screenTheme.particles && screenTheme.particleDensity) {
            Particles.spawnAmbient(
                screenTheme.particles[Math.floor(Math.random() * screenTheme.particles.length)],
                this.width,
                this.height,
                screenTheme.particleDensity
            );
        }
    },
    
    drawDungeonBackground(ctx, w, h, colors) {
        ctx.fillStyle = colors.accent;
        for (let i = 0; i < 8; i++) {
            const x = (i * 180) - 20;
            ctx.fillRect(x, 0, 40, h);
            ctx.fillRect(x + 60, 0, 20, h);
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, h - 150, w, 150);
        
        ctx.fillStyle = '#3d3d3d';
        for (let x = 0; x < w; x += 80) {
            ctx.fillRect(x, h - 155, 60, 10);
        }
        
        ctx.fillStyle = 'rgba(255, 200, 100, 0.1)';
        ctx.beginPath();
        ctx.arc(w / 2, -50, 200, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawCampfireBackground(ctx, w, h, colors) {
        ctx.fillStyle = '#2a1a0a';
        ctx.fillRect(0, h - 100, w, 100);
        
        ctx.fillStyle = '#ff6b35';
        ctx.beginPath();
        ctx.arc(w / 2, h - 60, 40, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.arc(w / 2, h - 60, 25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffdd00';
        ctx.beginPath();
        ctx.arc(w / 2, h - 60, 12, 0, Math.PI * 2);
        ctx.fill();
        
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(255, ${100 + i * 30}, 0, ${0.3 - i * 0.05})`;
            ctx.beginPath();
            ctx.arc(w / 2, h - 100 - i * 30, 20 + i * 15, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#4a3728';
        ctx.fillRect(w / 2 - 80, h - 80, 20, 80);
        ctx.fillRect(w / 2 + 60, h - 80, 20, 80);
    },
    
    drawShopBackground(ctx, w, h, colors) {
        ctx.fillStyle = '#2a2a1a';
        ctx.fillRect(0, h - 200, w, 200);
        
        ctx.fillStyle = '#4a4a3a';
        ctx.fillRect(100, h - 250, w - 200, 60);
        
        ctx.fillStyle = '#ffd700';
        for (let i = 0; i < 5; i++) {
            ctx.beginPath();
            ctx.arc(200 + i * 200, h - 220, 8, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(150, h - 180, 150, 100);
        ctx.fillRect(w - 300, h - 180, 150, 100);
        
        ctx.fillStyle = '#daa520';
        ctx.font = '24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('⚔', 225, h - 130);
        ctx.fillText('🛡', w - 225, h - 130);
    },
    
    drawEventBackground(ctx, w, h, colors) {
        ctx.fillStyle = 'rgba(75, 0, 130, 0.2)';
        ctx.fillRect(0, 0, w, h);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < 20; i++) {
            const x = (i * 70 + Math.sin(i) * 30) % w;
            const y = (i * 40 + Math.cos(i) * 20) % h;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(w / 2 - 300, 50, 600, 250);
        ctx.strokeStyle = '#4a4a4a';
        ctx.lineWidth = 4;
        ctx.strokeRect(w / 2 - 300, 50, 600, 250);
    },
    
    drawMapBackground(ctx, w, h, colors) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let y = 0; y < h; y += 100) {
            ctx.fillRect(0, y, w, 2);
        }
        for (let x = 0; x < w; x += 100) {
            ctx.fillRect(x, 0, 2, h);
        }
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawText(text, x, y, options = {}) {
        const ctx = this.ctx;
        ctx.font = options.font || this.fonts.normal;
        ctx.fillStyle = options.color || this.colors.text;
        ctx.textAlign = options.align || 'left';
        ctx.textBaseline = options.baseline || 'top';
        
        if (options.shadow) {
            ctx.shadowColor = options.shadow;
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
        }
        
        ctx.fillText(text, x, y);
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
    },
    
    drawRect(x, y, w, h, color, radius = 0) {
        const ctx = this.ctx;
        ctx.fillStyle = color;
        if (radius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, radius);
            ctx.fill();
        } else {
            ctx.fillRect(x, y, w, h);
        }
    },
    
    drawBorder(x, y, w, h, color, lineWidth = 2, radius = 0) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        if (radius > 0) {
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, radius);
            ctx.stroke();
        } else {
            ctx.strokeRect(x, y, w, h);
        }
    },
    
    drawProgressBar(x, y, w, h, value, maxValue, fgColor, bgColor, showText = true) {
        this.drawRect(x, y, w, h, bgColor, 4);
        
        const fillWidth = Math.max(0, (value / maxValue) * w);
        if (fillWidth > 0) {
            this.drawRect(x, y, fillWidth, h, fgColor, 4);
        }
        
        this.drawBorder(x, y, w, h, '#000000', 1, 4);
        
        if (showText) {
            this.drawText(`${value}/${maxValue}`, x + w / 2, y + h / 2 - 8, {
                align: 'center',
                baseline: 'middle',
                font: this.fonts.small,
                color: this.colors.text
            });
        }
    },
    
    drawPlayerPanel(player, compact = false) {
        const ctx = this.ctx;
        const x = 20;
        
        if (compact) {
            const y = this.height - 100;
            const w = 160;
            const h = 80;
            
            ctx.save();
            
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetX = 3;
            ctx.shadowOffsetY = 3;
            
            const panelGradient = ctx.createLinearGradient(x, y, x, y + h);
            panelGradient.addColorStop(0, '#2a2a4a');
            panelGradient.addColorStop(1, '#1a1a3a');
            ctx.fillStyle = panelGradient;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.fill();
            
            ctx.shadowColor = 'transparent';
            ctx.strokeStyle = '#4a4a7a';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            ctx.restore();
            
            Sprites.drawPlayer(this.ctx, x + 10, y + 10, 2);
            
            this.drawText(player.name || 'Hero', x + 70, y + 8, {
                font: this.fonts.normal,
                color: this.colors.text,
                shadow: '#000000'
            });
            
            this.drawProgressBar(x + 70, y + 30, 80, 12, player.hp, player.maxHp, this.colors.hp, this.colors.hpBg);
            
            this.drawText(`💰 ${player.gold}`, x + 70, y + 50, {
                font: this.fonts.small,
                color: this.colors.gold,
                shadow: '#000000'
            });
            
            return;
        }
        
        const y = this.height - 180;
        const w = 200;
        const h = 160;
        
        ctx.save();
        
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        
        const panelGradient = ctx.createLinearGradient(x, y, x, y + h);
        panelGradient.addColorStop(0, '#2a2a4a');
        panelGradient.addColorStop(0.5, '#1a1a3a');
        panelGradient.addColorStop(1, '#0a0a2a');
        ctx.fillStyle = panelGradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        const borderGradient = ctx.createLinearGradient(x, y, x + w, y + h);
        borderGradient.addColorStop(0, '#4a4a7a');
        borderGradient.addColorStop(0.5, '#3a3a6a');
        borderGradient.addColorStop(1, '#2a2a5a');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 12);
        ctx.stroke();
        
        const innerGlow = ctx.createRadialGradient(x + w/2, y + h/2, 0, x + w/2, y + h/2, w/2);
        innerGlow.addColorStop(0, 'rgba(100, 100, 150, 0.1)');
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerGlow;
        ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
        
        ctx.restore();
        
        Sprites.drawPlayer(this.ctx, x + 20, y + 20, 3);
        
        this.drawText(player.name || 'Hero', x + 100, y + 15, {
            font: this.fonts.header,
            color: this.colors.text,
            shadow: '#000000'
        });
        
        this.drawProgressBar(x + 100, y + 50, 90, 16, player.hp, player.maxHp, this.colors.hp, this.colors.hpBg);
        
        if (player.block > 0) {
            const blockGradient = ctx.createLinearGradient(x + 100, y + 72, x + 190, y + 86);
            blockGradient.addColorStop(0, '#4169e1');
            blockGradient.addColorStop(1, '#1a1a8e');
            ctx.fillStyle = blockGradient;
            ctx.beginPath();
            ctx.roundRect(x + 100, y + 72, 90, 14, 3);
            ctx.fill();
            
            ctx.strokeStyle = '#6688ff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            this.drawText(`🛡 ${player.block}`, x + 145, y + 73, {
                align: 'center',
                font: this.fonts.small,
                color: this.colors.text
            });
        }
        
        const goldGradient = ctx.createLinearGradient(x + 100, y + 90, x + 190, y + 110);
        goldGradient.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
        goldGradient.addColorStop(1, 'rgba(255, 215, 0, 0.05)');
        ctx.fillStyle = goldGradient;
        ctx.fillRect(x + 100, y + 90, 90, 20);
        
        this.drawText(`💰 ${player.gold}`, x + 145, y + 92, {
            align: 'center',
            font: this.fonts.normal,
            color: this.colors.gold,
            shadow: '#000000'
        });
        
        this.drawRelics(x + 15, y + 115, player.relics || []);
    },
    
    drawRelics(x, y, relics) {
        if (!relics || relics.length === 0) return;
        let offsetX = 0;
        for (let i = 0; i < Math.min(relics.length, 8); i++) {
            const relic = RELICS.get(relics[i]);
            if (relic) {
                Sprites.drawRelic(this.ctx, x + offsetX, y, 2);
                offsetX += 24;
            }
        }
    },
    
    drawPotions(x, y, potions) {
        for (let i = 0; i < potions.length; i++) {
            const potion = potions[i];
            Sprites.drawPotion(this.ctx, x + i * 36, y, 2);
        }
    },
    
    drawEnergy(energy, maxEnergy) {
        const ctx = this.ctx;
        const x = 30;
        const y = this.height / 2 - 40;
        const size = 80;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        
        ctx.save();
        
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
        
        const outerGradient = ctx.createRadialGradient(centerX, centerY, size / 2 - 10, centerX, centerY, size / 2 + 8);
        outerGradient.addColorStop(0, '#8b7500');
        outerGradient.addColorStop(1, '#4a3a00');
        ctx.fillStyle = outerGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2 + 6, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        
        const energyGradient = ctx.createRadialGradient(centerX - 10, centerY - 10, 0, centerX, centerY, size / 2);
        energyGradient.addColorStop(0, '#ffee88');
        energyGradient.addColorStop(0.3, '#ffd700');
        energyGradient.addColorStop(0.7, '#cc9900');
        energyGradient.addColorStop(1, '#996600');
        ctx.fillStyle = energyGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#ffee44';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const innerGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
        innerGlow.addColorStop(0, 'rgba(255, 255, 200, 0.4)');
        innerGlow.addColorStop(0.5, 'rgba(255, 215, 0, 0.1)');
        innerGlow.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = innerGlow;
        ctx.beginPath();
        ctx.arc(centerX, centerY, size / 2 - 4, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
        
        this.drawText(`${energy}`, centerX, centerY - 8, {
            align: 'center',
            font: 'bold 28px Arial',
            color: '#000000',
            shadow: '#ffee88'
        });
        
        this.drawText(`/ ${maxEnergy}`, centerX, centerY + 14, {
            align: 'center',
            font: this.fonts.small,
            color: '#4a3000'
        });
    },
    
    drawCard(card, x, y, scale = 1, hovered = false, selected = false) {
        const ctx = this.ctx;
        const w = 120 * scale;
        const h = 160 * scale;
        
        let borderColor = this.colors.skill;
        let bgColor = this.colors.bgLight;
        let costColor = this.colors.skill;
        let accentColor = '#228b22';
        
        if (card.type === 'attack') {
            borderColor = this.colors.attack;
            costColor = this.colors.attack;
            accentColor = '#ff4444';
        } else if (card.type === 'defense') {
            borderColor = this.colors.defense;
            costColor = this.colors.defense;
            accentColor = '#4488ff';
        } else if (card.type === 'curse') {
            borderColor = this.colors.curse;
            costColor = this.colors.curse;
            accentColor = '#aa44aa';
        }
        
        ctx.save();
        
        if (hovered || selected) {
            ctx.shadowColor = selected ? '#ffffff' : borderColor;
            ctx.shadowBlur = selected ? 20 : 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 5;
        }
        
        const cardGradient = ctx.createLinearGradient(x, y, x, y + h);
        cardGradient.addColorStop(0, borderColor);
        cardGradient.addColorStop(1, this.darkenColor(borderColor, 0.3));
        ctx.fillStyle = cardGradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8 * scale);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetY = 0;
        
        const innerGradient = ctx.createLinearGradient(x, y + 3 * scale, x, y + h - 3 * scale);
        innerGradient.addColorStop(0, '#2a2a4a');
        innerGradient.addColorStop(0.5, '#1a1a3a');
        innerGradient.addColorStop(1, '#0a0a2a');
        ctx.fillStyle = innerGradient;
        ctx.beginPath();
        ctx.roundRect(x + 3 * scale, y + 3 * scale, w - 6 * scale, h - 6 * scale, 6 * scale);
        ctx.fill();
        
        if (selected) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.roundRect(x - 2, y - 2, w + 4, h + 4, 10 * scale);
            ctx.stroke();
        } else if (hovered) {
            ctx.strokeStyle = this.colors.gold;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x - 1, y - 1, w + 2, h + 2, 9 * scale);
            ctx.stroke();
        }
        
        const cost = card.cost === -1 ? 'X' : (card.cost === -2 ? '' : card.cost);
        
        const costGradient = ctx.createRadialGradient(
            x + 20 * scale, y + 20 * scale, 0,
            x + 20 * scale, y + 20 * scale, 16 * scale
        );
        costGradient.addColorStop(0, this.lightenColor(costColor, 0.2));
        costGradient.addColorStop(1, costColor);
        ctx.fillStyle = costGradient;
        ctx.beginPath();
        ctx.arc(x + 20 * scale, y + 20 * scale, 14 * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = this.darkenColor(costColor, 0.3);
        ctx.lineWidth = 2;
        ctx.stroke();
        
        this.drawText(cost, x + 20 * scale, y + 12 * scale, {
            align: 'center',
            font: `bold ${18 * scale}px Arial`,
            color: '#ffffff',
            shadow: '#000000'
        });
        
        const artGradient = ctx.createLinearGradient(x + 8 * scale, y + 40 * scale, x + 8 * scale, y + 90 * scale);
        artGradient.addColorStop(0, this.darkenColor(accentColor, 0.4));
        artGradient.addColorStop(1, this.darkenColor(accentColor, 0.6));
        ctx.fillStyle = artGradient;
        ctx.beginPath();
        ctx.roundRect(x + 8 * scale, y + 40 * scale, w - 16 * scale, 50 * scale, 4 * scale);
        ctx.fill();
        
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1;
        ctx.stroke();
        
        this.drawCardArt(card, x + 8 * scale, y + 40 * scale, w - 16 * scale, 50 * scale);
        
        const nameGradient = ctx.createLinearGradient(x, y + h - 60 * scale, x, y + h - 35 * scale);
        nameGradient.addColorStop(0, 'rgba(0,0,0,0)');
        nameGradient.addColorStop(1, 'rgba(0,0,0,0.5)');
        ctx.fillStyle = nameGradient;
        ctx.fillRect(x + 3 * scale, y + h - 60 * scale, w - 6 * scale, 25 * scale);
        
        this.drawText(card.name, x + w / 2, y + h - 55 * scale, {
            align: 'center',
            font: `bold ${14 * scale}px Arial`,
            color: this.colors.text,
            shadow: '#000000'
        });
        
        this.drawCardDescription(card, x + 8 * scale, y + h - 40 * scale, w - 16 * scale, scale);
        
        ctx.restore();
    },
    
    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.round(255 * amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.round(255 * amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.round(255 * amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    drawCardDescription(card, x, y, w, scale = 1) {
        const desc = card.description || '';
        const lines = this.wrapText(desc, w - 8, this.fonts.small);
        
        lines.slice(0, 3).forEach((line, i) => {
            this.drawText(line, x + 4, y + i * 12 * scale, {
                font: this.fonts.small,
                color: this.colors.textDim
            });
        });
    },
    
    drawCardArt(card, x, y, w, h) {
        const ctx = this.ctx;
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        
        ctx.save();
        
        if (card.type === 'attack') {
            ctx.strokeStyle = '#ff6b6b';
            ctx.fillStyle = '#ff6b6b';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 15);
            ctx.lineTo(centerX + 12, centerY + 10);
            ctx.lineTo(centerX - 12, centerY + 10);
            ctx.closePath();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(centerX - 8, centerY + 5);
            ctx.lineTo(centerX + 8, centerY - 15);
            ctx.stroke();
        } else if (card.type === 'defense') {
            ctx.strokeStyle = '#6b9fff';
            ctx.fillStyle = 'rgba(107, 159, 255, 0.3)';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, 10, 0, Math.PI * 2);
            ctx.stroke();
        } else if (card.type === 'skill') {
            ctx.strokeStyle = '#6bff6b';
            ctx.fillStyle = 'rgba(107, 255, 107, 0.3)';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.moveTo(centerX, centerY - 15);
            ctx.lineTo(centerX + 13, centerY);
            ctx.lineTo(centerX + 8, centerY + 13);
            ctx.lineTo(centerX - 8, centerY + 13);
            ctx.lineTo(centerX - 13, centerY);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        } else if (card.type === 'curse') {
            ctx.strokeStyle = '#9b6bff';
            ctx.fillStyle = 'rgba(155, 107, 255, 0.3)';
            ctx.lineWidth = 2;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(centerX - 8, centerY - 8);
            ctx.lineTo(centerX + 8, centerY + 8);
            ctx.moveTo(centerX + 8, centerY - 8);
            ctx.lineTo(centerX - 8, centerY + 8);
            ctx.stroke();
        }
        
        if (card.effects) {
            const effectIcons = [];
            card.effects.forEach(eff => {
                if (eff.type === 'damage' && !effectIcons.includes('sword')) effectIcons.push('sword');
                if (eff.type === 'block' && !effectIcons.includes('shield')) effectIcons.push('shield');
                if (eff.type === 'draw' && !effectIcons.includes('draw')) effectIcons.push('draw');
                if (eff.type === 'energy' && !effectIcons.includes('energy')) effectIcons.push('energy');
                if (eff.type === 'applyStatus' && eff.status === 'poison' && !effectIcons.includes('poison')) effectIcons.push('poison');
                if (eff.type === 'applyStatus' && eff.status === 'weak' && !effectIcons.includes('weak')) effectIcons.push('weak');
                if (eff.type === 'applyStatus' && eff.status === 'vulnerable' && !effectIcons.includes('vuln')) effectIcons.push('vuln');
                if (eff.lifesteal && !effectIcons.includes('life')) effectIcons.push('life');
            });
            
            ctx.font = '10px Arial';
            ctx.fillStyle = '#ffffff';
            ctx.textAlign = 'center';
            const iconText = effectIcons.map(i => {
                switch(i) {
                    case 'sword': return '⚔';
                    case 'shield': return '🛡';
                    case 'draw': return '📥';
                    case 'energy': return '⚡';
                    case 'poison': return '☠';
                    case 'weak': return '💔';
                    case 'vuln': return '🎯';
                    case 'life': return '❤';
                    default: return '';
                }
            }).join('');
            ctx.fillText(iconText, centerX, y + h - 5);
        }
        
        ctx.restore();
    },
    
    wrapText(text, maxWidth, font) {
        const ctx = this.ctx;
        ctx.font = font;
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';
        
        for (const word of words) {
            const testLine = currentLine + (currentLine ? ' ' : '') + word;
            const metrics = ctx.measureText(testLine);
            
            if (metrics.width > maxWidth && currentLine) {
                lines.push(currentLine);
                currentLine = word;
            } else {
                currentLine = testLine;
            }
        }
        
        if (currentLine) {
            lines.push(currentLine);
        }
        
        return lines;
    },
    
    drawHand(hand, selectedCard = null, hoveredCard = null) {
        const cardWidth = 120;
        const cardHeight = 160;
        const overlap = 80;
        const totalWidth = (hand.length - 1) * overlap + cardWidth;
        const startX = (this.width - totalWidth) / 2;
        const baseY = this.height - cardHeight - 20;
        
        let hoveredCardData = null;
        
        for (let i = 0; i < hand.length; i++) {
            const card = hand[i];
            const x = startX + i * overlap;
            const isSelected = selectedCard && selectedCard.id === card.id;
            const isHovered = hoveredCard && hoveredCard.id === card.id;
            const y = isHovered ? baseY - 30 : (isSelected ? baseY - 50 : baseY);
            
            if (isHovered) {
                hoveredCardData = { card, x, y, isSelected };
            } else {
                this.drawCard(card, x, y, 1, false, isSelected);
            }
        }
        
        if (hoveredCardData) {
            this.drawCard(hoveredCardData.card, hoveredCardData.x, hoveredCardData.y, 1, true, hoveredCardData.isSelected);
        }
    },
    
    drawDrawPile(count) {
        const ctx = this.ctx;
        const x = 50;
        const y = this.height - 200;
        const w = 60;
        const h = 80;
        
        ctx.save();
        
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, '#3a3a5a');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        
        ctx.strokeStyle = '#5a5a8a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const cardStacks = Math.min(3, count);
        for (let i = 0; i < cardStacks; i++) {
            const stackX = x + 4 - i * 2;
            const stackY = y + 4 - i * 2;
            ctx.fillStyle = `rgba(60, 60, 100, ${0.3 + i * 0.2})`;
            ctx.beginPath();
            ctx.roundRect(stackX, stackY, w - 8, h - 8, 6);
            ctx.fill();
        }
        
        ctx.restore();
        
        this.drawText('Draw', x + w / 2, y + 20, { 
            align: 'center', 
            font: this.fonts.small,
            color: this.colors.textDim
        });
        this.drawText(count.toString(), x + w / 2, y + 45, {
            align: 'center',
            font: 'bold 24px Arial',
            color: this.colors.text,
            shadow: '#000000'
        });
    },
    
    drawDiscardPile(count) {
        const ctx = this.ctx;
        const x = this.width - 110;
        const y = this.height - 200;
        const w = 60;
        const h = 80;
        
        ctx.save();
        
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, '#3a3a5a');
        gradient.addColorStop(1, '#1a1a3a');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        
        ctx.strokeStyle = '#5a5a8a';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        const cardStacks = Math.min(3, count);
        for (let i = 0; i < cardStacks; i++) {
            const stackX = x + 4 + i * 2;
            const stackY = y + 4 + i * 2;
            ctx.fillStyle = `rgba(80, 60, 60, ${0.3 + i * 0.2})`;
            ctx.beginPath();
            ctx.roundRect(stackX, stackY, w - 8, h - 8, 6);
            ctx.fill();
        }
        
        ctx.restore();
        
        this.drawText('Discard', x + w / 2, y + 20, { 
            align: 'center', 
            font: this.fonts.small,
            color: this.colors.textDim
        });
        this.drawText(count.toString(), x + w / 2, y + 45, {
            align: 'center',
            font: 'bold 24px Arial',
            color: this.colors.text,
            shadow: '#000000'
        });
    },
    
    getEnemySpriteSize(enemy) {
        const baseSizes = {
            'Slime Cube': 40,
            'Small Slime': 30,
            'Skeleton Warrior': 40,
            'Goblin Scout': 32,
            'Cultist': 40,
            'Giant Rat': 40,
            'Jaw Worm': 48,
            'Demon Imp': 32,
            'Stone Golem': 64,
            'Dark Knight': 40,
            'Swarm of Bats': 48,
            'Necromancer': 40,
            'Mimic': 48,
            'Vampire Lord': 48,
            'Bat': 48,
            'Shadow Assassin': 40,
            'Elder Treant': 64,
            'Sapling': 64,
            'Chaos Elemental': 48,
            'Death Knight': 48,
            'Mind Flayer': 40,
            'The Lich King': 96,
            'The Dragon': 128,
            'Dragon Whelp': 32,
            'The Dark Lord': 96,
            'Shadow Fiend': 48
        };
        return baseSizes[enemy.name] || 48;
    },
    
    drawEnemy(enemy, x, y, selected = false, hovered = false, intentHovered = false, targetable = false, isActing = false) {
        const ctx = this.ctx;
        const spriteSize = this.getEnemySpriteSize(enemy);
        const scale = enemy.isBoss ? 1 : (enemy.size || 1);
        const actualSize = spriteSize * scale;
        
        const anim = enemy.animation || { offsetX: 0, offsetY: 0 };
        const drawX = x + anim.offsetX;
        const drawY = y + anim.offsetY;
        
        ctx.save();
        
        if (isActing) {
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 30;
            const actingGradient = ctx.createRadialGradient(
                drawX + actualSize / 2, drawY + actualSize / 2, actualSize / 4,
                drawX + actualSize / 2, drawY + actualSize / 2, actualSize * 1.2
            );
            actingGradient.addColorStop(0, 'rgba(255, 0, 0, 0.4)');
            actingGradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
            ctx.fillStyle = actingGradient;
            ctx.fillRect(drawX - 30, drawY - 30, actualSize + 60, actualSize + 60);
        }
        
        if (targetable) {
            ctx.shadowColor = '#00ff88';
            ctx.shadowBlur = 25;
            const targetGradient = ctx.createRadialGradient(
                drawX + actualSize / 2, drawY + actualSize / 2, actualSize / 4,
                drawX + actualSize / 2, drawY + actualSize / 2, actualSize * 1.2
            );
            targetGradient.addColorStop(0, 'rgba(0, 255, 136, 0.3)');
            targetGradient.addColorStop(1, 'rgba(0, 255, 136, 0)');
            ctx.fillStyle = targetGradient;
            ctx.fillRect(drawX - 30, drawY - 30, actualSize + 60, actualSize + 60);
        }
        
        if (selected || hovered) {
            ctx.shadowColor = selected ? '#ffff00' : '#ff8800';
            ctx.shadowBlur = 20;
        }
        
        if (selected) {
            const selectGradient = ctx.createRadialGradient(
                drawX + actualSize / 2, drawY + actualSize / 2, actualSize / 4,
                drawX + actualSize / 2, drawY + actualSize / 2, actualSize
            );
            selectGradient.addColorStop(0, 'rgba(255, 255, 0, 0.3)');
            selectGradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
            ctx.fillStyle = selectGradient;
            ctx.fillRect(drawX - 20, drawY - 20, actualSize + 40, actualSize + 40);
        }
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        Sprites.drawEnemy(ctx, enemy, drawX, drawY, scale * 4);
        
        ctx.restore();
        
        this.drawEnemyHPBar(enemy, drawX + (actualSize - 80) / 2, drawY + actualSize + 5);
        
        if (enemy.intent) {
            this.drawEnemyIntent(enemy.intent, x + actualSize / 2, y - 30, intentHovered);
        }
        
        this.drawEnemyStatusEffects(enemy, x, y - 60);
    },
    
    drawEnemyHPBar(enemy, x, y) {
        const ctx = this.ctx;
        const w = 80;
        const h = 12;
        
        ctx.save();
        
        if (enemy.block > 0) {
            const blockPercent = Math.min(enemy.block / enemy.maxHp, 1);
            const blockGradient = ctx.createLinearGradient(x, y, x, y + h);
            blockGradient.addColorStop(0, '#6688aa');
            blockGradient.addColorStop(0.5, '#4466aa');
            blockGradient.addColorStop(1, '#335599');
            ctx.fillStyle = blockGradient;
            ctx.beginPath();
            ctx.roundRect(x, y, w * blockPercent, h, 3);
            ctx.fill();
            
            ctx.strokeStyle = '#88aacc';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x - 1, y - 1, w + 2, h + 2, 4);
            ctx.stroke();
        }
        
        const bgGradient = ctx.createLinearGradient(x, y, x, y + h);
        bgGradient.addColorStop(0, '#2a0000');
        bgGradient.addColorStop(1, '#1a0000');
        ctx.fillStyle = bgGradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 3);
        ctx.fill();
        
        const hpPercent = enemy.hp / enemy.maxHp;
        if (hpPercent > 0) {
            const hpGradient = ctx.createLinearGradient(x, y, x, y + h);
            hpGradient.addColorStop(0, '#ff4444');
            hpGradient.addColorStop(0.5, '#cc0000');
            hpGradient.addColorStop(1, '#880000');
            ctx.fillStyle = hpGradient;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, (w - 2) * hpPercent, h - 2, 2);
            ctx.fill();
        }
        
        ctx.strokeStyle = '#440000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 3);
        ctx.stroke();
        
        ctx.restore();
        
        this.drawText(`${enemy.hp}/${enemy.maxHp}`, x + w / 2, y + h + 2, {
            align: 'center',
            font: this.fonts.small,
            color: this.colors.text,
            shadow: '#000000'
        });
        
        if (enemy.block > 0) {
            this.drawText(`🛡${enemy.block}`, x + w / 2, y - 10, {
                align: 'center',
                font: this.fonts.small,
                color: this.colors.block,
                shadow: '#000000'
            });
        }
    },
    
    drawEnemyIntent(intent, x, y, hovered = false) {
        const ctx = this.ctx;
        let icon = '?';
        let color = this.colors.text;
        let bgColor = this.colors.bgLight;
        
        switch (intent.type) {
            case 'attack':
            case 'attackAll':
            case 'attackAndDebuff':
            case 'attackAndHeal':
                icon = '⚔';
                color = '#ff6666';
                bgColor = '#3a1a1a';
                break;
            case 'block':
                icon = '🛡';
                color = '#6688ff';
                bgColor = '#1a1a3a';
                break;
            case 'buff':
                icon = '↑';
                color = '#ff8844';
                bgColor = '#3a2a1a';
                break;
            case 'debuff':
            case 'multiDebuff':
                icon = '↓';
                color = '#aa88ff';
                bgColor = '#2a1a3a';
                break;
            case 'heal':
            case 'healAndBlock':
                icon = '♥';
                color = '#ff6688';
                bgColor = '#3a1a2a';
                break;
            case 'summon':
                icon = '★';
                color = '#ffcc44';
                bgColor = '#3a3a1a';
                break;
            case 'charge':
                icon = '⚡';
                color = '#ffdd44';
                bgColor = '#3a3a1a';
                break;
            case 'addCard':
                icon = '🃏';
                color = '#cc66ff';
                bgColor = '#2a1a3a';
                break;
        }
        
        ctx.save();
        
        if (hovered) {
            ctx.shadowColor = color;
            ctx.shadowBlur = 10;
        }
        
        const w = 52;
        const h = 32;
        const intentX = x - w / 2;
        const intentY = y - h / 2;
        
        const gradient = ctx.createLinearGradient(intentX, intentY, intentX, intentY + h);
        gradient.addColorStop(0, this.lightenColor(bgColor, 0.1));
        gradient.addColorStop(1, bgColor);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(intentX, intentY, w, h, 6);
        ctx.fill();
        
        ctx.strokeStyle = color;
        ctx.lineWidth = hovered ? 2 : 1;
        ctx.beginPath();
        ctx.roundRect(intentX, intentY, w, h, 6);
        ctx.stroke();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        this.drawText(icon, x, y - 8, { align: 'center', font: 'bold 16px Arial', color });
        
        if (intent.damage) {
            const damageText = intent.times ? `${intent.damage}x${intent.times}` : `${intent.damage}`;
            this.drawText(damageText, x, y + 8, {
                align: 'center',
                font: `bold ${this.fonts.small}`,
                color: '#ff4444'
            });
        }
        
        ctx.restore();
        
        if (hovered) {
            this.drawIntentTooltip(intent, x, y - 50);
        }
    },
    
    drawIntentTooltip(intent, x, y) {
        const lines = [];
        lines.push(intent.name || intent.type);
        
        if (intent.damage) {
            const dmg = intent.times ? `${intent.damage} damage x${intent.times}` : `${intent.damage} damage`;
            lines.push(dmg);
        }
        if (intent.block || intent.value) {
            const val = intent.block || intent.value;
            lines.push(`Block: ${val}`);
        }
        if (intent.heal) {
            lines.push(`Heal: ${intent.heal}`);
        }
        if (intent.status) {
            lines.push(`Apply ${intent.status}: ${intent.value}`);
        }
        if (intent.strength) {
            lines.push(`Strength: +${intent.strength}`);
        }
        if (intent.type === 'attackAll') {
            lines.push('Hits all enemies');
        }
        
        const padding = 8;
        const lineHeight = 16;
        const w = 160;
        const h = lines.length * lineHeight + padding * 2;
        
        const drawX = Math.min(Math.max(x - w / 2, 10), this.width - w - 10);
        const drawY = Math.max(y - h, 10);
        
        this.drawRect(drawX, drawY, w, h, 'rgba(0, 0, 0, 0.9)', 4);
        this.drawBorder(drawX, drawY, w, h, this.colors.gold, 1, 4);
        
        lines.forEach((line, i) => {
            const font = i === 0 ? this.fonts.normal : this.fonts.small;
            const color = i === 0 ? this.colors.gold : this.colors.text;
            this.drawText(line, drawX + w / 2, drawY + padding + i * lineHeight, {
                align: 'center',
                font,
                color
            });
        });
    },
    
    drawEnemyStatusEffects(enemy, x, y) {
        const effects = enemy.statusEffects || {};
        let offsetX = 0;
        
        const statusIcons = [
            { key: 'poison', icon: '☠', color: this.colors.poison },
            { key: 'bleed', icon: '💧', color: this.colors.bleed },
            { key: 'weak', icon: 'W', color: this.colors.weak },
            { key: 'vulnerable', icon: 'V', color: this.colors.vulnerable },
            { key: 'frail', icon: 'F', color: this.colors.frail },
            { key: 'stun', icon: '💫', color: this.colors.energy }
        ];
        
        for (const { key, icon, color } of statusIcons) {
            if (effects[key]) {
                this.drawRect(x + offsetX, y, 20, 16, this.colors.bgLighter, 2);
                this.drawText(`${icon}${effects[key]}`, x + offsetX + 10, y + 2, {
                    align: 'center',
                    font: this.fonts.tiny,
                    color
                });
                offsetX += 24;
            }
        }
    },
    
    drawPlayerBuffs(player) {
        const x = 230;
        const y = this.height - 180;
        const buffs = player.buffs || {};
        const statusEffects = player.statusEffects || {};
        
        let offsetX = 0;
        const offsetY = 0;
        
        const buffIcons = [
            { key: 'strength', icon: 'STR', color: this.colors.strength },
            { key: 'dexterity', icon: 'DEX', color: this.colors.dexterity },
            { key: 'thorns', icon: 'THN', color: this.colors.attack },
            { key: 'demonForm', icon: 'DMN', color: this.colors.purple },
            { key: 'metallicize', icon: 'MTL', color: this.colors.block },
            { key: 'rage', icon: 'RGE', color: this.colors.attack },
            { key: 'juggernaut', icon: 'JUG', color: this.colors.attack },
            { key: 'combust', icon: 'CMB', color: this.colors.hp }
        ];
        
        for (const { key, icon, color } of buffIcons) {
            if (buffs[key]) {
                this.drawRect(x + offsetX, y + offsetY, 36, 20, this.colors.bgLighter, 3);
                this.drawText(`${icon}:${buffs[key]}`, x + offsetX + 18, y + offsetY + 3, {
                    align: 'center',
                    font: this.fonts.tiny,
                    color
                });
                offsetX += 40;
            }
        }
        
        const debuffIcons = [
            { key: 'weak', icon: 'W', color: this.colors.weak },
            { key: 'vulnerable', icon: 'V', color: this.colors.vulnerable },
            { key: 'frail', icon: 'F', color: this.colors.frail },
            { key: 'drawReduction', icon: 'DR', color: this.colors.bleed }
        ];
        
        for (const { key, icon, color } of debuffIcons) {
            if (statusEffects[key]) {
                this.drawRect(x + offsetX, y + offsetY, 28, 20, '#4a0000', 3);
                this.drawText(`${icon}:${statusEffects[key]}`, x + offsetX + 14, y + offsetY + 3, {
                    align: 'center',
                    font: this.fonts.tiny,
                    color
                });
                offsetX += 32;
            }
        }
    },
    
    drawCombatLog(log, x, y, w, h) {
        this.drawRect(x, y, w, h, this.colors.bgLight, 4);
        this.drawBorder(x, y, w, h, this.colors.bgLighter, 1, 4);
        
        const visibleLogs = log.slice(-8);
        visibleLogs.forEach((msg, i) => {
            this.drawText(msg, x + 8, y + 8 + i * 16, {
                font: this.fonts.small,
                color: this.colors.textDim
            });
        });
    },
    
    drawButton(text, x, y, w, h, enabled = true, hovered = false) {
        const ctx = this.ctx;
        
        ctx.save();
        
        if (hovered && enabled) {
            ctx.shadowColor = this.colors.gold;
            ctx.shadowBlur = 15;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
        }
        
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        if (enabled) {
            if (hovered) {
                gradient.addColorStop(0, '#4a4a6a');
                gradient.addColorStop(0.5, '#3a3a5a');
                gradient.addColorStop(1, '#2a2a4a');
            } else {
                gradient.addColorStop(0, '#3a3a5a');
                gradient.addColorStop(0.5, '#2a2a4a');
                gradient.addColorStop(1, '#1a1a3a');
            }
        } else {
            gradient.addColorStop(0, '#2a2a2a');
            gradient.addColorStop(1, '#1a1a1a');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        if (enabled) {
            const borderGradient = ctx.createLinearGradient(x, y, x + w, y + h);
            if (hovered) {
                borderGradient.addColorStop(0, '#ffd700');
                borderGradient.addColorStop(0.5, '#ffaa00');
                borderGradient.addColorStop(1, '#ff8800');
            } else {
                borderGradient.addColorStop(0, '#5a5a7a');
                borderGradient.addColorStop(1, '#3a3a5a');
            }
            ctx.strokeStyle = borderGradient;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.stroke();
            
            if (hovered) {
                ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.roundRect(x - 2, y - 2, w + 4, h + 4, 10);
                ctx.stroke();
            }
        } else {
            ctx.strokeStyle = '#333333';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 8);
            ctx.stroke();
        }
        
        const textColor = enabled 
            ? (hovered ? this.colors.gold : this.colors.text) 
            : this.colors.textDim;
        const font = hovered && enabled ? 'bold 16px Arial' : this.fonts.normal;
        
        this.drawText(text, x + w / 2, y + h / 2 - 8, {
            align: 'center',
            baseline: 'middle',
            font: font,
            color: textColor,
            shadow: hovered && enabled ? '#000000' : null
        });
        
        ctx.restore();
    },
    
    drawTooltip(text, x, y) {
        const lines = text.split('\n');
        const padding = 8;
        const lineHeight = 18;
        const maxWidth = 250;
        
        let maxLineWidth = 0;
        lines.forEach(line => {
            const w = this.ctx.measureText(line).width;
            if (w > maxLineWidth) maxLineWidth = w;
        });
        
        const w = Math.min(maxLineWidth + padding * 2, maxWidth);
        const h = lines.length * lineHeight + padding * 2;
        
        const drawX = Math.min(x, this.width - w - 10);
        const drawY = Math.min(y, this.height - h - 10);
        
        this.drawRect(drawX, drawY, w, h, 'rgba(0, 0, 0, 0.9)', 4);
        this.drawBorder(drawX, drawY, w, h, this.colors.gold, 1, 4);
        
        lines.forEach((line, i) => {
            this.drawText(line, drawX + padding, drawY + padding + i * lineHeight, {
                font: this.fonts.small,
                color: this.colors.text
            });
        });
    },
    
    drawItemTooltip(name, description, nameColor, x, y) {
        const padding = 10;
        const maxWidth = 220;
        
        this.ctx.font = this.fonts.normal;
        const nameWidth = this.ctx.measureText(name).width;
        this.ctx.font = this.fonts.small;
        const descWidth = this.ctx.measureText(description).width;
        const textWidth = Math.max(nameWidth, Math.min(descWidth, maxWidth));
        
        const w = textWidth + padding * 2;
        const h = 60;
        
        const drawX = Math.min(x, this.width - w - 10);
        const drawY = Math.min(y, this.height - h - 10);
        
        this.ctx.fillStyle = 'rgba(20, 20, 30, 0.95)';
        this.ctx.beginPath();
        this.ctx.roundRect(drawX, drawY, w, h, 6);
        this.ctx.fill();
        
        this.ctx.strokeStyle = this.colors.gold;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        
        this.ctx.font = this.fonts.normal;
        this.ctx.fillStyle = nameColor;
        this.ctx.textAlign = 'left';
        this.ctx.fillText(name, drawX + padding, drawY + padding + 14);
        
        this.ctx.font = this.fonts.small;
        this.ctx.fillStyle = this.colors.text;
        const words = description.split(' ');
        let line = '';
        let lineY = drawY + padding + 34;
        for (const word of words) {
            const testLine = line + word + ' ';
            if (this.ctx.measureText(testLine).width > maxWidth) {
                this.ctx.fillText(line, drawX + padding, lineY);
                line = word + ' ';
                lineY += 16;
            } else {
                line = testLine;
            }
        }
        this.ctx.fillText(line, drawX + padding, lineY);
    },
    
    drawMapNode(node, x, y, visited, current, available) {
        const ctx = this.ctx;
        const size = 30;
        let color = this.colors.bgLighter;
        let icon = '?';
        let glowColor = '#333355';
        
        switch (node.type) {
            case 'battle':
                color = '#8b2222';
                icon = '⚔';
                glowColor = '#ff4444';
                break;
            case 'elite':
                color = '#8b8b22';
                icon = '★';
                glowColor = '#ffdd44';
                break;
            case 'boss':
                color = '#6b008b';
                icon = '💀';
                glowColor = '#aa44ff';
                break;
            case 'shop':
                color = '#6b6b22';
                icon = '$';
                glowColor = '#ffdd44';
                break;
            case 'rest':
                color = '#8b2244';
                icon = '♥';
                glowColor = '#ff6688';
                break;
            case 'event':
                color = '#228b22';
                icon = '?';
                glowColor = '#44ff44';
                break;
            case 'treasure':
                color = '#6b6b22';
                icon = '📦';
                glowColor = '#ffdd44';
                break;
        }
        
        if (visited) {
            color = '#3a3a3a';
            glowColor = '#555555';
        }
        
        ctx.save();
        
        if (current) {
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 20;
        } else if (available) {
            ctx.shadowColor = glowColor;
            ctx.shadowBlur = 15;
        }
        
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, size);
        gradient.addColorStop(0, this.lightenColor(color, 0.2));
        gradient.addColorStop(0.7, color);
        gradient.addColorStop(1, this.darkenColor(color, 0.3));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        if (current) {
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(x, y, size + 4, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, size + 8, 0, Math.PI * 2);
            ctx.stroke();
        } else if (available) {
            ctx.strokeStyle = this.colors.gold;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x, y, size + 3, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        ctx.restore();
        
        this.drawText(icon, x, y - 6, {
            align: 'center',
            font: this.fonts.normal,
            color: visited ? this.colors.textDim : this.colors.text,
            shadow: '#000000'
        });
    },
    
    drawMapConnections(nodes, floorY) {
        const ctx = this.ctx;
        ctx.strokeStyle = this.colors.bgLighter;
        ctx.lineWidth = 2;
        
        nodes.forEach(node => {
            if (node.connections) {
                node.connections.forEach(connIdx => {
                    const connNode = nodes.find(n => n.floor === node.floor - 1 && n.index === connIdx);
                    if (connNode) {
                        const x1 = connNode.x;
                        const y1 = floorY(connNode.floor);
                        const x2 = node.x;
                        const y2 = floorY(node.floor);
                        
                        ctx.beginPath();
                        ctx.moveTo(x1, y1);
                        ctx.lineTo(x2, y2);
                        ctx.stroke();
                    }
                });
            }
        });
    },
    
    drawShop(shopItems, playerGold, selectedCategory, hoveredButton = null) {
        const ctx = this.ctx;
        const categories = ['Cards', 'Relics', 'Potions', 'Remove Card'];
        const catY = 80;
        
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
        this.drawText('SHOP', this.width / 2, 30, {
            align: 'center',
            font: 'bold 36px Arial',
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        categories.forEach((cat, i) => {
            const x = 200 + i * 220;
            const selected = selectedCategory === i;
            const hovered = hoveredButton === `category-${i}`;
            this.drawButton(cat, x, catY, 180, 40, true, selected || hovered);
        });
        
        const goldBg = ctx.createLinearGradient(this.width - 200, 10, this.width - 100, 50);
        goldBg.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
        goldBg.addColorStop(1, 'rgba(255, 215, 0, 0.05)');
        ctx.fillStyle = goldBg;
        ctx.beginPath();
        ctx.roundRect(this.width - 200, 10, 180, 40, 8);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        this.drawText(`💰 ${playerGold}`, this.width - 110, 20, {
            align: 'center',
            font: this.fonts.header,
            color: this.colors.gold,
            shadow: '#000000'
        });
    },
    
    drawRewardScreen(rewards, selectedReward) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const startY = 150;
        
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 40;
        
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = `rgba(255, 215, 0, ${0.1 - i * 0.03})`;
            ctx.beginPath();
            ctx.arc(centerX, 50, 150 + i * 30, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.drawText('VICTORY!', centerX, 50, {
            align: 'center',
            font: 'bold 48px Arial',
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        const goldBg = ctx.createLinearGradient(centerX - 100, startY - 10, centerX + 100, startY + 30);
        goldBg.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
        goldBg.addColorStop(1, 'rgba(255, 215, 0, 0.05)');
        ctx.fillStyle = goldBg;
        ctx.beginPath();
        ctx.roundRect(centerX - 100, startY - 10, 200, 40, 8);
        ctx.fill();
        
        this.drawText(`💰 ${rewards.gold} Gold`, centerX, startY, {
            align: 'center',
            font: this.fonts.header,
            color: this.colors.gold,
            shadow: '#000000'
        });
        
        if (rewards.cards && rewards.cards.length > 0) {
            this.drawText('Choose a card to add to your deck:', centerX, startY + 60, {
                align: 'center',
                font: this.fonts.normal,
                color: this.colors.text
            });
            
            const cardWidth = 120;
            const totalWidth = rewards.cards.length * (cardWidth + 20);
            const startX = centerX - totalWidth / 2;
            
            rewards.cards.forEach((card, i) => {
                this.drawCard(card, startX + i * (cardWidth + 20), startY + 100, 1, false, selectedReward === i);
            });
        }
        
        if (rewards.relics && rewards.relics.length > 0) {
            ctx.save();
            ctx.shadowColor = '#aa88ff';
            ctx.shadowBlur = 20;
            this.drawText('✨ Relic obtained! ✨', centerX, startY + 300, {
                align: 'center',
                font: this.fonts.header,
                color: '#aa88ff',
                shadow: '#000000'
            });
            ctx.restore();
        }
        
        this.drawButton('Skip', centerX - 60, this.height - 100, 120, 40, true, selectedReward === -2);
    },
    
    drawEventScreen(event, selectedChoice) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.save();
        ctx.shadowColor = 'rgba(75, 0, 130, 0.5)';
        ctx.shadowBlur = 30;
        
        const eventBg = ctx.createLinearGradient(100, 80, 100, 280);
        eventBg.addColorStop(0, '#2a2a4a');
        eventBg.addColorStop(0.5, '#1a1a3a');
        eventBg.addColorStop(1, '#0a0a2a');
        ctx.fillStyle = eventBg;
        ctx.beginPath();
        ctx.roundRect(100, 80, this.width - 200, 200, 12);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        const borderGradient = ctx.createLinearGradient(100, 80, this.width - 100, 280);
        borderGradient.addColorStop(0, '#6a4a8a');
        borderGradient.addColorStop(0.5, '#4a2a6a');
        borderGradient.addColorStop(1, '#3a1a5a');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(100, 80, this.width - 200, 200, 12);
        ctx.stroke();
        
        const innerGlow = ctx.createRadialGradient(centerX, 180, 0, centerX, 180, 300);
        innerGlow.addColorStop(0, 'rgba(100, 50, 150, 0.15)');
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerGlow;
        ctx.fillRect(102, 82, this.width - 204, 196);
        
        ctx.restore();
        
        ctx.save();
        ctx.shadowColor = '#aa88ff';
        ctx.shadowBlur = 15;
        this.drawText(event.name, centerX, 100, {
            align: 'center',
            font: this.fonts.header,
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        const lines = this.wrapText(event.description, this.width - 240, this.fonts.normal);
        lines.forEach((line, i) => {
            this.drawText(line, centerX, 150 + i * 24, {
                align: 'center',
                font: this.fonts.normal,
                color: this.colors.text
            });
        });
        
        if (event.choices) {
            event.choices.forEach((choice, i) => {
                const y = 320 + i * 60;
                const available = this.isChoiceAvailable(choice);
                const hovered = selectedChoice === i;
                this.drawButton(choice.text, centerX - 200, y, 400, 50, available, hovered);
            });
        }
    },
    
    isChoiceAvailable(choice) {
        if (!choice.condition) return true;
        
        const player = Game.player;
        switch (choice.condition.type) {
            case 'gold':
                return player.gold >= choice.condition.value;
            case 'hp':
                return player.hp > choice.condition.value;
            case 'hasRelic':
                return player.relics.includes(choice.condition.relic);
            default:
                return true;
        }
    },
    
    drawEventResult(result, hovered = false) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.save();
        ctx.shadowColor = 'rgba(75, 0, 130, 0.5)';
        ctx.shadowBlur = 30;
        
        const eventBg = ctx.createLinearGradient(100, 80, 100, 350);
        eventBg.addColorStop(0, '#2a2a4a');
        eventBg.addColorStop(0.5, '#1a1a3a');
        eventBg.addColorStop(1, '#0a0a2a');
        ctx.fillStyle = eventBg;
        ctx.beginPath();
        ctx.roundRect(100, 80, this.width - 200, 270, 12);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        const borderGradient = ctx.createLinearGradient(100, 80, this.width - 100, 350);
        borderGradient.addColorStop(0, '#6a4a8a');
        borderGradient.addColorStop(0.5, '#4a2a6a');
        borderGradient.addColorStop(1, '#3a1a5a');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(100, 80, this.width - 200, 270, 12);
        ctx.stroke();
        
        ctx.restore();
        
        ctx.save();
        ctx.shadowColor = '#aa88ff';
        ctx.shadowBlur = 15;
        this.drawText('Result', centerX, 100, {
            align: 'center',
            font: this.fonts.header,
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        const lines = this.wrapText(result.text || 'Something happened...', this.width - 240, this.fonts.normal);
        lines.forEach((line, i) => {
            this.drawText(line, centerX, 150 + i * 24, {
                align: 'center',
                font: this.fonts.normal,
                color: this.colors.text
            });
        });
        
        let effectY = 150 + lines.length * 24 + 20;
        if (result.effects && result.effects.length > 0) {
            result.effects.forEach((effect, i) => {
                let text = '';
                let color = this.colors.text;
                
                switch (effect.type) {
                    case 'gold':
                        text = `${effect.value > 0 ? '+' : ''}${effect.value} Gold`;
                        color = effect.value > 0 ? this.colors.gold : '#ff6666';
                        break;
                    case 'heal':
                        text = `+${effect.value} HP`;
                        color = '#66ff66';
                        break;
                    case 'damage':
                        text = `-${effect.value} HP`;
                        color = '#ff6666';
                        break;
                    case 'strength':
                        text = `+${effect.value} Strength`;
                        color = '#ff4444';
                        break;
                    case 'dexterity':
                        text = `+${effect.value} Dexterity`;
                        color = '#44ff44';
                        break;
                    case 'addCard':
                        text = `Added: ${effect.card}`;
                        color = '#aa88ff';
                        break;
                    case 'removeCard':
                        text = `Removed: ${effect.card}`;
                        color = '#888888';
                        break;
                    case 'upgrade':
                        text = `Upgraded: ${effect.card}`;
                        color = '#44aaff';
                        break;
                    case 'addRelic':
                        text = `Obtained: ${effect.relic}`;
                        color = this.colors.gold;
                        break;
                    case 'addPotion':
                        text = `Obtained: ${effect.potion}`;
                        color = '#ff88ff';
                        break;
                    case 'removeCardRequest':
                        text = 'Select a card to remove';
                        color = '#ff88ff';
                        break;
                    case 'teleport':
                        text = 'Teleported forward!';
                        color = '#aa88ff';
                        break;
                    case 'arena':
                        text = 'Arena battle begins!';
                        color = '#ff8844';
                        break;
                    case 'debuff':
                        text = `Afflicted with ${effect.value}`;
                        color = '#ff4444';
                        break;
                }
                
                if (text) {
                    this.drawText(text, centerX, effectY + i * 22, {
                        align: 'center',
                        font: this.fonts.normal,
                        color: color,
                        shadow: '#000000'
                    });
                }
            });
        }
        
        this.drawButton('Continue', centerX - 75, 400, 150, 50, true, hovered);
    },
    
    drawTreasureResult(result, hovered = false) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.save();
        ctx.shadowColor = 'rgba(255, 200, 50, 0.5)';
        ctx.shadowBlur = 30;
        
        const bg = ctx.createLinearGradient(100, 80, 100, 350);
        bg.addColorStop(0, '#3a3020');
        bg.addColorStop(0.5, '#2a2515');
        bg.addColorStop(1, '#1a150a');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(100, 80, this.width - 200, 270, 12);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        
        const borderGradient = ctx.createLinearGradient(100, 80, this.width - 100, 350);
        borderGradient.addColorStop(0, '#aa8833');
        borderGradient.addColorStop(0.5, '#886622');
        borderGradient.addColorStop(1, '#664411');
        ctx.strokeStyle = borderGradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(100, 80, this.width - 200, 270, 12);
        ctx.stroke();
        
        ctx.restore();
        
        ctx.save();
        ctx.shadowColor = '#ffcc00';
        ctx.shadowBlur = 15;
        this.drawText('Treasure Found!', centerX, 100, {
            align: 'center',
            font: this.fonts.header,
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        let y = 150;
        
        if (result.gold) {
            this.drawText(`+${result.gold} Gold`, centerX, y, {
                align: 'center',
                font: this.fonts.normal,
                color: this.colors.gold,
                shadow: '#000000'
            });
            y += 28;
        }
        
        if (result.relics && result.relics.length > 0) {
            result.relics.forEach(relicName => {
                this.drawText(`Obtained: ${relicName}`, centerX, y, {
                    align: 'center',
                    font: this.fonts.normal,
                    color: '#ffaa44',
                    shadow: '#000000'
                });
                y += 24;
            });
        }
        
        if (result.cards && result.cards.length > 0) {
            result.cards.forEach(cardName => {
                this.drawText(`Added to deck: ${cardName}`, centerX, y, {
                    align: 'center',
                    font: this.fonts.normal,
                    color: '#aa88ff',
                    shadow: '#000000'
                });
                y += 24;
            });
        }
        
        this.drawButton('Continue', centerX - 75, 400, 150, 50, true, hovered);
    },
    
    drawRestScreen(hoveredButton = null) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.save();
        ctx.shadowColor = '#ff6644';
        ctx.shadowBlur = 30;
        
        for (let i = 0; i < 3; i++) {
            ctx.fillStyle = `rgba(255, 100, 50, ${0.1 - i * 0.03})`;
            ctx.beginPath();
            ctx.arc(centerX, 100, 100 + i * 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.drawText('Rest Site', centerX, 100, {
            align: 'center',
            font: 'bold 48px Arial',
            color: '#ff8866',
            shadow: '#000000'
        });
        ctx.restore();
        
        const restHovered = hoveredButton === 'rest';
        const upgradeHovered = hoveredButton === 'upgrade';
        
        this.drawButton('Rest (Heal 30% HP)', centerX - 150, 250, 300, 50, true, restHovered);
        this.drawButton('Upgrade a Card', centerX - 150, 320, 300, 50, true, upgradeHovered);
    },
    
    drawGameOverScreen(victory, hoveredButton = null) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        const bgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, this.width / 2);
        if (victory) {
            bgGradient.addColorStop(0, 'rgba(50, 40, 0, 0.9)');
            bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        } else {
            bgGradient.addColorStop(0, 'rgba(40, 0, 0, 0.9)');
            bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        }
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        if (victory) {
            ctx.save();
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 40;
            
            for (let i = 0; i < 3; i++) {
                ctx.fillStyle = `rgba(255, 215, 0, ${0.1 - i * 0.03})`;
                ctx.beginPath();
                ctx.arc(centerX, centerY - 50, 150 + i * 30, 0, Math.PI * 2);
                ctx.fill();
            }
            
            this.drawText('VICTORY!', centerX, centerY - 50, {
                align: 'center',
                font: 'bold 64px Arial',
                color: this.colors.gold,
                shadow: '#000000'
            });
            ctx.restore();
        } else {
            ctx.save();
            ctx.shadowColor = '#ff0000';
            ctx.shadowBlur = 30;
            
            this.drawText('DEFEAT', centerX, centerY - 50, {
                align: 'center',
                font: 'bold 64px Arial',
                color: this.colors.hp,
                shadow: '#000000'
            });
            ctx.restore();
        }
        
        this.drawButton('Main Menu', centerX - 75, centerY + 50, 150, 50, true, hoveredButton === 'mainMenu');
    },
    
    drawMainMenu(hoveredButton = null) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.drawEnvironment('menu');
        
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 30;
        this.drawText('DUNGEON CARDS', centerX, 150, {
            align: 'center',
            font: 'bold 72px Arial',
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        for (let i = 0; i < 5; i++) {
            ctx.fillStyle = `rgba(255, 215, 0, ${0.02 - i * 0.003})`;
            ctx.beginPath();
            ctx.arc(centerX, 150, 200 + i * 30, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.drawButton('New Game', centerX - 100, centerY - 30, 200, 50, true, hoveredButton === 'newGame');
        this.drawButton('How to Play', centerX - 100, centerY + 40, 200, 50, true, hoveredButton === 'howToPlay');
    },
    
    drawHowToPlay(hoveredButton = null) {
        const ctx = this.ctx;
        this.drawEnvironment('menu');
        
        const instructions = [
            { text: 'DUNGEON CARDS - How to Play', font: this.fonts.header, color: this.colors.gold },
            { text: '', font: this.fonts.normal, color: this.colors.text },
            { text: 'Combat:', font: this.fonts.header, color: this.colors.attack },
            { text: '• Play cards by clicking them, then click a target', font: this.fonts.normal, color: this.colors.text },
            { text: '• Attacks deal damage, Defense cards give block', font: this.fonts.normal, color: this.colors.text },
            { text: '• Skills provide various effects', font: this.fonts.normal, color: this.colors.text },
            { text: '• Energy is required to play cards (refills each turn)', font: this.fonts.normal, color: this.colors.text },
            { text: '• Block protects from damage but resets each turn', font: this.fonts.normal, color: this.colors.text },
            { text: '', font: this.fonts.normal, color: this.colors.text },
            { text: 'Map:', font: this.fonts.header, color: this.colors.skill },
            { text: '• Navigate through floors by choosing paths', font: this.fonts.normal, color: this.colors.text },
            { text: '• Battle nodes: Fight enemies', font: this.fonts.normal, color: this.colors.text },
            { text: '• Elite nodes: Fight stronger enemies for better rewards', font: this.fonts.normal, color: this.colors.text },
            { text: '• Shop: Buy cards, relics, and potions', font: this.fonts.normal, color: this.colors.text },
            { text: '• Rest: Heal or upgrade a card', font: this.fonts.normal, color: this.colors.text },
            { text: '• Event: Random encounters with choices', font: this.fonts.normal, color: this.colors.text },
            { text: '', font: this.fonts.normal, color: this.colors.text },
            { text: 'Progression:', font: this.fonts.header, color: this.colors.energy },
            { text: '• Defeat bosses to advance acts', font: this.fonts.normal, color: this.colors.text },
            { text: '• Collect relics for permanent bonuses', font: this.fonts.normal, color: this.colors.text },
            { text: '• Build your deck with new cards', font: this.fonts.normal, color: this.colors.text }
        ];
        
        instructions.forEach((item, i) => {
            this.drawText(item.text, 100, 50 + i * 28, { font: item.font, color: item.color });
        });
        
        this.drawButton('Back', this.width / 2 - 60, this.height - 80, 120, 40, true, hoveredButton === 'back');
    },
    
    drawDeckView(deck, hoveredCard) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.save();
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 20;
        this.drawText('Your Deck', centerX, 30, {
            align: 'center',
            font: this.fonts.header,
            color: this.colors.gold,
            shadow: '#000000'
        });
        ctx.restore();
        
        this.drawText(`${deck.length} cards`, centerX, 60, {
            align: 'center',
            font: this.fonts.normal,
            color: this.colors.textDim
        });
        
        const cardsPerRow = 8;
        const cardW = 100;
        const cardH = 140;
        const padding = 10;
        const startX = centerX - (Math.min(deck.length, cardsPerRow) * (cardW + padding)) / 2;
        const startY = 90;
        
        deck.forEach((card, i) => {
            const row = Math.floor(i / cardsPerRow);
            const col = i % cardsPerRow;
            const x = startX + col * (cardW + padding);
            const y = startY + row * (cardH + padding);
            const isHovered = hoveredCard && hoveredCard.id === card.id;
            this.drawCard(card, x, y, 0.8, isHovered, false);
        });
        
        this.drawButton('Close', centerX - 60, this.height - 80, 120, 40, true, false);
    },
    
    drawUpgradePreview(card, x, y) {
        if (!card || !card.upgrade) return;
        
        const ctx = this.ctx;
        const w = 280;
        const h = 180;
        
        ctx.save();
        ctx.shadowColor = '#44ff44';
        ctx.shadowBlur = 15;
        
        const bg = ctx.createLinearGradient(x - w/2, y, x + w/2, y + h);
        bg.addColorStop(0, '#1a2a1a');
        bg.addColorStop(0.5, '#0a1a0a');
        bg.addColorStop(1, '#051005');
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(x - w/2, y, w, h, 8);
        ctx.fill();
        
        ctx.shadowColor = 'transparent';
        ctx.strokeStyle = '#44ff44';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
        
        this.drawText('Upgrade Preview', x, y + 15, {
            align: 'center',
            font: this.fonts.header,
            color: '#44ff44'
        });
        
        const upgrade = card.upgrade;
        let lineY = y + 50;
        
        if (upgrade.cost !== undefined && upgrade.cost !== card.cost) {
            this.drawText(`Cost: ${card.cost} → ${upgrade.cost}`, x, lineY, {
                align: 'center',
                font: this.fonts.normal,
                color: upgrade.cost < card.cost ? '#44ff44' : this.colors.text
            });
            lineY += 22;
        }
        
        if (upgrade.damage && card.effects) {
            const currentDmg = card.effects.find(e => e.type === 'damage')?.value || 0;
            this.drawText(`Damage: ${currentDmg} → ${upgrade.damage}`, x, lineY, {
                align: 'center',
                font: this.fonts.normal,
                color: '#ff4444'
            });
            lineY += 22;
        }
        
        if (upgrade.block && card.effects) {
            const currentBlock = card.effects.find(e => e.type === 'block')?.value || 0;
            this.drawText(`Block: ${currentBlock} → ${upgrade.block}`, x, lineY, {
                align: 'center',
                font: this.fonts.normal,
                color: '#4488ff'
            });
            lineY += 22;
        }
        
        if (upgrade.description) {
            this.drawText('New Effect:', x, lineY, {
                align: 'center',
                font: this.fonts.small,
                color: this.colors.textDim
            });
            lineY += 18;
            const lines = this.wrapText(upgrade.description, w - 20, this.fonts.small);
            lines.slice(0, 3).forEach((line, i) => {
                this.drawText(line, x, lineY + i * 14, {
                    align: 'center',
                    font: this.fonts.small,
                    color: this.colors.text
                });
            });
        }
    },
    
    drawDiscardSelection(hand, pendingAction, hoveredCard, selectedCards) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.save();
        ctx.shadowColor = '#ff6b6b';
        ctx.shadowBlur = 15;
        this.drawText(`Select ${pendingAction.count} card${pendingAction.count > 1 ? 's' : ''} to discard`, centerX, 50, {
            align: 'center',
            font: this.fonts.header,
            color: '#ff6b6b'
        });
        ctx.restore();
        
        this.drawText(`${selectedCards.length} / ${pendingAction.count} selected`, centerX, 80, {
            align: 'center',
            font: this.fonts.normal,
            color: this.colors.textDim
        });
        
        const cardWidth = 120;
        const cardHeight = 160;
        const overlap = 80;
        const totalWidth = (hand.length - 1) * overlap + cardWidth;
        const startX = (this.width - totalWidth) / 2;
        const baseY = this.height / 2 - 80;
        
        hand.forEach((card, i) => {
            const x = startX + i * overlap;
            const y = baseY;
            const isHovered = hoveredCard && hoveredCard.id === card.id;
            const isSelected = selectedCards.includes(card.id);
            
            this.drawCard(card, x, isHovered ? y - 20 : y, 1, isHovered, false);
            
            if (isSelected) {
                ctx.strokeStyle = '#ff6b6b';
                ctx.lineWidth = 3;
                ctx.strokeRect(x - 2, (isHovered ? y - 20 : y) - 2, cardWidth + 4, cardHeight + 4);
            }
        });
        
        const canConfirm = selectedCards.length === pendingAction.count;
        this.drawButton('Confirm', centerX - 130, this.height - 80, 120, 40, canConfirm, false);
        this.drawButton('Cancel', centerX + 10, this.height - 80, 120, 40, true, false);
    }
};
