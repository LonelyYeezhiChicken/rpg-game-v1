import { levelEvents } from './level.events';

export class LevelService {
    private currentLevel: number;
    private currentXp: number;
    private xpForNextLevel: number;

    constructor(initialLevel: number = 1, initialXp: number = 0) {
        this.currentLevel = initialLevel;
        this.currentXp = initialXp;
        this.xpForNextLevel = this.calculateXpForNextLevel(initialLevel);
    }

    private calculateXpForNextLevel(level: number): number {
        // Simple example: 100 XP for level 1, then 50 more each level
        return 100 + (level - 1) * 50;
    }

    public addXp(amount: number): void {
        this.currentXp += amount;
        if (this.currentXp >= this.xpForNextLevel) {
            this.levelUp();
        }
        levelEvents.emit('xp-changed', this.currentXp, this.xpForNextLevel, this.currentLevel);
    }

    private levelUp(): void {
        this.currentLevel++;
        this.currentXp = this.currentXp - this.xpForNextLevel; // Carry over excess XP
        this.xpForNextLevel = this.calculateXpForNextLevel(this.currentLevel);
        levelEvents.emit('level-up', this.currentLevel);
        // If after level up, currentXp is still >= xpForNextLevel, level up again
        if (this.currentXp >= this.xpForNextLevel) {
            this.levelUp();
        }
    }

    public getLevel(): number {
        return this.currentLevel;
    }

    public getCurrentXp(): number {
        return this.currentXp;
    }

    public getXpForNextLevel(): number {
        return this.xpForNextLevel;
    }
}
