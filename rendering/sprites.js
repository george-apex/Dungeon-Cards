const COLORS = {
    dark1: '#1a1a2e',
    dark2: '#16213e',
    dark3: '#0f3460',
    dark4: '#1f1f1f',
    dark5: '#2d2d2d',
    dark6: '#3d3d3d',
    
    brown1: '#4a3728',
    brown2: '#5c4033',
    brown3: '#6b4423',
    brown4: '#8b5a2b',
    brown5: '#a0522d',
    brown6: '#cd853f',
    
    gray1: '#4a4a4a',
    gray2: '#5a5a5a',
    gray3: '#6a6a6a',
    gray4: '#7a7a7a',
    gray5: '#8a8a8a',
    gray6: '#9a9a9a',
    
    red1: '#8b0000',
    red2: '#a52a2a',
    red3: '#b22222',
    red4: '#cd5c5c',
    red5: '#dc143c',
    red6: '#ff4500',
    
    blue1: '#191970',
    blue2: '#000080',
    blue3: '#4169e1',
    blue4: '#6495ed',
    blue5: '#87ceeb',
    blue6: '#add8e6',
    
    green1: '#006400',
    green2: '#228b22',
    green3: '#2e8b57',
    green4: '#3cb371',
    green5: '#90ee90',
    green6: '#98fb98',
    
    gold1: '#b8860b',
    gold2: '#daa520',
    gold3: '#ffd700',
    gold4: '#ffec8b',
    gold5: '#fff8dc',
    gold6: '#ffffe0',
    
    purple1: '#4b0082',
    purple2: '#6a0dad',
    purple3: '#8b008b',
    purple4: '#9932cc',
    purple5: '#ba55d3',
    purple6: '#dda0dd',
    
    white1: '#c0c0c0',
    white2: '#d3d3d3',
    white3: '#e0e0e0',
    white4: '#f0f0f0',
    white5: '#f5f5f5',
    white6: '#ffffff'
};

const Sprites = {
    scale: 4,
    
    drawPixel(ctx, x, y, color, scale = this.scale) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, scale, scale);
    },
    
    drawRect(ctx, x, y, w, h, color, scale = this.scale) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w * scale, h * scale);
    },
    
    drawPlayer(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.dark2, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.dark2, s);
        this.drawRect(ctx, x + 2*s, y + 2*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 4*s, y + 2*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 6*s, y + 2*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 2*s, y + 3*s, 6, 1, c.dark1, s);
        this.drawRect(ctx, x + 3*s, y + 4*s, 4, 1, c.dark2, s);
        this.drawRect(ctx, x + 2*s, y + 5*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 6*s, y + 5*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 1*s, y + 6*s, 3, 1, c.brown1, s);
        this.drawRect(ctx, x + 6*s, y + 6*s, 3, 1, c.brown1, s);
        this.drawRect(ctx, x + 0*s, y + 7*s, 4, 1, c.brown1, s);
        this.drawRect(ctx, x + 6*s, y + 7*s, 4, 1, c.brown1, s);
        this.drawRect(ctx, x + 1*s, y + 8*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 4*s, y + 8*s, 2, 1, c.gray5, s);
        this.drawRect(ctx, x + 7*s, y + 8*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 1*s, y + 9*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 7*s, y + 9*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 2*s, y + 10*s, 1, 1, c.dark5, s);
        this.drawRect(ctx, x + 7*s, y + 10*s, 1, 1, c.dark5, s);
        this.drawRect(ctx, x + 1*s, y + 11*s, 2, 1, c.dark5, s);
        this.drawRect(ctx, x + 7*s, y + 11*s, 2, 1, c.dark5, s);
        this.drawRect(ctx, x + 1*s, y + 12*s, 2, 1, c.dark5, s);
        this.drawRect(ctx, x + 7*s, y + 12*s, 2, 1, c.dark5, s);
        this.drawRect(ctx, x + 2*s, y + 13*s, 1, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 13*s, 1, 1, c.dark4, s);
        this.drawRect(ctx, x + 2*s, y + 14*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 6*s, y + 14*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 3*s, y + 15*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 5*s, y + 15*s, 2, 1, c.dark4, s);
    },
    
    drawSlime(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.green3, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.green3, s);
        this.drawRect(ctx, x + 1*s, y + 2*s, 8, 1, c.green4, s);
        this.drawRect(ctx, x + 0*s, y + 3*s, 3, 1, c.green4, s);
        this.drawRect(ctx, x + 4*s, y + 3*s, 4, 1, c.green4, s);
        this.drawRect(ctx, x + 0*s, y + 4*s, 10, 1, c.green4, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 10, 1, c.green3, s);
        this.drawRect(ctx, x + 0*s, y + 6*s, 10, 1, c.green3, s);
        this.drawRect(ctx, x + 0*s, y + 7*s, 10, 1, c.green2, s);
        this.drawRect(ctx, x + 1*s, y + 8*s, 8, 1, c.green2, s);
        this.drawRect(ctx, x + 2*s, y + 9*s, 6, 1, c.green1, s);
    },
    
    drawSkeleton(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.white3, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 6*s, y + 1*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 1*s, y + 2*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 4*s, y + 2*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 7*s, y + 2*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 0*s, y + 3*s, 3, 1, c.dark1, s);
        this.drawRect(ctx, x + 4*s, y + 3*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 7*s, y + 3*s, 3, 1, c.dark1, s);
        this.drawRect(ctx, x + 1*s, y + 4*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 7*s, y + 4*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 3*s, y + 5*s, 4, 1, c.white3, s);
        this.drawRect(ctx, x + 3*s, y + 6*s, 1, 1, c.white3, s);
        this.drawRect(ctx, x + 6*s, y + 6*s, 1, 1, c.white3, s);
        this.drawRect(ctx, x + 3*s, y + 7*s, 1, 1, c.white3, s);
        this.drawRect(ctx, x + 6*s, y + 7*s, 1, 1, c.white3, s);
        this.drawRect(ctx, x + 2*s, y + 8*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 6*s, y + 8*s, 2, 1, c.white3, s);
    },
    
    drawGoblin(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 2*s, y + 0*s, 1, 1, c.green3, s);
        this.drawRect(ctx, x + 7*s, y + 0*s, 1, 1, c.green3, s);
        this.drawRect(ctx, x + 1*s, y + 1*s, 2, 1, c.green3, s);
        this.drawRect(ctx, x + 7*s, y + 1*s, 2, 1, c.green3, s);
        this.drawRect(ctx, x + 2*s, y + 2*s, 6, 1, c.green3, s);
        this.drawRect(ctx, x + 1*s, y + 3*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 4*s, y + 3*s, 2, 1, c.green4, s);
        this.drawRect(ctx, x + 7*s, y + 3*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 2*s, y + 4*s, 6, 1, c.green4, s);
        this.drawRect(ctx, x + 3*s, y + 5*s, 4, 1, c.green3, s);
        this.drawRect(ctx, x + 2*s, y + 6*s, 1, 1, c.brown1, s);
        this.drawRect(ctx, x + 7*s, y + 6*s, 1, 1, c.brown1, s);
        this.drawRect(ctx, x + 1*s, y + 7*s, 2, 1, c.brown1, s);
        this.drawRect(ctx, x + 7*s, y + 7*s, 2, 1, c.brown1, s);
    },
    
    drawCultist(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.red1, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.red1, s);
        this.drawRect(ctx, x + 1*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 4*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 7*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 0*s, y + 3*s, 10, 1, c.red2, s);
        this.drawRect(ctx, x + 0*s, y + 4*s, 10, 1, c.red2, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 10, 1, c.red1, s);
        this.drawRect(ctx, x + 1*s, y + 6*s, 2, 1, c.red1, s);
        this.drawRect(ctx, x + 7*s, y + 6*s, 2, 1, c.red1, s);
        this.drawRect(ctx, x + 1*s, y + 7*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 7*s, 2, 1, c.dark4, s);
    },
    
    drawRat(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 1*s, y + 0*s, 1, 1, c.brown3, s);
        this.drawRect(ctx, x + 1*s, y + 1*s, 2, 1, c.brown3, s);
        this.drawRect(ctx, x + 1*s, y + 2*s, 8, 1, c.brown4, s);
        this.drawRect(ctx, x + 0*s, y + 3*s, 3, 1, c.red5, s);
        this.drawRect(ctx, x + 4*s, y + 3*s, 4, 1, c.brown4, s);
        this.drawRect(ctx, x + 0*s, y + 4*s, 10, 1, c.brown3, s);
        this.drawRect(ctx, x + 1*s, y + 5*s, 8, 1, c.brown3, s);
        this.drawRect(ctx, x + 2*s, y + 6*s, 6, 1, c.brown2, s);
        this.drawRect(ctx, x + 3*s, y + 7*s, 4, 1, c.brown1, s);
    },
    
    drawWorm(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 0*s, y + 0*s, 2, 1, c.purple3, s);
        this.drawRect(ctx, x + 10*s, y + 0*s, 2, 1, c.purple3, s);
        this.drawRect(ctx, x + 1*s, y + 1*s, 2, 1, c.purple4, s);
        this.drawRect(ctx, x + 5*s, y + 1*s, 4, 1, c.purple4, s);
        this.drawRect(ctx, x + 11*s, y + 1*s, 2, 1, c.purple4, s);
        this.drawRect(ctx, x + 0*s, y + 2*s, 12, 1, c.purple4, s);
        this.drawRect(ctx, x + 0*s, y + 3*s, 12, 1, c.purple3, s);
        this.drawRect(ctx, x + 0*s, y + 4*s, 12, 1, c.purple3, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 12, 1, c.purple2, s);
        this.drawRect(ctx, x + 1*s, y + 6*s, 10, 1, c.purple2, s);
        this.drawRect(ctx, x + 2*s, y + 7*s, 8, 1, c.purple1, s);
    },
    
    drawImp(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 1, 1, c.red1, s);
        this.drawRect(ctx, x + 6*s, y + 0*s, 1, 1, c.red1, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.red2, s);
        this.drawRect(ctx, x + 2*s, y + 2*s, 2, 1, c.gold3, s);
        this.drawRect(ctx, x + 6*s, y + 2*s, 2, 1, c.gold3, s);
        this.drawRect(ctx, x + 2*s, y + 3*s, 6, 1, c.red3, s);
        this.drawRect(ctx, x + 3*s, y + 4*s, 4, 1, c.red2, s);
        this.drawRect(ctx, x + 2*s, y + 5*s, 6, 1, c.red1, s);
        this.drawRect(ctx, x + 1*s, y + 6*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 6*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 1*s, y + 7*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 7*s, 2, 1, c.dark4, s);
    },
    
    drawGolem(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 16; col++) {
                const isEdge = row === 0 || row === 15 || col === 0 || col === 15;
                const isInner = row > 2 && row < 13 && col > 2 && col < 13;
                const color = isEdge ? c.gray3 : (isInner ? c.gray5 : c.gray4);
                this.drawPixel(ctx, x + col*s, y + row*s, color, s);
            }
        }
        this.drawRect(ctx, x + 4*s, y + 4*s, 3, 1, c.green3, s);
        this.drawRect(ctx, x + 9*s, y + 4*s, 3, 1, c.green3, s);
        this.drawRect(ctx, x + 5*s, y + 10*s, 6, 2, c.dark4, s);
    },
    
    drawDarkKnight(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 4*s, y + 0*s, 4, 1, c.dark4, s);
        this.drawRect(ctx, x + 3*s, y + 1*s, 6, 1, c.dark4, s);
        this.drawRect(ctx, x + 3*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 7*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 2*s, y + 3*s, 8, 1, c.dark4, s);
        this.drawRect(ctx, x + 2*s, y + 4*s, 8, 1, c.dark5, s);
        this.drawRect(ctx, x + 1*s, y + 5*s, 10, 1, c.dark5, s);
        this.drawRect(ctx, x + 1*s, y + 6*s, 10, 1, c.dark4, s);
        this.drawRect(ctx, x + 2*s, y + 7*s, 8, 1, c.dark4, s);
        this.drawRect(ctx, x + 3*s, y + 8*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 8*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 3*s, y + 9*s, 2, 1, c.dark3, s);
        this.drawRect(ctx, x + 7*s, y + 9*s, 2, 1, c.dark3, s);
    },
    
    drawBats(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 1*s, y + 1*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 5*s, y + 1*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 9*s, y + 1*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 0*s, y + 2*s, 4, 1, c.dark1, s);
        this.drawRect(ctx, x + 4*s, y + 2*s, 4, 1, c.dark1, s);
        this.drawRect(ctx, x + 8*s, y + 2*s, 4, 1, c.dark1, s);
        this.drawRect(ctx, x + 1*s, y + 3*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 5*s, y + 3*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 9*s, y + 3*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 1*s, y + 4*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 5*s, y + 4*s, 2, 1, c.dark1, s);
        this.drawRect(ctx, x + 9*s, y + 4*s, 2, 1, c.dark1, s);
    },
    
    drawNecromancer(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.dark1, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.dark1, s);
        this.drawRect(ctx, x + 2*s, y + 2*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 6*s, y + 2*s, 2, 1, c.white3, s);
        this.drawRect(ctx, x + 2*s, y + 3*s, 6, 1, c.white4, s);
        this.drawRect(ctx, x + 0*s, y + 4*s, 10, 1, c.purple1, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 10, 1, c.purple2, s);
        this.drawRect(ctx, x + 0*s, y + 6*s, 10, 1, c.purple1, s);
        this.drawRect(ctx, x + 1*s, y + 7*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 7*s, 2, 1, c.dark4, s);
    },
    
    drawMimic(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 1*s, y + 0*s, 10, 1, c.brown4, s);
        this.drawRect(ctx, x + 0*s, y + 1*s, 12, 4, c.brown5, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 12, 1, c.brown4, s);
        this.drawRect(ctx, x + 2*s, y + 6*s, 3, 1, c.red5, s);
        this.drawRect(ctx, x + 7*s, y + 6*s, 3, 1, c.red5, s);
        this.drawRect(ctx, x + 3*s, y + 7*s, 2, 1, c.white6, s);
        this.drawRect(ctx, x + 7*s, y + 7*s, 2, 1, c.white6, s);
        this.drawRect(ctx, x + 4*s, y + 8*s, 4, 1, c.red5, s);
        this.drawRect(ctx, x + 3*s, y + 9*s, 6, 1, c.red3, s);
    },
    
    drawVampire(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 4*s, y + 0*s, 4, 1, c.dark1, s);
        this.drawRect(ctx, x + 3*s, y + 1*s, 6, 1, c.dark1, s);
        this.drawRect(ctx, x + 3*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 7*s, y + 2*s, 2, 1, c.red5, s);
        this.drawRect(ctx, x + 2*s, y + 3*s, 8, 1, c.white4, s);
        this.drawRect(ctx, x + 2*s, y + 4*s, 8, 1, c.white3, s);
        this.drawRect(ctx, x + 1*s, y + 5*s, 10, 1, c.dark1, s);
        this.drawRect(ctx, x + 0*s, y + 6*s, 12, 1, c.purple1, s);
        this.drawRect(ctx, x + 0*s, y + 7*s, 12, 1, c.purple2, s);
        this.drawRect(ctx, x + 1*s, y + 8*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 5*s, y + 8*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 9*s, y + 8*s, 2, 1, c.dark4, s);
    },
    
    drawAssassin(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.dark1, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.dark1, s);
        this.drawRect(ctx, x + 2*s, y + 2*s, 2, 1, c.purple5, s);
        this.drawRect(ctx, x + 6*s, y + 2*s, 2, 1, c.purple5, s);
        this.drawRect(ctx, x + 1*s, y + 3*s, 8, 1, c.dark1, s);
        this.drawRect(ctx, x + 1*s, y + 4*s, 8, 1, c.dark2, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 10, 1, c.dark2, s);
        this.drawRect(ctx, x + 0*s, y + 6*s, 10, 1, c.dark1, s);
        this.drawRect(ctx, x + 1*s, y + 7*s, 2, 1, c.dark4, s);
        this.drawRect(ctx, x + 7*s, y + 7*s, 2, 1, c.dark4, s);
    },
    
    drawTreant(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 16; row++) {
            for (let col = 0; col < 16; col++) {
                const isBark = (col < 3 || col > 12) || (row < 3);
                const isFace = row > 4 && row < 10 && col > 4 && col < 11;
                const color = isBark ? c.brown3 : (isFace ? c.brown5 : c.brown4);
                this.drawPixel(ctx, x + col*s, y + row*s, color, s);
            }
        }
        this.drawRect(ctx, x + 5*s, y + 5*s, 2, 1, c.green1, s);
        this.drawRect(ctx, x + 9*s, y + 5*s, 2, 1, c.green1, s);
        this.drawRect(ctx, x + 6*s, y + 8*s, 4, 1, c.dark4, s);
    },
    
    drawChaos(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 12; col++) {
                const isPurple = (row + col) % 3 === 0;
                const color = isPurple ? c.purple4 : c.dark1;
                this.drawPixel(ctx, x + (col + 2)*s, y + (row + 2)*s, color, s);
            }
        }
    },
    
    drawDeathKnight(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 4*s, y + 0*s, 4, 1, c.gray2, s);
        this.drawRect(ctx, x + 3*s, y + 1*s, 6, 1, c.gray2, s);
        this.drawRect(ctx, x + 3*s, y + 2*s, 2, 1, c.blue3, s);
        this.drawRect(ctx, x + 7*s, y + 2*s, 2, 1, c.blue3, s);
        this.drawRect(ctx, x + 2*s, y + 3*s, 8, 1, c.gray3, s);
        this.drawRect(ctx, x + 1*s, y + 4*s, 10, 1, c.dark4, s);
        this.drawRect(ctx, x + 0*s, y + 5*s, 12, 1, c.dark4, s);
        this.drawRect(ctx, x + 0*s, y + 6*s, 12, 1, c.dark5, s);
        this.drawRect(ctx, x + 0*s, y + 7*s, 12, 1, c.dark4, s);
        this.drawRect(ctx, x + 1*s, y + 8*s, 2, 1, c.gray2, s);
        this.drawRect(ctx, x + 5*s, y + 8*s, 2, 1, c.gray2, s);
        this.drawRect(ctx, x + 9*s, y + 8*s, 2, 1, c.gray2, s);
    },
    
    drawMindFlayer(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 4, 1, c.purple4, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 6, 1, c.purple4, s);
        this.drawRect(ctx, x + 1*s, y + 2*s, 2, 1, c.purple5, s);
        this.drawRect(ctx, x + 4*s, y + 2*s, 2, 1, c.purple5, s);
        this.drawRect(ctx, x + 7*s, y + 2*s, 2, 1, c.purple5, s);
        this.drawRect(ctx, x + 0*s, y + 3*s, 10, 1, c.purple3, s);
        this.drawRect(ctx, x + 0*s, y + 4*s, 10, 1, c.purple4, s);
        this.drawRect(ctx, x + 1*s, y + 5*s, 8, 1, c.purple3, s);
        this.drawRect(ctx, x + 2*s, y + 6*s, 2, 1, c.purple2, s);
        this.drawRect(ctx, x + 6*s, y + 6*s, 2, 1, c.purple2, s);
        this.drawRect(ctx, x + 2*s, y + 7*s, 2, 1, c.purple1, s);
        this.drawRect(ctx, x + 6*s, y + 7*s, 2, 1, c.purple1, s);
    },
    
    drawLichKing(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 24; row++) {
            for (let col = 0; col < 24; col++) {
                const isEdge = col < 2 || col > 21 || row < 2;
                const isRobe = row > 8 && col > 3 && col < 20;
                const isCrown = row < 4 && (col < 4 || col > 19);
                let color = c.dark1;
                if (isEdge) color = c.gray3;
                else if (isRobe) color = c.dark2;
                else if (isCrown) color = c.gold3;
                this.drawPixel(ctx, x + col*s, y + row*s, color, s);
            }
        }
        this.drawRect(ctx, x + 6*s, y + 4*s, 3, 1, c.blue3, s);
        this.drawRect(ctx, x + 15*s, y + 4*s, 3, 1, c.blue3, s);
        this.drawRect(ctx, x + 8*s, y + 8*s, 8, 2, c.dark4, s);
    },
    
    drawDragon(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 24; row++) {
            for (let col = 0; col < 32; col++) {
                const isBody = col > 4 && col < 28 && row > 4 && row < 20;
                const isWing = row < 8 && (col < 8 || col > 24);
                const isHead = col > 20 && row > 8 && row < 16;
                let color = null;
                if (isBody || isHead) color = c.red2;
                else if (isWing) color = c.red1;
                if (color) this.drawPixel(ctx, x + col*s, y + row*s, color, s);
            }
        }
        this.drawRect(ctx, x + 26*s, y + 10*s, 2, 1, c.gold3, s);
        this.drawRect(ctx, x + 30*s, y + 10*s, 2, 1, c.gold3, s);
    },
    
    drawDarkLord(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 24; row++) {
            for (let col = 0; col < 24; col++) {
                const isArmor = row > 4 && row < 20;
                const isCrown = row < 4;
                const isCape = col < 4 || col > 19;
                let color = c.dark1;
                if (isArmor && !isCape) color = c.dark4;
                else if (isCrown) color = c.gray2;
                else if (isCape) color = c.purple1;
                this.drawPixel(ctx, x + col*s, y + row*s, color, s);
            }
        }
        this.drawRect(ctx, x + 7*s, y + 5*s, 3, 1, c.red5, s);
        this.drawRect(ctx, x + 14*s, y + 5*s, 3, 1, c.red5, s);
    },
    
    drawShadowFiend(ctx, x, y, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        for (let row = 0; row < 12; row++) {
            for (let col = 0; col < 12; col++) {
                const isCore = col > 3 && col < 8 && row > 3 && row < 8;
                const color = isCore ? c.purple4 : c.dark1;
                this.drawPixel(ctx, x + col*s, y + row*s, color, s);
            }
        }
    },
    
    drawCard(ctx, x, y, card, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        let borderColor = c.gray3;
        let bgColor = c.dark5;
        let costColor = c.blue3;
        
        if (card.type === 'attack') {
            borderColor = c.red3;
            costColor = c.red4;
        } else if (card.type === 'defense') {
            borderColor = c.blue3;
            costColor = c.blue4;
        } else if (card.type === 'skill') {
            borderColor = c.green3;
            costColor = c.green4;
        } else if (card.type === 'curse') {
            borderColor = c.purple3;
            costColor = c.purple4;
        }
        
        this.drawRect(ctx, x, y, 30, 40, borderColor, s);
        this.drawRect(ctx, x + 1*s, y + 1*s, 28, 38, bgColor, s);
        
        this.drawRect(ctx, x + 2*s, y + 2*s, 6, 6, costColor, s);
        this.drawRect(ctx, x + 3*s, y + 3*s, 4, 4, bgColor, s);
        
        this.drawRect(ctx, x + 4*s, y + 10*s, 22, 14, c.dark4, s);
        
        this.drawRect(ctx, x + 2*s, y + 26*s, 26, 12, c.dark4, s);
    },
    
    drawRelic(ctx, x, y, relic, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        let color = c.gold3;
        if (relic && relic.rarity === 'uncommon') color = c.blue3;
        else if (relic && relic.rarity === 'rare') color = c.purple4;
        
        this.drawRect(ctx, x + 2*s, y + 0*s, 4, 1, color, s);
        this.drawRect(ctx, x + 1*s, y + 1*s, 6, 1, color, s);
        this.drawRect(ctx, x + 0*s, y + 2*s, 8, 4, color, s);
        this.drawRect(ctx, x + 1*s, y + 6*s, 6, 1, color, s);
        this.drawRect(ctx, x + 2*s, y + 7*s, 4, 1, color, s);
    },
    
    drawPotion(ctx, x, y, potion, scale = 1) {
        const s = scale;
        const c = COLORS;
        
        let color = c.red4;
        if (potion && potion.name) {
            if (potion.name.includes('Block')) color = c.blue4;
            else if (potion.name.includes('Energy')) color = c.gold3;
            else if (potion.name.includes('Strength')) color = c.red5;
            else if (potion.name.includes('Poison')) color = c.green3;
        }
        
        this.drawRect(ctx, x + 3*s, y + 0*s, 2, 1, c.gray4, s);
        this.drawRect(ctx, x + 2*s, y + 1*s, 4, 1, c.gray4, s);
        this.drawRect(ctx, x + 1*s, y + 2*s, 6, 1, c.white3, s);
        this.drawRect(ctx, x + 1*s, y + 3*s, 6, 4, color, s);
        this.drawRect(ctx, x + 2*s, y + 7*s, 4, 1, color, s);
        this.drawRect(ctx, x + 3*s, y + 8*s, 2, 1, color, s);
    },
    
    drawEnemy(ctx, enemy, x, y, scale = 1) {
        const spriteMap = {
            'Slime Cube': this.drawSlime,
            'Small Slime': this.drawSlime,
            'Skeleton Warrior': this.drawSkeleton,
            'Goblin Scout': this.drawGoblin,
            'Cultist': this.drawCultist,
            'Giant Rat': this.drawRat,
            'Jaw Worm': this.drawWorm,
            'Demon Imp': this.drawImp,
            'Stone Golem': this.drawGolem,
            'Dark Knight': this.drawDarkKnight,
            'Swarm of Bats': this.drawBats,
            'Necromancer': this.drawNecromancer,
            'Mimic': this.drawMimic,
            'Vampire Lord': this.drawVampire,
            'Bat': this.drawBats,
            'Shadow Assassin': this.drawAssassin,
            'Elder Treant': this.drawTreant,
            'Sapling': this.drawTreant,
            'Chaos Elemental': this.drawChaos,
            'Death Knight': this.drawDeathKnight,
            'Mind Flayer': this.drawMindFlayer,
            'The Lich King': this.drawLichKing,
            'The Dragon': this.drawDragon,
            'Dragon Whelp': this.drawImp,
            'The Dark Lord': this.drawDarkLord,
            'Shadow Fiend': this.drawShadowFiend
        };
        
        const drawFunc = spriteMap[enemy.name] || this.drawSlime;
        drawFunc.call(this, ctx, x, y, scale);
    }
};
