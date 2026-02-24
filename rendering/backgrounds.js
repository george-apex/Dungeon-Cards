const Backgrounds = {
    time: 0,
    
    update(deltaTime) {
        this.time += deltaTime * 0.001;
    },
    
    draw(ctx, w, h, screenType, act = 1, options = {}) {
        const theme = THEMES.getActTheme(act);
        const screenTheme = THEMES.getScreenTheme(screenType);
        
        this.drawBaseGradient(ctx, w, h, theme);
        
        switch (screenType) {
            case 'menu':
                this.drawMenuBackground(ctx, w, h, theme);
                break;
            case 'map':
                this.drawMapBackground(ctx, w, h, theme);
                break;
            case 'combat':
                this.drawCombatBackground(ctx, w, h, theme, options);
                break;
            case 'shop':
                this.drawShopBackground(ctx, w, h, theme);
                break;
            case 'rest':
                this.drawRestBackground(ctx, w, h, theme);
                break;
            case 'event':
                this.drawEventBackground(ctx, w, h, theme, options.eventName);
                break;
            case 'reward':
                this.drawRewardBackground(ctx, w, h, theme);
                break;
            case 'gameOver':
                this.drawGameOverBackground(ctx, w, h, theme);
                break;
            case 'victory':
                this.drawVictoryBackground(ctx, w, h, theme);
                break;
            default:
                this.drawDefaultBackground(ctx, w, h, theme);
        }
        
        if (screenType !== 'map') {
            this.drawFog(ctx, w, h, theme);
        }
    },
    
    drawBaseGradient(ctx, w, h, theme) {
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, theme.colors.bg1);
        gradient.addColorStop(0.5, theme.colors.bg2);
        gradient.addColorStop(1, theme.colors.bg3);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
    },
    
    drawFog(ctx, w, h, theme) {
        const fogColor = theme.colors.fog;
        ctx.fillStyle = fogColor;
        
        for (let i = 0; i < 3; i++) {
            const offset = this.time * 20 + i * 200;
            const x = (Math.sin(offset * 0.001) * 100 + offset) % (w + 400) - 200;
            const y = h * 0.6 + Math.sin(this.time + i) * 50;
            
            ctx.globalAlpha = 0.3;
            ctx.beginPath();
            ctx.ellipse(x, y, 300, 100, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    },
    
    drawMenuBackground(ctx, w, h, theme) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.15)';
        for (let i = 0; i < 5; i++) {
            const x = w / 2 + Math.sin(this.time * 0.5 + i) * 100;
            const y = 150 + Math.cos(this.time * 0.3 + i * 0.5) * 30;
            const radius = 150 + i * 40 + Math.sin(this.time + i) * 20;
            
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
        ctx.lineWidth = 3;
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2 + this.time * 0.2;
            const x1 = w / 2 + Math.cos(angle) * 100;
            const y1 = 150 + Math.sin(angle) * 50;
            const x2 = w / 2 + Math.cos(angle) * 300;
            const y2 = 150 + Math.sin(angle) * 150;
            
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        
        this.drawStonePillars(ctx, w, h, theme, 6);
    },
    
    drawMapBackground(ctx, w, h, theme) {
        const margin = 40;
        const mapW = w - margin * 2;
        const mapH = h - margin * 2;
        
        ctx.save();
        ctx.beginPath();
        
        const tearPoints = [];
        const segments = 60;
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const baseX = margin + t * mapW;
            const tear = Math.sin(t * 15) * 3 + Math.sin(t * 7) * 5 + Math.sin(t * 23) * 2;
            tearPoints.push({ x: baseX + tear, y: margin });
        }
        
        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            const baseY = margin + t * mapH;
            const tear = Math.sin(t * 13) * 4 + Math.sin(t * 9) * 3;
            tearPoints.push({ x: margin + mapW + tear, y: baseY });
        }
        
        for (let i = segments; i >= 0; i--) {
            const t = i / segments;
            const baseX = margin + t * mapW;
            const tear = Math.sin(t * 17) * 4 + Math.sin(t * 11) * 3 + Math.sin(t * 25) * 2;
            tearPoints.push({ x: baseX + tear, y: margin + mapH });
        }
        
        for (let i = segments; i >= 0; i--) {
            const t = i / segments;
            const baseY = margin + t * mapH;
            const tear = Math.sin(t * 19) * 3 + Math.sin(t * 8) * 4;
            tearPoints.push({ x: margin + tear, y: baseY });
        }
        
        ctx.moveTo(tearPoints[0].x, tearPoints[0].y);
        for (let i = 1; i < tearPoints.length; i++) {
            ctx.lineTo(tearPoints[i].x, tearPoints[i].y);
        }
        ctx.closePath();
        
        const gradient = ctx.createLinearGradient(margin, margin, margin + mapW, margin + mapH);
        gradient.addColorStop(0, '#d9c9a9');
        gradient.addColorStop(0.3, '#e0d4b8');
        gradient.addColorStop(0.7, '#d4c4a4');
        gradient.addColorStop(1, '#cbb898');
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.strokeStyle = '#8b7355';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.strokeStyle = '#a08060';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let i = 0; i < tearPoints.length; i++) {
            const p = tearPoints[i];
            const offsetX = (i % 2 === 0) ? 3 : -3;
            const offsetY = (i % 3 === 0) ? 2 : -2;
            if (i === 0) ctx.moveTo(p.x + offsetX, p.y + offsetY);
            else ctx.lineTo(p.x + offsetX, p.y + offsetY);
        }
        ctx.stroke();
        
        ctx.restore();
    },
    
    drawCombatBackground(ctx, w, h, theme, options = {}) {
        this.drawDungeonWalls(ctx, w, h, theme);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(0, h - 180, w, 180);
        
        ctx.fillStyle = '#2a2a2a';
        for (let x = 0; x < w; x += 100) {
            ctx.fillRect(x, h - 185, 80, 8);
        }
        
        ctx.fillStyle = 'rgba(255, 200, 100, 0.08)';
        const lightX = w / 2 + Math.sin(this.time * 0.5) * 50;
        ctx.beginPath();
        ctx.ellipse(lightX, -30, 250, 150, 0, 0, Math.PI * 2);
        ctx.fill();
        
        for (let i = 0; i < 3; i++) {
            const rayX = lightX + (i - 1) * 100;
            ctx.fillStyle = `rgba(255, 200, 100, ${0.03 - i * 0.008})`;
            ctx.beginPath();
            ctx.moveTo(rayX - 30, 0);
            ctx.lineTo(rayX + 30, 0);
            ctx.lineTo(rayX + 100, h);
            ctx.lineTo(rayX - 100, h);
            ctx.closePath();
            ctx.fill();
        }
    },
    
    drawDungeonWalls(ctx, w, h, theme) {
        ctx.fillStyle = theme.colors.accent;
        
        for (let i = 0; i < 10; i++) {
            const x = i * 140 - 20;
            ctx.fillRect(x, 0, 35, h);
            ctx.fillRect(x + 50, 0, 18, h);
        }
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        for (let i = 0; i < 10; i++) {
            const x = i * 140;
            ctx.fillRect(x + 35, 0, 15, h);
        }
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
        for (let i = 0; i < 10; i++) {
            const x = i * 140 + 5;
            ctx.fillRect(x, 0, 3, h);
        }
    },
    
    drawShopBackground(ctx, w, h, theme) {
        ctx.fillStyle = '#1a1a0a';
        ctx.fillRect(0, h - 220, w, 220);
        
        ctx.fillStyle = '#3a3a2a';
        ctx.fillRect(80, h - 280, w - 160, 70);
        
        ctx.fillStyle = '#2a2a1a';
        ctx.fillRect(80, h - 280, w - 160, 10);
        
        ctx.fillStyle = '#ffd700';
        for (let i = 0; i < 6; i++) {
            const x = 150 + i * 180;
            const flicker = 0.7 + Math.sin(this.time * 3 + i) * 0.3;
            ctx.globalAlpha = flicker;
            ctx.beginPath();
            ctx.arc(x, h - 250, 6, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = `rgba(255, 200, 100, ${0.2 * flicker})`;
            ctx.beginPath();
            ctx.arc(x, h - 250, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffd700';
        }
        ctx.globalAlpha = 1;
        
        ctx.fillStyle = '#5a4030';
        ctx.fillRect(120, h - 200, 180, 120);
        ctx.fillRect(w - 320, h - 200, 180, 120);
        
        ctx.fillStyle = '#3a2a20';
        ctx.fillRect(130, h - 190, 160, 100);
        ctx.fillRect(w - 310, h - 190, 160, 100);
        
        this.drawStonePillars(ctx, w, h, theme, 4);
    },
    
    drawRestBackground(ctx, w, h, theme) {
        ctx.fillStyle = '#1a0a00';
        ctx.fillRect(0, h - 120, w, 120);
        
        const fireX = w / 2;
        const fireY = h - 70;
        
        for (let i = 0; i < 5; i++) {
            const radius = 50 - i * 8;
            const flicker = Math.sin(this.time * 4 + i * 0.5) * 5;
            const colors = ['#ff2200', '#ff4400', '#ff6600', '#ff8800', '#ffaa00'];
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(fireX + flicker, fireY, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        for (let i = 0; i < 8; i++) {
            const angle = this.time * 2 + i * 0.8;
            const dist = 60 + Math.sin(this.time * 3 + i) * 20;
            const x = fireX + Math.cos(angle) * dist;
            const y = fireY - 30 - Math.abs(Math.sin(angle)) * 50;
            const size = 3 + Math.random() * 3;
            
            ctx.fillStyle = `rgba(255, ${100 + Math.random() * 100}, 0, ${0.8 - i * 0.1})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(fireX - 100, h - 80, 25, 80);
        ctx.fillRect(fireX + 75, h - 80, 25, 80);
        
        for (let i = 0; i < 3; i++) {
            const glowRadius = 100 + i * 50 + Math.sin(this.time * 2) * 20;
            ctx.fillStyle = `rgba(255, 100, 0, ${0.1 - i * 0.03})`;
            ctx.beginPath();
            ctx.arc(fireX, fireY, glowRadius, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawEventBackground(ctx, w, h, theme, eventName) {
        const eventTheme = THEMES.getEventTheme(eventName);
        
        ctx.fillStyle = 'rgba(75, 0, 130, 0.15)';
        ctx.fillRect(0, 0, w, h);
        
        for (let i = 0; i < 30; i++) {
            const x = (i * 47 + this.time * 20) % w;
            const y = (i * 31 + Math.sin(this.time + i) * 20) % h;
            const alpha = 0.3 + Math.sin(this.time * 2 + i) * 0.2;
            
            ctx.fillStyle = `rgba(150, 100, 200, ${alpha * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.fillStyle = '#1a1a2a';
        this.drawRoundedRect(ctx, 80, 60, w - 160, 240, 12);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(150, 100, 200, 0.5)';
        ctx.lineWidth = 2;
        this.drawRoundedRect(ctx, 80, 60, w - 160, 240, 12);
        ctx.stroke();
        
        const innerGlow = ctx.createRadialGradient(w / 2, 180, 0, w / 2, 180, 300);
        innerGlow.addColorStop(0, 'rgba(100, 50, 150, 0.2)');
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = innerGlow;
        ctx.fillRect(82, 62, w - 164, 236);
        
        this.drawStonePillars(ctx, w, h, theme, 4);
    },
    
    drawRewardBackground(ctx, w, h, theme) {
        const centerX = w / 2;
        
        for (let i = 0; i < 5; i++) {
            const radius = 100 + i * 40 + Math.sin(this.time * 2 + i) * 10;
            ctx.fillStyle = `rgba(255, 215, 0, ${0.08 - i * 0.015})`;
            ctx.beginPath();
            ctx.arc(centerX, 80, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2 + this.time * 0.5;
            const dist = 150 + Math.sin(this.time * 3 + i) * 30;
            const x = centerX + Math.cos(angle) * dist;
            const y = 80 + Math.sin(angle) * dist * 0.5;
            
            ctx.fillStyle = `rgba(255, 215, 0, ${0.3 + Math.sin(this.time * 4 + i) * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        
        this.drawCombatBackground(ctx, w, h, theme);
    },
    
    drawGameOverBackground(ctx, w, h, theme) {
        const centerX = w / 2;
        const centerY = h / 2;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, w / 2);
        gradient.addColorStop(0, 'rgba(40, 0, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        for (let i = 0; i < 10; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const size = 1 + Math.random() * 2;
            
            ctx.fillStyle = `rgba(100, 0, 0, ${0.1 + Math.random() * 0.2})`;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawVictoryBackground(ctx, w, h, theme) {
        const centerX = w / 2;
        const centerY = h / 2;
        
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, w / 2);
        gradient.addColorStop(0, 'rgba(50, 40, 0, 0.9)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        for (let i = 0; i < 5; i++) {
            const radius = 100 + i * 50 + Math.sin(this.time * 2 + i) * 20;
            ctx.fillStyle = `rgba(255, 215, 0, ${0.1 - i * 0.02})`;
            ctx.beginPath();
            ctx.arc(centerX, centerY - 50, radius, 0, Math.PI * 2);
            ctx.fill();
        }
        
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2 + this.time * 0.3;
            const dist = 100 + Math.sin(this.time * 2 + i * 0.5) * 50;
            const x = centerX + Math.cos(angle) * dist;
            const y = centerY - 50 + Math.sin(angle) * dist * 0.6;
            
            ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(this.time * 5 + i) * 0.3})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    
    drawDefaultBackground(ctx, w, h, theme) {
        this.drawStonePillars(ctx, w, h, theme, 6);
    },
    
    drawStonePillars(ctx, w, h, theme, count) {
        const pillarWidth = 50;
        const spacing = w / (count + 1);
        
        for (let i = 1; i <= count; i++) {
            const x = spacing * i - pillarWidth / 2;
            
            ctx.fillStyle = theme.colors.accent;
            ctx.fillRect(x, 0, pillarWidth, h);
            
            ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.fillRect(x + pillarWidth - 10, 0, 10, h);
            
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            ctx.fillRect(x, 0, 5, h);
            
            for (let y = 0; y < h; y += 80) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                ctx.fillRect(x, y, pillarWidth, 3);
            }
        }
    },
    
    drawRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    }
};
