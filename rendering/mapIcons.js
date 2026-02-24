const MapIcons = {
    draw(ctx, type, x, y, size, options = {}) {
        const scale = size / 30;
        const theme = THEMES.getNodeTheme(type);
        
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        if (options.glow) {
            ctx.shadowColor = theme.glowColor;
            ctx.shadowBlur = 10;
        }
        
        switch (type) {
            case 'battle':
                this.drawSword(ctx, theme.color, options.visited);
                break;
            case 'elite':
                this.drawSkull(ctx, theme.color, options.visited);
                break;
            case 'boss':
                this.drawDemon(ctx, theme.color, options.visited);
                break;
            case 'shop':
                this.drawCoin(ctx, theme.color, options.visited);
                break;
            case 'rest':
                this.drawCampfire(ctx, theme.color, options.visited);
                break;
            case 'event':
                this.drawQuestion(ctx, theme.color, options.visited);
                break;
            case 'treasure':
                this.drawChest(ctx, theme.color, options.visited);
                break;
            default:
                this.drawUnknown(ctx, '#666666');
        }
        
        ctx.restore();
    },
    
    drawSword(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        
        ctx.strokeStyle = visited ? '#666666' : color;
        ctx.fillStyle = visited ? '#444444' : this.lightenColor(color, 0.2);
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = alpha;
        
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(8, -4);
        ctx.lineTo(2, 2);
        ctx.lineTo(2, 8);
        ctx.lineTo(-2, 12);
        ctx.lineTo(-4, 10);
        ctx.lineTo(-2, 8);
        ctx.lineTo(-2, 2);
        ctx.lineTo(-8, -4);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#555555' : '#aaaaaa';
        ctx.fillRect(-1, -10, 2, 8);
        
        ctx.beginPath();
        ctx.arc(0, 10, 2, 0, Math.PI * 2);
        ctx.fillStyle = visited ? '#555555' : '#ffd700';
        ctx.fill();
    },
    
    drawSkull(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = visited ? '#444444' : '#ffffff';
        ctx.strokeStyle = visited ? '#666666' : color;
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(0, -2, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#333333' : '#000000';
        ctx.beginPath();
        ctx.ellipse(-4, -4, 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4, -4, 2.5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(-2, 2);
        ctx.lineTo(0, 4);
        ctx.lineTo(2, 2);
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#333333' : '#000000';
        ctx.fillRect(-6, 6, 3, 3);
        ctx.fillRect(-1, 6, 2, 3);
        ctx.fillRect(3, 6, 3, 3);
        
        ctx.fillStyle = visited ? '#555555' : '#ffd700';
        ctx.beginPath();
        ctx.arc(0, -12, 3, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawDemon(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = visited ? '#444444' : color;
        ctx.strokeStyle = visited ? '#666666' : this.lightenColor(color, 0.3);
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(-8, -8);
        ctx.lineTo(-12, -14);
        ctx.lineTo(-6, -6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(8, -8);
        ctx.lineTo(12, -14);
        ctx.lineTo(6, -6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#333333' : '#ff0000';
        ctx.beginPath();
        ctx.ellipse(-4, -2, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(4, -2, 2, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = visited ? '#555555' : '#ff4444';
        ctx.beginPath();
        ctx.moveTo(-3, 4);
        ctx.lineTo(0, 8);
        ctx.lineTo(3, 4);
        ctx.closePath();
        ctx.fill();
    },
    
    drawCoin(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createRadialGradient(-3, -3, 0, 0, 0, 12);
        if (visited) {
            gradient.addColorStop(0, '#666666');
            gradient.addColorStop(1, '#444444');
        } else {
            gradient.addColorStop(0, '#ffee88');
            gradient.addColorStop(0.5, '#ffd700');
            gradient.addColorStop(1, '#cc9900');
        }
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = visited ? '#555555' : '#aa8800';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.strokeStyle = visited ? '#777777' : '#ffee44';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, 7, -Math.PI * 0.7, Math.PI * 0.3);
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#555555' : '#aa8800';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$', 0, 1);
    },
    
    drawCampfire(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = visited ? '#333333' : '#8b4513';
        ctx.fillRect(-8, 6, 4, 6);
        ctx.fillRect(4, 6, 4, 6);
        
        if (!visited) {
            const fireColors = ['#ff2200', '#ff4400', '#ff6600', '#ffaa00'];
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = fireColors[i];
                ctx.beginPath();
                const offset = Math.sin(i * 0.5) * 2;
                ctx.moveTo(offset, 8 - i * 2);
                ctx.quadraticCurveTo(-6 + i, -4 - i * 2, offset, -8 - i);
                ctx.quadraticCurveTo(6 - i, -4 - i * 2, offset, 8 - i * 2);
                ctx.fill();
            }
        } else {
            ctx.fillStyle = '#555555';
            ctx.beginPath();
            ctx.moveTo(0, 6);
            ctx.quadraticCurveTo(-4, 0, 0, -4);
            ctx.quadraticCurveTo(4, 0, 0, 6);
            ctx.fill();
        }
        
        ctx.strokeStyle = visited ? '#444444' : '#ffd700';
        ctx.lineWidth = 1;
        ctx.globalAlpha = alpha * 0.5;
        for (let i = 0; i < 3; i++) {
            ctx.beginPath();
            ctx.arc(0, -2, 12 + i * 4, 0, Math.PI * 2);
        }
        ctx.stroke();
    },
    
    drawQuestion(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = visited ? '#333333' : color;
        ctx.strokeStyle = visited ? '#555555' : this.lightenColor(color, 0.3);
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#666666' : '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 1);
        
        if (!visited) {
            ctx.strokeStyle = this.lightenColor(color, 0.5);
            ctx.lineWidth = 1;
            ctx.setLineDash([2, 2]);
            ctx.beginPath();
            ctx.arc(0, 0, 13, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    },
    
    drawChest(ctx, color, visited = false) {
        const alpha = visited ? 0.5 : 1;
        ctx.globalAlpha = alpha;
        
        ctx.fillStyle = visited ? '#333333' : '#8b4513';
        ctx.strokeStyle = visited ? '#555555' : '#5a2d0a';
        ctx.lineWidth = 2;
        
        this.drawRoundedRect(ctx, -10, -4, 20, 12, 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#444444' : '#6b3510';
        this.drawRoundedRect(ctx, -10, -8, 20, 6, 2);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = visited ? '#555555' : '#ffd700';
        this.drawRoundedRect(ctx, -3, -6, 6, 8, 1);
        ctx.fill();
        
        ctx.fillStyle = visited ? '#333333' : '#cc9900';
        ctx.beginPath();
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        
        if (!visited) {
            ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
            ctx.beginPath();
            ctx.moveTo(-8, -8);
            ctx.lineTo(-12, -14);
            ctx.lineTo(-6, -8);
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(8, -8);
            ctx.lineTo(12, -14);
            ctx.lineTo(6, -8);
            ctx.fill();
        }
    },
    
    drawUnknown(ctx, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 1);
    },
    
    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.round(255 * amount));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.round(255 * amount));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.round(255 * amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    },
    
    drawNodeGlow(ctx, x, y, size, color, intensity = 1) {
        const gradient = ctx.createRadialGradient(x, y, size * 0.5, x, y, size * 1.5);
        gradient.addColorStop(0, color.replace(')', `, ${0.3 * intensity})`).replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ', 0)').replace('rgb', 'rgba'));
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, size * 1.5, 0, Math.PI * 2);
        ctx.fill();
    },
    
    drawPulseRing(ctx, x, y, size, color, time) {
        const pulse = (Math.sin(time * 3) + 1) / 2;
        const ringSize = size * (1 + pulse * 0.3);
        
        ctx.strokeStyle = color.replace(')', `, ${0.5 - pulse * 0.3})`).replace('rgb', 'rgba');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(x, y, ringSize, 0, Math.PI * 2);
        ctx.stroke();
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
