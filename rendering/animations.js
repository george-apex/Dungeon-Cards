const Animations = {
    active: [],
    
    create(type, params) {
        const anim = {
            type,
            params,
            progress: 0,
            duration: params.duration || 500,
            startTime: Date.now(),
            complete: false,
            onUpdate: params.onUpdate || null,
            onComplete: params.onComplete || null
        };
        
        this.active.push(anim);
        return anim;
    },
    
    update() {
        const now = Date.now();
        
        this.active = this.active.filter(anim => {
            const elapsed = now - anim.startTime;
            anim.progress = Math.min(1, elapsed / anim.duration);
            
            if (anim.onUpdate) {
                anim.onUpdate(anim.progress, anim.params);
            }
            
            if (anim.progress >= 1) {
                anim.complete = true;
                if (anim.onComplete) {
                    anim.onComplete(anim.params);
                }
                return false;
            }
            
            return true;
        });
    },
    
    easeOutQuad(t) {
        return t * (2 - t);
    },
    
    easeInQuad(t) {
        return t * t;
    },
    
    easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    },
    
    easeOutBounce(t) {
        if (t < 1 / 2.75) {
            return 7.5625 * t * t;
        } else if (t < 2 / 2.75) {
            return 7.5625 * (t -= 1.5 / 2.75) * t + 0.75;
        } else if (t < 2.5 / 2.75) {
            return 7.5625 * (t -= 2.25 / 2.75) * t + 0.9375;
        } else {
            return 7.5625 * (t -= 2.625 / 2.75) * t + 0.984375;
        }
    },
    
    easeOutElastic(t) {
        if (t === 0 || t === 1) return t;
        return Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1;
    },
    
    cardDraw(card, startX, startY, endX, endY, callback) {
        return this.create('cardMove', {
            card,
            startX,
            startY,
            endX,
            endY,
            duration: 300,
            onComplete: callback
        });
    },
    
    cardPlay(card, startX, startY, endX, endY, callback) {
        return this.create('cardMove', {
            card,
            startX,
            startY,
            endX,
            endY,
            duration: 200,
            onComplete: callback
        });
    },
    
    cardDiscard(card, startX, startY, endX, endY, callback) {
        return this.create('cardMove', {
            card,
            startX,
            startY,
            endX,
            endY,
            duration: 250,
            onComplete: callback
        });
    },
    
    damageNumber(value, x, y, isPlayer = false) {
        return this.create('damageNumber', {
            value,
            x,
            y,
            startY: y,
            isPlayer,
            duration: 800
        });
    },
    
    healNumber(value, x, y) {
        return this.create('healNumber', {
            value,
            x,
            y,
            startY: y,
            duration: 800
        });
    },
    
    blockGain(value, x, y) {
        return this.create('blockNumber', {
            value,
            x,
            y,
            startY: y,
            duration: 600
        });
    },
    
    statusApply(status, value, x, y) {
        return this.create('statusApply', {
            status,
            value,
            x,
            y,
            startY: y,
            duration: 500
        });
    },
    
    screenShake(intensity = 5, duration = 200) {
        return this.create('screenShake', {
            intensity,
            originalX: 0,
            originalY: 0,
            duration
        });
    },
    
    fadeIn(duration = 500, callback = null) {
        return this.create('fadeIn', {
            opacity: 0,
            duration,
            onComplete: callback
        });
    },
    
    fadeOut(duration = 500, callback = null) {
        return this.create('fadeOut', {
            opacity: 1,
            duration,
            onComplete: callback
        });
    },
    
    flash(target, color = '#ffffff', duration = 200) {
        return this.create('flash', {
            target,
            color,
            duration
        });
    },
    
    projectile(startX, startY, endX, endY, color = '#ff0000', callback = null) {
        return this.create('projectile', {
            startX,
            startY,
            endX,
            endY,
            color,
            duration: 300,
            onComplete: callback
        });
    },
    
    particleBurst(x, y, count = 10, color = '#ff0000') {
        const particles = [];
        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speed = 2 + Math.random() * 3;
            particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1
            });
        }
        
        return this.create('particles', {
            particles,
            color,
            duration: 500
        });
    },
    
    render(ctx) {
        this.active.forEach(anim => {
            switch (anim.type) {
                case 'damageNumber':
                    this.renderDamageNumber(ctx, anim);
                    break;
                case 'healNumber':
                    this.renderHealNumber(ctx, anim);
                    break;
                case 'blockNumber':
                    this.renderBlockNumber(ctx, anim);
                    break;
                case 'statusApply':
                    this.renderStatusApply(ctx, anim);
                    break;
                case 'screenShake':
                    this.renderScreenShake(ctx, anim);
                    break;
                case 'fadeIn':
                case 'fadeOut':
                    this.renderFade(ctx, anim);
                    break;
                case 'projectile':
                    this.renderProjectile(ctx, anim);
                    break;
                case 'particles':
                    this.renderParticles(ctx, anim);
                    break;
            }
        });
    },
    
    renderDamageNumber(ctx, anim) {
        const p = anim.params;
        const t = this.easeOutQuad(anim.progress);
        
        const y = p.startY - 50 * t;
        const alpha = 1 - anim.progress;
        const scale = 1 + 0.5 * (1 - t);
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${Math.floor(24 * scale)}px Arial`;
        ctx.fillStyle = p.isPlayer ? '#ff4444' : '#ffcc00';
        ctx.textAlign = 'center';
        ctx.fillText(`-${p.value}`, p.x, y);
        ctx.restore();
    },
    
    renderHealNumber(ctx, anim) {
        const p = anim.params;
        const t = this.easeOutQuad(anim.progress);
        
        const y = p.startY - 40 * t;
        const alpha = 1 - anim.progress;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 20px Arial';
        ctx.fillStyle = '#44ff44';
        ctx.textAlign = 'center';
        ctx.fillText(`+${p.value}`, p.x, y);
        ctx.restore();
    },
    
    renderBlockNumber(ctx, anim) {
        const p = anim.params;
        const t = this.easeOutBounce(anim.progress);
        
        const y = p.startY - 30 * t;
        const alpha = 1 - anim.progress * 0.5;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 18px Arial';
        ctx.fillStyle = '#4488ff';
        ctx.textAlign = 'center';
        ctx.fillText(`+${p.value} Block`, p.x, y);
        ctx.restore();
    },
    
    renderStatusApply(ctx, anim) {
        const p = anim.params;
        const t = this.easeOutQuad(anim.progress);
        
        const y = p.startY - 35 * t;
        const alpha = 1 - anim.progress;
        
        const statusColors = {
            poison: '#00ff00',
            bleed: '#ff4500',
            weak: '#ffa500',
            vulnerable: '#ff6347',
            frail: '#87ceeb',
            strength: '#ff0000',
            dexterity: '#00ff00'
        };
        
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = statusColors[p.status] || '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`${p.status}: ${p.value}`, p.x, y);
        ctx.restore();
    },
    
    renderScreenShake(ctx, anim) {
        const p = anim.params;
        const intensity = p.intensity * (1 - anim.progress);
        
        ctx.save();
        ctx.translate(
            (Math.random() - 0.5) * intensity * 2,
            (Math.random() - 0.5) * intensity * 2
        );
        ctx.restore();
    },
    
    renderFade(ctx, anim) {
        const p = anim.params;
        const opacity = anim.type === 'fadeIn' 
            ? anim.progress 
            : 1 - anim.progress;
        
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.restore();
    },
    
    renderProjectile(ctx, anim) {
        const p = anim.params;
        const t = this.easeInOutQuad(anim.progress);
        
        const x = p.startX + (p.endX - p.startX) * t;
        const y = p.startY + (p.endY - p.startY) * t;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(x, y, 12, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '44';
        ctx.fill();
        ctx.restore();
    },
    
    renderParticles(ctx, anim) {
        const p = anim.params;
        const dt = 0.016;
        
        p.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1;
            particle.life -= dt;
            
            if (particle.life > 0) {
                ctx.save();
                ctx.globalAlpha = particle.life;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, 4, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.fill();
                ctx.restore();
            }
        });
    },
    
    clear() {
        this.active = [];
    },
    
    isAnimating() {
        return this.active.length > 0;
    }
};
