const Random = {
    int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    float(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    pick(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    pickMultiple(array, count) {
        const shuffled = this.shuffle(array);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    },
    
    shuffle(array) {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    },
    
    chance(percent) {
        return Math.random() < percent;
    },
    
    weighted(items) {
        const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
        let random = Math.random() * totalWeight;
        for (const item of items) {
            random -= (item.weight || 1);
            if (random <= 0) return item.value !== undefined ? item.value : item;
        }
        const last = items[items.length - 1];
        return last.value !== undefined ? last.value : last;
    }
};
