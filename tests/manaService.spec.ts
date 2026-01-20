import { ManaService } from '../src/occupations/gameMechanics/mana/manaService';
import { manaEvents } from '../src/occupations/gameMechanics/mana/mana.events';

describe('ManaService', () => {
    let manaService: ManaService;

    beforeEach(() => {
        manaService = new ManaService(100);
    });

    it('should correctly initialize with max mana', () => {
        expect(manaService.getMana()).toBe(100);
        expect(manaService.getMaxMana()).toBe(100);
    });

    it('should use mana and reduce mana points', () => {
        manaService.useMana(20);
        expect(manaService.getMana()).toBe(80);
    });

    it('should not use mana if not enough mana points', () => {
        const used = manaService.useMana(120);
        expect(used).toBe(false);
        expect(manaService.getMana()).toBe(100); // Mana should remain unchanged
    });

    it('should restore mana and increase mana points', () => {
        manaService.useMana(50);
        manaService.restoreMana(30);
        expect(manaService.getMana()).toBe(80);
    });

    it('should not allow mana to go above max mana', () => {
        manaService.useMana(20);
        manaService.restoreMana(50);
        expect(manaService.getMana()).toBe(100);
    });

    it('should emit an event when mana changes', () => {
        const spy = jest.fn();
        manaEvents.on('mana-changed', spy);

        manaService.useMana(10);
        expect(spy).toHaveBeenCalledWith(90, 100);

        manaService.restoreMana(5);
        expect(spy).toHaveBeenCalledWith(95, 100);
    });
});
