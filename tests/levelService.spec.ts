import { LevelService } from '../src/occupations/gameMechanics/level/levelService';
import { levelEvents } from '../src/occupations/gameMechanics/level/level.events';

describe('LevelService', () => {
    let levelService: LevelService;

    beforeEach(() => {
        levelService = new LevelService(); // Starts at level 1, 0 XP
    });

    it('should correctly initialize at level 1 with 0 XP', () => {
        expect(levelService.getLevel()).toBe(1);
        expect(levelService.getCurrentXp()).toBe(0);
        expect(levelService.getXpForNextLevel()).toBe(100);
    });

    it('should add XP and not level up if not enough XP', () => {
        levelService.addXp(50);
        expect(levelService.getLevel()).toBe(1);
        expect(levelService.getCurrentXp()).toBe(50);
        expect(levelService.getXpForNextLevel()).toBe(100);
    });

    it('should level up when enough XP is gained', () => {
        levelService.addXp(100);
        expect(levelService.getLevel()).toBe(2);
        expect(levelService.getCurrentXp()).toBe(0); // Excess XP carried over handled in levelUp
        expect(levelService.getXpForNextLevel()).toBe(150); // 100 + (2-1)*50
    });

    it('should carry over excess XP when leveling up', () => {
        levelService.addXp(120); // 100 to level up, 20 excess
        expect(levelService.getLevel()).toBe(2);
        expect(levelService.getCurrentXp()).toBe(20);
        expect(levelService.getXpForNextLevel()).toBe(150);
    });

    it('should level up multiple times if enough XP is gained', () => {
        levelService.addXp(100 + 150); // Enough for level 2 (100) and level 3 (150)
        expect(levelService.getLevel()).toBe(3);
        expect(levelService.getCurrentXp()).toBe(0);
        expect(levelService.getXpForNextLevel()).toBe(200); // 100 + (3-1)*50
    });

    it('should emit xp-changed event when XP is added', () => {
        const spy = jest.fn();
        levelEvents.on('xp-changed', spy);

        levelService.addXp(25);
        expect(spy).toHaveBeenCalledWith(25, 100, 1);
    });

    it('should emit level-up event when character levels up', () => {
        const spy = jest.fn();
        levelEvents.on('level-up', spy);

        levelService.addXp(100);
        expect(spy).toHaveBeenCalledWith(2);
    });
});
