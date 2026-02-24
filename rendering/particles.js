const Particles = {
    ambient: [],
    action: [],
    time: 0,
    maxAmbient: 100,
    maxAction: 50,
    
    update(deltaTime) {
        this.time += deltaTime * 0.001;
        
        for (let i = this.ambient.length - 1; i >= 0; i--) {
            const p = this.ambient[i];
            p.update(deltaTime);
            if (p.isDead()) {
                this.ambient.splice(i, 1);
            }
        }
        
        for (let i = this.action.length - 1; i >= 0; i--) {
            const p = this.action[i];
            p.update(deltaTime);
            if (p.isDead()) {
                this.action.splice(i, 1);
            }
        }
    },
    
    draw(ctx, w, h) {
        for (const p of this.ambient) {
            p.draw(ctx);
        }
        
        for (const p of this.action) {
            p.draw(ctx);
        }
    },
    
    spawnAmbient(type, w, h, density = 0.3) {
        const count = Math.floor(this.maxAmbient * density);
        const deficit = count - this.ambient.length;
        
        for (let i = 0; i < deficit && this.ambient.length < this.maxAmbient; i++) {
            const particle = this.createAmbientParticle(type, w, h);
            if (particle) this.ambient.push(particle);
        }
    },
    
    createAmbientParticle(type, w, h) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        
        switch (type) {
            case 'dust':
                return new DustParticle(x, y, w, h);
            case 'ember':
                return new EmberParticle(x, y, w, h);
            case 'leaf':
                return new LeafParticle(x, y, w, h);
            case 'spore':
                return new SporeParticle(x, y, w, h);
            case 'fire':
                return new FireParticle(x, y, w, h);
            case 'ash':
                return new AshParticle(x, y, w, h);
            case 'sparkle':
                return new SparkleParticle(x, y, w, h);
            case 'mist':
                return new MistParticle(x, y, w, h);
            case 'gold':
                return new GoldParticle(x, y, w, h);
            case 'spark':
                return new SparkParticle(x, y, w, h);
            default:
                return new DustParticle(x, y, w, h);
        }
    },
    
    spawnDamage(x, y, value, isHeal = false) {
        if (this.action.length >= this.maxAction) return;
        this.action.push(new DamageNumber(x, y, value, isHeal));
    },
    
    spawnBlock(x, y, value) {
        if (this.action.length >= this.maxAction) return;
        this.action.push(new BlockNumber(x, y, value));
    },
    
    spawnHeal(x, y, value) {
        if (this.action.length >= this.maxAction) return;
        this.action.push(new HealEffect(x, y, value));
    },
    
    spawnGold(x, y, value) {
        if (this.action.length >= this.maxAction) return;
        this.action.push(new GoldGainEffect(x, y, value));
    },
    
    spawnStatusApply(x, y, status, value) {
        if (this.action.length >= this.maxAction) return;
        this.action.push(new StatusApplyEffect(x, y, status, value));
    },
    
    spawnCardDraw(x, y) {
        for (let i = 0; i < 5; i++) {
            if (this.action.length >= this.maxAction) break;
            this.action.push(new CardDrawParticle(x + Math.random() * 20 - 10, y));
        }
    },
    
    spawnDeath(x, y) {
        for (let i = 0; i < 20; i++) {
            if (this.action.length >= this.maxAction) break;
            this.action.push(new DeathParticle(x, y));
        }
    },
    
    spawnVictory(x, y) {
        for (let i = 0; i < 30; i++) {
            if (this.action.length >= this.maxAction) break;
            this.action.push(new VictoryParticle(x, y));
        }
    },
    
    clear() {
        this.ambient = [];
        this.action = [];
    },
    
    setAmbientType(type, w, h, density) {
        this.ambient = [];
        this.spawnAmbient(type, w, h, density);
    }
};

class Particle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.life = 1;
        this.maxLife = 1;
        this.vx = 0;
        this.vy = 0;
    }
    
    update(deltaTime) {
        this.x += this.vx * deltaTime * 0.001;
        this.y += this.vy * deltaTime * 0.001;
        this.life -= deltaTime * 0.001 / this.maxLife;
    }
    
    isDead() {
        return this.life <= 0;
    }
    
    draw(ctx) {}
}

class DustParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 1 + Math.random() * 2;
        this.maxLife = 5 + Math.random() * 5;
        this.life = this.maxLife;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = -5 - Math.random() * 10;
        this.alpha = 0.2 + Math.random() * 0.3;
        this.drift = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.drift += deltaTime * 0.002;
        this.x += Math.sin(this.drift) * 0.5;
        
        if (this.y < 0) {
            this.y = this.h;
            this.x = Math.random() * this.w;
        }
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(200, 180, 150, ${this.alpha * this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class EmberParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 1 + Math.random() * 2;
        this.maxLife = 2 + Math.random() * 3;
        this.life = this.maxLife;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = -30 - Math.random() * 30;
        this.hue = Math.random() * 60;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.vx += (Math.random() - 0.5) * 5;
        
        if (this.y < 0) {
            this.y = this.h;
            this.x = Math.random() * this.w;
        }
    }
    
    draw(ctx) {
        const r = 255;
        const g = Math.floor(100 + this.hue);
        const b = 0;
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
    }
}

class LeafParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 3 + Math.random() * 4;
        this.maxLife = 8 + Math.random() * 4;
        this.life = this.maxLife;
        this.vx = 10 + Math.random() * 20;
        this.vy = 20 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 3;
        this.color = Math.random() > 0.5 ? '#4a8a4a' : '#6aaa4a';
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.rotation += this.rotSpeed * deltaTime * 0.001;
        this.vx += Math.sin(Particles.time + this.x * 0.01) * 0.5;
        
        if (this.x > this.w) this.x = 0;
        if (this.y > this.h) {
            this.y = 0;
            this.x = Math.random() * this.w;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.life * 0.7;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class SporeParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 2 + Math.random() * 3;
        this.maxLife = 6 + Math.random() * 4;
        this.life = this.maxLife;
        this.vx = (Math.random() - 0.5) * 15;
        this.vy = -10 - Math.random() * 10;
        this.pulse = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.pulse += deltaTime * 0.003;
        this.vx += Math.sin(this.pulse) * 0.3;
        
        if (this.y < 0) {
            this.y = this.h;
            this.x = Math.random() * this.w;
        }
    }
    
    draw(ctx) {
        const pulseSize = this.size * (1 + Math.sin(this.pulse) * 0.3);
        ctx.fillStyle = `rgba(100, 200, 100, ${this.life * 0.4})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, pulseSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

class FireParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 2 + Math.random() * 4;
        this.maxLife = 1 + Math.random() * 2;
        this.life = this.maxLife;
        this.vx = (Math.random() - 0.5) * 30;
        this.vy = -50 - Math.random() * 50;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        if (this.y < 0) {
            this.y = this.h;
            this.x = Math.random() * this.w;
        }
    }
    
    draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2);
        gradient.addColorStop(0, `rgba(255, 255, 100, ${this.life})`);
        gradient.addColorStop(0.5, `rgba(255, 100, 0, ${this.life * 0.7})`);
        gradient.addColorStop(1, `rgba(255, 0, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class AshParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 1 + Math.random() * 2;
        this.maxLife = 5 + Math.random() * 5;
        this.life = this.maxLife;
        this.vx = (Math.random() - 0.5) * 20;
        this.vy = 10 + Math.random() * 20;
        this.rotation = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.rotation += deltaTime * 0.001;
        
        if (this.y > this.h) {
            this.y = 0;
            this.x = Math.random() * this.w;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(100, 100, 100, ${this.life * 0.5})`;
        ctx.fillRect(-this.size, -this.size * 0.5, this.size * 2, this.size);
        ctx.restore();
    }
}

class SparkleParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 1 + Math.random() * 2;
        this.maxLife = 2 + Math.random() * 3;
        this.life = this.maxLife;
        this.vx = 0;
        this.vy = 0;
        this.twinkle = Math.random() * Math.PI * 2;
        this.twinkleSpeed = 2 + Math.random() * 3;
    }
    
    update(deltaTime) {
        this.life -= deltaTime * 0.001 / this.maxLife;
        this.twinkle += deltaTime * 0.001 * this.twinkleSpeed;
        
        if (this.life <= 0) {
            this.x = Math.random() * this.w;
            this.y = Math.random() * this.h;
            this.life = this.maxLife;
        }
    }
    
    draw(ctx) {
        const alpha = (0.5 + Math.sin(this.twinkle) * 0.5) * this.life;
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 2, this.y);
        ctx.lineTo(this.x + this.size * 2, this.y);
        ctx.moveTo(this.x, this.y - this.size * 2);
        ctx.lineTo(this.x, this.y + this.size * 2);
        ctx.stroke();
    }
}

class MistParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 30 + Math.random() * 50;
        this.maxLife = 10 + Math.random() * 10;
        this.life = this.maxLife;
        this.vx = 5 + Math.random() * 10;
        this.vy = (Math.random() - 0.5) * 5;
        this.alpha = 0.1 + Math.random() * 0.2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        if (this.x > this.w + this.size) {
            this.x = -this.size;
            this.y = Math.random() * this.h;
        }
    }
    
    draw(ctx) {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(150, 130, 180, ${this.alpha * this.life})`);
        gradient.addColorStop(1, `rgba(150, 130, 180, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class GoldParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 2 + Math.random() * 3;
        this.maxLife = 3 + Math.random() * 2;
        this.life = this.maxLife;
        this.vx = (Math.random() - 0.5) * 30;
        this.vy = -20 - Math.random() * 30;
        this.shimmer = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.vy += 20 * deltaTime * 0.001;
        this.shimmer += deltaTime * 0.005;
        
        if (this.y > this.h) {
            this.y = 0;
            this.x = Math.random() * this.w;
            this.vy = -20 - Math.random() * 30;
        }
    }
    
    draw(ctx) {
        const shimmer = 0.7 + Math.sin(this.shimmer) * 0.3;
        ctx.fillStyle = `rgba(255, 215, 0, ${this.life * shimmer})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = `rgba(255, 255, 150, ${this.life * shimmer * 0.5})`;
        ctx.beginPath();
        ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
    }
}

class SparkParticle extends Particle {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.size = 1 + Math.random() * 2;
        this.maxLife = 0.5 + Math.random() * 0.5;
        this.life = this.maxLife;
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 100;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.vx *= 0.95;
        this.vy *= 0.95;
    }
    
    draw(ctx) {
        ctx.fillStyle = `rgba(255, 200, 100, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * this.life, 0, Math.PI * 2);
        ctx.fill();
    }
}

class DamageNumber extends Particle {
    constructor(x, y, value, isHeal = false) {
        super(x, y, 0, 0);
        this.value = value;
        this.isHeal = isHeal;
        this.size = isHeal ? 20 : 24;
        this.maxLife = 1.5;
        this.life = this.maxLife;
        this.vx = 0;
        this.vy = -60;
        this.shake = 5;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.shake *= 0.95;
    }
    
    draw(ctx) {
        const shakeX = (Math.random() - 0.5) * this.shake;
        const alpha = Math.min(1, this.life * 2);
        
        ctx.save();
        ctx.font = `bold ${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        if (this.isHeal) {
            ctx.fillStyle = `rgba(100, 255, 100, ${alpha})`;
            ctx.strokeStyle = `rgba(0, 100, 0, ${alpha})`;
        } else {
            ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
            ctx.strokeStyle = `rgba(100, 0, 0, ${alpha})`;
        }
        
        ctx.lineWidth = 3;
        const text = this.isHeal ? `+${this.value}` : `-${this.value}`;
        ctx.strokeText(text, this.x + shakeX, this.y);
        ctx.fillText(text, this.x + shakeX, this.y);
        ctx.restore();
    }
}

class BlockNumber extends Particle {
    constructor(x, y, value) {
        super(x, y, 0, 0);
        this.value = value;
        this.size = 18;
        this.maxLife = 1.2;
        this.life = this.maxLife;
        this.vx = 0;
        this.vy = -40;
    }
    
    draw(ctx) {
        const alpha = Math.min(1, this.life * 2);
        
        ctx.save();
        ctx.font = `bold ${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = `rgba(100, 150, 255, ${alpha})`;
        ctx.strokeStyle = `rgba(50, 75, 127, ${alpha})`;
        ctx.lineWidth = 2;
        const text = `+${this.value} Block`;
        ctx.strokeText(text, this.x, this.y);
        ctx.fillText(text, this.x, this.y);
        ctx.restore();
    }
}

class HealEffect extends Particle {
    constructor(x, y, value) {
        super(x, y, 0, 0);
        this.value = value;
        this.particles = [];
        
        for (let i = 0; i < 8; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 40,
                vy: -30 - Math.random() * 30,
                size: 3 + Math.random() * 3,
                life: 1
            });
        }
        
        this.maxLife = 1;
        this.life = this.maxLife;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        for (const p of this.particles) {
            p.x += p.vx * deltaTime * 0.001;
            p.y += p.vy * deltaTime * 0.001;
            p.vy += 20 * deltaTime * 0.001;
            p.life -= deltaTime * 0.001;
        }
    }
    
    draw(ctx) {
        for (const p of this.particles) {
            if (p.life <= 0) continue;
            
            ctx.fillStyle = `rgba(100, 255, 100, ${p.life * 0.7})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

class GoldGainEffect extends Particle {
    constructor(x, y, value) {
        super(x, y, 0, 0);
        this.value = value;
        this.size = 22;
        this.maxLife = 2;
        this.life = this.maxLife;
        this.vx = 0;
        this.vy = -50;
        this.coins = [];
        
        for (let i = 0; i < 5; i++) {
            this.coins.push({
                x: x + (Math.random() - 0.5) * 30,
                y: y,
                vy: -80 - Math.random() * 40,
                vx: (Math.random() - 0.5) * 60,
                rotation: Math.random() * Math.PI * 2
            });
        }
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        for (const c of this.coins) {
            c.x += c.vx * deltaTime * 0.001;
            c.y += c.vy * deltaTime * 0.001;
            c.vy += 100 * deltaTime * 0.001;
            c.rotation += deltaTime * 0.003;
        }
    }
    
    draw(ctx) {
        const alpha = Math.min(1, this.life * 1.5);
        
        for (const c of this.coins) {
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
            ctx.beginPath();
            ctx.ellipse(0, 0, 6, 6 * Math.abs(Math.cos(c.rotation)), 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        
        ctx.save();
        ctx.font = `bold ${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = `rgba(255, 215, 0, ${alpha})`;
        ctx.strokeStyle = `rgba(127, 107, 0, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.strokeText(`+${this.value}`, this.x, this.y);
        ctx.fillText(`+${this.value}`, this.x, this.y);
        ctx.restore();
    }
}

class StatusApplyEffect extends Particle {
    constructor(x, y, status, value) {
        super(x, y, 0, 0);
        this.status = status;
        this.value = value;
        this.size = 16;
        this.maxLife = 1.5;
        this.life = this.maxLife;
        this.vx = 0;
        this.vy = -30;
    }
    
    draw(ctx) {
        const alpha = Math.min(1, this.life * 2);
        let color = '#ffffff';
        let icon = '';
        
        switch (this.status) {
            case 'poison': color = '#00ff00'; icon = '☠'; break;
            case 'weak': color = '#ffaa00'; icon = 'W'; break;
            case 'vulnerable': color = '#ff6347'; icon = 'V'; break;
            case 'strength': color = '#ff0000'; icon = '↑'; break;
            case 'dexterity': color = '#00ff00'; icon = '↑'; break;
            case 'bleed': color = '#ff4500'; icon = '💧'; break;
            case 'frail': color = '#87ceeb'; icon = 'F'; break;
        }
        
        ctx.save();
        ctx.font = `bold ${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillStyle = color.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
        ctx.globalAlpha = alpha;
        ctx.fillText(`${icon} ${this.status}: ${this.value}`, this.x, this.y);
        ctx.restore();
    }
}

class CardDrawParticle extends Particle {
    constructor(x, y) {
        super(x, y, 0, 0);
        this.size = 8;
        this.maxLife = 0.5;
        this.life = this.maxLife;
        this.vx = -100 + Math.random() * 50;
        this.vy = -50 + Math.random() * 100;
        this.rotation = Math.random() * Math.PI * 2;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.rotation += deltaTime * 0.005;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#4a4a6a';
        ctx.fillRect(-this.size / 2, -this.size, this.size, this.size * 1.5);
        ctx.strokeStyle = '#6a6a8a';
        ctx.lineWidth = 1;
        ctx.strokeRect(-this.size / 2, -this.size, this.size, this.size * 1.5);
        ctx.restore();
    }
}

class DeathParticle extends Particle {
    constructor(x, y) {
        super(x, y, 0, 0);
        this.size = 3 + Math.random() * 5;
        this.maxLife = 1 + Math.random() * 0.5;
        this.life = this.maxLife;
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 100;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 5;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.vy += 100 * deltaTime * 0.001;
        this.rotation += this.rotSpeed * deltaTime * 0.001;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.life;
        ctx.fillStyle = '#880000';
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
}

class VictoryParticle extends Particle {
    constructor(x, y) {
        super(x, y, 0, 0);
        this.size = 2 + Math.random() * 4;
        this.maxLife = 2 + Math.random() * 1;
        this.life = this.maxLife;
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
        const speed = 100 + Math.random() * 150;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.hue = Math.random() * 60;
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        this.vy += 50 * deltaTime * 0.001;
    }
    
    draw(ctx) {
        const r = 255;
        const g = Math.floor(200 + this.hue);
        const b = Math.floor(50 + this.hue);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${this.life})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}
